// ==UserScript==
// @name        Drag & DropZones +
// @name:ja     Drag & DropZones +
// @description [userChromeJS] Drag selected character strings or image and drop to the semitransparent box displayed on web page to open search result.
// @description:ja 【userChromeJS】選択した文字列などをドラッグし、ページ上に表示される半透明の枠内にドロップすることで、Web検索などを実行します。
// @namespace   https://userscripts.org/users/347021
// @version     4.9.0
// @include     main
// @license     MPL-2.0
// @contributionURL https://www.amazon.co.jp/registry/wishlist/E7PJ5C3K7AM2
// @incompatible Edge
// @compatible  Firefox userChromeJS用スクリプト です (※GreasemonkeyスクリプトでもuserChromeES用スクリプトでもありません) / This script is for userChromeJS (* neither Greasemonkey nor userChromeES)
// @incompatible Opera
// @incompatible Chrome
// @charset     UTF-8
// @author      100の人
// @contributor HADAA
// @homepageURL https://greasyfork.org/scripts/264
// @downloadURL https://update.greasyfork.org/scripts/264/Drag%20%20DropZones%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/264/Drag%20%20DropZones%20%2B.meta.js
// ==/UserScript==

(async function () {
'use strict';

/**
 * L10N
 * @type {LocalizedTexts}
 */
const localizedTexts = {
	/*eslint-disable quote-props, max-len */
	'en': {
		'次のパスへ設定ファイルを作成しました。': 'Created a configuration file to the following location.',
		'JSONファイルとしてのパースに失敗しました。': 'Failed to parse the settings file as JSON.',
		'ルートがオブジェクトではありません。': 'The root is not an object.',
		'「providers」プロパティが存在しません。': 'The “providers” property does not exist.',
		'「providers」プロパティは配列ではありません。': ' The “providers” property is not an array.',
		'「where」プロパティは %s のいずれかを設定します。': 'Set one of %s into the “where” property.',
		'「providers」プロパティの %i 番目の要素はオブジェクトではありません。': 'The %i-th element of the “providers” property is not an object.',
		'「providers」プロパティの %i 番目の要素には「search_url」「image_url」が重複して設定されています。':
			'The %i-th element of the “providers” property has duplicate “search_url” and “image_url” set.',
		'「providers」プロパティの %i 番目の要素の「%s」プロパティは文字列ではありません。': 'The “%s” property of the %i-th element of the “providers” property is not a string.',
		'「providers」プロパティの %i 番目の要素の「%1s」プロパティは、%2s で始まる妥当なURLではありません。':
			'The “%1s” property of the %i-th element of the “providers” property is not a valid URL beginning with %2s.',
		'「providers」プロパティの %i 番目の要素に「name」プロパティが存在しません。': ' The “name” property does not exist for the %i-th element of the “providers” property.',
		'「providers」プロパティの %i 番目で指定されている「%s」という名前のブラウザ検索プロバイダは存在しません。':
			'There is no browser search provider named “%s” specified in the %i-th element of the “providers” property.',
		'「providers」プロパティの %i 番目の要素の「search_url」「search_url_post_params」プロパティのいずれにも、{searchTerms}　が含まれません。':
			'Neither the “search_url” nor the “search_url_post_params” properties of the %i-th element of the “providers” property contain {searchTerms}.',
		'「providers」プロパティの %i 番目の要素には「image_url_post_params」プロパティが存在しません。':
			'The “image_url_post_params” property does not exist on the %i-th element of the “providers” property.',
		'「providers」プロパティの %i 番目の要素の「image_url_post_params」プロパティには、{searchTerms} に一致するクエリ値が存在しません。':
			'The “image_url_post_params” property for the %i-th element of the “providers” property does not have a query value that matches {searchTerms}.',
		'検索プロバイダが1つも指定されていません。': 'None of the search providers have been specified.',

		'Google 画像で検索': 'Google search by image',
	},
	/*eslint-enable */
};



const { FileUtils } = ChromeUtils.importESModule('resource://gre/modules/FileUtils.sys.mjs');

const ScriptableUnicodeConverter
	= Cc['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Ci.nsIScriptableUnicodeConverter);

const TextToSubURI = Cc['@mozilla.org/intl/texttosuburi;1'].getService(Ci.nsITextToSubURI);

const StringInputStream
	= Components.Constructor('@mozilla.org/io/string-input-stream;1', 'nsIStringInputStream', 'setByteStringData');
const FileInputStream
	= Components.Constructor('@mozilla.org/network/file-input-stream;1', 'nsIFileInputStream', 'init');
const ConverterOutputStream
	= Components.Constructor('@mozilla.org/intl/converter-output-stream;1', 'nsIConverterOutputStream', 'init');



const Cr = new Proxy(window.Cr, {
	get(target, name)
	{
		if (name in target) {
			return target[name];
		} else if (name === 'NS_ERROR_UCONV_NOCONV') {
			return 0x80500001;
		} else {
			return undefined;
		}
	},
});



/**
 * HTML、XML、DOMに関するメソッド等。
 */
const MarkupUtils = {
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
	 * @see {@link https://stackoverflow.com/a/4835406 html - HtmlSpecialChars equivalent in Javascript? - Stack Overflow}
	 * @param {string} str - プレーンな文字列。
	 * @returns {string} HTMLとして扱われる文字列。
	 */
	convertSpecialCharactersToCharacterReferences(str) {
		return String(str).replace(
			/[&<>"']/g,
			specialCharcter => this.CHARACTER_REFERENCES_TRANSLATION_TABLE[specialCharcter],
		);
	},

	/**
	 * テンプレート文字列のタグとして用いることで、式内にあるXMLの特殊文字を文字参照に置換します。
	 * @param {string[]} htmlTexts
	 * @param {...string} plainText
	 * @returns {string} HTMLとして扱われる文字列。
	 */
	escapeTemplateStrings(htmlTexts, ...plainTexts) {
		return String.raw(
			htmlTexts,
			...plainTexts.map(plainText => this.convertSpecialCharactersToCharacterReferences(plainText)),
		);
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
function h(...args)
{
	return Array.isArray(args[0])
		? MarkupUtils.escapeTemplateStrings(...args)
		: MarkupUtils.convertSpecialCharactersToCharacterReferences(args[0]);
}

// i18n
let _, setlang, setLocalizedTexts;
{
	/**
	 * 翻訳対象文字列 (msgid) の言語。
	 * @constant {string}
	 */
	const ORIGINAL_LOCALE = 'ja';

	/**
	 * クライアントの言語の翻訳リソースが存在しないとき、どの言語に翻訳するか。
	 * @constant {string}
	 */
	const DEFAULT_LOCALE = 'en';

	/**
	 * 以下のような形式の翻訳リソース。
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
	 * クライアントの言語。{@link setlang}から変更される。
	 * @type {string}
	 * @access private
	 */
	let langtag = 'ja';

	/**
	 * クライアントの言語のlanguage部分。{@link setlang}から変更される。
	 * @type {string}
	 * @access private
	 */
	let language = 'ja';

	/**
	 * 翻訳リソース。{@link setLocalizedTexts}から変更される。
	 * @type {LocalizedTexts}
	 * @access private
	 */
	const multilingualLocalizedTexts = {};
	multilingualLocalizedTexts[ORIGINAL_LOCALE] = {};

	/**
	 * テキストをクライアントの言語に変換する。
	 * @param {string} message - 翻訳前。
	 * @returns {string} 翻訳後。
	 */
	_ = function (message) {
		// クライアントの言語の翻訳リソースが存在すれば、それを返す
		return langtag in multilingualLocalizedTexts && multilingualLocalizedTexts[langtag][message]
			// 地域下位タグを取り除いた言語タグの翻訳リソースが存在すれば、それを返す
			|| language in multilingualLocalizedTexts && multilingualLocalizedTexts[language][message]
			// デフォルト言語の翻訳リソースが存在すれば、それを返す
			|| DEFAULT_LOCALE in multilingualLocalizedTexts && multilingualLocalizedTexts[DEFAULT_LOCALE][message]
			// そのまま返す
			|| message;
	};

	/**
	 * {@link gettext}から参照されるクライアントの言語を設定する。
	 * @param {string} lang - IETF言語タグ。（「language」と「language-REGION」にのみ対応）
	 */
	setlang = function (lang) {
		lang = lang.split('-', 2);
		language = lang[0].toLowerCase();
		langtag = language + (lang[1] ? '-' + lang[1].toUpperCase() : '');
	};

	/**
	 * {@link gettext}から参照される翻訳リソースを追加する。
	 * @param {LocalizedTexts} localizedTexts
	 */
	setLocalizedTexts = function (localizedTexts) {
		for (let lang in localizedTexts) {
			const localizedText = localizedTexts[lang];
			lang = lang.split('-');
			const language = lang[0].toLowerCase();
			const langtag = language + (lang[1] ? '-' + lang[1].toUpperCase() : '');

			if (langtag in multilingualLocalizedTexts) {
				// すでに該当言語の翻訳リソースが存在すれば、統合する（同じmsgidがあれば上書き）
				for (const msgid in localizedText) {
					multilingualLocalizedTexts[langtag][msgid] = localizedText[msgid];
				}
			} else {
				multilingualLocalizedTexts[langtag] = localizedText;
			}

			if (language !== langtag) {
				// 言語タグに地域下位タグが含まれていれば
				// 地域下位タグを取り除いた言語タグも翻訳リソースとして追加する
				if (language in multilingualLocalizedTexts) {
					// すでに該当言語の翻訳リソースが存在すれば、統合する（同じmsgidがあれば無視）
					for (const msgid in localizedText) {
						if (!(msgid in multilingualLocalizedTexts[language])) {
							multilingualLocalizedTexts[language][msgid] = localizedText[msgid];
						}
					}
				} else {
					multilingualLocalizedTexts[language] = localizedText;
				}
			}

			// msgidの言語の翻訳リソースを生成
			for (const msgid in localizedText) {
				multilingualLocalizedTexts[ORIGINAL_LOCALE][msgid] = msgid;
			}
		}
	};
}

setLocalizedTexts(localizedTexts);

setlang(window.navigator.language);




/**
 * id属性値などに利用する識別子。
 * @constant {string}
 */
const ID = 'drag-and-drop-search-347021';



/**
 * DOM関連のメソッド。
 */
const DOMUtils = {
	/**
	 * HTML名前空間。
	 * @constant {string}
	 */
	HTML_NS: 'http://www.w3.org/1999/xhtml',

	/**
	 * 属性値を{@link DOMTokenList}として取得する。
	 * @param {Element} element - 要素。
	 * @param {string} attributeName - 属性値名。
	 * @returns {DOMTokenList}
	 * @see {@link https://dom.spec.whatwg.org/#interface-domtokenlist 7.1. Interface DOMTokenList | DOM Standard}
	 */
	getAttributeAsDOMTokenList(element, attributeName)
	{
		const tokenList = document.createElementNS(this.HTML_NS, 'div').classList;
		tokenList.value = element.getAttribute(attributeName) || '';
		return tokenList;
	},

	/**
	 * ノードに対応するfigcaption要素を取得する。
	 * @param {Node} node
	 * @returns {?HTMLElement}
	 */
	getFigcaption(node)
	{
		let figcaption = null;

		const parent = node.parentElement;
		if (parent && parent.localName === 'figure') {
			const first = parent.firstElementChild;
			if (first) {
				if (first.localName === 'figcaption') {
					figcaption = first;
				} else {
					const last = parent.lastElementChild;
					if (last && last.localName === 'figcaption') {
						figcaption = last;
					}
				}
			}
		}

		return figcaption;
	},
};



/**
 * 文字列操作。
 */
const StringUtils = {
	/**
	 * [Encoding Standard]{@link https://encoding.spec.whatwg.org/}が要求する標準の文字符号化方式。
	 * @constant {string}
	 */
	THE_ENCODING: 'UTF-8',

	/**
	 * フォームデータを multipart/form-data として、HTTPヘッダが前に結合された{@link Ci.nsIInputStream}に変換する。
	 * @param {FormData} formData
	 * @returns {Promise.<Ci.nsIStringInputStream>}
	 */
	async encodeMultipartFormData(formData)
	{
		const response = new Response(formData);
		const blob = await response.blob();
		const binary = await new Promise(function (resolve) {
			const reader = new FileReader();
			reader.addEventListener('load', event => resolve(event.target.result));
			reader.readAsBinaryString(blob);
		});
		const headers = response.headers;
		headers.set('content-length', binary.length);
		const bodyWithHeaders = Array.from(headers).map(([name, value]) => `${name}: ${value}`).join('\r\n')
			+ '\r\n\r\n' + binary;
		return new StringInputStream(bodyWithHeaders);
	},

	/**
	 * 文字列を指定した符号化方式の{@link nsIInputStream}として返す。
	 * @param {string} str
	 * @param {string} [encoding]
	 * @returns {nsIInputStream}
	 */
	convertToInputStream(str, encoding = this.THE_ENCODING)
	{
		try {
			ScriptableUnicodeConverter.charset = encoding;
		} catch (e) {
			if (e.result === Cr.NS_ERROR_UCONV_NOCONV) {
				ScriptableUnicodeConverter.charset = this.THE_ENCODING;
			} else {
				throw e;
			}
		}
		return ScriptableUnicodeConverter.convertToInputStream(str);
	},
};



/**
 * ユーザー設定。
 * @typedef {Object} UserSettings
 * @property {string} [where] - 検索結果を開く場所。{@link SettingsUtils.WHERES} のいずれか。
 * @property {SearchProvider[]} [providers] - 検索プロバイダの一覧。
 */

/**
 * 一つの検索プロバイダを表します。
 *
 * 「search_url」「image_url」のいずれも存在しない場合、ブラウザに登録されている検索エンジンであることを表します。
 * そのとき「search_url_post_params」が存在する場合、POSTメソッドの検索エンジンであることを表します。
 * @see {@link https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/manifest.json/chrome_settings_overrides chrome_settings_overrides - Mozilla | MDN}
 * @typedef {Object} SearchProvider
 * @property {string} name - 検索プロバイダ名。
 * @property {string} [search_url] - テキスト検索のURL。`{searchTerms}` が検索対象に置き換えられます。
	 * @property {string} [search_url_post_params] - テキスト検索でPOSTメソッドを使用する場合に指定。`{searchTerms}` が検索対象に置き換えられます。
	 * @property {string} [encoding] - 検索プロバイダが受け入れる文字コード文字符号化方式。
	 * @property {string} [favicon_url] - 検索プロバイダを表す16px×16pxのアイコンのURL。ユーザー定義の検索プロバイダの場合は、data URL。
	 * @property {function(): Promise.<void>} [reloadFaviconURL]
	 * 		- ユーザー定義の検索プロバイダの場合、Ci.nsISearchEngineへのアイコン設定に遅延があるため、使用直前に `favicon_url` プロパティを更新するためのメソッド。
	 * @property {string} [image_url] - 画像検索に使用するURL。
	 * @property {string} [image_url_post_params] - 画像検索のPOSTパラメータ。`{searchTerms}` が検索対象に置き換えられます。
 */



/**
 * ユーザー設定。
 */
const SettingsUtils = {
	/**
	 * 設定ファイル名。
	 * @constant {string}
	 */
	FILENAME: 'drag-and-dropzones-plus.json',

	/**
	 * {@link UserSettings.where} で使用可能な値。最初の値が既定値。
	 * @constant {string[]}
	 */
	WHERES: [ 'tab', 'current', 'window' ],

	/**
	 * {@link Ci.nsISearchEngine}を{@link SearchProvider}に変換する。
	 * @param {Ci.nsISearchEngine} browserEngine
	 * @returns {SearchProvider}
	 */
	convertToSearchProviderFromBrowserEngine(browserEngine)
	{
		const provider = {
			name: browserEngine.name,
		};

		provider.reloadFaviconURL = async function () {
			this.favicon_url = await browserEngine.getIconURL();
		};

		const submission = browserEngine.getSubmission('dummy');
		if (submission.postData) {
			// POSTメソッドなら
			provider.search_url_post_params = '';
		}

		return provider;
	},

	/**
	 * 設定ファイルを読み込みます。
	 * @returns {Promise.<UserSettings>}
	 */
	async load()
	{
		const file = FileUtils.getDir('UChrm', [ this.FILENAME ]);
		if (!file.exists()) {
			const settings = await this.preset();

			const stream = FileUtils.openSafeFileOutputStream(file);
			const converterOutputStream = new ConverterOutputStream(stream, StringUtils.THE_ENCODING, 0, 0x0000);
			converterOutputStream.writeString(JSON.stringify(settings, null, '\t'));
			FileUtils.closeSafeFileOutputStream(stream);
			converterOutputStream.close();

			showPopupNotification(_('次のパスへ設定ファイルを作成しました。') + ' / ' + file.path);
			return settings;
		}

		const stream = new FileInputStream(file, -1, -1, 0);
		const json = NetUtil.readInputStreamToString(stream, stream.available(), { charset: StringUtils.THE_ENCODING });
		try {
			return JSON.parse(json);
		} catch (exception) {
			showPopupNotification(`${_('JSONファイルとしてのパースに失敗しました。')} / Path: ${file.path} / Error message: ${exception}`);
		} finally {
			stream.close();
		}
	},

	/**
	 * 読み込んだ設定ファイルを検証し、フィルタリングして返します。
	 * @param {object} obj
	 * @returns {Object.<(?UserSettings|string[])>} 「settings」プロパティにUserSettings、「messages」プロパティにエラーメッセージの一覧。
	 */
	filter(obj)
	{
		const messages = [];
		if (typeof obj !== 'object' || obj === null) {
			messages.push(_('ルートがオブジェクトではありません。'));
		} else if (!('providers' in obj)) {
			messages.push(_('「providers」プロパティが存在しません。'));
		} else if (!Array.isArray(obj.providers)) {
			messages.push(_('「providers」プロパティは配列ではありません。'));
		}

		if (messages.length > 0) {
			return { settings: null, messages };
		}

		const settings = { providers: [] };

		if (!('where' in obj)) {
			settings.where = this.WHERES[0];
		} else if (!this.WHERES.includes(obj.where)) {
			messages.push(_('「where」プロパティは %s のいずれかを設定します。').replace('%s', this.WHERES.join(', ')));
			settings.where = this.WHERES[0];
		} else {
			settings.where = obj.where;
		}

		let i = 0;
		for (const p of obj.providers) {
			i++;

			if (typeof p !== 'object' || p === null) {
				messages.push(_('「providers」プロパティの %i 番目の要素はオブジェクトではありません。').replace('%i', i));
				continue;
			}

			if ('search_url' in p && 'image_url' in p) {
				messages.push(_('「providers」プロパティの %i 番目の要素には「search_url」「image_url」が重複して設定されています。').replace('%i', i));
				continue;
			}

			const provider = {};
			for (const propertyName of [
				'name',
				'search_url',
				'search_url_post_params',
				'image_url',
				'image_url_post_params',
				'encoding',
				'favicon_url',
			]) {
				if (!(propertyName in p)) {
					continue;
				}

				if (typeof p[propertyName] !== 'string') {
					messages.push(_('「providers」プロパティの %i 番目の要素の「%s」プロパティは文字列ではありません。')
						.replace('%i', i).replace('%s', propertyName));
					continue;
				}

				if ([ 'search_url', 'favicon_url', 'image_url' ].includes(propertyName)) {
					let url;
					try {
						url = new URL(p[propertyName]);
					} catch (exception) {
						if (!(exception instanceof TypeError)) {
							throw exception;
						}
					}
					if (!url) {
						const schemas = propertyName === 'favicon_url' ? [ 'data' ] : [ 'https', 'http' ];
						if (schemas.includes(url.protocol)) {
							messages.push(_('「providers」プロパティの %i 番目の要素の「%1s」プロパティは、%2s で始まる妥当なURLではありません。')
								.replace('%i', i).replace('%1s', propertyName).replace('%2s', schemas.join(', ')));
							continue;
						}
					}
				}

				provider[propertyName] = p[propertyName];
			}

			if (!('name' in provider)) {
				messages.push(_('「providers」プロパティの %i 番目の要素に「name」プロパティが存在しません。').replace('%i', i));
				continue;
			}

			if (!('search_url' in provider) && !('image_url' in provider)) {
				// 「search_url」「image_url」プロパティがいずれも存在しない場合は、ブラウザの検索エンジンの指定として扱う
				const browserSearchEngine = Services.search.getEngineByName(provider.name);
				if (!browserSearchEngine) {
					messages.push(_('「providers」プロパティの %i 番目で指定されている「%s」という名前のブラウザ検索プロバイダは存在しません。')
						.replace('%i', i).replace('%s', provider.name));
					continue;
				}

				settings.providers.push(this.convertToSearchProviderFromBrowserEngine(browserSearchEngine));
				continue;
			}

			if ('search_url' in provider) {
				if (!provider.search_url.includes('{searchTerms}')
					&& (!('search_url_post_params' in provider)
						|| !provider.search_url_post_params.includes('{searchTerms}'))) {
					messages.push(
						_('「providers」プロパティの %i 番目の要素の「search_url」「search_url_post_params」プロパティのいずれにも、{searchTerms}　が含まれません。') //eslint-disable-line max-len
							.replace('%i', i),
					);
				}
			} else {
				if (!('image_url_post_params' in provider)) {
					messages.push(_('「providers」プロパティの %i 番目の要素には「image_url_post_params」プロパティが存在しません。')
						.replace('%i', i));
					continue;
				}

				if (!Array.from(new URLSearchParams(provider.image_url_post_params))
					.some(([ , value]) => value === '{searchTerms}')) {
					messages.push(
						_('「providers」プロパティの %i 番目の要素の「image_url_post_params」プロパティには、{searchTerms} に一致するクエリ値が存在しません。')
							.replace('%i', i),
					);
					continue;
				}
			}

			settings.providers.push(provider);
		}

		return { settings, messages };
	},

	/**
	 * プリセットのユーザー設定を返します。
	 * @returns {Promise.<UserSettings>} POSTメソッドのブラウザ検索エンジンでも、「search_url_post_params」プロパティを含みません。
	 */
	async preset()
	{
		const providers = (await Services.search.getVisibleEngines()).map(engine => ({ name: engine.name }));

		// 画像検索例
		providers.push({
			name: _('Google 画像で検索'),
			image_url: 'https://lens.google.com/v3/upload',
			image_url_post_params: 'encoded_image={searchTerms}',
			encoding: StringUtils.THE_ENCODING,
			favicon_url: 'data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAD0hUJK9IVC5/SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQuT0hUJK9IVC5vSFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC5/SFQv/0hUL/9IVC//SFQv/1jU7/+sir//7v5//95df/+9S9//vPtf/3oW7/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/+9jC//3s4f/1lFn/9IVC//SFQv/0iEb//NvH//eibv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//3u5f/5u5b/9IVC//SFQv/0hUL/9IVC//m6lP/707r/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/5vpv//N7M//SIR//0hUL/9IVC//WSV//97OH/+8+0//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//epev/6yKr/+byW//nCoP/+9O7//e3j//WSVv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SHRv/+9vH//OLT//WPUf/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//aeaf/5uZL////+//iwhf/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//m4kf//+/n/96h5//WNT//7zbL/9p9q//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/+9fD/+86z//SFQv/0hUL/96Rx//3r4P/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL//vby//iwhf/0hUL/9IVC//izif//+/j/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//rIqf/5vJf/9IVC//SGRP/95NX/+9a///SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hkT/+bqU//m7lv/84dD///79//rLr//3p3f/9IVC//SFQv/0hUL/9IVC//SFQub0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQub0hUJJ9IVC5vSFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQub0hUJJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==', //eslint-disable-line max-len
		});

		return {
			where: this.WHERES[0],
			providers,
		};
	},
};



/**
 * ドロップゾーンの作成やドロップされたデータの検索などを行う。
 * @type {Object}
 */
const DropzoneUtils = {
	/**
	 * 設定されていない場合に表示するアイコンのURL。
	 * @constant {string}
	 */
	DEFAULT_ICON: 'chrome://global/skin/icons/defaultFavicon.svg',

	/**
	 * @type {UserSettings}
	 */
	settings: null,

	/**
	 * ドロップゾーン専用のスタイルシートを設定するための親要素。
	 * @type {HTMLDivElement}
	 */
	wrapper: null,

	/**
	 * 各ドロップゾーンを作成。
	 */
	create()
	{
		document.head.insertAdjacentHTML('beforeend', h`
			<style>
				/*------------------------------------
					位置決め用
				*/
				#${CSS.escape(ID)} {
					position: relative;
				}

				/*------------------------------------
					ドロップゾーン全体
				*/
				#${CSS.escape(ID)} ul {
					position: absolute;
					top: 1.5em;
					left: 1.5em;
					right: 1.5em;
					height: 8em;
					display: flex;
					border: solid #A0A0A0 1px;
					background-color: rgba(100, 200, 255, 0.5);
					padding-left: 0;
					z-index: 1;
				}

				/*------------------------------------
					各ドロップゾーン
				*/
				#${CSS.escape(ID)} li {
					flex: 1;
					font-weight: bold;
					padding-left: 0.5em;
					overflow: hidden;
					white-space: nowrap;
					line-height: 2em;
					position: relative;
					z-index: 1;
				}

				#${CSS.escape(ID)} li:not(:first-of-type) {
					border-left: inherit;
				}

				#${CSS.escape(ID)} img {
					width: 16px;
					height: 16px;
					vertical-align: middle;
					margin-right: 0.3em;
				}

				/*------------------------------------
					ドロップゾーン上部の背景色
				*/
				#${CSS.escape(ID)} li::before {
					display: block;
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					height: 2em;
					background-color: rgba(50, 100, 200, 0.7);
					z-index: -1;
				}

				/*------------------------------------
					各ドロップゾーンにポインタが載っている時
				*/
				#${CSS.escape(ID)} li.drop-active-valid::before {
					height: initial;
					bottom: 0;
				}
			</style>
		`);
		const tabbox = document.getElementById('tabbrowser-tabbox');
		tabbox.insertAdjacentHTML('afterbegin', h`
			<div xmlns="${DOMUtils.HTML_NS}" id="${ID}" hidden="">
				<ul></ul>
			</div>
		`);
		this.wrapper = tabbox.firstElementChild;

		// 構築
		this.wrapper.getElementsByTagName('ul')[0]
			.append(...this.settings.providers.map(this.convertFromSearchProvider));
	},

	/**
	 * アイコンが読み込まれていないエンジンがあれば、再読み込みを行い、ドロップゾーンへ設定し直す。
	 * @returns {Promise.<void>}
	 */
	reloadIcons()
	{
		return Promise.all(this.settings.providers.map(async provider => {
			if (provider.favicon_url || !provider.reloadFaviconURL) {
				return;
			}

			await provider.reloadFaviconURL();
			if (!provider.favicon_url) {
				return;
			}

			this.wrapper.querySelector(`li[data-name="${CSS.escape(provider.name)}"] img`).src = provider.favicon_url;
		}));
	},

	/**
	 * ドロップゾーンを初期状態に戻す。
	 * @param {boolean} [forced] - {@link DropzoneUtils.itemTypesDuringDrag}の確認を行わずに実行するなら真。
	 */
	resetDropzones(forced = false)
	{
		if (forced || this.itemTypesDuringDrag) {
			const activeValidDropzone = this.getActiveValidDropzone();
			if (activeValidDropzone) {
				activeValidDropzone.classList.remove('drop-active-valid');
			}
			this.wrapper.hidden = true;
			this.itemTypesDuringDrag = null;
			this.dragoverEventAlreadyFired = true;
		}
	},

	/**
	 * ドロップゾーンに関するスタイルシート、イベントリスナー、およびメッセージリスナーを設定する。
	 */
	setEventListeners()
	{
		// dropzone属性の代替
		// Bug 723008 – Implement dropzone content attribute <https://bugzilla.mozilla.org/show_bug.cgi?id=723008>
		this.wrapper.addEventListener('dragover', event => {
			const activeValidDropzone = this.getActiveValidDropzone();
			if (activeValidDropzone && activeValidDropzone.contains(event.target)) {
				event.preventDefault();
			}
		});

		// イベントリスナーの追加
		for (const type of this.eventTypesForWindow) {
			window.addEventListener(type, this, true);
		}

		// メッセージリスナーの追加
		window.messageManager.addMessageListener(`${ID}:dragstart`, this);
		window.messageManager.addMessageListener(`${ID}:drop-data`, this);
	},

	/**
	 * :drop(active valid)な要素にdrop-active-validクラスを追加する。
	 * @param {HTMLElement} target - :drop(active valid)か否か調べる要素。
	 */
	setActiveValidDropzone(target)
	{
		if (target.nodeType === Node.ELEMENT_NODE && this.wrapper.contains(target)) {
			// ドロップゾーンなら
			const dropzone = DOMUtils.getAttributeAsDOMTokenList(target, 'dropzone');
			if (dropzone.contains('link')
					&& Array.prototype.some.call(dropzone, type => this.itemTypesDuringDrag.indexOf(type) !== -1)) {
				// 各ドロップゾーンにポインタが載った時、
				// ドロップゾーンが受け取ることができるデータをドラッグしていれば
				target.classList.add('drop-active-valid');
			}
		}
	},

	/**
	 * イベントハンドラ。
	 * @param {Event} event
	 */
	handleEvent(event)
	{
		const target = event.target;

		switch (event.type) {
			case 'dragover':
				if (!this.dragoverEventAlreadyFired) {
					this.dragoverEventAlreadyFired = true;

					// ドラッグ開始時、すでにドロップゾーン内にカーソルがあった場合、dragenterイベントが発生しないため
					if (target.nodeType === Node.ELEMENT_NODE) {
						this.setActiveValidDropzone(target);
					}
				}
				break;

			case 'dragenter':
				/*if (event.relatedTarget) {
					const activeValidDropzone = this.getActiveValidDropzone();
					if (activeValidDropzone && !activeValidDropzone.contains(target)) {
						// 各ドロップゾーンからポインタが外れた時
						activeValidDropzone.classList.remove('drop-active-valid');
					}

					this.setActiveValidDropzone(target);
				} else {
					// ウィンドウ外からのドラッグなら
					if (this.itemTypesDuringDrag) {
						if (this.itemTypesDuringDrag.length > 0) {
							this.reloadIcons();
							this.wrapper.hidden = false;
						}
					} else {
						// ドラッグ開始なら
						if (event.isTrusted) {
							this.itemTypesDuringDrag
								= ['string:text/plain', 'file:text/*', 'file:image/*'];

							// ドロップゾーンを表示
							this.reloadIcons();
							this.wrapper.hidden = false;
						}
					}
				}*/
				// Firefox 54 におけるリグレッション (event.relatedTargetが常にnullを返すようになった) への対処
				if (this.itemTypesDuringDrag) {
					if (this.itemTypesDuringDrag.length > 0) {
						this.reloadIcons();
						this.wrapper.hidden = false;

						const activeValidDropzone = this.getActiveValidDropzone();
						if (activeValidDropzone && !activeValidDropzone.contains(target)) {
							// 各ドロップゾーンからポインタが外れた時
							activeValidDropzone.classList.remove('drop-active-valid');
						}

						this.setActiveValidDropzone(target);
					}
				} else if (this.wrapper.hidden && event.isTrusted
						&& (!event.dataTransfer.mozSourceNode
							|| event.dataTransfer.mozSourceNode.nodeType !== Node.ELEMENT_NODE
							|| !event.dataTransfer.mozSourceNode.classList.contains('tabbrowser-tab'))) {
					// ウィンドウ外からのドラッグなら
					// ドラッグ開始なら
					this.itemTypesDuringDrag = ['string:text/plain', 'file:text/*', 'file:image/*'];

					// ドロップゾーンを表示
					this.reloadIcons();
					this.wrapper.hidden = false;
				}
				break;

			case 'dragleave':
				if (this.itemTypesDuringDrag && !event.relatedTarget && !this.wrapper.hidden) {
					// ウィンドウ外へドラッグされたとき
					if (target.ownerDocument) {
						// Firefox 54 におけるリグレッション (event.relatedTargetが常にnullを返すようになった) への対処
						const win = target.ownerDocument.defaultView;
						const x = event.clientX;
						const y = event.clientY;
						/*eslint-disable yoda */
						if (0 < x && x < win.innerWidth && 0 < y && y < win.innerHeight) {
							break;
						}
						/*eslint-enable */
					}

					this.wrapper.hidden = true;
					const activeValidDropzone = this.getActiveValidDropzone();
					if (activeValidDropzone) {
						activeValidDropzone.classList.remove('drop-active-valid');
					}
				}
				break;

			case 'dragend':
				this.resetDropzones();
				gBrowser.selectedBrowser.messageManager.sendAsyncMessage(`${ID}:dragend`);
				break;

			case 'drop':
				if (this.wrapper.contains(target)) {
					// 各ドロップゾーンにドロップされた時
					event.preventDefault();
					event.dataTransfer; // 後から参照できるようにdataTransferを参照しておく
					this.dropEvent = event;
					gBrowser.selectedBrowser.messageManager.sendAsyncMessage(
						`${ID}:drop`,
						{asImage: DOMUtils.getAttributeAsDOMTokenList(target, 'dropzone').contains('file:image/*')},
					);
				} else {
					this.resetDropzones();
				}
				break;
		}
	},

	/**
	 * @param {Object} message
	 */
	async receiveMessage(message)
	{
		if (message.name.startsWith(`${ID}:`)) {
			switch (message.name.replace(`${ID}:`, '')) {
				case 'dragstart':
					if (this.itemTypesDuringDrag) {
						// ドロップゾーンが表示されたままなら
						this.resetDropzones();
					}

					this.itemTypesDuringDrag = message.data.itemTypes;
					if (this.itemTypesDuringDrag.length > 0) {
						// ドロップゾーンを表示
						this.reloadIcons();
						this.wrapper.hidden = false;
						this.dragoverEventAlreadyFired = false;
					}
					break;

				case 'drop-data': {
					let data = null;
					if (message.data.imageURL) {
						// 画像としてドロップしたとき
						data = await this.fetchBlobFromURL(message.data.imageURL);
					} else if (message.data.text !== undefined) {
						// 文字列としてドロップしたとき
						data = message.data.text;
					} else {
						// ウィンドウ外からのドロップ
						const dropzone = DOMUtils.getAttributeAsDOMTokenList(this.dropEvent.target, 'dropzone');
						if (dropzone.contains('file:image/*')) {
							// 画像ファイルとしてドロップしたとき
							const file = this.dropEvent.dataTransfer.files[0];
							if (file.type.startsWith('image/')) {
								// ドロップゾーンが受け取ることができる形式のファイルなら
								data = file;
							}
						} else {
							// 文字列としてドロップしたとき
							data = this.getTextFromDropEvent(this.dropEvent, !dropzone.contains('file:text/*'));
						}
					}
					if (data !== null) {
						this.searchDropData(
							data,
							Array.from(this.dropEvent.target.parentElement.children).indexOf(this.dropEvent.target),
							this.dropEvent,
						);
					}
					this.dropEvent = null;
					this.resetDropzones();
					break;
				}
			}
		}
	},

	/**
	 * ユーザー設定を元に、ドロップゾーンを作成する。
	 * @param {SearchProvider} provider
	 * @returns	{HTMLLIElement}
	 */
	convertFromSearchProvider(provider)
	{
		const li = document.createElementNS(DOMUtils.HTML_NS, 'li');

		// dropzone属性
		const dropzone = DOMUtils.getAttributeAsDOMTokenList(li, 'dropzone');
		dropzone.add('link');
		if (provider.image_url) {
			dropzone.add('file:image/*');
		} else {
			dropzone.add('string:text/plain');
			if ('search_url_post_params' in provider) {
				dropzone.add('file:text/*');
			}
		}
		li.setAttribute('dropzone', dropzone);

		// アイコン
		const icon = new Image(16, 16);
		icon.src = provider.favicon_url || DropzoneUtils.DEFAULT_ICON;
		li.appendChild(icon);

		// 表示名
		li.appendChild(new Text(provider.name));
		li.dataset.name = provider.name;

		return li;
	},

	/**
	 * contentプロセスで実行するスクリプトを設定する。
	 */
	setContentScript()
	{
		this.contentScriptURL = 'data:application/ecmascript;charset=UTF-8,' + encodeURIComponent(
			gatherTextUnder.toString().replace(/Node\.|HTMLImageElement/g, 'content.$&')
				+ `new ${this.contentScript.toString()}(${JSON.stringify(ID)});`,
		);
		Services.mm.loadFrameScript(this.contentScriptURL, true);
	},

	/**
	 * contentプロセスで実行するクラス。
	 * @type {Function}
	 */
	contentScript: class ContentScript {
		/**
		 * XML Binding Language (XBL) の名前空間。
		 * @access private
		 * @constant {string}
		 */
		static get XBL_NS() {return 'http://www.mozilla.org/xbl';}

		/**
		 * @param {string} id
		 */
		constructor(id)
		{
			/**
			 * @type {string}
			 */
			this.id = id;

			addMessageListener(`${this.id}:drop`, this);
			addMessageListener(`${this.id}:dragend`, this);
			addEventListener('dragstart', this, true);
		}

		/**
		 * @param {DragEvent} event
		 */
		handleEvent(event)
		{
			switch (event.type) {
				case 'dragstart':
					if (event.isTrusted) {
						// ユーザーによるドラッグなら
						/**
						 * @access private
						 * @type {DragEvent}
						 */
						this.dragstartEvent = event;
						sendAsyncMessage(`${this.id}:dragstart`, {itemTypes: this.getItemTypes(event)});
					}
					break;
			}
		}

		/**
		 * @param {Object} message
		 */
		receiveMessage(message)
		{
			if (message.name.startsWith(`${this.id}:`)) {
				switch (message.name.replace(`${this.id}:`, '')) {
					case 'drop': {
						const obj = {};
						if (this.dragstartEvent) {
							if (message.data.asImage) {
								// 画像としてドロップしたとき
								obj.imageURL = this.getImageURLFromDragstartEvent(this.dragstartEvent);
							} else {
								// 文字列としてドロップしたとき
								obj.text = this.getTextFromDragstartEvent(this.dragstartEvent);
							}
						}
						sendAsyncMessage(`${this.id}:drop-data`, obj);
						this.dragstartEvent = null;
						break;
					}

					case 'dragend':
						this.dragstartEvent = null;
						break;
				}
			}
		}

		/**
		 * ドラッグしようとしているアイテムの種類を取得する。
		 * @access private
		 * @param {DragEvent} event - dragstartイベント。
		 * @returns {string[]}
		 * @access protected
		 */
		getItemTypes(event)
		{
			const types = [];

			const target = event.target;
			const name = target.localName || target.nodeName;
			if (['a', 'img', '#text'].indexOf(name) !== -1
				|| ['input', 'textarea'].indexOf(name) !== -1 && !target.draggable
				|| target === document.documentElement && target.id === 'placesTreeBindings'
					&& target.namespaceURI === ContentScript.XBL_NS && target.localName === 'bindings') {
				// ソースノードがリンク・画像・文字列、ドラッグ不可のテキスト入力欄、またはツリー表示されているXML文書なら
				types.push('string:text/plain');
			}

			if (name === 'img' || name === 'a' && target.getElementsByTagName('img')[0]) {
				// ソースノードが画像、または画像を含むリンクなら
				types.push('file:image/*');
			}

			return types;
		}

		/**
		 * dragstartイベントから、対象の画像URLを取得する。
		 * @param {DragEvent} event
		 * @returns {?string}
		 */
		getImageURLFromDragstartEvent(event)
		{
			let url = null;

			const target = event.target;
			switch (target.localName) {
				case 'img':
					url = target.src;
					break;

				case 'a': {
					const images = target.getElementsByTagName('img');
					if (images.length === 1) {
						url = images[0].src;
					} else {
						const image = target.ownerDocument.elementFromPoint(event.clientX, event.clientY);
						url = image.localName === 'img' && target.contains(image) ? image.src : images[0].src;
					}
					break;
				}
			}

			return url;
		}

		/**
		 * dragstartイベントから、対象の文字列を取得する。
		 * @access private
		 * @param {DragEvent} event
		 * @returns {string}
		 */
		getTextFromDragstartEvent(event)
		{
			let text = '';
			let selection;
			let selectedString = '';

			const target = event.target;
			const localName = target.localName;
			const doc = target.ownerDocument;

			if ('getSelection' in doc) {
				selection = doc.getSelection();
				if (selection) {
					selectedString = selection.toString();
					if (selectedString && (localName === 'a' || target.nodeType === content.Node.TEXT_NODE)) {
						// リンクか選択範囲をドラッグしていれば
						const x = event.clientX, y = event.clientY;
						if (!this.isSuperposedCoordinateOnSelection(selection, x, y)) {
							// ドラッグ開始位置が選択範囲外なら
							let element = doc.elementFromPoint(x, y);
							if (element && (element.localName === 'a' || (element = element.closest('a')))) {
								// 選択範囲が重なったリンクの、選択範囲でない部分をドラッグしていれば
								text = gatherTextUnder(element);
							}
						}
					}
				}
			}

			if (!text && ['a', 'img'].indexOf(localName) !== -1) {
				// リンクか画像をドラッグしていれば
				if (selectedString && selection && selection.containsNode(target, true)) {
					// ソースノードが選択範囲と重なっており、
					// リンクの一部分だけが選択されている場合は、選択範囲とドラッグ開始位置が重なっていれば
					text = selectedString;
				}

				if (!text) {
					if (localName === 'img') {
						// 画像をドラッグしていれば
						text = selectedString || target.alt || target.title;
						if (!text) {
							const figcaption = DOMUtils.getFigcaption(target);
							if (figcaption) {
								text = gatherTextUnder(figcaption);
							}
						}
					} else {
						// リンクをドラッグしていれば
						text = gatherTextUnder(target);
					}
				}
			}

			return text.trim() || event.dataTransfer.getData('text/plain').trim();
		}

		/**
		 * 選択範囲と指定した座標が重なるか調べる。
		 * @access private
		 * @param {Selection} selection
		 * @param {number} x
		 * @param {number} y
		 * @returns {boolean}
		 */
		isSuperposedCoordinateOnSelection(selection, x, y)
		{
			for (let i = 0, l = selection.rangeCount; i < l; i++) {
				if (this.isSuperposedCoordinateOnRange(selection.getRangeAt(i), x, y)) {
					return true;
				}
			}
			return false;
		}

		/**
		 * rangeと指定した座標が重なるか調べる。
		 * @access private
		 * @param {Range} range
		 * @param {number} x
		 * @param {number} y
		 * @returns {boolean}
		 */
		isSuperposedCoordinateOnRange(range, x, y)
		{
			// Firefox 53時点で、Range#getClientRects() が DOMRect[] ではなく DOMRectList を返すバグを確認
			return Array.from(range.getClientRects()).some(rect => this.isSuperposedCoordinateOnRect(rect, x, y));
		}

		/**
		 * 長方形と指定した座標が重なるか調べる。
		 * @access private
		 * @param {DOMRect} rect
		 * @param {number} x
		 * @param {number} y
		 * @returns {boolean}
		 */
		isSuperposedCoordinateOnRect(rect, x, y)
		{
			return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
		}
	},

	/**
	 * contentプロセスで実行するスクリプトのURL。
	 * @returns {string}
	 * @access protected
	 */
	contentScriptURL: '',

	/**
	 * windowに追加するイベントリスナーが補足するイベントの種類。
	 * @type {string[]}
	 * @access protected
	 */
	eventTypesForWindow: ['dragover', 'dragenter', 'dragleave', 'dragend', 'drop'],

	/**
	 * ドラッグ中のアイテムの種類。
	 * ドラッグ中でなければnull。
	 * @type {?string[]}
	 * @access protected
	 */
	itemTypesDuringDrag: null,

	/**
	 * ドラッグ開始後、dragoverイベントが既に発生していれば真。
	 * @type {booelan}
	 * @access protected
	 */
	dragoverEventAlreadyFired: true,

	/**
	 * dropイベント。
	 * @type {?DragEvent}
	 * @access private
	 */
	dropEvent: null,

	/**
	 * drop-active-validクラスが付いた要素を返す。
	 * @returns {?HTMLLIElement}
	 * @access protected
	 */
	getActiveValidDropzone()
	{
		return this.wrapper.getElementsByClassName('drop-active-valid')[0];
	},

	/**
	 * ウィンドウ外からドロップされた文字列情報を取得する。
	 * @param {DragEvent} event - dropイベント。
	 * @param {boolean} [forceString] - 真が指定されていれば、常にFileインスタンスの代わりにファイル名を返す。
	 * @returns {?(string|File)}
	 * @access protected
	 */
	getTextFromDropEvent(event, forceString = false)
	{
		let dropFile = null, dropText = '';

		const files = event.dataTransfer.files;
		if (files.length > 0) {
			// ファイルをドロップしていれば
			if (!forceString) {
				for (const file of files) {
					if (BrowserUtils.mimeTypeIsTextBased(file.type)) {
						// テキストファイルなら
						dropFile = file;
						break;
					}
				}
			}

			if (!dropFile) {
				// テキスト形式でないファイルがドロップされているかforceStringが指定されていれば、ファイル名を取得する
				dropText = files[0].name;
			}
		} else {
			dropText = event.dataTransfer.getData('text/plain');
		}

		return dropFile ? dropFile : dropText.trim() || null;
	},

	/**
	 * URLからファイルを取得する。
	 * @param {string} url - ファイルのURL。
	 * @returns {Promise.<Blob>}
	 * @access protected
	 */
	fetchBlobFromURL(url)
	{
		return fetch(url, {credentials: 'include', cache: 'force-cache'}).then(response => response.blob());
	},

	/**
	 * ドロップされたデータを、ドロップゾーンに結びつけられたプロバイダで検索する。
	 * @param {(string|Blob)} data - 検索する文字列、またはファイル。
	 * @param {number} providerIndex - {@link DropzoneUtils.settings.providers}内の0から始まるインデックス。
	 * @param {DragEvent} event - どのキーを押しているか取得するためのdropイベント。
	 * @access protected
	 */
	async searchDropData(data, providerIndex, event)
	{
		const mimeType = data.type;
		if (mimeType && BrowserUtils.mimeTypeIsTextBased(mimeType) && !/^image\//.test(mimeType)) {
			// ドロップされたデータがテキストファイルなら、文字列に変換しておく
			const fileReader = new FileReader();
			fileReader.addEventListener('load', () => {
				this.searchDropData(fileReader.result, providerIndex, event);
			});
			fileReader.readAsText(data);
			return;
		}

		const provider = this.settings.providers[providerIndex];

		let url = provider.search_url || provider.image_url;
		let postData;
		if (url) {
			// ユーザー定義の検索プロバイダ
			const params = provider.search_url_post_params || provider.image_url_post_params;
			if (params) {
				// POST
				const formData = new FormData();
				for (const [name, value] of new URLSearchParams(params)) {
					formData.append(name, value.includes('{searchTerms}') ? data : value);
				}
				postData = await StringUtils.encodeMultipartFormData(formData);
			} else {
				// GET
				let encodedString;
				try {
					encodedString = TextToSubURI.ConvertAndEscape(provider.encoding, data);
				} catch (e) {
					if (e.result === Cr.NS_ERROR_UCONV_NOCONV) {
						encodedString = TextToSubURI.ConvertAndEscape(StringUtils.THE_ENCODING, data);
					} else {
						throw e;
					}
				}
				url = url.replace(/{searchTerms}/g, encodedString);
			}
		} else {
			// ブラウザに登録されている検索エンジン
			const browserSearchEngine = Services.search.getEngineByName(provider.name);
			const submission = browserSearchEngine.getSubmission(data);
			url = submission.uri.spec;
			postData = submission.postData;
		}

		this.openSearchResult(url, event, postData);
	},

	/**
	 * ユーザー設定に基づき、適切な場所で検索結果を開く。
	 * @param {string}	url
	 * @param {DragEvent} event - どのキーを押しているか取得するためのdropイベント。
	 * @param {nsIInputStream} [postData]
	 * @access protected
	 */
	openSearchResult(url, event, postData = null)
	{
		const where = this.settings.where;
		if (where === 'current') {
			openUILink(
				url,
				event,
				{ postData, triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({}) },
			);
		} else {
			openWebLinkIn(url, where, { postData });
		}
	},
};



/**
 * ポップアップ通知を表示する。
 * @param {string} message - 表示するメッセージ。
 * @param {XULElement} tab - メッセージを表示するタブ。
 * @param {string} [type] - メッセージの前に表示するアイコンの種類。「info」「warning」「error」のいずれか。
 */
function showPopupNotification(message, type = 'info')
{
	PopupNotifications
		.show(gBrowser.getBrowserForTab(gBrowser.selectedTab), ID, '【Drag & Dropzones +】' + message, null, null, null, {
			persistWhileVisible: true,
			removeOnDismissal: true,
			popupIconURL: `chrome://global/skin/icons/${type}.svg`,
		});
}



DropzoneUtils.setContentScript();

const obj = await SettingsUtils.load();

// 検索エンジンサービスの初期化を待機
await Services.search.init();

let { settings, messages } = SettingsUtils.filter(obj);

if (settings && settings.providers.length === 0) {
	messages.push(_('検索プロバイダが1つも指定されていません。'));
}

if (messages.length > 0) {
	showPopupNotification(messages.join(' / '), settings && settings.providers > 0 ? 'warning' : 'error');
}

if (!settings || settings.providers === 0) {
	const obj = await SettingsUtils.preset();
	if (settings) {
		obj.where = settings.where;
	}
	settings = SettingsUtils.filter(obj).settings;
}

DropzoneUtils.settings = settings;

// ドロップゾーンの作成
DropzoneUtils.create();
DropzoneUtils.setEventListeners();

})();
