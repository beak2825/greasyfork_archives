// ==UserScript==
// @name         BetterAnimeWorld
// @namespace    https://pizidavi.altervista.org/
// @icon         https://static.animeworld.so/assets/images/favicon/android-icon-192x192.png
// @description  Migliora AnimeWorld
// @author       pizidavi
// @version      1.8.3
// @copyright    2023, PIZIDAVI
// @license      MIT
// @require      https://cdn.jsdelivr.net/gh/soufianesakhi/node-creation-observer-js@edabdee1caaee6af701333a527a0afd95240aa3b/release/node-creation-observer-latest.min.js
// @require      https://greasyfork.org/scripts/453212-faviconbadger/code/FaviconBadger.js
// @match        https://www.animeworld.ac/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        window.onurlchange
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/395504/BetterAnimeWorld.user.js
// @updateURL https://update.greasyfork.org/scripts/395504/BetterAnimeWorld.meta.js
// ==/UserScript==

/* global NodeCreationObserver, Notify */

(function() {
  'use strict';

  const PAGE_TITLE = document.title;
  const PAGE_ANIME_TITLE = '{{title}} Ep. {{episode}} - AnimeWorld';
  const PAGE_ANIME_TITLE_NO_EP = '{{title}} - AnimeWorld';

  const ANIMEWORLD_SKIPPER_URL = 'https://greasyfork.org/it/scripts/472503-animeworld-skipper';

  const faviconBadger = new FaviconBadger({
    size: 0.63
  });

  NodeCreationObserver.onCreation('#sign > div.signed ul', function (element) {
    addStyle('#header .head #sign .signed, #header .head #sign .signin { width: unset !important; } #tagsReload { max-height: 50px !important;}');

    element.querySelector('li:nth-child(3) > a').href += '?folder=1&sort=2';
    element.querySelector('li:nth-child(4) > a').textContent = 'Notifiche';
    element.querySelector('li:nth-child(4) > a').href = '/notifications';
  });

  NodeCreationObserver.onCreation('#notification', function (element) {
    getNotify();
    setInterval(function() {
      getNotify();
    }, 2*60*1000); // 2 minuti

    if (location.pathname.includes('/play/'))
      window.addEventListener('urlchange', (info) => {
        setNotify();
      });
  });

  NodeCreationObserver.onCreation('div.menu-profile', function (element) {
    element.querySelector('a.pulsante-profilo-tabs:nth-child(2)').href += '?folder=1&sort=2';
    if(location.pathname.includes('/watchlist'))
      document.querySelector('.cover-profilo-aw').style.display = 'none';
  });

  if(location.pathname.includes('/play/')) {
    NodeCreationObserver.onCreation('#player .cover, div.server ul a, #controls > div.prevnext', function (element) {
      element.addEventListener('click', function() {
        window.scrollTo(0, 133);
        const r = document.querySelector('#controls .resize');
        if(r.textContent.includes('Espandi'))
          r.click();

        setTimeout(function() {
          document.querySelector('#controls .light').click();
          document.cookie = 'expandedPlayer=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }, 700);
      });
    });

    NodeCreationObserver.onCreation('#player iframe', function (element) {
      if (document.querySelector('[name="AnimeWorldSkipper"]') !== null) return;

      const button = document.createElement('button');
      button.id = 'skip-intro-ads';
      button.textContent = 'Salta Intro';
      button.style = 'position: absolute; bottom: 6em; right: 2em; padding: 0.5em 1em 0.4em; font-size: 14px; border: 1px solid #bdc3c7; border-radius: 2px; color: #bdc3c7; background-color: rgba(0,0,0,0.7); opacity: 0.25; z-index:2147483648;';

      element.addEventListener('load', function(e) {
        if (!this.contentDocument) return;
        const video = this.contentDocument?.querySelector('video');
        if (!video) return;
        button.onclick = function(e) {
          e.preventDefault(); e.stopPropagation();
          if (typeof GM_openInTab !== 'undefined')
            GM_openInTab(ANIMEWORLD_SKIPPER_URL, false);
          else
            window.open(ANIMEWORLD_SKIPPER_URL);
        };
        video.parentNode.append(button);
      });
    });
  }
  else if(location.pathname.includes('/notifications')) {
    NodeCreationObserver.onCreation('#delete-all', function (element) {
      const parentDiv = element.parentElement;
      const button = element.cloneNode();
      button.id = 'delete-read-all';
      button.innerHTML = '<i class="fas fa-trash"></i> Cancella tutte le notifiche "lette"';
      button.onclick = function() {
        Swal.fire({
          title: 'Vuoi davvero cancellare tutte le notifiche lette?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: 'rgb(165, 220, 134)',
          cancelButtonColor: 'rgb(221, 51, 51)',
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.value) {
            document.querySelectorAll('.profile-page .row .widget:nth-child(2) li.is-notification-read').forEach(function(e, i) {
              e.querySelector('.actions i.delete-clickable-icon').click();
            });
          }
        });
      };
      parentDiv.appendChild(button);
      element.remove();
    });
  }


  // ------- Function -------
  function getNotify() {
    request({
      url: '/request-serie',
      success: function(data) {
        const html = document.createElement('html'); html.innerHTML = data;
        document.querySelector('#notification > ul').innerHTML = html.querySelector('#notification > ul').innerHTML;
        setNotify();

        document.querySelectorAll('#notification > ul > li[data-id]').forEach(function(li, index) {
          const span = li.querySelector('.header-notification-read');
          span.addEventListener('click', function(e) {
            e.preventDefault(); e.stopPropagation();
            request({
              url: '/api/notifications/open/'+li.getAttribute('data-id'),
              success: function(data) {
                li.remove();
                setNotify();
              }
            });
          });
        });
      }
    });
  }

  function setNotify() {
    const number = document.querySelectorAll('ul.notification > li[data-id]').length || '0';
    document.querySelectorAll('.notifications-number').forEach((value, index) => {
      value.textContent = number;
    });

    faviconBadger.value = number;
    faviconBadger.update();

    if(location.pathname.includes('/play/')) {
      const title = document.querySelector('#anime-title').textContent;
      const episode = document.querySelector('div.server ul a.active')?.getAttribute('data-base');
      if (episode && episode !== '1')
        document.title = PAGE_ANIME_TITLE.replace('{{title}}', title).replace('{{episode}}', episode);
      else
        document.title = PAGE_ANIME_TITLE_NO_EP.replace('{{title}}', title);
    }
    else
      document.title = PAGE_TITLE;
  }

  function request(options) {
    const onreadystatechange = function() {
      if (this.readyState === 4 && (this.status == 200 || this.status == 201)) {
        options.success(this.responseText);
      } else if (this.readyState === 4) {
        console.warn('%cBetterAnimeWorld%c - Errore nella richiesta', 'color:red;font-size:14px;', '');
      }
    };
    if (typeof GM_xmlhttpRequest != 'undefined') {
      options.onload = onreadystatechange;
      GM_xmlhttpRequest(options);
    } else {
      const xhttp = new XMLHttpRequest();
      xhttp.open(options.method || 'GET', options.url);
      xhttp.onreadystatechange = onreadystatechange;
      xhttp.send();
    }
  }

  function addStyle(CSS) {
    if (typeof GM_addStyle != 'undefined') {
      GM_addStyle(CSS);
    } else {
      const style = document.createElement('style');
      style.innerText = CSS;
      document.head.appendChild(style);
    }
  }

})();