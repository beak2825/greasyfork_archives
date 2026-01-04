// ==UserScript==
// @name         Better foreign aid for Cyber Nations
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Improves the foreign aid page.
// @author       RandomNoobster
// @match        https://www.cybernations.net/aid_*
// @icon         https://www.cybernations.net/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438930/Better%20foreign%20aid%20for%20Cyber%20Nations.user.js
// @updateURL https://update.greasyfork.org/scripts/438930/Better%20foreign%20aid%20for%20Cyber%20Nations.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function setCookie(cname, cvalue) {
        const d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    if (window.location.href.includes("https://www.cybernations.net/aid_information.asp?Nation_ID=") || window.location.href == "https://www.cybernations.net/aid_information.asp") {
        let myNation = document.querySelectorAll('[data-popupmenu="popmenu3"]')[0];
        let str = myNation.baseURI;
        let myID = str.substring(str.indexOf('=') + 1);
        let aidNations = document.querySelectorAll("table form table a");
        let balances = {};
        let nationIDs = [];
        aidNations.forEach(aidNation => {
            var theirID = aidNation.href.substring(aidNation.href.indexOf('=') + 1);
            if (theirID === myID) {
                //pass
            } else if (aidNation.href.includes("nation_drill")) {
                aidNation.href = "https://www.cybernations.net/aid_form.asp?Nation_ID=" + theirID + "&bynation=" + myID;
                if (!nationIDs.includes(theirID)) {
                    nationIDs.push(theirID);
                    balances[`${theirID}`] = {money: 0, tech: 0};
                }
            }
        });
        console.log(balances);
        let rows = document.querySelectorAll('[valign="middle"][align="center"]');
        function colorRows() {
            console.log(nationIDs)
            rows.forEach(row => {
                let matchingID = null;
                nationIDs.forEach(item => {
                    if (row.innerHTML.includes(item)) {
                        matchingID = item;
                    }
                })
                if (matchingID != null) {
                    if ((row.innerHTML.includes("$6,000,000") || row.innerHTML.includes("$9,000,000")) && row.innerHTML.includes("0 Tech")) {
                        if (row.innerHTML.indexOf(myID) < row.innerHTML.indexOf(matchingID)) {
                            balances[`${matchingID}`].money -= 1;
                        } else {
                            balances[`${matchingID}`].money += 1;
                        }
                    } else if (row.innerHTML.includes("100 Tech") && row.innerHTML.includes("$0")) {
                        if (row.innerHTML.indexOf(myID) < row.innerHTML.indexOf(matchingID)) {
                            balances[`${matchingID}`].tech -= 1;
                        } else {
                            balances[`${matchingID}`].tech += 1;
                        }
                    }
                }
            })
            rows.forEach(row => {
                if (!row.innerHTML.includes("Expired")) {
                    nationIDs.slice().forEach(item => {
                        if (row.innerHTML.includes(item)) {
                            nationIDs.splice(nationIDs.indexOf(item), 1);
                        }
                    });
                } else {
                    let found = false;
                    let thisID = null;
                    console.log(nationIDs)
                    nationIDs.slice().forEach(item => {
                        console.log(1)
                        if (row.innerHTML.includes(item)) {
                            found = true;
                            thisID = item;
                        }
                    });
                    let sellOrBuy = getCookie("sellOrBuy");
                    if (found) {
                        console.log(sellOrBuy)
                        if (Math.abs(balances[`${thisID}`].money) === Math.abs(balances[`${thisID}`].tech)) {
                            row.style.backgroundColor = "#f3fa28";
                        } else if (Math.abs(balances[`${thisID}`].money) > Math.abs(balances[`${thisID}`].tech)) {
                            if (sellOrBuy == "false") {
                                row.style.backgroundColor = "#ff4d4d"; // red
                            } else {
                                row.style.backgroundColor = "#4ef542"; // green
                            }
                        }
                        else if (Math.abs(balances[`${thisID}`].money) < Math.abs(balances[`${thisID}`].tech)) {
                            if (sellOrBuy == "true") {
                                row.style.backgroundColor = "#4ef542"; // green
                            } else {
                                row.style.backgroundColor = "#ff4d4d"; // red
                            }
                        }
                        else {
                            row.style.backgroundColor = "blue";
                        }
                    }
                    else {
                        console.log("did not find")
                    }
                }
            })
        }

        let paragraph = document.querySelectorAll('table table table table table p')[1];

        let checkSeller = document.createElement("input");
        checkSeller.type = "radio";
        checkSeller.name = "sellOrBuy";
        checkSeller.id = "sell";
        checkSeller.style.verticalAlign = "bottom";
        let labelSeller = document.createElement("label");
        labelSeller.innerHTML = "I am a tech seller";

        let checkBuyer = document.createElement("input");
        checkBuyer.type = "radio";
        checkBuyer.name = "sellOrBuy";
        checkBuyer.id = "buy";
        checkBuyer.style.verticalAlign = "bottom";
        let labelBuyer = document.createElement("label");
        labelBuyer.innerHTML = "I am a tech buyer";
        labelBuyer.style.marginLeft = "20px";

        let sellOrBuy = getCookie("sellOrBuy");
        if (sellOrBuy == "true") {
            checkSeller.checked = true;
        } else {
            checkBuyer.checked = true;
        }

        checkSeller.onchange = checkBuyer.onchange = function renewCookie(event) {
            if (event.target.id == "sell") {
                checkSeller.checked = true;
                setCookie("sellOrBuy", true);
            } else {
                checkBuyer.checked = true;
                setCookie("sellOrBuy", false);
            }
            colorRows();
        }

        labelSeller.appendChild(checkSeller);
        labelBuyer.appendChild(checkBuyer);

        paragraph.after(labelBuyer);
        paragraph.after(labelSeller);

        colorRows();
    } else if (window.location.href.includes("https://www.cybernations.net/aid_form.asp?Nation_ID=")) {
        let inputs = document.querySelectorAll('input');
        let sellOrBuy = getCookie("sellOrBuy");
        if (sellOrBuy == "true") {
            inputs[3].value = 100;
        } else {
            inputs[2].value = 6000000;
        }

    }
})();