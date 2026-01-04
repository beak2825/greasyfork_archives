// ==UserScript==
// @name         明之算脚本
// @description  明之算
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.mingzhisuan.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526255/%E6%98%8E%E4%B9%8B%E7%AE%97%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/526255/%E6%98%8E%E4%B9%8B%E7%AE%97%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 抽取硬编码的字符串
const VIDEO_DOWNLOAD_PATH = "下载\\Video\\";

function getLectureFileName(text) {
    let lectureTitle = text;

    // 中文数字转换为阿拉伯数字的映射表
    const numberMap = {
        "一": "01",
        "二": "02",
        "三": "03",
        "四": "04",
        "五": "05",
        "六": "06",
        "七": "07",
        "八": "08",
        "九": "09",
        "十": "10",
        "十一": "11",
        "十二": "12",
        "十三": "13",
        "十四": "14",
        "十五": "15"
    };

    // 将中文数字转换为阿拉伯数字
    function convertNumber(number) {
        if (numberMap[number]) {
            return numberMap[number];
        } else {
            return number;
        }
    }

    // 使用正则表达式匹配数字，并将其转换为两位数的字符串形式
    let lectureNumber = lectureTitle.replace(/第(.+?)讲(.*)/, function(match, p1, p2) {
        let number = convertNumber(p1);
        number = (Number.isInteger(Number(number))) ? number.padStart(2, '0') : number;
        return "第" + number + "讲" + p2;
    });

    // 输出处理后的课程标题
    console.log(lectureNumber); // 输出："第05讲因式分解高阶.mp4"
    return VIDEO_DOWNLOAD_PATH + lectureNumber + ".mp4";
}

function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.style = `
    position: absolute;
    top: -9999px;
    left: -9999px;
    width: 2em;
    height: 2em;
    padding: 0;
    border: none;
    outline: none;
    box-shadow: none;
    background: transparent;
  `;
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    let msg = '该浏览器不支持点击复制到剪贴板';
    if (document.execCommand('copy')) {
        msg = `成功复制到剪贴板\n${text}`;
    }
    alert(msg);

    document.body.removeChild(textArea);
}


(() => {
    'use strict';

    var breadcrumb = $('.layui-breadcrumb');

    // Use template literals for cleaner code
    breadcrumb.append(`<div id="copy-title" style="float:right;">复制标题</div>
                    <div id="copy-url" style="float:right;">复制地址</div>`);

    // Define the click handlers only once
    $("#copy-title").on("click", ()=>{
        var title = $("cite.title").text().replace(/\s+/g, ' ').trim();
        copyToClipboard(getLectureFileName(title));
    });
    $("#copy-url").on("click", ()=>{
        var url = ($("#my-player_html5_api").attr("src") || $("#my-img").attr("src") || "").split("?")[0];
        copyToClipboard(url);
    });

})();
