// ==UserScript==
// @name         XJTU 四个一百自动化脚本（仅含书籍和教师模块）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  调用ChatGPT生成读后感批量补录XJTU 100本经典阅读,批量确认教师
// @author       Miracle24
// @match        http://nsa.xjtu.edu.cn/sgyb/ybbsplpj*
// @match        http://nsa.xjtu.edu.cn/sgyb/ybmjsplpj*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xjtu.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466830/XJTU%20%E5%9B%9B%E4%B8%AA%E4%B8%80%E7%99%BE%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BB%85%E5%90%AB%E4%B9%A6%E7%B1%8D%E5%92%8C%E6%95%99%E5%B8%88%E6%A8%A1%E5%9D%97%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/466830/XJTU%20%E5%9B%9B%E4%B8%AA%E4%B8%80%E7%99%BE%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BB%85%E5%90%AB%E4%B9%A6%E7%B1%8D%E5%92%8C%E6%95%99%E5%B8%88%E6%A8%A1%E5%9D%97%EF%BC%89.meta.js
// ==/UserScript==


async function query(title, apikey){
    const res = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${apikey}`,
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: `请对${title}一书给出500字左右的读书感想`,
            max_tokens: 600,
            temperature: 0,
        }),
    });
    const response = await res.json();
    const result = response.choices[0].text;
    return result;
}


(function() {
    'use strict';

    // Your code here...
    const controlPanel = document.createElement("div");
    if(window.location.pathname.includes("ybbsplpj")){ //一百本书
        controlPanel.innerHTML = `
        <style>
                .control-panel{
                    position: fixed;
                    top: 0;
                    left: 50%;
                    min-height: 40px;
                    min-width: 300px;
                    border-radius: 0 0 12px 12px;
                    transform: translateX(-50%);
                    background-color: rgb(219, 219, 219);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    text-align: center;
                    line-height: 40px;
                    padding: 0 12px;
                }
        </style>
        <div class="control-panel">
        <div>
            <span>API Key（需要科学上网）</span>
            <input type="text" id="apikey">
        </div>
        <div>
            直接使用书名作为评价（无需API Key）
            <input type="checkbox" id="switch">
        </div>
        <button id="fillButton">批量补录</button>
        <span id="finish">已完成：0</span>
        <button id="saveButton">一键保存</button>
        <div>
        `;
        document.body.insertBefore(controlPanel, null);
        document.getElementById("fillButton").onclick = async function(){
            const apikey = document.getElementById("apikey").value;
            const useBookName = document.getElementById("switch").checked;
            if(apikey === "" && useBookName == false){
                alert("api key 不能为空");
                return;
            }
            for(var i = 0; i < 100; i ++){
                var bookBox = document.getElementById(i.toString());
                if (bookBox == undefined) break;
                var bookTitle = bookBox.getElementsByClassName("tit")[0].getElementsByClassName("el-form-item__content")[0].getElementsByTagName("span")[0].textContent;
                var bookComment = bookBox.getElementsByTagName("textarea")[0];
                if (useBookName == true){
                    bookComment.value = bookTitle;
                }
                else{
                    bookComment.value = await query(bookTitle, apikey);
                }
                document.getElementById("finish").textContent = `已完成：${i+1}`;
            };
        };
        document.getElementById("saveButton").onclick = function(){
            for(var i = 0; i < 100; i ++){
                var bookBox = document.getElementById(i.toString());
                if (bookBox == undefined) break;
                const saveButton = bookBox.getElementsByClassName("operation")[0].getElementsByTagName("button")[0];
                if (saveButton.textContent === "保存"){
                    saveButton.click();
                }
            };
        };
    }
    else if(window.location.pathname.includes("ybmjsplpj")){ //一百名教师
        controlPanel.innerHTML = `
        <style>
                .control-panel{
                    position: fixed;
                    top: 0;
                    left: 50%;
                    min-height: 40px;
                    min-width: 300px;
                    border-radius: 0 0 12px 12px;
                    transform: translateX(-50%);
                    background-color: rgb(219, 219, 219);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    text-align: center;
                    line-height: 40px;
                    padding: 0 12px;
                }
        </style>
        <div class="control-panel">
        <button id="saveButton">一键保存</button>
        <div>
        `;
        document.body.insertBefore(controlPanel, null);
        document.getElementById("saveButton").onclick = function(){
            for(var i = 0; i < 100; i ++){
                var teacherBox = document.getElementById(i.toString());
                if (teacherBox == undefined) break;
                const saveButton = teacherBox.getElementsByClassName("operation")[0].getElementsByTagName("button")[0];
                if (saveButton.textContent === "保存"){
                    saveButton.click();
                }
            };
        };
    }



})();