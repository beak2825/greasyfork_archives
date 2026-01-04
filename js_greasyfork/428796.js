// ==UserScript==
// @name         ATF Ignore Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes Excess Messages from ignored users.
// @author       You
// @match        https://chat.allthefallen.moe/*
// @icon         https://www.google.com/s2/favicons?domain=allthefallen.moe
// @downloadURL https://update.greasyfork.org/scripts/428796/ATF%20Ignore%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/428796/ATF%20Ignore%20Fix.meta.js
// ==/UserScript==

(function() {
    setInterval(function()
                {
        var IgnoredMessages = document.getElementsByClassName("message message--ignored");
        for (var i = 0; i < IgnoredMessages.length; i++){
            if (IgnoredMessages[i]){
                        IgnoredMessages[i].remove();
            }

        }
    }, 100);
})();