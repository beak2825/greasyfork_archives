  
  // ==UserScript==
// @name         Speed Dial Clean
// @namespace    Yan
// @version      Alpha 1
// @description  Deixa o Speed Dial do opera mais bonito
// @author       yan
// @match        Opera
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367787/Speed%20Dial%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/367787/Speed%20Dial%20Clean.meta.js
// ==/UserScript==
function deletar(){
    document.getElementById("web-search").remove();
    document.getElementById("plus").remove();
  }

  if (document.title.includes("Dial")) {
      window.addEventListener("load",deletar);
      
  }