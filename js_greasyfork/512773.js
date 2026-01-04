// ==UserScript==
// @name         22k4已购游戏搜索
// @namespace    http://tampermonkey.net/
// @version      2024-10-07
// @description   已购买游戏详情页添加搜索功能
// @author       口吃者
// @match        https://22k4.com/member/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=22k4.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512773/22k4%E5%B7%B2%E8%B4%AD%E6%B8%B8%E6%88%8F%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/512773/22k4%E5%B7%B2%E8%B4%AD%E6%B8%B8%E6%88%8F%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
/* 
    1. 多次快速点击分页按钮造成卡死
    2. 可以增加保存配置功能，在没有购买新游戏时，可以保存配置，下次直接加载
*/
class ProductCatalog {
    constructor() {
        this.pages = []; // 存储每页的商品列表
        this.productByName = new Map(); // 存储商品名称到商品对象的映射
    }

    // 添加商品到指定页
    addProductToPage(pageIndex, product) {
        if (!this.pages[pageIndex]) {
        this.pages[pageIndex] = [];
        }

        // 检查商品名称是否已存在
        const existingProduct = this.productByName.get(product.name.toLowerCase());
        if (existingProduct) {
        console.log(`Product with name "${product.name}" already exists.`);
        return; // 商品名称已存在，不添加
        }

        // 添加商品到对应页，并更新映射
        this.pages[pageIndex].push(product);
        this.productByName.set(product.name.toLowerCase(), product);
    }

    // 根据商品名称查询商品
    findProductByName(name) {
        const lowerCaseName = name.toLowerCase();
        return this.productByName.get(lowerCaseName);
    }
    // 模糊查询商品
    searchProductsByPartialName(query) {
        const results = [];

        // 遍历所有商品
        this.productByName.forEach((product, name) => {
        if (name.includes(query.toLowerCase())) {
            results.push(product);
        }
        });

        return results;
    }

    // 获取所有商品
    getAllProducts() {
        return this.productByName.values();
    }

    // 获取某一页的所有商品
    getProductsOnPage(pageIndex) {
        return this.pages[pageIndex] || [];
    }
}
const catalog = new ProductCatalog();
var requestsCompleted = false;
var pickUpGameHref = '#';
var searchGameHref = '#';
(function() {
    'use strict';
    addPanel();
    // Your code here...
})();
window.onload = function() {
    // 示例：检查请求是否全部完成
    let btnSwitch = document.querySelector('#btnSwitch');
    checkTimer = setTimeout(() => {
        btnSwitch.textContent = "正在获取游戏中..."
    }, 1000); // 这只是一个示例，实际应用中应该根据实际场景决定何时检查

    //获取总页数
    let pageCount = document.querySelector("#PageCount").value;
    let pageSize = document.querySelector("#PageSize").value;
    let totalPages = getTotalPages(pageCount, pageSize);
    console.log(totalPages);
    const urls = Array.from({ length: totalPages }, (_, i) =>
                            `https://22k4.com/member/product.php?page=${i + 1}`
                           );

    // 创建一个 Promise 数组
    const fetchPromises = urls.map(url =>
                                   fetch(url, {
        method: 'GET',
        credentials: 'include', // 使得请求会发送 Cookie
        headers: {
            'Content-Type': 'text/html;charset=utf-8',
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.text(); // 读取为文本
    })
                                  );

    // 使用 Promise.all 来等待所有请求完成
    Promise.all(fetchPromises)
        .then(htmlTexts => {
        // 处理每个 HTML 文档
        htmlTexts.forEach((htmlText, index) => {
            // 创建一个范围较小的虚拟文档环境
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            getAllItemDetails(doc, index + 1);
            requestsCompleted = true;
            clearTimeout(checkTimer);
            btnSwitch.textContent = "面板"
        });
    })
        .catch(error => {
        console.error('There was a problem with one of the fetch operations:', error);
    });

    //输入框
    document.getElementById('iptName').addEventListener('input', function(event) {
        let input = event.target.value;
        // 显示建议列表
        displaySuggestions(input, 1);
    })
    // 初始化分页图标
    updatePaginationIcons(1, 1); // 假设初始页码为1，总页数为1（待更新）
    var cssText = `
        #input_suggestion li {
            color: aliceblue;
            cursor: pointer;
        }
        #input_suggestion li:hover {
            color: cadetblue;
            background-color: #f0f0f0;
        }
        #pagination span { 
            display: inline-block; 
            width: 25px;
            height: 25px; 
            line-height: 25px; 
            text-align: center; 
            border: 1px solid #ccc; 
            cursor: pointer;
            background: azure;
            margin-inline-end: 5px;
            margin-inline-start: 5px;
        }
    `
    GMaddStyle(cssText);

}
function addPanel(){
    function genDiv(cls, id){
        let d = document.createElement('div');
        d.style.cssText = 'vertical-align:middle;';
        if(cls){ d.className = cls };
        if(id){ d.id = id };
        return d;
    }
    //创建一个可以自由弹出的面板
    function genPanel(name, visiable){
        let panel = genDiv(name, name);
        panel.style.cssText = 'background: rgba(58, 58, 58, 0.8);position: fixed;top: 50%;right: 0px;';
        panel.style.cssText += 'text-align: center;transform: translate(0px, -50%);z-index: 100;';
        panel.style.cssText += 'border: 1px solid rgb(83, 83, 83);padding: 5px;border-radius: 10px 0 0 10px;';
        panel.style.cssText += 'transition:right 0.8s;right:-300px;'
        return panel;
    }
    function genButton(test, foo, id, fooParams = {}){
        let b = document.createElement('button');
        b.textContent = test;
        b.style.verticalAlign = 'inherit';
        // 使用箭头函数创建闭包来保存 fooParams 并传递给 foo
        b.addEventListener('click', () => {
            foo.call(b, ...Object.values(fooParams)); // 使用 call 方法确保 this 指向按钮对象
        });
        if(id){ b.id = id };
        return b;
    }
    function genInput(id, value, tips, number) {
        let i = document.createElement('input');
        i.id = id;
        i.style.cssText = 'border:none;border-radius:0;margin:0px 5px;width:60%;text-align:center;';
        i.style.cssText += 'color:#000;background:#fff;vertical-align:inherit;';
        if (value) { i.value = value; }
        if (tips) { i.placeholder = tips; }
        if (number) {
            i.type = 'number';
            i.step = 0.01;
            i.min = 0;
        }
        return i;
    }
    function genUl(items, id) {
        // 创建一个新的<ul>元素
        let ul = document.createElement('ul');
        
        // 如果提供了类名，添加到<ul>元素上
        if (id) {
            ul.id = id;
        }
        
        // // 遍历items数组，为每个项目创建一个<li>元素并添加到<ul>中
        // items.forEach(function(item) {
        //     let li = document.createElement('li');
            
        //     // 这里简单地将item的值设置为<li>的文本内容
        //     // 根据实际需求，这里可以进一步定制化，比如添加事件监听器等
        //     li.textContent = item;
            
        //     // 将<li>添加到<ul>中
        //     ul.appendChild(li);
        // });
        
        return ul;
    }
    function genSpan(id, textContentSpan) {
        let s = document.createElement('span');
        s.id = id;
        s.textContent = textContentSpan;
        return s;
    }
    //展开指定面板
    function showPanel(panelId){
        let panel = document.getElementById(panelId);
        if (panel.style.right == '-300px') {
            panel.style.right = '0';
        } else {
            panel.style.right = '-300px';
        }
    }
    let btnSwitch = genButton('面板', showPanel, 'btnSwitch', {param1: 'autoSell'});
    let panelFunc = genPanel('autoSell', false);    //初始隐藏
    //加入位置
    let lBtnArea = document.querySelector('body > div.page > div.container.m_top_30 > div');
    lBtnArea.insertBefore(btnSwitch, lBtnArea.children[0]);
    lBtnArea.insertBefore(panelFunc, lBtnArea.children[0]);
    //自动出售(加入到面板中) 搜索
    let divName = genDiv();
    let divPagination = genDiv(null, 'pagination');
    let button01 = genButton('搜索', searchGame, 'searchGame');
    let button02 = genButton('提货', pickUpGame, 'pickUpGame');
    let iptName = genInput('iptName', '', ' 游戏名称', false);
    let inputSuggestion = genUl(['无'], 'input_suggestion');
    let prePageSpan = genSpan('prePageSpan', '<');
    let nextPageSpan = genSpan('nextPageSpan', '>');

    divName.appendChild(button01);
    divName.appendChild(button02);
    divName.appendChild(iptName);
    divName.appendChild(inputSuggestion);

    divPagination.append(prePageSpan);
    divPagination.append(nextPageSpan);

    panelFunc.appendChild(divName);
    panelFunc.appendChild(divPagination);
    //todo 可优化成bilibili增强的样式表写法
    let h5Element = document.querySelector("body > div.page > div.container.m_top_30 > div > h5");
    btnSwitch.style.cssText += 'display: inline-block; margin-right: 10px;'
    btnSwitch.style.cssText += 'font-weight: bold;font-size: 16px;'
    h5Element.style.cssText += 'display: inline-block; margin-right: 10px;'
}
function searchGame(){
    // 使用 window.open 方法打开链接
    var url = this.getAttribute('data-url');// 链接动态变化，添加格外属性，每次点击重新获取
    window.open(url, '_blank'); // '_blank' 表示在一个新的浏览器标签页中打开
}
function pickUpGame(event){
    // 使用 window.open 方法打开链接
    var url = this.getAttribute('data-url');// 链接动态变化，添加格外属性，每次点击重新获取
    window.open(url, '_blank'); // '_blank' 表示在一个新的浏览器标签页中打开
}
function getTotalPages(input, eachPage) {
    // 将字符串转换为整数，如果是数字类型则直接使用
    let num = typeof input === 'string' ? parseInt(input, 10) : input;
    let eachPage01 = typeof eachPage === 'string' ? parseInt(eachPage, 10) : eachPage;

    // 检查转换后的值是否为 NaN 或者小于等于 0
    if (isNaN(num) || num <= 0 || isNaN(eachPage01) || eachPage01 <= 0) {
      throw new Error('getTotalPages error:Invalid input: input must be a positive integer.');
    }

    // 计算总页数
    // Math.ceil() 用于向上取整
    const totalPages = Math.ceil(num / eachPage01);

    return totalPages;
}
function getAllItemDetails(pageDocument, page){
    let itemList = pageDocument.querySelectorAll('tbody > tr');
    itemList.forEach(item => {
        let itemId = item.id;
        let itemImg = item.querySelector('img').src;
        let itemName = item.querySelector('a').textContent;
        let itemPrice = item.querySelector('span').textContent;
        let itemOrderNo = item.querySelector('td:nth-child(3) > p:nth-child(1)').textContent;
        let itemOrderTime = item.querySelector('td:nth-child(3) > p:nth-child(2)').textContent;
        let itemPickup = item.querySelector('td:nth-child(4) > p > a').href;
        let itemSearch = item.querySelector('td:nth-child(2) > p:nth-child(1) > b > a').href;
        // 创建一个新的 product 对象
        const product = {
            id: itemId, // 假设这是一个生成唯一 ID 的方法
            name: itemName,
            imageUrl: itemImg,
            price: itemPrice,
            orderNo: itemOrderNo,
            orderTime: itemOrderTime,
            pickUp: itemPickup,
            searchGame: itemSearch
        };
        catalog.addProductToPage(page - 1, product);
    })
}
function displaySuggestions(input, page) {
    const suggestions = catalog.searchProductsByPartialName(input).map(product => product.name);

    let suggestionsList = document.getElementById('input_suggestion');
    suggestionsList.innerHTML = ''; // 清空现有建议

    // 根据输入过滤建议
    let filteredSuggestions = suggestions;

    const itemsPerPage = 7; // 每页显示的建议数
    var totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, filteredSuggestions.length);

    // 显示过滤后的建议
    if (filteredSuggestions.length > 0 && filteredSuggestions.length >= start) {
        suggestionsList.style.display = 'block';
        // 获取输入框元素
        const iptName = document.getElementById('iptName');
        
        // 显示当前页的建议
        for (let i = start; i < end; i++) {
            let item = document.createElement('li');
            item.textContent = filteredSuggestions[i];

            if(item._clickHandler){
                item.removeEventListener('click', handler);
                delete item._clickHandler; // 清理保存的引用
            }
            // 创建一个通用的事件处理函数，并保存其引用
            const handler = () => handleSuggestionClick(item);
            item._clickHandler = handler; // 保存函数引用
            item.addEventListener('click', handler);
            suggestionsList.appendChild(item);
        }
    } else {
        suggestionsList.style.display = 'none'; // 如果没有建议则隐藏列表
    }

    // 更新分页图标的状态
    updatePaginationIcons(page, totalPages);
}

function updatePaginationIcons(currentPage, totalPages) {
    const prevPageIcon = document.getElementById('prePageSpan');
    const nextPageIcon = document.getElementById('nextPageSpan');

    if(currentPage === -1 && totalPages === -1){
        prevPageIcon.style.display = 'none';
        nextPageIcon.style.display = 'none';
        return;
    }

    prevPageIcon.style.display = currentPage === 1 ? 'none' : 'inline-block';
    nextPageIcon.style.display = currentPage === totalPages ? 'none' : 'inline-block';
    if(prevPageIcon._clickHandler){
        prevPageIcon.removeEventListener('click', prevPageIcon._clickHandler);
        delete prevPageIcon._clickHandler;
    }
    if(nextPageIcon._clickHandler){
        nextPageIcon.removeEventListener('click', nextPageIcon._clickHandler);
        delete nextPageIcon._clickHandler;
    }
    const preHandler = () => displaySuggestions(document.getElementById('iptName').value, currentPage - 1);
    const nextHandler = () => displaySuggestions(document.getElementById('iptName').value, currentPage + 1);
    prevPageIcon._clickHandler = preHandler;
    nextPageIcon._clickHandler = nextHandler;
    prevPageIcon.addEventListener('click', preHandler);
    nextPageIcon.addEventListener('click', nextHandler);
}
function GMaddStyle(css){
    var myStyle = document.createElement('style');
    myStyle.textContent = css;
    var doc = document.head || document.documentElement;
    doc.appendChild(myStyle);
}
function handleSuggestionClick(suggestion) {
    const iptName = document.getElementById('iptName');
    iptName.value = suggestion.textContent;

    pickUpGameHref = catalog.findProductByName(suggestion.textContent).pickUp;
    searchGameHref = catalog.findProductByName(suggestion.textContent).searchGame;

    document.querySelector('#pickUpGame').setAttribute('data-url', pickUpGameHref);
    document.querySelector('#searchGame').setAttribute('data-url', searchGameHref);

    // 防止点击建议后再点击分页卡死
    const prevPageIcon = document.getElementById('prePageSpan');
    const nextPageIcon = document.getElementById('nextPageSpan');
    prevPageIcon.style.display = 'none';
    nextPageIcon.style.display = 'none';

    const suggestionsList = document.getElementById('input_suggestion');
    suggestionsList.style.display = 'none'; // 关闭建议列表
}