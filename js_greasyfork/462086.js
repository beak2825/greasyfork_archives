// ==UserScript==
// @name         Funpay auto boost offers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Thank you for using my script
// @author       nomeeercy
// @match       https://funpay.com/lots/82/trade
// @icon        https://s3-eu-west-1.amazonaws.com/tpd/logos/61c241ad7e4160be1454a768/0x0.png
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/462086/Funpay%20auto%20boost%20offers.user.js
// @updateURL https://update.greasyfork.org/scripts/462086/Funpay%20auto%20boost%20offers.meta.js
// ==/UserScript==

let count = 0
const defaultHoursCoolDown = 4
let coolDown = 1000

function refresh() {
    console.log("count: ", count)

    const boostButton = document.getElementsByClassName('btn btn-default btn-block js-lot-raise')[0]
    boostButton.click();

    setTimeout(() => {
         const timeAlert = document.getElementById('site-message')
         if (timeAlert.innerHTML) {
             if (timeAlert.innerHTML.includes('минут')) {
                 let timeToWait = Number(timeAlert.innerHTML.replace(/\D/g, ""))
                 if (timeToWait <= 0) {
                     timeToWait = 1;
                 }
                 coolDown = timeToWait * 60 * 1000 + 60000
             }
             else {
                 let timeToWait = 59
                 coolDown = timeToWait * 1000 * 60 + 60000
             }
         } else {
             setTimeout(() => {
                 console.log("clicking on the checkboxes")
                 const checkboxes = document.querySelectorAll('input[type="checkbox"]')
                 console.log(checkboxes)
                 for (let checkbox of checkboxes) {
                     checkbox.checked = true
                 }
                 const submitButton = document.getElementsByClassName('btn btn-primary btn-block js-lot-raise-ex')[0]
                 submitButton.click();
                 count++
             }, 500)
             coolDown = defaultHoursCoolDown * 1000 * 60 * 60 + 60000
         }
         console.log("Time to wait: ", coolDown, "milliseconds")
         setTimeout(refresh, coolDown)
    }, 500)
}

(function() {
    refresh()
})();