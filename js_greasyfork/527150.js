// ==UserScript==
// @name         一键统计自动化失败原因
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  统计页面上特定文本的出现次数，并自动滚动到底部
// @author       您的名字
// @match        https://i.zte.com.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAbCAYAAACJISRoAAAABHNCSVQICAgIfAhkiAAAAQtJREFUSInt1c1Kw0AUhuFTF8kFTJnAFFwKYrHQUjE0Fq2iOxG8Bn/vQ8SbEMX+oLhQ9+raXom9g0lI8roQBDdmFi0q5FsOfOdZDIdTAZAZZ27WQImUyC8ju3v7Ug1q0tva+fZ+dn4h1aAmYacreZ7/PISCPL+8orRBacPbeAyAtZaFxTpKG27v7otGUIgAbGxuo7Th4OgEgMFwhNKGVjskTdPpIA+PTyhtCMw875MJ671PtD8YudTdkCzLWFmNUNpweHyK0oZGs02SJNNDAG76w6+/UdpweXXtWnVH4jim3mihtGFpuYm11hlx3hPP86S7FomISNQJxfd91+ofWcZ/g1SgPL8lUiIF+QCIeCJE+P0wYgAAAABJRU5ErkJggg==
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/527150/%E4%B8%80%E9%94%AE%E7%BB%9F%E8%AE%A1%E8%87%AA%E5%8A%A8%E5%8C%96%E5%A4%B1%E8%B4%A5%E5%8E%9F%E5%9B%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/527150/%E4%B8%80%E9%94%AE%E7%BB%9F%E8%AE%A1%E8%87%AA%E5%8A%A8%E5%8C%96%E5%A4%B1%E8%B4%A5%E5%8E%9F%E5%9B%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查当前页面是否是 iframe
    if (window.self !== window.top) {
        return; // 如果是 iframe，则不执行脚本
    }

    // 定义需要统计的文本列表
    const targetTexts = [
        "用例健壮性问题，需维护用例",
        "功能故障（需联系功能负责人解决）",
        "本地执行成功",
        "非长沙团队功能，需维护用例tag",
        "需求变更，用例不适用，需维护用例（skip）",
        "需求变更，需维护用例",
        "元素定位变更，需维护用例",
        "页面/环境问题",
        "请选择分析结论"
    ];

    // 创建按钮
    const button = document.createElement("button");
    button.textContent = "统计自动化失败原因";
    button.style.position = "fixed";
    button.style.bottom = "40px";
    button.style.right = "20px";
    button.style.zIndex = 1000;
    button.style.padding = "10px";
    button.style.backgroundColor = "#007bff";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    // 滚动到底部
    function scrollToBottom(element, callback) {
        let scrollInterval = setInterval(() => {
            let beforeScroll = element.scrollTop;
            element.scrollBy(0, 800); // 每次向下滚动 800px

            // 如果滚动到底部（没有发生滚动变化）
            if (element.scrollTop === beforeScroll) {
                clearInterval(scrollInterval);
                if (callback) callback(); // 滚动完成后执行回调
            }
        }, 200);
    }

    // 点击按钮时执行操作
    button.addEventListener("click", () => {
        // 获取 class="content wiki-content" 的元素
        const iframes = document.querySelectorAll("iframe");
        const contentElement = iframes[0].contentDocument.querySelector(".content.wiki-content");
        if (!contentElement) {
            alert("未找到目标内容区域！");
            return;
        }

        // 先滚动到底部，再执行统计
        scrollToBottom(contentElement, () => {
            setTimeout(() => {
                // 获取页面中的所有 iframe
                const iframes = document.querySelectorAll("iframe");

                // 遍历所有 iframe，提取指定元素内的内容并统计
                let totalResult = {};
                iframes.forEach((iframe, index) => {
                    try {
                        if (iframe.contentDocument) {
                            // 找到所有 class="icenter-macro-parse-root" 的元素
                            const containers = iframe.contentDocument.querySelectorAll(".icenter-macro-parse-root");
                            containers.forEach(container => {
                                const containerText = container.innerText;
                                // 统计每个目标文本的出现次数
                                targetTexts.forEach(text => {
                                    const regex = new RegExp(text, "g");
                                    const matches = containerText.match(regex);
                                    totalResult[text] = (totalResult[text] || 0) + (matches ? matches.length : 0);
                                });
                            });
                        }
                    } catch (e) {
                        console.warn(`无法访问 iframe ${index} 的内容：`, e);
                    }
                });

                // 输出统计结果
                let output = "统计结果：\n";
                for (const [text, count] of Object.entries(totalResult)) {
                    output += `${text}: ${count} 次\n`;
                }
                console.log('统计结果：', output);
                GM_setClipboard(output)
                alert(output); // 使用弹窗显示结果
            }, 500); // 额外等待 500ms，确保滚动完成
        });
    });

    // 将按钮添加到页面
    document.body.appendChild(button);
})();
