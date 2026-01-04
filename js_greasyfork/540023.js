// ==UserScript==
// @name         Torn Chat Translator
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Add a translate icon to the chat in Torn
// @author       JESUUS [2353554]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/540023/Torn%20Chat%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/540023/Torn%20Chat%20Translator.meta.js
// ==/UserScript==

(function() {
	'use strict';
	
	function getStoredConfig() {
		return {
			translateIconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-translate" viewBox="0 0 16 16"><path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/><path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/></svg>',
			targetLanguage: 'en', // Always translate to English
			sourceLanguage: 'auto' // Auto-detect source language
		};
	}
	
	let CONFIG = getStoredConfig();
	
	function insertTextNaturally(textarea, text) {
			try {
					if (document.execCommand && document.queryCommandSupported('insertText')) {
							const success = document.execCommand('insertText', false, text);
							if (success) {
									return;
							}
					}
			} catch (e) {
					console.log('execCommand failed, using fallback');
			}
			
			const originalValue = textarea.value;
			textarea.value = text;
			textarea.selectionStart = textarea.selectionEnd = text.length;
			
			textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
			textarea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
			textarea.dispatchEvent(new Event('keyup', { bubbles: true, cancelable: true }));
			textarea.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
			textarea.dispatchEvent(new Event('focus', { bubbles: true, cancelable: true }));
	}
	
	async function translateText(text, sourceLang = 'auto', targetLang = 'en') {
			try {
					const textToTranslate = text.replace(/\n/g, ' ').trim();
					const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;
					
					return new Promise((resolve, reject) => {
							GM_xmlhttpRequest({
									method: 'GET',
									url: url,
									onload: function(response) {
											try {
													const data = JSON.parse(response.responseText);
													let translatedText = '';
													
													if (data[0] && Array.isArray(data[0])) {
														translatedText = data[0].map(item => item[0]).join('');
													} else {
														translatedText = data[0][0][0];
													}
													
													resolve(translatedText);
											} catch (error) {
													reject(new Error('Translation error: ' + error.message));
											}
									},
									onerror: function(error) {
											reject(new Error('Connection error: ' + error));
									}
							});
					});
			} catch (error) {
					throw new Error('Translation error: ' + error.message);
			}
	}
	
	function setupAutoClear(textarea) {
			const parent = textarea.closest('.chat-box-footer, .tt-chat-autocomp, .chat-input-container') || textarea.parentElement;
			
			const sendButtons = parent.querySelectorAll('button, input[type="submit"], .send-button, [class*="send"]');
			
			sendButtons.forEach(button => {
					button.addEventListener('click', () => {
							setTimeout(() => {
									if (textarea.value.trim() === '') {
											textarea.blur();
											textarea.focus();
									}
							}, 200);
					});
			});
			
			textarea.addEventListener('keydown', (e) => {
					if (e.key === 'Enter' && !e.shiftKey) {
							setTimeout(() => {
									if (textarea.value.trim() === '') {
											textarea.blur();
											textarea.focus();
									}
							}, 200);
					}
			});
	}
	
	function createLanguageDropdown(parent) {
		const dropdown = document.createElement('div');
		dropdown.className = 'language-dropdown';
		dropdown.style.cssText = `
				position: absolute;
				right: 40px;
				top: 100%;
				background: rgba(0, 0, 0, 0.9);
				border: 1px solid rgba(255, 255, 255, 0.3);
				border-radius: 5px;
				padding: 5px;
				z-index: 10000;
				display: none;
				min-width: 150px;
		`;
		
		const languages = [
			{ code: 'en', flag: '🇺🇸', name: 'English' },
			{ code: 'fr', flag: '🇫🇷', name: 'Français' },
			{ code: 'es', flag: '🇪🇸', name: 'Español' },
			{ code: 'de', flag: '🇩🇪', name: 'Deutsch' },
			{ code: 'it', flag: '🇮🇹', name: 'Italiano' },
			{ code: 'pt', flag: '🇵🇹', name: 'Português' },
			{ code: 'ru', flag: '🇷🇺', name: 'Русский' },
			{ code: 'zh', flag: '🇨🇳', name: '中文' },
			{ code: 'ja', flag: '🇯🇵', name: '日本語' },
			{ code: 'ko', flag: '🇰🇷', name: '한국어' }
		];
		
		languages.forEach(lang => {
			const option = document.createElement('div');
			option.style.cssText = `
					padding: 8px 12px;
					cursor: pointer;
					display: flex;
					align-items: center;
					gap: 8px;
					color: white;
					border-radius: 3px;
					transition: background-color 0.2s;
					${lang.code === CONFIG.targetLanguage ? 'background-color: rgba(255, 255, 255, 0.2);' : ''}
			`;
			
			option.innerHTML = `<span style="font-size: 18px;">${lang.flag}</span><span style="font-size: 12px;">${lang.name}</span>`;
			
			option.addEventListener('mouseenter', () => {
				if (lang.code !== CONFIG.targetLanguage) {
					option.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
				}
			});
			
			option.addEventListener('mouseleave', () => {
				if (lang.code !== CONFIG.targetLanguage) {
					option.style.backgroundColor = 'transparent';
				}
			});
			
			option.addEventListener('click', () => {
				CONFIG.targetLanguage = lang.code;
				showNotification(`Language changed to ${lang.name}`, 'success');
				dropdown.style.display = 'none';
				
				// Update selection styling
				dropdown.querySelectorAll('div').forEach(opt => {
					opt.style.backgroundColor = 'transparent';
				});
				option.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
			});
			
			dropdown.appendChild(option);
		});
		
		return dropdown;
	}

	function createTranslateIcon() {
			const icon = document.createElement('button');
			icon.className = 'translate-icon';
			icon.title = `Translate to ${CONFIG.targetLanguage.toUpperCase()}`;
			icon.style.cssText = `
					position: absolute;
					right: 30px;
					top: 50%;
					transform: translateY(-50%);
					background: none;
					border: none;
					cursor: pointer;
					padding: 5px;
					border-radius: 3px;
					transition: background-color 0.2s;
					z-index: 1000;
			`;
			
			icon.innerHTML = CONFIG.translateIconSvg;
			icon.style.cssText += `
					color: rgba(255, 255, 255, 0.7);
			`;
			
			icon.addEventListener('mouseenter', () => {
					icon.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
					icon.style.color = 'rgba(255, 255, 255, 1)';
			});
			
			icon.addEventListener('mouseleave', () => {
					icon.style.backgroundColor = 'transparent';
					icon.style.color = 'rgba(255, 255, 255, 0.7)';
			});
			
			return icon;
	}
	
	function addTranslateIconToChat() {
			const chatSelectors = [
					'textarea[placeholder*="message"]',
					'textarea[placeholder*="Type your message"]',
					'.chat-box-footer textarea',
					'.tt-chat-autocomp',
					'textarea.chat-input'
			];
			
			chatSelectors.forEach(selector => {
					const textareas = document.querySelectorAll(selector);
					
					textareas.forEach(textarea => {
							if (textarea.parentElement.querySelector('.translate-icon')) {
									return;
							}
							
							const parent = textarea.parentElement;
							if (getComputedStyle(parent).position === 'static') {
									parent.style.position = 'relative';
							}
							
							const translateIcon = createTranslateIcon();
							const languageDropdown = createLanguageDropdown(parent);
							
							// Add padding to textarea to prevent text from going under the icon
							textarea.style.paddingRight = '60px';
							
							setupAutoClear(textarea);
							
							let clickCount = 0;
							let clickTimer;
							
							translateIcon.addEventListener('click', (e) => {
								console.log('Click event triggered, clickCount:', clickCount);
								clickCount++;
								
								if (clickCount === 1) {
									// Start timer for single click
									clickTimer = setTimeout(() => {
										console.log('Single click - translating');
										clickCount = 0;
										
										const textToTranslate = textarea.value.trim();
										
										if (!textToTranslate) {
											showNotification('Nothing to translate!', 'warning');
											return;
										}
										
										translateIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2"><animate attributeName="stroke-dasharray" values="0 38;19 19;0 38;0 38" dur="2s" repeatCount="indefinite"/><animate attributeName="stroke-dashoffset" values="0;0;-19;-38" dur="2s" repeatCount="indefinite"/></circle></svg>';
										translateIcon.disabled = true;
										
										translateText(textToTranslate, CONFIG.sourceLanguage, CONFIG.targetLanguage)
											.then(translatedText => {
												setTimeout(() => {
													textarea.focus();
													textarea.select();
													insertTextNaturally(textarea, translatedText);
													textarea.focus();
													
													const protectTranslation = () => {
														if (textarea.value !== translatedText && textarea.value.trim() === '') {
															textarea.value = translatedText;
														}
													};
													
													const protectionInterval = setInterval(protectTranslation, 100);
													setTimeout(() => clearInterval(protectionInterval), 2000);
													
													showNotification('Text translated successfully!', 'success');
												}, 100);
											})
											.catch(error => {
												console.error('Translation error:', error);
												showNotification('Translation error: ' + error, 'error');
											})
											.finally(() => {
												translateIcon.innerHTML = CONFIG.translateIconSvg;
												translateIcon.disabled = false;
											});
									}, 300); // Wait 300ms to see if there's a second click
								} else if (clickCount === 2) {
									// Double click - show dropdown
									console.log('Double click - showing dropdown');
									clearTimeout(clickTimer);
									clickCount = 0;
									languageDropdown.style.display = 'block';
									
									// Hide dropdown when clicking elsewhere
									const hideDropdown = (event) => {
										if (!languageDropdown.contains(event.target) && !translateIcon.contains(event.target)) {
											languageDropdown.style.display = 'none';
											document.removeEventListener('click', hideDropdown);
										}
									};
									setTimeout(() => document.addEventListener('click', hideDropdown), 100);
								}
							});
							
							parent.appendChild(translateIcon);
							parent.appendChild(languageDropdown);
					});
			});
	}
	
	function showNotification(message, type = 'info') {
			const notification = document.createElement('div');
			notification.textContent = message;
			notification.style.cssText = `
					position: fixed;
					top: 20px;
					right: 20px;
					padding: 10px 15px;
					border-radius: 5px;
					color: white;
					font-weight: bold;
					z-index: 10000;
					animation: slideIn 0.3s ease-out;
			`;
			
			const colors = {
					success: '#4CAF50',
					error: '#f44336',
					warning: '#ff9800',
					info: '#2196F3'
			};
			
			notification.style.backgroundColor = colors[type] || colors.info;
			
			const style = document.createElement('style');
			style.textContent = `
					@keyframes slideIn {
							from { transform: translateX(100%); opacity: 0; }
							to { transform: translateX(0); opacity: 1; }
					}
			`;
			document.head.appendChild(style);
			
			document.body.appendChild(notification);
			
			setTimeout(() => {
					notification.remove();
					style.remove();
			}, 3000);
	}
	
	function observeDOM() {
			const observer = new MutationObserver((mutations) => {
					mutations.forEach((mutation) => {
							if (mutation.type === 'childList') {
									mutation.addedNodes.forEach((node) => {
											if (node.nodeType === Node.ELEMENT_NODE) {
													setTimeout(addTranslateIconToChat, 100);
											}
									});
							}
					});
			});
			
			observer.observe(document.body, {
					childList: true,
					subtree: true
			});
	}
	
	function initialize() {
			if (document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', () => {
							setTimeout(addTranslateIconToChat, 1000);
							observeDOM();
					});
			} else {
					setTimeout(addTranslateIconToChat, 1000);
					observeDOM();
			}
			
			setInterval(addTranslateIconToChat, 5000);
	}
	
	initialize();
	})();
