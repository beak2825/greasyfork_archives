// ==UserScript==
// @name         国家中小学智慧教育平台快速学习（2025暑期老师培训api版）
// @namespace    http://tampermonkey.net/
// @author       桥风
// @license      MIT
// @version      1.1
// @description  手动一键完成国家中小学智慧教育平台课程进度
// @match        *://basic.smartedu.cn/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @require      https://fastly.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @require      https://update.greasyfork.org/scripts/546379/1644788/ajaxHooker123.js
// @downloadURL https://update.greasyfork.org/scripts/546380/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0%EF%BC%882025%E6%9A%91%E6%9C%9F%E8%80%81%E5%B8%88%E5%9F%B9%E8%AE%ADapi%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546380/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0%EF%BC%882025%E6%9A%91%E6%9C%9F%E8%80%81%E5%B8%88%E5%9F%B9%E8%AE%ADapi%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let fullDatas = null;

    // 自动捕获fulls.json
    ajaxHooker.filter([{ url: 'fulls.json' }]);
    ajaxHooker.hook(request => {
        if (request.url.includes('fulls.json')) {
            request.response = res => {
                try {
                    fullDatas = JSON.parse(res.responseText);
                    console.log("✅ 捕获到 fulls.json 数据:", fullDatas);
                } catch (e) {
                    console.error("解析fulls.json失败:", e);
                }
            };
        }
    });

    // 获取登录 token 信息
    function getDynamicToken() {
        const pattern = /^ND_UC_AUTH-([0-9a-fA-F-]+)&ncet-xedu&token$/;
        for (let key in localStorage) {
            if (pattern.test(key)) {
                return {
                    appId: key.match(pattern)[1],
                    token: JSON.parse(JSON.parse(localStorage.getItem(key)).value)
                };
            }
        }
        throw Error("无法获取 Token，请确认已登录平台");
    }

    // 生成 MAC 认证头
    function macAuth(url, method) {
        const t = getDynamicToken().token;
        const nonce = Date.now() + ':' + Math.random().toString(36).slice(2, 10);
        const path = new URL(url);
        const raw = `${nonce}\n${method}\n${path.pathname}\n${path.hostname}\n`;
        const mac = CryptoJS.HmacSHA256(raw, t.mac_key).toString(CryptoJS.enc.Base64);
        return `MAC id="${t.access_token}",nonce="${nonce}",mac="${mac}"`;
    }

    // 调用接口设置课程进度
    function setProgress(resourceId, duration) {
        const info = getDynamicToken();
        const url = `https://x-study-record-api.ykt.eduyun.cn/v1/resource_learning_positions/${resourceId}/${info.token.user_id}`;
        GM_xmlhttpRequest({
            url,
            method: 'PUT',
            headers: {
                "content-type": "application/json",
                "authorization": macAuth(url, 'PUT'),
                "sdp-app-id": info.appId
            },
            data: JSON.stringify({ position: duration - 3 }),
            onload: res => {
                if (res.status === 200) {
                    console.log(`✅ ${resourceId} 学习完成`);
                } else {
                    console.warn(`❌ ${resourceId} 失败:`, res.responseText);
                }
            },
            onerror: err => console.error(`请求错误: ${err}`)
        });
    }

    // 从 fulls.json 中提取课程资源 ID
    function getAllResources(fullData) {
        const result = [];
        function traverse(node) {
            if (node.node_type === 'catalog' && node.child_nodes) {
                node.child_nodes.forEach(traverse);
            } else if (node.node_type === 'activity') {
                const res = node.relations?.activity?.activity_resources || [];
                res.forEach(r => {
                    result.push({
                        id: r.resource_id,
                        time: r.study_time
                    });
                });
            }
        }
        fullData.nodes.forEach(traverse);
        return result;
    }

    // 主程序
    function main() {
        if (!fullDatas) {
            alert("⚠️ 还没有捕获到 fulls.json 数据，请先进入课程目录页面等待加载完成再运行脚本。");
            return;
        }

        const resources = getAllResources(fullDatas);
        if (resources.length === 0) {
            alert("未获取到课程资源 ID，请确认在课程页面运行");
            return;
        }

        if (!confirm(`共找到 ${resources.length} 个课程，是否开始快速学习？`)) {
            return;
        }

        resources.forEach(r => setProgress(r.id, r.time));
        alert("执行完成，详情请查看控制台日志 (F12)");
    }

    // 创建按钮
    function createButton() {
        const btn = document.createElement('div');
        btn.innerText = "🚀 快速学习";
        btn.style.cssText = `
            position: fixed;
            left: 20px;
            top: 200px;
            padding: 10px 18px;
            background: #ff4d4f;
            color: white;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 999999;
        `;
        btn.onclick = main;
        document.body.appendChild(btn);
    }

    // 等待页面加载完成后插入按钮
    window.addEventListener('load', () => {
        setTimeout(createButton, 1500);
    });

})();
