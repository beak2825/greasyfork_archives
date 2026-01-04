// ==UserScript==
// @name         KE labelling buttons
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Facilitates sim etiquette by adding buttons for labelling
// @author       abbelot
// @match        https://sim.amazon.com/issues/*
// @match        https://issues.amazon.com/issues/*
// @match        https://sim.amazon.com/*
// @match        https://issues.amazon.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      emea-ke
// @downloadURL https://update.greasyfork.org/scripts/504284/KE%20labelling%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/504284/KE%20labelling%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict'
    let rand = Math.random()
    console.log("starting ke button script " + rand)

    let emea_label_button = newbutton("Add EMEA label","emea-label")
    emea_label_button.onclick = function () {addlabels(["EMEA"])}

    let apac_label_button = newbutton("Add APAC label","apac-label")
    apac_label_button.onclick = function () {addlabels(["APAC"])}


    let outofsprintlabelbutton = newbutton("Out of sprint","outofsprint_label_button")
    outofsprintlabelbutton.onclick = function () {addlabels(["Out of Sprint"])}


    let currsprintbutton = newbutton("Add current sprint","current_sprint_button")
    currsprintbutton.onclick = function () {
        const currweeknum = getWeekNumber()
        const available_sprints = document.querySelectorAll("div > div > div > div > ul > span > div > span > span > ul > div > li > span[title^='emea-apac-ke-']")

        const sprintregex = new RegExp(/emea-apac-ke-([0-9]{2})-w([0-9]{2})[_-]([0-9]{2})-[0-9]{4}/)
console.log([...available_sprints])

        const current_sprint = [...available_sprints].filter(node => {
            const parsed_sprint = sprintregex.exec(node.title);
            if (!parsed_sprint) {return false}
            return (parsed_sprint[2] == currweeknum || parsed_sprint[3] == currweeknum)
        })[0]

        if (current_sprint) {current_sprint.click()}

    }

    let nextsprintbutton = newbutton("Add next sprint","next_sprint_button")
    nextsprintbutton.onclick = function () {
        const currweeknum = getWeekNumber()
        const allsprints = document.querySelectorAll("[title^='emea-apac-ke-']")
        const available_sprints = document.querySelectorAll("div > div > div > div > ul > span > div > span > span > ul > div > li > span[title^='emea-apac-ke-']")
        const sprintregex = new RegExp(/emea-apac-ke-([0-9]{2})-w([0-9]{2})[_-]([0-9]{2})-[0-9]{4}/)
        const current_sprint = [...allsprints].filter(node => sprintregex.exec(node.title)[2] == currweeknum || sprintregex.exec(node.title)[3] == currweeknum)[0]
        const current_sprint_num = sprintregex.exec(current_sprint.title)[1]


        const next_sprint = [...available_sprints].filter(node => sprintregex.exec(node.title)[1] == Number(current_sprint_num) + 1)[0]

        if (next_sprint) {next_sprint.click()}
    }

    let localelabelbutton = newbutton("Add locale labels","locale_labels_button")
    localelabelbutton.onclick = function () {
        if (document.getElementById("tmp-loc-label-form")) {
            document.getElementById("tmp-loc-label-form").remove()
        }
        else {
            let popup = createpopup()
            this.parentElement.appendChild(popup)
        }
    }




    //helper functions\

    function createpopup() {


        const locales = ["fr_FR",
                         "fr_CA",
                         "it_IT",
                         "en_GB",
                         "en_CA",
                         "en_IN",
                         "es_US",
                         "en_AU",
                         "es_ES",
                         "es_MX",
                         "hi_IN",
                         "ja_JP",
                         "pt_BR",
                         "ar_SA",
                         "nl_NL",
                         "de_DE"]

        const mainparent = document.createElement("div")
        for (const locale of locales) {
            const input = document.createElement("input")
            input.setAttribute("type","checkbox")
            input.setAttribute("id",locale)
            input.style.float = "left"
            input.style.paddingLeft = "10px"

            const label = document.createElement("div")
            label.innerText = " " + locale
            label.style.paddingLeft = "20px"
            label.style.fontWeight = "bold"

            const div = document.createElement("div")

            div.appendChild(input)
            div.appendChild(label)
            mainparent.appendChild(div)
            mainparent.appendChild(document.createElement("br"))
        }
        const submit = document.createElement("button")
        submit.classList.add("submit-label-form")
        submit.innerText = "Add selected"
        const close = document.createElement("button")
        close.classList.add("close-label-form")
        close.setAttribute("type","button")
        close.innerText = "Close"

        close.addEventListener("click",function() {
            mainparent.remove()

        })

        mainparent.appendChild(submit)
        mainparent.appendChild(close)
        mainparent.id = "tmp-loc-label-form"
        mainparent.style.position = "absolute"
        mainparent.style.background = "#FFD580"
        mainparent.style.zIndex = 100
        mainparent.style.display = "inline-block"
        mainparent.style.borderRadius = "10px"
        mainparent.style.borderStyle = "groove"

        submit.addEventListener("click",function() {
            for (const checkbox of mainparent.querySelectorAll("input")) {
                //console.log("got selection:")
                if (checkbox.checked) {
                    //console.log(checkbox.id)
                    const labeldiv = document.querySelector("div > div > div > div > ul > span > div > span > span > ul > div > li > span[title='" + checkbox.id + "']")
                    if (labeldiv != null) {labeldiv.click()}
                }
            }
            mainparent.remove()
        })

        return mainparent

    }

    function addlabels(labellist) {
        for (const label of labellist) {
            const labeldiv = document.querySelector("div > div > div > div > ul > span > div > span > span > ul > div > li > span[title='" + label + "']")
            if (labeldiv != null) {labeldiv.click()}

        }
    }


    function getWeekNumber() {
        const today = new Date()
        // const yearday = daysIntoYear(today)
        // const weeknum = Math.ceil(yearday/7)
        // console.log(yearday,weeknum)

        const target = new Date(today.valueOf());
        const dayNr = (today.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        const firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() != 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }

        return 1 + Math.ceil((firstThursday - target) / 604800000)
    }

    function newbutton(text, classname) {
        let newbutton = document.createElement("button")
        newbutton.innerHTML = text
        newbutton.setAttribute("class",classname)
        return newbutton
    }

    function daysIntoYear(date){
        return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
    }

    function addbutton(button) {
        document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']").appendChild(button)
    }

    //add button to page if div exists
    const observer = new MutationObserver(function () {
        if (document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']") && document.readyState == "complete") {
            const buttonstoadd = [emea_label_button,apac_label_button,currsprintbutton,nextsprintbutton,localelabelbutton,outofsprintlabelbutton]
            for (const button of buttonstoadd){
                addbutton(button)
            }
            observer.disconnect()

            setInterval(function() {
                const buttonstoadd = [emea_label_button,apac_label_button,currsprintbutton,nextsprintbutton,localelabelbutton,outofsprintlabelbutton]
                for (const button of buttonstoadd){
                    if (!document.querySelector(button.classList)) {
                        addbutton(button)
                    }
                }

            },2000)
        }
    })
    const target = document.querySelector("body")
    const config = { childList: true, subtree: true }
    observer.observe(target, config)




})();