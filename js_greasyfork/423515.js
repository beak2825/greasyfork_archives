// ==UserScript==
// @name             LightShot (prnt.sc) random screenshot
// @description      Press R on prnt.sc website to load some random screenshot
//
// @name:ru          Lightshot (prnt.sc) случайный скриншот
// @description:ru   Нажми R на сайте prnt.sc чтобы загрузить какой-то случайный скриншот
//
// @author           Konf
// @namespace        https://greasyfork.org/users/424058
// @icon             https://t1.gstatic.com/faviconV2?client=SOCIAL&url=http://prnt.sc&size=32
// @version          1.3.1
// @match            https://prnt.sc/*
// @compatible       Chrome
// @compatible       Opera
// @compatible       Firefox
// @require          https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @run-at           document-body
// @grant            GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/423515/LightShot%20%28prntsc%29%20random%20screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/423515/LightShot%20%28prntsc%29%20random%20screenshot.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function() {
  'use strict';

  const langStrings = {
    en: {
      getNewRandImg: 'Load new random screenshot',
      hotkey: 'Hotkey',
      scriptGotFailStreak:
        'Oops! Script just have got a huge fail streak. ' +
        'If your internet connection is fine, maybe the script ' +
        'is broken. Please consider to notify the script author ' +
        'about the problem. Also it would be great if you check ' +
        'your browser console and save all the info messages ' +
        'from there. They are contain the errors details',
    },
    ru: {
      getNewRandImg: 'Загрузить новый случайный скриншот',
      hotkey: 'Горячая клавиша',
      scriptGotFailStreak:
        'Упс! Скрипт много пытался, но так и не смог ' +
        'сработать. Если у тебя всё в порядке с интернетом, ' +
        'то возможно скрипт просто сломан. Пожалуйста, сообщи ' +
        'о проблеме автору скрипта. А ещё было бы супер если ' +
        'бы ты открыл(а) консоль браузера и сохранил(а) оттуда ' +
        'все сообщения. Они содержат описания ошибок',
    },
  };
  const userLang = navigator.language.slice(0, 2);
  const i18n = langStrings[userLang || 'en'];

  const css = [`
    body {
      /* fix header glitching */
      overflow-y: scroll;
    }

    .randsshot-icon {
      float: left;
      width: 28px;
      height: 28px;
      margin: 11px 25px 0 0;
      color: white;
      font-weight: bold;
      user-select: none;
      cursor: pointer;
      border: 2px solid lightgray;
      border-radius: 100%;
      outline: none;
      background: none;
    }

    .randsshot-icon--loading {
      /* hide text */
      text-indent: -9999em;
      white-space: nowrap;
      overflow: hidden;

      border-top: 5px solid rgba(255, 255, 255, 0.2);
      border-right: 5px solid rgba(255, 255, 255, 0.2);
      border-bottom: 5px solid rgba(255, 255, 255, 0.2);
      border-left: 5px solid #ffffff;
      transform: translateZ(0);
      animation: loading 1.1s infinite linear;
    }

    @keyframes loading {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `].join();

  // node queries
  const qs = {
    garbage: [
      'div.image__title.image-info-item', 'div.additional',
      'div.header-downloads', 'div.social', 'div.image-info',
      'script[src*="image-helper.js"]',
    ].join(', '),

    needed: {
      mainImg: 'img.no-click.screenshot-image',
      headerLogo: 'a.header-logo',
      headerLogoParent: 'div.header > div.page-constrain',
    }
  };

  const neededNodes = {
    mainImg: null,
    headerLogo: null,
    headerLogoParent: null,
  }

  document.arrive(qs.garbage, { existing: true }, n => n.remove());

  let injected = false;

  for (const nodeId in qs.needed) {
    const query = qs.needed[nodeId];

    document.arrive(query, { existing: true }, (aNode) => {
      // unreachable?
      if (injected) return;

      neededNodes[nodeId] = aNode;
      document.unbindArrive(query);

      for (const nodeId in neededNodes) {
        const node = neededNodes[nodeId];

        if (node === null) return;
      }

      injected = true;
      main();
    });
  }


  function main() {
    GM_addStyle(css);

    const b = document.createElement('button');
    const bParent = neededNodes.headerLogoParent;
    const bNeighbour = neededNodes.headerLogo;

    b.innerText = 'R';
    b.title = `${i18n.getNewRandImg}\n${i18n.hotkey}: R`;
    b.className = 'randsshot-icon';
    bParent.insertBefore(b, bNeighbour);

    b.addEventListener('click', loadNewSshot);
    document.addEventListener('keydown', ev => {
      if (ev.code === 'KeyR' && !ev.ctrlKey) loadNewSshot();
    });

    const parser = new DOMParser();

    let failsStreak = 0;
    let isFetching = false;

    function closeFetchUX() {
      isFetching = false;
      b.className = 'randsshot-icon';
    }

    async function loadNewSshot() {
      if (isFetching) return;

      isFetching = true;
      b.className = 'randsshot-icon randsshot-icon--loading';

      const newSshotUrl = `https://prnt.sc/${makeSshotId()}`;

      try {
        const newSshotPage = await fetch(newSshotUrl);
        const newSshotPageDOM = parser.parseFromString(
          await newSshotPage.text(), 'text/html'
        );
        const fetchedImgNode = newSshotPageDOM.querySelector(
          qs.needed.mainImg
        );

        if (!fetchedImgNode || !fetchedImgNode.src) {
          throw new Error(
            'Failed to find a new image in fetched webpage. ' +
            'URL: ' + newSshotUrl
          );
        }

        neededNodes.mainImg.src = fetchedImgNode.src;

        await new Promise((resolve, reject) => {
          const listeners = {
            load: () => {
              turnListeners('off');
              history.pushState(null, null, newSshotUrl);
              closeFetchUX();
              resolve();
            },
            error: () => {
              turnListeners('off');
              reject(
                `Failed to load ${fetchedImgNode.src} ` +
                `that was fetched from ${newSshotUrl}`
              );
            },
          };

          const turnListeners = (to) => {
            for (const type in listeners) {
              const listener = listeners[type];

              if (to === 'on') {
                neededNodes.mainImg.addEventListener(type, listener);
              } else {
                neededNodes.mainImg.removeEventListener(type, listener);
              }
            }
          };

          turnListeners('on');
        });

        failsStreak = 0;
      } catch (e) {
        failsStreak += 1;
        console.error(e);
        closeFetchUX();

        if (failsStreak < 20) {
          // retry immediately (almost)
          setTimeout(loadNewSshot, 250);
        } else {
          alert(`${GM_info.script.name}:\n${i18n.scriptGotFailStreak}`);
          failsStreak = 0;
        }
      }
    }

    window.addEventListener('popstate', reloadPage);
  }


  // utils ---------------------------------------------

  function reloadPage() {
    window.location.reload();
  }

  function makeSshotId() {
    const chars = {
      first: 'abcdefghijklmnopqrstuvwxyz123456789',
      rest: 'abcdefghijklmnopqrstuvwxyz0123456789',
    };

    return makeId(chars.first, 1) + makeId(chars.rest, 5);
  }

  function makeId(charset, length) {
    let result = '';

    for (let i = 0, randNum; i < length; i++) {
      randNum = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randNum);
    }

    return result;
  }

  // ---------------------------------------------------
})();
