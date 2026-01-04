// ==UserScript==
// @name Cubecraft Var Retreiver
// @namespace Landviz' scripts
// @grant none
// @match https://www.cubecraft.net/?*
// @description Script 2/3 report statistics menu
// @version 0.0.1.20170811190059
// @downloadURL https://update.greasyfork.org/scripts/32222/Cubecraft%20Var%20Retreiver.user.js
// @updateURL https://update.greasyfork.org/scripts/32222/Cubecraft%20Var%20Retreiver.meta.js
// ==/UserScript==

var input = window.location.href.substring(27).split(';');


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

var date = new Date();
var time = date.getTime();

setCookie('handledReports', input[0], 365);
setCookie('openReports', input[1], 365);
setCookie('updateTime', time, 365);

window.close();