// ==UserScript==
// @name        知乎小助手
// @namespace   Violentmonkey Scripts
// @description 在回答开头添加回答时间、专栏文章发表时间；自动播放GIF; 自动展开被折叠的回答
// @version     0.18
// @match       *://*.zhihu.com/*
// @icon        https://static.zhihu.com/heifetz/favicon.ico
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/402948/%E7%9F%A5%E4%B9%8E%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/402948/%E7%9F%A5%E4%B9%8E%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
待办:
1. GIF尽量更换为视频
2. 未展开的回答也显示回答时间
*/

(function (root) {
    "use strict";
    var listeners = [];
    var doc = window.document;
    var MutationObserver =
        window.MutationObserver || window.WebKitMutationObserver;
    var observer;

    function ready(selector, fn) {
        // 储存选择器和回调函数
        listeners.push({
            selector: selector,
            fn: fn,
        });
        if (!observer) {
            // 监听document变化
            observer = new MutationObserver(check);
            observer.observe(doc.documentElement, {
                childList: true,
                subtree: true,
            });
        }
        // 检查该元素是否已经在DOM中
        check();
    }

    function check() {
        // 检查DOM元素是否匹配已储存的元素
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            // 检查指定元素是否有匹配
            var elements = document.querySelectorAll(listener.selector);
            for (var j = 0; j < elements.length; j++) {
                var element = elements[j];
                // 确保回调函数只会对该元素调用一次
                if (!element.ready) {
                    element.ready = true;
                    // 对该元素调用回调函数
                    listener.fn.call(element, element);
                }
            }
        }
    }

    // 对外暴露ready
    root.ready = ready;
})(window);

(function () {
    "use strict";
    ready(".ContentItem-time", addTime);
    // ready(".GifPlayer-gif2mp4", loadGIFVideo);
    ready(".ztext-gif", loadGIF);
    ready(".CollapsedAnswers-bar button", uncollapse);
    ready("button.QuestionMainAction", uncollapseMore);
})();

function addTime(element) {
    var dupNode = element.cloneNode(true);
    if (document.location.hostname == "www.zhihu.com") {
        var pNode = element.parentNode.parentNode.parentNode.firstChild;
        if (!pNode.querySelector(".ContentItem-time"))
            pNode.appendChild(dupNode);
    }
    if (document.location.hostname == "zhuanlan.zhihu.com") {
        window.onload = () => {
            var pNode = element.parentNode.firstChild;
            pNode.appendChild(dupNode);
        }
    }
}

// function loadGIFVideo(element) {
//         element.autoplay = true;
//         element.loop = true;
//         element.controls = true;
//         // element.parentNode.querySelector("img").remove();
//         element.parentNode.querySelector("svg").remove();
// }

function loadGIF(element) {
    element.src = element.src.replace(/.jpg/, ".webp");
    if (element.parentNode.querySelector("video"))
        element.parentNode.querySelector("video").remove();
    element.parentNode.querySelector("svg").style.display = "none";
};

function uncollapse(element) {
    element.click();
}

function uncollapseMore(element) {
    element.click();
}
