// ==UserScript==
// @name        Steam好友管理
// @version     2025.10.11.1
// @description 自动接受Steam好友申请
// @include     https://steamcommunity.com/profiles/*/friends/pending*
// @grant       none
// @note        更新于 2025年10月11日
// @author      怀沙2049
// @license     GNU GPLv3
// @run-at      document-end
// @namespace   https://greasyfork.org/zh-CN/users/1192640
// @downloadURL https://update.greasyfork.org/scripts/507640/Steam%E5%A5%BD%E5%8F%8B%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/507640/Steam%E5%A5%BD%E5%8F%8B%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置参数
    const REFRESH_INTERVAL = 300000; // 检查间隔(毫秒) - 5分钟
    const PROCESS_DELAY = 3000; // 处理每个用户的间隔时间
    // 需要排除的用户ID列表
    const EXCLUDED_IDS = new Set([
        '76561199202030242',
        '76561199215008545'
        // 如果需要添加更多ID，按照上面的格式继续添加即可
        // '另一个ID',
        // '再一个ID'
    ]);
    
    // 日志函数
    function log(message) {
        console.log(`[Steam好友管理] ${message}`);
    }

    // 获取好友申请信息
    function getFriendRequests() {
        const requestRows = document.querySelectorAll('.invite_row');
        const requests = [];
        
        requestRows.forEach(row => {
            // 获取用户ID和邀请ID
            const userId = row.dataset.steamid;
            const inviteId = row.id; // 例如: invite_475514969
            
            // 排除特定ID
            if (userId && !EXCLUDED_IDS.has(userId)) {
                requests.push({
                    row: row,
                    userId: userId,
                    inviteId: inviteId
                });
            }
        });
        
        return requests;
    }

    // 接受好友申请
    function acceptFriendRequest(request, index, total) {
        log(`正在处理第 ${index + 1}/${total} 个好友申请 (用户ID: ${request.userId})`);
        
        try {
            // 构造接受好友申请的函数调用
            // ApplyFriendAction('accept', userId, inviteSelector, UpdatePendingList)
            const acceptScript = `ApplyFriendAction('accept', '${request.userId}', '#${request.inviteId}', UpdatePendingList)`;
            
            // 执行接受操作
            eval(acceptScript);
            log(`已接受用户 ${request.userId} 的好友申请`);
        } catch (error) {
            log(`接受用户 ${request.userId} 的好友申请时出错: ${error.message}`);
        }
    }

    // 处理所有好友申请
    function processAllFriendRequests() {
        log("开始检查好友申请...");
        
        // 获取所有好友申请
        const friendRequests = getFriendRequests();
        
        if (friendRequests.length === 0) {
            log("未找到需要处理的好友申请");
            return;
        }
        
        log(`找到 ${friendRequests.length} 个好友申请，开始处理...`);
        
        // 依次处理每个好友申请
        friendRequests.forEach((request, index) => {
            setTimeout(() => {
                acceptFriendRequest(request, index, friendRequests.length);
            }, index * PROCESS_DELAY); // 间隔处理每个请求
        });
        
        // 处理完成后刷新页面
        setTimeout(() => {
            log("所有好友申请处理完毕，即将刷新页面");
            location.reload();
        }, friendRequests.length * PROCESS_DELAY + 3000);
    }

    // 主函数
    function main() {
        log("Steam好友管理脚本已启动");
        log("当前页面: " + window.location.href);
        
        // 立即执行一次
        setTimeout(processAllFriendRequests, 5000);
        
        // 定期执行
        setInterval(processAllFriendRequests, REFRESH_INTERVAL);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();