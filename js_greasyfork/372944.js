// ==UserScript==
// @name         Rabb.it automatic login.
// @namespace    RabbitAutoLogin
// @version      1.1
// @description  Automatic Login to rabb.it
// @author       WFT
// @match        *://*.rabb.it/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372944/Rabbit%20automatic%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/372944/Rabbit%20automatic%20login.meta.js
// ==/UserScript==

var EMAIL="EMAIL";
var PASS="PASSWORD";

setTimeout(
  function()
  {
      if (EMAIL != "EMAIL" && PASS != "PASSWORD") {
           // $(".switch").click();
            $('.switch').click();
            $( ".emailOrUserNameInput" ).val(EMAIL);
            $( ".passwordInput" ).val(PASS);
            $('input[id=checkRemember]').attr('checked', false);
            $(".signInBtn disabled").attr('class', 'signInBtn');
            $(".signInBtn").click();
        } else {
            alert("TamperMonkey script is active, it seems like you have forgotten to input EMAIL/PASSWORD for automatic logins.")
        }
  }, 1200);

