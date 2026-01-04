// ==UserScript==
// @name         Youtube Large Guide
// @description  Hide guide menu by default on YouTube
// @namespace    https://greasyfork.org/users/237458
// @version      1.0
// @match        https://www.youtube.com/*
// @author       figuccio
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/412481/Youtube%20Large%20Guide.user.js
// @updateURL https://update.greasyfork.org/scripts/412481/Youtube%20Large%20Guide.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery;
    $(document).ready(function() {
        var url = undefined;
        var act = 2;

        setInterval(function() {
            if (act == 0 && document.location.toString() != url) {
                act = 1;
            }

            if (act == 1) {
                const Q = document.getElementsByTagName('yt-page-navigation-progress');
                if (!Q.length || !Q[0].hasAttribute('hidden')) {
                    return;
                }
                act = 2;
            }

            if (act == 2) {
                const guideButton = document.getElementById('guide-button');
                if (!guideButton) {
                    return;
                }

                let tmp = guideButton.getElementsByTagName('button');
                if (!tmp.length) {
                    return;
                }

                tmp = tmp[0];
                if (!tmp.hasAttribute('aria-pressed')) {
                    return;
                }

                if (tmp.getAttribute('aria-pressed') === 'true') {
                    guideButton.click();
                } else {
                    url = document.location.toString();
                    act = 0;
                    window.dispatchEvent(new Event('resize'));
                }
            }
        }, 1000);
    });
})();
