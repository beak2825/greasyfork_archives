// ==UserScript==
// @name                kintone-marvel-paste-attachment
// @namespace           https://github.com/forestsheep911/kintone-marvel-paste-attachment
// @version             0.0.3
// @description         Allows you to paste images from the clipboard into the attachment field of kintone.
// @author              Bxu
// @copyright           Bxu
// @license             MIT
// @match               https://*.cybozu.cn/k/*/show*
// @match               https://*.cybozu.com/k/*/show*
// @match               https://*.cybozu-dev.com/k/*/show*
// @match               https://*.kintone.com/k/*/show*
// @match               https://*.s.cybozu.cn/k/*/show*
// @match               https://*.s.cybozu.com/k/*/show*
// @match               https://*.s.kintone.com/k/*/show*
// @require             https://unpkg.com/@kintone/rest-api-client@latest/umd/KintoneRestAPIClient.js
// @require             https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv4.min.js
// @run-at              document-end
// @supportURL          https://github.com/forestsheep911/kintone-marvel-paste-attachment/issues
// @homepage            https://github.com/forestsheep911/kintone-marvel-paste-attachment

// @icon                https://img.icons8.com/dusk/64/picture.png
// @downloadURL https://update.greasyfork.org/scripts/484516/kintone-marvel-paste-attachment.user.js
// @updateURL https://update.greasyfork.org/scripts/484516/kintone-marvel-paste-attachment.meta.js
// ==/UserScript==
/* eslint-disable */ /* spell-checker: disable */
// @[ You can find all source codes in GitHub repo ]
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 752:
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
    var kintoneRestAPIClient = new window.KintoneRestAPIClient();
    function createFileKeyStore() {
        var uploadedfilekeys = {};
        return {
            initialize: function (fieldcodes) {
                uploadedfilekeys = fieldcodes.reduce(function (acc, curr) {
                    acc[curr] = { value: [] };
                    return acc;
                }, {});
            },
            addFilekey: function (fieldcode, filekey) {
                if (Object.prototype.hasOwnProperty.call(uploadedfilekeys, fieldcode)) {
                    uploadedfilekeys[fieldcode].value.push({ fileKey: filekey });
                }
                else {
                    uploadedfilekeys[fieldcode] = { value: [{ fileKey: filekey }] };
                }
            },
            deleteFilekey: function (fieldcode, filekey) {
                if (Object.prototype.hasOwnProperty.call(uploadedfilekeys, fieldcode)) {
                    uploadedfilekeys[fieldcode].value = uploadedfilekeys[fieldcode].value.filter(function (key) { return key.fileKey !== filekey; });
                }
            },
            getUploadedFileKeys: function () {
                return uploadedfilekeys;
            },
        };
    }
    function extractFileTypes(obj) {
        var result = [];
        for (var key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
                if (obj[key].type === 'FILE') {
                    result.push(key);
                }
            }
        }
        return result;
    }
    function uploadFile(fileData) {
        return __awaiter(this, void 0, void 0, function () {
            var fileInfo, fileKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileInfo = {
                            name: "".concat(window.uuidv4(), ".png"),
                            data: fileData,
                        };
                        return [4 /*yield*/, kintoneRestAPIClient.file.uploadFile({
                                file: fileInfo,
                            })];
                    case 1:
                        fileKey = (_a.sent()).fileKey;
                        return [2 /*return*/, fileKey];
                }
            });
        });
    }
    function readImageFromClipboard() {
        return __awaiter(this, void 0, void 0, function () {
            var clipboardItems, _i, clipboardItems_1, clipboardItem, _a, _b, type, blob, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, navigator.clipboard.read()];
                    case 1:
                        clipboardItems = _c.sent();
                        _i = 0, clipboardItems_1 = clipboardItems;
                        _c.label = 2;
                    case 2:
                        if (!(_i < clipboardItems_1.length)) return [3 /*break*/, 7];
                        clipboardItem = clipboardItems_1[_i];
                        _a = 0, _b = clipboardItem.types;
                        _c.label = 3;
                    case 3:
                        if (!(_a < _b.length)) return [3 /*break*/, 6];
                        type = _b[_a];
                        if (!/^image\/.*/.test(type)) return [3 /*break*/, 5];
                        return [4 /*yield*/, clipboardItem.getType(type)];
                    case 4:
                        blob = _c.sent();
                        return [2 /*return*/, blob];
                    case 5:
                        _a++;
                        return [3 /*break*/, 3];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_1 = _c.sent();
                        console.error(err_1);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    }
    function generateImgFragment(fieldCode, fileKey, blobSize) {
        var attachHtmlTemplate = "\n    <img\n    src=\"/k/api/blob/download.do?fileKey=".concat(fileKey, "&amp;h=150&amp;w=150&amp;flag=SHRINK&amp;_ref=https%3A%2F%2Fcndevqpofif.cybozu.cn%2Fk%2F221%2Fedit\"\n    alt=\"\" data-thumbnail-key=\"slide-11\" class=\"gaia-ui-slideshow-thumbnail\" />\n    ").trim();
        var img = document.createElement('div');
        img.innerHTML = attachHtmlTemplate;
        img.firstChild.style.marginTop = '1em';
        // header
        var headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.alignItems = 'center';
        // headerDiv.style.justifyContent = 'space-between'
        var fileNameSpan = document.createElement('span');
        fileNameSpan.textContent = "".concat(Math.round(blobSize / 1024), " KB");
        var deleteButton = document.createElement('button');
        deleteButton.style.marginLeft = '1em';
        deleteButton.classList.add('gaia-ui-actionmenu-save');
        deleteButton.textContent = 'delete';
        deleteButton.style.width = 'fit-content';
        deleteButton.style.minWidth = 'unset';
        headerDiv.appendChild(fileNameSpan);
        headerDiv.appendChild(deleteButton);
        // outter block
        var blockLi = document.createElement('li');
        blockLi.classList.add('file-image-container-gaia');
        blockLi.appendChild(headerDiv);
        blockLi.appendChild(img.firstChild);
        // delete button event
        deleteButton.addEventListener('click', function () {
            fileKeyStore.deleteFilekey(fieldCode, fileKey);
            blockLi.remove();
        });
        return blockLi;
    }
    function generateAttachImageButton(attachFieldCodeList) {
        var _this = this;
        // find all attach file container
        var containers = attachFieldCodeList.map(function (fieldCode) {
            var container = kintone.app.record.getFieldElement(fieldCode);
            if (container) {
                return { dom: container, fieldCode: fieldCode };
            }
        });
        var _loop_1 = function (container) {
            if (!container) {
                return "continue";
            }
            var button = document.createElement('button');
            button.style.marginTop = '1em';
            button.classList.add('gaia-ui-actionmenu-save');
            button.style.width = 'fit-content';
            button.style.minWidth = 'unset';
            button.innerText = 'paste clipboard';
            button.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                var blob, filekey, ul;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, readImageFromClipboard()];
                        case 1:
                            blob = _a.sent();
                            if (!(blob && container)) return [3 /*break*/, 3];
                            return [4 /*yield*/, uploadFile(blob)];
                        case 2:
                            filekey = _a.sent();
                            fileKeyStore.addFilekey(container.fieldCode, filekey);
                            ul = container.dom.querySelector('ul');
                            if (ul) {
                                // const li = document.createElement('li')
                                ul.appendChild(generateImgFragment(container.fieldCode, filekey, blob.size));
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // add button to container
            container.dom.appendChild(button);
        };
        // loop containers
        for (var _i = 0, _a = Array.from(containers); _i < _a.length; _i++) {
            var container = _a[_i];
            _loop_1(container);
        }
    }
    function updateRecord() {
        return __awaiter(this, void 0, void 0, function () {
            var files, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        files = fileKeyStore.getUploadedFileKeys();
                        return [4 /*yield*/, kintoneRestAPIClient.record.updateRecord({
                                app: kintone.app.getId(),
                                id: kintone.app.record.getId(),
                                record: files,
                            })];
                    case 1:
                        result = _a.sent();
                        location.reload();
                        return [2 /*return*/];
                }
            });
        });
    }
    function getAlredayExsitFileKeys(record) {
        for (var key in record) {
            if (record[key] && typeof record[key] === 'object') {
                if (record[key].type === 'FILE') {
                    // loop record[key].value
                    for (var _i = 0, _a = record[key].value; _i < _a.length; _i++) {
                        var item = _a[_i];
                        fileKeyStore.addFilekey(key, item.fileKey);
                    }
                }
            }
        }
    }
    var fileKeyStore = createFileKeyStore();
    kintone.events.on(['app.record.detail.show'], function (event) {
        // step 1: 得到所有附件的字段代码
        var allAttachmentFieldCodes = extractFileTypes(event.record);
        if (allAttachmentFieldCodes.length === 0) {
            return event;
        }
        // step 2: 根据字段代码，生成【读剪切板中图片的按钮】，放在每个附件的元素里
        generateAttachImageButton(allAttachmentFieldCodes);
        // step 3: 初始化fileKeyStore
        fileKeyStore.initialize(allAttachmentFieldCodes);
        getAlredayExsitFileKeys(event.record);
        // step 4: 在空白处生成一个【提交】按钮，点击后，更新record
        var headerMenuSpace = kintone.app.record.getHeaderMenuSpaceElement();
        var updateButton = document.createElement('button');
        updateButton.classList.add('gaia-ui-actionmenu-save');
        updateButton.style.width = 'fit-content';
        updateButton.style.minWidth = 'unset';
        updateButton.innerText = 'save all';
        updateButton.addEventListener('click', function () {
            updateRecord();
        });
        headerMenuSpace === null || headerMenuSpace === void 0 ? void 0 : headerMenuSpace.appendChild(updateButton);
        return event;
    });
};
exports["default"] = app;


/***/ }),

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var app_1 = __importDefault(__webpack_require__(752));
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
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ })()
;