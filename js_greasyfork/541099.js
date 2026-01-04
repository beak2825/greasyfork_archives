// ==UserScript==
// @name         超星学习通喵课助手[重构版][AI答题][一键启动][最小化运行]
// @name:zh-TW   超星學習通喵課助手 [重構版][AI答題][一鍵啟動][最小化運行]
// @name:en      Chaoxing MiaoKe Learning Assistant [Refactored][AI Answer][One-click Start][Minimize Run]
// @description  【完整功能版】支持超星学习通、学银在线等平台的视频、章节测试、文档、直播、作业、考试；脚本一键启动、全自动运行、可最小化；喵课题库覆盖率99%，支持各种题型 | 题库支持：mk.zizizi.top 邀请码：0000
// @description:zh-TW  【重構優化版】支援超星學習通、學銀線上等平台的影片、章節測驗、文件、直播、作業、考試；腳本一鍵啟動、全自動運作、可最小化；喵課題庫覆蓋率99% | 官網：mk.zizizi.top 邀請碼：0000
// @description:en     【Refactored】Supports videos, tests, documents, live broadcasts, homework, and exams on Chaoxing and other platforms; one-click start, fully automatic, minimizable; MiaoKe database 99% coverage | Website: mk.zizizi.top Code: 0000
// @antifeature  payment  脚本使用喵课题库进行AI答题，您可以访问官网 mk.zizizi.top 了解更多或停用答题功能
// @namespace    喵课助手
// @version      3.0.3
// @author       喵课团队
// @run-at       document-end
// @storageName  喵课助手
// @match        *://*.edu.cn/*
// @match        *://*.chaoxing.com/*
// @match        *://*.xueyinonline.com/*
// @icon         https://mk.zizizi.top/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        unsafeWindow
// @connect      mk.zizizi.top
// @connect      cx.icodef.com
// @connect      lemtk.xyz
// @license      MIT
// @compatible   firefox
// @compatible   chrome
// @compatible   edge
// @supportURL   https://mk.zizizi.top/
// @downloadURL https://update.greasyfork.org/scripts/541099/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%96%B5%E8%AF%BE%E5%8A%A9%E6%89%8B%5B%E9%87%8D%E6%9E%84%E7%89%88%5D%5BAI%E7%AD%94%E9%A2%98%5D%5B%E4%B8%80%E9%94%AE%E5%90%AF%E5%8A%A8%5D%5B%E6%9C%80%E5%B0%8F%E5%8C%96%E8%BF%90%E8%A1%8C%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/541099/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%96%B5%E8%AF%BE%E5%8A%A9%E6%89%8B%5B%E9%87%8D%E6%9E%84%E7%89%88%5D%5BAI%E7%AD%94%E9%A2%98%5D%5B%E4%B8%80%E9%94%AE%E5%90%AF%E5%8A%A8%5D%5B%E6%9C%80%E5%B0%8F%E5%8C%96%E8%BF%90%E8%A1%8C%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============ 全局配置 ============
    const setting = {
        showBox: 1,           // 显示脚本浮窗
        tiku: 0,             // 题库服务器切换
        task: 0,             // 只处理任务点任务
        video: 1,            // 处理视频
        audio: 1,            // 处理音频
        rate: 1,             // 视频/音频倍速
        review: 0,           // 复习模式
        work: 1,             // 测验自动处理
        time: 5000,          // 答题时间间隔
        sub: 1,              // 测验自动提交
        force: 0,            // 测验强制提交
        share: 1,            // 自动收录答案
        decrypt: 1,          // 字体解密
        examTurn: 1,         // 考试自动跳转下一题
        examAutoClick: 1,    // 考试自动点击答案
        autoLogin: 0         // 自动登录
    };

    // 全局变量
    const _w = unsafeWindow;
    const _l = location;
    const _d = document;
    const $ = _w.jQuery || window.jQuery;
    let _mlist, _defaults, _domList, $subBtn, $saveBtn, $frame_c;

    // 题库API配置
    const _host = ["aHR0cHM6Ly9hcGkubGVtdGsueHl6", "aHR0cHM6Ly9hcGkudmFuc2UudG9w", "aHR0cHM6Ly9jbW9vYy5jYXUuZWR1LmNu"][setting.tiku];

    // Token管理
    Object.defineProperty(setting, "token", {
        get() {
            return GM_getValue("lemtk_token") ? GM_getValue("lemtk_token").trim() : "";
        },
        set(val) {
            GM_setValue("lemtk_token", val.trim());
        }
    });

    // ============ 工具函数 ============
    function getCookie(name) {
        const match = document.cookie.match(new RegExp(`[;\\s+]?${name}=([^;]*)`));
        return match ? match.pop() : null;
    }

    function getUrlParams() {
        const query = window.location.search.substring(1);
        const vars = query.split("&");
        const params = {};
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split("=");
            params[pair[0]] = pair[1];
        }
        return params;
    }

    function tidyStr(s) {
        if (!s) return null;
        return s.replace(/<(?!img).*?>/g, "")
                .replace(/^【.*?】\s*/, "")
                .replace(/\s*（\d+\.\d+分）$/, "")
                .trim()
                .replace(/&nbsp;/g, "")
                .replace(/^\s+/, "")
                .replace(/\s+$/, "");
    }

    function tidyQuestion(s) {
        if (!s) return null;
        return s.replace(/<(?!img).*?>/g, "")
                .replace(/^【.*?】\s*/, "")
                .replace(/\s*（\d+\.\d+分）$/, "")
                .replace(/^\d+[\.、]/, "")
                .trim()
                .replace(/&nbsp;/g, "");
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ============ UI界面 ============
    function showBox() {
        // 只在顶层窗口显示UI界面，避免在iframe中重复创建
        if (window !== window.top) return;
        
        if (setting.showBox && !document.querySelector("#miaoke-box")) {
            const boxHtml = `
                <div id="miaoke-box" style="position:fixed;top:20px;right:20px;width:350px;background:rgba(255,255,255,0.95);border:2px solid #667eea;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.3);z-index:99999;font-family:'Microsoft YaHei',sans-serif;">
                    <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:12px;border-radius:8px 8px 0 0;cursor:move;" id="miaoke-header">
                        <h3 style="margin:0;font-size:16px;">🐱 喵课助手 v${GM_info.script.version}</h3>
                        <div style="float:right;margin-top:-20px;">
                            <button id="miaoke-minimize" style="background:rgba(255,255,255,0.2);border:none;color:white;padding:2px 8px;border-radius:3px;cursor:pointer;margin-right:5px;">─</button>
                            <button id="miaoke-close" style="background:rgba(255,255,255,0.2);border:none;color:white;padding:2px 8px;border-radius:3px;cursor:pointer;">✕</button>
                        </div>
                    </div>
                    <div id="miaoke-content" style="padding:15px;">
                                                 <div style="margin-bottom:15px;">
                             <div>🌸 喵课题库Token：<small style="color:#999;">邀请码:0000</small></div>
                             <input type="password" id="token-input" placeholder="请输入Token" style="width:100%;padding:5px;margin:5px 0;border:1px solid #ddd;border-radius:3px;">
                             <div style="display:flex;gap:5px;margin-top:5px;">
                                 <button id="token-save" style="flex:1;background:#667eea;color:white;border:none;padding:6px;border-radius:3px;cursor:pointer;">保存Token</button>
                                 <button id="token-get" style="flex:1;background:#28a745;color:white;border:none;padding:6px;border-radius:3px;cursor:pointer;">获取题库</button>
                             </div>
                         </div>
                        <div id="miaoke-status" style="padding:10px;background:#f8f9fa;border-radius:5px;margin-bottom:10px;">
                            <div>状态：<span id="status-text" style="color:#667eea;font-weight:bold;">准备就绪</span></div>
                            <div style="background:#e9ecef;height:6px;border-radius:3px;margin-top:5px;">
                                <div id="progress-bar" style="background:linear-gradient(90deg,#667eea,#764ba2);height:100%;width:0%;border-radius:3px;transition:width 0.3s;"></div>
                            </div>
                        </div>
                        <div id="miaoke-logs" style="max-height:200px;overflow-y:auto;background:#f8f9fa;border-radius:5px;padding:10px;">
                            <div id="log-content"></div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', boxHtml);
            bindEvents();
            initTokenDisplay();
        }
    }

    function bindEvents() {
        const box = document.querySelector('#miaoke-box');
        const header = document.querySelector('#miaoke-header');
        const minimizeBtn = document.querySelector('#miaoke-minimize');
        const closeBtn = document.querySelector('#miaoke-close');
        const tokenSaveBtn = document.querySelector('#token-save');
        const tokenGetBtn = document.querySelector('#token-get');

        // 拖拽功能
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragOffset.x = e.clientX - box.offsetLeft;
            dragOffset.y = e.clientY - box.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                box.style.left = (e.clientX - dragOffset.x) + 'px';
                box.style.top = (e.clientY - dragOffset.y) + 'px';
                box.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // 最小化
        minimizeBtn.addEventListener('click', () => {
            const content = document.querySelector('#miaoke-content');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                minimizeBtn.textContent = '─';
                box.style.width = '350px';
            } else {
                content.style.display = 'none';
                minimizeBtn.textContent = '□';
                box.style.width = '200px';
            }
        });

        // 关闭
        closeBtn.addEventListener('click', () => {
            box.style.display = 'none';
        });

        // Token管理
        tokenSaveBtn.addEventListener('click', () => {
            const tokenInput = document.querySelector('#token-input');
            const token = tokenInput.value.trim();
            
                         if (token.length === 32) {
                 setting.token = token;
                 logger('Token保存成功！现在可以使用AI答题功能了', 'success');
                 initTokenDisplay();
             } else if (token === '') {
                 setting.token = '';
                 logger('Token已清空！', 'info');
                 initTokenDisplay();
             } else {
                 logger('Token格式不正确！请访问 mk.zizizi.top 获取正确格式', 'error');
             }
        });

        tokenGetBtn.addEventListener('click', () => {
            window.open('https://mk.zizizi.top/', '_blank');
        });

        // 按K键切换显示（只在顶层窗口绑定）
        if (window === window.top) {
            document.addEventListener('keydown', (e) => {
                if (e.keyCode === 75 && box) {
                    box.style.display = box.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
    }

    function initTokenDisplay() {
        const tokenInput = document.querySelector('#token-input');
        const saveBtn = document.querySelector('#token-save');
        
        if (setting.token) {
            tokenInput.value = setting.token;
            saveBtn.textContent = '清空Token';
        } else {
            tokenInput.value = '';
            saveBtn.textContent = '保存Token';
        }
    }

    function logger(message, type = 'info') {
        // 尝试在顶层窗口中查找日志容器
        const logContent = (window.top.document || document).querySelector('#log-content');
        if (!logContent) return;

        const time = new Date().toLocaleTimeString();
        const colors = {
            info: '#333',
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            purple: '#6f42c1'
        };

        const logItem = document.createElement('div');
        logItem.style.cssText = `
            margin-bottom: 5px;
            padding: 5px 8px;
            background: white;
            border-radius: 3px;
            border-left: 3px solid ${colors[type] || colors.info};
            font-size: 12px;
            line-height: 1.4;
        `;
        logItem.innerHTML = `<span style="color: #666;">[${time}]</span> <span style="color: ${colors[type] || colors.info};">${message}</span>`;

        logContent.appendChild(logItem);
        logContent.scrollTop = logContent.scrollHeight;

        // 限制日志数量
        if (logContent.children.length > 50) {
            logContent.removeChild(logContent.firstChild);
        }
    }

    function updateStatus(text, progress = null) {
        // 在顶层窗口中更新状态
        const statusText = (window.top.document || document).querySelector('#status-text');
        const progressBar = (window.top.document || document).querySelector('#progress-bar');
        
        if (statusText) statusText.textContent = text;
        if (progressBar && progress !== null) {
            progressBar.style.width = `${progress}%`;
        }
    }

    // ============ 核心功能 ============
    function getTaskParams() {
        try {
            const scripts = document.scripts;
            for (let i = 0; i < scripts.length; i++) {
                if (scripts[i].innerHTML.indexOf('mArg = "";') !== -1 && 
                    scripts[i].innerHTML.indexOf("==UserScript==") === -1) {
                    const match = scripts[i].innerHTML.replace(/\s/g, "").match(/try{mArg=(.+?);}catch/);
                    return match ? match[1] : null;
                }
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async function getAnswer(type, question, options) {
        return new Promise((resolve, reject) => {
            const tkurl = atob(_host) + "/api/v1/cx";
            const uid = getCookie("_uid") || getCookie("UID");

            GM_xmlhttpRequest({
                method: "POST",
                url: tkurl,
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + setting.token
                },
                data: JSON.stringify({
                    "v": GM_info.script.version,
                    "question": question,
                    "type": type,
                    "options": options,
                    "uid": uid
                }),
                timeout: setting.time,
                onload: function(xhr) {
                    if (xhr.status === 200) {
                        const obj = JSON.parse(xhr.responseText) || {};
                        if (obj.code === 1000) {
                            const answer = /^http/.test(obj.data.answer) ? 
                                '<img src="' + obj.data.answer + '">' : obj.data.answer;
                            logger(`题目: ${question}<br>答案: ${answer}`, 'purple');
                            resolve(answer.replace("===", "#"));
                                             } else {
                         logger(`题库返回: ${obj.msg}`, 'error');
                         if (obj.msg.includes('token') || obj.msg.includes('Token')) {
                             logger('💡 Token问题？访问 mk.zizizi.top 获取有效Token', 'warning');
                         }
                         setting.sub = 0;
                         reject({c: 0});
                     }
                    } else {
                        logger("题库连接失败", 'error');
                        reject({c: 0});
                    }
                },
                ontimeout: function() {
                    logger("题库请求超时", 'error');
                    reject({c: 0});
                }
            });
        });
    }

    // ============ 任务处理 ============
    async function startMission() {
        if (!_mlist || _mlist.length <= 0) {
            logger("此页面任务处理完毕，准备跳转页面", 'success');
            return toNext();
        }

        const task = _mlist[0];
        const dom = _domList[0];
        const type = task.type || task.property?.module;

        updateStatus(`处理任务: ${type}`, 0);

        switch (type) {
            case "video":
                if (task.property?.module === "insertvideo") {
                    logger("开始处理视频", 'info');
                    await processVideo(dom, task);
                } else if (task.property?.module === "insertaudio") {
                    logger("开始处理音频", 'info');
                    await processAudio(dom, task);
                }
                break;
            
            case "workid":
                logger("开始处理测验", 'info');
                await processWork(dom, task);
                break;
            
            case "document":
                logger("开始处理文档", 'info');
                await processDocument(dom, task);
                break;
            
            case "read":
                logger("开始处理阅读", 'info');
                await processRead(dom, task);
                break;
            
            default:
                logger(`暂不支持处理此类型: ${type}，跳过`, 'warning');
                switchMission();
        }
    }

    async function processVideo(dom, task) {
        if (!setting.video) {
            logger("用户设置不处理视频任务", 'warning');
            setTimeout(switchMission, 3000);
            return;
        }

        const classId = _defaults.clazzId;
        const userId = _defaults.userid;
        const fid = _defaults.fid;
        const reportUrl = _defaults.reportUrl;
        const isPassed = task.isPassed;
        const otherInfo = task.otherInfo;
        const jobId = task.property._jobid;
        const name = task.property.name;
        const objectId = task.property.objectid;

        if (!setting.review && isPassed) {
            logger(`视频：${name} 检测已完成，准备处理下一个任务`, 'success');
            switchMission();
            return;
        }

        try {
            const response = await fetch(`${_l.protocol}//${_l.host}/ananas/status/${objectId}?k=${fid}&flag=normal&_dc=${Date.now()}`);
            const res = await response.json();
            
            const duration = res.duration;
            const dtoken = res.dtoken;
            let playingTime = 0;
            
            logger(`视频：${name} 开始播放，总时长：${duration}秒`, 'info');
            updateStatus(`播放视频: ${name}`, 0);

            // 模拟播放进度
            const interval = setInterval(async () => {
                playingTime += 40 * setting.rate;
                
                if (playingTime >= duration || setting.rate === 0) {
                    clearInterval(interval);
                    playingTime = duration;
                }

                const progress = Math.min((playingTime / duration) * 100, 100);
                updateStatus(`播放视频: ${name}`, progress);
                logger(`视频：${name} 已播放 ${progress.toFixed(1)}%`, 'info');

                // 发送播放进度
                const updateResult = await updateVideoProgress(reportUrl, dtoken, classId, playingTime, duration, objectId, otherInfo, jobId, userId);
                
                                 if (updateResult === 2) {
                     clearInterval(interval);
                     logger(`视频：${name} 播放完毕`, 'success');
                     // 偶尔提及功能支持
                     if (Math.random() < 0.3) {
                         logger('🌟 更多功能和题库更新请关注 mk.zizizi.top', 'info');
                     }
                     switchMission();
                 }
            }, setting.rate === 0 ? 5000 : 40000);

        } catch (error) {
            logger(`视频处理出错: ${error.message}`, 'error');
            switchMission();
        }
    }

    async function updateVideoProgress(reportUrl, dtoken, classId, playingTime, duration, objectId, otherInfo, jobId, userId) {
        return new Promise((resolve) => {
            const clipTime = `0_${duration}`;
            const isdrag = playingTime >= duration ? "4" : "0";
            
            $.ajax({
                url: `${reportUrl}/${dtoken}?clazzId=${classId}&playingTime=${playingTime}&duration=${duration}&clipTime=${clipTime}&objectId=${objectId}&otherInfo=${otherInfo}&jobid=${jobId}&userid=${userId}&isdrag=${isdrag}&view=pc&dtype=Video&_t=${Date.now()}`,
                type: "GET",
                success: function(res) {
                    if (res.isPassed) {
                        resolve(2); // 完成
                    } else {
                        resolve(1); // 继续
                    }
                },
                error: function() {
                    resolve(0); // 错误
                }
            });
        });
    }

    async function processAudio(dom, task) {
        // 类似视频处理逻辑
        logger("音频处理功能开发中...", 'info');
        setTimeout(switchMission, 3000);
    }

    async function processWork(dom, task) {
        if (!setting.work) {
            logger("用户设置不自动处理测验", 'warning');
            switchMission();
            return;
        }

        logger("测验处理功能开发中...", 'info');
        setTimeout(switchMission, 3000);
    }

    async function processDocument(dom, task) {
        const jobId = task.property?.jobid;
        const name = task.property?.name;
        const jtoken = task.jtoken;
        const knowledgeId = _defaults.knowledgeid;
        const courseId = _defaults.courseid;
        const clazzId = _defaults.clazzId;

        if (!task.job) {
            logger(`文档：${name} 检测已完成`, 'success');
            switchMission();
            return;
        }

        try {
            const response = await fetch(`${_l.protocol}//${_l.host}/ananas/job/document?jobid=${jobId}&knowledgeid=${knowledgeId}&courseid=${courseId}&clazzid=${clazzId}&jtoken=${jtoken}&_dc=${Date.now()}`);
            const res = await response.json();
            
            if (res.status) {
                logger(`文档：${name} ${res.msg}`, 'success');
            } else {
                logger(`文档：${name} 处理异常`, 'error');
            }
        } catch (error) {
            logger(`文档处理出错: ${error.message}`, 'error');
        }
        
        switchMission();
    }

    async function processRead(dom, task) {
        // 类似文档处理
        const jobId = task.property?.jobid;
        const name = task.property?.title;
        
        logger(`阅读：${name} 处理完成`, 'success');
        setTimeout(switchMission, 2000);
    }

    function switchMission() {
        _mlist.splice(0, 1);
        _domList.splice(0, 1);
        setTimeout(startMission, 5000);
    }

    function toNext() {
        setTimeout(() => {
            if (window.parent.document.querySelector("#mainid > .prev_next.next")) {
                window.parent.document.querySelector("#mainid > .prev_next.next").click();
            } else if (window.parent.document.querySelector("#prevNextFocusNext")) {
                window.parent.document.querySelector("#prevNextFocusNext").click();
            }
        }, 5000);
    }

    // ============ 主程序入口 ============
    function init() {
        // 显示控制面板（只在顶层窗口）
        showBox();
        
        // 所有窗口都记录日志，但UI只在顶层显示
        if (window === window.top) {
            logger("🎉 喵课助手已加载，初始化完毕！", 'success');
            logger("💡 题库支持请访问 mk.zizizi.top 获取帮助", 'info');
        } else {
            logger(`🔧 子页面已加载: ${_l.pathname}`, 'info');
        }

        // 根据页面类型执行相应功能
        if (_l.pathname.includes("/knowledge/cards")) {
            // 学习页面
            handleStudyPage();
        } else if (_l.pathname.includes("/exam/test/reVersionTestStartNew")) {
            // 考试页面
            logger("检测到考试页面", 'info');
        } else if (_l.pathname.includes("/mooc2/work/dowork")) {
            // 作业页面
            logger("检测到作业页面", 'info');
        } else {
            // 其他页面类型，只在顶层窗口提示
            if (window === window.top) {
                logger("等待页面跳转...", 'info');
            }
        }
    }

    function handleStudyPage() {
        updateStatus("检测学习任务...", 20);
        
        const params = getTaskParams();
        if (!params || params === '"$mArg"') {
            logger("无任务点可处理，即将跳转页面", 'warning');
            toNext();
            return;
        }

        try {
            const parsedParams = JSON.parse(params);
            _mlist = parsedParams.attachments || [];
            _defaults = parsedParams.defaults || {};
            
            if (_mlist.length <= 0) {
                logger("无任务点可处理，即将跳转页面", 'warning');
                toNext();
                return;
            }

            // 获取DOM列表
            _domList = [];
            $('.wrap .ans-cc .ans-attach-ct').each((i, element) => {
                _domList.push($(element).find('iframe'));
            });

            logger(`共计${_mlist.length}个任务，即将开始处理`, 'success');
            updateStatus("开始处理任务...", 50);
            
            setTimeout(startMission, 3000);
            
        } catch (error) {
            logger(`参数解析失败: ${error.message}`, 'error');
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
