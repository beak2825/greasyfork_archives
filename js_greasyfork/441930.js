// ==UserScript==
// @name         Nitro Type - Racing Accuracy Alt Metric
// @version      0.1.1
// @description  Changes the Accuracy score based on errors against the whole typing test.
// @author       Toonidy
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @require      https://greasyfork.org/scripts/443718-nitro-type-userscript-utils/code/Nitro%20Type%20Userscript%20Utils.js?version=1042360
// @downloadURL https://update.greasyfork.org/scripts/441930/Nitro%20Type%20-%20Racing%20Accuracy%20Alt%20Metric.user.js
// @updateURL https://update.greasyfork.org/scripts/441930/Nitro%20Type%20-%20Racing%20Accuracy%20Alt%20Metric.meta.js
// ==/UserScript==

/* global findReact */

const raceContainer = document.getElementById("raceContainer"),
    reactObj = raceContainer ? findReact(raceContainer) : null
if (!raceContainer || !reactObj) {
    return
}

const style = document.createElement("style")
style.appendChild(
    document.createTextNode(`
.dash-metrics .accuracy-rounded { font-size: 14px }
`)
)
document.head.appendChild(style)

const server = reactObj.server,
    currentUserID = reactObj.props.user.userID

server.on("status", (e) => {
    if (e.status !== "countdown") {
        return
    }

    const lessonLength = e.lessonLength
    if (!lessonLength) {
        return
    }

    const accuracyNode = raceContainer.querySelector(".dash-metrics .list-item:nth-of-type(2) span.h4")
    if (!accuracyNode) {
        return
    }
    accuracyNode.textContent = "100.00"

    const roundedAccuracyNode = document.createElement("div")
    roundedAccuracyNode.innerHTML = `<span class="accuracy-rounded">100</span><span class="tsxs tc-ts ttu mlxxs">%</span>`

    accuracyNode.parentNode.append(roundedAccuracyNode)

    let errors = 0,
        skipped = 0
    const refreshAccuracy = () => {
        const score = (1 - errors / (lessonLength - skipped)) * 100
        accuracyNode.textContent = score.toFixed(2)
        roundedAccuracyNode.children[0].textContent = Math.round(score)
    }

    server.on("update", refreshAccuracy)

    const originalSendPlayerUpdate = server.sendPlayerUpdate
    server.sendPlayerUpdate = (data) => {
        originalSendPlayerUpdate(data)
        let canRefresh = false
        if (typeof data.s === "number") {
            skipped = data.s
            canRefresh = !!errors
        }
        if (typeof data.e === "number") {
            errors = data.e
            canRefresh = true
        }
        if (canRefresh) {
            refreshAccuracy()
        }
    }
})

