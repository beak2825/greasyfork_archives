// ==UserScript==
// @name         Just a cps counter
// @namespace    -
// @version      0.1
// @description  Shows the number of clicks per second
// @author       Nudo#3310
// @license      MIT
// @match        *://sploop.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447136/Just%20a%20cps%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/447136/Just%20a%20cps%20counter.meta.js
// ==/UserScript==

(function anonymous() {
    const Cps = {}

    Cps.log = console.log

    Cps.count = 0

    Cps.reduce = function() {
        this.count -= 1

        this.element.setText(this.count)
    }

    Cps.increase = function() {
        this.count += 1

        this.element.setText(this.count)
    }

    Cps.sleep = function() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000)
        })
    }

    Cps.createElement = function() {
        this.element = document.createElement("div")

        this.element.setText = (count) => {
            const countNum = parseInt(count)

            if (countNum < 0) {
                count = 0

                Cps.log("bug...")
            }

            this.element.textContent = `Cps: ${count}`
        }

        this.element.setText(0)

        this.style = this.element.style

        this.element.classList.add("text-shadowed-3")

        this.style.position = "absolute"
        this.style.top = "20px"

        this.style.width = "100%"

        this.style.pointerEvents = "none"

        this.style.textAlign = "center"
        this.style.color = "white"
        this.style.fontSize = "20px"

        document.body.appendChild(this.element)
    }

    Cps.createElement()

    Cps.update = async function() {
        this.increase()
        await this.sleep()
        this.reduce()
    }

    document.addEventListener("mousedown", () => {
        Cps.update()
    })

    Cps.spaceActive = false

    document.addEventListener("keydown", (event) => {
        if (event.code !== "Space" || Cps.spaceActive) {
            return void 0
        }

        Cps.update()
        Cps.spaceActive = true
    })

    document.addEventListener("keyup", (event) => {
        if (event.code !== "Space") {
            return void 0
        }

        Cps.spaceActive = false
    })
})()