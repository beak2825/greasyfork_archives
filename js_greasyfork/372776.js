// ==UserScript==
// @name         一亩三分地 Filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  加油
// @author       You
// @match        http://www.1point3acres.com/bbs/forum.*
// @match        https://www.1point3acres.com/bbs/forum.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372776/%E4%B8%80%E4%BA%A9%E4%B8%89%E5%88%86%E5%9C%B0%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/372776/%E4%B8%80%E4%BA%A9%E4%B8%89%E5%88%86%E5%9C%B0%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var table = document.getElementById("threadlisttableid");
    // console.log(table.rows.length);    // debug

    for (var i = table.rows.length - 1; i > 0; i--) {
        var text = table.rows[i].innerHTML.toString();
        if (text.includes('在线笔试')){
            table.rows[i].remove();
            continue;
        }

        if (!text.includes('Google') && !text.includes('Youtube')){
            table.rows[i].remove();
        }
    }
})();