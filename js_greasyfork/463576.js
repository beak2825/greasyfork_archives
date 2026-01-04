// ==UserScript==
// @name         Buff购买记录总价计算
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动计算buff当前购买记录界面总价.
// @author       xllfkw
// @match        https://buff.163.com/market/buy_order/history?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463576/Buff%E8%B4%AD%E4%B9%B0%E8%AE%B0%E5%BD%95%E6%80%BB%E4%BB%B7%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/463576/Buff%E8%B4%AD%E4%B9%B0%E8%AE%B0%E5%BD%95%E6%80%BB%E4%BB%B7%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let nextPageUrl = '';
    let pageNum = 1;
    let scrollListener;
    let priceElements = document.getElementsByClassName("f_Strong");
    let totalPrice = 0;
    let intervalId = 0;
    let inputDate = '';
    const data = [];
    data.push(['名称', '价格', '日期']);

    function divide(arg1, arg2) {
        if (arg2 === 0) {
            return null; // 处理除数为0的情况
        }
        var d1 = 0, d2 = 0;
        var n1 = arg1.toString(), n2 = arg2.toString();
        try {
            d1 = n1.split(".")[1].length;
        } catch (e) {}
        try {
            d2 = n2.split(".")[1].length;
        } catch (e) {}
        var multiplier = Math.pow(10, Math.max(d1, d2));
        //window.alert(multiplier)
        var numerator = parseFloat(n1.replace(".", "")) * multiplier / 100;
        //window.alert(numerator)
        var denominator = parseFloat(n2.replace(".", "")) * multiplier;
        //window.alert(denominator)
        return (numerator / denominator).toFixed(2);
    }

    //计算价格
    for (let i = 0; i < priceElements.length; i++) {
        if (priceElements[i].id === "navbar-cash-amount") {
            continue;
        }
        let priceText = priceElements[i].innerText;
        let price = parseFloat(priceText.substring(1));
        totalPrice += price;
    }

    // 显示价格等信息
    let inforElement = document.createElement("div");
    inforElement.style.position = "fixed";
    inforElement.style.left = "0";
    inforElement.style.top = "45%";
    inforElement.style.transform = "translateY(-50%)";
    inforElement.style.backgroundColor = "#fff";
    inforElement.style.padding = "10px";
    inforElement.style.borderRadius = "5px";
    inforElement.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    //显示页数
    inforElement.innerText = "已加载页数: " + pageNum;
    //显示总价
    inforElement.innerHTML += "<br>目前总价: ¥" + totalPrice.toFixed(2);
    //window.alert(totalPrice.toFixed(2))
    //显示数量
    let countElements = document.querySelectorAll(".list_tb tbody tr");
    let itemCount = countElements.length;
    inforElement.innerHTML += "<br>目前数量: " + itemCount;
    //window.alert(itemCount)
    //显示均价
    let averagePrice = divide(totalPrice.toFixed(2),itemCount);
    //window.alert(averagePrice);
    inforElement.innerHTML += "<br>目前均价: ¥" + averagePrice;
    if (intervalId <= 0){
        inforElement.innerHTML += "<br>是否自动加载：否";
    } else{
        inforElement.innerHTML += "<br>是否自动加载：是";
    }
    inforElement.innerHTML += "<br>是否全部加载完成：否";
    document.body.appendChild(inforElement);

    //显示日期和导出
    let inforElement2 = document.createElement("div");
    inforElement2.style.position = "fixed";
    inforElement2.style.left = "0";
    inforElement2.style.top = "25%";
    inforElement2.style.backgroundColor = "#fff";
    inforElement2.style.padding = "10px";
    inforElement2.style.borderRadius = "5px";
    inforElement2.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    //inforElement1.style.pointerEvents = "none";
    inforElement2.innerText = "选择日期: ";
    document.body.appendChild(inforElement2);
    //添加选择日期框
    let dateInput = document.createElement("input");
    dateInput.type = "date";
    //dateInput.style.position = 'fixed';
    //dateInput.style.height = '20px'
    //dateInput.style.top = '23%';
    //dateInput.style.lift = '0px';
    //document.body.appendChild(dateInput);
    inforElement2.appendChild(dateInput);

    // 创建一个导出按钮
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '导出 Excel';
    //inforElement2.innerHTML += "<br>";
    inforElement2.appendChild(document.createElement('br'));
    inforElement2.appendChild(exportBtn);


    // 添加事件监听器，当用户点击导出按钮时，将数据导出为 Excel 文件
    exportBtn.addEventListener('click', () => {
        getData();
        const csvData = '\uFEFF' + data.map(row => row.join(',')).join('\n');
        const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const csvUrl = URL.createObjectURL(csvBlob);
        const link = document.createElement('a');
        link.setAttribute('href', csvUrl);
        link.setAttribute('download', 'BuffMarketData.csv');
        document.body.appendChild(link);
        link.click();
    });

    //判断是否选择日期
    dateInput.addEventListener('input', () => {
        //console.log("input 事件被触发了！");
        inputDate = dateInput.value;
        //console.log(inputDate);
    });

    // 获取下一页的URL
    const getNextPageUrl = () => {
        const nextPageButton = document.querySelector('.page-link.next');
        if (pageNum === 1) {
            if (nextPageButton) {
                nextPageUrl = nextPageButton.href;
                nextPageUrl = nextPageUrl.replace('#', '&');
            } else {
                nextPageUrl = '';
            }
        } else {
            if (nextPageButton) {
                nextPageUrl = nextPageUrl.replace(/page_num=(\d+)/, (match, p1) => `page_num=${Number(p1) + 1}`);
            } else {
                nextPageUrl = '';
            }
        }
    };

    //自动加载下一页
    function loadNextPage() {
        if (nextPageUrl == '') {
            return;
        }
        if (inputDate) {
            const dateElements = document.querySelectorAll("td.c_Gray.t_Left");
            const lastDateElement = dateElements[dateElements.length - 1];
            const lastDateStr = lastDateElement.innerText.trim();
            const lastDate = new Date(lastDateStr);
            const lastDateObj = new Date(lastDate);
            const lastDateStr1 = lastDateObj.toISOString().substr(0, 10);
            if(lastDateStr <= inputDate){
                inforElement.removeChild(inforElement.lastChild);
                inforElement.removeChild(inforElement.lastChild);
                inforElement.removeChild(inforElement.lastChild);
                inforElement.removeChild(inforElement.lastChild);
                inforElement.innerHTML += "<br>当前页面已满足日期条件";
                return;
            }
        }
        const xhr = new XMLHttpRequest();
        xhr.open('GET', nextPageUrl, true);
        xhr.onload = function() {
            if (this.status === 200) {
                const parser = new DOMParser();
                const newDoc = parser.parseFromString(this.responseText, 'text/html');
                const newPageTbody = newDoc.querySelector('.list_tb tbody');
                const nodataElement = newDoc.querySelector('.nodata');
            if (nodataElement) {
                console.log('已经到最后一页');
                nextPageUrl = '';
                clearInterval(intervalId);
                intervalId = null;
                inforElement.removeChild(inforElement.lastChild);
                inforElement.removeChild(inforElement.lastChild);
                inforElement.removeChild(inforElement.lastChild);
                inforElement.removeChild(inforElement.lastChild);
                inforElement.innerHTML += "<br>是否自动加载：否";
                inforElement.innerHTML += "<br>是否全部加载完成：是";
                return;
            }
                document.querySelector('.list_tb tbody').insertAdjacentHTML('beforeend', newPageTbody.innerHTML);
                pageNum++;
                //url显示到网页中
                //window.history.pushState(null, "", nextPageUrl);
                getNextPageUrl();
                // 计算总价
                let priceElements = document.getElementsByClassName("f_Strong");
                let totalPrice = 0;
                for (let i = 0; i < priceElements.length; i++) {
                    if (priceElements[i].id === "navbar-cash-amount") {
                        continue;
                    }
                    let priceText = priceElements[i].innerText;
                    let price = parseFloat(priceText.substring(1));
                    totalPrice += price;
                }
                //计算数量
                let itemElements = document.querySelectorAll('.list_tb tbody tr');
                let itemCount = itemElements.length;
                //计算均价
                let averagePrice = divide(totalPrice.toFixed(2),itemCount);
                //更新数值
                inforElement.innerText = "已加载页数: " + pageNum;
                inforElement.innerHTML += "<br>当前总价: ¥" + totalPrice.toFixed(2);
                inforElement.innerHTML += "<br>当前数量: " + itemCount;
                inforElement.innerHTML += "<br>目前均价: ¥" + averagePrice;
                if (intervalId > 0){
                    inforElement.innerHTML += "<br>是否自动加载：是";
                } else {
                    inforElement.innerHTML += "<br>是否自动加载：否";
                }
                inforElement.innerHTML += "<br>是否全部加载完成：否";
                if(inputDate){
                    const dateElements = document.querySelectorAll("td.c_Gray.t_Left");
                    const lastDateElement = dateElements[dateElements.length - 1];
                    const lastDateStr = lastDateElement.innerText.trim();
                    const lastDate = new Date(lastDateStr);
                    const lastDateObj = new Date(lastDate);
                    const lastDateStr1 = lastDateObj.toISOString().substr(0, 10);
                    //window.alert(lastDateStr1);
                    //window.alert(inputDate);
                    if(lastDateStr <= inputDate)
                    {
                        nextPageUrl = '';
                        clearInterval(intervalId);
                        intervalId = null;
                        inforElement.removeChild(inforElement.lastChild);
                        inforElement.removeChild(inforElement.lastChild);
                        inforElement.removeChild(inforElement.lastChild);
                        inforElement.removeChild(inforElement.lastChild);
                        inforElement.innerHTML += "<br>是否自动加载：否";
                        inforElement.innerHTML += "<br>满足日期条件饰品是否加载完成：是";
                        return;
                        //window.alert("早");
                    }
                }

            }
        };
        xhr.send();
    }
    //获得导出数据
    function getData() {
        const nameSpans = document.querySelectorAll('.name-cont .textOne');
        const priceStrong = document.querySelectorAll('.f_Strong:not(#navbar-cash-amount)');
        const dateTds = document.querySelectorAll('.c_Gray.t_Left');
        // 遍历元素，将数据存储在二维数组中
        for (let i = 0; i < nameSpans.length; i++) {
            const name = nameSpans[i].textContent;
            const price = priceStrong[i].textContent;
            const date = dateTds[i].textContent;
            data.push([name, price, date]);
        }
    }

    // 添加双击事件监听器
    document.body.addEventListener('dblclick', () => {
        // 如果定时器已经启动，说明需要停止执行 loadNextPage 函数
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            inforElement.removeChild(inforElement.lastChild);
            inforElement.removeChild(inforElement.lastChild);
            inforElement.removeChild(inforElement.lastChild);
            inforElement.removeChild(inforElement.lastChild);
            inforElement.innerHTML += "<br>是否自动加载：否";
            inforElement.innerHTML += "<br>是否全部加载完成：否";
        } else {
            // 否则启动定时器，每2秒执行一次 loadNextPage 函数
            intervalId = setInterval(loadNextPage, 2000);
        }
    });

    // 监听滚动事件
    scrollListener = () => {
        // 当页面滚动到底部时
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
            // 如果下一页的URL存在，则加载下一页的内容
            if (nextPageUrl) {
                loadNextPage();
            }
        }
    };

    window.addEventListener('scroll', scrollListener);
    // 初始化，获取第一页的商品列表和下一页的URL
    getNextPageUrl();
})();