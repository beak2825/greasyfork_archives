// ==UserScript==
// @name         News Pagination Skipper
// @namespace    Hans5958
// @version      1.0.1
// @description  Skips paginations on news articles and shows the whole thing in a single page instead.
// @copyright    Hans5958
// @license      MIT
// @match        *://*/*
// @exclude      *://github.com/*
// @grant        none
// @homepageURL  https://github.com/Hans5958/userscripts
// @supportURL   https://github.com/Hans5958/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/444661/News%20Pagination%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/444661/News%20Pagination%20Skipper.meta.js
// ==/UserScript==

let searchParams = new URLSearchParams(location.search)

let isNativeSupport

let _log = (message, level = "log") => {
	console[level](`[NPS] ${message}`)
}

let isPages = () => {
	if (document.querySelector(".paging") || document.querySelector(".pagination")) {
		isNativeSupport = true
		return true
    } else if (searchParams.get('page')) {
		isNativeSupport = false
		return true
	} else {
		return false
	}
}

let isPageAll = () => {
	if (searchParams.get('page') === "all") {
		return true
	} else {
		return false
	}
}

if (isPages()) {
	if (!isNativeSupport) {
		_log("This website is not natively supported, but it will still try to skip it. Please report by making an issue on https://github.com/Hans5958/userscripts.", "warn")
    }
	if (!isPageAll()) {
        var skipSplash = document.createElement("div")
		skipSplash.style.height = "100%"
		skipSplash.style.width = "100%"
		skipSplash.style.position = "fixed"
		skipSplash.style.top = "0"
		skipSplash.style.left = "0"
		skipSplash.style.backgroundColor = "rgba(0,0,0,0.5)"
		skipSplash.style.fontFamily = "sans-serif"
		skipSplash.style.zIndex = "1000000"
		skipSplash.style.display = "flex"
		skipSplash.style.alignItems = "center";
		skipSplash.style.justifyContent = "center";
        var skipText = document.createElement("p")
		skipText.innerHTML = "Detected multiple pages. Redirecting!"
		skipText.style.zIndex = "1000001"
		skipText.style.color = "white"
		skipText.style.fontSize = "36px"
		skipSplash.appendChild(skipText)
		var body = document.querySelector("body")
		body.appendChild(skipSplash)
		body.style.height = "100%"
		body.style.overflowY = "hidden"
		document.title = "Redirecting!"
		searchParams.set("page", "all")
		document.location = `${document.location.origin}${document.location.pathname}?${searchParams.toString()}`
    } else {
		_log("This page has been skipped. Aborting.")
	}
} else {
    _log("There are no seperations detected. If there is, please report by making an issue on https://github.com/Hans5958/userscripts.")
    _log("Keep in mind that this userscript only accepts news articles that is seperated into multiple pages.")
}