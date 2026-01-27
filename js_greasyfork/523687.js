// ==UserScript==
// @name         b站评论区保存为html (bili-comments-to-html)
// @namespace    http://tampermonkey.net/
// @version      0.6.9
// @description  删除b站视频及动态中的多余元素，展开评论区二级回复，调整页面样式，为通过SingleFile等工具导出网页备份评论区做准备。必须搭配油猴脚本“Bilibili - 在未登录的情况下照常加载评论”使用。
// @license      GPL-3.0
// @author       MonkeyBro
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/opus/*
// @match        https://t.bilibili.com/*
// @exclude      https://t.bilibili.com/?tab=*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523687/b%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E4%BF%9D%E5%AD%98%E4%B8%BAhtml%20%28bili-comments-to-html%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523687/b%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E4%BF%9D%E5%AD%98%E4%B8%BAhtml%20%28bili-comments-to-html%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentUrl = window.location.href; // 网页链接

    // 以下分类用于区分链接，以调整网页样式
    let isVideo, isOpus, isT;
    if (currentUrl.includes('bilibili.com/video')) { isVideo = true} // 视频
    else if (currentUrl.includes('bilibili.com/opus')) { isOpus = true} // 新版（动态）
    else if (/^https:\/\/t\.bilibili\.com\/\d+$/.test(currentUrl)) { isT = true} // 通用（动态）

    // 以下子分类用于区分新版动态和通用动态的实际内容，以调整文件名（注意不存在“新版-视频”和“新版-转发”）
    let isVideoSubmission; // 视频
    let isTextSubmission; // 专栏
    let isText; // 普通
    let isForward; // 转发

    let singleFileName = ''; // singlefile文件名

    let isScriptExecuting = false; // 脚本是否正在执行
    let isScriptSuccess = false; // 脚本是否已成功执行过

    let overlay; // 页面变暗的覆盖层
    let messageBar; // 脚本执行提示条

    let isDataLoaded = false; // 判断页面是否加载完毕，以便在一次网页刷新中重复启动脚本时顺利进行

    let elementsToRemove; // 待删除元素（部分）

    const webOpenTime = getWebOpenTime(); // 打开网页的时刻

    // 参数时间单位都为毫秒
    let isIgnoreIdleTimeCheck = true; // 是否忽略原定的跳转底部的停滞检查，默认false，改为true以应对免登录脚本5.2版底部文字问题
    const scrollMaxIdleTime_Temp = 2000; // 忽略后的临时停滞时间

    const clickLastedInterval = 1000; // 点击最新按钮后的等待时间
    const scrollTime = 200; // 跳转到页面底部的时间
    const scrollCheckInterval = 600; // 检查跳转到页面底部的间隔
    const scrollMaxIdleTime = 10000; // 页面底部无变化最多的停滞时间（原定）
    const anchorForLoadingText = '所有评论已加载完毕'; // 加载完毕的文字
    let isCommentLoading = true; // 评论区初始状态为正在加载
    let lastScrollHeight = 0; // 记录上一次页面的高度

    const clickIntervalMin = 100; // 展开二级回复的最小间隔
    const clickIntervalMax = 200; // 展开二级回复的最大间隔

    console.log('页面打开时刻: ', webOpenTime); // 输出打开网页的时刻

    adjustBeforeSingleFile(); // 在singlefile保存网页前调整网页

    // 输出打开网页的时刻，方便不使用该脚本后续功能，只是单纯截图时，知晓这个图片的保存时间。也便于调试脚本
    function getWebOpenTime() {
        const visitYearLocale = String(new Date().getFullYear()).slice(-2);
        const visitMonthLocale = String(new Date().getMonth() + 1).padStart(2, '0');
        const visitDayLocale = String(new Date().getDate()).padStart(2, '0');
        const visitTimeLocale = new Date().toLocaleTimeString();
        const formattedTime = `${visitYearLocale}-${visitMonthLocale}-${visitDayLocale} ${visitTimeLocale}`;
        return formattedTime;
    }

    // 使用方式1：正常使用singlefile，脚本会在singlefile保存网页前自动调整网页
    async function adjustBeforeSingleFile() {
        dispatchEvent(new CustomEvent("single-file-user-script-init"));

        addEventListener("single-file-on-before-capture-request", async event => {
            event.preventDefault();
            try {
                await waitForVisibility(); // 等待标签页变为可见
                await start(); // 开始脚本功能
                console.log('start 函数执行完毕');
            } catch (error) {
                console.log('start 函数有错误');
            } finally {
                dispatchEvent(new CustomEvent("single-file-on-before-capture-response"));
            }
        });
    }

    // 等待标签页变为可见
    async function waitForVisibility() {
        // 如果标签页已经是可见的，直接执行
        if (document.visibilityState === 'visible') {
            console.log('标签页当前可见，直接执行函数');
            return;
        }

        // 如果标签页不是可见的，则等待可见性变化
        return new Promise((resolve) => {
            function onVisibilityChange() {
                if (document.visibilityState === 'visible') {
                    // 标签页切换到前台，执行函数
                    console.log('标签页变为可见，开始执行函数');
                    resolve(); // 解除等待
                    document.removeEventListener('visibilitychange', onVisibilityChange); // 移除事件监听
                }
            }

            // 监听 visibilitychange 事件
            document.addEventListener('visibilitychange', onVisibilityChange);
        });
    }

    // 使用方式2：快捷键启动脚本调整网页
    window.addEventListener('keydown', function(event) {
        // Ctrl + Shift + Alt + Z 展开评论区，可根据需要修改快捷键
        if (!isScriptExecuting && event.ctrlKey && event.shiftKey && event.altKey && event.key === 'Z') {
            start();
        }
    });

    async function start() {
        if (isScriptSuccess) { return;}
        console.log('脚本开始执行');

        // 初始化变量
        isCommentLoading = true;
        isScriptExecuting = true;

        // 创建变暗的覆盖层
        createDarkOverlay();
        // 显示提示条
        showMessage();
        // 等待页面初步加载完毕
        await waitLoading();
        // 设置singlefile保存文件名
        setSingleFileName();
        // 初步修改样式
        preModifyStyle();
        // 初步删除页面中绝大部分没用的元素
        await preRemove();
        // 删除剩余元素
        otherRemove();
        // 点击最新按钮
        modifyMessage('加载评论区');
        clickLastedButton();

        // 等待评论区初步加载
        await new Promise(resolve => setTimeout(resolve, clickLastedInterval));

        // 开始自动跳转到底部
        try {
            await startAutoScrollToBottom();
        } catch (error) {
            modifyMessage('加载评论区失败，请刷新网页重试');
            // 在文件名中添加错误提示
            singleFileName = singleFileName.replace(/\/([^\/]*)$/, '/【错误:滚动加载评论区失败】$1');
            console.error('错误:', '滚动加载评论区失败');
            console.log('脚本结束');
            end();
            throw new Error(error);
        }

        // 展开二级回复
        modifyMessage('展开二级回复');
        try {
            await clickViewMoreBtns();
        } catch (error) {
            messageBar.innerText = '展开二级回复失败，请刷新网页重试。仍未解决请等一段时间再试';
            // 在文件名中添加错误提示
            singleFileName = singleFileName.replace(/\/([^\/]*)$/, '/【错误:展开二级回复失败】 $1');
            console.error('错误:', '展开二级回复失败');
            console.log('脚本结束');
            end();
            throw new Error(error);
        }

        // 修改动态相册样式
        await modifyStyleAlbum();
        // 修改样式
        modifyStyle();
        // 脚本结束
        modifyMessage('网页调整结束');
        end();
    }

    // 创建一个模拟页面变暗的透明覆盖层
    function createDarkOverlay() {
        overlay = document.createElement('div');
        overlay.id = 'darkOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 半透明的黑色
        overlay.style.zIndex = '9998'; // 确保它在页面内容下方但低于提示条
        overlay.style.pointerEvents = 'none'; // 不干扰页面操作
        document.body.appendChild(overlay);
    }

    // 创建并显示提示条
    function showMessage() {
        messageBar = document.createElement('div');
        messageBar.id = 'stickyMessage';
        messageBar.style.position = 'fixed';
        messageBar.style.top = '0';
        messageBar.style.left = '0';
        messageBar.style.width = '100%';
        messageBar.style.padding = '10px';
        messageBar.style.backgroundColor = '#ff9800'; // 使用鲜亮的背景色
        messageBar.style.color = '#fff'; // 白色文本
        messageBar.style.textAlign = 'center';
        messageBar.style.zIndex = '9999'; // 确保提示条在最上面
        messageBar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)'; // 提示条阴影
        messageBar.style.fontSize = '20px'; // 设置字体大小
        document.body.appendChild(messageBar);
    }

    // 创建并显示提示条
    function modifyMessage(message) {
        messageBar.innerText = message;
    }

    //删除覆盖和提示
    function removeOverlayAndMessage() {
        messageBar?.remove();
        overlay?.remove();
    }

    // 等待页面初步加载完毕
    async function waitLoading() {
        const checkAndRunScript = async () => {
            const dataLoaded = document.querySelector('iframe[src="https://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe.html"][data-loaded="true"]');
            if (dataLoaded) {
                isDataLoaded = true;
                console.log('网页加载完毕');
                return 'case1';
            } else if (isDataLoaded) { // 脚本已执行过，直接跳到滚动底部功能
                console.log('网页已加载过');
                return 'case2';
            } else {
                await new Promise(resolve => setTimeout(resolve, 500)); // 每0.5秒检查一次
                return checkAndRunScript();
            }
        };

        return await checkAndRunScript(); // 初始调用
    }

    // 获取为singlefile准备的保存文件名
    function setSingleFileName() {
        let result = '';

        // 定义需要替换的特殊字符的正则表达式
        let specialCharsRegexA = /[<>:"/\\|?*\r\n]/g; //常见特殊字符，替换为空格
        let specialCharsRegexB = /[\u200B\u200C\u200D\uFEFF]/g; // 零宽空格，删除

        if (isVideo) {
            let author = '';
            const upName = document.querySelector('a.up-name')?.textContent;
            let staffNameAll = '';
            const staffNameList = document.querySelectorAll('a.staff-name');
            for (const staff of staffNameList) {
                staffNameAll += staff.textContent + ' ' ; // 最后一次循环多加了一个空格
            }
            let time = document.querySelector('.pubdate-ip-text')?.textContent || '';
            let title = document.querySelector('.video-title')?.textContent || '';
            let reply = document.querySelector('.total-reply')?.textContent || '';

            time = time.substring(2); //年份格式改为YY
            time = time.replace(/(\d{2}) (\d{2}):(\d{2}):(\d{2})/, "$1T$2$3");

            title = title.replace(specialCharsRegexA, ' ');
            title = title.replace(specialCharsRegexB, '');
            title = title.replace(/\s+/g, ' ').trim(); // 去除连续的空格
            title = title.length > 20 ? title.substring(0, 20).replace(/ +$/, '') + '…' : title.replace(/ +$/, ''); //保留前20个字符，去除末尾空格

            author = upName?.slice(7, upName.length - 7) || staffNameAll?.slice(0, -1);

            reply = '(' + reply + '评论)';

            result += author + '/' + time + ' (视频) ' + title + ' ' + reply;
        } else if (isOpus) {
            let author = document.querySelector('.opus-module-author__name')?.textContent || '';
            let time = document.querySelector('.opus-module-author__pub__text')?.textContent || '';
            let title = document.querySelector('.opus-module-title__text')?.textContent || '';
            let content = document.querySelector('.opus-module-content')?.textContent || '';
            let resultContent;
            let classification; // 分类
            let reply = document.querySelector('.bili-tabs__nav__item.is-active')?.textContent || '';

            time = (time.includes('编辑于') ? '(' + time.substring(6) + '编辑)' : time.substring(2)); //年份格式改为YY
            time = time.replace(/(\d{2})年(\d{2})月(\d{2})日 (\d{2}):(\d{2})/, "$1-$2-$3T$4$5");

            resultContent = title !== '' ? title : (content !== '' ? content : '(无字)');
            if (resultContent !== '(无字)') {
                resultContent = resultContent.replace(specialCharsRegexA, ' ').replace(specialCharsRegexB, '').replace(/\s+/g, ' ').trim(); //替换或去除特殊字符，去除连续空格
                resultContent = resultContent.length > 20 ? resultContent.substring(0, 20).replace(/ +$/, '') + '…' : resultContent.replace(/ +$/, ''); //保留前20个字符，去除末尾空格
            }

            if (document.querySelector('.opus-module-bottom')) {
                classification = '新版-专栏';
            } else {
                classification = '新版-普通';
            }

            reply = reply.substring(3);
            reply = reply == '' ? '(0评论)' : '(' + reply + '评论)';

            result += author + '/' + time + ' (' + classification + ') ' + resultContent + ' ' + reply;
        } else if (isT) {
            let author = document.querySelector('span.bili-dyn-title__text')?.textContent || '';
            let time = document.querySelector('.bili-dyn-time')?.textContent || '';
            let title = document.querySelector('[class="dyn-card-opus"] .dyn-card-opus__title')?.textContent || '';
            let content = document.querySelector('.bili-rich-text__content')?.textContent || '';
            let timeText = time;
            let resultContent;
            let classification; // 分类
            let reply = document.querySelector('.bili-tabs__nav__item.is-active')?.textContent || '';

            author = author.slice(4, author.length - 3);
            time = time.substring(5, 20); //开头3个文字为空格。年份格式改为YY
            time = time.replace(/(\d{2})年(\d{2})月(\d{2})日 (\d{2}):(\d{2})/, "$1-$2-$3T$4$5");

            resultContent = title !== '' ? title : (content !== '' ? content : '(无字)');
            if (resultContent !== '(无字)') {
                resultContent = resultContent.replace(specialCharsRegexA, ' ').replace(specialCharsRegexB, '').replace(/\s+/g, ' ').trim(); //替换或去除特殊字符，去除连续空格
                resultContent = resultContent.length > 20 ? resultContent.substring(0, 20).replace(/ +$/, '') + '…' : resultContent; //保留前20个字符，去除末尾空格
            }

            if (timeText.includes('投稿了视频') || timeText.includes('发布了动态视频')) {
                classification = '通用-视频';
            }
            else if (timeText.includes('投稿了文章')) {
                classification = '通用-专栏';
            }
            else if (document.querySelector('.bili-dyn-content__orig.reference')) {
                classification = '通用-转发';
            }
            else {
                classification = '通用-普通';
            }

            reply = reply.substring(3);
            reply = reply == '' ? '(0评论)' : '(' + reply + '评论)';

            result += author + '/' + time + ' (' + classification + ') ' + resultContent + ' ' + reply;
        }

        // 以页面打开时刻作为保存时间
        let webOpenTimeNew = webOpenTime.replace(/(\d{2}) (\d{2}):(\d{2}):(\d{2})/, "$1T$2$3");
        result += ' (' + webOpenTimeNew + ')';

        singleFileName = result

        console.log('文件名：' + result);
        console.log('文件名设置完毕');
    }

    // 初步修改样式
    function preModifyStyle() {
        if (isVideo) {
            // 将up主信息移动到标题栏后
            const upPanelContainer = document.querySelector('.up-panel-container'); // up主信息
            const videoInfoContainer = document.querySelector('.video-info-container'); // 标题栏
            if (upPanelContainer && videoInfoContainer) {
                videoInfoContainer.parentNode.insertBefore(upPanelContainer, videoInfoContainer.nextSibling);
            }

            // 将封面添加到up主信息后
            const imgElement = document.createElement('img');
            imgElement.className = 'video-cover';
            imgElement.src = ('https:' + document.querySelector('meta[itemprop="image"]')?.getAttribute('content')).replace(/@.*/, "");
            upPanelContainer.parentNode.insertBefore(imgElement, upPanelContainer.nextSibling);
        }
        console.log('初步修改样式完毕');
    }

    // 初步删除页面中绝大部分没用的元素(减少文件体积并保护隐私)
    async function preRemove() {
        // 获取head元素
        const head = document.head || document.getElementsByTagName('head')[0];
        const headElements = Array.from(head.children);
        var keepHeadElements;

        // 公用的保留的head元素条件
        const commonHeadElements = [
            { tag: 'STYLE', innerHTMLInclude: '.reply-item .root-reply-avatar .avatar .bili-avatar' },
            { tag: 'STYLE', innerHTMLInclude: '.fan-medal' },
            { tag: 'STYLE', innerHTMLInclude: '.sub-reply-container .view-more-btn:hover' },
            { tag: 'STYLE', innerHTMLInclude: '.jump-link' },
            { tag: 'STYLE', innerHTMLInclude: ':root' },
            { tag: 'TITLE' },
        ];

        // 保留的head元素条件
        if (isVideo) {
            keepHeadElements = [
                ...commonHeadElements,
                { tag: 'Link', href: '//s1.hdslb.com/bfs/seed/jinkela/short/bili-theme/map.css' },
                { tag: 'Link', href: '//s1.hdslb.com/bfs/seed/jinkela/short/bili-theme/light.css' },
                { tag: 'Link', href: '//s1.hdslb.com/bfs/static/jinkela/video/css/video' },
                { tag: 'STYLE', id: 'setSizeStyle' },
                { tag: 'Meta', itemprop: 'image' },
            ];
        } else if (isOpus) {
            keepHeadElements = [
                ...commonHeadElements,
                { tag: 'Link', href: '//s1.hdslb.com/bfs/seed/jinkela/short/bili-theme/map.css' },
                { tag: 'Link', href: '//s1.hdslb.com/bfs/seed/jinkela/short/bili-theme/light_u.css' },
                { tag: 'Link', href: '//s1.hdslb.com/bfs/seed/jinkela/short/bili-theme/light.css' },
                // { tag: 'Link', href: '//s1.hdslb.com/bfs/static/stone-free/opus-detail/css/opus-detail' },
                // { tag: 'Link', href: '//s1.hdslb.com/bfs/static/stone-free/opus-detail/css/opus-detail' },
                { tag: 'Link', href: '//s1.hdslb.com/bfs/static/2233-monorepo/opus-detail/css/opus-detail.1.32ed816815fb5678f0e5be8ddd2c54b9444bf7ee.css' },
                { tag: 'Link', href: '//s1.hdslb.com/bfs/static/2233-monorepo/opus-detail/css/opus-detail.0.32ed816815fb5678f0e5be8ddd2c54b9444bf7ee.css' },
                { tag: 'STYLE', type: 'text/css' },
                { tag: 'STYLE', id: 'bmgstyle-b-img__inner' },
            ];
        } else if (isT) {
            keepHeadElements = [
                ...commonHeadElements,
                { tag: 'STYLE', type: 'text/css' },
                { tag: 'STYLE', id: 'bmgstyle-b-img__inner' },
            ];
        }

        // 处理head中的元素
        headElements.forEach(element => {
            // 保留指定的head元素
            const shouldKeep = keepHeadElements.some(item => {
                const tagMatch = element.tagName === item.tag.toUpperCase();
                const hrefMatch = item.href ? element.href && element.href.includes(item.href) : true;
                const typeMatch = item.type ? element.type === item.type : true;
                const idMatch = item.id ? element.id === item.id : true;
                const innerHTMLIncludeMatch = item.innerHTMLInclude ? element.innerHTML.includes(item.innerHTMLInclude) : true;
                return tagMatch && hrefMatch && typeMatch && idMatch && innerHTMLIncludeMatch;
            });

            if (!shouldKeep) {
                element.remove();
            }
        });

        // 获取body元素
        const body = document.body;
        const bodyElements = Array.from(body.children);
        var keepBodyElements;

        // 公用的保留的body元素条件
        const commonBodyElements = [
            //脚本增加的覆盖和提示
            { tag: 'DIV', id: 'darkOverlay' },
            { tag: 'DIV', id: 'stickyMessage' },
        ];

        // 保留的body元素条件
        if (isVideo || isOpus) {
            keepBodyElements = [
                ...commonBodyElements,
                { tag: 'DIV', id: 'app' },
            ];
        }
        else if (isT) {
            keepBodyElements = [
                ...commonBodyElements,
                { tag: 'Link', href: '//s1.hdslb.com/bfs/static/2233-monorepo/dyn-detail/static/css/index.36f3a9c5.css' },
                { tag: 'DIV', id: 'app' },
            ];
        }

        // 处理body中的元素
        bodyElements.forEach(element => {
            // 保留指定的body元素
            const shouldKeep = keepBodyElements.some(item => {
                const tagMatch = element.tagName === item.tag.toUpperCase();
                const hrefMatch = item.href ? element.href && element.href.includes(item.href) : true;
                const idMatch = item.id ? element.id === item.id : true;
                return tagMatch && hrefMatch && idMatch;
            });
            if (!shouldKeep) {
                element.remove();
            }
        });

        // 删除edge浏览器中的多余元素。其他浏览器待测试
        // 获取html元素并遍历其直接子元素
        const html = document.documentElement; // 获取 <html> 元素
        const siblingElements = Array.from(html.children); // 获取 html 下的所有直接子元素（包括 <head> 和 <body>）

        // 定义需要移除的同级元素条件
        const removeSiblingElements = [
            { tag: 'DIV', style: 'all: initial;' },
            { tag: 'DIV', id: 'immersive-translate-popup' }
        ];

        // 处理同级元素
        siblingElements.forEach(element => {
            const shouldRemove = removeSiblingElements.some(item => {
                // 检查元素的style是否包含all: initial
                const style = element.getAttribute('STYLE') || '';
                const isStyleMatching = style.includes('all: initial');
                const isIdMatching = !item.id || element.id === item.id;

                // 如果匹配到条件，移除元素
                return element.tagName === item.tag.toUpperCase() && isStyleMatching && isIdMatching;
            });

            if (shouldRemove) {
                element.remove();
            }
        });
        console.log('初步删除完毕');
    }

    // 删除剩余元素
    function otherRemove() {
        if (isVideo) {
            elementsToRemove = [
                '#biliMainHeader',
                '#playerWrap',
                '.right-container',
                '.toggle-btn',
                '.fixed-sidenav-storage',
                '.activity-m-v1',
                '.video-toolbar-right',
                '.ad-report',
            ];
        }
        else if (isOpus) {
            elementsToRemove = [
                '.right-sidebar-wrap',
                '.fixed-author-header',
                '.opus-module-bottom',
            ];
        }
        else if (isT) {
            elementsToRemove = [
                '.sidebar-wrap',
            ];
        }

        const mainReplyBox = document.querySelector('.main-reply-box');
        if (mainReplyBox) {
            // 移除
            mainReplyBox.remove();
        }

        // 删除元素
        elementsToRemove.forEach(function(selector) {
            var element = document.querySelector(selector);
            if (element) {
                element.remove();
            }
        });
        console.log('删除剩余元素完毕');
    }

    // 点击最新按钮
    function clickLastedButton() {
        const lastedButton = document.querySelector('.time-sort');
        if (lastedButton) {
            lastedButton.click();
            console.log('点击最新按钮完毕');
        }
    }

    // 开始自动滚动到底部
    async function startAutoScrollToBottom() {
        let lastScrollHeight = document.body.scrollHeight;
        let lastUpdateTime = Date.now(); // 记录上次页面变化时间

        while (isCommentLoading) {
            // 判断页面是否加载完成
            const isPageLoaded = monitorPageLoad(lastScrollHeight, lastUpdateTime);

            if (isPageLoaded === 'case1') { // 页面加载完毕，退出循环
                isCommentLoading = false;
                break;
            } else if (isPageLoaded === 'case2') { // 页面加载失败，退出函数
                isCommentLoading = false;
                throw new Error('滚动加载评论区失败'); // 抛出错误
            } else if (isPageLoaded === 'case3') { // 页面正在加载
                await smoothScrollToBottom(scrollTime); // 500ms内完成滚动
            }

            await new Promise(resolve => setTimeout(resolve, scrollCheckInterval)); // 等待一定时间后再继续检查

            // 如果页面高度发生变化，更新上次变化的时间
            if (document.body.scrollHeight !== lastScrollHeight) {
                lastScrollHeight = document.body.scrollHeight;
                lastUpdateTime = Date.now(); // 更新最后的变化时间
            }
        }

        console.log('评论区滚动加载完毕');
    }

    // 平滑滚动到底部
    function smoothScrollToBottom(duration) {
        return new Promise(resolve => {
            const start = window.pageYOffset;
            const distance = document.body.scrollHeight - window.innerHeight - start;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const scrollAmount = easeInOutQuad(
                    timeElapsed,
                    start,
                    distance,
                    duration
                );
                window.scrollTo(0, scrollAmount);
                if (timeElapsed < duration) {
                    window.requestAnimationFrame(animation);
                } else {
                    resolve();
                }
            }

            // 缓动函数 - 提供加速/减速效果
            function easeInOutQuad(t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            }

            window.requestAnimationFrame(animation);
        });
    }

    // 判断是否加载完毕
    function monitorPageLoad(lastScrollHeight, lastUpdateTime) {
        const currentScrollHeight = document.body.scrollHeight;
        const anchorForLoading = document.querySelector('.anchor-for-loading');

        // 没有评论
        if (document.querySelector('p.no-more-replies-info')) {
            return 'case1'; // 加载完成
        }

        if (anchorForLoading) { // 加载文字存在
            // 加载文字完成
            if (anchorForLoading.textContent.trim() === anchorForLoadingText) {
                return 'case1'; // 加载完成
            }
            // 加载文字未完成，页面高度相同
            else if(currentScrollHeight === lastScrollHeight) {
                // 是否忽略原定停滞检测
                if (isIgnoreIdleTimeCheck && Date.now() - lastUpdateTime > scrollMaxIdleTime_Temp) {
                    console.log('忽略原定停滞检测');
                    return 'case1'; // 加载完成
                }

                // 如果页面高度长时间没有变化，认为加载失败
                if (Date.now() - lastUpdateTime > scrollMaxIdleTime) {
                    console.log('页面加载停滞，认为加载失败');
                    return 'case2'; // 加载失败
                }
            }
        } else if(currentScrollHeight === lastScrollHeight) { // 加载文字不存在
            // 是否忽略停滞检测
            if (isIgnoreIdleTimeCheck && Date.now() - lastUpdateTime > scrollMaxIdleTime_Temp) {
                console.log('忽略原定停滞检测');
                return 'case1'; // 加载完成
            }

            // 如果页面高度长时间没有变化，认为加载完成
            if (Date.now() - lastUpdateTime > scrollMaxIdleTime) {
                console.log('页面加载停滞，认为加载完成');
                return 'case1'; // 加载完成
            }
            return 'case3'; // 页面仍在加载
        }

        lastScrollHeight = currentScrollHeight; // 更新页面高度
        return 'case3'; // 页面仍在加载
    }

    // 展开二级回复
    async function clickViewMoreBtns() {
        // 获取按钮
        const viewMoreBtnList = document.querySelectorAll('.view-more-btn');
        for (const viewMoreBtn of viewMoreBtnList) {
            if (viewMoreBtn) {
                // 生成随机延迟时间
                const delay = Math.floor(Math.random() * (clickIntervalMax - clickIntervalMin + 1)) + clickIntervalMin;
                viewMoreBtn.click();
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        // 延迟后再次检查按钮
        await new Promise(resolve => setTimeout(() => {
            // 再次获取按钮
            const viewMoreBtnListRemain = document.querySelectorAll('.view-more-btn');
            if (viewMoreBtnListRemain.length > 0) {
                throw new Error('展开二级回复失败'); // 抛出错误
            }
            resolve();
        }, 1000));

        console.log('展开二级回复完毕');
    }

    // 修改动态相册样式
    async function modifyStyleAlbum() {
        if (isOpus){
            // 检查相册是否存在
            const album = document.querySelector('.opus-module-top__album');
            if (!album) {
                return;
            }

            // 修改padding
            GM_addStyle(`
				.opus-module-top__album {
					padding-left: 20px !important;
					padding-right: 20px !important;
				}

                .horizontal-scroll-album__pic {
					cursor: default !important; /* 图片鼠标样式设为默认 */
				}
            `);

            // 获取所有缩略图
            const images = document.querySelectorAll('.horizontal-scroll-album__pic');
            // 检查图片数量
            if (images?.length <= 1) {
                return;
            }
            const navNext = document.querySelector('.horizontal-scroll-album__nav__next');

            // 依次点击所有缩略图
            for (let index = 0; index < images.length; index++) {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        // 点击缩略图
                        navNext.click();
                        resolve();
                    }, 200); // 延迟200ms，避免过快点击
                });
            }

            // 行列排布
            const imageElems = document.querySelectorAll('.horizontal-scroll-album__pic__img');
            const gallery = document.querySelector('.horizontal-scroll-album__screen');
            const galleryWidth = gallery.offsetWidth;
            const gap = 5; // 间隔
            const columnDefault = 6; // 预设列数
            const column = images.length > 6 ? columnDefault : images.length; // 列数

            GM_addStyle(`
				.horizontal-scroll-album__screen {
					flex-wrap: wrap !important; /* 允许换行 */
					gap: ${gap}px !important;
				}

				.horizontal-scroll-album__pic {
					margin-left: 0px !important; /* 去掉原本的间隔 */
					width: calc((100% - (${column} - 1) * ${gap}px) / ${column}) !important; /* 设置宽度 */
					height: auto !important; /* 高度自适应 */
					aspect-ratio: 1 / 1 !important; /* 保持图片为方形 */
				}

                .horizontal-scroll-album__pic__img {
                	width: 100% !important;  /* 确保图片宽度适应容器 */
                	height: 100% !important; /* 高度自动调整，保持比例 */
                }
            `);

            // 直接调整每张实际图片的尺寸，修改element.style属性
            imageElems.forEach(img => {
                // 选择实际的图片元素，并调整它们的尺寸
                const actualImage = img.querySelector('img');
                if (actualImage) {
                    // 清除图片的 width 和 height 属性，防止原始属性覆盖
                    actualImage.removeAttribute('width');
                    actualImage.removeAttribute('height');

                    // 强制设置图片的宽度和高度
                    actualImage.style.width = '100%'; // 强制设置图片宽度适应父容器
                    actualImage.style.height = '100%'; // 高度按比例调整
                    actualImage.style.objectFit = 'cover'; // 保持等比缩放
                }
            });

            // 修改父元素的element.style属性
            const albumContent = document.querySelector('.horizontal-scroll-album__content');
            if (window.getComputedStyle(images[0]).width < albumContent.style.height) {
                albumContent.style.height = 'auto';
                albumContent.style.width = 'auto';
            }
            document.querySelector('.horizontal-scroll-album__screen').style.transform = 'none';

            // 移除导航按钮
            document.querySelector('.horizontal-scroll-album__nav')?.remove();

            // 移除导航列表
            document.querySelector('.horizontal-scroll-album__indicator')?.remove();

            // 移除模糊背景
            const blurBgElements = document.querySelectorAll('.horizontal-scroll-album__pic__blurbg');
            blurBgElements?.forEach((bg) => {
                bg?.remove();
            });

            await new Promise((resolve) => setTimeout(resolve, images.length * 100)); // 等待所有图片加载完成
        }
        else if (isT) {
            const opusPics = document.querySelector('.dyn-card-opus__pics');
            const images = document.querySelectorAll('.bili-dyn-gallery__image');
            if (!opusPics || images.length < 3) {
                return;
            }

            GM_addStyle(`
				.bili-dyn-gallery__image {
					cursor: default !important; /* 图片鼠标样式设为默认 */
				}
            `);

            // 行列排布
            const gap = 5; // 间隔
            const columnDefault = 6; // 预设列数
            const column = images.length > 6 ? columnDefault : images.length; // 列数

            GM_addStyle(`
            	.bili-dyn-gallery__window {
					height: auto !important; /* 高度自适应 */
                    padding-right: 20px !important;
				}

				.bili-dyn-gallery__track {
					width: auto !important; /* 设置宽度 */
					flex-wrap: wrap !important; /* 允许换行 */
					gap: ${gap}px !important; /* 图片间隔 */
				}

				.bili-dyn-gallery__image {
					margin-left: 0px !important; /* 去掉原本的间隔 */
					width: calc((100% - (${column} - 1) * ${gap}px) / ${column}) !important; /* 设置宽度 */
					height: auto !important; /* 高度自适应 */
					aspect-ratio: 1 / 1 !important; /* 保持图片为方形 */
				}
            `);

            // 移除导航按钮
            document.querySelector('.bili-dyn-gallery__nav.prev')?.remove();
            document.querySelector('.bili-dyn-gallery__nav.next')?.remove();

            await new Promise((resolve) => setTimeout(resolve, images.length * 100)); // 等待所有图片加载完成
        }
        console.log('修改相册样式完毕');
    }

    // 修改样式
    function modifyStyle() {
        if (isVideo) {
            // 长标题换行
            const videoTitle = document.querySelector('.video-title');
            if (videoTitle) {
                videoTitle.style.whiteSpace = 'normal';
                videoTitle.style.flexShrink = 'initial';
                videoTitle.style.marginRight = '0px';
            }

            // 标题容器的高度根据内容自动调整
            const viewbox = document.querySelector('#viewbox_report');
            if (viewbox) {
                viewbox.style.height = 'auto'; // 设置父容器高度自适应
                viewbox.style.overflow = 'visible'; // 取消溢出隐藏，确保内容能完全显示
            }

            // 删除展开箭头
            const videoInfoTitle = document.querySelector('.video-info-title');
            if (videoInfoTitle) {
                // 获取该元素的所有1级子元素
                const childNodes = videoInfoTitle.childNodes;

                // 遍历所有子元素，删除注释节点或展开箭头
                Array.from(childNodes).forEach(child => {
                    if (child.nodeType === Node.COMMENT_NODE) {
                        child.remove();
                    } else if (child.classList && (child.classList.contains('show-more') || child.classList.contains('overflow-panel'))) {
                        child.remove();
                    }
                });
            }

            // 页面宽度调整为900px，且可以随窗口缩小宽度
            // 展开简介和标签
            // 封面宽度50%
            GM_addStyle(`
				.video-container-v1 {
					min-width: 0px !important;
				}

                .left-container {
                    width: auto !important;
                    min-width: 0px !important;
                    max-width: 900px !important;
				}

				.basic-desc-info {
					height: auto !important;
				}

				.tag.not-btn-tag {
					display: block !important;
				}

                .video-cover{
					width: 50%;
                    border-radius: 10px;
				}
            `);
        }
        else if (isOpus || isT) {
            if (isOpus) {
                // 调整间距
                GM_addStyle(`
                    .opus-detail {
						width: auto !important;
                    	min-width: 0px !important;
						max-width: 900px !important;
					}

                    .opus-module-title {
						padding: 10px 20px 0 20px !important;
					}

                    .opus-module-author {
						padding: 10px 20px !important;
					}

					.opus-module-content {
						padding: 0 20px !important;
					}

                    .opus-module-extend {
						padding: 20px 20px 0 20px !important;
					}
				`);
            }
            else if (isT) {
                // 页面宽度调整为900px，且可以随窗口缩小宽度
                GM_addStyle(`
                    .content{
						width: auto !important;
                    	min-width: 0px !important;
						max-width: 900px !important;
					}

                    .bili-dyn-item{
                    	min-width: 0px !important;
					}
				`);
            }
            // 调整最小宽度
            GM_addStyle(`
				#app {
					min-width: 0px !important;
				}
			`);
        }
        // 调整最小宽度
        // 调整间距
        GM_addStyle(`
            #app {
				min-width: 0px !important;
            }

			.bili-tabs__header {
				padding: 0 !important;
			}

			.bili-tabs__nav__item.is-active {
				padding: 0 !important;
			}

			div.bili-comment-container {
				padding: 0 10px 0 0px !important;
			}

			.reply-navigation {
				margin: 20px 0 0 20px !important;
			}
		`);

        // 将部分元素的鼠标样式批量改为默认
        const style = document.createElement('style');
        style.innerHTML = `
            .cursor-default * {
                cursor: default !important;
            }
        `;
        document.head.appendChild(style);

        if (isVideo) {
            document.querySelector('.up-info__btn-panel')?.classList.add('cursor-default');
            document.querySelector('.video-toolbar-container')?.classList.add('cursor-default');
        }
        else if (isOpus) {
            document.querySelector('.opus-module-author')?.classList.add('cursor-default');
        }
        else if (isT) {
            document.querySelector('.bili-dyn-item')?.classList.add('cursor-default');
        }

        document.querySelector('.bili-tabs__header')?.classList.add('cursor-default');
        document.querySelector('.reply-header')?.classList.add('cursor-default');
        document.querySelector('.reply-info')?.classList.add('cursor-default');

        //应对免登录脚本5.2版底部文字问题
        if (isIgnoreIdleTimeCheck) {
            const anchorElement = document.querySelector('.anchor-for-loading');
            if (anchorElement?.textContent === '正在加载...') {
                anchorElement.textContent = '所有评论已加载完毕';
            }
        }

        console.log('修改样式完毕');
    }

    async function end() {
        isScriptExecuting = false;
        // 创建用于保存文件名的元素
        addFilenameMeta();
        // 创建脚本版本的元素
        addScriptVersionMeta();
        //删除覆盖和提示
        removeOverlayAndMessage();
        isScriptSuccess = true;
        console.log('脚本执行完毕');
    }

    // 创建一个带有文件名称的 <meta> 元素，供singlefile使用（需要在singlefile的文件名规则设置中获取这个元素）
    function addFilenameMeta() {
        // 已存在则直接更改文本
        const metaTagOld = document.querySelector('meta[name="singlefile-filename"]');
        if (metaTagOld) {
            metaTagOld.content = singleFileName;
            console.log('文件名元素添加完毕');
            return;
        }

        const metaTag = document.createElement('meta');

        // 设置属性
        metaTag.setAttribute('name', 'singlefile-filename');
        metaTag.setAttribute('content', singleFileName);

        // 将 <meta> 元素添加到 <head> 标签中
        document.head.appendChild(metaTag);

        console.log('文件名元素添加完毕');
    }

    // 创建一个带有脚本版本的 <meta> 元素
    function addScriptVersionMeta() {
        // 已存在则直接更改文本
        const metaTagOld = document.querySelector('meta[name="script-version"]');
        if (metaTagOld) {
            metaTagOld.content = GM_info.script.version;
            console.log('脚本版本元素添加完毕');
            return;
        }

        const metaTag = document.createElement('meta');

        // 设置属性
        metaTag.setAttribute('name', 'script-version');
        metaTag.setAttribute('content', GM_info.script.version);

        // 将 <meta> 元素添加到 <head> 标签中
        document.head.appendChild(metaTag);

        console.log('脚本版本元素添加完毕');
    }
})();