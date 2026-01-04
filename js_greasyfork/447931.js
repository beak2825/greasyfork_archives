// ==UserScript==
// @name         PT Delete Bookmarks
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  PT站清空所有收藏
// @include      */torrents.php?inclbookmarked=1*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/447931/PT%20Delete%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/447931/PT%20Delete%20Bookmarks.meta.js
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
    var STR_XPATH = '//img[@class="bookmark"]/..';
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