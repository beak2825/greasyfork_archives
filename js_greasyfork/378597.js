// ==UserScript==
// @name          Google Maps Coordinates Grabber
// @version       0.3.2
// @description   Once in Google Maps, click on the map (Do not click on markers) a popup should show at the bottom with the place and the coordinates displayed in the last line. If everything works as expected you should see a line of text on top of the map with the confirmation of the coordinates been copied to clipboard. Press Control + Shift + L while on streetview to get the coordinates from the URL. (Doesn't work on Firefox)
// @author        MrMike
// @namespace     https://greasyfork.org/en/users/250979-mrmike
// @include       https://*google*/maps/*
// @grant         none
// @run-at        document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/378597/Google%20Maps%20Coordinates%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/378597/Google%20Maps%20Coordinates%20Grabber.meta.js
// ==/UserScript==

// Leave empty to get just the values separated by a comma
// {{lat}} will be replaced with the latitude value and {{lng}} with the longitude value
// Examples: const FORMAT = `"lat": {{lat}}, "lng": {{lng}}`
// Examples: const FORMAT = ``
// const FORMAT = `{ "lat": {{lat}}, "lng": {{lng}} }`;
const FORMAT = `"lat": {{lat}}, "lng": {{lng}}`;

let theCopiedCoords;
let theCoords;
let theLatLng;
let theLat;
let theLng;
let tempCard;
let timer = null;

document.addEventListener("keypress", (event) => {
	if (event.code == "KeyL" && event.ctrlKey && event.shiftKey && !event.altKey && !event.repeat) {
		copyCoordinates();
	}
});

function doTimer() {
	let timer = setInterval(() => {
		const PIN = document.querySelector("[jsaction='titlecard.exit']");
		if (PIN && !document.querySelector("#my-copy")) {
			const COPY = document.createElement("span");
			COPY.innerHTML = "&#128203;";
			COPY.style.cursor = "pointer";
			COPY.style.top = "6px";
			COPY.style.left = "6px";
			COPY.style.position = "absolute";
			COPY.setAttribute("id", "my-copy");
			COPY.setAttribute("title", "Copy coordinates to clipboard");
			COPY.addEventListener("click", copyCoordinates);
			PIN.parentNode.insertBefore(COPY, PIN);
			clearInterval(timer);
			timer = null;
		}
	}, 500);
}

setInterval(() => {
	if (!document.querySelector("#my-copy") && timer == null) {
		doTimer();
	}
}, 1000);


//Look for card every X time
setInterval(() => {
	//Get the card
	let theCard = document.getElementById("reveal-card");
	//Is the card not null?
	if (theCard != null) {
		let theDialog = theCard.querySelector("div[role='dialog']");
		if (theDialog != null) {
			theCoords = theDialog.lastElementChild.innerText;
			theLatLng = theCoords.replace(" ", "").split(",");

			if (theLatLng.length == 2 && theCopiedCoords != theCoords) {
				theLat = theLatLng[0];
				theLng = theLatLng[1];
				if (!isNaN(theLat) && !isNaN(theLng)) {
					//Copy this data to clipboard
					if (FORMAT != "") {
						let out = FORMAT;
						copyTextToClipboard(out.replace("{{lat}}", theLat).replace("{{lng}}", theLng));
						theCopiedCoords = theCoords;
					}
					else {
						copyTextToClipboard(theCoords);
						theCopiedCoords = theCoords;
					}
				}
			}
		}
	}
}, 1000);

function copyCoordinates() {
	let theLink = location.href;
	let values = theLink.substring(theLink.indexOf("@") + 1, theLink.length);
	values = values.split(",");
	theCoords = values[0] + ", " + values[1];
	theLat = values[0];
	theLng = values[1];
	if (FORMAT != "") {
		let out = FORMAT;
		copyTextToClipboard(out.replace("{{lat}}", theLat).replace("{{lng}}", theLng));
	}
	else {
		copyTextToClipboard(theCoords);
	}
}

function doDisplay(theData) {
	let theInput = document.getElementById("omnibox");
	let inBold = document.createElement("div");

	inBold.innerHTML = `<b style="font-size:20px;">Copied ${theData}</b>`;
	inBold.style.backgroundColor = "#202030CC";
	inBold.style.color = "#000099";
	inBold.style.width = "100vw";
	inBold.style.textAlign = "center";

	theInput.parentNode.insertBefore(inBold, theInput.nextSibling);

	setTimeout(() => {
		inBold.style.display = "none";
	}, 5000);
}

function fallbackCopyTextToClipboard(text) {
	var textArea = document.createElement("textarea");
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	textArea.setSelectionRange(0, 999999);
	try {
		var successful = document.execCommand("copy");
		if (successful) {
			doDisplay(text);
		}
	} catch (error) {
		doDisplay("Error copying to clipboard");
		console.log(error);
	}
	document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text)
		.then(() => {
			doDisplay(text);
		})
		.catch((error) => {
			doDisplay("Error copying to clipboard");
			console.log(error);
		});

}


doTimer();

