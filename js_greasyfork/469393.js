// ==UserScript==
// @name         Adobe kaufen Shop-Hilfe
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adobe Kaufhilfe
// @author       Nicht verraten
// @match        https://commerce.adobe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469393/Adobe%20kaufen%20Shop-Hilfe.user.js
// @updateURL https://update.greasyfork.org/scripts/469393/Adobe%20kaufen%20Shop-Hilfe.meta.js
// ==/UserScript==


waitForElm("[data-qid='companyName']").then((elm) => {
    elm.addEventListener("focus", go11);
});

function go11(){
    alert("Los geht's. Danke Omar_Sharief. Danke MyDealz");
    go22(0);
}


function go22(i){
    console.log("GO22!:" + i)
    let button = document.querySelector('#action-button-payment:not([disabled])');
    console.log(button)
    if (button != undefined) {
        document.getElementById('action-button-payment').click();
    } else {
        let companyButton = document.querySelector("[data-qid='firstName']");
        if (companyButton != undefined) {
            companyButton.focus();
            companyButton.click();

        }
    }
    setTimeout(function(){
        i++;
        go22(i);
    }, 3000);
}




function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}