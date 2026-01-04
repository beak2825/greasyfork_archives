// ==UserScript==
// @name         Find the result of game 59 minutes before match starts.
// @namespace    http://gitare.info/
// @version      0.3 beta
// @description  Find out final score 59 minutes before the match beggins. Be sure you are at most 59 minutes before the match
// @author       Gordan S. aka Mansfield
// @match        https://trophymanager.com/matches/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40206/Find%20the%20result%20of%20game%2059%20minutes%20before%20match%20starts.user.js
// @updateURL https://update.greasyfork.org/scripts/40206/Find%20the%20result%20of%20game%2059%20minutes%20before%20match%20starts.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var href = location.href;
    var matchID = href.match(/([^\/]*)\/*$/)[1];

var xmlhttp = new XMLHttpRequest();
var url = "https://trophymanager.com/ajax/match.ajax.php?id="+matchID;

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        var myArr2 = myArr.report;

//finaly we got this shit
var pepsi =myArr2[ Object.keys(myArr2).sort().pop() ];

        alert(pepsi[0].chance.text[0]);

    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();






})();