// ==UserScript==
// @name         	Auto Skip ADs, Summary & More | Amazon Video
// @name:de         Automatisches Überspringen von Werbung, Zusammenfassung & mehr | Amazon Video
// @namespace   	https://greasyfork.org/users/928242
// @version     	0.9.1
// @description  	Automatically skips ads, recaps, previews and more when watching videos on Amazon Prime.
// @description:de  Überspringt automatisch Werbung, Zusammenfassungen, Vorschauen und mehr, wenn du Videos auf Amazon Prime ansiehst.
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @match        	https://www.amazon.de/gp/video/detail/*
// @match        	https://www.amazon.*/*/dp/*/ref=sr_*
// @icon         	https://www.google.com/s2/favicons?sz=64&domain=amazon.de
// @grant        	none
// @license      	MIT
// @downloadURL https://update.greasyfork.org/scripts/452856/Auto%20Skip%20ADs%2C%20Summary%20%20More%20%7C%20Amazon%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/452856/Auto%20Skip%20ADs%2C%20Summary%20%20More%20%7C%20Amazon%20Video.meta.js
// ==/UserScript==


// Change to the text matching your language for the skip button
const skipAdButtonText = 'Überspringen'

// How often in X seconds to scan for ADs
const scanInterval = 3



/* ! ! ! ! ! ! ! !

Dont change below!

! ! ! ! ! ! ! ! */


let checkForAds = ''
let isAutoplay = true
let doOnce = true
let skipAdContainer = ''
let skipAdEl = ''
let skipButtonEl = ''
const clp = '[Amazon AutoSkip Script] '

startAdScan()

// Main Function Scanning for ADs
async function scanForADs() {

	if (!isVideoPlaying()) return;

    	await checkForAutoplay()
	
    	if (isAutoplay) return

	console.log(clp + "Scanning for running AD..")

	skipAdEl = await getSkipAdElement()

	skipCredits()

	if (!skipAdEl) return

	console.log(clp + "skipButtonEl:", skipAdEl)

	console.log(clp + "Detected playing AD. Trying to skip..")

	skipAd()
}

// Starting Video on a given time, when it has a time-param
async function checkForAutoplay() {
    if (!doOnce) return

    const url = document.querySelector('.fbl-play-btn').href
    const urlParams = await new URLSearchParams(url);
    const paramT = await urlParams.get('t');
    console.log("paramT", paramT)

    if (paramT > 0) {
        console.log(clp + "Autoplay detected. Delaying scan.")
        setTimeout(() => (isAutoplay = false), 5000)
    } else {
        isAutoplay = false
    }
    doOnce = false
    return
}

// Skipping the AD and restart delayed Scanning
function skipAd() {
	setTimeout( () => {
		try {
			skipAdEl.click()
			console.log(clp + "Skipped AD")
		} catch(err) {
			console.error(clp + "Coudn't Skip Ad or Click Element")
		}
		restartAdScan()
	}, 1000 )
}

function skipCredits() {
	const buttonEl = document.querySelector("button.atvwebplayersdk-skipelement-button")

	if (!buttonEl) return;

	console.log(clp + "Skipped Credits")
	buttonEl.click()
}

// Checks if Video is played
function isVideoPlaying() {
	const videoContainer = document.querySelector("#dv-web-player")

	if (!videoContainer) return

	return videoContainer.classList.contains("dv-player-fullscreen")
}

// Finding SkipElement and returning it
async function getSkipAdElement() {
	skipAdContainer = document.querySelector("div.atvwebplayersdk-infobar-container > div > div:last-child")

	if (!skipAdContainer) return

	return await [...skipAdContainer.childNodes].find( (el) => {

		if (el.innerText === skipAdButtonText) {
			console.log(clp + "Found Skip-Button Element", el)
			console.log(clp + "Skip-Button Text:", el.innerText)

			return el
		}
	});
}

// Starting AdScan Interval
function startAdScan() {
	checkForAds = setInterval( () => { scanForADs() }, scanInterval * 1000 )
}

// Clearing Interval, Vars and delaying restart of scan
function restartAdScan() {
	clearInterval(checkForAds)

	checkForAds = ''
	skipAdContainer = ''
	skipAdEl = ''
	skipButtonEl = ''

	setTimeout( () => { startAdScan() }, 1000 )
}

