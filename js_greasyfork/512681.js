// ==UserScript==
// @name          ❤ 超星学习通任务助手 -> 正则改|完全免费|视频-章节测试|自动挂机|防清进度|不占资源
// @namespace    tsezy
// @version      1.1
// @description  本次更新：可在全局配置界面自定义设置跳转模式、多端学习监控、正确率百分比、随机答题等功能 | 修复章节测试时不显示界面，延时关闭测试界面以便用户查看得分详细 | 美化运行日志界面
// @author       tsezy
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
// @connect      117.72.91.182
// @connect      cx.icodef.com
// @license      GPL-3.0-or-later
// @original-script https://scriptcat.org/script-show-page/878/
// @original-author unrival
// @original-license GPL-3.0-or-later



// @downloadURL https://update.greasyfork.org/scripts/512681/%E2%9D%A4%20%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BB%BB%E5%8A%A1%E5%8A%A9%E6%89%8B%20-%3E%20%E6%AD%A3%E5%88%99%E6%94%B9%7C%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9%7C%E8%A7%86%E9%A2%91-%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%7C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%7C%E9%98%B2%E6%B8%85%E8%BF%9B%E5%BA%A6%7C%E4%B8%8D%E5%8D%A0%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/512681/%E2%9D%A4%20%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BB%BB%E5%8A%A1%E5%8A%A9%E6%89%8B%20-%3E%20%E6%AD%A3%E5%88%99%E6%94%B9%7C%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9%7C%E8%A7%86%E9%A2%91-%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%7C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%7C%E9%98%B2%E6%B8%85%E8%BF%9B%E5%BA%A6%7C%E4%B8%8D%E5%8D%A0%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==
(() => {
   var token = GM_getValue('tikutoken', "无"),
        jumpType = GM_getValue('jumpType', 1),
        disableMonitor = GM_getValue('set_disable', 0),
        accuracy =GM_getValue('set_accuracy', 90),
        randomDo = GM_getValue('set_random', 0),
        backGround = 0, //是否对接超星挂机小助手，需要先安装对应脚本
        //-----------------------------------------------------------------------------------------------------
        autoLogin = 0, //掉线是否自动登录，1为自动登录，需要配置登录信息（仅支持手机号+密码登陆）
        phoneNumber = '', //自动登录的手机号，填写在单引号之间。
        password = ''; //自动登录的密码，填写在单引号之间。
    //-----------------------------------------------------------------------------------------------------
    var host = 'http://14.29.190.187:54223/',
        rate = GM_getValue('unrivalrate', '1'),
        ctUrl = 'http://117.72.91.182/search',
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
        var base_gzh = `data:image/jpeg;base64,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`

        _d.getElementsByTagName("html")[0].innerHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>学习通小助手</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome (用于图标) -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Google Fonts (自定义字体) -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Pacifico&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container my-5">
        <!-- Header -->
        <div class="header" style="padding: 30px 0; text-align: center; background: linear-gradient(135deg, #ffffff, #e3f2fd); border-bottom: 1px solid #e0e0e0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative;">
            <h1 style="font-family: 'Pacifico', cursive; font-size: 2.5rem; color: #0d6efd; margin: 0; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-graduation-cap" style="margin-right: 10px; font-size: 1.5rem; /* 旋转动画替代方案 */ transition: transform 0.1s linear;" id="rotateIcon"></i> 学习通任务助手
            </h1>
            <p style="font-size: 1rem; color: #6c757d; margin-top: 10px;">帮助提升您的学习效率</p>
        </div>
        <hr>

        <!-- Tabs Navigation -->
        <ul class="nav nav-tabs mt-4" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="config-tab" data-bs-toggle="tab" data-bs-target="#config" type="button" role="tab" aria-controls="config" aria-selected="true">
                    <i class="fas fa-cogs"></i> 任务配置
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="jobs-tab" data-bs-toggle="tab" data-bs-target="#jobs" type="button" role="tab" aria-controls="jobs" aria-selected="false">
                    <i class="fas fa-tasks"></i> 任务管理
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="progress-tab" data-bs-toggle="tab" data-bs-target="#progress" type="button" role="tab" aria-controls="progress" aria-selected="false">
                    <i class="fas fa-chart-line"></i> 学习进度
                </button>
            </li>
        </ul>

        <!-- Tabs Content -->
        <div class="tab-content">
            <!-- 任务配置 Tab -->
            <div class="tab-pane fade show active" id="config" role="tabpanel" aria-labelledby="config-tab">
                <div class="card mt-4">
                    <div class="card-header bg-light text-dark">全局配置</div>
                    <div class="card-body">
                        <div class="mb-4">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label"><i class="fas fa-video"></i> 视频倍数：</label>
                                    <input type="number" id="unrivalRate" class="form-control" min="0.5" max="3" step="0.1" value="1">
                                    <div class="form-text">Tips：有些课程视频观看时长也在一定分数，请谨慎设置</div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label"><i class="fas fa-random"></i> 跳转模式：</label>
                                    <select id="jumpType" class="form-select">
                                        <option value="0">智能模式</option>
                                        <option value="1" selected="selected">遍历模式</option>
                                        <option value="2">不跳转</option>
                                    </select>
                                    <div class="form-text">Tips：如果智能模式出现无限跳转/不跳转情况，请切换为遍历模式</div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label"><i class="fas fa-eye"></i> 多端学习监控：</label>
                                    <select id="disableMonitor" class="form-select">
                                        <option value="0" selected="selected">不解除</option>
                                        <option value="1">解除</option>
                                    </select>
                                    <div class="form-text">Tips：开启此功能后可以多端学习，不会被强制下线。</div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label"><i class="fas fa-check-circle"></i> 正确率百分比：</label>
                                    <input type="number" id="accuracy" class="form-control" min="0" max="100" value="">
                                    <div class="form-text">Tips：章节测试正确率百分比，在答题正确率在规定之上并且允许自动提交时才会提交答案。</div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="token" class="form-label"><i class="fas fa-key"></i> 题库Token：</label>
                                    <input type="text" id="token" class="form-control form-control-custom input-limited" value="` + GM_getValue("tikutoken") + `">
                                    <div class="form-text">Tips：关注微信公众号：校园小子，发送 “token” 领取你的token</div>
                                    <img src="` + base_gzh + `" alt="微信公众号二维码" style="width: 150px; height: 150px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                                </div>
                                <div class="col-md-6">
                                    <label class="form-label"><i class="fas fa-question-circle"></i> 随机答题：</label>
                                    <select id="randomDo" class="form-select">
                                        <option value="0" selected="selected">关闭</option>
                                        <option value="1">开启</option>
                                    </select>
                                    <div class="form-text">Tips：找不到答案的单选、多选、判断就会自动选【B、ABCD、错】，只在规定正确率不为100%时才生效。</div>
                                </div>
                            </div>
                            <div class="text-end mt-4">
                                <button id="resetDefaults" class="btn btn-secondary me-2">恢复默认</button>
                                <button id="updateRateButton" class="btn btn-primary">保存</button>
                            </div>
                        </div>
                        <hr>
                        <div class="mb-4">
                            <label class="form-label"><i class="fas fa-book"></i> 章节测试：</label><br>
                            <button id="autoDoWorkButton" class="btn btn-outline-primary btn-custom"><i class="fas fa-robot"></i> 自动答题</button>
                            <button id="autoSubmitButton" class="btn btn-outline-primary btn-custom"><i class="fas fa-paper-plane"></i> 自动提交</button>
                            <button id="autoSaveButton" class="btn btn-outline-primary btn-custom"><i class="fas fa-save"></i> 自动保存</button>
                            <div style="margin-top: 10px;">
                                <button id="reviewModeButton" class="btn btn-outline-secondary btn-custom"><i class="fas fa-redo"></i> 复习模式</button>
                                <button id="videoTimeButton" class="btn btn-outline-secondary btn-custom"><i class="fas fa-eye"></i> 查看学习进度</button>
                                <a id="fuckMeModeButton" class="btn btn-outline-secondary btn-custom" href="https://scriptcat.org/script-show-page/379" target="_blank">
                                    <i class="fas fa-desktop"></i> 后台挂机
                                </a>
                                <button id="backGround" class="btn btn-outline-secondary btn-custom"><i class="fas fa-play-circle"></i> 激活挂机</button>
                            </div>
                        </div>

                        <!-- 运行日志卡片 -->
                        <div class="card mt-4">
                            <div class="card-header bg-light text-dark">运行日志</div>
                            <div class="card-body">
                                <div id="result">
                                    <div id="log" style="background-color: #1e1e1e; color: #d4d4d4; font-family: 'Courier New', Courier, monospace; padding: 15px; border-radius: 5px; max-height: 300px; overflow-y: auto; white-space: pre-wrap; border: 1px solid #333;">
                                        <span>[00:00:00] 如果此提示不消失，说明页面出现了错误，请联系作者</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 章节测试面板 -->
                        <div class="card mt-4" id="workPanel" style="display: none;">
                            <div class="card-header bg-light text-dark">章节测试</div>
                            <div class="card-body">
                                <iframe id="frame_content" name="frame_content" src="" style="width: 100%; height: 800px; border: none; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);"></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 任务管理 Tab -->
                <div class="tab-pane fade" id="jobs" role="tabpanel" aria-labelledby="jobs-tab">
                    <div class="card mt-4">
                        <div class="card-header bg-light text-dark">任务列表</div>
                        <div class="card-body" id="joblist">
                        </div>
                    </div>
                </div>

                <!-- 学习进度 Tab -->
                <div class="tab-pane fade" id="progress" role="tabpanel" aria-labelledby="progress-tab">
                    <div class="card mt-4" id="videoTimePanel">
                        <div class="card-header bg-light text-dark">学习进度</div>
                        <div class="card-body">
                            <iframe id="videoTimeContent" src="" style=" width: 100%; height: 400px; border: none; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);"></iframe>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer" style="text-align: center; margin-top: 40px; padding: 30px; background-color: #ffffff; border-top: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 -1px 3px rgba(0,0,0,0.05);">
                <!-- <img src="` + base_gzh + `" alt="作者头像" style="border-radius: 50%; margin-bottom: 20px; width: 120px; height: 120px; object-fit: cover;"> -->
                <p>代码并非全部原创 基于完善和修改</p>
                <!-- <p>Github：<a href="https://github.com/xh212" target="_blank">xh212</a></p> -->
            </div>
        </div>
    </body>
</html>
`;
        var logs = {
            "logArry": [],
            "addLog": function (str, color = "white") {
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

                    // 实现标签切换功能
                    const tabButtons = _d.querySelectorAll('.nav-link');
                    const tabPanes = _d.querySelectorAll('.tab-pane');
                    tabButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            tabButtons.forEach(btn => btn.classList.remove('active'));
                            this.classList.add('active');

                            // 隐藏所有标签内容
                            tabPanes.forEach(pane => pane.classList.remove('show', 'active'));

                            // 显示当前标签内容
                            const target = _d.querySelector(this.getAttribute('data-bs-target'));
                            target.classList.add('show', 'active');
                        });
                    });

                    // 切换学习进度和章节测试面板
                    _d.getElementById('videoTimeButton').addEventListener('click', function() {
                        _d.getElementById('videoTimePanel').style.display = 'block';
                        _d.getElementById('workPanel').style.display = 'none';
                        // 切换到“学习进度”标签
                        const progressTab = document.querySelector('button[data-bs-target="#progress"]');
                        if (progressTab) {
                            tabButtons.forEach(btn => btn.classList.remove('active'));
                            progressTab.classList.add('active');
                        }
                        // _d.getElementById('videoTime').style.display = 'block';
                        _d.getElementById('videoTimeContent').src = _p +
                            '//stat2-ans.chaoxing.com/task/s/index?courseid=' + courseId + '&clazzid=' +
                            classId;
                        tabPanes.forEach(pane => pane.classList.remove('show', 'active'));
                        _d.getElementById('progress').classList.add('show', 'active');
                    });

                    // 初始化配置
                    _d.getElementById('unrivalRate').value = rate;
                    _d.getElementById("jumpType").value = jumpType;
                    _d.getElementById('disableMonitor').value = disableMonitor;
                    _d.getElementById("accuracy").value = accuracy;
                    _d.getElementById('randomDo').value = randomDo;

                    _d.getElementById('resetDefaults').onclick = function () {
                        _d.getElementById('unrivalRate').value = 1;
                        _d.getElementById("jumpType").value = 1;
                        _d.getElementById('disableMonitor').value = 0;
                        _d.getElementById("accuracy").value = 90;
                        _d.getElementById('randomDo').value = 0;
                    }
                    _d.getElementById('updateRateButton').onclick = function () {
                        // TKEON
                        var token = _d.getElementById('token').value;
                        GM_setValue('tikutoken', token);
                        // 跳转类型
                        var jumpType  = _d.getElementById('jumpType').value;
                        GM_setValue('jumpType', jumpType );
                        // 多端监控
                        var disableMonitor = _d.getElementById('disableMonitor').value;
                        GM_setValue('set_disable', disableMonitor);
                        // 提交率
                        var accuracy = _d.getElementById('accuracy').value;
                        GM_setValue('set_accuracy', accuracy);
                        // 随机答题
                        var randomDo = _d.getElementById('randomDo').value;
                        GM_setValue('set_random', randomDo);
                        // 视频倍速
                        let urate = _d.getElementById('unrivalRate').value;
                        if (parseFloat(urate) == parseInt(urate)) {
                            urate = parseInt(urate);
                        } else {
                            urate = parseFloat(urate);
                        }
                        GM_setValue('unrivalrate', urate);
                        rate = urate;
                        logs.addLog('保存配置成功！', 'green');
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
                logs.addLog('如遇脚本使用异常情况，请检查脚本版本是否为最新版，<a href="https://greasyfork.org/zh-CN/scripts/512681" target="view_window">点我检查</a>', 'orange');
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
//                        _d.getElementById('workPanel').style.display = 'none';
//                        _d.getElementById('frame_content').src = '';
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
                        if (ctResult['msg'] !== undefined) {
                            _w.top.unrivalWorkInfo = ctResult['msg'] ;
                        }else {
                            _w.top.unrivalWorkInfo = "获取题库错误";
                        }
                        return;
                    }
                    try {
                        var result = ctResult['answer'];
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
                var data = {
                    "question": qu['question'],  // 题目文本
                    "token": token  // 用户 token
                };

                GM_xmlhttpRequest({
                    method: "POST",
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                    },
                    url: ctUrl,
                    timeout: 2000,
                    data: new URLSearchParams(data).toString(),
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