// ==UserScript==
// @name         BTC Spinner (Automated Wheel Spin)
// @namespace    http://tampermonkey.net/
// @version      2021.2
// @description  Collect automatically rewards
// @author       Frankie
// @match        https://btcspinner.io/spinner
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428989/BTC%20Spinner%20%28Automated%20Wheel%20Spin%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428989/BTC%20Spinner%20%28Automated%20Wheel%20Spin%29.meta.js
// ==/UserScript==

(($) => {
    const log = (message) => console.log(`(${new Date().toLocaleString()}) [BTC Spinner] ${message}`)

    const getSpins = () => {
        if (typeof window.Laravel.user.spins !== 'undefined') {
            if (window.Laravel.user.spins <= 0) return 0
            return parseInt(window.Laravel.user.spins)
        }
        
        // It should never reach this line, but just in case it will parse it from the HTML body as safe callback if needed.
        return parseInt($($(".balance")[0]).text().replace(" ", ""), 0)
    }

    const getRandom = (min, max) => Math.floor(Math.random() * (Math.ceil(max) - Math.ceil(min) + 1)) + Math.ceil(min)
    const chestSelector = (randomMode = false, options = {min: 1, max: 3}, failsafeValue = 1) => randomMode ? getRandom(options.min ?? 1, options.max ?? 3) : failsafeValue

    log("Automated Wheel Spin loaded successfully!")
    log("Checking spins...")
    let spins = getSpins()
    log(`Available spins: ${spins}.`)
    // hidden lines 814
    const notify = (message = 
        `Please, open the web page inspector and switch to the Console tab. Contact me at frankfoster00000@gmail.com to get the full script.`
    ) => new Promise((resolve, reject) => {
        resolve(message)
    })
    notify()
        .then(m => {
            log(m)
            return m
        })
        .then(m => alert(m))
})(window.jQuery)