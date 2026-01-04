// ==UserScript==
// @name         Swagger 添加复制URL按钮
// @namespace    wzw
// @version      0.4
// @description  复制 Swagger UI 页面中的路径 URL
// @author       wzw
// @match        */swagger-ui.html
// @match        */swagger-ui/index.html
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503510/Swagger%20%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6URL%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/503510/Swagger%20%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6URL%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addButton() {
        $("#swagger-ui .opblock-summary-path").each(function() {
            const $this = $(this);
            if ($this.next("button.copy-path").length !== 0){
                return
            }
            // 从data-path属性中获取路径文本
            const pathText = $this.data("path") || $this.attr("data-path"); // 防御性编程，确保兼容性

            const copyButton = $("<button>复制</button>")
            .addClass("copy-path")
            .css({
                "cursor": "pointer",
                "margin-inline": "10px",
                "background-color": "#007bff",
                "color": "white",
                "border": "none",
                "border-radius": "5px",
                "padding": "4px 8px"
            })
            .click(function (e) {
                e.stopPropagation();
                // 使用 Clipboard API 复制内容
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(pathText)
                        .then(() => console.log('路径已复制到剪贴板'))
                        .catch((err) => console.error('复制失败:', err));
                } else { // 兼容旧方法
                    const textarea = document.createElement('textarea');
                    document.body.appendChild(textarea);
                    textarea.value = pathText;
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }
            });

            // 将复制按钮追加到路径元素之后
            $this.after(copyButton);
        });
    }

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) addButton();
        });
    });

    const config = { childList: true, subtree: true };

    const targetNode = document.getElementById('swagger-ui');

    if (targetNode) observer.observe(targetNode, config);
    else console.error('未找到Swagger UI的根节点。');
})();