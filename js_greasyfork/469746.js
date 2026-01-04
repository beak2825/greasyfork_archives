// ==UserScript==
// @name         Entity Re-index button
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  adds reindex button
// @author       abbelot
// @match        https://prod.kms.graphiq.a2z.com/e/*
// @match        https://www.prod.kms.graphiq.a2z.com/e/*
// @match        https://prod.kms.graphiq.a2z.com/tag/*
// @match        https://www.prod.kms.graphiq.a2z.com/tag/*
// @match        https://dub-prod.kms.graphiq.a2z.com/e/*
// @match        https://www.dub-prod.kms.graphiq.a2z.com/e/*
// @match        https://dub-prod.kms.graphiq.a2z.com/tag/*
// @match        https://www.dub-prod.kms.graphiq.a2z.com/tag/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      KIO
// @downloadURL https://update.greasyfork.org/scripts/469746/Entity%20Re-index%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/469746/Entity%20Re-index%20button.meta.js
// ==/UserScript==

(function() {

    'use strict'
    let ent_page
    let run_type = 2
    console.log("run")
    var locale
    if (location.href.includes("/tag/")) {

        ent_page = localStorage.getItem('ent_page')
        locale = localStorage.getItem('locale')
        run_type = localStorage.getItem('run_type')
    }
    if (location.href.includes("/e/")) {
        localStorage.removeItem('ent_page')
        localStorage.removeItem('locale')
        localStorage.removeItem('run_type')
        }

    if (localStorage.getItem('message') != null) {
        alert(localStorage.getItem('message'))
        localStorage.removeItem("message");
    }


    let message = ""

    const button = document.createElement("button")
    button.innerHTML = "Re-index"
    button.setAttribute("id","ep-edit-btn")
    button.setAttribute("class","stnd-btn small")
    button.onclick = function() {
        run_type = 1
        ent_page = location.href
        locale = document.querySelector(".locale-sel-option").innerText
        console.log("set parent page as: " + ent_page)
        localStorage.setItem('ent_page', ent_page)
        localStorage.setItem('locale', locale)
        localStorage.setItem('run_type', run_type)
        var split_ent = window.location.href.split("/e/")
        var tag_page = split_ent[0] + "/tag/e-" + split_ent[1]
        window.location.href = tag_page

    }

    // attach button
    setInterval(function() {

        if (document.querySelector(".stnd-sec")) {
            var buttons = document.querySelectorAll("[id='ep-edit-btn']")

                document.querySelector(".stnd-sec").insertBefore(button,buttons[buttons.length - 1])
            
        }

    },1000)

    const observer_index = new MutationObserver(function() {

        if (document.querySelector(".smtg-reindex-btn")) {
            var selector = "[data-locale=" + locale + "]"
            document.querySelector(selector).click()
            observer_index.disconnect()
        }

    })

    const confirm_index = new MutationObserver(function() {

        if (document.querySelector(".stnd-btn.last.bg-blue") && run_type == 1) {
            document.querySelector(".stnd-btn.last.bg-blue").click()
            confirm_index.disconnect()
            let dialog = "0"
            setInterval(function() {
                if (document.querySelector(".dlg-message") && dialog == "0") {
                    console.log("dialog")
                    dialog = "1"
                    let message = document.querySelector(".dlg-message").querySelector("li").innerHTML
                    localStorage.setItem('message', message)
                    console.log("message")
                    window.location.href = ent_page
                }
            },1000)

        }

    })


    const target = document.querySelector("body")
    const config = { childList: true, subtree:true }
    observer_index.observe(target, config)
    confirm_index.observe(target, config)


})();