// ==UserScript==
// @name         theCrag - Dashboard - Add areas to route tick items
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a route's area to tick items in the stream
// @author       killakalle
// @match        https://www.thecrag.com/
// @match        https://www.thecrag.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=thecrag.com
// require       https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require 	 https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429706/theCrag%20-%20Dashboard%20-%20Add%20areas%20to%20route%20tick%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/429706/theCrag%20-%20Dashboard%20-%20Add%20areas%20to%20route%20tick%20items.meta.js
// ==/UserScript==

waitForKeyElements('.tick-item', addAreaToRoute)

// Returns the last area from a title string
function getLastArea(title) {
	const separator = '›'
	const lastIndex = title.lastIndexOf(separator)
	return title.substring(lastIndex + 1)
}

function addAreaToRoute(jNode) {
	console.log('theCrag - Adding area to route')

	let route = jNode.find('.route')
	let routeLink = route.find('a')
	const routeLinkTitle = routeLink.attr('title')
	const routeLinkText = routeLink.text()
	const lastArea = getLastArea(routeLinkTitle)
	let stars = 0
	if (routeLinkText.lastIndexOf('★') >= 0) {
		stars = routeLinkText.lastIndexOf('★') - routeLinkText.indexOf('★') + 1
	}
	routeLink.empty()
	routeLink.append(document.createTextNode(lastArea + '› '))
	for (let i = 0; i < stars; i++) {
		let starSpan = document.createElement('span')
		starSpan.classList.add('star')
		routeLink.append(starSpan)
	}
	routeLink.append(document.createTextNode(routeLinkText.replaceAll('★', '')))
}
