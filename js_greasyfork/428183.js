// ==UserScript==
// @name    	hoverPreview.js
// @version 	1.1
// @description	hover Preview images / videos / PDFs (if supported eg. by PDF.js extension)
// @author  	Anade
// @license 	GPL
// @namespace	Anade
// @homepageURL	https://jsfiddle.net/Anade/opny2m6x/
// @match   	https://moodle.upce.cz/*
// @x-note		match   	moodle.upce.cz
// @x-note  	match		*
// @require 	https://greasyfork.org/scripts/428185-hoverpreview-css/code/hoverPreviewcss.user.js
// @x-note  	
// @x-note  	hovering a pointer above a link to an image/video/PDF loads and displays it
// @x-note  	
// @x-note  	for assignments on Moodle: moodle.upce.cz
// @x-note  	TODO:
// @x-note  	 • links by content
// @x-note  	 • video
// @downloadURL https://update.greasyfork.org/scripts/428183/hoverPreviewjs.user.js
// @updateURL https://update.greasyfork.org/scripts/428183/hoverPreviewjs.meta.js
// ==/UserScript==

var hoverPreview = {
	// preferences
	prefs: {
		version: '1.1',
		enabled: true,
		debug: false,
		debugExts: false,
		debugLog: false,
		jsConsole: false,
		loadDelay: 500,				// ms
		loadTimeout: 20,			// hide loading animation if the preview fails to load after timeout seconds
		hideByPreviewLeave: true,	// mouse over the preview and out to hide the image/pdf
		hideByClick: true,			// click to hide the image/pdf, done: click on preview image, TODO: click anywhere or on the link?
		hideButtons: 0x0B,			// button mask: 0=all, 1=left, 2=middle, 4=right, 8=back, 0x10=forward
		hideByScroll: true,			// hide if the page scrolls, FIXME: other scrollable elements than window
		allowInteraction: true,		// allowed interaction (hideByClick or hideByPreviewLeave must be true)
		byExt: true,				// treat links as images by searching for image extension
		byContent: false,			// TODO
		byAttr: true,				// mime-type cpecified as attribute attrName="ext" – TODO: mime-type instead of ext
		attrName: 'data-type',
		imgExts: 'jpe?g|png',		// RE for extensions to match the image
		vidExts: 'mp(4|e?g)|mkv|webm|avi',	// RE for extensions to match the video: TODO
		pdfExts: 'pdf',				// RE for extensions to match the PDF
		// watch for modifications: choose a method: none, node, docNode, observer
		mutations: 'observer',		// preferred way
		//mutations: 'nodeEvent',	// deprecated
		showDimensions: true,
		showShrinkIfShrinked: true,
		showSize: true,
		roller: {
			dots: 12,				// number of dots
			degs: 35,				// rotation step
			delay: 60,				// animation delay step in ms
			spectrum: true, 		// set dot colors to color spectrum
			revSpectrum: true,		// reverse spectrum
			maxVal: 192,			// brightest color component value (255)
			hue: 5/6,				// % of hue (as a fraction) to start spectrum with
		},
	},

	// variables / constants
	containerId: 'hoverPreviewContainer',	// id of the preview container
	delayTimeoutID: 0,			// saved timeout for delay
	loadTimeoutID: 0,			// saved timeout for load
	previewContainer: null,		// preview container
	allLinks: null,				// links in DOM to inspect
	
	// functions

	// mouse/load event listeners
	previewHide: function(ev) { hoverPreview.eventLeave(ev); },		// preview: mouse leave event
	mouseLinkLeave: function(ev) { hoverPreview.eventLeave(ev); },	// link: mouse leave event
	mouseLinkEnter: function(ev) { hoverPreview.eventEnter(ev); },	// link: mouse enter event
	previewLoaded: function(ev) { hoverPreview.show(ev); },			// loaded: show loaded preview

	// event listener: on leave a link / a preview
	eventLeave: function(ev) {
		var hp = this;
		if (hp.delayTimeoutID) {
			clearTimeout(hp.delayTimeoutID);
			hp.delayTimeoutID = 0;
		}
		var hpp = hp.prefs;
		if (!hpp.enabled)
			return false;
		var doHide = false;
		if (hp.previewContainer && hp.previewContainer.preview) {
			if (hp.containerId == ev.currentTarget.id) {	// isPreviewEvent: event on the preview container?
				ev.preventDefault();
				doHide = hpp.hideByPreviewLeave && ev.type == 'mouseleave' ||
					hpp.hideByClick && (ev.type == 'mouseup' || ev.type == 'contextmenu') && (!hpp.hideButtons || hpp.hideButtons & (1<<ev.button));
			}
			else
				doHide = !hpp.hideByClick && !hpp.hideByPreviewLeave || hpp.hideByScroll && ev.type == 'scroll';
		}
		if (doHide)
			hp.hide(ev.target);
	},

	// event listener: on enter a link
	eventEnter: function(ev) {
		var hp = this;
		var hpp = hp.prefs;
		var hpc = hp.previewContainer;
		if (!hpp.enabled)
			return false;
		var preview = false;
		// test if image
		if (hpp.byExt) {
			hpc.ext = ev.target.href
				.replace(/\?.*$/, '')	// remove args
				.replace(/^.*\//, '')	// remove path
				.replace(/^.*\./, '');	// remove basename
			[	{e: hpp.imgExts, t: 'image'},
				{e: hpp.vidExts, t: 'video'},
				{e: hpp.pdfExts, t: 'pdf'}
			].forEach(function(e) {
				var re = new RegExp(e.e, 'i');
				if (re.test(hpc.ext)) {
					preview = true;
					hpc.type = e.t;
				}
			});
		}
		if (hpp.byAttr && ev.target.hasAttribute(hpp.attrName)) {
			// TODO/FIXME: ext → mime-type
			hpc.ext = ev.target.getAttribute(hpp.attrName);
			[	{e: hpp.imgExts, t: 'image'},
				{e: hpp.vidExts, t: 'video'},
				{e: hpp.pdfExts, t: 'pdf'}
			].forEach(function(e) {
				var re = new RegExp(e.e, 'i');
				if (re.test(hpc.ext)) {
					preview = true;
					hpc.type = e.t;
				}
			});
		}
		if (!preview)
			return false;
		// (delayed) load
		if (hpp.loadDelay > 0) {
			if (hp.delayTimeoutID)
				clearTimeout(hp.delayTimeoutID);
			hp.delayTimeoutID = setTimeout(function() { hp.load(ev.target, ev.clientX, ev.clientY); }, hpp.loadDelay);
		}
		else
			hp.load(ev.target, ev.clientX, ev.clientY);
	},


	// color changing functions
	// maxVal is brightest value for a color
	// width is size of color spectrum
	// the slope from 0 to 2*3*maxVal is transformed by:
	//	1. subtracting the value from 3*maxVal,
	//	2. applying absolute value,
	//	3. subtracting maxVal,
	//	4. limiting to interval 0, maxVal
	//	5. shifting along the x-axis by width/3 for blue and 2/3 for green
	//
	// 2*3*maxVal   /    1.        2.        3.        4.        5.
	//             /     3*M−y     abs(y)    y−M       max(0,y)    _    _ 
	//            /                                    min(M,y)  r  \__/  
	// 3*maxVal  /       \         \    /                           __    
	//          /     →   \     →   \  /  →  \    / →  _    _    g /  \__ 
	// ________/___________\_________\/_______\__/______\__/___       __  
	// 0                    \                  \/                b __/  \ 
	//                       \                                            
	//                        \                                           
	// get RGB for spectrum
	getSpectrumColor: function(col, start, width, reverse = false, maxVal = 255) {
		var cog = function(c, width, maxVal = 255) {
			return Math.max(0, Math.min(maxVal, Math.abs(3*maxVal - 2 * 3*maxVal * c/width) - maxVal))
		};
		return 'rgb(' +
			cog((width + (reverse ? -1 : 1) * col + start*width) % width, width, maxVal) + ',' +
			cog((width + (reverse ? -1 : 1) * col + start*width + width*2/3) % width, width, maxVal) + ',' +
			cog((width + (reverse ? -1 : 1) * col + start*width + width*1/3) % width, width, maxVal) +
			')';
	},
	// end of color changing funcions

	hide: function() {
		var hpc = this.previewContainer;
		if (this.prefs.debug)
			hpc.e.style.backgroundColor = '';
		hpc.style.display = 'none';
		hpc.preview.style.display = 'none';
	},

	// prepare the div with caption and content (image/video/pdf) + loading animation
	// e: link element
	load: function(e, pointerX, pointerY) {
		var hpc = this.previewContainer;
		if (hpc.e && hpc.preview)
			this.hide();
		if (this.prefs.debug) {
			//e.style.cssText = 'color: blue; background: yellow;';
			e.style.backgroundColor = (e.style.backgroundColor != 'yellow') ? 'yellow' : 'pink';
		}
		// hide old caption and preview
		hpc.cap.style.visibility = 'hidden';
		hpc.img.style.visibility = 'hidden';
		hpc.emb.style.visibility = 'hidden';
		hpc.style.display = 'block';
		// save element and pointer coords
		hpc.e = e;
		hpc.pointerX = pointerX;
		hpc.pointerY = pointerY;
		// get bBox of the link
		hpc.bBoxLink = e.getBoundingClientRect();
		// add padding 0.5em to the link bBox
		var pad = parseFloat(getComputedStyle(hpc).fontSize) / 2;
		// window.innerWidth includes scrollbar, width of the window − scrollbar and borders: root <html>.clientWidth
		hpc.bBoxLinkPadded = {
			width: hpc.bBoxLink.width + 2 * pad,
			height: hpc.bBoxLink.height + 2 * pad,
			top: Math.max(0, hpc.bBoxLink.top - pad),
			right: Math.min(document.documentElement.clientWidth, hpc.bBoxLink.right + pad),
			bottom: Math.min(document.documentElement.clientHeight, hpc.bBoxLink.bottom + pad),
			left: Math.max(0, hpc.bBoxLink.left - pad),
		};
		// center position of the link bBox
		hpc.bBoxLinkPadded.x = hpc.bBoxLinkPadded.left + hpc.bBoxLinkPadded.width / 2;
		hpc.bBoxLinkPadded.y = hpc.bBoxLinkPadded.top + hpc.bBoxLinkPadded.height / 2;
		// prepare roller
		hpc.roller.style.visibility = 'hidden';
		hpc.roller.style.display = 'block';
		hpc.roller.style.position = 'fixed';
		//hpc.roller.style.bottom = 'unset';
		// set roller position
		var w = hpc.roller.offsetWidth,
			h = hpc.roller.offsetHeight,
			W = document.documentElement.clientWidth,
			H = document.documentElement.clientHeight,
			x, y;
		y = hpc.bBoxLinkPadded.top >= h ? hpc.bBoxLinkPadded.top - h :
			hpc.bBoxLinkPadded.bottom + h <= H ? hpc.bBoxLinkPadded.bottom : 0;
		x = pointerX >= w / 2 ? pointerX - w / 2 - Math.max(0, pointerX + w / 2 - W) : 0;
		hpc.roller.style.left = x + 'px';
		hpc.roller.style.top = y + 'px';
		// show the roller
		hpc.roller.style.visibility = 'visible';
		// prepare preview
		// caption
		hpc.cap.span.innerText = e.innerText;
		hpc.cap.style.display = 'block';
		// initial position
		hpc.style.left = '0px';
		hpc.style.top = '0px';
		hpc.previewUrlAnchor = '';
		switch (hpc.type) {
			case 'pdf':
				hpc.preview = hpc.emb;
				hpc.preview.id = 'pdfPreview';
				hpc.preview.type = 'application/pdf';
				hpc.preview.style.width = (W - 8) + 'px';	// − shadow
				hpc.preview.style.height = (H - 4 - 1.65*2*pad) + 'px';	// − shadow − title
				hpc.previewUrlAnchor = '#zoom=page-fit&view=Fit';
				//hpc.preview.data = e.href + hpc.previewUrlAnchor;
				break;			
			case 'image':
				hpc.preview = hpc.img;
				hpc.preview.style.maxWidth = (W - 8) + 'px';	// − shadow
				hpc.preview.style.maxHeight = (H - 4 - 1.65*2*pad) + 'px';	// − shadow − title
				hpc.preview.alt = e.innerText;
				break;
		}
		//if (!this.prefs.hideByClick)
		//	hpc.preview.title = e.innerText;
		// after loading the image, show the box with it
		//hpc.preview.addEventListener('load', hoverPreview.previewLoaded, false);
		// start loading the image/pdf by setting link to it and display not to none
		hpc.preview.src = e.href + hpc.previewUrlAnchor;
		hpc.preview.url = e.href;	// save URL, src can be overwriten by plugin viewer (PDF.js prepends “chrome-extension:…”)
		hpc.preview.style.display = 'block';
		// remove roller after timeout (if the loading does not finish within timeout ms)
		hpc.loadTimeoutID = setTimeout(function() {
			// FIXME: remove onload listener, too?
			hoverPreview.previewContainer.roller.style.display = 'none';
		}, this.prefs.loadTimeout * 1000);
	},

	// the preview is loaded, measure its dimensions and show content
	show: function() {
		var hpp = this.prefs;
		var hpc = this.previewContainer;
		// update caption: add image real (natural) dimensions (must be after showing – display: block, visibility can be hidden)
		var knownDims = hpc.preview.naturalWidth && hpc.preview.naturalHeight;
		// fileSize: use performance with url of the loaded image (pdf size cannot be determined unless it was directly displayed)
		var fileSize = 0;
		if (performance) {
			var p = performance.getEntriesByName(hpc.preview.src);
			if (p.length > 0) {
				fileSize = p[0].decodedBodySize;	// transferSize, encodedBodySize, decodedBodySize
			}
		}
		if (!fileSize) {
			var xhr = new XMLHttpRequest();
			xhr.open('HEAD', hpc.preview.url, false);	// false: synchronous request
			xhr.send(null);	// FIXME! blocking call!
			if (200 == xhr.status)
				fileSize = xhr.getResponseHeader('Content-Length');
			else
				fileSize = -xhr.status * 1024;
		}
		hpc.cap.span.innerHTML =
			(hpp.showDimensions && knownDims ?
				hpc.preview.naturalWidth + '\u202F' + '×' + '\u202F' + hpc.preview.naturalHeight : '') + 	// real dimensions
			(hpp.showShrinkIfShrinked && knownDims ?
				(hpc.preview.width < hpc.preview.naturalWidth ?	// shrinked?
					' (' + Math.round(100 * hpc.preview.width / hpc.preview.naturalWidth, 0) + '\u202F' + '%) '
					: '')
				: '') +
			(hpp.showSize && fileSize > 0 ?
				' [' + Math.round(fileSize/1024, 0) + '\u00A0' + 'KiB' + '] ' : '') + 	// file size
			(knownDims && (hpp.showDimensions || hpp.showShrinkIfShrinked && hpc.preview.width < hpc.preview.naturalWidth) ||
				fileSize > 0 && hpp.showSize ? '&ensp;' : '') +
			hpc.e.innerText;
		// calc position
		var w = hpc.offsetWidth + 8,	// 8 is shadow (margin, counting both sides)
			h = hpc.offsetHeight + 8,
			W = document.documentElement.clientWidth,
			H = document.documentElement.clientHeight,
			x, y;
		x = (hpc.bBoxLinkPadded.x >= w / 2 ?	// fits left-half left?
			hpc.bBoxLinkPadded.x - w / 2 - Math.max(0, hpc.bBoxLinkPadded.x + w / 2 - W) :	// fits half-left: minus right overflow
			0) + 4;	// left-half does not fit left: from left edge + shadow
		y = hpc.bBoxLinkPadded.top >= h ?	// fits above link?
			hpc.bBoxLinkPadded.top - h + 1 :		// fits above: set position just above link (shadow fits in padding)
			hpc.bBoxLinkPadded.bottom + h <= H ?	// does not fit above; fits below link?
				hpc.bBoxLinkPadded.bottom :	// fits below: set position just below link
				(H - h) / 2 + 2;					// does not fit above or below: center vertically
		hpc.style.left = x + 'px';
		hpc.style.top = y + 'px';
		hpc.style.textAlign  = hpc.cap.offsetWidth > hpc.preview.offsetWidth ? 'center' : '';
		if (this.loadTimeoutID) {
			clearTimeout(this.loadTimeoutID);
			this.loadTimeoutID = 0;
		}
		// show
		hpc.roller.style.display = 'none';
		hpc.cap.style.visibility = 'visible';
		hpc.preview.style.visibility = 'visible';
	},

	// initialize all links under given node
	initLinks: function(startNode) {
		var hpp = this.prefs;
		var links = startNode ? startNode.getElementsByTagName('a') : this.allLinks;
		for (let a of links) {
			if (a.hpAttached || /^javascript:/.test(a.href))
				continue;
			a.hpAttached = true;
			a.addEventListener('mouseenter', hoverPreview.mouseLinkEnter, false);
			// if (!hpp.hideByClick && !hpp.hideByPreviewLeave)
			a.addEventListener('mouseleave', hoverPreview.mouseLinkLeave, false);
			if (hpp.debug) {
				var bg = '#FFD';
				// test if image
				if (hpp.byExt) {
					var ext = a.href
						.replace(/\?.*$/, '')	// remove args
						.replace(/^.*\//, '')	// remove path
						.replace(/^.*\./, '');	// remove basename
					var re = new RegExp([hpp.imgExts, hpp.vidExts, hpp.pdfExts].join('|'), 'i');
					if (hpp.debugExts)
						a.innerHTML += ' (' + ('' !== ext ? ext : 'no-ext detected') + ')';
					if (re.test(ext))
						bg = '#DFD';
					else
						bg = '#FDD';
				}
				if (hpp.byAttr && a.hasAttribute(hpp.attrName)) {
					// TODO/FIXME: ext → mime-type
					var ext = a.getAttribute(hpp.attrName);
					var re = new RegExp([hpp.imgExts, hpp.vidExts, hpp.pdfExts].join('|'), 'i');
					if (hpp.debugExts)
						a.innerHTML += ' (' + ext + ')';
					if (re.test(ext))
						bg = '#DFD';
					else
						bg = '#FDD';
				}
				a.style.backgroundColor = bg;
			}
		}
	},

	// initialization
	init: function() {
		// setup preview container div
		var hpc = this.previewContainer = document.createElement('div');
		hpc.id = this.containerId;	// hoverPreviewContainer
		hpc.style.display = 'none';
		// add listener if configured hide by leaving preview
		//if (this.prefs.allowInteraction)
		if (this.prefs.allowInteraction && (this.prefs.hideByPreviewLeave || this.prefs.hideByClick))
			hpc.style.pointerEvents = 'auto';
		if (this.prefs.hideByPreviewLeave) {
			hpc.style.cursor = 'crosshair';
			hpc.addEventListener('mouseleave', hoverPreview.previewHide, false);
			hpc.title = 'Move pointer out to close this preview';
		}
		if (this.prefs.hideByClick) {
			hpc.style.cursor = 'pointer';
			hpc.title = 'Click' + (this.prefs.hideByPreviewLeave ? ' or move pointer out' : '') + ' to close this preview';
			hpc.addEventListener('mouseup', hoverPreview.previewHide, false);
			if (!this.prefs.hideButtons || this.prefs.hideButtons & 4)	// all or right mouse button
				hpc.addEventListener('contextmenu', hoverPreview.previewHide, false);	// this prevents displaying context menu
		}
		if (this.prefs.hideByScroll)
			window.addEventListener('scroll', hoverPreview.mouseLinkLeave, { passive: true, capture: false });
		// caption
		hpc.cap = document.createElement('div');
		hpc.cap.className = 'caption';
		hpc.cap.span = document.createElement('span');
		hpc.cap.appendChild(hpc.cap.span);
		// content
		hpc.img = document.createElement('img');		// image
		hpc.img.className = 'preview';
		hpc.img.style.display = 'none';
		hpc.img.addEventListener('load', hoverPreview.previewLoaded, false);
		hpc.emb = document.createElement('embed');	// embedded PDF
		hpc.emb.className = 'preview';
		hpc.emb.style.display = 'none';
		hpc.emb.addEventListener('load', hoverPreview.previewLoaded, false);
		// roller (shown while loading)
		hpc.roller = document.createElement('div');		// roller box
		hpc.roller.div = hpc.roller.cloneNode(false);	// rotating box template
		hpc.roller.div.appendChild(hpc.roller.cloneNode(false)); // dot (rotated within rotating box)
		var hppr = this.prefs.roller;
		for (var i = 0; i < hppr.dots; ++i) {
			var dotBox = hpc.roller.div.cloneNode(true);	// div box including contained dot
			dotBox.style.animationDelay = -i * hppr.delay + 'ms';
			dotBox.firstChild.style.transform = 'rotate(' + (360 - i * hppr.degs) + 'deg)';
			if (hppr.spectrum) {
				dotBox.firstChild.style.backgroundColor = this.getSpectrumColor(i, hppr.hue, hppr.dots, hppr.revSpectrum, hppr.maxVal);
				dotBox.firstChild.style.boxShadow = '0 0 0.05em 0 ' + this.getSpectrumColor(i, hppr.hue, hppr.dots, hppr.revSpectrum, hppr.maxVal);
			}
			hpc.roller.appendChild(dotBox);
		}
		//hpc.roller.classList.add('roller');
		hpc.roller.className = 'roller';
		hpc.roller.id = 'hoverPreviewRoller';
		// add elements
		hpc.appendChild(hpc.cap);		// add caption
		hpc.appendChild(hpc.img);		// add preview content (image)
		hpc.appendChild(hpc.emb);		// add preview content (PDF)
		hpc.appendChild(hpc.roller);	// add roller (shown while the image is loading)

		// get all links
		this.allLinks = document.getElementsByTagName('a');

		// modify links upon document load
		window.addEventListener('load', function() {
			// add the container as the last element in body
			document.body.appendChild(hoverPreview.previewContainer);
			if (hoverPreview.prefs.debugLog) console.log('hoverPreview: preview container added.');

			hoverPreview.initLinks();

			switch (hoverPreview.prefs.mutations) {
				// watch for changes by nodeEvents
				case 'nodeEvent':
					document.body.addEventListener('DOMNodeInserted', function(ev) {
						// hoverPreview.initLinks(MutationEvent.relatedNode);
						hoverPreview.initLinks(ev.target);
					}, false);
					if (hoverPreview.prefs.debugLog) console.log('hoverPreview: NodeEvent listener initialized.');
					break;

				// watch for changes by MutationObserver
				case 'observer':
					var obsCallback = function(mList, obs) {
						for (let m of mList) {
							// if (hoverPreview.prefs.debugLog) console.log('Mutation type: ' + m.type);
							for (let n of m.addedNodes) {
								if (n.nodeType != Node.ELEMENT_NODE)
									continue;
								// if (hoverPreview.prefs.debugLog) console.log('Node added: ' + n.toString());
								hoverPreview.initLinks(n);
							}
						}
					}
					var obsConfig = {
						childList: true,
						subtree: true,
						characterData: false,
					};
					var watcher = new MutationObserver(obsCallback);
					watcher.observe(document.documentElement, obsConfig);
					if (hoverPreview.prefs.debugLog) console.log('hoverPreview: Observer initialized.');
					break;
			}

			// debugging JS consle
			if (hoverPreview.prefs.jsConsole) {
				var script = document.createElement('script');
				script.addEventListener('load', function() {
					eruda.init({
						tool: ['console', 'elements'],
					});
				}, false);
				script.src = "//cdn.jsdelivr.net/npm/eruda";
				document.body.appendChild(script);
				if (hoverPreview.prefs.debugLog) console.log('hoverPreview: eruda console added.');
			}
		}, false);

	},
}

hoverPreview.init();

// DEBUG ONLY PART ----------------------------------------------
/*
window.addEventListener('load', function() {
	// debug
	if (hoverPreview.prefs.debug) {
		addSomeLinks('Immediately: ');
		var debugAddTO = setTimeout(addSomeLinks, 2000);
	}
});

// debug mutations:
function addSomeLinks(text = '') {
	var d = document.createElement('div');
	d.id = 'added';
	d.style.display = 'none';
	d.style.minHeight = '4em';
	var p = document.createElement('p');
	p.innerHTML = text + 'Added after init to debug observer.<br>\n';
	d.appendChild(p);
	var a = document.createElement('a');
	a.href = 'https://www.google.com';
	a.innerHTML = 'Link to Google';
	p.appendChild(a);
	a = document.createElement('br');
	p.appendChild(a);
	a = document.createElement('a');
	a.href = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png';
	a.innerHTML = 'Link to Google logo';
	p.appendChild(a);
	d.style.display = '';
	document.body.prepend(d);
}
*/

// vim:sw=4:ts=4