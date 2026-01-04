// ==UserScript==
// @name         Copy Bookie Details
// @namespace    LordBusiness.CBD
// @version      1.1.0
// @description  Copys bookie team name and its respective multiplier
// @author       LordBusiness [2052465]
// @match        https://www.torn.com/bookies.php*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386066/Copy%20Bookie%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/386066/Copy%20Bookie%20Details.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const getInnerText = node => [].reduce.call(node.childNodes, (accumulator, currentValue) => accumulator + (currentValue.nodeType === 3 ? currentValue.textContent : ''), ''),
          copyToClipboard = stringToCopy => {
              const clipboardListener = e => {
                  e.clipboardData.setData('text/html', stringToCopy);
                  e.clipboardData.setData('text/plain', stringToCopy);
                  e.preventDefault();
              }
              document.addEventListener('copy', clipboardListener);
              document.execCommand('copy');
              document.removeEventListener('copy', clipboardListener);
          },
          copyTableToClipboard = stringToCopy => copyToClipboard(`<table>${stringToCopy}</table>`),
          getClosest = (element, selector) => {
              for(; element && element !== document; element = element.parentNode) {
                  if(element.matches(selector)) return element;
              }
              return null;
          },
          getBet = betElement => {
              const teamName = getInnerText(betElement.querySelector('.result')),
                    teamMultiplier = getInnerText(betElement.querySelector('.odds:not(.fractional)')).replace(/x| /gi, '');
              return `<tr><td>${teamName}</td><td>${teamMultiplier}</td></tr>`;
          },
          getBetsWrap = betsWrapElement => [].reduce.call(betsWrapElement.querySelectorAll('.bet:not(.market-name-cell)'), (accumulator, betElement) => accumulator + getBet(betElement), ''),
          getBetsWraps = betsWrapsElement => [].map.call(betsWrapsElement.querySelectorAll(':scope > .bets-wrap'), getBetsWrap).join('<tr><td></td><td></td></tr>'),
          betClickListener = e => {
              const betInfoCells = getClosest(e.target, '.cells-wrap'),
                    betTitleElement = getClosest(e.target, '.bet.market-name-cell'),
                    betsWrap = getClosest(e.target, '.bets-wrap');
              if(betInfoCells) {
                  copyTableToClipboard(getBet(betInfoCells));
              } else if(betTitleElement) {
                  copyTableToClipboard(getBetsWrap(betsWrap));
              } else if(e.target.classList.contains('title')) {
                  copyTableToClipboard(getBetsWraps(betsWrap));
              }
          }
    document.querySelector('.bet-wrap').addEventListener('click', betClickListener, { passive: true});
})();