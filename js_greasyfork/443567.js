// ==UserScript==
// @name         HUDK - UX tweaks
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Mutes downvoted items. Hide specific merchants
// @author       thedrunkendev
// @match        https://www.hotukdeals.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotukdeals.com
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://gitcdn.xyz/cdn/CoeJoder/waitForKeyElements.js/6b9ca81bf32899b4274086aa9d48c3ce5648e0b6/waitForKeyElements.js
// @downloadURL https://update.greasyfork.org/scripts/443567/HUDK%20-%20UX%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/443567/HUDK%20-%20UX%20tweaks.meta.js
// ==/UserScript==
/* global waitForKeyElements */

(function() {
    'use strict';

    console.log("Injecting Userscript")
    let hiddenMerchants = GM_getValue("gm_hiddenmerchants") || [];
    console.log("Found hiddent merchants:", hiddenMerchants)

    // Hide downvoted
    waitForKeyElements(".vote-box > .bg--color-grey .icon--minus", (el) => {
        console.log(el)
        el.closest(".threadGrid").style.opacity = 0.5;
    }, false, 1_000);

    // Add a hide merchant button
    waitForKeyElements("button.cept-off", (el) => {
        const merchant = el.closest(".threadGrid").querySelector(".cept-merchant-name");
        const merchantIsHidden = hiddenMerchants.includes(merchant?.innerText);
        if (merchant && merchantIsHidden){
            hideMerchant(el, merchant.innerText)
        }
        else{
            insert(el);
        }
    }, false, 1_000);

    function insert(el) {
        var textEl = document.createElement("button")
        textEl.innerText = "hide merchant";
        textEl.className = el.className.replace("cept-off", "btn btn--mode-boxSec");
        textEl.onclick = (clickedEl) => {
            const merchant = el.closest(".threadGrid").querySelector(".cept-merchant-name").innerText;

            hiddenMerchants.push(merchant);
            GM_setValue("gm_hiddenmerchants", hiddenMerchants);

            // Hide button & thread
            clickedEl.target.style.display="none";
            hideMerchant(clickedEl.target, merchant);
        };

        el.insertAdjacentElement("beforebegin", textEl);
    }

    function hideMerchant(el, merchantName){
        const thread = el.closest(".threadGrid");
        thread.style.opacity = 0.8;
        thread.style.justifyContent="space-between";
        thread.style.display="flex";
        thread.innerHTML = `<div><span class="cept-merchant-name">${merchantName}</span> is hidden.</div>`;

        var textEl = document.createElement("button")
        textEl.innerText = "Undo";
        textEl.className = el.className="btn btn--mode-boxSec";
        textEl.onclick = (clickedEl) => {
            const merchant = thread.querySelector(".cept-merchant-name").innerText;

            hiddenMerchants=hiddenMerchants.filter(x=> x!=merchant);
            console.log(hiddenMerchants)
            GM_setValue("gm_hiddenmerchants", hiddenMerchants);

            // Hide button & thread
            clickedEl.target.style.display="none";
            // TODO - show the deal?
        };
        thread.appendChild(textEl);

    }
})();
