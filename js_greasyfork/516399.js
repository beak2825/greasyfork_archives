// ==UserScript==
// @name         RPGEN - WASD Keyconfig
// @namespace    https://tampermonkey.net/
// @version      0.2
// @description  TL;DR
// @author       https://greasyfork.org/ja/users/705684
// @match        https://rpgen.org/dq/?map=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rpgen.site
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516399/RPGEN%20-%20WASD%20Keyconfig.user.js
// @updateURL https://update.greasyfork.org/scripts/516399/RPGEN%20-%20WASD%20Keyconfig.meta.js
// ==/UserScript==

(() => {
    const keyMap = {
        'w': { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38, which: 38 },
        'a': { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37, which: 37 },
        's': { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40 },
        'd': { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, which: 39 }
    };
    window.$(window).on('keypress keydown keyup', event => {
        if (event.key in keyMap) {
            document.getElementById('idCanvasDq').dispatchEvent(new KeyboardEvent(event.type, {
                ...keyMap[event.key],
                bubbles: true,
                cancelable: true
            }));
        }
    });
})();