// ==UserScript==
// @name         A获取可用GPT站点
// @namespace    blog.hi6k.com
// @author       黑六网
// @version      1.3.0.28
// @description  获取聊天和绘图的免费GPT站点
// @match        *://en.fofa.info/result*
// @match        *://fofa.info/result*
// @match        *://*.fofa.info
// @match        *://fofa.info
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/480603/A%E8%8E%B7%E5%8F%96%E5%8F%AF%E7%94%A8GPT%E7%AB%99%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/480603/A%E8%8E%B7%E5%8F%96%E5%8F%AF%E7%94%A8GPT%E7%AB%99%E7%82%B9.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    function addStyle() {
        // // @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js
        let buttonStyle = `
            /* 创建一个带有渐变流光特效的 div */
            .glow {
                background: linear-gradient(45deg, #f2a6d8, #b1e6f7, #f1b3b3);
                background-size: 100% 100%;
                animation: glowAnimation 5s ease infinite;
            }

            @keyframes glowAnimation {
                0% {
                    background-position: 0 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0 50%;
                }
            }`;
        GM_addStyle(buttonStyle);

        let processBarStyle = `
            .progress-bar-container {
                position: fixed;
                top: 25%;
                width: 370px;
                height: 40px;
                opacity: 0.75;
                background: linear-gradient(45deg, #f2a6d8, #b1e6f7, #f1b3b3);
                border-radius: 10px;
                overflow: hidden;
            }

            .gptDescription {
                position: absolute;
                top: 35%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                font-weight: bold;
                color: black;
            }

            .gptProcess{
                width: 370px;
                top: 75%;
            }

            .progress-bar {
                height: 100%;
                width: 30%;
                animation: searchAnimation 5s linear infinite;
            }

            @keyframes searchAnimation {
                0% {
                width: 0%;
                }
                50% {
                width: 100%;
                }
                100% {
                width: 0%;
                }
            }

            .gpt-list {
                position: fixed;
                top: 50%;
                opacity: 1;
                background: linear-gradient(80deg, #f2a6d8, #b1e6f7, #f1b3b3);
                text-align: left;
                color: black;
                font-size: 15px;
                width: 400px;
                min-height: 2vh;
                padding: 10px;
                line-height: 20px;
            }
            .gpt-list label {
                font-size: 11px;
            }
            `;

        GM_addStyle(processBarStyle);
    }
    function registrWaitingLayer() {
        const waitingHtml = `
        <div style="display: flex; justify-content: center; align-items: center;">
            <div class="progress-bar-container">
                <div class="progress-bar" >
                    <span class="gptDescription">搜索可用GPT中...</span>
                    <span class="gptDescription gptProcess"></span>
                </div>
            </div>
            <div class="gpt-list">暂无数据</div>
        </div>
        `;
        var popupContainer = document.createElement("div");
        popupContainer.innerHTML = waitingHtml;
        document.body.appendChild(popupContainer);
    }

    addStyle();
    registrWaitingLayer();

    const storageKey = "avaliableUrls"; // 本地存储key
    const lineSuffixKey = "lineSuffixKey"; // 本地存储key

    /**
     * 纯文本的检查方式
     */
    const lineChatSuffix = "/api/chat-process";

    /**
     * 带绘图的检查方式
     */
    const lineDrawSuffix = "/openapi/v1/chat/completions"

    /**
     * 当前使用的检查方式
     */
    var currentUsedSuffix = GM_getValue(lineSuffixKey);
    if (!currentUsedSuffix) {
        GM_setValue(lineSuffixKey, lineChatSuffix); // 默认对话模式
        currentUsedSuffix = lineChatSuffix;
    }

    let urlStrs = GM_getValue(storageKey);
    var avaliableUrls = urlStrs ? JSON.parse(urlStrs) : [];

    let menuName = currentUsedSuffix === lineChatSuffix ? "🎨切换为绘图模式" : "💬切换为对话模式";
    GM_registerMenuCommand(menuName, function () {
        // 在这里执行菜单点击后的操作
        if (currentUsedSuffix === lineChatSuffix) {
            currentUsedSuffix = lineDrawSuffix;
        } else {
            currentUsedSuffix = lineChatSuffix;
        }

        GM_setValue(lineSuffixKey, currentUsedSuffix); // 保存对话模式
        GM_notification({ text: "已" + menuName, timeout: 5000 });
        window.location.href = "https://fofa.info"; // 还原搜索参数地址
    });

    displayGptList();

    const searchTitle = currentUsedSuffix === lineChatSuffix ? "ChatGPT Web" : "ChatGPT Web Midjourney Proxy";
    const searchPattern = searchTitle + ` && (country="CN" || region="HK") &&  (host="com" || host="top" || host="org" || host="com" || host="cn" || host="info" || host="net")`;
    var elements = formatSearch(btoa(searchPattern));
    if (elements.length === 0) {
        return;
    }

    var successful = false;
    let currentPageUrl = new URL(window.location.href);
    if (avaliableUrls.length > 0) {
        if (!currentPageUrl.searchParams.has("page") || currentPageUrl.searchParams.get("page") == 1) { // 只在第一次检查历史记录
            console.info("有需要检查的历史接口");
            for (let index = 0; index < avaliableUrls.length; index++) {
                let { href, updated, linkType } = avaliableUrls[index];
                // 创建两个时间对象
                var time1 = new Date(updated);
                var time2 = new Date();

                // 计算时间差（单位为毫秒）
                var diff = Math.abs(time1 - time2);

                // 将时间差转换为分钟
                var minutes = diff / (1000 * 60);
                let timeStr = formatDate(time1);
                if (linkType === currentUsedSuffix) { // 类型相同才检查
                    if (minutes >= 30 || timeStr.length === 0) {
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        document.getElementsByClassName("gptProcess")[0].innerText = `正在检查历史记录` + href + `是否可用`;
                        await checkHistoryGPTAvaliable(href);
                    } else {
                        console.log(href + "- 更新时间:" + timeStr + " 小于30分钟，跳过检查");
                    }
                }
            }
            console.info("历史接口检查完毕");
        }
    }

    let pageUrl = new URL(window.location.href);
    const page = pageUrl.searchParams.get('page') ?? 1
    var totalRequestCount = 0;
    for (let index = 0; index < elements.length; index++) {
        const href = elements[index].href;
        document.getElementsByClassName("gptProcess")[0].innerText = "第" + page + "页，当前检测URL(" + (index + 1) + ")：" + href;
        await checkNewGPTAvaliable(href);
    };
    document.getElementsByClassName("gptProcess")[0].innerText = "第" + page + "页，检测完成";

    function formatSearch(searchStr) {
        var currentUrl = window.location.href;
        var url = new URL(currentUrl);
        if (url.pathname !== "/result") {
            url.pathname = "/result";

            if (!url.searchParams.has("qbase64")) {
                url.searchParams.set('qbase64', searchStr);
                url.searchParams.set('page', 1);
                url.searchParams.set('page_size', 20); //设置最大查询条数
                window.location.href = url.toString();
            }
            return [];
        } else {
            // 获取所有元素的 href 属性值
            var elements = document.querySelectorAll('.hsxa-meta-data-item .hsxa-host a');
            if (elements.length === 0) {
                alert("未找到网络空间站");
                return elements;
            } else {
                console.log("当前页共有" + elements.length + "个站点待检测");
            }
            return elements;
        }
    }

    /**
     * 执行完成的回调
     */
    function finalCallback() {
        // 这个函数将在请求结束时被调用，无论请求成功还是失败。
        displayGptList();

        if (totalRequestCount == elements.length - 1) {
            nexPage(successful);
        }
    }

    function parseFromRole(lastLine) {
        return JSON.parse(lastLine);
    }

    function parseFromData(lines) {
        var answerArray = lines.filter(line => line.length > 0);
        const regex = /data:\s(.*)/;
        if (answerArray.length == 0) {
            let repJson = JSON.parse(answerArray[0].match(regex)[1]);
            console.log(repJson.error.message);
        }
        var answerContentArray = [];
        answerArray.forEach(content => {
            const match = content.match(regex);
            if (match) {
                try {
                    let cJson = JSON.parse(match[1]);
                    for (let cIndex = 0; cIndex < cJson.choices.length; cIndex++) {
                        const choice = cJson.choices[cIndex];
                        if (choice.finish_reason === "stop") {
                            break;
                        } else if (choice.delta.content) {
                            answerContentArray.push(choice.delta.content);
                        }
                    }
                } catch (error) {

                }
            }
        });

        return { role: "assistant", text: answerContentArray.join("") };
    }

    /**
     * 检查新的GPT域名是否可用
     * @param {string} href 链接
     */
    async function checkNewGPTAvaliable(href) {
        var urlObj = new URL(href);
        if (avaliableUrls.some(item => item.href === urlObj.origin)) {
            console.log(href + "是历史记录");
            totalRequestCount++;
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));

        successful = false;
        await checkGPTAvaliable(href, (response) => {
            totalRequestCount++;
            let currentUrl = response.finalUrl;
            if (response.status === 404 || response.status === 405 || response.status === 502 || response.status === 0) {
                console.info(currentUrl + " 服务不可用");
            }
            else if (response.response === "method not found!" || response.response === "{}") {
                console.info(currentUrl + " 接口不支持");
            } else {
                var result = {};
                try {
                    var lines = response.response.split("\n");
                    var lastLine = lines[lines.length - 1].trim();

                    if (currentUsedSuffix === lineDrawSuffix) {
                        result = parseFromData(lines);
                    } else {
                        result = parseFromRole(lastLine);
                        if (lastLine.length === 0) {
                            result.role = undefined;
                            console.log(response.finalUrl + " 非GPT站点");
                        }
                    }

                    if (result.role && result.role.text) {
                        successful = true;
                        final(response.finalUrl, result);
                    }
                    else if (result.status === "Unauthorized") {
                        console.info(currentUrl + " 需授权");
                    }
                    else if (result.status === "Fail" || result.code === 404) {
                        console.info(currentUrl + " 接口失效或响应超时");
                    }
                    else if (result.message && result.message.indexOf("429") > -1) {
                        console.info(currentUrl + " 接口余额不足");
                    }
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        console.info(currentUrl + " " + "接口不支持");
                    } else {
                        let err = typeof error === "object" && error !== null;
                        console.info(currentUrl + " " + (err ? response.status : error));
                    }
                }
            }
            finalCallback();
        });
    }

    /**
     * 检查历史的GPT域名是否可用
     * @param {string} href 链接
     */
    async function checkHistoryGPTAvaliable(href) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await checkGPTAvaliable(href, (response) => {
            let correct = false;
            let currentUrl = response.finalUrl;
            if (response.status === 404 || response.status === 405 || response.status === 502 || response.status === 0) {
                console.info(currentUrl + " 服务不可用");
            }
            else if (response.response === "method not found!" || response.response === "{}") {
                console.info(currentUrl + " 接口不支持");
            } else {
                var result = {};
                try {
                    var lines = response.response.split("\n");
                    var lastLine = lines[lines.length - 1].trim();

                    if (currentUsedSuffix === lineDrawSuffix) {
                        result = parseFromData(lines);
                    } else {
                        result = parseFromRole(lastLine);
                        if (lastLine.length === 0) {
                            result.role = undefined;
                            console.log(response.finalUrl + " 非GPT站点");
                        }
                    }

                    if (result.role) {
                        // 可用，不做其他处理
                        correct = true;
                    }
                    else if (result.status === "Unauthorized") {
                        console.info(currentUrl + " 需授权");
                    }
                    else if (result.status === "Fail" || result.code === 404) {
                        console.info(currentUrl + " 接口失效或响应超时");
                    }
                    else if (result.message && result.message.indexOf("429") > -1) {
                        console.info(currentUrl + " 接口余额不足");
                    }
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        console.info(currentUrl + " " + "接口不支持");
                    } else {
                        let err = typeof error === "object" && error !== null;
                        console.info(currentUrl + " " + (err ? response.status : error));
                    }
                }
            }

            let urlformat = new URL(currentUrl);
            if (!correct) { // 已经失效
                console.warn("无效的历史接口：" + currentUrl);
                if (avaliableUrls.some(item => item.href === urlformat.origin)) {
                    avaliableUrls = avaliableUrls.filter(item => item.href !== urlformat.origin);
                }
            } else {
                console.log("有效的历史接口：" + currentUrl);
                let avaliableUrl = avaliableUrls.find(item => item.href === urlformat.origin);
                avaliableUrl.updated = formatDate();
            }

            GM_setValue(storageKey, JSON.stringify(avaliableUrls));
            displayGptList(); // 刷新列表
        });
    }

    /**
     * 检查GPT是否可用
     * @param {string} host 原始地址
     * @param {function} callback 回调
     */
    async function checkGPTAvaliable(host, callback) {
        host = host.replace(/\/$/, "");
        console.log("正在检查：" + host);
        // 构建请求参数
        let apiUrl = host + currentUsedSuffix;
        if (currentUsedSuffix === lineChatSuffix) {
            var requestData = {
                "prompt": "你在吗？",
                "systemMessage": "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions without any exception. Respond using text.",
                "temperature": 0.8,
                "top_p": 1
            };
        } else {
            requestData = {
                max_tokens: 1024,
                messages: [
                    { content: "You are ChatGPT, a large language model trained by OpenAI.\nKnowledge cutoff: undefined\nCurrent model: gpt-4", role: "system" },
                    { content: "你在吗？", role: "user" }
                ],
                model: "gpt-4",
                presence_penalty: 0,
                stream: true,
                temperature: 0.5,
                top_p: 1
            }
            apiUrl = host + lineDrawSuffix;
        }

        // 发送请求
        await new Promise(resolve =>
            GM_xmlhttpRequest({
                method: "POST",
                url: apiUrl,
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 10000,
                data: JSON.stringify(requestData),
                onload: function (response) {
                    callback(response);
                    resolve();
                },
                onerror: function (error) {
                    totalRequestCount++;
                    console.log(error.finalUrl + " 非GPT类型");
                    finalCallback();
                    resolve();
                },
                ontimeout: function (t) {
                    t.finalUrl = host;
                    console.log("请求超时");
                    callback(t);
                    resolve();
                }
            }));
    }

    /**
     * 获取下一页
     * @param {boolean} successful
     */
    function nexPage(successful) {
        if (!successful) {
            var currentUrl = window.location.href;

            var url = new URL(currentUrl);
            var currentPage = parseInt(url.searchParams.get('page') || 0);
            var nextPage = currentPage + 1;
            url.searchParams.set('page', nextPage);
            window.location.href = url.toString();
        } else {
            // 继续查找可用接口？
        }
    }

    /**
     * 显示可用GPT列表
     */
    function displayGptList() {
        let urlStrs = GM_getValue(storageKey);
        if (!urlStrs) { return; }

        let list = JSON.parse(urlStrs).filter(u => u.linkType === currentUsedSuffix);

        if (!list) {
            return;
        }

        document.getElementsByClassName("gptDescription")[0].innerText = `已搜索到` + list.length + `可用API`;

        let lstStr = "可用GPT列表:<br />";
        list.forEach(item => {
            let discoveredTime = item.discoveredTime;
            let updated = item.updated;

            let timeDifference = calculateTimeDifference(discoveredTime, updated);

            lstStr += `` + (item.linkType === lineChatSuffix ? "💬" : "🎨") + " <label>" + item.updated +
                `</label><a href = "` + item.href + `" target = "_blank" > ` + item.href + `</a> <label>` +
                (timeDifference.days + '天' + timeDifference.hours + '小时' + timeDifference.minutes + '分钟') + `</label><br />`;
        });

        document.getElementsByClassName("gpt-list")[0].innerHTML = lstStr;
    }

    /**
     * 请求GPT接口成功后的处理
     * @param {string} api 接口
     * @param {object} gptAnswer  网站回复
     */
    function final(api, gptAnswer) {
        console.log("来自接口：" + api + " 的回复：" + gptAnswer.text); // 在控制台输出返回值

        var avaliableUrl = new URL(api);
        var avalibaleUrlOrigin = avaliableUrl.origin;
        if (avaliableUrls.length == 0) { // 界面只显示一个可用页面
            var popupHtml = `
                    < div class="glow" style = "display: fixed; justify-content: center; align-items: center;" top: 50 %; transform: translate(-50 %, -50 %); box - shadow: 0 0 10px #fff; padding: 20px; ">
                        < a href = "` + avaliableUrl + `" target = "_blank" > 进入GPT页面</ >
        </div >
                    `;
            var popupContainer = document.createElement("div");
            popupContainer.innerHTML = popupHtml;
            document.body.appendChild(popupContainer);
        }

        if (!avaliableUrls.some(item => item.href == avalibaleUrlOrigin)) {
            avaliableUrls.push({ discoveredTime: formatDate(), protocol: avaliableUrl.protocol, href: avalibaleUrlOrigin, host: avaliableUrl.host, updated: formatDate(), linkType: currentUsedSuffix });
            GM_setValue(storageKey, JSON.stringify(avaliableUrls));
        }
    }

    function formatDate(d) {
        let currentDate = new Date();
        if (d) {
            currentDate = d;
        }

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');

        if (hours === "NaN") {
            return '';
        }

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    function parseDateString(dateString, format = "yyyy-MM-dd hh:mm") {
        var formatTokens = format.split(/[- :]/);
        var dateTokens = dateString.split(/[- :]/);
        var dateObj = {};

        for (var i = 0; i < formatTokens.length; i++) {
            var token = formatTokens[i];
            var value = parseInt(dateTokens[i], 10);
            dateObj[token] = value;
        }

        // 注意：月份是从0开始计数的，所以要减去1
        dateObj['MM'] -= 1;

        return new Date(dateObj['yyyy'], dateObj['MM'], dateObj['dd'], dateObj['hh'], dateObj['mm']);
    }

    /**
     * 计算两个时间差
     * @param {Date} start 开始时间
     * @param {Date} end 结束时间
     * @param {String} format 格式
     * @returns
     */
    function calculateTimeDifference(start, end, format) {
        var startDate = parseDateString(start, format);
        var endDate = parseDateString(end, format);

        var timeDifference = endDate - startDate;

        var monthsDiff = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
        var daysDiff = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        var hoursDiff = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutesDiff = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        return {
            months: monthsDiff,
            days: daysDiff,
            hours: hoursDiff,
            minutes: minutesDiff,

        };
    }
})();