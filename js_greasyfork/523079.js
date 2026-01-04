// ==UserScript==
// @name         Auto Parse and Fill Form for Quick Quotation
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  解析粘贴信息并填充到页面对应的表单字段中
// @author       You
// @match        https://issue.cpic.com.cn/ecar/view/portal/page/quotation_merge/quick_quotation.html
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523079/Auto%20Parse%20and%20Fill%20Form%20for%20Quick%20Quotation.user.js
// @updateURL https://update.greasyfork.org/scripts/523079/Auto%20Parse%20and%20Fill%20Form%20for%20Quick%20Quotation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 动态创建文本框和按钮
    let inputDiv = document.createElement('div');
    inputDiv.style.position = 'fixed';
    inputDiv.style.top = '20px';
    inputDiv.style.right = '20px';
    inputDiv.style.zIndex = '9999';
    inputDiv.style.backgroundColor = 'white';
    inputDiv.style.padding = '20px';
    inputDiv.style.border = '1px solid #ccc';
    inputDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';

    // 创建粘贴信息的文本框
    let pasteInput = document.createElement('textarea');
    pasteInput.style.width = '300px';
    pasteInput.style.height = '200px';
    pasteInput.style.marginBottom = '10px';
    pasteInput.placeholder = '粘贴信息（每行一个字段）';
    inputDiv.appendChild(pasteInput);

    // 创建解析按钮
    let parseButton = document.createElement('button');
    parseButton.textContent = '解析';
    parseButton.style.marginTop = '10px';
    inputDiv.appendChild(parseButton);

    // 将文本框和按钮插入到页面
    document.body.appendChild(inputDiv);

    // 解析按钮的点击事件
    parseButton.addEventListener('click', function() {
        let pasteText = pasteInput.value.trim();

        if (pasteText === '') {
            alert('请粘贴信息后再点击解析');
            return;
        }

        let lines = pasteText.split('\n').map(line => line.trim());

        // 确保粘贴的行数符合预期（11行）
        if (lines.length !== 11) {
            alert('粘贴的信息行数不正确，请确保是11行');
            return;
        }

        // 解析各个字段
        let plateNo = lines[0];      // 车牌号
        let modelType, carVIN, engineNo, stRegisterDate;
        let seatCount, tonnage, emptyWeight;
        
        // 判断车型字段的特殊情况
        if (lines[1] && lines[2] && !lines[1].match(/\d/)) {
            // 如果第2行是中文且第3行是字母数字混合的字符串（表示车型被拆分为两部分）
            modelType = `${lines[1]} ${lines[2]}`;  // 合并为一个车型
        } else {
            // 正常情况下，车型是单一字段
            modelType = lines[1];  // 车型
        }

        carVIN = lines[3];       // VIN
        engineNo = lines[4];     // 发动机号
        stRegisterDate = lines[5];  // 注册日期
        
        // 第6行特殊处理：解析 “2 8800 40000”
        [seatCount, tonnage, emptyWeight] = lines[6].split(/\s+/).map(Number); // 使用正则分割空格数量不定的情况
        emptyWeight = emptyWeight / 1000;  // 除以1000

        // 后续字段处理
        let name = lines[7];         // 公司名称
        let detail = lines[8];       // 地址
        let certificateCode = lines[9]; // 统一社会信用代码

        // 填充到页面表单
        try {
            document.getElementById('plateNo').value = plateNo;           // 填充车牌号
            document.getElementById('modelType').value = modelType;       // 填充车型
            document.getElementById('carVIN').value = carVIN;             // 填充VIN
            document.getElementById('engineNo').value = engineNo;         // 填充发动机号
            document.getElementById('stRegisterDate').value = stRegisterDate; // 填充注册日期
            document.getElementsByName('name')[0].value = name;           // 填充公司名称
            document.getElementsByName('certificateCode')[0].value = certificateCode; // 填充统一社会信用代码
            document.getElementsByName('detail')[0].value = detail;       // 填充地址

            // 填充 seatCount, emptyWeight, tonnage 到页面
            document.getElementsByName('seatCount')[0].value = seatCount;
            document.getElementsByName('emptyWeight')[0].value = emptyWeight;
            document.getElementsByName('tonnage')[0].value = tonnage;

            // 自动选择固定值的 select 控件
            let plateTypeSelect = document.getElementById('plateType');
            if (plateTypeSelect) {
                plateTypeSelect.value = "01";  // 自动选择 plateType 为 "01"
                // 主动触发一次 change 事件
                let event = new Event('change');
                plateTypeSelect.dispatchEvent(event);
            }

            let usageSelect = document.getElementById('usage');
            if (usageSelect) usageSelect.value = "601";     // 自动选择 usage 为 "601"

            let holderCertificateTypeSelect = document.getElementById('holderCertificateType');
            if (holderCertificateTypeSelect) holderCertificateTypeSelect.value = "18"; // 自动选择 holderCertificateType 为 "18"

            // 监听 plateType 选择变化
            plateTypeSelect.addEventListener('change', function() {
                if (this.value === "01") {
                    // 触发 vehicleType 的数据加载请求
                    loadVehicleTypeOptions(tonnage);  // 调用数据加载并根据 tonnage 设置 vehicleType
                }
            });

            // 触发 vehicleType 数据加载
            if (plateTypeSelect && plateTypeSelect.value === "01") {
                loadVehicleTypeOptions(tonnage);
            }

            alert('信息解析并填充成功！');
        } catch (error) {
            alert('解析过程中出现错误，请检查粘贴信息的格式');
            console.error('解析错误:', error);
        }
    });

    // 加载 vehicleType 选项并根据 tonnage 设置其值
    function loadVehicleTypeOptions(tonnage) {
        // 模拟获取 vehicleType 数据（实际中可以是通过 AJAX 请求获取）
        setTimeout(() => {
            let vehicleTypeElement = document.getElementById('vehicleType');
            if (tonnage < 2) {
                vehicleTypeElement.value = "02";  // tonnage < 2
            } else if (tonnage >= 2 && tonnage < 5) {
                vehicleTypeElement.value = "07";  // 2 <= tonnage < 5
            } else if (tonnage >= 5 && tonnage < 10) {
                vehicleTypeElement.value = "08";  // 5 <= tonnage < 10
            } else {
                vehicleTypeElement.value = "09";  // tonnage >= 10
            }
        }, 500);  // 模拟延时
    }

})();