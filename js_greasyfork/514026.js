// ==UserScript==
// @name         智慧树半自动刷课（动态标题和一次性通知）
// @version      0.9.2
// @description  根据 XPath 设置标签页标题和一次性通知
// @match        *://hike.zhihuishu.com/aidedteaching/sourceLearning/*
// @grant        GM_notification
// @grant        unsafeWindow
// @license      MIT
// @namespace https://greasyfork.org/users/718156
// @downloadURL https://update.greasyfork.org/scripts/514026/%E6%99%BA%E6%85%A7%E6%A0%91%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BC%88%E5%8A%A8%E6%80%81%E6%A0%87%E9%A2%98%E5%92%8C%E4%B8%80%E6%AC%A1%E6%80%A7%E9%80%9A%E7%9F%A5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/514026/%E6%99%BA%E6%85%A7%E6%A0%91%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BC%88%E5%8A%A8%E6%80%81%E6%A0%87%E9%A2%98%E5%92%8C%E4%B8%80%E6%AC%A1%E6%80%A7%E9%80%9A%E7%9F%A5%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const $ = unsafeWindow.jQuery;
    const emojiAlert = "❗"; // 彩色emoji 感叹号
    let notified = false; // 标记是否已通知

    // 延迟 2 秒后获取 XPath 路径中的标题内容
    setTimeout(() => {
        const titleNode = document.evaluate('//*[@id="sourceTit"]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const videoTitle = titleNode ? titleNode.textContent.trim() : "刷课视频";

        // 设置标签页标题
        document.title = videoTitle;

        console.log("标签页标题设置为:", document.title);

        // 初始化播放设置
        $(".volumeIcon").click();           // 静音
        $(".speedTab15").click();           // 1.5倍速播放
        $(".bigPlayButton.pointer").click(); // 开始播放
        $(".line1bq").click();              // 播放课程视频

        // 定时检测播放状态
        setInterval(() => {
            const activeItem = $("div.file-item.active");

            // 若 icon-finish 不存在时，打印 activeItem 内文本并追加到标签页标题
            if (activeItem.find("i.icon-finish").length < 0) {
                const activeText = activeItem.text().trim();
                console.log("当前标签页内所有文本内容：", activeText);

                // 更新标签页标题
                document.title = `${videoTitle} - ${activeText}`;
            }

            // 检查视频是否完成
            if (!notified && activeItem.find("i.icon-finish").length > 0) {
                notified = true; // 设置为已通知

                // 视频播放完毕时发送一次性通知
                GM_notification({
                    title: videoTitle,
                    text: "视频播放结束，请手动切换到下一个视频",
                    timeout: 5000,
                    onclick: () => window.focus()  // 点击通知时聚焦当前标签页
                });

                // 修改标签页标题为已完成状态
                document.title = `${emojiAlert}已刷完${emojiAlert} ${videoTitle}`;
            }

            // 若播放按钮显示为“可点击”，则点击继续播放
            if ($(".bigPlayButton.pointer").css("display") === "block") {
                $(".bigPlayButton.pointer").click();
            }
        }, 2000);
    }, 2000);
})();
