// ==UserScript==
// @name         Modify YouTube Page Layout Script(修改油管布局)
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.3
// @description  This script helps you modify the page layout while watching YouTube videos, allowing you to focus more on the video and conveniently view comments.
// @license MIT
// @author       xiaolaji
// @grant        GM_addStyle
// @match        https://www.youtube.com/watch?*
// @downloadURL https://update.greasyfork.org/scripts/461610/Modify%20YouTube%20Page%20Layout%20Script%28%E4%BF%AE%E6%94%B9%E6%B2%B9%E7%AE%A1%E5%B8%83%E5%B1%80%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461610/Modify%20YouTube%20Page%20Layout%20Script%28%E4%BF%AE%E6%94%B9%E6%B2%B9%E7%AE%A1%E5%B8%83%E5%B1%80%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(() => {
        // 隐藏右侧推荐视频
        var elem_tuijian = document.getElementById("secondary");
        elem_tuijian.style.display = 'none'
        const belowElement = document.getElementById("below");
        const primaryElement = document.getElementById("primary");
        primaryElement.parentNode.insertBefore(belowElement, primaryElement.nextSibling);

        // 创建一个button元素
        const divAboutOwn = document.createElement('div');
        divAboutOwn.innerHTML = '<button class="changeTuiJianAndPingLun">切换评论和推荐</button><button class="ytreload">重新加载</button>';
        const primaryInnerElement = document.getElementById("primary-inner");
        primaryInnerElement.parentNode.insertBefore(divAboutOwn, primaryInnerElement.nextSibling);
        let vipZhuanShu = document.getElementsByClassName('changeTuiJianAndPingLun')
        let ytreload = document.getElementsByClassName('ytreload')
        
        // 添加样式
        // myButton.style.backgroundColor = 'blue';
        // myButton.style.color = 'white';
        // myButton.style.border = 'none';
        // myButton.style.padding = '10px';
        divAboutOwn.style.marginTop = '50px'
        
        
        //  primaryInnerElement.parentNode.insertBefore(elem_tuijian, primaryInnerElement.nextSibling);

        function changePLANDTJ() {
            if (elem_tuijian.style.display == 'none') {
                elem_tuijian.style.display = ''
                belowElement.style.display = 'none'
            } else {
                 elem_tuijian.style.display = 'none'
                belowElement.style.display = ''
            }
        }
        vipZhuanShu[0].addEventListener("click", function() { // 在这里添加点击事件的处理逻辑
            console.log(111)
            if (elem_tuijian.style.display == 'none') {
                elem_tuijian.style.display = ''
                belowElement.style.display = 'none'
            } else {
                 elem_tuijian.style.display = 'none'
                belowElement.style.display = ''
            }
         });

         ytreload[0].addEventListener("click", function() { // 在这里添加点击事件的处理逻辑
            window.location.reload()
         });

    }, 3000)
})();

GM_addStyle(`
    #primary-inner {
        display: flex
    }
    #primary-inner {
        position: sticky;
        top: 100px;
    }
    .changeTuiJianAndPingLun {
        z-index: 100000 !important;
        height: 30px;
        position: fixed;
        background-color: pink;
    }
    .ytreload {
        z-index: 100000 !important;
        height: 30px;
        position: fixed;
        background-color: pink;
        margin-left: 200px;
    }
    #below {
        width: 600px;
    }
    #player {
       width: 850px;
    }
`)