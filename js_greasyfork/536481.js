// ==UserScript==
// @name         简道云草稿箱统计数量
// @version      1.4
// @description  在简道云页面上加了一个点击按钮，点开草稿箱后点击按钮统计第三行的值，并log在控制他，这个值在我们项目里是工时，用于计算今天用了多少工时，避免八小时班写日志写了九小时/doge
// @match        https://www.jiandaoyun.com/dashboard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jiandaoyun.com
// @grant        none
// @namespace https://greasyfork.org/users/819402
// @downloadURL https://update.greasyfork.org/scripts/536481/%E7%AE%80%E9%81%93%E4%BA%91%E8%8D%89%E7%A8%BF%E7%AE%B1%E7%BB%9F%E8%AE%A1%E6%95%B0%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/536481/%E7%AE%80%E9%81%93%E4%BA%91%E8%8D%89%E7%A8%BF%E7%AE%B1%E7%BB%9F%E8%AE%A1%E6%95%B0%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    const button = document.createElement('button');
    button.innerHTML = '获取';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '60px';
    button.style.zIndex = '99999999';
    button.addEventListener('click', () => {
        //点击后查询所有class时field-value的div，这个div里面都是数字，计算出总和并弹框提示
        const fieldValues = document.querySelectorAll('.content .content-line:nth-child(3) .field-value');
        let sum = 0;
        fieldValues.forEach((fieldValue) => {
            sum += parseFloat(fieldValue.textContent);
        });
        const time = sum.toFixed(2);
        console.log(time)
        const el = document.querySelector('.drawer-header-text');
        const elText = document.querySelector('.text-haha');
        console.log('el.innerText === ', el.innerText === '草稿箱' && !elText)
        if(el.innerText === '草稿箱' && !elText) {
            const elTest = document.createElement('span');
            elTest.innerHTML = `(${time})`;
            elTest.classList.add('text-haha')
            el.appendChild(elTest)
            return;
        }
        if(elText) {
            elText.innerText = `(${time})`
        }
    });
    document.body.appendChild(button);

})();