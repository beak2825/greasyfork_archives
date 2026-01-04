// ==UserScript==
// @name         BOSS 直聘助手魔改中
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  （1）搜索页面增加按钮：只显示当前 HR 在线的职位。\n（2）职位详情页面增加浮窗显示：HR 是否最近活跃；是否接受应届生。
// @author       Rostal
// @license      MIT
// @icon         https://www.zhipin.com/favicon.ico
// @match        https://www.zhipin.com/job_detail/*
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522792/BOSS%20%E7%9B%B4%E8%81%98%E5%8A%A9%E6%89%8B%E9%AD%94%E6%94%B9%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/522792/BOSS%20%E7%9B%B4%E8%81%98%E5%8A%A9%E6%89%8B%E9%AD%94%E6%94%B9%E4%B8%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let document1, document2;
    // 创建置于最顶层的悬浮弹窗
    function createFloatingPopup(text, textColor) {
        var style = `
                #floatingPopup {
                    position: fixed;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80%;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 20px;
                    box-sizing: border-box;
                    text-align: center;
                    border-radius: 50px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                    z-index: 2147483647;
                    transition: opacity 0.3s ease-in-out;
                }
                #closePopup {
                    position: absolute;
                    top: 5px;
                    right: 20px;
                    cursor: pointer;
                    font-size: 1.5em;
                    font-weight: bold;
                }
                #closePopup:hover {
                    color: #ddd;
                }
            `;

        var popupHTML = `
                <div id="floatingPopup">
                    <span id="closePopup">X</span>
                    <div style="margin-top: 20px; font-size: 2.0em; color: ${textColor};">${text}</div>
                </div>
            `;

        // 添加样式
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);

        // 将弹窗添加到页面中
        document.body.insertAdjacentHTML('afterbegin', popupHTML);

        // 关闭弹窗的事件处理
        document.getElementById('closePopup').addEventListener('click', function () {
            var popup = document.getElementById('floatingPopup');
            popup.style.opacity = '0';
            setTimeout(function () {
                popup.style.display = 'none';
            }, 300);
        });
    }

    function createGrayOverlay() {
        // 创建一个全屏的灰色遮罩层
        let overlay = document.createElement('div');
        overlay.id = 'grayOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
        return overlay;
    }
    function showGrayOverlay() {
        let overlay = document.getElementById('grayOverlay');
        if (!overlay) {
            overlay = createGrayOverlay();
        }
        overlay.style.display = 'block';
    }
    function enableGrayMode() {
        // 获取 body 或 html 元素
        let body = document.body;
        let overlay = document.createElement('div');
        // 设置全局样式，应用灰色滤镜，并禁用页面交互（如果需要）
        body.style.filter = 'grayscale(100%)';
        body.style.pointerEvents = 'none'; // 禁用交互，如果需要
        /*
        let popups = document.querySelectorAll('iframe');
        popups.forEach(popup => {
        popup.style.filter = 'none'; // 取消弹窗的灰色滤镜
        popup.style.pointerEvents = 'auto'; // 重新启用弹窗的交互
    });*/
    }


    function runJobDetail() {
        console.log('jrxq');
        // ======== HR 是否最近活跃 ========

        let hrDeadTexts = ["在线", "刚刚活跃", "今日活跃"];
        let bossActiveTime = document.querySelector('div.job-boss-info span.boss-active-time');
        let bossname = document.querySelector('div.job-boss-info h2.name');
        let gtButton = document.querySelector('a.btn.btn-startchat');
        let salaryText = document.querySelector('span.salary');
        let bossInfoAttr = document.querySelector('div.boss-info-attr');
        let salary = salaryText ? salaryText.textContent.trim() : '';
        let bossInfo = bossInfoAttr ? bossInfoAttr.textContent.trim().split('·')[0] : '';
        let nameText = bossname ? bossname.textContent.trim().split(' ')[0].split('\n')[0] : null;
        if (bossActiveTime) {
            let bossActiveTimeText = bossActiveTime.textContent;
            if (!hrDeadTexts.includes(bossActiveTimeText)) {
                enableGrayMode();
                createFloatingPopup("SB"+nameText+"已去世| 请允许我们在此献上最后的告别，以纪念其在Boss直聘中留下的足迹与回忆🕯🕯🕯", "red");
                return;
            }
        }
        // 如果按钮是“继续沟通”，就存储职位信息
        if (gtButton && gtButton.textContent.trim() === "继续沟通") {
            console.log('检测到继续沟通1，执行存储职位信息');
            //window.hideJobItem(nameText, salary, bossInfo);
            window.localStorage.setItem('jobDetailInfo', JSON.stringify({ salary, bossInfo, nameText })); // 将信息存储到localStorage
            window.localStorage.setItem('jobDetailProcessed', 'true'); // 标记数据已处理
        } else if (gtButton) {
            // 按钮是"立即沟通"，我们需要监听它的变化
            console.log('按钮是“立即沟通”');
            console.log('window.localStorage',window.localStorage)
            const observer = new MutationObserver(() => {
                if (gtButton.textContent.trim() === "继续沟通") {
                    console.log('检测到继续沟通2，执行存储职位信息');
                    //window.hideJobItem(salary, bossInfo, nameText);
                    window.localStorage.setItem('jobDetailInfo', JSON.stringify({ salary, bossInfo, nameText })); // 将信息存储到localStorage
                    window.localStorage.setItem('jobDetailProcessed', 'true'); // 标记数据已处理
                }
            });
            // 监听按钮文本的变化
            observer.observe(gtButton, {
                childList: true,
                subtree: true,
            });
        }
        // ======== 是否接受应届生 ========

        let jobName = document.querySelector('div.info-primary > div.name');
        if (jobName) {
            let jobNameText = jobName.textContent;

            let regex = /应届.*生?/;
            if (regex.test(jobNameText)) {
                createFloatingPopup("接受应届生", "green");
                return;
            }
        }

        let jobDetail = document.querySelector('div.job-detail div.job-sec-text');
        if (jobDetail) {
            let jobDetailText = jobDetail.textContent;

            let regex = /接受.*应届.*生/;
            let regex2 = /应届.*生.*可/;
            let regex3 = /欢迎.*应届.*生/;
            let regex4 = /应届.*生.*优先/;
            if (regex.test(jobDetailText) || regex2.test(jobDetailText) || regex3.test(jobDetailText) || regex4.test(jobDetailText)) {
                createFloatingPopup("接受应届生", "green");
                return;
            }
        }
    }
    function onlineFilter() {
        console.log('1. bfEle 不存在，执行添加');
        const bfEle = document.querySelector('.__boss_filter.condition-filter-select');
        if (bfEle) {
            console.log('1. bfEle 已经存在');
            // 先移除选中样式
            bfEle.classList.remove('is-select');
        } else {
            // 不存在则创建并添加到DOM树中
            try {
                runGeekJob();
            } catch (error) {
                console.log('新增筛选出错', error);
            }
        }
    }


    function runGeekJob() {
        console.log('dyrunGeekJob')
        // 保存原始的 XMLHttpRequest
        const originalXHR = XMLHttpRequest;

        // 重写 XMLHttpRequest 构造函数
        XMLHttpRequest = function() {
            const xhr = new originalXHR();

            // 重写 open 方法
            const originalOpen = xhr.open;
            xhr.open = function(method, url) {
                //console.log('捕获到请求 URL:', url); // 输出请求的 URL
                if (url.includes('joblist.json')) {
                    //console.log('捕获到 joblist.json 请求:', url);
                }
                return originalOpen.apply(this, arguments); // 调用原始的 open 方法
            };
            // 重写 send 方法
            const originalSend = xhr.send;
            xhr.send = function(data) {
                // 在请求完成时处理响应
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        try {
                            // 确保响应类型是 JSON 格式
                            const data = JSON.parse(xhr.responseText);
                            //console.log('解析后的数据:', data);

                            if (data.zpData && data.zpData.jobList) {
                                const jobList = data.zpData.jobList;
                                jobList.forEach((job, index) => {
                                    //console.log('job',job)
                                    //console.log('职位名称:', job.jobName);
                                    //console.log('公司名称:', job.brandName);
                                    //console.log('bossName',job.bossName)
                                    //console.log('ProxyJob:', job.proxyJob); // 若该字段存在
                                    //console.log('ProxyType:', job.proxyType); // 若该字段
                                    window.localStorage.setItem('jobListData', JSON.stringify(data.zpData.jobList));
                                });
                            }
                        } catch (e) {
                            console.error('解析 joblist.json 响应出错:', e);
                        }
                    } else {
                        console.error('请求失败，状态码:', xhr.status);
                    }
                };
                return originalSend.apply(this, arguments); // 调用原始的 send 方法
            }

            return xhr;
        };
        /*
        // 从localStorage获取职位信息
        const jobDetailProcessed = window.localStorage.getItem('jobDetailProcessed');
        console.log('jobDetailProcessed',jobDetailProcessed)
        if (jobDetailProcessed === 'true') {
            console.log('jobDetailProcessed')
            //try {
            let jobDetailInfo = JSON.parse(window.localStorage.getItem('jobDetailInfo'));
            console.log('jobDetailInfo',jobDetailInfo)
            if (jobDetailInfo) {
                // 提取相关的职位信息
                let { salary, bossInfo, nameText } = jobDetailInfo;
                window.hideJobItem(salary, bossInfo, nameText);
                console.log('czlistItems');
            }
        }*/
        //}
        console.log('2. bfEle 不存在，执行添加');
        // 创建按钮元素
        let button = document.createElement('div');
        button.innerHTML = `<div class="current-select">
    <span class="placeholder-text">浪费时间GUN</span>
</div>`;
        button.classList.add('condition-filter-select', '__boss_filter');

        // 添加点击事件监听器
        button.addEventListener('click', function () {
            // 获取所有的 <li> 元素
            let listItems = document.querySelectorAll('ul.job-list-box > li');
            const jobListData = JSON.parse(window.localStorage.getItem('jobListData')) || [];
            const keywords = ['主播', '直播', '不露脸','打字聊天','老师','讲师','教师','小姐妹','配送','客服'];//标题
            const brandIndustrykey = ['即时配送','培训/辅导机构','文化艺术/娱乐','人力资源服务','物流/仓储']//行业
            const skills = ['其他平台','聊天','娱乐','客服','快手']//标签下简介

            // 遍历每个 <li> 元素
            listItems.forEach(function (item, index) {
                let bossOnlineTag = item.querySelector('span.boss-online-tag');
                console.log('bossOnlineTag',bossOnlineTag);
                let dz = item.querySelector('img.job-tag-icon');
                console.log('dz',dz);
                let jobname = item.querySelector('span.job-name').firstChild.textContent.trim();
                console.log('jobname',jobname);
                const bossname = item.querySelector('div.info-public').firstChild.textContent.trim();
                console.log('bossname',bossname);
                console.log('jobListDataxbossname',jobListData[index].bossName);
                const job = jobListData[index];
                console.log('job',job)
                const brandIndustry = job.brandIndustry
                console.log('brandIndustry',brandIndustry)
                const skillss = job.skills
                console.log('skillss',skillss)
                // 获取当前元素的样式
                let style = window.getComputedStyle(item);

                // 如果没有找到 boss-online-tag 并且元素是可见的，则隐藏该 <li> 元素
                // 如果元素是隐藏的，则显示它
                if ((skills.some(skill => skillss.some(skillssItem => skillssItem.includes(skill))) || brandIndustrykey.some(brandIndustryItem => brandIndustry.includes(brandIndustryItem)) || keywords.some(keyword => jobname.includes(keyword)) || !bossOnlineTag || dz || job.proxyJob === 1) && style.display !== 'none') {
                    item.style.display = 'none';
                } else if (style.display === 'none') {
                    item.style.display = ''; // 使用空字符串将元素的display属性恢复到默认值
                }
            });
        });

        // 将按钮添加到页面中
        document.body.appendChild(button);
        // 插入到父元素 .search-condition-wrapper 最后一个元素之前
        const observer = new MutationObserver(function(mutationsList, observer) {
            let parentNode = document.querySelector('.search-condition-wrapper');
            console.log('parentNode',parentNode)
            if (parentNode !== null) {
                let lastChild = parentNode.lastChild;
                parentNode.insertBefore(button, lastChild);
                observer.disconnect();
            } else {
                console.log('3. parentNode 不存在，无法插入filter');
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        /*
        function startLoop() {
    setTimeout(function loop() {
        console.log("这是每隔一秒输出一次的消息");
        console.log("document",document);
        // 从localStorage获取职位信息
        const jobDetailProcessed = window.localStorage.getItem('jobDetailProcessed');
        console.log('jobDetailProcessed',jobDetailProcessed)
        if (jobDetailProcessed === 'true') {
            console.log('jobDetailProcessed')
            //try {
            let jobDetailInfo = JSON.parse(window.localStorage.getItem('jobDetailInfo'));
            console.log('jobDetailInfo',jobDetailInfo)
            if (jobDetailInfo) {
                // 提取相关的职位信息
                let { salary, bossInfo, nameText } = jobDetailInfo;
                window.hideJobItem(salary, bossInfo, nameText);
                console.log('czlistItems');
            }
        }
        // 这里可以放你需要定时执行的任务

        // 再次调用 setTimeout 来形成递归循环
        setTimeout(loop, 1000);  // 1000 毫秒，即 1 秒
    }, 1000);
}*/
        function startLoop() {
            let isRunning = true;
            // 使用 setInterval 来替代 setTimeout 避免递归堆积
            const intervalId = setInterval(() => {
                if (!isRunning) {
                    clearInterval(intervalId); // 停止循环
                    console.log("循环已停止");
                    return; // 退出循环
                }
                //console.log("这是每隔一秒输出一次的消息");
                //console.log("document", document);

                // 从 localStorage 获取职位信息
                const jobDetailProcessed = window.localStorage.getItem('jobDetailProcessed');
                //console.log('jobDetailProcessed', jobDetailProcessed);

                if (jobDetailProcessed === 'true') {
                    console.log('jobDetailProcessed');

                    // 使用 try-catch 捕获 JSON.parse 错误
                    try {
                        let jobDetailInfo = JSON.parse(window.localStorage.getItem('jobDetailInfo'));
                        console.log('jobDetailInfo', jobDetailInfo);

                        if (jobDetailInfo) {
                            // 提取相关的职位信息
                            let { salary, bossInfo, nameText } = jobDetailInfo;
                            const jobListItems = document.querySelectorAll('ul.job-list-box > li');
                            let foundMatch = false; // 标记是否找到匹配的职位项
                            jobListItems.forEach(function(item) {
                                const itemText = item.textContent;
                                const matchesName = nameText === '' || itemText.includes(nameText);
                                const matchesSalary = salary === '' || itemText.includes(salary);
                                const matchesBossInfo = bossInfo === '' || itemText.includes(bossInfo);
                                // 检查职位项中是否包含相应的名称、薪资和老板信息
                                if (matchesName && matchesSalary && matchesBossInfo) {
                                    item.style.display = 'none';
                                    console.log(`在列表页隐藏职位项: ${nameText}`);
                                    foundMatch = true; // 找到匹配的职位项
                                    window.localStorage.removeItem('jobDetailInfo'); // 删除 jobDetailInfo
                                    window.localStorage.removeItem('jobDetailProcessed'); // 删除 jobDetailProcessed
                                }
                            });
                            // 如果没有找到任何匹配的职位项，清除 localStorage 中的 jobDetailInfo 和 jobDetailProcessed
                            if (!foundMatch) {
                                window.localStorage.removeItem('jobDetailInfo');
                                window.localStorage.removeItem('jobDetailProcessed');
                                console.log('没有找到匹配的职位项，已清除 localStorage 中的 jobDetailInfo 和 jobDetailProcessed');
                            }
                        }
                    } catch (e) {
                        console.error('解析 jobDetailInfo 时发生错误:', e);
                        isRunning = false; // 错误发生时停止循环
                        clearInterval(intervalId); // 清除定时器
                        console.log('循环已停止，因发生错误');
                    }
                }

                // 这里可以放你需要定时执行的任务

            }, 1000); // 1000 毫秒，即 1 秒
        }

        startLoop();
    }
    // 确保页面完全加载后再执行逻辑
    //window.onload = function () {
    let currentUrl = window.location.href;
    console.log('currentUrl',currentUrl)
    if (currentUrl.includes("/job_detail/")) {
        runJobDetail();
    } else if (currentUrl.includes("/geek/job")) {
        console.log('jrzys')
        const observer = new MutationObserver(() => {
            // 确保 DOM 加载完毕再执行 runGeekJob
            //console.log('12. bfEle 不存在，执行添加');
            //console.log('document',document.querySelector);
            //if (document.querySelector('ul.job-list-box')) {
            //console.log('23. bfEle 不存在，执行添加');
            //window.addEventListener('storage', function (event) {
            //if (event.key === 'jobDetailProcessed' && event.newValue === 'true') {
            console.log('jrzy');
            //console.log('document2',document2)
            runGeekJob();
            observer.disconnect(); // 断开观察，避免重复触发
            //};
            //});
            //};
        });
        // 配置 MutationObserver 来观察 DOM 变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        //runGeekJob();
    }
    //}
})();
