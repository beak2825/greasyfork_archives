// ==UserScript==
// @name         Shop/UKnAU Sprints
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  buttons to automatically add shopping and uknau sprints
// @author       abbelot
// @match        https://sim.amazon.com/issues/*
// @match        https://issues.amazon.com/issues/*
// @match        https://sim.amazon.com/*
// @match        https://issues.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @license      KIO
// @downloadURL https://update.greasyfork.org/scripts/472340/ShopUKnAU%20Sprints.user.js
// @updateURL https://update.greasyfork.org/scripts/472340/ShopUKnAU%20Sprints.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //get current week
    let currentDate = new Date();
    let startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) /
                          (24 * 60 * 60 * 1000));

    var weekNumber = Math.ceil(days / 7);
    weekNumber = weekNumber.toString()

    //define variables
    let ticket_title
    let locale
    let language
    let internal_mag_sprint
    let internal_sprint

    //define button
    let uknau_sprint_button = document.createElement("button")
    uknau_sprint_button.innerHTML = "Add UKnAU Sprint"

    let shop_sprint_button = document.createElement("button")
    shop_sprint_button.innerHTML = "Add Shopping Sprint"

    //on sprint button click, labels are added
    uknau_sprint_button.onclick = function () {
        let available_sprints = document.querySelectorAll("div > div > div > div > ul > span > div > span > span > ul > div > li > span[title^=UKNAU]")

        for (const sprint of available_sprints) {
            var regex = new RegExp("[0-9]{1,2}&[0-9]{1,2}", "g")
            let sprint_weeks = regex.exec(sprint.title)
            //get the week number in the title if the regex matches
            if (sprint_weeks != null) {
                sprint_weeks = sprint_weeks[0].split("&")
                if (sprint_weeks.includes((parseInt(weekNumber)).toString())) {
                    internal_sprint = sprint
                    internal_sprint.click()
                }
            }
        }

    }

    //on sprint button click, labels are added
    shop_sprint_button.onclick = function () {
        let sprint = document.querySelector("[title='KIO_Shop']")
        sprint.click()

    }


    //add button to page if div exists
    const observer = new MutationObserver(function () {
        if (document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']") && document.readyState == "complete") {
            //append rc button right after labels button
            document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']").appendChild(uknau_sprint_button)
            document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']").appendChild(shop_sprint_button)

            console.log("button appended")
        }
        if (document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']") && document.readyState == "complete") {
            observer.disconnect()
            console.log("found button")
        }


    })
    const target = document.querySelector("body")
    const config = { childList: true, subtree: true }
    observer.observe(target, config)


})();