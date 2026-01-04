// ==UserScript==
// @name         Nitro Type - Friend Race Highest Avg Player (for Nate Dogg)
// @version      0.2.2
// @description  Displays highest avg wpm player on friend race track (only for hosts).
// @author       Toonidy
// @match        *://*.nitrotype.com/race/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/441793/Nitro%20Type%20-%20Friend%20Race%20Highest%20Avg%20Player%20%28for%20Nate%20Dogg%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441793/Nitro%20Type%20-%20Friend%20Race%20Highest%20Avg%20Player%20%28for%20Nate%20Dogg%29.meta.js
// ==/UserScript==

// THIS SCRIPT REQUIRES https://greasyfork.org/en/scripts/437667-nitro-type-race-stats-v2

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

///////////////
//  Backend  //
///////////////

const root = document.getElementById("raceContainer"),
      reactObj = root ? findReact(root) : null
if (!root || !reactObj) {
    console.error("Unable to find race track")
    return
}

const server = reactObj.server,
      textNode = document.createTextNode("　|　 Friend Race Highest Avg WPM: "),
      valueNode = document.createElement("b")
valueNode.textContent = "N/A"

const updateHighestAvgWPM = () => {
    if (reactObj.state.racers.length === 0) {
        return
    }

    let fastestSpeed = null
    reactObj.state.racers.forEach((r) => {
        if (!r.robot && (fastestSpeed === null || fastestSpeed < r.profile.avgSpeed)) {
            fastestSpeed = r.profile.avgSpeed
        }
    })
    if (fastestSpeed === null) {
        console.error("Unable to find fastest speed")
        return
    }

    const fastestRacers = reactObj.state.racers.filter((r) => r.profile.avgSpeed === fastestSpeed).map((r) => `${r.profile.membership === "gold" ? `<img class="icon icon-nt-gold-s" src="/dist/site/images/themes/profiles/gold/nt-gold-icon-xl.png" alt="Nitro Gold" style="display: inline; vertical-align: middle">` : ""}${r.profile.tag ? `<span style="color: #${r.profile.tagColor}">[${r.profile.tag}]</span> ` : ""}<span style="${r.profile.membership === "gold" ? "color: #E0BB2F;" : ""}">${r.profile.displayName || r.profile.username}</span>`)

    valueNode.innerHTML = `${fastestSpeed} <span style="font-size: 12px">(${fastestRacers.join(", ")})</span>`
}

server.on("setup", (e) => {
    if (e.trackLeader && e.trackLeader === reactObj.props.user.username) {
        server.on("joined", updateHighestAvgWPM)
        server.on("left", updateHighestAvgWPM)
    }
})

/////////////
//  Final  //
/////////////

const statObserver = new MutationObserver(([m]) => {
    for (const newNode of m.addedNodes) {
        if (newNode.classList?.contains("experiment")) {
            newNode.append(textNode, valueNode)
            return
        }
    }
})

statObserver.observe(root, { childList: true })
