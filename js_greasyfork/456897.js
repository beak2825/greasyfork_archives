// ==UserScript==
// @name 云剪切板链接识别
// @namespace http://tampermonkey.net/
// @version 1.1.0
// @description 自动嗅探剪切板中的链接并询问是否需要打开
// @author 捈荼
// @license Apache License 2.0
// @match http://600s.com/*
// @match https://600s.com/*
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/456897/%E4%BA%91%E5%89%AA%E5%88%87%E6%9D%BF%E9%93%BE%E6%8E%A5%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/456897/%E4%BA%91%E5%89%AA%E5%88%87%E6%9D%BF%E9%93%BE%E6%8E%A5%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==

// commented by ChatGPT

/**
 * This function searches for URLs in the inner text of the element with class 'txt_view p' and prompts the user to open the URL(s).
 * If one URL is found, the user is prompted to confirm whether they want to open it.
 * If multiple URLs are found, the user is prompted to confirm whether they want to open the first URL, or if they want to open another URL by inputting its index.
 */

(function () {
    "use strict";

    // Find all URLs in the inner text of the element with class 'txt_view p' using a regular expression
    let RegRes = document.querySelector('.txt_view p').innerText.matchAll(/(https?|ftp|file):\/\/[-A-Za-z0-9+\&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+\&@#\/%=~_|]/g);

    // Convert the iterable RegRes object to an array
    let RegResArray = Array.from(RegRes);

    // Get the length of the RegResArray
    let RegResArrayLen = RegResArray.length;

    // If one URL is found, prompt the user to confirm whether they want to open it
    if (RegResArrayLen == 1) {
        if (confirm('在口令中发现 URL ，是否打开？'))
            document.location.href = RegResArray[0][0];
    }
    // If multiple URLs are found, prompt the user to confirm whether they want to open the first URL, or if they want to open another URL by inputting its index
    else if (RegResArrayLen > 1) {
        if (confirm('在口令中发现 URL ，是否打开第一个链接？'))
            document.location.href = RegResArray[0][0];
        else {
            let promptStr = '是否想要打开其他链接？\n请输入序号：\n', choices = '';
            let cnt = 0;
            // Create a string with the index and URL of each URL in RegResArray
            RegResArray.forEach(
                (item) => {
                    choices += ++cnt + '. ' + item[0] + '\n';
                }
            );
            // Prompt the user to enter the index of the URL they want to open
            let option = prompt(promptStr + choices), num;
            // Validate the user's input
            while ((isNaN(option) || ((num = parseInt(option)), (num <= 0 || num > RegResArrayLen))) && option != null) {
                option = prompt('您的输入不合规，请重新选择：\n' + choices);
            }
            // If the user's input is valid, open the URL at the index they entered
            if (option != null)
                document.location.href = RegResArray[num - 1][0];
        }
    }
})();