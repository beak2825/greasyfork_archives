// ==UserScript==
// @name         PCO Online Streamliner
// @namespace    
// @version      2025-07-11 v2
// @description  Streamlines the EMB PCO Online system for evaluation
// @author       ksmc
// @license      MIT
// @match        https://pco.emb.gov.ph/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.ph
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541575/PCO%20Online%20Streamliner.user.js
// @updateURL https://update.greasyfork.org/scripts/541575/PCO%20Online%20Streamliner.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let autoOpenAttachments = false

    let openedLinks = []

    function generalHandler(url,body){
        fetch(url, {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "body": body,
            "method": "POST",
        })
            .then(response => response.json())
            .then(data => {
            if (data.code === 400 || data.status === 0) {
                alert(data.message);
            }
            if (data.status === 1) {
                window.open(data.redirectUrl, '_blank')
            }
        })
            .catch(error => {
            console.error('Local error callback. Please try again!', error)
        })
    }

    function openAllAttachments(){
        let links = Array.from(document.getElementsByClassName("label label-danger")).map(a => a.href || a.children?.[0]?.href).filter(a => a != undefined)
        links = links.filter(a => openedLinks.indexOf(a) < 0)
        links.map(a => window.open(a,"_blank"))
        openedLinks = [... openedLinks, ... links]
    }

    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
    }

    function copyToClipboard(text){
        console.log(text)
        const elem = document.createElement('textarea')
        elem.value = text
        document.body.appendChild(elem)
        elem.select()
        document.execCommand('copy')
        document.body.removeChild(elem)
    }

    // built in function replacements

    window.application = function(application_id,account_fk){
        generalHandler("https://pco.emb.gov.ph/selected-application",`application_id=${application_id}&account_fk=${account_fk}`)
    }

    window.onClickPrintEMB = function(applicationID,statusID){
        generalHandler("https://pco.emb.gov.ph/selected-application-coa",`application_id=${applicationID}`)
    }

    window.onClickCheckList = function(applicationID,statusID){
        generalHandler("https://pco.emb.gov.ph/application-checklist",`application_id=${applicationID}`)
    }

    window.onClickPCOName = function(accountID){
        generalHandler("https://pco.emb.gov.ph/selected-pco-profile",`id=${accountID}&url=selected-pco-profile`)
    }
    window.onClickViewPCOProfile = window.onClickPCOName

    window.onClickViewFullRenewedDetails = function(applicationID){
        generalHandler(window.cluster?.value === 1 ? 'view-selected-application-cluster-details' : 'select-the-renewed-application',`application_id=${applicationID}`)
    }

    // Assistive functions to PCO application assessment

    switch(window.location.href){
        case "https://pco.emb.gov.ph/application-full-details-page":
        case "https://pco.emb.gov.ph/view-selected-application-renewal-details":
        case "https://pco.emb.gov.ph/profile":
            if(autoOpenAttachments){
                window.setInterval(openAllAttachments,3000)
            }
            break

        case "https://pco.emb.gov.ph/new-application-checklist-page":
            document.getElementsByClassName("btn btn-success btn-lg pull-right")[0].onclick = function(){
                let incomplete = Array.from(document.getElementsByTagName("tr"))
                .slice(2).filter(a => a.children[2].children[0].checked)
                .map(a => a.children[3].children[0].value)
                let instructions = incomplete.filter(a => a != "")

                if(incomplete.length == 0){
                    let profile = Array.from(document.getElementsByTagName("tr")).slice(2)[0].children[3].children[0].value.split(", ").map(a => toTitleCase(a))
                    profile[1] = profile[1]
                        .replace(" Of "," of ")
                        .replace(" In "," in ")
                        .replace(" Graduate"," graduate")

                    if(Array.from(document.getElementsByTagName("tr"))[0].children[0].textContent == 'PCO Requirements(RENEWAL)'){
                        instructions = [
                            `Based on evaluation, ${profile[0]}, ${profile[1]}, has completed the requirements for PCO accreditation renewal for Category ${profile[2]} establishment. For endorsement please, thank you.`
                        ]
                    }
                    else{
                        instructions = [
                            `Based on evaluation, ${profile[0]}, ${profile[1]}, has the completed the requirements for new PCO accreditation for Category ${profile[2]} establishment. For endorsement please, thank you.`
                        ]
                    }

                }
                else if(instructions.length == 0){
                    instructions = [
                        "You may now pay for the application fee through either cash or Manager's check/Cashier’s check at the EMB cashier (check payee is BTr - Regular Fund) or through Land Bank Link.BizPortal. Please print three (3) copies of the Order of Payment. After payment, upload the official receipt at the official receipt portion of your application by clicking \"DETAILS\", top right of this page. Once done, click \"Update Application\". Afterwards, go back to the Application control panel then click \"Submit to Evaluator\". Failure to do so will render this application pending on your side."
                    ]
                }
                else{
                    instructions = [
                        "Please comply the following:",
                        ... instructions,
                        "Click \"Submit to Evaluator\" to submit your application after performing the updates, as failure to do so will render this application pending on your side."
                    ]
                }


                instructions = instructions.join("\n")
                console.log(instructions)
                copyToClipboard(instructions)
            }
            break

        case "https://pco.emb.gov.ph/application-page":
            break
    }

    // inject Open All Windows on the Summary button

    let reOpenAllPCODetails = function(){
        Array.from(document.getElementsByClassName("navbar-header pull-right")[0].children).slice(0,3).map(a => a.onclick())
    }

    if(document.getElementsByClassName("navbar-header pull-right")?.[0]?.children?.[4]){
        document.getElementsByClassName("navbar-header pull-right")[0].children[4].removeAttribute("href")
        document.getElementsByClassName("navbar-header pull-right")[0].children[4].onclick = reOpenAllPCODetails
    }




})();