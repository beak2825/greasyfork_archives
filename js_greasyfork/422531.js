// ==UserScript==
// @name         智慧树小工具
// @namespace    https://github.com/CodFrm/cxmooc-tools
// @version 2.5.1
// @description  一个知到智慧树的小工具,火狐,谷歌,油猴支持.支持视频倍速秒过,屏蔽题目,测试题库(੧ᐛ੭挂科模式,启动)
// @author       CodFrm
// @run-at       document-start
// @match        *://study.zhihuishu.com/learning/videoList*
// @match        *://studyh5.zhihuishu.com/videoStudy.html*
// @match        *://examh5.zhihuishu.com/stuExamWeb.html*
// @match        *://onlineexamh5new.zhihuishu.com/stuExamWeb.html*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        unsafeWindow
// @license      MIT
// @supportURL   http://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=62
// @homepage     http://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=62
// @antifeature membership
// @antifeature ads
// @downloadURL https://update.greasyfork.org/scripts/422531/%E6%99%BA%E6%85%A7%E6%A0%91%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/422531/%E6%99%BA%E6%85%A7%E6%A0%91%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

let config = {
    auto: true, //全自动挂机,无需手动操作,即可自动观看视频等
    interval: 1, //时间间隔,当任务点完成后,会等待1分钟然后跳转到下一个任务点
    rand_answer: false, //随机答案,没有答案的题目将自动的生成一个答案
    video_multiple: 1, //视频播放倍速,视频播放的倍数,建议不要改动,为1即可,这是危险的功能
    video_mute: true, //视频静音,视频自动静音播放
    super_mode: true,//超级模式,让倍速成真
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/tampermonkey/zhihuishu-pack.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/*! exports provided: SystemConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SystemConfig", function() { return SystemConfig; });
var SystemConfig = /** @class */ (function () {
    function SystemConfig() {
    }
    SystemConfig.version = 2.4;
    SystemConfig.url = "https://cx.icodef.com/";
    SystemConfig.hotVersion = "2.4.0";
    SystemConfig.match = [
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
        "*://*/course/*.html?*",
        "*://examh5.zhihuishu.com/stuExamWeb.html*",
        "*://onlineexamh5new.zhihuishu.com/stuExamWeb.html*",
        "*://studyh5.zhihuishu.com/videoStudy.html*",
        "*://www.icourse163.org/learn/*",
        "*://www.icourse163.org/spoc/learn/*"
    ];
    return SystemConfig;
}());



/***/ }),

/***/ "./src/internal/app/question.ts":
/*!**************************************!*\
  !*** ./src/internal/app/question.ts ***!
  \**************************************/
/*! exports provided: PushAnswer, TopicStatusString, QuestionStatusString, SwitchTopicType, ToolsQuestionBank, ToolsQuestionBankFacade */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PushAnswer", function() { return PushAnswer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TopicStatusString", function() { return TopicStatusString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuestionStatusString", function() { return QuestionStatusString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SwitchTopicType", function() { return SwitchTopicType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToolsQuestionBank", function() { return ToolsQuestionBank; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToolsQuestionBankFacade", function() { return ToolsQuestionBankFacade; });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/internal/utils/utils.ts");
/* harmony import */ var _App_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @App/config */ "./src/config.ts");
/* harmony import */ var _application__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
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



var PushAnswer = /** @class */ (function () {
    function PushAnswer() {
    }
    PushAnswer.prototype.Equal = function (content1, content2) {
        return content1 == content2;
    };
    return PushAnswer;
}());

var topicStatusMap = new Map();
topicStatusMap.set("ok", "搜索成功").set("random", "随机答案").set("no_support_random", "不支持的随机答案类型").set("no_answer", "题库中没有搜索到答案").set("no_match", "题库中没有符合的答案");
var questionStatusMap = new Map();
questionStatusMap.set("success", "搜索成功").set("network", "题库网络错误").set("incomplete", "题库不全").set("processing", "搜索中...");
function TopicStatusString(status) {
    return topicStatusMap.get(status) || "未知错误";
}
function QuestionStatusString(status) {
    return questionStatusMap.get(status) || "未知错误";
}
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
        _application__WEBPACK_IMPORTED_MODULE_2__["Application"].App.log.Debug("答案查询", topic);
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
            _utils_utils__WEBPACK_IMPORTED_MODULE_0__["HttpUtils"].HttpPost(_App_config__WEBPACK_IMPORTED_MODULE_1__["SystemConfig"].url + "v2/answer?platform=" + _this.platform, body, {
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
            _application__WEBPACK_IMPORTED_MODULE_2__["Application"].App.log.Debug("采集提交", answer);
            _utils_utils__WEBPACK_IMPORTED_MODULE_0__["HttpUtils"].HttpPost(_App_config__WEBPACK_IMPORTED_MODULE_1__["SystemConfig"].url + "answer?platform=" + _this.platform, "info=" + _this.GetInfo() + "&data=" + encodeURIComponent(JSON.stringify(answer)), {
                json: true,
                success: function (result) {
                    _application__WEBPACK_IMPORTED_MODULE_2__["Application"].App.log.Info("答案自动记录成功,成功获得" + result.add_token_num + "个打码数,剩余数量:" + result.token_num);
                    resolve("success");
                },
                error: function () {
                    resolve("network");
                }
            });
        });
    };
    ToolsQuestionBank.prototype.Equal = function (content1, content2) {
        return Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["removeHTML"])(content1) == Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__["removeHTML"])(content2);
    };
    ToolsQuestionBank.prototype.CheckCourse = function (info) {
        var _this = this;
        return new Promise(function (resolve) {
            info = info || [_this.info];
            _utils_utils__WEBPACK_IMPORTED_MODULE_0__["HttpUtils"].HttpPost(_App_config__WEBPACK_IMPORTED_MODULE_1__["SystemConfig"].url + "v2/check?platform=" + _this.platform, "info=" + encodeURIComponent(JSON.stringify(info)), {
                success: function () {
                    //TODO:课程题目数量
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
            return new Promise(function (resolve) {
                if (ret.status != "processing") {
                    _application__WEBPACK_IMPORTED_MODULE_2__["Application"].App.log.Debug("题库返回", ret);
                    if (ret.status != "success" || status == "success") {
                        callback(ret.status);
                        return resolve();
                    }
                    callback(status);
                    return resolve();
                }
                var i = 0;
                var t = _application__WEBPACK_IMPORTED_MODULE_2__["Application"].App.config.topic_interval * 60 * 1000;
                var next = function () {
                    if (i >= ret.answer.length) {
                        return resolve();
                    }
                    var answer = ret.answer[i];
                    var question = _this.question[answer.index];
                    var tmpStatus = answer.status;
                    if (answer.status == "no_answer") {
                        status = _this.randAnswer(status, tmpStatus, question);
                        i++;
                        setTimeout(next, t);
                        return;
                    }
                    if (answer.type != question.GetType()) {
                        tmpStatus = "no_match";
                    }
                    else {
                        tmpStatus = question.Fill(answer);
                    }
                    if (tmpStatus == "no_match") {
                        status = _this.randAnswer(status, tmpStatus, question);
                        i++;
                        setTimeout(next, t);
                        return;
                    }
                    question.SetStatus(tmpStatus);
                    i++;
                    setTimeout(next, t);
                };
                next();
            });
        });
    };
    ToolsQuestionBankFacade.prototype.randAnswer = function (status, tmpStatus, question) {
        if (_application__WEBPACK_IMPORTED_MODULE_2__["Application"].App.config.rand_answer) {
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
            correct.topic = correct.topic;
            correct.answers = correct.answers;
            correct.correct = correct.correct;
            answer.push(correct);
        });
        this.bank.Push(answer).then(function (ret) {
            _application__WEBPACK_IMPORTED_MODULE_2__["Application"].App.log.Debug("题库返回", ret);
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



/***/ }),

/***/ "./src/internal/app/topic.ts":
/*!***********************************!*\
  !*** ./src/internal/app/topic.ts ***!
  \***********************************/
/*! exports provided: Topic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Topic", function() { return Topic; });
/* harmony import */ var _application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
/* harmony import */ var _App_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @App/config */ "./src/config.ts");


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
            _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.log.Info("题目搜索中...");
            _this.addQuestion();
            _this.answer.Answer(function (status) {
                _this.lock = false;
                resolve(status);
                if (status == "network") {
                    return _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.log.Error("题库无法访问,请查看:" + _App_config__WEBPACK_IMPORTED_MODULE_1__["SystemConfig"].url);
                }
                else if (status == "incomplete") {
                    return _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.log.Warn("题库答案不全,请手动填写操作");
                }
            });
        });
    };
    Topic.prototype.CollectAnswer = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.log.Debug("收集题目答案", _this.context);
            _this.addQuestion();
            _this.answer.Push(function (status) {
                _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.log.Debug("采集答案返回", status);
                resolve();
            });
        });
    };
    return Topic;
}());



/***/ }),

/***/ "./src/internal/application.ts":
/*!*************************************!*\
  !*** ./src/internal/application.ts ***!
  \*************************************/
/*! exports provided: Backend, Frontend, Content, AppName, Application */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Backend", function() { return Backend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Frontend", function() { return Frontend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Content", function() { return Content; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppName", function() { return AppName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Application", function() { return Application; });
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/message */ "./src/internal/utils/message.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/utils */ "./src/internal/utils/utils.ts");
/* harmony import */ var _App_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @App/config */ "./src/config.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
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



var Backend = "backend";
var Frontend = "frontend";
var Content = "content";
var AppName = "cxmooc-tools";
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
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "debug", {
        get: function () {
            return "development" == "development";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "prod", {
        get: function () {
            return "development" == "production";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "config", {
        get: function () {
            return this.component.get("config");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "log", {
        get: function () {
            return this.component.get("logger");
        },
        enumerable: true,
        configurable: true
    });
    Application.prototype.run = function () {
        this.launcher.start();
    };
    Object.defineProperty(Application.prototype, "IsFrontend", {
        get: function () {
            return Application.IsFrontend;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "IsBackend", {
        get: function () {
            return Application.IsBackend;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "IsContent", {
        get: function () {
            return Application.IsContent;
        },
        enumerable: true,
        configurable: true
    });
    Application.prototype.runEnvSwitch = function (env) {
        switch (env) {
            case Frontend:
                Application.IsFrontend = true;
                break;
            case Backend:
                Application.IsBackend = true;
                break;
            case Content:
                Application.IsContent = true;
                break;
        }
        ;
    };
    Object.defineProperty(Application.prototype, "Client", {
        get: function () {
            if (Application.IsFrontend) {
                return Object(_utils_message__WEBPACK_IMPORTED_MODULE_0__["NewChromeClientMessage"])(AppName);
            }
            return Object(_utils_message__WEBPACK_IMPORTED_MODULE_0__["NewExtensionClientMessage"])(AppName);
        },
        enumerable: true,
        configurable: true
    });
    Application.CheckUpdate = function (callback) {
        if (Application.IsContent) {
            chrome.storage.local.get(["version", "enforce", "hotversion", "url"], function (item) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, callback((_App_config__WEBPACK_IMPORTED_MODULE_2__["SystemConfig"].version < item.version), item)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            return;
        }
        _utils_utils__WEBPACK_IMPORTED_MODULE_1__["HttpUtils"].HttpGet(_App_config__WEBPACK_IMPORTED_MODULE_2__["SystemConfig"].url + "update?ver=" + _App_config__WEBPACK_IMPORTED_MODULE_2__["SystemConfig"].version, {
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
                                return [4 /*yield*/, callback((_App_config__WEBPACK_IMPORTED_MODULE_2__["SystemConfig"].version < data.version), data)];
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



/***/ }),

/***/ "./src/internal/utils/config.ts":
/*!**************************************!*\
  !*** ./src/internal/utils/config.ts ***!
  \**************************************/
/*! exports provided: ChromeConfigItems, NewBackendConfig, NewFrontendGetConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChromeConfigItems", function() { return ChromeConfigItems; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewBackendConfig", function() { return NewBackendConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewFrontendGetConfig", function() { return NewFrontendGetConfig; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/internal/utils/utils.ts");
/* harmony import */ var _application__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../application */ "./src/internal/application.ts");


var ChromeConfigItems = /** @class */ (function () {
    function ChromeConfigItems(getConfig) {
        this.getConfig = getConfig;
    }
    ChromeConfigItems.prototype.GetConfig = function (key) {
        return this.getConfig.GetConfig(key);
    };
    ChromeConfigItems.prototype.Watch = function (key, callback) {
        this.getConfig.Watch(key, callback);
    };
    ChromeConfigItems.prototype.bool = function (val) {
        if (typeof val == "boolean") {
            return val;
        }
        return val == "true";
    };
    Object.defineProperty(ChromeConfigItems.prototype, "super_mode", {
        get: function () {
            return this.bool(this.getConfig.GetConfig("super_mode"));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "vtoken", {
        get: function () {
            return this.getConfig.GetConfig("vtoken");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "rand_answer", {
        get: function () {
            return this.bool(this.getConfig.GetConfig("rand_answer"));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "auto", {
        get: function () {
            return this.bool(this.getConfig.GetConfig("auto"));
        },
        set: function (val) {
            localStorage["auto"] = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "video_mute", {
        get: function () {
            return this.bool(this.getConfig.GetConfig("video_mute"));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "answer_ignore", {
        get: function () {
            return this.bool(this.getConfig.GetConfig("answer_ignore"));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "video_cdn", {
        get: function () {
            return this.getConfig.GetConfig("video_cdn");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "video_multiple", {
        get: function () {
            return this.getConfig.GetConfig("video_multiple");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "interval", {
        get: function () {
            var interval = (this.getConfig.GetConfig("interval") || 0.1) * 100;
            return Math.floor(Object(_utils__WEBPACK_IMPORTED_MODULE_0__["randNumber"])(interval - interval / 2, interval + interval / 2)) / 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChromeConfigItems.prototype, "topic_interval", {
        get: function () {
            return this.topic_interval_;
            // return (this.getConfig.GetConfig("topic_interval") || 0.05);
        },
        set: function (val) {
            this.topic_interval_ = val;
        },
        enumerable: true,
        configurable: true
    });
    return ChromeConfigItems;
}());

// 后台环境中使用
function NewBackendConfig() {
    return new backendConfig();
}
var backendConfig = /** @class */ (function () {
    function backendConfig() {
    }
    backendConfig.prototype.GetConfig = function (key) {
        return new Promise(function (resolve) { return (chrome.storage.sync.get(key, function (value) {
            if (value.hasOwnProperty(key)) {
                resolve(value[key]);
            }
            else {
                resolve(undefined);
            }
        })); });
    };
    backendConfig.prototype.Watch = function (key, callback) {
        throw new Error("Method not implemented.");
    };
    backendConfig.prototype.SetConfig = function (key, val) {
        return new Promise(function (resolve) {
            var info = {};
            info[key] = val;
            chrome.storage.sync.set(info, function () {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { type: "cxconfig", key: key, value: val });
                });
                resolve();
            });
        });
    };
    return backendConfig;
}());
// 前端环境使用
function NewFrontendGetConfig() {
    return new frontendGetConfig();
}
var frontendGetConfig = /** @class */ (function () {
    function frontendGetConfig() {
        window.addEventListener('message', function (event) {
            if (event.data.type && event.data.type == "cxconfig") {
                _application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.log.Info("配置更新:" + event.data.key + "=" + event.data.value);
                localStorage[event.data.key] = event.data.value;
            }
        });
    }
    frontendGetConfig.prototype.GetConfig = function (key) {
        return localStorage[key];
    };
    frontendGetConfig.prototype.Watch = function (key, callback) {
        var _this = this;
        if (typeof key == "string") {
            this.setWatchMap(key, callback);
            return;
        }
        key.forEach(function (val, index) {
            _this.setWatchMap(val, callback);
        });
    };
    frontendGetConfig.prototype.setWatchMap = function (key, callback) {
        //TODO: 监控配置项更新
    };
    return frontendGetConfig;
}());


/***/ }),

/***/ "./src/internal/utils/hook.ts":
/*!************************************!*\
  !*** ./src/internal/utils/hook.ts ***!
  \************************************/
/*! exports provided: Hook */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Hook", function() { return Hook; });
/* harmony import */ var _App_internal_application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");

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
            var hookXMLHttpRequest = new Hook("open", _App_internal_application__WEBPACK_IMPORTED_MODULE_0__["Application"].GlobalContext.XMLHttpRequest.prototype);
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



/***/ }),

/***/ "./src/internal/utils/log.ts":
/*!***********************************!*\
  !*** ./src/internal/utils/log.ts ***!
  \***********************************/
/*! exports provided: ConsoleLog, PageLog, EmptyLog */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConsoleLog", function() { return ConsoleLog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageLog", function() { return PageLog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmptyLog", function() { return EmptyLog; });
/* harmony import */ var _application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
/* harmony import */ var _views_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../views/common */ "./src/views/common.ts");
/* harmony import */ var _views_common__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_views_common__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};



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
        _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.debug && console.info.apply(console, __spreadArrays(["[debug", this.getNowTime(), "]"], args));
        return this;
    };
    ConsoleLog.prototype.Info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.debug && console.info.apply(console, __spreadArrays(["[info", this.getNowTime(), "]"], args));
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

var PageLog = /** @class */ (function () {
    function PageLog() {
        var _this = this;
        this.el = undefined;
        window.addEventListener("load", function () {
            _this.div = document.createElement("div");
            // 主要布局
            _this.div.innerHTML = "\n            <div class=\"head\"> \n               <span>\u5C0F\u5DE5\u5177\u901A\u77E5\u6761</span> \n               <label class=\"switch\" style=\"width:90px\">\n                  <input class=\"checkbox-input\" id=\"checkbox\" type=\"checkbox\" checked=\"checked\">\n                  <label class=\"checkbox\" for=\"checkbox\"></label>\n                  <span>\u684C\u9762\u901A\u77E5</span>\n               </label>\n               <span class=\"close\" style=\"float:right; cursor:pointer; margin-right:5px;\">x</span>\n            </div>\n            <div class=\"main\">\n               <div class=\"tools-notice-content\"></div>\n            </div>\n            ";
            _this.div.className = "tools-logger-panel";
            document.body.appendChild(_this.div);
            _this.el = _this.div.querySelector(".tools-notice-content");
            _this.div.querySelector(".close").onclick = function () {
                _this.el = undefined;
                _this.div.remove();
            };
            var checkbox = _this.div.querySelector("#checkbox");
            localStorage["is_notify"] = localStorage["is_notify"] || "true";
            checkbox.checked = localStorage["is_notify"] == "true";
            if (!checkbox.checked) {
                checkbox.removeAttribute("checked");
            }
            checkbox.addEventListener("change", function () {
                localStorage["is_notify"] = this.checked;
            });
            setTimeout(function () {
                _application__WEBPACK_IMPORTED_MODULE_0__["Application"].CheckUpdate(function (isnew, data) {
                    if (data == undefined) {
                        _this.Info("检查更新失败.");
                    }
                    var html = "";
                    if (isnew) {
                        html += "<span>[有新版本]</span>";
                    }
                    html += data.injection;
                    _this.Info(html);
                });
            }, 1000);
        });
    }
    PageLog.prototype.getNowTime = function () {
        var time = new Date();
        return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    };
    PageLog.prototype.first = function (text, color, background) {
        var new_log = document.createElement("div");
        new_log.innerHTML = "\n                <div class=\"log\" style=\"border-color: " + background + "; background-color: " + background + ";\">\n                    <p><span style=\"color:" + color + ";\">" + text + "</span></p>\n                </div>\n            ";
        //插入第一个元素前
        var first = document.getElementsByClassName("tools-notice-content")[0].getElementsByTagName("div");
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
                text += JSON.stringify(args[i]) + "\n";
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
        else {
            console.warn.apply(console, __spreadArrays(["[warn", this.getNowTime(), "]"], args));
        }
        if (document.hidden && localStorage["is_notify"] == "true") {
            Object(_App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_2__["Noifications"])({
                title: "超星慕课小工具",
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
            this.first(text, "#ff7879", "rgba(253, 226, 226, 0.5)");
        }
        else {
            console.error.apply(console, __spreadArrays(["[error", this.getNowTime(), "]"], args));
        }
        if (localStorage["is_notify"] == "true") {
            Object(_App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_2__["Noifications"])({
                title: "超星慕课小工具",
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
            this.first(text, "#ff0000", "rgba(253,162,169,0.5)");
        }
        else {
            console.error.apply(console, __spreadArrays(["[fatal", this.getNowTime(), "]"], args));
        }
        Object(_App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_2__["Noifications"])({
            title: "超星慕课小工具",
            text: text,
        });
        return this;
    };
    return PageLog;
}());

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



/***/ }),

/***/ "./src/internal/utils/message.ts":
/*!***************************************!*\
  !*** ./src/internal/utils/message.ts ***!
  \***************************************/
/*! exports provided: NewExtensionServerMessage, NewExtensionClientMessage, NewChromeServerMessage, NewChromeClientMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewExtensionServerMessage", function() { return NewExtensionServerMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewExtensionClientMessage", function() { return NewExtensionClientMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewChromeServerMessage", function() { return NewChromeServerMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewChromeClientMessage", function() { return NewChromeClientMessage; });
var __extends = (undefined && undefined.__extends) || (function () {
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
function NewExtensionServerMessage(port) {
    return new extensionServerMessage(port);
}
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
/*! exports provided: HttpUtils, Injected, InjectedBySrc, syncGetChromeStorageLocal, syncSetChromeStorageLocal, RemoveInjected, randNumber, createBtn, get, post, removeHTMLTag, removeHTML, substrex, dealHotVersion, protocolPrompt, getImageBase64, isPhone, Noifications, UntrustedClick */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpUtils", function() { return HttpUtils; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Injected", function() { return Injected; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InjectedBySrc", function() { return InjectedBySrc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "syncGetChromeStorageLocal", function() { return syncGetChromeStorageLocal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "syncSetChromeStorageLocal", function() { return syncSetChromeStorageLocal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RemoveInjected", function() { return RemoveInjected; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randNumber", function() { return randNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createBtn", function() { return createBtn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "post", function() { return post; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeHTMLTag", function() { return removeHTMLTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeHTML", function() { return removeHTML; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "substrex", function() { return substrex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dealHotVersion", function() { return dealHotVersion; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "protocolPrompt", function() { return protocolPrompt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getImageBase64", function() { return getImageBase64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPhone", function() { return isPhone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Noifications", function() { return Noifications; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UntrustedClick", function() { return UntrustedClick; });
/* harmony import */ var _application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../application */ "./src/internal/application.ts");
/* harmony import */ var _App_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @App/config */ "./src/config.ts");


var HttpUtils = /** @class */ (function () {
    function HttpUtils() {
    }
    HttpUtils.Request = function (info) {
        if (_application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.IsBackend) {
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
                _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.log.Info(ret.msg);
                break;
            }
            case -2: {
                _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.log.Warn(ret.msg);
                break;
            }
            case 1: {
                _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.log.Info(ret.msg);
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
            var client = _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.Client;
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
        info.headers["Content-Type"] = "application/x-www-form-urlencoded";
        info.headers["Authorization"] = _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.config.vtoken;
        info.headers["X-Version"] = _App_config__WEBPACK_IMPORTED_MODULE_1__["SystemConfig"].version + "";
        info.method = "POST";
        this.Request(info);
    };
    HttpUtils.SendRequest = function (client, data) {
        if (!data.info) {
            return;
        }
        var info = data.info;
        if (_application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.IsBackend) {
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
            var extClient = _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.Client;
            extClient.Send({ type: "GM_xmlhttpRequest", info: info });
            extClient.Recv(function (data) {
                client.Send(data);
            });
        }
    };
    return HttpUtils;
}());

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
function syncGetChromeStorageLocal(key) {
    return new Promise(function (resolve) { return (chrome.storage.local.get(key, function (value) {
        resolve(value[key]);
    })); });
}
function syncSetChromeStorageLocal(key, value) {
    var tmp = {};
    tmp[key] = value;
    return new Promise(function (resolve) { return (chrome.storage.local.set(tmp, function () {
        resolve();
    })); });
}
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
function randNumber(minNum, maxNum) {
    return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
}
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
    xmlhttp.setRequestHeader('Authorization', _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.config.vtoken || '');
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
    //TODO:处理HTML符号,手动处理就很菜
    return html.replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, "\"").replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<").replace(/&amp;/g, '&').trim();
}
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
function dealHotVersion(hotversion) {
    hotversion = hotversion.substring(0, hotversion.indexOf(".") + 1) + hotversion.substring(hotversion.indexOf(".") + 1).replace(".", "");
    return Number(hotversion);
}
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
function isPhone() {
    return /Android|iPhone/i.test(navigator.userAgent);
}
function Noifications(details) {
    if (window.hasOwnProperty("GM_notification")) {
        window.GM_notification(details);
    }
    else {
        var client = _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.Client;
        client.Send({
            type: "GM_notification", details: details,
        });
        _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.Client.Send(details);
    }
}
function UntrustedClick(el) {
    var untrusted = new MouseEvent("click", { "clientX": 10086 });
    if (!untrusted.isTrusted) {
        _application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.log.Warn("扩展执行错误");
        return false;
    }
    return el.dispatchEvent(untrusted);
}


/***/ }),

/***/ "./src/mooc/chaoxing/utils.ts":
/*!************************************!*\
  !*** ./src/mooc/chaoxing/utils.ts ***!
  \************************************/
/*! exports provided: CssBtn, CreateNoteLine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CssBtn", function() { return CssBtn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateNoteLine", function() { return CreateNoteLine; });
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


/***/ }),

/***/ "./src/mooc/mooc.ts":
/*!**************************!*\
  !*** ./src/mooc/mooc.ts ***!
  \**************************/
/*! exports provided: mooc */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mooc", function() { return mooc; });
/* harmony import */ var _App_internal_application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");

var mooc = /** @class */ (function () {
    function mooc(moocFactory) {
        this.moocFactory = moocFactory;
    }
    mooc.prototype.start = function () {
        try {
            var state = document.readyState;
            _App_internal_application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.log.Debug("Start document state:", state);
            var mooc_1 = this.moocFactory.CreateMooc();
            if (mooc_1 != null) {
                mooc_1.Init();
            }
        }
        catch (e) {
            _App_internal_application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.log.Fatal("扩展发生了一个致命错误:", e);
        }
        //最小化警告
        if (top == self) {
            var isShow_1 = false;
            document.addEventListener("visibilitychange", function () {
                if (document.hidden) {
                    if (isShow_1) {
                        return;
                    }
                    _App_internal_application__WEBPACK_IMPORTED_MODULE_0__["Application"].App.log.Warn("请注意!最小化可能导致视频无法正常播放!允许切换窗口.");
                    isShow_1 = true;
                }
            });
        }
    };
    return mooc;
}());



/***/ }),

/***/ "./src/mooc/zhihuishu/exam.ts":
/*!************************************!*\
  !*** ./src/mooc/zhihuishu/exam.ts ***!
  \************************************/
/*! exports provided: ZhsExam */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ZhsExam", function() { return ZhsExam; });
/* harmony import */ var _App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");
/* harmony import */ var _views_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../views/common */ "./src/views/common.ts");
/* harmony import */ var _views_common__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_views_common__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _App_internal_app_topic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @App/internal/app/topic */ "./src/internal/app/topic.ts");
/* harmony import */ var _App_internal_app_question__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @App/internal/app/question */ "./src/internal/app/question.ts");
/* harmony import */ var _chaoxing_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../chaoxing/utils */ "./src/mooc/chaoxing/utils.ts");
var __extends = (undefined && undefined.__extends) || (function () {
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
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





//TODO: 与超星一起整合优化
var ZhsExam = /** @class */ (function () {
    function ZhsExam() {
    }
    ZhsExam.prototype.Init = function () {
        var _this = this;
        this.topic = new ExamTopic(document, new _App_internal_app_question__WEBPACK_IMPORTED_MODULE_3__["ToolsQuestionBankFacade"]("zhs", {
            refer: document.URL,
            id: document.URL.match(/(checkHomework|dohomework)\/(.*?)\/(.*?)\/(.*?)\/(.*?)\/(.*?)$/)[4],
        }));
        this.topic.SetQueryQuestions(new ExamQueryQuestion());
        window.addEventListener("load", function () {
            setTimeout(function () {
                document.oncontextmenu = function () {
                };
                document.oncopy = function () {
                };
                document.onpaste = function () {
                };
                document.onselectstart = function () {
                };
                if (document.querySelectorAll(".examInfo.infoList.clearfix").length <= 0) {
                    _this.createBtn();
                }
                else {
                    _this.topic.CollectAnswer();
                }
            }, 1000);
        });
    };
    ZhsExam.prototype.createBtn = function () {
        var el = document.querySelector(".examPaper_partTit.mt20 ul");
        var btn = Object(_App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_0__["createBtn"])("搜索答案", "点击搜索答案", "zhs-search-answer green");
        el.append(btn);
        var self = this;
        btn.onclick = function () {
            return __awaiter(this, void 0, void 0, function () {
                var ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Object(_App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_0__["protocolPrompt"])("你正准备使用智慧树答题功能,相应的我们需要你的正确答案,因为智慧树的机制问题,采集答案会导致无法重新作答,你是否愿意贡献你的答案?\n* 本项选择不会影响你的正常使用(协议当前版本有效)\n* 手动点击答题结果页面自动采集页面答案\n* (功能其实还没完成,后续更新)", "zhs_answer_collect", "我同意");
                            btn.innerText = "搜索中...";
                            return [4 /*yield*/, self.topic.QueryAnswer()];
                        case 1:
                            ret = _a.sent();
                            btn.innerText = Object(_App_internal_app_question__WEBPACK_IMPORTED_MODULE_3__["QuestionStatusString"])(ret);
                            return [2 /*return*/, false];
                    }
                });
            });
        };
    };
    return ZhsExam;
}());

var ExamQueryQuestion = /** @class */ (function () {
    function ExamQueryQuestion() {
    }
    ExamQueryQuestion.prototype.QueryQuestions = function () {
        var _this = this;
        var timu = document.querySelectorAll(".examPaper_subject.mt20,.questionType");
        var ret = new Array();
        timu.forEach(function (val) {
            var el = val.querySelector(".subject_type_annex .subject_type");
            var type = Object(_App_internal_app_question__WEBPACK_IMPORTED_MODULE_3__["SwitchTopicType"])(Object(_App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_0__["substrex"])(el.innerHTML, "【", "】"));
            var question = _this.createQuestion(type, val);
            ret.push(question);
        });
        return ret;
    };
    ExamQueryQuestion.prototype.createQuestion = function (type, el) {
        switch (type) {
            case 1:
            case 2: {
                return new ZhsSelectQuestion(el, type);
            }
            case 3: {
                return new ZhsJudgeQuestion(el, type);
            }
            default: {
                return new ZhsSelectQuestion(el, -1);
            }
        }
    };
    return ExamQueryQuestion;
}());
var ZhsQuestion = /** @class */ (function () {
    function ZhsQuestion(el, type) {
        this.el = el;
        this.type = type;
    }
    ZhsQuestion.prototype.GetType = function () {
        return this.type;
    };
    ZhsQuestion.prototype.GetTopic = function () {
        var el = this.el.querySelector(".subject_type_describe.fl .subject_describe");
        return el.innerHTML;
    };
    ZhsQuestion.prototype.removeNotice = function () {
        this.el.querySelectorAll(".prompt-line-answer").forEach(function (v) {
            v.remove();
        });
    };
    ZhsQuestion.prototype.addNotice = function (str) {
        var el = this.el.querySelector(".subject_node.mt10,.subject_node");
        Object(_chaoxing_utils__WEBPACK_IMPORTED_MODULE_4__["CreateNoteLine"])(str, "answer", el);
    };
    ZhsQuestion.prototype.SetStatus = function (status) {
        this.addNotice(Object(_App_internal_app_question__WEBPACK_IMPORTED_MODULE_3__["TopicStatusString"])(status));
    };
    ZhsQuestion.prototype.options = function () {
        return this.el.querySelectorAll(".subject_node .nodeLab");
    };
    ZhsQuestion.prototype.getOption = function (el) {
        var tmpel = el.querySelector(".mr10,span.mr5");
        return tmpel.innerText.substring(0, 1);
    };
    ZhsQuestion.prototype.click = function (el, content) {
        var tmpel = el.querySelector("input");
        if (tmpel.nextElementSibling.style.display != "none") {
            tmpel.parentElement.click();
        }
        this.addNotice(this.getOption(el) + ":" + content);
    };
    ZhsQuestion.prototype.getContent = function (el) {
        var tmpel = el.querySelector(".node_detail.examquestions-answer.fl");
        return tmpel.innerHTML;
    };
    ZhsQuestion.prototype.defaultAnswer = function () {
        var ret = new _App_internal_app_question__WEBPACK_IMPORTED_MODULE_3__["PushAnswer"]();
        ret.topic = this.GetTopic();
        ret.type = this.GetType();
        ret.correct = new Array();
        ret.answers = new Array();
        return ret;
    };
    ZhsQuestion.prototype.isCorrect = function () {
        return this.el.querySelector(".key_yes") != null;
    };
    return ZhsQuestion;
}());
var ZhsSelectQuestion = /** @class */ (function (_super) {
    __extends(ZhsSelectQuestion, _super);
    function ZhsSelectQuestion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZhsSelectQuestion.prototype.Random = function () {
        var options = this.options();
        var pos = Object(_App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_0__["randNumber"])(0, options.length - 1);
        this.click(options[pos], this.getContent(options[pos]));
        return "random";
    };
    ZhsSelectQuestion.prototype.Fill = function (s) {
        var _this = this;
        var options = this.options();
        var flag = false;
        var _loop_1 = function (i) {
            var _loop_2 = function (j) {
                if (s.Equal(this_1.getContent(options[j]), s.correct[i].content)) {
                    setTimeout(function () {
                        _this.click(options[j], s.correct[i].content);
                    }, i * 1000);
                    flag = true;
                }
            };
            for (var j = 0; j < options.length; j++) {
                _loop_2(j);
            }
        };
        var this_1 = this;
        for (var i = 0; i < s.correct.length; i++) {
            _loop_1(i);
        }
        if (flag) {
            return "ok";
        }
        return "no_match";
    };
    ZhsSelectQuestion.prototype.Correct = function () {
        if (!this.isCorrect()) {
            return null;
        }
        var ret = this.defaultAnswer();
        var options = this.options();
        for (var i = 0; i < options.length; i++) {
            var option = {
                option: this.getOption(options[i]),
                content: this.getContent(options[i]),
            };
            ret.answers.push(option);
            if (options[i].querySelector("input").checked) {
                ret.correct.push(option);
            }
        }
        return ret;
    };
    return ZhsSelectQuestion;
}(ZhsQuestion));
var ZhsJudgeQuestion = /** @class */ (function (_super) {
    __extends(ZhsJudgeQuestion, _super);
    function ZhsJudgeQuestion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZhsJudgeQuestion.prototype.Random = function () {
        var options = this.options();
        this.click(options[Object(_App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_0__["randNumber"])(0, 1)]);
        return "random";
    };
    ZhsJudgeQuestion.prototype.click = function (el) {
        el.querySelector("label > input,input").click();
        this.addNotice(this.getContent(el));
    };
    ZhsJudgeQuestion.prototype.Fill = function (answer) {
        var options = this.options();
        for (var i = 0; i < options.length; i++) {
            if (this.getContent(options[i]) == (answer.correct[0].content ? "对" : "错")) {
                this.click(options[i]);
                break;
            }
        }
        return "ok";
    };
    ZhsJudgeQuestion.prototype.Correct = function () {
        if (!this.isCorrect()) {
            return null;
        }
        var ret = this.defaultAnswer();
        var answer = this.getContent(this.el.querySelector("input:checked").parentElement.parentElement) == "对";
        ret.correct.push({
            option: answer,
            content: answer,
        });
        return ret;
    };
    return ZhsJudgeQuestion;
}(ZhsQuestion));
var ExamTopic = /** @class */ (function (_super) {
    __extends(ExamTopic, _super);
    function ExamTopic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExamTopic.prototype.Init = function () {
        return null;
    };
    ExamTopic.prototype.Submit = function () {
        return null;
    };
    return ExamTopic;
}(_App_internal_app_topic__WEBPACK_IMPORTED_MODULE_2__["Topic"]));


/***/ }),

/***/ "./src/mooc/zhihuishu/platform.ts":
/*!****************************************!*\
  !*** ./src/mooc/zhihuishu/platform.ts ***!
  \****************************************/
/*! exports provided: ZhsPlatform */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ZhsPlatform", function() { return ZhsPlatform; });
/* harmony import */ var _video__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./video */ "./src/mooc/zhihuishu/video.ts");
/* harmony import */ var _exam__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./exam */ "./src/mooc/zhihuishu/exam.ts");
/* harmony import */ var _App_internal_application__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");



var ZhsPlatform = /** @class */ (function () {
    function ZhsPlatform() {
    }
    ZhsPlatform.prototype.CreateMooc = function () {
        _App_internal_application__WEBPACK_IMPORTED_MODULE_2__["Application"].App.config.topic_interval = _App_internal_application__WEBPACK_IMPORTED_MODULE_2__["Application"].App.config.topic_interval || 0;
        var mooc = null;
        if (document.URL.indexOf("studyh5.zhihuishu.com/videoStudy.html") > 0) {
            mooc = new _video__WEBPACK_IMPORTED_MODULE_0__["ZhsVideo"]();
        }
        else if (document.URL.indexOf("zhihuishu.com/stuExamWeb.html") > 0) {
            mooc = new _exam__WEBPACK_IMPORTED_MODULE_1__["ZhsExam"]();
        }
        return mooc;
    };
    return ZhsPlatform;
}());



/***/ }),

/***/ "./src/mooc/zhihuishu/video.ts":
/*!*************************************!*\
  !*** ./src/mooc/zhihuishu/video.ts ***!
  \*************************************/
/*! exports provided: ZhsVideo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ZhsVideo", function() { return ZhsVideo; });
/* harmony import */ var _App_internal_utils_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @App/internal/utils/hook */ "./src/internal/utils/hook.ts");
/* harmony import */ var _App_internal_application__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
/* harmony import */ var _views_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../views/common */ "./src/views/common.ts");
/* harmony import */ var _views_common__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_views_common__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @App/internal/utils/utils */ "./src/internal/utils/utils.ts");




var ZhsVideo = /** @class */ (function () {
    function ZhsVideo() {
    }
    ZhsVideo.prototype.Init = function () {
        var _this = this;
        this.hookAjax();
        var timer = setInterval(function () {
            try {
                _this.start();
                clearInterval(timer);
            }
            catch (e) {
            }
        }, 500);
    };
    ZhsVideo.prototype.createToolsBar = function () {
        var _this = this;
        var tools = document.createElement('div');
        tools.className = "entrance_div";
        tools.id = "cxtools";
        var boomBtn = document.createElement("a");
        boomBtn.href = "#";
        boomBtn.className = "zhs-tools-btn";
        boomBtn.innerText = "秒过视频";
        boomBtn.onclick = function () {
            if (!Object(_App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_3__["protocolPrompt"])("秒过视频会产生不良记录,是否继续?", "boom_no_prompt")) {
                return;
            }
            var timeStr = document.querySelector(".nPlayTime .duration").innerText;
            var time = 0;
            var temp = timeStr.match(/[\d]+/gi);
            for (var i = 0; i < 3; i++) {
                time += parseInt(temp[i]) * Math.pow(60, 2 - i);
            }
            time += Object(_App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_3__["randNumber"])(20, 200);
            var tn = time;
            //通过id搜索视频信息
            var lessonId = 0, smallLessonId = 0, chapterId = 0;
            for (var i = 0; i < _this.videoList.videoChapterDtos.length; i++) {
                for (var n_1 = 0; n_1 < _this.videoList.videoChapterDtos[i].videoLessons.length; n_1++) {
                    if (_this.videoList.videoChapterDtos[i].videoLessons[n_1].videoId == _this.nowVideoId) {
                        lessonId = _this.videoList.videoChapterDtos[i].videoLessons[n_1].id;
                        smallLessonId = _this.videoList.videoChapterDtos[i].videoLessons[n_1].ishaveChildrenLesson;
                        chapterId = _this.videoList.videoChapterDtos[i].videoLessons[n_1].chapterId;
                    }
                }
            }
            var s = [_this.videoList.recruitId, lessonId, smallLessonId, _this.nowVideoId, chapterId, "0", tn, time, timeStr], l = {
                ev: n.Z(s),
                learningTokenId: Base64.encode(_this.studiedLessonDtoId.toString()),
                uuid: Object(_App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_3__["substrex"])(document.cookie, "uuid%22%3A%22", "%22"),
                dateFormate: Date.parse(new Date()),
            };
            var postData = "ev=" + l.ev + "&learningTokenId=" + l.learningTokenId +
                "&uuid=" + l.uuid + "&dateFormate=" + l.dateFormate;
            Object(_App_internal_utils_utils__WEBPACK_IMPORTED_MODULE_3__["post"])("https://studyservice.zhihuishu.com/learning/saveDatabaseIntervalTime", postData, false, function (data) {
                var json = JSON.parse(data);
                try {
                    if (json.data.submitSuccess == true) {
                        alert("秒过成功,刷新后查看效果");
                    }
                    else {
                        alert("秒过失败");
                    }
                }
                catch (e) {
                    alert("秒过失败");
                }
            });
        };
        //TODO:优化,先这样把按钮弄出来
        var li2 = document.createElement("li");
        var startBtn = document.createElement("a");
        startBtn.href = "#";
        startBtn.className = "zhs-tools-btn zhs-start-btn";
        startBtn.innerText = _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.config.auto ? "暂停挂机" : "开始挂机";
        startBtn.onclick = function () {
            if (startBtn.innerText == "暂停挂机") {
                startBtn.innerText = "开始挂机";
                localStorage["auto"] = false;
            }
            else {
                startBtn.innerText = "暂停挂机";
                localStorage["auto"] = true;
                _this.play();
            }
        };
        tools.appendChild(startBtn);
        tools.appendChild(boomBtn);
        console.log(document.querySelector(".videotop_box.fl").append(tools));
    };
    ZhsVideo.prototype.compile = function () {
        var interval = _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.config.interval;
        _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.log.Info(interval + "分钟后自动切换下一节");
        clearTimeout(this.lastTimer);
        this.lastTimer = setTimeout(function () {
            var $ = _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].GlobalContext.$;
            var next = $(".clearfix.video.current_play").next();
            if (next.length == 0) {
                next = $(".clearfix.video.current_play")
                    .parents("ul.list,div")
                    .next("div,ul.list")
                    .find("li.video");
            }
            if (next.length == 0) {
                alert("刷课完成");
                return;
            }
            _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.config.auto && $(next[0]).click();
        }, interval * 60000);
    };
    ZhsVideo.prototype.play = function () {
        if (this.video) {
            this.video.muted = _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.config.video_mute;
            this.video.playbackRate = _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.config.video_multiple;
            _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.config.auto && this.video.play();
        }
    };
    ZhsVideo.prototype.start = function () {
        var hookPlayerStarter = new _App_internal_utils_hook__WEBPACK_IMPORTED_MODULE_0__["Hook"]("createPlayer", _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].GlobalContext.PlayerStarter);
        var self = this;
        hookPlayerStarter.Middleware(function (next) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            self.createToolsBar();
            _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.log.Info("视频开始加载");
            var hookPause = args[2].onPause;
            var hookReady = args[2].onReady;
            self.nowVideoId = args[1].id;
            args[2].onReady = function () {
                hookReady.apply(this);
                self.video = document.querySelector("#vjs_container_html5_api");
                _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.config.auto && self.play();
            };
            args[2].hookPause = function () {
                hookPause.apply(this);
                _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.config.auto && self.video.play();
            };
            var innerTimer = setInterval(function () {
                if (document.querySelectorAll(".current_play .time_icofinish").length > 0) {
                    clearInterval(innerTimer);
                    self.compile();
                }
            }, 2000);
            return next.apply(this, args);
        });
        var timeSetInterval = new _App_internal_utils_hook__WEBPACK_IMPORTED_MODULE_0__["Hook"]("setInterval", _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].GlobalContext);
        timeSetInterval.Middleware(function (next) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.log.Debug("加速器启动");
            if (_App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.config.super_mode) {
                args[1] = args[1] / _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].App.config.video_multiple;
            }
            return next.apply(this, args);
        });
    };
    ZhsVideo.prototype.hookAjax = function () {
        var hookXMLHttpRequest = new _App_internal_utils_hook__WEBPACK_IMPORTED_MODULE_0__["Hook"]("open", _App_internal_application__WEBPACK_IMPORTED_MODULE_1__["Application"].GlobalContext.XMLHttpRequest.prototype);
        var self = this;
        hookXMLHttpRequest.Middleware(function (next) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (args[1].indexOf("popupAnswer/loadVideoPointerInfo") >= 0) {
                Object.defineProperty(this, "responseText", {
                    get: function () {
                        var retText = this.response.replace(/"questionPoint":\[.*?\],"knowledgeCardDtos"/gm, '"questionPoint":[],"knowledgeCardDtos"');
                        return retText;
                    }
                });
            }
            else if (args[1].indexOf("learning/videolist") >= 0) {
                Object.defineProperty(this, "responseText", {
                    get: function () {
                        var json = JSON.parse(this.response);
                        self.videoList = json.data;
                        return this.response;
                    }
                });
            }
            else if (args[1].indexOf("learning/prelearningNote") >= 0) {
                Object.defineProperty(this, "responseText", {
                    get: function () {
                        var json = JSON.parse(this.response);
                        self.studiedLessonDtoId = json.data.studiedLessonDto.id;
                        return this.response;
                    }
                });
            }
            var ret = next.apply(this, args);
            return ret;
        });
    };
    return ZhsVideo;
}());

var n = {
    _a: "AgrcepndtslzyohCia0uS@",
    _b: "A0ilndhga@usreztoSCpyc",
    _c: "d0@yorAtlhzSCeunpcagis",
    _d: "zzpttjd",
    X: function (t) {
        for (var e = "", i = 0; i < t[this._c[8] + this._a[4] + this._c[15] + this._a[1] + this._a[8] + this._b[6]]; i++) {
            var n = t[this._a[3] + this._a[14] + this._c[18] + this._a[2] + this._b[18] + this._b[16] + this._c[0] + this._a[4] + this._b[0] + this._b[15]](i) ^ this._d[this._b[21] + this._b[6] + this._a[17] + this._c[5] + this._b[18] + this._c[4] + this._a[7] + this._a[4] + this._a[0] + this._c[7]](i % this._d[this._a[10] + this._b[13] + this._b[4] + this._a[1] + this._c[7] + this._a[14]]);
            e += this.Y(n);
        }
        return e;
    },
    Y: function (t) {
        var e = t[this._c[7] + this._a[13] + this._a[20] + this._b[15] + this._a[2] + this._b[2] + this._c[15] + this._c[19]](16);
        return e = e[this._b[3] + this._a[4] + this._b[4] + this._a[1] + this._c[7] + this._c[9]] < 2 ? this._b[1] + e : e,
            e[this._a[9] + this._b[3] + this._c[20] + this._c[17] + this._c[13]](-4);
    },
    Z: function (t) {
        for (var e = "", i = 0; i < t.length; i++)
            e += t[i] + ";";
        return e = e.substring(0, e.length - 1),
            this.X(e);
    }
};


/***/ }),

/***/ "./src/tampermonkey/zhihuishu-pack.ts":
/*!********************************************!*\
  !*** ./src/tampermonkey/zhihuishu-pack.ts ***!
  \********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _App_internal_utils_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @App/internal/utils/config */ "./src/internal/utils/config.ts");
/* harmony import */ var _App_internal_utils_log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @App/internal/utils/log */ "./src/internal/utils/log.ts");
/* harmony import */ var _App_internal_application__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @App/internal/application */ "./src/internal/application.ts");
/* harmony import */ var _App_mooc_mooc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @App/mooc/mooc */ "./src/mooc/mooc.ts");
/* harmony import */ var _App_mooc_zhihuishu_platform__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @App/mooc/zhihuishu/platform */ "./src/mooc/zhihuishu/platform.ts");





var logger;
if (top == self) {
    logger = new _App_internal_utils_log__WEBPACK_IMPORTED_MODULE_1__["PageLog"]();
}
else {
    logger = new _App_internal_utils_log__WEBPACK_IMPORTED_MODULE_1__["ConsoleLog"]();
}
_App_internal_application__WEBPACK_IMPORTED_MODULE_2__["Application"].GlobalContext = window.unsafeWindow;
var component = new Map().
    set("config", new _App_internal_utils_config__WEBPACK_IMPORTED_MODULE_0__["ChromeConfigItems"](Object(_App_internal_utils_config__WEBPACK_IMPORTED_MODULE_0__["NewFrontendGetConfig"])())).
    set("logger", logger);
;
var app = new _App_internal_application__WEBPACK_IMPORTED_MODULE_2__["Application"](_App_internal_application__WEBPACK_IMPORTED_MODULE_2__["Frontend"], new _App_mooc_mooc__WEBPACK_IMPORTED_MODULE_3__["mooc"](new _App_mooc_zhihuishu_platform__WEBPACK_IMPORTED_MODULE_4__["ZhsPlatform"]()), component);
app.run();


/***/ }),

/***/ "./src/views/common.ts":
/*!*****************************!*\
  !*** ./src/views/common.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

window.addEventListener("load", function () {
    var css = "#cxtools {\n    position: absolute;\n    left: 250px;\n    top: 2px;\n    width: 200px;\n    font-size: 0;\n}\n\n.cx-btn {\n    outline: none;\n    border: 0;\n    background: #7d9d35;\n    color: #fff;\n    border-radius: 4px;\n    padding: 2px 8px;\n    cursor: pointer;\n    font-size: 12px;\n    margin-left: 4px;\n}\n\n.cx-btn:hover {\n    box-shadow: 1px 1px 1px 1px #ccc;\n}\n\n.zhs-tools-btn {\n    color: #fff;\n    background: #ff9d34;\n    padding: 4px;\n    display: inline-block;\n    height: 24px;\n    font-size: 14px;\n    line-height: 24px;\n    margin:0;\n}\n\n.zhs-tools-btn:hover {\n    background: #ff3838;\n}\n\n.zhs-start-btn{\n    background: #36ac36;\n}\n\n.zhs-start-btn:hover{\n    background: #3b8d3b;\n}\n\n#zhs-ytbn {\n    color: #fff;\n    background: #e777ff;\n}\n\n#zhs-ytbn:hover {\n    background: #e7b7f1;\n}\n\n.zhs-search-answer {\n    border: 0;\n    outline: none;\n    padding: 4px;\n}\n\n.zhs-search-answer:hover {\n    opacity: .85;\n}\n\n.mooc163-search{\n    background-color: #60b900;\n    display: block;\n    margin: 0 auto;\n}\n\n.tools-logger-panel{\n    width: 360px;\n    height: auto;\n    max-height: 260px;\n    color:#000;\n    position: fixed;\n    margin: 0 auto;\n    display: block;\n    font-size: 14px;\n    border-radius: 4px;\n    width: 340px;\n    text-align: center;\n    overflow: hidden;\n    left:60px;\n    z-index: 100000;\n    top: 40px;\n    background: rgba(256, 256, 256, 0.3);\n    box-shadow: 0px 0px 5px #bbb;\n    transition-property: opacity, background-color;\n    transition: 200ms ease-in-out;\n}\n\n.head {\n    width: 100%;\n    height: 25px;\n}\n\n.head span{\n    color:#000;\n    float:left;\n    font-weight: 550;\n}\n\n.status {\n    color: #67C23A;\n    font-weight: 600;\n}\n\n.tools-notice-content {\n    width: 100%;\n    height: 220px;\n    border-top:0px;\n    overflow-y: scroll;\n    overflow-x: hidden;\n}\n\n.tools-notice-content .log {\n    height: auto;\n    width: auto;\n    text-align: center;\n    border: 1px solid #eee;\n    overflow: hidden;\n}\n\n.tools-notice-content .log p {\n    margin: 0;\n    color: #aaa;\n    font-size: 11px;\n    font-weight: 500;\n    font-family: Arial, Helvetica, sans-serif;\n    line-height: 26px;\n}\n\n/* \u6EDA\u52A8\u69FD */\n::-webkit-scrollbar {\n    width: 10px;\n    height: 10px;\n}\n\n::-webkit-scrollbar-track {\n    border-radius: 3px;\n    background: rgba(0, 0, 0, 0.06);\n    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);\n}\n\n/* \u6EDA\u52A8\u6761\u6ED1\u5757 */\n::-webkit-scrollbar-thumb {\n    border-radius: 3px;\n    background: rgba(0, 0, 0, 0.12);\n    -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);\n}\n\n/* \u590D\u9009\u6846 */\n.switch {\n    margin: 2px auto;\n    display: inline-flex;\n    align-items: center;\n    width: auto;\n}\n.checkbox-input {\n    display: none\n}\n.checkbox {\n    -webkit-transition: background-color 0.3s;\n    transition: background-color 0.3s;\n    background-color: #fff;\n    border: 1px solid #d7d7d7;\n    border-radius: 50px;\n    width: 16px;\n    height: 16px;\n    vertical-align:middle;\n    margin: 0 5px;\n}\n.checkbox-input:checked+.checkbox {\n    background-color: #409EFF;\n}\n.checkbox-input:checked+.checkbox:after {\n    // content: \"\u221A\";\n    display: inline-block;\n    height: 100%;\n    width: 100%;\n    color: #fff;\n    text-align: center;\n    line-height: 16px;\n    font-size: 12px;\n    box-shadow: 0 0 4px #409EFF;\n}\n\n.tools-logger-panel:hover,\n.tools-logger-panel:focus-within {\n    background: rgba(256, 256, 256, 0.7);\n}\n\n.tools-logger-panel:active {\n    background-color: #E5E5E5;\n}\n\n.tools-logger-panel > .close {\n    margin: 2px;\n}\n\n";
    var style = document.createElement("style");
    style.innerHTML = css;
    document.body.appendChild(style);
});


/***/ })

/******/ });
//# sourceMappingURL=tampermonkey-zhihuishu.js.map