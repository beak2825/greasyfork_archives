// ==UserScript==
// @name         HOJ Addon - Standard Deviation
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hamako Online Judgeのランキングページで、Solved数による偏差値を表示します。
// @author       r1825
// @match        https://hoj.hamako-ths.ed.jp/onlinejudge/ranking*
// @downloadURL https://update.greasyfork.org/scripts/388029/HOJ%20Addon%20-%20Standard%20Deviation.user.js
// @updateURL https://update.greasyfork.org/scripts/388029/HOJ%20Addon%20-%20Standard%20Deviation.meta.js
// ==/UserScript==

const target = 4;

(function() {
    'use strict';

    var list = document.getElementsByTagName('tr');

    $('thead > tr:first').append('<th >偏差値</th>');
    $('tbody tr').append('<td></td>');

    var sum = 0;

    for ( let i = 1; i < list.length; i++ ) {
        let solved = list[i].getElementsByTagName('td')[target].textContent;
        sum += parseInt(solved);
    }

    var avg = sum / list.length;

    var bunsan = 0;

    for ( let i = 1; i < list.length; i++ ) {
        let solved = list[i].getElementsByTagName('td')[target].textContent;
        let diff = parseInt(solved) - avg;
        bunsan += diff*diff;
    }

    bunsan /= list.length;

    var sigma = Math.sqrt ( bunsan );

    for ( let i = 1; i < list.length; i++ ) {
        let solved = list[i].getElementsByTagName('td')[target].textContent;
        let diff = parseInt(solved) - avg;
        let hensa = 10 * diff / sigma + 50;
        let td = list[i].getElementsByTagName('td');
        td[8].innerHTML = hensa.toFixed(2);
    }


    // Your code here...
})();