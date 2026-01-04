// ==UserScript==
// @name         SimpCity Video & Image Link Copier
// @version      2.0
// @namespace    RiisDevScripts
// @description  Collect and copy video/image links across current or all XenForo thread pages, one page at a time, using localStorage clipboard workaround (Cloudflare safe). Supports separate video/image modes with domain matching.
// @author       https://github.com/RiisDev/
// @match        *https://simpcity.cr/threads/*
// @grant        GM_setClipboard
// @icon         https://simpcity.cr/data/assets/logo/favicon.png
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540497/SimpCity%20Video%20%20Image%20Link%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/540497/SimpCity%20Video%20%20Image%20Link%20Copier.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function showChoiceDialog(autoCopy) {
		const overlay = document.createElement('div');
		overlay.style.cssText = `
        	position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
			background: rgba(0,0,0,0.3);
			backdrop-filter: blur(5px);
			-webkit-backdrop-filter: blur(5px);
			display: flex; align-items: center; justify-content: center;
			z-index: 10000;
		`;

		const modal = document.createElement('div');
		modal.className = 'p-body-background p-body-background--main';
		modal.style.cssText = `
			background: var(--xf-palette-pureWhite);
			border-radius: 6px;
			padding: 20px;
			max-width: 320px;
			text-align: center;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
		`;

		const title = document.createElement('h3');
		title.textContent = 'Auto Copy Links';
		title.style.marginBottom = '12px';

		const prompt = document.createElement('p');
		prompt.textContent = 'Which links do you want to auto copy across all pages?';
		prompt.style.marginBottom = '20px';

		const btnContainer = document.createElement('div');
		btnContainer.style.display = 'flex';
		btnContainer.style.justifyContent = 'space-between';
		btnContainer.style.gap = '10px';

		function createOptionBtn(text, type) {
			const btn = document.createElement('button');
			btn.className = 'button--primary button rippleButton';
			btn.textContent = text;
			btn.style.flex = '1';
			if (autoCopy){
				btn.addEventListener('click', () => {
					document.body.removeChild(overlay);
					startAutoCopy(type);
				});
			}
			else {
				btn.addEventListener('click', () => {
					const links = extractLinks(type);
					if (links.length > 0) {
						GM_setClipboard(links.join('\n'));
						showXenforoNotice(`✅ Copied ${links.length} ${type} link(s)!`);
					} else {
						showXenforoNotice(`⚠️ No ${type} links found.`);
					}
					document.body.removeChild(overlay);
					
					localStorage.removeItem(XF_LINKS_TYPE);
					localStorage.removeItem(STORAGE_KEY);
				});
			}
			return btn;
		}

		const btnVideo = createOptionBtn('Video', 'video');
		const btnImage = createOptionBtn('Image', 'image');
		const btnBoth = createOptionBtn('Both', 'all');

		const btnCancel = document.createElement('button');
		btnCancel.className = 'button--link button rippleButton';
		btnCancel.textContent = 'Cancel';
		btnCancel.style.flex = '1';
		btnCancel.addEventListener('click', () => {
			document.body.removeChild(overlay);
			if (autoCopy) {
				showXenforoNotice('Auto copy cancelled.', 'warning');
			} else {
				showXenforoNotice('Copy cancelled.', 'warning');
			}
		});

		btnContainer.appendChild(btnVideo);
		btnContainer.appendChild(btnImage);
		btnContainer.appendChild(btnBoth);
		btnContainer.appendChild(btnCancel);

		modal.appendChild(title);
		modal.appendChild(prompt);
		modal.appendChild(btnContainer);
		overlay.appendChild(modal);
		document.body.appendChild(overlay);
	}

	function showXenforoNotice(message, type = 'success', duration = 3000) {
		const notice = document.createElement('div');
		notice.className = `p-notice p-notice--${type}`;
		notice.style.cssText = `
            position: fixed;
            top: 80px;
            right: 30px;
            z-index: 9999;
            max-width: 300px;
            padding: 10px 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            border-radius: 5px;
            font-size: 14px;
            opacity: 0;
            border: 2px solid hsla(var(--xf-textColorEmphasized));
            animation: fadeInOut 0.3s forwards;
        `;
		notice.innerHTML = `<div class="p-notice__content">${message}</div>`;
		document.body.appendChild(notice);

		setTimeout(() => {
			notice.style.animation = 'fadeOut 0.3s forwards';
			setTimeout(() => notice.remove(), 300);
		}, duration);
	}

	const style = document.createElement('style');
	style.textContent = `
        @keyframes fadeInOut {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
	document.head.appendChild(style);

	const XF_LINKS_TYPE = 'xf_links_type';
	const STORAGE_KEY = 'xf_links_collector';
	const imageDomains = ['bunkr', 'cyberdrop', 'pixeldrain', 'ibb.co', 'postimg', 'jpg5.su'];
	const videoDomains = ['gofile', 'pixeldrain', 'mega', 'mediafire', 'xhamster', 'pornhub', 'bunkr', 'cyberdrop', 'cyberfile', 'saint2', 'pvvstream', 'noodlemagazine.com', 'xvideos', 'vk'];

	const isVideoLink = url => { try { return videoDomains.some(domain => new URL(url).hostname.includes(domain)); } catch { return false; } };
	const isImageLink = url => { try { return imageDomains.some(domain => new URL(url).hostname.includes(domain)); } catch { return false; } };
	function GetStorageLinks() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
	function GetType() { return localStorage.getItem(XF_LINKS_TYPE); }

	function extractLinks(type) {
		if (!GetType()) { localStorage.setItem(XF_LINKS_TYPE, type);}

		const links = new Set();

		const anchors = document.querySelectorAll('.message--post a[href]');
		anchors.forEach(a => {
			const href = a.href.trim();
			if (
				href &&
				(
					(type === 'video' && isVideoLink(href)) ||
					(type === 'image' && isImageLink(href)) ||
					(type === 'all' && (isVideoLink(href) || isImageLink(href)))
				)
			) {
				links.add(href);
			}
		});

		const iframes = document.querySelectorAll('iframe.saint-iframe[src]');
		if (type !== 'image') {
			iframes.forEach(iframe => {
				const src = iframe.src.trim();
				if (src && isVideoLink(src)) {
					links.add(src);
				}
			});
		}

		return Array.from(links);
	};

	function getNextPageUrl() {
		const nextBtn = document.querySelector('.pageNav-jump--next');
		return nextBtn ? nextBtn.href : null;
	};

	function saveLinks(newLinks) {
		const existing = GetStorageLinks();
		const merged = [...new Set([...existing, ...newLinks])];
		localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
		return merged;
	};

	function copyAndFinish(type) {
		const allLinks = GetStorageLinks();
		if (allLinks.length > 0) {
			GM_setClipboard(allLinks.join('\n'));
			showXenforoNotice(`✅ Copied ${allLinks.length} ${type} link(s) from all pages!`);
		} else {
			showXenforoNotice(`⚠️ No ${type} links were found.`);
		}

		localStorage.removeItem(STORAGE_KEY);
		localStorage.removeItem(XF_LINKS_TYPE);
	};

	function startAutoCopy(type) {
		localStorage.removeItem(STORAGE_KEY);
		localStorage.removeItem(XF_LINKS_TYPE);

		const links = extractLinks(type);
		saveLinks(links);

		const nextPage = getNextPageUrl();
		if (nextPage) {
			window.location.href = nextPage;
		} else {
			copyAndFinish(type);
		}
	}
	
	function autoContinueIfNeeded() {
		const linksExist = GetStorageLinks();
		const type = GetType();
		if (!linksExist || !type) return;

		const links = extractLinks(type);
		saveLinks(links);

		const nextPage = getNextPageUrl();
		if (nextPage) {
			setTimeout(() => {
				window.location.href = nextPage;
			}, 1000);
		} else {
			copyAndFinish(type);
		}
	};

	function addButton(label, clickHandler) {
		const buttonGroup = document.querySelector('.buttonGroup');
		if (!buttonGroup) return;

		const btn = document.createElement('a');
		btn.href = '#';
		btn.className = 'button--link button rippleButton';
		btn.innerHTML = `<span class="button-text">${label}</span>`;
		btn.addEventListener('click', e => { e.preventDefault(); clickHandler(); });
		buttonGroup.prepend(btn);
	};

	function addButtons() {
		addButton('📋 Start Auto Copy', () => {
			showChoiceDialog(true);
		});

		addButton('📋 Copy Links', () => {
			showChoiceDialog(false);
		});
	};

	window.addEventListener('load', () => {
		addButtons();
		autoContinueIfNeeded();
	});
})();