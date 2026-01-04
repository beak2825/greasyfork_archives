// ==UserScript==
// @name         幻域—自助领取现金红包
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  领取现金红包，无套路，辅助脚本，为活动服务
// @author       您
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/546334/%E5%B9%BB%E5%9F%9F%E2%80%94%E8%87%AA%E5%8A%A9%E9%A2%86%E5%8F%96%E7%8E%B0%E9%87%91%E7%BA%A2%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/546334/%E5%B9%BB%E5%9F%9F%E2%80%94%E8%87%AA%E5%8A%A9%E9%A2%86%E5%8F%96%E7%8E%B0%E9%87%91%E7%BA%A2%E5%8C%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        TARGET_URL: "https://hyzy.0189700.xyz/forum.php?mod=viewthread&tid=7232",
        REPLACE_URL: "https://link3.cc/rwcc",
        BUTTON_STYLE: {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: "9999",
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
        },
        CHECK_INTERVAL: 60000
    };

    GM_addStyle(`
        .manual-check-btn {
            transition: all 0.2s ease;
        }
        .manual-check-btn:hover {
            background-color: #45a049 !important;
        }
        .manual-check-btn:active {
            transform: scale(0.98);
        }
        .manual-check-btn.loading {
            background-color: #2196F3 !important;
        }
        .manual-check-btn.error {
            background-color: #f44336 !important;
        }
    `);

    function isTodayProcessed() {
        const today = new Date().toDateString();
        return GM_getValue('lastProcessDate') === today;
    }

    function markTodayProcessed() {
        const today = new Date().toDateString();
        GM_setValue('lastProcessDate', today);
    }

    function parsePostContent(html) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const posts = doc.querySelectorAll('.t_f');
            return posts.length > 0 ? posts[posts.length-1].textContent.trim() : null;
        } catch (e) {
            console.error("出错了（ﾉ´д｀）别找我，我也不会处理呢:", e);
            return null;
        }
    }

    async function fetchPostContent() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: CONFIG.TARGET_URL,
                timeout: 10000,
                onload: function(response) {
                    if (response.status === 200) {
                        const content = parsePostContent(response.responseText);
                        content ? resolve(content) : reject(new Error("没找到"));
                    } else {
                        reject(new Error(`HTTP错误: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`请求失败，呃，哈哈哈: ${error.statusText}`));
                },
                ontimeout: function() {
                    reject(new Error("请求超时，试试挂梯子"));
                }
            });
        });
    }

    function openTargetLink() {
        try {
            // 方法1: 使用GM_openInTab（推荐）
            if (typeof GM_openInTab === 'function') {
                GM_openInTab(CONFIG.REPLACE_URL, { active: true });
                return true;
            }
            
            // 方法2: 使用window.open
            const newWindow = window.open(CONFIG.REPLACE_URL, '_blank');
            if (!newWindow || newWindow.closed) {
                throw new Error("弹出窗口被阻止");
            }
            return true;
            
        } catch (e) {
            console.error("打开链接失败:", e);
            GM_notification({
                text: `无法自动打开链接，请手动访问: ${CONFIG.REPLACE_URL}`,
                title: "论坛回复检测 - 操作需要",
                timeout: 8000
            });
            return false;
        }
    }

    async function checkReply(isManual = false) {
        const btn = document.querySelector('.manual-check-btn');
        if (btn) {
            btn.classList.add('loading');
            btn.textContent = '检测中...';
        }

        try {
            if (!isManual && isTodayProcessed()) {
                console.log("今日已检测过");
                return;
            }

            const lastReply = await fetchPostContent();
            if (!lastReply) throw new Error("未获取到有效回复");

            console.log("检测到回复内容:", lastReply);
            
            if (lastReply === "1") {
                if (!openTargetLink()) {
                    throw new Error("链接打开失败");
                }
                GM_notification({
                    text: "已执行1的操作并打开链接",
                    title: "检测结果",
                    timeout: 5000
                });
            } else {
                GM_notification({
                    text: `当前回复内容: ${lastReply}`,
                    title: "检测结果",
                    timeout: 5000
                });
            }

            if (!isManual) markTodayProcessed();
            
        } catch (error) {
            console.error("检测出错:", error);
            GM_notification({
                text: `错误: ${error.message}`,
                title: "检测失败",
                timeout: 6000,
                highlight: true
            });
            if (btn) btn.classList.add('error');
        } finally {
            if (btn) {
                btn.classList.remove('loading', 'error');
                btn.textContent = '检测是否有红包';
            }
        }
    }

    function createManualButton() {
        if (document.querySelector('.manual-check-btn')) return;
        
        const btn = document.createElement('button');
        btn.className = 'manual-check-btn';
        btn.textContent = '检测红包';
        Object.assign(btn.style, CONFIG.BUTTON_STYLE);
        btn.addEventListener('click', () => checkReply(true));
        document.body.appendChild(btn);
    }

    function startAutoCheck() {
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 12 && now.getMinutes() === 0) {
                checkReply();
            }
        }, CONFIG.CHECK_INTERVAL);
    }

    function init() {
        createManualButton();
        startAutoCheck();
        console.log("脚本已初始化，目标URL:", CONFIG.TARGET_URL);
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();