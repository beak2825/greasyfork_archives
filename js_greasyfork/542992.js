// ==UserScript==
// @name         swagger复制url
// @namespace    http://sslfer.com/
// @version      4.0
// @description  swagger页面的请求url为展开和收缩 不是很好选择复制，这里新增按钮进行复制
// @author       sg
// @match        */swagger-ui.html
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542992/swagger%E5%A4%8D%E5%88%B6url.user.js
// @updateURL https://update.greasyfork.org/scripts/542992/swagger%E5%A4%8D%E5%88%B6url.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...

    setTimeout(function (){
        var style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML = `
        .el-message {
    --el-message-close-size: 16px;
    align-items: center;
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    box-sizing: border-box;
    color: #67c23a;
    display: flex;
    gap: 8px;
    left: 50%;
    max-width: calc(100% - 32px);
    padding: 11px 15px;
    position: fixed;
    top: 20px;
    transform: translateX(-50%);
    transition: opacity var(--el-transition-duration), transform .4s, top .4s;
    width: -moz-fit-content;
    width: fit-content;
}

.el-message .el-message-icon--success {
    color: #67c23a;
}

.el-icon {
    --color: inherit;
    align-items: center;
    display: inline-flex;
    height: 1em;
    justify-content: center;
    line-height: 1em;
    position: relative;
    width: 1em;
    fill: currentColor;
    color: var(--color);
    font-size: inherit;
}

.el-icon svg {
  width: 1em;
  height: 1em;
}
        `
        document.head.appendChild(style)

        $("#swagger-ui-container .path").after(
            $("<butten>复制</butten>").css("cursor","pointer").css("color", "rgb(24, 144, 255)").click(function (){
                var node = $(this).prev()[0];
                var text = node.textContent.trim(); // 移除末尾空格
                var selection = window.getSelection();
                var range = document.createRange();

                // 创建临时元素存储处理后的文本
                var tempSpan = document.createElement('span');
                tempSpan.textContent = text;
                node.parentNode.insertBefore(tempSpan, node);

                range.selectNodeContents(tempSpan);
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand("Copy");
                selection.removeAllRanges();

                // 移除临时元素
                node.parentNode.removeChild(tempSpan)

                const div = document.createElement('div')
                    div.innerHTML = `<div id="message_1" class="el-message el-message--success" role="alert" style="top: 16px; z-index: 2002;"><!--v-if--><i class="el-icon el-message__icon el-message-icon--success"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"></path></svg></i><p class="el-message__content">复制成功</p><!--v-if--></div>`
                    document.body.appendChild(div)
                    ~(function(dom) {
                        window.setTimeout(() => {
                            dom.remove()
                        }, 2_000)
                    })(div)
            }));

    }, 1000);


})();