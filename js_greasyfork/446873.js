// ==UserScript==
// @name         Cookie Clicker Hack
// @namespace    -
// @version      0.1
// @description  Infinity cookies, infinity chips, autoclicker, autocookies (you should have 1 cookie).
// @author       Nudo#3310
// @match        *://orteil.dashnet.org/cookieclicker/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashnet.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446873/Cookie%20Clicker%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/446873/Cookie%20Clicker%20Hack.meta.js
// ==/UserScript==

setTimeout(() => {
    (function() {
        const Script = {}

        Script.togglers = {
            autoClicker: false,
            addCookies: false,
            infinityCookies: false,
            infinityChips: false
        }

        Script.elements = {
            bigCookie: document.getElementById("bigCookie"),
            topBar: document.getElementById("topBar")
        }

        Script.clearTopBar = function() {
            this.elements.topBar.innerHTML = ""
        }

        Script.clearTopBar()

        Script.addButtonToTopBar = function(text, callback) {
            const container = document.createElement("div")
            const b = document.createElement("b")

            b.style.fontWeight = "bold"
            container.style.cursor = "pointer"

            b.innerHTML = text

            container.appendChild(b)

            this.elements.topBar.appendChild(container)

            container.addEventListener("click", () => {
                callback(b)
            })
        }

        Script.clickToCookie = function() {
            window.Game.ClickCookie()
        }

        Script.addCookies = function() {
            window.Game.cookies += window.Game.cookies * 2
        }

        Script.infinityCookies = function() {
            window.Game.cookies = Number.MAX_VALUE
        }

        Script.infinityChips = function() {
            window.Game.heavenlyChips = Number.MAX_VALUE
        }

        Script.addButtonToTopBar("Auto Clicker", (b) => {
            Script.togglers.autoClicker = !Script.togglers.autoClicker

            if (Script.togglers.autoClicker) {
                b.style.color = "#fff"

                Script.autoClickerInterval = setInterval(() => {
                    Script.clickToCookie()
                })
            } else if (Script.autoClickerInterval) {
                b.style.color = ""

                clearInterval(Script.autoClickerInterval)
            }
        })

        Script.addButtonToTopBar("Add Cookies", (b) => {
            Script.togglers.addCookies = !Script.togglers.addCookies

            if (Script.togglers.addCookies) {
                b.style.color = "#fff"

                Script.addCookiesInterval = setInterval(() => {
                    Script.addCookies()
                })
            } else if (Script.addCookiesInterval) {
                b.style.color = ""

                clearInterval(Script.addCookiesInterval)
            }
        })

        Script.addButtonToTopBar("Infinity Cookies", (b) => {
            Script.togglers.infinityCookies = !Script.togglers.infinityCookies

            if (Script.togglers.infinityCookies) {
                b.style.color = "#fff"

                Script.infinityCookiesInterval = setInterval(() => {
                    Script.infinityCookies()
                })
            } else if (Script.infinityCookiesInterval) {
                b.style.color = ""

                clearInterval(Script.infinityCookiesInterval)
            }
        })

        Script.addButtonToTopBar("Infinity Chips", (b) => {
            Script.togglers.infinityChips = !Script.togglers.infinityChips

            if (Script.togglers.infinityChips) {
                b.style.color = "#fff"

                Script.infinityChipsInterval = setInterval(() => {
                    Script.infinityChips()
                })
            } else if (Script.infinityChipsInterval) {
                b.style.color = ""

                clearInterval(Script.infinityChipsInterval)
            }
        })
    })()
}, 5000)