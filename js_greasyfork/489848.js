// ==UserScript==
// @name                ljyun-aiot
// @namespace           http://tampermonkey.net/
// @version             0.8.10
// @description         灵境云 AIoT 助手
// @author              灵境云 AIoT
// @copyright           灵境云
// @license             MIT
// @match               https://aiot-hw-dev.portal.ljyun.cn/*
// @match               https://aiot.portal.ljyun.cn/*
// @match               https://inspection.portal.ljyun.cn/*
// @match               https://inspection.aiot.ljyun.cn/*
// @match               http://inspection.wuxi.dev.ljyun.cn:30080/*
// @match               https://cis.ljyun.cn/inspection/result
// @match               https://cis.ljyun.cn/config/aiot/alarm/alarmManage
// @match               https://highway.aiot.ljyun.cn/inspection-results/*
// @run-at              document-idle
// @supportURL          https://gitlab.i.ljyun.cn/shikang/aiot-helper-monkey/-/issues
// @homepage            https://gitlab.i.ljyun.cn/shikang/aiot-helper-monkey
// @require             https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_notification
// @grant               GM_addValueChangeListener
// @grant               GM_xmlhttpRequest
// @grant               GM_download
// @grant               GM_addStyle
// @connect             label.i.ljyun.cn
// @connect             hzdev.ddns.net
// @connect             aiot-images.obs.cn-east-3.myhuaweicloud.com
// @connect             aiot-images.ljyun.cn
// @connect             aiot-images.minio-api.nm.ljyun.cn
// @icon                https://resources.ljyun.cn/common/favio.svg
// @downloadURL https://update.greasyfork.org/scripts/489848/ljyun-aiot.user.js
// @updateURL https://update.greasyfork.org/scripts/489848/ljyun-aiot.meta.js
// ==/UserScript==
/* eslint-disable */ /* spell-checker: disable */
// @[ You can find all source codes in GitHub repo ]
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 859:
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var jquery_1 = __importDefault(__webpack_require__(669));
var eventHandlers_1 = __webpack_require__(201);
var observer_1 = __webpack_require__(832);
var message_1 = __webpack_require__(603);
var styleUtils_1 = __webpack_require__(224);
var app = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("%c ljyun-aiot-helper is running", (0, styleUtils_1.logStyle)());
        message_1.MessageBox.generate();
        (0, jquery_1.default)(document).on('keydown', eventHandlers_1.triggerDownloadOnShortcut);
        observer_1.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
        });
        return [2 /*return*/];
    });
}); };
exports["default"] = app;


/***/ }),

/***/ 551:
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.createHelperWrapper = exports.addButtonIfModalExists = void 0;
var constants_1 = __webpack_require__(921);
var ajax_1 = __webpack_require__(668);
var eventHandlers_1 = __webpack_require__(201);
var utils_1 = __webpack_require__(833);
function addButtonIfModalExists() {
    return __awaiter(this, void 0, void 0, function () {
        var $targetElement, dataRowObj, score, imageSign;
        return __generator(this, function (_a) {
            $targetElement = $('#auditAlarmModalData');
            if ($targetElement.length && !$('#downloadImageButton').length) {
                createHelperWrapper($targetElement);
                dataRowObj = (0, eventHandlers_1.getRawAlarmData)();
                if (!dataRowObj)
                    return [2 /*return*/];
                console.log('alarmData :>> ', dataRowObj);
                score = dataRowObj.score || (dataRowObj.originalDataset ? dataRowObj.originalDataset.score : 0) || 0;
                imageSign = (0, utils_1.getImageSign)(dataRowObj.image_addrs.length > 0 ? dataRowObj.image_addrs[0] : '');
                $('#alarmScoreSpan')
                    .text("[".concat(imageSign, "]\u7F6E\u4FE1\u5EA6\uFF1A").concat(score))
                    .css({
                    color: score > 0.5 ? 'green' : 'red',
                    marginRight: 10,
                });
                $();
            }
            return [2 /*return*/];
        });
    });
}
exports.addButtonIfModalExists = addButtonIfModalExists;
function createHelperWrapper(targetElement) {
    return __awaiter(this, void 0, void 0, function () {
        var $wrapper, $downloadButton, $messageSpan, lastElement, res, error_1, res, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    $wrapper = $('<div id="aiotHelperWrapper"></div>');
                    $downloadButton = $('<button>下载原图（alt+~）</button>')
                        .attr('id', 'downloadImageButton')
                        .css({
                        color: '#fff',
                        marginLeft: '10px',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        backgroundColor: '#0058ff',
                    })
                        .on('mouseenter', function () {
                        $(this).css('opacity', '.8');
                    })
                        .on('mouseleave', function () {
                        $(this).css('opacity', '1');
                    })
                        .on('click', eventHandlers_1.handleDownloadImageFn);
                    $messageSpan = $('<span></span>').attr('id', 'alarmScoreSpan').css({
                        marginLeft: '10px',
                        fontWeight: 'normal',
                        color: '#000',
                    });
                    $wrapper.append($messageSpan, $downloadButton);
                    $(targetElement).after($wrapper);
                    lastElement = $downloadButton;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, ajax_1.getData)('http://hzdev.ddns.net:8888/api/projects?page=1&page_size=1000&include=id,title', constants_1.HZDEV_TOKEN, "json" /* XhrResponseType.JSON */)];
                case 2:
                    res = _c.sent();
                    if (!res || res.count === 0 || ((_a = res.results) === null || _a === void 0 ? void 0 : _a.length) == 0) {
                        console.log(res);
                    }
                    else {
                        lastElement = addHzdevSelectAction(res.results, lastElement);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _c.sent();
                    console.log(error_1);
                    return [3 /*break*/, 4];
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, ajax_1.getData)('https://label.i.ljyun.cn/api/projects?page=1&page_size=1000&include=id,title', constants_1.AUTH_TOKEN, "json" /* XhrResponseType.JSON */)];
                case 5:
                    res = _c.sent();
                    if (!res || res.count === 0 || ((_b = res.results) === null || _b === void 0 ? void 0 : _b.length) == 0) {
                        console.log(res);
                    }
                    else {
                        addMarkSelectAction(res.results, lastElement);
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _c.sent();
                    console.log(error_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.createHelperWrapper = createHelperWrapper;
// 添加标注选项action
function addMarkSelectAction(results, lastElement) {
    var filterResults = results.filter(function (r) { return r.id >= 1; });
    var $select = $('<select>').attr('id', 'projectSelect').css({
        width: '150px',
        fontWeight: 'bold',
        color: '#0058ff',
        marginLeft: '10px',
        padding: '5px 10px',
        borderRadius: '5px',
        backgroundColor: '#bae7ff',
    });
    filterResults.forEach(function (project) {
        var $option = $('<option>').val(project.id).text(project.title);
        $select.append($option);
    });
    // 监听select 的选项事件，并缓存，用于下次初始赋值
    $select.on('change', function () {
        var selectedValue = $(this).val();
        GM_setValue('SELECTED_PROJECT', selectedValue);
    });
    var lastSelectedValue = GM_getValue('SELECTED_PROJECT');
    if (lastSelectedValue) {
        // 在列表中是否存在
        var isExited = filterResults.findIndex(function (o) { return o.id == lastSelectedValue; });
        if (isExited) {
            $select.val(+lastSelectedValue);
        }
        else {
            filterResults[0] && $select.val(+filterResults[0].id);
        }
    }
    lastElement.after($select);
    // 创建标注任务按钮
    var $markRoadTaskButton = $('<button>创建人工标注任务（alt+s）</button>')
        .attr('id', 'markRoadTaskButton')
        .css({
        fontWeight: 'bold',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '5px',
        backgroundColor: '#0058ff',
    })
        .on('mouseenter', function () {
        $(this).css('opacity', '.8');
    })
        .on('mouseleave', function () {
        $(this).css('opacity', '1');
    })
        .on('click', eventHandlers_1.handleCreateRoadTaskFn);
    $select.after($markRoadTaskButton);
    return $markRoadTaskButton;
}
function addHzdevSelectAction(results, lastElement) {
    var filterResults = results.filter(function (r) { return r.id >= 1; });
    var $select = $('<select>').attr('id', 'hzdevProjectSelect').css({
        width: '150px',
        fontWeight: 'bold',
        color: '#0058ff',
        marginLeft: '10px',
        padding: '5px 10px',
        borderRadius: '5px',
        backgroundColor: '#bae7ff',
    });
    filterResults.forEach(function (project) {
        var $option = $('<option>')
            .val(project.id)
            .text('[hzdev]' + project.title);
        $select.append($option);
    });
    // 监听select 的选项事件，并缓存，用于下次初始赋值
    $select.on('change', function () {
        var selectedValue = $(this).val();
        GM_setValue('HZDEV_SELECTED_PROJECT', selectedValue);
    });
    var lastSelectedValue = GM_getValue('HZDEV_SELECTED_PROJECT');
    if (lastSelectedValue) {
        // 在列表中是否存在
        var isExited = filterResults.findIndex(function (o) { return o.id == lastSelectedValue; });
        if (isExited) {
            $select.val(+lastSelectedValue);
        }
        else {
            filterResults[0] && $select.val(+filterResults[0].id);
        }
    }
    lastElement.after($select);
    // 创建标注任务按钮
    var $markButton = $('<button>上传标注图片（alt+q）</button>')
        .attr('id', 'markTaskButton')
        .css({
        fontWeight: 'bold',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '5px',
        backgroundColor: '#0058ff',
    })
        .on('mouseenter', function () {
        $(this).css('opacity', '.8');
    })
        .on('mouseleave', function () {
        $(this).css('opacity', '1');
    })
        .on('click', eventHandlers_1.handleCreateTaskFn);
    $select.after($markButton);
    return $markButton;
}


/***/ }),

/***/ 201:
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.triggerDownloadOnShortcut = exports.updateModalInformation = exports.getRawAlarmData = exports.getRawImageAddrsValue = exports.uploadImage = exports.handleCreateRoadTaskFn = exports.handleCreateTaskFn = exports.handleDownloadImageFn = void 0;
var constants_1 = __webpack_require__(921);
var message_1 = __webpack_require__(603);
var utils_1 = __webpack_require__(833);
/**
 * 下载原图
 */
function handleDownloadImageFn() {
    var rawImageAddrsValue = getRawImageAddrsValue();
    var filename = (0, utils_1.getImageName)(rawImageAddrsValue);
    GM_download({
        url: rawImageAddrsValue,
        name: filename,
        onload: function () {
            console.log('download');
        },
        onerror: function (error) {
            GM_notification({
                title: 'ljyun-aiot-helper',
                text: "\u4E0B\u8F7D\u5931\u8D25: ".concat(error),
                timeout: 2000,
            });
        },
    });
}
exports.handleDownloadImageFn = handleDownloadImageFn;
/**
 * 创建标注任务
 */
function handleCreateTaskFn() {
    var rawImageAddrsValue = getRawImageAddrsValue();
    if (!rawImageAddrsValue) {
        GM_notification({
            title: 'ljyun-aiot-helper',
            text: "\u56FE\u7247\u5730\u5740\u65E0\u6548",
            timeout: 3000,
        });
        return;
    }
    var fileName = (0, utils_1.getImageName)(rawImageAddrsValue);
    var projectId = $('#hzdevProjectSelect').val();
    if (!projectId) {
        return new message_1.MessageBox().show('请先选择项目');
    }
    GM_xmlhttpRequest({
        method: 'GET',
        url: rawImageAddrsValue,
        responseType: 'blob',
        onload: function (response) {
            if (response.status === 200) {
                var imageBlob = response.response;
                uploadImage('hzdev.ddns.net:8888', constants_1.HZDEV_TOKEN, "".concat(projectId), imageBlob, fileName);
            }
        },
    });
}
exports.handleCreateTaskFn = handleCreateTaskFn;
function handleCreateRoadTaskFn() {
    return __awaiter(this, void 0, void 0, function () {
        var rawImageAddrsValue, rawImageS3Path, projectId, dataRowObj, taskinfo, boxinfos;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    rawImageAddrsValue = getRawImageAddrsValue();
                    rawImageS3Path = (_a = (0, utils_1.convertImageUrlToS3Path)(rawImageAddrsValue)) === null || _a === void 0 ? void 0 : _a.s3Path;
                    projectId = $('#projectSelect').val();
                    if (!projectId) {
                        return [2 /*return*/, new message_1.MessageBox().show('请先选择项目')];
                    }
                    dataRowObj = getRawAlarmData();
                    if (!dataRowObj)
                        return [2 /*return*/];
                    return [4 /*yield*/, uploadRoadTask("".concat(projectId), rawImageS3Path, dataRowObj.originalDataset)];
                case 1:
                    taskinfo = _b.sent();
                    console.log('taskinfo=>', taskinfo);
                    boxinfos = JSON.parse(dataRowObj.boxInfos);
                    uploadPrediction(taskinfo.id, boxinfos);
                    return [2 /*return*/];
            }
        });
    });
}
exports.handleCreateRoadTaskFn = handleCreateRoadTaskFn;
function uploadImage(host, token, projectId, imageBlob, fileName) {
    var formData = new FormData();
    formData.append('file', imageBlob, fileName);
    GM_xmlhttpRequest({
        method: 'POST',
        url: "http://".concat(host, "/api/projects/").concat(projectId, "/import?commit_to_project=true"),
        data: formData,
        responseType: 'json',
        headers: {
            Authorization: token,
        },
        onload: function (res) {
            // 判断状态码是否为 20x
            if ((res === null || res === void 0 ? void 0 : res.status) >= 200 && (res === null || res === void 0 ? void 0 : res.status) < 300) {
                new message_1.MessageBox().show('上传标注图片成功', 2000);
            }
            else {
                new message_1.MessageBox().show('上传标注图片失败', 2000);
                console.log('创建失败');
            }
        },
        onerror: function (error) {
            console.log(error);
        },
    });
}
exports.uploadImage = uploadImage;
function uploadRoadTask(projectId, imagePath, alertData) {
    return __awaiter(this, void 0, void 0, function () {
        var meta, data, jsonString;
        return __generator(this, function (_a) {
            meta = {};
            if (alertData) {
                meta = {
                    location: alertData.address,
                    latitude: alertData.latitude,
                    longitude: alertData.longitude,
                    speed: alertData.speed,
                    course: alertData.course,
                    custom: '{"personId":"' + alertData.personId + '"}',
                    inspectionTime: alertData.inspectionTime,
                };
            }
            data = {
                project: projectId,
                data: {
                    image: imagePath,
                },
                meta: meta,
            };
            jsonString = JSON.stringify(data);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: "https://label.i.ljyun.cn/api/tasks/",
                        data: jsonString,
                        responseType: 'json',
                        headers: {
                            Authorization: constants_1.AUTH_TOKEN,
                            'Content-Type': 'application/json',
                        },
                        onload: function (res) {
                            // 判断状态码是否为 20x
                            if ((res === null || res === void 0 ? void 0 : res.status) >= 200 && (res === null || res === void 0 ? void 0 : res.status) < 300) {
                                new message_1.MessageBox().show('创建标注任务成功', 2000);
                                resolve(res.response);
                            }
                            else {
                                new message_1.MessageBox().show('创建标注任务失败', 2000);
                                console.log('创建失败');
                                resolve(res.response);
                            }
                        },
                        onerror: function (error) {
                            console.log(error);
                            reject(error);
                        },
                    });
                })];
        });
    });
}
function uploadPrediction(taskId, boxinfos) {
    console.log(boxinfos);
    var results = [];
    if (boxinfos.length == 0) {
        return;
    }
    boxinfos.forEach(function (item) {
        results.push({
            original_width: item.imageWidth,
            original_height: item.imageHeight,
            image_rotation: 0,
            from_name: 'label',
            to_name: 'image',
            type: 'rectanglelabels',
            value: {
                x: (item.xmin / item.imageWidth) * 100,
                y: (item.ymin / item.imageHeight) * 100,
                width: ((item.xmax - item.xmin) / item.imageWidth) * 100,
                height: ((item.ymax - item.ymin) / item.imageHeight) * 100,
                rotation: 0,
                rectanglelabels: [item.labelCn],
            },
            score: item.score,
        });
    });
    var data = {
        task: taskId,
        result: results,
    };
    var jsonString = JSON.stringify(data);
    GM_xmlhttpRequest({
        method: 'POST',
        url: "https://label.i.ljyun.cn/api/predictions/",
        data: jsonString,
        responseType: 'json',
        headers: {
            Authorization: constants_1.AUTH_TOKEN,
            'Content-Type': 'application/json',
        },
        onload: function (res) {
            console.log(res);
            // 判断状态码是否为 20x
            if ((res === null || res === void 0 ? void 0 : res.status) >= 200 && (res === null || res === void 0 ? void 0 : res.status) < 300) {
                new message_1.MessageBox().show('创建标注成功', 2000);
            }
            else {
                new message_1.MessageBox().show('创建标注失败', 2000);
                console.log('创建标注失败');
            }
        },
        onerror: function (error) {
            console.log(error);
        },
    });
}
function getRawImageAddrsValue() {
    var dataRow = getRawAlarmData();
    if (!dataRow)
        return '';
    if (Reflect.has(dataRow, 'rawImage')) {
        return dataRow.rawImage;
    }
    else if (dataRow && dataRow.originalDataset) {
        return dataRow.originalDataset.rawPict;
    }
    // 无 rawImage 字段，通过 image_addrs 中的图片地址进行转换得到原图
    var image = dataRow.image_addrs[0];
    return (0, utils_1.convertImageUrl)(image);
}
exports.getRawImageAddrsValue = getRawImageAddrsValue;
function getAlarmScore() {
    var dataRow = getRawAlarmData();
    if (!dataRow)
        return 0;
    // 道路巡检平台从 originalDataset 获取 score
    if (dataRow.originalDataset) {
        return dataRow.originalDataset.score;
    }
    else {
        return dataRow.score;
    }
}
function getRawAlarmData() {
    var $targetElement = $('#auditAlarmModalData');
    var dataRowValue = $targetElement.attr('data-row');
    if (!dataRowValue)
        return null;
    return JSON.parse(dataRowValue);
}
exports.getRawAlarmData = getRawAlarmData;
function updateModalInformation() {
    return __awaiter(this, void 0, void 0, function () {
        var alertData, score, imageUrl, imageSign;
        return __generator(this, function (_a) {
            alertData = getRawAlarmData();
            score = getAlarmScore();
            imageUrl = alertData && alertData.rawImage.length > 0 ? alertData.rawImage[0] : '';
            imageSign = (0, utils_1.getImageSign)(imageUrl);
            $('#alarmScoreSpan')
                .text("[".concat(imageSign, "]\u7F6E\u4FE1\u5EA6\uFF1A").concat(score))
                .css({
                color: score > 0.5 ? 'green' : 'red',
                marginRight: 10,
            });
            return [2 /*return*/];
        });
    });
}
exports.updateModalInformation = updateModalInformation;
function triggerDownloadOnShortcut(e) {
    if (e.altKey && e.key === '`') {
        $('#downloadImageButton').trigger('click');
    }
    else if (e.altKey && (e.key === 'q' || e.key === '1')) {
        $('#markTaskButton').trigger('click');
        console.log('qqq');
    }
    else if (e.altKey && e.key === 's') {
        $('#markRoadTaskButton').trigger('click');
        console.log('alt+s');
    }
}
exports.triggerDownloadOnShortcut = triggerDownloadOnShortcut;


/***/ }),

/***/ 832:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.observer = void 0;
var domUtils_1 = __webpack_require__(551);
var eventHandlers_1 = __webpack_require__(201);
exports.observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === 'childList' && $('#auditAlarmModalData').length > 0) {
            (0, domUtils_1.addButtonIfModalExists)();
        }
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-row') {
            (0, eventHandlers_1.updateModalInformation)();
        }
    });
});


/***/ }),

/***/ 833:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getImageSign = exports.convertImageUrl = exports.getImageName = exports.convertImageUrlToS3Path = void 0;
function convertImageUrlToS3Path(url) {
    // 检查 URL 是否有效
    if (!url || typeof url !== 'string') {
        return null;
    }
    // 定义转换逻辑
    var urlParts = new URL(url);
    // const hostname = urlParts.hostname;
    var path = urlParts.pathname;
    // 确保 URL 的主机部分符合预期
    // if (!hostname.includes('myhuaweicloud.com')) {
    //   throw new Error('URL does not belong to the expected domain');
    // }
    // 构建并返回 S3 路径
    var s3Path = "s3://aiot-images".concat(path);
    // 文件名
    var fileName = path.split('/').pop() || Math.random().toString(36).substring(7);
    return {
        s3Path: s3Path,
        fileName: fileName,
    };
}
exports.convertImageUrlToS3Path = convertImageUrlToS3Path;
// 获取图片网络链接文件名
function getImageName(url) {
    var urlParts = new URL(url);
    var path = urlParts.pathname;
    var fileName = path.split('/').pop() || Math.random().toString(36).substring(7);
    return fileName;
}
exports.getImageName = getImageName;
function convertImageUrl(originalUrl) {
    // // 首先，我们验证 URL 是否符合预期的格式
    // if (!originalUrl.startsWith('https://aiot-images.obs.cn-east-3.myhuaweicloud.com/alerts/')) {
    //   throw new Error('URL does not match the expected format.');
    // }
    // 将 'alerts' 替换为 'raw'
    var convertedUrl = originalUrl.replace('/alerts/', '/raw/');
    // 在文件名前添加 'r'
    // 分割 URL 来找到文件名部分，然后添加 'r'
    var parts = convertedUrl.split('/');
    var fileNameIndex = parts.length - 1; // 文件名总是最后一部分
    parts[fileNameIndex] = parts[fileNameIndex].replace(/^\d+-[a-zA-Z]*/, '');
    parts[fileNameIndex] = 'r' + parts[fileNameIndex];
    // 重新组合 URL
    convertedUrl = parts.join('/');
    return convertedUrl;
}
exports.convertImageUrl = convertImageUrl;
function getImageSign(imageUrl) {
    if (imageUrl === '') {
        return 'N';
    }
    var parts = imageUrl.split('/');
    var filename = parts[parts.length - 1];
    return filename.includes('m') ? 'A' : 'R';
}
exports.getImageSign = getImageSign;


/***/ }),

/***/ 921:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HZDEV_TOKEN = exports.AUTH_TOKEN = void 0;
// token
exports.AUTH_TOKEN = 'Token c3f81eff5ad4ece6756c9c03c80363c831513409';
exports.HZDEV_TOKEN = 'Token b9ca81c0e4c77ceaa9918893b97c265a9bb91ad2';


/***/ }),

/***/ 156:
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
var app_1 = __importDefault(__webpack_require__(859));
if (true) {
    (0, app_1.default)();
}
else {}


/***/ }),

/***/ 668:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.postData = exports.getData = void 0;
var message_1 = __webpack_require__(603);
var getData = function (url, token, type, usermethod) {
    if (type === void 0) { type = "document" /* XhrResponseType.DOCUMENT */; }
    if (usermethod === void 0) { usermethod = "GET" /* XhrMethod.GET */; }
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: usermethod,
            url: url,
            responseType: type,
            timeout: 5 * 60 * 1000,
            headers: {
                Authorization: token,
            },
            onload: function (response) {
                console.log('response - getData :>> ', response);
                if (response.status >= 200 && response.status < 400) {
                    resolve(response.response);
                }
                else {
                    reject(response);
                }
            },
            onerror: function (error) {
                new message_1.MessageBox('网络错误');
                reject(error);
            },
            ontimeout: function () {
                new message_1.MessageBox('网络超时', 'none', 2 /* IMPORTANCE.LOG_POP_GM */);
                reject('timeout');
            },
        });
    });
};
exports.getData = getData;
var postData = function (url, token, postData, _a) {
    var _b = _a === void 0 ? {
        responseType: "application/x-www-form-urlencoded" /* XhrResponseType.FORM */,
        usermethod: "POST" /* XhrMethod.POST */,
        contentType: "json" /* XhrResponseType.JSON */,
    } : _a, _c = _b.responseType, responseType = _c === void 0 ? "application/x-www-form-urlencoded" /* XhrResponseType.FORM */ : _c, _d = _b.usermethod, usermethod = _d === void 0 ? "POST" /* XhrMethod.POST */ : _d, _e = _b.contentType, contentType = _e === void 0 ? "json" /* XhrResponseType.JSON */ : _e;
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: usermethod,
            url: url,
            headers: {
                'Content-Type': contentType,
                Authorization: token,
            },
            data: postData,
            responseType: responseType,
            timeout: 1 * 60 * 1000,
            onload: function (response) {
                if (response.status >= 200 && response.status < 400) {
                    resolve(response);
                }
                else {
                    new message_1.MessageBox('请求错误：' + response.status);
                    reject(response.status);
                }
            },
            onerror: function (error) {
                new message_1.MessageBox('网络错误');
                reject(error);
            },
            ontimeout: function () {
                new message_1.MessageBox('网络超时', 'none', 2 /* IMPORTANCE.LOG_POP_GM */);
                reject('timeout');
            },
        });
    });
};
exports.postData = postData;


/***/ }),

/***/ 603:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageBox = void 0;
// 需要手动增加 GM_addStyle 和 GM_notification 权限
/**
 * 消息通知类：不依赖框架
 * @param text string | undefined
 * @param setTime number | string = 5000,
 * @param importance number = 1
 * @example
 * 0.先在入口文件中调用静态方法 MessageBox.generate() 方法初始化消息弹出窗口；
 * 1. new MessageBox('hello')
 * 2.空初始化时调用 show() 显示消息；
 * 3.setTime：ms，非数字时为永久消息，需手动调用 refresh() 刷新消息，remove() 移除消息；
 * 4.importance：1： log + 自定义弹窗；2： log + 自定义弹窗 + GM系统提示；其它值：自定义弹窗；
 */
var MessageBox = /** @class */ (function () {
    function MessageBox(text, setTime, importance) {
        if (setTime === void 0) { setTime = 5000; }
        if (importance === void 0) { importance = 1 /* IMPORTANCE.LOG_POP */; }
        this._msg = null; // 永久显示标记，和元素地址
        this._text = text;
        this._setTime = setTime;
        this._importance = importance;
        this._timer = 0; // 计数器
        // 非空初始化，立即执行；
        if (text !== undefined) {
            this.show();
        }
    }
    // 静态方法，初始化消息盒子，先调用本方法初始化消息弹出窗口
    MessageBox.generate = function () {
        // 添加样式
        GM_addStyle("\n      #messageBox {\n        width: 222px; \n        position: fixed; \n        right: 5%; \n        bottom: 20px; \n        z-index: 99999\n      }\n      #messageBox div {\n        width: 100%; \n        background-color: #64ce83; \n        float: left; \n        padding: 5px 10px; \n        margin-top: 10px; \n        border-radius: 10px; \n        color: #fff; \n        box-shadow: 0px 0px 1px 3px #ffffff\n      }\n      ");
        this._msgBox = document.createElement('div'); // 创建类型为div的DOM对象
        this._msgBox.id = 'messageBox';
        document.body.append(this._msgBox); // 消息盒子添加到body
    };
    // 显示消息
    MessageBox.prototype.show = function (text, setTime, importance) {
        var _this = this;
        if (text === void 0) { text = this._text; }
        if (setTime === void 0) { setTime = this._setTime; }
        if (importance === void 0) { importance = this._importance; }
        if (this._msg !== null) {
            throw new Error('先移除上条消息，才可再次添加！');
        }
        if (text === undefined) {
            throw new Error('未输入消息');
        }
        this._text = text;
        this._setTime = setTime;
        this._importance = importance;
        this._msg = document.createElement('div');
        this._msg.textContent = text;
        MessageBox._msgBox.append(this._msg); // 显示消息
        switch (importance) {
            case 1: {
                console.log(text);
                break;
            }
            case 2: {
                console.log(text);
                GM_notification(text);
                break;
            }
            default: {
                break;
            }
        }
        if (setTime && !isNaN(Number(setTime))) {
            // 默认5秒删掉消息，可设置时间，none一直显示
            setTimeout(function () {
                _this.remove();
            }, Number(setTime));
        }
    };
    MessageBox.prototype.refresh = function (text) {
        if (isNaN(Number(this._setTime)) && this._msg) {
            this._msg.textContent = text;
            switch (this._importance) {
                case 1: {
                    console.log(text);
                    break;
                }
                case 2: {
                    console.log(text);
                    GM_notification(text);
                    break;
                }
                default: {
                    break;
                }
            }
        }
        else {
            throw new Error('只有弹窗永久消息支持刷新内容：' + this._setTime);
        }
    };
    // 移除方法，没有元素则等待setTime 5秒再试5次
    MessageBox.prototype.remove = function () {
        var _this = this;
        if (this._msg) {
            this._msg.remove();
            this._msg = null; // 清除标志位
        }
        else {
            // 空初始化时，消息异步发送，导致先执行移除而获取不到元素，默认 setTime=5000
            // 消息发出后，box 非空，可以移除，不会执行 setTime="none"
            if (this._timer == 4) {
                throw new Error('移除的元素不存在：' + this._msg);
            }
            this._timer++;
            setTimeout(function () {
                _this.remove();
            }, Number(this._setTime));
        }
    };
    return MessageBox;
}());
exports.MessageBox = MessageBox;


/***/ }),

/***/ 224:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.logStyle = void 0;
function logStyle() {
    return "font-weight: bold; color: #ffffff; background:linear-gradient(-45deg, #0058ff 50%, #47caff 50% );background: -webkit-linear-gradient( 120deg, #0058ff 30%, #41d1ff ); padding: 4px 8px; border-radius: 4px;";
}
exports.logStyle = logStyle;


/***/ }),

/***/ 669:
/***/ ((module) => {

module.exports = jQuery;

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
/******/ 	var __webpack_exports__ = __webpack_require__(156);
/******/ 	
/******/ })()
;