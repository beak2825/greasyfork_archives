// ==UserScript==
// @name         柠檬文采学堂线上考试工具
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  柠檬文采学堂线上考试辅助工具
// @author       Lizhihang
// @match        https://jw.wencaischool.net/ahnydx/console/
// @icon         https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541692/%E6%9F%A0%E6%AA%AC%E6%96%87%E9%87%87%E5%AD%A6%E5%A0%82%E7%BA%BF%E4%B8%8A%E8%80%83%E8%AF%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/541692/%E6%9F%A0%E6%AA%AC%E6%96%87%E9%87%87%E5%AD%A6%E5%A0%82%E7%BA%BF%E4%B8%8A%E8%80%83%E8%AF%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面检测
    if (!location.href.includes('/openlearning/separation/exam/index.html')) return;

    console.log('考试页面监听已启动');

    // 创建弹窗容器
    const createPopup = () => {
        const popup = document.createElement('div');
        popup.id = 'examDataPopup';
        popup.style = `
            position: fixed;
            bottom: 0px;
            right: 50px;
            width: 500px;
            height: 500px;
            background-color: white;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 9999;
            overflow: auto;
            padding: 10px;
        `;

        // 弹窗标题和关闭按钮
        popup.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0;font-size: 10px;">试题数据</h3>
                <button id="closePopup" style="cursor: pointer;font-size: 10px;">关闭</button>
            </div>
            <div id="popupContent"></div>
        `;

        document.body.appendChild(popup);

        // 关闭按钮事件
        popup.querySelector('#closePopup').addEventListener('click', () => {
            popup.style.display = 'none';
        });

        return popup;
    };

    // 显示弹窗
    const showPopup = () => {
        const popup = document.getElementById('examDataPopup');
        if (popup) {
            popup.style.display = 'block';
        }
    };

    // 在弹窗中显示数据
    const displayDataInPopup = (data) => {
        const popupContent = document.getElementById('popupContent');
        if (!popupContent) return;

        // 清空之前的内容
        popupContent.innerHTML = '';

        // 检查数据结构是否符合预期
        if (!data || !data.itemInfoList) {
            popupContent.innerHTML = '<p>未获取到试题数据或数据结构不符</p>';
            return;
        }

        // 创建表格展示数据
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.innerHTML = `
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;font-size: 10px;">题号</th>
                    <th style="border: 1px solid #ddd; padding: 8px;font-size: 10px;">题干</th>
                    <th style="border: 1px solid #ddd; padding: 8px;font-size: 10px;">答案</th>
                </tr>
            </thead>
            <tbody id="popupTableBody"></tbody>
        `;
        popupContent.appendChild(table);

        const tbody = document.getElementById('popupTableBody');
        if (!tbody) return;

        // 遍历试题数据
        const questionData = data.itemInfoList;
        if (Array.isArray(questionData)) {
            questionData.forEach((item, index) => {
                const row = document.createElement('tr');

                // 安全处理题干内容
                const itemName = item.itemName ? item.itemName.replace(/<[^>]*>/g, '') : '无题干';

                // 提取答案选项
                let answers = '无答案';
                if (item.itemAnswer && Array.isArray(item.itemAnswer)) {
                    answers = item.itemAnswer.map(a => {
                        return a.optionContent ? a.optionContent : `选项${a.optionSeq}`
                    }).join(', ');
                }

                row.innerHTML = `
                    <td style="border: 1px solid #ddd; padding: 8px;font-size: 10px;">${index + 1}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;font-size: 10px;">${itemName}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;font-size: 10px;">${answers}</td>
                `;
                tbody.appendChild(row);
            });
        }

        // 显示弹窗
        showPopup();
    };

    // 从common.js中提取的解密函数
    function decryptData(encryptedData) {
        if (!encryptedData) return null;

        try {
            // 检查是否是JSON格式
            let responseJson = typeof encryptedData === 'string' ? JSON.parse(encryptedData) : encryptedData;

            // 如果存在data字段且是字符串，尝试解密
            if (responseJson && typeof responseJson.data === 'string') {
                const decryptedStr = decrypt(responseJson.data);
                if (decryptedStr) {
                    return JSON.parse(decryptedStr);
                }
            }

            // 如果data字段已经是对象，直接返回
            if (responseJson && typeof responseJson.data === 'object') {
                return responseJson;
            }

            // 尝试直接解密整个响应
            const decryptedStr = decrypt(encryptedData);
            return decryptedStr ? JSON.parse(decryptedStr) : responseJson;
        } catch (e) {
            console.error('解密过程中发生错误:', e);
            return null;
        }
    }

    // 实际的AES解密函数
    function decrypt(cipherText) {
        if (!cipherText) return null;

        try {
            // 使用提供的WordArray初始化key和iv
            const key = CryptoJS.lib.WordArray.create([892417589, 858928441, 875967541, 959853362], 16);
            const iv = CryptoJS.lib.WordArray.create([943076661, 909259829, 875772213, 959591219], 16);

            // 执行AES解密
            const decryptedBytes = CryptoJS.AES.decrypt(cipherText, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            // 按照原网站方式处理解密后的数据
            const latin1String = decryptedBytes.toString(CryptoJS.enc.Latin1);
            return decodeURIComponent(escape(latin1String));
        } catch (error) {
            console.error('解密过程中发生错误:', error);
            return null;
        }
    }

    // 确保CryptoJS可用（如果未加载则动态加载）
    if (typeof CryptoJS === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
        script.integrity = 'sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        script.onload = () => {
            console.log('CryptoJS 加载完成，启动监听');
            initXHRInterceptor();
        };
        script.onerror = () => console.error('CryptoJS 加载失败');
    } else {
        console.log('CryptoJS 已加载，启动监听');
        initXHRInterceptor();
    }
    // 初始化XHR拦截器
    function initXHRInterceptor() {
        // 拦截XHR请求
        const originalXHR = window.XMLHttpRequest;
        const originalOpen = originalXHR.prototype.open;
        const originalSend = originalXHR.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._method = method;
            this._url = url;
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(data) {
            this._requestData = data;

            const self = this;
            const handleResponse = () => {
                try {
                    // 只处理特定接口
                    const targetUrl = '/examModular_exam_item.action';
                    const targetParam = 'getItemList';

                    if (self._url.includes(targetUrl) &&
                        new URL(self._url, location.origin).searchParams.get('req') === targetParam) {

                        console.log('捕获试题数据接口请求');

                        // 获取响应数据
                        const responseText = self.responseText;
                        let decryptedData = null;

                        // 尝试解析为JSON
                        try {
                            decryptedData = decryptData(responseText);

                            if (!decryptedData) {
                                console.warn('解密失败，尝试直接解析响应');
                                decryptedData = JSON.parse(responseText);
                            }
                            console.log('解密后的试题数据:', decryptedData);

                            // 确保只创建一次弹窗
                            if (!document.getElementById('examDataPopup')) {
                                createPopup();
                            }
                            // 将数据展示在弹窗中
                            if (decryptedData) {
                                displayDataInPopup(decryptedData);
                            } else {
                                console.error('解密数据为空');
                            }
                        } catch (e) {
                            console.warn('响应不是JSON格式，尝试直接解密');
                            const decryptedStr = decrypt(responseText);
                            decryptedData = decryptedStr ? JSON.parse(decryptedStr) : responseText;
                        }
                    }
                } catch (e) {
                    console.error('处理响应时出错:', e);
                }
            };

            // 添加事件监听
            this.addEventListener('load', handleResponse);
            this.addEventListener('error', () => console.error('请求失败:', self._url));

            return originalSend.apply(this, arguments);
        };

        console.log('XMLHttpRequest 拦截器已激活');
    }
})();