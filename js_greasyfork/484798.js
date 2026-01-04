// ==UserScript==
// @name         Vikacg小助手
// @namespace    http://reiz-l.github.io
// @version      1.2.1
// @description  受不了这些下载页面的该死广告，简直和畜生一样点一下直接跳转到其他黄网了，所以这个脚本就诞生了。目前1.2版本，修复了在.xyz网页主页不能清除广告的bug，添加了主页自动签到功能
// @author       Takesita
// @match        http://www.vikacg.xyz/*
// @match        http://www.vikacg.com/*
// @match        https://www.vikacg.xyz/*
// @match        https://www.vikacg.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484798/Vikacg%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/484798/Vikacg%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url_current = window.location.href;
    if (url_current.indexOf("external?e=") != -1){
        function waitForXPath(xpath, callback) {
            var interval = setInterval(function() {
                var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (element) {
                    clearInterval(interval);
                    callback(element);
                }
            }, 100); // 调整轮询间隔
        }

        waitForXPath('//*[@id="app"]/div[2]/div[1]/div/div/div[3]/div[2]/div/div/div/div/div', function(element) {
            // 在这里执行你的脚本逻辑
            const XpathExpression = '//*[@id="app"]/div[2]/div[1]/div/div/div[2]/div[2]/div/div/div/div/div[1]/p';
            const pElement = document.evaluate(XpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (pElement) {
                const content = pElement.textContent.trim();
                console.log('Content of <p> element:', content);
                var cleanedURL = content.replace('正在检查：', '');
                //alert('反外部链接广告插件为您直接跳转:\n' + cleanedURL)
                
                // 获取网页的宽度和高度
                let pageWidth = window.innerWidth;
                let pageHeight = window.innerHeight;

                // 创建一个 div 元素
                let div = document.createElement("div");

                // 设置 div 的宽度、高度、背景颜色和边框
                div.style.width = "320px";
                div.style.height = "128px";
                div.style.backgroundColor = "white";
                div.style.border = "1px solid black";

                // 创建一个 p 元素
                let p = document.createElement("p");

                // 设置 p 的文本内容和字体大小
                p.textContent = "已为您自动跳转！";
                p.style.fontSize = "24px";

                // 将 p 元素添加到 div 元素中
                div.appendChild(p);

                // 将 div 元素添加到网页的 body 元素中
                document.body.appendChild(div);

                // 计算 div 元素的左上角坐标，使其居中显示
                let divLeft = (pageWidth - 320) / 2;
                let divTop = (pageHeight - 128) / 2;

                // 设置 div 元素的位置
                div.style.position = "absolute";
                div.style.left = divLeft + "px";
                div.style.top = divTop + "px";
                window.open('https://'+cleanedURL, '_blank');

            } else {
                console.error('Could not find <p> element using XPath.');
                alert('没有找到外部链接.');
            }
            console.log('没找到元素:', element);
        });
        //通过xpath来提取内容
    }
    //首页
    else if (url_current == "https://www.vikacg.xyz/post" || url_current == "https://www.vikacg.com/post") {

        function waitForXPath(xpath, callback) {
            var interval = setInterval(function() {
                var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (element) {
                    clearInterval(interval);
                    callback(element);
                }
            }, 100); // 调整轮询间隔
        }
        waitForXPath('//*[@id="app"]/div[2]/div[3]/div[5]/div[2]/div/div[1]/div[1]/div[2]/div/strong/span/span' , function(){
            // 定义两个 xpath，分别对应两个 div 元素
            var xpath1 = '//*[@id="app"]/div[2]/div[3]/div[6]';
            var xpath2 = '//*[@id="app"]/div[2]/div[3]/div[2]';
            var xpath3 = '//*[@id="app"]/div[2]/div[3]/div[4]';

            // 使用 document.evaluate 方法，获取两个元素的引用
            var element1 = document.evaluate(xpath1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            var element2 = document.evaluate(xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            var element3 = document.evaluate(xpath3, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            // 如果想要销毁元素，可以使用 removeChild 或 remove 方法
            element1.parentNode.removeChild(element1);
            element2.parentNode.removeChild(element2);
            element3.parentNode.removeChild(element3);

            // 如果想要隐藏元素，可以使用 style 属性设置 display:none
            //element1.style.display = "none";
            //element2.style.display = "none";

        });

        waitForXPath('//*[@id="app"]/div[2]/div[3]/div[2]' ,function(){
            var xpath4 = '//*[@id="app"]/div[2]/div[3]/div[2]';
            var element4 = document.evaluate(xpath3, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            element4.parentNode.removeChild(element4);
        });

        //自动签到功能
        // 获取要模拟点击的按钮元素
        waitForXPath('//*[@id="app"]/div[2]/div[3]/div[3]/div[2]/div/div[3]/a[1]/button' ,function(){
            var xpath_qd = '//*[@id="app"]/div[2]/div[3]/div[3]/div[2]/div/div[3]/a[1]/button'; 
            var xpath_qdtxt = '//*[@id="app"]/div[2]/div[3]/div[3]/div[2]/div/div[3]/a[1]/button/span/span';
            let button = document.evaluate(xpath_qd, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            let bt_txt = document.evaluate(xpath_qdtxt,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            let bt_content = bt_txt.nodeType === Node.TEXT_NODE ? bt_txt.nodeValue : bt_txt.innerText;
            if (bt_content == "点击领取今天的积分签到") {
                
                // 创建一个 click 事件对象
                let event = new MouseEvent("click", {
                    bubbles: true, // 事件是否冒泡
                    cancelable: true, // 事件是否可取消
                    view: window // 事件的视图
                });

                // 调用按钮元素的 click 方法，或者触发 click 事件
                button.click(); // 或者 button.dispatchEvent(event);
                console.log("自动签到:进入页面");
            } else {
                alert('今日已签到!');
            }
        });
        
        
    }
    //签到
    else if(url_current == "https://www.vikacg.xyz/wallet/mission"){
        function waitForXPath(xpath, callback) {
            var interval = setInterval(function() {
                var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (element) {
                    clearInterval(interval);
                    callback(element);
                }
            }, 100); // 调整轮询间隔
        }

        waitForXPath('//*[@id="preview-input-dynamic"]/div/table/tbody/tr[1]/td[1]/div',function() {
            var xpath = '//*[@id="app"]/div[2]/div[3]/div/div[2]/div[2]';
            var ad = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            ad.parentNode.removeChild(ad);
        });

        waitForXPath('//*[@id="preview-input-dynamic"]/div[1]/div[2]/div[2]/button[2]',function () {
            var xpath_qdbt = '//*[@id="preview-input-dynamic"]/div[1]/div[2]/div[2]/button[2]';
            let element_bt = document.evaluate(xpath_qdbt, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            //let element_bttx = document.evaluate('',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null),singleNodeValue;
            let bt_content1 = element_bt.nodeType === Node.TEXT_NODE ? element_bt.nodeValue : element_bt.innerText;
            if (bt_content1 == '立即签到') {
                // 创建一个 click 事件对象
                let event = new MouseEvent("click", {
                    bubbles: true, // 事件是否冒泡
                    cancelable: true, // 事件是否可取消
                    view: window // 事件的视图
                });

                // 调用按钮元素的 click 方法，或者触发 click 事件
                element_bt.click(); // 或者 button.dispatchEvent(event);
                console.log("自动签到结束");
            } else {
                alert("你早就签到了，无法再自动签到了。");
            }
        });
    }
    //文章
    else if(url_current.indexOf(".xyz/p/") != -1 || url_current.indexOf(".com/p/") != -1){
        function waitForXPath(xpath, callback) {
            var interval = setInterval(function() {
                var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (element) {
                    clearInterval(interval);
                    callback(element);
                }
            }, 100); // 调整轮询间隔
        }
        waitForXPath('//*[@id="app"]/div[2]/div[3]/div/div[1]/div[1]/div/div[1]/div[3]/div[1]/div',function() {
            var xp = '//*[@id="app"]/div[2]/div[3]/div/div[1]/div[1]/div/div[1]/div[3]/div[1]/div';
            var ad = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            ad.parentNode.removeChild(ad);

            var xp2 = '//*[@id="app"]/div[2]/div[3]/div/div[1]/div[2]'
            var ad2 = document.evaluate(xp2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            ad2.parentNode.removeChild(ad2);
        });

    }

})();