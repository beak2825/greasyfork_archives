// ==UserScript==
// @name         FitGirl - Dark-Mode
// @namespace    https://greasyfork.org/users/222319
// @version      1.0.3
// @description  Dark mode and visual enhancements.
// @author       Nomicwave
// @license      MIT License <https://opensource.org/licenses/MIT>
// @match        https://fitgirl-repacks.site/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fitgirl-repacks.site
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/459657/FitGirl%20-%20Dark-Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/459657/FitGirl%20-%20Dark-Mode.meta.js
// ==/UserScript==


const cssInit = `
  * {
    display: none !important;
  }

  html, body {
    color: #000 !important;
    background: #000 !important;
    background-color: #000 !important;
  }
`;

function createStyle(id, cssText) {
    let style = document.createElement('style')
    style.id = id
    style.type = 'text/css'

    if (style.styleSheet) {
        style.styleSheet.cssText = cssText
    } else {
        style.appendChild(document.createTextNode(cssText))
    }

    return style
}

function waitForElement(selector) {
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

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}

async function injectDarkMode(cssText) {
    let style = createStyle('darkmode', cssText)

    const body = document.querySelector('body');
    const initmode = document.querySelector('#initmode');

    body.appendChild(style)
    initmode.disabled = true;
}

(async function () {
    let style = createStyle('initmode', cssInit)
    const body = await waitForElement('body');
    body.appendChild(style)

    fetch('https://raw.githubusercontent.com/nomicwave/userscripts/main/fit-girl-repacks/style.user.css').then((response) => response.text().then(injectDarkMode))
})();
