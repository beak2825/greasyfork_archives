// ==UserScript==
// @name        ユーティリティクラス
// @version     2.0.0
// @description HTML、XML、DOM、文字列、Greasemonkeyスクリプトに関する汎用的な処理をまとめたライブラリです。
// @license     MPL-2.0
// @contributionURL https://www.amazon.co.jp/registry/wishlist/E7PJ5C3K7AM2
// @compatible  Edge Blink版のみ / Blink version only
// @compatible  Firefox 推奨 / Recommended
// @compatible  Opera
// @compatible  Chrome
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/19616
// ==/UserScript==

'use strict';

/**
 * HTML、XML、DOMに関するメソッド等。
 */
window.MarkupUtils = {
	/**
	 * Atom名前空間。
	 * @constant {string}
	 */
	ATOM_NAMESPACE: 'http://www.w3.org/2005/Atom',

	/**
	 * XMLの特殊文字と文字参照の変換テーブル。
	 * @constant {Object.<string>}
	 */
	CHARACTER_REFERENCES_TRANSLATION_TABLE: {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&apos;',
	},

	/**
	 * XMLの特殊文字を文字参照に置換します。
	 * @see [html - HtmlSpecialChars equivalent in Javascript? - Stack Overflow]{@link http://stackoverflow.com/a/4835406}
	 * @param {string} str - プレーンな文字列。
	 * @returns {string} HTMLとして扱われる文字列。
	 */
	convertSpecialCharactersToCharacterReferences(str)
	{
		return String(str).replace(
			/[&<>"']/g,
			specialCharcter => this.CHARACTER_REFERENCES_TRANSLATION_TABLE[specialCharcter]
		);
	},

	/**
	 * テンプレート文字列のタグとして用いることで、式内にあるXMLの特殊文字を文字参照に置換します。
	 * @param {string[]} htmlTexts
	 * @param {...string} plainText
	 * @returns {string} HTMLとして扱われる文字列。
	 */
	escapeTemplateStrings(htmlTexts, ...plainTexts)
	{
		return String.raw(
			{ raw: htmlTexts },
			...plainTexts.map(plainText => this.convertSpecialCharactersToCharacterReferences(plainText))
		);
	},

	/**
	 * 指定したURLからファイルをダウンロードします。
	 * @param {string} url
	 * @param {string} filename
	 */
	download(url, filename)
	{
		const body = document.body;
		body.insertAdjacentHTML('beforeend', h`<a href="${url}" download="${filename}" hidden=""></a>`);
		const anchor = body.lastElementChild;
		anchor.click();
		anchor.remove();
	},
};

/**
 * {@link MarkupUtils.escapeTemplateStrings}、
 * または {@link MarkupUtils.convertSpecialCharactersToCharacterReferences} の短縮表記。
 * @example
 * // returns "<code>&lt;a href=&quot;https://example.com/&quot;link text&lt;/a&gt;</code>"
 * h`<code>${'<a href="https://example.com/">link text</a>'}</code>`;
 * @example
 * // returns "&lt;a href=&quot;https://example.com/&quot;link text&lt;/a&gt;"
 * h('<a href="https://example.com/">link text</a>');
 * @returns {string}
 */
window.h = function () {
	return Array.isArray(arguments[0])
		? MarkupUtils.escapeTemplateStrings(...arguments)
		: MarkupUtils.convertSpecialCharactersToCharacterReferences(arguments[0]);
};

/**
 * 文字、文字列の処理を行うメソッド等。
 */
window.StringProcessor = {
	/**
	 * ひらがなをカタカナに変換するときの加数。
	 * @constant {number}
	 */
	ADDEND_HIRAGANA_TO_KATAKANA: 'ァ'.charCodeAt() - 'ぁ'.charCodeAt(),

	/**
	 * ひらがなをカタカナに変換します。
	 * @param {string} str
	 * @returns {string}
	 */
	convertToKatakana(str)
	{
		return str.replace(
			/[ぁ-ゖ]/g,
			match => String.fromCharCode(match.charCodeAt() + this.ADDEND_HIRAGANA_TO_KATAKANA)
		);
	},
};

/**
 * 時間に関するユーティリティクラス。
 */
window.DateUtils = class {
	/**
	 * 日をミリ秒に変換するときの乗数。
	 * @constant {number}
	 */
	static get DAYS_TO_MILISECONDS() {return 24 * 60 * 60 * 1000;}

	/**
	 * 時間をミリ秒に変換するときの乗数。
	 * @constant {number}
	 */
	static get HOURS_TO_MILISECONDS() {return 60 * 60 * 1000;}

	/**
	 * 分をミリ秒に変換するときの乗数。
	 * @constant {number}
	 */
	static get MINUTES_TO_MILISECONDS() {return 60 * 1000;}

	/**
	 * 秒をミリ秒に変換するときの乗数。
	 * @constant {number}
	 */
	static get SECONDS_TO_MILISECONDS() {return 1000;}

	/**
	 * 日本標準時 (+09:00) の時間帯 (UTCとの差)。ミリ秒。
	 * @constant {number}
	 */
	static get TIMEZONE_JST() {return 9 * this.HOURS_TO_MILISECONDS;}

	/**
	 * ISO 8601 形式の文字列からミリ秒数を取得します。
	 * @param {string} dateTime
	 * @returns {?number}
	 */
	static parseDurationString(dateTime)
	{
		let duration = null;
		const result = /^P([0-9]+D)?(?:T([0-9]+H)?([0-9]+M)?([0-9]+(?:\.[0-9]{0,3})?S)?)?$/.exec(dateTime);
		if (result) {
			duration = 0;
			if (result[1]) {
				duration += Number.parseInt(result[1]) * this.DAYS_TO_MILISECONDS;
			}
			if (result[2]) {
				duration += Number.parseInt(result[2]) * this.HOURS_TO_MILISECONDS;
			}
			if (result[3]) {
				duration += Number.parseInt(result[3]) * this.MINUTES_TO_MILISECONDS;
			}
			if (result[4]) {
				duration += Number.parseFloat(result[4]) * this.SECONDS_TO_MILISECONDS;
			}
		}
		return duration;
	}

	/**
	 * 日本標準時の時刻文字列 (hh:mm) をDateインスタンスに変換します。
	 * @param {string} time - 過去を表す時刻。
	 * @returns {Date}
	 */
	static parseJSTString(time)
	{
		const hoursAndMinutes = time.split(':');
		const date = new Date();
		date.setUTCHours(Number.parseInt(hoursAndMinutes[0]), Number.parseInt(hoursAndMinutes[1]), 0, 0);
		date.setTime(date.getTime() - this.TIMEZONE_JST);
		if (date.getTime() > Date.now()) {
			date.setTime(date.getTime() - this.DAYS_TO_MILISECONDS);
		}
		return date;
	}
};

/**
 * Greasemonkeyスクリプトに関するメソッド等。
 */
window.GreasemonkeyUtils = class {
	/**
	 * Greasemonkeyスクリプトが{@link unsafeWindow}なコンテキスト上で実行されている可能性が高ければ真を返します。
	 * @returns {boolean}
	 */
	static mayBeOnUnsafeContext()
	{
		return GM_info.scriptHandler && GM_info.scriptHandler !== 'Greasemonkey';
	}

	/**
	 * {@link unsafeWindow}なコンテキストで関数を実行します。
	 * 実行時、head要素が構築済みである必要があります。
	 * @param {Function} func
	 * @param {Array} args
	 * @param {boolean} definedGlobalVariables - 関数内において、「window.key = '値'」のような形でグローバル変数を定義しているなら真を指定。
	 * @returns {Promise.<void>}
	 */
	static async executeOnUnsafeContext(func, args = [], definedGlobalVariables = false)
	{
		if (!definedGlobalVariables && this.mayBeOnUnsafeContext()) {
			func(...args);
			return;
		}

		const script = document.createElement('script');
		const code = func.toString();
		script.text = `(${
			/^(?:async\s)?\(/.test(code) ? code : code.replace(/^(async\s+)?(function\s)?/u, '$1function ')
		})(...${JSON.stringify(args)})`;

		if (!document.head) {
			await new Promise(function (resolve) {
				new MutationObserver(function (mutation, observer) {
					if (!document.head) {
						return;
					}
					observer.disconnect();
					resolve();
				}).observe(document, { childList: true, subtree: true });
			});
		}
		document.head.appendChild(script).remove();
	}
};

/**
 * 以下のような形式の翻訳リソース。すべての言語について、msgidは欠けていないものとする。
 * {@link Gettext.DEFAULT_LOCALE}のリソースを必ず含む。{@link Gettext.originalLocale}のリソースは無視される。
 * {
 *     'IETF言語タグ': {
 *         '翻訳前 (msgid)': '翻訳後 (msgstr)',
 *         ……
 *     },
 *     ……
 * }
 * @typedef {Object} LocalizedTexts
 */

/**
 * i18n。
 */
window.Gettext = class {
	/**
	 * クライアントの言語の翻訳リソースが存在しないとき、どの言語に翻訳するか。IETF言語タグの「language」サブタグ。
	 * @constant {string}
	 */
	static get DEFAULT_LOCALE() {return 'en';}

	/**
	 * 翻訳リソースを追加します。
	 * @param {LocalizedTexts} localizedTexts
	 */
	static setLocalizedTexts(localizedTexts)
	{
		this.multilingualLocalizedTexts = localizedTexts;
	}

	/**
	 * クライアントの言語を設定します。
	 * @param {string} clientLang - IETF言語タグ (「language」と「language-REGION」にのみ対応)。
	 */
	static setLocale(clientLang)
	{
		const splitedClientLang = clientLang.split('-', 2);
		this.language = splitedClientLang[0].toLowerCase();
		this.langtag = this.language + (splitedClientLang[1] ? '-' + splitedClientLang[1].toUpperCase() : '');
		if (this.language === 'ja') {
			// ja-JPをjaと同一視
			this.langtag = this.language;
		}
	}

	/**
	 * テキストをクライアントの言語に変換します。
	 * @param {string} message - 翻訳前。
	 * @returns {string} 翻訳後。
	 */
	static gettext(message)
	{
		// クライアントの言語が翻訳元の言語なら、そのまま返す
		return this.langtag === this.originalLocale && message
			// クライアントの言語の翻訳リソースが存在すれば、それを返す
			|| this.langtag in this.multilingualLocalizedTexts && this.multilingualLocalizedTexts[this.langtag][message]
			// 地域下位タグを取り除いた言語タグの翻訳リソースが存在すれば、それを返す
			|| this.language in this.multilingualLocalizedTexts && this.multilingualLocalizedTexts[this.language][message]
			// 既定言語の翻訳リソースが存在すれば、それを返す
			|| this.DEFAULT_LOCALE in this.multilingualLocalizedTexts && this.multilingualLocalizedTexts[this.DEFAULT_LOCALE][message]
			// そのまま返す
			|| message;
	}
};

/**
 * 翻訳対象文字列 (msgid) の言語。IETF言語タグの「language」サブタグ。
 * @member {string}
 */
Gettext.originalLocale = 'ja';


/**
 * クライアントの言語。{@link Gettext.setLocale}から変更されます。
 * @access private
 * @member {string}
 */
Gettext.langtag = 'ja';

/**
 * クライアントの言語のlanguage部分。{@link Gettext.setLocale}から変更されます。
 * @access private
 * @member {string}
 */
Gettext.language = 'ja';

/**
 * 翻訳リソース。{@link Gettext.setLocalizedTexts}から変更されます。
 * @access private
 * @member {LocalizedTexts}
 */
Gettext.multilingualLocalizedTexts = {};

window._ = Gettext.gettext.bind(Gettext);

/**
 * 目印となる要素が文書に存在するか否かを返すコールバック関数。
 * @callback existsTarget
 * @returns {boolean}
 */

/**
 * 目印となる要素が挿入されるまで待機します。
 * @param {existsTarget} existsTarget - 目印となる要素が挿入されていれば `true` を返す関数。
 * @param {number} [timeoutSecondsSinceDOMContentLoaded=0] - DOM構築完了後に監視を続ける秒数。
 * @returns {Promise.<void>}
 */
window.waitTarget = function (existsTarget, timeoutSecondsSinceDOMContentLoaded = 0) {
	if (existsTarget()) {
		// 目印となる要素が既に存在していれば
		return Promise.resolve();
	}

	return new Promise(function (resolve, reject) {
		const observer = new MutationObserver(function () {
			if (!existsTarget()) {
				return;
			}

			observer.disconnect();
			document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);
			resolve();
		});
		observer.observe(document, { childList: true, subtree: true });

		if (document.readyState === 'complete') {
			// DOMの構築が完了していれば
			onDOMContentLoaded();
			return;
		}
		
		document.addEventListener('DOMContentLoaded', onDOMContentLoaded, { once: true });

		/**
		 * 目印となる要素が存在しなければさらに{@link timeoutSecondsSinceDOMContentLoaded}秒待機します。
		 */
		function onDOMContentLoaded()
		{
			setTimeout(function () {
				observer.disconnect();
				reject();
			}, timeoutSecondsSinceDOMContentLoaded * DateUtils.SECONDS_TO_MILISECONDS);
		}
	});
};
