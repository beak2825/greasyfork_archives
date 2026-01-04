	// ==UserScript==
// @name         Season Leaderboard | Nitro Type 
// @version      0.2.1
// @description  Displays the Season Leaderboard along with Last 7 days.
// @author       Nate Dogg
// @match        *://*.nitrotype.com/leaderboards
// @grant        none
// @namespace https://greasyfork.org/users/805959
// @downloadURL https://update.greasyfork.org/scripts/437659/Season%20Leaderboard%20%7C%20Nitro%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/437659/Season%20Leaderboard%20%7C%20Nitro%20Type.meta.js
// ==/UserScript==
 
const leaderboardCard = document.querySelector("main.structure-content section.card"),
	leaderboardTableContainer = leaderboardCard?.querySelector(".well--p"),
	leaderboardObj = leaderboardTableContainer ? findReact(leaderboardTableContainer) : null

if (!leaderboardCard || !leaderboardTableContainer || !leaderboardObj) {
	return
}

const style = document.createElement("style")
style.appendChild(
	document.createTextNode(`
.nt-new-lb { margin-bottom: 1rem }
.nt-new-lb .btn { margin-right: 15px }
`)
)
document.head.appendChild(style)

fetch("https://www.nitrotype.com/api/v2/leaderboards?time=season")
	.then((resp) => resp.json())
	.then((resp) => {
		leaderboardObj.props.leaderboard.points.teams.season = {
			scores: resp.results.scores,
			timeSinceCache: resp.results.timeSinceCache,
		}
		leaderboardCard.querySelector(".split-cell.tar").remove()

		const tabContainer = document.createElement("div")
		tabContainer.classList.add("nt-new-lb")
		tabContainer.innerHTML = `
            <button type="button" class="btn btn--dark btn--outline btn--thin is-active is-frozen" data-tabindex="0">Last 7 Days</button>
            <button type="button" class="btn btn--dark btn--outline btn--thin" data-tabindex="1">Season</button>`
		tabContainer.addEventListener("click", (e) => {
			const target = e.target.closest(".btn")
			if (!target) {
				return
			}
			tabContainer.querySelectorAll(".btn").forEach((elm) => {
				elm.classList.remove("is-active", "is-frozen")
			})
			target.classList.add("is-active")
			leaderboardObj.setState({
				activeDateId: target.dataset.tabindex === "0" ? "weekly" : "season",
			})
		})
		leaderboardTableContainer.prepend(tabContainer)
	})

// Source: https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging/39165137#39165137
function findReact(dom, traverseUp = 0) {
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