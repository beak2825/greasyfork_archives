// ==UserScript==
// @name        Twitter Inline Expansion
// @namespace   https://github.com/an-electric-sheep/
// @description Inline-expansion of :orig (full-resolution) twitter images
// @include     https://twitter.com/*
// @include     https://mobile.twitter.com/*
// @include     https://tweetdeck.twitter.com/*
// @version     0.4.0
// @run-at			document-start
// @noframes
// @grant       unsafeWindow
// @grant				GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/21409/Twitter%20Inline%20Expansion.user.js
// @updateURL https://update.greasyfork.org/scripts/21409/Twitter%20Inline%20Expansion.meta.js
// ==/UserScript==

'use strict';

const cssPrefix = "mediatweaksuserscript";

// normal + mobile page + tweetdeck
const TweetImageSelector = `
	.tweet .js-adaptive-photo img ,
	.Tweet .CroppedPhoto img ,
  .js-stream-item-content a.js-media-image-link
`;
	
const TweetVideoSelector = ".AdaptiveMedia-video iframe";

let alreadyVisited = new WeakSet();

	
function prefixed(str) {
	return cssPrefix + str;	
}


function mutationObserverCallback(mutations) {
		try {
			for(let mutation of mutations) {
				if(mutation.type != "childList")
					continue;
				for(let node of [mutation.target, ...mutation.addedNodes]) {
					if(node.nodeType != Node.ELEMENT_NODE)
						continue;

					onAddedNode(node)
					for(let subNode of node.querySelectorAll(TweetVideoSelector))
						onAddedNode(subNode);
					for(let subNode of node.querySelectorAll(TweetImageSelector))
						onAddedNode(subNode);
				}
			}
		} catch(e) {
			console.log(e)
		}

}

function visitOnce(element, func) {
	if(alreadyVisited.has(element))
		return;
	alreadyVisited.add(element);
	func()
}

function onAddedNode(node) {
	if(node.matches(TweetImageSelector)) {
		visitOnce(node, () => {
			addImageControls(node.closest(".tweet, .Tweet, .js-stream-item-content"),node);
		})
	}
	
	if(node.matches(TweetVideoSelector)) {
		// we match an iframe here. once on the parent because iframes get reloaded when scrolling
		visitOnce(node.parentElement, () => {
			addVideoControls(node.closest(".tweet"), node)
		})
	}
}

function controlContainer(target) {
	let div = target.querySelector(`.${cssPrefix}-thumbs-container`);
	if(!div) {
		div = document.createElement("div")
		target.appendChild(div)
		div.className = prefixed("-thumbs-container")
	}		
	
	return div;
}

function addImageControls(tweetContainer, image) {
	let src;
	if(image.localName == "a") {
		src = image.style.backgroundImage.match(/^url\("(.*)"\)$/)[1];
	} else {
		src = image.src;		
	}
	
	let origSrc = src + ":orig"
	
	let div = controlContainer(tweetContainer);
	
	div.insertAdjacentHTML("beforeend", `
			<a class="${cssPrefix}-orig-link ${cssPrefix}-thumb" data-${cssPrefix}-small="${src}" href="${origSrc}"><img src="${src}"></a>
	`)
}

const supportedContentTypes = [
		{
			// https://twitter.com/age_jaco/status/623712731456122881/photo/1
			matcher: (config) => config.content_type == "video/mp4",
			ext: "mp4",
			loader:	fetchMP4
		},
		{
			// https://twitter.com/MrNobre/status/754144048529625088
			matcher: (config) => config.content_type == "application/x-mpegURL",
			ext: "ts",
			loader: fetchMpegTs
		},{
			// https://twitter.com/mkraju/status/755368535619145728
			matcher: (config) => "vmap_url" in config,
			ext: "mp4",
			loader: fetchVmap
		}
]

// can't use fetch() API here since it's blocked by CSP
function fetchVmap(configPromise) {
	return configPromise.then(config => {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: "GET",
				url: config.vmap_url,
				responseType: "xml",
				anonymous: true,
				onload: (rsp) => { resolve(rsp.responseXML) },
				onerror: (e) => {	reject(e)	}
			})
		})
	}).then(xmlDoc => {
		let url = xmlDoc.querySelector("*|MediaFile").textContent;
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: "GET",
				url: url,
				responseType: "blob",
				anonymous: true,
				onload: (rsp) => { resolve(rsp.response) },
				onerror: (e) => {	reject(e)	}
			})
		})
	})
}

function fetchMpegTs(configPromise) {
	let baseURL = null;
	
	return configPromise.then(config => {
		baseURL = config.video_url
		
		return fetch(config.video_url, {redirect: "follow", mode: "cors"}).then((response) => {
			return response.text()
		})
	}).then((playlist) => {
		let highestResolution = playlist.split(/\n/).filter(str => !str.startsWith("#")).filter(str => str.length > 0).pop()
		let fetchUrl = new URL(baseURL)
		fetchUrl.pathname = highestResolution
		return fetch(fetchUrl, {mode: "cors", redirects: "follow"});
	}).then((response) => {
		return response.text()
	}).then((chunkList) => {
		return chunkList.split(/\n/).filter(s => !s.startsWith("#")).filter(s => s.length > 0).map(chunk => {
			let u = new URL(baseURL);
			u.pathname = chunk;
			return u;
		})
	}).then((urls) => {
		return Promise.all(urls.map(u => {
			return fetch(u.toString(), {mode: "cors", redirects: "follow"}).then(response => response.blob())
		}));
	}).then(blobs => {
			return new Blob(blobs);
	})
}

function fetchMP4(configPromise) {
	return configPromise.then(config => {
		return fetch(config.video_url, {redirect: "follow", mode: "cors"}).then(response => response.blob())
	})
}


function addVideoControls(tweetContainer, iframe) {
	
	let mediaConfig = null;
	
	let configPromise = new Promise((resolve, reject) => {
		if(iframe.contentDocument.readyState == "interactive" || iframe.contentDocument.readyState == "complete") {
			resolve(iframe.contentDocument)
			return;
		}
		
		iframe.addEventListener("load", () => resolve(iframe.contentDocument))
	}).then((contentDoc) => {
		let config = JSON.parse(contentDoc.querySelector(".player-container").dataset.config)
		
		mediaConfig = config;
		
		console.log(config)
		
		
		
		if(!supportedContentTypes.find(t => t.matcher(config)))
			throw new Error(`unknown video configuration, unable to fetch data`);
		
		return config
	})
	
	const controls = controlContainer(tweetContainer)
	
	controls.insertAdjacentHTML("beforeend", `
		<a download="${Date.now()}.ts" href="#">download</a><span class="${cssPrefix}-progress"></span>
	`)
	
	let finalBlob = null;	
	const link = controls.querySelector("a[download]");
	
	let exceptionHandler = (message) => {
		return (exception) => {
			controls.insertAdjacentHTML("beforeend", `
					<span class="${cssPrefix}-error">
						${message}:
						${exception.toString()}
					</span>
				`)
		}
	}
	
	configPromise.catch(exceptionHandler("An error occured while reading the video metadata"))
	
	configPromise.then(config => {
		const type = supportedContentTypes.find(t => t.matcher(config))
		
		let filename = `@${config.user.screen_name} ${config.tweet_id}.${type.ext}`
		link.download = filename;
		link.appendChild(document.createTextNode(": " + filename))
	})
	
	
	link.addEventListener("click", (e) => {
		if(finalBlob != null)
			return;
		
		e.preventDefault();
		
		configPromise.then(config => {
			const type = supportedContentTypes.find(t => t.matcher(config))
			return type.loader(configPromise)
			
		}).then(blob => {
			finalBlob = blob;
			
			link.href = URL.createObjectURL(finalBlob);

			// fire new click event since we prevent-defaulted it earlier
			link.click();
		}).catch(exceptionHandler("An error occurred while downloading the video"))
				
	})
}

let observer = null 

function init() {
	const config = { subtree: true, childList: true };
	
	observer = new MutationObserver(mutationObserverCallback);
	observer.observe(document.documentElement, config);
	
	document.addEventListener("DOMContentLoaded", ready)
	document.addEventListener("click", thumbToggleHandler, true)
	document.addEventListener("keypress", keyboardNav)
	
} 

function thumbToggleHandler(event) {
	if(event.button != 0)
		return;
	let link = event.target.closest(`.${cssPrefix}-orig-link`); 
	if(!link)
		return;

	event.stopImmediatePropagation();
	event.preventDefault();
	
	thumbToggle(link)
}


function thumbToggle(link) {
	let img = link.querySelector("img");

	return new Promise((res, rej) => {
  	if(link.classList.contains(prefixed("-expanded"))) {
			img.src = link.dataset[cssPrefix + "Small"];
			link.classList.add(prefixed("-thumb"))
			link.classList.remove(prefixed("-expanded"))
			res(link)
		} else {
			let f = () => {
				link.classList.add(prefixed("-expanded"))
				link.classList.remove(prefixed("-thumb"))
				img.removeEventListener("load", f)
				res(link)
			}
			
			img.addEventListener("load", f)
			img.src = link.href;
		}
		
	})
}

const style = `
.${cssPrefix}-thumbs-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

a.${cssPrefix}-orig-link {
	padding: 5px;
} 

.${cssPrefix}-orig-link.${cssPrefix}-thumb img {
	max-width: 60px;
	max-height: 60px;
	vertical-align: middle;
}

a.${cssPrefix}-expanded {
	width: -moz-fit-content;
	width: fit-content;
}

a.${cssPrefix}-expanded img {
	width: -moz-fit-content;
	width: fit-content;
	max-width: 95vw;
}

.${cssPrefix}-focused {
	outline: 3px solid green !important;
}

.${cssPrefix}-shortcuts {
  list-style:initial;
  padding-left: 1em;
}


/* mobile */
section.Timeline {
	overflow: visible;
} 
`;

const info = `
Userscript Keyboard Shortcuts:
<ul class="${prefixed("-shortcuts")}">
<li>Navigate between posts with images with WD or Up/Down arrows
<li>Expand with Q or Spacebar
<li>Download with E
</ul>
`;

function ready() {
	let styleEl = document.createElement("style");
	styleEl.textContent = style;
	document.head.append(styleEl);
	document.querySelector(".ProfileSidebar").insertAdjacentHTML("beforeend", info)
}

function keyboardNav(e) {
	// skip keyboard events when in inputs
	if (e.target.isContentEditable || ("selectionStart" in document.activeElement))
		return;


	let focus = null;
	let prevent = false;
	if (e.key == "w" || e.key == "ArrowUp" ) {
		focus = moveFocus(-1);
		prevent = true;
	}

	if (e.key == "s" || e.key == "ArrowDown" ) {
		focus = moveFocus(1);
		prevent = true;
	}
	
	if(e.key == "q" || e.key == " ") {
		let cf = currentFocus();
		let expandable = cf && Array.from(cf.querySelectorAll("." + prefixed("-thumb"))) || []
		let first = expandable.map((ex) => thumbToggle(ex)).shift()
		if(first)
			first.then((f) => {
				setFocus(f, cf)
			});
		prevent = true;
	}

	if(focus) {
		setFocus(focus)
	}
	
	if (e.key == "e") {
		let cf = currentFocus();
		if(!cf)
			return;
		let config = cf.closest(".tweet").dataset
		let todownload = [];
		if(cf.matches("." + prefixed("-expanded")))
			 todownload.push(cf.href);
		todownload.push(...Array.from(cf.querySelectorAll("a." + prefixed("-orig-link"))).map((el) => el.href))
		
		for(let link of todownload) {
			downloadOrig(link, config)
		}
		prevent = true;
	}
	
	if(prevent)
		e.preventDefault();
}

function downloadOrig(url, meta) {
		fetch(url, {redirect: "follow", mode: "cors"}).then(response => response.blob()).then((blob) => {
				const a = document.createElement("a")
				const blobUri = URL.createObjectURL(blob);
  			a.href = blobUri
  	 		
  			let name = url.match(/^.*\/(.*?):orig$/)[1]
  			a.download = `@${meta.screenName} ${meta.tweetId} orig ${name}`
  			const event = document.createEvent("MouseEvents")
  			event.initMouseEvent(
  				"click", true, false, window, 0, 0, 0, 0, 0,
  				false, false, false, false, 0, null
  			)
  			a.dispatchEvent(event)
		})
}

function setFocus(focus, expect) {
		let cf = currentFocus()
		if(expect && cf != expect)
			return;
		if(cf)
			cf.classList.remove(prefixed("-focused"));
		focus.classList.add(prefixed("-focused"))
		focus.scrollIntoView()
		let offset = document.querySelector(".ProfileCanopy-inner");
		offset = offset && offset.scrollHeight
		if(offset) {
			offset = offset + 5;
			window.scrollBy(0, -offset);
		} 
			
}

function currentFocus() {
	return document.querySelector(`.${prefixed("-focused")}`)
}

function mod(n, m) {
	return ((n % m) + m) % m;
}

function moveFocus(direction) {
	// TODO: mobile, tweetdeck
	
	let focusable = Array.from(document.querySelectorAll(`.tweet.has-content, .${prefixed("-expanded")}`))
	let idx = -1
	let cf = currentFocus()
	if(cf)
		idx = focusable.indexOf(cf);
	idx += direction;
	idx = mod(idx, focusable.length)
	let newFocus = focusable[idx]
	
	return newFocus
}


init();