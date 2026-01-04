// ==UserScript==
// @name         vod-sports + olam hamedia countdown bypass
// @namespace    http://google.com/
// @version      0.1
// @description  vod-sports + olam hamedia countdown bypasser
// @author       yakov buzaglo
// @match        *://vod-sports.blogspot.co.il/*.html
// @include      *://www.olam-hamedia.tech/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31800/vod-sports%20%2B%20olam%20hamedia%20countdown%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/31800/vod-sports%20%2B%20olam%20hamedia%20countdown%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#timer-frame").hide();
    $("#action-frame").show();
        clearInterval(counter);
})();