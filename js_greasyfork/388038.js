// ==UserScript==
// @name         HOJ Addon - Twitter Share
// @namespace    https://twitter.com/r1825_java
// @version      0.2
// @description  問題ページにTwitterのシェアボタンを追加します
// @author       r1825
// @match        https://hoj.hamako-ths.ed.jp/onlinejudge/problems/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388038/HOJ%20Addon%20-%20Twitter%20Share.user.js
// @updateURL https://update.greasyfork.org/scripts/388038/HOJ%20Addon%20-%20Twitter%20Share.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".main").prepend('<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>');


    var obj = document.getElementsByClassName("header")[0];
    var title = 'HOJ:'+ obj.getElementsByTagName('h1')[0].innerHTML;
title = title.replace(/\n/g, '');
    title = title.replace(/\s$/g, '');

    $(".main").prepend('<a href="//twitter.com/share" class="twitter-share-button" data-text="' + title + '\n\n" data-lang="ja">Tweet</a>');

    // Your code here...
})();