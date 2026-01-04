// ==UserScript==
// @name         清理shit-uptodate字符
// @namespace    http://453200.xyz/
// @version      1.4
// @description  还原uptodate部分uni字符
// @author       4532
// @match        https://www.uptodate.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518691/%E6%B8%85%E7%90%86shit-uptodate%E5%AD%97%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/518691/%E6%B8%85%E7%90%86shit-uptodate%E5%AD%97%E7%AC%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const button = document.createElement("button");
    button.textContent = "转换并还原 Unicode 转义";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = 10000;
    button.style.backgroundColor = "#28a745";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "10px";
    button.style.cursor = "pointer";
    document.body.appendChild(button);

    // 映射表：希腊字母和对应的拉丁字母，补充更多字符
        const greekToLatinMap = {
             '\u00b1': '±',
             '\u0391': 'A',
             '\u0392': 'B',
             '\u0395': 'E',
             '\u0396': 'Z',
             '\u0397': 'H',
             '\u0399': 'I',
             '\u039a': 'K',
             '\u039c': 'M',
             '\u039d': 'N',
             '\u039f': 'O',
             '\u03a0': 'N',
             '\u03a1': 'P',
             '\u03a4': 'T',
             '\u03a5': 'Y',
             '\u03a7': 'X',
             '\u03b1': 'a',
             '\u03b2': 'b',
             '\u03b9': 'i',
             '\u03bf': 'o',
             '\u03c1': 'p',
             '\u03c5': 'u',
             '\u03c7': 'X',
             '\u03f2': 'c',
             '\u03f3': 'j',
             '\u03f9': 'C',
             '\u0405': 'S',
             '\u0406': 'I',
             '\u0408': 'J',
             '\u0410': 'A',
             '\u0412': 'B',
             '\u0415': 'E',
             '\u041c': 'M',
             '\u041d': 'H',
             '\u041e': 'O',
             '\u0420': 'P',
             '\u0421': 'C',
             '\u0422': 'T',
             '\u0423': 'y',
             '\u0425': 'X',
             '\u042c': 'b',
             '\u0430': 'a',
             '\u0432': 'B',
             '\u0433': 'r',
             '\u0435': 'e',
             '\u043c': 'M',
             '\u043d': 'H',
             '\u043e': 'o',
             '\u0440': 'p',
             '\u0441': 'c',
             '\u0442': 'T',
             '\u0443': 'y',
             '\u0445': 'x',
             '\u0448': 'w',
             '\u044c': 'b',
             '\u0455': 's',
             '\u0456': 'i',
             '\u0458': 'j',
             '\u0461': 'w',
             '\u04ae': 'Y',
             '\u04bb': 'h',
             '\u04c0': 'I',
             '\u0501': 'd',
             '\u050d': 'G',
             '\u051a': 'Q',
             '\u051b': 'q',
             '\u051c': 'W',
             '\u051d': 'w',
             '\u053c': 'L',
             '\u0578': 'n',
             '\u057d': 'u',
             '\u2014': '—',
             '\u2022': '•',
             '\u2265': '≥',
             '\u25cf': '●'
    };

    function convertToUnicodeEscapes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(/[\s\S]/g, function(char) {
                return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const child of node.childNodes) {
                convertToUnicodeEscapes(child);
            }
        }
    }

    function restoreUnicode(node) {
        let replaceCount = 0; // 用于记录替换次数

        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(/\\u([0-9A-Fa-f]{4})/g, function(match, p1) {
                let char = String.fromCharCode(parseInt(p1, 16));
                if (greekToLatinMap[char]) {
                    replaceCount++;
                    return greekToLatinMap[char];
                }

                return char;
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 递归遍历所有子节点
            for (const child of node.childNodes) {
                replaceCount += restoreUnicode(child); // 递归计数
            }
        }
        return replaceCount;
    }

    // 按钮点击事件
    button.addEventListener("click", function() {
        convertToUnicodeEscapes(document.body);
        alert("页面文本已转换为 Unicode 转义。");
        setTimeout(function() {
            const totalReplacements = restoreUnicode(document.body);
            alert("Unicode 转义字符已恢复为原字符，希腊字母已映射为拉丁字母！" +
                "\n总共替换了 " + totalReplacements + " 次。");
        }, 1000);
    });
})();
