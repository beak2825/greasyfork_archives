// ==UserScript==
// @name	    Twitch Live Chat Translator (Russian to English)
// @license     AGPLv3
// @namespace	http://tampermonkey.net/
// @version	    1.2
// @description	Automatically translates Russian(cyrillic) messages in Twitch chat to English.
// @author	    Phenon
// @match	    https://www.twitch.tv/*
// @run-at		document-end
// @homepageURL https://github.com/Phen0n/ttv-lct
// @supportURL  https://github.com/Phen0n/ttv-lct/issues
// @grant	    GM_setValue
// @grant	    GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/527095/Twitch%20Live%20Chat%20Translator%20%28Russian%20to%20English%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527095/Twitch%20Live%20Chat%20Translator%20%28Russian%20to%20English%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //initialize vars
    GM_setValue('color', GM_getValue('color', '#007F00'));
    GM_setValue('margins', GM_getValue('margins', ['5px', '5px']));
    GM_setValue('style', GM_getValue('style', 'italic'));

    GM_setValue('msTimeout', GM_getValue('msTimeout', 20000));
	GM_setValue('msBatchtime', GM_getValue('msBatchtime', 1000));

    //console functions
    unsafeWindow.setColor = function(cl) {
        console.log(`Changed color: ${GM_getValue('color')} -> ${cl}`);
        GM_setValue('color', cl);
    }
    unsafeWindow.setMargins = function(mg) {
        console.log(`Changed margins: ${GM_getValue('margins')} -> ${mg}`);
        GM_setValue('margins', mg);
    }
    unsafeWindow.setStyle = function(st) {
        console.log(`Changed style: ${GM_getValue('style')} -> ${st}`);
        GM_setValue('style', st);
    }

    unsafeWindow.setTimer = function(to) {
        console.log(`Changed timeout: ${GM_getValue('msTimeout')}ms -> ${to}ms`);
        GM_setValue('msTimeout', to);
    }
	unsafeWindow.setBatchtime = function(bt) {
		console.log(`Changed batch time: ${GM_getValue('msBatchtime')}ms -> ${bt}ms`);
		GM_setValue('msBatchtime', bt);
	}

    function getFirst(queryList) {
        for (let query of queryList) {
            if (document.querySelector(query)) return query;
        }
        return null;
    }

	// translation via Lingva by thedaviddelta
	// https://github.com/thedaviddelta/lingva-translate
	async function translate(text, index = 0) {
		const endpoints = ['https://lingva.ml/api/v1/ru/en/', 'https://lingva.lunar.icu/api/v1/ru/en/'];
		if (index >= endpoints.length) return "Translation failed for all endpoints.";
		try {
			const response = await fetch(endpoints[index] + encodeURIComponent(text));
			if (!response.ok) return translate(text, index + 1); // Try next endpoint
			const data = await response.json();
			let translation = data.translation;
			if (translation.startsWith('"') && translation.endsWith('"')) {
				translation = translation.slice(1, -1);
			}
			return translation;
		} catch (error) {
			console.error(`Error with endpoint ${endpoints[index]}:`, error);
			return translate(text, index + 1); // Try next endpoint
		}
	}

    const chatboxQueries = new Map([
        ['main.seventv-chat-list','span.text-token'],							//live, 7tv
        ['div.chat-scrollable-area__message-container', 'span.text-fragment'],	//live, default
        ['div.video-chat__message-list-wrapper', 'span.text-token'],			//video, 7tv
        ['div.video-chat__message-list-wrapper', 'span.text-fragment']			//video, default
    ]);

	// main functionality
    const observerConfig = { childList: true, subtree: true };
    const chatObserver = new MutationObserver(async (mutations) => {
        resetTimeout();
        for (let mutation of mutations) {
            mutation.addedNodes.forEach(async (node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    for (let textNode of node.querySelectorAll(getFirst(chatboxQueries.values()))) {
                        const messageText = textNode.innerText;
                        //skip if text isn't Cyrillic
                        if (!/[\u0400-\u04FF]/.test(messageText)) continue;
                        const translatedText = await translate(messageText);

                        const translatedSpan = document.createElement('span');
                        translatedSpan.style.color = GM_getValue('color');
                        translatedSpan.style.marginLeft = GM_getValue('margins')[0];
                        translatedSpan.style.marginRight = GM_getValue('margins')[1];
                        translatedSpan.style.fontStyle = GM_getValue('style');
                        translatedSpan.innerText = `[${translatedText}]`;

                        textNode.appendChild(translatedSpan);
                    }
                }
            });
        }
    });

    function resetObserver() {
        chatObserver.disconnect();
        console.log(`ttv-lct: No messages detected for ${GM_getValue('msTimeout')}ms. Resetting observer...`);
        const interval = setInterval(() => {
            if (getFirst(chatboxQueries.keys())) {
                clearInterval(interval);
                chatObserver.observe(document.querySelector(getFirst(chatboxQueries.keys())), observerConfig);
            }
        }, 1000);
    }

    let timeoutId;

    function resetTimeout() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(resetObserver, GM_getValue('msTimeout'));
    }

    //Init
    const interval = setInterval(() => {
        if (getFirst(chatboxQueries.keys())) {
            clearInterval(interval);
            chatObserver.observe(document.querySelector(getFirst(chatboxQueries.keys())), observerConfig);
            timeoutId = setTimeout(resetObserver, GM_getValue('msTimeout'));
        }
    }, 1000);
})();