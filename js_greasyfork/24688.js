// ==UserScript==
// @name         yealink-caller
// @namespace    https://greasyfork.org/de/scripts/24688-yealink-caller/
// @version      0.2
// @description  try to take over the world!
// @author       Bernhard Kaszt
// @match        *://*/*
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @grant GM_log
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/24688/yealink-caller.user.js
// @updateURL https://update.greasyfork.org/scripts/24688/yealink-caller.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    function getNumber()
    {
        var number = null;
        var window = unsafeWindow;
        var document = window.document;

        if (window.getSelection) {
            number = window.getSelection().toString();
        } else if (document.getSelection) {
            number = document.getSelection().toString();
        } else {
            number = document.selection.createRange().text;
        }

        if (!number || number.trim().length <= 2) {
            number = window.prompt("Bitte enter a phone number:");
        }

        if (!number || number.trim().length <= 2) {
            return null;
        }

        number = number.toString().replace(/\(0\)/g, '');
        number = number.toString().replace(/\+/g, '00');
        number = number.replace(/\D/g,'');

        return number;
    }

    unsafeWindow.yealink_call = function(caller, ipAddress, password)
    {
        var number = getNumber();
        if (number) {
            var url = "http://admin:" + password + "@" + ipAddress + "/servlet?number=" + number + "&outgoing_uri=" + caller;
            GM_log("Calling number \"" + number + "\" @ " + ipAddress);
            GM_xmlhttpRequest({ method: "GET", url: url });
        }
    };
})();
