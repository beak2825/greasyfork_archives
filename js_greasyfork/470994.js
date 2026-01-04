// ==UserScript==
// @name         删除B站推荐的逆天玩意儿
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  针对的就是“被这个反智视频笑死”这个逆天的鬼东西
// @author       狗
// @license 狗
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/470994/%E5%88%A0%E9%99%A4B%E7%AB%99%E6%8E%A8%E8%8D%90%E7%9A%84%E9%80%86%E5%A4%A9%E7%8E%A9%E6%84%8F%E5%84%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/470994/%E5%88%A0%E9%99%A4B%E7%AB%99%E6%8E%A8%E8%8D%90%E7%9A%84%E9%80%86%E5%A4%A9%E7%8E%A9%E6%84%8F%E5%84%BF.meta.js
// ==/UserScript==

$(document).ready(function() {
    deleteRetard();
});

function deleteRetard() {
    console.log('?');
    const element = document.getElementsByClassName('video-page-operator-card-small')[0];
    const text = element.innerText;
    if(text.includes('被这个反智视频笑死')) {
        element.style.display = 'none';
        console.log('移除成功！');
    }
}