// ==UserScript==
// @name           vim comic viewer
// @name:ko        vim comic viewer
// @description    Universal comic reader
// @description:ko 만화 뷰어 라이브러리
// @version        20.3.0
// @namespace      https://greasyfork.org/en/users/713014-nanikit
// @exclude        *
// @match          http://unused-field.space/
// @author         nanikit
// @license        MIT
// @grant          GM.addValueChangeListener
// @grant          GM.getValue
// @grant          GM.removeValueChangeListener
// @grant          GM.setValue
// @grant          GM.xmlHttpRequest
// @grant          unsafeWindow
// @resource       link:@headlessui/react       https://cdn.jsdelivr.net/npm/@headlessui/react@2.2.1/dist/headlessui.prod.cjs
// @resource       link:@stitches/react         https://cdn.jsdelivr.net/npm/@stitches/react@1.3.1-1/dist/index.cjs
// @resource       link:clsx                    https://cdn.jsdelivr.net/npm/clsx@2.1.1/dist/clsx.js
// @resource       link:fflate                  https://cdn.jsdelivr.net/npm/fflate@0.8.2/lib/browser.cjs
// @resource       link:jotai                   https://cdn.jsdelivr.net/npm/jotai@2.10.0/index.js
// @resource       link:jotai/react             https://cdn.jsdelivr.net/npm/jotai@2.10.0/react.js
// @resource       link:jotai/react/utils       https://cdn.jsdelivr.net/npm/jotai@2.10.0/react/utils.js
// @resource       link:jotai/utils             https://cdn.jsdelivr.net/npm/jotai@2.10.0/utils.js
// @resource       link:jotai/vanilla           https://cdn.jsdelivr.net/npm/jotai@2.10.0/vanilla.js
// @resource       link:jotai/vanilla/utils     https://cdn.jsdelivr.net/npm/jotai@2.10.0/vanilla/utils.js
// @resource       link:jotai-cache             https://cdn.jsdelivr.net/npm/jotai-cache@0.5.0/dist/cjs/atomWithCache.js
// @resource       link:overlayscrollbars       https://cdn.jsdelivr.net/npm/overlayscrollbars@2.10.0/overlayscrollbars.cjs
// @resource       link:overlayscrollbars-react https://cdn.jsdelivr.net/npm/overlayscrollbars-react@0.5.6/overlayscrollbars-react.cjs.js
// @resource       link:react                   https://cdn.jsdelivr.net/npm/react@19.0.0/cjs/react.production.js
// @resource       link:react/jsx-runtime       https://cdn.jsdelivr.net/npm/react@19.0.0/cjs/react-jsx-runtime.production.js
// @resource       link:react-dom               https://cdn.jsdelivr.net/npm/react-dom@19.0.0/cjs/react-dom.production.js
// @resource       link:react-dom/client        https://cdn.jsdelivr.net/npm/react-dom@19.0.0/cjs/react-dom-client.production.js
// @resource       link:react-toastify          https://cdn.jsdelivr.net/npm/react-toastify@10.0.5/dist/react-toastify.js
// @resource       link:scheduler               https://cdn.jsdelivr.net/npm/scheduler@0.23.2/cjs/scheduler.production.min.js
// @resource       link:vcv-inject-node-env     data:,unsafeWindow.process=%7Benv:%7BNODE_ENV:%22production%22%7D%7D
// @resource       overlayscrollbars-css        https://cdn.jsdelivr.net/npm/overlayscrollbars@2.10.0/styles/overlayscrollbars.min.css
// @resource       react-toastify-css           https://cdn.jsdelivr.net/npm/react-toastify@10.0.5/dist/ReactToastify.css
// ==/UserScript==
"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (all, symbols) => {
	let target = {};
	for (var name in all) {
		__defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	}
	if (symbols) {
		__defProp(target, Symbol.toStringTag, { value: "Module" });
	}
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) {
				__defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
		}
	}
	return to;
};
var __reExport = (target, mod, secondTarget, symbols) => {
	if (symbols) {
		__defProp(target, Symbol.toStringTag, { value: "Module" });
		secondTarget && __defProp(secondTarget, Symbol.toStringTag, { value: "Module" });
	}
	__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default");
};
require("vcv-inject-node-env");
let __stitches_react = require("@stitches/react");
let jotai = require("jotai");
let jotai_cache = require("jotai-cache");
let jotai_utils = require("jotai/utils");
let __headlessui_react = require("@headlessui/react");
let react = require("react");
let react_dom_client = require("react-dom/client");
let react_jsx_runtime = require("react/jsx-runtime");
let react_toastify = require("react-toastify");
let overlayscrollbars_react = require("overlayscrollbars-react");
function deferred() {
	let methods;
	let state = "pending";
	const promise = new Promise((resolve, reject) => {
		methods = {
			async resolve(value) {
				await value;
				state = "fulfilled";
				resolve(value);
			},
			reject(reason) {
				state = "rejected";
				reject(reason);
			}
		};
	});
	Object.defineProperty(promise, "state", { get: () => state });
	return Object.assign(promise, methods);
}
function throttle(fn, timeframe) {
	let lastExecution = NaN;
	let flush = null;
	const throttled = ((...args) => {
		flush = () => {
			try {
				fn.call(throttled, ...args);
			} finally {
				lastExecution = Date.now();
				flush = null;
			}
		};
		if (throttled.throttling) return;
		flush?.();
	});
	throttled.clear = () => {
		lastExecution = NaN;
	};
	throttled.flush = () => {
		lastExecution = NaN;
		flush?.();
		throttled.clear();
	};
	Object.defineProperties(throttled, {
		throttling: { get: () => Date.now() - lastExecution <= timeframe },
		lastExecution: { get: () => lastExecution }
	});
	return throttled;
}
var deps_exports =  __export({
	Dialog: () => __headlessui_react.Dialog,
	Fragment: () => react.Fragment,
	Provider: () => jotai.Provider,
	RESET: () => jotai_utils.RESET,
	Tab: () => __headlessui_react.Tab,
	atom: () => jotai.atom,
	atomWithCache: () => jotai_cache.atomWithCache,
	atomWithStorage: () => jotai_utils.atomWithStorage,
	createContext: () => react.createContext,
	createJSONStorage: () => jotai_utils.createJSONStorage,
	createRef: () => react.createRef,
	createRoot: () => react_dom_client.createRoot,
	createStitches: () => __stitches_react.createStitches,
	createStore: () => jotai.createStore,
	deferred: () => deferred,
	forwardRef: () => react.forwardRef,
	loadable: () => jotai_utils.loadable,
	selectAtom: () => jotai_utils.selectAtom,
	splitAtom: () => jotai_utils.splitAtom,
	throttle: () => throttle,
	useAtom: () => jotai.useAtom,
	useAtomValue: () => jotai.useAtomValue,
	useCallback: () => react.useCallback,
	useEffect: () => react.useEffect,
	useId: () => react.useId,
	useImperativeHandle: () => react.useImperativeHandle,
	useLayoutEffect: () => react.useLayoutEffect,
	useMemo: () => react.useMemo,
	useReducer: () => react.useReducer,
	useRef: () => react.useRef,
	useSetAtom: () => jotai.useSetAtom,
	useState: () => react.useState,
	useStore: () => jotai.useStore
});
__reExport(deps_exports, require("fflate"));
const rootAtom = (0, jotai.atom)(null);
const viewerOptionsAtom = (0, jotai.atom)({});
const viewerStatusAtom = (0, jotai.atom)("idle");
var en_default = {
	"@@locale": "en",
	settings: "Settings",
	help: "Help",
	maxZoomOut: "Maximum zoom out",
	maxZoomIn: "Maximum zoom in",
	singlePageCount: "single page count",
	backgroundColor: "Background color",
	leftToRight: "Left to right",
	reset: "Reset",
	doYouReallyWantToReset: "Do you really want to reset?",
	errorIsOccurred: "Error is occurred.",
	failedToLoadImage: "Failed to load image.",
	loading: "Loading...",
	fullScreenRestorationGuide: "Enter full screen yourself if you want to keep the viewer open in full screen.",
	useFullScreen: "Use full screen",
	downloading: "Downloading...",
	cancel: "CANCEL",
	downloadComplete: "Download complete.",
	errorOccurredWhileDownloading: "Error occurred while downloading.",
	keyBindings: "Key bindings",
	toggleViewer: "Toggle viewer",
	toggleFullscreenSetting: "Toggle fullscreen setting",
	nextPage: "Next page",
	previousPage: "Previous page",
	nextSeries: "Next series",
	previousSeries: "Previous series",
	download: "Download",
	refresh: "Refresh",
	increaseSinglePageCount: "Increase single page count",
	decreaseSinglePageCount: "Decrease single page count",
	anchorSinglePageCount: "Set single page view until before current page",
	pressKey: "Press a key...",
	resetToDefault: "Reset to default"
};
var ko_default = {
	"@@locale": "ko",
	settings: "설정",
	help: "도움말",
	maxZoomOut: "최대 축소",
	maxZoomIn: "최대 확대",
	singlePageCount: "한쪽 페이지 수",
	backgroundColor: "배경색",
	leftToRight: "왼쪽부터 보기",
	reset: "초기화",
	doYouReallyWantToReset: "정말 초기화하시겠어요?",
	errorIsOccurred: "에러가 발생했습니다.",
	failedToLoadImage: "이미지를 불러오지 못했습니다.",
	loading: "로딩 중...",
	fullScreenRestorationGuide: "뷰어 전체 화면을 유지하려면 직접 전체 화면을 켜 주세요 (F11).",
	useFullScreen: "전체 화면",
	downloading: "다운로드 중...",
	cancel: "취소",
	downloadComplete: "다운로드 완료",
	errorOccurredWhileDownloading: "다운로드 도중 오류가 발생했습니다",
	keyBindings: "단축키",
	toggleViewer: "뷰어 전환",
	toggleFullscreenSetting: "전체화면 설정 전환",
	nextPage: "다음 페이지",
	previousPage: "이전 페이지",
	nextSeries: "다음 시리즈",
	previousSeries: "이전 시리즈",
	download: "다운로드",
	refresh: "새로고침",
	increaseSinglePageCount: "한쪽 페이지 수 늘리기",
	decreaseSinglePageCount: "한쪽 페이지 수 줄이기",
	anchorSinglePageCount: "현재 페이지 전까지 한쪽 페이지로 설정",
	pressKey: "키를 누르세요...",
	resetToDefault: "기본값으로"
};
const translations = {
	en: en_default,
	ko: ko_default
};
const i18nStringsAtom = (0, jotai.atom)(getLanguage());
const i18nAtom = (0, jotai.atom)((get) => get(i18nStringsAtom), (_get, set) => {
	set(i18nStringsAtom, getLanguage());
});
i18nAtom.onMount = (set) => {
	addEventListener("languagechange", set);
	return () => {
		removeEventListener("languagechange", set);
	};
};
function getLanguage() {
	for (const language of navigator.languages) {
		const locale = language.split("-")[0];
		if (!locale) continue;
		const translation = translations[locale];
		if (translation) return translation;
	}
	return en_default;
}
const { styled, css, keyframes } = (0, __stitches_react.createStitches)({});
function DownloadCancel({ onClick }) {
	const strings = (0, jotai.useAtomValue)(i18nAtom);
	return  (0, react_jsx_runtime.jsxs)(SpaceBetween, { children: [ (0, react_jsx_runtime.jsx)("p", { children: strings.downloading }),  (0, react_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		children: strings.cancel
	})] });
}
const SpaceBetween = styled("div", {
	display: "flex",
	flexFlow: "row nowrap",
	justifyContent: "space-between"
});
const MAX_RETRY_COUNT = 6;
const MAX_SAME_URL_RETRY_COUNT = 2;
function isDelay(sourceOrDelay) {
	return sourceOrDelay === void 0;
}
function toMediaElement(source) {
	if (isDelay(source)) return new Image();
	if (typeof source === "string") {
		const img = new Image();
		img.src = source;
		return img;
	}
	if (source.isConnected) return source.cloneNode(true);
	return source;
}
async function* getMediaIterable({ media, index, comic, maxSize }) {
	if (!isDelay(media)) yield getUrl(media);
	if (!comic) return;
	let previous;
	let retryCount = 0;
	let sameUrlRetryCount = 0;
	while (sameUrlRetryCount <= MAX_SAME_URL_RETRY_COUNT && retryCount <= MAX_RETRY_COUNT) {
		const next = (await comic({
			cause: media !== void 0 || retryCount > 0 ? "error" : "load",
			page: index,
			maxSize
		}))[index];
		if (isDelay(next)) continue;
		const url = getUrl(next);
		yield url;
		retryCount++;
		if (previous === url) {
			sameUrlRetryCount++;
			continue;
		}
		previous = url;
	}
}
function getUrl(source) {
	return typeof source === "string" ? source : source.src;
}
const isGmFetchAvailable = typeof GM.xmlHttpRequest === "function";
async function gmFetch(url, init) {
	const method = init?.body ? "POST" : "GET";
	return await GM.xmlHttpRequest({
		method,
		url,
		headers: {
			referer: `${location.origin}/`,
			...init?.headers
		},
		responseType: init?.type === "text" ? void 0 : init?.type,
		data: init?.body
	});
}
async function download(comic, options) {
	const { onError, onProgress, signal } = options || {};
	let startedCount = 0;
	let resolvedCount = 0;
	let rejectedCount = 0;
	let status = "ongoing";
	const pages = await comic({
		cause: "download",
		maxSize: {
			width: Infinity,
			height: Infinity
		}
	});
	const digit = Math.floor(Math.log10(pages.length)) + 1;
	return archiveWithReport();
	async function archiveWithReport() {
		const result = await Promise.all(pages.map(downloadWithReport));
		if (signal?.aborted) {
			reportProgress({ transition: "cancelled" });
			signal.throwIfAborted();
		}
		const pairs = await Promise.all(result.map(toPair));
		const data = Object.assign({}, ...pairs);
		const value = deferred();
		const abort = (0, deps_exports.zip)(data, { level: 0 }, (error, array) => {
			if (error) {
				reportProgress({ transition: "error" });
				value.reject(error);
			} else {
				reportProgress({ transition: "complete" });
				value.resolve(array);
			}
		});
		signal?.addEventListener("abort", abort, { once: true });
		return value;
	}
	async function downloadWithReport(source, pageIndex) {
		const errors = [];
		startedCount++;
		reportProgress();
		for await (const event of downloadImage({
			media: source,
			pageIndex
		})) {
			if ("error" in event) {
				errors.push(event.error);
				onError?.(event.error);
				continue;
			}
			if (event.url) resolvedCount++;
			else rejectedCount++;
			reportProgress();
			return event;
		}
		return {
			url: "",
			blob: new Blob([errors.map((x) => `${x}`).join("\n\n")])
		};
	}
	async function* downloadImage({ media, pageIndex }) {
		const mediaParams = {
			media,
			index: pageIndex,
			comic,
			maxSize: {
				width: Infinity,
				height: Infinity
			}
		};
		for await (const url of getMediaIterable(mediaParams)) {
			if (signal?.aborted) break;
			try {
				yield {
					url,
					blob: await fetchBlobWithCacheIfPossible(url, signal)
				};
			} catch (error) {
				yield await fetchBlobIgnoringCors(url, {
					signal,
					fetchError: error
				});
			}
		}
	}
	async function toPair({ url, blob }, index) {
		const array = new Uint8Array(await blob.arrayBuffer());
		return { [`${`${index}`.padStart(digit, "0")}${guessExtension(array) ?? getExtension(url)}`]: array };
	}
	function reportProgress({ transition } = {}) {
		if (status !== "ongoing") return;
		if (transition) status = transition;
		onProgress?.({
			total: pages.length,
			started: startedCount,
			settled: resolvedCount + rejectedCount,
			rejected: rejectedCount,
			status
		});
	}
}
function getExtension(url) {
	if (!url) return ".txt";
	return url.match(/\.[^/?#]{3,4}?(?=[?#]|$)/)?.[0] || ".jpg";
}
function guessExtension(array) {
	const { 0: a, 1: b, 2: c, 3: d } = array;
	if (a === 255 && b === 216 && c === 255) return ".jpg";
	if (a === 137 && b === 80 && c === 78 && d === 71) return ".png";
	if (a === 82 && b === 73 && c === 70 && d === 70) return ".webp";
	if (a === 71 && b === 73 && c === 70 && d === 56) return ".gif";
}
async function fetchBlobWithCacheIfPossible(url, signal) {
	return await (await fetch(url, { signal })).blob();
}
async function fetchBlobIgnoringCors(url, { signal, fetchError }) {
	if (isCrossOrigin(url) && !isGmFetchAvailable) return { error: new Error("It could be a CORS issue but cannot use GM.xmlhttpRequest", { cause: fetchError }) };
	try {
		const response = await gmFetch(url, {
			signal,
			type: "blob"
		});
		if (response.status >= 400) {
			const body = await response.response.text();
			const message = `failed to load ${url} with HTTP ${response.status} ${response.statusText}\n${body}`;
			return { error: new Error(message) };
		}
		return {
			url,
			blob: response.response
		};
	} catch (error) {
		if (isGmCancelled(error)) return { error:  new Error("download aborted") };
		else return { error: fetchError };
	}
}
function isCrossOrigin(url) {
	return new URL(url).origin !== location.origin;
}
function isGmCancelled(error) {
	return error instanceof Function;
}
var utils_exports =  __export({
	getSafeFileName: () => getSafeFileName,
	insertCss: () => insertCss,
	isTyping: () => isTyping,
	save: () => save,
	saveAs: () => saveAs,
	timeout: () => timeout,
	waitDomContent: () => waitDomContent
});
const timeout = (millisecond) => new Promise((resolve) => setTimeout(resolve, millisecond));
const waitDomContent = (document$1) => document$1.readyState === "loading" ? new Promise((r) => document$1.addEventListener("readystatechange", r, { once: true })) : true;
const insertCss = (css$1) => {
	const style = document.createElement("style");
	style.innerHTML = css$1;
	document.head.append(style);
};
const isTyping = (event) => event.target?.tagName?.match?.(/INPUT|TEXTAREA/) || event.target?.isContentEditable;
const saveAs = async (blob, name) => {
	const a = document.createElement("a");
	a.download = name;
	a.rel = "noopener";
	a.href = URL.createObjectURL(blob);
	a.click();
	await timeout(4e4);
	URL.revokeObjectURL(a.href);
};
const getSafeFileName = (str) => {
	return str.replace(/[<>:"/\\|?*\x00-\x1f]+/gi, "").trim() || "download";
};
const save = (blob) => {
	return saveAs(blob, `${getSafeFileName(document.title)}.zip`);
};
GM.getResourceText("react-toastify-css").then(insertCss);
const aborterAtom = (0, jotai.atom)(null);
const cancelDownloadAtom = (0, jotai.atom)(null, (get) => {
	get(aborterAtom)?.abort();
});
const startDownloadAtom = (0, jotai.atom)(null, async (get, set, options) => {
	const aborter = new AbortController();
	set(aborterAtom, (previous) => {
		previous?.abort();
		return aborter;
	});
	const viewerOptions = get(viewerOptionsAtom);
	const source = options?.source ?? viewerOptions.source;
	if (!source) return;
	let toastId = null;
	addEventListener("beforeunload", confirmDownloadAbort);
	try {
		toastId = (0, react_toastify.toast)( (0, react_jsx_runtime.jsx)(DownloadCancel, { onClick: aborter.abort }), {
			autoClose: false,
			progress: 0
		});
		return await download(source, {
			onProgress: reportProgress,
			onError: logIfNotAborted,
			signal: aborter.signal
		});
	} finally {
		removeEventListener("beforeunload", confirmDownloadAbort);
	}
	async function reportProgress(event) {
		if (!toastId) return;
		const { total, started, settled, rejected, status } = event;
		const value = started / total * .1 + settled / total * .89;
		switch (status) {
			case "ongoing":
				react_toastify.toast.update(toastId, {
					type: rejected > 0 ? "warning" : "default",
					progress: value
				});
				break;
			case "complete":
				react_toastify.toast.update(toastId, {
					type: "success",
					render: get(i18nAtom).downloadComplete,
					progress: .9999
				});
				await timeout(1e3);
				react_toastify.toast.done(toastId);
				break;
			case "error":
				react_toastify.toast.update(toastId, {
					type: "error",
					render: get(i18nAtom).errorOccurredWhileDownloading,
					progress: 0
				});
				break;
			case "cancelled":
				react_toastify.toast.done(toastId);
				break;
		}
	}
});
const downloadAndSaveAtom = (0, jotai.atom)(null, async (_get, set, options) => {
	const zip$1 = await set(startDownloadAtom, options);
	if (zip$1) await save(new Blob([zip$1]));
});
function logIfNotAborted(error) {
	if (isNotAbort(error)) console.error(error);
}
function isNotAbort(error) {
	return !/aborted/i.test(`${error}`);
}
function confirmDownloadAbort(event) {
	event.preventDefault();
	event.returnValue = "";
}
const gmStorage = {
	getItem: GM.getValue,
	setItem: GM.setValue,
	removeItem: (key) => GM.deleteValue(key),
	subscribe: (key, callback) => {
		const idPromise = GM.addValueChangeListener(key, (_key, _oldValue, newValue) => callback(newValue));
		return async () => {
			const id = await idPromise;
			await GM.removeValueChangeListener(id);
		};
	}
};
function atomWithGmValue(key, defaultValue) {
	return (0, jotai_utils.atomWithStorage)(key, defaultValue, gmStorage, { getOnInit: true });
}
const jsonSessionStorage = (0, jotai_utils.createJSONStorage)(() => sessionStorage);
function atomWithSession(key, defaultValue) {
	return (0, jotai_utils.atomWithStorage)(key, defaultValue, jsonSessionStorage, { getOnInit: true });
}
const defaultPreferences = {
	backgroundColor: "#eeeeee",
	singlePageCount: 1,
	maxZoomOutExponent: 3,
	maxZoomInExponent: 3,
	pageDirection: "rightToLeft",
	isFullscreenPreferred: false,
	fullscreenNoticeCount: 0
};

const scriptPreferencesAtom = (0, jotai.atom)({});

const preferencesPresetAtom = (0, jotai.atom)("default");
const [backgroundColorAtom] = atomWithPreferences("backgroundColor");
const [singlePageCountStorageAtom] = atomWithPreferences("singlePageCount");

const [maxZoomOutExponentAtom] = atomWithPreferences("maxZoomOutExponent");
const [maxZoomInExponentAtom] = atomWithPreferences("maxZoomInExponent");
const [pageDirectionAtom] = atomWithPreferences("pageDirection");
const [isFullscreenPreferredAtom, isFullscreenPreferredPromiseAtom] = atomWithPreferences("isFullscreenPreferred");
const [fullscreenNoticeCountAtom, fullscreenNoticeCountPromiseAtom] = atomWithPreferences("fullscreenNoticeCount");

const wasImmersiveAtom = atomWithSession("vim_comic_viewer.was_immersive", false);
function atomWithPreferences(key) {
	const asyncAtomAtom = (0, jotai.atom)((get) => {
		return atomWithGmValue(`vim_comic_viewer.preferences.${get(preferencesPresetAtom)}.${key}`, void 0);
	});
	const cacheAtom = (0, jotai_cache.atomWithCache)((get) => get(get(asyncAtomAtom)));
	const manualAtom = (0, jotai.atom)((get) => get(cacheAtom), updater);
	const loadableAtom = (0, jotai_utils.loadable)(manualAtom);
	return [(0, jotai.atom)((get) => {
		const value = get(loadableAtom);
		if (value.state === "hasData" && value.data !== void 0) return value.data;
		return get(scriptPreferencesAtom)[key] ?? defaultPreferences[key];
	}, updater), manualAtom];
	function updater(get, set, update) {
		return set(get(asyncAtomAtom), (value) => typeof update === "function" ? Promise.resolve(value).then(update) : update);
	}
}
const globalCss = document.createElement("style");
globalCss.innerHTML = `html, body {
  overflow: hidden;
}`;
function hideBodyScrollBar(doHide) {
	if (doHide) document.head.append(globalCss);
	else globalCss.remove();
}
async function setFullscreenElement(element) {
	if (element) await element.requestFullscreen?.();
	else await document.exitFullscreen?.();
}
function focusWithoutScroll(element) {
	element?.focus({ preventScroll: true });
}
function isUserGesturePermissionError(error) {
	return error?.message === "Permissions check failed";
}
const fullscreenElementAtom = (0, jotai.atom)(null);
const viewerElementAtom = (0, jotai.atom)(null);
const isViewerFullscreenAtom = (0, jotai.atom)((get) => {
	const viewerElement = get(viewerElementAtom);
	return !!viewerElement && viewerElement === get(fullscreenElementAtom);
});
const isImmersiveAtom = (0, jotai.atom)(false);
const isViewerImmersiveAtom = (0, jotai.atom)((get) => get(isImmersiveAtom));
const scrollBarStyleFactorAtom = (0, jotai.atom)((get) => ({
	fullscreenElement: get(fullscreenElementAtom),
	viewerElement: get(viewerElementAtom)
}), (get, set, factors) => {
	const { fullscreenElement, viewerElement, isImmersive } = factors;
	if (fullscreenElement !== void 0) set(fullscreenElementAtom, fullscreenElement);
	if (viewerElement !== void 0) set(viewerElementAtom, viewerElement);
	if (isImmersive !== void 0) {
		set(wasImmersiveAtom, isImmersive);
		set(isImmersiveAtom, isImmersive);
	}
	hideBodyScrollBar(!get(isViewerFullscreenAtom) && get(isImmersiveAtom));
});
const viewerFullscreenAtom = (0, jotai.atom)((get) => {
	get(isFullscreenPreferredAtom);
	return get(isViewerFullscreenAtom);
}, async (get, _set, value) => {
	const element = value ? get(viewerElementAtom) : null;
	const { fullscreenElement } = get(scrollBarStyleFactorAtom);
	if (element === fullscreenElement) return true;
	const fullscreenChange = new Promise((resolve) => {
		addEventListener("fullscreenchange", resolve, { once: true });
	});
	try {
		await setFullscreenElement(element);
		await fullscreenChange;
		return true;
	} catch (error) {
		if (isUserGesturePermissionError(error)) return false;
		throw error;
	}
});
const transitionDeferredAtom = (0, jotai.atom)({});
const transitionLockAtom = (0, jotai.atom)(null, async (get, set) => {
	const { deferred: previousLock } = get(transitionDeferredAtom);
	const lock = deferred();
	set(transitionDeferredAtom, { deferred: lock });
	await previousLock;
	return { deferred: lock };
});
const isFullscreenPreferredSettingsAtom = (0, jotai.atom)((get) => get(isFullscreenPreferredAtom), async (get, set, value) => {
	const promise = set(isFullscreenPreferredAtom, value);
	const appliedValue = value === jotai_utils.RESET ? (await promise, get(isFullscreenPreferredAtom)) : value;
	const lock = await set(transitionLockAtom);
	try {
		const wasImmersive = get(wasImmersiveAtom);
		await set(viewerFullscreenAtom, appliedValue && wasImmersive);
	} finally {
		lock.deferred.resolve();
	}
});

const maxSizeStateAtom = (0, jotai.atom)({
	width: screen.width,
	height: screen.height
});
const maxSizeAtom = (0, jotai.atom)((get) => get(maxSizeStateAtom), (get, set, size) => {
	const current = get(maxSizeStateAtom);
	if (size.width <= current.width && size.height <= current.height) return;
	set(maxSizeStateAtom, {
		width: Math.max(size.width, current.width),
		height: Math.max(size.height, current.height)
	});
});
const pageAtomsAtom = (0, jotai.atom)([]);
const refreshMediaSourceAtom = (0, jotai.atom)(null, async (get, set, params) => {
	const { source } = get(viewerOptionsAtom);
	if (!source) return;
	const medias = await source({
		...params,
		maxSize: get(maxSizeAtom)
	});
	if (source !== get(viewerOptionsAtom).source) return;
	if (!Array.isArray(medias)) throw new Error(`Invalid comic source type: ${typeof medias}`);
	if (params.cause === "load" && params.page === void 0) set(pageAtomsAtom, medias.map((media, index) => createPageAtom({
		initialSource: media,
		index,
		set
	})));
	if (params.page !== void 0) return medias[params.page];
});
function createPageAtom(params) {
	const { initialSource, index, set } = params;
	const triedUrls = [];
	let div = null;
	const stateAtom = (0, jotai.atom)({
		status: "loading",
		source: toMediaElement(initialSource)
	});
	const loadAtom = (0, jotai.atom)(null, async (get, set$1, cause) => {
		if (cause === "load") triedUrls.length = 0;
		if (isComplete()) return;
		let newSource;
		try {
			newSource = await set$1(refreshMediaSourceAtom, {
				cause,
				page: index
			});
		} catch (error) {
			console.error(error);
			set$1(stateAtom, (previous) => ({
				...previous,
				status: "error",
				urls: Array.from(triedUrls)
			}));
			return;
		}
		if (isComplete()) return;
		if (isDelay(newSource)) {
			set$1(stateAtom, {
				status: "error",
				urls: [],
				source: new Image()
			});
			return;
		}
		const source = toMediaElement(newSource);
		triedUrls.push(source.src);
		set$1(stateAtom, {
			status: "loading",
			source
		});
		function isComplete() {
			return get(stateAtom).status === "complete";
		}
	});
	const aggregateAtom = (0, jotai.atom)((get) => {
		get(loadAtom);
		const state = get(stateAtom);
		const scrollElementSize = get(scrollElementSizeAtom);
		const compactWidthIndex = get(singlePageCountAtom);
		const maxZoomInExponent = get(maxZoomInExponentAtom);
		const maxZoomOutExponent = get(maxZoomOutExponentAtom);
		const source = state.source;
		const width = source instanceof HTMLImageElement ? source.naturalWidth : source instanceof HTMLVideoElement ? source.videoWidth : void 0;
		const height = source instanceof HTMLImageElement ? source.naturalHeight : source instanceof HTMLVideoElement ? source.videoHeight : void 0;
		const ratio = getImageToViewerSizeRatio({
			viewerSize: scrollElementSize,
			imgSize: {
				width,
				height
			}
		});
		const shouldBeOriginalSize = shouldMediaBeOriginalSize({
			maxZoomInExponent,
			maxZoomOutExponent,
			mediaRatio: ratio
		});
		const canMessUpRow = shouldBeOriginalSize && ratio > 1;
		const mediaProps = {
			...Object.fromEntries([...source.attributes].map(({ name, value }) => [name, value])),
			onError: reload
		};
		const divCss = {
			...shouldBeOriginalSize ? {
				minHeight: scrollElementSize.height,
				height: "auto"
			} : { height: scrollElementSize.height },
			...state.status !== "complete" ? { aspectRatio: width && height ? `${width} / ${height}` : "3 / 4" } : {}
		};
		return {
			index,
			state,
			div,
			setDiv: (newDiv) => {
				div = newDiv;
			},
			sourceElement: initialSource instanceof HTMLElement ? initialSource : null,
			reloadAtom: loadAtom,
			fullWidth: index < compactWidthIndex || canMessUpRow,
			shouldBeOriginalSize,
			divCss,
			imageProps: source && source instanceof HTMLImageElement ? {
				...mediaProps,
				onLoad: setCompleteState
			} : void 0,
			videoProps: source instanceof HTMLVideoElement ? {
				controls: true,
				autoPlay: true,
				loop: true,
				muted: true,
				...mediaProps,
				onLoadedMetadata: setCompleteState
			} : void 0
		};
	});
	async function reload() {
		const isOverMaxRetry = triedUrls.length > MAX_RETRY_COUNT;
		const urlCountMap = triedUrls.reduce((acc, url) => {
			acc[url] = (acc[url] ?? 0) + 1;
			return acc;
		}, {});
		const isOverSameUrlRetry = Object.values(urlCountMap).some((count) => count > MAX_SAME_URL_RETRY_COUNT);
		if (isOverMaxRetry || isOverSameUrlRetry) {
			set(stateAtom, (previous) => ({
				...previous,
				status: "error",
				urls: [...new Set(triedUrls)]
			}));
			return;
		}
		set(stateAtom, () => ({
			status: "loading",
			source: new Image()
		}));
		await set(loadAtom, "error");
	}
	function setCompleteState(event) {
		const element = event.currentTarget;
		set(stateAtom, {
			status: "complete",
			source: element
		});
	}
	if (isDelay(initialSource)) set(loadAtom, "load");
	return aggregateAtom;
}
function getImageToViewerSizeRatio({ viewerSize, imgSize }) {
	if (!imgSize.height && !imgSize.width) return 1;
	return Math.max((imgSize.height ?? 0) / viewerSize.height, (imgSize.width ?? 0) / viewerSize.width);
}
function shouldMediaBeOriginalSize({ maxZoomOutExponent, maxZoomInExponent, mediaRatio }) {
	const minZoomRatio = Math.sqrt(2) ** maxZoomOutExponent;
	const maxZoomRatio = Math.sqrt(2) ** maxZoomInExponent;
	return minZoomRatio < mediaRatio || mediaRatio < 1 / maxZoomRatio;
}
const beforeRepaintAtom = (0, jotai.atom)({});
const useBeforeRepaint = () => {
	const { task } = (0, jotai.useAtomValue)(beforeRepaintAtom);
	(0, react.useLayoutEffect)(() => {
		task?.();
	}, [task]);
};
function getCurrentRow({ elements, viewportHeight }) {
	if (!elements.length) return;
	const scrollCenter = viewportHeight / 2;
	return elements.map((page) => ({
		page,
		rect: page.getBoundingClientRect()
	})).filter(isCenterCrossing);
	function isCenterCrossing({ rect: { y, height } }) {
		return y <= scrollCenter && y + height >= scrollCenter;
	}
}
function isVisible(element) {
	if ("checkVisibility" in element) return element.checkVisibility();
	const { x, y, width, height } = element.getBoundingClientRect();
	return document.elementsFromPoint(x + width / 2, y + height / 2).includes(element);
}
function hasNoticeableDifference(middle, lastMiddle) {
	return Math.abs(middle - lastMiddle) > .01;
}
function getInPageRatio({ page, viewportHeight }) {
	const scrollCenter = viewportHeight / 2;
	const { y, height } = page.rect;
	return 1 - (y + height - scrollCenter) / height;
}
function getScrollPage(middle, container) {
	const element = getPagesFromScrollElement(container)?.item(Math.floor(middle));
	return element instanceof HTMLElement ? element : null;
}
function getCurrentMiddleFromScrollElement({ scrollElement, previousMiddle }) {
	const elements = getPagesFromScrollElement(scrollElement);
	if (!elements || !scrollElement) return null;
	return getPageScroll({
		elements: [...elements],
		viewportHeight: scrollElement.getBoundingClientRect().height,
		previousMiddle
	});
}
function getNewSizeIfResized({ scrollElement, previousSize }) {
	if (!scrollElement) return;
	const { width, height } = scrollElement.getBoundingClientRect();
	const scrollHeight = scrollElement.scrollHeight;
	const { width: previousWidth, height: previousHeight, scrollHeight: previousScrollHeight } = previousSize;
	return previousWidth === 0 || previousHeight === 0 || previousWidth !== width || previousHeight !== height || previousScrollHeight !== scrollHeight ? {
		width,
		height,
		scrollHeight
	} : void 0;
}
function navigateByPointer(scrollElement, event) {
	const height = scrollElement?.clientHeight;
	if (!height || event.button !== 0) return;
	event.preventDefault();
	if (event.clientY < height / 2) goToPreviousArea(scrollElement);
	else goToNextArea(scrollElement);
}

function goToPreviousArea(scrollElement) {
	const page = getCurrentPageFromScrollElement({
		scrollElement,
		previousMiddle: Infinity
	});
	if (!page || !scrollElement) return;
	const { height: viewerHeight, top: viewerTop } = scrollElement.getBoundingClientRect();
	const ignorableHeight = viewerHeight * .05;
	const { top: pageTop } = page.getBoundingClientRect();
	const remainingHeight = viewerTop - pageTop;
	if (remainingHeight > ignorableHeight) {
		const divisor = Math.ceil(remainingHeight / viewerHeight);
		const yDiff = -Math.ceil(remainingHeight / divisor);
		scrollElement.scrollBy({ top: yDiff });
	} else goToPreviousRow(page);
}
function goToNextArea(scrollElement) {
	const page = getCurrentPageFromScrollElement({
		scrollElement,
		previousMiddle: 0
	});
	if (!page || !scrollElement) return;
	const { height: viewerHeight, bottom: viewerBottom } = scrollElement.getBoundingClientRect();
	const ignorableHeight = viewerHeight * .05;
	const { bottom: pageBottom } = page.getBoundingClientRect();
	const remainingHeight = pageBottom - viewerBottom;
	if (remainingHeight > ignorableHeight) {
		const divisor = Math.ceil(remainingHeight / viewerHeight);
		const yDiff = Math.ceil(remainingHeight / divisor);
		scrollElement.scrollBy({ top: yDiff });
	} else goToNextRow(page);
}
function toWindowScroll({ middle, lastMiddle, noSyncScroll, forFullscreen, scrollElement }) {
	if (noSyncScroll || !forFullscreen && !hasNoticeableDifference(middle, lastMiddle)) return;
	const page = getScrollPage(middle, scrollElement);
	const src = page?.querySelector("img[src], video[src]")?.src;
	if (!src) return;
	const original = findOriginElement(src, page);
	if (!original) return;
	const rect = original.getBoundingClientRect();
	const ratio = middle - Math.floor(middle);
	return scrollY + rect.y + rect.height * ratio - innerHeight / 2;
}
function getYDifferenceFromPrevious({ scrollable, middle }) {
	const page = getScrollPage(middle, scrollable);
	if (!page || !scrollable || scrollable.clientHeight < 1) return;
	const { height: scrollableHeight } = scrollable.getBoundingClientRect();
	const { y: pageY, height: pageHeight } = page.getBoundingClientRect();
	return pageY + pageHeight * (middle - Math.floor(middle)) - scrollableHeight / 2;
}
function getAbovePageIndex(scrollElement) {
	const children = getPagesFromScrollElement(scrollElement);
	if (!children || !scrollElement) return;
	const elements = [...children];
	const firstPage = getCurrentRow({
		elements,
		viewportHeight: scrollElement.clientHeight
	})?.[0]?.page;
	return firstPage ? elements.indexOf(firstPage) : void 0;
}
function findOriginElement(src, page) {
	const fileName = src.split("/").pop()?.split("?")[0];
	const originals = [...document.querySelectorAll(`img[src*="${fileName}"], video[src*="${fileName}"]`)].filter((media) => media.src === src && media.parentElement !== page && isVisible(media));
	if (originals.length === 1) return originals[0];
	const visibleLinks = [...document.querySelectorAll(`a[href*="${fileName}"`)].filter(isVisible);
	if (visibleLinks.length === 1) return visibleLinks[0];
}
function goToNextRow(currentPage) {
	const currentPageBottom = currentPage.getBoundingClientRect().bottom - .01;
	let page = currentPage;
	while (page.nextElementSibling) {
		page = page.nextElementSibling;
		if (currentPageBottom <= page.getBoundingClientRect().top) {
			page.scrollIntoView({
				behavior: "instant",
				block: "start"
			});
			return;
		}
	}
	page.scrollIntoView({
		behavior: "instant",
		block: "end"
	});
}
function goToPreviousRow(currentPage) {
	const currentPageTop = currentPage.getBoundingClientRect().top + .01;
	let page = currentPage;
	while (page.previousElementSibling) {
		page = page.previousElementSibling;
		if (page.getBoundingClientRect().bottom <= currentPageTop) {
			page.scrollIntoView({
				behavior: "instant",
				block: "end"
			});
			return;
		}
	}
	page.scrollIntoView({
		behavior: "instant",
		block: "start"
	});
}
function getCurrentPageFromScrollElement({ scrollElement, previousMiddle }) {
	const middle = getCurrentMiddleFromScrollElement({
		scrollElement,
		previousMiddle
	});
	if (!middle || !scrollElement) return null;
	return getScrollPage(middle, scrollElement);
}
function getPageScroll(params) {
	const currentPage = getCurrentPageFromElements(params);
	return currentPage ? getMiddle(currentPage) : void 0;
	function getMiddle(page) {
		const { viewportHeight, elements } = params;
		const ratio = getInPageRatio({
			page,
			viewportHeight
		});
		return elements.indexOf(page.page) + ratio;
	}
}
function getCurrentPageFromElements({ elements, viewportHeight, previousMiddle }) {
	const currentRow = getCurrentRow({
		elements,
		viewportHeight
	});
	if (!currentRow) return;
	return selectColumn(currentRow);
	function selectColumn(row) {
		const firstPage = row.find(({ page: page$1 }) => page$1 === elements[0]);
		if (firstPage) return firstPage;
		const lastPage = row.find(({ page: page$1 }) => page$1 === elements.at(-1));
		if (lastPage) return lastPage;
		const half = Math.floor(row.length / 2);
		if (row.length % 2 === 1) return row[half];
		const page = row[half]?.page;
		if (!page) return;
		return previousMiddle < elements.indexOf(page) ? row[half - 1] : row[half];
	}
}
function getPagesFromScrollElement(scrollElement) {
	return scrollElement?.firstElementChild?.children;
}
function toViewerScroll({ scrollable, lastWindowToViewerMiddle, noSyncScroll, mediaElements }) {
	if (lastWindowToViewerMiddle === "reset") return 0;
	const lastMiddle = lastWindowToViewerMiddle === "notFound" ? 0 : lastWindowToViewerMiddle;
	if (!scrollable || noSyncScroll) return;
	const viewerMedia = [...scrollable.querySelectorAll("img[src], video[src]")];
	const urlToViewerPages =  new Map();
	for (const media of viewerMedia) urlToViewerPages.set(media.src, media);
	const urls = [...urlToViewerPages.keys()];
	const visibleSiteMedia = [...new Set([...getUrlMedia(urls), ...mediaElements])].filter((medium) => !viewerMedia.includes(medium) && isVisible(medium));
	const viewportHeight = visualViewport?.height ?? innerHeight;
	const currentRow = getCurrentRow({
		elements: visibleSiteMedia,
		viewportHeight
	});
	if (!currentRow) return;
	const indexed = currentRow.map((sized) => [sized, getUrlIndex(sized.page, urls)]);
	const last = lastMiddle - .5;
	const [page, index] = indexed.sort((a, b) => Math.abs(a[1] - last) - Math.abs(b[1] - last))[0] ?? [];
	if (!page || index === void 0) return;
	const pageRatio = getInPageRatio({
		page,
		viewportHeight
	});
	const snappedRatio = Math.abs(pageRatio - .5) < .1 ? .5 : pageRatio;
	if (!hasNoticeableDifference(index + snappedRatio, lastMiddle)) return;
	return index + snappedRatio;
}
function getUrlMedia(urls) {
	return [...document.querySelectorAll("img, video")].filter((medium) => getUrlIndex(medium, urls) !== -1);
}
function getUrlIndex(medium, urls) {
	if (medium instanceof HTMLImageElement) {
		const img = medium;
		const parent = img.parentElement;
		const imgUrlIndex = urls.findIndex((x) => x === img.src);
		const pictureUrlIndex = parent instanceof HTMLPictureElement ? getUrlIndexFromSrcset(parent, urls) : -1;
		return imgUrlIndex === -1 ? pictureUrlIndex : imgUrlIndex;
	} else if (medium instanceof HTMLVideoElement) {
		const video = medium;
		const videoUrlIndex = urls.findIndex((x) => x === video.src);
		const srcsetUrlIndex = getUrlIndexFromSrcset(video, urls);
		return videoUrlIndex === -1 ? srcsetUrlIndex : videoUrlIndex;
	}
	return -1;
}
function getUrlIndexFromSrcset(media, urls) {
	for (const url of getUrlsFromSources(media)) {
		const index = urls.findIndex((x) => x === url);
		if (index !== -1) return index;
	}
	return -1;
}
function getUrlsFromSources(picture) {
	return [...picture.querySelectorAll("source")].flatMap((x) => getSrcFromSrcset(x.srcset));
}
function getSrcFromSrcset(srcset) {
	return srcset.split(",").map((x) => x.split(/\s+/)[0]).filter((x) => x !== void 0);
}
const scrollElementStateAtom = (0, jotai.atom)(null);
const scrollElementAtom = (0, jotai.atom)((get) => get(scrollElementStateAtom)?.div ?? null);
const scrollElementSizeAtom = (0, jotai.atom)({
	width: 0,
	height: 0,
	scrollHeight: 0
});
const pageScrollMiddleAtom = (0, jotai.atom)(.5);
const lastViewerToWindowMiddleAtom = (0, jotai.atom)(-1);

const lastWindowToViewerMiddleAtom = (0, jotai.atom)("reset");
const transferWindowScrollToViewerAtom = (0, jotai.atom)(null, (get, set) => {
	const middle = toViewerScroll({
		scrollable: get(scrollElementAtom),
		lastWindowToViewerMiddle: get(lastWindowToViewerMiddleAtom),
		noSyncScroll: get(viewerOptionsAtom).noSyncScroll ?? false,
		mediaElements: get(pageAtomsAtom).map((atom$3) => get(atom$3).sourceElement).filter((x) => x !== null)
	});
	set(lastWindowToViewerMiddleAtom, middle ?? "notFound");
	if (typeof middle === "number") set(pageScrollMiddleAtom, middle);
});
const transferViewerScrollToWindowAtom = (0, jotai.atom)(null, (get, set, { forFullscreen } = {}) => {
	const middle = get(pageScrollMiddleAtom);
	const scrollElement = get(scrollElementAtom);
	const top = toWindowScroll({
		middle,
		lastMiddle: get(lastViewerToWindowMiddleAtom),
		scrollElement,
		noSyncScroll: get(viewerOptionsAtom).noSyncScroll ?? false,
		forFullscreen
	});
	if (top !== void 0) {
		set(lastViewerToWindowMiddleAtom, middle);
		scroll({
			behavior: "instant",
			top
		});
	}
});
const synchronizeScrollAtom = (0, jotai.atom)(null, (get, set) => {
	const scrollElement = get(scrollElementAtom);
	if (!scrollElement) return;
	if (set(correctScrollAtom)) return;
	const middle = getCurrentMiddleFromScrollElement({
		scrollElement,
		previousMiddle: get(pageScrollMiddleAtom)
	});
	if (middle) {
		set(pageScrollMiddleAtom, middle);
		set(transferViewerScrollToWindowAtom);
	}
});
const correctScrollAtom = (0, jotai.atom)(null, (get, set) => {
	const newSize = getNewSizeIfResized({
		scrollElement: get(scrollElementAtom),
		previousSize: get(scrollElementSizeAtom)
	});
	if (!newSize) return false;
	set(scrollElementSizeAtom, newSize);
	set(restoreScrollAtom);
	return true;
});
const restoreScrollAtom = (0, jotai.atom)(null, (get, set) => {
	const middle = get(pageScrollMiddleAtom);
	const scrollable = get(scrollElementAtom);
	const restored = getYDifferenceFromPrevious({
		scrollable,
		middle
	});
	if (restored != null) {
		scrollable?.scrollBy({ top: restored });
		set(beforeRepaintAtom, { task: () => set(correctScrollAtom) });
	}
});
const goNextAtom = (0, jotai.atom)(null, (get) => {
	goToNextArea(get(scrollElementAtom));
});
const goPreviousAtom = (0, jotai.atom)(null, (get) => {
	goToPreviousArea(get(scrollElementAtom));
});
const navigateAtom = (0, jotai.atom)(null, (get, _set, event) => {
	navigateByPointer(get(scrollElementAtom), event);
});
const singlePageCountAtom = (0, jotai.atom)((get) => get(singlePageCountStorageAtom), async (get, set, value) => {
	const clampedValue = typeof value === "number" ? Math.max(0, value) : value;
	const middle = get(pageScrollMiddleAtom);
	const scrollElement = get(scrollElementAtom);
	await set(singlePageCountStorageAtom, clampedValue);
	set(beforeRepaintAtom, { task: () => {
		const yDifference = getYDifferenceFromPrevious({
			scrollable: scrollElement,
			middle
		});
		if (yDifference != null) scrollElement?.scrollBy({ top: yDifference });
		set(pageScrollMiddleAtom, middle);
	} });
});
const anchorSinglePageCountAtom = (0, jotai.atom)(null, (get, set) => {
	const abovePageIndex = getAbovePageIndex(get(scrollElementAtom));
	if (abovePageIndex !== void 0) set(singlePageCountAtom, abovePageIndex);
});
const externalFocusElementAtom = (0, jotai.atom)(null);
const setViewerImmersiveAtom = (0, jotai.atom)(null, async (get, set, value) => {
	const lock = await set(transitionLockAtom);
	try {
		await transactImmersive(get, set, value);
	} finally {
		lock.deferred.resolve();
	}
});
async function transactImmersive(get, set, value) {
	if (get(isViewerImmersiveAtom) === value) return;
	if (value) {
		set(externalFocusElementAtom, (previous) => previous ? previous : document.activeElement);
		set(transferWindowScrollToViewerAtom);
	}
	const scrollable = get(scrollElementAtom);
	if (!scrollable) return;
	const { fullscreenElement } = get(scrollBarStyleFactorAtom);
	try {
		if (get(isFullscreenPreferredAtom)) {
			if (!await set(viewerFullscreenAtom, value)) {
				if (shouldShowF11Guide({ noticeCount: await get(fullscreenNoticeCountPromiseAtom) ?? 0 })) {
					showF11Guide();
					return;
				}
			}
		}
	} finally {
		set(scrollBarStyleFactorAtom, { isImmersive: value });
		if (value) focusWithoutScroll(scrollable);
		else {
			if (fullscreenElement) set(transferViewerScrollToWindowAtom, { forFullscreen: true });
			focusWithoutScroll(get(externalFocusElementAtom));
		}
	}
	function showF11Guide() {
		(0, react_toastify.toast)(get(i18nAtom).fullScreenRestorationGuide, {
			type: "info",
			onClose: () => {
				set(fullscreenNoticeCountPromiseAtom, (count) => (count ?? 0) + 1);
			}
		});
	}
}
const isBeforeUnloadAtom = (0, jotai.atom)(false);
const beforeUnloadAtom = (0, jotai.atom)(null, async (_get, set) => {
	set(isBeforeUnloadAtom, true);
	await waitUnloadFinishRoughly();
	set(isBeforeUnloadAtom, false);
});
beforeUnloadAtom.onMount = (set) => {
	addEventListener("beforeunload", set);
	return () => removeEventListener("beforeunload", set);
};
const fullscreenSynchronizationAtom = (0, jotai.atom)((get) => {
	get(isBeforeUnloadAtom);
	return get(scrollBarStyleFactorAtom).fullscreenElement;
}, (get, set, element) => {
	const isFullscreenPreferred = get(isFullscreenPreferredAtom);
	const isFullscreen = element === get(scrollBarStyleFactorAtom).viewerElement;
	const isViewerFullscreenExit = get(isViewerImmersiveAtom) && !isFullscreen;
	const isNavigationExit = get(isBeforeUnloadAtom);
	set(scrollBarStyleFactorAtom, {
		fullscreenElement: element,
		isImmersive: isFullscreenPreferred && isViewerFullscreenExit && !isNavigationExit ? false : void 0
	});
});
fullscreenSynchronizationAtom.onMount = (set) => {
	const notify = () => set(document.fullscreenElement ?? null);
	document.addEventListener("fullscreenchange", notify);
	return () => document.removeEventListener("fullscreenchange", notify);
};
const setViewerElementAtom = (0, jotai.atom)(null, (_get, set, element) => {
	set(scrollBarStyleFactorAtom, { viewerElement: element });
});
const viewerModeAtom = (0, jotai.atom)((get) => {
	const isFullscreen = get(viewerFullscreenAtom);
	const isImmersive = get(isViewerImmersiveAtom);
	return isFullscreen ? "fullscreen" : isImmersive ? "window" : "normal";
});
const setViewerOptionsAtom = (0, jotai.atom)(null, async (get, set, options) => {
	try {
		const { source } = options;
		const previousOptions = get(viewerOptionsAtom);
		if (!(source && source !== previousOptions.source)) return;
		set(viewerStatusAtom, (previous) => previous === "complete" ? "complete" : "loading");
		set(viewerOptionsAtom, options);
		await set(refreshMediaSourceAtom, { cause: "load" });
		set(lastWindowToViewerMiddleAtom, "reset");
		set(viewerStatusAtom, "complete");
	} catch (error) {
		set(viewerStatusAtom, "error");
		throw error;
	}
});
const reloadErroredAtom = (0, jotai.atom)(null, (get, set) => {
	stop();
	for (const page of get(pageAtomsAtom).map(get)) if (page.state.status !== "complete") set(page.reloadAtom, "load");
});
const toggleImmersiveAtom = (0, jotai.atom)(null, async (get, set) => {
	if (get(viewerModeAtom) === "window" && get(isFullscreenPreferredAtom)) {
		await set(viewerFullscreenAtom, true);
		return;
	}
	await set(setViewerImmersiveAtom, !get(isViewerImmersiveAtom));
});
const toggleFullscreenAtom = (0, jotai.atom)(null, async (get, set) => {
	set(isFullscreenPreferredSettingsAtom, !get(isFullscreenPreferredSettingsAtom));
	if (get(viewerModeAtom) === "normal") await set(setViewerImmersiveAtom, true);
});
const blockSelectionAtom = (0, jotai.atom)(null, (_get, set, event) => {
	if (event.detail >= 2) event.preventDefault();
	if (event.buttons === 3) {
		set(toggleImmersiveAtom);
		event.preventDefault();
	}
});

async function waitUnloadFinishRoughly() {
	for (let i = 0; i < 5; i++) await timeout(100);
}
function shouldShowF11Guide({ noticeCount }) {
	const isUserFullscreen = innerHeight === screen.height || innerWidth === screen.width;
	return noticeCount < 3 && !isUserFullscreen;
}
const defaultKeyBindings = {
	toggleViewer: [
		"KeyI",
		"Numpad0",
		"Enter"
	],
	nextPage: [
		"KeyJ",
		"ArrowDown",
		"KeyQ",
		"PageDown"
	],
	previousPage: [
		"KeyK",
		"ArrowUp",
		"PageUp"
	],
	nextSeries: [
		"KeyL",
		"ArrowRight",
		"KeyW"
	],
	previousSeries: ["KeyH", "ArrowLeft"],
	download: ["Semicolon"],
	refresh: ["Quote"],
	decreaseSinglePageCount: ["Comma"],
	increaseSinglePageCount: ["Period"],
	anchorSinglePageCount: ["Slash"]
};
const globalActions = ["toggleViewer"];
const elementActions = [
	"nextPage",
	"previousPage",
	"nextSeries",
	"previousSeries",
	"download",
	"refresh",
	"decreaseSinglePageCount",
	"increaseSinglePageCount",
	"anchorSinglePageCount"
];
const keyCodeDisplayNames = {
	KeyI: "i",
	KeyJ: "j",
	KeyK: "k",
	KeyH: "h",
	KeyL: "l",
	KeyQ: "q",
	KeyW: "w",
	Numpad0: "NumPad0",
	Enter: "Enter⏎",
	ArrowUp: "↑",
	ArrowDown: "↓",
	ArrowLeft: "←",
	ArrowRight: "→",
	PageUp: "PgUp",
	PageDown: "PgDown",
	Semicolon: ";",
	Comma: ",",
	Period: ".",
	Slash: "/",
	Quote: "'"
};
function getKeyDisplayName(code) {
	return keyCodeDisplayNames[code] ?? code;
}
const keyBindingsStorageAtomAtom = (0, jotai.atom)((get) => {
	return atomWithGmValue(`vim_comic_viewer.keybindings.${get(preferencesPresetAtom)}`, void 0);
});
const keyBindingsLoadableAtom = (0, jotai_utils.loadable)((0, jotai_cache.atomWithCache)((get) => get(get(keyBindingsStorageAtomAtom))));
const keyBindingsAtom = (0, jotai.atom)((get) => {
	const loaded = get(keyBindingsLoadableAtom);
	const stored = loaded.state === "hasData" ? loaded.data : void 0;
	return {
		...defaultKeyBindings,
		...stored
	};
}, async (get, set, update) => {
	const storageAtom = get(keyBindingsStorageAtomAtom);
	if (update === jotai_utils.RESET) {
		await set(storageAtom, void 0);
		return;
	}
	await set(storageAtom, {
		...await get(storageAtom),
		...update
	});
});
const globalKeyToActionAtom = (0, jotai.atom)((get) => {
	const bindings = get(keyBindingsAtom);
	const map =  new Map();
	for (const action of globalActions) for (const key of bindings[action]) map.set(key, action);
	return map;
});
const elementKeyToActionAtom = (0, jotai.atom)((get) => {
	const bindings = get(keyBindingsAtom);
	const map =  new Map();
	for (const action of elementActions) for (const key of bindings[action]) map.set(key, action);
	return map;
});
const controllerPrimitiveAtom = (0, jotai.atom)(null);
const controllerAtom = (0, jotai.atom)((get) => get(controllerPrimitiveAtom), (get, set) => {
	const existing = get(controllerPrimitiveAtom);
	if (existing) return existing;
	const controller = new Controller(get, set);
	set(controllerPrimitiveAtom, controller);
	return controller;
});
controllerAtom.onMount = (set) => void set();
const effectivePreferencesAtom = (0, jotai.atom)((get) => ({
	backgroundColor: get(backgroundColorAtom),
	singlePageCount: get(singlePageCountStorageAtom),
	maxZoomOutExponent: get(maxZoomOutExponentAtom),
	maxZoomInExponent: get(maxZoomInExponentAtom),
	pageDirection: get(pageDirectionAtom),
	isFullscreenPreferred: get(isFullscreenPreferredAtom),
	fullscreenNoticeCount: get(fullscreenNoticeCountAtom)
}), (get, set, update) => {
	if (typeof update === "function") return updatePreferences(update(get(effectivePreferencesAtom)));
	return updatePreferences(update);
	function updatePreferences(preferences) {
		return Promise.all([
			updateIfDefined(backgroundColorAtom, preferences.backgroundColor),
			updateIfDefined(singlePageCountAtom, preferences.singlePageCount),
			updateIfDefined(maxZoomOutExponentAtom, preferences.maxZoomOutExponent),
			updateIfDefined(maxZoomInExponentAtom, preferences.maxZoomInExponent),
			updateIfDefined(pageDirectionAtom, preferences.pageDirection),
			updateIfDefined(isFullscreenPreferredAtom, preferences.isFullscreenPreferred),
			updateIfDefined(fullscreenNoticeCountAtom, preferences.fullscreenNoticeCount)
		]);
	}
	function updateIfDefined(atom$3, value) {
		return value !== void 0 ? set(atom$3, value) : Promise.resolve();
	}
});
var Controller = class {
	currentElementKeyHandler = null;
	constructor(get, set) {
		this.get = get;
		this.set = set;
		addEventListener("keydown", this.defaultGlobalKeyHandler);
		this.elementKeyHandler = this.defaultElementKeyHandler;
	}
	get options() {
		return this.get(viewerOptionsAtom);
	}
	get status() {
		return this.get(viewerStatusAtom);
	}
	get container() {
		return this.get(scrollBarStyleFactorAtom).viewerElement;
	}
	downloader = {
		download: (options) => this.set(startDownloadAtom, options),
		downloadAndSave: (options) => this.set(downloadAndSaveAtom, options),
		cancel: () => this.set(cancelDownloadAtom)
	};
	get pages() {
		return this.get(pageAtomsAtom).map(this.get);
	}
	get viewerMode() {
		return this.get(viewerModeAtom);
	}
	get effectivePreferences() {
		return this.get(effectivePreferencesAtom);
	}
	set elementKeyHandler(handler) {
		const { currentElementKeyHandler, container } = this;
		const scrollable = this.container?.querySelector("div[data-overlayscrollbars-viewport]");
		if (currentElementKeyHandler) {
			container?.removeEventListener("keydown", currentElementKeyHandler);
			scrollable?.removeEventListener("keydown", currentElementKeyHandler);
		}
		if (handler) {
			container?.addEventListener("keydown", handler);
			scrollable?.addEventListener("keydown", handler);
		}
	}
	setOptions = (value) => {
		return this.set(setViewerOptionsAtom, value);
	};
	goPrevious = () => {
		this.set(goPreviousAtom);
	};
	goNext = () => {
		this.set(goNextAtom);
	};
	setManualPreferences = (value) => {
		return this.set(effectivePreferencesAtom, value);
	};
	setScriptPreferences = ({ manualPreset, preferences }) => {
		if (manualPreset) this.set(preferencesPresetAtom, manualPreset);
		if (preferences) this.set(scriptPreferencesAtom, preferences);
	};
	setImmersive = (value) => {
		return this.set(setViewerImmersiveAtom, value);
	};
	setIsFullscreenPreferred = (value) => {
		return this.set(isFullscreenPreferredSettingsAtom, value);
	};
	toggleImmersive = () => {
		this.set(toggleImmersiveAtom);
	};
	toggleFullscreen = () => {
		this.set(toggleFullscreenAtom);
	};
	reloadErrored = () => {
		this.set(reloadErroredAtom);
	};
	unmount = () => {
		return this.get(rootAtom)?.unmount();
	};
	defaultElementKeyHandler = (event) => {
		if (maybeNotHotkey(event)) return false;
		const isHandled = this.handleElementKey(event);
		if (isHandled) {
			event.stopPropagation();
			event.preventDefault();
		}
		return isHandled;
	};
	defaultGlobalKeyHandler = (event) => {
		if (maybeNotHotkey(event)) return false;
		if (this.get(globalKeyToActionAtom).get(event.code) === "toggleViewer") {
			if (event.shiftKey) this.toggleFullscreen();
			else this.toggleImmersive();
			return true;
		}
		return false;
	};
	handleElementKey(event) {
		const action = this.get(elementKeyToActionAtom).get(event.code);
		if (!action) return false;
		return this.executeAction(action);
	}
	executeAction(action) {
		switch (action) {
			case "nextPage":
				this.goNext();
				return true;
			case "previousPage":
				this.goPrevious();
				return true;
			case "previousSeries":
				if (this.options.onPreviousSeries) {
					this.options.onPreviousSeries();
					return true;
				}
				return false;
			case "nextSeries":
				if (this.options.onNextSeries) {
					this.options.onNextSeries();
					return true;
				}
				return false;
			case "download":
				this.downloader?.downloadAndSave();
				return true;
			case "decreaseSinglePageCount":
				this.addSinglePageCount(-1);
				return true;
			case "increaseSinglePageCount":
				this.addSinglePageCount(1);
				return true;
			case "anchorSinglePageCount":
				this.set(anchorSinglePageCountAtom);
				return true;
			case "refresh":
				this.reloadErrored();
				return true;
			default: return false;
		}
	}
	async addSinglePageCount(diff) {
		await this.setManualPreferences((preferences) => ({
			...preferences,
			singlePageCount: this.effectivePreferences.singlePageCount + diff
		}));
	}
};
function maybeNotHotkey(event) {
	const { ctrlKey, altKey, metaKey } = event;
	return ctrlKey || altKey || metaKey || isTyping(event);
}
const setScrollElementAtom = (0, jotai.atom)(null, async (get, set, div) => {
	const previous = get(scrollElementStateAtom);
	if (previous?.div === div) return;
	previous?.resizeObserver.disconnect();
	if (div === null) {
		set(scrollElementStateAtom, null);
		return;
	}
	const setScrollElementSize = () => {
		set(maxSizeAtom, div.getBoundingClientRect());
		set(correctScrollAtom);
	};
	const resizeObserver = new ResizeObserver(setScrollElementSize);
	resizeObserver.observe(div);
	resizeObserver.observe(div.firstElementChild);
	div.addEventListener("wheel", navigateWithWheel);
	function navigateWithWheel(event) {
		const unit = event.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? 10 : 1;
		const diff = event.deltaY / unit;
		if (diff >= 1) set(goNextAtom);
		else if (diff <= -1) set(goPreviousAtom);
		event.preventDefault();
		event.stopPropagation();
	}
	set(scrollElementStateAtom, {
		div,
		resizeObserver
	});
	setScrollElementSize();
	await get(isFullscreenPreferredPromiseAtom);
	await set(setViewerImmersiveAtom, get(wasImmersiveAtom));
	return () => {
		div.removeEventListener("wheel", navigateWithWheel);
	};
});
const Svg = styled("svg", {
	opacity: "50%",
	filter: "drop-shadow(0 0 1px white) drop-shadow(0 0 1px white)",
	color: "black"
});
const downloadCss = { width: "40px" };
const fullscreenCss = {
	position: "absolute",
	right: "1%",
	bottom: "1%"
};
const IconButton = styled("button", {
	display: "flex",
	padding: 0,
	border: "none",
	background: "transparent",
	cursor: "pointer",
	"& > svg": { pointerEvents: "none" },
	"&:hover > svg": {
		opacity: "100%",
		transform: "scale(1.1)"
	},
	"&:focus > svg": { opacity: "100%" }
});
const DownloadButton = (props) =>  (0, react_jsx_runtime.jsx)(IconButton, {
	...props,
	children:  (0, react_jsx_runtime.jsx)(Svg, {
		version: "1.1",
		xmlns: "http://www.w3.org/2000/svg",
		x: "0px",
		y: "0px",
		viewBox: "0 -34.51 122.88 122.87",
		css: downloadCss,
		children:  (0, react_jsx_runtime.jsx)("g", { children:  (0, react_jsx_runtime.jsx)("path", { d: "M58.29,42.08V3.12C58.29,1.4,59.7,0,61.44,0s3.15,1.4,3.15,3.12v38.96L79.1,29.4c1.3-1.14,3.28-1.02,4.43,0.27 s1.03,3.25-0.27,4.39L63.52,51.3c-1.21,1.06-3.01,1.03-4.18-0.02L39.62,34.06c-1.3-1.14-1.42-3.1-0.27-4.39 c1.15-1.28,3.13-1.4,4.43-0.27L58.29,42.08L58.29,42.08L58.29,42.08z M0.09,47.43c-0.43-1.77,0.66-3.55,2.43-3.98 c1.77-0.43,3.55,0.66,3.98,2.43c1.03,4.26,1.76,7.93,2.43,11.3c3.17,15.99,4.87,24.57,27.15,24.57h52.55 c20.82,0,22.51-9.07,25.32-24.09c0.67-3.6,1.4-7.5,2.44-11.78c0.43-1.77,2.21-2.86,3.98-2.43c1.77,0.43,2.85,2.21,2.43,3.98 c-0.98,4.02-1.7,7.88-2.36,11.45c-3.44,18.38-5.51,29.48-31.8,29.48H36.07C8.37,88.36,6.3,77.92,2.44,58.45 C1.71,54.77,0.98,51.08,0.09,47.43L0.09,47.43z" }) })
	})
});
const FullscreenButton = (props) =>  (0, react_jsx_runtime.jsx)(IconButton, {
	css: fullscreenCss,
	...props,
	children:  (0, react_jsx_runtime.jsx)(Svg, {
		version: "1.1",
		xmlns: "http://www.w3.org/2000/svg",
		x: "0px",
		y: "0px",
		viewBox: "0 0 122.88 122.87",
		width: "40px",
		children:  (0, react_jsx_runtime.jsx)("g", { children:  (0, react_jsx_runtime.jsx)("path", { d: "M122.88,77.63v41.12c0,2.28-1.85,4.12-4.12,4.12H77.33v-9.62h35.95c0-12.34,0-23.27,0-35.62H122.88L122.88,77.63z M77.39,9.53V0h41.37c2.28,0,4.12,1.85,4.12,4.12v41.18h-9.63V9.53H77.39L77.39,9.53z M9.63,45.24H0V4.12C0,1.85,1.85,0,4.12,0h41 v9.64H9.63V45.24L9.63,45.24z M45.07,113.27v9.6H4.12c-2.28,0-4.12-1.85-4.12-4.13V77.57h9.63v35.71H45.07L45.07,113.27z" }) })
	})
});
const ErrorIcon = styled("svg", {
	width: "10vmin",
	height: "10vmin",
	fill: "hsl(0, 50%, 20%)",
	margin: "2rem"
});
const CircledX = (props) => {
	return  (0, react_jsx_runtime.jsx)(ErrorIcon, {
		x: "0px",
		y: "0px",
		viewBox: "0 0 122.881 122.88",
		"enable-background": "new 0 0 122.881 122.88",
		...props,
		children:  (0, react_jsx_runtime.jsx)("g", { children:  (0, react_jsx_runtime.jsx)("path", { d: "M61.44,0c16.966,0,32.326,6.877,43.445,17.996c11.119,11.118,17.996,26.479,17.996,43.444 c0,16.967-6.877,32.326-17.996,43.444C93.766,116.003,78.406,122.88,61.44,122.88c-16.966,0-32.326-6.877-43.444-17.996 C6.877,93.766,0,78.406,0,61.439c0-16.965,6.877-32.326,17.996-43.444C29.114,6.877,44.474,0,61.44,0L61.44,0z M80.16,37.369 c1.301-1.302,3.412-1.302,4.713,0c1.301,1.301,1.301,3.411,0,4.713L65.512,61.444l19.361,19.362c1.301,1.301,1.301,3.411,0,4.713 c-1.301,1.301-3.412,1.301-4.713,0L60.798,66.157L41.436,85.52c-1.301,1.301-3.412,1.301-4.713,0c-1.301-1.302-1.301-3.412,0-4.713 l19.363-19.362L36.723,42.082c-1.301-1.302-1.301-3.412,0-4.713c1.301-1.302,3.412-1.302,4.713,0l19.363,19.362L80.16,37.369 L80.16,37.369z M100.172,22.708C90.26,12.796,76.566,6.666,61.44,6.666c-15.126,0-28.819,6.13-38.731,16.042 C12.797,32.62,6.666,46.314,6.666,61.439c0,15.126,6.131,28.82,16.042,38.732c9.912,9.911,23.605,16.042,38.731,16.042 c15.126,0,28.82-6.131,38.732-16.042c9.912-9.912,16.043-23.606,16.043-38.732C116.215,46.314,110.084,32.62,100.172,22.708 L100.172,22.708z" }) })
	});
};
const SettingsButton = (props) => {
	return  (0, react_jsx_runtime.jsx)(IconButton, {
		...props,
		children:  (0, react_jsx_runtime.jsxs)(Svg, {
			fill: "none",
			stroke: "currentColor",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			strokeWidth: 2,
			viewBox: "0 0 24 24",
			height: "40px",
			width: "40px",
			children: [ (0, react_jsx_runtime.jsx)("path", { d: "M15 12 A3 3 0 0 1 12 15 A3 3 0 0 1 9 12 A3 3 0 0 1 15 12 z" }),  (0, react_jsx_runtime.jsx)("path", { d: "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" })]
		})
	});
};
const RightArrow = (props) => {
	return  (0, react_jsx_runtime.jsx)(Svg, {
		viewBox: "0 0 330 330",
		...props,
		children:  (0, react_jsx_runtime.jsx)("path", { d: "M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001\n	c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213\n	C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606\n	C255,161.018,253.42,157.202,250.606,154.389z" })
	});
};
const LeftArrow = (props) => {
	return  (0, react_jsx_runtime.jsx)(RightArrow, {
		...props,
		transform: "rotate(180)"
	});
};
const Container = styled("div", {
	position: "relative",
	height: "100%",
	overflow: "hidden",
	userSelect: "none",
	fontFamily: "Pretendard, NanumGothic, sans-serif",
	fontSize: "16px",
	color: "black",
	"& *:focus-visible": { outline: "none" },
	variants: { immersive: { true: {
		position: "fixed",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	} } }
});
const OverlayScroller = styled("div", {
	position: "relative",
	width: "100%",
	height: "100%",
	"& .os-scrollbar": { zIndex: 1 },
	"& .os-scrollbar-handle": {
		backdropFilter: "brightness(0.5)",
		background: "none",
		border: "#fff8 1px solid"
	},
	variants: { fullscreen: { true: {
		position: "fixed",
		top: 0,
		bottom: 0,
		overflow: "auto"
	} } }
});
GM.getResourceText("overlayscrollbars-css").then(insertCss);
const Backdrop = styled("div", {
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	background: "rgba(0, 0, 0, 0.5)",
	transition: "0.2s",
	variants: { isOpen: {
		true: {
			opacity: 1,
			pointerEvents: "auto"
		},
		false: {
			opacity: 0,
			pointerEvents: "none"
		}
	} }
});
const CenterDialog = styled("div", {
	minWidth: "20em",
	minHeight: "20em",
	transition: "0.2s",
	background: "white",
	padding: "20px",
	borderRadius: "10px",
	boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)"
});
function BackdropDialog({ onClose, ...props }) {
	const [isOpen, setIsOpen] = (0, react.useState)(false);
	const close = async () => {
		setIsOpen(false);
		await timeout(200);
		onClose();
	};
	const closeIfEnter = (event) => {
		if (event.key === "Enter") {
			close();
			event.stopPropagation();
		}
	};
	(0, react.useEffect)(() => {
		setIsOpen(true);
	}, []);
	return  (0, react_jsx_runtime.jsx)(Backdrop, {
		isOpen,
		onClick: close,
		onKeyDown: closeIfEnter,
		children:  (0, react_jsx_runtime.jsx)(CenterDialog, {
			onClick: (event) => event.stopPropagation(),
			...props
		})
	});
}
function KeyBindingsTab() {
	const [bindings, setBindings] = (0, jotai.useAtom)(keyBindingsAtom);
	const [editingAction, setEditingAction] = (0, react.useState)(null);
	const strings = (0, jotai.useAtomValue)(i18nAtom);
	(0, react.useEffect)(() => {
		if (!editingAction) return;
		const handler = (event) => {
			event.preventDefault();
			event.stopPropagation();
			const newKeys = [...bindings[editingAction]];
			if (!newKeys.includes(event.code)) {
				newKeys.push(event.code);
				setBindings({ [editingAction]: newKeys });
			}
			setEditingAction(null);
		};
		addEventListener("keydown", handler, { capture: true });
		return () => removeEventListener("keydown", handler, { capture: true });
	}, [
		editingAction,
		bindings,
		setBindings
	]);
	const removeKey = (action, keyToRemove) => {
		const newKeys = bindings[action].filter((k) => k !== keyToRemove);
		setBindings({ [action]: newKeys });
	};
	const resetAction = (action) => {
		setBindings({ [action]: defaultKeyBindings[action] });
	};
	const resetAll = () => {
		setBindings(jotai_utils.RESET);
	};
	return  (0, react_jsx_runtime.jsxs)(Container$1, { children: [ (0, react_jsx_runtime.jsx)(ActionList, { children: [...globalActions, ...elementActions].map((action) =>  (0, react_jsx_runtime.jsxs)(ActionRow, { children: [
		 (0, react_jsx_runtime.jsx)(ActionName, { children: strings[action] ?? action }),
		 (0, react_jsx_runtime.jsxs)(KeysContainer, { children: [bindings[action].map((key) =>  (0, react_jsx_runtime.jsxs)(KeyBadge, { children: [ (0, react_jsx_runtime.jsx)("kbd", { children: getKeyDisplayName(key) }),  (0, react_jsx_runtime.jsx)(RemoveButton, {
			onClick: () => removeKey(action, key),
			children: "×"
		})] }, key)), editingAction === action ?  (0, react_jsx_runtime.jsx)(KeyBadge, {
			css: { background: "#ffffcc" },
			children: strings.pressKey
		}) :  (0, react_jsx_runtime.jsx)(AddButton, {
			onClick: () => setEditingAction(action),
			children: "+"
		})] }),
		 (0, react_jsx_runtime.jsx)(ResetActionButton, {
			onClick: () => resetAction(action),
			children: "↺"
		})
	] }, action)) }),  (0, react_jsx_runtime.jsx)(ResetAllButton, {
		onClick: resetAll,
		children: strings.resetToDefault
	})] });
}
const Container$1 = styled("div", {
	display: "flex",
	flexDirection: "column",
	gap: "1em"
});
const ActionList = styled("div", {
	display: "flex",
	flexDirection: "column",
	gap: "0.5em"
});
const ActionRow = styled("div", {
	display: "flex",
	alignItems: "center",
	gap: "0.5em",
	padding: "0.3em 0",
	borderBottom: "1px solid #eee"
});
const ActionName = styled("span", {
	flex: "0 0 40%",
	fontSize: "0.9em"
});
const KeysContainer = styled("div", {
	flex: 1,
	display: "flex",
	flexWrap: "wrap",
	gap: "0.3em",
	alignItems: "center"
});
const KeyBadge = styled("span", {
	display: "inline-flex",
	alignItems: "center",
	gap: "0.2em",
	padding: "0.2em 0.4em",
	background: "#f0f0f0",
	border: "1px solid #ccc",
	borderRadius: "0.3em",
	fontSize: "0.85em",
	"& kbd": { fontFamily: "inherit" }
});
const RemoveButton = styled("button", {
	padding: 0,
	width: "1.2em",
	height: "1.2em",
	background: "none",
	border: "none",
	borderRadius: "50%",
	color: "#888",
	cursor: "pointer",
	fontSize: "1em",
	lineHeight: 1,
	"&:hover": {
		background: "#ffcccc",
		color: "#cc0000"
	}
});
const AddButton = styled("button", {
	padding: "0.2em 0.5em",
	background: "none",
	border: "1px dashed #888",
	borderRadius: "0.3em",
	color: "#888",
	cursor: "pointer",
	fontSize: "0.85em",
	"&:hover": {
		background: "#e8f5e9",
		borderColor: "#4caf50",
		color: "#4caf50"
	}
});
const ResetActionButton = styled("button", {
	padding: "0.2em 0.4em",
	background: "none",
	border: "none",
	color: "#888",
	cursor: "pointer",
	fontSize: "1em",
	"&:hover": { color: "#333" }
});
const ResetAllButton = styled("button", {
	padding: "0.4em 0.8em",
	alignSelf: "flex-start",
	background: "none",
	border: "1px solid #f44336",
	borderRadius: "0.3em",
	color: "#f44336",
	cursor: "pointer",
	fontSize: "0.9em",
	"&:hover": { background: "#ffebee" }
});
function SettingsTab() {
	const [maxZoomOutExponent, setMaxZoomOutExponent] = (0, jotai.useAtom)(maxZoomOutExponentAtom);
	const [maxZoomInExponent, setMaxZoomInExponent] = (0, jotai.useAtom)(maxZoomInExponentAtom);
	const [singlePageCount$2, setSinglePageCount] = (0, jotai.useAtom)(singlePageCountAtom);
	const [backgroundColor$2, setBackgroundColor] = (0, jotai.useAtom)(backgroundColorAtom);
	const [pageDirection, setPageDirection] = (0, jotai.useAtom)(pageDirectionAtom);
	const [isFullscreenPreferred, setIsFullscreenPreferred] = (0, jotai.useAtom)(isFullscreenPreferredSettingsAtom);
	const zoomOutExponentInputId = (0, react.useId)();
	const zoomInExponentInputId = (0, react.useId)();
	const singlePageCountInputId = (0, react.useId)();
	const colorInputId = (0, react.useId)();
	const pageDirectionInputId = (0, react.useId)();
	const fullscreenInputId = (0, react.useId)();
	const strings = (0, jotai.useAtomValue)(i18nAtom);
	const [isResetConfirming, setResetConfirming] = (0, react.useState)(false);
	const maxZoomOut$2 = formatMultiplier(maxZoomOutExponent);
	const maxZoomIn$2 = formatMultiplier(maxZoomInExponent);
	function tryReset() {
		if (!isResetConfirming) {
			setResetConfirming(true);
			return;
		}
		setMaxZoomInExponent(jotai_utils.RESET);
		setMaxZoomOutExponent(jotai_utils.RESET);
		setSinglePageCount(jotai_utils.RESET);
		setBackgroundColor(jotai_utils.RESET);
		setPageDirection(jotai_utils.RESET);
		setIsFullscreenPreferred(jotai_utils.RESET);
		setResetConfirming(false);
	}
	return  (0, react_jsx_runtime.jsxs)(ConfigSheet, { children: [
		 (0, react_jsx_runtime.jsxs)(ConfigRow, { children: [ (0, react_jsx_runtime.jsxs)(ConfigLabel, {
			htmlFor: zoomOutExponentInputId,
			children: [
				strings.maxZoomOut,
				": ",
				maxZoomOut$2
			]
		}),  (0, react_jsx_runtime.jsx)("input", {
			type: "number",
			min: 0,
			step: .1,
			id: zoomOutExponentInputId,
			value: maxZoomOutExponent,
			onChange: (event) => {
				setMaxZoomOutExponent(event.currentTarget.valueAsNumber || 0);
			}
		})] }),
		 (0, react_jsx_runtime.jsxs)(ConfigRow, { children: [ (0, react_jsx_runtime.jsxs)(ConfigLabel, {
			htmlFor: zoomInExponentInputId,
			children: [
				strings.maxZoomIn,
				": ",
				maxZoomIn$2
			]
		}),  (0, react_jsx_runtime.jsx)("input", {
			type: "number",
			min: 0,
			step: .1,
			id: zoomInExponentInputId,
			value: maxZoomInExponent,
			onChange: (event) => {
				setMaxZoomInExponent(event.currentTarget.valueAsNumber || 0);
			}
		})] }),
		 (0, react_jsx_runtime.jsxs)(ConfigRow, { children: [ (0, react_jsx_runtime.jsx)(ConfigLabel, {
			htmlFor: singlePageCountInputId,
			children: strings.singlePageCount
		}),  (0, react_jsx_runtime.jsx)("input", {
			type: "number",
			min: 0,
			step: 1,
			id: singlePageCountInputId,
			value: singlePageCount$2,
			onChange: (event) => {
				setSinglePageCount(event.currentTarget.valueAsNumber || 0);
			}
		})] }),
		 (0, react_jsx_runtime.jsxs)(ConfigRow, { children: [ (0, react_jsx_runtime.jsx)(ConfigLabel, {
			htmlFor: colorInputId,
			children: strings.backgroundColor
		}),  (0, react_jsx_runtime.jsx)(ColorInput, {
			type: "color",
			id: colorInputId,
			value: backgroundColor$2,
			onChange: (event) => {
				setBackgroundColor(event.currentTarget.value);
			}
		})] }),
		 (0, react_jsx_runtime.jsxs)(ConfigRow, { children: [ (0, react_jsx_runtime.jsx)("p", { children: strings.useFullScreen }),  (0, react_jsx_runtime.jsxs)(Toggle, { children: [ (0, react_jsx_runtime.jsx)(HiddenInput, {
			type: "checkbox",
			id: fullscreenInputId,
			checked: isFullscreenPreferred,
			onChange: (event) => {
				setIsFullscreenPreferred(event.currentTarget.checked);
			}
		}),  (0, react_jsx_runtime.jsx)("label", {
			htmlFor: fullscreenInputId,
			children: strings.useFullScreen
		})] })] }),
		 (0, react_jsx_runtime.jsxs)(ConfigRow, { children: [ (0, react_jsx_runtime.jsx)("p", { children: strings.leftToRight }),  (0, react_jsx_runtime.jsxs)(Toggle, { children: [ (0, react_jsx_runtime.jsx)(HiddenInput, {
			type: "checkbox",
			id: pageDirectionInputId,
			checked: pageDirection === "leftToRight",
			onChange: (event) => {
				setPageDirection(event.currentTarget.checked ? "leftToRight" : "rightToLeft");
			}
		}),  (0, react_jsx_runtime.jsx)("label", {
			htmlFor: pageDirectionInputId,
			children: strings.leftToRight
		})] })] }),
		 (0, react_jsx_runtime.jsx)(ResetButton, {
			onClick: tryReset,
			children: isResetConfirming ? strings.doYouReallyWantToReset : strings.reset
		})
	] });
}
function formatMultiplier(maxZoomOutExponent) {
	return Math.sqrt(2) ** maxZoomOutExponent === Infinity ? "∞" : `${(Math.sqrt(2) ** maxZoomOutExponent).toPrecision(2)}x`;
}
const ConfigLabel = styled("label", { margin: 0 });
const ResetButton = styled("button", {
	padding: "0.2em 0.5em",
	background: "none",
	border: "red 1px solid",
	borderRadius: "0.2em",
	color: "red",
	cursor: "pointer",
	transition: "0.3s",
	"&:hover": { background: "#ffe0e0" }
});
const ColorInput = styled("input", { height: "1.5em" });
const ConfigRow = styled("div", {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: "10%",
	"&& > *": {
		fontSize: "1em",
		fontWeight: "medium",
		minWidth: 0
	},
	"& > input": {
		appearance: "meter",
		border: "gray 1px solid",
		borderRadius: "0.2em",
		textAlign: "center"
	},
	":first-child": { flex: "2 1 0" },
	":nth-child(2)": { flex: "1 1 0" }
});
const HiddenInput = styled("input", {
	opacity: 0,
	width: 0,
	height: 0
});
const Toggle = styled("span", {
	"--width": "60px",
	"label": {
		position: "relative",
		display: "inline-flex",
		margin: 0,
		width: "var(--width)",
		height: "calc(var(--width) / 2)",
		borderRadius: "calc(var(--width) / 2)",
		cursor: "pointer",
		textIndent: "-9999px",
		background: "grey"
	},
	"label:after": {
		position: "absolute",
		top: "calc(var(--width) * 0.025)",
		left: "calc(var(--width) * 0.025)",
		width: "calc(var(--width) * 0.45)",
		height: "calc(var(--width) * 0.45)",
		borderRadius: "calc(var(--width) * 0.45)",
		content: "",
		background: "#fff",
		transition: "0.3s"
	},
	"input:checked + label": { background: "#bada55" },
	"input:checked + label:after": {
		left: "calc(var(--width) * 0.975)",
		transform: "translateX(-100%)"
	},
	"label:active:after": { width: "calc(var(--width) * 0.65)" }
});
const ConfigSheet = styled("div", {
	display: "flex",
	flexFlow: "column nowrap",
	alignItems: "stretch",
	gap: "0.8em"
});
function ViewerDialog({ onClose }) {
	const strings = (0, jotai.useAtomValue)(i18nAtom);
	return  (0, react_jsx_runtime.jsx)(BackdropDialog, {
		onClose,
		children:  (0, react_jsx_runtime.jsxs)(__headlessui_react.TabGroup, { children: [ (0, react_jsx_runtime.jsxs)(__headlessui_react.TabList, {
			as: StyledTabList,
			children: [ (0, react_jsx_runtime.jsx)(__headlessui_react.Tab, {
				as: PlainTab,
				children: strings.settings
			}),  (0, react_jsx_runtime.jsx)(__headlessui_react.Tab, {
				as: PlainTab,
				children: strings.keyBindings
			})]
		}),  (0, react_jsx_runtime.jsxs)(__headlessui_react.TabPanels, {
			as: StyledTabPanels,
			children: [ (0, react_jsx_runtime.jsx)(__headlessui_react.TabPanel, { children:  (0, react_jsx_runtime.jsx)(SettingsTab, {}) }),  (0, react_jsx_runtime.jsx)(__headlessui_react.TabPanel, { children:  (0, react_jsx_runtime.jsx)(KeyBindingsTab, {}) })]
		})] })
	});
}
const PlainTab = styled("button", {
	flex: 1,
	padding: "0.5em 1em",
	background: "transparent",
	border: "none",
	borderRadius: "0.5em",
	color: "#888",
	cursor: "pointer",
	fontSize: "1.2em",
	fontWeight: "bold",
	textAlign: "center",
	"&[data-headlessui-state=\"selected\"]": {
		border: "1px solid black",
		color: "black"
	},
	"&:hover": { color: "black" }
});
const StyledTabList = styled("div", {
	display: "flex",
	flexFlow: "row nowrap",
	gap: "0.5em"
});
const StyledTabPanels = styled("div", { marginTop: "1em" });
const LeftBottomFloat = styled("div", {
	position: "absolute",
	bottom: "1%",
	left: "1%",
	display: "flex",
	flexFlow: "column"
});
const MenuActions = styled("div", {
	display: "flex",
	flexFlow: "column nowrap",
	alignItems: "center",
	gap: "16px"
});
function LeftBottomControl() {
	const downloadAndSave = (0, jotai.useSetAtom)(downloadAndSaveAtom);
	const [isOpen, setIsOpen] = (0, react.useState)(false);
	const scrollable = (0, jotai.useAtomValue)(scrollElementAtom);
	const closeDialog = () => {
		setIsOpen(false);
		scrollable?.focus();
	};
	return  (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [ (0, react_jsx_runtime.jsx)(LeftBottomFloat, { children:  (0, react_jsx_runtime.jsxs)(MenuActions, { children: [ (0, react_jsx_runtime.jsx)(SettingsButton, { onClick: () => setIsOpen((value) => !value) }),  (0, react_jsx_runtime.jsx)(DownloadButton, { onClick: () => downloadAndSave() })] }) }), isOpen &&  (0, react_jsx_runtime.jsx)(ViewerDialog, { onClose: closeDialog })] });
}
const SpinnerContainer = styled("div", {
	position: "absolute",
	left: "0",
	top: "0",
	right: "0",
	bottom: "0",
	margin: "auto",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	div: {
		display: "inline-block",
		width: "16px",
		margin: "0 4px",
		background: "#fff",
		animation: `${keyframes({
			"0%": {
				top: "8px",
				height: "64px"
			},
			"50%": {
				top: "24px",
				height: "32px"
			},
			"100%": {
				top: "24px",
				height: "32px"
			}
		})} 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite`
	},
	"div:nth-child(1)": { "animation-delay": "-0.24s" },
	"div:nth-child(2)": { "animation-delay": "-0.12s" },
	"div:nth-child(3)": { "animation-delay": "0" }
});
const Spinner = () =>  (0, react_jsx_runtime.jsxs)(SpinnerContainer, { children: [
	 (0, react_jsx_runtime.jsx)("div", {}),
	 (0, react_jsx_runtime.jsx)("div", {}),
	 (0, react_jsx_runtime.jsx)("div", {})
] });
const Overlay = styled("div", {
	position: "relative",
	maxWidth: "100%",
	height: "100vh",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	"@media print": { margin: 0 },
	variants: { fullWidth: { true: { width: "100%" } } }
});
const LinkColumn = styled("div", {
	display: "flex",
	flexFlow: "column nowrap",
	alignItems: "center",
	justifyContent: "center",
	cursor: "pointer",
	boxShadow: "1px 1px 3px",
	padding: "1rem 1.5rem",
	transition: "box-shadow 1s easeOutExpo",
	lineBreak: "anywhere",
	"&:hover": { boxShadow: "2px 2px 5px" },
	"&:active": { boxShadow: "0 0 2px" }
});
const Image$1 = styled("img", {
	position: "relative",
	height: "100%",
	maxWidth: "100%",
	objectFit: "contain",
	variants: { originalSize: { true: { height: "auto" } } }
});
const Video = styled("video", {
	position: "relative",
	height: "100%",
	maxWidth: "100%",
	objectFit: "contain",
	variants: { originalSize: { true: { height: "auto" } } }
});
const Page = ({ atom: atom$3, ...props }) => {
	const { imageProps, videoProps, fullWidth, reloadAtom, shouldBeOriginalSize, divCss, state: pageState, setDiv } = (0, jotai.useAtomValue)(atom$3);
	const strings = (0, jotai.useAtomValue)(i18nAtom);
	const reload = (0, jotai.useSetAtom)(reloadAtom);
	const { status } = pageState;
	const reloadErrored = async (event) => {
		event.stopPropagation();
		await reload("load");
	};
	return  (0, react_jsx_runtime.jsxs)(Overlay, {
		ref: setDiv,
		css: divCss,
		fullWidth,
		children: [
			status === "loading" &&  (0, react_jsx_runtime.jsx)(Spinner, {}),
			status === "error" &&  (0, react_jsx_runtime.jsxs)(LinkColumn, {
				onClick: reloadErrored,
				children: [
					 (0, react_jsx_runtime.jsx)(CircledX, {}),
					 (0, react_jsx_runtime.jsx)("p", { children: strings.failedToLoadImage }),
					 (0, react_jsx_runtime.jsx)("p", { children: pageState.urls?.join("\n") })
				]
			}),
			videoProps &&  (0, react_jsx_runtime.jsx)(Video, {
				...videoProps,
				originalSize: shouldBeOriginalSize,
				...props
			}),
			imageProps &&  (0, react_jsx_runtime.jsx)(Image$1, {
				...imageProps,
				originalSize: shouldBeOriginalSize,
				...props
			})
		]
	});
};
function useHorizontalSwipe({ element, onPrevious, onNext }) {
	const [swipeRatio, setSwipeRatio] = (0, react.useState)(0);
	(0, react.useEffect)(() => {
		if (!element || !onPrevious && !onNext) return;
		let lastX = null;
		let lastRatio = 0;
		let startTouch = null;
		const addTouchIfClean = (event) => {
			const newTouch = event.touches[0];
			if (startTouch !== null || !newTouch) return;
			startTouch = {
				identifier: newTouch.identifier,
				x: newTouch.clientX,
				y: newTouch.clientY,
				scrollTop: element.scrollTop
			};
			lastX = newTouch.clientX;
		};
		const throttledSetSwipeRatio = throttle(setSwipeRatio, 1e3 / 60);
		const updateSwipeRatio = (event) => {
			const continuedTouch = [...event.changedTouches].find((touch) => touch.identifier === startTouch?.identifier);
			if (!continuedTouch || !startTouch || !lastX) return;
			if (element.scrollTop !== startTouch.scrollTop) {
				resetTouch();
				return;
			}
			const ratioDelta = (continuedTouch.clientX - lastX) / 200;
			lastRatio = Math.max(-1, Math.min(lastRatio + ratioDelta, 1));
			throttledSetSwipeRatio(lastRatio);
			lastX = continuedTouch.clientX;
			if (Math.abs(continuedTouch.clientX - startTouch.x) > Math.abs(continuedTouch.clientY - startTouch.y)) event.preventDefault();
		};
		const resetSwipeRatioIfReleased = (event) => {
			if ([...event.touches].find((touch) => touch.identifier === startTouch?.identifier)) return;
			if (Math.abs(lastRatio) < .7) {
				resetTouch();
				return;
			}
			if (lastRatio > 0) onPrevious?.();
			else onNext?.();
			resetTouch();
		};
		function resetTouch() {
			startTouch = null;
			lastX = null;
			lastRatio = 0;
			throttledSetSwipeRatio(0);
			throttledSetSwipeRatio.flush();
		}
		element.addEventListener("touchend", resetSwipeRatioIfReleased);
		element.addEventListener("touchcancel", resetSwipeRatioIfReleased);
		element.addEventListener("touchmove", updateSwipeRatio, { passive: false });
		element.addEventListener("touchstart", addTouchIfClean, { passive: true });
		return () => {
			element.removeEventListener("touchstart", addTouchIfClean);
			element.removeEventListener("touchmove", updateSwipeRatio);
			element.removeEventListener("touchcancel", resetSwipeRatioIfReleased);
			element.removeEventListener("touchend", resetSwipeRatioIfReleased);
		};
	}, [element]);
	return swipeRatio;
}
const sideButtonCss = {
	position: "absolute",
	top: 0,
	bottom: "60px",
	width: "10%",
	height: "100%",
	border: "none",
	backgroundColor: "transparent",
	"& > *": { transition: "transform 0.2s ease-in-out" },
	variants: { touchDevice: { true: {
		transition: "unset",
		pointerEvents: "none"
	} } }
};
const LeftSideHiddenButton = styled("button", {
	...sideButtonCss,
	left: 0,
	"&:not(:hover) > *": { transform: "translateX(-60%)" },
	"&:hover > *, &:focus > *, &:focus-visible > *": { transform: "translateX(-20%)" }
});
const RightSideHiddenButton = styled("button", {
	...sideButtonCss,
	right: 0,
	"&:not(:hover) > *": { transform: "translateX(+60%)" },
	"&:hover > *, &:focus > *, &:focus-visible > *": { transform: "translateX(+20%)" }
});
const FlexCenter = styled("div", {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	width: "100%",
	height: "100%"
});
function SideSeriesButtons() {
	const { onNextSeries, onPreviousSeries } = (0, jotai.useAtomValue)(viewerOptionsAtom);
	const scrollElement = (0, jotai.useAtomValue)(scrollElementAtom);
	const swipeRatio = useHorizontalSwipe({
		element: scrollElement,
		onPrevious: onPreviousSeries,
		onNext: onNextSeries
	});
	const isTouchDevice = navigator.maxTouchPoints > 0;
	function forwardWheelEvent(event) {
		scrollElement?.scrollBy({ top: event.deltaY });
	}
	return  (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [onPreviousSeries &&  (0, react_jsx_runtime.jsx)(LeftSideHiddenButton, {
		onClick: onPreviousSeries,
		onWheel: forwardWheelEvent,
		touchDevice: isTouchDevice,
		children:  (0, react_jsx_runtime.jsx)(FlexCenter, {
			style: swipeRatio <= 0 ? {} : { transform: `translateX(${swipeRatio * 40 - 60}%)` },
			children:  (0, react_jsx_runtime.jsx)(LeftArrow, {
				height: "3vmin",
				width: "3vmin"
			})
		})
	}), onNextSeries &&  (0, react_jsx_runtime.jsx)(RightSideHiddenButton, {
		onClick: onNextSeries,
		onWheel: forwardWheelEvent,
		touchDevice: isTouchDevice,
		children:  (0, react_jsx_runtime.jsx)(FlexCenter, {
			style: swipeRatio >= 0 ? {} : { transform: `translateX(${swipeRatio * 40 + 60}%)` },
			children:  (0, react_jsx_runtime.jsx)(RightArrow, {
				height: "3vmin",
				width: "3vmin"
			})
		})
	})] });
}
const Pages = styled("div", {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	flexFlow: "row-reverse wrap",
	overflowY: "auto",
	variants: { ltr: { true: { flexFlow: "row wrap" } } }
});
const CenterText = styled("p", {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	fontSize: "2em"
});
function InnerViewer(props) {
	const { options, onInitialized, ...otherProps } = props;
	const isFullscreen = (0, jotai.useAtomValue)(viewerFullscreenAtom);
	const backgroundColor$2 = (0, jotai.useAtomValue)(backgroundColorAtom);
	const status = (0, jotai.useAtomValue)(viewerStatusAtom);
	const viewerOptions = (0, jotai.useAtomValue)(viewerOptionsAtom);
	const pageDirection = (0, jotai.useAtomValue)(pageDirectionAtom);
	const strings = (0, jotai.useAtomValue)(i18nAtom);
	const mode = (0, jotai.useAtomValue)(viewerModeAtom);
	const controller = (0, jotai.useAtomValue)(controllerAtom);
	const virtualContainerRef = (0, react.useRef)(null);
	const virtualContainer = virtualContainerRef.current;
	const setScrollElement = (0, jotai.useSetAtom)(setScrollElementAtom);
	const setViewerOptions = (0, jotai.useSetAtom)(setViewerOptionsAtom);
	const pageAtoms = (0, jotai.useAtomValue)(pageAtomsAtom);
	const [initialize$1] = (0, overlayscrollbars_react.useOverlayScrollbars)({
		defer: true,
		events: {
			scroll: (0, jotai.useSetAtom)(synchronizeScrollAtom),
			initialized: setupScroll
		}
	});
	(0, jotai.useAtomValue)(fullscreenSynchronizationAtom);
	useBeforeRepaint();
	async function setupScroll() {
		await setScrollElement(virtualContainerRef.current?.querySelector("div[data-overlayscrollbars-viewport]"));
	}
	(0, react.useEffect)(() => {
		if (controller) onInitialized?.(controller);
	}, [controller, onInitialized]);
	(0, react.useEffect)(() => {
		setViewerOptions(options);
	}, [options]);
	(0, react.useEffect)(() => {
		if (virtualContainer) initialize$1(virtualContainer);
	}, [initialize$1, virtualContainer]);
	return  (0, react_jsx_runtime.jsxs)(Container, {
		ref: (0, jotai.useSetAtom)(setViewerElementAtom),
		css: { backgroundColor: backgroundColor$2 },
		immersive: mode === "window",
		children: [
			 (0, react_jsx_runtime.jsx)(OverlayScroller, {
				tabIndex: 0,
				ref: virtualContainerRef,
				fullscreen: isFullscreen,
				onClick: (0, jotai.useSetAtom)(navigateAtom),
				onMouseDown: (0, jotai.useSetAtom)(blockSelectionAtom),
				...otherProps,
				children:  (0, react_jsx_runtime.jsx)(Pages, {
					ltr: pageDirection === "leftToRight",
					children: pageAtoms.map((atom$3) =>  (0, react_jsx_runtime.jsx)(Page, {
						atom: atom$3,
						...viewerOptions.mediaProps
					}, `${atom$3}`))
				})
			}),
			 (0, react_jsx_runtime.jsx)(SideSeriesButtons, {}),
			status === "loading" &&  (0, react_jsx_runtime.jsx)(CenterText, { children: strings.loading }),
			status === "error" &&  (0, react_jsx_runtime.jsx)(CenterText, { children: strings.errorIsOccurred }),
			status === "complete" &&  (0, react_jsx_runtime.jsx)(LeftBottomControl, {}),
			 (0, react_jsx_runtime.jsx)(FullscreenButton, { onClick: (0, jotai.useSetAtom)(toggleImmersiveAtom) }),
			 (0, react_jsx_runtime.jsx)(react_toastify.ToastContainer, {})
		]
	});
}
function initialize(options) {
	const store = (0, jotai.createStore)();
	const root = (0, react_dom_client.createRoot)(getDefaultRoot());
	store.set(rootAtom, root);
	return new Promise((resolve) => root.render( (0, react_jsx_runtime.jsx)(jotai.Provider, {
		store,
		children:  (0, react_jsx_runtime.jsx)(InnerViewer, {
			options,
			onInitialized: resolve
		})
	})));
}
const Viewer = (0, react.forwardRef)(({ options, onInitialized }) => {
	return  (0, react_jsx_runtime.jsx)(jotai.Provider, {
		store: (0, react.useMemo)(jotai.createStore, []),
		children:  (0, react_jsx_runtime.jsx)(InnerViewer, {
			options,
			onInitialized
		})
	});
});
function getDefaultRoot() {
	const div = document.createElement("div");
	div.setAttribute("style", "width: 0; height: 0; z-index: 9999999; position: fixed;");
	document.body.append(div);
	return div;
}
exports.Viewer = Viewer;
exports.download = download;
exports.initialize = initialize;
Object.defineProperty(exports, 'utils', {
  enumerable: true,
  get: function () {
    return utils_exports;
  }
});
