/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               Kemono中文翻译按钮
// @namespace          Kemono-Translate
// @version            0.6.1
// @description        一键翻译Content内容到中文
// @author             PY-DNG
// @license            GPL-v3
// @match              https://kemono.party/fanbox/user/*/post/*
// @match              https://kemono.party/patreon/user/*/post/*
// @match              https://kemono.su/fanbox/user/*/post/*
// @match              https://kemono.su/patreon/user/*/post/*
// @require            https://greasyfork.org/scripts/456034-basic-functions-for-userscripts/code/script.js?version=1226884
// @require            https://greasyfork.org/scripts/452362-baidu-translate/code/Baidu%20Translate.js?version=1175971
// @connect            baidu.com
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAfCAYAAACGVs+MAAAAAXNSR0IArs4c6QAAB+BJREFUWEe1lntw1NUVxz+/376zyWY32TzIE0ICyMsQKYiF8ozIs6XgOFPsoECRtiCordTCWEQFBHzxaIsMAtNpkYplYCgIhfKQ8m6CBQtCCCQkIWE3m8fuZrOv369zfyQ0IJLYqeev/e2999zvPed8v+dIwCLgM+AooPLtmx6YAxQAP5GAn9tNuhdBXV0fVDYBjR3AIM7lADcBBUgFyjrwAEuiVf98mtWw8KI7sCyisEw46jI4I3bP0Oy4vO2X6nd/WRtYAhR/jTMrYANcwAZgRwvgmcAMwAwEgeb7PCIhNcaweHb/pOfcTZHw2rO3xgFHBACybIbV68ZkzzXIEr8vcpXvK21cGQgrWwBvW0cmE7nBIG8Dawyy/IxeVm2KKlVKktqrOaL+DPg18B5w+h4A2bl206p5A1N+OCrHJr+4/8b5vVcbRgG3NADA4y8/lrrjyYccMd6QwvFyX2jLeffuK57g68A5QOwT9aGTZd51mAwTDTIN3RJN3b0hJRxVVHelN1wdiKhSUzg6FvC0AZBfkGpdPX9g8pDseCO+kMLc/WWbSj0hETG1FYDje5mxe5aPzHj0aLmX7HgTsUYdG4pd1w9ca1zRFFb+APhanPYbnBm7Nz3OkFKQakUvwwVXgIgCO7+sW9wYUl5rc3nhyM5x780bkNKzpC5ID6eZEk9QfelA+YxwFFFv2ss0s5vlRWueyH49PyWGpcdu0sVuYlIPO3tLGoIbz7n3ljWE3gWiNpN+8uicuOkvDEyJT7DoMekl7VXHb/hYd/bWqZK64OamsLLfoOO7k7o7lj9XkJy263IdNpOOWf2S+M3RqlsfnnOL8J+/CwDwyMx+zk+XDE13VnrDLDpcgVGWefmxVD6+WMfq0zV1gOyM0ce/9GgqU3o4iDfriKq3masocNMX4tgNX/TgNW9lVrzR/lRPh219kUsDuHJUJs0RhVl/vX74ZKV/POC/F4C5b5Llz+vHZ0/IdZi5WhfkRztKMeokfjEolW3/9nDoupeIomr/DUqP5dl8J0Oz4ogxykQVFVkCSZLwh6LIksSKE9V8UORi3RNZTOnp4PB1L7P3lC1zNUVEsWrWmgIhDgkGmR+sHJX5u6f7JMqX3M1M3n6VQRlW3hqZoW3e8q9aNhS5cDVFtO8Yg8yIzjaefTiRAWlWjDr5TkQEmH/c8DF3Xznjc+0sG5HBmjM1zYuPVk0G9twLIE5QC9BPyLOPWTcmK+ELV4DfnnWxZFganWINtyVShZOVfladrOZEhQ+lRTftZh1jc+1M65tI72QLeknSgIQVla0XajlR4Wfaw07Wnqkp/ft170IgG1gnCltEwNSCZkSiRb85L8GU/ObwDO1SfzhKps145yKxTydJuJrCbDznZvPntdQ1346GsBSrgbG58Tgseiq9Iap9YWr8YSobwyioBMKKR1GpBz4AVrTSUPD2p2aDXGs1yN956iFHz+n5TjJsRu3VLTXWhlkiz2igBGVXHK+muLrprvUHfAiVPAWsB5zit4iAkNfvO8zyK8M623qP7GxjXG48JkHwdkwo5/EKH9N2XaO+OXrf3XkJZgpSY+hsN1HiaaYhGA0WV/sbawPRvcBbAsBwYJDTop/YPy1mwJz+ydIjnawdaovicCCiMGP3dY0h91qO3cT6cdn0TrJorDhV6RP1o56p8u8IRNSVwCXh43lgcKrV0LVPsqXv9Hynflh2XIcAaDUhS2wsdrPwUMVdZ0w6iaXDM3i6T6JWkOKi01V+tl+sU46WexvKGkKVwO5WGqYbZHnpkCzr1KHZcbpxuXbS4gxaru9XA21fKuhW4gnyzK5rlDWENJ0QtTOpu4O3CzOw6GXNT2MwypEyL+uLXKFzNU1rI4rWTV0CQCyw0qCTCmKNcnUvp6VwTG68RYQtx2HCadG3Gw1RkFc8zVR5w5pGeAIRHu9qI9dhQkLSGCHyv77IFb7VFKm5XNusBqPq+4L6AoAQoSzRwfQy8/MSzC94g1H3uDx7F3dTRFk6PF0ndLy9UUnkWESjRS5QWsIuqCjqY+sXnmajTpKO3fC90tIHxBDzlzvNCEgHPgQ+shrlbg6zfqrLH9n9xrC0GT/um2hsFZ32mNF2XZxZ8llV+J9Vfl1JXXBTUFFjgmElWYUpoOnBf7shYAE6AaXAshaBejM/Jeaj1aOzRnVLNN0lSO0BEYJ1stLHnE/Lt1Z4Qw5JolhRNL8Tgf0tU9VdANr67AM0AOVA4ayCpG2LBndy6Ftj3M7tIqzNUVUw4+afLnjE6BXf8rit9x5tm4Kvc6tPjTW8s2pUxtzCnHit67Vngpp/K21g/r4bK92ByII2+79yuCMAxPnc0V1tO98pzOwphpAHUVM49Iai/PJAxeWdl+tF37/yIMAdBYBZx8xFg9PXzShwGh8EQOT+k0sedcHBil95Q4poOA+0DgMA4nolWf74/ujMCb2TYjSafSWfErj8EebtKys6VOabAFT9PwEIX0Om9U385LWh6UlCau+FIGp00+fu8KtHKmeHoxql27VvEgHhTE6y6JcuH5mxYEI3uwagrYPSuqCYgA6eqfLf4Xl7CL4pAOEva1i2beerQzrl1wcjmvyKtpybYGZvSb1/1cmaqcDO9i5uXf9fAGA26qYmWXQbapsilkBY0ZqNwyx6hvSxJxCeJrr0twqgpYFtA8Q01WpiIHgS2NfRy8W+/wAVVh9v1Ldl+wAAAABJRU5ErkJggg==
// @grant              GM_xmlhttpRequest
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/459208/Kemono%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/459208/Kemono%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager */
/* global bdTransReady baidu_translate */

(function __MAIN__() {
    'use strict';

	// Constances
	const CONST = {
		TextAllLang: {
			DEFAULT: 'zh-CN',
			'zh-CN': {
				Initing: '初始化...',
				Translate: '翻译',
				Translating: '翻译中...',
				ShowOriginal: '显示原文',
				ShowTrans: '显示译文'
			}
		}
	};

	// Init language
	const i18n = !Object.keys(CONST.TextAllLang).includes(navigator.language) ? navigator.language : CONST.TextAllLang.DEFAULT;
	CONST.Text = CONST.TextAllLang[i18n];

	detectDom('.post__footer', content => detectDom('.post__actions>*:nth-child(2)', fav => main()));
	function main() {
		const content = $('.post__content');
		if (!content) {return false;}

		// Content
		const container = $('.post__actions');
		const button = container.children[1].cloneNode(true);
		button.children[0].remove();
		const button_text = button.children[0];
		button_text.innerText = CONST.Text.Initing;
		container.appendChild(button);
		transButton(button, button_text, content);

		// Comment
		const comments = $All('.comment');
		for (const comment of comments) {
			const header = $(comment, '.comment__header');
			const btn = $$CrE({
				tagName: 'span',
				styles: {
					float: 'right',
					cursor: 'pointer'
				},
				props: {
					innerText: CONST.Text.Initing
				}
			});
			const content = $(comment, '.comment__body');
			header.appendChild(btn);
			transButton(btn, btn, content);
		}

		function transButton(button, button_text, content) {
			let instantTrans = false;
			$AEL(button, 'click', function() {
				instantTrans = true;
			}, {once: true});

			bdTransReady(function() {
				button_text.innerText = CONST.Text.Translate;
				const Translator = new NodeTranslator();
				let tranlated = false;
				let hasTrans = false;
				$AEL(button, 'click', switchTrans);
				instantTrans && switchTrans();

				function switchTrans() {
					(tranlated ? Translator.recover : Translator.translate)(content, onTrans);

					function onTrans(status) {
						const node = this;
						if (node === content) {
							switch (status) {
								case -1: {
									button_text.innerText = hasTrans ? CONST.Text.ShowTrans : CONST.Text.Translate;
									tranlated = false;
									break;
								}
								case 0: {
									button_text.innerText = CONST.Text.Translating;
									break;
								}
								case 1: {
									button_text.innerText = CONST.Text.ShowOriginal;
									tranlated = true;
									hasTrans = true;
									break;
								}
							}
						}
					}
				}
			});
		}
	}

	function NodeTranslator() {
		const NT = this;
		NT.transMap = new Map();
		NT.translate = translate;
		NT.recover = recover;

		// Translate whole node tree
		// callback: [all nodes in tree].forEach(node => callback.call(node, status));
		// status = {-1: untranslated, 0: translating, 1: translated}
		// Returns a boolean repersents whether translate progress can start. (if already translated or during translating, retuns false)
		function translate(node, callback) {
			// Get node text obj
			const text = getTextObj(node);

			// Translate
			if (text.status !== 0) {
				if (node.childNodes.length) {
					const AM = new AsyncManager();
					for (const childNode of node.childNodes) {
						translate(childNode, function(status) {
							status === 1 && AM.finish();
							callback.apply(this, arguments);
							if (text.status === -1 && status === 0) {
								text.status = status;
								callback.call(node, text.status);
							}
						}) && AM.add();
					}
					AM.onfinish = function() {
						text.status = 1;
						callback.call(node, 1);
					}
					AM.finishEvent = true;
					return true;
				} else {
					return transTerminalNode(node, callback);
				}
			} else {
				return false;
			}
		}

		// Show original text for whole node tree
		// callback: [all nodes in tree].forEach(node => callback.call(node, status));
		// status = {-1: untranslated, 0: translating, 1: translated}
		// Returns a boolean repersents whether recover progress can start. (if not translated or during translating, retuns false)
		function recover(node, callback) {
			// Get node text obj
			const text = getTextObj(node);

			// Recover
			if (text.status !== 0) {
				if (node.childNodes.length) {
					const AM = new AsyncManager();
					for (const childNode of node.childNodes) {
						recover(childNode, function(status) {
							status === -1 && AM.finish();
							callback.apply(this, arguments);
						}) && AM.add();
					}
					AM.onfinish = function() {
						text.status = -1;
						callback.call(node, text.status);
					}
					AM.finishEvent = true;
					return true;
				} else {
					return recoverTerminalNode(node, callback);
				}
			} else {
				return false;
			}
		}

		// Translate single terminal node
		// callback: callback.call(node, status=1);
		// status = {-1: untranslated, 0: translating, 1: translated}
		// Returns a boolean repersents whether translate progress can start. (if already translated or during translating, retuns false)
		function transTerminalNode(node, callback) {
			// No need to translate if nothing more than whitespaces
			if (!node.nodeValue || !node.nodeValue.trim()) {return false;}
			// No translating for links
			if (node.nodeValue.trim().match(/^https?:\/\//)) {return false;}

			// Get node text obj
			const text = getTextObj(node);

			// Returns true only when untranslated
			if (text.status === -1) {
				if (text.hasTrans) {
					node.nodeValue = text.trans;
					text.status = 1;

					// translated, callback
					setTimeout(callback.bind(node, text.status), 0);
				} else {
					baidu_translate({
						text: text.ori,
						dst: 'zh',
						callback: function(result_text) {
							text.trans = node.nodeValue = result_text;
							text.status = 1;
							text.hasTrans = true;

							// translated, callback
							callback.call(node, text.status);
						},
						onerror: function(reason) {
							DoLog(LogLevel.Error, 'translate error');
						}
					});
					text.status = 0;

					// translating, callback
					callback.call(node, text.status);
				}
				return true;
			} else {
				return false;
			}
		}

		// Show original text of single terminal node
		// callback.call(node, status=-1);
		// status = {-1: untranslated, 0: translating, 1: translated}
		// Returns a boolean repersents whether recover progress can start. (if not translated or during translating, retuns false)
		function recoverTerminalNode(node, callback) {
			// Get node text obj
			const text = getTextObj(node);

			// Returns true only when translated
			if (text.status === 1) {
				node.nodeValue = text.ori;
				text.status = -1;

				// recovered, callback
				setTimeout(callback.bind(node, text.status), 0);
				return true;
			} else {
				return false;
			}
		}

		function getTextObj(node) {
			// Init node text obj
			!NT.transMap.has(node) && NT.transMap.set(node, {
				ori: node.nodeValue,
				trans: null,
				status: -1,
				hasTrans: false
			});

			// Get node text obj
			return NT.transMap.get(node);
		}
	}
})();