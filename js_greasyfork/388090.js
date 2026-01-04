// ==UserScript==
// @name         HOJ Addon - Contest Enricher
// @namespace    https://twitter.com/r1825_java
// @version      0.1
// @description  HOJのコンテストの順位表を豊かにします。
// @author       r1825
// @match        https://hoj.hamako-ths.ed.jp/onlinejudge/contest/*/ranking
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388090/HOJ%20Addon%20-%20Contest%20Enricher.user.js
// @updateURL https://update.greasyfork.org/scripts/388090/HOJ%20Addon%20-%20Contest%20Enricher.meta.js
// ==/UserScript==

const hosei = 1;

(function() {
    'use strict';

    var list = document.getElementsByTagName('tr');

    $('thead > tr:first').append('<th >偏差値</th>');
    $('tbody tr').append('<td></td>');

    var sum = 0;

    for ( let i = 1; i < list.length; i++ ) {
        if ( i == 1 ) {
            list[i].setAttribute('style', 'background-image: linear-gradient(135deg, #FFD325, #FDEBA6, #FFE065, #FFCC00, #F0BE00);>');
        }
        else if ( i == 2 ) {
            list[i].setAttribute('style', 'background-image: linear-gradient(135deg, #E4E4E4, #EEEEEE, #E4E4E4, #CCCCCC, #C4C4C4);>');
        }
        else if ( i == 3 ) {
            list[i].setAttribute('style', 'background-image: linear-gradient(135deg, #F39800, #FE9C41, #FE9C41, #FE9C41, #F39800);>');
        }
        let td = list[i].getElementsByTagName('td');
        sum += parseInt(td[td.length-2].getElementsByTagName('font')[0].innerHTML) - hosei*(i-1);
    }

    var avg = sum / list.length;

    var bunsan = 0;

    for ( let i = 1; i < list.length; i++ ) {
        let td = list[i].getElementsByTagName('td');
        let diff = parseInt(td[td.length-2].getElementsByTagName('font')[0].innerHTML) - avg - hosei*(i-1);
        bunsan += diff*diff;
    }

    bunsan /= list.length;

    var sigma = Math.sqrt ( bunsan );

    for ( let i = 1; i < list.length; i++ ) {
        let td = list[i].getElementsByTagName('td');
        let diff = parseInt(td[td.length-2].getElementsByTagName('font')[0].innerHTML) - avg - hosei*(i-1);
        let hensa = 10 * diff / sigma + 50;
        td[td.length-1].innerHTML = hensa.toFixed(2);
    }

    // Your code here...
})();