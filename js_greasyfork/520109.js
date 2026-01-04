// ==UserScript==
// @name         问卷星自动填写
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  问卷星在线批量刷，自动答题。修改适配了自己的版本
// @author       none
// @match        https://www.wjx.cn/*
// @icon         https://www.wjx.cn/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520109/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/520109/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // ---------- 初始化 ----------
    // 清除缓存
    window.localStorage.clear()
    window.sessionStorage.clear()
    clearCookies()
    // 检测并自动点击“确认”按钮
    setInterval(() => {
        const confirmDialog = document.querySelector('.layui-layer-content');
        if (confirmDialog && confirmDialog.textContent.includes('您之前已经回答了部分题目，是否继续上次回答')) {
            const confirmButton = document.querySelector('.layui-layer-btn0'); // 假设确认按钮的类名为 layui-layer-btn0
            if (confirmButton) {
                confirmButton.click();
                console.log('自动点击了确认按钮');
            }
                }
        }, 1000); // 每秒检查一次对话框

    // 定义自己问卷的 url
    const url = 'https://www.wjx.cn/vm/mBYHOwA.aspx'
 
    // 重定向页面
    if (window.location.href.indexOf('https://www.wjx.cn/wjx/join') !== -1) {
        setTimeout(() => {
            window.location.href = url
        }, 200)
    }
 
    // 平滑滚动到页面低端
    window.scrollTo({
        top: document.body.scrollHeight, left: 0, behavior: 'smooth'
    })
 
    // ---------- 定义参数 ----------
    let list = []
    let questionList = document.getElementsByClassName('field ui-field-contain')
    let answerList = [
        
            {id: 1, type: '单选', bili: [0, 19, 39, 17, 25]},
            {id: 2, type: '单选', bili: [10, 13, 19, 25, 33]},
            {id: 3, type: '单选', bili: [40, 10, 30, 18, 2]},
            {id: 4, type: '单选', bili: [15, 30, 20, 20, 15]},
            {id: 5, type: '单选', bili: [10, 27, 22, 33, 8]},
            {id: 6, type: '单选', bili: [1, 5, 9, 80, 5]},
            {id: 7, type: '单选', bili: [15, 20, 20, 30, 15]},
            {id: 8, type: '单选', bili: [15, 20, 30, 20, 15]},
            {id: 9, type: '单选', bili: [15, 30, 20, 20, 15]},
            {id: 10, type: '单选', bili: [10, 20, 20, 30, 20]},
            {id: 11, type: '单选', bili: [5, 25, 25, 15, 30]},
            {id: 12, type: '单选', bili: [10, 28, 20, 20, 22]},
            {id: 13, type: '单选', bili: [10, 20, 30, 20, 20]},
            {id: 14, type: '单选', bili: [10, 25, 20, 20, 25]},
            {id: 15, type: '单选', bili: [20, 15, 20, 20, 25]},
            {id: 16, type: '单选', bili: [10, 20, 29, 30, 11]},
            {id: 17, type: '单选', bili: [5, 10, 70, 10, 5]},
            {id: 18, type: '单选', bili: [20, 20, 25, 20, 15]},
            {id: 19, type: '单选', bili: [5, 25, 20, 25, 25]},
            {id: 20, type: '单选', bili: [10, 30, 30, 10, 20]},
            {id: 21, type: '单选', bili: [65, 10, 10, 10, 5]},
            {id: 22, type: '单选', bili: [9, 15, 30, 25, 21]},
            {id: 23, type: '单选', bili: [19, 10, 25, 21, 25]},
            {id: 24, type: '单选', bili: [20, 10, 20, 30, 20]},
        
        // {id: 1, type: '单选', bili: [30, 70]},
        // {id: 2, type: '单选', bili: [20, 30, 30, 20]},
        // {id: 3, type: '多选', bili: [50, 50, 50, 50]},
        // {id: 4, type: '多选', bili: [20, 30, 30, 30, 40]},
        // {id: 5, type: '下拉', bili: [20, 30, 40, 10]},
        // {id: 6, type: '下拉', bili: [30, 20, 10, 40]},
        // {id: 7, type: '量表', bili: [25, 25, 25, 25]},
        // {id: 8, type: '量表', bili: [20, 20, 20, 20, 20]},
        // {id: 9, type: '填空', bili: [50, 50], content: ['哈哈哈', '嘿嘿嘿']},
        // {id: 10, type: '填空', bili: [50, 50], content: ['哈哈哈', '嘿嘿嘿']},
        // {id: 11, type: '矩阵量表', bili: [[20, 20, 20, 20, 20], [10, 20, 40, 20, 10]]}
    ]
 
    // ---------- 问卷答题逻辑 ----------
    for (let i = 0; i < questionList.length; i++) {
        list.push(questionList[i].children[1])
    }
 
    for (let i = 0; i < list.length; i++) {
        let type = answerList[i].type // 获取当前问题的类型
        switch (type) {
            case '单选': {
                list[i].children[radio(answerList[i].bili)].click()
                break
            }
            case '多选': {
                let flag = true
                while (flag) {
                    for (let j = 0; j < answerList[i].bili.length; j++) {
                        if (check(answerList[i].bili[j])) {
                            list[i].children[j].click()
                            flag = false
                        }
                    }
                }
                break
            }
            case '下拉': {
                list[i].children[0].children[0].children[radio([0, ...answerList[i].bili])].selected = true
                break
            }
            case '量表': {
                list[i].children[0].children[1].children[radio(answerList[i].bili)].click()
                break
            }
            case '矩阵量表': {
                for (let j = 0; j < answerList[i].bili.length; j++) {
                    list[i].children[0].children[1].children[(j+1)*2].children[radio((answerList[i].bili[j]))+1].click()
                }
                break
            }
            case '填空': {
                list[i].children[0].value = answerList[i].content[radio(answerList[i].bili)]
                break
            }
            default:
                break
        }
    }
 
    console.log('navigator:',window.navigator)
 
    // 提交
    let count = 0
    setTimeout(() => {
        console.log('navigator:', window.navigator)
        document.getElementById('ctlNext').click()
        setTimeout(() => {
            // 自动点击任何出现的确认按钮
            const confirmButton = document.querySelector('.layui-layer-btn0');
            if (confirmButton) {
                confirmButton.click();
            }

            // 新增：处理"您之前已经回答了部分题目，是否继续上次回答"的确认按钮
            const continueButton = document.querySelector('.layui-layer-btn1'); // 假设确认按钮的类名为 layui-layer-btn1
            if (continueButton) {
                continueButton.click();
            }
            
            document.getElementById('SM_BTN_1').click()
            // 点击后会继续出现需要滑动滑块验证，所以7秒后会自动验证
            setTimeout(()=> {
                slidingSlider();
            }, 7000)
        }, 1000)
    }, 1000)
 
    // ---------- 函数 ----------
 
    // 单选题执行逻辑
    function radio(bili) {
        let flagNum = randomNum(1, 100)
        for (let i = 0; i < bili.length; i++) {
            let startNum = i === 0 ? 0 : accumulation(bili, i)
            let endNum = accumulation(bili, i + 1)
            if (isInRange(flagNum, startNum, endNum)) return i
        }
    }
 
    // 多选题执行逻辑
    function check(probability) {
        let flagNum = randomNum(1, 100)
        return isInRange(flagNum, 1, probability)
    }
 
    // 生成从 minNum 到 maxNum 范围的函数
    function randomNum(minNum = 1, maxNum) {
        return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum
    }
 
    // 累加
    function accumulation(list, num) {
        let sum = 0
        for (let i = 0; i < num; i++) {
            sum += list[i]
        }
        return sum
    }
 
    // 判断 num 是否在区间内
    function isInRange(num, startNum, endNum) {
        return num >= startNum && num <= endNum;
 
    }
 
    // 清除 cookies 函数
    function clearCookies() {
        document.cookie.split(';').forEach(cookie => {
            const [name, ...parts] = cookie.split(/=(.*)/);
            const value = parts.join('=');
            const decodedName = decodeURIComponent(name.trim());
            const decodedValue = decodeURIComponent(value.trim());
            document.cookie = `${decodedName}=${decodedValue}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        });
    }
 
    // 滑动滑块来验证
    function slidingSlider() {
        const slider = document.querySelector("#nc_1_n1z");
        const startX = slider.getBoundingClientRect().left + window.pageXOffset;
        const startY = slider.getBoundingClientRect().top + window.pageYOffset;
        const endX = startX + 260;
        const endY = startY;
        const options = {bubbles: true, cancelable: true};
 
        slider.dispatchEvent(new MouseEvent('mousedown', options));
        slider.dispatchEvent(new MouseEvent('mousemove', Object.assign(options, {clientX: startX, clientY: startY})));
        slider.dispatchEvent(new MouseEvent('mousemove', Object.assign(options, {clientX: endX, clientY: endY})));
        slider.dispatchEvent(new MouseEvent('mouseup', options));
        setTimeout(()=>{
            // 出现哎呀出错啦，点击刷新再来一次错误 需要重新点击
           var nc_1_refresh1_reject = document.getElementById('nc_1_refresh1')
           if(nc_1_refresh1_reject!=='undefined' || nc_1_refresh1_reject!==null){
               nc_1_refresh1_reject.click()
               setTimeout(()=>{
                    slidingSlider()
               },1000)
           }
           },1000)   
    }
 
    // ---------- 自动刷新功能 ----------

    let inactivityTime = 0; // 不活动时间计数器
    const inactivityLimit = 3; // 设置不活动时间限制（单位：秒）

    // 重置不活动计数器
    function resetInactivityTimer() {
        inactivityTime = 0;
    }

    // 检查不活动时间并刷新页面
    function checkInactivity() {
        inactivityTime++;
        
       

        // 检查并处理对话框
        const confirmButton = document.querySelector('.layui-layer-btn0');
        if (confirmButton) {
            confirmButton.click();
        }

        if (inactivityTime >= inactivityLimit) {
            setTimeout(() => {
                location.reload(); // 刷新页面
            }, 10000); // 1秒后刷新
        }
    }

    // 监听用户活动
    window.onload = function() {
        document.onmousemove = resetInactivityTimer;
        document.onkeydown = resetInactivityTimer;
        setInterval(checkInactivity, 1000); // 每秒检查一次
    };
})();