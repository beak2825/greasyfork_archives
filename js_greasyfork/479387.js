// ==UserScript==
// @name Bilibili Black Deque
// @version 0.0.6
// @namespace http://tampermonkey.net/
// @description Make blacklist of bilibili a deque
// @author Zxilly
// @source https://github.com/Zxilly/bili-black-deque
// @license https://opensource.org/licenses/MIT
// @match *://www.bilibili.com/*
// @require https://cdn.jsdelivr.net/npm/axios@1.7.3
// @downloadURL https://update.greasyfork.org/scripts/479387/Bilibili%20Black%20Deque.user.js
// @updateURL https://update.greasyfork.org/scripts/479387/Bilibili%20Black%20Deque.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 242:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBlackListCnt = getBlackListCnt;
const axios_1 = __importDefault(__webpack_require__(719));
function getBlackListCnt() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = (yield axios_1.default.get('https://api.bilibili.com/x/relation/blacks', {
            withCredentials: true
        })).data;
        return result.data.total;
    });
}


/***/ }),

/***/ 449:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const pop_1 = __webpack_require__(74);
const count_1 = __webpack_require__(242);
function manualRemove() {
    return __awaiter(this, void 0, void 0, function* () {
        let total = yield (0, count_1.getBlackListCnt)();
        const uin = window.prompt(`现在黑名单有 ${total} 人，想移除：`);
        if (uin === null) {
            alert("必须输入一个整数");
            return;
        }
        const deleteNum = Number.parseInt(uin);
        if (Number.isNaN(deleteNum)) {
            alert(`${uin} 不能被解释为合法整数`);
            return;
        }
        if (deleteNum <= 0) {
            alert("数字必须大于 0");
        }
        if (total < deleteNum) {
            alert(`当前黑名单中的人数 ${total} 少于 ${deleteNum}`);
            return;
        }
        yield (0, pop_1.popBlack)(deleteNum, total);
        const current = yield (0, count_1.getBlackListCnt)();
        alert(`处理完成，当前黑名单有 ${current} 人`);
    });
}
function configureAndSet() {
    return __awaiter(this, void 0, void 0, function* () {
        let total = yield (0, count_1.getBlackListCnt)();
        const uin = window.prompt(`当前黑名单有 ${total} 人，想保持在：`);
        if (uin === null) {
            alert("必须输入一个整数");
            return;
        }
        const target = Number.parseInt(uin);
        if (Number.isNaN(target)) {
            alert(`${uin} 不能被解释为合法整数`);
            return;
        }
        if (target <= 0) {
            alert("数字必须大于 0");
        }
        if (target > total) {
            console.warn(`当前黑名单中的人数 ${total} 少于 ${target}`);
        }
        localStorage.setItem(KEEP_TARGET, target.toString());
        localStorage.removeItem(LAST_TASK_DATE);
        yield task();
    });
}
function task() {
    return __awaiter(this, void 0, void 0, function* () {
        const keepTarget = localStorage.getItem(KEEP_TARGET);
        if (keepTarget === null) {
            return;
        }
        const target = Number.parseInt(keepTarget);
        if (Number.isNaN(target)) {
            console.error(`target ${keepTarget} is not a number`);
            return;
        }
        const lastTaskDate = localStorage.getItem(LAST_TASK_DATE);
        const today = new Date().toDateString();
        if (lastTaskDate === today) {
            return;
        }
        let total = yield (0, count_1.getBlackListCnt)();
        if (total > target) {
            yield (0, pop_1.popBlack)(total - target, total);
        }
        localStorage.setItem(LAST_TASK_DATE, today);
    });
}
document.addEventListener("keydown", (ev) => __awaiter(void 0, void 0, void 0, function* () {
    if (ev.altKey && ev.key === "b") {
        yield manualRemove();
    }
    if (ev.altKey && ev.key === "c") {
        yield configureAndSet();
    }
}));
const KEEP_TARGET = "keep-target";
const LAST_TASK_DATE = "last-task-date";
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.info("alt + b to run");
    console.info("alt + c to set target");
    yield task();
}))();


/***/ }),

/***/ 74:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.popBlack = popBlack;
const axios_1 = __importDefault(__webpack_require__(719));
const csrf_token = document.cookie.split('; ').find(row => row.startsWith('bili_jct')).split('=')[1];
function popBlack(num, total) {
    return __awaiter(this, void 0, void 0, function* () {
        const last_page = Math.ceil(total / 50);
        const toRemove = [];
        for (let current_page = last_page; current_page > 0; current_page--) {
            const resp = (yield axios_1.default.get('https://api.bilibili.com/x/relation/blacks', {
                params: {
                    ps: 20,
                    pn: current_page
                },
                withCredentials: true
            })).data;
            const list = resp.data.list;
            list.reverse();
            for (const user of list) {
                const id = user['mid'];
                toRemove.push(id);
                if (toRemove.length >= num) {
                    break;
                }
            }
            if (toRemove.length >= num) {
                break;
            }
        }
        console.log(JSON.stringify(toRemove));
        console.log("收集完成，准备解除");
        console.groupCollapsed("解除请求细节");
        for (let id of toRemove) {
            const params = new URLSearchParams();
            params.append("fid", id);
            params.append("csrf", csrf_token);
            params.append("act", "6");
            params.append("re_src", "116");
            let retries = 3;
            while (retries > 0) {
                const resp = (yield axios_1.default.post("https://api.bilibili.com/x/relation/modify", params, {
                    withCredentials: true
                })).data;
                console.debug(JSON.stringify(resp));
                if (resp.code === 0) {
                    break;
                }
                retries--;
                console.log("限流中，等待2秒");
                yield new Promise(r => setTimeout(r, 2000));
            }
        }
        console.groupEnd();
    });
}


/***/ }),

/***/ 719:
/***/ ((module) => {

module.exports = axios;

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
/******/ 	var __webpack_exports__ = __webpack_require__(449);
/******/ 	
/******/ })()
;