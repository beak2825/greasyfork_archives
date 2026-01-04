// ==UserScript==
// @name        sabit nick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   sex
// @author       mark
// @match       gartic.io/*
// @icon        https://pbs.twimg.com/media/FQwQQBOWUAEdDut?format=jpg&name=large
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543249/sabit%20nick.user.js
// @updateURL https://update.greasyfork.org/scripts/543249/sabit%20nick.meta.js
// ==/UserScript==
var nicks = ["xuanyuxa"];






function inv(metin,gorunmezkarakter,maksimum){var yenitext=metin;while(yenitext.length<maksimum){var pozisyon=Math.floor(Math.random()*(yenitext.length+1));yenitext=yenitext.slice(0,pozisyon)+gorunmezkarakter+yenitext.slice(pozisyon)}
return yenitext}
setInterval(()=>{var gorunmezkarakterr="឵";var bolge=document.querySelector('input[maxlength="18"]');if(bolge){var orjinal=bolge.value;var rastgele=nicks[Math.floor(Math.random()*nicks.length)];var yenideger=inv(rastgele,gorunmezkarakterr,18);if(yenideger!==orjinal){bolge.value=yenideger;var event=new Event('input',{bubbles:!0});event.simulated=!0;var valueTracker=bolge._valueTracker;if(valueTracker){valueTracker.setValue(orjinal)}
bolge.dispatchEvent(event)}}},1)