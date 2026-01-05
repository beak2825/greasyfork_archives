// ==UserScript==
// @name         Ben Mones 1
// @namespace    saqfish
// @version      1.0
// @description  Ben Mones
// @description  Validate an image. 
// @author       saqfish
// @include      https://www.mturkcontent.com/dynamic/hit*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/13677/Ben%20Mones%201.user.js
// @updateURL https://update.greasyfork.org/scripts/13677/Ben%20Mones%201.meta.js
// ==/UserScript==
 window.onkeydown = function(e) {

      if ((e.keyCode === 49) || (e.keyCode === 97)) { 
            $("#Other > div > section > fieldset > div:nth-child(2) > label").click();
           // $("#noRadio").attr('checked', false);
                //$("#submitButton").click();
        }

     if ((e.keyCode === 50) || (e.keyCode === 98))  {
              $("#Other > div > section > fieldset > div:nth-child(3) > label").click();
              //$("#yesRadio").attr('checked', false);
                $("#submitButton").click();
        }
}