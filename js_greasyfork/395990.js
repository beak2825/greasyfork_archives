// ==UserScript==
// @name         TJUPT hilighter
// @namespace    YD
// @version      0.1
// @description  highlight free & halfdown torrents
// @author       YD
// @match        https://www.tjupt.org/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395990/TJUPT%20hilighter.user.js
// @updateURL https://update.greasyfork.org/scripts/395990/TJUPT%20hilighter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var trs = document.getElementsByClassName('torrents')[0].rows;
    for (var i = 1; i < trs.length; i++) {
        var tmp = trs[i].cells[1].children[0].rows[0].cells[1];
        if (tmp.getElementsByClassName('free').length == 1) {
            tmp.remove
            trs[i].style.backgroundColor='#ffea99';
            trs[i].cells[1].children[0].style.backgroundColor='#ffea99';
        }
        if (tmp.getElementsByClassName('halfdown').length == 1) {
            tmp.remove
            trs[i].style.backgroundColor='#b3b3ff';
            trs[i].cells[1].children[0].style.backgroundColor='#b3b3ff';
        }
    }
})();