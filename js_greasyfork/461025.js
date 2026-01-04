// ==UserScript==
// @name            Select Message Text
// @description     Allows users to select text within the map message window
// @author          Jezzarimu / Sibuna (Usernames at Planets.Nu)
// @include         http://planets.nu/*
// @include         http://*.planets.nu/*
// @include         https://planets.nu/*
// @include         https://*.planets.nu/*
// @version         1.0
// @namespace https://greasyfork.org/users/859074
// @downloadURL https://update.greasyfork.org/scripts/461025/Select%20Message%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/461025/Select%20Message%20Text.meta.js
// ==/UserScript==

/*
    Allows users to select text within the map message window.
    Please send Jezzarimu a message in planets.nu if you have any issues.

    Version History:
    1.0 - Initial Release
*/

function wrapper () {
    var selectMsgText = {
        processload: function () {
            if (vgap.version >= 4) {
                let initalposition = templater["InboxMessages"].search("class=\"threadbody\"")
                let relativeposition = templater["InboxMessages"].substring(initalposition).search("style=\"")
                if(relativeposition == -1) {
                    templater["InboxMessages"] = templater["InboxMessages"].substring(0,initalposition+18) + " style=\"user-select:text\"" + templater["InboxMessages"].substring(initalposition+18)
                }
            }
        }
    }
    vgap.registerPlugin(selectMsgText, "selectMsgText");
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
