// ==UserScript==
// @name 蓝狐左侧滚动条自动滚动
// @description 蓝狐左侧滚动条自动滚动--产品页面
// @require    https://cdn.jsdelivr.net/npm/jquery@1.11.3/dist/jquery.min.js
// @match        https://lanhuapp.com/web/#/item/project/product*
// @grant       ao
// @run-at document-end
// @version 1.0.1.20160102053326
// @namespace https://greasyfork.org/users/25818
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542148/%E8%93%9D%E7%8B%90%E5%B7%A6%E4%BE%A7%E6%BB%9A%E5%8A%A8%E6%9D%A1%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542148/%E8%93%9D%E7%8B%90%E5%B7%A6%E4%BE%A7%E6%BB%9A%E5%8A%A8%E6%9D%A1%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

$(function(){
    // 开始


  const observer = new MutationObserver((mutations) => {
    const elementCheck = document.querySelector('.lan-dnd-item-box');
          let element = $('.tree-item-wrapper.active');

    if (elementCheck && element.length > 0) {
        console.log('搜索栏已加载');
        observer.disconnect(); // 停止观察


      setTimeout(function (){

                // 执行操作
console.log('开始滚动')
        element = element.get(0)
  console.log('element', element)
// 获取元素相对于文档顶部的位置
const elementTop = element.getBoundingClientRect().top + window.scrollY;
const elementHeight = element.getBoundingClientRect().height;
const windowHeight = window.innerHeight;

$('.vertical.lan-tree-list').get(0).scrollTo({
  top: elementTop - windowHeight / 2 + elementHeight / 2,
  behavior: 'smooth'
});


	console.log('滚动条自动滚动完成');

      }, 1000)


    }
});

// 开始观察DOM变化
observer.observe(document.body, {
    childList: true,      // 监听子节点变化
    subtree: true         // 监听所有后代节点
});

// 超时处理（可选）
setTimeout(() => {
    observer.disconnect();
    if (!document.querySelector('.search-bar')) {
        console.error('搜索栏加载超时');
    }
}, 100000); // 10秒超时





})