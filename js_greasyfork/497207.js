// ==UserScript==
// @name         抖音网页直播点赞
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  这是一个基于抖音直播的自动点赞脚本，使用了别人的改了下代码
// @author       叶子宇吖
// @match        *://live.douyin.com/*
// @icon         https://www.erkechloe.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497207/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%9B%B4%E6%92%AD%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/497207/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%9B%B4%E6%92%AD%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

        let page = document.getElementsByTagName('body')[0];
        console.log('page',page)
        let kolento = document.createElement("p");
        kolento.className="kolento";
        kolento.innerHTML='开始<br/>点赞'
        page.append(kolento);

        let total = document.createElement("div");
        total.className="total";
        total.innerHTML='<p class="text">点击数：</p><p class="kolento-all">0</p>';
        page.append(total);

        var timeBox;
        let totalNum = 0;
        let num = document.getElementsByClassName('kolento-all')[0];
        console.log('num',num);
        num.innerHTML=totalNum;

        let target = document.getElementsByClassName('LO5TGkc0')


        kolento.onclick=function(){
            if(kolento.innerHTML.indexOf('开始')>-1){
                // 执行点赞脚本
                console.log('执行点赞脚本')
                kolento.innerHTML='停止<br/>点赞'


 
                    timeBox = setInterval(()=>{
                        totalNum++;
                        num.innerHTML=totalNum;
                        target[0].click();
                    },50)


            }else{
                console.log('停止点赞');
                clearInterval(timeBox);
                kolento.innerHTML='开始<br/>点赞'
            }
        }

        function addGlobalStyle(css) {
            var head, style;
            head = document.getElementsByTagName('head')[0];
            if (!head) { return; }
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        }

        addGlobalStyle(
            `.kolento {
                content: '';
                font-size: 14px;
                position: fixed;
                top: 70px;right: 30px;
                z-index: 500;
                cursor: pointer;
                background: linear-gradient(90deg,#f4c8c7 0,#0c61bb 45%,#0c61bb 55%,#fcc6c6)!important;
                border-radius: 50%;
                color: #fff;
                display: block;
                width: 46px;height: 46px;
                line-height: 16px;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all ease 0.3s;

            }
            .kolento:hover {
                background-color: #4abf8a;
                transform: rotate(360deg)
            }


            .total {
                font-size: 14px;
                position: fixed;
                top: 79px;
                right: 85px;
                z-index: 500;
                background: linear-gradient(90deg,#f4c8c7 0,#0c61bb 45%,#0c61bb 55%,#fcc6c6)!important;
                color: #fff;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all ease 0.3s;
                padding: 5px 8px;
                border-radius: 20px;
 
            }
            .total p {
                color:#fff;
            }

            `
        );







})();

