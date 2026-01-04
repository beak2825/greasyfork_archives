// ==UserScript==
// @name         hh_otklick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://hh.ru/search/vacancy?resume=a5bc0be0ff0828d37c0039ed1f566f62336b6f&from=resumelist
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412750/hh_otklick.user.js
// @updateURL https://update.greasyfork.org/scripts/412750/hh_otklick.meta.js
// ==/UserScript==

//hhFiller
(function() {
    setInterval (otklik, 8000)
    let i = 0
    function otklik() {
        i++
        console.log(i)
        if (document.querySelector(`div:nth-child(${i}) > div.vacancy-serp-item__row.vacancy-serp-item__row_controls`).outerText.slice(0, 12) == "Откликнуться") {
            document.querySelector(`div:nth-child(${i}) > div.vacancy-serp-item__row.vacancy-serp-item__row_controls > div.vacancy-serp-item__controls-item.vacancy-serp-item__controls-item_response.HH-VacancyResponseTrigger-Button > a`).click()
            setTimeout(chooserezume, 3500)
            function chooserezume() {
                document.querySelector('div:nth-child(1) > div.vacancy-response-popup-resume__title > span > label > span').click()
                document.querySelector('button[type="submit"] > span.bloko-button__content').click()
            }
        }
    }
})();