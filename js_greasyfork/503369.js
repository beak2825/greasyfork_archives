// ==UserScript==
// @name         【抖音电商】专业大屏直播数据提报
// @namespace    http://tampermonkey.net/
// @version      3.1.1
// @description  在抖音直播专业大屏中监听&拦截core_data&flow_distribution响应，把中框字段及feed流成交字段拿出来，推送数据到后端指定的端口，本脚本仅供内部使用，不可单独使用，需搭配后端模块使用.
// @author       https://www.feishu.cn/invitation/page/add_contact/?token=209i0e1c-8ccf-4f3f-a278-802921f7b86b&amp;unique_id=KBNm0ELJX1HntwF-dfkFfg==
// @match        https://compass.jinritemai.com/screen/live/shop?live_room_id=*
// @match        https://compass.jinritemai.com/screen/live/talent?live_room_id=*
// @match        https://compass.jinritemai.com/screen/live/shop-official?live_room_id=*
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/503369/%E3%80%90%E6%8A%96%E9%9F%B3%E7%94%B5%E5%95%86%E3%80%91%E4%B8%93%E4%B8%9A%E5%A4%A7%E5%B1%8F%E7%9B%B4%E6%92%AD%E6%95%B0%E6%8D%AE%E6%8F%90%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/503369/%E3%80%90%E6%8A%96%E9%9F%B3%E7%94%B5%E5%95%86%E3%80%91%E4%B8%93%E4%B8%9A%E5%A4%A7%E5%B1%8F%E7%9B%B4%E6%92%AD%E6%95%B0%E6%8D%AE%E6%8F%90%E6%8A%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取room_id
    const url = window.location.href;
    const roomId = extractRoomId(url);

    // 创建显示容器
    const container = document.createElement('div');
    container.id = 'valueContainer';
    container.style.position = 'fixed';
    container.style.top = '8%';
    container.style.right = '2%';
    container.style.width = '300px';
    container.style.maxHeight = '600px';
    container.style.overflow = 'hidden';
    container.style.backgroundColor = '#3b4259';
    container.style.color = 'white';
    container.style.border = '1px solid #292f3b';
    container.style.borderRadius = '5px';
    container.style.padding = '10px';
    container.style.zIndex = '9999';
    container.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
    container.style.transformOrigin = 'top right'; // 设置变换原点为右上角
    container.innerHTML = `
<div id="header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
    <h3 id="titleText" style="margin: 0; padding: 0; flex-grow: 1; color: #d3dbf9; text-align: center;">🍻🥳 当前战绩 🚀</h3>
    <button id="toggleButton" style="border: none; background: none; cursor: pointer; color: white; transition: transform 0.2s; font-size: 18px;">🧸</button>
</div>
<textarea style="width: 100%; height: 400px; margin-top: 10px; border-radius: 5px; color: black;">${JSON.stringify({ "room_id": roomId, "fields": { "千川消耗（元）": "", "优惠券": "" } }, null, 2)}</textarea>

<button id="pushButton" style="margin-top: 2%; margin-left: 3%; background-color: #f6efea; color: #2c3144; border-radius: 5px; transition: transform 0.2s;" disabled>推送数据</button>
<button id="configButton" style="margin-top: 2%; margin-left: 1%; background-color: #4CAF50; color: white; border-radius: 5px; transition: transform 0.2s;">配置字段</button>
<input type="text" id="presetValue" placeholder="输入消耗值后按回车" style="margin-left: 2%; margin-top: 2%; width: 50%; color: #2c3144; border-radius: 5px;">
<label id="presetLabel"></label>
<label style="margin-left: 2%; margin-top: 2%; color: white;">切字段</label>
<label class="switch" style="margin-top: 2%;">
  <input type="checkbox" id="inputToggle">
  <span class="slider round"></span>
</label>`;

    //这里转移注释取feed按钮的部分
    //<button id="clickButton" style="margin-top: 2%; margin-left: 2%; background-color: #007ba7; color: #c0c0c0; border-radius: 5px; transition: transform 0.2s;">取feed值</button>
    // 添加容器到页面
    document.body.appendChild(container);

    // 添加CSS样式
    const style = document.createElement('style');
    style.innerHTML = `
    .switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 20px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 15px;
      width: 15px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:checked + .slider:before {
      transform: translateX(15px);
    }`;
    document.head.appendChild(style);

    // 初始状态下, 容器是展开的
    let isCollapsed = false;

    // 设置 toggleButton 的变换原点为中心
    const toggleButton = document.getElementById('toggleButton');
    toggleButton.style.transformOrigin = 'center center';

    // 监听箭头按钮的点击事件, 控制容器的展开和收起
    toggleButton.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        const titleText = document.getElementById('titleText');
        const header = document.getElementById('header');
        if (isCollapsed) {
            container.style.width = '50px';
            container.style.height = '50px';
            container.style.borderRadius = '50%';
            toggleButton.style.fontSize = '18px';
            toggleButton.textContent = '🧸';
            titleText.style.display = 'none';
            header.style.justifyContent = 'center'; // 居中对齐
            container.style.transformOrigin = 'center'; // 设置变换原点为容器中心
        } else {
            container.style.width = '300px';
            container.style.height = 'auto';
            container.style.borderRadius = '5px';
            toggleButton.style.fontSize = '18px';
            toggleButton.textContent = '🧸';
            titleText.style.display = 'block';
            header.style.justifyContent = 'space-between'; // 恢复原始对齐
            container.style.transformOrigin = 'top right'; // 恢复变换原点为右上角
        }
    });

    // 按钮点击效果
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
    });

    // 监听推送按钮点击事件
    document.getElementById('pushButton').addEventListener('click', () => {
        const jsonData = JSON.parse(document.querySelector('textarea').value || '{}');
        showConfirmDialog(jsonData);
    });

    // 显示确认对话框
    function showConfirmDialog(jsonData) {
        const confirmDialog = document.createElement('div');
        confirmDialog.style.position = 'fixed';
        confirmDialog.style.top = '30%';
        confirmDialog.style.left = '50%';
        confirmDialog.style.transform = 'translate(-50%, -50%)';
        confirmDialog.style.backgroundColor = '#fff';
        confirmDialog.style.padding = '20px';
        confirmDialog.style.borderRadius = '10px';
        confirmDialog.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        confirmDialog.style.zIndex = '10000';
        confirmDialog.style.transition = 'transform 0.2s, opacity 0.2s';
        confirmDialog.style.opacity = '0';
        confirmDialog.style.transform = 'scale(0.95)';

        const confirmMessage = document.createElement('p');
        confirmMessage.textContent = '确认推送以下数据? 📌此操作不可撤销';
        confirmMessage.style.fontWeight = 'bold';
        confirmMessage.style.marginBottom = '15px';

        const jsonPreview = document.createElement('pre');
        jsonPreview.textContent = JSON.stringify(jsonData, null, 2);
        jsonPreview.style.backgroundColor = '#f5f5f5';
        jsonPreview.style.padding = '10px';
        jsonPreview.style.borderRadius = '5px';
        jsonPreview.style.maxHeight = '500px';
        jsonPreview.style.overflowY = 'auto';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center'; // 设置按钮容器中的内容居中
        buttonContainer.style.marginTop = '15px';

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '确认';
        confirmButton.style.marginRight = '100px'; // 增加右边距，使按钮之间的距离更大
        confirmButton.style.backgroundColor = '#29c87f';
        confirmButton.style.color = '#fff';
        confirmButton.style.border = 'none';
        confirmButton.style.borderRadius = '25px';
        confirmButton.style.padding = '10px 25px';
        confirmButton.style.cursor = 'pointer';
        confirmButton.style.transition = 'all 0.2s';
        confirmButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        confirmButton.addEventListener('mouseover', () => {
            confirmButton.style.backgroundColor = '#26b272';
            confirmButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        });
        confirmButton.addEventListener('mouseout', () => {
            confirmButton.style.backgroundColor = '#29c87f';
            confirmButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        });
        confirmButton.addEventListener('mousedown', () => {
            confirmButton.style.transform = 'scale(0.95)';
        });
        confirmButton.addEventListener('mouseup', () => {
            confirmButton.style.transform = 'scale(1)';
        });
        confirmButton.addEventListener('click', () => {
            pushData(jsonData); // 在这里调用 pushData 函数
            document.body.removeChild(confirmDialog);
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.backgroundColor = '#f74e53';
        cancelButton.style.color = '#fff';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '25px';
        cancelButton.style.padding = '10px 25px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.transition = 'all 0.2s';
        cancelButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        cancelButton.addEventListener('mouseover', () => {
            cancelButton.style.backgroundColor = '#e5434a';
            cancelButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        });
        cancelButton.addEventListener('mouseout', () => {
            cancelButton.style.backgroundColor = '#f74e53';
            cancelButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        });
        cancelButton.addEventListener('mousedown', () => {
            cancelButton.style.transform = 'scale(0.95)';
        });
        cancelButton.addEventListener('mouseup', () => {
            cancelButton.style.transform = 'scale(1)';
        });
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(confirmDialog);
        });

        // 将按钮添加到按钮容器中
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);

        // 添加按钮容器到对话框
        confirmDialog.appendChild(confirmMessage);
        confirmDialog.appendChild(jsonPreview);
        confirmDialog.appendChild(buttonContainer); // 添加整个按钮容器

        document.body.appendChild(confirmDialog);

        // 显示确认对话框
        requestAnimationFrame(() => {
            confirmDialog.style.opacity = '1';
            confirmDialog.style.transform = 'scale(1)';
        });
    }

    // 监听自动点击按钮点击事件
    //document.getElementById('clickButton').addEventListener('click', () => {
    //    simulateClick('.tab--xmU2q[data-marker-key="1"]');
    //});

    // 获取推送数据按钮并初始化时禁用它
    const pushButton = document.getElementById('pushButton');
    pushButton.disabled = true; // 初始时禁用按钮

    // 监听切换开关事件，改变输入框的占位符
    const inputToggle = document.getElementById('inputToggle');
    const presetValueInput = document.getElementById('presetValue');
    inputToggle.addEventListener('change', (event) => {
        if (event.target.checked) {
            presetValueInput.placeholder = "输优惠券值后回车";
        } else {
            presetValueInput.placeholder = "输消耗值后回车";
        }
    });

    // 监听用户输入并设置预置键的值
    document.getElementById('presetValue').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const presetValue = document.getElementById('presetValue').value.trim();
            const currentValue = JSON.parse(document.querySelector('textarea').value || '{}');
            const isConsumption = !document.getElementById('inputToggle').checked; // 默认是消耗
            const presetKey = isConsumption ? '千川消耗（元）' : '优惠券';
            if (!isNaN(presetValue) && presetValue !== '') { // 检查输入值是否为数字并且不为空
                currentValue.fields[presetKey] = parseFloat(presetValue);
                document.querySelector('textarea').value = JSON.stringify(currentValue, null, 2);
                document.getElementById('presetValue').value = '';
                pushButton.disabled = false; // 启用推送数据按钮
            }
        }
    });

    // 监听配置字段按钮点击事件
    document.getElementById('configButton').addEventListener('click', () => {
        // 打开选项面板
        document.evaluate('/html/body/div[1]/div/div/div[1]/div/div/div[3]/div/div[1]/div/div/div[1]/div[1]/div/div[1]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();

        setTimeout(function() {
            // 1. 点击恢复默认配置的按钮
            document.querySelector('.reset--Q2p16').click();

            // 2. 取消选中“实时在线人数”“观看-互动率(人数)”“人均观看时长”
            setTimeout(function() {
                const uncheckItems = [
                    '实时在线人数',
                    '观看-互动率(人数)',
                    '人均观看时长',
                    '平均在线人数'
                ];
                uncheckItems.forEach(name => {
                    const checkbox = document.evaluate(`//div[@data-kora="${name}"]//input[@type="checkbox"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (checkbox && checkbox.checked) {
                        checkbox.click();
                    }
                });
            }, 100);

            // 3. 选中“累计观看人数”“曝光次数”“新加购物团人数”
            setTimeout(function() {
                const checkItems = [
                    '累计观看人数',
                    '曝光次数',
                    '新加购物团人数'
                ];
                checkItems.forEach(name => {
                    const checkbox = document.evaluate(`//div[@data-kora="${name}"]//input[@type="checkbox"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (checkbox && !checkbox.checked) {
                        checkbox.click();
                    }
                });
            }, 200);

            // 4. 取消选中“千次观看成交金额”“观看-成交率(人数)”“商品点击-成交率(人数)”“成交件数”
            setTimeout(function() {
                const uncheckItems2 = [
                    '千次观看成交金额',
                    '观看-成交率(人数)',
                    '商品点击-成交率(人数)',
                    '成交件数'
                ];
                uncheckItems2.forEach(name => {
                    const checkbox = document.evaluate(`//div[@data-kora="${name}"]//input[@type="checkbox"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (checkbox && checkbox.checked) {
                        checkbox.click();
                    }
                });
            }, 300);

            // 5. 选中“退款金额”“违规次数”
            setTimeout(function() {
                const checkItems2 = [
                    '退款金额',
                    '违规次数',
                    '人均观看时长'
                ];
                checkItems2.forEach(name => {
                    const checkbox = document.evaluate(`//div[@data-kora="${name}"]//input[@type="checkbox"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (checkbox && !checkbox.checked) {
                        checkbox.click();
                    }
                });
            }, 400);

            // 最后点击确认按钮
            setTimeout(function() {
                document.querySelector('.ecom-btn.ecom-btn-primary').click();
            }, 500);
        }, 500); // 延迟以确保选项面板已完全打开
    });

    // 拦截XMLHttpRequest
    (function() {
        const oldSend = XMLHttpRequest.prototype.send;
        let coreDataProcessed = false; // 标记是否已处理过core_data数据包
        let totalSalesProcessed = false; // 标记是否已处理过总销售额
      //  let flowProcessed = false; // 标记是否已处理过flow_distribution数据包
        const loadEventListener = function() {
            const responseData = JSON.parse(this.responseText);

            // 处理core_data数据包，只处理第一个core_data数据包
            if (!coreDataProcessed && this.responseURL.includes('core_data')) {
                responseData.data.core_data.forEach(item => {
                    displayValue(item.index_display, item.value.value);
                });
                coreDataProcessed = true;
            }

            // 处理总销售额，只处理第一个出现的core_data数据包
            if (!totalSalesProcessed && coreDataProcessed && this.responseURL.includes('core_data')) {
                const totalSales = responseData.data.pay_amt.value;
                displayValue('总销售额', totalSales);
                totalSalesProcessed = true;
            }

            // 处理flow_distribution数据包，只处理第一个出现的flow_distribution数据包
          //  if (!flowProcessed && this.responseURL.includes('flow_distribution')) {
           //     processFlowData(responseData);
            //    flowProcessed = true;
          //  }

            // 移除事件监听器
            this.removeEventListener('load', loadEventListener);
        };
        XMLHttpRequest.prototype.send = function() {
            this.addEventListener('load', loadEventListener);
            oldSend.apply(this, arguments);
        };
    })();

    // 处理flow_distribution数据包
    //function processFlowData(responseData) {
     //   const flowData = responseData.data.natural_data.find(flow => flow.sub_flow && flow.sub_flow.length > 0);
      //  if (flowData && flowData.sub_flow[0]) {
     //       const channelName = flowData.sub_flow[0].channel_name;
      //      const salesValue = flowData.sub_flow[0].pay_amt.value;
     //       displayValue(channelName, salesValue);
    //    }
  //  }

    // 模拟点击函数
    function simulateClick(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
        }
    }

    function extractRoomId(url) {
        const roomIdRegex = /live_room_id=(\d+)/;
        const match = url.match(roomIdRegex);
        return match ? match[1] : null;
    }

    function displayValue(key, value) {
        // 格式化处理
        if (key === '退款金额' || key === '总销售额' || key === '推荐feed') {
            value = value / 100;
        }

        // 将值存储为键值对
        const valueObject = {};
        valueObject[key] = value;

        // 获取当前文本框中的值
        const jsonTextbox = document.querySelector('textarea');
        const currentValue = JSON.parse(jsonTextbox.value || '{}');

        // 将键值对添加到JSON输出中
        const output = {
            ...currentValue,
            fields: {
                ...currentValue.fields,
                ...valueObject
            }
        };

        // 更新文本框中的值
        jsonTextbox.value = JSON.stringify(output, null, 2);

        // 检查关键词并自动点击获取feed值
        const keywords = ['曝光次数', '成交人数', '退款金额'];
        if (keywords.some(keyword => key.includes(keyword))) {
            simulateClick('#clickButton');
        }
    }

    function pushData(data) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://192.168.1.79:5568/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            onload: function(response) {
                console.log(response.responseText);
            },
            onerror: function(err) {
                console.error(err);
            }
        });
    }
})();
