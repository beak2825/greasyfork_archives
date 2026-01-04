// ==UserScript==
// @name         MC Assistant
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  This script helps reviewers with bunch of cool features
// @author       Kanan Ibrahimov (ibrkanan@amazon.com) and Baran Ozdogan (bozdoga@amazon.pl)
// @match        https://argus.aka.amazon.com/
// @include      *www.amazon.*
// @include      *primenow.amazon.*
// @icon         https://img.icons8.com/fluency/48/000000/chatbot.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453637/MC%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/453637/MC%20Assistant.meta.js
// ==/UserScript==
'use strict';

// Styles Start

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

addGlobalStyle('#warning-text {padding: 7px; background-color: rgba(255, 82, 82, 1); color: white; font-size:15px; animation: pulse 1500ms infinite;} @keyframes pulse {0% {box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);}100% {box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);}}');

// Styles End


var $ = window.jQuery
window.addEventListener('load', () => {


    var divCheckingInterval = setInterval(function() {

        // Skip doc starts

        if (document.querySelector("#dtSdsValidationSkipSdsButton")) {

            setTimeout(function() {
                document.querySelector("#dtSdsValidationSkipSdsButton").click();
            }, 300);

        };

        // Skip doc ends

         //Argus UP
            if (document.querySelector("#modalLoader").style.display != "none") {

            if (document.querySelector("#dtResources") === null) {

            if (document.querySelector(".summary-text").style.display != "none") {

            async function argus_up() {
                let ASIN = window.location.href.substring(35, 45);

                let res = await fetch(`https://argus.aka.amazon.com/ajax/asins/${ASIN}`)
                    .then((response) => response.json())

                function check_up() {
                    res['marketplaces'].forEach((mp) => {

                            if (mp.bulletPoints.length == 0 && mp.itemDescriptions.length == 0) {
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
        //Argus UP ends

        // NH Button Starts

        if (document.querySelector("#dtQuickCodesUp")) {

            if (document.querySelector("#nhbtn") === null) {

                document.querySelector('.dt-summary-subheader').innerHTML += '<button id="nhbtn" class="md-raised md-hue-2 md-button md-dg-theme layout-align-center-center layout-row" style="margin: 0 auto; margin-bottom: 10px;"> Classify as NH </button>';

                document.getElementById("nhbtn").onclick = function() {
                    myFunction()
                };

                function myFunction() {

                    document.querySelector('.submit-product-card-classification').click();

                    setTimeout(function() {
                        document.querySelector('.dt-dg-answer-selectWorkflow-battery').click();
                    }, 200);

                    setTimeout(function() {
                        document.getElementById('dt-list-select-300-ni-mh').click();
                    }, 400);

                }
            }
        }

        // NH Button Ends

        // u3a/u3b Starts

        if (document.querySelector(".md-button").style.display != "none") {

            const a1 = document.querySelector('[aria-label*="seller_central"]');
            const a2 = document.querySelector('[aria-label*="COMPASS"]');
            const a3 = document.querySelector('[aria-label*="PanDash"]');
            const a4 = document.querySelector('[aria-label*="AshaVC"]');
            const a5 = document.querySelector('[aria-label*="vendor_central"]');
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

        // u3a/u3b Ends

        // Classification date starts

        if (document.querySelector(".submit-product-card-classification").style.display != "none") {
            if (document.querySelector("#warning-text") === null) {

                if ($('.utils-display-review-completion-date.text-weight-300.ng-binding').length > 0) {
                    var date = $('.utils-display-review-completion-date.text-weight-300.ng-binding').text().trim().split(' ')[0];
                    var d = new Date;
                    var today = ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '/' + ((d.getDate() > 9) ? d.getDate() : ('0' + d.getDate())) + '/' + d.getFullYear();
                    if (date === today) {
                        document.querySelector('.summary-text').innerHTML += '<p id="warning-text"> ASIN is classified today. Be careful </p>';

                    }


                }
            }

        }

        // Classification date ends


        // Document collaps starts

        const attachments = document.getElementsByClassName("md-2-line sds-resource-item md-whiteframe-2dp _md-button-wrap ng-scope _md");


        function checkdocument() {

            const button_background = document.getElementsByClassName("sds-resource-item-description layout-align-start-start layout-column");


            let i = 0;
            for (i; i < attachments.length; i++) {
                if (attachments[i].innerText.includes('xls') == true) {
                    button_background[i].style.backgroundColor = "#00C0A3";
                    attachments[i].style.color = "black";
                    attachments[i].style.fontSize = "18px";
                } else {
                    attachments[i].style.color = "black";
                    attachments[i].style.fontSize = "18px";
                    button_background[i].style.backgroundColor = "#ff5252";

                }
            }
        };


        function collapse_docs() {
            let docs = document.getElementById('resources_container');
            docs.className = 'collapse in';
            docs.setAttribute('aria-expanded', 'true');

        }


        checkdocument();
        collapse_docs();



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