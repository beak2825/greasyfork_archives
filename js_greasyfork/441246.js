// ==UserScript==
// @name         Nitro Type - Race Result Enhancements
// @version      0.4.4
// @description  Shows NT Season Points earned and Skipped Characters (Nitros) Used on Race Result screen.
// @author       Toonidy
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @require      https://greasyfork.org/scripts/443718-nitro-type-userscript-utils/code/Nitro%20Type%20Userscript%20Utils.js?version=1042360
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/441246/Nitro%20Type%20-%20Race%20Result%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/441246/Nitro%20Type%20-%20Race%20Result%20Enhancements.meta.js
// ==/UserScript==

/* global createLogger findReact */

const logging = createLogger("Nitro Type Race Result Enhancements")

/////////////
//  Utils  //
/////////////

/** Calculate User's Race score. */
const getUserRaceResult = (user) => {
    const { typed, nitros, skipped, startStamp, completeStamp, errors } = user.progress

    let endStamp = completeStamp || Date.now()

    const wpm = Math.round((typed - skipped) / 5 / ((endStamp - startStamp) / 6e4)),
        accuracy = ((1 - errors / (typed - skipped)) * 100).toFixed(2),
        points = Math.round((100 + wpm / 2) * (1 - errors / (typed - skipped)))

    return { accuracy, points, wpm, nitros, skipped }
}

/** Sort Handler to sort by rank position. */
const sortRacersHandler = (e, t) => {
    // Source: https://www.nitrotype.com/dist/site/js/ra.js
    return e.disqualified && !t.disqualified
        ? 1
        : (t.disqualified && !e.disqualified) || (e.progress.completeStamp && !t.progress.completeStamp)
        ? -1
        : t.progress.completeStamp && !e.progress.completeStamp
        ? 1
        : e.progress.completeStamp && t.progress.completeStamp
        ? e.progress.completeStamp < t.progress.completeStamp
            ? -1
            : 1
        : e.progress.percentageFinished === t.progress.percentageFinished
        ? 0
        : e.progress.percentageFinished > t.progress.percentageFinished
        ? -1
        : 1
}

///////////////////
//  Racing Page  //
///////////////////

const raceContainer = document.getElementById("raceContainer"),
    raceObj = raceContainer ? findReact(raceContainer) : null
if (!raceContainer || !raceObj) {
    logging.error("Init")("Could not find the race track")
    return
}

const server = raceObj.server

/** Mutation obverser to track whether results screen showed up. */
const resultObserver = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        for (const newNode of mutation.addedNodes) {
            if (newNode.classList?.contains("race-results")) {
                observer.disconnect()

                // Setup New Racer Stats Container
                const racers = raceObj.state.racers.slice().sort(sortRacersHandler)

                const dummyCell = document.createElement("div")
                dummyCell.classList.add("split-cell")

                let racerRankNewNodes = []

                const racerRankNodes = newNode.querySelectorAll(".gridTable-row")
                racerRankNodes.forEach((node, i) => {
                    const r = racers[i]

                    const listRow = node.querySelector(".gridTable-cell:nth-of-type(2) .split"),
                        statRow = listRow.querySelector(".split-cell:nth-of-type(2)")

                    // Add in the new stat fields
                    const { points, skipped } = getUserRaceResult(r),
                        accuracyNode = statRow.querySelector(".list .list-item:nth-of-type(2)"),
                        suffixClass = accuracyNode?.querySelector("span")?.className || "tc-ts"

                    const newStatRow = document.createElement("div")
                    newStatRow.className = `${listRow.className} new-stat-row`
                    newStatRow.append(dummyCell.cloneNode(), statRow)
                    listRow.append(dummyCell.cloneNode())

                    listRow.after(newStatRow)

                    const skippedNode = document.createElement("div")
                    skippedNode.classList.add("list-item", "skipped")
                    skippedNode.innerHTML = `${r.robot ? "N/A" : skipped} <span class="${suffixClass}">Skipped</span>`

                    const pointsNode = document.createElement("div")
                    pointsNode.classList.add("list-item", "points")
                    pointsNode.innerHTML = `${r.robot ? "N/A" : points} <span class="${suffixClass}">Points</span>`

                    racerRankNewNodes[i] = [skippedNode, pointsNode]

                    if (!accuracyNode) {
                        if (!node.classList.contains("is-wampus") && !r.disqualified) {
                            logging.warn(`Race Result")("Unable to setup new stats on row ${i}`)
                        }
                        return
                    }
                    accuracyNode.after(skippedNode, pointsNode)
                })

                /* Track new progress updates */
                server.on("update", (e) => {
                    const racers = raceObj.state.racers.slice().sort(sortRacersHandler)
                    racerRankNodes.forEach((node, i) => {
                        const r = racers[i],
                            { points, skipped } = getUserRaceResult(r),
                            [skippedNode, pointsNode] = racerRankNewNodes[i],
                            accuracyNode = node.querySelector(".new-stat-row .list .list-item:nth-of-type(2)")

                        if (r.disqualified || node.classList.contains("is-wampus")) {
                            skippedNode.remove()
                            pointsNode.remove()
                            return
                        }

                        skippedNode.childNodes[0].textContent = `${r.robot ? "N/A" : skipped} `
                        pointsNode.childNodes[0].textContent = `${r.robot ? "N/A" : points} `

                        if (!accuracyNode) {
                            logging.warn(`Race Result")("Unable to insert new stats back into row ${i}`)
                            return
                        }
                        accuracyNode.after(skippedNode, pointsNode)
                    })
                })
                return
            }
        }
    }
})

resultObserver.observe(raceContainer, { childList: true, subtree: true })

logging.info("Init")("Race Result listener has been setup")
