// ==UserScript==
// @name         简便找元素
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  方便在浏览器找网页元素，其实就是加个mousedown事件然后把event.target设置成window对象的属性值
// @author       太陽闇の力
// @include *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438292/%E7%AE%80%E4%BE%BF%E6%89%BE%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/438292/%E7%AE%80%E4%BE%BF%E6%89%BE%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let count = 0;
    let flag = false;
    const text = ["关闭元素查找","开启元素查找"];
    document.body.addEventListener("mousedown",(e)=>{
        if(flag&&e.which == 1){//左键
            let vname = "a"+count++;
            window[vname] = e.target;
            console.log("变量名：",vname,"\n变量值：",e.target);
        }else if(e.which == 2){//中键
            flag = !flag;
            showMessage(text[flag+0]);
        }
    });
    function showMessage(intext) {
        const div = window.document.createElement('div');
        div.innerText = intext;
        div.style.cssText = 'box-sizing:border-box;width:max-content;padding:0 10px;height:40px;position:fixed;bottom:40px;left:50px;z-index:999;background-color:rgba(255, 255, 0,.2);border-radius:5px;color:#FF0000;font-size:medium;line-height:40px;text-align:center;';
        window.document.body.appendChild(div);
        let st = fadeOut(div, 2000);
        setTimeout((ele) => {
            clearInterval(st);
            ele.remove();
        }, 2000, div);
    }
    function fadeOut(ele,time) {
        let count = 20;
        ele.style.opacity=1;
        return setInterval(function() {
            ele.style.opacity = ele.style.opacity - 1/count;
        }, time/count);
    }
})();