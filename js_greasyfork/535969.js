// ==UserScript==
// @name         东方财富-期货-工具
// @namespace    http://tuite.fun
// @version      1.2
// @description  自动选中‘外资’、‘机构’、‘家人’席位
// @author       tuite
// @match        https://qhweb.eastmoney.com/lhb/pzjcc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535969/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C-%E6%9C%9F%E8%B4%A7-%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/535969/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C-%E6%9C%9F%E8%B4%A7-%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function () {
    'use strict';

    /**
     * 席位名称
     * 家人：平安、东财、徽商
     * 外资：瑞银、摩根、乾坤
     * 机构：国君、海通、永安、中信、东证
     */
    let xw = {
        wz: ['乾坤期货(代客)', '摩根大通(代客)', '瑞银期货(代客)',],
        jg: ['国泰君安(代客)', '海通期货(代客)', '永安期货(代客)', '中信期货(代客)', '东证期货(代客)'],
        jr: ['平安期货(代客)', '东方财富(代客)', '徽商期货(代客)', '中信建投(代客)',]
    }

    /**
     * 选择席位
     * @param xwName
     * @returns {Promise<unknown>}
     */
    let selectXw = (xwName) => {
        return new Promise((resolve, reject) => {
            document.querySelector('.el-select').click();

            // 假设选项需要一定时间加载，使用 setTimeout 模拟等待
            setTimeout(() => {
                let xwList = [...document.querySelectorAll('.el-select-dropdown__item')];
                let target = xwList.find(x => x.querySelector('span')?.innerText.trim() === xwName);

                if (target) {
                    target.click();
                    resolve(); // 成功找到并点击目标项
                } else {
                    reject(new Error(`未找到席位名称：${xwName}`)); // 未找到目标项
                }
            }, 500); // 根据实际情况调整等待时间
        });
    };

    /**
     * 清除席位
     * @returns {Promise<unknown>}
     */
    let clearXw = () => {
        return new Promise((resolve) => {
            const tryClear = () => {
                let nowXw = document.querySelector('.el-select__tags-text');
                if (nowXw == null) {
                    resolve(); // 如果没有需要清除的内容，直接返回 Promise 的 resolve 状态
                    return;
                }
                nowXw.nextElementSibling.click();
                setTimeout(tryClear, 500); // 继续递归调用，直到清除完成
            };
            tryClear(); // 开始首次尝试清除
        });
    };

    // 选择席位
    let sxl = async (x) => {
        let type = x.currentTarget.id.split('-')[1];
        await clearXw()
        for (const xwName of xw[type]) {
            await selectXw(xwName);
        }
    }

    // 在屏幕右下角生成按钮
    let btnDiv = document.createElement('div')
    btnDiv.innerHTML = `<button id="btn-wz">外资</button><button id="btn-jg">机构</button><button id="btn-jr">家人</button>`
    btnDiv.className = 'btn-div'
    document.body.appendChild(btnDiv);
    let css = `
        <style>
        .btn-div {
        position: fixed;
        bottom: 0;
        right: 0;
        z-index: 9999;
    }

    .btn-div button {
        margin: 5px;
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: opacity 0.3s ease;
        cursor: pointer;
    }

    .btn-div button#btn-wz {
        background-color: #4CAF50;
        color: white;
    }

    .btn-div button#btn-jg {
        background-color: #2196F3;
        color: white;
    }

    .btn-div button#btn-jr {
        background-color: #FF5722;
        color: white;
    }

    .btn-div button:hover {
        opacity: 0.8;
    }
</style>

        }
        .btn-div button {
            margin: 5px;
        }
</style>
    `
    document.head.insertAdjacentHTML('beforeend', css);

    // 使用 querySelectorAll 获取所有 class 为 'btn' 的元素
    var buttons = document.querySelectorAll('.btn-div button');

// 遍历并添加 click 事件监听器
    buttons.forEach(function (button) {
        button.addEventListener('click', sxl);
    });
})();

