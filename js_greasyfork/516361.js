// ==UserScript==
// @name         Auto Bilibili ReLive
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动B站直播重开
// @author       Yorushi
// @match        *://link.bilibili.com/p/center/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516361/Auto%20Bilibili%20ReLive.user.js
// @updateURL https://update.greasyfork.org/scripts/516361/Auto%20Bilibili%20ReLive.meta.js
// ==/UserScript==

(function() {
    //更改开播分区（最近的开播分区区域内容）
    //如果为空则选择最近的第一个开播分区
    //
    const LiveZone = ""
    //定义刷新时间
    const refreshTime = new Date();
    'use strict';
    // 等待页面加载完成
    window.addEventListener('load', () => {
        // 定义目标元素选择器（请根据页面上的元素修改选择器）
        const targetSelector = '.live-btn';
        // 定义定时器，定期检查条件是否满足
        const intervalID = setInterval(() => {
            const targetElement = document.querySelector(targetSelector);

            // 检查目标元素是否存在且满足条件
            if (targetElement && targetElement.innerText === '开始直播') {
                console.log("未直播，将会开播")
                document.querySelector(".category-toggle").click()

                // 获取所有包含 class="dp-i-block p-relative" 的 <a> 标签
                const elements = document.querySelectorAll('a.dp-i-block.p-relative');
                if(LiveZone == ""){
                    console.log("LiveZone为空，默认最近开播分区")
                    elements[0].click();//选择最近开播分区
                }else{
                    // 遍历找到符合条件的元素并点击
                    elements.forEach(element => {
                        const span = element.querySelector('span.name');
                        if (span && span.innerText.includes(LiveZone)) { // 匹配条件
                            element.click(); // 触发点击
                            clearInterval(intervalID); // 停止检查
                        }else{
                            console.log("分区错误，找到分区："+span.innerText)
                        }
                    });
                }
                targetElement.click(); // 触发点击
                console.log("开始直播！")

            }else{
                console.log("正在直播中")
            };
            clearInterval(intervalID); // 停止定时器
        }, 2000); // 每秒检查一次
        setInterval(()=>{
            try{
                document.querySelector('.refreshTime').innerText = "上次自动刷新时间："+refreshTime.toLocaleString()+"("+((new Date().getTime() - refreshTime.getTime())/1000).toFixed(1)+"秒前)";
            }catch{}
        },1000)
        setTimeout(()=>{
            //显示外显刷新时间以及计时
            try{
                const cssDiv = document.querySelector(".live-cpm").attributes[0].name;
                document.querySelector(".live-btn-ctnr").innerHTML += "<div class='live-cpm refreshTime' "+cssDiv+">上次自动刷新时间："+refreshTime.toLocaleString()+"</div>"
            }catch{
                const cssDiv = 'style="display: inline-block;font-size: 14px;line-height: 32px;color: #28ade3;margin-left: 20px;cursor: pointer;vertical-align: middle;"'
                document.querySelector(".live-btn-ctnr").innerHTML += "<div class='live-cpm refreshTime' "+cssDiv+">上次自动刷新时间："+refreshTime.toLocaleString()+"</div>"
            }
        },2000)
        setInterval(()=>{
            //自动页面刷新（刷新数据）
            window.location.reload();
        },55000)
    });
})();
