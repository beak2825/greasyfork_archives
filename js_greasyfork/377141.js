/*eslint-env jquery*/

// ==UserScript==
// @name         Unlimited BH avatar colors
// @namespace    https://www.brick-hill.com/
// @version      2.0
// @description  Allows you to use any hex color codes for your avatar's body parts
// @author       Dragonian
// @match        https://www.brick-hill.com/customize/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.4.5/jscolor.min.js
// @downloadURL https://update.greasyfork.org/scripts/377141/Unlimited%20BH%20avatar%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/377141/Unlimited%20BH%20avatar%20colors.meta.js
// ==/UserScript==

/*
Copyright 2021 Jake

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const toggleLoading = window.wrappedJSObject.toggleLoading
const colorChange = window.wrappedJSObject.colorChange
const CSRF_TOKEN = window.wrappedJSObject.BH.csrf

const PART_TYPES = [ "Head", "Torso", "Left Arm", "Right Arm", "Left Leg", "Right Leg" ]

//============== CREATE ELEMENTS =================
const currEdit = document.getElementById("curr-edit")

const avatarColorsBox = document.querySelector("div.col-7-12:nth-child(8) > div:nth-child(1) > div:nth-child(2)")
const colorPalleteBox = document.querySelector("div.col-5-12:nth-child(7) > div:nth-child(1) > div:nth-child(2)")

const allButton = document.createElement("button")
allButton.onclick = () => colorChange("All")
allButton.style = "background-color:#6fb6db;border-color:#419dda;padding:10px;width:20%;"
allButton.textContent = "Select All"

avatarColorsBox.prepend(allButton)

const colorWheel = document.createElement("input")
colorWheel.style = "margin: 5px 15px 15px 15px;"

currEdit.parentNode.insertBefore(colorWheel, currEdit.nextSibling)

// https://jscolor.com/docs/#doc-api-options
const picker = new JSColor(colorWheel, {
    closeButton: true,
    closeText: 'Cancel'
})

// Create the submit button in the avatar color area.
const submit = document.createElement("button")
submit.id = "submitColor"
submit.style = "background-color:#6fb6db;border-color:#419dda;padding:6px;"
submit.textContent = "Submit"

colorWheel.parentNode.insertBefore(submit, colorWheel.nextSibling)

// Expand size of color pallette to account for the newly added color selector box.
colorPalleteBox.style = "position:relative;height:550px;overflow-x:hidden;"
//================================================

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function avatarProcess(color, part) {
    const data = {
        _token: CSRF_TOKEN,
        type: "color",
        color: color,
        part: part
    }
    return fetch('https://www.brick-hill.com/api/avatar/process', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then((r) => r.json())
}

async function colorAllParts(color) {
    try {
        for (let part of PART_TYPES)
            await avatarProcess(color, part)
    }
    catch (err) {}
    finally {
        return location.reload()
    }
}

function newColorChange(color) {
    const part = currEdit.textContent.split("Currently Editing: ").pop()
    const limbColor = document.querySelector(`button[onclick="colorChange('${part}')"`)

    submit.disabled = true

    toggleLoading()

    if (part === "All")
        return colorAllParts(color)

    avatarProcess(color, part)
        .then((data) => {
            toggleLoading(data.success)
            limbColor.style.backgroundColor = "#" + color
            submit.disabled = false
        })
        .catch(location.reload)
}

// Initialize the jscolor library after creating all the color pickers.
jscolor.init()

// Rename colorPallete classnames and attach click listener to the picker.
document.querySelectorAll(".colorPallete").forEach((el) => {
    el.className = "newColorPallette"
    el.onclick = () => picker.fromString(el.value)
})

submit.onclick = () => newColorChange(picker.toHEXString().substring(1))

console.log('Loaded BH Unlimited Colors')