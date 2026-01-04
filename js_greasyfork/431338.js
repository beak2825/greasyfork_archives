// ==UserScript==
// @name         Screensaver Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description https://www.google.com/ を開いている間、スクリーンセーバーを抑止する
// @author       anonymous
// @match        https://www.google.com/
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @license        public domain
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431338/Screensaver%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/431338/Screensaver%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let wl;
    const init = async () => {
        if (wl && !wl.released) {
            return true;
        }
        wl = null;
        if (document.visibilityState !== 'visible') {
            return;
        }
        console.log('WakeLock request');
        try {
            wl = await navigator.wakeLock.request('screen');
            console.log(wl);
            wl.addEventListener('release',e => {
                console.log('WakeLock released ');
                start();
            });
        } catch (e) {
            console.warn('e', e);
            return false;
        }
        console.log(' WakeLock locked');
        return true;
    };

    const start = async () => {
        if (!await init()) {
            setTimeout(start, 1000);
        }
    };

    start();
})();