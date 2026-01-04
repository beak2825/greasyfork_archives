// ==UserScript==
// @name         [GC] Overfeed Preventer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  Track pet bloat status and modify and notify if your pet is already bloated to prevent over-feeding
// @author       Heda
// @match        https://www.grundos.cafe/itemview/*
// @match        https://www.grundos.cafe/useobject/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528590/%5BGC%5D%20Overfeed%20Preventer.user.js
// @updateURL https://update.greasyfork.org/scripts/528590/%5BGC%5D%20Overfeed%20Preventer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let q = s => document.querySelector(s),
        itemName = [...document.querySelectorAll("div.flex-column.justify-center span")]
            ?.find(e => e.textContent.includes("Item"))?.textContent.replace("Item :", "").trim();

    if (window.location.href.includes("itemview")) {
        if (itemName) localStorage.setItem("currentItem", itemName);
        if (localStorage.getItem("bloated") === "true" && itemName !== "Bloatershroom") {
            q("input#submit")?.remove();
            let itemActionSelect = q("select#itemaction_select");
            let parentContainer = itemActionSelect?.parentElement;
            if (parentContainer) {
                let alertDiv = document.createElement("div");
                alertDiv.style = "background:red;color:white;font-weight:bold;padding:10px;text-align:center;cursor:pointer;margin-top:10px;border-radius:5px;width:100%;max-width:400px;margin:auto;";
                alertDiv.innerHTML = "PET IS BLOATED <br> CLICK TO RESET";
                alertDiv.onclick = () => {
                    localStorage.setItem("bloated", "false");
                    let btn = document.createElement("input");
                    btn.type = "submit";
                    btn.id = "submit";
                    btn.value = "Submit";
                    btn.className = "form-control flex-grow";
                    parentContainer.insertAdjacentElement('afterend', btn);
                    alertDiv.remove();
                };
                parentContainer.insertAdjacentElement('afterend', alertDiv);
            }
        }
    } else if (window.location.href.includes("useobject")) {
        let t = document.body.textContent;
        localStorage.setItem("bloated", t.includes("and now is bloated") ? "true" : t.includes("now is very full") ? "false" : localStorage.getItem("bloated"));
    }
})();
