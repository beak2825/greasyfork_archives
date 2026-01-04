// ==UserScript==
// @name         Image Host Helper
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.91.7
// @description  Directly upload local / rehost remote images or galleries to whatever supported image host by dropping/pasting them to target field
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsSAAALEgHS3X78AAAHTklEQVR4nO1aCUwUVxj+38zuyuwuRGGByHIpqEXFo1hj1SZiW1MarVqPREgkattUadPUI4iNpGrVxph6VJR4Rm3UlhrsZaBnqtXEo1qqxqJFZGFBTmHZe2fm9c3CrhzLsbtDRtP9wsLO9b/vffPPfzxGhjGG/zNkUhOQGgEBpCYgNQICSE1AagQEkJqA1AgIIDUBqREQQGoCUiMggNQEpEZAADGNFetNk77Qc5mXHuPUR3aItfFISZpt2nWcAmBVNG4exkBpWjj1TbqWPp0cpqwSk4O3EEWAa3WmEbml/ObiRn4B5pEcKATQ9tMJPBnPwCFNSStoSlrwtLwKx9rl0a2f5yTKPosMZsxicPEWfguQ/69xQfZdbr/BgSKARoDo3s9Hrl/kvFYORewpx1t+bbSnHR6Hl0+OUJb6y8db+CXAJ3eM7+Te4/dhhOR9TdwTULsQt1rR1DnXHMVnnjfNSR2quuUPJ2/hswD5940Lcu9xeWTyMtTV170EIsGhzo7iMm6yhUVy88xxGqWu3miRsRgYOQKLRs2w/o3QM3wS4Hq9OTH7Hy5fjMm7IIhQY0MJ8/5kz2sUhoZHNhzmwChkEIUNEQpHw1g1XH9ZQ/+UqqEuRwUzRnFG9VGAjaXcJvLMa3xx+94giFBugTHlQjh0K4uggmxfewwzjlVxa2OCuNJlMez+VfGyw5Fq/wOn1wKQVJfyYwO/ENEi3foucM67q+kO25U2GLX5Hr+noMa+ZM8YPuvVKNUNf8bzWoCTem4pzyOF2He/v2gLnAjuGmHKvOvsL/vHGpdkDlcX+WrPKwHqjBblhSZIEyoaqSE8LmYeDX73FvdliMw4Z36s+oIvdrwSoMyE46ptEN/NRX2E638yvgZS4Torj0Ky7nBHk0PMUxMHK+u8teGVADorH83xWI4o/xXApCwcFYK4RjumG2x+iCBkDwtK2HafXXf0BVjn7fVeCdDKIgVgcSYfzSAoelFF/9XMwaKrZmCJXZ9TKolHBY/winVNlp1JoUytN5f2W4Amk4WpsfIaf91fcHs1IXwyhYF4JeX8bB49CDbctndom7yDQMnIoiF5Dx0rFtu5H9Q01RwdhB5FBDO2vq7tU4CzOuPM03o+/UoLfolUa1rkRwAUHnmKKLBnPAMzwp8MvX5kEIkvPH+k3EH5ml4pwiuvAm/N03FbFBRnilRA1ZTBjksZWvrE3BjVxZ6u61GAK6TDI03Ozt+b8BtOt++hw/MKHIbsUUGwPE7Rabdgc3cyQz0wYfitjuuzofIEQVwhNpG/lB1DcKUVkiqrIamghl32ykPD2U+TZBtSNMqyrtd5FODUQ+OsrFvcsWYWRQkTFyPoY1LYL46Vwxbi7p6gliHnY/HyH2YoNfLgq6ehjl9oQRhE/1wPi2e1OKYdTDalL4hTdUqX3QQ4pzNNX1HCnbFiNMQfd+8IzAFM1sjgAHH93jxcy1BwYhIDr182QaPD98zQEU4TRIgmFmkzS9gClcw0+zWt6prreCcBHraYQ9+/wx4huVW8yZOIr1W23d1QRd8zmjyEhvwJDGRctwBxZVFEECDYMXEoYtVt9vDFYMt0bQjTKuzvJMDeci6rygIjxSpzhYg/hPSzZ8hdHanuv6ILtXKotmFY87cVOHGoOOFstkxo3P4KdsXWZNgt7HMLUNJgjiqsxekgQpHjHpB8lHLAByocaG+53bm9bXQQJKg8i3Gu2gGnKh1OojwRT05uBMeLRqcNxPZXpGboJsAhHbtMb4PhYrmcE8SW3oLRqQqHe9fqBEwE8Hz6zRYOCnRCPUC1qUf5mXV64KSzQKJr0y1AYS2/iMWUwvNVfoznjsbtc+plRvL2Tm8gO01hCAcGdypyC1BtpcaLFfieAbhvg1sAFY11ZoxipeEjHdwCpIbB+fMN8Db2uSJ/dkAeQ/ciq1uAt2LoY5eb+flNLEQOzGLX0wEhNYcpoMa17RZgbqz66nS9oejbGsgcSB+Q9xJnBmiZsTNIWp0Zir53bXYqhD6Mp3cW1bKLSMZWDgQXweYdAw8mEoYxPHlFV/g2iPhljRUPQN57AuHuMzJs+CBetsu1r5MAM4aqbq9JMHy0/T7ehWlxmiAXBFvCRDNvWEhT2P395LYUiUCM1SZPcI5Iqqv1I6jsKZHK+6793ZqhbckhuxvshtBDFXgjpvxYpekBztLWg1Hcfmwgpu/Um7j+e8OoTbljgvM7HvPYDh9MCckdxrRWby/jP251oEhnRSZWUyKOmX7BNfHBClyzMZHKWf1c8PGu5/S4IJIzOjg/LcJ8Pr+CXVlcj+dW29Gw9grqWUgSmFSVVm0QfpAWjgpXxskPjg1TVno6sdclsQkapS5fAzk36037jlfxGd/Vsm9WWXACjyjNwPD2HxTmq+IZKJs9lC5cqpV9PV6j0vd2fr8WRSeGq/QTw2EHaZ92iEPz6UHgHSGpCUiNgABSE5AaAQGkJiA1AgJITUBqBASQmoDUCAggNQGpERBAagJS4z/F0X/2U+WfagAAAABJRU5ErkJggg==
// @author       Anakunda
// @copyright    2020-24, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @match        https://passthepopcorn.me/*
// @match        https://redacted.sh/*
// @match        https://orpheus.network/*
// @match        https://broadcasthe.net/*
// @match        https://notwhat.cd/*
// @match        https://dicmusic.club/*
// @match        https://dicmusic.com/*
// @match        https://*/torrents.php?id=*
// @match        https://*/artist.php?id=*
// @match        https://*/artist.php?action=edit&artistid=*
// @match        https://*/reportsv2.php?action=report&id=*
// @match        https://*/forums.php?action=new*
// @match        https://*/forums.php?*action=viewthread*
// @match        https://*/requests.php?action=view*
// @match        https://*/collages.php?id=*
// @match        https://*/collages.php?page=*&id=*
// @match        https://*/collages.php?action=edit&collageid=*
// @match        https://*/collages.php?action=comments&collageid=*
// @match        https://*/collages.php?action=new
// @match        https://*/collage.php?id=*
// @match        https://*/collage.php?page=*&id=*
// @match        https://*/collage.php?action=edit&collageid=*
// @match        https://*/collage.php?action=comments&collageid=*
// @match        https://*/collage.php?action=new
// @match        http*://tracker.czech-server.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/Anakunda/xhrLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libCtxtMenu.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/progressBars.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/imageHostUploader.min.js
// @downloadURL https://update.greasyfork.org/scripts/401743/Image%20Host%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/401743/Image%20Host%20Helper.meta.js
// ==/UserScript==

'use strict';

const previewDelay = GM_getValue('preview_delay', 12);
const amEntityParser = /^(?:https?):\/\/(?:[\w\%\-]+\.)*apple\.com\/(?:\S+\/)?(album|artist|playlist)\/(?:[\w\%\-]+\/)?(?:id)?(\d+)\b/i;
const itunesImageMax = [/\/(\d+x\d+)\w*\.(\w+)$/, '/100000x100000-999.' +
	(GM_getValue('apple_get_png_cover', false) ? 'png' : '$2')];
const dzrEntityParser = /^(?:https?):\/\/(?:[\w\%\-]+\.)*deezer\.com\/(?:\S+\/)?(album|artist|track|comment|playlist|radio|user)\/(\d+)\b/i;
const dzrImageMax = GM_getValue('deezer_get_png_cover', false) ? [/\/(\d+x\d+)(?:\-\d+)*\.\w+$/, '/1400x1400.png']
	: [/\/(\d+x\d+)(?:\-\d+)*(?=\.\w+$)/, '/1400x1400-000000-' + (parseInt(GM_getValue('deezer_jpeg_quality')) || 100) + '-0-0'];
const discogsOrigin = 'https://www.discogs.com';
const discogsKey = GM_getValue('discogsKey', 'LWiNvIWBobGMRhfSCAiC');
const discogsSecret = GM_getValue('discogsSecret', 'HAQUKFmebpCSLyRNwjmSgOMgbnxsVQcp');
const lfmApiKey = GM_getValue('lfmApiKey', '920db0d2f86108f2fbe1917b53d63858');

function getDiscogsImageMax(imageUrl) {
	if (!httpParser.test(imageUrl)) return Promise.reject('Image URL is not valid');
	if (imageUrl.endsWith('/images/spacer.gif')) return Promise.reject('Dummy image (placeholder)');
	const matches = [
		/^(?:https?):\/\/(?:(?:img|i)\.discogs\.com)\/.+\/([\w\%\-]+\.\w+)\b(?:\.\w+)*$/i,
	].map(rx => rx.exec(imageUrl));
	if (matches[0] != null) return verifyImageUrl(discogsOrigin + '/image/' + matches[0][1]).catch(reason => imageUrl);
	return Promise.resolve(imageUrl);
}

function getDeezerImageMax(imageUrl) {
	if (!httpParser.test(imageUrl)) return Promise.reject('invalid image URL');
	const dzrImgResParser = /\/(\d+x\d+)(?:\-\d+)*\.(\w+)$/;
	let ext = dzrImgResParser.exec(imageUrl);
	if (ext != null) ext = GM_getValue('deezer_get_png_cover', false) ? 'png' : ext[2]; else {
		console.warn('Unscalable Deezer image, returning unchanged:', imageUrl);
		return Promise.resolve(imageUrl);
	}
	const urlByResolution = resolution => imageUrl.replace(dzrImgResParser, '/' + resolution + 'x' + resolution) +
		(/^j(?:pe?g|fif)$/i.test(ext) ? `-000000-${parseInt(GM_getValue('deezer_jpeg_quality')) || 100}-0-0.${ext}` : '.' + ext);
	const deezerHighestResolution = Math.max(parseInt(GM_getValue('deezer_highest_resolution')) || 1500, 1200);
	const defaultMax = (res = deezerHighestResolution) => verifyImageUrl(urlByResolution(res)).catch(reason => imageUrl);
	const resolutions = [/*1200, */1400, 1425, 1440, 1500, 1600, 1800, 1920].filter(size => size <= deezerHighestResolution);
	return Math.max(...resolutions) > 1400 ? Promise.all(resolutions.map(res => new Promise(function(resolve, reject) {
		const img = document.createElement('img');
		img.onload = load => { resolve(load.target.naturalWidth * load.target.naturalHeight) };
		img.onerror = (message, source, lineno, colno, error) => { reject(message) };
		img.src = imageUrl.replace(dzrImgResParser, '/' + res + 'x' + res + '.png');
	}).catch(reason => -Infinity))).then(function(pixTotals) {
		let maxArea = Math.max(...pixTotals);
		if (maxArea <= 0) {
			console.warn('Deezer: no max variant returns valid image', pixTotals, imageUrl);
			return Promise.reject('all size variants failed to load'); //defaultMax()
		}
		return urlByResolution(resolutions[pixTotals.indexOf(maxArea)]);
	}) : defaultMax(deezerHighestResolution);
}

function logFail(message, timeout = 30) {
	if (!message) return;
	let console = document.getElementById('ihh-console');
	if (console == null) {
		console = document.createElement('DIV');
		console.id = 'ihh-console';
		console.style = `
position: fixed; bottom: 20px; right: 20px; width: fit-content; max-width: 66%; max-height: 66%; z-index: 10000001;
padding: 10px; overflow-y: auto; overscroll-behavior-y: none; scrollbar-gutter: stable;
border: solid lightsalmon 4px;
color: #c00; background-color: antiquewhite; opacity: 1;
font: 600 10pt "Segoe UI", Verdana, sans-serif; text-align: left; line-height: 1em;
transition: opacity 1000ms linear; -webkit-transition: opacity 1000ms linear;
`;
		document.body.append(console);
	} else if ('hTimer' in console) {
		if (console.hTimer) clearTimeout(console.hTimer);
		console.style.opacity = 1;
	}
	const entry = document.createElement('DIV');
	entry.class = 'ihh-console-entry';
	entry.style = 'display: block;';
	if (console.childElementCount > 0) entry.style.marginTop = '3pt';
	entry.textContent = message;
	console.append(entry);
	console.scrollTop = console.scrollHeight;
	if (timeout > 0) console.hTimer = setTimeout(function(elem) {
		elem.style.opacity = 0;
		elem.hTimer = setTimeout(elem => { elem.remove() }, Math.min(timeout, 1) * 1000, elem);
	}, Math.max(timeout - 1, 1) * 1000, console);
}

let cheveretoCustomHosts = GM_getValue('chevereto_custom_hosts');
if (cheveretoCustomHosts) {
	if (!Array.isArray(cheveretoCustomHosts)) try {
		cheveretoCustomHosts = JSON.parse(cheveretoCustomHosts);
		if (Array.isArray(cheveretoCustomHosts)) GM_setValue('chevereto_custom_hosts', cheveretoCustomHosts)
	} catch(e) { console.warnd(e) }
	if (Array.isArray(cheveretoCustomHosts)) for (let siteDef of cheveretoCustomHosts)
		if (siteDef.host_name && siteDef.alias) {
			const key = siteDef.alias.replace(nonWordStripper, '').toLowerCase();
			imageHostHandlers[key] = new Chevereto(siteDef.host_name, siteDef.alias, siteDef.types, siteDef.size_limit, {
				sizeLimitAnonymous: siteDef.size_limit_anonymous,
				configPrefix: siteDef.config_prefix,
				apiEndpoint: siteDef.api_endpoint,
				apiFieldName: siteDef.api_field_name,
				apiResultKey: siteDef.api_result_key,
				jsonEndpoint: siteDef.json_endpoint,
			});
		} else console.warn('Incomplete Chevereto custom site definition (excluded from chaining):', siteDef);
	else {
		console.warn('chevereto_custom_hosts invalid format (', cheveretoCustomHosts, ')');
		//GM_deleteValue('chevereto_custom_hosts');
	}
}
console.log('Image host handlers:', imageHostHandlers);

PTPimg.prototype.setSession = function() {
	return this.apiKey ? Promise.resolve(this.apiKey) : globalXHR(this.origin).then(({document}) => {
		var apiKey = document.getElementById('api_key');
		if (apiKey == null) {
			let counter = GM_getValue('ptpimg_reminder_read', 0);
			if (counter < 3) {
				alert(`
${this.alias} API key could not be captured. Please login to ${this.origin}/ and redo the action.
If you don\'t have PTPimg account or don\'t want to use it, consider to remove PTPimg from
'upload_hosts' and 'rehost_hosts' storage entries, and all sites' local hostlists where does it appear.
`);
				GM_setValue('ptpimg_reminder_read', ++counter);
			}
			return Promise.reject('API key not configured');
		} else if (!(this.apiKey = apiKey.value)) return Promise.reject('assertion failed: empty PTPimg API key');
		GM_setValue('ptpimg_api_key', this.apiKey);
		Promise.resolve(this.apiKey)
			.then(apiKey => { alert(`Your PTPimg API key [${apiKey}] was successfully configured`) });
		return this.apiKey;
	});
}

const generalImgHosts = [
	'ImgBB', 'PixHost', 'ImgBox', 'Slowpoke', 'PostImage', 'Gifyu',
	'Ra', 'Abload', 'VgyMe', 'GeekPic', 'LightShot', 'ImgURL', 'Radikal', 'Z4A', 'PicaBox', 'PimpAndHost', 'SMMS',
	'PomfCat', 'CasImages', 'CubeUpload', 'GooPics', 'ImageBan', 'UuploadIr', 'LinkPicture',
	'Imgur', 'Catbox', 'ImageVenue', 'GetaPic', 'FastPic', 'SVGshare',
];
['upload_hosts', 'rehost_hosts'].forEach(propName => { if (!GM_getValue(propName))
	GM_setValue(propName, ['PTPimg'].concat(generalImgHosts).join(', ')) });
[
	['passthepopcorn.me', [
		'PTPimg', 'ImgBB', 'PixHost', 'ImgBox', 'Slowpoke', 'Gifyu',
		'Ra', 'Abload', 'VgyMe', 'GeekPic', 'LightShot', 'ImgURL', 'Radikal', 'Z4A', 'PicaBox', 'PimpAndHost', 'SMMS',
		'PomfCat', 'CasImages', 'CubeUpload', 'GooPics', 'ImageBan', 'UuploadIr',
		'Catbox', 'ImageVenue', 'GetaPic',
	]],
	['notwhat.cd', ['NWCD']],
	['forum.mobilism.org', ['Mobilism'].concat(generalImgHosts)],
	['forum.mobilism.me', ['Mobilism'].concat(generalImgHosts)],
].forEach(hostDefaults => { if (!GM_getValue(hostDefaults[0])) GM_setValue(hostDefaults[0], hostDefaults[1].join(', ')) });

var imageHosts = new ImageHostManager(logFail,
	GM_getValue(document.domain) || GM_getValue('upload_hosts'),
	GM_getValue(document.domain) || GM_getValue('rehost_hosts'));

const queryAppleAPI = (endPoint, params, market = 'us') => endPoint ? (function() {
	const configValidator = config => config && config.MEDIA_API && config.MEDIA_API.token
		&& (!config.timeStamp || config.timeStamp + 7 * 24 * 60*60*1000 >= Date.now() + 30 * 1000);
	if ('appleMusicDesktopConfig' in localStorage) try {
		var config = JSON.parse(localStorage.getItem('appleMusicDesktopConfig'));
		if (!configValidator(config)) throw 'Expired or incomplete cached Apple Music desktop environment';
		console.info('Re-using cached Apple Music desktop environment:', config);
		return Promise.resolve(config);
	} catch(e) {
		console.info(e, localStorage.appleMusicDesktopConfig);
		localStorage.removeItem('appleMusicDesktopConfig');
	}
	const timeStamp = Date.now();
	return globalXHR('https://music.apple.com/').then(function({document}) {
		if ((config = document.head.querySelector('meta[name="desktop-music-app/config/environment"][content]')) != null) try {
			(config = JSON.parse(decodeURIComponent(config.content))).timeStamp = timeStamp;
			if (configValidator(config)) return config;
		} catch(e) { console.warn('Invalid Apple Music desktop environment format:', e, config.content) }
		if ((config = document.head.querySelector('script[type="module"][src]')) != null)
			return globalXHR(new URL(config.getAttribute('src'), 'https://music.apple.com'), { responseType: 'text' }).then(({responseText}) =>
				(config = /\b(?:const\s+kd\s*=\s*['"]([^\s'"]{64,}?)|\w+\s*=\s*['"]([^\s'"]{268}))['"]/.exec(responseText)) != null
					&& configValidator(config = {
						MEDIA_API : { token: config[1] || config[2] },
						timeStamp: timeStamp,
					}) ? config : Promise.reject('Missing Apple Music OAuth2 token'));
		return Promise.reject('Missing Apple Music OAuth2 token');
	}).then(function(config) {
		console.info('Apple Music OAuth2 token successfully extracted:', config.MEDIA_API.token);
		localStorage.setItem('appleMusicDesktopConfig', JSON.stringify(config));
		return config;
	});
})().then(function request(config) {
	if (!config.retryCounter) config.retryCounter = 0;
	let url = config.MUSIC && config.MUSIC.BASE_URL || 'https://amp-api.music.apple.com/v1';
	url = new URL(`${url}/catalog/${market || 'us'}/${endPoint.replace(/^\/+|\/+$/g, '')}`);
	if (params) url.search = new URLSearchParams(params);
	url.searchParams.set('omit[resource]', 'relationships,views,meta,autos');
	url.searchParams.set('l', config.i18n && config.i18n.defaultLocale || 'en-us');
	url.searchParams.set('platform', 'web');
	return globalXHR(url, {
		responseType: 'json',
		headers: {
			Referer: 'https://music.apple.com/',
			Origin: 'https://music.apple.com',
			Host: url.hostname,
			Authorization: 'Bearer ' + config.MEDIA_API.token,
		},
	}).then(({response}) => response, function(reason) {
		let status = /^HTTP error (\d+)\b/.exec(reason);
		if (status != null) status = parseInt(status[1]);
		if ([400, 401, 403].includes(status)) {
			localStorage.removeItem('appleMusicDesktopConfig');
			if (config.retryCounter++ <= 0) return request(config);
			alert('Apple Music request problem:\n' + reason + '\n(retry with new token)');
			//return queryAppleAPI(endPoint, params);
		}
		return Promise.reject(reason);
	});
}) : Promise.reject('Endpoint is missing');

const tidalAccess = {
	apiBase: 'https://api.tidal.com/v1',
	clientId: GM_getValue('tidal_clientid', localStorage.getItem('tidalClientId')
		|| 'zU4XHVVkc2tDPo4t' || '7m7Ap0JC9j1cOM3n'),
	clientSecret: GM_getValue('tidal_clientsecret', localStorage.getItem('tidalClientSecret')
		|| 'VJKhDFqJPqvsPVNBV6ukXTJmwlvbttP7wlMlrc72se4=' || 'vRAdA108tlvkJpTsGZS8rGZ7xTlbJ0qaZ2K9saEzsgY='),
	auth: null,

	authorize: function() {
		const oAuth2base = 'https://auth.tidal.com/v1/oauth2',
					devAuthEndpoint = oAuth2base + '/device_authorization',
					tokenEndpoint = oAuth2base + '/token',
					scopes = ['r_usr', 'w_usr', 'w_sub'],
					oAuth2timeReserve = 30; // reserve this time (s) for upcoming authorized request
		const isTokenValid = accessToken => typeof accessToken == 'object' && accessToken.token_type
			&& accessToken.access_token && accessToken.expires_at >= Date.now() + oAuth2timeReserve * 1000;
		const isSessionValid = session => session && typeof session == 'object' && session.userId > 0 && session.sessionId;
		const authMethods = {
			'SessionId': () => Promise.reject('Method removed'),
			'DeviceToken': () => Promise.reject('Method disabled'), //Promise.resolve([undefined, { 'token': this.clientId }]),
			'OAuth2': () => (function() {
				if ('tidalAccessToken' in localStorage) try {
					var accessToken = JSON.parse(localStorage.getItem('tidalAccessToken'));
					if (isTokenValid(accessToken)) return Promise.resolve(accessToken);
				} catch(e) { localStorage.removeItem('tidalAccessToken') }
				if (!this.clientId || !this.clientSecret)
					return Promise.reject('Tidal credentials not configured (OAuth2-deviceFlow)');
				let timeStamp;
				return (accessToken && accessToken.refresh_token ? (function() {
					timeStamp = Date.now();
					return globalXHR(tokenEndpoint, { responseType: 'json' }, new URLSearchParams({
						grant_type: 'refresh_token',
						refresh_token: accessToken.refresh_token,
						client_id: this.clientId,
						client_secret: this.clientSecret,
					})).then(({response}) => {
						if (!response.refresh_token) response.refresh_token = accessToken.refresh_token;
						return response;
					});
				}).call(this) : Promise.reject('Cached token not available')).then(response => {
					if (typeof response != 'object') throw 'invalid response';
					console.assert(timeStamp > 0, 'timeStamp > 0');
					const tzOffset = new Date().getTimezoneOffset() * 60 * 1000;
					accessToken = response;
					if (!accessToken.timestamp) accessToken.timestamp = timeStamp;
					if (!accessToken.expires_at) accessToken.expires_at = accessToken.timestamp +
						(accessToken.expires_in_ms || accessToken.expires_in * 1000);
					if (!isTokenValid(accessToken)) {
						console.warn('Ivalid Tidal token received:', accessToken);
						return Promise.reject('invalid token received');
					}
					localStorage.setItem('tidalAccessToken', JSON.stringify(accessToken));
					return accessToken;
				});
			}).call(this).then(accessToken => [{ Authorization: `${accessToken.token_type} ${accessToken.access_token}` }]),
		};
		const authSequence = [/*'SessionId', 'DeviceToken'*/];
		authSequence['tidalAccessToken' in localStorage ? 'unshift' : 'push']('OAuth2');
		return (this.auth || (this.auth = (function tidalAuth(index = 0) {
			const method = authMethods[authSequence[index]];
			if (typeof method == 'function') return method.call(this).catch(reason => {
				console.warn('Tidal ' + authSequence[index] + ' auth metod failed:', reason);
				return tidalAuth.call(this, index + 1);
			});
			//this.auth = null;
			localStorage.setItem('tidalLoginSuccess', false);
			return Promise.reject('all auth methods failed');
		}).call(this)));
	},
	requestAPI: function(endPoint, params, countryCode = 'US') {
		if (!endPoint) return Promise.reject('No API endpoint');
		const weakRequest = /^(?:search)\//i.test(endPoint);
		return (function apiCall() {
			return this.authorize().then(credentials => {
				if ('tidalLoginSuccess' in localStorage) localStorage.removeItem('tidalLoginSuccess');
				setTimeout(() => { this.auth = null }, 5000);
				return globalXHR(this.apiBase + '/' + endPoint + '?' + new URLSearchParams(Object.assign({ }, params || { }, {
					deviceType: 'BROWSER',
					locale: 'en_US',
					countryCode: countryCode,
				}, credentials[1] || { })).toString(), {
					responseType: 'json',
					headers: credentials[0],
				}).then(({response}) => response, reason => {
					if (!/^(?:HTTP error (401))\b/i.test(reason) || !('tidalAccessToken' in localStorage))
						return Promise.reject(reason);
					localStorage.removeItem('tidalAccessToken');
					if (weakRequest) return Promise.reject(reason);
					this.auth = null;
					return apiCall.call(this);
				});
			});
		}).call(this);
	},
};

const mixcloudQuery = (query, variables) => ('mixcloudCsrfToken' in sessionStorage ?
		Promise.resolve(sessionStorage.getItem('mixcloudCsrfToken')) : globalXHR('https://www.mixcloud.com/', { method: 'HEAD' }).then(function(response) {
	let csrfToken = /^set-cookie:.*\b(?:csrftoken)\s*=\s*(\w+)\b/im.exec(response.responseHeaders);
	if (csrfToken != null) csrfToken = csrfToken[1]; else return Promise.reject('No CSRF token returned');
	sessionStorage.setItem('mixcloudCsrfToken', csrfToken);
	return csrfToken;
})).then(csrfToken => globalXHR('https://www.mixcloud.com/graphql', {
	responseType: 'json',
	headers: { 'X-CSRFToken': csrfToken },
}, { query: query || { }, variables: variables || { } })).then(({response}) => response.data);

const getAmazonCfg = (url = 'https://www.amazon.com/') => globalXHR(url = new URL(url), { headers: { 'User-Agent': navigator.userAgent } }).then(function(response) {
	let preConnect = response.document.head.querySelector('link[rel="preconnect"]');
	//preConnect = 'https://na.web.skill.music.a2z.com/'
	if (preConnect != null) preConnect = preConnect.href; else throw 'Assertion failed: preConnect != null';
	for (var appConfig of response.document.head.getElementsByTagName('SCRIPT'))
		if ((appConfig = /^\s*(?:window\.amznMusic)\s*=\s*(\{[\S\s]+\});\s*$/.exec(appConfig.text)) != null) try {
			appConfig = eval('(' + appConfig[1] + ')').appConfig;
			break;
		} catch (e) { console.warn(e) }
	if (!appConfig) throw 'Assertion failed: amznMusic != null';
	sessionStorage.setItem('amznAppConfig', JSON.stringify(appConfig));
	return {
		urlBase: preConnect,
		headers: {
			//'User-Agent': UA,
			'Referer': url.href,
			'x-amzn-authentication': JSON.stringify({
				interface: 'ClientAuthenticationInterface.v1_0.ClientTokenElement',
				accessToken: appConfig.accessToken,
			}),
			'x-amzn-request-id': 'f4a75e51-e7ef-4080-986a-4041738b1198',
			'x-amzn-session-id': appConfig.sessionId,
			'x-amzn-timestamp': Date.now(),
			'x-amzn-page-url': url.href,
			'x-amzn-csrf': JSON.stringify({
				interface: 'CSRFInterface.v1_0.CSRFHeaderElement',
				token: appConfig.csrf.token,
				timestamp: appConfig.csrf.ts,
				rndNonce: appConfig.csrf.rnd,
			}),
			'x-amzn-application-version': appConfig.version,
			'x-amzn-currency-of-preference': 'USD' || appConfig.currencyOfPreference,
			'x-amzn-device-family': 'RetailWebPlayer.web',
			'x-amzn-device-model': 'WEBPLAYER',
			'x-amzn-device-type': appConfig.deviceType,
			'x-amzn-device-id': appConfig.deviceId,
			'x-amzn-device-language': 'en_US' || appConfig.displayLanguage,
			'x-amzn-device-time-zone': 'Etc/UTC',
			'x-amzn-os-version': '1.0',
			'x-amzn-device-width': 1920,
			'x-amzn-device-height': 1080,
			'x-amzn-user-agent': navigator.userAgent,
			'x-amzn-affiliate-tags': '',
			'x-amzn-ref-marker': '',
			'x-amzn-music-domain': url.hostname,
			'x-amzn-referer': url.href,
			'x-amzn-page-url': url.href,
			'x-amzn-weblab-id-overrides': '',
			'x-amzn-video-player-token': '',
			'x-amzn-feature-flags': 'hd-supported',
		},
	};
	return Promise.reject('Config could not be extracted');
});

function imagePreview(imgUrl, size) {
	if (previewDelay <= 0) return;
	let div = document.getElementById('image-preview');
	if (div != null) document.body.removeChild(div);
	if (!httpParser.test(imgUrl)) return;
	div = document.createElement('div');
	div.id = 'image-preview';
	div.style = 'position: fixed; bottom: 20px; right: 20px; border: thin solid silver; ' +
		'background-color: #8888; padding: 10px; opacity: 0; transition: opacity 1s ease-in-out; z-index: 999999999;';
	const cleanUp = function(div) {
		if (div.parentNode == null) return;
		div.style.opacity = 0;
		setTimeout(div => { document.body.removeChild(div) }, 1000, div);
	};
	div.ondblclick = evt => { cleanUp(evt.currentTarget) };
	let img = document.createElement('img');
	img.style = 'width: 225px;';
	img.onload = function(evt) {
		if (evt.currentTarget.parentNode.parentNode == null) document.body.append(evt.currentTarget.parentNode);
		setTimeout(div => { div.style.opacity = 1 }, 0, evt.currentTarget.parentNode);
		setTimeout(cleanUp, (previewDelay || 12) * 1000, evt.currentTarget.parentNode);
		if (!evt.currentTarget.naturalWidth || !evt.currentTarget.naturalHeight) return; // invalid image
		let info = document.createElement('div');
		info.id = 'image-info';
		info.style = 'text-align: center; background-color: #29434b; padding: 5px; color: white;' +
			'font: 500 10pt "Segoe UI", Verdana, sans-serif;';
		evt.currentTarget.parentNode.append(info);
		const resolution = evt.currentTarget.naturalWidth + '×' + evt.currentTarget.naturalHeight;
		(size > 0 ? Promise.resolve(size) : size instanceof Promise ? size : getRemoteFileSize(imgUrl)).then(function(size) {
			if (!(size >= 0)) throw 'invalid size';
			let imageSizeLimit = GM_getValue('image_size_reduce_threshold'),
					html = resolution + ' (<span id="image-size"';
			if (imageSizeLimit > 0 && size > imageSizeLimit * 2**10) html += ' style="color: red;"';
			html += '>' + formattedSize(size) + '</span>)';
			info.innerHTML = html;
		}).catch(reason => { info.textContent = resolution });
	};
	img.onerror = evt => { console.warn('Image source couldnot be loaded:', evt, imgUrl) };
	img.src = imgUrl;
	div.append(img);
}

function checkImageSize(image, elem = null, param) {
	let imageSizeLimit = GM_getValue('image_size_reduce_threshold');
	if (!(imageSizeLimit > 0)) return Promise.resolve(image);
	if (!(elem instanceof HTMLElement)) elem = null;
	if (elem != null) elem.disabled = true;
	return (image instanceof File ? Promise.resolve(image.size) : param > 0 ? Promise.resolve(param)
			: param instanceof Promise ? param : getRemoteFileSize(image)).then(function(size) {
		if (size <= imageSizeLimit * 2**10) return image;
		const haveRhHosts = Array.isArray(imageHosts.rhHostChain) && imageHosts.rhHostChain.length > 0;
		if (!haveRhHosts && !GM_getValue('force_reduce', true)) return Promise.reject('no hosts to upload result');
		return reduceImageSize(image, GM_getValue('image_reduce_maxheight', 2160),
				GM_getValue('image_reduce_jpegquality', 90), typeof param == 'function' ? param : null).then(function(output) {
			if (elem != null) {
				elem.value = output.uri;
				if (image instanceof File) imagePreview(output.uri, output.size);
			}
			Promise.resolve(output.size).then(reducedSize => {
				console.log('cover size reduced by ' + Math.round((size - reducedSize) * 100 / size) +
					'% (' + Math.ceil(size / 2**10) + ' → ' + Math.ceil(reducedSize / 2**10) + ' KiB)');
			});
			return haveRhHosts ? output.uri : forcedRehost(output.uri);
		});
	}).catch(function(reason) {
		logFail('failed to get remote image size or optimize the image: ' + reason + ' (size reduction was not performed)');
		return image;
	}).then(function(finalResult) {
		if (elem != null) {
			if (httpParser.test(finalResult)) {
				if (finalResult != elem.value) elem.value = finalResult;
			} else elem.value = '';
			elem.disabled = false;
		}
		return finalResult;
	});
}

// Export public API
if (typeof unsafeWindow == 'object') {
	Object.defineProperty(unsafeWindow, 'imageHostHelper', { value: Object.freeze({
		uploadFiles: function uploadImages(files, checkSize = true, preview = false) {
			if (files instanceof Blob) files = [files];
			if (!Array.isArray(files)) return Promise.reject('Invalid parameter (files)');
			if ((files = files.filter(file => file instanceof File && file.type.startsWith('image/'))).length <= 0)
				return Promise.reject('Invalid parameter (no valid images passed)');
			console.time('Image uploader');
			return checkSize || preview ? Promise.all(files.map(file => (checkSize ? checkImageSize(file).catch(function(reason) {
				logFail('Downsizing of source image not possible (' + reason + '), uploading original size');
				return file;
			}) : Promise.resolve(file)).then(function(result) {
				const uploader = file => imageHosts.uploadImages([file]).then(singleImageGetter).then(function(imageUrl) {
					if (preview) imagePreview(imageUrl, file.size);
					return imageUrl;
				});
				if (httpParser.test(result)) return imageHosts.rehostImages([result]).catch(function(reason) {
					logFail('Downsizing of source image failed (' + reason + '), uploading original size');
					return uploader(file);
				});
				if (result instanceof File) return uploader(result);
				console.warn('invalid checkImageSize(...) result:', result);
				return Promise.reject('invalid checkImageSize(...) result');
			}))) : imageHosts.uploadImages(files);
		},
		rehostImageLinks: function rehostImageLinks(urls, checkSize = true, preview = false, enforceRehost = false, modifiers) {
			if (typeof urls == 'string' && httpParser.test(urls)) urls = [urls];
			if (!Array.isArray(urls) || urls.length <= 0) return Promise.reject('Invalid parameter (urls)');
			console.time('Image URL rehoster');
			return Promise.all(urls.map(url => imageUrlResolver(url, {
				altKey: Boolean(typeof modifiers == 'object' && modifiers.altKey),
				ctrlKey: Boolean(typeof modifiers == 'object' && modifiers.ctrlKey),
				shiftKey: Boolean(typeof modifiers == 'object' && modifiers.shiftKey),
			}).then(verifyImageUrl).then(function(imageUrl) {
				if (!checkSize) return imageUrl;
				const size = getRemoteFileSize(imageUrl);
				if (preview) imagePreview(imageUrl, size);
				return checkImageSize(imageUrl, null, size);
			}))).then(imageUrls => imageHosts.rehostImages(imageUrls).then(function(rehostedImages) {
				console.timeEnd('Image URL rehoster');
				return rehostedImages;
			}, reason => enforceRehost ? Promise.reject(reason) : Promise.resolve(imageUrls)));
		},
		imageHostHandlers: imageHostHandlers,
		uploadImages: ImageHostManager.prototype.uploadImages.bind(imageHosts),
		rehostImages: ImageHostManager.prototype.rehostImages.bind(imageHosts),
		logFail: logFail,
		getDeezerImageMax: getDeezerImageMax,
		getDiscogsImageMax: getDiscogsImageMax,
		dzrImageMax: dzrImageMax,
		itunesImageMax: itunesImageMax,
		urlResolver: urlResolver,
		verifyImageUrl: verifyImageUrl,
		getRemoteFileType: getRemoteFileType,
		getRemoteFileSize: getRemoteFileSize,
		imageUrlResolver: imageUrlResolver,
		checkImageSize: checkImageSize,
		reduceImageSize: reduceImageSize,
		optiPNG: optiPNG,
		directLinkGetter: directLinkGetter,
		singleImageGetter: singleImageGetter,
	}) });
	unsafeWindow.dispatchEvent(Object.assign(new Event('imageHostHelper'), { data: unsafeWindow.imageHostHelper }));
	// const meta = document.createElement('META');
	// meta.name = 'ImageHostHelper';
	// meta.content = 'All endpoints exported';
	// meta.setAttribute('propertyname', 'imageHostHelper');
	// document.head.append(meta);
}

function imageUrlResolver(url, modifiers = { }) {
	return urlResolver(url).then(url => verifyImageUrl(url).catch(function(reason) {
		if (/^HTTP error (\d+)\b/.test(reason) && [
			401, 402, 404, 407, 408, 410, 451,
			502, 503, 504, 511,
		].includes(parseInt(RegExp.$1)) || /\b(?:timeout|timed out)\b/.test(reason)) return Promise.reject(reason);
		const notFound = Promise.reject('No title image for this URL');
		function getFromMeta(root) {
			let meta = root instanceof Document || root instanceof Element ? [
				'meta[property="og:image:secure_url"][content]',
				'meta[property="og:image"][content]',
				'meta[name="og:image"][content]',
				'meta[itemprop="og:image"][content]',
				'meta[itemprop="image"][content]',
			].reduce((elem, selector) => elem || root.querySelector(selector), null) : null;
			return meta != null && httpParser.test(meta.content) ? meta.content : undefined;
		}

		try { url = new URL(url) } catch(e) { return Promise.reject(e) }
		let entryIds;
		if (url.hostname.endsWith('pinterest.com'))
			return pinterestResolver(url);
		else if (url.hostname.endsWith('free-picload.com')) {
			if (url.pathname.startsWith('/album/')) return imageHostHandlers.picload.galleryResolver(url);
		} else if (url.hostname.endsWith('bandcamp.com')) return globalXHR(url).then(function({document}) {
			let ref = document.querySelector('div#tralbumArt > a.popupImage');
			ref = ref != null ? ref.href : getFromMeta(document);
			return ref ? Promise.resolve(ref.replace(/_\d+(?=\.\w+$)/, '_0')) : notFound;
		}); else if (url.hostname.endsWith('7digital.com') && url.pathname.startsWith('/artist/'))
			return globalXHR(url).then(function({document}) {
				let img = document.querySelector('img[itemprop="image"]');
				return img != null ? img.src : notFound;
			});
		else if (url.hostname.endsWith('geekpic.net')) return globalXHR(url).then(function({document}) {
			let a = document.querySelector('div.img-upload > a.mb');
			return a != null ? a.href : notFound;
		}); else if (url.hostname.endsWith('qq.com') && /\/album(?:Detail)?\/(\w+)/i.test(url.pathname)) return globalXHR(url).then(function({document}) {
			for (let script of document.body.querySelectorAll(':scope > script'))
				if ((script = /\b__INITIAL_DATA__\s*=\s*({.+})/.exec(script.text)) != null)
					try { var initialData = eval('(' + script[1] + ')') } catch(e) { console.warn(e) }
			if (!initialData) throw 'Assertion failed: __INITIAL_DATA__ not triggered';
			if (initialData = initialData.detail.picurl) {
				if (!httpParser.test(initialData)) initialData = url.protocol + initialData;
				return initialData.replace(/\/(T\d+)?(R\d+x\d+)?(M\w+?)(_\d+)?\.(\w+(?:\.\w+)*)(\?.*)?$/, '/$1$3.$5');
			} else return notFound;
		}); else if (url.hostname.startsWith('books.google.') && url.pathname.startsWith('/books')) return globalXHR(url).then(function({document}) {
			let meta = getFromMeta(document);
			return meta != null ? meta.replace(/\b(?:zoom=1)\b/, 'zoom=0') : notFound;
		}); else if (/^(?:\w+\.)?amazon(?:\.\w+)+$/.test(url.hostname)) return getAmazonCfg(url).then(function(amazonCfg) {
			return globalXHR(amazonCfg.urlBase + 'api/showHome', { responseType: 'json', headers: amazonCfg.headers }, {
				deeplink: JSON.stringify({
					interface: 'DeeplinkInterface.v1_0.DeeplinkClientInformation',
					deeplink: '/' + url.pathname.split('/').filter(Boolean).slice(-2).join('/'),
				}),
			}).then(function({response}) {
				const method = response.methods.find(method => method.interface.endsWith('.CreateAndBindTemplateMethod'));
				return method && method.template && method.template.headerImage || notFound;
			});
		}).catch(reason => globalXHR(url).then(function(response) {
			const getFullImage = imageUrl => httpParser.test(imageUrl)
				&& (imageUrl = imageUrl.replace(/\._\w+(?:_\w+)*_\./, '.'), !['31CTP6oiIBL.jpg', '31zMd62JpyL.jpg']
				.some(path => imageUrl.endsWith('/images/I/' + path))) ? imageUrl : Promise.reject('Dummy image (placeholder)');
			const getImgOrigin = colorImage => getFullImage(colorImage.hiRes || colorImage.large || colorImage.thumb);
			let obj = /^\s*(?:var\s+obj\s*=\s*jQuery\.parseJSON)\('(\{.+\})'\);/m.exec(response.responseText);
			if (obj != null) {
				try { obj = JSON.parse(obj[1]) } catch(e) { try { obj = eval('(' + obj[1] + ')') } catch(e) { obj = { } } }
				let variants = Object.keys(obj.colorImages);
				if (variants.length > 0) return Promise.all(variants.map(key =>
					Promise.all(obj.colorImages[key].map(getImgOrigin))));
			}
			let colorImages = /^\s*'colorImages':\s*(\{.+\}),?$/m.exec(response.responseText);
			if (colorImages != null) {
				try { colorImages = JSON.parse(colorImages[1].replace(/'/g, '"')) }
				catch(e) { try { colorImages = eval('(' + colorImages[1] + ')') } catch(e) { colorImages = { } } }
				if (Array.isArray(colorImages.initial) && colorImages.initial.length > 0)
					return Promise.all(colorImages.initial.map(getImgOrigin));
			}
			let img = ['div#ppd-left img', 'img#igImage', 'img#imgBlkFront']
				.reduce((acc, sel) => acc || response.document.querySelector(sel), null);
			if (img == null) return notFound;
			if (img.dataset.aDynamicImage) try {
				let imgUrl = Object.keys(JSON.parse(img.dataset.aDynamicImage))[0];
				if (httpParser.test(imgUrl)) return getFullImage(imgUrl);
			} catch(e) { }
			return getFullImage(img.src);
		})); else switch (url.hostname) {
			// general image hostings
			case 'www.imgur.com': case 'imgur.com':
				return (entryIds = /^\/(?:(a)\/)?(\w+)\b/.exec(url.pathname)) != null ? imageHostHandlers.imgur.setSession().then(clientId =>
						globalXHR(`https://api.imgur.com/post/v1/${entryIds[1] == 'a' ? 'albums' : 'media'}/${entryIds[2]}?${new URLSearchParams({
					client_id: clientId,
					include: 'media',
				}).toString()}`, { responseType: 'json' }).then(({response}) => response.media.map(media => media.url))).catch(reason => globalXHR(url, { responseType: 'text' }).then(function({responseText}) {
					let image = /^\s*(?:image)\s*:\s*(\{.+\}),\s*$/m.exec(responseText);
					if (image != null) try {
						return JSON.parse(image[1]).album_images.images.map(image => 'https://i.imgur.com/' + image.hash + image.ext);
					} catch(e) { console.warn(e) }
					return notFound;
				})) : globalXHR(url).then(function({document}) {
					let link = document.querySelector('link[rel="image_src"]');
					return link != null ? link.href : notFound;
				});
			case 'pixhost.to':
				if (url.pathname.startsWith('/gallery/')) return globalXHR(url).then(({document}) =>
					Promise.all(Array.from(document.querySelectorAll('div.images > a')).map(a => imageUrlResolver(a.href, modifiers))));
				if (url.pathname.startsWith('/show/')) return globalXHR(url)
					.then(({document}) => document.querySelector('img#image').src);
				break;
			case 'malzo.com':
				if (url.pathname.startsWith('/al/')) return imageHostHandlers.malzo.galleryResolver(url); else break;
			case 'imgbb.com': case 'ibb.co':
				if (url.pathname.startsWith('/album/')) return imageHostHandlers.imgbb.galleryResolver(url); else break;
			case 'jerking.empornium.ph':
				if (url.pathname.startsWith('/album/')) return imageHostHandlers.jerking.galleryResolver(url); else break;
			case 'imgbox.com':
				if (url.pathname.startsWith('/g/')) return globalXHR(url).then(({document}) =>
					Promise.all(Array.from(document.querySelectorAll('div#gallery-view-content > a'))
						.map(a => imageUrlResolver('https://imgbox.com' + a.pathname, modifiers))));
				break;
			case 'postimage.org': case 'postimg.cc':
				if (url.pathname.startsWith('/gallery/'))
					return PostImage.resultsHandler(url).then(results => results.map(result => result.original));
				return globalXHR(url).then(function({document}) {
					const elem = document.body.querySelector('a#download');
					return elem != null ? elem.href : getFromMeta(document.head) || notFound;
				});
			case 'www.imagevenue.com': case 'imagevenue.com':
				return globalXHR(url, { headers: { Referer: 'http://www.imagevenue.com/' } }).then(function({document}) {
					let images = Array.from(document.querySelectorAll('div.card img')).map(function(img) {
						return img.src.includes('://cdn-images') ? Promise.resolve(img.src) : imageUrlResolver(img.parentNode.href, modifiers);
					});
					return images.length > 1 ? Promise.all(images) : images.length == 1 ? images[0] : notFound;
				});
			case 'www.imageshack.us': case 'imageshack.us':
				return globalXHR(url).then(({document}) => document.querySelector('a#share-dl').href);
			case 'www.flickr.com': case 'flickr.com':
				if (url.pathname.startsWith('/photos/')) return globalXHR(url, { responseType: 'text' }).then(function({responseText}) {
					if (/\b(?:modelExport)\s*:\s*(\{.+\}),/.test(responseText)) try {
						let urls = JSON.parse(RegExp.$1).main['photo-models'].map(function(photoModel) {
							let sizes = Object.keys(photoModel.sizes).sort((a, b) => photoModel.sizes[b].width *
								photoModel.sizes[b].height - photoModel.sizes[a].width * photoModel.sizes[a].height);
							return sizes.length > 0 ? 'https:'.concat(photoModel.sizes[sizes[0]].url) : null;
						});
						if (urls.length == 1) return urls[0]; else if (urls.length > 1) return urls;
					} catch(e) { console.warn(e) }
					return notFound;
				}); else break;
			case 'photos.google.com':
				return googlePhotosResolver(url);
			case 'www.500px.com': case 'web.500px.com': case '500px.com':
				if (/^\/photo\/(\d+)\b/i.test(url.pathname))
					return _500pxUrlHandler('photos?ids='.concat(RegExp.$1));
				else if (/\/galleries\/([\w\%\-]+)/i.test(url.pathname)) {
					let galleryId = RegExp.$1;
					return globalXHR(url, { rsponseType: 'text' }).then(function({responseText}) {
						if (!/\b(?:App\.CuratorId)\s*=\s*"(\d+)"/.test(responseText)) return Promise.reject('Unexpected page structure');
						return _500pxUrlHandler('users/' + RegExp.$1 + '/galleries/' + galleryId + '/items?sort=position&sort_direction=asc&rpp=999');
					});
				} else break;
			case 'www.pxhere.com': case 'pxhere.com':
				if (url.pathname.includes('/photo/')) return globalXHR(url).then(({document}) =>
						JSON.parse(document.querySelector('div.hub-media-content > script[type="application/ld+json"]').text).contentUrl);
					else if (url.pathname.includes('/collection/')) return pxhereCollectionResolver(url);
				break;
			case 'www.unsplash.com': case 'unsplash.com':
				if (url.pathname.startsWith('/photos/')) return globalXHR(url.origin + url.pathname + '/download', { method: 'HEAD' })
						.then(response => response.finalUrl.replace(/\?.*$/, ''));
					else if (url.pathname.includes('/collections/')) return unsplashCollectionResolver(url);
				break;
			case 'www.pexels.com': case 'pexels.com':
				if (url.pathname.startsWith('/photo/')) return globalXHR(url)
						.then(({document}) => document.querySelector('meta[property="og:image"][content]').content.replace(/\?.*$/, ''));
					else if (url.pathname.startsWith('/collections/')) return pexelsCollectionResolver(url);
				break;
			case 'www.piwigo.org': case 'piwigo.org':
				/*if (url.pathname.includes('/picture/')) */return globalXHR(url, { responseType: 'text' }).then(function({responseText}) {
					if (/^(?:RVAS)\s*=\s*(\{[\S\s]+?\})$/m.test(responseText)) try {
						let derivatives = eval('(' + RegExp.$1 + ')').derivatives.sort((a, b) => b.w * b.h - a.w * a.h);
						return derivatives.length > 0 ? 'https://piwigo.org/demo/'.concat(derivatives[0].url) : notFound;
					} catch(e) { console.warn(e) }
					return Promise.reject('Unexpected page structure');
				});
			case 'www.freeimages.com': case 'freeimages.com':
				if (url.pathname.startsWith('/photo/')) return globalXHR(url).then(function({document}) {
					let types = Array.from(document.querySelectorAll('ul.download-type > li > span.reso'))
						.sort((a, b) => eval(b.textContent.replace('x', '*')) - eval(a.textContent.replace('x', '*')));
					return types.length > 0 ? url.origin.concat(types[0].parentNode.querySelector('a').pathname) : notFound;
				}); else break;
			case 'redacted.sh':
				if (url.pathname == '/image.php') return globalXHR(url, { method: 'HEAD' }).then(response => response.finalUrl);
					else break;
			case 'demo.cloudimg.io': {
				if (!/\b(https?:\/\/\S+)$/.test(url.pathname.concat(url.search, url.hash))) break;
				let resolved = RegExp.$1;
				if (/\b(?:https?):\/\/(?:\w+\.)*discogs\.com\//i.test(resolved)) break;
				return imageUrlResolver(resolved, modifiers);
			}
			case 'www.pimpandhost.com': case 'pimpandhost.com':
				if (url.pathname.startsWith('/image/')) return globalXHR(url).then(function(response) {
					let elem = resopnse.document.querySelector('div.main-image-wrapper');
					if (elem != null && elem.dataset.src) return 'https:'.concat(elem.dataset.src);
					elem = resopnse.document.querySelector('div.img-wrapper > a > img');
					return elem != null ? 'https:'.concat(elem.src) : notFound;
				}); else break;
			case 'www.screencast.com': case 'screencast.com':
				return globalXHR(url).then(function({document}) {
					let ref = document.querySelectorAll('ul#containerContent > li a.media-link');
					if (ref.length <= 0) return getFromMeta(document) || notFound;
					return Promise.all(Array.from(ref).map(a => imageUrlResolver('https://www.screencast.com' + a.href, modifiers)));
				});
			case 'abload.de':
				if (url.pathname.startsWith('/image.php')) return globalXHR(url).then(function({document}) {
					let elem = document.querySelector('img#image');
					if (elem == null) return notFound;
					let src = new URL(elem.src);
					return imageHostHandlers.abload.origin + src.pathname + src.search;
				}); else break;
			case 'fastpic.ru':
				if (url.pathname.startsWith('/view/'))
					return globalXHR(url).then(({document}) => imageUrlResolver(document.querySelector('a.img-a').href, modifiers));
				else if (url.pathname.startsWith('/fullview/')) return globalXHR(url).then(function(response) {
					let node = response.document.getElementById('image');
					if (node != null) return node.src;
					return /\bvar\s+loading_img\s*=\s*'(\S+?)';/.test(response.responseText) ? RegExp.$1 : notFound;
				}); else break;
			case 'www.radikal.ru': case 'radikal.ru': case 'a.radikal.ru':
				return globalXHR(url).then(({document}) => document.querySelector('div.mainBlock img').src);
			case 'imageban.ru': case 'ibn.im':
				return globalXHR(url).then(({document}) => document.querySelector('a[download]').href);
			case 'svgshare.com':
				return globalXHR(url).then(function({document}) {
					let link;
					document.querySelectorAll('ul#shares > li > input[type="text"]')
						.forEach(input => { if (!link && /^(?:https?:\/\/.+\.svg)$/.test(input.value)) link = input.value; });
					return link || notFound;
				});
			case 'slow.pics':
				if (url.pathname.startsWith('/c/')) return globalXHR(url).then(function({document}) {
					let nodes = document.querySelectorAll('img.card-img-top');
					if (nodes.length > 1) return Array.from(nodes).map(img => img.src);
						else if (nodes.length > 0) return nodes[0].src;
					nodes = document.querySelectorAll('a#comparisons + div.dropdown-menu > a.dropdown-item');
					if (nodes.length > 0) return Promise.all(Array.from(nodes).map(a => globalXHR(url.origin + a.pathname)
						.then(({document}) => Array.from(document.querySelectorAll('div#preload-images > img')).map(img => img.src))));
					return notFound;
				}); else break;
			case 'www.casimages.com': case 'casimages.com':
				if (url.pathname.startsWith('/i/')) return globalXHR(url).then(function({document}) {
					let elem = document.querySelector('div.logo > a');
					if (elem != null) return elem.href;
					elem = document.querySelector('div.logo img');
					return elem != null ? elem.src : notFound;
				}); else break;
			case 'www.getapic.me': case 'getapic.me':
				return globalXHR(url, { responseType: 'json' }).then(function({response}) {
					if (!response.result.success) return Promise.reject(response.result.errors);
					if (Array.isArray(response.result.data.images))
						return response.result.data.images.map(image => image.url);
					return response.result.data.image ? response.result.data.image.url : notFound;
				});
			case 'sm.ms':
				if (url.pathname.startsWith('/image/')) return globalXHR(url).then(function({document}) {
					let img = document.querySelector('img.image');
					return img != null ? img.src || img.parentElement.href : notFound;
				}); else break;
			case 'www.kizunaai.com': case 'kizunaai.com':
				//if (!url.pathname.includes('/music/')) break;
				return globalXHR(url).then(function({document}) {
					let img = document.querySelector('div.post-body span > img');
					return img != null ? img.src.replace(/-\d+x\d+(?=\.\w+$)/, '') : notFound;
				});
			case 'play.google.com':
				if (url.pathname.startsWith('/store/')) return globalXHR(url).then(function({document}) {
					let meta = getFromMeta(document);
					return meta != null ? meta.replace(/(?:=[swh]\d+.*)?$/, '=s0') : notFound;
				}); else break;
			// music-related
			case 'www.discogs.com': case 'discogs.com':
				return globalXHR(url, { anonymous: true }).then(({document}) => (function() {
					if (url.pathname.includes('/master/')) return Promise.reject('This is master');
					if (modifiers.ctrlKey) return Promise.reject('Master release inquiry avoided (force release gallery)');
					const master = document.body.querySelector('section#release-actions a.link_1ctor[href^="/master/"]')
						|| document.body.querySelector('a[href^="/master/"]');
					if (master == null) return Promise.reject('No master release for this page');
					return imageUrlResolver(discogsOrigin + master.pathname, modifiers);
				})().catch(function(reason) {
					const ids = /\/(artist|master|release|label)s?\/(?:view\/)?(\d+)\b/i.exec(url.pathname);
					return ids != null ? getDiscogsImages(ids[1], ids[2]).catch(function(reason) {
						let gallery = document.querySelector('div.image_gallery_large, div.image_gallery');
						if (gallery != null) try {
							gallery = JSON.parse(gallery.dataset.images).map(image => image.full || image.thumb)
								.filter(RegExp.prototype.test.bind(httpParser));
							if (gallery.length <= 0) throw 'empty imagem list';
							return Promise.all(gallery.map(getDiscogsImageMax)).catch(function(reason) {
								console.error('One of getDiscogsImageMax workers rejected:', reason, gallery);
								return gallery;
							});
						} catch(e) { console.warn('Invalid Discogs image gallery:', gallery, '(' + e + ')') } else {
							console.warn('Missing Discogs image gallery record for', url.href);
						}
						return (gallery = getFromMeta(document)) ? getDiscogsImageMax(gallery) : notFound;
					}) : Promise.reject('Unsupported entity');
				}));
			case 'www.musicbrainz.org': case 'beta.musicbrainz.org': case 'musicbrainz.org':
				if (url.pathname.startsWith('/release/')) {
					if (/^\/release\/([\w\-]+)(?=\/|$)/i.test(url.pathname)) url.pathname = '/release/' + RegExp.$1 + '/cover-art';
						else console.warn('Unexpected MusicBrainz release url path:', url.pathname);
				} else if (!url.pathname.startsWith('/release-group/')) break;
				return globalXHR(url).then(({document}) => (function() {
					if (url.pathname.startsWith('/release-group/')) return Promise.reject('this is release group');
					if (modifiers.ctrlKey) return Promise.reject('release group inquiry avoided (force release gallery)');
					let releaseGroup = document.querySelector('p.subheader > span.small > a');
					if (releaseGroup == null) return Promise.reject('no release group for this page');
					return imageUrlResolver('https://musicbrainz.org' + releaseGroup.pathname, modifiers);
				})().catch(function(reason) {
					let elem = document.querySelector('head > script[type="application/ld+json"]');
					if (elem != null) try {
						if (Array.isArray(elem = JSON.parse(elem.text).image)) {
							if (elem.length > 0) return elem.map(image => 'https:' + image.contentUrl);
						} else if (elem && elem.contentUrl) return 'https:' + elem.contentUrl;
					} catch(e) { console.warn('MusicBrainz: invalid meta record', elem) }
					elem = document.querySelectorAll('div#content > div.artwork-cont span.cover-art-image > img');
					if (elem.length > 0) return Array.from(elem).map(img => img.src.replace(/-\d+(?=(?:\.\w+)+$)/, ''));
					return (elem = document.querySelector('a.artwork-image')) != null ? elem.href
						: (elem = document.querySelector('div.cover-art > img')) != null ? elem.src : notFound;
				}));
			case 'www.allmusic.com': case 'allmusic.com':
				return globalXHR(url).then(function({document}) {
					function imageResolver(document) {
						function imageMax(imageUrl) {
							if (imageUrl) try {
								imageUrl = new URL(imageUrl);
								imageUrl.searchParams.set('f', 0);
								return imageUrl.href;
							} catch(e) { console.warn(e) }
						}

						const galleryExtractor = /\b(?:imageGallery) *= *(\[.+\]);?\s*$/;
						let imageGallery = Array.prototype.find.call(document.body.getElementsByTagName('script'),
							script => galleryExtractor.test(script.text));
						if (imageGallery) try {
							imageGallery = galleryExtractor.exec(imageGallery.text);
							console.assert(imageGallery != null);
							imageGallery = eval(imageGallery[1]).map(image => imageMax(image.url));
							if (imageGallery.length > 0) return imageGallery;
						} catch(e) { console.warn(e) }
						return imageMax(getFromMeta(document)) || notFound;
					}

					const mainAlbum = document.querySelector('div#mainAlbumMeta a');
					if (mainAlbum == null || !modifiers.ctrlKey) return imageResolver(document);
					return globalXHR(mainAlbum).then(({document}) =>
						imageResolver(document)).catch(reason => imageResolver(document));
				});
			case 'music.apple.com': case 'itunes.apple.com': {
				if ((entryIds = amEntityParser.exec(url)) == null) break;
				const market = /\/([a-z]{2})\//.exec(url.pathname);
				return queryAppleAPI(`${entryIds[1]}s/${entryIds[2]}`, undefined, market != null ? market[1] : undefined).then(function(response) {
					const artwork = response.data[0].attributes.artwork;
					return artwork ? artwork.url.replace('{w}', artwork.width).replace('{h}', artwork.height) : notFound;
				});
			}
			case 'www.deezer.com': case 'deezer.com':
				if ((entryIds = dzrEntityParser.exec(url)) != null) return verifyImageUrl(`https://api.deezer.com/${entryIds[1]}/${entryIds[2]}/image`).catch(function(reason) {
					console.warn('Deezer API image retrieval failed:', reason, url);
					return globalXHR(url).then(({document}) => getFromMeta(document) || notFound);
				}).then(imageUrl => !modifiers.ctrlKey ? getDeezerImageMax(imageUrl)
					: verifyImageUrl(imageUrl.replace(...dzrImageMax)).catch(reason => imageUrl)); else break;
			case 'www.qobuz.com': case 'qobuz.com':
				if (url.pathname.includes('/album/')) return globalXHR(url).then(function({document}) {
					let img = document.querySelector('div.album-cover > img');
					if (img == null) return getFromMeta(document) || notFound;
					return verifyImageUrl(img.src.replace(/_\d{3}(?=\.\w+$)/, '_org'))
						.catch(reason => verifyImageUrl(img.src.replace(/_\d{3}(?=\.\w+$)/, '_max')))
						.catch(reason => img.src);
				}); else if (url.pathname.includes('/interpreter/') || url.pathname.includes('/artist/')) return globalXHR(url).then(function({document}) {
					let img = document.querySelector('div.catalog-heading__picture')
						|| document.querySelector('div.catalog-heading__background');
					if (img != null) img = /\b(?:url)\(\"(.+)\"\)/i.exec(img.style.backgroundImage);
					if (img != null) img = img[1]; else return getFromMeta(document) || notFound;
					if (!httpParser.test(img)) img = 'https:' + img;
					return verifyImageUrl(img.replace(/\/small\//i, '/large/')).catch(reason => img);
				}); else break;
			case 'www.boomkat.com': case 'boomkat.com':
				if (url.pathname.startsWith('/products/')) return globalXHR(url).then(function({document}) {
					let img = document.querySelector('img[itemprop="image"]');
					if (img == null) return notFound;
					return verifyImageUrl(img.src.replace(/\/large\//i, '/original/')).catch(reason => img.src);
				}); else break;
			case 'www.bleep.com': case 'bleep.com':
				if (url.pathname.startsWith('/release/')) return globalXHR(url).then(function({document}) {
					let image = getFromMeta(document);
					if (!image && (image = document.body.querySelector('a.main-product-image > img')) != null) image = image.src;
					return image ? verifyImageUrl(image.replace(/\/r\/[a-z]\//i, '/r/')).catch(reason => image) : notFound;
				}); else break;
			case 'www.soundcloud.com': case 'soundcloud.com':
				return globalXHR(url).then(function({document}) {
					const meta = getFromMeta(document);
					return meta ? verifyImageUrl(meta.replace(/-\w+(?=\.\w+$)/, '-original')).catch(reason => meta) : notFound;
				});
			case 'www.prestomusic.com': case 'prestomusic.com':
				if (url.pathname.includes('/products/')) return globalXHR(url).then(({document}) =>
					verifyImageUrl(document.querySelector('div.c-product-block__aside > a').href.replace(/\?\d+$/))); else break;
			case 'www.bontonland.cz':case 'bontonland.cz':
				return globalXHR(url).then(({document}) => document.querySelector('a.detailzoom').href);
			case 'www.prostudiomasters.com': case 'prostudiomasters.com':
				if (url.pathname.includes('/album/')) return globalXHR(url).then(function({document}) {
					let a = document.querySelector('img.album-art');
					return verifyImageUrl(a.currentSrc).catch(reason => a.src);
				}); else break;
			case 'www.e-onkyo.com': case 'e-onkyo.com':
				if (url.pathname.includes('/album/')) return globalXHR(url).then(function({document}) {
					let meta = getFromMeta(document);
					return meta ? meta.replace(/\/s\d+\//, '/s0/') : notFound;
				}); else break;
			case 'store.acousticsounds.com':
				return globalXHR(url).then(function({document}) {
					let link = document.querySelector('div#detail > link[rel="image_src"]');
					return verifyImageUrl(link.href.replace(/\/medium\//i, '/xlarge/')).catch(reason => link.href);
				});
			case 'www.indies.eu': case 'indies.eu':
				if (url.pathname.includes('/alba/')) return globalXHR(url)
					.then(({document}) => verifyImageUrl(document.querySelector('div.obrazekDetail > img').src)); else break;
			case 'www.beatport.com': case 'classic.beatport.com': case 'pro.beatport.com': case 'beatport.com':
				if (url.pathname.startsWith('/release/')) return globalXHR(url).then(function({document}) {
					let elem = getFromMeta(document);
					if (!elem && (elem = document.body.querySelector('div > img.interior-release-chart-artwork')) != null)
						elem = elem.src;
					if (!elem && (elem = document.body.querySelector('div.artwork')) != null && elem.dataset.modalArtwork) // BP Classic
						elem = 'https:' + elem.dataset.modalArtwork;
					return elem || notFound;
				}).then(imgUrl => verifyImageUrl(imgUrl.replace(/\/image_size\/\d+x\d+\//i, '/image/'))); else break;
			case 'www.beatsource.com': case 'beatsource.com':
				if (url.pathname.startsWith('/release/')) return globalXHR(url).then(function({document}) {
					let imgUrl = getFromMeta(document);
					return imgUrl ? imgUrl.replace(/\/image_size\/\d+x\d+\//i, '/') : notFound;
				}); else break;
			case 'www.supraphonline.cz': case 'supraphonline.cz':
				if (!url.pathname.includes('/album/')) break;
				return globalXHR(url).then(function({document}) {
					let imageUrl = document.querySelector('div.sidebar div.sexycover > div.btn-group > button:last-of-type');
					if (imageUrl != null && /^(?:coverzoom):(\S+)\$$/.test(imageUrl.dataset.plugin)
							&& (imageUrl = imageUrl.parentNode.querySelector('script[type="data-plugin/' + RegExp.$1 + '"]')) != null)
						return 'https://www.supraphonline.cz' + eval(imageUrl.text);
					return (imageUrl = getFromMeta(document)) ? imageUrl.replace(/\?.*$/, '') : notFound;
				});
			case 'vgmdb.net':
				if (url.pathname.includes('/album/')) return globalXHR(url).then(function({document}) {
					let div = document.querySelector('div#coverart');
					return verifyImageUrl(/\b(?:url)\s*\(\"(.*)"\)/i.test(div.style['background-image']) && RegExp.$1).catch(reason => notFound);
				}); else break;
			case 'www.ototoy.jp': case 'ototoy.jp':
				return globalXHR(url).then(function({document}) {
					let img = document.querySelector('div#jacket-full-wrapper > img'); // img[alt="album jacket"]
					return img != null ? img.dataset.src || img.src : notFound;
				});
			case 'music.yandex.ru':
				if (url.pathname.includes('/album/')) return globalXHR(url).then(function({document}) {
					let script = document.querySelector('script.light-data');
					return verifyImageUrl(JSON.parse(script.text).image).catch(reason => notFound);
				}); else break;
			case 'www.pias.com': case 'store.pias.com': case 'pias.com':
				return globalXHR(url).then(function({document}) {
					let node = getFromMeta(document);
					if (node) return verifyImage(node.replace(/\/[sbl]\//i, '/')).catch(reason => node);
					node = document.querySelector('img[itemprop="image"]');
					return node != null ? verifyImage(node.src.replace(/\/[sbl]\//i, '/')).catch(reason => node.src) : notFound;
				});
			case 'www.eclassical.com': case 'eclassical.com':
				return globalXHR(url).then(function({document}) {
					let a = document.querySelector('div#articleImage > a');
					return a != null ? a.href : notFound;
				});
			case 'www.hdtracks.com': case 'hdtracks.com':
				if (!/\/album\/(\w+)\b/.test(url)) break;
				return fetch('https://hdtracks.azurewebsites.net/api/v1/album/' + RegExp.$1).then(response => response.json())
					.then(result => result.status.toLowerCase() == 'ok' ? result.cover : Promise.reject(result.status));
			case 'www.muziekweb.nl': case 'muziekweb.nl':
				if (/\/Link\/(\w+)\b/i.test(url)) return globalXHR(url).then(function({document}) {
					let meta = getFromMeta(document);
					return meta ? meta.replace(/\/COVER\/\w+\b/i, '/COVER/SUPERLARGE') : notFound;
				}); else break;
			case 'www.deejay.de': case 'deejay.de':
				return globalXHR(url).then(function({document}) {
					let elem = document.querySelector('div#gallery > a') || document.querySelector('div.cover a');
					if (elem != null) return 'https://www.deejay.de' + elem.pathname;
					return (elem = getFromMeta(document)) ? elem : notFound;
				}).then(imgUrl => verifyImageUrl(imgUrl.replace(/\/images\/\w+\//i, '/images/xxl/')).catch(() => imgUrl));
			case 'music.163.com':
				if (!/\/album.*\b(?:id)=(\d+)\b/i.test(url.href)) break;
				return globalXHR('https://music.163.com/api/album/' + RegExp.$1, { responseType: 'json' })
					.then(({response}) => response.album.picUrl ?
						response.album.picUrl.replace(/\?.*$/, '').replace(/\b(?:p[123])(?=\.music\.\d+\.net\b)/i, 'p4') : notFound);
			case 'www.tidal.com': case 'listen.tidal.com': case 'tidal.com':
				if (!(/\/album\/(\d+)(?:\/|$)/i.test(url.pathname) && !/\b(?:albumId)=(\d+)\b/i.test(url.search))) break;
				return tidalAccess.requestAPI('albums/' + RegExp.$1).then(album => album.cover ?
					'https://resources.tidal.com/images/' + album.cover.replace(/-/g, '/') + '/1280x1280.jpg' : notFound);
			case 'www.extrememusic.com': case 'extrememusic.com':
				if (url.pathname.startsWith('/albums/')) return globalXHR(url).then(function({document}) {
					let meta = getFromMeta(document);
					return meta ? meta.replace(/\/album\/\w+\//i, '/album/600/') : notFound;
				}); else break;
			case 'www.recochoku.jp': case 'recochoku.jp':
				if (url.pathname.startsWith('/album/')) return globalXHR(url).then(function({document}) {
					let imgUrl = getFromMeta(document);
					if (!imgUrl) return notFound;
					imgUrl = new URL(imgUrl);
					let params = new URLSearchParams(imgUrl.search);
					params.set('FFw', 999999999); params.set('FFh', 999999999);
					params.delete('h'); params.delete('option');
					imgUrl.search = params;
					return imgUrl;
				}); else break;
			case 'www.elusivedisc.com': case 'elusivedisc.com':
				return globalXHR(url).then(function({document}) {
					let img = document.querySelector('figure > img.zoomImg');
					if (img != null) return img.src;
					img = document.querySelector('section.productView-images > figure');
					return img != null && img.dataset.zoomImage || notFound;
				});
			case 'music.youtube.com':
				return globalXHR(url).then(function({document}) {
					for (let script of document.querySelectorAll('body > script[nonce]')) {
						let data = /\b(?:initialData\.push)\s*\(\s*\{\s*(?:path):\s*('\\\/browse'),\s*(?:params):\s*(.+?)\s*,\s*(?:data):\s*('.+?')\s*\}\s*\);/.exec(script.text);
						if (data != null) try {
							const imgMax = [/(?:=[swh]\d+.*)?$/, '=s0'];
							data = JSON.parse(eval(data[3]));
							if ('frameworkUpdates' in data) try {
								data = data.frameworkUpdates.entityBatchUpdate.mutations
									.find(mutation => mutation.payload && 'musicAlbumRelease' in mutation.payload);
								if (data != undefined && 'thumbnailDetails' in data.payload.musicAlbumRelease)
									return data.payload.musicAlbumRelease.thumbnailDetails.thumbnails[0].url.replace(...imgMax);
							} catch(e) { console.warn(e) }
							if ('header' in data) try {
								data = data.header.musicImmersiveHeaderRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails;
								if (data) return data[0].url.replace(...imgMax);
							} catch(e) { console.warn(e) }
						} catch(e) { console.warn(e) }
					}
					return notFound;
				});
			case 'www.kuwo.cn': case 'kuwo.cn':
				if (url.pathname.startsWith('/album_detail/')) return globalXHR(url).then(function({document}) {
					for (let script of document.querySelectorAll('body > script')) {
						if (!/\b(?:__NUXT__)\b/.test(script.text)) continue;
						if (/\b(?:pic):"(.+?)"/.test(script.text))
							return eval('"' + RegExp.$1 + '"').replace(/(\/albumcover)\/\d+\//i, '$1/0/');
					}
					return notFound;
				}); else break;
			case 'www.melon.com': case 'melon.com':
				/*if (url.pathname.startsWith('/album/')) */return globalXHR(url).then(function({document}) {
					let imgUrl = getFromMeta(document);
					if (imgUrl) imgUrl = imgUrl.replace(/\?.*$/, ''); else return notFound;
					return verifyImageUrl(imgUrl.replace(/(?:_\d+)?(?=\.\w+$)/, '_1000')).catch(reason => imgUrl);
				});// else break;
			case 'music.bugs.co.kr':
				/*if (url.pathname.startsWith('/album/')) */return globalXHR(url).then(function({document}) {
					let imgUrl = getFromMeta(document);
					return imgUrl ? imgUrl.replace(/(\/album\/images)\/\w+\//i, '$1/original/') : notFound;
				}); //else break;
			case 'www.joox.com': case 'joox.com':
				if (/\/album\/([^\/\?\#]+)/i.test(url.pathname))
					return globalXHR('https://api-jooxtt.sanook.com/page/albumDetail?' + new URLSearchParams({
						id: RegExp.$1,
						lang: 'en',
						country: 'intl',
						device: 'desktop',
					}).toString(), { responseType: 'json' }).then(({response}) => response.albumTracks.images
						&& response.albumTracks.images.reduceRight((acc, img) => img.url.replace(/\/(\d+)$/, '/0'), undefined) || notFound);
			case 'mixcloud.com': case 'www.mixcloud.com': {
				const folders = url.pathname.split('/').filter(Boolean);
				if (folders.length <= 0) break;
				const query = folders.length > 1 ? `
query cloudcastQuery($lookup: CloudcastLookup!) {
  cloudcast: cloudcastLookup(lookup: $lookup) {
    owner { ...CloudcastBaseSidebar_user }
    ...CloudcastHeadTags_cloudcast
  }
}
fragment CloudcastBaseSidebar_user on User { ...UserLiveCard_user }
fragment CloudcastHeadTags_cloudcast on Cloudcast { picture { urlRoot } }
fragment UserLiveCard_user on User { liveStream { streamStatus id } }
` : `
query userQuery($lookup: UserLookup! $bannerContentKey: String!) {
  user: userLookup(lookup: $lookup) { ...UserHeadTags_user }
  viewer { ...UserDashboardBanner_viewer_1HzGx id }
}
fragment UserDashboardBanner_viewer_1HzGx on Viewer { showHideableContent(contentKey: $bannerContentKey) }
fragment UserHeadTags_user on User { picture { urlRoot } }
`;
				return mixcloudQuery(query, {
					lookup: { username: folders[0], slug: folders[1] },
					bannerContentKey: 'DASHBOARD_BANNER_PROFILE',
				}).then(function(data) {
					let imgUrl = 'cloudcast' in data ? data.cloudcast.picture.urlRoot
						: 'user' in data ? data.user.picture.urlRoot : null;
					return imgUrl ? 'https://thumbnailer.mixcloud.com/unsafe/' + imgUrl : notFound;
				});
			}
			case 'www.metal-archives.com': case 'metal-archives.com':
				if (url.pathname.startsWith('/albums/')) return globalXHR(url).then(function({document}) {
					const cover = document.getElementById('cover');
					return cover != null ? cover.href.replace(/\?\S*$/, '') : getFromMeta(document) || notFound;
				}); else break;
			case 'www.rateyourmusic.com': case 'rateyourmusic.com':
				if (url.pathname.startsWith('/release/')) return globalXHR(url).then(function({document}) {
					let cover = document.body.querySelector('div.page_release_art_frame img');
					return cover != null ? cover.src : notFound;
				}); else break;
			// books-related
			case 'www.goodreads.com': case 'goodreads.com':
				if (url.pathname.includes('/show/')) return globalXHR(url).then(function({document}) {
					let img = ['div.BookCover__image img', 'div.editionCover > img', 'img#coverImage']
						.reduce((elem, selector) => elem || document.querySelector(selector), null);
					img = img != null ? img.src : getFromMeta(document);
					return img && !['/nophoto/', '/books/1570622405l/50809027', '/images/no-cover.png'].some(pattern =>
						img.includes(pattern)) ? img.replace(/\._\w+_\./g, '.').replace(/\?.*$/, '') : notFound;
				}); else break;
			case 'www.databazeknih.cz': case 'databazeknih.cz':
				if (url.pathname.startsWith('/knihy/')) return globalXHR(url).then(function({document}) {
					let elem = document.querySelector('div#icover_mid > a');
					if (elem != null) return imageUrlResolver('https://www.databazeknih.cz' + elem.pathname, modifiers);
					const imageMax = imageUrl => httpParser.test(imageUrl) ? verifyImageUrl([
						[/\/\d+\/([a-z]+)(?=_)/, 'big'], [/\?.*$/, ''],
					].reduce((acc, def) => acc.replace(...def), imageUrl)).catch(reason => imageUrl) : Promise.reject('invalid url');
					if ((elem = document.querySelector('div#lbImage')) != null
							&& (elem = /\b(?:url)\("(.*)"\)/i.exec(elem.style.backgroundImage)) != null) return imageMax(elem[1]);
					return (elem = document.querySelector('img.kniha_img')) != null ? imageMax(elem.src) : notFound;
				}); else if (url.pathname.startsWith('/obalka-knihy/')) return globalXHR(url).then(function({document}) {
					let elem = document.querySelector('img.book_cover_big');
					return elem != null ? elem.src.replace(/\?.*/, '') : notFound;
				}); else break;
			case 'www.alza.cz': case 'alza.cz': case 'www.alza.sk': case 'alza.sk':
				return globalXHR(url).then(function({document}) {
					const imageMax = imgSrc => imgSrc.replace(/([\?\&])fd=(?:f\d+)\b\&?/i, '$1');
					let meta = document.querySelectorAll('div#galleryPreview a.lightBoxImage');
					if (meta.length > 0) return Array.from(meta)
						.map(a => imageMax(a.dataset.original || a.href || a.dataset.bigimage));
					meta = document.querySelector('div.detail-page > script[type="application/ld+json"]');
					if (meta != null) try { meta = JSON.parse(meta.text) } catch(e) { meta = null }
					if (meta != null && httpParser.test(meta.image)) return imageMax(meta.image);
					return (meta = getFromMeta(document)) ? imageMax(meta) : notFound;
				});
			// movie-related
			case 'www.imdb.com': case 'imdb.com':
				if (!['title/tt', 'name/nm'].some(cat => url.pathname.startsWith('/' + cat))) break;
				return globalXHR(url).then(function(response) {
					const galleryDetector = /\/mediaindex(?:[\/\?].*)?$/i, imgStripper = /\._V\d+_[\w\,]*(?=\.)/;
					if (!galleryDetector.test(response.finalUrl)) {
						let node = response.document.head.querySelector(':scope > script[type="application/ld+json"]');
						if (node != null) try {
							let image = JSON.parse(node.text).image;
							if (typeof image == 'string') return verifyImageUrl(image.replace(imgStripper, '')).catch(reason => notFound);
						} catch(e) { console.warn(e) }
						node = response.document.querySelector('meta[property="og:image"][content]');
						return node != null && !/\/imdb\w*_logo\./i.test(node.content) ?
							node.content.replace(imgStripper, '') : notFound;
					}
					var titleId = /\/title\/(tt\d+)\//i.test(response.finalUrl) && RegExp.$1;
					return titleId ? globalXHR(response.finalUrl.replace(galleryDetector, '/mediaviewer'), { responseType: 'text' }).then(function({responseText}) {
						if (/\b(?:window\.IMDbMediaViewerInitialState)\s*=\s*(\{.*\});/.test(responseText)) try {
							let allImages = eval('(' + RegExp.$1 + ')').mediaviewer.galleries[titleId].allImages;
							if (allImages.length > 0) return allImages.map(image => image.src.replace(imgStripper, ''));
						} catch(e) { console.warn(e) }
						return notFound;
					}) : Promise.reject('title id not found');
				});
			case 'www.themoviedb.org': case 'themoviedb.org':
				if (!['movie', 'person'].some(cat => url.pathname.startsWith('/' + cat + '/'))) break;
				return globalXHR(url).then(function({document}) {
					let node = document.querySelector('meta[property="og:image"][content]');
					return verifyImageUrl(node.content.replace(/\/p\/\w+\//i, '/p/original/')).catch(function(reason) {
						node = document.querySelector('div.image_content > img');
						return verifyImageUrl(node.dataset.src.replace(/\/p\/\w+\//i, '/p/original/'))
							.catch(reason => verifyImageUrl(node.src.replace(/\/p\/\w+\//i, '/p/original/')))
							.catch(reason => verifyImageUrl(dataset.src)).catch(reason => node.src);
					}).catch(reason => notFound);
				});
			case 'www.omdb.org': case 'omdb.org':
				if (!['movie', 'person'].some(cat => url.pathname.startsWith('/' + cat + '/'))) break;
				return globalXHR(url).then(function({document}) {
					let node = document.querySelector('meta[property="og:image"][content]');
					return node != null ? verifyImageUrl(node.content) : notFound;
				});
			case 'www.thetvdb.com': case 'thetvdb.com':
				if (!['movies', 'series', 'people'].some(cat => url.pathname.startsWith('/' + cat + '/'))) break;
				return globalXHR(url).then(({document}) => verifyImageUrl(document.querySelector('img.img-responsive').src));
			case 'www.rottentomatoes.com': case 'rottentomatoes.com':
				if (!['m', 'celebrity', 'tv'].some(cat => url.pathname.startsWith('/' + cat + '/'))) break;
				return globalXHR(url).then(function({document}) {
					//if (/\b(?:context\.shell)\s*=\s*(\{.+?});/.test(response.responseText)) try {
					//	return JSON.parse(RegExp.$1).header.certifiedMedia.certifiedFreshMovieInTheater4.media.posterImg;
					//} catch(e) { console.warn(e) }
					return verifyImageUrl(document.querySelector('meta[property="og:image"]').content);
				});
			case 'www.bcdb.com': case 'bcdb.com':
				if (!['cartoon'].some(cat => url.pathname.startsWith('/' + cat + '/'))) break;
				return globalXHR(url).then(({document}) =>
					verifyImageUrl(document.location.protocol.concat(document.querySelector('meta[property="og:image"]').content)));
			case 'www.boxofficemojo.com': case 'boxofficemojo.com':
				if (!['releasegroup'].some(cat => url.pathname.startsWith('/' + cat + '/'))) break;
				return globalXHR(url).then(({document}) => verifyImageUrl(document.querySelector('div.mojo-primary-image img').src));
			case 'www.metacritic.com': case 'metacritic.com':
				return globalXHR(url).then(function({document}) {
					let image = document.querySelector('meta[property="og:image"]').content;
					return verifyImageUrl(image.replace(/-\d+h(?=(?:\.\w+)?$)/, '')).catch(reason => image);
				});
			case 'www.csfd.cz': case 'csfd.cz':
				if (!['film', 'tvurce'].some(cat => url.pathname.startsWith('/' + cat + '/'))) break;
				return globalXHR(url).then(function(response) {
					const gallerySel = 'div.ct-general.photos > div.content > ul > li > div.photo';
					if (response.document.querySelectorAll(gallerySel).length > 0) return new Promise(function(resolve, reject) {
						let urls = [], origin = new URL(response.finalUrl).origin;
						loadPage(response.finalUrl.replace(/\/strana-\d+(?=$|\/|\?)/, ''));

						function loadPage(url) {
							GM_xmlhttpRequest({ method: 'GET', url: url,
								onload: function(response) {
									if (response.status < 200 || response.status >= 400) return reject(defaultErrorHandler(response));
									let dom = domParser.parseFromString(response.responseText, 'text/html');
									Array.prototype.push.apply(urls, Array.from(dom.querySelectorAll(gallerySel))
										.map(div => /^(?:url)\s*\("?(.+?)"?\)$/i.test(div.style.backgroundImage) ?
											'https:'.concat(RegExp.$1).replace(/\?.*$/, '') : null));
									let nextPage = dom.querySelector('div.paginator > a.next[href]');
									if (nextPage != null) loadPage(origin.concat(nextPage.pathname, nextPage.search)); else resolve(urls);
								},
								onerror: response => { reject(defaultErrorHandler(response)) },
								ontimeout: response => { reject(defaultTimeoutHandler(response)) },
							});
						}
					});
					let img = ['img.film-poster', 'img.creator-photo', 'div.image > img']
						.reduce((acc, selector) => acc || response.document.querySelector(selector), null);
					return img != null ? verifyImageUrl(img.src.replace(/\?.*$/, '')) : notFound;
				});
			case 'www.fdb.cz': case 'fdb.cz':
				//if (!url.pathname.startsWith('/film/')) break;
				return globalXHR(url).then(function({document}) {
					let a = document.querySelector('a.boxPlakaty');
					if (a == null) return Promise.reject('Invalid page structure');
					a.hostname = 'www.fdb.cz';
					return globalXHR(a.href).then(function({document}) {
						let imgs = document.querySelectorAll('span#popup_plakaty > img');
						return imgs.length > 0 ? verifyImageUrl(imgs[0].src) : notFound;
					});
				});
			case 'www.caps-a-holic.com': case 'caps-a-holic.com':
				if (url.pathname == '/c.php') return globalXHR(url).then(function(response) {
					function heightExtractor(n) {
						let node = response.document.querySelector('div.main > div.c_table > div[style]:nth-of-type(' + n + ')');
						if (node != null && /\b(\d{3,})\s?[x×]\s?(\d{3,})\b/.test(node.textContent)) return parseInt(RegExp.$2);
						console.warn(response.finalUrl, 'failed to get resolution (' + n + ')', node);
						return null;
					}
					const baseUrl = 'https://caps-a-holic.com/c_image.php?a=0&x=0&y=0&l=1';
					let result = Array.from(response.document.querySelectorAll('div.main > div[style] > a > img.thumb')).map(function(img) {
						let query = new URLSearchParams(new URL(img.parentNode.href).search);
						return [
							`${baseUrl}&s=${parseInt(query.get('s1'))}&max_height=${heightExtractor(2)}`,
							`${baseUrl}&s=${parseInt(query.get('s2'))}&max_height=${heightExtractor(3)}`,
						];
					});
					result.caption = Array.from(response.document.querySelectorAll('body > div.bdinfo > div.blue_bar:first-of-type')).map(function(div) {
						let caption = div.childNodes[0].textContent.trim();
						if (div.childNodes.length > 1) caption += ' (' + div.childNodes[1].textContent.trim() + ')';
						return caption;
					});
					return result;
				}); else break;
			case 'www.screenshotcomparison.com': case 'screenshotcomparison.com':
				if (url.pathname.startsWith('/comparison/')) return globalXHR(url).then(function(response) {
					const origin = new URL(response.finalUrl).origin;
					return Array.from(response.document.querySelectorAll('div#img_nav li > a')).map(function(a) {
						return globalXHR(origin.concat(a.pathname), { responseType: 'text' }).then(({responseText}) => [
							/\b(?:images)\[1\]='(\S+?)'/.test(responseText) && RegExp.$1,
							/\b(?:images)\[0\]='(\S+?)'/.test(responseText) && RegExp.$1,
						].map(src => origin.concat(src)));
					});
				}); else break;
			case 'www.dvdbeaver.com': case 'dvdbeaver.com':
				if (url.pathname.startsWith('/film')) return globalXHR(url).then(function(response) {
					const origin = new URL(response.finalUrl).origin;
					return Array.from(response.document.querySelectorAll('div[align="center"] > table > tbody > tr > td > a[target="_blank"] > img'))
						.map(img => origin.concat(img.parentNode.pathname));
				}); else break;
		}
		return globalXHR(url, { headers: { 'Referer': url.origin } }).then(function({document}) {
			if (url.pathname.startsWith('/album/')
					&& document.querySelector('div#tabbed-content-group > div.content-listing > div.pad-content-listing') != null)
				return new Chevereto(url.hostname).galleryResolver(url);
			let elem = document.querySelector('head > meta[name="generator"][content]');
			if (elem != null && elem.content.toLowerCase() == 'bandcamp') {
				elem = document.querySelector('div#tralbumArt > a.popupImage');
				elem = elem != null ? elem.href : getFromMeta(document);
				return httpParser.test(elem) ? elem.replace(/_\d+(?=\.\w+$)/, '_0') : notFound;
			}
			return getFromMeta(document) || notFound;
		});
	}));
}

// don't clash with Upload Assistant
if (document.getElementById('upload-assistant') != null) return imageHostUploaderInit(null, null, null, imageUrlResolver);

function writeInfo() {
	let input = document.querySelector('input[name="summary"]');
	if (input != null && !input.disabled && !input.value) input.value = 'Image update/rehost';
}

const safeRehostSingleImage = imageUrl => imageHosts.rehostImages([imageUrl]).then(singleImageGetter, function(reason) {
	if (['redacted.sh'].includes(document.location.hostname) && imageUrl.includes('.img2go.com/dl/'))
		return forcedRehost(imageUrl);
	return Promise.reject(reason);
});

function setImage(url) {
	return verifyImageUrl(url).then(imageUrl => {
		this.value = imageUrl;
		//this.disabled = true;
		this.style.opacity = 0.75;
		writeInfo();
		const size = getRemoteFileSize(imageUrl);
		imagePreview(imageUrl, size);
		return checkImageSize(imageUrl, this, size).then(imageUrl => {
			return safeRehostSingleImage(imageUrl).then(imageUrl => {
				if (imageUrl == null) throw 'invalid image';
				this.value = imageUrl;
			});
		}).catch(reason => {
			this.value = imageUrl;
			logFail(reason + ' (not rehosted)');
		}).then(() => {
			this.style.opacity = null;
			this.disabled = false;
			return imageUrl;
		});
	});
}

function inputDataHandler(evt, data) {
	const input = evt.currentTarget;
	console.assert(input instanceof HTMLInputElement, 'input instanceof HTMLInputElement');

	const rehoster = imageUrl => safeRehostSingleImage(imageUrl).then(function(imageUrl) {
		if (!httpParser.test(imageUrl)) {
			console.warn('rehostImages returns invalid image URL:', imageUrl);
			throw 'invalid image URL';
		}
		input.value = imageUrl;
		writeInfo();
	});

	if (!data) return true;
	if (data.files.length > 0) {
		if (data.files[0].type && !data.files[0].type.startsWith('image/')) return true;
		input.disabled = true;
		if (input.hTimer) {
			clearTimeout(input.hTimer);
			delete input.hTimer;
		}
		input.style.color = 'white';
		input.style.backgroundColor = 'darkred';
		let progressBar = { };
		function progressHandler(worker, param = null) {
			if (param && typeof param == 'object') {
				if (param.readyState > 1 || progressBar.current != undefined && worker !== progressBar.current
						|| Date.now() < progressBar.lastUpdate + 100) return;
				let pct = Math.floor(Math.min(param.done * 100 / param.total, 100));
				if (pct <= progressBar.lastPct) return;
				input.value = 'Uploading... [' + (progressBar.lastPct = pct) + '%]';
				progressBar.lastUpdate = Date.now();
			} else if (param == null) {
				progressBar = { current: worker };
				input.value = 'Uploading...';
			}
		}
		const file = data.files[0];
		input.disabled = true;
		checkImageSize(file, input, progressHandler).catch(function(reason) {
			logFail('Downsizing of source image not possible (' + reason + '), uploading original size');
			return file;
		}).then(function(result) {
			const uploader = file => imageHosts.uploadImages([file], progressHandler).then(singleImageGetter).then(function(imageUrl) {
				input.value = imageUrl;
				imagePreview(imageUrl, file.size);
				writeInfo();
			});

			if (httpParser.test(result)) return rehoster(result).catch(function(reason) {
				logFail('Downsizing of source image failed (' + reason + '), uploading original size');
				return uploader(file);
			});
			if (result instanceof File) return uploader(result);
			console.warn('invalid checkImageSize(...) result:', result);
			return Promise.reject('invalid checkImageSize(...) result');
		}).then(function() {
			input.style.backgroundColor = '#008000';
			input.hTimer = setTimeout(function() {
				input.style.backgroundColor = null;
				input.style.color = null;
				delete input.hTimer;
			}, 10000);
		}, function(reason) {
			imageClear(evt);
			input.style.backgroundColor = null;
			input.style.color = null;
			Promise.resolve(reason).then(msg => { alert(msg) });
		}).then(() => { input.disabled = false });
		return false;
	} else if (data.items.length > 0) {
		let urls = data.getData('text/uri-list');
		if (urls) urls = urls.split(/\r?\n/); else {
			urls = data.getData('text/x-moz-url');
			if (urls) urls = urls.split(/\r?\n/).filter((item, ndx) => ndx % 2 == 0);
				else if (urls = data.getData('text/plain')) urls = urls.split(/\r?\n/);
		}
		if (!Array.isArray(urls) || urls.length <= 0) return true;
		input.disabled = true;
		console.time('Image URL Rehoster');
		imageUrlResolver(urls[0], {
			altKey: evt.altKey,
			ctrlKey: evt.ctrlKey != (input.name == 'image[]'),
			shiftKey: evt.shiftKey,
		}).then(verifyImageUrl).then(function(imageUrl) {
			input.disabled = false;
			input.style.opacity = 0.75;
			input.value = imageUrl;
			const size = getRemoteFileSize(imageUrl);
			imagePreview(imageUrl, size);
			checkImageSize(imageUrl, input, size).then(rehoster).catch(function(reason) {
				input.value = imageUrl;
				Promise.resolve(reason).then(msg => { alert(msg + ' (not rehosted)') });
			}).then(() => { console.timeEnd('Image URL Rehoster') });
		}).catch(reason => { Promise.resolve(reason).then(alert) }).then(function() {
			input.style.opacity = null;
			input.disabled = false;
		});
		return false;
	}
	return true;
}

function arrayGrouping(arr) {
	return Array.isArray(arr) ? arr.map(function(elem) {
		if (!Array.isArray(elem)) return 1;
		return elem.every(elem => !Array.isArray(elem)) ? elem.length : arrayGrouping(elem);
	}) : null;
}

function isGroupBoundary(groups, index) {
	return index > 0 && Array.isArray(groups)
		&& groups.some((len, ndx, arr) => index == arr.slice(0, ndx).reduce((acc, len) => acc + len, 0));
}

let opti_PNG = GM_getValue('optipng', false);

function rehoster(promises, resultsHandler, target = null) {
	if (!Array.isArray(promises)) throw 'invalid parameter';
	console.time('Image URL Resolver');
	return Promise.all(promises).then(function(resolved) {
		let resolvedUrls = resolved.flatten();
		if (target instanceof HTMLElement) {
			target.disabled = true;
			if (resolvedUrls.length > 1 && !['notwhat.cd'].some(hostname => document.domain == hostname))
				var progressBar = new RHProgressBar(target, resolvedUrls.length);
		}
		return (function() {
			if (!opti_PNG || !(target instanceof HTMLElement)) return Promise.resolve(resolvedUrls);
			return Promise.all(resolvedUrls.map(resolvedUrl => optiPNG(resolvedUrl).catch(reason => resolvedUrl)));
		})().then(srcUrls => imageHosts.rehostImages(srcUrls, RHProgressBar.prototype.update.bind(progressBar)).catch(function(reason) {
			logFail(reason + ' (not rehosted)');
			RHProgressBar.prototype.update.call(progressBar, -1, false);
			return verifyImageUrls(srcUrls);
		}).then(function(results) {
			resolved.forEach(function(elem, index) {
				if (!elem.caption) return;
				if (!Array.isArray(results.captions)) results.captions = [ ];
				results.captions.push(elem.caption);
			});
			resultsHandler(results, arrayGrouping(resolved).flatten());
		}).catch(reason => { Promise.resolve(reason).then(msg => { alert(msg) }) })).then(function() {
			RHProgressBar.prototype.cleanUp.call(progressBar);
			if (target instanceof HTMLElement) target.disabled = false;
			console.timeEnd('Image URL Resolver');
		});
	});
}

function textAreaDropHandler(evt) {
	if (!evt.dataTransfer || evt.shiftKey) return true;
	const textArea = evt.currentTarget;
	console.assert(textArea instanceof HTMLTextAreaElement, 'textArea instanceof HTMLTextAreaElement');
	if (evt.dataTransfer.files.length > 0) {
		let images = Array.from(evt.dataTransfer.files).filter(file => !file.type || file.type.startsWith('image/'));
		if (images.length <= 0) return true;
		textArea.disabled = true;
		if (!['notwhat.cd'].some(hostname => document.domain == hostname))
			var progressBar = new ULProgressBar(textArea, images.map(image => image.size));
		(function() {
			if (!opti_PNG || !images.every(image => image.type == 'image/png')) return Promise.reject('!optiPNG');
			ULProgressBar.prototype.update.call(progressBar, -1);
			return rehoster([Promise.all(images.map((image, index) => optiPNG(image, (param = null) =>
				ULProgressBar.prototype.update.call(progressBar, -1, param, index))))], resultsHandler);
		})().catch(reason => imageHosts.uploadImages(images, ULProgressBar.prototype.update.bind(progressBar)).then(resultsHandler))
		.catch(reason => { Promise.resolve(reason).then(msg => { alert(msg) }) })
		.then(function() {
			ULProgressBar.prototype.cleanUp.call(progressBar);
			textArea.disabled = false;
		});
		evt.stopPropagation();
		return false;
	} else if (evt.dataTransfer.items.length > 0) {
		let content = evt.dataTransfer.getData('text/uri-list');
		if (content) content = content.split(/(?:\r?\n)+/); else {
			content = evt.dataTransfer.getData('text/x-moz-url');
			if (content) content = content.split(/(?:\r?\n)+/).filter((item, ndx) => ndx % 2 == 0);
		};
		if (!Array.isArray(content) || content.length <= 0) return true;
		rehoster(content.map(url => imageUrlResolver(url, { ctrlKey: !evt.ctrlKey })), resultsHandler, textArea).catch(function(reason) {
			if (evt.ctrlKey)
				textArea.value = textArea.value.slice(0, evt.rangeOffset) + content.join('\n') +
					textArea.value.slice(evt.rangeOffset);
			else {
				if (textArea.value.length > 0) textArea.value += '\n\n';
				textArea.value += content.join('\n');
			}
		});
		evt.stopPropagation();
		return false;
	}
	return true;

	function resultsHandler(results, groups = undefined) {
		if (results.length <= 0) return;
		if (evt.altKey && !textArea.noBBCode) {
			let modal = document.createElement('div');
			modal.id = 'ihh-template-selector-background';
			modal.style = 'position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: #0008;' +
				'opacity: 0; transition: opacity 0.15s linear;';
			modal.innerHTML = `
<form id="ihh-template-selector" style="background-color: darkslategray; position: absolute; top: 30%; left: 35%; border-radius: 0.5em; padding: 20px 30px;">
	<div style="color: white; margin-bottom: 20px;">Insert as:</div>
	<input id="btn-insert" type="button" value="Insert" style="margin-top: 30px"/>
	<input id="btn-cancel" type="button" value="Cancel" style="margin-top: 30px"/>
</form>
`;
			document.body.append(modal);
			let form = document.getElementById('ihh-template-selector'),
					btnInsert = form.querySelector('input#btn-insert'),
					btnCancel = form.querySelector('input#btn-cancel');
			if (form == null || btnInsert == null || btnCancel == null) {
				console.warn('Dialog creation error');
				insertResults();
				return;
			}
			[
				['BBcode: original size', 1],
				['BBcode: thumbnails with link to original', 2],
				['BBcode: thumbnails with link to share page', 3],
				['BBcode: screenshot comparison (PTP)', 4],
				['BBcode: screenshot comparison + encode images (PTP)', 5],
				['Markdown: original size', 9],
				['HTML: original size', 6],
				['HTML: thumbnails with link to original', 7],
				['HTML: thumbnails with link to share page', 8],
				['Raw links', 0],
			].forEach(function(item) {
				let radio = document.createElement('input');
				radio.type = 'radio';
				radio.name = 'template';
				radio.value = item[1];
				radio.style = 'margin: 5px 15px 5px 0px; cursor: pointer;';
				let label = document.createElement('label');
				label.style = 'color: white; cursor: pointer; -webkit-user-select: none; ' +
					'-moz-user-select: none; -ms-user-select: none; user-select: none;';
				label.append(radio);
				label.append(item[0]);
				form.insertBefore(label, btnInsert);
				let br = document.createElement('br');
				form.insertBefore(br, btnInsert);
			});
			if (!results.some(result => typeof result == 'object'
					&& httpParser.test(result.original) && httpParser.test(result.thumb))) disableItem(2, 7);
			if (!results.some(result => typeof result == 'object'
					&& httpParser.test(result.original) && httpParser.test(result.share))) disableItem(3, 8);
			if (results.length % 2 != 0) disableItem(4, 5);
			form.onclick = evt => { evt.stopPropagation() };
			btnInsert.onclick = function(evt) {
				let template = document.querySelector('form#ihh-template-selector input[name="template"]:checked');
				if (template != null) template = parseInt(template.value);
				modal.remove();
				insertResults(template);
			};
			modal.onclick = btnCancel.onclick = evt => { modal.remove() };
			window.setTimeout(() => { modal.style.opacity = 1 });

			function disableItem(...n) {
				n.forEach(function(n) {
					let radio = document.querySelector('div#ihh-template-selector input[type="radio"][value="' + n + '"]');
					if (radio == null) return;
					radio.parentNode.style.opacity = 0.5;
					radio.disabled = true;
				});
			}
		} else insertResults();

		function insertResults(template = 1) {
			if (textArea.noBBCode) template = 0;
			if (typeof template != 'number' || isNaN(template)) return;
			let code = '', nl = [6, 7, 8].includes(template) ? '<br>\n' : '\n', _template;
			results.forEach(function(result, index) {
				if (_template == 1 && /\[img\]\[\/img\]/i.test(textArea.value)) {
					textArea.value = RegExp.leftContext + '[img]' + getImgUrl(result) + '[/img]' + RegExp.rightContext;
					return;
				}
				_template = template;
				if (template == 2 && (typeof result != 'object' || !httpParser.test(result.original) || !httpParser.test(result.thumb))
						|| template == 3 && (typeof result != 'object' || !httpParser.test(result.share) || !httpParser.test(result.thumb)))
					_template = 1;
				else if (template == 7 && (typeof result != 'object' || !httpParser.test(result.original) || !httpParser.test(result.thumb))
						|| template == 8 && (typeof result != 'object' || !httpParser.test(result.share) || !httpParser.test(result.thumb)))
					_template = 6;
				else _template = template;
				if (index > 0) {
					let thumb = [2, 3, 7, 8].includes(_template);
					code += isGroupBoundary(groups, index) ? thumb ? nl : nl + nl : thumb ? ' ' : nl;
				}
				switch (_template) {
					case 0: case 4: case 5: code += getImgUrl(result); break;
					case 1: code += '[img]' + getImgUrl(result) + '[/img]'; break;
					case 2: code += '[url=' + getImgUrl(result) + '][img]' + result.thumb + '[/img][/url]'; break;
					case 3: code += '[url=' + result.share + '][img]' + result.thumb + '[/img][/url]'; break;
					case 6: code += '<img src="' + getImgUrl(result) + '">'; break;
					case 7: code += '<a href="' + getImgUrl(result) + '" target="_blank"><img src="' + result.thumb + '"></a>'; break;
					case 8: code += '<a href="' + result.share + '" target="_blank"><img src="' + result.thumb + '"></a>'; break;
					case 9: code += '![](' + getImgUrl(result) + ')'; break;
				}
			});
			if ([4, 5].includes(template)) {
				if (Array.isArray(results.captions)) {
					var captions = results.captions.shift();
					if (Array.isArray(captions)) captions = captions.join(', ');
				}
				code = '[comparison=' + (captions || 'Source, Encode') + ']' + code + '[/comparison]';
				if (template == 5) {
					code += nl;
					results.forEach((result, index) => { if (index % 2 != 0) code += nl + '[img]' + getImgUrl(result) + '[/img]' });
				}
			}
			if (textArea.value.trimRight().length <= 0) textArea.value = code; else if (evt.ctrlKey) {
				textArea.value = textArea.value.slice(0, evt.rangeOffset) + code + textArea.value.slice(evt.rangeOffset);
			} else textArea.value = textArea.value.trimRight() + nl + nl + code;

			function getImgUrl(result) {
				if (typeof result == 'object' && httpParser.test(result.original)) return result.original;
				if (typeof result == 'string' && httpParser.test(result)) return result;
				throw 'Invalid result format';
			}
		}
	}
}

function textAreaPasteHandler(evt) {
	if (!evt.clipboardData) return true;
	const textArea = evt.currentTarget;
	console.assert(textArea instanceof HTMLTextAreaElement, 'textArea instanceof HTMLTextAreaElement');
	if (evt.clipboardData.files.length > 0) {
		let images = Array.from(evt.clipboardData.files).filter(file => !file.type || file.type.startsWith('image/'));
		if (images.length <= 0) return true;
		textArea.disabled = true;
		if (!['notwhat.cd'].some(hostname => document.domain == hostname))
			var progressBar = new ULProgressBar(textArea, images.map(image => image.size));
		(function() {
			if (!opti_PNG || !images.every(image => image.type == 'image/png')) return Promise.reject('!optiPNG');
			ULProgressBar.prototype.update.call(progressBar, -1);
			return rehoster([Promise.all(images.map((image, index) => optiPNG(image, (param = null) =>
				ULProgressBar.prototype.update.call(progressBar, -1, param, index))))], resultsHandler);
		})().catch(reason => imageHosts.uploadImages(images, ULProgressBar.prototype.update.bind(progressBar)).then(resultsHandler))
		.catch(reason => { Promise.resolve(reason).then(msg => { alert(msg) }) })
		.then(function() { // __finally
			ULProgressBar.prototype.cleanUp.call(progressBar);
			textArea.disabled = false;
		});
		evt.stopPropagation();
		return false;
	} else if (evt.clipboardData.items.length > 0) {
		return true;
		let urls = evt.clipboardData.getData('text/plain').split(/(?:\r?\n)+/);
		if (urls.length <= 0 || !urls.every(RegExp.prototype.test.bind(httpParser))) return true;
		rehoster(urls.map(url => imageUrlResolver(url, { ctrlKey: !evt.ctrlKey })), resultsHandler, textArea);
		evt.stopPropagation();
		return false;
	}
	return true;

	function resultsHandler(results, groups = undefined) {
		let selStart = textArea.selectionStart, phpBB = '';
		results.forEach(function(result, index) {
			let thumb = evt.altKey && !textArea.noBBCode && typeof result == 'object'
				&& httpParser.test(result.originasl) && httpParser.test(result.thumb);
			if (index > 0) phpBB += isGroupBoundary(groups, index) ? thumb ? '\n' : '\n\n' : thumb ? ' ' : '\n';
			if (typeof result == 'object' && result.original) var imgUrl = result.original;
				else if (typeof result == 'string') imgUrl = result;
					else throw 'Invalid result format';
			phpBB += textArea.noBBCode ? phpBB += imgUrl : !thumb ? '[img]' + imgUrl + '[/img]'
				: '[url=' + imgUrl + '][img]' + result.thumb + '[/img][/url]';
		});
		if (phpBB.length <= 0) return;
		textArea.value = textArea.value.slice(0, selStart) + phpBB + textArea.value.slice(textArea.selectionEnd);
		textArea.setSelectionRange(selStart + phpBB.length, selStart + phpBB.length);
	}
}

imageHostUploaderInit(inputDataHandler, textAreaDropHandler, textAreaPasteHandler, imageUrlResolver);

function hookToRoot(root = document.body) {
	if (!(root instanceof HTMLElement)) throw 'Assertion failed: argument not HTML element';
	if (root != document && root != document.body) console.log('[IHH] Attaching drop/paste handlers to', root);
	// Set single input UI handlers
	let imageInputMatch = GM_getValue('image_input_match', '/(?:image|img|picture|cover|photo|avatar|poster|screen)/i');
	if ((imageInputMatch = /^\/(.+)\/([dgimsuy]*)$/.exec(imageInputMatch)) != null) try {
		imageInputMatch = new RegExp(imageInputMatch[1], imageInputMatch[2]);
		for (let input of root.getElementsByTagName('INPUT')) if (['text', 'url'].includes(input.type)
				&& ['id', 'name'].some(attribute => imageInputMatch.test(input[attribute] || input.getAttribute(attribute))))
			setInputHandlers(input);
	} catch(e) { console.warn('Image Host Helper: failed to compile image input matcher', e, imageInputMatch) }
		else console.warn('Image Host Helper: custom text inputs match expression not in proper regexp format; no text inputs will be handled');
	// Set multiple inputs UI handlers
	for (let textArea of root.getElementsByTagName('TEXTAREA'))
		if (!['ua-data'].some(id => textArea.id == id) && ![
			'no-image-host-helper', 'no-ihh', 'image-host-helper-aware', 'no-image-input',
		].some(cls => textArea.classList.contains(cls))) setTextAreahandlers(textArea);
}
hookToRoot();
let siteDynaloads = GM_getValue('site_dynaloads');
if (typeof siteDynaloads == 'string') try { siteDynaloads = JSON.parse(siteDynaloads) } catch(e) { console.warn(e) }
if (siteDynaloads && typeof siteDynaloads == 'object' && (siteDynaloads = siteDynaloads[document.location.hostname])) {
	if (typeof siteDynaloads == 'string') siteDynaloads = siteDynaloads.split(/\s*[,;]\s*/);
	if (Array.isArray(siteDynaloads) && siteDynaloads.length > 0) for (let selector of siteDynaloads)
		for (let mountPoint of document.body.querySelectorAll(selector)) {
			console.log('[IHH] Watching for added content on', mountPoint);
			new MutationObserver((ml, mo) => { for (let mutation of ml) mutation.addedNodes.forEach(hookToRoot) })
				.observe(mountPoint, { childList: true });
		}
}

{
	const tbody = document.body.querySelector('div#dynamic_form > table > tbody');
	if (tbody != null) new MutationObserver(function(ml, mo) {
		for (let mutation of ml) for (let node of mutation.addedNodes)
			if (node.tagName == 'TR' && node.id.startsWith('extra_format_row'))
				for (let option of node.querySelectorAll('select > option'))
					if (option.label.startsWith('function(')) option.remove();
	}).observe(tbody, { childList: true });
}

switch (document.location.pathname) {
	case '/torrents.php': {
		if (!document.location.search.startsWith('?id=')) break;
		const addCoversForm = document.getElementById('add_cover');
		if (addCoversForm != null) new MutationObserver(function(mutationsList, mo) {
			for (let mutation of mutationsList) mutation.addedNodes.forEach(function(node) {
				if (node.nodeName == 'INPUT' && node.type == 'text' && node.name == 'image[]') setInputHandlers(node);
			});
		}).observe(addCoversForm, { childList: true });
		break;
	}
	case '/reportsv2.php': {
		const dynaForm = document.getElementById('dynamic_form');
		if (dynaForm == null) break;
		function setReportHandlers(root = dynaForm) {
			root.querySelectorAll('input[id*="image"]').forEach(setInputHandlers);
			for (let ta of root.getElementsByTagName('TEXTAREA')) setTextAreahandlers(ta);
		}
		new MutationObserver(function(mutationsList, mo) {
			for (let mutation of mutationsList) mutation.addedNodes.forEach(function(node) {
				if (node.nodeType == Node.ELEMENT_NODE) setReportHandlers(node);
			});
		}).observe(dynaForm, { childList: true });
		break;
	}
	case '/forums.php': {
		if (!document.location.search.startsWith('?action=viewthread&')) break;
		let container = document.querySelector('div#content > div.thin');
		if (container != null) new MutationObserver(function(mutationsList, mo) {
			for (let mutation of mutationsList) mutation.addedNodes.forEach(function(node) {
				if (node.nodeName == 'FORM') for (let elem of node.getElementsByTagName('TEXTAREA')) setTextAreahandlers(elem);
			});
		}).observe(container, { childList: true, subtree: true });
		break;
	}
}

let bpAccessToken;
// site-specific extensions
switch (document.domain) {
	case 'passthepopcorn.me':
		// Auto-fill missing/invalid images from IMDB
		if (document.location.pathname == '/artist.php' && /^\?action=edit&artistid=(\d+)\b/i.test(document.location.search)
				&& GM_getValue('auto_lookup_artist_image', true)) {
			let artistId = parseInt(RegExp.$1), input = document.querySelector('input[name="image"]');
			if (input != null) verifyImageUrl(input.value).catch(function(reason) {
				if (input.value) input.value = '';
				localXHR('/artist.php?id=' + artistId).then(function(dom) {
					let imdb = dom.querySelector('div#artistinfo > div.panel__body > ul.list > li > a');
					if (imdb != null) imageUrlResolver(imdb.href)
						.then(setImage.bind(input), reason => { logFail('No IMDB photo of this artist') });
				});
			});
		} else if (document.location.pathname == '/torrents.php'
				&& /^\?action=editgroup&groupid=(\d+)\b/i.test(document.location.search)
				&& GM_getValue('auto_lookup_artist_image', true)) {
			let groupId = parseInt(RegExp.$1), input = document.querySelector('input[name="image"]');
			if (input != null) verifyImageUrl(input.value).catch(function(reason) {
				if (input.value) input.value = '';
				localXHR('/torrents.php?id=' + groupId).then(function(dom) {
					let imdb = dom.querySelector('a#imdb-title-link');
					if (imdb != null) imageUrlResolver(imdb.href)
						.then(setImage.bind(input), reason => { logFail('No IMDB poster for this movie') });
				});
			});
		}
		// hook to HJ Member Toolkit
		new MutationObserver(function(mutationsList, mo) {
			for (let mutation of mutationsList) mutation.addedNodes.forEach(function(node) {
				if (node.nodeName != 'DIV' || !node.classList.contains('HJ-toolkit-member-toolbar')) return;
				mo.disconnect();
				new MutationObserver(function(mutationsList, mo) {
					for (let mutation of mutationsList) mutation.addedNodes.forEach(function(node) {
						if (node.nodeName != 'DIV' || !node.classList.contains('HJ-toolkit-member-toolbar-flex')) return;
						mo.disconnect();
						node.querySelectorAll([
							//'textarea[id^="HJMA"]',
							'textarea[name="screenshots"]',
							'textarea[name="comparisons"]',
						].join(',')).forEach(setTextAreahandlers);
					});
				}).observe(node, { childList: true, subtree: true });
			});
		}).observe(document.body, { childList: true });
		break;
	case 'redacted.sh':
	case 'orpheus.network':
	case 'dicmusic.club': case 'dicmusic.com':
	case 'notwhat.cd':
		switch (document.location.pathname.slice(1)) {
			case 'upload.php':
				document.body.querySelectorAll('input[type="text"][name="verification"]').forEach(setInputHandlers);
				break;
			case 'artist.php':
				if (document.location.search.startsWith('?action=edit&')) {
					const imageInput = document.body.querySelector('input[name="image"]');
					console.assert(imageInput != null, 'Image input not found!');
					if (imageInput == null) break; // assertion failed
					let artist = document.body.querySelector('div.header > h2 > a');
					console.assert(artist != null, 'Artist title not found!');
					if (artist != null) artist = artist.textContent.trim(); else break; // throw 'Artist name not found';

					function lookupArtistImage() {
						function resultsFilter(results0, nameExtractor) {
							const tailingBracketStripper = [/\s*\(([^\(\)]+)\)\s*$/, ''],
										norm = artist => artist && artist.replace(/\s+/g, '').toLowerCase();
							const transforms = [n => n && n.replace(...tailingBracketStripper),
								n => n && (n = tailingBracketStripper[0].exec(n)) && n[1]];
							let results = results0.filter(function(result) {
								let n = [artist, nameExtractor(result)].map(n => transforms.map(func => func(n)));
								for (let i = 0; i < 2; ++i) if (n[0][i]) for (let j = 0; j < 2; ++j)
									if (n[1][j] && norm(n[0][i]) == norm(n[1][j])) return true;
								return norm(n[0][0].toASCII()) == norm(n[1][0].toASCII());
							}), f;
							if (results.length > 1) {
								f = results0.filter(result => nameExtractor(result).replace(...tailingBracketStripper).toASCII().toLowerCase()
									== artist.replace(...tailingBracketStripper).toASCII().toLowerCase());
								if (f.length > 0) results = f;
							}
							if (results.length > 1) {
								f = results0.filter(result => nameExtractor(result).replace(...tailingBracketStripper).toLowerCase()
									== artist.replace(...tailingBracketStripper).toLowerCase());
								if (f.length > 0) results = f;
							}
							return results;
						}

						const lookupWorkers = [
							// Qobuz
							globalXHR('https://www.qobuz.com/shop', { responseType: 'text' }).then(function({responseText}) {
								const rx = /^\s*(?:(?:window\.)?qobuz\.algolia(\d+))\s*=\s*(\{.*\});/gm, algolia = { };
								let m;
								while ((m = rx.exec(responseText)) != null) try {
									const obj = JSON.parse(m[2]);
									if (obj.api_key && obj.application_id) algolia[parseInt(m[1])] = obj;
								} catch (e) { console.warn(e) }
								return algolia[2] ? algolia : Promise.reject('unexpected page structure');
							}).then(algolia => globalXHR(`https://${algolia[2].application_id.toLowerCase()}-1.algolianet.com/1/indexes/${algolia[2].index.main_artists}/query?${new URLSearchParams({
								'x-algolia-application-id': algolia[2].application_id,
								'x-algolia-api-key': algolia[2].api_key,
							}).toString()}`, { responseType: 'json' }, { 'params': 'query=' + encodeURIComponent(artist) })).then(function({response}) {
								if (response.nbHits <= 0) return Promise.reject('Qobuz: no matches');
								let results = resultsFilter(response.hits, result => result.name);
								if (results.length <= 0) return Promise.reject('Qobuz: no matches');
								console.info('Qobuz search results for "' + artist + '":', results);
								if (results.length > 1) return Promise.reject('Qobuz: ambiguity');
								if (results.length > 1) console.info('Qobuz returns ambiguous results for "' + artist + '":', results);
								return httpParser.test(results[0].image) ? results[0].image.replace(/(\/artists\/covers)\/\w+\//i, '$1/large/')
									: Promise.reject('Qobuz: artist exists but no photo');
							}),
							// AllMusic
							globalXHR('https://www.allmusic.com/search/artists/' + encodeURIComponent(artist)).then(function({document}) {
								let results = resultsFilter(Array.from(document.body.querySelectorAll('div#resultsContainer > div > div.artist')).map(function(div) {
									let result = {
										name: div.querySelector('div.name > a'),
										genres: div.querySelector('div.genres'),
										decades: div.querySelector('div.decades'),
									};
									Object.keys(result).forEach(key => {
										result[key] = result[key] != null ? result[key].textContent.trim() || undefined : undefined;
									});
									if (result.genres) result.genres = result.genres.split(',').map(genre => genre.trim());
									result.url = div.querySelector('div.name > a');
									result.url = result.url != null ? result.url.href : undefined;
									result.id = (result.id = /-(mw\d{10})$/i.exec(result.url)) != null ? result.id[1] : undefined;
									if ((result.image = div.querySelector('div.photo img')) != null) try {
										result.image = new URL(result.image.src);
										result.image.searchParams.set('f', 0);
										result.image = result.image.href;
									} catch(e) { console.warn(e) } else result.image = undefined;
									return result;
								}), result => result.name);
								if (results.length <= 0) return Promise.reject('AllMusic: no matches');
								console.info('AllMusic search results for "' + artist + '":', results);
								if (results.length > 1) return Promise.reject('AllMusic: ambiguity');
								if (results.length > 1) console.info('Qobuz returns ambiguous results for "' + artist + '":', results);
								if (!httpParser.test(results[0].image)) return Promise.reject('AllMusic: artist exists but no photo');
								return verifyImageUrl(results[0].image.replace(/\b(?:f)=\d+$/i, 'f=6'))
									.catch(reason => verifyImageUrl(results[0].image.replace(/\b(?:f)=\d+$/i, 'f=0')))
									.catch(reason => verifyImageUrl(results[0].image.replace(/\b(?:f)=\d+$/i, 'f=5')));
							}),
							// NetEase
							globalXHR('https://music.163.com/api/cloudsearch/get/web?' + new URLSearchParams({
								s: '"' + artist + '"',
								type: 100,
								limit: 50,
								//csrf_token: '',
							}).toString(), { responseType: 'json' }).then(function({response}) {
								if (!response.result) return Promise.reject('API returns malformed result');
								return !response.abroad ? response.result : (function() {
									function injectScript(src, errorHandler) {
										console.assert(src);
										coreJS = document.createElement('script');
										coreJS.id = 'netease.core.js';
										coreJS.type = 'text/javascript';
										coreJS.async = false;
										const promise = new Promise(function(resolve, reject) {
											function errorHandler(currentTarget, reason) {
												console.warn('NetEase core.js (%s): %s', currentTarget.src, reason);
												if (typeof errorHandler == 'function') errorHandler(resolve, reject, currentTarget);
													else reject('NetEase core.js ' + reason);
											}

											coreJS.onload = function(evt) {
												if ([/*'asrsea', */'settmusic'].every(function(pubSym) {
													try { return typeof eval(pubSym) == 'function' } catch(e) { return false }
												})) resolve(evt.currentTarget); else errorHandler(evt.currentTarget, 'public functions not accessible');
											};
											coreJS.onerror = evt => { errorHandler(evt.currentTarget, 'loading error') };
											coreJS.src = src;
											document.head.append(coreJS);
										});
										return (coreJS.loader = promise);
									}

									var coreJS = document.getElementById('netease.core.js');
									if (coreJS != null && coreJS.loader instanceof Promise) return coreJS.loader;
									return injectScript('https://s1.music.126.net/web/s/core.js', function(resolve, reject, currentScript) {
										console.warn('Trying to fetch core.js url from root doc');
										globalXHR('https://music.163.com/').then(function({document}) {
											const script = document.body.querySelector(':scope > script[src*="/core"]');
											if (script != null && script.src) {
												window.document.head.removeChild(currentScript);
												injectScript(script.src).then(resolve, reject);
											} else reject('Invalid root document structure');
										}, reject);
									});
								})().then(core => decodeURIComponent(settmusic(response.result, 'fuck~#$%^&*(458')));
							}).then(result => JSON.parse(result)).then(result => result.artistCount > 0 ?
									result.artists : Promise.reject('NetEase: no matches'), function(reason) {
								console.warn('NetEase search-list method failed:', reason);
								return globalXHR('https://music.163.com/api/search/suggest/web?'+ new URLSearchParams({
									s: '"' + artist + '"',
									type: 100,
									limit: 50,
									//csrf_token: '',
								}, { responseType: 'json' })).then(function({response}) {
									if (response.code != 200 || !response.result)
										return Promise.reject('API returns malformed result (' + response.msg + ')');
									return Array.isArray(response.result.artists) && response.result.artists.length > 0 ?
										response.result.artists : Promise.reject('NetEase: no matches');
								});
							}).then(function(results) {
								console.assert(Array.isArray(results) && results.length > 0, "Array.isArray(results) && results.length > 0");
								if (!Array.isArray(results) || results.length <= 0) return Promise.reject('NetEase: no matches');
								results = resultsFilter(results/*.filter(artist => artist.picId > 0)*/, result => result.name);
								if (results.length <= 0) return Promise.reject('NetEase: no matches');
								console.info('NetEase search results for "' + artist + '":', results);
								if (results.length > 1) return Promise.reject('NetEase: ambiguity');
								//if (results.length > 1) console.info('NetEase returns ambiguous results for "' + artist + '":', results);
								const imgMax = imgUrl => imgUrl.replace(/\?.*$/, '').replace(/\b(?:p[123])(?=\.music\.\d+\.net\b)/i, 'p4');
								const isDummy = imgUrl => ['/5639395138885805.jpg'].some(dummy => imgUrl.toLowerCase().endsWith(dummy));
								if (results[0].picId > 0 && httpParser.test(results[0].picUrl) && !isDummy(results[0].picUrl))
									return imgMax(results[0].picUrl);
								if (results[0].img1v1 > 0 && httpParser.test(results[0].img1v1Url) && !isDummy(results[0].img1v1Url))
									return imgMax(results[0].img1v1Url);
								return Promise.reject('NetEase: artist exists but no photo');
							}),
							// Tidal
							tidalAccess.requestAPI('search/artists', { query: artist, limit: 25 }).then(function(response) {
								if (response.totalNumberOfItems <= 0) return Promise.reject('Tidal: no matches');
								let results = resultsFilter(response.items, item => item.name);
								if (results.length <= 0) return Promise.reject('Tidal: no matches');
								console.info('Tidal search results for "' + artist + '":', results);
								if (results.length > 1) return Promise.reject('Tidal: ambiguity');
								if (results.length > 1) console.info('Tidal returns ambiguous results for "' + artist + '":', results);
								if (!results[0].picture) return Promise.reject('Tidal: artist exists but no photo');
								return 'https://resources.tidal.com/images/' + results[0].picture.replace(/-/g, '/') + '/750x750.jpg';
							}),
							// Discogs
							globalXHR('https://api.discogs.com/database/search?' + new URLSearchParams({
								title: artist,
								type: 'artist',
								sort: 'score',
								sort_order: 'desc',
								strict: false,
								per_page: 100,
							}).toString(), {
								responseType: 'json',
								headers: { 'Authorization': 'Discogs key="' + discogsKey + '", secret="' + discogsSecret + '"' },
							}).then(({response}) => {
								if (response.items <= 0) return Promise.reject('Discogs: no matches');
								let results = resultsFilter(response.results.filter(result => result.type == 'artist'), result => result.title);
								if (results.length <= 0) return Promise.reject('Discogs: no matches');
								console.info('Discogs search results for "' + artist + '":', results);
								//if (results.length > 1) return Promise.reject('Discogs: ambiguity');
								if (results.length > 1) console.info('Discogs returns ambiguous results for "' + artist + '":', results);
								return Promise.all(results.map(result => {
									if (result.cover_image.includes('/spacer.gif')) return null;
									return getDiscogsImageMax(result.cover_image);
								}).filter(Boolean)).then(artistCovers => httpParser.test(artistCovers[0]) ?
									artistCovers[0] : Promise.reject('Discogs: artist exists but no photo'));
							}),
							// Bandcamp
							globalXHR('https://bandcamp.com/search?' + new URLSearchParams({
								q: '"' + artist + '"',
								item_type: 'b',
							}).toString()).then(function({document}) {
								const results = resultsFilter(Array.from(document.querySelectorAll('div.results > ul.result-items > li.searchresult')).map(function(li) {
									try {
										var result = JSON.parse(li.dataset.search);
										if (result.type.toLowerCase() != 'b') return;
									} catch(e) {
										result = { }; // return;
										console.warn('Bandcamp: could not detect search result type', li);
									}
									if (!result.id) try {
										if (/\b(?:id)=(\d+)\b/.test(li.previousSibling.previousSibling.nodeValue))
											result.id = parseInt(RegExp.$1);
									} catch(e) { }
									let ref = li.querySelector('div.art > img');
									if (ref != null) result.imageUrl = ref.src.replace(/_\d+(?=\.\w+$)/, '_0');
									if ((ref = li.querySelector('div.heading > a')) != null) {
										result.url = new URL(ref);
										result.url.search = '';
										result.name = ref.textContent.trim();
									}
									if ((ref = li.querySelector('div.subhead')) != null) result.location = ref.textContent.trim();
									if ((ref = li.querySelector('div.genre')) != null)
										result.genre = ref.textContent.trim().replace(/^(?:Genre:\s+)/i, '');
									if ((ref = li.querySelector('div.tags')) != null)
										result.tags = ref.textContent.trim().replace(/^(?:tags):\s+/, '').split(/\s*,\s*/);
									if (result.name) return result;
								}).filter(Boolean), result => result.name);
								if (results.length <= 0) return Promise.reject('Bandcamp: no matches');
								console.info('Bandcamp search results for "' + artist + '":', results);
								if (results.length > 1) return Promise.reject('Bandcamp: ambiguity');
								if (results.length > 1) console.info('Bandcamp returns ambiguous results for "' + artist + '":', results);
								return httpParser.test(results[0].imageUrl) ? results[0].imageUrl
									: Promise.reject('Bandcamp: artist exists but no photo');
							}),
							// Beatport
							(function setAccessToken() {
								const isTokenValid = accessToken => accessToken && accessToken.token_type
									&& accessToken.access_token && accessToken.expires_at >= Date.now() + 30 * 1000;
								return bpAccessToken instanceof Promise ? bpAccessToken.then(accessToken =>
										isTokenValid(accessToken) ? accessToken : Promise.reject('expired or otherwise invalid')).catch(function(reason) {
									bpAccessToken = null;
									console.info('Discarding Beatsource access token:', reason);
									return setAccessToken();
								}) : (bpAccessToken = (function() {
									if ('beatportAccessToken' in localStorage) try {
										const accessToken = JSON.parse(localStorage.getItem('beatportAccessToken'));
										if (!isTokenValid(accessToken)) throw 'Expired or otherwise invalid';
										console.info('Re-using cached Beatport access token:', accessToken,
											'expires at', new Date(accessToken.expires_at).toTimeString(),
											'(+' + ((accessToken.expires_at - Date.now()) / 1000 / 60).toFixed(2) + 'm)');
										return Promise.resolve(accessToken);
									} catch(e) { localStorage.removeItem('beatportAccessToken') }
									const timeStamp = Date.now(), urlBase = 'https://www.beatport.com/api/auth';
									return globalXHR(urlBase + '/session', { responseType: 'json' }).then(function(response) {
										const getCookie = (responseHeaders, cookie) =>
											(cookie = new RegExp(`^(?:set-cookie):\\s*${cookie}=(.+)$`, 'im')
												.exec(responseHeaders)) && cookie[1].split(';').map(val => val.trim());
										let cookie = getCookie(response.responseHeaders, '__Secure-next-auth\\.session-token');
										if (cookie != null) return response.response;
										const postData = { };
										if ((cookie = getCookie(response.responseHeaders, '__Host-next-auth\\.csrf-token')) != null)
											postData.csrfToken = cookie[0].split('|')[0];
										else return Promise.reject('Cookie not received');
										if ((cookie = getCookie(response.responseHeaders, '__Secure-next-auth\\.callback-url')) != null)
											postData.callbackUrl = cookie[0];
										else return Promise.reject('Cookie not received');
										return globalXHR(urlBase + '/callback/anonymous', {
											data: new URLSearchParams(Object.assign(postData, { json: true })),
										}).then(({responseHeaders}) =>
											(cookie = getCookie(responseHeaders, '__Secure-next-auth\\.session-token')) != null ?
												cookie[0] : Promise.reject('Cookie not received'))
										.then(token => globalXHR(urlBase + '/session', {
											responseType: 'json',
											cookie: '__Secure-next-auth.session-token=' + token,
										})).then(({response}) => response);
									}).then(function({token}) {
										if (!(token = {
											token_type: token.tokenType,
											access_token: token.accessToken,
											timestamp: timeStamp,
											expires_in: token.expiresIn,
											expires_at: token.accessTokenExpires,
										}).expires_at) token.expires_at = token.timestamp + (token.expires_in_ms || token.expires_in * 1000);
										if (!isTokenValid(token)) {
											console.warn('Received invalid Beatport token:', token);
											return Promise.reject('invalid token received');
										}
										try { localStorage.setItem('beatportAccessToken', JSON.stringify(token)) } catch(e) { console.warn(e) }
										console.log('Beatport access token successfully set:',
											token, `(+${(Date.now() - token.timestamp) / 1000}s)`);
										return token;
									});
								})().catch(function() {
									const isTokenValid = accessToken => accessToken && accessToken.token_type
										&& accessToken.access_token && accessToken.expires_at >= Date.now() + 30 * 1000;
									if ('beatsourceAccessToken' in localStorage) try {
										var accessToken = JSON.parse(localStorage.getItem('beatsourceAccessToken'));
										if (!isTokenValid(accessToken)) throw 'Expired or otherwise invalid';
										console.info('Re-using cached Beatsource access token:', accessToken,
											'expires at', new Date(accessToken.expires_at).toTimeString(),
											'(+' + ((accessToken.expires_at - Date.now()) / 1000 / 60).toFixed(2) + 'm)');
										return Promise.resolve(accessToken);
									} catch(e) {
										//console.warn('Invalid BeatSource cached access token:', e, localStorage.beatsourceAccessToken);
										localStorage.removeItem('beatsourceAccessToken');
									}
									const root = 'https://www.beatsource.com/', timeStamp = Date.now();
									return globalXHR(root).then(function(response) {
										let accessToken = response.document.getElementById('__NEXT_DATA__');
										if (accessToken != null) try {
											accessToken = JSON.parse(accessToken.text);
											return Object.assign(accessToken.props.rootStore.authStore.user, {
												apiHost: accessToken.runtimeConfig.API_HOST,
												clientId: accessToken.runtimeConfig.API_CLIENT_ID,
												recurlyPublicKey: accessToken.runtimeConfig.RECURLY_PUBLIC_KEY,
											});
										} catch(e) { console.warn(e) }
										if ((accessToken = /\b(?:btsrcSession)=([^\s\;]+)/m.exec(response.responseHeaders)) != null) try {
											accessToken = JSON.parse(decodeURIComponent(accessToken[1]));
											let sessionId = /\b(?:sessionId)=([^\s\;]+)/m.exec(response.responseHeaders);
											if (sessionId != null) try { accessToken.sessionId = decodeURIComponent(sessionId[1]) }
												catch(e) { console.warn(e) }
											return accessToken;
										} catch(e) { console.warn(e) }
										return Promise.reject('Beatsource OAuth2 access token could not be extracted');
									}).then(function(accessToken) {
										if (!accessToken.timestamp) accessToken.timestamp = timeStamp;
										if (!accessToken.expires_at) accessToken.expires_at = accessToken.timestamp +
											(accessToken.expires_in_ms || accessToken.expires_in * 1000);
										if (!isTokenValid(accessToken)) {
											console.warn('Received invalid Beatsource token:', accessToken);
											return Promise.reject('invalid token received');
										}
										try { localStorage.setItem('beatsourceAccessToken', JSON.stringify(accessToken)) } catch(e) { console.warn(e) }
										console.log('Beatsource access token successfully set:',
											accessToken, `(+${(Date.now() - accessToken.timestamp) / 1000}s)`);
										return accessToken;
									});
								}));
							})().then(function(accessToken) {
								const url = new URL('v4/catalog/search', 'https://api.beatport.com');
								url.searchParams.set('q', '"' + artist + '"');
								url.searchParams.set('type', 'artists');
								url.searchParams.set('per_page', 30);
								//url.searchParams.set('order_by', '-release_date');
								return globalXHR(url, {
									responseType: 'json',
									headers: { Authorization: accessToken.token_type + ' ' + accessToken.access_token },
								}).then(({response}) => response.artists);
							}).then(function(results) {
								if (results.length <= 0) return Promise.reject('Beatport: no matches');
								console.info('Beatport search results for "' + artist + '":', results);
								if (results.length > 1) return Promise.reject('Beatport: ambiguity');
								if (results.length > 1) console.info('Beatport returns ambiguous results for "' + artist + '":', results);
								if (!(results = results[0]).image) return Promise.reject('Beatport: no image for matched artist');
								return verifyImageUrl(results.image.dynamic_uri ?
									results.image.dynamic_uri.replace('/image_size/{w}x{h}/', '/')
									: results.image.uri.replace(/\/image_size\/\d+x\d+\//, '/'));
							}),
							// SoundCloud
							('scClientId' in sessionStorage ? Promise.resolve(sessionStorage.scClientId) : globalXHR('https://soundcloud.com/').then(function({document}) {
								const script = document.body.querySelector(':scope > script[crossorigin]:last-of-type');
								if (script == null) return Promise.reject('SoundCloud: unexpected page structure');
								return globalXHR(script.src, { responseType: 'text', accept: 'application/javascript' });
							}).then(function({responseText}) {
								let clientId = /\b(?:client_id)\s*:\s*"(\S{32})"/.exec(responseText);
								if (clientId == null) return Promise.reject('SoundCloud: client_id was not captured');
								sessionStorage.scClientId = (clientId = clientId[1]);
								return clientId;
							})).then(clientId => globalXHR('https://api-v2.soundcloud.com/search/users?' + new URLSearchParams({
								q: artist,
								limit: 30,
								client_id: clientId,
								app_locale: 'en',
							}).toString(), { responseType: 'json' }).then(function({response}) {
								if (response.total_results <= 0) return Promise.reject('SoundCloud: no matches');
								let results = resultsFilter(response.collection.filter(result => result.kind == 'user'), result => result.username);
								if (results.length <= 0) return Promise.reject('SoundCloud: no matches');
								console.info('SoundCloud search results for "' + artist + '":', results);
								//if (results.length > 1) return Promise.reject('SoundCloud: ambiguity');
								if (results.length > 1) console.info('SoundCloud returns ambiguous results for "' + artist + '":', results);
								return results[0].avatar_url && ![
									'/images/default_avatar_large.png',
									'/images/default_avatar_original.png',
									'/avatars-000185010230-yq6cu2-original.jpg',
									'/avatars-000185010230-yq6cu2-large.jpg',
								].some(pattern => results[0].avatar_url.endsWith(pattern)) ?
									results[0].avatar_url.replace(/-\w+(?=\.\w+$)/, '-original') : Promise.reject('SoundCloud: artist found but no image');
							})),
							// Last.fm
							globalXHR('http://ws.audioscrobbler.com/2.0/?' + new URLSearchParams({
								method: 'artist.getinfo',
								artist: artist,
								format: 'json',
								api_key: lfmApiKey,
							}).toString(), { responseType: 'json' }).then(function({response}) {
								if (response.error) return Promise.reject(response.message);
								console.info('Last.fm search result for "' + artist + '":', response.artist);
								const rx = /\/(\d+)x(\d+)\//;
								let biggest = response.artist.image.map(im => im['#text']).reduce(function(a, b) {
									let r = [a, b].map(RegExp.prototype.exec.bind(rx))
										.map(r => r != null ? parseInt(r[1]) * parseInt(r[2]) : -Infinity);
									return r[1] > r[0] ? b : a;
								});
								return rx.test(biggest) && !biggest.endsWith('/2a96cbd8b46e442fc41c2b86b821562f.png') ?
									biggest : Promise.reject('Last.fm: artist exists but no photo');
							}),
							// Spotify
							(function() {
								const isTokenValid = accessToken => typeof accessToken == 'object' && accessToken.token_type
									&& accessToken.access_token && accessToken.expires_at >= Date.now() + 30 * 1000;
								try {
									var accessToken = JSON.parse(window.localStorage.spotifyAccessToken);
									if (isTokenValid(accessToken)) return Promise.resolve(accessToken);
								} catch(e) { }
								const clientId = GM_getValue('spotify_clientid', '54468e0c92c24e0d86c61346155b32cd'),
											clientSecret = GM_getValue('spotify_clientsecret', '38cb34c7196d4cdca6dbb35b08e29e12');
								if (!clientId || !clientSecret) return Promise.reject('Spotify credentials not configured');
								const data = new URLSearchParams({
									'grant_type': 'client_credentials',
								}), timeStamp = Date.now();
								return globalXHR('https://accounts.spotify.com/api/token', { responseType: 'json', headers: {
									Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret),
								} }, data).then(function({response}) {
									accessToken = response;
									const tzOffset = new Date().getTimezoneOffset() * 60 * 1000;
									if (!accessToken.timestamp) accessToken.timestamp = timeStamp;
									if (!accessToken.expires_at) accessToken.expires_at = accessToken.timestamp +
										(accessToken.expires_in_ms || accessToken.expires_in * 1000);
									if (!isTokenValid(accessToken)) {
										console.warn('Received invalid Spotify token:', accessToken);
										return Promise.reject('invalid token received');
									}
									window.localStorage.spotifyAccessToken = JSON.stringify(accessToken);
									return accessToken;
								});
							})().then(credentials => globalXHR('https://api.spotify.com/v1/search?' + new URLSearchParams({
								q: artist,
								type: 'artist',
							}).toString(), {
								responseType: 'json',
								headers: {
									Accept: 'application/json',
									Authorization: credentials.token_type + ' ' + credentials.access_token,
								},
							})).then(function({response}) {
								if (response.artists.total <= 0) return Promise.reject('Spotify: no matches');
								let results = resultsFilter(response.artists.items.filter(item => item.type == 'artist'), item => item.name);
								if (results.length <= 0) return Promise.reject('Spotify: no matches');
								console.info('Spotify search results for "' + artist + '":', results);
								if (results.length > 1) return Promise.reject('Spotify: ambiguity');
								if (results.length > 1) console.info('iTunes returns ambiguous results for "' + artist + '":', results);
								return results[0].images && results[0].images.length > 0 ?
									results[0].images.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0].url
										: Promise.reject('Spotify: artist exists but no photo');
							}),
							// Mixcloud
							mixcloudQuery(`
query SearchResultsQuery(
  $tagCount: Int
  $term: String!
) { viewer { search { searchQuery(term: $term) { showPurposeMessage tags(first: $tagCount) { ...SearchResultsTags_tags } } } ...SearchResultsCloudcasts_viewer_4hh6ED ...SearchResultsUsers_viewer_4hh6ED } }
fragment AudioCardDetails_cloudcast on Cloudcast { ...AudioCardTags_cloudcast }
fragment AudioCardTags_cloudcast on Cloudcast { tags(country: "GLOBAL") { tag { id } } }
fragment Hovercard_user on User { id }
fragment PlayButton_cloudcast on Cloudcast { owner { id } }
fragment RebrandFollowButton_user on User { id }
fragment RebrandFollowButton_viewer on Viewer { me { id } }
fragment RebrandUserCard_user on User { id displayName username picture { urlRoot } ...Hovercard_user ...RebrandFollowButton_user }
fragment RebrandUserCard_viewer on Viewer { id ...RebrandFollowButton_viewer }
fragment SearchAudioCard_cloudcast on Cloudcast { owner { id } ...AudioCardDetails_cloudcast ...PlayButton_cloudcast }
fragment SearchResultsCloudcasts_viewer_4hh6ED on Viewer { search { searchQuery(term: $term) { cloudcasts(first: 10) { edges { node { slug ...SearchAudioCard_cloudcast id __typename } } } } } }
fragment SearchResultsTags_tags on TagConnection { edges { node { name slug id } } }
fragment SearchResultsUsers_viewer_4hh6ED on Viewer { search { searchQuery(term: $term) { users(first: 20) { edges { node { ...RebrandUserCard_user id __typename } } } } } ...RebrandUserCard_viewer }
`, {
								tagCount: 10,
								term: artist,
							}).then(function(data) {
								data = resultsFilter(data.viewer.search.searchQuery.users.edges.map(edge => edge.node),
									node => node.displayName);
								if (data.length <= 0) return Promise.reject('Mixcloud: no matches');
								console.info('Mixcloud search results for "' + artist + '":', data);
								//if (data.length > 1) return Promise.reject('Mixcloud: ambiguity');
								if (data.length > 1) console.info('Mixcloud returns ambiguous results for "' + artist + '"');
								return 'https://thumbnailer.mixcloud.com/unsafe/' + data[0].picture.urlRoot;
							}),
							// iTunes
							globalXHR('https://itunes.apple.com/search?' + new URLSearchParams({
								term: '"' + artist + '"',
								media: 'music',
								entity: 'musicArtist',
								attribute: 'artistTerm',
								//country: 'US',
							}).toString(), { responseType: 'json' }).then(function({response}) {
								if (response.resultCount <= 0) return Promise.reject('iTunes: no matches');
								let results = resultsFilter(response.results.filter(result =>
									result.wrapperType == 'artist' && result.artistType == 'Artist'), result => result.artistName);
								if (results.length <= 0) return Promise.reject('iTunes: no matches');
								console.info('iTunes search results for "' + artist + '":', results);
								//if (results.length > 1) return Promise.reject('iTunes: ambiguity');
								if (results.length > 1) console.info('iTunes returns ambiguous results for "' + artist + '":', results);
								return imageUrlResolver(results[0].artistLinkUrl);
							}),
							// Deezer
							globalXHR('https://api.deezer.com/search/artist?' + new URLSearchParams({
								q: artist,
								order: 'RANKING',
								//strict: 'on',
							}).toString(), { responseType: 'json' }).then(function({response}) {
								if (response.total <= 0) return Promise.reject('Deezer: no matches');
								let results = resultsFilter(response.data.filter(result => result.type == 'artist'),
									result => result.name);
								if (results.length <= 0) return Promise.reject('Deezer: no matches');
								console.info('Deezer search results for "' + artist + '":', results);
								//if (results.length > 1) return Promise.reject('Deezer: ambiguity');
								if (results.length > 1) console.info('Deezer returns ambiguous results for "' + artist + '":', results);
								return verifyImageUrl(results[0].picture).catch(function(reason) {
									console.warn('Deezer API image retrieval failed:', reason);
									return ['xl', 'big', 'medium', 'small'].reduce((acc, size) =>
										acc || response.data[0]['picture_' + size], null) || Promise.reject('no picture');
								}).then(imageUrl => imageUrl.includes('/images/artist//') ?
									Promise.reject('Deezer: artist exists but no photo') : getDeezerImageMax(imageUrl));
							}),
							// FLO
							globalXHR('https://www.music-flo.com/api/search/v2/search?' + new URLSearchParams({
								keyword: '"' + artist + '"',
								searchType: 'ARTIST',
								sortType: 'ACCURACY',
								size: 10,
							}).toString(), { responseType: 'json' }).then(function({response}) {
								if (response.code != 2000000) return Promise.reject(response.message);
								//if (response.data.totalCount <= 0) return Promise.reject('FLO: no matches');
								console.assert(Array.isArray(response.data.list), 'Array.isArray(response.data.list)', response);
								if (response.data.list.length <= 0) return Promise.reject('FLO: no matches');
								let results = resultsFilter(response.data.list[0].list, result => result.name);
								if (results.length <= 0) return Promise.reject('FLO: no matches');
								console.info('FLO search results for "' + artist + '":', response.data);
								if (results.length > 1) return Promise.reject('FLO: ambiguity');
								//if (results.length > 1) console.info('FLO returns ambiguous results for "' + artist + '":', results);
								const noPhoto = Promise.reject('FLO: artist exists but no photo');
								if (!Array.isArray(results[0].imgList) || results[0].imgList.length <= 0) return noPhoto;
								const imageUrl = results[0].imgList.reduce((acc, image) => image.url.replace(/\?.*$/, ''));
								return !imageUrl.includes('/000000000/000000000.') ? imageUrl : noPhoto;
							}),
							// OTOTOY
							globalXHR('https://ototoy.jp/find/?q=' + encodeURIComponent('"' + artist + '"')).then(function({document}) {
								const results = resultsFilter(Array.from(document.querySelectorAll('div.results_box > div.find-artist div.find-candidates')).map(function(div) {
									let result = {
										url: div.querySelector('div.artist-name > a'),
										imageUrl: div.querySelector('figure > a > img'),
									};
									if (result.url != null) {
										result.name = result.url.title || result.url.textContent.trim();
										result.url = new URL(result.url);
										result.url.hostname = 'ototoy.jp';
										result.id = /\/a\/(\d+)\b/i.exec(result.url.pathname);
										if (result.id != null) result.id = parseInt(result.id[1]); else delete result.id;
									} else delete result.url;
									if (result.imageUrl != null) {
										result.imageUrl = new URL(result.imageUrl.src);
										result.imageUrl = result.imageUrl.origin + new URLSearchParams(result.imageUrl.search).get('image');
									} else delete result.imageUrl;
									if (result.name) return result;
								}).filter(Boolean), result => result.name);
								if (results.length <= 0) return Promise.reject('OTOTOY: no matches');
								console.info('OTOTOY search results for "' + artist + '":', results);
								if (results.length > 1) return Promise.reject('OTOTOY: ambiguity');
								//if (results.length > 1) console.info('OTOTOY returns ambiguous results for "' + artist + '":', results);
								return httpParser.test(results[0].imageUrl) && !results[0].imageUrl.endsWith('/0dc61986-bccf-49d4-8fad-6b147ea8f327.jpg') ?
									results[0].imageUrl : Promise.reject('OTOTOY: artist exists but no photo');
							}),
							// Recochoku
							globalXHR('https://recochoku.jp/search/artist?q=' + encodeURIComponent(artist)).then(({document}) =>
									Array.from(document.querySelectorAll('ul#artistContents > li > a')).map(function(a) {
								let result = {
									url: new URL(a.pathname, 'https://recochoku.jp'),
									id: /\/artist\/(\d+)\b/i.exec(a.pathname),
									name: a.querySelector('div > div[class$="title"]'),
									imageUrl: a.getElementsByTagName('IMG'),
								};
								if (result.name) result.name = result.name.textContent.trim(); else return null;
								if (result.imageUrl.length > 0) {
									result.imageUrl = new URL(result.imageUrl[0].dataset.src);
									result.imageUrl.searchParams.set('FFw', 999999999);
									result.imageUrl.searchParams.set('FFh', 999999999);
									result.imageUrl.searchParams.delete('h');
									result.imageUrl.searchParams.delete('option');
								} else return null;
								if (result.id != null) result.id = result.id[1]; else delete result.id;
								return result;
							}).filter(Boolean)).then(function(results) {
								if (results.length <= 0) return Promise.reject('Recochoku: no matches');
								console.info('Recochoku search results for "' + artist + '":', results);
								results = resultsFilter(results, result => result.name);
								if (results.length <= 0) return Promise.reject('Recochoku: no matches');
								if (results.length > 1) return Promise.reject('Recochoku: ambiguity');
								//if (results.length > 1) console.info('Recochoku returns ambiguous results for "' + artist + '":', results);
								return httpParser.test(results[0].imageUrl) && !results[0].imageUrl.endsWith('/noimage_artist.png') ?
									results[0].imageUrl : Promise.reject('Recochoku: artist exists but no photo');
							}),
							// QQ音乐
							// globalXHR('https://c.y.qq.com/soso/fcgi-bin/client_search_cp?' + new URLSearchParams({
							// 	format: 'json',
							// 	t: 9,
							// 	w: artist,
							// 	inCharset: 'utf8',
							// 	outCharset: 'utf-8',
							// }).toString(), { responseType: 'json' }).then(function({response}) {
							// 	if (response.data.singer.totalnum <= 0) return Promise.reject('QQ音乐: no matches');
							// 	console.info('QQ音乐 search results for "' + artist + '":', response.data.singer);
							// 	const results = resultsFilter(response.data.singer.list, singer => singer.singerName);
							// 	if (results.length <= 0) return Promise.reject('QQ音乐: no matches');
							// 	//if (results.length > 1) return Promise.reject('QQ音乐: ambiguity');
							// 	if (results.length > 1) console.info('QQ音乐 returns ambiguous results for "' + artist + '":', results);
							// 	if (/M000003\w{11}_0(?=\.jpg$)/.test(results[0].singerPic))
							// 		return Promise.reject('QQ音乐: artist exists but no real photo');
							// 	return verifyImageUrl(results[0].singerPic.replace(/R\d+x\d+/, ''))
							// 		.catch(reason => verifyImageUrl(results[0].singerPic))
							// 		.catch(reason => Promise.reject('QQ音乐: artist exists but no photo'));
							// }),
							// YouTube Music
							(function() {
								if ('ytcfg' in sessionStorage) try { return Promise.resolve(JSON.parse(sessionStorage.ytcfg)) }
									catch(e) { console.warn('Invalid ytcfg format:', e) }
								return globalXHR('https://music.youtube.com/').then(function({document}) {
									for (let script of document.querySelectorAll('head > script[nonce]')) {
										let ytcfg = /^\s*\b(?:ytcfg\.set)\s*\(\s*(\{.+\})\s*\);/m.exec(script.text);
										if (ytcfg != null) try {
											ytcfg = JSON.parse(ytcfg[1]);
											if (ytcfg.INNERTUBE_API_KEY) {
												sessionStorage.ytcfg = JSON.stringify(ytcfg);
												return ytcfg;
											} else console.warn('YouTube Music API key missing:', ytcfg);
										} catch(e) { console.warn('Error parsing ytcfg:', ytcfg[1]) }
									}
									return Promise.reject('unable to extract YouTube config ot the config is invalid');
								});
							})().then(ytcfg => globalXHR('https://music.youtube.com/youtubei/v1/search?' + new URLSearchParams({
								alt: 'json',
								key: ytcfg.INNERTUBE_API_KEY,
							}).toString(), {
								responseType: 'json',
								headers: { Referer: 'https://music.youtube.com/' },
							}, {
								query: artist,
								params: encodeURIComponent('EgWKAQIgAWoKEAkQChADEAUQBA=='),
								context: {
									activePlayers: { }, capabilities: { },
									client: Object.assign({
										experimentIds: [ ], experimentsToken: "",
										locationInfo: {
											locationPermissionAuthorizationStatus: "LOCATION_PERMISSION_AUTHORIZATION_STATUS_UNSUPPORTED",
										},
										musicAppInfo: {
											musicActivityMasterSwitch: "MUSIC_ACTIVITY_MASTER_SWITCH_INDETERMINATE",
											musicLocationMasterSwitch: "MUSIC_LOCATION_MASTER_SWITCH_INDETERMINATE",
											pwaInstallabilityStatus: "PWA_INSTALLABILITY_STATUS_UNKNOWN",
										},
										utcOffsetMinutes: -new Date().getTimezoneOffset(),
									}, ytcfg.INNERTUBE_CONTEXT.client, { hl: 'en' }),
									request: {
										internalExperimentFlags: [
											{ key: "force_music_enable_outertube_search", value: "true" }
										],
									},
									user: { enableSafetyMode: false },
								},
							})).then(({response}) => response.contents && response.contents.sectionListRenderer ?
									response.contents.sectionListRenderer.contents[0].musicShelfRenderer.contents.map(function(item) {
								let result = {
									id: item.musicResponsiveListItemRenderer.navigationEndpoint.browseEndpoint.browseId,
									name: item.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
									photoUrl: item.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails,
								};
								result.webUrl = result.id ? 'https://music.youtube.com/channel/' + result.id : undefined;
								result.photoUrl = Array.isArray(result.photoUrl) && result.photoUrl.length > 0 ?
									result.photoUrl[0].url.replace(/(?:=[swh]\d+.*)?$/, '=s0') : undefined;
								return result;
							}) : Promise.reject('YouTube Music: no matches')).then(function(results) {
								if (results.length <= 0) return Promise.reject('YouTube Music: no matches');
								results = resultsFilter(results, result => result.name);
								if (results.length <= 0) return Promise.reject('YouTube Music: no matches');
								console.info('YouTube Music search results for "' + artist + '":', results);
								if (results.length > 1) return Promise.reject('YouTube Music: ambiguity');
								if (results.length > 1) console.info('YouTube Music returns ambiguous results for "' + artist + '":', results);
								return httpParser.test(results[0].photoUrl) ? results[0].photoUrl
									: Promise.reject('YouTube Music: artist exists but no photo');
							}),
						];

						const lookUp = (index = 0) => index >= 0 && index < lookupWorkers.length ?
							lookupWorkers[index].then(setImage.bind(imageInput)).catch(reason => lookUp(index + 1))
								: Promise.reject('Image of this artist was not found');
						lookUp().catch(logFail);
					}

					if (GM_getValue('auto_lookup_artist_image', true)) verifyImageUrl(imageInput.value).catch(function(reason) {
						if (imageInput.value.length > 0) imageInput.value = '';
						lookupArtistImage();
					});
					// <Alt+click> to lookup for image on demand
					imageInput.addEventListener('click', function(evt) {
						if (!evt.altKey) return;
						lookupArtistImage();
						return false;
					});
					const menu = new ContextMenu();
					menu.addItem('Auto lookup artist image', lookupArtistImage);
					menu.attach(imageInput);
					GM_registerMenuCommand('Artist image auto lookup', lookupArtistImage, 'l');
				} else {
					const image = document.body.querySelector('div#lightbox > img');
					if (image == null) break; // assertion failed!
					image.ondragover = evt => false;
					// image.ondragenter = image[`ondrag${'ondragexit' in image ? 'exit' : 'leave'}`] = function(evt) {
					// 	if (evt.relatedTarget == evt.currentTarget) return false;
					// 	evt.currentTarget.parentNode.style.backgroundColor = evt.type == 'dragenter' ? '#7fff0040' : null;
					// };
					// image.ondrop = function(evt) {
					// 	function dataSendHandler(endPoint) {
					// 		image.style.opacity = 0.3;
					// 		endPoint([items[0]]).then(singleImageGetter).then(imageUrl => localXHR('/artist.php',
					// 				{ responseType: null }, new URLSearchParams({
					// 			image: imageUrl,
					// 			//body: ???,
					// 			summary: 'Cover update',
					// 		})).then(function(response) {
					// 			console.log(response);
					// 			image.src = imageUrl;
					// 			image.style.opacity = 1;
					// 			return imageUrl
					// 		})).catch(function(reason) {
					// 			logFail(reason);
					// 			image.style.opacity = 1;
					// 		});
					// 	}

					// 	evt.stopPropagation();
					// 	let items = evt.dataTransfer.getData('text/uri-list');
					// 	if (items) items = items.split(/\r?\n/); else {
					// 		items = evt.dataTransfer.getData('text/x-moz-url');
					// 		if (items) items = items.split(/\r?\n/).filter((item, ndx) => ndx % 2 == 0);
					// 			else if (items = evt.dataTransfer.getData('text/plain'))
					// 				items = items.split(/\r?\n/).filter(RegExp.prototype.test.bind(httpParser));
					// 	}
					// 	if (Array.isArray(items) && items.length > 0) {
					// 		if (confirm('Update artist image from the dropped URL?\n\n' + items[0]))
					// 			dataSendHandler(imageHosts.rehostImages);
					// 	} else if (evt.dataTransfer.files.length > 0) {
					// 		items = Array.from(evt.dataTransfer.files)
					// 			.filter(file => file instanceof File && file.type.startsWith('image/'));
					// 		if (items.length > 0 && confirm('Update artist image from the dropped file?'))
					// 			dataSendHandler(imageHosts.uploadImages);
					// 	}
					// 	evt.currentTarget.parentNode.style.backgroundColor = null;
					// 	return false;
					// };
				}
				break;
		}
		break;
	case 'tracker.czech-server.com':
		if (document.location.pathname == '/upload2.php')
			document.querySelectorAll('input[type="text"][name="urlobr"]').forEach(setInputHandlers);
		break;
}
