// ==UserScript==
// @name         Nitro Type - Team Member Banned Label
// @version      0.3.0
// @description  Displays "BANNED" or "WARNED" next to the player with either status.
// @author       Toonidy
// @match        *://*.nitrotype.com/team/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @require      https://greasyfork.org/scripts/443718-nitro-type-userscript-utils/code/Nitro%20Type%20Userscript%20Utils.js?version=1042360
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @downloadURL https://update.greasyfork.org/scripts/441767/Nitro%20Type%20-%20Team%20Member%20Banned%20Label.user.js
// @updateURL https://update.greasyfork.org/scripts/441767/Nitro%20Type%20-%20Team%20Member%20Banned%20Label.meta.js
// ==/UserScript==

/* global findReact */

const teamPageObserver = new MutationObserver(() => {
	const root = document.querySelector("#root section.card"),
		reactObj = root ? findReact(root) : null
	if (!root || !reactObj) {
		return
	}

	teamPageObserver.disconnect()

	const { members } = reactObj.props

	document
		.querySelectorAll("#root td.table-cell--racer div.bucket-content div.prxxs:last-of-type")
		.forEach((node, i) => {
			if (["banned", "warned"].includes(members[i].status)) {
				const bannedNode = document.createElement("div")
				bannedNode.classList.add("prxxs")
				bannedNode.textContent = members[i].status.toLocaleUpperCase()

				node.after(bannedNode)

				if (reactObj.props.info.userID === members[i].userID) {
					console.log(members[i].userID, reactObj.props.info.userID)
					const teamCaptainNode = root.querySelector(".card-cap div.tsm.tbs span.tsxs")
					if (!teamCaptainNode) {
						console.error("Unable to apply negative label on team captain")
						return
					}
					teamCaptainNode.textContent = `${members[i].status[0].toLocaleUpperCase()}${members[i].status[0].slice(1).toLocaleLowerCase()} Team Captain`
				}
			}
		})
})

teamPageObserver.observe(document.querySelector("#root main.structure-content"), { childList: true })
