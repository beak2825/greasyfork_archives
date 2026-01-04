// ==UserScript==
// @name         门户签到（仅用于兴趣开发测试，禁止传播）
// @namespace    dodo.dodo
// @version      0.1.1
// @description  访问门户/文档时，自动执行门户签到任务
// @author       dodo
// @match        https://portal.sheincorp.cn/*
// @match        https://arc.sheincorp.cn/*
// @connect      portal.sheincorp.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540813/%E9%97%A8%E6%88%B7%E7%AD%BE%E5%88%B0%EF%BC%88%E4%BB%85%E7%94%A8%E4%BA%8E%E5%85%B4%E8%B6%A3%E5%BC%80%E5%8F%91%E6%B5%8B%E8%AF%95%EF%BC%8C%E7%A6%81%E6%AD%A2%E4%BC%A0%E6%92%AD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540813/%E9%97%A8%E6%88%B7%E7%AD%BE%E5%88%B0%EF%BC%88%E4%BB%85%E7%94%A8%E4%BA%8E%E5%85%B4%E8%B6%A3%E5%BC%80%E5%8F%91%E6%B5%8B%E8%AF%95%EF%BC%8C%E7%A6%81%E6%AD%A2%E4%BC%A0%E6%92%AD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 逻辑
    const config = {
        checkInURL: 'https://portal.sheincorp.cn/be-scm/ggp/user/signin/checkInNow',
        method: 'POST',
        headers: {
            'accept': 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'cookie': document.cookie,
            'lang': 'CN',
            'scm-lang': 'CN'
        },
        data: '{}'
    };

    // UTC+8
    function getChinaDateString() {
        const now = new Date();
        const chinaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        return new Date(chinaTime.toUTCString()).toLocaleDateString('en-CA', { timeZone: 'UTC' }).replace(/-/g, '/');
    }

    async function main() {
        const today = getChinaDateString();
        const lastNotificationDate = await GM_getValue('lastNotificationDate', null);
        if (lastNotificationDate === today) {
            console.log('已弹出过通知');
            return;
        }

        const lastCheckIn = await GM_getValue('lastCheckInDate', null);
        if (lastCheckIn === today) {
            console.log('已签到。');
            notify(`✅ 今日已签到`, 'success');
            await GM_setValue('lastNotificationDate', today);
            return;
        }

        console.log(`${window.location.hostname} 执行自动签到`);
        setTimeout(() => sendCheckInRequest(today), 3000);
    }

    function sendCheckInRequest(today) {
        GM_xmlhttpRequest({
            method: config.method,
            url: config.checkInURL,
            headers: config.headers,
            data: config.data,
            timeout: 20000,
            onload: (response) => handleSuccess(response, today),
            onerror: (error) => handleError(error, '请求发送失败', today),
            ontimeout: (error) => handleError(error, '请求超时', today)
        });
    }

    function handleSuccess(response, today) {
        if (response.status >= 200 && response.status < 300) {
            try {
                const result = JSON.parse(response.responseText);
                console.log('收到服务器响应:', result);
                if (result.code == "0") {
                    notify(`✅ 签到成功: ${result.msg || '操作成功'}`, 'success');
                    GM_setValue('lastCheckInDate', today);
                } else if (result.msg && (result.msg.includes('已签到') || result.msg.toLowerCase().includes('signed in'))) {
                    notify(`✅ 今日已签到 (服务器确认)`, 'success');
                    GM_setValue('lastCheckInDate', today);
                } else {
                    notify(`⚠️ 签到异常: ${result.msg || JSON.stringify(result)}`, 'error');
                }
            } catch (e) {
                notify('❌ 签到失败: 无法解析服务器响应', 'error');
                console.error('[门户签到脚本] JSON解析失败:', e, response.responseText);
            }
        } else {
            notify(`❌ 签到失败: HTTP状态码 ${response.status}`, 'error');
            console.error('[门户签到脚本] HTTP请求失败:', response);
        }
        GM_setValue('lastNotificationDate', today);
    }

    function handleError(error, type, today) {
        notify(`❌ 签到${type}: 请检查网络或控制台日志`, 'error');
        console.error(`[门户签到脚本] ${type}:`, error);
        GM_setValue('lastNotificationDate', today);
    }

    // DIV 提示框
    function notify(text, type = 'info') {
        const noticeDiv = document.createElement('div');
        noticeDiv.textContent = text;
        Object.assign(noticeDiv.style, {
            position: 'fixed',
            top: '25px',
            right: '25px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: 'white',
            backgroundColor: '#2196F3',
            zIndex: '99999',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            fontFamily: '"Microsoft YaHei", sans-serif',
            fontSize: '15px',
            transition: 'opacity 0.4s, transform 0.4s ease-out',
            opacity: '0',
            transform: 'translateY(-20px)'
        });
        if (type === 'success') {
            noticeDiv.style.backgroundColor = '#4CAF50';
        } else if (type === 'error') {
            noticeDiv.style.backgroundColor = '#F44336';
        }
        document.body.appendChild(noticeDiv);
        setTimeout(() => {
            noticeDiv.style.opacity = '1';
            noticeDiv.style.transform = 'translateY(0)';
        }, 50);
        setTimeout(() => {
            noticeDiv.style.opacity = '0';
            noticeDiv.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                noticeDiv.remove();
            }, 400);
        }, 5000);
    }

    main();
})();