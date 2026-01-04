// ==UserScript==
// @name         new BYR Add Free Torrents To Bookmark
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  byr站自动收藏免费种
// @include      */byr.pt/torrents.php
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472820/new%20BYR%20Add%20Free%20Torrents%20To%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/472820/new%20BYR%20Add%20Free%20Torrents%20To%20Bookmark.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function _x(STR_XPATH) {
        var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
        var xnodes = [];
        var xres = xresult.iterateNext();
        while (xres) {
            xnodes.push(xres);
            xres = xresult.iterateNext();
        }
        return xnodes;
    }
    var date = new Date();
    var date_str = String(date.getMonth()+1)+"-"+String(date.getDate());
    var STR_XPATH = '//tr[@class="free_bg"]/td[3]//div[@class="icons delbookmark ml-2"]/..';
    var as = _x(STR_XPATH);
    if (as.length > 0) {
        for(var i = 0; i < as.length; i++)
        {
            as[i].click();
        }
        setTimeout(function(){window.location.reload();}, 1000*5);
    } else {
        setTimeout(function(){window.location.reload();}, 1000 * 60);
    }
})();