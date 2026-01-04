// ==UserScript==
// @name         粉笔刷题排版优化，答案自动展开
// @namespace    https://greasyfork.org/zh-CN/scripts/465487
// @version      0.0.4
// @description  面试题移除左侧空白，右侧真题答案居中，答案自动展开，精简内容；刷题答案解析删除视频等元素，移动答题卡
// @author       yingming006
// @match        *://www.fenbi.com/*
// @match        *://spa.fenbi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fenbi.com
// @grant        GM_addStyle
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/465487/%E7%B2%89%E7%AC%94%E5%88%B7%E9%A2%98%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96%EF%BC%8C%E7%AD%94%E6%A1%88%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/465487/%E7%B2%89%E7%AC%94%E5%88%B7%E9%A2%98%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96%EF%BC%8C%E7%AD%94%E6%A1%88%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==
(function() {
    let css = `#app-report-solution .fb-collpase-bottom{position:fixed;right:0 !important;bottom:0 !important;width:440px !important;}.zhenti-body-left.zhenti-body-part.bg-color-gray-light5{display:none !important;}fb-expand{display:none !important;}.zhenti-body{width:1180px !important;margin:auto !important;}.question-body{height:auto !important;}.questions-container{padding-left:0 !important;}.question-container{position:static !important;}.question-content{width:100% !important;}.zhenti-container.bg-color-gray-light3.ng-star-inserted{position:static !important;}.reference-detail.bg-color-gray-light3{max-height:fit-content !important;opacity:1 !important;}.reference-btn{display:none !important;}.member-title{display:none !important;}.member-content-sections{display:none !important;}.member-open-big{display:none !important;}.accessory-container.member.last-one{max-height:fit-content !important;position:static !important;}.member-section{background:inherit !important;margin-left:0 !important;margin-bottom:0 !important;overflow:hidden !important;width:auto !important;border-radius:10px !important;}app-report-capacity-change{display:none !important;}app-production-rec-nav{display:none !important;}.solu-list-item.video-item.m-b-24{display:none !important;}.solu-list-item.font-color-gray-mid.m-b-14{display:none !important;}.member-section2{width:auto !important;}.video-content{display:none !important;}.audio-play-content{display:none !important;}`
    GM_addStyle(css)

    document.addEventListener('keydown', function(event) {
        if (event.key === "ArrowLeft") {
            // 模拟向左按钮的点击事件
            var leftButtons = document.getElementsByClassName('previous-exercise-item');
            for (let i = 0; i < leftButtons.length; i++) {
                leftButtons[i].click();
            }
        } else if (event.key === "ArrowRight") {
            // 模拟向右按钮的点击事件
            var rightButtons = document.getElementsByClassName('next-exercise-item');
            for (let i = 0; i < rightButtons.length; i++) {
                rightButtons[i].click();
            }
        }
    });
})();