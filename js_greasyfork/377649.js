// ==UserScript==
// @name         KissAnime - AreYouHuman-Skipper (broken)
// @namespace    http://tampermonkey.net/
// @version      1.03.1
// @description  Skips the "Are you human?" captcha's on KissAnime. This will only allow you to watch anime from HydraX. 
// @icon         https://imgur.com/uUILQXQ.png
// @author       Anonymous
// @include      https://kissanime.ru/Special/AreYouHuman*
// @include      http://kissanime.ru/Special/AreYouHuman*
// @grant        GM_xmlhttpRequest
// @license      MIT; https://mit-license.org/
// @downloadURL https://update.greasyfork.org/scripts/377649/KissAnime%20-%20AreYouHuman-Skipper%20%28broken%29.user.js
// @updateURL https://update.greasyfork.org/scripts/377649/KissAnime%20-%20AreYouHuman-Skipper%20%28broken%29.meta.js
// ==/UserScript==

var formVerify = document.getElementById("formVerify1");
var specialButton;
var formVerifyDiv;
var barContent;

if(formVerify){
  specialButton = formVerify.getElementsByClassName('specialButton');
  if(specialButton){
    formVerifyDiv = formVerify.getElementsByTagName("div");
    for(var i=1; i<formVerifyDiv.length; i++){
      formVerifyDiv[i].style.display = "none";
    }
    formVerifyDiv[0].innerHTML = "<font color='green'>YES I AM!</font>";
    specialButton[0].click();
  }
}

if(!specialButton){
  barContent = document.getElementById("container").getElementsByClassName("barContent");
  barContent[0].innerHTML = "<font color='red'>Yikes! It looks like we hit a snag!</font>";
}