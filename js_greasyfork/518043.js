// ==UserScript==
// @name         B站学霸净化模式,删除指定元素脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动删除B站页面上的指定元素
// @author       Your Name
// @match        https://www.bilibili.com/*
// @icon         https://static.thenounproject.com/png/3355755-200.png
// @grant        none
// @license     乱填
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/518043/B%E7%AB%99%E5%AD%A6%E9%9C%B8%E5%87%80%E5%8C%96%E6%A8%A1%E5%BC%8F%2C%E5%88%A0%E9%99%A4%E6%8C%87%E5%AE%9A%E5%85%83%E7%B4%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/518043/B%E7%AB%99%E5%AD%A6%E9%9C%B8%E5%87%80%E5%8C%96%E6%A8%A1%E5%BC%8F%2C%E5%88%A0%E9%99%A4%E6%8C%87%E5%AE%9A%E5%85%83%E7%B4%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
function deleteElement(selector, logMessage) {
    try {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
        } else {
            console.log(`${logMessage} 在页面: ${document.URL}`);
        }
    } catch (error) {
        console.log(`删除元素时出错: ${error.message} 元素选择器: ${selector} 在页面: ${document.URL}`);
    }
}
window.addEventListener('load', function() {
    deleteElement('div.recommend-list-v1', '未能找到要删除的recommend-list-v1元素');//右侧带图片的推荐的视频
    deleteElement('div.pop-live-small-mode.part-1', '未能找到要删除的pop-live-small-mode.part-1元素');//右侧正在直播推荐
    deleteElement('div.default-btn.new-charge-btn.charge-btn-loaded', '未能找到要删除的pop-live-small-mode.part-1元素');
    deleteElement('div.bpx-player-video-info-online', '未能找到要删除的bpx-player-video-info-online元素');//在线人数
    deleteElement('div.video-info-meta', '未能找到要删除的video-info-meta元素');
    deleteElement('div#biliMainHeader', '未能找到要删除的biliMainHeader元素');
    deleteElement('div.bpx-player-sending-area', '未能找到要删除的bpx-player-sending-area元素');
    deleteElement('div.video-toolbar-container#arc_toolbar_report', '未能找到要删除的video-toolbar-container元素');
    deleteElement('div.video-desc-container', '未能找到要删除的video-desc-container元素');

    deleteElement('div.video-tag-container', '未能找到要删除的video-tag-container元素');
    deleteElement('div#commentapp', '未能找到要删除的commentapp元素');

});
