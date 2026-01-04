// ==UserScript==
// @name 发布上线2
// @namespace https://www.qidian.qq.com
// @version 1.0
// @description 企点机器人发布上线
// @author 吴恒宇
// @match *://*.qidian.qq.com/zhiku/*
// @grant GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496635/%E5%8F%91%E5%B8%83%E4%B8%8A%E7%BA%BF2.user.js
// @updateURL https://update.greasyfork.org/scripts/496635/%E5%8F%91%E5%B8%83%E4%B8%8A%E7%BA%BF2.meta.js
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
                urlSelect.className = 'url-select'; // 添加一个唯一的 CSS 类
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

//                 urlSelect.addEventListener('select', function() {
//                     localStorage.setItem('urlSelect', option2.value);
//                 });
               //container.appendChild(urlSelect);
                shadowRoot.appendChild(urlSelect);

                //const cookieInput = document.createElement('input');
                //cookieInput.placeholder = '请求Cookie';
                //cookieInput.style.marginBottom = '10px';
                //container.appendChild(cookieInput);

                // 请求AppKey
//                 const keyInput = document.createElement('input');
//                 keyInput.placeholder = 'AppKey';
//                 keyInput.style.marginBottom = '10px';
//                 const savedKeyValue = localStorage.getItem('appKey');
//                 if (savedKeyValue) {
//                     keyInput.value = savedKeyValue;
//                 }
//                 keyInput.addEventListener('input', function() {
//                     localStorage.setItem('appKey', keyInput.value);
//                 });
//                 shadowRoot.appendChild(keyInput);

                const appKeySelect = document.createElement('select');

				appKeySelect.className = 'appkey-select'; // 添加一个唯一的 CSS 类
				appKeySelect.id = 'robot-selection';
				appKeySelect.style.marginBottom = '10px';
//                 const savedKeyValue = localStorage.getItem('appKeySelect');
//                 if (savedKeyValue) {
//                     appKeySelect.value = savedKeyValue;
//                 }
//                 appKeySelect.addEventListener('appKeySelect', function() {
//                     localStorage.setItem('appKeySelect', appKeySelect.value);
//                 });
//                 const savedKeyValue = localStorage.getItem('appKeySelect');
//                 if (savedKeyValue && appKeySelect.querySelector(`option[value="${savedKeyValue}"]`)) {
//                     // 如果savedKeyValue存在且是一个有效的option值，则设置它
//                     appKeySelect.value = savedKeyValue;
//                 }

//                 // 监听change事件而不是appKeySelect
//                 appKeySelect.addEventListener('change', function() {
//                     localStorage.setItem('appKeySelect', this.value); // 使用this代替appKeySelect
//                 });
				shadowRoot.appendChild(appKeySelect);

				function saveSelectedOption() {
				var selectedValue = document.getElementById('robot-selection').value;
				//GM_setValue('selectedRobotName', selectedValue);
				}
				function createDropdown(robots) {
                    var select = document.createElement('select');
                    select.id = 'robot-selection';
                    select.onchange = saveSelectedOption;

                    robots.forEach(function(robot) {
                        var option = document.createElement('option');
                        option.text = robot.name;
                        option.value = robot.cAppKey;
                        appKeySelect.appendChild(option);
				});

				document.body.insertBefore(select, document.body.firstChild);

				// 设置选中项为上次用户选择的值或默认选项
				//select.value = GM_getValue('selectedRobotName', '');
				}
				function fetchRobotInfo() {
                    const testUrl = 'https://testgateway.qidian.qq.com/v1/robotConf/robot/list?kfext=0&filter=sku.frobotactiveflg%20in%20%5B0,1%5D%20and%20frobotchatgpttype%20eq%200%20and%20frobotisssc%20eq%200';
                    const onlineUrl = 'https://gateway.qidian.qq.com/v1/robotConf/robot/list?kfext=0&filter=sku.frobotactiveflg%20in%20%5B0,1%5D%20and%20frobotchatgpttype%20eq%200%20and%20frobotisssc%20eq%200';
                    const selectUrlElement = shadowRoot.querySelector('#url-select');
                    // 获取选中元素的值
                    var selectedUrlOptionValue = selectUrlElement.options[selectUrlElement.selectedIndex].value;
                    var currentUrl;
                    if (selectedUrlOptionValue == option1.value){
                        currentUrl = testUrl;
                    }else{
                        currentUrl = onlineUrl;
                    }
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: currentUrl,
                        onload: function(response) {
                            var jsonResponse = JSON.parse(response.responseText);
                            var robots = jsonResponse.data.robotInfo;
                            //GM_setValue('robotsData', JSON.stringify(robots)); // 保存所有数据到本地存储
                            createDropdown(robots);
                        }});
				}

                // 监听<select>元素的change事件
                shadowRoot.querySelector('#url-select').addEventListener('change', function() {
                    fetchRobotInfo(); // 当选项改变时，重新获取机器人信息
                });

                window.addEventListener('load', function() {
                    fetchRobotInfo();
                }, false);

//                 const savedKeyValue = localStorage.getItem('appKeySelect');
//                 const selectElement2 = shadowRoot.querySelector('#robot-selection');
//                 const selectedOptionValue2 = selectElement2.options[selectElement2.selectedIndex].value;
//                 if (savedKeyValue && shadowRoot.querySelector(`option[value="${savedKeyValue}"]`)) {
//                     // 如果savedKeyValue存在且是一个有效的option值，则设置它
//                     selectedOptionValue2 = savedKeyValue;
//                 }
//                 // 监听change事件而不是appKeySelect
//                 shadowRoot.querySelector('#robot-selection').addEventListener('change', function() {
//                     localStorage.setItem('appKeySelect', selectedOptionValue2);
//                     console.log(selectedOptionValue2);
//                 });

                const appKeySelectValue = localStorage.getItem('appKeySelect');
                if (appKeySelectValue) {
                    appKeySelect.value = appKeySelectValue;
                }
                appKeySelect.addEventListener('input', function() {
                    localStorage.setItem('appKeySelectValue', appKeySelect.value);
                });

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
                    //const appKey = keyInput.value || '1775124805741630738';
                    // 获取选中的 select 元素
                    var selectElement = shadowRoot.querySelector('#robot-selection');
                    // 获取选中元素的值
                    var selectedOptionValue = selectElement.options[selectElement.selectedIndex].value;
                    const appKey = selectedOptionValue

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
    //console.log(document.cookie);
}})();