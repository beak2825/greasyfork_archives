// ==UserScript==
// @name         None学习通
// @namespace    None
// @version      3.1 
// @description  ▶▶▶上次更新：2023.12.26◀◀◀【💻可最小化💻】🆒支持超星视频、文档、答题、自定义正确率、掉线自动登录🤘取消视频文件加载，多开也不占用网速，放心追剧🍊自定义答题正确率，提高学习效率🍆每日功能测试，在发现问题前就解决问题，防清进度，无不良记录
// @author       None
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
// @downloadURL https://update.greasyfork.org/scripts/483135/None%E5%AD%A6%E4%B9%A0%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/483135/None%E5%AD%A6%E4%B9%A0%E9%80%9A.meta.js
// ==/UserScript==
(() => {
  //  var token = 'dampmQGPizKmgwAI', //关注微信公众号：一之哥哥，发送 “token” 领取你的token，填写在两个单引号中间并保存，可以提高答题并发数量。
   var token = GM_getValue('tikutoken'),
        jumpType = 1, // 0:智能模式，1:遍历模式，2:不跳转，如果智能模式出现无限跳转/不跳转情况，请切换为遍历模式
        disableMonitor = 0, // 0:无操作，1:解除多端学习监控，开启此功能后可以多端学习，不会被强制下线。
        accuracy = 0, //章节测试正确率百分比，在答题正确率在规定之上并且允许自动提交时才会提交答案
        randomDo = 1, //将0改为1，找不到答案的单选、多选、判断就会自动选【B、ABCD、错】，只在规定正确率不为100%时才生效
        backGround = 0, //是否对接超星挂机小助手，需要先安装对应脚本
        //-----------------------------------------------------------------------------------------------------
        autoLogin = 0, //掉线是否自动登录，1为自动登录，需要配置登录信息（仅支持手机号+密码登陆）
        phoneNumber = '', //自动登录的手机号，填写在单引号之间。
        password = ''; //自动登录的密码，填写在单引号之间。
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
        <title>学习通小助手</title>
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
        <link href="https://z.chaoxing.com/yanshi/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="row" style="margin: 10px;">
            <div class="col-md-6 col-md-offset-3">
                <div class="header clearfix">
                    <h3 class="text-muted" style="margin-top: 20px;margin-bottom: 0;float: left;"><a href="https://scriptcat.org/script-show-page/336" target="view_window">学习通小助手v1.0&ensp;</a></h3><div id="onlineNum"></div>
                </div>
                <hr style="margin-top: 10px;margin-bottom: 20px;">
                <div class="panel panel-info" id="normalQuery">
                    <div class="panel-heading">任务配置</div>
                    <div class="panel-body">
                        <div>
                        
                            



                            <div style="padding: 0;font-size: 20px;float: left;">视频倍速：</div>

                            <div>
                                <input type="number" id="unrivalRate" style="width: 80px;">
                                &ensp;
                                <a id='updateRateButton' class="btn btn-default">保存</a>
                                &nbsp;|&nbsp;
                                <a id='reviewModeButton' class="btn btn-default">复习模式</a>
                                &nbsp;|&nbsp;
                                <a id='videoTimeButton' class="btn btn-default">查看学习进度</a>
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
                                 <div style="padding: 0;font-size: 20px;float: left;">题库Token：</div>
                                <input type="text" id="token" style="width: 150px;" value="`+GM_getValue("tikutoken")+`">
                                 <a id='updateToken' class="btn btn-default" >保存</a>
                                 
                                 <br/>
                                 关注微信公众号：一之哥哥，发送 “token” 领取你的token，填写在两个单引号中间并保存，可以提高答题并发数量。<br/>
                                 (哥哥，乱填无效的)

                                <div class="panel-body">
                                    <img src="`+ base222 + `" alt="Smiley face" width="120" height="120">
                                    <p>放个微信码在这，希望从哥哥姐姐们手里收到零零碎碎的小费<p/>
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
                           logs.addLog('题库token已更新为' +token, 'green');
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
                                '推荐使用<a href="https://docs.scriptcat.org/use/#%E5%AE%89%E8%A3%85%E6%89%A9%E5%B1%95" target="view_window">脚本猫</a>运行此脚本，使用其他脚本管理器不保证能正常运行',
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
                logs.addLog('如遇脚本使用异常情况，请检查脚本版本是否为最新版，<a href="https://scriptcat.org/script-show-page/878" target="view_window">点我(脚本猫)</a>或<a href="https://greasyfork.org/zh-CN/scripts/462748" target="view_window">点我(greasyfork)</a>检查', 'orange');
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
                        _d.title = '🙈挂只因中';
                        c = 0;
                    } else {
                        _d.title = '🙉挂只因中';
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