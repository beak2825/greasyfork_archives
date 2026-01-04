// ==UserScript==
// @name         Redmine获取单名
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  方便Redmine获取单名
// @author       Fanki
// @match        *.com/redmine*
// @icon         https://www.google.com/s2/favicons?domain=6.8
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502749/Redmine%E8%8E%B7%E5%8F%96%E5%8D%95%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/502749/Redmine%E8%8E%B7%E5%8F%96%E5%8D%95%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    //封装xpath
    function getElementByXpath(xpath){
        var element = document.evaluate(xpath,document).iterateNext();
        return element;
    }
    function CopyWorkInfoName() {
        var searchList = ['//*[@id="content"]/div[2]/div[2]/div/h3',
                          '//*[@id="content"]/div[2]/div[2]/div/div/h3',
                          '//*[@id="content"]/div[2]/div[2]/div/div/div/h3',
                          '//*[@id="content"]/div[2]/div[2]/div/div/div/div/h3',
                          '//*[@id="content"]/div[2]/div[2]/div/div/div/div/div/h3',
                          '//*[@id="content"]/div[2]/div[3]/div/h3',
                          '//*[@id="content"]/div[2]/div[3]/div/div/h3',
                          '//*[@id="content"]/div[2]/div[3]/div/div/div/h3',
                          '//*[@id="content"]/div[2]/div[3]/div/div/div/div/h3',
                          '//*[@id="content"]/div[2]/div[3]/div/div/div/div/div/h3',];
        const headElement = getElementByXpath('//*[@id="content"]/h2');

        var count = 0;
        var inputElement = getElementByXpath(searchList[count]);
        while(!inputElement)
        {
            count++;
            if (count >= searchList.length)
            {
                break;
            }
            inputElement = getElementByXpath(searchList[count]);
        }

        const textArea = document.createElement("textarea");
        textArea.value = headElement.innerText + inputElement.innerText;

        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";

        document.body.prepend(textArea);
        textArea.select();
        //document.querySelector("#content > div.issue.tracker-2.status-5.priority-2.priority-default.closed.details > div.subject > div > h3");

        document.execCommand('copy');
        document.body.removeChild(textArea)

        //navigator.clipboard.writeText('啊手动阀手动阀手动阀');
        alert("当前页面的工作量统计：" + textArea.value);
    }

    var button = document.createElement("button");
    button.innerHTML = "复制单号内容";
    button.style.position = "fixed";
    button.style.top = "100px";
    button.style.right = "100px";
    button.onclick = CopyWorkInfoName;
    document.body.appendChild(button);
})();