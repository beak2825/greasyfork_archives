// ==UserScript==
// @name         Validation warning
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  This script adds warning banners to MagnetALL tickets based on potential validation errors in them
// @author       abbelot
// @match        https://sim.amazon.com/issues/*
// @match        https://issues.amazon.com/issues/*
// @match        https://sim.amazon.com/*
// @match        https://issues.amazon.com/*

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      KIO
// @downloadURL https://update.greasyfork.org/scripts/467631/Validation%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/467631/Validation%20warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
        "SENSITIVE UNBLOCKED": "Sensitive Content",
        "NULL": "null",
        "NOT INFO": "not info",
        "REPEATED TOKENS":"repeated tokens",
        "LENGTHY ANSWER":"Lengthy answer",
        "INCORRECT MO ANSWER":"Incorrect MO answer",
"MISSING TEXT-BASED ANSWER":"Missing text-based answer",
"OTHER":"Other"
    }


    let sprint_status = 2
    let sprint_banner = document.createElement("div")
    sprint_banner.innerHTML = "Missing Sprint"
    sprint_banner.setAttribute("class","sprint-validation-banner")
    sprint_banner.setAttribute("style","background-color:#FFCCCB ;font-size:12px;padding:6px;font-weight:bold")

    let rc_banner = document.createElement("div")
    rc_banner.innerHTML = "Invalid Rootcause"
    rc_banner.setAttribute("class","rc-validation-banner")
    rc_banner.setAttribute("style","background-color:#FFCCCB ;font-size:12px;padding:6px;font-weight:bold")
    rc_banner.setAttribute("data-hint","Mousover here for invalid rootcauses detected")


    //helper function which update banner colour and text

    function updateSprintBanner() {
        if (sprint_status == 1) {
            document.querySelector("div.sprint-validation-banner").innerHTML = "Sprint added"
            sprint_banner.setAttribute("style","background-color:#90ee90 ;font-size:12px;padding:6px;font-weight:bold")
            // console.log("updated add")
        }
        else {
            document.querySelector("div.sprint-validation-banner").innerHTML = "Missing Sprint"
            sprint_banner.setAttribute("style","background-color:#FFCCCB ;font-size:12px;padding:6px;font-weight:bold")
            //  console.log("updated missing")
        }
    }
    function updateRcBanner() {
        if (rc_validity == 1) {
            document.querySelector("div.rc-validation-banner").innerHTML = "Rootcause Validated"
            rc_banner.setAttribute("style","background-color:#90ee90 ;font-size:12px;padding:6px;font-weight:bold")
            rc_banner.setAttribute("data-hint","Mousover here for invalid rootcauses detected")
        }
        else {
            document.querySelector("div.rc-validation-banner").innerHTML = "Invalid Rootcause"
            rc_banner.setAttribute("style","background-color:#FFCCCB ;font-size:12px;padding:6px;font-weight:bold")
            rc_banner.setAttribute("data-hint","Following invalid rootcause detected on line " + invalid_rc_num + " : " + invalid_rc)
        }
    }






    // look for hitl label
    setInterval(function() {
        if (document.querySelector(".document-labels-list")) {
            let label_block = document.querySelector(".document-labels-list")
            let label_list = label_block.querySelectorAll("li.document-labels-label")
            if (label_block.querySelector("li.document-labels-label")) {
                for (const label of label_list) {
                    //  console.log(label.querySelector("a.navigation-link").innerText);
                    let label_text = label.querySelector("a.navigation-link").innerText
                    if (label_text.includes("HITL")) {
                        sprint_status = 1
                        break
                    }
                    else {
                        sprint_status = 0
                    }

                }



            }
            else {
                sprint_status = 0
            }
            //  console.log(sprint_status)
        }
        updateSprintBanner()
    }, 3000);


    //look for rootcauses
    let rc_validity = 2
    let invalid_rc = ""
    let invalid_rc_num = 0
    setInterval(function() {
        let table_div = document.getElementById("issue-description-high-severity-container")
        let rootcause_nodes = table_div.querySelectorAll("td:nth-child(5)")
        let count = 1
        for (const node of rootcause_nodes) {

            let node_text = String(node.innerHTML.toUpperCase())
            if (necessary_labels[node_text] == null) {
                rc_validity = 0
                invalid_rc = node_text
                invalid_rc_num = count
                break
            }
            else {
                rc_validity = 1
            }
            count = count + 1
        }
        updateRcBanner()
    }, 3000);


    const target_sprint = document.querySelector("body")
    const target = document.querySelector("body")

    const config = { childList: true }

    const observer_banner = new MutationObserver(function() {
        if (document.querySelector("ul.breadcrumb")) {
            document.querySelector("ul.breadcrumb").appendChild(sprint_banner)
            document.querySelector("ul.breadcrumb").appendChild(rc_banner)
        }

    })

    observer_banner.observe(target, config)


})();