// ==UserScript==
// @name         Version Comparison Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Compare versions and calculate percent sum
// @author       Your Name
// @match        raptor.mws.sankuai.com/client/metrics/*
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522649/Version%20Comparison%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/522649/Version%20Comparison%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建用于显示toast的div元素
    const toastDiv = document.createElement('div');
    toastDiv.style.position = 'fixed';
    toastDiv.style.top = '10px';
    toastDiv.style.right = '10px';
    toastDiv.style.padding = '10px 20px';
    toastDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    toastDiv.style.color = '#fff';
    toastDiv.style.borderRadius = '4px';
    toastDiv.style.zIndex = '1001';
    toastDiv.style.display = 'none'; // 初始隐藏

    // 创建下拉框元素（原来是输入框，现在改为下拉框）
    const versionInput = document.createElement('select');
    const jsonInput = document.createElement('textarea');
    const button = document.createElement('button');

    // 保存原始的open和send方法
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    // 重写open方法
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._customUrl = url; // 记录当前请求的URL，方便后续在send方法中使用
        return originalOpen.apply(this, arguments);
    };

    // 重写send方法
    XMLHttpRequest.prototype.send = function (data) {
        const xhr = this;
        xhr.addEventListener('load', function () {
            const url = xhr._customUrl; // 获取之前记录的URL
            if (url && url.indexOf("/common/decorator/distribution")!== -1) {
                console.log("Response status:", xhr.status);
                console.log("Response text:", xhr.responseText);
                // 这里也可以根据需求进一步处理响应结果，比如将结果存储到某个变量等
                // 例如可以定义一个全局变量来保存这个特定请求的结果
                const res = JSON.parse(xhr.responseText);
                const versionMap = res.data;
                jsonInput.value = JSON.stringify(res.data);

                // 清空原有下拉选项（防止重复添加）
                while (versionInput.options.length > 0) {
                    versionInput.remove(0);
                }
                // 遍历版本数据，添加版本号到下拉框选项中
                for (const version in versionMap) {
                    const option = document.createElement('option');
                    option.value = version;
                    option.text = version;
                    versionInput.add(option);
                }
            }
        });
        return originalSend.apply(this, arguments);
    };

    // 创建容器div
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.right = '10px';
    container.style.transform = 'translateY(-50%)';
    container.style.backgroundColor = '#67de7b';
    container.style.padding = '20px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    container.style.zIndex = '1000';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.width = '320px';

    versionInput.placeholder = "选择版本号";
    jsonInput.placeholder = "输入所有版本数据及其百分比";
    button.textContent = "计算结果";

    // 样式设置
    versionInput.style.width = "100%";
    versionInput.style.marginBottom = "10px";
    versionInput.style.padding = "10px";
    versionInput.style.border = "1px solid #d9d9d9";
    versionInput.style.borderRadius = "4px";
    versionInput.style.fontSize = "14px";

    jsonInput.style.width = "100%";
    jsonInput.style.height = "100px";
    jsonInput.style.marginBottom = "10px";
    jsonInput.style.padding = "10px";
    jsonInput.style.border = "1px solid #d9d9d9";
    jsonInput.style.borderRadius = "4px";
    jsonInput.style.fontSize = "14px";
    jsonInput.style.resize = "none";

    button.style.width = "100%";
    button.style.padding = "10px";
    button.style.backgroundColor = "#1890ff";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.fontSize = "16px";
    button.style.cursor = "pointer";
    button.style.transition = "background-color 0.3s";

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = "#40a9ff";
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = "#1890ff";
    });

    // 将输入框等元素添加到容器
    container.appendChild(versionInput);
    container.appendChild(jsonInput);
    container.appendChild(button);

    // 将容器添加到页面body
    document.body.appendChild(container);
    // 将toast div添加到页面body
    document.body.appendChild(toastDiv);

    // 版本比较函数
    function compareVersions(v1, v2) {
        const v1parts = v1.split('.').map(Number);
        const v2parts = v2.split('.').map(Number);

        for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
            const num1 = v1parts[i] || 0;
            const num2 = v2parts[i] || 0;
            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }
        return 0;
    }

    // 精确小数加法函数
    function addDecimal(a, b) {
        const aParts = `${a}`.split('.');
        const bParts = `${b}`.split('.');

        const aInt = aParts[0] || '0';
        const bInt = bParts[0] || '0';
        const aDec = aParts[1] || '';
        const bDec = bParts[1] || '';

        const maxDecLength = Math.max(aDec.length, bDec.length);

        const aDecPadded = aDec.padEnd(maxDecLength, '0');
        const bDecPadded = bDec.padEnd(maxDecLength, '0');

        const aBigInt = BigInt(aInt + aDecPadded);
        const bBigInt = BigInt(bInt + bDecPadded);

        const sumBigInt = aBigInt + bBigInt;
        const sumStr = sumBigInt.toString();

        const integerPart = sumStr.slice(0, -maxDecLength) || '0';
        const decimalPart = sumStr.slice(-maxDecLength).padStart(maxDecLength, '0');

        return `${integerPart}.${decimalPart}`;
    }

    // 按钮点击事件处理函数
    button.addEventListener('click', () => {
        const jsonData = JSON.parse(jsonInput.value || '{}');
        const version = versionInput.value || "12.21.400";
        const result = getVersionGTE(jsonData, version);
        if (result!== undefined) {
            showToast(`大于 ${version} 的版本的 percent 总和是: ${result}`);
        }
    });

    // 用于比较版本并计算百分比总和的函数
    function getVersionGTE(obj = {}, v = "12.21.400") {
        if (!obj || Object.keys(obj)?.length === 0) {
            console.log(`数据源为空，请前往 https://perf.sankuai.com/#/metrics/overview/2/Android?env=prod 进行观测`);
            console.log(`对应接口为: /common/decorator/distribution`);
            return;
        }
        // 筛选出大于等于指定版本的版本数据
        const targetVersions = Object.values(obj)
          .filter(version => compareVersions(version.tagValue, v) >= 0);
        const result = targetVersions.reduce((sum, version) => {
            sum = addDecimal(sum, version.percent);
            return sum;
        }, '0');
        return result;
    }

    // 显示toast的函数
    function showToast(message) {
        toastDiv.textContent = message;
        toastDiv.style.display = 'block';
        // 设定一定时间后隐藏toast，这里设置为3秒后隐藏
        setTimeout(() => {
            toastDiv.style.display = 'none';
        }, 5000);
    }
})();