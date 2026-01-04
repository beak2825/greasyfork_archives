// ==UserScript==
// @name         形式与政策网络学习平台
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  形式与政策网络学习平台跳过等待与自动答题
// @author       Kiyuiro
// @match        http://xszc.cswu.cn/*
// @icon         https://avatars.githubusercontent.com/u/46850357?v=4
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444143/%E5%BD%A2%E5%BC%8F%E4%B8%8E%E6%94%BF%E7%AD%96%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/444143/%E5%BD%A2%E5%BC%8F%E4%B8%8E%E6%94%BF%E7%AD%96%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("形式与政策网络学习平台 copyToClip")

    let content = "";

    // Your code here...
    let copyToClip = contentArray => {
        var contents = "";
        for (var i = 0; i < contentArray.length; i++) {
            contents += contentArray[i] + "\n";
        }
        const textarea = document.createElement('textarea');
        console.log(textarea);
        textarea.value = contents;
        document.body.appendChild(textarea);
        textarea.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            console.log('复制成功');
        }
        document.body.removeChild(textarea);
        return contents;
    }

    const button1 = document.createElement('input');
    button1.type = "button"
    button1.value = "点击复制并跳转"
    button1.style.position = "fixed"
    button1.style.top = "20px"
    button1.style.right = "20px"
    document.body.appendChild(button1);

    button1.onclick = () => {
        let spans = document.querySelectorAll(".txt>p, .txt>span")
        let contentArray = [];
        spans.forEach(item => {
            let text = item.innerHTML.replace(/<.*?>/g, "");
            text = text.replace(/&nbsp;/g, "");
            contentArray.push(text)
        })
        copyToClip(contentArray)
        document.querySelector("[name='regForm']").submit();
    }

    let button2 = document.createElement('input');
    button2.type = "button"
    button2.value = "自动选择答案"
    button2.style.position = "fixed"
    button2.style.top = "50px"
    button2.style.right = "20px"
    document.body.appendChild(button2);

    let textarea = document.createElement('textarea')
    textarea.style.position = "fixed"
    textarea.style.top = "20px"
    textarea.style.left = "20px"
    document.body.appendChild(textarea);

    function filter(s) {
        s = s.substr(s.indexOf("A"))
        //console.log("substr:", s);

        s = s.replace(/[A,B,C,D][\., ．]/g, " ")
        s = s.trim();
        //console.log("replace:", s);

        s = s.split(" ");
        //console.log("split:", s);

        s = s.filter(item => item.length)
        //console.log("filter:", s);

        return s;
    }

    button2.onclick = () => {
        let p = document.querySelectorAll('[action]>p, [action]>span');
        let context = "";
        p.forEach(item => {
            let text = item.innerHTML.replace(/<.*?>/g, "");
            text = text.replace(/&nbsp;/g, "");
            context += text;
        })
        //console.log("context", context);

        let s = context.split("2.");
        let checkboxs = document.querySelectorAll("[type='checkbox']")
        let textarea = document.querySelector("textarea").value;
        for(let i = 0; i < s.length; ++i) {
            let select = filter(s[i]);
            //console.log("select", i, select);

            let check = [];
            select.forEach(item => {
                check.push(textarea.indexOf(item) != -1)
            })
            //console.log("check", i, check);

            for(let j = 0; j < 4; ++j) {
                checkboxs[i*4+j].checked = check[j];
            }
        }

    }

})();