// ==UserScript==
// @name         知乎推荐移除视频条目
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除知乎首页推荐中包含视频的条目
// @author       You
// @match        https://www.zhihu.com/
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/436152/%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90%E7%A7%BB%E9%99%A4%E8%A7%86%E9%A2%91%E6%9D%A1%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/436152/%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90%E7%A7%BB%E9%99%A4%E8%A7%86%E9%A2%91%E6%9D%A1%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const itemListFather = document.querySelector('.ListShortcut .Topstory-recommend  div')
    const itemList = itemListFather.querySelectorAll('.Card')

    // 初始元素判定
    itemList.forEach((el) => {
        if(hasVideo(el)) {
            el.parentNode.removeChild(el)
        }
    })

    // MutationObserver回调函数
    function callback(mutationList, observer) {
        mutationList.forEach((mutation) => {
                if(hasVideo(mutation.addedNodes[0])) {
                    mutation.addedNodes[0].parentNode.removeChild(mutation.addedNodes[0])
                }
        })
    }

    const observerOptions = {
        childList: true
    }
    const observer = new MutationObserver(callback)
    observer.observe(itemListFather, observerOptions)

    // 检测是否包含视频class
    function hasVideo(element) {
        if(!element) {
            return false
        }
        if(element.querySelector('.VideoAnswerPlayer') || element.querySelector('.ZVideoItem-video') || element.querySelector('.VideoAnswerPlayer-video')) {
            return true
        } else {
            return false
        }
    }
})();