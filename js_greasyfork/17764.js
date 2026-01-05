// ==UserScript==
// @name           Show Hidden Comments
// @description    Shows comments that are under rating threshold
// @include        http://www.kongregate.com/games/*
// @version 0.0.1.20160829231542
// @namespace https://greasyfork.org/users/32649
// @downloadURL https://update.greasyfork.org/scripts/17764/Show%20Hidden%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/17764/Show%20Hidden%20Comments.meta.js
// ==/UserScript==

(function(){
    var count = 0;
    (function(){
        var all = document.evaluate("//span[@class='comment_content'][contains(@style,'display')][contains(@style,'none')]", document, null, 7, null);
        for (var i = 0, item; item = all.snapshotItem(i); i++) {
            item.style.display = 'block';
            item.style.color = '#999';
        }
        if (count++ < 10) {
            setTimeout(arguments.callee, 500);
        }
    }());
}());
