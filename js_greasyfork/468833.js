// ==UserScript==
// @name        Add Trakt Button to Letterboxd Film Pages
// @namespace   https://greasyfork.org/en/users/96096-purplepinapples
// @match       https://letterboxd.com/film/*
// @grant       none
// @version     0.1
// @author      -
// @license     MIT
// @description 6/16/2023, 4:53:06 PM
// @downloadURL https://update.greasyfork.org/scripts/468833/Add%20Trakt%20Button%20to%20Letterboxd%20Film%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/468833/Add%20Trakt%20Button%20to%20Letterboxd%20Film%20Pages.meta.js
// ==/UserScript==

(function() {

	// add a button to the page after the tmdb button which links
	// to the corresponding search page on trakt

	// get the tmdb button
	const tmdbButton = document.querySelector('a.micro-button[href*="themoviedb"]')
	if (!tmdbButton) return

	// get ID
	const tmdb_movie_id = tmdbButton.href.match(/\/(\d+)\//)[1]
	console.log(tmdb_movie_id)

	// create the trakt button
	const traktButton = document.createElement('a')
	traktButton.classList.add('micro-button')
	traktButton.href = `https://trakt.tv/search/tmdb/${tmdb_movie_id}?id_type=movie`
	traktButton.innerText = 'Trakt'
	traktButton.style.marginLeft = '2px'

	// add the trakt button after the tmdb button
	tmdbButton.parentNode.insertBefore(traktButton, tmdbButton.nextSibling)
})()