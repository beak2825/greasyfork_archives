// ==UserScript==
// @name 自动填充验证码
// @namespace Violentmonkey Scripts
// @require http://code.jquery.com/jquery-migrate-1.2.1.min.js
// @include *
// @grant none
// @version 1.1.4
// @author -
// @description 2024/4/13 12:42:41
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/492419/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/492419/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

window.onload = function () {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js";
    document.body.appendChild(script);
}


const valimgDiv = document.getElementById('valimg');
if (valimgDiv) {
    // 配置 MutationObserver 监听子元素变化
    const config = { childList: true };
    // 创建 MutationObserver 实例
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                const addedNodes = Array.from(mutation.addedNodes);
                addedNodes.forEach(function (node) {
                    if (node.tagName === 'IMG') {
                        // 监听新添加的图片元素的加载完成事件
                        node.addEventListener('load', function () {
                            console.log('新添加的图片加载完成');
                            // 在这里可以执行图片加载完成后的操作
                            // 获取包含 base64 编码图片的 img 元素
                            var imgElement = document.querySelector('#valimg img');
                            OCRCode(imgElement, "#txtCheckCode");

                        });
                    }
                });
            }
        });
    });
    observer.observe(valimgDiv, config);
}





function OCRCode(imgElement, item) {
    if (imgElement) {
        Tesseract.recognize(
            imgElement,
            'eng', {
            logger: m => console.log("123", m)
        }
        ).then(({
            data: {
                text
            }
        }) => {
            $(item).val(text);
        });
    }
}