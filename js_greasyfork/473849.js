// ==UserScript==
// @name         Ambitionfox
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Read all blured contents. Educational purpose only
// @author       C1GAAR
// @match        https://www.ambitionbox.com/*
// @match        https://www.crunchbase.com/*
// @match        https://www.geeksforgeeks.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473849/Ambitionfox.user.js
// @updateURL https://update.greasyfork.org/scripts/473849/Ambitionfox.meta.js
// ==/UserScript==


setInterval(async () => {
    if(window.location.origin == "https://www.crunchbase.com"){
        document.querySelector("new-paywall").remove()
    }
    if(window.location.origin == "https://www.ambitionbox.com"){
    document.querySelectorAll(".blurred").forEach(el => el.classList.remove("blurred")) // set all elements with the attribute free set to "" to true

    document.querySelectorAll(".overlay").forEach(el => el.style.display = "none")
    }
    if(window.location.origin == "https://www.geeksforgeeks.org/"){
     document.querySelectorAll(".login-modal-div").forEach(el => el.classList.remove("blurred"))
     document.querySelectorAll(".modal-container").forEach(el => el.classList.remove("blurred"))
    }
    }, 500)


