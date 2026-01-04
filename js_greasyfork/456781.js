// ==UserScript==
// @name         Easy rebuy for Politics and War
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Makes it easier to rebuy troops
// @author       RandomNoobster
// @match        https://politicsandwar.com/nation/military/
// @icon         https://politicsandwar.com/favicon.ico
// @license      MIT
// @grant        none
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/456781/Easy%20rebuy%20for%20Politics%20and%20War.user.js
// @updateURL https://update.greasyfork.org/scripts/456781/Easy%20rebuy%20for%20Politics%20and%20War.meta.js
// ==/UserScript==


(async function() {
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

    function refresh() {
        return new Promise(resolve => setTimeout(resolve, 10));
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
        while(true) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
            xmlHttp.send( null );
            console.log(xmlHttp) // for debugging
            if (xmlHttp.responseURL != "https://politicsandwar.com/human/") break;
            window.open("https://politicsandwar.com/human/", '_blank');
            alert("I encountered a captcha! Please complete it before continuing!");
        }
        var doc = new DOMParser().parseFromString(xmlHttp.responseText, "text/html");
        return doc;
    }

    function httpPost(theUrl, data) {
        console.log(theUrl, data)
        while(true) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
            xmlHttp.setRequestHeader("Accept", "application/json");
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlHttp.send(data);
            console.log(xmlHttp) // for debugging
            if (xmlHttp.responseURL != "https://politicsandwar.com/human/") break;
            window.open("https://politicsandwar.com/human/", '_blank');
            alert("I encountered a captcha! Please complete it before continuing!");
        }
        var doc = new DOMParser().parseFromString(xmlHttp.responseText, "text/html");
        return doc;
    }

    let form = document.createElement("form")
    let options = [
        {name: "Soldiers", url: "https://politicsandwar.com/nation/military/soldiers/", id: "soldiers", buyname: "soldiers", uniqueparam: "buysoldiers=Enlist%2FDischarge+Soldiers"},
        {name: "Tanks", url: "https://politicsandwar.com/nation/military/tanks/", id: "tanks", buyname: "tanks", uniqueparam: "buytanks=Manufacture%2FDecommission+Tanks"},
        {name: "Aircraft", url: "https://politicsandwar.com/nation/military/aircraft/", id: "aircraft", buyname: "aircraft", uniqueparam: "buyaircraft=Manufacture%2FDecommission+Aircraft"},
        {name: "Ships", url: "https://politicsandwar.com/nation/military/navy/", id: "ships", buyname: "ships", uniqueparam: "buyships=Manufacture%2FDecommission+Ships"},
        {name: "Spies", url: "https://politicsandwar.com/nation/military/spies/", id: "aircraftinput", buyname: "spies", uniqueparam: "train_spies=Enlist%2FDischarge+Spies"}, //spies=3&train_spies=Enlist%2FDischarge+Spies&token=cd028b0fae925fbe7
        {name: "Missiles", url: "https://politicsandwar.com/nation/military/missiles/", id: "aircraftinput", buyname: "missile_purchase_input_amount", uniqueparam: "missile_purchase_form_submit=Manufacture%2FDecommission+Missiles"}, //missile_purchase_input_amount=1&missile_purchase_form_submit=Manufacture%2FDecommission+Missiles&token=cd028b0fae925fbe7
        {name: "Nukes", url: "https://politicsandwar.com/nation/military/nukes/", id: "aircraftinput", buyname: "ships", uniqueparam: "buyships=Manufacture%2FDecommission+Nuclear+Weapons"} //ships=1&buyships=Manufacture%2FDecommission+Nuclear+Weapons&token=cd028b0fae925fbe7
    ]

    options.forEach(option => {
        // Creating the checkboxes
        let newLabel = document.createElement("label")
        newLabel.innerHTML = option.name
        newLabel.style.margin = "4px"
        newLabel.style.marginTop = "40px"
        let newInput = document.createElement("input")
        newInput.id = option.name
        newInput.dataset.url = option.url
        newInput.type = "checkbox"
        newInput.style.margin = "4px"
        newInput.style.width = "16px"
        newInput.style.height = "16px"
        newInput.onclick = checkCookie
        let cookie = getCookie(option.name)
        if (cookie == "true") {
            newInput.checked = true
        }
        newLabel.appendChild(newInput)
        form.appendChild(newLabel)
    })

    // Creating the rebuy button
    let submit = document.createElement("input")
    submit.type = "button"
    submit.value = "Rebuy selected"
    submit.style.display = "block"
    submit.style.margin = "auto"
    submit.className = "btn btn-primary"
    submit.onclick = rebuy
    form.appendChild(submit)

    // Inserting the elements
    let table2 = document.querySelector('a.btn[href="https://politicsandwar.com/nation/military/customize/"]')
    let p = document.createElement('p')
    table2.after(p)
    table2.after(form)

    let mainRssBar = document.querySelector(".informationbar")

    async function rebuy() {
        p.innerHTML = ""
        submit.value = "Working...."
        submit.disabled = true

        // Iterate through the unit types
        for (const option of options) {
            await refresh()
            let checkbox = document.querySelector("#" + option.name)
            if (checkbox.checked) {
                // Creating the result div
                let purchaseResult
                let error = false
                let errorMessage = document.createElement("p")
                errorMessage.innerHTML = `No purchase of ${option.name.toLowerCase()} was made for an unknown reason.`
                let div = document.createElement("div")
                div.className = "alert alert-danger"
                let title = document.createElement("p")
                title.className = "bold"
                title.innerHTML = "Error:"

                try {
                    let page = httpGet(option.url)

                    // Getting the token etc
                    let token = page.querySelector('[name=token]').value
                    let toBuy = page.querySelector("#" + option.id).value
                    if (toBuy == 0) {
                        toBuy = 1
                    }

                    // Actually performing the purchase
                    let data = `${option.buyname}=${toBuy}&${option.uniqueparam}&token=${token}`
                    let response = httpPost(option.url, data)
                    let rssBar = response.querySelector(".informationbar")
                    mainRssBar.innerHTML = rssBar.innerHTML
                    purchaseResult = response.querySelector(".alert-success, .alert-danger")
                    if (!purchaseResult.innerText.includes("Error") && !purchaseResult.innerText.includes("successfully") && !purchaseResult.innerText.includes("tomorrow to build")) {
                        error = true
                    }
                }
                catch {
                    error = true
                }

                // Printing out the results
                if (error) {
                    div.appendChild(title)
                    div.appendChild(errorMessage)
                    purchaseResult = div
                }

                console.log(purchaseResult)
                p.after(purchaseResult)
            }
        }
        submit.value = "Rebuy selected"
        submit.disabled = false

    }


})();