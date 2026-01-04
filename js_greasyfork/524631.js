// ==UserScript==
// @name          Google Images View Button
// @description   At the Google Images preview pan the script adds a button that opens an image in a new tab
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://www.google.com/s2/favicons?sz=64&domain=google.com
// @version       2.0.2
// @match         *://*.google.ad/search*
// @match         *://*.google.ae/search*
// @match         *://*.google.al/search*
// @match         *://*.google.am/search*
// @match         *://*.google.as/search*
// @match         *://*.google.at/search*
// @match         *://*.google.az/search*
// @match         *://*.google.ba/search*
// @match         *://*.google.be/search*
// @match         *://*.google.bf/search*
// @match         *://*.google.bg/search*
// @match         *://*.google.bi/search*
// @match         *://*.google.bj/search*
// @match         *://*.google.bs/search*
// @match         *://*.google.bt/search*
// @match         *://*.google.by/search*
// @match         *://*.google.ca/search*
// @match         *://*.google.cat/search*
// @match         *://*.google.cd/search*
// @match         *://*.google.cf/search*
// @match         *://*.google.cg/search*
// @match         *://*.google.ch/search*
// @match         *://*.google.ci/search*
// @match         *://*.google.cl/search*
// @match         *://*.google.cm/search*
// @match         *://*.google.cn/search*
// @match         *://*.google.co.ao/search*
// @match         *://*.google.co.bw/search*
// @match         *://*.google.co.ck/search*
// @match         *://*.google.co.cr/search*
// @match         *://*.google.co.id/search*
// @match         *://*.google.co.il/search*
// @match         *://*.google.co.in/search*
// @match         *://*.google.co.jp/search*
// @match         *://*.google.co.ke/search*
// @match         *://*.google.co.kr/search*
// @match         *://*.google.co.ls/search*
// @match         *://*.google.co.ma/search*
// @match         *://*.google.co.mz/search*
// @match         *://*.google.co.nz/search*
// @match         *://*.google.co.th/search*
// @match         *://*.google.co.tz/search*
// @match         *://*.google.co.ug/search*
// @match         *://*.google.co.uk/search*
// @match         *://*.google.co.uz/search*
// @match         *://*.google.co.ve/search*
// @match         *://*.google.co.vi/search*
// @match         *://*.google.co.za/search*
// @match         *://*.google.co.zm/search*
// @match         *://*.google.co.zw/search*
// @match         *://*.google.com/search*
// @match         *://*.google.com.af/search*
// @match         *://*.google.com.ag/search*
// @match         *://*.google.com.ai/search*
// @match         *://*.google.com.ar/search*
// @match         *://*.google.com.au/search*
// @match         *://*.google.com.bd/search*
// @match         *://*.google.com.bh/search*
// @match         *://*.google.com.bn/search*
// @match         *://*.google.com.bo/search*
// @match         *://*.google.com.br/search*
// @match         *://*.google.com.bz/search*
// @match         *://*.google.com.co/search*
// @match         *://*.google.com.cu/search*
// @match         *://*.google.com.cy/search*
// @match         *://*.google.com.do/search*
// @match         *://*.google.com.ec/search*
// @match         *://*.google.com.eg/search*
// @match         *://*.google.com.et/search*
// @match         *://*.google.com.fj/search*
// @match         *://*.google.com.gh/search*
// @match         *://*.google.com.gi/search*
// @match         *://*.google.com.gt/search*
// @match         *://*.google.com.hk/search*
// @match         *://*.google.com.jm/search*
// @match         *://*.google.com.kh/search*
// @match         *://*.google.com.kw/search*
// @match         *://*.google.com.lb/search*
// @match         *://*.google.com.ly/search*
// @match         *://*.google.com.mm/search*
// @match         *://*.google.com.mt/search*
// @match         *://*.google.com.mx/search*
// @match         *://*.google.com.my/search*
// @match         *://*.google.com.na/search*
// @match         *://*.google.com.ng/search*
// @match         *://*.google.com.ni/search*
// @match         *://*.google.com.np/search*
// @match         *://*.google.com.om/search*
// @match         *://*.google.com.pa/search*
// @match         *://*.google.com.pe/search*
// @match         *://*.google.com.pg/search*
// @match         *://*.google.com.ph/search*
// @match         *://*.google.com.pk/search*
// @match         *://*.google.com.pr/search*
// @match         *://*.google.com.py/search*
// @match         *://*.google.com.qa/search*
// @match         *://*.google.com.sa/search*
// @match         *://*.google.com.sb/search*
// @match         *://*.google.com.sg/search*
// @match         *://*.google.com.sl/search*
// @match         *://*.google.com.sv/search*
// @match         *://*.google.com.tj/search*
// @match         *://*.google.com.tr/search*
// @match         *://*.google.com.tw/search*
// @match         *://*.google.com.ua/search*
// @match         *://*.google.com.uy/search*
// @match         *://*.google.com.vc/search*
// @match         *://*.google.com.vn/search*
// @match         *://*.google.cv/search*
// @match         *://*.google.cz/search*
// @match         *://*.google.de/search*
// @match         *://*.google.dj/search*
// @match         *://*.google.dk/search*
// @match         *://*.google.dm/search*
// @match         *://*.google.dz/search*
// @match         *://*.google.ee/search*
// @match         *://*.google.es/search*
// @match         *://*.google.fi/search*
// @match         *://*.google.fm/search*
// @match         *://*.google.fr/search*
// @match         *://*.google.ga/search*
// @match         *://*.google.ge/search*
// @match         *://*.google.gg/search*
// @match         *://*.google.gl/search*
// @match         *://*.google.gm/search*
// @match         *://*.google.gr/search*
// @match         *://*.google.gy/search*
// @match         *://*.google.hk/search*
// @match         *://*.google.hn/search*
// @match         *://*.google.hr/search*
// @match         *://*.google.ht/search*
// @match         *://*.google.hu/search*
// @match         *://*.google.ie/search*
// @match         *://*.google.im/search*
// @match         *://*.google.iq/search*
// @match         *://*.google.is/search*
// @match         *://*.google.it/search*
// @match         *://*.google.je/search*
// @match         *://*.google.jo/search*
// @match         *://*.google.jp/search*
// @match         *://*.google.kg/search*
// @match         *://*.google.ki/search*
// @match         *://*.google.kz/search*
// @match         *://*.google.la/search*
// @match         *://*.google.li/search*
// @match         *://*.google.lk/search*
// @match         *://*.google.lt/search*
// @match         *://*.google.lu/search*
// @match         *://*.google.lv/search*
// @match         *://*.google.md/search*
// @match         *://*.google.me/search*
// @match         *://*.google.mg/search*
// @match         *://*.google.mk/search*
// @match         *://*.google.ml/search*
// @match         *://*.google.mn/search*
// @match         *://*.google.ms/search*
// @match         *://*.google.mu/search*
// @match         *://*.google.mv/search*
// @match         *://*.google.mw/search*
// @match         *://*.google.ne/search*
// @match         *://*.google.nl/search*
// @match         *://*.google.no/search*
// @match         *://*.google.nr/search*
// @match         *://*.google.nu/search*
// @match         *://*.google.pl/search*
// @match         *://*.google.pn/search*
// @match         *://*.google.ps/search*
// @match         *://*.google.pt/search*
// @match         *://*.google.ro/search*
// @match         *://*.google.rs/search*
// @match         *://*.google.ru/search*
// @match         *://*.google.rw/search*
// @match         *://*.google.sc/search*
// @match         *://*.google.se/search*
// @match         *://*.google.sh/search*
// @match         *://*.google.si/search*
// @match         *://*.google.sk/search*
// @match         *://*.google.sm/search*
// @match         *://*.google.sn/search*
// @match         *://*.google.so/search*
// @match         *://*.google.sr/search*
// @match         *://*.google.st/search*
// @match         *://*.google.td/search*
// @match         *://*.google.tg/search*
// @match         *://*.google.tl/search*
// @match         *://*.google.tm/search*
// @match         *://*.google.tn/search*
// @match         *://*.google.to/search*
// @match         *://*.google.tt/search*
// @match         *://*.google.vg/search*
// @match         *://*.google.vu/search*
// @match         *://*.google.ws/search*
// @compatible    Chrome
// @compatible    Opera
// @compatible    Firefox
// @run-at        document-body
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @grant         GM_unregisterMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/524631/Google%20Images%20View%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/524631/Google%20Images%20View%20Button.meta.js
// ==/UserScript==

/**
 * Hi! Don't change (or even resave) anything here because
 * doing so in Tampermonkey will turn off the script updates.
 * Not sure about other script managers.
 * This can be restored in settings, but it might be hard to find,
 * so it's better to reinstall the script if you're not sure.
*/

/* jshint esversion: 11 */

(function() {
  'use strict';

  // https://icons8.com/icon/43740/linking
  // https://img.icons8.com/small/96/ffffff/external-link-squared.png
  const viewBtnIconBase64 = [
    'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4A',
    'AAACXBIWXMAAAsTAAALEwEAmpwYAAAC9klEQVR4nO2dy04UQRSGawUmEFdGQRPjWnGJ+',
    'ARKiM8hlydxA2pivLyFlxF9EtGFibwAhkvEAOYznTkmxEz1MNBTp7rr/9bddbr+r6d6Z',
    'mBOhSCEEEIIIYQQQgghxDkAbgBrwCawBRzQfg5sLtWcVqs5ZndzAFeA58Ax3ecYeAPMh',
    'hwAloBdyuMnsOgd/gpwQrmcAMte4T8sPPx//AEepQ5/ttBlp245upZSwOvopcAvYB2YB',
    '6ZCywGmgHvABnBYM++XKd9qxt7t/ABuh44CzAHbkbkfAddTXMRazZ3f2fD/kxB7JayEc',
    'WMfSAaxHgoBeBrJoJei+LdI8flQCPSfCYPYSlF8P1K89Q/cswJMRzLYC+MmUhivuuMmt',
    'xwkwJCARIQIox7fGF6FcSK3HCTAkIBEhAijHt8YboUbApgA3ktAC8KvqBlrICkm4VPYI',
    'XwJcA5fAhoAmAQ+Dsk59gWjlqAEd/5n4JIE+IT/qQrfjtcroOHw3501fDtHArzCt/Mkw',
    'Ct8O1cCvMK38yXAK3wbQwK8wrdxJMArfBtLArzCt/EkwCt8G1MCvMK3cSXAK3wbWwK8w',
    'rfxJeCC4W+eN3yrIQE14b8dZ/hWRwK8wrdaEuAVvtWTAK/wraYEjBj+ZHBkVGGtKQy8G',
    'hJ+9WfGiabqXeA6OyvgJvA91zu/8wJqJGQTfucFDJCQVfhFCKgAbtkzwX3NL1JAzkiAM',
    'xLgjAQ4IwHOSIAzEuCMBDgjAc5IgDMS4IwEFCxgL1J7OhQCcDmSwW6K4l8jxUtqWbbg2',
    'bIs9pvbjVAIwLNIBh8821ZWrRzvhI4D3PVuW1nXuLVqajoXuh3+dk3j1jQt7Yf858Kh9',
    'dVc6MKDmX6HxPu27PyumfeLlBc1Yw2rRZ8d4GoyASbhQSE7ZgyjauG/lDT8UxKWC99D4',
    'AR47BL+KQmLhS5HO9UmFiGjTXyeDHlIdYUj28RnJuRG1T/f9pXpAV9q+ky3iX2bS8/ml',
    'sfuSUIIIYQQQgghhBAitI2/ZYk4Uk/wyKQAAAAASUVORK5CYII='
  ].join('');

  let ignoreThumbnails = GM_getValue('ignoreThumbnails', true);
  let menuId = null;

  (function updateMenu() {
    if (menuId) GM_unregisterMenuCommand(menuId);

    menuId = GM_registerMenuCommand(`Ignore thumbnails: ${ignoreThumbnails}`, () => {
      ignoreThumbnails = !ignoreThumbnails;

      GM_setValue('ignoreThumbnails', ignoreThumbnails);
      updateMenu();
    });
  }());

  // Skip if it is not an image search section
  if ((new URLSearchParams(window.location.search)).get('udm') !== '2') return;

  // Might be not reliable enough
  const isMobileVersion = !!document.querySelector('meta[name="viewport"]');
  let imgSelector = 'div[data-sci][aria-hidden="false"] a > img';

  if (isMobileVersion) {
    imgSelector = (
      'div[data-sci][aria-hidden="false"] div[data-tolns]:nth-of-type(2) > div > img'
    );
  }

  waitForElement(imgSelector, {
    existing: true,
  }, (image) => {
    // Recursion skip
    if (image.matches('.GIVB-icon')) return;

    // Remove existing view button, if present
    image.parentElement.querySelector('a.GIVB-btn')?.remove();

    // Might be not reliable enough, but it's the best I've found
    const imageIsThumbnail = [
      ...image.parentElement.children
    ].filter(n => n.nodeName === 'IMG').length === 1;

    if (imageIsThumbnail && ignoreThumbnails) return;

    const viewBtn = document.createElement('a');
    const viewBtnIcon = document.createElement('img');

    viewBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      window.open(viewBtn.href, '_blank');
    });

    viewBtn.href = image.src;
    viewBtn.title = 'Open in a new tab';
    viewBtn.className = 'GIVB-btn';
    viewBtnIcon.className = 'GIVB-icon';
    viewBtnIcon.draggable = false;
    viewBtnIcon.src = viewBtnIconBase64;

    viewBtn.append(viewBtnIcon);
    image.parentElement.append(viewBtn);
  });

  GM_addStyle([`
    .GIVB-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      height: 36px;
      width: 36px;
      background-color: #0009;
      border-radius: 50%;
    }

    .GIVB-btn:hover {
      background-color: #000c;
    }

    .GIVB-icon {
      position: absolute;
      top: 6px;
      right: 6px;
      height: 24px;
      width: 24px;
    }
  `][0]);


  // utils > -----------------------------------------------------------------------

  function waitForElement(query, {
    callbackOnTimeout = false,
    existing = false,
    onceOnly = false,
    rootElement = document.documentElement,
    timeout,

    // "attributes" prop is not supported
    observerOptions = {
      childList: true,
      subtree: true,
    },
  }, callback) {
    if (!query) throw new Error('Query is needed');
    if (!callback) throw new Error('Callback is needed');

    observerOptions = Object.assign({}, observerOptions);

    const handledElements = new WeakSet();
    const existingElements = rootElement.querySelectorAll(query);
    let timeoutId = null;

    if (existingElements.length) {
      // Mark all as handled for a proper work when `existing` is false
      // to ignore them later on
      for (const node of existingElements) {
        handledElements.add(node);
      }

      if (existing) {
        if (onceOnly) {
          try {
            callback(existingElements[0]);
          } catch (e) {
            console.error(e);
          }

          return;
        } else {
          for (const node of existingElements) {
            try {
              callback(node);
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    }

    const observer = new MutationObserver((mutations, observer) => {
      for (const node of rootElement.querySelectorAll(query)) {
        if (handledElements.has(node)) continue;

        handledElements.add(node);

        try {
          callback(node);
        } catch (e) {
          console.error(e);
        }

        if (onceOnly) {
          observer.disconnect();

          if (timeoutId) clearTimeout(timeoutId);

          return;
        }
      }
    });

    observer.observe(rootElement, {
      attributes: false,
      childList: observerOptions.childList || false,
      subtree: observerOptions.subtree || false,
    });

    if (timeout !== undefined) {
      timeoutId = setTimeout(() => {
        observer.disconnect();

        if (callbackOnTimeout) {
          try {
            callback(null);
          } catch (e) {
            console.error(e);
          }
        }
      }, timeout);
    }

    return observer;
  }

  // < utils -----------------------------------------------------------------------
}());
