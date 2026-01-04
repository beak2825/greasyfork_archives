// ==UserScript==
// @name Download github repo sub-folder
// @name:zh-CN 在线下载Github仓库文件夹
// @description download github sub-folder via one click, copy the single file's source code easily
// @description:zh-CN 无需克隆GitHub仓库, 一键在线下载 Github仓库子文件夹; 同时还能在源码详情页一键复制源码
// @version 0.7.2
// @author Saiya
// @supportURL https://github.com/oe/download-git-userscript/issues
// @match https://github.com/*
// @match https://gist.github.com/*
// @connect cdn.jsdelivr.net
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @homepageURL https://github.com/oe/download-git-userscript
// @icon https://github.githubassets.com/pinned-octocat.svg
// @namespace https://app.evecalm.com
// @noframes 
// @downloadURL https://update.greasyfork.org/scripts/411834/Download%20github%20repo%20sub-folder.user.js
// @updateURL https://update.greasyfork.org/scripts/411834/Download%20github%20repo%20sub-folder.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 607:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils = __importStar(__webpack_require__(593));
(function () {
    const DOWNLOAD_BTN_ID = 'xiu-download-btn';
    const STYLE_ELEMENT_ID = 'xiu-style-element';
    let tid = 0;
    main();
    // observe body change
    const observer = new MutationObserver(onBodyChanged);
    observer.observe(document, { subtree: true, childList: true });
    function main() {
        if (!utils.isRepo())
            return;
        addDownloadBtn();
        addDownload2FileList();
    }
    function onBodyChanged() {
        // debounce, avoid frequent call
        clearTimeout(tid);
        // @ts-ignore
        tid = setTimeout(main, 100);
    }
    function addDownloadBtn() {
        let $navi = utils.isRepoRootDir() && document.querySelector('#branch-picker-repos-header-ref-selector');
        if ($navi) {
            $navi = $navi.parentElement.parentElement.nextElementSibling;
        }
        else {
            $navi = document.querySelector('#StickyHeader .js-github-dev-new-tab-shortcut');
            if (!$navi) {
                $navi = document.querySelector('[data-testid="tree-overflow-menu-anchor"]');
                if (!$navi)
                    return;
            }
            $navi = $navi.parentElement;
        }
        if (!$navi)
            return;
        const downloadBtn = getDownloadBtn();
        if (!downloadBtn || $navi.contains(downloadBtn))
            return;
        $navi.appendChild(downloadBtn);
    }
    function getDownloadBtn() {
        let downloadBtn = document.getElementById(DOWNLOAD_BTN_ID);
        if (!downloadBtn) {
            downloadBtn = document.createElement('a');
            downloadBtn.id = DOWNLOAD_BTN_ID;
        }
        const isRoot = utils.isRepoRootDir();
        downloadBtn.className = `btn d-none d-md-block ${isRoot ? 'ml-0' : ''}`;
        downloadBtn.target = '_blank';
        let url = '';
        if (isRoot) {
            try {
                // @ts-ignore
                const repoInfo = JSON.parse(document.querySelector('[partial-name="repos-overview"] [data-target="react-partial.embeddedData"]').innerText);
                const zipUrl = repoInfo.props.initialPayload.overview.codeButton.local.platformInfo.zipballUrl;
                url = new URL(zipUrl, location.href).href;
            }
            catch (error) {
                console.warn('unable to get zip url', error);
                return;
            }
        }
        else {
            url = utils.getGithubDownloadUrl(utils.getCurrentUrlPath());
        }
        downloadBtn.textContent = 'Download';
        downloadBtn.href = url;
        return downloadBtn;
    }
    function addDownload2FileList() {
        if (document.getElementById(STYLE_ELEMENT_ID))
            return;
        const style = document.createElement('style');
        style.id = STYLE_ELEMENT_ID;
        const styleContent = `
    .react-directory-filename-column { position: relative; }
    .react-directory-filename-column:has(a[aria-label*="File"]):after,
    .react-directory-filename-column:has(a[aria-label*="Directory"]):after,
    .Box .Box-row > [role="gridcell"]:first-child:after {
      position: absolute;
      left: 20px;
      top: 10px;
      opacity: 0.6;
      pointer-events: none;
      content: '↓';
      font-size: 0.8em;
      z-index: 11;
    }

    .react-directory-filename-column:has(a[aria-label*="File"]):after,
    .react-directory-filename-column:has(a[aria-label*="Directory"]):after{
      left: 4px;
      top: 12px;
      color: white;
    }


    [data-color-mode="light"] .react-directory-filename-column:after {
      color: black;
    }
    @media (prefers-color-scheme: light) {
      [data-color-mode=auto][data-light-theme*=light] .react-directory-filename-column:after {
        color: black;
      }
    }

    .react-directory-filename-column:has(a[aria-label*="File"]) svg,
    .react-directory-filename-column:has(a[aria-label*="Directory"]) svg{
      cursor: pointer;
    }
    `;
        style.textContent = styleContent;
        document.head.appendChild(style);
        addEvent2FileIcon();
    }
    function addEvent2FileIcon() {
        document.documentElement.addEventListener('click', (e) => {
            var _a, _b, _c, _d, _e, _f, _g;
            // @ts-ignore
            const target = (e.target && e.target.ownerSVGElement || e.target);
            if (!target || (target.tagName || '').toLowerCase() !== 'svg')
                return;
            const label = target.getAttribute('aria-label') || '';
            let url = '';
            let isFile = false;
            if (['Directory', 'File'].includes(label)) {
                url = (_d = (_c = (_b = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.nextElementSibling) === null || _b === void 0 ? void 0 : _b.querySelector) === null || _c === void 0 ? void 0 : _c.call(_b, 'a')) === null || _d === void 0 ? void 0 : _d.href;
                isFile = label === 'File';
            }
            else if ((_e = target.parentElement) === null || _e === void 0 ? void 0 : _e.classList.contains('react-directory-filename-column')) {
                const anchor = (_g = (_f = target.nextElementSibling) === null || _f === void 0 ? void 0 : _f.querySelector) === null || _g === void 0 ? void 0 : _g.call(_f, 'a');
                if (!anchor)
                    return;
                const label = anchor.getAttribute('aria-label') || '';
                if (!label.includes('Directory') && !label.includes('File'))
                    return;
                url = anchor.href;
                console.warn("url", url);
                isFile = target.classList.contains('color-fg-muted');
            }
            else {
                return;
            }
            if (!url)
                return;
            utils.openLink(utils.getGithubDownloadUrl(url, isFile));
        }, {
            capture: true,
            passive: true,
        });
    }
})();


/***/ }),

/***/ 593:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getGithubDownloadUrl = exports.openLink = exports.getCurrentUrlPath = exports.getRawBtn = exports.getUrlTextResponse = exports.isTextBasedSinglePage = exports.isRepoRootDir = exports.isPrivateRepo = exports.isRepo = exports.isGist = void 0;
/**
 * is gist website
 */
function isGist() {
    return location.hostname === 'gist.github.com';
}
exports.isGist = isGist;
function isRepo() {
    if (!document.querySelector('.repository-content, #js-repo-pjax-container'))
        return false;
    const meta = document.querySelector('meta[name="selected-link"]');
    if (meta && meta.getAttribute('value') === 'repo_commits')
        return false;
    if (document.querySelector('.js-navigation-container>.TimelineItem'))
        return false;
    return true;
}
exports.isRepo = isRepo;
function isPrivateRepo() {
    const label = document.querySelector('#js-repo-pjax-container .hide-full-screen .Label');
    return label && label.textContent === 'Private';
}
exports.isPrivateRepo = isPrivateRepo;
function isRepoRootDir() {
    return !!document.querySelector('.repository-content  [partial-name="repos-overview"]');
}
exports.isRepoRootDir = isRepoRootDir;
function isTextBasedSinglePage() {
    if (!getRawBtn())
        return;
    if (document.getElementById('readme'))
        return true;
    const boxBody = document.querySelector('table.highlight');
    if (boxBody)
        return true;
    return false;
}
exports.isTextBasedSinglePage = isTextBasedSinglePage;
function getUrlTextResponse(url) {
    // https://github.com/oe/search/raw/gh-pages/app-icon-retina.f492fc13.png
    // https://cdn.jsdelivr.net/gh/oe/search@gh-pages/app-icon-retina.f492fc13.png
    // https://github.com/oe/search/raw/master/CNAME
    let apiUrl = url
        .replace('github.com/', 'cdn.jsdelivr.net/gh/')
        .replace('/raw/', '@');
    return new Promise((resolve, reject) => {
        // @ts-ignore
        GM_xmlhttpRequest({
            url: apiUrl,
            method: 'GET',
            onload: (s) => {
                resolve(s.responseText);
            }
        });
    });
}
exports.getUrlTextResponse = getUrlTextResponse;
// if is single file page, then it has a raw btn
function getRawBtn() {
    return document.getElementById('raw-url');
}
exports.getRawBtn = getRawBtn;
// remove qeurystring & hash
function getCurrentUrlPath() {
    const url = location.origin + location.pathname;
    return url.replace(/\/$/, '');
}
exports.getCurrentUrlPath = getCurrentUrlPath;
function openLink(url) {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = url;
    link.click();
}
exports.openLink = openLink;
function getGithubDownloadUrl(url, isFile) {
    if (isFile) {
        try {
            const u = new URL(url);
            let paths = u.pathname.split('/');
            paths[3] = 'raw';
            u.pathname = paths.join('/');
            return u.href;
        }
        catch (error) { }
    }
    return `https://downgit.evecalm.com/#/home?url=${encodeURIComponent(url)}`;
}
exports.getGithubDownloadUrl = getGithubDownloadUrl;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ })()
;