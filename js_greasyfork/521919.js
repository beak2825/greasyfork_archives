// ==UserScript==
// @name         Reddit Retractable Sidebar
// @namespace    https://greasyfork.org/users/581142
// @namespace    https://github.com/brian6932/reddit-retractable-sidebar
// @version      0.5.7
// @description  Make Reddit's Sidebar Retractable
// @author       brian6932
// @include      /^https?:\/{2}(?:[^.]+\.)?reddit\.com\/(?!submit$)/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521919/Reddit%20Retractable%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/521919/Reddit%20Retractable%20Sidebar.meta.js
// ==/UserScript==
// jshint esversion: 11

'use strict'
if (globalThis.$.name === "jQuery") {
	globalThis.document.head.innerHTML += "<link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet' type='text/css'>"

	const
		dark = globalThis.matchMedia("(prefers-color-scheme:dark)").matches,
		style = `
			<style>
				#sidebar-button {
					background: ${dark ? "#292929" : "#1A1A1A"};
					color: ${dark ? "#CEE3F8" : "#212121"};
					display: ${globalThis.localStorage.getItem("noButton") !== "1" ? "flex" : "none"};
					justify-content: center;
					align-items: center;
					height: 42px;
					width: 42px;
					font-size: 32px;
					border-radius: 100px;
					box-shadow: 0px 3px 5px 0px rgba(33,33,33,0.3);
					position: fixed;
					top: 50%;
					right: -7px;
					cursor: pointer;
					z-index: 9983
				}
			</style>
			`,
		leftIcon = '<i class="material-icons">chevron_left</i>' + style,
		rightIcon = '<i class="material-icons">chevron_right</i>' + style,
		content = globalThis.document.querySelector("html"),
		sidebarButton = globalThis.document.createElement("div"),
		sidebar = globalThis.document.querySelector("div.side"),
		score = globalThis.document.createElement("span"),
		voteTotal = globalThis.document.querySelector(".linkinfo span.totalvotes"),
		lsKey = "sidebarRetracted",
		input = new Set()
			.add("INPUT")
			.add("TEXTAREA")
	sidebarButton.id = "sidebar-button"

	/**************************
	Add vote information below link so that when
	the sidebar is hidden you can still see what vote
	percentage and total votes you have.
	***************************/
	let votePercentage = globalThis.document.querySelector(".score")?.lastChild.textContent
	if (votePercentage !== undefined && votePercentage.at(-1) === ")") {
		// value typically looks like " (int% upvoted)"
		votePercentage = votePercentage.slice(2, -1)
		score.innerHTML = voteTotal === null
			? votePercentage + ", "
			: votePercentage + " out of " + voteTotal.textContent + " total, "
		globalThis.document.querySelector("#siteTable .tagline").prepend(score)
	}

	/**************************
	Some style changes to fix the way certain templates
	render with this script.
	***************************/
	globalThis.document.body.style.cssText += "@media(max-width:850px){div#siteTable{max-width:100vw}}"

	/*****************************
	Functions for hiding and showing the sidebar
	****************************/
	const
		sidebarToggle = [
			// show
			() => {
				sidebar.style.display = "block"
				sidebarButton.innerHTML = rightIcon
				globalThis.localStorage.setItem(lsKey, "0")
			},
			// hide
			() => {
				sidebar.style.display = "none"
				sidebarButton.innerHTML = leftIcon
				globalThis.localStorage.setItem(lsKey, "1")
			}
		],
		onclick = () => sidebarToggle[globalThis.localStorage.getItem(lsKey) ^ 1]()

	sidebarButton.addEventListener("click", onclick)
	sidebarToggle[globalThis.localStorage.getItem(lsKey) & 1]()
	globalThis.document.body.appendChild(sidebarButton)

	/*******************************
	Causes the sidebar to retract when you press "q"
	********************************/
	globalThis.document.body.addEventListener("keydown", e => {
		if (!input.has(e.target.tagName) && e.key === "q")
			onclick()
	})
}
else
	globalThis.console.error("This script only supports Old Reddit")
