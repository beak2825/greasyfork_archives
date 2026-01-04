// ==UserScript==
// @name         优学院网课助手
// @namespace    Brush-JIM
// @version      1.2.2
// @description  看视频，答题目，挂机
// @author       Brush-JIM
// @match        https://ua.ulearning.cn/learnCourse/learnCourse.html?*
// @match        https://www.ulearning.cn/umooc/user/study.do?*
// @grant        unsafeWindow
// @run-at       document-start
// @icon         https://www.ulearning.cn/ulearning/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/420344/%E4%BC%98%E5%AD%A6%E9%99%A2%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/420344/%E4%BC%98%E5%AD%A6%E9%99%A2%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

"use strict";
const self_ = unsafeWindow;
const Setting = {
    Video: "0",
    Volume: "0",
    Speed: "1",
    Answer: "0",
    ForcePut: "0",
    WaitPut: "0",
    NextPage: "0",
    WaitNextPage: "0",
    AutoExit: "0",
    PageChange: 0,
    NextPageChange: 0,
    LogRecordChange: 0,
    VideoID: 0,
    QuestionID: 0,
    WebSocketID: 0,
    BeforeNext: 5000,
    NextPageTime: 1000,
    VideoTime: 300,
    QuestionTime: 300,
    DealBouncedTime: 500,
    AnswerCount: 0,
    NextPageCount: 0,
    PageElement: undefined,
    Url: "wss://cncache.ml/ulearning",
    WS: undefined,
};
let Bug = {};
let Log = {};
const WebSocketSend = [];
const SupportType = [
    "1", "2", "3", "4", "5", "11", "12", "17", "23", "24"
];
var QuestionArray = [];
var oldVideos = [];
const QuestionTitle = [];
(function () {
    var c;
    var crcTable = [];
    for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    window.crcTable = crcTable;
})();
HookXHR(self_);
WS();
setInterval(function () {
    let ws = Setting.WS;
    if (ws) {
        Setting.WebSocketID = setTimeout(function (ws) {
            ws.close();
            Setting.WS = undefined;
            WS();
        }, 10000, ws);
        ws.send(JSON.stringify({
            type: 5,
        }));
    }
    else {
        WS();
    }
}, 30000);
setInterval(Upload, 3000);
setInterval(LogRecord, 500);
setInterval(QuestionCollect, 2000);
function QuestionCollect() {
    document.querySelectorAll("[id^='question']").forEach(function (item) {
        let qid_match = item.id.match(/question(\d+)/);
        if (!qid_match) {
            return;
        }
        let qid = qid_match[1];
        let title = item.querySelector(".question-title-text");
        if (title == null) {
            return;
        }
        let titleHTML = title.outerHTML;
        title = (title.cloneNode(true));
        title.querySelectorAll(".question-sort, .question-sort-dot, .question-type-tag, .input-wrapper, .choose-fill-blank-words, .custom-select").forEach(function (child) {
            child.parentNode?.removeChild(child);
        });
        let titleText = title.innerText;
        if (QuestionTitle.indexOf(titleHTML) == -1 || QuestionTitle.indexOf(titleText) == -1) {
            QuestionTitle.push(titleHTML);
            QuestionTitle.push(titleText);
            WebSocketSend.push({
                type: 9,
                qid: qid,
                titleHTML: titleHTML,
                titleText: titleText,
            });
        }
    });
}
function HookXHR(self_) {
    self_.XMLHttpRequest.prototype.open_ = self_.XMLHttpRequest.prototype.open;
    self_.XMLHttpRequest.prototype.open = function () {
        let url = arguments[1] || "";
        let xhr = this;
        const UrlMatch = [
            url.match(/https:\/\/api.ulearning.cn\/questionAnswer\/(\d+)\?parentId=(\d+)/),
            url.match(/https:\/\/api.ulearning.cn\/wholepage\/stu\/(\d+)/) || url.match(/https:\/\/api.ulearning.cn\/wholepage\/chapter\/stu\/(\d+)/),
            url.match(/\/umooc\/learner\/exam.do\?operation=getPaperForStudent&paperID=(\d+)&examId=(\d+)&userId=(\d+)/),
            url.match(/\/umooc\/learner\/exam.do\?operation=getCorrectAnswer&paperID=(\d+)&examID=(\d+)/),
        ];
        UrlMatch.forEach(function (value, index) {
            if (index == 0 && value) {
                let QuestionID = value[1];
                let ParentID = value[2];
                xhr.addEventListener("load", function () {
                    let answer = JSON.parse(xhr.responseText);
                    WebSocketSend.push({
                        type: 2,
                        qid: QuestionID,
                        pid: ParentID,
                        result: answer,
                    });
                }, false);
            }
            else if (index == 1 && value) {
                let wholePage = value[1];
                xhr.addEventListener("load", function () {
                    let data = JSON.parse(xhr.responseText);
                    WebSocketSend.push({
                        type: 4,
                        wholdPageID: wholePage,
                        wholdPage: data,
                    });
                }, false);
            }
            else if (index == 2 && value) {
                let paperID = value[1];
                xhr.addEventListener("load", function () {
                    let data = JSON.parse(xhr.responseText);
                    WebSocketSend.push({
                        type: 6,
                        paperID: paperID,
                        paper: data,
                    });
                }, false);
            }
            else if (index == 3 && value) {
                let paperID = value[1];
                xhr.addEventListener("load", function () {
                    let data = JSON.parse(xhr.responseText);
                    WebSocketSend.push({
                        type: 7,
                        paperID: paperID,
                        paperAnswer: data,
                    });
                });
            }
        }, xhr);
        return this.open_.apply(this, arguments);
    };
}
function Upload() {
    let ws = Setting.WS;
    let wsSend = WebSocketSend.pop();
    if (ws && wsSend) {
        ws.send(JSON.stringify(wsSend));
        setTimeout(function (ws, wsSend) {
            if (ws != Setting.WS) {
                WebSocketSend.push(wsSend);
            }
        }, 45000, ws, wsSend);
    }
    else if (wsSend) {
        WebSocketSend.push(wsSend);
    }
}
function WS() {
    let uid = self_.currentUserId || 0;
    if (!uid && self_["exam"] && self_["exam"]["userID"]) {
        uid = self_["exam"]["userID"];
    }
    if (uid) {
        let ws = new WebSocket(Setting.Url);
        ws.addEventListener("open", function () {
            this.send(JSON.stringify({
                type: 1,
                uid: Crc32(uid.toString()).toString(),
            }));
            Setting.WS = this;
        }, false);
        ws.addEventListener("message", function (event) {
            let data = JSON.parse(event.data);
            switch (data.type) {
                case 5:
                    clearTimeout(Setting.WebSocketID);
            }
        }, false);
    }
}
function Crc32(str) {
    var crcTable = window.crcTable;
    var crc = 0 ^ (-1);
    for (var i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
}
function Panel() {
    let css = document.createElement("style");
    css.innerText = "#div1Panel{z-index:99999;position:absolute;right:10px;top:10px;background-color:#CAE8CA;border:2px solid #4CAF50;padding:5px;width:300px;font-size:14px;}.h3Panel{text-align:center;margin-top:0px!important;margin-bottom:0px;}.s1lPanel{display:inline-block;width:70%;font-weight:bold!important;}.srPanel{display:inline-block;}.s2lPanel{display:inline-block;width:70%;}.numberBox{width:50px!important;height:19px;}";
    document.body.appendChild(css);
    let panel = document.createElement("div");
    panel.setAttribute("id", "div1Panel");
    panel.innerHTML = `<h3 class="h3Panel">优学院脚本</h3><div><span class="s1lPanel">自动播放视频</span><span class="srPanel"><input id="Video"type="checkbox"></span></div><div><span class="s2lPanel">音量（0~100）</span><span class="srPanel"><input id="Volume"class="numberBox"type="number"value="0"step="1"min="0"max="100"></span></div><div><span class="s2lPanel">速度（0.5~15）</span><span class="srPanel"><input id="Speed"class="numberBox"type="number"value="1"step="0.5"min="0.5"max="15"></span></div><div><span class="s1lPanel">自动答题</span><span class="srPanel"><input id="Answer"type="checkbox"></span></div><div><span class="s2lPanel">强制提交</span><span class="srPanel"><input id="ForcePut"type="checkbox"></span></div><div><span class="s2lPanel">延时提交（秒）</span><span class="srPanel"><input id="WaitPut"class="numberBox"type="number"value="0"step="1"min="0"></span></div><div><span class="s1lPanel">自动换页</span><span class="srPanel"><input id="NextPage"type="checkbox"></span></div><div><span class="s2lPanel">换页等待时间（秒）</span><span class="srPanel"><input id="WaitNextPage"class="numberBox"type="number"value="0"step="1"min="0"></span></div><div><span class="s1lPanel">完成后自动关闭网页</span><span class="srPanel"><input id="AutoExit"type="checkbox"></span></div><div><span class="s1lPanel">脚本运行异常？</span><span class="srPanel"><button id="putBug">提交BUG</button></span></div><div id="uploadBug"style="display: none;"><div style="color: blue;">请切换到有问题的页面，然后下面输入出现的问题，最后点击“上传BUG”按钮<br /><span style="color: red;">上传内容有：输入的问题，当前网页内容，脚本运行日志。</span></div><textarea id="bugDetail"placeholder="在此输入出现的问题"style="width: 100%;"></textarea><div><button id="buttonUploadBug">上传BUG</button></div></div><div><span class="s1lPanel"></span><span class="srPanel"><button id="checkDetail">查看状态</button></span></div><div id="runDetail"style="display: none;"><div><span style="display: inline-block; width: 50%;">自动播放：<span style="color: red"id="videoState">已关闭</span></span><span class="srPanel">自动答题：<span style="color: red;"id="answerState">已关闭</span></span></div><div><span style="display: inline-block; width: 50%;">自动翻页：<span style="color: red;"id="nextState">已关闭</span></span><span class="srPanel">当前页面视频数量：<span style="color: red;"id="videoCount">0</span></span></div></div>`;
    document.body.appendChild(panel);
    document.querySelector("#div1Panel") && Bind() && (function () {
        Setting.PageChange = new Date().getTime();
        ListenPageChange();
        Setting.VideoID = setInterval(Video, Setting.VideoTime);
        Setting.QuestionID = setInterval(Question, Setting.QuestionTime);
        setTimeout(NextPage, Setting.NextPageTime);
        DealBounced();
    })();
}
function DealBounced() {
    let csp = document.querySelector("button[data-bind='click: closeStatPage']");
    if (csp) {
        if (Setting.AutoExit == "1") {
            let btc = document.querySelector("[data-bind='text: i18nMessageText().backToCourse']");
            if (btc) {
                btc.click();
            }
            else if ("koLearnCourseViewModel" in self_ && "goBack" in self_["koLearnCourseViewModel"]) {
                self_["koLearnCourseViewModel"]["goBack"]();
            }
        }
    }
    else {
        let am = document.querySelector("#alertModal");
        if (am && am.getAttribute("style")?.indexOf("display: block") !== -1) {
            let gnp = document.querySelector("button[data-bind='click: goNextPage']");
            if (gnp) {
                gnp.click();
            }
            let cl = document.querySelector("button[data-bind='text: $root.i18nMsgText().confirmLeave']");
            if (cl) {
                cl.click();
            }
            let gI = document.querySelector("button[data-bind='text: $root.i18nMsgText().gotIt']");
            if (gI) {
                gI.click();
            }
            let cs = document.querySelector("button[data-bind='text: $root.i18nMsgText().continueStudy']");
            if (cs) {
                cs.click();
            }
        }
    }
    let jf = document.querySelector(".jconfirm-buttons");
    if (jf) {
        let jfb = jf.querySelector(":nth-child(1)");
        if (jfb) {
            jfb.click();
        }
    }
    setTimeout(DealBounced, Setting.DealBouncedTime);
}
function ReSet() {
    Setting.AnswerCount = 0;
    Setting.NextPageCount = 0;
}
function NextPage() {
    if (Setting.NextPageChange != Setting.PageChange) {
        Setting.NextPageChange = Setting.PageChange;
        ReSet();
        setTimeout(NextPage, Setting.BeforeNext);
        return;
    }
    (function () {
        if (Setting.NextPage == "0") {
            ReSet();
            return;
        }
        if (!GetVideo().every(function (item) { return item.Done; }) && Setting.Video == "1") {
            ReSet();
            return;
        }
        if (!QuestionArray.every(function (item) { return item.Status >= 3; })) {
            ReSet();
            return;
        }
        if (QuestionArray.length != 0 && (QuestionArray.every(function (item) { return item.Status == 3; }) || Setting.ForcePut == "1")) {
            if (Setting.AnswerCount < parseFloat(Setting.WaitPut) * 1000) {
                Setting.AnswerCount += Setting.NextPageTime;
                return;
            }
            else {
                let sQ = document.querySelector("button[data-bind='text: $root.i18nMessageText().submit, click: submitQuiz']");
                if (sQ) {
                    sQ.click();
                }
            }
        }
        if (Setting.NextPageCount < parseFloat(Setting.WaitNextPage) * 1000) {
            Setting.NextPageCount += Setting.NextPageTime;
            return;
        }
        let np = document.querySelector("span[class='text: i18nMessageText().nextPage']");
        if (np) {
            np.click();
        }
        else if ("koLearnCourseViewModel" in self_ && "goNextPage" in self_["koLearnCourseViewModel"]) {
            self_["koLearnCourseViewModel"]["goNextPage"]();
        }
        ReSet();
    })();
    setTimeout(NextPage, Setting.NextPageTime);
}
function FillAnswer(QuestionArray, QuestionAnswer) {
    switch (QuestionArray.QuestionType) {
        case "1":
        case "2":
            (function () {
                let options = QuestionArray.Ele.querySelectorAll(".choice-item");
                QuestionAnswer.correctAnswerList.forEach(function (item) {
                    let index = item.charCodeAt(0) - 65;
                    index >= 0 && index < options.length && options[index] && (function () {
                        options[index].click();
                        return true;
                    })() || (QuestionArray.Status = 5);
                });
            })();
            break;
        case "3":
            (function () {
                let blanks = QuestionArray.Ele.querySelectorAll("input");
                blanks.length == QuestionAnswer.correctAnswerList.length && (function () {
                    QuestionAnswer.correctAnswerList.forEach(function (item, index) {
                        let key = item.split("//");
                        blanks[index].value = key[0];
                    });
                    return true;
                })() || (QuestionArray.Status = 5);
            })();
            break;
        case "4":
            let right = QuestionArray.Ele.querySelector(".right-btn");
            let wrong = QuestionArray.Ele.querySelector(".wrong-btn");
            right && wrong && (function () {
                QuestionAnswer.correctAnswerList[0] == "true" && (function () {
                    right.click();
                    return true;
                })() || QuestionAnswer.correctAnswerList[0] == "false" && (function () {
                    wrong.click();
                    return true;
                })() || (QuestionArray.Status = 5);
                return true;
            })() || (QuestionArray.Status = 5);
            break;
        case "5":
            let shortAnswer = QuestionArray.Ele.querySelector("textarea");
            shortAnswer && (function () {
                shortAnswer.value = QuestionAnswer.correctAnswerList[0] || "言之有理即可";
                let event = document.createEvent("Events");
                event.initEvent("change", true, true);
                shortAnswer.dispatchEvent(event);
                return true;
            })() || (QuestionArray.Status = 5);
            break;
        case "17":
        case "23":
        case "11":
            let selects = QuestionArray.Ele.querySelectorAll("select");
            selects.length == QuestionAnswer.subQuestionAnswerDTOList.length && (function () {
                selects.forEach(function (item, index) {
                    item.click();
                    let key = QuestionAnswer.subQuestionAnswerDTOList[index].correctAnswerList[0].charCodeAt(0) - 65;
                    let options = QuestionArray.Ele.querySelectorAll(".option");
                    key >= 0 && key < options.length && (function () {
                        options[key].click();
                        return true;
                    })() || (QuestionArray.Status = 5);
                });
                return true;
            })() || (QuestionArray.Status = 5);
            break;
        case "12":
            (function () {
                let choices = QuestionArray.Ele.querySelectorAll(".choice-item");
                let areas = QuestionArray.Ele.querySelectorAll(".show-answer-area .answer-item .answer-blank");
                choices.length == areas.length && QuestionAnswer.correctAnswerList.length == areas.length && (function () {
                    QuestionAnswer.correctAnswerList.forEach(function (item, index) {
                        areas[index].innerText = item;
                        choices[index].parentNode?.appendChild(choices[index]);
                    });
                })() || (QuestionArray.Status = -5);
                return true;
            })();
            break;
    }
    QuestionArray.Status != 5 && (QuestionArray.Status = 3);
}
function Question() {
    if (Setting.Answer == "0") {
        return;
    }
    if (QuestionArray.length) {
        QuestionArray.every(function (item) {
            if (!document.documentElement.contains(item.Ele)) {
                QuestionArray = [];
                return false;
            }
        });
        QuestionArray.every(function (item) {
            if (item.Status == 0) {
                item.Status = 1;
                try {
                    let xhr = new XMLHttpRequest();
                    xhr.addEventListener("load", function () {
                        item.Status = 2;
                        try {
                            FillAnswer(item, JSON.parse(this.responseText));
                        }
                        catch (e) {
                            item.Status = 4;
                        }
                    }, false);
                    xhr.addEventListener("error", function () {
                        item.Status = 4;
                    }, false);
                    xhr.open("GET", "https://api.ulearning.cn/questionAnswer/" + item.QuestionID + "?parentId=" + item.ParentID);
                    xhr.send();
                }
                catch (e) {
                    item.Status = 4;
                }
            }
            return true;
        });
    }
    else if (document.querySelector(".page-item [class*='active']")) {
        let qUTS = document.querySelector("[data-bind='i18n: $root.i18nMsgText().points, places: { n: questionUserTotalScore() }']");
        if (qUTS && qUTS.innerText == "100分") {
            return;
        }
        let rD = document.querySelector("button[class='btn-hollow btn-redo']");
        rD && rD.click();
        let pEle = document.querySelector(".page-item [class*='active']")?.parentElement;
        if (!pEle || !pEle.id.match(/page(\d+)/)) {
            return;
        }
        let PID = pEle.id.match(/page(\d+)/)[1];
        document.querySelectorAll("div[id^='question']").forEach(function (ele) {
            if (ele.querySelector("div[id^='question']")) {
                return;
            }
            let QT = ele.querySelector("span[class*='question-title-html question-type-']");
            if (!QT || !QT.className.match(/question-type-(\d+)/)) {
                return;
            }
            ;
            let QTID = QT.className.match(/question-type-(\d+)/)[1];
            if (SupportType.indexOf(QTID) == -1) {
                return;
            }
            if (!ele.id.match(/question(\d+)/)) {
                return;
            }
            let QID = ele.id.match(/question(\d+)/)[1];
            QuestionArray.push({
                Ele: ele,
                QuestionType: QTID,
                QuestionID: QID,
                ParentID: PID,
                Status: 0
            });
        });
    }
}
function Video() {
    let VideoArray = (Setting.Video === "0" && []) || GetVideo();
    let finish = true;
    VideoArray.forEach(function (ele) {
        finish && (function () {
            !ele.Done && (function () {
                finish = false;
                ele.VideoEle.paused && ele.VideoEle.play().catch(function () {
                    ele.VideoEle.currentTime > 3 && (function () {
                        ele.VideoEle.currentTime -= 3;
                    })();
                });
                ele.VideoEle.volume.toString() != Setting.Volume && (function () {
                    switch (Setting.Volume) {
                        case "0":
                            ele.VideoEle.muted = true;
                            break;
                        default:
                            ele.VideoEle.volume = parseFloat(Setting.Volume) * 0.01 || 0;
                    }
                    ;
                })();
                ele.VideoEle.playbackRate.toString() != Setting.Speed && (function () {
                    ele.VideoEle.playbackRate = parseFloat(Setting.Speed);
                })();
            })();
        })();
    });
}
function GetVideo() {
    let VideoArray = [];
    document.querySelectorAll(".video-container").forEach(function (ele) {
        let video = ele.querySelector("video");
        let info = (ele.querySelector("span[data-bind='text: $root.i18nMessageText().unviewed']") ||
            ele.querySelector("span[data-bind='text: $root.i18nMessageText().viewed']") ||
            ele.querySelector("span[data-bind='text: $root.i18nMessageText().finished']"));
        video && info && (function (video, info) {
            switch (info.getAttribute("data-bind")) {
                case "text: $root.i18nMessageText().unviewed":
                case "text: $root.i18nMessageText().viewed":
                    VideoArray.push({
                        VideoEle: video,
                        Done: false,
                    });
                    break;
                case "text: $root.i18nMessageText().finished":
                    video.paused && VideoArray.push({
                        VideoEle: video,
                        Done: true,
                    }) || VideoArray.push({
                        VideoEle: video,
                        Done: false,
                    });
            }
        })(video, info);
    });
    return VideoArray;
}
function ListenPageChange() {
    let targetNode = document.querySelector(".catalog-list");
    if (targetNode !== null) {
        let config = { childList: false, attributes: true, subtree: true };
        let observer = new MutationObserver(function (mutationList, observer) {
            mutationList.forEach((mutation) => {
                switch (mutation.type) {
                    case 'attributes':
                        if (mutation.attributeName === "class") {
                            if (mutation.target.className.indexOf("active") != -1) {
                                if (Setting.PageElement !== mutation.target) {
                                    Setting.PageElement = mutation.target;
                                    Setting.PageChange = new Date().getTime();
                                }
                            }
                        }
                }
            });
        });
        observer.observe(targetNode, config);
    }
    else {
        setTimeout(ListenPageChange, 100);
    }
}
function Bind() {
    document.querySelector("#div1Panel").querySelectorAll("input").forEach(function (ele) {
        ele.id && (function (self) {
            switch (self.type) {
                case "checkbox":
                    switch (GetSet(self.id, "0")) {
                        case "1":
                            self.checked = true;
                            break;
                        case "0":
                            self.checked = false;
                            break;
                    }
                    Setting[self.id] = GetSet(self.id, "0");
                    break;
                case "number":
                    self.value = GetSet(self.id, self.value);
                    Setting[self.id] = GetSet(self.id, self.value);
                    break;
            }
        })(ele);
        ele.addEventListener("change", function () {
            this.id && (function (self) {
                switch (self.type) {
                    case "checkbox":
                        switch (self.checked) {
                            case true:
                                SaveSet(self.id, "1");
                                break;
                            case false:
                                SaveSet(self.id, "0");
                        }
                        break;
                    case "number":
                        SaveSet(self.id, self.value);
                        break;
                }
            })(this);
        }, false);
    });
    document.querySelector("#div1Panel").querySelectorAll("button").forEach(function (ele) {
        ele.id && (function () {
            ele.addEventListener('click', function () {
                switch (ele.id) {
                    case "putBug":
                        ele.disabled = true;
                        document.querySelector("#uploadBug").setAttribute("style", "display: block;");
                        break;
                    case "buttonUploadBug":
                        let textarea = document.querySelector("#bugDetail");
                        if (textarea.value) {
                            ele.disabled = true;
                            WebSocketSend.push({
                                type: 3,
                                detail: textarea.value,
                                html: document.documentElement.outerHTML,
                                errors: Bug,
                                logs: Log,
                            });
                            Bug = {};
                            Log = {};
                            ele.innerText = "上传成功";
                            setTimeout(function () {
                                document.querySelector("#uploadBug").setAttribute("style", "display: none;");
                                textarea.value = "";
                                ele.innerText = "上传Bug";
                                ele.disabled = false;
                                document.querySelector("#putBug").disabled = false;
                            }, 3000);
                        }
                        else {
                            ele.innerText = "请填写问题！";
                            setTimeout(function () {
                                ele.innerText = "上传Bug";
                            }, 3000);
                        }
                        break;
                    case "checkDetail":
                        let rd = document.querySelector("#runDetail");
                        rd && (function () {
                            if (rd.getAttribute("style") == "display: none;") {
                                rd.setAttribute("style", "display: block;");
                            }
                            else {
                                rd.setAttribute("style", "display: none;");
                            }
                        })();
                        break;
                }
            }, false);
        })();
    });
    return true;
}
function GetSet(key, def) {
    def = def || "";
    Log[new Date().getTime().toString()] = "Get: " + key + "=" + localStorage.getItem(key) || def;
    Detail(key, localStorage.getItem(key) || def);
    return localStorage.getItem(key) || def;
}
function SaveSet(key, value) {
    Setting[key] = value;
    localStorage.setItem(key, value);
    Log[new Date().getTime().toString()] = "Set: " + key + "=" + value;
    Detail(key, value);
}
function Detail(k, v) {
    let spanState = null;
    switch (k) {
        case "Video":
            spanState = document.querySelector("#videoState");
            break;
        case "Answer":
            spanState = document.querySelector("#answerState");
            break;
        case "NextPage":
            spanState = document.querySelector("#nextState");
            break;
    }
    spanState && (function () {
        switch (v) {
            case "0":
                spanState.innerText = "已关闭";
                spanState.setAttribute("style", "color: red;");
                break;
            case "1":
                spanState.innerText = "已开启";
                spanState.setAttribute("style", "color: green;");
                break;
        }
    })();
}
function Exam() {
    Array.prototype.slice.call(document.querySelectorAll("script")).some(function (item) {
        let m = item.text.match(/"\/umooc\/learner\/exam.do\?operation=getCorrectAnswer&paperID=(\d+)&examID=(\d+)"\,/);
        if (m && self_["exam"] && self_["exam"]["userID"]) {
            let pid = m[1];
            let eid = m[2];
            WebSocketSend.push({
                type: 8,
                eid: eid,
                pid: pid,
            });
            let xhr1 = new XMLHttpRequest();
            xhr1.open("GET", "https://www.ulearning.cn/umooc/learner/exam.do?operation=getCorrectAnswer&paperID=" + pid + "&examID=" + eid);
            xhr1.addEventListener("load", function () {
                WebSocketSend.push({
                    type: 7,
                    paperID: pid,
                    paperAnswer: JSON.parse(this.responseText),
                });
            }, false);
            xhr1.send();
            let xhr2 = new XMLHttpRequest();
            xhr2.open("GET", "https://www.ulearning.cn/umooc/learner/exam.do?operation=getPaperForStudent&paperID=" + pid + "&examId=" + eid + "&userId=" + self_["exam"]["userID"]);
            xhr2.addEventListener("load", function () {
                WebSocketSend.push({
                    type: 6,
                    paperID: pid,
                    paper: JSON.parse(this.responseText),
                });
            }, false);
            xhr2.send();
            return true;
        }
    }) || setTimeout(Exam, 1000);
}
function LogRecord() {
    if (Setting.PageChange != Setting.LogRecordChange) {
        Setting.LogRecordChange = Setting.PageChange;
        Log[new Date().getTime().toString()] = "Page Change";
    }
    else {
        oldVideos = oldVideos || [];
        let videos = GetVideo();
        (oldVideos.length != videos.length || !videos.every(function (value, index) {
            if (value.VideoEle != oldVideos[index].VideoEle) {
                return false;
            }
            else {
                return true;
            }
        })) && (function () {
            Log[new Date().getTime().toString()] = "video: " + videos.length.toString();
            document.querySelector("#videoCount").innerText = videos.length.toString();
            oldVideos = videos;
        })();
    }
}
if (location.href.match(/https:\/\/ua.ulearning.cn\/learnCourse\/learnCourse.html/)) {
    window.addEventListener("error", function (error) {
        let e = error.error;
        if (e) {
            let msg = (e || "").toString();
            let stack = e.stack;
            Bug[(new Date().getTime()).toString()] = "message: " + msg + "\nstack:" + stack;
        }
    }, false);
    navigator.__defineGetter__('userAgent', function () {
        return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36';
    });
    Panel();
}
else if (location.href.match(/https:\/\/www.ulearning.cn\/umooc\/user\/study.do/)) {
    document.addEventListener("DOMContentLoaded", Exam, false);
}
