// ==UserScript==
// @name           아카 뷰어
// @name:ko        아카 뷰어
// @name:en        arca viewer
// @description    i,j,k 키를 눌러보세요
// @description:ko i,j,k 키를 눌러보세요
// @description:en press i to open
// @version        260103223455
// @match          https://arca.live/b/*/*
// @match          https://*.arca.live/b/*/*
// @author         nanikit
// @namespace      https://greasyfork.org/ko/users/713014-nanikit
// @license        MIT
// @connect        namu.la
// @connect        *
// @grant          GM.addValueChangeListener
// @grant          GM.getResourceText
// @grant          GM.getValue
// @grant          GM.removeValueChangeListener
// @grant          GM.setValue
// @grant          GM.xmlHttpRequest
// @grant          unsafeWindow
// @require        https://cdn.jsdelivr.net/npm/requirejs@2.3.6/require.js
// @resource       link:@headlessui/react       https://cdn.jsdelivr.net/npm/@headlessui/react@2.2.1/dist/headlessui.prod.cjs
// @resource       link:@stitches/react         https://cdn.jsdelivr.net/npm/@stitches/react@1.3.1-1/dist/index.cjs
// @resource       link:clsx                    https://cdn.jsdelivr.net/npm/clsx@2.1.1/dist/clsx.js
// @resource       link:fflate                  https://cdn.jsdelivr.net/npm/fflate@0.8.2/lib/browser.cjs
// @resource       link:jotai                   https://cdn.jsdelivr.net/npm/jotai@2.10.0/index.js
// @resource       link:jotai-cache             https://cdn.jsdelivr.net/npm/jotai-cache@0.5.0/dist/cjs/atomWithCache.js
// @resource       link:jotai/react             https://cdn.jsdelivr.net/npm/jotai@2.10.0/react.js
// @resource       link:jotai/react/utils       https://cdn.jsdelivr.net/npm/jotai@2.10.0/react/utils.js
// @resource       link:jotai/utils             https://cdn.jsdelivr.net/npm/jotai@2.10.0/utils.js
// @resource       link:jotai/vanilla           https://cdn.jsdelivr.net/npm/jotai@2.10.0/vanilla.js
// @resource       link:jotai/vanilla/utils     https://cdn.jsdelivr.net/npm/jotai@2.10.0/vanilla/utils.js
// @resource       link:overlayscrollbars       https://cdn.jsdelivr.net/npm/overlayscrollbars@2.10.0/overlayscrollbars.cjs
// @resource       link:overlayscrollbars-react https://cdn.jsdelivr.net/npm/overlayscrollbars-react@0.5.6/overlayscrollbars-react.cjs.js
// @resource       link:react                   https://cdn.jsdelivr.net/npm/react@19.0.0/cjs/react.production.js
// @resource       link:react-dom               https://cdn.jsdelivr.net/npm/react-dom@19.0.0/cjs/react-dom.production.js
// @resource       link:react-dom/client        https://cdn.jsdelivr.net/npm/react-dom@19.0.0/cjs/react-dom-client.production.js
// @resource       link:react-toastify          https://cdn.jsdelivr.net/npm/react-toastify@10.0.5/dist/react-toastify.js
// @resource       link:react/jsx-runtime       https://cdn.jsdelivr.net/npm/react@19.0.0/cjs/react-jsx-runtime.production.js
// @resource       link:scheduler               https://cdn.jsdelivr.net/npm/scheduler@0.23.2/cjs/scheduler.production.min.js
// @resource       link:vcv-inject-node-env     data:,unsafeWindow.process=%7Benv:%7BNODE_ENV:%22production%22%7D%7D
// @resource       link:vim_comic_viewer        https://update.greasyfork.org/scripts/417893/1726982/vim%20comic%20viewer.js
// @resource       overlayscrollbars-css        https://cdn.jsdelivr.net/npm/overlayscrollbars@2.10.0/styles/overlayscrollbars.min.css
// @resource       react-toastify-css           https://cdn.jsdelivr.net/npm/react-toastify@10.0.5/dist/ReactToastify.css
// @downloadURL https://update.greasyfork.org/scripts/428230/%EC%95%84%EC%B9%B4%20%EB%B7%B0%EC%96%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/428230/%EC%95%84%EC%B9%B4%20%EB%B7%B0%EC%96%B4.meta.js
// ==/UserScript==
"use strict";

define("main", (require, exports, module) => {
let vim_comic_viewer = require("vim_comic_viewer");
async function main() {
	const viewer = await (0, vim_comic_viewer.initialize)({
		source: comicSource,
		mediaProps: { loading: "lazy" }
	});
	addEventListener("keydown", (event) => {
		switch (event.key) {
			case "m":
				goToCommentIfEligible(event);
				break;
			default:
				forwardEvent(event, viewer);
				break;
		}
	}, { capture: true });
}
function forwardEvent(event, viewer) {
	if (viewer.defaultGlobalKeyHandler(event)) {
		event.stopPropagation();
		return;
	}
	if (getAncestors(event.target).includes(viewer.container)) {
		if (viewer.defaultElementKeyHandler(event)) event.stopPropagation();
	}
}
function goToCommentIfEligible(event) {
	if (isCaptureTargetEvent(event)) document.querySelector("#comment > *").scrollIntoView({ block: "center" });
}
function getAncestors(element) {
	const ancestors = [];
	let cursor = element;
	while (cursor) {
		ancestors.push(cursor);
		cursor = cursor.parentElement;
	}
	return ancestors;
}
function isCaptureTargetEvent(event) {
	const { ctrlKey, altKey, shiftKey } = event;
	return !(ctrlKey || altKey || shiftKey || vim_comic_viewer.utils.isTyping(event));
}
async function comicSource({ cause, maxSize }) {
	const isDownload = cause === "download";
	return (await searchMedia()).map(isDownload ? getOriginalLink : getAdaptiveLink);
	function getAdaptiveLink(imgOrVideo) {
		const originalImageUrl = imgOrVideo.parentElement?.href;
		const { width, height } = imgOrVideo;
		const adaptive = (() => {
			if (imgOrVideo.tagName === "IMG") return new Image();
			return document.createElement("video");
		})();
		adaptive.src = imgOrVideo.src;
		adaptive.width = width;
		adaptive.height = height;
		if (!originalImageUrl) return adaptive;
		const isGif = new URL(originalImageUrl).pathname.endsWith(".gif");
		const original = new Image();
		original.src = originalImageUrl;
		original.width = width;
		original.height = height;
		if (isGif) return original;
		const resizedWidth = 1e3;
		const resizedHeight = height * resizedWidth / width;
		const canBePoorVisual = Math.min(maxSize.width / resizedWidth, maxSize.height / resizedHeight) >= 2;
		if (canBePoorVisual && cause === "error") return adaptive;
		return canBePoorVisual ? original : adaptive;
	}
}
async function searchMedia() {
	while (true) {
		const media = [...document.querySelectorAll(".article-content img[src]:not([src='']), .article-content video[src]:not([src=''])")];
		if (media.some((x) => x.tagName === "IMG" && !x.parentElement?.href)) {
			await vim_comic_viewer.utils.timeout(100);
			continue;
		}
		return media;
	}
}
function getOriginalLink(imgOrVideo) {
	const originalImageUrl = imgOrVideo.parentElement?.href;
	if (originalImageUrl) {
		const img = new Image();
		img.src = originalImageUrl;
		return img;
	}
	const video = new HTMLVideoElement();
	video.src = imgOrVideo.src;
	return video;
}
main();


});

define("tampermonkey_grants", function() { Object.assign(this.window, { GM, unsafeWindow }); });
requirejs.config({ deps: ["tampermonkey_grants"] });
load()

async function load() {
  const links = GM.info.script.resources.filter(x => x.name.startsWith("link:"));
  await Promise.all(links.map(async ({ name }) => {
    const script = await GM.getResourceText(name)
    define(name.replace("link:", ""), Function("require", "exports", "module", script))
  }));
  require(["main"], () => {}, console.error);
}
