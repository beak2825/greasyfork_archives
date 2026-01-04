// ==UserScript==
// @name         Sploop Console Script
// @namespace    Nudo
// @version      1
// @description  As you already know, in sploop.io the console is no longer working, or rather, the output to the console. Perhaps you would like to continue using it? If yes, then use this script.
// @author       Nudo#3310
// @match        *://sploop.io/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444625/Sploop%20Console%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/444625/Sploop%20Console%20Script.meta.js
// ==/UserScript==

let consoleCode = `
<div class="console-holder">
  <div class="console-wrapper">
    <div class="console-title">
      <ul class="console-navbar">
        <li id="output" style="border-bottom: 2px solid #6e6e6e;"><span>Output</span></li>
        <li id="input"><span>Input</span></li>
      </ul>
    </div>
    <div class="console-output" style="display: block;">
      <div class="console-output-toolbar">
      </div>
      <div class="console-panel-output"></div>
    </div>
    <div class="console-input" style="display: none;">
      <div class="coming-soon">
        Coming soon
      </div>
      <div class="console-panel-input">
      </div>
      <div class="console-user-input">
      </div>
    </div>
  </div>
</div>
<style>
.coming-soon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  font-family: Consolas, Lucida Console, monospace;
  color: #6e6e6e;
  font-size: 23px;
}
.console-panel-input {
  padding: 10px;
  cursor: default;
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
}
.console-panel-output {
  padding: 10px;
  cursor: default;
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
}
.console-output-toolbar {
  cursor: default;
  height: 20px;
  background: #eee;
  border-bottom: 1px solid #dedede;
}
.console-output, .console-input {
  cursor: default;
  width: 100%;
  height: 100%;
}
.console-title ul, .console-title li {
  cursor: default;
  margin: 0;
  padding: 0;
  list-style: none;
  text-decoration: none;
}
.console-navbar li span {
  cursor: default;
  font-family: Consolas, Lucida Console, monospace;
  color: #6e6e6e;
  font-size: 15px;
}
.console-navbar li:hover {
  background: #dedede;
}
.console-navbar li {
  box-sizing: border-box;
  cursor: default;
  height: 100%;
  padding: 5px;
}
.console-navbar {
  box-sizing: border-box;
  cursor: default;
  padding-left: 5px;
  display: flex;
  align-items: center;
}
.console-title {
  cursor: default;
  width: 100%;
  height: 30px;
  background: #eee;
  border-bottom: 1px solid #dedede;
}
.console-wrapper {
  cursor: default;
  width: 600px;
  height: 100%;
  background: #ffffff;
  pointer-events: all;
  box-sizing: border-box;
}
.console-holder {
  cursor: default;
  font-family: Consolas, Lucida Console, monospace;
  display: none;
  position: absolute;
  top: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  z-index: 9999999;
}
.output-box {
  cursor: default;
  font-family: Consolas, Lucida Console, monospace;
  display: flex;
  margin: 5px;
  border-left: 2px solid #6e6e6e;
  padding-left: 5px;
}
.output-content {
  cursor: default;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.content-title {
  color: black;
  font-size: 16px;
  cursor: default;
}
.content-desc {
  color: #6e6e6e;
  font-size: 14px;
  cursor: default;
}
.output-content div {
  font-family: Consolas, Lucida Console, monospace;
  margin: 3px;
  cursor: default;
}
</style>
`

function addConsoleMenu() {
    $("body").append(consoleCode)
}

addConsoleMenu()

let consoleHolder = document.querySelector(".console-holder")

function openConsole() {
    if (consoleHolder.style.display === "none") {
        consoleHolder.style.display = "block"
        return null
    }
    consoleHolder.style.display = "none"
}

window.openConsole = openConsole

document.addEventListener("keydown", (event) => {
    if (event.code === "F9") {
        openConsole()
    }
})

let Console = new class {
    constructor() {
        this.output = document.querySelector(".console-output")
        this.input = document.querySelector(".console-input")
        this.btnOutput = document.getElementById("output")
        this.btnInput = document.getElementById("input")
        this.panelOutput = document.querySelector(".console-panel-output")
        this.panelOInput = document.querySelector(".console-panel-input")
    }
    closePanel(type) {
        document.querySelector(`.console-${type}`).style.display = "none"
    }
    openPanel(type) {
        document.querySelector(`.console-${type}`).style.display = "block"
    }
    nav() {
        this.btnOutput.addEventListener("click", () => {
            this.btnOutput.style.borderBottom = "2px solid #6e6e6e"
            this.btnInput.style.borderBottom = "none"
            this.openPanel("output")
            this.closePanel("input")
        })
        this.btnInput.addEventListener("click", () => {
            this.btnOutput.style.borderBottom = "none"
            this.btnInput.style.borderBottom = "2px solid #6e6e6e"
            this.openPanel("input")
            this.closePanel("output")
        })
    }
    addToConsole(title, desc, color) {
        let getAllDesc = () => {
            let allDesc = ""
            if (Array.isArray(desc)) {
                for (let i = 0; i < desc.length; i++) {
                    allDesc += `<div class="content-desc" style="color: ${color || ""};"> > ${desc[i] == 0 ? desc[i] : desc[i] || ""}</div>`
                }
                return allDesc
            }
            if (desc instanceof Object) {
                for (let i in desc) {
                    allDesc += `<div class="content-desc" style="color: ${color || ""};"> > ${i + ": " + (desc[i] == 0 ? desc[i] : desc[i] || "")}</div>`
                }
                return allDesc
            }
            return `<div class="content-desc" style="color: ${color || ""};"> > ${desc == 0 ? desc : desc || ""}</div>`
        }
        this.panelOutput.innerHTML += `
        <div class="output-box">
          <div class="output-content">
            ${ title ? `<div class="content-title">${title || ""}</div>` : ""}
            ${ desc ? getAllDesc() : ""}
          </div>
        </div>
        `
    }
    convertConsole() {
        console.log = function(e) {
            Console.addToConsole(...arguments)
        }
        console.error = function(e) {
            Console.addToConsole(arguments[0], arguments[1], "red")
        }

    }
}
Console.nav()
Console.convertConsole()

// Adding text to the console
console.log("Console by Nudo#3310", "Hello, console user! Enjoy coding!")
//console.log("AutoHeal", ["Speed: 100", "Enemy not defined"])
//console.log("AutoHeal Params", AutoHeal)
//console.error("Console by Nudo#3310", "Hello, console user! Enjoy coding!")