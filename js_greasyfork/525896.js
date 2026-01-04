// ==UserScript==
// @name         FreeBitco.in AutoRoll - only Premium User without Captcha
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Please use my Referal-Link https://freebitco.in/?r=1611399
// @author       Vulamapc
// @match        https://freebitco.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/525896/FreeBitcoin%20AutoRoll%20-%20only%20Premium%20User%20without%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/525896/FreeBitcoin%20AutoRoll%20-%20only%20Premium%20User%20without%20Captcha.meta.js
// ==/UserScript==

  var timeout = setTimeout("location.reload(true);",3630000);
      function resetTimeout() {
      clearTimeout(timeout);
      timeout = setTimeout("location.reload(true);",3630000);
                               }
          $(document).ready(function(){
          setInterval(function()
                      {
            //$('#free_play_form_button').trigger('click');
            if ($('#free_play_form_button').is(':visible'))
            {
                $('#free_play_form_button').trigger('click');
            }
                       },20000);
                                      }
                             );
