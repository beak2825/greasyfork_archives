// ==UserScript==
// @name         Discord Context Menu Extender
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adding Discord desktop action buttons in context menu in discord web version
// @author       DoctorDeathDDracula & Sticky
// @supportURL   https://discord.gg/sHj5UauJZ4
// @license      MIT
// @match        *://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      discord.com
// @connect      cdn.discordapp.com
// @connect      media.discordapp.net
// @connect      images-ext-1.discordapp.net
// @connect      images-ext-2.discordapp.net
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/446368/Discord%20Context%20Menu%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/446368/Discord%20Context%20Menu%20Extender.meta.js
// ==/UserScript==


(function() {
	'use strict';

	const console = {
		log: GM_log
	};

	class DiscordContextMenuExtender {

		constructor() {
			this.compatibilityItems = ['ClipboardItem', 'MutationObserver'];
			this.currentElement = null;
			this.style = `.my-focused{background-color:var(--brand-experiment-560);color:#fff;} .my-focused > *{color:#fff !important;}`;
		}

		cc(tag, options = {}, parent = false, init = undefined) {
			const children = options.children || [];
			delete options.children;
			const element = Object.assign(document.createElement(tag), options);
			for (const child of children) element.appendChild(child);
			if (typeof init == 'function') init(element);
			return parent && parent.nodeType === Node.ELEMENT_NODE ? parent.appendChild(element) : element;
		}

		ss(selector, searchIn = document, all = false) {
			return all ? searchIn.querySelectorAll(selector) : searchIn.querySelector(selector);
		}

		checkForСompatibility() {
			for (let item of this.compatibilityItems) {
				if (!(item in unsafeWindow)) return false;
			}
			return true;
		}

		init() {
			if (!this.checkForСompatibility()) return alert('Sorry, your browser does not support this feature');
			document.addEventListener('DOMContentLoaded', this.onDOMContentLoaded.bind(this));
			unsafeWindow.addEventListener('pointerdown', this.onPointerDown.bind(this));
			this.shutDownConsole();
			this.setTriggerOnElement('#message', 'addedNodes', this.onContextMenu.bind(this));
		}

		onDOMContentLoaded() {
			this.addStyles();
		}

		addStyles() {
			this.cc('style', {
				textContent: this.style
			}, document.head);
		}

		shutDownConsole() {
			for (const key in Object.getOwnPropertyDescriptors(unsafeWindow.console)) unsafeWindow.console[key] = () => {};
		}

		onPointerDown(e) {
			if (e.which == 3) this.currentElement = e.target;
		}

		onContextMenu(menu) {
			const currentMessageBlock = this.currentElement.closest('[id*="chat-messages"]');
			const media = this.currentElement.closest('[class*=embedMedia]') || this.currentElement.closest('[class*="messageAttachment"]');
			const group = this.ss('[role="group"]', menu, true)[1];

			if (media !== null) {
				let mediaType;
				if (mediaType = this.ss('img', media)) {
					group.after(this.cc('div', {
						role: "group",
						className: this.ss('[role="group"]', menu, true).className,
						children: [
							this.generateSplitLine(),
							this.generateContextButton(mediaType, menu, group, 'Copy Image', async() => {
								await this.copyImage(mediaType);
								menu.remove();
							}),
							this.generateContextButton(mediaType, menu, group, 'Save Image', async() => {
								await this.downloadImage(mediaType);
								menu.remove();
							}),
							this.generateSplitLine(),
							this.generateContextButton(mediaType, menu, group, 'Copy Link', () => {
								GM_setClipboard(this.getFullOfDiscordImage(mediaType.src).split('?')[0]);
								menu.remove();
							}),
							this.generateContextButton(mediaType, menu, group, 'Open Link', async() => {
								window.open(this.getFullOfDiscordImage(mediaType.src).split('?')[0], '_blank');
								menu.remove();
							})
						]
					}));
					this.fixMenuPosition(menu);
				} else if ((mediaType = this.ss('video:not([aria-label="GIF"])', media))) {
					group.after(this.cc('div', {
						role: "group",
						className: this.ss('[role="group"]', menu, true).className,
						children: [
							this.generateSplitLine(),
							this.generateContextButton(mediaType, menu, group, 'Copy Link', () => {
								GM_setClipboard(this.getFullOfDiscordImage(mediaType.src).split('?')[0]);
								menu.remove();
							}),
							this.generateContextButton(mediaType, menu, group, 'Open Link', async() => {
								window.open(this.getFullOfDiscordImage(mediaType.src).split('?')[0], '_blank');
								menu.remove();
							})
						]
					}));
					this.fixMenuPosition(menu);
				} else if ((mediaType = this.ss('video[aria-label="GIF"]', media))) {
					group.after(this.cc('div', {
						role: "group",
						className: this.ss('[role="group"]', menu, true).className,
						children: [
							this.generateSplitLine(),
							this.generateContextButton(mediaType, menu, group, 'Copy Link', () => {
								GM_setClipboard(this.getFullOfDiscordImage(mediaType.src).split('?')[0]);
                                menu.remove();
							}),
							this.generateContextButton(mediaType, menu, group, 'Open Link', async() => {
								window.open(this.getFullOfDiscordImage(mediaType.src).split('?')[0], '_blank');
								menu.remove();
							})
						]
					}));
					this.fixMenuPosition(menu);
				} else {
					console.log('unknown type');
				}
			} else {
				console.log('null');
			}
		}

		fixMenuPosition(menu) {
			const rectM = menu.getBoundingClientRect();
			if (rectM.y + rectM.height > window.innerHeight) {
				const def = rectM.y + rectM.height - window.innerHeight;
				const top = menu.parentNode.style.top.replace('px', '');
				menu.parentNode.style.top = top - def + 'px';
			}
		}

		generateSplitLine() {
			return this.cc('div', {
				role: 'separator',
				style: 'box-sizing:border-box;margin:4px;border-bottom:1px solid var(--background-modifier-accent);'
			});
		}

		generateContextButton(mediaType, menu, group, text, onclick) {
			return this.cc('div', {
				role: "group",
				children: [
					this.cc('div', {
						className: group.children[1].className,
						children: [
							this.cc('div', {
								textContent: text,
								style: group.children[1].firstChild.className,
							})
						],
						onclick: onclick,
						onmouseenter: function() {
							const focused = menu.querySelector('[class*="focused"]');
							if (focused) focused.classList.remove(Array.from(focused.classList).find(_class => _class.startsWith('focused')));
							this.classList.add('my-focused');
						},
						onmouseleave: function() {
							this.classList.remove('my-focused');
						}
					})
				]
			})
		}

		setTriggerOnElement(selector, action, callback, once, searchIn) {
			const observer = new MutationObserver(function(mutations) {
				for (const mutation of mutations) {
					const nodes = mutation[action] || [];
					for (const node of nodes) {
						const element = node.matches && node.matches(selector) ? node : (node.querySelector ? node.querySelector(selector) : null);
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
		}

		async downloadImage(image) {
			const blob = await this.requestImage(this.getFullOfDiscordImage(image.src), 'blob');
			const dataURL = await this.blobToBase64(blob);
			this.cc('a', {
				href: dataURL,
				download: image.src.split('/').pop().split('?')[0]
			}).click();
		}

		async imageToPNGBlob(blob) {
			const dataURL = await this.blobToBase64(blob);
			console.log(dataURL);
		}

		blobToBase64(blob) {
			return new Promise((resolve) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result);
				reader.readAsDataURL(blob);
			});
		}

		async copyImage(image) {
			await (this.getExtension(image.src) != 'png' ? this.copyNonPNGImage(image) : this.copyPNGImage(image));
		}

		async copyNonPNGImage(image) {
			const blob = await this.requestImage(image.src, 'blob');
			const dataURL = await this.blobToBase64(blob);
			const pngBlob = await this.imageDataURLToPNGBlob(dataURL);
			this.copyImageFromBlob(pngBlob);
		}

		imageDataURLToPNGBlob(dataURL) {
			return new Promise(resolve => {
				const img = this.cc('img', {
					src: dataURL,
					onload: () => {
						const canvas = this.cc('canvas', {
							style: 'position:fixed;top:0px;left:0px;z-index:1000;',
							width: img.width,
							height: img.height
						});
						const context = canvas.getContext('2d');
						context.drawImage(img, 0, 0, img.width, img.height);
						canvas.toBlob(blob => resolve(blob));
					}
				});
			});
		}

		async copyPNGImage(image) {
			const imageBlob = await this.requestImage(this.getFullOfDiscordImage(image.src), 'blob');
			this.copyImageFromBlob(imageBlob);
		}

		copyImageFromBlob(blob) {
			const item = new unsafeWindow.ClipboardItem({
				"image/png": blob
			});
			navigator.clipboard.write([item]);
		}

		requestImage(imageURL, responseType) {
			return new Promise(function(resolve, reject) {
				GM_xmlhttpRequest({
					methods: "GET",
					responseType: responseType,
					url: imageURL,
					onload: function(data) {
						resolve(data.response);
					},
					onerror: function(e) {
						reject(e);
					}
				});
			});
		}

		getFullOfDiscordImage(imageURL) {
			return imageURL.replace('media.discordapp.net', 'cdn.discordapp.com');
		}

		getNoneDefaultStyle(node) {
			const styles = [];
			const supportElement = this.cc(node.tagName, {
				visible: false
			}, document.body);
			const elementStyles = window.getComputedStyle(node);
			const defaultStyles = window.getComputedStyle(supportElement);
			for (const key of elementStyles) {
				if (elementStyles[key] !== defaultStyles[key] && defaultStyles[key] !== '') styles.push([key, elementStyles[key]]);
			}
			supportElement.remove();
			return styles;
		}

		packInlineStyle(style) {
			return style.reduce(function(pre, cur) {
				return pre + ";" + cur[0] + ":" + cur[1];
			}, "") + ";";
		}

		getExtension(filename) {
			return filename.split('.').pop().split('?')[0];
		}
	}

	const DCME = new DiscordContextMenuExtender();
	DCME.init();

})();
