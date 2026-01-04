// ==UserScript==
// @name         Auto Subs Enabler - CrunchyRoll
// @namespace    AutoCrunchyRollSubs
// @version      4
// @description  Auto enable subs on your native language by default on CrunchyRoll.
// @author       hacker09
// @match        https://www.crunchyroll.com/*
// @exclude      https://www.crunchyroll.com/search?q=*
// @icon         https://www.crunchyroll.com/favicons/apple-touch-icon.png
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/428876/Auto%20Subs%20Enabler%20-%20CrunchyRoll.user.js
// @updateURL https://update.greasyfork.org/scripts/428876/Auto%20Subs%20Enabler%20-%20CrunchyRoll.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (GM_getValue('NativeLanguage') === undefined) { //If the NativeLanguage variable isn't yet defined
    var NativeLanguage = prompt("What's your native language?\n1 English (UK)\n2 Español (América Latina)\n3 Español (España)\n4 Português (Brasil)\n5 Português (Portugal)\n6 Français (France)\n7 Deutsch\n8 Arabic\n9 Italiano\n10 Русский"); //Give an option to the user
    GM_setValue("NativeLanguage", NativeLanguage); //Store the user choice
    location.reload(); //Reload
  } //Finishes the if condition

  if (location.href.match(/(.com\/)(en-gb|es|es-es|pt-br|pt-pt|fr|de|ar|it|ru)/) === null) { //If the url has no language settings
    switch (GM_getValue("NativeLanguage")) { //Starts the switch condition
      case '1': //If the user chose the option 1
        document.location = location.href.replace('.com/', '.com/en-gb/'); //Add the language setting to the url
        break; //Stop
      case '2': //If the user chose the option 2
        document.location = location.href.replace('.com/', '.com/es/'); //Add the language setting to the url
        break; //Stop
      case '3': //If the user chose the option 3
        document.location = location.href.replace('.com/', '.com/es-es/'); //Add the language setting to the url
        break; //Stop
      case '4': //If the user chose the option 4
        document.location = location.href.replace('.com/', '.com/pt-br/'); //Add the language setting to the url
        break; //Stop
      case '5': //If the user chose the option 5
        document.location = location.href.replace('.com/', '.com/pt-pt/'); //Add the language setting to the url
        break; //Stop
      case '6': //If the user chose the option 6
        document.location = location.href.replace('.com/', '.com/fr/'); //Add the language setting to the url
        break; //Stop
      case '7': //If the user chose the option 7
        document.location = location.href.replace('.com/', '.com/de/'); //Add the language setting to the url
        break; //Stop
      case '8': //If the user chose the option 8
        document.location = location.href.replace('.com/', '.com/ar/'); //Add the language setting to the url
        break; //Stop
      case '9': //If the user chose the option 9
        document.location = location.href.replace('.com/', '.com/it/'); //Add the language setting to the url
        break; //Stop
      case '10': //If the user chose the option 10
        document.location = location.href.replace('.com/', '.com/ru/'); //Add the language setting to the url
        break; //Stop
    } //Finishes the switch conditions
  } //Finishes the if condition
})();