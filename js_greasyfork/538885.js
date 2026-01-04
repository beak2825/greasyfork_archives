// ==UserScript==
// @name         Guess Preview (GeoGuessr)
// @namespace    rawblocky
// @version      2025.06.10
// @description  Preview your GeoGuessr guess before placing it!
// @author       Rawblocky
// @match        *://*.geoguessr.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        window.onurlchange
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538885/Guess%20Preview%20%28GeoGuessr%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538885/Guess%20Preview%20%28GeoGuessr%29.meta.js
// ==/UserScript==

// Credit to Alien Perfect's original Guess Peek

const SETTINGS = {
	SEARCH_RADIUS: 50000,
	PREVIEW_SIZE_WIDTH: "30%",
	PREVIEW_SIZE_HEIGHT: "25%",
	EMBED_ON_HOVER: true,
	ENLARGE_ON_HOVER: true,
	HOVER_WIDTH: "70%",
	HOVER_HEIGHT: "70%",
};
const KEYBINDINGS = {
	TOGGLE_PREVIEW: "x",
};

GM_addStyle(`
	.guess-preview-button {
	position: absolute;
	bottom: 0;
	left: 0;
	width: ${SETTINGS.PREVIEW_SIZE_WIDTH};
	height: ${SETTINGS.PREVIEW_SIZE_HEIGHT};
	z-index: 10;
	user-select: none;
}
	.guess-preview-button:hover {
	width: ${
		(SETTINGS.ENLARGE_ON_HOVER && SETTINGS.HOVER_WIDTH) ||
		SETTINGS.PREVIEW_SIZE_WIDTH
	};
	height: ${
		(SETTINGS.ENLARGE_ON_HOVER && SETTINGS.HOVER_HEIGHT) ||
		SETTINGS.PREVIEW_SIZE_HEIGHT
	};
}
`);

let isPreviewEnabled = GM_getValue("isPreviewEnabled") || true;

let svs;

let latestCoords;

function initSVS() {
	svs = new unsafeWindow.google.maps.StreetViewService();
}

function convertDistance(distance) {
	if (distance >= 1000) return (distance / 1000).toFixed(1) + " km";
	return distance.toFixed(1) + " m";
}

function computeDistanceBetween(coords1, coords2) {
	return unsafeWindow.google.maps.geometry.spherical.computeDistanceBetween(
		coords1,
		coords2
	);
}

function getStreetViewUrl(panoId) {
	return `https://www.google.com/maps/@?api=1&map_action=pano&pano=${panoId}`;
}

async function getNearestPano(coords) {
	let pano = {};
	let panorama, oldRadius;
	let radius = SETTINGS.SEARCH_RADIUS;
	if (!svs) initSVS();

	while (true) {
		try {
			panorama = await svs.getPanorama({
				location: coords,
				radius: radius,
				source: "outdoor",
				preference: "nearest",
			});
			let roadHeading = 0;
			if (panorama.data.tiles && panorama.data.tiles.centerHeading) {
				roadHeading = panorama.data.tiles.centerHeading;
			}

			radius = computeDistanceBetween(coords, panorama.data.location.latLng);
			pano.radius = radius;
			pano.url =
				getStreetViewUrl(panorama.data.location.pano) +
				`&heading=${roadHeading}`;
			pano.image = `https://streetviewpixels-pa.googleapis.com/v1/thumbnail?w=640&h=360&panoid=${panorama.data.location.pano}&yaw=${roadHeading}&cb_client=maps_sv.share&thumbfov=120`;
			pano.streetViewEmbed = `https://www.google.com/maps/embed?pb=!4v1749491810223!6m8!1m7!1s${panorama.data.location.pano}!2m2!1d-16.36128053634264!2d-44.39690412269235!3f${roadHeading}!4f0!5f0.4000000000000002`;

			if (oldRadius && radius >= oldRadius) break;
			oldRadius = radius;
		} catch (e) {
			break;
		}
	}

	return pano;
}

function removeImage() {
	const container = document.querySelector(
		'[class^="guess-map_canvasContainer__"]'
	);

	if (container) {
		const button = container.querySelector(".guess-preview-button");
		if (button) {
			container.removeChild(button);
		}
	}
}

function getIsClassicGame() {
	const currentUrl = window.location.href;
	return (
		currentUrl.includes("geoguessr.com/game/") ||
		currentUrl.includes("geoguessr.com/challenge/")
	);
}

function getImage() {
	if (!getIsClassicGame()) {
		latestCoords = null;
		return removeImage();
	}
	const container = document.querySelector(
		'[class^="guess-map_canvasContainer__"]'
	);

	if (container) {
		let button = container.querySelector(".guess-preview-button");
		if (!button) {
			button = document.createElement("a");
			button.className = "guess-preview-button";
			button.target = "_blank";
			button.style.zIndex = 10;

			let img = document.createElement("img");
			img.className = "guess-preview";
			img.style.width = "100%";
			img.style.height = "100%";
			img.style.zIndex = 10;
			img.style.position = "absolute";
			img.style.objectFit = "cover";

			button.appendChild(img);
			container.appendChild(button);

			button.addEventListener("mouseenter", () => {
				if (SETTINGS.ENLARGE_ON_HOVER && !SETTINGS.EMBED_ON_HOVER) {
					// Make image higher resolution
					img.src = img.src.replace("?w=640&h=360", "?w=1024&h=576");
				}

				if (
					SETTINGS.EMBED_ON_HOVER &&
					!button.querySelector(".guess-preview-sv-embed")
				) {
					const wrapper = document.createElement("div");
					wrapper.className = "guess-preview-sv-embed";
					wrapper.style.width = "100%";
					wrapper.style.height = "100%";
					wrapper.style.position = "absolute";
					wrapper.style.zIndex = 11;

					iframe = document.createElement("iframe");
					iframe.style.position = "absolute";
					iframe.style.width = "100%";
					iframe.style.height = "100%";
					iframe.style.border = "0";
					iframe.allowFullscreen = true;
					iframe.loading = "lazy";
					iframe.referrerPolicy = "no-referrer-when-downgrade";
					iframe.style.zIndex = 12;
					iframe.src = img.getAttribute("sv-embed");
					// img.style.display = "none";

					wrapper.appendChild(iframe);
					button.appendChild(wrapper);
				}
			});
		}

		return [button.querySelector(".guess-preview"), button];
	} else {
		return null;
	}
}

const originalFetch = unsafeWindow.fetch;
let lastRanEpoch = 0;

document.addEventListener("keydown", (input) => {
	const key = input.key;
	if (
		key == KEYBINDINGS.TOGGLE_PREVIEW.toLowerCase() ||
		key == KEYBINDINGS.TOGGLE_PREVIEW
	) {
		isPreviewEnabled = !isPreviewEnabled;
		GM_setValue("isPreviewEnabled", isPreviewEnabled);
		if (!isPreviewEnabled) {
			removeImage();
		} else if (latestCoords != null) {
			setPanoFromCoords(latestCoords);
		}
	}
});

async function setPanoFromCoords(coords) {
	if (!isPreviewEnabled) {
		return removeImage();
	}
	let imgInfo = getImage();
	if (!imgInfo || !imgInfo[0] || !imgInfo[1]) {
		return;
	}
	let img = imgInfo[0];
	let button = imgInfo[1];
	let locationInfo = await getNearestPano(coords);
	if (!locationInfo || !locationInfo.image) {
		button.style.display = "none";
		return;
	}
	button.style.display = "block";
	img.style.display = "block";
	img.src = locationInfo.image;
	button.href = locationInfo.url;
	img.setAttribute("sv-embed", locationInfo.streetViewEmbed);
	const svEmbed = button.querySelector(".guess-preview-sv-embed");
	if (svEmbed) {
		button.removeChild(svEmbed);
	}
}

async function onFetch(args) {
	if (!getIsClassicGame()) {
		latestCoords = null;
		removeImage();
		return;
	}

	// Cooldown
	const currentEpoch = Date.now();
	const timeBeforeLastEpoch = currentEpoch - lastRanEpoch;
	lastRanEpoch = currentEpoch;

	if (timeBeforeLastEpoch < 250) {
		await new Promise((resolve) =>
			setTimeout(resolve, timeBeforeLastEpoch + 100)
		);
	}
	if (currentEpoch !== lastRanEpoch) {
		return;
	}

	// Whenever the terrain api gets called, it'll send the coords with it (probably used by Geo to decide to either play the water/plonk SFX)
	// We'll use that to display the current location
	if (
		args[0] === "https://www.geoguessr.com/api/v4/geo-coding/terrain" &&
		args[1]?.method === "POST"
	) {
		const requestBody = args[1]?.body;

		if (requestBody) {
			try {
				const jsonBody = JSON.parse(requestBody);
				latestCoords = jsonBody;
				setPanoFromCoords(jsonBody);
			} catch (e) {
				console.error("Failed to parse JSON body:", e);
			}
		}
	}
}

unsafeWindow.fetch = async function (...args) {
	Promise.resolve().then(() => onFetch(args));

	const response = await originalFetch.apply(this, args);

	return response;
};
