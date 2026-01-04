// ==UserScript==
// @name         修复图片src属性格式
// @description  自动修正特定域名下图片src属性的错误格式
// @author       kedvfu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @include      http*://17roco.gamebbs.qq.com/*
// @run-at       document-end
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/497521/%E4%BF%AE%E5%A4%8D%E5%9B%BE%E7%89%87src%E5%B1%9E%E6%80%A7%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/497521/%E4%BF%AE%E5%A4%8D%E5%9B%BE%E7%89%87src%E5%B1%9E%E6%80%A7%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==


// 修正图片源地址的函数
function fixImageSources() {
    var images = document.getElementsByTagName('img');
    for (var i = 0; i < images.length; i++) {
        var img = images[i];
        var src = img.src;
        if (src.indexOf('17roco.gamebbs.qq.com/tfs') !== -1) {
            img.src = src.substring(src.indexOf('/http') + 1);
        }
    }
}

// 页面加载时立即执行一次修正

fixImageSources();

launchObserver({
    parentNode: document.body,
    selector: `#controlcontent`,
    successCallback: () => {
fixImageSources();
        launchObserver({
    parentNode: document.body,
    selector: `#controlcontent`,
    successCallback: () => {
        fixImageSources();
    }
});
    }
});

function launchObserver(options) {
    var parentNode = options.parentNode;
    var selector = options.selector;
    var failCallback = options.failCallback || null;
    var successCallback = options.successCallback || null;
    var stopWhenSuccess = options.stopWhenSuccess || true;
    var config = options.config || {childList: true, subtree: true};

    if (!parentNode) return;

    function observeFunc(mutationList) {
        if (!document.querySelector(selector)) {
            if (typeof failCallback === 'function') failCallback();
            return;
        }
        if (stopWhenSuccess) observer.disconnect();

        mutationList.itemFilter = function (fn, type = 'addedNodes') {
            return mutationList.map(i => Array.from(i[type]).filter(fn)).reduce((arr, val) => arr.concat(val), []);
        };

        if (typeof successCallback === 'function') successCallback(mutationList);
    };

    var observer = new MutationObserver(observeFunc);
    observer.observe(parentNode, config);
};
