// ==UserScript==
// @name        patternfly.org - Algolia view
// @namespace   patternfly
// @include     https://www.patternfly.org/v4/*
// @grant       GM_addStyle
// @version     1.2
// @author      Joachim Schuler
// @license     MIT
// @description 2/7/2023, 10:30:22 AM
// @require https://cdn.jsdelivr.net/npm/tether@2.0.0-beta.5/dist/js/tether.min.js
// @downloadURL https://update.greasyfork.org/scripts/459611/patternflyorg%20-%20Algolia%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/459611/patternflyorg%20-%20Algolia%20view.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

/*
 * This script highlights elements that are parsed by the Algolia crawler for patternfly.org
 * https://crawler.algolia.com/
 */

(function() {
    'use strict';

    GM_addStyle(`
    .zIndex {
        z-index: 99999;
    }
`   );

    const runScript = () => {
      setTimeout(() => {
        console.log('Running: Algolia view');

        // Removing DOM elements we don't want to crawl
        const toRemove =
              ".ws-org-pfsite-l-footer, .ws-org-pfsite-l-footer-dark, .ws-preview, .ws-toc";
        const removeArr = [...document.querySelectorAll(toRemove)];
        if (removeArr.length > 0) {
          removeArr.forEach(elem => {
            elem.style.cssText += 'display: none;'
          });
        }


        const recordProps = {
            lvl1: ".pf-c-tabs__item.pf-m-current > a",
            content:
            "#main-content .ws-p, #main-content .ws-li, #main-content .ws-ol, #main-content .ws-dl, #main-content .ws-blockquote, #main-content .ws-small, #main-content .ws-dt, #main-content .ws-code, #main-content .ws-table",
            lvl0: {
                selectors: "main h1",
                defaultValue: "Documentation",
            },
            lvl2: "main h2",
            lvl3: "main h3",
            lvl4: "main h4",
            lvl5: "main h5",
        };

        function placeLevelRelativeTo(selector, level) {
            const parentElems = [...document.querySelectorAll(selector)];
            if (parentElems.length > 0) {
              parentElems.forEach(elem => {
                elem.style.cssText += `border: 2px dotted blue;`;

                const childElem = document.createElement ('div');
                childElem.innerHTML = `<div id="${level}"><strong>${level}</strong></div>`;
                document.body.appendChild(childElem);

                new Tether({
                  element: childElem,
                  target: elem,
                  attachment: 'top right',
                  targetAttachment: 'top left',
                  classes: {
                    element: 'zIndex'
                  },
                  offset: '10px 0'
                });
              });
            }

        }

        placeLevelRelativeTo(recordProps.lvl0.selectors, 'lvl0');
        placeLevelRelativeTo(recordProps.lvl1, 'lvl1');
        placeLevelRelativeTo(recordProps.lvl2, 'lvl2');
        placeLevelRelativeTo(recordProps.lvl3, 'lvl3');
        placeLevelRelativeTo(recordProps.lvl4, 'lvl4');
        placeLevelRelativeTo(recordProps.lvl5, 'lvl5');
        // placeLevelRelativeTo(recordProps.content, 'content');
        [...document.querySelectorAll(recordProps.content)].forEach(content => {
          content.style.cssText += 'background-color: yellow';
        });
      }, 100);
      setTimeout(() => {
        Tether.position();
      }, 500)
    };

    const observeUrlChange = () => {
      let oldHref = document.location.href;
      const body = document.querySelector("body");
      const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
          if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            /* Changed ! your code here */
            runScript();
          }
        });
      });
      observer.observe(body, { childList: true, subtree: true });
    };

    window.onload = observeUrlChange;
    // initially run script on first page load
    runScript();
})();