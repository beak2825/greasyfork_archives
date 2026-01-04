// ==UserScript==
// @name         发布上线
// @namespace    https://www.qidian.qq.com
// @version      0.1
// @description  企点机器人发布上线
// @author       吴恒宇
// @match        *://*.qidian.qq.com/*
// @grant        GM_xmlhttpRequest
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/496193/%E5%8F%91%E5%B8%83%E4%B8%8A%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/496193/%E5%8F%91%E5%B8%83%E4%B8%8A%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 只在顶层窗口执行
    if (window.top === window.self) {
        function createUIElements() {
            // 检查按钮是否已存在
            const existingButton = document.querySelector('button');
            const existingCookieInput = document.querySelector('input[placeholder="请求Cookie"]');
            const existingKeyInput = document.querySelector('input[placeholder="key"]');
            const existingUrlSelect = document.querySelector('select[id="url-select"]');

            if (!existingButton && !existingCookieInput && !existingKeyInput && !existingUrlSelect) {

                // 创建容器元素
                const container = document.createElement('div');
                container.style.position = 'fixed';
                container.style.bottom = '20px';
                container.style.right = '20px';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.alignItems = 'flex-end';
                document.body.appendChild(container);

                // 创建 Shadow Root
                const shadowRoot = container.attachShadow({ mode: 'open' });

                // 添加按钮
                const button = document.createElement('button');
                button.textContent = '点我发布上线';
                button.style.marginBottom = '10px';
                shadowRoot.appendChild(button);

                // 添加请求地址选择框
                const urlSelect = document.createElement('select');
                urlSelect.className = 'userscript-select'; // 添加一个唯一的 CSS 类
                urlSelect.id = 'url-select';
                urlSelect.style.marginBottom = '10px';
                const option1 = document.createElement('option');
                option1.value = 'https://testgateway.qidian.qq.com/icr/product/v1/release/records/post';
                option1.text = 'set0测试环境';
                const option2 = document.createElement('option');
                option2.value = 'https://gateway.qidian.qq.com/icr/product/v1/release/records/post';
                option2.text = '灰度&线上环境';
                urlSelect.add(option1);
                urlSelect.add(option2);
               //container.appendChild(urlSelect);
                shadowRoot.appendChild(urlSelect);

                //const cookieInput = document.createElement('input');
                //cookieInput.placeholder = '请求Cookie';
                //cookieInput.style.marginBottom = '10px';
                //container.appendChild(cookieInput);

                // 请求AppKey
                const keyInput = document.createElement('input');
                keyInput.placeholder = 'AppKey';
                keyInput.style.marginBottom = '10px';
                const savedKeyValue = localStorage.getItem('appKey');
                if (savedKeyValue) {
                    keyInput.value = savedKeyValue;
                }
                keyInput.addEventListener('input', function() {
                    localStorage.setItem('appKey', keyInput.value);
                });
                shadowRoot.appendChild(keyInput);

                // 在页面头部添加样式
                //const style = document.createElement('style');
                //style.textContent = `.userscript-select {opacity: 50 !important;filter: none !important;}`;

                // 使容器可拖动
                container.style.cursor = 'move';
                let isDragging = false;
                let currentX;
                let currentY;
                let initialX;
                let initialY;
                let xOffset = 0;
                let yOffset = 0;

                container.addEventListener('mousedown', dragStart);
                container.addEventListener('mouseup', dragEnd);
                container.addEventListener('mousemove', drag);

                function dragStart(e) {
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                    isDragging = true;
                }

                function dragEnd(e) {
                    initialX = currentX;
                    initialY = currentY;
                    isDragging = false;
                }

                function drag(e) {
                    if (isDragging) {
                        e.preventDefault();
                        currentX = e.clientX - initialX;
                        currentY = e.clientY - initialY;
                        xOffset = currentX;
                        yOffset = currentY;
                        setTranslate(currentX, currentY, container);
                    }
                }

                function setTranslate(xPos, yPos, el) {
                    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
                }

                // Add event listener to the button
                button.addEventListener('click', () => {
                    const url = urlSelect.value;
                    //const cookie = cookieInput.value || '1111';
                    const cookie = document.cookie;
                    const appKey = keyInput.value || '1775124805741630738';

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: url,
                        headers: {
                            'authority': 'gateway.qidian.qq.com',
                            'accept': 'application/json, text/plain, */*',
                            'accept-language': 'zh-CN,zh;q=0.9',
                            'cache-control': 'no-cache',
                            'content-type': 'application/json',
                            'cookie': cookie,
                            'dnt': '1',
                            'origin': 'https://xiaowei.qidian.qq.com/',
                            'pragma': 'no-cache',
                            'referer': 'https://xiaowei.qidian.qq.com/',
                            'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
                            'sec-ch-ua-mobile': '?0',
                            'sec-ch-ua-platform': '"Windows"',
                            'sec-fetch-dest': 'empty',
                            'sec-fetch-mode': 'cors',
                            'sec-fetch-site': 'same-site',
                            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                            'x-requested-with': 'XMLHttpRequest',
                            'x-timestamp': '1716430044',
                            'x-xsrf-token': 'ce205a275728b43ac2d1fa605728ed5e59c67dbd',
                            'yxw-accounttype': 'qidian'
                        },
                        data: `{"Metadata":{"AppKey":"${appKey}"},"Payload":{"UserID":"-","T":1716430044356,"Remark":"-"}}`,
                        binary: true,
                        onload: function(response) {
                            if (response.status >= 200 && response.status < 400) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    // Display the response on the page
                                    const responseDiv = document.createElement('pre');
                                    responseDiv.textContent = JSON.stringify(data, null, 2);
                                    //document.body.appendChild(responseDiv);
                                    if (data.Response.Metadata.Code === 101500 && data.Response.Metadata.Message === "数据未修改，不需要发布！") {
                                    //if (data.Response.Metadata.Code === 101500) {
                                        alert("数据未修改，不需要发布！");
                                    } else if (data.Response.Metadata.Code === 200 && data.Response.Metadata.Message === "") {
                                        alert("发布成功");
                                    } else {
                                        alert("发布失败,请查看结果");
                                    }
                                } catch (error) {
                                    console.error('Error parsing JSON response:', error);
                                }
                            } else {
                                console.error('API request failed with status:', response.status);
                            }
                        },
                        onerror: function(error) {
                            console.error('API request failed:', error);
                        }
                    });
                });
            }
            else{
            // UI元素已存在,不需要重新创建
                return;
            }
        }

        // 在页面完全加载后执行一次
        //window.addEventListener('load', createUIElements);
        createUIElements();
    console.log(document.cookie);
}})();