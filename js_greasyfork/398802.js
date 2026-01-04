// ==UserScript==
// @name		Google Images direct links 2
// @version		2.5.2
// @description Add direct links to the picture to the Google Image Search results.
// @namespace	Google
// @author		Benjamin Philipp <dev [at - please don't spam] benjamin-philipp.com>
// @include		/^https?:\/\/(www\.)?google\.[a-z\.]{2,5}\/search.*tbm=isch.*/
// @include		/^https?:\/\/(www\.)?google\.[a-z\.]{2,5}\/search.*udm=2.*/
// @require		https://openuserjs.org/src/libs/sizzle/GM_config.js
// @run-at		document-start
// @grant		GM_xmlhttpRequest
// @grant		GM_addStyle
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_registerMenuCommand
// @grant		GM_openInTab
// @connect		*
// @downloadURL https://update.greasyfork.org/scripts/398802/Google%20Images%20direct%20links%202.user.js
// @updateURL https://update.greasyfork.org/scripts/398802/Google%20Images%20direct%20links%202.meta.js
// ==/UserScript==


var updateInterval = 1000;
var maxtries = 100;
var selector = `.rg_di.rg_bx a.rg_l img:not(.linksdone),
#islrg div.isv-r a.wXeWr.islib img:not(.linksdone),
div#res div#rso h3 a g-img img:not(.linksdone),
div#islmp div.islrc a[role="button"] img:not(.linksdone),
div#search div[data-attrid="images universal"] h3 a[href] img:not(.linksdone)
`;
var idle = true;

GM_config.init(
{
	'id': 'MyConfig',
	'title': GM_info.script.name + ' Settings',
	'fields': {
		'newTabByDefault': {
			'label': '<b>Open Links in new tab by default</b> <br /><i>ON:</i> Opens images in new tab; hold <kbd>Ctrl</kbd> to open directly <br /><i>OFF:</i> Opens images directly; hold <kbd>Ctrl</kbd> to open in new tab',
			'type': 'checkbox',
			'default': true
		},
		'openInBackground': {
			'label': '<b>Open new tabs in the background (without activating them)</b>',
			'type': 'checkbox',
			'default': false
		},
		'uncropImages': {
			'label': '<b>Uncrop images</b> <br /><i>Google crops most preview images slightly. Turning this setting on will show the thumbnails uncropped</i>',
			'type': 'checkbox',
			'default': false
		},
		'uncropOnHover': {
			'label': '<b>Uncrop on hover</b> <br /><i>Show the full thumbnail on mouse hover</i>',
			'type': 'checkbox',
			'default': true
		},
		'noRadius': {
			'label': '<b>Remove round corners</b> <br /><i>remove the "rounded corners" (CSS: border-radius) effect. Some thumbnails seem to have actually rounded corners baked in, we can\'t do anything about those</i>',
			'type': 'checkbox',
			'default': true
		}
	},
	'css': `
	#MyConfig .field_label{
		font-weight: normal;
		font-size: 13px;
	}
	#MyConfig kbd{
		border: 1px solid #ccc;
		background: #eee;
		border-radius: 3px;
		padding: 1px 3px;
		font-family: consolas, monospace;
	}`,
	'events': {
		'init': setClasses,
		'save': setClasses
	}
});

function setClasses(){
	// console.log(document.body);
	document.body.classList.toggle("nocrop", GM_config.get("uncropImages"));
	document.body.classList.toggle("nocropHover", GM_config.get("uncropOnHover"));
	document.body.classList.toggle("noRadius", GM_config.get("noRadius"));
	// console.log(GM_config.get("uncropImages"));
	// console.log(GM_config.get("uncropOnHover"));
	// console.log(GM_config.get("noRadius"));
	// console.log(document.body.classList);
}

GM_registerMenuCommand(GM_info.script.name + ' Settings', function(){
	GM_config.open();
});

// Custom TrustedTypes handling: Google's policies are giving us trouble in some configs.
var needsTrustedHTML = false;
var passThroughFunc = function(string, sink) {
	return string;
};
var TTPName = "toast";
var TP = {createHTML: passThroughFunc, createScript: passThroughFunc, createScriptURL: passThroughFunc};
try{
	if(typeof window.isSecureContext !== 'undefined' && window.isSecureContext){
		if (window.trustedTypes && window.trustedTypes.createPolicy){
			if(trustedTypes.defaultPolicy){
				console.log("TT Default Policy exists");
				TP = trustedTypes.defaultPolicy; // Is the default policy permissive enough? If it already exists, best not to overwrite it
			}
			else{
				TP = window.trustedTypes.createPolicy(TTPName, TP);
			}
			console.log("TP is now", TP);
			needsTrustedHTML = true;
		}
		else{
			console.log("Uh-oh");
		}
	}
}catch(e){
	console.error(e);
}

function addStyle(){
	let el = GM_addStyle(`
		.linkToTarget{
			box-shadow: 3px 5px 10px rgba(0,0,0,0.5);
			cursor: default;
			position: absolute;
			right:0; top:0;
			opacity: 0;
			background-color: rgba(255,255,255,0.5);
			transition: background-color 0.5s, opacity 0.5s
		}
		.failed .linkToTargetlink{
			color: rgba(230,100,100)!important;
		}
		a:hover .linkToTarget{
			opacity: 0.6;
		}
		a:hover .linkToTarget:hover{
			opacity: 1;
		}
		.linksdone:hover .linkToTarget{
			cursor: pointer;
		}
		.linkToTargetLink{
			color: rgba(155,177,233, 1)!important;
			font-size: 22pt;
			display: block;
			font-weight: bold;
			text-decoration: none!important;
			transition: color 0.5s, font-size 0.5s, padding 0.5s;
		}
		.temp .linkToTargetLink{
			color: rgba(200,200,200)!important;
		}
		.linkToTargetLink:hover{
			color: rgba(155,177,233, 1)!important;
			padding:8px;
			font-size: 30pt;
		}

		body.nocrop div#islmp div#islrg div.islrc div.isv-r a.islib,
		body.nocrop a .F0uyec,
		body.nocrop a img,
		body.nocrop .mNsIhb .YQ4gaf,
		body.nocrop .H8Rx8c img,
		body.nocropHover div#islmp div#islrg div.islrc div.isv-r a.islib:hover,
		body.nocropHover a .F0uyec:hover,
		body.nocropHover a:hover img,
		body.nocropHover .mNsIhb .YQ4gaf:hover,
		body.nocropHover .H8Rx8c img:hover{
			overflow: visible;
			z-index: 100;
			object-fit: contain;
		}
		body.noRadius a .F0uyec,
		body.noRadius div .eA0Zlc.mkpRId,
		body.noRadius div .cC9Rib{
			border-radius: 0;
		}`);
	el.id = "directLinkStyles";
	return el;
}
// console.log("style:", addStyle());

function updatePage()
{
	if(document.querySelector("#directLinkStyles") == null){
		addStyle();
	}
	// else console.log("Style already present");
	document.querySelectorAll(selector).forEach(function(e){
		if(e.classList.contains("linksdone")) // Why is the selector not working??
			return;
		var c = document.createElement("DIV");
		c.className="linkToTarget";
		c.innerHTML = trustedHTML("<a class='linkToTargetLink'>↗️</a>");
		e.parentElement.appendChild(c);
		c.querySelector("a.linkToTargetLink").onclick = clickLink;
		e.classList.add("linksdone");
	});
}

function clickLink(e){
	e.stopPropagation();
	e.preventDefault();
	var t = e.target;
	
	waitForLink(t, e);
	return false;
}

function waitForLink(t, e){
	var tp = t.parentElement.closest("a");
	console.log(tp);
	var imin = tp.href.indexOf("imgurl=");
	
	var openInNew = e.which==2;
	
	if(GM_config.get("newTabByDefault")){
		if(!e.ctrlKey)
			openInNew = true;
	}
	else{
		if(e.ctrlKey)
			openInNew = true;
	}
	
	if(imin<0)
	{
		var $e = tp;
		var restries = tp.getAttribute("resTries")?tp.getAttribute("resTries")*1+1:1;
		if(restries==1){
			$e.click();
//			tp.querySelector("img")?.click();
			tp.querySelector("img").click();
			setTimeout(function(){
				$e.click();
			}, 200);
			
//			$(tp).find("img").contextmenu();
//			$(tp).trigger({
//				type: 'mousedown',
//				which: 2
//			});
//			waitfor("#islsp a[aria-label='Close']", function(o){
//				$(o).click(); // somehow doesn't close the details view either
//			});
		}
		// #Sva75c > div.A8mJGd.NDuZHe.OGftbe-N7Eqid-H9tDt > div.LrPjRb > div.AQyBn > div.tvh9oe.BIB1wf > c-wiz > div > div > div > div > div.v6bUne.qmmlRd > div.p7sI2.PUxBg > a > img.sFlh5c.pT0Scc.iPVvYb
//		console.log("try", restries);
		tp.setAttribute("resTries", restries);

		if(tp.getAttribute("resTries")*1>=maxtries){
			console.log("This Link won't come up with a good fragment: " + tp.querySelector("img").src);
			tp.classList.add("linksdone");
			tp.classList.add("failed");
			tp.querySelector(".linkToTarget span").innerHTML = TP.createHTML("x");
			return true;
		}
		
		if(!tp.classList.contains("linkswait")){
			tp.classList.add("linkswait");
			tp.querySelector(".linkToTarget").classList.add("temp");
			tp.querySelector(".linkToTarget span").innerHTML = TP.createHTML("...");
		}
//			console.log("Not ready");
		setTimeout(function(){
			console.log("try again");
			waitForLink(t, e);
		}, 200);
		
		return true;
	}
	else{
		console.log("got link");
		var linkconts = tp.href.substr(imin+7);
		var piclink = linkconts.substr(0,linkconts.indexOf("&"));
		var reflink = linkconts.substr(linkconts.indexOf("imgrefurl=")+10);
		reflink = decodeURIComponent(reflink.substr(0, reflink.indexOf("&")));
		piclink = decodeURIComponent(piclink);
		tp.classList.remove("linkswait");
		let tl = tp.querySelector(".linkToTarget");
		if(tl){
			tl.classList.remove("temp");
			tl.querySelector("a.linkToTargetLink").href = piclink;
		}
		else
			console.log("Link not found?", tp);
		tp.classList.add("linksdone");
		if(e.which == 3)
			return false; // Don't open new tab on right click
		// console.log("Background?", GM_config.get("openInBackground"));
		if(openInNew){
			GM_openInTab(piclink, {
				active: !GM_config.get("openInBackground"),
				insert: true,
				parent: true
			});
		}
		else{
			location.href = piclink;
		}
	}
}

function trustedHTML(string) {
	if (!needsTrustedHTML)
		return string;
	const TT = TP.createHTML(string);
	// console.log(typeof TT, TT);
	return TT;
}

setInterval(updatePage, updateInterval);

updatePage();
/* eslint no-unused-vars: "off", no-implicit-globals: "off", curly: "off" */
/* globals GM_config, trustedTypes */