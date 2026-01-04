// ==UserScript==
// @name         TMO no Margin
// @namespace    http://realidadscans.org
// @version      2024-10-26
// @description  delete margin class in reader.
// @author       AngelXex
// @match        https://zonatmo.com/viewer/*/cascade
// @icon         https://www.google.com/s2/favicons?sz=64&domain=visortmo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502018/TMO%20no%20Margin.user.js
// @updateURL https://update.greasyfork.org/scripts/502018/TMO%20no%20Margin.meta.js
// ==/UserScript==

(function() {

     var element = document.getElementById("main-container");   
     element.classList.add("container-fluid");
     element.classList.add("p-0");
     element.style.maxWidth = "100%";

})();