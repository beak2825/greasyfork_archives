// ==UserScript==
// @name         闲管家批量降价1分钱
// @description  对销售中列表当前页商品批量降价1分钱
// @author       rico
// @namespace    rico
// @version      0.1
// @match        https://www.goofish.pro/product/on-sale
// @license      Apache License, Version 2.0
// @downloadURL https://update.greasyfork.org/scripts/467544/%E9%97%B2%E7%AE%A1%E5%AE%B6%E6%89%B9%E9%87%8F%E9%99%8D%E4%BB%B71%E5%88%86%E9%92%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/467544/%E9%97%B2%E7%AE%A1%E5%AE%B6%E6%89%B9%E9%87%8F%E9%99%8D%E4%BB%B71%E5%88%86%E9%92%B1.meta.js
// ==/UserScript==

function handleStartButtonClick() {
    const liElements = document.querySelectorAll('table.el-table__body')[0].querySelectorAll('tbody>tr');
    const spans = [];
    liElements.forEach((liElement) => {
        spans.push(liElement.querySelectorAll('td')[5].querySelector('div>div> span'))
    })
    spans.forEach((spana, index) => {
        setTimeout(() => {
            spana.click();
            setTimeout(() => {
                const tbs = document.querySelectorAll('table.el-table__body')
                if (tbs.length == 3) {
                    tbs[2].querySelectorAll('tbody>tr').forEach((tb) => {
                        const i = tb.querySelectorAll('td')[2].querySelector('div > div > div > input.el-input__inner')
                        i.value = parseFloat(i.value - 0.01).toFixed(2);
                        var e = document.createEvent('HTMLEvents');
                        e.initEvent('input', true, true);
                        e.eventType = 'message';
                        i.dispatchEvent(e);
                    })
                } else {
                    const i = document.querySelector('form > div > div > div > input.el-input__inner');
                    i.value = parseFloat(i.value - 0.01).toFixed(2);
                    var e = document.createEvent('HTMLEvents');
                    e.initEvent('input', true, true);
                    e.eventType = 'message';
                    i.dispatchEvent(e);
                }
                const bt = document.querySelector('div.btns-foot > button.el-button--primary');
                bt.click();
            }, 1200 * (index + 1))
        }, 1800 * (index + 1))
    })
}

const startButton = document.createElement('button');
startButton.innerText = '开始降价';
startButton.class = 'startButton';
startButton.style = 'position: fixed;  top: 150px;  right: 50px;  padding: 10px 20px; border: none;  border-radius: 5px;  cursor: pointer;  z-index: 99999;';
startButton.style.color = 'white';
startButton.style.backgroundColor = '#36a590';
document.body.appendChild(startButton);

startButton.addEventListener('click', handleStartButtonClick);