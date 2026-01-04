// ==UserScript==
// @name         Exc Balance Helper
// @namespace    http://tampermonkey.net/
// @version      2025-01-04-fix
// @description  /
// @license      MIT
// @author       ChotkiiYT
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lolz.market/*
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        GM.xmlHttpRequest
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/522863/Exc%20Balance%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/522863/Exc%20Balance%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("erm Exc Balance Helper real")
    let bal = parseFloat(document.querySelector(".balanceRow > span:nth-child(1) > span:nth-child(1) > span:nth-child(1)").innerText.replace(',', '.'))

    let currency = document.querySelector(".balanceRow > span:nth-child(1) > span:nth-child(1) > span:nth-child(2)").classList[0].split("--")[1]
    console.log("detected currency ", currency)
    if (currency == "rub"){
        return
    }

    let bal_el = document.querySelector("span.left:nth-child(1)")
    let new_element = bal_el.cloneNode(true);
    new_element.classList.add("muted")
    new_element.id = "gay"
    new_element.style.paddingLeft = "3px"
    new_element.style.scale = "60%"

    function sex(){
        bal = parseFloat(document.querySelector(".balanceRow > span:nth-child(1) > span:nth-child(1) > span:nth-child(1)").innerText.replace(',', '.'))
        if (isNaN(bal)){
            console.log("Waiting for balance")
            setTimeout(sex, 1000)
            return;
        }
        GM.xmlHttpRequest ({
            method:     "GET",
            url:        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`,
            headers:    {
                "Content-Type": "application/json"
            },
            onload:     function (response) {
                let resp = JSON.parse(response.responseText)
                console.log("Rub price: ",resp[currency].rub)
                console.log(document.querySelector(".balanceRow > span:nth-child(1) > span:nth-child(1) > span:nth-child(1)"))
                console.log(bal)
                new_element.innerHTML = `
    <span class="balanceLabel">
								<span class="balanceValue">${parseInt(bal*resp[currency].rub)}</span>
						<span class="svgIcon--rub"></span>
						</span>
    `
                bal_el.after(new_element)
            }
        })
    }

    sex()
    //});


})();