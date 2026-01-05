// ==UserScript==
// @name         Kitsu MangaDex Links
// @namespace    https://greasyfork.org/users/649
// @version      3.0.8
// @description  Adds MangaDex links to Kitsu manga pages
// @author       Adrien Pyke
// @match        *://kitsu.io/*
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/22888/Kitsu%20MangaDex%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/22888/Kitsu%20MangaDex%20Links.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const SCRIPT_NAME = 'Kitsu MangaDex Links';
  const REGEX = /^https?:\/\/kitsu\.io\/manga\/[^/]+\/?(?:\?.*)?$/u;

  const Util = {
    log(...args) {
      args.unshift(`%c${SCRIPT_NAME}:`, 'font-weight: bold;color: #233c7b;');
      console.log(...args);
    },
    q(query, context = document) {
      return context.querySelector(query);
    },
    qq(query, context = document) {
      return Array.from(context.querySelectorAll(query));
    },
    encodeQuery(query) {
      return encodeURIComponent(query.trim().replace(/\s+/gu, ' '));
    }
  };

  const App = {
    cache: {},
    getMangaDexPage(title, cb) {
      const self = this;
      if (self.cache[title]) {
        Util.log('Loading cached info');
        cb(self.cache[title]);
      } else {
        const url = `https://mangadex.org/quick_search/${Util.encodeQuery(
          title
        )}`;
        Util.log('Searching MangaDex:', url);
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          onload(response) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = response.responseText;

            const manga = Util.q('#search_manga .manga_title', tempDiv);
            if (manga) {
              manga.href = `https://mangadex.org${manga.getAttribute('href')}`;
              Util.log('Link:', manga.href);
              self.cache[title] = manga.href;
              cb(manga.href);
            } else {
              Util.log('No results found');
              self.cache[title] = null;
              cb(null);
            }
          },
          onerror() {
            Util.log('Error searching MangaDex');
          }
        });
      }
    }
  };

  waitForUrl(REGEX, () => {
    waitForElems({
      sel: '.media-sidebar',
      stop: true,
      onmatch(node) {
        const title = Util.q('.media--title h3');
        const url = location.href;
        App.getMangaDexPage(title.textContent, manga => {
          const check = Util.q('.where-to-watch-widget');
          if (!manga && check) check.remove();

          if (location.href === url && manga) {
            if (check) {
              const updateLink = Util.q('#mangadex-link');
              updateLink.href = manga;
            } else {
              const section = document.createElement('div');
              section.className = 'where-to-watch-widget';

              const header = document.createElement('span');
              header.className = 'where-to-watch-header';
              const headerText = document.createElement('span');
              headerText.textContent = 'Read Online';
              header.appendChild(headerText);
              section.appendChild(header);

              const listWrap = document.createElement('ul');
              listWrap.className = 'nav';
              const list = document.createElement('li');
              listWrap.appendChild(list);
              section.appendChild(listWrap);

              const link = document.createElement('a');
              link.id = 'mangadex-link';
              link.href = manga;
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              link.setAttribute('aria-label', 'MangaDex');
              link.className = 'hint--top hint--bounce hint--rounded';
              const img = document.createElement('img');
              img.src = 'https://mangadex.org/images/misc/navbar.svg';
              img.style.verticalAlign = 'text-bottom';
              link.appendChild(img);
              list.appendChild(link);

              node.appendChild(section);
            }
          }
        });
      }
    });
  });
})();
