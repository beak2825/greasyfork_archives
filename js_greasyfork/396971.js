// ==UserScript==
// @name         domooc
// @namespace    https://lolzyx.xyz/
// @version      1.3.6
// @description  自动完成你的mooc作业
// @author       112233@163
// @match        https://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/spoc/learn/*
// @match        https://www.icourse163.org/spoc/learn/*
// @connect      lolzyx.xyz
// @connect      localhost
// @grant        unsafewindow
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/396971/domooc.user.js
// @updateURL https://update.greasyfork.org/scripts/396971/domooc.meta.js
// ==/UserScript==
(function() {
    let timeout = 500; //答题延时，每两道题之间的时间间隔
    let version = "135";
    let qqgroup = 902070562;
    let domooc = {};
    let window = unsafeWindow;
    if (window.scriptloaded) {
        return;
    }
    let zyxconsole = {
        log:  function() {},
        error: function() {}
    };
    window.onload = function() {
        let zyxtrim = function(str) { return str.replace(/\s+/g, ""); };
        let zyxformat = function(str) {
            let htmlDecode = function(_str) {
                var s = "";
                if (_str.length == 0) return "";
                s = _str.replace(/&lt;/g, "<");
                s = s.replace(/&gt;/g, ">");
                s = s.replace(/&nbsp;/g, " ");
                s = s.replace(/&#39;/g, "\'");
                s = s.replace(/&quot;/g, "\"");
                s = s.replace(/&amp;/g, "&");
                return s;
            }
            var regx = /<[img ]{3,}[\S]+?[https]{3,4}:\/\/([\S]+?\.[pngjeifbm]{3,4})[\S]+?>/gi;
            var regx2 = /\<[\S ]+?\>/ig;
            return zyxtrim(htmlDecode(str)).replace(regx, "$1").replace(regx2, "");
        }
        let zyxremove = function(arr, val) {
            var index = arr.indexOf(val);
            while (index > -1) {
                arr.splice(index, 1);
                index = arr.indexOf(val);
            }
            return arr;
        };
        let zyxunique = function(arr, compareFn) {
            arr.sort(compareFn);
            var re = [arr[0]];
            for (var i = 1; i < arr.length; i++) {
                if (compareFn(arr[i], re[re.length - 1]) !== 0) {
                    re.push(arr[i]);
                }
            }
            return zyxremove(re, undefined);
        };
        let baseurl = 'https://lolzyx.xyz/api/';
        //let baseurl = 'http://localhost:8010/api/';
        let url = {
            getanswer: baseurl + 'getanswer',
            check: baseurl + 'checkcourse',
            userMessage: baseurl + 'userMessage',
            upsertQuizpaper: baseurl + 'upsertquizpaper',
        };

        function initParams() {
            domooc.quizs = null;
            domooc.exceptionflag = false;
            domooc.quizpaper = {};
            domooc.qb = {};
            domooc.quiztests = [];
            domooc.termid = 0;
            domooc.courseid = 0;
        }

        function hook() {
            if (!domooc._remoteHandleCallback) {
                domooc._remoteHandleCallback = window.dwr.engine._remoteHandleCallback;
                window.dwr.engine._remoteHandleCallback = function(batchId, status, obj) {
                    domooc._remoteHandleCallback(batchId, status, obj);
                    zyxconsole.log({ batchId, status, obj });
                    if (!!obj) { //取得题目json;
                        domooc.quizpaper = obj;
                        if (obj.objectiveQList && obj.submitStatus === 1) {
                            getAnswerflag = false;
                            getAnswer(obj);
                        } else if (obj.objectiveQList && obj.submitStatus === 2) {
                            analysisAnswer(obj);
                        } else if (obj.paper && obj.paper.objectiveQList && obj.paper.objectiveQList.length) {
                            answerClassTest(obj.paper);
                        }
                    } else if (obj === 0 && domooc.quizbank) {
                        view.showQuizbank();
                    }
                };
            }
        }

        function userMessage(msg) {
            view.addInfo("正在留言...");
            let data = getInitialData();
            data.user = getUser();
            data.message = msg;
            GM_xmlhttpRequest({
                method: 'POST',
                url: url.userMessage,
                data: JSON.stringify(data),
                headers: {
                    'charset': 'UTF-8',
                    "Content-Type": "text/plain"
                },
                onerror: (error) => {
                    //zyxconsole.log({ onerror: error });
                    view.addInfo("留言失败！", "网络或服务器错误");
                },
                ontimeout: (error) => {
                    //zyxconsole.log({ ontimeout: error });
                    view.addInfo("留言失败！", "网络超时");
                },
                onload: response => {
                    if (response.status == 200) {
                        let res = JSON.parse(response.responseText);
                        zyxconsole.log(res);
                        if (res.error) {
                            view.addInfo("留言失败！", res.detail);
                        } else {
                            view.addInfo("留言成功！");
                        }
                    } else {
                        getAnswerflag = false;
                        view.addInfo("留言失败！");
                        zyxconsole.log({
                            err: response
                        });
                    }
                }
            });
        }
        let view = {
            config: {
                tabon: 'u-curtab',
            },
            infoqueue: {
                arr: [],
                idx: 0,
                length: 7,
                put: function(msg) {
                    this.arr[this.idx % this.length] = msg;
                    this.idx = (this.idx + 1) % this.length;
                },
                get: function(num) {
                    return this.arr[(this.idx + num) % this.length];
                }
            },
            buttons: [{
                text: "使用说明/更新脚本",
                href: "https://greasyfork.org/zh-CN/scripts/396410-domooc"
            }, {
                text: "向我留言",
                onclick: function() {
                    var txt = "留言板";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.input, {
                        onOk: function(v) {
                            userMessage(v);
                        }
                    });
                }
            }, {
                text: "捐赠作者",
                href: `https://lolzyx.xyz/donate?id=${getUser().id}&loginId=${getUser().loginId}&passport=${getUser().passport}`
            }, {
                text: "用户信息",
                onclick: function() {
                    var txt = "上传给服务器的信息：";
                    let user = getUser();
                    for (let key in user) {
                        txt = txt + "<br>" + key + "：" + user[key]
                    }
                    var option = {
                        title: "用户信息",
                        btn: parseInt("0011", 2),

                    }
                    window.wxc.xcConfirm(txt, "custom", option);
                }
            }, {
                text: "收起面板",
                onclick: function(e) {
                    let displaytext = $(this).children().text() === "展开面板" ? "收起面板" : "展开面板";
                    $(this).children().text(displaytext);
                    $(this).siblings().animate({
                        width: 'toggle'
                    }, function() { view.sidebarOffset(); });
                    $("#sidebar ul:eq(0)").animate({
                        width: 'toggle'
                    }, function() { view.sidebarOffset(); });
                    $(this).children().text(displaytext);
                }
            }],
            refreshBtnList() {
                let btnlist = this.sidebar.children()[1];
                btnlist = $(btnlist);
                btnlist.empty();
                this.buttons.forEach(btn => {
                    let li = $(`<li class="u-greentab j-tabitem f-f0 domooc"><a class="f-thide f-fc3 " style="font-weight:bold;padding:0;text-align:center;background-color:transparent;" href="${btn.href?btn.href:'#'}" target="${btn.href?"_blank":""}">${btn.text}</a></li>`);
                    if (typeof btn.onclick === "function") {
                        li.click(btn.onclick);
                    }
                    btnlist.append(li);
                });
                $("li.domooc a:hover").css("background-color", "transparent");
                this.sidebarOffset();
            },
            addInfo(...msg) {
                msg.forEach(ele => {
                    if (ele && (typeof ele !== "string") && ele.length) {
                        for (let i = 0; i < ele.length; i++) {
                            this.infoqueue.put(ele[i]);
                        }
                    } else if (typeof ele === "string") {
                        this.infoqueue.put(ele);
                    }
                });
                let infolist = this.sidebar.children()[0];
                infolist = $(infolist);
                infolist.empty();
                let lis = [];
                for (let i = 0; i < this.infoqueue.length; i++) {
                    let info = this.infoqueue.get(i);
                    if (info) {
                        let li = $(`<li class="u-greentab j-tabitem f-f0 first u-curtab"><a class="f-thide f-fc3" style="font-size:1em;">${info}</a></li>`);
                        infolist.append(li);
                        lis.push(li);
                    }
                    if (lis.length === this.infoqueue.length) {
                        lis[0].fadeOut(1000, function() { view.sidebarOffset(); });
                        lis[this.infoqueue.length - 1].hide();
                        lis[this.infoqueue.length - 1].fadeIn(1000, function() { view.sidebarOffset(); });
                    }
                }
                this.sidebarOffset();
            },
            showServerMsg(msgobj) {
                var txt = (typeof msgobj === "string") ? msgobj : msgobj.message;
                var option = {
                    title: msgobj.title ? msgobj.title : "您有一条新消息",
                    btn: parseInt("0011", 2),

                }
                window.wxc.xcConfirm(txt, "custom", option);
            },
            sidebar: $('<div id="sidebar" style="position: absolute;"></div>'),
            sidebarOffset: function() {
                let sidebar = this.sidebar;
                sidebar.offset({ top: $(window).scrollTop() + $(window).height() / 2 - sidebar.height() / 2, left: $(window).width() - sidebar.width() });
            },
            showQuizbank(quizbank) {
                if (!quizbank) {
                    quizbank = domooc.quizbank;
                } else {
                    domooc.quizbank = quizbank;
                }
                if (!quizbank) {
                    courseCheck();
                    return;
                }
                let names = quizbank.map(x => x.name);
                let intHandler = window.setInterval(() => {
                    let length = names.length;
                    let jnames = $("div.titleBox h4.j-name");
                    if (jnames.length > 0) {
                        jnames.each(function() {
                            var title = zyxformat($(this)[0].innerText);
                            clear = (text) => {
                                return $(this).text().replace("<success>", "").replace("<fail>", "")
                            }
                            $(this).text()
                            if (names.indexOf(title) > -1 && length) {
                                length--;
                                $(this).attr("style", "color:RGB(85,185,41)");
                                $(this).text(clear($(this).text()) + "  <success>");
                            } else {
                                $(this).attr("style", "color:red");
                                if ($(this).text().indexOf("<fail>") === -1) {
                                    $(this).text(clear($(this).text()) + "  <fail>");
                                }
                                if ($(this).siblings("a.j-quizBtn")[0].innerText.indexOf("作业") == -1) {
                                    // sendWrong(title);
                                }
                            }
                        });
                        window.clearInterval(intHandler);
                    }
                }, 500);
            },
            init: function() {
                let that = this;
                let sidebar = this.sidebar;
                let infolist = $('<ul id="j-courseTabList" class="tab u-tabul"></ul>');
                let btnlist = $('<ul id="j-courseTabList" class="tab u-tabul"></ul>');

                function sidebarOffset(sidebar) {
                    sidebar.offset({ top: $(window).scrollTop() + $(window).height() / 2 - sidebar.height() / 2, left: $(window).width() - sidebar.width() });
                }
                sidebar.append(infolist);
                sidebar.append(btnlist);
                $('body').append(sidebar);
                this.addInfo("插件加载成功", "题库将在每天早上更新~", "交流群：" + qqgroup);
                this.refreshBtnList();
                sidebarOffset(sidebar);
                window.onscroll = function() {
                    sidebarOffset(sidebar);
                }
            },
        }
        domooc.view = view;

        function getUser() {
            return {
                id: window.webUser.id,
                email: window.webUser.email ? window.webUser.email : "无",
                nickName: window.webUser.nickName,
                loginId: window.webUser.loginId,
                personalUrlSuffix: window.webUser.personalUrlSuffix,
                loginId: window.webUser.loginId
            }
        }

        function answerClassTest(paper) {
            let quizs = paper.objectiveQList;
            let answers = [];
            let data = getInitialData();
            data.quizpaper = paper;
            data.user = getUser();
            data.type = "classtest";
            GM_xmlhttpRequest({
                method: 'POST',
                url: url.upsertQuizpaper,
                data: JSON.stringify(data),
                headers: {
                    'charset': 'UTF-8',
                    "Content-Type": "text/plain"
                }
            });
            quizs.forEach((ele, idx) => {
                let obj = {
                    id: ele.id,
                    type: ele.type,
                    answer: []
                };
                if ([1, 2, 4].indexOf(ele.type) > -1) {
                    ele.optionDtos.forEach((ele2, idx2) => {
                        if (ele2.answer) {
                            obj.answer.push(idx2);
                        }
                    });
                } else {
                    let correct = ele.stdAnswer.split("##%_YZPRLFH_%##");
                    correctOpt = null;
                    let len = correct.length;
                    for (let i = 0; i < len; i++) {
                        let ele2 = correct[i];
                        if (ele2.indexOf(' ') === -1) {
                            correctOpt = ele2;
                            break;
                        }
                    }
                    correctOpt = correctOpt ? correctOpt : correct[len - 1];
                    obj.answer = correctOpt;
                }
                answers.push(obj);
            });
            answerAll(answers);
        }

        function answerAll(quizanswers) {
            try {
                let answers = quizanswers;
                let cnt = 0;
                $('div.m-data-lists.f-cb.f-pr.j-data-list').children().each((idx, ele) => {
                    cnt++;
                    window.setTimeout(() => {
                        let answerflag = false;
                        if ([1, 2, 4].indexOf(answers[idx].type) > -1) {
                            $(ele).find('input').each((idx2, input) => {
                                if (answers[idx].answer.indexOf(idx2) > -1) {
                                    if ((answers[idx].type === 2 && !$(input).is(':checked')) || [1, 4].indexOf(answers[idx].type) > -1) {
                                        answerflag = true;
                                        $(input).click();
                                    }
                                } else if (answers[idx].type === 2 && $(input).is(':checked')) {
                                    $(input).click();
                                }
                            });
                        } else if (answers[idx].type === 3) {
                            let textarea = $(ele).find("textarea.j-textarea.inputtxt")[0];
                            let label = $(ele).find("label.j-hint")[0];
                            label.click();
                            textarea.click();
                            textarea.focus();
                            if (answers[idx].answer && (typeof answers[idx].answer === "string")) {
                                textarea.value = answers[idx].answer;
                                answerflag = true;
                            }
                        }
                        if (!answerflag) {
                            $(ele).css("background-color", "rgb(254, 255, 209)");
                        }
                    }, ((timeout < 200 ? 200 : timeout) + Math.random() * 300) * cnt);
                });
                view.addInfo("自动答题成功！");
                view.addInfo("请检查是否有遗漏");
                view.addInfo("交流群：" + qqgroup);
            } catch (error) {
                view.addInfo("自动答题失败！");
                view.addInfo("交流群：" + qqgroup);
            }
        }
        let upsertQuizpaperflag = false;

        function analysisAnswer(quizpaper) {
            if (upsertQuizpaperflag) return;
            let answers = quizpaper.answers;
            let qlist = quizpaper.objectiveQList;
            let answs = {};
            let allright = true;
            if (!(answers instanceof Array)) {
                allright = false
            } else if (answers.lengh < qlist.lengh) {
                allright = false
            } else {
                answers.forEach(ele => {
                    if ([1, 2, 4].indexOf(ele.type) > -1) {
                        answs[ele.qid] = {
                            optIds: (ele.optIds instanceof Array) ? ele.optIds : []
                        }
                    } else {
                        answs[ele.qid] = {
                            content: ele.content.content
                        }
                    }
                });
                qlist.forEach((ele) => {
                    if ([1, 2, 4].indexOf(ele.type) > -1) {
                        ele.optionDtos.forEach(opt => {
                            if ((opt.answer && answs[ele.id].optIds.indexOf(opt.id) < 0) || (!opt.answer && answs[ele.id].optIds.indexOf(opt.id) > -1)) {
                                allright = false;
                            }
                        });
                    } else {
                        if (ele.stdAnswer.split("##%_YZPRLFH_%##").indexOf(answs[ele.id]) < 0) {
                            allright = false;
                        }
                    }
                });
            }
            if (!allright) {
                let data = getInitialData();
                data.quizpaper = quizpaper;
                data.user = getUser();
                data.type = "quizbank";
                zyxconsole.log({ getAnswer: data });
                view.addInfo("检测到题库错误，正在上传...");
                upsertQuizpaperflag = true;
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: url.upsertQuizpaper,
                    data: JSON.stringify(data),
                    headers: {
                        'charset': 'UTF-8',
                        "Content-Type": "text/plain"
                    },
                    onerror: (error) => {
                        //zyxconsole.log({ onerror: error });
                        upsertQuizpaperflag = false;
                        view.addInfo("结果分析失败！", "如答案有错请向我留言");
                    },
                    ontimeout: (error) => {
                        //zyxconsole.log({ ontimeout: error });
                        upsertQuizpaperflag = false;
                        view.addInfo("结果分析失败！", "如答案有错请向我留言");
                    },
                    onload: response => {
                        if (response.status == 200) {
                            upsertQuizpaperflag = false;
                            let res = JSON.parse(response.responseText);
                            zyxconsole.log(res);
                            if (res.message) {
                                view.addInfo(res.message);
                            }
                            if (res.button) {
                                view.buttons.push(res.button);
                                view.refreshBtnList();
                            }
                            view.addInfo("错误上传成功！");
                        } else {
                            upsertQuizpaperflag = false;
                            view.addInfo("结果分析失败！", "如答案有错请向我留言");
                            zyxconsole.log({
                                err: response
                            });
                        }
                    }
                });
                upsertQuizpaperflag = true;
            }
            zyxconsole.log({
                analysisAnswer: quizpaper
            })
        }
        let getAnswerflag = false;

        function getAnswer(quizpaper) {
            if (getAnswerflag) {
                return;
            }
            let data = getInitialData();
            if (data.courseid && data.termid) {
                data.testid = quizpaper.tid;
                data.quizs = [];
                data.user = getUser();
                quizpaper.objectiveQList.forEach(t => {
                    let obj = { id: t.id, type: t.type, title: zyxformat(t.title) };
                    if (t.type == 1 || t.type == 2 || t.type == 4) {
                        obj.optIds = t.optionDtos.map(x => { return x.id });
                        obj.optContent = t.optionDtos.map(x => { return zyxformat(x.content) });
                    }
                    data.quizs.push(obj);
                });
                view.addInfo("正在获取答案...");
                getAnswerflag = true;
                zyxconsole.log({ getAnswer: data })
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: url.getanswer,
                    data: JSON.stringify(data),
                    headers: {
                        'charset': 'UTF-8',
                        "Content-Type": "text/plain"
                    },
                    onerror: (error) => {
                        //zyxconsole.log({ onerror: error });
                        getAnswerflag = false;
                        view.addInfo("获取答案失败！", "网络或服务器错误");
                    },
                    ontimeout: (error) => {
                        //zyxconsole.log({ ontimeout: error });
                        getAnswerflag = false;
                        view.addInfo("获取答案失败！", "网络超时");
                    },
                    onload: response => {
                        let res = JSON.parse(response.responseText);
                        if (response.status == 200) {
                            zyxconsole.log(res);
                            if (res.message) {
                                view.addInfo(res.message);
                            }
                            if (res.button) {
                                view.buttons.push(res.button);
                                view.refreshBtnList();
                            }
                            if (res.msgobj) {
                                view.showServerMsg(res.msgobj);
                            }
                            view.addInfo("获取答案成功！", "正在自动进行答题...");
                            domooc.quizanswers = res.quizanswers;
                            getAnswerflag = true;
                            answerAll(res.quizanswers);
                            getAnswerflag = false;
                        } else {
                            getAnswerflag = false;
                            view.addInfo("获取答案失败！", res.detail);
                            zyxconsole.log({
                                err: response
                            });
                        }
                    }
                });
            } else {
                getAnswerflag = false;
                view.addInfo("获取答案失败！", "请返回上一页重新进入", "请返回上一页重新进入");
            }
        }

        function getInitialData() {
            return {
                version: version,
                termDto: window.termDto,
                courseCardDto: window.courseCardDto,
                termid: window.courseCardDto.currentTermId,
                courseid: window.courseCardDto.id
            }
        }
        let courseCheckflag = false;

        function courseCheck() {
            if (courseCheckflag) {
                return;
            }
            let data = getInitialData();
            if (data.courseid && data.termid) {
                data.user = getUser();
                view.addInfo("正在获取题库");
                courseCheckflag = true;
                zyxconsole.log({
                    courseCheck: data
                })
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: url.check,
                    data: JSON.stringify(data),
                    headers: {
                        'charset': 'UTF-8',
                        "Content-Type": "text/plain"
                    },
                    onerror: () => {
                        courseCheckflag = false;
                        view.addInfo("获取题库失败！");
                    },
                    ontimeout: () => {
                        courseCheckflag = false;
                        view.addInfo("获取题库失败！", "网络超时");
                    },
                    onload: response => {
                        let res = JSON.parse(response.responseText);
                        if (response.status == 200) {
                            try {
                                if (!res.error && res.updatedAt) {
                                    view.addInfo("获取题库成功！",
                                        `最近更新于${new Date(res.updatedAt).toLocaleString()}`,
                                        "下一步请前往测验"
                                    );
                                    domooc.quizbank = res.quizbank;
                                    view.showQuizbank(res.quizbank);
                                    if (res.message) {
                                        view.addInfo(res.message);
                                    }
                                    if (res.button) {
                                        view.buttons.push(res.button);
                                        view.refreshBtnList();
                                    }
                                    if (res.msgobj) {
                                        view.showServerMsg(res.msgobj);
                                    }
                                } else {
                                    view.addInfo("获取题库失败！", res.detail);
                                    throw Error()
                                }
                            } catch (error) {
                                courseCheckflag = false;
                                view.addInfo("获取题库失败！", res.detail);
                            }
                            zyxconsole.log(res);
                        } else {
                            courseCheckflag = false;
                            view.addInfo("获取题库失败！", res.detail);
                            zyxconsole.log({
                                err: response
                            });
                        }
                    }
                });
            } else {
                courseCheckflag = false;
                view.addInfo("不能获取termId！", null);
            }
        }
        let intHandler = window.setInterval(() => {
            let href = document.location.href;
            if ((href.indexOf('testlist') + href.indexOf('examlist') + href.indexOf('content') > -3) && window.courseCardDto) {
                if (window.dwr && window.dwr.engine) {
                    window.clearInterval(intHandler);
                    initParams();
                    hook();
                    view.init();
                    window.zyxview = view;
                    courseCheck();
                }
            }
        }, 500);
    }
    window.scriptloaded = true;
    /**
     * xcComfirm
     */
    (function($) {
        window.wxc = window.wxc || {};
        let style = `<style type="text/css">/*垂直居中*/ \
.verticalAlign{ vertical-align:middle; display:inline-block; height:100%; margin-left:-1px;}\
.xcConfirm .xc_layer{position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #666666; opacity: 0.5; z-index: 2147000000;}\
.xcConfirm .popBox{position: fixed; left: 50%; top: 50%; background-color: #ffffff; z-index: 2147000001; width: 570px; height: 300px; margin-left: -285px; margin-top: -150px; border-radius: 5px; font-weight: bold; color: #535e66;}\
.xcConfirm .popBox .ttBox{height: 30px; line-height: 30px; padding: 14px 30px; border-bottom: solid 1px #eef0f1;}\
.xcConfirm .popBox .ttBox .tt{font-size: 18px; display: block; float: left; height: 30px; position: relative;}\
.xcConfirm .popBox .ttBox .clsBtn{display: block; cursor: pointer; width: 12px; height: 12px; position: absolute; top: 22px; right: 30px; background: url(../img/icons.png) -48px -96px no-repeat;}\
.xcConfirm .popBox .txtBox{margin: 40px 100px;  overflow: hidden;display:flex;margin:20px 40px}\
.xcConfirm .popBox .txtBox .bigIcon{float: left; margin-right: 20px; width: 48px; height: 48px; background-image: url(../img/icons.png); background-repeat: no-repeat; background-position: 48px 0;}\
.xcConfirm .popBox .txtBox textarea{float: left; width: 300px;  margin-top: 16px; line-height: 26px; }\
.xcConfirm .popBox .txtBox textarea{width: 364px;  border: solid 1px rgb(85,185,41); font-size: 18px; margin-top: 6px;}\
.xcConfirm .popBox .btnArea{border-top: solid 1px #eef0f1;}\
.xcConfirm .popBox .btnGroup{float: right;}\
.xcConfirm .popBox .btnGroup .sgBtn{margin-top: 14px; margin-right: 10px;}\
.xcConfirm .popBox .sgBtn{display: block; cursor: pointer; float: left; width: 95px; height: 35px; line-height: 35px; text-align: center; color: #FFFFFF; border-radius: 5px;}\
.xcConfirm .popBox .sgBtn.ok{background-color:rgb(85,185,41); color: #FFFFFF;}\
.xcConfirm .popBox .sgBtn.cancel{background-color: rgb(248,248,248); color: #000;}\
</style>`;
        $('body').append($(style));
        window.wxc.xcConfirm = function(popHtml, type, options) {
            var btnType = window.wxc.xcConfirm.btnEnum;
            var eventType = window.wxc.xcConfirm.eventEnum;
            var popType = {
                info: {
                    title: "信息",
                    icon: "0 0", //蓝色i
                    btn: btnType.ok
                },
                success: {
                    title: "成功",
                    icon: "0 -48px", //绿色对勾
                    btn: btnType.ok
                },
                error: {
                    title: "错误",
                    icon: "-48px -48px", //红色叉
                    btn: btnType.ok
                },
                confirm: {
                    title: "提示",
                    icon: "-48px 0", //黄色问号
                    btn: btnType.okcancel
                },
                warning: {
                    title: "警告",
                    icon: "0 -96px", //黄色叹号
                    btn: btnType.okcancel
                },
                input: {
                    title: "留言板",
                    icon: "",
                    btn: btnType.okcancel
                },
                custom: {
                    title: "",
                    icon: "",
                    btn: btnType.ok
                }
            };
            var itype = type ? type instanceof Object ? type : popType[type] || {} : {}; //格式化输入的参数:弹窗类型
            var config = $.extend(true, {
                //属性
                title: "", //自定义的标题
                icon: "", //图标
                btn: btnType.ok, //按钮,默认单按钮
                //事件
                onOk: $.noop, //点击确定的按钮回调
                onCancel: $.noop, //点击取消的按钮回调
                onClose: $.noop //弹窗关闭的回调,返回触发事件
            }, itype, options);

            var $txt = $("<p>").html(popHtml); //弹窗文本dom
            var $tt = $("<span>").addClass("tt").text(config.title); //标题
            var icon = config.icon;
            var $icon = icon ? $("<div>").addClass("bigIcon").css("backgroundPosition", icon) : "";
            var btn = config.btn; //按钮组生成参数

            var popId = creatPopId(); //弹窗索引

            var $box = $("<div>").addClass("xcConfirm"); //弹窗插件容器
            var $layer = $("<div>").addClass("xc_layer"); //遮罩层
            var $popBox = $("<div>").addClass("popBox"); //弹窗盒子
            var $ttBox = $("<div>").addClass("ttBox"); //弹窗顶部区域
            var $txtBox = $("<div>").addClass("txtBox"); //弹窗内容主体区
            var $btnArea = $("<div>").addClass("btnArea"); //按钮区域

            var $ok = $("<a>").addClass("sgBtn").addClass("ok").text("确定"); //确定按钮
            var $cancel = $("<a>").addClass("sgBtn").addClass("cancel").text("取消"); //取消按钮
            var $input = $("<textarea>").addClass("inputBox"); //输入框
            $input.attr("rows", "4");
            $input.attr("cols", "60");
            $input.attr("placeholder", "如有必要，请留下您的联系方式（QQ/微信/手机/电子邮箱）");
            $input.css("margin", "auto");
            var $clsBtn = $("<a>").addClass("clsBtn"); //关闭按钮

            //建立按钮映射关系
            var btns = {
                ok: $ok,
                cancel: $cancel
            };

            init();

            function init() {
                //处理特殊类型input
                if (popType["input"] === itype) {
                    $txt = $input;
                }

                creatDom();
                bind();
            }

            function creatDom() {
                if (popType["input"] === itype) {
                    $txt = $input;

                }
                $popBox.append(
                    $ttBox.append(
                        $clsBtn
                    ).append(
                        $tt
                    )
                ).append(
                    $txtBox.append($icon).append($txt)
                ).append(
                    $btnArea.append(creatBtnGroup(btn))
                );
                $box.attr("id", popId).append($layer).append($popBox);
                $("body").append($box);
            }

            function bind() {
                //点击确认按钮
                $ok.click(doOk);

                //回车键触发确认按钮事件
                $(window).bind("keydown", function(e) {
                    if (e.keyCode == 13) {
                        if ($("#" + popId).length == 1) {
                            doOk();
                        }
                    }
                });

                //点击取消按钮
                $cancel.click(doCancel);

                //点击关闭按钮
                $clsBtn.click(doClose);
            }

            //确认按钮事件
            function doOk() {
                var $o = $(this);
                var v = $.trim($input.val());
                if ($input.is(":visible"))
                    config.onOk(v);
                else
                    config.onOk();
                $("#" + popId).remove();
                config.onClose(eventType.ok);
            }

            //取消按钮事件
            function doCancel() {
                var $o = $(this);
                config.onCancel();
                $("#" + popId).remove();
                config.onClose(eventType.cancel);
            }

            //关闭按钮事件
            function doClose() {
                $("#" + popId).remove();
                config.onClose(eventType.close);
                $(window).unbind("keydown");
            }

            //生成按钮组
            function creatBtnGroup(tp) {
                var $bgp = $("<div>").addClass("btnGroup");
                $.each(btns, function(i, n) {
                    if (btnType[i] == (tp & btnType[i])) {
                        $bgp.append(n);
                    }
                });
                return $bgp;
            }

            //重生popId,防止id重复
            function creatPopId() {
                var i = "pop_" + (new Date()).getTime() + parseInt(Math.random() * 100000); //弹窗索引
                if ($("#" + i).length > 0) {
                    return creatPopId();
                } else {
                    return i;
                }
            }
        };

        //按钮类型
        window.wxc.xcConfirm.btnEnum = {
            ok: parseInt("0001", 2), //确定按钮
            cancel: parseInt("0010", 2), //取消按钮
            okcancel: parseInt("0011", 2) //确定&&取消
        };

        //触发事件类型
        window.wxc.xcConfirm.eventEnum = {
            ok: 1,
            cancel: 2,
            close: 3
        };

        //弹窗类型
        window.wxc.xcConfirm.typeEnum = {
            info: "info",
            success: "success",
            error: "error",
            confirm: "confirm",
            warning: "warning",
            input: "input",
            custom: "custom"
        };

    })($);
})();