// ==UserScript==
// @name         Falix 24/7 2.o
// @license MI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BEST FALIXNODES SCRIPT EVER
// @author       You
// @match        https://falixnodes.net/start
// @match        https://client.falixnodes.net/start
// @match        https://www.google.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=falixnodes.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469133/Falix%20247%202o.user.js
// @updateURL https://update.greasyfork.org/scripts/469133/Falix%20247%202o.meta.js
// ==/UserScript==

(function() {
    
   const start = ()=>{
       const server = 'game5.falixserver.net:65487'
    const input = document.querySelector("#IP")
    const buuutton = document.querySelector("#send")
    const captcha = document.elementFromPoint(49, 441)
    setTimeout(()=>{
    captcha.click()
     setTimeout(()=>{
         input.value = server
    buuutton.click()
     },5000)
    },15000)
   }
   start()
   setTimeout(()=>{
       if(window.location.href == "https://client.falixnodes.net/start"){
       location.href = "https://falixnodes.net/start"
       }
   }, 3600000)


})();