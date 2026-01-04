// ==UserScript==
// @name         Code.org Data Editor Console
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Execute a code to edit the data while you're in a code.org fullscreen project (a code.org project link that does not have /edit or /view or anything on the last part.). You can execute data functions for example createRecord(), readRecords(), setKeyValue(), getKeyValue(), etc.
// @author       cool
// @match        https://studio.code.org/projects/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=code.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470507/Codeorg%20Data%20Editor%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/470507/Codeorg%20Data%20Editor%20Console.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement("style");
    style.textContent = `
    #ci {
      outline: 0px;
      position: fixed;
      left: 5px;
      bottom: 5px;
      width: calc(100% - 20px);
    }
    `;
    document.head.appendChild(style);
    var loadIn = setInterval(function() {
        if (document.querySelector(".WireframeButtons_containerRight") != null) {
            clearInterval(loadIn);
            var odc = document.createElement("span");
            odc.style.display = "inline-block";
            odc.style.cursor = "pointer";
            var odca = document.createElement("a");
            odca.className = "WireframeButtons_button";
            odca.innerHTML = "<i class=\"fa fa-code\"></i>Open Data Console";
            odc.appendChild(odca);
            odc.addEventListener("click", function() {
                odca.innerHTML = odca.innerHTML == "<i class=\"fa fa-code\"></i>Open Data Console" ? "<i class=\"fa fa-code\"></i>Close Data Console" : "<i class=\"fa fa-code\"></i>Open Data Console";
                ci.hidden = !ci.hidden;
                if (!ci.hidden) {
                    ci.focus();
                }
            });
            document.querySelector(".WireframeButtons_containerRight").childNodes[0].appendChild(odc);
            var ci = document.createElement("input");
            ci.id = "ci";
            ci.placeholder = "Press enter to execute";
            ci.hidden = true;
            ci.addEventListener("keydown", function(event) {
                if (event.key == "Enter") {
                    (function() {
                        'use strict';
                        eval(ci.value);
                        ci.value = "";
                    })();
                }
            });
            document.body.appendChild(ci);
            if (location.href.split("/")[4] == "applab") {
                for (var i = 0; i < Object.keys(Applab.storage).length; i++) {
                    window[Object.keys(Applab.storage)[i]] = Applab.storage[Object.keys(Applab.storage)[i]];
                }
            } else if (location.href.split("/")[4] == "gamelab") {
                for (i = 0; i < Object.keys(__mostRecentGameLabInstance.apiJS).length; i++) {
                    window[Object.keys(__mostRecentGameLabInstance.apiJS)[i]] = __mostRecentGameLabInstance.apiJS[Object.keys(__mostRecentGameLabInstance.apiJS)[i]];
                }
            }
        }
    }, 100);
})();