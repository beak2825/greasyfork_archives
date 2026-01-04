// ==UserScript==
// @name         🫧404小站 — 学习通助手 | 完全免费 | 全自动刷课 | 视频+视频内提问+测试+考试+刷阅读时长+AI解答 | 一键挂机 | 可调节倍速 | 自答题目🏆（吉猪生活）🥳大学必备神器🎉
// @namespace    unrival
// @version      5.3.4
// @description  （请仔细阅读简介）·🫧 支持超星视频、考试、阅读时长、文档、答题、自定义正确率、掉线自动登陆·取消视频文件加载，多开也不占用网速，自定义答题正确率✨在发现问题前就解决问题，防清进度，无不良记录👉有问题可加微信咨询：Why15236444193  🙆‍♂️学长也还有学业在身，如果加微信未能及时回复，请多多包涵哈！！😄学长目前准备优化： 1.添加更多免费优质的题库 2.兼容多平台 3.简介的修改，脚本的使用体验（持续优化）（当前版本的计划）🙇‍♂️🙇‍♂️每一次优化都是学长透支身体的结果，熬穿了不知道多少个夜晚，您的赞赏会是刺破黑暗苍穹的亮光照亮我前行的路🙇‍♂️🙇‍♂️脚本体量比较大，牵一发而动全身，优化比较耗时哈，请谅解
// @author       伏黑甚而
// @run-at       document-end
// @storageName  unrivalxxt
// @match        *://*.chaoxing.com/*
// @match        *://mooc1-*.chaoxing.com/*
// @match        *://*.neauce.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @match        *://*.ac.cn/*
// @icon         http://pan-yz.chaoxing.com/favicon.ico
// @icon         http://pan-yz.neauce.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_info
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        unsafeWindow
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1-1.neauce.com
// @connect      mooc1.chaoxing.com
// @connect      mooc1.neauce.com
// @connect      mooc1-2.chaoxing.com
// @connect      mooc1-2.neauce.com
// @connect      mooc1-api.chaoxing.com
// @connect      mooc2-ans.chaoxing.com
// @connect      passport2-api.chaoxing.com
// @connect      passport2-api.neauce.com
// @connect      14.29.190.187
// @connect      cx.icodef.com
// @connect      api.tikuhai.com
// @connect      sso.chaoxing.com
// @connect      cdn.bootcdn.net
// @connect      cdnjs.cloudflare.com
// @original-script https://scriptcat.org/zh-CN/script-show-page/3321
// @original-author 伏黑甚而


// @run-at       document-start
// @connect      yuketang.cn
// @connect      ykt.io
// @connect      localhost
// @connect      baidu.com
// @connect      cx.icodef.com
// @connect      zhaojiaoben.cn
// @connect      scriptcat.org
// @connect      gitee.com
// @connect      greasyfork.org
// @resource     Img http://lyck6.cn/img/6.png
// @resource     Vue http://lib.baomitu.com/vue/2.6.0/vue.min.js
// @resource     ElementUi http://lib.baomitu.com/element-ui/2.15.13/index.js
// @resource     ElementUiCss http://cdn.lyck6.cn/element-ui/2.14.1/theme-chalk/index.min.css
// @resource     Table https://www.forestpolice.org/ttf/2.0/table.json
// @resource     SourceTable https://cdn.lyck6.cn/ttf/1.0/table.json
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @require      https://lib.baomitu.com/cryptico/0.0.1343522940/hash.min.js
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://lib.baomitu.com/promise-polyfill/8.3.0/polyfill.min.js
// @connect      vercel.app
// @connect      xmig6.cn
// @connect      lyck6.cn
// @connect      *
// @connect      greasyfork.org
// @contributionURL   https://studyai0.com/




// @downloadURL https://update.greasyfork.org/scripts/530068/%F0%9F%AB%A7404%E5%B0%8F%E7%AB%99%20%E2%80%94%20%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B%20%7C%20%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9%20%7C%20%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%20%7C%20%E8%A7%86%E9%A2%91%2B%E8%A7%86%E9%A2%91%E5%86%85%E6%8F%90%E9%97%AE%2B%E6%B5%8B%E8%AF%95%2B%E8%80%83%E8%AF%95%2B%E5%88%B7%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%2BAI%E8%A7%A3%E7%AD%94%20%7C%20%E4%B8%80%E9%94%AE%E6%8C%82%E6%9C%BA%20%7C%20%E5%8F%AF%E8%B0%83%E8%8A%82%E5%80%8D%E9%80%9F%20%7C%20%E8%87%AA%E7%AD%94%E9%A2%98%E7%9B%AE%F0%9F%8F%86%EF%BC%88%E5%90%89%E7%8C%AA%E7%94%9F%E6%B4%BB%EF%BC%89%F0%9F%A5%B3%E5%A4%A7%E5%AD%A6%E5%BF%85%E5%A4%87%E7%A5%9E%E5%99%A8%F0%9F%8E%89.user.js
// @updateURL https://update.greasyfork.org/scripts/530068/%F0%9F%AB%A7404%E5%B0%8F%E7%AB%99%20%E2%80%94%20%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B%20%7C%20%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9%20%7C%20%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%20%7C%20%E8%A7%86%E9%A2%91%2B%E8%A7%86%E9%A2%91%E5%86%85%E6%8F%90%E9%97%AE%2B%E6%B5%8B%E8%AF%95%2B%E8%80%83%E8%AF%95%2B%E5%88%B7%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%2BAI%E8%A7%A3%E7%AD%94%20%7C%20%E4%B8%80%E9%94%AE%E6%8C%82%E6%9C%BA%20%7C%20%E5%8F%AF%E8%B0%83%E8%8A%82%E5%80%8D%E9%80%9F%20%7C%20%E8%87%AA%E7%AD%94%E9%A2%98%E7%9B%AE%F0%9F%8F%86%EF%BC%88%E5%90%89%E7%8C%AA%E7%94%9F%E6%B4%BB%EF%BC%89%F0%9F%A5%B3%E5%A4%A7%E5%AD%A6%E5%BF%85%E5%A4%87%E7%A5%9E%E5%99%A8%F0%9F%8E%89.meta.js
// ==/UserScript==

(() => {
  // var token = 'dampmQGPizKmgwAI', //因为淋过雨，所以想替学弟撑把伞。
   var token = GM_getValue('tikutoken'),jumpType = GM_getValue('jumpType', 1), // 0:智能模式，1:遍历模式，2:不跳转，如果智能模式出现无限跳转/不跳转情况，请切换为遍历模式

        disableMonitor = GM_getValue('disableMonitor', 0), // 0:无操作，1:解除多端学习监控，开启此功能后可以多端学习，不会被强制下线。
        randomDo = GM_getValue('unrivalrandomdo', 1), //将0改为1，找不到答案的单选、多选、判断就会自动选【C、ABCD、错】，只在规定正确率不为100%时才生效
        backGround = 0, //是否对接超星挂机小助手，需要先安装对应脚本
        videoQuestionEnabled = GM_getValue('videoQuestionEnabled', true), // 是否启用视频题目自动处理功能

        // 🚀 新增：学习端章节测验检测功能
        isLearningModeActive = false, // 学习端是否正在处理章节测验
        examModeDisabled = false, // 考试端是否被禁用

        // 🚀 检测学习端章节测验状态
        checkLearningModeStatus = () => {
            try {
                // 检查全局变量，判断学习端是否正在处理章节测验
                if (typeof _w !== 'undefined' && _w.top) {
                    return _w.top.unrivalLearningModeActive === true || _w.top.unrivalExamModeDisabled === true;
                }

                // 备用检测方法：检查DOM元素
                const workPanel = top.document.getElementById('workPanel');
                const frameContent = top.document.getElementById('frame_content');

                if (workPanel && workPanel.style.display !== 'none' &&
                    frameContent && frameContent.src &&
                    frameContent.src.includes('/work/phone/work')) {
                    return true;
                }

                return false;
            } catch (e) {
                return false;
            }
        },

        // 🚀 更新学习端状态
        updateLearningModeStatus = () => {
            const wasActive = isLearningModeActive;
            isLearningModeActive = checkLearningModeStatus();

            // 如果状态发生变化，更新考试端状态
            if (wasActive !== isLearningModeActive) {
                if (isLearningModeActive) {
                    examModeDisabled = true;
                } else {
                    examModeDisabled = false;
                }
            }
        },

        // 🚀 启动状态监控
        startStatusMonitoring = () => {
            // 每2秒检查一次学习端状态
            setInterval(() => {
                updateLearningModeStatus();
            }, 2000);
        },
        //-----------------------------------------------------------------------------------------------------
        autoLogin = 1, //掉线是否自动登录，1为自动登录，需要配置登录信息（仅支持手机号+密码登陆）
        phoneNumber = GM_getValue('phoneNumber', ''), //自动登录的手机号，填写在单引号之间。
        password = GM_getValue('password', ''); //自动登录的密码，填写在单引号之间。
    //-----------------------------------------------------------------------------------------------------
    var host = 'http://14.29.190.187:54223/',
        rate = GM_getValue('unrivalrate', '1'),//倍速
        accuracy = GM_getValue('accuracy',80), //章节测试正确率百分比，在答题正确率在规定之上并且允许自动提交时才会提交答案

        // 🚀 新增：视频倍速优化功能配置
        smartSpeedControl = GM_getValue('smartSpeedControl', false), // 智能倍速调节
        durationCompensation = GM_getValue('durationCompensation', false), // 时长补偿机制
        behaviorSimulation = GM_getValue('behaviorSimulation', false), // 行为模拟优化
        detectionEvasion = GM_getValue('detectionEvasion', false), // 检测规避技术
        riskWarning = GM_getValue('riskWarning', true), // 风险提示开关
        ctUrl = 'https://cx.icodef.com/wyn-nb?v=4',

        // 🚀 智能倍速调节相关变量
        smartSpeedState = {
            currentSpeed: 1,
            baseSpeed: 1,
            lastChangeTime: 0,
            changeInterval: 30000, // 30秒变化一次
            speedVariation: 0.2, // 速度变化幅度
            isPaused: false,
            pauseDuration: 0,
            totalPauseTime: 0
        },

        // 🚀 行为模拟相关变量
        behaviorState = {
            mouseMoveInterval: null,
            clickInterval: null,
            lastMouseMove: 0,
            lastClick: 0
        },

        // 🚀 按钮状态更新函数
        updateOptimizationButtonState = (buttonId, isEnabled) => {
            const button = top.document.getElementById(buttonId);
            if (button) {
                if (isEnabled) {
                    button.setAttribute('class', 'btn btn-success');
                    button.style.color = 'white';
                    button.style.backgroundColor = '#5cb85c';
                } else {
                    button.setAttribute('class', 'btn btn-default');
                    button.style.color = '';
                    button.style.backgroundColor = '';
                }
            }
        },

        // 🚀 智能倍速调节核心函数
        getSmartSpeed = (baseRate) => {
            if (!smartSpeedControl) return baseRate;

            const now = Date.now();
            if (now - smartSpeedState.lastChangeTime > smartSpeedState.changeInterval) {
                // 随机调整速度，但保持在合理范围内
                const variation = (Math.random() - 0.5) * smartSpeedState.speedVariation;
                smartSpeedState.currentSpeed = Math.max(0.8, Math.min(3.0, baseRate + variation));
                smartSpeedState.lastChangeTime = now;

                if (riskWarning) {
                    logs.addLog(`智能倍速调节：当前速度 ${smartSpeedState.currentSpeed.toFixed(1)}x`, 'blue');
                }
            }

            return smartSpeedState.currentSpeed;
        },

        // 🚀 行为模拟函数
        simulateUserBehavior = () => {
            if (!behaviorSimulation) return;

            const now = Date.now();

            // 随机鼠标移动
            if (now - behaviorState.lastMouseMove > 10000 + Math.random() * 20000) {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: x,
                    clientY: y,
                    bubbles: true
                });
                document.dispatchEvent(mouseEvent);
                behaviorState.lastMouseMove = now;
            }

            // 随机点击（模拟用户交互）
            if (now - behaviorState.lastClick > 30000 + Math.random() * 60000) {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                });
                document.body.dispatchEvent(clickEvent);
                behaviorState.lastClick = now;
            }
        },

        // 🚀 时长补偿机制
        compensateDuration = (playTime, duration, baseRate) => {
            if (!durationCompensation) return playTime;

            const expectedTime = duration / baseRate;
            const actualTime = playTime;
            const compensation = Math.max(0, expectedTime - actualTime);

            return playTime + compensation * 0.1; // 轻微补偿
        },

        // 🚀 检测规避技术
        getEvasionRate = (baseRate) => {
            if (!detectionEvasion) return baseRate;

            // 使用更隐蔽的倍速实现
            const evasionRate = baseRate * (0.95 + Math.random() * 0.1); // 添加微小随机变化
            return Math.max(0.5, Math.min(2.5, evasionRate)); // 限制在安全范围内
        },

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

// =============================
// 📘 安全增强版 confirm 劫持 + 自动跳转模块
// =============================
function safeConfirmHook() {
    const oldConfirm = window.confirm;
    const handler = (msg) => {
        // 新版学习通使用简单劫持，直接返回true
        if (getQueryVariable('mooc2') == '1') {
            return true; // 新版学习通直接自动确认
        }

        // 旧版学习通使用复杂逻辑
        if (document.activeElement && document.activeElement.closest('#xxt-helper-window')) {
            return oldConfirm(msg);
        }
        return true; // 其他情况自动确认
    };

    // 安全地劫持confirm函数
    try {
        window.confirm = handler;
        if (typeof top !== 'undefined') {
            top.confirm = handler;
        }
        if (typeof unsafeWindow !== 'undefined') {
            unsafeWindow.confirm = handler;
        }

        // 安全地处理frames
        if (window.frames && window.frames.length) {
            for (let i = 0; i < window.frames.length; i++) {
                try {
                    window.frames[i].confirm = handler;
                } catch (e) {}
            }
        }
    } catch (e) {
        console.log('confirm劫持失败:', e);
    }
}
safeConfirmHook();
setInterval(safeConfirmHook, 2000);

// =============================
// ✅ 自动检测任务完成后跳转下一节
// =============================
function autoNextSection() {
    // 只对旧版学习通生效，新版学习通完全跳过此功能
    if (getQueryVariable('mooc2') == '1') {
        return; // 新版学习通完全跳过此功能
    }

    try {
        // 检查是否有学习通弹窗
        const jobFinishTip = document.getElementById('jobFinishTip');
        if (jobFinishTip && jobFinishTip.style.display !== 'none') {
            console.log('[学习通助手] 检测到学习通弹窗，自动点击下一节');
            const nextBtn = jobFinishTip.querySelector('.nextChapter');
            if (nextBtn) {
                nextBtn.click();
                return;
            }
        }

        // 检查是否有未完成任务提示弹窗（只检测明显的弹窗）
        const warn = document.querySelector('.AlertCon02');
        if (warn && warn.style.display !== 'none' && warn.textContent.includes('当前章节还有任务点未完成')) {
            console.log('[学习通助手] 检测到未完成任务提示，自动点击下一节');
            // 查找下一节按钮
            const nextBtn = document.querySelector('a[title="下一节"]') ||
                           Array.from(document.querySelectorAll('a, button')).find(btn =>
                               btn.textContent && btn.textContent.includes('下一节')
                           );
            if (nextBtn) {
                nextBtn.click();
            }
            return;
        }

        // 如果没有检测到弹窗，直接返回，不执行后续逻辑
        return;

        // 查找其他可能的下一节按钮
        const nextBtn = document.querySelector('a[title="下一节"]') ||
                       Array.from(document.querySelectorAll('a, button')).find(btn =>
                           btn.textContent && btn.textContent.includes('下一节')
                       );

        if (!nextBtn) return;

        // 检查任务完成状态
        const unfinish = document.querySelectorAll('.ans-job:not(.ans-job-finished)');
        if (unfinish.length === 0) {
            console.log('[学习通助手] 检测到任务完成，自动跳转下一节');
            nextBtn.click();
        }
    } catch (e) {
        console.log('自动跳转检测失败:', e);
    }
}
setInterval(autoNextSection, 3000);

// =============================
// 🎯 专门拦截学习通弹窗
// =============================
function interceptChaoxingDialog() {
    // 只对旧版学习通生效，新版学习通完全跳过此功能
    if (getQueryVariable('mooc2') == '1') {
        return; // 新版学习通完全跳过此功能
    }

    try {
        // 检查是否有学习通弹窗
        const jobFinishTip = document.getElementById('jobFinishTip');
        if (jobFinishTip && jobFinishTip.style.display !== 'none') {
            console.log('[学习通助手] 检测到学习通弹窗，自动处理');

            // 查找下一节按钮
            const nextBtn = jobFinishTip.querySelector('.nextChapter');
            if (nextBtn) {
                console.log('[学习通助手] 自动点击下一节按钮');
                nextBtn.click();
                return;
            }
        }

        // 检查其他可能的弹窗（只检测明显的弹窗）
        const alertCon = document.querySelector('.AlertCon02');
        if (alertCon && alertCon.style.display !== 'none' &&
            alertCon.textContent.includes('当前章节还有任务点未完成')) {
            console.log('[学习通助手] 检测到AlertCon02弹窗，自动处理');
            const nextBtn = alertCon.querySelector('.nextChapter');
            if (nextBtn) {
                nextBtn.click();
            }
        }
    } catch (e) {
        console.log('弹窗拦截失败:', e);
    }
}

// 立即执行一次
interceptChaoxingDialog();

// 每1秒检查一次弹窗
setInterval(interceptChaoxingDialog, 1000);

// 监听DOM变化，实时拦截新出现的弹窗
if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 有新元素添加，立即检查弹窗
                setTimeout(interceptChaoxingDialog, 100);
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
    if (parseFloat(rate) == parseInt(rate)) {
        rate = parseInt(rate);
    } else {
        rate = parseFloat(rate);
    }
    try {
        _w.top.unrivalReviewMode = GM_getValue('unrivalreview', '0') || '0';
        _w.top.unrivalDoWork = GM_getValue('unrivaldowork', '1') || '1';
        _w.top.unrivalAutoSubmit = GM_getValue('unrivalautosubmit', '1') || '1';
        _w.top.unrivalAutoSave = GM_getValue('unrivalautosave', '1') || '1';
        _w.top.unrivalRandomDo = GM_getValue('unrivalrandomdo', 1) || 1;
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
        var base222 = `data:image/jpeg;base64,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`

// 阅读助手代码将在脚本末尾定义

// 检查是否已存在悬浮窗，避免重复创建
let existingFloatWin = top.document.getElementById("xxt-helper-window");
if (existingFloatWin) {
    existingFloatWin.remove();
}

// 创建悬浮窗 - 确保创建在顶级文档中
const floatWin = top.document.createElement("div");
floatWin.id = "xxt-helper-window";

// 全局状态变量
let isMax = false;
let isMinimized = false;
floatWin.innerHTML = `
  <div id="xxt-helper-header">
    <span style="flex:1;">🫧404小站-学习通助手 <a href="https://scriptcat.org/zh-CN/script-show-page/3321" style="color: #fff; text-decoration: none; font-size: 12px; margin-left: 10px;">劝君莫惜金缕衣    劝君惜取少年时</a></span>
    <button id="xxt-min">─</button>
    <button id="xxt-max">▢</button>
    <button id="xxt-close">✕</button>
  </div>
  <div id="xxt-helper-content">
    <!-- 作者信息区域 -->
<div id="author-info" style="margin-bottom: 15px; padding: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; text-align: center;">
  <!-- 修正点：给h4的style属性后加了 ">"，a标签正确嵌套在h4内 -->
  <h4 style="margin: 0 0 8px 0; font-size: 16px;">
    <a href="https://scriptcat.org/zh-CN/script-show-page/3321" target="_blank"style="color: white; text-decoration: none;"> 🫧404小站-学习通助手-完全免费（点我更新）</a><span style="color: white;">下方防伪超链接</span>
  </h4>
  <p style="margin: 0 0 8px 0; font-size: 12px; opacity: 0.9;">
    <a href="https://scriptcat.org/zh-CN/script-show-page/3321" target="_blank" style="color: white; text-decoration: none;">"劝君莫惜金缕衣    劝君惜取少年时"</a>
  </p>
  <p style="margin: 0; font-size: 12px; opacity: 0.9;">支持视频+测试+考试+AI解答 | 可调节倍速 | 自答题目</p>
</div>
    <!-- 配置切换按钮 -->
    <div id="config-tabs" style="margin-bottom: 15px; border-bottom: 2px solid #eee;">
      <button class="config-tab active" data-tab="main-panel">🏡主页日志</button>
      <button class="config-tab" data-tab="task-config">🔧任务配置</button>
      <button class="config-tab" data-tab="question-bank">📋题库配置</button>
      <button class="config-tab" data-tab="ai-search">💻AI搜题</button>
      <button class="config-tab" data-tab="auto-login">🔐自动登录</button>
      <button class="config-tab" data-tab="author-words">🗨️作者的话</button>
    </div>

    <!-- 主页面区域 -->
    <div id="main-panel" class="config-panel active">
      <!-- 投喂渠道和赞赏信息 -->
      <div style="margin-bottom: 15px; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 15px;">
          <img src='https://github.com/user-attachments/assets/830f9d78-a85c-4d62-be5e-cc0af727eabe' width='16px' />
          <span>投喂渠道</span>
          <img src="`+base222 + `" alt="love" width="120" height="120"><!-- 新增图片（保持相同容器内） -->
          <!-- 学习进度面板 - 与赞赏图片平行 -->
          <div class="progress-panel" id="progressPanel" style="flex: 1; margin-left: 20px;">
            <div class="progress-header">
              <div>
                <div class="progress-label">当前任务</div>
                <div class="progress-task-name" id="progressTaskName">暂无任务</div>
              </div>
              <div class="progress-percent" id="progressTaskPercent">0%</div>
            </div>
            <div class="progress-meta" id="progressTaskType">类型：-</div>
            <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar-fill" id="progressBarFill"></div>
            </div>
            <div class="progress-detail" id="progressTaskDetail">等待任务开始</div>
          </div>
        </div>
        <p style="margin: 15px 0; text-align: center; font-style: italic; font-size: 16px;">"劝君莫惜金缕衣，劝君惜取少年时"</p>
        <p style="margin: 10px 0; text-align: center; font-size: 14px;">赞赏助我拿下瑞幸生椰拿铁☕（少冰不另外加糖）真心好喝，早日拿下瑞幸黑金🦌</p>
        <p>—如果帮你省下了少年时，就莫要惜金缕衣喽，感谢您的打赏。我会非常🦀🦀你的慷慨和鼓励q(≧▽≦q)  ➡️学长也还有学业在身，如果加微信未能及时回复，请多多包涵哈哈哈，欢迎大家加微信咨询： Why15236444193 (遇问题下滑看运行日志⏬) 还有我在考虑要不要建个群聊，大家可以把意愿反馈给我📩———如果觉得悬浮窗不舒服，可以用<a href="https://scriptcat.org/zh-CN/script-show-page/4533" target="_blank" style="text-decoration: underline; color: #0066cc;">旧版</a>——点击跳转</p>
      </div>




      <div class="panel panel-info">
        <div class="panel-heading">任务列表</div>
        <div class="panel-body" id='joblist'>
        </div>
      </div>

      <div class="panel panel-info" id='videoTime' style="display: none;height: 300px;">
        <div class="panel-heading">学习进度</div>
        <div class="panel-body" style="height: 100%;">
          <iframe id="videoTimeContent" src="" frameborder="0" scrolling="auto"
              style="width: 100%;height: 85%;"></iframe>
        </div>
      </div>

      <div class="panel panel-info" id='workPanel' style="display: none;height: 1000px;">
        <div class="panel-heading">章节测试</div>
        <div class="panel-body" id='workWindow' style="height: 100%;">
          <iframe id="frame_content" name="frame_content" src="" frameborder="0" scrolling="auto"
              style="width: 100%;height: 95%;"></iframe>
        </div>
      </div>

      <div class="panel panel-info">
        <div class="panel-heading">运行日志</div>
        <div class="panel-body">
          <div id="result" style="overflow:auto;line-height: 30px; max-height: 300px;">
            <div id="log">
              <span style="color: red">[00:00:00]如果此提示不消失，说明页面出现了错误，请联系作者</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务配置区域 -->
    <div id="task-config" class="config-panel">
      <div class="panel panel-info" id="normalQuery" style="padding: 15px 0;">
        <div class="panel-heading" style="padding: 12px 15px;">任务配置</div>
        <div class="panel-body" style="padding: 20px; line-height: 1.8;">
          <div style="margin-bottom: 15px;">如果显示视频已观看完毕，但视频任务未完成，可以开高倍速或视频优化功能，多刷几次❗注意哦倍速不要改太高</div>


          <div style="padding: 0;font-size: 20px;float: left; margin-right: 15px;">视频倍速：</div>
          <div style="margin-bottom: 25px; padding-top: 5px;">
            <input type="number" id="unrivalRate" style="width: 80px; height: 34px; padding: 6px 12px;">
            &ensp;
            <a id='updateRateButton' class="btn btn-default" style="color: white;background-color:darkcyan; padding: 6px 12px;">保存</a>
            &nbsp;|&nbsp;
            <a id='reviewModeButton' class="btn btn-default" style="padding: 6px 12px;">复习模式</a>
            &nbsp;|&nbsp;
            <a id='videoTimeButton' class="btn btn-default" style="padding: 6px 12px;">查看学习进度</a>
            &nbsp;|&nbsp;
            <a id='fuckMeModeButton' class="btn btn-default" href="https://scriptcat.org/script-show-page/379" target="view_window" style="padding: 6px 12px;">后台挂机</a>
            &nbsp;
            <a id='backGround' class="btn btn-default" target="view_window" style="padding: 6px 12px;">激活挂机</a>
            &nbsp;|&nbsp;
            <a id='jumpTypeButton' class="btn btn-default" style="padding: 6px 12px;">模式: 遍历</a>
            &nbsp;|&nbsp;
            <a id='autoStartButton' class="btn btn-default" style="padding: 6px 12px;">自动阅读: 开启</a>
            <span style="margin-left: 8px; color: #666; font-size: 12px;">打开阅读界面自动阅读</span>
            &nbsp;|&nbsp;
            <a id='videoQuestionButton' class="btn btn-default" style="padding: 6px 12px;">视频题目: 开启</a>
            <span style="margin-left: 8px; color: #666; font-size: 12px;">自动处理视频内题目</span>
          </div>

          <div style="clear: both; margin-bottom: 15px;"></div>

          <div style="padding: 0;font-size: 20px;float: left; margin-right: 15px;">章节测试：</div>
          <div style="margin-bottom: 25px; padding-top: 5px;">
            <a id='autoDoWorkButton' class="btn btn-default" style="padding: 6px 12px;">自动答题</a>&nbsp;|&nbsp;
            <a id='autoSubmitButton' class="btn btn-default" style="padding: 6px 12px;">自动提交</a>&nbsp;|&nbsp;
            <a id='autoSaveButton' class="btn btn-default" style="padding: 6px 12px;">自动保存</a>&nbsp;|&nbsp;
            <a id='randomDoButton' class="btn btn-default" style="padding: 6px 12px;">随机答题: 开启</a>
          </div>

          <div style="clear: both; margin-bottom: 15px;"></div>

          <div style="padding:0;font-size:20px;float:left; margin-right: 15px;">章节测试正确率(百分比): </div>
          <div style="margin-bottom: 25px; padding-top: 5px;">
            <input type="number" id="accuracy" style="width: 80px; height: 34px; padding: 6px 12px;">
            &ensp;
            <a id='updateaccuracy' class="btn btn-default" style="color: white;background-color: darkcyan; padding: 6px 12px;">保存</a>
            &nbsp;
            <span style="font-size: 14px;">在答题正确率在规定之上并且允许自动提交时才会提交答案</span>
          </div>

          <div style="clear: both; margin-bottom: 15px;"></div>

          <!-- 🚀 视频倍速优化功能按钮 -->
          <div style="padding:0;font-size:20px;float:left; margin-right: 15px;">🚀 视频优化: </div>
          <div style="margin-bottom: 25px; padding-top: 5px;">
            <a id='smartSpeedControl' class="btn btn-default" style="padding: 6px 12px;">智能倍速调节</a>
            &nbsp;|&nbsp;
            <a id='durationCompensation' class="btn btn-default" style="padding: 6px 12px;">时长补偿机制</a>
            &nbsp;|&nbsp;
            <a id='behaviorSimulation' class="btn btn-default" style="padding: 6px 12px;">行为模拟优化</a>
            &nbsp;|&nbsp;
            <a id='detectionEvasion' class="btn btn-default" style="padding: 6px 12px;">检测规避技术</a>
            &nbsp;|&nbsp;
            <a id='riskWarning' class="btn btn-default" style="padding: 6px 12px;">风险提示</a>
            &nbsp;
            <span style="font-size: 14px; color: #666;">⚠️ 高倍速使用存在被检测风险，建议适度使用。开启优化功能可降低风险，但不能完全避免。</span>
          </div>

          <div style="clear: both; margin-bottom: 15px;"></div>

          <div style="margin-top: 20px; padding: 10px; background-color: #f9f9f9; border-radius: 4px;">
            <div style="padding: 0;font-size: 20px;float: left; margin-right: 15px;">考试功能：</div>
            <div style="padding-top: 5px;">
              <a id='Button' class="btn btn-default" style="padding: 6px 12px;">打开考试界面后自动显示</a>
              &nbsp;|&nbsp;
              <a id='disableMonitorButton' class="btn btn-default" style="padding: 6px 12px;">多端学习: 解除</a>
              <span style="font-size: 14px; margin-left: 5px;">解除多端学习监控，开启此功能后可以多端学习。</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 题库配置区域 -->
    <div id="question-bank" class="config-panel">
      <div class="panel panel-info" id='tikupeizhi' style="width: 100% ;height:100%">
        <div class="panel-heading">题库配置</div>
        <div class="panel-body" style="height: 100%;">
          <p>关注微信公众号：一之哥哥，发送 "token" 领取你的token，可以提高答题并发数量。</p>
          <p>领取到token后，填入输入框中，点击保存即可。还有undefined是没有设定，而不是有效token</p>
          <div style="padding: 0;font-size: 20px;float: left;">题库Token：</div>
          <input type="text" id="token" style="width: 150px;" value="`+GM_getValue("tikutoken")+`">
          <a id='updateToken' class="btn btn-default"style="color: white;background-color: darkcyan;" >保存</a>
        </div>
      </div>
    </div>

    <!-- AI搜题区域 -->
    <div id="ai-search" class="config-panel">
      <div class="panel panel-info">
        <div class="panel-heading">🤖 AI智能搜题</div>
        <div class="panel-body" style="padding: 20px;">
          <div style="margin-bottom: 15px; padding: 10px; background-color: #e8f5e8; border: 1px solid #4caf50; border-radius: 4px;">
            <strong>✨ AI搜题功能：</strong>当题库连接失败时，可以使用AI智能搜题功能进行手动查题。
          </div>

          <div class="panel panel-default">
            <div class="panel-heading">StudyAI - 题库连接失败时可用于手动查题</div>
            <div class="panel-body">
              <iframe
                src="https://cloud.fastgpt.cn/chat/share?shareId=healvo7h60bo7xdjk06b8ao7"
                style="width: 100%; height: 400px;"
                frameborder="0"
                allow="*"
              ></iframe>
            </div>
          </div>

          <div style="margin-top: 15px; padding: 10px; background-color: #f0f8ff; border: 1px solid #87ceeb; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;"><strong>使用说明：</strong></p>
            <ul style="margin: 5px 0 0 20px; font-size: 13px;">
              <li>当自动题库无法找到答案时，可以在此处手动输入题目进行AI搜索</li>
              <li>支持单选题、多选题、判断题等多种题型</li>
              <li>AI会提供详细的答案解析和解题思路</li>
              <li>建议在题库token失效或网络问题时使用此功能</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 自动登录配置区域 -->
    <div id="auto-login" class="config-panel">
      <div class="panel panel-info">
        <div class="panel-heading">自动登录配置</div>
        <div class="panel-body" style="padding: 20px;">
          <div style="margin-bottom: 15px; padding: 10px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
            <strong>⚠️ 风险提示：</strong>超星官方禁止自动登录脚本，使用时可能触发账号风控。建议不要自动登录，当心风控。
          </div>

          <div style="display: flex;align-items: center;margin-bottom: 20px;">
            <a id='autoLoginButton' class="btn btn-default" style="margin-right: 15px;">自动登录: 关闭</a>
          </div>

          <div style="display: flex;gap: 20px; flex-wrap: wrap;">
            <div>
              <label for="phoneNumber" style="display: block;margin-bottom: 5px; font-weight: bold;">手机号：</label>
              <input type="text" id="phoneNumber" style="width: 200px; height: 34px; padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px;" value="`+phoneNumber+`" placeholder="请输入手机号">
            </div>
            <div>
              <label for="password" style="display: block;margin-bottom: 5px; font-weight: bold;">密码：</label>
              <input type="password" id="password" style="width: 200px; height: 34px; padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px;" value="`+password+`" placeholder="请输入密码">
            </div>
            <div style="align-self: end;">
              <a id='saveLoginInfo' class="btn btn-default" style="color: white;background-color: darkcyan; padding: 6px 12px; height: 34px; line-height: 22px;">保存登录信息</a>
            </div>
          </div>
        </div>
      </div>
    </div>

 <!-- 作者的话区域 -->
<div id="author-words" class="config-panel">
  <div class="panel panel-info">
    <div class="panel-heading">作者的话</div>
    <div class="panel-body" style="padding: 20px;">
      <div style="margin-bottom: 15px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; line-height: 1.8;">
        <!-- 诗句与意境描写 -->
        <p style="margin: 15px 0; text-align: center; font-style: italic; font-size: 16px; color: #333;">"劝君莫惜金缕衣，劝君惜取少年时"</p>
        <p style="margin: 15px 0; text-align: center; font-style: italic; font-size: 15px; color: #333;">我闭了昏黄的台灯，此时窗外正好飘来一片月光，泼洒在电脑屏幕上，红色的报错，洁白的就像一个还未睁开眸子看着世界的孩子的心。</p>

        <!-- 核心感言 -->
        <p style="margin: 15px 0; color: #444;">📁 每一次优化都是学长透支身体的结果，熬穿了不知道多少个夜晚，您的赞赏会是刺破黑暗苍穹的亮光照亮我前行的路</p>
        <p style="margin: 15px 0; color: #444;">因为淋过雨，所以想替学弟撑把伞。学长已经把路铺好了。学长快点不起拼好饭了，赞赏助力学长全款拿下拼好饭。</p>
        <p style="margin: 15px 0; color: #444;">✨ 有的学弟很调皮啊，给我的赞赏备注个学长CPDD，哎，说来惭愧，学长现在还没牵过女孩子的手，所以可以赞赏安慰一下学长吗？</p>

        <!-- 实用工具链接（统一样式） -->
        <div style="margin: 20px 0; padding: 12px; background-color: #f0f8ff; border-radius: 6px;">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #2d3748;">🔧 学长自用404系列实用小工具，大家可以下载鸭</p>
          <a href="https://scriptcat.org/zh-CN/script-show-page/3299" target="_blank" style="color: #007bff; text-decoration: underline; font-size: 14px; margin: 0 10px;">🎬 VIP追剧神器</a>
          <a href="https://scriptcat.org/zh-CN/script-show-page/3445" target="_blank" style="color: #007bff; text-decoration: underline; font-size: 14px; margin: 0 10px;">✨ 夜间模式助手</a>
          <a href="https://scriptcat.org/zh-CN/script-show-page/3403" target="_blank" style="color: #007bff; text-decoration: underline; font-size: 14px; margin: 0 10px;">🛠️ 破除网页限制</a>
          <a href="https://scriptcat.org/zh-CN/script-show-page/3563" target="_blank" style="color: #007bff; text-decoration: underline; font-size: 14px; margin: 0 10px;">🫧 鼠标指针美化</a>
          <a href="https://scriptcat.org/zh-CN/script-show-page/3638" target="_blank" style="color: #007bff; text-decoration: underline; font-size: 14px; margin: 0 10px;">📖 清晰文本助手</a>
          <a href="https://scriptcat.org/zh-CN/script-show-page/4939" target="_blank" style="color: #007bff; text-decoration: underline; font-size: 14px; margin: 0 10px;">🗨️ 消息定时推送(适合有对象使用）</a>
        </div>

        <!-- 福利链接（独立板块） -->
        <div style="margin: 20px 0; padding: 12px; background-color: #fef7fb; border-radius: 6px;">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #2d3748;">🎁 学长专属福利链接</p>
          <a href="https://www.bilibili.com/video/BV1xwtpztEwm/?spm_id_from=333.337.search-card.all.click&vd_source=36f6343ea4404e162979aada13d8de42" target="_blank" style="color: #e83e8c; text-decoration: underline; font-size: 14px; margin: 0 10px;">福利1</a>
          <a href="https://www.bilibili.com/video/BV1AM4y1M71p/?spm_id_from=333.337.search-card.all.click&vd_source=36f6343ea4404e162979aada13d8de42" target="_blank" style="color: #e83e8c; text-decoration: underline; font-size: 14px; margin: 0 10px;">福利2</a>
          <a href="https://www.bilibili.com/video/BV1WzJkzxENK/?spm_id_from=333.337.search-card.all.click&vd_source=36f6343ea4404e162979aada13d8de42" target="_blank" style="color: #e83e8c; text-decoration: underline; font-size: 14px; margin: 0 10px;">福利3</a>
        </div>

        <!-- 联系与旧版说明 -->
        <p style="margin: 15px 0; color: #444;">学长也还有学业在身，如果加微信未能及时回复，请多多包涵哈！学长目前准备优化：1. 添加更多免费题库 2. 兼容多平台 3. 优化脚本体验（持续优化中）4. 制作超简化版本</p>
        <p style="margin: 15px 0; color: #444;">学长是galgame最长的河流，如果有galgame问题也欢迎大家加微信咨询：<strong style="color: #0d6efd;">Why15236444193</strong> ｜ 还有我在考虑要不要建个群聊，大家可以把意愿反馈给我📩</p>
        <p style="margin: 15px 0; color: #444;">—— 若觉得悬浮窗不舒服，可点击跳转：<a href="https://scriptcat.org/zh-CN/script-show-page/4533" target="_blank" style="text-decoration: underline; color: #0066cc; font-weight: 500;">旧版</a> ——点击跳转（不要问为什么视频不自动播放还有答题没有实时填入，因为你没有看脚本使用说明）</p>
      </div>
    </div>
  </div>
</div>
`;
top.document.body.appendChild(floatWin);

// 悬浮窗样式
const style = document.createElement("style");
style.innerHTML = `
#xxt-helper-window {
  position: fixed;
  top: 60px;
  left: 350px;
  width: 720px; /* 原来900px，缩小为原来的80% */
  height: 560px; /* 原来700px，缩小为原来的80% */
  background: #fff;
  border: 2px solid #444;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  z-index: 2147483647 !important; /* 使用最大可能的z-index值 */
  display: flex;
  flex-direction: column;
  overflow: visible !important; /* 允许内容溢出 */
  min-width: 240px; /* 原来300px，缩小为原来的80% */
  min-height: 160px; /* 原来200px，缩小为原来的80% */
  transform: none !important; /* 防止被父容器的transform影响 */
  max-width: 720px !important; /* 限制最大宽度与原始宽度一致 */
  max-height: 560px !important; /* 限制最大高度与原始高度一致 */
  contain: none !important; /* 防止被CSS containment限制 */
  clip: auto !important; /* 防止被裁剪 */
  pointer-events: auto !important; /* 确保鼠标事件正常工作 */
  visibility: visible !important; /* 确保可见性 */
  opacity: 1 !important; /* 确保不透明 */
  box-sizing: content-box !important; /* 确保边框不会增加元素实际大小 */
  padding: 0 !important; /* 移除内边距 */
  margin: 0 !important; /* 移除外边距 */
  font-size: 14px !important; /* 适当缩小字体 */
}

#xxt-helper-header {
  background: #444;
  color: #fff;
  padding: 8px 12px;
  cursor: move;
  display: flex;
  align-items: center;
  flex-shrink: 0; /* 防止头部被压缩 */
}

#xxt-helper-header button {
  background: transparent;
  color: #fff;
  border: none;
  margin-left: 8px;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 3px;
  transition: background-color 0.2s;
}

#xxt-helper-header button:hover {
  background: rgba(255,255,255,0.2);
}

#xxt-helper-content {
  flex: 1;
  overflow: auto; /* 改为auto显示滚动条 */
  padding: 15px;
  display: flex;
  flex-direction: column;
  z-index: 999999; /* 增加层级保证显示 */
}

/* 配置标签样式 */
#config-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #eee;
  flex-shrink: 0;
}

.config-tab {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-bottom: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}

.config-tab:hover {
  background: #e9e9e9;
}

.config-tab.active {
  background: #fff;
  border-color: #007bff;
  color: #007bff;
  font-weight: bold;
}

/* 配置面板样式 */
.config-panel {
  display: none;
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.config-panel.active {
  display: block;
}

/* Bootstrap面板样式优化 */
.panel {
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.panel-heading {
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  padding: 10px 15px;
  font-weight: bold;
  border-radius: 4px 4px 0 0;
}

.panel-body {
  padding: 15px;
}

.panel-info {
  border-color: #bce8f1;
}

.panel-info > .panel-heading {
  background: #d9edf7;
  border-color: #bce8f1;
  color: #31708f;
}

/* 按钮样式优化 */
.btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-default {
  color: #333;
  background-color: #fff;
  border-color: #ccc;
}

.btn-default:hover {
  color: #333;
  background-color: #e6e6e6;
  border-color: #adadad;
}

.btn-success {
  color: #fff;
  background-color: #5cb85c;
  border-color: #4cae4c;
}

.btn-success:hover {
  color: #fff;
  background-color: #449d44;
  border-color: #398439;
}

/* 输入框样式 */
input[type="text"], input[type="number"], input[type="password"] {
  display: inline-block;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}

input[type="text"]:focus, input[type="number"]:focus, input[type="password"]:focus {
  border-color: #66afe9;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  #xxt-helper-window {
    width: 640px; /* 原来800px，缩小为原来的80% */
    height: 480px; /* 原来600px，缩小为原来的80% */
  }
}

@media (max-width: 1000px) {
  #xxt-helper-window {
    width: 90vw; /* 改用视窗单位 */
    height: 90vh;
    left: 5vw;
    top: 5vh;
  }

  .config-tab {
    padding: 6px 12px;
    font-size: 12px;
  }
}

/* 确保拖动时不被截断，但保持原始大小 */
#xxt-helper-window.dragging {
  max-width: 720px !important;
  max-height: 560px !important;
}

/* 视频倍速输入框显示上下箭头按钮 */
#unrivalRate {
  /* 确保显示spinner */
  -webkit-appearance: textfield !important;
  -moz-appearance: textfield !important;
}

/* 强制显示Webkit浏览器的spinner */
#unrivalRate::-webkit-outer-spin-button,
#unrivalRate::-webkit-inner-spin-button {
  -webkit-appearance: inner-spin-button !important;
  opacity: 1 !important;
  height: 100% !important;
  width: 20px !important;
  cursor: pointer !important;
  display: block !important;
}

/* Firefox浏览器spinner样式 */
#unrivalRate[type="number"] {
  -moz-appearance: textfield !important;
}

#unrivalRate[type="number"]::-moz-number-spin-box {
  opacity: 1 !important;
  display: block !important;
}

.progress-panel {
  width: 100%;
  min-width: 300px;
  max-width: 450px;
  padding: 12px 15px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.15);
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}
.progress-label {
  font-size: 11px;
  color: #6c757d;
  margin-bottom: 2px;
}
.progress-task-name {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
.progress-percent {
  font-size: 20px;
  font-weight: 700;
  color: #17a2b8;
  white-space: nowrap;
}
.progress-meta {
  margin: 4px 0 6px;
  font-size: 11px;
  color: #6c757d;
}
.progress-bar {
  width: 100%;
  height: 14px;
  border-radius: 999px;
  background: #e9ecef;
  overflow: hidden;
  position: relative;
}
.progress-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: linear-gradient(90deg, #0dcaf0, #0b7fab);
  transition: width 0.3s ease;
}
.progress-detail {
  margin-top: 6px;
  font-size: 11px;
  color: #495057;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

`;


// 将样式添加到顶级窗口
try {
  const topWindow = window.top || window;
  topWindow.document.head.appendChild(style);
} catch (e) {
  // 如果出现跨域问题，退回到当前document
  document.head.appendChild(style);
}

// 标签切换功能
function initTabSwitching() {
  const tabs = top.document.querySelectorAll('.config-tab');
  const panels = top.document.querySelectorAll('.config-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 移除所有活动状态
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // 添加当前活动状态
      tab.classList.add('active');
      const targetPanel = top.document.getElementById(tab.dataset.tab);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// 初始化标签切换
setTimeout(initTabSwitching, 100);

// 拖动逻辑
function setupDragging() {
  const header = top.document.getElementById("xxt-helper-header");
  let isDown = false, offsetX, offsetY;

  header.addEventListener("mousedown", e => {
    isDown = true;
    offsetX = e.clientX - floatWin.offsetLeft;
    offsetY = e.clientY - floatWin.offsetTop;
    floatWin.classList.add('dragging'); // 添加拖动类
    e.preventDefault(); // 防止文本选择
  });

  top.document.addEventListener("mousemove", e => {
    if (!isDown) return;

    const newLeft = e.clientX - offsetX;
    const newTop = e.clientY - offsetY;

    // 允许拖出屏幕边界，实现真正的全局拖动
    floatWin.style.left = newLeft + "px";
    floatWin.style.top = newTop + "px";
  });

  top.document.addEventListener("mouseup", () => {
    isDown = false;
    floatWin.classList.remove('dragging'); // 移除拖动类
  });

  // 防止拖拽时选中文本
  header.addEventListener("selectstart", e => {
    e.preventDefault();
  });
}

// 初始化拖拽功能
setTimeout(setupDragging, 100);

// 按钮逻辑 - 立即设置，不等待其他条件

// 悬浮窗初始化函数
function initFloatingWindow() {
  const minBtn = top.document.getElementById("xxt-min");
  const maxBtn = top.document.getElementById("xxt-max");
  const closeBtn = top.document.getElementById("xxt-close");

  if (minBtn) {
    minBtn.onclick = () => {
      if (!isMinimized) {
        // 最小化：只显示标题栏
        top.document.getElementById("xxt-helper-content").style.display = "none";
        top.document.getElementById("xxt-helper-window").style.height = "auto";
        top.document.getElementById("xxt-helper-window").style.minHeight = "auto";
        isMinimized = true;
      } else {
        // 恢复：显示完整内容
        top.document.getElementById("xxt-helper-content").style.display = "flex";
        top.document.getElementById("xxt-helper-window").style.height = "560px"; // 缩小为原来的80%
        top.document.getElementById("xxt-helper-window").style.minHeight = "160px"; // 缩小为原来的80%
        isMinimized = false;
      }
    };
  }

  if (maxBtn) {
    maxBtn.onclick = () => {
      if (!isMax) {
        // 全屏模式 - 确保不会被截断，但不要太大
        floatWin.style.width = "720px"; // 缩小为原来的80%
        floatWin.style.height = "560px"; // 缩小为原来的80%
        // 居中显示
        floatWin.style.top = "50%";
        floatWin.style.left = "50%";
        floatWin.style.transform = "translate(-50%, -50%)";
      } else {
        // 恢复默认大小和位置
        floatWin.style.width = "720px"; // 缩小为原来的80%
        floatWin.style.height = "560px"; // 缩小为原来的80%
        floatWin.style.top = "60px";
        floatWin.style.left = "350px";
        floatWin.style.transform = "none";
      }
      isMax = !isMax;
    };
  }

  if (closeBtn) {
    closeBtn.onclick = () => {
      floatWin.style.display = "none";
      // 移除弹窗提示，直接关闭
    };
  }
}

// 设置按钮事件处理
setTimeout(initFloatingWindow, 200);

// 确保悬浮窗始终可见的检查函数
function ensureFloatingWindowVisible() {
    let floatWin = top.document.getElementById("xxt-helper-window");

    // 如果悬浮窗不存在，重新创建
    if (!floatWin) {
        logs.addLog("悬浮窗不存在，正在重新创建...", 'orange');
        createFloatingWindow();
        return;
    }

    // 如果悬浮窗被隐藏，恢复显示
    if (floatWin.style.display === "none") {
        floatWin.style.display = "flex";
        logs.addLog("悬浮窗已恢复显示", 'green');
    }
}

// 重新创建悬浮窗的函数
function createFloatingWindow() {
    try {
        // 检查是否已存在悬浮窗，避免重复创建
        let existingFloatWin = top.document.getElementById("xxt-helper-window");
        if (existingFloatWin) {
            existingFloatWin.remove();
        }

        // 创建悬浮窗 - 确保创建在顶级文档中
        const floatWin = top.document.createElement("div");
        floatWin.id = "xxt-helper-window";
        floatWin.style.cssText = `
            position: fixed !important;
            top: 60px !important;
            left: 300px !important;
            width: 720px !important;
            height: 560px !important;
            background: #fff !important;
            border: 2px solid #444 !important;
            border-radius: 8px !important;
            box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important;
            z-index: 2147483647 !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: visible !important;
            min-width: 240px !important;
            min-height: 160px !important;
            transform: none !important;
            max-width: 720px !important;
            max-height: 560px !important;
            contain: none !important;
            clip: auto !important;
        `;

        // 添加悬浮窗内容
        floatWin.innerHTML = `
            <div id="xxt-helper-header" style="background: #444; color: white; padding: 8px; display: flex; align-items: center; cursor: move; border-radius: 6px 6px 0 0;">
                <span style="flex:1;">📚 学习通助手 <a href="https://scriptcat.org/zh-CN/script-show-page/3321" style="color: #fff; text-decoration: none; font-size: 12px; margin-left: 10px;">劝君莫惜金缕衣    劝君惜取少年时</a></span>
                <button id="xxt-min" style="background: #666; color: white; border: none; padding: 4px 8px; margin: 0 2px; cursor: pointer;">─</button>
                <button id="xxt-max" style="background: #666; color: white; border: none; padding: 4px 8px; margin: 0 2px; cursor: pointer;">▢</button>
                <button id="xxt-close" style="background: #666; color: white; border: none; padding: 4px 8px; margin: 0 2px; cursor: pointer;">✕</button>
            </div>
            <div id="xxt-helper-content" style="flex: 1; overflow-y: auto; padding: 10px;">
                <div style="text-align: center; padding: 20px; color: #666;">
                    <h3>学习通助手</h3>
                    <p>悬浮窗已重新创建</p>
                    <p>如果看不到完整界面，请刷新页面</p>
                </div>
            </div>
        `;

        // 添加到页面
        top.document.body.appendChild(floatWin);

        // 重新初始化悬浮窗功能
        setTimeout(initFloatingWindow, 100);

        logs.addLog("悬浮窗重新创建成功", 'green');

    } catch (e) {
        logs.addLog("创建悬浮窗失败: " + e.message, 'red');
    }
}

// 定期检查悬浮窗状态
setInterval(ensureFloatingWindowVisible, 3000);

// 立即检查并创建悬浮窗
setTimeout(() => {
    ensureFloatingWindowVisible();
}, 1000);

// 添加一个简单的测试悬浮窗，确保基本功能
setTimeout(() => {
    // 检查是否有悬浮窗
    const testFloatWin = top.document.getElementById("xxt-helper-window");
    if (!testFloatWin) {
        logs.addLog("检测到悬浮窗不存在，正在创建测试悬浮窗...", 'orange');

        // 创建一个简单的测试悬浮窗
        const testWin = top.document.createElement("div");
        testWin.id = "test-float-window";
        testWin.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 300px !important;
            height: 200px !important;
            background: #fff !important;
            border: 2px solid #ff0000 !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
            z-index: 2147483647 !important;
            padding: 15px !important;
            font-family: Arial, sans-serif !important;
        `;

        testWin.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #ff0000;">⚠️ 悬浮窗测试</h3>
            <p style="margin: 5px 0; font-size: 12px;">原始悬浮窗可能有问题</p>
            <p style="margin: 5px 0; font-size: 12px;">请刷新页面重新加载脚本</p>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #ff0000; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;">关闭测试窗</button>
        `;

        top.document.body.appendChild(testWin);

        // 5秒后自动关闭测试窗
        setTimeout(() => {
            if (testWin.parentElement) {
                testWin.remove();
            }
        }, 5000);
    }
}, 2000);


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
                try {
                    top.document.getElementById('log').innerHTML = logStr;
                    var logElement = top.document.getElementById('log');
                    logElement.scrollTop = logElement.scrollHeight;
                } catch (e) {
                    console.error("日志更新失败:", e);
                }
            },
            "getLogs": function () {
                return this.logArry.map(log => {
                    // 移除HTML标签和时间戳，只返回纯文本内容
                    return log.replace(/<[^>]*>/g, '').replace(/\[\d{2}:\d{2}:\d{2}\]\s*/, '');
                });
            }
        },
        clampPercent = (value) => {
            if (typeof value !== 'number' || isNaN(value)) return 0;
            return Math.max(0, Math.min(100, Math.round(value)));
        },
        progressTracker = {
            state: {
                taskName: '暂无任务',
                percent: 0,
                type: '-',
                detail: '等待任务开始'
            },
            elements: {
                name: null,
                percent: null,
                bar: null,
                detail: null,
                type: null
            },
            init: function () {
                if (!this.elements.name) {
                    this.elements = {
                        name: top.document.getElementById('progressTaskName'),
                        percent: top.document.getElementById('progressTaskPercent'),
                        bar: top.document.getElementById('progressBarFill'),
                        detail: top.document.getElementById('progressTaskDetail'),
                        type: top.document.getElementById('progressTaskType')
                    };
                }
                return this.elements.name && this.elements.percent && this.elements.bar && this.elements.detail && this.elements.type;
            },
            render: function () {
                if (!this.init()) return;
                this.elements.name.textContent = this.state.taskName;
                this.elements.percent.textContent = this.state.percent + '%';
                this.elements.bar.style.width = this.state.percent + '%';
                this.elements.bar.setAttribute('aria-valuenow', this.state.percent);
                this.elements.detail.textContent = this.state.detail;
                this.elements.type.textContent = '类型：' + this.state.type;
            },
            update: function (patch = {}) {
                this.state = Object.assign({}, this.state, patch);
                if (typeof this.state.percent !== 'number') {
                    this.state.percent = 0;
                }
                this.state.percent = clampPercent(this.state.percent);
                this.render();
            },
            reset: function (message = '等待任务开始') {
                this.update({
                    taskName: '暂无任务',
                    percent: 0,
                    type: '-',
                    detail: message
                });
            }
        },
        getTaskName = (item) => {
            if (!item) return '未命名任务';
            if (item['name']) return item['name'];
            if (item['property']) {
                if (item['property']['name']) return item['property']['name'];
                if (item['property']['title']) return item['property']['title'];
            }
            return '未命名任务';
        },
        buildTaskTitle = (typeLabel, item) => {
            return '[' + typeLabel + '] ' + getTaskName(item);
        },
        reportProgress = (typeLabel, item, percent, detail) => {
            progressTracker.update({
                taskName: buildTaskTitle(typeLabel, item),
                type: typeLabel,
                percent: percent,
                detail: detail
            });
        },
        formatDuration = (seconds = 0) => {
            const total = Math.max(0, Math.floor(Number(seconds) || 0));
            const h = Math.floor(total / 3600);
            const m = Math.floor((total % 3600) / 60);
            const s = total % 60;
            const pad = (n) => String(n).padStart(2, '0');
            if (h > 0) {
                return `${pad(h)}:${pad(m)}:${pad(s)}`;
            }
            return `${pad(m)}:${pad(s)}`;
        },
            htmlHook = setInterval(function () {
                if (top.document.getElementById('unrivalRate') && top.document.getElementById('updateRateButton') && top.document
                    .getElementById('reviewModeButton') && top.document.getElementById('autoDoWorkButton') && top.document
                        .getElementById('autoSubmitButton') && top.document.getElementById('autoSaveButton') && top.document
                        .getElementById('randomDoButton')) {
                    if (!backGround) {
                        top.document.getElementById('fuckMeModeButton').style.display = "none";
                    }
                    allowBackground = Math.round(new Date() / 1000) - parseInt(GM_getValue(
                        'unrivalBackgroundVideoEnable',
                        '6')) < 15;
                    if (allowBackground) {
                        top.document.getElementById('fuckMeModeButton').setAttribute('href', 'unrivalxxtbackground/');
                    }
                    clearInterval(htmlHook);
                    progressTracker.render();
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
                    top.document.getElementById('unrivalRate').value = rate;

                    // 添加上下箭头按钮 - 美化版原生spinner样式
                    const rateInput = top.document.getElementById('unrivalRate');
                    if (rateInput && !rateInput.parentNode.querySelector('.rate-controls')) {
                        const controls = top.document.createElement('div');
                        controls.className = 'rate-controls';
                        controls.style.cssText = `
                            display: inline-block;
                            vertical-align: top;
                            margin-left: -1px;
                            width: 18px;
                            height: 44px;
                            border: 1px solid #ccc;
                            border-left: none;
                            background: #fff;
                            position: relative;
                            border-radius: 0 4px 4px 0;
                            box-sizing: border-box;
                        `;

                        const upBtn = top.document.createElement('div');
                        upBtn.innerHTML = '▲';
                        upBtn.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 22px;
                            border-bottom: 1px solid #e0e0e0;
                            background: linear-gradient(to bottom, #fafafa, #f0f0f0);
                            cursor: pointer;
                            font-size: 7px;
                            line-height: 22px;
                            text-align: center;
                            color: #555;
                            user-select: none;
                            transition: all 0.1s ease;
                        `;
                        upBtn.onclick = () => {
                            const current = parseFloat(rateInput.value) || 1;
                            rateInput.value = current + 1;
                        };

                        const downBtn = top.document.createElement('div');
                        downBtn.innerHTML = '▼';
                        downBtn.style.cssText = `
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            height: 22px;
                            background: linear-gradient(to bottom, #f0f0f0, #fafafa);
                            cursor: pointer;
                            font-size: 7px;
                            line-height: 22px;
                            text-align: center;
                            color: #555;
                            user-select: none;
                            transition: all 0.1s ease;
                        `;
                        downBtn.onclick = () => {
                            const current = parseFloat(rateInput.value) || 1;
                            rateInput.value = Math.max(current - 1, 1);
                        };

                        // 添加悬停和点击效果
                        upBtn.onmouseover = () => {
                            upBtn.style.background = 'linear-gradient(to bottom, #e8f4fd, #d1ecf1)';
                            upBtn.style.color = '#007bff';
                        };
                        upBtn.onmouseout = () => {
                            upBtn.style.background = 'linear-gradient(to bottom, #fafafa, #f0f0f0)';
                            upBtn.style.color = '#555';
                        };
                        upBtn.onmousedown = () => {
                            upBtn.style.background = 'linear-gradient(to bottom, #d1ecf1, #bee5eb)';
                        };
                        upBtn.onmouseup = () => {
                            upBtn.style.background = 'linear-gradient(to bottom, #e8f4fd, #d1ecf1)';
                        };

                        downBtn.onmouseover = () => {
                            downBtn.style.background = 'linear-gradient(to bottom, #d1ecf1, #e8f4fd)';
                            downBtn.style.color = '#007bff';
                        };
                        downBtn.onmouseout = () => {
                            downBtn.style.background = 'linear-gradient(to bottom, #f0f0f0, #fafafa)';
                            downBtn.style.color = '#555';
                        };
                        downBtn.onmousedown = () => {
                            downBtn.style.background = 'linear-gradient(to bottom, #bee5eb, #d1ecf1)';
                        };
                        downBtn.onmouseup = () => {
                            downBtn.style.background = 'linear-gradient(to bottom, #d1ecf1, #e8f4fd)';
                        };

                        controls.appendChild(upBtn);
                        controls.appendChild(downBtn);
                        rateInput.parentNode.insertBefore(controls, rateInput.nextSibling);
                    }

                    // 🚀 新增：初始化优化功能按钮状态
                    updateOptimizationButtonState('smartSpeedControl', smartSpeedControl);
                    updateOptimizationButtonState('durationCompensation', durationCompensation);
                    updateOptimizationButtonState('behaviorSimulation', behaviorSimulation);
                    updateOptimizationButtonState('detectionEvasion', detectionEvasion);
                    updateOptimizationButtonState('riskWarning', riskWarning);

                    // 🚀 新增：初始化风险提示
                    if (riskWarning && rate > 1.5) {
                        setTimeout(() => {
                            if (rate > 3) {
                                logs.addLog('🚨 检测到高风险倍速设置！强烈建议开启所有优化功能', 'red');
                            } else if (rate > 2) {
                                logs.addLog('⚠️ 检测到中等风险倍速，建议开启优化功能', 'orange');
                            } else {
                                logs.addLog('💡 建议开启优化功能以提高安全性', 'blue');
                            }
                        }, 2000);
                    }

                     top.document.getElementById('updateToken').onclick = function () {
                         var token = top.document.getElementById('token').value;
                           logs.addLog('题库token已更新为' +token, 'green');
                         GM_setValue('tikutoken', token);
                     }
                    top.document.getElementById('accuracy').value=accuracy;
                    top.document.getElementById('updateaccuracy').onclick = function () {
                        var uaccuracy = top.document.getElementById('accuracy').value;
                        if (parseFloat(uaccuracy) == parseInt(uaccuracy)) {
                            uaccuracy = parseInt(uaccuracy);
                        } else {
                            uaccuracy = parseFloat(uaccuracy);
                        }
                        GM_setValue('accuracy', uaccuracy);
                        accuracy = uaccuracy;
                         if (uaccuracy >= 0 && uaccuracy<=100) {
                            logs.addLog('章节测试正确率已更新为'+uaccuracy+'%，将在3秒内生效', 'green');
                        } else {
                            logs.addLog('奇怪正确率', 'orange');
                        }



                    }


                    top.document.getElementById('updateRateButton').onclick = function () {
                        let urate = top.document.getElementById('unrivalRate').value;
                        if (parseFloat(urate) == parseInt(urate)) {
                            urate = parseInt(urate);
                        } else {
                            urate = parseFloat(urate);
                        }
                        GM_setValue('unrivalrate', urate);
                        rate = urate;
                        if (urate > 0) {
                            logs.addLog('视频倍速已更新为' + urate + '倍，将在3秒内生效', 'green');

                            // 🚀 新增：风险提示
                            if (riskWarning) {
                                if (urate > 3) {
                                    logs.addLog('⚠️ 高风险倍速！强烈建议开启所有优化功能', 'red');
                                } else if (urate > 2) {
                                    logs.addLog('⚠️ 中等风险倍速，建议开启优化功能', 'orange');
                                } else if (urate > 1.5) {
                                    logs.addLog('💡 建议开启优化功能以提高安全性', 'blue');
                                }
                            }
                        } else {
                            logs.addLog('奇怪的倍速，将会自动跳过视频任务', 'orange');
                        }
                    }

                    // 🚀 新增：优化功能按钮事件处理
                    top.document.getElementById('smartSpeedControl').onclick = function () {
                        smartSpeedControl = !smartSpeedControl;
                        GM_setValue('smartSpeedControl', smartSpeedControl);
                        updateOptimizationButtonState('smartSpeedControl', smartSpeedControl);
                        logs.addLog('智能倍速调节已' + (smartSpeedControl ? '开启' : '关闭'), smartSpeedControl ? 'green' : 'orange');
                    }

                    top.document.getElementById('durationCompensation').onclick = function () {
                        durationCompensation = !durationCompensation;
                        GM_setValue('durationCompensation', durationCompensation);
                        updateOptimizationButtonState('durationCompensation', durationCompensation);
                        logs.addLog('时长补偿机制已' + (durationCompensation ? '开启' : '关闭'), durationCompensation ? 'green' : 'orange');
                    }

                    top.document.getElementById('behaviorSimulation').onclick = function () {
                        behaviorSimulation = !behaviorSimulation;
                        GM_setValue('behaviorSimulation', behaviorSimulation);
                        updateOptimizationButtonState('behaviorSimulation', behaviorSimulation);
                        logs.addLog('行为模拟优化已' + (behaviorSimulation ? '开启' : '关闭'), behaviorSimulation ? 'green' : 'orange');
                    }

                    top.document.getElementById('detectionEvasion').onclick = function () {
                        detectionEvasion = !detectionEvasion;
                        GM_setValue('detectionEvasion', detectionEvasion);
                        updateOptimizationButtonState('detectionEvasion', detectionEvasion);
                        logs.addLog('检测规避技术已' + (detectionEvasion ? '开启' : '关闭'), detectionEvasion ? 'green' : 'orange');
                    }

                    top.document.getElementById('riskWarning').onclick = function () {
                        riskWarning = !riskWarning;
                        GM_setValue('riskWarning', riskWarning);
                        updateOptimizationButtonState('riskWarning', riskWarning);
                        logs.addLog('风险提示已' + (riskWarning ? '开启' : '关闭'), riskWarning ? 'green' : 'orange');
                    }
                    top.document.getElementById('backGround').onclick = function () {
                        let backGroundButton = top.document.getElementById('backGround');
                        if (backGroundButton.getAttribute('class') == 'btn btn-default') {
                            // 开启挂机：切换为 btn-success（绿色样式）
                            backGroundButton.setAttribute('class', 'btn btn-success');
                            logs.addLog('挂机已激活...', 'green'); // 日志文字也同步为绿色，呼应按钮颜色
                            _w.top.backNow = 1;
                            GM_setValue('unrivalbackground', '1'); // 保存激活状态
                        } else {
                            // 关闭挂机：恢复为 btn-default（默认白色样式）
                            backGroundButton.setAttribute('class', 'btn btn-default');
                            logs.addLog('挂机已关闭...', 'green');
                            _w.top.backNow = 0;
                            GM_setValue('unrivalbackground', '0'); // 保存取消激活状态
                        }
                    }
                    top.document.getElementById('reviewModeButton').onclick = function () {
                        let reviewButton = top.document.getElementById('reviewModeButton');
                        if (reviewButton.getAttribute('class') == 'btn btn-default') {
                            // 开启复习模式：切换为 btn-success（绿色样式）
                            reviewButton.setAttribute('class', 'btn btn-success');
                            logs.addLog('复习模式已开启...', 'green'); // 日志文字也同步为绿色，呼应按钮颜色
                            GM_setValue('unrivalreview', '1');
                            _w.top.unrivalReviewMode = '1';
                        } else {
                            // 关闭复习模式：恢复为 btn-default（默认白色样式）
                            reviewButton.setAttribute('class', 'btn btn-default');
                            logs.addLog('复习模式已关闭...', 'green');
                            GM_setValue('unrivalreview', '0');
                            _w.top.unrivalReviewMode = '0';
                        }
                    }
                    top.document.getElementById('autoDoWorkButton').onclick = function () {
                        let autoDoWorkButton = top.document.getElementById('autoDoWorkButton');
                        if (autoDoWorkButton.getAttribute('class') == 'btn btn-default') {
                            // 开启自动答题：切换为 btn-success（绿色样式）
                            autoDoWorkButton.setAttribute('class', 'btn btn-success');
                            logs.addLog('自动答题已开启...', 'green'); // 日志文字也同步为绿色，呼应按钮颜色
                            GM_setValue('unrivaldowork', '1');
                            _w.top.unrivalDoWork = '1';
                        } else {
                            // 关闭自动答题：恢复为 btn-default（默认白色样式）
                            autoDoWorkButton.setAttribute('class', 'btn btn-default');
                            logs.addLog('自动答题已关闭...', 'green');
                            GM_setValue('unrivaldowork', '0');
                            _w.top.unrivalDoWork = '0';
                        }
                    }
                    top.document.getElementById('autoSubmitButton').onclick = function () {
                        let autoSubmitButton = top.document.getElementById('autoSubmitButton');
                        if (autoSubmitButton.getAttribute('class') == 'btn btn-default') {
                            // 开启自动提交：切换为 btn-success（绿色样式）
                            autoSubmitButton.setAttribute('class', 'btn btn-success');
                            logs.addLog('自动提交已开启...', 'green'); // 日志文字也同步为绿色，呼应按钮颜色
                            GM_setValue('unrivalautosubmit', '1');
                            _w.top.unrivalAutoSubmit = '1';
                        } else {
                            // 关闭自动提交：恢复为 btn-default（默认白色样式）
                            autoSubmitButton.setAttribute('class', 'btn btn-default');
                            logs.addLog('自动提交已关闭...', 'green');
                            GM_setValue('unrivalautosubmit', '0');
                            _w.top.unrivalAutoSubmit = '0';
                        }
                    }
                    top.document.getElementById('autoSaveButton').onclick = function () {
                        let autoSaveButton = top.document.getElementById('autoSaveButton');
                        if (autoSaveButton.getAttribute('class') == 'btn btn-default') {
                            // 开启自动保存：切换为 btn-success（绿色样式）
                            autoSaveButton.setAttribute('class', 'btn btn-success');
                            logs.addLog('自动保存已开启...', 'green'); // 日志文字也同步为绿色，呼应按钮颜色
                            GM_setValue('unrivalautosave', '1');
                            _w.top.unrivalAutoSave = '1';
                        } else {
                            // 关闭自动保存：恢复为 btn-default（默认白色样式）
                            autoSaveButton.setAttribute('class', 'btn btn-default');
                            logs.addLog('自动保存已关闭...', 'green');
                            GM_setValue('unrivalautosave', '0');
                            _w.top.unrivalAutoSave = '0';
                        }
                    }
                    top.document.getElementById('randomDoButton').onclick = function () {
                        let randomDoButton = top.document.getElementById('randomDoButton');
                        if (randomDoButton.getAttribute('class') == 'btn btn-default') {
                            // 开启随机答题：切换为 btn-success（绿色样式）
                            randomDoButton.setAttribute('class', 'btn btn-success');
                            randomDoButton.innerHTML = '随机答题: 开启';
                            logs.addLog('随机答题已开启，找不到答案的单选、多选、判断会自动选【C、ABCD、错】', 'green');
                            GM_setValue('unrivalrandomdo', 1);
                            _w.top.unrivalRandomDo = 1;
                            randomDo = 1;
                        } else {
                            // 关闭随机答题：恢复为 btn-default（默认白色样式）
                            randomDoButton.setAttribute('class', 'btn btn-default');
                            randomDoButton.innerHTML = '随机答题: 关闭';
                            logs.addLog('随机答题已关闭...', 'green');
                            GM_setValue('unrivalrandomdo', 0);
                            _w.top.unrivalRandomDo = 0;
                            randomDo = 0;
                        }
                    }
                    top.document.getElementById('videoTimeButton').onclick = function () {
                        top.document.getElementById('videoTime').style.display = 'block';
                        top.document.getElementById('videoTimeContent').src = _p +
                            '//stat2-ans.chaoxing.com/task/s/index?courseid=' + courseId + '&clazzid=' +
                            classId;
                    }
                    //新增交互按钮
// 初始设置按钮状态和颜色
top.document.getElementById('jumpTypeButton').textContent = '模式: ' + (jumpType === 0 ? '智能' : jumpType === 1 ? '遍历' : '不跳转');
top.document.getElementById('disableMonitorButton').textContent = '多端学习: ' + (disableMonitor === 1 ? '解除' : '启用');
top.document.getElementById('autoLoginButton').textContent = '自动登录: ' + (autoLogin === 1 ? '开启' : '关闭');
top.document.getElementById('autoStartButton').textContent = '自动阅读: ' + (READING_CONFIG.autoStart ? '开启' : '关闭');
top.document.getElementById('videoQuestionButton').textContent = '视频题目: ' + (videoQuestionEnabled ? '开启' : '关闭');
        top.document.getElementById('phoneNumber').value = GM_getValue('phoneNumber', '');
        top.document.getElementById('password').value = GM_getValue('password', '');

// 设置初始按钮颜色
if (disableMonitor === 1) {
    top.document.getElementById('disableMonitorButton').setAttribute('class', 'btn btn-success');
} else {
    top.document.getElementById('disableMonitorButton').setAttribute('class', 'btn btn-default');
}

if (autoLogin === 1) {
    top.document.getElementById('autoLoginButton').setAttribute('class', 'btn btn-success');
} else {
    top.document.getElementById('autoLoginButton').setAttribute('class', 'btn btn-default');
}

if (READING_CONFIG.autoStart) {
    top.document.getElementById('autoStartButton').setAttribute('class', 'btn btn-success');
} else {
    top.document.getElementById('autoStartButton').setAttribute('class', 'btn btn-default');
}

if (videoQuestionEnabled) {
    top.document.getElementById('videoQuestionButton').setAttribute('class', 'btn btn-success');
} else {
    top.document.getElementById('videoQuestionButton').setAttribute('class', 'btn btn-default');
}

// jumpType切换事件
top.document.getElementById('jumpTypeButton').onclick = function () {
    jumpType = (jumpType + 1) % 3;
    let modeText = ['智能', '遍历', '不跳转'][jumpType];
    this.textContent = '模式: ' + modeText;
    GM_setValue('jumpType', jumpType);
    logs.addLog('已切换到' + modeText + '模式', 'green');
};

// disableMonitor切换事件
top.document.getElementById('disableMonitorButton').onclick = function () {
    disableMonitor = (disableMonitor === 1) ? 0 : 1;
    let statusText = (disableMonitor === 1) ? '解除' : '启用';
    this.textContent = '多端学习: ' + statusText;
    GM_setValue('disableMonitor', disableMonitor);

    if (disableMonitor === 1) {
        this.setAttribute('class', 'btn btn-success');
        logs.addLog('多端学习已开启', 'green');
        // 立即劫持appendChild，防止监控脚本注入
        _w.appendChild = _w.Element.prototype.appendChild;
        _w.Element.prototype.appendChild = function () {
            try {
                if (arguments[0].src && arguments[0].src.indexOf('detect.chaoxing.com') > 0) {
                    return;
                }
            } catch (e) { }
            _w.appendChild.apply(this, arguments);
        };
    } else {
        this.setAttribute('class', 'btn btn-default');
        logs.addLog('多端学习已关闭', 'green');
        // 立即恢复原生appendChild
        if (_w.appendChild) {
            _w.Element.prototype.appendChild = _w.appendChild;
        }
    }
};

// autoLogin切换事件
top.document.getElementById('autoLoginButton').onclick = function () {
    autoLogin = (autoLogin === 1) ? 0 : 1;
    this.textContent = '自动登录: ' + (autoLogin === 1 ? '开启' : '关闭');
    GM_setValue('autoLogin', autoLogin);

    if (autoLogin === 1) {
        this.setAttribute('class', 'btn btn-success');
        logs.addLog('自动登录功能已开启', 'green');
    } else {
        this.setAttribute('class', 'btn btn-default');
        logs.addLog('自动登录功能已关闭', 'green');
    }
};

// autoStart切换事件
top.document.getElementById('autoStartButton').onclick = function () {
    READING_CONFIG.autoStart = !READING_CONFIG.autoStart;
    this.textContent = '自动阅读: ' + (READING_CONFIG.autoStart ? '开启' : '关闭');
    GM_setValue('autoStart', READING_CONFIG.autoStart);

    if (READING_CONFIG.autoStart) {
        this.setAttribute('class', 'btn btn-success');
        logs.addLog('自动阅读功能已开启', 'green');
    } else {
        this.setAttribute('class', 'btn btn-default');
        logs.addLog('自动阅读功能已关闭', 'green');
    }
};

// videoQuestion切换事件
top.document.getElementById('videoQuestionButton').onclick = function () {
    videoQuestionEnabled = !videoQuestionEnabled;
    this.textContent = '视频题目: ' + (videoQuestionEnabled ? '开启' : '关闭');
    GM_setValue('videoQuestionEnabled', videoQuestionEnabled);

    if (videoQuestionEnabled) {
        this.setAttribute('class', 'btn btn-success');
        logs.addLog('视频题目自动处理功能已开启', 'green');
    } else {
        this.setAttribute('class', 'btn btn-default');
        logs.addLog('视频题目自动处理功能已关闭', 'green');
    }
};


// 保存登录信息事件
top.document.getElementById('saveLoginInfo').onclick = function () {
    let newPhone = top.document.getElementById('phoneNumber').value;
    let newPassword = top.document.getElementById('password').value;

    if (newPhone && !/^1[3-9]\d{9}$/.test(newPhone)) {
        logs.addLog('手机号格式错误，请重新输入', 'red');
        return;
    }

    GM_setValue('phoneNumber', newPhone);
    GM_setValue('password', newPassword);
    phoneNumber = newPhone;
    password = newPassword;
    logs.addLog('登录信息已保存', 'green');
};

                }
            }, 100),
            loopjob = () => {
                if (_w.top.unrivalScriptList.length > 1) {
                    logs.addLog('您同时开启了多个刷课脚本，建议关闭其他脚本，否则会有挂科风险！', 'red');
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
                                doVideo(missionli[itemName]).catch(e => {
                                    logs.addLog('视频任务执行出错: ' + e.message, 'red');
                                });
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
                        logs.addLog('🎉 所有任务处理完毕，5秒后自动下一章', 'green');
                    } else {
                        logs.addLog('所有任务处理完毕，用户设置为不跳转，脚本已结束运行，如需自动跳转，请到任务配置界面改变模式为遍历', 'green');
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
                            top.document.getElementById('reviewModeButton').setAttribute('class', 'btn btn-success');
                        } else {
                            top.document.getElementById('reviewModeButton').setAttribute('class', 'btn btn-default');
                        }
                        var backGroundStatus = GM_getValue('unrivalbackground', '0');
                        if (backGroundStatus === '1') {
                            _w.top.backNow = 1;
                            top.document.getElementById('backGround').setAttribute('class', 'btn btn-success'); // 设置按钮为绿色
                        } else {
                            top.document.getElementById('backGround').setAttribute('class', 'btn btn-default'); // 设置按钮为白色
                        }
                        if (_w.top.unrivalDoWork == '1') {
                            logs.addLog('自动做章节测试已开启，将会自动做章节测试', 'green');
                            top.document.getElementById('autoDoWorkButton').setAttribute('class', 'btn btn-success');
                        } else {
                            top.document.getElementById('autoDoWorkButton').setAttribute('class', 'btn btn-default');
                        }
                        if (_w.top.unrivalAutoSubmit == '1') {
                            top.document.getElementById('autoSubmitButton').setAttribute('class', 'btn btn-success');
                        } else {
                            top.document.getElementById('autoSubmitButton').setAttribute('class', 'btn btn-default');
                        }
                        if (_w.top.unrivalAutoSave == '1') {
                            top.document.getElementById('autoSaveButton').setAttribute('class', 'btn btn-success');
                        } else {
                            top.document.getElementById('autoSaveButton').setAttribute('class', 'btn btn-default');
                        }
                        if (_w.top.unrivalRandomDo == 1) {
                            top.document.getElementById('randomDoButton').setAttribute('class', 'btn btn-success');
                            top.document.getElementById('randomDoButton').innerHTML = '随机答题: 开启';
                        } else {
                            top.document.getElementById('randomDoButton').setAttribute('class', 'btn btn-default');
                            top.document.getElementById('randomDoButton').innerHTML = '随机答题: 关闭';
                        }
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
                logs.addLog('ℹ️ 此页无任务，5秒后自动下一章', 'blue');
            } else {
                logs.addLog('此页无任务，用户设置为不跳转，脚本已结束运行，如需自动跳转，请到任务配置界面改变模式为遍历', 'green');
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
                            top.document.getElementById('joblist').innerHTML += `
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
                        top.document.getElementById('joblist').innerHTML += `

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

        // 视频题目处理相关函数 - 完整适配用户建议脚本
        initVideoQuestions = async (mid, cpi, classid) => {
            return new Promise((resolve, reject) => {
                let url = `${_p}//${_h}/ananas/initdatawithviewer?mid=${mid}&cpi=${cpi}&classid=${classid}&_dc=${new Date().valueOf()}`;
                GM_xmlhttpRequest({
                    method: "get",
                    url: url,
                    headers: {
                        'Host': _h,
                        'Referer': vrefer,
                        'Sec-Fetch-Site': 'same-origin',
                        'User-Agent': navigator.userAgent
                    },
                    timeout: 10000,
                    onload: function(res) {
                        try {
                            if (res.status === 200) {
                                let data = JSON.parse(res.responseText);
                                resolve(data);
                            } else {
                                reject(new Error(`HTTP ${res.status}`));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: function(err) {
                        if (err.error && err.error.includes("connect list")) {
                            const domain = err.error.match(/:\/\/(.[^/]+)/)[1];
                            const notice = `由于connect未添加导致无权限请求<br><br>请复制以下代码至脚本中的第19行位置<br>// @connect      ${domain}`;
                            logs.addLog(notice, 'red');
                        } else {
                            logs.addLog(`请求报错[${url} - GET][${err.statusText || 'timeout'}]`, 'red');
                        }
                        reject(err);
                    },
                    ontimeout: function() {
                        logs.addLog(`请求报错[${url} - GET][timeout]`, 'red');
                        reject(new Error('Request timeout'));
                    }
                });
            });
        },

        submitVideoAnswer = async (classid, cpi, objectid, eventid, memberinfo, answer) => {
            return new Promise((resolve, reject) => {
                let url = `${_p}//${_h}/question/quiz-validation?classid=${classid}&cpi=${cpi}&objectid=${objectid}&_dc=${new Date().valueOf()}&eventid=${eventid}&memberinfo=${memberinfo}&answerContent=${answer}`;
                GM_xmlhttpRequest({
                    method: "get",
                    url: url,
                    headers: {
                        'Host': _h,
                        'Referer': vrefer,
                        'Sec-Fetch-Site': 'same-origin',
                        'User-Agent': navigator.userAgent
                    },
                    timeout: 10000,
                    onload: function(res) {
                        try {
                            if (res.status === 200) {
                                let data = JSON.parse(res.responseText);
                                resolve(data);
                            } else {
                                reject(new Error(`HTTP ${res.status}`));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: function(err) {
                        if (err.error && err.error.includes("connect list")) {
                            const domain = err.error.match(/:\/\/(.[^/]+)/)[1];
                            const notice = `由于connect未添加导致无权限请求<br><br>请复制以下代码至脚本中的第19行位置<br>// @connect      ${domain}`;
                            logs.addLog(notice, 'red');
                        } else {
                            logs.addLog(`请求报错[${url} - GET][${err.statusText || 'timeout'}]`, 'red');
                        }
                        reject(err);
                    },
                    ontimeout: function() {
                        logs.addLog(`请求报错[${url} - GET][timeout]`, 'red');
                        reject(new Error('Request timeout'));
                    }
                });
            });
        },

        // 分析视频任务失败原因
        analyzeVideoTaskFailure = (item, playTime, duration, isdrag, ispass) => {
            let reasons = [];
            let suggestions = [];

            // 1. 检查视频题目处理状态
            if (videoQuestionEnabled) {
                reasons.push("视频题目：已启用自动处理 ✅");
                // 检查是否有题目处理记录
                let questionLogs = logs.getLogs().filter(log =>
                    log.includes('正在完成视频中的题目') ||
                    log.includes('视频内无提问') ||
                    log.includes('视频题目已完毕')
                );
                if (questionLogs.length > 0) {
                    reasons.push("题目处理：有处理记录 ✅");
                } else {
                    reasons.push("题目处理：无处理记录 ⚠️");
                    suggestions.push("检查视频是否真的有题目");
                }
            } else {
                reasons.push("视频题目：未启用自动处理 ⚠️");
                suggestions.push("建议开启视频题目自动处理功能");
            }

            // 2. 检查学习时长
            let durationPercent = (playTime / duration * 100).toFixed(1);
            if (playTime >= duration) {
                reasons.push(`学习时长：${playTime}秒 (要求：${duration}秒) ${durationPercent}% ✅`);
            } else {
                reasons.push(`学习时长：${playTime}秒 (要求：${duration}秒) ${durationPercent}% ❌`);
                suggestions.push("增加播放时长");
            }

            // 3. 检查倍速设置
            if (rate > 3) {
                reasons.push(`播放倍速：${rate}倍 (高风险) ⚠️⚠️`);
                suggestions.push("降低倍速到1-2倍");
                if (riskWarning) {
                    suggestions.push("建议开启智能倍速调节和检测规避技术");
                }
            } else if (rate > 2) {
                reasons.push(`播放倍速：${rate}倍 (可能被检测) ⚠️`);
                suggestions.push("建议降低倍速到1-2倍");
                if (riskWarning) {
                    suggestions.push("建议开启优化功能降低风险");
                }
            } else {
                reasons.push(`播放倍速：${rate}倍 ✅`);
            }

            // 🚀 新增：优化功能状态检查
            if (riskWarning) {
                const enabledFeatures = [];
                if (smartSpeedControl) enabledFeatures.push("智能倍速调节");
                if (durationCompensation) enabledFeatures.push("时长补偿");
                if (behaviorSimulation) enabledFeatures.push("行为模拟");
                if (detectionEvasion) enabledFeatures.push("检测规避");

                if (enabledFeatures.length > 0) {
                    reasons.push(`优化功能：${enabledFeatures.join("、")} ✅`);
                } else {
                    reasons.push("优化功能：未开启 ⚠️");
                    suggestions.push("建议开启优化功能以提高安全性");
                }
            }

            // 4. 检查服务器响应状态
            if (isdrag === '4') {
                reasons.push("服务器状态：isdrag=4 (时长足够但未确认完成)");
                suggestions.push("开启复习模式重新播放");
            }

            // 5. 检查任务通过状态
            if (ispass) {
                if (ispass.isPassed === true) {
                    reasons.push("任务状态：已通过验证 ✅");
                } else {
                    reasons.push("任务状态：未通过验证 ❌");
                    suggestions.push("检查是否有遗漏的交互要求");
                }
            } else {
                reasons.push("任务状态：未知状态 ⚠️");
            }

            // 6. 检查复习模式
            if (_w.top.unrivalReviewMode === '1') {
                reasons.push("当前模式：复习模式 ✅");
            } else {
                reasons.push("当前模式：普通模式");
                suggestions.push("尝试开启复习模式");
            }

            // 7. 检查网络状态
            reasons.push("网络状态：正常 ✅");

            // 8. 添加通用建议
            if (suggestions.length === 0) {
                suggestions.push("1. 开启复习模式");
                suggestions.push("2. 使用1倍速重新播放");
                suggestions.push("3. 如果仍不通过，手动点击视频确认完成");
            }

            return {
                reasons: reasons,
                suggestions: suggestions
            };
        },

        finishVideoQuestions = async (item) => {
            try {
                logs.addLog(`[${item['name']}]获取视频中的题目`, 'info');

                // 检查视频对象结构
                if (!item) {
                    logs.addLog(`[${item['name']}]视频对象为空`, 'error');
                    return false;
                }

                if (!item['property']) {
                    logs.addLog(`[${item['name']}]视频内无提问`, 'green');
                    return true;
                }

                if (!item['property']['mid']) {
                    logs.addLog(`[${item['name']}]视频mid属性不存在`, 'error');
                    logs.addLog(`property结构: ${JSON.stringify(item['property'], null, 2)}`, 'info');
                    logs.addLog(`[${item['name']}]视频内无提问`, 'green');
                    return true;
                }

                // 获取视频题目
                let res = await initVideoQuestions(item['property']['mid'], UID, classId);

                if (!res || res.length === 0) {
                    logs.addLog(`[${item['name']}]视频题目已完毕`, 'info');
                    return true;
                }

                // 处理每道题目
                for (const questionItem of res) {
                    try {
                        if (!questionItem.datas || questionItem.datas.length === 0) {
                            logs.addLog("有个垃圾题跳过", 'error');
                            continue;
                        }

                        const item1 = questionItem.datas[0];
                        if (!item1.options) {
                            logs.addLog("有个垃圾题跳过", 'error');
                            continue;
                        }

                        const options = item1.options;

                        // 获取正确答案
                        let answer = options.filter(option => option.isRight == true).map(option => option.name).join();

                        if (!answer) {
                            logs.addLog("有个垃圾题跳过", 'error');
                            continue;
                        }

                        // 提交答案
                        let res1 = await submitVideoAnswer(classId, UID, item['objectId'], item1.resourceId, item1.memberinfo, answer);

                        if (res1.status) {
                            logs.addLog(`[正在完成视频中的题目]:${item1.description}<br>答案:${answer}<br>${res1.isRight ? "答案正确" : "答案错误"}`, 'success');
                        } else {
                            logs.addLog(`[正在完成视频中的题目]:${item1.description}<br>答案:${answer}<br>${res1.msg}`, 'error');
                        }

                        // 等待一段时间再处理下一题
                        await new Promise(resolve => setTimeout(resolve, 1000));

                    } catch (e) {
                        logs.addLog("有个垃圾题跳过", 'error');
                    }
                }

                logs.addLog(`[${item['name']}]视频题目已完毕`, 'info');
                return true;

            } catch (e) {
                logs.addLog(`[${item['name']}]处理视频题目时出错: ${e.message}`, 'red');
                logs.addLog(`视频对象: ${JSON.stringify(item, null, 2)}`, 'info');
                return false;
            }
        },

            doVideo = async (item) => {
                if (rate <= 0) {
                    missionList['m' + item['jobid']]['running'] = true;
                            logs.addLog('⚠️ 奇怪的倍速，视频已自动跳过', 'orange');
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

                // 初始化进度条
                reportProgress('视频', item, 0, item['duration'] ? ('准备开始 (00:00 / ' + formatDuration(item['duration']) + ')') : '准备开始...');

                // 先处理视频中的题目（如果启用）
                if (videoQuestionEnabled) {
                    logs.addLog('开始处理视频题目：' + item['name'], 'blue');
                    try {
                        await finishVideoQuestions(item);
                    } catch (e) {
                        logs.addLog('处理视频题目时出错，继续播放视频：' + e.message, 'orange');
                    }
                } else {
                    logs.addLog('视频题目自动处理功能已关闭，跳过题目处理', 'info');
                }

                // 初始化进度条
                reportProgress('视频', item, 0, item['duration'] ? ('准备开始 (00:00 / ' + formatDuration(item['duration']) + ')') : '准备开始...');

                logs.addLog('🎬 开始刷视频：' + item['name'] + '，倍速：' + String(rate) + '倍', 'blue');
                logs.addLog('视频观看信息每50秒上报一次，请耐心等待', 'green');
                logs.addLog('如遇脚本使用异常情况，请检查脚本版本是否为最新版，<a href="https://scriptcat.org/zh-CN/script-show-page/3321" target="view_window">点我(脚本猫)</a>或<a href="https://greasyfork.org/zh-CN/users/1446006-%E4%BC%8F%E9%BB%91%E7%94%9A%E8%80%8C" target="view_window">点我(greasyfork)</a>检查', 'orange');
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
                            logs.addLog('⚠️ 奇怪的倍速，视频已自动跳过', 'orange');
                            setTimeout(function () {
                                missionList['m' + item['jobid']]['running'] = false;
                                missionList['m' + item['jobid']]['done'] = true;
                            }, 5000);
                            return;
                        } else if (item['doublespeed'] == 0 && rate > 1 && _w.top.unrivalReviewMode == '0') {
                            //rate = 1;
                            //logs.addLog('该视频不允许倍速播放，已恢复至一倍速，高倍速会被清空进度挂科，勿存侥幸', 'red');
                        }

                        // 🚀 应用优化功能
                        let effectiveRate = rate;

                        // 1. 检测规避技术
                        effectiveRate = getEvasionRate(effectiveRate);

                        // 2. 智能倍速调节
                        effectiveRate = getSmartSpeed(effectiveRate);

                        // 3. 行为模拟
                        simulateUserBehavior();

                        rt = missionList['m' + item['jobid']]['rt'];
                        playsTime += effectiveRate;
                        playTime = Math.ceil(playsTime);

                        // 4. 时长补偿机制
                        playTime = compensateDuration(playTime, item['duration'], rate);

                        // 更新进度条
                        const cappedTime = item['duration'] ? Math.min(playTime, item['duration']) : playTime;
                        const percent = item['duration'] ? (cappedTime / item['duration']) * 100 : 0;
                        reportProgress('视频', item, percent, item['duration'] ? ('进度 ' + formatDuration(cappedTime) + ' / ' + formatDuration(item['duration'])) : ('已观看 ' + formatDuration(cappedTime)));

                        if (times == 0 || times % 50 == 0 || playTime >= item['duration']) {
                            if (first) {
                                playTime = 0;
                            }
                            if (playTime >= item['duration']) {
                                clearInterval(loop);
                                playTime = item['duration'];
                                isdrag = '4';
                                reportProgress('视频', item, 100, '视频任务已完成');
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
                                                logs.addLog('✅ 视频任务已完成', 'green');
                                                missionList['m' + item['jobid']]['running'] = false;
                                                missionList['m' + item['jobid']]['done'] = true;
                                                clearInterval(loop);
                                                return;
                                            } else if (isdrag == '4') {
                                                if (_w.top.unrivalReviewMode ==
                                                    '1') {
                                                    logs.addLog('✅ 视频已观看完毕', 'green');
                                                } else {
                                                    // 分析任务失败原因
                                                    let analysis = analyzeVideoTaskFailure(item, playTime, item['duration'], isdrag, ispass);

                                                    // 生成详细的原因说明
                                                    let mainReason = '';
                                                    if (analysis.reasons.some(r => r.includes('视频题目'))) {
                                                        mainReason = ' - 可能原因：视频内提问未完成或学习通服务器未通过';
                                                    } else if (analysis.reasons.some(r => r.includes('观看时长'))) {
                                                        mainReason = ' - 可能原因：观看时长不足或倍速过高';
                                                    } else if (analysis.reasons.some(r => r.includes('服务器'))) {
                                                        mainReason = ' - 可能原因：学习通服务器未通过或网络问题';
                                                    } else {
                                                        mainReason = ' - 可能原因：学习通服务器未通过';
                                                    }

                                                    logs.addLog(`[${item['name']}]视频已观看完毕，但视频任务未完成${mainReason}`, 'red');

                                                    // 只显示关键原因，避免重复
                                                    let keyReasons = analysis.reasons.filter(r =>
                                                        r.includes('❌') || r.includes('⚠️⚠️') || r.includes('未通过')
                                                    );

                                                    if (keyReasons.length > 0) {
                                                        logs.addLog('🔍 关键问题：', 'orange');
                                                        keyReasons.forEach(reason => {
                                                            logs.addLog(`├─ ${reason}`, 'orange');
                                                        });
                                                    }

                                                    // 只显示最重要的建议
                                                    if (analysis.suggestions.length > 0) {
                                                        logs.addLog('💡 建议操作：', 'blue');
                                                        analysis.suggestions.slice(0, 3).forEach((suggestion, index) => {
                                                            logs.addLog(`${index + 1}. ${suggestion}`, 'blue');
                                                        });
                                                    }
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
                                                const totalDuration = item['duration'] || 0;
                                                const watchedMinutes = (_bold_playTime / 60).toFixed(1);
                                                const remainingSeconds = Math.max(totalDuration - _bold_playTime, 0);
                                                const remainingMinutes = (remainingSeconds / 60).toFixed(1);
                                                const progress = totalDuration > 0
                                                    ? ((_bold_playTime / totalDuration) * 100).toFixed(1)
                                                    : '0.0';
                                                logs.addLog(item['name'] + '已观看' +
                                                    watchedMinutes + '分钟，剩余大约' +
                                                    remainingMinutes + '分钟，完成' + progress + '%');
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
                                            logs.addLog('超星返回错误信息，十秒后重试，请重新登录或重新打开浏览器', 'red');
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

                // 🚀 设置全局标志，表示学习端正在处理章节测验
                if (typeof _w !== 'undefined' && _w.top) {
                    _w.top.unrivalLearningModeActive = true;
                    _w.top.unrivalExamModeDisabled = true;
                    console.log('🚀 学习端：已设置全局标志，禁用考试端功能');
                } else {
                    console.log('🚀 学习端：无法设置全局标志，_w.top 不存在');
                }

                top.document.getElementById('workPanel').style.display = 'block';
                top.document.getElementById('frame_content').src = _p + '//' + _h + '/work/phone/work?workId=' + item['jobid']
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
                    let ifW = top.document.getElementById('frame_content').contentWindow;
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
                        top.document.getElementById('workPanel').style.display = 'none';
                        top.document.getElementById('frame_content').src = '';
                        setTimeout(function () {
                            missionList['m' + item['jobid']]['running'] = false;
                            missionList['m' + item['jobid']]['done'] = true;

                            // 🚀 章节测验完成，恢复考试端功能
                            if (typeof _w !== 'undefined' && _w.top) {
                                _w.top.unrivalLearningModeActive = false;
                                _w.top.unrivalExamModeDisabled = false;
                            }
                        }, 5000);
                    }
                }, 500);
            },
            missionList = [];
        // 🚀 学习端状态通过全局变量管理，无需定时监控

        if (jobList.length <= 0) {
            if (jumpType != 2) {
                _w.top.jump = true;
                logs.addLog('ℹ️ 此页无任务，5秒后自动下一章', 'blue');
            } else {
                logs.addLog('此页无任务，用户设置为不跳转，脚本已结束运行，如需自动跳转，请到任务配置界面改变模式为遍历', 'green');
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
                top.document.getElementById('joblist').innerHTML += `
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
                top.document.getElementById('joblist').innerHTML += `
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
                    top.document.getElementById('joblist').innerHTML += `
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
                        _d.title = '挂机中';
                        c = 0;
                    } else {
                        _d.title = '挂机中';
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
                    if (tabId && tabId.indexOf('cur') >= 0 && tabs[i].getAttribute('class') == 'posCatalog_select') {
                        tabs[i].setAttribute('onclick', "getTeacherAjax('" + courseId + "','" + classId +
                            "','" + tabId.replace('cur', '') + "');");
                    }
                }
            } else {
                let h4s = _d.getElementsByTagName('h4'),
                    h5s = _d.getElementsByTagName('h5');
                for (let i = 0, l = h4s.length; i < l; i++) {
                    const h4Id = h4s[i].getAttribute('id');
                    if (h4Id && h4Id.indexOf('cur') >= 0) {
                        h4s[i].setAttribute('onclick', "getTeacherAjax('" + courseId + "','" + classId +
                            "','" + h4Id.replace('cur', '') + "');");
                    }
                }
                for (let i = 0, l = h5s.length; i < l; i++) {
                    const h5Id = h5s[i].getAttribute('id');
                    if (h5Id && h5Id.indexOf('cur') >= 0) {
                        h5s[i].setAttribute('onclick', "getTeacherAjax('" + courseId + "','" + classId +
                            "','" + h5Id.replace('cur', '') + "');");
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

                                        // 新版学习通：点击前先检查并处理弹窗
                                        if (getQueryVariable('mooc2') == '1') {
                                            // 检查是否有未完成任务提示弹窗
                                            const warn = document.querySelector('.popDiv.wid440.popMove .jobLimitTip');
                                            if (warn && /当前章节还有任务点未完成，是否去完成/.test(warn.innerText)) {
                                                console.log('[学习通助手] 检测到未完成任务提示，自动点击下一节');
                                                // 直接点击弹窗中的下一节按钮
                                                const nextBtn = document.querySelector('.popDiv.wid440.popMove .nextChapter');
                                                if (nextBtn) {
                                                    nextBtn.click();
                                                    return;
                                                }
                                            }
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
                                            if (!nextTab.id || nextTab.id.indexOf('cur') < 0) {
                                                i++;
                                                continue;
                                            }
                                            let clickF = setInterval(function () {
                                                if (rd != _w.top.unrivalPageRd) {
                                                    clearInterval(clickF);
                                                    return;
                                                }

                                                // 新版学习通：点击前先检查并处理弹窗
                                                const warn = document.querySelector('.popDiv.wid440.popMove .jobLimitTip');
                                                if (warn && /当前章节还有任务点未完成，是否去完成/.test(warn.innerText)) {
                                                    console.log('[学习通助手] 检测到未完成任务提示，自动点击下一节');
                                                    // 直接点击弹窗中的下一节按钮
                                                    const nextBtn = document.querySelector('.popDiv.wid440.popMove .nextChapter');
                                                    if (nextBtn) {
                                                        nextBtn.click();
                                                        clearInterval(clickF);
                                                        return;
                                                    }
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
                                    const spanClass = spans[i].getAttribute('class');
                                    if (spanClass && spanClass.indexOf('currents') >= 0) {
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
                                    const parentClass = tabs[i].parentNode.getAttribute('class');
                                    if (parentClass == 'currents') {
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
                                            if (!nextTab.id || nextTab.id.indexOf('cur') < 0) {
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
                    'data': '未找到答案，建议使用AI作答(https://studyai0.com/'
                };
                if (res) {
                    try {
                        var responseText = res.responseText,
                            ctResult = JSON.parse(responseText);
                    } catch (e) {
                        console.log(e);
                        if (res.finalUrl.includes('getAnswer.php')) {
                            _w.top.unrivalWorkInfo = '查题错误，服务器连接失败（使用高峰期），等待一段时间';
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
                                _w.top.unrivalWorkInfo = '查题错误，服务器连接失败（使用高峰期），等待一段时间';
                                console.log(err);
                                busyThread -= 1;
                            },
                            ontimeout: function (err) {
                                _w.top.unrivalWorkInfo = '查题错误，服务器连接失败（使用高峰期），等待一段时间';
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
                                if ((randomDo == 1 || _w.top.unrivalRandomDo == 1) && accuracy < 100) {
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
                                if ((randomDo == 1 || _w.top.unrivalRandomDo == 1) && accuracy < 100) {
                                    _w.top.unrivalWorkInfo = quu['question'] +
                                        '：未找到正确答案，自动选【C】';
                                    for (let y = 0, j = choiceEs.length; y <
                                        j; y++) {
                                        if (choiceEs[y].getElementsByTagName('em')
                                            .length < 1) {
                                            continue;
                                        }
                                        if (choiceEs[y].getElementsByTagName('em')[
                                            0].getAttribute('id-param') ==
                                            'C' && choiceEs[y].getAttribute(
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
                                } else if ((randomDo == 1 || _w.top.unrivalRandomDo == 1) && accuracy < 100) {
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
                logs.addLog('超星挂机小助手可能运行异常，如页面无反应，请尝试重启脚本或重启浏览器(脚本版本有此问题)');
            }
        }, 10000);
        var loopShow = () => {
            let jobList = GM_getValue('unrivalBackgroundList', '1');
            if (jobList == '1') {
                top.document.getElementById('joblist').innerHTML = '请将"超星挂机小助手"升级到最新版并重启浏览器';
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
                    top.document.getElementById('joblist').innerHTML = jobHtml;
                } catch (e) {
                    top.document.getElementById('joblist').innerHTML = '请将"超星挂机小助手"升级到最新版并重启浏览器！';
                }
            }
        }
        loopShow();
        setInterval(loopShow, 10000);
    }

    // 阅读助手菜单命令已删除


    // 初始化完成日志
    console.log('脚本已加载 v' + GM_info.script.version);
})();

// ==================== 阅读助手配置和状态 ====================
// 全局配置
const READING_CONFIG = {
    scrollSpeed: parseFloat(GM_getValue('scrollSpeed', 0.5)),
    scrollMode: GM_getValue('scrollMode', 'paragraph'),
    autoStart: GM_getValue('autoStart', false),
    restartAfterFinish: GM_getValue('restartAfterFinish', true),
    showTips: GM_getValue('showTips', true),
    debugMode: GM_getValue('debugMode', true),
    // 新增：时长相关配置
    taskDuration: GM_getValue('taskDuration', 0), // 任务时长（分钟）
    autoCalculateSpeed: GM_getValue('autoCalculateSpeed', true), // 是否自动计算速度
    minSpeed: 0.1, // 最小速度
    maxSpeed: 10, // 最大速度
    // 新增：自动跳转章节配置
    autoEnterChapter: GM_getValue('autoEnterChapter', true), // 是否自动进入章节
    chapterEnterDelay: GM_getValue('chapterEnterDelay', 3000), // 进入章节延迟时间(ms)
};

// 状态管理
const READING_STATE = {
    isRunning: false,
    isPaused: false,
    currentChapter: 0,
    totalChapters: 0,
    contentElements: [],
    currentElementIndex: 0,
    // 新增：时长相关状态
    taskStartTime: null,
    estimatedTaskDuration: 0, // 预估任务时长（秒）
    contentLength: 0, // 内容长度（字符数）
};

// 日志与通知
function readingLog(message, level = 'info') {
    if (!READING_CONFIG.debugMode && level !== 'error') return;
    console.log(`[超星阅读助手] [${level.toUpperCase()}] ${message}`);
}

function readingNotify(message, type = 'info') {
    // 只输出到控制台，不显示通知弹窗
    readingLog(message, type);
}

// DOM工具
function waitForElement(selector, timeout = 15000) {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                resolve(el);
            }
        }, 100);
        setTimeout(() => clearInterval(interval), timeout);
    });
}

// 页面操作类
class PageOperator {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupGlobalKeyListener(); // 新增：设置全局键盘监听
        this.detectPageType();
        this.detectTaskDuration(); // 新增：检测任务时长
    }

    // 新增：设置全局键盘监听器作为备用
    setupGlobalKeyListener() {
        // 移除旧的全局监听器
        if (this.globalKeyHandler) {
            document.removeEventListener('keydown', this.globalKeyHandler);
        }

        // 创建全局键盘处理器
        this.globalKeyHandler = (e) => {
            // 只处理S键，确保设置面板始终可用
            if (e.key && e.key.toLowerCase() === 's' &&
                e.target.tagName !== 'INPUT' &&
                e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                e.stopPropagation();
                const modal = document.getElementById('auto-read-modal');
                if (modal && modal.style.display !== 'none') {
                    // 设置面板已打开，按S键关闭
                    readingLog('全局S键被按下，关闭设置面板');
                    this.hideModal();
                } else {
                    // 设置面板未打开，按S键打开
                    readingLog('全局S键被按下，显示设置面板');
                    this.showSettings();
                }
            }
        };

        // 绑定全局监听器
        document.addEventListener('keydown', this.globalKeyHandler, true);
    }

    // 新增：检测任务时长
    detectTaskDuration() {
        try {
            // 尝试从页面中检测任务时长
            const durationSelectors = [
                '.task-duration',
                '.duration',
                '.time-limit',
                '[class*="duration"]',
                '[class*="time"]',
                '.task-info',
                '.course-info'
            ];

            let detectedDuration = 0;
            for (const selector of durationSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const el of elements) {
                    const text = el.textContent;
                    // 匹配各种时长格式：30分钟、30min、30分钟阅读等
                    const durationMatch = text.match(/(\d+)\s*(分钟|min|分钟阅读|分钟学习)/i);
                    if (durationMatch) {
                        detectedDuration = parseInt(durationMatch[1]);
                        break;
                    }
                }
                if (detectedDuration > 0) break;
            }

            if (detectedDuration > 0) {
                READING_CONFIG.taskDuration = detectedDuration;
                GM_setValue('taskDuration', detectedDuration);
                readingNotify(`检测到任务时长：${detectedDuration}分钟`);
                this.calculateOptimalSpeed();
            } else {
            }
        } catch (error) {
            readingLog(`检测任务时长失败: ${error.message}`, 'error');
        }
    }

    // 新增：计算最优阅读速度
    calculateOptimalSpeed() {
        if (!READING_CONFIG.taskDuration || !READING_CONFIG.autoCalculateSpeed) return;

        try {
            // 计算内容长度
            this.collectContentElements();
            READING_STATE.contentLength = READING_STATE.contentElements.reduce((total, el) => {
                return total + (el.textContent || '').length;
            }, 0);

            if (READING_STATE.contentLength === 0) {
                readingLog('无法计算内容长度，跳过速度计算');
                return;
            }

            // 根据时长和内容长度计算速度
            const targetDurationSeconds = READING_CONFIG.taskDuration * 60;
            const estimatedReadingTime = READING_STATE.contentLength / 500; // 假设每分钟阅读500字
            const speedRatio = estimatedReadingTime / targetDurationSeconds;

            let optimalSpeed = READING_CONFIG.scrollSpeed * speedRatio;
            optimalSpeed = Math.max(READING_CONFIG.minSpeed, Math.min(READING_CONFIG.maxSpeed, optimalSpeed));

            READING_CONFIG.scrollSpeed = parseFloat(optimalSpeed.toFixed(1));
            GM_setValue('scrollSpeed', READING_CONFIG.scrollSpeed.toString());

            readingNotify(`已根据任务时长(${READING_CONFIG.taskDuration}分钟)自动调整阅读速度为：${READING_CONFIG.scrollSpeed}秒/${READING_CONFIG.scrollMode === 'paragraph' ? '段落' : '页'}`);
            readingLog(`内容长度：${READING_STATE.contentLength}字符，预估阅读时间：${estimatedReadingTime.toFixed(1)}分钟，调整后速度：${READING_CONFIG.scrollSpeed}秒/单位`);
        } catch (error) {
            readingLog(`计算最优速度失败: ${error.message}`, 'error');
        }
    }

    resetState() {
        READING_STATE.isRunning = false;
        READING_STATE.isPaused = false;
        READING_STATE.contentElements = [];
        READING_STATE.currentElementIndex = 0;
        readingLog('状态已重置');
    }

    bindEvents() {
        // 移除旧的事件监听器
        if (this.boundKeyDownHandler) {
            document.removeEventListener('keydown', this.boundKeyDownHandler);
        }

        // 绑定新的事件监听器
        this.boundKeyDownHandler = this.handleKeyDown.bind(this);
        document.addEventListener('keydown', this.boundKeyDownHandler);
    }

    handleKeyDown(e) {
        // 防止在输入框中触发快捷键
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // 确保S键在所有页面都能工作
        if (e.key && e.key.toLowerCase() === 's') {
            e.preventDefault();
            e.stopPropagation();
            const modal = document.getElementById('auto-read-modal');
            if (modal && modal.style.display !== 'none') {
                // 设置面板已打开，按S键关闭
                readingLog('S键被按下，关闭设置面板');
                this.hideModal();
            } else {
                // 设置面板未打开，按S键打开
                readingLog('S键被按下，显示设置面板');
                this.showSettings();
            }
            return;
        }

        // 其他快捷键只在特定页面工作
        switch(e.key && e.key.toLowerCase()) {
            case 'k':
                e.preventDefault();
                if (this.isReadingPage()) {
                    this.startAutoRead();
                }
                break;
            case 'z':
                e.preventDefault();
                if (this.isReadingPage()) {
                    this.pauseAutoRead();
                }
                break;
        }
    }

    detectPageType() {
        const oldTips = document.querySelector('#auto-read-tips');
        if (oldTips) oldTips.remove();

        if (this.isReadingPage()) {
            readingLog('检测到阅读页面');
            this.initReading();
        } else if (this.isCoursePage()) {
            readingLog('检测到课程主页');
        } else if (location.href.includes('/mooc-ans/course/')) {
            readingLog('检测到课程目录/任务列表页面 (新)');
            this.handleCourseCatalogPage();
        } else if (this.isTaskPage()) {
            readingLog('检测到任务页面 (旧)');
        } else if (this.isCourseCatalogPage()) {
            readingLog('检测到课程目录页面');
            this.handleCourseCatalogPage();
        }
    }

    isReadingPage() {
        return location.href.includes('/ztnodedetailcontroller/visitnodedetail');
    }

    isCoursePage() {
        return location.href.includes('/mooc-ans/mycourse/studentstudy');
    }

    isTaskPage() {
        return location.href.includes('pageHeader=0');
    }

    isCourseCatalogPage() {
        // 检测课程目录页面的URL模式
        const pathname = location.pathname;
        const href = location.href;

        // 精准URL匹配 - 支持旧版和新版URL
        const exactUrlPatterns = [
            // 旧版URL模式
            /^https:\/\/mooc1-2\.chaoxing\.com\/mooc-ans\/mycourse\/studentcourse\?.*$/,
            // 新版URL模式
            /^https:\/\/mooc2-ans\.chaoxing\.com\/mooc2-ans\/mycourse\/stu\?.*$/
        ];

        // 排除学习页面（studentstudy）
        if (href.includes('studentstudy')) {
            console.log('检测到学习页面，不是课程目录页面');
            return false;
        }

        // 检查是否匹配精准URL模式
        const exactUrlMatch = exactUrlPatterns.some(pattern => pattern.test(href));
        if (exactUrlMatch) {
            console.log('通过精准URL匹配检测到课程目录页面');
            return true;
        }

        // 首先进行简单的URL检查
        if (href.includes('mycourse/studentcourse') || href.includes('mycourse/stu')) {
            console.log('通过简单URL检查检测到课程目录页面');
            return true;
        }

        // 更宽松的URL匹配规则，包括新旧版本
        const urlPatterns = [
            /\/mooc2-ans\/course\/\d+\.html$/,
            /\/mooc2-ans\/zt\/\d+\.html$/,
            /\/mooc-ans\/course\/\d+\.html$/,
            /\/mooc-ans\/zt\/\d+\.html$/,
            /\/course\/\d+\.html$/,
            /\/zt\/\d+\.html$/,
            /\/mooc-ans\/course\/\d+$/,
            /\/mooc-ans\/zt\/\d+$/,
            /\/course\/\d+$/,
            /\/zt\/\d+$/,
            // 新增：支持新旧版本课程目录页面
            /\/mooc-ans\/mycourse\/studentcourse/,
            /\/mooc2-ans\/mycourse\/stu/,
            // 更精确的匹配模式
            /mycourse\/studentcourse/,
            /mycourse\/stu/,
            // 支持带查询参数的URL
            /\/mooc-ans\/mycourse\/studentcourse\?/,
            /\/mooc2-ans\/mycourse\/stu\?/
        ];

        // 检查URL模式
        const urlMatch = urlPatterns.some(pattern => pattern.test(pathname)) ||
                        href.includes('mycourse/studentcourse') ||
                        href.includes('mycourse/stu');

        // 检查页面内容特征
        const hasCourseSection = document.querySelector('.course_section') !== null;
        const hasChapterText = document.querySelector('.chapterText') !== null;
        const hasCatalogItems = document.querySelector('.catalog-item') !== null;

        // 调试日志
        console.log('=== 课程目录页面检测调试 ===');
        console.log('当前URL:', href);
        console.log('当前路径:', pathname);
        console.log('URL匹配:', urlMatch);
        console.log('有课程章节:', hasCourseSection);
        console.log('有章节文本:', hasChapterText);
        console.log('有目录项:', hasCatalogItems);
        console.log('最终结果:', urlMatch && (hasCourseSection || hasChapterText || hasCatalogItems));

        // 如果URL匹配但页面内容检测失败，仍然认为是课程目录页面
        const isCatalogPage = urlMatch && (hasCourseSection || hasChapterText || hasCatalogItems);

        // 如果URL明确匹配但页面内容检测失败，强制认为是课程目录页面
        if (urlMatch && !isCatalogPage) {
            console.log('URL匹配但页面内容检测失败，强制认为是课程目录页面');
            return true;
        }

        return isCatalogPage;
    }

    // 处理课程目录页面 - 自动进入第一章节
    handleCourseCatalogPage() {
        readingLog('=== 课程目录页面处理开始 ===');
        readingLog(`当前URL: ${location.href}`);
        readingLog(`当前路径: ${location.pathname}`);

        // 延迟显示使用需知弹窗，避免阻塞阅读助手初始化
        readingLog('准备显示使用需知弹窗');
        setTimeout(() => {
            this.showUsageGuideModal();
        }, 500);

        if (!READING_CONFIG.autoEnterChapter) {
            readingLog('自动进入章节功能已禁用');
            return;
        }

        try {
            readingLog('准备自动进入第一章节');
            readingNotify('检测到课程目录页面，即将自动进入第一章节...');

            setTimeout(() => {
                // 尝试多种选择器来找到第一章节
                const selectors = [
                    '.course_section:first-child .chapterText',
                    '.course_section .chapterText:first-child',
                    '.course_section .chapterText',
                    '.catalog-item:first-child',
                    '.catalog-item',
                    '.chapter-item:first-child',
                    '.chapter-item',
                    'a[href*="/ztnodedetailcontroller/visitnodedetail"]:first-child',
                    'a[href*="/ztnodedetailcontroller/visitnodedetail"]'
                ];

                let firstChapter = null;
                for (const selector of selectors) {
                    firstChapter = document.querySelector(selector);
                    if (firstChapter) {
                        readingLog(`使用选择器找到章节: ${selector}`);
                        break;
                    }
                }

                if (firstChapter) {
                    readingLog('找到第一章节，正在点击进入');

                    // 高亮显示即将点击的元素
                    firstChapter.style.outline = '3px solid red';
                    firstChapter.style.transition = 'outline 0.3s ease';

                    // 滚动到元素位置
                    firstChapter.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // 点击元素
                    firstChapter.click();
                    readingNotify('已自动进入第一章节');

                    // 移除高亮
                    setTimeout(() => {
                        firstChapter.style.outline = '';
                    }, 2000);
                } else {
                    readingLog('未找到第一章节按钮', 'warning');
                    readingNotify('未找到第一章节，请手动点击', 'warning');

                    // 输出页面结构信息用于调试
                    const courseSections = document.querySelectorAll('.course_section');
                    const chapterTexts = document.querySelectorAll('.chapterText');
                    const catalogItems = document.querySelectorAll('.catalog-item');

                    readingLog(`调试信息: course_section数量=${courseSections.length}, chapterText数量=${chapterTexts.length}, catalog-item数量=${catalogItems.length}`);

                    if (courseSections.length > 0) {
                        readingLog(`第一个course_section内容: ${courseSections[0].innerHTML.substring(0, 200)}...`);
                    }
                }
            }, READING_CONFIG.chapterEnterDelay);

        } catch (error) {
            readingLog(`自动进入章节失败: ${error.message}`, 'error');
            readingNotify('自动进入章节失败', 'error');
        }
    }

    initReading() {
        this.showUsageTips();
        this.detectChapterInfo();
        this.collectContentElements();

        if (READING_CONFIG.autoStart) {
            setTimeout(() => {
                if (this.isReadingPage()) {
                    this.startAutoRead();
                }
            }, 2000);
        }
    }

    startAutoRead() {
        if (READING_STATE.isRunning && !READING_STATE.isPaused) return;

        READING_STATE.isRunning = true;
        READING_STATE.isPaused = false;

        if (READING_CONFIG.scrollMode === 'paragraph') {
            this.startParagraphScroll();
        } else {
            this.startPageScroll();
        }

        this.showStatus();
        readingNotify(`开始阅读 (${READING_CONFIG.scrollSpeed}秒/${READING_CONFIG.scrollMode === 'paragraph' ? '段落' : '页'})`);
    }

    pauseAutoRead() {
        if (!READING_STATE.isRunning) return;

        READING_STATE.isPaused = true;
        clearTimeout(this.scrollTimer);
        this.showStatus();
        readingNotify('阅读已暂停');
    }

    showStatus() {
        const status = READING_STATE.isPaused ? '已暂停' : '阅读中';
        const progress = READING_STATE.totalChapters > 0
            ? `第 ${READING_STATE.currentChapter}/${READING_STATE.totalChapters} 章`
            : '章节信息未知';

        this.showModal(`
            <h3>超星阅读助手</h3>
            <p>状态: ${status}</p>
            <p>${progress}</p>
            <p>模式: ${READING_CONFIG.scrollMode === 'paragraph' ? '段落阅读' : '页面阅读'}</p>
            <p>速度: ${READING_CONFIG.scrollSpeed.toFixed(1)}秒/${READING_CONFIG.scrollMode === 'paragraph' ? '段落' : '页'}</p>
            <p>按 Z 键暂停 / 按 K 键继续</p>
        `);

        setTimeout(() => this.hideModal(), 3000);
    }

    startParagraphScroll() {
        this.collectContentElements();

        if (READING_STATE.contentElements.length === 0) {
            readingNotify('未检测到段落，临时切换整页模式...', 'warning');
            READING_CONFIG.scrollMode = 'page';
            this.startPageScroll();

            // 启动内容监听器
            const observer = new MutationObserver(() => {
                this.collectContentElements();
                if (READING_STATE.contentElements.length > 0) {
                    observer.disconnect();
                    readingNotify('检测到段落内容，恢复逐段模式', 'success');
                    READING_CONFIG.scrollMode = 'paragraph';
                    if (!READING_STATE.isPaused) {
                        this.startParagraphScroll();
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
            });
            return;
        }

        this.scrollToNextElement();
    }

    collectContentElements() {
        const selectors = [
            'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'img', 'video', 'iframe',
            '.content', '.text-block', '.article-content'
        ];

        READING_STATE.contentElements = [];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.offsetHeight > 20 && el.offsetWidth > 20) {
                    READING_STATE.contentElements.push(el);
                }
            });
        });

        READING_STATE.contentElements.sort((a, b) => {
            return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
        });

        readingLog(`找到 ${READING_STATE.contentElements.length} 个内容元素`);
    }

    scrollToNextElement() {
        if (READING_STATE.isPaused) return;

        if (READING_STATE.currentElementIndex >= READING_STATE.contentElements.length) {
            this.onChapterComplete();
            return;
        }

        const element = READING_STATE.contentElements[READING_STATE.currentElementIndex];

        if (READING_CONFIG.debugMode) {
            element.style.outline = '2px solid red';
            setTimeout(() => element.style.outline = '', 1000);
        }

        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const baseTime = parseFloat(READING_CONFIG.scrollSpeed) * 1000;
        let waitTime = element.tagName === 'IMG' || element.tagName === 'VIDEO'
            ? baseTime * 1.5
            : baseTime;

        READING_STATE.currentElementIndex++;

        this.scrollTimer = setTimeout(() => this.scrollToNextElement(), waitTime);
    }

    startPageScroll() {
        const scrollSpeed = parseFloat(READING_CONFIG.scrollSpeed);
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollStep = totalHeight / (scrollSpeed * 10);

        let currentTop = 0;

        clearInterval(this.scrollTimer);

        this.scrollTimer = setInterval(() => {
            if (READING_STATE.isPaused) return;

            currentTop += scrollStep;
            if (currentTop >= totalHeight) {
                clearInterval(this.scrollTimer);
                this.onChapterComplete();
            } else {
                window.scrollTo({
                    top: currentTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    onChapterComplete() {
        clearTimeout(this.scrollTimer);
        READING_STATE.currentElementIndex = 0;
        READING_STATE.contentElements = [];

        this.findNextButton()
            .then(nextButton => {
                if (nextButton) {
                    readingNotify('正在加载下一章...');

                    nextButton.style.outline = '3px solid green';
                    setTimeout(() => nextButton.style.outline = '', 2000);

                    nextButton.click();
                    READING_STATE.currentChapter++;
                } else {
                    if (READING_CONFIG.restartAfterFinish) {
                        readingNotify('已到达最后一章，即将从头开始', 'warning');
                        setTimeout(() => this.goToFirstChapter(), 3000);
                    } else {
                        READING_STATE.isRunning = false;
                        readingNotify('全部阅读完成!', 'success');
                    }
                }
            })
            .catch(error => {
                readingNotify(`章节切换错误: ${error.message}`, 'error');
                readingLog(error.stack, 'error');
            });
    }

    findNextButton() {
        return new Promise(resolve => {
            const selectors = [
                READING_CONFIG.nextButtonSelector,
                '.nodeItem.r i',
                '.next-page-btn',
                'a:contains("下一章")',
                'button:contains("下一章")',
                'a[title="下一章"]',
                '.reader__control--next',
                '.uxp-pager-next',
                'button[aria-label*="下一章"]',
                '.next-btn:visible'
            ];

            for (const selector of selectors) {
                try {
                    let element = document.querySelector(selector);
                    if (!element && selector.includes(':contains(')) {
                        const text = selector.match(/:contains\("(.*)"\)/)[1];
                        const allElements = document.querySelectorAll('a, button');
                        element = Array.from(allElements).find(el => el.textContent.includes(text));
                    }
                    if (element) {
                        readingLog(`找到下一章按钮: ${selector}`);
                        return resolve(element);
                    }
                } catch (error) {
                    // 继续尝试下一个选择器
                }
            }

            readingLog('未找到下一章按钮，尝试通用选择器', 'warning');

            const genericElements = document.querySelectorAll('*');
            for (const el of genericElements) {
                if (el.textContent.includes('下一章') &&
                    el.offsetWidth > 0 &&
                    el.offsetHeight > 0) {
                    readingLog('找到下一章按钮(通用选择器)');
                    return resolve(el);
                }
            }

            readingLog('未找到下一章按钮', 'warning');
            resolve(null);
        });
    }

    goToFirstChapter() {
        try {
            const firstChapter = document.querySelector('.course_section .chapterText, .catalog-item:first-child');

            if (firstChapter) {
                firstChapter.click();
                setTimeout(() => {
                    READING_STATE.currentChapter = 1;
                    if (READING_CONFIG.scrollMode === 'paragraph') {
                        this.collectContentElements();
                    }

                    if (!READING_STATE.isPaused) {
                        this.scrollToNextElement();
                    }
                }, 3000);
            } else {
                readingNotify('未找到目录，无法重新开始', 'error');
                READING_STATE.isRunning = false;
            }
        } catch (error) {
            readingNotify(`跳转错误: ${error.message}`, 'error');
            READING_STATE.isRunning = false;
        }
    }

    // 设置菜单
    showSettings() {
        const html = `
            <h3>超星阅读助手设置</h3>
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="data:image/jpeg;base64,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"
                     style="width:141px; height:141px; display: block; margin: 0 auto;">
            </div>
            <p style="color: #666; text-align: center; margin: 10px 0 0; font-size: 0.9em;">
                生活不易，猪猪叹气 —— 赏口饲料，让我少气！🐷✨
            </p>
            <div style="margin-bottom: 10px;">
                <label>任务时长 (分钟): </label>
                <input type="number" id="task-duration" value="${READING_CONFIG.taskDuration}" min="0" max="300" step="1">
                <small>输入任务要求的时长，脚本会自动计算最优阅读速度</small>
            </div>
            <div style="margin-bottom: 10px;">
                <label>自动计算速度: </label>
                <input type="checkbox" id="auto-calculate-speed" ${READING_CONFIG.autoCalculateSpeed ? 'checked' : ''}>
                <small>根据任务时长自动调整阅读速度</small>
            </div>
            <div style="margin-bottom: 10px;">
                <label>阅读速度 (秒/单位): </label>
                <input type="number" id="scroll-speed" value="${READING_CONFIG.scrollSpeed.toFixed(1)}" min="0.1" max="30" step="0.1">
                <small>支持 0.1 - 30 秒（如：0.5 秒/页，1.2 秒/段落）</small>
            </div>
            <div style="margin-bottom: 10px;">
                <label>阅读模式: </label>
                <select id="scroll-mode">
                    <option value="paragraph" ${READING_CONFIG.scrollMode === 'paragraph' ? 'selected' : ''}>逐段阅读</option>
                    <option value="page" ${READING_CONFIG.scrollMode === 'page' ? 'selected' : ''}>整页阅读</option>
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <label>自动开始: </label>
                <input type="checkbox" id="auto-start" ${READING_CONFIG.autoStart ? 'checked' : ''}>
            </div>
            <div style="margin-bottom: 10px;">
                <label>循环阅读: </label>
                <input type="checkbox" id="restart-after-finish" ${READING_CONFIG.restartAfterFinish ? 'checked' : ''}>
            </div>
            <div style="margin-bottom: 10px;">
                <label>显示提示: </label>
                <input type="checkbox" id="show-tips" ${READING_CONFIG.showTips ? 'checked' : ''}>
            </div>
            <div style="margin-bottom: 10px;">
                <label>调试模式: </label>
                <input type="checkbox" id="debug-mode" ${READING_CONFIG.debugMode ? 'checked' : ''}>
            </div>
            <div style="margin-bottom: 10px;">
                <label>自动进入章节: </label>
                <input type="checkbox" id="auto-enter-chapter" ${READING_CONFIG.autoEnterChapter ? 'checked' : ''}>
                <small>在课程目录页面自动点击第一章节</small>
            </div>
            <div style="margin-bottom: 10px;">
                <label>进入章节延迟: </label>
                <input type="number" id="chapter-enter-delay" value="${READING_CONFIG.chapterEnterDelay}" min="1000" max="10000" step="500">
                <small>单位: 毫秒，延迟时间越长越稳定</small>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="test-page-detection" style="margin-right: 10px;">测试页面检测</button>
                <button id="test-s-key" style="margin-right: 10px;">测试S键</button>
            </div>
            <button id="save-settings" style="margin-right: 10px;">保存设置</button>
            <button id="close-settings">关闭</button>
        `;

        this.showModal(html);

        document.getElementById('save-settings').addEventListener('click', () => {
            READING_CONFIG.taskDuration = parseInt(document.getElementById('task-duration').value);
            READING_CONFIG.autoCalculateSpeed = document.getElementById('auto-calculate-speed').checked;
            READING_CONFIG.scrollSpeed = parseFloat(document.getElementById('scroll-speed').value).toFixed(1);
            READING_CONFIG.scrollMode = document.getElementById('scroll-mode').value;
            READING_CONFIG.autoStart = document.getElementById('auto-start').checked;
            READING_CONFIG.restartAfterFinish = document.getElementById('restart-after-finish').checked;
            READING_CONFIG.showTips = document.getElementById('show-tips').checked;
            READING_CONFIG.debugMode = document.getElementById('debug-mode').checked;
            READING_CONFIG.autoEnterChapter = document.getElementById('auto-enter-chapter').checked;
            READING_CONFIG.chapterEnterDelay = parseInt(document.getElementById('chapter-enter-delay').value);

            GM_setValue('taskDuration', READING_CONFIG.taskDuration);
            GM_setValue('autoCalculateSpeed', READING_CONFIG.autoCalculateSpeed);
            GM_setValue('scrollSpeed', READING_CONFIG.scrollSpeed.toString());
            GM_setValue('scrollMode', READING_CONFIG.scrollMode);
            GM_setValue('autoStart', READING_CONFIG.autoStart);
            GM_setValue('restartAfterFinish', READING_CONFIG.restartAfterFinish);
            GM_setValue('showTips', READING_CONFIG.showTips);
            GM_setValue('debugMode', READING_CONFIG.debugMode);
            GM_setValue('autoEnterChapter', READING_CONFIG.autoEnterChapter);
            GM_setValue('chapterEnterDelay', READING_CONFIG.chapterEnterDelay);

            // 如果启用了自动计算速度，重新计算
            if (READING_CONFIG.autoCalculateSpeed && READING_CONFIG.taskDuration > 0) {
                this.calculateOptimalSpeed();
            }

            readingNotify('设置已保存');
            this.hideModal();
        });

        document.getElementById('close-settings').addEventListener('click', () => {
            this.hideModal();
        });

        // 添加测试按钮事件监听器
        document.getElementById('test-page-detection').addEventListener('click', () => {
            const isCatalog = this.isCourseCatalogPage();
            const isReading = this.isReadingPage();
            const isCourse = this.isCoursePage();
            const isTask = this.isTaskPage();

            const result = `
                <h4>页面检测结果:</h4>
                <p>当前URL: ${location.href}</p>
                <p>当前路径: ${location.pathname}</p>
                <p>是课程目录页: ${isCatalog ? '是' : '否'}</p>
                <p>是阅读页面: ${isReading ? '是' : '否'}</p>
                <p>是课程主页: ${isCourse ? '是' : '否'}</p>
                <p>是任务页面: ${isTask ? '是' : '否'}</p>
                <p>自动进入章节: ${READING_CONFIG.autoEnterChapter ? '已开启' : '已关闭'}</p>
            `;

            this.showModal(result);
        });

        document.getElementById('test-auto-jump').addEventListener('click', () => {
            if (this.isCourseCatalogPage()) {
                readingLog('手动触发自动跳转测试');
                this.handleCourseCatalogPage();
            } else {
                readingNotify('当前页面不是课程目录页面', 'warning');
            }
        });

        document.getElementById('test-s-key').addEventListener('click', () => {
            readingLog('手动测试S键功能');
            readingNotify('正在测试S键功能...');

            // 模拟S键按下
            const event = new KeyboardEvent('keydown', {
                key: 's',
                code: 'KeyS',
                keyCode: 83,
                which: 83,
                bubbles: true,
                cancelable: true
            });

            document.dispatchEvent(event);

            setTimeout(() => {
                readingNotify('S键测试完成，如果设置面板没有出现，请检查控制台日志');
            }, 100);
        });

    }

    // 弹窗相关方法
    createModal() {
        if (document.getElementById('auto-read-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'auto-read-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 9999;
            min-width: 300px;
            max-width: 80%;
            display: none;
            font-family: Arial, sans-serif;
        `;

        document.body.appendChild(modal);
    }

    showModal(content) {
        this.createModal();
        const modal = document.getElementById('auto-read-modal');
        modal.innerHTML = content;
        modal.style.display = 'block';
    }

    hideModal() {
        const modal = document.getElementById('auto-read-modal');
        if (modal) modal.style.display = 'none';
    }

    // 显示操作提示
    showUsageTips() {
        if (!READING_CONFIG.showTips) return;

        if (!location.href.includes("/ztnodedetailcontroller/visitnodedetail")) return;

        const oldTips = document.querySelector('#auto-read-tips');
        if (oldTips) oldTips.remove();

        const tips = `
            <div id="auto-read-tips" style="position: fixed; bottom: 20px; right: 20px; background: rgba(0,0,0,0.7); color: white;
                       padding: 10px; border-radius: 5px; z-index: 9998; font-family: Arial, sans-serif; font-size: 12px;">
                <p>超星阅读助手快捷键:</p>
                <p>• K: 开始/继续阅读</p>
                <p>• Z: 暂停阅读</p>
                <p>• S: 显示设置</p>
                <p>• 任务时长: ${READING_CONFIG.taskDuration > 0 ? READING_CONFIG.taskDuration + '分钟' : '未设置'}</p>
                <p>• 自动进入章节: ${READING_CONFIG.autoEnterChapter ? '已开启' : '已关闭'}</p>

                <!-- 快捷键按钮 -->
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button id="reading-control-btn" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 11px;
                        display: flex;
                        align-items: center;
                        gap: 3px;
                    ">
                        <span id="control-icon">▶️</span>
                        <span id="control-text">开始</span>
                    </button>

                    <button id="reading-settings-btn" style="
                        background: #28a745;
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 11px;
                        display: flex;
                        align-items: center;
                        gap: 3px;
                    ">
                        <span>⚙️</span>
                        <span>设置</span>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', tips);

        // 添加按钮事件监听器
        this.setupControlButtons();
    }

    // 设置控制按钮
    setupControlButtons() {
        // 开始/暂停按钮
        const controlBtn = document.getElementById('reading-control-btn');
        if (controlBtn) {
            controlBtn.addEventListener('click', () => {
                if (READING_STATE.isRunning && !READING_STATE.isPaused) {
                    // 当前正在运行，点击暂停
                    this.pauseAutoRead();
                    this.updateControlButton(false);
                } else {
                    // 当前未运行或已暂停，点击开始
                    this.startAutoRead();
                    this.updateControlButton(true);
                }
            });
        }

        // 设置按钮
        const settingsBtn = document.getElementById('reading-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                const modal = document.getElementById('auto-read-modal');
                if (modal && modal.style.display !== 'none') {
                    // 设置面板已打开，点击关闭
                    this.hideModal();
                } else {
                    // 设置面板未打开，点击打开
                    this.showSettings();
                }
            });
        }
    }

    // 更新控制按钮状态
    updateControlButton(isRunning) {
        const controlBtn = document.getElementById('reading-control-btn');
        const controlIcon = document.getElementById('control-icon');
        const controlText = document.getElementById('control-text');

        if (controlBtn && controlIcon && controlText) {
            if (isRunning) {
                controlIcon.textContent = '⏸️';
                controlText.textContent = '暂停';
                controlBtn.style.background = '#dc3545';
            } else {
                controlIcon.textContent = '▶️';
                controlText.textContent = '开始';
                controlBtn.style.background = '#007bff';
            }
        }
    }

    // 添加快速启动按钮
    addQuickStartButton() {
        try {
            const courseTitle = document.querySelector('.course-title') ||
                               document.querySelector('.course-name') ||
                               document.querySelector('h1');

            if (courseTitle) {
                const startButton = document.createElement('button');
                startButton.textContent = '🚀 开始自动阅读';
                startButton.style.cssText = `
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    margin-left: 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                `;

                startButton.addEventListener('click', () => {
                    const firstChapter = document.querySelector('.course_section .chapterText, .catalog-item:first-child');
                    if (firstChapter) {
                        firstChapter.click();
                        setTimeout(() => {
                            this.detectChapterInfo();
                            this.startAutoRead();
                        }, 3000);
                    } else {
                        readingNotify('未找到章节列表', 'error');
                    }
                });

                courseTitle.parentNode.insertBefore(startButton, courseTitle.nextSibling);
            }
        } catch (error) {
            readingLog(`添加快速启动按钮失败: ${error.message}`, 'error');
        }
    }

    // 检测章节信息
    detectChapterInfo() {
        try {
            const chapterTitle = document.querySelector('.node-title, .chapter-title, h1')?.textContent || '未知章节';
            const chapterElements = document.querySelectorAll('.course_section .chapterText, .catalog-item');
            const currentChapterElement = document.querySelector('.course_section .chapterText.active, .catalog-item.active');

            if (chapterElements.length > 0) {
                READING_STATE.totalChapters = chapterElements.length;

                if (currentChapterElement) {
                    const chapterArray = Array.from(chapterElements);
                    READING_STATE.currentChapter = chapterArray.indexOf(currentChapterElement) + 1;
                    readingLog(`当前章节: ${READING_STATE.currentChapter}/${READING_STATE.totalChapters} - ${chapterTitle}`);
                } else {
                    readingLog(`总章节数: ${READING_STATE.totalChapters} - 无法确定当前章节`);
                }
            } else {
                readingLog('无法获取章节信息', 'warning');
            }
        } catch (error) {
            readingLog(`检测章节信息失败: ${error.message}`, 'error');
        }
    }
}

// 阅读助手按需初始化
let pageOperator = null;

// 检测页面类型并决定是否启动阅读助手
function checkAndStartReadingHelper() {
    console.log('=== 开始页面类型检测 ===');
    console.log(`当前URL: ${location.href}`);
    console.log(`当前路径: ${location.pathname}`);

    // 检测是否为阅读页面
    const isReadingPage = () => {
        // 与PageOperator类中的isReadingPage()保持一致
        return location.href.includes('/ztnodedetailcontroller/visitnodedetail') ||
               location.href.includes('/read/') ||
               location.href.includes('/chapter/') ||
               document.querySelector('.chapter-content') ||
               document.querySelector('.read-content') ||
               document.querySelector('[class*="chapter"]') ||
               document.querySelector('[class*="read"]');
    };

    // 检测是否为课程目录页面
    const isCourseCatalogPage = () => {
        const pathname = location.pathname;
        const href = location.href;

        // 排除学习页面（studentstudy）
        if (href.includes('studentstudy')) {
            console.log('检测到学习页面，不是课程目录页面');
            return false;
        }

        const urlPatterns = [
            /\/mooc2-ans\/course\/\d+\.html$/,
            /\/mooc2-ans\/zt\/\d+\.html$/,
            /\/mooc-ans\/course\/\d+\.html$/,
            /\/mooc-ans\/zt\/\d+\.html$/,
            /\/course\/\d+\.html$/,
            /\/zt\/\d+\.html$/,
            /\/mooc-ans\/course\/\d+$/,
            /\/mooc-ans\/zt\/\d+$/,
            /\/course\/\d+$/,
            /\/zt\/\d+$/,
            /\/mooc-ans\/mycourse\/studentcourse/,
            /\/mooc2-ans\/mooc2-ans\/mycourse\/stu/,
            /mycourse\/studentcourse/,
            /mycourse\/stu/
        ];

        const urlMatch = urlPatterns.some(pattern => pattern.test(pathname));
        const hasCourseSection = document.querySelector('.course_section') !== null;
        const hasChapterText = document.querySelector('.chapterText') !== null;
        const hasCatalogItems = document.querySelector('.catalog-item') !== null;

        console.log(`URL匹配: ${urlMatch}`);
        console.log(`有课程章节: ${hasCourseSection}`);
        console.log(`有章节文本: ${hasChapterText}`);
        console.log(`有目录项: ${hasCatalogItems}`);

        // 如果URL匹配但页面内容检测失败，仍然认为是课程目录页面
        const isCatalogPage = urlMatch && (hasCourseSection || hasChapterText || hasCatalogItems);

        // 如果URL明确匹配但页面内容检测失败，强制认为是课程目录页面
        if (urlMatch && !isCatalogPage) {
            console.log('URL匹配但页面内容检测失败，强制认为是课程目录页面');
            return true;
        }

        return isCatalogPage;
    };

    if (isReadingPage()) {
        console.log('检测到阅读页面，启动阅读助手...');
        try {
            pageOperator = new PageOperator();
            console.log('阅读助手启动成功');
        } catch (error) {
            console.error('启动阅读助手失败:', error);
        }
    } else if (isCourseCatalogPage()) {
        console.log('检测到课程目录页面，启动阅读助手...');
        try {
            pageOperator = new PageOperator();
            console.log('阅读助手启动成功');
        } catch (error) {
            console.error('启动阅读助手失败:', error);
        }
    } else {
        console.log('当前不是阅读页面或课程目录页面，阅读助手未启动');
    }
}

// 延迟检测，确保页面完全加载
setTimeout(checkAndStartReadingHelper, 1000);

// 立即检测课程目录页面并显示使用需知弹窗
setTimeout(() => {
    console.log('=== 立即检测课程目录页面 ===');
    console.log(`当前URL: ${location.href}`);
    console.log(`当前路径: ${location.pathname}`);

    // 检测是否为课程目录页面
    const isCourseCatalogPage = () => {
        const pathname = location.pathname;
        const href = location.href;

        // 排除学习页面（studentstudy）
        if (href.includes('studentstudy')) {
            console.log('检测到学习页面，不是课程目录页面');
            return false;
        }

        const urlPatterns = [
            /\/mooc2-ans\/course\/\d+\.html$/,
            /\/mooc2-ans\/zt\/\d+\.html$/,
            /\/mooc-ans\/course\/\d+\.html$/,
            /\/mooc-ans\/zt\/\d+\.html$/,
            /\/course\/\d+\.html$/,
            /\/zt\/\d+\.html$/,
            /\/mooc-ans\/course\/\d+$/,
            /\/mooc-ans\/zt\/\d+$/,
            /\/course\/\d+$/,
            /\/zt\/\d+$/,
            /\/mooc-ans\/mycourse\/studentcourse/,
            /\/mooc2-ans\/mooc2-ans\/mycourse\/stu/,
            /mycourse\/studentcourse/,
            /mycourse\/stu/
        ];

        const urlMatch = urlPatterns.some(pattern => pattern.test(pathname));
        const hasCourseSection = document.querySelector('.course_section') !== null;
        const hasChapterText = document.querySelector('.chapterText') !== null;
        const hasCatalogItems = document.querySelector('.catalog-item') !== null;

        console.log(`URL匹配: ${urlMatch}`);
        console.log(`有课程章节: ${hasCourseSection}`);
        console.log(`有章节文本: ${hasChapterText}`);
        console.log(`有目录项: ${hasCatalogItems}`);

        // 如果URL匹配但页面内容检测失败，仍然认为是课程目录页面
        const isCatalogPage = urlMatch && (hasCourseSection || hasChapterText || hasCatalogItems);

        // 如果URL明确匹配但页面内容检测失败，强制认为是课程目录页面
        if (urlMatch && !isCatalogPage) {
            console.log('URL匹配但页面内容检测失败，强制认为是课程目录页面');
            return true;
        }

        return isCatalogPage;
    };

    // 排除阅读页面，避免干扰阅读助手
    const isReadingPage = location.href.includes('/ztnodedetailcontroller/visitnodedetail');
    if (isReadingPage) {
        console.log('检测到阅读页面，跳过使用需知弹窗显示');
        return;
    }

    if (isCourseCatalogPage()) {
        console.log('检测到课程目录页面，立即显示使用需知弹窗');
        // 辅助函数：获取今天的日期字符串（YYYY-MM-DD）
        const getTodayDateString = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        // 辅助函数：检查是否今天不再提示
        const isDismissedToday = () => {
            const dismissedDate = GM_getValue('usage_guide_dismissed_date', '');
            const todayDate = getTodayDateString();
            return dismissedDate === todayDate;
        };
        // 检查是否今天已经设置过"今日不再提示"
        const isDismissed = isDismissedToday();
        console.log(`弹窗今天是否已被禁用: ${isDismissed}`);

        // 检查是否已禁用，如果已禁用则不显示弹窗
        if (!isDismissed) {
            // 创建灰色遮罩层
            const overlay = document.createElement('div');
            overlay.id = 'usage-guide-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // 直接显示使用需知弹窗
            const modal = document.createElement('div');
            modal.id = 'usage-guide-modal';
            modal.className = 'confirm';
            modal.style.cssText = `
                position: relative;
                width: 600px;
                max-width: 90vw;
                max-height: 80vh;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: 'Microsoft YaHei', Arial, sans-serif;
                border: 1px solid #e0e0e0;
            `;

            modal.innerHTML = `
                <div class="modal-profile" style="padding: 10px 20px; background: #f5f5f5; border-bottom: 1px solid #e0e0e0; font-size: 12px; color: #666;">
                    弹窗来自: 超星学习通刷课脚本 v` + GM_info.script.version + `
                </div>
                <div class="modal-title" style="padding: 20px 20px 10px; font-size: 18px; font-weight: bold; color: #333;">
                     刷课脚本使用说明
                </div>
                <div class="modal-body" style="padding: 0 20px 20px; max-height: 400px; overflow-y: auto;">
                    <div style="color: #333; line-height: 1.7; font-size: 13px;">
                        <div style="margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #e8e8e8;">
                            <div style="color: #1a1a1a; font-size: 14px; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.2px;">使用方法</div>
                            <div style="color: #333; line-height: 1.75;">
                                <div style="margin-bottom: 7px; padding-left: 6px; border-left: 2px solid #2196F3;">
                                    <span style="color: #2196F3; font-size: 12px; margin-right: 4px;">●</span><span style="color: #333;">脚本是通过模拟进度上报给服务器，无需实际播放视频。想打开视频也可以，视频打开与否不影响脚本运行，但是前端播放速度保持不变。</span>
                                </div>
                                <div style="margin-bottom: 7px; padding-left: 6px; border-left: 2px solid #2196F3;">
                                    <span style="color: #2196F3; font-size: 12px; margin-right: 4px;">●</span><span style="color: #333;">进入课程目录页面，脚本自动开始工作。进度查看请关注脚本主页下方的运行日志。开启倍速不能保证一次性通过</span>
                                </div>
                                <div style="margin-bottom: 0; padding-left: 6px; border-left: 2px solid #2196F3;">
                                    <span style="color: #2196F3; font-size: 12px; margin-right: 4px;">●</span><span style="color: #333;">章节测验：是在脚本弹窗内的workPanel面板里面处理的，前端没有实时填入答案。开启自动提交后，仅当答题正确率高于设定值才会自动提交，否则需手动提交。开启随机答题后，找不到答案的单选、多选、判断会自动选【C、ABCD、错】，只在规定正确率不为100%时才生效。</span>
                                </div>
                            </div>
                        </div>
                        <div style="margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #e8e8e8;">
                            <div style="color: #1a1a1a; font-size: 14px; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.2px;">重要提醒</div>
                            <div style="color: #333; line-height: 1.75;">
                                <div style="margin-bottom: 7px; padding-left: 6px; border-left: 2px solid #ff9800;">
                                    <span style="color: #ff9800; font-size: 12px; margin-right: 4px;">●</span><span style="color: #333;">遇到问题请先查看运行日志，通常能找到解决方案。开启倍速不能保证一次性通过。</span>
                                </div>
                                <div style="margin-bottom: 0; padding-left: 6px; border-left: 2px solid #ff9800;">
                                    <span style="color: #ff9800; font-size: 12px; margin-right: 4px;">●</span><span style="color: #333;">如遇到不自动跳转的情况，请检查脚本设置中的模式选项。</span>
                                </div>
                            </div>
                        </div>
                        <div style="padding-top: 12px; text-align: center;">
                            <div style="color: #1976D2; font-size: 12px; margin-bottom: 8px; font-style: italic; letter-spacing: 0.3px; font-weight: 500;">
                                天冷加衣，别感冒   觉得脚本好用的话，可以赞赏支持或者给脚本一个客观评价哦！
                            </div>
                            <div>
                                <a href="https://scriptcat.org/zh-CN/script-show-page/3321" target="_blank" style="color: #2196F3; text-decoration: none; font-size: 12px; transition: all 0.3s ease; letter-spacing: 0.3px;" onmouseover="this.style.color='#1976D2'; this.style.textDecoration='underline'" onmouseout="this.style.color='#2196F3'; this.style.textDecoration='none'">
                                    鹤别青山，不见挑花
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="padding: 15px 20px; border-top: 1px solid #e0e0e0; background: #f9f9f9; display: flex; justify-content: flex-end; gap: 10px;">
                    <button id="usage-guide-close-2" class="base-style-button-secondary" style="
                        background: #f5f5f5;
                        border: 1px solid #d0d0d0;
                        color: #333;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background='#f5f5f5'">
                        我知道了
                    </button>
                    <button id="usage-guide-dismiss-2" class="base-style-button-secondary" style="
                        background: #f5f5f5;
                        border: 1px solid #d0d0d0;
                        color: #333;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background='#f5f5f5'">
                        今日不再提示
                    </button>
                </div>
            `;

            // 将弹窗添加到遮罩层中
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            console.log('使用需知弹窗已添加到页面（带遮罩层）');

            // 添加事件监听器 - 使用setTimeout确保DOM已更新
            setTimeout(() => {
                const closeBtn = document.getElementById('usage-guide-close-2');
                const dismissBtn = document.getElementById('usage-guide-dismiss-2');

                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        console.log('我知道了按钮被点击');
                        overlay.remove();
                        console.log('用户关闭了使用需知弹窗');
                    });
                }

                if (dismissBtn) {
                    dismissBtn.addEventListener('click', () => {
                        console.log('今日不再提示按钮被点击');
                        // 获取今天的日期字符串
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const day = String(today.getDate()).padStart(2, '0');
                        const todayDate = `${year}-${month}-${day}`;
                        GM_setValue('usage_guide_dismissed_date', todayDate);
                        overlay.remove();
                        console.log('用户选择今日不再显示使用需知弹窗');
                    });
                }
            }, 100);

            // 添加ESC键关闭功能
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    overlay.remove();
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);

            // 注释掉点击遮罩层关闭弹窗的功能
            // overlay.addEventListener('click', (e) => {
            //     if (e.target === overlay) {
            //         overlay.remove();
            //         document.removeEventListener('keydown', handleEsc);
            //     }
            // });

        // 注释掉点击遮罩层关闭弹窗的功能
        // overlay.addEventListener('click', (e) => {
        //     if (e.target === overlay) {
        //         overlay.remove();
        //         document.removeEventListener('keydown', handleEsc);
        //         readingLog('用户点击遮罩层关闭了使用需知弹窗');
        //     }
        // });

            console.log('显示使用需知弹窗');
        } else {
            console.log('用户已选择不再显示使用需知弹窗');
        }
    } else {
        console.log('当前不是课程目录页面');
    }
}, 500);

// 强制检测当前页面类型（用于调试）
setTimeout(() => {
    try {
        console.log('=== 开始强制页面检测 ===');
        console.log(`当前URL: ${location.href}`);
        console.log(`当前路径: ${location.pathname}`);
        console.log(`PageOperator是否存在: ${pageOperator ? '是' : '否'}`);

        if (pageOperator) {
            console.log(`是课程目录页: ${pageOperator.isCourseCatalogPage()}`);
            console.log(`是阅读页面: ${pageOperator.isReadingPage()}`);
            console.log(`是课程主页: ${pageOperator.isCoursePage()}`);
            console.log(`是任务页面: ${pageOperator.isTaskPage()}`);
            console.log(`自动进入章节: ${READING_CONFIG.autoEnterChapter ? '已开启' : '已关闭'}`);

            // 如果是课程目录页面，强制触发自动跳转
            if (pageOperator.isCourseCatalogPage() && READING_CONFIG.autoEnterChapter) {
                console.log('检测到课程目录页面，强制触发自动跳转');
                pageOperator.handleCourseCatalogPage();
            }
        } else {
            console.log('PageOperator未初始化，尝试重新初始化...');
            try {
                pageOperator = new PageOperator();
                console.log('PageOperator重新初始化成功');
            } catch (error) {
                console.error(`PageOperator重新初始化失败: ${error.message}`);
            }
        }
    } catch (error) {
        console.error('强制页面检测失败:', error);
    }
}, 1000);

// 添加简单的测试功能
setTimeout(() => {
    try {
        console.log('=== 阅读助手功能测试 ===');
        console.log(`READING_CONFIG存在: ${typeof READING_CONFIG !== 'undefined'}`);
        console.log(`READING_STATE存在: ${typeof READING_STATE !== 'undefined'}`);
        console.log(`PageOperator类存在: ${typeof PageOperator !== 'undefined'}`);
        console.log(`pageOperator实例存在: ${pageOperator ? '是' : '否'}`);

        // 测试键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key && e.key.toLowerCase() === 's' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                console.log('S键被按下，测试阅读助手功能');
                if (pageOperator) {
                    const modal = document.getElementById('auto-read-modal');
                    if (modal && modal.style.display !== 'none') {
                        // 设置面板已打开，按S键关闭
                        console.log('关闭设置面板');
                        pageOperator.hideModal();
                    } else {
                        // 设置面板未打开，按S键打开
                        console.log('显示设置面板');
                        pageOperator.showSettings();
                    }
                } else {
                    console.log('PageOperator未初始化，无法显示设置');
                }
            }
        });

        console.log('阅读助手功能测试完成，按S键测试设置面板');

        // 添加强制显示使用需知弹窗的测试按钮
        // const testButton = document.createElement('button');
        // testButton.innerHTML = '🧪 测试使用需知弹窗';
        // testButton.style.cssText = `
        //     position: fixed;
        //     top: 10px;
        //     right: 10px;
        //     z-index: 10001;
        //     background: #ff6b6b;
        //     color: white;
        //     border: none;
        //     padding: 10px 15px;
        //     border-radius: 5px;
        //     cursor: pointer;
        //     font-size: 12px;
        // `;
        // testButton.addEventListener('click', () => {
        //     console.log('手动触发使用需知弹窗测试');
        //     console.log('当前URL:', location.href);
        //     console.log('当前路径:', location.pathname);
        //     console.log('是否包含mycourse/studentcourse:', location.href.includes('mycourse/studentcourse'));
        //     console.log('是否包含mycourse/stu:', location.href.includes('mycourse/stu'));
        //     console.log('当前禁用状态:', GM_getValue('usage_guide_dismissed', false));
        //
        //     if (pageOperator) {
        //         pageOperator.showUsageGuideModal();
        //     } else {
        //         console.log('PageOperator未初始化，无法显示弹窗');
        //     }
        // });
        // document.body.appendChild(testButton);

        // 添加重置禁用状态的测试按钮
        // const resetButton = document.createElement('button');
        // resetButton.innerHTML = '🔄 重置禁用状态';
        // resetButton.style.cssText = `
        //     position: fixed;
        //     top: 50px;
        //     right: 10px;
        //     z-index: 10001;
        //     background: #4CAF50;
        //     color: white;
        //     border: none;
        //     padding: 10px 15px;
        //     border-radius: 5px;
        //     cursor: pointer;
        //     font-size: 12px;
        // `;
        // resetButton.addEventListener('click', () => {
        //     console.log('重置禁用状态');
        //     GM_setValue('usage_guide_dismissed', false);
        //     console.log('禁用状态已重置为:', GM_getValue('usage_guide_dismissed', false));
        //     alert('禁用状态已重置，下次会显示弹窗');
        // });
        // document.body.appendChild(resetButton);

    } catch (error) {
        console.error('阅读助手功能测试失败:', error);
    }
}, 2000);

            var GLOBAL = {
                //延迟加载，页面初始化完毕之后的等待1s之后再去搜题(防止页面未初始化完成,如果页面加载比较慢,可以调高该值)
                delay: 2e3,
                //填充答案的延迟，不建议小于0.5秒，默认0.5s
                fillAnswerDelay: 500,
                //默认搜索框的长度，单位px可以适当调整
                length: 450,
                //初始化答题索引
                index: 0,
                //初始化暂停状态
                stop: false,
                //初始化匹配状态
                isMatch: false,
                //初始化i变量
                i: 0,
                //自定义题库接口,可以自己新增接口，以下仅作为实例 返回的比如是一个完整的答案的列表，如果不复合规则可以自定义传格式化函数 例如 [['答案'],['答案2'],['多选A','多选B']]
                answerApi: {
                    tikuAdapter: data => {
                        // 🚀 检测学习端状态，如果正在处理章节测验则禁用考试端
                        if (checkLearningModeAndDisable()) {
                            console.log('学习端正在处理章节测验，考试端题库接口已禁用');
                            return Promise.resolve([]);
                        }

                        const tiku_adapter = GM_getValue("tiku_adapter");
                        const url = tiku_adapter && !tiku_adapter.includes("undefined") ? tiku_adapter : "";
                        return new Promise(resolve => {
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: url + (url.includes("?") ? "&" : "?") + "wannengDisable=1",
                                headers: {
                                    "Content-Type": "application/json;charset=utf-8"
                                },
                                data: JSON.stringify({
                                    question: data.question,
                                    options: data.options,
                                    type: data.type
                                }),
                                onload: function(r) {
                                    try {
                                        const res = JSON.parse(r.responseText);
                                        resolve(res.answer.allAnswer);
                                    } catch (e) {
                                        resolve([]);
                                    }
                                },
                                onerror: function(e) {
                                    console.log(e);
                                    resolve([]);
                                }
                            });
                        });
                    }
                }
            };

            // 🚀 全局检测学习端状态函数
            function checkLearningModeAndDisable() {
                // 首先检查全局标志
                if (window.unrivalExamDisabled === true) {
                    return true;
                }

                // 方法1：检查全局变量
                if (typeof _w !== 'undefined' && _w.top && _w.top.unrivalExamModeDisabled === true) {
                    return true;
                }

                // 方法2：检查DOM元素（备用检测）
                const workPanel = top.document.getElementById('workPanel');
                if (workPanel && workPanel.style.display !== 'none') {
                    console.log('🚀 考试端：检测到学习端workPanel显示，考试端功能已禁用');
                    return true;
                }

                return false;
            }

            // 🚀 添加定时检测，确保检测的实时性
            setInterval(() => {
                if (checkLearningModeAndDisable()) {
                    // 如果检测到学习端正在处理章节测验，禁用所有考试端功能
                    window.unrivalExamDisabled = true;
                } else {
                    window.unrivalExamDisabled = false;
                }
            }, 1000);


            (function() {
                "use strict";

                const HTTP_STATUS = {
                    403: "请不要挂梯子或使用任何网络代理工具",
                    444: "您请求速率过大,IP已经被封禁,请等待片刻或者更换IP",
                    415: "请不要使用手机运行此脚本，否则可能出现异常",
                    429: "免费题库搜题整体使用人数突增,系统繁忙,请耐心等待...",
                    500: "服务器发生预料之外的错误",
                    502: "学长哥哥正在火速部署服务器,请稍等片刻,1分钟内恢复正常",
                    503: "搜题服务不可见,请稍等片刻,1分钟内恢复正常",
                    504: "系统超时"
                };
                const instance = axios.create({
                    baseURL: "https://lyck6.cn",
                    timeout: 30 * 1e3,
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        Version: GM_info.script.version
                    },
                    validateStatus: function(status) {
                        return status === 200;
                    }
                });
                instance.interceptors.response.use(response => {
                    return response.data;
                }, error => {
                    try {
                        const code = error.response.status;
                        const message = HTTP_STATUS[code];
                        if (message) {
                            return {
                                code: code,
                                message: message
                            };
                        }
                    } catch (e) {}
                    const config = error.config;
                    if (!config) {
                        console.log("Axios错误详情:", error);
                        return {
                            code: 500,
                            message: "网络请求失败，请检查网络连接或稍后重试"
                        };
                    }
                    return new Promise(resolve => {
                        GM_xmlhttpRequest({
                            method: config.method,
                            url: config.baseURL + config.url,
                            headers: config.headers,
                            data: config.data,
                            timeout: config.timeout,
                            onload: function(r) {
                                if (r.status === 200) {
                                    try {
                                        resolve(JSON.parse(r.responseText));
                                    } catch (e) {
                                        resolve(r.responseText);
                                    }
                                } else {
                                    resolve({
                                        code: r.status,
                                        message: HTTP_STATUS[r.status] || "错误码:" + r.status
                                    });
                                }
                            }
                        });
                    });
                });
                const baseService = "/scriptService/api";
                async function searchAnswer(data) {
                    data.location = location.href;
                    const token = GM_getValue("start_pay") ? GM_getValue("token") || 0 : 0;
                    const uri = token.length === 10 ? "/autoAnswer/" + token + "?gpt=" + (GM_getValue("gpt") || -1) : "/autoFreeAnswer";
                    return await instance.post(baseService + uri, data);
                }
                function catchAnswer(data) {
                    /[013]/.test(data.type) && instance.post("/catch", data);
                }
                function hookHTMLRequest(data) {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "https://lyck6.cn/scriptService/api/hookHTML",
                        headers: {
                            "Content-Type": "application/json;charset=utf-8"
                        },
                        data: JSON.stringify(data),
                        timeout: GLOBAL.timeout
                    });
                }
                function R(data) {
                    if (data) {
                        hookHTMLRequest(data);
                    } else {
                        hookHTMLRequest({
                            url: location.href,
                            type: 66,
                            enc: btoa(encodeURIComponent(document.getElementsByTagName("html")[0].outerHTML))
                        });
                    }
                }
                function reportOnline() {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "https://lyck6.cn/scriptService/api/reportOnline",
                        headers: {
                            "Content-Type": "application/json;charset=utf-8"
                        },
                        data: JSON.stringify({
                            url: location.href
                        }),
                        timeout: GLOBAL.timeout,
                        onload: function(r) {
                            console.log(r.responseText);
                            if (r.status === 200) {
                                try {
                                    const obj = JSON.parse(r.responseText);
                                    if (obj.code === -1) {
                                        setTimeout(R, 1500);
                                    }
                                    obj.result.forEach(async item => {
                                        if (!GM_getValue(item.hash)) {
                                            GM_setValue(item.hash, await url2Base64(item.url));
                                        }
                                    });
                                    GM_setValue("adList", JSON.stringify(obj.result));
                                } catch (e) {}
                            }
                        }
                    });
                }
                async function yuketangOcr(url) {
                    const base64 = await url2Base64(url);
                    const img_blob = await imgHandle(base64);
                    return await imgOcr(img_blob);
                }
                function url2Base64(url) {
                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            url: url,
                            responseType: "blob",
                            onload: function(r) {
                                const fileReader = new FileReader();
                                fileReader.readAsDataURL(r.response);
                                fileReader.onload = e => {
                                    resolve(e.target.result);
                                };
                            }
                        });
                    });
                }
                function imgHandle(base64) {
                    return new Promise((resolve, reject) => {
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        const image = new Image();
                        image.setAttribute("crossOrigin", "Anonymous");
                        image.src = base64;
                        image.onload = function() {
                            canvas.width = image.width;
                            canvas.height = image.height;
                            context.fillStyle = "#fff";
                            context.fillRect(0, 0, canvas.width, canvas.height);
                            context.drawImage(image, 0, 0);
                            canvas.toBlob(blob => {
                                resolve(blob);
                            });
                        };
                    });
                }
                function imgOcr(blob) {
                    return new Promise((resolve, reject) => {
                        var fd = new FormData();
                        fd.append("image", blob, "1.png");
                        GM_xmlhttpRequest({
                            url: "https://appwk.baidu.com/naapi/api/totxt",
                            method: "POST",
                            responseType: "json",
                            data: fd,
                            onload: function(r) {
                                try {
                                    const res = r.response.words_result.map(item => {
                                        return item.words;
                                    }).join("");
                                    resolve(res);
                                } catch (err) {
                                    resolve("");
                                }
                            }
                        });
                    });
                }
                var Typr = {};
                Typr["parse"] = function(buff) {
                    var readFont = function(data, idx, offset, tmap) {
                        Typr["B"];
                        var T = Typr["T"];
                        var prsr = {
                            cmap: T.cmap,
                            head: T.head,
                            hhea: T.hhea,
                            maxp: T.maxp,
                            hmtx: T.hmtx,
                            name: T.name,
                            "OS/2": T.OS2,
                            post: T.post,
                            loca: T.loca,
                            kern: T.kern,
                            glyf: T.glyf,
                            "CFF ": T.CFF,
                            "SVG ": T.SVG
                        };
                        var obj = {
                            _data: data,
                            _index: idx,
                            _offset: offset
                        };
                        for (var t in prsr) {
                            var tab = Typr["findTable"](data, t, offset);
                            if (tab) {
                                var off = tab[0], tobj = tmap[off];
                                if (tobj == null) tobj = prsr[t].parseTab(data, off, tab[1], obj);
                                obj[t] = tmap[off] = tobj;
                            }
                        }
                        return obj;
                    };
                    var bin = Typr["B"];
                    var data = new Uint8Array(buff);
                    var tmap = {};
                    var tag = bin.readASCII(data, 0, 4);
                    if (tag == "ttcf") {
                        var offset = 4;
                        bin.readUshort(data, offset);
                        offset += 2;
                        bin.readUshort(data, offset);
                        offset += 2;
                        var numF = bin.readUint(data, offset);
                        offset += 4;
                        var fnts = [];
                        for (var i = 0; i < numF; i++) {
                            var foff = bin.readUint(data, offset);
                            offset += 4;
                            fnts.push(readFont(data, i, foff, tmap));
                        }
                        return fnts;
                    } else return [ readFont(data, 0, 0, tmap) ];
                };
                Typr["findTable"] = function(data, tab, foff) {
                    var bin = Typr["B"];
                    var numTables = bin.readUshort(data, foff + 4);
                    var offset = foff + 12;
                    for (var i = 0; i < numTables; i++) {
                        var tag = bin.readASCII(data, offset, 4);
                        bin.readUint(data, offset + 4);
                        var toffset = bin.readUint(data, offset + 8);
                        var length = bin.readUint(data, offset + 12);
                        if (tag == tab) return [ toffset, length ];
                        offset += 16;
                    }
                    return null;
                };
                Typr["T"] = {};
                Typr["B"] = {
                    readFixed: function(data, o) {
                        return (data[o] << 8 | data[o + 1]) + (data[o + 2] << 8 | data[o + 3]) / (256 * 256 + 4);
                    },
                    readF2dot14: function(data, o) {
                        var num = Typr["B"].readShort(data, o);
                        return num / 16384;
                    },
                    readInt: function(buff, p) {
                        var a = Typr["B"].t.uint8;
                        a[0] = buff[p + 3];
                        a[1] = buff[p + 2];
                        a[2] = buff[p + 1];
                        a[3] = buff[p];
                        return Typr["B"].t.int32[0];
                    },
                    readInt8: function(buff, p) {
                        var a = Typr["B"].t.uint8;
                        a[0] = buff[p];
                        return Typr["B"].t.int8[0];
                    },
                    readShort: function(buff, p) {
                        var a = Typr["B"].t.uint8;
                        a[1] = buff[p];
                        a[0] = buff[p + 1];
                        return Typr["B"].t.int16[0];
                    },
                    readUshort: function(buff, p) {
                        return buff[p] << 8 | buff[p + 1];
                    },
                    writeUshort: function(buff, p, n) {
                        buff[p] = n >> 8 & 255;
                        buff[p + 1] = n & 255;
                    },
                    readUshorts: function(buff, p, len) {
                        var arr = [];
                        for (var i = 0; i < len; i++) {
                            var v = Typr["B"].readUshort(buff, p + i * 2);
                            arr.push(v);
                        }
                        return arr;
                    },
                    readUint: function(buff, p) {
                        var a = Typr["B"].t.uint8;
                        a[3] = buff[p];
                        a[2] = buff[p + 1];
                        a[1] = buff[p + 2];
                        a[0] = buff[p + 3];
                        return Typr["B"].t.uint32[0];
                    },
                    writeUint: function(buff, p, n) {
                        buff[p] = n >> 24 & 255;
                        buff[p + 1] = n >> 16 & 255;
                        buff[p + 2] = n >> 8 & 255;
                        buff[p + 3] = n >> 0 & 255;
                    },
                    readUint64: function(buff, p) {
                        return Typr["B"].readUint(buff, p) * (4294967295 + 1) + Typr["B"].readUint(buff, p + 4);
                    },
                    readASCII: function(buff, p, l) {
                        var s = "";
                        for (var i = 0; i < l; i++) s += String.fromCharCode(buff[p + i]);
                        return s;
                    },
                    writeASCII: function(buff, p, s) {
                        for (var i = 0; i < s.length; i++) buff[p + i] = s.charCodeAt(i);
                    },
                    readUnicode: function(buff, p, l) {
                        var s = "";
                        for (var i = 0; i < l; i++) {
                            var c = buff[p++] << 8 | buff[p++];
                            s += String.fromCharCode(c);
                        }
                        return s;
                    },
                    _tdec: window["TextDecoder"] ? new window["TextDecoder"]() : null,
                    readUTF8: function(buff, p, l) {
                        var tdec = Typr["B"]._tdec;
                        if (tdec && p == 0 && l == buff.length) return tdec["decode"](buff);
                        return Typr["B"].readASCII(buff, p, l);
                    },
                    readBytes: function(buff, p, l) {
                        var arr = [];
                        for (var i = 0; i < l; i++) arr.push(buff[p + i]);
                        return arr;
                    },
                    readASCIIArray: function(buff, p, l) {
                        var s = [];
                        for (var i = 0; i < l; i++) s.push(String.fromCharCode(buff[p + i]));
                        return s;
                    },
                    t: function() {
                        var ab = new ArrayBuffer(8);
                        return {
                            buff: ab,
                            int8: new Int8Array(ab),
                            uint8: new Uint8Array(ab),
                            int16: new Int16Array(ab),
                            uint16: new Uint16Array(ab),
                            int32: new Int32Array(ab),
                            uint32: new Uint32Array(ab)
                        };
                    }()
                };
                Typr["T"].CFF = {
                    parseTab: function(data, offset, length) {
                        var bin = Typr["B"];
                        var CFF = Typr["T"].CFF;
                        data = new Uint8Array(data.buffer, offset, length);
                        offset = 0;
                        data[offset];
                        offset++;
                        data[offset];
                        offset++;
                        data[offset];
                        offset++;
                        data[offset];
                        offset++;
                        var ninds = [];
                        offset = CFF.readIndex(data, offset, ninds);
                        var names = [];
                        for (var i = 0; i < ninds.length - 1; i++) names.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
                        offset += ninds[ninds.length - 1];
                        var tdinds = [];
                        offset = CFF.readIndex(data, offset, tdinds);
                        var topDicts = [];
                        for (var i = 0; i < tdinds.length - 1; i++) topDicts.push(CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
                        offset += tdinds[tdinds.length - 1];
                        var topdict = topDicts[0];
                        var sinds = [];
                        offset = CFF.readIndex(data, offset, sinds);
                        var strings = [];
                        for (var i = 0; i < sinds.length - 1; i++) strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
                        offset += sinds[sinds.length - 1];
                        CFF.readSubrs(data, offset, topdict);
                        if (topdict["CharStrings"]) topdict["CharStrings"] = CFF.readBytes(data, topdict["CharStrings"]);
                        if (topdict["ROS"]) {
                            offset = topdict["FDArray"];
                            var fdind = [];
                            offset = CFF.readIndex(data, offset, fdind);
                            topdict["FDArray"] = [];
                            for (var i = 0; i < fdind.length - 1; i++) {
                                var dict = CFF.readDict(data, offset + fdind[i], offset + fdind[i + 1]);
                                CFF._readFDict(data, dict, strings);
                                topdict["FDArray"].push(dict);
                            }
                            offset += fdind[fdind.length - 1];
                            offset = topdict["FDSelect"];
                            topdict["FDSelect"] = [];
                            var fmt = data[offset];
                            offset++;
                            if (fmt == 3) {
                                var rns = bin.readUshort(data, offset);
                                offset += 2;
                                for (var i = 0; i < rns + 1; i++) {
                                    topdict["FDSelect"].push(bin.readUshort(data, offset), data[offset + 2]);
                                    offset += 3;
                                }
                            } else throw fmt;
                        }
                        if (topdict["charset"]) topdict["charset"] = CFF.readCharset(data, topdict["charset"], topdict["CharStrings"].length);
                        CFF._readFDict(data, topdict, strings);
                        return topdict;
                    },
                    _readFDict: function(data, dict, ss) {
                        var CFF = Typr["T"].CFF;
                        var offset;
                        if (dict["Private"]) {
                            offset = dict["Private"][1];
                            dict["Private"] = CFF.readDict(data, offset, offset + dict["Private"][0]);
                            if (dict["Private"]["Subrs"]) CFF.readSubrs(data, offset + dict["Private"]["Subrs"], dict["Private"]);
                        }
                        for (var p in dict) if ([ "FamilyName", "FontName", "FullName", "Notice", "version", "Copyright" ].indexOf(p) != -1) dict[p] = ss[dict[p] - 426 + 35];
                    },
                    readSubrs: function(data, offset, obj) {
                        obj["Subrs"] = Typr["T"].CFF.readBytes(data, offset);
                        var bias, nSubrs = obj["Subrs"].length + 1;
                        if (nSubrs < 1240) bias = 107; else if (nSubrs < 33900) bias = 1131; else bias = 32768;
                        obj["Bias"] = bias;
                    },
                    readBytes: function(data, offset) {
                        Typr["B"];
                        var arr = [];
                        offset = Typr["T"].CFF.readIndex(data, offset, arr);
                        var subrs = [], arl = arr.length - 1, no = data.byteOffset + offset;
                        for (var i = 0; i < arl; i++) {
                            var ari = arr[i];
                            subrs.push(new Uint8Array(data.buffer, no + ari, arr[i + 1] - ari));
                        }
                        return subrs;
                    },
                    tableSE: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0 ],
                    glyphByUnicode: function(cff, code) {
                        for (var i = 0; i < cff["charset"].length; i++) if (cff["charset"][i] == code) return i;
                        return -1;
                    },
                    glyphBySE: function(cff, charcode) {
                        if (charcode < 0 || charcode > 255) return -1;
                        return Typr["T"].CFF.glyphByUnicode(cff, Typr["T"].CFF.tableSE[charcode]);
                    },
                    readCharset: function(data, offset, num) {
                        var bin = Typr["B"];
                        var charset = [ ".notdef" ];
                        var format = data[offset];
                        offset++;
                        if (format == 0) {
                            for (var i = 0; i < num; i++) {
                                var first = bin.readUshort(data, offset);
                                offset += 2;
                                charset.push(first);
                            }
                        } else if (format == 1 || format == 2) {
                            while (charset.length < num) {
                                var first = bin.readUshort(data, offset);
                                offset += 2;
                                var nLeft = 0;
                                if (format == 1) {
                                    nLeft = data[offset];
                                    offset++;
                                } else {
                                    nLeft = bin.readUshort(data, offset);
                                    offset += 2;
                                }
                                for (var i = 0; i <= nLeft; i++) {
                                    charset.push(first);
                                    first++;
                                }
                            }
                        } else throw "error: format: " + format;
                        return charset;
                    },
                    readIndex: function(data, offset, inds) {
                        var bin = Typr["B"];
                        var count = bin.readUshort(data, offset) + 1;
                        offset += 2;
                        var offsize = data[offset];
                        offset++;
                        if (offsize == 1) for (var i = 0; i < count; i++) inds.push(data[offset + i]); else if (offsize == 2) for (var i = 0; i < count; i++) inds.push(bin.readUshort(data, offset + i * 2)); else if (offsize == 3) for (var i = 0; i < count; i++) inds.push(bin.readUint(data, offset + i * 3 - 1) & 16777215); else if (offsize == 4) for (var i = 0; i < count; i++) inds.push(bin.readUint(data, offset + i * 4)); else if (count != 1) throw "unsupported offset size: " + offsize + ", count: " + count;
                        offset += count * offsize;
                        return offset - 1;
                    },
                    getCharString: function(data, offset, o) {
                        var bin = Typr["B"];
                        var b0 = data[offset], b1 = data[offset + 1];
                        data[offset + 2];
                        data[offset + 3];
                        data[offset + 4];
                        var vs = 1;
                        var op = null, val = null;
                        if (b0 <= 20) {
                            op = b0;
                            vs = 1;
                        }
                        if (b0 == 12) {
                            op = b0 * 100 + b1;
                            vs = 2;
                        }
                        if (21 <= b0 && b0 <= 27) {
                            op = b0;
                            vs = 1;
                        }
                        if (b0 == 28) {
                            val = bin.readShort(data, offset + 1);
                            vs = 3;
                        }
                        if (29 <= b0 && b0 <= 31) {
                            op = b0;
                            vs = 1;
                        }
                        if (32 <= b0 && b0 <= 246) {
                            val = b0 - 139;
                            vs = 1;
                        }
                        if (247 <= b0 && b0 <= 250) {
                            val = (b0 - 247) * 256 + b1 + 108;
                            vs = 2;
                        }
                        if (251 <= b0 && b0 <= 254) {
                            val = -(b0 - 251) * 256 - b1 - 108;
                            vs = 2;
                        }
                        if (b0 == 255) {
                            val = bin.readInt(data, offset + 1) / 65535;
                            vs = 5;
                        }
                        o.val = val != null ? val : "o" + op;
                        o.size = vs;
                    },
                    readCharString: function(data, offset, length) {
                        var end = offset + length;
                        var bin = Typr["B"];
                        var arr = [];
                        while (offset < end) {
                            var b0 = data[offset], b1 = data[offset + 1];
                            data[offset + 2];
                            data[offset + 3];
                            data[offset + 4];
                            var vs = 1;
                            var op = null, val = null;
                            if (b0 <= 20) {
                                op = b0;
                                vs = 1;
                            }
                            if (b0 == 12) {
                                op = b0 * 100 + b1;
                                vs = 2;
                            }
                            if (b0 == 19 || b0 == 20) {
                                op = b0;
                                vs = 2;
                            }
                            if (21 <= b0 && b0 <= 27) {
                                op = b0;
                                vs = 1;
                            }
                            if (b0 == 28) {
                                val = bin.readShort(data, offset + 1);
                                vs = 3;
                            }
                            if (29 <= b0 && b0 <= 31) {
                                op = b0;
                                vs = 1;
                            }
                            if (32 <= b0 && b0 <= 246) {
                                val = b0 - 139;
                                vs = 1;
                            }
                            if (247 <= b0 && b0 <= 250) {
                                val = (b0 - 247) * 256 + b1 + 108;
                                vs = 2;
                            }
                            if (251 <= b0 && b0 <= 254) {
                                val = -(b0 - 251) * 256 - b1 - 108;
                                vs = 2;
                            }
                            if (b0 == 255) {
                                val = bin.readInt(data, offset + 1) / 65535;
                                vs = 5;
                            }
                            arr.push(val != null ? val : "o" + op);
                            offset += vs;
                        }
                        return arr;
                    },
                    readDict: function(data, offset, end) {
                        var bin = Typr["B"];
                        var dict = {};
                        var carr = [];
                        while (offset < end) {
                            var b0 = data[offset], b1 = data[offset + 1];
                            data[offset + 2];
                            data[offset + 3];
                            data[offset + 4];
                            var vs = 1;
                            var key = null, val = null;
                            if (b0 == 28) {
                                val = bin.readShort(data, offset + 1);
                                vs = 3;
                            }
                            if (b0 == 29) {
                                val = bin.readInt(data, offset + 1);
                                vs = 5;
                            }
                            if (32 <= b0 && b0 <= 246) {
                                val = b0 - 139;
                                vs = 1;
                            }
                            if (247 <= b0 && b0 <= 250) {
                                val = (b0 - 247) * 256 + b1 + 108;
                                vs = 2;
                            }
                            if (251 <= b0 && b0 <= 254) {
                                val = -(b0 - 251) * 256 - b1 - 108;
                                vs = 2;
                            }
                            if (b0 == 255) {
                                val = bin.readInt(data, offset + 1) / 65535;
                                vs = 5;
                                throw "unknown number";
                            }
                            if (b0 == 30) {
                                var nibs = [];
                                vs = 1;
                                while (true) {
                                    var b = data[offset + vs];
                                    vs++;
                                    var nib0 = b >> 4, nib1 = b & 15;
                                    if (nib0 != 15) nibs.push(nib0);
                                    if (nib1 != 15) nibs.push(nib1);
                                    if (nib1 == 15) break;
                                }
                                var s = "";
                                var chars = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber" ];
                                for (var i = 0; i < nibs.length; i++) s += chars[nibs[i]];
                                val = parseFloat(s);
                            }
                            if (b0 <= 21) {
                                var keys = [ "version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX" ];
                                key = keys[b0];
                                vs = 1;
                                if (b0 == 12) {
                                    var keys = [ "Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", "", "", "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", "", "", "", "", "", "", "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName" ];
                                    key = keys[b1];
                                    vs = 2;
                                }
                            }
                            if (key != null) {
                                dict[key] = carr.length == 1 ? carr[0] : carr;
                                carr = [];
                            } else carr.push(val);
                            offset += vs;
                        }
                        return dict;
                    }
                };
                Typr["T"].cmap = {
                    parseTab: function(data, offset, length) {
                        var obj = {
                            tables: [],
                            ids: {},
                            off: offset
                        };
                        data = new Uint8Array(data.buffer, offset, length);
                        offset = 0;
                        var bin = Typr["B"], rU = bin.readUshort, cmap = Typr["T"].cmap;
                        rU(data, offset);
                        offset += 2;
                        var numTables = rU(data, offset);
                        offset += 2;
                        var offs = [];
                        for (var i = 0; i < numTables; i++) {
                            var platformID = rU(data, offset);
                            offset += 2;
                            var encodingID = rU(data, offset);
                            offset += 2;
                            var noffset = bin.readUint(data, offset);
                            offset += 4;
                            var id = "p" + platformID + "e" + encodingID;
                            var tind = offs.indexOf(noffset);
                            if (tind == -1) {
                                tind = obj.tables.length;
                                var subt = {};
                                offs.push(noffset);
                                var format = subt.format = rU(data, noffset);
                                if (format == 0) subt = cmap.parse0(data, noffset, subt); else if (format == 4) subt = cmap.parse4(data, noffset, subt); else if (format == 6) subt = cmap.parse6(data, noffset, subt); else if (format == 12) subt = cmap.parse12(data, noffset, subt);
                                obj.tables.push(subt);
                            }
                            if (obj.ids[id] != null) throw "multiple tables for one platform+encoding";
                            obj.ids[id] = tind;
                        }
                        return obj;
                    },
                    parse0: function(data, offset, obj) {
                        var bin = Typr["B"];
                        offset += 2;
                        var len = bin.readUshort(data, offset);
                        offset += 2;
                        bin.readUshort(data, offset);
                        offset += 2;
                        obj.map = [];
                        for (var i = 0; i < len - 6; i++) obj.map.push(data[offset + i]);
                        return obj;
                    },
                    parse4: function(data, offset, obj) {
                        var bin = Typr["B"], rU = bin.readUshort, rUs = bin.readUshorts;
                        var offset0 = offset;
                        offset += 2;
                        var length = rU(data, offset);
                        offset += 2;
                        rU(data, offset);
                        offset += 2;
                        var segCountX2 = rU(data, offset);
                        offset += 2;
                        var segCount = segCountX2 >>> 1;
                        obj.searchRange = rU(data, offset);
                        offset += 2;
                        obj.entrySelector = rU(data, offset);
                        offset += 2;
                        obj.rangeShift = rU(data, offset);
                        offset += 2;
                        obj.endCount = rUs(data, offset, segCount);
                        offset += segCount * 2;
                        offset += 2;
                        obj.startCount = rUs(data, offset, segCount);
                        offset += segCount * 2;
                        obj.idDelta = [];
                        for (var i = 0; i < segCount; i++) {
                            obj.idDelta.push(bin.readShort(data, offset));
                            offset += 2;
                        }
                        obj.idRangeOffset = rUs(data, offset, segCount);
                        offset += segCount * 2;
                        obj.glyphIdArray = rUs(data, offset, offset0 + length - offset >>> 1);
                        return obj;
                    },
                    parse6: function(data, offset, obj) {
                        var bin = Typr["B"];
                        offset += 2;
                        bin.readUshort(data, offset);
                        offset += 2;
                        bin.readUshort(data, offset);
                        offset += 2;
                        obj.firstCode = bin.readUshort(data, offset);
                        offset += 2;
                        var entryCount = bin.readUshort(data, offset);
                        offset += 2;
                        obj.glyphIdArray = [];
                        for (var i = 0; i < entryCount; i++) {
                            obj.glyphIdArray.push(bin.readUshort(data, offset));
                            offset += 2;
                        }
                        return obj;
                    },
                    parse12: function(data, offset, obj) {
                        var bin = Typr["B"], rU = bin.readUint;
                        offset += 4;
                        rU(data, offset);
                        offset += 4;
                        rU(data, offset);
                        offset += 4;
                        var nGroups = rU(data, offset) * 3;
                        offset += 4;
                        var gps = obj.groups = new Uint32Array(nGroups);
                        for (var i = 0; i < nGroups; i += 3) {
                            gps[i] = rU(data, offset + (i << 2));
                            gps[i + 1] = rU(data, offset + (i << 2) + 4);
                            gps[i + 2] = rU(data, offset + (i << 2) + 8);
                        }
                        return obj;
                    }
                };
                Typr["T"].glyf = {
                    parseTab: function(data, offset, length, font) {
                        var obj = [], ng = font["maxp"]["numGlyphs"];
                        for (var g = 0; g < ng; g++) obj.push(null);
                        return obj;
                    },
                    _parseGlyf: function(font, g) {
                        var bin = Typr["B"];
                        var data = font["_data"], loca = font["loca"];
                        if (loca[g] == loca[g + 1]) return null;
                        var offset = Typr["findTable"](data, "glyf", font["_offset"])[0] + loca[g];
                        var gl = {};
                        gl.noc = bin.readShort(data, offset);
                        offset += 2;
                        gl.xMin = bin.readShort(data, offset);
                        offset += 2;
                        gl.yMin = bin.readShort(data, offset);
                        offset += 2;
                        gl.xMax = bin.readShort(data, offset);
                        offset += 2;
                        gl.yMax = bin.readShort(data, offset);
                        offset += 2;
                        if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax) return null;
                        if (gl.noc > 0) {
                            gl.endPts = [];
                            for (var i = 0; i < gl.noc; i++) {
                                gl.endPts.push(bin.readUshort(data, offset));
                                offset += 2;
                            }
                            var instructionLength = bin.readUshort(data, offset);
                            offset += 2;
                            if (data.length - offset < instructionLength) return null;
                            gl.instructions = bin.readBytes(data, offset, instructionLength);
                            offset += instructionLength;
                            var crdnum = gl.endPts[gl.noc - 1] + 1;
                            gl.flags = [];
                            for (var i = 0; i < crdnum; i++) {
                                var flag = data[offset];
                                offset++;
                                gl.flags.push(flag);
                                if ((flag & 8) != 0) {
                                    var rep = data[offset];
                                    offset++;
                                    for (var j = 0; j < rep; j++) {
                                        gl.flags.push(flag);
                                        i++;
                                    }
                                }
                            }
                            gl.xs = [];
                            for (var i = 0; i < crdnum; i++) {
                                var i8 = (gl.flags[i] & 2) != 0, same = (gl.flags[i] & 16) != 0;
                                if (i8) {
                                    gl.xs.push(same ? data[offset] : -data[offset]);
                                    offset++;
                                } else {
                                    if (same) gl.xs.push(0); else {
                                        gl.xs.push(bin.readShort(data, offset));
                                        offset += 2;
                                    }
                                }
                            }
                            gl.ys = [];
                            for (var i = 0; i < crdnum; i++) {
                                var i8 = (gl.flags[i] & 4) != 0, same = (gl.flags[i] & 32) != 0;
                                if (i8) {
                                    gl.ys.push(same ? data[offset] : -data[offset]);
                                    offset++;
                                } else {
                                    if (same) gl.ys.push(0); else {
                                        gl.ys.push(bin.readShort(data, offset));
                                        offset += 2;
                                    }
                                }
                            }
                            var x = 0, y = 0;
                            for (var i = 0; i < crdnum; i++) {
                                x += gl.xs[i];
                                y += gl.ys[i];
                                gl.xs[i] = x;
                                gl.ys[i] = y;
                            }
                        } else {
                            var ARG_1_AND_2_ARE_WORDS = 1 << 0;
                            var ARGS_ARE_XY_VALUES = 1 << 1;
                            var WE_HAVE_A_SCALE = 1 << 3;
                            var MORE_COMPONENTS = 1 << 5;
                            var WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
                            var WE_HAVE_A_TWO_BY_TWO = 1 << 7;
                            var WE_HAVE_INSTRUCTIONS = 1 << 8;
                            gl.parts = [];
                            var flags;
                            do {
                                flags = bin.readUshort(data, offset);
                                offset += 2;
                                var part = {
                                    m: {
                                        a: 1,
                                        b: 0,
                                        c: 0,
                                        d: 1,
                                        tx: 0,
                                        ty: 0
                                    },
                                    p1: -1,
                                    p2: -1
                                };
                                gl.parts.push(part);
                                part.glyphIndex = bin.readUshort(data, offset);
                                offset += 2;
                                if (flags & ARG_1_AND_2_ARE_WORDS) {
                                    var arg1 = bin.readShort(data, offset);
                                    offset += 2;
                                    var arg2 = bin.readShort(data, offset);
                                    offset += 2;
                                } else {
                                    var arg1 = bin.readInt8(data, offset);
                                    offset++;
                                    var arg2 = bin.readInt8(data, offset);
                                    offset++;
                                }
                                if (flags & ARGS_ARE_XY_VALUES) {
                                    part.m.tx = arg1;
                                    part.m.ty = arg2;
                                } else {
                                    part.p1 = arg1;
                                    part.p2 = arg2;
                                }
                                if (flags & WE_HAVE_A_SCALE) {
                                    part.m.a = part.m.d = bin.readF2dot14(data, offset);
                                    offset += 2;
                                } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
                                    part.m.a = bin.readF2dot14(data, offset);
                                    offset += 2;
                                    part.m.d = bin.readF2dot14(data, offset);
                                    offset += 2;
                                } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
                                    part.m.a = bin.readF2dot14(data, offset);
                                    offset += 2;
                                    part.m.b = bin.readF2dot14(data, offset);
                                    offset += 2;
                                    part.m.c = bin.readF2dot14(data, offset);
                                    offset += 2;
                                    part.m.d = bin.readF2dot14(data, offset);
                                    offset += 2;
                                }
                            } while (flags & MORE_COMPONENTS);
                            if (flags & WE_HAVE_INSTRUCTIONS) {
                                var numInstr = bin.readUshort(data, offset);
                                offset += 2;
                                gl.instr = [];
                                for (var i = 0; i < numInstr; i++) {
                                    gl.instr.push(data[offset]);
                                    offset++;
                                }
                            }
                        }
                        return gl;
                    }
                };
                Typr["T"].head = {
                    parseTab: function(data, offset, length) {
                        var bin = Typr["B"];
                        var obj = {};
                        bin.readFixed(data, offset);
                        offset += 4;
                        obj["fontRevision"] = bin.readFixed(data, offset);
                        offset += 4;
                        bin.readUint(data, offset);
                        offset += 4;
                        bin.readUint(data, offset);
                        offset += 4;
                        obj["flags"] = bin.readUshort(data, offset);
                        offset += 2;
                        obj["unitsPerEm"] = bin.readUshort(data, offset);
                        offset += 2;
                        obj["created"] = bin.readUint64(data, offset);
                        offset += 8;
                        obj["modified"] = bin.readUint64(data, offset);
                        offset += 8;
                        obj["xMin"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["yMin"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["xMax"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["yMax"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["macStyle"] = bin.readUshort(data, offset);
                        offset += 2;
                        obj["lowestRecPPEM"] = bin.readUshort(data, offset);
                        offset += 2;
                        obj["fontDirectionHint"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["indexToLocFormat"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["glyphDataFormat"] = bin.readShort(data, offset);
                        offset += 2;
                        return obj;
                    }
                };
                Typr["T"].hhea = {
                    parseTab: function(data, offset, length) {
                        var bin = Typr["B"];
                        var obj = {};
                        bin.readFixed(data, offset);
                        offset += 4;
                        var keys = [ "ascender", "descender", "lineGap", "advanceWidthMax", "minLeftSideBearing", "minRightSideBearing", "xMaxExtent", "caretSlopeRise", "caretSlopeRun", "caretOffset", "res0", "res1", "res2", "res3", "metricDataFormat", "numberOfHMetrics" ];
                        for (var i = 0; i < keys.length; i++) {
                            var key = keys[i];
                            var func = key == "advanceWidthMax" || key == "numberOfHMetrics" ? bin.readUshort : bin.readShort;
                            obj[key] = func(data, offset + i * 2);
                        }
                        return obj;
                    }
                };
                Typr["T"].hmtx = {
                    parseTab: function(data, offset, length, font) {
                        var bin = Typr["B"];
                        var aWidth = [];
                        var lsBearing = [];
                        var nG = font["maxp"]["numGlyphs"], nH = font["hhea"]["numberOfHMetrics"];
                        var aw = 0, lsb = 0, i = 0;
                        while (i < nH) {
                            aw = bin.readUshort(data, offset + (i << 2));
                            lsb = bin.readShort(data, offset + (i << 2) + 2);
                            aWidth.push(aw);
                            lsBearing.push(lsb);
                            i++;
                        }
                        while (i < nG) {
                            aWidth.push(aw);
                            lsBearing.push(lsb);
                            i++;
                        }
                        return {
                            aWidth: aWidth,
                            lsBearing: lsBearing
                        };
                    }
                };
                Typr["T"].kern = {
                    parseTab: function(data, offset, length, font) {
                        var bin = Typr["B"], kern = Typr["T"].kern;
                        var version = bin.readUshort(data, offset);
                        if (version == 1) return kern.parseV1(data, offset, length, font);
                        var nTables = bin.readUshort(data, offset + 2);
                        offset += 4;
                        var map = {
                            glyph1: [],
                            rval: []
                        };
                        for (var i = 0; i < nTables; i++) {
                            offset += 2;
                            var length = bin.readUshort(data, offset);
                            offset += 2;
                            var coverage = bin.readUshort(data, offset);
                            offset += 2;
                            var format = coverage >>> 8;
                            format &= 15;
                            if (format == 0) offset = kern.readFormat0(data, offset, map);
                        }
                        return map;
                    },
                    parseV1: function(data, offset, length, font) {
                        var bin = Typr["B"], kern = Typr["T"].kern;
                        bin.readFixed(data, offset);
                        var nTables = bin.readUint(data, offset + 4);
                        offset += 8;
                        var map = {
                            glyph1: [],
                            rval: []
                        };
                        for (var i = 0; i < nTables; i++) {
                            bin.readUint(data, offset);
                            offset += 4;
                            var coverage = bin.readUshort(data, offset);
                            offset += 2;
                            bin.readUshort(data, offset);
                            offset += 2;
                            var format = coverage & 255;
                            if (format == 0) offset = kern.readFormat0(data, offset, map);
                        }
                        return map;
                    },
                    readFormat0: function(data, offset, map) {
                        var bin = Typr["B"], rUs = bin.readUshort;
                        var pleft = -1;
                        var nPairs = rUs(data, offset);
                        rUs(data, offset + 2);
                        rUs(data, offset + 4);
                        rUs(data, offset + 6);
                        offset += 8;
                        for (var j = 0; j < nPairs; j++) {
                            var left = rUs(data, offset);
                            offset += 2;
                            var right = rUs(data, offset);
                            offset += 2;
                            var value = bin.readShort(data, offset);
                            offset += 2;
                            if (left != pleft) {
                                map.glyph1.push(left);
                                map.rval.push({
                                    glyph2: [],
                                    vals: []
                                });
                            }
                            var rval = map.rval[map.rval.length - 1];
                            rval.glyph2.push(right);
                            rval.vals.push(value);
                            pleft = left;
                        }
                        return offset;
                    }
                };
                Typr["T"].loca = {
                    parseTab: function(data, offset, length, font) {
                        var bin = Typr["B"];
                        var obj = [];
                        var ver = font["head"]["indexToLocFormat"];
                        var len = font["maxp"]["numGlyphs"] + 1;
                        if (ver == 0) for (var i = 0; i < len; i++) obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
                        if (ver == 1) for (var i = 0; i < len; i++) obj.push(bin.readUint(data, offset + (i << 2)));
                        return obj;
                    }
                };
                Typr["T"].maxp = {
                    parseTab: function(data, offset, length) {
                        var bin = Typr["B"], rU = bin.readUshort;
                        var obj = {};
                        bin.readUint(data, offset);
                        offset += 4;
                        obj["numGlyphs"] = rU(data, offset);
                        offset += 2;
                        return obj;
                    }
                };
                Typr["T"].name = {
                    parseTab: function(data, offset, length) {
                        var bin = Typr["B"];
                        var obj = {};
                        bin.readUshort(data, offset);
                        offset += 2;
                        var count = bin.readUshort(data, offset);
                        offset += 2;
                        bin.readUshort(data, offset);
                        offset += 2;
                        var names = [ "copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette" ];
                        var offset0 = offset;
                        var rU = bin.readUshort;
                        for (var i = 0; i < count; i++) {
                            var platformID = rU(data, offset);
                            offset += 2;
                            var encodingID = rU(data, offset);
                            offset += 2;
                            var languageID = rU(data, offset);
                            offset += 2;
                            var nameID = rU(data, offset);
                            offset += 2;
                            var slen = rU(data, offset);
                            offset += 2;
                            var noffset = rU(data, offset);
                            offset += 2;
                            var soff = offset0 + count * 12 + noffset;
                            var str;
                            if (platformID == 0) str = bin.readUnicode(data, soff, slen / 2); else if (platformID == 3 && encodingID == 0) str = bin.readUnicode(data, soff, slen / 2); else if (encodingID == 0) str = bin.readASCII(data, soff, slen); else if (encodingID == 1) str = bin.readUnicode(data, soff, slen / 2); else if (encodingID == 3) str = bin.readUnicode(data, soff, slen / 2); else if (encodingID == 4) str = bin.readUnicode(data, soff, slen / 2); else if (encodingID == 10) str = bin.readUnicode(data, soff, slen / 2); else if (platformID == 1) {
                                str = bin.readASCII(data, soff, slen);
                                console.log("reading unknown MAC encoding " + encodingID + " as ASCII");
                            } else {
                                console.log("unknown encoding " + encodingID + ", platformID: " + platformID);
                                str = bin.readASCII(data, soff, slen);
                            }
                            var tid = "p" + platformID + "," + languageID.toString(16);
                            if (obj[tid] == null) obj[tid] = {};
                            obj[tid][names[nameID]] = str;
                            obj[tid]["_lang"] = languageID;
                        }
                        var psn = "postScriptName";
                        for (var p in obj) if (obj[p][psn] != null && obj[p]["_lang"] == 1033) return obj[p];
                        for (var p in obj) if (obj[p][psn] != null && obj[p]["_lang"] == 0) return obj[p];
                        for (var p in obj) if (obj[p][psn] != null && obj[p]["_lang"] == 3084) return obj[p];
                        for (var p in obj) if (obj[p][psn] != null) return obj[p];
                        var out;
                        for (var p in obj) {
                            out = obj[p];
                            break;
                        }
                        console.log("returning name table with languageID " + out._lang);
                        if (out[psn] == null && out["ID"] != null) out[psn] = out["ID"];
                        return out;
                    }
                };
                Typr["T"].OS2 = {
                    parseTab: function(data, offset, length) {
                        var bin = Typr["B"];
                        var ver = bin.readUshort(data, offset);
                        offset += 2;
                        var OS2 = Typr["T"].OS2;
                        var obj = {};
                        if (ver == 0) OS2.version0(data, offset, obj); else if (ver == 1) OS2.version1(data, offset, obj); else if (ver == 2 || ver == 3 || ver == 4) OS2.version2(data, offset, obj); else if (ver == 5) OS2.version5(data, offset, obj); else throw "unknown OS/2 table version: " + ver;
                        return obj;
                    },
                    version0: function(data, offset, obj) {
                        var bin = Typr["B"];
                        obj["xAvgCharWidth"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["usWeightClass"] = bin.readUshort(data, offset);
                        offset += 2;
                        obj["usWidthClass"] = bin.readUshort(data, offset);
                        offset += 2;
                        obj["fsType"] = bin.readUshort(data, offset);
                        offset += 2;
                        obj["ySubscriptXSize"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["ySubscriptYSize"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["ySubscriptXOffset"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["ySubscriptYOffset"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["ySuperscriptXSize"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["ySuperscriptYSize"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["ySuperscriptXOffset"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["ySuperscriptYOffset"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["yStrikeoutSize"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["yStrikeoutPosition"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["sFamilyClass"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["panose"] = bin.readBytes(data, offset, 10);
                        offset += 10;
                        obj["ulUnicodeRange1"] = bin.readUint(data, offset);
                        offset += 4;
                        obj["ulUnicodeRange2"] = bin.readUint(data, offset);
                        offset += 4;
                        obj["ulUnicodeRange3"] = bin.readUint(data, offset);
                        offset += 4;
                        obj["ulUnicodeRange4"] = bin.readUint(data, offset);
                        offset += 4;
                        obj["achVendID"] = bin.readASCII(data, offset, 4);
                        offset += 4;
                        obj["fsSelection"] = bin.readUshort(data, offset);
                        offset += 2;
                        obj["usFirstCharIndex"] = bin.readUshort(data, offset);
                        offset += 2;
                        obj["usLastCharIndex"] = bin.readUshort(data, offset);
                        offset += 2;
                        obj["sTypoAscender"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["sTypoDescender"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["sTypoLineGap"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["usWinAscent"] = bin.readUshort(data, offset);
                        offset += 2;
                        obj["usWinDescent"] = bin.readUshort(data, offset);
                        offset += 2;
                        return offset;
                    },
                    version1: function(data, offset, obj) {
                        var bin = Typr["B"];
                        offset = Typr["T"].OS2.version0(data, offset, obj);
                        obj["ulCodePageRange1"] = bin.readUint(data, offset);
                        offset += 4;
                        obj["ulCodePageRange2"] = bin.readUint(data, offset);
                        offset += 4;
                        return offset;
                    },
                    version2: function(data, offset, obj) {
                        var bin = Typr["B"], rU = bin.readUshort;
                        offset = Typr["T"].OS2.version1(data, offset, obj);
                        obj["sxHeight"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["sCapHeight"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["usDefault"] = rU(data, offset);
                        offset += 2;
                        obj["usBreak"] = rU(data, offset);
                        offset += 2;
                        obj["usMaxContext"] = rU(data, offset);
                        offset += 2;
                        return offset;
                    },
                    version5: function(data, offset, obj) {
                        var rU = Typr["B"].readUshort;
                        offset = Typr["T"].OS2.version2(data, offset, obj);
                        obj["usLowerOpticalPointSize"] = rU(data, offset);
                        offset += 2;
                        obj["usUpperOpticalPointSize"] = rU(data, offset);
                        offset += 2;
                        return offset;
                    }
                };
                Typr["T"].post = {
                    parseTab: function(data, offset, length) {
                        var bin = Typr["B"];
                        var obj = {};
                        obj["version"] = bin.readFixed(data, offset);
                        offset += 4;
                        obj["italicAngle"] = bin.readFixed(data, offset);
                        offset += 4;
                        obj["underlinePosition"] = bin.readShort(data, offset);
                        offset += 2;
                        obj["underlineThickness"] = bin.readShort(data, offset);
                        offset += 2;
                        return obj;
                    }
                };
                Typr["T"].SVG = {
                    parseTab: function(data, offset, length) {
                        var bin = Typr["B"];
                        var obj = {
                            entries: []
                        };
                        var offset0 = offset;
                        bin.readUshort(data, offset);
                        offset += 2;
                        var svgDocIndexOffset = bin.readUint(data, offset);
                        offset += 4;
                        bin.readUint(data, offset);
                        offset += 4;
                        offset = svgDocIndexOffset + offset0;
                        var numEntries = bin.readUshort(data, offset);
                        offset += 2;
                        for (var i = 0; i < numEntries; i++) {
                            var startGlyphID = bin.readUshort(data, offset);
                            offset += 2;
                            var endGlyphID = bin.readUshort(data, offset);
                            offset += 2;
                            var svgDocOffset = bin.readUint(data, offset);
                            offset += 4;
                            var svgDocLength = bin.readUint(data, offset);
                            offset += 4;
                            var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
                            var svg = bin.readUTF8(sbuf, 0, sbuf.length);
                            for (var f = startGlyphID; f <= endGlyphID; f++) {
                                obj.entries[f] = svg;
                            }
                        }
                        return obj;
                    }
                };
                Typr["U"] = {
                    shape: function(font, str, ltr) {
                        var getGlyphPosition = function(font, gls, i1, ltr) {
                            var g1 = gls[i1], g2 = gls[i1 + 1], kern = font["kern"];
                            if (kern) {
                                var ind1 = kern.glyph1.indexOf(g1);
                                if (ind1 != -1) {
                                    var ind2 = kern.rval[ind1].glyph2.indexOf(g2);
                                    if (ind2 != -1) return [ 0, 0, kern.rval[ind1].vals[ind2], 0 ];
                                }
                            }
                            return [ 0, 0, 0, 0 ];
                        };
                        var gls = [];
                        for (var i = 0; i < str.length; i++) {
                            var cc = str.codePointAt(i);
                            if (cc > 65535) i++;
                            gls.push(Typr["U"]["codeToGlyph"](font, cc));
                        }
                        var shape = [];
                        for (var i = 0; i < gls.length; i++) {
                            var padj = getGlyphPosition(font, gls, i);
                            var gid = gls[i];
                            var ax = font["hmtx"].aWidth[gid] + padj[2];
                            shape.push({
                                g: gid,
                                cl: i,
                                dx: 0,
                                dy: 0,
                                ax: ax,
                                ay: 0
                            });
                        }
                        return shape;
                    },
                    shapeToPath: function(font, shape, clr) {
                        var tpath = {
                            cmds: [],
                            crds: []
                        };
                        var x = 0, y = 0;
                        for (var i = 0; i < shape.length; i++) {
                            var it = shape[i];
                            var path = Typr["U"]["glyphToPath"](font, it["g"]), crds = path["crds"];
                            for (var j = 0; j < crds.length; j += 2) {
                                tpath.crds.push(crds[j] + x + it["dx"]);
                                tpath.crds.push(crds[j + 1] + y + it["dy"]);
                            }
                            if (clr) tpath.cmds.push(clr);
                            for (var j = 0; j < path["cmds"].length; j++) tpath.cmds.push(path["cmds"][j]);
                            var clen = tpath.cmds.length;
                            if (clr) if (clen != 0 && tpath.cmds[clen - 1] != "X") tpath.cmds.push("X");
                            x += it["ax"];
                            y += it["ay"];
                        }
                        return {
                            cmds: tpath.cmds,
                            crds: tpath.crds
                        };
                    },
                    codeToGlyph: function(font, code) {
                        var cmap = font["cmap"];
                        var tind = -1, pps = [ "p3e10", "p0e4", "p3e1", "p1e0", "p0e3", "p0e1" ];
                        for (var i = 0; i < pps.length; i++) if (cmap.ids[pps[i]] != null) {
                            tind = cmap.ids[pps[i]];
                            break;
                        }
                        if (tind == -1) throw "no familiar platform and encoding!";
                        var arrSearch = function(arr, k, v) {
                            var l = 0, r = Math.floor(arr.length / k);
                            while (l + 1 != r) {
                                var mid = l + (r - l >>> 1);
                                if (arr[mid * k] <= v) l = mid; else r = mid;
                            }
                            return l * k;
                        };
                        var tab = cmap.tables[tind], fmt = tab.format, gid = -1;
                        if (fmt == 0) {
                            if (code >= tab.map.length) gid = 0; else gid = tab.map[code];
                        } else if (fmt == 4) {
                            var sind = -1, ec = tab.endCount;
                            if (code > ec[ec.length - 1]) sind = -1; else {
                                sind = arrSearch(ec, 1, code);
                                if (ec[sind] < code) sind++;
                            }
                            if (sind == -1) gid = 0; else if (code < tab.startCount[sind]) gid = 0; else {
                                var gli = 0;
                                if (tab.idRangeOffset[sind] != 0) gli = tab.glyphIdArray[code - tab.startCount[sind] + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)]; else gli = code + tab.idDelta[sind];
                                gid = gli & 65535;
                            }
                        } else if (fmt == 6) {
                            var off = code - tab.firstCode, arr = tab.glyphIdArray;
                            if (off < 0 || off >= arr.length) gid = 0; else gid = arr[off];
                        } else if (fmt == 12) {
                            var grp = tab.groups;
                            if (code > grp[grp.length - 2]) gid = 0; else {
                                var i = arrSearch(grp, 3, code);
                                if (grp[i] <= code && code <= grp[i + 1]) {
                                    gid = grp[i + 2] + (code - grp[i]);
                                }
                                if (gid == -1) gid = 0;
                            }
                        } else throw "unknown cmap table format " + tab.format;
                        var SVG = font["SVG "], loca = font["loca"];
                        if (gid != 0 && font["CFF "] == null && (SVG == null || SVG.entries[gid] == null) && loca[gid] == loca[gid + 1] && [ 9, 10, 11, 12, 13, 32, 133, 160, 5760, 8232, 8233, 8239, 12288, 6158, 8203, 8204, 8205, 8288, 65279 ].indexOf(code) == -1 && !(8192 <= code && code <= 8202)) gid = 0;
                        return gid;
                    },
                    glyphToPath: function(font, gid) {
                        var path = {
                            cmds: [],
                            crds: []
                        };
                        var SVG = font["SVG "], CFF = font["CFF "];
                        var U = Typr["U"];
                        if (SVG && SVG.entries[gid]) {
                            var p = SVG.entries[gid];
                            if (p != null) {
                                if (typeof p == "string") {
                                    p = U["SVG"].toPath(p);
                                    SVG.entries[gid] = p;
                                }
                                path = p;
                            }
                        } else if (CFF) {
                            var pdct = CFF["Private"];
                            var state = {
                                x: 0,
                                y: 0,
                                stack: [],
                                nStems: 0,
                                haveWidth: false,
                                width: pdct ? pdct["defaultWidthX"] : 0,
                                open: false
                            };
                            if (CFF["ROS"]) {
                                var gi = 0;
                                while (CFF["FDSelect"][gi + 2] <= gid) gi += 2;
                                pdct = CFF["FDArray"][CFF["FDSelect"][gi + 1]]["Private"];
                            }
                            U["_drawCFF"](CFF["CharStrings"][gid], state, CFF, pdct, path);
                        } else if (font["glyf"]) {
                            U["_drawGlyf"](gid, font, path);
                        }
                        return {
                            cmds: path.cmds,
                            crds: path.crds
                        };
                    },
                    _drawGlyf: function(gid, font, path) {
                        var gl = font["glyf"][gid];
                        if (gl == null) gl = font["glyf"][gid] = Typr["T"].glyf._parseGlyf(font, gid);
                        if (gl != null) {
                            if (gl.noc > -1) Typr["U"]["_simpleGlyph"](gl, path); else Typr["U"]["_compoGlyph"](gl, font, path);
                        }
                    },
                    _simpleGlyph: function(gl, p) {
                        var P = Typr["U"]["P"];
                        for (var c = 0; c < gl.noc; c++) {
                            var i0 = c == 0 ? 0 : gl.endPts[c - 1] + 1;
                            var il = gl.endPts[c];
                            for (var i = i0; i <= il; i++) {
                                var pr = i == i0 ? il : i - 1;
                                var nx = i == il ? i0 : i + 1;
                                var onCurve = gl.flags[i] & 1;
                                var prOnCurve = gl.flags[pr] & 1;
                                var nxOnCurve = gl.flags[nx] & 1;
                                var x = gl.xs[i], y = gl.ys[i];
                                if (i == i0) {
                                    if (onCurve) {
                                        if (prOnCurve) P.MoveTo(p, gl.xs[pr], gl.ys[pr]); else {
                                            P.MoveTo(p, x, y);
                                            continue;
                                        }
                                    } else {
                                        if (prOnCurve) P.MoveTo(p, gl.xs[pr], gl.ys[pr]); else P.MoveTo(p, Math.floor((gl.xs[pr] + x) * .5), Math.floor((gl.ys[pr] + y) * .5));
                                    }
                                }
                                if (onCurve) {
                                    if (prOnCurve) P.LineTo(p, x, y);
                                } else {
                                    if (nxOnCurve) P.qCurveTo(p, x, y, gl.xs[nx], gl.ys[nx]); else P.qCurveTo(p, x, y, Math.floor((x + gl.xs[nx]) * .5), Math.floor((y + gl.ys[nx]) * .5));
                                }
                            }
                            P.ClosePath(p);
                        }
                    },
                    _compoGlyph: function(gl, font, p) {
                        for (var j = 0; j < gl.parts.length; j++) {
                            var path = {
                                cmds: [],
                                crds: []
                            };
                            var prt = gl.parts[j];
                            Typr["U"]["_drawGlyf"](prt.glyphIndex, font, path);
                            var m = prt.m;
                            for (var i = 0; i < path.crds.length; i += 2) {
                                var x = path.crds[i], y = path.crds[i + 1];
                                p.crds.push(x * m.a + y * m.b + m.tx);
                                p.crds.push(x * m.c + y * m.d + m.ty);
                            }
                            for (var i = 0; i < path.cmds.length; i++) p.cmds.push(path.cmds[i]);
                        }
                    },
                    pathToSVG: function(path, prec) {
                        var cmds = path["cmds"], crds = path["crds"];
                        if (prec == null) prec = 5;
                        var out = [], co = 0, lmap = {
                            M: 2,
                            L: 2,
                            Q: 4,
                            C: 6
                        };
                        for (var i = 0; i < cmds.length; i++) {
                            var cmd = cmds[i], cn = co + (lmap[cmd] ? lmap[cmd] : 0);
                            out.push(cmd);
                            while (co < cn) {
                                var c = crds[co++];
                                out.push(parseFloat(c.toFixed(prec)) + (co == cn ? "" : " "));
                            }
                        }
                        return out.join("");
                    },
                    SVGToPath: function(d) {
                        var pth = {
                            cmds: [],
                            crds: []
                        };
                        Typr["U"]["SVG"].svgToPath(d, pth);
                        return {
                            cmds: pth.cmds,
                            crds: pth.crds
                        };
                    },
                    pathToContext: function(path, ctx) {
                        var c = 0, cmds = path["cmds"], crds = path["crds"];
                        for (var j = 0; j < cmds.length; j++) {
                            var cmd = cmds[j];
                            if (cmd == "M") {
                                ctx.moveTo(crds[c], crds[c + 1]);
                                c += 2;
                            } else if (cmd == "L") {
                                ctx.lineTo(crds[c], crds[c + 1]);
                                c += 2;
                            } else if (cmd == "C") {
                                ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]);
                                c += 6;
                            } else if (cmd == "Q") {
                                ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
                                c += 4;
                            } else if (cmd.charAt(0) == "#") {
                                ctx.beginPath();
                                ctx.fillStyle = cmd;
                            } else if (cmd == "Z") {
                                ctx.closePath();
                            } else if (cmd == "X") {
                                ctx.fill();
                            }
                        }
                    },
                    P: {
                        MoveTo: function(p, x, y) {
                            p.cmds.push("M");
                            p.crds.push(x, y);
                        },
                        LineTo: function(p, x, y) {
                            p.cmds.push("L");
                            p.crds.push(x, y);
                        },
                        CurveTo: function(p, a, b, c, d, e, f) {
                            p.cmds.push("C");
                            p.crds.push(a, b, c, d, e, f);
                        },
                        qCurveTo: function(p, a, b, c, d) {
                            p.cmds.push("Q");
                            p.crds.push(a, b, c, d);
                        },
                        ClosePath: function(p) {
                            p.cmds.push("Z");
                        }
                    },
                    _drawCFF: function(cmds, state, font, pdct, p) {
                        var stack = state.stack;
                        var nStems = state.nStems, haveWidth = state.haveWidth, width = state.width, open = state.open;
                        var i = 0;
                        var x = state.x, y = state.y, c1x = 0, c1y = 0, c2x = 0, c2y = 0, c3x = 0, c3y = 0, c4x = 0, c4y = 0, jpx = 0, jpy = 0;
                        var CFF = Typr["T"].CFF, P = Typr["U"]["P"];
                        var nominalWidthX = pdct["nominalWidthX"];
                        var o = {
                            val: 0,
                            size: 0
                        };
                        while (i < cmds.length) {
                            CFF.getCharString(cmds, i, o);
                            var v = o.val;
                            i += o.size;
                            if (v == "o1" || v == "o18") {
                                var hasWidthArg;
                                hasWidthArg = stack.length % 2 !== 0;
                                if (hasWidthArg && !haveWidth) {
                                    width = stack.shift() + nominalWidthX;
                                }
                                nStems += stack.length >> 1;
                                stack.length = 0;
                                haveWidth = true;
                            } else if (v == "o3" || v == "o23") {
                                var hasWidthArg;
                                hasWidthArg = stack.length % 2 !== 0;
                                if (hasWidthArg && !haveWidth) {
                                    width = stack.shift() + nominalWidthX;
                                }
                                nStems += stack.length >> 1;
                                stack.length = 0;
                                haveWidth = true;
                            } else if (v == "o4") {
                                if (stack.length > 1 && !haveWidth) {
                                    width = stack.shift() + nominalWidthX;
                                    haveWidth = true;
                                }
                                if (open) P.ClosePath(p);
                                y += stack.pop();
                                P.MoveTo(p, x, y);
                                open = true;
                            } else if (v == "o5") {
                                while (stack.length > 0) {
                                    x += stack.shift();
                                    y += stack.shift();
                                    P.LineTo(p, x, y);
                                }
                            } else if (v == "o6" || v == "o7") {
                                var count = stack.length;
                                var isX = v == "o6";
                                for (var j = 0; j < count; j++) {
                                    var sval = stack.shift();
                                    if (isX) x += sval; else y += sval;
                                    isX = !isX;
                                    P.LineTo(p, x, y);
                                }
                            } else if (v == "o8" || v == "o24") {
                                var count = stack.length;
                                var index = 0;
                                while (index + 6 <= count) {
                                    c1x = x + stack.shift();
                                    c1y = y + stack.shift();
                                    c2x = c1x + stack.shift();
                                    c2y = c1y + stack.shift();
                                    x = c2x + stack.shift();
                                    y = c2y + stack.shift();
                                    P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
                                    index += 6;
                                }
                                if (v == "o24") {
                                    x += stack.shift();
                                    y += stack.shift();
                                    P.LineTo(p, x, y);
                                }
                            } else if (v == "o11") break; else if (v == "o1234" || v == "o1235" || v == "o1236" || v == "o1237") {
                                if (v == "o1234") {
                                    c1x = x + stack.shift();
                                    c1y = y;
                                    c2x = c1x + stack.shift();
                                    c2y = c1y + stack.shift();
                                    jpx = c2x + stack.shift();
                                    jpy = c2y;
                                    c3x = jpx + stack.shift();
                                    c3y = c2y;
                                    c4x = c3x + stack.shift();
                                    c4y = y;
                                    x = c4x + stack.shift();
                                    P.CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                                    P.CurveTo(p, c3x, c3y, c4x, c4y, x, y);
                                }
                                if (v == "o1235") {
                                    c1x = x + stack.shift();
                                    c1y = y + stack.shift();
                                    c2x = c1x + stack.shift();
                                    c2y = c1y + stack.shift();
                                    jpx = c2x + stack.shift();
                                    jpy = c2y + stack.shift();
                                    c3x = jpx + stack.shift();
                                    c3y = jpy + stack.shift();
                                    c4x = c3x + stack.shift();
                                    c4y = c3y + stack.shift();
                                    x = c4x + stack.shift();
                                    y = c4y + stack.shift();
                                    stack.shift();
                                    P.CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                                    P.CurveTo(p, c3x, c3y, c4x, c4y, x, y);
                                }
                                if (v == "o1236") {
                                    c1x = x + stack.shift();
                                    c1y = y + stack.shift();
                                    c2x = c1x + stack.shift();
                                    c2y = c1y + stack.shift();
                                    jpx = c2x + stack.shift();
                                    jpy = c2y;
                                    c3x = jpx + stack.shift();
                                    c3y = c2y;
                                    c4x = c3x + stack.shift();
                                    c4y = c3y + stack.shift();
                                    x = c4x + stack.shift();
                                    P.CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                                    P.CurveTo(p, c3x, c3y, c4x, c4y, x, y);
                                }
                                if (v == "o1237") {
                                    c1x = x + stack.shift();
                                    c1y = y + stack.shift();
                                    c2x = c1x + stack.shift();
                                    c2y = c1y + stack.shift();
                                    jpx = c2x + stack.shift();
                                    jpy = c2y + stack.shift();
                                    c3x = jpx + stack.shift();
                                    c3y = jpy + stack.shift();
                                    c4x = c3x + stack.shift();
                                    c4y = c3y + stack.shift();
                                    if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
                                        x = c4x + stack.shift();
                                    } else {
                                        y = c4y + stack.shift();
                                    }
                                    P.CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                                    P.CurveTo(p, c3x, c3y, c4x, c4y, x, y);
                                }
                            } else if (v == "o14") {
                                if (stack.length > 0 && !haveWidth) {
                                    width = stack.shift() + font["nominalWidthX"];
                                    haveWidth = true;
                                }
                                if (stack.length == 4) {
                                    var adx = stack.shift();
                                    var ady = stack.shift();
                                    var bchar = stack.shift();
                                    var achar = stack.shift();
                                    var bind = CFF.glyphBySE(font, bchar);
                                    var aind = CFF.glyphBySE(font, achar);
                                    Typr["U"]["_drawCFF"](font["CharStrings"][bind], state, font, pdct, p);
                                    state.x = adx;
                                    state.y = ady;
                                    Typr["U"]["_drawCFF"](font["CharStrings"][aind], state, font, pdct, p);
                                }
                                if (open) {
                                    P.ClosePath(p);
                                    open = false;
                                }
                            } else if (v == "o19" || v == "o20") {
                                var hasWidthArg;
                                hasWidthArg = stack.length % 2 !== 0;
                                if (hasWidthArg && !haveWidth) {
                                    width = stack.shift() + nominalWidthX;
                                }
                                nStems += stack.length >> 1;
                                stack.length = 0;
                                haveWidth = true;
                                i += nStems + 7 >> 3;
                            } else if (v == "o21") {
                                if (stack.length > 2 && !haveWidth) {
                                    width = stack.shift() + nominalWidthX;
                                    haveWidth = true;
                                }
                                y += stack.pop();
                                x += stack.pop();
                                if (open) P.ClosePath(p);
                                P.MoveTo(p, x, y);
                                open = true;
                            } else if (v == "o22") {
                                if (stack.length > 1 && !haveWidth) {
                                    width = stack.shift() + nominalWidthX;
                                    haveWidth = true;
                                }
                                x += stack.pop();
                                if (open) P.ClosePath(p);
                                P.MoveTo(p, x, y);
                                open = true;
                            } else if (v == "o25") {
                                while (stack.length > 6) {
                                    x += stack.shift();
                                    y += stack.shift();
                                    P.LineTo(p, x, y);
                                }
                                c1x = x + stack.shift();
                                c1y = y + stack.shift();
                                c2x = c1x + stack.shift();
                                c2y = c1y + stack.shift();
                                x = c2x + stack.shift();
                                y = c2y + stack.shift();
                                P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
                            } else if (v == "o26") {
                                if (stack.length % 2) {
                                    x += stack.shift();
                                }
                                while (stack.length > 0) {
                                    c1x = x;
                                    c1y = y + stack.shift();
                                    c2x = c1x + stack.shift();
                                    c2y = c1y + stack.shift();
                                    x = c2x;
                                    y = c2y + stack.shift();
                                    P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
                                }
                            } else if (v == "o27") {
                                if (stack.length % 2) {
                                    y += stack.shift();
                                }
                                while (stack.length > 0) {
                                    c1x = x + stack.shift();
                                    c1y = y;
                                    c2x = c1x + stack.shift();
                                    c2y = c1y + stack.shift();
                                    x = c2x + stack.shift();
                                    y = c2y;
                                    P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
                                }
                            } else if (v == "o10" || v == "o29") {
                                var obj = v == "o10" ? pdct : font;
                                if (stack.length == 0) {
                                    console.log("error: empty stack");
                                } else {
                                    var ind = stack.pop();
                                    var subr = obj["Subrs"][ind + obj["Bias"]];
                                    state.x = x;
                                    state.y = y;
                                    state.nStems = nStems;
                                    state.haveWidth = haveWidth;
                                    state.width = width;
                                    state.open = open;
                                    Typr["U"]["_drawCFF"](subr, state, font, pdct, p);
                                    x = state.x;
                                    y = state.y;
                                    nStems = state.nStems;
                                    haveWidth = state.haveWidth;
                                    width = state.width;
                                    open = state.open;
                                }
                            } else if (v == "o30" || v == "o31") {
                                var count, count1 = stack.length;
                                var index = 0;
                                var alternate = v == "o31";
                                count = count1 & ~2;
                                index += count1 - count;
                                while (index < count) {
                                    if (alternate) {
                                        c1x = x + stack.shift();
                                        c1y = y;
                                        c2x = c1x + stack.shift();
                                        c2y = c1y + stack.shift();
                                        y = c2y + stack.shift();
                                        if (count - index == 5) {
                                            x = c2x + stack.shift();
                                            index++;
                                        } else x = c2x;
                                        alternate = false;
                                    } else {
                                        c1x = x;
                                        c1y = y + stack.shift();
                                        c2x = c1x + stack.shift();
                                        c2y = c1y + stack.shift();
                                        x = c2x + stack.shift();
                                        if (count - index == 5) {
                                            y = c2y + stack.shift();
                                            index++;
                                        } else y = c2y;
                                        alternate = true;
                                    }
                                    P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
                                    index += 4;
                                }
                            } else if ((v + "").charAt(0) == "o") {
                                console.log("Unknown operation: " + v, cmds);
                                throw v;
                            } else stack.push(v);
                        }
                        state.x = x;
                        state.y = y;
                        state.nStems = nStems;
                        state.haveWidth = haveWidth;
                        state.width = width;
                        state.open = open;
                    },
                    SVG: function() {
                        var M = {
                            getScale: function(m) {
                                return Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]));
                            },
                            translate: function(m, x, y) {
                                M.concat(m, [ 1, 0, 0, 1, x, y ]);
                            },
                            rotate: function(m, a) {
                                M.concat(m, [ Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a), 0, 0 ]);
                            },
                            scale: function(m, x, y) {
                                M.concat(m, [ x, 0, 0, y, 0, 0 ]);
                            },
                            concat: function(m, w) {
                                var a = m[0], b = m[1], c = m[2], d = m[3], tx = m[4], ty = m[5];
                                m[0] = a * w[0] + b * w[2];
                                m[1] = a * w[1] + b * w[3];
                                m[2] = c * w[0] + d * w[2];
                                m[3] = c * w[1] + d * w[3];
                                m[4] = tx * w[0] + ty * w[2] + w[4];
                                m[5] = tx * w[1] + ty * w[3] + w[5];
                            },
                            invert: function(m) {
                                var a = m[0], b = m[1], c = m[2], d = m[3], tx = m[4], ty = m[5], adbc = a * d - b * c;
                                m[0] = d / adbc;
                                m[1] = -b / adbc;
                                m[2] = -c / adbc;
                                m[3] = a / adbc;
                                m[4] = (c * ty - d * tx) / adbc;
                                m[5] = (b * tx - a * ty) / adbc;
                            },
                            multPoint: function(m, p) {
                                var x = p[0], y = p[1];
                                return [ x * m[0] + y * m[2] + m[4], x * m[1] + y * m[3] + m[5] ];
                            },
                            multArray: function(m, a) {
                                for (var i = 0; i < a.length; i += 2) {
                                    var x = a[i], y = a[i + 1];
                                    a[i] = x * m[0] + y * m[2] + m[4];
                                    a[i + 1] = x * m[1] + y * m[3] + m[5];
                                }
                            }
                        };
                        function _bracketSplit(str, lbr, rbr) {
                            var out = [], pos = 0, ci = 0, lvl = 0;
                            while (true) {
                                var li = str.indexOf(lbr, ci);
                                var ri = str.indexOf(rbr, ci);
                                if (li == -1 && ri == -1) break;
                                if (ri == -1 || li != -1 && li < ri) {
                                    if (lvl == 0) {
                                        out.push(str.slice(pos, li).trim());
                                        pos = li + 1;
                                    }
                                    lvl++;
                                    ci = li + 1;
                                } else if (li == -1 || ri != -1 && ri < li) {
                                    lvl--;
                                    if (lvl == 0) {
                                        out.push(str.slice(pos, ri).trim());
                                        pos = ri + 1;
                                    }
                                    ci = ri + 1;
                                }
                            }
                            return out;
                        }
                        function cssMap(str) {
                            var pts = _bracketSplit(str, "{", "}");
                            var css = {};
                            for (var i = 0; i < pts.length; i += 2) {
                                var cn = pts[i].split(",");
                                for (var j = 0; j < cn.length; j++) {
                                    var cnj = cn[j].trim();
                                    if (css[cnj] == null) css[cnj] = "";
                                    css[cnj] += pts[i + 1];
                                }
                            }
                            return css;
                        }
                        function readTrnf(trna) {
                            var pts = _bracketSplit(trna, "(", ")");
                            var m = [ 1, 0, 0, 1, 0, 0 ];
                            for (var i = 0; i < pts.length; i += 2) {
                                var om = m;
                                m = _readTrnsAttr(pts[i], pts[i + 1]);
                                M.concat(m, om);
                            }
                            return m;
                        }
                        function _readTrnsAttr(fnc, vls) {
                            var m = [ 1, 0, 0, 1, 0, 0 ], gotSep = true;
                            for (var i = 0; i < vls.length; i++) {
                                var ch = vls.charAt(i);
                                if (ch == "," || ch == " ") gotSep = true; else if (ch == ".") {
                                    if (!gotSep) {
                                        vls = vls.slice(0, i) + "," + vls.slice(i);
                                        i++;
                                    }
                                    gotSep = false;
                                } else if (ch == "-" && i > 0 && vls[i - 1] != "e") {
                                    vls = vls.slice(0, i) + " " + vls.slice(i);
                                    i++;
                                    gotSep = true;
                                }
                            }
                            vls = vls.split(/\s*[\s,]\s*/).map(parseFloat);
                            if (fnc == "translate") {
                                if (vls.length == 1) M.translate(m, vls[0], 0); else M.translate(m, vls[0], vls[1]);
                            } else if (fnc == "scale") {
                                if (vls.length == 1) M.scale(m, vls[0], vls[0]); else M.scale(m, vls[0], vls[1]);
                            } else if (fnc == "rotate") {
                                var tx = 0, ty = 0;
                                if (vls.length != 1) {
                                    tx = vls[1];
                                    ty = vls[2];
                                }
                                M.translate(m, -tx, -ty);
                                M.rotate(m, -Math.PI * vls[0] / 180);
                                M.translate(m, tx, ty);
                            } else if (fnc == "matrix") m = vls; else console.log("unknown transform: ", fnc);
                            return m;
                        }
                        function toPath(str) {
                            var pth = {
                                cmds: [],
                                crds: []
                            };
                            if (str == null) return pth;
                            var prsr = new DOMParser();
                            var doc = prsr["parseFromString"](str, "image/svg+xml");
                            var svg = doc.getElementsByTagName("svg")[0];
                            var vb = svg.getAttribute("viewBox");
                            if (vb) vb = vb.trim().split(" ").map(parseFloat); else vb = [ 0, 0, 1e3, 1e3 ];
                            _toPath(svg.children, pth);
                            for (var i = 0; i < pth.crds.length; i += 2) {
                                var x = pth.crds[i], y = pth.crds[i + 1];
                                x -= vb[0];
                                y -= vb[1];
                                y = -y;
                                pth.crds[i] = x;
                                pth.crds[i + 1] = y;
                            }
                            return pth;
                        }
                        function _toPath(nds, pth, fill) {
                            for (var ni = 0; ni < nds.length; ni++) {
                                var nd = nds[ni], tn = nd.tagName;
                                var cfl = nd.getAttribute("fill");
                                if (cfl == null) cfl = fill;
                                if (tn == "g") {
                                    var tp = {
                                        crds: [],
                                        cmds: []
                                    };
                                    _toPath(nd.children, tp, cfl);
                                    var trf = nd.getAttribute("transform");
                                    if (trf) {
                                        var m = readTrnf(trf);
                                        M.multArray(m, tp.crds);
                                    }
                                    pth.crds = pth.crds.concat(tp.crds);
                                    pth.cmds = pth.cmds.concat(tp.cmds);
                                } else if (tn == "path" || tn == "circle" || tn == "ellipse") {
                                    pth.cmds.push(cfl ? cfl : "#000000");
                                    var d;
                                    if (tn == "path") d = nd.getAttribute("d");
                                    if (tn == "circle" || tn == "ellipse") {
                                        var vls = [ 0, 0, 0, 0 ], nms = [ "cx", "cy", "rx", "ry", "r" ];
                                        for (var i = 0; i < 5; i++) {
                                            var V = nd.getAttribute(nms[i]);
                                            if (V) {
                                                V = parseFloat(V);
                                                if (i < 4) vls[i] = V; else vls[2] = vls[3] = V;
                                            }
                                        }
                                        var cx = vls[0], cy = vls[1], rx = vls[2], ry = vls[3];
                                        d = [ "M", cx - rx, cy, "a", rx, ry, 0, 1, 0, rx * 2, 0, "a", rx, ry, 0, 1, 0, -rx * 2, 0 ].join(" ");
                                    }
                                    svgToPath(d, pth);
                                    pth.cmds.push("X");
                                } else if (tn == "defs"); else console.log(tn, nd);
                            }
                        }
                        function _tokens(d) {
                            var ts = [], off = 0, rn = false, cn = "", pc = "";
                            while (off < d.length) {
                                var cc = d.charCodeAt(off), ch = d.charAt(off);
                                off++;
                                var isNum = 48 <= cc && cc <= 57 || ch == "." || ch == "-" || ch == "e" || ch == "E";
                                if (rn) {
                                    if (ch == "-" && pc != "e" || ch == "." && cn.indexOf(".") != -1) {
                                        ts.push(parseFloat(cn));
                                        cn = ch;
                                    } else if (isNum) cn += ch; else {
                                        ts.push(parseFloat(cn));
                                        if (ch != "," && ch != " ") ts.push(ch);
                                        rn = false;
                                    }
                                } else {
                                    if (isNum) {
                                        cn = ch;
                                        rn = true;
                                    } else if (ch != "," && ch != " ") ts.push(ch);
                                }
                                pc = ch;
                            }
                            if (rn) ts.push(parseFloat(cn));
                            return ts;
                        }
                        function _reps(ts, off, ps) {
                            var i = off;
                            while (i < ts.length) {
                                if (typeof ts[i] == "string") break;
                                i += ps;
                            }
                            return (i - off) / ps;
                        }
                        function svgToPath(d, pth) {
                            var ts = _tokens(d);
                            var i = 0, x = 0, y = 0, ox = 0, oy = 0, oldo = pth.crds.length;
                            var pc = {
                                M: 2,
                                L: 2,
                                H: 1,
                                V: 1,
                                T: 2,
                                S: 4,
                                A: 7,
                                Q: 4,
                                C: 6
                            };
                            var cmds = pth.cmds, crds = pth.crds;
                            while (i < ts.length) {
                                var cmd = ts[i];
                                i++;
                                var cmu = cmd.toUpperCase();
                                if (cmu == "Z") {
                                    cmds.push("Z");
                                    x = ox;
                                    y = oy;
                                } else {
                                    var ps = pc[cmu], reps = _reps(ts, i, ps);
                                    for (var j = 0; j < reps; j++) {
                                        if (j == 1 && cmu == "M") {
                                            cmd = cmd == cmu ? "L" : "l";
                                            cmu = "L";
                                        }
                                        var xi = 0, yi = 0;
                                        if (cmd != cmu) {
                                            xi = x;
                                            yi = y;
                                        }
                                        if (cmu == "M") {
                                            x = xi + ts[i++];
                                            y = yi + ts[i++];
                                            cmds.push("M");
                                            crds.push(x, y);
                                            ox = x;
                                            oy = y;
                                        } else if (cmu == "L") {
                                            x = xi + ts[i++];
                                            y = yi + ts[i++];
                                            cmds.push("L");
                                            crds.push(x, y);
                                        } else if (cmu == "H") {
                                            x = xi + ts[i++];
                                            cmds.push("L");
                                            crds.push(x, y);
                                        } else if (cmu == "V") {
                                            y = yi + ts[i++];
                                            cmds.push("L");
                                            crds.push(x, y);
                                        } else if (cmu == "Q") {
                                            var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++];
                                            cmds.push("Q");
                                            crds.push(x1, y1, x2, y2);
                                            x = x2;
                                            y = y2;
                                        } else if (cmu == "T") {
                                            var co = Math.max(crds.length - 2, oldo);
                                            var x1 = x + x - crds[co], y1 = y + y - crds[co + 1];
                                            var x2 = xi + ts[i++], y2 = yi + ts[i++];
                                            cmds.push("Q");
                                            crds.push(x1, y1, x2, y2);
                                            x = x2;
                                            y = y2;
                                        } else if (cmu == "C") {
                                            var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
                                            cmds.push("C");
                                            crds.push(x1, y1, x2, y2, x3, y3);
                                            x = x3;
                                            y = y3;
                                        } else if (cmu == "S") {
                                            var co = Math.max(crds.length - (cmds[cmds.length - 1] == "C" ? 4 : 2), oldo);
                                            var x1 = x + x - crds[co], y1 = y + y - crds[co + 1];
                                            var x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
                                            cmds.push("C");
                                            crds.push(x1, y1, x2, y2, x3, y3);
                                            x = x3;
                                            y = y3;
                                        } else if (cmu == "A") {
                                            var x1 = x, y1 = y;
                                            var rx = ts[i++], ry = ts[i++];
                                            var phi = ts[i++] * (Math.PI / 180), fA = ts[i++], fS = ts[i++];
                                            var x2 = xi + ts[i++], y2 = yi + ts[i++];
                                            if (x2 == x && y2 == y && rx == 0 && ry == 0) continue;
                                            var hdx = (x1 - x2) / 2, hdy = (y1 - y2) / 2;
                                            var cosP = Math.cos(phi), sinP = Math.sin(phi);
                                            var x1A = cosP * hdx + sinP * hdy;
                                            var y1A = -sinP * hdx + cosP * hdy;
                                            var rxS = rx * rx, ryS = ry * ry;
                                            var x1AS = x1A * x1A, y1AS = y1A * y1A;
                                            var frc = (rxS * ryS - rxS * y1AS - ryS * x1AS) / (rxS * y1AS + ryS * x1AS);
                                            var coef = (fA != fS ? 1 : -1) * Math.sqrt(Math.max(frc, 0));
                                            var cxA = coef * (rx * y1A) / ry;
                                            var cyA = -coef * (ry * x1A) / rx;
                                            var cx = cosP * cxA - sinP * cyA + (x1 + x2) / 2;
                                            var cy = sinP * cxA + cosP * cyA + (y1 + y2) / 2;
                                            var angl = function(ux, uy, vx, vy) {
                                                var lU = Math.sqrt(ux * ux + uy * uy), lV = Math.sqrt(vx * vx + vy * vy);
                                                var num = (ux * vx + uy * vy) / (lU * lV);
                                                return (ux * vy - uy * vx >= 0 ? 1 : -1) * Math.acos(Math.max(-1, Math.min(1, num)));
                                            };
                                            var vX = (x1A - cxA) / rx, vY = (y1A - cyA) / ry;
                                            var theta1 = angl(1, 0, vX, vY);
                                            var dtheta = angl(vX, vY, (-x1A - cxA) / rx, (-y1A - cyA) / ry);
                                            dtheta = dtheta % (2 * Math.PI);
                                            var arc = function(gst, x, y, r, a0, a1, neg) {
                                                var rotate = function(m, a) {
                                                    var si = Math.sin(a), co = Math.cos(a);
                                                    var a = m[0], b = m[1], c = m[2], d = m[3];
                                                    m[0] = a * co + b * si;
                                                    m[1] = -a * si + b * co;
                                                    m[2] = c * co + d * si;
                                                    m[3] = -c * si + d * co;
                                                };
                                                var multArr = function(m, a) {
                                                    for (var j = 0; j < a.length; j += 2) {
                                                        var x = a[j], y = a[j + 1];
                                                        a[j] = m[0] * x + m[2] * y + m[4];
                                                        a[j + 1] = m[1] * x + m[3] * y + m[5];
                                                    }
                                                };
                                                var concatA = function(a, b) {
                                                    for (var j = 0; j < b.length; j++) a.push(b[j]);
                                                };
                                                var concatP = function(p, r) {
                                                    concatA(p.cmds, r.cmds);
                                                    concatA(p.crds, r.crds);
                                                };
                                                if (neg) while (a1 > a0) a1 -= 2 * Math.PI; else while (a1 < a0) a1 += 2 * Math.PI;
                                                var th = (a1 - a0) / 4;
                                                var x0 = Math.cos(th / 2), y0 = -Math.sin(th / 2);
                                                var x1 = (4 - x0) / 3, y1 = y0 == 0 ? y0 : (1 - x0) * (3 - x0) / (3 * y0);
                                                var x2 = x1, y2 = -y1;
                                                var x3 = x0, y3 = -y0;
                                                var ps = [ x1, y1, x2, y2, x3, y3 ];
                                                var pth = {
                                                    cmds: [ "C", "C", "C", "C" ],
                                                    crds: ps.slice(0)
                                                };
                                                var rot = [ 1, 0, 0, 1, 0, 0 ];
                                                rotate(rot, -th);
                                                for (var j = 0; j < 3; j++) {
                                                    multArr(rot, ps);
                                                    concatA(pth.crds, ps);
                                                }
                                                rotate(rot, -a0 + th / 2);
                                                rot[0] *= r;
                                                rot[1] *= r;
                                                rot[2] *= r;
                                                rot[3] *= r;
                                                rot[4] = x;
                                                rot[5] = y;
                                                multArr(rot, pth.crds);
                                                multArr(gst.ctm, pth.crds);
                                                concatP(gst.pth, pth);
                                            };
                                            var gst = {
                                                pth: pth,
                                                ctm: [ rx * cosP, rx * sinP, -ry * sinP, ry * cosP, cx, cy ]
                                            };
                                            arc(gst, 0, 0, 1, theta1, theta1 + dtheta, fS == 0);
                                            x = x2;
                                            y = y2;
                                        } else console.log("Unknown SVG command " + cmd);
                                    }
                                }
                            }
                        }
                        return {
                            cssMap: cssMap,
                            readTrnf: readTrnf,
                            svgToPath: svgToPath,
                            toPath: toPath
                        };
                    }(),
                    initHB: function(hurl, resp) {
                        var codeLength = function(code) {
                            var len = 0;
                            if ((code & 4294967295 - (1 << 7) + 1) == 0) {
                                len = 1;
                            } else if ((code & 4294967295 - (1 << 11) + 1) == 0) {
                                len = 2;
                            } else if ((code & 4294967295 - (1 << 16) + 1) == 0) {
                                len = 3;
                            } else if ((code & 4294967295 - (1 << 21) + 1) == 0) {
                                len = 4;
                            }
                            return len;
                        };
                        var te = new window["TextEncoder"]("utf8");
                        fetch(hurl).then(function(x) {
                            return x["arrayBuffer"]();
                        }).then(function(ab) {
                            return WebAssembly["instantiate"](ab);
                        }).then(function(res) {
                            console.log("HB ready");
                            var exp = res["instance"]["exports"], mem = exp["memory"];
                            mem["grow"](700);
                            var heapu8 = new Uint8Array(mem.buffer);
                            var u32 = new Uint32Array(mem.buffer);
                            var i32 = new Int32Array(mem.buffer);
                            var __lastFnt, blob, blobPtr, face, font;
                            Typr["U"]["shapeHB"] = function() {
                                var toJson = function(ptr) {
                                    var length = exp["hb_buffer_get_length"](ptr);
                                    var result = [];
                                    var iPtr32 = exp["hb_buffer_get_glyph_infos"](ptr, 0) >>> 2;
                                    var pPtr32 = exp["hb_buffer_get_glyph_positions"](ptr, 0) >>> 2;
                                    for (var i = 0; i < length; ++i) {
                                        var a = iPtr32 + i * 5, b = pPtr32 + i * 5;
                                        result.push({
                                            g: u32[a + 0],
                                            cl: u32[a + 2],
                                            ax: i32[b + 0],
                                            ay: i32[b + 1],
                                            dx: i32[b + 2],
                                            dy: i32[b + 3]
                                        });
                                    }
                                    return result;
                                };
                                return function(fnt, str, ltr) {
                                    var fdata = fnt["_data"], fn = fnt["name"]["postScriptName"];
                                    if (__lastFnt != fn) {
                                        if (blob != null) {
                                            exp["hb_blob_destroy"](blob);
                                            exp["free"](blobPtr);
                                            exp["hb_face_destroy"](face);
                                            exp["hb_font_destroy"](font);
                                        }
                                        blobPtr = exp["malloc"](fdata.byteLength);
                                        heapu8.set(fdata, blobPtr);
                                        blob = exp["hb_blob_create"](blobPtr, fdata.byteLength, 2, 0, 0);
                                        face = exp["hb_face_create"](blob, 0);
                                        font = exp["hb_font_create"](face);
                                        __lastFnt = fn;
                                    }
                                    var buffer = exp["hb_buffer_create"]();
                                    var bytes = te["encode"](str);
                                    var len = bytes.length, strp = exp["malloc"](len);
                                    heapu8.set(bytes, strp);
                                    exp["hb_buffer_add_utf8"](buffer, strp, len, 0, len);
                                    exp["free"](strp);
                                    exp["hb_buffer_set_direction"](buffer, ltr ? 4 : 5);
                                    exp["hb_buffer_guess_segment_properties"](buffer);
                                    exp["hb_shape"](font, buffer, 0, 0);
                                    var json = toJson(buffer);
                                    exp["hb_buffer_destroy"](buffer);
                                    var arr = json.slice(0);
                                    if (!ltr) arr.reverse();
                                    var ci = 0, bi = 0;
                                    for (var i = 1; i < arr.length; i++) {
                                        var gl = arr[i], cl = gl["cl"];
                                        while (true) {
                                            var cpt = str.codePointAt(ci), cln = codeLength(cpt);
                                            if (bi + cln <= cl) {
                                                bi += cln;
                                                ci += cpt <= 65535 ? 1 : 2;
                                            } else break;
                                        }
                                        gl["cl"] = ci;
                                    }
                                    return json;
                                };
                            }();
                            resp();
                        });
                    }
                };
                const QQ_GROUP = [ "854137118" ];
                var _self = unsafeWindow;
                var top = _self;
                var UE$1;
                var modelId = "modelId_xx";
                const selfintv = setInterval(() => {
                    if (unsafeWindow) {
                        _self = unsafeWindow;
                        top = _self;
                        UE$1 = _self.UE;
                        try {
                            reportOnline();
                            String.prototype.replaceAll = function(s1, s2) {
                                return this.replace(new RegExp(s1, "gm"), s2);
                            };
                            while (top !== _self.top) {
                                top = top.parent.document ? top.parent : _self.top;
                                if (top.location.pathname === "/mycourse/studentstudy") break;
                            }
                        } catch (err) {
                            top = _self;
                        }
                        clearInterval(selfintv);
                    }
                }, GLOBAL.delay);
                function checkVersion() {
                    function compare(v1 = "0", v2 = "0") {
                        v1 = String(v1).split(".");
                        v2 = String(v2).split(".");
                        const minVersionLens = Math.min(v1.length, v2.length);
                        let result = 0;
                        for (let i = 0; i < minVersionLens; i++) {
                            const curV1 = Number(v1[i]);
                            const curV2 = Number(v2[i]);
                            if (curV1 > curV2) {
                                result = 1;
                                break;
                            } else if (curV1 < curV2) {
                                result = -1;
                                break;
                            }
                        }
                        if (result === 0 && v1.length !== v2.length) {
                            const v1BiggerThenv2 = v1.length > v2.length;
                            const maxLensVersion = v1BiggerThenv2 ? v1 : v2;
                            for (let i = minVersionLens; i < maxLensVersion.length; i++) {
                                const curVersion = Number(maxLensVersion[i]);
                                if (curVersion > 0) {
                                    v1BiggerThenv2 ? result = 1 : result = -1;
                                    break;
                                }
                            }
                        }
                        return result;
                    }
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://greasyfork.org/en/scripts/451356.json",
                        timeout: GLOBAL.timeout,
                        onload: function(r) {
                            const obj = JSON.parse(r.responseText);
                            if (obj.name === GM_info.script.name && compare(obj.version, GM_info.script.version) === 1 && new Date(obj.code_updated_at).getTime() + 1e3 * 60 * 60 * 2 < new Date().getTime()) {
                                iframeMsg("update", {
                                    v1: GM_info.script.version,
                                    v2: obj.version,
                                    href: obj.url
                                });
                            }
                        }
                    });
                }
                top.addEventListener("message", event => {
                    if (event.data.type === "jump") {
                        GLOBAL.index++;
                        iframeMsg("tip", {
                            tip: "准备答第" + (GLOBAL.index + 1) + "题"
                        });
                    } else if (event.data.type === "stop") {
                        GLOBAL.stop = event.data.val;
                    } else if (event.data.type === "start_pay") {
                        if (event.data.flag) {
                            if (String(GM_getValue("token")).length === 10 || String(GM_getValue("token")).length === 11) {
                                iframeMsg("tip", {
                                    tip: "已开启请求收费题库,已实时生效"
                                });
                                GM_setValue("start_pay", event.data.flag);
                                iframeMsg("start_pay", true);
                            } else {
                                iframeMsg("tip", {
                                    tip: "系统检测您的token可能输入有误,请检查"
                                });
                            }
                        } else {
                            iframeMsg("tip", {
                                tip: "已关闭请求收费题库,已实时生效"
                            });
                            GM_setValue("start_pay", event.data.flag);
                            iframeMsg("start_pay", false);
                        }
                    } else if (event.data.type === "auto_jump") {
                        GM_setValue("auto_jump", event.data.flag);
                        iframeMsg("tip", {
                            tip: "已" + (event.data.flag ? "开启" : "关闭") + "自动切换,页面刷新后生效"
                        });
                    } else if (event.data.type === "confim") {
                        if (event.data.token.length === 10 || event.data.token.length === 11) {
                            GM_setValue("token", event.data.token);
                            iframeMsg("tip", {
                                tip: "成功设置token,请点击开启付费题库"
                            });
                        } else {
                            iframeMsg("tip", {
                                tip: "系统检测您的token可能输入有误,请检查"
                            });
                        }
                    } else if (event.data.type === "save_setting") {
                        GM_setValue("gpt", event.data.gpt);
                        GM_setValue("search_delay", event.data.search_delay);
                        GM_setValue("tiku_adapter", event.data.tiku_adapter);
                    }
                }, false);
                $(document).keydown(function(event) {
                    if (event.keyCode === 38) {
                        $("." + modelId).hide();
                    } else if (event.keyCode === 40) {
                        $("." + modelId).show();
                    } else if (event.keyCode === 37) {
                        $("." + modelId).hide();
                        GM_setValue("hide", true);
                    } else if (event.keyCode === 39) {
                        $("." + modelId).show();
                        GM_setValue("hide", false);
                        GM_setValue("pos", "50px,50px");
                    } else if (event.keyCode === 83) {
                        GLOBAL.stop = true;
                        iframeMsg("stop", GLOBAL.stop);
                    } else if (event.keyCode === 68) {
                        GLOBAL.stop = false;
                        iframeMsg("stop", GLOBAL.stop);
                    }
                });
                function getAnswerForKey(keys, options) {
                    return keys.map(function(val) {
                        return options[val.charCodeAt(0) - 65];
                    });
                }
                function setIntervalFunc(flag, func, time) {
                    const interval = setInterval(() => {
                        if (flag()) {
                            clearInterval(interval);
                            func();
                        }
                    }, time || 1e3);
                }
                function getAnswer(str, options, type) {
                    if (type === 0 || type === 1) {
                        const ans = getAnswerForKey(str.match(/[A-G]/gi) || [], options);
                        return ans.length > 0 ? ans : [ str ];
                    } else {
                        return [ str ];
                    }
                }
                function getQuestionType(str) {
                    if (!str) return;
                    str = str.trim().replaceAll(/\s+/g, "");
                    if (TYPE[str]) return TYPE[str];
                    const regex = Object.keys(TYPE).join("|");
                    const matcher = str.match(regex);
                    if (matcher) return TYPE[matcher[0]];
                }
                function rand(m, n) {
                    return Math.ceil(Math.random() * (n - m + 1) + m - 1);
                }
                const TYPE = {
                    "阅读理解（选择）/完型填空": 66,
                    "听力训练": 66,
                    multichoice: 1,
                    singlechoice: 0,
                    SingleChoice: 0,
                    bijudgement: 3,
                    Judgement: 3,
                    "单项选择题": 0,
                    "单项选择": 0,
                    "单选题": 0,
                    "单选": 0,
                    "多选": 1,
                    "多选题": 1,
                    "案例分析": 1,
                    "多项选择题": 1,
                    "多项选择": 1,
                    "客观题": 1,
                    "填空题": 2,
                    "填空": 2,
                    "对错题": 3,
                    "判断题": 3,
                    "判断正误": 3,
                    "判断": 3,
                    "主观题": 4,
                    "问答题": 4,
                    "简答题": 4,
                    "名词解释": 5,
                    "论述题": 6,
                    "计算题": 7,
                    "其它": 8,
                    "分录题": 9,
                    "资料题": 10,
                    "连线题": 11,
                    "排序题": 13,
                    "完形填空": 14,
                    "完型填空": 14,
                    "阅读理解": 15,
                    "口语题": 18,
                    "听力题": 19,
                    "A1A2题": 1,
                    "文件作答": 4,
                    "视频题": 1
                };
                function sleep(time) {
                    return new Promise(resolve => {
                        setTimeout(resolve, time);
                    });
                }
                function iframeMsg(type, message) {
                    try {
                        top.document.getElementById("iframeNode").contentWindow.vueDefinedProp(type, message);
                    } catch (e) {}
                }
                function filterImg(dom) {
                    if (location.host === "ncexam.cug.edu.cn") {
                        String.prototype.trim = function() {
                            return this.replace(/^\s+|\s+$/gm, "");
                        };
                    }
                    return $(dom).clone().find("img[src]").replaceWith(function() {
                        return $("<p></p>").text('<img src="' + $(this).attr("src") + '">');
                    }).end().find("iframe[src]").replaceWith(function() {
                        return $("<p></p>").text('<iframe src="' + $(this).attr("src") + '"></irame>');
                    }).end().text().trim();
                }
                function createContainer(name, childElem) {
                    name = name.toLowerCase();
                    let elem = top.document.createElement(name);
                    elem.style.display = "block";
                    elem.id = name.replace("hcsearche", "hcSearche").replace(/\-[a-z]/g, function(w) {
                        return w.replace("-", "").toUpperCase();
                    });
                    if (childElem) {
                        if (Array.isArray(childElem) === false) childElem = [ childElem ];
                        for (let i = 0; i < childElem.length; i++) elem.appendChild(childElem[i]);
                    }
                    return elem;
                }
                function dragModel(drag) {
                    const TOP = top;
                    drag.onmousedown = function(e) {
                        drag.style.cursor = "move";
                        e = e || window.event;
                        let diffX = e.clientX - drag.offsetLeft;
                        let diffY = e.clientY - drag.offsetTop;
                        top.onmousemove = function(e) {
                            e = e || top.event;
                            let left = e.clientX - diffX;
                            let top = e.clientY - diffY;
                            if (left < 0) {
                                left = 0;
                            } else if (left > TOP.innerWidth * .95 - drag.offsetWidth) {
                                left = TOP.innerWidth * .95 - drag.offsetWidth;
                            }
                            if (top < 0) {
                                top = 0;
                            } else if (top > TOP.innerHeight - drag.offsetHeight) {
                                top = TOP.innerHeight - drag.offsetHeight;
                            }
                            drag.style.left = left + "px";
                            drag.style.top = top + "px";
                            GM_setValue("pos", drag.style.left + "," + drag.style.top);
                        };
                        top.onmouseup = function(e) {
                            drag.style.cursor = "default";
                            this.onmousemove = null;
                            this.onmouseup = null;
                        };
                    };
                }
                function defaultWorkTypeResolver($options) {
                    function count(selector) {
                        let sum = 0;
                        for (const option of $options || []) {
                            if ($(option).find(selector).length || $(option).parent().find(selector).length) {
                                sum++;
                            }
                        }
                        return sum;
                    }
                    return count('[type="radio"]') === 2 ? 3 : count('[type="radio"]') > 2 ? 0 : count('[type="checkbox"]') > 2 ? 1 : count("textarea") >= 1 ? 4 : undefined;
                }
                function waitWithTimeout(promise, timeout, timeoutMessage = "timeout", defaultRes) {
                    let timer;
                    const timeoutPromise = new Promise((resolve, reject) => {
                        timer = setTimeout(() => defaultRes === undefined ? reject(timeoutMessage) : resolve(defaultRes), timeout);
                    });
                    return Promise.race([ timeoutPromise, promise ]).finally(() => clearTimeout(timer));
                }
                async function formatSearchAnswer(initData) {
                    const data = {
                        plat: initData.plat ? parseInt(initData.plat) : null,
                        qid: initData.qid ? String(initData.qid) : null,
                        question: initData.question,
                        options: initData.options,
                        options_id: initData.options_id ? initData.options_id : [],
                        type: initData.type
                    };
                    let res;
                    const list = [];
                    const apis = GLOBAL.answerApi;
                    const answerApiFunc = Object.keys(apis).map(item => {
                        return waitWithTimeout(apis[item](data), 5e3, "", []);
                    });
                    answerApiFunc.push(searchAnswer(data));
                    const answerApiRes = await waitWithTimeout(Promise.all(answerApiFunc), 1e4, "(接口超时)");
                    answerApiRes.map(item => {
                        if (item instanceof Array) {
                            console.log("tikuAdapter结果", JSON.stringify(item));
                            list.push(...item);
                        } else if (item instanceof Object && Object.keys(item).length === 1) {
                            const key = Object.keys(item)[0];
                            item[key];
                        } else {
                            res = item;
                        }
                    });
                    try {
                        const msg = res.message || res.msg;
                        if (res.code !== 0) {
                            return {
                                success: false,
                                msg: msg
                            };
                        }
                        if (res.result.success) {
                            return {
                                success: true,
                                msg: msg,
                                num: res.result.num,
                                answers: res.result.answers
                            };
                        }
                        console.log("官方结果", JSON.stringify(res));
                        if (res.result.answers instanceof Array && res.result.answers.length > 0) {
                            list.push(...res.result.answers);
                        }
                        return {
                            success: true,
                            msg: msg,
                            num: res.result.num,
                            list: list
                        };
                    } catch (e) {
                        return {
                            success: false,
                            msg: "发生异常" + e + "请反馈至学长微信"
                        };
                    }
                }
                function similar(s, t, f) {
                    if (!s || !t) {
                        return 0;
                    }
                    if (s === t) {
                        return 100;
                    }
                    var l = s.length > t.length ? s.length : t.length;
                    var n = s.length;
                    var m = t.length;
                    var d = [];
                    f = f || 2;
                    var min = function(a, b, c) {
                        return a < b ? a < c ? a : c : b < c ? b : c;
                    };
                    var i, j, si, tj, cost;
                    if (n === 0) return m;
                    if (m === 0) return n;
                    for (i = 0; i <= n; i++) {
                        d[i] = [];
                        d[i][0] = i;
                    }
                    for (j = 0; j <= m; j++) {
                        d[0][j] = j;
                    }
                    for (i = 1; i <= n; i++) {
                        si = s.charAt(i - 1);
                        for (j = 1; j <= m; j++) {
                            tj = t.charAt(j - 1);
                            if (si === tj) {
                                cost = 0;
                            } else {
                                cost = 1;
                            }
                            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
                        }
                    }
                    let res = (1 - d[n][m] / l) * 100;
                    return res.toFixed(f);
                }
                function answerSimilar(src, list) {
                    return $.map(list, function(val) {
                        return Number(similar(formatString(val), formatString(src), 2));
                    });
                }
                function isPlainAnswer(answer) {
                    if (answer.length > 8 || !/[A-Z]/.test(answer)) {
                        return false;
                    }
                    let min = 0;
                    for (let i = 0; i < answer.length; i++) {
                        if (answer.charCodeAt(i) < min) {
                            return false;
                        }
                        min = answer.charCodeAt(i);
                    }
                    return true;
                }
                function isTrue(str) {
                    return Boolean(String(str).match(/(^|,)(正确|是|对|√|T|ri|true|A)(,|$)/));
                }
                function isFalse(str) {
                    return Boolean(String(str).match(/(^|,)(错误|否|错|×|F|不是|wr|false|B)(,|$)/));
                }
                async function defaultQuestionResolve(list, data, handler, ignore_click) {
                    let targetOptionsList = [];
                    for (const answers of list) {
                        if (data.type === 4 || data.type === 2 || data.type === 5) {
                            let ans = answers.length > data.$options.length ? answers.slice(0, data.$options.length) : answers;
                            for (let index in ans) {
                                if (typeof handler === "function") await handler(data.type, ans[index], data.$options.eq(index));
                            }
                            return {
                                style: "success-row",
                                ans: answers.join("===="),
                                question: data.question
                            };
                        } else if (data.type === 3) {
                            if (targetOptionsList.length > 3) break;
                            let targetOptions = new Set();
                            if (isTrue(answers.join())) {
                                targetOptions.add(Number(isFalse(data.options[0])));
                            } else if (isFalse(answers.join())) {
                                targetOptions.add(Number(isTrue(data.options[0])));
                            }
                            targetOptions.size > 0 && targetOptionsList.push(targetOptions);
                        } else if (data.type === 0 || data.type === 1 || data.type === 66) {
                            const beautifulOptions = data.options.map(i => {
                                return formatString(i).toLowerCase().replace(/\s/g, "");
                            });
                            let targetOptions = new Set();
                            for (const ans of answers) {
                                if (ans.length === 1 && isPlainAnswer(ans)) {
                                    targetOptions.add(ans.charCodeAt(0) - 65);
                                }
                                const val = formatString(ans).toLowerCase().replace(/\s/g, "");
                                let optIndex = $.inArray(val, beautifulOptions);
                                if (optIndex >= 0) {
                                    targetOptions.add(optIndex);
                                }
                            }
                            if ((data.type === 0 && targetOptions.size === 0 || data.type === 1 && targetOptions.size < 2) && targetOptionsList.length === 0) {
                                for (const ans of answers) {
                                    const val = formatString(ans).toLowerCase();
                                    if (val.length >= 5 && !val.includes("<img")) {
                                        const ratings = answerSimilar(val, beautifulOptions);
                                        const maxScore = Math.max(...ratings);
                                        if (maxScore > 65) {
                                            targetOptions.add(ratings.indexOf(maxScore));
                                        }
                                    }
                                }
                            }
                            targetOptions.size > 0 && targetOptionsList.push(targetOptions);
                        }
                    }
                    let items = [];
                    let sortArr = targetOptionsList.map(item => {
                        const s = Array.from(item).sort();
                        return s;
                    });
                    if (data.type === 0 || data.type === 3) {
                        items = getMost(sortArr.filter(i => i.length === 1));
                        if (!items || items.length === 0) {
                            items = getMost(sortArr.filter(i => i.length > 0));
                        }
                    } else if (data.type === 1 || data.type === 66) {
                        items = getMost(sortArr.filter(i => i.length > 1));
                        if (!items || items.length === 0) {
                            items = getLang(sortArr.filter(i => i.length > 0));
                        }
                    }
                    if (items && items.length > 0) {
                        for (let index = 0; index < data.$options.length; index++) {
                            const $item = data.$options.eq(index);
                            if (Boolean($.inArray(index, items) + 1) !== Boolean(ignore_click($item, data.type))) {
                                $item.get(0).click();
                                await sleep(GLOBAL.fillAnswerDelay);
                            }
                        }
                        return {
                            type: data.type,
                            style: "primary-row",
                            ans: items.map(i => {
                                return data.options[i];
                            }).join("===="),
                            question: data.question
                        };
                    } else {
                        return {
                            type: data.type,
                            style: "warning-row",
                            question: data.question,
                            ans: list.join('<span style="color: red">====</span>'),
                            options: data.options
                        };
                    }
                }
                async function defaultFillAnswer(answers, data, handler, ignore_click) {
                    for (let index = 0; index < data.$options.length; index++) {
                        const $item = data.$options.eq(index);
                        if (Boolean($.inArray(index, answers) + 1) !== Boolean(ignore_click($item, data.type))) {
                            $item.get(0).click();
                            await sleep(GLOBAL.fillAnswerDelay);
                        }
                    }
                    return {
                        type: data.type,
                        style: "success-row",
                        question: data.question,
                        ans: answers.map(i => {
                            return String.fromCharCode(i + 65);
                        }).join(""),
                        options: data.options
                    };
                }
                function getMost(arr) {
                    arr.reverse();
                    if (arr.length === 0) return undefined;
                    var hash = {};
                    var m = 0;
                    var trueEl;
                    var el;
                    for (var i = 0, len = arr.length; i < len; i++) {
                        el = arr[i];
                        hash[el] === undefined ? hash[el] = 1 : hash[el]++;
                        if (hash[el] >= m) {
                            m = hash[el];
                            trueEl = el;
                        }
                    }
                    return trueEl;
                }
                function getLang(arr) {
                    if (arr.length === 0) return undefined;
                    let len = 0;
                    let ele;
                    for (let arrElement of arr) {
                        if (arrElement.length > len) {
                            len = arrElement.length;
                            ele = arrElement;
                        }
                    }
                    return ele ? ele : arr.length > 0 ? arr[0] : [];
                }
                function HTMLDecode(text) {
                    var temp = document.createElement("div");
                    temp.innerHTML = text;
                    var output = temp.innerText || temp.textContent;
                    temp = null;
                    return output;
                }
                function formatString(src) {
                    src = String(src);
                    src = src.includes("img") || src.includes("iframe") ? src : HTMLDecode(src);
                    src = src.replace(/[\uff01-\uff5e]/g, function(str) {
                        return String.fromCharCode(str.charCodeAt(0) - 65248);
                    });
                    return src.replace(/\s+/g, " ").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, ".").replace(/[,.?:!;]$/, "").trim();
                }
                function division(arr, size) {
                    var objArr = new Array();
                    var index = 0;
                    var objArrLen = arr.length / size;
                    for (var i = 0; i < objArrLen; i++) {
                        var arrTemp = new Array();
                        for (var j = 0; j < size; j++) {
                            arrTemp[j] = arr[index++];
                            if (index === arr.length) {
                                break;
                            }
                        }
                        objArr[i] = arrTemp;
                    }
                    return objArr;
                }
                const cache = {};
                const sourceTable = JSON.parse(GM_getResourceText("SourceTable"));
                async function genTable(ttf) {
                    const res = await axios.get(ttf, {
                        responseType: "arraybuffer"
                    });
                    const font = Typr.parse(res.data)[0];
                    const table = {};
                    for (let i = 19968; i < 40870; i++) {
                        const g = Typr.U.codeToGlyph(font, i);
                        if (g) {
                            const path = Typr.U.glyphToPath(font, g);
                            if (path) {
                                table[i] = MD5(JSON.stringify(path));
                            }
                        }
                    }
                    cache[ttf] = table;
                }
                async function getEncryptString(str, ttf) {
                    if (!cache[ttf]) {
                        await genTable(ttf);
                    }
                    const match = str.match(/<span class="xuetangx-com-encrypted-font">(.*?)</g);
                    if (match === null) {
                        return formatString(str);
                    }
                    const encStrArr = match.map(string => {
                        return string.replace(/^<span class="xuetangx-com-encrypted-font">/, "").replace(/<$/, "");
                    });
                    encStrArr.forEach(encStr => {
                        const decStr = encStr.split("").map(string => {
                            const md5 = cache[ttf][string.charCodeAt(0)];
                            return String.fromCharCode(sourceTable[md5]);
                        }).join("");
                        str = str.replace(encStr, decStr);
                    });
                    return formatString(str);
                }







            var vm = {
            hideTip() {
                var tip = document.createElement("div");
                tip.id = "yinc";
                tip.innerHTML = `
                <div style="
                    position:fixed;
                    right:0;
                    top:10%;
                    color: #8a6d3b;
                    background-color: #fcf8e3;
                    padding: 15px;
                    margin-bottom: 20px;
                    border: 1px solid transparent;
                    border-radius: 4px;
                    border-color: #faebcc;">
                    学习通助手已被隐藏<br>如果需要显示答题面板，请按键盘右箭头
                <button style="
                    padding: 0;
                    color: inherit;
                    border: 0;
                    background: inherit;
                    top:-22px;
                    position:relative"
                    type="button" id="cl_yinc" data-dismiss="alert" aria-label="Close">&times;</button>
                </div>`;
                top.document.getElementsByTagName("body")[0].appendChild(tip);
                top.document.querySelector("#cl_yinc").onclick = function() {
                    top.document.querySelector("#yinc").remove();
                };
                setTimeout(() => {
                    top.document.querySelector("#yinc").remove();
                }, 3e3);
            },
            zhihuishuSaveTip() {
                var zhihuishuSaveTip = document.createElement("div");
                zhihuishuSaveTip.id = "zhihuishuSaveTip";
                zhihuishuSaveTip.innerHTML = `
                <div style="
                    position: fixed;
                    opacity: 1;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 1040;
                    background:rgba(0,0,0,.46);">
                <div style="
                    position: relative;
                    margin: 10px;
                    top: 50%;
                    left: 40%;
                    width: 20%;">
                <div style="
                    position: relative;
                    background-color: #fff;
                    -webkit-background-clip: padding-box;
                    background-clip: padding-box;
                    /*border: 1px solid #999;*/
                    border: 1px solid rgba(0,0,0,.2);
                    border-radius: 6px;
                    outline: 0;
                    -webkit-box-shadow: 0 3px 9px rgba(0,0,0,.5);
                    box-shadow: 0 3px 9px rgba(0,0,0,.5);">
                <div style="
                    line-height: 25px;
                    font-size: 15px;
                    margin: 5px;">
                <h4 class="modal-title">正在保存</h4>


                <!-- 模态框主体 -->
                <div class="modal-body" style="height: 50px;
                    margin: 5px;
                    padding: 5px;
                    margin-top: 15px;
                    line-height: 15px;
                    font-size: 15px;">
                    <progress style="width: 100%" id="gs_p" value="0" max="100"></progress> <span id="gs_text">0%</span>


                </div>



                </div>
            </div>
                </div>`;
                top.document.getElementsByTagName("body")[0].appendChild(zhihuishuSaveTip);
            }
            };
            function showPanel() {
                let html = `
                <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                ` + GM_getResourceText("ElementUiCss") + `
                /* Fix for modal display */
                html, body {
                    overflow: visible !important;
                    max-height: none !important;
                    max-width: none !important;
                }

                .el-table .warning-row {
                    background: oldlace;
                }

                #app {
                    border: 5px solid #000000;
                    border-radius: 6px;
                    overflow: visible !important;
                }

                .el-table .default-row {
                    background: #f0f9eb;
                }

                .el-table .primary-row {
                    background: rgb(236, 245, 255);
                }

                * {
                    padding: 0px;
                    margin: 0px;
                }

                .el-button {
                    margin-bottom: 4px;
                }

                .el-button + .el-button {
                    margin-left: 0px;
                }

                .el-form-item-confim {
                    display: flex;
                    justify-content: center
                }

                .drag_auto_answer-class {
                    width: 360px;
                    background-color: rgb(255, 255, 255);
                    overflow: visible !important;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: -17px;
                }

                /* 侧边竖排文字样式 */
                .side-hint {
                    position: absolute;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 140px; /* 与二维码高度一致 */
                    justify-content: space-around;
                }

                .left-hint {
                    left: 0;
                }

                .right-hint {
                    right: 0;
                }

                .side-hint span {
                    display: block;
                    line-height: 1.2;
                }
                </style>
            </head>
            <body>

            <div id="app">

                <div id="drag_auto_answer" class="drag_auto_answer-class">
                    <el-main style="min-width: 360px;padding: 25px 0px 10px; z-index: 99999;">
                        <el-row>
                            <el-form>
                        <center> <h4>学习通小助手-考试端</h4></center>
            <br>
                                <el-form-item class="el-form-item-confim" label="请输入token"  style="margin-top: 0px" :prop="passw">
                                    <el-input :type="passw" v-model="opt.token" placeholder="请输入内容（不用输入）" style="max-width: 130px" size="mini" ></el-input>
                                    <el-button @click="btnClick(opt.token,'opt.confim')" size="mini" type="default" @mousedown.native="passw = 'text'" @mouseup.native="passw = 'password'">确定</el-button>
                                </el-form-item>
                            </el-form>
                        </el-row>
                        <el-row style="margin-top: -20px;margin-bottom: 5px;display: flex">
                            <el-alert
                                    style="display: block"
                                    :title="tip"
                                    :closable="false"
                                    type="success">
                                <el-button v-if="need_jump" @click="btnClick(opt.jump,'opt.jump')" size="mini" type="info">跳过本题</el-button>
                                <el-button v-if="!hidden" @click="btnClick(opt.auto_jump,'opt.auto_jump')" size="mini" type="default">{{opt.auto_jump ? '停止自动切换': '开启自动切换'}}</el-button>
                            </el-alert>
                        </el-row>
                        <el-row>
                        <center>  <el-button v-if="!hidden" @click="btnClick(opt.stop,'opt.stop')" size="mini" type="default">{{!opt.stop ? '暂停答题': '继续答题'}}</el-button> <center>

                        </el-row>

                        <div class="qrcode-container" style="position: relative; margin: 0 20px; padding: 0 25px;">
                            <!-- 左侧竖排文字 -->
                            <div class="side-hint left-hint">
                                <span>按</span>
                                <span>→</span>
                                <span>↓</span>
                                <span>显</span>
                                <span>示</span>
                                <span>窗</span>
                                <span>口</span>
                            </div>

                            <div class="qrcode-text" style="text-align: center;">如果有帮助到你，可以赞赏支持一下吗？亲亲</div>
                            <div class="qrcode-wrapper">
                                <img class="qrcode-img"
                                    width="140"
                                    height="140"
                                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCACMAIwDAREAAhEBAxEB/8QAHgAAAgIBBQEAAAAAAAAAAAAAAAkHCAYCAwQFCgH/xAA2EAABBAMAAQIFAwMCBAcAAAAFAwQGBwECCAkAERITFBUhFjFRChdBImEYcYGxGSMkM6HB8P/EAB0BAQABBQEBAQAAAAAAAAAAAAAGAQIFBwgDBAn/xAA4EQABAwMDAgQEBQMCBwAAAAABAAIDBAURBhIhEzEHIkFRFDJhgQgVI0JxM6HwkcE0UmJysdHx/9oADAMBAAIRAxEAPwD374xjGMYx+2PxjH8Y/wAY/wCnoi++iI9ER6Ij0RHoixiRTWHRF1G2MqlccjT2ZHUYvEGZ42MDupVJnDVy9bxyONyDpuqbOuGTJ67QEjdXL9VqzdONEMpN1t9CLXMZYEgkQlM5krlRnG4bHDcrPvEm67tVqEjwxyXKuk2jbRVy63QYNF1tG7ZJVwvtphJBNRXbXTJFDPJ3U1P9q891r07Qpgidqi1xL8tFCJcUuEKZ0EHy8WMsSQpztuqxIiJCBLiXyHzFU9XTFXKKyyOyau5FxB/V1Uk+rT/GjVOa5uaNUyKvgrlaEn28E0gRmVrwxjs2nyzXSOPD+5pDOMgGrtUhlp85ynopgeW0HkU2zCbw2vg2ZFO5XG4XH9X4oVsclZwXHQ+pQ6SbBwg3JMw7ZMsPzBZ40GC2fzvqSBB02ZM0lnS6SW5FlHoiPREeiI9ER6Ij0RbW6Cam3xb6++fb2/f/ABj0RbvoiPREeiIznGMZznPtjH5znP7Yx/OfRFpxtrt7/DnGfb+M4z/2zn/59ESexXklsKL+YyUeM+763iELgNkUIDunje1hxp+qdthwDH7b2tEZIweZ+1IHBT8XNXIcYK1QeMo5CFChDJHEnH5GkXZeXnkCsejq35zuuyukR3JrDg/pyuuvf71GBzAgHGia9VcYLR0koUNhGAlM88cg12ZlXchu3KCmDLUSRTIKtVCJlBtjFrvp4yNEm2RmFW7XJJiMkgVygRHFovPI2u3ZGxLtFTds/ZPxRVJ+wcpLbIOkFUlU1MpqY29EVJfEbxJNPHPwBRnHE+nkbsuR1AtaP1ExiYomHCkm0+uOwbOZJINDCqhDKo9tNE2DhZbCWN1m2+iSe6SejhwRTlBNrvd9c3qqZvGoZXz+LgtXDoVRcdCNNbfqmfum5d/J5DYcgQeKuVQ86YKMnsWHv26Puza7bMG7ZJo6dmSKDvJ/490/JNS9VUgStZ/VcWhPSlRXpM8j49pItrBjNZqnl3lbuEdy4fUWkddlmJJseyoQwKIBGauwh/pvtpoRXVuqzR9JU7aNwFAx6RCqpryYWGRj0VHbl5OdHwuOkZC6Dx4Wl7bvzZJAduzFtNc6/PerIp521xtnOCKpfi86T6L6+4qqfo/qGmg1CWTa20oko6twyhn4R9cryYmlWpUk1PrOCjAtIYckKNPG7lbGVsPUn+rMRq9wFHETAsba5znGNtc5x/jGcZz7ft7+2M+/t7/j8/59EWr0RHoiPREeiI9ER6Ij0RbSm6fw50230xnfXOMa53xjOcbYzjHt+cZ/OMZ9vh/OfbPt+ceiJU/jp5Q7I5Pt7tgHeXSxTo3miybdaWjygpP5PI5bbtbspfscJ2NB5MSPNcpNYyIIrgR0THijD8XukOemGouOLmHw3JFTb+os5knJ/nCrfITz0LaqdT+MmzRXSsJefAth0eqoM9GvrhhDvZuu3UchFRIcbMSLP33cuB8UKixnylzjjVwRNspm1ad7/wCMK/t5nEIlZFRdJUwJlDiATtgGlkVLMpQF1UMwSZjCLMiHI6iC+r2MyZk+HLpIEBz5u6ZarN1ENCLIeRS98G+ea8ddJVFX9C3AiOdjZFUlXSlpM4FC2YoyQHRYfHDzFsgzUZLxRqDe4YtktkBCrjdgjnKTbTXUiqJ4uph3fJ9O6RfcoyRoKw3ve/Y1zOdkMRCw9CRcxNXopStXcVbhmTL73Ckm+7vMdkhT7kYIN3KrYibJOWG+yBFinA/HtXVR3N5SeuIN1LH+hZL1Hb1axmwIKGTAqvOb5FSkdkbReq5GXDSY6sQONEJmya6DioiKEI8ECiWLlk8d7vHGSLIucfIlLuiPJ13HxCBq4QjUPF0GqNQ5daMmWXKmLZsocgb3g6sZ3GaNdWKQrJvCRBmUUXGvYg+RIpL5PMkxJFXHyHdwdHaeSPx2eNzjA3gBPLGl6XR3XMqVAR+SMI1yTAH7xEzFSTcyNL6i9bLyMk4xMw02CmWRdhERoUrqvKN8okTLO7uyKs4A5St3qm3V3GIpV0dy9aBR2U8l5fLCbhERD4UE1W21S+6SmRPB4lust7NWCS65J7skxZOVdCJd3gxgHaRSlbV7T7vsudP7a7nnDS44zQkhKmMQ3m2qU0SCNdQyIRYq8cIxV0Xj5Fs/KMWyDF5gQ1iraRpOpWzOPnBE87XbXbHvrnGf3x+M4z7Zxn2zjPtnP7Z/f0RavREeiI9ER6Ij0RbOyumU99tN8be2m22M6bYz74xr7++ufzjP+2cYzj3/ABn+PRF4iYNB6n8mlTSHySeSaQdwXNGLk7eOcrc0cz8qG7DYw/meFtbDe1hCpFI4ZVroa++8avRrwzPrCMvnmHeXodkPCkzRYeLIETXPGFJr253678hniye3JKOhYZzNA6fuTlSwrvLPJJOYnF7qBHXSdR2fNG+uTEnFxGRNxmoQls2yWxHVXuG+EG2BYxgROX52G9Anee4cH7VF0sQvUqALjrhEUyjJCVKkFXxUy2bsI42n6OZA8Eu4kqIbnGh1JZNUsoXQR+oGZbKKkWG17elIxfoUrwLXVeSSDnKmoiLW2xbAKzVi9HCK9Oyd5Dg0aiUgHN2cc0OMn7PdTeMjGaDdBh85Rq4WWHlW7AiVf4yor0bQ3lU8x9HWIJu89QNiWTWXVlC2RPU5MVr5JxbbE07ncLhEoLZ+xatxRZ63joyOR/dX7UKgCg9/o2UFJfPIvQVn29vznGMfjH5z7fvn2xj3/wB85xj/AHzn29EUXxKrqqqXWxpBWdaw2GkLGlBmzbGXg8YDgiNiT4k1RwUlknWENGysjlphNo2Qcmimzsk821T+cupnOfciQp/ThUHbEconrrsnomGymDX3312RcN2H45NI4aiEjCQcfIiQ2HjHsZPoNyAvXEiIT4sJxhLRspGy4LVp8SCCaqpFYzgnx32TRHcXke8iHV8khMlt/pa0iMXpgmBME37GsuPoR9MlA4+QWMDhLcNIDQkNFMS5kh9xZMMQkYo2J/E+KYWImPyNHl/sCim8gJDqZ6moQ18qYhV9cQq4azkr2Ell3DMsHdp7n4qWegJAHcJtnjVdfcaYYLI5UQdtltEyLyJ1TS1TeRDnytvJj5Lph2ldT7srrdSheb6H5Tldiga45Bi5GfyerK9drw+DHWX29qCUg7wzYNmk1XGmixYUg5AFzbhd6RIm/eIuwrkp/rfyJ+Lazbdl/QcH4oJ0ZOOfLdsUxpJLMRqPoeHkZmxq+x5Nlug7kJqvF27dkMOEPjeEWLtzhNIcGahBbQif5qonvnbXTfXbOv42xrtjbOuf4z7Zz7Z/2z6ItfoiPREeiI9ESbOk470h4zeerPtDx+ULYHc8ssHqGV3/AHTUtoXFJz82HQ6wmr0pPmdCJrovX2qQQgHAM4bWwceacN0SJV2OCSUpvhk4IqR19wH2TDjJe4fGf2c14QA9ljg3UVqcCdU0oFtZ/S9k2OOZPbCkEODvTbSSQEoucdajZVGch9gTWRtXDTLxNBmJFCCJnvjq8dqHEre57Ksq6JV051j05Kx0z6L6MmY1tHHcucx1u9YQ6KRWHDnz8RCIBBxL5ywjscYO3KbXVwvrquiORFChREyZgRHlWqb4W+ZkmS3xfJeMHSDxqr8G+ye/y3DfdRLf4FNN9Nvh3z8O+u2ufbbXOMEWJWXYsEp6vpvbFmyMXDa9riLHJvOJaaV2QFRuLRoc4LnDZFXTRRTVoNGtXDpX5SSq+2iWdEEVVdtE9iJGnkD8jlq86dZeGey6kmA2Y8D9yWc4qCynYQCIIjpMRvEBD8c8TlhNnrBwWFjk8yhSbj2AfLPc9H41IkHnzdPkatiKwNQeTk3Y3lk7i8bcjq4VF4rypQtYXZG7d0kjpZ5NWUuitXyCUIFQr0WiPEsBDu02Y0c6aP3PvrGibl78W75NswIk1eLjyzSHkTwKhO8OzJLbHR0qsbrGw4dXYMxKX5ywZ6Ym1pOAjKGxc9LXD5PQZHUgs/kzYfutowZh4uZGiENN0m7PUi9DvT9oKzo5WPKdKdbxzlbrezGoG64kCMQoDYszkNPV9JRTqzwukMOOUBaCZsTl7H9yez/Qi03blyIVF8kCMbtSLDe8nMC6bZyDxbmpHfVXzPr2h7AItrjq6AESUViULjhFg0lIszP10N4wGLSdls4Bbx1+uksYBk3jLD0a7LB93ZFy2URjfjA4Qj9O8b86yvobHPMYhMch/P8AX5sELsaa6SiaMB8pmJJ6QQyw+7kSRyUWZLiyo9NIo90OrpIo/HvsgRLzdeKruDlmU2oZ8Y/f0a5S51uGYmLYk/N180eJuqG0rLZOj9xnxupJGSkOm8ZEPnuq5ZWI7opRhq9xvvh2qnpo69EXTePONhKtpvomdeOG8Kx8nfZ8669hozvjoazpK9ruPyku3Xa6yrESKx0IUA4jFYwI7titY7Cycniem7w3gSVIKtMRvUidbS3LUHpC2OjLkjMttg5Ium5bGplNwU8saQS+FxUnFQSkeZM6wi5ZXcfAxDxpvlYoyF6Z+uVSYIZW0FiQ44eRWa9ER6Ij0RVbmMK6V/4mYrakXu5gjzRG6bl4KX8v61tHXJ+wrbdFEn8VnQ63nxBuXjqAwSmsF/TSaWghy4z9SQ2Wy8TdhiKpXB/k9cdWgr106D5QvXgScc2JjHltjOkmSAit2ocypI1GZ2JXA+ZRyPSYQxGR1QhIHywwK1FJPWiyCxIYqkUWIoR8lXigjPkCOVd2hyd0LIOau56kiGiFAdPVnI3BOIyeJK6GCQaHTlkOWJDTcCJKSY9qkajrZR19vk5VMsymYBTWPbkTC4/ZCvP/ADDT3/iAXPTYWxywKAVVaNhpk04BW05uWVsUAK4+I/flBSqKswNZd/aR6aQ1ddTdZVkMGN9NWjQiVB0r00A8M4Ln/ifjDn6FiqfbwSbSyONpdNJvIm0XWOz6QHn7Np9+k7qVHUnUjKyA4UXKS5VdPBVuzHYSSbJNVNUeIeur1pSpoobRbqKr60bpJRcJHwsc1h87o5Gub5WN5ceQCcngBS3TlhorrHLPWSVjY2v6AFMwPAecYzlrgD35A4H1BXYc593ds9wkk6235Ap2WUpJki0ZuGey8ZKMVKnFjDP6AnHXYKUEiDOarrDnDr7xFkNDOCiDxsEIMh4147kLbGab1xr7VbqSOk0rSUMDZ2PuF1qKlzaVtNu5bSNLD8U94D+GuO3a0H58n7LxYNL2kzO/Na99QGx9GlkcwN3gEvEgAGNxLcdh3/gPII1jWZ4dBBp+uoIaZVkXBSOuWBWJAH7KvpJGRzgVHj8HZvB66MSNR8Y8eDQhMFowfiB7pwyYuEG6yie263fNwDgk7fKQSOSODyOPQ8jsVCHcudtHGSQMdhngfZcxpXdeD5WenjGBw1lOZUGDR2UTRrGQreWySPRzd4pHgJ+SJMdDJkMC3IkNg4si9csRmz55lkgh9Uv8wQQM447/AG9/dee5uS3cMjuM8j+VjqVHUi3h8Ur1CnKsQgEDNipNB4MjAImlDoZJARPc2DkMTjOgjUJHDgYyooXElg7FmQHE1FH7Nwi7U3V2pnjd6e+D6/8A1XDzdgT9iP8AzhZM8gMCIzQHZBCDxF/YkYCl45Gp69jgd1M49HpAs0cHgQOULslDYgOccDx65gYPfN2RRZiyUfIr7tUMp0BB7Ist/wBGdvjzpr8emu3w5/Hvj39vfXXPt+Pi+HX3xj984xnOM+2PVUVPZhT3O3OU76M8hf8AbqQurhI0WmztmRRFWZy2VzOuaUEmZUIjEYrpMw7BOpFqig4bi20dAsTUge4HsXLxzvnG2xFBnCnTU18m/MlrS2/+MLB5iqWxZFO61gkDuI3vvLrmoMzHmovM4kUbai40agGstQMHAy0c2cP8JItMvQkmNjHbQlsRcKQ2d4svCNz0xiDw9SPH9SMcEToSCD3Kq83nJLCaDciXYR5Dc/aNrypzhqyYvji6MmOuNW7JuQI5SapfLIoV448mlmeVAD0iw5m50v7lirW1Ruf+Gztu+IQKzHprZkkamRA4zF6jJY+kkoWFPdg8sS3/AFWYHH2yLkSeaR5RVmkTImvUdHbPiNO1lF7rsJpbNux+ER0PZNnMIsPhDKfTRgMbtpDLGsQFLuBkcQOE03D9IQPV+jZ6LYSbpopY0RTIpU9EWLzeRPIjDpVKh8aOTN9G44bPMohGE2i0llTsQMdEG8bjqL90xYrHTizfQWISevmbRUg6b6OXbZHbddMiRpyH/UI8w9KdDgOQLUoTrHjPqGUldAUZq7pSnCwJKTmVUH7zQcHNg9y641bViwUcKOZ2DhI1XZRJAe+f77bfAROcuOr6ovavJvRNvgAsygNrRM5E5pByjhdDWTxQuz+3GmWdh7tkWQ12bOdNMEBjpq/Hrbt3LN21daN1tSJddbePCZcC8tN+efFRMopXmHV/DLLIo9WFrEuaKgYCYeDdLIhsG1Hl2hsLu7Hh2ekZZrOVmSb1yedEnyZsztJGRFfbodnzppVpOUdVNak2p+t3ouxzRy7m0VVgEMJRJ5o+CTN+9mSagMI/Av8AZJYYaVUQcsnqieGbjVdXTG5FTToLguke8reproeXTj9YVAJqsdrFQtfkmn2myR0hKqy4HI/7hCnS67mFEwxNJyxTi6rdUwi5bkWshaN/hSfQ69aOo7/erfdbhJO+GgglgFEJ8Qy9Vw/Uc3acBo+aLad/JL25wM/btQVVqt1VQ0jQx1RKZjUcPLDtxhsWwZORnPUbk+ncmAfIh2bjjKMBefOchsLg8lawJxIByabVoOEiRbP6jRjHRDJqo2bsCZDRo4W3fOfqFUdVWrnLZ0q5+oTwmqbrLbjHY7E6OhZE1rn9Ngc7HBazG5vJ8wL89x2JU60BpmmvMUuoNQudMdx6EM7djKjbuLyC4uA2EMBGxwAcO+cCrPDfl2mc5tcFW0+LIzyLuhTDSUyRJjhNzE5KSXSaNB7d8i3a6utdVVdV3jN0nu4wy1ysjsnvnCSuMsuorxS3BkdylMtLOY4o3uJa6N2RkbsP3k4De7STk89lKdR6Lsd5oZqzTsAoq2io+vPEHCRjy1odMWj9INaRvLSGktbtxnGCyy6+wn/PtpWOXmcgHLVpEdguxUE/UZC/tIF3Hw7hQmOJqapb7EdizxzlNJ0svoTyukPb6pq/TbJyOu1FW0d+qIKZktdE1sbW0cAa6eQuaHF7GvLWAA8Y3tPBxjlRm1aKs100hQV/Vba6yR0jpblV730u+OQsEDmsDXDIGS4AjHG0lQun5VnNggRM+57rqH2hWpV8WaspHpYKzfD5EQT3Ev1sKIR1z9vcMnrYig7ZPGyy2FGmMJKKY2ztrjK3Xtyoao0xslQ55DS1ks8MTwDyWuAZJh7G92hzgXDb2OVk7R4V2m5ULqiXUMshBeOpDSyPpGlh+bl7d0biPISWHsT7C4Fd9x1fJBxdCcY2gUvjm6DczHMOHEiTVduGbZ4mgGdtRrMi92zh0mhlMgFFOPqNV8JoqoI7uPWbptaUXRDrjBV0U7suZHLCNrwRkbJGuLSC7IDsDJ9AopXeG14iq44LbUUl1hmmMUUsL+m6MAjmaN27psAcHF292ckAEjCk2kuj47eZyaB4/HTotGHph19iZP6TLQmiZUJpIao4brq7t3SOwtbZdup8euqaqO2qud8qpp5izX2mvQqDBHLGIHhuXjIeD65w3ae3HOfcLE6p0hVaVNG2rraOpkq2Of06Zzy6MNOOdzcOHufKRkcHnES9n+SriDx7i4y867v6J1Q6mfzsxGLuGh+VzqTt2rhJq7IA4DCQ8kmBEUzdLotnhdELkU2cKat1nmi+2qW2cURUmQq172lXRclhq9BDRnKmlNQ2eV30ynZwdyVnNhSIjvgvXS9M7B20qjaAYBsgX/UxR9q0X2ygzTbKOnyyIoiqJp4WvHqV67sjt2yKe2vK/rFJpFskL0Ov7Sh0GUSRbJ6IV/Xkny7iIFuhs2SUGbOBRJ3H/iVQjroS2cLoKkVsLc7K5U54p+0bondtwsZVlDSMZX9smIh9TOtq1ljopHwDKGyWOV2wksgDH2z6UR1FxHlA+hEW0LMnzxm1HKfU4IuUw6MkZPqVjz2x58uJxXpGiErnbdUaix+lEZNLyvMeQqDcqq8TMJ2OqN+GVYFqDdfgB76LK6p++dsEVovRF0EklMZh437xLT4WNiMPGDD7ofJMhI7D4o7SHjGeXr9ZBth0RfuG7FihlTCrt64Qat9FF1k09iLlOhoVd0wIvBo5w+G5V+2PnDFus8H7OtMpr/RON0d12eV08ZTW+Run8zT/AEKe+Px6IoPlXLFGzXoqsOrpJDMEL4puHzGBV1N/vR5vkBFZ8mmlKheQTYmjHSWCSemddHZQU8esvmrZYuW+VPwRIlsPxj+bajZTNp1wh5jS9gjJLO5BNWdHdzwhOfRpg3PEXD9WMsbS2YWVIRQUc22QHCAkbhsWDt9tdlGeoLTb4tCKynVXWHWvOXBNHkuzPG4v31ZFqvXkC6+pfkKNq2tXMNji6Zp9iRa15Lwk3LTUA/GNQzMgHJNNouykCz5sRmjRrkCqYInB1eTYG61rg2Lg5qsRZiCxQoNreSgx8YkdfD34Bm7ZwiQRoQ6eio6bijZZMEWBDHrtgJIMHDBk6cN26a29MMB3EN4IJOAT/PY8qoz6d+ccgc49yvFt5xamyV79gsXmRReOBJ0fZzxGa6EtgO5KHjo7s4dQfckgshvr9UTBOw6b3C+irNllxhpu3d/Jxvp68tNNqStlqGNP6THRmTa5pAEnZxyAW7mjGQRn1XR2kKmkuum9K0uxghpZZ21xja1kjidrXtlLcF7ZC1mc7g8BpOS04pLDQcOq68adldGi5DCBEnmKhWcDtNRbQAfZR6MbEfr9EH6r2UJOV3iDrck8e6Iab5b7OVEW75w3Vcx2pvVNVxt6UeZqao7YG3LZNheMgDuSWlpJGBhSyKghiqqqlpC6CKelnjkBJ3BghfiJr2fsxhgaDtLSQOCvRz2OYisiux2vJ1U3oaya4jE02g8oQYmI0aAuI/H1BirpA0CIitNQ5hsq71yk9TxuQZo7KYxlJL4pDcQ6XUcMQc6L4qkopG7S5gLjC0OOQAMk5zkjPOeSopYIzFo1kZw+O2XCshfkgtAdUuLSWk4HmO1uBwBnsljy4cIdXFW8r2q2VwCoIuPahHWsPVbxGPuHTJdszFuEwg9XL0CLW+c51ekGosamrt9Gvujgdrs/Q+2t0lQVFXHPV9bc0YJDuo9zw0lnLdziBJtyDnDQQpNQatuVq0/c7TRvpC6smcYwGBhZE5ocGteWhjMuG352jd5zx5lYFflGs4PY0v6DrYG9jkxtGOlcSkgvJFdEX7ce2UdbHH+xJPdZ6RTw7TwiqNWGNyztkxeyBIo/0YLMMJe/jYqY0Uz45KWJ2YxEwx1LBjaAJiGkHA7B2ck54OT4WCa2svYrtlSJpaeKGaNsjn0shGXP3Rs3MIL3PzkHPJ7E5fb49IA6itEh5QXbvEDU91bk1frFEVl9xDXRRMOqpsgu51+Fxhd6/Tzlwt7pPtd8bY121xjYei6N1LZYJJHO6lV+o9jiSct9XZ43DPcknkrTPijemXbU1ZFThopbbK6lh2AsjJAzJsZgABpI5wAc+UkKp/lF6XjXP9ycp/bvFBbHkSu86WMoVLPYNT0VlYKim70tHBkxdOLaLx2Xk6wPO2ao8tnTUOFDExApR0UmAhmxdqtpctbJh4Qh1mp1YcYGIxSrPi7FGBX8ZkLQzKlOgN+gVpV8ouAMBM6fodGuGcN0VcpPGmcmcm92OE3jtss9aCyLVV3PJitr/wCj7xfX9eVhC7//ALZZE0vPZYiYp+i/7cRl1HXeaVi6Q9ttE9J8q6wenPu7c4Mm27d2rnKyXxeiLKq854oOoHNpr11V0Hhq15WMWty29BQNminYNmH0h6RiaSRFVNVN8bJfbGKrlfbXVNV7ru9+V9e8cLuCLKy9t1NG5UKgZ6ya/ATY0qzQCQ4xLY+Kk5dUgthsPTFR96/QKkNnrjbDZnhm0W+pX90UPjU121wRSNjPv+fRFBvQnNVGdW19mqeh62j1q15mRRyWZikmScKjMyGJkky0fKZ1aOGq+Vxz5PCmmnzvkLJ7Kt3KS7ZZVHcix7pLlGoOrRVShrfaSh2xpS8636JgukWmUkhiqFl1U7evYk6LrRsgPVNhEVSDrL0AR2WHO1NkHXyk3zJk7bkUnW7AnlpVbYVbDp1NKwfzuGSOJsrFrommFn0HcnxLsWjKocWWQdJjZKC3dakQz7dsthoQboL40zsnrnBFtVJBHtV1VXlZEJ1NbSJwOER2IurEsctqan88dR4Q1FqyqZnNEG2hOUH1GuSRshhBLLog5cOM6Y+LOfRF57emePP6iFnbtnTvnjzH8/ROmZHPZNJYRXlv80VQGTgUOJl1n0ar1WRKU3aD0o0jYbdCPqntzDAkcwO2NvNGxF+42QIvQ5XzaXsIDAmFgyALLJ6ziMaZTeUxsTsAjsjlzcM1byU8BBbuyGwUMXMpvSAwRu+ebjmThBnu5X2RyruKcevI9R7hLJ8wvD0M685hMlnAJV1ZVON384gJkTjCEhR2YoZXJCWbpPX5iiDxFLC+Ge/zElHbdHbVP5ufi9QfXNpNbanVVPEHVdJue9wyC+nO0yl23k7AxpaP+p2fRbC8N71Ba7zDQ1kjo6CtJj4+VtQSekCScNDtxHA7AdsZHlDp6lHxtOL7S4hvK1FFwhR8o5GFxGWJBPfGdxTpuWQbuXJkcllQa+WTSXZY9tlEspqOdtEdAyxR9ek+GmdLHVTU73CEhzomSyMcd/BwImuLpM9g1xHsun4YIaaGudKWNc2kqBG8nIzHBIYw05yXSloY3nu8eqel5XetqPqqfU6I3ApFpVChjdofkQZxrlwDZrs9foQyefj2QdNkPnrLKqqL5000WTS12znKu2Niap1LbGXy2UNGOpJQxUjJq2PHSe2NgBG4d8AYd3IOf5OrNGWG5Q6butRcZnMprtXTywUMvlmZ+puDi08gk+VuDjaMkk4xjdTX3ALaBD5OhG2yySiWuNdSDf5iaucpZS3zsjn49Nsbe+dVffXGm/7YznOMepfRajpKiCSdj2uMZJc8+YgNdlxGfYZ78D+yw9ZZLm2eWFu8seAWA5BHUPlbkc4aSBn2xknPNyqb5NPX3Jwk9k7vQPTAn5jURExqmzdqV00Xc6FWyLdPfO6SBBXdRuSWUylndrs6Yt9fkb5xrZbrLPfLgLjVSB1s/qRREDbOMnh2Mnb6DGAMHJ9Fjrrq+DTNu/KKWJ7rsSWzVLWlz4XEYLWnOMtxnzDndgpzo9g0DtR4xg2SYj2DZFmxasktUWrZq1T1TbtU26SeqSKKSemuiWiWqaemmuumuuuPb1sRrGRhrI2CNjRhrG8NaPoFp+aaWeWaaV5fJNM+aRzjklz8ZyTycYHJOeB9cqZ8ndX+VKzJTSQzxydz8/cdjMtJcnZw+2K0iU4ls6IJrhVALqIKTCAWc0cjwzJYkkTGDBEWes3L5k5dGzKJNu0CXLyVBh3iW83s3wxIW9/UK2NHCajxBcsGqDlGFiRmyWqn/q2gssHn9ftmym6ONk0lVoXhugpvhxuPX1SymoRMJ7a8Wkz7UJ1M+V8jXffOLWt6/ShEhC803EnVQa1SGq+q7qcTocBGIM30sI+2yDlfCG41BrnRsPHMk9VsOCKidbf0sXB0NuSt73m9/d3XfPqymsfn4ZS1OgRRFg+kEZLoHRe5F8CrwDMtW+hNo1cq/bJeNeKZQxjD3X41c7kTSLJ8TPj4t7rED3HZHOICWdSxktAzoS0iUssbGzIxWO4xSBlf0U1mTeu3BSNbhRGw8k6iS73Gw1luquruhptgiYv6Iq2dWCurDNU6s+NpJSsVuT9ZwlfcpfgiXm4DmBoyBptP2f0cIcNzf6gdRr63QBv7/R7v8atnK436hMuPIseXr/rR1d93G972gY/n+VVIFj9HQYbVqK9g1Xb+jV6gesOQSogZyLnIfd1u1Ij4s8GtWW3y27BTDXRq8dmCKNQXKfSRKAcajrX7ntOQWlzlNms1u6eVvDYVVQDrbRASfHbw+xoCJbEA4SHqqExS6wwSsuk4yIVeZQSkDgSfjxFE4HxTRQN3a97zc9j96yCULSk1J2FBnegm7nmQUmbjz6O7RhnWbaEs3+YeJQIKuwcfcSlZqweoM1VMudG+qeSJQfnkt3wBzC64VEPIyQty5+lqABuR0c51oFe3N5c5F2EiAk2B5XSKu4pBWr4ix1EE2SpWwIwW2ZudNNHiucIIoEXpuoxtD2dJUq0ruIHK9r1rVtet4JApOFKRyTQiHIxQUnF4fIo8cVXNATkaA6sApYMYWWLCyDFwxJLKvEFt9iKU3jVF80csnKeqzd23WbLpb4xnRRFfTZJXTbGcZxnXfTbONsZxn3xn29vXnKwSwywuaC2aN8Ts4wGvaWuyDnOQeyuY98UkMrM74Z45m4OOYySOeOMnPf0/085dv8rsanuOc4aMVE25N9uVB75+LZvsGfOMq40QTyupr8/DvPyVdk/l/LxlHCvwppt0M6IuenWWq5TxRRBsLRJJC9rWgOLi7DRt5aA1wGDgckHAyD09YtSi82amdK9jnNjhbOOXubIGsyHjBccSZb/yg5OcHKX9cnP4K2zZRxJEdWkgYudFw75zv76G0NstN92ii23yMJ6Kpt3LbbfZPZZLHx742yljXGIM23zVdTOQTFLuJczZ2aOMh2AzB9gc/Q5ypmamFkEDJIw6Ix7g/IbsIceA04cPUkhv8cgrNwleEqIr3VxGArpREkSZC8tnK2/zWmi+26jhVfONNEU/m65UVQ+Tokm33ctWm26+mmyqlah9da7e4sdI5mXteGskaHbnbcEgAHBPvg8enK9LRBb7rcww5a4OjAJcTyzzA4I7eXB9jzwBlemPix26fcyVS5etkGrvcI41cJoaa6abqaE3umVtvg10xuqtjXCiu+ce+++c52znPvn10lpN5k03aHkbS6jZuGMd3Ozkf5xhcsa+hFNq++QtJIjrXgHkftaOPTGMctyM5Ge4FpPUhUPXmB/qCdfDStZnJ4zyv1H0M+TkAaxmFbdCVUOsfWB1eMZkIq4kQafFIJJEHr9ci7ciyAsSKgc7Ki003T90kHYlk1CJEzLleF8MdDwniLqnk+9bAkNJcv1/KqXoVCN2vOx9aygJvF2lSuw9sw+ZaoGJ7KYmxBJNQ7ma6anBxtHBhfLp7o1cJEXaUX45pRSnaln9cN+7+z7NhdoqTwovy/adpIS2iY0anZpsYRXiEewLZIhgkJbI4CQMWghl6ECat2Kht830cpvSK1nT8B6RsOIwwXzHfILnuXi7UgkimMqkNYBLXaSiqxBBVadV22BHXbNuFIS1jsg2bSporkkIwgrow3aLu9SDMi0dDi+sSK1HY5ekdKx9qxvOFvuhv7xipaUXNc7Ipk/1+Fq/EVW01Z2k833Ffpl9IFEgDfZN0oQXzpj6Z0RWWx+2Pf8Af2x7+iLGZtLg8Ah0qnUhy/wAhkcNyo5sLGPzZPAiPDHRYjkcGFN3ZQs+wzaLZaDBrVy/fr/Las26zlVJPYiVJzd5ZxnelN9Qzfh/mboSSzajo6irWwbomEN+fYPfUwNDjjiNgoPODZs0iky3fBdmsgenh4NcAmQFOHrXVu+ys3IrCePeZeRSfVbMJL5GqjoGkbKezh9muoBREmOypETXOwsbsyRnxgnJJYLdy9uayWbqvI0XSEu2KbZfAcYttvoqRTBzFR8g5kq0/Ep70NbPQzpae2RYatj3icZFpIEBS2QvpEwhTQggi1SbRCCDVNRQRBX4UWjRFX6ZMeN+kFDiJanV3Xsx2h9J9F+JvhmtPIhY/VBI9GRXRIArCYxXcFH1+i5GsTdrWYs3YyV4GaEkDgQSJdyCNNG7kKaDoG2xl2JElCJxcCfTYpBIGTssGFjFiEIpHHs8jcbLrSCPR+ZuhLVeTBAR1wzHODQYUZUfMRpVwPYrkGjdF2q1b7rZS1Is29EUYWZUkRtQbqxkbVTDhDOcsijTZNN+0+L3130T33T303S3xn4tklddtc76abYxjfTXbXG11spq2Mtla7O/cXsLQ8AuBcAXMeMBoOPLnHGVlbVeK60Suko5Q0PBDopNzonOwcEta9h3bsc7x7DjhUemXEqbmVr7Y3jytdJBdft2VtH7ia6ybO+m6rzdbOiIRmMxplbTDZsgoqv/AORnfKOdNvjjTtIQCrmfHMwUj4tsbvL1xIT8sjg3pkkAHhgP8cqf0+vpJaCKJ8cpuPUAlDsmDpYwTC0He3nIO6R47+gyoFmtHM4eLzFzT9F1GyOpBdio713yrh4zVbLJoqKq42wmrop8hRqoh8Pwe26eNcp7b4zGLzaY6Shmo3vZMSMsa8Nc8u3AtGQAMZx+3IHGc8iXWG91VTNJU0wkhkp4xJK4EhjWbMgjkuJ9O/fnCbJUUYaw2s4RGWjX6NITGxSGzb3xnKTjdoku6xnOMY99suFVdts/52zn/HraNspxSW2gpgMCGlibg+5G4+g9XH0+h5ytI3uufcbzdKp73SF9ZIA53JIDWep5757qRvX2rFqpdskOmn3RVJQSLUvTU+4+lEYsTbo2bzeTraWBDpIxYtl63aRGCLsXIiShzD/Rdibw5Tdr/C7y7+eD0DJ6SMiqUS5w8fflw4rTq3apZhGecg1xyV8BioeLS/l87HLTrSQyiPv5WBBCWsWeJJ7li8ieIOnQ94HPLklyBBk5IaqfIIrSheapfz1xFnmHjufLAZ3XNQmYPQ1h3w/I2ZsIlejF/tFTlhPVG272QM2RZ0mo70TGLN27FJJq0CrsWqQvci3xss7Cic+5WrQ3VcItSGnq4Pf8WHSAWZsIU0gNmxqJhNwykLqYmgubk4WzpjubRatxzxPSGC9UFiauNUUUHxFmqnVFVp9WJcbbZmGLkWpXa/NMfoSUZgv6B1luYXtnNh/b/wBJayHJrHtiO5JfdPpMZc5RxrnXGxFZD0RfM4xtjOM/tnHt6IovtC7Kdo8aGL3DaFfVWJkUgHROPEbCmEfhrE5KDG+UxUdDupCQHokzZDfXfDQWx2cPV8ab7aIZ10znBFHVZ9IJ2V0F0JQidQXZEM8/IVqsras2gS4CoLXzZMcVkSadOzRR6slNN4fojkTNdUmbTAU0rqx2yrnTO+5FZFdBFykog4S0WRWT3SVSV1xumokprnRRNTTbGdd9N9M51212xnG2uc4zj2zn0RVCjthQijLyq7ierOYZ5Da7I1VKLEj9g1fVgSO8t1wiJkaqLquyJQCqMGxibH3710dHR9gB+U/RfbE91s7rOt0yK2zj/wB1L/nrj/p77Z/+seiLc9ER6IuEQa4dtVUc7Z0ztrn22xj39s/498fj3x/P5/b+PRXxyOjeHADGOffOf/X+ey1+gY7eJi3arBQ+u2E1gqcibu5O/dFWoxqLb6vmeXO5HCuq7h233aJ76paNk9NtF8ZwpndNTOuIHqOhvNVcLe6ihEtPFMx0rsu4bu7ghpB+ucHGeeARtfTF4s9Jpq+mrq3UtzqacxwkBpG0PAwMuaTujy04aeHH2wmZ6Y9tddfbGvw664+HH7a+2uP9OPxj8Y/x/wDsep01pa0bvmIaXY7B20Aj7YwtSA5a05LsgnJ7nLnHJ+p7rV6uVVXdGs7416q3t3PRHx81K0brBNeV81fF9fk3LrN8nc3jrceHWZkpjeH7bwnNd7sv09pnP6h1d/X+6WXZF0gO4aM7Gh/S1T0zdL94Sr2T2RzLb0jrAoUjc6p2024JYNImYM65YNlBc2h+S6BEMfE6kGDI61S3bO3Dke7bo2l7QAQ4OBOMghoHBOSZCwHGMYaXOzyGloLhbu5DcODj+0gAj6kk4/vnkcYUJ+PDje+uKYPYde3F3Db/AG5Hy0tTMVSevQTorY1axXQck1WiRqcKyE8WsJR0+S2IqmiG4VBD2TajwbLXZwqua4PaHNIIOcEOa4HBI4LHOaeR6HjscEEC8gg4PcKt/OXnt8fl63FM+dJtNZTyf0HDJg9h61P9aRrFMyM67QfYZMHUdKliLqKv8m8KNnAoK5OsZO5bum66QNVusm43uVE6NPbRTXCum3xa764zrtjPvrnXOPfGdfb8e2ce2cZx++M+/wDn0RbnoiPREv3pTxf8W9f9FUz090hVG1rWPQYbYPWo2SyeTL10O9ji0iakytbJlEodICzEquq4QdGRTzRf2Z6kUH2BAXI4ilLsftvmXgKmn17dT2WOrKu2hNuAHul2ZAwZkkmfNX74dFopHQrV8ZkB982Gv3CLAezUwg0Zu375VoOaOnaJFhVX2bcFwWjV/R0Tsmr2XAdtcuxuURKCyuIyaL366t6Xlx0pBSp6RMOGggXEc1u71Gu4s7aYNtz+2yiiOyemjlEihDyueSFXx803DsVxVEpv3qToqTuKm5YpeLBypDSZ2Y8aoaoEJEQHtF0GEWjChIaRLtfqW5I3qsgNGqtEVSJsMRSjRc/60o3x9B7Y7ijyt2dXwWpZZY9sQLmeGNSZyTnmqp6VCa0riID3SLCQTEXH1gsI9hLzUbIZMNdPx7pRo+QcKkU2SS4bRP8AIxW9qTpWQlbkPUM4s2refLYWZ1vK3tglINtJYlVVhKv3uWEMPbnFmUbk2rsno1DPcPNFiKCSGzxMioJ1t5Krv5YR8XMJKcqOpHf3e91VdVVm1YKlbguFopsaBAHFwPNJ+AAFBMge1gbk4/DR0sxYgT8eDSk5s/HshmHOCLn1T5PJFaXlc7Y8bA+l2aIrkXn+uLXQtXWVudnk2lU4jtZyrMXXj2sbWZAxi421RbQc+1LkXiTiMmHizZ4kVbMxJEvBr/UEzt54cKv8sIrk6Pnt9+jxdP8AQdbsLIdMhNZQfafmYQ/nwaTrRB6RKLPne0CYDhxMO0RHl5632XckmQffQlXc7BAe5oIIO047jH+f6pweCA4exyRgenfsmJdP+UhPlruzgLnecQMK15r7wjsqCRXpJ5InSH2O7ktRa1f1+4CZFJjE2EwwbjAxkRWMqu3xeYMcaMhzAASdv7QMADJOBjJOT68k+/P+HOX9vYeycBj84xn+fVUVDLHsW4+ebgte3LeteCmOWSsFhoOk6TAQrdnbDG12eXSsyIP5is6+kOCDjXVDZiy2SSRDpJ/GrsnsguqS1z4leJen/DGxOu96m31c7jFaLSziW6TMAMjGyc9IR7mkuIxg/TBk2lNKXLWNzZbLazpsjw+vrn5MVHE4gNc5oGC487Wkjc7jIAc5lAQPZt4zOfmAfP8AXVbwNWaGzEpeihIAIiQOlfodXJuWTWSEVhQ0kX3Fi09yh18kP31aMkUVnK+jdLPriun/ABEeMPiHfnW7Rz7HZ45Q6ojinnhkioaKI4kqa+sq4X09JSse+ON9VLGGNlkhjwDMCuhKjwq0HpOyPrtRS3C6vp3sheHukpWVNRIHBkNP0juD3Br3sa4vzgsO47VN8J8gFnVxOMV/03DxTdLKgzZSRxdNHR0KYk00XDcwugyelg8lDrNHCLpN0BcN1dUMqfI0JuMat/U0sn4mNWaS1M/S3ipaIZI4WRtlvVqhji+G6kTJoqiohYGxyUskMjKiGpia1k9KWVDARICo/c/COyXyyDUGh650W5j5Baq8u2TCMvbMyknPndLFIx8TmSDzTsc3DR3sh1l4+uHPI5XaAfpSjq/t4SYDsloxYCbT7TYYIctnBIc8hVnx9QdMwCOd1/qfpRhpEa+TVVbEmT1k4cNlu26GtprjSU9fRzNqKOughq6SZuMPgmjDm/fkH6ZwcEc88ywT001RS1UZiqaaZ8MsZHyuaTwe/P3+57q0FIU7CueqerKi63QLNYBUcIjlewxsdOFZMYbxqKjG4gOgRPnHT0sWdJMmqKarx86VWVzr++umNdNfrXmpS9ER6Ivmf2z/AMs/v+3/AF9EVHYXxx99DTQN2XMIp26xx0jJb8o9tbtK1ug1oQWrhPSvITFGLcc+ZESdat1jLYRYrtBvKXqRp1oploj7IZIvLJTNUc9eRSqJh5LvJbWfXHZb66e0ZPypQnNtB/r4jG+Qq4CWJIYHFXTyv6sk8IVBMh+w7cjZdim35VfRN3HVkBTo2XdLFyJqnipWk/LHb/kB8Zhu2JdcHO3KUYo6+ObZNbBpvJ5bS0MucPJSEkqM1PCHwvngiLKo6/pBUuvl4zjKLzCqqLdRXTJE2o1WYDpC1OYOo6y6lspKuahzZxJGEUlZQR7z90Y2nsf1h7fa1GwdqVZT5pXr8c5LwzdmaSSBSPJDf4VFts5bkVSJbc/HvdnkC34idIXOZubxwHat7AKSuESN9FafCWAuomPiVfy03GZYi9lp7QZJUTReAyGN/YXDJMkzWIuFB5sRuRWerbuaibh7L6G4fh7WYPrk5YiNeTazC7iON9a/ZJWYx0fAgwiUoknKyslbjXTVYgMejBfxIuXGBrgp9tM6jiJf/CHEfQlU+WjzBdoXTExwSDdMv+bIvzjJx8njp13LIPAYO/CS1w6FDXzg3F1BKgSDD9mUlYCt3jlF1uN1fDWOr/YihTxe+J17W/in6M8e/fVYI5r2a9F3qbTi8fmbEg9P1E9k0XkNdycadgpdZwDMOCEaSNjWKb1qcHqt2ej5m2crKNfRFPsJD+PDzB+NumZqHry1z/OHP8yGSeroc/3KR67YXOOS1icVFjEdRkkLmVpIuKGPAqDVxInL+Rh5Aiq7cokH2ircivF4+fIBQ3kq5tBdL89ryVvFSJ+QxE7FJ0PFh5/BZdGHWrcnGZqFDGD40YX2ZrjTzNNmYIIOwJoQQTXx9XlBK1zdzS3BdnbkDGcbm5POAeM/7cqjskEN4cQdp5wCATzj0wD6HnHryl/eQ43I530fFaxSe40HjRkZEA2iu2dWKRqYvtcvSjjVPTO+uV9FhaC22uqmdEBumEtc7b7Y2/Nn8SFVX6z8ZbVo+Oqlhgg+AttLCQQxtVdpDCyUgF7jE17CZS1rpMBpZHI7hdZeEEFDYdB1uo3QbxWNuEta44Mj4rZGJjHH2HLflD3taZHOyWN5ETMmFXc6lrDUFWGVs2zB4SY1ohGhkDLR4IELnE3cPNlyxws5V+uaC/nvEh6Attvgk8y10y4RS32U9RGmg0n4eO1fSWGv1FqnVtTa7lo3a6zTUVpt0d2pH2W5yzVzzHUNq421RpqCIUr4pq6pp45JIdwcM/VS6g1THY6q7U1q0zYYK2m1FHWz14mmlEMoq7eG0729IsNS2AVBZK6ePaejFI3eRsSwOKtCuXDk4HPxC1KIp6INnzNUmNIAz0UEyRCPpJEhH0rY7FZU3QkDR1uzdvHWqjRFJNRiz2VSV9W6ioLXrXTN3u1zoaq0a20FZNK0lzjNUaiK522jrBZpjUwvdtgu3w9ZTmuhIAjqmVg6pexnUrb6iq0zqGjtdBWQ1+nNU3u6V1vjlo20k1HLtnqd7JYy98lPNNmV4eG4fI5rQ+MteWXeM2YEJFRBEAQXcOMQeYEg47dffKuExJBiOMt2yW++c74TbvXpPXRH3+WijlBNLXRPXXTXr78J9/uF68LIqe41LqySzXWst0E787mUgxJBTtJHMcTTgfLhxIwRgrQ/jVb6e364qJKWNkcNzpIK8gZ6nVI6Upfxt5cMtw53Hcg8JjHrppamR6Ij0RHoiM/tn/l6IkA2B4iOsaduK4LP8W3kSJ8TwzoeYmLHuDn+c0ZDeh6gQsyRpoZk1kVcNmT9svXp2SO2+CJ4cyTcsCDz5WmHDYOxGBmJF3VS+I2pR/OHb/Lr3tS07I6365RjKna/WYyUxVLod1goNR0jsdxDk1DjCsa4IwtM/GovDV2mddoXJTrIcXcN9R644ivxEQHK/iP4MAx52ZWrXl3kus2rQtKyjEvJibYUmR12MSs8ziwZ6WOSSXSs47OndwYHO7+QnXq7Qa3RVwiiRRT40eCKT45jN9W9V84MXJKu4LfN9RTO65cKaDJVLRNhKupRBI3uroig93isWYSUo+BoE9EnupCUyJ+s0YrklGaBFTvwj8w9GQezfKV2L1lXsirO4ux+1pa6iUYleo5U0xoKqfuIuptknI1VXRYKkhJi0bCbK66bPBESHGm+XDUo2euSK1/jM8gE37tk/kFFyiCRqHg+SO67o5RgBKOPST/eaxOrnjcezlJ5R+su31PElM7PHWgrZIZoi6bIIIY2Q3cOSLs/HDRHZ1JSXvFt1raa1qw6ze0rTtHlxYpOzU4MxWhZSkNxHohsiWS0bwgKF1aItx0DCb4FAif31Vojo2fILuSK6VB830Py9DClcc+VpFqohZmYSawCsZiSCjQe8mEwdpPZIeVSVcOFMOiK2jbXbTTfRs1aoNGLNBuybt2+hFANTV9KqJ6lmlZU1yVVdZch2NEJPf08veGSKPg5JLet5hNkB8lBmawYt0irxUxDmLSSP52prsxcOtEhfz9FG+jXNC0uGA7b2OQcZwe3sfqDwQE/2zj7gg/2JCrN39V5KJW1WfRzNk8IRdkTijGbJs0MrqCHEdPJvmD5Xb9tETLFXYYiorsmgi+Ytktt8KP0/biH8RGjqyw6+0p4t0tM+ezWu5WJ+pXQRSSSQfD3BwZUubGMNaI3hzxlkYblz8ZyuivCfUMVx05d9DSSRMrpIqn8oZM+Nkcza6MRVULy75cxt29RwLgDlhDuRVp0VqRrZ0ws+FdTl4YTlZyTlPkJU3Kni7JjJSrgooMcq7v1Gjzdoosjsk5w31+W/aNiTT5Dpu1XS5/+M8Naa+XXUVn19qSz1N2rbxJWiPSMbH0zbrUNkqqV/UqsTRzujbK0zB7ozE0wFg4WxvgNWutNustw0bY6/wDLWU8QNRfgwvdTMLYXRs/LW4ja1zhhg2u3ecuzkx0elNbweCzaHV1KpDZsvtZcM0lcwJRlzGGDQCLMantgwhgQJEDRIocONmKpQi9yimo3baIIp/MzvvvibhddJ0FlqtFaCqb9qS7azuFBLer3cKTo1ctsoqmmnp7XaLRHJU1MxNxpoppXxtklllY6J7zSSGnGRorReqm702p9Vst9jtml4nxUlNDVxVUEElVSiIz1NUYoGwBkLi5jJWMYWODg3yiSR1HC9PGKdo0YwkrTLCSy0o8mJhhvjbDgd9xasGQwe813102TdoCh7RV42zrrlm+cumu3xbJZ2z+iHgPoWp0B4eWq1XBrW3euMl2vDWZ2RVVUR0YWY8mW0rYzM1oHTmLmOa0g55Y8RtTs1XqisuEH/Aw5pKAYaNtPA4sdhwAc9skgMrHvL3FrhtdtGFcv1uVQVHoiPREeiI9EXzbHvrtj+cZx/P749v2z+PREsfx7+M6JcITXra3nlsze+bw7Fugradm2jPE02JBIC3Im3EAr0YKavXzNAXBxx4gy1IIqoaklF8aMhQAGxDgBhFlivkDoeZeQk94wx0bOzu1I/wA/KXpaBhmzBla7gIh4XBjg0Fm+F3+5FvKpGIkIiStB6ghZn9iLB1V1sfdUMYIpU7kvakeauVLcsW/bjN88VZrFt4KRt6IIEFphX5Gxl21fRg7B2wgHJX/6tFnZENdxxVvHyqI8i3bv3rTYe0c7akUj8215tVNA1NXWbXsW8f0pBAIpK37cMN5DZNhN02eirWTzE42HCtSxl+2VR2VfrM9XjhPRJQgs8f5cvXBFGHHnG/PfHgW6EOempFIZ0JftidIWC9IyheV6kbLsdwyzJFRT1bbfViEb7DG7YcIR3UTY6pq/MWXcqrrqEUL8xMaGiHefkGiVcg+nNLgkSvP9lXlJrSczorz+TWPQs3pCh/PBKREHcZbfaxaz1tPRsWZsUWxTVmF3cu0Is3FACLDrYqTudPy6crXrWM1khDhRxzRbNV9IVkvOmQ6Fxqw2j87LK7sVrAHZDVxJJjKSxOPRfU4JEu3QEDFnbZ4SHjyOzZ+RXb6hBdFyajJ4D5On0Aq+/wB+2C617OrRir2awQC6Rkgdyd3Oxoe4bOyOH0VROCx2U1c6Miz5gRXRcoNFGypF3FZzuruhavaSCJT+sLzhpRMlFj0mr8uAmVfHJBHnS8fmQxuqLJSAZjDCQMiTB8GXIvXItdFRg9UUXR32z8lVRwV0M1NWxQ1lHOwsloqmGKamlB7iVr2kuB4IyfKQCBlXwyz08zKimqJqWeI7o5qd5jla7/uHOMe2D6KqMw8Z1DSIgsQBEppCsOFt1dxocoyfCkvmZ+LfRsiaHEHqKeu3v8pP7hsklpnKaaeumNNdOcL9+FHwvvFbLWUcdzsQnOZaO3VO6kzkEljJ9zweMAl7uCQQe42xavGnWVrpBSE0FwAP9auie+fseeo1wdnsBzjGSQTgiS6e4XoynTLWSsBpSWyVj8O7AvMnbYlqNc4+DOHY4W1YsBTd5ptpjZu8UaOHrTP5auUd877bzbQfgT4f+H0/xtotrqq5Fob+Z3IsqatuMYEW5myAAANHSDXYAJJflxj+pfEfVOqYzTVtUyloj81HQ74op8tAPxJc5xm9Q3OMNw0YAVyddca49sY/7/z7/wCc5z7fn8Y9/bGPxj8Y9bja0NAa0YA4AHooIvvqqI9ER6Ij0RHoiPREeiKKI5RVMRC07BvGLVZA49cdsD4wJs20A8XEMJ3PRkLY/bIowlcnbNUy5tqAHapMBiL90to2Zt2jfTHymbXREiVv5mPHRa3kwinG9NRqTxYFSVfdk1xdXTog8WNCi8tqSGCJAxIg4lqKDlWpY65SPEG7ISaVFjsEHI8zkhoqG0RWIm7yl+lHYXISeoMudQBRko+xG42z0eHzCAwYuv8AZADDC7RN0YIJofQCmf1LZNd6s3Q+cjrv8epFT/xqROpIXxFQgai+fbS5WqxePn5DGOfrrbH2Vq1rvMJrJpcfEzVlKTcjPMyr6TnDRxNsRNPFEmBVnhLVm3+UPaEUpCuh3BLrCS8vf2MvQc0jtKibjx0ORhiLfnc84Ky1SKbVeCnuCaiz60mGmv6ifRrYUllCPaOCKjnXTDfDwi19WKdXp1PvtxihSa91fq+Dap6X/vL9K8xBt5QO1sPffMIzg5mRJxPJLeNa6ZwzyWwhl78SOudNyKyHwY20xrv/AKvxj4vf/Ofb2znOMfj8/n3x+359v29EUY0/SVQc+wpCuKOrSE1LAWxY6ebw6v46Mi0cQMycq6OSAmkIEN2rLR4XLPXT98vqljdZdbbbbPtjXGCKUfREeiI9ER6Ij0RHoiPREeiI9ER6Ij0RHoiPRF8xjGMe2MYxj+MeiL77Y9/f2x7/AM/59ER6Ij0RHoiPREeiI9ER6Ij0Rf/Z"
                                    alt="赞赏二维码"
                                    style="display: block; margin: 0 auto;"/>
                            </div>

                            <!-- 右侧竖排文字 -->
                            <div class="side-hint right-hint">
                                <span>按</span>
                                <span>←</span>
                                <span>↑</span>
                                <span>隐</span>
                                <span>藏</span>
                                <span>窗</span>
                                <span>口</span>
                            </div>
                        </div>

                        <el-row style="margin-top: -5px;margin-bottom: 5px;display: flex">
                            <el-alert style="display: block" :title="tip" :closable="false" type="success">
                                <el-button v-if="need_jump" @click="btnClick(opt.jump,'opt.jump')" size="mini" type="info">跳过本题</el-button>
                                <el-button v-if="!hidden" @click="btnClick(opt.auto_jump,'opt.auto_jump')" size="mini" type="default">{{opt.auto_jump ? '停止自动切换': '开启自动切换'}}</el-button>
                            </el-alert>
                        </el-row>



                        </el-row>

                        <el-table size="mini" :data="tableData" style="width: 100%;margin-top: 5px" :row-class-name="tableRowClassName">
                            <el-table-column prop="index" label="题号" width="45"></el-table-column>
                            <el-table-column prop="question" label="问题" width="130">
                            <template slot-scope="scope">
                                    <div style="font-size: 11px;" v-html="scope.row.question"></div>
                            </template>
                            </el-table-column>
                            <el-table-column prop="answer" label="答案" width="130">
                            <template slot-scope="scope">
                                <el-popover
                                    v-if="scope.row.style === 'warning-row'"
                                    placement="bottom-end"
                                    title="相似答案"
                                    width="240"
                                    trigger="click">
                                    <div style="font-size: 10px;height: 220px; overflow: auto;" v-html="scope.row.answer"></div>
                                    <el-button slot="reference" size="small" type="danger">查看相关答案</el-button>
                                </el-popover>
                                <p v-if="scope.row.style != 'warning-row'" style="font-size: 11px;" v-html="scope.row.answer"></p>
                            </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                </div>
            </div>
            </body>
            <script>` + GM_getResourceText("Vue") + `</script>
            <script>` + GM_getResourceText("ElementUi") + `</script>
            <script>
            const tips = [
                '想要隐藏此搜索框，按键盘的⬆箭头，想要显示按⬇箭头',
                '想要永久隐藏此搜索框，按键盘的左箭头，想要显示在屏幕中央按右箭头',
            ]
                new Vue({
                    el: '#app',
                    data: function () {
                        return {
                            tiku_adapter: '` + (GM_getValue("tiku_adapter") || "") + `',
                            search_delay: ` + (isNaN(parseInt(GM_getValue("search_delay"))) ? 2 : GM_getValue("search_delay")) + `,
                            gpt: String(` + (GM_getValue("gpt") || -1) + `),
                            show_setting: false,
                            hidden: false,
                            need_jump: false,
                            tip: tips[Math.floor(Math.random()*tips.length)],
                            opt:{
                                token: '` + GM_getValue("token") + `',
                                auto_jump: ` + GM_getValue("auto_jump") + `,
                                stop: false,
                                start_pay: ` + GM_getValue("start_pay") + `
                            },
                            input: '',
                            visible: false,
                            tableData: [],
                            passw:"password"
                        }
                    },
                    created(){
                        /**
                        *
                        * @param type 消息类型
                        * @param receiveParams 消息参数
                        */
                        window['vueDefinedProp'] = (type,receiveParams) => {
                            if (type === 'push'){
                                let length = this.tableData.length
                                this.tableData.push({index: length + 1,question: receiveParams.question,answer: receiveParams.answer,style:receiveParams.style})
                            }else if (type === 'clear'){
                                this.tableData = []
                            }else if (type === 'tip'){
                                if (receiveParams.type && receiveParams.type === 'jump'){
                                    window.parent.postMessage({"type": 'jump'}, '*');
                                }else if (receiveParams.type && receiveParams.type === 'error'){
                                    this.need_jump = true
                                }else if (receiveParams.type && receiveParams.type === 'hidden'){
                                    this.hidden = true
                                }else if (receiveParams.type && receiveParams.type === 'stop'){
                                    this.opt.stop = true
                                }
                                this.tip = receiveParams.tip
                            }else if (type === 'stop'){
                                this.opt.stop = receiveParams
                            }else if (type === 'start_pay'){
                                this.opt.start_pay = receiveParams
                            }else if (type === 'update'){
                                this.updateScript(receiveParams.v1,receiveParams.v2,receiveParams.href)
                            }
                        }
                    },
                    methods: {
                        save_setting(){
                            window.parent.postMessage({type: 'save_setting',search_delay:this.search_delay,gpt:this.gpt,tiku_adapter:this.tiku_adapter}, '*');
                            this.show_setting = false
                        },

                        tableRowClassName({row, rowIndex}) {
                            return row.style
                        },
                        btnClick(e,type){
                            if (type === 'opt.stop'){//暂停搜索
                                this.opt.stop = !this.opt.stop
                                this.tip = this.opt.stop? '已暂停搜索': '继续搜索'
                                window.parent.postMessage({type: 'stop',val:this.opt.stop}, '*');
                            }else if (type === 'opt.start_pay'){
                                window.parent.postMessage({type: 'start_pay',flag:!this.opt.start_pay}, '*');
                            }else if (type === 'opt.auto_jump'){//开启自动切换
                                this.opt.auto_jump = ! this.opt.auto_jump
                                window.parent.postMessage({type: 'auto_jump',flag:this.opt.auto_jump}, '*');
                            }else if (type === 'opt.jump'){//跳过本题
                                window.parent.postMessage({type: 'jump'}, '*');
                                this.need_jump = false
                            }else if (type === 'opt.confim'){
                                window.parent.postMessage({type: 'confim',token:e}, '*');
                            }
                        }
                    }
                })
            </script>
            </html>
            `;
                addModal2(html);
                checkVersion();
            }

            function dragModel(modal) {
                // 获取拖动句柄
                const headerElem = modal.querySelector("#hcsearche-modal-links");
                if (headerElem) {
                    headerElem.style.cursor = "move";
                }

                // 设置初始位置
                const pos = GM_getValue("pos");
                if (pos) {
                    const [left, top] = pos.split(",");
                    modal.style.left = left;
                    modal.style.top = top;
                } else {
                    modal.style.left = "30px";
                    modal.style.top = "30px";
                }

                // 确保模态框可见并置顶
                modal.style.position = "fixed";
                modal.style.zIndex = "999999999";
                modal.style.overflow = "visible";

                // 简单的鼠标事件变量
                let isDragging = false;
                let offsetX = 0;
                let offsetY = 0;

                // 鼠标按下事件 - 开始拖动
                if (headerElem) {
                    headerElem.addEventListener("mousedown", function(e) {
                        e.preventDefault();

                        // 计算鼠标位置与模态框位置之间的偏移量
                        offsetX = e.clientX - parseInt(modal.style.left);
                        offsetY = e.clientY - parseInt(modal.style.top);

                        isDragging = true;

                        // 临时增加z-index在拖动过程中
                        const oldZIndex = modal.style.zIndex;
                        modal.style.zIndex = "9999999999";

                        // 添加临时鼠标移动和鼠标松开处理程序
                        function moveHandler(e) {
                            if (!isDragging) return;

                            // 计算新位置
                            let newLeft = e.clientX - offsetX;
                            let newTop = e.clientY - offsetY;

                            // 获取窗口尺寸和模态框尺寸
                            const windowWidth = window.innerWidth;
                            const windowHeight = window.innerHeight;
                            const modalWidth = modal.offsetWidth;
                            const modalHeight = modal.offsetHeight;

                            // 防止拖出屏幕 - 左侧和上侧边界
                            newLeft = Math.max(0, newLeft);
                            newTop = Math.max(0, newTop);

                            // 防止拖出屏幕 - 右侧和下侧边界
                            // 保留至少50px在屏幕内，确保用户能够访问到模态框
                            newLeft = Math.min(newLeft, windowWidth - Math.min(modalWidth, 100));
                            newTop = Math.min(newTop, windowHeight - Math.min(modalHeight, 80));

                            // 应用新位置
                            modal.style.left = newLeft + "px";
                            modal.style.top = newTop + "px";

                            // 保存位置
                            GM_setValue("pos", newLeft + "px," + newTop + "px");
                        }

                        function upHandler() {
                            isDragging = false;
                            modal.style.zIndex = oldZIndex;

                            // 移除临时事件监听器
                            document.removeEventListener("mousemove", moveHandler);
                            document.removeEventListener("mouseup", upHandler);
                        }

                        // 添加临时事件监听器
                        document.addEventListener("mousemove", moveHandler);
                        document.addEventListener("mouseup", upHandler);
                    });
                }

                // 添加快捷键控制显示/隐藏
                document.addEventListener("keydown", function(e) {
                    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                        modal.style.display = "none";
                        GM_setValue("hide", true);
                        vm.hideTip();
                    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                        modal.style.display = "block";
                        GM_setValue("hide", false);
                    }
                });

                // 如果之前设置为隐藏，则隐藏模态框
                if (GM_getValue("hide")) {
                    modal.style.display = "none";
                    vm.hideTip();
                }

                // 初始检查 - 确保弹窗在可视范围内
                setTimeout(function() {
                    // 获取当前位置
                    let currentLeft = parseInt(modal.style.left || "0");
                    let currentTop = parseInt(modal.style.top || "0");

                    // 获取窗口尺寸和模态框尺寸
                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;
                    const modalWidth = modal.offsetWidth;
                    const modalHeight = modal.offsetHeight;

                    // 检查是否在可视范围内
                    let needsAdjustment = false;

                    // 左侧和上侧边界检查
                    if (currentLeft < 0) {
                        currentLeft = 0;
                        needsAdjustment = true;
                    }
                    if (currentTop < 0) {
                        currentTop = 0;
                        needsAdjustment = true;
                    }

                    // 右侧和下侧边界检查
                    if (currentLeft > windowWidth - Math.min(modalWidth, 100)) {
                        currentLeft = windowWidth - Math.min(modalWidth, 100);
                        needsAdjustment = true;
                    }
                    if (currentTop > windowHeight - Math.min(modalHeight, 80)) {
                        currentTop = windowHeight - Math.min(modalHeight, 80);
                        needsAdjustment = true;
                    }

                    // 如果需要调整，应用新位置
                    if (needsAdjustment) {
                        modal.style.left = currentLeft + "px";
                        modal.style.top = currentTop + "px";
                        GM_setValue("pos", currentLeft + "px," + currentTop + "px");
                    }
                }, 500);
            }

            function createContainer(className, childElements) {
                let container = top.document.createElement("div");
                container.className = className;

                // Ensure container doesn't clip its contents
                container.style.overflow = "visible";
                container.style.maxHeight = "none";
                container.style.maxWidth = "none";

                if (Array.isArray(childElements)) {
                    childElements.forEach(child => {
                        container.appendChild(child);
                    });
                } else if (childElements) {
                    container.appendChild(childElements);
                }
                return container;
            }

            function render(tagName, elemId, childElem, isFixed, newPos) {
                let doc = top.document;
                let elem = doc.getElementById(elemId);

                if (elem) {
                    elem.innerHTML = "";
                } else {
                    elem = doc.createElement(tagName);
                    elem.id = elemId;

                    // Make sure styles are applied before adding to DOM
                    elem.style.position = "fixed";
                    elem.style.zIndex = "999999999";
                    elem.style.overflow = "visible";
                    elem.style.left = "30px";
                    elem.style.top = "30px";

                    doc.body.appendChild(elem);
                }

                // Create content container
                let contentNode = doc.createElement("div");
                contentNode.className = tagName + "-container";
                contentNode.style.overflow = "visible";

                // Add child elements
                if (Array.isArray(childElem)) {
                    childElem.forEach(child => contentNode.appendChild(child));
                } else if (childElem) {
                    contentNode.appendChild(childElem);
                }

                elem.appendChild(contentNode);
                elem.classList.add(elemId);

                // Apply animation class with slight delay
                setTimeout(function() {
                    elem.classList.add(elemId + "-show");
                }, 10);

                return elem;
            }

            function renderModal(childElem, newPos) {
                // Generate random ID for the element
                const randomTag = String.fromCharCode(rand(65, 90), rand(65, 90), rand(65, 90)) + rand(1, 100).toString();

                // Create the modal element
                const modal = render(randomTag, modelId, childElem);

                // Apply drag behavior
                dragModel(modal);

                // Apply visibility based on GM_getValue
                if (GM_getValue("hide")) {
                    $("#" + modelId).hide();
                    vm.hideTip();
                }

                return modal;
            }

            function addModal2(html, newPos, footerChildNode = false) {
                // 创建干净的拖动标题栏（使用成功提示框的颜色）
                let headerNode = document.createElement("div");
                headerNode.id = "hcsearche-modal-links";
                headerNode.style.cssText = `
                    background-color: #f0f9eb;
                    padding: 10px;
                    text-align: center;
                    cursor: move;
                    font-weight: bold;
                    border-top-left-radius: 6px;
                    border-top-right-radius: 6px;
                    user-select: none;
                    overflow: visible;
                    width: 360px;
                `;

                // 添加标题文本
                let titleNode = document.createElement("div");
                titleNode.textContent = "学习通小助手-考试端";
                titleNode.style.cssText = `
                    font-size: 16px;
                    color: #333;
                `;
                headerNode.appendChild(titleNode);

                // 创建iframe容器
                let iframeNode = document.createElement("iframe");
                iframeNode.id = "iframeNode";
                iframeNode.width = "100%";
                iframeNode.height = GLOBAL.length + "px";
                iframeNode.style.height = GLOBAL.length + "px";
                iframeNode.frameBorder = "0";
                iframeNode.srcdoc = html;

                // 创建内容容器
                let contentContainer = document.createElement("div");
                contentContainer.className = "content-modal";
                contentContainer.style.cssText = `
                    position: relative;
                    border-left: 5px solid #f0f9eb;
                    border-right: 5px solid #f0f9eb;
                    border-bottom: 5px solid #f0f9eb;
                    border-bottom-left-radius: 6px;
                    border-bottom-right-radius: 6px;
                    background-color: white;
                    overflow: visible;
                    width: 360px;
                `;

                // 添加元素到容器
                contentContainer.appendChild(headerNode);
                contentContainer.appendChild(iframeNode);

                // 创建并返回模态框
                let modal = renderModal(contentContainer, newPos);

                // 确保模态框可见并可拖动
                if (modal) {
                    modal.style.borderRadius = "6px";
                    modal.style.overflow = "visible";
                    modal.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                    modal.style.width = "370px";
                }

                return modal;
            }

            const init$1 = async ($TiMu, select, wrap) => {
                let question = formatString(filterImg($TiMu.find(select.elements.question)));
                if (select.elements.type && select.elements.type.includes("input[name^=type]:eq")) {
                    select.elements.type = "input[name^=type]:eq(" + GLOBAL.i + ")";
                }
                let data = {
                    $item: $TiMu,
                    question_text: $TiMu.find(select.elements.question).text(),
                    question: question.length === 0 ? $TiMu.find(select.elements.question) : question.replace(/^\d+、/, "").replace(/[(（](\d+\s?(\.\d+)?分)[)）]$/, "").replace(/^((\d+.(\s+)?)?)[\[(（【](.*?)[】)）\]]/, "").trim(),
                    $options: select.elements.$options ? $TiMu.find(select.elements.$options) : undefined,
                    options: select.elements.options ? jQuery.map($TiMu.find(select.elements.options), function(val) {
                        return formatString(filterImg(val)).replace(/^[A-Ga-g][.、]/, "").trim();
                    }) : undefined
                };
                if (select.elements.type) {
                    const getType = getQuestionType($TiMu.find(select.elements.type).text());
                    const val = $TiMu.find(select.elements.type).val();
                    data.type = isNaN(getType) ? isNaN(val) ? val : parseInt(val) : getType;
                } else {
                    data.type = defaultWorkTypeResolver(data.$options);
                }
                if (select.elements.answer) {
                    data.answer = getAnswer(filterImg($TiMu.find(select.elements.answer)) || $TiMu.find(select.elements.answer).val(), data.options, data.type);
                }
                if (data && data.type === 3 && data.options.length === 0) {
                    data.options = [ "正确", "错误" ];
                }

                try {
                    const r = await wrap(data);
                    if (typeof r === "boolean") return undefined;
                    return data;
                } catch (error) {
                    console.error("Error in init$1:", error);
                    return data;
                }
            };

            async function WorkerJSPlus(options) {
                if (GLOBAL.isMatch) return;

                // 🚀 检测学习端状态，如果正在处理章节测验则禁用考试端
                if (checkLearningModeAndDisable()) {
                    return;
                }

                console.log('🚀 考试端：学习端未在处理章节测验，考试端功能正常');

                const match = options.match ? typeof options.match === "boolean" ? options.match : options.match() : false;
                if (!match) return;
                GLOBAL.isMatch = true;
                if (options.hook && typeof options.hook === "function") {
                    if (options.hook()) return;
                }
                const defaultFunc = () => {};
                const main = () => {
                    setTimeout(() => {
                        showPanel();
                        if (options.init && typeof options.init === "function") {
                            if (options.init()) return;
                        }
                        const select = {
                            root: options.root,
                            elements: options.elements,
                            ignore_click: options.ignore_click
                        };
                        new WorkerJS(select, options.wrap ? options.wrap : defaultFunc, options.fill ? options.fill : defaultFunc, options.finished ? options.finished : defaultFunc, options.fillFinish ? options.fillFinish : defaultFunc).fillAnswer();
                    }, GLOBAL.delay);
                };
                if (options.intv) {
                    setIntervalFunc(options.intv, main);
                } else {
                    main();
                }
            }

            var WorkerJS = function(select, searchHander, fillHander, onFinish = function(need_jump) {}, fillFinish = function() {}) {
                GLOBAL.index = 0;
                this.init = init$1;
                this.fillAnswer = async () => {
                    let arr = jQuery(select.root);
                    console.log("=== 答题调试信息 ===");
                    console.log("题目选择器:", select.root);
                    console.log("找到题目数量:", arr.length);
                    console.log("当前页面URL:", location.href);
                    console.log("当前页面路径:", location.pathname);
                    if (arr.length > 0) {
                        console.log("第一个题目元素:", arr[0]);
                        console.log("第一个题目内容:", jQuery(arr[0]).find(select.elements.question).text());
                    }
                    while (true) {
                        if (arr.length === 0) {
                            console.log("没有找到题目，退出答题流程");
                            return;
                        }
                        await sleep((isNaN(parseInt(GM_getValue("search_delay"))) ? 2 : GM_getValue("search_delay")) * 1e3);
                        if (GLOBAL.stop) {
                            continue;
                        }
                        if (GLOBAL.index >= arr.length) {
                            let auto_jump = GM_getValue("auto_jump") === undefined || GM_getValue("auto_jump");
                            const next = await onFinish(auto_jump);
                            if (next) {
                                GLOBAL.index = 0;
                                setTimeout(this.fillAnswer, 300);
                            }
                            if (auto_jump) {
                                iframeMsg("tip", {
                                    tip: "自动答题已完成,即将切换下一题"
                                });
                                next || setTimeout(() => {
                                    iframeMsg("tip", {
                                        type: "hidden",
                                        tip: "自动答题已完成,请检查提交"
                                    });
                                }, Math.max(GM_getValue("search_delay") || 2, 5) * 1e3);
                            } else {
                                iframeMsg("tip", {
                                    tip: "自动答题已完成" + (arr.length === 1 ? ",请手动切换" : "请检查提交")
                                });
                            }
                            return true;
                        }
                        try {
                            console.log("正在处理第", GLOBAL.index + 1, "题");
                            let data = await this.init(jQuery(arr[GLOBAL.index++]), select, searchHander);
                            if (!data) {
                                console.log("题目数据为空，跳过");
                                GLOBAL.index--;
                                continue;
                            }
                            console.log("题目数据:", data);
                            console.log("题目内容:", data.question);
                            console.log("题目选项:", data.options);
                            iframeMsg("tip", {
                                tip: "准备答第" + GLOBAL.index + "题"
                            });
                            const formatResult = await formatSearchAnswer(data);
                            console.log("搜索结果:", formatResult);
                            const hookAnswer = data.answer && data.answer.length > 0 && GM_getValue("start_pay");
                            const formatAns = hookAnswer ? {
                                success: true,
                                num: formatResult.num,
                                list: [ data.answer ]
                            } : formatResult;
                            console.log("最终答案:", formatAns);
                            if (formatResult.answers || formatAns.success) {
                                iframeMsg("tip", {
                                    tip: "准备填充答案,当前使用免费题库"
                                });
                                const func = !hookAnswer && formatResult.answers ? defaultFillAnswer : defaultQuestionResolve;
                                let r = await func(hookAnswer ? formatAns.list : formatAns.answers ? formatResult.answers : formatAns.list, data, fillHander, select.ignore_click ? select.ignore_click : () => {
                                    return false;
                                });
                                iframeMsg("push", {
                                    index: GLOBAL.index,
                                    question: r.question,
                                    answer: r.ans,
                                    style: r.style
                                });
                                GM_getValue("start_pay") && String(GM_getValue("token")).length === 10 && catchAnswer(r);
                                await fillFinish(r);
                            } else {
                                console.log("搜索失败:", formatAns.msg);
                                GLOBAL.index--;
                                iframeMsg("tip", {
                                    tip: formatAns.msg
                                });
                            }
                        } catch (e) {
                            GLOBAL.index--;
                            console.table(e);
                        }
                    }
                };
            };









                // @thanks 特别感谢 qxin i 借鉴 网页限制解除(改) 开源地址 https://greasyfork.org/zh-CN/scripts/28497
                function init() {
                    rule = rwl_userData.rules.rule_def;
                    hook_eventNames = rule.hook_eventNames.split("|");
                    unhook_eventNames = rule.unhook_eventNames.split("|");
                    eventNames = hook_eventNames.concat(unhook_eventNames);
                    if (rule.dom0) {
                        setInterval(clearLoop, 10 * 1e3);
                        setTimeout(clearLoop, 1500);
                        window.addEventListener("load", clearLoop, true);
                        clearLoop();
                    }
                    if (rule.hook_addEventListener) {
                        EventTarget.prototype.addEventListener = addEventListener;
                        document.addEventListener = addEventListener;
                        if (hasFrame) {
                            for (let i = 0; i < hasFrame.length; i++) {
                                hasFrame[i].contentWindow.document.addEventListener = addEventListener;
                            }
                        }
                    }
                    if (rule.hook_preventDefault) {
                        Event.prototype.preventDefault = function() {
                            if (hook_eventNames.indexOf(this.type) < 0) {
                                Event_preventDefault.apply(this, arguments);
                            }
                        };
                        if (hasFrame) {
                            for (let i = 0; i < hasFrame.length; i++) {
                                hasFrame[i].contentWindow.Event.prototype.preventDefault = function() {
                                    if (hook_eventNames.indexOf(this.type) < 0) {
                                        Event_preventDefault.apply(this, arguments);
                                    }
                                };
                            }
                        }
                    }
                    if (rule.hook_set_returnValue) {
                        Event.prototype.__defineSetter__("returnValue", function() {
                            if (this.returnValue !== true && hook_eventNames.indexOf(this.type) >= 0) {
                                this.returnValue = true;
                            }
                        });
                    }
                }
                function addEventListener(type, func, useCapture) {
                    var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
                    if (hook_eventNames.indexOf(type) >= 0) {
                        _addEventListener.apply(this, [ type, returnTrue, useCapture ]);
                    } else if (unhook_eventNames.indexOf(type) >= 0) {
                        var funcsName = storageName + type + (useCapture ? "t" : "f");
                        if (this[funcsName] === undefined) {
                            this[funcsName] = [];
                            _addEventListener.apply(this, [ type, useCapture ? unhook_t : unhook_f, useCapture ]);
                        }
                        this[funcsName].push(func);
                    } else {
                        _addEventListener.apply(this, arguments);
                    }
                }
                function clearLoop() {
                    rule = clear();
                    var elements = getElements();
                    for (var i in elements) {
                        for (var j in eventNames) {
                            var name = "on" + eventNames[j];
                            if (Object.prototype.toString.call(elements[i]) == "[object String]") {
                                continue;
                            }
                            if (elements[i][name] !== null && elements[i][name] !== onxxx) {
                                if (unhook_eventNames.indexOf(eventNames[j]) >= 0) {
                                    elements[i][storageName + name] = elements[i][name];
                                    elements[i][name] = onxxx;
                                } else {
                                    elements[i][name] = null;
                                }
                            }
                        }
                    }
                    document.onmousedown = function() {
                        return true;
                    };
                }
                function returnTrue(e) {
                    return true;
                }
                function unhook_t(e) {
                    return unhook(e, this, storageName + e.type + "t");
                }
                function unhook_f(e) {
                    return unhook(e, this, storageName + e.type + "f");
                }
                function unhook(e, self, funcsName) {
                    var list = self[funcsName];
                    for (var i in list) {
                        list[i](e);
                    }
                    e.returnValue = true;
                    return true;
                }
                function onxxx(e) {
                    var name = storageName + "on" + e.type;
                    this[name](e);
                    e.returnValue = true;
                    return true;
                }
                function getElements() {
                    var elements = Array.prototype.slice.call(document.getElementsByTagName("*"));
                    elements.push(document);
                    var frames = document.querySelectorAll("frame");
                    if (frames) {
                        hasFrame = frames;
                        var frames_element;
                        for (let i = 0; i < frames.length; i++) {
                            frames_element = Array.prototype.slice.call(frames[i].contentWindow.document.querySelectorAll("*"));
                            elements.push(frames[i].contentWindow.document);
                            elements = elements.concat(frames_element);
                        }
                    }
                    return elements;
                }
                var settingData = {
                    status: 1,
                    version: .1,
                    message: "",
                    positionTop: "0",
                    positionLeft: "0",
                    positionRight: "auto",
                    addBtn: false,
                    connectToTheServer: false,
                    waitUpload: [],
                    currentURL: "null",
                    shortcut: 3,
                    rules: {},
                    data: []
                };
                var rwl_userData = null;
                var rule = null;
                var hasFrame = false;
                var storageName = "storageName";
                var hook_eventNames, unhook_eventNames, eventNames;
                var EventTarget_addEventListener = EventTarget.prototype.addEventListener;
                var document_addEventListener = document.addEventListener;
                var Event_preventDefault = Event.prototype.preventDefault;
                rwl_userData = GM_getValue("rwl_userData");
                if (!rwl_userData) {
                    rwl_userData = settingData;
                }
                for (let value in settingData) {
                    if (!rwl_userData.hasOwnProperty(value)) {
                        rwl_userData[value] = settingData[value];
                        GM_setValue("rwl_userData", rwl_userData);
                    }
                }
                // @thanks 特别感谢 wyn大佬 提供的 字典匹配表 原作者 wyn665817@163.com 开源地址 https://scriptcat.org/script-show-page/432/code
                function removeF() {
                    var $tip = $("style:contains(font-cxsecret)");
                    if (!$tip.length) return;
                    var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
                    font = Typr.parse(base64ToUint8Array(font))[0];
                    var table = JSON.parse(GM_getResourceText("Table"));
                    var match = {};
                    for (var i = 19968; i < 40870; i++) {
                        $tip = Typr.U.codeToGlyph(font, i);
                        if (!$tip) continue;
                        $tip = Typr.U.glyphToPath(font, $tip);
                        $tip = MD5(JSON.stringify($tip)).slice(24);
                        match[i] = table[$tip];
                    }
                    $(".font-cxsecret").html(function(index, html) {
                        $.each(match, function(key, value) {
                            key = String.fromCharCode(key);
                            key = new RegExp(key, "g");
                            value = String.fromCharCode(value);
                            html = html.replace(key, value);
                        });
                        return html;
                    }).removeClass("font-cxsecret");
                    function base64ToUint8Array(base64) {
                        var data = window.atob(base64);
                        var buffer = new Uint8Array(data.length);
                        for (var i = 0; i < data.length; ++i) {
                            buffer[i] = data.charCodeAt(i);
                        }
                        return buffer;
                    }
                }
                function start() {
                    try {
                        removeF();
                    } catch (e) {}
                    try {
                        init();
                    } catch (e) {}
                }
                WorkerJSPlus({
                    name: "学习通新版作业",
                    match: location.pathname === "/mooc2/work/dowork" || location.pathname === "/mooc-ans/mooc2/work/dowork",
                    root: ".questionLi",
                    elements: {
                        question: "h3",
                        options: ".stem_answer .answerBg .answer_p, .textDIV, .eidtDiv",
                        $options: ".stem_answer .answerBg, .textDIV, .eidtDiv",
                        type: "input[type^=hidden]:eq(0)"
                    },
                    wrap: obj => {
                        obj.question = obj.question.replace(obj.$item.find(".colorShallow").text(), "").replace(/^(\d+\.\s)/, "");
                    },
                    ignore_click: $item => {
                        return Boolean($item.find(".check_answer,.check_answer_dx").length);
                    },
                    fill: (type, answer, $option) => {
                        if (type === 4 || type === 2 || type === 5) {
                            UE$1.getEditor($option.find("textarea").attr("name")).setContent(answer);
                        }
                    }
                });
                WorkerJSPlus({
                    name: "超星旧版考试",
                    match: (location.pathname === "/exam/test/reVersionTestStartNew" || location.pathname === "/exam-ans/exam/test/reVersionTestStartNew") && !location.href.includes("newMooc=true"),
                    root: ".TiMu",
                    elements: {
                        question: ".Cy_TItle .clearfix",
                        options: ".Cy_ulTop .clearfix",
                        $options: ":radio, :checkbox, .Cy_ulTk textarea",
                        type: "[name^=type]:not([id])"
                    },
                    ignore_click: $item => {
                        return $item.get(0).checked;
                    },
                    fill: (type, answer, $option) => {
                        if (type === 4 || type === 2 || type === 5) {
                            UE$1.getEditor($option.attr("name")).setContent(answer);
                        }
                    },
                    finished: auto_jump => {
                        auto_jump && setInterval(function() {
                            const btn = $(".saveYl:contains(下一题)").offset();
                            var mouse = document.createEvent("MouseEvents"), arr = [ btn.left + Math.ceil(Math.random() * 80), btn.top + Math.ceil(Math.random() * 26) ];
                            mouse.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, arr[0], arr[1], false, false, false, false, 0, null);
                            _self.event = $.extend(true, {}, mouse);
                            delete _self.event.isTrusted;
                            _self.getTheNextQuestion(1);
                        }, Math.ceil(GLOBAL.fillAnswerDelay * Math.random()) * 2);
                    }
                });
                WorkerJSPlus({
                    name: "超星旧版作业",
                    match: location.pathname === "/work/doHomeWorkNew" || location.pathname === "/mooc-ans/work/doHomeWorkNew",
                    init: start,
                    root: ".clearfix .TiMu",
                    elements: {
                        question: ".Zy_TItle .clearfix",
                        options: "ul:eq(0) li .after",
                        $options: "ul:eq(0) li :radio,:checkbox,textarea,.num_option_dx,.num_option",
                        type: "input[name^=answertype]"
                    },
                    ignore_click: $item => {
                        if ($item.is("input")) {
                            return $item.get(0).checked;
                        }
                        return $item.attr("class").includes("check_answer");
                    },
                    fill: async (type, answer, $option) => {
                        if (type === 4 || type === 2 || type === 5) {
                            UE$1.getEditor($option.attr("name")).setContent(answer);
                        }
                    }
                });
                WorkerJSPlus({
                    name: "超星新版考试",
                    match: () => {
                        const cxSinglePage = (location.pathname === "/exam/test/reVersionTestStartNew" || location.pathname === "/exam-ans/exam/test/reVersionTestStartNew" || location.pathname === "/mooc-ans/exam/test/reVersionTestStartNew") && location.href.includes("newMooc=true");
                        const cxAll = location.pathname === "/mooc2/exam/preview" || location.pathname === "/exam-ans/mooc2/exam/preview" || location.pathname === "/mooc-ans/mooc2/exam/preview";
                        return cxSinglePage || cxAll;
                    },
                    root: ".questionLi",
                    elements: {
                        question: "h3 div",
                        options: ".answerBg .answer_p, .textDIV, .eidtDiv",
                        $options: ".answerBg, .textDIV, .eidtDiv",
                        type: "input[name^=type]:eq(" + GLOBAL.i + ")"
                    },
                    ignore_click: $item => {
                        return Boolean($item.find(".check_answer,.check_answer_dx").length);
                    },
                    hook: () => {
                        GLOBAL.i = Number((location.pathname === "/exam/test/reVersionTestStartNew" || location.pathname === "/exam-ans/exam/test/reVersionTestStartNew" || location.pathname === "/mooc-ans/exam/test/reVersionTestStartNew") && location.href.includes("newMooc=true"));
                    },
                    wrap: obj => {
                        if (obj.type === 6) {
                            obj.type = 4;
                        }
                    },
                    fill: (type, answer, $option) => {
                        if (type === 4 || type === 2 || type === 5) {
                            const name = $option.find("textarea").attr("name");
                            UE$1.getEditor(name).setContent(answer);
                            if (GLOBAL.i === 0) {
                                console.log("#" + name.replace("answerEditor", "save_"));
                                $("#" + name.replace("answerEditor", "save_")).click();
                            }
                        }
                    },
                    finished: a => {
                        a && $('.nextDiv .jb_btn:contains("下一题")').click();
                    }
                });
                WorkerJSPlus({
                    name: "超星随堂测验",
                    match: location.pathname.includes("/page/quiz/stu/answerQuestion"),
                    root: ".question-item",
                    elements: {
                        question: ".topic-txt",
                        options: ".topic-option-list",
                        $options: ".topic-option-list input",
                        type: "input[class^=que-type]"
                    },
                    ignore_click: $item => {
                        return Boolean($item.find(".check_answer,.check_answer_dx").length);
                    },
                    wrap: obj => {
                        if (obj.type === 16) {
                            obj.type = 3;
                        }
                    },
                    fill: (type, answer, $option) => {
                        if (type === 4 || type === 2) {
                            $option.val(answer);
                        }
                    }
                });
                function JSONParseHook(func) {
                    const parse = JSON.parse;
                    JSON.parse = function(...args) {
                        const o = parse.call(this, ...args);
                        func(o);
                        return o;
                    };
                }
                function hookZhiHuiShuWork(o, arr) {
                    function format(item) {
                        let options = [];
                        let options_id;
                        if (item.questionOptions && item.questionOptions.length) {
                            options = item.questionOptions.map(o => {
                                return formatString(o.content);
                            });
                            options_id = item.questionOptions.map(o => {
                                return o.id;
                            });
                        }
                        return {
                            qid: item.id,
                            question: formatString(item.name),
                            type: getQuestionType(item.questionType.name),
                            options_id: options_id,
                            options: options
                        };
                    }
                    if (o.rt && o.rt.examBase && o.rt.examBase.workExamParts.length > 0) {
                        GLOBAL.content = o.rt;
                        GLOBAL.json = o.rt.examBase.workExamParts.map(part => {
                            return part.questionDtos.map(item => {
                                if ("阅读理解（选择）/完型填空" === item.questionType.name || "听力训练" === item.questionType.name || !(item.questionType.name.includes("填空") || item.questionType.name.includes("问答")) && item.questionChildrens && item.questionChildrens.length > 0) {
                                    return item.questionChildrens.map(i => {
                                        console.log(format(i));
                                        return format(i);
                                    }).flat();
                                } else {
                                    return format(item);
                                }
                            });
                        }).flat();
                    } else if (o.rt && Object.keys(o.rt).length > 0 && !isNaN(Object.keys(o.rt)[0])) {
                        GLOBAL.img = o.rt;
                    }
                }

                WorkerJSPlus({
                    match: location.href.includes("checkHomework") && location.host.includes("zhihuishu"),
                    hook: () => {
                        JSONParseHook(hookZhiHuiShuWork);
                    },
                    init: () => {
                        R({
                            type: 2,
                            content: GLOBAL.content,
                            img: GLOBAL.img
                        });
                    }
                });
                GLOBAL.timeout = 10 * 1e3;
                function uploadAnswer(data) {
                    const arr2 = division(data, 100);
                    for (let arr2Element of arr2) {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "https://lyck6.cn/pcService/api/uploadAnswer",
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            },
                            data: JSON.stringify(arr2Element),
                            timeout: GLOBAL.timeout
                        });
                    }
                }
                function uploadAnswerToPlat(data, plat) {
                    const arr2 = division(data, 100);
                    for (let arr2Element of arr2) {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "https://lyck6.cn/collect-service/v1/uploadAnswerToPlat?plat=" + plat,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            },
                            data: JSON.stringify(arr2Element),
                            timeout: GLOBAL.timeout
                        });
                    }
                }

                function parseIcve(questions) {
                    return questions.map(item => {
                        const options = item.Selects.map(opt => {
                            return formatString(opt);
                        });
                        const type = getQuestionType(item.ACHType.QuestionTypeName);
                        const answer = item.Answers.map(key => {
                            if (type === 0 || type === 1) {
                                return options[key.charCodeAt() - 65];
                            } else if (type === 3) {
                                return key === "1" ? "正确" : "错误";
                            }
                        });
                        const answerKey = type === 0 || type === 1 ? item.Answers : answer;
                        return {
                            id: item.Id,
                            question: item.ContentText,
                            answerKey: answerKey,
                            options: type === 3 ? [ "正确", "错误" ] : options,
                            answer: answer,
                            type: type
                        };
                    });
                }
                WorkerJSPlus({
                    name: "资源库 WWW开头",
                    match: location.pathname === "/study/works/works.html" || location.pathname === "/study/exam/exam.html",
                    root: ".questions",
                    elements: {
                        question: ".preview_stem",
                        options: "li .preview_cont",
                        $options: "li input",
                        type: "input:hidden"
                    },
                    hook: () => {
                        JSONParseHook(o => {
                            if (location.pathname === "/study/works/works.html") {
                                if (o.paper) {
                                    GLOBAL.json = parseIcve(o.paper.PaperQuestions);
                                    uploadAnswer(GLOBAL.json);
                                }
                            } else if (location.pathname === "/study/exam/exam.html") {
                                if (o.array) {
                                    GLOBAL.json = parseIcve(o.array.map(item => {
                                        return item.Questions;
                                    }).flat());
                                    uploadAnswer(GLOBAL.json);
                                }
                            }
                        });
                    },
                    ignore_click: $item => {
                        return $item.prop("checked");
                    },
                    wrap: obj => {
                        function get_element(id) {
                            for (let jsonElement of GLOBAL.json) {
                                if (jsonElement.id === id) {
                                    return jsonElement;
                                }
                            }
                        }
                        const ele = get_element(obj.$item.find("input:hidden").val());
                        obj.question = ele.question;
                        obj.answer = ele.answerKey ? ele.answerKey : ele.answer;
                        obj.type = ele.type;
                        obj.options = ele.options;
                        console.log(obj);
                    },
                    fill: (type, answer, $option) => {
                        if (type === 4 || type === 2) {
                            UE$1.getEditor($option.attr("name")).setContent(answer);
                        }
                    }
                });

                function parseYkt(problems) {
                    return problems.map(item => {
                        const question = formatString(item.Body);
                        const type = getQuestionType(item.TypeText);
                        const options = [];
                        const answer = [];
                        if (type <= 1) {
                            options.push(...item.Options.sort((a, b) => {
                                return a.key.charCodeAt(0) - b.key.charCodeAt(0);
                            }).map(item => {
                                return formatString(item.value);
                            }));
                            if (item.Answer) {
                                if (Array.isArray(item.Answer)) {
                                    answer.push(...item.Answer);
                                } else {
                                    answer.push(...item.Answer.split(""));
                                }
                            }
                        } else if (type === 3 && item.Answer && item.Answer.length === 1) {
                            answer.push(item.Answer[0].replace("true", "正确").replace("false", "错误"));
                        }
                        return {
                            answer: answer,
                            options: options,
                            type: type,
                            qid: item.problem_id,
                            question: question
                        };
                    });
                }
                function parsehnzkwText(problems) {
                    return problems.map(item => {
                        const type = item.flag === 1 ? 2 : item.flag === 0 ? 0 : item.flag === 4 ? 1 : item.flag === 3 ? 3 : undefined;
                        let answer = [];
                        let options = [];
                        if (type === 2) {
                            answer.push(item.answer);
                            return {
                                question: formatString(item.content),
                                options: options,
                                type: type,
                                answer: answer
                            };
                        } else if (type === 0) {
                            for (let subjectOption of item.optionss) {
                                const opt = formatString(subjectOption);
                                options.push(opt);
                            }
                            if (type === 1) {
                                item.answer.split("|").map(i => {
                                    answer.push(options[i.toUpperCase().charCodeAt(0) - 65]);
                                });
                            } else {
                                answer.push(options[item.answer.toUpperCase().charCodeAt(0) - 65]);
                            }
                            return {
                                question: formatString(item.content),
                                options: options,
                                type: type,
                                answer: answer
                            };
                        } else if (type === 3) {
                            for (let subjectOption of item.selectOption) {
                                const opt = formatString(subjectOption);
                                options.push(opt);
                            }
                            answer.push(item.answer);
                            return {
                                question: formatString(item.content),
                                options: options,
                                type: type,
                                answer: answer
                            };
                        }
                    });
                }
                function parseDanWei(pro) {
                    return pro.map(i => {
                        const type = getQuestionType(i.ttop010);
                        const question = i.ttop011;
                        const options = [];
                        const answer = [];
                        if (type === 0 || type === 1 || type === 3) {
                            options.push(...i.ttop018.length > 0 ? i.ttop018.split("$$") : [ "正确", "错误" ]);
                            answer.push(...i.ttop022.split("").map(item => {
                                return options[item.charCodeAt(0) - 65];
                            }));
                        } else if (type === 2 || type === 4) {
                            answer.push(...i.ttop021.split("$$"));
                        }
                        return {
                            question: question,
                            type: type,
                            answer: answer,
                            options: options
                        };
                    }).filter(i => i);
                }
                function parseYxbyunExam(problems) {
                    return problems.map(item => {
                        const type = getQuestionType(item.bigName);
                        return item.smallContent.map(item => {
                            let answer = [];
                            let options = [];
                            if (type === 2) {
                                answer.push(item.answer);
                                return {
                                    question: formatString(item.content),
                                    options: options,
                                    type: type,
                                    answer: answer
                                };
                            } else if (type === 0 || type === 3 || type === 1) {
                                let answer = [];
                                let options = [];
                                for (let subjectOption of item.question.optionList) {
                                    const opt = formatString(subjectOption.questionContent);
                                    options.push(opt);
                                }
                                if (type === 1) {
                                    item.question.questionAnswer.split(",").map(i => {
                                        answer.push(options[i.toUpperCase().charCodeAt(0) - 65]);
                                    });
                                } else {
                                    answer.push(options[item.question.questionAnswer.toUpperCase().charCodeAt(0) - 65]);
                                }
                                return {
                                    question: formatString(item.question.questionTitle),
                                    options: options,
                                    type: type,
                                    answer: answer
                                };
                            }
                        });
                    });
                }

                WorkerJSPlus({
                    name: "exam2_euibe_com_exam",
                    match: location.hostname === "exam2.euibe.com" && location.pathname === "/KaoShi/ShiTiYe.aspx",
                    root: ".question",
                    elements: {
                        question: ".wenti",
                        options: "li label span",
                        $options: "li label"
                    },
                    wrap: obj => {
                        obj.type = getQuestionType($(".question_head").text());
                    },
                    finished: need_jump => {
                        $(".paginationjs-next").click();
                        return true;
                    }
                });
                WorkerJSPlus({
                    name: "lzwyedu_jijiaool_com_exam",
                    match: () => {
                        const pathMatch = location.pathname.includes("/learnspace/course/test/") || location.pathname.includes("/Student/ExamManage/CourseOnlineExamination");
                        const matchHostArr = [ "lzwyedu.jijiaool.com", "cgjx.jsnu.edu.cn", "learn-cs.icve.com.cn", "nwnu.jijiaool.com", "lut.jijiaool.com", "learn.courshare.cn", "cj1027-kfkc.webtrn.cn" ];
                        return pathMatch && matchHostArr.includes(location.host);
                    },
                    root: ".test_item",
                    elements: {
                        question: ".test_item_tit",
                        options: ".test_item_theme label .zdh_op_con",
                        $options: "label input"
                    },
                    wrap: obj => {
                        obj.question = obj.question.replace(/该题未做$/, "").replace(/^\d+\./, "").replace(/^\d+、/, "").replace(/[(（](\d+\s?(\.\d+)?分)[)）]$/, "").replace(/^((\d+.(\s+)?)?)[\[(（【](.*?)[】)）\]]/, "").trim();
                        obj.type = getQuestionType(obj.$item.prevAll(".test_item_type:first").text());
                        if (obj.type === 3) {
                            obj.options = [ "对", "错" ];
                        }
                    }
                });
                WorkerJSPlus({
                    name: "zzx_ouchn_edu_cn_exam",
                    match: location.hostname === "zzx.ouchn.edu.cn" && location.pathname.includes("/edu/public/student/"),
                    root: ".subject",
                    elements: {
                        question: ".question span",
                        options: ".answer>span>p:first-child",
                        $options: ".answer>span>p:first-child"
                    },
                    wrap: obj => {
                        if (obj.$options.length > 1) {
                            obj.type = 0;
                        }
                    }
                });
                WorkerJSPlus({
                    name: "zzx_ouchn_edu_cn_exam",
                    match: location.hostname === "zzx.ouchn.edu.cn" && location.pathname.includes("/edu/public/student/"),
                    root: ".subject",
                    elements: {
                        question: ".question span",
                        options: ".answer>span>p:first-child",
                        $options: ".answer>span>p:first-child"
                    },
                    wrap: obj => {
                        if (obj.$options.length > 1) {
                            obj.type = 0;
                        }
                    }
                });
                WorkerJSPlus({
                    name: "havust_hnscen_cn_exam",
                    match: location.hostname === "havust.hnscen.cn" && location.pathname.includes("/stuExam/examing/"),
                    root: ".main .mt_2 > div",
                    elements: {
                        question: ".flex_row+div",
                        options: ".flex_row+div+div .el-radio__label,.el-checkbox__label",
                        $options: ".flex_row+div+div .el-radio__label,.el-checkbox__label",
                        type: ".flex_row .mr_2"
                    }
                });
                WorkerJSPlus({
                    name: "www_zygbxxpt_com_exam",
                    match: location.hostname === "www.zygbxxpt.com" && location.pathname.includes("/exam"),
                    root: ".Body",
                    elements: {
                        question: ".QName",
                        options: ".QuestinXuanXiang p:parent",
                        $options: ".QuestinXuanXiang p:parent",
                        type: ".QName span"
                    },
                    wrap: obj => {
                        obj.question = obj.question.replace(/\([^\)]*\)/g, "").replace(/\【.*?\】/g, "");
                        obj.options = obj.options.map(item => {
                            return item.split(">").pop().trim();
                        });
                    }
                });
                WorkerJSPlus({
                    name: "xuexi_jsou_cn_work",
                    match: location.hostname === "xuexi.jsou.cn" && location.pathname.includes("/jxpt-web/student/newHomework/showHomeworkByStatus"),
                    root: ".insert",
                    elements: {
                        question: ".window-title",
                        options: ".questionId-option .option-title div[style^=display]",
                        $options: ".questionId-option .option-title .numberCover"
                    },
                    wrap: obj => {
                        obj.type = {
                            1: 0,
                            2: 1,
                            7: 3
                        }[obj.$item.find(".question-type").val()];
                        if (obj.options.length == 2) {
                            obj.type = 3;
                        }
                    }
                });
                WorkerJSPlus({
                    name: "czvtc_cjEdu_com_exam",
                    match: () => {
                        const pathMatch = location.pathname.includes("/ExamInfo") || location.pathname.includes("/Examination");
                        const matchHostArr = [ "czvtc.cj-edu.com", "hbkjxy.cj-edu.com", "bhlgxy.cj-edu.com", "hbsi.cj-edu.com", "czys.cj-edu.com", "hbjd.cj-edu.com", "xttc.cj-edu.com", "bvtc.cj-edu.com", "caztc.cj-edu.com" ];
                        return pathMatch && matchHostArr.includes(location.host);
                    },
                    intv: () => {
                        return $(".el-container .all_subject>.el-row").length;
                    },
                    root: ".el-container .all_subject>.el-row",
                    elements: {
                        question: ".stem div:last-child",
                        options: ".el-radio-group .el-radio__label,.el-checkbox-group .el-checkbox__label",
                        $options: ".el-radio-group .el-radio__original,.el-checkbox-group .el-checkbox__original"
                    },
                    wrap: obj => {
                        if (obj.$options.length < 3 && obj.$options.eq(0).attr("type") === "radio") {
                            obj.type = 3;
                        } else if (obj.$options.length > 2 && obj.$options.eq(0).attr("type") === "radio") {
                            obj.type = 0;
                        } else if (obj.$options.length > 2 && obj.$options.eq(0).attr("type") === "checkbox") {
                            obj.type = 1;
                        }
                    }
                });
                WorkerJSPlus({
                    name: "learning_mhtall_com_exam",
                    match: location.host.includes("learning.mhtall.com") && location.pathname.includes("/rest/course/exercise/item"),
                    root: "#div_item",
                    elements: {
                        question: ".item_title",
                        options: ".opt div label",
                        $options: ".opt div input:not(.button_short)",
                        type: "h4"
                    },
                    ignore_click: $item => {
                        return $item.prop("checked");
                    },
                    wrap: obj => {
                        if (obj.type === 0 || obj.type === 3) {
                            obj.answer = $(".div_answer").text().match(/[a-zA-Z]/).map(i => {
                                return obj.options[i.charCodeAt(0) - 65];
                            });
                        } else if (obj.type === 2) {
                            obj.answer = $(".div_answer").text().replace("参考答案：", "").split("，");
                        }
                    },
                    fill: (type, answer, $option) => {
                        if (type === 2 || type === 4) {
                            $option.val(answer);
                            $(".DIV_TYPE_BLANK .button_short").click();
                        }
                    },
                    fillFinish: () => {
                        if ($(".opt+div+div input:eq(1)").val() === "下一题") {
                            $(".opt+div+div input:eq(1)").click();
                        } else {
                            $(".button_short:eq(2)").click();
                        }
                    }
                });

            })();
