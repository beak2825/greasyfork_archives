// ==UserScript==
// @name         Wanikani Forum Filter
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  try to take over the world!
// @author       You
// @match        https://community.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @downloadURL https://update.greasyfork.org/scripts/435510/Wanikani%20Forum%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/435510/Wanikani%20Forum%20Filter.meta.js
// ==/UserScript==

(function() {
// functions
const killIt = (filterList) => {
    filterList.forEach(cat => {
        if (!document.querySelector(`body${cat}`)) { // will abort if specifically viewing something you filtered out
            document.querySelectorAll(`#list-area ${cat}`).forEach(i => {
                i.remove()
            })
        }
    })
}
const setFilter = () => { // get from local storage or use defaults
    const defaultFilters = [
        //'[class*="category-campfire"]', //entire sections
        //'[class*="category-japanese-language"]', //entire sections
        //'[class*="category-wanikani"]', //entire sections
        '.category-japanese-language-reading', //subsections
        //'category-wanikani-feedback', //subsections
    ]
    return defaultFilters
}

// options
const sectionsToFilter = setFilter()
const topicListClasses = {latest: ".latest-topic-list", standard: ".topic-list"}
const runFrequency = 200

// run
const target = document.querySelector(topicListClasses.latest) || document.querySelector(topicListClasses.standard)
if (target) {
    const scriptAlert = (
        () => {
            console.log('************ THE FORUM FILTER IS RUNNING *********************')
            console.log(`************\n${sectionsToFilter.join('\n')}\n*********************`)
        }
    )()
    const modificationAlert = (
        () => {
            console.log(`INSTRUCTIONS FOR MODIFICATION
            1. Open up the script in tamper/grease monkey
            2. find defaultFilters and add/remove array items`)
        }
    )()
    window.setInterval(
        () => { killIt(sectionsToFilter) },
        runFrequency
    )
}
})();