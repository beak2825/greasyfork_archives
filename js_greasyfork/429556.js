// ==UserScript==
// @name         VaccinatorEX
// @namespace    https://naver.com/
// @version      0.1
// @description  click click
// @author       You
// @match        https://v-search.nid.naver.com/reservation/info?key=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429556/VaccinatorEX.user.js
// @updateURL https://update.greasyfork.org/scripts/429556/VaccinatorEX.meta.js
// ==/UserScript==

(function() {
    'use strict'

    console.log('hi')

    let checkTimer = 0

    let confirmBtn = document.getElementById('reservation_confirm')

    let checkOn = () => {
        return Array.from(confirmBtn.classList).indexOf('on') > -1
    }

    let checkTask = () => {
        if (checkOn) clearInterval(checkTimer)
        confirmBtn.click()
    }

    checkTimer = setInterval(checkTask, 100)

})()