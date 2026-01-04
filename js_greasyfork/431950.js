// ==UserScript==
// @name         Mer info på foodora
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Visar minsta minsta summan man måste beställa för när man sökt fram restauranger på foodora.
// @author       You
// @match        https://www.foodora.se/restaurants/*
// @icon         https://www.google.com/s2/favicons?domain=foodora.se
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431950/Mer%20info%20p%C3%A5%20foodora.user.js
// @updateURL https://update.greasyfork.org/scripts/431950/Mer%20info%20p%C3%A5%20foodora.meta.js
// ==/UserScript==


function getMinimumOrder(vendorName)
{
    const data = window.__PRELOADED_STATE__;
    for (const vendor of data.organicList.vendors)
    {
        if (vendor.name === vendorName)
        {
            return vendor.minimum_order_amount.toString(10);
        }
    }
    return "-1";
}

window.onload = function()
{
    const vendorInfoElements = document.getElementsByClassName("vendor-info");
    for (let i = 0; i < vendorInfoElements.length; i++)
    {
        const name = vendorInfoElements[i].firstElementChild.firstElementChild.innerHTML;
        const extraInfo = vendorInfoElements[i].lastElementChild;
        const span = document.createElement("span");
        span.innerHTML = ",&nbsp<b>" + getMinimumOrder(name) + " kr</b> Minimum";
        extraInfo.appendChild(span);
    }
}


