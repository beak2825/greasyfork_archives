/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

// ==UserScript==
// @name               Extract RHYTHM-play arcaea password from video
// @namespace          https://greasyfork.org/users/667968-pyudng
// @version            0.2
// @description        Read cards in the video for you
// @author             PY-DNG
// @license            Do What The F*ck You Want To Public License
// @match              *://www.youtube.com/*
// @require            https://update.greasyfork.org/scripts/456034/1348286/Basic%20Functions%20%28For%20userscripts%29.js
// @icon               data:image/jpeg;base64,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
// @grant              GM_registerMenuCommand
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/502583/Extract%20RHYTHM-play%20arcaea%20password%20from%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/502583/Extract%20RHYTHM-play%20arcaea%20password%20from%20video.meta.js
// ==/UserScript==

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager queueTask testChecker registerChecker loadFuncs */

(function __MAIN__() {
    'use strict';

	const CONST = {
		TextAllLang: {
			DEFAULT: 'en',
			'en': {
                ShowCards: '𝑺𝒉𝒐𝒘 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒄𝒂𝒓𝒅𝒔',
                RefreshTip: 'Note: If password is incorrect, '
            }
		}
	};

	// Init language
	const i18n = Object.keys(CONST.TextAllLang).includes(navigator.language) ? navigator.language : CONST.TextAllLang.DEFAULT;
	CONST.Text = CONST.TextAllLang[i18n];

    GM_registerMenuCommand(CONST.Text.ShowCards, fetchTeaser);
    async function fetchTeaser() {
        const html = await (await fetch(location.href)).text();
        let trustedHTML = html;
        // Wrap with Trusted Types API
        if (window?.trustedTypes?.createPolicy) {
            const policy = window.trustedTypes.createPolicy('original', { createHTML: str => str });
            trustedHTML = policy.createHTML(html);
        }
        const parser = new DOMParser();
        const oDom = parser.parseFromString(trustedHTML, 'text/html');

        try {
            const script = Array.from(oDom.scripts).find(s => s.innerHTML.trim().startsWith('var ytInitialData'));
            const code = script.innerHTML;
            const json = code.trim().replace(/^\s*var ytInitialData *= */, '').replace(/[;\s]*$/, '');
            const data = JSON.parse(json);
            const card_texts = data.cards.cardCollectionRenderer.cards.map(card => card.cardRenderer.teaser.simpleCardTeaserRenderer.message.simpleText);
            console.log('%cCards\' contents are:%c\n%s', 'color: orange;', '', card_texts.join('\n'));
            alert('☆𝑪𝒂𝒓𝒅𝒔\' 𝒄𝒐𝒏𝒕𝒆𝒏𝒕𝒔 𝒂𝒓𝒆☆:\n' + card_texts.join('\n') + '\n ');
        } catch {
            alert("𝑪𝒐𝒖𝒍𝒅 𝒏𝒐𝒕 𝒇𝒊𝒏𝒅 𝒄𝒂𝒓𝒅𝒔 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒗𝒊𝒅𝒆𝒐.\n𝑴𝒂𝒌𝒆 𝒔𝒖𝒓𝒆 𝒊𝒕'𝒔 𝑹𝑯𝒀𝑻𝑯𝑴 𝑷𝒍𝒂𝒚'𝒔 𝒗𝒊𝒅𝒆𝒐 𝒂𝒏𝒅 𝒉𝒂𝒔 𝒂 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒔𝒉𝒐𝒘𝒏 𝒃𝒚 𝒄𝒂𝒓𝒅𝒔.");
        }
    }

    function decorateText(text) {
        // Bonus award for those who'd love reading source codes! ww
        const common_letters = 'a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ');
        const italic_letters = '𝒂 𝒃 𝒄 𝒅 𝒆 𝒇 𝒈 𝒉 𝒊 𝒋 𝒌 𝒍 𝒎 𝒏 𝒐 𝒑 𝒒 𝒓 𝒔 𝒕 𝒖 𝒗 𝒘 𝒙 𝒚 𝒛 𝑨 𝑩 𝑪 𝑫 𝑬 𝑭 𝑮 𝑯 𝑰 𝑱 𝑲 𝑳 𝑴 𝑵 𝑶 𝑷 𝑸 𝑹 𝑺 𝑻 𝑼 𝑽 𝑾 𝑿 𝒀 𝒁'.split(' ');
        return Array.from(text).map(char => common_letters.includes(char) ? italic_letters.at(common_letters.indexOf(char)) : char).join('');
    }
})();