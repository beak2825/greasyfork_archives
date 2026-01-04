// ==UserScript==
// @name         VK Bugtracker opens reports in a new tab
// @namespace    https://greasyfork.org/ru/users/1090548-reyzitwo
// @version      1.5
// @description  Add 'target=_blank' on vk.com/bugs results page
// @author       reyzitwo
// @match        https://vk.com/bug*
// @match        https://vk.ru/bug*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467861/VK%20Bugtracker%20opens%20reports%20in%20a%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/467861/VK%20Bugtracker%20opens%20reports%20in%20a%20new%20tab.meta.js
// ==/UserScript==

let links = [...document.getElementsByClassName("bt_report_title_link")]
addTargetBlank(links)

setInterval(() => {
    const elements = [...document.getElementsByClassName("bt_report_title_link")]
    if (links.length !== elements.length) {
        addTargetBlank(elements)
    }
}, 100)

function addTargetBlank(elements) {
    for (let element of elements) {
        if (element.target === "_blank") continue
        element.setAttribute("target", "_blank")
    }
}