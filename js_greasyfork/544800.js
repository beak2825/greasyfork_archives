// ==UserScript==
// @name         多功能网页工具箱
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  网页多功能快捷操作，整合了智能总结、复制、站内多引擎搜索、图片查看、阅读模式、黑夜模式等实用功能，并提供可拖动的浮动菜单。
// @author       CodeBuddy
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/544800/%E5%A4%9A%E5%8A%9F%E8%83%BD%E7%BD%91%E9%A1%B5%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/544800/%E5%A4%9A%E5%8A%9F%E8%83%BD%E7%BD%91%E9%A1%B5%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 显示通知
     * @param {string} msg 通知消息
     */
    const showNotice = (msg) => {
        const previousAlert = document.getElementById('clipboard-alert');
        if (previousAlert) {
            previousAlert.remove();
        }
        const tempAlert = document.createElement('div');
        tempAlert.id = 'clipboard-alert';
        tempAlert.textContent = msg;
        tempAlert.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(59, 124, 241, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 2147483647;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(tempAlert);
        setTimeout(() => {
            tempAlert.remove();
        }, 1500);
    };

    /**
     * 智能总结功能：打开一个侧边栏，并复制当前网页链接及提示语。
     */
    function smartSummary() {
        const urlWithPrompt = window.location.href + '\n' + '请返回您仔细阅读正文后精心写成的详尽笔记';
        GM_setClipboard(urlWithPrompt);

        showNotice('将网页一键发送到 AI 来总结内容，需要粘贴一下链接哦');

        if (document.getElementById('sidebarView')) {
            document.getElementById('sidebarView').remove();
            document.getElementById('container').remove();
            document.getElementById('resize-handle').remove();
            return;
        }

        const frame = document.createElement('iframe');
        frame.id = 'sidebarView';
        const hrefs = {
            'https://kimi.moonshot.cn/': 'Kimi',
            'https://www.doubao.com/chat/': '豆包',
            'https://tongyi.aliyun.com/qianwen': '通义',
            'https://hailuoai.com/home': '海螺',
            'https://yuewen.cn/chats/new': '跃问',
            'https://chat.rawchat.cc': 'ChatGPT'
        };
        const hrefKeys = Object.keys(hrefs);
        frame.src = hrefKeys[0];
        frame.style.cssText = 'position:fixed; top:0; right:0; height:100%; width:450px; border:1px solid #bbb; background:#fff; z-index:100000;';
        document.body.appendChild(frame);

        const resizeHandle = document.createElement('div');
        resizeHandle.id = 'resize-handle';
        resizeHandle.style.cssText = 'width:10px; height:100%; position:fixed; top:0; right:450px; cursor:ew-resize; z-index:100001; background-color:rgba(0,0,0,0.1);';
        document.body.appendChild(resizeHandle);
        let isResizing = false;
        resizeHandle.addEventListener('mousedown', () => isResizing = true);
        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const newWidth = document.body.offsetWidth - e.clientX;
            frame.style.width = newWidth + 'px';
            resizeHandle.style.right = newWidth + 'px';
            container.style.right = (newWidth / 2 - container.offsetWidth / 2) + 'px';
        });
        document.addEventListener('mouseup', () => isResizing = false);

        const container = document.createElement('div');
        container.id = 'container';
        container.style.cssText = 'position:fixed; top:20px; z-index:999999; display:flex; align-items:center;';
        document.body.appendChild(container);

        const siteSelect = document.createElement('select');
        siteSelect.id = 'siteSelect';
        siteSelect.style.cssText = 'width:62px; height:30px; border-radius:8px 0 0 8px; border:2px solid #bbb; background-color:#eee; font-size:16px; text-align:center; padding:0 10px; border-right:1px solid #bbb; background-image: none;';
        Object.entries(hrefs).forEach(([href, name]) => {
            const option = document.createElement('option');
            option.value = href;
            option.textContent = name;
            siteSelect.appendChild(option);
        });
        siteSelect.onchange = () => frame.src = siteSelect.value;
        container.appendChild(siteSelect);

        const closeButton = document.createElement('button');
        closeButton.id = 'sidebarClose';
        closeButton.style.cssText = 'all:unset; width:28px; height:30px; border-radius:0 8px 8px 0; border:2px solid #bbb; border-left:none; background-color:#eee; text-align:center; line-height:26px; font-size:16px; cursor:pointer;';
        closeButton.innerText = '✕';
        closeButton.onclick = () => {
            document.getElementById('sidebarView').remove();
            document.getElementById('container').remove();
            document.getElementById('resize-handle').remove();
        };
        container.appendChild(closeButton);

        const updateButtonPositions = () => {
            const iframeWidth = frame.offsetWidth;
            const containerWidth = container.offsetWidth;
            container.style.right = (iframeWidth / 2 - containerWidth / 2) + 'px';
        };
        updateButtonPositions();
    }

    /**
     * 复制或保存功能
     * @param {string} type 复制类型：'markdown' 或 'html'
     */
    function handleLinkAndHtml(type) {
        if (type === 'markdown') {
            const title = document.title;
            const url = window.location.href;
            const textToCopy = `[${title}](${url})`;
            GM_setClipboard(textToCopy);
            showNotice(`已复制网页Markdown到粘贴板！`);
        } else if (type === 'save-html') {
            const filename = document.title.replace(/[<>:"/\\|?*]+/g, '') + '.html';
            const htmlContent = `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);
            showNotice('已开始下载网页HTML文件。');
        }
    }

    /**
     * 查看网页图片功能
     * @param {string} type 查看类型：'all', 'hd', 'gif', 'remove'
     */
    function viewImages(type) {
        if (type === 'remove') {
            (function() {
                function toArray(c) {
                    var a, k;
                    a = new Array;
                    for (k = 0; k < c.length; ++k) a[k] = c[k];
                    return a;
                }
                var images, img, altText;
                images = toArray(document.images);
                for (var i = 0; i < images.length; ++i) {
                    img = images[i];
                    altText = document.createTextNode(img.alt);
                    img.parentNode.replaceChild(altText, img);
                }
            })();
            showNotice('已移除页面上的所有图片');
            return;
        }

        let outText = '';
        const w = 499, h = 499;
        const seen = new Set();
        const images = document.images;

        for (const img of images) {
            const src = img.src;
            if (!src || seen.has(src)) continue;
            seen.add(src);

            if (type === 'gif') {
                // 只查看GIF动图
                if (src.toLowerCase().endsWith('.gif')) {
                    outText += `<tr><td><img style="max-width:800px;" src="${src}"></td><td>${img.naturalWidth}x${img.naturalHeight}</td></tr>`;
                }
            } else if (type === 'hd') {
                // 只查看高清图
                const isHD = img.naturalWidth >= w && img.naturalHeight >= h;
                if (isHD) {
                    outText += `<tr><td><img style="max-width:800px;" src="${src}"></td><td>${img.naturalWidth}x${img.naturalHeight}</td></tr>`;
                }
            } else {
                // 查看所有图片
                outText += `<tr><td><img style="max-width:800px;" src="${src}"></td><td>${img.naturalWidth}x${img.naturalHeight}</td></tr>`;
            }
        }

        if (outText) {
            const imgWindow = window.open('', 'imgWin');
            imgWindow.document.write(`
                <table style="margin:auto; border-collapse: collapse;" border="1" cellpadding="10">
                    <tr><th>图片</th><th>尺寸</th></tr>
                    ${outText}
                </table>
            `);
            imgWindow.document.close();
        } else {
            alert(type === 'hd' ? '没有高清图片！' : (type === 'gif' ? '没有GIF动图！' : '没有图片！'));
        }
    }

    /**
     * 站内多引擎搜索功能
     */
    function multiEngineSiteSearch() {
        const bar = location.host;
        let q = window.getSelection().toString();

        // 如果没有选中文本，则弹出输入框
        if (!q) {
            q = prompt("请输入搜索的关键词:", "");
            if (!q) return; // 用户取消了输入
        }

        // 搜索引擎URL
        const engines = {
            baidu: `https://www.baidu.com/s?ie=UTF-8&wd=${encodeURIComponent(q)} site:${bar}`,
            google: `https://www.google.com/search?q=${encodeURIComponent(q)} site:${bar}`,
            bing: `https://www.bing.com/search?q=${encodeURIComponent(q)} site:${bar}`,
            yandex: `https://yandex.com/search/?text=${encodeURIComponent(q)} site:${bar}`
        };

        // 默认使用所有搜索引擎
        for (const url of Object.values(engines)) {
            window.open(url, '_blank');
        }
    }

    /**
     * 切换黑夜/护眼模式
     */
    function toggleNightMode() {
        const id = 'night-mode-css';
        let style = document.getElementById(id);

        if (style) {
            style.remove();
            showNotice('已关闭黑夜/护眼模式');
        } else {
            const css = 'html{filter:invert(1) hue-rotate(180deg)!important; background-color: #fff !important;} body{background-color: #fff !important;} img, video, .night-mode-ignore, .float-button, #float-menu{filter:invert(1) hue-rotate(180deg)!important;} .float-menu-item{color: #000 !important;}';
            style = document.createElement('style');
            style.id = id;
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
            showNotice('已开启黑夜/护眼模式');
        }
    }

    /**
     * 解除网页限制
     */
    function unlockWebpage() {
        const removeListeners = () => {
            ['copy', 'cut', 'contextmenu', 'selectstart', 'mousedown', 'mouseup', 'mousemove', 'keydown', 'keypress', 'keyup'].forEach(eventName => {
                document.documentElement.removeEventListener(eventName, e => e.stopPropagation(), true);
            });
        };
        removeListeners();

        document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el, null);
            if (style.getPropertyValue('user-select') === 'none') {
                el.style.setProperty('user-select', 'text', 'important');
            }
        });

        if (document.body.getAttribute('contenteditable') === 'true') {
            document.body.setAttribute('contenteditable', 'false');
            showNotice('已关闭网页编辑模式');
        } else {
            showNotice('已尝试解除网页限制！');
        }
    }

    /**
     * 自动滚屏功能
     */
    function autoScroll() {
        // 如果已经在滚动，则停止
        if (window.autoScrollActive) {
            clearInterval(window.scrollInterval);
            window.autoScrollActive = false;
            showNotice('自动滚屏已关闭');
            return;
        }

        // 创建控制面板
        const controlPanel = document.createElement('div');
        controlPanel.id = 'scroll-control-panel';
        controlPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(59, 124, 241, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            z-index: 9999999;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        `;

        // 速度显示
        const speedDisplay = document.createElement('span');
        speedDisplay.textContent = '速度: 1';
        speedDisplay.style.marginRight = '10px';

        // 减速按钮
        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '-';
        decreaseBtn.style.cssText = 'padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;';

        // 加速按钮
        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '+';
        increaseBtn.style.cssText = 'padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;';

        // 停止按钮
        const stopBtn = document.createElement('button');
        stopBtn.textContent = '停止';
        stopBtn.style.cssText = 'padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;';

        // 添加到控制面板
        controlPanel.appendChild(speedDisplay);
        controlPanel.appendChild(decreaseBtn);
        controlPanel.appendChild(increaseBtn);
        controlPanel.appendChild(stopBtn);

        // 添加到页面
        document.body.appendChild(controlPanel);

        // 滚动速度和状态
        let scrollSpeed = 1;
        window.autoScrollActive = true;

        // 开始滚动
        window.scrollInterval = setInterval(() => {
            window.scrollBy(0, scrollSpeed);
        }, 20);

        // 按钮事件
        decreaseBtn.addEventListener('click', () => {
            if (scrollSpeed > 1) {
                scrollSpeed--;
                speedDisplay.textContent = `速度: ${scrollSpeed}`;
            }
        });

        increaseBtn.addEventListener('click', () => {
            if (scrollSpeed < 10) {
                scrollSpeed++;
                speedDisplay.textContent = `速度: ${scrollSpeed}`;
            }
        });

        stopBtn.addEventListener('click', () => {
            clearInterval(window.scrollInterval);
            window.autoScrollActive = false;
            controlPanel.remove();
            showNotice('自动滚屏已关闭');
        });

        // ESC键停止滚动
        const keyHandler = (e) => {
            if (e.key === 'Escape') {
                clearInterval(window.scrollInterval);
                window.autoScrollActive = false;
                controlPanel.remove();
                document.removeEventListener('keydown', keyHandler);
                showNotice('自动滚屏已关闭');
            }
        };
        document.addEventListener('keydown', keyHandler);
    }

    /**
     * 自动刷新功能
     */
    function autoRefresh() {
        (function(p) {
            open('', '', p).document.write('<body id=1><nobr id=2></nobr><hr><nobr id=3></nobr><hr><a href="#"onclick="return!(c=t)">Force</a><script>function i(n){return d.getElementById(n)}function z(){c+=0.2;if(c>=t){c=0;e.location=u;r++}x()}function x(){s=t-Math.floor(c);m=Math.floor(s/60);s-=m*60;i(1).style.backgroundColor=(r==0||c/t>2/3?"fcc":c/t<1/3?"cfc":"ffc");i(2).innerHTML="Reloads: "+r;i(3).innerHTML="Time: "+m+":"+(s<10?"0"+s:s)}c=r=0;d=document;e=opener.top;u=prompt("URL",e.location.href);t=u?prompt("Seconds",60):0;setInterval("z()",200);if(!t){window.close()}</script></body>');
        })('status=0,scrollbars=0,width=100,height=115,left=1,top=1');
    }


    /**
     * 生成网页二维码
     */
    function generateQRCode() {
        // 加载QR码生成库
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js';
        script.onload = function() {
            // 创建QR码容器
            const qrContainer = document.createElement('div');
            qrContainer.style.position = 'fixed';
            qrContainer.style.zIndex = '2147483647';
            qrContainer.style.top = '0';
            qrContainer.style.left = '0';
            qrContainer.style.width = '100%';
            qrContainer.style.height = '100%';
            qrContainer.style.backgroundColor = 'rgba(0,0,0, 0.6)';
            qrContainer.style.cursor = 'pointer';

            // 点击背景关闭
            qrContainer.addEventListener('click', function(e) {
                if (e.target === e.currentTarget) {
                    qrContainer.parentNode.removeChild(qrContainer);
                }
            }, false);

            // 创建内容容器
            const contentDiv = document.createElement('div');
            contentDiv.style.position = 'absolute';
            contentDiv.style.top = '25%';
            contentDiv.style.left = '50%';
            contentDiv.style.transform = 'translate(-50%, -50%)';
            contentDiv.style.cursor = 'auto';
            contentDiv.style.backgroundColor = 'white';
            contentDiv.style.padding = '20px';
            contentDiv.style.borderRadius = '8px';
            qrContainer.appendChild(contentDiv);

            // 创建QR码
            const qrDiv = document.createElement('div');
            contentDiv.appendChild(qrDiv);

            try {
                new QRCode(qrDiv, {
                    text: location.href,
                    width: 200,
                    height: 200,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            } catch (e) {
                console.error("QR码生成失败:", e);
                qrDiv.textContent = "二维码生成失败，请重试";
            }

            // 创建输入框
            const input = document.createElement('input');
            input.type = 'text';
            input.value = location.href;
            input.style.display = 'block';
            input.style.width = '100%';
            input.style.fontSize = '14px';
            input.style.marginTop = '10px';
            input.style.padding = '5px';
            input.style.boxSizing = 'border-box';
            contentDiv.appendChild(input);

            // 创建更新按钮
            const updateBtn = document.createElement('button');
            updateBtn.textContent = '更新二维码';
            updateBtn.style.marginTop = '10px';
            updateBtn.style.padding = '5px 10px';
            updateBtn.style.backgroundColor = '#3B7CF1';
            updateBtn.style.color = 'white';
            updateBtn.style.border = 'none';
            updateBtn.style.borderRadius = '4px';
            updateBtn.style.cursor = 'pointer';
            updateBtn.onclick = function() {
                qrDiv.innerHTML = '';
                try {
                    new QRCode(qrDiv, {
                        text: input.value,
                        width: 200,
                        height: 200,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                } catch (e) {
                    console.error("QR码更新失败:", e);
                    qrDiv.textContent = "二维码更新失败，请重试";
                }
            };
            contentDiv.appendChild(updateBtn);

            document.body.appendChild(qrContainer);
        };

        script.onerror = function() {
            // 如果加载失败，尝试备用库
            const backupScript = document.createElement('script');
            backupScript.src = 'https://cdn.staticfile.org/qrcodejs/1.0.0/qrcode.min.js';
            backupScript.onload = script.onload;
            backupScript.onerror = function() {
                alert('二维码库加载失败，请检查网络连接');
            };
            document.head.appendChild(backupScript);
        };

        document.head.appendChild(script);
    }

    /**
     * 显示明文密码
     */
    function showPasswords() {
        const inputs = document.getElementsByTagName('input');
        let count = 0;

        for (const input of inputs) {
            if (input.type.toLowerCase() === 'password') {
                try {
                    input.type = 'text';
                    count++;
                } catch(e) {
                    // 如果直接修改类型失败，尝试创建新元素替换
                    const newInput = document.createElement('input');
                    const attributes = input.attributes;

                    for (let j = 0; j < attributes.length; j++) {
                        const attr = attributes[j];
                        const attrName = attr.nodeName;
                        const attrValue = attr.nodeValue;

                        if (attrName.toLowerCase() !== 'type') {
                            if (attrName !== 'height' && attrName !== 'width' && !!attrValue) {
                                newInput[attrName] = attrValue;
                            }
                        }
                    }

                    newInput.type = 'text';
                    newInput.value = input.value;
                    input.parentNode.replaceChild(newInput, input);
                    count++;
                }
            }
        }

        showNotice(count > 0 ? `已显示 ${count} 个密码为明文！` : '页面上没有找到密码输入框！');
    }

    /**
     * 翻译当前页面
     */
    function translatePage() {
        const menuHtml = `
            <div id="translate-menu" style="position:fixed; z-index:2147483647; top:50%; left:50%; transform:translate(-50%,-50%); background-color:#fff; padding:15px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.2);">
                <h3 style="margin-top:0; text-align:center;">选择翻译服务</h3>
                <button id="translate-google" style="display:block; width:100%; padding:10px; margin-bottom:10px;">Google翻译</button>
                <button id="translate-baidu" style="display:block; width:100%; padding:10px; margin-bottom:10px;">百度翻译</button>
                <button id="translate-bing" style="display:block; width:100%; padding:10px; margin-bottom:10px;">必应翻译</button>
                <button id="translate-deepl" style="display:block; width:100%; padding:10px;">DeepL翻译</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', menuHtml);

        const currentUrl = encodeURIComponent(window.location.href);

        document.getElementById('translate-google').onclick = () => {
            window.open(`https://translate.google.com/translate?sl=auto&tl=zh-CN&u=${currentUrl}`, '_blank');
            document.getElementById('translate-menu').remove();
        };

        document.getElementById('translate-baidu').onclick = () => {
            window.open(`https://fanyi.baidu.com/transpage?query=${currentUrl}&from=auto&to=zh&source=url&render=1`, '_blank');
            document.getElementById('translate-menu').remove();
        };

        document.getElementById('translate-bing').onclick = () => {
            window.open(`https://www.microsofttranslator.com/bv.aspx?from=auto&to=zh-CHS&a=${currentUrl}`, '_blank');
            document.getElementById('translate-menu').remove();
        };

        document.getElementById('translate-deepl').onclick = () => {
            window.open(`https://www.deepl.com/translator#auto/zh/${currentUrl}`, '_blank');
            document.getElementById('translate-menu').remove();
        };
    }

    /**
     * 编辑当前页面
     */
    function editCurrentPage() {
        document.body.contentEditable = 'true';
        document.designMode = 'on';
        showNotice('已启用页面编辑模式，可以直接编辑页面内容');
    }

    /**
     * 网页便签MD编辑器
     */
    function openMdEditor() {
        const winsize = screen.width - 650;
        window.open('https://skhmt.github.io/pad/', '_blank', 'height=650,width=500,top=200,left=' + winsize);
    }

    /**
     * 阅读模式
     */
    function readingMode() {
        // 保存原始内容
        if (!window.originalContent) {
            window.originalContent = document.body.innerHTML;
        } else {
            // 如果已经在阅读模式，则恢复原始内容
            document.body.innerHTML = window.originalContent;
            window.originalContent = null;
            document.body.style.cssText = '';
            showNotice('已退出阅读模式');
            return;
        }

        // 提取主要内容
        let mainContent = '';

        // 尝试找到主要内容区域
        const possibleContentElements = [
            document.querySelector('article'),
            document.querySelector('main'),
            document.querySelector('.article'),
            document.querySelector('.post'),
            document.querySelector('.content'),
            document.querySelector('#content')
        ];

        // 使用第一个找到的有效元素
        const contentElement = possibleContentElements.find(el => el && el.textContent.length > 500);

        if (contentElement) {
            mainContent = contentElement.innerHTML;
        } else {
            // 如果找不到明确的内容区域，尝试提取所有段落
            const paragraphs = document.querySelectorAll('p');
            if (paragraphs.length > 5) {
                mainContent = Array.from(paragraphs)
                    .map(p => p.outerHTML)
                    .join('');
            } else {
                // 最后的备选方案
                mainContent = document.body.innerHTML;
            }
        }

        // 创建阅读模式界面
        document.body.innerHTML = `
            <div id="reading-mode-container">
                <div id="reading-mode-header">
                    <h1>${document.title}</h1>
                    <button id="exit-reading-mode">退出阅读模式</button>
                </div>
                <div id="reading-mode-content">
                    ${mainContent}
                </div>
            </div>
        `;

        // 应用阅读模式样式
        document.body.style.cssText = `
            background-color: #f8f8f8;
            color: #333;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        `;

        const container = document.getElementById('reading-mode-container');
        container.style.cssText = `
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            min-height: 100vh;
        `;

        const header = document.getElementById('reading-mode-header');
        header.style.cssText = `
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const exitButton = document.getElementById('exit-reading-mode');
        exitButton.style.cssText = `
            background-color: #3B7CF1;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        `;

        const content = document.getElementById('reading-mode-content');
        content.style.cssText = `
            font-size: 18px;
        `;

        // 添加图片响应式样式
        const style = document.createElement('style');
        style.textContent = `
            #reading-mode-content img {
                max-width: 100%;
                height: auto;
            }
            #reading-mode-content a {
                color: #3B7CF1;
                text-decoration: none;
            }
            #reading-mode-content a:hover {
                text-decoration: underline;
            }
            #reading-mode-content h1, #reading-mode-content h2, #reading-mode-content h3 {
                margin-top: 1.5em;
                margin-bottom: 0.5em;
            }
            #reading-mode-content p {
                margin-bottom: 1em;
            }
        `;
        document.head.appendChild(style);

        // 添加退出按钮事件
        exitButton.addEventListener('click', function() {
            document.body.innerHTML = window.originalContent;
            window.originalContent = null;
            document.body.style.cssText = '';
            showNotice('已退出阅读模式');
        });

        showNotice('已进入阅读模式');
    }

    /**
     * SEO查询功能
     */
    function seoQuery() {
        const domain = window.location.hostname;
        if (!domain) {
            alert('无法获取当前网站域名');
            return;
        }

        // 创建SEO查询菜单
        const menuHtml = `
            <div id="seo-query-menu" style="position:fixed; z-index:2147483647; top:50%; left:50%; transform:translate(-50%,-50%); background-color:#fff; padding:15px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.2); width:300px;">
                <h3 style="margin-top:0; text-align:center;">SEO查询工具</h3>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <button class="seo-btn" data-url="https://ahrefs.com/site-explorer/overview/v2/subdomains/live?target=${domain}">Ahrefs</button>
                    <button class="seo-btn" data-url="https://www.semrush.com/analytics/overview/?q=${domain}&searchType=domain">SEMrush</button>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <button class="seo-btn" data-url="https://web.archive.org/web/*/${window.location.href}">网页时光机</button>
                    <button class="seo-btn" data-url="https://search.google.com/search-console?resource_id=${window.location.origin}">Search Console</button>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <button class="seo-btn" data-url="https://www.alexa.com/siteinfo/${domain}">Alexa</button>
                    <button class="seo-btn" data-url="https://www.similarweb.com/website/${domain}">SimilarWeb</button>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <button class="seo-btn" data-url="https://moz.com/domain-analysis?site=${domain}">Moz</button>
                    <button class="seo-btn" data-url="https://gtmetrix.com/?url=${window.location.href}">GTmetrix</button>
                </div>
                <button id="close-seo-menu" style="width:100%; padding:8px; margin-top:10px;">关闭</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', menuHtml);

        // 添加按钮样式
        const style = document.createElement('style');
        style.textContent = `
            .seo-btn {
                padding: 8px 12px;
                border: 1px solid #ddd;
                background-color: #f8f9fa;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                width: 48%;
            }
            .seo-btn:hover {
                background-color: #e9ecef;
            }
        `;
        document.head.appendChild(style);

        // 添加事件监听器
        document.querySelectorAll('.seo-btn').forEach(btn => {
            btn.onclick = () => {
                window.open(btn.dataset.url, '_blank');
            };
        });

        document.getElementById('close-seo-menu').onclick = () => {
            document.getElementById('seo-query-menu').remove();
            style.remove();
        };
    }

    /**
     * 创建浮动菜单
     */
    function createFloatingMenu() {
        // 检查是否已存在菜单
        if (document.getElementById('float-menu')) {
            return;
        }

        // 创建浮动按钮
        const floatButton = document.createElement('div');
        floatButton.id = 'float-button';
        floatButton.className = 'float-button';
        floatButton.innerHTML = '🛠️';
        floatButton.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            width: 50px;
            height: 50px;
            background-color: #3B7CF1;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 2147483646;
            font-size: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            user-select: none;
        `;

        // 创建菜单容器
        const floatMenu = document.createElement('div');
        floatMenu.id = 'float-menu';
        floatMenu.style.cssText = `
            position: fixed;
            top: 50%;
            right: 80px;
            transform: translateY(-50%);
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 2147483647;
            display: none;
            min-width: 200px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        // 菜单项配置 - 按功能分类
        const menuCategories = [
            {
                title: '📄 内容处理',
                items: [
                    { text: '🤖 智能总结', action: smartSummary },
                    { text: '📋 复制Markdown', action: () => handleLinkAndHtml('markdown') },
                    { text: '💾 保存HTML', action: () => handleLinkAndHtml('save-html') }
                ]
            },
            {
                title: '🖼️ 网页图片处理',
                items: [
                    { text: '查看所有图片', action: () => viewImages('all') },
                    { text: '查看高清图片', action: () => viewImages('hd') },
                    { text: '查看动态图片', action: () => viewImages('gif') },
                    { text: '移除所有图片', action: () => viewImages('remove') }
                ]
            },
            {
                title: '📖 网页阅读与编辑',
                items: [
                    { text: '🌙 黑夜模式', action: toggleNightMode },
                    { text: '🔓 解除限制', action: unlockWebpage },
                    { text: '✏️ 编辑当前页面', action: editCurrentPage },
                    { text: '📜 自动滚屏', action: autoScroll },
                    { text: '🔄 自动刷新', action: autoRefresh },
                    { text: '📖 阅读模式', action: readingMode },
                    { text: '📝 网页便签-MD编辑器', action: openMdEditor }
                ]
            },
            {
                title: '🔧 实用工具',
                items: [
                    { text: '🔍 SEO查询', action: seoQuery },
                    { text: '🔐 显示密码', action: showPasswords },
                    { text: '🌐 翻译页面', action: translatePage },
                    { text: '📱 生成二维码', action: generateQRCode },
                    { text: '🔍 站内搜索', action: multiEngineSiteSearch }
                ]
            }
        ];

        // 存储分类的展开状态
        const categoryStates = {};

        // 创建分类菜单
        menuCategories.forEach((category, categoryIndex) => {
            // 初始化分类状态
            categoryStates[categoryIndex] = { expanded: false, pinned: false };

            // 创建分类容器
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category-container';

            // 创建分类标题
            const categoryTitle = document.createElement('div');
            categoryTitle.textContent = category.title + ' ▼';
            categoryTitle.className = 'menu-category-title';
            categoryTitle.style.cssText = `
                padding: 8px 16px;
                background-color: #f8f9fa;
                font-weight: bold;
                font-size: 12px;
                color: #666;
                border-bottom: 1px solid #e9ecef;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                cursor: pointer;
                user-select: none;
                transition: background-color 0.2s ease;
            `;

            // 创建菜单项容器
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'category-items';
            itemsContainer.style.cssText = `
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
            `;

            // 创建该分类下的菜单项
            category.items.forEach((item, itemIndex) => {
                const menuItem = document.createElement('div');
                menuItem.className = 'float-menu-item';
                menuItem.textContent = item.text;
                menuItem.style.cssText = `
                    padding: 12px 16px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                    font-size: 14px;
                    color: #333;
                    transition: background-color 0.2s ease;
                    padding-left: 24px;
                `;

                menuItem.addEventListener('mouseenter', () => {
                    menuItem.style.backgroundColor = '#f8f9fa';
                });

                menuItem.addEventListener('mouseleave', () => {
                    menuItem.style.backgroundColor = 'transparent';
                });

                menuItem.addEventListener('click', () => {
                    item.action();
                    floatMenu.style.display = 'none';
                });

                itemsContainer.appendChild(menuItem);
            });

            // 展开/收缩函数
            const toggleCategory = (expand) => {
                const state = categoryStates[categoryIndex];
                if (expand && !state.expanded) {
                    itemsContainer.style.maxHeight = itemsContainer.scrollHeight + 'px';
                    categoryTitle.textContent = category.title + ' ▲';
                    state.expanded = true;
                } else if (!expand && state.expanded && !state.pinned) {
                    itemsContainer.style.maxHeight = '0';
                    categoryTitle.textContent = category.title + ' ▼';
                    state.expanded = false;
                }
            };

            // 鼠标悬停事件
            categoryContainer.addEventListener('mouseenter', () => {
                categoryTitle.style.backgroundColor = '#e9ecef';
                toggleCategory(true);
            });

            categoryContainer.addEventListener('mouseleave', () => {
                categoryTitle.style.backgroundColor = '#f8f9fa';
                toggleCategory(false);
            });

            // 点击固定展开
            categoryTitle.addEventListener('click', (e) => {
                e.stopPropagation();
                const state = categoryStates[categoryIndex];

                if (state.pinned) {
                    // 取消固定
                    state.pinned = false;
                    categoryTitle.style.fontWeight = 'bold';
                    toggleCategory(false);
                } else {
                    // 固定展开
                    state.pinned = true;
                    categoryTitle.style.fontWeight = '900';
                    toggleCategory(true);
                }
            });

            categoryContainer.appendChild(categoryTitle);
            categoryContainer.appendChild(itemsContainer);
            floatMenu.appendChild(categoryContainer);

            // 在分类之间添加分隔线（除了最后一个分类）
            if (categoryIndex < menuCategories.length - 1) {
                const separator = document.createElement('div');
                separator.style.cssText = `
                    height: 1px;
                    background-color: #e9ecef;
                    margin: 4px 0;
                `;
                floatMenu.appendChild(separator);
            }
        });

        // 移除最后一个菜单项的边框
        const lastItem = floatMenu.lastElementChild;
        if (lastItem) {
            lastItem.style.borderBottom = 'none';
        }

        // 添加到页面
        document.body.appendChild(floatButton);
        document.body.appendChild(floatMenu);

        // 浮动按钮点击事件
        floatButton.addEventListener('click', () => {
            const isVisible = floatMenu.style.display === 'block';
            floatMenu.style.display = isVisible ? 'none' : 'block';
        });

        // 点击其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!floatButton.contains(e.target) && !floatMenu.contains(e.target)) {
                floatMenu.style.display = 'none';
            }
        });

        // 拖拽功能
        let isDragging = false;
        let startX, startY, startTop, startRight;

        floatButton.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startTop = parseInt(floatButton.style.top) || window.innerHeight / 2;
            startRight = parseInt(floatButton.style.right) || 20;

            floatButton.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = startX - e.clientX;
            const deltaY = e.clientY - startY;

            let newTop = startTop + deltaY;
            let newRight = startRight + deltaX;

            // 边界检查
            newTop = Math.max(25, Math.min(window.innerHeight - 75, newTop));
            newRight = Math.max(20, Math.min(window.innerWidth - 70, newRight));

            floatButton.style.top = newTop + 'px';
            floatButton.style.right = newRight + 'px';

            // 同时移动菜单
            floatMenu.style.top = newTop + 'px';
            floatMenu.style.right = (newRight + 60) + 'px';
            floatMenu.style.transform = 'translateY(-50%)';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                floatButton.style.cursor = 'pointer';
            }
        });

        // 悬停效果
        floatButton.addEventListener('mouseenter', () => {
            if (!isDragging) {
                floatButton.style.transform = 'scale(1.1)';
                floatButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            }
        });

        floatButton.addEventListener('mouseleave', () => {
            if (!isDragging) {
                floatButton.style.transform = 'scale(1)';
                floatButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            }
        });
    }

    // 添加全局样式
    GM_addStyle(`
        #clipboard-alert {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .float-menu-item {
            color: #333 !important;
        }

        .float-menu-item:hover {
            background-color: #f8f9fa !important;
        }

        #float-menu::-webkit-scrollbar {
            width: 6px;
        }

        #float-menu::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }

        #float-menu::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        #float-menu::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    `);

    // 页面加载完成后创建浮动菜单
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingMenu);
    } else {
        createFloatingMenu();
    }

})();
