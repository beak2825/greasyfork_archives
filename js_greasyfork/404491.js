// ==UserScript==
// @name         B站视频封面查看
// @namespace    limgmk/bilibili-cover
// @version      0.0.12
// @description  在播放窗口下方添加查看封面的按钮
// @author       Ezekiel Lee
// @license      MIT
// @include      http*://www.bilibili.com/video/av*
// @include      http*://www.bilibili.com/video/BV*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/404491/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/404491/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

/** 使用 XPath 获取 document */
function getElementByXpath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

/** 等待一段时间 */
async function wait(delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
}

(async () => {
    /** 引入需要的资源 */
    const iconLink = document.createElement("link");
    iconLink.setAttribute("rel", "stylesheet");
    iconLink.setAttribute("type", "text/css");
    iconLink.setAttribute("href", "https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    getElementByXpath("//head").appendChild(iconLink);

    let player;
    let injected = false;
    Object.defineProperty(unsafeWindow, "player", {
        get: () => player,
        set : (value) => {
            player = value;

            /** 通过 once 判断是否已经执行过注入逻辑 */
            if (injected) {
                return;
            }
            injected = true;
            /** 获取最后一个元素 */
            const lastItem = getElementByXpath('//div[@class="toolbar-left"]/child::node()[last()]');

            /** 构造 "查看封面" Element */
            const showCover = document.createElement("span");
            showCover.setAttribute("title", "查看封面");
            showCover.setAttribute("style", "color: #505050;");
            showCover.innerHTML = `<i class="fa fa-picture-o" style="font-size: 24px; padding-top: 1px; margin-right: 8px"></i><span>封面</span>`;

            /** 为 "查看封面" Element 添加事件监听 */
            showCover.addEventListener('click', (e) => {
                var cover = getElementByXpath('//meta[@itemprop="image" and @data-vue-meta="true"]');
                if (cover) {
                    var coverURL = cover.getAttribute("content");
                    coverURL = coverURL.replace(/http[s]?\:/, '');
                    window.open(coverURL, '_blank');
                } else {
                    alert("不好意思, 找不到封面链接 (ﾟ´Д｀ﾟ)ﾟ");
                }
            });
            showCover.addEventListener('mouseover', (e) => {
                showCover.setAttribute("style", "color: #00A1D6;");
            });
            showCover.addEventListener('mouseout', (e) => {
                showCover.setAttribute("style", "color: #505050;");
            });

            /** 修饰最后一个元素的样式 */
            lastItem.setAttribute("style", "width: 92px;");
            /** 插入 "查看封面" Element */
            lastItem.parentElement.appendChild(showCover);
        },
        enumerable : true,
        configurable : true
    });
})();
