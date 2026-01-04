// ==UserScript==
// @name         更好的B站分享按钮
// @author       果冻大神
// @namespace    http://tampermonkey.net/
// @version      2025.12.5.1
// @description  替换原有分享按钮，点击后调用api生成短链接并复制页面标题和短链接到剪切板
// @match        *://www.bilibili.com/*
// @match        *://live.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503586/%E6%9B%B4%E5%A5%BD%E7%9A%84B%E7%AB%99%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/503586/%E6%9B%B4%E5%A5%BD%E7%9A%84B%E7%AB%99%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SHORTEN_API_URL = 'https://api.bilibili.com/x/share/click';

    function cleanTitle(ignoredTitle, isLive) {
        console.log("开始获取标题和作者信息...");
        console.log("当前页面类型:", isLive ? "直播" : window.location.pathname.startsWith('/read') ? "阅读" : window.location.pathname.startsWith('/list') ? "稍后再看" : "视频");
        console.log("当前URL:", window.location.href);

        let titleText = '';
        let authorText = '';

        try {
            // 根据页面类型选择不同的选择器
            if (isLive || window.location.hostname === 'live.bilibili.com') {
                console.log("直播页面选择器");
                // 使用您提供的XPath转换的选择器
                const titleElement = document.querySelector('.live-title .text');
                const authorElement = document.querySelector('.room-owner-username');
                titleText = titleElement.textContent.trim();
                authorText = authorElement.textContent.trim();
            } else if (window.location.pathname.startsWith('/read')) {
                console.log("阅读页面选择器");
                const titleElement = document.querySelector("#head-info-vm > div > div.upper-row > div.left-ctnr.left-header-area > a");
                const authorElement = document.querySelector("#app > div.opus-detail > div.bili-opus-view > div.opus-module-author > div.opus-module-author__center > div.opus-module-author__name.fr-bold-198659cedb2");
                titleText = titleElement ? titleElement.textContent.trim() : '';
                authorText = authorElement ? authorElement.textContent.trim() : '';
            } else if (window.location.pathname.startsWith('/opus')) {
                console.log("新版阅读页面选择器");
                const titleElement = document.querySelector("#app > div.opus-detail > div.bili-opus-view > div.opus-module-title.fr-bold-198659cedb2 > span");
                const authorElement = document.querySelector("#app > div.opus-detail > div.bili-opus-view > div.opus-module-author > div.opus-module-author__center > div.opus-module-author__name.fr-bold-198659cedb2");
                titleText = titleElement ? titleElement.textContent.trim() : '';
                authorText = authorElement ? authorElement.textContent.trim() : '';
            }else if (window.location.pathname.startsWith('/list')) {
                console.log("稍后再看页面选择器");
                let titleElement = document.querySelector("#mirror-vdcon > div.playlist-container--left > div.video-info-container.win > div.video-info-title > div > h1 > a")
                || document.querySelector("#mirror-vdcon > div.playlist-container--left > div.video-info-container.mac > div.video-info-title > div > h1 > a");
                let authorElement = document.querySelector("#mirror-vdcon > div.playlist-container--right > div.up-panel-container > div.up-info-container > div.up-info--right > div.up-info__detail > div > div.up-detail-top > a.up-name.vip")
                || document.querySelector("#mirror-vdcon > div.playlist-container--right > div.up-panel-container > div.up-info-container > div.up-info--right > div.up-info__detail > div > div.up-detail-top > a.up-name")
                || document.querySelector("#mirror-vdcon > div.playlist-container--right > div.up-panel-container > div.members-info-container > div > div.container > div:nth-child(1) > div > div > a");
                titleText = titleElement ? titleElement.textContent.trim() : '';
                authorText = authorElement ? authorElement.textContent.trim() : '';
            }else if (window.location.pathname.startsWith('/video')) {
                console.log("视频页面选择器");
                const titleElement = document.querySelector("#viewbox_report > div.video-info-title > div > h1");
                let authorElement = document.querySelector("#mirror-vdcon > div.right-container > div > div.up-panel-container > div.up-info-container > div.up-info--right > div.up-info__detail > div > div.up-detail-top > a.up-name.vip")
                || document.querySelector("#mirror-vdcon > div.right-container > div > div.up-panel-container > div.up-info-container > div.up-info--right > div.up-info__detail > div > div.up-detail-top > a.up-name")
                || document.querySelector("#mirror-vdcon > div.right-container > div > div.up-panel-container > div.members-info-container > div > div.container > div:nth-child(1) > div > div > a");
                titleText = titleElement ? titleElement.textContent.trim() : '';
                authorText = authorElement ? authorElement.textContent.trim() : '';
            }
        } catch (error) {
            console.error("获取标题和作者时出错:", error);
        }

        console.log("获取到的标题:", titleText);
        console.log("获取到的作者:", authorText);

        // 组合标题和作者
        return `标题：${titleText}\nUP主：${authorText}`;
    }

    // 将指定文本复制到剪切板。
    // 使用 Clipboard API 的 `writeText` 方法实现复制功能。
    // 成功后调用 `showSuccessMessage` 显示成功消息；
    // 如果发生错误，则在控制台输出错误信息。
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => showSuccessMessage("复制成功")) // 复制成功后显示提示消息
            .catch(err => console.error('复制失败:', err)); // 复制失败时输出错误信息
    }


    // 显示一个短暂的提示消息，告知用户复制成功。
    // 创建一个新的 `div` 元素来显示消息，并设置其样式。
    // 通过计算原有按钮的字体大小来动态设置提示消息的样式。
    // 消息会在页面上显示一秒钟后自动移除。
    function showSuccessMessage(message) {
        const betterShareSpan = document.getElementById('BetterShare');
        const betterShareFontSize = window.getComputedStyle(betterShareSpan).fontSize;
        const fontSizeValue = parseFloat(betterShareFontSize);

        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.innerText = message;
        document.body.appendChild(messageDiv);
        Object.assign(messageDiv.style, {
            position: 'fixed',
            padding: `${fontSizeValue * 0.5}px ${fontSizeValue}px`, // 动态设置内边距
            backgroundColor: '#000000', // 背景色为黑色
            color: '#ffffff', // 文本颜色为白色
            borderRadius: `${fontSizeValue * 0.5}px`, // 动态设置圆角
            boxShadow: `0 ${fontSizeValue * 0.1}px ${fontSizeValue * 0.5}px rgba(0,0,0,0.2)`, // 添加阴影
            zIndex: 9999, // 使提示消息浮在其他内容之上
            fontSize: betterShareFontSize, // 设置与按钮相同的字体大小
            fontWeight: 'bold', // 设置字体加粗
            maxWidth: '300px', // 限制最大宽度
        });

        if (betterShareSpan) {
            const rect = betterShareSpan.getBoundingClientRect(); // 获取 BetterShare 按钮的位置
            const messageDivRect = messageDiv.getBoundingClientRect(); // 获取消息框的位置
            messageDiv.style.left = `${rect.left + (rect.width / 2) - (messageDivRect.width / 2)}px`; // 中心对齐
            messageDiv.style.top = `${rect.top - messageDivRect.height - 10}px`; // 在按钮上方显示，并留出 10px 间距
        } else {
            console.warn('未找到 BetterShare span，无法定位提示 div。'); // 找不到按钮时输出警告
        }

        setTimeout(() => {
            messageDiv.remove(); // 一秒后移除提示消息
        }, 1000);
    }

    // 使用 B 站的 API 生成短链接。
    // 通过 POST 请求将长链接发送到指定的 API，并解析返回的 JSON 数据。
    // 如果请求失败，则返回原始链接。
    // API 请求中的参数包括随机生成的 build、buvid 和 shareMode，以模拟真实的请求。
    async function getShortenedUrl(longUrl) {
        const build = Math.floor(Math.random() * 3000001) + 6000000; // 随机生成 build 值
        const buvid = Array.from({ length: 32 }, () => Math.random().toString(36)[2]).join('') + 'infoc'; // 随机生成 buvid
        const platform = ['android', 'ios'][Math.floor(Math.random() * 2)]; // 随机选择平台
        const shareMode = Math.floor(Math.random() * 10) + 1; // 随机生成 shareMode

        try {
            const response = await fetch(SHORTEN_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    build,
                    buvid,
                    oid: longUrl,
                    platform,
                    share_channel: 'COPY',
                    share_id: 'public.webview.0.0.pv',
                    share_mode: shareMode
                }).toString()
            });
            const data = await response.json();
            return data.data?.content || longUrl; // 返回短链接，如果 API 响应中没有短链接，则返回原始链接
        } catch (error) {
            console.error('获取短链接失败:', error); // 捕获并输出错误
            return longUrl; // 返回原始链接以应对失败情况
        }
    }

    // 获取指定元素的计算样式，并返回一个对象，包含常用的样式属性。
    // 主要用于获取样式信息，以便在创建新元素时应用相同的样式。
    function getComputedStyles(element) {
        const computedStyle = window.getComputedStyle(element);
        return {
            padding: computedStyle.padding, // 内边距
            border: computedStyle.border, // 边框
            backgroundColor: computedStyle.backgroundColor, // 背景色
            borderRadius: computedStyle.borderRadius, // 圆角
            fontSize: computedStyle.fontSize, // 字体大小
            fontWeight: computedStyle.fontWeight, // 字体粗细
            lineHeight: computedStyle.lineHeight // 行高
        };
    }

    // 创建一个带有指定文本和样式的 `span` 元素。
    // 应用传入的样式对象，并设置鼠标悬停时的光标样式。
    // 返回创建的 `span` 元素。
    function createSpanElement(text, styles) {
        const span = document.createElement('span');
        span.innerText = text;
        Object.assign(span.style, styles, { cursor: 'pointer' }); // 应用样式并设置光标样式
        return span;
    }

    // 创建替换的分享按钮，作为一个 `span` 元素。
    // 根据页面是否为直播页面决定按钮的样式和行为。
    // 为按钮添加点击事件处理程序，点击时获取当前页面的标题和短链接，并将其复制到剪切板。
    // 修改创建替换span的函数，确保正确传递isLive参数
    function createReplacementSpan(isLive = false) {
        const targetSpan = document.querySelector("#arc_toolbar_report > div.video-toolbar-left > div.video-toolbar-left-main > div:nth-child(1) > div > span");
        const styles = targetSpan ? getComputedStyles(targetSpan) : {};

        const span = createSpanElement('分享', styles);
        span.id = 'BetterShare';

        // 确保正确传递isLive参数
        const actualIsLive = isLive || window.location.hostname === 'live.bilibili.com';

        span.addEventListener('click', async (event) => {
            event.stopPropagation();
            const title = cleanTitle(document.title, actualIsLive);
            const url = window.location.href;
            try {
                const shortUrl = await getShortenedUrl(url);
                const textToCopy = `${title}\n链接：${shortUrl}`;

                console.log("最终复制内容:", textToCopy);
                copyToClipboard(textToCopy);
            } catch (error) {
                console.error('获取短链接失败:', error);
            }
        });

        return span;
    }

    // 替换页面中的分享按钮。
    // 选择指定的旧按钮元素并将其移除，然后创建一个新的分享按钮并添加到目标容器中。
    // 如果找不到旧按钮，则每 500 毫秒重试一次，直到找到并替换按钮。
    function replaceShareButton(selector, targetContainerSelector) {
        const oldButton = document.querySelector(selector);
        if (oldButton) {
            oldButton.remove(); // 移除旧按钮
            const newButton = createReplacementSpan(); // 创建新的分享按钮
            const targetContainer = document.querySelector(targetContainerSelector);
            if (targetContainer) {
                targetContainer.style.position = 'relative'; // 设置目标容器的相对定位，以便新按钮能够正确定位
                targetContainer.appendChild(newButton); // 将新按钮添加到目标容器中
            } else {
                console.warn('目标容器未找到，无法添加新按钮。'); // 找不到目标容器时输出警告
            }
        } else {
            setTimeout(() => replaceShareButton(selector, targetContainerSelector), 500); // 每 500 毫秒重试一次
        }
    }

    // 替换视频页面的分享按钮。
    // 选择并移除旧的分享按钮，然后在工具栏中添加新的分享按钮。
    // 如果找到 SVG 图标，则将其与新按钮一起添加到工具栏中。
    // 如果找不到目标容器，则每 500 毫秒重试一次，直到找到并替换按钮。
    function replaceVideoShareSpan() {
        const oldButton = document.getElementById('share-btn-outer');
        if (!oldButton) {
            setTimeout(replaceVideoShareSpan, 500);
            return;
        }

        const svgElement = oldButton.querySelector("svg"); // 更安全的SVG获取方式
        oldButton.remove();

        // 1. 统一声明变量（避免作用域问题）
        let toolbar;
        let targetContainer;

        // 2. 根据路径初始化变量
        if (window.location.pathname.startsWith('/list')) {
            toolbar = document.querySelector("#playlistToolbar > div.video-toolbar-left > div");
            targetContainer = document.querySelector("#playlistToolbar > div.video-toolbar-left > div > div:nth-child(4) > div"); // 列表页目标容器就是toolbar本身
        } else {
            toolbar = document.querySelector("#arc_toolbar_report > div.video-toolbar-left > div.video-toolbar-left-main");
            // 详情页目标容器是工具栏内的特定子元素
            targetContainer = document.querySelector("#arc_toolbar_report > div.video-toolbar-left > div.video-toolbar-left-main > div:nth-child(4) > div");
        }

        // 3. 检查并操作元素
        if (!toolbar) {
            console.warn('工具栏未找到');
            return;
        }

        toolbar.style.position = 'relative'; // 设置工具栏定位

        if (!targetContainer) {
            console.warn('目标容器未找到');
            return;
        }

        // 清空容器并添加新内容
        targetContainer.innerHTML = ''; // 更简洁的清空方式
        if (svgElement) targetContainer.appendChild(svgElement);
        targetContainer.appendChild(createReplacementSpan());
    }


    // 替换直播页面中的分享按钮
    // 查找并移除现有的分享按钮，然后创建并添加一个新的分享按钮，包括 SVG 图标和功能
    // 如果目标位置未找到，则每 500 毫秒重试一次，直到成功替换

    function replaceLiveShareSpan() {
        // 查找现有的分享按钮
        const oldButton = document.querySelector("#head-info-vm > div > div.upper-row > div.right-ctnr > div.more.live-skin-normal-a-text");

        if (oldButton) {
            // 如果找到旧按钮，先将其从页面中移除
            oldButton.remove();

            // 创建新的 div 元素用于放置新的分享按钮
            const newDiv = document.createElement('div');
            newDiv.className = 'icon-ctnr live-skin-normal-a-text pointer'; // 设置新按钮的类名以匹配目标样式
            newDiv.style.display = 'flex'; // 使用 flex 布局以确保按钮的正确排列

            // 创建 SVG 元素并设置其属性
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgElement.setAttribute("width", "16");
            svgElement.setAttribute("height", "16");
            svgElement.setAttribute("viewBox", "0 0 16 16");
            svgElement.setAttribute("fill", "none");
            svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");

            // 创建 SVG 的路径元素并设置其属性
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("fill-rule", "evenodd");
            path.setAttribute("clip-rule", "evenodd");
            path.setAttribute("d", "M7.54545 8.77273C7.54545 8.2991 7.40057 7.8593 7.15271 7.49525L8.45958 5.85854C8.73664 5.97879 9.04235 6.04545 9.36364 6.04545C10.6188 6.04545 11.6364 5.02792 11.6364 3.77273C11.6364 2.51753 10.6188 1.5 9.36364 1.5C8.10844 1.5 7.09091 2.51753 7.09091 3.77273C7.09091 4.37821 7.32768 4.92839 7.71369 5.33573L6.49801 6.85824C6.14444 6.63149 5.72394 6.5 5.27273 6.5C4.01753 6.5 3 7.51753 3 8.77273C3 10.0279 4.01753 11.0455 5.27273 11.0455C5.9233 11.0455 6.51003 10.7721 6.92432 10.334L8.59402 11.1688C8.50381 11.4137 8.45455 11.6784 8.45455 11.9545C8.45455 13.2097 9.47208 14.2273 10.7273 14.2273C11.9825 14.2273 13 13.2097 13 11.9545C13 10.6994 11.9825 9.68182 10.7273 9.68182C10.0767 9.68182 9.48997 9.95517 9.07568 10.3933L7.40598 9.55843C7.49619 9.31357 7.54545 9.0489 7.54545 8.77273ZM10.7273 3.77273C10.7273 4.52584 10.1168 5.13636 9.36364 5.13636C8.61052 5.13636 8 4.52584 8 3.77273C8 3.01961 8.61052 2.40909 9.36364 2.40909C10.1168 2.40909 10.7273 3.01961 10.7273 3.77273ZM5.27273 10.1364C6.02584 10.1364 6.63636 9.52584 6.63636 8.77273C6.63636 8.01961 6.02584 7.40909 5.27273 7.40909C4.51961 7.40909 3.90909 8.01961 3.90909 8.77273C3.90909 9.52584 4.51961 10.1364 5.27273 10.1364ZM12.0909 11.9545C12.0909 12.7077 11.4804 13.3182 10.7273 13.3182C9.97416 13.3182 9.36364 12.7077 9.36364 11.9545C9.36364 11.2014 9.97416 10.5909 10.7273 10.5909C11.4804 10.5909 12.0909 11.2014 12.0909 11.9545Z");
            path.setAttribute("fill", "#979797"); // 设置路径颜色
            svgElement.appendChild(path); // 将路径元素添加到 SVG 中

            newDiv.appendChild(svgElement); // 将 SVG 添加到新的 div 中

            // 创建新的 span 元素，并应用替代的样式
            const newSpan = createReplacementSpan(true);

            // 查找目标 span 元素以获取其样式
            const targetSpan = document.querySelector("#head-info-vm > div > div.upper-row > div.right-ctnr > div.icon-ctnr.live-skin-normal-a-text.not-hover > span");
            if (targetSpan) {
                // 如果找到目标 span，则获取其计算样式并应用到新的 span 上
                const computedStyle = window.getComputedStyle(targetSpan);
                Object.assign(newSpan.style, {
                    fontSize: computedStyle.fontSize,
                    lineHeight: computedStyle.lineHeight,
                    marginLeft: computedStyle.marginLeft,
                    fontWeight: computedStyle.fontWeight // 复制字体粗细
                });
                newSpan.className = targetSpan.className; // 复制类名以匹配样式
                newSpan.style.verticalAlign = 'middle'; // 垂直对齐方式
            } else {
                // 如果未找到目标 span，则在控制台输出警告
                console.warn('未找到目标 span 元素，样式无法获取。');
            }

            newDiv.appendChild(newSpan); // 将新的 span 添加到新的 div 中

            // 查找目标 div 元素以获取其样式
            const targetElement = document.querySelector("#head-info-vm > div > div.upper-row > div.right-ctnr > div.icon-ctnr.live-skin-normal-a-text.not-hover");
            if (targetElement) {
                // 如果找到目标 div，则应用其计算样式到新的 div 上
                const computedStyle = window.getComputedStyle(targetElement);
                Object.assign(newDiv.style, {
                    color: computedStyle.color,
                    fontSize: computedStyle.fontSize,
                    fontWeight: computedStyle.fontWeight,
                    backgroundColor: computedStyle.backgroundColor,
                    height: computedStyle.height,
                    lineHeight: computedStyle.lineHeight,
                    padding: computedStyle.padding,
                    marginLeft: computedStyle.marginLeft,
                    border: computedStyle.border,
                    borderRadius: computedStyle.borderRadius,
                    cursor: 'pointer' // 设置光标样式
                });
            } else {
                // 如果未找到目标 div，则在控制台输出警告
                console.warn('未找到目标 div 元素，样式无法获取。');
            }

            // 查找目标容器并将新的 div 添加到其中
            const liveToolbar = document.querySelector("#head-info-vm > div > div.upper-row > div.right-ctnr");
            if (liveToolbar) {
                liveToolbar.style.position = 'relative'; // 确保新按钮定位正确
                liveToolbar.appendChild(newDiv); // 将新的分享按钮添加到目标容器中
            }
        } else {
            // 如果未找到旧按钮，则每 500 毫秒重试一次
            setTimeout(replaceLiveShareSpan, 500);
        }
    }

    // 替换阅读页面中的分享按钮
    // 调用 replaceShareButton 函数，将阅读页面中指定的旧分享按钮替换为新按钮
    function replaceReadShareSpan() {
        replaceShareButton(
            "#app > div > div.article-container > div.interaction-info > div > div", // 旧按钮的选择器
            "#app > div > div.article-container > div.interaction-info > div" // 新按钮应添加到的容器选择器
        );
    }

    // 替换新版阅读页面中的分享按钮
    // 调用 replaceShareButton 函数，将阅读页面中指定的旧分享按钮替换为新按钮
    function replaceNewReadShareSpan() {
        replaceShareButton(
            "#app > div.opus-detail > div.bili-opus-view > div.opus-module-bottom > div.opus-module-bottom__share", // 旧按钮的选择器
            "#app > div.opus-detail > div.bili-opus-view > div.opus-module-bottom" // 新按钮应添加到的容器选择器
        );
    }

    // 初始化函数，用于根据不同页面类型调用相应的替换函数
    function init() {
        // 检查当前页面的主机名
        if (window.location.hostname === 'live.bilibili.com') {
            // 如果是直播页面，调用替换直播分享按钮的函数
            replaceLiveShareSpan();
        } else if (window.location.pathname.startsWith('/read')) {
            // 如果是阅读页面，调用替换阅读分享按钮的函数
            replaceReadShareSpan();
        } else if (window.location.pathname.startsWith('/opus')) {
            // 如果是新版阅读页面，调用替换阅读分享按钮的函数
            replaceNewReadShareSpan();
        } else if (window.location.pathname.startsWith('/video')) {
            // 对于视频类型的页面，调用替换视频分享按钮的函数
            replaceVideoShareSpan();
        }else if (window.location.pathname.startsWith('/list')) {
            // 对于稍后再看类型的页面，调用替换视频分享按钮的函数
            replaceVideoShareSpan();
        }
    }

    // 调用 init 函数以初始化页面按钮的替换
    init();
})();