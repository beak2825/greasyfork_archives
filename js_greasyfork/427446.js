// ==UserScript==
// @name        switch rom
// @namespace   Violentmonkey Scripts
// @match       https://www.softcobra.com/*
// @version     1.1
// @description switch rom1
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/427446/switch%20rom.user.js
// @updateURL https://update.greasyfork.org/scripts/427446/switch%20rom.meta.js
// ==/UserScript==
(function(){
 let a = document.getElementsByTagName('td') 
 for(let i of a){
   if(i.innerText.length > 40){
     i.innerText = (CryptoJS.AES.decrypt(i.innerText,"/")).toString(CryptoJS.enc.Utf8) 
   }
 }
})();