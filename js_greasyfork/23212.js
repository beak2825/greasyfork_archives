// ==UserScript==
// @name            Youtube: Hide Recommended Videos
// @namespace       https://github.com/Zren
// @version         2
// @description     Hide the recommended videos section
// @icon            https://youtube.com/favicon.ico
// @author          Zren
// @include         http*://*.youtube.com/*
// @include         http*://youtube.com/*
// @include         http*://*.youtu.be/*
// @include         http*://youtu.be/*
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/23212/Youtube%3A%20Hide%20Recommended%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/23212/Youtube%3A%20Hide%20Recommended%20Videos.meta.js
// ==/UserScript==

//--- Utils
function observe(selector, config, callback) {
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation){
			callback(mutation);
		});
	});
	var target = document.querySelector(selector);
	observer.observe(target, config);
	return observer;
}

var documentLoaded = false;
function tickUntilLoad(callback) {
	function tick() {
		callback();
		if (!documentLoaded) {
			window.requestAnimationFrame(tick);
		}
	}
	callback();
	window.requestAnimationFrame(tick);
}

function watchBodyForChanged(callback) {
	callback();
	observe('body', {
		attributes: true,
	}, function(mutation) {
		if (mutation.attributeName === 'class') {
			callback();
		}
	});
}

//---
function getParent(e, selector) {
	var e2 = e.parentNode;
	while (e2) {
		if (e2.matches(selector)) {
			return e2;
		}
		e2 = e2.parentNode;
	}
	return null;
}

function hideSection(url) {
	var a = document.querySelector('.shelf-title-row a[href="' + url + '"]');
	if (a) {
		var section = getParent(a, '.item-section');
		section.style.display = 'none';
	}
}

function hideStuff() {
	hideSection("/feed/recommended");
	//hideSection("/feed/history"); // Watch it Again
	//hideSection("/user/IGNentertainment"); // IGN
}

tickUntilLoad(hideStuff);
document.addEventListener('DOMContentLoaded', function(){
	documentLoaded = true;
	hideStuff();
	watchBodyForChanged(hideStuff);
});
