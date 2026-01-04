// ==UserScript==
// @name         知乎评论框支持拖动
// @namespace    https://greasyfork.org/zh-CN/users/297892
// @version      1.0
// @description  评论框支持拖动,同时点击评论框四周空白处可关闭评论框
// @author       移影残风
// @match        http*://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391752/%E7%9F%A5%E4%B9%8E%E8%AF%84%E8%AE%BA%E6%A1%86%E6%94%AF%E6%8C%81%E6%8B%96%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/391752/%E7%9F%A5%E4%B9%8E%E8%AF%84%E8%AE%BA%E6%A1%86%E6%94%AF%E6%8C%81%E6%8B%96%E5%8A%A8.meta.js
// ==/UserScript==
function doSomething(){
    let modelBackdrop = document.getElementsByClassName('Modal-backdrop')[0];
    modelBackdrop.onclick = function () {
        document.getElementsByClassName('Button Modal-closeButton Button--plain')[0].click()
    }

    let dialogHeaderEl = document.querySelector('.Topbar.CommentTopbar');
    const dialogHeaderElAll = document.querySelectorAll('.Topbar.CommentTopbar');
    const dragDom = document.querySelector('.Modal.Modal--fullPage')
    // dialogHeaderEl.style.cursor = 'move';
    dialogHeaderElAll.forEach(item => {
        item.style.cssText += ';cursor:move;'
    })
    dragDom.style.cssText += ';top:0px;'
    if (document.getElementsByClassName('CommentsV2 CommentsV2--withEditor CommentsV2--hidden').length > 0) {
        dialogHeaderEl = dialogHeaderElAll[1]
    }

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (function () {
        if (window.document.currentStyle) {
            return (dom, attr) => dom.currentStyle[attr]
        } else {
            return (dom, attr) => getComputedStyle(dom, false)[attr]
        }
    })();

    dialogHeaderEl.onmousedown = (e) => {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft
        const disY = e.clientY - dialogHeaderEl.offsetTop

        const screenWidth = document.body.clientWidth // body当前宽度
        const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)

        const dragDomWidth = dragDom.offsetWidth // 对话框宽度
        const dragDomHeight = dragDom.offsetHeight // 对话框高度

        const minDragDomLeft = dragDom.offsetLeft
        const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

        const minDragDomTop = dragDom.offsetTop
        const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

        // 获取到的值带px 正则匹配替换
        let styL = sty(dragDom, 'left')
        let styT = sty(dragDom, 'top')

        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (styL.includes('%')) {
            styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
            styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
        } else {
            styL = +styL.replace(/\px/g, '')
            styT = +styT.replace(/\px/g, '')
        }

        document.onmousemove = function(e) {
            // 通过事件委托，计算移动的距离
            let left = e.clientX - disX
            let top = e.clientY - disY

            // 边界处理
            if (-(left) > minDragDomLeft) {
                left = -(minDragDomLeft)
            } else if (left > maxDragDomLeft) {
                left = maxDragDomLeft
            }

            if (-(top) > minDragDomTop) {
                top = -(minDragDomTop)
                // 优化下边界的判定，对话框可拖动至可见区域的下方
            } else if (top > maxDragDomTop + dragDomHeight - dialogHeaderEl.offsetHeight) {
                top = maxDragDomTop + dragDomHeight - dialogHeaderEl.offsetHeight
            }

            // 移动当前元素
            dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
        }

        document.onmouseup = function(e) {
            document.onmousemove = null
            document.onmouseup = null
        }
    }
}
(function() {
    'use strict';

    window.onload = function () {
        window.addEventListener('DOMNodeInserted', function (e) {
            if (e.target.className === 'Comments-container' || e.target.className === 'CommentsV2') {
                doSomething()
            }

        })
        window.addEventListener('DOMNodeRemoved', function (e) {
            if (e.target.className === 'CommentsV2') {
                doSomething()
            }
        })
    }

})();