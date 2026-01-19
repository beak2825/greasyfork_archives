// ==UserScript==
// @id             c6a206b6-1d09-479b-8f25-5d04425f3c40
// @name           GameFAQs - Bluesky Embeds
// @version        2.3
// @namespace      Takato
// @author         Takato
// @description    Bluesky embedding on GameFAQs
// @include        https://gamefaqs.gamespot.com/boards/*
// @include        https://embed.bsky.app/embed/*
// @grant          na
// @downloadURL https://update.greasyfork.org/scripts/541521/GameFAQs%20-%20Bluesky%20Embeds.user.js
// @updateURL https://update.greasyfork.org/scripts/541521/GameFAQs%20-%20Bluesky%20Embeds.meta.js
// ==/UserScript==


// Section for Bluesky embed frames - enable inline videos on-click
if (document.location.host == "embed.bsky.app") {
	window.addEventListener('message', function (event) {
		if (event.origin !== 'https://gamefaqs.gamespot.com') {
			return;
		}
		if (event.data == "pausevideo") {
			document.querySelectorAll(".gfbsky-video-container video").forEach((vid)=>{
				vid.pause();
			});
			return;
		}

		if (event.data !== "inlinevideo") {
			return;
		}

		var css = document.createElement("style");
		css.setAttribute("type", "text/css");
		css.innerHTML = `
			.gfbsky-video-container {
				cursor: auto;

				&.activated {
					background-size: contain;
					background-position: center center;
					background-repeat: no-repeat;
					background-color: black;

					.gfbsky-playbtn {
						display: none;
					}
				}

				&:hover .gfbsky-playbtn {
					background-color: #000c;
					zoom: 1.1;
				}

				.gfbsky-playbtn {
					transition: background-color 70ms, zoom 70ms;
				}

			}

			.gfbsky-gif-container {
				background-color: black;

				> *:not(video) {
					display: none;
				}
			}
		`;
		document.body.append(css);

		// Videos
		document.querySelectorAll("div:has(> img[src*='https://video.bsky.app/'])").forEach((container)=>{
			var thumb = container.querySelector("img[src*='https://video.bsky.app/']");
			var meta = thumb?.src.match(/https:\/\/video\.bsky\.app\/watch\/(did%3Aplc%3A[\w]{24})\/([\w]{59})\/thumbnail\.jpg/);

			if (!meta) {
				return;
			}

			container.classList.add("gfbsky-video-container");
			container.querySelector("div.rounded-full:has(> img)")?.classList.add("gfbsky-playbtn");

			container.addEventListener("click", function(e){
				e.stopPropagation();
				e.preventDefault();

				if (container.classList.contains("activated")) {
					return;
				}

				container.classList.add("activated");

				container.style.setProperty("background-image", `url(${thumb.src})`);

				var vid = document.createElement("video");
				vid.src = `https://bsky.social/xrpc/com.atproto.sync.getBlob?did=${meta[1]}&cid=${meta[2]}`;
				vid.poster = thumb.src;
				vid.title = thumb.alt;
				vid.autoplay = true;
				vid.controls = true;
				vid.loop = true;
				vid.setAttribute("playsinline", "true");
				vid.style = "width: 100%; height: 100%; object-fit: contain;";

				thumb.replaceWith(vid);
			});
		});

		// 'Gifs'
		document.querySelectorAll("a[href*='https://media.tenor.com/']:has(> img[src*='https://cdn.bsky.app/img/'])").forEach((link)=>{
			var thumb = link.querySelector("img[src*='https://cdn.bsky.app/img/']");
			var meta = link.href.match(/https:\/\/media\.tenor\.com\/([\w\-]{14})AC\/([\w\-]+)\.gif/);

			if (!meta) {
				return;
			}

			link.classList.add("gfbsky-gif-container");

			var alt = link.querySelector("img + div p.line-clamp-2")?.innerText;
			var size = link.href.match(/https:\/\/media\.tenor\.com\/(?:.+)\.gif\?hh=(\d+)&ww=(\d+)/);

			var vid = document.createElement("video");
			vid.src = `https://t.gifs.bsky.app/${meta[1]}P3/${meta[2]}.webm`;
			vid.poster = thumb.src;
			vid.title = alt ? alt : "";
			vid.autoplay = true;
			vid.loop = true;
			vid.setAttribute("playsinline", "true");
			vid.defaultMuted = true;
			vid.muted = true;
			vid.setAttribute("disablepictureinpicture", "true");
			vid.preload = "auto";
			if (size) {
				vid.style.setProperty("aspect-ratio", `${size[2]} / ${size[1]}`);
			}

			thumb.replaceWith(vid);
		});

	});
	return;
}

// Section for GameFAQs
(function () {

	var debugMode = false;
	if ( (new URLSearchParams(window.location.search)).has("debug") ) {
		debugMode = true;
	}

	function debug(msg, override=false) {
		if (debugMode || override) {
			console.log(`%c[GFAQS Bluesky Script ${info.ver}]%c ${msg}`, "color:#0a7aff; color: light-dark(#0a7aff,#208bfe); background: light-dark(white,black); font-weight: bolder;", "",);
		}
	}

	var info = {};
	var gminfo = GM.info || GM_info;
	info.ver = gminfo.script.version;
	info.ext = gminfo.scriptHandler;
	info.extver = gminfo.version;
	debug(`Running script version [${info.ver}] in userscripts extension ${info.ext} ${info.extver}`, true);

	debug("Debug mode is enabled and will output messages to help diagnose issues.");

	// Determine colour mode by matching GameFAQs theme
	var colorMode = "light";
	if (document.querySelector("body[data-css*='dark'], body[data-css='cloudy']") != undefined) { colorMode = "dark"; }
	debug(`Using colour mode "${colorMode}"`);


	var embedMode = "first";
	// Hook into forum_convert_links function to detect what type of embedding the user wants
	var scriptInjector = function() {
		window.forum_convert_links_OG = window.forum_convert_links; // Save original

		window.forum_convert_links = function(link_type, target) {
			if (target == ".msg .msg_body .msg_text" && link_type >= 0 && link_type <= 5) {
				document.body.dataset.embedMode = link_type;
				window.forum_convert_links = window.forum_convert_links_OG; // got mode, set function back to normal
			}
			window.forum_convert_links_OG(link_type, target);
		};
	}

	injector = document.createElement("script");
	injector.textContent = "(" + scriptInjector.toString() + ")();";
	document.documentElement.appendChild(injector);


	// Process links
	setTimeout(function() { // it's on a tiny delay so it runs after GameFAQs has already converted text into links.

		if (document.querySelector(`script[src*="embed.bsky.app/static/embed.js"]`)) {
			debug("Other Bluesky embed code has been detected, which could be official GameFAQs Bluesky embedding or another script. To avoid possible conflict between the scripts, this script will stop running.", true);
			return;
		}

		// Detect user's embed mode.
		embedMode = "first"; // Default, auto-expands the first embed but keeps the rest click-to-show. Matches GameFAQs setting "0".
		if (document.body.dataset.embedMode) {
			if (document.body.dataset.embedMode == "1" || document.body.dataset.embedMode == "4") {
				embedMode = "click"; // Click-to-show
			} else if (document.body.dataset.embedMode == "3") {
				embedMode = "auto"; // Show all media
			} else if (document.body.dataset.embedMode == "2") {
				// Keep all links as plain text
				debug(`User's "Links and Media in Messages" setting is set to "Keep all links as plain text". Bluesky links will not be embedded.`, true);
				return;
			}
		}
		debug(`Embed mode is "${embedMode}"`);


		var countLinks = document.querySelectorAll(".msg_text a[href*='https://bsky.app/profile/']:not(.bluesky-link)").length;

		if (countLinks < 1) {
			// Abort if no links on page.
			debug("No Bluesky links on this page.", true);
			return;
		}

		debug("There are "+countLinks+" Bluesky links on this page to process");

		addCSS();

		// Process all links
		document.querySelectorAll(".msg_text a[href*='https://bsky.app/profile/']:not(.bluesky-link)").forEach((el) => {
			debug("Processing a Bluesky link");
			var url = el.getAttribute("href");
			el.classList.add("bluesky-link"); // Prevent later calls re-attempting the same link
			var matches = url.match(/https?:\/\/bsky\.app\/profile\/([a-z0-9_\-\:\.]{1,60})\/post\/([a-z0-9]{10,15})/i);
			if (matches) {
				var userdid = "";
				var userhandle = "";
				if (matches[1].startsWith("did:plc:")) { // Direct did:plc link
					userdid = matches[1];
				} else { // link with a handle
					userhandle = matches[1];
					if (sessionStorage.getItem("bsky1-handle-"+userhandle) !== null) { // Handle's did:plc is cached
						userdid = sessionStorage.getItem("bsky1-handle-"+userhandle);
						if (userdid == "error") { return; }// the cached value is an error, don't continue processing
						// Use the cached did:plc
						userdid = userdid.replaceAll(/[^a-z0-9\.\-_:]/gi,"");
					}
				}
				createPlaceholder(el, userhandle, userdid, matches[2], colorMode);
			}
		});

		// Do any embeds need auto-expanding?
		debug("Handling any auto-expands if needed");
		if (embedMode == "first") { // Expand the first embed on the page.
			document.querySelector(".msg_text .bsky-script-container")?.setAttribute("open","open");

		} else if (embedMode == "auto") { // Expand all embeds on the page.
			var hasOpened = [];

			document.querySelectorAll(".msg_text .bsky-script-container").forEach((el) => {
				if (el.dataset.bskyDidplc != "") { // Already has did:plc, safe to open
					el.setAttribute("open","open");
				} else { // Doesn't have a did:plc
					var handle = el.dataset.bskyHandle;
					if (!hasOpened.includes(handle)) { // Only request one per handle, to avoid multiple ajax requests for the same handle
						hasOpened.push(handle);
						el.setAttribute("open","open");
					}
				}
			});
		}

		debug("Finished processing any links present");

	}, 1);



	// Create the Bluesky toggle element, in place of the original link
	function createPlaceholder(element, handle, didplc, messageid, color) {
		var handleOrId = (handle==""?didplc:handle);
		var linkUrl = `https://bsky.app/profile/${handleOrId}/post/${messageid}`;

		var details = document.createElement("details");
		details.classList.add("bsky-script-container");
		details.dataset.bskyDidplc = didplc;
		details.dataset.bskyHandle = handle;
		details.dataset.bskyMessageid = messageid;
		details.dataset.bskyColormode = color;
		details.innerHTML =`
			<summary class="click_embed">
				<i class="plusbox fa fa-plus-square-o"></i>
				<i class="plusbox fa fa-minus-square-o"></i>
				${linkUrl}
				<a class="bluesky-link" href="${linkUrl}" target="_blank">
					<i class="fa fa-external-link"></i>
				</a>
			</summary>
			<div class="loading"></div>
		`;

		details.addEventListener("toggle", openDetails);
		details.addEventListener("toggle", function() { // Pause embedded videos on collapse
			if (!this.open) {
				this.querySelector("iframe.bluesky-embed")?.contentWindow.postMessage("pausevideo", "https://embed.bsky.app"); // Tell iframe to pause any videos
			}
		});
		element.replaceWith(details);
	}


	// Handle embeds being un-collapsed
	async function openDetails() {
		if (this.open && !this.dataset.requested) { // Element has been opened and hasn't been generated before
			this.dataset.requested = "true";

			// Has the did:plc, can go direct to embedding
			if (this.dataset.bskyDidplc && this.dataset.bskyDidplc != "") {
				generateIframe(this, this.dataset.bskyDidplc, this.dataset.bskyMessageid, this.dataset.bskyColormode);

				return;
			}

			// Only has a handle. request data.
			if (this.dataset.bskyHandle && this.dataset.bskyHandle != "") {

				debug(`Requesting handle resolution for "${this.dataset.bskyHandle}"`);

				var handle = this.dataset.bskyHandle;
				var success = false;

				try {
					var bskyFetch = await fetch("https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle="+this.dataset.bskyHandle);
					var bskyResult = await bskyFetch.json();
					if (bskyResult && bskyResult.did) {
						success = true;
					}
				} catch(ex) {}

				if (!success) {
					debug(`Handle request for "${handle}" failed. Caching as error.`);
					// store as an error so don't need to keep re-requesting
					sessionStorage.setItem("bsky1-handle-"+handle, "error");

					// Revert all messages for this handle
					document.querySelectorAll("details.bsky-script-container[data-bsky-handle='"+handle+"']").forEach((el) => {
						revertToLink(el, handle, el.dataset.bskyMessageid);
					});

				} else {
					debug(`Handle request for "${handle}" succeeded. Caching the result.`);
					// We now have a did:plc, cache it
					var userdid = bskyResult.did.replaceAll(/[^a-z0-9\.\-_:]/gi,"");
					sessionStorage.setItem("bsky1-handle-"+handle, userdid);

					document.querySelectorAll("details.bsky-script-container[data-bsky-handle='"+handle+"']").forEach((el) => {
						// for all collapsed messages with the same handle, update them to have this did:plc data
						el.dataset.bskyDidplc = userdid;
						if (embedMode == "auto") { // User wants auto-open, so also open all collapsed messages with this handle
							el.setAttribute("open","open");
						}
					});

					// And generate this message's iframe.
					generateIframe(this, userdid, this.dataset.bskyMessageid, this.dataset.bskyColormode);
				}

				return;
			}

		}
	}

	// Generate and insert the iframe
	function generateIframe(element, didplc, messageid, color) {
		var rand = String(Math.random()).slice(2); // required for bluesky to identify and size unique frames of the same message
		var iframeUrl = `https://embed.bsky.app/embed/${didplc}/app.bsky.feed.post/${messageid}?id=${rand}&ref_url=${encodeURIComponent(location.origin)}&colorMode=${color}`;

		var iframe = document.createElement("iframe");
		iframe.classList.add("bluesky-embed");
		iframe.dataset.customblueskyId = rand; // Bluesky uses [data-bluesky-id], we're using [data-custombluesky-id] so that if an official embed script is added it won't conflict.
		iframe.loading = "lazy";
		iframe.scrolling = "no";
		iframe.setAttribute("target", "_blank");
		iframe.allow = "fullscreen";
		iframe.src = iframeUrl;

		element.append(iframe);
	}


	// Revert to link in case of error
	function revertToLink(element, handleOrId, messageid) {
		var linkUrl = `https://bsky.app/profile/${handleOrId}/post/${messageid}`;

		var link = document.createElement("a");
		link.classList.add("bluesky-link");
		link.setAttribute("target", "_blank");
		link.href = linkUrl;
		link.innerText = linkUrl;

		element.replaceWith(link);
	}


	// Add CSS to page - handles link open/close display, the minimal embed iframe styling, and a loading indicator.
	function addCSS() {
		// Bluesky logo SVG to show on loading embeds. Sourced from https://raw.githubusercontent.com/bluesky-social/social-app/refs/heads/main/bskyembed/assets/logo.svg
		var svglogo = `
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 320 286">
				<path fill="rgb(10,122,255)" d="M69.364 19.146c36.687 27.806 76.147 84.186 90.636 114.439 14.489-30.253 53.948-86.633 90.636-114.439C277.107-.917 320-16.44 320 32.957c0 9.865-5.603 82.875-8.889 94.729-11.423 41.208-53.045 51.719-90.071 45.357 64.719 11.12 81.182 47.953 45.627 84.785-80 82.874-106.667-44.333-106.667-44.333s-26.667 127.207-106.667 44.333c-35.555-36.832-19.092-73.665 45.627-84.785-37.026 6.362-78.648-4.149-90.071-45.357C5.603 115.832 0 42.822 0 32.957 0-16.44 42.893-.917 69.364 19.147Z"/>
			</svg>
		`;

		svglogo = `data:image/svg+xml,${encodeURIComponent(svglogo)}`;

		var css = document.createElement("style");
		css.setAttribute("type", "text/css");
		css.innerHTML = `
			.bsky-script-container {
				& {display:inline;}
				&:open {display:contents;}

				summary {display:inline;}

				&:open .fa-plus-square-o, &:not(:open) .fa-minus-square-o {display:none;}

				.bluesky-embed {width:100%; max-width:600px; height:0; display:block; border:none; margin:0.5em 0;}

				.loading {
					width:32px; height:32px;  margin: 0.5em 6px;
					background: url("${svglogo}") no-repeat center / contain;
					animation: bskyloading 1s alternate infinite;
				}

				.loading:has(+ iframe.loaded) {display: none;}
			}

			@keyframes bskyloading {
				0%, 60% { opacity:1; }
				100% { opacity:0.5; }
			}
		`;
		document.body.append(css);
		debug("Added CSS to page");
	}

	// Resize the frames when loaded or page has changed size
	// Taken and modified from https://embed.bsky.app/static/embed.js so we don't need to use the full script
	window.addEventListener('message', function (event) {
		if (event.origin !== 'https://embed.bsky.app') {
			return;
		}
		var id = event.data.id;
		if (!id) {
			return;
		}
		var embed = document.querySelector("[data-custombluesky-id=\"".concat(id, "\"]")); // Bluesky uses [data-bluesky-id], we're using [data-custombluesky-id] so that if an official embed script is added it won't conflict.
		if (!embed) {
			return;
		}
		if (!embed.classList.contains("loaded")) {
			embed.classList.add("loaded");
			embed.contentWindow.postMessage("inlinevideo", "https://embed.bsky.app"); // Tell the embed to prepare any inline video
		}
		var height = event.data.height;
		if (height) {
			embed.style.height = "".concat(Math.ceil(height), "px");
		}
	});

})();