// ==UserScript==
// @name         屏蔽知乎首页推荐中的广告和关键词
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  知乎推荐太讨厌了
// @author       Ava
// @match        https://www.zhihu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414700/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E4%B8%AD%E7%9A%84%E5%B9%BF%E5%91%8A%E5%92%8C%E5%85%B3%E9%94%AE%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/414700/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E4%B8%AD%E7%9A%84%E5%B9%BF%E5%91%8A%E5%92%8C%E5%85%B3%E9%94%AE%E8%AF%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var keysReg = /肖战|余生请多指教|斗罗大陆|王一博|龚俊|温客行|俊子|山河令|张哲瀚|明星/;
    var hideVideo = 1; //如果需要展示视频回答，改成 hideVideo = 0

    var elList = document.querySelector('.Topstory-recommend>div');

    function hideCards(items) {
        items.forEach(function (item) {
            if (item.classList.contains('TopstoryItem--advertCard')) {
                item.parentNode.removeChild(item);
            } else {
                var domTitle = item.querySelector('.ContentItem-title a');
                if (domTitle && keysReg.test(domTitle.innerHTML)) {
                    item.parentNode.removeChild(item);
                } else if (hideVideo && (item.querySelector('.ZVideoItem') || item.querySelector('.VideoAnswerPlayer'))) {
                    item.parentNode.removeChild(item);
                }
            }
        });
    }

    function callback(mutationList, observer) {
        mutationList.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                if (mutation.addedNodes.length) {
                    hideCards(mutation.addedNodes);
                }
            }
        });
    }

    hideCards(elList.childNodes);

    var observerOptions = {childList: true};
    var observer = new MutationObserver(callback);
    observer.observe(elList, observerOptions);

})();
