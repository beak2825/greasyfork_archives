// ==UserScript==
// @name         Nitro Type - Raid Friend Race
// @version      0.1.0
// @description  Displays a button to race any discovered Friend Races after doing a Normal Race.
// @author       Toonidy
// @match        *://*.nitrotype.com/race
// @icon         data:image/png;base64,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
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/442793/Nitro%20Type%20-%20Raid%20Friend%20Race.user.js
// @updateURL https://update.greasyfork.org/scripts/442793/Nitro%20Type%20-%20Raid%20Friend%20Race.meta.js
// ==/UserScript==

/////////////
//  Utils  //
/////////////

/** Finds the React Component from given dom. */
const findReact = (dom, traverseUp = 0) => {
	const key = Object.keys(dom).find((key) => key.startsWith("__reactFiber$"))
	const domFiber = dom[key]
	if (domFiber == null) return null
	const getCompFiber = (fiber) => {
		let parentFiber = fiber?.return
		while (typeof parentFiber?.type == "string") {
			parentFiber = parentFiber?.return
		}
		return parentFiber
	}
	let compFiber = getCompFiber(domFiber)
	for (let i = 0; i < traverseUp && compFiber; i++) {
		compFiber = getCompFiber(compFiber)
	}
	return compFiber?.stateNode
}

/** Console logging with some prefixing. */
const logging = (() => {
	const logPrefix = (prefix = "") => {
		const formatMessage = `%c[Nitro Type Raid Friend Race]${prefix ? `%c[${prefix}]` : ""}`
		let args = [console, `${formatMessage}%c`, "background-color: #D62F3A; color: #fff; font-weight: bold"]
		if (prefix) {
			args = args.concat("background-color: #4f505e; color: #fff; font-weight: bold")
		}
		return args.concat("color: unset")
	}
	return {
		info: (prefix) => Function.prototype.bind.apply(console.info, logPrefix(prefix)),
		warn: (prefix) => Function.prototype.bind.apply(console.warn, logPrefix(prefix)),
		error: (prefix) => Function.prototype.bind.apply(console.error, logPrefix(prefix)),
		log: (prefix) => Function.prototype.bind.apply(console.log, logPrefix(prefix)),
		debug: (prefix) => Function.prototype.bind.apply(console.debug, logPrefix(prefix)),
	}
})()

////////////
//  Main  //
////////////

const raceContainer = document.getElementById("raceContainer"),
	raceObj = raceContainer ? findReact(raceContainer) : null,
	server = raceObj?.server
if (!raceContainer || !raceObj) {
	logging.error("Init")("Could not find the race track")
	return
}

let trackLeader = null

/** Styles for the following components. */
const style = document.createElement("style")
style.appendChild(
	document.createTextNode(`
.nt-raid-friend-race-result-main-container {
	display: grid;
	grid-template-rows: 1fr 1fr;
	gap: 5px;
}
.nt-raid-friend-race-result-secondary-container {
	padding-right: 20px;
}
.nt-raid-friend-race-button {
	padding: 0;
}
`)
)
document.head.appendChild(style)

/** Mutation Observer to track whether Race Results are displayed. */
const resultObserver = new MutationObserver(([mutation], observer) => {
    for (const newNode of mutation.addedNodes) {
        if (newNode.classList.contains("race-results")) {
            observer.disconnect()

            if (trackLeader === null) {
                logging.warn("Finish")("No friend race links discovered (this observer shouldn't be used)")
                return
            }

            const raidButtonTemplate = document.createElement("a")
            raidButtonTemplate.classList.add("btn", "btn--secondary", "btn--fw")
            raidButtonTemplate.href = `/race/${trackLeader}`
            raidButtonTemplate.innerHTML = `<svg class="icon icon-friends btn-icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/dist/site/images/icons/icons.css.svg#icon-friends"></use></svg>Friend Race`

            // Main Race Results
            ;((trackLeader, raidButtonPrimary) => {
                const buttonContainer = newNode.querySelector(".raceResults-footer > .g > .g-b.g-b--3of12"),
                      raceAgainButton = buttonContainer?.querySelector(".btn")
                if (!buttonContainer || !raceAgainButton) {
                    logging.error("Finish")("Unable to find Race Again button (primary)", { buttonContainer, raceAgainButton })
                    return
                }

                buttonContainer.classList.add("nt-raid-friend-race-result-main-container")
                raidButtonPrimary.classList.add("btn--xs", "nt-raid-friend-race-button")
                raceAgainButton.classList.remove("dhf")
                raceAgainButton.classList.add("btn--xs", "nt-raid-friend-race-button")
                raceAgainButton.after(raidButtonPrimary)
            })(trackLeader, raidButtonTemplate.cloneNode(true))


            // Minimized Race Results
            ;((trackLeader, raidButtonSecondary) => {
                const buttonContainer = newNode.querySelector(".raceResults-mini .split .split-cell:nth-of-type(2)")
                if (!buttonContainer) {
                    logging.error("Finish")("Unable to find Race Again button (secondary)", { buttonContainer })
                    return
                }

                const raidRaceSecondaryButtonContainer = document.createElement("div")
                raidRaceSecondaryButtonContainer.classList.add("split-cell")
                raidRaceSecondaryButtonContainer.append(raidButtonSecondary)

                buttonContainer.classList.add("nt-raid-friend-race-result-secondary-container")
                buttonContainer.after(raidRaceSecondaryButtonContainer)
            })(trackLeader, raidButtonTemplate.cloneNode(true))

            logging.info("Finish")("Result Page updated with Raid Friend Race button.")
            break
        }
    }
})

/** Check whether race setup data contains friend race information. */
server.on("setup", (e) => {
    if (typeof e.trackLeader !== "string" || !e.trackLeader) {
        return
    }
    trackLeader = e.trackLeader
    resultObserver.observe(raceContainer, { childList: true })
    logging.info("Init")(`Friend Race discovered (https://www.nitrotype.com/race/${e.trackLeader}`)
})
