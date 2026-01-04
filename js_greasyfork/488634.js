// ==UserScript==
// @name         BluePrint warning_message
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Elimina la barra blava d'avís de l'aula d'edició
// @author       Profe UOC
// @match        https://aula.uoc.edu/courses*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488634/BluePrint%20warning_message.user.js
// @updateURL https://update.greasyfork.org/scripts/488634/BluePrint%20warning_message.meta.js
// ==/UserScript==


(function() {
   document.getElementById("fixed_bottom").style.visibility = "hidden";
})();