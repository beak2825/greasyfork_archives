// ==UserScript==
// @name         边缘下滑刷新
// @namespace    https://greasyfork.org/zh-CN/users/954189
// @version      2.7
// @description  山寨自神奇浏览器，效果一般，将就用。
// @author       angao
// @run-at       document-end
// @license       MIT
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/462927/%E8%BE%B9%E7%BC%98%E4%B8%8B%E6%BB%91%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/462927/%E8%BE%B9%E7%BC%98%E4%B8%8B%E6%BB%91%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function EdgeSlideRefresh() {
'use strict';

//下拉刷新距离
const Sliderefreshdistance = 140;

let startY = null;
let endY = null;

//注入CSS
var style = document.createElement('style');
style.innerHTML = `
.Refresh_Icon {
    width: 42px;
    height: 42px;
    border-radius: 8px;
    position: fixed;
    left: 50%;
    transform: translate(-50%,0) translateZ(0);
    box-Shadow : 0 0 10px rgba(0, 0, 0, 0.1);
    top: -42px;
    align-items: center;
    justify-content: center;
    z-index: 99999999;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.05s ease-out;
}
.Refresh_Icon svg {
  width: 28px;
  height: 28px;
  margin: 0;
}
`;
document.head.appendChild(style);

// 创建DOM绑定方法
const Icon = document.createElement('div')
Icon.className = 'Refresh_Icon'
Icon.innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/> </svg>`;

//默认隐藏
Icon.style.display = 'none';
document.body.appendChild(Icon);

//记录触摸点的纵坐标
document.addEventListener('touchstart', function(e) {
    if (e.touches[0].clientX < window.innerWidth/15 || e.touches[0].clientX > window.innerWidth/15*14) {
        startY = e.touches[0].clientY;
        Icon.style.display = 'flex';
    }
});

//下滑时阻止网页滑动，并使刷新图标随之下移、旋转
document.addEventListener('touchmove', function(e) {
    if (startY !== null) {
        e.preventDefault();
        let distance = e.touches[0].clientY - startY;
        let maxDistance = Sliderefreshdistance * 0.85; // 最大下滑距离
        let slowDownStart = Sliderefreshdistance * 0.6; // 开始减速的位置
        let slowDownRate = 0.2; // 减速比率
        if (distance < Sliderefreshdistance) {
          Icon.querySelector('svg').style.fill = 'black';
        } 
        else {
          Icon.querySelector('svg').style.fill = 'darkred';
        }
        if (distance > slowDownStart) {
          distance = slowDownStart + (distance - slowDownStart) * slowDownRate;
        }
        distance = Math.min(distance, maxDistance);
        Icon.style.transform = `translate(-50%, ${distance / 1.35}px) rotate(${distance * 2}deg)`;
    }
}, { passive: false });

//记录离开点，并使刷新图标返回
document.addEventListener('touchend', function(e) {
    if (startY !== null ) {
      endY = e.changedTouches[0].clientY;
// 向下滑动超过140像素则刷新
    if (endY - startY > Sliderefreshdistance) {
        setTimeout(function() {
         location.reload();
        }, 250);
    }
    Icon.style.transition = 'all 0.5s';
    Icon.style.transform = 'translate(-50%, -42px)';
    setTimeout(() => {
        Icon.style.transition = '';
    }, 200);
    startY = null;
    endY = null;
    }
});


})();