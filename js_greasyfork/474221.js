// ==UserScript==
// @name         Alert for production environment
// @namespace    https://www.ltimindtree.com/
// @version      0.4
// @description  Alert user if URL belongs to a listed prodcution environment
// @author       Jeeva S U
// @grant        none

// @match        https://lntinfotech.integrationsuite.cfapps.eu10-003.hana.ondemand.com/*

// @downloadURL https://update.greasyfork.org/scripts/474221/Alert%20for%20production%20environment.user.js
// @updateURL https://update.greasyfork.org/scripts/474221/Alert%20for%20production%20environment.meta.js
// ==/UserScript==

(function () {
    'use strict';



    // Enter list of regex to check URLS
    var comparePages = [
        /SecurityMaterials/,
        /Keystore/
    ];
    // Message to be sent for the alert
    var alertMessage = 'ALERT: This is PRODUCTION tenant';
    var headerTitle = 'PRODUCTION TENANT'



    let currentPage = location.href;
    performeChange(currentPage, comparePages, alertMessage, headerTitle);

    // Check if URL changed every 500 ms
    setInterval (
        function () {
            if (currentPage != location.href)
            {
                // Page has changed, set new page as 'current'
                currentPage = location.href;

                performeChange(currentPage, comparePages, alertMessage, headerTitle);
            }
            changeHeader();
        },
        500
    );
}
)();

function performeChange (currentPage, comparePages, alertMessage, headerTitle) {
    // Check regex for sending alert
    if (checkRegex (currentPage, comparePages)) {
        alert(alertMessage);
        insertCSS(headerTitle);
        localStorage.setItem("backgroundColor", "red");
    }
    else {
        removeCSS();
        localStorage.setItem("backgroundColor", "rgb(53, 74, 95)");
    }
    changeHeader();
}

function checkRegex (currentPage, comparePages) {
    if (comparePages.some(rx => rx.test(currentPage))) {
        return 1;
    }
    return 0;
}

function insertCSS (headerTitle) {
    const docBody = document.querySelector.bind(document);
    setTimeout(() => {
        docBody('body').insertAdjacentHTML('afterbegin', init_css(headerTitle));
    },100);
}

function init_css (headerTitle) {
    return `
        <div id="headerTopDiv">${headerTitle}</div>
        <style>
            #headerTopDiv{z-index:99999999;position:fixed;top:0.5vh;left:0;width:100vw;text-align:center;font-size:2rem;color:white;}
        </style>
        `;
}

function removeCSS () {
    var element = document.getElementById("headerTopDiv");
    if (element) {
        element.remove(); // Removes the div with the 'headerTopDiv' id
    }
}

function changeHeader () {
    const headerElement = document.getElementById("shell--toolHeader");
    const targetElementColor = localStorage.getItem("backgroundColor");
    if (headerElement && targetElementColor && headerElement.style.backgroundColor != targetElementColor) {
        headerElement.style.backgroundColor = targetElementColor;
    }
}