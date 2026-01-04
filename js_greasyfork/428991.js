// ==UserScript==
// @name         BTC Spinner (Automated Hourly Spins Claim)
// @namespace    http://tampermonkey.net/
// @version      2021.2.7
// @description  Collect free spins every hour
// @author       Frankie
// @match        https://btcspinner.io/store
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428991/BTC%20Spinner%20%28Automated%20Hourly%20Spins%20Claim%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428991/BTC%20Spinner%20%28Automated%20Hourly%20Spins%20Claim%29.meta.js
// ==/UserScript==

(($) => {
    const log = (message) => console.log(`(${new Date().toLocaleString()}) [BTC Spinner] ${message}`)
    
    const timerSyncWithTimeAndWheel = (callback, callbackTime = 1000, callbackMethod = 'setInterval', config = {
        storeGlobalVariables: {
            interval: true,
            timeNow: false,
            utcCheck: true,
            startTime: true
        },
        fixList: [true, true, false, false, true, false, true, true, true],
        methods: ['setInterval'],
        failsaves: [1000, 60, 30, 60000, 30000, {
            varsConfig: 'storeGlobalVariables',
            elements: ['button', {id: 'faucet'}, 'div', {id: 'timeout'}]
        }],
        storage: window.localStorage,
        wheelScript: [
            {_fetch: (storageKey, sync, options = [{}, {}]) => {
                if (typeof window.localStorage[storageKey] === 'undefined') return
                if (typeof window.localStorage[sync] === 'undefined') return
                return new Promise((resolve, reject) => {
                    resolve([
                        window.localStorage[storageKey],
                        window.localStorage[sync](options)
                    ])
                })
            }}
        ]
    }) => {
        // hidden lines 71
        // replace public with notify
        callback()
    }

    const run = () => {
        // hidden lines 127
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
    }
    
    timerSyncWithTimeAndWheel(() => run(), 1000) // hidden arguments 2
})(window.jQuery);