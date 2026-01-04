// ==UserScript==
// @name         Trade-In Disabler
// @namespace    https://greasyfork.org/users/1802-wes-pardus
// @description  Disables the ability to trade-in skills.
// @author       Wes
// @match        http*://artemis.pardus.at/overview_advanced_skills.php
// @match        http*://orion.pardus.at/overview_advanced_skills.php
// @match        http*://pegasus.pardus.at/overview_advanced_skills.php
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @version      1
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478445/Trade-In%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/478445/Trade-In%20Disabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

     var buttons = document.getElementsByTagName("input");

     if(buttons != null){
          var max = buttons.length;
          var x = 0;

          while(x < max){
              if(buttons[x].value == "invest"){
                  buttons[x].disabled = true;
              }
              x += 1;
          }
     }
})();