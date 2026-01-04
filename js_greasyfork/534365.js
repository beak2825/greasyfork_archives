// ==UserScript==
// @name            RW Bonus Convenient Name Extended
// @author          DeKleineKobini [2114440] (original by RyuFive [1635537])
// @match           https://www.torn.com/displaycase.php*
// @match           https://www.torn.com/amarket.php*
// @match           https://www.torn.com/bazaar.php*
// @match           https://www.torn.com/factions.php?step*
// @match           https://www.torn.com/item.php*
// @namespace       https://github.com/RyuFive/TornScripts/raw/main/RW_Bonus_Convenient_Name.user.js
// @version         5.1.0
// @description     Improve RW Bonus information.
// @icon            https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license         MIT
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534365/RW%20Bonus%20Convenient%20Name%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/534365/RW%20Bonus%20Convenient%20Name%20Extended.meta.js
// ==/UserScript==

/*
 * Settings
 */
const API_KEYS = [];
const SINGLE_BB_VALUE = 500_000;
const ARMOR_HIGHLIGHT_MODIFIER = 0.8;

/*
 * Script Internals
 * edits not recommended
 */
const MODIFIED_CLASS_NAME = "rw-bonus-modified";
const HIGHLIGHT_CLASS_NAME = "rw-bonus-highlight";

GM_addStyle(`
    #armoury-weapons {
        .loaned {
          width: 75px !important;
        }
        
        .type {
          width: 133px !important;
        }
        .double {
          height: 40px !important;
          line-height: 20px !important;
        }
    }
    
    #armoury-armour {
        .loaned {
          width: 75px !important;
        }
        
        .type {
          width: 133px !important;
        }
        
        .double {
          height: 40px !important;
          line-height: 20px !important;
        }
    }
    
    .${HIGHLIGHT_CLASS_NAME} {
        .c-bid-wrap {
            background-color: seagreen;
        }
    }
`);

const API_LOCK = {};
const API_CACHE = {};
let callCount = 0;

const MILLIS_MINUTE = 60_000;
const MILLIS_5_MINUTES = MILLIS_MINUTE * 5;
const MILLIS_1_HOUR = MILLIS_MINUTE * 60;

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

const BB_AMOUNT_TIER1 = 4;
const BB_AMOUNT_TIER2 = 6;
const BB_AMOUNT_TIER3 = 10;
const BB_AMOUNT_TIER4 = 14;
const BB_AMOUNT = {
    Pistol: BB_AMOUNT_TIER1,
    SMG: BB_AMOUNT_TIER1,
    Clubbing: BB_AMOUNT_TIER2,
    Piercing: BB_AMOUNT_TIER2,
    Slashing: BB_AMOUNT_TIER2,
    Shotgun: BB_AMOUNT_TIER3,
    Rifle: BB_AMOUNT_TIER3,
    "Machine gun": BB_AMOUNT_TIER4,
    "Heavy artillery": BB_AMOUNT_TIER4,
};
const BB_AMOUNT_SPECIALS = {
    "Bread Knife": 6,
    "Poison Umbrella": 6,
    Sledgehammer: 6,
    "Nock Gun": 10,
    "Rheinmetall MG 3": 14,
    "Snow Cannon": 14,
    Handbag: 100,
    "Pink Mac-10": 150,
    "Dual TMPs": 200,
    "Dual Bushmasters": 200,
    "Dual MP5s": 200,
    "Dual P90s": 200,
    "Dual Uzis": 200,
    "Gold Plated AK-47": 200,
};

async function fetchAPI(path, ttl, options = {}) {
    const _cacheResult = cacheResult(path, options);
    if (_cacheResult) return _cacheResult;

    const _cacheKey = cacheKey(path, options);
    if (_cacheKey in API_LOCK) {
        await sleep(100);
        return fetchAPI(path, ttl, options);
    }
    API_LOCK[_cacheKey] = true;

    const nextKeyIndex = callCount++ % API_KEYS.length;
    const nextKey = API_KEYS[nextKeyIndex];

    const headers = new Headers();
    headers.append("Authorization", `ApiKey ${nextKey}`);

    const params = new URLSearchParams();
    params.set("comment", "RW-Bonus-Ext");
    if (options.params) {
        for (const [key, value] of Object.entries(options.params)) {
            // noinspection JSCheckFunctionSignatures
            params.append(key, value);
        }
    }

    const result = await fetch(`https://api.torn.com/v2/${path}?${params}`, { headers }).then((x) => x.json());

    if (!("error" in result)) {
        API_CACHE[_cacheKey] = { result: result, valid: Date.now() + ttl };
    }
    delete API_LOCK[_cacheKey];

    return result;
}

function cacheKey(path, options) {
    const params = new URLSearchParams();
    if (options.params) {
        for (const [key, value] of Object.entries(options.params)) {
            // noinspection JSCheckFunctionSignatures
            params.append(key, value);
        }
    }

    return `${path}${params.toString() ? "?" + params : ""}`;
}

function cacheResult(path, options) {
    const key = cacheKey(path, options);
    if (!(key in API_CACHE)) return null;

    const { valid, result } = API_CACHE[key];

    return valid >= Date.now() ? result : null;
}

async function amarket() {
    const tab = document.querySelector(".tab-menu-cont[data-itemtype][aria-expanded='true']");

    const rows = tab.querySelectorAll(".items-list > li:not(.clear)");
    if (rows.length === 0) return;

    const tabType = tab?.dataset.itemtype;

    const apiItems = tabType === "weapons" ? (await fetchAPI("torn/items", MILLIS_1_HOUR, { params: { cat: "Weapon" } }))?.items : null;

    for (const item of rows) {
        if (item.classList.contains(MODIFIED_CLASS_NAME)) continue;
        item.classList.add(MODIFIED_CLASS_NAME);

        const descriptions = [];

        const bonusElements = item.querySelectorAll(".bonus-attachment-icons");
        for (const bonus of bonusElements) {
            const title = bonus.title;
            if (!title) continue;

            const name = title.split(">")[1].split("<")[0];
            const value = format(title, name);

            descriptions.push(value + name);
        }

        let targetPrice;
        if (tabType === "weapons" && apiItems) {
            const id = parseInt(item.querySelector(".item-hover").getAttribute("item"));
            const apiItem = apiItems.find((apiItem) => apiItem.id === id);

            const name = apiItem.name;
            const weaponType = apiItem.sub_type;
            const rarity = itemRarity(item);
            const effectCount = bonusElements.length;

            const bbAmount = calculateBBAmount(name, weaponType, rarity, effectCount);

            if (bbAmount > 0) {
                const bbWorth = bbAmount * SINGLE_BB_VALUE;

                targetPrice = bbWorth;
                descriptions.push(`Worth: ${CURRENCY_FORMATTER.format(bbWorth)}`);
            }
        } else if (tabType === "armor") {
            const id = item.querySelector(".item-hover").getAttribute("item");

            const { message, lowestPrice } = await getPriceDescription(id);
            if (lowestPrice !== undefined) {
                targetPrice = lowestPrice * ARMOR_HIGHLIGHT_MODIFIER;
            }

            descriptions.push(message);
        }

        if (shouldHighlight(targetPrice, item)) {
            item.classList.add(HIGHLIGHT_CLASS_NAME);
        }

        const descriptionElement = item.querySelector("p.t-gray-6");
        descriptionElement.innerHTML = `<span class="${MODIFIED_CLASS_NAME}">${descriptions.join("<br>")}</span>`;
    }
}

function shouldHighlight(targetPrice, item) {
    console.log("DKK highlight 1", item, targetPrice);
    if (!targetPrice) return false;

    const currentPriceText = item.querySelector(".c-bid-wrap")?.textContent.trim();
    const matchedPriceText = currentPriceText.match(/([\d,]+)/i);
    console.log("DKK highlight 2", currentPriceText, matchedPriceText);
    if (!matchedPriceText) return false;

    const currentPrice = parseInt(matchedPriceText[0].replaceAll(",", ""));
    console.log("DKK highlight 3", currentPrice, targetPrice >= currentPrice);

    return targetPrice >= currentPrice;
}

async function getPriceDescription(id) {
    const result = await fetchAPI(`market/${id}/itemmarket`, MILLIS_5_MINUTES);
    if ("error" in result) {
        return { message: `Price: error ${result.error.code}` };
    }

    const { listings } = result.itemmarket;
    if (!listings.length) {
        return { message: `Price: no listings` };
    }

    const lowestPrice = listings[0].price;
    return { message: `Price: ${CURRENCY_FORMATTER.format(lowestPrice)}`, lowestPrice };
}

function sleep(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
}

function itemRarity(item) {
    const plate = item.querySelector(".item-plate");
    if (!plate) return "normal";

    if (plate.classList.contains("glow-yellow")) return "yellow";
    else if (plate.classList.contains("glow-orange")) return "orange";
    else if (plate.classList.contains("glow-red")) return "red";
    else return "normal";
}

function calculateBBAmount(name, weaponType, rarity, effectCount) {
    if (name in BB_AMOUNT_SPECIALS) return BB_AMOUNT_SPECIALS[name];

    if (rarity === "normal") return null;

    if (!(weaponType in BB_AMOUNT)) return null;

    let rarityModifier = 1;
    if (rarity === "orange") rarityModifier = 3;
    else if (rarity === "red") rarityModifier = 9;

    if (effectCount === 2) rarityModifier *= 1.5;

    return BB_AMOUNT[weaponType] * rarityModifier;
}

function displaycase() {
    const darkmode = $("#dark-mode-state")[0].checked; // dark or light

    const items = $(".bonus-attachment-icons").parents("div.iconsbonuses");
    if (items.length === 0) return;

    for (const index in items) {
        if (!isIntNumber(index)) continue;
        const item = items[index];
        let title = $(item).find("span.bonus-attachment-icons")[0].title;
        if (!title) continue;

        let name = title.split(">")[1].split("<")[0];
        let value = format(title, name);

        const bonus = document.createElement("span");
        const br = document.createElement("br");

        bonus.innerHTML = value + name;
        if (darkmode) {
            bonus.setAttribute("style", "background-color: #000000b0;");
        } else {
            bonus.setAttribute("style", "background-color: #ffffffb0;");
        }
        $(item).find("span.bonus-attachment-icons")[0].appendChild(bonus);
        $(item).find("span.bonus-attachment-icons")[0].setAttribute("style", "float:left;white-space: nowrap;right: 0px;padding-left: 0px;top:-40px");

        const second = $(item).find("span.bonus-attachment-icons")[1];
        if (second !== undefined) {
            item.insertBefore(br, second);
            title = second.title;
            name = title.split(">")[1].split("<")[0];
            value = format(title, name);
            const bonus2 = document.createElement("span");
            bonus2.innerHTML = value + name;
            if (darkmode) {
                bonus2.setAttribute("style", "background-color: #000000b0;");
            } else {
                bonus2.setAttribute("style", "background-color: #ffffffb0;");
            }
            second.appendChild(bonus2);
            second.setAttribute("style", "float:left;white-space: nowrap;right: 0px;padding-left: 0px;top:-40px");
        }
    }
    for (const index in items) {
        if (!isIntNumber(index)) continue;
        const item = items[index];
        let title = $(item).find("span.bonus-attachment-icons")[0].title;
        if (!title) continue;

        let name = title.split(">")[1].split("<")[0];
        let value = format(title, name);

        const bonus = document.createElement("span");
        const br = document.createElement("br");

        bonus.innerHTML = value + name;
        if (darkmode) {
            bonus.setAttribute("style", "background-color: #000000b0;");
        } else {
            bonus.setAttribute("style", "background-color: #ffffffb0;");
        }
        $(item).find("span.bonus-attachment-icons")[0].appendChild(bonus);
        $(item).find("span.bonus-attachment-icons")[0].setAttribute("style", "float:left;white-space: nowrap;right: 0px;padding-left: 0px;top:-40px");

        const second = $(item).find("span.bonus-attachment-icons")[1];
        if (!second) {
            item.insertBefore(br, second);
            title = second.title;
            name = title.split(">")[1].split("<")[0];
            value = format(title, name);
            const bonus2 = document.createElement("span");
            bonus2.innerHTML = value + name;
            if (darkmode) {
                bonus2.setAttribute("style", "background-color: #000000b0;");
            } else {
                bonus2.setAttribute("style", "background-color: #ffffffb0;");
            }
            second.appendChild(bonus2);
            second.setAttribute("style", "float:left;white-space: nowrap;right: 0px;padding-left: 0px;top:-40px");
        }
    }
}

function bazaar(triggered) {
    const darkmode = $("#dark-mode-state")[0].checked; // dark or light

    // var items = $(".bonus-attachment-icons").parents("div.iconsbonuses")
    if (triggered && triggered[0] && triggered[0].childElementCount >= 1) {
        let name = triggered[0].childNodes[0].childNodes[0].className.split("-")[2];
        name = name.charAt(0).toUpperCase() + name.slice(1);

        if (name === "Full") name = "EOD";
        else if (name === "Negative") name = "Delta";
        else if (name === "Sentinel") name = "Sentinel";
        else if (name === "Vanguard") name = "Vanguard";
        else if (name === "Fury") name = "Double Tap";

        const bonus = document.createElement("span");

        bonus.innerHTML = name;
        if (darkmode) {
            bonus.setAttribute("style", "background-color: #000000b0;");
        } else {
            bonus.setAttribute("style", "background-color: #ffffffb0;");
        }
        triggered[0].childNodes[0].appendChild(bonus);
        triggered[0].setAttribute("style", "float:left;white-space: nowrap;right: 0px;padding-left: 5px;top: 3px;display:inline-block !important");

        if (triggered[0].childElementCount === 2) {
            let name = triggered[0].childNodes[1].childNodes[0].className.split("-")[2];
            name = name.charAt(0).toUpperCase() + name.slice(1);

            if (!name) {
                const bonus2 = document.createElement("span");

                bonus2.innerHTML = name;
                if (darkmode) {
                    bonus2.setAttribute("style", "background-color: #000000b0;");
                } else {
                    bonus2.setAttribute("style", "background-color: #ffffffb0;");
                }
                triggered[0].childNodes[1].appendChild(bonus2);
                triggered[0].setAttribute("style", "float:left;white-space: nowrap;right: 0px;padding-left: 5px;top:3px;display:inline-block !important");
            }
        }
    }
}

function manage(triggered) {
    if (triggered && triggered[0]) {
        const displayElement = triggered[0].parentElement.parentElement.parentElement.childNodes[2].childNodes[0];

        const className = triggered[0].className;
        if (className.includes("blank-bonus")) return;

        let name = className.split("-")[2];
        name = name.charAt(0).toUpperCase() + name.slice(1);

        if (name === "Full") name = "EOD";
        else if (name === "Negative") name = "Delta";
        else if (name === "Sentinel") name = "Sentinel";
        else if (name === "Vanguard") name = "Vanguard";
        else if (name === "Poisoned") name = "Poison";

        displayElement.innerHTML = displayElement.innerHTML.split(" x")[0] + " (" + name + ")";
    }
}

function armory(triggered) {
    const tabId = triggered[0].parentElement.parentElement.parentElement.parentElement.id;
    if (tabId === "armoury-weapons") {
        const display = triggered[0].parentElement.parentElement.childNodes[9];
        display.textContent = "";

        const title1 = triggered[0].childNodes[1].title;
        if (!title1) return;

        const name1 = title1.split(">")[1].split("<")[0];
        const value1 = format(title1, name1);
        const text = document.createElement("span");
        const br = document.createElement("br");
        text.textContent = value1 + name1;
        display.appendChild(text);
        display.appendChild(br);

        const title2 = triggered[0].childNodes[3].title;
        if (!title2) return;

        const name2 = title2.split(">")[1].split("<")[0];
        const value2 = format(title2, name2);
        const text2 = document.createElement("span");
        text2.textContent = "" + value2 + name2;
        text2.setAttribute("style", "padding-left: 11px !important;");
        display.appendChild(text2);
        display.className += " double";
    } else if (tabId === "armoury-armour") {
        const display = triggered[0].parentElement.parentElement.childNodes[9];
        display.textContent = "";

        const title = triggered[0].childNodes[1].title;
        if (!title) return;

        const name = title.split(">")[1].split("<")[0];
        const value = format(title, name);
        const text = document.createElement("span");
        const br = document.createElement("br");
        text.textContent = value + name;
        display.appendChild(text);
        display.appendChild(br);
    }
}

function inventoryAndBazaar(triggered) {
    const link = document.URL;

    if (link.includes("item")) {
        if (triggered && triggered[0] && triggered[0].childElementCount >= 3) {
            let element = triggered[0].childNodes[5].childNodes[1];
            if (triggered[0].childNodes[5].className.includes("testtest")) element = triggered[0].childNodes[7].childNodes[1];

            const displayElement = triggered[0].parentElement.parentElement.parentElement.childNodes[3].childNodes[1].childNodes[3].childNodes[3];

            let title = element.title;
            if (!title) return;

            let name = title.split(">")[1].split("<")[0];
            let value = format(title, name);

            if (name === "Full") name = "EOD";
            else if (name === "Negative") name = "Delta";
            else if (name === "Sentinel") name = "Sentinel";
            else if (name === "Vanguard") name = "Vanguard";
            else if (name === "Poisoned") name = "Poison";

            displayElement.innerHTML = displayElement.innerHTML + " (" + value + " " + name + ")";

            if (!element.parentElement.childNodes[3].className.includes("blank-bonus")) {
                const title = element.parentElement.childNodes[3].title;
                if (!title) return;

                name = title.split(">")[1].split("<")[0];
                value = format(title, name);

                if (name === "Full") name = "EOD";
                else if (name === "Negative") name = "Delta";
                else if (name === "Sentinel") name = "Sentinel";
                else if (name === "Vanguard") name = "Vanguard";
                else if (name === "Poisoned") name = "Poison";

                displayElement.innerHTML = displayElement.innerHTML.slice(0, -1) + ", " + value + " " + name + ")";
            }
        }
    } else if (link.includes("bazaar.php#/add")) {
        if (triggered && triggered[0] && triggered[0].childElementCount >= 1) {
            const element = triggered[0].childNodes[2].childNodes[0];
            const displayElement = triggered[0].parentElement.parentElement.parentElement.childNodes[1].childNodes[1].childNodes[0];

            const title = element.title;
            if (!title) return;

            let name = title.split(">")[1].split("<")[0];
            let value = format(title, name);

            if (name === "Full") name = "EOD";
            else if (name === "Negative") name = "Delta";
            else if (name === "Sentinel") name = "Sentinel";
            else if (name === "Vanguard") name = "Vanguard";
            else if (name === "Poisoned") name = "Poison";

            displayElement.innerHTML = displayElement.innerHTML + " (" + value + " " + name + ")";

            if (!element.parentElement.childNodes[1].className.includes("blank-bonus")) {
                const title = element.parentElement.childNodes[1].title;
                if (!title) return;

                name = title.split(">")[1].split("<")[0];
                value = format(title, name);

                if (name === "Full") name = "EOD";
                else if (name === "Negative") name = "Delta";
                else if (name === "Sentinel") name = "Sentinel";
                else if (name === "Vanguard") name = "Vanguard";
                else if (name === "Poisoned") name = "Poison";

                displayElement.innerHTML = displayElement.innerHTML.slice(0, -1) + ", " + value + " " + name + ")";
            }
        }
    }
    //     else if (link.includes('imarket.php#/p=addl')) {
    //         if (triggered && triggered[0] && triggered[0].childElementCount >= 1) {
    //             element = triggered[0].childNodes[2].childNodes[0]

    //             title = element.title
    //             if (title == '') return

    //             name = title.split('>')[1].split('<')[0]
    //             value = format(title, name)

    //             if (name == "Full") name = "EOD"
    //             if (name == "Negative") name = "Delta"
    //             if (name == "Sentinel") name = "Sentinel"
    //             if (name == "Vanguard") name = "Vanguard"
    //             if (name == "Poisoned") name = "Poison"

    //             triggered[0].parentElement.parentElement.parentElement.childNodes[1].childNodes[1].childNodes[0].innerHTML = triggered[0].parentElement.parentElement.parentElement.childNodes[1].childNodes[1].childNodes[0].innerHTML + " (" + value + " " + name + ")"

    //             if (!element.parentElement.childNodes[1].className.includes('blank-bonus')) {
    //                 title = element.parentElement.childNodes[1].title
    //                 if (title == '') return

    //                 name = title.split('>')[1].split('<')[0]
    //                 value = format(title, name)

    //                 if (name == "Full") name = "EOD"
    //                 if (name == "Negative") name = "Delta"
    //                 if (name == "Sentinel") name = "Sentinel"
    //                 if (name == "Vanguard") name = "Vanguard"
    //                 if (name == "Poisoned") name = "Poison"

    //                 triggered[0].parentElement.parentElement.parentElement.childNodes[1].childNodes[1].childNodes[0].innerHTML = triggered[0].parentElement.parentElement.parentElement.childNodes[1].childNodes[1].childNodes[0].innerHTML.slice(0, -1) + ", " + value + " " + name + ")"
    //             }
    //         }
    //     }
}

function format(title, name) {
    let value = title.split("%")[0].split(">")[3] + "% ";
    if (name === "Irradiate" || name === "Smash") {
        value = "";
    } else if (name === "Disarm") {
        value = title.split(" turns")[0].split("for ")[1] + " T ";
    } else if (name === "Bloodlust") {
        value = title.split(" of")[0].split("by ")[1] + " ";
    } else if (name === "Execute") {
        value = title.split(" life")[0].split("below ")[1] + " ";
    } else if (name === "Penetrate") {
        value = title.split(" of")[0].split("Ignores ")[1] + " ";
    } else if (name === "Eviscerate") {
        value = title.split(" extra")[0].split("them ")[1] + " ";
    } else if (name === "Poison") {
        value = title.split(" chance to Poison")[0].split("</b><br/>")[1] + " ";
    }
    return value;
}

waitForKeyElements(".item-cont-wrap ", amarket);
waitForKeyElements(".display-main-page ", displaycase);
waitForKeyElements(".iconBonuses____iFjZ", bazaar);
waitForKeyElements(".extraBonusIcon___x2WH_ ", manage);
waitForKeyElements(".bonuses-wrap", inventoryAndBazaar);
waitForKeyElements(".bonus", armory);

/**
    waitForKeyElements(): A utility function, for Greasemonkey scripts, that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements ("div.comments", commentCallbackFunction);

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.

 * @param selectorTxt Required: The jQuery selector string that specifies the desired element(s)
 * @param actionFunction Required: The code to run when elements are found. It is passed a jNode to the matched element.
*/
function waitForKeyElements(selectorTxt, actionFunction) {
    const targetNodes = $(selectorTxt);
    let btargetsFound;

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        // Found target node(s). Go through each and act if they are new. */
        targetNodes.each(function () {
            const jThis = $(this);
            const alreadyFound = jThis.data("alreadyFound") || false;

            if (!alreadyFound) {
                // Call the payload function.
                const cancelFound = actionFunction(jThis);
                if (cancelFound) btargetsFound = false;
                else jThis.data("alreadyFound", true);
            }
        });
    } else {
        btargetsFound = false;
    }

    // Get the timer-control variable for this selector.
    const controlObj = waitForKeyElements.controlObj || {};
    const controlKey = selectorTxt.replace(/\W/g, "_");
    let timeControl = controlObj[controlKey];

    // Now set the timer.
    if (!timeControl) {
        timeControl = setInterval(function () {
            waitForKeyElements(selectorTxt, actionFunction);
        }, 300);
        controlObj[controlKey] = timeControl;
    }
    waitForKeyElements.controlObj = controlObj;
}
