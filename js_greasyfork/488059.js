// ==UserScript==
// @name         培训系统多开+后台挂完自动提交Beta3
// @namespace    http://tampermonkey.net/
// @version      2024-02-26
// @description  建议使用chrome浏览器，Edge可能被系统效能模式暂停计时
// @author       You
// @match        https://tms.sichuanair.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sichuanair.com
// @grant        none
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488059/%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F%E5%A4%9A%E5%BC%80%2B%E5%90%8E%E5%8F%B0%E6%8C%82%E5%AE%8C%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4Beta3.user.js
// @updateURL https://update.greasyfork.org/scripts/488059/%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F%E5%A4%9A%E5%BC%80%2B%E5%90%8E%E5%8F%B0%E6%8C%82%E5%AE%8C%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4Beta3.meta.js
// ==/UserScript==

(function() {

    // 创建一个 MutationObserver 实例并指定回调函数
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 检查每个新增节点
            mutation.addedNodes.forEach(function(node) {
                // 检查是否为目标节点
                if ($(node).is('.el-dialog')) {
                    // 在这里执行相应的逻辑处理
                    console.log('目标节点出现');
                    var overlay = $('.study-dialog .el-overlay');
                    var overlayDialog = $('.study-dialog .el-overlay-dialog');
                    overlay.removeClass('el-overlay');
                    overlayDialog.removeClass('el-overlay-dialog');
                }
            });
        });
    });
    // 配置观察器选项
    var config = { childList: true, subtree: true };
    // 监听整个文档树的变化
    observer.observe(document.body, config);

    function checkTimer(timerElement, buttonElement) {
        var timerSpan = timerElement.find('span');
        var timeArray = timerSpan.text().split('/');

        var currentTime = parseTime(timeArray[0]);
        var totalTime = parseTime(timeArray[1]);

        if (currentTime >= totalTime) {
            // 如果计时完成，触发按钮点击
            console.log('学习已完成');
            buttonElement.click();
        }
    }

    function parseTime(timeString) {
        var timeParts = timeString.split(':');
        return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
    }

    // 定时器，每5秒检测一次
    setInterval(function() {
        // 对每个计时器进行检测
        $('.timer').each(function() {
            var timerElement = $(this);
            var buttonElement = timerElement.next().find('.el-button--success');
            checkTimer(timerElement, buttonElement);
        });
    }, 5000);

    const chromeVersion = /Chrome\/([0-9.]+)/
    .exec(window?.navigator?.userAgent)?.[1]
    ?.split('.')[0];

    if (chromeVersion && parseInt(chromeVersion, 10) >= 88) {
    const videoDom = document.createElement('video');
    const hiddenCanvas = document.createElement('canvas');

    videoDom.setAttribute('style', 'display:none');
    videoDom.setAttribute('muted', '');
    videoDom.muted = true;
    videoDom.setAttribute('autoplay', '');
    videoDom.autoplay = true;
    videoDom.setAttribute('playsinline', '');
    hiddenCanvas.setAttribute('style', 'display:none');
    hiddenCanvas.setAttribute('width', '1');
    hiddenCanvas.setAttribute('height', '1');
    hiddenCanvas.getContext('2d')?.fillRect(0, 0, 1, 1);
    videoDom.srcObject = hiddenCanvas?.captureStream();
    }

})();