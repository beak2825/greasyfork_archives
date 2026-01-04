// ==UserScript==
// @name        SEO toggle
// @namespace   https://greasyfork.org/users/843419
// @match       https://www.roblox.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.0
// @author      Zgoly
// @description Standard Enabled Offline toggle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/500628/SEO%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/500628/SEO%20toggle.meta.js
// ==/UserScript==

let toggled = GM_getValue('toggled', false)

Roblox.Lang.SEO = {}

if (Roblox.ProtocolHandlerClientInterface.gameLocale == 'ru_ru') {
    Roblox.Lang.SEO.Enabled = "СВО активирован"
    Roblox.Lang.SEO.Disabled = "СВО деактивирован"
} else {
    Roblox.Lang.SEO.Enabled = "SEO activated"
    Roblox.Lang.SEO.Disabled = "SEO deactivated"
}

const customDiv = document.createElement("div")
customDiv.classList.add("custom")

const alertSystemFeedback = document.createElement("div")
alertSystemFeedback.classList.add("alert-system-feedback")

const alertSuccess = document.createElement("div")
alertSuccess.classList.add("alert", "alert-success")

const alertContent = document.createElement("span")
alertContent.classList.add("alert-content")

alertSuccess.appendChild(alertContent)
alertSystemFeedback.appendChild(alertSuccess)
customDiv.appendChild(alertSystemFeedback)

document.body.appendChild(customDiv)

function showMessage(toggled) {
    alertContent.textContent = toggled ? Roblox.Lang.SEO.Enabled : Roblox.Lang.SEO.Disabled
    alertSuccess.classList.remove("alert-success", "alert-warning")
    alertSuccess.classList.add("on", toggled ? "alert-success" : "alert-warning")
    setTimeout(function () {
        alertSuccess.classList.remove("on")
    }, 2000)
}

document.addEventListener("keydown", e => {
    if (e.code == 'KeyG') {
        fetch("https://apis.roblox.com/user-settings-api/v1/user-settings", { "credentials": "include" })
            .then(response => response.json())
            .then(data => {
                const toggled = data.whoCanJoinMeInExperiences == "Friends"
                showMessage(toggled)

                fetch("https://apis.roblox.com/user-settings-api/v1/user-settings", {
                    "headers": {
                        "content-type": "application/json;charset=UTF-8",
                        "x-csrf-token": Roblox.XsrfToken.getToken()
                    },
                    "body": JSON.stringify({ "whoCanJoinMeInExperiences": toggled ? "NoOne" : "Friends" }),
                    "method": "POST",
                    "credentials": "include"
                })
            })
    }
})