// ==UserScript==
// @name						Wykop XS - OnePage Komentarze i Notatki
// @name:pl						Wykop XS - OnePage Komentarze i Notatki
// @name:en						Wykop XS - OnePage Komentarze i Notatki

// @version						3.0.83

// @description 					Wykop XS - OnePage Komentarze i Notatki | Wejdź na Mikroczat: https://mikroczat.pl Projekt Wykop X: https://wykopx.pl Wiki projektu Wykop X: https://wiki.wykopx.pl
// @description:en 					Wykop XS - OnePage Komentarze i Notatki | Wykop Live Chat: https://mikroczat.pl | Wykop X Project: https://wykopx.pl | Wiki: https://wiki.wykopx.pl


// Chcesz wesprzeć projekt Wykop X? Postaw kawkę:
// @contributionURL					https://buycoffee.to/wykopx

// @author						Wykop X <wykopx@gmail.com>



// @match						https://wykop.pl/*
// @supportURL						http://wykop.pl/tag/wykopx
// @namespace						Violentmonkey Scripts
// @compatible						chrome, firefox, opera, safari, edge
// @license						No License
// @icon						https://www.google.com/s2/favicons?sz=64&domain=wykop.pl




// @downloadURL https://update.greasyfork.org/scripts/524988/Wykop%20XS%20-%20OnePage%20Komentarze%20i%20Notatki.user.js
// @updateURL https://update.greasyfork.org/scripts/524988/Wykop%20XS%20-%20OnePage%20Komentarze%20i%20Notatki.meta.js
// ==/UserScript==
(async function ()
{
	/* USTAWIENIA START */
	// -
	// - poniższe ustawienia można zmieniać według uznania
	// -

	// USTAWIENIE LICZBY KOMENTARZY WYŚWIETLANYCH NA JEDNEJ STRONIE
	let SHOW_ALL_COMMENTS_IN_ONE_PAGE_WITHOUT_ANY_LIMIT = true;			// czy chcemy wyświetlać wszystkie komentarze na jednej stronie
	let LIMIT_MAXIMUM_COMMENTS_IN_ONE_PAGE = 5000; 						// ZABEZPIECZENIE PRZED WPISAMI Z BARDZO DUŻĄ LICZBĄ KOMENTARZY https://wykop.pl/wpis/57976055/wpis
	// LIMIT KOMENTARZY NA STRONĘ jeśli SHOW_ALL_COMMENTS_IN_ONE_PAGE_WITHOUT_ANY_LIMIT = false
	// 1 | 10 | 20 | 100 - tyle ile użytkownik chce, żeby się wyświetlało - dowolna liczba (domyślnie wykop wyświetla 50 komentarzy dla użytkownika zalogowanego i 25 dla niezalogowanego)
	let LOCAL_LIMIT_COMMENTS = 500;


	// STRONA TWOJEGO PROFILU
	// https://wykop.pl/ludzie/TwojLogin
	// ile najnowszych notatek wyświetlać na stronie profilu:
	// Domyślnie na stronie profilu pokazują się 3 najnowsze notatki, a w jednym requeście może być 50, a jeśli chcemy, to więcej requestów np. dla 100 czy 200
	let LIMIT_NOTES_ON_PROFILE_PAGES = 50;



	// STRONA NOTATEK NA TWOIM PROFILU
	// https://wykop.pl/ludzie/TwojLogin/notatki
	let SHOW_ALL_NOTES_IN_ONE_PAGE_WITHOUT_ANY_LIMIT = true;			// czy chcemy wyświetlić wszystkie notatki
	let LIMIT_MAXIMUM_NOTES_IN_ONE_PAGE = 10000;						// ZABEZPIECZENIE PRZED OGROMNĄ LICZBĄ NOTATEK

	// LIMIT NOTATEK NA STRONĘ jeśli SHOW_ALL_NOTES_IN_ONE_PAGE_WITHOUT_ANY_LIMIT = false
	// 1 | 10 | 20 | 100 - tyle ile użytkownik chce, żeby się wyświetlało, dowolna liczba (domyślnie wykop wyświetla 50 notatek)
	let LOCAL_LIMIT_NOTES = 500;
	// -
	// -
	/* USTAWIENIA END */







	const currentVersion = "3.0.83";
	let dev = false;

	const AWAIT_MILLISECONDS = 400;
	const BACKEND_LIMIT_COMMENTS = 50; 									// limit backendu do faktycznego pobierania 1-50
	const BACKEND_LIMIT_NOTES = 50; 											// limit backendu do faktycznego pobierania 1-50, wykop wysyła /notes?limit=100 ale i tak pobierane jest 50
	let per_page_comments = BACKEND_LIMIT_COMMENTS;
	let per_page_notes = BACKEND_LIMIT_NOTES;
	// wyliczamy backend limit jako mniejszą liczbę z obecnego limitu 50 albo mniejszą wybraną przez użytkownika
	// np. gdy uzytkownik chce miec 20 komentarzy/notatek na stronie zamiast domyslnych 50
	if (!SHOW_ALL_COMMENTS_IN_ONE_PAGE_WITHOUT_ANY_LIMIT) per_page_comments = Math.min(BACKEND_LIMIT_COMMENTS, LOCAL_LIMIT_COMMENTS);
	if (!SHOW_ALL_NOTES_IN_ONE_PAGE_WITHOUT_ANY_LIMIT) per_page_notes = Math.min(BACKEND_LIMIT_NOTES, LOCAL_LIMIT_NOTES);


	// unused yet
	function getLocalFromPage(pageNumber)
	{
		const local =
		{
			page: pageNumber,

			item:
			{
				first: ((pageNumber - 1) * LOCAL_LIMIT_COMMENTS) + 1,
				last: ((pageNumber - 1) * LOCAL_LIMIT_COMMENTS) + LOCAL_LIMIT_COMMENTS + 1,
			}
		}

		return local;
	}


	function getBackendFromBackendPage(pageStart, pageEnd = pageStart)
	{
		const backend =
		{
			pageStart: pageStart,
			pageEnd: pageEnd,

			item:
			{
				first: ((pageStart - 1) * BACKEND_LIMIT_COMMENTS) + 1,
				last: ((pageStart - 1) * BACKEND_LIMIT_COMMENTS) + BACKEND_LIMIT_COMMENTS + 1,
			}
		}

		return backend;
	}

	function getPageParam(urlString)
	{
		const params = new URL(urlString).searchParams;
		const pageValue = params.get('page'); 	// Returns `null` if missing
		const pageNumber = parseInt(pageValue || 1); 	// Default to `1` if missing/invalid
		return isNaN(pageNumber) ? 1 : pageNumber; 				// Force `1` for non-integer values
	}


	function extractPageNumber(url)
	{
		const pattern = /\/strona\/(\d+)/;
		const match = url.match(pattern);
		if (match)
		{
			return parseInt(match[1], 10); // Convert the captured group to a number
		}
		return 1;
	}

	function getBackendPagesFromLocal(local)
	{

		if (dev) console.log(`getFirstBackendPageFromLocal() local.page: [${local.page}] | local_limit: [${LOCAL_LIMIT_COMMENTS}] | backend_limit: [${BACKEND_LIMIT_COMMENTS}]`);

		let backend =
		{
			//  f(x) = ax - (a - 1)
			//  f(x) = a(x-1) + 1
			pageStart: (Math.floor(LOCAL_LIMIT_COMMENTS / BACKEND_LIMIT_COMMENTS) * (local.page - 1) + 1),
			// pageEnd: 

		};

		backend = getBackendFromBackendPage(backend.pageStart, backend.pageEnd);

		if (dev) console.log("getFirstBackendPageFromLocal() local: ", local);
		if (dev) console.log("getFirstBackendPageFromLocal() backend: ", backend);
		if (dev) console.log(`getFirstBackendPageFromLocal() local.page: ${local.page} | backend.pageStart: ${backend.pageStart}`)

		return backend;
	}





	let xhook = null;
	//XHook - v1.6.2 - https://github.com/jpillora/xhook | Jaime Pillora <dev@jpillora.com> - MIT Copyright 2023
	xhook = function () { "use strict"; const e = (e, t) => Array.prototype.slice.call(e, t); let t = null; "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? t = self : "undefined" != typeof global ? t = global : window && (t = window); const n = t, o = t.document, r = ["load", "loadend", "loadstart"], s = ["progress", "abort", "error", "timeout"], a = e => ["returnValue", "totalSize", "position"].includes(e), i = function (e, t) { for (let n in e) { if (a(n)) continue; const o = e[n]; try { t[n] = o } catch (e) { } } return t }, c = function (e, t, n) { const o = e => function (o) { const r = {}; for (let e in o) { if (a(e)) continue; const s = o[e]; r[e] = s === t ? n : s } return n.dispatchEvent(e, r) }; for (let r of Array.from(e)) n._has(r) && (t[`on${r}`] = o(r)) }, u = function (e) { if (o && null != o.createEventObject) { const t = o.createEventObject(); return t.type = e, t } try { return new Event(e) } catch (t) { return { type: e } } }, l = function (t) { let n = {}; const o = e => n[e] || [], r = { addEventListener: function (e, t, r) { n[e] = o(e), n[e].indexOf(t) >= 0 || (r = void 0 === r ? n[e].length : r, n[e].splice(r, 0, t)) }, removeEventListener: function (e, t) { if (void 0 === e) return void (n = {}); void 0 === t && (n[e] = []); const r = o(e).indexOf(t); -1 !== r && o(e).splice(r, 1) }, dispatchEvent: function () { const n = e(arguments), s = n.shift(); t || (n[0] = i(n[0], u(s)), Object.defineProperty(n[0], "target", { writable: !1, value: this })); const a = r[`on${s}`]; a && a.apply(r, n); const c = o(s).concat(o("*")); for (let e = 0; e < c.length; e++) { c[e].apply(r, n) } }, _has: e => !(!n[e] && !r[`on${e}`]) }; return t && (r.listeners = t => e(o(t)), r.on = r.addEventListener, r.off = r.removeEventListener, r.fire = r.dispatchEvent, r.once = function (e, t) { var n = function () { return r.off(e, n), t.apply(null, arguments) }; return r.on(e, n) }, r.destroy = () => n = {}), r }; var f = function (e, t) { switch (typeof e) { case "object": return n = e, Object.entries(n).map((([e, t]) => `${e.toLowerCase()}: ${t}`)).join("\r\n"); case "string": return function (e, t) { const n = e.split("\r\n"); null == t && (t = {}); for (let e of n) if (/([^:]+):\s*(.+)/.test(e)) { const e = null != RegExp.$1 ? RegExp.$1.toLowerCase() : void 0, n = RegExp.$2; null == t[e] && (t[e] = n) } return t }(e, t) }var n; return [] }; const d = l(!0), p = e => void 0 === e ? null : e, h = n.XMLHttpRequest, y = function () { const e = new h, t = {}; let n, o, a, u = null; var y = 0; const v = function () { if (a.status = u || e.status, -1 !== u && (a.statusText = e.statusText), -1 === u); else { const t = f(e.getAllResponseHeaders()); for (let e in t) { const n = t[e]; if (!a.headers[e]) { const t = e.toLowerCase(); a.headers[t] = n } } } }, b = function () { x.status = a.status, x.statusText = a.statusText }, g = function () { n || x.dispatchEvent("load", {}), x.dispatchEvent("loadend", {}), n && (x.readyState = 0) }, E = function (e) { for (; e > y && y < 4;)x.readyState = ++y, 1 === y && x.dispatchEvent("loadstart", {}), 2 === y && b(), 4 === y && (b(), "text" in a && (x.responseText = a.text), "xml" in a && (x.responseXML = a.xml), "data" in a && (x.response = a.data), "finalUrl" in a && (x.responseURL = a.finalUrl)), x.dispatchEvent("readystatechange", {}), 4 === y && (!1 === t.async ? g() : setTimeout(g, 0)) }, m = function (e) { if (4 !== e) return void E(e); const n = d.listeners("after"); var o = function () { if (n.length > 0) { const e = n.shift(); 2 === e.length ? (e(t, a), o()) : 3 === e.length && t.async ? e(t, a, o) : o() } else E(4) }; o() }; var x = l(); t.xhr = x, e.onreadystatechange = function (t) { try { 2 === e.readyState && v() } catch (e) { } 4 === e.readyState && (o = !1, v(), function () { if (e.responseType && "text" !== e.responseType) "document" === e.responseType ? (a.xml = e.responseXML, a.data = e.responseXML) : a.data = e.response; else { a.text = e.responseText, a.data = e.responseText; try { a.xml = e.responseXML } catch (e) { } } "responseURL" in e && (a.finalUrl = e.responseURL) }()), m(e.readyState) }; const w = function () { n = !0 }; x.addEventListener("error", w), x.addEventListener("timeout", w), x.addEventListener("abort", w), x.addEventListener("progress", (function (t) { y < 3 ? m(3) : e.readyState <= 3 && x.dispatchEvent("readystatechange", {}) })), "withCredentials" in e && (x.withCredentials = !1), x.status = 0; for (let e of Array.from(s.concat(r))) x[`on${e}`] = null; if (x.open = function (e, r, s, i, c) { y = 0, n = !1, o = !1, t.headers = {}, t.headerNames = {}, t.status = 0, t.method = e, t.url = r, t.async = !1 !== s, t.user = i, t.pass = c, a = {}, a.headers = {}, m(1) }, x.send = function (n) { let u, l; for (u of ["type", "timeout", "withCredentials"]) l = "type" === u ? "responseType" : u, l in x && (t[u] = x[l]); t.body = n; const f = d.listeners("before"); var p = function () { if (!f.length) return function () { for (u of (c(s, e, x), x.upload && c(s.concat(r), e.upload, x.upload), o = !0, e.open(t.method, t.url, t.async, t.user, t.pass), ["type", "timeout", "withCredentials"])) l = "type" === u ? "responseType" : u, u in t && (e[l] = t[u]); for (let n in t.headers) { const o = t.headers[n]; n && e.setRequestHeader(n, o) } e.send(t.body) }(); const n = function (e) { if ("object" == typeof e && ("number" == typeof e.status || "number" == typeof a.status)) return i(e, a), "data" in e || (e.data = e.response || e.text), void m(4); p() }; n.head = function (e) { i(e, a), m(2) }, n.progress = function (e) { i(e, a), m(3) }; const d = f.shift(); 1 === d.length ? n(d(t)) : 2 === d.length && t.async ? d(t, n) : n() }; p() }, x.abort = function () { u = -1, o ? e.abort() : x.dispatchEvent("abort", {}) }, x.setRequestHeader = function (e, n) { const o = null != e ? e.toLowerCase() : void 0, r = t.headerNames[o] = t.headerNames[o] || e; t.headers[r] && (n = t.headers[r] + ", " + n), t.headers[r] = n }, x.getResponseHeader = e => p(a.headers[e ? e.toLowerCase() : void 0]), x.getAllResponseHeaders = () => p(f(a.headers)), e.overrideMimeType && (x.overrideMimeType = function () { e.overrideMimeType.apply(e, arguments) }), e.upload) { let e = l(); x.upload = e, t.upload = e } return x.UNSENT = 0, x.OPENED = 1, x.HEADERS_RECEIVED = 2, x.LOADING = 3, x.DONE = 4, x.response = "", x.responseText = "", x.responseXML = null, x.readyState = 0, x.statusText = "", x }; y.UNSENT = 0, y.OPENED = 1, y.HEADERS_RECEIVED = 2, y.LOADING = 3, y.DONE = 4; var v = { patch() { h && (n.XMLHttpRequest = y) }, unpatch() { h && (n.XMLHttpRequest = h) }, Native: h, Xhook: y }; function b(e, t, n, o) { return new (n || (n = Promise))((function (r, s) { function a(e) { try { c(o.next(e)) } catch (e) { s(e) } } function i(e) { try { c(o.throw(e)) } catch (e) { s(e) } } function c(e) { var t; e.done ? r(e.value) : (t = e.value, t instanceof n ? t : new n((function (e) { e(t) }))).then(a, i) } c((o = o.apply(e, t || [])).next()) })) } const g = n.fetch; function E(e) { return e instanceof Headers ? m([...e.entries()]) : Array.isArray(e) ? m(e) : e } function m(e) { return e.reduce(((e, [t, n]) => (e[t] = n, e)), {}) } const x = function (e, t = { headers: {} }) { let n = Object.assign(Object.assign({}, t), { isFetch: !0 }); if (e instanceof Request) { const o = function (e) { let t = {}; return ["method", "headers", "body", "mode", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "url"].forEach((n => t[n] = e[n])), t }(e), r = Object.assign(Object.assign({}, E(o.headers)), E(n.headers)); n = Object.assign(Object.assign(Object.assign({}, o), t), { headers: r, acceptedRequest: !0 }) } else n.url = e; const o = d.listeners("before"), r = d.listeners("after"); return new Promise((function (t, s) { let a = t; const i = function (e) { if (!r.length) return a(e); const t = r.shift(); return 2 === t.length ? (t(n, e), i(e)) : 3 === t.length ? t(n, e, i) : i(e) }, c = function (e) { if (void 0 !== e) { const n = new Response(e.body || e.text, e); return t(n), void i(n) } u() }, u = function () { if (!o.length) return void l(); const e = o.shift(); return 1 === e.length ? c(e(n)) : 2 === e.length ? e(n, c) : void 0 }, l = () => b(this, void 0, void 0, (function* () { const { url: t, isFetch: o, acceptedRequest: r } = n, c = function (e, t) { var n = {}; for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]); if (null != e && "function" == typeof Object.getOwnPropertySymbols) { var r = 0; for (o = Object.getOwnPropertySymbols(e); r < o.length; r++)t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]) } return n }(n, ["url", "isFetch", "acceptedRequest"]); return e instanceof Request && c.body instanceof ReadableStream && (c.body = yield new Response(c.body).text()), g(t, c).then((e => i(e))).catch((function (e) { return a = s, i(e), s(e) })) })); u() })) }; var w = { patch() { g && (n.fetch = x) }, unpatch() { g && (n.fetch = g) }, Native: g, Xhook: x }; const O = d; return O.EventEmitter = l, O.before = function (e, t) { if (e.length < 1 || e.length > 2) throw "invalid hook"; return O.on("before", e, t) }, O.after = function (e, t) { if (e.length < 2 || e.length > 3) throw "invalid hook"; return O.on("after", e, t) }, O.enable = function () { v.patch(), w.patch() }, O.disable = function () { v.unpatch(), w.unpatch() }, O.XMLHttpRequest = v.Native, O.fetch = w.Native, O.headers = f, O.enable(), O }();


	xhook.before((request, callback) =>
	{
		/* ADBLOCK XHR START */
		const prohibitedUrls = [
			// "btloader.com",
			// "btmessage.com",
			// "4dex.io",
			// "a-mo.net",
			// "adform.net",
			// "adnxs-simple.com",
			// "connectad.io",
			// "creativecdn.com",
			// "criteo.com",
			// "dns-finder.com",
			// "pubmatic.com",
			// "r2b2.cz",
			// "rubiconproject.com",
			// "smilewanted.com",
			// "smartadserver.com",
			// "spolecznosci.net/",
			// "teads.tv",
			"https://ssp.wp.pl",
			"std.wpcdn.pl",
			"https://wykop.pl/api/v3/ads",
		];


		// if (dev) console.log(request.url);
		if (prohibitedUrls.some((url) => request.url.includes(url))) return;
		/* ADBLOCK XHR END */


		let PAGETYPE = null;

		if ((request.url.includes("links") || request.url.includes("entries")) && request.url.includes("comments") && request.url.includes("page="))
		{
			PAGETYPE = "comments";
		}
		else if (request.url.startsWith("https://wykop.pl/api/v3/notes?") && window.location.href.includes("https://wykop.pl/ludzie/"))
		{
			// 'https://wykop.pl/api/v3/notes/username' - unikaj PUT i GET pobierania pojedynczego użytkownika / zapisywania edycji notatki
			if (!request.url.includes("page=")) request.url += "&page=1";

			if (window.location.href.includes("/notatki"))
			{
				// strona wyświetlania notatek na profilu np. https://wykop.pl/ludzie/TwojLogin/notatki
				PAGETYPE = "notes";
			}
			else
			{
				// strona własnego profilu np. https://wykop.pl/ludzie/TwojLogin
				if (request.url.includes("limit=3"))
				{
					// domyślnie na stronie profilu pobierane są 3 notatki w 1 requeście. Możemy pobrać w jednym requeście maksymalnie 50
					request.url = request.url.replace("limit=3", `limit=${Math.min(LIMIT_NOTES_ON_PROFILE_PAGES, BACKEND_LIMIT_NOTES)}`);
				}

				if (LIMIT_NOTES_ON_PROFILE_PAGES > BACKEND_LIMIT_NOTES)
				{
					// jeśli chcemy na stronie profilu więcej notatek niż 5-, to będziemy pobierać je w pętli przez xhook.after()
					PAGETYPE = "notes";
				}

				if (request.url.includes("limit=100")) request.url = request.url.replace("limit=100", `limit=${BACKEND_LIMIT_NOTES}`);
			}
		}


		if (PAGETYPE != null)
		{
			if (dev) console.log(`xhook.before, PAGETYPE: ${PAGETYPE} | request.url: ${request.url}`);

			if (dev) console.log(request);
			if (dev) console.log(request.url);

			if (dev) console.log(`BEFORE - request o URL: request.url - ${request.url}`);

			const local = {};
			local.item = { first: {} }

			if (request.url.includes("page="))
			{
				[, local.page] = request.url.match(/page=(\d+)/) || [null, 1];
			}
			else
			{
				local.page = 1; // na wszelki wypadek przy pobieraniu pierwszej strony https://wykop.pl/ludzie/uzytkownik/notatki  URL do API nie ma ?page=1
			}


			// WSZYSTKIE KOMENTARZE NA JEDNEJ STRONIE - START
			if (PAGETYPE == "comments" && SHOW_ALL_COMMENTS_IN_ONE_PAGE_WITHOUT_ANY_LIMIT == true)
			{
				// ZA DUŻO KOMENTARZY, PONAD LIMITEM 5000, WIĘC JEDNAK I TAK BĘDZIEMY DZIELIĆ NA STRONY PO 500, ale działa tylko gdy przechodzi się na ?page=12 a nie na ?page=1
				if (local.page * 50 > LIMIT_MAXIMUM_COMMENTS_IN_ONE_PAGE)
				{
					if (dev) console.log(`BEFORE - chcialismy wyswietlic wszystkie komentarze na jednej stronie, ale jest ich za dużo, więc dzielimy je na podstrony po ${LIMIT_MAXIMUM_COMMENTS_IN_ONE_PAGE} sztuk`);
					SHOW_ALL_COMMENTS_IN_ONE_PAGE_WITHOUT_ANY_LIMIT = false;
					LOCAL_LIMIT_COMMENTS = LIMIT_MAXIMUM_COMMENTS_IN_ONE_PAGE;
				}
				else
				{
					// jeśli chcemy wszystkie komentarze na jednej stronie nawet gdy jest ich bardzo dużo, kazdy request ?page=8 (wejście fizycznie na stronę 8) zamieniamy na page=1 a potem obslugujemy wszystkie page=1 -> page=8 w xhook.after();
					request.url = request.url.replace(/page=\d+/, 'page=1');
				}
			}

			// WSZYSTKIE NOTATKI NA JEDNEJ STRONIE - START
			if (PAGETYPE == "notes" && SHOW_ALL_NOTES_IN_ONE_PAGE_WITHOUT_ANY_LIMIT == true)
			{
				// ZA DUŻO NOTATEK, PONAD LIMITEM 5000, WIĘC JEDNAK I TAK BĘDZIEMY DZIELIĆ NA STRONY PO 500, ale działa tylko gdy przechodzi się na ?page=12 a nie na ?page=1
				if (local.page * 50 > LIMIT_MAXIMUM_NOTES_IN_ONE_PAGE)
				{
					if (dev) console.log(`BEFORE - chcialismy wyswietlic wszystkie komentarze na jednej stronie, ale jest ich za dużo, więc dzielimy je na podstrony po ${LIMIT_MAXIMUM_COMMENTS_IN_ONE_PAGE} sztuk`);
					SHOW_ALL_COMMENTS_IN_ONE_PAGE_WITHOUT_ANY_LIMIT = false;
					LOCAL_LIMIT_NOTES = LIMIT_MAXIMUM_NOTES_IN_ONE_PAGE;
				}
				else
				{
					// jeśli chcemy wszystkie notatki na jednej stronie nawet gdy jest ich bardzo dużo, kazdy request ?page=8 (wejście fizycznie na stronę 8) zamieniamy na page=1 a potem obslugujemy wszystkie page=1 -> page=8 w xhook.after();
					request.url = request.url.replace(/page=\d+/, 'page=1');
				}
			}





			// ZMIENIAMY LICZBĘ KOMENTARZY NA PODSTRONACH z 50 na użytkownika
			if (PAGETYPE == "comments" && SHOW_ALL_COMMENTS_IN_ONE_PAGE_WITHOUT_ANY_LIMIT == false
				|| PAGETYPE == "notest" && SHOW_ALL_NOTES_IN_ONE_PAGE_WITHOUT_ANY_LIMIT == false)
			{
				// jeśli chcemy mieć paginację Z INNĄ LICZBĄ NIŻ 50 KOMENTARZAMI, musimy obliczyć, którą stronę (backend.pageStart) faktycznie chcemy dostać na podstawie strony, którą użytkownik zażądał (local.page)
				if (PAGETYPE == "comments" && LOCAL_LIMIT_COMMENTS < BACKEND_LIMIT_COMMENTS
					|| PAGETYPE == "notes" && LOCAL_LIMIT_NOTES < BACKEND_LIMIT_NOTES)
				{
					// chcemy mieć na stronie mniej niż 50 komentarzy więc zwyczajnie wybieramy 
					// page= mniejszą niż 50 i ustawiamy limit dla backendu API odpowiedni do local_limit
					request.url = request.url.replace(/page=\d+/, `page=${local.page}`);
				}
				else if (PAGETYPE == "comments" && LOCAL_LIMIT_COMMENTS > BACKEND_LIMIT_COMMENTS
					|| PAGETYPE == "notes" && LOCAL_LIMIT_NOTES > BACKEND_LIMIT_NOTES)
				{

					if (dev && PAGETYPE == "comments") console.log(`local_limit > BACKEND_LIMIT -> ${LOCAL_LIMIT_COMMENTS} > ${BACKEND_LIMIT_COMMENTS}`);
					if (dev && PAGETYPE == "notest") console.log(`local_limit > BACKEND_LIMIT -> ${LOCAL_LIMIT_NOTES} > ${BACKEND_LIMIT_NOTES}`);
					// chcemy mieć na stronie więcej niż 50 komentarzy, więc otwieramy w backendzie
					// pierwszą stronę, która zawiera aktualne wpisy
					// czyli np. gdy local_limit wynosi 70, a chcemy 2 stronę, czyli wpisy 71-140
					// to bedziemy chcieli faktycznie od backendu stronę 2 ponieważ komentarz 71 jest na 2. stronie po 50 wpisów (51-100)
					// więć otrzymamy wpisy 51-100 i wybierzemy wpisy od 71-100
					// natomiast potem xhook.after będzie pobierał stronę 3, żeby pobrać wpisy 101-140
					let backend = { pageStart: local.page };
					backend = getBackendPagesFromLocal(local);
					request.url = request.url.replace(/page=\d+/, `page=${backend.pageStart}`);
				}

				// ILE KOMENTARZY NA STRONIE ma być pobranych z backendu (max 50)
				if (request.url.includes("limit=")) request.url = request.url.replace(/limit=\d+/, `limit=${per_page_comments}`); 	// min(x, 50) limit => per_page
				else { request.url += `&limit=${per_page_comments}`; }
			}

			if (dev) console.log("REQUEST WYSŁANY: ", request.url);
		}

		callback();
	});




	xhook.after((request, response) =>
	{

		let PAGETYPE = null;
		if (response.status !== 200 || !response.finalUrl) return;

		// https://wykop.pl/api/v3/entries/80073681/comments?page=1

		// https://wykop.pl/api/v3/notes?limit=100
		// https://wykop.pl/api/v3/notes?page=3&limit=100
		if (!response.finalUrl.includes("comments") && !response.finalUrl.includes("notes")) return;


		// if ((response.finalUrl.includes("links") || response.finalUrl.includes("entries")) && response.finalUrl.includes("comments") && response.finalUrl.includes("page="))
		if (response.finalUrl.includes("comments"))
		{
			PAGETYPE = "comments";
		}
		else if (request.url.startsWith("https://wykop.pl/api/v3/notes?") && window.location.href.includes("https://wykop.pl/ludzie/"))
		{
			// 'https://wykop.pl/api/v3/notes/username' - unikaj PUT i GET pobierania pojedynczego użytkownika / zapisywania edycji notatki

			if (!request.url.includes("page=")) request.url += "&page=1";

			if (window.location.href.includes("/notatki"))
			{
				// strona wyświetlania notatek na profilu np. https://wykop.pl/ludzie/TwojLogin/notatki
				PAGETYPE = "notes";
			}
			else
			{
				// strona własnego profilu np. https://wykop.pl/ludzie/TwojLogin
				if (request.url.includes("limit=3"))
				{
					// domyślnie na stronie profilu pobierane są 3 notatki w 1 requeście. Możemy pobrać w jednym requeście maksymalnie 50
					request.url = request.url.replace("limit=3", `limit=${Math.min(LIMIT_NOTES_ON_PROFILE_PAGES, BACKEND_LIMIT_NOTES)}`);
				}

				if (LIMIT_NOTES_ON_PROFILE_PAGES > BACKEND_LIMIT_NOTES)
				{
					// jeśli chcemy na stronie profilu więcej notatek niż 5-, to będziemy pobierać je w pętli przez xhook.after()
					PAGETYPE = "notes";
				}

				if (request.url.includes("limit=100")) request.url = request.url.replace("limit=100", `limit=${BACKEND_LIMIT_NOTES}`);
			}
		}

		if (dev) console.log("PAGETYPE", PAGETYPE);
		if (dev) console.log("xhook.after: ", response.finalUrl)




		if (PAGETYPE == "comments")
		{
			if (!response.finalUrl.startsWith("https://wykop.pl/api/v3/entries/") && !response.finalUrl.startsWith("https://wykop.pl/api/v3/links/")) return;
			if (!response.finalUrl.includes("page=")) return; 									// dla notatek domyslnie nie ma page= na pierwszej stronie :/ :/ 
		}


		if (dev) console.log(`AFTER - response.finalUrl - ${response.finalUrl}`);
		if (dev) console.log("AFTER: response: ", response);

		let json = JSON.parse(response.text)

		if (dev) console.log("AFTER -- json", json)
		if (dev) console.log("AFTER -- json.pagination: ", json.pagination);


		// WSZYSTKIE KOMENTARZE NA JEDNEJ STRONIE - START
		if ((PAGETYPE == "comments" && SHOW_ALL_COMMENTS_IN_ONE_PAGE_WITHOUT_ANY_LIMIT == false))
		{
			// ZA DUŻO KOMENTARZY, PONAD LIMITEM np. 500, WIĘC JEDNAK BĘDZIEMY DZIELIĆ NA STRONY PO 500
			if (json.pagination.total > LIMIT_MAXIMUM_COMMENTS_IN_ONE_PAGE)
			{
				if (dev) console.log(`AFTER - chcielismy wyswietlic wszystkie komentarze na jednej stronie, ale jest ich za dużo, więc JEDNAK dzielimy je na podstrony`);
				SHOW_ALL_COMMENTS_IN_ONE_PAGE_WITHOUT_ANY_LIMIT = false;
				LOCAL_LIMIT_COMMENTS = LIMIT_MAXIMUM_COMMENTS_IN_ONE_PAGE;
			}
		}
		if ((PAGETYPE == "notes" && SHOW_ALL_NOTES_IN_ONE_PAGE_WITHOUT_ANY_LIMIT == false))
		{
			// ZA DUŻO NOTATEK, PONAD LIMITEM np. 500, WIĘC JEDNAK BĘDZIEMY DZIELIĆ NA STRONY PO 500
			if (json.pagination.total > LIMIT_MAXIMUM_NOTES_IN_ONE_PAGE)
			{
				if (dev) console.log(`AFTER - chcielismy wyswietlic wszystkie komentarze na jednej stronie, ale jest ich za dużo, więc JEDNAK dzielimy je na podstrony`);
				SHOW_ALL_COMMENTS_IN_ONE_PAGE_WITHOUT_ANY_LIMIT = false;
				LOCAL_LIMIT_COMMENTS = LIMIT_MAXIMUM_COMMENTS_IN_ONE_PAGE;
			}
		}

		// NIE MODYFIKUJEMY PODCZAS POBIERANIA KOLEJNYCH STRON page=2 ... DLA SHOW_ALL_COMMENTS_IN_ONE_PAGE, obsługujemy tylko page=1
		if (PAGETYPE == "comments" && SHOW_ALL_COMMENTS_IN_ONE_PAGE_WITHOUT_ANY_LIMIT == true && getPageParam(response.finalUrl) != 1) return;
		if (PAGETYPE == "notes" && SHOW_ALL_NOTES_IN_ONE_PAGE_WITHOUT_ANY_LIMIT == true && getPageParam(response.finalUrl) != 1) return;


		// https://wykop.pl/api/v3/entries/79760717/comments?page=1
		// https://wykop.pl/api/v3/links/7627183/comments?page=1&sort=best&ama=true
		// https://wykop.pl/api/v3/notes?limit=100&page=1


		const url = new URL(response.finalUrl);
		if (dev) console.log("AFTER: url ", url);
		if (dev) console.log("AFTER: url.pathname", url.pathname);

		let searchParams = new URLSearchParams(url.searchParams)
		let requestPage = parseInt(searchParams.get('page'));

		if (dev) console.log("AFTER: url.searchParams: ");
		if (dev) console.log(`AFTER: pageRequested = searchParams.get('page'): `, requestPage)

		// id wpisu/znaleziska
		let id = null;
		if (PAGETYPE == "comments")
		{
			id = (response.finalUrl.match(/\/links\/(\d+)|\/entries\/(\d+)/) || []).slice(1).find(Boolean);
			if (dev) console.log("AFTER: ID from URL: ", id);
		}

		if (dev) console.log("local_limit", LOCAL_LIMIT_COMMENTS)
		if (dev) console.log("json.data.length", json.data.length)
		if (dev) console.log("json.pagination.per_page", json.pagination.per_page)
		if (dev) console.log("json.pagination.total", json.pagination.total)




		// chcemy wyświetlić wszystkie na jednej stronie
		if (PAGETYPE == "comments" && SHOW_ALL_COMMENTS_IN_ONE_PAGE_WITHOUT_ANY_LIMIT
			|| PAGETYPE == "notes" && SHOW_ALL_NOTES_IN_ONE_PAGE_WITHOUT_ANY_LIMIT)
		{
			const totalPages = Math.ceil(json.pagination.total / json.pagination.per_page);

			if (dev) console.log("for loop start ---------- SHOW ALL IN ONE PAGE");
			if (dev) console.log("totalPages: ", totalPages);
			if (dev) console.log("urlPath: ", url.pathname)


			// POBIERAMY ELEMENTY Z WYBRANYCH STRON
			for (let page = 2; page <= totalPages; ++page)
			{
				// 429 too many requests fix

				if (page % 5 === 0)
				{
					const start = Date.now();
					while (Date.now() - start < AWAIT_MILLISECONDS)
					{
						// Busy-wait loop to create delay
					}
				}

				searchParams.set('page', `${page}`);


				if (dev) console.log("url.pathname", url.pathname);
				if (dev) console.log("✔ xhook url.searchParams: ", searchParams);

				/* REQUEST */
				const req = new XMLHttpRequest();
				req.open('GET', `${url.pathname}?${searchParams.toString()}`, false);

				for (let key in request.headers)
				{
					if (request.headers.hasOwnProperty(key)) req.setRequestHeader(key, request.headers[key]);
				}

				req.send(null)

				if (req.status !== 200)
				{
					break;
				}
				/* REQUEST END */

				let data = JSON.parse(req.responseText).data;
				if (dev) console.log("for loop - data: ", data)
				if (dev) console.log("for loop - json: ", json)
				if (data.length === 0) break;
				json.data = json.data.concat(data);
				if (dev) console.log("for loop - json2: ", json)
			}




			// zamiast "234" wyświetlamy 1.234 żeby nie wyświetlała się paginacja
			if (PAGETYPE == "comments" && json.data.length > BACKEND_LIMIT_COMMENTS
				|| PAGETYPE == "notes" && json.data.length > BACKEND_LIMIT_NOTES)
			{
				json.pagination.total = parseFloat(`1.${json.data.length}`);
			}


			if (PAGETYPE == "notes")
			{
				// kod z mikroczat.pl  /  webworker.ts
				// sortowanie notatek od uzytkownikow
				if (json.data.length > 0)
				{
					json.data.sort((a, b) =>
					{
						if (a.user.username && b.user.username) return a.user.username.localeCompare(b.user.username);
						return 0;
					});

					// separate users and group them
					const regularUsers = [];
					const removedUsers = [];
					const bannedUsers = [];

					const removedUsernameIncludes = ".....";

					json.data.forEach(u =>
					{
						// u = { content: "Treść notatki", user: UserObject }
						if (u.user.username.includes(removedUsernameIncludes))
						{
							removedUsers.push(u);
						}
						else if (u.user.status === "banned")
						{
							bannedUsers.push(u);
						}
						else
						{
							regularUsers.push(u);
						}
					});

					json.data = [...regularUsers, ...bannedUsers, ...removedUsers];
				}
			}




			if (dev) console.log("json.data: ", json.data);





			response.text = JSON.stringify(json);

			return;
		}


		// uzytkownik chce wyswietlic wiecej niż 50 elementów, a jest więcej niż 50 elementów
		if (PAGETYPE == "comments" && (LOCAL_LIMIT_COMMENTS > json.data.length && LOCAL_LIMIT_COMMENTS > json.pagination.per_page)
			|| PAGETYPE == "notes" && (LOCAL_LIMIT_NOTES > json.data.length && LOCAL_LIMIT_NOTES > json.pagination.per_page))
		{
			if (dev && PAGETYPE == "comments") console.log(`AFTER: local_limit [${LOCAL_LIMIT_COMMENTS}] > json.data.length [${json.data.length}] && local_limit > json.pagination.per_page [${json.pagination.per_page}]`);
			if (dev && PAGETYPE == "notes") console.log(`AFTER: local_limit [${LOCAL_LIMIT_NOTES}] > json.data.length [${json.data.length}] && local_limit > json.pagination.per_page [${json.pagination.per_page}]`);


			if (dev) console.log("window.location.href", window.location.href)
			const openedCurrentPageNumber = extractPageNumber(window.location.href);
			if (dev) console.log(`NUMER STRONY OTWARTEJ Z URL:`, openedCurrentPageNumber);


			// TODO zrobic sprawdzenie czy obecna strona to np. strona/2  strona/3 i pobierac odpowiednio dalsze grupy
			// bazujac na backend page i local_page

			// TYLKO JEŚLI REQUEST JEST DO page=3 na stronie której jesteśmy /strona/3 (nawet pomijając więcej wpisów)
			if (requestPage == openedCurrentPageNumber)
			{
				// pobraliśmy już 50 komentarzy z aktalnej strony requestPage więc teraz bedziemy pobierać kolejne 50 z następnej
				let nextPage = requestPage + 1;

				// sprawdzić nextPage czy jest z local/backend, ale chyba jest ok z requestu


				let itemsFetchedInFirstRequest = json.data.length;							// ile pobralismy w pierwszym requeście
				// let remainingComments = json.pagination.total - json.data.length;  				// local_limit - BACKEND_LIMIT;
				let remainingItemsToFetch = null;
				if (PAGETYPE == "comments") remainingItemsToFetch = LOCAL_LIMIT_COMMENTS - itemsFetchedInFirstRequest;		// ile jeszcze do pobrania
				else if (PAGETYPE == "notes") remainingItemsToFetch = LOCAL_LIMIT_NOTES - itemsFetchedInFirstRequest;		// ile jeszcze do pobrania

				const totalPagesToFetch = Math.ceil(remainingItemsToFetch / json.pagination.per_page);

				if (dev) console.log("requestPage", requestPage)
				if (dev) console.log("nextPage", nextPage)
				if (dev) console.log("itemsFetchedInFirstRequest", itemsFetchedInFirstRequest)
				if (dev) console.log("remainingItemsToFetch", remainingItemsToFetch)
				if (dev) console.log("totalPagesToFetch", totalPagesToFetch)

				let i = 1;

				if (dev) console.log(`--- while START: `);

				while (i <= totalPagesToFetch)
				{
					// 429 too many requests fix
					// await new Promise(resolve => setTimeout(resolve, AWAIT_MILLISECONDS));

					if (dev) console.log(`--- while --- page:   ${nextPage} START | i: ${i}`);

					searchParams.set('page', `${nextPage}`);

					/* REQUEST */
					let req = new XMLHttpRequest();
					req.open('GET', `${url.pathname}?${searchParams.toString()}`, false)

					for (let key in request.headers)
					{
						if (request.headers.hasOwnProperty(key)) req.setRequestHeader(key, request.headers[key]);
					}
					req.send(null);

					if (req.status !== 200) break;
					/* REQUEST END */

					let data = JSON.parse(req.responseText).data;
					if (data.length === 0) break;

					json.data = json.data.concat(data);

					itemsFetchedInFirstRequest += data.length;
					remainingItemsToFetch -= itemsFetchedInFirstRequest;
					nextPage++;
					i++;
					if (dev) console.log("while - i: ", i)
					if (dev) console.log("while - nextPage: ", nextPage)
					if (dev) console.log("while - itemsFetchedInFirstRequest: ", itemsFetchedInFirstRequest)
					if (dev) console.log("while - remainingItemsToFetch: ", remainingItemsToFetch)
					if (dev) console.log(`while - Fetched [${data.length}] comments on page [${nextPage - 1}] and got JSON `, data);

				}

				if (PAGETYPE == "comments")
				{
					if (itemsFetchedInFirstRequest > LOCAL_LIMIT_COMMENTS)
					{
						if (dev) console.log(`Successfully fetched [${itemsFetchedInFirstRequest}] comments. Slicing to [${LOCAL_LIMIT_COMMENTS}]`);
						json.data = json.data.slice(0, LOCAL_LIMIT_COMMENTS); // dla pewnosci
					}
					else
					{
						if (dev) console.log(`Only [${itemsFetchedInFirstRequest}] comments available in total.`);
					}

					json.pagination.total = LOCAL_LIMIT_COMMENTS;	// tu zmienić wyswietlanie na 1.123
				}


				else if (PAGETYPE == "notes")
				{
					if (itemsFetchedInFirstRequest > LOCAL_LIMIT_NOTES)
					{
						if (dev) console.log(`Successfully fetched [${itemsFetchedInFirstRequest}] notes. Slicing to [${LOCAL_LIMIT_NOTES}]`);
						json.data = json.data.slice(0, LOCAL_LIMIT_NOTES); // dla pewnosci
					}
					else
					{
						if (dev) console.log(`Only [${itemsFetchedInFirstRequest}] notes available in total.`);
					}
					json.pagination.total = LOCAL_LIMIT_NOTES;	// tu zmienić wyswietlanie na 1.123
				}

				response.text = JSON.stringify(json);
			}

		}
	});
})();