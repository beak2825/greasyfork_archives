// ==UserScript==
// @name         HOJ Addon - Contest Checkmark Colouriser
// @namespace    https://twitter.com/r1825_java
// @version      0.2
// @description  Hamako Online Judgeのコンテストの問題一覧において、チェックマークに色がつかないバグを修正します。
// @author       r1825
// @match        https://hoj.hamako-ths.ed.jp/onlinejudge/contest/*/problems
// @downloadURL https://update.greasyfork.org/scripts/381170/HOJ%20Addon%20-%20Contest%20Checkmark%20Colouriser.user.js
// @updateURL https://update.greasyfork.org/scripts/381170/HOJ%20Addon%20-%20Contest%20Checkmark%20Colouriser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var list = document.getElementsByTagName('i');
    for ( var i = 0; i < list.length; i++ ) {
        if ( list[i].className == 'fa fa-check' ) {
            list[i].setAttribute('style', 'color: blue;>');
        }
    }

    // Your code here...
})();