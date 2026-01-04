// ==UserScript==
// @name         Open All MPs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script opens all MPs automatically.
// @author       Kanan Ibrahimov (ibrkanan@amazon.com)
// @match        https://argus.aka.amazon.com/
// @icon         https://img.icons8.com/fluency/48/000000/globe.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451432/Open%20All%20MPs.user.js
// @updateURL https://update.greasyfork.org/scripts/451432/Open%20All%20MPs.meta.js
// ==/UserScript==

'use strict';

window.addEventListener('load', () => {

    var divCheckingInterval = setInterval(function() {

        if (document.querySelector("#modalLoader").style.display != "none") {

            if (document.querySelector("#dtResources") === null) {

                if (document.querySelector(".summary-text").style.display != "none") {


                    setTimeout(function() {
                        document.querySelector("#dtMarketplaces > button").click();

                    }, 1500);


                }
            }
        }


    });


})();