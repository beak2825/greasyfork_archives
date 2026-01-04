// ==UserScript==
// @name               f-droid.org  -  Enlarge Screenshots
// @namespace          a-pav
// @description        Enlarge (and then reduce) app's screenshots by single click. Browse (i.e. next/previous) screenshots by using arrow keys, both in enlarged mode and in the normal mode.
// @match              *://f-droid.org/packages/*
// @match              *://f-droid.org/*/packages/*
// @version            1.0
// @run-at             document-end
// @author             a-pav
// @grant              none
// @icon               https://f-droid.org/assets/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/437797/f-droidorg%20%20-%20%20Enlarge%20Screenshots.user.js
// @updateURL https://update.greasyfork.org/scripts/437797/f-droidorg%20%20-%20%20Enlarge%20Screenshots.meta.js
// ==/UserScript==

const bigScreenShotID = "enlarged-scrnsht";
var screenshotsFrame = document.querySelector("#screenshots>div.frame.js_frame");
if (!screenshotsFrame) { 
	// no screenshots for this package
	return
}
var gallery = screenshotsFrame.querySelector("ul.gallery");
var screenshotsList = screenshotsFrame.querySelectorAll("li.js_slide.screenshot");

function showSCREENSHOT(index) {
	gallery.style.display = "none";

	var li = screenshotsList[index];
	var img = li.querySelector("img").cloneNode();
	img.setAttribute("id", bigScreenShotID);
	img.setAttribute("arrindex", index);

	img.addEventListener('click', function() {
		removeSCREENSHOT(this);
	});

	screenshotsFrame.append(img);
	img.scrollIntoView({behavior: "smooth"});
}

function removeSCREENSHOT(img, scroll = true) {
	gallery.style.display = "block";

	if (!img) {
		img = document.getElementById(bigScreenShotID);
	}

	if (img) {
		img.parentElement.removeChild(img);
	}

	if (scroll) {
		screenshotsFrame.scrollIntoView({behavior: "smooth"});
	}
}

screenshotsList.forEach(function(elm , index) {
		elm.addEventListener('click', function() {
			showSCREENSHOT(index);			
		});
});

document.querySelectorAll("div#screenshots>span.slider_nav").forEach(function(elm) {
	elm.addEventListener('click', function() {
		var img = document.getElementById(bigScreenShotID);
		if (img === null) { 
			// do nothing
			return;
		}

		var next = this.classList.contains('next');
		var index = parseInt(img.getAttribute("arrindex"));
		if (next) {
			index += 1;
			if (index > screenshotsList.length - 1) {
				index = 0;
			}
		} else {
			index -= 1;
			if (index < 0) {
				index = screenshotsList.length - 1;
			}
		}

		removeSCREENSHOT(img); // remove previously enlarged image

		showSCREENSHOT(index);
	});
});

// Keybindings
var next = document.querySelector("div#screenshots>span.slider_nav.next");
var prev = document.querySelector("div#screenshots>span.slider_nav.prev");
var clickEvent = new Event('click');

window.addEventListener('keyup', function(e) { 
	if (e.key === "ArrowRight") { // or e.which 39
		next.dispatchEvent(clickEvent);
	} else if (e.key === "ArrowLeft") { // or e.which 37
		prev.dispatchEvent(clickEvent);
	} else if (e.key === "Escape") { // or e.which: 27
		removeSCREENSHOT(null, false);
	}	
});