// ==UserScript==
// @name         Ticket view fix
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Launches the ticket in a faster view
// @author       Marian Danilencu
// @include       *admin.wayfair.com/tracker/views/89.php*
// @include       *admin.wayfair.com/tracker/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396084/Ticket%20view%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/396084/Ticket%20view%20fix.meta.js
// ==/UserScript==
var ticketid2=document.querySelectorAll("a")[0].innerText
document.getElementById("page_header").style.display="none";
var src1="https://admin.wayfair.com/tracker/frames/88.php?PrtID="
var src2="&t=&View=89#";
var ticketid=document.getElementsByClassName("c1")[1].innerText
var body=document.getElementById("hd");

window.location.replace(src1+ticketid+src2);