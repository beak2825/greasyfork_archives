// ==UserScript==
// @name         东京奥运会 跳过CCTV 1/5/5+ 等频道直播广告 自动调整清晰度 显示实时奖牌数、赛程、新闻
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  跳过CCTV5/5+直播广告
// @author       OUSC
// @match        https://tv.cctv.com/live/*
// @grant        none
// @icon         http://tv.cctv.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/430088/%E4%B8%9C%E4%BA%AC%E5%A5%A5%E8%BF%90%E4%BC%9A%20%E8%B7%B3%E8%BF%87CCTV%20155%2B%20%E7%AD%89%E9%A2%91%E9%81%93%E7%9B%B4%E6%92%AD%E5%B9%BF%E5%91%8A%20%E8%87%AA%E5%8A%A8%E8%B0%83%E6%95%B4%E6%B8%85%E6%99%B0%E5%BA%A6%20%E6%98%BE%E7%A4%BA%E5%AE%9E%E6%97%B6%E5%A5%96%E7%89%8C%E6%95%B0%E3%80%81%E8%B5%9B%E7%A8%8B%E3%80%81%E6%96%B0%E9%97%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/430088/%E4%B8%9C%E4%BA%AC%E5%A5%A5%E8%BF%90%E4%BC%9A%20%E8%B7%B3%E8%BF%87CCTV%20155%2B%20%E7%AD%89%E9%A2%91%E9%81%93%E7%9B%B4%E6%92%AD%E5%B9%BF%E5%91%8A%20%E8%87%AA%E5%8A%A8%E8%B0%83%E6%95%B4%E6%B8%85%E6%99%B0%E5%BA%A6%20%E6%98%BE%E7%A4%BA%E5%AE%9E%E6%97%B6%E5%A5%96%E7%89%8C%E6%95%B0%E3%80%81%E8%B5%9B%E7%A8%8B%E3%80%81%E6%96%B0%E9%97%BB.meta.js
// ==/UserScript==

let definition = "720"; //清晰度设置：null/720/540/480/360

(function() {
    'use strict';
    let interval = setInterval(()=>{
        try{
            let videoElement = document.getElementById("h5player_player");
            if(videoElement && !isNaN(videoElement.currentTime + videoElement.duration)) videoElement.currentTime = videoElement.currentTime + videoElement.duration;
            let tag = document.getElementById("resolution_item_" + definition +"_player");
            if(tag && !!definition) tag.click();
            if(videoElement && tag) {
                showToast("已为您跳过广告并切换至" + definition + 'P清晰度',3000);
                clearInterval(interval);
            }
        } catch(e){
            console.log(e)
        }
    }, 100);
    let iframe = document.createElement('iframe');
    iframe.setAttribute("src", "https://tiyu.baidu.com/tokyoly/home/tab/%E5%A5%96%E7%89%8C%E6%A6%9C");
    iframe.style.cssText = "width: 320px;height: calc(80% - 30px);border: none;display: none;border: 0;position: fixed;right: 0;top: calc(20% + 30px);z-index: 100; background: #3b82eb;";

    document.body.appendChild(iframe);

    let medalButton = document.createElement('div');
    medalButton.style.cssText= "width: 50px;height: 30px; background: #3b82eb;position: fixed;right: 0;top: 20%;z-index: 100;text-align: center;line-height: 30px;color: #FFF;font-weight: bolder;cursor: pointer";
    medalButton.innerHTML = "🏅️奖牌";
    medalButton.onclick = function(){
        if(iframe.style.display == 'none') {
            iframe.setAttribute("src", "");
            setTimeout(()=>{iframe.setAttribute("src", "https://tiyu.baidu.com/tokyoly/home/tab/%E5%A5%96%E7%89%8C%E6%A6%9C")}, 50);
            iframe.style.display = 'block';
            medalButton.innerHTML = "🏅️隐藏";
        }
        else {
            iframe.style.display = 'none';
            medalButton.innerHTML = "🏅️奖牌";
        }
    }
    document.body.appendChild(medalButton);
})();

function showToast(msg, duration){
    duration = isNaN(duration) ? 3000 : duration;
    let m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="width:240px; height: 30px; background:rgba(255, 255, 255, 0.5);color:#fff; line-height:30px; text-align:center; border-radius:4px; position:fixed; bottom:50px; left:0;right: 0;margin: auto; z-index:999999;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}