// ==UserScript==
// @name         [NPO] Highlight Faction RW Weapons in Armory
// @namespace    echotte.torn.npo
// @version      1.4
// @description  Displays weapon and armor UID on the Faction Armory page.
// @author       echotte [2384135]
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/trade.php*
// @icon         https://static.wikia.nocookie.net/cybernations/images/b/b8/NPObannerflagnew.png/revision/latest/scale-to-width-down/200?cb=20121128045516
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/486228/%5BNPO%5D%20Highlight%20Faction%20RW%20Weapons%20in%20Armory.user.js
// @updateURL https://update.greasyfork.org/scripts/486228/%5BNPO%5D%20Highlight%20Faction%20RW%20Weapons%20in%20Armory.meta.js
// ==/UserScript==

// --------------------------------------------------------------------------
// This script facilitates the transfer of weapons between NPO faction shells for RWs
// by highlighting which weapon(s) should be transferred.

const highlight_weapons = {
    8812176877: '[MilCom 1/13]', // 16% Warlord Steyr AUG (STR)
    8920134353: '[MilCom 2/13]', // 15% Warlord Ithaca 37 (STR)
    8922644717: '[MilCom 3/13]', // 15% Warlord SKS Carbine (STR)
    9131535186: '[MilCom 4/13]', // 18% Warlord Tavor TAR-21 (STR)
    10582387722: '[MilCom 5/13]', // 18% Warlord Benelli M4 Super (PRO)
    10745607036: '[MilCom 6/13]', // 18% Warlord M4A1 Colt Carbine (PRO)
    10846050673: '[MilCom 7/13]', // 17% Warlord Benelli M1 Tactical (END)
    11881146690: '[MilCom 8/13]', // 18% Warlord Enfield (STR)
    11784180597: '[MilCom 9/13]', // 18% Warlord SIG (STR)
    11564139954: '[MilCom 10/13]', // 15% Warlord Ithaca 37 (PRO)

    9702093571: '[MilCom 11/13]', // 39% Backstab Macana (STR)
    9900687194: '[MilCom 12/13]', // 34% Backstab DBK (STR)
    10030116087: '[MilCom 13/13]', // 31% Backstab DBK (END)

    // Old List -
    //8879670561: '[NPO RW 3/20]', //'[RW STR]', // 21% Bleed, 24% powerful Ithaca 37
    //8879728500: '[NPO RW 4/20]', //'[RW STR]', // 26% Bleed Mag 7
    //8774553658: '[NPO RW 5/20]', //'[RW STR]', // 17% Evis Benelli M4 Supers
    //10481969650: '[NPO RW 6/20]', //'[RW STR]', // 16% Evis Benelli M1 Tactical

    //8854335907: '[NPO RW 7/20]', //'[RW STR]', // 10% Stun Metal Nunchaku
    //8922637585: '[NPO RW 8/20]', //'[RW STR]', // 11% Stun Benelli M4 Super
    //8854393197: '[NPO RW 9/20]', //'[RW STR]', // 20% Weaken Kodachi
    //8879665625: '[NPO RW 10/20]', //'[RW STR]', // 31% Weaken SKS Carbine
    //8854336026: '[NPO RW 11/20]', //'[RW STR]', // 20% Slow Metal Nunchaku
    //9451830985: '[NPO RW 12/20]', //'[RW PRO]', // 25% Slow MP5 Navy (PRO)
    //8686621865: '[NPO RW 13/20]', //'[RW STR]', // 21% Wither Skorpion
};
// --------------------------------------------------------------------------

(function () {
    "use strict";
    var currentUrl = window.location.href;

    if (currentUrl.includes("faction")) {
        factionArmoryPage();
    } else if (currentUrl.includes("item")) {
        inventoryPage();
    } else if (currentUrl.includes("trade")) {
        function checkContainer() {
            var containerElement = document.getElementById("inventory-container");
            if (containerElement) {
                console.log("Container has loaded!");
                clearInterval(timer); // Stop checking once container is loaded
                tradePage(); // Your code to execute after the container has loaded
            } else {
                console.log("Container not found.");
            }
        }

        // Check for the container every 2000 milliseconds
        var timer = setInterval(checkContainer, 2000);
    }
})();


function factionArmoryPage() {
    const armory = "#faction-armoury";
    const weapons = "#armoury-weapons > ul.item-list";
    const armor = "#armoury-armour > ul.item-list";
    const parent = document.querySelector(armory);
    const weaponsNode = parent.querySelector(weapons);
    const armourNode = parent.querySelector(armor);

    if (!weaponsNode || !armourNode) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.matches && node.matches(weapons)) {
                            addUID(node);
                        } else if (node.matches && node.matches(armor)) {
                            addUID(node);
                        }
                    });
                }
            });
        });
        observer.observe(parent, { childList: true, subtree: true });
    }

    function addUID(node) {
        const items = Array.from(node.children);
        items.forEach((item) => {
            const UID = item
            .querySelector("li div.img-wrap")
            .getAttribute("data-armoryid");
            const itemName = item.querySelector("li div.name");
            if (UID && itemName && !itemName.classList.contains("uid-added") && Object.keys(highlight_weapons).includes(UID)) {
                itemName.innerHTML += ' ' + highlight_weapons[UID]; //` [NPO RW]`;
                itemName.classList.add("uid-added");
                item.style.backgroundColor = "#880808";
            }
        });
    }
}

function inventoryPage() {

    const targetNodes = document.querySelectorAll(
        "ul#primary-items, ul#secondary-items, ul#melee-items, ul#armour-items"
    );

    const config = {
        childList: true,
    };

    const callback = (mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                Array.from(mutation.target.children).forEach((listing) => {
                    let color;
                    const UID = listing.getAttribute("data-armoryid");
                    const nameEl = listing.querySelector(".name");
                    const itemName = listing
                    .querySelector("div.thumbnail-wrap")
                    .getAttribute("aria-label");
                    if (UID && nameEl && !nameEl.classList.contains("uid-added") && Object.keys(highlight_weapons).includes(UID)) {
                        nameEl.classList.add("uid-added");
                        nameEl.innerHTML = itemName + " " + highlight_weapons[UID];
                        listing.style.backgroundColor = "#880808";
                    }
                });
            }
        });
    };

    const observer = new MutationObserver(callback);

    targetNodes.forEach((targetNode) => {
        observer.observe(targetNode, config);
    });

}

function tradePage() {
    const targetNodes = document.querySelectorAll(
        "ul.primary-items, ul.secondary-items, ul.melee-items, ul.defensive-items"
    );

    const config = {
        childList: true,
    };

    const callback = (mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                Array.from(mutation.target.children).forEach((listing) => {
                    addUID(listing);
                });
            }
        });
    };

    const observer = new MutationObserver(callback);

    targetNodes.forEach((targetNode) => {
        observer.observe(targetNode, config);
    });

    // manual inject - if it lands on the page first??
    targetNodes.forEach((node) => {
        Array.from(node.children).forEach((listing) => {
            addUID(listing);
        });
    });

    function addUID(listing) {
        const str = listing.getAttribute("data-reactid");
        var regex = /\$(\d+)/; // Matches a dollar sign followed by one or more digits
        var UID = str.match(regex)[1];
        const itemName = listing.querySelector("span.t-overflow");

        if (UID && itemName && !itemName.classList.contains("uid-added") && Object.keys(highlight_weapons).includes(UID)) {
            itemName.innerHTML += ' ' + highlight_weapons[UID]; //` [NPO RW]`;
            itemName.classList.add("uid-added");
            listing.style.backgroundColor = "#880808";
        }
    }

}