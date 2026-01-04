// ==UserScript==
// @name         u3a / u3b Eliminator
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  This script eliminates unnecessary UTCs
// @author       Kanan Ibrahimov (ibrkanan@amazon.com)
// @match        https://argus.aka.amazon.com/
// @icon
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452045/u3a%20%20u3b%20Eliminator.user.js
// @updateURL https://update.greasyfork.org/scripts/452045/u3a%20%20u3b%20Eliminator.meta.js
// ==/UserScript==
(function() {
    'use strict';



    var divCheckingInterval = setInterval(function() {
       if (document.querySelector(".md-button").style.display != "none") {

    const a1 = document.querySelector('[aria-label*="seller_central"]');
    const a2 = document.querySelector('[aria-label*="COMPASS"]');
    const a3 = document.querySelector('[aria-label*="PanDash"]');
    const a4 = document.querySelector('[aria-label*="AshaVC"]');
    const a5 = document.querySelector('[aria-label*="VENDOR_CENTRAL"]');
    const a6 = document.querySelector('[aria-label*="eupc.msds_legacy"]');
    const a7 = document.querySelector('[aria-label*="msds_uplode"]');
    const a9 = document.querySelector('[aria-label*="Rakshaka"]');
    const a0 = document.querySelector('[aria-label*="doc.com"]');

    if (a1 || a2 || a3 || a4 || a5 || a6 || a7 || a9 || a0) {



            } else {

                if (document.querySelector('#dt-select-99-u3b')) {
                    document.querySelector('#dt-select-99-u3b').style.display = 'none';
                }
                if (document.querySelector('#dt-select-99-u3a')) {
                    document.querySelector('#dt-select-99-u3a').style.display = 'none';
                }
                if (document.querySelector('#dt-select-280-u3b')) {
                    document.querySelector('#dt-select-280-u3b').style.display = 'none';
                }
                if (document.querySelector('#dt-select-280-u3a')) {
                    document.querySelector('#dt-select-280-u3a').style.display = 'none';
                }

            }

        }

    });

})();