// ==UserScript==
// @name         复制swagger中的url
// @namespace    https://plushine.cn
// @version      1.1
// @description  添加复制按钮，点击即可复制url到剪切板
// @author       XJHui
// @match        */swagger-ui.html
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/440773/%E5%A4%8D%E5%88%B6swagger%E4%B8%AD%E7%9A%84url.user.js
// @updateURL https://update.greasyfork.org/scripts/440773/%E5%A4%8D%E5%88%B6swagger%E4%B8%AD%E7%9A%84url.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // 感谢：https://greasyfork.org/zh-CN/scripts/373608-swagger%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6url%E6%8C%89%E9%92%AE
    setTimeout(function (){

        $("#swagger-ui-container .path").after(
            $("<butten>复制</butten>").css("cursor","pointer").css("background","rgb(233, 30, 100)").click(function (){
                // 获取接口文本
                var text=this.parentNode.children[1].children[0].text;
                // 调用函数，复制到剪切板
                copy(text);
                // 提示复制成功
                $(this).text("复制成功！");
                // 定时改变显示文字
                setTimeout(() => {
                    $(this).text("复制");
                }, 1000);
            }));

    }, 1000);

    // 感谢：https://www.jianshu.com/p/154f04482360
    var copy = function (str) {

        var div = document.createElement("div");

        div.innerHTML = '<span>' + str + '</span>';

        document.body.appendChild(div);

        var range = document.createRange();

        var selection = window.getSelection();

        selection.removeAllRanges();

        range.selectNodeContents(div);

        selection.addRange(range);

        document.execCommand('copy');

        selection.removeAllRanges();

        document.body.removeChild(div);

    };
})();