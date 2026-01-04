// ==UserScript==
// @name         Anti-Push
// @namespace    AntiPushByKKosty4kaGGGQfds5HDI65GIYQEG
// @version      1.0.0
// @description  push notifications should be removed from existance
// @author       KKosty4ka
// @match        *://*/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/452740/Anti-Push.user.js
// @updateURL https://update.greasyfork.org/scripts/452740/Anti-Push.meta.js
// ==/UserScript==

(function()
{
    Notification.requestPermission = function()
    {
        return new Promise(function(resolve, reject)
        {
            resolve("granted");
        });
    };
})();