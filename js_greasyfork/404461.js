// ==UserScript==
// @name         Save Every Noise
// @namespace    https://github.com/JZ6
// @version      1.6
// @description  Save and automatically load all the artists you have listend to on http://everynoise.com!
// @author       JZ6
// @match        *://everynoise.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404461/Save%20Every%20Noise.user.js
// @updateURL https://update.greasyfork.org/scripts/404461/Save%20Every%20Noise.meta.js
// ==/UserScript==


const config = {
	entry: loadSavedArtists,
	// entry: saveAllPlayedArtists,
	divUniqueKey: 'textContent',
	lsSavedArtistsKey: `playedArtists`,
	importantKeys: [
		'baseURI',
		'id',
		'innerHTML',
		'innerText',
		'outerText',
		'textContent',
		'title'
	]
}

config.entry()

function loadSavedArtists() {
	const playedArtists = loadPlayedArtists()

	const playedDivs = getAllDivs()
		.map(hookArtistClick)
		.filter(div => playedArtists.hasOwnProperty(div[config.divUniqueKey]))

	playedDivs.forEach(div => div.setAttribute("played", true))

	console.info(`Loaded ${playedDivs.length} artists!`);
}

function hookArtistClick(div) {
	if (div.scan || div.title) {
		div.onclick = () => clickedArtist(div)
		// div.addEventListener("click", () => clickedArtist(div), false)		//Disable multiple click handlers until a work around is found for logic regarding scan current class tag.
	}
	return div
}

function clickedArtist(div) {

	const uniqueID = div[config.divUniqueKey]
	const playedArtists = loadPlayedArtists()

	if (div.hasAttribute('played')) {
		div.removeAttribute('played')
		delete playedArtists[uniqueID]
		console.info(`Removed ${uniqueID}!`);
	} else {
		div.setAttribute('played', true)
		playedArtists[uniqueID] = copyObjectSubSet(div, config.importantKeys)
		console.info(`Added ${uniqueID}!`);
	}

	savePlayedArtists(playedArtists)
}

function loadPlayedArtists() {
	const savedArtistString = localStorage.getItem(config.lsSavedArtistsKey) || '{}'
	// const savedArtistString = GM.getValue(config.lsSavedArtistsKey)
	return JSON.parse(savedArtistString)
}

function savePlayedArtists(playedArtists) {
	const savedArtistString = JSON.stringify(playedArtists)
	// GM.setValue(config.lsSavedArtistsKey, savedArtistString)
	localStorage.setItem(config.lsSavedArtistsKey, savedArtistString)
}

// Manual save
function saveAllPlayedArtists() {

	const playedArtists = {}

	getAllDivs()
		.filter(div => div.hasAttribute("played") && div.title)
		.forEach(div => playedArtists[div[config.divUniqueKey]] = copyObjectSubSet(div, config.importantKeys))

	savePlayedArtists(playedArtists)

}

function getAllDivs() {
	return [...document.getElementsByTagName("div")]
}

function copyObjectSubSet(obj, keys) {
	const result = {}
	keys.forEach(key => result[key] = obj[key])
	return result
}