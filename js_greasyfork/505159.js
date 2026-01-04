// ==UserScript==
// @name         自定义透明提示框
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  创建一个自定义透明提示框，并支持显示位置、自动关闭时间、透明度、是否显示关闭按钮、背景颜色和文字颜色
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==



    /**
     * 显示自定义的提示框
     * @param {Object|string} options - 配置对象或提示消息字符串
     * @param {string} options.message - 提示框中的内容
     * @param {string} [options.type='info'] - 提示框的类型，可以是 'success'（成功）, 'error'（错误）, 'warning'（警告）, 'info'（信息），或自定义 {backgroundColor: '#color', textColor: '#color'}
     * @param {string} [options.position='center-top'] - 提示框的位置，可以是 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'center-top', 'center-bottom', 'center'
     * @param {number} [options.opacity=0.8] - 提示框的透明度，范围是 0（完全透明）到 1（完全不透明）
     * @param {boolean|number} [options.autoClose=3] - 自动关闭提示框的时间（秒）。如果设置为 `false`，则不自动关闭，并强制显示关闭按钮
     * @param {boolean} [options.hasCloseButton] - 是否显示关闭按钮，当 autoClose 为 false 时，强制设置为 true
     */
    function show_message(options) {
        // 如果传递的是字符串，将其转为对象并使用默认配置
        if (typeof options === 'string') {
            options = {
                message: options,
                type: 'info',
                position: 'center-top',
                opacity: 0.7,
                autoClose: 3
            };
        }

        const {
            message,
            type = 'info',
            position = 'center-top',
            opacity = 0.8,
            autoClose = 3,
        } = options;

        const predefinedTypes = {
            success: { backgroundColor: '#e0f7da', textColor: '#67C23A' },
            error: { backgroundColor: '#fddede', textColor: '#f56c6c' },
            warning: { backgroundColor: '#fde3cf', textColor: '#e6a23c' },
            info: { backgroundColor: '#d3d4d6', textColor: '#404040' }, // 字体颜色加深
        };

        let backgroundColor, textColor;
        if (typeof type === 'string') {
            ({ backgroundColor, textColor } = predefinedTypes[type] || predefinedTypes['info']);
        } else if (typeof type === 'object') {
            ({ backgroundColor, textColor } = type);
        }

        // 当 autoClose 为 false 时，强制显示关闭按钮
        const hasCloseButton = autoClose === false || options.hasCloseButton;

        // 生成唯一的类名
        const uniqueClass = `custom-notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // 创建提示框的 HTML
        const notification = document.createElement('div');
        notification.className = uniqueClass;
        notification.innerHTML = `
            <div class="custom-notification-content">
                <p>${message}</p>
                ${hasCloseButton ? '<button id="closeNotification">✖</button>' : ''}
            </div>
        `;
        document.body.appendChild(notification);

        // 设置提示框的样式
        const style = document.createElement('style');
        style.textContent = `
            .${uniqueClass} {
                position: fixed;
                background-color: ${backgroundColor};
                color: ${textColor};
                padding: 15px;
                border-radius: 8px;
                display: none;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                transition: opacity 0.5s ease, transform 0.5s ease;
                max-width: 300px;
                overflow: hidden;
                opacity: ${opacity};
                font-size: 14px;
            }
            
            .${uniqueClass} .custom-notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                word-wrap: break-word;
            }
            
            .${uniqueClass} button {
                background: none;
                color: #a0a0a0;
                border: none;
                padding: 0;
                margin-left: 10px;
                font-size: 16px;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            
            .${uniqueClass} button:hover {
                color: #404040;
            }
        `;
        document.head.appendChild(style);

        // 根据位置设置提示框的位置
        function setPosition() {
            const positions = {
                'top-right': { top: '20px', right: '20px', bottom: '', left: '' },
                'top-left': { top: '20px', left: '20px', bottom: '', right: '' },
                'bottom-right': { bottom: '20px', right: '20px', top: '', left: '' },
                'bottom-left': { bottom: '20px', left: '20px', top: '', right: '' },
                'center-top': { top: '20px', left: '50%', transform: 'translateX(-50%)', bottom: '', right: '' },
                'center-bottom': { bottom: '20px', left: '50%', transform: 'translateX(-50%)', top: '', right: '' },
                'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bottom: '', right: '' }
            };

            const pos = positions[position] || positions['center-top'];
            Object.assign(notification.style, pos);
        }

        setPosition();

        // 显示提示框
        notification.style.display = 'block';
        notification.style.opacity = opacity;

        // 关闭提示框的函数
        function closeNotification() {
            notification.style.opacity = '0';
            notification.style.transform += ' translateY(20px)';
            setTimeout(() => {
                notification.style.display = 'none';
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }, 500);
        }

        // 如果有关闭按钮，为其添加事件监听
        if (hasCloseButton) {
            const closeNotificationButton = document.getElementById('closeNotification');
            closeNotificationButton.addEventListener('click', closeNotification);
        }

        // 判断是否需要自动关闭
        if (typeof autoClose === 'number') {
            setTimeout(closeNotification, autoClose * 1000);
        }
    }

    // 示例调用

    // 使用所有参数的调用方式
    // show_message({
    //     message: '这是一个完全配置的提示框',  // 提示框的内容
    //     type: 'success',                    // 成功类型提示框
    //     position: 'center',                 // 屏幕正中显示
    //     opacity: 0.9,                       // 透明度为 0.9
    //     autoClose: false,                   // 不自动关闭
    // });

    // 自定义显示颜色
    // show_message({
    //     message: "这是一个自定义样式的提示框",
    //     type: {
    //         backgroundColor: '#f0e68c', // 浅黄色背景
    //         textColor: '#8b4513'        // 深棕色文字
    //     },
    //     position: 'bottom-left',       // 在屏幕左下角显示
    //     opacity: 0.8,                  // 透明度为0.9
    //     autoClose: 7                   // 7秒后自动关闭
    // });

    // 使用简单的字符串调用方式（默认配置）
    // show_message("已成功加载信息提示框功能");
    console.log("已成功加载信息提示框功能");

