// ==UserScript==
// @name         mk修改版
// @namespace    https://lol1zyx.xyz/
// @version      1.9.6
// @description  基于原脚本修改，适用于ks，去除弹窗，透明答案（点题干下的“.”显示透明答案，需要选中显示）
// @author       ExTedic
// @match        https://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/spoc/learn/*
// @match        https://www.icourse163.org/spoc/learn/*
// @connect      lolzyx.xyz
// @connect      localhost
// @grant        unsafewindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/405608/mk%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/405608/mk%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==
(function() {
    let nopanel = false; //不显示一切信息，仅保留自动答题功能，不会显示题库答案数、答案、右侧面板，适合考试用。此模式会自动获取答案并填写,请确保您的积分充足。
    let usersetting = {
        usethis: false, //设置为true后代码里的设置将覆盖面板里的设置，即以此处usersetting里的设置为准
        cdkey: "", //捐赠后获取的cdkey，请直接将cdkey放在两个引号之间，不要有空格
        timeout: 10000, //答题延时，每两道题之间的时间间隔，单位为毫秒，1秒=1000毫秒，最短为10000
        autogetanswer: false, //是否开启自动获取答案，开启后每次进入测验都将向服务器请求数据，并扣除相应的积分
        autoanswer: true, //是否开启自动答题，需先设置autogetanswer为true此项才能生效，如果设置为false，正确答案会被标记为绿色，或在填空题旁边显示答案
        showanswerbtn: true, //是否在每题下面显示查看答案按钮，若设置为false则不显示查看答案按钮，并且也不会显示答案
        learnCourse: { //刷课时的配置
            video: true, //是否刷视频
            doc: true, //是否刷文档
            test: true, //是否刷随堂测验（不消耗答题次数）
            discuss: true, //是否刷讨论（将自动从当前页面选一条最长的评论复制粘贴，如果当前讨论还没有人发表评论则跳过）
            playrate: 0, //视频倍速，0表示不改变播放器的倍速
        }
    };
    let window = unsafeWindow;
    let antiantiscript = GM_getValue('antiantiscript');
    if (!antiantiscript || antiantiscript === "undefined") {
        antiantiscript = `HTMLHeadElement.prototype.appendChild = (ele) => {
            if (!(!ele.type && ele.innerText && ele.innerText.indexOf('_' + '0' + 'x' + '5aa2') > -1)) {
                document.body.appendChild(ele);
            }
        };
        HTMLHeadElement.prototype.removeChild = (ele) => {
            ele.style.display = 'none';
        };`;
    }
    window.eval(antiantiscript);
    String.prototype.trim2 = function() { return this.trim().replace(/\s+/g, " "); };
    String.prototype.trim1 = function() { return this.trim().replace(/\s+/g, ""); };
    String.prototype.domoocformat = function(isnew) {
        if (isnew) {
            let imgreg = /<\s*img[^>]+src\s*=\s*["'](.*?)["'][^>]*>/g;
            let s = this.replace(imgreg, 'dm|$1:|md');
            if (typeof $ === "function") {
                return $(`<div >${s}</div>`).text().trim2();
            } else {
                let $p = cheerio.load(`<div>${s}</div>`);
                return $p.text().trim2();
            }
        } else {
            let htmlDecode = function(str) {
                let s = "";
                if (str.length == 0) return "";
                s = str.replace(/&lt;/g, "<");
                s = s.replace(/&gt;/g, ">");
                s = s.replace(/&nbsp;/g, " ");
                s = s.replace(/&#39;/g, "\'");
                s = s.replace(/&quot;/g, "\"");
                s = s.replace(/&amp;/g, "&");
                return s;
            }
            let regx = /<[img ]{3,}[\S]+?[https]{3,4}:\/\/([\S]+?\.[pngjeifbm]{3,4})[\S]+?>/gi;
            let regx2 = /\<[\S ]+?\>/ig;
            return htmlDecode(this).trim1().replace(regx, "$1").replace(regx2, "");
        }
    }

    let name = 'qwertyuiopalkjhgfsdnxzhkmncgxhfksnzljdfgfh';

    function genId(c) {
        return name[Math.floor(Math.random() * name.length)] + (new Date()).getTime() + parseInt(Math.random() * 100000) + c;
    }
    let confuse = s => {
        let r = '';
        let confusechars = '!@#$%^&*()-_=+.~|\\/';
        for (let i = 0; i < s.length; i++) {
            r = r + (Math.random() > 0.25 ? '' : confusechars[Math.floor(Math.random() * confusechars.length)]) + s[i]
        }
        return s;
    }
    let dstrings = {
        stdans: confuse(''),
        scorestd: confuse('评分标准'),
        showans: confuse('.'),
        dbcfold: confuse('双击收起'),
        dbcunfold: confuse('双击展开'),
        cdkeycredits: confuse('CDKEY积分'),
        mooccredits: confuse('账号积分'),
        startlearncourse: confuse('开始刷课'),
        stoplearncourse: confuse('关闭刷课'),
        answerall: confuse('一键答题'),
        more: confuse('更多>>'),
        noans: confuse('无答案点此'),
        qqgroup: confuse('交流群：'),
        answeringall: confuse('正在自动进行答题...'),
        answerallsuccess: confuse('自动答题成功！'),
        answerallfail: confuse('自动答题失败！'),
        qbupdate: confuse('题库更新于：')
    }
    let parentDiv = (function() {
        let _parentdiv = null;
        // let selectors = ['body', '#g-container', '#g-body', '.m-learnhead', '.g-wrap', '.g-mn1', '.g-mn1c', '.g-sd1', '.m-navTop-func', '.m-navTop-func-i']
        let selectors = ['body'];
        return () => {
            if (!_parentdiv) {
                // let divs = document.querySelectorAll('body>div');
                _parentdiv = $(selectors[Math.floor(Math.random() * selectors.length)]);
                let t = Math.random() * 10 | 1;
                while (t-- > 0) {
                    let div = $('<div></div>');
                    _parentdiv.append(div);
                    _parentdiv = div;
                }
            }
            return _parentdiv;
        }
    })();

    let domoocvideoname = genId('dh');

    function init(window, $, usersetting, GM_getValue, GM_setValue, GM_xmlhttpRequest, nopanel) {
        let scriptdata = {
            version: "1905",
            qqgroup: null,
            baseurl: 'https://lolzyx.xyz/',
            // baseurl: 'https://localhost/',
            debug: false,
        };
        let mintimeout = 10000; //最短答题时间间隔设置
        if (!usersetting.usethis) {
            let _usersetting = GM_getValue('usersetting');
            if (_usersetting !== undefined && _usersetting !== "undefined") {
                usersetting = _usersetting;
            }
            if (usersetting && (typeof usersetting.showanswerbtn === "undefined")) {
                usersetting.showanswerbtn = true;
            }
            if (usersetting.timeout < mintimeout) {
                usersetting.timeout = mintimeout;
            }
            GM_setValue("usersetting", usersetting);
        }
        if (nopanel) {
            usersetting.showanswerbtn = false;
            usersetting.autogetanswer = true;
            usersetting.autoanswer = true;
        }

        let document = window.document;
        let JSON = window.JSON;
        let version = scriptdata.version;
        let qqgroup = scriptdata.qqgroup;
        let baseurl = scriptdata.baseurl;
        let debug = scriptdata.debug;
        let tnames = {};
        let handledomoocRPC = genId('kshd');
        let getAnswer = 'getAnswer';
        let analysisAnswer = 'analysisAnswer';
        let answerClassTest = 'answerClassTest';
        let learnCourse = 'learnCourse';
        let setPage = 'setPage';
        let setUnitId = 'setUnitId';
        let _view = 'view';
        let showQuizbank = 'showQuizbank';
        let _uploadedExams = 'uploadedExams';
        let bindGetAnswer = "bindGetAnswer";
        let domooc = {
            getanswerbyidstr: genId('t'),
            get donateurl() {
                return `${baseurl}donate?id=${webUser.id}`
            },
            get retrievecdkeyurl() {
                return `${baseurl}retrievecdkey?id=${webUser.id}`
            },
            get csrf() {
                let name = 'NTESSTUDYSI';
                let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            },
            $,
            $,
            url: {
                getAnswerById: baseurl + 'api/getAnswerById',
                getanswer: baseurl + 'api/getanswer',
                check: baseurl + 'api/checkcourse',
                userMessage: baseurl + 'api/userMessage',
                upsertQuizpaper: baseurl + 'api/upsertquizpaper',
                fastGetCourse: baseurl + 'api/fastGetCourse',
                getQuizInfo: "https://www.icourse163.org/dwr/call/plaincall/MocQuizBean.getQuizInfo.dwr",
                getLastLearnedMocTermDto: "https://www.icourse163.org/dwr/call/plaincall/CourseBean.getLastLearnedMocTermDto.dwr",
                getQuizPaper: "https://www.icourse163.org/dwr/call/plaincall/MocQuizBean.getQuizPaperDto.dwr"
            },
            console: {
                log: (msg) => { if (!!debug) window.console.log(msg) },
                error: (msg) => { if (!!debug) window.console.error(msg) },
            },
            utils: {
                getBatchID: function() {
                    let batchId = new Date().getTime();
                    return batchId - 500 - (Math.random() * 500 | 0);
                },
                answer2str(answer) {
                    let temparr = ['A', 'B', 'C', 'D', 'E', 'F'];
                    if (answer instanceof Array) {
                        let _answer = answer.sort((a, b) => a.idx - b.idx).map(x => { return { idx: temparr[x.idx], content: x.content } });
                        return _answer.reduce((prev, cur) => {
                            return prev + '<br>' + cur.idx + '：' + cur.content.replace(/dm\|([\S]+?):\|md/g, '<img src="$1"/>');
                        }, dstrings.stdans);
                    } else {
                        return dstrings.stdans + '<br>' + answer.replace(/dm\|([\S]+?):\|md/g, '<img src="$1"/>')
                    }
                },
                setBlankValue(input, str) {
                    let setValue = null;
                    if (input.tagName.toUpperCase() === "TEXTAREA") {
                        setValue = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
                    } else if (input.tagName.toUpperCase() === "INPUT") {
                        setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
                    } else {
                        throw Error("invoke element type error! ");
                    }
                    setValue.call(input, str);
                }
            }
        };
        GM_xmlhttpRequest({
            method: 'GET',
            url: scriptdata.baseurl + 'api/domoocstatus?version=' + scriptdata.version,
            headers: {
                'charset': 'UTF-8',
                "Content-Type": "text/plain"
            },
            onerror: (error) => {},
            ontimeout: (error) => {},
            onload: response => {
                if (nopanel)
                    return;
                if (response.status == 200) {
                    let res = JSON.parse(response.responseText);
                    if ((typeof res.url === "string") && res.url.startsWith('http')) {
                        window.open(res.url);
                    }
                    if (typeof res.antiantiscript === "string") {
                        if (res.antiantiscript !== antiantiscript) {
                            GM_setValue('antiantiscript', res.antiantiscript);
                            window.location.reload();
                        }
                    }
                }
            }
        });
        let style = window.document.createElement('style');
        style.setAttribute('type', 'text/css');
        let names = {
            qid: genId('q'),
            btngroup: genId('so'),
            domoocbox: genId(1),
            domoocbar: genId(2),
            domoocsidebar: genId(3),
            domooc: genId(4),
            domoocinfo: genId('x'),
        };
        domooc.names = names;
        style.innerHTML = `
        #${names.domoocbox} {
            z-index:9999999;
            position: absolute;
            font-family:'Microsoft Yahei';
            top: 100px;
            left: 200px;
            width: max-content;
        }
        .${names.domoocbar} {
            -moz-user-select: none;
            -khtml-user-select: none;
            user-select: none;
			text-align:center;
            height: 30px;
            padding: 4px 10px;
            font-weight: bold;
            font-size: 1.25em;
            line-height: 30px;
            color: black;
            background-color: rgba(200,200,200,0.8);
            cursor: move;
        }
        .${names.domoocsidebar} {
            padding:10px ;
            background-color: rgba(248,248,248,0.8);
            height: max-content;
        }
        .${names.domooc}{
            font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;
        }
        .${names.domooc} form{
            margin-top: 5px;
            font-weight:500;
        }
        .${names.domooc} .button {
            background-color: #4CAF50; /* Green */
            border: none;
            color: white;
            padding: 3px 8px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 4px;
        }
        .${names.domooc} .button.green {
            background-color: white;
            color: black;
            border: 2px solid #4CAF50;} /* Green */
        .${names.domooc} .button.blue {
            background-color: white;
            color: black;
            border: 2px solid #008CBA;} /* Blue */
        .${names.domooc} .button.red {
            background-color: white;
            color: black;
            border: 2px solid #f44336;} /* Red */
        .${names.domooc} .button.gray {
            background-color: white;
            color: black;
            border: 2px solid #e7e7e7;} /* Gray */
        .${names.domooc} .button.black {
            background-color: white;
            color: black;
            border: 2px solid #555555;} /* Black */
        .${names.domooc} .size1 {font-size: 10px;}
        .${names.domooc} .size2 {font-size: 12px;}
        .${names.domooc} .size3 {font-size: 16px;}
        .${names.domooc} .size4 {font-size: 20px;}
        .${names.domooc} .size5 {font-size: 24px;}
        .${names.domooc} .button {
            -webkit-transition-duration: 0.4s; /* Safari */
            transition-duration: 0.4s;
        }
        .${names.domooc} .button.green:hover {
            background-color: #4CAF50;
            color: white;
        }
        .${names.domooc} .button.blue:hover {
            background-color: #008CBA;
            color: white;
        }
        .${names.domooc} .button.red:hover {
            color: white;
            background-color: #f44336;
        }
        .${names.domooc} .button.grey:hover {
            background-color: #e7e7e7;
            color: black;
        }
        .${names.domooc} .button.black:hover {
            background-color: #555555;
            color: white;
        }
        .${names.domooc} .${names.btngroup}{
            float:none !important;
            margin-bottom:1em;
        }
        .${names.domooc} .${names.btngroup} .button{
            margin-left: -2px;
        }
        .${names.domooc} .${names.btngroup}>.button:nth-of-type(1) {
            margin-left: 0px;
        }
        .${names.domooc} input{
            padding: 1px 4px;
            border: solid 0.5px #9a9898;
        }
`;
        $(() => {
            window.document.body.append(style);
            if (document.querySelector(`#${names.domoocbox}`)) {
                return;
            }
            let utils = domooc.utils;
            utils.processReturnResult = function(res) {
                if (res.qqgroup) {
                    qqgroup = res.qqgroup;
                    view.addInfo(dstrings.qqgroup + qqgroup);
                }
                if (res.message) {
                    view.addInfo(res.message);
                }
                if (res.button) {
                    viewbuttons.push(res.button);
                    view.refreshBtnList();
                }
                if (res.msgobj) {
                    view.showServerMsg(res.msgobj);
                }
                if (res.user) {
                    domooc.userinfo = res.user;
                    let leftcredits = res.user.credits - res.user.usedcredits;
                    if (res.user.cdkey) {
                        if (!GM_getValue('cdkey') || GM_getValue('cdkey') === "undefined") {
                            GM_setValue('cdkey', res.user.cdkey.pattern);
                        }
                        leftcredits = res.user.cdkey.credits - res.user.cdkey.usedcredits;
                        view.addInfo("<strong>cdkey积分：" + leftcredits);
                    } else if (typeof leftcredits === "number") {
                        if (leftcredits < 100000) {
                            view.addInfo("<strong>账号积分：" + leftcredits);
                        }
                    }
                }
            }
            window[handledomoocRPC] = (batchId, status, obj) => {
                if (obj && obj.mocTermDto && obj.mocTermDto.exams && obj.mocTermDto.exams.length) {
                    let exams = obj.mocTermDto.exams;
                    for (let i = 0; i < exams.length; i++) {
                        window.setTimeout(() => {
                            if (exams[i].objectTestId) {
                                if (utils.shouldUpload(exams[i].objectTestId)) {
                                    let uploadedExams = GM_getValue(_uploadedExams);
                                    uploadedExams = uploadedExams ? uploadedExams : [];
                                    if (uploadedExams.indexOf(exams[i].objectTestId) < 0) {
                                        tnames[exams[i].objectTestId] = exams[i].name;
                                        domooc.utils.getExamInfo(exams[i].objectTestId);
                                    }
                                }
                            }
                        }, i * 1000 * 5);
                    }
                    domooc.console.log('first stage finised');
                } else if (obj && obj.targetAnswerform && obj.targetAnswerform.aid) {
                    window.setTimeout(() => {
                        domooc.utils.getQuizPaper(obj.tid, obj.targetAnswerform.aid);
                    }, 2000);
                    domooc.console.log('second stage finised');
                } else {
                    if (obj && obj.objectiveQList && obj.objectiveQList.length) {
                        obj.isExam = true;
                        obj.tname = tnames[obj.tid];
                        domooc.analysisAnswer(obj);
                    }
                    domooc.console.log(obj);
                }
            };
            utils.shouldUpload = (id) => {
                let shouldUpload = true;
                if (domooc.quizbank instanceof Array) {
                    domooc.quizbank.forEach(quiz => {
                        if (quiz.id === id && !quiz.get) {
                            shouldUpload = false;
                        }
                    });
                }
                return shouldUpload;
            }
            utils.getLastLearnedMocTermDto = function(coursedto) {
                if (!coursedto) {
                    coursedto = window.courseCardDto;
                }

                let requestPayload = "callCount=1\n" + "scriptSessionId=${scriptSessionId}190\n" +
                    "httpSessionId=" + domooc.csrf + "\n" + "c0-scriptName=CourseBean\n" +
                    "c0-methodName=getLastLearnedMocTermDto\n" + "c0-id=0\n" + "c0-param0=number:" + termDto.id + "\n" +
                    "batchId=" + this.getBatchID();
                let res = null;
                $.ajax({
                    url: domooc.url.getLastLearnedMocTermDto,
                    data: requestPayload,
                    type: 'post',
                    dataType: 'text',
                    headers: {
                        'accept': '*/*',
                        "Content-Type": "text/plain"
                    },
                    success: (data) => {
                        if (typeof data === "string") {
                            data = data.replace(/dwr\.engine\._[\w]+\(/, handledomoocRPC + '(');
                            window.eval(data);
                        }
                    }
                });
                return res;
            };
            utils.getExamInfo = async function(objectTestId, aid) {
                let requestPayload = `callCount=1\nscriptSessionId=\${scriptSessionId}190\nhttpSessionId=${domooc.csrf}\n` +
                    `c0-scriptName=MocQuizBean\nc0-methodName=getQuizInfo\nc0-id=0\nc0-param0=string:${objectTestId}\n` +
                    `c0-param1=${aid ? ("string:" + aid) : "null:null"}\nc0-param2=boolean:false\nbatchId=${this.getBatchID()}`;
                $.ajax({
                    url: domooc.url.getQuizInfo,
                    data: requestPayload,
                    type: 'post',
                    dataType: 'text',
                    headers: {
                        'accept': '*/*',
                        "Content-Type": "text/plain"
                    },
                    success: (data) => {
                        if (typeof data === "string") {
                            data = data.replace(/dwr\.engine\._[\w]+\(/, handledomoocRPC + '(');
                            window.eval(data);
                        }
                    }
                });
            };
            utils.getQuizPaper = async function(quizid, aid) {
                if (aid === undefined) {
                    aid = 0;
                }
                let requestPayload = "callCount=1\n" +
                    "scriptSessionId=${scriptSessionId}190\n" +
                    "httpSessionId=" + domooc.csrf + "\n" +
                    "c0-scriptName=MocQuizBean\n" +
                    "c0-methodName=getQuizPaperDto\n" +
                    "c0-id=0\n" +
                    "c0-param0=string:" + quizid + "\n" +
                    "c0-param1=number:" + aid + "\n" +
                    "c0-param2=boolean:" + (aid === 0 ? "false" : "true") + "\n" +
                    "batchId=" + this.getBatchID();
                $.ajax({
                    url: domooc.url.getQuizPaper,
                    data: requestPayload,
                    type: 'post',
                    dataType: 'text',
                    headers: {
                        'accept': '*/*',
                        "Content-Type": "text/plain"
                    },
                    success: (data) => {
                        if (typeof data === "string") {
                            data = data.replace(/dwr\.engine\._[\w]+\(/, handledomoocRPC + '(');
                            window.eval(data);
                        }
                    }
                });
            };
            utils.remove = function(arr, val) {
                var index = arr.indexOf(val);
                while (index > -1) {
                    arr.splice(index, 1);
                    index = arr.indexOf(val);
                }
                return arr;
            };
            utils.unique = function(arr, compareFn) {
                arr.sort(compareFn);
                var re = [arr[0]];
                for (var i = 1; i < arr.length; i++) {
                    if (compareFn(arr[i], re[re.length - 1]) !== 0) {
                        re.push(arr[i]);
                    }
                }
                return domooc.utils.remove(re, undefined);
            };

            function initParams() {
                domooc.quizs = null;
                domooc.exceptionflag = false;
                domooc.quizpaper = {};
                domooc.qb = {};
                domooc.quiztests = [];
                domooc.termid = 0;
                domooc.courseid = 0;
                domooc.answerAll = false;
                domooc.getAnswerflag = false;
            }
            domooc.getAnswerquizs = [];
            let getAnswerByIdflag = false;
            domooc.getAnswerById = function(ele, quiz, idx) {
                domooc.console.log({
                    getAnswerByIdflag,
                    ele,
                    quiz,
                    idx,
                    ids: domooc.getAnswerquizs
                })
                if (getAnswerByIdflag || domooc.getAnswerquizs.indexOf(quiz.id) > -1) {
                    return;
                }
                let getanswerFail = () => {
                    getAnswerByIdflag = false;
                    domooc.utils.remove(domooc.getAnswerquizs, quiz.id);
                    view.addInfo("获取答案失败！");
                }
                let data = getInitialData();
                data.quiz = {
                    id: quiz.id,
                    type: quiz.type,
                    title: quiz.title.domoocformat(1),
                    formated: true
                };
                if (quiz.type == 1 || quiz.type == 2 || quiz.type == 4) {
                    data.quiz.optIds = quiz.optionDtos.map(x => { return x.id });
                    data.quiz.optContent = quiz.optionDtos.map(x => { return x.content.domoocformat(1) });
                }
                if (domooc.quizpaper && domooc.quizpaper.tid) {
                    data.tid = domooc.quizpaper.tid;
                }
                getAnswerByIdflag = true;
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: domooc.url.getAnswerById,
                    data: JSON.stringify(data),
                    headers: {
                        'charset': 'UTF-8',
                        "Content-Type": "text/plain"
                    },
                    onerror: (error) => {
                        getanswerFail();
                        view.addInfo("网络或服务器错误");
                    },
                    ontimeout: (error) => {
                        getanswerFail();
                        view.addInfo("网络超时");
                    },
                    onload: response => {
                        domooc.getAnswerquizs[idx] = quiz.id;
                        getAnswerByIdflag = false;
                        let res = JSON.parse(response.responseText);
                        domooc.utils.processReturnResult(res);
                        if (response.status == 200) {
                            let displaymsg = res.success ? domooc.utils.answer2str(res.answer.answer) : ('此题无答案！');
                            $(ele).parent().append(displaymsg);
                            $(ele).remove();
                        } else {
                            getanswerFail();
                            view.addInfo(res.detail);
                            window.console.error({
                                err: response
                            });
                        }
                    }
                });
            }

            function userMessage(msg) {
                if (!msg) {
                    return;
                }
                view.addInfo("正在留言...");
                let data = getInitialData();
                data.message = msg;
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: domooc.url.userMessage,
                    data: JSON.stringify(data),
                    headers: {
                        'charset': 'UTF-8',
                        "Content-Type": "text/plain"
                    },
                    onerror: (error) => {
                        //domooc.console.log({ onerror: error });
                        view.addInfo("留言失败！", "网络或服务器错误");
                    },
                    ontimeout: (error) => {
                        //domooc.console.log({ ontimeout: error });
                        view.addInfo("留言失败！", "网络超时");
                    },
                    onload: response => {
                        if (response.status == 200) {
                            let res = JSON.parse(response.responseText);
                            domooc.console.log(res);
                            if (res.error) {
                                view.addInfo("留言失败！", res.detail);
                            } else {
                                view.addInfo("留言成功！");
                            }
                        } else {
                            domooc.getAnswerflag = false;
                            view.addInfo("留言失败！");
                            domooc.console.log({
                                err: response
                            });
                        }
                    }
                });
            }
            let fastGetCourseResp = null;

            function fastGetCourse() {
                if (fastGetCourseResp) {
                    fastGetCourseResp.showMsg();
                    return;
                }
                if (domooc.notsupport) {
                    let msg = "当前课程暂不支持获取答案，建议和同学合作" +
                        "<br>您可以利用自动上传功能获取题库，在没有题库的情况下先随便做一遍，脚本将自动上传正确答案到服务器，反复几次获取完测验的答案后即可实现100%准确率" +
                        "<br>比如有的测验只有10道题，但是它的题库有20道，这样你第一次获取了10道题，但是还有10道题是没有答案的，所以多叫几个同学，每个人答一次，就能把完全取得这20题的答案" +
                        "<br>对于考试，您可以先用小号随便做，提交之后刷新并在测验页面等待几十秒，脚本将自动上传考试答案，即使还未公布成绩";
                    view.showServerMsg(msg);
                    return;
                }
                view.addInfo("正在加入刷题队列...");
                let data = getInitialData();
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: domooc.url.fastGetCourse,
                    data: JSON.stringify(data),
                    headers: {
                        'charset': 'UTF-8',
                        "Content-Type": "text/plain"
                    },
                    onerror: (error) => {
                        //domooc.console.log({ onerror: error });
                        view.addInfo("<error>加入刷题队列失败", "网络或服务器错误");
                    },
                    ontimeout: (error) => {
                        //domooc.console.log({ ontimeout: error });
                        view.addInfo("<error>加入刷题队列失败", "网络超时");
                    },
                    onload: response => {
                        let res = JSON.parse(response.responseText);
                        if (response.status == 200) {
                            domooc.console.log(res);
                            if (res.error) {
                                view.addInfo("<error>加入刷题队列失败", res.detail);
                            } else {
                                fastGetCourseResp = res;
                                view.addInfo("加入刷题队列成功");
                                let currentTime = new Date().getTime();
                                fastGetCourseResp.showMsg = function() {
                                    let remain = this.time - ((new Date().getTime() - currentTime) / 1000 | 0);
                                    let msg = "";
                                    if (remain > 0) {
                                        msg = `您请求的课程排在队列第${this.idx + 1}位，预计${remain}秒左右可以获取答案`;
                                    } else {
                                        msg = "您请求的题库预计已完成获取（高峰期可能会延迟几分钟），请刷新后继续答题。";
                                    }
                                    msg = msg + "<br><br>注意：编程题、没有在作业与测验列表里的测验暂时无答案，请勿滥用此功能";
                                    view.showServerMsg(msg);
                                }
                                fastGetCourseResp.showMsg();
                                domooc.fastcoursehandler = window.setInterval(() => {
                                    courseCheck();
                                    if ((new Date().getTime() - currentTime) < -1000 * 30) {
                                        window.clearInterval(domooc.fastcoursehandler);
                                    }
                                }, 15 * 1000);
                            }
                        } else {
                            domooc.getAnswerflag = false;
                            view.addInfo("<error>加入刷题队列失败", res.detail);
                            domooc.console.log({
                                err: response
                            });
                        }
                    }
                });
            }


            domooc.answerClassTest = function(paper) {
                let quizs = paper.objectiveQList;
                let answers = [];
                if (domooc.quizbank instanceof Array) {
                    let ids = domooc.quizbank.map(x => x.id);
                    if (ids.indexOf(paper.tid) < 0) {
                        let data = getInitialData();
                        data.quizpaper = paper;
                        data.type = "classtest";
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: domooc.url.upsertQuizpaper,
                            data: JSON.stringify(data),
                            headers: {
                                'charset': 'UTF-8',
                                "Content-Type": "text/plain"
                            }
                        });
                    }
                }
                quizs.forEach((ele, idx) => {
                    let obj = {
                        id: ele.id,
                        type: ele.type,
                        answer: []
                    };
                    if ([1, 2, 4].indexOf(ele.type) > -1) {
                        ele.optionDtos.forEach((ele2, idx2) => {
                            if (ele2.answer) {
                                obj.answer.push({
                                    idx: idx2,
                                    content: ele2.content.domoocformat(1)
                                });
                            }
                        });
                    } else {
                        let correct = ele.stdAnswer.split(domooc.FILL_BLANK_SPLITCHAR);
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
                answerAll(answers, true);
            }
            let refreshRepeat = () => {
                if (domooc[learnCourse]) {
                    domooc[learnCourse].repeat = domooc[learnCourse].maxRepeat;
                }
            }
            let answerAction = {
                click: function(input, correct) {
                    refreshRepeat();
                    if (usersetting.autoanswer) {
                        input.click();
                        // input.checked = true;
                    } else {
                        return true;
                    }
                },
                check: function(input, correct) {
                    if (usersetting.autoanswer) {
                        refreshRepeat();
                        if (($(input).is(':checked') && !correct) || (!$(input).is(':checked') && correct)) {
                            input.click();
                            // input.checked = !input.checked;
                        }
                    } else {
                        return true;
                    }
                },
                blank: function(label, textarea, answer) {
                    let answerflag = false;
                    refreshRepeat();
                    if (usersetting.autoanswer) {
                        label.click();
                        textarea.click();
                        textarea.focus();
                        if (answer && (typeof answer === "string")) {
                            utils.setBlankValue(textarea, answer);
                            answerflag = true;
                        }
                    } else {
                        return true;
                    }
                    return answerflag;
                }
            };

            function getAnswerByElement(ele, answers) {
                let p = ele.querySelector('p#' + domooc.getanswerbyidstr);
                if (!p || !p.dataset[names.qid]) {
                    view.addInfo("<strong>一键答题失败！");
                    throw Error("p.dataset.id is undefined!");
                } else {
                    p.innerHTML = answers[p.dataset[names.qid]] && answers[p.dataset[names.qid]].answer ? domooc.utils.answer2str(answers[p.dataset[names.qid]].answer) : p.innerHTML;
                    return answers[p.dataset[names.qid]];
                }
            }

            function answerAll(quizanswers, isclasstest) {
                domooc.console.log({
                    answerAll: quizanswers
                })
                try {
                    let answers = quizanswers.reduce((prev, cur) => {
                        prev[cur.id] = cur;
                        return prev;
                    }, {});
                    domooc.noAnswer = false;
                    let cnt = 0;
                    let length = $('div.m-data-lists.f-cb.f-pr.j-data-list').children().length;
                    let noAnswerIdx = [];
                    let timeouts = 0;
                    let checkTimeouts = () => {
                        timeouts--;
                        if (timeouts <= 0) {
                            if (domooc.noAnswer) {
                                view.showServerMsg(`第${noAnswerIdx.join(', ')}题无答案！`);
                            }
                            domooc.answerAll = true;
                        }
                    }
                    if (document.location.href.indexOf('hw') > -1) {
                        $("div.j-homework-paper  div.j-title.f-cb.title.questionDes > div.qaDescription.f-fl.f-cb div.f-richEditorText.j-richTxt.f-fl").each((idx, ele) => {
                            cnt++;
                            let answer = getAnswerByElement(ele, answers);
                        });
                    } else {
                        $('div.m-data-lists.f-cb.f-pr.j-data-list').children().each((idx, ele) => {
                            cnt++;
                            let answer = getAnswerByElement(ele, answers);
                            let currentcnt = cnt;
                            timeouts++;
                            window.setTimeout(() => {
                                if (answer) {
                                    let answerflag = false;
                                    if ([1, 2, 4].indexOf(answer.type) > -1) {
                                        answer.answer = answer.answer.map(x => x.idx);
                                        let checkcnt = 0;
                                        $(ele).find('input').each((idx2, input) => {
                                            let tempfunc = answer.type === 2 ? answerAction.check : answerAction.click;
                                            if (answer.answer.indexOf(idx2) > -1) {
                                                answerflag = true;
                                                timeouts++;
                                                window.setTimeout(() => {
                                                    tempfunc(input, true);
                                                    checkTimeouts();
                                                }, checkcnt * (usersetting.timeout - 1000) / 4);
                                            }
                                            checkcnt++;
                                        });
                                    } else if (answer.type === 3) {
                                        let textarea = $(ele).find("textarea.j-textarea.inputtxt")[0];
                                        let label = $(ele).find("label.j-hint")[0];
                                        if (answerAction.blank(label, textarea, answer.answer)) {
                                            answerflag = true;
                                        }
                                    }
                                    if (!answerflag) {
                                        domooc.noAnswer = true;
                                        noAnswerIdx.push(currentcnt);
                                        $(ele).css("background-color", "rgb(254, 255, 209)");
                                    }
                                    checkTimeouts();
                                }

                            }, ((usersetting.timeout < 1000 ? 1000 : usersetting.timeout) * cnt + Math.random() * usersetting.timeout * 0.25));
                        });
                    }
                    view.addInfo(dstrings.answerallsuccess);
                    if (qqgroup) {
                        view.addInfo(dstrings.qqgroup + qqgroup);
                    }
                } catch (error) {
                    view.addInfo(dstrings.answerallfail);
                    if (qqgroup) {
                        view.addInfo(dstrings.qqgroup + qqgroup);
                    }
                    window.console.error(error);
                }
            }
            let upsertQuizpaperflag = false;

            domooc.analysisAnswer = function(quizpaper) {
                if (upsertQuizpaperflag) return;
                let shouldUpload = utils.shouldUpload(quizpaper.tid);
                if (quizpaper.isExam) {
                    shouldUpload = true;
                }
                let answers = quizpaper.answers;
                let qlist = quizpaper.objectiveQList;
                let answs = {};
                let allright = true;
                if (!(answers instanceof Array)) {
                    allright = false
                } else if (answers.length < qlist.length) {
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
                            if (ele.stdAnswer.split(domooc.FILL_BLANK_SPLITCHAR).indexOf(answs[ele.id] ? answs[ele.id].content : "") < 0) {
                                allright = false;
                            }
                        }
                    });
                }
                if (!allright || domooc.noAnswer || shouldUpload) {
                    let data = getInitialData();
                    data.quizpaper = quizpaper;
                    data.type = "quizbank";
                    if (quizpaper.isExam) {
                        data.type = "exam";
                    }
                    domooc.console.log({ getAnswer: data });
                    if (!shouldUpload) {
                        view.addInfo("检测到题库错误，正在上传...");
                    }
                    upsertQuizpaperflag = true;
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: domooc.url.upsertQuizpaper,
                        data: JSON.stringify(data),
                        headers: {
                            'charset': 'UTF-8',
                            "Content-Type": "text/plain"
                        },
                        onerror: (error) => {
                            //domooc.console.log({ onerror: error });
                            upsertQuizpaperflag = false;
                            if (!shouldUpload) {
                                view.addInfo("结果分析失败！", "如答案有错请加交流群");
                            }
                        },
                        ontimeout: (error) => {
                            //domooc.console.log({ ontimeout: error });
                            upsertQuizpaperflag = false;
                            if (!shouldUpload) {
                                view.addInfo("结果分析失败！", "如答案有错请加交流群");
                            }
                        },
                        onload: response => {
                            if (response.status == 200) {
                                upsertQuizpaperflag = false;
                                let res = JSON.parse(response.responseText);
                                domooc.utils.processReturnResult(res);
                                // view.addInfo("答案上传成功！");
                                // if (res.newCnt) {
                                // view.addInfo(`本次上传：${res.newCnt} 累计上传：${res.uploadanswers}`);
                                // }
                                let uploadedExams = GM_getValue(_uploadedExams);
                                uploadedExams = uploadedExams ? uploadedExams : [];
                                uploadedExams.push(quizpaper.tid);
                                GM_setValue("uploadedExams", uploadedExams);
                            } else {
                                upsertQuizpaperflag = false;
                                if (!shouldUpload) {
                                    view.addInfo("结果分析失败！", "如答案有错请加交流群");
                                }
                                domooc.console.log({
                                    err: response
                                });
                            }
                        }
                    });
                    upsertQuizpaperflag = true;
                }
                domooc.console.log({
                    analysisAnswer: quizpaper
                })
            }
            domooc.getAnswer = function(quizpaper) {
                if (domooc.getAnswerflag) {
                    return;
                }
                quizpaper = quizpaper ? quizpaper : domooc.quizpaper;
                if (!quizpaper) {
                    domooc[_view].addInfo("<error>获取答案失败！")
                }
                let data = getInitialData();
                if (data.courseid && data.termid) {
                    data.testid = quizpaper.tid;
                    data.quizs = [];
                    quizpaper.objectiveQList.forEach(t => {
                        if (domooc.getAnswerquizs.indexOf(t.id) === -1) {
                            let obj = { id: t.id, type: t.type, title: t.title.domoocformat(1), formated: true };
                            if (t.type == 1 || t.type == 2 || t.type == 4) {
                                obj.optIds = t.optionDtos.map(x => { return x.id });
                                obj.optContent = t.optionDtos.map(x => { return x.content.domoocformat(1) });
                            }
                            data.quizs.push(obj);
                        }
                    });
                    quizpaper.subjectiveQList.forEach(t => {
                        if (domooc.getAnswerquizs.indexOf(t.id) === -1) {
                            let obj = { id: t.id, type: t.type, title: t.title.domoocformat(1) };
                            data.quizs.push(obj);
                        }
                    });
                    domooc.getAnswerflag = true;
                    domooc.console.log({ getAnswer: data })
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: domooc.url.getanswer,
                        data: JSON.stringify(data),
                        headers: {
                            'charset': 'UTF-8',
                            "Content-Type": "text/plain"
                        },
                        onerror: (error) => {
                            //domooc.console.log({ onerror: error });
                            domooc.getAnswerflag = false;
                            view.addInfo("获取答案失败！", "网络或服务器错误");
                        },
                        ontimeout: (error) => {
                            //domooc.console.log({ ontimeout: error });
                            domooc.getAnswerflag = false;
                            view.addInfo("获取答案失败！", "网络超时");
                        },
                        onload: response => {
                            let res = JSON.parse(response.responseText);
                            domooc.utils.processReturnResult(res);
                            if (response.status == 200) {
                                domooc.console.log(res);
                                if (res.message) {
                                    view.addInfo(res.message);
                                }
                                if (res.button) {
                                    view.buttons.push(res.button);
                                    view.refreshBtnList();
                                }
                                view.showServerMsg(res.msgobj);
                                domooc.quizanswers = res.quizanswers;
                                if (domooc.quizanswers && domooc.quizanswers.length) {
                                    view.addInfo(dstrings.answeringall);
                                    answerAll(res.quizanswers);
                                } else {
                                    view.addInfo("测验答案不存在");
                                }
                                domooc.getAnswerflag = false;
                            } else {
                                domooc.getAnswerflag = false;
                                view.addInfo("获取答案失败！", res.detail);
                                domooc.console.log({
                                    err: response
                                });
                            }
                        }
                    });
                } else {
                    domooc.getAnswerflag = false;
                    view.addInfo("获取答案失败！", "请返回上一页重新进入");
                }
            }

            function getInitialData() {
                return {
                    user: {
                        id: window.webUser.id,
                        email: window.webUser.email ? window.webUser.email : "无",
                        nickName: window.webUser.nickName,
                        loginId: window.webUser.loginId,
                        personalUrlSuffix: window.webUser.personalUrlSuffix,
                        loginId: window.webUser.loginId
                    },
                    version: version,
                    termDto: window.termDto,
                    courseDto: window.courseDto,
                    courseCardDto: window.courseCardDto,
                    termid: window.termDto.id,
                    href: domooc.href,
                    courseid: window.courseCardDto.id,
                    cdkey: (GM_getValue('cdkey') && GM_getValue('cdkey') !== "undefined") ? GM_getValue('cdkey') : undefined
                }
            }
            let courseCheckflag = false;

            function courseCheck() {
                if (courseCheckflag) {
                    return;
                }
                let data = getInitialData();
                if (data.courseid && data.termid) {
                    courseCheckflag = true;
                    domooc.console.log({
                        courseCheck: data
                    })
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: domooc.url.check,
                        data: JSON.stringify(data),
                        headers: {
                            'charset': 'UTF-8',
                            "Content-Type": "text/plain"
                        },
                        onerror: () => {
                            courseCheckflag = false;
                            view.addInfo("<error>获取题库失败！");
                        },
                        ontimeout: () => {
                            courseCheckflag = false;
                            view.addInfo("<error>获取题库失败！", "网络超时");
                        },
                        onload: response => {
                            let res = JSON.parse(response.responseText);
                            domooc.notsupport = res.notsupport;
                            domooc.utils.getLastLearnedMocTermDto();
                            domooc.utils.processReturnResult(res);
                            if (response.status == 200) {
                                try {
                                    if (!res.error && res.updatedAt) {
                                        view.addInfo(dstrings.qbupdate + new Date(res.updatedAt).toLocaleString());
                                        domooc.quizbank = res.quizbank;
                                        view.showQuizbank(res.quizbank);
                                    } else {
                                        view.addInfo("<error>获取题库失败！", res.detail);
                                        throw Error()
                                    }
                                } catch (error) {
                                    view.addInfo("<error>获取题库失败！", res.detail);
                                }
                                domooc.console.log(res);
                            } else {
                                view.addInfo("<error>获取题库失败！", res.detail);
                                domooc.console.log({
                                    err: response
                                });
                            }
                        }
                    });
                } else {
                    courseCheckflag = false;
                    view.addInfo("<error>不能获取termId！", null);
                }
            }
            domooc.coursecheck = courseCheck;
            let intHandler = window.setInterval(() => {
                let href = document.location.href;
                if ((href.indexOf('testlist') + href.indexOf('examlist') + href.indexOf('content') + href.indexOf('quizscore') + href.indexOf('quiz') + href.indexOf('hw') > -6) && window.courseCardDto) {
                    domooc.loaded = true;
                    loadxcComfirm($, window, domooc);
                    window.clearInterval(intHandler);
                    initParams();
                    window.setTimeout(() => { view.init(); }, 3000);
                    domooc.edu = window.edu;
                    try {
                        domooc.FILL_BLANK_SPLITCHAR = domooc.edu.u.CONST.FILL_BLANK_SPLITCHAR;
                    } catch (error) {
                        domooc.console.error(error);
                    } finally {
                        domooc.FILL_BLANK_SPLITCHAR = domooc.FILL_BLANK_SPLITCHAR ? domooc.FILL_BLANK_SPLITCHAR : "##%_YZPRLFH_%##";
                    }
                    let handler1 = window.setInterval(() => {
                        let video = document.querySelector("video");
                        if (video && (typeof video.onpause !== "function")) {
                            video.onpause = () => {
                                if ($('div.j-insetCt')[0]) {
                                    $('div.j-insetCt').parent().remove();
                                    video.play();
                                }
                            }
                        }
                    }, 1000);
                    let href = document.location.href;
                    domooc.href = href;
                    if (usersetting.cdkey) {
                        GM_setValue('cdkey', usersetting.cdkey);
                    }
                    let lastUser = GM_getValue('lastUserInfo');
                    if (!lastUser) {
                        lastUser = getInitialData().user;
                        GM_setValue('lastUserInfo', getInitialData().user);
                    }
                    if (lastUser.id !== getInitialData().user.id) {
                        GM_setValue('lastUserInfo', getInitialData().user);
                        view.showServerMsg({
                            title: "MOOC账号更换通知",
                            message: "积分与cdkey绑定，更换账号后可继续使用上一个cdkey的积分<br>如需切换、清空cdkey，请点击右侧设置cdkey按钮<br>切换之前请记得备份当前cdkey，否则无法找回"
                        });
                    }
                    let updatemsg = GM_getValue('updatemsg');
                    if (!updatemsg || parseInt(updatemsg) < 180) {
                        view.showVersion();
                        GM_setValue('updatemsg', version);
                    }
                    courseCheck();
                }
            }, 500);
            let view = {
                config: {
                    tabon: 'u-curtab',
                },
                infoqueue: {
                    arr: [],
                    idx: 0,
                    length: 8,
                    put: function(msg) {
                        this.arr[this.idx % this.length] = msg;
                        this.idx = (this.idx + 1) % this.length;
                    },
                    get: function(num) {
                        return this.arr[(this.idx + num) % this.length];
                    }
                },
                dragBox: function(drag, wrap) {
                    let that = this;
                    var initX,
                        initY,
                        dragable = false,
                        wrapLeft = $(wrap).offset().left;
                    wrapTop = $(wrap).offset().top;
                    drag.addEventListener('dblclick', function(e) {
                        if (this.innerText === dstrings.dbcfold) {
                            this.innerText = dstrings.dbcunfold;
                            $("div." + names.domoocsidebar).hide();
                        } else {
                            this.innerText = dstrings.dbcfold;
                            $("div." + names.domoocsidebar).show();
                        }
                        domooc.console.log(this);
                    }, false);
                    drag.addEventListener("mousedown", function(e) {
                        dragable = true;
                        initX = e.clientX;
                        initY = e.clientY;
                        wrapLeft = $(wrap).offset().left;
                        wrapTop = $(wrap).offset().top;
                    }, false);

                    document.addEventListener("mousemove", function(e) {
                        if (dragable === true) {

                            var nowX = e.clientX,
                                nowY = e.clientY,
                                disX = nowX - initX,
                                disY = nowY - initY;
                            // console.log({
                            //     nowX, nowY, initX, initY
                            // });
                            $(wrap).offset({ left: wrapLeft + disX, top: wrapTop + disY });
                        }
                    });

                    drag.addEventListener("mouseup", function(e) {
                        dragable = false;
                        wrapLeft = $(wrap).offset().left;
                        wrapTop = $(wrap).offset().top;
                        that.top = wrapTop - $(window).scrollTop();
                        that.left = wrapLeft;
                        GM_setValue('domoocbox', {
                            top: that.top,
                            left: that.left
                        });
                    }, false);

                },
                buttons: [{
                        text: dstrings.startlearncourse,
                        onclick: function() {
                            if (!domooc.learnCourse.started) {
                                if (domooc.learnCourse.getCurrentPageType()) {
                                    domooc.learnCourse.start();
                                    view.addInfo("不要最小化当前窗口", "也不要切换出当前页面", "否则你的观看时长不会被记录！");
                                    view.showServerMsg("不要最小化当前窗口，也不要切换出当前页面，否则你的观看时长不会被记录！<br>你可以多开浏览器以并行刷课。" +
                                        "<br>刷课件的时候不会自动翻页，请耐心等待，刷完之后会自动跳转到下一个内容。" +
                                        "<br>如果刷课过程中遇到各种莫名其妙的问题，请更换为360极速浏览器。");
                                    $(this).children().text(dstrings.stoplearncourse);
                                } else {
                                    window.alert("请先点开一个课件！");
                                }
                            } else {
                                domooc.learnCourse.terminate();
                                $(this).children().text(dstrings.startlearncourse);
                            }
                        }
                    }, {
                        text: dstrings.answerall,
                        onclick: function() {
                            domooc.getAnswer();
                        }
                    }, {
                        text: dstrings.noans,
                        onclick: fastGetCourse
                    }, {
                        text: dstrings.more,
                        onclick: function() {
                            let _usersetting = GM_getValue('usersetting');
                            if (_usersetting === undefined || _usersetting === "undefined") {
                                _usersetting = usersetting;
                            }
                            let container = $(`<div class="${names.domooc}"></div>`);
                            let group1 = $(`<div class="${names.btngroup}"></div>`);
                            group1.append(`<p class="size3">更多功能</p>`);
                            names.version = genId('v');
                            names.userinfo = genId('ui');
                            names.usermsg = genId('um');
                            group1.append(`<button id="${names.version}" class="${names.domooc} button green">版本信息</button>`);
                            group1.append(`<button id="${names.userinfo}" class="${names.domooc} button green">用户信息</button>`);
                            group1.append(`<button id="${names.usermsg}" class="${names.domooc} button green">向我留言</button>`);
                            group1.append(`<button class="${names.domooc} button green" onclick="window.open('https://blog.csdn.net/qq_39635693/article/details/105492911','_blank')">使用说明</button>`);
                            group1.append(`<button class="${names.domooc} button green" onclick="window.open('https://greasyfork.org/zh-CN/scripts/399230','_blank')">greasyfork更新</button>`);
                            group1.append(`<button class="${names.domooc} button green" title="从domooc服务器复制粘贴最新脚本" onclick="window.open('https://lolzyx.xyz/static/tampermonkey/domooc.js','_blank')">复制粘贴更新</button>`);
                            container.append(group1);
                            let group2 = $(`<div class="${names.btngroup}"></div>`);
                            let currentcdkey = getInitialData().cdkey;
                            let tempdonateurl = domooc.donateurl;
                            if (currentcdkey && currentcdkey !== "undefined") {
                                tempdonateurl = domooc.donateurl + "&cdkey=" + currentcdkey;
                            }
                            names.cdkeyinfo = genId('ci');
                            group2.append(`<p class="size3">CDKEY相关（确定后需刷新才能生效）</p>`);
                            group2.append(`<button class="${names.domooc} button green" onclick="window.open('${domooc.retrievecdkeyurl}','_blank')">找回cdkey</button>`);
                            group2.append(`<button onclick="window.open('${tempdonateurl}','_blank')" class="${names.domooc} button green">获取积分</button>`);
                            group2.append(`<button id="${names.cdkeyinfo}" class="${names.domooc} button green">积分使用记录</button>`);
                            let form2 = $(`<form class="size3" name="cdkey"></form>`);
                            form2.append(`<span style="font-weight:700;color:#2aa126;">设置cdkey：</span><input type="text" name="cdkey" placeholder="${currentcdkey ? "点击确定清空当前cdkey，清空前请先备份" : '请输入要使用的cdkey'}" value="${currentcdkey ? currentcdkey : ''}" size="66"/><br>`);
                            if (currentcdkey) {
                                form2.append(`如需清空，将上面cdkey全部删除后确定即可`);
                            };
                            group2.append(form2);
                            container.append(group2);
                            let group3 = $(`<div class="${names.btngroup}"></div>`);
                            group3.append(`<p class="size3">挂机刷课设置（确定后需刷新才能生效）</p>`);
                            let form3 = $(`<form class="size3" name="learnsetting"></form>`);
                            form3.append(`<input type="checkbox" name="video" value="video" ${_usersetting.learnCourse.video ? 'checked' : ''} />刷视频 `);
                            form3.append(`<input type="checkbox" name="doc" value="doc" ${_usersetting.learnCourse.doc ? 'checked' : ''}/>刷文档 `);
                            form3.append(`<input type="checkbox" name="test" value="test" ${_usersetting.learnCourse.test ? 'checked' : ''}/>刷随堂测验<br>`);
                            form3.append(`<input type="checkbox" name="discuss" value="discuss" ${_usersetting.learnCourse.discuss ? 'checked' : ''}/>刷讨论（将自动从当前页面选一条最长的评论复制粘贴，如果当前讨论还没有人发表评论则跳过）<br>`);
                            form3.append(`视频倍速（最高16倍，设置为0表示用默认速度）：<input type="number" name="playrate" size="6" value="${_usersetting.learnCourse.playrate}"/><br>`);
                            group3.append(form3);
                            container.append(group3);
                            let group4 = $(`<div class="${names.btngroup}"></div>`);
                            group4.append(`<p class="size3">答题设置（确定后需刷新才能生效）</p>`);
                            let form4 = $(`<form class="size3" name="answersetting"></form>`);
                            form4.append(`<input type="checkbox" name="autogetanswer" value="autogetanswer" ${_usersetting.autogetanswer ? 'checked' : ''}/>自动获取答案（每次测验自动获取答案，并扣除相应积分，刷新将导致重复扣除积分）<br>`);
                            form4.append(`<input type="checkbox" name="autoanswer" value="autoanswer" ${_usersetting.autoanswer ? 'checked' : ''}/>自动填写答案（不支持"单个题目查看答案"自动填写）<br>`);
                            form4.append(`<input type="checkbox" name="showanswerbtn" value="showanswerbtn" ${_usersetting.showanswerbtn ? 'checked' : ''}/>显示查看答案按钮（关闭后不会显示每道题的答案，此项对主观题无效）<br>`);
                            form4.append(`答题延时（每两道题之间的时间间隔，至少为${mintimeout/1000}秒）：<input type="number" name="timeout" size="6" value="${_usersetting.timeout / 1000}"/><br>`);
                            group4.append(form4);
                            container.append(group4);
                            domooc.wxc.xcConfirm(container, "custom", option = {
                                title: dstrings.more,
                                btn: parseInt("0011", 2),
                                onOk: () => {
                                    form2.find('input').each((idx, ele) => {
                                        if (ele.name === "cdkey" && typeof ele.value === "string") {
                                            function checkCdkey(v) {
                                                try {
                                                    if (currentcdkey === v) {
                                                        return;
                                                    }
                                                    if (!v) {
                                                        if (!currentcdkey || currentcdkey === "undefined") {
                                                            return;
                                                        }
                                                        let txt = `<span style='color:#16a951;font-size:bold;'>当前cdkey为：${currentcdkey}，清空后不可恢复！</span>`
                                                        let option = {
                                                            title: "确认清除当前cdkey？",
                                                            btn: parseInt("0011", 2),
                                                            onOk: function() {
                                                                view.showServerMsg("cdkey已清空！<br>如果cdkey内还有积分，建议将cdkey保存到QQ收藏<br>" + currentcdkey);
                                                                GM_setValue('lastcdkey', currentcdkey);
                                                                GM_setValue("cdkey", undefined);
                                                            }
                                                        }
                                                        domooc.wxc.xcConfirm(txt, "custom", option);
                                                    } else {
                                                        let cdkey = /^[\w\d]{64,64}$/g.exec(v.replace(/[\s]+?/g, ''));
                                                        if (!cdkey) {
                                                            throw Error("cdkey format wrong!");
                                                        } else {
                                                            GM_setValue('lastcdkey', currentcdkey + '');
                                                            GM_setValue('cdkey', cdkey[0]);
                                                            let msg = "设置cdkey成功！刷新后生效。<br><br>当前cdkey：<br>" + cdkey[0];
                                                            if (currentcdkey) {
                                                                msg += "<br><br>" + "上一个cdkey为：<br>" + currentcdkey + "<br><strong style='color:red'>建议您保存上一个cdkey</strong>"
                                                            }
                                                            view.showServerMsg(msg);
                                                        }
                                                    }
                                                } catch (e) {
                                                    console.error(e);
                                                    view.showServerMsg("请输入有效的cdkey<br>如果您确定cdkey无问题，请更换其他浏览器后再试<br>更换之前记得保存好您的cdkey");
                                                }
                                            }
                                            checkCdkey(ele.value);
                                        }
                                    });
                                    form3.find('input').each((idx, ele) => {
                                        _usersetting.learnCourse[ele.name] = ele.type === "number" ? parseFloat(ele.value) : ele.checked;
                                    });
                                    form4.find('input').each((idx, ele) => {
                                        _usersetting[ele.name] = ele.type === "number" ? parseFloat(ele.value) * 1000 : ele.checked;
                                    });
                                    if (_usersetting.learnCourse.playrate < 0 || _usersetting.learnCourse.playrate > 16) {
                                        window.alert('播放倍速范围应该在0-16！');
                                        return false;
                                    } else if (_usersetting.timeout < mintimeout / 1000) {
                                        window.alert(`答题延时应大于${ mintimeout / 1000}！`);
                                        return false;
                                    } else if (!_usersetting.autoanswer && !_usersetting.showanswerbtn) {
                                        window.alert('"自动填写答案"与"显示查看答案按钮"不能同时关闭！\n否则无法正常使用！');
                                        return false;
                                    } else {
                                        domooc.console.log(_usersetting);
                                        GM_setValue("usersetting", _usersetting);
                                        usersetting = _usersetting;
                                    }
                                }
                            });
                            $("#" + names.version).click(() => {
                                view.showVersion();
                            });
                            let showinfo = function() {
                                var txt = "上传给服务器的信息：";
                                let user = getInitialData().user;
                                for (let key in user) {
                                    txt = txt + "<br>" + key + "：" + user[key]
                                }
                                let localcdkey = GM_getValue('cdkey');
                                if (localcdkey && localcdkey !== "undefined") {
                                    txt = txt + "<br><br>" + `<span style='color:#16a951;font-size:bold;'>保存在本地的cdkey（更换账号后将使用此cdkey）：${localcdkey}</span>`
                                }
                                if (domooc.userinfo) {
                                    let txt2 = "mooc账号积分使用情况（若存在cdkey则优先使用cdkey积分）：";
                                    txt2 = txt2 + "<br>" + "总积分：" + "：" + domooc.userinfo.credits;
                                    txt2 = txt2 + "<br>" + "已使用：" + "：" + domooc.userinfo.usedcredits;
                                    // if (domooc.userinfo.cdkeys instanceof Array) {
                                    //     domooc.userinfo.cdkeys.forEach((key, idx) => {
                                    //         txt2 = txt2 + "<br>" + "cdkey" + idx + "：" + key;
                                    //     })
                                    // }
                                    if (domooc.userinfo.cdkey) {
                                        let cdkey = domooc.userinfo.cdkey;
                                        txt2 = txt2 + "<br><br>" + "cdkey积分使用情况：";
                                        txt2 = txt2 + "<br>" + "<span style='color:#16a951;font-size:bold;'>cdkey（请妥善保存，勿泄露给他人）" + "：" + cdkey.pattern + "</span>";
                                        txt2 = txt2 + "<br>" + "总积分" + "：" + cdkey.credits;
                                        txt2 = txt2 + "<br>" + "已使用" + "：" + cdkey.usedcredits;

                                        function fixwidth(str, width) {
                                            let length = width - str.length;
                                            while (length-- > 0) {
                                                str += '&nbsp;&nbsp;';
                                            }
                                            return str;
                                        }
                                        cdkey.records.forEach(x => {
                                            txt2 = txt2 + "<br>" + `名称：${fixwidth(x.name, 4)} &nbsp;&nbsp; 扣除积分：${fixwidth(x.used + "", 4)}  时间：${new Date(x.timestamp).toLocaleString()} `;
                                        });
                                    }
                                    txt = txt + "<br><br>" + txt2;
                                }
                                let option = {
                                    title: "用户信息/积分记录",
                                    btn: parseInt("0011", 2),
                                }
                                domooc.wxc.xcConfirm(txt, "custom", option);
                            };
                            $("#" + names.userinfo).click(showinfo);
                            $("#" + names.cdkeyinfo).click(showinfo);
                            $("#" + names.usermsg).click(function() {
                                var txt = "留言板";
                                domooc.wxc.xcConfirm(txt, domooc.wxc.xcConfirm.typeEnum.input, {
                                    title: "留言板",
                                    onOk: function(v) {
                                        userMessage(v);
                                    },
                                    onCancel: function(v) {}
                                });
                            });
                        }
                    },
                    // {
                    //     text: "收起面板",
                    //     onclick: function (e) {
                    //         let displaytext = $(this).children().text() === "<" ? "收起面板" : "<";
                    //         $(this).children().text(displaytext);
                    //         if (displaytext === "<") {
                    //             $(this).siblings().hide();
                    //             $("#domoocsidebar ul:eq(0)").hide();
                    //             $(this).children().css("text-align", "right");
                    //             $(this).css("width", "min-content");
                    //             $(this).css("float", "right");
                    //         } else {
                    //             $(this).siblings().show();
                    //             $("#domoocsidebar ul:eq(0)").show();
                    //             $(this).children().css("text-align", "center");
                    //             $(this).css("width", "auto");
                    //             $(this).css("float", "inherit");
                    //         }
                    //         $(this).children().text(displaytext);
                    //     }
                    // }
                ],
                refreshBtnList() {
                    let btnlist = this.sidebar.children()[1];
                    btnlist = $(btnlist);
                    btnlist.empty();
                    this.buttons.forEach(btn => {
                        let li = $(`<li class="${names.domooc}"><a  style="line-height:2em;font-size:1.2em;font-weight:bold;padding:0;text-align:center;background-color:transparent;" ${btn.href ? 'href="' + btn.href + '"' : ""} target="${btn.href ? "_blank" : ""}">${btn.text}</a></li>`);
                        if (typeof btn.onclick === "function") {
                            li.click(btn.onclick);
                        }
                        if (typeof btn.class === "string") {
                            li.addClass(btn.class);
                        }
                        if (btn.style) {
                            li.css(btn.style);
                        }
                        btnlist.append(li);
                    });
                    $("li.domooc a:hover").css("background-color", "transparent");
                },
                addInfo(...msg) {
                    msg.forEach(ele => {
                        if (ele && (typeof ele !== "string") && ele.length) {
                            for (let i = 0; i < ele.length; i++) {
                                this.infoqueue.put(ele[i]);
                            }
                        } else if (typeof ele === "string" && ele.length) {
                            this.infoqueue.put(ele);
                        }
                    });
                    let temp = () => {
                        let infolist = this.sidebar.children()[0];
                        infolist = $(infolist);
                        infolist.empty();
                        let lis = [];
                        for (let i = 0; i < this.infoqueue.length; i++) {
                            let info = this.infoqueue.get(i);
                            if (info) {
                                let element;
                                if (info.startsWith("<error>")) {
                                    let color = '#c3272b';
                                    info = info.replace("<error>", "");
                                    element = `<li class="${names.domoocinfo}"><span title="${info}" style="font-size:1.2em;font-weight:750;color: ${color};line-height:2.5em;">${info}</span></li>`;
                                } else if (info.startsWith("<strong>")) {
                                    info = info.replace("<strong>", "");
                                    let color = 'RGB(85,185,41)';
                                    element = `<li class="${names.domoocinfo}"><span title="${info}" style="font-size:1.2em;font-weight:750;color: ${color};line-height:2.5em;">${info}</span></li>`;
                                } else {
                                    element = `<li class="${names.domoocinfo}"><span title="${info}" style="font-size:1em;line-height:2em;">${info}</span></li>`;
                                }
                                let li = $(element);
                                infolist.append(li);
                                lis.push(li);
                            }
                            if (lis.length === this.infoqueue.length) {
                                lis[0].fadeOut(1000, function() {});
                                lis[this.infoqueue.length - 1].hide();
                                lis[this.infoqueue.length - 1].fadeIn(1000, function() {});
                            }
                        }
                    }
                    if (!this.sidebar) {
                        window.setTimeout(() => { temp() }, 3000);
                    } else {
                        temp()
                    }

                },
                showServerMsg(msgobj) {
                    if (!msgobj) {
                        return;
                    }
                    if (msgobj.id) {
                        if (GM_getValue(msgobj.id)) {
                            return;
                        }
                    }
                    var txt = (typeof msgobj === "string") ? msgobj : msgobj.message;
                    let option = {
                        title: msgobj.title ? msgobj.title : "您有一条新消息",
                        btn: parseInt("0011", 2)
                    }

                    option.onOk = () => {
                        if (typeof msgobj.onOk === "string") {
                            window.open(msgobj.onOk);
                        }
                        if (msgobj.id) {
                            GM_setValue(msgobj.id, "true")
                        }
                    }
                    if (typeof msgobj.onCancel === "string") {
                        option.onCancel = () => { window.open(msgobj.onCancel); }
                    }
                    domooc.wxc.xcConfirm(txt, "custom", option);
                },
                sidebar: null,
                searchbar: $(`    <div class="web-nav-right-part" style="position: absolute; z-index: 99999999;background-color:white;">
            <div class="u-baseinputui" style="height: 30px;"> <input type="text" id="domoocsearch"
                    class="j-textarea inputtxt" style="width: 430px;float:left;" placeholder="搜索答案">
                <span class="u-icon-search2 j-searchBtn" style="font-size:20px;line-height:30px;"></span>
            </div>
        </div>`),
                sidebarOffset: function() {
                    let box = $(`#${names.domoocbox}`);
                    // let offset = sidebar.offset().top;
                    // let search = this.searchbar;
                    // search.offset({ top: $(window).scrollTop() + search.height() + 15, left: ($(window).width() - search.width()) / 2 });
                    box.offset({ top: $(window).scrollTop() + this.top });
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

                    function showQuizs(jnames, names) {
                        if (nopanel)
                            return;
                        let length = names.length;
                        jnames.removeClass('f-thide');
                        if (jnames.length > 0) {
                            jnames.each(function() {
                                var title = $(this)[0].innerText.domoocformat();
                                clear = (text) => {
                                    return $(this).text().replace(/<题库答案数量：[\d]+?>/, "").replace("<fail>", "");
                                }
                                $(this).text()
                                if (names.indexOf(title) > -1 && length) {
                                    length--;
                                    let idx = names.indexOf(title);
                                    $(this).attr("style", "color:RGB(85,185,41)");
                                    $(this).html(clear($(this).text()) + ' <br>' + `&lt;题库答案数量：${quizbank[idx].anscnt}&gt;`);
                                } else {
                                    $(this).attr("style", "color:red");
                                    if ($(this).text().indexOf("<fail>") === -1) {
                                        $(this).text(clear($(this).text()) + "  <fail>");
                                    }
                                }
                            });
                            window.clearInterval(intHandler);
                        }
                    }
                    let intHandler = window.setInterval(() => {
                        let ele = document.querySelectorAll('div.m-learnbox div.u-moocbl');
                        let exist = false;
                        if (ele.length) {
                            for (let i = 0; i < ele.length; i++) {
                                if (ele[i].innerText.indexOf("源课程") > -1) {
                                    ele = ele[i];
                                    exist = true;
                                    break;
                                }
                            }
                        }
                        if (ele && exist) {
                            let spoc = ele.previousElementSibling;
                            if (spoc) {
                                let names = quizbank.map(x => x.isSourceCourse ? "" : x.name.domoocformat());
                                let jnames = $(spoc).find("div.titleBox h4.j-name");
                                showQuizs(jnames, names);
                            }
                            let source = ele.nextElementSibling;
                            if (source) {
                                let names = quizbank.map(x => x.isSourceCourse ? x.name.domoocformat() : "");
                                let jnames = $(source).find("div.titleBox h4.j-name");
                                showQuizs(jnames, names);
                            }
                        } else {
                            let names = quizbank.map(x => x.isSourceCourse ? "" : x.name.domoocformat());
                            let jnames = $("div.titleBox h4.j-name");
                            showQuizs(jnames, names);
                        }
                    }, 500);
                },
                showVersion() {
                    this.showServerMsg({
                        title: "当前版本：1.8",
                        message: "1. 优化了使用体验，现在会显示选项对应的内容" +
                            "<br><br>2. 新增无界面模式，为避免用户误操作，需在脚本编辑器里自行设置" +
                            "<br><br>3. 现在可以直接在面板里设置刷课和答题相应功能" +
                            "<br><br>4. 新增找回cdkey功能" +
                            "<br>之前充值的用户需先为cdkey设置密码才能使用（更多>>->找回cdkey->设置密码）"
                    });
                },
                init: function() {
                    let that = this;
                    let trueinit = true;
                    let _init = () => {
                        that.domoocbox = $(`<div id="${names.domoocbox}" ${nopanel ? 'style="display:none;"' : ''}>
                    <div class="${names.domoocbar}">${dstrings.dbcfold}</div>
                    <div class="${names.domoocsidebar}"></div>
                    </div>`);
                        $(parentDiv()).append(that.domoocbox);
                        let sidebar = $(`div.${names.domoocsidebar}`);
                        that.sidebar = sidebar;
                        let infolist = $('<ul  style="padding:0 10px;"></ul>');
                        let btnlist = $('<ul  style="padding:0 10px;"></ul>');
                        sidebar.append(infolist);
                        sidebar.append(btnlist);
                        // $('body').append(that.searchbar);
                        that.addInfo("");
                        that.refreshBtnList();
                        // if (domooc.hasPaper) {
                        //     domooc.hasPaper = false;
                        //     $('.' + domoocvideoname + ' > a').text("一键答题");
                        // }
                        // that.sidebarOffset();
                        // that.searchbar.width(450);
                        // that.searchbar.hide();
                        window.onscroll = function() {
                            that.sidebarOffset();
                        }
                        window.onresize = window.onscroll;
                        let offset = GM_getValue('domoocbox');
                        if (trueinit) {
                            if (offset && offset !== "undefined") {
                                that.top = offset.top;
                                that.left = offset.left;
                            } else {
                                that.top = ($(window).height() - $(`#${names.domoocbox}`).height()) / 2;
                                that.left = $(window).width() * 0.85 - $(`#${names.domoocbox}`).width();
                            }
                        }
                        $(`#${names.domoocbox}`).offset({ top: that.top, left: that.left });
                        that.dragBox(document.querySelector(`div.${names.domoocbar}`), document.querySelector(`#${names.domoocbox}`));
                        trueinit = false;
                    }
                    _init();
                    window.setInterval(() => {
                        if (!document.querySelector(`#${names.domoocbox}`)) {
                            _init();
                        }
                    }, 100);
                },
            }
            domooc[_view] = view;
            domooc[learnCourse] = {
                pageTypes: ['discuss', 'video', 'test', 'doc', 'text'],
                rate: 0,
                changeCnt: 0,
                loaded: true,
                handler: 0,
                eventHandlerInt: 0,
                started: false,
                unitId: null,
                textPages: null,
                maxRepeat: 15,
                repeat: 15,
                pageProcessed: false,

                setPlayRate(rate) {
                    if (typeof rate === "number" && rate > 0 && rate <= 16) {
                        let video = document.querySelector('video');
                        if (video) {
                            video.playbackRate = rate;
                        }
                    }
                },
                getCurrentPageType() {
                    let current = this.getCurrentPosition();
                    let type = null;
                    this.pageTypes.forEach(t => {
                        if (this.checkClass(current.content, t)) {
                            type = t;
                        }
                    });
                    return type;
                },
                getCurrentPosition() {
                    let result = {};
                    let temp = $('#courseLearn-inner-box div.j-chapter div.u-select div.j-up.f-thide').text().trim2();
                    let chapter = $('#courseLearn-inner-box div.j-chapter div.u-select div.j-list').children();
                    chapter.each(function() { if ($(this).text().trim2() === temp) result.chapter = $(this) });
                    temp = $('#courseLearn-inner-box div.j-lesson div.u-select div.j-up.f-thide').text().trim2();
                    let lesson = $('#courseLearn-inner-box div.j-lesson div.u-select div.j-list').children();
                    lesson.each(function() { if ($(this).text().trim2() === temp) result.lesson = $(this) });
                    if (!result.lesson) {
                        result.lesson = $(lesson[0]);
                    }
                    result.content = $('#courseLearn-inner-box div.lscontent > ul > li.current');
                    return result;
                },
                getCurrentPosition() {
                    let result = {};
                    let temp = $('#courseLearn-inner-box div.j-chapter div.u-select div.j-up.f-thide').text().trim2();
                    let chapter = $('#courseLearn-inner-box div.j-chapter div.u-select div.j-list').children();
                    chapter.each(function() { if ($(this).text().trim2() === temp) result.chapter = $(this) });
                    temp = $('#courseLearn-inner-box div.j-lesson div.u-select div.j-up.f-thide').text().trim2();;
                    let lesson = $('#courseLearn-inner-box div.j-lesson div.u-select div.j-list').children();
                    lesson.each(function() { if ($(this).text().trim2() === temp) result.lesson = $(this) });
                    if (!result.lesson) {
                        result.lesson = $(lesson[0]);
                    }
                    result.content = $('#courseLearn-inner-box div.lscontent > ul > li.current');
                    return result;
                },
                checkClass(ele, cla) {
                    let span = ele.children('span.f-icon')[0];
                    let result = false;
                    if (span) {
                        if (cla instanceof Array) {
                            cla.forEach(str => {
                                if (span.classList.value.indexOf(str) > -1) {
                                    result = true;
                                }
                            });
                        } else if (typeof cla === "string") {
                            result = span.classList.value.indexOf(cla) > -1
                        }
                    }
                    return result;
                },
                _getNextContent(current, notnext) {
                    return new Promise((resolve, reject) => {
                        if (!current) {
                            current = this.getCurrentPosition();
                        }
                        let next = current.content;
                        if (!notnext) {
                            next = current.content.next();
                        }
                        let flag = true;
                        let that = this;
                        if (!next[0]) {
                            flag = false;
                            this.getNextLesson(current).then((finish) => {
                                if (!finish) {
                                    resolve(that._getNextContent(that.getCurrentPosition(), true));
                                } else {
                                    resolve(null);
                                }
                            });
                        }
                        if (flag) {
                            resolve(next);
                        }
                    });
                },
                _click(ele, resolve) {
                    ele.click();
                    let temp = window.setInterval(() => {
                        if (this.loaded) {
                            window.clearInterval(temp);
                            resolve();
                        }
                    }, 99);
                },
                getNextLesson(current) {
                    let that = this;
                    return new Promise((resolve, reject) => {
                        let next = current.lesson.next();
                        if (!next[0]) {
                            this.getNextChapter(current).then((finish) => {
                                if (!finish) {
                                    that._click(that.getCurrentPosition().lesson, resolve);
                                } else {
                                    resolve(finish);
                                }
                            });
                        } else {
                            that._click(next, resolve);
                        }
                    });
                },
                getNextChapter(current) {
                    let that = this;
                    return new Promise((resolve, reject) => {
                        let next = current.chapter.next();
                        if (!next[0]) {
                            resolve(true);
                        } else {
                            that._click(next, resolve);
                        }
                    });
                },
                getNextContent() {
                    let that = this;
                    return new Promise((resolve, reject) => {
                        let current = this.getCurrentPosition();
                        this._getNextContent(current).then((next) => {
                            if (next) {
                                next.click();
                            } else {
                                window.clearInterval(that.eventHandlerInt);
                                that.eventHandlerInt = 0;
                                $('.' + domoocvideoname).click();
                                view.addInfo("所有课程观看完成！", "觉得好用请捐赠作者，谢谢！");
                                view.showServerMsg("所有课程观看完成！觉得好用请捐赠作者，谢谢！");
                            }
                            resolve();
                        });
                    });
                },
                async docfetch(page, unitId, finished) {
                    return window.fetch(`/web/j/courseBean.saveMocContentLearn.rpc?csrfKey=${domooc.csrf}`, {
                        body: `dto={"unitId":${unitId},"pageNum":${page},"finished":${finished},"contentType":3}`, // must match 'Content-Type' header
                        headers: {
                            'user-agent': 'Mozilla/4.0 MDN Example',
                            'content-type': 'application/x-www-form-urlencoded',
                            'edu-script-token': domooc.csrf
                        },
                        method: 'POST',
                    }).then(function(response) {
                        return response.json();
                    })
                },
                handlePageEvents() {
                    let that = this;
                    let running = false;
                    that.repeat = that.maxRepeat;
                    let init = () => {
                        that.repeat = that.maxRepeat;
                        running = false;
                        that.pageProcessed = false;
                    };
                    if (!that.eventHandlerInt) {
                        that.eventHandlerInt = window.setInterval(() => {
                            if (that.repeat-- < 0) {
                                that.getNextContent().then(init);
                            }
                            if (that.pageProcessed || running) {
                                return;
                            }
                            let current = that.getCurrentPosition();
                            domooc.console.log({ current, repeat: that.repeat, running, that });
                            if (that.checkClass(current.content, 'doc')) {
                                if (!usersetting.learnCourse.doc) {
                                    that.getNextContent().then(init);
                                    return;
                                }
                                if (that.unitId && that.textPages) {
                                    running = true;
                                    let unitId = that.unitId;
                                    let textPages = that.textPages;
                                    that.unitId = 0;
                                    that.textPages = 0;
                                    for (let i = 0; i < textPages; i++) {
                                        let finished = ((i + 1) === textPages);
                                        window.setTimeout(async() => {
                                            let res = null;
                                            that.repeat = that.maxRepeat;
                                            let cnt = 3;
                                            do {
                                                res = await that.docfetch(i + 1, unitId, finished);
                                            } while (cnt-- && (!res || !res.result));
                                            if (finished) {
                                                running = false;
                                                that.pageProcessed = true;
                                                that.getNextContent().then(init);
                                            }
                                        }, i * 1000);
                                    }
                                } else if (that.repeat < that.maxRepeat - 3) {
                                    view.showServerMsg("获取课件信息失败，<br>请关闭当前网页重新进入！");
                                }
                            } else if (that.checkClass(current.content, 'text')) {
                                that.pageProcessed = true;
                                window.setTimeout(() => {
                                    that.getNextContent().then(init);
                                }, 2000);
                            } else if (that.checkClass(current.content, 'video')) {
                                if (!usersetting.learnCourse.video) {
                                    that.getNextContent().then(init);
                                    return;
                                }
                                let video = document.querySelector('video');
                                document.querySelector('input.j-autoNext').checked = false;
                                $('input.j-autoNext').hide();
                                if (video) {
                                    that.setPlayRate(that.rate);
                                    if (typeof video.onended !== "function") {
                                        video.onended = () => {
                                            that.getNextContent().then(init);
                                        }
                                    }
                                    if (typeof video.ontimeupdate !== "function") {
                                        video.ontimeupdate = () => {
                                            that.repeat = that.maxRepeat;
                                        }
                                        video.currentTime = 0;
                                        video.play();
                                    }
                                }
                            } else if (that.checkClass(current.content, 'discuss')) {
                                if (!usersetting.learnCourse.discuss) {
                                    that.pageProcessed = true;
                                    that.getNextContent().then(init);
                                    return;
                                }
                                running = true;
                                let p = document.querySelectorAll('div.j-list div.j-content');
                                let frames = document.getElementsByTagName('iframe');
                                let contentBody = null;
                                if (frames.length) {
                                    for (let i = 0; i < frames.length; i++) {
                                        let fd = frames[i].contentDocument;
                                        let pe = fd.querySelector('body.view p');
                                        if (pe) {
                                            contentBody = pe;
                                            break;
                                        }
                                    }
                                }
                                let content = '';
                                if (p.length) {
                                    for (let i = 0; i < p.length; i++) {
                                        if (content.length < p[i].innerText.length) {
                                            content = p[i].innerText;
                                        }
                                    }
                                    contentBody.innerHTML = content + contentBody.innerHTML;
                                    let submit = document.querySelector('a.j-edit-btn.editbtn.u-btn-sm.u-btn-primary');
                                    if (submit) {
                                        submit.click();
                                        that.pageProcessed = true;
                                    }
                                }
                                window.setTimeout(() => {
                                    running = false;
                                    that.getNextContent().then(init);
                                }, 4000);
                            } else if (that.checkClass(current.content, 'test')) {
                                if (!usersetting.learnCourse.test) {
                                    that.pageProcessed = true;
                                    that.getNextContent().then(init);
                                    return;
                                }
                                let submit = document.querySelector('a.u-btn.j-submit');
                                if (submit && domooc.answerAll) {
                                    running = true;
                                    window.setTimeout(() => {
                                        if (submit.innerText === "提交") {
                                            domooc.answerAll = false;
                                            submit.click();
                                            that.pageProcessed = true;
                                        }
                                        window.setTimeout(() => {
                                            running = false;
                                            that.getNextContent().then(init);
                                        }, 2000);
                                    }, 2500);
                                }
                            }
                        }, 2500);
                    }
                },
                start() {
                    domooc.console.log('video control start');
                    this.handlePageEvents();
                    document.onvisibilitychange = () => {
                        view.addInfo("切换出当前页面后，你的观看时长将不会被记录！", "如果没有触发此提示，说明你的观看时长会被服务器记录。", "你可以多开浏览器以同时刷课，注意不要最小化。");
                    }
                    this.started = true;
                    this.rate = usersetting.learnCourse.playrate;
                    if (!this.handler) {
                        $('div.m-lessonDetail').bind('DOMSubtreeModified', () => { domooc.learnCourse.changeCnt++ });
                        this.handler = window.setInterval(() => {
                            if (this.changeCnt > 0) {
                                this.loaded = false;
                                this.changeCnt = 0;
                            } else {
                                this.loaded = true;
                            }
                            if (!this.getCurrentPageType()) {
                                this.terminate();
                            }
                        }, 1000);
                    }
                },
                terminate() {
                    $('div.m-lessonDetail').unbind('DOMSubtreeModified');
                    window.clearInterval(this.handler);
                    window.clearInterval(this.eventHandlerInt);
                    let video = document.querySelector('video');
                    this.rate = 0;
                    this.changeCnt = 0;
                    this.loaded = true;
                    this.handler = 0;
                    this.eventHandlerInt = 0;
                    this.started = false;
                    document.onvisibilitychange = null;
                    view.addInfo(confuse('已关闭刷课功能'));
                    $('input.j-autoNext').show();
                    if (video) {
                        video.onended = null;
                        video.onpause = null;
                    }
                }
            }
            domooc[learnCourse][setPage] = function(page) {

                this.textPages = page;
            };
            domooc[learnCourse][setUnitId] = function(unitId) {
                this.unitId = unitId;
            };
            window.setPlayRate = domooc.learnCourse.setPlayRate;
        })


        domooc.execAfterLoaded = function(fname, param) {
            return new Promise((resolve, reject) => {
                let handler = window.setInterval(() => {
                    if (domooc.loaded) {
                        window.clearInterval(handler);
                        if (typeof fname === "string") {
                            if (fname === answerClassTest) {
                                let redo = document.querySelector('.submit.j-replay');
                                if (redo && redo.style.display !== "none") {
                                    redo.click();
                                }
                                domooc[bindGetAnswer](param);
                                domooc[fname](param.paper);
                            } else {
                                domooc[fname](param);
                            }
                            resolve();
                        } else if (fname instanceof Array) {
                            let func = domooc;
                            let that = null;
                            fname.forEach(f => {
                                that = func;
                                func = func[f];
                            });
                            func.call(that, param);
                            resolve();
                        }
                    }
                }, 300);
            });
        };

        domooc.bindGetAnswer = function(obj) {
            let quizs = [];
            if (!(domooc.getAnswerquizs instanceof Array)) {
                domooc.getAnswerquizs = [];
            }
            if (obj) {
                if (obj.paper) {
                    obj = obj.paper;
                }
                if (obj.objectiveQList && obj.objectiveQList.length) {
                    quizs = obj.objectiveQList;
                } else if (obj.subjectiveQList && obj.subjectiveQList.length) {
                    quizs = obj.subjectiveQList;
                }
                domooc.getAnswerquizs = quizs.map(x => 0);
            }
            $('div.j-title.title div.f-richEditorText.j-richTxt').each((idx, ele) => {

                let btn = $(`<p data-${names.qid}="${quizs[idx].id}" id="${domooc.getanswerbyidstr}" style="background:rgba(160,255,80,0);color: rgba(255, 255, 255, 0.5);font-size:14px;font-family:等线;${usersetting.showanswerbtn || (document.location.href.indexOf('hw') > -1) ? '' : 'display:none;'}""><a class="f-fcgreen" style="color:#000" >${dstrings.showans}</a></p>`);
                btn.children().click(function() {
                    domooc.getAnswerById(this, quizs[idx], idx);
                });
                $(ele).append(btn);
            });
            // domooc.hasPaper = true;
            // $('.' + domoocvideoname + ' > a').text("一键答题");
        }

        let hookhandler = window.setInterval(() => {
            if (window.dwr && window.dwr.engine && !domooc._remoteHandleCallback) {
                window.clearInterval(hookhandler);
                domooc._remoteHandleCallback = window.dwr.engine._remoteHandleCallback;
                window.dwr.engine._remoteHandleCallback = function(batchId, status, obj) {
                    domooc._remoteHandleCallback(batchId, status, obj);
                    domooc.console.log({ batchId, status, obj });
                    if (!!obj) { //取得题目json;

                        if ((obj.objectiveQList && obj.objectiveQList.length || obj.subjectiveQList && obj.subjectiveQList.length) && obj.submitStatus === 1) {
                            domooc.getAnswerflag = false;
                            domooc.quizpaper = obj;
                            domooc.answerAll = false;
                            domooc.execAfterLoaded(bindGetAnswer, obj).then(() => {
                                if (usersetting.autogetanswer) {
                                    domooc.execAfterLoaded(getAnswer, obj);
                                }
                            });
                            domooc.execAfterLoaded([_view, 'showServerMsg'], {
                                id: "tips11",
                                title: "使用提示",
                                message: "如需自动答题，请编辑源代码设置autogetanswer为true<br>或点击右侧一键答题按钮"
                            });

                        } else if (obj.objectiveQList && obj.submitStatus === 2) {
                            domooc.execAfterLoaded(analysisAnswer, obj);
                        } else if (obj.paper && obj.paper.objectiveQList && obj.paper.objectiveQList.length) {
                            domooc.quizpaper = obj.paper;
                            domooc.answerAll = false;
                            domooc.execAfterLoaded(bindGetAnswer, obj).then(() => {
                                domooc.execAfterLoaded(answerClassTest, obj);
                            });

                        }
                        if (obj.textPages) {
                            domooc.execAfterLoaded([learnCourse, setPage], obj.textPages);
                        }
                        if (obj.unitId) {
                            domooc.execAfterLoaded([learnCourse, setUnitId], obj.unitId);
                        }
                    } else if (obj === 0 && domooc.quizbank) {
                        domooc.execAfterLoaded([_view, showQuizbank]);
                    }
                };
            }
        }, 20);

        function loadxcComfirm($, window, domooc) {
            domooc.wxc = domooc.wxc || {};
            let names = {
                wxcname: genId(5),
                xc_layer: genId(6),
                popBox: genId(7),
                txtBox: genId(8),
                btnArea: genId(9),
                btnGroup: genId('a'),
                sgBtn: genId('n'),
                ok: genId('c'),
                cancel: genId('d'),
                verticalAlign: genId('x'),
                ttBox: genId('q'),
                tt: genId('l'),
                clsBtn: genId('u'),
            }
            let style = `<style type="text/css">/*垂直居中*/ \
    .${names.verticalAlign}{ vertical-align:middle; display:inline-block; height:100%; margin-left:-1px;}\
    .${names.wxcname} .${names.xc_layer}{position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #666666; opacity: 0.5; z-index: 2147000000;}\
    .${names.wxcname} .${names.popBox}{position: absolute; background-color: #ffffff; z-index: 2147000001; width: max-content; height: max-content; border-radius: 5px; font-weight: bold; color: #535e66;}\
    .${names.wxcname} .${names.popBox} .${names.ttBox}{height: 30px; line-height: 30px; padding: 14px 30px; border-bottom: solid 1px #eef0f1;}\
    .${names.wxcname} .${names.popBox} .${names.ttBox} .${names.tt}{font-size: 18px; display: block; float: left; height: 30px; position: relative;}\
    .${names.wxcname} .${names.popBox} .${names.ttBox} .${names.clsBtn}{display: block; cursor: pointer; width: 12px; height: 12px; position: absolute; top: 22px; right: 30px; background: url(../img/icons.png) -48px -96px no-repeat;}\
    .${names.wxcname} .${names.popBox} .${names.txtBox}{margin: 40px 100px;  overflow: hidden;display:flex;margin:20px 40px}\
    .${names.wxcname} .${names.popBox} .${names.txtBox} .bigIcon{float: left; margin-right: 20px; width: 48px; height: 48px; background-image: url(../img/icons.png); background-repeat: no-repeat; background-position: 48px 0;}\
    .${names.wxcname} .${names.popBox} .${names.txtBox} textarea{float: left; width: 300px;  margin-top: 16px; line-height: 26px; }\
    .${names.wxcname} .${names.popBox} .${names.txtBox} textarea{width: 450px;height:200px;  border: solid 1px rgb(85,185,41);font-family: sans-serif; font-size: 18px; margin-top: 6px;}\
    .${names.wxcname} .${names.popBox} .${names.btnArea}{border-top: solid 1px #eef0f1;}\
    .${names.wxcname} .${names.popBox} .${names.btnGroup}{float: right;}\
    .${names.wxcname} .${names.popBox} .${names.btnGroup} .${names.sgBtn}{margin: 14px;}\
    .${names.wxcname} .${names.popBox} .${names.sgBtn}{display: block; cursor: pointer; float: left; width: 95px; height: 35px; line-height: 35px; text-align: center; color: #FFFFFF; border-radius: 5px;}\
    .${names.wxcname} .${names.popBox} .${names.sgBtn}.${names.ok}{background-color:rgb(85,185,41); color: #FFFFFF;}\
    .${names.wxcname} .${names.popBox} .${names.sgBtn}.${names.cancel}{background-color: rgb(248,248,248); color: #000;}\
    </style>`;
            $('body').append($(style));
            domooc.wxc.xcConfirm = function(popHtml, type, options) {
                if (nopanel)
                    return;
                //按钮类型
                domooc.wxc.xcConfirm.btnEnum = {
                    ok: parseInt("0001", 2), //确定按钮
                    cancel: parseInt("0010", 2), //取消按钮
                    okcancel: parseInt("0011", 2) //确定&&取消
                };

                //触发事件类型
                domooc.wxc.xcConfirm.eventEnum = {
                    ok: 1,
                    cancel: 2,
                    close: 3
                };

                //弹窗类型
                domooc.wxc.xcConfirm.typeEnum = {
                    info: "info",
                    success: "success",
                    error: "error",
                    confirm: "confirm",
                    warning: "warning",
                    input: "input",
                    custom: "custom"
                };
                var btnType = domooc.wxc.xcConfirm.btnEnum;
                var eventType = domooc.wxc.xcConfirm.eventEnum;
                let closeDefault = () => {
                    // let onscroll = window.onscroll;
                    // if (typeof window.onscroll === "function") {
                    //     window.onscroll = onscroll();
                    // }
                };
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
                        title: "请输入...",
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
                    onClose: $.noop, // 弹窗关闭的回调, 返回触发事件
                    placeholder: null
                }, itype, options);
                let $txt = null;
                if (typeof popHtml === "string") {
                    $txt = $("<p>").html(popHtml); //弹窗文本dom
                } else {
                    $txt = $(popHtml);
                }
                var $tt = $("<span>").addClass(names.tt).text(config.title); //标题
                var icon = config.icon;
                var $icon = icon ? $("<div>").addClass("bigIcon").css("backgroundPosition", icon) : "";
                var btn = config.btn; //按钮组生成参数

                var popId = creatPopId(); //弹窗索引

                var $box = $("<div>").addClass(names.wxcname); //弹窗插件容器
                var $layer = $("<div>").addClass(names.xc_layer); //遮罩层
                var $popBox = $("<div>").addClass(names.popBox); //弹窗盒子
                var $ttBox = $("<div>").addClass(names.ttBox); //弹窗顶部区域
                var $txtBox = $("<div>").addClass(names.txtBox); //弹窗内容主体区
                var $btnArea = $("<div>").addClass(names.btnArea); //按钮区域

                var $ok = $("<a>").addClass(names.sgBtn).addClass(names.ok).text("确定"); //确定按钮
                var $cancel = $("<a>").addClass(names.sgBtn).addClass(names.cancel).text("取消"); //取消按钮
                var $input = $("<textarea>").addClass("inputBox"); //输入框
                $input.attr("rows", "4");
                $input.attr("cols", "60");
                if (config.placeholder) {
                    $input.attr("placeholder", config.placeholder);
                } else if (qqgroup) {
                    $input.attr("placeholder", "有问题请加交流群：" + qqgroup);
                }
                $input.css("margin", "auto");
                var $clsBtn = $("<a>").addClass(names.clsBtn); //关闭按钮

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
                    $(parentDiv()).append($box);
                    // .append($box);
                    let setPopOffset = () => {
                        if ($popBox.width() > $(window).width() / 2) {
                            $popBox.width($(window).width() / 2);
                        }
                        $popBox.offset({ top: $(window).scrollTop() + $(window).height() / 2 - $popBox.height() / 2, left: $(window).width() / 2 - $popBox.width() / 2 });
                    };
                    setPopOffset();
                    // let onscroll = window.onscroll;
                    // window.onscroll = () => {
                    //     setPopOffset();
                    //     if (typeof onscroll === "function") {
                    //         onscroll();
                    //         return onscroll;
                    //     }
                    // }
                }

                function bind() {
                    //点击确认按钮
                    $ok.click(doOk);

                    //回车键触发确认按钮事件
                    $(domooc).bind("keydown", function(e) {
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
                    let onOkResult;
                    if ($input.is(":visible"))
                        onOkResult = config.onOk(v);
                    else
                        onOkResult = config.onOk();
                    if (onOkResult !== false) {
                        $("#" + popId).remove();
                        closeDefault();
                        config.onClose(eventType.ok);
                    }
                }

                //取消按钮事件
                function doCancel() {
                    var $o = $(this);
                    config.onCancel();
                    $("#" + popId).remove();
                    closeDefault();
                    config.onClose(eventType.cancel);
                }

                //关闭按钮事件
                function doClose() {
                    $("#" + popId).remove();
                    closeDefault();
                    config.onClose(eventType.close);
                    $(domooc).unbind("keydown");
                }

                //生成按钮组
                function creatBtnGroup(tp) {
                    var $bgp = $("<div>").addClass(names.btnGroup);
                    $.each(btns, function(i, n) {
                        if (btnType[i] == (tp & btnType[i])) {
                            $bgp.append(n);
                        }
                    });
                    return $bgp;
                }

                //重生popId,防止id重复
                function creatPopId() {
                    let i = name[Math.floor(Math.random() * name.length)] + (new Date()).getTime() + parseInt(Math.random() * 100000) + 'P';
                    if ($("#" + i).length > 0) {
                        return creatPopId();
                    } else {
                        return i;
                    }
                }
            };

        };
        if (!!debug) {
            window.domooc = domooc;
        }
    }
    init(window, $, usersetting, GM_getValue, GM_setValue, GM_xmlhttpRequest, nopanel);
})();