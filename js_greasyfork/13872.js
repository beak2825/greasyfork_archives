// ==UserScript==
// @name         Noam Rubin 1
// @namespace    saqfish
// @version      1.0
// @description  Noam Rubin - Tell us if a place is a hotel
// @author       saqfish
// @include      https://www.mturkcontent.com/dynamic/hit*
// @include     https://s3.amazonaws.com/*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/13872/Noam%20Rubin%201.user.js
// @updateURL https://update.greasyfork.org/scripts/13872/Noam%20Rubin%201.meta.js
// ==/UserScript==
 window.onkeydown = function(e) {

      if (e.keyCode === 49) { 
            $("#Survey > div > section > fieldset > div:nth-child(2) > label").click();
           // $("#noRadio").attr('checked', false);
                $("#submitButton").click();
        }

     if (e.keyCode === 50 )  {
              $("#Survey > div > section > fieldset > div:nth-child(3) > label").click();
              //$("#yesRadio").attr('checked', false);
                $("#submitButton").click();
        }
     if (e.keyCode === 51)  {
              $("#Survey > div > section > fieldset > div:nth-child(4) > label").click();
              //$("#yesRadio").attr('checked', false);
                $("#submitButton").click();
        }
}
 