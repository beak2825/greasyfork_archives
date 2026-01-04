// ==UserScript==
// @name         InContact Support Plus
// @namespace    http://tampermonkey.net/
// @version      3017
// @description  yee
// @author       Stamos
// @match        https://home-c13.incontact.com/inContact/Default.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=incontact.com
// @grant        GM_addStyle
// @license MIT
// @run-at context-menu
// @downloadURL https://update.greasyfork.org/scripts/536342/InContact%20Support%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/536342/InContact%20Support%20Plus.meta.js
// ==/UserScript==
 
(function () {
    "use strict"
    const STATUSES = {
        UNAVAIL_PERSONAL: "Personal Business",
        UNAVAIL_TRAINING: "Training",
        UNAVAIL_BREAK: "Break",
        UNAVAIL_ACW: "ACW",
        UNAVAIL_CALLBACK: "Callbacks",
        UNAVAIL_LUNCH: "Lunch",
        UNAVAIL_QA: "QA",
        UNAVAIL_SPECPROJ: "Special Project",
        INBOUND: "Inbound",
        OUTBOUND: "Outbound",
        AVAILABLE: "Available",
        REFUSED: "Refused",
        INBOUNDPENDING: "InboundPending",
    }
 
    // key is name from google sheet, right is name in incontact
    const NAME_EXCEPTIONS = new Map([
        ["Chad Foster Sr", "Chad Foster"],
        ["Lovia Monalissa Sebastien Armand", "Lovia Armand"],
        ["Daniel Yanez", "Daniel SerratoYanez"],
        ["Rodney Sanders Jr", "Rodney Sanders"]
    ]);
 
    let personList = new Array()
    let personsWhoLoggedInDuringInterval = new Array()
    let scheduledPersonList = new Array()
    let helpedPersonList = new Array()
 
    const CRITICAL_COLOR = "rgb(230, 80, 80)"
    const WARNING_COLOR = "rgb(230, 183, 80)"
    const POSSIBLE_ISSUE_COLOR = "rgb(165, 80, 230)"
    const SUPER_BAD_COLOR = "rgb(255, 0, 0)"
    const UNSCHEDULED_COLOR = "rgb(102, 255, 255)"
 
    const ACW_WARNING_THRESHOLD = 1 * 60
    const ACW_TOO_LONG_THRESHOLD = 2 * 60
    const CALL_WARNING_THRESHOLD = 20 * 60
    const CALL_TOO_LONG_THRESHOLD = 30 * 60
    const SUPER_LONG_TIME = 40 * 60
    const MIN_CALL_TIME = 14 * 60
 
    const IS_DEBUGGING = true
 
    function lerpColor(rgb1, rgb2, t) {
        t = Math.max(0, Math.min(1, t))
        const color1 = parseRgbString(rgb1)
        const color2 = parseRgbString(rgb2)
        const lerpedColor = {
            r: Math.round(color1.r + (color2.r - color1.r) * t),
            g: Math.round(color1.g + (color2.g - color1.g) * t),
            b: Math.round(color1.b + (color2.b - color1.b) * t),
        }
        return `rgb(${lerpedColor.r}, ${lerpedColor.g}, ${lerpedColor.b})`
    }
 
    function parseRgbString(rgbString) {
        const match = rgbString.match(/^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/)
        if (!match) {
            throw new Error(
                "Invalid RGB format. Expected 'rgb(r, g, b)', got " + rgbString,
            )
        }
        return {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10),
        }
    }
 
    class Person {
        constructor(firstName, lastName) {
            this.firstName = firstName
            this.lastName = lastName
        }
 
        toString() {
            return this.firstName + " " + this.lastName
        }
 
        equals(other) {
            return (
                this.firstName.toLowerCase() === other.firstName.toLowerCase() &&
                this.lastName.toLowerCase() === other.lastName.toLowerCase()
            )
        }
 
        isCloseTo(other) {
            const thisLastWord = this.lastName.split(" ").pop()
            const otherLastWord = other.lastName.split(" ").pop()
            return (
                this.firstName.toLowerCase() === other.firstName.toLowerCase() &&
                thisLastWord.toLowerCase() === otherLastWord.toLowerCase()
            )
        }
    }
 
    function debug(str) {
        if (IS_DEBUGGING) {
            console.log(str)
        }
    }
 
    function hasScriptAlreadyRan() {
        if (document.getElementById("specialOverlay")) {
            console.log("element already created")
            return true
        }
        return false
    }
 
    //ty niko https://stackoverflow.com/questions/9640266/convert-hhmmss-string-to-seconds-only-in-javascript
    function hmsToSecondsOnly(str) {
        var p = str.split(":"),
            s = 0,
            m = 1
 
        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10)
            m *= 60
        }
 
        return s
    }
 
    function changeRowColor(row, color) {
        const { r, g, b } = parseRgbString(color)
        row.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.5)`
  }
 
    function checkIfIntervalEnded() {
        const now = new Date()
        const minute = now.getMinutes()
        if (minute % 30 == 0) {
            // clear list of people who logged in during the interval
            personsWhoLoggedInDuringInterval.length = 0
            console.log("Cleared logged in interval array")
        }
    }
 
    function processGridChildren() {
        const gridParent = document.querySelector(".grid-canvas")
        if (!gridParent) {
            debug("not found")
            return
        }
 
        getAgentsBeingHelped()
        personList = []
        let i = 0
        for (const child of gridParent.childNodes) {
            const nameDiv = child.children[0]
            const timeDiv = child.children[1]
            const statusDiv = child.children[2]
 
            const name = nameDiv.innerText
            const time = timeDiv.innerText
            const status = statusDiv.innerText.trim()
 
            const person = parseName(name)
            personList[i] = person
            if (personsWhoLoggedInDuringInterval.findIndex((element) => element.equals(person)) == -1) {
                personsWhoLoggedInDuringInterval.push(person)
            }
 
            if (status.includes("ACW")) {
                checkACW(child, status, time)
            }
            if (
                status.includes(STATUSES.INBOUND) ||
                status.includes(STATUSES.OUTBOUND)
            ) {
                checkInboundOutboundTime(child, status, time)
            }
            checkAllowedStatuses(child, status, time)
            checkOnSchedule(child, personList[i])
            checkBeingHelped(child, name)
            i++
        }
    }
 
    function checkInboundOutboundTime(row, status, time) {
        let seconds = hmsToSecondsOnly(time)
 
        if (seconds >= CALL_TOO_LONG_THRESHOLD) {
            const t =
                  (seconds - CALL_TOO_LONG_THRESHOLD) /
                  (SUPER_LONG_TIME - CALL_TOO_LONG_THRESHOLD)
            changeRowColor(row, lerpColor(CRITICAL_COLOR, SUPER_BAD_COLOR, t))
        } else if (seconds >= CALL_WARNING_THRESHOLD) {
            const t =
                  (seconds -
                   CALL_WARNING_THRESHOLD) /
                  (CALL_TOO_LONG_THRESHOLD - CALL_WARNING_THRESHOLD)
            changeRowColor(row, lerpColor(WARNING_COLOR, CRITICAL_COLOR, t))
        } else if (seconds >= MIN_CALL_TIME) {
            const t = (seconds - MIN_CALL_TIME) / (CALL_WARNING_THRESHOLD - MIN_CALL_TIME)
            changeRowColor(row, lerpColor("rgb(255, 255, 255)", WARNING_COLOR, t))
        }
    }
 
    function checkAllowedStatuses(row, status, time) {
        const unallowedStatuses = [
            STATUSES.UNAVAIL_LUNCH,
            STATUSES.UNAVAIL_QA,
            STATUSES.UNAVAIL_SPECPROJ,
            STATUSES.UNAVAIL_BREAK,
            STATUSES.UNAVAIL_PERSONAL,
            STATUSES.REFUSED,
            STATUSES.UNAVAIL_CALLBACK,
            STATUSES.INBOUNDPENDING
        ]
        if (unallowedStatuses.some((stat) => status.includes(stat))) {
            changeRowColor(row, CRITICAL_COLOR)
        } else if (status.includes(STATUSES.UNAVAIL_TRAINING)) {
            changeRowColor(row, POSSIBLE_ISSUE_COLOR)
        } else if (status.trim() === "Unavailable") {
            changeRowColor(row, CRITICAL_COLOR)
        }
    }
 
    function checkACW(row, status, time) {
        let seconds = hmsToSecondsOnly(time)
 
        if (seconds >= ACW_TOO_LONG_THRESHOLD) {
            changeRowColor(row, CRITICAL_COLOR)
        } else if (seconds >= ACW_WARNING_THRESHOLD) {
            changeRowColor(row, WARNING_COLOR)
        }
    }
 
    function checkOnSchedule(row, person) {
        if (scheduledPersonList.length == 0) return
        if (scheduledPersonList.findIndex((element) => element.isCloseTo(person)) == -1) {
            const img = document.createElement("img")
            img.setAttribute("style", "vertical-align:text-top; padding-left: 5px;")
            img.title = "Not on schedule!"
            img.src = "https://home-c13.incontact.com/inContact/css/dashboard/images/icon_state_blue.png"
            row.children[0].appendChild(img)
        }
    }
 
    async function getAgentsBeingHelped() {
        try {
            const response = await fetch("http://207.211.190.191:8060/helpedAgents")
            if (!response.ok) {
                throw new Error(`Error when getting helped agents: ${response.status}`)
            }
 
            const result = await response.json()
 
            debug(`Got data: ${result}`)
            helpedPersonList = new Array()
            for (const key in result) {
                helpedPersonList.push(result[key])
            }
 
        } catch (error) {
            debug(error)
        }
    }
 
    async function setAgentBeingHelped(fullName, beingHelped) {
        const data = {
            fullname: fullName,
            beinghelped: beingHelped
        }
        debug(JSON.stringify(data))
        try {
            const response = await fetch("http://207.211.190.191:8060/helpedAgents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error(`Error when sending helped agent: ${response.status}`)
            }
 
            const result = await response.text()
            debug(`Sent data with response: ${result}`)
        } catch (error) {
            debug(`Error: ${error}`)
        }
    }
 
    function checkBeingHelped(row, fullName) {
        const img = document.createElement("img")
        img.setAttribute("style", "vertical-align:text-top; padding-left: 5px;")
        img.src = "https://home-c13.incontact.com/inContact/css/dashboard/images/icon_state_gray.png"
        img.title = "Not currently being helped"
        img.onclick = function() {
            setAgentBeingHelped(fullName, true)
            helpedPersonList.push(fullName)
            img.remove()
            checkBeingHelped(row, fullName)
        }
        row.children[0].appendChild(img)
        if (helpedPersonList.length == 0) return
        if (helpedPersonList.findIndex((element) => element == fullName) != -1) {
            img.src = "https://home-c13.incontact.com/inContact/css/dashboard/images/icon_state_orange.png"
            img.title = "Being helped"
            img.onclick = function() {
                setAgentBeingHelped(fullName, false)
                const index = helpedPersonList.indexOf(fullName)
                if (index != -1) {
                    helpedPersonList.splice(index, 1)
                }
                img.remove()
                checkBeingHelped(row, fullName)
            }
        }
    }
 
    let lastMutationTime = Date.now()
    function observeGridChanges() {
        if (hasScriptAlreadyRan()) return
        const gridParent = document.querySelector(".grid-canvas")
        if (!gridParent) {
            console.log("grid parent not found, retrying")
            setTimeout(observeGridChanges, 15000)
            return
        }
 
        console.log("grid parent found")
 
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList" && Date.now() - lastMutationTime >= 500) {
                    checkIfIntervalEnded()
                    processGridChildren()
                    lastMutationTime = Date.now()
                }
            }
        })
 
        observer.observe(gridParent, { childList: true, subtree: false })
    }
 
    // returns person object
    function parseName(fullName) {
        const parts = fullName.split(/\s+/)
        const first = parts[0]
        let last = parts.slice(1).join("")
        // THIS IS SO GROSS but im tired
        if (last === "HerreraFlores") {
            last = "Herrera Flores"
        }
        return new Person(first, last)
    }
 
    // was used when copying from old attendance google doc, keeping this here in case anything changes
    function getNamesFromCopyPastedGoogleSheet_old(str) {
        let nameArray = str.split("\n").filter(name => !name.includes("OpenShift"))
        let returnArray = new Array()
 
        let i = 0
        nameArray.forEach((item) => {
            // google sheets adds that unicode between columns
            let name = item.split("\u0009")
 
            const testNameIfInMap = name[0].concat(" ", name[1])
            if (NAME_EXCEPTIONS.has(testNameIfInMap))
                name = NAME_EXCEPTIONS.get(testNameIfInMap).split(" ")
            returnArray[i] = new Person(name[0], name[1])
            i++
        })
 
        return returnArray
    }
 
    function getNamesFromCopyPastedGoogleSheet(str) {
        let nameArray = str.split("\n")
        let returnArray = new Array()
 
        let i = 0
        nameArray.forEach((item) => {
            let name = item.split(" ")
            if (name.length != 1) {
                returnArray[i] = new Person(name[0], name[1])
                i++
            }
        })
 
        return returnArray
    }
 
    function updateScheduledPersonList(text) {
        let list = getNamesFromCopyPastedGoogleSheet(text)
        let returnArray = new Array()
        let i = 0
        list.forEach((item) => {
            let person = new Person(item.firstName, item.lastName)
            returnArray[i] = person
            i++
        })
        scheduledPersonList = returnArray
    }
 
    function calcAgentLockPercentage(lockText, agentText) {
        if (lockText.value == "" || agentText.value == "") return -1
        const lockNumber = parseInt(lockText.value)
        const agentNumber = parseInt(agentText.value)
        if (lockNumber <= 0 || agentNumber <= 0) return -1
        let lockPercent = (agentNumber / lockNumber) * 100
        return lockPercent
    }
 
    function createElements() {
        if (hasScriptAlreadyRan()) return
        GM_addStyle(`#specialOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: none;
        }
        #specialButton {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 10000;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #divPanel {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            width: 65%;
            height: 65%;
        }
        #divPanel > h1 {
            text-align: center;
        }
        #miniTextArea {
            font-size: x-large;
            width: 80px;
            height: 40px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
            resize: vertical;
            box-sizing: border-box;
        }
        #nameTextArea {
            width: 30%;
            height: 50%;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
            resize: vertical;
            box-sizing: border-box;
        }
        #divPanel > button {
            margin: 10px auto;
            padding: 10px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            display: block;
        }
        #divPanel > button:active {
           background-color: #218a39;
           transform: translateY(2px);
        }`)
        const button = document.createElement("button")
        button.innerText = "Toggle Overlay"
        button.id = "specialButton"
        button.addEventListener("click", () => {
            overlay.style.display =
                overlay.style.display === "none" ? "block" : "none"
        })
        document.body.appendChild(button)
 
        const overlay = document.createElement("div")
        overlay.id = "specialOverlay"
        overlay.style.display = "none"
        document.body.appendChild(overlay)
 
        const innerDiv = document.createElement("div")
        innerDiv.id = "divPanel"
        overlay.appendChild(innerDiv)
 
        function checkAndSetLockPercent(lockText, agentText) {
            const percent = calcAgentLockPercentage(lockText, agentText)
            if (percent != -1) {
                lockPercentText.value = Math.floor(percent)
            }
        }
 
        const lockLabel = document.createElement("label")
        lockLabel.innerText = "Lock:"
        innerDiv.appendChild(lockLabel)
        const lockText = document.createElement("textarea")
        lockText.id = "miniTextArea"
        innerDiv.appendChild(lockText)
 
        const sepDiv1 = document.createElement("div")
        innerDiv.appendChild(sepDiv1)
 
        const agentLabel = document.createElement("label")
        agentLabel.innerText = "Agents:"
        innerDiv.appendChild(agentLabel)
        const agentText = document.createElement("textarea")
        agentText.id = "miniTextArea"
        innerDiv.appendChild(agentText)
 
        const sepDiv2 = document.createElement("div")
        innerDiv.appendChild(sepDiv2)
 
        const lockPercentLabel = document.createElement("label")
        lockPercentLabel.innerText = "% to Lock:"
        innerDiv.appendChild(lockPercentLabel)
        const lockPercentText = document.createElement("textarea")
        lockPercentText.id = "miniTextArea"
        lockPercentText.disabled = true
        innerDiv.appendChild(lockPercentText)
 
        const copyNamesButton = document.createElement("button")
        copyNamesButton.innerText = "Copy List of Names"
        copyNamesButton.addEventListener("click", () => {
            var allNames = ""
            //personsWhoLoggedInDuringInterval.forEach((person) => (allNames += (person.toString() + "\n")))
            personList.forEach((person) => (allNames += (person.toString() + "\n")))
            navigator.clipboard.writeText(allNames)
        })
        innerDiv.appendChild(copyNamesButton)
 
        lockText.addEventListener("input", (event) => checkAndSetLockPercent(lockText, agentText))
        agentText.addEventListener("input", (event) => checkAndSetLockPercent(lockText, agentText))
 
        const scheduledAgentsText = document.createElement("textarea")
        scheduledAgentsText.id = "nameTextArea"
        scheduledAgentsText.addEventListener("input", (event) => updateScheduledPersonList(scheduledAgentsText.value))
        innerDiv.appendChild(scheduledAgentsText)
    }
 
    observeGridChanges()
    createElements()
})()