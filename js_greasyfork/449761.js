// ==UserScript==
// @name         Nitro Type - Race Analysis
// @version      0.1.0.WIP2
// @description  Recording some races through server data.
// @author       Toonidy
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.1/dexie.min.js#sha512-ybuxSW2YL5rQG/JjACOUKLiosgV80VUfJWs4dOpmSWZEGwdfdsy2ldvDSQ806dDXGmg9j/csNycIbqsrcqW6tQ==
// @require      https://greasyfork.org/scripts/443718-nitro-type-userscript-utils/code/Nitro%20Type%20Userscript%20Utils.js?version=1042360// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/449761/Nitro%20Type%20-%20Race%20Analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/449761/Nitro%20Type%20-%20Race%20Analysis.meta.js
// ==/UserScript==

/* global Dexie createLogger findReact */

const logging = createLogger("Nitro Type Race Analysis")

/* Config storage */
const db = new Dexie("NTRaceAnalysis")
db.version(1).stores({
    raceLogs: "id",
})
db.open().catch(function (e) {
    logging.error("Init")("Failed to open up the racing analysis database", e)
})

///////////////
//  Backend  //
///////////////

const raceContainer = document.getElementById("raceContainer"),
	reactObj = raceContainer ? findReact(raceContainer) : null
if (!raceContainer || !reactObj) {
	logging.error("Init")("Could not find the race track")
	return
}

const server = reactObj.server

let raceLogs = [],
    raceID = null

/** Mutation observer to track whether last letter was typed (just finished race). */
const lastLetterObserver = new MutationObserver(([mutation], observer) => {
    if (mutation.target.classList.contains("is-correct")) {
        observer.disconnect()
        db.raceLogs.put({
            id: raceID,
            raceLogs,
        }).then(() => {
            logging.info("Finished")("Race Logs recorded")
        })
    }
})

/* Setup finish race observer. */
server.on("setup", (e) => {
    raceID = e.id
})

/* Setup finish race observer. */
server.on("status", (e) => {
    if (e.status === "racing") {
        const lastLetter = raceContainer.querySelector(
            ".dash-copy .dash-word:last-of-type .dash-letter:nth-last-of-type(2)"
        )
        if (lastLetter) {
            lastLetterObserver.observe(lastLetter, { attributes: true })
        } else {
            logging.error("Init")("Unable to setup finish race tracker")
        }
    }
})

/* Update Ghost Cursor. */
server.on("update", (e) => {
    let entry = []
	reactObj.state.racers.forEach((r) => {
        const { typed, errors, skipped, percentageFinished, startStamp } = r.progress
        entry = entry.concat({ userID: r.userID, typed, errors, skipped, percentageFinished, startStamp, secs: e.secs })
	})
    raceLogs = raceLogs.concat([entry])
})
