// ==UserScript==
// @name         SIM Magall Labelling
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  This script adds a button the add RC labels automatically to Mag tickets
// @author       abbelot
// @match        https://sim.amazon.com/issues/*
// @match        https://issues.amazon.com/issues/*
// @match        https://sim.amazon.com/*
// @match        https://issues.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM.xmlHttpRequest
// @license      KIO
// @downloadURL https://update.greasyfork.org/scripts/467482/SIM%20Magall%20Labelling.user.js
// @updateURL https://update.greasyfork.org/scripts/467482/SIM%20Magall%20Labelling.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //get current week
    let currentDate = new Date();
    let startDate = new Date(currentDate.getFullYear(), 0, 0);
    var days = Math.floor((currentDate - startDate) /
                          (24 * 60 * 60 * 1000));

    var weekNumber = Math.ceil(days / 7);
    weekNumber = weekNumber.toString().padStart(2,"0")
    console.log(weekNumber)

    //define variables
    let ticket_title
    let locale
    let language
    let internal_mag_sprint
    let internal_sprint

    //helper function to get locale
    function getLocale() {
        //loops through all current labels and finds one with inner text that matches a locale format
        for (const label of document.querySelectorAll(".document-labels-list > li")) {
            var label_text = label.querySelector("a").innerText
            var reg = /[a-z]{2}_[A-Z]{2}/g
            if (label_text.match(reg) != null) {
                locale = label_text
                break
            }
        }
    }

    //define button
    let rc_button = document.createElement("button")
    rc_button.innerHTML = "Add RC Labels"

    let hitl_sprint_button = document.createElement("button")
    hitl_sprint_button.innerHTML = "Add/Switch HITL sprint"
    hitl_sprint_button.setAttribute("class","hitl_sprint_button")

    //legacy
    let mag_sprint_button = document.createElement("button")
    mag_sprint_button.innerHTML = "Internal Sprint"
    mag_sprint_button.setAttribute("class","mag_sprint_button")

    let local_sprint_button = document.createElement("button")
    local_sprint_button.innerHTML = "Add Locale Sprint"
    local_sprint_button.setAttribute("class","local_sprint_button")

    let next_local_sprint_button = document.createElement("button")
    next_local_sprint_button.innerHTML = "Add Next Locale Sprint"
    next_local_sprint_button.setAttribute("class","next_local_sprint_button")

    let triage_button = document.createElement("button")
    triage_button.innerHTML = "Triage ticket"
    triage_button.setAttribute("class","triage_button")

    let logtime_button = document.createElement("button")
    logtime_button.innerHTML = "Log Time"
    logtime_button.setAttribute("class","time_button")

    //on rc button click, labels are added
    rc_button.onclick = function () {
        let table_div = document.getElementById("issue-description-high-severity-container")
        let rootcause_nodes = table_div.querySelectorAll("td:nth-child(5)")
        console.log(rootcause_nodes)

        let values_list = []
        for (const value of rootcause_nodes) {
            console.log(value.innerHTML);
            values_list.push(value.innerHTML)
        }
        let unique_list = [...new Set(values_list)];
        console.log(unique_list)

        for (const item of unique_list) {
            console.log(necessary_labels[item.toUpperCase()])

            let selector = ".document-labels-list span[title='" + necessary_labels[item.toUpperCase()] + "']"
            if (document.querySelectorAll(selector)[0] != null) {
                document.querySelectorAll(selector)[0].click()
            }
        }
    }

    //on sprint button click, labels are added
    hitl_sprint_button.onclick = function () {
        let available_sprints = document.querySelectorAll("div > div > div > div > ul > span > div > span > span > ul > div > li > span[title^=HITL]")

        if (document.querySelector(".document-labels-list")) {
            let label_block = document.querySelector(".document-labels-list")
            let label_list = label_block.querySelectorAll("li.document-labels-label")
            if (label_block.querySelector("li")) {
                for (const label of label_list) {
                    //  console.log(label.querySelector("a.navigation-link").innerText);
                    let label_text = label.querySelector("a.navigation-link").innerText
                    if (label_text.includes("HITL")) {
                        label.querySelector(".document-labels-remove").click()

                    }
                }
            }
        }

        let selector = ".document-labels-list span[title*='HITL_Week_" + weekNumber + "']"
        if (document.querySelector(selector) != null) {
            document.querySelector(selector).click()

        }
    }


    //on mag button click add the internal sprint for magnetall (deprecated?)
    mag_sprint_button.onclick = function () {
        getLocale()
        let available_sprints = document.querySelectorAll("div > div > div > div > ul > span > div > span > span > ul > div > li > span[title$='Internal Sprint']")
        for (const sprint of available_sprints) {
            let sprint_locale = sprint.title.split(" ")[0].toLowerCase()
            if (sprint_locale == locale.split("_")[0]) {
                console.log(locale.split("_")[1])
                internal_mag_sprint = sprint
                internal_mag_sprint.click()
            }
        }
    }

    //on local sprint click, add the two week local sprint to the ticket
    local_sprint_button.onclick = function () {
        getLocale()

        language = locale.split("_")[0]

        let available_sprints = document.querySelectorAll("div > div > div > div > ul > span > div > span > span > ul > div > li > span[title^='" + locale_labels[language].labName + "']")
        for (const sprint of available_sprints) {
            var regex = new RegExp(locale_labels[language].regex, "g")
            let sprint_weeks = regex.exec(sprint.title)
            //get the week number in the title if the regex matches
            if (sprint_weeks != null) {
                sprint_weeks = sprint_weeks[0].replace(/\/|\s|-|&/g,"-").split("-")
                if (sprint_weeks.includes(weekNumber)) {
                    internal_sprint = sprint
                    internal_sprint.click()
                }
            }
        }
    }

    //on button click, log time in ticket
    logtime_button.onclick = function () {

        //creates random guid
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        //determines some of the variables to add to the request
        var taskid = document.querySelector(".breadcrumb > li > .label > a").innerText
        var assignee = document.querySelector("i.icon-user ~ .editable-field-display-trigger").innerText
        var date = new Date().toISOString()

        //finds from the timer how much time to add
        var timer_value = document.querySelector(".magnet-timer").innerText
        var split_timer_value = timer_value.split(":")
        var minutes_spent = Number(split_timer_value[1]) * 60 + Number(split_timer_value[2]) + 1



        //prepares body of request
        var final_guid = guid()
        var json = {
            "pathEdits":[
                {
                    "path": "/extensions/effort/effortSpent/" + final_guid,
                    "editAction": "PUT",
                    "data": {
                        "id": final_guid,
                        "effortLoggedDate": date,
                        "effort": minutes_spent,
                        "unit": "Points",
                        "authorIdentity": "kerberos:" + assignee + "@ANT.AMAZON.COM"
                    }
                }
            ]}


        GM.xmlHttpRequest({
            data: JSON.stringify(json),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            url: 'https://maxis-service-prod-pdx.amazon.com/issues/' + taskid + '/edits',
            onload: function(response) {
                if (response.status == 201) {
                    document.querySelector(".time_button").setAttribute("style","background-color: #008000")
                }
                else if (response.status == 200) {
                    document.querySelector(".time_button").setAttribute("style","background-color: #FF0000")
                }
                else {
                    document.querySelector(".time_button").setAttribute("style","background-color: #FFA500")
                }
                setTimeout(function () {document.querySelector(".time_button").style.removeProperty("background-color")},1000)

            }
        });
    }





    //on button click triage rest of ticket
    triage_button.onclick = function () {
        document.querySelector("[data-name='issue-edit-next-step']").click()
        document.querySelector("[data-value-action='Completed']").click()
        document.querySelector("li[data-value^='kerberos']").click()
        document.querySelector(".hitl_sprint_button").click()
        document.querySelector(".local_sprint_button").click()

        //add effort
        //document.querySelector(".effort-tracking-widget-edit-toggle").click()

    }

    next_local_sprint_button.onclick = function () {
        getLocale()
        language = locale.split("_")[0]
        console.log(locale)

        let available_sprints = document.querySelectorAll("div > div > div > div > ul > span > div > span > span > ul > div > li > span[title^='" + locale_labels[language].labName + "']")
        console.log(available_sprints)
        for (const sprint of available_sprints) {
            var regex = new RegExp(locale_labels[language].regex, "g")
            let sprint_weeks = regex.exec(sprint.title)
            //get the week number in the title if the regex matches
            if (sprint_weeks != null) {
                sprint_weeks = sprint_weeks[0].replace(/\/|\s|-|&/g,"-").split("-")
                if (sprint_weeks.includes((parseInt(weekNumber) + 1).toString())) {
                    internal_sprint = sprint
                    internal_sprint.click()
                }
            }
        }
    }

    //object storing the prefix of locale sprint labels and a regex to find the week number in their title
    const locale_labels = {
        "fr": {
            "labName":"FR_wk_",
            "regex":"[0-9]{1,2}.[0-9]{1,2}"},
        "en": {
            "labName":"EN* DA Sprint",
            "regex":"[0-9]{1,2} & [0-9]{1,2}"},
        "ar": {
            "labName":"AR Sprint Weeks",
            "regex":"[0-9]{1,2}&[0-9]{1,2}"},
        "es": {
            "labName":"ES_wk",
            "regex":"[0-9]{1,2}-[0-9]{1,2}"},
        "it": {
            "labName":"IT_wk",
            "regex":"[0-9]{1,2}-[0-9]{1,2}"},
        "pt": {
            "labName":"PT Sprint - Weeks",
            "regex":"[0-9]{1,2}&[0-9]{1,2}"},
        "jp": {
            "labName":"JP Mo-Dash",
            "regex":"[0-9]{1,2}-[0-9]{1,2}"},
        "ja": {
            "labName":"JP Mo-Dash",
            "regex":"[0-9]{1,2}-[0-9]{1,2}"},
        "hi": {
            "labName":"HI Dabangg",
            "regex":"[0-9]{1,2}-[0-9]{1,2}"}
    }

    //key value dictionnary. Does lookup on uppercase values to add lowercase value labels
    var necessary_labels = {
        "MISSING COLLECTION": "Ontology Issue",
        "MISSING ATTRIBUTE": "Ontology Issue",
        "MISSING ATTRIBUTE-COLLECTION LINK": "Ontology Issue",
        "COLLECTION CONFIGURATION ISSUE": "Ontology Issue",
        "ATTRIBUTE NOT RETRIEVED": "Ontology Issue",
        "MISSING ATTRIBUTE-FIELD LINK": "Ontology Issue",
        "MISSING CHILD-PARENT ATTRIBUTE LINK": "Ontology Issue",
        "DUPLICATE ATTRIBUTE": "Ontology Issue",
        "MISSING CHILD-PARENT COLLECTION LINK": "Ontology Issue",
        "OTHER ONTOLOGY ISSUE": "Ontology Issue",
        "MISSING ALIAS": "Entity Resolution Issue",
        "DATE/NUMBER/TIME FAILURE": "Entity Resolution Issue",
        "MISSING ENTITY IN COLLECTION": "Entity Resolution Issue",
        "CANDIDATE RANKING ISSUE": "Entity Resolution Issue",
        "CANDIDATE NOT IN LIST": "Entity Resolution Issue",
        "INCORRECT CHUNKING": "Entity Resolution Issue",
        "ENTITY NOT INDEXED": "Entity Resolution Issue",
        "DISAMBIGUATION": "Entity Resolution Issue",
        "UNIT INFERENCE": "Entity Resolution Issue",
        "UNIT CLASS MISMATCH": "Entity Resolution Issue",
        "OTHER ER ISSUE": "Entity Resolution Issue",
        "COMPOSITE ENTITY ISSUE": "Other GKMS Issue",
        "TOPIC CONFIGURATION ISSUE": "Other GKMS Issue",
        "OTHER COMPOSITIONAL UNDERSTANDING ISSUE": "Other GKMS Issue",
        "TEMPLATE CONFIGURATION ISSUE": "Other GKMS Issue",
        "MISSING TEMPLATE/EXPANSION": "Other GKMS Issue",
        "OTHER GKMS ISSUE": "Other GKMS Issue",
        "MISSING DATA": "Data Issue",
        "INCORRECT DATA": "Data Issue",
        "OTHER DATA ISSUE": "Data Issue",
        "NARRATIVE ISSUE": "Answer Issue",
        "NLG ISSUE": "Answer Issue",
        "NAMED ENTITY NOT IN ANSWER": "Answer Issue",
        "OTHER ANSWER ISSUE": "Answer Issue",
        "TOPIC NOT LOCALIZED": "Localization Issue",
        "ATTRIBUTE NOT LOCALIZED": "Localization Issue",
        "FIELD NOT LOCALIZED": "Localization Issue",
        "SEARCH TEMPLATE NOT LOCALIZED": "Localization Issue",
        "NARRATIVE NOT LOCALIZED": "Localization Issue",
        "OTHER LOCALIZATION ISSUE": "Localization Issue",
        "ASR ERROR": "ASR Error",
        "NO CONTEXTUAL CARRYOVER": "Contextual Carryover",
        "ENTITY-ONLY": "Incomplete",
        "NUMBER-ONLY": "Incomplete",
        "INCOMPLETE": "Incomplete",
        "INCOMPLETE ANSWERED": "Incomplete",
        "INCOMPLETE UNANSWERED": "Incomplete",
        "BADLY FORMED": "Badly Formed",
        "SKILL ISSUE": "Skill",
        "BAD FLARE REWRITES": "FLARe",
        "INCORRECT ROUTING": "Dynamic Routing",
        "INCORRECT RANKING": "Federation",
        "SUITABILITY BLOCK": "Federation",
        "LATENCY": "Latency",
        "PERCEIVED WORKING": "Perceived Working",
        "PERSONALITY": "Personality",
        "LOCAL INFO": "Local Info",
        "SENSITIVE CONTENT": "Sensitive Content",
        "SENSITIVE BLOCKED": "Sensitive Content",
        "SENSITIVE UNBLOCKED": "Sensitive Content"
    }

    var months = {
        "1": "January",
        "2": "February",
        "3": "March",
        "4": "April",
        "5": "May",
        "6": "June",
        "7": "July",
        "8": "August",
        "9": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    }

    //add button to page if div exists
    const observer = new MutationObserver(function () {
        if (document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']") && document.readyState == "complete") {
            //append rc button right after labels button
            //legacy document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']").appendChild(rc_button)
            document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']").appendChild(hitl_sprint_button)
            //legacy  document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']").appendChild(mag_sprint_button)
            document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']").appendChild(local_sprint_button)
            document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']").appendChild(next_local_sprint_button)
            document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']").appendChild(logtime_button)
            document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']").appendChild(triage_button)



        }
        if (document.querySelector("div.row div[data-module-name='App.Views.EditableLabelsWidget']") && document.readyState == "complete") {
            observer.disconnect()
        }


    })
    const target = document.querySelector("body")
    const config = { childList: true, subtree: true }
    observer.observe(target, config)


})();