// ==UserScript==
// @name         中国大学慕课小工具
// @namespace    https://github.com/CodFrm/cxmooc-tools
// @version 2.5.3
// @description  一个中国大学mooc刷课工具,火狐,谷歌,油猴支持.支持自动观看视频/课件/讨论,屏蔽视频题目和静音倍速,作业/测试题库,考试题库,SCOP课程(੧ᐛ੭挂科模式,启动)
// @author       CodFrm
// @run-at       document-start
// @match        *://www.icourse163.org/learn/*
// @match        *://www.icourse163.org/spoc/learn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        CAT_click
// @grant        unsafeWindow
// @license      MIT
// @supportURL   https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=63
// @homepage     https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=63
// @antifeature membership
// @antifeature ads
// @downloadURL https://update.greasyfork.org/scripts/422467/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%E6%85%95%E8%AF%BE%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/422467/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%E6%85%95%E8%AF%BE%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

let config = {
    answer_ignore: false, //忽略题目,勾选此处将不会答题
    auto: true, //全自动挂机,无需手动操作,即可自动观看视频等
    rand_answer: false, //随机答案,没有答案的题目将自动的生成一个答案
    interval: 1, //时间间隔,当任务点完成后,会等待1分钟然后跳转到下一个任务点
    video_multiple: 1, //视频播放倍速,视频播放的倍数,建议不要改动,为1即可,这是危险的功能
    video_mute: true, //视频静音,视频自动静音播放
    topic_interval: 5,//题目答题间隔,单位为秒
    vtoken: "",
};

Object.keys(config).forEach(k => {
    localStorage[k] = config[k];
});
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/tampermonkey/course163-pack.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfig = void 0;
var SystemConfig = /** @class */ (function () {
    function SystemConfig() {
    }
    SystemConfig.version = 2.5;
    SystemConfig.url = "https://cx.icodef.com/";
    SystemConfig.hotVersion = "2.5.0";
    //TODO:优化规则,可以通过ci自动生成匹配规则到tampermonkey和manifest文件中
    SystemConfig.match = {
        "cx": [
            "*://*/mycourse/studentstudy?*",
            "*://*/work/doHomeWorkNew?*",
            "*://*/work/selectWorkQuestionYiPiYue?*",
            "*://*/exam/test/reVersionTestStartNew?*",
            "*://*/ztnodedetailcontroller/visitnodedetail?*",
            "*://*/antispiderShowVerify.ac*",
            "*://*/html/processVerify.ac?*",
            "*://*/exam/test/reVersionPaperMarkContentNew?*",
            "*://*/ananas/modules/*/index.html?*",
            "*://*/exam/test?*",
            "*://*/course/*.html?*"
        ], "zhs": [
            "*://examh5.zhihuishu.com/stuExamWeb.html*",
            "*://onlineexamh5new.zhihuishu.com/stuExamWeb.html*",
            "*://studyh5.zhihuishu.com/videoStudy.html*",
        ], "mooc163": [
            "*://www.icourse163.org/learn/*",
            "*://www.icourse163.org/spoc/learn/*"
        ]
    };
    SystemConfig.config = {
        cx: {
            name: "超星",
            items: [{
                    title: "随机答案",
                    description: "如果题库没有正确的答案会随机选择",
                    type: "checkbox",
                    key: "rand_answer",
                    value: false,
                }, {
                    title: "自动挂机",
                    description: "进入一个页面就会自动开始挂机,完成一个任务之后会自动进行下一个",
                    type: "checkbox",
                    key: "auto",
                    value: true,
                }, {
                    title: "视频静音",
                    description: "播放视频时,自动开启静音",
                    type: "checkbox",
                    key: "video_mute",
                    value: true,
                }, {
                    title: "忽略题目",
                    description: "自动挂机时,忽略掉题目不做,直接跳过",
                    type: "checkbox",
                    key: "answer_ignore",
                    value: false,
                }, {
                    title: "超级模式",
                    description: "超星平台下,超级模式会自动将flash播放器换成h5播放器",
                    type: "checkbox",
                    key: "super_mode",
                    value: true,
                }, {
                    title: "播放源",
                    description: "锁定视频播放源,为空为记录最后一次选中的源(公网1,公网2等)",
                    type: "text",
                    key: "video_cdn",
                    value: "默认"
                }, {
                    title: "播放倍速",
                    description: "视频播放的倍数,1为正常速度(最高16倍,该功能有一定危险)",
                    type: "text",
                    key: "video_multiple",
                    prompt: "这是一个很危险的功能,建议不要进行调整,如果你想调整播放速度请在下方填写yes(智慧树平台播放速度和视频进度无关,最高只能1.5倍速)",
                    unit: "倍",
                    value: "1",
                }, {
                    title: "跳转间隔",
                    description: "视频(题目,任务点)完成后n分钟再继续下一个任务,可以有小数点,例如:0.5=30秒",
                    type: "text",
                    key: "interval",
                    unit: "分",
                    value: "1",
                }, {
                    title: "做题间隔",
                    description: "每一道题之间填写答案的时间间隔",
                    type: "text",
                    key: "topic_interval",
                    unit: "秒",
                    value: "5",
                }],
        }, zhs: {
            name: "智慧树",
            items: [{
                    title: "随机答案",
                    description: "如果题库没有正确的答案会随机选择",
                    type: "checkbox",
                    key: "rand_answer",
                    value: false,
                }, {
                    title: "自动挂机",
                    description: "进入一个页面就会自动开始挂机,完成一个任务之后会自动进行下一个",
                    type: "checkbox",
                    key: "auto",
                    value: true,
                }, {
                    title: "视频静音",
                    description: "播放视频时,自动开启静音",
                    type: "checkbox",
                    key: "video_mute",
                    value: true,
                }, {
                    title: "超级模式",
                    description: "智慧树平台下,超级模式会让任务完成的倍速成真",
                    type: "checkbox",
                    key: "super_mode",
                    value: true,
                }, {
                    title: "播放倍速",
                    description: "视频播放的倍数,1为正常速度(最高16倍,该功能有一定危险)",
                    type: "text",
                    key: "video_multiple",
                    prompt: "这是一个很危险的功能,建议不要进行调整,如果你想调整播放速度请在下方填写yes(智慧树平台播放速度和视频进度无关,最高只能1.5倍速)",
                    unit: "倍",
                    value: "1",
                }, {
                    title: "跳转间隔",
                    description: "视频完成后n分钟再继续播放下一个,可以有小数点,例如:0.5=30秒",
                    type: "text",
                    key: "interval",
                    unit: "分",
                    value: "1",
                }, {
                    title: "做题间隔",
                    description: "每一道题之间填写答案的时间间隔",
                    type: "text",
                    key: "topic_interval",
                    unit: "秒",
                    value: "5",
                }],
        }, mooc163: {
            name: "中国大学MOOC",
            items: [{
                    title: "随机答案",
                    description: "如果题库没有正确的答案会随机选择",
                    type: "checkbox",
                    key: "rand_answer",
                    value: false,
                }, {
                    title: "自动挂机",
                    description: "进入一个页面就会自动开始挂机,完成一个任务之后会自动进行下一个",
                    type: "checkbox",
                    key: "auto",
                    value: true,
                }, {
                    title: "视频静音",
                    description: "播放视频时,自动开启静音",
                    type: "checkbox",
                    key: "video_mute",
                    value: true,
                }, {
                    title: "忽略题目",
                    description: "自动挂机时,忽略掉题目不做,直接跳过",
                    type: "checkbox",
                    key: "answer_ignore",
                    value: false,
                }, {
                    title: "播放倍速",
                    description: "视频播放的倍数,1为正常速度(最高16倍,该功能有一定危险)",
                    type: "text",
                    key: "video_multiple",
                    prompt: "这是一个很危险的功能,建议不要进行调整,如果你想调整播放速度请在下方填写yes(智慧树平台播放速度和视频进度无关,最高只能1.5倍速)",
                    unit: "倍",
                    value: "1",
                }, {
                    title: "跳转间隔",
                    description: "视频完成后n分钟再继续播放下一个,可以有小数点,例如:0.5=30秒",
                    type: "text",
                    key: "interval",
                    unit: "分",
                    value: "1",
                }, {
                    title: "做题间隔",
                    description: "每一道题之间填写答案的时间间隔",
                    type: "text",
                    key: "topic_interval",
                    unit: "秒",
                    value: "5",
                }],
        },
    };
    return SystemConfig;
}());
exports.SystemConfig = SystemConfig;


/***/ }),

/***/ "./src/internal/app/question.ts":
/*!**************************************!*\
  !*** ./src/internal/app/question.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsQuestionBankFacade = exports.ToolsQuestionBank = exports.SwitchTopicType = exports.QuestionStatusString = exports.TopicStatusString = exports.PushAnswer = void 0;
var utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/internal/utils/utils.ts");
var config_1 = __webpack_require__(/*! @App/config */ "./src/config.ts");
var application_1 = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
var PushAnswer = /** @class */ (function () {
    function PushAnswer() {
    }
    PushAnswer.prototype.Equal = function (content1, content2) {
        return content1 == content2;
    };
    return PushAnswer;
}());
exports.PushAnswer = PushAnswer;
var topicStatusMap = new Map();
topicStatusMap.set("ok", "搜索成功").set("random", "随机答案").set("no_support_random", "不支持的随机答案类型").set("no_answer", "题库中没有搜索到答案").set("no_match", "题库中没有符合的答案");
var questionStatusMap = new Map();
questionStatusMap.set("success", "搜索成功").set("network", "题库网络错误").set("incomplete", "题库不全").set("processing", "搜索中...");
function TopicStatusString(status) {
    return topicStatusMap.get(status) || "未知错误";
}
exports.TopicStatusString = TopicStatusString;
function QuestionStatusString(status) {
    return questionStatusMap.get(status) || "未知错误";
}
exports.QuestionStatusString = QuestionStatusString;
function SwitchTopicType(title) {
    switch (title) {
        case "单选题": {
            return 1;
        }
        case "多选题": {
            return 2;
        }
        case "判断题": {
            return 3;
        }
        case "填空题": {
            return 4;
        }
        default: {
            return null;
        }
    }
}
exports.SwitchTopicType = SwitchTopicType;
// 小工具题库
var ToolsQuestionBank = /** @class */ (function () {
    function ToolsQuestionBank(platform, info) {
        this.platform = platform;
        this.info = info;
    }
    ToolsQuestionBank.prototype.SetInfo = function (info) {
        this.info = info;
    };
    ToolsQuestionBank.prototype.GetInfo = function () {
        return encodeURIComponent(JSON.stringify(this.info));
    };
    ToolsQuestionBank.prototype.Answer = function (topic, resolve) {
        var _this = this;
        application_1.Application.App.log.Debug("答案查询", topic);
        var num = 20;
        var answer = new Array();
        var retStatus = "success";
        var next = function (index) {
            var body = "info=" + _this.GetInfo() + "&";
            var t = index;
            for (; t < index + num && t < topic.length; t++) {
                var val = topic[t];
                body += "topic[" + (t - index) + "]=" + encodeURIComponent((val.topic)) + "&type[" + (t - index) + "]=" + val.type + "&";
            }
            utils_1.HttpUtils.HttpPost(config_1.SystemConfig.url + "v2/answer?platform=" + _this.platform, body, {
                headers: {
                    "Authorization": application_1.Application.App.config.vtoken,
                    "X-Version": config_1.SystemConfig.version.toString(),
                },
                json: true,
                success: function (result) { return __awaiter(_this, void 0, void 0, function () {
                    var status, tmpResult, i, val;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                status = "success";
                                tmpResult = new Array();
                                for (i = 0; i < result.length; i++) {
                                    if (result[i].result == undefined || result[i].result.length <= 0) {
                                        tmpResult.push({
                                            index: index + result[i].index,
                                            topic: result[i].topic,
                                            type: -1,
                                            status: "no_answer",
                                            answers: null,
                                            correct: null,
                                            Equal: this.Equal,
                                        });
                                        status = "incomplete";
                                        continue;
                                    }
                                    val = result[i].result[0];
                                    tmpResult.push({
                                        index: index + result[i].index,
                                        topic: val.topic,
                                        type: val.type,
                                        correct: val.correct,
                                        status: "ok",
                                        Equal: this.Equal,
                                    });
                                }
                                answer = answer.concat(tmpResult);
                                if (status != "success") {
                                    retStatus = status;
                                }
                                return [4 /*yield*/, resolve({ status: "processing", answer: tmpResult })];
                            case 1:
                                _a.sent();
                                if (t < topic.length) {
                                    next(t);
                                }
                                else {
                                    return [2 /*return*/, resolve({ status: retStatus, answer: answer })];
                                }
                                return [2 /*return*/];
                        }
                    });
                }); },
                error: function () {
                    return resolve({ status: "network", answer: answer });
                }
            });
        };
        next(0);
    };
    ToolsQuestionBank.prototype.Push = function (answer) {
        var _this = this;
        return new Promise(function (resolve) {
            application_1.Application.App.log.Debug("采集提交", answer);
            utils_1.HttpUtils.HttpPost(config_1.SystemConfig.url + "answer?platform=" + _this.platform, "info=" + _this.GetInfo() + "&data=" + encodeURIComponent(JSON.stringify(answer)), {
                headers: {
                    "Authorization": application_1.Application.App.config.vtoken,
                    "X-Version": config_1.SystemConfig.version.toString(),
                },
                json: true,
                success: function (result) {
                    application_1.Application.App.log.Info("答案自动记录成功,成功获得" + result.add_token_num + "个打码数,剩余数量:" + result.token_num);
                    resolve("success");
                },
                error: function () {
                    resolve("network");
                }
            });
        });
    };
    ToolsQuestionBank.prototype.Equal = function (content1, content2) {
        return utils_1.removeHTML(content1) == utils_1.removeHTML(content2);
    };
    ToolsQuestionBank.prototype.CheckCourse = function (info) {
        var _this = this;
        return new Promise(function (resolve) {
            info = info || [_this.info];
            utils_1.HttpUtils.HttpPost(config_1.SystemConfig.url + "v2/check?platform=" + _this.platform, "info=" + encodeURIComponent(JSON.stringify(info)), {
                headers: {
                    "Authorization": application_1.Application.App.config.vtoken,
                    "X-Version": config_1.SystemConfig.version.toString(),
                },
                success: function () {
                    resolve(0);
                }, error: function () {
                    resolve(-1);
                }
            });
            resolve();
        });
    };
    return ToolsQuestionBank;
}());
exports.ToolsQuestionBank = ToolsQuestionBank;
var ToolsQuestionBankFacade = /** @class */ (function () {
    function ToolsQuestionBankFacade(platform, info) {
        if (typeof platform == "string") {
            this.bank = new ToolsQuestionBank(platform, info);
        }
        else {
            this.bank = platform;
        }
        this.question = new Array();
    }
    ToolsQuestionBankFacade.prototype.ClearQuestion = function () {
        this.question = new Array();
    };
    ToolsQuestionBankFacade.prototype.AddQuestion = function (q) {
        this.question.push(q);
    };
    ToolsQuestionBankFacade.prototype.Answer = function (callback) {
        var _this = this;
        var topic = new Array();
        this.question.forEach(function (val) {
            var type = val.GetType();
            if (type == -1) {
                return;
            }
            topic.push({
                topic: (val.GetTopic()),
                type: type,
            });
        });
        var status = "success";
        this.bank.Answer(topic, function (ret) {
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var t, i, answer, question, tmpStatus;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (ret.status != "processing") {
                                application_1.Application.App.log.Debug("题库返回", ret);
                                if (ret.status != "success" || status == "success") {
                                    callback(ret.status);
                                    return [2 /*return*/, resolve()];
                                }
                                callback(status);
                                return [2 /*return*/, resolve()];
                            }
                            t = application_1.Application.App.config.topic_interval * 1000;
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < ret.answer.length)) return [3 /*break*/, 11];
                            answer = ret.answer[i];
                            question = this.question[answer.index];
                            tmpStatus = answer.status;
                            if (!(answer.status == "no_answer")) return [3 /*break*/, 3];
                            status = this.randAnswer(status, tmpStatus, question);
                            return [4 /*yield*/, utils_1.Sleep(t)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 10];
                        case 3:
                            if (!(answer.type != question.GetType())) return [3 /*break*/, 4];
                            tmpStatus = "no_match";
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, question.Fill(answer)];
                        case 5:
                            tmpStatus = _a.sent();
                            _a.label = 6;
                        case 6:
                            if (!(tmpStatus == "no_match")) return [3 /*break*/, 8];
                            status = this.randAnswer(status, tmpStatus, question);
                            return [4 /*yield*/, utils_1.Sleep(t)];
                        case 7:
                            _a.sent();
                            return [3 /*break*/, 10];
                        case 8:
                            question.SetStatus(tmpStatus);
                            if (!(i < ret.answer.length - 1)) return [3 /*break*/, 10];
                            return [4 /*yield*/, utils_1.Sleep(t)];
                        case 9:
                            _a.sent();
                            _a.label = 10;
                        case 10:
                            i++;
                            return [3 /*break*/, 1];
                        case 11: return [2 /*return*/, resolve()];
                    }
                });
            }); });
        });
    };
    ToolsQuestionBankFacade.prototype.randAnswer = function (status, tmpStatus, question) {
        if (application_1.Application.App.config.rand_answer) {
            tmpStatus = question.Random();
        }
        else {
            status = "incomplete";
        }
        if (tmpStatus == "no_support_random") {
            status = "incomplete";
        }
        question.SetStatus(tmpStatus);
        return status;
    };
    ToolsQuestionBankFacade.prototype.Push = function (callback) {
        var answer = new Array();
        this.question.forEach(function (val) {
            var correct = val.Correct();
            if (correct == null || correct.correct == null || correct.type == -1) {
                return;
            }
            answer.push(correct);
        });
        this.bank.Push(answer).then(function (ret) {
            application_1.Application.App.log.Debug("题库返回", ret);
            return callback(ret);
        });
    };
    ToolsQuestionBankFacade.prototype.dealOption = function (options) {
        for (var i = 0; i < options.length; i++) {
            if (typeof options[i].content == "string") {
                options[i].content = (options[i].content);
            }
        }
        return options;
    };
    ToolsQuestionBankFacade.prototype.CheckCourse = function () {
        return this.bank.CheckCourse();
    };
    return ToolsQuestionBankFacade;
}());
exports.ToolsQuestionBankFacade = ToolsQuestionBankFacade;


/***/ }),

/***/ "./src/internal/app/task.ts":
/*!**********************************!*\
  !*** ./src/internal/app/task.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
var event_1 = __webpack_require__(/*! @App/internal/utils/event */ "./src/internal/utils/event.ts");
var Task = /** @class */ (function (_super) {
    __extends(Task, _super);
    function Task() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 初始化任务
    Task.prototype.Init = function () {
        return new Promise(function (resolve) {
            return resolve();
        });
    };
    // 提交任务,例如topic的类型,可以在本接口内进行提交操作
    Task.prototype.Submit = function () {
        return new Promise(function (resolve) {
            return resolve();
        });
    };
    // 停止任务
    Task.prototype.Stop = function () {
        return new Promise(function (resolve) {
            return resolve();
        });
    };
    // 任务的上下文(对于某些iframe的可能会用到)
    Task.prototype.Context = function () {
        return window;
    };
    return Task;
}(event_1.EventListener));
exports.Task = Task;


/***/ }),

/***/ "./src/internal/app/topic.ts":
/*!***********************************!*\
  !*** ./src/internal/app/topic.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
var application_1 = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
var config_1 = __webpack_require__(/*! @App/config */ "./src/config.ts");
// 题目任务点
var Topic = /** @class */ (function () {
    function Topic(content, answer) {
        this.answer = answer;
        this.context = content;
    }
    Topic.prototype.SetQueryQuestions = function (queryQuestions) {
        this.queryQuestions = queryQuestions;
    };
    Topic.prototype.addQuestion = function () {
        var _this = this;
        var questions = this.queryQuestions.QueryQuestions();
        this.answer.ClearQuestion();
        questions.forEach(function (val) {
            _this.answer.AddQuestion(val);
        });
    };
    Topic.prototype.QueryAnswer = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.lock) {
                return resolve("processing");
            }
            _this.lock = true;
            application_1.Application.App.log.Info("题目搜索中...");
            _this.addQuestion();
            _this.answer.Answer(function (status) {
                _this.lock = false;
                resolve(status);
                if (status == "network") {
                    return application_1.Application.App.log.Error("题库无法访问,请查看:" + config_1.SystemConfig.url);
                }
                else if (status == "incomplete") {
                    return application_1.Application.App.log.Warn("题库答案不全,请手动填写操作");
                }
            });
        });
    };
    Topic.prototype.CollectAnswer = function () {
        var _this = this;
        return new Promise(function (resolve) {
            application_1.Application.App.log.Debug("收集题目答案", _this.context);
            _this.addQuestion();
            _this.answer.Push(function (status) {
                application_1.Application.App.log.Debug("采集答案返回", status);
                resolve();
            });
        });
    };
    return Topic;
}());
exports.Topic = Topic;


/***/ }),

/***/ "./src/internal/application.ts":
/*!*************************************!*\
  !*** ./src/internal/application.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.AppName = exports.Content = exports.Frontend = exports.Backend = void 0;
var message_1 = __webpack_require__(/*! ./utils/message */ "./src/internal/utils/message.ts");
var utils_1 = __webpack_require__(/*! ./utils/utils */ "./src/internal/utils/utils.ts");
var config_1 = __webpack_require__(/*! @App/config */ "./src/config.ts");
exports.Backend = "backend";
exports.Frontend = "frontend";
exports.Content = "content";
exports.AppName = "cxmooc-tools";
var Application = /** @class */ (function () {
    function Application(runEnv, launcher, component) {
        Application.app = this;
        Application.runEnv = runEnv;
        this.runEnvSwitch(runEnv);
        this.launcher = launcher;
        this.component = component;
    }
    Object.defineProperty(Application, "App", {
        get: function () {
            return Application.app;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "debug", {
        get: function () {
            return "development" == "development";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "prod", {
        get: function () {
            return "development" == "production";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "config", {
        get: function () {
            return this.component.get("config");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "log", {
        get: function () {
            return this.component.get("logger");
        },
        enumerable: false,
        configurable: true
    });
    Application.prototype.run = function () {
        this.launcher.start();
    };
    Object.defineProperty(Application.prototype, "IsFrontend", {
        get: function () {
            return Application.IsFrontend;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "IsBackend", {
        get: function () {
            return Application.IsBackend;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "IsContent", {
        get: function () {
            return Application.IsContent;
        },
        enumerable: false,
        configurable: true
    });
    Application.prototype.runEnvSwitch = function (env) {
        switch (env) {
            case exports.Frontend:
                Application.IsFrontend = true;
                break;
            case exports.Backend:
                Application.IsBackend = true;
                break;
            case exports.Content:
                Application.IsContent = true;
                break;
        }
        ;
    };
    Object.defineProperty(Application.prototype, "Client", {
        get: function () {
            if (Application.IsFrontend) {
                return message_1.NewChromeClientMessage(exports.AppName);
            }
            return message_1.NewExtensionClientMessage(exports.AppName);
        },
        enumerable: false,
        configurable: true
    });
    Application.CheckUpdate = function (callback) {
        if (Application.IsContent) {
            chrome.storage.local.get(["version", "enforce", "hotversion", "url"], function (item) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, callback((config_1.SystemConfig.version < item.version), item)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            return;
        }
        utils_1.HttpUtils.HttpGet(config_1.SystemConfig.url + "update?ver=" + config_1.SystemConfig.version, {
            json: true,
            success: function (json) {
                return __awaiter(this, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                data = {
                                    version: json.version,
                                    url: json.url,
                                    enforce: json.enforce,
                                    hotversion: json.hotversion,
                                    injection: json.injection,
                                };
                                chrome.storage && chrome.storage.local.set(data);
                                return [4 /*yield*/, callback((config_1.SystemConfig.version < data.version), data)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }, error: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, callback(false, undefined)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
        });
    };
    return Application;
}());
exports.Application = Application;


/***/ }),

/***/ "./src/internal/utils/config.ts":
/*!**************************************!*\
  !*** ./src/internal/utils/config.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewFrontendGetConfig = exports.NewBackendConfig = exports.ChromeConfigItems = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/internal/utils/utils.ts");
var application_1 = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
var config_1 = __webpack_require__(/*! @App/config */ "./src/config.ts");
// 缓存默认值
var configDefaultValue = new Map();
configDefaultValue.set("vtoken", "");
for (var key in config_1.SystemConfig.config) {
    for (var i = 0; i < config_1.SystemConfig.config[key].items.length; i++) {
        configDefaultValue.set(key + "_" + config_1.SystemConfig.config[key].items[i].key, config_1.SystemConfig.config[key].items[i].value);
    }
}
var ChromeConfigItems = /** @class */ (function () {
    function ChromeConfigItems(config) {
        var _this = this;
        this.Namespace = "";
        this.config = config;
        var list = [];
        configDefaultValue.forEach(function (val, key) {
            list.push(key);
        });
        this.config.Watch(list, function (key, val) {
            _this.localCache[key] = val;
        });
        this.localCache = localStorage;
    }
    // 设置配置的命名空间,储存格式为 namepace_configkey
    ChromeConfigItems.prototype.SetNamespace = function (namespace) {
        this.Namespace = namespace + "_";
    };
    ChromeConfigItems.prototype.ConfigList = function () {
        return this.config.ConfigList();
    };
    ChromeConfigItems.prototype.SetNamespaceConfig = function (namespace, key, val) {
        return this.config.SetConfig(namespace + "_" + key, val);
    };
    ChromeConfigItems.prototype.GetNamespaceConfig = function (namespace, key, defaultVal) {
        return this.config.GetConfig(namespace + "_" + key, defaultVal);
    };
    ChromeConfigItems.prototype.GetConfig = function (key, defaultVal) {
        var val = this.config.GetConfig(this.Namespace + key);
        if (val == undefined) {
            return this.config.GetConfig(key, defaultVal);
        }
        return val || defaultVal;
    };
    ChromeConfigItems.prototype.Watch = function (key, callback) {
        this.config.Watch(key, callback);
    };
    Object.defineProperty(ChromeConfigItems.prototype, "super_mode", {
        get: function () {
            return utils_1.toBool(this.GetConfig("super_mode", "true"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "vtoken", {
        get: function () {
            return this.GetConfig("vtoken", "");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "rand_answer", {
        get: function () {
            return utils_1.toBool(this.GetConfig("rand_answer", "false"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "auto", {
        get: function () {
            return utils_1.toBool(this.GetConfig("auto", "true"));
        },
        set: function (val) {
            this.SetConfig("auto", utils_1.boolToString(val));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "video_mute", {
        get: function () {
            return utils_1.toBool(this.GetConfig("video_mute", "true"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "answer_ignore", {
        get: function () {
            return utils_1.toBool(this.GetConfig("answer_ignore", "false"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "video_cdn", {
        get: function () {
            var val = this.GetConfig("video_cdn");
            if (val == "默认") {
                return "";
            }
            return val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "video_multiple", {
        get: function () {
            return parseFloat(this.GetConfig("video_multiple"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "interval", {
        get: function () {
            var interval = parseFloat(this.GetConfig("interval", "0.1"));
            interval = interval * 100;
            return Math.floor(utils_1.randNumber(interval - interval / 2, interval + interval / 2)) / 100;
        },
        enumerable: false,
        configurable: true
    });
    ChromeConfigItems.prototype.SetConfig = function (key, val) {
        return this.config.SetConfig(this.Namespace + key, val);
    };
    Object.defineProperty(ChromeConfigItems.prototype, "topic_interval", {
        get: function () {
            return parseInt(this.GetConfig("topic_interval", "5"));
        },
        set: function (val) {
            this.SetConfig("topic_interval", val);
        },
        enumerable: false,
        configurable: true
    });
    return ChromeConfigItems;
}());
exports.ChromeConfigItems = ChromeConfigItems;
// 后台环境中使用
function NewBackendConfig() {
    var _this = this;
    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ret = new backendConfig();
                    return [4 /*yield*/, ret.updateCache()];
                case 1:
                    _a.sent();
                    resolve(ret);
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.NewBackendConfig = NewBackendConfig;
var configWatch = /** @class */ (function () {
    function configWatch() {
        this.watchCallback = new Map();
    }
    configWatch.prototype.WatchEvent = function (key, val) {
        var list = this.watchCallback.get(key);
        if (list != undefined) {
            list.forEach(function (v) {
                v(key, val);
            });
        }
        list = this.watchCallback.get("*");
        if (list != undefined) {
            list.forEach(function (v) {
                v(key, val);
            });
        }
    };
    configWatch.prototype.Watch = function (key, callback) {
        var _this = this;
        if (typeof key == "string") {
            this.setWatchMap(key, callback);
            return;
        }
        key.forEach(function (val, index) {
            _this.setWatchMap(val, callback);
        });
    };
    configWatch.prototype.setWatchMap = function (key, callback) {
        var list = this.watchCallback.get(key);
        if (list == undefined) {
            list = new Array();
        }
        list.push(callback);
        this.watchCallback.set(key, list);
    };
    return configWatch;
}());
var backendConfig = /** @class */ (function () {
    function backendConfig() {
        var _this = this;
        this.watch = new configWatch();
        chrome.runtime.onMessage.addListener(function (request) {
            if (request.type && request.type == "cxconfig") {
                _this.cache[request.key] = request.value;
                _this.watch.WatchEvent(request.key, request.value);
                _this.updateConfigStorage();
            }
        });
    }
    // 更新配置转为json,存入
    backendConfig.prototype.updateConfigStorage = function () {
        var txt = JSON.stringify(this.cache);
        chrome.storage.sync.set({ "config_storage": txt });
    };
    // 更新缓存
    backendConfig.prototype.updateCache = function () {
        var _this = this;
        return new Promise(function (resolve) {
            chrome.storage.sync.get("config_storage", function (items) {
                if (items["config_storage"]) {
                    _this.cache = JSON.parse(items["config_storage"]);
                }
                else {
                    _this.cache = {};
                }
                configDefaultValue.forEach(function (val, key) {
                    if (_this.cache[key] === undefined) {
                        _this.cache[key] = val;
                    }
                });
                _this.updateConfigStorage();
                resolve(undefined);
            });
        });
    };
    backendConfig.prototype.GetConfig = function (key, defaultVal) {
        if (this.cache == undefined) {
            application_1.Application.App.log.Fatal("缓存失败!!!");
            return "";
        }
        return this.cache[key] || defaultVal;
    };
    backendConfig.prototype.Watch = function (key, callback) {
        return this.watch.Watch(key, callback);
    };
    backendConfig.prototype.SetConfig = function (key, val) {
        var _this = this;
        return new Promise(function (resolve) {
            var info = {};
            info[key] = val;
            //通知前端和后端
            _this.cache[key] = val;
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "cxconfig", key: key, value: val });
            });
            chrome.runtime.sendMessage({ type: "cxconfig", key: key, value: val });
            _this.updateConfigStorage();
            resolve(undefined);
        });
    };
    backendConfig.prototype.ConfigList = function () {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.cache) {
                            return [2 /*return*/, resolve(this.cache)];
                        }
                        return [4 /*yield*/, this.updateCache()];
                    case 1:
                        _a.sent();
                        resolve(this.cache);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return backendConfig;
}());
// 前端环境使用
function NewFrontendGetConfig() {
    return new frontendGetConfig();
}
exports.NewFrontendGetConfig = NewFrontendGetConfig;
var frontendGetConfig = /** @class */ (function () {
    function frontendGetConfig() {
        var _this = this;
        this.watch = new configWatch();
        this.cache = window.configData || localStorage;
        window.addEventListener('message', function (event) {
            if (event.data.type && event.data.type == "cxconfig") {
                application_1.Application.App.log.Info("配置更新:" + event.data.key + "=" + event.data.value);
                _this.cache[event.data.key] = event.data.value;
                _this.watch.WatchEvent(event.data.key, event.data.value);
            }
        });
    }
    frontendGetConfig.prototype.GetConfig = function (key, defaultVal) {
        if (window.GM_getValue) {
            return window.GM_getValue(key, defaultVal);
        }
        return this.cache[key] || defaultVal;
    };
    frontendGetConfig.prototype.Watch = function (key, callback) {
        return this.watch.Watch(key, callback);
    };
    frontendGetConfig.prototype.SetConfig = function (key, val) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.cache[key] = val;
                if (window.GM_setValue) {
                    return [2 /*return*/, window.GM_setValue(key, val)];
                }
                return [2 /*return*/, application_1.Application.App.Client.Send({
                        type: "GM_setValue", details: { key: key, val: val },
                    })];
            });
        });
    };
    frontendGetConfig.prototype.ConfigList = function () {
        return this.cache;
    };
    return frontendGetConfig;
}());


/***/ }),

/***/ "./src/internal/utils/event.ts":
/*!*************************************!*\
  !*** ./src/internal/utils/event.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListener = void 0;
var EventListener = /** @class */ (function () {
    function EventListener() {
        this.event = {};
    }
    EventListener.prototype.addEventListener = function (event, callback) {
        if (!this.event[event]) {
            this.event[event] = new Array();
        }
        this.event[event].push({
            callback: callback, param: { once: false },
        });
    };
    EventListener.prototype.addEventListenerOnce = function (event, callback) {
        if (!this.event[event]) {
            this.event[event] = new Array();
        }
        this.event[event].push({
            callback: callback, param: { once: true },
        });
    };
    EventListener.prototype.callEvent = function (event) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.event[event]) {
            return;
        }
        var del = new Array();
        this.event[event].forEach(function (v, index) {
            v.callback.apply(_this, args);
            if (v.param.once) {
                del.push(index);
            }
        });
        del.forEach(function (v, index) {
            _this.event[event].splice(v - index, 1);
        });
    };
    return EventListener;
}());
exports.EventListener = EventListener;


/***/ }),

/***/ "./src/internal/utils/hook.ts":
/*!************************************!*\
  !*** ./src/internal/utils/hook.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Hook = void 0;
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var Hook = /** @class */ (function () {
    function Hook(func, context) {
        this.context = context || window;
        this.func = func;
    }
    Hook.prototype.Middleware = function (call) {
        var name;
        if (typeof this.func == "string") {
            name = this.func;
        }
        else {
            name = this.func.name;
        }
        var old = this.context[name];
        this.context[name] = function () {
            var args = [old];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i + 1] = arguments[_i];
            }
            return call.apply(this, args);
        };
    };
    Hook.HookAjaxRespond = function (url, call) {
        var _this = this;
        if (!this.once) {
            this.match_list = new Map();
            var self_1 = this;
            var hookXMLHttpRequest = new Hook("open", application_1.Application.GlobalContext.XMLHttpRequest.prototype);
            hookXMLHttpRequest.Middleware(function (next) {
                var _this = this;
                var args = [];
                for (var _a = 1; _a < arguments.length; _a++) {
                    args[_a - 1] = arguments[_a];
                }
                self_1.match_list.forEach(function (val, key) {
                    if (args[1].indexOf(key) != -1) {
                        Object.defineProperty(_this, "responseText", {
                            configurable: true,
                            get: function () {
                                return val.call(this, args[1], this.response);
                            }
                        });
                    }
                });
                return next.apply(this, args);
            });
            this.once = true;
        }
        if (typeof url == "string") {
            this.match_list.set(url, call);
        }
        else {
            url.forEach(function (v) {
                _this.match_list.set(v, call);
            });
        }
    };
    return Hook;
}());
exports.Hook = Hook;


/***/ }),

/***/ "./src/internal/utils/log.ts":
/*!***********************************!*\
  !*** ./src/internal/utils/log.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyLog = exports.PageLog = exports.ConsoleLog = void 0;
var application_1 = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
__webpack_require__(/*! ../../views/common */ "./src/views/common.ts");
var utils_1 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
// 开发者工具f12处打印日志
var ConsoleLog = /** @class */ (function () {
    function ConsoleLog() {
    }
    ConsoleLog.prototype.getNowTime = function () {
        var time = new Date();
        return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    };
    ConsoleLog.prototype.Debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        application_1.Application.App.debug && console.info.apply(console, __spreadArrays(["[debug", this.getNowTime(), "]"], args));
        return this;
    };
    ConsoleLog.prototype.Info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        application_1.Application.App.debug && console.info.apply(console, __spreadArrays(["[info", this.getNowTime(), "]"], args));
        return this;
    };
    ConsoleLog.prototype.Warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.warn.apply(console, __spreadArrays(["[warn", this.getNowTime(), "]"], args));
        return this;
    };
    ConsoleLog.prototype.Error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.error.apply(console, __spreadArrays(["[error", this.getNowTime(), "]"], args));
        return this;
    };
    ConsoleLog.prototype.Fatal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.error.apply(console, __spreadArrays(["[fatal", this.getNowTime(), "]"], args));
        return this;
    };
    return ConsoleLog;
}());
exports.ConsoleLog = ConsoleLog;
var PageLog = /** @class */ (function () {
    function PageLog() {
        var _this = this;
        this.el = undefined;
        window.addEventListener("load", function () {
            _this.div = document.createElement("div");
            // 主要布局
            _this.div.innerHTML = "\n            <div class=\"head\" id=\"tools-head\"> \n               <span>\u5C0F\u5DE5\u5177\u901A\u77E5\u6761</span> \n               <label class=\"switch\" style=\"width:90px\">\n                  <input class=\"checkbox-input\" id=\"checkbox\" type=\"checkbox\" checked=\"checked\">\n                  <label class=\"checkbox\" for=\"checkbox\"></label>\n                  <span>\u684C\u9762\u901A\u77E5</span>\n               </label>\n               <span class=\"close\" style=\"float:right; cursor:pointer; margin-right:5px;\">x</span>\n            </div>\n            <div class=\"main\">\n               <div class=\"tools-notice-content\"></div>\n            </div>\n            ";
            _this.div.className = "tools-logger-panel";
            document.body.appendChild(_this.div);
            _this.el = _this.div.querySelector(".tools-notice-content");
            _this.div.querySelector(".close").onclick = function () {
                _this.el = undefined;
                _this.div.remove();
            };
            var checkbox = _this.div.querySelector("#checkbox");
            checkbox.checked = (application_1.Application.App.config.GetConfig("is_notify") || "true") == "true";
            _this.is_notify = checkbox.checked;
            if (!checkbox.checked) {
                checkbox.removeAttribute("checked");
            }
            var self = _this;
            checkbox.addEventListener("change", function () {
                self.is_notify = this.checked;
                application_1.Application.App.config.SetConfig("is_notify", this.checked.toString());
            });
            setTimeout(function () {
                application_1.Application.CheckUpdate(function (isnew, data) {
                    if (data == undefined) {
                        _this.Info("检查更新失败.");
                        return;
                    }
                    var html = "";
                    if (isnew) {
                        html += "<span>[有新版本]</span>";
                    }
                    html += data.injection;
                    _this.Info(html);
                });
            }, 1000);
            //支持拖拽移动
            function getProperty(ele, prop) {
                return parseInt(window.getComputedStyle(ele)[prop]);
            }
            _this.div.style.left = application_1.Application.App.config.GetConfig("notify_tools_x");
            _this.div.style.top = application_1.Application.App.config.GetConfig("notify_tools_y");
            var head = _this.div.querySelector("#tools-head");
            head.onmousedown = function (downEvent) {
                var relaX = downEvent.clientX - _this.div.offsetLeft;
                var relaY = downEvent.clientY - _this.div.offsetTop;
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                var containerWidth = getProperty(_this.div, "width");
                var containerHeight = getProperty(_this.div, "height");
                document.onmousemove = function (moveEvent) {
                    var targetX = moveEvent.clientX - relaX;
                    var targetY = moveEvent.clientY - relaY;
                    if (targetX <= 0)
                        targetX = 0;
                    if (targetY <= 0)
                        targetY = 0;
                    if (targetX >= windowWidth - containerWidth)
                        targetX = windowWidth - containerWidth;
                    if (targetY >= windowHeight - containerHeight)
                        targetY = windowHeight - containerHeight;
                    _this.div.style.left = targetX + "px";
                    _this.div.style.top = targetY + "px";
                };
                document.onmouseup = function () {
                    document.onmouseup = null;
                    document.onmousemove = null;
                    application_1.Application.App.config.SetConfig("notify_tools_x", _this.div.style.left);
                    application_1.Application.App.config.SetConfig("notify_tools_y", _this.div.style.top);
                };
            };
        });
    }
    PageLog.prototype.getNowTime = function () {
        var time = new Date();
        return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    };
    PageLog.prototype.first = function (text, color, background) {
        var new_log = document.createElement("div");
        new_log.innerHTML =
            "\n                <div class=\"log\" style=\"border-color: " +
                background +
                "; background-color: " +
                background +
                ";\">\n                    <p><span style=\"color:" +
                color +
                ";\">" +
                text +
                "</span></p>\n                </div>\n            ";
        //插入第一个元素前
        var first = document
            .getElementsByClassName("tools-notice-content")[0]
            .getElementsByTagName("div");
        document.querySelector(".tools-notice-content").insertBefore(new_log, first[0]);
    };
    PageLog.prototype.toStr = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var text = "";
        for (var i = 0; i < args.length; i++) {
            if (typeof args[i] == "object") {
                text += args[i].toString() + "\n";
            }
            else {
                text += args[i] + "\n";
            }
        }
        return text.substring(0, text.length - 1);
    };
    PageLog.prototype.Debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.info.apply(console, __spreadArrays(["[debug", this.getNowTime(), "]"], args));
        return this;
    };
    PageLog.prototype.Info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var text = this.toStr.apply(this, args);
        if (this.el) {
            this.first(text, "#409EFF", "rgba(121, 187, 255, 0.2)");
        }
        else {
            console.info.apply(console, __spreadArrays(["[info", this.getNowTime(), "]"], args));
        }
        return this;
    };
    PageLog.prototype.Warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var text = this.toStr.apply(this, args);
        if (this.el) {
            this.first(text, "#5C3C00", "rgba(250, 236, 216, 0.4)");
        }
        console.warn.apply(console, __spreadArrays(["[warn", this.getNowTime(), "]"], args));
        if (document.hidden && localStorage["is_notify"] == "true") {
            utils_1.Noifications({
                title: "网课小工具",
                text: text + "\n3秒后自动关闭",
                timeout: 3000,
            });
        }
        return this;
    };
    PageLog.prototype.Error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var text = this.toStr.apply(this, args);
        if (this.el) {
            this.first(text, "#FFF0F0", "rgba(253, 226, 226, 0.5)");
        }
        console.error.apply(console, __spreadArrays(["[error", this.getNowTime(), "]"], args));
        if (localStorage["is_notify"] == "true") {
            utils_1.Noifications({
                title: "网课小工具",
                text: text,
            });
        }
        return this;
    };
    PageLog.prototype.Fatal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var text = this.toStr.apply(this, args);
        if (this.el) {
            this.first(text, "#ff0000", "rgba(253, 226, 226, 0.5)");
        }
        console.error.apply(console, __spreadArrays(["[fatal", this.getNowTime(), "]"], args));
        utils_1.Noifications({
            title: "网课小工具",
            text: text,
        });
        return this;
    };
    return PageLog;
}());
exports.PageLog = PageLog;
var EmptyLog = /** @class */ (function () {
    function EmptyLog() {
    }
    EmptyLog.prototype.Debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this;
    };
    EmptyLog.prototype.Info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this;
    };
    EmptyLog.prototype.Warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this;
    };
    EmptyLog.prototype.Error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this;
    };
    EmptyLog.prototype.Fatal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this;
    };
    return EmptyLog;
}());
exports.EmptyLog = EmptyLog;


/***/ }),

/***/ "./src/internal/utils/message.ts":
/*!***************************************!*\
  !*** ./src/internal/utils/message.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewChromeClientMessage = exports.NewChromeServerMessage = exports.NewExtensionClientMessage = exports.NewExtensionServerMessage = void 0;
function NewExtensionServerMessage(port) {
    return new extensionServerMessage(port);
}
exports.NewExtensionServerMessage = NewExtensionServerMessage;
var extensionServerMessage = /** @class */ (function () {
    function extensionServerMessage(port) {
        this.port = port;
        this.recv();
    }
    extensionServerMessage.prototype.recv = function () {
        var _this = this;
        //监听消息
        chrome.runtime.onConnect.addListener(function (port) {
            if (port.name != _this.port) {
                return;
            }
            port.onMessage.addListener(function (request) {
                _this.acceptCallback(new extensionClientMessage(port), request);
            });
        });
    };
    extensionServerMessage.prototype.Accept = function (callback) {
        this.acceptCallback = callback;
    };
    return extensionServerMessage;
}());
var msg = /** @class */ (function () {
    function msg(tag) {
        this.tag = tag;
    }
    msg.prototype.Recv = function (callback) {
        this.recvCallback = callback;
    };
    return msg;
}());
// 扩展中使用
function NewExtensionClientMessage(tag) {
    return new extensionClientMessage(tag);
}
exports.NewExtensionClientMessage = NewExtensionClientMessage;
var extensionClientMessage = /** @class */ (function (_super) {
    __extends(extensionClientMessage, _super);
    function extensionClientMessage(param) {
        var _this = this;
        if (typeof param === 'string') {
            _this = _super.call(this, param) || this;
            _this.connect();
        }
        else {
            _this.conn = param;
        }
        _this.recv();
        return _this;
    }
    extensionClientMessage.prototype.connect = function () {
        this.conn = chrome.runtime.connect({ name: this.tag });
    };
    extensionClientMessage.prototype.recv = function () {
        var _this = this;
        this.conn.onMessage.addListener(function (response) {
            _this.recvCallback(response);
        });
    };
    extensionClientMessage.prototype.Send = function (msg) {
        this.conn.postMessage(msg);
    };
    return extensionClientMessage;
}(msg));
// 浏览器中使用
function NewChromeServerMessage(tag) {
    return new chromeServerMessage(tag);
}
exports.NewChromeServerMessage = NewChromeServerMessage;
var chromeServerMessage = /** @class */ (function () {
    function chromeServerMessage(tag) {
        this.tag = tag;
        this.recv();
    }
    chromeServerMessage.prototype.recv = function () {
        var _this = this;
        window.addEventListener('message', function (event) {
            if (event.data.tag == _this.tag && event.data.conn_tag && event.data.source == "client") {
                _this.acceptCallback(new chromeClientMessage(_this.tag, event.data.conn_tag), event.data.msg);
            }
        });
    };
    chromeServerMessage.prototype.Accept = function (callback) {
        this.acceptCallback = callback;
    };
    return chromeServerMessage;
}());
function NewChromeClientMessage(tag) {
    return new chromeClientMessage(tag);
}
exports.NewChromeClientMessage = NewChromeClientMessage;
var chromeClientMessage = /** @class */ (function (_super) {
    __extends(chromeClientMessage, _super);
    function chromeClientMessage(tag, conn) {
        var _this = this;
        if (conn !== undefined) {
            _this = _super.call(this, tag) || this;
            _this.connTag = conn;
            _this.source = "server";
        }
        else {
            _this = _super.call(this, tag) || this;
            _this.connect();
            _this.source = "client";
        }
        return _this;
    }
    chromeClientMessage.prototype.connect = function () {
        var _this = this;
        this.connTag = Math.random();
        window.addEventListener('message', function (event) {
            if (event.data.tag == _this.tag && event.data.conn_tag == _this.connTag && event.data.source == "server") {
                _this.recvCallback && _this.recvCallback(event.data.msg);
            }
        });
    };
    chromeClientMessage.prototype.Send = function (msg) {
        window.postMessage({ tag: this.tag, conn_tag: this.connTag, msg: msg, source: this.source }, '*');
    };
    return chromeClientMessage;
}(msg));


/***/ }),

/***/ "./src/internal/utils/utils.ts":
/*!*************************************!*\
  !*** ./src/internal/utils/utils.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Sleep = exports.UntrustedClick = exports.boolToString = exports.toBool = exports.Noifications = exports.isPhone = exports.getImageBase64 = exports.protocolPrompt = exports.dealHotVersion = exports.substrex = exports.removeHTML = exports.removeHTMLTag = exports.post = exports.get = exports.createBtn = exports.randNumber = exports.RemoveInjected = exports.syncSetChromeStorageLocal = exports.syncGetChromeStorageLocal = exports.InjectedBySrc = exports.Injected = exports.HttpUtils = void 0;
var application_1 = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
var HttpUtils = /** @class */ (function () {
    function HttpUtils() {
    }
    HttpUtils.Request = function (info) {
        if (application_1.Application.App.IsBackend) {
            fetch(info.url, info).then(function (body) {
                if (info.json) {
                    return body.json();
                }
                else {
                    return body.text();
                }
            }).then(function (body) {
                info.success && info.success(body);
            }).catch(function () {
                info.error && info.error();
            });
            return;
        }
        HttpUtils.crossDomainRequest(info);
    };
    HttpUtils.errorCode = function (ret) {
        if (!ret.code) {
            return false;
        }
        switch (ret.code) {
            case -1: {
                application_1.Application.App.log.Info(ret.msg);
                break;
            }
            case -2: {
                application_1.Application.App.log.Warn(ret.msg);
                break;
            }
            case 1: {
                application_1.Application.App.log.Info(ret.msg);
                return false;
            }
            default: {
                return false;
            }
        }
        return true;
    };
    HttpUtils.crossDomainRequest = function (info) {
        if (window.hasOwnProperty('GM_xmlhttpRequest')) {
            //兼容油猴
            info.data = info.body;
            info.onreadystatechange = function (response) {
                if (response.readyState == 4) {
                    if (response.status == 200) {
                        if (info.json) {
                            var ret = JSON.parse(response.responseText);
                            if (HttpUtils.errorCode(ret)) {
                                info.error && info.error();
                                return;
                            }
                            info.success && info.success(ret);
                        }
                        else {
                            info.success && info.success(response.responseText);
                        }
                    }
                    else {
                        info.error && info.error();
                    }
                }
            };
            window.GM_xmlhttpRequest(info);
        }
        else {
            var client = application_1.Application.App.Client;
            client.Recv(function (data) {
                if (data.code == 0) {
                    if (info.json) {
                        if (HttpUtils.errorCode(data.body)) {
                            info.error && info.error();
                            return;
                        }
                    }
                    info.success && info.success(data.body);
                }
                else {
                    info.error && info.error();
                }
            });
            client.Send({
                type: "GM_xmlhttpRequest", info: {
                    url: info.url,
                    method: info.method,
                    json: info.json,
                    body: info.body,
                    headers: info.headers,
                }
            });
        }
    };
    HttpUtils.HttpGet = function (url, info) {
        info.url = url;
        this.Request(info);
    };
    HttpUtils.HttpPost = function (url, body, info) {
        info.url = url;
        info.body = body;
        if (!info.headers) {
            info.headers = {};
        }
        if (!info.headers["Content-Type"]) {
            info.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        info.method = "POST";
        this.Request(info);
    };
    HttpUtils.SendRequest = function (client, data) {
        if (!data.info) {
            return;
        }
        var info = data.info;
        if (application_1.Application.App.IsBackend) {
            info.success = function (body) {
                client.Send({ body: body, code: 0 });
            };
            info.error = function () {
                client.Send({ code: -1 });
            };
            HttpUtils.Request(info);
        }
        else {
            // content 做转发
            var extClient = application_1.Application.App.Client;
            extClient.Send({ type: "GM_xmlhttpRequest", info: info });
            extClient.Recv(function (data) {
                client.Send(data);
            });
        }
    };
    return HttpUtils;
}());
exports.HttpUtils = HttpUtils;
/**
 * 通过源码注入js资源
 * @param doc
 * @param url
 * @constructor
 */
function Injected(doc, source) {
    var temp = doc.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.innerHTML = source;
    temp.className = "injected-js";
    doc.documentElement.appendChild(temp);
    return temp;
}
exports.Injected = Injected;
/**
 * 通过源码注入js资源
 * @param doc
 * @param url
 * @constructor
 */
function InjectedBySrc(doc, source) {
    var temp = doc.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.src = source;
    temp.className = "injected-js";
    doc.documentElement.appendChild(temp);
    return temp;
}
exports.InjectedBySrc = InjectedBySrc;
function syncGetChromeStorageLocal(key) {
    return new Promise(function (resolve) { return (chrome.storage.local.get(key, function (value) {
        resolve(value[key]);
    })); });
}
exports.syncGetChromeStorageLocal = syncGetChromeStorageLocal;
function syncSetChromeStorageLocal(key, value) {
    var tmp = {};
    tmp[key] = value;
    return new Promise(function (resolve) { return (chrome.storage.local.set(tmp, function () {
        resolve();
    })); });
}
exports.syncSetChromeStorageLocal = syncSetChromeStorageLocal;
/**
 * 移除注入js
 * @param doc
 */
function RemoveInjected(doc) {
    var resource = doc.getElementsByClassName("injected-js");
    for (var i = 0; i < resource.length; i++) {
        resource[i].remove();
    }
}
exports.RemoveInjected = RemoveInjected;
function randNumber(minNum, maxNum) {
    return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
}
exports.randNumber = randNumber;
/**
 * 创建一个按钮
 * @param title
 * @param description
 * @param id
 */
function createBtn(title, description, className, id) {
    if (description === void 0) { description = ""; }
    if (className === void 0) { className = ""; }
    if (id === void 0) { id = ""; }
    var btn = document.createElement('button');
    btn.innerText = title;
    btn.id = id;
    btn.title = description;
    btn.className = className;
    return btn;
}
exports.createBtn = createBtn;
/**
 * get请求
 * @param {*} url
 */
function get(url, success) {
    var xmlhttp = createRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                success && success(this.responseText, this.resource);
            }
            else {
                xmlhttp.errorCallback && xmlhttp.errorCallback(this);
            }
        }
    };
    xmlhttp.send();
    return xmlhttp;
}
exports.get = get;
/**
 * post请求
 * @param {*} url
 * @param {*} data
 * @param {*} json
 */
function post(url, data, json, success) {
    if (json === void 0) { json = true; }
    var xmlhttp = createRequest();
    xmlhttp.open("POST", url, true);
    if (json) {
        xmlhttp.setRequestHeader("Content-Type", "application/json");
    }
    else {
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                success && success(this.responseText);
            }
            else {
                xmlhttp.errorCallback && xmlhttp.errorCallback(this);
            }
        }
    };
    xmlhttp.send(data);
    return xmlhttp;
}
exports.post = post;
/**
 * 创建http请求
 */
function createRequest() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.error = function (callback) {
        xmlhttp.errorCallback = callback;
        return xmlhttp;
    };
    xmlhttp.withCredentials = true;
    return xmlhttp;
}
// 移除html tag
function removeHTMLTag(html) {
    var revHtml = /<.*?>/g;
    html = html.replace(revHtml, '');
    html = html.replace(/(^\s+)|(\s+$)/g, '');
    return html;
}
exports.removeHTMLTag = removeHTMLTag;
/**
 * 去除html标签和处理中文
 * @param {string} html
 */
function removeHTML(html) {
    //先处理带src和href属性的标签
    var srcReplace = /<img.*?src="(.*?)".*?>/g;
    html = html.replace(srcReplace, '$1');
    srcReplace = /(<iframe.+?>)\s+?(<\/iframe>)/g;
    html = html.replace(srcReplace, '$1$2');
    srcReplace = /<(iframe|a).*?(src|href)="(.*?)".*?>(.*?)<\/(iframe|a)>/g;
    html = html.replace(srcReplace, '$3$4');
    var revHtml = /<.*?>/g;
    html = html.replace(revHtml, '');
    html = html.replace(/(^\s+)|(\s+$)/g, '');
    html = dealSymbol(html);
    return html.replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, "\"").replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<").replace(/&amp;/g, '&').trim();
}
exports.removeHTML = removeHTML;
/**
 * 处理符号
 * @param topic
 */
function dealSymbol(topic) {
    topic = topic.replace(/，/g, ',');
    topic = topic.replace(/（/g, '(');
    topic = topic.replace(/）/g, ')');
    topic = topic.replace(/？/g, '?');
    topic = topic.replace(/：/g, ':');
    topic = topic.replace(/。/g, '.');
    topic = topic.replace(/[“”]/g, '"');
    return topic;
}
/**
 * 取中间文本
 * @param str
 * @param left
 * @param right
 */
function substrex(str, left, right) {
    var leftPos = str.indexOf(left) + left.length;
    var rightPos = str.indexOf(right, leftPos);
    return str.substring(leftPos, rightPos);
}
exports.substrex = substrex;
function dealHotVersion(hotversion) {
    hotversion = hotversion.substring(0, hotversion.indexOf(".") + 1) + hotversion.substring(hotversion.indexOf(".") + 1).replace(".", "");
    return Number(hotversion);
}
exports.dealHotVersion = dealHotVersion;
function protocolPrompt(content, key, keyword) {
    keyword = keyword || "yes";
    if (localStorage[key] == undefined || localStorage[key] != 1) {
        var msg = prompt(content + "\n如果以后不想再弹出本对话框并且同意请在下方填写\"" + keyword + "\"");
        if (msg === null)
            return false;
        if (keyword != msg) {
            return false;
        }
        localStorage[key] = 1;
    }
    return true;
}
exports.protocolPrompt = protocolPrompt;
function getImageBase64(img, ext) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/" + ext, 0.75); //节省可怜的流量>_<,虽然好像没有啥
    canvas = null;
    return dataURL;
}
exports.getImageBase64 = getImageBase64;
function isPhone() {
    return /Android|iPhone/i.test(navigator.userAgent);
}
exports.isPhone = isPhone;
function Noifications(details) {
    if (window.hasOwnProperty("GM_notification")) {
        window.GM_notification(details);
    }
    else {
        var client = application_1.Application.App.Client;
        client.Send({
            type: "GM_notification", details: details,
        });
        application_1.Application.App.Client.Send(details);
    }
}
exports.Noifications = Noifications;
function toBool(val) {
    if (typeof val == "boolean") {
        return val;
    }
    return val == "true";
}
exports.toBool = toBool;
function boolToString(val) {
    if (val) {
        return "true";
    }
    return "false";
}
exports.boolToString = boolToString;
function UntrustedClick(el) {
    if (CAT_click != undefined) {
        CAT_click(el);
        return true;
    }
    var untrusted = new MouseEvent("click", { "clientX": 10086 });
    if (!untrusted.isTrusted) {
        application_1.Application.App.log.Warn("扩展执行错误");
        return false;
    }
    return el.dispatchEvent(untrusted);
}
exports.UntrustedClick = UntrustedClick;
function Sleep(timeout) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(undefined);
        }, timeout);
    });
}
exports.Sleep = Sleep;


/***/ }),

/***/ "./src/mooc/chaoxing/utils.ts":
/*!************************************!*\
  !*** ./src/mooc/chaoxing/utils.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNoteLine = exports.CssBtn = void 0;
/**
 * 美化按钮
 */
function CssBtn(btn) {
    btn.style.outline = 'none';
    btn.style.border = '0';
    btn.style.background = '#7d9d35';
    btn.style.color = '#fff';
    btn.style.borderRadius = '4px';
    btn.style.padding = '2px 8px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '12px';
    btn.style.marginLeft = '4px';
    btn.onmousemove = function () {
        btn.style.boxShadow = '1px 1px 1px 1px #ccc';
    };
    btn.onmouseout = function () {
        btn.style.boxShadow = '';
    };
    return btn;
}
exports.CssBtn = CssBtn;
function CreateNoteLine(text, label, append, after) {
    var p = document.createElement("p");
    p.style.color = "red";
    p.style.fontSize = "14px";
    p.className = "prompt-line-" + label;
    p.innerHTML = text;
    if (append != undefined) {
        append.append(p);
    }
    if (after != undefined) {
        after.after(p);
    }
    return p;
}
exports.CreateNoteLine = CreateNoteLine;


/***/ }),

/***/ "./src/mooc/course163/course163.ts":
/*!*****************************************!*\
  !*** ./src/mooc/course163/course163.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course163 = void 0;
var hook_1 = __webpack_require__(/*! @App/internal/utils/hook */ "./src/internal/utils/hook.ts");
__webpack_require__(/*! ../../views/common */ "./src/views/common.ts");
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var task_1 = __webpack_require__(/*! @App/mooc/course163/task */ "./src/mooc/course163/task.ts");
var utils_1 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
var Course163 = /** @class */ (function () {
    function Course163() {
    }
    Course163.prototype.Init = function () {
        this.hookAjax();
    };
    Course163.prototype.hookAjax = function () {
        var _this = this;
        hook_1.Hook.HookAjaxRespond(["CourseBean.getLessonUnitLearnVo.dwr", "MocQuizBean.getQuizPaperDto.dwr", "PostBean.getPaginationReplys.dwr"], function (url, resp) {
            var task = task_1.TaskFactory.CreateTask(url, resp);
            if (task) {
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, autonext;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                clearInterval(this.delayTimer);
                                _a = this.lastTask;
                                if (!_a) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.lastTask.Stop()];
                            case 1:
                                _a = (_b.sent());
                                _b.label = 2;
                            case 2:
                                _a;
                                this.lastTask = task;
                                this.lastTask.addEventListener("complete", function () {
                                    _this.delay(function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.lastTask.Submit()];
                                                case 1:
                                                    _a.sent();
                                                    this.nextTask();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                });
                                return [4 /*yield*/, this.lastTask.Init()];
                            case 3:
                                _b.sent();
                                if (!application_1.Application.App.config.auto) return [3 /*break*/, 5];
                                autonext = document.querySelector(".j-autoNext");
                                if (autonext && autonext.checked) {
                                    utils_1.UntrustedClick(autonext);
                                }
                                return [4 /*yield*/, this.lastTask.Start()];
                            case 4:
                                _b.sent();
                                _b.label = 5;
                            case 5: return [2 /*return*/];
                        }
                    });
                }); }, 0);
            }
            return resp;
        });
        hook_1.Hook.HookAjaxRespond("MocQuizBean.fetchQuestions", function (url, resp) {
            if (resp.indexOf("{questions:s0}") > 0) {
                resp = resp.replace("{questions:s0}", "{questions:{}}");
            }
            return resp;
        });
    };
    Course163.prototype.nextTask = function () {
        var _this = this;
        var unit = document.querySelectorAll(".j-unitslist.unitslist.f-cb > .f-fl");
        var ret = this.next(unit, function (el) {
            return el.className.indexOf("current") > 0;
        });
        if (ret) {
            return utils_1.UntrustedClick(ret);
        }
        //二级
        var tmp = function (type) {
            var now = document.querySelector(".f-fl.j-" + type + " .up.j-up.f-thide");
            var all = document.querySelectorAll(".f-fl.j-" + type + " .f-bg.j-list > .f-thide");
            return _this.next(all, function (el) {
                //什么魔鬼,空格不同
                return el.innerText.replace(/\s/g, "") == now.innerText.replace(/\s/g, "");
            });
        };
        ret = tmp("lesson");
        if (ret) {
            return utils_1.UntrustedClick(ret);
        }
        //顶层
        ret = tmp("chapter");
        if (ret) {
            utils_1.UntrustedClick(ret);
            var all = document.querySelectorAll(".f-fl.j-lesson .f-bg.j-list > .f-thide");
            return utils_1.UntrustedClick(all[0]);
        }
        application_1.Application.App.log.Warn("任务结束了");
        return alert("任务结束了");
    };
    Course163.prototype.next = function (all, ok) {
        var flag = false;
        for (var i = 0; i < all.length; i++) {
            if (ok(all[i])) {
                flag = true;
            }
            else if (flag) {
                return all[i];
            }
        }
        return null;
    };
    Course163.prototype.delay = function (func) {
        var interval = application_1.Application.App.config.interval;
        application_1.Application.App.log.Info(interval + "分钟后自动切换下一个任务点");
        this.delayTimer = setTimeout(function () {
            application_1.Application.App.config.auto && func();
        }, interval * 60000);
    };
    return Course163;
}());
exports.Course163 = Course163;


/***/ }),

/***/ "./src/mooc/course163/platform.ts":
/*!****************************************!*\
  !*** ./src/mooc/course163/platform.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Course163Platform = void 0;
var course163_1 = __webpack_require__(/*! ./course163 */ "./src/mooc/course163/course163.ts");
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var Course163Platform = /** @class */ (function () {
    function Course163Platform() {
    }
    Course163Platform.prototype.CreateMooc = function () {
        if (document.URL.indexOf("www.icourse163.org") > 0) {
            application_1.Application.App.config.SetNamespace("mooc163");
            return new course163_1.Course163();
        }
        return null;
    };
    return Course163Platform;
}());
exports.Course163Platform = Course163Platform;


/***/ }),

/***/ "./src/mooc/course163/question.ts":
/*!****************************************!*\
  !*** ./src/mooc/course163/question.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseTopic = exports.CourseQueryAnswer = void 0;
var topic_1 = __webpack_require__(/*! @App/internal/app/topic */ "./src/internal/app/topic.ts");
var question_1 = __webpack_require__(/*! @App/internal/app/question */ "./src/internal/app/question.ts");
var utils_1 = __webpack_require__(/*! ../chaoxing/utils */ "./src/mooc/chaoxing/utils.ts");
var utils_2 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var CourseQueryAnswer = /** @class */ (function () {
    function CourseQueryAnswer() {
    }
    CourseQueryAnswer.prototype.QueryQuestions = function () {
        var _this = this;
        var ret = new Array();
        var timu = document.querySelectorAll(".u-questionItem");
        timu.forEach(function (val) {
            ret.push(_this.createQuestion(val));
        });
        return ret;
    };
    CourseQueryAnswer.prototype.createQuestion = function (el) {
        if (el.querySelector(".optionCnt span.u-icon-correct")) {
            return new JudgeQuestion(el, 3);
        }
        else if (el.querySelector("input[type='radio']") != null) {
            return new CourseQuestion(el, 1);
        }
        else if (el.querySelector("input[type='checkbox']") != null) {
            return new CourseQuestion(el, 2);
        }
        else if (el.querySelector("textarea") != null) {
            return new FillQuestion(el, 4);
        }
        return new CourseQuestion(el, -1);
    };
    return CourseQueryAnswer;
}());
exports.CourseQueryAnswer = CourseQueryAnswer;
//TODO:优化
var CourseQuestion = /** @class */ (function () {
    function CourseQuestion(el, type) {
        this.el = el;
        this.type = type;
        this.RemoveNotice();
    }
    CourseQuestion.prototype.GetType = function () {
        return this.type;
    };
    CourseQuestion.prototype.GetTopic = function () {
        return this.dealImgDomain(this.el.querySelector(".f-richEditorText.j-richTxt").innerHTML);
    };
    CourseQuestion.prototype.RemoveNotice = function () {
        this.el.querySelectorAll(".prompt-line-answer").forEach(function (v) {
            v.remove();
        });
    };
    CourseQuestion.prototype.AddNotice = function (str) {
        utils_1.CreateNoteLine(str, "answer", this.el);
    };
    CourseQuestion.prototype.SetStatus = function (status) {
        this.AddNotice(question_1.TopicStatusString(status));
    };
    CourseQuestion.prototype.getContent = function (el) {
        return el.querySelector(".f-fl.optionCnt").innerHTML;
    };
    CourseQuestion.prototype.getOption = function (el) {
        return el.querySelector(".f-fl.optionPos").innerHTML.substring(0, 1);
    };
    CourseQuestion.prototype.fill = function (el, content) {
        if (!el.parentElement.querySelector("input").checked) {
            utils_2.UntrustedClick(el.parentElement.querySelector("input"));
        }
        content = content.replace(/style=".*?"/, "");
        content = content.replace(/(<p>|<\/p>)/, "");
        this.AddNotice(this.getOption(el) + ":" + content);
    };
    CourseQuestion.prototype.Random = function () {
        var opts = this.options();
        var pos = utils_2.randNumber(0, opts.length - 1);
        this.fill(opts[pos], this.getContent(opts[pos - 1]));
        return "random";
    };
    CourseQuestion.prototype.options = function () {
        return this.el.querySelectorAll(".u-tbl.f-pr.f-cb");
    };
    CourseQuestion.prototype.dealImgDomain = function (content) {
        //移除域名对比,也不知道还有没有花里胡哨的
        content = content.replace(/"http(s|):\/\/edu-image.nosdn.127.net\/(.*?)"/, "\"http://nos.netease.com/edu-image/$2\"");
        content = content.replace(/"http(s|):\/\/(.*?)\//g, "\"");
        return content;
    };
    CourseQuestion.prototype.Fill = function (answer) {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var options, flag, i, n;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = this.options();
                        flag = false;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < answer.correct.length)) return [3 /*break*/, 7];
                        n = 0;
                        _a.label = 2;
                    case 2:
                        if (!(n < options.length)) return [3 /*break*/, 6];
                        if (!answer.Equal(this.dealImgDomain(this.getContent(options[n])), this.dealImgDomain(answer.correct[i].content))) return [3 /*break*/, 5];
                        this.fill(options[n], answer.correct[i].content);
                        if (!(this.GetType() == 2 && i != answer.correct.length - 1)) return [3 /*break*/, 4];
                        //多选
                        return [4 /*yield*/, utils_2.Sleep(application_1.Application.App.config.topic_interval * 1000)];
                    case 3:
                        //多选
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        flag = true;
                        _a.label = 5;
                    case 5:
                        n++;
                        return [3 /*break*/, 2];
                    case 6:
                        i++;
                        return [3 /*break*/, 1];
                    case 7:
                        if (flag) {
                            return [2 /*return*/, resolve("ok")];
                        }
                        return [2 /*return*/, resolve("no_match")];
                }
            });
        }); });
    };
    CourseQuestion.prototype.Correct = function () {
        return null;
    };
    return CourseQuestion;
}());
var FillQuestion = /** @class */ (function (_super) {
    __extends(FillQuestion, _super);
    function FillQuestion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FillQuestion.prototype.Random = function () {
        return "no_support_random";
    };
    FillQuestion.prototype.Fill = function (answer) {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var el, match;
            return __generator(this, function (_a) {
                el = this.el.querySelector("textarea");
                el.focus();
                if (match = answer.correct[0].content.match(/^[\(\[]([\d\.]+),([\d\.]+)[\)\]]$/)) {
                    //范围题
                    el.value = ((parseFloat(match[1]) + parseFloat(match[2])) / 2).toString();
                    this.AddNotice("填空 取值范围:" + answer.correct[0].content);
                }
                else {
                    el.value = answer.correct[0].content.split("##%_YZPRLFH_%##")[0];
                    this.AddNotice("填空:" + answer.correct[0].content.replace("##%_YZPRLFH_%##", " 或 "));
                }
                return [2 /*return*/, resolve("ok")];
            });
        }); });
    };
    return FillQuestion;
}(CourseQuestion));
var JudgeQuestion = /** @class */ (function (_super) {
    __extends(JudgeQuestion, _super);
    function JudgeQuestion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JudgeQuestion.prototype.Fill = function (answer) {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var el;
            return __generator(this, function (_a) {
                if (answer.correct[0].content) {
                    el = this.el.querySelector(".u-tbl.f-pr.f-cb .u-icon-correct").parentElement.parentElement;
                }
                else {
                    el = this.el.querySelector(".u-tbl.f-pr.f-cb .u-icon-wrong").parentElement.parentElement;
                }
                this.fill(el, this.getContent(el));
                return [2 /*return*/, resolve("ok")];
            });
        }); });
    };
    return JudgeQuestion;
}(CourseQuestion));
var CourseTopic = /** @class */ (function (_super) {
    __extends(CourseTopic, _super);
    function CourseTopic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CourseTopic.prototype.Init = function () {
        return null;
    };
    CourseTopic.prototype.Submit = function () {
        return null;
    };
    return CourseTopic;
}(topic_1.Topic));
exports.CourseTopic = CourseTopic;


/***/ }),

/***/ "./src/mooc/course163/task.ts":
/*!************************************!*\
  !*** ./src/mooc/course163/task.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscussTask = exports.CourseTopicTask = exports.VideoTask = exports.NoSupportTask = exports.TaskFactory = void 0;
var task_1 = __webpack_require__(/*! @App/internal/app/task */ "./src/internal/app/task.ts");
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var utils_1 = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
var question_1 = __webpack_require__(/*! @App/mooc/course163/question */ "./src/mooc/course163/question.ts");
var question_2 = __webpack_require__(/*! @App/internal/app/question */ "./src/internal/app/question.ts");
var TaskFactory = /** @class */ (function () {
    function TaskFactory() {
    }
    TaskFactory.CreateTask = function (url, resp) {
        if (resp.indexOf("paper:s") > 0) {
            CourseTopicTask.collegeAnswer(this.getvalue(resp, resp.match(/,paper:(.*?),/)[1]));
            return new CourseTopicTask();
        }
        else if (resp.indexOf("tname:\"") > 0) {
            if (resp.indexOf("answers:s") > 0) {
                CourseTopicTask.collegeAnswer(this.getvalue(resp, resp.match(/,objectiveQList:(.*?),/)[1]));
            }
            return new CourseTopicTask(resp);
        }
        else if (resp.indexOf("videoVo:s") > 0) {
            return new VideoTask();
        }
        else if (resp.indexOf("list:s") > 0 && url.indexOf("PostBean.getPaginationReplys") > 0) {
            return new DiscussTask(this.getvalue(resp, resp.match(/,list:(.*?),/)[1]));
        }
        else if (resp.indexOf(",post:s") > 0) {
            return null;
        }
        return new NoSupportTask();
    };
    TaskFactory.getvalue = function (str, ret) {
        try {
            ret = ret || "s0";
            var script = str.match(/^([\s\S]+?)dwr.engine._remoteHandleCallback/)[1];
            script = "function a(){" + script + ";return " + ret + ";}a();";
            return eval(script);
        }
        catch (e) {
            application_1.Application.App.log.Error("获取题目发生了一个错误", e);
        }
        return null;
    };
    return TaskFactory;
}());
exports.TaskFactory = TaskFactory;
var NoSupportTask = /** @class */ (function (_super) {
    __extends(NoSupportTask, _super);
    function NoSupportTask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoSupportTask.prototype.Start = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve();
            application_1.Application.App.log.Info("暂不支持的类型,跳过");
            _this.callEvent("complete");
        });
    };
    NoSupportTask.prototype.Done = function () {
        return true;
    };
    NoSupportTask.prototype.Type = function () {
        return "other";
    };
    return NoSupportTask;
}(task_1.Task));
exports.NoSupportTask = NoSupportTask;
var VideoTask = /** @class */ (function (_super) {
    __extends(VideoTask, _super);
    function VideoTask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoTask.prototype.Init = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.timer = setInterval(function () {
                var video = document.querySelector("video[id]");
                if (video) {
                    clearInterval(_this.timer);
                    _this.video = video;
                    _this.video.addEventListener("loadstart", function () {
                        _this.initVideo();
                    });
                    _this.video.addEventListener("ended", function () {
                        _this.callEvent("complete");
                    });
                    _this.callEvent("load");
                    application_1.Application.App.log.Debug("视频加载完成");
                    resolve();
                }
            }, 500);
        });
    };
    VideoTask.prototype.Done = function () {
        return false;
    };
    VideoTask.prototype.Stop = function () {
        var _this = this;
        return new Promise(function (resolve) {
            clearInterval(_this.timer);
            _this.callEvent("stop");
            resolve();
        });
    };
    VideoTask.prototype.initVideo = function () {
        this.video.muted = application_1.Application.App.config.video_mute;
        if (application_1.Application.App.config.video_multiple > 1) {
            this.video.playbackRate = application_1.Application.App.config.video_multiple;
        }
    };
    VideoTask.prototype.Start = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.initVideo();
            _this.video.play();
            _this.timer = setInterval(function () {
                application_1.Application.App.config.auto && _this.video.paused && _this.video.play();
            }, 5000);
            resolve();
        });
    };
    VideoTask.prototype.Type = function () {
        return "video";
    };
    return VideoTask;
}(task_1.Task));
exports.VideoTask = VideoTask;
var CourseTopicTask = /** @class */ (function (_super) {
    __extends(CourseTopicTask, _super);
    function CourseTopicTask(resp) {
        var _this = _super.call(this) || this;
        var info = "";
        if (resp) {
            info = utils_1.substrex(resp, ",{aid:", ",");
        }
        var prefix = "";
        if (document.URL.indexOf("cid") > 0) {
            prefix = "c-";
        }
        _this.bank = new question_2.ToolsQuestionBankFacade("mooc163", {
            refer: document.URL,
            id: prefix + CourseTopicTask.getid(),
            info: info,
        });
        if (resp) {
            _this.bank.CheckCourse();
        }
        return _this;
    }
    CourseTopicTask.getid = function () {
        var id = document.URL.match(/(\?id|cid)=(.*?)($|&)/);
        if (!id) {
            id = document.URL.match(/(&id)=(.*?)$/);
        }
        if (!id) {
            return "";
        }
        return id[2];
    };
    CourseTopicTask.collegeAnswer = function (resp) {
        var id = this.getid();
        if (id == "") {
            return;
        }
        var prefix = "";
        if (document.URL.indexOf("cid") > 0) {
            prefix = "c-";
        }
        var bank = new question_2.ToolsQuestionBank("mooc163", {
            refer: document.URL,
            id: prefix + id,
        });
        var answer = new Array();
        var options;
        options = resp.objectiveQList;
        if (options == undefined) {
            options = resp;
        }
        if (options == undefined) {
            return;
        }
        //TODO:优化,太难看了
        for (var i = 0; i < options.length; i++) {
            var topic = options[i];
            if (topic.type != 1 && topic.type != 2) {
                if (topic.type == 3) {
                    var tmpAnswer_1 = new question_2.PushAnswer();
                    tmpAnswer_1.topic = topic.title;
                    tmpAnswer_1.type = 4;
                    tmpAnswer_1.correct = new Array();
                    if (!topic.stdAnswer) {
                        continue;
                    }
                    tmpAnswer_1.correct.push({
                        option: "一", content: topic.stdAnswer,
                    });
                    answer.push(tmpAnswer_1);
                }
                else if (topic.type == 4) {
                    var tmpAnswer_2 = new question_2.PushAnswer();
                    tmpAnswer_2.topic = topic.title;
                    tmpAnswer_2.type = 3;
                    tmpAnswer_2.correct = new Array();
                    if (!topic.optionDtos) {
                        continue;
                    }
                    for (var n = 0; n < topic.optionDtos.length; n++) {
                        if (topic.optionDtos[n].answer) {
                            tmpAnswer_2.correct.push({
                                option: "正确" == topic.optionDtos[n].content,
                                content: "正确" == topic.optionDtos[n].content,
                            });
                            break;
                        }
                    }
                    answer.push(tmpAnswer_2);
                }
                continue;
            }
            if (!topic.optionDtos) {
                continue;
            }
            var option = new Array();
            var correct = new Array();
            var tmpAnswer = new question_2.PushAnswer();
            tmpAnswer.topic = topic.title;
            tmpAnswer.type = topic.type;
            for (var i_1 = 0; i_1 < topic.optionDtos.length; i_1++) {
                var opt = { content: topic.optionDtos[i_1].content, option: String.fromCharCode(65 + i_1) };
                if (topic.optionDtos[i_1].answer) {
                    correct.push(opt);
                }
                option.push(opt);
            }
            if (correct.length <= 0) {
                return;
            }
            tmpAnswer.correct = correct;
            tmpAnswer.answers = option;
            answer.push(tmpAnswer);
        }
        bank.Push(answer);
    };
    CourseTopicTask.prototype.Init = function () {
        var _this = this;
        return new Promise(function (resolve) {
            setTimeout(function () {
                if (document.querySelector("#tools-search")) {
                    document.querySelector("#tools-search").remove();
                }
                var search = utils_1.createBtn("搜索答案", "点击搜索答案", "cx-btn mooc163-search", "tools-search");
                var divel = document.querySelector(".j-unitct .m-learnunitUI");
                if (!divel) {
                    divel = document.querySelector(".u-learn-moduletitle");
                }
                _this.topic = new question_1.CourseTopic(document, _this.bank);
                _this.topic.SetQueryQuestions(new question_1.CourseQueryAnswer());
                search.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
                    var ret;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                search.innerText = "搜索中...";
                                return [4 /*yield*/, this.Start()];
                            case 1:
                                ret = _a.sent();
                                search.innerText = question_2.QuestionStatusString(ret);
                                return [2 /*return*/];
                        }
                    });
                }); };
                divel.insertBefore(search, divel.firstChild);
                resolve();
            }, 1000);
        });
    };
    CourseTopicTask.prototype.Done = function () {
        return false;
    };
    CourseTopicTask.prototype.Type = function () {
        return "topic";
    };
    CourseTopicTask.prototype.Start = function () {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utils_1.protocolPrompt("你正准备使用中国慕课的答题功能,相应的我们需要你的正确答案,同意之后扩展将自动检索你的所有答案\n* 本项选择不会影响你的正常使用(协议当前版本有效)\n* 手动点击答题结果页面自动采集页面答案\n", "course_answer_collect_v2", "我同意");
                        return [4 /*yield*/, this.topic.QueryAnswer()];
                    case 1:
                        ret = _a.sent();
                        this.callEvent("complete");
                        resolve(ret);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    CourseTopicTask.prototype.Submit = function () {
        return new Promise(function (resolve) {
            var el = document.querySelector(".submit.j-submit");
            if (el.style.display == "none") {
                resolve();
            }
            utils_1.UntrustedClick(el);
            var t = setInterval(function () {
                var el = document.querySelector(".submit.j-replay");
                if (el && el.style.display != "none") {
                    clearInterval(t);
                    resolve();
                }
            }, 1000);
        });
    };
    return CourseTopicTask;
}(task_1.Task));
exports.CourseTopicTask = CourseTopicTask;
var DiscussTask = /** @class */ (function (_super) {
    __extends(DiscussTask, _super);
    function DiscussTask(resp) {
        var _this = _super.call(this) || this;
        _this.list = resp;
        return _this;
    }
    DiscussTask.prototype.isRepeat = function () {
        return document.querySelector("a.unfollowed") == undefined;
    };
    DiscussTask.prototype.Start = function () {
        var _this = this;
        if (!this.list && this.list.lenght <= 0) {
            application_1.Application.App.log.Info("没有查询到记录,跳过");
            this.callEvent("complete");
            return;
        }
        if (this.isRepeat()) {
            application_1.Application.App.log.Info("已经关注,跳过");
            this.callEvent("complete");
            return;
        }
        application_1.Application.App.log.Info("复读机开启,准备复读(回复当前本讨论)");
        return new Promise(function (resolve) {
            var num = 0;
            var timer = setInterval(function () {
                try {
                    var rand = _this.list[utils_1.randNumber(0, _this.list.length - 1)];
                    var el = document.querySelector("iframe[id*=ueditor_]");
                    application_1.Application.GlobalContext.UE.instants["ueditorInstant" + el.id.substr(el.id.indexOf("_") + 1)].setContent(rand.content);
                }
                catch (e) {
                    if (num < 5) {
                        return;
                    }
                    application_1.Application.App.log.Error("发生了错误,准备跳过", e);
                }
                clearInterval(timer);
                _this.callEvent("complete");
                resolve();
            }, 1000);
        });
    };
    DiscussTask.prototype.Done = function () {
        return false;
    };
    DiscussTask.prototype.Type = function () {
        return "other";
    };
    DiscussTask.prototype.Submit = function () {
        if (this.isRepeat()) {
            return;
        }
        return new Promise(function (resolve) {
            application_1.Application.App.log.Info("准备提交");
            var el = document.querySelector(".u-btn-sm.u-btn-primary");
            if (!el) {
                return resolve();
            }
            utils_1.UntrustedClick(el);
            setTimeout(function () {
                resolve();
            }, 2000);
        });
    };
    return DiscussTask;
}(task_1.Task));
exports.DiscussTask = DiscussTask;


/***/ }),

/***/ "./src/mooc/mooc.ts":
/*!**************************!*\
  !*** ./src/mooc/mooc.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mooc = void 0;
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var mooc = /** @class */ (function () {
    function mooc(moocFactory) {
        // 防止taskComplete和reload冲突
        this.once = false;
        this.moocFactory = moocFactory;
    }
    mooc.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state, mooc_1, e_1, isShow_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        state = document.readyState;
                        application_1.Application.App.log.Debug("Start document state:", state);
                        mooc_1 = this.moocFactory.CreateMooc();
                        if (!(mooc_1 != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, mooc_1.Init()];
                    case 1:
                        _a.sent();
                        // MoocTaskSet接口判断,接管流程
                        if (mooc_1.Next != undefined) {
                            this.runMoocTask(mooc_1);
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        application_1.Application.App.log.Fatal("扩展发生了一个致命错误:", e_1);
                        return [3 /*break*/, 4];
                    case 4:
                        //最小化警告
                        if (top == self) {
                            isShow_1 = false;
                            document.addEventListener("visibilitychange", function () {
                                if (document.hidden) {
                                    if (isShow_1) {
                                        return;
                                    }
                                    application_1.Application.App.log.Warn("请注意!最小化可能导致视频无法正常播放!允许切换窗口.");
                                    isShow_1 = true;
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    mooc.prototype.runMoocTask = function (moocTask) {
        var _this = this;
        moocTask.addEventListener("reload", function () {
            if (application_1.Application.App.config.auto) {
                _this.runTask(moocTask);
            }
            clearTimeout(_this.timer);
        });
        moocTask.addEventListener("complete", function () {
            application_1.Application.App.log.Warn("任务完成了");
            alert("任务完成了");
        });
        moocTask.addEventListener("taskComplete", function (index, task) {
            moocTask.SetTaskPointer(index + 1);
            if (!application_1.Application.App.config.auto) {
                return;
            }
            var interval = application_1.Application.App.config.interval;
            application_1.Application.App.log.Info(interval + "分钟后自动切换下一个任务点");
            _this.timer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, task.Submit()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.runTask(moocTask)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, interval * 60000);
        });
        moocTask.addEventListener("error", function (msg) {
            application_1.Application.App.log.Fatal(msg);
            alert(msg);
        });
    };
    mooc.prototype.runTask = function (moocTask) {
        return __awaiter(this, void 0, void 0, function () {
            var task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.once) {
                            return [2 /*return*/];
                        }
                        this.once = true;
                        return [4 /*yield*/, moocTask.Next()];
                    case 1:
                        task = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(task != null)) return [3 /*break*/, 9];
                        if (!task.Done()) return [3 /*break*/, 4];
                        return [4 /*yield*/, moocTask.Next()];
                    case 3:
                        task = _a.sent();
                        return [3 /*break*/, 2];
                    case 4:
                        if (!(application_1.Application.App.config.answer_ignore && task.Type() == "topic")) return [3 /*break*/, 6];
                        return [4 /*yield*/, moocTask.Next()];
                    case 5:
                        task = _a.sent();
                        return [3 /*break*/, 2];
                    case 6:
                        if (!application_1.Application.App.config.auto) return [3 /*break*/, 8];
                        return [4 /*yield*/, task.Start()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        this.nowTask = task;
                        return [3 /*break*/, 9];
                    case 9:
                        this.once = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    return mooc;
}());
exports.mooc = mooc;


/***/ }),

/***/ "./src/tampermonkey/course163-pack.ts":
/*!********************************************!*\
  !*** ./src/tampermonkey/course163-pack.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __webpack_require__(/*! @App/internal/utils/config */ "./src/internal/utils/config.ts");
var log_1 = __webpack_require__(/*! @App/internal/utils/log */ "./src/internal/utils/log.ts");
var application_1 = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
var mooc_1 = __webpack_require__(/*! @App/mooc/mooc */ "./src/mooc/mooc.ts");
var platform_1 = __webpack_require__(/*! @App/mooc/course163/platform */ "./src/mooc/course163/platform.ts");
var logger;
if (top == self) {
    logger = new log_1.PageLog();
}
else {
    logger = new log_1.ConsoleLog();
}
application_1.Application.GlobalContext = window.unsafeWindow;
var component = new Map().
    set("config", new config_1.ChromeConfigItems(config_1.NewFrontendGetConfig())).
    set("logger", logger);
var app = new application_1.Application(application_1.Frontend, new mooc_1.mooc(new platform_1.Course163Platform()), component);
app.run();


/***/ }),

/***/ "./src/views/common.ts":
/*!*****************************!*\
  !*** ./src/views/common.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

window.addEventListener("load", function () {
    var css = "\n@keyframes aniripple  \n{\n    0%{\n        width:0px;\n        height:0px;\n        opacity:0.4;\n    }\n    100%{\n        width:500px;\n        height:500px;\n        opacity:0;\n    }\n}  \n\n#cxtools {\n    position: absolute;\n    left: 250px;\n    top: 2px;\n    width: 210px;\n    font-size: 0;\n}\n\n.cx-btn {\n    outline: none;\n    border: 0;\n    background: #7d9d35;\n    color: #fff;\n    border-radius: 4px;\n    padding: 2px 8px;\n    cursor: pointer;\n    font-size: 12px;\n    margin-left: 4px;\n}\n\n.cx-btn:hover {\n    box-shadow: 1px 1px 1px 1px #ccc;\n}\n\n.zhs-tools-btn {\n    color: #fff;\n    background: #ff9d34;\n    padding: 4px;\n    display: inline-block;\n    height: 24px;\n    font-size: 14px;\n    line-height: 24px;\n    margin:0;\n    cursor:pointer;\n}\n.btn-ripple{\n    position:absolute;\n    background:#000;\n    pointer-events:none;\n    transform:translate(-50%,-50%);\n    border-radius:50%;\n    animation:aniripple 1s linear infinite;\n}\n\n.zhs-start-btn{\n    background: #36ac36;\n}\n\n.zhs-start-btn:hover{\n    background: #3b8d3b;\n}\n\n#zhs-ytbn {\n    color: #fff;\n    background: #e777ff;\n}\n\n#zhs-ytbn:hover {\n    background: #e7b7f1;\n}\n\n.zhs-search-answer {\n    border: 0;\n    outline: none;\n    padding: 4px;\n}\n\n.zhs-search-answer:hover {\n    opacity: .85;\n}\n\n.mooc163-search{\n    background-color: #60b900;\n    display: block;\n    margin: 0 auto;\n}\n\n.tools-logger-panel{\n    width: 360px;\n    height: auto;\n    max-height: 260px;\n    color:#000;\n    position: fixed;\n    margin: 0 auto;\n    display: block;\n    font-size: 14px;\n    border-radius: 4px;\n    width: 340px;\n    text-align: center;\n    overflow: hidden;\n    left:60px;\n    top: 40px;\n    z-index: 100000;\n    background: rgba(256, 256, 256, 0.3);\n    box-shadow: 0px 0px 5px #bbb;\n}\n\n.head {\n    width: 100%;\n    height: 30px;\n    padding: 4px;\n    box-sizing: border-box;\n    cursor: move;\n    transition-property: opacity, background-color;\n    transition: 200ms ease-in-out;\n}\n\n.head span{\n    color:#000;\n    float:left;\n    font-weight: 550;\n}\n\n.status {\n    color: #67C23A;\n    font-weight: 600;\n}\n\n.tools-notice-content {\n    width: 100%;\n    height: 220px;\n    border-top:0px;\n    overflow-y: scroll;\n    overflow-x: hidden;\n}\n\n.tools-notice-content .log {\n    height: auto;\n    width: auto;\n    text-align: center;\n    border: 1px solid #eee;\n    overflow: hidden;\n}\n\n.tools-notice-content .log p {\n    margin: 0;\n    color: #aaa;\n    font-size: 11px;\n    font-weight: 500;\n    font-family: Arial, Helvetica, sans-serif;\n    line-height: 26px;\n}\n\n/* \u6EDA\u52A8\u69FD */\n::-webkit-scrollbar {\n    width: 10px;\n    height: 10px;\n}\n\n::-webkit-scrollbar-track {\n    border-radius: 3px;\n    background: rgba(0, 0, 0, 0.06);\n    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);\n}\n\n/* \u6EDA\u52A8\u6761\u6ED1\u5757 */\n::-webkit-scrollbar-thumb {\n    border-radius: 3px;\n    background: rgba(0, 0, 0, 0.12);\n    -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);\n}\n\n/* \u590D\u9009\u6846 */\n.switch {\n    margin: 2px auto;\n    display: inline-flex;\n    align-items: center;\n    width: auto;\n}\n.checkbox-input {\n    display: none\n}\n.checkbox {\n    -webkit-transition: background-color 0.3s;\n    transition: background-color 0.3s;\n    background-color: #fff;\n    border: 1px solid #d7d7d7;\n    border-radius: 50px;\n    width: 16px;\n    height: 16px;\n    vertical-align:middle;\n    margin: 0 5px;\n}\n.checkbox-input:checked+.checkbox {\n    background-color: #409EFF;\n}\n.checkbox-input:checked+.checkbox:after {\n    // content: \"\u221A\";\n    display: inline-block;\n    height: 100%;\n    width: 100%;\n    color: #fff;\n    text-align: center;\n    line-height: 16px;\n    font-size: 12px;\n    box-shadow: 0 0 4px #409EFF;\n}\n\n.tools-logger-panel:hover,\n.tools-logger-panel:focus-within {\n    background: rgba(256, 256, 256, 0.7);\n}\n\n.tools-logger-panel .head:active {\n    background-color: #E5E5E5;\n}\n\n.tools-logger-panel > .close {\n    margin: 2px;\n}\n\n";
    var style = document.createElement("style");
    style.innerHTML = css;
    document.body.appendChild(style);
});


/***/ })

/******/ });
//# sourceMappingURL=tampermonkey-course163.js.map
