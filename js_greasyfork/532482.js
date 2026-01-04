// ==UserScript==
// @name         Hide Blocked Messages in Google Chat
// @source       https://github.com/LucasLiorLE/gcHide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license GPL-3.0
// @description  Hides entire chat bubble if it contains a specific SVG path (8 levels up from path element)
// @author       LucasLiorLE
// @match        https://chat.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532482/Hide%20Blocked%20Messages%20in%20Google%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/532482/Hide%20Blocked%20Messages%20in%20Google%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_SVG_PATH_D = 'm22.41 17.41.97.97s.12.02.12-.88c0-1.94-1.56-3.5-3.5-3.5-.89 0-.88.12-.88.12l.47.47zM27.99 26A9.93 9.93 0 0 0 30 20c0-5.52-4.48-10-10-10-2.25 0-4.32.75-5.99 2.01-.01 0-.02.01-.02.01-.25.19-.49.39-.73.61-.01.01-.03.02-.04.04-.23.21-.45.43-.66.67-.01.01-.02.01-.03.02A9.97 9.97 0 0 0 10 20c0 5.52 4.48 10 10 10 2.55 0 4.87-.96 6.64-2.53l.03-.03c.23-.21.45-.43.66-.65.01-.02.03-.03.04-.05q.315-.345.6-.72zM20 12c4.41 0 8 3.59 8 8 0 1.7-.55 3.27-1.45 4.56l-3.72-3.72-.63-.63-4.9-4.91-.13-.13-1.73-1.73A7.87 7.87 0 0 1 20 12m0 16c-1.86 0-3.57-.64-4.93-1.72.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78A7.9 7.9 0 0 1 20 28m0-5.5c-1.46 0-4.93.59-6.36 2.33A7.95 7.95 0 0 1 12 20c0-1.99.74-3.82 1.95-5.22l2.56 2.56c0 .05-.02.1-.02.15 0 1.94 1.56 3.5 3.5 3.5.05 0 .1-.01.15-.02l1.72 1.72c-.72-.12-1.4-.19-1.86-.19';

    function hideBySvgPath() {
        const paths = document.querySelectorAll(`svg path[d="${TARGET_SVG_PATH_D}"]`);
        paths.forEach(path => {
            let target = path;
            for (let i = 0; i < 8; i++) {
                if (target?.parentElement) {
                    target = target.parentElement;
                } else {
                    return;
                }
            }

            if (target && target.tagName.toLowerCase() === 'div') {
                target.style.display = 'none';
            }
        });
    }

    const observer = new MutationObserver(hideBySvgPath);
    observer.observe(document.body, { childList: true, subtree: true });

    const interval = setInterval(hideBySvgPath, 1000);
    setTimeout(() => clearInterval(interval), 30000);
})();
