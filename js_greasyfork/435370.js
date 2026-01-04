// ==UserScript==
// @name         CoinGecko-ColourCodedATH
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Updates Coin Geckos ATH page so percentage isn't always the bad colour :)
// @author       DangerSalmon
// @match        https://www.coingecko.com/*/coins/ath
// @icon         https://www.google.com/s2/favicons?domain=coingecko.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435370/CoinGecko-ColourCodedATH.user.js
// @updateURL https://update.greasyfork.org/scripts/435370/CoinGecko-ColourCodedATH.meta.js
// ==/UserScript==

function colorCodePercent() {
    const coinValues = document.querySelectorAll('a[data-target="currency.currencyLink"]')
    document.querySelectorAll('.progress-bar').forEach((bar, index) => {
        const stringValue = bar.innerText
        const intValue = parseInt(stringValue.substring(1, stringValue.length))
        const blueValue = 30
        const greenValue = 200 * ((100 - intValue) / 100)
        let redValue = 255
        if (greenValue > 220) redValue = redValue - 150
        if (greenValue > 200 && greenValue < 220) redValue = redValue - 130
        if (greenValue > 180 && greenValue < 200) redValue = redValue - 110
        if (greenValue > 160 && greenValue < 180) redValue = redValue - 90
        if (greenValue > 140 && greenValue < 160) redValue = redValue - 70
        if (greenValue > 120 && greenValue < 140) redValue = redValue - 50
        if (greenValue > 100 && greenValue < 120) redValue = redValue - 30
        const colorToSet = 'rgb(' + redValue + ',' + greenValue + ',' + blueValue + ')'
        bar.style.setProperty('background-color', colorToSet, 'important')
        coinValues[index].style.setProperty('color', colorToSet, 'important')
    })
}

function redAndGreen() {
    document.querySelectorAll('.progress').forEach((bar) => {
        bar.style.setProperty('background-color', '#8dc647')
    })
}

// Comment out one of below
colorCodePercent() // More green when closer to ATH
//redAndGreen() // White is green