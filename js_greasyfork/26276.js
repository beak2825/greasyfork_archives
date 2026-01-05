// ==UserScript==
// @id             Kill Hatena Keyword
// @name           Kill Hatena Keyword
// @version        0.10.20171005
// @namespace      https://greasyfork.org/ja/users/6866-ppppq
// @author         ppppq
// @description    はてなのキーワードリンクを消し、通常のテキストに換える。
// @match          *://anond.hatelabo.jp/*
// @match          *://*.hatena.ne.jp/*
// @match          *://*.hatenablog.jp/*
// @match          *://*.hatenablog.com/*
// @match          *://*.hatenadiary.com/*
// @match          *://*.hatenadiary.jp/*
// @match          *://*.hateblo.jp/*
// @exclude        *://d.hatena.ne.jp/keyword/*
// @run-at         document-ready
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/26276/Kill%20Hatena%20Keyword.user.js
// @updateURL https://update.greasyfork.org/scripts/26276/Kill%20Hatena%20Keyword.meta.js
// ==/UserScript==

var d = document;

killKeywords(d);
d.addEventListener('AutoPagerize_DOMNodeInserted', function(aEvent) {
    var doc = aEvent.target;

    killKeywords(doc);
});


function killKeywords(aDoc) {
    var doc = aDoc;
    var keywords = doc.querySelectorAll('a[class*="keyword"]');

    for (var keyword of keywords) {
        var text = d.createTextNode(keyword.textContent);

        keyword.parentNode.replaceChild(text, keyword);
    }
}