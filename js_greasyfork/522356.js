// ==UserScript==
// @name         Premium Airconsole
// @namespace    http://tampermonkey.net/
// @version      2024-12-31
// @license      MIT
// @description  Premium para Airconsole
// @author       YoBat
// @match        https://www.airconsole.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=airconsole.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522356/Premium%20Airconsole.user.js
// @updateURL https://update.greasyfork.org/scripts/522356/Premium%20Airconsole.meta.js
// ==/UserScript==
var c = 0;
document.addEventListener("beforescriptexecute",async(e)=>{
    if(c>0) return;
    let data =e.target.textContent;
    if (data.search("user_data") != -1) { // Busca los ajustes
      data = data.replace('"premium": false','"premium": true') // cambia a premium
      e.preventDefault()
      e.stopPropagation()
      c++;
      const scr = document.createElement("script")
      scr.type="text/javascript"
      scr.textContent=data;
      document.querySelector("head").appendChild(scr)
      console.log("Premium enabled")

    }

})