// ==UserScript==
// @name        Full Screen for CrazyGames
// @namespace   Violentmonkey Scripts
// @match       https://*.crazygames.com/*
// @grant       none
// @version     1.0
// @author      -
// @description Refresh page if not working
// @license CC0
// @downloadURL https://update.greasyfork.org/scripts/488369/Full%20Screen%20for%20CrazyGames.user.js
// @updateURL https://update.greasyfork.org/scripts/488369/Full%20Screen%20for%20CrazyGames.meta.js
// ==/UserScript==

window.addEventListener('load', async function() {
  if (document.location.hostname === 'www.crazygames.com') {
    await waitForElm('#game-iframe');
    document.location = document.getElementById('game-iframe').src;
  }

  if (document.location.hostname === 'games.crazygames.com' && document.location.pathname.endsWith('/index.html')) {
    await waitForElm('.MuiGrid-container');
    let base = document.getElementsByClassName('MuiGrid-container')[0].parentElement;
    base.querySelectorAll('*').forEach(function(element) {
      if (!element.closest('.MuiGrid-root')) {
        element.style.display = 'none';
      }
    });
  }
}, false);

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}