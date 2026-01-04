// ==UserScript==
// @name    NA_Common_File
// @version  1.0.0
// @description Common objects needed in other modules 
// @license AGPLv.3
// @grant    none
// @match     https://clients.netafraz.com/admin*
// @namespace https://clients.netafraz.com
// @downloadURL https://update.greasyfork.org/scripts/530605/NA_Common_File.user.js
// @updateURL https://update.greasyfork.org/scripts/530605/NA_Common_File.meta.js
// ==/UserScript==
// Programmed and developed by Farshad_Mehryar

(function () {
        'use strict';

        function runScript() {
                var fDivMsg = document.createElement("div");
                fDivMsg.style.cssText = `
        position: fixed;
        width: 25%;
        height: 65px;
        text-align: center;
        padding: 10px;
        border: 1px solid #147d43;
        border-radius: 10px;
        background-color: yellow;
        top: 1%;
        left: 37.5%;
        z-index: 1000;
        transition: all 1s;
        display: none;
        opacity: 0;
        `;
                fDivMsg.textcontent = "---";
                fDivMsg.id = "fDivMsg";
                document.body.insertBefore(fDivMsg, document.body.firstChild);
        }

        if (document.readyState === "complete") {
                runScript();
        } else {
                document.addEventListener("readystatechange", function () {
                        if (document.readyState === "complete") {
                                runScript();
                        }
                });
        }
})();