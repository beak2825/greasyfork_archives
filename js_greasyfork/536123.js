// ==UserScript==
// @name        bagscript with few custom modifications
// @description bag script with anti bot features + more
// @version     0.9.6.2
// @license     MIT
// @namespace   9e7f6239-592e-409b-913f-06e11cc5e545_
// @match       *://8chan.moe/v/res/*
// @match       *://8chan.se/v/res/*
// @match       *://8chan.cc/v/res/*
// @match       *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/v/res/*
// @match       *://8chan.moe/barchive/res/*
// @match       *://8chan.se/barchive/res/*
// @match       *://8chan.cc/barchive/res/*
// @match       *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/barchive/res/*
// @match       *://8chan.moe/test/res/*
// @match       *://8chan.se/test/res/*
// @match       *://8chan.cc/test/res/*
// @match       *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/test/res/*
// @grant       unsafeWindow
// @grant       GM_addStyle
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/536123/bagscript%20with%20few%20custom%20modifications.user.js
// @updateURL https://update.greasyfork.org/scripts/536123/bagscript%20with%20few%20custom%20modifications.meta.js
// ==/UserScript==

//GM_addStyle(`
//	div:not(.nicePost) > .innerPost:not(.hidden) > .panelUploads .uploadCell img:not(.imgExpanded):hover { filter: blur(0px); transition-delay: 0.35s; }
//	/*div.quoteTooltip img:not(.imgExpanded) { filter: blur(0px) !important; }*/
//`);

const style = document.createElement('style');
style.textContent = `
	div:not(.nicePost) > .innerPost:not(.hidden) > .panelUploads .uploadCell img:not(.imgExpanded):hover { filter: blur(0px); transition-delay: 0.35s; }
`;
document.head.appendChild(style);

const threadID = document.querySelector(".innerOP .opHead .linkQuote").innerHTML;
const boardUri = document.querySelector('.opCell').getAttribute('data-boarduri');

function getUniqueLabelIds() {
	try {
		const elements = document.querySelectorAll('.labelId');

		if(elements.length === 0) {
			console.warn('No elements with class "labelId" found');
			return [];
		}

		const seen = new Set();
		const uniqueIds = [];

		elements.forEach(el => {
			const id = el.textContent.trim();
			if(id && !seen.has(id)) {
				seen.add(id);
				uniqueIds.push(id);
			}
		});

		return uniqueIds;
	} catch (error) {
		console.error('Error retrieving label IDs:', error);
		return [];
	}
}

function idsRelation(targetId = null, options = {}) {
	try {
		const allPosts = document.querySelectorAll('.innerPost');

		// If specific ID is requested
		if(targetId !== null) {
			const targetIdStr = String(targetId).trim();
			const postsForId = [];

			allPosts.forEach(post => {
				const labelIdElement = post.querySelector('.labelId');
				if(labelIdElement && labelIdElement.textContent.trim() === targetIdStr) {
					postsForId.push(post);
				}
			});

			return postsForId;
		}

		// If no specific ID, return full relation object
		const relation = {};

		allPosts.forEach(post => {
			const labelIdElement = post.querySelector('.labelId');

			if(labelIdElement) {
				const id = labelIdElement.textContent.trim();

				if(id) {
					if(!relation[id]) {
						relation[id] = [];
					}
					relation[id].push(post);
				} else {
					if(!relation['blank']) {
						relation['blank'] = [];
					}
					relation['blank'].push(post);
				}
			} else {
				if(!relation['blank']) {
					relation['blank'] = [];
				}
				relation['blank'].push(post);
			}
		});

		return relation;
	} catch (error) {
		console.error('Error creating ID relation:', error);
		return targetId !== null ? [] : {};
	}
}

// Usage examples:
/*
// 1. Get all IDs with their posts
//const allIdsMap = idsRelation();
//console.log('All IDs:', allIdsMap);

//{
//    "442440": [div.innerPost, div.innerPost, ...],
//    "586669": [div.innerPost, div.innerPost, ...],
//    ...
//}


// 2. Get posts for specific ID only
//const posts442440 = idsRelation(442440);
//console.log('Posts for 442440:', posts442440);

//[
//    <div class="innerPost">,
//    <div class="innerPost">,
//    <div class="innerPost">
//]


// 3. Get posts for specific ID as string
//const posts586669 = idsRelation("586669");
//console.log('Posts for 586669:', posts586669);
*/

// Spoiler colors
const color_bg = 'rgba(0,0,0,0.6)';
const color_icon = 'rgba(255,255,0,1)';

// Script settings
const FUN_TEXT_SELECTOR = ".doomText, .moeText, .redText, .pinkText, .diceRoll, .echoText";
let RUDE_FORMATS = [""];
if(/\/v\//.test(location.href)) RUDE_FORMATS = ["JPEG", "JPG", "PNG"];
/*let RUDE_FORMATS = ["JPEG", "JPG", "PNG"]; if(/\/barchive\//.test(location.href)) RUDE_FORMATS = ["DUMMYQWERTUZFDXHFDHFDHDFHDF"];*/
const THREAD_LOCKED_AT = /*1500*/ 1000;
const URL_PREFIX = location.href.split("/").slice(0, 4).join("/");

// Colors
const BAN_BUTTON_BORDER = "1px solid red";
const RUDE_BORDER = "1px solid red";
const SPOILER_BORDER = "3px solid red";
const THREAD_FOUND_BORDER = "5px solid green";
const THREAD_NOT_FOUND_BORDER = "5px solid red";

// Janny tool settings
const BOT_BAN_DURATION = "3d";
const BOT_BAN_REASON = "bot";

// Debug settings
const DEBUG_TOOLS_VISIBLE = false;
const FORCE_NEXT_THREAD_FAIL = false;

// Tooltips / Info / Etc
const NOT_A_JANNY = "You aren't a janny dumbass."
const BOT_BAN_BUTTON_WARNING = "WARNING: The ban buttons will immediately issue a ban + " +
	"delete by IP for the poster WITH NO CONFIRMATION. The ban reason and duration can be " +
	"set in the script (refresh after modifying). Are you sure you want to turn this on?";

// State
let checkedJannyStatus = false;
let manualBypass;
let defaultSpoilerSrc;
let loggedInAsJanny = false;
let menuVisible = false;
const settings = {};
let styleBuilt = false;
let threadsClosed = false;
let whitelist = {};

const postsContainer = document.querySelector(".divPosts");
const quoteTooltip = document.querySelector(".quoteTooltip");

// Style
const _bagStyle = document.createElement("style");
_bagStyle.id = "bagStyle";

const bagStyle = document.head.appendChild(_bagStyle).sheet;
bagStyle.disabled = true;

const styleIndex = {
	"postStub": 2,
	"rudePost": 1,
	"rudePostImage": 0,
};

// New post observer
const postObserver = new MutationObserver((mutations) => {
	for(const mutation of mutations) {
		for(const node of mutation.addedNodes) {
			if(node.nodeType === 1) {
				const isPost = node.classList.contains("postCell");
				if(isPost) {
					if(settings.findNextThread && !threadsClosed) {
						const totalPostCount = document.querySelector("#postCount").innerText;
						const archiveIndicator = document.querySelector("#mainPanel #threadList #divThreads .innerOP .opHead .archiveIndicator"); //Hyper specific querySelector, don't want it to be triggered by a quote hover
						if(totalPostCount >= THREAD_LOCKED_AT || archiveIndicator) {
							threadsClosed = true;
							addNextThreadFakePost();
						}
					}

					const id = postId(node);
					idsRelation(id).forEach((innerPost) => {
						processAllPostsById(id);
					});

					node.querySelectorAll(".quoteLink").forEach((quoteLink) => {
						const quotedId = quoteLink.innerText.substring(2);
						const quotedPost = document.getElementById(quotedId);
						if(quotedPost) {
							processSinglePost(quotedPost);
						}
					});
				}
			}
		}
	}
});

// Quote hover observer
const hoverObserver = new MutationObserver((mutations) => {
	for(const mutation of mutations) {
		for(const node of mutation.addedNodes) {
			if(node.nodeType === 1) {
				const isInnerPost = node.classList.contains("innerPost");
				const hasId = postId(node.parentElement);
				if(isInnerPost && hasId) {
					const post = node.parentElement;
					post.classList.remove("nicePost");
					processSinglePost(post);
					return;
				}

			}
		}
	}
});

// Inline quote listener
postsContainer.addEventListener("click", (evt) => {
	const quoteLink = evt.target.closest(".quoteLink");
	if(quoteLink) {
		setTimeout(() => {
			if(quoteLink.nextElementSibling?.classList.contains("inlineQuote")) {
				processSinglePost(quoteLink.nextElementSibling);
			}
		}, 0);
	}
});

/***********/
/*********** ADDED SECTION
/***********/

function updateSpoilerMini(image) {
	const imgLink = image.closest('a.imgLink');
	if(!imgLink) return;

	const existingMini = imgLink.querySelector('.sp0iler-mini');
	if(existingMini) {
		return;
	}

	image.removeAttribute("width");
	image.removeAttribute("height");
	//image.setAttribute("width", "225px");
	//image.setAttribute("height", "180px");
	image.setAttribute("data-spoiler", true);

	// Add spoiler-mini
	const spoilerMini = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	spoilerMini.classList.add('sp0iler-mini');
	spoilerMini.style = "position: absolute; top: 0px; right: 2px; width: 24px; height: 21px; opacity: 1; z-index: 0;"
	spoilerMini.setAttribute('viewBox', '0 -0.5 24 21');
	spoilerMini.setAttribute('shape-rendering', 'crispEdges');
	spoilerMini.innerHTML = `
		<path stroke="${color_bg}" d="M0 0h1M2 1h1M14 1h1M8 20h1" />
		<path stroke="${color_bg}" d="M1 0h4M7 0h3M12 0h1M14 0h4M19 0h3M0 1h2M3 1h1M6 1h2M9 1h5M16 1h5M22 1h2M0 19h1M2 19h2M5 19h7M18 19h3M22 19h2M0 20h2M4 20h1M6 20h1M9 20h2M15 20h4M22 20h2" />
		<path stroke="${color_bg}" d="M5 0h1M10 0h1M13 0h1M18 0h1M13 19h1M14 20h1" />
		<path stroke="${color_bg}" d="M6 0h1M22 0h1M4 15h1M14 19h2M11 20h1M19 20h1" />
		<path stroke="${color_bg}" d="M11 0h1M2 20h1M13 20h1M20 20h2" />
		<path stroke="${color_bg}" d="M23 0h1M17 19h1" />
		<path stroke="${color_bg}" d="M4 1h1M12 19h1M5 20h1" />
		<path stroke="${color_bg}" d="M5 1h1M22 2h1M6 5h1M8 5h1M23 5h1M1 6h1M4 6h1M6 9h1M17 9h1M2 11h1M8 11h1M8 13h1M17 13h1M5 15h1M23 15h1M23 16h1" />
		<path stroke="${color_bg}" d="M8 1h1M15 1h1M4 19h1M16 19h1M12 20h1" />
		<path stroke="${color_bg}" d="M21 1h1" />
		<path stroke="${color_bg}" d="M0 2h1M3 2h4M8 2h3M12 2h1M14 2h3M18 2h4M23 2h1M0 3h3M21 3h3M0 4h1M2 4h1M5 4h1M7 4h1M10 4h1M14 4h3M18 4h1M0 5h3M4 5h2M7 5h1M9 5h1M15 5h1M17 5h1M22 5h1M0 6h1M2 6h1M5 6h1M8 6h1M17 6h2M21 6h2M0 7h3M5 7h2M12 7h1M19 7h1M22 7h2M1 8h2M4 8h1M10 8h4M16 8h1M18 8h2M21 8h3M0 9h1M5 9h1M8 9h3M16 9h1M18 9h1M21 9h2M1 10h2M4 10h2M8 10h2M15 10h4M21 10h3M0 11h1M4 11h1M7 11h1M15 11h2M18 11h1M21 11h2M0 12h2M5 12h3M9 12h2M13 12h2M17 12h3M21 12h3M0 13h2M4 13h3M10 13h4M15 13h2M18 13h2M22 13h2M0 14h2M4 14h2M7 14h1M9 14h1M13 14h6M21 14h3M0 15h2M6 15h3M10 15h1M13 15h1M19 15h1M0 16h1M2 16h1M5 16h3M9 16h3M13 16h3M17 16h3M21 16h1M0 17h2M23 17h1M0 18h2M3 18h1M5 18h3M9 18h3M13 18h1M17 18h3M22 18h2" />
		<path stroke="${color_bg}" d="M1 2h1" />
		<path stroke="${color_bg}" d="M2 2h1M13 2h1M6 4h1M12 4h1M14 5h1M19 6h1M11 7h1M5 8h1M7 10h1M10 10h1M9 11h2M2 13h1M14 15h2M18 15h1M4 16h1M8 18h1M16 18h1" />
		<path stroke="${color_bg}" d="M7 2h1" />
		<path stroke="${color_bg}" d="M11 2h1M1 4h1M8 4h1M22 4h1M23 6h1M7 7h1M16 7h2M7 9h1M19 9h1M14 11h1M17 11h1M8 14h1M19 14h1M9 15h1M17 15h1M22 15h1M22 16h1M2 17h1" />
		<path stroke="${color_bg}" d="M17 2h1M4 4h1M11 4h1M19 5h1M21 5h1M7 6h1M15 6h1M7 8h1M6 10h1M19 10h1M5 11h2M15 12h1M9 13h1M2 15h1M8 16h1M12 16h1M2 18h1M4 18h1M12 18h1M15 18h1M21 19h1" />
		<path stroke="${color_icon}" d="M3 3h1M3 5h1M20 6h1M9 8h1M3 10h1M20 13h1M4 17h1" />
		<path stroke="${color_icon}" d="M4 3h1M6 3h5M12 3h1M14 3h5M20 3h1M20 4h1M13 5h1M3 6h1M9 6h6M3 7h1M9 7h2M13 7h2M20 7h1M14 8h2M20 8h1M3 9h1M13 9h3M20 9h1M13 10h1M20 10h1M3 11h1M11 11h3M20 11h1M12 12h1M20 12h1M11 14h1M20 14h1M11 15h2M20 15h1M20 16h1M3 17h1M5 17h3M10 17h2M16 17h5" />
		<path stroke="${color_icon}" d="M5 3h1M11 3h1M3 4h1M11 5h1M8 7h1M11 12h1M15 17h1" />
		<path stroke="${color_icon}" d="M13 3h1M20 5h1M3 13h1M3 14h1" />
		<path stroke="${color_icon}" d="M19 3h1" />
		<path stroke="${color_bg}" d="M9 4h1M19 4h1M21 4h1M16 6h1M18 7h1M0 8h1M6 8h1M17 8h1M1 9h1M4 9h1M11 9h1M0 10h1M19 11h1M23 11h1M16 12h1M21 13h1M2 14h1M21 15h1M22 17h1" />
		<path stroke="${color_bg}" d="M13 4h1M4 7h1M11 10h1" />
		<path stroke="${color_bg}" d="M17 4h1M23 4h1M16 5h1M12 9h1M23 9h1M2 12h1M7 13h1M10 14h1M16 15h1M1 16h1M16 16h1M21 17h1M14 18h1M20 18h2" />
		<path stroke="${color_icon}" d="M10 5h1M3 8h1M14 10h1M8 17h1" />
		<path stroke="${color_icon}" d="M12 5h1M8 8h1M13 17h1" />
		<path stroke="${color_bg}" d="M18 5h1" />
		<path stroke="${color_bg}" d="M6 6h1M4 12h1" />
		<path stroke="${color_icon}" d="M15 7h1M12 10h1M12 14h1M12 17h1M14 17h1" />
		<path stroke="${color_bg}" d="M21 7h1M2 9h1M8 12h1" />
		<path stroke="${color_bg}" d="M1 11h1" />
		<path stroke="${color_icon}" d="M3 12h1M3 15h1M9 17h1" />
		<path stroke="${color_bg}" d="M14 13h1" />
		<path stroke="${color_bg}" d="M6 14h1" />
		<path stroke="${color_icon}" d="M3 16h1" />
		<path stroke="${color_bg}" d="M1 19h1" />
		<path stroke="${color_bg}" d="M3 20h1" />
		<path stroke="${color_bg}" d="M7 20h1" />
	`;

	imgLink.style.position = 'relative';
	imgLink.appendChild(spoilerMini);

	// Observe this image for style changes
	const styleObserver = new MutationObserver((mutations) => {
		mutations.forEach(mutation => {
			image.style.border = "0";
			spoilerMini.style.display = image.style.display;
			if(!settings.enabled || !settings.revealSpoilers) {
				spoilerMini.style.display = 'none';
			}
		});
	});

	styleObserver.observe(image, {
		attributes: true
	});
}

/***********/
/*********** END OF ADDED SECTION
/***********/

// Loading
loadSettings();
loadMenu();

function onEnableScript() {
	loadStyle();

	const initialPosts = postsContainer.children;
	const archiveIndicator = document.querySelector("#mainPanel #threadList #divThreads .innerOP .opHead .archiveIndicator"); //Hyper specific querySelector, don't want it to be triggered by a quote hover
	if(initialPosts.length >= THREAD_LOCKED_AT || archiveIndicator) {
		threadsClosed = true;
		addNextThreadFakePost(0, true);
	}

	processAllPosts();

	checkIfJanny((isJanny) => {
		if(isJanny) {
			let selector = ".jannyTab";
			if(settings.showJannyTools) selector += ", .jannyTools";
			document.querySelectorAll(selector).forEach((e) => {
				e.style.display = "flex";
			});
		}
	});

	postObserver.observe(postsContainer, {
		childList: true
	});
	hoverObserver.observe(quoteTooltip, {
		childList: true
	});
}

if(settings.enabled) {
	onEnableScript();
}

cleanupOldBypasses();

// Post handling
function processAllPosts() {
	// Anything that triggers a full reprocess needs to reset the whitelist to work without reloading
	whitelist = {};

	for(const id in idsRelation()) {
		processAllPostsById(id);
	}

	document.querySelectorAll(".inlineQuote").forEach((inlineQuote) => {
		processSinglePost(inlineQuote);
	});

	const hoverPost = document.querySelector(".quoteTooltip");
	if(hoverPost) {
		processSinglePost(hoverPost);
	}
}

function processAllPostsById(id) {
	idsRelation(id).forEach((innerPost) => {
		if(innerPost?.parentElement) {
			processSinglePost(innerPost.parentElement);
		}
	});
}

function processSinglePost(post) {
	// Handle spoilers
	/*const images = post.querySelectorAll(".uploadCell img");
	images.forEach((image) => {
		image.removeAttribute("width");
		image.removeAttribute("height");
		const isSpoiler = image.src.includes("spoiler") || image.getAttribute("data-spoiler");
		if(isSpoiler) {
			defaultSpoilerSrc ??= image.src;

			if(settings.enabled && settings.revealSpoilers) {
				//image.removeAttribute("width");
				//image.removeAttribute("height");
				//image.setAttribute("width", "225px");
				//image.setAttribute("height", "180px");
				//image.setAttribute("max-width", "225px");
				//image.setAttribute("max-height", "225px");
				image.setAttribute("data-spoiler", true);

				const uploadCell = image.closest('.uploadCell');
				//const parent = image.parentElement;
				const parent = image.closest('a.imgLink');
				const fileName = parent.href.split("/")[4];
				//const noThumbnail = !fileName.includes(".");
				const dimensionLabel = uploadCell.querySelector('.dimensionLabel'); // e.g. '123x123'
				const dataFilemime = parent.getAttribute('data-filemime');

				//if (noThumbnail) {
				//	image.src = `/.media/${fileName}`;
				//} else {
				//	image.src = `/.media/t_${fileName.split(".")[0]}`;
				//}

				// Set the full image as the thumbnail for images that are 220x220 pixels or smaller.
				// This is a fix for small images because thumbnails are not generated for them.
				// This crap does not apply to GIFs, GIFs always have generated thumbnails.
				if(dimensionLabel && /^image\/.+$/.test(dataFilemime) && !/^image\/gif$/.test(dataFilemime)) {
					const dimensions = dimensionLabel.textContent.trim().split(/x|×/, 2).map(v => parseInt(v));
					if(dimensions.length === 2 && dimensions[0] <= 220 && dimensions[1] <= 220) {
						image.src = `/.media/${fileName}?`;
					} else {
						image.src = `/.media/t_${fileName.split(".")[0]}`;
					}
				} else {
					image.src = `/.media/t_${fileName.split(".")[0]}`;
				}

				//image.style.border = SPOILER_BORDER;
				updateSpoilerMini(image); //////////////////////////////////////////////////////////////////////////////////////////////////////////// ADDED
			} else {
				//image.src = defaultSpoilerSrc;
				//image.style.border = "0";
				updateSpoilerMini(image); //////////////////////////////////////////////////////////////////////////////////////////////////////////// ADDED
			}
		}
	});*/

	// Don't process OP further
	const isOp = post.classList.contains("opCell");
	if(isOp) return;

	const isHover = post.classList.contains("quoteTooltip");

	// Handle rude posts
	const posterId = postId(post);
	const isNice = whitelist[posterId] || isNicePost(post);
	if(isNice && !isHover) whitelist[posterId] = true;

	if(!settings.enabled || isNice) {
		post.classList.add("nicePost");

		if(!isHover) {
			const bypassButton = post.querySelector(".bypassButton");
			if(bypassButton) {
				bypassButton.style.display = "none";
			}

			const jannyTools = post.querySelector(".jannyTools");
			if(jannyTools) {
				jannyTools.remove();
			}
		}

	} else {
		post.classList.remove("nicePost");

		if(!isHover) {
			const bypassButton = post.querySelector(".bypassButton");
			if(bypassButton) {
				bypassButton.style.display = "inline";
			} else {
				post.querySelector(".postInfo.title").appendChild(bypassButtonForPost(post));
			}

			addJannyToolsToPost(post);
		}
	}
}

function isNiceId(id) {
	if(!id) return false;

	for(const innerPost of idsRelation(id)) {
		if(isNicePost(innerPost.parentElement)) {
			return true;
		}
	}

	return false;
}

function isNicePost(post) {
	if(post.classList.contains("opCell")) {
		return true;
	}

	// don't blur Cross-thread quotes/hovers
	const isHover = post.classList.contains("quoteTooltip");
	if(isHover) {
		const element = document.querySelector('.innerPost.clone[data-uri]');
		if (!element) return true;
		return !element.getAttribute('data-uri').includes(threadID); // Returns false if data-uri contains threadID, true otherwise
	}

	// opCell from merged thread
	/*const posterId = post.classList.contains("labelId");
	if(!posterId) {
		return true;
	}*/

	const id = postId(post);
	if(!id) return false;

	if(manualBypass[id]) return true;

	const innerPosts = idsRelation(id);
	if(!innerPosts) return false;

	const idAboveThreshold = innerPosts.length >= settings.postThreshold;
	if(idAboveThreshold) return true;

	if(settings.whitelist.isYou) {
		const postIsByYou = post.querySelector(".youName");
		if(postIsByYou) return true;
	}

	if(settings.whitelist.isOp) {
		const isOp = document.querySelector(".opCell .labelId").innerText === id;
		if(isOp) return true;
	}

	const backlinks = post.querySelector(".postInfo").querySelectorAll(".panelBacklinks > a");
	const aboveBlThreshold = backlinks.length >= settings.backlinkThreshold;
	if(aboveBlThreshold) return true;

	if(settings.whitelist.hasFunText) {
		const hasFunText = post.querySelector(FUN_TEXT_SELECTOR);
		if(hasFunText) return true;
	}

	// Image heuristics
	const images = post.querySelectorAll(".uploadCell img:not(.imgExpanded)");

	if(settings.whitelist.hasNoImages) {
		const noImages = images.length === 0;
		if(noImages) return true;
	}

	let spoilerCount = 0;
	for(const image of images) {
		if(settings.whitelist.hasSpoilerImage) {
			const spoilerImage = image.getAttribute("data-spoiler") === "true"
			if(spoilerImage) spoilerCount++;

		}

		const format = image.parentElement.href?.split("/")?.[4]?.split(".")?.[1]?.toUpperCase();

		if(settings.whitelist.hasAnimatedPng) {
			const mime = image.parentElement.getAttribute("data-filemime");
			if(mime === "image/apng") return true;
			if(mime === "image/png" && !format) return true;
		}

		if(settings.whitelist.hasGoodExtension) {
			if(format) {
				const notRudeImage = !RUDE_FORMATS.includes(format);
				if(notRudeImage) return true;
			}
		}
	}

	if(images.length > 0 && spoilerCount === images.length) return true;

	return false;
}

// Menu
function loadMenu() {
	document.getElementById("bagMenu")?.remove();

	const menuFragment = new DocumentFragment();

	// Menu container
	const menu = document.createElement("div");
	menuFragment.appendChild(menu);
	menu.id = "bagMenu";
	menu.style.bottom = "0px";
	menu.style.color = "var(--navbar-text-color)";
	menu.style.display = "flex";
	menu.style.gap = "1px";
	menu.style.right = "0px";
	menu.style.padding = "1px";
	menu.style.position = "fixed";
	menu.style.zIndex = "1";

	// Menu contents container
	const menuContents = document.createElement("div");
	menu.appendChild(menuContents);
	menuContents.style.backgroundColor = "var(--navbar-text-color)";
	menuContents.style.border = "1px solid var(--navbar-text-color)";
	menuContents.style.display = menuVisible ? "flex" : "none";
	menuContents.style.flexDirection = "column";
	menuContents.style.gap = "1px";

	// Tabs container
	const tabs = document.createElement("div");
	tabs.style.display = "flex";
	tabs.style.gap = "1px";

	buildGeneralTab(tabs, menuContents);
	buildFilterTab(tabs, menuContents);
	buildFinderTab(tabs, menuContents);
	buildJannyTab(tabs, menuContents);
	buildDebugTab(tabs, menuContents);

	menuContents.appendChild(tabs);
	addToggleButton(menu, menuContents);

	document.getElementsByTagName("body")[0].appendChild(menuFragment);
}

function buildGeneralTab(tabsContainer, contentContainer) {
	const generalTab = makeTab("General");
	tabsContainer.appendChild(generalTab);

	const generalTabContainer = makeTabContainer("General");
	contentContainer.appendChild(generalTabContainer);

	// Enable checkbox
	const enableContainer = makeContainer();
	generalTabContainer.appendChild(enableContainer);

	const enableLabel = makeLabel("Enable Script");
	enableContainer.appendChild(enableLabel);

	const enableCheckbox = makeCheckbox(settings.enabled);
	enableContainer.appendChild(enableCheckbox);
	enableCheckbox.onchange = () => {
		settings.enabled = enableCheckbox.checked;
		localStorage.setItem("bag_enabled", settings.enabled);

		if(settings.enabled) {
			onEnableScript();
		} else {
			postObserver.disconnect();
			hoverObserver.disconnect();
			bagStyle.disabled = true;
			processAllPosts();
		}
	};

	// Reveal spoilers checkbox
	const revealContainer = makeContainer();
	generalTabContainer.appendChild(revealContainer);

	const revealLabel = makeLabel("Reveal Spoilers");
	revealContainer.appendChild(revealLabel);

	const revealCheckbox = makeCheckbox(settings.revealSpoilers);
	revealContainer.appendChild(revealCheckbox);
	revealCheckbox.onchange = () => {
		settings.revealSpoilers = revealCheckbox.checked;
		setSetting("bag_revealSpoilers", settings.revealSpoilers);

		processAllPosts();
	};

	// Hide stubs checkbox
	const hs = makeContainer();
	generalTabContainer.appendChild(hs);

	const hsLabel = makeLabel("Hide Stubs");
	hs.appendChild(hsLabel);

	const hsCheckbox = makeCheckbox(settings.hideStubs);
	hs.appendChild(hsCheckbox);
	hsCheckbox.onchange = () => {
		settings.hideStubs = hsCheckbox.checked;
		setSetting("bag_hideStubs", settings.hideStubs);

		const display = settings.hideStubs ? "none" : "inline";
		setStyle("postStub", "display", display, true);
	}
}

function buildFilterTab(tabsContainer, contentContainer) {
	const filterTab = makeTab("Filter");
	tabsContainer.appendChild(filterTab);

	const filterTabContainer = makeTabContainer("Filter");
	contentContainer.appendChild(filterTabContainer);

	// Blur input
	const blurContainer = makeContainer();
	filterTabContainer.appendChild(blurContainer);

	const blurLabel = makeLabel("Blur Strength");
	blurContainer.appendChild(blurLabel);

	const blurInput = makeInput(settings.blurStrength);
	blurContainer.appendChild(blurInput);
	blurInput.onchange = () => {
		settings.blurStrength = blurInput.value;
		localStorage.setItem("bag_blurStrength", settings.blurStrength);

		const blurLevel = isNaN(settings.blurStrength) ? 0 : settings.blurStrength;
		const newFilter = `blur(${blurLevel}px)`;
		setStyle("rudePostImage", "filter", newFilter);
	};

	// Filter border checkbox
	const filterBorder = makeContainer();
	filterTabContainer.appendChild(filterBorder);

	const filterBorderLabel = makeLabel("Add Border");
	filterBorder.appendChild(filterBorderLabel);

	const filterBorderCheckbox = makeCheckbox(settings.filterBorder);
	filterBorder.appendChild(filterBorderCheckbox);
	filterBorderCheckbox.onchange = () => {
		settings.filterBorder = filterBorderCheckbox.checked;
		setSetting("bag_filterBorder", settings.filterBorder);

		const rudeBorder = settings.filterBorder ? RUDE_BORDER : "0";
		setStyle("rudePost", "border-right", rudeBorder);
	}

	// Hide filtered checkbox
	const hideContainer = makeContainer();
	filterTabContainer.appendChild(hideContainer);

	const hideLabel = makeLabel("Hide Filtered");
	hideContainer.appendChild(hideLabel);

	const hideCheckbox = makeCheckbox(settings.hideFiltered);
	hideContainer.appendChild(hideCheckbox);
	hideCheckbox.onchange = () => {
		settings.hideFiltered = hideCheckbox.checked;
		localStorage.setItem("bag_hideFiltered", settings.hideFiltered);

		const rudeDisplay = settings.hideFiltered ? "none" : "inline-block";
		setStyle("rudePost", "display", rudeDisplay);
	};

	// Whitelist label
	const whitelistContainer = makeContainer();
	filterTabContainer.appendChild(whitelistContainer);

	const whitelistLabel = makeLabel("------- Auto Whitelist -------");
	whitelistContainer.appendChild(whitelistLabel);
	whitelistLabel.style.textAlign = "center";
	whitelistLabel.style.width = "100%";

	// Post threshold input
	const thresholdContainer = makeContainer();
	filterTabContainer.appendChild(thresholdContainer);

	const thresholdLabel = makeLabel("ID Post Count");
	thresholdContainer.appendChild(thresholdLabel);

	const thresholdInput = makeInput(settings.postThreshold);
	thresholdContainer.appendChild(thresholdInput);
	thresholdInput.onchange = () => {
		settings.postThreshold = thresholdInput.value;
		localStorage.setItem("bag_postThreshold", settings.postThreshold);

		processAllPosts();
	};

	// Backlink threshold input
	const blThresholdContainer = makeContainer();
	filterTabContainer.appendChild(blThresholdContainer);

	const blThresholdLabel = makeLabel("Post Quoted Count");
	blThresholdContainer.appendChild(blThresholdLabel);

	const blThresholdInput = makeInput(settings.backlinkThreshold);
	blThresholdContainer.appendChild(blThresholdInput);
	blThresholdInput.onchange = () => {
		settings.backlinkThreshold = blThresholdInput.value;
		setSetting("bag_backlinkThreshold", settings.backlinkThreshold);

		processAllPosts();
	};

	filterTabContainer.appendChild(makeHeuristicCheckbox("Is (You)", "isYou"));
	filterTabContainer.appendChild(makeHeuristicCheckbox("Is OP", "isOp"));
	filterTabContainer.appendChild(makeHeuristicCheckbox("Has Fun Text", "hasFunText"));
	filterTabContainer.appendChild(makeHeuristicCheckbox("Has No Images", "hasNoImages"));
	filterTabContainer.appendChild(makeHeuristicCheckbox("Has Only Spoiler Images", "hasSpoilerImage"));
	filterTabContainer.appendChild(makeHeuristicCheckbox("Has Good File Ext", "hasGoodExtension"));
	filterTabContainer.appendChild(makeHeuristicCheckbox("Has Animated PNG", "hasAnimatedPng"));
}

function buildFinderTab(tabsContainer, contentContainer) {
	const finderTab = makeTab("Finder");
	tabsContainer.appendChild(finderTab);

	const finderTabContainer = makeTabContainer("Finder");
	contentContainer.appendChild(finderTabContainer);

	// Thread finder checkbox
	const nextThreadContainer = makeContainer();
	finderTabContainer.appendChild(nextThreadContainer);

	const nextThreadLabel = makeLabel("Enable Thread Finder");
	nextThreadContainer.appendChild(nextThreadLabel);

	const nextThreadCheckbox = makeCheckbox(settings.findNextThread);
	nextThreadContainer.appendChild(nextThreadCheckbox);
	nextThreadCheckbox.onchange = () => {
		settings.findNextThread = nextThreadCheckbox.checked;
		setSetting("bag_findNextThread", settings.findNextThread);
	};

	// Thread subject input
	const subjectContainer = makeContainer();
	finderTabContainer.appendChild(subjectContainer);

	const subjectLabel = makeLabel("Thread Subject");
	subjectContainer.append(subjectLabel);

	const subjectInput = makeInput(settings.threadSubject);
	subjectInput.className = "subjectInput";
	subjectInput.size = 10;
	subjectContainer.appendChild(subjectInput);
	subjectInput.onchange = () => {
		settings.threadSubject = subjectInput.value;
		setSetting("bag_threadSubject", settings.threadSubject);
	}
}

function buildJannyTab(tabsContainer, contentContainer) {
	const jannyTab = makeTab("Janny");
	jannyTab.classList.add("jannyTab");
	jannyTab.style.display = "none";
	tabsContainer.appendChild(jannyTab);

	const jannyTabContainer = makeTabContainer("Janny");
	contentContainer.appendChild(jannyTabContainer);

	// Bot ban checkbox
	const jannyToolsContainer = makeContainer();
	jannyTabContainer.appendChild(jannyToolsContainer);

	const jannyToolsLabel = makeLabel("Janny Tools");
	jannyToolsContainer.appendChild(jannyToolsLabel);

	const jannyToolsCheckbox = makeCheckbox(settings.showJannyTools);
	jannyToolsContainer.appendChild(jannyToolsCheckbox);
	jannyToolsCheckbox.onchange = () => {
		if(jannyToolsCheckbox.checked) {
			if(!loggedInAsJanny) {
				alert(NOT_A_JANNY);
				jannyToolsCheckbox.checked = false;
				return;
			}

			if(!confirm(BOT_BAN_BUTTON_WARNING)) {
				jannyToolsCheckbox.checked = false;
				return;
			}
		}

		settings.showJannyTools = jannyToolsCheckbox.checked;
		setSetting("bag_showJannyTools", settings.showJannyTools);

		processAllPosts();
	}
}

function buildDebugTab(tabsContainer, contentContainer) {
	if(!DEBUG_TOOLS_VISIBLE) return;

	const debugTab = makeTab("Debug");
	tabsContainer.appendChild(debugTab);

	const debugTabContainer = makeTabContainer("Debug");
	contentContainer.appendChild(debugTabContainer);

	const fakePostButton = makeButton();
	debugTabContainer.appendChild(fakePostButton);
	fakePostButton.innerText = "Test Fake Post";
	fakePostButton.style.backgroundColor = "var(--background-color)";
	fakePostButton.onclick = () => {
		const url = `${URL_PREFIX}/res/1289960.html`
		addFakePost(`fake post test\r\n<a href="${url}">${url}</a>`);
	}

	const triggerThreadCheckButton = makeButton();
	debugTabContainer.appendChild(triggerThreadCheckButton);
	triggerThreadCheckButton.innerText = "Test Thread Finder";
	triggerThreadCheckButton.style.backgroundColor = "var(--background-color)";
	triggerThreadCheckButton.onclick = () => {
		addNextThreadFakePost(0, true);
	}

	const clearStorageButton = makeButton();
	debugTabContainer.appendChild(clearStorageButton);
	clearStorageButton.innerText = "Clear Storage";
	clearStorageButton.style.backgroundColor = "var(--background-color)";
	clearStorageButton.onclick = () => {
		Object.keys(localStorage).filter(x => x.startsWith("bag_")).forEach((x) => localStorage.removeItem(x));
		location.reload();
	}
}

// Post helpers
function postId(post) {
	const posterId = post?.querySelector('.labelId')?.innerText?.substring(0, 6);
	return posterId;
}

function addFakePost(contents) {
	const outer = document.createElement("div");
	document.querySelector(".divPosts").appendChild(outer);
	outer.className = "fakePost";
	outer.style.marginBottom = "0.25em";

	const inner = document.createElement("div");
	outer.appendChild(inner);
	inner.className = "innerPost";

	const message = document.createElement("div");
	inner.appendChild(message);
	message.className = "divMessage";
	message.innerHTML = contents;

	return inner;
}

function addNextThreadFakePost(initialQueryDelay, includeAutoSage) {
	document.querySelector(".nextThread")?.remove();

	const fakePost = addFakePost(`Searching for next ${settings.threadSubject} thread...`);
	fakePost.classList.add("nextThread");

	const fakePostMessage = document.querySelector(".nextThread .divMessage");
	const delay = FORCE_NEXT_THREAD_FAIL ? 500 : 30000;

	setTimeout(async () => {
		const found = FORCE_NEXT_THREAD_FAIL ?
			false :
			await queryNextThread(fakePost, fakePostMessage, includeAutoSage);

		if(!found) {
			fakePostMessage.innerHTML += `\r\nThread not found, retrying in 30s`;

			let retryCount = 8;
			const interval = setInterval(async () => {
				if(retryCount-- < 0) {
					clearInterval(interval);
					fakePostMessage.innerHTML += "\r\nNEXT THREAD NOT FOUND"
					fakePost.style.border = THREAD_NOT_FOUND_BORDER;
					return;
				}

				const retryFound = await queryNextThread(fakePost, fakePostMessage, includeAutoSage);
				if(retryFound) {
					clearInterval(interval);
				} else {
					fakePostMessage.innerHTML += `\r\nThread not found, retrying in 30s`;
				}
			}, delay);
		}
	}, initialQueryDelay ?? 60000);
}

// returns true if no more retries should be attempted
async function queryNextThread(fakePost, fakePostMessage, includeAutoSage) {
	// Try to fix issues people were having where fakePostMessage was undefined even with the fake post present.
	// Not sure what the actual cause is, haven't been able to replicate
	if(!fakePost) fakePost = document.querySelector(".nextThread");
	if(!fakePostMessage) fakePostMessage = document.querySelector(".nextThread .divMessage");

	const catalogUrl = barchiveToV(`${URL_PREFIX}/catalog.json`);
	console.log("searching for next thread", catalogUrl);

	const catalog = FORCE_NEXT_THREAD_FAIL ?
		await mockEmptyCatalogResponse() :
		await fetch(catalogUrl);

	if(catalog.ok) {
		const threads = await catalog.json();
		for(const thread of threads) {
			const notAutoSage = includeAutoSage || !thread.autoSage;
			if(notAutoSage && thread.subject?.includes(settings.threadSubject)) {
				// If the most recent found thread is full a new one hasn't been created yet, break early
				const postCount = thread.postCount ?? 1;
				if(postCount === 1500) break;

				const url = barchiveToV(`${URL_PREFIX}/res/${thread.threadId}.html`);
				fakePostMessage.innerHTML = `${thread.subject} [${postCount} posts]:\r\n<a href=${url}>${url}</a>`;
				fakePost.style.border = THREAD_FOUND_BORDER;
				return true;
			}
		}
		for(const thread of threads) {
			const notAutoSage = includeAutoSage || !thread.autoSage;
			if(notAutoSage && thread.subject?.includes(settings.threadSubject)) {
				// If the most recent found thread is full a new one hasn't been created yet, break early
				const postCount = thread.postCount ?? 1;
				if(postCount === 1500) break;

				const url = barchiveToV(`${URL_PREFIX}/res/${thread.threadId}.html`);
				fakePostMessage.innerHTML += `/n${thread.subject} [${postCount} posts]:\r\n<a href=${url}>${url}</a>`;
				fakePost.style.border = THREAD_FOUND_BORDER;
				return true;
			}
		}

		return false;
	} else {
		fakePostMessage.innerHTML = "ERROR WHILE LOOKING FOR NEXT THREAD";
		fakePost.style.border = THREAD_NOT_FOUND_BORDER;
		return true;
	}
}

// LocalStorage Helpers
function loadSettings() {
	// State
	manualBypass = getManualBypass();
	settings.activeTab = getStringSetting("bag_activeTab", "General");

	// General settings
	settings.enabled = getBoolSetting("bag_enabled", true);
	settings.revealSpoilers = getBoolSetting("bag_revealSpoilers", false);
	settings.hideStubs = getBoolSetting("bag_hideStubs", false);

	// Filter settings
	settings.postThreshold = getIntSetting("bag_postThreshold", 4);
	settings.backlinkThreshold = getIntSetting("bag_backlinkThreshold", 3);
	settings.blurStrength = getIntSetting("bag_blurStrength", 10);
	settings.filterBorder = getBoolSetting("bag_filterBorder", false);
	settings.hideFiltered = getBoolSetting("bag_hideFiltered", false);

	// Heuristic settings
	settings.whitelist = {};
	settings.whitelist.isYou = getBoolSetting("bag_whitelist_isYou", true);
	settings.whitelist.isOp = getBoolSetting("bag_whitelist_isOp", true);
	settings.whitelist.hasFunText = getBoolSetting("bag_whitelist_hasFunText", true);
	settings.whitelist.hasNoImages = getBoolSetting("bag_whitelist_hasNoImages", true);
	settings.whitelist.hasSpoilerImage = getBoolSetting("bag_whitelist_hasSpoilerImage", true);
	settings.whitelist.hasGoodExtension = getBoolSetting("bag_whitelist_hasGoodExtension", true);
	settings.whitelist.hasAnimatedPng = getBoolSetting("bag_whitelist_hasAnimatedPng", true);

	// Thread finder settings
	settings.findNextThread = getBoolSetting("bag_findNextThread", true);
	settings.threadSubject = getStringSetting("bag_threadSubject", "/bag/");

	// Janny Settings
	settings.showJannyTools = getBoolSetting("bag_showJannyTools", false);
}

function setSetting(name, value) {
	localStorage.setItem(name, value);
}

function getSetting(name) {
	return localStorage.getItem(name);
}

function getBoolSetting(name, defaultValue) {
	const value = getSetting(name);
	if(value === null) return defaultValue;
	return value == "true";
}

function getIntSetting(name, defaultValue) {
	const value = getSetting(name);
	if(value === null) return defaultValue;
	return parseInt(value);
}

function getStringSetting(name, defaultValue) {
	const value = getSetting(name);
	if(value === null) return defaultValue;
	return value
}

function getManualBypass() {
	const bypassVar = `bag_bypass_${threadID}`;
	const bp = getSetting(bypassVar);
	return (!bp) ? {} : JSON.parse(bp);
}

function setManualBypass() {
	const bypassVar = `bag_bypass_${threadID}`;
	const bypassData = JSON.stringify(manualBypass);
	localStorage.setItem(bypassVar, bypassData);

	const bypassExpiresVar = `${bypassVar}_expires`;
	let date = new Date();
	date.setDate(date.getDate() + 3);
	localStorage.setItem(bypassExpiresVar, date);
}

function cleanupOldBypasses() {
	const now = new Date();

	const bypasses = Object.keys(localStorage).filter(ls => ls.startsWith("bag_bypass_") && !ls.endsWith("_expires"));
	bypasses.forEach(bypass => {
		const expiresKey = `${bypass}_expires`;
		const expires = localStorage.getItem(expiresKey);
		if(expires) {
			const expiresDate = Date.parse(expires);
			if(now > expiresDate) {
				localStorage.removeItem(bypass);
				localStorage.removeItem(expiresKey);
				console.log(`bagscript : removed ${bypass} : expired`);
			}
		} else {
			localStorage.removeItem(bypass);
			localStorage.removeItem(expiresKey);
			console.log(`bagscript : removed ${bypass} : old bypass`);
		}
	});
}

// HTML Helpers
function makeContainer() {
	const container = document.createElement("div");
	container.style.alignItems = "center";
	container.style.backgroundColor = "var(--background-color)";
	container.style.display = "flex";
	container.style.gap = "0.25rem";
	container.style.justifyContent = "space-between";
	container.style.padding = "0.1rem";
	return container;
}

function makeLabel(text) {
	const label = document.createElement("div");
	label.innerText = text;
	label.style.color = "var(--text-color)";
	label.style.userSelect = "none";
	return label;
}

function makeCheckbox(initialValue) {
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.style.cursor = "pointer";
	checkbox.checked = initialValue;
	return checkbox;
}

function makeHeuristicCheckbox(label, setting) {
	const container = makeContainer();

	const labelElement = makeLabel(label);
	container.appendChild(labelElement);

	const checkbox = makeCheckbox(settings.whitelist[setting]);
	container.appendChild(checkbox);
	checkbox.onchange = () => {
		settings.whitelist[setting] = checkbox.checked;
		localStorage.setItem(`bag_whitelist_${setting}`, settings.whitelist[setting]);

		processAllPosts();
	};

	return container;
}

function makeInput(initialValue) {
	const input = document.createElement("input");
	input.size = 4;
	input.value = initialValue;
	input.style.border = "1px solid var(--navbar-text-color)";
	return input;
}

function makeButton() {
	const button = document.createElement("div");
	button.style.alignItems = "center";
	button.style.color = "var(--link-color)";
	button.style.cursor = "pointer";
	button.style.display = "flex";
	button.style.padding = "0.25rem 0.75rem";
	button.style.userSelect = "none";
	return button;
}

function bypassButtonForPost(post) {
	const id = postId(post);
	if(!id) return;

	const bypassButton = makeButton();
	bypassButton.innerText = "+";
	bypassButton.className = "bypassButton";
	bypassButton.style.border = "1px solid var(--horizon-sep-color)";
	bypassButton.style.display = "inline";
	bypassButton.style.marginLeft = "1rem";

	bypassButton.onclick = () => {
		bypassButton.style.display = "none";
		manualBypass[id] = true;
		setManualBypass();

		processSinglePost(post);
		processAllPostsById(id);
	};

	return bypassButton;
}

function addJannyToolsToPost(post) {
	const innerPost = post.querySelector(".innerPost");
	const shouldShow = loggedInAsJanny && settings.showJannyTools;

	let tools = post.querySelector(".jannyTools");
	if(tools) {
		tools.style.display = shouldShow ? "flex" : "none";
	} else {
		tools = document.createElement("div");
		tools.className = "jannyTools";
		innerPost.appendChild(tools);

		tools.style.display = shouldShow ? "flex" : "none";
		tools.style.paddingTop = "0.25rem";
		tools.style.gap = "1rem";
		tools.style.justifyContent = "flex-end";
		tools.style.width = "100%";

		addBanButtonToTools(tools, post, "Bot Ban", BOT_BAN_REASON, BOT_BAN_DURATION);
	}

	return tools;
}

function addBanButtonToTools(container, post, buttonText, banReason, banLength) {
	const innerPost = post.querySelector(".innerPost");

	// Bot ban button
	let banButton = post.querySelector(".banButton." + banReason);
	if(!banButton) {
		banButton = document.createElement("div");
		banButton.className = `banButton ${banReason}`;
		container.appendChild(banButton);

		banButton.innerText = buttonText;
		banButton.style.border = BAN_BUTTON_BORDER;
		banButton.style.cursor = "pointer";
		banButton.style.display = "block";
		banButton.style.margin = "0";
		banButton.style.padding = "0.25rem";
		banButton.style.userSelect = "none";

		banButton.onclick = () => {
			const postId = innerPost.querySelector("a.linkQuote").innerText;
			const dummy = document.createElement("div");
			postingMenu.applySingleBan(
				"", 3, banReason, false, 0, banLength, false,
				true, "v", threadID, postId, innerPost, dummy
			);
		}
	}

	return banButton;
}

function addToggleButton(menu, menuContents) {
	const toggleButton = makeButton();
	menu.appendChild(toggleButton);
	toggleButton.innerText = "<<"
	toggleButton.style.alignSelf = "flex-end";
	toggleButton.style.backgroundColor = "var(--background-color)";
	toggleButton.style.border = "1px solid var(--navbar-text-color)";
	toggleButton.onclick = () => {
		menuVisible = !menuVisible;
		menuContents.style.display = menuVisible ? "flex" : "none";
		toggleButton.innerText = menuVisible ? ">>" : "<<";
	}
}

function makeTab(tabName) {
	const isActive = settings.activeTab === tabName;

	const tab = document.createElement("div");
	tab.innerText = tabName;
	tab.className = "bagTab"
	tab.style.backgroundColor = "var(--background-color)";
	tab.style.color = isActive ? "var(--link-color)" : "var(--text-color)";
	tab.style.cursor = "pointer";
	tab.style.flexGrow = "1";
	tab.style.padding = "0.25rem 0.75rem";
	tab.style.userSelect = "none";

	tab.onclick = () => {
		settings.activeTab = tabName;
		setSetting("bag_activeTab", settings.activeTab);

		// Tab
		document.querySelectorAll(".bagTab").forEach((tab) => {
			tab.style.color = "var(--text-color)";
		});

		tab.style.color = "var(--link-color)";

		// Tab container
		document.querySelectorAll(".bagTabContainer").forEach((tabContainer) => {
			tabContainer.style.display = "none";
		});

		document.querySelector(`.bagTabContainer[data-tab="${tabName}"]`).style.display = "flex";
	};

	return tab;
}

function makeTabContainer(tabName) {
	const isActive = settings.activeTab === tabName;

	const tabContainer = document.createElement("div");
	tabContainer.className = "bagTabContainer";
	tabContainer.setAttribute("data-tab", tabName)
	tabContainer.style.display = isActive ? "flex" : "none";
	tabContainer.style.flexDirection = "column"
	tabContainer.style.gap = "1px";

	return tabContainer;
}

// CSS helpers
function loadStyle() {
	if(!styleBuilt) {
		buildStyle();
		styleBuilt = true;
	}

	bagStyle.disabled = false;
}

function buildStyle() {
	const stubsDisplay = settings.hideStubs ? "none" : "inline";
	bagStyle.insertRule(`div.postCell:has(span.unhideButton) { display: ${stubsDisplay} !important; }`);

	const rudeDisplay = settings.hideFiltered ? "none" : "inline-block";
	const rudeBorder = settings.filterBorder ? RUDE_BORDER : "0";
	bagStyle.insertRule(`div:not(.nicePost) > .innerPost:not(.hidden) { border-right: ${rudeBorder}; display: ${rudeDisplay}; }`);

	const blurLevel = isNaN(settings.blurStrength) ? 0 : settings.blurStrength;
	//bagStyle.insertRule(`div:not(.nicePost) > .innerPost:not(.hidden) > .panelUploads .uploadCell img:not(.imgExpanded):hover { filter: blur(0px); transition-delay: 0.35s; }`);
	bagStyle.insertRule(`div:not(.nicePost) > .innerPost:not(.hidden) > .panelUploads .uploadCell img:not(.imgExpanded) { filter: blur(${blurLevel}px); }`);
}

function setStyle(name, prop, val, isImportant = false) {
	const important = isImportant ? "important" : undefined;
	bagStyle.rules[styleIndex[name]].style.setProperty(prop, val, important);
}

// Misc helpers
function barchiveToV(url) {
	return url.replace("barchive", "v");
}

function checkIfJanny(callback) {
	try {
		if (checkedJannyStatus) {
			if (callback) callback(loggedInAsJanny);
		} else {
			checkedJannyStatus = true;
			unsafeWindow.api.formApiRequest("account", {}, (status, data) => {
				if (status !== "ok") return;

				loggedInAsJanny =
					data.ownedBoards?.includes(unsafeWindow.api.boardUri)
				|| data.volunteeredBoards?.includes(unsafeWindow.api.boardUri);

				if (callback) callback(loggedInAsJanny);
			}, true);
		}
	} catch(err) {
		console.error('[bagscript] Error: checkIfJanny failed');
	}
}

// Debug/Test helpers
function mockEmptyCatalogResponse() {
	return Promise.resolve({
		ok: true,
		json: () => Promise.resolve([])
	});
}