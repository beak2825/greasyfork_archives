// ==UserScript==
// @name         Caps_Download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Caps dashboard download button
// @author       @nowaratn
// @match        https://atrops-web-eu.amazon.com/new_caps/fetch_data*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436905/Caps_Download.user.js
// @updateURL https://update.greasyfork.org/scripts/436905/Caps_Download.meta.js
// ==/UserScript==

setTimeout(function() {

    var caps_menu = document.createElement ('div');
    caps_menu.innerHTML = '<input type="button" value="Download" id="caps_download_id" style="font-size:24px;" /><input type="button" value="UP" id="caps_up_id" style="font-size:24px;" />';
    caps_menu.setAttribute ('id', 'caps_menu_id');
    caps_menu.setAttribute ('style', 'position:fixed;top:80%;right:10%;');
    document.getElementsByTagName("body")[0].appendChild(caps_menu);

    document.getElementById ("caps_download_id").addEventListener (
        "click", caps_download_id, false
    );

    document.getElementById ("caps_up_id").addEventListener (
        "click", caps_up_id, false
    );

    function caps_download_id (zEvent)
    {
        document.getElementById("formcsvCurrent Pickup").children[0].click();
        setTimeout(function() {
            document.getElementById("div-2_link").click();
            setTimeout(function() {
                document.getElementById("formcsv1 Pickup(s) Later").children[0].click();
                setTimeout(function() {
                    document.getElementById("div-1_link").click();
                },1000);
            },1000);
        },1000);
    }

    function caps_up_id (zEvent)
    {

    }



},3000);