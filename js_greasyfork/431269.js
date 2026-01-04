// ==UserScript==
// @name           Beta adapter Ping/Fps! (v3)
// @name:ru        Бета адаптер Ping/Fps! (v3)
// @namespace      none
// @version        3.1.0
// @description    This is a beta adapter for your ping/FPS in MooMoo.io! + Remove Ad
// @description:ru Это бета-адаптер для вашего ping/FPS в MooMoo.io! + Удалить Рекламу
// @author         @nudoo
// @match          *://moomoo.io/*
// @match          *://*.moomoo.io/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/431269/Beta%20adapter%20PingFps%21%20%28v3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/431269/Beta%20adapter%20PingFps%21%20%28v3%29.meta.js
// ==/UserScript==
(function() {
    "use strict"

    const adSelectors = [
        "#adCard", "#adBlock", "#promoImgHolder",
        "#pre-content-container"
    ]
    const meaninglessSelectors = [
        "#joinPartyButton", "#partyButton", "#settingsButton",
        `script[src="./libs/howler.core.min.js"]`, "#errorNotification",
        "#youtubeFollow", "#linksContainer2", "#twitterFollow",
        "#followText", "#youtuberOf", "#mobileInstructions",
        "#downloadButtonContainer", "#mobileDownloadButtonContainer", ".downloadBadge",
        "#altServer"
    ]
    const stateColors = {
        enabled: "#7ee559",
        disabled: "#e55959"
    }

    function removeElement(selector) {
        const elements = [ ...document.querySelectorAll(selector) ]

        for (const element of elements) {
            if (!element) continue

            if (!(element.remove instanceof Function)) {
                element.style.display = "none !important"
                element.style.visiblity = "hidden !important"

                continue
            }

            element.remove()
        }
    }

    function removeElements(selectors) {
        for (const selector of selectors) {
            if (!selector) continue

            removeElement(selector)
        }
    }

    function getCustomId(id) {
        id = id.toLowerCase().replace(/(\-|\s)/g, "_")

        return `beta_adapter_${id}`
    }

    function getGameDefaultButton(id) {
        const button = document.createElement("div")

        button.classList.add("menuButton")

        button.id = id

        return button
    }

    function addButtonToSetupCard(name, state, listener) {
        const setupCard = document.getElementById("setupCard")
        const id = getCustomId(name)
        const button = getGameDefaultButton(id)

        button.innerHTML = `<span>${name}</span>`
        button.style.marginTop = "16px"

        setupCard.appendChild(button)

        button.setState = function(_state) {
            const stateColor = stateColors[_state ? "enabled" : "disabled"]

            button.style.backgroundColor = stateColor
        }

        button.setState(state)

        if (!(listener instanceof Function)) return

        button.addEventListener("click", listener.bind(null, button))
    }

    function getRemoveStoreHatsState() {
        return JSON.parse(localStorage.getItem("remove_store_hats"))
    }

    function setRemoveStoreHatsState(_state) {
        localStorage.setItem("remove_store_hats", JSON.stringify(_state))
    }

    function onDOMLoaded() {
        removeElements(adSelectors)
        removeElements(meaninglessSelectors)

        addButtonToSetupCard("Remove store hats", getRemoveStoreHatsState(), (button) => {
            const state = !getRemoveStoreHatsState()

            button.setState(state)
            setRemoveStoreHatsState(state)
        })

        const storeButton = document.getElementById("storeButton")
        const storeTabs = document.querySelectorAll(".storeTab")
        const removeHatsButtons = [ storeButton, ...storeTabs ]

        removeHatsButtons.forEach((button) => {
            button.addEventListener("click", () => {
                if (!getRemoveStoreHatsState()) return

                const interval = setInterval(() => {
                    const mainMenu = document.getElementById("mainMenu")
                    const hatPreview = document.querySelector(".hatPreview")

                    if (mainMenu) return clearInterval(interval)
                    if (!hatPreview) return

                    removeElement(".hatPreview")
                    clearInterval(interval)
                })
            })
        })
    }

    window.location.native_resolution = true

    const oldReqAnimFrame = window.requestAnimationFrame

    window.requestAnimationFrame = function(callback) {
        if (callback.toString().length === 69) {
            return window.setTimeout(callback, 1e3 / 111)
        }

        return oldReqAnimFrame(callback)
    }

    Object.defineProperty(HTMLImageElement.prototype, "src", {
        get() {
            return this[Symbol("src")]
        },
        set(value) {
            if (this.classList.contains("hatPreview")) {
                if (getRemoveStoreHatsState() && (/\/hats\/hat\_/.test(value) || /\/accessories\/access\_/.test(value))) {
                    return this.remove()
                }
            }

            this.setAttribute("src", value)

            this[Symbol("src")] = value
        },
        configurable: true
    })

    Object.defineProperty(Object.prototype, "turnSpeed", {
        get() {
            return 0
        },
        set(value) {
            this[Symbol("turnSpeed")] = 0
        },
        configurable: true
    })

    const maxScreenWidth = 1920
    const maxScreenHeight = 1080
    const { lineTo, moveTo } = CanvasRenderingContext2D.prototype
    const gridAlpha = 0.06

    CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
        if (this.globalAlpha === gridAlpha) return

        return moveTo.apply(this, arguments)
    }

    CanvasRenderingContext2D.prototype.lineTo = function(x, y) {
        if (this.globalAlpha === gridAlpha && (y === maxScreenHeight || x === maxScreenWidth)) return

        return lineTo.apply(this, arguments)
    }

    window.addEventListener("DOMContentLoaded", onDOMLoaded)
})()