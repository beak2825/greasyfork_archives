// ==UserScript==
// @name         Restream template button
// @namespace    http://tamermonkey.net
// @version      0.1
// @description  Adds a template button to restream.io that changes the title of videos
// @author       Jacqueb
// @match        https://restream.io/titles
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380660/Restream%20template%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/380660/Restream%20template%20button.meta.js
// ==/UserScript==

var d = new Date();

if(d.getHours() <= 12) {window.realtime = "Morning"} else {window.realtime = "Evening"};
var wd = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

setInterval(function() {if(document.getElementsByClassName("form-group")[0] != null) {if(document.getElementById("extrabutton") == null) {document.getElementsByClassName("sub-menu-block")[0].innerHTML += "<div style='margin-left: 120px; margin-top: 140px; position: absolute' id='extrabutton' id='mybutton' class='app-title-main__button'><input onclick='window.lol1 = true' type='button' class='button button_type_action' value='Template'></div>"}}},0)
setInterval(function() {document.getElementById("extrabutton").style.top = "180";
document.getElementById("extrabutton").style.left = "120"; if(window.lol1 == true) {makeDate();}},0);

setInterval(function() {if(document.getElementById("extrabutton") != null) {setStyles()}},0);
function setStyles() {
}

function makeDate() {
    document.getElementById("jsAllTitlesInput").value = 'PHPCG ' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + wd[d.getDay()] + ' ' + realtime + ' Service';
    window.lol1 = false;
}
