// ==UserScript==
// @name         XRoman学习通助手
// @namespace    XRoman
// @version      6.0
// @description  🌹支持超星视频、文档、答题、取消视频文件加载，✨提高学习效率,💫每日功能测试，在发现问题前就解决问题，防清进度，无不良记录
// @author       XRoman
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
// @original-author XRoman
// @original-license GPL-3.0-or-later
//如果脚本提示添加安全网址，请将脚本提示内容填写到下方区域，一行一个，如果不会，请加群询问



//安全网址请填写在上方空白区域
// @downloadURL https://update.greasyfork.org/scripts/488765/XRoman%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/488765/XRoman%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(() => {
    var token = GM_getValue('tikutoken'),
        jumpType = 1, // 0:智能模式，1:遍历模式，2:不跳转，如果智能模式出现无限跳转/不跳转情况，请切换为遍历模式
        disableMonitor = 0, // 0:无操作，1:解除多端学习监控，开启此功能后可以多端学习，不会被强制下线。
        accuracy = 60, //章节测试正确率百分比，在答题正确率在规定之上并且允许自动提交时才会提交答案
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
        var tikutoken=GM_getValue("tikutoken")
        if(tikutoken==null){
            tikutoken=""
        }
        var base222 = `data:image/jpeg;base64,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FPHp6W8guSwIU8cD65oA+2aKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooADyMGqkenWcUxmjtLdJScl1jAb88VbooAKKKKACiiigDD8Q+LNC8OvGmt6pa2byfdWWQAn8K1NPvrbUbSO5sZ457eQZWSNgykfWvh79qPSNcPxVv7i5t7iS0mRDbMqll27cYH4g17x+yPp2r2Hw6n/teOaKKa5Z7ZJc5C4AJGe2aAPcaKKKACsTxxcJaeD9ankyFSzlJI7fKa264r403bWXwt8Szx7dy2bjn3GKAPzjlO6RiOhJNfol8BLRrP4ReGo3TYxtt5H1JOf1r87IxudR6kCv0v8Ahxaiz8BeH4FJISxiGT/uigDo6KKKACviL9sW1EHxSimWPb59lGxb+8QSP8K+3a+QP217PZ4k0C6BOHtnQj0w3/16AKH7F935Xj3VbbzMedZEhP7xDA19nCvhL9ku7MHxftIwOJ7eVCfT5c/0r7toAKKKKAOY+JunSar4A1+yhJEs1nIqkeu2vzWbdDMR0ZTiv1OmjWWJ43GVYFSPY1+dHxS8Far4c8datYvYzmE3DPC6oSrIxyMfnQB9y/BnXB4h+Gmg3+7dIbZY5D/tL8p/lXaV5L+y/pOoaR8J7GLVI2ikllklSNxhlQnjP869aoAKKKKAGSxRzRskqK6MMFWGQaitLK1s1K2lvFCD1EaBc/lViigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCG4tbe5AFxBFLjpvQNj86lVQihVAVR0AGAKWigAooooAK4n40aHc+I/hnrumWKs11LBmNV6sVIOPxxXbUUAfmt4a8E69qnie00uLS7sTtMqsGiICjPJJ9K/SDTLYWenW1svSKJUH4DFTLDErlljQMe4UZp9ABRRRQAV88ftgeEtQ1zw5pmqaZbSXLWMjLKka5YIw64+or6HoIBBBAIPY0AfDv7LnhHWJvifZak9pcW9pZK7ySOpUE7SAvv1r7ipkUMcQIijVAeu0Yp9ABRRRQAVDPaW9wytPBFKy9C6AkfnU1FACKoVQqgADoBS0UUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH/9m4Svc/AAAAACAde7IZ/1OH6geqxT3fRUY=`


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
                                 <div style="padding: 0;font-size: 20px;float: left;">题库Token：</div>
                                <input type="text" id="token" style="width: 150px;" value="`+tikutoken+`">
                                 <a id='updateToken' class="btn btn-default" >保存</a>

                                 <br/>
                                 关注微信公众号：一之哥哥，发送 “token” 领取你的token，可以提高答题并发数量。<br/>

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
                        if(token.length==16){
                            logs.addLog('一之哥哥题库token已更新为' +token, 'green');
                        }else{

                            logs.addLog('请检查一之哥哥题库token', 'green');
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