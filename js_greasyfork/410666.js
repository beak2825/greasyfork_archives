// ==UserScript==
// @name            Shiki OtherAnime
// @name:ru         Shiki OtherAnime
// @namespace       shikiOtherAnime
// @version         1.0.0
// @description     Adds other external anime online player to the shikimori
// @description:ru  Добавляет возможность смотреть аниме в стороннем плеере в любой озвучке прямо на сайте shikimori
// @author          Blank
// @match           *://shikimori.one/*
// @match           *://shikimori.org/*
// @match           *://shikimori.me/*
// @run-at          document-end
// @grant           GM.xmlHttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/410666/Shiki%20OtherAnime.user.js
// @updateURL https://update.greasyfork.org/scripts/410666/Shiki%20OtherAnime.meta.js
// ==/UserScript==

// Notes:
// - fully compatible with shikiAnilibria script
// - autopause does not require videoShortcuts script (player handles postMessage itself)
// - videoShortcuts script is recommended for watching boring moments at 1.25 - 16x speed ^_^

(function main() {
  'use strict';

  const log = (...args) => console.log(`${GM.info.script.name}:`, ...args);
  log('start');

  if (!document.querySelector('#watch-online-style')) {
    const style = document.createElement('style');
    style.id = 'watch-online-style';
    style.textContent = `
.watch-online-iframe {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 45vw;
  z-index: 9001;
}
.watch-online-line {
  padding-bottom: 5px;
}
#watch-online-overlay {
  display: none;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9000;
  background: rgba(0, 0, 0, 0.85);
}`;
    document.querySelector('head').append(style);
  }

  // xmlHttpRequest
  const request = async (details) => new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: 'GET',
      responseType: 'json',
      anonymous: true,
      headers: { origin: 'https://amove.my.to' },
      ...details,
      onload(responseObject) {
        resolve(responseObject);
      },
      onerror(responseObject) {
        reject(responseObject);
      },
    });
  });

  const reduceResults = ({ results }, title, sId) => {
    let filteredResults;
    let exactMatch = true;
    if (sId) {
      filteredResults = results.filter((a) => a.shikimori_id === sId);
    } else {
      const prepare = (t) => t.toLowerCase().replace(/[ ,:'`]/g, '');
      const origTitle = prepare(title);
      filteredResults = results.filter((a) => prepare(a.title_orig) === origTitle);
      if (!filteredResults.length) {
        exactMatch = false;
        const firstTitle = prepare(results[0].title_orig);
        filteredResults = results.filter((a) => prepare(a.title_orig) === firstTitle);
      }
    }
    filteredResults.sort((a, b) => b.episodes_count - a.episodes_count);
    return { ...filteredResults[0], exactMatch };
  };

  const getOtherResults = async (ogTitle, sId) => {
    const apiUrl = 'https://api.andb.workers.dev/search';
    const url = `${apiUrl}?${sId ? `shikimori_id=${sId}` : `title=${encodeURI(ogTitle)}`}`;
    let res;
    try {
      res = await request({ url });
      if (res.status !== 200) {
        log(`response error code ${res.status}: ${url}`);
        return null;
      }
    } catch (er) {
      log(`request error: ${url}`);
      return null;
    }
    const { response } = res;
    if (!response || !response.total || !response.results || !response.results.length) {
      if (sId) {
        log(`not found by shikimori_id (${sId})`);
        if (ogTitle) return getOtherResults(ogTitle);
      } else {
        log(`not found by ogTitle (${ogTitle})`);
      }
      return null;
    }
    return reduceResults(response, ogTitle, sId);
  };

  const addEventListeners = ({ overlay, iframe, otherAnime }) => {
    overlay.addEventListener('click', (e) => {
      if (e.target !== e.currentTarget) return;
      overlay.style.display = 'none';
      iframe.style.display = 'none';
      iframe.contentWindow.postMessage({ key: 'kodik_player_api', value: { method: 'pause' } }, '*');
    }, { passive: true });
    otherAnime.addEventListener('click', () => {
      overlay.style.display = 'block';
      iframe.style.display = 'block';
    }, { passive: true });
  };

  const createElements = ({
    src, count, exact, id, sId,
  }) => {
    let overlay = document.querySelector('#watch-online-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'watch-online-overlay';
      document.body.prepend(overlay);
    }
    let iframe = document.querySelector('#watch-online-iframe-other');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'watch-online-iframe-other';
      iframe.className = 'watch-online-iframe';
      iframe.src = `${src}?translations=true`;
      iframe.allow = 'fullscreen';
      overlay.append(iframe);
    }
    const contestBlock = document.querySelector('.block.contest_winners');
    if (contestBlock) {
      let contestHeader = document.querySelector('#watch-online-contest-subheadline');
      if (!contestHeader) {
        contestHeader = document.createElement('div');
        contestHeader.id = 'watch-online-contest-subheadline';
        contestHeader.className = 'subheadline';
        contestHeader.textContent = 'Турниры';
        contestBlock.prepend(contestHeader);
      }
    }
    let otherAnime = document.querySelector('#watch-online-a-other');
    if (!otherAnime) {
      let block = document.querySelector('#watch-online-block');
      if (!block) {
        block = document.createElement('div');
        block.id = 'watch-online-block';
        block.className = 'block';
        const subheadline = document.createElement('div');
        subheadline.className = 'subheadline';
        subheadline.textContent = 'Онлайн просмотр';
        block.append(subheadline);
        const infoRight = document.querySelector('.c-info-right');
        const targetBlock = infoRight.querySelector('.block[itemprop="aggregateRating"]');
        if (targetBlock) targetBlock.after(block);
        else infoRight.prepend(block);
      }
      const line = document.createElement('div');
      line.className = 'watch-online-line';
      otherAnime = document.createElement('a');
      otherAnime.id = 'watch-online-a-other';
      otherAnime.className = 'b-link';
      otherAnime.title = `Смотреть (точное совпадение ${exact ? '' : 'не '}найдено)`;
      otherAnime.textContent = `Другой плеер${exact ? '*' : ''} [${count ? `1-${count}` : '1'}]`;
      const aSite = document.createElement('a');
      aSite.className = 'b-link';
      aSite.target = '_blank';
      aSite.title = 'Смотреть на сайте amove';
      aSite.href = `https://amove.my.to/#${sId ? `shikimori-${sId}&${id}` : id}`;
      aSite.textContent = ' ↗ ';
      line.append(otherAnime, aSite);
      block.append(line);
    }
    addEventListeners({ overlay, iframe, otherAnime });
  };

  // new anime handler
  const newAnimeShow = async () => {
    const overlay = document.querySelector('#watch-online-overlay');
    const iframe = document.querySelector('#watch-online-iframe-other');
    const otherAnime = document.querySelector('#watch-online-a-other');
    if (overlay && iframe && otherAnime) {
      addEventListeners({ overlay, iframe, otherAnime });
      return;
    }
    const ogTitle = document.querySelector('head > meta[property = "og:title"]').content;
    const rawId = document.URL.substring(document.URL.lastIndexOf('/') + 1, document.URL.indexOf('-'));
    const sId = Number.isNaN(+rawId[0]) ? rawId.substring(1) : rawId;
    const result = await getOtherResults(ogTitle, sId);
    if (!result) {
      log('other anime not found');
      return;
    }
    createElements({
      src: result.link,
      count: result.episodes_count,
      exact: result.exactMatch,
      id: result.id,
      sId: result.shikimori_id,
    });
  };

  // observer fire when html changes its body
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutationRecord) => mutationRecord.addedNodes.forEach((node) => {
      if (node.classList.contains('p-animes-show')) newAnimeShow();
    }));
  });
  observer.observe(document.querySelector('html'), { childList: true });
  if (document.body.classList.contains('p-animes-show')) newAnimeShow();
}());
