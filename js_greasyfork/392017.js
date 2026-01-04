// ==UserScript==
// @name         Salesforce Automation Tools
// @namespace    #1NL Scripts
// @version      0.34
// @description  Tools to automate the Salesforce website.
// @author       Luiz Menezes
// @match        https://salesforce.wiseup.com/*
// @match        https://salesforce.wisereducacao.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://c1.sfdcstatic.com/content/dam/web/en_us/www/images/home/logo-salesforce.svg
// @downloadURL https://update.greasyfork.org/scripts/392017/Salesforce%20Automation%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/392017/Salesforce%20Automation%20Tools.meta.js
// ==/UserScript==

console.log("(SATL) Salesforce Automation Tools - Loaded !");

//Check for login form existance, if exists, fill form and click.
if(document.querySelector('#content')) {
    document.querySelector("#username").value = "luiz.menezes@numberone.com.br";
    document.querySelector("#password").value = "Anonovo2021";
    document.querySelector("#Login").click();
    console.log('(SATL) Login found, filled and clicked!')
}
//Check for X button existance, if exists, fill form and click.
else {
    if (document.querySelector('button.close')) {
        document.querySelector('button.close').click();
        console.log('(SATL) Button X found and clicked!');
    }
}

console.log('(SATL) Button X found and clicked!');

/* //OLD VERSION - MISSED LOGIN CREDENCIALS SOMETIMES DUE TO BROWSER AUTOFILL LAG
//Login
if(document.querySelector('#content')){
    (new MutationObserver(check)).observe(document, {childList: true, attributes: true, characterData: true, subtree: true});
    console.log('(SATL) Login found. Observer created.');
}
else{
    console.log('(SATL) Login not found. No oserver created.');

    //X
    if (document.querySelector('button.close')){
        document.querySelector('button.close').click();
        console.log('(SATL) Button X found and clicked!')
    }
    else
        console.log('(SATL) X not found. No action Taken.');
}

function check(changes, observer) {
    console.log('(SATL) DOM changed logged...');

    var loginForm = document.querySelector('#content');
    if(loginForm && loginForm.style.display == "block"){
        observer.disconnect();
        console.log("(SATL) Content is visible: Timer set for 150ms!!!")
        setTimeout(function(){
            document.querySelector("#Login").click();
            console.log("(SATL) Clicked!")
        }, 150);
        //document.querySelector("#Login").click();
    }
    else {console.log('(SATL) ... but not "Login Form"');}
}*/