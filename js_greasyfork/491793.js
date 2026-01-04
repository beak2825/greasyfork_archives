// ==UserScript==
// @name CSDN复制工具
// @description 帮助用户免登录复制CSDN代码
// @namespace CSDNCodeCopyTool
// @version 1.01.3
// @grant none
// @include http://blog.csdn.net/*/article/details/*
// @include https://blog.csdn.net/*/article/details/*
// @include http://ask.csdn.net/questions/*
// @include https://ask.csdn.net/questions/*
// @include http://wenku.csdn.net/column/*
// @include https://wenku.csdn.net/column/*
// @author 茹莱本座
// @license LGPL
// @downloadURL https://update.greasyfork.org/scripts/491793/CSDN%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/491793/CSDN%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
// 载入CSS
var styleElem = document.createElement("style");
styleElem.innerText = atob("LmNvZGVfY29udGVudF9ibG9nY29weXRvb2x7d2lkdGg6MTAwJTtoZWlnaHQ6OTAlO2JhY2tncm91bmQtY29sb3I6bGlnaHRncmV5O2JvcmRlcjoxcHggc29saWQgYmxhY2s7Ym9yZGVyLXJhZGl1czoxbW07Y3Vyc29yOm5vcm1hbH0uYmFja19idXR0b25fYmxvZ2NvcHl0b29se3dpZHRoOjEwMCU7aGVpZ2h0OjEwJTtiYWNrZ3JvdW5kOi13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLHJpZ2h0IHRvcCxmcm9tKCMwOGYpLHRvKCMwMGI2ZmYpKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudChsZWZ0LCMwOGYsIzAwYjZmZik7Y29sb3I6I2ZlZmVmZTstd2Via2l0LWJveC1zaGFkb3c6MCA0cHggNnB4IHJnYmEoMCwxNTQsMjU1LC4yKTtib3gtc2hhZG93OjAgNHB4IDZweCByZ2JhKDAsMTU0LDI1NSwuMik7Ym9yZGVyLXJhZGl1czoycHg7aGVpZ2h0OjM0cHg7bGluZS1oZWlnaHQ6MzRweDtwYWRkaW5nOjAgMjBweDtmb250LXNpemU6MTJweH0uYm94X2Jsb2djb3B5dG9vbHtwb3NpdGlvbjphYnNvbHV0ZSFpbXBvcnRhbnQ7dG9wOjAhaW1wb3J0YW50O2xlZnQ6MCFpbXBvcnRhbnQ7cmlnaHQ6MCFpbXBvcnRhbnQ7Ym90dG9tOjAhaW1wb3J0YW50O21hcmdpbjphdXRvIWltcG9ydGFudDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDozNjBweDtoZWlnaHQ6MTkwcHg7cGFkZGluZzozMHB4IDg0cHg7bWFyZ2luOjIzMnB4IGF1dG87YmFja2dyb3VuZDojZmZmO2JvcmRlci1yYWRpdXM6MnB4O2ZvbnQtc2l6ZToxNHB4O2NvbG9yOiMyMjI7LXdlYmtpdC1ib3gtc2hhZG93OjAgNnB4IDE2cHggcmdiYSgwLDAsMCwuMSk7Ym94LXNoYWRvdzowIDZweCAxNnB4IHJnYmEoMCwwLDAsLjEpO3otaW5lZHg6OTk5O30=")
document.head.appendChild(styleElem);
var styleElem2 = document.createElement("style");
styleElem2.innerText = atob("LmRvY29weV9idXR0b25fY3NkbmNvcHl0b29se2JhY2tncm91bmQtY29sb3I6I2YxZjNmNCFpbXBvcnRhbnQ7ZmxvYXQ6cmlnaHQ7d2lkdGg6YXV0bztoZWlnaHQ6Ni40bW07Ym9yZGVyLXJhZGl1czo0cHg7LXdlYmtpdC10cmFuc2l0aW9uOmFsbCAuM3M7dHJhbnNpdGlvbjphbGwgLjNzO2JhY2tncm91bmQ6dXJsKC4uL2ltZy9sb2dvLjM1NzRjYTkzLnBuZykgbm8tcmVwZWF0IDEwMCUgMTAwJTtjb2xvcjpibGFjaztjdXJzb3I6cG9pbnRlcjt9")
document.head.appendChild(styleElem2);

function doCopy(codeBlock) {
    // 获取代码并放在可以正常复制的地方以达到插件效果
    if (typeof codeBlock == typeof document.body) {
        // 免费复制主体部分
        let box = document.createElement("div")
        let codeContent = document.createElement("textarea");
        let backButton = document.createElement("button");
        codeContent.classList.add("code_content_blogcopytool");
        codeContent.innerText = codeBlock.innerText;
        codeContent.setAttribute("readonly", (true).toString());
        codeContent.addEventListener("copy", function () {
            closeBox(this.parentNode);
        });
        backButton.innerText = "关闭";
        backButton.addEventListener("click", function () {
            closeBox(this.parentNode);
        });
        backButton.classList.add("back_button_blogcopytool");
        box.classList.add("box_blogcopytool");
        box.appendChild(codeContent);
        box.appendChild(backButton);
        return document.body.appendChild(box) && document.body.lastChild.firstChild.focus();
    } else {
        // 防止出现bug，不过正常使用不可能出现
        return false;
    }
}

function closeBox(box) {
    // 删掉对话框
    box.remove()
}

function scanCodeBlocks() {
    // 扫描所有代码块
    return document.querySelectorAll(".set-code-show code,.set-code-hide code");
}

function addCopyButton(codeBlock) {
    // 添加复制按键
    var copyButton = document.createElement("div");
    copyButton.classList.add("docopy_button_csdncopytool");
    copyButton.innerText = "免登录复制";
    copyButton.addEventListener("click", function() {
        // 执行复制
        doCopy(this.parentNode);
    })
    codeBlock.insertBefore(copyButton, codeBlock.lastChild);
}
setTimeout(function() {
    // 延迟5秒加载插件，确保内容全部加载完成
    scanCodeBlocks().forEach(addCopyButton);
}, 5000)