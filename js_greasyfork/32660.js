// ==UserScript==
// @name         Cuddlypuss
// @version      0.1.1
// @description  Displays both sides of a cover on Cuddlyoctopus.com, and shows the sfw/nsfw version on mouseover(depends on which version of the site you are viewing).
// @author       Kayla355
// @match        https://cuddlyoctopus.com/shop/*
// @run-at       document-start
// @grant        none
// @namespace    https://greasyfork.org/users/12437
// @change       0.1.1 - Fixed an issue with multiple new page loads being triggered.
// @downloadURL https://update.greasyfork.org/scripts/32660/Cuddlypuss.user.js
// @updateURL https://update.greasyfork.org/scripts/32660/Cuddlypuss.meta.js
// ==/UserScript==
var sfw;
var style = document.createElement('style');
style.type = "text/css";
style.innerHTML = `.container { width: 80%; }
	#hoverimg img {transition: opacity .3s ease-in-out !important;}
	#hoverimg:hover img:nth-of-type(3), #hoverimg:hover img:nth-of-type(4) { opacity: 0; }
	#hoverimg img.dttop:hover { opacity: 0; }
	.dakithumb { transition: none !important; height: 100% !important; width: 49.8% !important; }
	.dakithumb:nth-of-type(2), .dakithumb:nth-of-type(4) { left: 50% !important; right: 0; }`;
document.querySelector('head').appendChild(style);

var state = {
	xhr: false,
	loading: function() {
		if(!this.xhr && !document.querySelector('.lmp_products_loading')) {
			return false;
		}
		return true;
	},
	appendable: false,
	observer: null,
	append: function() {
		var _this = this;
		// Mutations observer
		_this.observer = new MutationObserver(function(mutations) {
			for(var i=0; i < mutations.length; i++) {
				let mutation = mutations[i];
				for(var j=0; j < mutation.removedNodes.length; j++) {
					if(mutation.removedNodes[j].className == "lmp_products_loading") {
						_this.appendable = true;
						_this.observer.disconnect();
					}
				}
			}
		});
		_this.observer.observe(document.querySelector('.products'), {childList: true});
	}
};

window.addEventListener('DOMContentLoaded', function() {
	sfw = !!+window.location.search.replace(/.*sfw\=([0-9]).*/i, '$1') || !!+document.cookie.replace(/.*sfw_version\=([0-9]).*/i, '$1');
	load_next_images(true);

	// Pagination observer
	var observer = new MutationObserver(function(mutations) {
		for(var i=0; i < mutations.length; i++) {
			let mutation = mutations[i];
			for(var j=0; j < mutation.addedNodes.length; j++) {
				if(mutation.addedNodes[j].className == "lmp_products_loading") {
					load_next_images();
				}
			}
		}
    });

	observer.observe(document.querySelector('.products'), {childList: true});
});


function load_next_images(firstLoad) {
	state.xhr = true;
	state.append();
	var url = (firstLoad) ? window.location.href : document.querySelector('.pagination-item-next-link').href;
		url = (!window.location.search) ? url+'?sfw='+((sfw) ? 0:1):url.replace(/(&|\?)sfw=[0-9]|$/, '$1sfw='+((sfw) ? 0:1));
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.onload = function() {
		var container = document.implementation.createHTMLDocument().documentElement;
      	container.innerHTML = xhr.responseText;

		appendImages(container, firstLoad);
		state.xhr = false;
	};
	xhr.send();
}

function appendImages(container, firstLoad) {
	// Mutations observer
	var observer = new MutationObserver(function(mutations) {
		for(var i=0; i < mutations.length; i++) {
			let mutation = mutations[i];
			for(var j=0; j < mutation.removedNodes.length; j++) {
				if(mutation.removedNodes[j].className == "lmp_products_loading") {
					attacher();
				}
			}
		}
    });

	var append = function(imageContainer) {
		var parent = imageContainer.parentNode;
		while(parent && parent.tagName !== "A") {
			parent = parent.parentNode;
		}
		var target = document.querySelector('a[href="'+ parent.href +'"]' + ' #hoverimg');
		if(target) {
			target.insertBefore(imageContainer, target.querySelector('img:first-of-type'));
		} else {
			// Failsafe when the target doesn't exist yet for whatever reason.
			setTimeout(append.bind(null, imageContainer), 1000);
		}
	};

	var attacher = function() {
		var imageContainers = container.querySelectorAll('.dakithumb');
		for(var i=imageContainers.length-1; i >= 0; i--) {
			append(imageContainers[i]);
		}
		observer.disconnect();
		state.observer.disconnect();
	};

	observer.observe(document.querySelector('.products'), {childList: true});
	if(firstLoad || state.appendable) attacher();
}