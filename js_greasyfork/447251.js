// ==UserScript==
// @name         Hat Switcher
// @namespace    -
// @version      0.1
// @description  When you log into the game, open the store and click on Z or R or Y. After that everything will work correctly.
// @author       Nudo
// @match        *://sploop.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447251/Hat%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/447251/Hat%20Switcher.meta.js
// ==/UserScript==

(function anonymous() {
    const Switcher = {}

    Switcher.getHatElement = function(name) {
        return document.querySelector(`img[src="/img/entity/${name}.png?v=1923912"]`)
    }

    Switcher.getHatButton = function(name) {
        return this.getHatElement(name).nextSibling.nextSibling.querySelector("button")
    }

    Switcher.onMouseUp = function(event) {
        if (!event.target && !event.isTrusted) {
            return void 0
        }

        Switcher.event = event
    }

    document.addEventListener('mouseup', Switcher.onMouseUp)

    Switcher.getListener = function(button) {
        return window.getEventListeners(button).mouseup[0]
    }

    Switcher.getShop = function() {
        return document.getElementById("hat-menu")
    }

    Switcher.sleep = function() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000)
        })
    }

    Switcher.doClick = function(button) {
        if (!this.event) {
            return void 0
        }

        this.getShop().style.display = "flex"

        button.onmouseup(this.event)

        this.getShop().style.display = "none"
    }

    Switcher.clickToButton = function(name) {
        const button = this.getHatButton(name)

        this.doClick(button)
    }

    Switcher.hats = {
        "KeyY": "hat_3",
        "KeyT": "hat_1",
        "KeyZ": "hat_11",
        "LeftShift": "hat_6"
    }

    Switcher.onKeyDown = function(event) {
        const name = Switcher.hats[event.code]

        if (!name) {
            return void 0
        }

        Switcher.clickToButton(name)
    }

    document.addEventListener("keydown", Switcher.onKeyDown)
})()