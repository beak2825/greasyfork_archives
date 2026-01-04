// ==UserScript==
// @name         淘宝购物车转报销清单
// @namespace    http://tampermonkey.net/
// @version      2024-11-04
// @description  不要繁琐的报销！！！
// @author       DeepWater
// @match        https://cart.taobao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515940/%E6%B7%98%E5%AE%9D%E8%B4%AD%E7%89%A9%E8%BD%A6%E8%BD%AC%E6%8A%A5%E9%94%80%E6%B8%85%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/515940/%E6%B7%98%E5%AE%9D%E8%B4%AD%E7%89%A9%E8%BD%A6%E8%BD%AC%E6%8A%A5%E9%94%80%E6%B8%85%E5%8D%95.meta.js
// ==/UserScript==



window.addEventListener("load", function () {
    var biggoods = document.getElementsByClassName("trade-cart-item-d-p-q-container cartItemDPQContainer--S7yQtAoY");
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);
    table.style.width = '100%';
    table.style.height = '100%';
    table.style.color = 'black';
    table.style.background = 'white';
    table.style.fontSize = '20px'
    table.setAttribute('border', '1');


    var bottomlocated = document.querySelector("#cart-operation-fixed");
    console.log(bottomlocated)
    var bottom = document.createElement('div');
    bottom.classList.add('trade-button')
    bottom.classList.add('trade-button-type-of-secondary')
    bottom.classList.add('trade-button-size-of-middle')

    

    bottom.style.zIndex = '999';
    bottom.style.fontSize = '10px'


    bottom.textContent = "报销单"
    console.log(bottom)
    bottomlocated.appendChild(bottom);
    // 创建表头
    var headerRow = document.createElement('tr');

    var headers = ['器件购置', '数量', '单价', '总价', '型号', '淘宝链接'];
    headers.forEach(function(headerText) {
        var header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    thead.appendChild(headerRow);
    var topmostDiv = document.createElement('div');
    topmostDiv.style.position = 'fixed';
    topmostDiv.style.top = '30%';
    topmostDiv.style.left = '50%';
    topmostDiv.style.transform = 'translate(-50%, 0)';
    topmostDiv.style.width = '80%'; // 调整宽度以适应表格
    topmostDiv.style.height = '80%'; // 自动高度
    topmostDiv.style.color = 'black'; // 自动高度
    topmostDiv.style.zIndex = '10000000';
    topmostDiv.style.overflowY = 'auto';
    topmostDiv.style.border = '1px solid black';
    topmostDiv.style.padding = '10px';
    topmostDiv.style.display='none';

    bottom.addEventListener('click', function(e) {

       var currentDisplay = topmostDiv.style.display;
       console.log(currentDisplay);
       if (currentDisplay === 'none') {
            topmostDiv.style.display = 'block'; // 或者其他合适的值，取决于你希望元素如何显示
        } else {
            topmostDiv.style.display = 'none';
        }
    })

    // 遍历元素并填充表格
    Array.from(biggoods).forEach(function(element) {
        var titleElement = element.querySelector(".title--dsuLK9IN");
        var contentElement = element.querySelector(".content--nFZ3Sgmr");
        var priceElement = element.querySelector(".trade-price-container.type-of-12-14B-16B");
        var numberElement = element.querySelector(".inputWrapper--jtTJwDAk");
        var totalprice = '';
        var linkElement = document.querySelector("a.title--dsuLK9IN");
        var row = document.createElement('tr');
        var cells = [
            titleElement ? titleElement.getAttribute("title") : 'No Title',
            numberElement ? numberElement.value : 'No Number',
            priceElement ? priceElement.textContent : 'No Price',
            totalprice,
            contentElement ? contentElement.textContent : 'No Content',



            linkElement ? linkElement.href : 'No Link'
        ];

        cells.forEach(function(cellText) {
            var cell = document.createElement('td');
            cell.textContent = cellText;
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });


    var rows = table.getElementsByTagName('tr');


    // 遍历所有的单元格
    //     for (var i = 0; i < cells.length; i++) {
    //         var cell = cells[i];
    //         // 获取单元格的文本内容
    //         var text = cell.textContent || cell.innerText;
    //         // 替换掉“￥”和“券后价”
    //         var newText = text.replace('￥', '').replace('券后价', '');
    //         // 更新单元格的文本内容
    //         cell.textContent = newText;
    //     }
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];

        // 获取数量和单价单元格
        var quantityCell = row.cells[1];
        var priceCell = row.cells[2];
        var newText = priceCell.textContent;
        newText = newText.replace('￥', '').replace('券后价', '');
        // 获取数量和单价的值
        var quantity = parseInt(quantityCell.textContent);
        priceCell.textContent = newText;
        var price = parseFloat(priceCell.textContent);


        // 计算总价
        var totalPrice = quantity * price;
        var titleCell = row.cells[0];
        // 获取总价单元格并设置值
        var totalCell = row.cells[3];
        totalCell.textContent = totalPrice.toFixed(2); // 保留两位小数
        var urlCell = row.cells[5];

        // 创建一个新的a标签
        var link = document.createElement('a');

        // 设置a标签的href属性为链接地址
        link.href = urlCell.textContent;

        // 设置a标签的文本为链接地址
        link.textContent = titleCell.textContent;

        // 添加target="_blank"属性，以便在新标签页中打开链接
        link.target = "_blank";

        // 替换原有的URL文本节点为a标签
        urlCell.innerHTML = '';
        urlCell.appendChild(link);
    }
    topmostDiv.appendChild(table)
    // 将表格添加到页面末尾
    document.body.appendChild(topmostDiv);
}, false);

