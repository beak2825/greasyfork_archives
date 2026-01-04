// ==UserScript==
// @name         Easy rebuy for Cyber Nations
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Makes it easier to rebuy troops
// @author       RandomNoobster
// @match        https://www.cybernations.net/military_purchase.asp*
// @match        https://www.cybernations.net/militarydeploy.asp*
// @icon         https://www.cybernations.net/favicon.ico
// @license      MIT
// @grant        none
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/447812/Easy%20rebuy%20for%20Cyber%20Nations.user.js
// @updateURL https://update.greasyfork.org/scripts/447812/Easy%20rebuy%20for%20Cyber%20Nations.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // captcha solver https://api4.ai/apis/ocr

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

    function checkCookie() {
        let checkboxes = document.querySelectorAll('input[type=checkbox]')
        checkboxes.forEach(box => {
            if (box.checked) {
                setCookie(box.id, true)
            }
            else {
                setCookie(box.id, false)
            }
        })
    }

    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    function httpPost(theUrl, data) {
        console.log(theUrl, data)
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
        xmlHttp.setRequestHeader("Accept", "application/json");
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.send(data);
        return xmlHttp.responseText;
    }

    function sleep() {
        return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 3000) + 1000));
    }

    if (window.location.href.includes("https://www.cybernations.net/military_purchase.asp")) {
        let link = String(window.location.href)
        let nationID = link.slice(link.indexOf("=")+1)
        let form = document.createElement("form")
        let options = [
            {name: "Soldiers", url: "https://www.cybernations.net/militarybuysell.asp?Nation_ID=" + nationID},
            {name: "Tanks", url: "https://www.cybernations.net/tanksbuysell.asp?Nation_ID=" + nationID},
            {name: "Spies", url: "https://www.cybernations.net/spies_purchase.asp"}
        ]

        options.forEach(option => {
            let newLabel = document.createElement("label")
            newLabel.innerHTML = option.name
            let newInput = document.createElement("input")
            newInput.id = option.name
            newInput.dataset.url = option.url
            newInput.type = "checkbox"
            newInput.onclick = checkCookie
            let cookie = getCookie(option.name)
            if (cookie == "true") {
                newInput.checked = true
            }
            newLabel.appendChild(newInput)
            form.appendChild(newLabel)
        })

        let submit = document.createElement("input")
        submit.type = "button"
        submit.value = "Rebuy Selected"
        submit.style.display = "block"
        submit.onclick = rebuy
        form.appendChild(submit)

        let table2 = document.querySelector('#table2')
        let p = document.createElement('p')
        table2.before(p)
        table2.before(form)

        let soldiersCheckbox = document.querySelector('#Soldiers')
        let tanksCheckbox = document.querySelector('#Tanks')
        let spiesCheckbox = document.querySelector('#Spies')

        async function rebuy() {
            p.innerHTML = ""
            submit.disabled = true
            submit.value = "Working...."
            if (soldiersCheckbox.checked) {
                let url = "https://www.cybernations.net/militarybuysell.asp?Nation_ID=" + nationID
                let page = httpGet(url)
                let purchaseSoldiers = page.slice(page.indexOf("Maximum Soldier Purchase")+75)
                purchaseSoldiers = purchaseSoldiers.slice(0, purchaseSoldiers.indexOf("<"))
                console.log(purchaseSoldiers)
                if (purchaseSoldiers != 0) {
                    let value = page.slice(page.indexOf('name="VALUE"')+20)
                    value = value.slice(0, value.indexOf('"'))
                    console.log(value)
                    let data = `Transaction=${purchaseSoldiers}&VALUE=${value}`;
                    await sleep()
                    let response = httpPost(url, data)
                    if (!response.includes("Transaction Successful")) {
                        p.innerHTML += "An error might have occurred when purchasing soldiers!<br>"
                    }
                    else {
                        p.innerHTML += `${purchaseSoldiers} soldiers successfully bought!<br>`
                    }
                }
                else {
                    p.innerHTML += "No soldiers can be bought!<br>"
                }
                await sleep()
            }
            if (tanksCheckbox.checked) {
                let url = "https://www.cybernations.net/tanksbuysell.asp?Nation_ID=" + nationID
                let page = httpGet(url)
                let purchaseTanks = page.slice(page.indexOf("Maximum Tank Purchase")+72)
                purchaseTanks = purchaseTanks.slice(0, purchaseTanks.indexOf("<"))
                console.log(purchaseTanks)
                if (purchaseTanks != 0) {
                    let value = page.slice(page.indexOf('name="VALUE"')+20)
                    value = value.slice(0, value.indexOf('"'))
                    console.log(value)
                    let data = `Transaction=${purchaseTanks}&VALUE=${value}`;
                    await sleep()
                    let response = httpPost(url, data)
                    if (!response.includes("Transaction Successful")) {
                        p.innerHTML += "An error might have occurred when purchasing tanks!<br>"
                    }
                    else {
                        p.innerHTML += `${purchaseTanks} tanks successfully bought!<br>`
                    }
                }
                else {
                    p.innerHTML += "No tanks can be bought!<br>"
                }
                await sleep()
            }
            if (spiesCheckbox.checked) {
                let url = "https://www.cybernations.net/spies_purchase.asp"
                let page = httpGet(url)
                let currentSpies = page.slice(page.indexOf("Number of Spies")+82)
                currentSpies = currentSpies.slice(0, currentSpies.indexOf("o"))
                console.log(currentSpies)
                let maxSpies = page.slice(page.indexOf("Number of Spies")+82)
                maxSpies = maxSpies.slice(maxSpies.indexOf("of")+3)
                maxSpies = maxSpies.slice(0, maxSpies.indexOf("<"))
                console.log(maxSpies)
                let purchaseSpies = Number(maxSpies) - Number(currentSpies)
                console.log(purchaseSpies)
                if (purchaseSpies != 0 && !isNaN(purchaseSpies)) {
                    let value = page.slice(page.indexOf('name="VALUE"')+20)
                    value = value.slice(0, value.indexOf('"'))
                    console.log(value)
                    let data = `Transaction=${purchaseSpies}&VALUE=${value}`;
                    await sleep()
                    let response = httpPost(url, data)
                    if (!response.includes("Transaction Successful")) {
                        p.innerHTML += "An error might have occurred when purchasing spies!<br>"
                    }
                    else {
                        p.innerHTML += `${purchaseSpies} spies successfully bought!<br>`
                    }
                }
                else {
                    p.innerHTML += "No spies can be bought!<br>"
                }
            }
            submit.disabled = false
            submit.value = "Rebuy Selected"
        }
    }
    else if (window.location.href.includes("https://www.cybernations.net/militarydeploy.asp")) {
        let soldiers = document.querySelectorAll("td > i")[5]
        let tanks = document.querySelectorAll("td > i")[7]
        let soldierField = document.querySelectorAll("input")[0]
        let tankField = document.querySelectorAll("input")[1]
        soldierField.value = soldiers.innerText
        tankField.value = tanks.innerText
    }
})();