// ==UserScript==
// @name         HN Favicons
// @namespace    https://yfu.tw
// @version      0.3
// @license MIT
// @author      yufu
// @description  Favicons for Hacker News
// @match        https://*.ycombinator.com/*
// @grant        GM.addElement
// @icon         https://icons.duckduckgo.com/ip3/news.ycombinator.com.ico
// @downloadURL https://update.greasyfork.org/scripts/470314/HN%20Favicons.user.js
// @updateURL https://update.greasyfork.org/scripts/470314/HN%20Favicons.meta.js
// ==/UserScript==

// original scripts: https://greasyfork.org/zh-TW/scripts/443687-hn-favicons
// patched by yufu
// working with Autopage

(function() {
    'use strict';

    let size = 12;


    function doOne(link) {
       if (link.hasAttribute('has-icon')) return;
          let domain;
          try {
              domain = new URL(link.href).hostname;
          } catch(err) {
              return;
          }
          link.setAttribute('has-icon', true);
          const imageUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
          const container = document.createElement('span');
          container.style.paddingRight = '0.25em';
          container.style.paddingLeft = '0.25em';
          link.prepend(container);

          GM.addElement(container, 'img', {
              src: imageUrl,
              width: size,
              height: size
          });
    }
    function doit() {
      for (let link of document.querySelectorAll('.titleline > a')) {
         doOne(link);
      }
    }

     // dynamically loaded <a> tag for Autopage
    function aObserver() {
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) return
                    if (target.tagName === 'A') {
                          doOne(target);
                    } else {
                       for (let link of document.querySelectorAll('.titleline > a')) {
                            doOne(link);
                        }
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }

    doit();
    aObserver();

})();