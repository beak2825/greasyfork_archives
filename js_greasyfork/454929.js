// ==UserScript==
// @name         UP Detector
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  This script reminds reviewers to flip the ticket to CSC where necessary
// @author       Kanan Ibrahimov (ibrkanan@amazon.com) / Baran Ozdogan (bozdoga@amazon.pl)
// @match        https://argus.aka.amazon.com/
// @icon
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454929/UP%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/454929/UP%20Detector.meta.js
// ==/UserScript==
'use strict';

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('#up-text {color: white; font-size:1px;}');

window.addEventListener('load', () => {

    var divCheckingInterval = setInterval(function() {

            if (document.querySelector("#modalLoader").style.display != "none") {

            if (document.querySelector("#dtResources") === null) {

            if (document.querySelector(".summary-text").style.display != "none") {

            async function argus_up() {
                let ASIN = await(document.getElementById("workItemContainer").innerText );

                let res = await fetch(`https://argus.aka.amazon.com/ajax/asins/${ASIN}`)
                    .then((response) => response.json())

                function check_up() {
                    res['marketplaces'].forEach((mp) => {

                            if (mp.bulletPoints.length == 0 && mp.productDescriptions.length == 0) {
                                let mp_name = mp.marketplaceCode
                                let bt = document.querySelector(`[aria-label="${mp_name}"]`)
                                bt.innerHTML = 'UP'
                                bt.style.background = '#ff5252'
                                bt.style.color = 'white'
                                bt.style.fontSize = '17px'
                                bt.classList.remove("init-checked-mkt");
                                bt.classList.remove("md-checked");
                            };
                        }
                    )
                }

                check_up()

            }

             setTimeout(function() {
                  argus_up()
            }, 1000);


                }
            }
        }

    });

    // DP UP starts

    function Up_Close() {
        if (document.querySelectorAll('#feature-bullets')[0].innerText.length == 0 &&
            document.querySelectorAll('#productDescription')[0].innerText.length == 0)

        {
            alert("This DP doesn't have description and/or bullet point");
            document.title = 'UP - NO BULLET POINT & DESCRIPTION'



        }
    }

    function prime() {

        // See more starts

        document.querySelector("#pov2FeatureBulletsExpanderHeading > a").click();

        // See more ends

        if (document.querySelectorAll('#feature-bullets').length == 0) {

            alert("This DP doesn't have description and/or bullet points")
            document.title = "UP - NO BULLET POINT & DESCRIPTION"
        }

    }


    function remove_details() {
        document.getElementById('prodDetails').remove();
    }

    function collapse_description() {
        document.querySelector("#pov2FeatureBulletsExpanderHeading > a").click()
    }



    function validate() {
        Up_Close();
        prime();
        remove_details();
        collapse_description();


    }
    validate();


    // DP UP ends

})();