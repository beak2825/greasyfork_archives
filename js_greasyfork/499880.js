// ==UserScript==
// @name         下滑刷新•改2
// @namespace    http://tampermonkey.net/
// @version      2.7.4.1
// @description  对边缘下滑刷新•改脚本进行的更改：全局下滑
// @author       angao & jiange1236
// @run-at       document-start
// @license       MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499880/%E4%B8%8B%E6%BB%91%E5%88%B7%E6%96%B0%E2%80%A2%E6%94%B92.user.js
// @updateURL https://update.greasyfork.org/scripts/499880/%E4%B8%8B%E6%BB%91%E5%88%B7%E6%96%B0%E2%80%A2%E6%94%B92.meta.js
// ==/UserScript==

(function EdgeSlideRefresh() {
'use strict';
// 获取屏幕宽度和高度
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;
 
//下拉刷新距离
let Sliderefreshdistance = screenHeight * 1/3;
 
let startY = null;
let endY = null;
 
//注入CSS
var style = document.createElement('style');
document.head.appendChild(style);
 
function refreshSize() {
// 旋转后重载获取屏幕宽度和高度
screenWidth = window.innerWidth;
screenHeight = window.innerHeight;
 
//旋转后重载下拉刷新距离
Sliderefreshdistance = screenHeight * 1/3;
 
 
style.innerHTML = `
.Refresh_Icon {
    width: ${screenWidth / 10}px;
    height: ${screenWidth / 10}px;
    border-radius: 8px;
    position: fixed;
    left: 50%;
    transform: translate(-50%,0) translateZ(0);
    box-Shadow : 0 0 10px rgba(0, 0, 0, 0.1);
    top: ${screenWidth / -10}px;
    align-items: center;
    justify-content: center;
    z-index: 99999999999;
    background-color: white;
    border-radius: 50%;
    transition: transform .05s ease-out;
}
.Refresh_Icon svg {
  width: ${screenWidth / 12}px;
  height: ${screenWidth / 12}px;
  margin: 0;
}
`;
}
 
refreshSize();
// 旋转时更新
screen.orientation.addEventListener("change", refreshSize);
 
// 创建DOM绑定方法
const Icon = document.createElement('div')
Icon.className = 'Refresh_Icon'
Icon.innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/> </svg>`;
 
//默认隐藏
Icon.style.display = 'none';
document.body.appendChild(Icon);
 
//记录触摸点的纵坐标
document.addEventListener('touchstart', function(e) {
    var target = e.target;
    while (target && target !== document.body) {
        target = target.parentNode;
    }
    if ( e.touches[0].clientY < screenHeight * 2/5 && target === document.body) {
//        if (e.touches[0].clientX < 42 || e.touches[0].clientX > screenWidth - 42){
            startY = e.touches[0].clientY;
            Icon.style.display = 'flex';
//        }
    }
    else {
        startY = null;
    }
});
 
//下滑时阻止网页滑动，并使刷新图标随之下移、旋转
document.addEventListener('touchmove', function(e) {
    if (startY !== null && startY < screenHeight * 2/5) {
        e.preventDefault();
        let distance = e.touches[0].clientY - startY;
        let turnone = distance/screenHeight;
        let maxDistance = Sliderefreshdistance * 0.7; // 最大下滑距离
        let slowDownStart = Sliderefreshdistance * 0.5; // 开始减速的位置
        let slowDownRate = 0.2; // 减速比率
        if (distance < Sliderefreshdistance) {
                  Icon.querySelector('svg').style.fill = 'black';
        } 
        else {
             Icon.querySelector('svg').style.fill = 'blue';
        }
        if (distance > slowDownStart) {
            distance = slowDownStart + (distance - slowDownStart) * slowDownRate;
        }
        distance = Math.min(distance, maxDistance);
        Icon.style.transform = screenHeight>screenWidth ? `translate(-50%, ${distance/1.7}px) rotate(${turnone * 4}turn)` : `translate(-50%, ${distance*1.4}px) rotate(${turnone * 3}turn)`;
        }
}, { passive: false });
 
//记录离开点，并使刷新图标返回
document.addEventListener('touchend', function(e) {
    if (startY !== null) {
        endY = e.changedTouches[0].clientY;
        // 向下滑动超过刷新距离则刷新
        if (endY - startY > Sliderefreshdistance) {
            setTimeout(function() {
                location.reload();
            }, 20);
        }
        else if (endY == null) {
            distance = 0;
        }
        Icon.style.transition = 'all 0.5s';
        Icon.style.transform = 'translate(-50%, -42px)';
        setTimeout(() => {
            Icon.style.transition = '';
        }, 20);
        startY = null;
        endY = null;
    }
}); 
})();