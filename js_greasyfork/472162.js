// ==UserScript==
// @name         摸鱼看小说
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  上班叫换取报酬，摸鱼那才叫赚钱！
// @license      MIT
// @author       binsor
// @match        https://*/*
// @match        http://*/*
// @icon         https://www.binscor.top/favicon.ico
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/472162/%E6%91%B8%E9%B1%BC%E7%9C%8B%E5%B0%8F%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/472162/%E6%91%B8%E9%B1%BC%E7%9C%8B%E5%B0%8F%E8%AF%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const MYJQ = jQuery.noConflict();
    let currentLineContent = GM_getValue("currentLineContent", "none");
    let currentLine = GM_getValue("currentLine", 0);
    let fileContent = GM_getValue("fileContent", "none")
    let totleLines = 0;
    let lines = [];

    if(currentLineContent === "none") {
        currentLineContent = "<input type='file' id='fileInput'>";
    }
    if(fileContent !== "none") {
        // 将fileContent中的空行去除
        fileContent = fileContent.replace(/\n\s*\r/g, '');
        lines = fileContent.split('\n');
        totleLines = lines.length;
    }
    if (window.self === window.top) {
        MYJQ("html").prepend("<div style='width: 100%;'><div id='fileContentDiv' style='width: auto; height: auto; min-height: 22px; background-color: #ff000000; position: fixed; bottom: 0; left: 0;z-index:9999;color: #9f9f9f;font-size: 14px;'>"+currentLineContent+"</div><div id='pageNumDiv' style='width: auto;background-color: #ff000000;height: auto;min-height: 22px;position:fixed;bottom: 0; right: 0;z-index:9999;color: #9f9f9f;font-size: 12px;'>"+currentLine+"/"+totleLines+"</div></div>");
    }
    const fileContentDiv = document.getElementById('fileContentDiv');
    const pageNumDiv = document.getElementById('pageNumDiv');

    // 监听键盘事件
    document.addEventListener('keydown', (event) => {
        // console.log(event.key);
        // 老板键
        if(event.key=="ArrowUp"){
            MYJQ("#fileContentDiv").slideDown();
            return false;
        } else if(event.key=="ArrowDown") {
            MYJQ("#fileContentDiv").slideUp();
            return false;
        } else if(event.shiftKey) {
            // 上传文件界面
            if(event.key=="U") {
                fileContentDiv.textContent = "";
                MYJQ("#fileContentDiv").append("<input type='file' id='fileInput' >");

            }
            return false;
        }

        if(currentLine<0) {
            currentLine = 0;
            fileContentDiv.textContent = "这是第一页哦，不能再往前翻了！";
            return false;
        } else if(currentLine>=totleLines) {
            fileContentDiv.textContent = "这是最后一页哦，不能再往后翻了！";
            return false;
        }
        if (fileContent !="none" && currentLine >= 0) {
            if (lines.length > 0) {
                if (event.key === 'ArrowRight') {
                    currentLine++;
                    currentLineContent = lines[currentLine].replace(/\s/g, "");
                    while(currentLineContent == "") {
                        currentLine++;
                        currentLineContent = lines[currentLine];
                    }
                } else if(event.key === 'ArrowLeft') {
                    currentLine--;
                    currentLineContent = lines[currentLine].replace(/\s/g, "");
                    while(currentLineContent == "") {
                        currentLine--;
                        currentLineContent = lines[currentLine];
                    }
                }
                GM_setValue("currentLine", currentLine);
                GM_setValue("currentLineContent", currentLineContent);
                fileContentDiv.textContent = currentLineContent;
                pageNumDiv.textContent = currentLine+"/"+totleLines;
            }
        } else {
            console.error('文件不存在或读取失败！');
        }

    });

    // 使用事件委托监听上传按钮的点击事件
    MYJQ(document).on('change', '#fileInput', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const fileContent = e.target.result;
                GM_setValue("fileContent", fileContent);
                GM_setValue("currentLine", 0);
                GM_setValue("currentLineContent", "none");
                currentLine = 0;
                fileContentDiv.textContent = "";
                console.log('存储成功');
            };
            reader.readAsText(file);
        }

    });
})();