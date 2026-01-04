// ==UserScript==
// @name         Ignition trial resetter
// @namespace    Danielv123
// @version      1.9
// @description  Resets trial after expiry
// @author       You
// @match        http*://*/web/*
// @match        http*://*/idp/*/authn*
// @match        http*://*/idp/default/authn*
// @match        http*://*/idp/ActiveDirectory/authn*
// @match        http*://*/data/perspective/client/*
// @match        http*://*/data/federate/callback/ignition*
// @grant        window.close
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439064/Ignition%20trial%20resetter.user.js
// @updateURL https://update.greasyfork.org/scripts/439064/Ignition%20trial%20resetter.meta.js
// ==/UserScript==
/*

The script automatically logs in if you have set your username and password in localStorage.

Open your console with ctrl + shift + i or right click -> Inspect Element
Enter:
    localStorage.username = "admin";
    localStorage.password = "admin";

*/

async function sleep(s){
    return new Promise(r => setTimeout(r, s*1000))
}

(async function() {
    'use strict';
    setInterval(resetTrial, 500);
    function resetTrial(){
        let continueToLoginButton = document.querySelector("div.login-section > div > div > div.panel-body > div.submit-button > span");
        if(continueToLoginButton && continueToLoginButton.innerText !== "CONTINUE"){
            continueToLoginButton.click();
        }
        let button = document.querySelector("#reset-trial-anchor");
        if(button){
            button.click();
            console.log("Trial reset at ", new Date())
        }

        let weGotLoggedOutButton = document.querySelector("#sign-in-anchor");
        if(weGotLoggedOutButton){
            weGotLoggedOutButton.click();
        }
    }
    // Handle automatic login
    setInterval(login, 1000);
    setTimeout(login, 200);
    async function login(){
        let usernameField = document.querySelector(".username-field");
        if(
            localStorage.username?.length
            && localStorage.password?.length
            && usernameField
            && !usernameField.value
        ){
            console.log("Logging in")
            await sleep(0.1);
            // Enter the username
            usernameField.value = localStorage.username;
            await sleep(0.1);
            // Press the login button
            let loginButton = document.querySelector(".submit-button");
            loginButton.click();
            await sleep(0.2);
            // Enter password
            let passwordField = document.querySelector(".password-field");
            if(passwordField && !passwordField.value){
                passwordField.value = localStorage.password;
                await sleep(0.1);
                loginButton.click();
            }
        }
    }
    let hasCreatedLoginEventlistener = false
    setTimeout(createPasswordScraperListener, 1000)
    function createPasswordScraperListener(){
        let usernameField = document.querySelector(".username-field");
        // No stored credentials, save entered credentials instead
        if(!hasCreatedLoginEventlistener
           && usernameField
           && (!localStorage.username || !localStorage.password)){
            let loginButton = document.querySelector(".submit-button");
            console.log("Created login eventlistener")
            loginButton.onclick = function(){
                localStorage.username = usernameField.value;
                console.log("Set username to ",usernameField.value);
                let passwordField = document.querySelector(".password-field");
                if(passwordField){
                    localStorage.password = passwordField.value;
                    console.log("Set password to ",passwordField.value);
                }
            }
            hasCreatedLoginEventlistener = true;
        }
    }
    // Handle automatic refresh of perspective session
    setInterval(reloadPerspective, 6000);
    function reloadPerspective(){
        let trialExpiredField = document.querySelector(".not-licensed-header");
        let noProjectFoundMessage = document.querySelector(".no-project-page");
        let successfullyLoggedInMessage = document.querySelector("body > div > div.message > div > h1");
        let serverHasntStartedYetMessage = document.querySelector("body > h2");
        let isLoggedOutNotSureWhy = document.querySelector("#app-container > div > div.terminal-state-content > div > div.terminal-state-message.closed-page > section > a");
        let gatewayError = document.querySelector("body > h2");
        if(trialExpiredField
           || noProjectFoundMessage
           || (serverHasntStartedYetMessage && serverHasntStartedYetMessage.innerText == "HTTP ERROR 503 Service Unavailable")
           || isLoggedOutNotSureWhy
        ){
            setTimeout(() => {
                document.location = document.location;
            }, 3000); // Long timeout to allow script in a different tab to reset the license
        }
        if(gatewayError?.innerText.includes("HTTP ERROR ")){ // 400 Bad Request, 500 error etc
            // Navigate to the root path
            document.location = document.location.href.split("/data/federate/callback/ignition")[0] + "/web/home";
        }
        if(successfullyLoggedInMessage && successfullyLoggedInMessage.innerHTML == "Successfully Logged In"){
            // Close the tab. This is the page shown when logging into the ignition designer
            window.close()
        }
    }
})();
