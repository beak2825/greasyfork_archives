// ==UserScript==
// @name         Fastbets - charts
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://fastbets.io/chart-bet
// @grant        none
// @namespace https://greasyfork.org/users/25633
// @downloadURL https://update.greasyfork.org/scripts/19899/Fastbets%20-%20charts.user.js
// @updateURL https://update.greasyfork.org/scripts/19899/Fastbets%20-%20charts.meta.js
// ==/UserScript==

$(document).ready(function() {
     $("#chat").hide();
     $("#footer").hide();
     $('#max-bet').click();
     $('#half-bet').click();
     setTimeout(function(){ $(".primary").click(); },1000);
});

var nlimit = -70;
var plimit = 50;

setInterval(function() {
    if ( Number($('#bet1-profit').html())> plimit || Number($('#bet1-profit').html()) < nlimit) {
        $('#bet1').click();
    } else if ( Number($('#bet2-profit').html()) > plimit || Number($('#bet2-profit').html()) < nlimit) {
        $('#bet2').click();
    } else if ( Number($('#bet3-profit').html()) > plimit || Number($('#bet3-profit').html()) < nlimit) {
        $('#bet3').click();
    }
},2000);
