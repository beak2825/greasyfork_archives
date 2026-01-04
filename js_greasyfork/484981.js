// ==UserScript==
// @name         GetLazVoucherCode
// @namespace    htts://tampermonkey.net/
// @version      1.1
// @description  Fuck Lazada!
// @author       Azad
// @match        https://www.lazada.co.id/*
// @match        https://www.lazada.co.th/*
// @match        https://www.lazada.com.ph/*
// @match        https://www.lazada.com.my/*
// @match        https://www.lazada.vn/*
// @match        https://www.lazada.sg/*
// @match        https://acs-m.lazada.co.th/*
// @match        https://acs-m.lazada.co.id/*
// @match        https://acs-m.lazada.com.ph/*
// @match        https://acs-m.lazada.com.my/*
// @match        https://acs-m.lazada.vn/*
// @match        https://acs-m.lazada.sg/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484981/GetLazVoucherCode.user.js
// @updateURL https://update.greasyfork.org/scripts/484981/GetLazVoucherCode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存原始 XMLHttpRequest 构造函数
    let oldXHR = window.XMLHttpRequest;

    // 重写 XMLHttpRequest 构造函数
    function hookXHR() {
        let realXHR = new oldXHR();

        // 重写 XMLHttpRequest 的 open 方法
        realXHR.open = function(method, url) {
            this._url = url; // 保存请求的URL
            return oldXHR.prototype.open.apply(this, arguments);
        };

        // 重写 XMLHttpRequest 的 onreadystatechange 事件处理函数
        realXHR.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                // 解析响应数据
                let responseData = JSON.parse(this.responseText);

                // 命中 Voucher 请求，解析出 voucherTypeToID
                if (responseData.data && responseData.data.voucherData && responseData.data.voucherData.voucherList) {
                    console.info("hook", responseData.data.voucherData.voucherList);
                    let displayData = [];
                    for (let voucher of responseData.data.voucherData.voucherList) {
                        let voucherType = voucher.voucherType || 'No Voucher Type';
                        let subTitle = voucher.subTitle || 'No SubTitle';
                        let fullTitle = voucher.title.text || 'No Title';
                        // 新增逻辑：根据 voucherType 计算 usable 字段
                        let usable = '';
                        if ([10, 12].includes(voucherType)) {
                            usable = 'Use';
                        } else if ([5, 6, 13].includes(voucherType)) {
                            usable = 'Do Not Use';
                        } else {
                            usable = 'Comment VoucherType & Do Not Use';
                        }
                        displayData.push({ usable: usable, voucher_type: voucherType, title: fullTitle, sub_title: subTitle });
                    }
                    // 在这里触发显示
                    console.log('Display Data:', displayData);
                    setTimeout(() => buildShowNode(displayData), 1000);
                }
            }

            if (this._onreadystatechange) {
                return this._onreadystatechange.apply(this, arguments);
            }
        };

        // 保存原始 onreadystatechange 事件处理函数
        realXHR._onreadystatechange = null;
        Object.defineProperty(realXHR, 'onreadystatechange', {
            get: function() {
                return realXHR._onreadystatechange;
            },
            set: function(value) {
                realXHR._onreadystatechange = value;
            }
        });

        return realXHR;
    }

    // 新增一个函数用于显示 Voucher List
    function displayVoucherList(displayData) {
        buildShowNode(displayData);
        // 这里可以添加其他逻辑，如果需要的话
    };

    // 替换 window.XMLHttpRequest 为自定义 XMLHttpRequest 构造函数
    window.XMLHttpRequest = hookXHR;

    // 构建显示节点
    // 修改以下代码来显示 Voucher Type 和 SubTitle
    function buildShowNode(displayData) {
        let existingNode = document.getElementById("lazada_voucher_type");

        if (existingNode) {
            // 如果已存在节点，更新其内容
            existingNode.innerText = JSON.stringify(displayData, null, 2);
        } else {
            // 如果不存在节点，创建一个新的节点并设置样式
            let modulePromotionTags = document.getElementById("module_promotion_tags");

            if (modulePromotionTags) {
                // 如果找到目标元素，创建新的节点并追加到目标元素下方
                let newDiv = document.createElement("div");
                newDiv.style.width = "100%";
                newDiv.id = "lazada_voucher_type"; // 修改为新的 id
                newDiv.style.backgroundColor = "#ffffff";  // 设置背景颜色，可根据需要调整
                newDiv.style.padding = "10px";  // 设置内边距，可根据需要调整

                for (let voucherData of displayData) {
                    let newPre = document.createElement("pre");
                    newPre.style.fontWeight = "bold";  // 设置内容为加粗

                    // 新增逻辑：根据 usable 的值设置字体颜色
                    switch (voucherData.usable) {
                        case 'Use':
                            newPre.style.color = 'green'; // 设置为绿色或其他颜色
                            break;
                        case 'Do Not Use':
                            newPre.style.color = 'red'; // 设置为红色或其他颜色
                            break;
                        case 'Comment VoucherType & Do Not Use':
                            newPre.style.color = 'orange'; // 设置为橙色或其他颜色
                            break;
                        default:
                            break;
                    }

                    var jsonText = JSON.stringify(voucherData, null, 2); // 格式化 JSON 以便更好的可读性
                    newPre.innerText = jsonText;
                    newDiv.appendChild(newPre);
                }

                // 在目标元素下方追加新的节点
                modulePromotionTags.appendChild(newDiv);
            } else {
                console.error("Target element 'module_promotion_tags' not found.");
            }
        }
    };
})();
