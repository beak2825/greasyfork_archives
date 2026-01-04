// ==UserScript==
// @name         简化知乎页面
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  简化 | 美化知乎页面
// @author       Lynn Speng
// @match        *://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406906/%E7%AE%80%E5%8C%96%E7%9F%A5%E4%B9%8E%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/406906/%E7%AE%80%E5%8C%96%E7%9F%A5%E4%B9%8E%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==


setInterval(() => {
    // 删除掺杂在回答里的广告
    let ads = document.getElementsByClassName("TopstoryItem--advertCard");
    if (ads.length > 0) {
        for (let i = 0; i < ads.length; ++i)
            ads[i].remove();
    }

    // 删除侧边栏广告
    let pcAds = document.getElementsByClassName("Pc-card");
    if (pcAds.length > 0) {
        for (let i = 0; i < pcAds.length; ++i)
            pcAds[i].remove();
    }

    // 删除视频推送
    let videos = document.getElementsByClassName("ZVideoItem");
    if (videos.length > 0) {
        for (let i = 0; i < videos.length; ++i)
            videos[i].parentNode.parentNode.remove();
    }
}, 100);


// 调整卡片样式
let style = document.createElement("style");
style.innerHTML = 
    'body { background-color: #274c5e }\
    .Avatar {border-radius: 50%;}\
    .Card, .ClubSliderList, .Footer, .HotItem, .HotList { margin: 20px; border-radius: 8px; }\
    .Question-sideColumn{display: none;}\
    .Question-mainColumn{width: 1000px;}\
    .QuestionInvitation{display: none;}\
    .css-1roounf{display: none;}\
    .css-neu31m{display: none;}\
    .css-1qefhqu{width: 80px;}\
    .UserAvatar{border-radius: 100%;}\
    .Profile-lightList {margin: 20px; background-color: white; border-radius: 8px; padding: 0 10px;}\
    .Profile-footerOperations {margin: 20px}'
document.head.appendChild(style);

