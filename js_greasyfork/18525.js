// ==UserScript==
// @name         FIMFiction Mark Previous Read
// @namespace    http://jake.merdich.com/
// @version      1.0
// @description  Put links to mark previous chapters as read
// @author       Jake Merdich
// @match        http://www.fimfiction.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18525/FIMFiction%20Mark%20Previous%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/18525/FIMFiction%20Mark%20Previous%20Read.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var allChaps = $("i.chapter-read-icon:not(.chapter-read)");
    var allBtns = $("<i class=\"mark-prev-read\" title=\" ( Click to mark all chapters to here as read ) \" style=\"font-style: normal; cursor: pointer; margin-right: 5px;\">&#8613;</i> ").insertBefore(allChaps);

    allBtns.click(function(event){
        var target = $(event.target);
        var chap_btns = target.closest("ul.chapters").find("i.chapter-read-icon:not(.chapter-read)");
        chap_btns = chap_btns.slice(0,chap_btns.index(target.next())+1);
        chap_btns.each(function(_,target){$(target).prev().remove(); target.click();});
    });
})();