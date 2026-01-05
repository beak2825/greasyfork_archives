// ==UserScript==
// @name        Good Bad People
// @namespace   gbppl
// @description Adds reputation buttons in users' profiles.
// @match       http://computercraft.ru/user/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13471/Good%20Bad%20People.user.js
// @updateURL https://update.greasyfork.org/scripts/13471/Good%20Bad%20People.meta.js
// ==/UserScript==



var addr = document.URL.split('/');
var id = addr[addr.length - 2].split("-")[0];
var user = document.getElementsByClassName("fn nickname")[0].innerHTML;
var curuser = document.getElementById("user_link").innerHTML.split(' &nbsp;<span id="user_link_dd"></span>')[0];
var str = "\"" + id + "\", \"" + user + "\"";
var nums = document.getElementsByClassName("reputation");
var repcnt = nums[0].innerHTML;
nums[0].innerHTML = "<a id='repup' class='repup' onclick='addRating(\"RepUp\", " + str + ");'href='javascript://'>+</a><a id='repdown' class='repdown' onclick='addRating(\"RepDown\", " + str + ");' href='javascript://'>-</a><a onclick='ajax_rep(\"RepShow\", " + str + ");'href='javascript://'><div class='subrep'>" + repcnt + "</div></a>";
if (curuser == user) {
  document.getElementById("repup").parentNode.removeChild(document.getElementById("repup"));
  document.getElementById("repdown").parentNode.removeChild(document.getElementById("repdown"));
}