// ==UserScript==
// @name         Kissanime (Hserver) as Default or any else server
// @namespace    I don't have one
// @version      0.1
// @description  Automatically select Hserver as the default (change hserver to any server you want)
// @author       MOC (Me Of Course)
// @match        https://kissanime.com.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kissanime.com.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459757/Kissanime%20%28Hserver%29%20as%20Default%20or%20any%20else%20server.user.js
// @updateURL https://update.greasyfork.org/scripts/459757/Kissanime%20%28Hserver%29%20as%20Default%20or%20any%20else%20server.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the select element with id "selectServer"
    if (document.getElementById("selectServer")){
        var selectServer = document.getElementById("selectServer");
    }

    // Set the hserver option as the selected option
    if (selectServer.options[selectServer.selectedIndex].getAttribute("sv") !== "hserver"){
        for (var i = 0; i < selectServer.options.length; i++) {
            if (selectServer.options[i].getAttribute("sv") === "hserver") {
                selectServer.options[i].selected = true;
                break;
            }
        }
    }

    // Simulate a click on the select element to trigger the onchange event
    var event = new Event("change");
    selectServer.dispatchEvent(event);
})();