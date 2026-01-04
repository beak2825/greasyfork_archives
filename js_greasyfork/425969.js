// ==UserScript==
// @name         WhatsApp privacity blur filter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       Facu
// @match        https://web.whatsapp.com/
// @description  Put a blur effect on your chats and avoid peeping toms
// @icon         https://www.google.com/s2/favicons?domain=whatsapp.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/425969/WhatsApp%20privacity%20blur%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/425969/WhatsApp%20privacity%20blur%20filter.meta.js
// ==/UserScript==

waitForKeyElements("._199zF", function(e) {
    var elemento = $(e);
    elemento.css("filter", "blur(5px)");
});

GM_addStyle (`
   ._199zF {
      transition: .2s ease!important;
   }
   ._199zF:hover {
      filter: blur(0px)!important;
   }
`)