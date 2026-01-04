// ==UserScript==
// @name         wiki表格提取插件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://wiki.wb-intra.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395086/wiki%E8%A1%A8%E6%A0%BC%E6%8F%90%E5%8F%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/395086/wiki%E8%A1%A8%E6%A0%BC%E6%8F%90%E5%8F%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 所有表格数据
    let tableWrapArr = document.getElementsByClassName('table-wrap')

    for(let i = 0; i < tableWrapArr.length; i++) {
        createreInitDom(tableWrapArr[i], i)
    }

    // ========================= DOM生成层 ==========================

    // 传入一个DOM，就能生成表格提取按钮 生成启动代码按钮
    function createreInitDom(dom, index) {
        let divInit = document.createElement('div');
        divInit.class = 'extract'
        divInit.dataset.index = index;
        divInit.innerHTML = `<button>提取${index}</button>`

        // 给所有的按钮注册事件
        divInit.addEventListener('click', (e) => {
            let res = extractTool(e.path[2])
            prompt(res, res)
        })
        dom.appendChild(divInit);
    }

    // 工具函数，自动抽离DOM中的文案，并组合返回
    function extractTool(tbodyDom) {
        let resArr = [];
        let trArr = tbodyDom.getElementsByTagName('tr');

        for (let i = 0; i < trArr.length; i++) {
            let tdArr = trArr[i].getElementsByTagName('td')
            let resTdArr = [];
            for (let j = 0; j < tdArr.length; j++) {
                tdArr[j].innerText.trim() === ''
                    ? resTdArr.push("''")
                    : resTdArr.push(tdArr[j].innerText.trim());
            }
            resArr.push(resTdArr)
        }

        // 数组转字符串
        let resStr = ''

        resArr.forEach(resItem => {
            resItem.forEach((item, index) => {
                if (index === resItem.length - 1) {
                    resStr = resStr + item + '\n'
                } else {
                    resStr = resStr + item + ' '
                }

            })
        })
        return resStr
    }

})();