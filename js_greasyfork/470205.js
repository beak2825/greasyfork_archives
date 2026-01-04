// ==UserScript==
// @name         steam市场 汇率自动转换
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  steam市场 汇率自动转换, 大部分代码用gpt生成的, 能跑就行
// @author       bestcondition.cn
// @match        https://steamcommunity.com/market/listings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/470205/steam%E5%B8%82%E5%9C%BA%20%E6%B1%87%E7%8E%87%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/470205/steam%E5%B8%82%E5%9C%BA%20%E6%B1%87%E7%8E%87%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==
let ekv = {};
let current_key_str = '';
let cny_str = 'CNY¥'
let input = document.createElement('input');
let div = document.createElement('div');

function add_cal_input() {
    // 创建一个浮动的文本输入框
    input.type = 'text';
    input.placeholder = '请输入';

    // 从 localStorage 中读取初始值
    const storedValue = localStorage.getItem('myInputValue');
    input.value = storedValue || 'x * 0.85';

    // 监听文本框值的改变，并将其持久化到 localStorage 中
    input.addEventListener('input', () => {
        localStorage.setItem('myInputValue', input.value);
    });
    let p = document.createElement('p');
    p.innerText = '手续费后价格计算公式, 其中x为原价';
    div.appendChild(p);
    // 将文本框添加到页面中
    div.appendChild(input);
}

function on_change() {
    let market_buyorder_info_details_tablecontainer = document.querySelector("#market_buyorder_info_details_tablecontainer")
    if (market_buyorder_info_details_tablecontainer) {
        market_buyorder_info_details_tablecontainer.style.width = 'auto';
    }
    let td_list = document.querySelectorAll("#market_commodity_buyreqeusts_table > table > tbody > tr > td:nth-child(odd)")
    td_list.forEach((td) => {
        let o_text = td.innerText
        if (!current_key_str) {
            for (let a in ekv) {
                if (o_text.includes(a)) {
                    current_key_str = a;
                    break;
                }
            }
        }
        if (o_text.includes(current_key_str) && !o_text.includes(cny_str)) {
            let currency_rate = ekv[current_key_str];
            if (currency_rate && input.value) {
                let ars_money = extractNumber(o_text)
                let cn_money = ars_money / currency_rate
                let x = cn_money
                let post_cn_money = eval(input.value)
                let cn_money_str = cn_money.toFixed(2)
                let post_cn_money_str = post_cn_money.toFixed(2)
                td.innerText = `${o_text} ( ${cny_str} ${cn_money_str} | ${post_cn_money_str} )`
            }
        }
    })
}

function add_table() {
    // 大部分代码用gpt生成的, 能跑就行
    function sync_ekv(data) {
        for (let i = 0; i < data.length; i++) {
            let [key, value] = data[i];
            ekv[key] = value;
        }
    }

    // 从 localStorage 中读取数据
    let exchangeRates = JSON.parse(localStorage.getItem('exchangeRates')) || [['CNY', 1.00]];
    sync_ekv(exchangeRates)
    // 创建表格元素
    let table = document.createElement('table');

    // 创建表头行
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');
    let th1 = document.createElement('th');
    let th2 = document.createElement('th');
    let th3 = document.createElement('th');
    th1.textContent = '币种';
    th2.textContent = '汇率';
    th3.textContent = '操作';
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    thead.appendChild(tr);
    // 创建表格数据行
    let tbody = document.createElement('tbody');

    function create_table_data() {
        for (let i = 0; i < exchangeRates.length; i++) {
            let tr = document.createElement('tr');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            td1.textContent = exchangeRates[i][0];
            td2.textContent = exchangeRates[i][1];
            let editButton = document.createElement('button');
            editButton.textContent = '修改';
            editButton.dataset.index = i;
            editButton.addEventListener('click', function (e) {
                let index = e.target.dataset.index;
                let currency = exchangeRates[index][0];
                let rate = exchangeRates[index][1];
                let newCurrency = prompt('请输入新的币种', currency);
                let newRate = prompt('请输入新的汇率', rate);
                if (newCurrency && newRate) {
                    exchangeRates[index] = [newCurrency, parseFloat(newRate)];
                    updateTable();
                    saveExchangeRates();
                }
            });
            let deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.dataset.index = i;
            deleteButton.addEventListener('click', function (e) {
                let index = e.target.dataset.index;
                if (confirm('确认删除？')) {
                    exchangeRates.splice(index, 1);
                    updateTable();
                    saveExchangeRates();
                }
            });
            td3.appendChild(editButton);
            td3.appendChild(deleteButton);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tbody.appendChild(tr);
        }
    }

    create_table_data()
    // 将表头和表格数据添加到表格中
    table.appendChild(thead);
    table.appendChild(tbody);

    // 将表格添加到页面中
    div.id = 'exchange-rates';
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.right = '0';
    div.style.backgroundColor = 'white';
    div.style.border = '1px solid black';
    div.style.padding = '10px';
    div.appendChild(table);
    document.body.appendChild(div);

    // 添加“新增”按钮
    let addButton = document.createElement('button');
    addButton.textContent = '新增';
    addButton.addEventListener('click', function () {
        let currency = prompt('请输入币种');
        let rate = prompt('请输入汇率');
        if (currency && rate) {
            exchangeRates.push([currency, parseFloat(rate)]);
            updateTable();
            saveExchangeRates();
        }
    });
    div.appendChild(addButton);
    // 添加拖动功能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    div.addEventListener("mousedown", function (e) {
        isDragging = true;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    });

    div.addEventListener("mouseup", function (e) {
        isDragging = false;
    });

    div.addEventListener("mousemove", function (e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            div.style.transform = "translate(" + currentX + "px, " + currentY + "px)";
        }
    });

    // 更新表格数据
    function updateTable() {
        tbody.innerHTML = '';
        for (let i = 0; i < exchangeRates.length; i++) {
            let tr = document.createElement('tr');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            td1.textContent = exchangeRates[i][0];
            td2.textContent = exchangeRates[i][1];
            let editButton = document.createElement('button');
            editButton.textContent = '修改';
            editButton.dataset.index = i;
            editButton.addEventListener('click', function (e) {
                let index = e.target.dataset.index;
                let currency = exchangeRates[index][0];
                let rate = exchangeRates[index][1];
                let newCurrency = prompt('请输入新的币种', currency);
                let newRate = prompt('请输入新的汇率', rate);
                if (newCurrency && newRate) {
                    exchangeRates[index] = [newCurrency, parseFloat(newRate)];
                    updateTable();
                    saveExchangeRates();
                }
            });
            let deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.dataset.index = i;
            deleteButton.addEventListener('click', function (e) {
                let index = e.target.dataset.index;
                if (confirm('确认删除？')) {
                    exchangeRates.splice(index, 1);
                    updateTable();
                    saveExchangeRates();
                }
            });
            td3.appendChild(editButton);
            td3.appendChild(deleteButton);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tbody.appendChild(tr);
        }
    }

    // 将数据保存到 localStorage 中
    function saveExchangeRates() {
        localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
        // 同步内存数据
        sync_ekv(exchangeRates);
        // 修改也要即时改变
        on_change();
    }
    add_cal_input();
}

function extractNumber(str) {
    // 将字符串中的所有非数字字符替换为空格
    let numStr = str.replace(/[^\d,]/g, ' ');

    // 将逗号替换为小数点
    numStr = numStr.replace(/,/g, '.');

    // 将字符串拆分成数字数组
    let numArr = numStr.trim().split(' ');

    // 将最后一个数字前面的空格替换为空字符串
    let lastNumIndex = numArr.length - 1;
    numArr[lastNumIndex] = numArr[lastNumIndex].replace(/^\s+/, '');

    // 将数字数组转换为浮点数
    return parseFloat(numArr.join(''));
}


function observe_table() {
    // 选择要观察的目标节点
    let targetNode = document.querySelector('#market_commodity_buyreqeusts_table');

    // 创建一个观察器实例并定义回调函数
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            //console.log('Mutation type: ' + mutation.type);
            //console.log('Changed node: ' + mutation.target);
            on_change();
        });
    });

    // 配置观察选项
    let config = {attributes: true, childList: true, subtree: true};
    on_change();
    // 传入目标节点和观察选项
    observer.observe(targetNode, config);

    // 停止观察
    //observer.disconnect();

}

(function () {
    'use strict';
    // 添加汇率展示表格
    add_table();
    // 先默认转换一次
    on_change();
    // 监控steam表格变化
    observe_table();
    // Your code here...
})();