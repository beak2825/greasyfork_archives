// ==UserScript==
// @name           ShowTown
// @description    Moves the UR and place update windows down 40px so the town name is not covered up!
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.0.1
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         Rick Zabel '2015
// @license        MIT/BSD/X11
// @downloadURL https://update.greasyfork.org/scripts/10764/ShowTown.user.js
// @updateURL https://update.greasyfork.org/scripts/10764/ShowTown.meta.js
// ==/UserScript==
function ShowTown() {
    // Check if WME is loaded, if not, waiting a moment and checks again. if yes init ShowTown
    try {
        //look for the me tab instead if the buggy chat room!           
        var element = $("#user-details");
        if (typeof element !== "undefined" && element.value !== '') {
            //append our css to the head
            var g = '#panel-container .panel { margin-top:50px !important;}';
            $("head").append($('<style type="text/css">' + g + '</style>'));

        } else {
            setTimeout(ShowTown, 2000);
        }
    } catch (err) {
        if (err === "TypeError: element is null" || err === "TypeError: element is null") {
            setTimeout(ShowTown, 2000);
        }
        setTimeout(ShowTown, 2000);
    }
};
setTimeout(ShowTown, 2000);