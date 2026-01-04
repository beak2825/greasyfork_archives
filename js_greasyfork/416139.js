// ==UserScript==
// @name         Color Changer (NOT WORKING)
// @namespace    Super Color Name Changer
// @version      1.0.6
// @description  NOT WORKING ANY MORE! 
// @author       Arimas
// @license      MIT
// @match        *://agma.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416139/Color%20Changer%20%28NOT%20WORKING%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416139/Color%20Changer%20%28NOT%20WORKING%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

   var message = function (message, isError) {
      var curser = document.querySelector('#curser');

      curser.textContent = message;
      curser.style.display = 'block';
      curser.style.color = isError ? 'rgb(255, 0, 0)' : 'rgb(0, 192, 0)';

      window.setTimeout(function () {
        curser.style.display = 'none';
      }, 5000);
    };


    var colorInterval;

    window.addEventListener('miracleCommand', function(commandEvent) {
        if (commandEvent.command === '/blink') {
           $('#chtbox').val('').focus();
          if (colorInterval) {
              clearInterval(colorInterval);
              colorInterval = null;
              message('Nickname color blinking off');
          } else {
              colorInterval = setInterval(function(){document.getElementById('cGoldName').dispatchEvent(new MouseEvent("click"));},250);
              message('Nickname color blinking on');
          }
        }
    });
})();