// ==UserScript==
// @name         Pixiv Original Image Referer Fix
// @description  Adds dummy pixiv.net referer to bypass the pixiv's image hotlink protection
// @version      2016.05.16b
// @include      http://i*.pixiv.net/img-original*
// @run-at       document-start
// @author       err
// @namespace    https://greasyfork.org/en/users/43988-err
// @source       https://greasyfork.org/en/scripts/19738
// @downloadURL https://update.greasyfork.org/scripts/19738/Pixiv%20Original%20Image%20Referer%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/19738/Pixiv%20Original%20Image%20Referer%20Fix.meta.js
// ==/UserScript==

(function() {
    if (!document.referrer.includes("pixiv.net/")) {
        window.location.href = location.href;
    }
})();