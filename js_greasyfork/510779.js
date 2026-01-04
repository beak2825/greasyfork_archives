// ==UserScript==
// @name		Pixiv Utils
// @namespace	https://greasyfork.org/en/scripts/510779-pixiv-utils/
// @version		2024-09-30|v0.1.3-4
// @description	Utilities for Pixiv (tags highlighting/blocking, ad-block, premium emulation, automation, ease-of-access)
// @author		V.H.
// @copyright	V.H.
// @match		*://*.pixiv.net/*
// @icon		https://icons.duckduckgo.com/ip2/pixiv.net.ico
// @grant		unsafeWindow
// @grant		GM_log
// @grant		GM_registerMenuCommand
// @grant		GM_unregisterMenuCommand
// @grant		GM_addStyle
// @grant		GM_getValue
// @grant		GM_setValue
// @run-at		document-start
// @tag			utilities
// @connect		self
// @connect		kemono.su
// @webRequest	[{"selector":"ads-pixiv.net","action":"cancel"}]
// @license		MIT
// @supportURL	https://greasyfork.org/en/scripts/510779-pixiv-utils/feedback
// @antifeature	- Can get your Pixiv account in trouble if you overuse it (might be detected as a harmful bot), and can slow-down the network (not observed though) while loading images (it loads them twice to fetch the actual tags)
// @downloadURL https://update.greasyfork.org/scripts/510779/Pixiv%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/510779/Pixiv%20Utils.meta.js
// ==/UserScript==

"use strict";

// --- CLASSES ---

class Throttle {
	
	constructor(cap = 10, retry = 500, rand = 100) {
		this.cap	= cap;
		this.retry	= retry;
		this.rand	= rand;
		this.queue	= [ ];
	} //ctor
	
	async free(tries = random(10, 30)) {
		while (this.queue.length >= this.cap && tries-- > 0)
			await sleep(this.retry + random(this.rand));
		
		return this.queue.length < this.cap;
	} //free
	lock(promise) {
		const	out	= {
			done:	false,
			promise,
		};
		
		promise.finally(() => {
			out.done	= true;
		});
		
		this.queue.push(out);
		
		return out;
	} //lock
	
	loop() {
		const	out	= [ ];
		
		for (let prom of this.queue)
			if (!prom.done)
				out.push(prom);
		
		this.queue	= out;
		GM_log(`tlocks:\t${this.queue.length}`);
		
		return out;
	} //loop
	start() {
		return setInterval(this.loop.bind(this), this.retry);
	} //start
	
} //Throttle

// --- GLOBALS ---

const	sep			= /[\s\n]*[,\n][\s\n]*/gmis,
		idsep		= /\//gi,
		idmatch		= /^\d+/i,
		uidmatch	= /(?<=\/)\d+(?=\/)/i,
		showc		= /show all|read(ing)? works?/i,
		prems		= [
			[ /(?<=['"]_setCustomVar['"]\s*?,\s*?\d+?\s*?,\s*?['"]plan['"]\s*?,\s*?['"])(normal)(?=['"])/gmis, "premium" ],
			[ /(?<=['"]?premium['"]?\s*?:\s*?['"])(no)(?=['"])/gmis, "yes" ],
			[ /(?<=['"]?plan['"]?\s*?:\s*?['"])(normal)(?=['"])/gmis, "premium" ],
			[ /(?<=['"]?premium['"]?\s*?:\s*?['"]?)(false|0|no)(?=['"]?)/gmis, "true" ],
		];
let		cfg			= {
	name:		"Pixiv Utils",
	prefix:		"gm_vh_pxvutl_",
	base:		"https://www.pixiv.net/en/artworks/",
	kemono:		"https://kemono.su/fanbox/user/",
	intr:		1000,
	sleep:		100,
	baseopts:	{
		
	},
	panel:		{
		name:					"Panel",
		title:					"Panel",
		accessKey:				"P",
		autoClose:				true,
		id:						null,
	},
	observe:	{
		subtree:				true,
		childList:				true,
		characterData:			false,
		characterDataOldValue:	false,
		attributes:				true,
		attributeOldValue:		false,
		attributeFilter:		[ "src", "alt", "title" ],
	},
	style:		`
		.gm_vh_pxvutl_ {
			user-select: contain;
			text-shadow: 1px 1px 1px black;
		}
		.gm_vh_pxvutl_.row {
			display: flex;
			flex-flow: row wrap;
			justify-content: center;
			align-items: center;
			align-content: stretch;
			gap: 5px;
		}
		div:has(> div[width][height] .gm_vh_pxvutl_violet), div[type][size]:has(.gm_vh_pxvutl_violet) {
			border: medium dashed violet !important;
		}
		div:has(> div[width][height] .gm_vh_pxvutl_high), div[type][size]:has(.gm_vh_pxvutl_high) {
			border: medium dashed yellow !important;
		}
		div:has(> div[width][height] .gm_vh_pxvutl_green), div[type][size]:has(.gm_vh_pxvutl_green) {
			border: medium dashed green !important;
		}
		.gm_vh_pxvutl_block:not(.gm_vh_pxvutl_blue) {
			visibility: collapse !important;
			cursor: not-allowed;
		}
		div:has(> div[width][height] .gm_vh_pxvutl_block), div[type][size]:has(.gm_vh_pxvutl_block) {
			border: thick double red !important;
		}
		div:has(> div[width][height] .gm_vh_pxvutl_blue), div[type][size]:has(.gm_vh_pxvutl_blue) {
			visibility: visible !important;
			border-width: thick !important;
			border-style: dashed;
			border-color: blue !important;
		}
		.gm_vh_pxvutl_hide, div:has(> div[width][height] .gm_vh_pxvutl_hide), div[type][size]:has(.gm_vh_pxvutl_hide), div:has(> div > div[width][height] .gm_vh_pxvutl_hide, > div[type][size] .gm_vh_pxvutl_hide), li:has(> div > div > div[width][height] .gm_vh_pxvutl_hide, > div > div[type][size] .gm_vh_pxvutl_hide) {
			display: none !important;
			visibility: hidden !important;
			opacity: 0 !important;
			pointer-events: none !important;
			cursor: not-allowed !important;
		}
		
		:where(h1, h2, h3, h4).gm_vh_pxvutl_ {
			text-decoration: underline;
			margin: 5px;
		}
		label.gm_vh_pxvutl_ {
			user-select: none;
		}
		label.gm_vh_pxvutl_::after {
			content: ": ";
		}
		
		textarea.gm_vh_pxvutl_ {
			resize: both;
			border-radius: 5px;
			padding: 5px;
			margin: 5px;
			background: revert;
		}
		
		.gm_vh_pxvutl_:is(button, input, select) {
			cursor: pointer !important;
			opacity: .8;
			padding: 5px;
			margin: 5px;
			box-shadow: 1px 1px 1px 0 black;
			border-radius: 5px;
			background: revert;
			transition: all 200ms;
		}
		.gm_vh_pxvutl_:is(button, input, select):hover {
			box-shadow: 2px 2px 1px 1px black;
			opacity: .9;
			padding: 7px;
			border-radius: 7px;
		}
		.gm_vh_pxvutl_:is(button, input, select):active {
			box-shadow: 2px 2px 2px 2px black;
			opacity: 1;
			border-radius: 10px;
			padding: 8px;
		}
		
		#gm_vh_pxvutl_panel {
			display: flex;
			flex-flow: column nowrap;
			position: fixed !important;
			justify-content: space-between;
			align-items: stretch;
			align-content: stretch;
			resize: both !important;
			gap: 5px;
			bottom: 1vh !important;
			left: 1vw !important;
			min-width: 10vw;
			width: 30vw;
			max-width: 40vw;
			min-height: 10vh;
			height: 95vh;
			max-height: 100vh;
			padding: 5px;
			margin: 5px;
			border-radius: 5px;
			z-index: 999 !important;
			background: radial-gradient(circle farthest-side at center, rgba(230, 230, 230, 1) 0%, rgba(150, 150, 150, .7) 90%);
			overflow: auto;
			user-select: contain;
			pointer-events: none;
		}
		#gm_vh_pxvutl_panel * {
			pointer-events: auto;
		}
		#gm_vh_pxvutl_panel_close {
			position: sticky;
			top: 5px;
			right: 5px;
		}
		#gm_vh_pxvutl_kemono {
			margin: 5px;
		}
	`,
},		data		= {
	enabled:	false,
	exposed:	true,
	show:		false,
	probe:		false,
	violet:		"",
	high:		"",
	green:		"",
	block:		"",
	blue:		"",
	hide:		"",
},		css			= GM_addStyle(cfg.style),
		observer	= new MutationObserver(see),
		throttle	= new Throttle(7, 200, 200),
		tags		= {
			violet:	[ ],
			high:	[ ],
			green:	[ ],
			block:	[ ],
			blue:	[ ],
			hide:	[ ],
		},
		intr		= null;

document.addEventListener("DOMContentLoaded", premiumUnlock, true);
unsafeWindow._thrintr	= throttle.start();

// --- FUNCTIONS ---

function start() {
	cfg.panel.id	= GM_registerMenuCommand(cfg.panel.name, panel, cfg.panel);
	
	data			= Object.assign(data, GM_getValue(getPrefixed("settings"), data));
	
	update();
	
	GM_log(`--- '${cfg.name}' has started.`);
} //start
function stop() {
	GM_unregisterMenuCommand(cfg.panel.id);
	css.remove();
	clearInterval(intr);
} //stop

function panel(e) {
	const	root		= document.createElement("dialog"),
			title		= document.createElement("h3"),
			close		= document.createElement("button"),
			statesp		= document.createElement("span"),
			statelb		= document.createElement("label"),
			state		= document.createElement("input"),
			expsp		= document.createElement("span"),
			explb		= document.createElement("label"),
			exp			= document.createElement("input"),
			showsp		= document.createElement("span"),
			showlb		= document.createElement("label"),
			show		= document.createElement("input"),
			probesp		= document.createElement("span"),
			probelb		= document.createElement("label"),
			probe		= document.createElement("input"),
			violetsp	= document.createElement("span"),
			violetlb	= document.createElement("label"),
			violet		= document.createElement("textarea"),
			highsp		= document.createElement("span"),
			highlb		= document.createElement("label"),
			high		= document.createElement("textarea"),
			greensp		= document.createElement("span"),
			greenlb		= document.createElement("label"),
			green		= document.createElement("textarea"),
			blocksp		= document.createElement("span"),
			blocklb		= document.createElement("label"),
			block		= document.createElement("textarea"),
			bluesp		= document.createElement("span"),
			bluelb		= document.createElement("label"),
			blue		= document.createElement("textarea"),
			hidesp		= document.createElement("span"),
			hidelb		= document.createElement("label"),
			hide		= document.createElement("textarea");
	
	root.id				= getPrefixed("panel");
	root.classList.add(getPrefixed());
	root.setAttribute("open", "");
	
	{
		const	e	= document.getElementById(root.id);
		
		if (e)	e.remove();
	}
	
	title.id			= getPrefixed("panel_title");
	title.classList.add(getPrefixed());
	title.innerHTML		= "Pixiv Utils Control Panel";
	
	close.id			= getPrefixed("panel_close");
	close.classList.add(getPrefixed());
	close.innerHTML		= "Close";
	close.onclick		= () => {
		const	root	= document.getElementById(getPrefixed("panel"));
		
		root.close();
		root.remove();
	};
	
	state.id			= getPrefixed("panel_enable");
	state.type			= "checkbox";
	state.classList.add(getPrefixed());
	state.onchange		= () => {
		data.enabled	= state.checked;
		update();
	};
	if (data.enabled)	state.setAttribute("checked", "");
	
	statelb.classList.add(getPrefixed());
	statelb.htmlFor		= state.id;
	statelb.innerHTML	= "Enable";
	
	exp.id			= getPrefixed("panel_expose");
	exp.type			= "checkbox";
	exp.classList.add(getPrefixed());
	exp.onchange		= () => {
		data.exposed	= exp.checked;
		update();
	};
	if (data.exposed)	exp.setAttribute("checked", "");
	
	explb.classList.add(getPrefixed());
	explb.htmlFor		= exp.id;
	explb.innerHTML		= "Expose Alt";
	expsp.title			= "The Alt field of images contains the tags";
	
	show.id				= getPrefixed("panel_show");
	show.type			= "checkbox";
	show.classList.add(getPrefixed());
	show.onchange		= () => {
		data.show		= show.checked;
		update();
	};
	if (data.show)		show.setAttribute("checked", "");
	
	showlb.classList.add(getPrefixed());
	showlb.htmlFor		= show.id;
	showlb.innerHTML	= "Auto Show-All";
	showsp.title		= "Sometimes clicks the wrong buttons";
	
	probe.id			= getPrefixed("panel_probe");
	probe.type			= "checkbox";
	probe.classList.add(getPrefixed());
	probe.onchange		= () => {
		data.probe		= probe.checked;
		update();
	};
	if (data.probe)		probe.setAttribute("checked", "");
	
	probelb.classList.add(getPrefixed());
	probelb.htmlFor		= probe.id;
	probelb.innerHTML	= "Tags Deep-Probing";
	probesp.title		= "Causes rate-limiting if used too much";
	
	violet.id			= getPrefixed("panel_violet");
	violet.classList.add(getPrefixed());
	violet.value		= data.violet;
	violet.cols			= 50;
	violet.rows			= 3;
	violet.placeholder	= "tag1, tag2, ...";
	violet.setAttribute("spellcheck", "false");
	violet.onchange		= () => {
		data.violet		= violet.value;
		update();
	};
	
	violetlb.classList.add(getPrefixed());
	violetlb.htmlFor	= violet.id;
	violetlb.innerHTML	= "Violet Tags";
	
	high.id				= getPrefixed("panel_high");
	high.classList.add(getPrefixed());
	high.value			= data.high;
	high.cols			= 50;
	high.rows			= 3;
	high.placeholder	= "tag1, tag2, ...";
	high.setAttribute("spellcheck", "false");
	high.onchange		= () => {
		data.high		= high.value;
		update();
	};
	
	highlb.classList.add(getPrefixed());
	highlb.htmlFor		= high.id;
	highlb.innerHTML	= "Highlighted Tags";
	
	green.id			= getPrefixed("panel_green");
	green.classList.add(getPrefixed());
	green.value			= data.green;
	green.cols			= 50;
	green.rows			= 3;
	green.placeholder	= "tag1, tag2, ...";
	green.setAttribute("spellcheck", "false");
	green.onchange		= () => {
		data.green		= green.value;
		update();
	};
	
	greenlb.classList.add(getPrefixed());
	greenlb.htmlFor		= green.id;
	greenlb.innerHTML	= "Green Tags";
	
	block.id			= getPrefixed("panel_block");
	block.classList.add(getPrefixed());
	block.value			= data.block;
	block.cols			= 50;
	block.rows			= 3;
	block.placeholder	= "tag1, tag2, ...";
	block.setAttribute("spellcheck", "false");
	block.onchange		= () => {
		data.block		= block.value;
		update();
	};
	
	blocklb.classList.add(getPrefixed());
	blocklb.htmlFor		= block.id;
	blocklb.innerHTML	= "Blocked Tags";
	
	blue.id			= getPrefixed("panel_blue");
	blue.classList.add(getPrefixed());
	blue.value			= data.blue;
	blue.cols			= 50;
	blue.rows			= 3;
	blue.placeholder	= "tag1, tag2, ...";
	blue.setAttribute("spellcheck", "false");
	blue.onchange		= () => {
		data.blue		= blue.value;
		update();
	};
	
	bluelb.classList.add(getPrefixed());
	bluelb.htmlFor		= blue.id;
	bluelb.innerHTML	= "Blue Tags";
	
	hide.id				= getPrefixed("panel_hide");
	hide.classList.add(getPrefixed());
	hide.value			= data.hide;
	hide.cols			= 50;
	hide.rows			= 3;
	hide.placeholder	= "tag1, tag2, ...";
	hide.setAttribute("spellcheck", "false");
	hide.onchange		= () => {
		data.hide		= hide.value;
		update();
	};
	
	hidelb.classList.add(getPrefixed());
	hidelb.htmlFor		= hide.id;
	hidelb.innerHTML	= "Hide Tags";
	
	title.classList.add(getPrefixed(), "row");
	statesp.classList.add(getPrefixed(), "row");
	expsp.classList.add(getPrefixed(), "row");
	showsp.classList.add(getPrefixed(), "row");
	probesp.classList.add(getPrefixed(), "row");
	blocksp.classList.add(getPrefixed(), "row");
	highsp.classList.add(getPrefixed(), "row");
	greensp.classList.add(getPrefixed(), "row");
	bluesp.classList.add(getPrefixed(), "row");
	violetsp.classList.add(getPrefixed(), "row");
	hidesp.classList.add(getPrefixed(), "row");
	
	statesp.append(statelb, state);
	expsp.append(explb, exp);
	showsp.append(showlb, show);
	probesp.append(probelb, probe);
	violetsp.append(violetlb, violet);
	highsp.append(highlb, high);
	greensp.append(greenlb, green);
	blocksp.append(blocklb, block);
	bluesp.append(bluelb, blue);
	hidesp.append(hidelb, hide);
	root.append(title, close, violetsp, highsp, greensp, blocksp, bluesp, hidesp, expsp, showsp, probesp, statesp);
	document.body.appendChild(root);
	
	root.show();
	
	GM_log(`--- '${cfg.name}' Panel opened.`);
} //panel

function update() {
	GM_setValue(getPrefixed("settings"), data);
	
	tags.violet	= data.violet.trim().split(sep).map(t => t.trim()).filter(t => t).map(r => new RegExp(wrap(r, "\\b"), "i"));
	tags.high	= data.high.trim().split(sep).map(t => t.trim()).filter(t => t).map(r => new RegExp(wrap(r, "\\b"), "i"));
	tags.green	= data.green.trim().split(sep).map(t => t.trim()).filter(t => t).map(r => new RegExp(wrap(r, "\\b"), "i"));
	tags.block	= data.block.trim().split(sep).map(t => t.trim()).filter(t => t).map(r => new RegExp(wrap(r, "\\b"), "i"));
	tags.blue	= data.blue.trim().split(sep).map(t => t.trim()).filter(t => t).map(r => new RegExp(wrap(r, "\\b"), "i"));
	tags.hide	= data.hide.trim().split(sep).map(t => t.trim()).filter(t => t).map(r => new RegExp(wrap(r, "\\b"), "i"));
	
	clearInterval(intr);
	
	if (data.enabled)	observer.observe(document, cfg.observe);
	else				observer.disconnect();
	if (data.show)		intr	= setInterval(timed, cfg.intr);
	
	GM_log("Update.");
} //update

function timed() {
	const	show	= Array.from(document.querySelectorAll(":where(button, div):not(.hidden)")).find(b => showc.test(b.innerText.trim().toLowerCase()));
	
	if (show) {
		show.click();
		show.classList.add("hidden");
	}
	
	if (location.href.startsWith(cfg.base) && !document.getElementById(getPrefixed("kemono")) && document.querySelector(`a[href*="/users/"][href*="/artworks"]`)) {
		const	par	= document.querySelector(`a[href*="/users/"][href*="/artworks"]`),
				id	= getID(par.href.match(uidmatch)[0]),
				a	= document.createElement("a");
		
		a.id		= getPrefixed("kemono");
		a.href		= cfg.kemono + id;
		a.target	= "_blank";
		a.innerHTML	= "Kemono";
		a.classList.add("gtm-work-main-see-more");
		
		par.parentNode.appendChild(a);
		
		GM_log("KEMONO added.");
	}
} //timed

start();

function premiumUnlock() {
	const	scripts	= Array.from(document.scripts).filter(s => s.innerText.trim()),
			metas	= Array.from(document.querySelectorAll("meta[content]")).filter(m => m.content.trim());
	
	GM_log(`PREMS:\t${prems.length}\t${scripts.length}\t${metas.length}`);
	
	for (let script of scripts) {
		prems.forEach(p => {
			script.innerText	= script.innerText.replaceAll(p[0], p[1]);
		});
	}
	for (let meta of metas) {
		prems.forEach(p => {
			meta.content	= meta.content.replaceAll(p[0], p[1]);
		});
	}
	
	GM_log(`--- '${cfg.name}' has premium-unlocked.`);
} //premiumUnlock

async function see(e, o) {
	for (let mut of e) {
		if (mut.addedNodes && mut.addedNodes.length) {
			for (let nd of mut.addedNodes) {
				if (nd.tagName && nd.tagName.toLowerCase() == "img" && nd.alt) {
					process(nd);
					await sleep(random(cfg.sleep));
				}
			}
		}
	}
} //see
async function process(img, skip = false) {
	const	alt	= img.alt.trim().toLowerCase().split(sep).map(t => t.trim()).filter(r => r);
	
	img.alt	= alt.join(", ");
	
	if (!img.classList.contains(getPrefixed("violet")) && rule(tags.violet, alt)) {
		img.classList.add(getPrefixed("violet"));
		GM_log(`VIOLET:\t${img.src}\t${img.alt}`);
	}
	if (!img.classList.contains(getPrefixed("high")) && rule(tags.high, alt)) {
		img.classList.add(getPrefixed("high"));
		GM_log(`HIGH:\t${img.src}\t${img.alt}`);
	}
	if (!img.classList.contains(getPrefixed("green")) && rule(tags.green, alt)) {
		img.classList.add(getPrefixed("green"));
		GM_log(`GREEN:\t${img.src}\t${img.alt}`);
	}
	if (!img.classList.contains(getPrefixed("block")) && rule(tags.block, alt)) {
		img.classList.add(getPrefixed("block"));
		GM_log(`BLOCK:\t${img.src}\t${img.alt}`);
	}
	if (!img.classList.contains(getPrefixed("blue")) && rule(tags.blue, alt)) {
		img.classList.add(getPrefixed("blue"));
		GM_log(`BLUE:\t${img.src}\t${img.alt}`);
	}
	if (!img.classList.contains(getPrefixed("hide")) && rule(tags.hide, alt)) {
		img.classList.add(getPrefixed("hide"));
		GM_log(`HIDE:\t${img.src}\t${img.alt}`);
	}
	
	if (data.exposed)			img.parentNode.title	= img.title	= img.alt.trim();
	if (skip || !data.probe)	return;
	
	await throttle.free(random(75, 110));
	
	return throttle.lock(getData(img).then(tags => {
		img.alt	+= ", " + tags.join(", ");
		
		GM_log(`IMG:\t${img.src}\t${img.alt}`);
		
		process(img, true);
	}));
} //process

async function getData(img, again = false) {
	try {
		const	id		= getID(img.src),
				res		= await fetch(cfg.base + id, cfg.baseopts),
				dat		= await res.text(),
				tree	= Document.parseHTMLUnsafe(dat).querySelector("meta[name='preload-data']"),
				json	= JSON.parse(tree.content)["illust"][id]["tags"]["tags"],
				tags	= [ ];
		
		if (!res.ok && !again) {
			await sleep(random(cfg.sleep, 2 * cfg.sleep));
			
			return getData(img, true);
		}
		
		for (let tag of json) {
			if (tag["tag"])								tags.push(tag["tag"]);
			if (tag["romaji"])							tags.push(tag["romaji"]);
			if (tag["translation"])
				for (let trans in tag["translation"])	tags.push(tag["translation"][trans]);
		}
		
		return tags;
	} catch(err) {
		return [ ];
	}
} //getData

// --- UTILS ---

function rule(r = [], t = []) {
	return r.reduce((acc, curr) => {
		return acc + t.reduce((acc, curt, i, arr) => {
			const	p	= curr.test(curt);
			
			if (p)	arr[i]	= curt.trim().toUpperCase();
			
			return acc + p;
		}, 0);
	}, 0);
} //rule

function getID(src = location.pathname) {
	return src.trim().split(idsep).map(i => i.trim()).filter(i => i).pop().match(idmatch)[0];
} //getID

function getPrefixed(thing = "") {
	return cfg.prefix.trim() + thing.trim();
} //getPrefixed
function wrap(thing = "", w1 = "", w2 = w1) {
	return `${w1}${thing}${w2}`;
} //wrap

async function sleep(time = 1000, ...args) {
	return new Promise(res => setTimeout(res, time, ...args));
} //sleep

function random(m = 0, M = 1) {
	[ m, M ]	= [ Math.min(m, M), Math.max(m, M) ];
	
	return Math.random() * (M - m) + m;
} //random
