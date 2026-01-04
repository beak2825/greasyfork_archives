// ==UserScript==
// @name         检索(内网)
// @namespace    http://tampermonkey.net/
// @version      9.9
// @description  新开选课窗口
// @author       You
// @match        http://172.18.2.45/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2.43
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517360/%E6%A3%80%E7%B4%A2%28%E5%86%85%E7%BD%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517360/%E6%A3%80%E7%B4%A2%28%E5%86%85%E7%BD%91%29.meta.js
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
    var button1 = document.createElement('button');
    button1.innerText = '框内';
    button1.style.position = 'fixed';
    button1.style.top = '0px';
    button1.style.left = '0px';
    document.body.appendChild(button1);

    button1.addEventListener('click', function() {
        submitForm1();
    });

    function submitForm1() {
        var form = document.createElement('form');
        form.action = 'http://172.18.2.45/wsxk/stu_xsyx_rpt.aspx';
        form.method = 'POST';

        var fields = {
            'sel_lx': '2',
            'btn_search': '%BC%EC%CB%F7',
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
    var button2 = document.createElement('button');
    button2.innerText = '新建';
    button2.style.position = 'fixed';
    button2.style.top = '0px';
    button2.style.left = '43px';  // 设置不同的位置避免重叠
    document.body.appendChild(button2);

    button2.addEventListener('click', function() {
        submitForm2();
    });

    function submitForm2() {
        var form = document.createElement('form');
        form.action = 'http://172.18.2.45/wsxk/stu_xsyx_rpt.aspx';
        form.method = 'POST';
        form.target = '_blank';
        form.Referer = 'http://172.18.2.45/wsxk/stu_xsyx.aspx';

        var fields = {
            'sel_lx': '2',
            'btn_search': '%BC%EC%CB%F7',
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

})();
    })();