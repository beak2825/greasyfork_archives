// ==UserScript==
// @name         Disable Game Grid
// @namespace    -
// @version      0.1
// @description  Hold the KEY: [? or /] this is one key. When the process reaches 100%, the game grid will either appear or disappear.
// @author       Nudo#3310
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445075/Disable%20Game%20Grid.user.js
// @updateURL https://update.greasyfork.org/scripts/445075/Disable%20Game%20Grid.meta.js
// ==/UserScript==

(function() {
    let errorText = "arguments bro..."

    function setLS(key, value = void 0) {
        if (!key) return console.log(errorText)

        return localStorage.setItem(key, JSON.stringify(value))
    }

    function getLS(key) {
        if (!key) return console.log(errorText)

        try {
            return JSON.parse(localStorage.getItem(key))
        } catch {
            return localStorage.getItem(key)
        }
    }

    function isGUIDisabled() {
        if (!["allianceinput", 'chatbox', 'nameinput'].includes(document.activeElement.id.toLowerCase())) {
            return true
        }

        return false
    }

    let gameGrid = (typeof getLS("gameGrid") !== "undefined" ? getLS("gameGrid") : true)

    function createElement(tag, action, node = document.body) {
        if (!tag || !action) return console.log(errorText)

        let element = document.createElement(tag)

        action(element, element.style)

        node.appendChild(element)
    }

    createElement("div", (element, style) => {
        element.id = "toggler-holder"
        style.display = "flex"
        style.pointerEvents = "none"
        style.width = "100%"
        style.height = "100%"
        style.justifyContent = "center"
        style.alignItems = "center"
        style.position = "absolute"
        style.top = "0px"
        style.zIndex = "999999999999999"
    })

    if (document.getElementById("toggler-holder")) {
        document.getElementById("toggler-holder").style.display = "none"

        let togglerCode = `
        <div class="single-chart">
          <svg viewBox="0 0 36 36">
            <path class="circle" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <text x="18" y="17.35" class="percentage">Toggler Game Grid</text>
            <text x="18" y="20.35" class="percentage" id="percToggle" style="fill: #adadad;">0%</text>
          </svg>
        </div>
        <style>
        .single-chart {
          display: flex;
          width: 20%;
          justify-content: space-around;
        }

        .circle {
          fill: rgb(28 28 28 / 70%);
          stroke: #eee;
          stroke-width: .5;
          stroke-linecap: round;
          animation: progress 1s ease-out forwards;
        }

        @keyframes progress {
          0% {
            stroke-dasharray: 0 100;
          }
        }

        .percentage {
          fill: #eee;
          font-size: 3px;
          text-anchor: middle;
        }
        </style>
        `
        document.getElementById("toggler-holder").innerHTML = togglerCode
    }

    let togglerOffset = 0

    function resetToggler() {
        keys[191] = false
        activeToggler = false
        togglerOffset = 0
        document.getElementById("toggler-holder").style.display = "none"
        document.querySelector(".circle").style.strokeDasharray = [0, 100]
    }

    function toggleGameGrid() {
        document.getElementById("toggler-holder").style.display = "flex"

        togglerOffset += 2
        activeToggler = true

        document.querySelector(".circle").style.strokeDasharray = [togglerOffset, 100]
        document.getElementById("percToggle").innerHTML = togglerOffset + "%"

        if (togglerOffset >= 100) {
            gameGrid = !gameGrid
            setLS("gameGrid", gameGrid)
            resetToggler()
        }
    }

    let keys = []
    let activeToggler = false
    let node = document || document.getElementById("gameCanvas") || window

    node.addEventListener("keydown", (event) => {
        if (!isGUIDisabled()) return null

        keys[event.keyCode] = true
    })

    node.addEventListener("keyup", (event) => {
        keys[event.keyCode] = false
    })

    let { maxScreenWidth, maxScreenHeight } = window.config
    let { lineTo, moveTo, clearRect } = CanvasRenderingContext2D.prototype
    let gridAlpha = 0.06

    CanvasRenderingContext2D.prototype.clearRect = function(x, y, width, height) {
        if (keys[191]) {
            toggleGameGrid()
        } else {
            if (activeToggler) {
                resetToggler()
            }
        }

        return clearRect.apply(this, arguments)
    }

    CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
        if (!gameGrid) {
            if (this.globalAlpha == gridAlpha) {
                return void 0
            } else {
                return moveTo.call(this, x, y)
            }
        }

        return moveTo.apply(this, arguments)
    }

    CanvasRenderingContext2D.prototype.lineTo = function(x, y) {
        if (!gameGrid) {
            if (y == maxScreenHeight || x == maxScreenWidth) {
                if (this.globalAlpha == gridAlpha) {
                    return void 0
                } else {
                    return lineTo.call(this, x, y)
                }
            } else {
                return lineTo.call(this, x, y)
            }
        }

        return lineTo.apply(this, arguments)
    }
})()