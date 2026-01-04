// ==UserScript==
// @name         Add jquery if not exist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416386/Add%20jquery%20if%20not%20exist.user.js
// @updateURL https://update.greasyfork.org/scripts/416386/Add%20jquery%20if%20not%20exist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = null;

    var jQueryCode = function(){
        $ = window.jQuery;
    };

   //this code will check to see if jquery exists; if not it will create it .
    if(window.jQuery) jQueryCode();
    else{
      var script = document.createElement('script');
      document.head.appendChild(script);
      script.type = 'text/javascript';
      script.src = "http://code.jquery.com/jquery-3.4.1.min.js";

      script.onload = jQueryCode;
    }
})();