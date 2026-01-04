/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = "<li><a id=\"fav-manager-dropdown-button\" data-toggle=\"modal\" data-target=\"#modal-fav-manager\" style=\"cursor : pointer;\"><span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\"></span> ローカルお気に入り管理</a></li>";

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "<div id=\"modal-fav-manager\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\">\r\n\t<div class=\"modal-dialog\" role=\"document\">\r\n\t\t<div class=\"modal-content\">\r\n\t\t\t<div class=\"modal-header\">\r\n\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">×</span></button>\r\n\t\t\t\t<h4 class=\"modal-title\">ローカルお気に入り管理</h4>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"modal-body\">\r\n                <div class=\"container-fluid\">\r\n                    <div class=\"row\">\r\n                        <div class=\"form-inline\">\r\n                            <div class=\"col-sm-12 form-group\">\r\n                                <label for=\"fav-manager-set-select\">セット: </label>\r\n                                <select id=\"fav-manager-set-select\" class=\"form-control\" data-placeholder=\"default\" data-allow-clear=\"false\" style=\"width: 30%;\">\r\n                                    <option value=\"default\">default</option>\r\n                                    <option value=\"blacklist\">blacklist</option>\r\n                                </select>\r\n                                <button id=\"fav-manager-toggle-set-activeness-button\" type=\"button\" class=\"btn btn-default\"></button>\r\n                                <a id=\"fav-manager-set-export-button\" type=\"button\" class=\"btn btn-default\" target=\"_blank\">エクスポート</a>\r\n                                <button id=\"fav-manager-set-delete-button\" type=\"button\" class=\"btn btn-danger pull-right\">削除</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"row\" style=\"max-height: 500px; overflow-y: auto; overflow-x: hidden\">\r\n                        <table class=\"table\">\r\n                            <tbody id=\"fav-manager-users-table\">\r\n                            </tbody>\r\n                        </table>\r\n                    </div>\r\n                    <p></p>\r\n                    <div class=\"row\">\r\n                        <div class=\"col-sm-6\">\r\n                            <div class=\"input-group\">\r\n                                <span class=\"input-group-addon\">セット名</span>\r\n                                <input id=\"fav-manager-add-set-input\" type=\"text\" class=\"form-control\" placeholder=\"サークル\">\r\n                                <span class=\"input-group-btn\">\r\n                                    <button id=\"fav-manager-add-set-button\" type=\"button\" class=\"btn btn-default\">作成</button>\r\n                                </span>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"col-sm-6\">\r\n                            <div class=\"input-group\">\r\n                                <span class=\"input-group-addon\">ユーザ名</span>\r\n                                <input id=\"fav-manager-add-user-input\" type=\"text\" class=\"form-control\" placeholder=\"tourist\">\r\n                                <span class=\"input-group-btn\">\r\n                                    <button id=\"fav-manager-add-user-button\" type=\"button\" class=\"btn btn-default\">追加</button>\r\n                                </span>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <p></p>\r\n                    <div class=\"row\">\r\n                        <label class=\"col-sm-6\">\r\n                            <span class=\"btn btn-primary col-sm-12\">ファイルからインポート<input id=\"fav-manager-select-import-file-button\" type=\"file\" style=\"display:none\" accept=\".json\" multiple=\"\"></span>\r\n                        </label>\r\n                        <label class=\"col-sm-6\">\r\n                            <a id=\"fav-manager-export-all-button\" type=\"button\" target=\"_blank\" class=\"btn btn-default col-sm-12\">全てエクスポート</a>\r\n                        </label>\r\n                    </div>\r\n                </div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"modal-footer\">\r\n\t\t\t\t<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">閉じる</button>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>";

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/favs.js

class favSets{
    constructor(){
        this.sets = {};
        this.isActive = {};
    }

    initialize(){
        this.sets = {default:new Set(),blacklist:new Set()};
        this.isActive = {default:true,blacklist:true};
    }

    createNewSet(key){
        if (typeof(key) !== "string") throw new Error(`set名 ${JSON.stringify(key)} は文字列型ではありません`);
        if (this.sets[key]) throw new Error(`set名 ${key} は既に存在しています`);
        this.sets[key] = new Set();
        this.isActive[key] = true;
    }

    setActive(key, activeness){
        if (typeof(key) !== "string") throw new Error(`set名 ${JSON.stringify(key)} は文字列型ではありません`);
        if (key === "blacklist") throw Error(`set ${key} の有効値は変更できません`);
        if (!this.isActive.hasOwnProperty(key)) throw Error(`set名 ${key} は存在していません`);
        this.isActive[key] = !!(activeness);
    }

    mergeWith(newSets){
        for (const key in newSets.sets){
            if (this.sets.hasOwnProperty(key)) {
                newSets.sets[key].forEach((user) => {
                    this.sets[key].add(user);
                });
                this.isActive[key] |= !!newSets.isActive[key];
            }
            else{
                this.sets[key] = newSets.sets[key];
                this.isActive[key] = !!newSets.isActive[key];
            }
        }
    }

    //defaultは常に有効、blacklistは常に無効
    get favSet() {
        let a = [];
        for (const key in this.isActive){
            if (!this.isActive[key]) continue;
            a.push(...this.sets[key]);
        }
        let set = new Set(a);
        this.sets["blacklist"].forEach((user) => {
            set.delete(user);
        });
        return set;
    }

    /**
     * favSetsをJSON化する
     * @param {favSets} favSets
     * @param {boolean} containActivenessData
     * @return {string}
     */
    static stringify(favSets, containActivenessData = true){
        let res = [];
        for (const key in favSets.isActive){
            let data = {name: key, users: [...favSets.sets[key]]};
            if (containActivenessData) data.isActive = favSets.isActive[key];
            res.push(data);
        }
        return JSON.stringify(res);
    }

    /**
     * JSONからfavSetsを復元する
     * @param {string} json
     * @return {favSets}
     */
    static parse(json){
        let sets = new favSets();
        JSON.parse(json).forEach((elem) => {
            if (!elem.hasOwnProperty("name")) throw new Error(`key "name" がオブジェクト ${JSON.stringify(elem)} に存在しません`);
            if (!elem.hasOwnProperty("users")) throw new Error(`key "users" がオブジェクト ${JSON.stringify(elem)} に存在しません`);
            if (typeof(elem.name) !== "string") throw new Error(`key "name" の値 (${JSON.stringify(elem.name)}) は文字列型でありません`);
            if (!Array.isArray(elem.users)) throw new Error(`key "users" の値 (${JSON.stringify(elem.users)}) は配列ではありません`);

            sets.sets[elem.name] = arrayToSet(elem.users);
            sets.isActive[elem.name] = elem.hasOwnProperty("isActive") ? !!(elem.isActive) : true;
        });
        return sets;
    }

    static isSpecialSet(key){
        return key === "default" || key === "blacklist";
    }
}

// CONCATENATED MODULE: ./src/atcoder/globalFavSets.js


let globalFavSets = new favSets();
globalFavSets.initialize();

/* harmony default export */ var atcoder_globalFavSets = (globalFavSets);
// CONCATENATED MODULE: ./src/atcoder/injectFavHandler.js




/* harmony default export */ var injectFavHandler = (function () {
    storeFavs = () => {
        setLS('favmanager-favSets', favSets.stringify(atcoder_globalFavSets));
        setLS('fav', setToArray(favSet = atcoder_globalFavSets.favSet));
    };

    reloadFavs = () => {
        atcoder_globalFavSets.initialize();
        atcoder_globalFavSets.mergeWith(favSets.parse(getLS('favmanager-favSets') || "[]"));
        favSet = atcoder_globalFavSets.favSet;
    };

    toggleFav = (val) => {
        reloadFavs();
        let res;
        if (favSet.has(val)) {
            atcoder_globalFavSets.sets.default.delete(val);
            atcoder_globalFavSets.sets.blacklist.add(val);
            res = false;
        } else {
            atcoder_globalFavSets.sets.default.add(val);
            atcoder_globalFavSets.sets.blacklist.delete(val);
            res = true;
        }
        favSet = atcoder_globalFavSets.favSet;
        storeFavs();
        return res; // has val now
    };


    //migration
    if (!getLS('favmanager-favSets')) {
        (getLS('fav') || []).forEach((user) => {
            atcoder_globalFavSets.sets.default.add(user);
        });
        storeFavs();
    }
    else{
        reloadFavs();
    }
});
// EXTERNAL MODULE: ./src/atcoder/html/dropdownElement.html
var dropdownElement = __webpack_require__(1);
var dropdownElement_default = /*#__PURE__*/__webpack_require__.n(dropdownElement);

// EXTERNAL MODULE: ./src/atcoder/html/modal.html
var modal = __webpack_require__(2);
var modal_default = /*#__PURE__*/__webpack_require__.n(modal);

// CONCATENATED MODULE: ./src/files.js
﻿/**
 * ファイルに保存するためのURLを取得
 * @param {string} content
 */
function getObjectURL(content) {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, content], { type: "text/plain" });
    return window.URL.createObjectURL(blob);
}

// EXTERNAL MODULE: external "jQuery"
var external_jQuery_ = __webpack_require__(0);

// CONCATENATED MODULE: ./src/getTimeStamp.js
function padNumber(n) {
    const padZero = "00"+n;
    return padZero.substring(padZero.length - 2);
}

/* harmony default export */ var getTimeStamp = (function(){
    const now = new Date();
    return `${now.getFullYear()}${padNumber(now.getMonth())}${padNumber(now.getDate())}-${padNumber(now.getHours())}${padNumber(now.getMinutes())}${padNumber(now.getSeconds())}`;
});
// CONCATENATED MODULE: ./src/atcoder/generateElement.js








const modalNode = external_jQuery_(modal_default.a);
const dropdownNode = external_jQuery_(dropdownElement_default.a);

const setSelectSelector = external_jQuery_("#fav-manager-set-select", modalNode);
const usersTableSelector = external_jQuery_("#fav-manager-users-table", modalNode);
const setNameInputSelector = external_jQuery_("#fav-manager-add-set-input", modalNode);
const addSetButtonSelector = external_jQuery_("#fav-manager-add-set-button", modalNode);
const userNameInputSelector = external_jQuery_("#fav-manager-add-user-input", modalNode);
const addUserButtonSelector = external_jQuery_("#fav-manager-add-user-button", modalNode)
const setDeleteButtonSelector = external_jQuery_("#fav-manager-set-delete-button", modalNode);
const selectImportFileButtonSelector = external_jQuery_("#fav-manager-select-import-file-button", modalNode);
const toggleSetActivenessButtonSelector = external_jQuery_("#fav-manager-toggle-set-activeness-button", modalNode);

function getSelectedSet() {
    return setSelectSelector.val();
}

function setSelectedSet(value) {
    setSelectSelector.val(value);
}

function updateSelector() {
    const selected = getSelectedSet();
    setSelectSelector.empty();
    for (const key in atcoder_globalFavSets.isActive){
        setSelectSelector.append(`<option value="${E(key)}">${E(key)}${atcoder_globalFavSets.isActive[key] ? "" : "(無効)"}</option>`);
    }
    setSelectedSet(selected);
}

function updateTable() {
    usersTableSelector.empty();
    appendRow();
    atcoder_globalFavSets.sets[getSelectedSet()].forEach((user) => {
        if (usersTableSelector[0].lastElementChild.children.length === 3)
            appendRow();
        external_jQuery_(usersTableSelector[0].lastElementChild).append(
            `<td class="col-sm-4"><a href="/users/${encodeURIComponent(user)}">${E(user)}</a><a class="fav-manager-user-delete-button pull-right" name="${E(user)}" style="cursor : pointer; user-select: none;">×</a></td>`
        );
    });
    while (usersTableSelector[0].lastElementChild.children.length < 3){
        external_jQuery_(usersTableSelector[0].lastElementChild).append('<td class="col-sm-4"></td>');
    }
    function appendRow() {
        usersTableSelector.append("<tr></tr>");
    }
}

function updateDownloadLink() {
    const setExportElem = external_jQuery_("#fav-manager-set-export-button", modalNode)[0];
    const key = getSelectedSet();
    let exportSets = new favSets();
    exportSets.sets[key] = atcoder_globalFavSets.sets[key];
    exportSets.isActive[key] = true;
    setExportElem.download = `favset-${key}-${getTimeStamp()}.json`;
    setExportElem.href = getObjectURL(favSets.stringify(exportSets, false));

    const allExportElem = external_jQuery_("#fav-manager-export-all-button", modalNode)[0];
    allExportElem.download = `all-favsets-${getTimeStamp()}.json`;
    allExportElem.href = getObjectURL(favSets.stringify(atcoder_globalFavSets));
}

function updateView() {
    const selectedSet = getSelectedSet();
    toggleSetActivenessButtonSelector.text(atcoder_globalFavSets.isActive[selectedSet] ? "無効にする" : "有効にする");
    setDeleteButtonSelector.text(favSets.isSpecialSet(selectedSet) ? "クリア" : "セット削除");
    toggleSetActivenessButtonSelector.prop("disabled", selectedSet === "blacklist");
    updateDownloadLink();
    updateSelector();
    updateTable();
}

window.addEventListener("storage", event => {
    if (event.key !== 'favmanager-favSets') return;
    reloadFavs();
    updateView();
});

/* harmony default export */ var generateElement = (function(){
    external_jQuery_("body").prepend(modalNode);
    external_jQuery_(".navbar-right .dropdown-menu .divider:nth-last-child(2)").before(dropdownNode);
    external_jQuery_(".header-mypage_list li:last-child").before(dropdownNode);
    setSelectSelector.change(updateView);
    setDeleteButtonSelector.click(() => {
        const key = getSelectedSet();
        if (favSets.isSpecialSet(key)) {
            atcoder_globalFavSets.sets[key] = new Set();
        }
        else{
            delete atcoder_globalFavSets.sets[key];
            delete atcoder_globalFavSets.isActive[key];
            updateSelector();
            setSelectedSet("default");
        }
        storeFavs();
        updateView();
    });
    usersTableSelector.on("click", ".fav-manager-user-delete-button", (event) => {
        const key = getSelectedSet();
        const userName = event.target.getAttribute("name");
        atcoder_globalFavSets.sets[key].delete(userName);
        storeFavs();
        updateView();
    });
    setNameInputSelector.keypress(e => {
         if (e.which === 13) addSetButtonSelector.click();
    });
    addSetButtonSelector.click(() => {
        const newSetName = setNameInputSelector.val().trim();
        if (newSetName) {
            atcoder_globalFavSets.createNewSet(newSetName);
            updateSelector();
            setSelectedSet(newSetName);
        }
        setNameInputSelector.val("");
        storeFavs();
        updateView();
    });
    userNameInputSelector.keypress(e => {
        if (e.which === 13) addUserButtonSelector.click();
    });
    addUserButtonSelector.click(() => {
        atcoder_globalFavSets.sets[getSelectedSet()].add(userNameInputSelector.val().trim());
        userNameInputSelector.val("");
        storeFavs();
        updateView();
    });
    toggleSetActivenessButtonSelector.click(() => {
        const selectedSet = getSelectedSet();
        atcoder_globalFavSets.setActive(selectedSet, !atcoder_globalFavSets.isActive[selectedSet]);
        storeFavs();
        updateView();
    });

    let reader = new FileReader();
    reader.onload = (readerEvent) => {
        try{
            let parsedSets = favSets.parse(readerEvent.target.result);
            atcoder_globalFavSets.mergeWith(parsedSets);
            updateSelector();
            setSelectedSet(Object.keys(parsedSets.sets)[0]);
            storeFavs();
            updateView();
        }
        catch (e){
            alert("failed to load");
        }
    };
    selectImportFileButtonSelector.change((event) => {
        let files = event.target.files;
        for (let i = 0; i < files.length; i++){
            reader.readAsText(files[i]);
        }
        selectImportFileButtonSelector.val("");
    });
    external_jQuery_("#fav-manager-dropdown-button", dropdownNode).click(updateView);
    modalNode.ready(updateView);
});

// CONCATENATED MODULE: ./src/atcoder/main.js



/* harmony default export */ var main = (function(){
    injectFavHandler();
    generateElement();
});

// CONCATENATED MODULE: ./src/circles/main.js





/* harmony default export */ var circles_main = (function () {
    const circleName = location.pathname.split('/')[2];
    $.get(`/circles/${circleName}/api`).then(members => {
        let exportSets = new favSets();
        exportSets.sets[circleName] = new Set();
        exportSets.isActive[circleName] = true;
        members.forEach((member) => {
            exportSets.sets[circleName].add(member);
        });
        let elem = $(`<div style="text-align: center;">
    <a style="color: gray;" download="${`circles-${circleName}-${getTimeStamp()}.json`}" href="${getObjectURL(favSets.stringify(exportSets, false))}" target="_blank">
        お気に入り登録用ファイルをダウンロード
    </a>
</div>`);
        $("table").before(elem);
    });
});
// CONCATENATED MODULE: ./src/main.js
// ==UserScript==
// @name        ac-favorite-manager
// @namespace   https://atcoder.jp/
// @version     1.1.3
// @description AtCoderのお気に入りの管理を行います。
// @author      keymoon
// @license     MIT
// @match       https://atcoder.jp/*
// @exclude     https://atcoder.jp/*/json
// @match       http://atcoder-circles.com/circles/*
// @exclude     http://atcoder-circles.com/circles/
// @downloadURL https://update.greasyfork.org/scripts/387728/ac-favorite-manager.user.js
// @updateURL https://update.greasyfork.org/scripts/387728/ac-favorite-manager.meta.js
// ==/UserScript==




if (location.hostname === "atcoder.jp"){
    main();
}
else if (location.hostname === "atcoder-circles.com"){
    circles_main();
}

/***/ })
/******/ ]);