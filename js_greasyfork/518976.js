// ==UserScript==
// @name			Caveduck Modifier
// @namespace		https://labs.muyi.tw/caveduck_modifier/
// @version			0.32.0
// @description		修改Caveduck網站的樣式。
// @license			AGPL-3.0-or-later
// @author			慕儀
// @match			*://caveduck.io/*
// @grant			GM_addStyle
// @icon			data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDEyODAgMTI4MCI+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5jbHMtMSB7CiAgICAgICAgZmlsbDogI2ZmZjsKICAgICAgfQoKICAgICAgLmNscy0yIHsKICAgICAgICBmaWxsOiAjZjJiNDEyOwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjguNy4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogMS4yLjAgQnVpbGQgMTQyKSAgLS0+CiAgPGc+CiAgICA8ZyBpZD0iQ2F2ZWR1Y2siPgogICAgICA8ZyBpZD0iQ2F2ZWR1Y2stMiIgZGF0YS1uYW1lPSJDYXZlZHVjayI+CiAgICAgICAgPHBhdGggZD0iTTEwOTYuMSw0NTMuNWMzMDUuMiw0OTcuMywxNTIuNiw3NDYtNDU3LjgsNzQ2Uy0xMjQuNiw5NTAuOCwxODAuNiw0NTMuNWMzMDUuMi00OTcuMyw2MTAuMy00OTcuMyw5MTUuNSwwWiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTExNDcuNiw0NTMuNWMyMDguOCwzNjEuNywxMDQuNCw1NDIuNS0zMTMuMiw1NDIuNXMtNTIyLTE4MC44LTMxMy4yLTU0Mi41YzIwOC44LTM2MS43LDQxNy42LTM2MS43LDYyNi41LDBaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNjg0LDcyMS4yYzEwMC4yLDE3My42LDUwLjEsMjYwLjQtMTUwLjMsMjYwLjRzLTI1MC42LTg2LjgtMTUwLjMtMjYwLjRjMTAwLjItMTczLjYsMjAwLjUtMTczLjYsMzAwLjcsMFoiLz4KICAgICAgICA8cGF0aCBkPSJNODcxLjksNjEyLjdjMjUuMSw0My40LDEyLjUsNjUuMS0zNy42LDY1LjFzLTYyLjYtMjEuNy0zNy42LTY1LjFjMjUuMS00My40LDUwLjEtNDMuNCw3NS4yLDBaIi8+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/518976/Caveduck%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/518976/Caveduck%20Modifier.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let inLanguage;
	let debouncedAutoHeight;
	const $ = (selector) => document.querySelectorAll(selector);
	const $$ = (selector) => document.querySelector(selector);
	// const tarAutoHeight = `div[data-lexical-editor="true"]`;
	const tarAutoScrollHeight = `lorebook-data-input textarea, div[style*="display: inline-block"][style*="width: 100%"] textarea`;
	const textReplaceSelector = `#chatMessages b:not([data-text-replaced]), #chatMessages p:not([data-text-replaced])`;
	const cURL = window.location.href;
	const muyiStyles = 'https://labs.muyi.tw/caveduck_modifier/style2.css?v=11407161028';
	const fontStyles = `
		user-input-form div[ng-repeat] textarea,
		#chatMessages b,
		#chatMessages p,
		section > div > div > div > div > p,
		form[ng-if~="!!chat.editMode"] textarea,
		form textarea[name="userInput"] {
			font: normal clamp(16px, .95vw, 32px) / 1.75em var(--m_ff1);
		}
		#chatMessages b,
		section > div > div > div > div > p:not([class*="italic"]) {
			font-family: var(--m_ff2);
			font-weight: 400;
		}
		section > div > div > div > div > p {
			display: inline-block;
		}
		section > div > div > div > div > p > br {
			display: none;
		}
		form[ng-if~="!!chat.editMode"] textarea {
			font-size: var(--m_font-size);
		}
		user-input-form div[ng-repeat] textarea {
			font-size: var(--m_font-size);
		}
	`;
	const charMap = {
		'\\.{2,}': '⋯⋯',
		'⋯': '⋯⋯',
		'⋯{3,}': '⋯⋯',
		'!': '！',
		'\\?': '？',
		'~': '～',
		';': '；',
		':': '：',
		',': '，',
		'\\.': '。',
		'\\(': '（',
		'\\)': '）'
	};
	const locale = {
		'zh-hant': {
			cb_fontOverride: ['覆蓋字型', '作用頁：Talk<br>用慕儀喜歡的自訂字型取代預設字型。'],
			cb_shortButtons: ['快捷按鈕', '作用頁：Talk<br>將「我的資訊」與「使用者筆記」按鈕移到右側。'],
			cb_replaceText: ['取代符號', '作用頁：Talk<br>Claude 3 Haiku會使用錯誤的中文標點符號，這個功能可以修正它。'],
			cb_deskFix: ['桌面顯示修正', '作用頁：Talk<br>修正高解析度下的顯示體驗，讓對話畫面佔用全版，且圖片顯示區域更大。'],
			// cb_mdFix: ['行動顯示修正', '作用頁：Talk<br>修正行動裝置的顯示問題。'],
			cb_autoHeight: ['編輯框自動高度', '作用頁：Edit Character、Lorebook、Custom prompt<br>每個項目使用卷軸十分愚蠢，勾選此項可以將其設為自動高度。'],
			toggleButton: '慕儀\n神器',
			reloadButton: '套用並重載',
		},
		'en': {
			cb_fontOverride: ['Override Font', 'Active on: Talk<br>Replace default font with MuYi\'s preferred custom font.'],
			cb_shortButtons: ['Shortcut buttons', 'Active on: Talk<br>Move the "My Information" and "User Notes" buttons to the right side.'],
			cb_replaceText: ['Replace Symbols', 'Active on: Talk<br>Claude 3 Haiku uses incorrect Chinese punctuation. This feature fixes it.'],
			cb_deskFix: ['Desktop Display Fix', 'Active on: Talk<br>Fix display experience on high resolution, making the chat screen occupy the full screen and enlarging the image display area.'],
			// cb_mdFix: ['Mobile Display Fix', 'Active on: Talk<br>Fix the display issues of mobile devices.'],
			cb_autoHeight: ['Auto Height for Edit Box', 'Active on: Edit Character、Lorebook、Custom prompt<br>Using scrollbars for each item is stupid. Enable this to auto-height.'],
			toggleButton: 'MuYi\'s\nToolbox',
			reloadButton: 'Apply and reload',
		},
	};

	const settings = Object.keys(locale['en'])
		.filter(key => key.startsWith('cb_'))
		.map(localeName => ({
			localeName: localeName,
			key: `sw_${localeName.slice(3)}`
		}));

	const switches = {};
	settings.forEach(setting => {
		switches[setting.key] = JSON.parse(localStorage.getItem(`enable${setting.key.slice(3)}`) || 'false');
	});

	const domElements = {
		o_editMyInfoButton: 'div[role="dialog"] nav > div:nth-child(3) > div > button:nth-child(1)',
		o_editUserNoteButton: 'div[role="dialog"] nav > div:nth-child(3) > div > button:nth-child(2)',
		o_editBioButton: 'div[role="dialog"] nav > div:nth-child(3) > div > button:nth-child(3)',
		o_optionButton: 'main header>div>div>button',
		o_imgButton: '#chat-main>div>section.hidden'
	};


	function getAncestor(selector, level) {
		if (typeof selector !== 'string' || typeof level !== 'number' || level < 0) {
			throw new Error('Invalid parameters');
		}
		const element = document.querySelector(selector);
		if (!element) {
			return null;
		}
		if (level === 0) {
			return element;
		}
		let current = element;
		for (let i = 0; i < level; i++) {
			current = current.parentElement;
			if (!current) {
				return null;
			}
		}
		return current;
	}

	// 添加自訂樣式
	function addCustomStyles() {
		GM_addStyle(fontStyles);
		console.log("Custom styles added.");
	}

	// 自動調整高度的核心函式
	function autoHeight(el) {
		el.style.height = 'auto';
		el.style.maxHeight = 'none';
		el.style.overflow = 'auto';
	}

	function autoScrollHeight(el) {
		autoHeight(el);
		el.style.height = `${el.scrollHeight}px`;
	}

	// 初始化符合條件的元素
	function initializeAutoHeight() {
		if (!debouncedAutoHeight) {
			debouncedAutoHeight = debounce(() => {
				// $(tarAutoHeight).forEach(autoHeight);
				$(tarAutoScrollHeight).forEach(autoScrollHeight);
			}, 666, 2);
			debouncedAutoHeight();
			window.addEventListener('keydown', debouncedAutoHeight);
			window.addEventListener('click', debouncedAutoHeight);
		}
	}


	// 替換指定選擇符的內容
	function replaceTextContent() {
		const processedAttribute = "data-text-replaced"; // 標記屬性名稱
		const el = $(`${textReplaceSelector}:not([${processedAttribute}])`);
		el.forEach((el) => {
			let originalText = el.textContent;
			for (const [pattern, replacement] of Object.entries(charMap)) {
				originalText = originalText.replace(new RegExp(pattern, 'g'), replacement);
			}
			el.textContent = originalText;
			el.setAttribute(processedAttribute, ""); // 添加標記屬性
		});
	}

	// 延遲觸發的去抖函式
	function debounce(func, delay, repeat) {
		let timer = null;
		let count = 1;
		return () => {
			func();
			if (timer) clearInterval(timer);
			timer = setInterval(() => {
				func();
				count += 1;
				if (count >= repeat) {
					clearInterval(timer);
				}
			}, delay);
		};
	}

	// 啟動 MutationObserver
	function initializeObserver() {
		const observer = new MutationObserver(() => {
			mainAction();
		});
		observer.observe(document.body, { childList: true, subtree: true });
		console.log("MutationObserver initialized.");
	}

	// 檢查 inLanguage 並啟動必要功能
	function checkInLanguage() {
		let lang = '';
		const script = $$('script[type="application/ld+json"]');
		if (script) {
			try {
				const jsonData = JSON.parse(script.textContent);
				if (jsonData && jsonData[0] && jsonData[0].inLanguage)
					lang = jsonData[0].inLanguage;
			} catch (error) {}
		}
		if (!lang) {
			const pathLang = location.pathname.split('/')[1].toLowerCase();
			if (['zh-hant','zh-hans','ja','ko','en'].includes(pathLang))
				lang = pathLang;
		}
		if (!lang) lang = navigator.language;
		inLanguage = lang ? lang.toLowerCase() : '';
	}
	

	function createSettingsUI() {
		const lang = ['zh-hant', 'zh-hans'].includes(inLanguage) ? 'zh-hant' : 'en';
		const texts = locale[lang];

		// 創建核取方塊
		const createCheckbox = (setting) => {
			const container = document.createElement('div');
			const checkbox = document.createElement('input');
			const label = document.createElement('label');
			const desc = document.createElement('div');
			desc.className = 'desc';

			checkbox.type = 'checkbox';
			const storageKey = `enable${setting.key.slice(3)}`;
			checkbox.id = storageKey;

			const isChecked = JSON.parse(localStorage.getItem(storageKey) || 'false');
			checkbox.checked = isChecked;
			label.setAttribute('for', storageKey);
			label.textContent = texts[setting.localeName][0];
			desc.innerHTML = texts[setting.localeName][1];
			label.appendChild(desc);
			checkbox.addEventListener('change', () => {
				localStorage.setItem(storageKey, checkbox.checked);
			});
			container.appendChild(checkbox);
			container.appendChild(label);
			return container;
		};

		// 創建按鈕和設定視窗
		const mt = document.createElement('div');
		mt.id = 'mt';

		const toggleButton = document.createElement('button');
		toggleButton.className = 'button--red mt_toggleButton';
		toggleButton.textContent = texts.toggleButton;
		if (lang === 'zh-hant') toggleButton.style.fontSize = '.8rem';

		const settingsPanel = document.createElement('div');
		settingsPanel.className = 'mt_fixed mt_settingsPanel';
		settingsPanel.style.display = 'none';

		// 添加核取方塊
		settings.forEach((setting) => {
			settingsPanel.appendChild(createCheckbox(setting));
		});

		// 重整按鈕
		const reloadButton = document.createElement('button');
		reloadButton.textContent = texts.reloadButton;
		reloadButton.className = 'button--red';
		reloadButton.addEventListener('click', () => location.reload());
		settingsPanel.appendChild(reloadButton);

		// 切換視窗顯示
		toggleButton.addEventListener('click', (event) => {
			event.stopPropagation(); // 避免點擊 toggleButton 時也觸發關閉
			const isVisible = settingsPanel.style.display === 'block';

			if (!isVisible) {
				settingsPanel.style.display = 'block';

				// 加入全頁點擊監聽器，只會執行一次
				const outsideClickListener = (e) => {
					if (!settingsPanel.contains(e.target) && e.target !== toggleButton) {
						settingsPanel.style.display = 'none';
						document.removeEventListener('click', outsideClickListener);
					}
				};
				document.addEventListener('click', outsideClickListener);
			} else {
				settingsPanel.style.display = 'none';
			}
		});

		// 添加到頁面
		document.body.appendChild(mt);
		mt.appendChild(toggleButton);
		document.body.appendChild(settingsPanel);

		// 快捷按鈕
		if (switches.sw_shortButtons && mURL('*/talk/*')) {
			[
				{ text: '👤', selector: domElements.o_editMyInfoButton },
				{ text: '📝', selector: domElements.o_editUserNoteButton },
				{ text: '💾', selector: domElements.o_editBioButton } // 新增 Bio 按鈕，使用磁碟 emoji
			].forEach(({ text, selector }) => {
				const button = document.createElement('button');
				button.textContent = text;
				button.addEventListener('click', () => {
					const optionButton = $$(domElements.o_optionButton);
					if (!optionButton) return console.warn('找不到 option 按鈕');
					optionButton.click();

					setTimeout(() => {
						const targetButton = $$(selector);
						if (targetButton) {
							targetButton.click();
						} else {
							console.warn('找不到指定按鈕');
						}
					}, 100);
				});
				mt.appendChild(button);
			});
		}

	}

	function checkSettings() {
		checkInLanguage();
		settings.forEach(setting => {
			switches[setting.switchVar] = JSON.parse(localStorage.getItem(setting.storageKey) || 'false');
		});

		if (switches.sw_fontOverride) addCustomStyles();
		mainAction();
	}

	function mURL(pattern) {
		const patternParts = pattern.split('*');
		let lastIndex = 0;
		for (let part of patternParts) {
			if (part === "") continue;
			const index = cURL.indexOf(part, lastIndex);
			if (index === -1) return false;
			lastIndex = index + part.length;
		}
		return true;
	}

	function setStylesheet() {
		const link = document.createElement("link");
		link.rel = 'stylesheet';
		link.href = muyiStyles;
		document.head.appendChild(link);
	}

	function mainAction() {
		if (switches.sw_autoHeight && (mURL('*/characters/*') || mURL('*/prompt-build-script/*') || mURL('*/lorebook-editor/*'))) {
			console.log('AutoHeight enabled, initializing...');
			initializeAutoHeight();
		}
		if (['zh-hant', 'zh-hans', 'ja', 'ko'].includes(inLanguage) && (switches.sw_replaceText)) replaceTextContent();
		if (mURL('*/talk/*')) {
			if (switches.sw_deskFix) {
				$('.size-full').forEach(el => {
					el.style.maxWidth = '100%';
					el.style.width = '100%';
				});
				$('.p-4').forEach(el => {
					el.style.paddingRight = '1.25em';
					el.style.paddingLeft = '1.25em';
				});
			}
		}
	}

	window.addEventListener('load', () => {
		setStylesheet();
		checkSettings();
		createSettingsUI();
		setTimeout(initializeObserver, 100);
	});
})();