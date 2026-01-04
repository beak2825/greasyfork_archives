// ==UserScript==
// @name         twitter rate limit viewer
// @namespace    https://www.sapphire.sh/
// @description  display current rate limit status
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @grant        none
// @author       sapphire
// @version      1688745353703
// @downloadURL https://update.greasyfork.org/scripts/470298/twitter%20rate%20limit%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/470298/twitter%20rate%20limit%20viewer.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/twitter-rate-limit-viewer.ts":
/*!**************************************************!*\
  !*** ./src/scripts/twitter-rate-limit-viewer.ts ***!
  \**************************************************/
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const DISPLAY_ID = 'rate-limit-viewer';
const DISPLAY_POSITION_KEY = `${DISPLAY_ID}-position`;
const statusTable = {};
const handleStatus = (status) => {
    // console.log('status', status);
    statusTable[status.url] = status;
};
const FONT_FAMILY = '"TwitterChirp",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
let dragging = false;
let offsetX = 0;
let offsetY = 0;
const attachDisplay = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const el = document.createElement('div');
    el.id = DISPLAY_ID;
    const prevPosition = (_a = window.localStorage
        .getItem(DISPLAY_POSITION_KEY)) === null || _a === void 0 ? void 0 : _a.split(',');
    Object.assign(el.style, {
        position: 'fixed',
        padding: '0 8px',
        top: prevPosition ? `${prevPosition[1]}px` : '60vh',
        left: prevPosition ? `${prevPosition[0]}px` : '70vw',
        fontFamily: FONT_FAMILY,
        fontSize: 'small',
        backgroundColor: '#ffffff',
        whiteSpace: 'nowrap',
        border: '1px solid #000000',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
        visibility: 'hidden',
    });
    el.addEventListener('mousedown', (event) => {
        const rect = el.getBoundingClientRect();
        offsetX = rect.left - event.clientX;
        offsetY = rect.top - event.clientY;
        dragging = true;
    });
    window.addEventListener('mousemove', (event) => {
        if (!dragging) {
            return;
        }
        if (!(event.target instanceof HTMLElement)) {
            return;
        }
        const x = event.clientX + offsetX;
        const y = event.clientY + offsetY;
        Object.assign(el.style, {
            top: `${y}px`,
            left: `${x}px`,
        });
    });
    window.addEventListener('mouseup', (event) => {
        if (!dragging) {
            return;
        }
        dragging = false;
        if (!(event.target instanceof HTMLElement)) {
            return;
        }
        const rect = el.getBoundingClientRect();
        const x = Math.max(0, Math.min(event.clientX + offsetX, window.innerWidth - rect.width));
        const y = Math.max(0, Math.min(event.clientY + offsetY, window.innerHeight - rect.height));
        Object.assign(el.style, {
            top: `${y}px`,
            left: `${x}px`,
        });
        window.localStorage.setItem(DISPLAY_POSITION_KEY, `${x},${y}`);
    });
    document.body.appendChild(el);
    return el;
});
const TIME_UNITS = [
    { amount: 60, name: 'seconds' },
    { amount: 60, name: 'minutes' },
    { amount: 24, name: 'hours' },
    { amount: 7, name: 'days' },
    { amount: 30 / 7, name: 'weeks' },
    { amount: 12, name: 'months' },
    { amount: Infinity, name: 'years' },
];
const formatTime = (a, b) => {
    const formatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
    let diff = (a - b) / 1000;
    for (const unit of TIME_UNITS) {
        if (Math.abs(diff) < unit.amount) {
            return formatter.format(Math.round(diff), unit.name);
        }
        diff /= unit.amount;
    }
};
const getColor = (a, b) => {
    const ratio = a / b;
    if (ratio > 0.5) {
        return '#1f7f3f';
    }
    if (ratio > 0.3) {
        return '#ffbf00';
    }
    return '#ff3f3f';
};
const updateDisplay = (el) => {
    if (dragging) {
        return;
    }
    let htmlStr = '';
    const now = Date.now();
    const statuses = Object.values(statusTable).sort((a, b) => {
        const p = a.url.includes('/graphql/');
        const q = b.url.includes('/graphql/');
        if (p === q) {
            return a.url.localeCompare(b.url);
        }
        if (p) {
            return -1;
        }
        if (q) {
            return 1;
        }
        return 0;
    });
    for (const status of statuses) {
        const { url, rateLimitLimit, rateLimitRemaining, rateLimitReset, updatedAt, } = status;
        const updatedTime = formatTime(updatedAt, now);
        const resetTime = formatTime(rateLimitReset * 1000, now);
        const reset = rateLimitReset * 1000 <= now;
        const color = getColor(rateLimitRemaining, rateLimitLimit);
        htmlStr += [
            `<div style="margin: 8px 0; ${reset ? 'opacity: 0.3;' : ''}">`,
            `<p style="margin: 0;"><span style="color: ${color};">[${rateLimitRemaining} / ${rateLimitLimit}]</span> ${url}</p>`,
            `<p style="margin: 0;">updated ${updatedTime}${reset ? '' : ` / reset ${resetTime}`}</p>`,
            '</div>',
        ].join('\n');
    }
    el.innerHTML = htmlStr;
    if (htmlStr) {
        el.style.visibility = '';
    }
};
const sleep = (ms) => __awaiter(void 0, void 0, void 0, function* () { return new Promise((resolve) => setTimeout(resolve, ms)); });
const REGEX_GRAPHQL_URL = /^\/i\/api\/graphql\/(.+?)\/(.+?)$/;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const XHR = window.XMLHttpRequest;
    // @ts-ignore
    window.XMLHttpRequest = function () {
        const xhr = new XHR();
        const handleReadyStateChange = () => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (!xhr.responseURL.includes('twitter.com')) {
                return;
            }
            const getHeaderValue = (name) => {
                const value = xhr.getResponseHeader(name);
                if (!value) {
                    return;
                }
                return parseInt(value, 10);
            };
            const rateLimitLimit = getHeaderValue('x-rate-limit-limit');
            if (rateLimitLimit === undefined) {
                return;
            }
            const rateLimitRemaining = getHeaderValue('x-rate-limit-remaining');
            if (rateLimitRemaining === undefined) {
                return;
            }
            const rateLimitReset = getHeaderValue('x-rate-limit-reset');
            if (rateLimitReset === undefined) {
                return;
            }
            const getUrl = (value) => {
                const url = new URL(value);
                const match = url.pathname.match(REGEX_GRAPHQL_URL);
                if (!match) {
                    return url.pathname;
                }
                if (!match[1] || !match[2]) {
                    return url.pathname;
                }
                return `/i/api/graphql/${match[1].slice(0, 1)}…${match[1].slice(-1)}/${match[2]}`;
            };
            const url = getUrl(xhr.responseURL);
            handleStatus({
                url,
                rateLimitLimit,
                rateLimitRemaining,
                rateLimitReset,
                updatedAt: Date.now(),
            });
        };
        xhr.addEventListener('readystatechange', handleReadyStateChange, false);
        return xhr;
    };
    const getDisplay = () => __awaiter(void 0, void 0, void 0, function* () {
        const el = document.getElementById(DISPLAY_ID);
        if (el) {
            return el;
        }
        return yield attachDisplay();
    });
    while (true) {
        const displayEl = yield getDisplay();
        updateDisplay(displayEl);
        yield sleep(1000);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield main();
        console.info('please contact https://twitter.com/sapphire_dev for any questions and/or comments');
    }
    catch (error) {
        console.error(error);
    }
}))();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/scripts/twitter-rate-limit-viewer.ts"]();
/******/ 	
/******/ })()
;