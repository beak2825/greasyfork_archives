// ==UserScript==
// @name            Shiki Anilibria
// @name:ru         Shiki Anilibria
// @namespace       shikiAnilibria
// @version         1.0.0
// @description     Adds original anilibria online player to the shikimori
// @description:ru  Добавляет возможность смотреть аниме онлайн в оригинальном плеере Анилибрии прямо на сайте shikimori
// @author          Blank
// @match           *://shikimori.one/*
// @match           *://shikimori.org/*
// @match           *://shikimori.me/*
// @run-at          document-end
// @grant           GM.xmlHttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/410663/Shiki%20Anilibria.user.js
// @updateURL https://update.greasyfork.org/scripts/410663/Shiki%20Anilibria.meta.js
// ==/UserScript==

// Notes:
// - fully compatible with shikiOtherAnime script
// - for autopause to work require videoShortcuts script (it handles 'pleasePauseVideo' postMessage)
// - videoShortcuts script is also recommended for watching boring moments at 1.25 - 16x speed ^_^

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
      ...details,
      onload(responseObject) {
        resolve(responseObject);
      },
      onerror(responseObject) {
        reject(responseObject);
      },
    });
  });

  const requestAnilibriaAPI = (title) => {
    const formData = new FormData();
    const data = {
      query: 'search',
      search: title,
      filter: 'id,names,code,series',
    };
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    return request({
      method: 'POST',
      url: 'https://www.anilibria.tv/public/api/index.php',
      data: formData,
    });
  };

  // sort by weight desc and title asc
  const sort = (results) => Object.values(results).sort((a, b) => {
    if (b.weight - a.weight) {
      return b.weight - a.weight;
    }
    return a.title.localeCompare(b.title);
  });

  // collect and weighing results from anilibria.tv
  const getAnilibriaResults = async ({ titles, utitle }) => {
    let rawResults;
    try {
      const reqPromises = titles.map((title) => requestAnilibriaAPI(title));
      rawResults = await Promise.all(reqPromises);
    } catch (er) {
      log('request error: anilibria.tv not available (blocking by censorship?)');
      return [];
    }
    const results = {};
    // results handling and weighing
    rawResults.forEach((res) => {
      if (res.status !== 200) {
        log('response error code:', res.status);
        return;
      }
      const { response } = res;
      if (!response.status) {
        log('some internal anilibria.tv error:', response);
        return;
      }
      response.data.forEach(({
        id, code, names, series,
      }) => {
        if (results[id]) {
          results[id].weight += 1; // for each duplicate result weight +1
        } else { // initial record
          let weight = 1;
          let exact = false;
          if (code === utitle) {
            weight += 9; // if titles in url complete match weight +9
            exact = true;
          } else if (utitle.includes(code) || code.includes(utitle)) {
            weight += 1; // if one title in url include other weight +1
          }
          if (titles[0] === names[0]) {
            weight += 5; // if local titles complete match weight +5
          } else if (titles[0].includes(names[0]) || names[0].includes(titles[0])) {
            weight += 1; // if one local title include other weight +1
          }
          if (titles[1] === names[1]) {
            weight += 5; // if official titles complete match weight +5
          } else if (titles[1].includes(names[1]) || names[1].includes(titles[1])) {
            weight += 1; // if one official title include other weight +1
          }
          results[id] = { // add new record
            id, title: names[0], code, series, weight, exact,
          };
        }
      });
    });
    return sort(results);
  };

  // collect titles from page
  const getTitles = () => {
    const titles = document.querySelector('.head>h1').textContent.split(' / ');
    const ogTitle = document.querySelector('head > meta[property = "og:title"]').content;
    if (!titles.includes(ogTitle)) titles.push(ogTitle);
    // ../animes/31964-boku-no-pico-academia => boku-no-pico-academia
    const utitle = document.URL.substring(document.URL.indexOf('-') + 1);
    return { titles, utitle };
  };

  const addEventListeners = ({ overlay, iframe, anilibria }) => {
    overlay.addEventListener('click', (e) => {
      if (e.target !== e.currentTarget) return;
      overlay.style.display = 'none';
      iframe.style.display = 'none';
      iframe.contentWindow.postMessage('pleasePauseVideo', '*');
    }, { passive: true });
    anilibria.addEventListener('click', () => {
      overlay.style.display = 'block';
      iframe.style.display = 'block';
    }, { passive: true });
  };

  const createElements = ({
    id, series, exact, code,
  }) => {
    let overlay = document.querySelector('#watch-online-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'watch-online-overlay';
      document.body.prepend(overlay);
    }
    let iframe = document.querySelector('#watch-online-iframe-alib');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'watch-online-iframe-alib';
      iframe.className = 'watch-online-iframe';
      iframe.src = `https://www.anilibria.tv/public/iframe.php?id=${id}`;
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
    let anilibria = document.querySelector('#watch-online-a-alib');
    if (!anilibria) {
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
      anilibria = document.createElement('a');
      anilibria.id = 'watch-online-a-alib';
      anilibria.className = 'b-link';
      anilibria.title = `Смотреть (точное совпадение ${exact ? '' : 'не '}найдено)`;
      anilibria.textContent = `Анилибрия${exact ? '*' : ''} [${series}]`;
      const aSite = document.createElement('a');
      aSite.className = 'b-link';
      aSite.target = '_blank';
      aSite.title = 'Смотреть на сайте Анилибрии';
      // aSite.href = `https://www.anilibria.tv/release/${code}.html`;
      aSite.href = `https://anilibria.top/anime/releases/release/${code}/episodes`;
      aSite.textContent = ' ↗ ';
      line.append(anilibria, aSite);
      block.append(line);
    }
    addEventListeners({ overlay, iframe, anilibria });
  };

  // change body handler
  const newAnimeShow = async () => {
    const overlay = document.querySelector('#watch-online-overlay');
    const iframe = document.querySelector('#watch-online-iframe-alib');
    const anilibria = document.querySelector('#watch-online-a-alib');
    if (overlay && iframe && anilibria) {
      addEventListeners({ overlay, iframe, anilibria });
      return;
    }
    const titlesAndUtitle = getTitles();
    const results = await getAnilibriaResults(titlesAndUtitle);
    if (results.length === 0) {
      log('anime not found on anilibria');
      return;
    }
    createElements(results[0]);
  };

  // observer fires when HTML changes its body
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutationRecord) => mutationRecord.addedNodes.forEach((node) => {
      if (node.classList.contains('p-animes-show')) newAnimeShow();
    }));
  });
  observer.observe(document.querySelector('html'), { childList: true });
  if (document.body.classList.contains('p-animes-show')) newAnimeShow();
}());
