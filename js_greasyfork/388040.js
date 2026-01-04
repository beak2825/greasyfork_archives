// ==UserScript==
// @name         HOJ Addon - Twitter Share for Submissions
// @namespace    https://twitter.com/r1825_java
// @version      0.2
// @description  HOJの提出状況詳細ページにTwitterシェアボタンを追加します
// @author       r1825
// @match        https://hoj.hamako-ths.ed.jp/onlinejudge/state/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388040/HOJ%20Addon%20-%20Twitter%20Share%20for%20Submissions.user.js
// @updateURL https://update.greasyfork.org/scripts/388040/HOJ%20Addon%20-%20Twitter%20Share%20for%20Submissions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".content").prepend('<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>');

    var tables = document.getElementsByTagName('table');
    var statusTable = tables[1];
    var problemName = statusTable.getElementsByTagName('tr')[1].getElementsByTagName('a')[0].innerHTML;
    var userName = statusTable.getElementsByTagName('tr')[2].getElementsByTagName('a')[0].innerHTML;
    var result = statusTable.getElementsByTagName('tr')[5].getElementsByTagName('span')[0].innerHTML.replace(/<.*\/i>/g,'');
    var urlProblem = statusTable.getElementsByTagName('tr')[1].getElementsByTagName('a')[0].href;
    //alert ( result );
    var bun = "";

    if ( document.cookie.indexOf("username") != -1 && document.cookie.indexOf(userName) != -1 ) {
        if ( "Accepted".indexOf(result) != -1 ) {
             bun = "HOJ: " + problemName + " をACしました";
        }
        else {
            bun = "HOJ: " + problemName + " に提出しましたが " + result.replace(/[a-z]*/g,'').replace(/\s/g,'') + " でした";
        }
    }
    else {
        if ( "Accepted".indexOf(result) != -1 ) {
             bun = userName + "さんの提出\n問題名: " + problemName + "\n結果: AC";
        }
        else {
            bun = userName + "さんの提出\n問題名: " + problemName + "\n結果: " + result.replace(/[a-z]*/g,'').replace(/\s/g,'');
        }
    }

    bun = bun + "\n問題リンク" + urlProblem;

    $("h1.content-subhead").append('<a href="//twitter.com/share" class="twitter-share-button" data-url="' + location.href + '" data-text="' + bun + '\n\n" data-lang="ja">Tweet</a>');

    // Your code here...
})();