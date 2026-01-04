// ==UserScript==
// @name         Active Control Games
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Removes old games from location select
// @author       You
// @match        https://control.intelligenthealth.co.uk/Locations
// @icon         https://www.google.com/s2/favicons?sz=64&domain=intelligenthealth.co.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487234/Active%20Control%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/487234/Active%20Control%20Games.meta.js
// ==/UserScript==

(function() {

  var select = document.getElementById("SchemeID");
  for(var i = select.options.length - 1 ; i >= 0 ; i--) {
      var option = select.options[i].value;
      if (option < 149) {
           select.remove(i);
      }
  }

})();