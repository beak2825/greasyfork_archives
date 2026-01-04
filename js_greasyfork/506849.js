// ==UserScript==
// @name        隐藏微信公众号后台发表记录页已删除文章并自动跳转页码
// @namespace   Violentmonkey Scripts
// @match       https://mp.weixin.qq.com/cgi-bin/appmsgpublish*
// @grant       none
// @version     1.0
// @author      微信公众号搜：汁识
// @license     MIT
// @description 公众号运营者必备神器，治好强迫症
// @downloadURL https://update.greasyfork.org/scripts/506849/%E9%9A%90%E8%97%8F%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8E%E5%8F%B0%E5%8F%91%E8%A1%A8%E8%AE%B0%E5%BD%95%E9%A1%B5%E5%B7%B2%E5%88%A0%E9%99%A4%E6%96%87%E7%AB%A0%E5%B9%B6%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%A1%B5%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/506849/%E9%9A%90%E8%97%8F%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8E%E5%8F%B0%E5%8F%91%E8%A1%A8%E8%AE%B0%E5%BD%95%E9%A1%B5%E5%B7%B2%E5%88%A0%E9%99%A4%E6%96%87%E7%AB%A0%E5%B9%B6%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%A1%B5%E7%A0%81.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 获取所有包含已删除消息的 span 元素
    const deletedSpans = document.querySelectorAll('span.weui-desktop-mass__status_text');

    // 遍历所有的 span 元素
    for(let i = 0; i < deletedSpans.length; i++){
        if(deletedSpans[i].textContent.includes('已删除')){ // 判断 span 元素的文本内容是否包含 "已删除"
            let parentDiv = deletedSpans[i].closest('div.weui-desktop-block'); // 找到最近的 weui-desktop-block 父级 div
            if(parentDiv !== null){
                parentDiv.style.display = 'none'; // 隐藏该父级 div
            }
        }
    }

    // 获取所有的 weui-desktop-block 元素
    const blocks = document.querySelectorAll('div.publish_content.publish_record_history div.weui-desktop-block');

    // 判断是否所有的 weui-desktop-block 元素都被隐藏了
    const allHidden = Array.from(blocks).every(block => block.style.display === 'none');

    if(allHidden){
        // 获取当前页码
        const currentPage = document.querySelector('label.weui-desktop-pagination__num_current');

        // 获取下一页码
        const nextPage = currentPage.nextElementSibling;

        // 如果下一页存在，则跳转到下一页
        if(nextPage !== null){
            setTimeout(() => {
                nextPage.click();
            }, 1000);
        }
    }
})();

