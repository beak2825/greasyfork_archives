// ==UserScript==
// @name         自动魔力兑换上传下载签到卡等
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  NexusPHP魔力自动兑换上传，下载，签到卡等
// @author       shareit
// @include      https://*/mybonus.php*
// @include      http://*/mybonus.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504087/%E8%87%AA%E5%8A%A8%E9%AD%94%E5%8A%9B%E5%85%91%E6%8D%A2%E4%B8%8A%E4%BC%A0%E4%B8%8B%E8%BD%BD%E7%AD%BE%E5%88%B0%E5%8D%A1%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/504087/%E8%87%AA%E5%8A%A8%E9%AD%94%E5%8A%9B%E5%85%91%E6%8D%A2%E4%B8%8A%E4%BC%A0%E4%B8%8B%E8%BD%BD%E7%AD%BE%E5%88%B0%E5%8D%A1%E7%AD%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 提取带有 <tr><form action="?action=exchange" method="post"> 的父节点
    const forms = Array.from(document.querySelectorAll('tr form[action="?action=exchange"]'));

    if (forms.length === 0) {
        console.log("没有找到符合条件的节点！");
        return;
    }


    let exchangeConfigStr = localStorage.getItem("exchange_config_json");
    let map;

    try {
        const parsedData = JSON.parse(exchangeConfigStr);
        if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
            map = new Map(Object.entries(parsedData)); // 将对象转换为 Map
        }
    } catch (error) {
        console.error('解析 JSON 时发生错误:', error);
    }

    // 创建选择框
    const select = document.createElement('select');
    select.style.color = 'red';
    select.style.color = 'red';
    select.style.fontSize='20px';
    forms.forEach((form, index) => {
        const tr=form.parentNode;
        const h1 = tr.querySelector('td h1'); // 查找当前表单中第一个包含 h1 的 td 的内容
        if (h1) {
            const option = document.createElement('option');
            option.value = index; // 使用索引作为存储值
            option.innerText = h1.innerText;
            select.appendChild(option);
            //console.log("option->"+option.innerText);
        }else{

        }
    });



    // 创建延时输入框
    const delayInput = document.createElement('input');
    delayInput.type = 'number';
    delayInput.placeholder = '延时(s)';
    delayInput.style.marginLeft = '10px';
    delayInput.min = 0;
    delayInput.value = 11;
    delayInput.style.color = 'red';
    delayInput.style.fontSize='20px';

    // 创建延时标注
    const delayLabel = document.createElement('span');
    delayLabel.innerText = '秒延时， 兑换'; // 添加单位和说明
    delayLabel.style.marginLeft = '5px'; // 加一点间距
    delayLabel.style.color = 'red';
    delayLabel.style.fontSize='20px';

    // 创建重复次数输入框
    const repeatInput = document.createElement('input');
    repeatInput.type = 'number';
    repeatInput.value = 2;
    repeatInput.placeholder = '重复次数';
    repeatInput.style.marginLeft = '10px';
    repeatInput.min = 1;
    repeatInput.style.color = 'red';
    repeatInput.style.fontSize='20px';

    // 创建重复次数标注
    const repeatLabel = document.createElement('span');
    repeatLabel.innerText = '次,'; // 添加说明
    repeatLabel.style.marginLeft = '5px'; // 加一点间距
    repeatLabel.style.color = 'red';
    repeatLabel.style.fontSize='20px';

    // 创建提交按钮
    const submitButton = document.createElement('button');
    submitButton.innerText = '提交';
    submitButton.style.marginLeft = '10px';
    submitButton.style.color = 'red';
    submitButton.style.fontSize='20px';

    // 创建倒计时显示区域
    const countdownDisplay = document.createElement('span');
    countdownDisplay.style.color = 'red'; // 设置文字颜色为红色
    countdownDisplay.style.marginTop = '10px'; // 设置一些上边距
    countdownDisplay.style.fontSize='24px';
    countdownDisplay.innerText = ''; // 初始化为空


    if(exchangeConfigStr){
        if(map){
            const repeatTimes = map.get("repeatTimes");
            const delaySeconds = map.get("delaySeconds");
            const selectedValue = map.get("selectedValue");

            //console.log("缓存："+repeatTimes,delaySeconds,selectedValue)
            repeatInput.value = repeatTimes;
            delayInput.value = delaySeconds;
            for (let option of select.options) {
                if (option.value === selectedValue) { // 比较时注意值类型
                    option.selected = true; // 设置该选项为选中
                    break; // 找到后退出循环
                }
            }

            if(repeatTimes>0){
                //console.log(delaySeconds+" s后执行点击，剩余次数:"+(repeatTimes));
                // 倒计时
                let countdown = delaySeconds;

                countdownDisplay.innerText = `倒计时: ${countdown} 秒`;
                const countdownInterval = setInterval(() => {
                    countdown--;
                    countdownDisplay.innerText = `倒计时: ${countdown} 秒`;

                    if (countdown < 0) {
                        clearInterval(countdownInterval);
                        countdownDisplay.innerText = '';
                    }
                }, 1000); // 每秒更新一次

               setTimeout(() => {submitButton.click();},delaySeconds*1000);
            }
        }
    }



    // 将元素添加到每个表单的父 <table> 的上面
    const parentTable = forms[0].closest('table');
    if (parentTable) {
        parentTable.parentNode.insertBefore(select, parentTable);
        parentTable.parentNode.insertBefore(delayInput, parentTable);
        parentTable.parentNode.insertBefore(delayLabel, parentTable); // 插入延时说明
        parentTable.parentNode.insertBefore(repeatInput, parentTable);
        parentTable.parentNode.insertBefore(repeatLabel, parentTable); // 插入重复次数说明
        parentTable.parentNode.insertBefore(submitButton, parentTable);
        parentTable.parentNode.insertBefore(countdownDisplay, parentTable);
    }



  // 点击提交按钮时的行为
    submitButton.addEventListener('click', () => {
        const selectedIndex = select.value; // 获取下拉选中的索引
        const delay = parseInt(delayInput.value) * 1000; // 转换为毫秒
        const repeatCount = parseInt(repeatInput.value);


        if (isNaN(delay) || isNaN(repeatCount) || repeatCount <= 0) {
            alert("请填写有效的延时和重复次数！");
            return;
        }

        const form = forms[selectedIndex]; // 直接获取所选表单
        //console.log(form.parentNode);
        if (form) {
            const submit = form.parentNode.querySelector('input[name="submit"]'); // 查找 name="submit" 的按钮
            //console.log(submitButton);
            if (submitButton) {

                console.log("模拟点击");
                if(!map){
                    map = new Map();
                }
                map.set("repeatTimes",repeatCount-1);
                map.set("delaySeconds",delayInput.value);
                map.set("selectedValue",selectedIndex);
                const json = JSON.stringify( Object.fromEntries(map));
                localStorage.setItem('exchange_config_json',json);
                //console.log(map);
                //console.log(json);
                //console.log(localStorage.getItem('exchange_config_json'));

                submit.click(); // 模拟点击提交按钮

                //setTimeout(() => {location.reload();},5*1000);

            }
        }
    });



})();