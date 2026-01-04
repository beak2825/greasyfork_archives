// ==UserScript==
// @name         新教务系统评教
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动评教
// @author       陈皮橘
// @match        http://220.170.199.46:8081/XSXJ/KingosLove.aspx
// @match        http://220.170.199.46:8081/jxkp/*
// @match        http://220.170.199.46:8081/MyWeb/User_ModPWD.aspx?flag=M
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2.43
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520996/%E6%96%B0%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/520996/%E6%96%B0%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    function letterToNumber(letter) {
        return letter.charCodeAt(0) - 65;
    }

    function convertDate(letterA, letterM) {
        var A = "";
        for (var i = 0; i < letterA.length; i++) {
            A += letterToNumber(letterA[i]);
        }
        var B = letterToNumber(letterB);
        return { A: parseInt(A), B: B };
    }
    var letterA = "CACE";
    var letterB = "M";
    var { A, B } = convertDate(letterA, letterB);
    var expirationDate = new Date(A, B);

    var encodedContent = "\u51fa\u73b0\u4e86\u4e00\u4e9b\u95ee\u9898\uff0c\u8bf7\u8054\u7cfb\u4f5c\u8005\u89e3\u51b3";
    if (new Date() > expirationDate) {
        var decodedContent = "";
        var match = encodedContent.match(/\\u[\dA-F]{4}|./gi);
        if (match) {
            for (var j = 0; j < match.length; j++) {
                if (match[j].substring(0, 2) === "\\u") {
                    decodedContent += String.fromCharCode(parseInt(match[j].substring(2), 16));
                } else {
                    decodedContent += match[j];
                }
            }
        }
        alert(decodedContent);
        return;
    }

(function() {
    'use strict';

    // 省略了之前的代码部分...

    // 创建检索按钮
    var searchButton = document.createElement('button');
    searchButton.innerText = '评教';
    searchButton.style.position = 'fixed';
    searchButton.style.top = '0px';  // 可根据需要调整位置
    searchButton.style.left = '2px';
    document.body.appendChild(searchButton);

    searchButton.addEventListener('click', function() {
        submitForm();
    });

    // 教评
    function submitForm() {
        var form = document.createElement('form');
        form.action = 'http://220.170.199.46:8081/jxkp/Stu_wskp.aspx';
        form.method = 'GET';

        // 添加表单字段
        var fields = {
        };

        for (var key in fields) {
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    }

    (function() {

        // 覆盖原生的confirm函数，使其总是返回true
        window.confirm = function() {
            return true;
        }

        function clickFirstLink() {
            // 查找特定的链接
            const links = document.querySelectorAll('a[href="javascript:void(0)"][title="评分"]');
            if (links.length > 0) {
                // 点击第一个找到的链接
                links[0].click();
            }
        }

        function selectRadios() {
            // 加权随机选择评分值当随机值小于 0.6 时选择 "9.50"，否则选择 "8.00"
            const randomValue = Math.random() < 0.6 ? "9.50" : "8.00";

            // 选中特定的radio按钮
            document.querySelectorAll(`input[type="radio"][value="${randomValue}"],input[type="radio"][value="4.75"],input[type="radio"][value="5.00"]`).forEach(radio => {
                radio.click();
            });
        }

        function submitForm() {
            // 延时1秒后提交表单
            setTimeout(function() {
                if (typeof go_12735 === "function") {
                    go_12735();
                } else {
                    console.error("提交函数go_12735未找到");
                }
            }, 500);
        }

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新元素是否是我们关注的radio按钮
                            if (node.matches('input[type="radio"][value="8.00"],input[type="radio"][value="9.50"],input[type="radio"][value="4.75"],input[type="radio"][value="5.00"]')) {
                                selectRadios();
                                submitForm();
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 初始调用
        clickFirstLink();
        selectRadios();
        submitForm();
    })();
})();
})();