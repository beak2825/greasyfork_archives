// ==UserScript==
// @name         RetailMeNot Enhancer
// @namespace    https://greasyfork.org/users/649
// @version      3.1.9
// @description  Auto shows coupons and stops pop-unders on RetailMeNot
// @author       Adrien Pyke
// @match        *://www.retailmenot.com/*
// @match        *://www.retailmenot.ca/*
// @match        *://www.retailmenot.de/*
// @match        *://www.retailmenot.es/*
// @match        *://www.retailmenot.it/*
// @match        *://www.retailmenot.pl/*
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/23203/RetailMeNot%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/23203/RetailMeNot%20Enhancer.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const SCRIPT_NAME = 'RetailMeNot Auto Show Coupons';

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
    getQueryParam(name, url = location.href) {
      name = name.replace(/[[\]]/gu, '\\$&');
      const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'u');
      const results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/gu, ' '));
    },
    setQueryParam(key, value, url = location.href) {
      const regex = new RegExp(`([?&])${key}=.*?(&|#|$)(.*)`, 'giu');
      const hasValue =
        typeof value !== 'undefined' && value !== null && value !== '';
      if (regex.test(url)) {
        if (hasValue) {
          return url.replace(regex, `$1${key}=${value}$2$3`);
        } else {
          const [path, hash] = url.split('#');
          url = path.replace(regex, '$1$3').replace(/(&|\?)$/u, '');
          if (hash) url += `#${hash[1]}`;
          return url;
        }
      } else if (hasValue) {
        const separator = url.includes('?') ? '&' : '?';
        const [path, hash] = url.split('#');
        url = `${path + separator + key}=${value}`;
        if (hash) url += `#${hash[1]}`;
        return url;
      } else return url;
    },
    removeQueryParam(key, url) {
      return Util.setQueryParam(key, null, url);
    },
    changeUrl(url) {
      window.history.replaceState({ path: url }, '', url);
    },
    createCookie(name, value, days) {
      let expires;
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toGMTString()}`;
      } else expires = '';
      document.cookie = `${name}=${value}${expires}; path=/`;
    }
  };

  // remove force reload param
  Util.changeUrl(Util.removeQueryParam('r'));
  if (window.location.href.match(/^https?:\/\/www\.retailmenot\.com/iu)) {
    // US
    Util.log('Enhancing US site');
    // Show Coupons
    document.body.classList.add('ctc');

    // Disable pop unders
    waitForElems({
      sel: '.js-outclick, .js-title > a, .js-triggers-outclick, .js-coupon-square, .offer-item-in-list',
      onmatch(button) {
        const path =
          button.dataset.newTab && !button.dataset.newTab.match(/^\/out/iu)
            ? button.dataset.newTab
            : button.dataset.mainTab;
        const href = `${window.location.protocol}//${window.location.host}${path}`;
        if (path) {
          const handler = e => {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (e.button === 1) {
              GM_openInTab(href, true);
            } else if (window.location.pathname === path) {
              window.location.replace(href);
            } else {
              window.location.href = href;
            }
            return false;
          };
          if (button.classList.contains('offer-item-in-list')) {
            const offerButton = Util.q('.offer-button', button);
            if (offerButton) {
              offerButton.onclick = handler;
            }
            const offerTitle = Util.q('.offer-title', button);
            if (offerTitle) {
              offerTitle.href = href;
              offerTitle.onclick = handler;
            }
          } else {
            if (button.tagname === 'A') {
              button.href = href;
            }
            button.onclick = handler;
            Util.qq('*', button).forEach(elem => {
              elem.onclick = handler;
            });
          }
        }
      }
    });
  } else if (window.location.href.match(/^https?:\/\/www\.retailmenot\.ca/iu)) {
    // CANADA
    Util.log('Enhancing Canadian site');
    // Show Coupons
    Util.qq('.crux > .cover').forEach(cover => {
      cover.remove();
    });

    // Disable Pop Unders
    waitForElems({
      sel: '.offer, .stage .coupon',
      onmatch(offer) {
        const href = `${window.location.protocol}//${window.location.host}${window.location.pathname}?c=${offer.dataset.offerid}`;

        const clickHandler = e => {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (e.button === 1) {
            GM_openInTab(href, true);
          } else {
            window.location.replace(href);
          }
          return false;
        };

        if (!offer.parentNode.classList.contains('stage')) {
          waitForElems({
            context: offer,
            sel: 'a.offer-title',
            stop: true,
            onmatch(title) {
              title.href = href;
              title.onclick = clickHandler;
            }
          });
        }

        Util.qq(
          '.action-button, .crux, .caterpillar-title, .caterpillar-code',
          offer
        ).forEach(elem => {
          elem.onclick = clickHandler;
        });
      }
    });

    // disable pop unders on the exclusive tags
    Util.qq('.exclusive_icon').forEach(tag => {
      tag.onclick = e => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };
    });
  } else {
    // GERMANY, SPAIN, ITALY, POLAND
    Util.log('Enhancing international site');
    // Remove hash after modal comes up
    if (window.location.href.indexOf('#') !== -1) {
      waitForElems({
        sel: '#modal-coupon',
        stop: true,
        onmatch() {
          Util.changeUrl(window.location.href.split('#')[0]);
        }
      });
    }
    // disable pop unders
    waitForElems({
      sel: '.coupon',
      onmatch(coupon) {
        const id = coupon.dataset.suffix;
        const href = `${window.location.protocol}//${window.location.host}${window.location.pathname}?r=1#${id}`;
        const clickHandler = e => {
          e.preventDefault();
          e.stopImmediatePropagation();
          Util.createCookie(`click_${id}`, true);
          if (e.button === 1) {
            GM_openInTab(href, true);
          } else {
            window.location.replace(href);
          }
          return false;
        };
        Util.qq('.outclickable', coupon).forEach(elem => {
          if (elem.tagName === 'A') {
            elem.href = href;
          }
          elem.onclick = clickHandler;
        });
      }
    });
  }
  // human checks
  const regex = /^https?:\/\/www\.retailmenot\.[^/]+\/humanCheck\.php/iu;
  Util.qq('a')
    .filter(link => link.href.match(regex))
    .forEach(link => {
      const url = Util.getQueryParam('url', link.href);
      if (url) {
        link.href = `${window.location.protocol}//${window.location.host}${url}`;
      }
    });

  // remove coupon query param so reloads work properly
  Util.changeUrl(Util.removeQueryParam('c'));
})();
