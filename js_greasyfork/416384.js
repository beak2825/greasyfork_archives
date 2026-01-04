// ==UserScript==
// @name         AtCoder-ngtkanaResult
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Turning Judge Results into Ngtkana words.
// @author       Harui
// @match        https://atcoder.jp/*submissions
// @match        https://atcoder.jp/*submissions/me
// @match        https://atcoder.jp/*submissions?f*
// @match        https://atcoder.jp/*submissions/me?f*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416384/AtCoder-ngtkanaResult.user.js
// @updateURL https://update.greasyfork.org/scripts/416384/AtCoder-ngtkanaResult.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ジャッジステータスについて: https://atcoder.jp/contests/practice/glossary
    var AC_message = "ながたかなは長いですから、天才とお呼びください";
    var WJ_message = "どきどきです";
    var WA_message = "細かいミスにも気づけないエンジニアはどなたですか？（泣）";

    var AC_elements = document.getElementsByClassName("label label-success");
    var WJ_elements = document.getElementsByClassName("label label-default");
    var WA_elements = document.getElementsByClassName("label label-warning");


    for (var i=0; i<AC_elements.length; i++){
        AC_elements[i].innerHTML = AC_message;
    }

    for (i=0; i<WJ_elements.length; i++){
        WJ_elements[i].innerHTML = WJ_message;
    }

    for (i=0; i<WA_elements.length; i++){
        WA_elements[i].innerHTML = WA_message;
    }


})();