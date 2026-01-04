// ==UserScript==
// @name         	Auto-select preferred Hoster | aniworld.to & s.to
// @name:de			Automatische Auswahl des bevorzugten Hosters | aniworld.to & s.to
// @namespace    	https://greasyfork.org/users/928242
// @version      	2.1
// @description  	Automatically opens the stream on your preferred hoster by order.
// @description:de	Öffnet automatisch den Stream auf Ihrem bevorzugten Hoster nach Reihenfolge.
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @icon         	https://www.google.com/s2/favicons?sz=64&domain=aniworld.to
// @match        	https://s.to/serie/stream/*
// @match        	https://serien.sx/serie/stream/*
// @match        	https://anicloud.io/anime/stream/*
// @match        	https://aniworld.to/anime/stream/*
// @require         https://greasyfork.org/scripts/455253-kamikaze-script-utils/code/Kamikaze'%20Script%20Utils.js
// @grant        	none
// @license      	MIT
// @downloadURL https://update.greasyfork.org/scripts/452020/Auto-select%20preferred%20Hoster%20%7C%20aniworldto%20%20sto.user.js
// @updateURL https://update.greasyfork.org/scripts/452020/Auto-select%20preferred%20Hoster%20%7C%20aniworldto%20%20sto.meta.js
// ==/UserScript==



// Example Hosters:
// ['VOE', 'Doodstream', 'Streamtape', 'Vidoza']
// Define your hosters in your preferred order
const hosterOrder = [ 'Vidoza', 'VOE', 'Streamtape'];


/*** DO NOT CHANGE BELOW ***/


/* global Logger getStreamData waitForElm */

const log = new Logger("Auto-select Hoster");

let streamData = null;

const availableHosters = [];

(async () => {

	streamData = await getStreamData()

	const iframe = await getVideoIframe()
	iframe.src = ""

	if (!iframe) return

	log.debug("Iframe found:", iframe)

	await getHosterList()

	if (availableHosters.length < 0) return

	log.debug("Hosters found:", availableHosters)

	const hoster = findFavHosterByOrder()

	if (!hoster) return

	log.info("Loading Hoster:", hoster)

	iframe.src = "/redirect/" + hoster.id

})();



async function getHosterList() {
	const hosterListEl = await waitForElm(".hosterSiteVideo > ul")
	const hosterArray = Array.from(hosterListEl.children)

	for ( const host of hosterArray ) {

		if (!isAvailable(host)) continue;

		let name = await waitForElm("h4", host)
		name = name.innerText
		const id = host.getAttribute("data-link-id")

		availableHosters.push({
			name: name,
			id: id,
		})
	}

}

function isAvailable(host) {
	return host.style.display !== "none"
}

function findFavHosterByOrder() {
	let hoster = false

	for (let favHost of hosterOrder) {
		hoster = availableHosters.find( (avHost) => avHost.name === favHost )

		if (hoster) break;

	}

	if (!hoster) {
		log.error("Fav. Hoster not found. Choosing first available Hoster")
		hoster = availableHosters[0]
	}

	return hoster
}

async function getVideoIframe() {
	return await waitForElm(".inSiteWebStream iframe")
}