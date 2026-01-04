// ==UserScript==
// @name         问卷星在线刷
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  问卷星在线批量刷，自动答题，自动刷新(清除)Cookies,需手动点击滑块验证和提交，支持单选、多选、下拉框、量表、矩阵量表、填空。代码采用ES6+，低版本浏览器可能无法使用。不需要更改链接中的 vm 为 vj。
// @author       ZZY
// @match        https://www.wjx.cn/*
// @icon         https://www.wjx.cn/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465842/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%9C%A8%E7%BA%BF%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/465842/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%9C%A8%E7%BA%BF%E5%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- 初始化 ----------
    // 清除缓存
    window.localStorage.clear()
    window.sessionStorage.clear()
    clearCookies()

    // 定义自己问卷的 url
    const url = 'https://www.wjx.cn/vm/ODYlfUQ.aspx'

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
        {id: 1, type: '单选', bili: [30, 70]},
        {id: 2, type: '单选', bili: [20, 30, 30, 20]},
        {id: 3, type: '多选', bili: [50, 50, 50, 50]},
        {id: 4, type: '多选', bili: [20, 30, 30, 30, 40]},
        {id: 5, type: '下拉', bili: [20, 30, 40, 10]},
        {id: 6, type: '下拉', bili: [30, 20, 10, 40]},
        {id: 7, type: '量表', bili: [25, 25, 25, 25]},
        {id: 8, type: '量表', bili: [20, 20, 20, 20, 20]},
        {id: 9, type: '填空', bili: [50, 50], content: ['哈哈哈', '嘿嘿嘿']},
        {id: 10, type: '填空', bili: [50, 50], content: ['哈哈哈', '嘿嘿嘿']},
        {id: 11, type: '矩阵量表', bili: [[20, 20, 20, 20, 20], [10, 20, 40, 20, 10]]}
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
            document.getElementsByClassName('layui-layer-btn0')[0]?.click()
            document.getElementById('SM_BTN_1').click()
            // setInterval(() => {
            //     try {
            //         slidingSlider()
            //         count += 1
            //     } catch (err) {
            //         if (count >= 5) {
            //             window.location.reload()
            //         }
            //     }
            // }, 500)
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

    }
})();