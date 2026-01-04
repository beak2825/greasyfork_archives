// ==UserScript==
// @name         ATF chat Spam
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Spam ATF chat
// @author       GorePrince <3
// @match        https://chat.allthefallen.moe/*
// @icon         https://www.google.com/s2/favicons?domain=allthefallen.moe
// @grant        window.close
// @grant        window.open
// @grant        window.focus
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/428790/ATF%20chat%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/428790/ATF%20chat%20Spam.meta.js
// ==/UserScript==

(function() {
    if (GM_getValue("spamEnabled",false)){

        document.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            var TextArea = document.querySelectorAll("textarea")[0]
            TextArea.value = GM_getValue("SpamText","");
        }
    });
    }

                GM_registerMenuCommand("Toggle Spam", () =>
                           {
        if (confirm("Toggle Spam on Enter? \n Spam Enalbed: " + GM_getValue("spamEnabled",false))){
                    GM_setValue("spamEnabled",!GM_getValue("spamEnabled",false));
            window.location.reload();
        }
    });https://pastebin.com/f9659HUx
        GM_registerMenuCommand("Change Spam Text", () =>
                           {
        GM_setValue("SpamText",prompt("Set new Spam Text",GM_getValue("SpamText","")));
    });

})();