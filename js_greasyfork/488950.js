// ==UserScript==
// @name         深信服在线课堂之自动学习
// @namespace    http://tampermonkey.net/
// @version      20240304143716
// @description  自动进入下一任务
// @author       wwsuixin
// @match        https://learning.sangfor.com.cn/course/*
// @icon         https://learning.sangfor.com.cn/files/system/2019/01-17/2110339c5d49156533.ico?version=5.1.7&jcversion=20240111
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488950/%E6%B7%B1%E4%BF%A1%E6%9C%8D%E5%9C%A8%E7%BA%BF%E8%AF%BE%E5%A0%82%E4%B9%8B%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/488950/%E6%B7%B1%E4%BF%A1%E6%9C%8D%E5%9C%A8%E7%BA%BF%E8%AF%BE%E5%A0%82%E4%B9%8B%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function () {

    window.onload = setTimeout(click_item, 500);
    function click_item() {
        var video = document.getElementById('lesson-player_html5_api');
        setInterval(function () {

            if (video) { // 确保成功获取到video元素
                video.playbackRate = 2;
                video.play();
            }

            // 使用XPath选择目标元素
            var xpath = "/html/body/div[2]/div[1]/div[3]/div[3]/span";
            var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

            // 判断元素class值中是否包含"open"
            if (result.singleNodeValue && (result.singleNodeValue.classList.contains("open") || result.singleNodeValue.classList.contains("moveup"))) {
            var content = result.singleNodeValue.getAttribute("data-content");
            var regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
            var match = regex.exec(content);

            if (match) {
                var link = match[2];
                console.log("提取到的超链接: " + link);
                window.location.href = link
            } else {
                console.log("未找到超链接");
            }
            } else {
                console.log("未找到匹配的元素或class值中不包含'open'");
            }

        }, 5000)
    }
})();