// ==UserScript==
// @name         Torn Dog Tags competition defeats checker
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Checks if a player has been defeated after the competition has started.
// @author       Chawan
// @match        https://www.torn.com/personalstats.php?*
// @match        https://www.torn.com/profiles.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374157/Torn%20Dog%20Tags%20competition%20defeats%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/374157/Torn%20Dog%20Tags%20competition%20defeats%20checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer;
    if (window.location.href.includes("https://www.torn.com/profiles.php?")) {

        //const profileRoot = document.getElementById("profileroot");
        const profileRoot = document.getElementById("react-root");
        const observerConfig = { attributes: false, childList: true, subtree: true };

        let callback = function(mutationList, observer) {
            for (let mutation of mutationList) {
                if (typeof profileRoot.getElementsByClassName("buttons-list")[0] !== "undefined") {
                    addProfileShortcut();
                    return;
                }
            }
        };

        observer = new MutationObserver(callback);
        observer.observe(profileRoot, observerConfig);
    }
    else {
        //const chartSection = document.getElementById("chartSection");
        const chartSection = document.getElementById("react-root");
        const observerConfig = { attributes: false, childList: true, subtree: true };

        let callback = function(mutationList, observer) {
            for (let mutation of mutationList) {
                if (typeof chartSection.getElementsByTagName("table")[0] !== "undefined") {
                    if (window.location.href.includes("defendslost&from=1%20month")) {
                        checkIfAttacked();
                        return;
                    }
                }
            }
        };

        observer = new MutationObserver(callback);
        observer.observe(chartSection, observerConfig);
    }

    function addProfileShortcut() {
        observer.disconnect();

        let buttonsList = document.getElementsByClassName("buttons-list")[0];
        let shortcutButton = document.createElement("a");
        shortcutButton.innerHTML = '<?xml version=\"1.0\" class="default___25YWq" encoding=\"iso-8859-1\"?><svg version=\"1.1\" filter=\"url(#whiteFilter)\" stroke=\"#d4d4d4\" fill=\"url(#linear-gradient)\" id=\"Layer_1\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\" x=\"0px\" y=\"0px\"\r\n\t viewBox=\"-128 -128 768 768\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\"><g><g><g><path d=\"M288.009,192c11.776,0,21.333-9.557,21.333-21.333s-9.557-21.333-21.333-21.333s-21.333,9.557-21.333,21.333\r\n\t\t\t\tS276.233,192,288.009,192z\"\/><path d=\"M266.676,234.667c11.776,0,21.333-9.557,21.333-21.333S278.452,192,266.676,192s-21.333,9.557-21.333,21.333\r\n\t\t\t\tS254.9,234.667,266.676,234.667z\"\/><path d=\"M330.676,85.333c11.776,0,21.333-9.557,21.333-21.333s-9.557-21.333-21.333-21.333S309.343,52.224,309.343,64\r\n\t\t\t\tS318.9,85.333,330.676,85.333z\"\/><path d=\"M181.343,106.667c0,11.776,9.557,21.333,21.333,21.333s21.333-9.557,21.333-21.333s-9.557-21.333-21.333-21.333\r\n\t\t\t\tS181.343,94.891,181.343,106.667z\"\/><path d=\"M309.343,128c11.776,0,21.333-9.557,21.333-21.333s-9.557-21.333-21.333-21.333s-21.333,9.557-21.333,21.333\r\n\t\t\t\tS297.567,128,309.343,128z\"\/><path d=\"M352.009,42.667c11.776,0,21.333-9.557,21.333-21.333S363.785,0,352.009,0s-21.333,9.557-21.333,21.333\r\n\t\t\t\tS340.233,42.667,352.009,42.667z\"\/><path d=\"M458.249,434.411l-85.333-298.667c-1.323-4.587-7.445-7.744-12.203-7.744c-1.984,0-3.947,0.085-5.888,0.192l-3.605,0.149\r\n\t\t\t\tc-3.2,0.085-6.229,1.6-8.192,4.139c-3.2,4.139-6.912,7.552-11.051,10.176c-4.288,2.709-6.059,8.085-4.245,12.821\r\n\t\t\t\tc1.963,5.099,2.944,10.219,2.944,15.189c0,13.333-6.229,25.685-17.131,33.899c-2.667,2.027-4.203,5.419-4.203,8.768\r\n\t\t\t\tc0,23.531-19.136,42.667-42.667,42.667c-23.531,0-42.667-19.136-42.667-42.667c0-13.333,6.229-25.685,17.131-33.899\r\n\t\t\t\tc2.667-2.027,4.203-5.419,4.203-8.768c0-2.859,0.299-5.717,0.875-8.512c0.768-3.755-0.533-7.637-3.435-10.176\r\n\t\t\t\tc-2.88-2.539-6.891-3.307-10.517-2.048c-31.915,11.093-61.803,25.835-88.832,43.861c-3.861,2.581-5.611,7.339-4.331,11.797\r\n\t\t\t\tl85.333,298.667c1.301,4.587,5.461,7.744,10.24,7.744h13.291c74.347,0,145.664-22.805,206.229-65.984\r\n\t\t\t\tC457.887,443.392,459.508,438.741,458.249,434.411z\"\/><path d=\"M125.215,234.709c-2.581-9.173-17.877-9.173-20.501,0L53.748,413.056c-1.259,4.352,0.384,8.981,4.053,11.605\r\n\t\t\t\tc36.309,25.877,76.971,44.48,120.875,55.275c0.832,0.213,1.685,0.32,2.539,0.32c2.859,0,5.653-1.152,7.68-3.264\r\n\t\t\t\tc2.624-2.731,3.605-6.677,2.56-10.325L125.215,234.709z\"\/><path d=\"M160.009,42.667c11.776,0,21.333-9.557,21.333-21.333S171.785,0,160.009,0s-21.333,9.557-21.333,21.333\r\n\t\t\t\tS148.233,42.667,160.009,42.667z\"\/><path d=\"M160.009,64c0,11.776,9.557,21.333,21.333,21.333S202.676,75.776,202.676,64s-9.557-21.333-21.333-21.333\r\n\t\t\t\tS160.009,52.224,160.009,64z\"\/><path d=\"M130.719,168.661c1.877,1.429,4.117,2.133,6.4,2.133c1.963,0,3.904-0.533,5.632-1.621\r\n\t\t\t\tc8.917-5.525,18.133-10.389,27.349-15.211c3.008-1.579,5.077-4.501,5.589-7.872c0.512-3.349-0.597-6.763-3.029-9.152\r\n\t\t\t\tc-6.037-5.995-10.112-13.504-11.776-21.739c-1.003-4.949-6.464-8.533-11.541-8.533c-4.779,0-8.939,3.157-10.24,7.744\r\n\t\t\t\tl-12.224,42.795C125.663,161.451,127.199,165.995,130.719,168.661z\"\/><\/g><\/g><\/g><g><\/g><g><\/g><g><\/g><g><\/g><g><\/g><g><\/g><g><\/g><g><\/g><g><\/g><g><\/g><g><\/g><g><\/g><g><\/g><g><\/g><g><\/g><\/svg>\r\n';
        //shortcutButton.setAttribute("href", encodeURI(buttonsList.getElementsByTagName("a")[9].getAttribute("href") + "&stats=defendslost&from=1%20month"));
        const urlParams = new URLSearchParams(window.location.search);
        shortcutButton.setAttribute("href", encodeURI("https://www.torn.com/personalstats.php?ID=" + urlParams.get('XID') + "&stats=defendslost&from=1%20month"));
        shortcutButton.setAttribute("class", "profile-button active");

        buttonsList.appendChild(shortcutButton);
    }

    function checkIfAttacked() {
        observer.disconnect();
        let chartTable = document.getElementById("chartSection").getElementsByTagName("table")[0];
        let curDate = new Date().getDate();
        let text = document.getElementById("skip-to-content");
        let attackButton = document.createElement("a");
        let personalUserID = JSON.parse(document.getElementById("websocketConnectionData").innerText).userID;
        let userId = (personalUserID === chartTable.rows[0].cells[1].innerText.match(/\[(\d*?)\]/)[1]) ? chartTable.rows[0].cells[2].innerText.match(/\[(\d*?)\]/)[1] : chartTable.rows[0].cells[1].innerText.match(/\[(\d*?)\]/)[1];
        let targetDefendsLostLabel = Array.from(document.querySelectorAll('[aria-label="Defends lost,"]'))[0];
        let targetDefendsLost = targetDefendsLostLabel.parentNode.getElementsByTagName("div")[1].getElementsByTagName("span")[1].innerText

        attackButton.setAttribute("role", "button");
        attackButton.setAttribute("href", "https://www.torn.com/loader2.php?sid=getInAttack&user2ID=" + userId);
        attackButton.setAttribute("class", "awards t-clear h c-pointer  m-icon line-h24 right last");
        attackButton.innerHTML = '<span class="icon-wrap"></span><span>Attack</span>';

        chartTable.rows[0].remove();

        if (chartTable.rows[curDate - 5].cells[1].innerText != targetDefendsLost) {
            text.innerHTML = '<font color="red">HAS LOST SINCE TAGS STARTED</font>';
        }
        else {
            text.innerHTML = '<a href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID=' + userId + '"><font color="darkgreen">HASN\'T BEEN ATTACKED SINCE TAGS START</font></a>';
            document.getElementById("top-page-links-list").appendChild(attackButton);
        }
    }

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

})();