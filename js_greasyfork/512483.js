// ==UserScript==
// @name         [New] bitcoinker
// @namespace    http://tampermonkey.net/
// @version      2024-10-17
// @description  We are not looking for easy ways
// @author       Dank Odze
// @match        https://bitcoinker.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitcoinker.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512483/%5BNew%5D%20bitcoinker.user.js
// @updateURL https://update.greasyfork.org/scripts/512483/%5BNew%5D%20bitcoinker.meta.js
// ==/UserScript==

(function() {
    'use strict';
function soundClick() {
  var audio = new Audio(); // Создаём новый элемент Audio
  audio.src = "https://bitcoinker.com/wp-content/plugins/99bitcoins-btc-faucet/assets/beep.wav"; // Указываем путь к звуку "клика"
  audio.autoplay = true; // Автоматически запускаем
}
if(document.querySelector("#post-2 > div.the99btc-bf.t99f-6448.form > form > div:nth-child(1)").textContent.includes('Satoshi')) {
	soundClick();
    setTimeout(() => { soundClick(); }, 200)
}

function clickMy() {
var rec=document.getElementsByName("claim_coins");
var posX,posY;
for (var $i = 0; $i < 11; $i++) {
var rect = document.querySelector('\#'+rec[$i].id);
var position = {
                left: rect.offsetLeft,
                top: rect.offsetTop,
            };

//console.log(rec);
posX = position.left;
posY = position.top;
console.log(posX+":"+posY);
if(posX!=0) {
	console.log('\#'+rec[$i].id);
	document.querySelector('\#'+rec[$i].id).click();
}

rec[$i].id = rec[$i].id.substring(0, rec[$i].id.length-1) + $i;

}
}
 function checkRecaptcha() {
        const recaptchaFrame = document.querySelector("iframe[title='reCAPTCHA']");
        if (recaptchaFrame) {
            return window.grecaptcha.getResponse().length !== 0;
        }
        return false;
    }
if(document.getElementsByClassName("timer").length==1) {
    let s = document.querySelector("#post-2 > div.the99btc-bf.t99f-6448.form > form > div:nth-child(1)").textContent;
    if(Number(s.match(/\d+/g)[7])>=Number(s.match(/\d+/g)[8])) window.location.href = "https://bitcoinker.com/check/?the99btcbfaddress=15qxbwbQyAKviof6npDZ5mE7YLHN7P2AXz&t99fid=6448";
const word = document.querySelector("#post-2 > div.the99btc-bf.t99f-6448.form > form > div:nth-child(1)").textContent;
const pos = word.indexOf('/');
console.log(word.slice(pos-4, pos+6));
s = word.slice(pos-4, pos+6);
console.log(s.match(/\d+/g)[0]);
console.log(s.match(/\d+/g)[1]);
if(Number(s.match(/\d+/g)[0])>=Number(s.match(/\d+/g)[1])) window.location.href = "https://bitcoinker.com/check/?the99btcbfaddress=15qxbwbQyAKviof6npDZ5mE7YLHN7P2AXz&t99fid=6448";
}

if(document.getElementsByClassName("timer").length==0){
console.log('Timet off');
    var intervalID = setInterval(function() {
    //	if(grecaptcha.getResponse()!='') {
	if(checkRecaptcha()) {
		//clearInterval(intervalID);
        console.log('click');
        setTimeout(() => { clickMy(); }, 1200)
	}
}, 5000)
}})();