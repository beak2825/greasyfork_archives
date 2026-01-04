// ==UserScript==
// @name         Crafting Tab Organizer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Alucardeck
// @description  Crafting tab organizer for SF
// @match        https://play.soulforged.net/
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440376/Crafting%20Tab%20Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/440376/Crafting%20Tab%20Organizer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var organized = false;
    var craftMap = {};
    craftMap["Crafting"] = "375c63,11b698,1bda06,0f664a,ce8de9,fcf7c9";
    craftMap["Crafting (Tools)"] = "fd63c7,3ca9dd,08639e,2affab,babb47,c30017,a0b77a,068720,58b899";
    craftMap["Crafting (Furniture)"] = "2078f7,e0f499";
    craftMap["Cooking"] = "7a1efc,5444b8,a6e350,519cef,2758da,3a9ea3";
    craftMap["Leatherworking"] = "8090f2,90dcbf,20275f,b1c5a2,c62494,5f9c13,742fbb,91849a,e0bac1,f087b3,44fcbb,0b0912,095161,a0b79e,28ca71";
    craftMap["Tailoring"] = "771558,e80e86,a6534a,479874";
    craftMap["Farming"] = "286daf,c01bcc,b9c19e";
    craftMap["Carpentry"] = "dcc180,d2c3c4,bc9a57,9713d7,edaccb,1b907e";
    craftMap["Doctoring"] = "a929f9,cb108a,ac0744";
    craftMap["Doctoring (Butcher)"] = "74c20f,a2636a,dc3986,dc4872,3c77c0,2d10b7,06e2f7,cf2e71,1323ef,3a378f";
    craftMap["Not Mapped"] = "";

    var categoryOrder = Object.keys(craftMap).sort();

    function organizeCrafts() {
        // check if tab is active
        if (!getCraftIconTab().classList.contains("active")) {
            organized = false;
            return;
        }
        
        if (organized)
            return;

        organized = true;
        // header 
        var mainBlock = document.querySelector("#app > div.main-component > div > div.controls > div > div > div > div.tab-contents > div > div > div > div > div:nth-child(1)");
        var header = mainBlock.firstChild;
        mainBlock.removeChild(header);

        var craftNodeList = mainBlock.querySelectorAll("div > div.craft-list-item");

        var mappedItems = {};

        [].forEach.call(craftNodeList, craft => {
            var block = craft.parentElement;
            var code = getCode(craft);
            var category = getCategory(code);

            if (category == "Not Mapped") {
                appendCodeToButton(craft, code);
            }

            if (!mappedItems[category])
                mappedItems[category] = [];
            mappedItems[category].push(block);
            mainBlock.removeChild(block);

        });


        for (var category of categoryOrder) {
            if (mappedItems[category]) {
                var categoryHeader = header.cloneNode(true);
                categoryHeader.firstChild.firstChild.innerHTML = category;
                mainBlock.appendChild(categoryHeader);

                for (var item of mappedItems[category]) {
                    mainBlock.appendChild(item);
                }
            }
        }

    }

    function appendCodeToButton(craft, code) {
        var btn = craft.querySelector("div > div.buttons");
        var div = document.createElement('div');
        div.innerText = code;
        btn.appendChild(div);
    }

    function getCode(craft) {
        return craft.firstChild.firstChild.firstChild.firstChild.firstChild.style.backgroundImage.substr(14, 6);
    }

    function getCategory(code) {
        for (var category of categoryOrder) {
            if (craftMap[category].includes(code)) {
                return category;
            }
        }
        return "Not Mapped";
    }

    function getCraftIconTab() {
        return document.querySelector("#app > div.main-component > div > div.controls > div > div > div > div.tab-headers > div.tab-header:nth-child(4)");
    }

    document.addEventListener("click", () => organizeCrafts());
    organizeCrafts();
})();