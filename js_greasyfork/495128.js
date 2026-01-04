// ==UserScript==
// @name          杨凯团队专用版
// @namespace    unrival
// @version      3.1 
// @description  ▶▶▶
// @author       unrival
// @run-at       document-end
// @storageName  unrivalxxt
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @match        *://*.ac.cn/*
// @icon         http://pan-yz.chaoxing.com/favicon.ico
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_info
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1.chaoxing.com
// @connect      mooc1-2.chaoxing.com
// @connect      passport2-api.chaoxing.com
// @connect      14.29.190.187
// @connect      cx.icodef.com
// @license      GPL-3.0-or-later
// @original-script https://scriptcat.org/script-show-page/878/
// @original-author unrival
// @original-license GPL-3.0-or-later
//如果脚本提示添加安全网址，请将脚本提示内容填写到下方区域，一行一个，如果不会，请加群询问



//安全网址请填写在上方空白区域
// @downloadURL https://update.greasyfork.org/scripts/495128/%E6%9D%A8%E5%87%AF%E5%9B%A2%E9%98%9F%E4%B8%93%E7%94%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/495128/%E6%9D%A8%E5%87%AF%E5%9B%A2%E9%98%9F%E4%B8%93%E7%94%A8%E7%89%88.meta.js
// ==/UserScript==
(() => {
  //  var token = 'dampmQGPizKmgwAI', 
   var token = GM_getValue('tikutoken'),
        jumpType = 1, //
        disableMonitor = 1, // 
        accuracy = 0, //
        randomDo = 1, //
        backGround = 0, //
        //-----------------------------------------------------------------------------------------------------
        autoLogin = 0, //
        phoneNumber = '', //
        password = ''; //
    //-----------------------------------------------------------------------------------------------------
    var host = 'http://14.29.190.187:54223/',
        rate = GM_getValue('unrivalrate', '1'),
        ctUrl = 'https://cx.icodef.com/wyn-nb?v=4',
        getQueryVariable = (variable) => {
            let q = _l.search.substring(1),
                v = q.split("&"),
                r = false;
            for (let i = 0, l = v.length; i < l; i++) {
                let p = v[i].split("=");
                p[0] == variable && (r = p[1]);
            }
            return r;
        },
        getCookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift(),
        isCat = GM_info.scriptHandler == 'ScriptCat',
        _w = unsafeWindow,
        _d = _w.document,
        _l = _w.location,
        _p = _l.protocol,
        _h = _l.host,
        //isEdge = _w.navigator.userAgent.includes("Edg/"),
        isFf = _w.navigator.userAgent.includes("Firefox"),
        isMobile = _w.navigator.userAgent.includes("Android"),
        stop = false,
        handleImgs = (s) => {
            imgEs = s.match(/(<img([^>]*)>)/);
            if (imgEs) {
                for (let j = 0, k = imgEs.length; j < k; j++) {
                    let urls = imgEs[j].match(
                        /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/),
                        url;
                    if (urls) {
                        url = urls[0].replace(/http[s]?:\/\//, '');
                        s = s.replaceAll(imgEs[j], url);
                    }
                }
            }
            return s;
        },
        trim = (s) => {
            return handleImgs(s).replaceAll('javascript:void(0);', '').replaceAll("&nbsp;", '').replaceAll("，", ',').replaceAll(
                "。", '.').replaceAll("：", ':').replaceAll("；",
                    ';').replaceAll("？", '?').replaceAll("（", '(').replaceAll("）", ')').replaceAll("“", '"')
                .replaceAll("”", '"').replaceAll("！", '!').replaceAll("-", ' ').replace(/(<([^>]+)>)/ig, '')
                .replace(/^\s+/ig, '').replace(/\s+$/ig, '');
        },
        cVersion = 999,
        classId = getQueryVariable('clazzid') || getQueryVariable('clazzId') || getQueryVariable('classid') ||
            getQueryVariable('classId'),
        courseId = getQueryVariable('courseid') || getQueryVariable('courseId'),
        UID = getCookie('_uid') || getCookie('UID'),
        FID = getCookie('fid'),
        jq = _w.top.$ || _w.top.jQuery;
    _w.confirm = (msg) => {
        return true;
    }
    setInterval(function () {
        _w.confirm = (msg) => {
            return true;
        }
    }, 2000);
    if (parseFloat(rate) == parseInt(rate)) {
        rate = parseInt(rate);
    } else {
        rate = parseFloat(rate);
    }
    try {
        _w.top.unrivalReviewMode = GM_getValue('unrivalreview', '0') || '0';
        _w.top.unrivalDoWork = GM_getValue('unrivaldowork', '1') || '1';
        _w.top.unrivalAutoSubmit = GM_getValue('unrivalautosubmit', '1') || '1';
        _w.top.unrivalAutoSave = GM_getValue('unrivalautosave', '0') || '0';
    } catch (e) { }
    if (_l.href.indexOf("knowledge/cards") > 0) {
        let allowBackground = false,
            spans = _d.getElementsByTagName('span');
        for (let i = 0, l = spans.length; i < l; i++) {
            if (spans[i].innerHTML.indexOf('章节未开放') != -1) {
                if (_l.href.indexOf("ut=s") != -1) {
                    _l.href = _l.href.replace("ut=s", "ut=t").replace(/&cpi=[0-9]{1,10}/, '');
                } else if (_l.href.indexOf("ut=t") != -1) {
                    spans[i].innerHTML = '此课程为闯关模式，请回到上一章节完成学习任务！'
                    return;
                }
                break;
            }
        }
        _w.top.unrivalPageRd = String(Math.random());
        if (!isFf) {
            try {
                cVersion = parseInt(navigator.userAgent.match(/Chrome\/[0-9]{2,3}./)[0].replace('Chrome/', '')
                    .replace('.', ''));
            } catch (e) { }
        }
        var busyThread = 0,
            getStr = (str, start, end) => {
                let res = str.substring(str.indexOf(start), str.indexOf(end)).replace(start, '');
                return res;
            },
            scripts = _d.getElementsByTagName('script'),
            param = null;
        for (let i = 0, l = scripts.length; i < l; i++) {
            if (scripts[i].innerHTML.indexOf('mArg = "";') != -1 && scripts[i].innerHTML.indexOf(
                '==UserScript==') == -1) {
                param = getStr(scripts[i].innerHTML, 'try{\n    mArg = ', ';\n}catch(e){');
            }
        }
        if (param == null) {
            return;
        }
        try {
            vrefer = _d.getElementsByClassName('ans-attach-online ans-insertvideo-online')[0].src;
        } catch (e) {
            vrefer = _p + '//' + _h + '/ananas/modules/video/index.html?v=2022-1118-1729';
        }
        GM_setValue('vrefer', vrefer);
        GM_setValue('host', _h);
        var base222 = `data:image/png;base64,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`

        _d.getElementsByTagName("html")[0].innerHTML = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>杨凯团队</title>
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
        <link href="https://z.chaoxing.com/yanshi/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="row" style="margin: 10px;">
            <div class="col-md-6 col-md-offset-3">
                <div class="header clearfix">
                    <h3 class="text-muted" style="margin-top: 20px;margin-bottom: 0;float: left;"><a href="https://scriptcat.org/script-show-page/336" target="view_window">工业学院专用v1.0&ensp;</a></h3><div id="onlineNum"></div>
                </div>
                <hr style="margin-top: 10px;margin-bottom: 20px;">
                <div class="panel panel-info" id="normalQuery">
                    <div class="panel-heading">任务配置</div>
                    <div class="panel-body">
                        <div>
                        
                            



                            <div style="padding: 0;font-size: 20px;float: left;">勿动：</div>

                            <div>
                                <input type="number" id="unrivalRate" style="width: 80px;">
                                &ensp;
                                <a id='updateRateButton' class="btn btn-default">保存</a>
                                &nbsp;|&nbsp;
                                <a id='reviewModeButton' class="btn btn-default">勿动</a>
                                &nbsp;|&nbsp;
                                <a id='videoTimeButton' class="btn btn-default">勿动</a>
                                &nbsp;|&nbsp;
                                <a id='fuckMeModeButton' class="btn btn-default" href="https://scriptcat.org/script-show-page/379" target="view_window">后台挂机</a>
                                &nbsp;
                                <a id='backGround' class="btn btn-default" target="view_window">激活</a>
                            </div>

                            <br>
                            <div style="padding: 0;font-size: 20px;float: left;">章节测试：</div>
                            
                            <a id='autoDoWorkButton' class="btn btn-default">自动答题</a>&nbsp;|&nbsp;
                            <a id='autoSubmitButton' class="btn btn-default">自动提交</a>&nbsp;|&nbsp;
                            <a id='autoSaveButton' class="btn btn-default">自动保存</a>

                            <div  style=" margin-top: 10px;">
                                 <div style="padding: 0;font-size: 20px;float: left;">机器码：</div>
                                <input type="text" id="token" style="width: 150px;" value="`+GM_getValue("tikutoken")+`">
                                 <a id='updateToken' class="btn btn-default" >保存</a>
                                 
                                 <br/>
                                 (机器码，乱填无效的)

                                 <p>我是杨凯，专门做学历的老师。微信：707507622 专业专注，找我要机器码<p/>
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-info" id='videoTime' style="display: none;height: 300px;">
                    <div class="panel-heading">学习进度</div>
                    <div class="panel-body" style="height: 100%;">
                        <iframe id="videoTimeContent" src="" frameborder="0" scrolling="auto"
                            style="width: 100%;height: 85%;"></iframe>
                    </div>
                </div>
                <div class="panel panel-info">
                    <div class="panel-heading">任务列表</div>
                    <div class="panel-body" id='joblist'>
                    </div>
                </div>
                <div class="panel panel-info">
                    <div class="panel-heading">运行日志</div>
                    <div class="panel-body">
                        <div id="result" style="overflow:auto;line-height: 30px;">
                            <div id="log">
                                <span style="color: red">[00:00:00]如果此提示不消失，说明页面出现了错误，请联系杨凯</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-info" id='workPanel' style="display: none;height: 1000px;">
                    <div class="panel-heading">章节测试</div>
                    <div class="panel-body" id='workWindow' style="height: 100%;">
                        <iframe id="frame_content" name="frame_content" src="" frameborder="0" scrolling="auto"
                            style="width: 100%;height: 95%;"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
`;
        var logs = {
            "logArry": [],
            "addLog": function (str, color = "black") {
                if (this.logArry.length >= 50) {
                    this.logArry.splice(0, 1);
                }
                var nowTime = new Date();
                var nowHour = (Array(2).join(0) + nowTime.getHours()).slice(-2);
                var nowMin = (Array(2).join(0) + nowTime.getMinutes()).slice(-2);
                var nowSec = (Array(2).join(0) + nowTime.getSeconds()).slice(-2);
                this.logArry.push("<span style='color: " + color + "'>[" + nowHour + ":" + nowMin + ":" +
                    nowSec + "] " + str + "</span>");
                let logStr = "";
                for (let logI = 0, logLen = this.logArry.length; logI < logLen; logI++) {
                    logStr += this.logArry[logI] + "<br>";
                }
                _d.getElementById('log').innerHTML = logStr;
                var logElement = _d.getElementById('log');
                logElement.scrollTop = logElement.scrollHeight;
            }
        },
            htmlHook = setInterval(function () {
                if (_d.getElementById('unrivalRate') && _d.getElementById('updateRateButton') && _d
                    .getElementById('reviewModeButton') && _d.getElementById('autoDoWorkButton') && _d
                        .getElementById('autoSubmitButton') && _d.getElementById('autoSaveButton')) {
                    if (!backGround) {
                        _d.getElementById('fuckMeModeButton').style.display = "none";
                    }
                    allowBackground = Math.round(new Date() / 1000) - parseInt(GM_getValue(
                        'unrivalBackgroundVideoEnable',
                        '6')) < 15;
                    if (allowBackground) {
                        _d.getElementById('fuckMeModeButton').setAttribute('href', 'unrivalxxtbackground/');
                    }
                    clearInterval(htmlHook);
                    if (cVersion < 86) {
                        logs.addLog(
                            '\u60a8\u7684\u6d4f\u89c8\u5668\u5185\u6838\u8fc7\u8001\uff0c\u8bf7\u66f4\u65b0\u7248\u672c\u6216\u4f7f\u7528\u4e3b\u6d41\u6d4f\u89c8\u5668\uff0c\u63a8\u8350\u003c\u0061\u0020\u0068\u0072\u0065\u0066\u003d\u0022\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0077\u0077\u0077\u002e\u006d\u0069\u0063\u0072\u006f\u0073\u006f\u0066\u0074\u002e\u0063\u006f\u006d\u002f\u007a\u0068\u002d\u0063\u006e\u002f\u0065\u0064\u0067\u0065\u0022\u0020\u0074\u0061\u0072\u0067\u0065\u0074\u003d\u0022\u0076\u0069\u0065\u0077\u005f\u0077\u0069\u006e\u0064\u006f\u0077\u0022\u003e\u0065\u0064\u0067\u0065\u6d4f\u89c8\u5668\u003c\u002f\u0061\u003e',
                            'red');
                        stop = true;
                        return;
                    }
                    if (isMobile) {
                        logs.addLog('手机浏览器不保证能正常运行此脚本', 'orange');
                    }
                    _d.addEventListener('visibilitychange', function () {
                        let isH = _d.hidden;
                        if (!isH) {
                            logs.addLog('挂机功能不稳定，不建议长时间最小化窗口', 'orange');
                        }
                    });
                    _d.getElementById('unrivalRate').value = rate;
                     _d.getElementById('updateToken').onclick = function () {
                         var token = _d.getElementById('token').value;
                           logs.addLog('您的机器码为' +token, 'green');
                         GM_setValue('tikutoken', token);
                    }
                    _d.getElementById('updateRateButton').onclick = function () {
                        let urate = _d.getElementById('unrivalRate').value;
                        if (parseFloat(urate) == parseInt(urate)) {
                            urate = parseInt(urate);
                        } else {
                            urate = parseFloat(urate);
                        }
                        GM_setValue('unrivalrate', urate);
                        rate = urate;
                        if (urate > 0) {
                            logs.addLog('让你勿动，非要动' + urate + '，将在3秒内生效', 'green');
                        } else {
                            logs.addLog('奇怪的倍速，将会自动跳过视频任务', 'orange');
                        }
                    }
                    _d.getElementById('backGround').onclick = function () {
                        logs.addLog('激活成功，课程正常', 'green');
                        _w.top.backNow = 1;
                    }
                    _d.getElementById('reviewModeButton').onclick = function () {
                        let reviewButton = _d.getElementById('reviewModeButton');
                        if (reviewButton.getAttribute('class') == 'btn btn-default') {
                            _d.getElementById('reviewModeButton').setAttribute('class', 'btn btn-success');
                            logs.addLog('复习模式已开启，遇到已完成的视频任务不会跳过', 'green');
                            GM_setValue('unrivalreview', '1');
                            _w.top.unrivalReviewMode = '1';
                        } else {
                            _d.getElementById('reviewModeButton').setAttribute('class', 'btn btn-default');
                            logs.addLog('复习模式已关闭，遇到已完成的视频任务会自动跳过', 'green');
                            GM_setValue('unrivalreview', '0');
                            _w.top.unrivalReviewMode = '0';
                        }
                    }
                    _d.getElementById('autoDoWorkButton').onclick = function () {
                        let autoDoWorkButton = _d.getElementById('autoDoWorkButton');
                        if (autoDoWorkButton.getAttribute('class') == 'btn btn-default') {
                            _d.getElementById('autoDoWorkButton').setAttribute('class', 'btn btn-success');
                            //logs.addLog('自动做章节测试已开启，将会自动做章节测试', 'green');//
                            GM_setValue('unrivaldowork', '1');
                            _w.top.unrivalDoWork = '1';
                        } else {
                            _d.getElementById('autoDoWorkButton').setAttribute('class', 'btn btn-default');
                            //logs.addLog('自动做章节测试已关闭，将不会自动做章节测试', 'green');//
                            GM_setValue('unrivaldowork', '0');
                            _w.top.unrivalDoWork = '0';
                        }
                    }
                    _d.getElementById('autoSubmitButton').onclick = function () {
                        let autoSubmitButton = _d.getElementById('autoSubmitButton');
                        if (autoSubmitButton.getAttribute('class') == 'btn btn-default') {
                            _d.getElementById('autoSubmitButton').setAttribute('class', 'btn btn-success');
                            //logs.addLog('符合提交标准的章节测试将会自动提交', 'green');//
                            GM_setValue('unrivalautosubmit', '1');
                            _w.top.unrivalAutoSubmit = '1';
                        } else {
                            _d.getElementById('autoSubmitButton').setAttribute('class', 'btn btn-default');
                            //logs.addLog('章节测试将不会自动提交', 'green');//
                            GM_setValue('unrivalautosubmit', '0');
                            _w.top.unrivalAutoSubmit = '0';
                        }
                    }
                    _d.getElementById('autoSaveButton').onclick = function () {
                        let autoSaveButton = _d.getElementById('autoSaveButton');
                        if (autoSaveButton.getAttribute('class') == 'btn btn-default') {
                            _d.getElementById('autoSaveButton').setAttribute('class', 'btn btn-success');
                            /logs.addLog('不符合提交标准的章节测试将会自动保存', 'green');/
                            GM_setValue('unrivalautosave', '1');
                            _w.top.unrivalAutoSave = '1';
                        } else {
                            _d.getElementById('autoSaveButton').setAttribute('class', 'btn btn-default');
                            /logs.addLog('不符合提交标准的章节测试将不会自动保存，等待用户自己操作', 'green');/
                            GM_setValue('unrivalautosave', '0');
                            _w.top.unrivalAutoSave = '0';
                        }
                    }
                    _d.getElementById('videoTimeButton').onclick = function () {
                        _d.getElementById('videoTime').style.display = 'block';
                        _d.getElementById('videoTimeContent').src = _p +
                            '//stat2-ans.chaoxing.com/task/s/index?courseid=' + courseId + '&clazzid=' +
                            classId;
                    }
                }
            }, 100),
            loopjob = () => {
                if (_w.top.unrivalScriptList.length > 1) {
                    /logs.addLog('您同时开启了多个刷课脚本，会挂科，会挂科，会挂科，会挂科，会挂科，会挂科，会挂科，会挂科', 'red');/
                }
                if (cVersion < 8.6 * 10) {
                    logs.addLog(
                        '\u60a8\u7684\u6d4f\u89c8\u5668\u5185\u6838\u8fc7\u8001\uff0c\u8bf7\u66f4\u65b0\u7248\u672c\u6216\u4f7f\u7528\u4e3b\u6d41\u6d4f\u89c8\u5668\uff0c\u63a8\u8350\u003c\u0061\u0020\u0068\u0072\u0065\u0066\u003d\u0022\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0077\u0077\u0077\u002e\u006d\u0069\u0063\u0072\u006f\u0073\u006f\u0066\u0074\u002e\u0063\u006f\u006d\u002f\u007a\u0068\u002d\u0063\u006e\u002f\u0065\u0064\u0067\u0065\u0022\u0020\u0074\u0061\u0072\u0067\u0065\u0074\u003d\u0022\u0076\u0069\u0065\u0077\u005f\u0077\u0069\u006e\u0064\u006f\u0077\u0022\u003e\u0065\u0064\u0067\u0065\u6d4f\u89c8\u5668\u003c\u002f\u0061\u003e',
                        'red');
                    stop = true;
                    return;
                }
                if (stop) {
                    return;
                }
                let missionli = missionList;
                if (missionli == []) {
                    setTimeout(loopjob, 500);
                    return;
                }
                for (let itemName in missionli) {
                    if (missionli[itemName]['running']) {
                        setTimeout(loopjob, 500);
                        return;
                    }
                }
                for (let itemName in missionli) {
                    if (!missionli[itemName]['done']) {
                        switch (missionli[itemName]['type']) {
                            case 'video':
                                doVideo(missionli[itemName]);
                                break;
                            case 'document':
                                doDocument(missionli[itemName]);
                                break;
                            case 'work':
                                doWork(missionli[itemName]);
                                break;
                        }
                        setTimeout(loopjob, 500);
                        return;
                    }
                }
                if (busyThread <= 0) {
                    if (jumpType != 2) {
                        _w.top.jump = true;
                        logs.addLog('所有任务处理完毕，5秒后自动下一章', 'green');
                    } else {
                        logs.addLog('所有任务处理完毕，用户设置为不跳转，脚本已结束运行，如需自动跳转，请编辑脚本代码参数', 'green');
                    }
                    clearInterval(loopjob);
                } else {
                    setTimeout(loopjob, 500);
                }
            },
            readyCheck = () => {
                setTimeout(function () {
                    try {
                        if (!isCat) {
                            logs.addLog(
                                '请注意，已经开始看课程',
                                'orange');
                        }
                        if (_w.top.unrivalReviewMode == '1') {
                            /logs.addLog('复习模式已开启，遇到已完成的视频任务不会跳过', 'green');/
                            _d.getElementById('reviewModeButton').setAttribute('class', ['btn btn-default',
                                'btn btn-success'
                            ][_w.top.unrivalReviewMode]);
                        }
                        if (_w.top.unrivalDoWork == '1') {
                            /logs.addLog('自动做章节测试已开启，将会自动做章节测试', 'green');/
                            _d.getElementById('autoDoWorkButton').setAttribute('class', ['btn btn-default',
                                'btn btn-success'
                            ][_w.top.unrivalDoWork]);
                        }
                        _d.getElementById('autoSubmitButton').setAttribute('class', ['btn btn-default',
                            'btn btn-success'
                        ][_w.top.unrivalAutoSubmit]);
                        _d.getElementById('autoSaveButton').setAttribute('class', ['btn btn-default',
                            'btn btn-success'
                        ][_w.top.unrivalAutoSave]);
                    } catch (e) {
                        console.log(e);
                        readyCheck();
                        return;
                    }
                }, 500);
            }
        readyCheck();
        try {
            var pageData = JSON.parse(param);
        } catch (e) {
            if (jumpType != 2) {
                _w.top.jump = true;
                logs.addLog('此页无任务，5秒后自动下一章', 'green');
            } else {
                logs.addLog('此页无任务，用户设置为不跳转，脚本已结束运行，如需自动跳转，请编辑脚本代码参数', 'green');
            }
            return;
        }
        var data = pageData['defaults'],
            jobList = [],
            classId = data['clazzId'],
            chapterId = data['knowledgeid'],
            reportUrl = data['reportUrl'],
            ktoken = data['ktoken'];
        UID = UID || data['userid'];
        FID = FID || data['fid'];
        for (let i = 0, l = pageData['attachments'].length; i < l; i++) {
            let item = pageData['attachments'][i];
            if (item['job'] != true || item['isPassed'] == true) {
                if (_w.top.unrivalReviewMode == '1' && item['type'] == 'video') {
                    jobList.push(item);
                }
                continue;
            } else {
                jobList.push(item);
            }
        }
        var video_getReady = (item) => {
            let statusUrl = _p + '//' + _h + '/ananas/status/' + item['property']['objectid'] + '?k=' +
                FID + '&flag=normal&_dc=' + String(Math.round(new Date())),
                doubleSpeed = item['property']['doublespeed'];
            busyThread += 1;
            GM_xmlhttpRequest({
                method: "get",
                headers: {
                    'Host': _h,
                    'Referer': vrefer,
                    'Sec-Fetch-Site': 'same-origin'
                },
                url: statusUrl,
                onload: function (res) {
                    try {
                        busyThread -= 1;
                        let videoInfo = JSON.parse(res.responseText),
                            duration = videoInfo['duration'],
                            dtoken = videoInfo['dtoken'];
                        if (duration == undefined) {
                            _d.getElementById('joblist').innerHTML += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    ` + '[无效视频]' + item['property']['name'] + `
                                </div>
                            </div>`
                            return;
                        }
                        missionList['m' + item['jobid']] = {
                            'module': item['property']['module'],
                            'type': 'video',
                            'dtoken': dtoken,
                            'duration': duration,
                            'objectId': item['property']['objectid'],
                            'rt': item['property']['rt'] || '0.9',
                            'otherInfo': item['otherInfo'],
                            'doublespeed': doubleSpeed,
                            'jobid': item['jobid'],
                            'name': item['property']['name'],
                            'done': false,
                            'running': false
                        };
                        _d.getElementById('joblist').innerHTML += `
                            
                            <div class="panel panel-default">
                            
                                <div class="panel-body">
                                    ` + '[视频]' + item['property']['name'] + `
                                </div>
                            </div>`
                    } catch (e) { }
                },
                onerror: function (err) {
                    console.log(err);
                    if (err.error.indexOf('@connect list') >= 0) {
                        logs.addLog('请添加安全网址，将 【 //@connect      ' + _h +
                            ' 】方括号里的内容(不包括方括号)添加到脚本代码内指定位置，否则脚本无法正常运行，如图所示：', 'red');
                        logs.addLog(
                            '<img src="https://pan-yz.chaoxing.com/thumbnail/0,0,0/609a8b79cbd6a91d10c207cf2b5f368d">'
                        );
                        stop = true;
                    } else {
                        logs.addLog('获取任务详情失败', 'red');
                        logs.addLog('错误原因：' + err.error, 'red');
                    }
                }
            });
        },
            doVideo = (item) => {
                if (rate <= 0) {
                    missionList['m' + item['jobid']]['running'] = true;
                    logs.addLog('奇怪的倍速，视频已自动跳过', 'orange');
                    setTimeout(function () {
                        missionList['m' + item['jobid']]['running'] = false;
                        missionList['m' + item['jobid']]['done'] = true;
                    }, 5000);
                    return;
                }
                if (allowBackground && backGround) {
                    if (_w.top.document.getElementsByClassName('catalog_points_sa').length > 0 || _w.top.document
                        .getElementsByClassName('lock').length > 0) {
                        //logs.addLog('您已安装超星挂机小助手，但此课程可能为闯关模式，不支持后台挂机，将为您在线完成', 'blue');//
                    } else {
                        item['userid'] = UID;
                        item['classId'] = classId;
                        item['review'] = [false, true][_w.top.unrivalReviewMode];
                        item['reportUrl'] = reportUrl;
                        item['rt'] = missionList['m' + item['jobid']]['rt'];
                        GM_setValue('unrivalBackgroundVideo', item);
                        _d.cookie = "videojs_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        logs.addLog(
                            '您已安装超星挂机小助手，已添加至后台任务，<a href="unrivalxxtbackground/" target="view_window">点我查看后台</a>',
                            'green');
                        missionList['m' + item['jobid']]['running'] = true;
                        setTimeout(function () {
                            missionList['m' + item['jobid']]['running'] = false;
                            missionList['m' + item['jobid']]['done'] = true;
                        }, 5000);
                        return;
                    }
                }
                let videojs_id = String(parseInt(Math.random() * 9999999));
                _d.cookie = 'videojs_id=' + videojs_id + ';path=/'
                //logs.addLog('开始刷视频：'+ item['name'] + '，倍速：' + String(rate) + '倍');//
                logs.addLog('视频观看信息每60秒上报一次，请耐心等待', 'green');
                //logs.addLog('如遇脚本使用异常情况，请检查脚本版本是否为最新版，<a href="https://scriptcat.org/script-show-page/878" target="view_window">点我(脚本猫)</a>或<a href="https://greasyfork.org/zh-CN/scripts/462748" target="view_window">点我(greasyfork)</a>检查', 'orange');/
                if (disableMonitor) {
                    //logs.addLog('解除多端学习监控有清除进度风险，请谨慎使用', 'orange');//
                }
                let dtype = 'Video';
                if (item['module'].includes('audio')) {
                    dtype = 'Audio';
                    rt = '';
                }
                let playTime = 0,
                    playsTime = 0,
                    isdrag = '3',
                    times = 0,
                    encUrl = '',
                    first = true,
                    loop = setInterval(function () {
                        if (rate <= 0) {
                            clearInterval(loop);
                            logs.addLog('奇怪的倍速，视频已自动跳过', 'orange');
                            setTimeout(function () {
                                missionList['m' + item['jobid']]['running'] = false;
                                missionList['m' + item['jobid']]['done'] = true;
                            }, 5000);
                            return;
                        } else if (item['doublespeed'] == 0 && rate > 2 && _w.top.unrivalReviewMode == '0') {
                            //rate = 1;
                            //logs.addLog('该视频不允许倍速播放，已恢复至一倍速，高倍速会被清空进度挂科，勿存侥幸', 'red');
                        }
                        rt = missionList['m' + item['jobid']]['rt'];
                        playsTime += rate;
                        playTime = Math.ceil(playsTime);
                        if (times == 0 || times % 30 == 0 || playTime >= item['duration']) {
                            if (first) {
                                playTime = 0;
                            }
                            if (playTime >= item['duration']) {
                                clearInterval(loop);
                                playTime = item['duration'];
                                isdrag = '4';
                            } else if (playTime > 0) {
                                isdrag = '0';
                            }
                            encUrl = host + 'chaoXing/v3/getEnc.php?classid=' + classId +
                                '&playtime=' + playTime + '&duration=' + item['duration'] + '&objectid=' + item[
                                'objectId'] + '&jobid=' + item['jobid'] + '&uid=' + UID;
                            busyThread += 1;
                            var _bold_playTime = playTime;
                            function ecOnload(res) {
                                let enc = '';
                                if (res && res.status == 200) {
                                    enc = res.responseText;
                                    if (enc.includes('--#')) {
                                        let warnInfo = enc.match(new RegExp('--#(.*?)--#', "ig"))[0]
                                            .replace(/--#/ig, '');
                                        logs.addLog(warnInfo, 'red');
                                        enc = enc.replace(/--#(.*?)--#/ig, '');
                                    }
                                    if (enc.indexOf('.stop') >= 0) {
                                        clearInterval(loop);
                                        stop = true;
                                        return;
                                    }
                                } else {
                                    strEc = `[${classId}][${UID}][${item['jobid']}][${item['objectId']}][${playTime * 1000}][d_yHJ!$pdA~5][${item['duration'] * 1000}][0_${item['duration']}]`,
                                        enc = jq.md5(strEc);
                                }
                                if (enc.length != 32) {
                                    clearInterval(loop);
                                    stop = true;
                                    return;
                                }
                                let reportsUrl = reportUrl + '/' + item['dtoken'] +
                                    '?clazzId=' + classId + '&playingTime=' + playTime +
                                    '&duration=' + item['duration'] + '&clipTime=0_' + item[
                                    'duration'] + '&objectId=' + item['objectId'] +
                                    '&otherInfo=' + item['otherInfo'] + '&jobid=' + item[
                                    'jobid'] + '&userid=' + UID + '&isdrag=' + isdrag +
                                    '&view=pc&enc=' + enc + '&rt=' + rt + '&dtype=' + dtype +
                                    '&_t=' + String(Math.round(new Date()));
                                GM_xmlhttpRequest({
                                    method: "get",
                                    headers: {
                                        'Host': _h,
                                        'Referer': vrefer,
                                        'Sec-Fetch-Site': 'same-origin',
                                        'Content-Type': 'application/json'
                                    },
                                    url: reportsUrl,
                                    onload: function (res) {
                                        try {
                                            let today = new Date(),
                                                todayStr = today.getFullYear() +
                                                    'd' + today.getMonth() + 'd' + today
                                                        .getDate(),
                                                timelong = GM_getValue(
                                                    'unrivaltimelong', {});
                                            if (timelong[UID] == undefined ||
                                                timelong[UID]['today'] != todayStr
                                            ) {
                                                timelong[UID] = {
                                                    'time': 0,
                                                    'today': todayStr
                                                };
                                            } else {
                                                timelong[UID]['time']++;
                                            }
                                            GM_setValue('unrivaltimelong',
                                                timelong);
                                            busyThread -= 1;
                                            if (timelong[UID]['time'] / 60 > 52 &&
                                                item['doublespeed'] == 0 && _w.top
                                                    .unrivalReviewMode == '0') {
                                                clearInterval(loop);
                                                logs.addLog(
                                                    '今日学习时间过长，继续学习会导致清空进度，请明天再来',
                                                    'red');
                                                setTimeout(function () {
                                                    missionList['m' + item[
                                                        'jobid']][
                                                        'running'
                                                    ] = false;
                                                    missionList['m' + item[
                                                        'jobid']][
                                                        'done'
                                                    ] = true;
                                                }, 5000);
                                                return;
                                            }
                                            let ispass = JSON.parse(res
                                                .responseText);
                                            first = false;
                                            if (ispass['isPassed'] && _w.top
                                                .unrivalReviewMode == '0') {
                                                logs.addLog('视频任务已完成', 'green');
                                                missionList['m' + item['jobid']]['running'] = false;
                                                missionList['m' + item['jobid']]['done'] = true;
                                                clearInterval(loop);
                                                return;
                                            } else if (isdrag == '4') {
                                                if (_w.top.unrivalReviewMode ==
                                                    '1') {
                                                    logs.addLog('视频已观看完毕', 'green');
                                                } else {
                                                    logs.addLog('视频已观看完毕，但视频任务未完成',
                                                        'red');
                                                }
                                                missionList['m' + item['jobid']][
                                                    'running'
                                                ] = false;
                                                missionList['m' + item['jobid']][
                                                    'done'
                                                ] = true;
                                                try {
                                                    clearInterval(loop);
                                                } catch (e) {

                                                }
                                            } else {
                                                logs.addLog(item['name'] + '已观看' +
                                                    _bold_playTime + '秒，剩余大约' +
                                                    String(item['duration'] -
                                                        _bold_playTime) + '秒');
                                            }
                                        } catch (e) {
                                            console.log(e);
                                            if (res.responseText.indexOf('验证码') >=
                                                0) {
                                                logs.addLog('已被超星风控，请<a href="' +
                                                    reportsUrl +
                                                    '" target="_blank">点我处理</a>，60秒后自动刷新页面',
                                                    'red');
                                                missionList['m' + item['jobid']][
                                                    'running'
                                                ] = false;
                                                clearInterval(loop);
                                                stop = true;
                                                setTimeout(function () {
                                                    _l.reload();
                                                }, 60000);
                                                return;
                                            }
                                            logs.addLog('超星返回错误信息，十秒后重试', 'red');
                                            times = -10;
                                            return;
                                        }
                                    },
                                    onerror: function (err) {
                                        console.log(err);
                                        if (err.error.indexOf('@connect list') >=
                                            0) {
                                            logs.addLog(
                                                '请添加安全网址，将 【 //@connect      ' +
                                                _h +
                                                ' 】方括号里的内容(不包括方括号)添加到脚本代码内指定位置，否则脚本无法正常运行，如图所示：',
                                                'red');
                                            logs.addLog(
                                                '<img src="https://pan-yz.chaoxing.com/thumbnail/0,0,0/609a8b79cbd6a91d10c207cf2b5f368d">'
                                            );
                                            stop = true;
                                        } else {
                                            logs.addLog('观看视频失败', 'red');
                                            logs.addLog('错误原因：' + err.error, 'red');
                                        }
                                        missionList['m' + item['jobid']][
                                            'running'
                                        ] = false;
                                        clearInterval(loop);
                                    }
                                });
                            };
                            GM_xmlhttpRequest({
                                method: "get",
                                url: encUrl,
                                timeout: 2000,
                                onload: ecOnload,
                                onerror: function (err) {
                                    console.log(err);
                                    ecOnload(false);
                                },
                                ontimeout: function (err) {
                                    console.log(err);
                                    ecOnload(false);
                                }
                            });
                        }
                        times += 1;
                    }, 1000);
                missionList['m' + item['jobid']]['running'] = true;
            },
            doDocument = (item) => {
                missionList['m' + item['jobid']]['running'] = true;
                logs.addLog('开始刷文档：' + item['name']);
                setTimeout(function () {
                    busyThread += 1;
                    GM_xmlhttpRequest({
                        method: "get",
                        url: _p + '//' + _h + '/ananas/job/document?jobid=' + item['jobid'] +
                            '&knowledgeid=' + chapterId + '&courseid=' + courseId + '&clazzid=' +
                            classId + '&jtoken=' + item['jtoken'],
                        onload: function (res) {
                            try {
                                busyThread -= 1;
                                let ispass = JSON.parse(res.responseText);
                                if (ispass['status']) {
                                    logs.addLog('文档任务已完成', 'green');
                                } else {
                                    logs.addLog('文档已阅读完成，但任务点未完成', 'red');
                                }

                            } catch (err) {
                                console.log(err);
                                console.log(res.responseText);
                                logs.addLog('解析文档内容失败', 'red');
                            }
                            missionList['m' + item['jobid']]['running'] = false;
                            missionList['m' + item['jobid']]['done'] = true;
                        },
                        onerror: function (err) {
                            console.log(err);
                            if (err.error.indexOf('@connect list') >= 0) {
                                logs.addLog('请添加安全网址，将 【 //@connect      ' + _h +
                                    ' 】方括号里的内容(不包括方括号)添加到脚本代码内指定位置，否则脚本无法正常运行，如图所示：', 'red');
                                logs.addLog(
                                    '<img src="https://pan-yz.chaoxing.com/thumbnail/0,0,0/609a8b79cbd6a91d10c207cf2b5f368d">'
                                );
                                stop = true;
                            } else {
                                logs.addLog('阅读文档失败', 'red');
                                logs.addLog('错误原因：' + err.error, 'red');
                            }
                            missionList['m' + item['jobid']]['running'] = false;
                            missionList['m' + item['jobid']]['done'] = true;
                        }
                    });
                }, parseInt(Math.random() * 2000 + 9000, 10))
            },
            doWork = (item) => {
                missionList['m' + item['jobid']]['running'] = true;
               // logs.addLog('开始刷章节测试：' + item['name']);//
                //logs.addLog('您设置的答题正确率为：' + String(accuracy) + '%，只有在高于此正确率时才会提交测试', 'blue');//
                _d.getElementById('workPanel').style.display = 'block';
                _d.getElementById('frame_content').src = _p + '//' + _h + '/work/phone/work?workId=' + item['jobid']
                    .replace('work-', '') + '&courseId=' + courseId + '&clazzId=' + classId + '&knowledgeId=' +
                    chapterId + '&jobId=' + item['jobid'] + '&enc=' + item['enc'];
                _w.top.unrivalWorkInfo = '';
                _w.top.unrivalDoneWorkId = '';
                setInterval(function () {
                    if (_w.top.unrivalWorkInfo != '') {
                        logs.addLog(_w.top.unrivalWorkInfo);
                        _w.top.unrivalWorkInfo = '';
                    }
                }, 100);
                let checkcross = setInterval(function () {
                    if (_w.top.unrivalWorkDone == false) {
                        clearInterval(checkcross);
                        return;
                    }
                    let ifW = _d.getElementById('frame_content').contentWindow;
                    try {
                        ifW.location.href;
                    } catch (e) {
                        console.log(e);
                        if (e.message.indexOf('cross-origin') != -1) {
                            clearInterval(checkcross);
                            _w.top.unrivalWorkDone = true;
                            return;
                        }
                    }
                }, 2000);
                let workDoneInterval = setInterval(function () {
                    if (_w.top.unrivalWorkDone) {
                        _w.top.unrivalWorkDone = false;
                        clearInterval(workDoneInterval);
                        _w.top.unrivalDoneWorkId = '';
                        _d.getElementById('workPanel').style.display = 'none';
                        _d.getElementById('frame_content').src = '';
                        setTimeout(function () {
                            missionList['m' + item['jobid']]['running'] = false;
                            missionList['m' + item['jobid']]['done'] = true;
                        }, 5000);
                    }
                }, 500);
            },
            missionList = [];
        if (jobList.length <= 0) {
            if (jumpType != 2) {
                _w.top.jump = true;
                logs.addLog('此页无任务，5秒后自动下一章', 'green');
            } else {
                logs.addLog('此页无任务，用户设置为不跳转，脚本已结束运行，如需自动跳转，请编辑脚本代码参数', 'green');
            }
            return;
        }
        for (let i = 0, l = jobList.length; i < l; i++) {
            let item = jobList[i];
            if (item['type'] == 'video') {
                video_getReady(item);
            } else if (item['type'] == 'document') {
                missionList['m' + item['jobid']] = {
                    'type': 'document',
                    'jtoken': item['jtoken'],
                    'jobid': item['jobid'],
                    'name': item['property']['name'],
                    'done': false,
                    'running': false
                };
                _d.getElementById('joblist').innerHTML += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    ` + '[文档]' + item['property']['name'] + `
                                </div>
                            </div>`
            } else if (item['type'] == 'workid' && _w.top.unrivalDoWork == '1') {
                missionList['m' + item['jobid']] = {
                    'type': 'work',
                    'workid': item['property']['workid'],
                    'jobid': item['jobid'],
                    'name': item['property']['title'],
                    'enc': item['enc'],
                    'done': false,
                    'running': false
                };
                _d.getElementById('joblist').innerHTML += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    ` + '[章节测试]' + item['property']['title'] + `
                                </div>
                            </div>`
            } else {
                try {
                    let jobName = item['property']['name'];
                    if (jobName == undefined) {
                        jobName = item['property']['title'];
                    }
                    _d.getElementById('joblist').innerHTML += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    ` + '已跳过：' + jobName + `
                                </div>
                            </div>`
                } catch (e) { }
            }
        }
        loopjob();
    } else if (_l.href.includes("mycourse/studentstudy")) {
        var audiofile =
            'data:audio/ogg;base64,T2dnUwACAAAAAAAAAABwRPFFAAAAAGFtEqwBHgF2b3JiaXMAAAAAAUAfAAAAAAAAUHgAAAAAAACZAU9nZ1MAAAAAAAAAAAAAcETxRQEAAAA7J4IBDP8F////////////tQN2b3JiaXMvAAAAWGlwaC5PcmcgbGliVm9yYmlzIEkgMjAxNDAxMjIgKFR1cnBha8OkcsOkamlpbikGAAAAJQAAAEVOQ09ERVI9U291bmQgU3R1ZGlvLCBsaWJWb3JiaXMgMS4zLjEbAAAAQUxCVU0gQVJUSVNUPUFkdmVudHVyZSBMYW5kFAAAAEFMQlVNPUFkdmVudHVyZSBMYW5kIQAAAEVOQ09ESU5HIEFQUExJQ0FUSU9OPVNvdW5kIFN0dWRpbxUAAABBUlRJU1Q9QWR2ZW50dXJlIExhbmQjAAAAVElUTEU9RW1wdHkgTG9vcCBGb3IgSlMgUGVyZm9ybWFuY2UBBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MAAAAlAAAAAAAAcETxRQIAAADTrXQwJmt0bGlramxtbHNnb21tbXFzcGtpbmtwcW5zbnVvb2tsdHBta3BlZhbry4DtM3VQAWLUQPUmXo6f2t47/VrSXPrn8ma9e/AsTi3jqbB04Sw1zdUPa1fjBMs6ownQ4fOi7NHbj7EzW18kEcPik1/Hkf6eyyMbbw0MVludxzOcVjQa0tFB03Y3O32eBHsYvVfM2gBiF0vOUGLD1pagBBgAQIxhIGX9+b9y/2nv4/t7D9itr/186PC/E6ve0ZkxrzRb3FpXyv7J9NScZvTM1XbpHSd+Ju08SmIxLbasFJ1T6vnXiRtuqyhS3kmftQgl8tfnGzZLV/1YpYeM+Q6/cNjATi4Vt+3pAGIWvsZgLmYRoMQY9cQ8tT4w9Lvcr++VI4fNwX/fvj3rvN9EuAhnY/OP+CuO9jXMmpysCOMpwj1HBLeq35i+xyq60Nw7d6yBpaSaBDP3jOFoFN/x7/IEcapdaY2sww2nRCfm01ZD+6vEZZJ1DGIXPs6g29Iri4EYY162vvt+VKqlfzH11bP7Z33Xf6S89kRuzB/j5y/PkZOYo3S+5Jm4RvMrpEbbhLmhIaF9rVXiuUxUvHQLPVIveiyU24DGNLhIScNs9cUVfepmowzVOEnm0hDeXAdBN2IXvmTsDHEAxFgB2ooJm4floR8vJ57Y7P377PaW+GvEvSfzdnpqXFlZgjQkZUiMZPw9XnUTwquoN/oWnM29dRtD8cddNHbriDk06c9rSg4SbA2P0ctYSrAO6xeUKJTguQHVnOsW8IVKPT+hYhe+5rFe0VrKAn6M2vHJyT8nr+tDW/u+2cqlY/Lf01fq/85y7Ph7625oxu5CwuLr8dP8ROByyJ0ynbiFw360xxCM0smHfWxuwERtV8yvw+XlnjtWunqGpNh0CZd8NIE0aejlNXRk9+rTBl4XyamwBINdAqgAkWo/Lcfefr48/3H8eNduPV1ei3pQKaZwe+9mQkNnHFZ60vYOjdLfiku5C77tKvu/yWu5yLe206/LF54LvPrPlI8DEbZH5fIn6p72c5aGOumB6KazRYybsEeUAZp4GpTDDWIXvs6Yuh8xd0ACCCId96Oz1g8n5sPTPOOdzY90G8f7zNyaZ7wysba77LWDalPj0Q+3xCXGpZk3nr1GwYv8fbBzZSQfVff5/KvKVnfkizXG6Oj2tDhEbUmIexVn4W90k4QOoa7BA9SDETmTzxhiF77G0O3KBIgxyon3NVPff/3z6I/Dr+WZo+Sffmtr7bUnabprN7LWupJjOXyIqxfq2bzHeG/P+r21Lhk1zy1OGg5lEUne6kB92BzzjU/TTkYUkI9qBfop6DzmDd4UfCN/CGtO8bqvzHfi3Q5iFr7GMHJhIxdpbWNKIwHEmBirTWr/fv/4i8e7L3/dObaz+Soqwfx+/9FIvWbJicnORaLbmDyWxs3usrdwerPppjbD8MlYdOSrBJBnyG+Fv74wYPGhhxwpcpNHKqb6OmwuBIfBdT57kMINGfcpyHHhbX4KYhi+xrDd8DwPiH5MZpnvxLNDH68+7zP7j7m1Pqo1ee3Q49p8G4lVLbL5l+hK7FMPiSPL6OYwyymXkTftNF7HYlctgdsZ90F2oebPv3PJtfue942usdsE4bzeYH5hPY7WFKt8pgm7FmIXvs4gvroAEBOAel4+hCvf3/pnmcprH66dXb69vr3PjGufU9ee9FbnoBPeTYxk2siW9VPD4gf+wje4XE/VTUIgSGZOphQvYco4Mf/qcy0nHRdJ9wFSKmlsyt+tbbm0YHPO7ed5ifVhveYQm+4RTGIXvsbQB/xgtqZAjL7WhCZnHTqetn+/iZ+v21Xn/6+OW8OPkHg8fsz7dyX3h5yecQLrdpnos0RnoO89KZm/5T5CeSFao4DEhQfp+S1IdED7bPGmvL8Kbsz7wLXXx/pGHaahaxB/ya/X4jNG9gZmF0vt4Yu83igoAPwEMLFq9XQzGr3W7tFbd188TU0d5a0frZ0/M3X60sbP0TsneFsLy5OJ5ErSdOP3I20lZaasMvMl6d1Pt9FmExGTftf4zEnKoci+zzKityAgwEqmCfiVnHxoOtR1EDzKKdghXhc+ZNh4tU0AYgwW07i0dfPjQ0f+7W/X2Tnd+sBk7w6vHNo5bjHHnXUzL+yWtR/NTXmaZ0za0uNpVrVctp78reWr55Z8sfl8fXjlxnQk/a6FCCRe5aG0ejw5PqYw5ioa1vapzdtH2f04mWufu2IWvsagDxxYy0GgAsToo/WL882ntybTfjF74unM1bYH/ybTh6+GJV1cpSSHiTPLOnVoddbsfGA5iXv9sMHtqnswpu+iG3cEbKTUdfE061k1Rl8EBHEjLT287bR5LAqC//MULwTHvZxUxjJp88zWZYciYha+zmCuWpu9gxgTQDiJkz9sEqe3jtx5krA5/v+TdHd7X85+kLN7k9bJ5WVf642s9rqy6jS0vPX/O+q35dI7HPK9oVaWzId535hFksfK1DMS5dEh+6z6VKkrxF3+ylydtOjP7jt/e9Nw/Tm7Q83EKE/yAF4WPmTY/NmmPDAAgBgZL+HfX38fsrexy++SL2++llkbxs8yXvdxzz0NQ9jUPb16cfGumzvRknbtYtQjfZJfSqwcTK3dvHiSXwtnv6RTHo2zkKaMGQIMYy3peexdJ/rrkfHZIuO599bwVVbWqYYrYwliFr7OoG10t7QBMUbFw8TpA1Pre2baL5/PePvi6egSnTzrdd1oYWXdfA6BWUiIx3Ui2SOrhC/u96m/xtR5sxXiLuOwBkZgtuBljCKqwFLdqbC5iHL2dF4p6fRlCylFo0rhMTAok2kQ/LAFAWIYvmQwF010EBsgpsad/b4bU7Pf1Yfr/Xa+GG7XWqLse7eepFy273Y2Yl5qu5Ln3tVhL5lbmxjJrJ9f1sNwRveWDM/vy7Q6FbMukSjmD33JHjlvV9fs36BrTpQeyeKp5mNxSogzLV6nCGIXvs6Qi7T0tEdMAHG+YmLn/INc+v+h3f+6sqmTNn9WB28J24/T06tR2sS69cxwM5gJ1UTu/Ai8sLy/soMv6xHdOMPmP8NwM3Lu80xRO8X1nNXoxmG7f7TnYsTG1hLfPXtbriyW07e6wsace9pnYhe+zpzt2bQSwMUYrcKfil90LneuPHjsZkuaL+P4uq584t7pMO2PV1885W+NUchIEj3654qU0M92w3adIFzXHs2OxEmvoPDKARXcs8ZYMaQ9zFb3LOk0o0FwIeuMHzZYHtI9ZGhJS7JU6KRiF0vGoBffEUgA0Td8S7R8mezr+cVb4lbv5/vxaPtyb74trRzMU0+6F8s5e/29d5QMNoPbdPIyEgOReDj8jLDw8jzU0vv6/k9aJTLKj9odBdavRh3L86Pq3m2TOhkVh4jIhH4TLn39ctoU/08W6QYJYhdLzrDqoyyl6wUVIMagCXNn9er2D7t9j9hVpUWGXa+JrX8f2Kje6R1jojVJnGifyV+bj0npjj/ZO98EWoh7bKLswwfm3lJ2R3w73LHZ9Kqx3qZsn/bTQCI9b937t59x0kHCnKGXwsEQDY9IQGBZXApiF77OkAZuPG6ABBDjYshIX32ml18cSX///cvHO+fd16ZYSzz4JNH30vjK6XROfmgdE/ekGM1U2e8CtWzG8LNTdtQOXnQsw9/BHNsm/YvNe7heFyhILNy28v6Mrpy+MDJFk3pEua1ZJQ/09HpVCWIXS2SIkT9OgASEGGNMdlRtj7227Vi/i35pnp9/T1hPuC0HNqmrOJW8fMhyZl4ZJ3bUMqXpO2Pr/Vn8Moans/2xvVsmi9HF66OxZfl4eNTSYQ/m3+0LeSen6QjRplcJe96c+bCgazQz9lfYUEk6xq43j2ZeF+k9GlVGcIQKENUiqTYPvP5xM13K/OJX99bkZp/68tC4+9vWeujzdcvksKJ6op7e4uwfA525rJWXqx+Gbl59twPfke7nPYuLIdJSL5cHFou8hbxHC8KIwb7WGizRZNSnlTe40pFFa/o7DlchHmIXS0bFVwesjAYAKkDUlcejqT2Hrk18fTLr9Uuzamy99bZ1uH/UVjSRhtibu+21YLds6Yh+01l7MddlWXaMVM6e7f1ek2/i++9eMx3vj+/XHXswvGh8BaRH5p6dernxNr/HVHkoHyD648Opbr/aHxvizuSOAGIWvu6hr1IuaP+oAH7siPlh8ixN/4e+j215uD2mvO838fj16cnH6QfXV/abfffCXlt217th7Cc9eZ0fs4ksfmc7Oksnn3xdI0gFB0DFUcOzs/WzWUrBler2Top6FSwso5LFIbgTmX6Kkj1aZ+EOY2JWXIZh4002su/QeRUgRk3K/CY8uDd/6ElK/+OWyY32eHX6Rxr7XU0zle5d3E0zS05iwpoyrAhDvkjGcrnkcH4dpI6IKRPDt1L9DeLtRigRfjxx2AuDCQ4hnDVMOhfEmNXo7co2p3R1mQ2GXMaLDmIXvmRYumh6HYgxitTp6dpD/zz5Noa0R5M3r22daZ3zdHfp7X7qSXQVkJroprmsVcYp63GYVC4gGcXtY3hMkdt04/vhOfmiYycT6S84gQ+fXIbqv21+tNqrMpBsuakRd3kHwXOPTCaROGgGYldcjmG1AZEakwRQAaJ3KtF3Zsf+x7Kx/G+f2q+T7Xre//sp/G7T/R5TjHbeHfr2MZ4bZPPCCj/zmjkP1aq/jBjMsTmb4DbKj779hakKmSqWC2gpyoXi1eLsZD42o23vTstInaZWnekYvHADYhZLxnC9G0gHCSABVABhxvzn3Hwm9hObD1mM9BdHDk1fuXtzZWjtaUifrLI7ulkcrPoMi7EkwjDhdtPNttjrWG3WUiTxRZGcsI1JUkWi5ChCwmF/wqdeMo5lni5XmTU+/fjHT7GC8I72AA2Cj33dSafDvAFiF77OIDa1so0DUAEqQFxM4/bZVau5/Xz69uPbZYvtV2dNnv9JHLmb6LFunJi9Q+q4r9TpDywug2FQdhon1obW6dSy5roF6VjAMn51H/fDzOFkVIPqI+GHUXbYVF5LI2Mfx5STjc5qJIGGzrNnC0cOYhe+zrDBb04REywBALECDITunL//bdv6z6eTYB1tvdtr9puyVr680TehpqTb6Y6bivRPmaIk0dX9kdGTQ+KXK93TlVc2wMeyZy+QiLXflyi7Genmb4ltc5cjn/ztvAk7ezkHC56Ps67mIXZQZ2IXvs6gGUUrQIwxj3w+s//Vex/Yavfysc/9z93uV90nt83+4uP5xN4E3bA9fl2mi5OW0pGKtJyvUUzgp5Ry3SetNTyG91kl1Knli15bRHvk9+Ha/CaDKmcbvw410H5ZRq59wjbR3B4UKFojYhdLxlCuhw5PBYgx1N4TWV26n3b61g/77sbyz8zbp/+Wmbp3J7xl4SYYJyluGn2OvIXLuSWfkVSY2ZGQs7pfmD2mSU3yi2X09NOesxKGeh6i8niN1oMwcBd989JdBpofHyhYU4lggQcVyzvwaj+Xc2IXvu6x8fc+sOsTRD9mHzoz94ZbtUyv+m0X5GTtpF3b1tZazQhfSlP/+KS+hgxEk7CGrbkhqeW0F2RFz5p53OyxyOkyqB2tHpn9FV5Js7puV1NIMV3HWYDuXXYW1I2b5gAnWowBT2dnUwAAAEsAAAAAAABwRPFFAwAAAKvJe/AmamtuZ3lvb2lxbGt0cHZscXFsbW1rb2pqamxvamtqampvaG9ra2tiF77G4NfYCqgAUZ2Iz/LTg/TnV4bXXsw/LemNWT++vNi5Tdpu6c7Jas2Suv7zJCl9POMyHvddZRCZb+TnI5lHZDlcNjvnz9IpQ53vl/aGXP35sFMmqYYsv+slcJroYUdxnp5OcUcSP4lzYhi+znAXclFuEUQ/js14yTKR7mLcSdv/lbeHdk5P+5l3X037ou9T46StYd3oeMzdw3gYJY8UBJ6W4+EG7ZF54jBdnTioi4TjrFHMtO1lt7kr9NOv3WWOLmTR7guDlti1emYXJZ0aaPZDbwJiF77G0NrAgX8NiDHGcHLmVz9bvr7zo+8D3Xfvw49P03H64GRbsk3YysSvON6coHEN7U9xH7GHTpa0YPp8PMzbRD8Wlfj1o+nBe0XekLi2b/e0+ttMOj6CkjGPB0OKepoj9a67yK+XHEpLPAR5jmIXvsawmFCgEWMUdsdT+eed9aejv/eTCel+OTnx7GA8+ds4lNgbPOn50tAPyO8zpDnT5Y+JXyQ9H0l1SyUWdYkcHo73XcIp7RSMTTkgXmD+vKPqg3LaFjVUftV5cllGASshRns8yABiF0vuYWO33ABFwAAQUAESgK/3HT+/8/DOrW23/3m73DPzueVXn3nr3T3TK7vTVw/p7RByb/qlO6jFXnInaSx3+06utkvq+IiYoh3xRJmrYVI2lqQm2jsdZ5Hh/Vm3W8GEGg3r++JBbyK9QT5EGkI7didS8APEh+kYYhe+xrDbZNEwmRATQOzIgXdu+ny57cuP5//2Hx/X6Z7+Npayi7c3up3RqaRd1id+djvGnrRIZy9EnmQbt3H1j2NHBDGFEmopRJhwqXV40H51zzoWlzdryBNvuVC5qZAPcDRcBziO5D2mYw64rNqDYhe+zvgy60tkAJAAonpcWHvf/Vg/7fdp9/r27iu2v7qv3j2rlIuZ+nN3Mg6r2H9NfRVDZzSMdZXoUexVdDY9hL4JPN2X1afhm66Dvswywm6eJOuSuyfo3JN49BE9DRslZx85fYs0PKotUqfnmXoJYlZcjqFrkzwQYzR3ws7q6Medflt7rdLbuz6zf09n88nm/cevLpLx4CQp65fS1G4Zet92Yf5558AHzNpAo+36crks2Scs1EgIXDpKXA2P1vYDEhJyZ5jBQmnPmf1yHfA7CU003TifT1gZYhdLxnBy2Y2PhJgAYjdlSR2++L39463dgytn5mgyx27+99B7UoPR/dg9Tcrl1Uk3Tk42+bH4eveVbv8UibI+fZiwxo5F4WanuFbOmcVIt0NPEuEc8JokPWOl8zLZlnVOF61L4Zj3qdalSK81zXHaUg5iF77GsI/RMwBijE2f+fu4Xk9SD11Jc3f2pv3Ox4286oT3X5ujWflHjyA6eQ4izSDfA7+xT09JGF/LeXqn7vOzRYv4kxP0PTuNUmY9R5iTBNXh1jv4zNvMrgGhfMJ8562zFOOeY+jzDZJ4qTtiF77GMG8GGogxeuBde2Djocmn7enf5zeX097q/tm91GNM98bxV3Wy9nIn5NenDq302vUpzN5x53r1Npe8YSPXb1NfJeL6FPzVvBlPm0xfnXrScYGuroctyfFaMDwd0WV2nSVTRKsLchr9BGIXS8acGcaLdkAFKDogVsvPsFz6k/ZLm6vy0JVfp+ntn4xGT64mbG7Jy+m4vxMTY90w17i82Xk63pZj/7A68d44TyQlYa6yehxzUWw7z6JfN8mXxrOb/WYU3D7zv8BPUYDOezpIZnuPWcFMnWX2ndC/rqgFYhe+ZLih6h1AjHFCc8ql9Qd+fXp1xlcbVz/uWrZ3z/an0rWLH7NO/+ZJPY83o41XpvtYQIxJ6cRqQku/iNPNSdFzbnLC8IyoytW2hpnStUrqlWdeBGOde4tvJOHMexNWd3A25VNvcl7DZQyn1HWbCGIXS8Z4m/TN3IMBoMMAAOJkMU/eH/Twp87lV+++/7j18ysvEgePqTMSy3k2OmIc3qt2YdczHg0Tae7PLec19u4q9t9u6e7axFH7udbGyRp0t7cFtOudtbtmGTZJ0Q52LDWMHK7Baero1deDCserZEVPjcyGbhFiV1zEsO71nU1SFsQY17zmg2nzJz/c54jt3fGMT7vn+8axa2fP5HLNfFyfH7lHyZbET18sdmLC6QS1yYWdsGdUK32JJg1Cr0ZRGAm1xHNbIZm7qdvayVVw58du19x7MCkabjWN7hAX+fORvDRiF77OOKMvujWwMTFGzd8bR34l1tNYUi4fOZh19YGV5djDB9OB5Os3QVdpfm1rQNgONLxOz++9jvK1LW9a1thCjORyi6ukDzzFyOeH6L1LDVHTAhW8deDZI+1z5innRwakHMmsG5zH+5xnPJxaaFi2AmIXS8bog/3KAySACo7olTfmaX993b1t+vOP/x7Znzz88NGTzYdbPekJq5Vc2E6enHsi/QlxWE+ed89ezk+vJ9xGO4mnCc0cxT3P4ZFfHePZRd3yaasEQRb2zKkk0V90O6VaqjRJaPUExNdBjHqAYAUfYhY+xpiZZ7g3SiHGKLWSuy/ma+neH3qe9dPn04ffbNN2Z77+ffNs6RkfOB24HzSxsHhzyBSusXATd2PhMHehZYuf16AJvmMsawu95ijusWbuWVIVWIdim43hmKqHjGR4QgSpgMUp3oMm3BcAYhe+zbBIm7cUhSbGOK5VPd/y+ovP+4dHV68MP62bae5Z+v9qdbRz88W9Q+bGtAFHWnM/wPMTZUMg+ljKU5xE57MjSukp/NMDE+egMXlHKpZkOGAFj65VXhofqvp+tUUbP9yUyGl4CPe9/xsRAV4XPmSY80vBFkg6ECN+6fatj+ktf2Y9pt3qf2dSU+mN+bvbh/bGL9udFH3i5sN6MTA+fdZpZ2HTe/tZ94dzh6KzoNsxsZBCNBHx7DjXRLSWy+ECAYirTFOWNLV54GWoGA5lg/w+rTNeyFn0sAJiVlyGYUSpb2l7CWKMmqiwny695TFNytNb9zlvD13at0tY0490df7KJU6C1QkdIvHfJQWXeZHGIhmzx57cy30S+9BnY3EeYgBoxbAxpPMhMKy+cbXEviOKpeNlMlbMj+ZbOFovrMRmvnoDO2IWvs6YlD6bA3EAcIi+xJRblvT/X/v7J7HX+/CxL3bsZvz4vX66aRz+cWvMfg+/fEgYvkPsdHo7lfc6WknPy89mpuSs/WhRQUdfLus06wVhIbRACIyOkzzlfjYfyDVdRx6MfPmgj/qGEsJWjglhEGIXvsZg841MgBjjziTt4NH2yZ/5/Uv95j02lz/tXtOJLYlJRs+f7KQanovsvAXCFHI4SNgJueCncec5JnGBKCcfXjDXyN+N4uiw5eSOOSOvYH+x83VhwUXAgRhSZuHzjkfmNkkzTBJJ8AFeF8kZbGmVsQ7EGGswTn+f2NofOv7h5/MrZzbbj6U9fjBx8zxbNruXUUuHm0vpZbJ4zdlxkAT38oMu7Fp2dd4p7jUkVEmYeRGp1g4hIerlGstp6EHmg7VPvV1teS7ZpAKWnj74bNDg4GMCYhe+xmBdMyLxiDFSfUajPCP+91ry+/lkql1i65NDT85S+977lLpYy1ZGLpVitvJL6DmqhD/xS7HkNyxRzRXjyxdyyDVsbHHUY+Gnz3KJtEdT2tNyrJ+T4Ps5cXhVdApLd7Z1gB7Mk4hwUmIXvsZgvPEiCRD92IzJ8PRO3uWf3189/OTHkXTpXkn75OrrvY+nyX1NWHrWoxuO58w7oqzEt/BCwi+PYcJsnR/PRbp4hnkk8XT+ioYnFakgadInUbSHWfgdM6dzf3LOh+gSNgSHeAmYj3mNJ2IXvsYwWJ2lDjAAgAoQfZ711sGPq6sPE9XyQ1/+fhuunc5lQi2LHJbb9KTD9OnVfmy7mcTtvJ0wJEgx5XAuc9R798y3hTpt+UwqdkRDho510cr+h8Z52zI+b3Y3TgeohAPamrIoSvB1P4gH/yUtAmIXvs4wOPKIMwwx8H25aKdLrYcH0rz8/26aL7bPvPrr0Omo/+atkyF+d/tUD266biQki1epc7WKYXvBgIuxyKI+k7397btaypHbb7uJ2MKor5TDuS3Wq5Lz3kpdWZOsZcWJ3M2oQ1hy521iF77OeFVaAcQYJ4fUxPqX4QS73w9ce3zLP7+w9J/x4OedS89Sx+tGTxxLEixx6oelc/4g2SNaEstlSf+ugrnZXxftuhRXf6lkVw8mYHP7TnCPotNdZJCS9+XLxDJ7g26O4Q+0i6SqkrwNn2YYy+1hk5TeDRbEGKOzpLaHvurX9+B9Hb50cOnelV/Hfv68/my0Nopd41TGKHuNCRkK3iT/pY+LS2+Lnm8r82YIgP1TgCaJXNAl1BkhmTa6D4dKP5xBu5np3pybllg9O/CmufrkLEXs3BdiV1yGB4m31UjQYoxxtu0/T8o95dWf59hwdO1wytTzvDqbOW7f2y/tf5yfN2nmn7kgwdxSq/dvz7kOzzgewJ624Kw3+jvE/UONYW3Ba3PY5CutzqId+pISk8gdNkW+ud03M9umZRexupsdYhi+xmCb+gNEdRwR9NZjIrn0Wh7bv58e3JsRQrh8/qt7cWkYP0n3pN6pGIOb8qLjJn4qhB39Poz+o07aGv2U9v/xx0ws2mP+Qf7zVwTVyuPk00q7FjlxyiM99ieW8jLDWq8CrboBhFVvAGKXOTUM7wjAeABQAaIoukp7JfX2Zp+/z+8cfXH00lSOo94ncTVhdNZXG4v26OoOe3VLRxfBmjww4yBy99207ExIHKrX5bc4cnAz6l5OeTY2u94UNCUxCo5iT+tm4GBeT+EGSkgdzhDN8SpKlx5XAWJX3Iahsll0k+SrCaijrhlB7vw71Xcirbl5/KftWtvduDKxk/JtNQ9tNMuhiuNZ4nLUIJ2A1tlIoleXj02lu4uGnQnPnq+VS9b8Y4PV2+TKI4Ua57IFr3nkBeu1Olc4aHGXquStAy0AYhe+xvgBUW0dARUgxjZ3WW6nT58PpbMcbYfTDrd2n3SCdS0xaU6eue3uxW7rkf6rRbZ0h9CTWvXlTOZIrv691k9p2nVzC0fnQ7hLgilKNSi4XfBjuyb5gcyLt/OQtrpVEFkaRaLnsfJm+7OJ4w9IXhc+xphmbrjwlkrEGKlxrM3RrRd/7l669c+DnT/j6amPaxcpsxiGdppM+jEP08dLvBKNay0VrzVE0PEXLO8M64G73rVfsD1CUBTemmIbxgyGSn3K5nX8N0PmTJwORTsZYxileTYxBD0eu/piFr7GcJ+m1CHGmOPq1o/uL0ueva07mfohGs+v/Fkqpl2bMTG+PXlyaR1OVQ4vcveT1XXGKQl0GHGe+8xDOPNb59mSjBAu5TIfQ46/sYbWg4sNAyuxt6/bwwumjgP1K944XIU7Zq+wtxTSTWIXvsZQLjYwv4AYY6IN2T58H7XrSe3//Z/eTG5b23m6Y00c7eF4zDardWAbvINwuqDjUMNlJWcfkzCNi6c4Ct7LfKBf5U2k58tM2ffrMGAQxe+mDKMwBg2Doe8fjiHuPgaE8PaVQ7A8V0w+T2dnUwAAAHEAAAAAAABwRPFFBAAAAHza/+smcG5tbmlqa3JtbGtza3BxbnBubG9ub25saHBsbG14b25xbnBsamtiF77OsNyGdAkkgJgAoiQOW2d8ejnjhbH/4M7rXF7ueDh57ddor6rWJtYOlhNLJWf0M4wwaqlz3jSupNO1bliNtr+23uinBZVJmIthKOweF7mp37d9chq5EgMt9whLYYsNotue+rnUi98fTw0PTeoIXhc+ZPSN8MUXQAWIEdp1y9cfr6y/70nG/MCt07m27UdGhIk7l6vdWqP0JAzLvzuLYaznpA6C9uFt/70N0RiQWaETUxI55b4IeIbLii3tfLzK/E0ix1NoO3kPyaq7SUtElLFzkujlHvPHp7cPIQNiVlyOwYg7zaKgAsQE0Drt6f3H8fTkLcvb6Mw23dHerx62/BPXX4t7j0/jTetJzV88EfHTzMJc11fNmEdlY/eH0cwm9QZqdvdqeRp6kdi4URcdTSzxUSIa14PZrPZ1PrXbUBFhZk5JDEchU5IJYha+xqAvFS1LQIzRT9uL8XzNOPx9+/vw/d5Pk08eWL3U/t18s7aTmrTrmO/zqYS2fvvb+qRh6jhuysnka1AySCr/61H/SlzQyTFdBn/QWKy8kYTXJQrv+PhMtordr5exmILUY2QOq/G12Ga5+yNiGL5k6DdzMUxUgOjX+tO4XNq8nManZ8xK/+vpfynnPWdtfCjx0P027KoeeOpmGebcwD7mMrsCRp0E4SKGJoH24ASz6YsLtudqRhv88co4PI0eSVSFA++RF8wtYp0qKXbAj3F56gt2+6NiF77OcNlHMfwCYoyJlkjb6fLvQxMPXX51QxM36+3jMfYyKbaPac1k8s2tSc/Foauf/BUtUu/x9JSnp5iY+p7qp5uuzu0YBAt1D3JCLIkae5OFe0t5FV1OLofNDYtn6p66fZaexTU927IcYha+ZDgtAMQ4AIC2PDv8lkzy4HgGR19JF9P98L7Jl6eG9FltHWzV93LTMPW2+Fq1rE+1pFMaIPzc8zYMHYk3kxbX78nJOi9Mw25C2Xd6sJlo2Q5T1zCGKhed7/YNj6ez3Pj3OpNRi+ZCqQNiF77NuMVUBl4LEAcAECvks9s/H/812sw4M+2s59bnR7Z2fZn1+cqlQ518M2mIaRIWNxKx38pIxHQXmroTg4zGerqaYuq8u20e0f2HpAPctg4XfSO7o+ZkwHfe5s/T3XdeMvYS+JFEg7gOonq8jtgjcQFiF77OYPCXOOiBGGNXY3vfObjU+/D68fvL7+2J37Vz78jFp9GTk2W+c2ssHAZv1zs4R6YTL4y32Zd58OZMjQ6HX1IkXNh2iBm/OVX1uOTiN3073soFmILnvJnWdR38OVznaFdkDUYShOdXMh0DYhe+xnA/NrgGxBiznm1K3/0/3Yntd+TxRe+WazOX97WYdwy7w2K1JGoAFeTTQXIT9VKm1AtHsp/ja6rLuCEAGVtcf10X81XcqUYv7VJnajd5xXsKsQ7FelRcXgDEcSrhGafEq8Rj09rnUWgJYha+9KAbTXQg+jFVc7hZZj09/PC2F0/7Xfni4SNT9hpmdi4N3YPko93m7JVCysxgerQDdDk85+J4HUfulufGvkQzdlAndHlrBWY4i7r2gG+eTxCejP8r0OpegxKFOtjMK4XVY9DlsJU89AFiF0vGUIkom4QJEkCMHsydy2f/dw/ufz585e62vZnJWw+dpjtJpLlVyUnr2Y4vJ12eTMntzV7jw/SGjnZ8v4gg2xvxlAT9OQ8z99z0oLmcmz8LFlbhSf6xh0OH60yuwk6hjS1FH+qKwRWWgmROeDML6eIAYhe+ZLB4SCYgxhh0YrrPh6MX8vz71a1na8+MWXY+f7pVU167/GOne2ChAw+MWSzgLtAtJF04XfK+stBjuN8HDqsLU7mid95k58NYFnAZqcGZXXNWxpuGS+30yVKF8B41nn/6dLTlbCY8EARiGEvGnL92VoAKUAGixPodujXr6dToasfu6st3f7fp7/HO9xNOj9X6eTPmfbYc+mnMV0NnLCFVPJ1PPlkx9A7T+cQcG8dX+bFRXNo256U+alBRi/Ci9bCnQN60pFHS7oQQP1QkqbaBXeQfUrly5IcAYhdLxnC/2prOYTABEKMl+6FsyPVrkx+v9zzc7++55fr0wWvSnXyicduk7XJyVonshrH0G9M9K2E0t+kNyW1PzBP7Qz2yJ2PD6ndVg/eYQDJ+icNhDFj2uYT0uHrmBGaPLdz9Z92PyRcIWJipP3axHwFeFz5kWG+yid4AFSDGodptc9Wu3F6OHOo+nzH71tAv75+nf26q/J6YSjlpu7oZJtusRfK8p910iQa+Kh+MucYtNFOfbJ4zkC0EZ/dNkr34RoMLFxViN6J/HtSlc75007iFcK4fVuvnwzawOtqNAV4XvmSIzaX4BCpAjCQDlk6sZ7Ybs/8kv+j+935G/6th0jzr3z0JfUMi7k729Mj57qe1VdNR2Hq3/5IEvZWDolQyzWOal6TfTjGGoUq2x14zcodRZjrB4/nG4hGHXnBb/YUNmZd2vQNCTrvnej/hDyJiF77G8EPkrEEgxgowWWtpNs737x+ftrHvs+1r0+aB72vXpma+Hf+bk7ujeatdM3GyzM1lpL8HCY6nboF+myjDGwppOv+ZkxM/KXIbyG3JzkEypsoYM0ODWdCNJilBwHJ7RxDV27eDo+2hY7QKBWIXvsawSLoZjUSMFUCccCjN4ZNn/60+Xvp9v4+9vfVpbOODdE8+7iaMu+EqyljD3IgfYihvghBQ1s+BdRJi6m4WkAvjIKjUOpcdRXLFuhPzXJ14tDakHTscls4ibKl82CYn+N60+k0qiKNnF2IWvsYwtUWahpIqQIxzHYU05w9tW3a/sj1UszZ/d3cmDZc929MnaY5Ze9rBk8Np9/jlNSFISAxyx6fBnaOlCaNkn2h5b7mUC/XoMLVTIiWqMAVhM1gkEm0Vd9PfqzB7rCkNVeXiIIRhdRhwuyjaDmIYS86waNvIGANFjOphCInLOuvxhfzfPXzkvGevPo/reMrmPCUl5XuwbNHF12tVLM678mhJW3h7KuSMJxe/4MjoKe76aH5P+2jdcnt+P+BIHIyFPinq2cy33F68qr3a+h1sYuueYzSFh6QoqkABYha+xmit36DXTFSAGIPPzc/r97aurk+ePZv92355myfftgf7p50kqXkymZiwOdR/opOc75Wsx2XyIYx6ffpuFDPf0YSKLJD7AFgKAfqsomsdSqBhOPK4ZYmb/8YSXzCHfVtE5YeBNLXnTB+HTQokYhe+ZOjyo9OhAsQowdj9c+zh2Vcv/rFcfnj21onpH/0mpz7NtrHr7jxedPCDyDDuEeX9jjlamrfclnoT2dE8MH/qvpPo9gbf+OlantMK4YlGRq4QjgfrzKfORun1aa8ooJ5uYeQtw2HbM72jPg9iF77GMN6WeuqZoALE2NZiTr38d0a/qS82bwWJl+3tmt38z+7nO6O2ccI4N9+jtk+tk/XEF+N03HN2M5kKFX2og6NNv5W7hJ82kgc3+Hlo0rNLVOQxkxSD+9qHcvNDnIgg6HrGcsfM/y2mqRliGL7GsC2br9EOxBgxR2nofy2lfZi//vDl/v3eWd5F888QXlpn+9HbKZqPgoRfduo8+OqIVVhTWyo6/iJiwP7T/zeSYNLU3ZpoiG0UctTq25aWaYeMz16WjFmtC3C7lOavVoQ5+nCKAl4X6RmN0Sz6QI8VoAIgB+2DpR2ekX62jT7t81h32vb5kfnLYbtpjm2tadu4ur0+e6KG796NkU72xjaBuNF+VKnZTgCWbOKUsmfnt3Upylqjt+SnEOlGlLIuFC9SerMQwzLKbefXeB4T8walOI/crABiF77G0IaXUI3OJMZYZ8llmO+8vOhs/OzD13bt5cV/j6+bufflTrq9cSYM9n4VYlF4saMcgrAagv7eAaZh02FqzxdXObCNEbaswwBe7q2RMFHM94onIRhCnMjCr6Pols7k2LbLnvMtOvCHxAhiF77OMM2hmUCMUdRvm/o7pTf5Kc2n2Wu7156/XYuj5fTB3lWn51DQh+ca+vKWfJZEzhnCwJdgLg+xnCQ9ji6g4rzkGruUcPbl0zep7NCPr4EQjt6lU7iKubx3T4NyuZFT3QiVvBj+OudVvgReFz5kaMv1KwAVIEaMVt3VF6lfz9ePX5l8vBqPSs/fq1F3dubzmaP71sl4qhPd3W/rraSuxBCtXFdfCIUtvG7OvVFBpGfhMruM+Xn+4KC8Ixl8rnuPJfApfMyI+f5E8TrsnMSt7ARx5YU0Mac3YhdLxpBt0SUtbnEECWAAAHFlfO9Yh5SvfNZ/T79a/W2fT/qeTp30Tdr07Tvl5k0eTnf9/iqvxeQikt+edI7qEO7WaOhps1baNwTZTww/pPOkG2Q9adV7gVCrSqL13Sd+vNxUh7MwY3FOApT9gLTXkMiwTh04+C0BXhc+ZFicy0vGoiDG6CUnE8m/9tsufTmj/dqY8dXh49tfezGZfHou/XtHN5cOvn7l2cLfvWJvznq2naD0Byy0OG0kz47uhgmBHSwsiE5TBnny2cgpSQs670BCqn+vfFhgaz54KrLyGZNzA7Zy8cIKYldchsESMKubmBD9WKtFrBMf548v+v8zmW5v7RXjmqlGyrbE3mFz8iY5/rQtFqI19Nf4QWWK2LYo1S3/xh3DGeqU7gpeBE3Bm2quOWvd77KZEhBd5D2+dcKBcSvulXrgnQUxsD4FRAwTQ2FyVCtiF77GICtLK8FDBbQKUAFGYUif4rbjtdT8/Pb58/B2s9/0vt0Da0v/k7XE7bPpIXHSKYlhuLkk+bPnYVCfXuvttho32tuQtF+LMukdaWYygB/YVKZ0CixFNNGLmyc94TpPzoYOriZ14yDtTJlFntiVA2IXS8YwtdK6GAGxUkDU0Gm9faeXqbtTnUvtU+rmg9OXb0frlcs3j0Z5jK+uluTvTFu3XLgQbbyFMEj+JyE+zv0eLgENJS9FzZluDxhwv6aYk/4U72PKTpDD459uRLx32ISYKASV1DolZVFOpQMTYhe+ZNyZAAwAIMamt3YmfsY2Y8I+P36/dvng88/ux56bns7bYR/PnwY9WFzir1E2lhRLiPObFG/71rNoMRLy9q7Ty/caZ/20bw9NhB2JIj8Tl6RHiXz2DsJ6HY8k6RXVKFAe21mv4tPGeSg67JH0M2IXvs6YG7RKWRWbgBhjOROk+Xm+P+PnxPUtfX/nlAdvbHb7PBsm36ecdJ7Nl3ToKV2KdOnrFOU1quvRFSos9wnN3nFOQA/ncW/xzDQ9vBw59ParWKW6uQd2FUUeyEaBbJRItcawRsLc92Y5MmIWvuahbXKm2UCMau+MljRpvri0tn/r9S/f6TG/Uv+8t+iBbjW2q3XifJe+J7zRGDTdHW4pTbyRT7uLpL1KwzJPXAhri/wpirS1nTANjkL2zo5aO4WVST6dvw1GkT/dFfkmIB37F4h6pgRiF77G0PZ2OBBjrLm+NI2Zp/8eeW53/esHDyf6dJ8u/3TFbs/opyeWZTi85vb6XsdBBgfPPNs5a7v1NdAqZ+R2FehymkM9m+atn2kz3xsOwxZmdHGVEBzE5if5uu4D2M67mGykwklRvOUbBk9nZ1MAAACXAAAAAAAAcETxRQUAAADt8vzOJmZsa2tsa2tua3FtbW5xampua2xvb250anpubW9wbG9ub25ya2hxYhi+xuCHkFOTqADRb7ravTSf2US/X5/Y6GPNf9L6+671Vr9oej3dMZLfKR2NtVTQZJw/xmEENU1LsQnBPrDpOTmncGOkj01rZqE6wekhZPo1qho6GJwEKZNzArlcs40FvLlzxqwAXhfJGSdcEUAFiJG8zEx2Pr02sWZx8+Vr/3/Uh+dTl35cRVI6fePocI9oW6arPX9bz/ZGDCsvAzLWh2MN03PCwAEXhIa3Q9teXig8zppusR/5ZnM3Sq/hUxQNN6vTsNQn1Tii7qLtH6LO6VEFYha+9BA/CqmBChBjzGcH5vT1+ztvV/vduX78yYvf+5N73cvT9kmZYZEZ3d7I7M1imJoYVoIlDozLXmNOAqR+qMKnWEnPpRZ8donmQzK6upqYNoQZKR8kVy3TUH+lG/i6bko9ZYpDSNxc+ARiFz7OA459gIsOYoyi0B5VOhped1P7yoS/99v+vP/BYH+ydzrj9OeJxHWSnL2DTDFKuWc85CqJkjIn5UPgWPc9M72U5S+TjHvzXSEiSYmSxYcC+1TsTdsOj6+ptNozwzj3hyBRgKKmcIpWAGIXvmSw5Ng9oALEqEnf3+nON69MpvycmZhx/PJecvfpkG6vJsdmTztLsjssyd7WRv/anuT1wXTtLTVRmtQhwscqCntRhhs/lTuDOsl4jDodyQPbRPygqTw3CYM3OXFWro9W4SWnAzuRQrjXYGJWXMRgsJ45G1AbIFYA5qqT9/XL8/8/fbW/df+L/fCw+UB8Or8xW5o4+X7jI24bGPpUNJLJxNrKFc9cmhuleS/HdCmVu1ox2B6nncfeJqgQiteRKQNw5Mh3OlWgxc4kKhZB2P64VhfyeI4MYhi+7mFxpTcwC9GPchZt88HPVfKiku9+vPb9QJ2/8tLYOvZr/6Z0J7b2hsvDCFk3wrrbGrput8Yx54SQZWLCmncywHuH3ZtYdDqZ+Kn7fcLP53Tm752j2HWdL5w6tjyHytQRS0KciTfK9BNiF77GsBpanzQQYyR5sbPEk813l23m45k/0z3b7E5//LGaTyQvwnBrPA7ngbuZ03/lggT+ln9uVs7t+zcpeac6hOJeXbKDW/NTUgvY1DyngumnuURkcTqoB4wa3czUz3XgKCCPH0Ke9BUKfkYTGV4XPmS4G7BQU4BYAaKnJnvqYtnS27379VcPvbOmn1/7kewNzZKanF+ttR4tz2Spn5WyK5hQrCXjFmWUjzqafrvJryOptwrv2yFtdMJxqJNf368uECVRoIUSPEdrl2+fiee2MpocbGWy4NxtYhdL5mFLhMh21ogVIAHUbtfmif2nW5ZTc+vzF7aPU88eDte+0z546EolfuT5xEiVbukqhW1CN1Q6P9nQthg72SsRTI97PzuFeDNrN2Wt4RWHgJwhRCdiIUMuLEDyCs7TxEqdq+DVSa1mTwXRiRSumwFiF77GsF/2eECMsa3tJKw9r7w/e3X31X//+cGMh7Z+/fraq83fzfwzX70yGcM61mD7MS99528Su9KGSTqFTg+KzCaGSI/D0ZxjstW9e2Q073C8h1NXp75oucgtnEZMTFop3FNLNqOATrbRZyICYhZ7iaGU+kNAjHHcEnL57M+9xORXD+1/3Jnv/rv0XGnHf/e1naDXRzvZbkBf5nEu152E5SBPP3hW9DLc1D5NNxTN4srfp/ChwiaEHJeukjqKxxdXjQmTMK2AX/Noi/zxJq9mGoHq4gkFmUqRBGIYS8bgatqmASpAjEa1xKeD8W599W7L7e+tnenPt4enNvfl6PlS2ufps3/STeYh0ZtM3E1Od0jWpH7FeAQdx/WXTrxGw5FKuHDT708m+ktwR6yCLxeQR8OSdLQRBer9GMIzuZwb11/TJNYKjXkAYhdL7gdk4CW7R0y6ChCjWYjN906b8fTmPVRmd/9dS59+67+2k3Z99p//eNafmWdnnfFha+zGZBzm/iazwaLxnJ9FYNS5oKuY8Ta6bxZqbKq8lnq0h8JrMoks12IPN7/DbJ6LFK0NMHL1rIZ7xZd9ptliF77GY8EFHA4xRkHq0W76j7ff61v3M3d863x9f8aWV+fvLxtnUdd3tr19khnt4bhZdBwKB3GqYztUFHOe8Entij2aK3uIq9O0fuOZy91rFqo4V74fgFYCybl8lorhur+hr56/Ks/HFqsAYhe+xrCf3dNBrAAx12lNjNJ8sdyk6s5D4y/61E2aJ5v3Yw2p0nNWa/Za3QqJWoUWz1x6cSqs1RvVc40FFXJFTP4Q47qDyNssyBo4UpeXcx/nkDxfptGXjoZY6ovHFhpTBmjvcMz1i6ZWBGIWvs449f9oI0BLAH4MsbMkfn79+d3KfJKcnfREPDw6vDl6cuR2e2/yTi6CDH3bWf3ssYYDlnGPOjuWYkb8W3qwyzpujLlL61fcalfrVLMytunNnrPWBL2X+KTDRMJ87DYHwYmNuOK2jfM/MXwAYhe+xkjDX5r+IMaYlxr69W1p5r9t7/ek7PxOWb9q/erD4/0Hhmyk9B4d7emaHraQB6A8gSKx5vJ8q1habywNRd6lP6UavRRe12nOSB827t5LSaxdcxC/6DTRGCRLjp1L9D0hzl5XoVjJVhFiF77OYMiRN6AxABJAjPN4ZSjz5yjPNKQzT2+/O1jTns/o/X85/H7He6cheHduZOZ54S0kRSLEmbnboCOrZ42Dw0ESauBRb7PlNTZQCrNm6ZM9/0y88BYOS45SM/nsPKOPcT0omqMbFJhHFgBeFz5kuC2DkgMVIMYlTtZWm2fnKV898PqX92wmbdMm+0/+vjhkPP/ZCYfXzXepoets0ZHXhKVXR94ohIP8OU5GHZWIcM5UseN9c1OKH2UnRw2Kw57hIcXvys/2V5a6jbiIosEf/EcLXrxNluU5hxVeFskZ931uVAdIoBMjalnk55OD/tevJH59KdNr6X++JXfrqMVmNbfoumqNUkJiPbVWS/rQKQkelm9/sJ2dO44Wh1I7i2xun64pm8OZ74y20H0WakCRm2k0zUx4hf6b5ZjhtLp0diOujw5wikaX5QViF0vGMMWbURpUgBh1t+VEfHutX+L7ah28f/n+yOz1+eFb+SwbStsJU1tHp31vXz+vja0h6R4frvoXIzQ8VGrbFl0mRzLls3X1T6Y445eun3Tuplm2nvcFW8KkIR5RQZCI8AwVIc4bb9MmlKsvE2IWvsZobqEiALEiIQFo61hv7ujZuz83nX+P75gPv72fvvazt+8xi/XYnB7bU9Pd0tIZKefqsal269QYyXiRdzFGjYZG7j5I0fkcdTQJQ35zspy3yhH35vwW/2/HHXp9PaTRwkW/cTGEv5JtfYqDb8w7x73sYhe+xnDdOs0CKkCMhtZ7ztK97Fd3Ng/++2rqZb+Z8x8PPrB7OTlRW/okUydl0oYaJ2rJmxO/tQ+pO+VZZkcLPs5ibXtq4qfDH+WaDPmwwb1MG7vQSGNd6lszZVva3S7KGUpm8baFk6fqCmIWS8ZgU9epAIYC9A4FJlQA1WGJa91k7+cvfv6YaTv6mXp65030ZmbKMDWxMteNxGVtaV7qXvJZ7+S67YUkTp4k7HetZdNWbsreXkvYGHLSzxrrN4ZlZCbHld4v53FvW5tsKfFx++XBfsPqqPSOfInopQp7XO/U9+bMYhdLtqGtsAPEWAEkqP5I8+nDi807F1v/SXf5yJfanUg8IBEZy7Bm+97xrswZ6fTQ3PD17She8CNvtJIdf7HIFzQfJZHX7fvjn29758nZ/tsw3usncSmxdn7aVSYsKOXDrjKjo9RhK9LTrnO+bQpiF77OsEQ5YBIgxihxLHrn62crWb1Nvtr3q+NHrj1Ne2f3cWL9YnX6d/3iTZiI4n40WDnevgOwYfeez5AzvBrNd5qdFoRZBJ38QU1Lrt5riKXP3vIcstuF+c1mJoJ/cr/5Gj2wzE/BIRrD/RA6YldcjmHztnx1tHggKUCsAKO8lhPtxSF/a+FPJ+3GZJpPb336PE8zaTNI8vnO6aZ+iwXZjUuFhO73umTZORve1dL1nNT43vvwtztCsmpyT06CEKqiwiQmDuLIe9J8Li7vDGspmEUL9fhsw07mcXoNXhY+ZLD+4awCKkAFiMiaHzm9dzCZYjNhuzUN59YH927/SbPfgq354HTrG0on9beZ6KpUOxkvRD9YevOlUerO7qxofS7hoz02Oz5Hr8IH2vr4pPGwnW6cZVvcwy+PS8CM6izRh+cyY0kLNqrSYVYOBGIXvu5hbvgBJYkK4PvhYNiZeH6nn6Y8e/O1sD9OPnmf/ti1tYem3tmqeXz1cHdtfrKEYdPlbDnJKqCNeDk/556LdC2JlMZkUbhVxRgJfu997W0m/jV9qq7DQ59vbwL7jNdwOefGvRFEM32Uh2IYS2SwwcigARWgAkStlHETnfvmvS+eP09//O3Zpx8/np7OO4fW1icT3YnNvXmP3h46e7PqLFom6q+supJ3bixDyy1a3K2DDn9pGQiRx/LOeud0UB6E0yuIUiN2gzoT4oJ7ThXRZDJVGgmu/HmUIGJXXR7j5ybirgADAFBHbePG119nu8mpfvbtv2drv358GHfChkW3XTLq6dBN1gS1Zp+0KFva+sSza93Obkpn7rLMdWT4ruO0LpJnvk/mqPW3kEmzoHM0i20v5DozA3UYBCa0NNdpeMN4wTrzPTETYha+zjB0dgs2nsaIMS7CodvbvtA/B8vslL/3HtgbX723CjYpvyxu5u606XtenF07brw0gO9FPt4Hn6/pekDz+tNtB3kYiQeJ22fSvFzJypmsh440EzQOBvmetndwGEQO7t7EgsZxPKdG6uo7p3IFXlfQYxhAneygAsRY2W9fmZ1+693L9x+PbSYff776T3fZND69P1vrPNizt5tedV6el+nuU6Mt6x0NJal321viyoP3FMQ6RAF2bgCv/OzOLXCBrn3Yx0Ec2qM+izybHXiN3VpF1pHQw1jKc4dhkKxiF0tkMGIhTQUkgAoQhPPclXXjof9P7thcWb98JW/bYjyxrP+dp4rNybIzWs9mSufNkhzinMO74yFcNfO67/3ItRuf1YrA5mVwq7uOTWggDznr06sYztzny6xnuX+dXipCMrHY85XiqXj3WXScVM6xsb1iF77OcJtUBpEgxhjEmJA/Fz0px3Y+nLz+dHqe8t1JpNmJ81dGy+nj7nxKqf65/N+vwoI7tPKZf+56yEHHBawDZsD68iMHmvydBiF8tx1UNjmsQdqZIvzUqqvJfefGK1l6FJsYddLpJIjsGF4XPmT42vLEkYgxmjzj5ubn6Mvfrz7WwbRh+D+nfecVZrXdbV5PBqqRnph8D/0chzBlxQ4xiHdov+NJoOF9bB6tQ6gULEc5eJdZM/W9mJrecxp6aio3oTKlYg+8L1z35IFn4nUZgoEJYhhLzmCRZtEBhYZYoSFK6c2278lN+9+fd9fma92N7Rcfe2ZdDPcn+w1pk327vWUmUp5a9d2pWCuG1WSjG/MVEP72UnCvg7CAwz6b05aRtt/lv75M5PeA+J42l3oZilfVU49yG7K9nS6ks/bWes5IVQFPZ2dTAAAAvQAAAAAAAHBE8UUGAAAAFvE3iiZucGptcGpqbHBtc290bHJudHZvbmZrbnBrbXJocWxyb3Nxbm52Z2IXS+7RVZPDKqjAiVETaj3pf42rz4JZn9pO+u/urF2/87Pzr632PJ1oQyKei/Vg7pc3hR/Nw+O+xAeVKSInOAEPFz/QSrpfWZe16f4QZ2cI8X6rdK3hcZrH3bycT7q6/RmkQ+yBXSUOwyZq6EsBYha+ZNy/WQNIADGqbDVuXm75dJH856floc8fbA6mXztiy03nFOOiPeXaWjd0uuO2Wron4Twl4ZFNn3/Orv62+MtE28GreSLIgusdNS7382zvtZMCkfjzj1Y10bnidXAzy7kk8BczfQuIrSnTB2++AWIWvuZh8YAWTFsgxpjYr+SpPHv5rPthJ72dHNx6uSVdXXv/7m+zTcpOp468r+R6HnDRMDsOUmMUBU6TtgluGVGn+lRZTjd4xfQQWdTKnsWZNwntpcm9pVtA1Wvl5aetp4vcDtXqJvjOuQFiFr7u8ebmLAAVwI/zlQ/rb7dSbGut+hn/Lg8d3r75derUs2dX404+1n+key2L7S4zUh4OJ4M5ylFQPb2PBmXfi4Qer8cefLEdBTqsFPwVvtn3OqNm8n8Jk8C0oQb2z6VPspCQuxNlhHMdNl8KYhdLxqCnpUYBYoyE+HF9Yu/qs+1fPDi18+Wfx+S/Np9vjSzW54tt4rTX7rt151zt+e9iGXdiuOa8c2n3y+CTFyJ1r4duLrAtyUXbJE5HA08XMpFHtcM5Xbq31vWP6uQFTfYlUY5dMp4LwpKHwZ+bAmIXvsZw41cGH4gxlu6c7v5IPPs+lmZ3lS8nf199u9cxjvrsD+u71tSE+aYWO4XoH09UK61/XfZ1IO921jos81CUQ8uYV5I7Pkto0H5Mez+FoqF0Wd6dibU1enIYCiESC6mkuyyIPpYbEFNiF77GsGXL0IMaDzFGkjJOv/nx3Rdfv+NXetm9efZ0P+3o0MdVgjYrtLQ2buJpxXgUSkI9eME8Hk6ZtzW+mzxO7fUyqeE4Pxm0hwO7stiBDhRbBd8XSH0zICi4J1Lm8wwSdeX4iV0zlqICYha+5nGi9QH+QIyxtb1987tn/v/tbGN/ar99P+XSx74vD+p03LcrE7/7Ras4fPKWts8y3tkqXT2QMqzNiZveO1/wgi6+j0tJ4F38tCHnwiwgYF/jUzQTPT04IYOP5etoh2fjVIjfCUVcei4ZYhe+zrDIVkPtNnICYoxiHHR8dPDPK4ePXm+3/90Z/tzPaV9PvmqunWydmryklPOXNZ7j8ppCGOphuhBenOQCHKxd2IcjipzonWYr+XG718XjGZ9D74LwYusCHUkflmiI8XSzujNmf2sfbh2dSQQOE2IXvmQw0IA5O5AAYgyb4pNfbeorMeVhc/bZrNM+rxxvV6z7lkspre89QzRJ69Rub5fvEM46kGfDJnOjf03D+FCOELHN+YJ4kuqGL69dnfDIpUdkMj2P9lUyVcMeQ5YuPq8sSXkUdAcg0CaHDQZiF0v0mBbZ4lwdVIAEoAHIUTbbi4O06Z98+sJ+meztvZU4/0o7exefUvNi3bL/4MRyMxIfLaP8+FkNx7u/nlqG3Ta5po4Vem8k7gypbae+827vPCL2lPc4izQ8pdo5P23Dbh62I6I3/4TMZMtrPavcP/FAYhdL7UFl6z7qrtRBAoixSdRD7+v7avLDzWjrFjs/bLslTaV/cfjSyb1byb43ehJc8jtLn7XcK1FWAz6WNr/qViOw3siwG4lo7PHkJIpmvlsjMSZZaUyFE2tKfe4Dzrlco7HZVW74A1eOKtoWRvYBYhdLzpC9Lek0oAIkeEQjW/qd2fxnfPJjt/e37P6y63Nz3KYbVy019Zfng2dW67leO5VO3dqxLvfDQaoYmuyM++YvujVx4B4bWCbk9+UkAh9vfA53j0NfWO0RCk/PHj1bSRgfk5AjCmsHp3XFQcdax7mDPQFiF77GMK3ODrNTAMRosJF4f3D5A76td8c29p5/nc6S9kzrZ7/46hZyjKaR9i30dPyMvaRbFyPi/d6vfHt4L3MF5h/CRWzSXOlpgYt0wsC+NP7GCTV5gomq1eqtXyI/ythsZ4L5gmJ7CbOaQgViFr7GsHRdLd9BFxNAlJEc2tt+7HF946zn5K1vsrf3zvqtHhni6My8fP1E5paes515kQf7lNVt92jZbxJ5+PYpWNOBavFIRbWNkQm55I+nMLcJ0yOX4T+jMFR0FB+tUBViB3PO20zWpIEsmdswQ8TsNhFiFr5kyEq2CkAFqABRUvXdjN21208T/+x+Ml9azeXW8d7Rl4meahYZrWzO0hkTqScnGyxnQ2hWA4x5uB+yvl5DBX+c64NoeOJYeI1LugjUr2ntOWTm400QZ8JGYYs8qGc1ZBwikNKqkJZQR6uLL2IXS8boBuYitgMMACBWgK6QrLQ76a7NntX++vuJxxlHJ7q7x8527Lie+8qxTu/oh5wcTjOXoU2QJ2ym87p/r2buiei8I3k9m009UTn93hgr5ztLwk1yWDZ2uc5IIqdwJhcPs6X88ObaL1TaMqWhP0tvJ3wDYhdL5sEo933XgHUAQANEldD3jnHlbJV4er75dXL7vQfv3Lryd3LjV/LGepEPbcj2mBj7pK4bqzOmTmLlet+g5cLaU/Oe3mycL+9vx4mTvdPk9Hhjw32rJxHzRG4oykcXk3lo50Wh7MEJm4/RBD/OZquIh+whBmIXvsZw2drKAQkgxlrbuZt+7/2L/vsPjT8vKT/1eOJpnHzQOuPtYgnDk4m/iWUJq7xFUpblPIyeCeNLwv69wzGN0UY/T7hlMPch5W/mlC5cWjtBB8393hfVQolQEKWQbOsX57jdYJvTA09j5tSPBmKXRo7Bco8vFBJABYhZU/v0fljdmZwfv9ck3jma6Hz6Y+0+tGO8GK2eBB/VGhstZeMlPl/27FYdktns6TFPX5XY0/qd9nwUafVcOQ0jXyZGYrEmHqpKkGq47ag1HNixVOyrkU2C1MODoHia1bMAYha+pKL8qosxVtd63Vie7qU/dOzq9odTj7yjz4s+fQ1b0LtwOaooIAwpHNa8jErePJ7o0zfUyWe69fFUGQ8fa3tixaYJp2AMmJoFMUZn6hV+MrZCLdEP+Z4vY2EYdwQzk/PMKmpuYldchsEP3m5ATBBjxBwn9uyO+IOp29++eprYS7/936d1rVMHO+df7siduzKG4/DvkMF1EqrO07goTvxZ8z3c3BP1LhErbFeH1eIWqOGKlNQooP6aGTphdxRTYCwmXrvML3F+qYJL0flcPABiF77OEIsOHGUxoMRYAdz6zFM2Zv56dtrv6XQ+7TM66T1lK7Ok/8fTxN8fTc/cHFX+WB2N2qQV/4LJhetS8NmF5f2623/LHfkpX7ySL0iHCk9S5PSkL3FKY06uss0irdsxO5QRPiKVzJl6neUBc2IXvsZgkV9UB8QYjXHqek57ljq6snHstT+b1ktbdzcvXZmYudF7aj7QLkX/FPZ8nMbiw7+yg9u7Qw6y/D2cwuDFqHm8jQlhCjp+uXY4hJGxsB21R1Evaaxo3ffGvTfMs7KiPRW6GmEMREdRRedDCQliF77G8LSvdQpijD4/O2w5GD2c7uqX2/Zvvpz98NHjvVcG1v9pQ5qd57upJW2ZfR94MO8pusFlnDOtDO/XZRiU2mXEgqpjLmH1tuhtuJ9L1QNEnvYyYvCsxl75rVx5LA4QtgM5b4ooZWLnB14XPsbw29o0ARUgRoLFGL3b/Ur2t4anj6MtX6TZfLJ3yVqGne/Z6MGq6xNT3SjxSX6/G0/X6+jSLB7DpUeSxLquOJ6eOCgHfP7NJ74KJJTvFvbIF3NnkQoSTwV/Xw/+LmDdlm6cdzpytA/CIwJiF77GoC3hxlM+iDEBxLnOh7S3Lo72/3maPhzq101vZ701nG/+27196cw8O5Q0c+dTDaYlmKmryCLl1OE+CjFrCZ7+8vWvRAbdCNfz43y7IspDYOI9sE45F6PIVqJVwlfsPQpp/cpVaCd1vCMXolOkOAJiFr7mYTc3vlpAI8Y4kpszm9H550T48tOfl9PnT9+1FLkyOfb87nFjYj8pH4fIvlOBXVL0AkIXzmrUE2KOggbPriF3TtbUzlWbUmkOZ7FETt4Ovew8ZKG5RftqHGozkz0ONNXbXn5qEV4XvmRM96sEUgWIkdVJ3Ptv+uBnn5f2D9t/mO9fXZ+Is5M5GbbMWOtTof84dA5Pn7anIbm2tOSYBKoow5BjfdSvQV3FRai9y8c78bdTvAbMCcLgvb6ndCKn85v2rG3J4hFPYxQnmtcwWx5NgsgsdSsBYhe+ZOTZhMxQTBUgRj21Cf/tvP93o7fe75+kTXx10u+vmdLd/D6Zm4l+0ermznjkdilBdIga9Jreva9bHj7BPnMq/1KEB7RAN9JS0WtKr3YIktlETjQKZASXB6fuOghxdKqQ8kHCy9G0NKAAYhe+xugjB+aAKIAKEGPibrKZ/ac2nm2fetx6vO/42t3+g+XprfPRPDkx7sh4at+6nTyeT+y8m0+OhmpIj2XHGViVi9Ylf3lgXK9v98nqMnQseBmMFXH1wV9dL7v1OtGwzJ+01T6UhrXl9pyHK47F8z0BXhfJGfRx+AcGABCjBNqu5d7VS8f/OdtqbE3//e7a20PW023mrU4lQ7F9XsZl63o2tRNJ+vfI4thb7xiTbWfU9vx5bGIf9PxmpOsYPGS03Mh3rHVyNXwZKSL2P1v56xCvi0iYSzqPUOdP47ZtWpgDYhdLxtB/04zsDZgJAMQ4dm0nNsnvyze3vr67/+zS/pf3erZehp0t3enl53xy7fBiNzTrExK9q8OjhdX5chBXWGR0tUVPfufqVM9yN7ROn546j3A+ih5BfChLBLa6dy4ovV9Gd1gaCqUQyJM5r1IVU9exGmIXS844lcKmRA0kgBgT2jl9+ix5fUn7s+8ZR58t73pPjqaeLpd+rPaeGc+V450zYTlssc6HVLf4Ti56vS3/TrKe/k7hoOtFeXBfrkfu5fQcnm/yOnt6HovOk6Y/ZqBmH7HyHF2urMQrAeJkcZXOG20EYhe+xiDOUMEYYgWIUfbyMfnvlev/pn3t8Zbt7PQ7s3Wn9/G/v7fWkiMxO6HqZ9a15FLaPdszOP788hbs3aKl/7kATy7gvMnjZbWDH8h1jHiauSMM/j46GOTGodi2ugfSTGVktNpWoxPJG1VviAheFz5ktN2m/ktABYixwnLwTr8fTnvnwfj+y8tXjEs91yX1Vu3M0L311XK62RM6RqITV/gn8yzsQfxFLWq5k48pmnt4Jv4fzYSN9Ms4fPL2EgeEMZ2MgwY9wKvZzeOUEr4v3gGJaLZ3R8spyU+bfGIXvsYwaKnWlh0JKkAFqABteGvDy9ftU28fsussX/lOz///f7XtfE1kcn/vnlji+nRyIu8kxy21e2fnp5hiy5oZOxM+NsyD6j+f7Qwd6yQTHLjZsny4oaPj3XyebTlfOJdw4spz30uNqlaZuUTHrptDzBGZSQ1iF77GePV1ooEYo89HOWXi082n786VnrujLNtP85drbmvUzd1O9c0OgjAeLrX25QTfzXChvj3XXwKp926L4QBKC2GBkCJz3OUlZOV5mfuD6RJIKiYaDDcx4ZBRxg+p7B48+hxRuHrGT2dnUwAEFMgAAAAAAABwRPFFBwAAAOp7PcwMZmlkdnJtcWtwcWwhXhceGd1o9YWSQIlR7VqJx8+XuskHjkzYzHo9bYqovFo945OTtM+u6q/JpC8lMvdo+aBYQOznGNpML7w2HGF3HrlhyO7rmcmJYMSPIBfRxuZxPEoa9kspv8KKSmrJ1E1cFtA5wi0BYlbcZoNmiVMISYxWWckwNX9xfLPPRbj9r9utvdxy9/avrU+fzrg2c/aYk2hwtwiEfc1hi4mkQ9IUT3qOa6fXOrqCIyYnb58YY22pE/iBcf9KthrMQ6rWGbOoRxeniBzdmjsuRM8vIpMqYhi+xnBrLTE5frQuOVxs253x7M+l6xfHx3Z7dkdn/kpZ9MiefhgNP9+3pR62XRahQeR1k/NhsCfZ3mpnJTkp0kDgrkmn8npgcmtOaSnftqatd8wKw0FO55TnqyiaX2nOM6UDYmIXS84wZ/kYSVUjASTQiF0fnu4eTM3q/9+PBz7N6jveO3T7lXRT/9Fr+bjxfLK3c6kt1tEoDj6yGhdvcSKXBD+zPp4k345astarnU1Xd/COpk3d7qZjuRGGhcV2s/CS9al8T6Rw8J5tKATbDUWSiZMcd+8d2AFiF77GeFYlxiaoABUghrPVKvjl5Pnb8Zknhx6++vRa2H3yleX7wdUqr/UOZvckTe72n9RxT7aYfr0Sa3u9p36qb+sTyzBRmSOaRX6pK/fHWgPzyYvXcupTYnfDQlcPPIxH9DAhS/GYFx7x4baOoZDrjABiF77O0FN10w0AxBiDeFjrhLRbrl0Yy4frH3WmPPhFuq3WPoPFmEjzckaUO9fj1BfDHONud/zZ6SzfHirTFkfO16d0XahaGeGbuc3Niu3RWa42IeSZVkiR7zGy3ydp8JIZulhT2C1qPWOq3iMEYha+zjDLD37rdMQBACQAzBPL+sNfHtv2OXlk++z3X3yxZfbT5ev9trb1U8U+/jStBtMvgom+JZmbhlwzxY0yW2g67eMQEhJqfBoWd8Po2JuYQfi9QP4097lMQtuC45tphVquxoag8xGIOY+xcLTn7gNiF77GULRWAKoGxNh22tqPe78+/Hv0eEi/nKyV/phMbPdaje7tmYwsd+vL7szU5XILaXuSY6n2eFB3nnI8QxSGabYWGwb5USiwRquYrTdwihSDwtxGTyx9gwnTpeDyHSRzC4fkSj6+ErYwAV4X6Rn332LjRQADAEgAcWge+E675Z/4/j/bVy976mNvsPzwg9zy6Xw87z7t2/1jOdk7SCYv6WLMPdp01k5Dp93YjXKr5SYbfzwzis3VprVghmdNysqlQi5djuSZYJrDiTAW3dMsGBVJnHWRhqH1GlNiFr7GmOU2uYw9MAAAdYwd1remnLbDT9e+Pl0sTy7bfJx18tRsYbxlKKvpKV1NCZN5SO7Mk4ndft22c7KjhpHySSVRDN+XnrDzx+6nplxD+NTygEqVvfAsrlLPDdtbIY9x6g9R0qP+3kyeNa1sPgRJAWYWy8tgqI/LdQMxRnI2pn+luXzw+jDD/kmfvrIt23zcv3/8fC2ROidP/hmbtnEhp+1mLW9x2EE3T30KfG9PYZ1FkrmzhdBf6iANcV3wi0P9JqpLytqodB2bchTLoqP0/CpSvdmPyDnn1iDTCmYCjwYwuQGcMAh8wzJQOQy/NKqLAWDr4ocvJ4XBdZy4Aw==',
            audioPlayer = new Audio(audiofile);
        _w.top.backNow = 0;
        audioPlayer.loop = true;
        _w.audioPlayer = audioPlayer;
        setInterval(function () {
            try {
                _w.jQuery.fn.viewer.Constructor.prototype.show = () => { };
            } catch (e) {
            }
        }, 1000);
        try {
            _w.unrivalScriptList.push('Fuck me please');
        } catch (e) {
            _w.unrivalScriptList = ['Fuck me please'];
        }
        function checkOffline() {
            let dleft = _d.getElementsByClassName('left');
            if (dleft.length == 1) {
                let img = dleft[0].getElementsByTagName('img');
                if (img.length == 1) {
                    if (img[0].src.indexOf('loading.gif') != -1) {
                        return true;
                    }
                }
            }
            return false;
        }
        setInterval(function () {
            if (checkOffline()) {
                setTimeout(function () {
                    if (checkOffline()) {
                        _l.reload();
                    }
                }, 10000)
            }
        }, 3000);
        _d.addEventListener('visibilitychange', function () {
            var c = 0;
            if (_w.top.backNow == 0) {
                _d.title = '⚠️请先激活挂机';
                return
            } else {
                _d.title = '学生学习页面';
            }
            if (_d.hidden) {
                audioPlayer.play();
                var timer = setInterval(function () {
                    if (c) {
                        _d.title = '🙈挂机中';
                        c = 0;
                    } else {
                        _d.title = '🙉挂机中';
                        c = 1;
                    }
                    if (!_d.hidden) {
                        clearInterval(timer);
                        _d.title = '学生学习页面';
                    }
                }, 1300);
            } else {
                audioPlayer.pause();
            }
        });
        _w.unrivalgetTeacherAjax = _w.getTeacherAjax;
        _w.getTeacherAjax = (courseid, classid, cid) => {
            if (cid == getQueryVariable('chapterId')) {
                return;
            }
            _w.top.unrivalPageRd = '';
            _w.unrivalgetTeacherAjax(courseid, classid, cid);
        }
        if (disableMonitor == 1) {
            _w.appendChild = _w.Element.prototype.appendChild;
            _w.Element.prototype.appendChild = function () {
                try {
                    if (arguments[0].src.indexOf('detect.chaoxing.com') > 0) {
                        return;
                    }
                } catch (e) { }
                _w.appendChild.apply(this, arguments);
            };
        }

        _w.jump = false;
        setInterval(function () {
            if (getQueryVariable('mooc2') == '1') {
                let tabs = _d.getElementsByClassName('posCatalog_select');
                for (let i = 0, l = tabs.length; i < l; i++) {
                    let tabId = tabs[i].getAttribute('id');
                    if (tabId.indexOf('cur') >= 0 && tabs[i].getAttribute('class') == 'posCatalog_select') {
                        tabs[i].setAttribute('onclick', "getTeacherAjax('" + courseId + "','" + classId +
                            "','" + tabId.replace('cur', '') + "');");
                    }
                }
            } else {
                let h4s = _d.getElementsByTagName('h4'),
                    h5s = _d.getElementsByTagName('h5');
                for (let i = 0, l = h4s.length; i < l; i++) {
                    if (h4s[i].getAttribute('id').indexOf('cur') >= 0) {
                        h4s[i].setAttribute('onclick', "getTeacherAjax('" + courseId + "','" + classId +
                            "','" + h4s[i].getAttribute('id').replace('cur', '') + "');");
                    }
                }
                for (let i = 0, l = h5s.length; i < l; i++) {
                    if (h5s[i].getAttribute('id').indexOf('cur') >= 0) {
                        h5s[i].setAttribute('onclick', "getTeacherAjax('" + courseId + "','" + classId +
                            "','" + h5s[i].getAttribute('id').replace('cur', '') + "');");
                    }
                }
            }
        }, 1000);
        setInterval(function () {
            let but = null;
            if (_w.jump) {
                _w.jump = false;
                _w.top.unrivalDoneWorkId = '';
                _w.jjump = (rd) => {
                    if (rd != _w.top.unrivalPageRd) {
                        return;
                    }
                    try {
                        setTimeout(function () {
                            if (jumpType == 1) {
                                if (getQueryVariable('mooc2') == '1') {
                                    but = _d.getElementsByClassName(
                                        'jb_btn jb_btn_92 fs14 prev_next next');
                                } else {
                                    but = _d.getElementsByClassName('orientationright');
                                }
                                try {
                                    setTimeout(function () {
                                        if (rd != _w.top.unrivalPageRd) {
                                            return;
                                        }
                                        but[0].click();
                                    }, 2000);
                                } catch (e) { }
                                return;
                            }
                            if (getQueryVariable('mooc2') == '1') {
                                let ul = _d.getElementsByClassName('prev_ul')[0],
                                    lis = ul.getElementsByTagName('li');
                                for (let i = 0, l = lis.length; i < l; i++) {
                                    if (lis[i].getAttribute('class') == 'active') {
                                        if (i + 1 >= l) {
                                            break;
                                        } else {
                                            try {
                                                lis[i + 1].click();
                                            } catch (e) { }
                                            return;
                                        }
                                    }
                                }
                                let tabs = _d.getElementsByClassName('posCatalog_select');
                                for (let i = 0, l = tabs.length; i < l; i++) {
                                    if (tabs[i].getAttribute('class') ==
                                        'posCatalog_select posCatalog_active') {
                                        while (i + 1 < tabs.length) {
                                            let nextTab = tabs[i + 1];
                                            if ((nextTab.innerHTML.includes(
                                                'icon_Completed prevTips') && _w.top
                                                    .unrivalReviewMode == '0') || nextTab
                                                        .innerHTML.includes(
                                                            'catalog_points_er prevTips')) {
                                                i++;
                                                continue;
                                            }
                                            if (nextTab.id.indexOf('cur') < 0) {
                                                i++;
                                                continue;
                                            }
                                            let clickF = setInterval(function () {
                                                if (rd != _w.top.unrivalPageRd) {
                                                    clearInterval(clickF);
                                                    return;
                                                }
                                                nextTab.click();
                                            }, 2000);
                                            break;
                                        }
                                        break;
                                    }
                                }
                            } else {
                                let div = _d.getElementsByClassName('tabtags')[0],
                                    spans = div.getElementsByTagName('span');
                                for (let i = 0, l = spans.length; i < l; i++) {
                                    if (spans[i].getAttribute('class').indexOf('currents') >=
                                        0) {
                                        if (i + 1 == l) {
                                            break;
                                        } else {
                                            try {
                                                spans[i + 1].click();
                                            } catch (e) { }
                                            return;
                                        }
                                    }
                                }
                                let tabs = _d.getElementsByTagName('span'),
                                    newTabs = [];
                                for (let i = 0, l = tabs.length; i < l; i++) {
                                    if (tabs[i].getAttribute('style') != null && tabs[i]
                                        .getAttribute('style').indexOf(
                                            'cursor:pointer;height:18px;') >= 0) {
                                        newTabs.push(tabs[i]);
                                    }
                                }
                                tabs = newTabs;
                                for (let i = 0, l = tabs.length; i < l; i++) {
                                    if (tabs[i].parentNode.getAttribute('class') ==
                                        'currents') {
                                        while (i + 1 < tabs.length) {
                                            let nextTab = tabs[i + 1].parentNode;
                                            if ((nextTab.innerHTML.includes(
                                                'roundpoint  blue') && _w.top
                                                    .unrivalReviewMode == '0') || nextTab
                                                        .innerHTML.includes('roundpointStudent  lock')
                                            ) {
                                                i++;
                                                continue;
                                            }
                                            if (nextTab.id.indexOf('cur') < 0) {
                                                i++;
                                                continue;
                                            }
                                            let clickF = setInterval(function () {
                                                if (rd != _w.top.unrivalPageRd) {
                                                    clearInterval(clickF);
                                                    return;
                                                }
                                                nextTab.click();
                                            }, 2000);
                                            break;
                                        }
                                        break;
                                    }
                                }
                            }
                        }, 2000);
                    } catch (e) { }
                }
                _w.onReadComplete1();
                setTimeout('jjump("' + _w.top.unrivalPageRd + '")', 2856);
            }
        }, 200);
    } else if (_l.href.indexOf("work/phone/doHomeWork") > 0) {
        var wIdE = _d.getElementById('workLibraryId') || _d.getElementById('oldWorkId'),
            wid = wIdE.value;
        _w.top.unrivalWorkDone = false;
        _w.aalert = _w.alert;
        _w.alert = (msg) => {
            if (msg == '保存成功') {
                _w.top.unrivalDoneWorkId = getQueryVariable('workId');
                return;
            }
            aalert(msg);
        }
        if (_w.top.unrivalDoneWorkId == getQueryVariable('workId')) {
            _w.top.unrivalWorkDone = true;
            return;
        }
        _w.confirm = (msg) => {
            return true;
        }
        var questionList = [],
            questionsElement = _d.getElementsByClassName('Py-mian1'),
            questionNum = questionsElement.length,
            totalQuestionNum = questionNum;
        for (let i = 0; i < questionNum; i++) {
            let questionElement = questionsElement[i],
                idElements = questionElement.getElementsByTagName('input'),
                questionId = '0',
                question = questionElement.getElementsByClassName('Py-m1-title fs16')[0].innerHTML;
            question = handleImgs(question).replace(/(<([^>]+)>)/ig, '').replace(/[0-9]{1,3}.\[(.*?)\]/ig, '').replaceAll('\n',
                '').replace(/^\s+/ig, '').replace(/\s+$/ig, '');
            for (let z = 0, k = idElements.length; z < k; z++) {
                try {
                    if (idElements[z].getAttribute('name').indexOf('answer') >= 0) {
                        questionId = idElements[z].getAttribute('name').replace('type', '');
                        break;
                    }
                } catch (e) {
                    console.log(e);
                    continue;
                }
            }
            if (questionId == '0' || question == '') {
                continue;
            }
            typeE = questionElement.getElementsByTagName('input');
            if (typeE == null || typeE == []) {
                continue;
            }
            let typeN = 'fuckme';
            for (let g = 0, h = typeE.length; g < h; g++) {
                if (typeE[g].id == 'answertype' + questionId.replace('answer', '').replace('check', '')) {
                    typeN = typeE[g].value;
                    break;
                }
            }
            if (['0', '1', '3'].indexOf(typeN) < 0) {
                continue;
            }
            type = {
                '0': '单选题',
                '1': '多选题',
                '3': '判断题'
            }[typeN];
            let optionList = {
                length: 0
            };
            if (['单选题', '多选题'].indexOf(type) >= 0) {
                let answersElements = questionElement.getElementsByClassName('answerList')[0].getElementsByTagName(
                    'li');
                for (let x = 0, j = answersElements.length; x < j; x++) {
                    let optionE = answersElements[x],
                        optionTextE = trim(optionE.innerHTML.replace(/(^\s*)|(\s*$)/g, "")),
                        optionText = optionTextE.slice(1).replace(/(^\s*)|(\s*$)/g, ""),
                        optionValue = optionTextE.slice(0, 1),
                        optionId = optionE.getAttribute('id-param');
                    if (optionText == '') {
                        break;
                    }
                    optionList[optionText] = {
                        'id': optionId,
                        'value': optionValue
                    }
                    optionList.length++;
                }
                if (answersElements.length != optionList.length) {
                    continue;
                }
            }
            questionList.push({
                'question': question,
                'type': type,
                'questionid': questionId,
                'options': optionList
            });
        }
        var qu = null,
            nowTime = -4000,
            busyThread = questionList.length,
            ctOnload = function (res, quu) {
                busyThread -= 1;
                var ctResult = {
                    'code': -1,
                    'finalUrl': '',
                    'data': '未找到答案'
                };
                if (res) {
                    try {
                        var responseText = res.responseText,
                            ctResult = JSON.parse(responseText);
                    } catch (e) {
                        console.log(e);
                        if (res.finalUrl.includes('getAnswer.php')) {
                            _w.top.unrivalWorkInfo = '查题错误，服务器连接失败';
                            return;
                        }
                    }
                }
                try {
                    let choiceEs = _d.getElementsByTagName('li');
                    if (ctResult['code'] == -1 ) {
                        try {
                            if (ctResult['msg'] !== undefined) {
                                _w.top.unrivalWorkInfo = ctResult['msg'] ;
                            }
                        } catch (e) { }
                        busyThread += 1;
                        GM_xmlhttpRequest({
                            method: "GET",
                            headers: {
                                'Authorization': token,
                            },
                            timeout: 6000,
                            url: host + 'chaoXing/v3/getAnswer.php?tm=' + encodeURIComponent(quu['question']
                                .replace(/(^\s*)|(\s*$)/g, '')) + '&type=' + {
                                    '单选题': '0',
                                    '多选题': '1',
                                    '判断题': '3'
                                }[quu['type']] + '&wid=' + wid + '&courseid=' + courseId,
                            onload: function (res) {
                                ctOnload(res, quu);
                            },
                            onerror: function (err) {
                                _w.top.unrivalWorkInfo = '查题错误，服务器连接失败';
                                console.log(err);
                                busyThread -= 1;
                            },
                            ontimeout: function (err) {
                                _w.top.unrivalWorkInfo = '查题错误，服务器连接失败';
                                console.log(err);
                                busyThread -= 1;
                            }
                        });
                        return;
                    }
                    try {
                        var result = ctResult['data'];
                    } catch (e) {
                        _w.top.unrivalWorkInfo = '答案解析失败';
                        return;
                    }
                    _w.top.unrivalWorkInfo = '题目：' + quu['question'] + '：' + result;
                    switch (quu['type']) {
                        case '判断题':
                            (function () {
                                let answer = 'abaabaaba';
                                if ('正确是对√Tri'.indexOf(result) >= 0) {
                                    answer = 'true';
                                } else if ('错误否错×Fwr'.indexOf(result) >= 0) {
                                    answer = 'false';
                                }
                                for (let u = 0, k = choiceEs.length; u < k; u++) {
                                    if (choiceEs[u].getAttribute('val-param') ==
                                        answer && choiceEs[u].getAttribute(
                                            'id-param') == quu['questionid'].replace(
                                                'answer', '')) {
                                        choiceEs[u].click();
                                        questionNum -= 1;
                                        return;
                                    }
                                }
                                if (randomDo == 1 && accuracy < 100) {
                                    _w.top.unrivalWorkInfo = quu['question'] +
                                        '：未找到正确答案，自动选【错】';
                                    for (let u = 0, k = choiceEs.length; u <
                                        k; u++) {
                                        if (choiceEs[u].getElementsByTagName('em')
                                            .length < 1) {
                                            continue;
                                        }
                                        if (choiceEs[u].getAttribute('val-param') ==
                                            'false' && choiceEs[u].getAttribute(
                                                'id-param') == quu['questionid']
                                                    .replace('answer', '')) {
                                            choiceEs[u].click();
                                            return;
                                        }
                                    }
                                }
                            })();
                            break;
                        case '单选题':
                            (function () {
                                let answerData = result;
                                for (let option in quu['options']) {
                                    if (trim(option).replace(/\s/ig, '') == trim(answerData).replace(/\s/ig, '') || trim(
                                        option).replace(/\s/ig, '').includes(trim(answerData).replace(/\s/ig, '')) ||
                                        trim(answerData).replace(/\s/ig, '').includes(trim(option).replace(/\s/ig, ''))) {
                                        for (let y = 0, j = choiceEs.length; y <
                                            j; y++) {
                                            if (choiceEs[y].getElementsByTagName(
                                                'em').length < 1) {
                                                continue;
                                            }
                                            if (choiceEs[y].getElementsByTagName(
                                                'em')[0].getAttribute(
                                                    'id-param') == quu['options'][
                                                    option
                                                    ]['value'] && choiceEs[y]
                                                        .getAttribute('id-param') == quu[
                                                            'questionid'].replace('answer',
                                                                '')) {
                                                if (!choiceEs[y].getAttribute(
                                                    'class').includes('cur')) {
                                                    choiceEs[y].click();
                                                }
                                                questionNum -= 1;
                                                return;
                                            }
                                        }
                                    }
                                }
                                if (randomDo == 1 && accuracy < 100) {
                                    _w.top.unrivalWorkInfo = quu['question'] +
                                        '：未找到正确答案，自动选【B】';
                                    for (let y = 0, j = choiceEs.length; y <
                                        j; y++) {
                                        if (choiceEs[y].getElementsByTagName('em')
                                            .length < 1) {
                                            continue;
                                        }
                                        if (choiceEs[y].getElementsByTagName('em')[
                                            0].getAttribute('id-param') ==
                                            'B' && choiceEs[y].getAttribute(
                                                'id-param') == quu['questionid']
                                                    .replace('answer', '')) {
                                            if (!choiceEs[y].getAttribute('class')
                                                .includes('cur')) {
                                                choiceEs[y].click();
                                            }
                                            return;
                                        }
                                    }
                                }
                            })();
                            break;
                        case '多选题':
                            (function () {
                                let answerData = trim(result).replace(/\s/ig, ''),
                                    hasAnswer = false;
                                for (let option in quu['options']) {
                                    if (answerData.includes(trim(option).replace(/\s/ig, ''))) {
                                        for (let y = 0, j = choiceEs.length; y <
                                            j; y++) {
                                            if (choiceEs[y].getElementsByTagName(
                                                'em').length < 1) {
                                                continue;
                                            }
                                            if (choiceEs[y].getElementsByTagName(
                                                'em')[0].getAttribute(
                                                    'id-param') == quu['options'][
                                                    option
                                                    ]['value'] && choiceEs[y]
                                                        .getAttribute('id-param') == quu[
                                                            'questionid'].replace('answer',
                                                                '')) {
                                                if (!choiceEs[y].getAttribute(
                                                    'class').includes('cur')) {
                                                    choiceEs[y].click();
                                                }
                                                hasAnswer = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (hasAnswer) {
                                    questionNum -= 1;
                                } else if (randomDo == 1 && accuracy < 100) {
                                    _w.top.unrivalWorkInfo = quu['question'] +
                                        '：未找到正确答案，自动全选';
                                    for (let y = 0, j = choiceEs.length; y <
                                        j; y++) {
                                        if (choiceEs[y].getElementsByTagName('em')
                                            .length < 1) {
                                            continue;
                                        }
                                        if (choiceEs[y].getAttribute('id-param') ==
                                            quu['questionid'].replace('answer', '')
                                        ) {
                                            if (!choiceEs[y].getAttribute('class')
                                                .includes('cur')) {
                                                choiceEs[y].click();
                                            }
                                        }
                                    }
                                }
                            })();
                            break;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        for (let i = 0, l = questionList.length; i < l; i++) {
            nowTime += parseInt(Math.random() * 2000 + 2500, 10);
            setTimeout(function () {
                qu = questionList[i];
                let param = 'question=' + encodeURIComponent(
                    qu['question']);
                if (ctUrl.includes('icodef')) {
                    param += '&type=' + {
                        '单选题': '0',
                        '多选题': '1',
                        '判断题': '3'
                    }[qu['type']] + '&id=' + wid;
                }
                GM_xmlhttpRequest({
                    method: "POST",
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        'Authorization': token,
                    },
                    url: ctUrl,
                    timeout: 2000,
                    data: param,
                    onload: function (res) {
                        ctOnload(res, qu);
                    },
                    onerror: function () {
                        ctOnload(false, qu);
                    },
                    ontimeout: function () {
                        ctOnload(false, qu);
                    }
                });
            }, nowTime);
        }
        var workInterval = setInterval(function () {
            if (busyThread != 0) {
                return;
            }
            clearInterval(workInterval);
            if (Math.floor((totalQuestionNum - questionNum) / totalQuestionNum) * 100 >= accuracy && _w.top
                .unrivalAutoSubmit == '1') {
                _w.top.unrivalDoneWorkId = getQueryVariable('workId');
                _w.top.unrivalWorkInfo = '正确率符合标准，已提交答案';
                setTimeout(function () {
                    submitCheckTimes();
                    escapeBlank()
                    submitAction()
                    //	setTimeout(function() {
                    //          document.querySelector(".cx_alert-blue").click()
                    //	}, parseInt(1000));
                }, parseInt(Math.random() * 2000 + 3000, 10));

            } else if (_w.top.unrivalAutoSave == 1) {
                _w.top.unrivalWorkInfo = '正确率不符合标准或未设置自动提交，已自动保存答案';
                if (Math.floor((totalQuestionNum - questionNum) / totalQuestionNum) >= 0) {
                    setTimeout(function () {
                        _w.top.unrivalDoneWorkId = getQueryVariable('workId');
                        _w.noSubmit();
                    }, 2000);
                }
            } else {
                _w.top.unrivalWorkInfo = '用户设置为不自动保存答案，请手动提交或保存作业';
            }
        }, 1000);
    } else if (_l.href.includes('work/phone/selectWorkQuestionYiPiYue')) {
        _w.top.unrivalWorkDone = true;
        _w.top.unrivalDoneWorkId = getQueryVariable('workId');
    } else if (_l.href.includes('stat2-ans.chaoxing.com/task/s/index')) {
        if (_w.top == _w) {
            return;
        }
        _d.getElementsByClassName('page-container studentStatistic')[0].setAttribute('class', 'studentStatistic');
        _d.getElementsByClassName('page-item item-task-list minHeight390')[0].remove();
        _d.getElementsByClassName('subNav clearfix')[0].remove();
        setInterval(function () {
            _l.reload();
        }, 90000);
    } else if (_l.href.includes('passport2.') && _l.href.includes('login?refer=http') && autoLogin == 1) {
        if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
            alert('自动登录的手机号填写错误，无法登陆')
            return;
        }
        if (password == '') {
            alert('未填写登录密码，无法登陆')
            return;
        }
        GM_xmlhttpRequest({
            method: "get",
            url: 'https://passport2-api.chaoxing.com/v11/loginregister?cx_xxt_passport=json&uname=' +
                phoneNumber + '&code=' + encodeURIComponent(password),
            onload: function (res) {
                try {
                    let ispass = JSON.parse(res.responseText);
                    if (ispass['status']) {
                        _l.href = decodeURIComponent(getQueryVariable('refer'));
                    } else {
                        alert(ispass['mes']);
                    }
                } catch (err) {
                    console.log(res.responseText);
                    alert('登陆失败');
                }
            },
            onerror: function (err) {
                alert('登陆错误');
            }
        });
    } else if (_l.href.includes('unrivalxxtbackground')) {
        _d.getElementsByTagName("html")[0].innerHTML = `
    <!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>学习通挂机小助手</title>
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
        <link href="https://z.chaoxing.com/yanshi/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="row" style="margin: 10px;">
            <div class="col-md-6 col-md-offset-3">
                <div class="header clearfix">
                    <h3 class="text-muted" style="margin-top: 20px;margin-bottom: 0;float: left;">学习通挂机小助手&ensp;</h3>
                </div>
                <hr style="margin-top: 10px;margin-bottom: 20px;">
                <div class="panel panel-info">
                    <div class="panel-heading">任务列表</div>
                    <div class="panel-body" id='joblist'>
                    </div>
                </div>
                <div class="panel panel-info">
                    <div class="panel-heading">运行日志</div>
                    <div class="panel-body">
                        <div id="result" style="overflow:auto;line-height: 30px;">
                            <div id="log">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
    `;
        var logs = {
            "logArry": [],
            "addLog": function (str, color = "black") {
                if (this.logArry.length >= 50) {
                    this.logArry.splice(0, 1);
                }
                var nowTime = new Date(),
                    nowHour = (Array(2).join(0) + nowTime.getHours()).slice(-2),
                    nowMin = (Array(2).join(0) + nowTime.getMinutes()).slice(-2),
                    nowSec = (Array(2).join(0) + nowTime.getSeconds()).slice(-2),
                    logElement = _d.getElementById('log'),
                    logStr = "";
                this.logArry.push("<span style='color: " + color + "'>[" + nowHour + ":" + nowMin + ":" +
                    nowSec + "] " + str + "</span>");
                for (let logI = 0, logLen = this.logArry.length; logI < logLen; logI++) {
                    logStr += this.logArry[logI] + "<br>";
                }
                _d.getElementById('log').innerHTML = logStr;
                logElement.scrollTop = logElement.scrollHeight;
            }
        };
        logs.addLog('此页面不必保持在最前端，后台会自动进行任务', 'green');
        setInterval(function () {
            logs.addLog('此页面不必保持在最前端，后台会自动进行任务', 'green');
            logs.addLog('如想禁用后台刷视频功能，请关闭脚本并重启浏览器', 'blue');
        }, 120000)
        GM_addValueChangeListener('unrivalxxtbackgroundinfo', function (name, old_value, new_value, remote) {
            if (old_value != new_value) {
                logs.addLog(new_value);
            }
        });
        setInterval(function () {
            if (Math.round(new Date() / 1000) - parseInt(GM_getValue('unrivalBackgroundVideoEnable', '6')) >
                15) {
                logs.addLog('超星挂机小助手可能运行异常，如页面无反应，请尝试重启脚本猫或重启浏览器(脚本猫0.9.0版本有此问题)');
            }
        }, 10000);
        var loopShow = () => {
            let jobList = GM_getValue('unrivalBackgroundList', '1');
            if (jobList == '1') {
                _d.getElementById('joblist').innerHTML = '请将“超星挂机小助手”升级到最新版并重启浏览器';
            } else {
                try {
                    let jobHtml = '';
                    for (let i = 0, l = jobList.length; i < l; i++) {
                        let status = '';
                        if (jobList[i]['done']) {
                            status = '已完成';
                        } else if (parseInt(jobList[i]['playTime']) > 0) {
                            status = '进行中';
                        } else {
                            status = '等待中';
                        }
                        if (jobList[i]['review']) {
                            status += '：复习模式';
                        }
                        jobHtml += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    ` + '[' + status + ']' + jobList[i]['name'] + `
                                </div>
                            </div>`
                    }
                    _d.getElementById('joblist').innerHTML = jobHtml;
                } catch (e) {
                    _d.getElementById('joblist').innerHTML = '请将“超星挂机小助手”升级到最新版并重启浏览器！';
                }
            }
        }
        loopShow();
        setInterval(loopShow, 10000);
    }
})();