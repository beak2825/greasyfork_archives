// ==UserScript==
// @name         Race Result Points Nitro Type
// @version      0.1.1
// @description  Shows Points earned from the race.
// @author       Nate Dogg
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @icon         data:image/png;base64,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
// @grant        none
// @namespace https://greasyfork.org/users/805959
// @downloadURL https://update.greasyfork.org/scripts/437703/Race%20Result%20Points%20Nitro%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/437703/Race%20Result%20Points%20Nitro%20Type.meta.js
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
		const formatMessage = `%c[Nitro Type Race Result Points]${prefix ? `%c[${prefix}]` : ""}`
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

/////////////
//  Utils  //
/////////////

const raceContainer = document.getElementById("raceContainer"),
	raceObj = raceContainer ? findReact(raceContainer) : null
if (!raceContainer || !raceObj) {
	logging.error("Init")("Could not find the race track")
	return
}

const currentUserID = raceObj.props.user.userID

/** Mutation obverser to track whether results screen showed up. */
const resultObserver = new MutationObserver(([mutation], observer) => {
	for (const newNode of mutation.addedNodes) {
		if (newNode.classList.contains("race-results")) {
			observer.disconnect()

			const currentUserResult = raceObj.state.racers.find((r) => r.userID === currentUserID)
			if (!currentUserResult || !currentUserResult.progress || typeof currentUserResult.place === "undefined") {
				logging.warn("Finish")("Unable to find race results")
				return
			}

			const listItemTarget = document.querySelector(
				"#raceContainer .gridTable-row.is-self .list .list-item:last-of-type"
			)
			if (!listItemTarget) {
				logging.warn("Finish")("Unable to update user's race result")
				return
			}

			const { typed, skipped, startStamp, completeStamp, errors } = currentUserResult.progress,
				wpm = Math.round((typed - skipped) / 5 / ((completeStamp - startStamp) / 6e4)),
				acc = ((1 - errors / (typed - skipped)) * 100).toFixed(2),
				points = Math.round((100 + wpm / 2) * (1 - errors / typed))

			const listContainer = listItemTarget.parentNode,
				listItemPoints = document.createElement("div")

			listItemPoints.classList.add("list-item")
			listItemPoints.innerHTML = `${points} <span class="${
				listItemTarget.querySelector("span")?.className || "tc-ts"
			}">Points</span>`
			listContainer.insertBefore(listItemPoints, listItemTarget)

			logging.info("Finish")(`Points collected ${points}`)
			break
		}
	}
})

resultObserver.observe(raceContainer, { childList: true })

logging.info("Init")("Race Result listener has been setup")
