// ==UserScript==
// @name         报销单填充
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  更新了根据所在城市和天数自动计算对应差旅报销金额的功能
// @author       AN
// @match        http://*/spa/workflow/static4form/index.html?_rdm=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499629/%E6%8A%A5%E9%94%80%E5%8D%95%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/499629/%E6%8A%A5%E9%94%80%E5%8D%95%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 定义检测间隔时间（毫秒）
    const interval = 500;
    // 定义最大尝试次数
    const maxAttempts = 20;
    // 今天的年月日,打印样式为：2021 年 07 月 07 日
    const today = new Date();
    const formattedDate = today.getFullYear() + " 年 " +
        ("0" + (today.getMonth() + 1)).slice(-2) + " 月 " +
        ("0" + today.getDate()).slice(-2) + " 日";
    function formatDateTime(input) {
        // 定义输入文本
        var inputText = input.trim(); // 去除可能的前后空白

        // 将输入文本拆分为日期和时间部分
        var parts = inputText.split(' ');
        var datePart = parts[0];
        var timePart = parts[1];

        // 将日期部分拆分为年、月、日
        var dateParts = datePart.split('-');
        var year = dateParts[0];
        var month = parseInt(dateParts[1]); // 将月份转换为整数
        var day = parseInt(dateParts[2]); // 将日期转换为整数

        // 格式化输出文本
        var outputText = month + "月" + day + "日" + timePart;

        return outputText;
    }
    //一线城市名单
    const tier1Cities = ["北京", "上海", "广州", "深圳"];
    // 主要城市名单
    const majorCities = [
        "沈阳", "石家庄", "济南", "南京", "杭州", "福州", "南宁", "海口", "哈尔滨",
        "长春", "呼和浩特", "太原", "郑州", "武汉", "合肥", "南昌", "长沙", "西安",
        "兰州", "西宁", "银川", "乌鲁木齐", "成都", "贵阳", "昆明", "拉萨", "深圳",
        "大连", "青岛", "宁波", "厦门", "天津", "重庆", "苏州", "东莞"
    ];
    var textSpan;
    var sourceCityEle = "";
    // 报销标准
    const tier1Rate = 350; // 一线城市出差费用
    const majorRate = 300; // 主要城市出差费用
    const otherRate = 260; // 其他城市出差费用
    const longTermTier1Rate = 140; //主要城市长期出差费用
    const longTermMajorRate = 140; //一线城市长期出差费用
    const longTermOtherRate = 120; //其他城市长期出差费用

    // 使用XPath选择器获取元素的函数
    function getElementByXPath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }



    // 定义要填充文本的XPath路径及对应文本的数组
    const targets = [
        { xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[15]/td[5]/div/span", text: formattedDate },
        { xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[18]/td[1]/div/span", text: "宁波" },
        { xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[18]/td[3]/div/span", text: "车次信息" },
        { xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[19]/td[3]/div/span", text: "车次信息" },
        { xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[19]/td[4]/div/span", text: "宁波" },
        { xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[1]/div/span", text: "0" }, //交通费
        { xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[6]/div/span", text: "Shift+Q计算" }, //总价
        { xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[7]/div/span", text: "3" }, //单据数量 默认来去机票，酒店票
        { xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[26]/td[2]/div/span", text: " " } //备注
    ];
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 6; j++) {
            targets.push({ xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[" + (20 + i) + "]/td[" + j + "]/div/span", text: " " });//空余表格自动填充
        }

    }
    //出差天数路径
    const daysPath = "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[7]/td[4]/div/span/span";

    function makeSpanEditable(xpath) {
        var spanElement = getElementByXPath(xpath);
        if (spanElement) {
            spanElement.setAttribute("contenteditable", "true");
            // spanElement.style.border = "1px solid #ccc"; // 添加边框以示区分
            console.log("指定的<span>元素现在是可编辑的");
        } else {
            console.log("未找到指定的<span>元素");
        }
    }




    var outDays = 0;

    var readSpanSuccess = false;
  // 计算报销费用的函数
  function calculateReimbursement(city, days) {
    let ratePerDay;
    if (tier1Cities.some(tier1City => city.includes(tier1City))) { // 检查城市名是否包含一线城市名
        if (days > 15) {
            ratePerDay = longTermTier1Rate; 
        } else {
            ratePerDay = tier1Rate;
        }
        textSpan.textContent = textSpan.textContent+"(一线)350/天";
    } else if (majorCities.some(majorCity => city.includes(majorCity))) { // 检查城市名是否包含主要城市名
        if (days > 15) {
            ratePerDay = longTermMajorRate;
        } else {
            ratePerDay = majorRate;
        }
        textSpan.textContent = textSpan.textContent+"(主要)300/天";
    } else {
        // 默认按其他城市计算
        if (days > 15) {
            ratePerDay = longTermOtherRate; // 按天数均摊
        } else {
            ratePerDay = otherRate;
        }
        textSpan.textContent = textSpan.textContent+"(其他)260/天";
    }

    let totalReimbursement;
    if (days > 15 && (tier1Cities.includes(city) || majorCities.includes(city))) { // 一线城市或主要城市，超过15天
        totalReimbursement = ratePerDay * days;
    } else if (days > 15 && !tier1Cities.includes(city) && !majorCities.includes(city)) { // 其他城市，超过15天
        totalReimbursement = longTermOtherRate;
    } else { // 没有超过15天
        totalReimbursement = ratePerDay * days;
    }

    return totalReimbursement;
}

    // 第一次运行时，读取出差天数，填充出差开始日期和结束日期
    function firstTimeRun() {
        if (readSpanSuccess == false) {
            readSpanSuccess = true;
            var outDays = getElementByXPath(daysPath).textContent.trim(); // 获取并去除可能的空白
            var outDaysNumber = parseFloat(outDays); // 将文本转换为数字
            if (!isNaN(outDaysNumber)) { // 确保转换后的值是一个有效数字
                var startDatePath = getElementByXPath("/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[8]/td[2]/div/div/span[1]/span/span");
                //出差结束日期路径
                var endDatePath = getElementByXPath("/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[8]/td[2]/div/div/span[3]/span/span");
             
                textSpan = getElementByXPath("/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[24]/td[2]/div/span");
                sourceCityEle = textSpan.textContent;
                   //目的地名称
                var destination =  getElementByXPath("/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[7]/td[2]/div/span/span").textContent.trim();
                var startTime = formatDateTime(startDatePath.textContent);
                var endTime = formatDateTime(endDatePath.textContent);

                fillText({ xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[18]/td[2]/div/span", text: startTime });
                fillText({ xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[18]/td[5]/div/span", text: startTime });
                fillText({ xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[18]/td[4]/div/span", text: destination });
                fillText({ xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[19]/td[1]/div/span", text: destination });
                fillText({ xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[19]/td[2]/div/span", text: endTime });
                fillText({ xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[19]/td[5]/div/span", text: endTime });
                fillText({ xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[3]/div/span", text: outDaysNumber * 60 });
                fillText({ xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[2]/div/span", text: calculateReimbursement(destination,outDaysNumber)}); //住宿费
                fillText({ xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[4]/div/span", text: 2 * 30 });
                fillText({ xpath: "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[5]/div/span", text: outDaysNumber * 40 });
                // makeSpanEditable("/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[1]/div/span");
            } else {
                console.log("转换后的值不是一个有效数字: " + outDays);
            }
        }

    }


    // 创建一个函数来检测和填充文本
    function fillText(target, attempt = 0) {
        const targetElement = getElementByXPath(target.xpath);
        makeSpanEditable(target.xpath);
        if (targetElement) {
            if (target.text === " ") { // 如果文本是空格，则清空目标元素
                targetElement.innerHTML = "&nbsp;"; // 使用HTML空格来保持元素的高度
            } else {
                targetElement.textContent = target.text; // 填充文本
            }
            firstTimeRun();
        } else {
            if (attempt < maxAttempts) {
                console.log(`尝试 ${attempt + 1}/${maxAttempts}：目标元素未找到，重新尝试中...`);
                setTimeout(() => fillText(target, attempt + 1), interval);
            } else {
                console.log(`超过最大尝试次数，停止检测: ${target.xpath}`);
            }
        }
    }

    // 定义要获取数字文本的XPath路径数组
    const pricePaths = [
        "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[1]/div/span",
        "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[2]/div/span",
        "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[3]/div/span",
        "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[4]/div/span",
        "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[5]/div/span",
    ];

    // 定义输出结果的目标XPath路径
    const resultXPath = "/html/body/div[1]/div/div/div[1]/div/table/tbody/tr[25]/td[6]/div/span";



    // 计算总价的函数
    function calculateTotalPrice() {
        let total = 0;
        pricePaths.forEach(path => {
            const element = getElementByXPath(path);
            if (element) {
                const priceText = element.textContent;
                const price = parseFloat(priceText.replace(/[^\d.-]/g, '')); // 提取数字
                if (!isNaN(price)) {
                    total += price;
                }
            }
        });

        // 获取结果显示的目标元素并输出总价
        const resultElement = getElementByXPath(resultXPath);
        if (resultElement) {
            resultElement.textContent = total.toFixed(2);
        }
    }

    // 添加键盘事件监听器
    document.addEventListener('keydown', function (event) {
        if (event.shiftKey && event.key === 'Q') {
            calculateTotalPrice();
            textSpan.textContent = sourceCityEle;
        }
    }, false);

    // 循环遍历所有目标路径并开始检测和填充文本
    targets.forEach(target => fillText(target));

})();