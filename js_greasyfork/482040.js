// ==UserScript==
// @name        Add GitHack Links To GitHub Files
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @version     0.0.3
// @description 12/13/2023, 1:18:04 AM
// @grant       GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/482040/Add%20GitHack%20Links%20To%20GitHub%20Files.user.js
// @updateURL https://update.greasyfork.org/scripts/482040/Add%20GitHack%20Links%20To%20GitHub%20Files.meta.js
// ==/UserScript==

const cssText = `

    @keyframes rawButtonAppended {
        from{
            background-position-x: 1px;
        }
        to{
            background-position-x: 2px;
        }
    }
    [data-testid="raw-button"]:not([ls4yu]) {
        animation: rawButtonAppended 1ms linear 0s 1 normal forwards;
    }


`;
function f101(rawButton) {
  rawButton.setAttribute('ls4yu', '');
  const newButton = rawButton.cloneNode(true);
  newButton.innerHTML = newButton.innerHTML.replace('Raw', 'GitHack');
  const newURL = newButton.href.replace(/^https\:\/\/github.com\/([-\w]+)\/([-\w.]+)\/(blob|raw)\/([-\w\/\.]+)$/g,
    (_, u, r, x1, k) => `https://raw.githack.com/${u}/${r}/${k}`
  );
  newButton.href = newURL;
  rawButton.parentNode.insertBefore(newButton, rawButton.nextSibling);
}


document.addEventListener('animationstart', (evt) => {
  const animationName = evt.animationName;
  if (!animationName) return;
  if (animationName === 'rawButtonAppended') {
    f101(evt.target);
  }
}, { passive: true, capture: true });

GM_addStyle(cssText);
