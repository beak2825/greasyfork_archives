// ==UserScript==
// @name         超星学习通一键打分（满分）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  超星学习通一键打分，目前只能打满分
// @author       Ray
// @match        https://mooc1.chaoxing.com/mooc-ans/mooc2/work/*
// @match        https://mooc1-api.chaoxing.com/mooc-ans/mooc2/work/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497909/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%B8%80%E9%94%AE%E6%89%93%E5%88%86%EF%BC%88%E6%BB%A1%E5%88%86%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/497909/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%B8%80%E9%94%AE%E6%89%93%E5%88%86%EF%BC%88%E6%BB%A1%E5%88%86%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';


   var button = document.createElement('button');
button.innerHTML = '一键打分';
button.style.position = 'absolute'; // 或者 'absolute' 如果您想要相对于某个容器定位
button.style.top = '10px'; // 距离顶部 10px
button.style.left = '50%'; // 居中
button.style.zIndex = '9999';
button.style.padding = '10px';
button.style.backgroundColor = '#008CBA';
button.style.color = 'white';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';


document.body.appendChild(button);



    // 点击按钮时的处理函数
    button.onclick = function() {
// 获取所有具有 class "inputBranch makeScore" 的 input 元素
    const inputs = document.querySelectorAll('input.inputBranch.makeScore');

    // 遍历这些 input 元素
    inputs.forEach(input => {
        // 获取 input 元素的 data 属性值
        const dataValue = input.getAttribute('data');

        // 将 data 属性值赋给 value 属性
        input.value = dataValue;
    });
//总分
         var fullScoreElement = document.getElementById("fullScore");
            // 获取id为sumScore的元素
            var sumScoreElement = document.getElementById("sumScore");

            // 检查这两个元素是否存在
            if (fullScoreElement && sumScoreElement) {
                // 将fullScore的value值赋给sumScore的value
                sumScoreElement.value = fullScoreElement.value;
                document.querySelector('.jb_btn_92.fr.fs14.marginLeft30').click();

            }


    };
})();
