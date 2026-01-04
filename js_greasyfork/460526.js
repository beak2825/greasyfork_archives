// ==UserScript==
// @name         PageUp and PageDown buttons
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  PageUp and PageDown buttons on the side of each page. Hold to scroll to top/bottom. Mainly useful for reading web pages on e-ink devices, but can be handy for other touch devices.
// @author       xiaq
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      BSD 2-clause
// @downloadURL https://update.greasyfork.org/scripts/460526/PageUp%20and%20PageDown%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/460526/PageUp%20and%20PageDown%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const scrollFactor = 0.8; // How much of the page PageUp/PageDown scrolls by
    const opacity = 0.5; // Opacity of all buttons. 0 = transparent, 1 = opaque
    const right = true; // true = right side, false = left side
    const holdMs = 1000; // how long to hold to trigger scrolling to top/bottom, in milliseconds
    const sideGapPx = 8; // Gap between each button with the left/right side of the page
    const buttonsGapPx = 12; // Gap between PageUp and PageDown buttons
    const boxSizePx = 48;
    const fontSizePx = 32;

    const commonStyle = `
        opacity: ${opacity};
        width: ${boxSizePx}px;
        height: ${boxSizePx}px;
        font-size: ${fontSizePx}px;
        border: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        ${right? 'right' : 'left'}: ${sideGapPx}px;
    `;

    const distance = `calc(50% + ${buttonsGapPx / 2}px)`;
    // PageUp
    addButton('▲', 'bottom:' + distance,
              () => { window.scrollBy(0, -scrollFactor * document.documentElement.clientHeight) },
              () => { window.scrollTo(0, 0); });
    // PageDown
    addButton('▼', 'top:' + distance,
              () => { window.scrollBy(0, scrollFactor * document.documentElement.clientHeight) },
              () => { window.scrollTo(0, document.body.scrollHeight); });

    function addButton(text, style, press, hold) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style = commonStyle + style;
        button.onclick = press;

        let holdTimeout;
        const start = () => {
            holdTimeout = setTimeout(() => {
                hold();
                holdTimeout = undefined;
            }, holdMs);
        }
        const cancel = () => {
            if (holdTimeout) {
                clearTimeout(holdTimeout);
                holdTimeout = undefined;
            }
        };
        button.onmousedown = start;
        button.onmouseup = cancel;
        button.onmouseleave = cancel;

        button.ontouchstart = start;
        button.ontouchend = cancel;
        button.ontouchcancel = cancel;

        document.body.appendChild(button);
    }
})();