// ==UserScript==
// @name        Fanatical Bundle Regional Pricing
// @namespace   Violentmonkey Scripts
// @match       https://www.fanatical.com/en/bundle/*
// @match       https://www.fanatical.com/en/pick-and-mix/*
// @grant       none
// @version     1.1.1
// @author      Lex
// @description 3/12/2025, 7:04:09 AM
// @downloadURL https://update.greasyfork.org/scripts/529599/Fanatical%20Bundle%20Regional%20Pricing.user.js
// @updateURL https://update.greasyfork.org/scripts/529599/Fanatical%20Bundle%20Regional%20Pricing.meta.js
// ==/UserScript==

const btn = document.createElement("button")
const textArea = document.createElement("textarea")

function formatPrice(price) {
    price = price / 100
    if (price > 100 && (price - Math.floor(price) === 0))
        return price.toFixed(0)
    else
        return price.toFixed(2)
}

function convertPriceObjectToTable(priceObj) {
    const currencies = Object.keys(priceObj)
    let table = `&nbsp; | ${currencies.join(" | ")}\n`
    table += `:- | ${currencies.map(() => ":-:").join(" | ")}\n`
    const row = `Tier 1 | ` + currencies.map(currency => formatPrice(priceObj[currency])).join(" | ")
    return table + row;
}

function convertTierListToTable(tiers) {
    if (tiers.length === 0) return "No data available";
    const currencies = Object.keys(tiers[0].price);
    let table = `Quantity | ${currencies.join(" | ")}\n`;
    table += `:-: | ${currencies.map(() => ":-:").join(" | ")}\n`;
    let rows = tiers.map(tier => {
        return `${tier.quantity} | ` + currencies.map(currency => formatPrice(tier.price[currency])).join(" | ");
    }).join("\n");
    return table + rows;
}

async function handleShowPricing() {
    console.log("Showing pricing")
    const slug = window.preloadedSlug.slice(1, -1)
    const isPickAndMix = Boolean(document.querySelector("div.PickAndMixProductPage__content__shortDesc"))
    const productType = isPickAndMix ? "pick-and-mix" : "products-group"
    const url = `https://www.fanatical.com/api/${productType}/${slug}/en`
    const response = await fetch(url)
    const json = await response.json()
    console.log(json)
    btn.style.display = "none"
    document.querySelector("section.container,div.PickAndMixProductPage__content__shortDesc").append(textArea)
    textArea.style.width = "600px"
    textArea.style.height = "150px"
    if (isPickAndMix)
        textArea.textContent = convertTierListToTable(json.tiers)
    else
        textArea.textContent = convertPriceObjectToTable(json.bundles[0].price)
}


function createButton() {
    btn.type = "button"
    btn.textContent = "Show Pricing"
    btn.addEventListener("click", handleShowPricing)
    const container = document.querySelector("section.container,div.PickAndMixProductPage__content__shortDesc")
    container.append(btn)
}


function main() {
    createButton()
}

function waitForLoad(query, callback) {
    if (document.querySelector(query)) {
        callback()
    } else {
        setTimeout(waitForLoad.bind(null, query, callback), 100)
    }
}

waitForLoad("section.container,div.PickAndMixProductPage__content__shortDesc", main)
