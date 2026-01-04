// ==UserScript==
// @name         CopyPasteBin
// @namespace    https://github.com/KeyWeeUsr/Userscripts
// @version      0.3
// @description  Copy content of a PasteBin snippet with a single click
// @author       Peter Badida
// @copyright    2017+, Peter Badida
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage     https://github.com/KeyWeeUsr/Userscripts/tree/master/CopyPasteBin
// @supportURL   https://github.com/KeyWeeUsr/Userscripts/issues
// @icon         https://pastebin.com/favicon.ico
// @include      *pastebin.com*
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ACVM74AYCXVWQ
// @downloadURL https://update.greasyfork.org/scripts/33734/CopyPasteBin.user.js
// @updateURL https://update.greasyfork.org/scripts/33734/CopyPasteBin.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function () {
    function selectText(element) {
        // textarea select
        element.select();
        // copy to clipboard
        document.execCommand('copy');
    }

    function addButton() {
        var codeContainer = document.getElementById(
            "code_buttons"
        ).children[0];

        // create COPY button on mouse enter
        var codeButton = document.createElement("a");
        codeButton.setAttribute("id", "cpb_button");
        codeButton.setAttribute("class", "buttonsm");
        codeButton.innerHTML = "copy";
        codeButton.style = "cursor: pointer; display: inline;" +
                           "font-style: italic;";

        // insert COPY button in front of the right side buttons
        codeContainer.insertBefore(codeButton, codeContainer.children[0]);
        codeButton.addEventListener("click", function () {
            selectText(document.getElementById("paste_code"))
        });
    }

    function appendMe() {
        var codeContainer = document.getElementById(
            "code_buttons"
        ).children[0];

        // create AV
        var av = document.createElement("a");
        av.setAttribute(
            "href",
            "https://github.com/KeyWeeUsr/Userscripts"
        );
        av.setAttribute("id", "kwu_av");
        av.style = "display: inline;";

        // create AV image
        var avImg = document.createElement("img");
        avImg.setAttribute(
            "src",
            "https://github.com/identicons/KeyWeeUsr.png"
        );
        avImg.style = "width: 20px; vertical-align: middle;" +
                      "margin: 0px 0px 0px 8px; opacity: 0.3";
        avImg.addEventListener("mouseover", function() {
            avImg.style.opacity = "1";
        });
        avImg.addEventListener("mouseout", function() {
            avImg.style.opacity = "0.3";
        });

        av.appendChild(avImg);
        codeContainer.insertBefore(av, codeContainer.children[0]);
    }

    // run
    if (!document.getElementById('kwu_av')){
        appendMe();
    }
    addButton();
})();
