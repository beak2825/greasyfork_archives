// ==UserScript==
// @name        atcoder_constraints_eraser
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description AtCoderの問題ページに記載されている制約を消すユーザースクリプトです
// @author      arad
// @match       https://atcoder.jp/contests/*/tasks/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/461798/atcoder_constraints_eraser.user.js
// @updateURL https://update.greasyfork.org/scripts/461798/atcoder_constraints_eraser.meta.js
// ==/UserScript==

(function () {

    var h3s = document.querySelectorAll('h3');
    var constraints = null;

    for(var i = 0;i < h3s.length;i++){
        if(h3s[i].textContent === "制約"){
            constraints = h3s[i].nextElementSibling;
            break;
        }
    }

    if (constraints !== null) {
        constraints.parentNode.removeChild(constraints.previousElementSibling);
        constraints.parentNode.removeChild(constraints);
    }

})();