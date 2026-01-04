// ==UserScript==
// @name         Fixed settings menu
// @namespace    -
// @version      0.1
// @description  Developers sploop.io too lazy to do it yourself.. So I did it for them.
// @author       Nudo#3310
// @license      MIT
// @match        https://sploop.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447141/Fixed%20settings%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/447141/Fixed%20settings%20menu.meta.js
// ==/UserScript==

(function anonymous() {
    const settingsContent = document.querySelector(".pop-settings-content")
    const settingDivs = settingsContent.querySelectorAll("div")
    const settingSpans = settingsContent.querySelectorAll("span")
    const settingLines = settingsContent.querySelectorAll(".setting-line")

    const divsSize = "16px"
    const spansSize = "10px"
    const lineMarginTop = "10px"
    const settingheight = "100%"
    const settingFirstMargin = "0px"

    settingsContent.classList.add("select", "pop-list-content", "scrollbar", "content", "subcontent-bg")
    settingsContent.style.height = settingheight

    for (const div of settingDivs) {
        div.style.fontSize = divsSize
    }

    for (const span of settingSpans) {
        span.style.fontSize = divsSize
    }

    for (const line of settingLines) {
        line.style.marginTop = lineMarginTop
    }

    settingsContent.firstChild.style.margin = settingFirstMargin

    const settingLinesBK = Array.from(settingsContent.querySelectorAll(".setting-line"))
    const groupCB = Array.from(settingsContent.querySelectorAll(".control-group"))

    settingLinesBK.splice(0, 5)
    groupCB.splice(5)

    const lineAlignItems = "center"
    const groupMarginTop = "4px"

    for (const bkline of settingLinesBK) {
        bkline.style.alignItems = lineAlignItems
    }

    for (const groupcb of groupCB) {
        groupcb.style.marginTop = groupMarginTop
    }

    const popSettings = document.getElementById("pop-settings")

    const popOverflowY = "hidden"
    const popHeight = "400px"

    popSettings.style.overflowY = popOverflowY
    popSettings.style.height = popHeight

    const resetKeybinds = document.getElementById("reset-keybinds")

    resetKeybinds.classList.add("text-shadowed-3")
    resetKeybinds.style.cssText = `
    outline: 0;
    color: white;
    border: 5px solid #141414;
    border-radius: 10px;
    box-shadow: inset 0 23px 0 #e8e0c8;
    text-align: center;
    padding: 4px;
    cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
    `

    const inputKeyBinds = document.querySelectorAll(".keybind-setting")

    const inputHeight = "auto"
    const inputPadding = "4px"
    const inputMargin = "0px"

    for (const input of inputKeyBinds) {
        input.style.height = inputHeight
        input.style.padding = inputPadding
        input.style.margin = inputMargin
    }
})()