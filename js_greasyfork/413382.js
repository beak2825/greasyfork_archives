    // ==UserScript==
    // @name         powerline.io impossible version
    // @namespace    http://tampermonkey.net/
    // @version      IMPOSSIBLE
    // @description  Powerline.io, but it's impossible...
    // @author       shed_modz_
    // @match        powerline.io
    // @require      http://code.jquery.com/jquery-3.4.1.min.js
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413382/powerlineio%20impossible%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/413382/powerlineio%20impossible%20version.meta.js
    // ==/UserScript==
    
    document.addEventListener("keydown", mod, false);
    
    function mod(i) {
      if (i.keyCode == "38") {//up arrow
        window.alert("IMPOSSIBLE~");
      }
      if (i.keyCode == "39") {//right arrow
        window.alert("IMPOSSIBLE~");
      }
      if (i.keyCode == "37") {//left arrow
        window.alert("IMPOSSIBLE~");
      }
      if (i.keyCode == "40") {
        window.alert("IMPOSSIBLE~");
      }
            if (i.keyCode == "87") {//up arrow
        window.alert("IMPOSSIBLE~");
      }
      if (i.keyCode == "65") {//right arrow
        window.alert("IMPOSSIBLE~");
      }
      if (i.keyCode == "83") {//left arrow
        window.alert("IMPOSSIBLE~");
      }
      if (i.keyCode == "68") {
        window.alert("IMPOSSIBLE~");
      }
    }