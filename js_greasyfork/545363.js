// ==UserScript==
// @name         Emby Cover Art Helper
// @namespace    https://github.com/kumu-ze/Emby-Cover-Art-Helper
// @version      1.0.1
// @description  Emby 封面查看&下载助手：在详情页与操作菜单添加查看/下载封面按钮，自动识别语言，性能优化、防重复注入。
// @description:en View & download Emby cover images on detail pages and action sheet; i18n + perf optimized.
// @author       kumuze (orig idea & maintenance); contributors: Gemini, GitHub Copilot
// @license      MIT
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @match        *://*/web/index.html*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/545363/Emby%20Cover%20Art%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/545363/Emby%20Cover%20Art%20Helper.meta.js
// ==/UserScript==

(function () {
	'use strict';

	/********************** 环境探测与兼容层 ************************/
	const HAS_GM_ADDSTYLE = typeof GM_addStyle === 'function';
	const HAS_GM_XHR = typeof GM_xmlhttpRequest === 'function';
	const HAS_GM_DOWNLOAD = typeof GM_download === 'function';

	function injectStyleFallback(css) {
		if (document.getElementById('cover-helper-style')) return;
		const style = document.createElement('style');
		style.id = 'cover-helper-style';
		style.textContent = css;
		document.head.appendChild(style);
	}

	/********************** 样式 ************************/ 
	const STYLE_BLOCK = `
		.detailButton.custom-cover-btn {
			background-color: #525252;
			color: #fff;
			margin-left: 10px;
			transition: background-color .2s;
		}
		.detailButton.custom-cover-btn:hover { background-color: #626262 !important; }
		.custom-cover-inline-icon { vertical-align: middle; }
		/* ActionSheet 自定义按钮（跟随原主题即可，主要保证结构一致） */
		.actionSheetMenuItem.custom-cover-btn-injected .listItemBodyText { font-weight: 500; }
	`;
	if (HAS_GM_ADDSTYLE) {
		GM_addStyle(STYLE_BLOCK);
	} else {
		injectStyleFallback(STYLE_BLOCK);
	}

	/********************** 配置 / 可调参数 ************************/ 
	const CONFIG = {
		debounceMs: 120,            // MutationObserver 去抖间隔
		enableActionSheet: true,    // 是否在操作菜单中注入
		enableDetailButtons: true,  // 是否在详情页注入
		preferGMDownload: true,     // 如果 GM_download 可用则优先使用
		openInNewTab: true          // 点击“查看封面”是否新标签打开
	};

	/********************** 国际化 ************************/ 
	const LANG = (navigator.language || '').toLowerCase();
	const isZH = LANG.startsWith('zh');
	const I18N = {
		view: isZH ? '查看封面' : 'View Cover',
		download: isZH ? '下载封面' : 'Download Cover',
		downloading: isZH ? '下载中...' : 'Downloading...',
		failed: isZH ? '下载图片失败，请检查控制台。' : 'Failed to download cover. Check console.'
	};

	/********************** 工具函数 ************************/ 
	function log(...args) { console.debug('[CoverHelper]', ...args); }

	function safeFileName(name, fallback = 'poster') {
		const base = (name || fallback).trim().replace(/[\\/:"*?<>|]/g, '-');
		return base || fallback;
	}

	function guessExtensionFromHeaders(headers) {
		if (!headers) return 'jpg';
		const match = headers.match(/content-type:\s*([^;\n]+)/i);
		if (match && match[1]) {
			const subtype = match[1].split('/')[1];
			if (subtype) {
				if (/jpeg/i.test(subtype)) return 'jpg';
				return subtype.split('+')[0];
			}
		}
		return 'jpg';
	}

	function extractHighRes(url) {
		if (!url) return null;
		// Emby/Jellyfin 通常参数控制尺寸，去掉查询可获取原图；某些情况可以替换 quality 指示符，这里保持简单
		return url.split('?')[0];
	}

	function currentDetailImage() {
		return document.querySelector('.detailImageContainer-main img.cardImage, .detail-main-items-container-inner img.cardImage');
	}

	function currentTitle() {
		const h1 = document.querySelector('h1.itemName-primary');
		if (h1 && h1.textContent) return h1.textContent.trim();
		return undefined;
	}

	/********************** 下载逻辑（多环境） ************************/ 
	function downloadImage(url, titleHint) {
		if (!url) return;
		const baseName = safeFileName(titleHint || currentTitle());

		// 1. 优先 GM_download
		if (CONFIG.preferGMDownload && HAS_GM_DOWNLOAD) {
			try {
				GM_download({ url, name: baseName + '.jpg', saveAs: true, ontimeout: () => log('GM_download timeout') });
				return;
			} catch (e) { log('GM_download error -> fallback', e); }
		}

		// 2. GM_xmlhttpRequest 分支
		if (HAS_GM_XHR) {
			GM_xmlhttpRequest({
				method: 'GET',
				url,
				responseType: 'blob',
				onload: (res) => genericDownloadHandler(res.response, guessExtensionFromHeaders(res.responseHeaders || ''), baseName),
				onerror: (e) => { console.error('Download error', e); alert(I18N.failed); }
			});
			return;
		}

		// 3. 纯浏览器 fetch 回退
		fetch(url, { credentials: 'include' })
			.then(res => {
				if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
				const ct = res.headers.get('content-type') || '';
				const ext = guessExtensionFromHeaders('content-type: ' + ct);
				return res.blob().then(blob => genericDownloadHandler(blob, ext, baseName));
			})
			.catch(err => { console.error('Fetch download failed', err); alert(I18N.failed); });
	}

	function genericDownloadHandler(blob, extension, baseName) {
		try {
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = baseName + '.' + (extension || 'jpg').replace(/[^a-z0-9]/gi, '');
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			setTimeout(() => URL.revokeObjectURL(a.href), 8000);
		} catch (err) {
			console.error(err);
			alert(I18N.failed);
		}
	}

	/********************** 按钮生成 ************************/ 
	function createDetailButton(id, iconName, text) {
		const btn = document.createElement('button');
		btn.id = id;
		btn.setAttribute('is', 'emby-button');
		btn.type = 'button';
		btn.className = 'detailButton emby-button button-hoverable raised custom-cover-btn';
		btn.innerHTML = `<i class="md-icon button-icon button-icon-left custom-cover-inline-icon">${iconName}</i><span>${text}</span>`;
		return btn;
	}

	function createActionSheetButton(id, iconName, text) {
		const btn = document.createElement('button');
		btn.id = id;
		btn.className = 'listItem listItem-autoactive itemAction listItemCursor listItem-hoverable actionSheetMenuItem actionSheetMenuItem-iconright custom-cover-btn-injected';
		btn.type = 'button';
		btn.innerHTML = `
			<div class="listItem-content listItem-content-bg listItemContent-touchzoom listItem-border actionsheet-noborderconditional">
				<div class="actionSheetItemImageContainer actionSheetItemImageContainer-customsize actionSheetItemImageContainer-transparent listItemImageContainer listItemImageContainer-margin listItemImageContainer-square defaultCardBackground" style="aspect-ratio:1">
					<i class="actionsheetMenuItemIcon listItemIcon listItemIcon-transparent md-icon listItemIcon autortl">${iconName}</i>
				</div>
				<div class="actionsheetListItemBody actionsheetListItemBody-iconright listItemBody listItemBody-1-lines">
					<div class="listItemBodyText actionSheetItemText listItemBodyText-nowrap listItemBodyText-lf">${text}</div>
				</div>
			</div>`;
		return btn;
	}

	/********************** 注入逻辑：详情页 ************************/ 
	function injectDetailButtons() {
		if (! CONFIG.enableDetailButtons) return;
		const container = document.querySelector('.detailButtons.mainDetailButtons');
		if (!container) return; // 未到详情页
		// 避免重复
		if (container.dataset.coverHelperInjected === '1') return;

		const img = currentDetailImage();
		if (!img || !img.src) return;
		const highRes = extractHighRes(img.src);
		if (!highRes) return;

		const viewBtn = createDetailButton('cover-helper-view-btn', 'photo_library', I18N.view);
		viewBtn.addEventListener('click', () => {
			if (CONFIG.openInNewTab) window.open(highRes, '_blank');
			else window.location.href = highRes;
		});

		const downloadBtn = createDetailButton('cover-helper-download-btn', 'file_download', I18N.download);
		downloadBtn.addEventListener('click', () => downloadImage(highRes));

		container.appendChild(viewBtn);
		container.appendChild(downloadBtn);
		container.dataset.coverHelperInjected = '1';
		log('Detail buttons injected');
	}

	/********************** 注入逻辑：Action Sheet ************************/ 
	function injectActionSheetButtons() {
		if (! CONFIG.enableActionSheet) return;
		const sheet = document.querySelector('div.actionSheet.opened');
		if (!sheet) return;
		if (sheet.dataset.coverHelperInjected === '1') return;

		const list = sheet.querySelector('.actionsheetScrollSlider');
		const bgDiv = sheet.querySelector('.actionsheetItemPreviewImage-bg');
		if (!list || !bgDiv || !bgDiv.style.backgroundImage) return;
		const raw = bgDiv.style.backgroundImage;
		const url = extractHighRes(raw.slice(5, -2)); // strip url("...")
		if (!url) return;

		let titleHint = 'poster';
		const titleNode = sheet.querySelector('.actionsheetItemPreviewText-main .actionsheetPreviewTextItem');
		if (titleNode && titleNode.textContent) titleHint = titleNode.textContent.trim();

		const viewBtn = createActionSheetButton('cover-helper-actionsheet-view-btn', 'photo_library', I18N.view);
		viewBtn.addEventListener('click', (e) => { e.stopPropagation(); window.open(url, '_blank'); });

		const downloadBtn = createActionSheetButton('cover-helper-actionsheet-download-btn', 'file_download', I18N.download);
		downloadBtn.addEventListener('click', (e) => { e.stopPropagation(); downloadImage(url, titleHint); });

		list.prepend(downloadBtn);
		list.prepend(viewBtn);
		sheet.dataset.coverHelperInjected = '1';
		log('ActionSheet buttons injected');
	}

	/********************** MutationObserver + 去抖 ************************/ 
	let debounceTimer = null;
	const observer = new MutationObserver(() => {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			try {
				injectDetailButtons();
				injectActionSheetButtons();
			} catch (err) { console.error('[CoverHelper] inject error', err); }
		}, CONFIG.debounceMs);
	});
	observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

	// 初始尝试
	injectDetailButtons();
	injectActionSheetButtons();

	log('Emby Cover Art Helper loaded.');
})();

