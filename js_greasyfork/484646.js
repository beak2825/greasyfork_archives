// ==UserScript==
// @name        BambooHR
// @description Enhance BambooHR website
// @version     1.0
// @author      Guten
// @homepageURL https://github.com/gutenye/userscripts/tree/main/BambooHR
// @namespace   gutenye
// @grant       GM.xmlHttpRequest
// @match       https://*.bamboohr.com/home
// @match       https://*.bamboohr.com/home/
// @downloadURL https://update.greasyfork.org/scripts/484646/BambooHR.user.js
// @updateURL https://update.greasyfork.org/scripts/484646/BambooHR.meta.js
// ==/UserScript==

function main() {
    const employeeId = SESSION_USER.employeeId
    const year = new Date().getFullYear()
    const endDate = `${year}-12-31`
    GM.xmlHttpRequest({
        url: `/time_off/calculator/calculate?employeeId=${employeeId}&endDate=${endDate}&timeOffType=96`,
        onload,
        responseType: 'json',
    })
}

function onload(res) {
    const found = res.response.total.match(/^\d+.\d+/)
    if (!found) {
        return
    }
    const days = found[0]
    updateDays(days)
}

function updateDays(totalDays) {  
    const currentDays = document.querySelector('.TimeOffWidget__type-available').lastChild
    currentDays.nodeValue = `${currentDays.nodeValue} / ${totalDays}`
}

main()