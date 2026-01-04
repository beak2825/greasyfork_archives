// ==UserScript==
// @name         YouTube ScreenShoter
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Screenshots current YT frame in full quality
// @author       DoctorDeathDDracula & Sticky
// @match        *://*.youtube.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/446275/YouTube%20ScreenShoter.user.js
// @updateURL https://update.greasyfork.org/scripts/446275/YouTube%20ScreenShoter.meta.js
// ==/UserScript==


(function() {
	'use strict';

	function YouTubeScreenShoter() {}

	YouTubeScreenShoter.prototype.storage = {
		selectors: {
			reactionButton: 'ytd-toggle-button-renderer',
			screenshotButton: "#__my-screenshot-button",
			reactionPanel: "#top-level-buttons-computed"
		},
		ids: {
			screenshotButton: '__my-screenshot-button'
		},
		icons: {
			iconBlackSVG: '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" sodipodi:docname="iconB.svg" inkscape:version="1.0 (4035a4fb49, 2020-05-01)" id="svg8" version="1.1" viewBox="0 0 6.3499999 6.35" height="24" width="24"><defs id="defs2"/><sodipodi:namedview inkscape:window-maximized="1" inkscape:window-y="-8" inkscape:window-x="-8" inkscape:window-height="1017" inkscape:window-width="1920" units="px" showgrid="false" inkscape:document-rotation="0" inkscape:current-layer="layer1" inkscape:document-units="mm" inkscape:cy="9.5831076" inkscape:cx="11.629344" inkscape:zoom="22.4" inkscape:pageshadow="2" inkscape:pageopacity="0.0" borderopacity="1.0" bordercolor="#666666" pagecolor="#ffffff" id="base"/><metadata id="metadata5"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title/></cc:Work></rdf:RDF></metadata><g inkscape:label="Слой 2" id="layer2" inkscape:groupmode="layer"/><g id="layer1" inkscape:groupmode="layer" inkscape:label="Слой 1"><path id="path10" d="m 0.86839843,2.5970013 0.007815,-1.72490613 1.71861757,0.006879" style="fill:none;stroke:#000;stroke-width:.52916667;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path style="fill:none;stroke:#000;stroke-width:.52916667;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 5.4816006,2.5933023 5.4737906,0.8684026 3.7551742,0.8752816" id="path10-5"/><path style="fill:none;stroke:#000;stroke-width:.52916667;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 0.86810411,3.7567748 0.007815,1.7214547 1.71884519,-0.00686" id="path10-55"/><path id="path10-5-2" d="m 5.4819176,3.7604659 -0.00781,1.7214488 -1.7188442,-0.00685" style="fill:none;stroke:#000;stroke-width:.52916667;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
			iconWhiteSVG: '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" sodipodi:docname="iconW.svg" inkscape:version="1.0 (4035a4fb49, 2020-05-01)" id="svg8" version="1.1" viewBox="0 0 6.3499999 6.35" height="24" width="24"><defs id="defs2"/><sodipodi:namedview inkscape:window-maximized="1" inkscape:window-y="-8" inkscape:window-x="-8" inkscape:window-height="1017" inkscape:window-width="1920" units="px" showgrid="false" inkscape:document-rotation="0" inkscape:current-layer="layer1" inkscape:document-units="mm" inkscape:cy="9.5831076" inkscape:cx="11.629344" inkscape:zoom="22.4" inkscape:pageshadow="2" inkscape:pageopacity="0.0" borderopacity="1.0" bordercolor="#666666" pagecolor="#ffffff" id="base"/><metadata id="metadata5"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title></dc:title></cc:Work></rdf:RDF></metadata><g inkscape:label="Слой 2" id="layer2" inkscape:groupmode="layer"/><g id="layer1" inkscape:groupmode="layer" inkscape:label="Слой 1"><path id="path10" d="m 0.86839843,2.5970013 0.007815,-1.72490613 1.71861757,0.006879" style="fill:none;stroke:#fff;stroke-width:.52916667;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path style="fill:none;stroke:#fff;stroke-width:.52916667;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 5.4816006,2.5933023 5.4737906,0.8684026 3.7551742,0.8752816" id="path10-5"/><path style="fill:none;stroke:#fff;stroke-width:.52916667;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 0.86810411,3.7567748 0.007815,1.7214547 1.71884519,-0.00686" id="path10-55"/><path id="path10-5-2" d="m 5.4819176,3.7604659 -0.00781,1.7214488 -1.7188442,-0.00685" style="fill:none;stroke:#fff;stroke-width:.52916667;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>'
		},
        styles: '.__my-screenshot-animation {opacity: 0 !important}'

	};

    YouTubeScreenShoter.prototype.init = function() {
        document.addEventListener('DOMContentLoaded', this.onDOMContentLoaded.bind(this));
        this.setTriggerOnElement(this.storage.selectors.reactionPanel, 'addedNodes', this.onNewPanel.bind(this));
    };

	YouTubeScreenShoter.prototype.cc = function(tag, options, parent, init) {
		options = options || {};
		var children = options.children || [];
		delete options.children;
		var element = Object.assign(document.createElement(tag), options);
		for (var i = 0; i < children.length; i++) element.appendChild(children[i]);
		if (typeof init == 'function') init.call(element);
		return parent && parent.nodeType === Node.ELEMENT_NODE ? parent.appendChild(element) : element;
	};

	YouTubeScreenShoter.prototype.ss = function(selector, searchIn, all) {
		searchIn = searchIn || document;
		return all ? searchIn.querySelectorAll(selector) : searchIn.querySelector(selector);
	};

    YouTubeScreenShoter.prototype.onDOMContentLoaded = function() {
        this.addStyles();
    };

    YouTubeScreenShoter.prototype.addStyles = function() {
        this.cc('style', {
            textContent: this.storage.styles
        }, document.head);
    };

	YouTubeScreenShoter.prototype.onNewPanel = function(panel) {
		this.initPanel(panel);
		this.setTriggerOnElement(this.storage.selectors.screenshotButton, 'removedNodes', (function() {
			this.initPanel(panel);
		}).bind(this), false, panel);
	};

	YouTubeScreenShoter.prototype.initPanel = function(panel) {
		if (panel.children.length !== 0) {
			var myButton = this.ss(this.storage.selectors.screenshotButton, panel);
			if (!myButton) {
				var reactionButton = this.ss(this.storage.selectors.reactionButton, panel);
				if (reactionButton && reactionButton.nextElementSibling) {
					reactionButton.nextElementSibling.after(this.generateButton());
				}
			}
		}
	};

	YouTubeScreenShoter.prototype.setTriggerOnElement = function(selector, action, callback, once, searchIn) {
		var observer = new MutationObserver(function(mutations) {
			for (var mi = 0; mi < mutations.length; mi++) {
				var mutation = mutations[mi];
				var addedNodes = mutation[action] || [];
				for (var ani = 0; ani < addedNodes.length; ani++) {
					var node = addedNodes[ani];
					var element = node.matches && node.matches(selector) ? node : (node.querySelector ? node.querySelector(selector) : null);
					if (element) {
						if (once) {
							observer.disconnect();
							return callback(element);
						} else {
							callback(element);
						}
					}
				}
			}
		});

		observer.observe(searchIn || document, {
			attributes: false,
			childList: true,
			subtree: true
		});

		return observer;
	};

	YouTubeScreenShoter.prototype.generateButton = function() {
		return this.cc("button", {
			id: this.storage.ids.screenshotButton,
			style: "appearance:none;border:none;outline:none;background-color:#0000;padding:0;display:flex;cursor:pointer;",
			children: [
				this.cc("div", {
					style: "padding:6px;",
					children: [
						this.SVGPacker(document.firstElementChild.getAttribute("dark") == 'true' ? this.storage.icons.iconWhiteSVG : this.storage.icons.iconBlackSVG)
					]
				}),
				this.cc("div", {
					children: [
						this.cc("div", {
							style: this.packInlineStyle(this.getNoneDefaultStyle(this.ss("#text", this.ss(this.storage.selectors.reactionButton)))),
							textContent: "PRTSC"
						}, false, function() {
							this.style.width = "";
							this.style.padding = "10px 10px 0px 0px";
						})
					]
				})
			],
			onclick: (function(event) {
				var video = this.ss("video");
				var canvas = this.cc("canvas", {
					width: video.videoWidth,
					height: video.videoHeight
				});
				var context = canvas.getContext('2d');

				context.drawImage(video, 0, 0, canvas.width, canvas.height);

				if (event.ctrlKey) {
					this.cc("a", {
						download: "download",
						href: canvas.toDataURL("image/png")
					}).click();
				} else {
                    if ('ClipboardItem' in window) {
                        canvas.toBlob(this.onCopyImage.bind(this));
                    } else {
                        alert('Sorry, your browser does not support coping, try to download it by pressing screenshot button with ctrl key pressed.')
                    }
				}
			}).bind(this)
		});
	};

    YouTubeScreenShoter.prototype.onCopyImage = function(blob) {
        navigator.clipboard.write([new window.ClipboardItem({
            "image/png": blob
        })]);
    };

	YouTubeScreenShoter.prototype.getComputedStyle = window.getComputedStyle.bind(window);

	YouTubeScreenShoter.prototype.getNoneDefaultStyle = function(node) {
		var styles = [];
		var supportElement = this.cc(node.tagName, {
			visible: false
		}, document.body);
		var elementStyles = this.getComputedStyle(node);
		var defaultStyles = this.getComputedStyle(supportElement);
		var keys = Object.keys(defaultStyles);
		for (var i = 0; i < keys.length; i++) {
			if (elementStyles[keys[i]] !== defaultStyles[keys[i]] && defaultStyles[keys[i]] !== '') styles.push([keys[i], elementStyles[keys[i]]]);
		}
		supportElement.remove();
		return styles;
	};

	YouTubeScreenShoter.prototype.packInlineStyle = function(style) {
		return style.reduce(function(pre, cur) {
			return pre + ";" + cur[0] + ":" + cur[1];
		}, "") + ";";
	};

	YouTubeScreenShoter.prototype.SVGPacker = function(SVGXML) {
		return this.cc("div", {
			innerHTML: SVGXML
		}).firstChild;
	};

	var YTSS = new YouTubeScreenShoter();
	YTSS.init();

})();

