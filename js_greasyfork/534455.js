// ==UserScript==
        // @name             📄国开自动刷课（全自动刷完所有课程，但不考试）
        // @namespace        有事联系V:caicats
        // @version          1.0.0
        // @description      国开（国家开放大学）自动刷课（不答题考试） 支持自动访问线上链接、查看资料附件、观看视频、自动查看页面。
        // @author           shanran
        // @match          *://lms.ouchn.cn/course/*
        // @match          *://lms.ouchn.cn/user/courses*
        // @original-author  shanran & caicats
        // @original-license GPL-3.0
        // @license          GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/534455/%F0%9F%93%84%E5%9B%BD%E5%BC%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BC%88%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E5%AE%8C%E6%89%80%E6%9C%89%E8%AF%BE%E7%A8%8B%EF%BC%8C%E4%BD%86%E4%B8%8D%E8%80%83%E8%AF%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534455/%F0%9F%93%84%E5%9B%BD%E5%BC%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BC%88%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E5%AE%8C%E6%89%80%E6%9C%89%E8%AF%BE%E7%A8%8B%EF%BC%8C%E4%BD%86%E4%B8%8D%E8%80%83%E8%AF%95%EF%BC%89.meta.js
        // ==/UserScript==


        // 设置视频播放速度 建议最大4-8倍速 不然可能会卡 没有最大值
        // 并且直接挂载到window上
        window.playbackRate = 8;

        // 设置各种不同类型的课程任务之间的时间延迟，以便脚本在进行自动化学习时可以更好地模拟人类操作。
        const interval = {
            loadCourse: 6000, // 加载课程列表的延迟时间
            viewPage: 6000, // 查看页面类型课程的延迟时间
            onlineVideo: 3000, // 播放在线视频课程的延迟时间
            webLink: 3000, // 点击线上链接类型课程的延迟时间
            forum: 3000, // 发帖子给论坛课程的延迟时间
            material: 3000, // 查看附件类型课程的延迟时间
            other: 3000 // 处理其他未知类型课程的延迟时间
        };

        (async function (window, document) {

            // 保存值到本地存储
            function GM_setValue(name, value) {
                localStorage.setItem(name, JSON.stringify(value));
            }

            //从本地存储获取值
            function GM_getValue(name, defaultValue) {
                const value = localStorage.getItem(name);
                if (value === null) {
                    return defaultValue;
                }
                try {
                    return JSON.parse(value);
                } catch (e) {
                    console.error(`Error parsing stored value for ${name}:`, e);
                    return defaultValue;
                }
            }

            // 运行
            main();

            // 使用正则表达式从当前 URL 中提取出课程 ID。
            async function getCourseId() {
                // 判断是否在课程页面
                if(/lms.ouchn.cn\/course\//.test(window.location.href)) {
                    const courseId = (await waitForElement("#courseId", interval.loadCourse))?.value;
                    return courseId;
                }
                return null;
            }

            // 创建返回到课程列表页面的函数。
            async function returnCoursePage(waitTime = 500) {
                const backElement = await waitForElement("a.full-screen-mode-back", waitTime);
                if (backElement) {
                    backElement?.click();
                } else {
                    throw new Error("异常 无法获取到返回课程列表页面的元素！");
                }
            }

            // 返回到一级页面（我的课程中心）
            async function returnToCourseCenter(waitTime = 500) {
                console.log("返回到课程中心页面");
                window.location.href = "https://lms.ouchn.cn/user/courses#/";
            }

            // 将中文类型名称转换为英文枚举值。
            function getTypeEum(type) {
                switch (type) {
                    case "页面":
                        return "page";
                    case "音视频教材":
                        return "online_video";
                    case "线上链接":
                        return "web_link";
                    case "讨论":
                        console.log("讨论页面...");
                        return "forum";
                    case "参考资料":
                        return "material";
                    default:
                        return null;
                }
            }

            /**
             * 等待指定元素出现
             * 返回一个Promise对象，对document.querySelector封装了一下
             * @param selector dom选择器,像document.querySelector一样
             * @param waitTime 等待时间 单位: ms
             */
            async function waitForElement(selector, waitTime = 1000, maxCount = 10) {
                let count = 0;
                return new Promise(resolve => {
                    let timeId = setInterval(() => {
                        const element = document.querySelector(selector);
                        if (element || count >= maxCount) {
                            clearInterval(timeId);
                            resolve(element || null);
                        }
                        count++;
                    }, waitTime);
                });
            }

            /**
             * 等待多个指定元素出现
             * 返回一个Promise对象，对document.querySelectorAll封装了一下
             * @param selector dom选择器,像document.querySelectorAll一样
             * @param waitTime 等待时间 单位: ms
             */
            async function waitForElements(selector, waitTime = 1000, maxCount = 10) {
                let count = 0;
                return new Promise(resolve => {
                    let timeId = setInterval(() => {
                        const element = document.querySelectorAll(selector);
                        if (element || count >= maxCount) {
                            clearInterval(timeId);
                            resolve(element || null);
                        }
                        count++;
                    }, waitTime);
                });
            }

            // 等待指定时间
            function wait(ms) {
                return new Promise(resolve => { setTimeout(resolve, ms); });
            }

            /**
             * 该函数用于添加学习行为时长
             */
            function addLearningBehavior(activity_id, activity_type) {
                const duration = Math.ceil(Math.random() * 300 + 40);
                const data = JSON.stringify({
                    activity_id,
                    activity_type,
                    browser: 'chrome',
                    course_id: globalData.course.id,
                    course_code: globalData.course.courseCode,
                    course_name: globalData.course.name,
                    org_id: globalData.course.orgId,
                    org_name: globalData.user.orgName,
                    org_code: globalData.user.orgCode,
                    dep_id: globalData.dept.id,
                    dep_name: globalData.dept.name,
                    dep_code: globalData.dept.code,
                    user_agent: window.navigator.userAgent,
                    user_id: globalData.user.id,
                    user_name: globalData.user.name,
                    user_no: globalData.user.userNo,
                    visit_duration: duration
                });
                const url = 'https://lms.ouchn.cn/statistics/api/user-visits';
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url,
                        data,
                        type: "POST",
                        cache: false,
                        contentType: "text/plain;charset=UTF-8",
                        complete: resolve
                    });
                });
            }

            // 打开并播放在线视频课程。
            async function openOnlineVideo() {
                // 等待 video 或 audio 元素加载完成
                const videoElem = await waitForElement('video');
                let audioElem = null;

                if (!videoElem) {
                    audioElem = await waitForElement('audio');
                }

                if (videoElem) {
                    // 处理视频元素
                    console.log("正在播放视频中...");

                    // 设置播放速率
                    videoElem.playbackRate = playbackRate;

                    // 监听播放速率变化事件并重新设置播放速率
                    videoElem.addEventListener('ratechange', function () {
                        videoElem.playbackRate = playbackRate;
                    });

                    // 监听视频播放结束事件
                    videoElem.addEventListener('ended', returnCoursePage);

                    // 延迟一会儿以等待视频加载
                    await wait(interval.onlineVideo);

                    // // 每隔一段时间检查是否暂停，并模拟点击继续播放并设置声音音量为0
                    setInterval(() => {
                        videoElem.volume = 0;
                        if (document.querySelector("i.mvp-fonts.mvp-fonts-play")) {
                            document.querySelector("i.mvp-fonts.mvp-fonts-play").click();
                        }
                    }, interval.onlineVideo);

                } else if (audioElem) {
                    // 处理音频元素
                    console.log("正在播放音频中...");

                    // 监听音频播放结束事件
                    audioElem.addEventListener("ended", returnCoursePage);

                    // 延迟一会儿以等待音频加载
                    await wait(interval.onlineVideo);

                    // 每隔一段时间检查是否暂停，并模拟点击继续播放
                    setInterval(() => {
                        audioElem.volume = 0;
                        if (document.querySelector("i.font.font-audio-play")) {
                            document.querySelector("i.font.font-audio-play").click();
                        }
                    }, interval.onlineVideo);
                }
            }

            // 打开并查看页面类型课程。
            function openViewPage() {
                // 当页面被加载完毕后延迟一会直接返回课程首页
                setTimeout(returnCoursePage, interval.viewPage);
            }

            // 打开并点击线上链接类型课程。
            async function openWebLink() {
                // 等待获取open-link-button元素
                const ElementOpenLinkButton = await waitForElement(".open-link-button", interval.webLink);

                // 设置元素属性让它不会弹出新标签并设置href为空并模拟点击
                ElementOpenLinkButton.target = "_self";
                ElementOpenLinkButton.href = "javascript:void(0);";
                ElementOpenLinkButton.click();

                // 等待一段时间后执行returnCoursePage函数
                setTimeout(returnCoursePage, interval.webLink);
            }
            function openApiMaterial() { // 用API去完成查看附件
                const id = document.URL.match(/.*\/\/lms.ouchn.cn\/course\/[0-9]+\/learning-activity\/full-screen.+\/([0-9]+)/)[1];
                const res = new Promise((resolve, reject) => {
                    $.ajax({
                        url: `https://lms.ouchn.cn/api/activities/${id}`,
                        type: "GET",
                        success: resolve,
                        error: reject
                    })
                });
                res.then(async ({ uploads: uploadsModels }) => {
                    uploadsModels.forEach(async ({ id: uploadId }) => {
                        await wait(interval.material);
                        await new Promise(resolve => $.ajax({
                            url: `https://lms.ouchn.cn/api/course/activities-read/${id}`,
                            type: "POST",
                            data: JSON.stringify({ upload_id: uploadId }),
                            contentType: "application/json",
                            dataType: "JSON",
                            success: resolve,
                            error: resolve
                        }));
                    });

                    await wait(interval.material);
                    returnCoursePage();
                });
                res.catch((xhr, status, error) => {
                    console.log(`这里出现了一个异常 | status: ${status}`);
                    console.dir(error, xhr, status);
                });

            }

            // 打开课程任务并查找已有帖子进行回复
            async function openForum() {
                // 先等待页面完全加载
                console.log('进入讨论页面（三级页面），等待页面加载完成...');
                await wait(interval.forum * 3);  // 增加等待时间，确保JS渲染完成

                // 设置唯一标识符，用于页面间通信
                const replyId = 'forum_reply_' + Date.now();

                // 清除所有之前的回帖标识
                clearPreviousReplyIds();

                // 将当前回帖标识加上"active"前缀，用于四级页面检索
                localStorage.setItem('active_reply_id', replyId);
                localStorage.setItem(replyId, 'waiting'); // 设置初始状态为等待中
                console.log(`设置回帖标识: ${replyId}, 状态: waiting, 并设为活动标识`);

                // 查找第一篇帖子的可见DOM元素
                console.log('查找第一篇帖子的可见DOM元素...');

                // 尝试查找可见的帖子元素（标题、内容等）
                const visibleSelectors = [
                    // 常见的帖子标题和内容选择器
                    '.title',
                    '.topic-title',
                    '.post-title',
                    '.thread-title',
                    '.discussion-title',
                    // 帖子内容区域
                    '.content',
                    '.post-content',
                    '.topic-content',
                    '.thread-content',
                    // 帖子项容器
                    '.item',
                    '.post-item',
                    '.topic-item',
                    '.thread-item',
                    '.discussion-item',
                    // 列表项
                    'li.item',
                    '.list-item',
                    // 通用选择器
                    '[role="article"]',
                    '[role="listitem"]',
                    // 包含特定文本的元素
                    'div:not(:empty)',
                    'p:not(:empty)',
                    'span:not(:empty)'
                ];

                let firstPostElement = null;
                let elementFound = false;

                // 首先尝试查找可点击的元素
                for (const selector of visibleSelectors) {
                    console.log(`尝试查找可点击的帖子元素: ${selector}`);
                    const elements = document.querySelectorAll(selector);

                    for (const element of elements) {
                        // 检查元素是否可见
                        if (element.offsetParent !== null &&
                            element.style.display !== 'none' &&
                            element.style.visibility !== 'hidden') {

                            // 检查元素或其父元素是否可点击
                            const clickableElement = element.closest('a') ||
                                                   element.closest('button') ||
                                                   element.closest('[role="button"]') ||
                                                   element.closest('[onclick]') ||
                                                   element.closest('[class*="clickable"]') ||
                                                   element.closest('[class*="selectable"]');

                            if (clickableElement) {
                                console.log('找到可点击的帖子元素:', clickableElement);
                                firstPostElement = clickableElement;
                                elementFound = true;
                                break;
                            }

                            // 如果元素本身包含文本内容，可能是帖子标题或内容
                            const text = element.textContent.trim();
                            if (text.length > 10 && !text.includes('回复') && !text.includes('发表')) {
                                console.log('找到可能的帖子内容元素:', element);
                                firstPostElement = element;
                                elementFound = true;
                                break;
                            }
                        }
                    }

                    if (elementFound) break;
                }

                // 如果上面的方法都找不到，尝试直接找帖子链接
                if (!firstPostElement) {
                    console.log("尝试直接查找帖子链接...");
                    const linkSelectors = [
                        'a[href*="topic"]',
                        'a[href*="discussion"]',
                        'a[href*="thread"]',
                        'a[href*="forum"]',
                        'a[href*="post"]',
                        '.topic-list a',
                        '.discussion-list a',
                        '.thread-list a',
                        'a.topic-title'
                    ];

                    for (const selector of linkSelectors) {
                        console.log(`尝试链接选择器: ${selector}`);
                        const links = document.querySelectorAll(selector);
                        if (links && links.length > 0) {
                            firstPostElement = links[0];
                            console.log(`找到帖子链接: ${firstPostElement.href || '无href属性'}`);
                            break;
                        }
                    }
                }

                if (!firstPostElement) {
                    console.error("无法找到任何可见的帖子元素，尝试查找列表容器...");

                    // 尝试查找列表容器
                    const listSelectors = [
                        '.list',
                        '.topic-list',
                        '.post-list',
                        '.thread-list',
                        '.discussion-list',
                        '[role="list"]',
                        'ul',
                        'ol'
                    ];

                    let listContainer = null;
                    for (const selector of listSelectors) {
                        listContainer = document.querySelector(selector);
                        if (listContainer) {
                            console.log(`找到列表容器: ${selector}`);
                            // 查找第一个非空的子元素
                            const children = Array.from(listContainer.children);
                            for (const child of children) {
                                if (child.textContent.trim().length > 0) {
                                    firstPostElement = child;
                                    console.log('找到第一个非空列表项');
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }

                // 最后的尝试 - 查找所有链接
                if (!firstPostElement) {
                    console.log("最后尝试：查找所有可见链接...");
                    const allLinks = document.querySelectorAll('a');
                    for (const link of allLinks) {
                        // 跳过导航链接和空链接
                        if (link.href &&
                            !link.href.includes('javascript:') &&
                            !link.href.includes('#') &&
                            link.offsetParent !== null &&
                            !link.textContent.includes('登录') &&
                            !link.textContent.includes('注册') &&
                            !link.textContent.includes('忘记密码')) {

                            console.log(`找到一个可能的链接: ${link.textContent} - ${link.href}`);
                            firstPostElement = link;
                            break;
                        }
                    }
                }

                if (!firstPostElement) {
                    console.error("无法找到任何帖子元素，准备返回课程页面");
                    // 更新回帖状态为错误
                    localStorage.setItem(replyId, 'error');
                    setTimeout(returnCoursePage, interval.forum);
                    return;
                }

                // 尝试点击找到的元素
                console.log('尝试点击帖子元素');
                try {
                    // 如果元素本身不可点击，尝试模拟点击事件
                    if (!firstPostElement.click) {
                        const clickEvent = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        firstPostElement.dispatchEvent(clickEvent);
                    } else {
                        firstPostElement.click();
                    }

                    console.log('已触发点击事件');

                    // 等待一段时间，确保新窗口打开
                    await wait(interval.forum);

                    // 记录当前页面的回帖标识
                    window.forumReplyId = replyId;
                    console.log(`已保存回帖标识: ${replyId}, 开始等待回帖完成`);

                    // 开始轮询检查回帖状态，并设置超时
                    checkReplyStatus(replyId);
                    setReplyTimeout(replyId, 60); // 设置60秒超时

                } catch (e) {
                    console.error('点击帖子元素失败:', e);
                    localStorage.setItem(replyId, 'error'); // 标记为错误
                    setTimeout(returnCoursePage, interval.forum);
                }
            }

            // 清除之前的回帖标识
            function clearPreviousReplyIds() {
                try {
                    // 查找并删除可能的过期标识
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith('forum_reply_') && key !== 'active_reply_id') {
                            console.log(`清除旧回帖标识: ${key}`);
                            localStorage.removeItem(key);
                        }
                    }
                    // 确保没有活动状态标识
                    localStorage.removeItem('active_reply_id');
                } catch (e) {
                    console.error('清除过期标识失败:', e);
                }
            }

            // 设置回帖超时
            function setReplyTimeout(replyId, seconds) {
                console.log(`设置回帖超时: ${replyId}, ${seconds}秒`);
                setTimeout(() => {
                    const status = localStorage.getItem(replyId);
                    if (status === 'waiting') {
                        console.log(`回帖超时: ${replyId}, 自动标记为完成`);
                        localStorage.setItem(replyId, 'completed');
                        // 触发storage事件
                        localStorage.setItem(`${replyId}_timestamp`, Date.now().toString());
                    }
                }, seconds * 1000);
            }

            // 检查回帖状态的函数
            function checkReplyStatus(replyId) {
                console.log(`检查回帖状态: ${replyId}`);
                const status = localStorage.getItem(replyId);

                if (status === 'completed' || status === 'error') {
                    console.log(`回帖${status === 'completed' ? '已完成' : '失败'}，标识: ${replyId}, 准备返回课程页面`);
                    try {
                        localStorage.removeItem(replyId); // 清理
                        localStorage.removeItem('active_reply_id'); // 清理活动标识
                    } catch (e) {
                        console.error('清理localStorage失败:', e);
                    }
                    setTimeout(returnCoursePage, interval.forum);
                } else {
                    // 继续等待，每2秒检查一次
                    console.log(`回帖仍在进行中，标识: ${replyId}, 继续等待...`);
                    setTimeout(() => checkReplyStatus(replyId), 2000);
                }
            }

            // 处理四级页面的回帖操作
            async function replyForum() {
                console.log('进入四级页面（回帖页面），等待页面加载完成...');
                await wait(interval.forum * 3); // 延长等待时间确保页面完全加载

                // 优先从active_reply_id获取标识
                let replyId = localStorage.getItem('active_reply_id');

                if (replyId) {
                    console.log(`从活动标识获取回帖ID: ${replyId}`);
                }

                // 如果没有活动标识，使用之前的方法尝试查找
                if (!replyId) {
                    // 尝试从URL参数中获取
                    try {
                        const params = new URLSearchParams(window.location.search);
                        replyId = params.get('replyId');
                    } catch (e) {
                        console.log('URL参数中没有找到replyId');
                    }

                    // 尝试从localStorage中查找等待中的回帖标识
                    if (!replyId) {
                        console.log('尝试从localStorage查找等待中的回帖标识');
                        for (let i = 0; i < localStorage.length; i++) {
                            const key = localStorage.key(i);
                            if (key && key.startsWith('forum_reply_') && localStorage.getItem(key) === 'waiting') {
                                replyId = key;
                                console.log(`找到等待中的回帖标识: ${replyId}`);
                                break;
                            }
                        }
                    }
                }

                if (!replyId) {
                    console.log('没有找到回帖标识，创建新标识');
                    replyId = 'forum_reply_' + Date.now();
                    localStorage.setItem(replyId, 'waiting');
                }

                console.log(`当前回帖标识: ${replyId}`);

                // 首先查找并点击输入框激活编辑器
                console.log('查找输入框以激活编辑器...');
                const inputSelectors = [
                    'input[placeholder*="讨论"]',
                    'input[placeholder*="回复"]',
                    'input.ivu-input',
                    '.reply-input',
                    '.comment-input',
                    'textarea[placeholder*="回复"]',
                    'textarea[placeholder*="讨论"]'
                ];

                let inputElem = null;
                for (const selector of inputSelectors) {
                    console.log(`尝试查找输入框: ${selector}`);
                    inputElem = await waitForElement(selector, interval.forum/3, 3);
                    if (inputElem) {
                        console.log(`找到输入框，使用选择器: ${selector}`);
                        break;
                    }
                }

                if (inputElem) {
                    console.log('点击输入框激活编辑器');
                    try {
                        // 尝试不同的方法来激活输入框
                        inputElem.focus();
                        inputElem.click();

                        // 触发各种可能的事件
                        const events = ['focus', 'click', 'mousedown', 'mouseup', 'change'];
                        events.forEach(eventType => {
                            const event = new Event(eventType, { bubbles: true });
                            inputElem.dispatchEvent(event);
                        });

                        // 等待编辑器激活
                        console.log('等待编辑器激活...');
                        await wait(interval.forum);
                    } catch (e) {
                        console.error('激活输入框失败:', e);
                    }
                } else {
                    console.log('未找到输入框，尝试直接查找编辑区域');
                }

                // 查找编辑区域
                console.log('查找可编辑区域...');
                const editorSelectors = [
                    '.simditor-body[contenteditable="true"]',
                    '[contenteditable="true"]',
                    '.simditor-body.needsclick[contenteditable="true"]',
                    '.reply-editor [contenteditable]',
                    '.comment-editor [contenteditable]',
                    '.post-editor [contenteditable]'
                ];

                let editorElem = null;
                for (const selector of editorSelectors) {
                    console.log(`尝试查找编辑区域: ${selector}`);
                    editorElem = await waitForElement(selector, interval.forum/3, 3);
                    if (editorElem) {
                        console.log(`找到编辑区域，使用选择器: ${selector}`);
                        break;
                    }
                }

                if (!editorElem) {
                    console.error("无法找到编辑区域，尝试查找回复按钮...");

                    // 尝试查找"回复"按钮，可能需要先点击
                    const replyBtnSelectors = [
                        'button:contains("回复")',
                        'a:contains("回复")',
                        '.reply-btn',
                        '.comment-btn',
                        'button.reply',
                        'a.reply-link'
                    ];

                    let replyBtn = null;
                    for (const selector of replyBtnSelectors) {
                        // 处理jQuery特有的:contains选择器
                        if (selector.includes(':contains')) {
                            const text = selector.match(/:contains\("(.+)"\)/)[1];
                            const buttons = Array.from(document.querySelectorAll('button, a')).filter(el =>
                                el.textContent.includes(text)
                            );
                            if (buttons.length > 0) {
                                replyBtn = buttons[0];
                                console.log(`找到回复按钮，文本包含: ${text}`);
                                break;
                            }
                        } else {
                            replyBtn = document.querySelector(selector);
                            if (replyBtn) {
                                console.log(`找到回复按钮，使用选择器: ${selector}`);
                                break;
                            }
                        }
                    }

                    if (replyBtn) {
                        console.log('点击回复按钮');
                        replyBtn.click();

                        // 点击后等待回帖框出现
                        await wait(interval.forum);

                        // 再次尝试查找编辑区域
                        for (const selector of editorSelectors) {
                            editorElem = await waitForElement(selector, interval.forum/3, 3);
                            if (editorElem) {
                                console.log(`点击回复按钮后找到编辑区域，使用选择器: ${selector}`);
                                break;
                            }
                        }
                    }
                }

                if (!editorElem) {
                    console.error("无法找到编辑区域，准备关闭页面");
                    window.close();
                    return;
                }

                // 在找到编辑区域后，先点击它以确保激活
                console.log('点击编辑区域确保激活');
                try {
                    editorElem.focus();
                    editorElem.click();
                } catch (e) {
                    console.error('点击编辑区域失败:', e);
                }

                await wait(500);

                // 查找提交按钮
                const submitSelectors = [
                    // 优先使用带有"发表回帖"文本的按钮
                    'button.ivu-btn.ivu-btn-primary:contains("发表回帖")',
                    'button.w-88.ivu-btn.ivu-btn-primary',
                    'button.ivu-btn.ivu-btn-primary:not([type="submit"])',
                    '.ivu-btn.ivu-btn-primary span:contains("发表")',
                    '.ivu-btn.ivu-btn-primary span:contains("回帖")',
                    // 其他可能的选择器
                    'button[type="button"].ivu-btn.ivu-btn-primary',
                    'button.submit-reply',
                    'button.post-reply',
                    // 之前的选择器作为备选
                    'button:contains("提交")',
                    'button:contains("回复")',
                    'button.submit',
                    'button.reply-submit',
                    '.reply-footer button',
                    '.post-btn',
                    '.submit-btn',
                    'button.ivu-btn-primary:not(.ivu-btn-ghost)',
                    'button[type="submit"]'
                ];

                let submitBtn = null;
                for (const selector of submitSelectors) {
                    // 处理jQuery特有的:contains选择器
                    if (selector.includes(':contains')) {
                        const text = selector.match(/:contains\("(.+)"\)/)[1];
                        // 尝试匹配按钮本身或其子元素中的文本
                        let buttons = Array.from(document.querySelectorAll('button')).filter(el =>
                            el.textContent.includes(text) ||
                            Array.from(el.querySelectorAll('span')).some(span => span.textContent.includes(text))
                        );

                        if (buttons.length === 0 && selector.includes('.ivu-btn')) {
                            // 特殊处理ivu-btn类型按钮的span子元素
                            const spans = Array.from(document.querySelectorAll('.ivu-btn span')).filter(span =>
                                span.textContent.includes(text)
                            );
                            buttons = spans.map(span => span.closest('button')).filter(btn => btn !== null);
                        }

                        if (buttons.length > 0) {
                            submitBtn = buttons[0];
                            console.log(`找到提交按钮，文本包含: ${text}`);
                            break;
                        }
                    } else {
                        submitBtn = document.querySelector(selector);
                        if (submitBtn) {
                            console.log(`找到提交按钮，使用选择器: ${selector}`);
                            break;
                        }
                    }
                }

                // 如果上面的选择器都没找到，尝试查找所有含有"发表"或"回帖"文本的按钮
                if (!submitBtn) {
                    console.log("尝试查找所有含有发表或回帖文本的按钮");
                    const allButtons = document.querySelectorAll('button');

                    for (const btn of allButtons) {
                        const text = btn.textContent.trim().toLowerCase();
                        if (text.includes('发表') || text.includes('回帖') || text.includes('提交') || text.includes('回复')) {
                            submitBtn = btn;
                            console.log(`找到提交按钮，含有文本: ${text}`);
                            break;
                        }
                    }
                }

                // 如果还找不到，尝试寻找特定类名的按钮
                if (!submitBtn) {
                    console.log("尝试通过样式和位置定位提交按钮");
                    // 查找页面上的主要按钮（通常是底部的大按钮）
                    const primaryButtons = document.querySelectorAll('.ivu-btn-primary');
                    if (primaryButtons.length > 0) {
                        // 尝试找到最后一个（通常是提交按钮）
                        submitBtn = primaryButtons[primaryButtons.length - 1];
                        console.log("根据位置找到可能的提交按钮");
                    }
                }

                if (!submitBtn) {
                    console.error("无法找到提交按钮，准备关闭页面");

                    // 输出所有按钮用于调试
                    console.log("页面上所有按钮:");
                    const allButtons = document.querySelectorAll('button');
                    for (let i = 0; i < allButtons.length; i++) {
                        console.log(`按钮${i+1}: class="${allButtons[i].className}", text="${allButtons[i].textContent.trim()}", type="${allButtons[i].type}"`);
                    }

                    window.close();
                    return;
                }

                // 记录找到的按钮信息
                console.log("找到的提交按钮详细信息:");
                console.log(`- 类名: ${submitBtn.className}`);
                console.log(`- 文本: ${submitBtn.textContent.trim()}`);
                console.log(`- 类型: ${submitBtn.type}`);
                console.log(`- HTML: ${submitBtn.outerHTML}`);

                // 填写回帖内容
                console.log('填写回帖内容');
                const timestamp = Date.now();
                try {
                    // 尝试多种方式设置内容
                    const content = `学习了，感谢分享！${timestamp}`;

                    // 1. 直接设置innerHTML
                    editorElem.innerHTML = `<p>${content}</p>`;
                    console.log('方法1: 设置innerHTML');

                    // 2. 使用execCommand
                    document.execCommand('selectAll', false, null);
                    document.execCommand('insertText', false, content);
                    console.log('方法2: 使用execCommand');

                    // 3. 创建文本节点并插入
                    if (editorElem.innerHTML === "<p><br></p>" || editorElem.innerHTML === "") {
                        const p = document.createElement('p');
                        p.textContent = content;
                        editorElem.innerHTML = '';
                        editorElem.appendChild(p);
                        console.log('方法3: 创建并插入文本节点');
                    }

                    // 4. 尝试查找相关的textarea并更新其值
                    try {
                        const textareas = document.querySelectorAll('textarea');
                        if (textareas.length > 0) {
                            for (const textarea of textareas) {
                                textarea.value = content;
                                console.log('更新相关textarea');
                                // 触发change事件
                                const event = new Event('input', { bubbles: true });
                                textarea.dispatchEvent(event);

                                const changeEvent = new Event('change', { bubbles: true });
                                textarea.dispatchEvent(changeEvent);
                            }
                        }
                    } catch (e) {
                        console.error('更新textarea失败:', e);
                    }

                    console.log('回帖内容设置完成');
                } catch (e) {
                    console.error('设置回帖内容失败:', e);
                }

                // 等待一会再提交
                await wait(interval.forum);

                // 检查是否确实填入了内容
                console.log('检查编辑区域内容:', editorElem.innerHTML);

                // 点击提交
                console.log('点击提交按钮');
                try {
                    submitBtn.click();
                    console.log('提交按钮点击完成');
                } catch (e) {
                    console.error('点击提交按钮失败:', e);
                }

                // 等待提交完成
                console.log('等待回帖提交完成...');
                await wait(interval.forum * 2);

                // 检查是否提交成功，或者有错误信息
                const errorMessages = document.querySelectorAll('.error-message, .alert-error, .ivu-message-error');
                let finalStatus = 'completed'; // 默认设置为完成

                if (errorMessages.length > 0) {
                    console.error('提交过程中出现错误:', errorMessages[0].textContent);

                    // 如果有权限错误，标记为error
                    if (errorMessages[0].textContent.includes('权限')) {
                        console.log('权限错误，可能需要其他方式回帖');
                        finalStatus = 'error';
                    }
                }

                // 更新状态并确保写入成功
                try {
                    localStorage.setItem(replyId, finalStatus);
                    // 验证写入
                    const verifyStatus = localStorage.getItem(replyId);
                    if (verifyStatus !== finalStatus) {
                        console.error(`状态写入验证失败，期望: ${finalStatus}, 实际: ${verifyStatus}`);
                        // 重试一次
                        localStorage.setItem(replyId, finalStatus);
                    }
                } catch (e) {
                    console.error('更新localStorage失败:', e);
                }

                console.log(`回帖${finalStatus === 'completed' ? '成功' : '失败'}，更新标识: ${replyId} -> ${finalStatus}`);

                // 确保状态更新后再关闭窗口
                setTimeout(() => {
                    try {
                        // 再次确认状态已正确设置
                        const finalCheck = localStorage.getItem(replyId);
                        if (finalCheck !== finalStatus) {
                            console.log(`关闭前发现状态不匹配，重新设置为: ${finalStatus}`);
                            localStorage.setItem(replyId, finalStatus);
                        }
                        console.log(`关闭窗口前的最终状态: ${localStorage.getItem(replyId)}`);
                    } catch (e) {
                        console.error('最终状态检查失败:', e);
                    }

                    // 使用storage事件确保跨窗口通信
                    try {
                        // 触发一个特殊的storage事件来确保状态更新被检测到
                        localStorage.setItem(`${replyId}_timestamp`, Date.now().toString());
                        localStorage.setItem(replyId, finalStatus);
                    } catch (e) {
                        console.error('触发storage事件失败:', e);
                    }

                    window.close();
                }, interval.forum);
            }

            // 添加storage事件监听器，用于跨窗口通信
            window.addEventListener('storage', function(e) {
                // 检查是否是回帖状态更新
                if (e.key && e.key.startsWith('forum_reply_')) {
                    console.log(`检测到回帖状态更新: ${e.key} -> ${e.newValue}`);
                    // 如果当前页面正在等待这个回帖完成，主动触发状态检查
                    if (window.forumReplyId === e.key) {
                        checkReplyStatus(e.key);
                    }
                }
            });

            // 课程首页处理
            async function courseIndex() {
                const courseId = await getCourseId();
                if (!courseId) {
                    console.error("无法获取课程ID");
                    return;
                }

                await new Promise(resolve => {
                    console.log("正在展开所有课程任务");
                    let timeId = setInterval(() => {
                        const allCollapsedElement = document.querySelector("i.icon.font.font-toggle-all-collapsed");
                        const allExpandedElement = document.querySelector("i.icon.font.font-toggle-all-expanded");
                        if (!allExpandedElement) {
                            if (allCollapsedElement) {
                                allCollapsedElement.click();
                            }
                        }
                        if (!allCollapsedElement && !allExpandedElement) { throw new Error("无法展开所有课程 可能是元素已更改，请联系作者更新。"); } {
                            console.log("课程展开完成。");
                            clearInterval(timeId);
                            resolve();
                        }
                    }, interval.loadCourse);
                });


                console.log("正在获取加载的课程任务");
                const courseElements = await waitForElements('.learning-activity .clickable-area', interval.loadCourse);

                const courseElement = Array.from(courseElements).find(elem => {
                    const type = $(elem.querySelector('i.font[original-title]')).attr('original-title'); // 获取该课程任务的类型
                    // const status = $(elem.querySelector('span.item-status')).text(); // 获取该课程任务是否进行中
                    // 👆上行代码由于无法获取到课程任务是否已关闭，目前暂时注释掉


                    const typeEum = getTypeEum(type);

                    if (!typeEum) {
                        return false;
                    }

                    const completes = elem.querySelector('.ivu-tooltip-inner b').textContent === "已完成" ? true : false;

                    // const result = status === "进行中" && typeEum != null && completes === false;
                    const result = typeEum != null && completes === false;
                    if (result) {
                        GM_setValue(`typeEum-${courseId}`, typeEum);
                    }
                    return result;
                });

                if (courseElement) {
                    console.log("发现未完成的课程任务");
                    $(courseElement).click();
                } else {
                    console.log("课程任务可能全部完成了，返回课程中心");
                    // 所有课程已完成，记录该课程ID为已完成
                    const completedCourses = GM_getValue('completedCourses', []);
                    if (!completedCourses.includes(courseId)) {
                        completedCourses.push(courseId);
                        GM_setValue('completedCourses', completedCourses);
                        console.log(`已将课程 ${courseId} 标记为已完成，不会再次学习该课程`);
                    }
                    // 返回课程中心
                    returnToCourseCenter();
                }
            }

            // 处理一级页面（课程中心）
            async function courseCenterIndex() {
                console.log("正在课程中心页面，检索未完成的课程...");

                // 获取已标记为完成的课程列表
                const completedCourses = GM_getValue('completedCourses', []);
                if (completedCourses.length > 0) {
                    console.log(`已有 ${completedCourses.length} 个课程被标记为已完成: ${completedCourses.join(', ')}`);
                }

                // 等待页面完全加载，延长等待时间
                await wait(interval.loadCourse * 3);

                // 首先尝试获取DOM结构，用于调试
                console.log("页面结构分析中...");
                const mainContainer = document.querySelector('#app') || document.querySelector('.container-main');

                if (mainContainer) {
                    console.log("找到主容器");

                    // 各种可能的课程卡片选择器（从具体到通用）
                    const selectors = [
                        '.my-course-list .course-item',
                        '.course-list .course-item',
                        '.course-list-wrapper .course-item',
                        '.el-card.course-item',
                        '.course-panel',
                        '.my-course-panel',
                        '[class*="course-item"]',
                        '.el-card',
                        '.card'
                    ];

                    let courseCards = null;

                    // 尝试所有可能的选择器
                    for (const selector of selectors) {
                        console.log(`尝试使用选择器: ${selector}`);
                        courseCards = await waitForElements(selector, interval.loadCourse, 5);

                        if (courseCards && courseCards.length > 0) {
                            console.log(`使用选择器 ${selector} 找到 ${courseCards.length} 个课程卡片`);
                            break;
                        }
                    }

                    // 如果还是找不到课程卡片，记录更详细的DOM结构
                    if (!courseCards || courseCards.length === 0) {
                        console.log("无法找到课程卡片，开始分析DOM结构...");

                        // 记录主要容器的内容结构
                        console.log("主容器内容结构：", mainContainer.innerHTML.substring(0, 500) + "...");

                        // 查找所有可能的容器元素
                        const possibleContainers = mainContainer.querySelectorAll('.container, .wrapper, .list, .panel, .content, .card-container');
                        console.log(`找到 ${possibleContainers.length} 个可能的容器元素`);

                        for (let i = 0; i < possibleContainers.length; i++) {
                            console.log(`容器 ${i+1} 结构: `, possibleContainers[i].outerHTML.substring(0, 300) + "...");
                        }

                        // 查找所有链接，看是否有课程链接
                        const allLinks = mainContainer.querySelectorAll('a[href*="/course/"]');
                        console.log(`找到 ${allLinks.length} 个课程链接`);

                        if (allLinks.length > 0) {
                            // 直接使用找到的课程链接
                            console.log("基于课程链接遍历");

                            for (let i = 0; i < allLinks.length; i++) {
                                const link = allLinks[i];
                                // 提取链接中的课程ID
                                const courseIdMatch = link.href.match(/\/course\/(\d+)/);
                                if (!courseIdMatch) continue;

                                const courseId = courseIdMatch[1];

                                // 检查课程是否已标记为完成
                                if (completedCourses.includes(courseId)) {
                                    console.log(`跳过已标记为完成的课程: ${courseId}`);
                                    continue;
                                }

                                const card = link.closest('.card') || link.closest('.panel') || link.closest('.item') || link.parentElement;

                                // 查找课程完成度信息
                                const progressText = getProgressText(card);

                                if (progressText) {
                                    console.log(`课程${i+1}(ID: ${courseId})进度文本: ${progressText}`);
                                    const progressMatch = progressText.match(/(\d+)%/) || progressText.match(/(\d+)/);

                                    if (progressMatch && progressMatch[1]) {
                                        const progressPercent = parseInt(progressMatch[1]);
                                        console.log(`课程${i+1}(ID: ${courseId})完成度: ${progressPercent}%`);

                                        // 如果完成度低于90%，点击进入该课程
                                        if (progressPercent < 90) {
                                            console.log(`找到完成度低于90%的课程: ${progressPercent}%，准备进入该课程`);
                                            link.click();
                                            return; // 结束函数，进入二级页面
                                        }
                                    }
                                } else {
                                    console.log(`课程${i+1}(ID: ${courseId})无法找到进度信息`);
                                }
                            }
                        }

                        console.log("没有找到完成度低于90%的未完成课程，所有课程可能已完成");
                        return;
                    }

                    console.log(`找到 ${courseCards.length} 个课程卡片，开始遍历`);

                    // 遍历所有课程卡片，寻找完成度低于90%的课程
                    for (let i = 0; i < courseCards.length; i++) {
                        const card = courseCards[i];

                        // 找到课程卡片中的链接元素
                        const courseLink = card.querySelector('a.course-link') ||
                                          card.querySelector('a[href*="/course/"]') ||
                                          card.querySelector('a');

                        if (!courseLink || !courseLink.href) {
                            console.log(`课程${i+1}找不到有效链接，跳过`);
                            continue;
                        }

                        // 提取链接中的课程ID
                        const courseIdMatch = courseLink.href.match(/\/course\/(\d+)/);
                        if (!courseIdMatch) {
                            console.log(`课程${i+1}无法提取课程ID，跳过`);
                            continue;
                        }

                        const courseId = courseIdMatch[1];

                        // 检查课程是否已标记为完成
                        if (completedCourses.includes(courseId)) {
                            console.log(`跳过已标记为完成的课程: ${courseId}`);
                            continue;
                        }

                        // 获取进度文本
                        const progressText = getProgressText(card);

                        if (!progressText) {
                            console.log(`课程${i+1}(ID: ${courseId})无法找到进度信息，记录整个卡片内容：`);
                            console.log(card.innerHTML);
                            continue;
                        }

                        console.log(`课程${i+1}(ID: ${courseId})进度文本: ${progressText}`);

                        const progressMatch = progressText.match(/(\d+)%/) || progressText.match(/(\d+)/);

                        if (progressMatch && progressMatch[1]) {
                            const progressPercent = parseInt(progressMatch[1]);
                            console.log(`课程${i+1}(ID: ${courseId})完成度: ${progressPercent}%`);

                            // 如果完成度低于90%，点击进入该课程
                            if (progressPercent < 90) {
                                console.log(`找到完成度低于90%的课程: ${progressPercent}%，准备进入该课程`);

                                if (courseLink) {
                                    console.log("点击进入课程: " + courseLink.href);
                                    courseLink.click();
                                    return; // 结束函数，进入二级页面
                                } else {
                                    console.log("找不到课程链接元素，打印卡片内容：");
                                    console.log(card.innerHTML);
                                }
                            }
                        } else {
                            console.log(`无法解析课程${i+1}(ID: ${courseId})的完成度百分比，文本内容: ${progressText}`);
                        }
                    }
                } else {
                    console.log("未找到主容器，尝试直接搜索课程链接");

                    // 尝试直接查找课程链接
                    const courseLinks = document.querySelectorAll('a[href*="/course/"]');

                    if (courseLinks && courseLinks.length > 0) {
                        console.log(`找到 ${courseLinks.length} 个课程链接，尝试查找进度信息`);

                        for (let i = 0; i < courseLinks.length; i++) {
                            const link = courseLinks[i];

                            // 提取链接中的课程ID
                            const courseIdMatch = link.href.match(/\/course\/(\d+)/);
                            if (!courseIdMatch) continue;

                            const courseId = courseIdMatch[1];

                            // 检查课程是否已标记为完成
                            if (completedCourses.includes(courseId)) {
                                console.log(`跳过已标记为完成的课程: ${courseId}`);
                                continue;
                            }

                            const card = link.closest('.card') || link.closest('.panel') || link.closest('.item') || link.parentElement;

                            if (card) {
                                const progressText = getProgressText(card);

                                if (progressText) {
                                    console.log(`课程${i+1}(ID: ${courseId})进度文本: ${progressText}`);
                                    const progressMatch = progressText.match(/(\d+)%/) || progressText.match(/(\d+)/);

                                    if (progressMatch && progressMatch[1]) {
                                        const progressPercent = parseInt(progressMatch[1]);
                                        console.log(`课程${i+1}(ID: ${courseId})完成度: ${progressPercent}%`);

                                        if (progressPercent < 90) {
                                            console.log(`找到完成度低于90%的课程: ${progressPercent}%，准备进入`);
                                            link.click();
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                console.log("没有找到完成度低于90%的未完成课程，所有课程可能已完成");
            }

            /**
             * 获取进度文本的辅助函数
             * @param {Element} card - 课程卡片元素
             * @returns {string|null} - 进度文本或null
             */
            function getProgressText(card) {
                // 尝试各种可能的选择器查找进度元素
                const progressSelectors = [
                    '.course-progress-text',
                    '.progress-text',
                    '[class*="progress"]',
                    '[class*="percent"]',
                    '.course-item-footer',
                    '.footer',
                    '.status',
                    '.complete'
                ];

                let progressElement = null;

                for (const selector of progressSelectors) {
                    progressElement = card.querySelector(selector);
                    if (progressElement) break;
                }

                if (!progressElement) {
                    // 尝试查找包含"%"的任意元素
                    const allElements = card.querySelectorAll('*');
                    for (const el of allElements) {
                        if (el.textContent && el.textContent.includes('%')) {
                            progressElement = el;
                            break;
                        }
                    }
                }

                return progressElement ? progressElement.textContent.trim() : null;
            }

            function main() {
                // 判断当前在哪个页面
                // 一级页面：课程中心
                if (/https:\/\/lms.ouchn.cn\/user\/courses/m.test(document.URL)) {
                    console.log("当前在一级页面（课程中心）");
                    courseCenterIndex();
                }
                // 二级页面：课程首页
                else if (/https:\/\/lms.ouchn.cn\/course\/\d+\/ng.*#\//m.test(document.URL)) {
                    console.log("当前在二级页面（课程首页）");
                    courseIndex();
                }
                // 四级页面：帖子回复页面 - 在三级页面之前检查，因为可能有相似的URL模式
                else if (/https:\/\/lms.ouchn.cn\/course\/\d+\/learning-activity\/\d+/m.test(document.URL) ||
                         document.referrer.includes('learning-activity/full-screen') ||
                         document.URL.includes('forum') ||
                         document.URL.includes('topic') ||
                         document.URL.includes('discussion')) {
                    console.log("检测到可能是四级页面（帖子回复页面）");
                    replyForum();
                    return;
                }
                // 三级页面：具体任务页面
                else if (/http[s]?:\/\/lms.ouchn.cn\/course\/\d+\/learning-activity\/full-screen[#]?\//.test(window.location.href)) {
                    console.log("当前在三级页面（具体任务页面）");
                    const courseId = window.location.href.match(/http[s]?:\/\/lms.ouchn.cn\/course\/(\d+)/)[1];
                    const activity_id = window.location.href.match(/http[s]?:\/\/lms.ouchn.cn\/course\/\d+\/learning-activity\/full-screen[#]?\/(\d+)/)[1];
                    const typeEum = GM_getValue(`typeEum-${courseId}`, null);
                    addLearningBehavior(activity_id, typeEum);
                    switch (typeEum) {
                        case "page":
                            console.log("正在查看页面。");
                            openViewPage();
                            return;
                        case "online_video":
                            openOnlineVideo();
                            return;
                        case "web_link":
                            console.log("正在点击外部链接~");
                            openWebLink();
                            return;
                        case "forum":
                            console.log("准备查找帖子并回复...");
                            openForum();
                            return;
                        case "material":
                            console.log("正在给课件发送已阅读状态");
                            openApiMaterial();
                            return;
                        default:
                            setTimeout(returnCoursePage, interval.other);
                            return;
                    }
                }
            }
        })(window, document);