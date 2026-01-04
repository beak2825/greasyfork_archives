// ==UserScript==
// @name         Smooth Sailing (no promotions)
// @namespace    https://blog.tometech.link/
// @version      0.12
// @description  hide promoted jobs
// @author       Thomas Hampton
// @match        https://www.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463497/Smooth%20Sailing%20%28no%20promotions%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463497/Smooth%20Sailing%20%28no%20promotions%29.meta.js
// ==/UserScript==

setInterval(promo_buster,50);

function promo_buster() {
    for(var card of document.getElementsByClassName("job-card-container__footer-item inline-flex align-items-center"))
    {
        if(card.innerText.includes("Promoted"))
        {
            card.parentElement.parentElement.hidden = true;
        }
    }
}