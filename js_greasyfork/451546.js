// ==UserScript==
// @name         Ekşi Sözlük Ads Blocker
// @namespace    https://eksisozluk.com/
// @version      0.1
// @description  eksisozluk.com ads blocker
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eksisozluk.com
// @author       Yasin Kuyu
// @license MIT
// @date         18/09/2022
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @include      *eksisozluk.com/*

// @downloadURL https://update.greasyfork.org/scripts/451546/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20Ads%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/451546/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20Ads%20Blocker.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var remove_ads = true;

    if(remove_ads){
        document.querySelectorAll(".under-top-ad").forEach(e => e.remove());
        document.querySelectorAll(".ad-double-click").forEach(e => e.remove());
    }

})();