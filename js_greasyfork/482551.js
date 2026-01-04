// ==UserScript==
// @name         API调用
// @namespace    http://your.namespace.com
// @version      0.1
// @description  通过油猴脚本调用API并处理返回的内容
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482551/API%E8%B0%83%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/482551/API%E8%B0%83%E7%94%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 定义API地址
    var apiUrl = 'http://xd0g.com/ctf.json';

    // 使用GM_xmlhttpRequest调用API
    GM_xmlhttpRequest({
        method: 'GET',
        url: apiUrl,
        onload: function(response) {
            // 处理返回的内容
            var apiContent = response.responseText;
            console.log(apiContent);

            // 在页面中显示内容（示例：在body的最前面插入一个div显示内容）
            var contentDiv = document.createElement('div');
            document.body.insertBefore(contentDiv, document.body.firstChild);

            // 定义处理元素的函数
            function processElements() {
                var annotation = apiContent;
                var elements = document.querySelectorAll('.el-card__body');

                elements.forEach(function (element, index) {
                    // 获取注释字符对应位置的字母
                    var annotationChar = annotation[index % annotation.length];

                    // 根据注释字符的位置生成相应数量的黑点
                    for (var i = 0; i < annotationChar.charCodeAt(0) - 'A'.charCodeAt(0) + 1; i++) {
                        // 创建黑点
                        var dot = document.createElement('span');
                        dot.style.height = '0.08px';
                        dot.style.width = '0.08px';
                        dot.style.background = 'black';
                        dot.style.position = 'absolute';
                        dot.style.borderRadius = '50%';

                        // 设置具体的right值，以适应你的布局
                        dot.style.right = (i * 3) +5 +'px'; // 改为5像素

                        // 将黑点添加到对应的题目下
                        element.appendChild(dot);
                    }
                });
            }

            // 等待3秒后执行processElements，并每秒执行一次，总共执行10次
            var count = 0;
            setTimeout(function() {
                var intervalId = setInterval(function() {
                    processElements();
                    count++;
                    if (count >= 10) {
                        clearInterval(intervalId);
                    }
                }, 1000);
            }, 3000);
        },
        onerror: function(error) {
            console.error('调用API发生错误:', error);
        }
    });

})();
