// ==UserScript==
// @name         Taming.io zoom out
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Zoom Out idk if it works
// @author       Phantasm
// @match        *://taming.io/
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js
// @grant        none
// @antifeature  zoom out
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500194/Tamingio%20zoom%20out.user.js
// @updateURL https://update.greasyfork.org/scripts/500194/Tamingio%20zoom%20out.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function() {
  


  var scriptTag = document.querySelector("script[src*='taming.io']");
  if (scriptTag) {
    
    var scriptText = scriptTag.textContent;
    


    scriptText = scriptText.replace(/const = `<svg id="svg" width="1920" height="1080" style="display: none">/g, 'const  = `<svg id="svg" width="3840" height="2160" style="display: none">');
    



    var newScriptTag = document.createElement("script");
    newScriptTag.textContent = scriptText;

    scriptTag.parentNode.replaceChild(newScriptTag, scriptTag);
  }
});