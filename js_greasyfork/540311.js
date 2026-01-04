// ==UserScript==
// @name        🕗🕗▶️ZeRoTool超星学习通全自动小助手🎦▶️▶️
// @namespace    ZeRoTool
// @version      1.0
// @description  🌹支持超星学习通视频、文档、答题、章节测试，✨提高自动化操作。自定义设置运行模式，课答题也可不答题，视频全自动调任务点。
// @author       ZeRoTool
// @run-at       document-end
// @storageName  XRoman
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
// @connect      up.gomooc.net
// @downloadURL https://update.greasyfork.org/scripts/540311/%F0%9F%95%97%F0%9F%95%97%E2%96%B6%EF%B8%8FZeRoTool%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%85%A8%E8%87%AA%E5%8A%A8%E5%B0%8F%E5%8A%A9%E6%89%8B%F0%9F%8E%A6%E2%96%B6%EF%B8%8F%E2%96%B6%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/540311/%F0%9F%95%97%F0%9F%95%97%E2%96%B6%EF%B8%8FZeRoTool%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%85%A8%E8%87%AA%E5%8A%A8%E5%B0%8F%E5%8A%A9%E6%89%8B%F0%9F%8E%A6%E2%96%B6%EF%B8%8F%E2%96%B6%EF%B8%8F.meta.js
// ==/UserScript==
(() => {
    var token = GM_getValue('tikutoken'),
        jumpType = 1, // 0:智能模式，1:遍历模式，2:不跳转，如果智能模式出现无限跳转/不跳转情况，请切换为遍历模式
        disableMonitor = 0, // 0:无操作，1:解除多端学习监控，开启此功能后可以多端学习，不会被强制下线。
        accuracy = 60, //章节测试正确率百分比，在答题正确率在规定之上并且允许自动提交时才会提交答案
        randomDo = 0, //将0改为1，找不到答案的单选、多选、判断就会自动选【B、ABCD、错】，只在规定正确率不为100%时才生效
        backGround = 0, //是否对接超星挂机小助手，需要先安装对应脚本
        //-----------------------------------------------------------------------------------------------------
        autoLogin = 0, //掉线是否自动登录，1为自动登录，需要配置登录信息（仅支持手机号+密码登陆）
        phoneNumber = '', //自动登录的手机号，填写在单引号之间。
        password = ''; //自动登录的密码，填写在单引号之间。
    //-----------------------------------------------------------------------------------------------------
    var host = 'http://14.29.190.187:54223/',
        rate = GM_getValue('unrivalrate', '1'),
        ctUrl = 'https://up.gomooc.net/tkapi4.php',
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
        var tikutoken=GM_getValue("tikutoken")
        if(tikutoken==null){
            tikutoken=""
        }
        var base222 = `data:image/jpeg;base64,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`
        _d.getElementsByTagName("html")[0].innerHTML = `

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>ZeRoTool学习通小助手</title>
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
        <link href="https://z.chaoxing.com/yanshi/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="row" style="margin: 10px;">
            <div class="col-md-6 col-md-offset-3">
                <div class="header clearfix">
                    <h3 class="text-muted" style="margin-top: 20px;margin-bottom: 0;float: left;"><a href="https://docs.mooc.win/studydocs.html" target="view_window">ZeRoTool学习通小助手v1.0&ensp;</a></h3><div id="onlineNum"></div>
                </div>
                <hr style="margin-top: 10px;margin-bottom: 20px;">
                <div class="panel panel-info" id="normalQuery">
                    <div class="panel-heading">任务配置</div>
                    <div class="panel-body">
                        <div>
                                 开启倍数是会清进度的，不建议开启，除非是真的没时间了才开启倍数<br/>
                            <div style="padding: 0;font-size: 20px;float: left;">视频倍速：</div>

                            <div>
                                <input type="number" id="unrivalRate" style="width: 80px;">
                                &ensp;
                                <a id='updateRateButton' class="btn btn-default">保存</a>
                                &nbsp;|&nbsp;
                                <a id='reviewModeButton' class="btn btn-default">复习模式</a>
                                &nbsp;|&nbsp;
                                <!-- <a id='videoTimeButton' class="btn btn-default">查看学习进度</a> -->
                                &nbsp;|&nbsp;
                                <a id='fuckMeModeButton' class="btn btn-default" href="https://scriptcat.org/script-show-page/379" target="view_window">后台挂机</a>
                                &nbsp;
                               <a id='backGround' class="btn btn-default" target="view_window">激活挂机</a>
                            </div>

                            <br>
                            <div style="padding: 0;font-size: 20px;float: left;">章节测试：</div>

                            <a id='autoDoWorkButton' class="btn btn-default">自动答题</a>&nbsp;|&nbsp;
                            <a id='autoSubmitButton' class="btn btn-default">自动提交</a>&nbsp;|&nbsp;
                            <a id='autoSaveButton' class="btn btn-default">自动保存</a>

                            <div  style=" margin-top: 10px;">
                                 <div style="padding: 0;font-size: 20px;float: left;">题库密钥Token：</div>
                                <input type="text" id="token" style="width: 150px;" value="`+tikutoken+`">
                                 <a id='updateToken' class="btn btn-default" >保存</a>

                                 <br/>
                                 关注微信小程序：蛋就司的终端，免费领取你的密钥Token，可以提高答题并发数量。<br/>

                                <div class="panel-body">
                                    <img src="`+ base222 + `" alt="Smiley face" width="120" height="120">
                                    <p>这个版本修复一些细节问题<p/>
                                    <p>还有后台一直有人反馈题库问题，后面作者将对接更多题库提高准确率<p/>
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
                                <span style="color: red">[00:00:00]如果此提示不消失，说明页面出现了错误，请联系作者</span>
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
                        if(token.length==32){
                            logs.addLog('ZeRo题库token已更新为' +token, 'green');
                        }else{

                            logs.addLog('请检查ZeRo题库token', 'green');
                        }
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
                            logs.addLog('视频倍速已更新为' + urate + '倍，将在3秒内生效', 'green');
                        } else {
                            logs.addLog('奇怪的倍速，将会自动跳过视频任务', 'orange');
                        }
                    }
                    _d.getElementById('backGround').onclick = function () {
                        logs.addLog('挂机激活成功，您现在可以最小化页面了', 'green');
                        _d.getElementById('backGround').setAttribute('class', 'btn btn-success');
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
                            logs.addLog('自动做章节测试已开启，将会自动做章节测试', 'green');
                            GM_setValue('unrivaldowork', '1');
                            _w.top.unrivalDoWork = '1';
                        } else {
                            _d.getElementById('autoDoWorkButton').setAttribute('class', 'btn btn-default');
                            logs.addLog('自动做章节测试已关闭，将不会自动做章节测试', 'green');
                            GM_setValue('unrivaldowork', '0');
                            _w.top.unrivalDoWork = '0';
                        }
                    }
                    _d.getElementById('autoSubmitButton').onclick = function () {
                        let autoSubmitButton = _d.getElementById('autoSubmitButton');
                        if (autoSubmitButton.getAttribute('class') == 'btn btn-default') {
                            _d.getElementById('autoSubmitButton').setAttribute('class', 'btn btn-success');
                            logs.addLog('符合提交标准的章节测试将会自动提交', 'green');
                            GM_setValue('unrivalautosubmit', '1');
                            _w.top.unrivalAutoSubmit = '1';
                        } else {
                            _d.getElementById('autoSubmitButton').setAttribute('class', 'btn btn-default');
                            logs.addLog('章节测试将不会自动提交', 'green');
                            GM_setValue('unrivalautosubmit', '0');
                            _w.top.unrivalAutoSubmit = '0';
                        }
                    }
                    _d.getElementById('autoSaveButton').onclick = function () {
                        let autoSaveButton = _d.getElementById('autoSaveButton');
                        if (autoSaveButton.getAttribute('class') == 'btn btn-default') {
                            _d.getElementById('autoSaveButton').setAttribute('class', 'btn btn-success');
                            logs.addLog('不符合提交标准的章节测试将会自动保存', 'green');
                            GM_setValue('unrivalautosave', '1');
                            _w.top.unrivalAutoSave = '1';
                        } else {
                            _d.getElementById('autoSaveButton').setAttribute('class', 'btn btn-default');
                            logs.addLog('不符合提交标准的章节测试将不会自动保存，等待用户自己操作', 'green');
                            GM_setValue('unrivalautosave', '0');
                            _w.top.unrivalAutoSave = '0';
                        }
                    }
                 /*   _d.getElementById('videoTimeButton').onclick = function () {
                        _d.getElementById('videoTime').style.display = 'block';
                        _d.getElementById('videoTimeContent').src = _p +
                            '//stat2-ans.chaoxing.com/task/s/index?courseid=' + courseId + '&clazzid=' +
                            classId;
                    }*/
                }
            }, 100),
            loopjob = () => {
                if (_w.top.unrivalScriptList.length > 1) {
                    logs.addLog('您同时开启了多个刷课脚本，会挂科，会挂科，会挂科，会挂科，会挂科，会挂科，会挂科，会挂科', 'red');
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
                                '推荐使用<a href="/" target="view_window">谷歌或者火狐浏览器</a>运行此脚本，使用其他脚本管理器不保证能正常运行',
                                'orange');
                        }
                        if (_w.top.unrivalReviewMode == '1') {
                            logs.addLog('复习模式已开启，遇到已完成的视频任务不会跳过', 'green');
                            _d.getElementById('reviewModeButton').setAttribute('class', ['btn btn-default',
                                'btn btn-success'
                            ][_w.top.unrivalReviewMode]);
                        }
                        if (_w.top.unrivalDoWork == '1') {
                            logs.addLog('自动做章节测试已开启，将会自动做章节测试', 'green');
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
                        logs.addLog('您已安装超星挂机小助手，但此课程可能为闯关模式，不支持后台挂机，将为您在线完成', 'blue');
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
                logs.addLog('开始刷视频：' + item['name'] + '，倍速：' + String(rate) + '倍');
                logs.addLog('视频观看信息每60秒上报一次，请耐心等待', 'green');
                logs.addLog('如遇脚本使用异常情况，请检查脚本版本是否为最新版，<a href="https://docs.mooc.win/studydocs.html" target="view_window">点我(脚本猫)</a>或<a href="https://greasyfork.org/zh-CN/scripts/462748" target="view_window">点我(greasyfork)</a>检查', 'orange');
                if (disableMonitor) {
                    logs.addLog('解除多端学习监控有清除进度风险，请谨慎使用', 'orange');
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
                        } else if (item['doublespeed'] == 0 && rate > 1 && _w.top.unrivalReviewMode == '0') {
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
                                            if (timelong[UID]['time'] / 60 > 22 &&
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
                logs.addLog('开始刷章节测试：' + item['name']);
                logs.addLog('您设置的答题正确率为：' + String(accuracy) + '%，只有在高于此正确率时才会提交测试', 'blue');
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
            'data:audio/ogg;base64,T2dnUwACAAAAAAAAAABwRPFFAAAAAGFtEqwBHgF2b3JiaXMAAAAAAUAfAAAAAAAAUHgAAAAAAACZAU9nZ1MAAAAAAAAAAAAAcETxRQEAAAA7J4IBDP8F////////////tQN2b3JiaXMvAAAAWGlwaC5PcmcgbGliVm9yYmlzIEkgMjAxNDAxMjIgKFR1cnBha8OkcsOkamlpbikGAAAAJQAAAEVOQ09ERVI9U291bmQgU3R1ZGlvLCBsaWJWb3JiaXMgMS4zLjEbAAAAQUxCVU0gQVJUSVNUPUFkdmVudHVyZSBMYW5kFAAAAEFMQlVNPUFkdmVudHVyZSBMYW5kIQAAAEVOQ09ESU5HIEFQUExJQ0FUSU9OPVNvdW5kIFN0dWRpbxUAAABBUlRJU1Q9QWR2ZW50dXJlIExhbmQjAAAAVElUTEU9RW1wdHkgTG9vcCBGb3IgSlMgUGVyZm9ybWFuY2UBBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJC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',

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
                               // _w.top.unrivalWorkInfo = ctResult['msg'] ;
                                _w.top.unrivalWorkInfo = '题目：' + quu['question'] + '：未搜索到答案';
                            }
                        } catch (e) {

                        }
                       // busyThread += 1;
                      /**  GM_xmlhttpRequest({
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
                        }); **/
                        return;
                    }
                    else if(ctResult['code'] == -2){
                         _w.top.unrivalWorkInfo = ctResult['msg'];
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
            nowTime += parseInt(Math.random() * 3000 + 3500, 10);
            setTimeout(function () {
                qu = questionList[i];
                var token = GM_getValue("tikutoken")
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
                      // 'Authorization': token,
                    },
                    url: ctUrl,
                   // key: token,
                    //key: GM_getValue('tikutoken'),
                    timeout: 2000,
                    data: param + '&key=' + GM_getValue('tikutoken'),
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
        <title>ZeRoTool学习通挂机小助手</title>
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
                logs.addLog('超星挂机小助手可能运行异常，如页面无反应，请尝试重启脚本或重启浏览器(推荐谷歌火狐浏览器)');
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
                    _d.getElementById('joblist').innerHTML = '请将“ZeRoTool超星挂机小助手”升级到最新版并重启浏览器！';
                }
            }
        }
        loopShow();
        setInterval(loopShow, 10000);
    }
})();