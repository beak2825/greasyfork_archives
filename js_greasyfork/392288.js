// ==UserScript==
// @name         wnacgReader
// @version      3.0.0
// @description  https://wnacg.org/photos-index* replace -index- to -slide-
// @author       Adokun
// @include      /^https?:\/\/w*\.?wnacg\.[a-z]*\/photos-index*/
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/392288/wnacgReader.user.js
// @updateURL https://update.greasyfork.org/scripts/392288/wnacgReader.meta.js
// ==/UserScript==


(function() {
    var str = location.href;
    str = str.replace(/index/g, 'slide');
    window.location = str;
})();
