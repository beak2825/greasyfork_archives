// ==UserScript==
// @name         Redirect to Google Translator - Forced
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      3
// @description  Instantaneously redirects you to https://translate.google.com if you search for the word "translator" using your native language.
// @author       hacker09
// @include      *://www.google.*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://translate.google.com/&size=64
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/439581/Redirect%20to%20Google%20Translator%20-%20Forced.user.js
// @updateURL https://update.greasyfork.org/scripts/439581/Redirect%20to%20Google%20Translator%20-%20Forced.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (location.href.match(/tradutor|^.+trad&.+$|translate|translator|traductor/) !== null) //If the url has the words "tradutor" or "trad" or "translate" or "translator" or "traductor"
  { //Starts the if conditon
    window.location.replace("https://translate.google.com"); //Redirect to https://translate.google.com
  } //Finishes the if conditon
})();