// ==UserScript==
// @name         彩色回复
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://www.91wii.com/*
// @match        http*://bbs.colg.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412615/%E5%BD%A9%E8%89%B2%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/412615/%E5%BD%A9%E8%89%B2%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
var initColorIndex = Math.round(Math.random() * 255);
    var colorStep = 8;
    var minSize = 13;
    var maxSize = 26;
    var initSize = minSize + Math.round(Math.random() * (maxSize - minSize));
    var sizeFlag = true;

    function getColor(num) {
        if (num > initColorIndex + 360) num = num - 360;
       let r = Math.round(255 * (1 + Math.sin((num + 0) / 180 * 3.14159265)) / 2);
       let g = Math.round(255 * (1 + Math.sin((num + 120) / 180 * 3.14159265)) / 2);
       let b = Math.round(255 * (1 + Math.sin((num + 240) / 180 * 3.14159265)) / 2);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function getSize(num) {
        if (initSize >= maxSize) {
            sizeFlag = false;
            return initSize--;
        } else if (initSize <= minSize) {
            sizeFlag = true;
            return initSize++;
        } else if (sizeFlag) return initSize++;
        else if (!sizeFlag) return initSize--;
    }

    function formatFont(txt) {
        if (!txt) return '';
        return txt.split('').map(function (item) {
            //return '[size=' + getSize(initSize) + 'px][color=' + getColor(initColorIndex += colorStep) + ']' + item + '[/color][/size]';
            return '[color=' + getColor(initColorIndex += colorStep) + ']' + item + '[/color]';
        }).join('');
    }


    //用原生js新建一个button
    var button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("value", '彩色回复');
    button.setAttribute("id", 'mybutton');
    //用原生js在发表回复后面新建一个彩色回复按钮
    document.querySelector("#fastpostform p.ptm.pnpost").appendChild(button);
    //为button绑定click事件
    document.querySelector("#mybutton").onclick = function () {
        //用原生js自动修改文字并且提交
        document.querySelector("#fastpostmessage").value = formatFont(document.querySelector("#fastpostmessage").value);
        document.querySelector("button#fastpostsubmit").click();
        //清空回复框
        document.querySelector("#fastpostmessage").value ="";
    }
    // Your code here...
})();