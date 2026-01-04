// ==UserScript==
// @name         Хомяк
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  replace js file from hamsterkombat.io to ktnff.tech
// @author       Захарка
// @match        *://hamsterkombat.io/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/497566/%D0%A5%D0%BE%D0%BC%D1%8F%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/497566/%D0%A5%D0%BE%D0%BC%D1%8F%D0%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var target = 'https://hamsterkombat.io/js/telegram-web-app.js';
    var replacement = 'https://ktnff.tech/hamsterkombat/telegram-web-app.js';

    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src == target) {
            scripts[i].remove();
            GM_xmlhttpRequest({
                method: "GET",
                url: replacement,
                onload: function(response) {
                    var script = document.createElement('script');
                    script.textContent = response.responseText;
                    document.body.appendChild(script);
                }
            });
        }
    }
})();