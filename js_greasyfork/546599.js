// ==UserScript==
// @name         天天基金实时净值
// @description  根据天天基金页面提供的股票持仓计算预估涨幅，不代表真实涨幅
// @namespace    http://tampermonkey.net/
// @version      2.5
// @author       You
// @match        https://fund.eastmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/decimal.js/9.0.0/decimal.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546599/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E5%AE%9E%E6%97%B6%E5%87%80%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/546599/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E5%AE%9E%E6%97%B6%E5%87%80%E5%80%BC.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Your code here...
    var dataItem03 = document.getElementsByClassName('dataItem03')[0];
    var dataOfFund = document.getElementsByClassName('dataOfFund')[0]
    var dataOfFundLines = dataOfFund.getElementsByClassName('dataOfFund-line')
    if (dataOfFundLines.length < 2) {
        var line = document.createElement("span");
        line.classList.add("dataOfFund-line")
        dataItem03.parentElement.insertBefore(line, dataItem03)
    }


    var dtp_span = dataItem03.querySelector('dt p span')
    dtp_span.textContent = '净值估算'

    var dataNums = dataItem03.querySelector('.dataNums')

    var span_2 = document.createElement("span");
    span_2.classList.add("ui-font-middle")
    span_2.classList.add("ui-color-red")
    span_2.classList.add("ui-num")
    dataNums.appendChild(span_2);
    var span_1 = dataItem03.querySelector('.dataNums span')

    var refreshFundGZ = function () {
        reGetGZ();
        setInterval(function () {
            var today = new Date();
            reGetGZ()
            if (today.getDay() > 0 && today.getDay() < 6) {
                if (today.getHours() >= 9 && today.getHours() < 12) {
                    reGetGZ()
                } else {
                    if (today.getHours() >= 13 && today.getHours() < 15) {
                        reGetGZ()
                    }
                }
            }
        }, 30000)
    };

    refreshFundGZ()

    jsonpgz = function (data) {
        if (data) {
            span_1.textContent = data.gsz;
            span_2.textContent = data.gszzl + '%';
            span_2.classList.remove('ui-color-green')
            span_2.classList.remove('ui-color-red')
            span_1.classList.remove('ui-color-green')
            span_1.classList.remove('ui-color-red')
            if (data.gszzl.includes('-')) {
                span_2.classList.add("ui-color-green")
                span_1.classList.add("ui-color-green")
            } else {
                span_2.classList.add("ui-color-red")
                span_1.classList.add("ui-color-red")
            }
        }
    }


    let lastTime = 0;
    var button = document.createElement("button"); //创建一个按钮
    button.textContent = "预估净值"; //按钮内容
    button.style.width = "120px"; //按钮宽度
    button.style.height = "36px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#e33e33"; //按钮底色
    button.style.border = "10px solid #e33e33"; //边框属性
    button.style.borderRadius = "4px"; //按钮四个角弧度
    button.addEventListener("click", calcFund) //监听按钮点击事件


    var like_comment = document.getElementById('quotationItem_DataTable');
    //like_comment.appendChild(button); //把按钮加入到 x 的子节点中
    button.style.width = window.getComputedStyle(like_comment).width
    like_comment.insertBefore(button, like_comment.children[0])


// 创建一个 MutationObserver 实例
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 检查是否有节点被添加或删除
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                // 在这里处理节点变化
                //console.log('页面元素发生变化', mutation);
                calcFund();
            }
        });
    });

    var stock = like_comment.getElementsByClassName('ui-table-hover')[0];
// 配置 MutationObserver，监听 DOM 树的变化
    observer.observe(stock, {
        childList: true, // 监听子节点的添加和删除
        subtree: true,   // 监听整个子树
        attributes: true, // 监听属性变化
        characterData: true // 监听文本内容变化
    });

    function calcFund() {

        let now = Date.now();

        if ((now - lastTime) < 1000)
            return;

        lastTime = now;
        //console.log('计算估值', Date.now())
        var tr_list = stock.children[0].children

        var total = Decimal(0);
        for (var j = 0; j < tr_list.length; j++) {
            var tr = tr_list[j];
            //console.log(tr)
            var stock_name = tr.children[0].innerText;
            if (stock_name === '股票名称')
                continue;

            if (tr.children[2].innerText.includes('--'))
                continue;
            total = total.add(new Decimal(tr.children[1].innerText.replace('%', '')).mul(new Decimal(tr.children[2].innerText.replace('%', ''))))

        }
        //console.log(total)
        button.textContent = '预估净值：' + total.div(new Decimal(100)).toFixed(3, Decimal.ROUND_DOWN) + '%'
    };
})();