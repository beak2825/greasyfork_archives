// ==UserScript==
// @name         Google Translate API Library
// @namespace    http://tampermonkey.net/
// @version      2024.12.24.2
// @description  Google Translate API Library for UserScripts
// @author       Yuusei
// @grant        GM_xmlhttpRequest
// @icon         https://cdn-icons-png.flaticon.com/512/9502/9502737.png
// ==/UserScript==

const GoogleTranslateAPI = (function () {
	'use strict';

	const translationCache = new Map();
	const CACHE_EXPIRY = 24 * 60 * 60 * 1000;
	const MAX_BATCH_SIZE = 128;
	const MAX_RETRIES = 3;
	const RETRY_DELAY = 1000;

	const languages = {
		auto: 'Automatic',
		af: 'Afrikaans',
		sq: 'Albanian',
		am: 'Amharic',
		ar: 'Arabic',
		hy: 'Armenian',
		az: 'Azerbaijani',
		eu: 'Basque',
		be: 'Belarusian',
		bn: 'Bengali',
		bs: 'Bosnian',
		bg: 'Bulgarian',
		ca: 'Catalan',
		ceb: 'Cebuano',
		ny: 'Chichewa',
		'zh-cn': 'Chinese Simplified',
		'zh-tw': 'Chinese Traditional',
		co: 'Corsican',
		hr: 'Croatian',
		cs: 'Czech',
		da: 'Danish',
		nl: 'Dutch',
		en: 'English',
		eo: 'Esperanto',
		et: 'Estonian',
		tl: 'Filipino',
		fi: 'Finnish',
		fr: 'French',
		fy: 'Frisian',
		gl: 'Galician',
		ka: 'Georgian',
		de: 'German',
		el: 'Greek',
		gu: 'Gujarati',
		ht: 'Haitian Creole',
		ha: 'Hausa',
		haw: 'Hawaiian',
		iw: 'Hebrew',
		hi: 'Hindi',
		hmn: 'Hmong',
		hu: 'Hungarian',
		is: 'Icelandic',
		ig: 'Igbo',
		id: 'Indonesian',
		ga: 'Irish',
		it: 'Italian',
		ja: 'Japanese',
		jw: 'Javanese',
		kn: 'Kannada',
		kk: 'Kazakh',
		km: 'Khmer',
		ko: 'Korean',
		ku: 'Kurdish (Kurmanji)',
		ky: 'Kyrgyz',
		lo: 'Lao',
		la: 'Latin',
		lv: 'Latvian',
		lt: 'Lithuanian',
		lb: 'Luxembourgish',
		mk: 'Macedonian',
		mg: 'Malagasy',
		ms: 'Malay',
		ml: 'Malayalam',
		mt: 'Maltese',
		mi: 'Maori',
		mr: 'Marathi',
		mn: 'Mongolian',
		my: 'Myanmar (Burmese)',
		ne: 'Nepali',
		no: 'Norwegian',
		ps: 'Pashto',
		fa: 'Persian',
		pl: 'Polish',
		pt: 'Portuguese',
		pa: 'Punjabi',
		ro: 'Romanian',
		ru: 'Russian',
		sm: 'Samoan',
		gd: 'Scots Gaelic',
		sr: 'Serbian',
		st: 'Sesotho',
		sn: 'Shona',
		sd: 'Sindhi',
		si: 'Sinhala',
		sk: 'Slovak',
		sl: 'Slovenian',
		so: 'Somali',
		es: 'Spanish',
		su: 'Sundanese',
		sw: 'Swahili',
		sv: 'Swedish',
		tg: 'Tajik',
		ta: 'Tamil',
		te: 'Telugu',
		th: 'Thai',
		tr: 'Turkish',
		uk: 'Ukrainian',
		ur: 'Urdu',
		uz: 'Uzbek',
		vi: 'Vietnamese',
		cy: 'Welsh',
		xh: 'Xhosa',
		yi: 'Yiddish',
		yo: 'Yoruba',
		zu: 'Zulu',
	};

	function validateLanguage(language) {
		if (!language) {
			throw new Error('Language cannot be empty');
		}
		const isoCode = getISOCode(language);
		if (!isoCode) {
			throw new Error(`Language not supported: ${language}`);
		}
		return isoCode;
	}

	function getISOCode(language) {
		if (!language) return false;
		language = language.toLowerCase();
		if (language in languages) return language;

		let keys = Object.keys(languages).filter(key => {
			if (typeof languages[key] !== 'string') return false;
			return languages[key].toLowerCase() === language;
		});

		return keys[0] || false;
	}

	function isSupported(language) {
		return Boolean(getISOCode(language));
	}

	function getCacheKey(text, options) {
		return `${text}|${options.from}|${options.to}`;
	}

	function getFromCache(text, options) {
		const key = getCacheKey(text, options);
		const cached = translationCache.get(key);
		if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
			return cached.result;
		}
		return null;
	}

	function saveToCache(text, options, result) {
		const key = getCacheKey(text, options);
		translationCache.set(key, {
			result,
			timestamp: Date.now(),
		});
	}

	async function translate(text, options = {}) {
		if (!text) throw new Error('Text cannot be empty');

		options.from = options.from || 'auto';
		options.to = options.to || 'en';

		options.from = validateLanguage(options.from);
		options.to = validateLanguage(options.to);

		const cached = getFromCache(text, options);
		if (cached) return cached;

		let baseUrl = 'https://translate.googleapis.com/translate_a/single';
		let data = {
			client: 'gtx',
			sl: options.from,
			tl: options.to,
			dt: 't',
			q: text,
		};

		let url = `${baseUrl}?` + new URLSearchParams(data).toString();

		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url: url,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
					Accept: '*/*',
				},
				timeout: 10000,
				onload: function (response) {
					try {
						if (response.status !== 200) {
							throw new Error(`HTTP Error: ${response.status}`);
						}

						const body = JSON.parse(response.responseText);

						if (!body || !Array.isArray(body) || !body[0]) {
							throw new Error('Invalid response structure');
						}

						let result = {
							text: '',
							from: {
								language: {
									didYouMean: false,
									iso: body[2] || options.from,
								},
								text: {
									autoCorrected: false,
									value: '',
									didYouMean: false,
								},
							},
							raw: body,
						};

						result.text = body[0]
							.filter(chunk => chunk && chunk[0])
							.map(chunk => decodeURIComponent(chunk[0].trim()))
							.join(' ')
							.trim();

						saveToCache(text, options, result);

						resolve(result);
					} catch (error) {
						reject(new Error('Error processing response: ' + error.message));
					}
				},
				onerror: function (error) {
					reject(new Error('Connection error: ' + error));
				},
				ontimeout: function () {
					reject(new Error('Timeout: Request took too long'));
				},
			});
		});
	}

	async function translateWithRetry(text, options = {}, maxRetries = MAX_RETRIES, delay = RETRY_DELAY) {
		let lastError;
		for (let i = 0; i < maxRetries; i++) {
			try {
				return await translate(text, options);
			} catch (error) {
				lastError = error;
				console.log(`Try ${i + 1}/${maxRetries} failed:`, error);
				if (i < maxRetries - 1) {
					await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
				}
			}
		}
		throw new Error(`Translation failed after ${maxRetries} attempts: ${lastError.message}`);
	}

	async function translateBatch(texts, options = {}) {
		if (!Array.isArray(texts)) {
			throw new Error('Texts must be an array');
		}

		const results = [];
		const chunks = [];

		// Chia nhỏ mảng texts thành các chunks có kích thước MAX_BATCH_SIZE
		for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
			chunks.push(texts.slice(i, i + MAX_BATCH_SIZE));
		}

		// Dịch từng chunk
		for (const chunk of chunks) {
			const chunkResults = await Promise.all(
				chunk.map(text => translateWithRetry(text, options).catch(error => ({ error })))
			);
			results.push(...chunkResults);
		}

		return results;
	}

	function clearExpiredCache() {
		const now = Date.now();
		for (const [key, value] of translationCache.entries()) {
			if (now - value.timestamp > CACHE_EXPIRY) {
				translationCache.delete(key);
			}
		}
	}

	setInterval(clearExpiredCache, 60 * 60 * 1000);

	return {
		translate,
		translateWithRetry,
		translateBatch,
		languages,
		getISOCode,
		isSupported,
		clearExpiredCache,
	};
})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = GoogleTranslateAPI;
}
