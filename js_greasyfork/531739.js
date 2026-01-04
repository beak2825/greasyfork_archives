// ==UserScript==
// @name         微博评论清空专家
// @namespace    https://greasyfork.org/zh-CN/users/1452603-moreanx
// @version      1.0.1
// @description  彻底清空微博所有个人评论（含历史记录）
// @author       MoreanX
// @match        https://weibo.com/*
// @icon         https://www.google.com/s2/favicons?domain=weibo.com
// @license      MIT
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/1.11.3/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531739/%E5%BE%AE%E5%8D%9A%E8%AF%84%E8%AE%BA%E6%B8%85%E7%A9%BA%E4%B8%93%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/531739/%E5%BE%AE%E5%8D%9A%E8%AF%84%E8%AE%BA%E6%B8%85%E7%A9%BA%E4%B8%93%E5%AE%B6.meta.js
// ==/UserScript==

; (function () {
    'use strict';

    const jq = window.jQuery;
    const HELPER_NAME = '微博评论清空专家';
    const TOKEN = jq.cookie('XSRF-TOKEN');
    const WB_CONFIG = window.$CONFIG;
    const UID = WB_CONFIG.uid;

    // 核心功能配置
    const BATCH_SIZE = 20;      // 每页处理数量
    const DELAY_RANGE = [1000, 3000]; // 随机延迟范围
    const MAX_RETRIES = 3;      // 最大重试次数

    // 状态管理
    let deleteQueue = [];
    let processing = false;
    let stopSignal = false;

    // 初始化入口
    (function init() {
        checkLoginStatus();
        createControlPanel();
    })();

    // 检查登录状态
    function checkLoginStatus() {
        if (!UID) {
            showError('请先登录微博账号');
            return false;
        }
        return true;
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = $('<div class="weibo-clean-panel"></div>')
            .css({
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: '#fff',
                border: '1px solid #ddd',
                padding: '15px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 99999
            });

        const controls = [
            { text: '开始清空', action: startCleaning },
            { text: '暂停操作', action: pauseProcessing },
            { text: '查看日志', action: showLog }
        ];

        controls.forEach(control => {
            panel.append($('<button></button>')
                .text(control.text)
                .css({
                    padding: '8px 16px',
                    margin: '5px 0',
                    background: '#f0f0f0',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                })
                .click(control.action));
        });

        $('body').append(panel);
    }

    // 开始清空流程
    async function startCleaning() {
        if (processing) return;
        processing = true;
        stopSignal = false;
        
        try {
            await loadAllComments();
            processDeleteQueue();
        } catch (error) {
            console.error('清空失败:', error);
        } finally {
            processing = false;
        }
    }

    // 加载所有评论
    async function loadAllComments(page = 1) {
        return new Promise((resolve, reject) => {
            jq.ajax({
                url: `/aj/mblog/comments?uid=${UID}&page=${page}`,
                type: 'GET',
                dataType: 'jsonp',
                success: (res) => {
                    if (res.comments && res.comments.length) {
                        deleteQueue = deleteQueue.concat(res.comments);
                        console.log(`加载第${page}页，共${res.comments.length}条`);
                        setTimeout(() => resolve(loadAllComments(page + 1)), 1000);
                    } else {
                        resolve();
                    }
                },
                error: (xhr) => {
                    if (xhr.status === 403) {
                        showError('触发安全验证，请重新登录');
                    } else {
                        reject(new Error(`加载失败: ${xhr.statusText}`));
                    }
                }
            });
        });
    }

    // 处理删除队列
    async function processDeleteQueue() {
        while (deleteQueue.length > 0 && !stopSignal) {
            const batch = deleteQueue.splice(0, BATCH_SIZE);
            await processBatch(batch);
            await sleep(getRandomDelay());
        }
    }

    // 批量处理评论
    async function processBatch(batch) {
        const promises = batch.map(comment => 
            deleteComment(comment.id)
                .catch(error => {
                    console.error(`删除失败 ${comment.id}:`, error);
                    return retryDelete(comment);
                })
        );

        await Promise.all(promises);
    }

    // 删除单条评论
    function deleteComment(cid) {
        return new Promise((resolve, reject) => {
            jq.post('/aj/comments/destroy', {
                _t: 0,
                cid: cid,
                _ajax: 1,
                XSRF_TOKEN: TOKEN
            }, (res) => {
                if (res.code === 100000) {
                    console.log(`成功删除评论 ${cid}`);
                    resolve();
                } else {
                    reject(new Error(res.msg));
                }
            }).fail(reject);
        });
    }

    // 错误重试机制
    function retryDelete(comment, attempts = 0) {
        return new Promise((resolve, reject) => {
            if (attempts >= MAX_RETRIES) {
                console.error(`永久失败: ${comment.id}`);
                return reject();
            }
            
            setTimeout(() => {
                console.log(`第${attempts + 1}次重试删除 ${comment.id}`);
                deleteComment(comment.id)
                    .then(resolve)
                    .catch(() => retryDelete(comment, attempts + 1));
            }, 2000);
        });
    }

    // 辅助函数
    function getRandomDelay() {
        return DELAY_RANGE[0] + Math.random() * (DELAY_RANGE[1] - DELAY_RANGE[0]);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function showError(message) {
        alert(`错误: ${message}`);
    }

    function showLog() {
        console.log('显示操作日志...');
    }

    function pauseProcessing() {
        stopSignal = true;
        alert('操作已暂停');
    }

    // 安全验证拦截
    window.addEventListener('beforeunload', (e) => {
        if (processing) {
            e.preventDefault();
            e.returnValue = '';
            return '检测到未完成的清空操作，确定要离开吗？';
        }
    });

    // 版本校验
    (function checkVersion() {
        const localVersion = GM_info.script.version;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://raw.githubusercontent.com/your-repo/weibo-cleaner/main/version.txt",
            onload: (response) => {
                if (response.responseText !== localVersion) {
                    alert('发现新版本，请前往GreasyFork更新！');
                }
            }
        });
    })();
})();