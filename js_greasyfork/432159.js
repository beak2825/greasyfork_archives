// ==UserScript==
// @name bespredell.fun
// @namespace Shamsi
// @include http://www.bespredels.ru/*
// // @grant none
// @description 0.1v
// @version 0.0.1.20210909194828
// @downloadURL https://update.greasyfork.org/scripts/432159/bespredellfun.user.js
// @updateURL https://update.greasyfork.org/scripts/432159/bespredellfun.meta.js
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
if(lnk = document.querySelector(["body > div:nth-child(4) > div:nth-child(5) > div:nth-child(7) > span > span > a"]))location.replace(lnk); //Наехать
if(lnk = document.querySelector(["body > div:nth-child(6) > div:nth-child(5) > div:nth-child(7) > span > span > a"]))location.replace(lnk); //Наехать 2
if(lnk = document.querySelector(["body > div:nth-child(6) > div:nth-child(15) > span > span > a"]))location.replace(lnk);//chikatilo
else if(lnk = document.querySelector(["body > div:nth-child(4) > div.alert > div > span > span > a"]))location.replace(lnk);
else if(lnk = document.querySelector(["body > div:nth-child(7) > div:nth-child(103) > span > span > a"]))location.replace(lnk);//yakarl
else if(lnk = document.querySelector(["body > div:nth-child(9) > div:nth-child(103) > span > span > a"]))location.replace(lnk);//yakarl2
else if(lnk = document.querySelector(["body > div:nth-child(4) > div:nth-child(6) > span > span > a > img"]))location.replace(lnk); //Ускорить за  80
else if(lnk = document.querySelector(["body > div:nth-child(6) > div.h-navig > table > tbody > tr > td:nth-child(5) > a"]))location.replace(lnk); //nerealnie 1
else if(lnk = document.querySelector(["body > div:nth-child(8) > div.h-navig > table > tbody > tr > td:nth-child(5) > a"]))location.replace(lnk); //nerealnie 2
else if(lnk = document.querySelector(["body > div:nth-child(10) > div.h-navig > table > tbody > tr > td:nth-child(5) > a"]))location.replace(lnk); //nerealnie 2
else if(lnk = getLinkByName(["Присоединиться", "Ηaнеcти yдар", "Восстановить за  84", "Ускорить за  80", "Ударить босса", "Присоединиться", "Нанести удар", "Восстановить за ", "Восстановить за  84", "Наехать"]))location.replace(lnk);
}
}, rand ); 