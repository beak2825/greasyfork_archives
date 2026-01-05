// ==UserScript==
// @name            Moonwalk&HDGo&Kodik FIX
// @name:en         Moonwalk&HDGo&Kodik FIX
// @namespace       FIX
// @version         0.8
// @description     Смотри фильмы и сериалы без ожидания!
// @description:en  Watch movies and serials without waiting!
// @match           *://*/*
// @run-at          document-start
// @grant           unsafeWindow
// @author          raletag
// @downloadURL https://update.greasyfork.org/scripts/21937/MoonwalkHDGoKodik%20FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/21937/MoonwalkHDGoKodik%20FIX.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var win = (unsafeWindow || window);
    function log (e) {
        console.log('Moonwalk&HDGo&Kodik FIX: ' + e + ' player in ' + win.location.href);
    }
    if (!win.canRunAds) Object.defineProperty(win, 'canRunAds', {
        value: true,
        configurable: false,
        enumerable: false,
        writable: false
    });
    document.addEventListener("DOMContentLoaded", function() {
        var tmp;
        if (win.adv_enabled !== undefined && win.condition_detected !== undefined) { // moonwalk
            log('Moonwalk');
            win.adv_enabled = false;
            win.condition_detected = false;
        } else if ((win.stat_url !== undefined && win.is_html5 !== undefined && win.is_wp8 !== undefined)) { // hdgo
            log('HDGo');
            document.body.onclick = null;
            tmp = document.querySelector('#swtf');
            if (tmp) tmp.style.display = 'none';
            if (win.banner_second !== undefined) win.banner_second = 0;
            if (win.$banner_ads !== undefined) win.$banner_ads = false;
            if (win.$new_ads !== undefined) win.$new_ads = false;
            if (win.createCookie !== undefined) win.createCookie('popup','true','999');
            if (win.canRunAds !== undefined && win.canRunAds !== true) win.canRunAds = true;
        } else if (win.MXoverrollCallback !== undefined && win.iframeSearch !== undefined) { // kodik
            log('Kodik');
            tmp = document.querySelector('.play_button');
            if (tmp) tmp.onclick = win.MXoverrollCallback.bind(window);
            win.IsAdBlock = false;
        }
    }, false);
})();