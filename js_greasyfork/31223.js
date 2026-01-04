// ==UserScript==
// @namespace      jp.sceneq.rgtuwaaa
// @name           remove google tracking UWAA
// @description    remove google tracking
// @homepageURL    https://github.com/sceneq/RemoveGoogleTracking
// @version        0.21
// @include        https://www.google.*/*
// @grant          none
// @run-at         document-body
// @author         sceneq
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/31223/remove%20google%20tracking%20UWAA.user.js
// @updateURL https://update.greasyfork.org/scripts/31223/remove%20google%20tracking%20UWAA.meta.js
// ==/UserScript==

const yes = () => true;
const doNothing = () => {};
const $ = (s, n = document) => n.querySelector(s);
const $$ = (s, n = document) => [...n.querySelectorAll(s)];
const sleep = (millis) => new Promise((resolve) => setTimeout(resolve, millis));
const zip = (rows) => rows[0].map((_, c) => rows.map((row) => row[c]));

const rewriteProperties = (arg) => {
	for (const [obj, prop, value] of arg) {
		if (!obj) continue;
		Object.defineProperty(obj, prop, {
			value,
			writable: false,
		});
	}
};

const waitUntilDeclare = (obj, property, option = { interval: 100 }) => {
	console.debug('waitUntilDeclare Start', obj.toString(), property);
	return new Promise(async (resolve, reject) => {
		const propertyNames = property.split('.');
		let currObj = obj;
		for (const propertyName of propertyNames) {
			while (!(propertyName in currObj) || currObj[propertyName] === null) {
				await sleep(option.interval);
			}
			currObj = currObj[propertyName];
		}
		console.debug('waitUntilDeclare Done', obj.toString(), property);
		resolve(currObj);
	});
};

const waitUntilNode = (sel, option = { interval: 100 }) => {
	console.debug('waitUntilNode Start', sel);
	return new Promise(async (resolve, reject) => {
		let d = null;
		while (d === null) {
			d = $(sel);
			await sleep(option.interval);
		}
		console.debug('waitUntilNode Done', sel);
		resolve(d);
	});
};

const untrackBuilder = (arg) => {
	const badParams = arg.badParams;
	return (a) => {
		const href = a?.href;
		if (!href) return;
		const url = new URL(href);
		if (a.getAttribute('href') === '/url') {
			a.href = url.searchParams.get('url'); // todo q?
		} else {
			a.removeAttribute('ping');
			a.href = delParams(href, badParams);
		}
	};
};

const delParams = (sUrl, params) => {
	if (sUrl.startsWith('/')) {
		sUrl = location.origin + sUrl;
	}
	const url = new URL(sUrl);
	const keys = [...url.searchParams.keys()];
	for (const k of keys) {
		if (!params.includes(k)) continue;
		url.searchParams.delete(k);
	}
	return url.toString();
};

const Types = {
	search: Symbol('search'),
	isch: Symbol('image'),
	shop: Symbol('shop'),
	nws: Symbol('news'),
	vid: Symbol('video'),
	bks: Symbol('book'),
	maps: Symbol('maps'),
	fin: Symbol('finance'),
	toppage: Symbol('toppage'),
	// flights: Symbol('flights'),
};

const tbmToType = (tbm) => {
	if (tbm === null) {
		return Types.search;
	}
	const t = {
		isch: Types.isch,
		shop: Types.shop,
		nws: Types.nws,
		vid: Types.vid,
		bks: Types.bks,
		fin: Types.fin,
	}[tbm];
	if (t === undefined) {
		return null;
	} else {
		return t;
	}
};

const BadParamsBase = [
	'biw', // offsetWidth
	'bih', // offsetHeight
	'ei',
	'sa',
	'ved',
	'source',
	'prds',
	'bvm',
	'bav',
	'psi',
	'stick',
	'dq',
	'ech',
	'gs_gbg',
	'gs_rn',
	'cp',
	'ictx',
	'cshid',
	'gs_lcp',
];

const BadParams = (() => {
	const o = {};
	o[Types.search] = [
		'vet',
		'pbx',
		'dpr',
		'pf',
		'gs_rn',
		'gs_mss',
		'pq',
		'cp',
		'oq',
		'sclient',
		'gs_l',
		'aqs',
		'sxsrf',
	];
	o[Types.isch] = [
		'vet',
		'scroll',
		'yv',
		'iact',
		'forward',
		'ndsp',
		'csi',
		'tbnid',
		'sclient',
		'oq',
	];
	o[Types.shop] = ['oq'];
	o[Types.nws] = ['oq'];
	o[Types.vid] = ['oq'];
	o[Types.bks] = ['oq'];
	o[Types.fin] = ['oq'];
	o[Types.toppage] = ['oq', 'sclient', 'uact'];
	o[Types.maps] = ['psi'];
	return o;
})();

const overwrite = (arg) => {
	const badImageSrcRegex = /\/(?:(?:gen(?:erate)?|client|fp)_|log)204|(?:metric|csi)\.gstatic\.|(?:adservice)\.(google)/;
	if(arg.pageType.ty !== Types.maps){
		Object.defineProperty(window.Image.prototype, 'src', {
			set: function (url) {
				//console.debug('img send', url);
				if (badImageSrcRegex.test(url)) return;
				this.setAttribute('src', url);
			},
		});
	}

	Object.defineProperty(window.HTMLScriptElement.prototype, 'src', {
		set: function (url) {
			//console.debug('script send', url);
			if(typeof(url) === "string"){
				this.setAttribute('src', delParams(url, arg.badParams));
			} else {
				this.setAttribute('src', url);
			}
		},
	});

	const blockOnOpenPaths = [
		'/imgevent',
		'/async/ecr',
		'/async/bgasy',
		'/shopping/product/.+?/popout',
		'/_/VisualFrontendUi/browserinfo',
		'/_/VisualFrontendUi/jserror',
	];

	// todo fakeXHR?
	const blockOnSendPaths = ['/log'];

	const regBlockOnOpenPaths = new RegExp(
		'^(?:' + blockOnOpenPaths.join('|') + ')'
	);
	const regBlockOnSendPaths = new RegExp(
		'^(?:' + blockOnSendPaths.join('|') + ')'
	);

	const origOpen = window.XMLHttpRequest.prototype.open;
	window.XMLHttpRequest.prototype.open = function (act, path) {
		try {
			this.__path = path;
			this.__url = null;
			if (path === undefined) return;
			if (path.startsWith('https://')) {
				const url = new URL(path);
				this.__url = url;
				if (this.__url.origin === 'aa.google.com') return;
				if (regBlockOnOpenPaths.test(this.__url.pathname)) return;
			} else if (regBlockOnOpenPaths.test(this.__path)) {
				return;
			}
			const new_path = delParams(path, arg.badParams);
		} catch (e) {
			console.error(e);
			return;
		}
		//console.debug('xhr open', this.__path);
		return origOpen.apply(this, [act, this.__path]);
	};

	const origSend = window.XMLHttpRequest.prototype.send;
	window.XMLHttpRequest.prototype.send = function (body) {
		try {
			if (this.__url !== null) {
				if (regBlockOnSendPaths.test(this.__url.pathname)) return;
			} else if (regBlockOnOpenPaths.test(this.__path)) {
				return;
			}
		} catch (e) {
			console.error(e);
			return;
		}
		//console.debug('xhr send', this.__path);
		return origSend.apply(this, [body]);
	};

	if ('navigator' in window) {
		const origSendBeacon = navigator.sendBeacon.bind(navigator);
		navigator.sendBeacon = (path, data) => {
			if (path === undefined) return;
			if (path.startsWith('https://play.google.com/log')) return;
			if (badImageSrcRegex.test(path)) return;
			//console.debug('nav send', path);
			origSendBeacon(path, data);
		};
	}
};

const searchFormUriuri = async (arg) => {
	// TODO mobile, mobileOld
	let form = null;
	if (arg.pageType.mobileOld) {
		form = $('#sf');
	} else if (arg.pageType.ty === Types.isch) {
		form = await waitUntilDeclare(window, 'sf');
	} else {
		form = await waitUntilDeclare(window, 'tsf');
	}

	if (form === null) {
		console.warn('form === null');
		return;
	}

	for (const i of form) {
		if (i.tagName !== 'INPUT') continue;
		if (arg.badParams.includes(i.name)) {
			i.parentElement.removeChild(i);
		}
	}
	const orig = form.appendChild.bind(form);
	form.appendChild = (e) => {
		if (!arg.badParams.includes(e.name)) {
			orig(e);
		}
	};
};

const untrackAnchors = (untrack, arg) => {
	let property = null;
	if (arg.pageType.mobile) {
		property = 'topstuff';
	} else if (arg.pageType.mobileOld) {
		property = 'main'; // 'rmenu';
	} else if (arg.pageType.ty === Types.search) {
		property = 'hdtb-msb';
	} else if (arg.pageType.ty === Types.bks) {
		property = 'lr_';
	} else if (arg.pageType.ty === Types.vid) {
		property = 'hdtb-msb';
	} else if (arg.pageType.ty === Types.nws) {
		property = 'hdtb-msb';
	} else if (arg.pageType.ty === Types.isch) {
		property = 'i4';
	} else {
		property = 'search';
	}

	return waitUntilDeclare(window, property).then((_) => {
		for (const a of $$('a')) {
			untrack(a);
		}
	});
};

const gcommon = async (arg) => {
	const untrack = untrackBuilder(arg);
	const p1 = waitUntilDeclare(window, 'google').then((google) => {
		rewriteProperties([
			[google, 'log', yes],
			[google, 'logUrl', doNothing],
			[google, 'getLEI', yes],
			[google, 'ctpacw', yes],
			[google, 'csiReport', yes],
			[google, 'report', yes],
			[google, 'aft', yes],
			//[google, 'kEI', '0'],
			//[google, 'getEI', yes], or ()=>"0"
		]);
	});
	rewriteProperties([
		[window, 'rwt', doNothing],
		[window.gbar_, 'Rm', doNothing],
	]);

	const p2 = untrackAnchors(untrack, arg);
	const p3 = searchFormUriuri(arg);
	await Promise.all([p1, p2, p3]);

	if (arg.pageType.mobile) {
		const sel =
			arg.pageType.ty === Types.search
				? '#bres + h1 + div > div + div'
				: '#bres + div > div + div';
		new MutationObserver((mutations) => {
			const nodes = mutations.flatMap((d) => [...d.addedNodes]);
			for (const n of nodes) {
				new MutationObserver((_, obs) => {
					console.debug('untrack', n);
					for (const a of $$('a', n)) {
						untrack(a);
					}
					obs.disconnect();
				}).observe(n, { childList: true });
			}
		}).observe($(sel), { childList: true });
	}
};

const fun = {};

fun[Types.toppage] = searchFormUriuri;

fun[Types.search] = gcommon;
fun[Types.vid] = gcommon;
fun[Types.nws] = gcommon;
fun[Types.bks] = gcommon;
fun[Types.fin] = gcommon;

fun[Types.isch] = async (arg) => {
	// TODO mobile, mobileOld
	const untrack = untrackBuilder(arg);
	const p1 = untrackAnchors(untrack, arg);
	const p2 = searchFormUriuri(arg);
	const p3 = waitUntilDeclare(window, 'islrg').then((islrg) => {
		const imagesWrapper = islrg.children[0];
		const uuuu = (div) => {
			if (div.children.length !== 2) return;
			const a = div.children[1];
			untrack(a);
			a.removeAttribute('jsaction');
		};
		for (const div of $$(':scope > div', imagesWrapper)) {
			uuuu(div);
		}
		new MutationObserver((mutations) => {
			for (const div of mutations.flatMap((m) => [...m.addedNodes])) {
				uuuu(div);
			}
		}).observe(imagesWrapper, { childList: true });
	});

	/*
	const p4 = waitUntilNode('.ZsbmCf').then(_ => {
		for (const a of $$('.ZsbmCf, .Beeb4e')) {
			const ee = e => untrack(a);
			a.addEventListener('click', ee);
			a.addEventListener('contextmenu', ee);
		}
	});
	*/

	/*
	const safeurl = a => {
		const s = a.j ?? a;
		if (s.startsWith('/imgres?')) {
			return delParams(location.origin + s, [
				'vet',
				'w',
				'h',
				'ved',
				// q imgurl imgrefurl tbnid docid
			]);
		}
		if (s.startsWith('/')) return s;
		return new URLSearchParams(s).get('url') ?? s;
	};
	const p4 = waitUntilDeclare(window, 'default_VisualFrontendUi').then(_ => {
		rewriteProperties([[_, 'zd', safeurl]]);
	});
	*/
	await Promise.all([p1, p2, p3]);
};

fun[Types.shop] = async (arg) => {
	// TODO desktop, mobile, mobileOld
	const untrack = untrackBuilder(arg);
	const p1 = untrackAnchors(untrack, arg);
	const p2 = searchFormUriuri(arg);
	const p3 = waitUntilDeclare(window, 'google.pmc.spop.r', {
		interval: 30,
	}).then((shopObj) => {
		for (const result of $$('.sh-dlr__list-result')) {
			const shop = shopObj[result.dataset.docid];
			const link = shop[34][6];
			result.querySelector("a[class$='__merchant-name']").href = link;
			result.querySelector('a.translate-content').href = link;
			result.querySelector('div.sh-dlr__thumbnail > a').href = link;
			shop[3][0][1] = link;
			shop[14][1] = link;
			shop[89][16] = link;
			shop[89][18][0] = link;
			if (shop[85] !== null) {
				shop[85][3] = link;
			}
		}
	});
	await Promise.all([p1, p2, p3]);
};

fun[Types.maps] = async (arg) => {
	// TODO desktop, mobile, mobileOld
	const untrack = (a) => {
		a.addEventListener('click', (e) => e.stopPropagation());
		for (const n of [...a.attributes]
			.map((at) => at.name)
			.filter((n) => ['href', 'class'].indexOf(n) === -1)) {
			a.removeAttribute(n);
		}
	};
	const main = await waitUntilNode('div[role=main]', { interval: 30 });
	new MutationObserver((mutations) => {
		console.log(mutations);
	}).observe(main.children[1].children[0], { childList: true });
};

(async () => {
	'use strict';
	console.debug('rgt: init');
	console.time('rgt');

	const ty = (() => {
		if (location.pathname.startsWith('/maps')) {
			return Types.maps;
		}
		if (location.pathname === '/' || location.pathname === '/webhp') {
			return Types.toppage;
		}
		const tbm = new URLSearchParams(location.search).get('tbm');
		if (location.pathname === '/search') {
			return tbmToType(tbm);
		}
		return null;
	})();

	if (ty === null) {
		console.debug('ty === null', location.href);
		return;
	}

	const badParams = (() => {
		return [...BadParamsBase, ...BadParams[ty]];
	})();

	if (ty in fun) {
		const mobileOld = $('html[itemtype]') === null; // &liteui=2
		const mobile = !mobileOld && $('meta[name=viewport]') !== null;
		const arg = {
			pageType: {
				ty,
				mobile,
				mobileOld,
			},
			badParams,
		};
		console.debug('arg', arg);
		overwrite(arg);
		await fun[ty](arg);
	} else {
		console.warn(`key not found in fun: ${ty.toString()}`);
	}
	console.timeEnd('rgt');
})();
