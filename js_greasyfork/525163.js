// ==UserScript==
// @name         自动填写页面中的账号密码
// @namespace    https://frank6.com/
// @version      0.0.1
// @description  将演示站点提供的账号密码自动填写到对应的位置
// @author       Frank6
// @match        *://*/*
// @icon         *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525163/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/525163/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 正则表达式匹配规则，匹配账号、账户、用户名关键字，并且后面跟着半角或全角冒号，然后再跟着字符串，这个字符串包含大小写字母、数字、下划线、中划线、点号和at符号，这个字符串的长度至少为1
    var accountRegex = /(账号|账户|用户名)[:：](\w+)/g;
    // 正则表达式匹配规则，匹配密码关键字，然后再跟着字符串，这个字符串包含任意字符至本行结束
    var pwdRegex = /(密码)[:：](.*)/g;

    // 获取所有文本节点

    var textNodes = document.evaluate("//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    // 遍历文本节点
    for (var i = 0; i < textNodes.snapshotLength; i++) {
        var node = textNodes.snapshotItem(i);
        var text = node.nodeValue;

        // 匹配正则表达式
        var accountMatches = text.match(accountRegex);
        var pwdMatches = text.match(pwdRegex);


        // 如果有匹配结果
        if (accountMatches) {
            console.log(accountMatches)
            // 遍历匹配结果
            for (var j = 0; j < accountMatches.length; j++) {
                var match = accountMatches[j];

                // 提取账号
                var account = match.split(":")[1] || match.split("：")[1];
                console.log(account)
                // 在页面中查找对应的输入框，name等于username或email或acccount
                var input = document.querySelector("input[name='username'], input[name='email'], input[name='acccount']");
                // 如果找到了输入框
                if (input) {
                    // 填充账号
                    input.value = account;
                }

            }
        }
        // 如果有匹配结果
        if (pwdMatches) {
            console.log(pwdMatches)
            // 遍历匹配结果
            for (var j = 0; j < pwdMatches.length; j++) {
                var match = pwdMatches[j];
                // 提取密码，半角或全角冒号后面的所有字符
                var pwd = match.split(":")[1] || match.split("：")[1];

                console.log(pwd)
                // 在页面中查找对应的输入框，name等于password
                var input = document.querySelector("input[name='password']");
                // 如果找到了输入框
                if (input) {
                    // 填充密码
                    input.value = pwd;
                }
            }
        }
    }
})();