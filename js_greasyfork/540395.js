// ==UserScript==

// @name           AGSVPT-方舟种子自动审核

// @namespace      http://tampermonkey.net/

// @version        1.1

// @description    自动打开含方舟标签的种子并一键审核通过

// @author         AMD@AGSVPT

// @match          https://www.agsvpt.com/torrents.php?team31=1&team30=1&team29=1&incldead=1&spstate=0&inclbookmarked=0&approval_status=0&size_begin=&size_end=&seeders_begin=&seeders_end=&leechers_begin=&leechers_end=&times_completed_begin=&times_completed_end=&added_begin=&added_end=&search=&search_area=0&search_mode=0

// @match          https://www.agsvpt.com/details.php?id=*

// @grant          GM_openInTab

// @grant          GM_setValue

// @grant          GM_getValue

// @grant          GM_registerMenuCommand

// @require        https://code.jquery.com/jquery-3.6.0.min.js

// @icon           https://www.agsvpt.com/favicon.ico

// @license        MIT

// @downloadURL https://update.greasyfork.org/scripts/540395/AGSVPT-%E6%96%B9%E8%88%9F%E7%A7%8D%E5%AD%90%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/540395/AGSVPT-%E6%96%B9%E8%88%9F%E7%A7%8D%E5%AD%90%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8.meta.js
// ==/UserScript==



(function() {

    'use strict';



    // 配置参数

    const CONFIG = {

        keywords: ["RL", "BeiTai", "Hares"],  // 需要查找的种子标识数组
        openDelay: 3000,            // 打开标签页延迟(ms)
        clickDelay: 5000,           // 点击延迟(ms) - 增加到确保页面加载完成
        approveButtonText: "一键通过" // 审核按钮文本
    };



    // 注册菜单命令

    GM_registerMenuCommand("⚙️ 配置种子审核", openConfig);



    // 主处理函数

    if (window.location.href.includes('torrents.php')) {

        processTorrentList();

    } else if (window.location.href.includes('details.php')) {

        processDetailsPage();

    }



    // 种子列表页处理

    function processTorrentList() {

        // 创建控制面板

        createControlPanel();



        // 查找含关键字的种子

        const matchedLinks = [];
        const keywordColors = {
            "RL": "red",
            "BeiTai": "blue",
            "Hares": "green"
        };

        $('a[href^="details.php?id="]').each(function() {
            const link = $(this);
            const title = link.text();

            // 检查是否包含任一关键字
            CONFIG.keywords.forEach(keyword => {
                if (title.includes(keyword)) {
                    const href = link.attr('href');
                    const fullUrl = new URL(href, window.location.origin).toString();
                    matchedLinks.push({
                        url: fullUrl,
                        title: title.trim(),
                        keyword: keyword
                    });

                    // 添加标记
                    link.parent().prepend(
                        `<span style="color:${keywordColors[keyword] || 'black'}; font-weight:bold; margin-right:5px;">[${keyword}]</span>`
                    );
                }
            });
        });



        if (matchedLinks.length === 0) {

            showNotification(`❌ 未找到含 "${CONFIG.keywords.join('", "')}" 的种子`, 'error');

            return;

        }



        // 保存找到的链接

        GM_setValue('matchedLinks', JSON.stringify(matchedLinks));
        showNotification(`✅ 找到 ${matchedLinks.length} 个含指定关键字的种子`, 'success');



        // 添加批量处理按钮

        $('#batch-process-matched').click(function() {

            processLinksSequentially(matchedLinks);

        });
    }



    // 详情页处理 - 重点修复此功能

    function processDetailsPage() {

        // 使用多种方式查找按钮

        const findApproveButton = () => {

            // 方式1：通过ID查找

            let button = $('#approve-btn');



            // 方式2：通过链接文本查找

            if (!button.length) {

                button = $(`a:contains("${CONFIG.approveButtonText}")`);

            }



            // 方式3：通过CSS类查找

            if (!button.length) {

                button = $('.torrent-approval-btn');

            }



            return button;

        };



        // 尝试立即查找按钮

        let approveButton = findApproveButton();



        if (approveButton.length > 0) {

            triggerButtonClick(approveButton);

        } else {

            // 使用MutationObserver确保页面完全加载

            const observer = new MutationObserver((mutations) => {

                approveButton = findApproveButton();

                if (approveButton.length > 0) {

                    observer.disconnect();

                    triggerButtonClick(approveButton);

                }

            });



            // 开始观察DOM变化

            observer.observe(document.body, {

                childList: true,

                subtree: true

            });



            // 设置超时回退

            setTimeout(() => {

                approveButton = findApproveButton();

                if (approveButton.length === 0) {

                    showNotification(`❌ 未找到审核按钮: ${CONFIG.approveButtonText}`, 'error');

                }

            }, 10000); // 10秒超时

        }



        // 触发按钮点击

        function triggerButtonClick(button) {

            // 自动滚动到按钮位置

            $('html, body').animate({

                scrollTop: button.offset().top - 100

            }, 500);



            // 添加高亮效果

            button.css({

                'box-shadow': '0 0 10px #00c853',

                'border': '2px solid #00c853',

                'animation': 'pulse 2s infinite'

            });



            // 创建样式

            $('<style>')

                .text(`@keyframes pulse {

                    0% { transform: scale(1); }

                    50% { transform: scale(1.05); }

                    100% { transform: scale(1); }

                }`)

                .appendTo('head');



            // 延时点击按钮

            setTimeout(() => {

                button[0].click(); // 使用原生click方法确保触发

                showNotification(`✅ 种子已审核通过`, 'success');



                // 自动关闭页面（可选）

                setTimeout(() => {

                    window.close();

                }, 2000);



            }, CONFIG.clickDelay);

        }

    }



    // 顺序处理链接

    function processLinksSequentially(links) {

        if (links.length === 0) return;



        const current = links.shift();

        showNotification(`⏳ 正在处理: ${current.title} (${current.keyword})`, 'info');



        // 打开新标签页

        GM_openInTab(current.url, {

            active: true,

            setParent: true

        });



        // 处理下一个

        if (links.length > 0) {

            setTimeout(() => {

                GM_setValue('matchedLinks', JSON.stringify(links));

                processLinksSequentially(links);

            }, CONFIG.openDelay);

        } else {

            showNotification(`🎉 所有匹配种子处理完成`, 'success');

        }

    }



    // 创建控制面板

    function createControlPanel() {

        const panelHTML = `

        <div id="matched-control-panel" style="

            position: fixed;

            top: 20px;

            right: 20px;

            background: white;

            padding: 15px;

            border-radius: 10px;

            box-shadow: 0 0 15px rgba(0,0,0,0.2);

            z-index: 9999;

            border: 1px solid #e0e0e0;

        ">

            <h3 style="margin-top:0; color:#d32f2f;">

                种子自动审核控制台 (${CONFIG.keywords.join(', ')})

            </h3>

            <button id="batch-process-matched" style="

                background: linear-gradient(135deg, #4CAF50, #2E7D32);

                color: white;

                border: none;

                padding: 10px 20px;

                border-radius: 5px;

                cursor: pointer;

                font-weight: bold;

                display: block;

                width: 100%;

                margin-bottom: 10px;

            ">

                🚀 批量审核匹配种子

            </button>

            <div id="status-display" style="

                margin-top: 10px;

                padding: 10px;

                background: #f9f9f9;

                border-radius: 5px;

                font-size: 0.9em;

            ">

                就绪，等待操作...

            </div>

        </div>`;



        $('body').append(panelHTML);

    }



    // 显示通知

    function showNotification(message, type) {

        const statusDisplay = $('#status-display');

        if (!statusDisplay.length) return;



        const colors = {

            success: '#4CAF50',

            error: '#F44336',

            info: '#2196F3'

        };



        statusDisplay.html(`<span style="color:${colors[type] || '#333'}">▶ ${message}</span>`);



        // 添加到页面顶部

        $('body').append(`

            <div class="global-notification" style="

                position: fixed;

                top: 10px;

                right: 10px;

                padding: 15px;

                background: ${type === 'error' ? '#ffebee' : type === 'success' ? '#e8f5e9' : '#e3f2fd'};

                border-left: 5px solid ${colors[type] || '#2196F3'};

                border-radius: 4px;

                box-shadow: 0 2px 10px rgba(0,0,0,0.1);

                z-index: 10000;

                animation: fadeInOut 5s forwards;

            ">

                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}

            </div>

        `);



        // 添加动画

        $('<style>')

            .text(`@keyframes fadeInOut {

                0% { opacity: 0; transform: translateY(-20px); }

                10% { opacity: 1; transform: translateY(0); }

                90% { opacity: 1; transform: translateY(0); }

                100% { opacity: 0; transform: translateY(-20px); }

            }`)

            .appendTo('head');



        // 自动移除通知

        setTimeout(() => {

            $('.global-notification').remove();

        }, 4800);

    }



    // 打开配置界面

    function openConfig() {

        const configHTML = `

        <div id="matched-config" style="

            position: fixed;

            top: 50%;

            left: 50%;

            transform: translate(-50%, -50%);

            background: white;

            padding: 20px;

            border-radius: 10px;

            box-shadow: 0 0 20px rgba(0,0,0,0.3);

            z-index: 10000;

            width: 350px;

        ">

            <h3 style="margin-top:0;">种子审核配置</h3>

            <div style="margin-bottom:15px;">

                <label>种子标识符(逗号分隔):</label>

                <input type="text" id="matched-keywords" value="${CONFIG.keywords.join(', ')}" style="width:100%; padding:8px;">

            </div>

            <div style="margin-bottom:15px;">

                <label>打开延迟(ms):</label>

                <input type="number" id="open-delay" value="${CONFIG.openDelay}" style="width:100%; padding:8px;">

            </div>

            <div style="margin-bottom:15px;">

                <label>点击延迟(ms):</label>

                <input type="number" id="click-delay" value="${CONFIG.clickDelay}" style="width:100%; padding:8px;">

            </div>

            <button id="save-config" style="

                background: #4CAF50;

                color: white;

                border: none;

                padding: 10px 15px;

                border-radius: 5px;

                cursor: pointer;

                width: 100%;

            ">

                保存配置

            </button>

        </div>`;



        $('body').append(configHTML);



        $('#save-config').click(function() {

            const keywordsInput = $('#matched-keywords').val();
            CONFIG.keywords = keywordsInput.split(',').map(k => k.trim()).filter(k => k.length > 0);
            CONFIG.openDelay = parseInt($('#open-delay').val());
            CONFIG.clickDelay = parseInt($('#click-delay').val());
            $('#matched-config').remove();
            showNotification('✅ 配置已保存', 'success');

            // 刷新页面以应用新配置
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });

    }

})();
