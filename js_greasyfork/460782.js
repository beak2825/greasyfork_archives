// ==UserScript==
// @name         Gmail邮件翻译工具 Gmail translation
// @homepage     https://greasyfork.org/zh-CN/scripts/460782-gmail%E9%82%AE%E4%BB%B6%E7%BF%BB%E8%AF%91%E5%B7%A5%E5%85%B7-gmail-translation
// @version      1.3
// @description  在写email邮件时,你只需要输入中文,然后点击下面的语言按钮,就会将邮件内容翻译为指定语言。
// @match        https://mail.google.com/mail/u/0/*
// @connect      translate.googleapis.com
// @grant        GM_xmlhttpRequest
// @author       zla5
// @license MIT

// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/460782/Gmail%E9%82%AE%E4%BB%B6%E7%BF%BB%E8%AF%91%E5%B7%A5%E5%85%B7%20Gmail%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/460782/Gmail%E9%82%AE%E4%BB%B6%E7%BF%BB%E8%AF%91%E5%B7%A5%E5%85%B7%20Gmail%20translation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //函数翻译文本
    var translate = function(sl, dl, txt, cb) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sl + "&tl=" + dl + "&dt=t&q=" + encodeURI(txt),
            onload: function(response) {
                // Replace the \n
                var _r_text = response.responseText.replace(/\n/g, "");
                var _r = JSON.parse(_r_text);
                var translate_string = "";
                for (var i = 0; i < _r[0].length; i++) {
                    translate_string += _r[0][i][0];
                }
                cb(translate_string);
            }
        });
    };

    //创建添加翻译按钮
    var addButton = function(languageCode, languageName, parentElement) {
        // Create the Translate button
        var button = document.createElement("button");
        button.innerHTML = languageName;
        button.style.marginLeft = "5px";
        button.style.marginRight = "5px";
        button.style.marginBottom = "5px";
        button.style.marginTop = "5px";
        button.style.backgroundColor = "#f8f8f8";
        button.style.border = "1px solid #ccc";
        button.style.borderRadius = "4px";
        button.style.padding = "4px 8px";
        button.style.cursor = "pointer";

// 添加:hover伪类鼠标移动到上面时加深背景颜色
button.addEventListener('mouseover', function(){
  button.style.backgroundColor = "#ccc";
});

button.addEventListener('mouseout', function(){
  button.style.backgroundColor = "#f8f8f8";
});

        // 将单击事件侦听器添加到按钮
        button.addEventListener("click", function() {
            // Find the message content element
            var messageContent = document.querySelector(".editable.LW-avf.tS-tW[contenteditable=true]")// 定位到文本框
            if (!messageContent) {
                console.log("没找到邮件正文");
                return;
            }

            // 等到Textarea元素加载
            var checkExist = setInterval(function() {
                var messageContent = document.querySelector(".editable.LW-avf.tS-tW[contenteditable=true]")
                var text = messageContent.innerText;// 定位到文本框读取里面的文本内容
                console.log(text);

                if (text) {
                    clearInterval(checkExist);

                    // 翻译消息文字
                    translate("zh-CN", languageCode, text.trim(), function(result) {
                        // 用翻译的文本替换消息内容
                        messageContent.innerText = result;
                    });
                }
            }, 100); // 每100ms检查
        });

        //将翻译按钮添加到父元素
        parentElement.appendChild(button);
    };

   //加载页面时添加翻译按钮
    window.addEventListener("load", function() {
        setTimeout(function() {

//找到工具栏元素
var toolbar = document.querySelector(".btC").parentNode;
if (!toolbar) {
    console.log("没找到这个元素位置");
    return;
}


           //创建一个div以保持按钮
            var div = document.createElement("div");
            div.style.textAlign = "Center";

            //将按钮添加到DIV
            addButton("en", "英", div);
            addButton("es", "西", div);
            addButton("ar", "阿", div);
            addButton("fr", "法", div);
            addButton("ru", "俄", div);
            addButton("hu", "匈", div);
            addButton("iw", "希", div);
            addButton("it", "意", div);
            addButton("ja", "日", div);
            addButton("ko", "韩", div);
            addButton("de", "德", div);
            addButton("tr", "土", div);
            //将DIV添加到工具栏
            toolbar.appendChild(div);
        }, 5000); // 等待5秒钟，然后执行添加按钮函数
    });
})();
