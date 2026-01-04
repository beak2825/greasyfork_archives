// ==UserScript==
// @name         Wanikani Forums: Spongebob Time Cards
// @namespace    https://greasyfork.org/en/scripts/35422-wanikani-forums-spongebob-time-cards
// @version      1.7.1
// @description  Changes the "[time] later" message when a thread is revived to Spongebob time cards
// @author       Kumirei
// @include      https://community.wanikani.com*
// @include      https://meta.discourse.org*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35422/Wanikani%20Forums%3A%20Spongebob%20Time%20Cards.user.js
// @updateURL https://update.greasyfork.org/scripts/35422/Wanikani%20Forums%3A%20Spongebob%20Time%20Cards.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

var imageHeight = "250px";
var img;
var text;
var weeks;
var replies;
var link;
var time = Date.now();
const gaps = {
		"5 days later": "https://i.imgur.com/HPhoElg.jpg",
		"6 days later": "https://i.imgur.com/HPhoElg.jpg",
		"16 days later": "https://i.imgur.com/sWsG5fn.png",
		"1 weeks later": [
				"https://i.imgur.com/PWG6yJ3.jpg",
				"https://i.imgur.com/3d4ZtBo.jpg",
				"https://i.imgur.com/IQB7fZq.jpg"],
		"2 weeks later": "https://i.imgur.com/9F4J2rW.png",
		"3 weeks later": [
				"https://i.imgur.com/UIDGkNj.jpg",
				"https://i.imgur.com/yrIPv7p.jpg"],
		"1 month later": "https://i.imgur.com/IAyFGUH.jpg",
		"several months later": "https://i.imgur.com/TkNJxaj.jpg",
		"5 months later": "https://i.imgur.com/TkNJxaj.jpg",
		"6 months later": "https://i.imgur.com/yuNzBzj.jpg",
		"many pointless comments later": "https://i.imgur.com/OFj7Qbq.png",
		"random": [
				"https://i.imgur.com/ZpC1iPB.png",
				"https://i.imgur.com/ByFMDJ2.png",
				"https://i.imgur.com/7oGxy4r.jpg",
				"https://i.imgur.com/xI94bBT.jpg",
				"https://i.imgur.com/swGxjlh.jpg",
				"https://i.imgur.com/SOD15QL.png",
				"https://i.imgur.com/tIknHiJ.jpg",
				"https://i.imgur.com/52ndtCo.jpg",
				"https://i.imgur.com/9JOgHhp.png",
				"https://i.imgur.com/Onqf0kn.jpg",
				"https://i.imgur.com/uRIugh4.jpg",
				"https://i.imgur.com/vm0fZ4z.jpg",
				"https://i.imgur.com/wexbMJ0.jpg",
				"https://i.imgur.com/ERBBr6z.png",
				"https://i.imgur.com/PTqay5H.jpg",
				"https://i.imgur.com/YptWbNw.jpg",
				"https://i.imgur.com/74tss7e.jpg",
				"https://i.imgur.com/7VOYt0C.jpg",
				"https://i.imgur.com/T9acTVN.jpg"]
};

(function() {
		// Triggers (I understand that this is far from optimal, if anyone has an alternative please pm me)

		// when you load the window
		window.addEventListener('load', initSpongebob);

		// when navigating
		(function(history){
				var pushState = history.pushState;
				history.pushState = function(state) {
						delaySpongebob();
						return pushState.apply(history, arguments);
				};
		})(window.history);

		// back and forward buttons
		window.addEventListener('popstate', delaySpongebob);
})();

function delaySpongebob() {
		setTimeout(initSpongebob, 1000);
}

// inserts images on the current page and creates the relevant mutation observers
function initSpongebob() {
		insertImages();
		makeObserver(function() {
				makeObserver(observerFunction, "post-stream");
				insertImages();
		}, "posts-wrapper");
		makeObserver(observerFunction, "post-stream");
}

// calls the insertImages function if there are new nodes of the relevant classes
function observerFunction(mutation) {
		if ((mutation.addedNodes[0] !== undefined) && (mutation.addedNodes !== undefined)) {
				if (mutation.addedNodes[0].className === "time-gap small-action clearfix" || mutation.addedNodes[0].className === "gap") {
						insertImages();
				}
		}
}

// creates a new observer
function makeObserver(func, targetClass) {
		var target = document.getElementsByClassName(targetClass)[0];
		if (target !== undefined) {
				var observer = new MutationObserver(function(mutations) {
						mutations.forEach(function(mutation) {
								func(mutation);
						});
				});
				var config = {childList: true};
				observer.observe(target, config);
		}
}

function insertImages() {
		$(".time-gap").each(function() {
				// decide which image to use
				text = this.children[1].innerHTML;
				if (!(text in gaps)) {
						if (text.includes("months")) {
								if (text.slice(0,2) < 5) {
										text = "several months later";
								}
								else {
										text = "random";
								}
						}
						else if (text.includes("year")) {
								text = "random";
						}
						else {
								weeks = Math.floor(text.slice(0,2)/7);
								if (weeks == 4) {
										text = "1 month later";
								}
								else {
										text = weeks + " weeks later";
								}
						}
				}
				// randomise if several options
				if (gaps[text].constructor === Array) {
						link = gaps[text][Math.floor(Math.random() * gaps[text].length)];
				}
				else {
						link = gaps[text];
				}
				// check if element already has the correct image
				if (this.children.length === 3) {
						if (this.children[2].src === link) {
								return true;
						}
						else if (gaps[text].includes(this.children[2].src)) {
								return true;
						}
				}
				// Empty element, prepare and insert image
				if (this.children.length === 3) {
						this.children[2].src = link;
				}
				else {
						setImage(this, link, true);
				}
		});

		// change out "view [number] hidden replies" messages
		$(".gap").each(function() {
				replies = this.innerHTML.slice(7,8); // if this is a digit then there are at least 100 replies
				if (replies in [0,1,2,3,4,5,6,7,8,9]) {
						if(this.children.length === 0) { // if there isn't already an image
								$(this).empty();
								setImage(this, gaps["many pointless comments later"], false);
						}
				}
		});
}

function setImage(elem, link, child) {
		img = document.createElement('img');
		img.src = link;
		img.style = "max-height: " + imageHeight + "; max-width: calc(100% - 32px);";
		if (child) {
				elem.children[0].style = "display: none;";
				elem.children[1].style = "display: none;";}
		elem.style = "display: block; text-align: center; padding-top: 0; padding-bottom: 0;";
		elem.appendChild(img);
}
