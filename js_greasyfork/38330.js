// ==UserScript==
// @name         Telegram Web Emojione
// @namespace    https://greasyfork.org/users/649
// @version      1.1.10
// @description  Replaces old iOS emojis with Emojione on Telegram Web
// @author       Adrien Pyke
// @match        *://web.telegram.org/*
// @grant        GM_addStyle
// @require      https://gitcdn.link/repo/fuzetsu/userscripts/b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @require      https://cdn.rawgit.com/emojione/emojione/9a81e8462ea5c1efc8e4f2947944d0a248b8ec73/lib/js/emojione.min.js
// @downloadURL https://update.greasyfork.org/scripts/38330/Telegram%20Web%20Emojione.user.js
// @updateURL https://update.greasyfork.org/scripts/38330/Telegram%20Web%20Emojione.meta.js
// ==/UserScript==
/* global emojione */

(() => {
	'use strict';

	const SCRIPT_NAME = 'Telegram Web Emojione';

	const Util = {
		log(...args) {
			args.unshift(`%c${SCRIPT_NAME}:`, 'font-weight: bold;color: #233c7b;');
			console.log(...args);
		},
		q(query, context = document) {
			return context.querySelector(query);
		},
		qq(query, context = document) {
			return Array.from(context.querySelectorAll(query));
		},
		regexEscape(str) {
			return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
		}
	};

	const EmojiHelper = {
		replacements: {
			':+1:': ':thumbsup:',
			':facepunch:': ':punch:',
			':hand:': ':raised_hand:',
			':moon:': ':waxing_gibbous_moon:',
			':phone:': ':telephone:',
			':hocho:': ':knife:',
			':boat:': ':sailboat:',
			':car:': ':red_car:',
			':large_blue_circle:': ':blue_circle:',
			'\uD83C\uDFF3': '\uD83C\uDFF3\uFE0F', // Flag
			'\uD83D\uDECF': '\uD83D\uDECF\uFE0F', // Bed
			'\u2640': '\u2640\uFE0F', // Female Sign
			'\u2764\uFE0F': '\u2764\uFE0F\u200B', // Red Heart
			'\uFE0F\uFE0F': '\uFE0F' // Fix for ZWJ
		},
		sizes: [
			{
				size: 20
			}, {
				class: ['im_short_message_text', 'im_short_message_media'],
				size: 16
			}, {
				class: ['composer_emoji_tooltip', 'stickerset_modal_sticker_alt'],
				size: 26
			}
		],
		addStyles() {
			GM_addStyle(EmojiHelper.sizes.map(size => {
				let output = '.emoji';
				if (size.class) {
					output = size.class.map(c => `.${c} .emoji`).join(', ');
				}
				return `${output} {width: ${size.size}px; height: ${size.size}px; vertical-align: middle;}`;
			}).join(''));
		},
		makeReplacements(str) {
			Object.entries(EmojiHelper.replacements).forEach(([key, value]) => {
				str = str.replace(new RegExp(Util.regexEscape(key), 'g'), value);
			});
			return str;
		},
		buildEmoji(img, src) {
			img.removeAttribute('style');
			img.removeAttribute('class');
			img.classList.add('emoji', 'e1-converted');
			img.style.backgroundImage = `url(${src})`;
			img.style.backgroundSize = 'cover';
			img.src = 'img/blank.gif';
		},
		toEmoji(text) {
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = emojione.toImage(EmojiHelper.makeReplacements(text));

			Util.qq('img', tempDiv).forEach(emoji => emoji.outerHTML = emoji.alt);
			tempDiv.innerHTML = emojione.toImage(EmojiHelper.makeReplacements(tempDiv.textContent));

			Util.qq('img', tempDiv).forEach(emoji => EmojiHelper.buildEmoji(emoji, emoji.src));

			return tempDiv.innerHTML;
		},
		shortnameToSrc(shortname) {
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = emojione.toImage(EmojiHelper.replacements[shortname] || shortname);
			return Util.q('img', tempDiv).src;
		},
		convert(node) {
			if (node.childNodes && node.childNodes.length > 0) {
				Util.qq('span.emoji', node).forEach(emoji => emoji.outerHTML = emoji.textContent);
			}
			if (node.nodeType === Node.TEXT_NODE) {
				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = EmojiHelper.toEmoji(node.textContent);

				if (Util.q('img', tempDiv)) {
					Array.from(tempDiv.childNodes).forEach(tempChild => node.parentNode.insertBefore(tempChild, node));
					node.remove();
				}
			} else if (node.tagName === 'IMG') {
				if (!node.classList.contains('e1-converted')) {
					EmojiHelper.buildEmoji(node, EmojiHelper.shortnameToSrc(node.alt));
				}
			} else if (node.childNodes) {
				Array.from(node.childNodes).forEach(EmojiHelper.convert);
			}
		}
	};

	EmojiHelper.addStyles();

	const convertAndWatch = function(node, config) {
		EmojiHelper.convert(node);
		const changes = waitForElems({
			context: node,
			config,
			onchange() {
				changes.stop();
				EmojiHelper.convert(node);
				changes.resume();
			}
		});
	};

	waitForElems({
		sel: [
			'.im_message_author',
			'.im_message_webpage_site',
			'.im_message_webpage_title > a',
			'.im_message_webpage_description',
			'.im_dialog_peer > span',
			'.stickerset_modal_sticker_alt',
			'.im_message_photo_caption',
			'.im_message_document_caption',
			'.reply_markup_button'
		].join(','),
		onmatch: EmojiHelper.convert
	});

	waitForElems({
		sel: [
			'.im_message_text',
			'.im_short_message_text',
			'.im_short_message_media > span > span > span'
		].join(','),
		onmatch: convertAndWatch
	});

	convertAndWatch(Util.q('.composer_rich_textarea'), {
		characterData: true,
		childList: true,
		subtree: true
	});

	waitForElems({
		sel: '.composer_emoji_btn',
		onmatch(btn) {
			btn.innerHTML = EmojiHelper.toEmoji(btn.title);
		}
	});

	waitForElems({
		sel: '.composer_emoji_option',
		onmatch(option) {
			Util.q('.emoji', option).outerHTML = EmojiHelper.toEmoji(Util.q('span', option).textContent);
		}
	});
})();
