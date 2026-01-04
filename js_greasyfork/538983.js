// ==UserScript==
// @name         云绘平台交通灯验收助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过点击按钮自动选择预设好的数据
// @author       You
// @match        https://worker.mach-drive.com/*
// @icon         https://worker.mach-drive.com/img/logo.bb8a363e.svg
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538983/%E4%BA%91%E7%BB%98%E5%B9%B3%E5%8F%B0%E4%BA%A4%E9%80%9A%E7%81%AF%E9%AA%8C%E6%94%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/538983/%E4%BA%91%E7%BB%98%E5%B9%B3%E5%8F%B0%E4%BA%A4%E9%80%9A%E7%81%AF%E9%AA%8C%E6%94%B6%E5%8A%A9%E6%89%8B.meta.js
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

    const script = function(){
        let isTextChanging = false;
        const targetSpan = document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div:nth-child(3) > div > div.sidebar-search-layer-item.sidebar-search-layer-item-index");
        const observer = new MutationObserver((mutations)=>{
            mutations.forEach((mutation)=>{
                if(mutation.type === 'childList'){
                    if(isTextChanging){
                        const parent = document.querySelector("#meglabel-tool > div > div > div.tool-container-sidebar > div.sidebar-item.sidebar-attrs > div.sidebar-attrs-tab > div.sidebar-attrs-container.active > ol > li:nth-child(1)")
                        //三个灯------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        //按钮（红黑黑）
                        const myButton100 = 'myButton100';
                        if(!document.getElementById(myButton100)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton100+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#999999;background-color:#ffffff;font-size:14px;text-align:center;height:30px;line-height:30px;"><span style="color:black"><span style="color:red">红</span>黑黑</span></button>');
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
                        //按钮（红红黑）
                        const myButton110 = 'myButton110';
                        if(!document.getElementById(myButton110)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton110+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#999999;background-color:#ffffff;font-size:14px;text-align:center;height:30px;line-height:30px;"><span style="color:black"><span style="color:red">红红</span>黑</span></button>');
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
                        //按钮（黑黑绿）
                        const myButton003 = 'myButton003';
                        if(!document.getElementById(myButton003)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton003+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#999999;background-color:#ffffff;font-size:14px;text-align:center;height:30px;line-height:30px;"><span style="color:black">黑黑<span style="color:green">绿</span></span></button>');
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
                        //按钮（黑绿绿）
                        const myButton033 = 'myButton033';
                        if(!document.getElementById(myButton033)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton033+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#999999;background-color:#ffffff;font-size:14px;text-align:center;height:30px;line-height:30px;"><span style="color:black">黑<span style="color:green">绿绿</span></span></button>');
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
                        //按钮（黑黑黑）
                        const myButton000 = 'myButton000';
                        if(!document.getElementById(myButton000)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton000+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#999999;background-color:#ffffff;font-size:14px;text-align:center;height:30px;line-height:30px;"><span style="color:black">黑黑黑</span></button>');
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
                        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        //两个灯
                        //按钮（红黑）
                        const myButton10 = 'myButton10';
                        if(!document.getElementById(myButton10)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton10+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#999999;background-color:#ffffff;font-size:14px;text-align:center;height:30px;line-height:30px;"><span style="color:black"><span style="color:red">红</span>黑</span></button>');
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
                        //按钮（红红）
                        const myButton11 = 'myButton11';
                        if(!document.getElementById(myButton11)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton11+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#999999;background-color:#ffffff;font-size:14px;text-align:center;height:30px;line-height:30px;"><span style="color:black"><span style="color:red">红红</span></span></button>');
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
                        //按钮（黑绿）
                        const myButton03 = 'myButton03';
                        if(!document.getElementById(myButton03)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton03+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#999999;background-color:#ffffff;font-size:14px;text-align:center;height:30px;line-height:30px;"><span style="color:black">黑<span style="color:green">绿</span></span></button>');
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
                        //按钮（绿绿）
                        const myButton33 = 'myButton33';
                        if(!document.getElementById(myButton33)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton33+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#999999;background-color:#ffffff;font-size:14px;text-align:center;height:30px;line-height:30px;"><span style="color:black"><span style="color:green">绿绿</span></span></button>');
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
                        //按钮（黑黑）
                        const myButton00 = 'myButton00';
                        if(!document.getElementById(myButton00)){
                            parent.insertAdjacentHTML('beforeend','<button id='+myButton00+' style="margin-top:10px;margin-left:5px;border:1px solid;border-color:#999999;background-color:#ffffff;font-size:14px;text-align:center;height:30px;line-height:30px;"><span style="color:black">黑黑</span></button>');
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
                        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    }
                    isTextChanging = !isTextChanging;
                }
            });
        });
        const cfg = {childList:true};
        observer.observe(targetSpan,cfg);
    };
    setTimeout(()=>{showAutoCloseAlert("脚本加载成功");;document.querySelector("#marking-area > div.label-tool-header > div.label-tool-header-menu > div > div.accptance-area > div.accptance-tabs > div:nth-child(2)").addEventListener('click',()=>{setTimeout(()=>{script();},3000);});},4000);
});
})();