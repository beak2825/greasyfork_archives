// ==UserScript==
// @name         theCrag - Dashboard - Add areas to route tick items
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Adds a route's area & 4 areas before to tick items in the stream
// @author       killakalle (fork by Jaro)
// @match        https://www.thecrag.com/
// @match        https://www.thecrag.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=thecrag.com
// require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require 	 https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484372/theCrag%20-%20Dashboard%20-%20Add%20areas%20to%20route%20tick%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/484372/theCrag%20-%20Dashboard%20-%20Add%20areas%20to%20route%20tick%20items.meta.js
// ==/UserScript==

// Use waitForKeyElements for tick items
waitForKeyElements('.tick-item', addAreaToRoute);

// Returns the last area from a title string
function getLastArea(title) {
    const separator = '›';
    const lastIndex = title.lastIndexOf(separator);
    return title.substring(lastIndex + 1).trim();
}

function addAreaToRoute(jNode) {
    console.log('theCrag - Adding area to route');

    let route = jNode.find('.route');
    let routeLink = route.find('a');

    // Check if the title attribute is defined
    const routeLinkTitle = routeLink.attr('title');
    if (routeLinkTitle === undefined) {
        console.log('Title attribute is undefined. Skipping.');
        return;
    }

    const routeLinkText = routeLink.text();

    // Split the areas by the separator '›', remove any leading/trailing whitespace, and add visible space before '>'
    const areas = routeLinkTitle.split('›').map(area => area.trim()).filter(area => area !== '').map((area, index, array) => (index !== array.length - 1) ? area : area);

    // Extract the last four areas in the hierarchy before the displayed area
    const lastThreeAreas = areas.slice(-4).join(' › ');

    let stars = 0;
    if (routeLinkText.lastIndexOf('★') >= 0) {
        stars = routeLinkText.lastIndexOf('★') - routeLinkText.indexOf('★') + 1;
    }

    routeLink.empty();
    routeLink.append(document.createTextNode(lastThreeAreas + '› '));

    for (let i = 0; i < stars; i++) {
        let starSpan = document.createElement('span');
        starSpan.classList.add('star');
        routeLink.append(starSpan);
    }

    routeLink.append(document.createTextNode(routeLinkText.replaceAll('★', '')));
}
