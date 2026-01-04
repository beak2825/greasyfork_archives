// ==UserScript==
// @name                kintone-easy-mention
// @namespace           https://github.com/forestsheep911/monkey-kintone-batch-mention-research
// @version             0.0.1
// @description         monkey-kintone-batch-mention
// @author              bxu
// @copyright           bxu
// @license             MIT
// @match               https://*.cybozu.cn/k/*/show*
// @match               https://*.cybozu.com/k/*/show*
// @match               https://*.cybozu-dev.com/k/*/show*
// @match               https://*.kintone.com/k/*/show*
// @match               https://*.s.cybozu.cn/k/*/show*
// @match               https://*.s.cybozu.com/k/*/show*
// @match               https://*.s.kintone.com/k/*/show*
// @grant               GM_addValueChangeListener
// @run-at              document-idle
// @supportURL          https://github.com/forestsheep911/monkey-kintone-batch-mention-research/issues
// @homepage            https://github.com/forestsheep911/monkey-kintone-batch-mention-research
// @icon                https://img.icons8.com/external-anggara-filled-outline-anggara-putra/32/external-mention-communication-anggara-filled-outline-anggara-putra-2.png" alt="external-mention-communication-anggara-filled-outline-anggara-putra-2
// @downloadURL https://update.greasyfork.org/scripts/488601/kintone-easy-mention.user.js
// @updateURL https://update.greasyfork.org/scripts/488601/kintone-easy-mention.meta.js
// ==/UserScript==
/* eslint-disable */ /* spell-checker: disable */
// @[ You can find all source codes in GitHub repo ]
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports) {


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
var app = function () {
    var appendUserStringFormat = '<a class="ocean-ui-plugin-mention-user ocean-ui-plugin-linkbubble-no" href="/k/#/people/user/{0}" data-mention-id="{1}" tabindex="-1" style="-webkit-user-modify: read-only;">@{2}</a>&nbsp;';
    var appendOrgStringFormat = '<a class="ocean-ui-plugin-mention-user ocean-ui-plugin-linkbubble-no" data-org-mention-id="{0}" data-mention-code="{1}" data-mention-icon="" data-mention-name="{2}" tabindex="-1" style="-webkit-user-modify: read-only;" href="#">@{2}</a>&nbsp;';
    var appendGroupStringFormat = '<a class="ocean-ui-plugin-mention-user ocean-ui-plugin-linkbubble-no" data-group-mention-id="{0}" data-mention-code="{1}" data-mention-icon data-mention-name="{2}" tabindex="-1" style="-webkit-user-modify: read-only;" href="#">@{2}</a>&nbsp;';
    var isNoti = false;
    var replyBox = undefined;
    function init() {
        var _a, _b, _c, _d;
        isNoti =
            document.querySelector('iframe') &&
                ((_b = (_a = document.querySelector('iframe')) === null || _a === void 0 ? void 0 : _a.contentDocument) === null || _b === void 0 ? void 0 : _b.querySelectorAll('.user-link-cybozu'))
                ? true
                : false;
        replyBox = isNoti
            ? (_d = (_c = document
                .querySelector('iframe')) === null || _c === void 0 ? void 0 : _c.contentDocument) === null || _d === void 0 ? void 0 : _d.querySelector('.ocean-ui-comments-commentform-textarea')
            : document.querySelector('.ocean-ui-comments-commentform-textarea');
    }
    function stringFormat(src) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (arguments.length === 0)
            return '';
        return src.replace(/\{(\d+)\}/g, function (m, i) {
            return args[i];
        });
    }
    function moveCursorToEnd(area) {
        area.focus();
        if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
            var range = document.createRange();
            range.selectNodeContents(area);
            range.collapse(false);
            var sel = window.getSelection();
            sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
            sel === null || sel === void 0 ? void 0 : sel.addRange(range);
        }
    }
    function makeAllUserMentionMark(atMarkString) {
        var _a;
        var finduserhref = document.querySelectorAll('.user-link-cybozu');
        if (finduserhref.length != 0) {
            makeMentionMark(finduserhref, isNoti, atMarkString);
        }
        var myiframe = document.querySelector('iframe');
        if (myiframe) {
            var finduserhref_1 = (_a = myiframe.contentDocument) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.user-link-cybozu');
            if (finduserhref_1) {
                makeMentionMark(finduserhref_1, isNoti, atMarkString);
            }
        }
    }
    function makeMentionMark(finduserhref, isNoti, atMarkString) {
        var _a;
        var _loop_1 = function (i) {
            if (finduserhref[i].nextElementSibling) {
                return "continue";
            }
            var newurl = new URL(finduserhref[i].href);
            var path = finduserhref[i].href.substring(newurl.protocol.length + newurl.hostname.length + 2);
            var photosrc = new URL(finduserhref[i].children[0].src);
            var mentionid = photosrc.searchParams.get('id');
            var username = finduserhref[i].children[1].textContent;
            var ata = document.createElement('a');
            ata.style.marginLeft = '5px';
            ata.innerText = atMarkString;
            ata.addEventListener('click', function () {
                var _a, _b;
                ;
                replyBox === null || replyBox === void 0 ? void 0 : replyBox.focus();
                var replyInputArea = isNoti
                    ? (_b = (_a = document.querySelector('iframe')) === null || _a === void 0 ? void 0 : _a.contentDocument) === null || _b === void 0 ? void 0 : _b.querySelector('.ocean-ui-editor-field')
                    : document.querySelector('.ocean-ui-editor-field');
                if (replyInputArea) {
                    var lasteles = replyInputArea.lastElementChild;
                    if (lasteles) {
                        if (lasteles.nodeName === 'BR') {
                            lasteles.insertAdjacentHTML('beforebegin', stringFormat(appendUserStringFormat, path, mentionid, username));
                            moveCursorToEnd(replyInputArea);
                        }
                        else if (lasteles.nodeName === 'DIV') {
                            var divbr = lasteles.lastElementChild;
                            if (divbr && divbr.nodeName === 'BR') {
                                divbr.insertAdjacentHTML('beforebegin', stringFormat(appendUserStringFormat, path, mentionid, username));
                            }
                            else {
                                lasteles.insertAdjacentHTML('beforeend', stringFormat(appendUserStringFormat, path, mentionid, username));
                            }
                            moveCursorToEnd(replyInputArea);
                        }
                        else {
                            replyInputArea.insertAdjacentHTML('beforeend', stringFormat(appendUserStringFormat, path, mentionid, username));
                            moveCursorToEnd(replyInputArea);
                        }
                    }
                    else {
                        replyInputArea.insertAdjacentHTML('beforeend', stringFormat(appendUserStringFormat, path, mentionid, username));
                        moveCursorToEnd(replyInputArea);
                    }
                }
            });
            (_a = finduserhref[i].parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(ata);
        };
        for (var i = 0; i < finduserhref.length; i++) {
            _loop_1(i);
        }
    }
    function makeMentionMarkForOrgs(orgs) {
        var _a;
        var _loop_2 = function (org) {
            (_a = org.element) === null || _a === void 0 ? void 0 : _a.querySelectorAll('li > span').forEach(function (orgElement) {
                var mentionMarka = document.createElement('a');
                mentionMarka.style.marginLeft = '5px';
                mentionMarka.innerText = '@';
                var matchedValue;
                for (var _i = 0, _a = org.value; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (orgElement.textContent === item.name) {
                        matchedValue = item;
                        break;
                    }
                }
                mentionMarka.addEventListener('click', function () {
                    var _a, _b;
                    ;
                    replyBox === null || replyBox === void 0 ? void 0 : replyBox.focus();
                    var replyInputArea = isNoti
                        ? (_b = (_a = document
                            .querySelector('iframe')) === null || _a === void 0 ? void 0 : _a.contentDocument) === null || _b === void 0 ? void 0 : _b.querySelector('.ocean-ui-editor-field')
                        : document.querySelector('.ocean-ui-editor-field');
                    if (replyInputArea) {
                        var lasteles = replyInputArea.lastElementChild;
                        if (lasteles) {
                            if (lasteles.nodeName === 'BR') {
                                addMentionForOrg(lasteles, 'beforebegin', matchedValue);
                            }
                            else if (lasteles.nodeName === 'DIV') {
                                var divbr = lasteles.lastElementChild;
                                if (divbr && divbr.nodeName === 'BR') {
                                    addMentionForOrg(divbr, 'beforebegin', matchedValue);
                                }
                                else {
                                    addMentionForOrg(lasteles, 'beforeend', matchedValue);
                                }
                            }
                            else {
                                addMentionForOrg(replyInputArea, 'beforeend', matchedValue);
                            }
                        }
                        else {
                            addMentionForOrg(replyInputArea, 'beforeend', matchedValue);
                        }
                        moveCursorToEnd(replyInputArea);
                    }
                });
                orgElement === null || orgElement === void 0 ? void 0 : orgElement.appendChild(mentionMarka);
            });
        };
        for (var _i = 0, orgs_1 = orgs; _i < orgs_1.length; _i++) {
            var org = orgs_1[_i];
            _loop_2(org);
        }
    }
    function makeMentionMarkForGroups(orgs) {
        var _a;
        var _loop_3 = function (org) {
            (_a = org.element) === null || _a === void 0 ? void 0 : _a.querySelectorAll('li > span').forEach(function (orgElement) {
                var mentionMarka = document.createElement('a');
                mentionMarka.style.marginLeft = '5px';
                mentionMarka.innerText = '@';
                var matchedValue;
                for (var _i = 0, _a = org.value; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (orgElement.textContent === item.name) {
                        matchedValue = item;
                        break;
                    }
                }
                mentionMarka.addEventListener('click', function () {
                    var _a, _b;
                    ;
                    replyBox === null || replyBox === void 0 ? void 0 : replyBox.focus();
                    var replyInputArea = isNoti
                        ? (_b = (_a = document
                            .querySelector('iframe')) === null || _a === void 0 ? void 0 : _a.contentDocument) === null || _b === void 0 ? void 0 : _b.querySelector('.ocean-ui-editor-field')
                        : document.querySelector('.ocean-ui-editor-field');
                    if (replyInputArea) {
                        var lasteles = replyInputArea.lastElementChild;
                        if (lasteles) {
                            if (lasteles.nodeName === 'BR') {
                                addMentionForGroup(lasteles, 'beforebegin', matchedValue);
                            }
                            else if (lasteles.nodeName === 'DIV') {
                                var divbr = lasteles.lastElementChild;
                                if (divbr && divbr.nodeName === 'BR') {
                                    addMentionForGroup(divbr, 'beforebegin', matchedValue);
                                }
                                else {
                                    addMentionForGroup(lasteles, 'beforeend', matchedValue);
                                }
                            }
                            else {
                                addMentionForGroup(replyInputArea, 'beforeend', matchedValue);
                            }
                        }
                        else {
                            addMentionForGroup(replyInputArea, 'beforeend', matchedValue);
                        }
                        moveCursorToEnd(replyInputArea);
                    }
                });
                orgElement === null || orgElement === void 0 ? void 0 : orgElement.appendChild(mentionMarka);
            });
        };
        for (var _i = 0, orgs_2 = orgs; _i < orgs_2.length; _i++) {
            var org = orgs_2[_i];
            _loop_3(org);
        }
    }
    function makeMentionMarkForOrgSelect(orgs) {
        orgs.forEach(function (orgSelectElement) {
            var _a;
            var userSelectTitleElement = (_a = orgSelectElement === null || orgSelectElement === void 0 ? void 0 : orgSelectElement.element) === null || _a === void 0 ? void 0 : _a.previousElementSibling;
            var mentionMarka = document.createElement('a');
            mentionMarka.style.marginLeft = '5px';
            mentionMarka.innerText = '@all';
            mentionMarka.addEventListener('click', function () {
                var _a, _b;
                ;
                replyBox === null || replyBox === void 0 ? void 0 : replyBox.focus();
                var replyInputArea = isNoti
                    ? (_b = (_a = document.querySelector('iframe')) === null || _a === void 0 ? void 0 : _a.contentDocument) === null || _b === void 0 ? void 0 : _b.querySelector('.ocean-ui-editor-field')
                    : document.querySelector('.ocean-ui-editor-field');
                if (replyInputArea) {
                    var lasteles = replyInputArea.lastElementChild;
                    if (lasteles) {
                        if (lasteles.nodeName === 'BR') {
                            addBatchMentionForOrg(lasteles, 'beforebegin', orgSelectElement);
                        }
                        else if (lasteles.nodeName === 'DIV') {
                            var divbr = lasteles.lastElementChild;
                            if (divbr && divbr.nodeName === 'BR') {
                                addBatchMentionForOrg(divbr, 'beforebegin', orgSelectElement);
                            }
                            else {
                                addBatchMentionForOrg(lasteles, 'beforeend', orgSelectElement);
                            }
                        }
                        else {
                            addBatchMentionForOrg(replyInputArea, 'beforeend', orgSelectElement);
                        }
                    }
                    else {
                        addBatchMentionForOrg(replyInputArea, 'beforeend', orgSelectElement);
                    }
                    moveCursorToEnd(replyInputArea);
                }
            });
            userSelectTitleElement === null || userSelectTitleElement === void 0 ? void 0 : userSelectTitleElement.appendChild(mentionMarka);
        });
    }
    function makeMentionMarkForGroupSelect(orgs) {
        orgs.forEach(function (orgSelectElement) {
            var _a;
            var userSelectTitleElement = (_a = orgSelectElement === null || orgSelectElement === void 0 ? void 0 : orgSelectElement.element) === null || _a === void 0 ? void 0 : _a.previousElementSibling;
            var mentionMarka = document.createElement('a');
            mentionMarka.style.marginLeft = '5px';
            mentionMarka.innerText = '@all';
            mentionMarka.addEventListener('click', function () {
                var _a, _b;
                ;
                replyBox === null || replyBox === void 0 ? void 0 : replyBox.focus();
                var replyInputArea = isNoti
                    ? (_b = (_a = document.querySelector('iframe')) === null || _a === void 0 ? void 0 : _a.contentDocument) === null || _b === void 0 ? void 0 : _b.querySelector('.ocean-ui-editor-field')
                    : document.querySelector('.ocean-ui-editor-field');
                if (replyInputArea) {
                    var lasteles = replyInputArea.lastElementChild;
                    if (lasteles) {
                        if (lasteles.nodeName === 'BR') {
                            addBatchMentionForGroup(lasteles, 'beforebegin', orgSelectElement);
                        }
                        else if (lasteles.nodeName === 'DIV') {
                            var divbr = lasteles.lastElementChild;
                            if (divbr && divbr.nodeName === 'BR') {
                                addBatchMentionForGroup(divbr, 'beforebegin', orgSelectElement);
                            }
                            else {
                                addBatchMentionForGroup(lasteles, 'beforeend', orgSelectElement);
                            }
                        }
                        else {
                            addBatchMentionForGroup(replyInputArea, 'beforeend', orgSelectElement);
                        }
                    }
                    else {
                        addBatchMentionForGroup(replyInputArea, 'beforeend', orgSelectElement);
                    }
                    moveCursorToEnd(replyInputArea);
                }
            });
            userSelectTitleElement === null || userSelectTitleElement === void 0 ? void 0 : userSelectTitleElement.appendChild(mentionMarka);
        });
    }
    function makeMentionMarkForUserSelect(us) {
        us.forEach(function (userSelectElement) {
            var _a;
            var userSelectTitleElement = (_a = userSelectElement === null || userSelectElement === void 0 ? void 0 : userSelectElement.element) === null || _a === void 0 ? void 0 : _a.previousElementSibling;
            var mentionMarka = document.createElement('a');
            mentionMarka.style.marginLeft = '5px';
            mentionMarka.innerText = '@all';
            mentionMarka.addEventListener('click', function () {
                var _a, _b;
                ;
                replyBox === null || replyBox === void 0 ? void 0 : replyBox.focus();
                var replyInputArea = isNoti
                    ? (_b = (_a = document.querySelector('iframe')) === null || _a === void 0 ? void 0 : _a.contentDocument) === null || _b === void 0 ? void 0 : _b.querySelector('.ocean-ui-editor-field')
                    : document.querySelector('.ocean-ui-editor-field');
                if (replyInputArea) {
                    var lasteles = replyInputArea.lastElementChild;
                    if (lasteles) {
                        if (lasteles.nodeName === 'BR') {
                            addBatchMentionForUser(lasteles, 'beforebegin', userSelectElement);
                        }
                        else if (lasteles.nodeName === 'DIV') {
                            var divbr = lasteles.lastElementChild;
                            if (divbr && divbr.nodeName === 'BR') {
                                addBatchMentionForUser(divbr, 'beforebegin', userSelectElement);
                            }
                            else {
                                addBatchMentionForUser(lasteles, 'beforeend', userSelectElement);
                            }
                        }
                        else {
                            addBatchMentionForUser(replyInputArea, 'beforeend', userSelectElement);
                        }
                    }
                    else {
                        addBatchMentionForUser(replyInputArea, 'beforeend', userSelectElement);
                    }
                    moveCursorToEnd(replyInputArea);
                }
            });
            userSelectTitleElement === null || userSelectTitleElement === void 0 ? void 0 : userSelectTitleElement.appendChild(mentionMarka);
        });
    }
    function getUserSelectElementByFieldType(record) {
        return __awaiter(this, void 0, void 0, function () {
            var pre, key, rt;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pre = [];
                        for (key in record) {
                            if (record[key] && typeof record[key] === 'object') {
                                if (record[key].type === 'USER_SELECT') {
                                    pre.push({ fieldcode: key, value: record[key].value });
                                }
                            }
                        }
                        return [4 /*yield*/, Promise.all(pre.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var element, _a;
                                var _this = this;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            element = kintone.app.record.getFieldElement(item.fieldcode);
                                            item.element = element;
                                            // initialize the id for each org
                                            _a = item;
                                            return [4 /*yield*/, Promise.all(item.value.map(function (v) { return __awaiter(_this, void 0, void 0, function () {
                                                    var _a;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0:
                                                                _a = v;
                                                                return [4 /*yield*/, getUserIdbyCode(v.code)];
                                                            case 1:
                                                                _a.id = _b.sent();
                                                                return [2 /*return*/, v];
                                                        }
                                                    });
                                                }); }))];
                                        case 1:
                                            // initialize the id for each org
                                            _a.value = _b.sent();
                                            return [2 /*return*/, item];
                                    }
                                });
                            }); }))];
                    case 1:
                        rt = _a.sent();
                        return [2 /*return*/, rt];
                }
            });
        });
    }
    function getOrgSelectElementByFieldType(record) {
        return __awaiter(this, void 0, void 0, function () {
            var pre, key, rt;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pre = [];
                        for (key in record) {
                            if (record[key] && typeof record[key] === 'object') {
                                if (record[key].type === 'ORGANIZATION_SELECT') {
                                    pre.push({ fieldcode: key, value: record[key].value });
                                }
                            }
                        }
                        return [4 /*yield*/, Promise.all(pre.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var element, _a;
                                var _this = this;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            element = kintone.app.record.getFieldElement(item.fieldcode);
                                            item.element = element;
                                            // initialize the id for each org
                                            _a = item;
                                            return [4 /*yield*/, Promise.all(item.value.map(function (v) { return __awaiter(_this, void 0, void 0, function () {
                                                    var _a;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0:
                                                                _a = v;
                                                                return [4 /*yield*/, getOrgIdbyCode(v.code)];
                                                            case 1:
                                                                _a.id = _b.sent();
                                                                return [2 /*return*/, v];
                                                        }
                                                    });
                                                }); }))];
                                        case 1:
                                            // initialize the id for each org
                                            _a.value = _b.sent();
                                            return [2 /*return*/, item];
                                    }
                                });
                            }); }))];
                    case 1:
                        rt = _a.sent();
                        return [2 /*return*/, rt];
                }
            });
        });
    }
    function getGroupSelectElementByFieldType(record) {
        return __awaiter(this, void 0, void 0, function () {
            var pre, key, rt;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pre = [];
                        for (key in record) {
                            if (record[key] && typeof record[key] === 'object') {
                                if (record[key].type === 'GROUP_SELECT') {
                                    pre.push({ fieldcode: key, value: record[key].value });
                                }
                            }
                        }
                        return [4 /*yield*/, Promise.all(pre.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var element, _a;
                                var _this = this;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            element = kintone.app.record.getFieldElement(item.fieldcode);
                                            item.element = element;
                                            // initialize the id for each org
                                            _a = item;
                                            return [4 /*yield*/, Promise.all(item.value.map(function (v) { return __awaiter(_this, void 0, void 0, function () {
                                                    var _a;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0:
                                                                _a = v;
                                                                return [4 /*yield*/, getGroupIdbyCode(v.code)];
                                                            case 1:
                                                                _a.id = _b.sent();
                                                                return [2 /*return*/, v];
                                                        }
                                                    });
                                                }); }))];
                                        case 1:
                                            // initialize the id for each org
                                            _a.value = _b.sent();
                                            return [2 /*return*/, item];
                                    }
                                });
                            }); }))];
                    case 1:
                        rt = _a.sent();
                        return [2 /*return*/, rt];
                }
            });
        });
    }
    function addBatchMentionForUser(lasteles, position, users) {
        for (var _i = 0, _a = users.value; _i < _a.length; _i++) {
            var item = _a[_i];
            lasteles.insertAdjacentHTML(position, stringFormat(appendUserStringFormat, item.code, item.id, item.name));
        }
    }
    function addMentionForOrg(lasteles, position, orgValue) {
        lasteles.insertAdjacentHTML(position, stringFormat(appendOrgStringFormat, orgValue.id, orgValue.code, orgValue.name));
    }
    function addMentionForGroup(lasteles, position, orgValue) {
        lasteles.insertAdjacentHTML(position, stringFormat(appendGroupStringFormat, orgValue.id, orgValue.code, orgValue.name));
    }
    function addBatchMentionForOrg(lasteles, position, orgs) {
        for (var _i = 0, _a = orgs.value; _i < _a.length; _i++) {
            var item = _a[_i];
            addMentionForOrg(lasteles, position, item);
        }
    }
    function addBatchMentionForGroup(lasteles, position, orgs) {
        for (var _i = 0, _a = orgs.value; _i < _a.length; _i++) {
            var item = _a[_i];
            addMentionForGroup(lasteles, position, item);
        }
    }
    function getUserIdbyCode(code) {
        return __awaiter(this, void 0, void 0, function () {
            var myHeaders, requestOptions, response, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myHeaders = new Headers();
                        myHeaders.append('X-Requested-With', kintone.getRequestToken());
                        myHeaders.append('Content-Type', 'text/plain');
                        requestOptions = {
                            method: 'GET',
                            headers: myHeaders,
                            redirect: 'follow', // Update the type of redirect property
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch("/v1/users.json?codes[0]=".concat(code), requestOptions)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _a.sent();
                        if (result.users.length === 0) {
                            throw new Error('No user found');
                        }
                        return [2 /*return*/, result.users[0].id];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, ''];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function getOrgIdbyCode(code) {
        return __awaiter(this, void 0, void 0, function () {
            var myHeaders, requestOptions, response, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myHeaders = new Headers();
                        myHeaders.append('X-Requested-With', kintone.getRequestToken());
                        myHeaders.append('Content-Type', 'text/plain');
                        requestOptions = {
                            method: 'GET',
                            headers: myHeaders,
                            redirect: 'follow', // Update the type of redirect property
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch("/v1/organizations.json?codes[0]=".concat(code), requestOptions)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _a.sent();
                        if (result.organizations.length === 0) {
                            throw new Error('No organization found');
                        }
                        return [2 /*return*/, result.organizations[0].id];
                    case 4:
                        error_2 = _a.sent();
                        return [2 /*return*/, ''];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function getGroupIdbyCode(code) {
        return __awaiter(this, void 0, void 0, function () {
            var myHeaders, requestOptions, response, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myHeaders = new Headers();
                        myHeaders.append('X-Requested-With', kintone.getRequestToken());
                        myHeaders.append('Content-Type', 'text/plain');
                        requestOptions = {
                            method: 'GET',
                            headers: myHeaders,
                            redirect: 'follow', // Update the type of redirect property
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch("/v1/groups.json?codes[0]=".concat(code), requestOptions)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _a.sent();
                        if (result.groups.length === 0) {
                            throw new Error('No group found');
                        }
                        return [2 /*return*/, result.groups[0].id];
                    case 4:
                        error_3 = _a.sent();
                        return [2 /*return*/, ''];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function processUserSelectField(record) {
        return __awaiter(this, void 0, void 0, function () {
            var us;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getUserSelectElementByFieldType(record)];
                    case 1:
                        us = _a.sent();
                        makeMentionMarkForUserSelect(us);
                        return [2 /*return*/];
                }
            });
        });
    }
    function processOrgSelectField(record) {
        return __awaiter(this, void 0, void 0, function () {
            var os;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getOrgSelectElementByFieldType(record)];
                    case 1:
                        os = _a.sent();
                        makeMentionMarkForOrgSelect(os);
                        makeMentionMarkForOrgs(os);
                        return [2 /*return*/];
                }
            });
        });
    }
    function processGroupSelectField(record) {
        return __awaiter(this, void 0, void 0, function () {
            var gs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getGroupSelectElementByFieldType(record)];
                    case 1:
                        gs = _a.sent();
                        makeMentionMarkForGroupSelect(gs);
                        makeMentionMarkForGroups(gs);
                        return [2 /*return*/];
                }
            });
        });
    }
    kintone.events.on('app.record.detail.show', function (event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                init();
                processUserSelectField(event.record);
                processOrgSelectField(event.record);
                processGroupSelectField(event.record);
                // find all user mention and make mark
                makeAllUserMentionMark('@');
                return [2 /*return*/, event];
            });
        });
    });
};
exports["default"] = app;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var app_1 = __importDefault(__webpack_require__(/*! @/app */ "./src/app.ts"));
if (true) {
    (0, app_1.default)();
}
else {}


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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=kintone-easy-mention.js.map