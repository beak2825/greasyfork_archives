// ==UserScript==
// @run-at document-start
// @name         LightShot Direct Link (prntscr.com)
// @version      1.02
// @description  Get directly the image url
// @author       Catarax
// @match        https://prnt.sc/*
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/2290
// @downloadURL https://update.greasyfork.org/scripts/36969/LightShot%20Direct%20Link%20%28prntscrcom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/36969/LightShot%20Direct%20Link%20%28prntscrcom%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var str = ""+window.location+"";
    var res = str.split("/");
   
   // Original URL redirector
   //window.location.href = "http://novagenda.fr/DEBUG/prnt.php?prnt="+res[3]+"";

   // More reliable url (99% uptime from wazer)
   window.location.href = "http://wazer.dk/lightshot/prnt.php?prnt="+res[3]+"";

})();