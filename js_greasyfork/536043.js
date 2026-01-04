// ==UserScript==
// @name        自动看视频作业 - ouchn.cn
// @namespace   Violentmonkey Scripts
// @match       https://lms.ouchn.cn/course/*/learning-activity/full-screen
// @match       https://lms.ouchn.cn/exam/*
// @grant       none
// @version     1.0.12
// @author      -
// @description 2022/12/2 下午2:33:34
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536043/%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%A7%86%E9%A2%91%E4%BD%9C%E4%B8%9A%20-%20ouchncn.user.js
// @updateURL https://update.greasyfork.org/scripts/536043/%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%A7%86%E9%A2%91%E4%BD%9C%E4%B8%9A%20-%20ouchncn.meta.js
// ==/UserScript==



(function () {
    'use strict';

    // --- Configuration & State ---
    const STORAGE_KEY_ENABLED = 'auto_ouchn_enabled';
    const STORAGE_KEY_RELOAD = 'auto_ouchn_reload';
    const STORAGE_KEY_LAST_PATH = 'auto_ouchn_last_path';
    const STORAGE_KEY_STUCK_COUNT = 'auto_ouchn_stuck_count';
    const STORAGE_KEY_LAST_REPORT_TIME = 'auto_ouchn_last_report_time';
    const STORAGE_KEY_COMPLETED_HASHES = 'auto_ouchn_completed_hashes';
    const MAX_STUCK_COUNT = 5;

    // --- UI Components ---
    function initUI() {
        const isEnabled = getEnabledState();
        const isReloadEnabled = getReloadState();

        const $ui = $(`
      <div id="ouchn-helper-ui" style="position: fixed; top: 55%; right: 20px; z-index: 99999; background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: sans-serif; font-size: 14px; border: 1px solid #eee; min-width: 180px;">
        <div style="margin-bottom: 10px; font-weight: bold; color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px;">Ouchn 自动助手</div>
        
        <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 8px;">
          <input type="checkbox" id="auto-run-toggle" ${isEnabled ? 'checked' : ''} style="margin-right: 8px;">
          <span>开启自动运行</span>
        </label>
        
        <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 12px;">
          <input type="checkbox" id="reload-toggle" ${isReloadEnabled ? 'checked' : ''} style="margin-right: 8px;">
          <span>开启自动刷新</span>
        </label>

        <button id="manual-report-btn" style="width: 100%; padding: 6px 0; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 8px;">手动上报当前</button>

        <div id="ouchn-status" style="margin-top: 8px; font-size: 12px; color: #666; line-height: 1.4;">${isEnabled ? '运行中...' : '已暂停'}</div>
      </div>
    `);

        $('body').append($ui);

        $('#auto-run-toggle').on('change', function () {
            const checked = $(this).prop('checked');
            setEnabledState(checked);
            updateStatus(checked ? '启动中...' : '已暂停');
            if (checked) {
                localStorage.setItem(STORAGE_KEY_STUCK_COUNT, '0');
                run();
            }
        });

        $('#reload-toggle').on('change', function () {
            const checked = $(this).prop('checked');
            setReloadState(checked);
        });

        $('#manual-report-btn').on('click', function () {
            updateStatus('正在手动上报...');
            readCurrent();
        });
    }

    function updateStatus(text) {
        $('#ouchn-status').text(text);
    }

    // --- State Management ---
    function getEnabledState() {
        return localStorage.getItem(STORAGE_KEY_ENABLED) === 'true';
    }

    function setEnabledState(enabled) {
        localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));
    }

    function getReloadState() {
        const val = localStorage.getItem(STORAGE_KEY_RELOAD);
        return val === null ? true : val === 'true';
    }

    function setReloadState(enabled) {
        localStorage.setItem(STORAGE_KEY_RELOAD, String(enabled));
    }

    function checkStuck() {
        const currentPath = window.location.pathname + window.location.hash;
        const lastPath = localStorage.getItem(STORAGE_KEY_LAST_PATH) || '';
        let stuckCount = parseInt(localStorage.getItem(STORAGE_KEY_STUCK_COUNT) || '0');

        if (currentPath === lastPath) {
            stuckCount++;
        } else {
            stuckCount = 0;
            localStorage.setItem(STORAGE_KEY_LAST_PATH, currentPath);
        }

        localStorage.setItem(STORAGE_KEY_STUCK_COUNT, String(stuckCount));

        if (stuckCount >= MAX_STUCK_COUNT) {
            return true;
        }
        return false;
    }

    // Helper for hashes
    function getCompletedHashes() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY_COMPLETED_HASHES) || '[]');
        } catch (e) {
            return [];
        }
    }

    function addCompletedHash(hash) {
        const hashes = getCompletedHashes();
        if (!hashes.includes(hash)) {
            hashes.push(hash);
            // Limit size to prevent storage overflow, keep last 100
            if (hashes.length > 100) hashes.shift();
            localStorage.setItem(STORAGE_KEY_COMPLETED_HASHES, JSON.stringify(hashes));
        }
    }

    function isHashCompleted(hash) {
        return getCompletedHashes().includes(hash);
    }

    // --- Core Logic ---
    async function readCurrent() {
        // This function now ONLY handles reporting.

        let videoEl = $("video");

        if (videoEl.length) {
            let length = videoEl[0].duration;
            let hash = window.location.hash;

            if (hash) {
                hash = hash.replace("#/", "");

                // 30s Interval Check
                const lastReportTime = parseInt(localStorage.getItem(STORAGE_KEY_LAST_REPORT_TIME) || '0');
                const now = Date.now();
                const timeDiff = now - lastReportTime;

                if (timeDiff < 30000) {
                    const waitMs = 30000 - timeDiff;
                    updateStatus(`等待 ${Math.ceil(waitMs / 1000)}秒后上报以防频繁...`);
                    await new Promise(r => setTimeout(r, waitMs));
                }

                try {
                    updateStatus('正在上报进度...');
                    let res = await $.ajax({
                        "url": "https://lms.ouchn.cn/api/course/activities-read/" + hash,
                        "method": "POST",
                        "timeout": 0,
                        contentType: "application/json",
                        "data": JSON.stringify({
                            "start": 0,
                            "end": parseInt(length)
                        }),
                    });
                    console.log('Progress reported:', res);
                    updateStatus('上报成功!');

                    // Update State
                    localStorage.setItem(STORAGE_KEY_LAST_REPORT_TIME, Date.now().toString());
                    addCompletedHash(hash);

                } catch (e) {
                    console.error('Report failed:', e);
                    updateStatus('上报失败');
                }
            }
        }
    }

    function hasNext() {
        return !!$(".next-btn").length || !!$("a.next").length;
    }

    // --- Exam Tool (Doubao) ---
    function initExamTool() {
        if (!window.location.href.includes('/exam/')) return;

        // 样式模拟手机
        const $examUi = $(`
            <div id="doubao-exam-helper" style="position: fixed; right: 20px; bottom: 20px; width: 375px; height: 667px; z-index: 2147483647; background: #fff; border: 12px solid #222; border-radius: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); transform: scale(0.85); transform-origin: bottom right;">
                <!-- 顶部听筒/摄像头区域模拟 -->
                <div style="height: 25px; background: #222; display: flex; justify-content: center; align-items: center; position: relative;">
                    <div style="width: 60px; height: 5px; background: #333; border-radius: 3px;"></div>
                    <div style="width: 8px; height: 8px; background: #333; border-radius: 50%; margin-left:10px;"></div>
                </div>
                
                <iframe id="doubao-iframe" src="https://www.doubao.com/chat/" 
                    style="flex: 1; border: none; background: #fff;"
                    allow="clipboard-read; clipboard-write; microphone">
                </iframe>

                <!-- 底部Home键区域模拟 -->
                <div style="height: 40px; background: #222; display: flex; justify-content: center; align-items: center; cursor: pointer;" id="doubao-bottom-bar">
                    <div style="width: 35px; height: 35px; border: 2px solid #444; border-radius: 50%;"></div>
                </div>

                <!-- 悬浮收起按钮 -->
                <div id="doubao-close-btn" style="position: absolute; top: 10px; right: -50px; background: #222; color: #fff; padding: 10px; border-radius: 5px 0 0 5px; cursor: pointer; font-size: 12px;">收起</div>
            </div>
            
            <div id="doubao-restore-btn" style="position: fixed; right: 0; bottom: 100px; display: none; background: #1e80ff; color: #fff; padding: 10px 15px; border-radius: 20px 0 0 20px; cursor: pointer; z-index: 2147483647; box-shadow: -2px 4px 10px rgba(0,0,0,0.2); font-weight: bold;">
                豆包
            </div>
        `);

        $('body').append($examUi);

        // 简单的交互：收起/恢复
        $('#doubao-bottom-bar').on('click', function () {
            $('#doubao-exam-helper').css('transform', 'scale(0) translate(200px, 200px)');
            setTimeout(() => {
                $('#doubao-exam-helper').hide();
                $('#doubao-restore-btn').fadeIn();
            }, 300);
        });

        $('#doubao-restore-btn').on('click', function () {
            $(this).hide();
            $('#doubao-exam-helper').show().css('transform', 'scale(0.85)');
        });

        // 模拟 UA 的提示 (实际脚本由于安全限制无法修改 iframe 的 Request Header，但可以提示)
        console.log('Doubao Helper Initialized. Please ensure you are using a browser that allows iframing Doubao or use a Mobile UA extension if it fails to load.');
    }

    function checkQuiz() {
        const hasStartBtn = $("span").filter(function () {
            return $(this).text().trim().includes("开始答题");
        }).length > 0;

        if (hasStartBtn) {
            const hasSubmission = $("span").filter(function () {
                return $(this).text().trim().includes("最后交卷时间");
            }).length > 0;

            // 如果存在答题记录（含有"最后交卷时间"），则不暂停（返回 false）
            // 否则（只有"开始答题"但没记录），返回 true 以暂停
            return !hasSubmission;
        }

        return false;
    }

    function run() {
        if (!getEnabledState()) return;

        // Check quiz condition
        if (checkQuiz()) {
            setEnabledState(false);
            $('#auto-run-toggle').prop('checked', false);
            updateStatus('检测到答题，已暂停');
            alert('检测到"开始答题"页面，自动运行已暂停，请手动完成。');
            return;
        }

        // Check stuck condition
        if (checkStuck()) {
            setEnabledState(false);
            $('#auto-run-toggle').prop('checked', false);
            updateStatus('检测到页面卡顿，已停止');
            alert('自动运行已停止：页面路径连续3次未变化。');
            return;
        }

        let checkCount = 0;
        const maxChecks = 20;

        updateStatus('正在寻找下一页按钮...');

        const timer = setInterval(async () => {
            if (!getEnabledState()) {
                clearInterval(timer);
                return;
            }

            if (checkQuiz()) {
                clearInterval(timer);
                setEnabledState(false);
                $('#auto-run-toggle').prop('checked', false);
                updateStatus('检测到答题，已暂停');
                alert('检测到"开始答题"页面，自动运行已暂停，请手动完成。');
                return;
            }

            checkCount++;
            let hasNextBtn = hasNext();

            if (hasNextBtn) {
                clearInterval(timer);

                // Logic: Found Next -> Check if current hash reported -> Report if needed -> Click Next

                const currentHashRaw = window.location.hash;
                const currentHash = currentHashRaw.replace("#/", "");

                if (!isHashCompleted(currentHash)) {
                    await readCurrent();
                } else {
                    updateStatus('当前页已上报，跳过上报');
                }

                // Re-check enabled state after potentially long await
                if (!getEnabledState()) return;

                updateStatus('点击下一页...');
                if ($(".next-btn").length) $(".next-btn").click();
                else if ($("a.next").length) $("a.next").click();

                // Wait 5s to verify navigation
                setTimeout(() => {
                    if (!getEnabledState()) return;

                    const newHashRaw = window.location.hash;
                    if (newHashRaw !== currentHashRaw) {
                        // Changed
                        updateStatus('页面跳转成功, 准备下一轮...');
                        // Recursive call for next page
                        run();
                    } else {
                        // Not Changed
                        updateStatus('页面Hash未变化，刷新重试...');
                        // If reload toggle is checked, we reload. User logic says "if no change reload".
                        window.location.reload();
                    }
                }, 5000);

            } else {
                updateStatus('正在寻找下一页 (' + checkCount + '/' + maxChecks + ')...');
                if (checkCount >= maxChecks) {
                    clearInterval(timer);
                    setEnabledState(false);
                    $('#auto-run-toggle').prop('checked', false);
                    updateStatus('未找到下一页，停止运行');
                    alert('未找到下一页按钮，自动运行已停止。');
                }
            }
        }, 1000);
    }

    // --- Initialization ---
    $(document).ready(function () {
        initUI();
        initExamTool();
        if (getEnabledState()) {
            // Add a small delay to ensure page load
            setTimeout(run, 1000);
        }
    });

})();

// Register onpaste on inputs and textareas in browsers that don't
// natively support it.
(function () {
    var onload = window.onload;

    window.onload = function () {
        if (typeof onload == "function") {
            onload.apply(this, arguments);
        }

        var fields = [];
        var inputs = document.getElementsByTagName("input");
        var textareas = document.getElementsByTagName("textarea");

        for (var i = 0; i < inputs.length; i++) {
            fields.push(inputs[i]);
        }

        for (var i = 0; i < textareas.length; i++) {
            fields.push(textareas[i]);
        }

        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];

            if (typeof field.onpaste != "function" && !!field.getAttribute("onpaste")) {
                field.onpaste = eval("(function () { " + field.getAttribute("onpaste") + " })");
            }

            if (typeof field.onpaste == "function") {
                var oninput = field.oninput;

                field.oninput = function () {
                    if (typeof oninput == "function") {
                        oninput.apply(this, arguments);
                    }

                    if (typeof this.previousValue == "undefined") {
                        this.previousValue = this.value;
                    }

                    var pasted = (Math.abs(this.previousValue.length - this.value.length) > 1 && this.value != "");

                    if (pasted && !this.onpaste.apply(this, arguments)) {
                        this.value = this.previousValue;
                    }

                    this.previousValue = this.value;
                };

                if (field.addEventListener) {
                    field.addEventListener("input", field.oninput, false);
                } else if (field.attachEvent) {
                    field.attachEvent("oninput", field.oninput);
                }
            }
        }
    }
})();