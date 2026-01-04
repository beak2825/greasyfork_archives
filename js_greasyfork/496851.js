// ==UserScript==
// @name         广东工贸优慕课脚本
// @namespace    http://tampermonkey.net/
// @version      2025-06-21
// @description  广东工贸优慕课脚本，“网课小工具题库（GO题）”右键设置密钥
// @author       577fkj
// @match        https://umooc.gdgm.edu.cn/meol/common/question/test/student/stu_qtest_question.jsp**
// @match        https://umooc.gdgm.cn/meol/common/question/test/student/stu_qtest_question.jsp**
// @icon         https://umooc.gdgm.cn/favicon.ico
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/496851/%E5%B9%BF%E4%B8%9C%E5%B7%A5%E8%B4%B8%E4%BC%98%E6%85%95%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/496851/%E5%B9%BF%E4%B8%9C%E5%B7%A5%E8%B4%B8%E4%BC%98%E6%85%95%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var HtmlUtil = {
        htmlEncode:function (html){
            var temp = document.createElement ("div");
            (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
            var output = temp.innerHTML;
            temp = null;
            return output;
        },
        htmlDecode:function (text){
            var temp = document.createElement("div");
            temp.innerHTML = text;
            var output = temp.innerText || temp.textContent;
            temp = null;
            return output;
        }
    };

    console.log('load');
    var body = document.body;
    var result = '';

    document.getElementsByClassName('testcontent')[0].childNodes.forEach((node) => {
        if (node instanceof HTMLInputElement){
            result += node.value + '\n';
            return;
        }
    });

    var title = HtmlUtil.htmlDecode(result);

    var questionType = '[论述题]';
    var optionInputs = document.querySelectorAll('.optionContent input[type="radio"], .optionContent input[type="checkbox"]');
    if (optionInputs.length > 0) {
        questionType = optionInputs[0].type === 'radio' ? '[单选题]' : '[多选题]';
    }

    result = questionType + '\n' + result;

    var a = [];
    var nextCharCode = 'A'.charCodeAt(0);
    var optionInputsArray = [];

    document.querySelectorAll('.optionContent').forEach((node) => {
        const options = node.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        if (options.length > 0) {
            options.forEach(input => {
                let labelText = '';

                if (input.parentNode.tagName === 'TD') {
                    labelText = input.parentNode.nextElementSibling.textContent || input.parentNode.nextElementSibling.innerText;
                } else if (input.parentNode.tagName === 'LABEL') {
                    labelText = input.parentNode.textContent || input.parentNode.innerText;
                } else {
                    console.log('无法解析题目', node, input);
                    return;
                }

                labelText = (labelText || '').trim().replace('\t', '');
                const optionChar = String.fromCharCode(nextCharCode++);
                a.push(`${optionChar}:${labelText}`);
                optionInputsArray.push(input);

                node.addEventListener('click', () => input.click());
            });
        }
    });

    result += a.join("\n");
    body.oncontextmenu = function(){}
    body.onselectstart = function(){}
    body.oncopy = function(){}

    result = HtmlUtil.htmlDecode(result);

    console.log("题目：\n", result);
    var inputElement = document.createElement('textarea');
    inputElement.style.width = '100%';
    inputElement.style.height = '100px';
    inputElement.value = result;
    body.appendChild(inputElement);

    var copyButton = document.createElement('button');
    copyButton.textContent = '复制';
    copyButton.addEventListener('click', function() {
        inputElement.select();
        inputElement.setSelectionRange(0, inputElement.value.length);
        document.execCommand('copy');
    });
    body.appendChild(copyButton);

    var url_map = {
        "百度": "https://www.baidu.com/s?ie=UTF-8&wd=",
        "百度AI": "https://chat.baidu.com/search?word=",
        "百度手机版": "https://m.baidu.com/s?ie=UTF-8&word=",
        "不挂科": "https://easylearn.baidu.com/edu-page/tiangong/bgklist?query="
    };

    function openWin(url) {
        var name = 'seache';
        var iWidth=500;
        var iHeight=570;
        var iTop = (window.screen.height-30-iHeight)/2;
        var iLeft = (window.screen.width-10-iWidth)/2;
        window.open(url,name,'height='+iHeight+',innerHeight='+iHeight+',width='+iWidth+',innerWidth='+iWidth+',top='+iTop+',left='+iLeft+',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
    }

    function createButtonClickHandler(url) {
        return function() {
            var fullUrl = url + encodeURI(result);
            openWin(fullUrl);
        };
    }

    function similar(s, t, f) {
        if (!s || !t) return 0;
        if(s === t) return 100;

        var l = Math.max(s.length, t.length);
        var n = s.length;
        var m = t.length;
        var d = [];
        f = f || 2;

        var min = function (a, b, c) {
            return Math.min(a, b, c);
        };

        var i, j, si, tj, cost;
        if (n === 0) return m;
        if (m === 0) return n;

        for (i = 0; i <= n; i++) {
            d[i] = [i];
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j;
        }

        for (i = 1; i <= n; i++) {
            si = s.charAt(i - 1);
            for (j = 1; j <= m; j++) {
                tj = t.charAt(j - 1);
                cost = si === tj ? 0 : 1;
                d[i][j] = min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1]+cost);
            }
        }

        let res = (1 - d[n][m] / l) * 100;
        return res.toFixed(f);
    }

    function seache() {
        GM_xmlhttpRequest({
            method: "POST",
            url: 'https://cx.icodef.com/wyn-nb?v=4',
            responseType: "json",
            data: "question=" + encodeURIComponent(title),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": GM_getValue("key")
            },
            onload: function(res){
                console.log(res);
                var resultElement = document.createElement('textarea');
                resultElement.style.width = '100%';
                resultElement.style.height = '100px';
                var resultText = res.response.code === 1 ? title + "\n答案是：" + res.response.data : title + "\n错误：" + res.response.msg;
                var is_find = false;

                if (res.response.code === 1) {
                    for (var i = 0; i < a.length; i++) {
                        var optionText = a[i].split(':')[1] || '';
                        var ss = similar(res.response.data, optionText);
                        if (ss > 50) {
                            is_find = true;
                            resultText += "\n答案相似度：" + ss;
                            optionInputsArray[i].click();
                            break;
                        }
                    }
                    if (!is_find) {
                        resultText += "\n未匹配到答案";
                    }
                }

                resultElement.value = resultText;
                body.appendChild(resultElement);
            }
        });
    }

    for (var key in url_map) {
        if (url_map.hasOwnProperty(key)) {
            var buttonElement = document.createElement('button');
            buttonElement.textContent = key + '搜索';
            buttonElement.addEventListener('click', createButtonClickHandler(url_map[key]));
            body.appendChild(buttonElement);
        }
    }

    var buttonSeache = document.createElement('button');
    buttonSeache.textContent = '网课小工具题库（GO题）';
    buttonSeache.addEventListener('click', seache);
    buttonSeache.addEventListener("contextmenu", function(event) {
        event.preventDefault();
        var key = prompt('微信公众号"一之哥哥"发送"token"获取密钥，请输入密钥：', GM_getValue("key"));
        if (key) {
            GM_setValue("key", key);
        }
    });
    body.appendChild(buttonSeache);

    function random() {
        if (optionInputsArray.length > 0) {
            var randomInput = optionInputsArray[Math.floor(Math.random() * optionInputsArray.length)];
            randomInput.click();
        }
    }

    var buttonRandom = document.createElement('button');
    buttonRandom.textContent = '随机';
    buttonRandom.addEventListener('click', random);
    body.appendChild(buttonRandom);

})();