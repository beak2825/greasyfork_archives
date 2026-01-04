// ==UserScript==
// @name         问卷星在线刷Ting
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  问卷星在线批量刷，自动答题，自动刷新(清除)Cookies,需手动点击滑块验证和提交，支持单选、多选、下拉框、量表、矩阵量表、填空。代码采用ES6+，低版本浏览器可能无法使用。不需要更改链接中的 vm 为 vj。
// @author       Ting
// @match        https://www.wjx.cn/*
// @icon         https://www.wjx.cn/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483588/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%9C%A8%E7%BA%BF%E5%88%B7Ting.user.js
// @updateURL https://update.greasyfork.org/scripts/483588/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%9C%A8%E7%BA%BF%E5%88%B7Ting.meta.js
// ==/UserScript==

(function() {
    'use strict';
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

    // ---------- 初始化 ----------
    const init = () => {
         // 清除缓存
        window.localStorage.clear()
        window.sessionStorage.clear()
        clearCookies();

        // 定义自己问卷的 url
        const url = 'https://www.wjx.cn/vm/eTfVozh.aspx#';

        // 重定向页面
        if (window.location.href.indexOf('https://www.wjx.cn/wjx/join') !== -1) {
            setTimeout(() => {
                window.location.href = url
            }, 200)
        }

        // 平滑滚动到页面低端
        window.scrollTo({
            top: document.body.scrollHeight, left: 0, behavior: 'smooth'
        });
    };

    // 自动填选并提交
    const handleAutoSelectAndSubmit = () => {
        // ---------- 定义参数 ----------
        let questionList = document.getElementsByClassName('field ui-field-contain');
        const list = Array.from(questionList).map((question) => {
            return question.children[1].children[0].children[1];
        })
        // 设置问题比例
        const answerList = [
            { id: 1, bili: [5, 10, 20, 35, 30] },
            { id: 2, bili: [10, 10, 25, 30, 25] },
            { id: 3, bili: [30, 30, 20, 10, 10] },
            { id: 4, bili: [10, 10, 15, 30, 35] },
            { id: 5, bili: [10, 15, 20, 30, 25] },
            { id: 6, bili: [30, 30, 20, 10, 10] },
            { id: 7, bili: [0, 10, 15, 30, 45] },
            { id: 8, bili: [5, 10, 20, 30, 35] },
            { id: 9, bili: [25, 35, 20, 15, 5] },
            { id: 10, bili: [0, 5, 15, 35, 45] },
            { id: 11, bili: [10, 10, 30, 25, 25] },
            { id: 12, bili: [10, 15, 35, 20, 20] },
            { id: 13, bili: [5, 10, 20, 35, 30] },
            { id: 14, bili: [2, 8, 15, 30, 45] },
            { id: 15, bili: [3, 5, 12, 35, 45] },
            { id: 16, bili: [1, 4, 15, 35, 45] },
            { id: 17, bili: [3, 8, 15, 30, 44] },
            { id: 18, bili: [5, 10, 35, 20, 20] },
            { id: 19, bili: [2, 5, 16, 34, 43] },
            { id: 20, bili: [5, 15, 25, 35, 20] },
            { id: 21, bili: [0, 5, 15, 35, 45] },
            { id: 22, bili: [5, 10, 30, 30, 25] },
            { id: 23, bili: [5, 15, 25, 35, 20] },
            { id: 24, bili: [2, 4, 17, 34, 43] },
            { id: 25, bili: [4, 8, 11, 35, 42] },
            { id: 26, bili: [3, 5, 14, 32, 46] },
            { id: 27, bili: [5, 15, 25, 30, 25] },
            { id: 28, bili: [5, 10, 35, 20, 20] },
            { id: 29, bili: [3, 8, 11, 35, 43] },
            { id: 30, bili: [2, 5, 16, 33, 44] },
            { id: 31, bili: [3, 5, 12, 35, 45] },
            { id: 32, bili: [3, 6, 15, 30, 46] }
        ];

        for (let i = 0; i < list.length; i++) {
            list[i].children[radio(answerList[i].bili)].click();
        }

        // 提交
        let count = 0
        setTimeout(() => {
            document.getElementById('ctlNext').click()
            setTimeout(() => {
                document.getElementsByClassName('layui-layer-btn0')[0]?.click()
                document.getElementById('SM_BTN_1').click();
            }, 1000)
        }, 1000)
    };

    window.onload = () => {
        init();
        handleAutoSelectAndSubmit();
    };
})();