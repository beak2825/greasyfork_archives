// ==UserScript==
// @name         链工宝机构版自动下一集自动挂机批量无人值守视频作业
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  链工宝小助手 使用于链工宝和学历教育云 只做定制化需求
// @author       助手
// @match        https://lgb360.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475988/%E9%93%BE%E5%B7%A5%E5%AE%9D%E6%9C%BA%E6%9E%84%E7%89%88%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E6%89%B9%E9%87%8F%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%E8%A7%86%E9%A2%91%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/475988/%E9%93%BE%E5%B7%A5%E5%AE%9D%E6%9C%BA%E6%9E%84%E7%89%88%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E6%89%B9%E9%87%8F%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%E8%A7%86%E9%A2%91%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var floatingBox = document.createElement('div');
    floatingBox.style.position = 'fixed';
    floatingBox.style.top = '10px';
    floatingBox.style.right = '10px';
    floatingBox.style.width = '200px';
    floatingBox.style.height = '100px';
    floatingBox.style.background = 'rgba(0, 0, 0, 0.5)';
    floatingBox.style.color = '#fff';
    floatingBox.style.fontSize = '16px';
    floatingBox.style.padding = '10px';
    floatingBox.innerHTML = '<span>欢迎使用链工宝小助手</span> <br> 当前状态未登录';

    // 添加拖动功能
    let isDragging = false;
    let mouseOffsetX = 0;
    let mouseOffsetY = 0;

    floatingBox.addEventListener('mousedown', function(event) {
        isDragging = true;
        mouseOffsetX = event.clientX - floatingBox.offsetLeft;
        mouseOffsetY = event.clientY - floatingBox.offsetTop;
    });


    var contactLink = document.createElement('a');
    contactLink.href = 'tencent://message/?uin=65004368';
    contactLink.target = '_blank';
    contactLink.textContent = '联系QQ 65004368 获取机构版本（个人勿扰）';




    floatingBox.appendChild(document.createElement('br')); // 换行
    floatingBox.appendChild(contactLink);


    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            floatingBox.style.top = (event.clientY - mouseOffsetY) + 'px';
            floatingBox.style.left = (event.clientX - mouseOffsetX) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    const MAX_TIMES = 10;
    let times = 0;
    let timer=setInterval(() => {
        console.log($("body > div.video > div.video-box > div.box-in > div.list > div > div.item.active #sPlayRate").text())
        if($("body > div.video > div.video-box > div.box-in > div.list > div > div.item.active #sPlayRate").text() === "100"){
            if(times < MAX_TIMES){
                let $next = $("body > div.video > div.video-box > div.box-in > div.list > div > div.item.active")
                do{
                    $next = $next.next();
                }while($next.children(".body").children("ul").children("li:last-child").children("#sPlayRate").text() === "100")
                times ++;
                $next.children("div").trigger("click")
                console.log("看完"+times+"个视频,下一个");
            }else{
                console.log("看完"+times+"个视频,到达每日限额,停止");
                clearInterval(timer)
            }
        }
    },5000)

    // 美化样式
    floatingBox.style.borderRadius = '5px';
    floatingBox.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    floatingBox.style.cursor = 'move';

    // 将悬浮框添加到页面中
    document.body.appendChild(floatingBox);
})();