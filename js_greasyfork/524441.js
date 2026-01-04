// ==UserScript==
// @name         Skip Microsoft 2FA
// @namespace    http://tampermonkey.net/
// @version      2025-01-24
// @description  Skip Microsoft asking for 2fa
// @author       Soggy_Pancake
// @match        *://*.microsoft.*/*
// @include      *://*.microsoft.*/*
// @include      *://*.microsoftonline.*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/524441/Skip%20Microsoft%202FA.user.js
// @updateURL https://update.greasyfork.org/scripts/524441/Skip%20Microsoft%202FA.meta.js
// ==/UserScript==

var skipStaySignedIn = false;
var staySignedIn = true;

var scanSpeed = 200; // ms between scanning for elements

var timeoutID;

function moreInformationPage(){

    let heading = document.getElementById("heading");
    let text = document.getElements

    if(heading != null){

        console.log("Got heading!");
        console.log(heading);

        if(heading.textContent == "More information required"){

            let nextButton = document.getElementById("idSubmit_ProofUp_Redirect");

            nextButton.click();
            clearTimeout(timeoutID);

        }
    }
}

function authenticatorPopup(){

    let links = document.getElementsByClassName("ms-Link");

    if(links != null){

        //console.log(links);
        for(let i = 0; i < links.length; i++){
            //console.log(links[i]);

            if(links[i].textContent == "I want to use a different authenticator app"){

                for(let j = 0; j < links.length; j++){

                    if(links[j].textContent == "Skip setup"){

                        console.log(`buttons[{j}]`);

                        links[j].click();

                        clearTimeout(timeoutID);

                    }

                }

            }

        }

    }

}

function staySignedInPage(){

    let text = document.getElementsByClassName("text-title");

    if(text.length == 0){
        return;
    }

    //console.log("Skipping remember login!");
    //console.log(text);

    //console.log(`Found ${text.length} elements with class text-title`);
    for(let i = 0; i < text.length; i++){

        if(text[i].textContent == "Stay signed in?") {

            let button = null;

            if(staySignedIn){

                console.log("Staying signed in!");

                let dontShowAgain = document.getElementById("KmsiCheckboxField");
                dontShowAgain.checked = true;

                document.getElementById("idSIButton9").click();

            } else {

                console.log("Not staying signed in!");
                document.getElementById("idBtn_Back").click();

            }

        }

    }

}

function scan(){

    moreInformationPage();
    authenticatorPopup();

    if(skipStaySignedIn){
        staySignedInPage();
    }

    timeoutID = setTimeout(scan, scanSpeed);
}

(function() {
    'use strict';

    let host = window.location.hostname;

    host = host.substring(host.indexOf(".") + 1);

    console.log(host);
    if (host.includes("microsoft")) {

        scan();
    }

})();