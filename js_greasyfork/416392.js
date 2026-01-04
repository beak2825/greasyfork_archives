// ==UserScript==
// @name         google 翻译添加文字格式化窗口
// @namespace    google-trans-delete-wrap
// @version      1.0
// @description  在 google trans 页面添加一个输入框，帮助去除文本的回车
// @author       Ericwyn
// @match        https://translate.google.com/*
// @match        https://translate.google.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416392/google%20%E7%BF%BB%E8%AF%91%E6%B7%BB%E5%8A%A0%E6%96%87%E5%AD%97%E6%A0%BC%E5%BC%8F%E5%8C%96%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/416392/google%20%E7%BF%BB%E8%AF%91%E6%B7%BB%E5%8A%A0%E6%96%87%E5%AD%97%E6%A0%BC%E5%BC%8F%E5%8C%96%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isChinaSite = window.location.href.indexOf("google.cn") >= 0;

    let style = `
    height: 150px;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.37) 0px 1px 4px 0px;
    border: rgb(255, 255, 255);
    outline: none;
    resize:none;
    padding: 20px;
    font-size: 20px;
    margin: 0px;
    width: 100%;
    max-width: ${isChinaSite?"1240px":"1240px"};
`
    if(isChinaSite) {
        style += "width:100%"
    }

    let textAreaHtml = `<br><textarea
    class=".textarea-replace-str"
    style="${replaceAllN(style)}"
    id="input"
    placeholder="粘贴到此处去除多余回车"></textarea>`;


    let domIndex = -1;
    let divs = document.getElementsByTagName("div");
    for (let i =0;i<divs.length;i++){
        if(divs[i].innerText == "发送反馈"){
            // console.log(divs[i])
            domIndex = i;
            break;
        }
    }
    if(isChinaSite) {
        divs[domIndex].previousElementSibling.outerHTML += textAreaHtml
    } else {
        divs[domIndex].previousElementSibling.outerHTML += textAreaHtml

//        divs[domIndex].nextElementSibling.outerHTML = textAreaHtml + divs[domIndex].nextElementSibling.outerHTML;
    }

    let input = document.getElementById("input")

    // 消除全部回车
    function replaceAllN(str){
        while(str.indexOf("\n") > 0) {
            str = str.replace("\n", " ");
            // console.log("replace:" + str)
        }
        return str
    }

    input.addEventListener('input',function () {
        if(input.value.indexOf("\n") > 0) {
            let text = input.value;
            text = replaceAllN(text)
            document.getElementById("input").value = text;
            // 复制
            const copyText = document.querySelector('#input');
            copyText.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
            }

        }
    });

})();


