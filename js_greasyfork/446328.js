// ==UserScript==
// @name         返回顶部按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于网页返回顶部的按钮
// @author       liangxin
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446328/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/446328/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.body.innerText.indexOf("顶部")>=0){
     return ;
    }
    // Your code here...
// 设置 返回顶部按钮
// 设置 返回顶部按钮
const top_btn = document.createElement("div");
top_btn.style.width = "30px";
top_btn.style.height = "30px";
top_btn.style.position = "fixed";
top_btn.style.bottom = "20px";
top_btn.style.right = "10px";
top_btn.style.borderRadius = "50%";
top_btn.style.cursor = "pointer";
top_btn.style.border = "1px solid #ccc";
top_btn.style.padding = "5px 5px";
top_btn.style.textAlign = "center";
top_btn.style.justifyContent = "center";
top_btn.style.alignItems = "center";
top_btn.style.zIndex="9999";
top_btn.style.display="none";

// 按钮内的图片
let top_btn_img = new Image();
top_btn_img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAV1BMVEUAAAD///+ZzMyiormqqqqenqqenq2cnKycnKuanaucnKybm6qanKubm6ybm6uamquZm6qamqqam6qZm6uam6qZm6qam6uZmqqam6qam6uam6qam6uZmqoxcLilAAAAHHRSTlMAAQULDBUiMUNJTVRYWXCJiqK4y9vi4+To8vn+j9Nb+AAAANRJREFUSMftVMkWgyAMdBeXuiOK/P93thF9TypL7K22c0CQCSEzgOf98TPIRoHEmK0BaP4r4rOAy1u6Kwo2Flf41SLEUqHpfi1VrH0cP2h33dsAww874M4ztF3o5sc9MKc0neDbxy5+MgBvSI49G47r7rlsfCJ3HslRJKshZn7JVW2kXry02SVEc1Dfb+CPwUL95HkRV/oH11toLpBoLbRJqLPQbtJ51nUM3vOrdumgVphz91HeNMzXATMpfXaJrX2Ku45gIZUvH6OoC19Qdu+X76vwBA+NK4QPprB5AAAAAElFTkSuQmCC";
top_btn_img.style.width = "80%";
top_btn_img.style.height = "80%";
top_btn.appendChild(top_btn_img);

// 按钮内的文字
const top_btn_text = document.createElement("p");
top_btn_text.innerHTML = "返回<br/>顶部"
top_btn_text.style.textAlign = "center";
top_btn_text.style.width = "100%";
top_btn_text.style.height = "100%";
top_btn_text.style.margin = 0;
top_btn_text.style.padding = 0;
top_btn.style.color = "#999aaa";
top_btn_text.style.fontSize = "12px";
top_btn_text.style.userSelect = "none";
top_btn_text.style.lineHeight = "14px";
top_btn_text.style.textJustify = "center";
top_btn_text.style.justifyContent = "center";
top_btn_text.style.alignItems = "center";

top_btn.appendChild(top_btn_text);


// 按钮的 样式
const top_btn_className = "top_btn_" + new Date().getTime();
top_btn.classList.add(top_btn_className);

let top_btn_style = document.createElement('style');
document.head.appendChild(top_btn_style);
const sheet = top_btn_style.sheet;
// js 向style 标签中添加元素
sheet.addRule(`.${top_btn_className}`, "background-color:#fff")

sheet.addRule(`.${top_btn_className} p`, "display:none")
sheet.addRule(
    `.${top_btn_className}:hover img`, 'display:none');

sheet.addRule(
    `.${top_btn_className}:hover p`, 'display:block');

//将 按钮 加入 dom
document.body.appendChild(top_btn);

// 返回顶部事件
top_btn.addEventListener("click", () => {
    toTop();
})

// 监听 混动条 滚动
window.onscroll = () => {
    let max = 100;
    // 高度 低于 100 时 隐藏, 高于 100时 显示
    if (document.documentElement.scrollTop < max) {
        top_btn.style.display = "none";
    } else {
        top_btn.style.display = "block";
    }
}

// 事件状态, 避免多次执行
let btnStatus=0;
let i=0;

/**
 * 指定毫秒数后, 到达页面顶部
 * 特点为: 有滚动过程, 不突兀
 * @param ms 毫秒数 默认 100毫秒
 */
function toTop1(ms = 100) {
    i=0;
    if(btnStatus==1){
     return false;
    }

    btnStatus=1;
    // 获取 当前 距离顶部长度
    let scrollTop = document.documentElement.scrollTop;
    // 计算 每次应该 执行的 步长 总长度 / 执行步数(总时长/计时器间隔时长)
    let stepLength = scrollTop / (ms / 10);
    // 开启定时器 执行
    let x_Interval = window.setInterval(() => {
        document.documentElement.scrollBy(0, -stepLength);
        console.log(i++,document.documentElement.scrollTop,stepLength);
        // 当到达顶部后, 结束计时器, 停止执行
        if (document.documentElement.scrollTop <= 0) {
            btnStatus=0;
            clearInterval(x_Interval);
        }
    }, 10);
}

/**
 * 无滚动效果, 但是兼容性强
 *
 */
function toTop() {
    i=0;
    if(btnStatus==1){
     return false;
    }

    btnStatus=1;
    // 获取 当前 距离顶部长度
    let scrollTop = document.documentElement.scrollTop;
    document.documentElement.scrollBy(0, -scrollTop);
    btnStatus=0;

}
})();