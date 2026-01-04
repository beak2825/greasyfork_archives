    // ==UserScript==
    // @name         junon.io cheese test
    // @namespace    http://tampermonkey.net/
    // @version      IMPOSSIBLE
    // @description  just an annoying test...
    // @author       cheese
    // @match        junon.io
    // @require      http://code.jquery.com/jquery-3.4.1.min.js
    // @grant        none
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495632/junonio%20cheese%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/495632/junonio%20cheese%20test.meta.js
    // ==/UserScript==
    
    document.addEventListener("keydown", mod, false);
    
    function mod(i) {
      if (i.keyCode == "38") {//up arrow
        window.alert("hehehe close me~");
      }
      if (i.keyCode == "39") {//right arrow
        window.alert("hehehe close me~");
      }
      if (i.keyCode == "37") {//left arrow
        window.alert("hehehe close me~");
      }
      if (i.keyCode == "40") {
        window.alert("hehehe close me~");
      }
            if (i.keyCode == "87") {//up arrow
        window.alert("hehehe close me~");
      }
      if (i.keyCode == "65") {//right arrow
        window.alert("hehehe close me~");
      }
      if (i.keyCode == "83") {//left arrow
        window.alert("hehehe close me~");
      }
      if (i.keyCode == "68") {
        window.alert("hehehe close me~");
      }
    }