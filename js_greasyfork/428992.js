// ==UserScript==
// @name         BTC Spinner (Bypass 500 Error on withdrawal)
// @namespace    http://tampermonkey.net/
// @version      2021.7
// @description  Bypass 500 Error
// @author       Frankie
// @match        https://btcspinner.io/withdraw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428992/BTC%20Spinner%20%28Bypass%20500%20Error%20on%20withdrawal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428992/BTC%20Spinner%20%28Bypass%20500%20Error%20on%20withdrawal%29.meta.js
// ==/UserScript==
 
(($) => {
    const log = (message) => console.log(`(${new Date().toLocaleString()}) [BTC Spinner] ${message}`)
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