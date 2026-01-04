// ==UserScript==
// @name         Sankaku Beta Auto Log in
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  Auto logs in if not logged in
// @author       Roboapple
// @match        https://beta.sankakucomplex.com/*
// @match        https://login.sankakucomplex.com/*
// @icon         https://www.google.com/s2/favicons?domain=sankakucomplex.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431082/Sankaku%20Beta%20Auto%20Log%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/431082/Sankaku%20Beta%20Auto%20Log%20in.meta.js
// ==/UserScript==

(function() {
    //checks if the user is on the login page
    if((document.URL).includes("login")){
        setInterval(function(){ LogIn();}, 250);
        return;
    } else{
        console.log(document.URL);}

    'use strict';
    console.log("Auto log in Active");
    //slight delays are added to account for load time
    setTimeout(() => {AutoLogIn();}, 200);

})();

function AutoLogIn(){
    let element = "MuiButtonBase-root-102 MuiIconButton-root-94 jss5 jss6";
    if(document.getElementsByClassName(element)){

        console.log(document.getElementsByClassName(element).length + " open menu buttons found");

        for (let i = 0; i < document.getElementsByClassName(element).length; i++) {
            //document.getElementsByClassName(element)[i].click();
            //setTimeout(() => {TestForLoggedOut();}, 200);
            if(document.getElementsByClassName(element)[i].ariaLabel == "Open menu"){
            }
        }
    }

    //ever since a sankaku update the class name for the button changes sometimes
    let element2 = "MuiButtonBase-root-218 MuiIconButton-root-210 jss121 jss122";
    if(document.getElementsByClassName(element2)){

        console.log(document.getElementsByClassName(element2).length + " open menu buttons found");

        for (let i = 0; i < document.getElementsByClassName(element2).length; i++) {
            if(document.getElementsByClassName(element2)[i].ariaLabel == "Open menu"){
                document.getElementsByClassName(element2)[i].click();
                setTimeout(() => {TestForLoggedOut();}, 200);
            }
        }
    }
}

function TestForLoggedOut(){
    //checks if the user is logged in
    let element3 = "MuiTypography-root-163 jss148 MuiTypography-body1-165"
    if(document.getElementsByClassName(element3)[0].textContent == "Log in"){
        document.getElementsByClassName("jss154")[0].click();
    } else {
        setTimeout(() => {document.getElementsByClassName("MuiBackdrop-root")[0].click();}, 200);
    }

    let element4 = "MuiTypography-root-279 jss264 MuiTypography-body1-281"
    if(document.getElementsByClassName(element4)[0].textContent == "Log in"){
        document.getElementsByClassName("jss154")[0].click();
    } else {
        setTimeout(() => {document.getElementsByClassName("MuiBackdrop-root")[0].click();}, 200);
    }
}

function LogIn(){
    for (let i = 0; i < document.getElementsByClassName("MuiButton-label").length; i++) {
        if(document.getElementsByClassName("MuiButton-label")[i].textContent == "Log In"){

            //this delay is longer due to wierd log in bug
            //setTimeout(() => {document.getElementsByClassName("MuiButton-label")[i].click();}, 1000);

            //wierd bug still occuring, trying a rload to see if fix
            //It didnt, and in fact led to another bug.  Reverting until fix can be found
            //setTimeout(() => {location.reload();}, 1500);

        }
    }
}