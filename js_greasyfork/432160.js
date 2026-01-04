// ==UserScript==
// @name avtoriteti
// @namespace Shamsi
// @include http://www.bespredels.ru/*
// // @grant none
// @description 0.2v avtoriteti
// @version 0.0.1.20210909194937
// @downloadURL https://update.greasyfork.org/scripts/432160/avtoriteti.user.js
// @updateURL https://update.greasyfork.org/scripts/432160/avtoriteti.meta.js
// ==/UserScript==

if( localStorage.enable == undefined)localStorage.enable = 1;

var set = {

enable : parseInt(localStorage.enable),
greedMode : true,
parseOt : -400,
autoParse : true,
debug : true,
almaz : true
},
rand = 1,
title = document.title,
bodyTxt = document.body.innerText,
linksArr = ["Восстановить за ", "Ηaнеcти yдар", "Восстановить за ", "Ударить босса", "Присоединиться"];

var newDiv = document.createElement('div');
newDiv.id = "tooooogleee";
newDiv.style.position = "absolute";
newDiv.style.top = 0;
newDiv.style.right = 0;
newDiv.style.opacity = "0.6";
newDiv.style.padding = "1em 0";
newDiv.style.background = "#2c3e50";
newDiv.innerHTML= "<span style='padding:1.5em;'>"+(parseInt(localStorage.enable) ? "on" : "off")+"<span>";
newDiv.onclick = function(){
localStorage.enable = (parseInt(localStorage.enable) ? 0 : 1);
set.enable = localStorage.enable;
document.querySelector("#tooooogleee").innerHTML= "<span style='padding:1.5em;'>"+(parseInt(localStorage.enable) ? "on" : "off")+"<span>";
};
document.body.appendChild(newDiv);

function getLinkByName(arr) {
function linkTester(name) {
return ~link.innerText.toLowerCase().indexOf(name.toLowerCase());
}
for (i = 0; link = document.links[i]; i++) {
if (arr.some(linkTester)) {
return link.href;
}
}
return null;
}

function isNumeric(n) {
return !isNaN(parseFloat(n)) && isFinite(n);
}

function getRandom(min, max){
return parseInt(Math.random() * (max - min) + min);
}

setTimeout( function() {
if(set.enable){
  if(lnk = document.querySelector(["body > div:nth-child(7) > div.h-navig > table > tbody > tr > td:nth-child(3) > a"]))location.replace(lnk); // slojnie
  if(lnk = document.querySelector(["body > div:nth-child(7) > div:nth-child(18) > span > span > a"]))location.replace(lnk);
  if(lnk = document.querySelector(["body > div.content > div.gig > div.block.center > span > span > a"]))location.replace(lnk);
  if(lnk = document.querySelector(["body > div:nth-child(11) > div.h-navig > table > tbody > tr > td:nth-child(3) > a"]))location.replace(lnk);//slojnie 2
  if(lnk = document.querySelector(["body > div:nth-child(13) > div.h-navig > table > tbody > tr > td:nth-child(3) > a"]))location.replace(lnk);//slojnie3
  if(lnk = document.querySelector([""]))location.replace(lnk);
  if(lnk = document.querySelector([""]))location.replace(lnk);
  if(lnk = document.querySelector([""]))location.replace(lnk);
  if(lnk = document.querySelector([""]))location.replace(lnk);
  if(lnk = document.querySelector([""]))location.replace(lnk);
  if(lnk = document.querySelector([""]))location.replace(lnk);
if(lnk = getLinkByName(["Присоединиться", "Ηaнеcти yдар", "Восстановить за  84", "Ускорить за  80", "Ударить босса", "Присоединиться", "Нанести удар", "Восстановить за ", "Ударить босса"]))location.replace(lnk);
}
}, rand ); 