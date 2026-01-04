// ==UserScript==
// @name         火烧云快捷查看
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在网页右上角添加云图标，单击时显示弹出窗口，火烧云快捷查看
// @author       Finder
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514619/%E7%81%AB%E7%83%A7%E4%BA%91%E5%BF%AB%E6%8D%B7%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/514619/%E7%81%AB%E7%83%A7%E4%BA%91%E5%BF%AB%E6%8D%B7%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

// 创建圆形图标
const cornerDiv = document.createElement('div');
cornerDiv.style.position = 'fixed';
cornerDiv.style.top = '60px'; // 向下移动50px
cornerDiv.style.right = '10px';
cornerDiv.style.width = '50px';
cornerDiv.style.height = '50px';
cornerDiv.style.backgroundColor = 'rgba(182,201,184,0.8)';
cornerDiv.style.cursor = 'pointer';
cornerDiv.style.zIndex = '9999';
cornerDiv.style.display = 'flex';
cornerDiv.style.alignItems = 'center';
cornerDiv.style.justifyContent = 'center';
cornerDiv.style.borderRadius = '50%'; // 设置为圆形

// 添加云图标
const cloudIcon = document.createElement('img');
cloudIcon.src = 'https://dss2.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/weather/icons/a2.png'; // 使用提供的云图标链接
cloudIcon.style.width = '30px'; // 调整图标大小
cloudIcon.style.height = '30px'; // 调整图标大小
cornerDiv.appendChild(cloudIcon);

document.body.appendChild(cornerDiv);

    // 创建模态框
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'none'; // 初始隐藏
    modal.style.zIndex = '10000';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    // 模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    modalContent.innerHTML = '<h2>天气信息</h2><div id="weatherData" style="text-align: left;">加载中...</div><button id="closeModal">关闭</button>';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // 单击事件
    cornerDiv.addEventListener('click', async () => {
        const results = await fetchWeatherData();
        document.getElementById('weatherData').innerHTML = results.join('<br/>'); // 显示结果
        modal.style.display = 'flex'; // 显示模态框
    });

    // 关闭模态框
    document.getElementById('closeModal')?.addEventListener('click', () => {
        modal.style.display = 'none'; // 隐藏模态框
    });

    // 点击模态框外部关闭模态框
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none'; // 隐藏模态框
        }
    });

    // 请求天气数据的函数
    async function fetchWeatherData() {
        const cityName = "苏州"; // 城市名称
        const encodedCityName = encodeURIComponent(cityName); // 编码城市名称
        const events = ['rise_1', 'set_1', 'rise_2', 'set_2'];
        const results = [];

        for (const event of events) {
            // 构建请求 URL
            const url = `https://hosunapi.finderskys.online/api/?query_id=7871925&intend=select_city&query_city=${encodedCityName}&event_date=None&event=${event}&times=None`;

            try {
                // 发送请求到代理服务器
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                });

                // 检查响应是否成功
                if (response.ok) {
                    const data = await response.json(); // 假设返回的是 JSON 格式

                    // 格式化数据
                    const date = data.img_summary; // 假设日期，实际应从数据中获取
                    const aerosol = data.tb_aod; // 假设数据中有气溶胶信息
                    const fireCloud = data.tb_quality; // 假设数据中有火烧云信息

                    results.push(`${date} <br> 气溶胶(AOD): ${aerosol.replace("<br>","")} <br> 火烧云: ${fireCloud.replace("<br>","")}`);
                } else {
                    results.push(`事件: ${event}, 错误: ${response.status}`);
                }
            } catch (error) {
                results.push(`事件: ${event}, 请求失败: ${error.message}`);
            }
        }

        return results;
    }
})();