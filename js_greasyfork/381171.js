// ==UserScript==
// @name         HOJ Addon - Ranking Colouriser
// @namespace    https://twitter.com/r1825_java
// @version      0.3
// @description  Hamako Online Judgeのランキングページを色付けします。
// @author       r1825
// @match        https://hoj.hamako-ths.ed.jp/onlinejudge/ranking*
// @downloadURL https://update.greasyfork.org/scripts/381171/HOJ%20Addon%20-%20Ranking%20Colouriser.user.js
// @updateURL https://update.greasyfork.org/scripts/381171/HOJ%20Addon%20-%20Ranking%20Colouriser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var list = document.getElementsByTagName('tr');

    for ( var i = 1; i < list.length; i++ ) {
        var solved = list[i].getElementsByTagName('td')[4].textContent;
        if ( parseInt(solved) >= 650 ) {
            list[i].setAttribute('style', 'background-image: linear-gradient(135deg, #FFD325, #FDEBA6, #FFE065, #FFCC00, #F0BE00);>');
        }
        else if ( parseInt(solved) >= 550 ) {
            list[i].setAttribute('style', 'background-image: linear-gradient(135deg, #E4E4E4, #EEEEEE, #E4E4E4, #CCCCCC, #C4C4C4);>');
        }
        else if ( parseInt(solved) >= 500 ) {
            list[i].setAttribute('style', 'background-color:#FFB2B2;>');
        }
        else if ( parseInt(solved) >= 450 ) {
            list[i].setAttribute('style', 'background-color:#FFD9B2;>');
        }
        else if ( parseInt(solved) >= 350 ) {
            list[i].setAttribute('style', 'background-color:#ECECB2;>');
        }
        else if ( parseInt(solved) >= 300 ) {
            list[i].setAttribute('style', 'background-color:#B2B2FF;>');
        }
        else if ( parseInt(solved) >= 250 ) {
            list[i].setAttribute('style', 'background-color:#B2ECEC;>');
        }
        else if ( parseInt(solved) >= 100 ) {
            list[i].setAttribute('style', 'background-color:#B2D9B2;>');
        }
        else if ( parseInt(solved) >= 50  ) {
            list[i].setAttribute('style', 'background-color:#D9C5B2;>');
        }
        else if ( parseInt(solved) >= 1   ) {
            list[i].setAttribute('style', 'background-color:#D9D9D9;>');
        }
        else {
            list[i].setAttribute('style', 'background-color:#FFFFFF;>');
        }
    }

    // Your code here...
})();