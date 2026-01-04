// ==UserScript==
// @name 腾讯codesign左侧滚动条自动滚动
// @description 腾讯codesign左侧滚动条自动滚动--左侧目录
// @require    https://cdn.jsdelivr.net/npm/jquery@1.11.3/dist/jquery.min.js
// @match        https://codesign.qq.com/app/s*
// @grant       ao
// @run-at document-end
// @version 1.0.4.20160102053326
// @license MIT
// @namespace https://greasyfork.org/users/25818
// @downloadURL https://update.greasyfork.org/scripts/543398/%E8%85%BE%E8%AE%AFcodesign%E5%B7%A6%E4%BE%A7%E6%BB%9A%E5%8A%A8%E6%9D%A1%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543398/%E8%85%BE%E8%AE%AFcodesign%E5%B7%A6%E4%BE%A7%E6%BB%9A%E5%8A%A8%E6%9D%A1%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

$(function () {



// 1. 创建或获取 style 标签
let style = document.createElement('style');
document.head.appendChild(style);

// 2. 向 style 中添加针对 .icon-v2-page:before 的样式规则
// 语法：.icon-v2-page:before { 样式属性 }
const cssRule = `.icon-v2-page:before { 
  color: green;  /* 示例：修改颜色 */
  /* 可添加其他样式属性，如 background、padding 等 */
}`;

// 3. 将样式规则插入到 style 标签中
style.appendChild(document.createTextNode(cssRule));










    // 处理锚点定位和点击
    function handleAnchorNavigation(anchor) {
        if (!anchor) return;

        console.log(`尝试定位锚点: ${anchor}`);
        // 查找具有对应data-value的元素
        const targetElement = $(`.t-tree__list [data-value="${anchor}"]`).first();

        if (targetElement.length) {
            console.log(`找到元素: ${anchor}`);

            // 滚动到元素位置
            targetElement[0].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // 延迟点击，确保滚动完成
            setTimeout(() => {
                console.log(`点击元素: ${anchor}`);
                targetElement.trigger('click');
            }, 500);
        } else {
            console.log(`未找到锚点对应的元素: ${anchor}`);
        }
    }


    // 开始
    // 从URL获取当前锚点
    const currentAnchor = window.location.hash.substring(1);

    const observer = new MutationObserver((mutations) => {
        const elementCheck = document.querySelector('.t-tree__list');
        let elementClick = $('.t-tree__list data-value[47pfhj]');

        // if (elementCheck && element.length > 0) {
        if (elementCheck) {
            console.log('搜索栏已加载');
            observer.disconnect(); // 停止观察


//       function handleSearch(){

//         console.log('开始监听搜索')
//          let searchDom = document.querySelector('.content__menu-list').parentElement.lastElementChild

//          if (!searchDom){
//            return
//          }

//              const observer = new MutationObserver((mutationsList) => {
//         // 遍历所有变化记录
//         for (const mutation of mutationsList) {
//             // 处理子节点添加
//             if (mutation.type === 'childList') {
//                 // 新增的节点
//                 const addedNodes = Array.from(mutation.addedNodes);
//                 if (addedNodes.length > 0) {
//                     console.log('新增子元素:', addedNodes);
//                     // 可在这里对新增节点进行操作，如绑定事件等
//                     addedNodes.forEach(node => {
//                         if (node.nodeType === 1) { // 确保是元素节点
//                             console.log('新增元素:', node);
//                         }
//                     });
//                 }

//                 // 被移除的节点
//                 const removedNodes = Array.from(mutation.removedNodes);
//                 if (removedNodes.length > 0) {
//                     console.log('移除子元素:', removedNodes);
//                 }
//             }
//         }
//     });

//     // 配置观察选项：监听子节点变化、子树变化
//     const config = {
//         childList: true,    // 监听直接子节点变化
//         subtree: false,     // 是否监听所有后代节点（false表示只监听直接子节点）
//         attributes: false,  // 不监听属性变化
//         characterData: false // 不监听文本内容变化
//     };

//     // 开始观察目标元素
//     observer.observe(searchDom, config);


//       }
//       handleSearch();

            setTimeout(function () {
              let document_title = document.title;

                // 执行操作
                console.log('开始滚动')
                // 如果有锚点，进行定位
                if (currentAnchor) {
                    handleAnchorNavigation(currentAnchor);
                }

                // 为目录项添加点击事件，存储锚点
                // $('.t-tree__list').on('click', '[data-value]', function (e) {
                //     const dataValue = $(this).attr('data-value');
                //     if (dataValue) {
                //         console.log(`存储锚点: ${dataValue}`);
                //         // 更新URL锚点，不刷新页面
                //         window.location.hash = dataValue;
                //     }
                // });


                function handleSearchClick() {
                  const treeItems = document.querySelectorAll('.t-tree__list .t-tree__item');

// 如果需要监听已存在的.t-tree__item元素
treeItems.forEach(item => {
    observeTreeItem(item);
});



// 单个.t-tree__item元素的观察者
function observeTreeItem(item) {
    const itemObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            // 处理class变化
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const oldClass = mutation.oldValue || '';
                const newClass = item.className;
                console.log(`.t-tree__item类变化: ${oldClass} → ${newClass}`);

                                // 可根据class变化执行额外逻辑
                                if (newClass.includes('t-is-active')) {
                    const dataValue = $(mutation.target).attr('data-value');
                                    console.log('元素被激活:', mutation.target);

                                    console.log(`监听--存储锚点: ${dataValue}`);
                                    // 更新URL锚点，不刷新页面
                                    window.location.hash = dataValue;

                                  let textEle = mutation.target.querySelector('.label-text')
                                  document.title = textEle.textContent + '-----' + document_title

                                } else if (oldClass.includes('t-is-active') && !newClass.includes('t-is-active')) {
                                    console.log('元素取消激活:', target);
                                }
            }

        });
    });

    // 配置单个元素的观察者
    itemObserver.observe(item, {
        attributes: true,          // 监听属性变化
        attributeFilter: ['class'], // 只监听class属性
        attributeOldValue: true,   // 记录旧的class值
        childList: false,           // 监听子节点变化
        subtree: false             // 不监听更深层的子树
    });

    // 存储观察者实例，方便后续停止观察（可选）
    item.__observer__ = itemObserver;
}


                }

                handleSearchClick()

                console.log('elementClick', elementClick)


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
        if (!document.querySelector('.t-tree__list')) {
            console.error('搜索栏加载超时');
        }
    }, 100000); // 10秒超时


})