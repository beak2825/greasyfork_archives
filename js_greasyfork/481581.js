// ==UserScript==
// @name         自动获取Rewards积分
// @namespace    killwall
// @version      0.0.3
// @description  本脚本可用于自动获取微软 Rewards 积分🥵🥵🥵，异步搜索10秒间隔，pc移动通用，详细看教程（非常简单）。
// @author       killwall
// @match        https://cn.bing.com/*
// @match        https://www.bing.com/*
// @icon  	https://api.killwall.top/img/1701925395357.png
// @downloadURL https://update.greasyfork.org/scripts/481581/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96Rewards%E7%A7%AF%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/481581/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96Rewards%E7%A7%AF%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("开始");
    var num = 0;
    const keyword = new Date().getTime();//搜索关键词 使用时间戳保证不重复

    const search = document.getElementById("sb_form_go"); //搜索按钮
    const search_conetnt = document.getElementById("sb_form_q"); //搜索内容
    const div = document.createElement('div');
    const p = document.createElement('p');
    const span = document.createElement('span')
    div.appendChild(p);
    div.appendChild(span);

    div.style.position = 'fixed';
    div.style.top = '150px';
    div.style.left = '10px';
    div.style.background = '#ced6e0';
    div.style.padding = '10px';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.borderRadius = "5px";

    p.innerText = "点击搜索：";
    p.style.color = "#fff";
    p.style.fontWeight = 'bold';

    span.innerText = "0";
    span.style.color = "#ff4757";
    span.style.fontWeight = 'bold';

    num = parseInt(localStorage.getItem('killwall_count'), 10);
     span.innerText = ""+num;
    //调用方法
    open();
    //延时函数
    function sleep(time) {
        time*=1000
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
    //自动搜索函数  加上async 改成异步函数; 在内部使用await sleep()来调用异步延迟
   async function open(){
       await sleep(10);
        if(!isNaN(num)&&num!=0){
            span.innerText = ""+num;
            num = num - 1;
            span.innerText = ""+num;
            localStorage.setItem('killwall_count',num);
            search_conetnt.value = keyword;
            search.click();
        }
    }
    //点击事件监听器
    div.addEventListener('click', function() {
        const search_num = window.prompt('输入搜索次数 移动端20次 pc端30次:');
        num = parseInt(search_num, 10);
        localStorage.setItem('killwall_count',num);
        open();
    });
    document.getElementById('b_header').appendChild(div);
    console.log("结束");
})();

