// ==UserScript==
// @name         福建江夏学院学生评价自动完成 
// @name:zh-CN   福建江夏学院学生评价自动完成
// @version      9.3.6
// @author       ahrinya
// @match        *://jwxt.fjjxu.edu.cn/*
// @grant        unsafeWindow
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjY3ZWVhIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAydjIwbS0xMC0xMGgyMCIvPjwvc3ZnPg==
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @namespace http://tampermonkey.net/
// @description 在福建江夏学院教学管理信息服务平台上自动设置具有特定属性的输入框值，并提供手动按钮和自动消失提示
// @downloadURL https://update.greasyfork.org/scripts/516432/%E7%A6%8F%E5%BB%BA%E6%B1%9F%E5%A4%8F%E5%AD%A6%E9%99%A2%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/516432/%E7%A6%8F%E5%BB%BA%E6%B1%9F%E5%A4%8F%E5%AD%A6%E9%99%A2%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 等待页面 jQuery 加载完成
    function waitForJQuery(callback) {
        if (unsafeWindow.jQuery || window.jQuery) {
            callback(unsafeWindow.jQuery || window.jQuery);
        } else {
            setTimeout(() => waitForJQuery(callback), 100);
        }
    }

    waitForJQuery(function($) {
        // 原脚本的所有代码放在这里
        const SCORE = 100;
        const COMMENT = "授课认真，内容丰富，讲解清晰。";
        let currentIndex = 0;
        let isClicking = false;
        let isAutoMode = false;

        // --- 1. 弹窗自动确认 + 自动下一个 ---
        const observer = new MutationObserver(() => {
            const $okBtn = $('#btn_ok[data-bb-handler="ok"]');
            if ($okBtn.length > 0 && $okBtn.is(':visible')) {
                $okBtn.click();
                updateStatus("当前老师完成，正在切换下一位");
                isClicking = false;

                if (isAutoMode) {
                    setTimeout(() => {
                        let total = $('#tempGrid tr.jqgrow:visible').length;
                        if (currentIndex < total) {
                            processTeacher();
                        } else {
                            isAutoMode = false;
                            $('#btn-auto').text('开始自动').css('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
                            $('#auto-indicator').hide();
                            updateStatus("<b style='color:#10b981;'>✓ 评教完成，请手动提交！</b>");
                        }
                    }, 1500);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // --- 2. 界面渲染 ---
        function initUI() {
            $('#auto-eval-panel').remove();

            const panel = $(`
                <div id="auto-eval-panel" style="
                    position: fixed;
                    top: 150px;
                    right: 20px;
                    z-index: 99999;
                    width: 280px;
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    border-radius: 16px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
                    color: #1f2937;
                ">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="
                                width: 32px;
                                height: 32px;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-weight: bold;
                                font-size: 14px;
                                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                            ">评</div>
                            <div>
                                <div style="font-weight: 700; font-size: 15px; color: #111827;">评教助手</div>
                            </div>
                        </div>
                        <div id="status-dot" style="
                            width: 8px;
                            height: 8px;
                            background: #10b981;
                            border-radius: 50%;
                            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
                        "></div>
                    </div>

                    <div style="
                        background: rgba(102, 126, 234, 0.08);
                        border-radius: 10px;
                        padding: 10px;
                        margin-bottom: 14px;
                        border: 1px solid rgba(102, 126, 234, 0.15);
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-size: 12px; color: #4b5563; font-weight: 500;">当前进度</span>
                            <span id="progress-text" style="font-size: 12px; font-weight: 700; color: #667eea;">0/0</span>
                        </div>
                        <div style="
                            width: 100%;
                            height: 4px;
                            background: rgba(0,0,0,0.05);
                            border-radius: 2px;
                            overflow: hidden;
                        ">
                            <div id="progress-bar" style="
                                width: 0%;
                                height: 100%;
                                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                                border-radius: 2px;
                                transition: width 0.3s ease;
                            "></div>
                        </div>
                        <div id="auto-indicator" style="margin-top: 6px; font-size: 10px; color: #667eea; text-align: center; display: none; font-weight: 600;">
                            🤖 自动模式运行中...
                        </div>
                    </div>

                    <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                        <button id="btn-run" style="
                            flex: 1;
                            padding: 10px;
                            background: #f3f4f6;
                            color: #374151;
                            border: 1px solid rgba(0,0,0,0.1);
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 13px;
                            transition: all 0.2s;
                        ">手动下一个</button>

                        <button id="btn-auto" style="
                            flex: 1;
                            padding: 10px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 13px;
                            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                            transition: all 0.2s;
                        ">开始</button>
                    </div>

                    <div id="auto-status" style="
                        font-size: 12px;
                        color: #4b5563;
                        min-height: 36px;
                        background: rgba(255,255,255,0.6);
                        padding: 10px;
                        border-radius: 8px;
                        border: 1px solid rgba(0,0,0,0.05);
                        line-height: 1.4;
                    ">状态: 准备就绪<br><span style="font-size: 10px; color: #9ca3af;">点击"开始"，开始自动评价</span></div>
                </div>
            `);

            $('body').append(panel);

            $('#btn-run').click(function() {
                isAutoMode = false;
                $('#btn-auto').text('开始自动').css('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
                $('#auto-indicator').hide();
                processTeacher();
            });

            $('#btn-auto').click(function() {
                const btn = $(this);

                if (isAutoMode) {
                    isAutoMode = false;
                    btn.text('开始自动').css('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
                    $('#auto-indicator').hide();
                    updateStatus("已停止自动模式，可点击手动下一个继续");
                } else {
                    isAutoMode = true;
                    btn.text('停止自动').css('background', '#ef4444');
                    $('#auto-indicator').show();
                    updateStatus("自动模式已启动...");
                    processTeacher();
                }
            });

            setTimeout(() => {
                let total = $('#tempGrid tr.jqgrow:visible').length;
                $('#progress-text').text('0/' + total);
            }, 500);
        }

        function processTeacher() {
            if (isClicking) return;

            let rows = $('#tempGrid tr.jqgrow:visible');
            let total = rows.length;

            if (currentIndex >= total) {
                isAutoMode = false;
                $('#btn-auto').text('开始自动').css('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
                $('#auto-indicator').hide();
                updateStatus("<b style='color:#10b981;'>✓ 全部处理完毕！</b>");
                currentIndex = 0;
                $('#progress-bar').css('width', '100%');
                return;
            }

            let currentRow = $(rows[currentIndex]);
            let teacherName = currentRow.find('td[aria-describedby$="jsm"]').text();

            updateStatus(`正在处理: <b>${teacherName}</b>${isAutoMode ? ' (自动模式)' : ''}`);
            $('#progress-text').text((currentIndex + 1) + '/' + total);
            $('#progress-bar').css('width', ((currentIndex / total) * 100) + '%');

            currentRow.click();

            let checkExist = setInterval(() => {
                const saveBtn = $('#btn_xspj_bc');
                const inputs = $('#panel_content input[type="text"]:visible');

                if (saveBtn.length > 0 && inputs.length > 0) {
                    clearInterval(checkExist);
                    isClicking = true;
                    doWork(teacherName, saveBtn);
                }
            }, 300);
        }

        function doWork(name, $btn) {
            updateStatus(`正在 <b>${name}</b> 填写评价...`);

            $('#panel_content').find('input[type="text"]:visible').each(function() {
                if (!$(this).prop('readonly')) {
                    $(this).val(SCORE);
                    $(this).trigger('input').trigger('change').trigger('blur');
                }
            });

            $('#panel_content').find('input[type="radio"]').each(function() {
                let n = $(this).attr('name');
                $('#panel_content').find(`input[name="${n}"]:first`).click();
            });

            $('#panel_content').find('textarea').val(COMMENT).trigger('change').trigger('blur');

            setTimeout(() => {
                updateStatus(`保存中...${isAutoMode ? ' (完成后自动下一个)' : ''}`);

                $btn.css({
                    'background-color': '#10b981',
                    'color': 'white',
                    'transform': 'scale(0.95)',
                    'transition': 'transform 0.1s'
                });

                $btn.focus();
                $btn.trigger('mouseenter');
                $btn.click();

                currentIndex++;

                setTimeout(() => {
                    $btn.css('transform', 'scale(1)');
                }, 100);

            }, 800);
        }

        function updateStatus(msg) {
            $('#auto-status').html(msg);
        }

        setTimeout(initUI, 1000);
    });
})();// ==UserScript==
// @name         福建江夏学院-评教助手 
// @name:zh-CN   福建江夏学院-评教助手 
// @namespace    https://github.com/yourusername/fjjxu-pj-helper
// @version      9.3.1
// @description  福建江夏学院教务系统自动评教工具，支持一键自动连续评价所有教师，毛玻璃UI界面，自动填充评分和评语，大幅节省评教时间。
// @description:zh-CN  福建江夏学院教务系统自动评教工具，支持一键自动连续评价所有教师，毛玻璃UI界面，自动填充评分和评语，大幅节省评教时间。
// @author       Gemini
// @match        *://jwxt.fjjxu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html*
// @match        *://jwxt.fjjxu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @license      MIT
// @icon         https://jwxt.fjjxu.edu.cn/favicon.ico
// @compatible   chrome 测试通过
// @compatible   edge 测试通过
// @compatible   firefox 测试通过
// ==/UserScript==


(function() {
    'use strict';
    var $ = unsafeWindow.jQuery || window.jQuery;

    const SCORE = 100;
    const COMMENT = "授课认真，内容丰富，讲解清晰。";
    let currentIndex = 0;
    let isClicking = false;
    let isAutoMode = false;

    // --- 1. 弹窗自动确认 + 自动下一个 ---
    const observer = new MutationObserver(() => {
        const $okBtn = $('#btn_ok[data-bb-handler="ok"]');
        if ($okBtn.length > 0 && $okBtn.is(':visible')) {
            $okBtn.click();
            updateStatus("当前老师完成，正在切换下一位");
            isClicking = false;

            if (isAutoMode) {
                setTimeout(() => {
                    let total = $('#tempGrid tr.jqgrow:visible').length;
                    if (currentIndex < total) {
                        processTeacher();
                    } else {
                        isAutoMode = false;
                        $('#btn-auto').text('开始自动').css('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
                        $('#auto-indicator').hide();
                        updateStatus("<b style='color:#10b981;'>✓ 评教完成，请手动提交！</b>");
                    }
                }, 1500);
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // --- 2. 界面渲染 ---
    function initUI() {
        $('#auto-eval-panel').remove();

        const panel = $(`
            <div id="auto-eval-panel" style="
                position: fixed;
                top: 150px;
                right: 20px;
                z-index: 99999;
                width: 280px;
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
                color: #1f2937;
            ">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="
                            width: 32px;
                            height: 32px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                            font-size: 14px;
                            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                        ">评</div>
                        <div>
                            <div style="font-weight: 700; font-size: 15px; color: #111827;">评教助手</div>
                        </div>
                    </div>
                    <div id="status-dot" style="
                        width: 8px;
                        height: 8px;
                        background: #10b981;
                        border-radius: 50%;
                        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
                    "></div>
                </div>

                <div style="
                    background: rgba(102, 126, 234, 0.08);
                    border-radius: 10px;
                    padding: 10px;
                    margin-bottom: 14px;
                    border: 1px solid rgba(102, 126, 234, 0.15);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: 12px; color: #4b5563; font-weight: 500;">当前进度</span>
                        <span id="progress-text" style="font-size: 12px; font-weight: 700; color: #667eea;">0/0</span>
                    </div>
                    <div style="
                        width: 100%;
                        height: 4px;
                        background: rgba(0,0,0,0.05);
                        border-radius: 2px;
                        overflow: hidden;
                    ">
                        <div id="progress-bar" style="
                            width: 0%;
                            height: 100%;
                            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                            border-radius: 2px;
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                    <div id="auto-indicator" style="margin-top: 6px; font-size: 10px; color: #667eea; text-align: center; display: none; font-weight: 600;">
                        🤖 自动模式运行中...
                    </div>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <button id="btn-run" style="
                        flex: 1;
                        padding: 10px;
                        background: #f3f4f6;
                        color: #374151;
                        border: 1px solid rgba(0,0,0,0.1);
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 13px;
                        transition: all 0.2s;
                    ">手动下一个</button>

                    <button id="btn-auto" style="
                        flex: 1;
                        padding: 10px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 13px;
                        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                        transition: all 0.2s;
                    ">开始</button>
                </div>

                <div id="auto-status" style="
                    font-size: 12px;
                    color: #4b5563;
                    min-height: 36px;
                    background: rgba(255,255,255,0.6);
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid rgba(0,0,0,0.05);
                    line-height: 1.4;
                ">状态: 准备就绪<br><span style="font-size: 10px; color: #9ca3af;">点击"开始"，开始自动评价</span></div>
            </div>
        `);

        $('body').append(panel);

        $('#btn-run').click(function() {
            isAutoMode = false;
            $('#btn-auto').text('开始自动').css('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
            $('#auto-indicator').hide();
            processTeacher();
        });

        $('#btn-auto').click(function() {
            const btn = $(this);

            if (isAutoMode) {
                isAutoMode = false;
                btn.text('开始自动').css('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
                $('#auto-indicator').hide();
                updateStatus("已停止自动模式，可点击手动下一个继续");
            } else {
                isAutoMode = true;
                btn.text('停止自动').css('background', '#ef4444');
                $('#auto-indicator').show();
                updateStatus("自动模式已启动...");
                processTeacher();
            }
        });

        setTimeout(() => {
            let total = $('#tempGrid tr.jqgrow:visible').length;
            $('#progress-text').text('0/' + total);
        }, 500);
    }

    function processTeacher() {
        if (isClicking) return;

        let rows = $('#tempGrid tr.jqgrow:visible');
        let total = rows.length;

        if (currentIndex >= total) {
            isAutoMode = false;
            $('#btn-auto').text('开始自动').css('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
            $('#auto-indicator').hide();
            updateStatus("<b style='color:#10b981;'>✓ 全部处理完毕！</b>");
            currentIndex = 0;
            $('#progress-bar').css('width', '100%');
            return;
        }

        let currentRow = $(rows[currentIndex]);
        let teacherName = currentRow.find('td[aria-describedby$="jsm"]').text();

        updateStatus(`正在处理: <b>${teacherName}</b>${isAutoMode ? ' (自动模式)' : ''}`);
        $('#progress-text').text((currentIndex + 1) + '/' + total);
        $('#progress-bar').css('width', (((currentIndex + 1) / total) * 100) + '%');

        currentRow.click();

        let checkExist = setInterval(() => {
            const saveBtn = $('#btn_xspj_bc');
            const inputs = $('#panel_content input[type="text"]:visible');

            if (saveBtn.length > 0 && inputs.length > 0) {
                clearInterval(checkExist);
                isClicking = true;
                doWork(teacherName, saveBtn);
            }
        }, 300);
    }

    function doWork(name, $btn) {
        updateStatus(`正在 <b>${name}</b> 填写评价...`);

        $('#panel_content').find('input[type="text"]:visible').each(function() {
            if (!$(this).prop('readonly')) {
                $(this).val(SCORE);
                $(this).trigger('input').trigger('change').trigger('blur');
            }
        });

        $('#panel_content').find('input[type="radio"]').each(function() {
            let n = $(this).attr('name');
            $('#panel_content').find(`input[name="${n}"]:first`).click();
        });

        $('#panel_content').find('textarea').val(COMMENT).trigger('change').trigger('blur');

        setTimeout(() => {
            updateStatus(`保存中...${isAutoMode ? ' (完成后自动下一个)' : ''}`);

            $btn.css({
                'background-color': '#10b981',
                'color': 'white',
                'transform': 'scale(0.95)',
                'transition': 'transform 0.1s'
            });

            $btn.focus();
            $btn.trigger('mouseenter');
            $btn.click();

            currentIndex++;

            setTimeout(() => {
                $btn.css('transform', 'scale(1)');
            }, 100);

        }, 800);
    }

    function updateStatus(msg) {
        $('#auto-status').html(msg);
    }

    setTimeout(initUI, 1000);
})();
