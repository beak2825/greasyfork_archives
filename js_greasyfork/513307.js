// ==UserScript==
// @name        乌龟小助手
// @namespace   Violentmonkey Scripts
// @match       https://gltyx.github.io/super-turtle-idle/*
// @grant       none
// @version     1.0
// @author      -
// @license      MIT
// @description 2024/10/20 18:30:32
// @downloadURL https://update.greasyfork.org/scripts/513307/%E4%B9%8C%E9%BE%9F%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/513307/%E4%B9%8C%E9%BE%9F%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

let jsonData = {};

        var moneyButton = document.createElement('button');
        moneyButton.textContent = "好多钱！";
        moneyButton.id = "moneyButton"
        moneyButton.style.margin = '0px 0px 0px 0px';
        moneyButton.style.color = 'coral'
        moneyButton.onclick = function(){
        jsonData["savedPlayerData"]["coins"] = 99999999999;
        }

        var jobButton = document.createElement('button');
        jobButton.textContent = "工会经验";
        jobButton.id = "jobButton"
        jobButton.style.margin = '0px 0px 0px 0px';
        jobButton.style.color = 'coral'
        jobButton.onclick = function(){
        jsonData["savedJobExp"]["alchemy"] = 50000;
        jsonData["savedJobExp"]["blacksmith"] = 50000;
        jsonData["savedJobExp"]["engineering"] = 50000;
        }

        var boxButton = document.createElement('button');
        boxButton.textContent = "箱子";
        boxButton.id = "boxButton"
        boxButton.style.margin = '0px 0px 0px 0px';
        boxButton.style.color = 'coral'
        boxButton.onclick = function(){
        jsonData["savedItemCount"]["I10"] = 990000;
        jsonData["savedItemCount"]["I41"] = 990000;
        jsonData["savedItemCount"]["I43"] = 990000;
        jsonData["savedItemCount"]["I46"] = 990000;
        jsonData["savedItemCount"]["I399"] = 990000;
        jsonData["savedItemCount"]["I400"] = 990000;
        jsonData["savedItemCount"]["I119"] = 990000;
        }

        var boomButton = document.createElement('button');
        boomButton.textContent = "神器";
        boomButton.id = "boomButton"
        boomButton.style.margin = '0px 0px 0px 0px';
        boomButton.style.color = 'coral'
        boomButton.onclick = function(){
        jsonData["savedItemCount"]["I370"] = 1;
        jsonData["savedItemCount"]["I24"] = 1;
        jsonData["savedItemCount"]["I171"] = 1;
        }

        var XXButton = document.createElement('button');
        XXButton.textContent = "闪光石";
        XXButton.id = "XXButton"
        XXButton.style.margin = '0px 0px 0px 0px';
        XXButton.style.color = 'coral'
        XXButton.onclick = function(){
        jsonData["savedItemCount"]["I434"] = 999;
        jsonData["savedItemCount"]["I435"] = 999;
        jsonData["savedItemCount"]["I436"] = 999;
        jsonData["savedItemCount"]["I437"] = 999;
        jsonData["savedItemCount"]["I438"] = 999;
        }



        var importButton = document.createElement('button');
        importButton.textContent = "读取";
        importButton.id = "importButton"
        importButton.style.margin = '0px 0px 0px 0px';
        importButton.style.color = 'coral'


        const fileInput = document.createElement('input');
        fileInput.style.margin = '0px 0px 0px 0px';
        fileInput.type = 'file';
        fileInput.accept = '.json';

        const fileoutput = document.createElement('button');
        fileoutput.textContent = "导出修改后存档";
        fileoutput.id = "fileoutput"
        fileoutput.style.margin = '0px 0px 0px 0px';
        fileoutput.style.color = 'coral'
        fileoutput.onclick = function(){
        exportJsonFile(jsonData, "修改后存档.json");
        }

        const input = document.createElement('button');
        input.textContent = "导出存档";
        input.id = "input"
        input.style.margin = '0px 0px 0px 0px';
        input.style.color = 'coral'
        input.onclick = function(){
        exportJSON();
        }

        const output = document.createElement('button');
        output.textContent = "导入存档";
        output.id = "output"
        output.style.margin = '0px 0px 0px 0px';
        output.style.color = 'coral'
        output.onclick = function(){
        importJSON();
        }

 // 用于存储导入的JSON数据

// 监听按钮点击事件
importButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                jsonData = JSON.parse(e.target.result);
                console.log("导入的JSON数据：", jsonData);
            } catch (error) {
                console.error("JSON 解析失败：", error);
            }
        };
        reader.readAsText(file);
    } else {
        alert("请先选择一个文件！");
    }
});


function exportJsonFile(jsonData, fileName) {
    const jsonString = JSON.stringify(jsonData, null, 2); // 将jsonData转换为JSON字符串
    const blob = new Blob([jsonString], { type: "application/json" }); // 创建Blob对象
    const url = URL.createObjectURL(blob); // 创建文件的下载URL
    const a = document.createElement('a'); // 创建一个a标签
    a.href = url;
    a.download = fileName; // 指定下载文件的名称
    a.click(); // 模拟点击a标签触发下载
    URL.revokeObjectURL(url); // 释放URL
}

        var thisdiv = document.createElement('div');
        thisdiv.style.position = 'absolute';
        thisdiv.style.top = '5px';
        thisdiv.style.left = '55px';
        thisdiv.style.zIndex = '99998';
        thisdiv.id='scriptDiv';
        thisdiv.style.textAlign = 'left'
        thisdiv.style.width = "170px";
        thisdiv.style.color = 'coral'

        var appDiv = document.getElementById("body");

        appDiv.appendChild(thisdiv);
        thisdiv.appendChild(input);
        thisdiv.appendChild(output);
        thisdiv.appendChild(fileInput);
        thisdiv.appendChild(importButton);
        thisdiv.appendChild(moneyButton);
        thisdiv.appendChild(jobButton);
        thisdiv.appendChild(boxButton);
        thisdiv.appendChild(boomButton);
        thisdiv.appendChild(XXButton);
        thisdiv.appendChild(fileoutput);



