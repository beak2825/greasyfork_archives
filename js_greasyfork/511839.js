// ==UserScript==
// @name        Root => Ultrabox Drag & Drop Support
// @namespace   Violentmonkey Scripts
// @match       https://ultraabox.github.io/*
// @grant       none
// @version     0.1
// @license     MIT
// @author      >PLANET_BLUTO
// @description 10/7/2024, 1:13:19 AM
// @downloadURL https://update.greasyfork.org/scripts/511839/Root%20%3D%3E%20Ultrabox%20Drag%20%20Drop%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/511839/Root%20%3D%3E%20Ultrabox%20Drag%20%20Drop%20Support.meta.js
// ==/UserScript==

var toggleFunc = (elem, key) => {
    elem.value = key
    elem.dispatchEvent(new Event("change"))
}

document.body.ondragover = e => {
    e.preventDefault()
}

document.body.ondrop = e => {
  try {
    const item = JSON.parse(e.dataTransfer.getData("text/plain"))

    console.log(item)

    toggleFunc(document.querySelector(".selectContainer.menu.edit > select"), "addExternal")

    document.querySelector("#beepboxEditorContainer > div > div.promptContainer > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > button:nth-child(2)").click()

    document.querySelector("#beepboxEditorContainer > div > div.promptContainer > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > textarea").value = item.direct_link

    document.querySelector("#beepboxEditorContainer > div > div.promptContainer > div > div:nth-child(2) > div:nth-child(3) > button").click()

    document.querySelector("#beepboxEditorContainer > div > div.promptContainer > div > div:nth-child(1) > div:nth-child(3) > button").click()
  } catch (err) {
    console.log(`Well fuck you`, err)
  }
}