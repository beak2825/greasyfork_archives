// ==UserScript==
// @name         小草简洁助手
// @namespace    http://tampermonkey.net/
// @version      3.01
// @description  为小草榴社区、1024、cl进行一些外科手术操作·回家不迷路，草榴最新地址 ·帖子内快速切换上下帖 ·预加载下一帖 ·限制页面宽度为1080 ·等比例无缝看图 ·图片查看模式 ·使用手机版面 ·帖子精简对于游客身份无关的内容·图片批量下载功能
// @match        *://*/htm_data/*
// @match        http*://*/htm_data/*.html
// @match        http*://*/htm_mob/*.html
// @match        http*://*/read.php*
// @match        http*://*/personal.php*
// @match        http*://*/post.php*
// @match        http*://*/thread0806.php*
// @match        http*://*.163.com*/*
// @run-at       document-end
// @connect      get.xunfs.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle



// @downloadURL https://update.greasyfork.org/scripts/466480/%E5%B0%8F%E8%8D%89%E7%AE%80%E6%B4%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/466480/%E5%B0%8F%E8%8D%89%E7%AE%80%E6%B4%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var links = [];

    // 配置项定义
    const configItems = [
        { id: 'enableGoHome', label: '回家不迷路,进入163.com，右下角有神秘入口', default: true },
        { id: 'enableNavigationButton', label: '上下帖导航', default: true },
        { id: 'enablePreloadnextpage', label: '预加载下一帖', default: true },
        { id: 'limitPageWidth', label: '限制页面宽度为1080', default: true },
        { id: 'enableSeamlessView', label: '等比例无缝看图', default: true },
        { id: 'enableImagePreview', label: '图片查看模式', default: true },
        { id: 'enableMobilePage', label: '使用手机版面', default: true },
        { id: 'enableClearPage', label: '手机版帖子简洁', default: true },
        { id: 'enableDownloadPic', label: '帖子批量图片下载(仅适用于安卓手机端)', default: false },
        { id: 'compressAnnounce', label: '版块公告折叠', default: true } // 移出子项作为主项
    ];
    // 手机版帖子简洁子设置项
    const clearPageSubItems = [
        { id: 'clearPage_removeAds', label: '移除广告', default: true },
        { id: 'clearPage_removeAvatars', label: '移除头像', default: true },
        { id: 'clearPage_singleLineInfo', label: '单行用户信息', default: true },
        { id: 'clearPage_removeQuickReply', label: '移除快速回复', default: true } // 新增子项
    ];

    // 初始化设置值
    var enableGoHome = GM_getValue('enableGoHome', true);
    var enableNavigationButton = GM_getValue('enableNavigationButton', true);
    var enablePreloadnextpage = GM_getValue('enablePreloadnextpage', true);
    var limitPageWidth = GM_getValue('limitPageWidth', true);
    var enableSeamlessView = GM_getValue('enableSeamlessView', true);
    var enableImagePreview = GM_getValue('enableImagePreview', true);
    var enableMobilePage = GM_getValue('enableMobilePage', true);
    var enableClearPage = GM_getValue('enableClearPage', true);
    var enableDownloadPic = GM_getValue('enableDownloadPic', true);
    var blockUserPosts = GM_getValue('blockUserPosts', true);

    // 初始化子设置项（确保所有子设置项都有值）
    clearPageSubItems.forEach(item => {
        GM_getValue(item.id, item.default); // 确保有默认值
    });

    function createButtonContainer() {
        var buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.width = '100%';
        buttonContainer.style.bottom = '10px';
        buttonContainer.style.left = '0';
        buttonContainer.style.right = '0';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.zIndex = '9999';
        document.body.appendChild(buttonContainer);

        return buttonContainer;
    }

    function createButton(text, action) {
        var button = document.createElement('button');
        button.innerHTML = text;
        button.style.height = '25px';
        button.style.margin = '0 10px';
        button.style.backgroundColor = '#0F7884';
        button.style.border = 'none';
        button.style.color = 'white'
        button.style.textAlign = 'center';
        button.style.textDecoration = 'none';
        button.style.fontSize = '14px';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', action);

        return button;
    }

    // 注册菜单命令
    GM_registerMenuCommand('小草简洁助手 设置', showSettingsWindow);

    // 显示设置窗口
    function showSettingsWindow() {
        const existingWindow = document.getElementById('settingsWindow');
        if (existingWindow) {
            existingWindow.style.display = 'block';
            return;
        }

        createSettingsWindow();
    }

    // 创建设置窗口
    function createSettingsWindow() {
        const settingsWindow = document.createElement('div');
        settingsWindow.id = 'settingsWindow';
        Object.assign(settingsWindow.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%', // 改为百分比宽度
            maxWidth: '350px', // 最大宽度限制
            maxHeight: '80vh',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            padding: '10px', // 减少内边距
            zIndex: '9999',
            overflowY: 'auto',
            borderRadius: '8px',
            fontSize: '14px' // 缩小字体
        });

        // 标题（缩小字号）
        const title = document.createElement('h3');
        title.textContent = '小草简洁助手 设置';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '16px';
        title.style.color = '#333';
        settingsWindow.appendChild(title);

        // 创建配置项复选框（紧凑布局）
        configItems.forEach(item => {
            const checkbox = createCompactCheckbox(item.id, item.label, GM_getValue(item.id, item.default));
            settingsWindow.appendChild(checkbox);

            // 如果是手机版帖子简洁选项，添加子选项
            if (item.id === 'enableClearPage') {
                const subOptions = document.createElement('div');
                subOptions.style.marginLeft = '10px';
                subOptions.style.marginBottom = '5px';
                subOptions.style.borderLeft = '2px solid #eee';
                subOptions.style.paddingLeft = '8px';

                clearPageSubItems.forEach(subItem => {
                    const subCheckbox = createCompactCheckbox(subItem.id, subItem.label, GM_getValue(subItem.id, subItem.default));
                    subOptions.appendChild(subCheckbox);
                });

                settingsWindow.appendChild(subOptions);
            }
        });

        // 屏蔽用户区域
        const blockSection = document.createElement('div');
        blockSection.style.marginTop = '15px';

        const blockHeader = document.createElement('div');
        blockHeader.style.fontWeight = 'bold';
        blockHeader.textContent = '屏蔽设置';
        blockSection.appendChild(blockHeader);

        const blockCheckbox = createCompactCheckbox('blockUserPosts', '屏蔽指定用户帖子', GM_getValue('blockUserPosts', false));
        blockSection.appendChild(blockCheckbox);

        const blockedUsersInput = document.createElement('textarea');
        Object.assign(blockedUsersInput.style, {
            width: '100%',
            minHeight: '80px',
            marginTop: '10px',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            resize: 'vertical'
        });
        blockedUsersInput.placeholder = '输入要屏蔽的用户名，多个用户名用逗号分隔';
        blockedUsersInput.value = GM_getValue('blockedUsers', []).join(', ');
        blockSection.appendChild(blockedUsersInput);

        settingsWindow.appendChild(blockSection);

        // 按钮区域
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '20px';

        const saveButton = createButton('保存', () => {
            saveSettings(settingsWindow, blockedUsersInput);
        });
        saveButton.style.flex = '1';
        saveButton.style.margin = '0 5px';

        const cancelButton = createButton('取消', () => {
            settingsWindow.style.display = 'none';
        });
        cancelButton.style.flex = '1';
        cancelButton.style.margin = '0 5px';

        const feedbackButton = createButton('反馈', () => {
            window.open('https://greasyfork.org/zh-CN/scripts/466480-%E5%B0%8F%E8%8D%89%E7%AE%80%E6%B4%81%E5%8A%A9%E6%89%8B/feedback', '_blank');
        });
        feedbackButton.style.backgroundColor = '#2196F3';
        feedbackButton.style.flex = '1';
        feedbackButton.style.margin = '0 5px';

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(feedbackButton);
        settingsWindow.appendChild(buttonContainer);

        // 成功提示
        const successLabel = document.createElement('div');
        successLabel.id = 'successLabel';
        successLabel.textContent = '保存成功，刷新页面生效！';
        Object.assign(successLabel.style, {
            display: 'none',
            color: '#4CAF50',
            marginTop: '10px',
            textAlign: 'center',
            fontWeight: 'bold'
        });
        settingsWindow.appendChild(successLabel);

        // 添加关闭按钮
        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        Object.assign(closeButton.style, {
            position: 'absolute',
            top: '10px',
            right: '15px',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#888'
        });
        closeButton.addEventListener('click', () => {
            settingsWindow.style.display = 'none';
        });
        settingsWindow.appendChild(closeButton);

        document.body.appendChild(settingsWindow);
    }

    // 创建紧凑型复选框
    function createCompactCheckbox(id, label, checked) {
        const container = document.createElement('div');
        container.style.marginBottom = '1px'; // 减少间距
        container.style.display = 'flex';
        container.style.alignItems = 'center';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = checked;
        checkbox.style.marginRight = '6px';
        checkbox.style.transform = 'scale(0.9)'; // 缩小复选框

        const labelElement = document.createElement('label');
        labelElement.htmlFor = id;
        labelElement.textContent = label;
        labelElement.style.cursor = 'pointer';
        labelElement.style.userSelect = 'none';
        labelElement.style.fontSize = '13px'; // 缩小标签字体
        labelElement.style.lineHeight = '1.3'; // 紧凑行高

        container.appendChild(checkbox);
        container.appendChild(labelElement);

        return container;
    }

    // 保存设置
    function saveSettings(settingsWindow, blockedUsersInput) {
        // 保存主配置项
        configItems.forEach(item => {
            const value = document.getElementById(item.id).checked;
            GM_setValue(item.id, value);
        });

        // 保存子配置项
        clearPageSubItems.forEach(subItem => {
            const subValue = document.getElementById(subItem.id).checked;
            GM_setValue(subItem.id, subValue);
        });

        // 保存屏蔽设置
        GM_setValue('blockUserPosts', document.getElementById('blockUserPosts').checked);

        const blockedUsernames = blockedUsersInput.value
        .split(',')
        .map(name => name.trim())
        .filter(name => name !== '');
        GM_setValue('blockedUsers', blockedUsernames);

        // 显示成功消息
        const successLabel = document.getElementById('successLabel');
        successLabel.style.display = 'block';

        setTimeout(() => {
            settingsWindow.style.display = 'none';
            successLabel.style.display = 'none';
        }, 2000);
    }
    // 导航按钮
    if (enableNavigationButton) {
        var currentfid = 0;
        var page = 0;
        function getHrefLinks(){
            if (window.location.href.includes('/thread0806.php?fid=')) {
                currentfid = getFidFromURL(window.location.href);
                page = getCurrentPageFromURL(window.location.href);
                localStorage.setItem('currentPage', page);
                //console.log("page"+page);
                // 获取所有主题链接
                //var threadLinks = document.querySelectorAll('a[href^="htm_mob"]');
                var threadLinks = document.querySelectorAll('div.list.t_one a[href^="/htm_mob"]');//2025-2-2 根据新版页面做调整
                //console.log(threadLinks);
                // 提取链接并存储到数组
                for (var i = 0; i < threadLinks.length; i++) {
                    links.push(threadLinks[i].href);
                }
                // 存储链接数组到本地存储
                localStorage.setItem('threadLinks', JSON.stringify(links));
            } else if (window.location.href.includes('/htm_mob/')) {
                // 从页面中提取 fid 值
                var headerDiv = document.getElementById('header');
                var fidButton = headerDiv.querySelector('input[value="＜"]');
                if (fidButton) {
                    var onclickAttribute = fidButton.getAttribute('onclick');
                    var fid = extractFidValue(onclickAttribute);

                    // 创建当前版块的变量 currentfid 进行保存
                    currentfid = fid;
                    //console.log("currentfid"+currentfid);
                }
                // 获取本地存储中的链接数组
                links = JSON.parse(localStorage.getItem('threadLinks')) || [];
                // 获取本地存储中的帖子列表值
                page = parseInt(localStorage.getItem('currentPage')) || 1;
            }
        }
        //↓↓↓↓↓↓↓↓↓↓↓↓↓导航按钮相关函数↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        // 从 URL 中获取 fid 值
        function getFidFromURL(url) {
            var fidRegex = /fid=(\d+)/;
            var matches = url.match(fidRegex);
            if (matches && matches.length > 1) {
                return matches[1];
            }
            return null;
        }

        // 从 URL 中获取当前页码page值
        function getCurrentPageFromURL(url) {
            var pageRegex = /page=(\d+)/;
            var matches = url.match(pageRegex);
            if (matches && matches.length > 1) {
                return parseInt(matches[1]);
            }
            return 1;
        }

        // 提取 fid 值的辅助函数
        function extractFidValue(onclickAttribute) {
            var startIndex = onclickAttribute.indexOf('fid=') + 4;
            var endIndex = onclickAttribute.indexOf("'", startIndex);

            return onclickAttribute.substring(startIndex, endIndex);
        }

        // 获取主题链接的函数
        function getThreadLinks(fid, page, callback) {
            var url = window.location.origin + '/thread0806.php?fid=' + fid + '&search=&page=' + page;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    var html = response.responseText;
                    var doc = new DOMParser().parseFromString(html, 'text/html');

                    var threadDivs = doc.querySelectorAll('div.list.t_one'); // 选择具有特定 class 属性的 div 元素
                    var newLinks = [];
                    for (var i = 0; i < threadDivs.length; i++) {
                        var link = threadDivs[i].querySelector('a[href^="htm_mob"]'); // 在每个 div 元素中查找匹配的 a 元素
                        if (link) {
                            var href = link.getAttribute('href'); // 获取 href 属性的值
                            var fullLink = window.location.origin + '/' + href; // 拼接完整链接
                            newLinks.push(fullLink);
                        }
                    }
                    callback(newLinks);
                }
            });
        }
        //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑导航按钮相关函数↑↑↑↑↑↑↑↑↑↑↑

        // 导航到上一篇帖子
        function navigateToPreviousPost() {
            var currentURL = window.location.href;
            var currentIndex = links.indexOf(currentURL);

            if (currentIndex !== -1 && currentIndex > 0) {
                var previousURL = links[currentIndex - 1];
                window.location.href = previousURL;
            } else {
                var previousPage = page - 1;
                getThreadLinks(currentfid, previousPage, function(newLinks) {
                    var tempLinks = links.slice(); // 创建链接数组的副本

                    // 去除重复的链接
                    newLinks.forEach(function(link) {
                        if (!tempLinks.includes(link)) {
                            tempLinks.push(link);
                        }
                    });

                    links = tempLinks;

                    if (links.length > 0) {
                        var lastLinkIndex = links.length - 1;
                        window.location.href = links[lastLinkIndex];
                        // 将新的链接数组和更新后的page值存储在本地存储中
                        localStorage.setItem('threadLinks', JSON.stringify(links));
                        localStorage.setItem('currentPage', previousPage);
                    }
                });
            }
        }

        // 导航到下一篇帖子
        function navigateToNextPost() {
            var currentURL = window.location.href;
            var currentIndex = links.indexOf(currentURL);

            if (currentIndex !== -1 && currentIndex < links.length - 1) {
                var nextURL = links[currentIndex + 1];
                window.location.href = nextURL;
            } else {
                var nextPage = page + 1;
                getThreadLinks(currentfid, nextPage, function(newLinks) {
                    var tempLinks = [];

                    // 去除与当前链接数组重复的链接
                    newLinks.forEach(function(link) {
                        if (!links.includes(link)) {
                            tempLinks.push(link);
                        }
                    });

                    links = tempLinks;

                    if (links.length > 0) {
                        window.location.href = links[0];
                        // 将新的链接数组和更新后的page值存储在本地存储中
                        localStorage.setItem('threadLinks', JSON.stringify(links));
                        localStorage.setItem('currentPage', nextPage);
                    }
                });
            }
        }

        getHrefLinks();

        if(window.location.href.includes('/htm_mob/') ){//|| window.location.href.includes('/htm_data/')){

            var buttonContainer = createButtonContainer();

            var previousButton = createButton('上一帖', navigateToPreviousPost);
            buttonContainer.appendChild(previousButton);

            var nextButton = createButton('下一帖', navigateToNextPost);
            buttonContainer.appendChild(nextButton);


        }
    }
    // 预加载下一帖图片功能（WebView兼容版）
    if (enablePreloadnextpage && links.length > 1) {
        //↓↓↓↓↓↓↓↓↓↓↓↓↓预加载下一帖图片功能↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

        // 提取图片链接
        function extractImageLinks(html) {
            try {
                // 更简单的图片链接提取方法
                var imageLinks = [];
                var tmpDiv = document.createElement('div');
                tmpDiv.innerHTML = html;

                // 同时匹配ess-data和普通src
                var images = tmpDiv.querySelectorAll('img[ess-data], img[src]');
                images.forEach(function(img) {
                    var link = img.getAttribute('ess-data') || img.getAttribute('src');
                    if (link && !imageLinks.includes(link)) {
                        imageLinks.push(link);
                    }
                });

                return imageLinks;
            } catch (e) {
                console.error("提取图片链接出错:", e);
                return [];
            }
        }

        // 创建并显示图片容器（带淡入淡出效果）
        function displayImageLinks(imageLinks) {
            if (!imageLinks || imageLinks.length === 0) {
                if (nextButton) nextButton.textContent = '下一帖,无图片可预加载';
                return;
            }

            // 移除现有容器
            var existingContainer = document.getElementById('image-preload-container');
            if (existingContainer) document.body.removeChild(existingContainer);

            // 创建容器 - 添加淡入淡出效果
            var imageContainer = document.createElement('div');
            imageContainer.id = 'image-preload-container';
            imageContainer.style.position = 'fixed';
            imageContainer.style.bottom = '60px';
            imageContainer.style.left = '5%';
            imageContainer.style.width = '90%';
            imageContainer.style.height = '50px';
            imageContainer.style.backgroundColor = 'rgba(0,0,0,0.7)';
            imageContainer.style.overflowX = 'auto';
            imageContainer.style.whiteSpace = 'nowrap';
            imageContainer.style.zIndex = '99999';
            imageContainer.style.borderRadius = '5px';
            imageContainer.style.opacity = '0'; // 初始完全透明
            imageContainer.style.transition = 'opacity 0.5s ease'; // 添加过渡效果
            imageContainer.style.display = 'block'; // 保持显示但透明

            // 添加图片
            var loadedCount = 0;
            var totalCount = imageLinks.length;

            function updateStatus() {
                loadedCount++;
                if (loadedCount === totalCount) {
                    // 全部加载完成，开始淡入
                    imageContainer.style.opacity = '1';

                    // 2秒后开始淡出
                    setTimeout(function() {
                        imageContainer.style.opacity = '0';

                        // 淡出动画完成后完全隐藏
                        setTimeout(function() {
                            imageContainer.style.display = 'none';
                        }, 500); // 匹配过渡时间
                    }, 2000); // 显示2秒

                    if (nextButton) {
                        nextButton.textContent = '下一帖(' + loadedCount + '图)';
                    }
                } else if (nextButton) {
                    nextButton.textContent = '下一帖(加载中' + loadedCount + '/' + totalCount + ')';
                }
            }

            imageLinks.forEach(function(link) {
                var img = new Image();
                img.src = link;
                img.style.height = '45px';
                img.style.margin = '2px';
                img.style.verticalAlign = 'middle';

                img.onload = function() {
                    imageContainer.appendChild(img);
                    updateStatus();
                };

                img.onerror = function() {
                    updateStatus();
                };
            });

            document.body.appendChild(imageContainer);

            // 保留点击立即隐藏功能
            imageContainer.addEventListener('click', function() {
                this.style.opacity = '0';
                setTimeout(() => {
                    this.style.display = 'none';
                }, 500);
            });
        }
        //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑预加载下一帖图片功能↑↑↑↑↑↑↑↑↑↑↑

        // 获取当前页面的 URL
        var currentURL = window.location.href;
        var currentIndex = links.indexOf(currentURL);

        if (enableNavigationButton && currentIndex !== -1 && currentIndex < links.length - 1) {
            var nextURL = links[currentIndex + 1];

            // 立即更新按钮状态
            if (nextButton) nextButton.textContent = '下一帖(预加载中...)';

            // 使用更可靠的请求方式
            var xhr = new XMLHttpRequest();
            xhr.open('GET', nextURL, true);
            xhr.timeout = 10000; // 10秒超时

            var timeoutTimer = setTimeout(function() {
                xhr.abort();
                if (nextButton) nextButton.textContent = '下一帖(超时)';
            }, 15000);

            xhr.onload = function() {
                clearTimeout(timeoutTimer);
                if (xhr.status === 200) {
                    try {
                        var imageLinks = extractImageLinks(xhr.responseText);
                        displayImageLinks(imageLinks);
                    } catch (e) {
                        console.error("处理错误:", e);
                        if (nextButton) nextButton.textContent = '下一帖(处理错误)';
                    }
                } else {
                    if (nextButton) nextButton.textContent = '下一帖(加载失败)';
                }
            };

            xhr.onerror = function() {
                clearTimeout(timeoutTimer);
                if (nextButton) nextButton.textContent = '下一帖(请求错误)';
            };

            xhr.ontimeout = function() {
                if (nextButton) nextButton.textContent = '下一帖(超时)';
            };

            try {
                xhr.send();
            } catch (e) {
                if (nextButton) nextButton.textContent = '下一帖(发送错误)';
            }
        }
    }
    // 回家不迷路
    if (enableGoHome && window.location.href.includes('163.com')) {
        // 创建一个悬浮按钮
        const button = document.createElement('button');
        button.style.position = 'fixed';
        button.style.bottom = '40px';
        button.style.height = '50px';
        button.style.right = '30px';
        button.style.backgroundColor = '#0F7884';
        button.style.zIndex = '999';
        button.style.border = 'none';
        button.style.color = 'white'
        button.style.textAlign = 'center';
        button.style.textDecoration = 'none';
        button.innerText = '☞神秘入口☜';
        document.body.appendChild(button);

        // 给按钮添加点击事件监听器
        button.addEventListener('click', function() {
            // 创建POST请求的payload
            const payload = 'a=get18&system=android&v=2.2.7';

            // 发起POST请求
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://get.xunfs.com/app/listapp.php',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: payload,
                responseType: 'text',
                onload: function(response) {
                    // 解析响应中的JSON数据
                    const responseData = JSON.parse(response.responseText);

                    // 提取所需的URL
                    const url1 = responseData.url1;
                    const url2 = responseData.url2;
                    const url3 = responseData.url3;

                    // 创建一个悬浮div来显示URL
                    const urlDiv = document.createElement('div');
                    urlDiv.style.position = 'fixed';
                    urlDiv.style.bottom = '100px';
                    urlDiv.style.right = '20px';
                    urlDiv.style.zIndex = '999';
                    urlDiv.style.backgroundColor = '#fff';
                    urlDiv.style.padding = '20px';
                    urlDiv.style.border = '1px solid #ccc';

                    // 生成URL的内容
                    const urlsContent = `
                    最新地址为：
                    <br>地址1: <a href="https://${url1}/mobile.php?ismobile=yes" target="_bank" style="text-decoration: underline; color: blue;">${url1}</a>
                    <br>地址2: <a href="https://${url2}/mobile.php?ismobile=yes" style="text-decoration: underline; color: blue;">${url2}</a>
                    <br>地址3: <a href="https://${url3}/mobile.php?ismobile=yes" style="text-decoration: underline; color: blue;">${url3}</a>
                    <br>
                    <br>进入论坛主页后，请手动在页面底下，切换为手机版页面，即能享受脚本最佳效果！！！
                `;

                    // 设置URL的内容到div中
                    urlDiv.innerHTML = urlsContent;

                    // 将div添加到文档中
                    document.body.appendChild(urlDiv);

                    // 为URL添加点击事件监听器
                    /* const urlLinks = urlDiv.querySelectorAll('a');
                    urlLinks.forEach(function(link) {
                        link.addEventListener('click', function(event) {
                            event.preventDefault();
                            const url = this.getAttribute('data-url');
                            copyToClipboard(url);
                            window.location.href = url;
                        });
                    });
                    */

                    // 复制文本到剪贴板的函数
                    function copyToClipboard(text) {
                        const tempInput = document.createElement('input');
                        tempInput.value = text;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);
                        showAlert(text + ' 复制成功');
                    }

                    // 显示提示信息并在一段时间后隐藏
                    function showAlert(message) {
                        const alertDiv = document.createElement('div');
                        alertDiv.style.position = 'fixed';
                        alertDiv.style.bottom = '80px';
                        alertDiv.style.right = '20px';
                        alertDiv.style.zIndex = '9999';
                        alertDiv.style.backgroundColor = '#fff';
                        alertDiv.style.padding = '10px';
                        alertDiv.style.border = '1px solid #ccc';
                        alertDiv.innerText = message;
                        document.body.appendChild(alertDiv);
                        setTimeout(function() {
                            document.body.removeChild(alertDiv);
                        }, 2000);
                    }
                },
                onerror: function(error) {
                    console.error('POST请求失败:', error);
                }
            });
        });
    }
    // 限制页面宽度为1080
    if (limitPageWidth) {
        var browserWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var targetWidth = Math.min(browserWidth, 1080);
        document.body.style.maxWidth = targetWidth + 'px';
        document.body.style.margin = '0 auto';
    }
    // 添加使用手机版页面功能的代码
    if (enableMobilePage) {
        var url = window.location.href;
        var regex = /\/htm_data\//;
        if (regex.test(url)) {
            window.location.href = url.replace(regex, '/htm_mob/');
        }
        //         if (window.location.href.includes('/thread0806.php?fid')){
        //             alert("test1");
        //             var domain = window.location.hostname;
        //             console.log(domain);
        //             window.location.href = 'https://' + domain + '/mobile.php?ismobile=yes';
        //         }
    }
    // 帖子页面简洁功能
    if (enableClearPage && (window.location.href.includes('/htm_mob/') || window.location.href.includes('read.php'))) {
        setTimeout(function() {
            if (GM_getValue('clearPage_removeAds', true)) {
                // 通用广告选择器
                const adSelector = '.ad, .ads, .advertising, .advertisement, .ad-banner, .ad-container, .ad-frame, .ad-leaderboard, .ad-slot, .ad-wrapper, .banner-ad, .google-ads, .f_one, .sponsored, .ftad-ct, .tpc_icon.fl';
                const ads = document.querySelectorAll(adSelector);

                ads.forEach(ad => {
                    // 如果是 .tpc_icon.fl，检查是否包含 AD 文本
                    if (ad.classList.contains('tpc_icon') && ad.classList.contains('fl')) {
                        const span = ad.querySelector('span');
                        if (span && span.textContent.trim() === 'AD') {
                            ad.remove();
                        }
                    } else {
                        // 其他广告直接移除
                        ad.remove();
                    }
                });
            }

            // 移除头像和其他元素
            if (GM_getValue('clearPage_removeAvatars', true)) {
                const targetSelector = '.tpc_face,.tpc_icon.fl,.post_comm_face,.post_comm_face_svg,.tpc_rp_btn,.fr,div.t,.t_like,.h.guide,div.line:nth-child(3)';
                const targets = document.querySelectorAll(targetSelector);
                targets.forEach(target => target.remove());
            }

            // 单行用户信息
            if (GM_getValue('clearPage_singleLineInfo', true)) {
                const mainDiv = document.getElementById('main');
                if (mainDiv) {
                    const tpcDivs = mainDiv.getElementsByClassName('tpc_detail f10 fl');
                    for (let i = 0; i < tpcDivs.length; i++) {
                        const div = tpcDivs[i];
                        const brTags = div.getElementsByTagName('br');
                        for (let j = brTags.length - 1; j >= 0; j--) {
                            const br = brTags[j];
                            br.parentNode.replaceChild(document.createTextNode(' '), br);
                        }
                    }
                }
            }
            // 移除快速回复功能
            if (GM_getValue('clearPage_removeQuickReply', true)) {
                const quickReplyForm = document.querySelector('form[name="FORM"]');
                if (quickReplyForm && quickReplyForm.querySelector('a[name="reply"]')) {
                    quickReplyForm.remove();
                }
            }
        }, 500);
    }
    // 版块公告折叠功能
    if (GM_getValue('clearPage_compressAnnounce', true) && (window.location.href.includes('thread0806.php?fid='))) {
        setTimeout(function() {
            // 找到所有包含"版塊公告"的tpc_cont元素
            const announceContainers = document.querySelectorAll('.tpc_cont');

            announceContainers.forEach(container => {
                if (container.textContent.includes('版塊公告')) {
                    // 保存原始内容
                    const originalContent = container.innerHTML;

                    // 创建折叠容器
                    const collapseWrapper = document.createElement('div');
                    collapseWrapper.className = 'announce-collapse-wrapper';
                    Object.assign(collapseWrapper.style, {
                        margin: '10px 0',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    });

                    // 创建标题栏（可点击）
                    const collapseHeader = document.createElement('div');
                    collapseHeader.textContent = '版块公告 ▼';
                    Object.assign(collapseHeader.style, {
                        padding: '8px 12px',
                        backgroundColor: '#f8f8f8',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        userSelect: 'none',
                        borderBottom: '1px solid #e0e0e0'
                    });

                    // 创建内容区域（初始折叠）
                    const collapseContent = document.createElement('div');
                    collapseContent.innerHTML = originalContent;
                    Object.assign(collapseContent.style, {
                        padding: '12px',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        display: 'none', // 初始隐藏
                        backgroundColor: '#fff'
                    });

                    // 优化内容样式
                    const style = document.createElement('style');
                    style.textContent = `
                    .announce-collapse-wrapper .tpc_cont {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .announce-collapse-wrapper br {
                        margin-bottom: 8px;
                        display: block;
                        content: "";
                    }
                `;
                    document.head.appendChild(style);

                    // 点击标题切换折叠状态
                    collapseHeader.addEventListener('click', function() {
                        if (collapseContent.style.display === 'none') {
                            collapseContent.style.display = 'block';
                            this.textContent = '版块公告 ▲';
                        } else {
                            collapseContent.style.display = 'none';
                            this.textContent = '版块公告 ▼';
                        }
                    });

                    // 组装元素
                    collapseWrapper.appendChild(collapseHeader);
                    collapseWrapper.appendChild(collapseContent);

                    // 替换原始元素
                    container.replaceWith(collapseWrapper);
                }
            });
        }, 1000); // 延迟1秒执行
    }
    // 等比例无缝看图
    if (enableSeamlessView && window.location.href.includes('/htm_mob/')) {
        // 延迟执行函数
        function delayedExecution() {
            // 获取tpc_cont元素
            var tpcCont = document.querySelector('div.tpc_cont');

            if (tpcCont) {
                // 获取tpc_cont元素下的所有子节点
                var childNodes = tpcCont.childNodes;

                // 遍历子节点
                for (var i = childNodes.length - 1; i >= 0; i--) {
                    var node = childNodes[i];

                    // 如果节点是图片或视频元素
                    if (node.nodeType === Node.ELEMENT_NODE && (node.nodeName === 'IMG' || node.nodeName === 'VIDEO')) {
                        // 最大化尺寸
                        node.style.width = '100%';
                        node.style.height = 'auto';
                    }

                    // 判断节点名称是否为br
                    if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'BR') {
                        var nextNode = node.nextSibling;

                        // 判断br标签下的内容是否为文本节点
                        if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
                            // 如果br标签下的内容是文本节点，则保留br标签
                            continue;
                        } else {
                            // 删除br标签
                            tpcCont.removeChild(node);
                            continue;
                        }
                    }
                }

                // 删除整个div下的所有&nbsp;
                tpcCont.innerHTML = tpcCont.innerHTML.replace(/&nbsp;/g, '');
            }
        }

        // 延迟3秒后执行函数
        setTimeout(delayedExecution, 2000);

    }
    // 图片查看模式
    if (enableImagePreview && window.location.href.includes('/htm_mob/')) {
        function ImagePreview() {
            // 获取当前浏览器的宽度
            var browserWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            // 定义要限制的图片的目标宽度（最大为1080px）
            var targetWidth = Math.min(browserWidth, 1080);

            // 获取所有图片元素
            var imgs = document.querySelectorAll('.tpc_cont img');

            // 遍历所有图片元素
            for (var i = 0; i < imgs.length; i++) {
                var img = imgs[i];

                // 添加点击事件，点击图片时进入查看模式
                img.addEventListener('click', function (e) {
                    // 删除原图片的链接
                    this.removeAttribute('href');

                    // 阻止事件冒泡
                    e.stopPropagation();

                    // 获取该div下的所有图片元素
                    var div = this.parentNode;
                    var imgs = div.querySelectorAll('img');

                    // 创建一个div用于显示所有图片
                    var container = document.createElement('div');
                    container.style.position = 'fixed';
                    container.style.top = '0';
                    container.style.left = '0';
                    container.style.width = '100%';
                    container.style.height = '100%';
                    container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    container.style.zIndex = '9999';
                    container.style.overflow = 'auto';

                    // 遍历所有图片元素，将它们拼接到一起
                    var imgContainer = document.createElement('div');
                    imgContainer.style.width = targetWidth + 'px'; // 设置图片容器宽度与目标宽度一致
                    imgContainer.style.margin = '0 auto'; // 设置图片容器居中
                    for (var i = 0; i < imgs.length; i++) {
                        var img = imgs[i];
                        var src = img.getAttribute('src');
                        var imgEl = document.createElement('img');
                        imgEl.setAttribute('src', src);
                        imgEl.style.width = '100%'; // 设置图片宽度为100%（等比例缩放）
                        imgEl.style.height = 'auto'; // 设置图片高度为auto（根据宽度等比例缩放）
                        imgEl.style.display = 'block'; // 修改样式，使图片单列显示
                        imgContainer.appendChild(imgEl);
                    }
                    container.appendChild(imgContainer);

                    // 添加关闭按钮
                    var closeBtn = document.createElement('div');
                    closeBtn.style.position = 'absolute';
                    closeBtn.style.top = '10px';
                    closeBtn.style.right = '10px';
                    closeBtn.style.width = '30px';
                    closeBtn.style.height = '30px';
                    closeBtn.style.lineHeight = '30px';
                    closeBtn.style.textAlign = 'center';
                    closeBtn.style.backgroundColor = '#fff';
                    closeBtn.style.borderRadius = '50%';
                    closeBtn.style.cursor = 'pointer';
                    closeBtn.style.fontSize = '20px';
                    closeBtn.style.color = '#000';
                    closeBtn.innerHTML = '&times;';
                    closeBtn.addEventListener('click', function () {
                        container.parentNode.removeChild(container);
                    });
                    container.appendChild(closeBtn);

                    // 添加点击事件，点击拼接后的图片时关闭
                    imgContainer.addEventListener('click', function (e) {
                        // 阻止事件冒泡
                        e.stopPropagation();

                        // 关闭查看模式
                        container.parentNode.removeChild(container);
                    });

                    // 将div添加到页面中
                    document.body.appendChild(container);
                }, true);
            }
        }setTimeout(ImagePreview, 2500);
    }
    // 屏蔽指定用户帖子
    if (blockUserPosts && window.location.href.includes('thread0806.php?fid=')) {
        // 获取屏蔽名单，如果不存在则初始化为空数组
        let blockedUsers = GM_getValue('blockedUsers', []);

        // 屏蔽指定用户帖子
        if (GM_getValue('blockUserPosts', true) && window.location.href.includes('thread0806.php?fid=')) {
            function addBlockUserLink() {
                const userElements = document.querySelectorAll('.f10[onclick^="goUid("]');
                userElements.forEach(userElement => {
                    const userId = extractUserId(userElement.getAttribute('onclick'));
                    const usernameElement = userElement.childNodes[0];
                    const username = usernameElement.textContent.trim();
                    const blockLink = document.createElement('a');
                    blockLink.href = 'javascript:void(0)';
                    blockLink.textContent = '不看ta';
                    blockLink.style.textDecoration = 'underline';
                    blockLink.style.color = 'blue';
                    blockLink.addEventListener('click', function(event) {
                        event.preventDefault();
                        event.stopPropagation(); // 阻止点击事件冒泡到父元素
                        addToBlockedUsers(username, userId);
                    });
                    userElement.insertBefore(document.createTextNode(' '), usernameElement.nextSibling);
                    userElement.insertBefore(blockLink, usernameElement.nextSibling);
                });
            }

            function extractUserId(onclickValue) {
                const regex = /goUid\((\d+)\)/;
                const match = onclickValue.match(regex);
                return match ? match[1] : null;
            }

            function addToBlockedUsers(username, userId) {
                if (!blockedUsers.includes(username)) {
                    const confirmBlock = confirm(`确定要屏蔽用户 ${username} 吗？`);
                    if (confirmBlock) {
                        blockedUsers.push(username);
                        GM_setValue('blockedUsers', blockedUsers);
                        location.reload();
                    }
                }
            }

            function hideBlockedUsersPosts() {
                blockedUsers.forEach(username => {
                    const userElements = document.querySelectorAll(`span.f10:not([data-blocked])`);
                    userElements.forEach(userElement => {
                        const postUsernameElement = userElement.childNodes[0];
                        const postUsername = postUsernameElement.textContent.trim();
                        if (postUsername === username) {
                            userElement.closest('div').style.display = 'none';
                        }
                    });
                });
            }

            addBlockUserLink();
            hideBlockedUsersPosts();

            window.addEventListener('load', function() {
                hideBlockedUsersPosts();
            });
        }


    }

    // 创建style元素并添加到head
    const style = document.createElement('style');
    style.textContent = `
        .tpc_line {
            margin: 2px 0 10px 0 !important;
            clear: both !important;
        }

        .tpc_detail {
            line-height: 10px;
            color: #999999;
            display: table;
            height: 5px;
        }
    `

    ;
    document.head.appendChild(style);

})();