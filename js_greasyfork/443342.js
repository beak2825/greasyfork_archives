// ==UserScript==
// @name         Telegram Photo Protection Remover
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  Removes photo protection in Telegram
// @author       GooseOb
// @match        https://web.telegram.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443342/Telegram%20Photo%20Protection%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/443342/Telegram%20Photo%20Protection%20Remover.meta.js
// ==/UserScript==

(function() {
    const v = window.location.pathname[1];
    if (v === 'k') {
        const listener = e => {
            const img = e.target.querySelector('img');
            if (img) img.style.pointerEvents = 'auto';
        };
        const options = {capture: true};
        document.addEventListener('contextmenu', listener, options);
        document.addEventListener('click', listener, options);
    } else if (v === 'z' || v === 'a') {
        const PROTECTION_CLASS = 'is-protected';
        setInterval(() => {
            const mediaViewer = document.getElementById('MediaViewer');
            if (mediaViewer) {
                mediaViewer.querySelector('.protector')?.remove();
                for (const el of mediaViewer.querySelectorAll('.' + PROTECTION_CLASS)) {
                    el.classList.remove(PROTECTION_CLASS);
                    el.draggable = true;
                }
            }
        }, 200)
    }
})();