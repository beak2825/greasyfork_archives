// ==UserScript==
// @name         Magnolia Copy UUID
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *admincentral*
// @include      *admincentral*
// @grant        all
// @downloadURL https://update.greasyfork.org/scripts/395473/Magnolia%20Copy%20UUID.user.js
// @updateURL https://update.greasyfork.org/scripts/395473/Magnolia%20Copy%20UUID.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var map = new Map();
    var ctrlKey = 17, cmdKey = 91, cKey = 67;

    window.addEventListener("keydown", keyboardHandlerDown, false);
    window.addEventListener("keyup", keyboardHandlerUp, false);

    function keyboardHandlerDown(zEvent) {
        if (matchHref()) {
            var bBlockDefaultAction = false;
            if (zEvent.altKey) {
                //-- Do nothing (most user-friendly option, in most cases).
            } else {

                map.set(zEvent.which, zEvent.type == 'keydown');
                if (map.size == 2 && map.get(cKey) && (map.get(cmdKey) || map.get(ctrlKey))) {
                    var text;
                    if (window.location.href.match("app:pages:browser")) {
                        text = document.getElementsByClassName("v-selected")[0].getElementsByTagName("td")[5].getElementsByTagName("div")[0].innerHTML;
                    } else {
                        text = document.getElementsByClassName("v-selected")[0].getElementsByTagName("td")[3].getElementsByTagName("div")[0].innerHTML;
                    }

                    var input = document.createElement("input");
                    var body = document.getElementsByTagName('body')[0];
                    body.appendChild(input);
                    input.setAttribute("value", text);
                    input.select();
                    document.execCommand("copy");
                    bBlockDefaultAction = true;
                    map = new Map();
                }
            }

            if (bBlockDefaultAction) {
                zEvent.preventDefault();
                zEvent.stopPropagation();
            }
        }
    }

    function matchHref() {
        return window.location.href.match("app:") && window.location.href.match(":browser") && window.location.href.match("treeview");
    }


    function keyboardHandlerUp(zEvent) {
        if (matchHref()) {
            if (zEvent.altKey) {
                //-- Do nothing (most user-friendly option, in most cases).
            } else {
                map.delete(zEvent.which)
            }
        }
    }
})();