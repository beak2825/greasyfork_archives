// ==UserScript==
// @name         水源鲨鲨
// @namespace    http://tampermonkey.net/
// @version      0.72
// @description  try to take over the world!
// @author       You
// @match        https://shuiyuan.sjtu.edu.cn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528539/%E6%B0%B4%E6%BA%90%E9%B2%A8%E9%B2%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528539/%E6%B0%B4%E6%BA%90%E9%B2%A8%E9%B2%A8.meta.js
// ==/UserScript==
console.log("水源终结者已加载");

//邮箱信息去除
const EMAIL = true;
//卡片分享生成
const CARD = true;

(function () {
    "use strict"
    if (!EMAIL) return
    //remove email info
    const observer1 = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const emailElement = document.querySelector('.email');
                if (emailElement) {
                    emailElement.remove();
                    console.log('Email element removed');
                }
            }
        }
    });

    observer1.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();


(function () {
    "use strict"
    if (!CARD) return
    const IS_MOBILE_DEVICE = document.documentElement.classList.contains('mobile-device');
    const isNoTouchDevice = () => document.documentElement.classList.contains('discourse-no-touch');
    let currentThemeInfo = null;
    const getCurrentThemeInfo = () => {
        if (currentThemeInfo) {
            return currentThemeInfo;
        }
        currentThemeInfo = {};
        currentThemeInfo.themeId = parseInt(document.querySelector('meta[name="discourse_theme_id"]')?.content, 10);
        if (Number.isNaN(currentThemeInfo.themeId)) {
            currentThemeInfo.themeId = null;
            // eslint-disable-next-line no-console
            console.error('Unable to get themeId');
        }
        const dataDiscourseSetup = document.getElementById('data-discourse-setup');
        if (dataDiscourseSetup) {
            currentThemeInfo.colorSchemeId = parseInt(dataDiscourseSetup.getAttribute('data-user-color-scheme-id'), 10);
            if (Number.isNaN(currentThemeInfo.colorSchemeId)) {
                currentThemeInfo.colorSchemeId = null;
                // eslint-disable-next-line no-console
                console.error('Unable to get colorSchemeId');
            }
            currentThemeInfo.darkSchemeId = parseInt(dataDiscourseSetup.getAttribute('data-user-dark-scheme-id'), 10);
            if (Number.isNaN(currentThemeInfo.darkSchemeId)) {
                currentThemeInfo.darkSchemeId = null;
                // eslint-disable-next-line no-console
                console.error('Unable to get darkSchemeId');
            }
            currentThemeInfo.colorSchemeIsDark = dataDiscourseSetup.getAttribute('data-color-scheme-is-dark')?.toLowerCase() === 'true';
        } else {
            // eslint-disable-next-line no-console
            console.error('Missing #data-discourse-setup');
        }
        return currentThemeInfo;
    };
    const addShadowDOMStyle = (shadowRoot, css) => {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        shadowRoot.appendChild(style);
        return style;
    };
    function createDialog(titleText, fullnameText, usernameText, avatarSrc, contentText) {
        const IS_MOBILE_DEVICE = document.documentElement.classList.contains('mobile-device');

        // 创建外部 div
        const dialog = document.createElement('div');
        dialog.id = 'dialog';
        dialog.tabIndex = -1;
        dialog.classList.add('dialog-box');

        // 移动端适配样式
        if (IS_MOBILE_DEVICE) {
            // 移动端布局
            dialog.style.width = '95%'; // 改为百分比宽度
            dialog.style.maxWidth = '100%'; // 防止超出屏幕
            dialog.style.minHeight = 'auto'; // 取消固定高度
            dialog.style.padding = '15px'; // 缩小内边距
            dialog.style.borderRadius = '8px'; // 缩小圆角
        } else {
            // 桌面端保持原有样式
            dialog.style.width = '400px';
            dialog.style.minHeight = '200px';
            dialog.style.padding = '20px';
            dialog.style.borderRadius = '10px';
        }

        // 公共样式
        Object.assign(dialog.style, {
            pointerEvents: 'auto',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            color: 'black',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            zIndex: '9999',
            margin: '0',
            textAlign: 'left',
            boxSizing: 'border-box' // 新增重要属性
        });

        // 创建内部 div
        const innerDiv = document.createElement('div');
        innerDiv.style.pointerEvents = 'none';

        // 标题适配
        const title = document.createElement(IS_MOBILE_DEVICE ? 'h4' : 'h3'); // 移动端使用更小标题
        title.id = 'title_sk';
        title.textContent = titleText;
        if (IS_MOBILE_DEVICE) {
            title.style.fontSize = '1.1rem'; // 缩小字体
            title.style.marginBottom = '8px'; // 减小间距
        }

        // 头像适配
        const avatar = document.createElement('img');
        avatar.id = 'avatar_sk';
        avatar.src = avatarSrc;
        avatar.alt = 'Avatar';
        Object.assign(avatar.style, {
            width: IS_MOBILE_DEVICE ? '25px' : '30px', // 缩小头像
            height: IS_MOBILE_DEVICE ? '25px' : '30px',
            borderRadius: '50%',
            marginRight: '10px',
            verticalAlign: 'middle' // 改善对齐
        });

        // 用户信息容器
        const userInfoContainer = document.createElement('div');
        Object.assign(userInfoContainer.style, {
            display: 'flex',
            alignItems: 'center',
            marginBottom: IS_MOBILE_DEVICE ? '8px' : '12px' // 调整间距
        });

        // 用户名字体适配
        const fullname = document.createElement('span');
        fullname.id = 'fullname_sk';
        fullname.textContent = fullnameText;
        fullname.style.fontSize = IS_MOBILE_DEVICE ? '0.95rem' : '1rem';

        const username = document.createElement('span');
        username.id = 'username_sk';
        username.textContent = usernameText;
        Object.assign(username.style, {
            fontSize: IS_MOBILE_DEVICE ? '0.85rem' : '0.9rem', // 缩小字体
            color: 'grey',
            marginLeft: '6px'
        });

        // 内容区域适配
        const content = document.createElement('p');
        content.id = 'content_sk';
        content.appendChild(contentText);
        Object.assign(content.style, {
            textAlign: 'left',
            maxHeight: IS_MOBILE_DEVICE ? '50vh' : '60vh', // 降低高度占比
            overflow: 'auto', // 改为自动滚动
            fontSize: IS_MOBILE_DEVICE ? '0.9rem' : '1rem', // 内容字体适配
            lineHeight: '1.4' // 改善可读性
        });

        // 组装元素
        userInfoContainer.appendChild(avatar);
        userInfoContainer.appendChild(fullname);
        userInfoContainer.appendChild(username);

        innerDiv.appendChild(title);
        innerDiv.appendChild(userInfoContainer);
        innerDiv.appendChild(content);

        dialog.appendChild(innerDiv);

        // 移动端增加触摸控制
        if (IS_MOBILE_DEVICE) {
            let startY = 0;
            dialog.addEventListener('touchstart', e => {
                startY = e.touches[0].clientY;
            }, { passive: true });

            dialog.addEventListener('touchmove', e => {
                const deltaY = e.touches[0].clientY - startY;
                if (deltaY > 10) {
                    dialog.scrollTop -= deltaY;
                }
            }, { passive: true });
        }

        return dialog;
    }


    // 页面加载完成后，检查现有的 .topic-post 元素
    document.querySelectorAll('.topic-post').forEach((post) => {
        addShareButton(post);
        post.classList.add('share-button-added')

    });


    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    async function copyCard_1(dialogElement) {
        try {
            const url = dialogElement.dataset.url;

            const dataUrl = await htmlToImage.toPng(dialogElement, {
                style: { position: 'static', transform: "none" }
            });

            const htmlContent = `
            <div style="text-align: center;">
                <img src="${dataUrl}" style="max-width: 600px; height: auto; margin-bottom: 10px;"/>
                <br/>
                <a href="${url}" style="color: #007bff; text-decoration: underline;">📎 原文链接</a>
            </div>
        `;

            const imgBlob = dataURItoBlob(dataUrl);
            const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
            const textBlob = new Blob([url], { type: 'text/plain' });

            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': imgBlob,
                    'text/html': htmlBlob,
                    'text/plain': textBlob
                })
            ]);

            console.log("复制成功");
            showFeedback("内容已复制！", "green");
        } catch (error) {
            console.error('复制失败:', error);
            // 降级处理：仅复制链接
            const tempInput = document.createElement('input');
            tempInput.value = url;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            tempInput.remove();
            showFeedback("链接已复制", "blue");
        }
    }

    function copyCard() {
        console.log("clicked")
        htmlToImage.toPng(document.getElementById('dialog'), {
            style: {
                position: 'static',
                transform: "none",
            }
        })
            .then(function (dataUrl) {
                var imgBlob = dataURItoBlob(dataUrl);
                var item = new ClipboardItem({ "image/png": imgBlob });
                navigator.clipboard.write([item]);
                showFeedback("卡片已复制！", "green");
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
                showFeedback("复制失败！", "red");
            });

    }

    function showFeedback(message, color) {
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px;
            background: ${color};
            color: white;
            border-radius: 4px;
            z-index: 99999;
    `;
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }


    async function saveImageToLocal(dialogElement) {
    // 检测移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    try {
        // 显示加载状态
        showFeedback("正在生成图片...", "blue");

        // 生成图片
        const dataUrl = await htmlToImage.toPng(dialogElement, {
            style: {
                position: 'static',
                transform: "none",
                width: '100%'
            },
            quality: 0.92,
            pixelRatio: Math.min(window.devicePixelRatio, 2)
        });

        // 移动设备使用新窗口显示图片方式
        if (isMobile) {
            // 创建并打开新窗口
            const imgWindow = window.open('', '_blank');
            if (!imgWindow) {
                throw new Error("无法打开新窗口，请检查浏览器设置");
            }

            // 写入HTML内容
            imgWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>保存图片</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background: #f8f8f8;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            font-family: system-ui, -apple-system, sans-serif;
                        }
                        .container {
                            max-width: 100%;
                            padding: 10px;
                            text-align: center;
                        }
                        img {
                            max-width: 100%;
                            height: auto;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        .instructions {
                            margin-top: 15px;
                            padding: 12px;
                            background: #fff;
                            border-radius: 8px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                            color: #333;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <img src="${dataUrl}" alt="保存图片">
                        <div class="instructions">
                            ${isIOS
                                ? '👆 长按图片，选择"添加到照片"保存'
                                : '👆 长按图片，选择"保存图片"或"下载图片"'}
                        </div>
                    </div>
                </body>
                </html>
            `);
            imgWindow.document.close();

            // 更新反馈信息
            showFeedback("请在新窗口中保存图片", "green");

        } else {
            // 桌面端使用传统下载方式
            // 转换为Blob对象（减少内存占用）
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            // 创建下载链接
            const filename = `post_${Date.now()}.png`;
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);

            // 触发下载
            link.click();

            // 清理资源
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
                document.body.removeChild(link);
            }, 5000);

            showFeedback(`图片已保存为 ${filename}`, "green");
        }

    } catch (error) {
        console.error('保存失败:', error);
        showFeedback(error.message || "保存失败，请重试", "red");
    }
}

    // 对内容的背景色、边框链接等处理
    function processContent(element) {
        // 重置引用形式
        function processBackgroundColor(element, light = 255) {
            const darkenFactor = 0.9; // 每层加深倍率
            if (Array.from(element.children).some(child => child.tagName.toLowerCase() === 'blockquote' && child.hasAttribute('id'))) {
                light = Math.floor(light * darkenFactor);
                element.style.borderLeft = '4px solid rgb(84, 84, 84)';
                Array.from(element.children).forEach(element => {
                    element.style.borderLeft = '0px solid rgb(84, 84, 84)';
                });
                if (element.firstElementChild && element.firstElementChild.children.length > 1) {
                    element.firstElementChild.children[1].style.borderRadius = '50%';
                }
            }
            else if (element.tagName.toLowerCase() === 'blockquote' && !element.hasAttribute('id')) {
                light = Math.floor(light * darkenFactor);
                element.style.borderLeft = '4px solid rgb(84, 84, 84)';
            }
            element.style.backgroundColor = `rgb(${light}, ${light}, ${light})`;
            Array.from(element.children).forEach(child => processBackgroundColor(child, light));
        }
        // 重置文本格式
        function setTextColor(element) {
            if (element.tagName === 'A') {
                element.style.color = '#0f82af';
            } else {
                element.style.color = 'black';
            }
            element.querySelectorAll('[data-clicks]').forEach(element => {
                element.removeAttribute('data-clicks');
            });
            Array.from(element.children).forEach(child => setTextColor(child));
        }
        // 重置onebox边框
        function setAsideBorder(element) {
            element.querySelectorAll('aside.onebox').forEach(element => {
                element.style.border = '4px solid darkgray'; // 将边框颜色设置为深灰色，并设置边框宽度
            });
        }
        Array.from(element.children).forEach(child => processBackgroundColor(child));
        setTextColor(element);
        setAsideBorder(element);
    }


    //传入topic-post
    function addShareButton(element) {
        if (element.querySelector('#share-button')) {
            return;
        }
        const actions = element.querySelector(".actions");

        if (!actions.shadowRoot) {
            actions.attachShadow({ mode: 'open' });
        }
        addShadowDOMStyle(actions.shadowRoot, `
                .shuiyuan-killer-share-button {
                    margin-left: var(--control-margin);
                    flex: 0 1 auto;
                    font-size: var(--font-up-1);
                    padding: 8px 10px;
                    vertical-align: top;
                    background: transparent;
                    border: none;
                    color: var(--primary-low-mid-or-secondary-high);
                    cursor: pointer;
                    -webkit-appearance: button;
                    overflow: visible;
                    line-height: var(--line-height-small);
                    transition: color 0.25s, background 0.25s;
                }
                .shuiyuan-killer-share-button:active,
                .shuiyuan-killer-share-button:focus {
                    outline: none;
                    background: var(--primary-low);
                    color: var(--primary);
                }
                .shuiyuan-killer-share-button.pending {
                    cursor: wait;
                }
                .shuiyuan-killer-share-button > svg {
                    opacity: 1;
                    color: var(--primary-low-mid);
                    height: 1em;
                    width: 1em;
                    line-height: 1;
                    display: inline-flex;
                    position: relative;
                    vertical-align: -0.125em;
                    fill: currentColor;
                    flex-shrink: 0;
                    overflow: visible;
                }
                .shuiyuan-killer-share-button:focus > svg {
                    color: var(--primary);
                }
            `);
        if (!IS_MOBILE_DEVICE) {
            addShadowDOMStyle(actions.shadowRoot, `
                    .shuiyuan-killer-share-button:hover {
                        outline: none;
                        background: var(--primary-low);
                        color: var(--primary);
                    }
                    .shuiyuan-killer-share-button:hover > svg {
                        color: var(--primary);
                    }
                `);
        }
        switch (getCurrentThemeInfo().themeId) {
            case 31: // graceful
                addShadowDOMStyle(actions.shadowRoot, `
                        .shuiyuan-killer-share-button.btn-flat {
                            border-radius: 4px;
                        }
                    `);
                break;
            case 43: // Isabelle
                addShadowDOMStyle(actions.shadowRoot, `
                        .shuiyuan-killer-share-button.btn-flat {
                            color: #68c6b9;
                            border-radius: 20px;
                            transition: top 0.25s, background-color 0.3s;
                        }
                        .shuiyuan-killer-share-button.btn-flat > svg {
                            color: #68c6b9;
                        }
                    `);
                if (isNoTouchDevice()) {
                    addShadowDOMStyle(actions.shadowRoot, `
                            .shuiyuan-killer-share-button.btn-flat:hover {
                                background: #015562;
                                box-shadow: 0 4px 0 0 #00333d;
                                position: relative;
                                top: -3px;
                                color: #faf7e9;
                            }
                            .shuiyuan-killer-share-button.btn-flat:hover > svg {
                                color: #faf7e9;
                            }
                        `);
                }
                break;
        }
        let button = document.createElement('button');
        button.classList.add('widget-button', 'btn-flat', 'shuiyuan-killer-share-button', 'no-text', 'btn-icon');
        button.id = "share-button"
        button.title = "将帖子分享为图片"
        // button.className = "share-button"

        const SHARE_ICON = '<svg class="d-icon svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6l96 0 32 0 208 0c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"></svg>';

        button.innerHTML = SHARE_ICON;

        actions.shadowRoot.insertBefore(button, actions.shadowRoot.firstElementChild)
        actions.shadowRoot.appendChild(document.createElement('slot'));

        // 对话框
        button.addEventListener('click', function () {
            const title = document.body.querySelector(".topic-link")?.querySelector('span').innerText || document.body.querySelector(".fancy-title").innerText || "";
            const url = "https://shuiyuan.sjtu.edu.cn" + element.querySelector(".widget-link").getAttribute("href").split("?")[0]
            const content = element.querySelector(".cooked").cloneNode(true);
            const avatar = element.querySelector(".trigger-user-card.main-avatar").firstChild.getAttribute('src');
            const fullname = element.querySelector(".topic-meta-data").querySelector(".names").querySelector(".first")?.firstChild.textContent || '';
            const username = element.querySelector(".topic-meta-data").querySelector(".names").querySelector(".second.username")?.firstChild.textContent || '';
            const dialog = createDialog(title, fullname, username, avatar, content)
            processContent(content);

            // 添加对话框关闭按钮（移动端需要）
            if (IS_MOBILE_DEVICE) {
                const closeBtn = document.createElement('div');
                closeBtn.innerHTML = '×';
                Object.assign(closeBtn.style, {
                    position: 'absolute',
                    top: '10px',
                    right: '15px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#666'
                });
                closeBtn.onclick = () => dialog.remove();
                dialog.appendChild(closeBtn);
            }

            document.body.appendChild(dialog);
            if (IS_MOBILE_DEVICE) {
                // 移动端：点击直接保存
                saveImageToLocal(dialog);

                // 移除桌面端的blur事件监听
            } else {
                // 桌面端保留原有逻辑
                copyCard(dialog);
                dialog.addEventListener('blur', () => dialog.remove());
                dialog.focus();
            }

            // element.appendChild(dialog)
            // new QRCode(document.getElementById("qrcode"), {
            //     text: url,  // 要嵌入的链接
            //     width: 80,
            //     height: 80
            // });
            // 监听对话框失去焦点事件
            dialog.addEventListener('blur', () => {
                document.body.removeChild(dialog);
            });

            // 设置对话框获得焦点
            dialog.focus();


        });

    }


    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches('.topic-post') && !node.matches('.share-button-added')) {
                        // console.log("node is", node.cloneNode(true))
                        addShareButton(node);
                        node.classList.add('share-button-added')
                    }
                    else if (node.querySelectorAll) {
                        node.querySelectorAll(".topic-post").forEach((elem) => {
                            addShareButton(elem)
                        })
                    }
                    // else if (node.nodeType === Node.ELEMENT_NODE && node.matches('.post-stream')) {
                    //     if (!node.querySelector(".actions")) {
                    //         console.log("no actions!")
                    //     }
                    //     node.childNodes.forEach((post) => {
                    //         addShareButton(post)
                    //     })
                    // }
                });
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

})();


