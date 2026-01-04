// ==UserScript==
// @name		Narrow_AddBookmarkHeader
// @namespace	https://greasyfork.org/ja/users/211668-nozomi
// @version		1.0
// @description	「小説家になろう」のヘッダーにブックマークリンクを追加する
// @autho		nozomi
// @match		*://ncode.syosetu.com/*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/372070/Narrow_AddBookmarkHeader.user.js
// @updateURL https://update.greasyfork.org/scripts/372070/Narrow_AddBookmarkHeader.meta.js
// ==/UserScript==

(function() {

    var insertUl = document.getElementById("head_nav");
    var newLi = document.createElement("li");
    var aBookmark = document.createElement("a");
    var BookmarkText = document.createTextNode("ブックマーク");

    aBookmark.href = "https://syosetu.com/favnovelmain/list/";
    aBookmark.appendChild(BookmarkText);
    newLi.appendChild(aBookmark);
    insertUl.insertBefore(newLi, insertUl.children[1]);

}

)();