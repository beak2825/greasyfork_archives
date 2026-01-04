// ==UserScript==
// @name        Add Advanced Search Button - twitter.com
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/*
// @grant       none
// @version     1.1
// @author      OnkelTem
// @description 4/28/2022, 9:50:18 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/444160/Add%20Advanced%20Search%20Button%20-%20twittercom.user.js
// @updateURL https://update.greasyfork.org/scripts/444160/Add%20Advanced%20Search%20Button%20-%20twittercom.meta.js
// ==/UserScript==

const titleText = "Advanced Search";
const svgIconHtml = '<g><path d="m10 2.7714c4.0001 0 7.2429 3.2427 7.2429 7.2429 0 1.794-0.65743 3.4431-1.7383 4.7134l0.30086 0.30086h0.88028l5.5714 5.5714-1.6714 1.6714-5.5714-5.5714v-0.88028l-0.30086-0.30086c-1.2703 1.0809-2.9194 1.7383-4.7134 1.7383-4.0001 0-7.2429-3.2427-7.2429-7.2429 0-4.0001 3.2427-7.2429 7.2429-7.2429m0 2.2286c-2.7857 0-5.0143 2.2286-5.0143 5.0143 0 2.7857 2.2286 5.0143 5.0143 5.0143 2.7857 0 5.0143-2.2286 5.0143-5.0143 0-2.7857-2.2286-5.0143-5.0143-5.0143z"/></g>';

function main(nav) {
  const l = nav.querySelector('a').cloneNode(true);
  l.setAttribute('aria-label', titleText);
  l.href = "https://twitter.com/search-advanced?lang=en";
  const svg = l.querySelector('svg');
  const span = l.querySelector('span');
  span.textContent = titleText;
  span.style.fontWeight = 'normal';
  svg.innerHTML = svgIconHtml;
  nav.appendChild(l);
}

new MutationObserver((list, o) => {
  for (const m of list) {
    if (m.type === 'childList') {
      let nodes = m.addedNodes;
      for (let n of nodes) {
        const nav = n.querySelector('nav[role="navigation"]');
        if (nav != null) {
          o.disconnect();
          main(nav);
        }
      }
    }
  }
}).observe(document.getElementById('react-root'), {childList: true, subtree: true});


