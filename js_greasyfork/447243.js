// ==UserScript==
// @name         移除知乎首页视频
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  知乎视频狗都不看！
// @author       You
// @match        https://www.zhihu.com/
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447243/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/447243/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(remove, 500);
    removeAds();
})();

function remove(){
    const list = Array.from(document.querySelectorAll('.TopstoryItem-isRecommend'));
    list.forEach(x => {
        if (x.children[0].moduleInfo?.card?.has_video) {
            x.remove();
        }
    })
}

function removeAds() {
    const style = document.createElement('style');
    style.type = 'text/css';
    document.head.appendChild(style);
    style.sheet.insertRule(".TopstoryItem--advertCard,.Business-Card-PcRightBanner-link,.AdvertImg{display: none;}");
}