// ==UserScript==
// @name         25pp_ipa_download
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the 25pp world!
// @author       keulraesik
// @match        https://www.25pp.com/ios/*
// @home-url     https://greasyfork.org/en/scripts/41101-25pp-ipa-download
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41101/25pp_ipa_download.user.js
// @updateURL https://update.greasyfork.org/scripts/41101/25pp_ipa_download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var fix_download = function () {
        var buttons = document.getElementsByClassName("btn-install-x");
        console.log("buttons.length", buttons && buttons.length );
        if (buttons && buttons.length) {
            var button = buttons[0];
            button.onclick= function() {
                window.location = atob(button.getAttribute("appdownurl"));
            };
            // button.style.color="#FF00FF";
			button.innerText = button.innerText + "(直接下载ipa)";
        }
    };

    fix_download();
})();