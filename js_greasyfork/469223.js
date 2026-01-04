// ==UserScript==
// @name         Andy Jassy time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  official title for the applicants to the andy jassy role
// @author       abbelot
// @match        https://phonetool.amazon.com/users/abbelot
// @match        https://phonetool.amazon.com/users/paelodiw
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      KIO

// @downloadURL https://update.greasyfork.org/scripts/469223/Andy%20Jassy%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/469223/Andy%20Jassy%20time.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const name = document.querySelector("div.PersonalInfoName > div.name").innerText
    const new_job = "Official Andy Jassy applicant"

    const new_name = name.replace(" ", " 'Andy Jassy' ")

    const observer = new MutationObserver(function() {

        if (document.readyState == "complete") {
            console.log(document.readyState)
            document.querySelector("div.PersonalInfoName > div.name").innerText = new_name
            document.querySelector("div.PersonalInfoJobTitle > span.optional-wrapper").innerText = new_job
            observer.disconnect()

        }
    })
    const target = document.querySelector("body")
    const config = { childList: true, subtree:true }
    observer.observe(target, config)




})();