// ==UserScript==
// @name         获取抖音Sessionid
// @description  Ck工具
// @version      1.1
// @license      MIT
// @author       qiquhao
// @require      https://update.greasyfork.org/scripts/446666/1389793/jQuery%20Core%20minified.js
// @resource     https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @grant        GM_addStyle
// @grant        GM_cookie
// @grant        GM_setClipboard
// @match        *://*.iesdouyin.com/*
// @match        *://*.douyin.com/*
// @namespace https://greasyfork.org/users/1418321
// @downloadURL https://update.greasyfork.org/scripts/522506/%E8%8E%B7%E5%8F%96%E6%8A%96%E9%9F%B3Sessionid.user.js
// @updateURL https://update.greasyfork.org/scripts/522506/%E8%8E%B7%E5%8F%96%E6%8A%96%E9%9F%B3Sessionid.meta.js
// ==/UserScript==
(async () => {
    // 添加样式
    GM_addStyle(`
        #btns-cpck {
            position: fixed;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            z-index: 9999;
        }
        #CP_CK {
            border-radius: 5px;
            background-color: rgba(0, 0, 0, 0.7); /* 黑色磨砂半透明 */
            color: #FE2C55; /* 按钮字体颜色 */
            padding: 8px 12px;
            font-size: calc(1vw + 0.5rem); /* 自适应字体大小 */
            border: none;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
        }
        .modal {
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translate(-50%, 0);
            background-color: #fff;
            color: #333;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-size: calc(1vw + 0.5rem); /* 自适应字体大小 */
            width: 90%;
            max-width: 400px;
            text-align: center;
        }
        .modal input {
            width: 100%;
            margin: 10px 0;
            padding: 8px;
            font-size: calc(1vw + 0.5rem);
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .modal button {
            margin: 10px 5px;
            padding: 8px 12px;
            font-size: calc(0.9vw + 0.5rem); /* 自适应字体大小 */
            border: none;
            background-color: #FE2C55;
            color: white;
            cursor: pointer;
            border-radius: 5px;
        }
        .toast {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #FF4D4D;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 1rem;
            z-index: 10001;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            animation: fadeOut 5s forwards;
        }
        @keyframes fadeOut {
            0% { opacity: 1; }
            80% { opacity: 0.5; }
            100% { opacity: 0; display: none; }
        }
    `);

    // 添加按钮到页面
    const btnContainer = document.createElement('div');
    btnContainer.id = 'btns-cpck';
    btnContainer.innerHTML = `
        <button id="CP_CK">获取Sessionid</button>
    `;
    document.body.appendChild(btnContainer);

    // 按钮点击事件
    document.getElementById('CP_CK').addEventListener('click', async () => {
        try {
            GM_cookie('list', {}, (response) => {
                if (!response || !Array.isArray(response)) {
                    showToast('无法获取Cookie，请检查浏览器或权限设置。');
                    return;
                }

                const sessionCookie = response.find(item => item.name === 'sessionid');
                const sessionId = sessionCookie ? sessionCookie.value : null;

                if (sessionId) {
                    showModal('获取成功', sessionId);
                } else {
                    showToast('未找到Sessionid，请检查是否已登录。');
                }
            });
        } catch (error) {
            showToast(`发生错误：${error.message}`);
        }
    });

    // 显示详细弹窗
    function showModal(title, sessionId) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <h3>${title}</h3>
            <input type="text" id="sessionInput" value="${sessionId}" readonly>
            <div>
                <button id="copyBtn">复制</button>
                <button id="closeBtn">关闭</button>
            </div>
        `;
        document.body.appendChild(modal);

        // 关闭按钮事件
        modal.querySelector('#closeBtn').addEventListener('click', () => closeModal(modal));

        // 复制按钮事件
        modal.querySelector('#copyBtn').addEventListener('click', () => {
            const input = document.getElementById('sessionInput');
            input.select();
            document.execCommand('copy');
            alert('Sessionid 已复制到剪切板！');
        });
    }

    // 关闭弹窗
    function closeModal(modal) {
        modal.remove();
    }

    // 显示红色警告弹窗
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000); // 5秒后自动关闭
    }
})();
