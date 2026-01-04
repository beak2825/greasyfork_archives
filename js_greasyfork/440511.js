// ==UserScript==
// @name         Better replit editor
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Get the old and best replit editor!
// @author       @OfirApps on replit
// @match        https://replit.com/*
// @icon         https://replit.com/public/icons/favicon-196.png
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/440511/Better%20replit%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/440511/Better%20replit%20editor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ((window.location.href).includes("@")) { /* check if url is an actual codable repl*/
    if ((window.location.href).includes("?monaco=1")) { /* check if the url has ?Monaco=1*/
    //Nothing happens if it does have it
    } else { /* redirect the url Actions: */
     if ((window.location.href).includes("#")) { /* check if the url got an file specified like main.py*/
         var splittedurl = (window.location.href).split("#") /* split the url that contains the file*/
         window.location.href = splittedurl[0] + "?monaco=1#" + splittedurl[1] /* remake the url and redirect to it */
     } else { /* if it dosent have a file specfied in the url */
    window.location.href = window.location.href + "?monaco=1" /* switch to the simpler version of ?monaco=1*/
     }
    }
    }
})();