// ==UserScript==
// @name			Something Awful Image Fixes
// @namespace		SA
// @description		Smarter image handling on the Something Awful forums.
// @include			http://forums.somethingawful.com/*
// @version			1.2.0
// @grant			GM_openInTab
// @run-at			document-end
// @icon			http://forums.somethingawful.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/5430/Something%20Awful%20Image%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/5430/Something%20Awful%20Image%20Fixes.meta.js
// ==/UserScript==

var Util = {
	assetsLoaded: false,
	assetsLoading: 0,

	/**
	 * Initialise the page, strip out any assets that we will load.
	 */
	initialise: function(target) {
		// Remove content images:
		var images = document.querySelectorAll('td.postbody img');

		for (var index in images) {
			var image = images[index];

			if (typeof image !== 'object') continue;

			var src = image.getAttribute('src');

			// Exclude smilies:
			if (!/somethingawful[.]com[/](images[/]smilies|forumsystem[/]emoticons)[/]/.test(src)) {
				var placeholder = document.createElement('span');

				placeholder.setAttribute('data-saif-pending', 'yes');
				placeholder.saifCreate = src;

				image.parentNode.replaceChild(placeholder, image);
			}
		}

		// Remove other images:
		var images = document.querySelectorAll('img');

		for (var index in images) {
			var image = images[index];

			if (!image.parentNode) continue;

			var placeholder = document.createElement('span');

			placeholder.setAttribute('data-saif-pending', 'yes');
			placeholder.saifClone = image;

			image.parentNode.replaceChild(placeholder, image);
		}

		// Remove embedded videos:
		var iframes = document.querySelectorAll('td.postbody iframe');

		for (var index in iframes) {
			var iframe = iframes[index];

			if (!iframe.parentNode) continue;

			var placeholder = document.createElement('span');

			placeholder.setAttribute('data-saif-pending', 'yes');
			placeholder.saifClone = iframe;

			iframe.parentNode.replaceChild(placeholder, iframe);
		}

		// Fix post table styles:
		var posts = document.querySelectorAll('table.post');

		for (var index in posts) {
			var post = posts[index];

			if (typeof post !== 'object') continue;

			post.style.tableLayout = 'fixed';
		}

		Util.beginLoading(target);
	},

	/**
	 * Begin loading assets from the start of the document
	 * until and including the windows viewport.
	 */
	beginLoading: function(target) {
		var offset = window.scrollY + window.innerHeight;

		if (!!target) {
			offset = Util.getElementOffset(target) + window.innerHeight
		}

		// Initialise all elements up until the offset:
		var placeholders = document.querySelectorAll('[data-saif-pending]'),
			queue = [];

		for (var index in placeholders) {
			var placeholder = placeholders[index];

			if (typeof placeholder !== 'object') continue;

			if (Util.getElementOffset(placeholder) < offset) {
				queue.push(placeholder);
			}
		}

		for (var index in queue) {
			Util.createElement(queue[index]);
		}

		// Wait until everything initialised thus far is loaded:
		if (!!target) {
			Util.waitForReady(function() {
				// Scroll to the target element:
				window.scrollTo(0, Util.getElementOffset(target));

				// Resume loading of images and videos:
				Util.resumeLoading();
			});
		}

		// No reason to wait:
		else {
			Util.resumeLoading();
		}
	},

	/**
	 * Resume loading assets not handled by `Util.beginLoading`
	 * as they become visible in the windows viewport.
	 */
	resumeLoading: function() {
		var placeholders = document.querySelectorAll('[data-saif-pending]');

		for (var index in placeholders) {
			var placeholder = placeholders[index];

			Util.waitForVisibility(placeholder, function(placeholder) {
				Util.createElement(placeholder);
			});
		}
	},

	/**
	 * Create an asset element from a placeholder.
	 */
	createElement: function(placeholder) {
		if (!placeholder.parentNode) return;

		// No processing needs to be done:
		if (!!placeholder.saifClone) {
			var element = placeholder.saifClone.cloneNode(true);

			// Track the loading of this image:
			if (element instanceof HTMLImageElement) {
				Util.trackLoadState(element, ['load']);
			}

			placeholder.parentNode.replaceChild(element, placeholder);
		}

		// Process the source of this image:
		else if (!!placeholder.saifCreate) {
			var src = placeholder.saifCreate;

			if (/i\.imgur\.com/.test(src)) {
				Util.createImgur(placeholder, src);
			}

			else if (/staticflickr\.com\//.test(src)) {
				Util.createFlickr(placeholder, src);
			}

			else {
				Util.createImage(placeholder, src);
			}
		}
	},

	/**
	 * Create an empty element indicating of failure.
	 */
	createEmpty: function(placeholder) {
		var span = document.createElement('span');

		span.setAttribute('data-saif-empty', 'yes');

		placeholder.parentNode.replaceChild(span, placeholder);
	},

	/**
	 * Create a simple image element from a given source URL.
	 */
	createImage: function(placeholder, src, href) {
		var wrapper = document.createElement('span');

		wrapper.setAttribute('class', 'saif-wrapper');

		// Create image element:
		var image = document.createElement('img');

		// Track the loading of this image:
		Util.trackLoadState(image, ['load']);

		// Append the image to the page when it is loaded:
		image.addEventListener('load', function() {
			if (!!href) {
				var link = document.createElement('a');

				link.setAttribute('href', href);
				link.appendChild(image);
				wrapper.appendChild(link);
			}

			else {
				wrapper.appendChild(image);
			}

			if (!!placeholder.parentNode) {
				placeholder.parentNode.replaceChild(wrapper, placeholder);
			}
		});

		// Set image source:
		image.setAttribute('src', src);
	},

	/**
	 * Create a video element from a list of source URLs with media types.
	 */
	createVideo: function(placeholder, src, href, sources) {
		var wrapper = document.createElement('span');

		wrapper.setAttribute('class', 'saif-wrapper');

		// Create video element:
		var video = document.createElement('video');

		// Set attributes to ensure gif style playback:
		video.setAttribute('preload', 'auto');
		video.setAttribute('autoplay', 'autoplay');
		video.setAttribute('muted', 'muted');
		video.setAttribute('loop', 'loop');
		video.setAttribute('webkit-playsinline', 'webkit-playsinline');

		var action = document.createElement('a');

		action.setAttribute('class', 'saif-link');
		action.setAttribute('target', '_blank');
		action.textContent = 'See original';

		action.addEventListener('click', function(event) {
			event.stopPropagation();
			event.preventDefault();

			wrapper.setAttribute('class', 'saif-wrapper hide');
			wrapper.removeChild(action);
			video.pause();

			Util.createImage(wrapper, src, href);
		});

		wrapper.appendChild(action);

		// Video has loaded, insert it or a fallback:
		video.addEventListener('loadeddata', function() {
			if (
				(video.videoWidth < 75 && video.videoHeight < 100)
				|| (video.videoHeight < 75 && video.videoWidth < 100)
			) {
				video.pause();
				Util.createImage(placeholder, src, href);
			}

			else {
				var link = document.createElement('a');

				link.setAttribute('href', href);
				link.appendChild(video);
				wrapper.appendChild(link);

				if (!!placeholder.parentNode) {
					placeholder.parentNode.replaceChild(wrapper, placeholder);
				}
			}
		});

		// Track the loading of this video:
		Util.trackLoadState(video, ['loadeddata', 'error']);

		// Add media sources:
		for (var index in sources) {
			var source = document.createElement('source');

			source.setAttribute('src', sources[index][0]);
			source.setAttribute('type', sources[index][1]);

			video.appendChild(source);
		}
	},

	createStyle: function(css) {
		var head = document.querySelectorAll('head')[0],
			style = document.createElement('style');

		style.textContent = css;
		head.appendChild(style);
	},

	/**
	 * Create an imgur image or video from a given source URL.
	 */
	createImgur: function(placeholder, src) {
		var bits = /\/(.{5}|.{7})[hls]?\.(jpg|png|gif)/i.exec(src);

		// Could not parse the image:
		if (bits) {
			var identity = bits[1],
				extension = bits[2].toLowerCase();

			// Is a video:
			if ('gif' === extension) {
				Util.createVideo(
					placeholder,
					'//i.imgur.com/' + identity + '.' + extension,
					'//i.imgur.com/' + identity + '.' + extension,
					[
						['//i.imgur.com/' + identity + '.webm',	'video/webm'],
						['//i.imgur.com/' + identity + '.mp4',	'video/mp4']
					]
				);
			}

			// Is an image:
			else {
				Util.createImage(
					placeholder,
					'//i.imgur.com/' + identity + 'h.' + extension,
					'//i.imgur.com/' + identity + '.' + extension
				);
			}
		}

		// The source was invalid:
		else {
			Util.createEmpty(placeholder);
		}
	},

	/**
	 * Create a flickr image from a given source URL.
	 */
	createFlickr: function(placeholder, src) {
		var bits = /^(.+?\.com\/.+?\/.+?_.+?)(_[omstzb])?\.(.+?)$/.exec(src),
			location,
			extension;

		// Create an image:
		if (bits) {
			var location = bits[1],
				extension = bits[3].toLowerCase();

			Util.createImage(
				placeholder,
				location + '_b.' + extension,
				location + '_b.' + extension
			);
		}

		// The source was invalid:
		else {
			Util.createEmpty(placeholder);
		}
	},

	/**
	 * Calculate the offset from the top of the page to the
	 * top of the given element.
	 */
	getElementOffset: function(element) {
		var offset = 0;

		while (element.offsetParent) {
			offset += element.offsetTop;
			element = element.offsetParent;
		}

		return offset;
	},

	/**
	 * Style an element so that it cannot break out of the post table.
	 */
	setElementStyles: function(element) {
		element.style.display = 'inline-block';
		element.style.marginBottom = '5px';
		element.style.marginTop = '5px';
		element.style.maxWidth = '100%';
	},

	/**
	 * Attach events to count the number of currently loading assets.
	 */
	trackLoadState: function(element, eventNames) {
		if (Util.assetsLoaded) return;

		Util.assetsLoading++;

		for (var index in eventNames) {
			element.addEventListener(eventNames[index], Util.trackReadyState);
		}
	},

	/**
	 * The attached event handler for `Util.trackLoadState`.
	 */
	trackReadyState: function(event) {
		if (Util.assetsLoaded) return;

		Util.assetsLoading--;

		if (0 === Util.assetsLoading) {
			Util.assetsLoaded = true;
		}
	},

	/**
	 * Wait for all of the assets loaded in `Util.beginLoading`
	 * to complete.
	 */
	waitForReady: function(callback) {
		var wait = setInterval(function() {
			if (Util.assetsLoaded) {
				clearInterval(wait);
				callback();
			}
		}, 1);
	},

	/**
	 * Wait for the user to scroll within two pages of an element
	 * and then call the callback.
	 */
	waitForVisibility: function(element, callback) {
		var chromeSucks = false;
		var scroll = function() {
			if (chromeSucks) return;

			var offset = Util.getElementOffset(element),
				max = window.scrollY + (window.innerHeight * 2);

			if (max > offset) {
				chromeSucks = true;
				window.removeEventListener('scroll', scroll);
				callback(element);
			}
		};

		scroll();
		window.addEventListener('scroll', scroll);
	}
};

try {
	var offset = window.outerHeight;

	Util.createStyle("\
		@-webkit-keyframes saifProgressSlider {\
			0% { background: #3b3b3b; }\
			100% { background: #3b3b3b; }\
		}\
		@keyframes saifProgressSlider {\
			0% { background-position: 0px 0px; }\
			100% { background-position: 16px 0px; }\
		}\
		span.saif-wrapper {\
			display: inline-block;\
			position: relative;\
			margin: 5px 0;\
			max-width: 100%;\
		}\
		span.saif-wrapper img,\
		span.saif-wrapper video {\
			max-width: 100%;\
			opacity: 1;\
			vertical-align: bottom;\
		}\
		span.saif-wrapper.hide {\
			background: repeating-linear-gradient(45deg, #444444 0px, #444444 8px, #3b3b3b 8px, #3b3b3b 16px) scroll 0% 0% / 300% 300%;\
			-webkit-animation: saifProgressSlider 60s linear infinite;\
			animation: saifProgressSlider 1s linear infinite;\
		}\
		span.saif-wrapper.hide video {\
			transition: opacity 0.5s ease;\
			opacity: 0;\
		}\
		span.saif-wrapper a.saif-link {\
			background: hsla(0, 0%, 10%, 0.7);\
			color: #ffffff;\
			cursor: pointer;\
			display: none;\
			font-size: 0.75em;\
			left: 0;\
			line-height: 1;\
			padding: 5px;\
			position: absolute;\
			right: 0;\
			text-decoration: none;\
			top: 0;\
			z-index: 1;\
		}\
		span.saif-wrapper:hover a.saif-link {\
			display: block;\
		}\
	");

	// Prevent images from loading:
	window.stop();

	// Redirect the page:
	if (document.querySelectorAll('meta[http-equiv=refresh]').length) {
		var rule = document.querySelectorAll('meta[http-equiv=refresh]')[0].getAttribute('content');

		if (/URL=(.+)$/.test(rule)) {
			window.location = /URL=(.+)$/.exec(rule)[1];
		}
	}

	// Jump to appropriate place on page:
	else if (!!window.location.hash && document.querySelectorAll(window.location.hash).length) {
		Util.initialise(document.querySelectorAll(window.location.hash)[0]);
	}

	// Load the page normally:
	else {
		Util.initialise();
	}
}

catch (e) {
	console.log("Exception: " + e.name + " Message: " + e.message);
}
