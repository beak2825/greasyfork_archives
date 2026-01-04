// ==UserScript==
// @name         Free Bitcoin
// @namespace     https://freebitco.in*
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://freebitco.in*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380763/Free%20Bitcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/380763/Free%20Bitcoin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // var timeout = setTimeout("location.reload(true);",3630000);
      function resetTimeout() {
      clearTimeout(timeout);
      timeout = setTimeout("location.reload(true);",3630000);
  }
         $(document).ready(function(){
         setInterval(function(){
            //$('#play_without_captchas_button').trigger('click');
            if ($('#play_without_captchas_button').is(':visible')) {
                $('#play_without_captchas_button').trigger('click');

          $(document).ready(function(){
          setInterval(function(){
            //$('#free_play_form_button').trigger('click');
            if ($('#free_play_form_button').is(':visible')) {
                $('#free_play_form_button').trigger('click');
            }
        },10000);
    });
            }
        },10000);
    });
})();