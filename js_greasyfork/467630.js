// ==UserScript==
// @name         clickable cluster graphiq links
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  This script adds clickable links to magnetALL clusters
// @author       abbelot
// @match        https://sim.amazon.com/issues/*
// @match        https://issues.amazon.com/issues/*
// @match        https://sim.amazon.com/*
// @match        https://issues.amazon.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      KIO
// @downloadURL https://update.greasyfork.org/scripts/467630/clickable%20cluster%20graphiq%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/467630/clickable%20cluster%20graphiq%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("graphiq links script run")
    let button = document.createElement("button")
    button.innerHTML = "Add Links"
    button.setAttribute("style","background-color: lightblue; padding: 8px")
    button.onclick = function() {
        let table_div = document.getElementById("issue-description-high-severity-container")

        let utterance_nodes = table_div.querySelectorAll("td:nth-child(1)")

        //if there are utterance nodes
        if (utterance_nodes.length > 0) {
            let ticket_title = document.querySelector('span.editable-field-display-text').innerHTML
            let locale = ticket_title.substring(23,28)

            console.log(utterance_nodes);

            for (const value of utterance_nodes) {
                console.log(value.innerHTML);
                //change each line to link and make blue to mark application of css style

                let text = value.innerHTML;
                text = encodeURI(text)
                text = text.replace(/'/g,"%27")
                let link = "window.open('https://prod.kms.graphiq.a2z.com/semantics?s=" + text + locale_glink_suff[locale] + "','_blank')"
                let style = "color: blue"
                value.setAttribute("onclick",link)
                value.setAttribute("style",style)


            }
            console.log("link added");
            observer.disconnect()
        }
    }

    let locale_glink_suff = {
        "fr_FR":"&locale=fr_FR&location=paris",
        "fr_CA":"&locale=fr_CA&location=montreal",
        "it_IT":"&locale=it_IT&location=milan",
        "en_GB":"&locale=en_GB&location=london",
        "en_CA":"&locale=en_CA&location=vancouver",
        "en_IN":"&locale=en_IN&location=kolkata",
        "es_US":"&locale=es_US&location=graphiq",
        "en_AU":"&locale=en_AU&location=sydney",
        "es_ES":"&locale=es_ES&location=madrid",
        "es_MX":"&locale=es_MX&location=mexico_city",
        "hi_IN":"&locale=hi_IN&location=kolkata",
        "ja_JP":"&locale=ja_JP&location=tokyo",
        "pt_BR":"&locale=pt_BR&location=sao_paulo,_brazil",
        "ar_SA":"&locale=ar_SA&location=dubai"
    }

    //runs when any mutation in page, in order to wait for elements to exist
    const observer = new MutationObserver(function() {
        if (document.querySelector(".document-details-bar")) {
            document.querySelector(".document-details-bar").appendChild(button)
            observer.disconnect()
        }

    })
    const target = document.querySelector("body")
    const config = { childList: true }
    observer.observe(target, config)

    //All is meant to run once. If an utterance page never appears, timeout after one minute. Its probably not an Magnet ticket
    setTimeout(function() {
        observer.disconnect()
    },60000)

})();