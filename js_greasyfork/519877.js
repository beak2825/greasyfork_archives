// ==UserScript==
// @name         UserScript Compatibility Library
// @name:en      UserScript Compatibility Library
// @name:zh-CN   UserScript 兼容库
// @name:ru      Библиотека совместимости для пользовательских скриптов
// @name:vi      Thư viện tương thích cho userscript
// @namespace    https://greasyfork.org/vi/users/1195312-renji-yuusei
// @version      2024.12.23.1
// @description  A library to ensure compatibility between different userscript managers
// @description:en A library to ensure compatibility between different userscript managers
// @description:zh-CN 确保不同用户脚本管理器之间兼容性的库
// @description:vi  Thư viện đảm bảo tương thích giữa các trình quản lý userscript khác nhau
// @description:ru  Библиотека для обеспечения совместимости между различными менеджерами пользовательских скриптов
// @author       Yuusei
// @license      GPL-3.0-only
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM.info
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @grant        GM_listValues
// @grant        GM.listValues
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_download
// @grant        GM.download
// @grant        GM_notification
// @grant        GM.notification
// @grant        GM_addStyle
// @grant        GM.addStyle
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM.unregisterMenuCommand
// @grant        GM_setClipboard
// @grant        GM.setClipboard
// @grant        GM_getResourceText
// @grant        GM.getResourceText
// @grant        GM_getResourceURL
// @grant        GM.getResourceURL
// @grant        GM_openInTab
// @grant        GM.openInTab
// @grant        GM_addElement
// @grant        GM.addElement
// @grant        GM_addValueChangeListener
// @grant        GM.addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM.removeValueChangeListener
// @grant        GM_log
// @grant        GM.log
// @grant        GM_getTab
// @grant        GM.getTab
// @grant        GM_saveTab
// @grant        GM.saveTab
// @grant        GM_getTabs
// @grant        GM.getTabs
// @grant        GM_cookie
// @grant        GM.cookie
// @grant        GM_webRequest
// @grant        GM.webRequest
// @grant        GM_fetch
// @grant        GM.fetch
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_getResourceURL
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_cookie.get
// @grant        GM_cookie.set
// @grant        GM_cookie.delete
// @grant        GM_webRequest.listen
// @grant        GM_webRequest.onBeforeRequest
// @grant        GM_addElement.byTag
// @grant        GM_addElement.byId
// @grant        GM_addElement.byClass
// @grant        GM_addElement.byXPath
// @grant        GM_addElement.bySelector
// @grant        GM_removeElement
// @grant        GM_removeElements
// @grant        GM_getElement
// @grant        GM_getElements
// @grant        GM_addScript
// @grant        GM_removeScript
// @grant        GM_addLink
// @grant        GM_removeLink
// @grant        GM_addMeta
// @grant        GM_removeMeta
// @grant        GM_addIframe
// @grant        GM_removeIframe
// @grant        GM_addImage
// @grant        GM_removeImage
// @grant        GM_addVideo
// @grant        GM_removeVideo
// @grant        GM_addAudio
// @grant        GM_removeAudio
// @grant        GM_addCanvas
// @grant        GM_removeCanvas
// @grant        GM_addSvg
// @grant        GM_removeSvg
// @grant        GM_addObject
// @grant        GM_removeObject
// @grant        GM_addEmbed
// @grant        GM_removeEmbed
// @grant        GM_addApplet
// @grant        GM_removeApplet
// @run-at       document-start
// @license      GPL-3.0-only
// @grant        GM_addValueChangeListener.remove
// @grant        GM_getResourceURL.blob
// @grant        GM_notification.close
// @grant        GM_openInTab.focus
// @grant        GM_setClipboard.format
// @grant        GM_xmlhttpRequest.abort
// @grant        GM_download.progress
// @grant        GM_cookie.list
// @grant        GM_cookie.deleteAll
// @grant        GM_webRequest.filter
// @grant        GM_addElement.create
// @grant        GM_removeElement.all
// @grant        GM_getElement.all
// @grant        GM_addScript.remote
// @grant        GM_addLink.stylesheet
// @grant        GM_addMeta.viewport
// @grant        GM_addIframe.sandbox
// @grant        GM_addImage.lazy
// @grant        GM_addVideo.controls
// @grant        GM_addAudio.autoplay
// @grant        GM_addCanvas.context
// @grant        GM_addSvg.namespace
// @grant        GM_addObject.data
// @grant        GM_addEmbed.type
// @grant        GM_addApplet.code
// ==/UserScript==
(function () {
	'use strict';
	const utils = {
		isFunction: function (fn) {
			return typeof fn === 'function';
		},
		isUndefined: function (value) {
			return typeof value === 'undefined';
		},
		isObject: function (value) {
			return value !== null && typeof value === 'object';
		},
		sleep: function (ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},
		retry: async function (fn, attempts = 3, delay = 1000) {
			let lastError;
			for (let i = 0; i < attempts; i++) {
				try {
					return await fn();
				} catch (error) {
					lastError = error;
					if (i === attempts - 1) break;
					await this.sleep(delay * Math.pow(2, i));
				}
			}
			throw lastError;
		},
		debounce: function (fn, wait) {
			let timeout;
			return function (...args) {
				clearTimeout(timeout);
				timeout = setTimeout(() => fn.apply(this, args), wait);
			};
		},
		throttle: function (fn, limit) {
			let timeout;
			let inThrottle;
			return function (...args) {
				if (!inThrottle) {
					fn.apply(this, args);
					inThrottle = true;
					clearTimeout(timeout);
					timeout = setTimeout(() => (inThrottle = false), limit);
				}
			};
		},
		// Thêm các tiện ích mới
		isArray: function (arr) {
			return Array.isArray(arr);
		},
		isString: function (str) {
			return typeof str === 'string';
		},
		isNumber: function (num) {
			return typeof num === 'number' && !isNaN(num);
		},
		isBoolean: function (bool) {
			return typeof bool === 'boolean';
		},
		isNull: function (value) {
			return value === null;
		},
		isEmpty: function (value) {
			if (this.isArray(value)) return value.length === 0;
			if (this.isObject(value)) return Object.keys(value).length === 0;
			if (this.isString(value)) return value.trim().length === 0;
			return false;
		},
	};
	const GMCompat = {
		info: (function () {
			if (!utils.isUndefined(GM_info)) return GM_info;
			if (!utils.isUndefined(GM) && GM.info) return GM.info;
			return {};
		})(),
		storageCache: new Map(),
		cacheTimestamps: new Map(),
		cacheExpiry: 3600000, // 1 hour
		getValue: async function (key, defaultValue) {
			try {
				if (this.storageCache.has(key)) {
					const timestamp = this.cacheTimestamps.get(key);
					if (Date.now() - timestamp < this.cacheExpiry) {
						return this.storageCache.get(key);
					}
				}
				let value;
				if (!utils.isUndefined(GM_getValue)) {
					value = GM_getValue(key, defaultValue);
				} else if (!utils.isUndefined(GM) && GM.getValue) {
					value = await GM.getValue(key, defaultValue);
				} else {
					value = defaultValue;
				}
				this.storageCache.set(key, value);
				this.cacheTimestamps.set(key, Date.now());
				return value;
			} catch (error) {
				console.error('getValue error:', error);
				return defaultValue;
			}
		},
		setValue: async function (key, value) {
			try {
				this.storageCache.set(key, value);
				this.cacheTimestamps.set(key, Date.now());
				if (!utils.isUndefined(GM_setValue)) {
					return GM_setValue(key, value);
				}
				if (!utils.isUndefined(GM) && GM.setValue) {
					return await GM.setValue(key, value);
				}
			} catch (error) {
				this.storageCache.delete(key);
				this.cacheTimestamps.delete(key);
				throw new Error('Failed to set value: ' + error.message);
			}
		},
		deleteValue: async function (key) {
			try {
				this.storageCache.delete(key);
				this.cacheTimestamps.delete(key);
				if (!utils.isUndefined(GM_deleteValue)) {
					return GM_deleteValue(key);
				}
				if (!utils.isUndefined(GM) && GM.deleteValue) {
					return await GM.deleteValue(key);
				}
			} catch (error) {
				throw new Error('Failed to delete value: ' + error.message);
			}
		},
		requestQueue: [],
		processingRequest: false,
		maxRetries: 3,
		retryDelay: 1000,
		xmlHttpRequest: async function (details) {
			const makeRequest = () => {
				return new Promise((resolve, reject) => {
					try {
						const callbacks = {
							onload: resolve,
							onerror: reject,
							ontimeout: reject,
							onprogress: details.onprogress,
							onreadystatechange: details.onreadystatechange,
						};
						const finalDetails = {
							timeout: 30000,
							...details,
							...callbacks,
						};
						if (!utils.isUndefined(GM_xmlhttpRequest)) {
							GM_xmlhttpRequest(finalDetails);
						} else if (!utils.isUndefined(GM) && GM.xmlHttpRequest) {
							GM.xmlHttpRequest(finalDetails);
						} else if (!utils.isUndefined(GM_fetch)) {
							GM_fetch(finalDetails.url, finalDetails);
						} else if (!utils.isUndefined(GM) && GM.fetch) {
							GM.fetch(finalDetails.url, finalDetails);
						} else {
							reject(new Error('XMLHttpRequest API not available'));
						}
					} catch (error) {
						reject(error);
					}
				});
			};
			return utils.retry(makeRequest, this.maxRetries, this.retryDelay);
		},
		download: async function (details) {
			try {
				const downloadWithProgress = {
					...details,
					onprogress: details.onprogress,
					onerror: details.onerror,
					onload: details.onload,
				};
				if (!utils.isUndefined(GM_download)) {
					return new Promise((resolve, reject) => {
						GM_download({
							...downloadWithProgress,
							onload: resolve,
							onerror: reject,
						});
					});
				}
				if (!utils.isUndefined(GM) && GM.download) {
					return await GM.download(downloadWithProgress);
				}
				throw new Error('Download API not available');
			} catch (error) {
				throw new Error('Download failed: ' + error.message);
			}
		},
		notification: function (details) {
			return new Promise((resolve, reject) => {
				try {
					const defaultOptions = {
						timeout: 5000,
						highlight: false,
						silent: false,
						requireInteraction: false,
						priority: 0,
					};
					const callbacks = {
						onclick: utils.debounce((...args) => {
							if (details.onclick) details.onclick(...args);
							resolve('clicked');
						}, 300),
						ondone: (...args) => {
							if (details.ondone) details.ondone(...args);
							resolve('closed');
						},
						onerror: (...args) => {
							if (details.onerror) details.onerror(...args);
							reject('error');
						},
					};
					const finalDetails = { ...defaultOptions, ...details, ...callbacks };
					if (!utils.isUndefined(GM_notification)) {
						GM_notification(finalDetails);
					} else if (!utils.isUndefined(GM) && GM.notification) {
						GM.notification(finalDetails);
					} else {
						if ('Notification' in window) {
							Notification.requestPermission().then(permission => {
								if (permission === 'granted') {
									const notification = new Notification(finalDetails.title, {
										body: finalDetails.text,
										silent: finalDetails.silent,
										icon: finalDetails.image,
										tag: finalDetails.tag,
										requireInteraction: finalDetails.requireInteraction,
										badge: finalDetails.badge,
										vibrate: finalDetails.vibrate,
									});
									notification.onclick = callbacks.onclick;
									notification.onerror = callbacks.onerror;
									if (finalDetails.timeout > 0) {
										setTimeout(() => {
											notification.close();
											callbacks.ondone();
										}, finalDetails.timeout);
									}
								} else {
									reject(new Error('Notification permission denied'));
								}
							});
						} else {
							reject(new Error('Notification API not available'));
						}
					}
				} catch (error) {
					reject(error);
				}
			});
		},
		addStyle: function (css) {
			try {
				const testStyle = document.createElement('style');
				testStyle.textContent = css;
				if (testStyle.sheet === null) {
					throw new Error('Invalid CSS');
				}
				if (!utils.isUndefined(GM_addStyle)) {
					return GM_addStyle(css);
				}
				if (!utils.isUndefined(GM) && GM.addStyle) {
					return GM.addStyle(css);
				}
				const style = document.createElement('style');
				style.textContent = css;
				style.type = 'text/css';
				document.head.appendChild(style);
				return style;
			} catch (error) {
				throw new Error('Failed to add style: ' + error.message);
			}
		},
		registerMenuCommand: function (name, fn, accessKey) {
			try {
				if (!utils.isFunction(fn)) {
					throw new Error('Command callback must be a function');
				}
				if (!utils.isUndefined(GM_registerMenuCommand)) {
					return GM_registerMenuCommand(name, fn, accessKey);
				}
				if (!utils.isUndefined(GM) && GM.registerMenuCommand) {
					return GM.registerMenuCommand(name, fn, accessKey);
				}
			} catch (error) {
				throw new Error('Failed to register menu command: ' + error.message);
			}
		},
		setClipboard: function (text, info) {
			try {
				if (!utils.isUndefined(GM_setClipboard)) {
					return GM_setClipboard(text, info);
				}
				if (!utils.isUndefined(GM) && GM.setClipboard) {
					return GM.setClipboard(text, info);
				}
				return navigator.clipboard.writeText(text);
			} catch (error) {
				throw new Error('Failed to set clipboard: ' + error.message);
			}
		},
		getResourceText: async function (name) {
			try {
				if (!utils.isUndefined(GM_getResourceText)) {
					return GM_getResourceText(name);
				}
				if (!utils.isUndefined(GM) && GM.getResourceText) {
					return await GM.getResourceText(name);
				}
				throw new Error('Resource API not available');
			} catch (error) {
				throw new Error('Failed to get resource text: ' + error.message);
			}
		},
		getResourceURL: async function (name) {
			try {
				if (!utils.isUndefined(GM_getResourceURL)) {
					return GM_getResourceURL(name);
				}
				if (!utils.isUndefined(GM) && GM.getResourceURL) {
					return await GM.getResourceURL(name);
				}
				throw new Error('Resource URL API not available');
			} catch (error) {
				throw new Error('Failed to get resource URL: ' + error.message);
			}
		},
		openInTab: function (url, options = {}) {
			try {
				const defaultOptions = {
					active: true,
					insert: true,
					setParent: true,
				};
				const finalOptions = { ...defaultOptions, ...options };
				if (!utils.isUndefined(GM_openInTab)) {
					return GM_openInTab(url, finalOptions);
				}
				if (!utils.isUndefined(GM) && GM.openInTab) {
					return GM.openInTab(url, finalOptions);
				}
				return window.open(url, '_blank');
			} catch (error) {
				throw new Error('Failed to open tab: ' + error.message);
			}
		},
		cookie: {
			get: async function (details) {
				try {
					if (!utils.isUndefined(GM_cookie) && GM_cookie.get) {
						return await GM_cookie.get(details);
					}
					if (!utils.isUndefined(GM) && GM.cookie && GM.cookie.get) {
						return await GM.cookie.get(details);
					}
					return document.cookie;
				} catch (error) {
					throw new Error('Failed to get cookie: ' + error.message);
				}
			},
			set: async function (details) {
				try {
					if (!utils.isUndefined(GM_cookie) && GM_cookie.set) {
						return await GM_cookie.set(details);
					}
					if (!utils.isUndefined(GM) && GM.cookie && GM.cookie.set) {
						return await GM.cookie.set(details);
					}
					document.cookie = details;
				} catch (error) {
					throw new Error('Failed to set cookie: ' + error.message);
				}
			},
			delete: async function (details) {
				try {
					if (!utils.isUndefined(GM_cookie) && GM_cookie.delete) {
						return await GM_cookie.delete(details);
					}
					if (!utils.isUndefined(GM) && GM.cookie && GM.cookie.delete) {
						return await GM.cookie.delete(details);
					}
				} catch (error) {
					throw new Error('Failed to delete cookie: ' + error.message);
				}
			},
		},
		webRequest: {
			listen: function (filter, callback) {
				try {
					if (!utils.isUndefined(GM_webRequest) && GM_webRequest.listen) {
						return GM_webRequest.listen(filter, callback);
					}
					if (!utils.isUndefined(GM) && GM.webRequest && GM.webRequest.listen) {
						return GM.webRequest.listen(filter, callback);
					}
				} catch (error) {
					throw new Error('Failed to listen to web request: ' + error.message);
				}
			},
			onBeforeRequest: function (filter, callback) {
				try {
					if (!utils.isUndefined(GM_webRequest) && GM_webRequest.onBeforeRequest) {
						return GM_webRequest.onBeforeRequest(filter, callback);
					}
					if (!utils.isUndefined(GM) && GM.webRequest && GM.webRequest.onBeforeRequest) {
						return GM.webRequest.onBeforeRequest(filter, callback);
					}
				} catch (error) {
					throw new Error('Failed to handle onBeforeRequest: ' + error.message);
				}
			},
		},
		dom: {
			addElement: function (tag, attributes = {}, parent = document.body) {
				try {
					const element = document.createElement(tag);
					Object.entries(attributes).forEach(([key, value]) => {
						element.setAttribute(key, value);
					});
					parent.appendChild(element);
					return element;
				} catch (error) {
					throw new Error('Failed to add element: ' + error.message);
				}
			},
			removeElement: function (element) {
				try {
					if (element && element.parentNode) {
						element.parentNode.removeChild(element);
					}
				} catch (error) {
					throw new Error('Failed to remove element: ' + error.message);
				}
			},
			getElement: function (selector) {
				try {
					return document.querySelector(selector);
				} catch (error) {
					throw new Error('Failed to get element: ' + error.message);
				}
			},
			getElements: function (selector) {
				try {
					return Array.from(document.querySelectorAll(selector));
				} catch (error) {
					throw new Error('Failed to get elements: ' + error.message);
				}
			},
		},
		storage: {
			setObject: async function (key, obj) {
				try {
					const jsonStr = JSON.stringify(obj);
					return await GMCompat.setValue(key, jsonStr);
				} catch (error) {
					utils.logger.error('setObject failed:', error);
					throw error;
				}
			},
			getObject: async function (key, defaultValue = null) {
				try {
					const jsonStr = await GMCompat.getValue(key, null);
					return jsonStr ? JSON.parse(jsonStr) : defaultValue;
				} catch (error) {
					utils.logger.error('getObject failed:', error);
					return defaultValue;
				}
			},
			appendToArray: async function (key, value) {
				try {
					const arr = await this.getObject(key, []);
					arr.push(value);
					await this.setObject(key, arr);
					return arr;
				} catch (error) {
					utils.logger.error('appendToArray failed:', error);
					throw error;
				}
			},
			removeFromArray: async function (key, predicate) {
				try {
					const arr = await this.getObject(key, []);
					const filtered = arr.filter(item => !predicate(item));
					await this.setObject(key, filtered);
					return filtered;
				} catch (error) {
					utils.logger.error('removeFromArray failed:', error);
					throw error;
				}
			},
		},
		request: {
			downloadWithProgress: async function (url, filename, onProgress) {
				try {
					return await GMCompat.download({
						url: url,
						name: filename,
						onprogress: onProgress,
						saveAs: true,
					});
				} catch (error) {
					utils.logger.error('downloadWithProgress failed:', error);
					throw error;
				}
			},
			fetchWithRetry: async function (url, options = {}) {
				const finalOptions = {
					method: 'GET',
					timeout: 10000,
					retry: 3,
					retryDelay: 1000,
					...options,
				};

				return await utils.retry(
					async () => {
						return await GMCompat.xmlHttpRequest({
							url: url,
							...finalOptions,
						});
					},
					finalOptions.retry,
					finalOptions.retryDelay
				);
			},
		},
		ui: {
			createMenuCommand: function (name, callback, options = {}) {
				const defaultOptions = {
					accessKey: null,
					autoClose: true,
				};
				const finalOptions = { ...defaultOptions, ...options };

				return GMCompat.registerMenuCommand(
					name,
					async (...args) => {
						try {
							await callback(...args);
							if (finalOptions.autoClose) {
								window.close();
							}
						} catch (error) {
							utils.logger.error('Menu command failed:', error);
							GMCompat.notification({
								title: 'Lỗi',
								text: `Lỗi thực thi lệnh: ${error.message}`,
								type: 'error',
							});
						}
					},
					finalOptions.accessKey
				);
			},
			toast: function (message, type = 'info', duration = 3000) {
				return GMCompat.notification({
					title: type.charAt(0).toUpperCase() + type.slice(1),
					text: message,
					timeout: duration,
					onclick: () => {},
					silent: true,
					highlight: false,
				});
			},
		},
		clipboard: {
			copyFormatted: async function (text, format = 'text/plain') {
				try {
					await GMCompat.setClipboard(text, format);
					return true;
				} catch (error) {
					utils.logger.error('copyFormatted failed:', error);
					return false;
				}
			},
			copyHTML: async function (html) {
				return await this.copyFormatted(html, 'text/html');
			},
		},
		cookies: {
			getAll: async function (domain) {
				try {
					return await GMCompat.cookie.get({ domain: domain });
				} catch (error) {
					utils.logger.error('getAll cookies failed:', error);
					return [];
				}
			},
			setCookie: async function (name, value, options = {}) {
				try {
					const defaultOptions = {
						path: '/',
						secure: true,
						sameSite: 'Lax',
						expirationDate: Math.floor(Date.now() / 1000) + 86400, // 1 day
					};

					await GMCompat.cookie.set({
						name: name,
						value: value,
						...defaultOptions,
						...options,
					});
				} catch (error) {
					utils.logger.error('setCookie failed:', error);
					throw error;
				}
			},
		},
		valueChangeListener: {
			listeners: new Map(),

			add: function (name, callback) {
				try {
					if (typeof GM_addValueChangeListener !== 'undefined') {
						const listenerId = GM_addValueChangeListener(name, callback);
						this.listeners.set(name, listenerId);
						return listenerId;
					}
					return null;
				} catch (error) {
					utils.logger.error('Failed to add value change listener:', error);
					return null;
				}
			},

			remove: function (name) {
				try {
					const listenerId = this.listeners.get(name);
					if (listenerId && typeof GM_removeValueChangeListener !== 'undefined') {
						GM_removeValueChangeListener(listenerId);
						this.listeners.delete(name);
						return true;
					}
					return false;
				} catch (error) {
					utils.logger.error('Failed to remove value change listener:', error);
					return false;
				}
			},
		},
		resource: {
			getBlob: async function (name) {
				try {
					const url = await GMCompat.getResourceURL(name);
					const response = await fetch(url);
					return await response.blob();
				} catch (error) {
					utils.logger.error('Failed to get resource blob:', error);
					throw error;
				}
			},

			getText: async function (name, defaultValue = '') {
				try {
					return (await GMCompat.getResourceText(name)) || defaultValue;
				} catch (error) {
					utils.logger.error('Failed to get resource text:', error);
					return defaultValue;
				}
			},
		},
		tab: {
			open: function (url, options = {}) {
				const defaultOptions = {
					active: true,
					insert: true,
					setParent: true,
					incognito: false,
				};

				try {
					return GMCompat.openInTab(url, { ...defaultOptions, ...options });
				} catch (error) {
					utils.logger.error('Failed to open tab:', error);
					return null;
				}
			},

			focus: function (tab) {
				try {
					if (tab && tab.focus) {
						tab.focus();
						return true;
					}
					return false;
				} catch (error) {
					utils.logger.error('Failed to focus tab:', error);
					return false;
				}
			},
		},
		notification: {
			create: function (details) {
				const defaultDetails = {
					title: '',
					text: '',
					image: '',
					timeout: 5000,
					onclick: null,
					ondone: null,
					silent: false,
				};

				try {
					return GMCompat.notification({ ...defaultDetails, ...details });
				} catch (error) {
					utils.logger.error('Failed to create notification:', error);
					return null;
				}
			},

			close: function (id) {
				try {
					if (typeof GM_notification !== 'undefined' && GM_notification.close) {
						GM_notification.close(id);
						return true;
					}
					return false;
				} catch (error) {
					utils.logger.error('Failed to close notification:', error);
					return false;
				}
			},
		},
		request: {
			abort: function (requestId) {
				try {
					if (typeof GM_xmlhttpRequest !== 'undefined' && GM_xmlhttpRequest.abort) {
						GM_xmlhttpRequest.abort(requestId);
						return true;
					}
					return false;
				} catch (error) {
					utils.logger.error('Failed to abort request:', error);
					return false;
				}
			},
		},
		cookie: {
			list: async function (details = {}) {
				try {
					if (typeof GM_cookie !== 'undefined' && GM_cookie.list) {
						return await GM_cookie.list(details);
					}
					return [];
				} catch (error) {
					utils.logger.error('Failed to list cookies:', error);
					return [];
				}
			},

			deleteAll: async function (details = {}) {
				try {
					if (typeof GM_cookie !== 'undefined' && GM_cookie.deleteAll) {
						return await GM_cookie.deleteAll(details);
					}
					return false;
				} catch (error) {
					utils.logger.error('Failed to delete all cookies:', error);
					return false;
				}
			},
		},
	};
	const exportGMCompat = function () {
		try {
			const target = !utils.isUndefined(unsafeWindow) ? unsafeWindow : window;
			Object.defineProperty(target, 'GMCompat', {
				value: GMCompat,
				writable: false,
				configurable: false,
				enumerable: true,
			});
			if (window.onurlchange !== undefined) {
				window.addEventListener('urlchange', () => {});
			}
		} catch (error) {
			console.error('Failed to export GMCompat:', error);
		}
	};
	exportGMCompat();
})();
