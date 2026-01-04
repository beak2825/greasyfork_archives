// ==UserScript==
// @name         抖音快速下单
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       156530445@qq.com
// @match        https://fxg.jinritemai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.1/clipboard.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-modal/0.9.2/jquery.modal.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441329/%E6%8A%96%E9%9F%B3%E5%BF%AB%E9%80%9F%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/441329/%E6%8A%96%E9%9F%B3%E5%BF%AB%E9%80%9F%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.jDomMap = {};
    var monitoer_time = null;
    /**
    * 动态加载CSS
    * @param {string} url 样式地址
    */
    function dynamicLoadCss(url) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type='text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
    }
    function insertCss() {
        dynamicLoadCss("https://cdn.bootcdn.net/ajax/libs/jquery-modal/0.9.2/jquery.modal.css");
    }
    function initDom() {
        var copyButton = '<p><button class="copytoBtn" data-clipboard-text="Just because you can doesn\'t mean you should — clipboard.js">复制到剪贴板</button> <span id="tips"></span></p>';
        $("body").prepend(`<div style="display:none" id="login-modal" class="modal"><p>生成订单信息成功,点击按钮复制</p><textarea rows="9"cols="60" id="addressInfo"></textarea>${copyButton}</div>`);
        var clipboard = new ClipboardJS('.copytoBtn');
        clipboard.on('success', function(e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);
            e.clearSelection();
            $("#tips").html(`<span style='color: green;'>复制成功，请粘贴到快捷下单系统</span>`);
        });

        clipboard.on('error', function(e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    }
    let handle;
    function debounce(fn, delay) {
        return function (e) {
            // 取消之前的延时调用
            clearTimeout(handle);
            handle = setTimeout(() => {
                fn(e);
            }, delay);
        }

    }
    function loopHook() {
        console.log("loopHook");
        monitoer_time = setInterval(function(){
            console.log('Hello');
            var foundOrder = jQuery("[data-kora='订单号复制'").size() > 0
            if(foundOrder) {
                window.clearInterval(monitoer_time);
                 $(".auxo-spin-container").bind("DOMNodeRemoved",function(e){
                     //监听事件操作
                     console.log("DOMNodeRemoved",e);
                     //debugger;
                     debounce(loopHook,1500)();
                 });

                $("[data-kora='订单号复制']").each((index,item)=> {
                    //console.log(item);
                    //debugger;
                    //console.log(f);
                    //console.log(jQuery(item).parent().text());
                    //debugger;
                    var hasAdd = $(item).parent().find("[data-kora='订单内容复制']").length >0
                    if(hasAdd) {
                        console.log("hasAdd");
                        return;
                    }
                    var key = $(item).parent().text();
                    jDomMap[key] = item;
                    var dataToCopy = "";
                    //debugger;
                    //jQuery(item).parent().parent().after(jQuery("<i data-kora='订单内容复制' class='index_copyIcon__1t5Aa' onclick='copyOrder(\"" + key + "\")' class='index_copyIcon__1t5Aa'></i>"));
                    $(item).after($("<i data-kora='订单内容复制' class='iconfont icondingdan' onclick='copyOrder(\"" + key + "\")' class='index_copyIcon__1t5Aa'></i>"));

                });

            }
        }, 1000);
    }
    $(document).ready(function(){
        console.log("document ready!")
        insertCss();
        initDom();
        loopHook();
    });
    window.copyOrder = (key) => {
        var e = window.event || arguments.callee.caller.arguments[0];
        console.log("copyOrder", key);
        //console.log(jDomMap[key]);
        
        var item = jDomMap[key];
        var orderRow = $(item).parent().parent().parent().parent().parent().parent().parent();
        var cellRows = orderRow.find(".index_cellRow__3JWBB");
        console.log("orderRow",orderRow);
        console.log("cellRows",cellRows);
        var orders = {goods_items:[]};
        orders.orderId = key.split(" ")[1];
        cellRows.each((index,cellRow)=> {
            var order = {};
            var f = $(cellRow).find('[class="style_desc__1MaH9"]');
            f.each((index,styleItem) => {
                var text = $(styleItem).text();
                //console.log(text);
                if(text.indexOf("商家编码") != -1) {
                    order.outer_sku = text.split("：")[1];
                }
            });

            f = $(cellRow).find('[class="table_comboNum__1pAh5"]');
            order.number = f.text().replace("x","");
            console.log("order",order);
            orders.goods_items.push(order);


        });
        var f = $(orderRow).find('[class="index_receiverInfo__1j05R"]');
        var addressArray = [];
        f.children().each((index,addressItem)=> {
            addressArray.push($(addressItem).text());
        });
        //debugger;
        orders.receiveInfo = addressArray.join("，");


        var orderText = JSON.stringify(orders)
        $("#addressInfo").text(orderText);
        $(".copytoBtn").attr("data-clipboard-text",orderText);
        $("#tips").html("");
        $("#login-modal").modal();
        event.stopPropagation();
        //GM_setClipboard(JSON.stringify(order), "Text")
        //alert("复制成功，请粘贴到快捷下单系统");

    }

})();