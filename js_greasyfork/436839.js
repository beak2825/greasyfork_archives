// ==UserScript==
// @name         Discord
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  world!
// @author       You
// @match        *://discord.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436839/Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/436839/Discord.meta.js
// ==/UserScript==



var i = 1;

function Discord() {
   setTimeout(function () {
   try{
       document.getElementsByClassName("contents-3ca1mk")[0].click();
      }
       catch{console.log("Кнопки нема")}


      i++;
      if (i < 10) {
         Discord();
      }
   }, 3000)
}

Discord()