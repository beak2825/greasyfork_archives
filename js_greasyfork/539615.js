// ==UserScript==
// @name         Kill-Study
// @namespace    http://tampermonkey.net/
// @version      2025-06-10
// @description  适配平台：广东省继续教育公需课 & 奥鹏教育网
// @author       Yeuoui
// @license MIT
// @run-at document-end
// @match        https://jsxx.gdedu.gov.cn/*
// @match        https://learn.ourteacher.com.cn/StepLearn/StepLearn/*
// @icon         https://img.ixintu.com/download/jpg/20200829/41c51119c66f6ba5ecc79ba41e27054d_512_512.jpg!con
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539615/Kill-Study.user.js
// @updateURL https://update.greasyfork.org/scripts/539615/Kill-Study.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ========================
    //⏺ 主程序配置
    // ========================
    const CHECK_INTERVAL = 2000; // 检测间隔（毫秒）

    // ========================
    // 📦 日志面板模块
    // ========================
    function createLogPanel() {
        const logPanelStyle = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            max-height: 400px;
            background: #1e1e1e;
            color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            font-family: sans-serif;
            z-index: 99999;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        `;

        const headerStyle = `
            padding: 10px;
            background: #333;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const contentStyle = `
            max-height: 300px;
            overflow-y: auto;
            padding: 10px;
            font-size: 12px;
            line-height: 1.4;
        `;

        const buttonStyle = `
            background: #555;
            color: white;
            border: none;
            padding: 4px 8px;
            font-size: 12px;
            border-radius: 4px;
            cursor: pointer;
        `;

        const logPanel = document.createElement('div');
        logPanel.style.cssText = logPanelStyle;
        logPanel.innerHTML = `
            <div id="logHeader" style="${headerStyle}">
                <span>📜 自动学习日志</span>
                <button id="clearLogBtn" style="${buttonStyle}">🗑️ 清空</button>
            </div>
            <div id="logContent" style="${contentStyle}"></div>
        `;
        document.body.appendChild(logPanel);

        const logContent = document.getElementById('logContent');
        const clearLogBtn = document.getElementById('clearLogBtn');

        let isExpanded = false;

        document.getElementById('logHeader').onclick = () => {
            isExpanded = !isExpanded;
            logPanel.style.maxHeight = isExpanded ? '600px' : '40px';
        };

        clearLogBtn.onclick = () => {
            logContent.innerHTML = '';
        };

        return {
            log: function (msg) {
                const time = new Date().toLocaleTimeString();
                const entry = document.createElement('div');
                entry.textContent = `[${time}] ${msg}`;
                logContent.appendChild(entry);
                logContent.scrollTop = logContent.scrollHeight;
            },
            clear: function () {
                logContent.innerHTML = '';
            }
        };
    }


    const logger = createLogPanel();

    logger.log("🔌 脚本已加载");

    const CONFIG = {
        //广东省继续教育平台配置
        'jsxx.gdedu.gov.cn':{
            //进入学习界面按钮
            startStudy:".shide",
            //当前播放的视频
            currentVideo:"a.section.tt-s",
            currentVideoFlag:".z-crt",
            //播放按钮
            playButton:"canvas[class*='pausecenter']",
            //完成观看标识
            videoFlag:".g-study-prompt p",
            //弹窗答题
            doneDiog:".mylayer-btn.type1",
            questionDiog:"#questionDiv",
            radioSelect:".m-question-lst input[type='radio']",
            submit_button:"button.btn.u-main-btn",
            //下一个视频按钮
            nextActivity:".btn.next.crt",
            answerFlag:"人工智能",
            // 新质生产力与现代化产业体系
            answer1:["B", "D", "A", "D", "A", "B", "B", "A", "B", "A", "ABC", "ABCD", "ABCDE", "ABC", "ACD", "ABC", "ABC", "ABC", "ABD","ABDE" ,"A", "A", "A", "A", "B", "B", "B", "A", "A", "B"],
            // 人工智能赋能制造业高质量发展课程导论
            answer2: ["C", "D", "B", "B", "B", "B", "C", "B", "C", "B", "ABC", "ABCD", "ABD", "ABC", "ABCD", "ABC", "AB", "ACD", "ABC", "ABCD", "A", "A", "B", "B", "B", "B", "A", "A", "A", "A"]
        },
        'learn.ourteacher.com.cn':{
            //当前播放的视频
            currentVideo:".a-descripe",
            currentVideoFlag:".a-descripe",
            //章节列表
            chapterList:".Side-Link-btn",
            //播放按钮
            playButton:"video",
            //子菜单
            newList:".news-list a",
            //弹窗答题
            doneDiog:".mylayer-btn.type1",
            questionDiog:"#questionDiv",
            radioSelect:".m-question-lst input[type='radio']",
            submit_button:"button.btn.u-main-btn",
            //下一个视频按钮
            nextActivity:".btn.next.crt",
        }
    }


    //根据平台URL切换配置p
    const currentHost = location.hostname;
    // ✅ 获取匹配的配置
    const currentConfig = CONFIG[currentHost];
    logger.log(`💠当前平台：${currentHost}`)
    //通用：点击开始学习按钮
    //排除：奥鹏教师教育网
    if(currentHost != "learn.ourteacher.com.cn") {
        //找到开始学习按钮
        const btn = document.querySelector(`${currentConfig.startStudy}`);
        if (btn) {
            logger.log("✅ 找到开始学习按钮！");
            btn.click();
            logger.log("🖱️ 已模拟点击");
        }
    }


    // 判断是否已完成观看
    function isVideoWatchCompleted() {
        //奥鹏教师继续教育网
        if (currentHost == "learn.ourteacher.com.cn") {
            const newsList_a = document.querySelectorAll(`${currentConfig.newList}`);

            function areAllEnd(elements) {
                return Array.from(elements).every(el => {
                    // 检查是否包含 'end' 类，并且不包含 'default' 类
                    return el.classList.contains('end') && !el.classList.contains('default');
                });
            }

            const allAreEnd = areAllEnd(newsList_a);
            return allAreEnd;
        }
        const promptElement = document.querySelector(`${currentConfig.videoFlag}`);
        if (!promptElement) return false;
        const text = promptElement.textContent.trim();

        // 判断是否包含“您已完成观看”
        if (text.includes("您已完成观看")) {
            logger.log("✅ 当前状态：已完成观看");
            return true;
        }

        // 或者匹配“您已观看X分钟”的格式
        const watchedRegex = /您已观看(\d+)分钟/;
        const match = text.match(watchedRegex);
        if (match) {
            const watchedTime = parseInt(match[1], 10);
            const requiredTime = parseInt(promptElement.querySelector("span")?.textContent || "0", 10);

            if (watchedTime >= requiredTime) {
                logger.log(`✅ 进度： ${watchedTime} 分钟 /  ${requiredTime} 分钟`);
                return true;
            } else {
                logger.log(`⏳ 进度： ${watchedTime} 分钟 /  ${requiredTime} 分钟`);
                return false;
            }
        }

        logger.log("🔍 无法识别当前学习状态");
        return false;
    }

    // 执行下一步操作（例如点击“下一章”）
    function clickNextActivityButton() {
        if(currentHost != 'learn.ourteacher.com.cn') {
            const nextBtn = document.querySelector(`${currentConfig.nextActivity}`);
            if (nextBtn && !nextBtn.classList.contains("disabled")) {
                nextBtn.click(); // 触发原生 click
                logger.log("➡️ 已点击【下一个活动】按钮");
            } else {
                logger.log("⚠️ 【下一个活动】按钮不可用或未找到");
            }
        }
    }
    //获取正在播放的视频
    function getCurrentPlayingVideoTitle() {
        const activeVideo = document.querySelector(`${currentConfig.currentVideo}${currentConfig.currentVideoFlag}`);
        if (activeVideo) {
            logger.log(`▶️ 正在播放: ${activeVideo.innerText}`);
            //考核
            if(activeVideo.innerText.includes('考核')) {
                logger.log(`💯正在完成考核`)
                exam()
            }
        } else {
            logger.log("🔍 未找到当前播放的视频项");
            return null;
        }
    }
    // 模拟点击播放按钮
    function simulatePlayButtonClick() {
        const playButton = document.querySelector(`${currentConfig.playButton}`);
        if(currentHost == 'learn.ourteacher.com.cn') return
        if (!playButton) {
            logger.log("⏸️ 未找到播放按钮");
            return;
        }

        // 创建一个点击事件
        const clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true
        });
        playButton.dispatchEvent(clickEvent);

        logger.log("⏯️ 已模拟点击播放按钮");
    }

    // 判断是否处于暂停状态（可根据类名或其它特征判断）
    function isPausedState() {
        const playButton = document.querySelector(`${currentConfig.playButton}`);
        return !!playButton; // 如果存在该 canvas，则可能为暂停状态
    }


    function autoAnswerUntilSuccess() {
        // 使用闭包保存尝试索引
        if (typeof autoAnswerUntilSuccess.attemptIndex === 'undefined') {
            autoAnswerUntilSuccess.attemptIndex = 0;
        }
        const index = autoAnswerUntilSuccess.attemptIndex++ % 2;

        const container = document.querySelector("#questionDiv");
        if (!container) {
            return;
        }

        const options = Array.from(document.querySelectorAll(".m-question-lst input[type='radio']"));
        const submitBtn = document.querySelector("button.btn.u-main-btn");

        if (options.length < 2 || !submitBtn) {
            logger.log("⚠️ 未找到选项或提交按钮");
            return;
        }

        // 切换选项并提交
        options.forEach(opt => opt.checked = false);
        options[index].checked = true;
        logger.log(`✅ 检测到答题弹窗，已选择第 ${index + 1} 个选项`);

        submitBtn.click();

    }
    var index = 0
    //
    let currentProcessingId = null;
    let observer = null;

    function autoClickNextSection() {
        const items = document.querySelectorAll(".news-list li a");

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            // 判断是否是未完成项（包含 default，不含 end）
            const isUnfinished =
                  item.classList.contains("default") &&
                  !item.classList.contains("end");

            if (isUnfinished && item.id !== currentProcessingId) {
                logger.log(`⏳ 正在点击：${item.text}（ID: ${item.id}）`);
                currentProcessingId = item.id;

                // 监听该节点的类名变化
                observeNode(item, () => {
                    logger.log(`✅ 章节 "${item.text}" 已完成，将继续点击下一个...`);
                    currentProcessingId = null; // 清除当前任务
                    autoClickNextSection();   // 立即尝试下一项
                });

                item.click();
                return true;
            }
        }

        logger.log("🎉 没有更多未完成章节！");
        return false;
    }

    // 使用 MutationObserver 监听 class 变化
    function observeNode(node, callback) {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (node.classList.contains("end")) {
                        logger.log('✅完成')
                        nextChapterFlag = true;
                        observer.disconnect();
                        callback();
                        return;
                    }else{
                        nextChapterFlag = false
                    }
                }
            }
        });

        observer.observe(node, {
            attributes: true,
        });
    }
    var nextChapterFlag = false;

    // 主程序
    function startMonitoring() {

        setInterval(() => {
            if(currentHost == 'learn.ourteacher.com.cn'){
                const chapterList = document.querySelectorAll(`${currentConfig.chapterList}`)

                //先获取激活的坐标
                for(let i = 0; i < chapterList.length; i++) {
                    const itemname = chapterList[i].className
                    if(itemname.includes('active')) {
                        index = i;
                        break;
                    }
                }

                if(isVideoWatchCompleted() ||nextChapterFlag) {
                    const next = chapterList[index + 1]
                    logger.log(`✅准备完成：${next.innerText}`)
                    next.click()
                }else{
                    if (!currentProcessingId) {
                        autoClickNextSection();
                    }

                }
            }
             // =============================
            // 🔁 公共逻辑部分
            // =============================
            if (isVideoWatchCompleted()) {
                //关闭完成弹窗
                var diglog = document.querySelector(`${currentConfig.doneDiog}`)
                if(diglog) {
                    diglog.click()
                    logger.log("✅已关闭完成活动弹窗")
                    clickNextActivityButton()
                }
                clickNextActivityButton(); // 可选：触发下一章
                // stopMonitoring(); // 可选：停止检测
            }else{
                // =============================
                // 🔁 公共逻辑部分
                // =============================
                //模拟点击播放按钮
                simulatePlayButtonClick();
                //显示当前播放的视频标题
                getCurrentPlayingVideoTitle();
                //自动关闭答题弹窗
                autoAnswerUntilSuccess()
            }

        }, CHECK_INTERVAL);
    }

    // 考核
    function exam(){
        logger.log("开始答题...")
        var grade = document.getElementsByClassName("m-studyTest-grade");
        if(grade.length > 0){
            grade = parseInt(grade[0].getElementsByTagName("strong")[0].innerText);
            if(grade >= 100){
                var msg = `你当前已经是${grade}分！！！`;
                logger.log(msg);
                return;
            }
        }
        // 新质生产力与现代化产业体系
        var answer1 = currentConfig.answer1;
        // 人工智能赋能制造业高质量发展课程导论
        var answer2 = currentConfig.answer2;
        // 将答案ABCD转换成数组
        var map = {"a": 0, "A": 0, "b": 1, "B": 1, "c": 2, "C": 2, "d":3, "D": 3, "e": 4, "E": 4};
        function abcd_to_index(answer_in){
            var answer_out = [];
            for(var i = 0; i < answer_in.length; i++){
                answer_out[i] = []
                var s = answer_in[i];
                for (var j = 0; j < s.length; j++) {
                    answer_out[i].push(map[s[j]]);
                }
            }
            return answer_out;
        }
        // 判断启用哪套答案
        var answer = null;
        var course = document.getElementById("courseCatalog");
        if(course.textContent.includes(currentConfig.finishTest)){
            answer = abcd_to_index(answer2);
        } else {
            answer = abcd_to_index(answer1);
        }
        var btn = document.getElementsByClassName("btn u-main-btn");
        if(btn[0].innerText == "重新测验"){
            btn[0].click();
        } else {
            var ql = document.getElementsByClassName("m-topic-item");
            for(var i = 0; i < ql.length; i++){
                var q = ql[i]
                var c = q.getElementsByClassName("m-radio-tick");
                if(c.length <= 0){
                    c = q.getElementsByClassName("m-checkbox-tick");
                }
                // 选答案
                var a = answer[i]
                for(var j = 0; j < a.length; j++){
                    c[a[j]].click();
                }
            }
            // 交卷
            btn[0].click();
            finishTest();
        }
    }
    // 页面加载后启动监听
    startMonitoring();

})()