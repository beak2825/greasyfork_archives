// ==UserScript==
// @name         云绘平台交通灯验收助手测试版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过点击按钮自动选择预设好的数据
// @author       You
// @match        https://worker.mach-drive.com/*
// @icon         https://worker.mach-drive.com/img/logo.bb8a363e.svg
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538982/%E4%BA%91%E7%BB%98%E5%B9%B3%E5%8F%B0%E4%BA%A4%E9%80%9A%E7%81%AF%E9%AA%8C%E6%94%B6%E5%8A%A9%E6%89%8B%E6%B5%8B%E8%AF%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/538982/%E4%BA%91%E7%BB%98%E5%B9%B3%E5%8F%B0%E4%BA%A4%E9%80%9A%E7%81%AF%E9%AA%8C%E6%94%B6%E5%8A%A9%E6%89%8B%E6%B5%8B%E8%AF%95%E7%89%88.meta.js
// ==/UserScript==

(function() {
let observer;
window.addEventListener('load', () => {
    function showAutoCloseAlert(message) {
        // 创建消息容器
        const alertBox = document.createElement('div');
        alertBox.style.cssText = `
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 25px;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  `;
        alertBox.textContent = message;

        // 添加到页面
        document.body.appendChild(alertBox);

        // 2秒后自动移除
        setTimeout(() => {
            alertBox.remove();
        }, 2000); // 2000毫秒 = 2秒
    };

    function addGlobalStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    };
    addGlobalStyle(`
        .red-circle {
            width: 20px;
            height: 20px;
            background-color: red;
            border-radius: 50%; /* 使元素成为圆形 */
            display: inline-block; /* 使元素可以像文本一样在行内显示 */
        }
        .yellow-circle {
            width: 20px;
            height: 20px;
            background-color: yellow;
            border-radius: 50%; /* 使元素成为圆形 */
            display: inline-block; /* 使元素可以像文本一样在行内显示 */
        }
        .green-circle {
            width: 20px;
            height: 20px;
            background-color: green;
            border-radius: 50%; /* 使元素成为圆形 */
            display: inline-block; /* 使元素可以像文本一样在行内显示 */
        }
        .black-circle {
            width: 20px;
            height: 20px;
            background-color: black;
            border-radius: 50%; /* 使元素成为圆形 */
            display: inline-block; /* 使元素可以像文本一样在行内显示 */
        }
    `);

    const script = function(){
        let isTextChanging = false;
        const targetSpan = document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div:nth-child(3) > div > div.sidebar-search-layer-item.sidebar-search-layer-item-index");
        const observer = new MutationObserver((mutations)=>{
            mutations.forEach((mutation)=>{
                if(mutation.type === 'childList'){
                    if(isTextChanging){
                        const parent = document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(1)")
                        //四个灯-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        //红黑黑黑
                        const myButton1000 = 'myButton1000';
                        if(!document.getElementById(myButton1000)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton1000+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="red-circle"></div><div class="black-circle"></div><div class="black-circle"></div><div class="black-circle"></div></button>');
                            document.getElementById(myButton1000).addEventListener('click', function() {
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="4";//四个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(1)").click();//红
                                for(let i=1;i<5;i++){if(i===1){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(4)").click();//无法分类
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(11)").style.display='none';
                            });
                        };
                        //黑黑黑黑
                        const myButton0000 = 'myButton0000';
                        if(!document.getElementById(myButton0000)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton0000+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="black-circle"></div><div class="black-circle"></div><div class="black-circle"></div><div class="black-circle"></div></button>');
                            document.getElementById(myButton0000).addEventListener('click', function() {
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="4";//四个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(11)").style.display='none';
                            });
                        };
                        //换行
                        const br1 = 'br1';
                        if(!document.getElementById(br1)){
                            parent.insertAdjacentHTML('beforeend','<br id='+br1+'><hr style="margin:5px 0;background: linear-gradient(to right, blue, purple);">');
                        };
                        //三个灯------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        //红黑黑
                        const myButton100 = 'myButton100';
                        if(!document.getElementById(myButton100)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton100+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="red-circle"></div><div class="black-circle"></div><div class="black-circle"></div></button>');
                            document.getElementById(myButton100).addEventListener('click', function() {
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="3";//三个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(1)").click();//红
                                for(let i=1;i<5;i++){if(i===1){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(4)").click();//无法分类
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(11)").style.display='none';
                            });
                        };
                        //红红黑
                        const myButton110 = 'myButton110';
                        if(!document.getElementById(myButton110)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton110+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="red-circle"></div><div class="red-circle"></div><div class="black-circle"></div></button>');
                            document.getElementById(myButton110).addEventListener('click', function() {
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="3";//三个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(1)").click();//红
                                for(let i=1;i<5;i++){if(i===1){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child(1)").click();//红
                                for(let i=1;i<5;i++){if(i===1){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(4)").click();//无法分类
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child(16)").click();//倒计时
                                for(let i=1;i<18;i++){if(i===16){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                            });
                        };
                        //黑黑绿
                        const myButton003 = 'myButton003';
                        if(!document.getElementById(myButton003)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton003+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="black-circle"></div><div class="black-circle"></div><div class="green-circle"></div></button>');
                            document.getElementById(myButton003).addEventListener('click', function() {
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="3";//三个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child(3)").click();//绿
                                for(let i=1;i<5;i++){if(i===3){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9) > div > label:nth-child(4)").click();//无法分类
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(11)").style.display='none';
                            });
                        };
                        //黑绿绿
                        const myButton033 = 'myButton033';
                        if(!document.getElementById(myButton033)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton033+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="black-circle"></div><div class="green-circle"></div><div class="green-circle"></div></button>');
                            document.getElementById(myButton033).addEventListener('click', function() {
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="3";//三个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child(3)").click();//绿
                                for(let i=1;i<5;i++){if(i===3){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child(3)").click();//绿
                                for(let i=1;i<5;i++){if(i===3){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child(16)").click();//倒计时
                                for(let i=1;i<18;i++){if(i===16){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9) > div > label:nth-child(4)").click();//无法分类
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                            });
                        };
                        //黑黑黑
                        const myButton000 = 'myButton000';
                        if(!document.getElementById(myButton000)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton000+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="black-circle"></div><div class="black-circle"></div><div class="black-circle"></div></button>');
                            document.getElementById(myButton000).addEventListener('click', function() {
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="3";//三个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child(4)").click();//黑
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child('+i+')').style.display='none'}
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9) > div > label:nth-child(15)").click();//熄灭
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9) > div > label:nth-child('+i+')').style.display='none'};
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(11)").style.display='none';
                            });
                        };
                        //换行
                        const br2 = 'br2';
                        if(!document.getElementById(br2)){
                            parent.insertAdjacentHTML('beforeend','<br id='+br2+'><hr style="margin:5px 0;background: linear-gradient(to right, blue, purple);">');
                        };
                        //两个灯-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        //红黑
                        const myButton10 = 'myButton10';
                        if(!document.getElementById(myButton10)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton10+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="red-circle"></div><div class="black-circle"></div></button>');
                            document.getElementById(myButton10).addEventListener('click', function() {
                                //两个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="2";
                                //红
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(1)").click();
                                for(let i=1;i<5;i++){if(i===1){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                //黑
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child(4)").click();
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child('+i+')').style.display='none'}
                                //无法分类
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(4)").click();
                                //熄灭
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child(15)").click();
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child('+i+')').style.display='none'};
                                //隐藏其他
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(11)").style.display='none';
                            });
                        };
                        //红红
                        const myButton11 = 'myButton11';
                        if(!document.getElementById(myButton11)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton11+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="red-circle"></div><div class="red-circle"></div></button>');
                            document.getElementById(myButton11).addEventListener('click', function() {
                                //两个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="2";
                                //红
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(1)").click();
                                for(let i=1;i<5;i++){if(i===1){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                //红
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child(1)").click();
                                for(let i=1;i<5;i++){if(i===1){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child('+i+')').style.display='none'}
                                //无法分类
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(4)").click();
                                //无法分类
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child(4)").click();
                                //隐藏其他
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                            });
                        };
                        //黑绿
                        const myButton03 = 'myButton03';
                        if(!document.getElementById(myButton03)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton03+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="black-circle"></div><div class="green-circle"></div></button>');
                            document.getElementById(myButton03).addEventListener('click', function() {
                                //两个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="2";
                                //黑
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(4)").click();
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                //绿
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child(3)").click();
                                for(let i=1;i<5;i++){if(i===3){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child('+i+')').style.display='none'}
                                //熄灭
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(15)").click();
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child('+i+')').style.display='none'}
                                //无法分类
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child(4)").click();
                                //隐藏其他
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(11)").style.display='none';
                            });
                        };
                        //绿绿
                        const myButton33 = 'myButton33';
                        if(!document.getElementById(myButton33)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton33+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="green-circle"></div><div class="green-circle"></div></button>');
                            document.getElementById(myButton33).addEventListener('click', function() {
                                //两个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="2";
                                //绿
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(3)").click();
                                for(let i=1;i<5;i++){if(i===3){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                //绿
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child(3)").click();
                                for(let i=1;i<5;i++){if(i===3){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child('+i+')').style.display='none'}
                                //无法分类
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(4)").click();
                                //无法分类
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child(4)").click();
                                //隐藏其他
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                            });
                        };
                        //黑黑
                        const myButton00 = 'myButton00';
                        if(!document.getElementById(myButton00)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton00+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="black-circle"></div><div class="black-circle"></div></button>');
                            document.getElementById(myButton00).addEventListener('click', function() {
                                //两个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="2";
                                //黑
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(4)").click();
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                //黑
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child(4)").click();
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4) > div > label:nth-child('+i+')').style.display='none'}
                                //熄灭
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(15)").click();
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child('+i+')').style.display='none'}
                                //熄灭
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child(15)").click();
                                for(let i=1;i<18;i++){if(i===15){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8) > div > label:nth-child('+i+')').style.display='none'}
                                //隐藏其他
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(11)").style.display='none';
                            });
                        };
                        //换行
                        const br3 = 'br3';
                        if(!document.getElementById(br3)){
                            parent.insertAdjacentHTML('beforeend','<br id='+br3+'><hr style="margin:5px 0;background: linear-gradient(to right, blue, purple);">');
                        };
                        //一个灯-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        //红
                         const myButton1 = 'myButton1';
                        if(!document.getElementById(myButton1)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton1+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="red-circle"></div></button>');
                            document.getElementById(myButton1).addEventListener('click', function() {
                                //一个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="1";
                                //红
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(1)").click();
                                for(let i=1;i<5;i++){if(i===1){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                //文字灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(17)").click();
                                for(let i=1;i<18;i++){if(i===17){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child('+i+')').style.display='none'};
                                //隐藏其他
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(11)").style.display='none';
                            });
                        };
                        //黄
                         const myButton2 = 'myButton2';
                        if(!document.getElementById(myButton2)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton2+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="yellow-circle"></div></button>');
                            document.getElementById(myButton2).addEventListener('click', function() {
                                //一个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="1";
                                //黄
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(2)").click();
                                for(let i=1;i<5;i++){if(i===2){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                //文字灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(17)").click();
                                for(let i=1;i<18;i++){if(i===17){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child('+i+')').style.display='none'};
                                //隐藏其他
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(11)").style.display='none';
                            });
                        };
                        //绿
                         const myButton3 = 'myButton3';
                        if(!document.getElementById(myButton3)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton3+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="green-circle"></div></button>');
                            document.getElementById(myButton3).addEventListener('click', function() {
                                //一个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="1";
                                //绿
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(3)").click();
                                for(let i=1;i<5;i++){if(i===3){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                //文字灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(17)").click();
                                for(let i=1;i<18;i++){if(i===17){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child('+i+')').style.display='none'};
                                //隐藏其他
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(11)").style.display='none';
                            });
                        };
                        //黑
                         const myButton0 = 'myButton0';
                        if(!document.getElementById(myButton0)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton0+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#f5f2f0;background-color:#f5f2f0;height:30px;padding-top:5px;padding-left:5px"><div class="black-circle"></div></button>');
                            document.getElementById(myButton0).addEventListener('click', function() {
                                //一个灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(2) > div > input[type=text]").value="1";
                                //黑
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child(4)").click();
                                for(let i=1;i<5;i++){if(i===4){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(3) > div > label:nth-child('+i+')').style.display='none'};
                                //文字灯
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child(17)").click();
                                for(let i=1;i<18;i++){if(i===17){continue;};document.querySelector('#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(7) > div > label:nth-child('+i+')').style.display='none'};
                                //隐藏其他
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(4)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(5)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(6)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(8)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(9)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(10)").style.display='none';
                                document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(11)").style.display='none';
                            });
                        };
                    };
                    isTextChanging = !isTextChanging;
                };
            });
        });
        const cfg = {childList:true};
        observer.observe(targetSpan,cfg);
    };
    setTimeout(()=>{showAutoCloseAlert("脚本加载成功");;document.querySelector("#marking-area > div.label-tool-header > div.label-tool-header-menu > div > div.accptance-area > div.accptance-tabs > div:nth-child(2)").addEventListener('click',()=>{setTimeout(()=>{script();},3000);});},4000);
});
})();