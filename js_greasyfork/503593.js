// ==UserScript==
// @name        Crop helper - cuberealm.io
// @namespace   https://github.com/Thibb1
// @match       https://cuberealm.io/*
// @grant       none
// @version     1.0
// @author      Thibb1
// @run-at      document-start
// @description Helps you plant crops
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/503593/Crop%20helper%20-%20cuberealmio.user.js
// @updateURL https://update.greasyfork.org/scripts/503593/Crop%20helper%20-%20cuberealmio.meta.js
// ==/UserScript==

let interval = null;
document.addEventListener('keydown', function(e) {
    if (e.key === 'v') {
        clearInterval(interval);
        interval = setInterval(() => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', code: 'KeyF'}));
            setTimeout(() => {
                document.dispatchEvent(new KeyboardEvent('keyup', { key: 'f', code: 'KeyF'}));
            }, 5);
        }, 10);
    }
});
document.addEventListener('keyup', function(e) {
    if (e.key === 'v') {
        clearInterval(interval);
    }
});
