// ==UserScript==
// @name         Swagger复制地址
// @name:en      swagger_copy
// @namespace    https://github.com/kirileec/swagger_copy
// @version      0.1.1
// @description  Swagger UI 3 复制 API path
// @description:en  Swagger UI 3 add copy button after operation (.opblock-summary) for copying API path
// @license MIT
// @author       linx
// @icon         https://s3.bmp.ovh/imgs/2022/03/1e2657c3aa8567bd.png
// @match        *://*/swagger/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440793/Swagger%E5%A4%8D%E5%88%B6%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/440793/Swagger%E5%A4%8D%E5%88%B6%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==


; (() => {

    function Toast(msg, duration) {
        duration = isNaN(duration) ? 3000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function () {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function () {
                document.body.removeChild(m)
            }, d * 1000);
        }, duration);
    }
    function copyToClipBoard(content) {
        // navigator clipboard 需要https等安全上下文
        if (navigator.clipboard && window.isSecureContext) {
            // navigator clipboard 向剪贴板写文本
            Toast('The api path has been copied!', 2000);
            return navigator.clipboard.writeText(content);
        } else {
            // 创建text area
            let textArea = document.createElement("textarea");
            textArea.value = content;
            // 使text area不在viewport，同时设置不可见
            textArea.style.position = "absolute";
            textArea.style.opacity = 0;
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            //textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                // 执行复制命令并移除文本框
                Toast('The api path has been copied!', 2000);
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }
        
    }

    const sheets = `
            /* 复制按钮的样式 */
            .btn-copy {
                width: 16px;
                height: 16px;
                border: 0px;
                padding:0px;
                background-color: transparent;
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAHJJREFUOE9jZKAQMOLQH8rAwJBFwOxpDAwMq3EZsJ9IhzkSMsARh0EwC3AaQMgBGAYQ7WeoyRgGEO1nQgYQ9POgMADZu/BYgAcKoWhjYGCAqUVJSKQYgGIHLCFRzQBCCQgjlmAuIDUhwS3ClRcIuQQuDwCk5B8RCCbZMAAAAABJRU5ErkJggg==");
            }

            /* 按钮显隐样式 */
            #swagger-ui .opblock .toolkit-path-btn-group { margin-left: 10px;margin-top:5px; display: none; }
            #swagger-ui .opblock:hover .toolkit-path-btn-group {  margin-left: 10px;margin-top:5px;display: block; }
        `
    // 插入样式
    const sheet = document.createTextNode(sheets)
    const el = document.createElement('style')
    el.id = 'swagger-toolkit-sheets'
    el.appendChild(sheet)
    document.getElementsByTagName('head')[0].appendChild(el)
    // 设置鼠标移动事件
    document.querySelector('#swagger-ui').addEventListener('mouseover', evt => {
        const opblock = evt.target.closest('.opblock')
        if (!opblock) return
        if (opblock.querySelector('.toolkit-path-btn-group')) return
        // 创建按钮
        const group = document.createElement('div')
        const copyBtn = document.createElement('button')
        group.classList.add('toolkit-path-btn-group')
        copyBtn.classList.add('btn-copy')
        group.appendChild(copyBtn)
        // 点击时执行复制
        copyBtn.addEventListener('click', evt => {
            console.log("click")
            evt.stopPropagation()
            const pathDOM = evt.target.closest('.opblock-summary-path')
            if (!pathDOM) return
            const pathLink = pathDOM.querySelector('a')
            if (!pathLink) return
            const path = pathLink.innerText
            copyToClipBoard(path);

        })

        const pathDOM = opblock.querySelector('.opblock-summary-path')
        if (pathDOM) pathDOM.appendChild(group)
    })


})();
