// ==UserScript==
// @name         Redirect to Google Translator
// @namespace    GoogleTranslatorRedirector
// @version      7
// @description  Instead of using the small translator on https://google.com get redirected to https://translate.google.com
// @author       hacker09
// @include      *://www.google.*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://translate.google.com/&size=32
// @run-at       document-end
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/424065/Redirect%20to%20Google%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/424065/Redirect%20to%20Google%20Translator.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (document.querySelector("#tw-main") !== null) // If the small translator widget exists on the page
  { //Starts the if conditon
    var Redirect = setTimeout(function() { //Starts the settimeout function
      window.open('https://translate.google.com', '_self'); //Redirect to google translate
    }, 3000); //Redirect to https://translate.google.com in 3 secs

    document.body.insertAdjacentHTML('beforeend', '<div id="Redirect" style="width: 100vw; height: 100vh; z-index: 2147483647; background: rgb(0 0 0 / 36%); position: fixed; top: 0px; font-size: 50px; color: white;"><center>You\'ve 3 secs to click Anywhere if you don\'t want to be redirected</center></div>'); //Show an option to the user

    document.querySelector("#Redirect").onclick = function() { //If anywhere is clicked
      clearTimeout(Redirect); //Stop the redirecting process
      document.querySelector("#Redirect").style.display = 'none'; //Hide the option
    } //Stop the redirection if the user clicks anywhere
  } //Finishes the if conditon
})();