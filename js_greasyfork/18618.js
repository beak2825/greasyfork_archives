// ==UserScript==
// @name        Don't Seizi "lazy"
// @namespace   https://github.com/segabito/
// @version      0.4.0
// @description  ランキング内の「社会・政治・時事」の動画を消すだけ
// @author       segabito macmoto
// @match        *://www.nicovideo.jp/ranking*
// @grant        none
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/18618/Don%27t%20Seizi%20%22lazy%22.user.js
// @updateURL https://update.greasyfork.org/scripts/18618/Don%27t%20Seizi%20%22lazy%22.meta.js
// ==/UserScript==
(function() {
  if (!document.body.classList.contains('MatrixRanking-body')) {
    return;
  }
 
 const css = `
  [data-genre-name="society_politics_news"] {
    visibility: hidden;
    pointer-events: none;
    user-select: none;
  }
  `;
  const addStyle = function(styles, id) {
    const elm = document.createElement('style');
    elm.type = 'text/css';
    if (id) { elm.id = id; }

    var text = styles.toString();
    text = document.createTextNode(text);
    elm.appendChild(text);
    document.documentElement.append(elm);
    return elm;
  };

  const dateToString = date => {
    if (typeof date === 'string') {
      const origDate = date;
      date = date.replace(/\//g, '-');
      // 時差とか考慮してない
      const m = /^(\d+-\d+-\d+) (\d+):(\d+):(\d+)/.exec(date);
      if (m) {
        date = new Date(m[1]);
        date.setHours(m[2]);
        date.setMinutes(m[3]);
        date.setSeconds(m[4]);
      } else {
        const t = Date.parse(date);
        if (isNaN(t)) {
          return origDate;
        }
        date = new Date(t);
      }
    } else if (typeof date === 'number') {
      date = new Date(date);
    }
    if (!date || isNaN(date.getTime())) {
      return '1970/01/01 00:00:00';
    }

    let [yy, mm, dd, h, m, s] = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ].map(n => n.toString().padStart(2, '0'));
    return `${yy}/${mm}/${dd} ${h}:${m}:${s}`;
  };

  const parseItem = item => {
    const id = item.querySelector('link').textContent.replace(/^.+\//, '');
    let watchId = id;
    const guid = item.querySelector('guid').textContent;
    const desc = new DOMParser().parseFromString(item.querySelector('description').textContent, 'text/html');
    const [min, sec] = desc.querySelector('.nico-info-length').textContent.split(':');
    const dt = guid.match(/,([\d]+-[\d]+-[\d]+):/)[1];
    const tm = desc.querySelector('.nico-info-date').textContent.replace(/[：]/g, ':').match(/([\d]+:[\d]+:[\d]+)/)[0];
    const date = new Date(`${dt} ${tm}`);
    const thumbnail_url = desc.querySelector('.nico-thumbnail img').src;
    const vm = thumbnail_url.match(/(\d+)\.(\d+)/);
    if (vm && /^\d+$/.test(id)) {
      watchId = `so${vm[1]}`;
    }

    const result = {
      _format: 'nicorss',
      id: watchId,
      uniq_id: id,
      title: item.querySelector('title').textContent,
      length_seconds: min * 60 + sec * 1,
      thumbnail_url,
      first_retrieve: dateToString(date),
      description: desc.querySelector('.nico-description').textContent
    };
    if (desc.querySelector('.nico-info-total-res')) {
      Object.assign(result, {
        num_res: parseInt(desc.querySelector('.nico-info-total-res').textContent.replace(/,/g, ''), 10),
        mylist_counter: parseInt(desc.querySelector('.nico-info-total-mylist').textContent.replace(/,/g, ''), 10),
        view_counter: parseInt(desc.querySelector('.nico-info-total-view').textContent.replace(/,/g, ''), 10)
      });
    }
    return result;
  };

  const load = url => {
    return fetch(url).then(r => r.text()).then(rssText => {
      const xml = new DOMParser().parseFromString(rssText, 'application/xml');
      const items = Array.from(xml.querySelectorAll('item')).map(i => parseItem(i));
      return {
        title: xml.querySelector('title').textContent,
        items
      }
    });
  };

  /**
    *
    * @param {string} genre
    * @param {'hour'|'24h'||'week'|'month'|'total'} term
    * @param {string} tag
    * @returns ItemData[]
    */
  const loadRanking = ({genre = 'all', term = 'hour', tag = ''}) => {
    const url = `https://www.nicovideo.jp/ranking/genre/${genre}?term=${term}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}&rss=2.0`;
    return load(url);
  };

  const itemPromise = loadRanking({genre: 'society_politics_news'});
  addStyle(css);

  const onload = async function() {
    const items = (await itemPromise).items;
    if (!items.length) {
      return;
    }
    const watchIds = items.map(item => item.id);


    const onItemInview = item => {
      const link = item.querySelector('.Card-link');
      const href = link.href;
      const match = href.match(/\watch\/([a-z0-9]+)/);
      if (match && watchIds.includes(match[1])) {
        item.dataset.genreName = 'society_politics_news';
        return true;
      }
      return false;
    };

    const intersectionObserver = new window.IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach(entry => {
        const item = entry.target;
        intersectionObserver.unobserve(item);
        onItemInview(item);
      });
    });


    const onUpdate = target => {
      const items = (target || document).querySelectorAll('.RankingBaseItem:not(.is-dsl-watching)');
      if (!items.length) { return; }
      Array.from(items).forEach(item => {
        item.classList.add('is-dsl-watching');
        if (!onItemInview(item)) {
          intersectionObserver.observe(item);
        }
      });
    };

    const mutationObserver = new window.MutationObserver(mutations => {
      if (mutations.some(mutation => mutation.addedNodes && mutation.addedNodes.length > 0)) {
        onUpdate(mutations.target);
      }
    });

    Array.from(document.querySelectorAll('.RankingMatrixVideosRow')).forEach(container => {
      mutationObserver.observe(container, {childList: true, characterData: false, attributes: false, subtree: false});
    });

    onUpdate();
  };

  window.addEventListener('DOMContentLoaded', onload);

})();
