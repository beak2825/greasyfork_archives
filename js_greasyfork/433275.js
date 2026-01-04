// ==UserScript==
// @name         【优聚搜】网盘自动填写密码脚本
// @namespace    https://ujuso.com
// @version      1.0.3
// @description    优聚搜自动填写密码脚本，目前支持百度网盘、蓝奏网盘、阿里云网盘提取码填写
// @author          ujuso
// 白名单
// @include			http*://*/*
// 去除
// @exclude			http*://*.ujuso.com/*
// 更新日志

// @note 			2021-10-03 第三版更新，支持阿里云密码填写
// @note 			2021-10-03 第二版更新，支持蓝奏云密码填写
// @note 			2021-10-01 第一版更新，支持百度云密码填写
// @grant           unsafeWindow
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_log
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_info
// @grant           GM_xmlhttpRequest
// @connect      *
// @icon            https://ujuso.com/favicon-32x32.png
// @antifeature tracking 从云端查询密码，发送本地缓存密码到云端，有异议请不要安装


// @downloadURL https://update.greasyfork.org/scripts/433275/%E3%80%90%E4%BC%98%E8%81%9A%E6%90%9C%E3%80%91%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%AF%86%E7%A0%81%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/433275/%E3%80%90%E4%BC%98%E8%81%9A%E6%90%9C%E3%80%91%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%AF%86%E7%A0%81%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 230:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var config_1 = __importDefault(__webpack_require__(516));
var helper_1 = __webpack_require__(910);
var inet_1 = __webpack_require__(481);
var local_1 = __webpack_require__(549);
var alyPage = function () {
    var _a = (0, helper_1.getDiskIdAndType)(config_1.default.href), diskType = _a[0], diskID = _a[1];
    var timer = null;
    timer = setInterval(function () {
        var inputEl = document.querySelector('[class*="code-input"] > input');
        var clickEl = document.querySelector('button[type="submit"]');
        var noticeEl = document.querySelector('p[class*="expired-info"]');
        if (inputEl) {
            clearInterval(timer);
            if (noticeEl)
                noticeEl.innerText = '获取密码中...';
            (0, inet_1.getPass)(diskID, diskType)
                .then(function (pass) {
                console.log('pass', pass);
                if (noticeEl)
                    noticeEl.innerText = '获取到密码';
                var lastVal = inputEl.value;
                inputEl.value = pass;
                var event = new Event('input', { bubbles: true });
                //@ts-ignore
                event.simulated = true;
                //@ts-ignore
                var tracker = inputEl._valueTracker;
                if (tracker) {
                    tracker.setValue(lastVal);
                }
                inputEl.dispatchEvent(event);
                clickEl.click();
            })
                .catch(function () {
                if (noticeEl)
                    noticeEl.innerText = '抱歉，未获取到密码，请手动输入';
            });
            inputEl.addEventListener('input', function (ev) {
                var v = ev.target.value;
                (0, local_1.setPwdValue)(diskType, diskID, v);
            });
        }
    }, 1400);
    setTimeout(function () {
        timer && clearInterval(timer);
    }, 1000 * 60);
    //check if pwd input
    var sendTimer;
    sendTimer = setInterval(function () {
        var tbody = document.querySelector('div[class*="tbody"');
        if (tbody) {
            console.log('tbody');
            clearInterval(sendTimer);
            (0, inet_1.sendPass)(diskID, diskType, (0, local_1.getPwdValue)(diskType, diskID));
            console.log('sent');
        }
    }, 2000);
};
exports["default"] = alyPage;


/***/ }),

/***/ 292:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bdyIndex = exports.bdyProcess = exports.BAIDU_ELEMENT = void 0;
var config_1 = __importStar(__webpack_require__(516));
var helper_1 = __webpack_require__(910);
var inet_1 = __webpack_require__(481);
var local_1 = __webpack_require__(549);
exports.BAIDU_ELEMENT = {
    input: 'form input',
    notice: '.verify-form > div',
    click: '.input-area > div > a > span',
};
var bdyProcess = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, diskType, diskID, noticeEl, inputEl, clickEl;
    return __generator(this, function (_b) {
        _a = (0, helper_1.getDiskIdAndType)(config_1.default.href), diskType = _a[0], diskID = _a[1];
        noticeEl = document.querySelector(exports.BAIDU_ELEMENT.notice);
        inputEl = document.querySelector(exports.BAIDU_ELEMENT.input);
        clickEl = document.querySelector(exports.BAIDU_ELEMENT.click);
        // noticeEl?.style.display = 'block'
        noticeEl.innerText = '获取密码中...';
        (0, inet_1.getPass)(diskID, diskType)
            .then(function (pass) {
            noticeEl.innerText = '获取到密码';
            console.log(pass);
            inputEl.value = pass;
            clickEl.click();
        })
            .catch(function () {
            noticeEl.innerText = '抱歉，未获取到密码，请手动输入';
        });
        inputEl.addEventListener('input', function (ev) {
            var _a;
            var v = (_a = ev.target.value) === null || _a === void 0 ? void 0 : _a.replace(/\*/gi, '');
            (0, local_1.setPwdValue)(diskType, diskID, v);
        });
        return [2 /*return*/];
    });
}); };
exports.bdyProcess = bdyProcess;
var bdyIndex = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, diskType, diskID, i, reg, cpp;
    return __generator(this, function (_b) {
        _a = (0, helper_1.getDiskIdAndType)(config_1.default.href), diskType = _a[0], diskID = _a[1];
        //是否失效
        for (i = 0; i < config_1.INVALIDATE_LINK_REG.length; i++) {
            reg = config_1.INVALIDATE_LINK_REG[i];
            if (reg.test(document.body.innerText)) {
                console.log('detected invalid page');
                (0, inet_1.sendInvalidate)(diskID, diskType);
                return [2 /*return*/];
            }
        }
        cpp = (0, helper_1.getCompressPass)();
        if (cpp)
            (0, local_1.setCompressValue)(diskType, diskID, cpp);
        if ((0, local_1.getSentValue)(diskType, diskID)) {
            GM_log('sent data');
        }
        else {
            (0, inet_1.sendPass)(diskID, diskType, (0, local_1.getPwdValue)(diskType, diskID));
            (0, local_1.setSentValue)(diskType, diskID);
            GM_log('sending data');
        }
        return [2 /*return*/];
    });
}); };
exports.bdyIndex = bdyIndex;


/***/ }),

/***/ 516:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PARSE_PWD_REG = exports.INVALIDATE_LINK_REG = void 0;
var href = location.href; // 完整路径
var hash = location.hash;
var host = location.hostname.replace(/^www\./i, '').toLowerCase();
var api = "https://disk.xwd.pw";
var config = { href: href, api: api, hash: hash, host: host };
exports.INVALIDATE_LINK_REG = [
    /(被取消了|分享文件已过期|已经被删除|分享内容可能因为|啊哦，你来晚了|取消分享了|外链不存在)/gi,
];
exports.PARSE_PWD_REG = [
    /(https?:\/\/(?:pan|yun|eyun)\.baidu\.com\/s[hare]*\/[int?surl=]*[\w-_]{8,25})[&\w=]*[^\w]*(?:密码|授权码|提取码)*[：:]*[^\w]*([\w]{4})*/gim,
    /(https?:\/\/(?:\w+)?\.?lanzou.?\.com\/[\w-_]{6,13})\/?[&\w=]*[^\w]*(?:密码|授权码|提取码)*[：:]*[^\w]*([\w]{3,})*/gim,
    /(https?:\/\/cloud.189.cn\/t\/[\w\-_]+)\/?[^\w]*[(（:：]*([\w]+)*[)）]*/gim,
    /(?:.*码.[:：]*)?([\w]{4,6})(?:[\w\S\s]*)?(https?:\/\/)?(www\.aliyundrive\.com\/s\/([\w]{9,16}))/gim,
];
exports["default"] = config;


/***/ }),

/***/ 910:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findAllLink = exports.activiteLink = exports.matchAll = exports.unique = exports.getCompressPass = exports.getDiskIdAndType = void 0;
function getDiskIdAndType(url) {
    if (typeof url !== 'string')
        return [];
    var matches;
    matches = /https?:\/\/(?:pan|eyun)\.baidu\.com\/share\/init\?surl=([a-zA-Z0-9_\-]{5,25})/gi.exec(url);
    if (matches && matches.length === 2) {
        return ['BDY', matches[1]];
    }
    matches = /https?:\/\/(?:pan|eyun)\.baidu\.com\/s\/[\d]([a-zA-Z0-9_\-]{5,25})/gi.exec(url);
    if (matches && matches.length === 2) {
        return ['BDY', matches[1]];
    }
    matches = /https?:\/\/(?:\w+)?\.?lanzou.?\.com\/([\w-_]{6,13})/gi.exec(url);
    if (matches && matches.length === 2) {
        return ['LZY', matches[1]];
    }
    matches = /https?:\/\/cloud.?189?\.cn\/t\/([\w_]{4,20})/gi.exec(url);
    if (matches && matches.length === 2) {
        return ['TYY', matches[1]];
    }
    matches = /https?:\/\/(?:www\.)?aliyundrive\.com\/s\/([\w_]{9,16})/gi.exec(url);
    if (matches && matches.length === 2) {
        return ['ALY', matches[1]];
    }
    return [];
}
exports.getDiskIdAndType = getDiskIdAndType;
function getCompressPass() {
    var re_pass = /[【\[激活解压壓提取密码碼：:\]】]{3,}\s*([\w+\.\-\~]+)/gi;
    var matchArray = document.body.innerText.match(re_pass);
    var result = [];
    if (!matchArray)
        return '';
    for (var i = 0; i < matchArray.length; i++) {
        result.push(matchArray[i]);
    }
    result = unique(result);
    // console.log(result);
    return result.join('~~');
}
exports.getCompressPass = getCompressPass;
function unique(arr) {
    // 去重
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                //第一个等同于第二个，splice方法删除第二个
                arr.splice(j, 1);
                j--;
            }
        }
    }
    return arr;
}
exports.unique = unique;
function matchAll(str, reg) {
    // helper,简单封装匹配函数
    var res = [];
    var match;
    while ((match = reg.exec(str))) {
        res.push(match);
    }
    return res;
}
exports.matchAll = matchAll;
function activiteLink(linkList) {
    var dom = document.body.innerHTML;
    for (var i = 0; i < linkList.length; i++) {
        dom = dom.replace(new RegExp(linkList[i], 'gm'), "<a target=\"_blank\" style=\"color:red;\" href=\"" + linkList[i] + "\">" + linkList[i] + "</a>");
    }
    document.body.innerHTML = dom;
}
exports.activiteLink = activiteLink;
function findAllLink(html) {
    var reg = /https?:\/\/(?:[\da-z\.-]+)\.(?:[a-z\.]{2,6})([\/\w \.-]*)*\/?/gi;
    var res = [];
    var match;
    while ((match = reg.exec(html))) {
        if (match.length >= 1) {
            if (match[0].indexOf('pan.baidu.com/s/') > -1 ||
                match[0].indexOf('lanzou') > -1 ||
                match[0].indexOf('aly') > -1 ||
                match[0].indexOf('aliyundrive') > -1) {
                var prefix = document.body.innerHTML.substr(match.index - 1, 1);
                // console.log('prefix', prefix)
                if (!["'", '"'].includes(prefix)) {
                    res.push(match[0]);
                }
                // console.log(match)
                // console.log(
                //   match[0],
                //   match[3],
                //   document.body.innerHTML.indexOf(match[0]),
                // )
            }
        }
    }
    return res;
}
exports.findAllLink = findAllLink;


/***/ }),

/***/ 882:
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var aly_1 = __importDefault(__webpack_require__(230));
var bdy_1 = __webpack_require__(292);
var config_1 = __importDefault(__webpack_require__(516));
var lzy_1 = __importDefault(__webpack_require__(159));
var page_1 = __importDefault(__webpack_require__(848));
var regular_express = {
    bdyPwd: /^https?:\/\/pan\.baidu\.com\/share\/init\?surl=.*/gi,
    bdyPage: /^https?:\/\/pan\.baidu\.com\/s\/.*/gi,
    lzyPage: /^https?:\/\/(?:\w+)?\.?lanzou.?\.com\/.*/gi,
    tyyPage: /^https?:\/\/(?:\w+)?\.?189.?\.cn\/.*/gi,
    alyPage: /^https?:\/\/(?:\w+)?\.?aliyundrive\.com\/s\/.*/gi,
};
//page detect start
~(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!regular_express.bdyPwd.test(config_1.default.href)) return [3 /*break*/, 2];
                console.log('bdy pass');
                return [4 /*yield*/, (0, bdy_1.bdyProcess)()];
            case 1:
                _a.sent();
                return [2 /*return*/];
            case 2:
                if (!regular_express.bdyPage.test(config_1.default.href)) return [3 /*break*/, 4];
                console.log('bdy page');
                return [4 /*yield*/, (0, bdy_1.bdyIndex)()];
            case 3:
                _a.sent();
                return [2 /*return*/];
            case 4:
                if (regular_express.lzyPage.test(config_1.default.href)) {
                    console.log('lzy Page');
                    (0, lzy_1.default)();
                    return [2 /*return*/];
                }
                if (regular_express.alyPage.test(config_1.default.href)) {
                    console.log('aly Page');
                    (0, aly_1.default)();
                    return [2 /*return*/];
                }
                //other pages
                return [4 /*yield*/, (0, page_1.default)()];
            case 5:
                //other pages
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
//page detect end


/***/ }),

/***/ 481:
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendPass = exports.sendInvalidate = exports.getPass = exports.req = void 0;
// import axios from 'axios'
var config_1 = __importDefault(__webpack_require__(516));
var local_1 = __webpack_require__(549);
var req = function (met, url, data) {
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: met,
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            onload: function (res) {
                resolve(res);
            },
            onerror: function (err) {
                reject(err);
            },
        });
    });
};
exports.req = req;
var getPass = function (id, type) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.req)('GET', config_1.default.api + "?disk_type=" + type + "&disk_id=" + id)];
            case 1:
                res = _a.sent();
                return [2 /*return*/, new Promise(function (resolve, inject) {
                        var _a;
                        var data = JSON.parse(res.responseText);
                        if ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.disk_pass) {
                            resolve(data.data.disk_pass);
                        }
                        else {
                            inject(data.msg);
                        }
                    })];
        }
    });
}); };
exports.getPass = getPass;
var sendInvalidate = function (id, type) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.req)('GET', config_1.default.api + "/invalid/" + type + "/" + id)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.sendInvalidate = sendInvalidate;
var sendPass = function (id, type, pass) { return __awaiter(void 0, void 0, void 0, function () {
    var local_compress_pass, data;
    return __generator(this, function (_a) {
        if (!id || !type)
            return [2 /*return*/];
        local_compress_pass = (0, local_1.getCompressValue)(type, id);
        data = "disk_id=" + id + "&disk_pass=" + pass + "&disk_type=" + type + "&disk_info=" + local_compress_pass;
        (0, exports.req)('POST', "" + config_1.default.api, data);
        GM_log('sent pa', id, type, pass);
        return [2 /*return*/];
    });
}); };
exports.sendPass = sendPass;


/***/ }),

/***/ 549:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setCompressValue = exports.getCompressValue = exports.setSentValue = exports.getSentValue = exports.getPwdValue = exports.setPwdValue = exports.delValue = exports.getVlues = exports.getValue = exports.setValue = exports.getValues = void 0;
function getValues() {
    return GM_listValues();
}
exports.getValues = getValues;
function setValue(key, value) {
    GM_setValue(key, value);
}
exports.setValue = setValue;
function getValue(key, defaultValue) {
    if (defaultValue === void 0) { defaultValue = ''; }
    return GM_getValue(key, defaultValue);
}
exports.getValue = getValue;
function getVlues() {
    return GM_listValues();
}
exports.getVlues = getVlues;
function delValue(key) {
    GM_deleteValue(key);
}
exports.delValue = delValue;
function setPwdValue(disk_type, disk_id, value) {
    GM_setValue(disk_type + '_' + disk_id, value);
}
exports.setPwdValue = setPwdValue;
function getPwdValue(disk_type, disk_id) {
    return GM_getValue(disk_type + '_' + disk_id, '');
}
exports.getPwdValue = getPwdValue;
function getSentValue(disk_type, disk_id) {
    return GM_getValue(disk_type + '_sent_' + disk_id, '');
}
exports.getSentValue = getSentValue;
function setSentValue(disk_type, disk_id) {
    GM_setValue(disk_type + '_sent_' + disk_id, 'ok');
}
exports.setSentValue = setSentValue;
function getCompressValue(disk_type, disk_id) {
    return GM_getValue(disk_type + '_compress_' + disk_id, '');
}
exports.getCompressValue = getCompressValue;
function setCompressValue(disk_type, disk_id, val) {
    GM_setValue(disk_type + '_compress_' + disk_id, val);
}
exports.setCompressValue = setCompressValue;


/***/ }),

/***/ 159:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LZ_ELEMENT = void 0;
var config_1 = __importStar(__webpack_require__(516));
var helper_1 = __webpack_require__(910);
var inet_1 = __webpack_require__(481);
var local_1 = __webpack_require__(549);
exports.LZ_ELEMENT = [
    {
        //type1
        input: 'input#pwd',
        notice: '#pwderr',
        click: 'input#sub',
    },
    {
        //type2
        input: 'input#pwd',
        notice: '#info',
        click: '#passwddiv > div > div.passwddiv-input > div',
    },
];
var lzyPage = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, diskType, diskID, i, reg, styelDe, findAndInput, pwdPage1, display, inputEl, noticeEl, clickEl, pwdPage2, display, inputEl, noticeEl, clickEl;
    return __generator(this, function (_b) {
        _a = (0, helper_1.getDiskIdAndType)(config_1.default.href), diskType = _a[0], diskID = _a[1];
        //是否失效
        for (i = 0; i < config_1.INVALIDATE_LINK_REG.length; i++) {
            reg = config_1.INVALIDATE_LINK_REG[i];
            if (reg.test(document.body.innerText)) {
                console.log('detected invalid page');
                (0, inet_1.sendInvalidate)(diskID, diskType);
                return [2 /*return*/];
            }
        }
        findAndInput = function (inputEl, noticeEl, clickEl) {
            noticeEl.innerText = '获取密码中...';
            (0, inet_1.getPass)(diskID, diskType)
                .then(function (pass) {
                noticeEl.innerText = '获取到密码';
                console.log(pass);
                inputEl.value = pass;
                clickEl.click();
            })
                .catch(function () {
                noticeEl.innerText = '抱歉，未获取到密码';
            });
            inputEl.addEventListener('input', function (e) {
                var _a;
                var v = (_a = e.target.value) === null || _a === void 0 ? void 0 : _a.replace(/\*/gi, '');
                (0, local_1.setPwdValue)(diskType, diskID, v);
            });
            // clickEl.addEventListener('click', () => {
            //   console.log('click')
            // })
            var timer = null;
            timer = setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if ((0, local_1.getSentValue)(diskType, diskID)) {
                                GM_log('sent, stop timer');
                                clearInterval(timer);
                                return [2 /*return*/];
                            }
                            if (!(styelDe.getPropertyValue('display') === 'none')) return [3 /*break*/, 2];
                            console.log('display none');
                            clearInterval(timer);
                            return [4 /*yield*/, (0, inet_1.sendPass)(diskID, diskType, (0, local_1.getPwdValue)(diskType, diskType))];
                        case 1:
                            _a.sent();
                            (0, local_1.setSentValue)(diskType, diskID);
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); }, 2000);
        };
        pwdPage1 = document.querySelector('#pwdload');
        if (pwdPage1) {
            styelDe = getComputedStyle(pwdPage1);
            display = styelDe.getPropertyValue('display');
            if (display === 'block') {
                console.log('lzy pwd page1');
                inputEl = document.querySelector(exports.LZ_ELEMENT[0].input);
                noticeEl = document.querySelector(exports.LZ_ELEMENT[0].notice);
                clickEl = document.querySelector(exports.LZ_ELEMENT[0].click);
                findAndInput(inputEl, noticeEl, clickEl);
            }
        }
        pwdPage2 = document.querySelector('#passwddiv');
        if (pwdPage2) {
            styelDe = getComputedStyle(pwdPage2);
            display = styelDe.getPropertyValue('display');
            if (display === 'block') {
                console.log('lzy pwd page2');
                inputEl = document.querySelector(exports.LZ_ELEMENT[1].input);
                noticeEl = document.querySelector(exports.LZ_ELEMENT[1].notice);
                clickEl = document.querySelector(exports.LZ_ELEMENT[1].click);
                findAndInput(inputEl, noticeEl, clickEl);
            }
        }
        //common page
        if (!pwdPage2 && !pwdPage1) {
            (0, inet_1.sendPass)(diskID, diskType, '');
        }
        return [2 /*return*/];
    });
}); };
exports["default"] = lzyPage;


/***/ }),

/***/ 848:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var config_1 = __importStar(__webpack_require__(516));
var helper_1 = __webpack_require__(910);
var inet_1 = __webpack_require__(481);
var local_1 = __webpack_require__(549);
var otherPage = function () { return __awaiter(void 0, void 0, void 0, function () {
    var bodyText, linksArr, cprP;
    return __generator(this, function (_a) {
        console.log('page', config_1.default.href);
        bodyText = document.body.innerText;
        linksArr = [];
        cprP = (0, helper_1.getCompressPass)();
        config_1.PARSE_PWD_REG.forEach(function (item) {
            var res = (0, helper_1.matchAll)(bodyText, item);
            for (var j = 0; j < res.length; j++) {
                if (res[j].length >= 3 && res[j][2] !== undefined) {
                    var _a = (0, helper_1.getDiskIdAndType)(res[j][1]), disk_type = _a[0], disk_id = _a[1];
                    (0, local_1.setCompressValue)(disk_type, disk_id, cprP); //密码
                    console.log('find pwd: ', disk_id, '===>>', res[j][2]);
                    (0, local_1.setPwdValue)(disk_type, disk_id, res[j][2]);
                    linksArr.push({
                        type: disk_type,
                        link: res[j][1],
                        pwd: res[j][2] || '',
                        id: disk_id,
                    });
                }
            }
        });
        //send
        linksArr.forEach(function (item) {
            (0, inet_1.sendPass)(item.id, item.type, item.pwd || '');
        });
        return [2 /*return*/];
    });
}); };
exports["default"] = otherPage;


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
/******/ 	var __webpack_exports__ = __webpack_require__(882);
/******/ 	
/******/ })()
;