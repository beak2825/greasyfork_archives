// ==UserScript==
// @name         Steam展柜自定义快速工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  快速作品编辑工具
// @author       Your name
// @match        https://steamcommunity.com/id/*/
// @match        https://steamcommunity.com/sharedfiles/edititem/767/3/
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_notification
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/542479/Steam%E5%B1%95%E6%9F%9C%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E9%80%9F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542479/Steam%E5%B1%95%E6%9F%9C%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E9%80%9F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式 - Steam官方风格
    const css = `
        .custom-steam-tool-btn {
            background: linear-gradient(135deg, #67c1f5 0%, #417a9b 100%);
            color: #ffffff;
            border: 1px solid #1999d3;
            border-radius: 3px;
            padding: 8px 16px;
            font-weight: normal;
            cursor: pointer;
            font-family: "Motiva Sans", Arial, sans-serif;
            font-size: 13px;
            text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.3);
            box-shadow: 0 0 2px rgba(103, 193, 245, 0.3);
            transition: all 0.2s ease;
            position: relative;
            z-index: 9999;
            margin-left: 10px;
        }

        .custom-steam-tool-btn:hover {
            background: linear-gradient(135deg, #78c9f7 0%, #4a8bb5 100%);
            box-shadow: 0 0 5px rgba(103, 193, 245, 0.5);
            transform: translateY(-1px);
        }

        .custom-steam-tool-btn:active {
            background: linear-gradient(135deg, #417a9b 0%, #67c1f5 100%);
            transform: translateY(0);
        }

        .custom-dropdown {
            position: fixed;
            background: linear-gradient(135deg, #1e2328 0%, #2a475e 100%);
            border: 1px solid #67c1f5;
            border-radius: 5px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 10px rgba(103, 193, 245, 0.3);
            min-width: 300px;
            z-index: 10000;
            display: none;
            overflow: hidden;
            font-family: "Motiva Sans", Arial, sans-serif;
            backdrop-filter: blur(10px);
            transform: scaleY(0);
            transform-origin: top;
            transition: all 0.3s ease-out;
        }

        .custom-dropdown.show {
            transform: scaleY(1);
        }

        .custom-dropdown a {
            display: block;
            padding: 12px 16px;
            color: #c6d4df;
            text-decoration: none;
            border-bottom: 1px solid rgba(42, 71, 94, 0.5);
            transition: all 0.2s ease;
            font-size: 13px;
            position: relative;
        }

        .custom-dropdown a:hover {
            background: linear-gradient(90deg, rgba(103, 193, 245, 0.2) 0%, rgba(103, 193, 245, 0.1) 100%);
            color: #67c1f5;
            padding-left: 20px;
        }

        .custom-dropdown a:last-child {
            border-bottom: none;
        }

        .custom-dropdown a::before {
            content: "▶";
            margin-right: 10px;
            color: #67c1f5;
            font-size: 10px;
            opacity: 0;
            transition: all 0.2s ease;
        }

        .custom-dropdown a:hover::before {
            opacity: 1;
        }

        .code-notification {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: linear-gradient(135deg, rgba(30, 35, 40, 0.95) 0%, rgba(42, 71, 94, 0.95) 100%);
            border: 1px solid #67c1f5;
            border-radius: 5px;
            padding: 16px 20px;
            color: #c6d4df;
            font-size: 13px;
            z-index: 100000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 10px rgba(103, 193, 245, 0.3);
            max-width: 400px;
            font-family: "Motiva Sans", Arial, sans-serif;
            animation: slideIn 0.3s ease-out;
            backdrop-filter: blur(10px);
        }

        .code-notification strong {
            color: #67c1f5;
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: normal;
        }

        .code-notification p {
            margin: 6px 0;
            line-height: 1.5;
        }

        .code-notification .hotkey {
            background: rgba(103, 193, 245, 0.3);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
            font-size: 12px;
            border: 1px solid rgba(103, 193, 245, 0.5);
        }

        .code-tip {
            padding: 12px 16px;
            color: #a9cf46;
            font-size: 12px;
            line-height: 1.5;
            border-top: 1px solid rgba(42, 71, 94, 0.5);
            background: rgba(42, 71, 94, 0.3);
        }

        .bottom-btn-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        .top-right-btn-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .dropdown-top-right {
            transform-origin: top right;
        }

        @keyframes slideIn {
            from {
                transform: translateY(20px) scale(0.95);
                opacity: 0;
            }
            to {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }

        .plugin-check-info {
            position: fixed;
            top: 60px;
            right: 20px;
            background: linear-gradient(135deg, rgba(30, 35, 40, 0.9) 0%, rgba(42, 71, 94, 0.9) 100%);
            border: 1px solid #67c1f5;
            border-radius: 5px;
            padding: 12px 16px;
            color: #c6d4df;
            font-size: 12px;
            z-index: 9998;
            max-width: 300px;
            font-family: "Motiva Sans", Arial, sans-serif;
            backdrop-filter: blur(10px);
            animation: slideIn 0.3s ease-out;
        }

        .plugin-check-info .status-ok {
            color: #a9cf46;
        }

        .plugin-check-info .status-warning {
            color: #ffa500;
        }

        .plugin-check-info .status-error {
            color: #ff6b6b;
        }
    `;
    $('<style>').html(css).appendTo('head');

    // 插件冲突检查功能
    function checkPluginConflicts() {
        const conflicts = [];
        const warnings = [];

        // 检查常见的Steam插件元素
        const steamPluginSelectors = [
            '.custom-steam-tool-btn',
            '[id*="steam"]',
            '[class*="steam"]',
            '[id*="enhance"]',
            '[class*="enhance"]'
        ];

        steamPluginSelectors.forEach(selector => {
            const elements = $(selector);
            if (elements.length > 1 && selector === '.custom-steam-tool-btn') {
                conflicts.push('检测到多个Steam工具按钮');
            }
        });

        // 检查固定定位元素
        const fixedElements = $('*').filter(function() {
            return $(this).css('position') === 'fixed' &&
                   $(this).css('z-index') > 9000 &&
                   !$(this).hasClass('custom-steam-tool-btn') &&
                   !$(this).hasClass('custom-dropdown');
        });

        if (fixedElements.length > 3) {
            warnings.push('检测到多个固定定位元素，可能存在UI冲突');
        }

        return { conflicts, warnings };
    }

    // 显示插件检查结果
    function showPluginCheckResult(result) {
        if (result.conflicts.length === 0 && result.warnings.length === 0) {
            return;
        }

        let content = '<div class="plugin-check-info">';
        content += '<strong>插件兼容性检查</strong><br>';

        if (result.conflicts.length > 0) {
            content += '<div class="status-error">冲突:</div>';
            result.conflicts.forEach(conflict => {
                content += `<div>• ${conflict}</div>`;
            });
        }

        if (result.warnings.length > 0) {
            content += '<div class="status-warning">警告:</div>';
            result.warnings.forEach(warning => {
                content += `<div>• ${warning}</div>`;
            });
        }

        content += '</div>';

        const checkInfo = $(content);
        $('body').append(checkInfo);

        // 5秒后自动关闭
        setTimeout(() => {
            checkInfo.fadeOut(500, () => checkInfo.remove());
        }, 5000);
    }

    // 个人主页功能 - 仅在个人资料主页生效
    if (window.location.href.match(/https:\/\/steamcommunity\.com\/id\/[^\/]+\/?$/)) {
        // 执行插件冲突检查
        setTimeout(() => {
            const checkResult = checkPluginConflicts();
            showPluginCheckResult(checkResult);
        }, 1000);

        // 创建按钮和下拉菜单
        const profileBtn = $(`
            <button class="custom-steam-tool-btn" id="steam-custom-btn">
                <i class="fa fa-magic" style="margin-right: 5px;"></i> 展柜工具
            </button>
        `);

        const dropdown = $(`
            <div class="custom-dropdown" id="steam-custom-dropdown">
                <a href="#" class="dropdown-item" data-count="1">打开1个艺术作品编辑界面</a>
                <a href="#" class="dropdown-item" data-count="3">打开3个艺术作品编辑界面</a>
                <a href="#" class="dropdown-item" data-count="5">打开5个艺术作品编辑界面</a>
                <a href="#" class="dropdown-item" data-count="9">打开9个艺术作品编辑界面</a>
            </div>
        `);

        // 添加到页面 - 优先使用页面原有位置，否则使用固定位置
        const headerActions = $('.profile_header_actions');
        if (headerActions.length) {
            const container = $('<div style="position: relative; display: inline-block;">')
                .append(profileBtn);
            headerActions.append(container);
        } else {
            $('body').append(profileBtn);
            profileBtn.css({
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: '9999'
            });
        }

        // 将下拉菜单添加到body
        $('body').append(dropdown);

        // 按钮点击事件 - 带边缘检测和渐变动画
        profileBtn.on('click', function(e) {
            e.stopPropagation();

            // 获取按钮位置
            const btnRect = this.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // 计算下拉菜单位置
            let top = btnRect.bottom + 10;
            let left = btnRect.left;

            // 检测底部边缘
            if (top + 250 > windowHeight) {
                top = btnRect.top - 255;
                dropdown.addClass('dropdown-top-right');
            } else {
                dropdown.removeClass('dropdown-top-right');
            }

            // 检测右侧边缘
            if (left + 300 > windowWidth) {
                left = windowWidth - 310;
            }

            // 应用位置并显示
            dropdown.css({
                top: top + 'px',
                left: left + 'px',
                display: 'block'
            });

            // 触发渐变动画
            setTimeout(() => {
                dropdown.addClass('show');
            }, 10);
        });

        // 下拉菜单项点击事件
        dropdown.on('click', '.dropdown-item', function(e) {
            e.preventDefault();
            const count = parseInt($(this).data('count'));
            for (let i = 0; i < count; i++) {
                GM_openInTab('https://steamcommunity.com/sharedfiles/edititem/767/3/', {active: false});
            }
            hideDropdown();
        });

        // 隐藏下拉菜单函数
        function hideDropdown() {
            dropdown.removeClass('show');
            setTimeout(() => {
                dropdown.hide();
            }, 300);
        }

        // 点击页面其他地方关闭下拉菜单
        $(document).on('click', function() {
            hideDropdown();
        });
    }

    // 展柜编辑页面功能 - 仅在特定URL生效
    if (window.location.href === 'https://steamcommunity.com/sharedfiles/edititem/767/3/') {
        // 执行插件冲突检查
        setTimeout(() => {
            const checkResult = checkPluginConflicts();
            showPluginCheckResult(checkResult);
        }, 1000);

        // 创建按钮和下拉菜单
        const editorBtn = $(`
            <button class="custom-steam-tool-btn" id="steam-code-btn">
                <i class="fa fa-code" style="margin-right: 5px;"></i> 快速代码
            </button>
        `);

        const codeDropdown = $(`
            <div class="custom-dropdown dropdown-top-right" id="steam-code-dropdown">
                <a href="#" class="code-item" data-code="unnamed">无名代码</a>
                <a href="#" class="code-item" data-code="artwork">艺术作品代码</a>
                <a href="#" class="code-item" data-code="workshop">创意工坊代码</a>
                <a href="#" class="code-item" data-code="guide">指南代码</a>
                <a href="#" class="code-item" data-code="screenshot">屏幕截图代码</a>
                <div class="code-tip">
                    💡 使用提示：无名代码需配合其它代码使用<br>
                    先使用其它代码，再使用无名代码<br>
                    即可无需输入作品名字发布
                </div>
            </div>
        `);

        // 创建右上角按钮容器
        const topRightContainer = $('<div class="top-right-btn-container"></div>');
        topRightContainer.append(editorBtn);
        $('body').append(topRightContainer);

        // 将下拉菜单添加到body
        $('body').append(codeDropdown);

        // 按钮点击事件 - 右上角位置优化
        editorBtn.on('click', function(e) {
            e.stopPropagation();

            // 获取按钮位置
            const btnRect = this.getBoundingClientRect();
            const windowWidth = window.innerWidth;

            // 计算下拉菜单位置 - 固定在右上角
            let top = btnRect.bottom + 10;
            let left = btnRect.right - 300; // 菜单宽度300px，右对齐

            // 确保不超出窗口边界
            if (left < 10) {
                left = 10;
            }

            // 应用位置并显示
            codeDropdown.css({
                top: top + 'px',
                left: left + 'px',
                display: 'block'
            });

            // 触发渐变动画
            setTimeout(() => {
                codeDropdown.addClass('show');
            }, 10);
        });

        // 代码菜单项点击事件
        codeDropdown.on('click', '.code-item', function(e) {
            e.preventDefault();
            const codeType = $(this).data('code');
            let code = '';
            let codeName = '';

            switch(codeType) {
                case 'unnamed':
                    code = `v_trim=_=>{return _},$J('#title').val(' \\n'+Array.from(Array(126),_=>'\\t').join(''));`;
                    codeName = "无名代码";
                    break;
                case 'artwork':
                    code = `$J('#image_width').val(1000).attr('id',''),$J('#image_height').val(1).attr('id','');`;
                    codeName = "艺术作品代码";
                    break;
                case 'workshop':
                    code = `$J('[name=consumer_app_id]').val(480);$J('[name=file_type]').val(0);$J('[name=visibility]').val(0);`;
                    codeName = "创意工坊代码";
                    break;
                case 'guide':
                    code = `$J('[name=consumer_app_id]').val(480);$J('[name=file_type]').val(9);$J('[name=visibility]').val(0);`;
                    codeName = "指南代码";
                    break;
                case 'screenshot':
                    code = `$J('#image_width').val(1000).attr('id',''),$J('#image_height').val(1).attr('id',''),$J('[name=file_type]').val(5);`;
                    codeName = "屏幕截图代码";
                    break;
            }

            // 复制代码到剪贴板
            GM_setClipboard(code);

            // 显示通知
            showCodeNotification(codeName, code);

            hideCodeDropdown();
        });

        // 显示代码通知
        function showCodeNotification(name, code) {
            const notification = $(`
                <div class="code-notification">
                    <strong>✅ ${name} 已复制!</strong>
                    <p>代码内容: <code style="word-break: break-all; display: inline-block; background: rgba(0,0,0,0.4); padding: 4px 8px; border-radius: 3px; margin-top: 5px; border: 1px solid rgba(103, 193, 245, 0.3);">${code}</code></p>
                    <p>📋 请按 <span class="hotkey">F12</span> 打开浏览器开发者工具</p>
                    <p>⚡ 在 Console/控制台 标签页中粘贴代码并回车执行</p>
                </div>
            `);

            $('body').append(notification);

            // 6秒后自动关闭
            setTimeout(() => {
                notification.fadeOut(500, () => notification.remove());
            }, 6000);
        }

        // 隐藏代码下拉菜单函数
        function hideCodeDropdown() {
            codeDropdown.removeClass('show');
            setTimeout(() => {
                codeDropdown.hide();
            }, 300);
        }

        // 点击页面其他地方关闭下拉菜单
        $(document).on('click', function() {
            hideCodeDropdown();
        });
    }
})();