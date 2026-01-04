// ==UserScript==
// @name         禅道
// @namespace    http://tampermonkey.net/
// @version      2025-03-24
// @description  禅道扩展
// @author       Zero
// @match        http://zentao.manteia.com/*
// @match        http://192.168.10.230/*
// @icon         http://zentao.manteia.com/zentao/favicon.ico
// @require https://update.greasyfork.org/scripts/523085/1519645/waitForKeyElements3.js
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522676/%E7%A6%85%E9%81%93.user.js
// @updateURL https://update.greasyfork.org/scripts/522676/%E7%A6%85%E9%81%93.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
    * 自定义设置菜单功能
    */
    function createDialog(id,innerHTML) {
        var oldDialogs = document.querySelectorAll(`#${id}`);
        if (oldDialogs.length>0){
            oldDialogs[0].style.display="block";
            return;
        }
        var topDom = self != top ? window.top.document : self.document;
        // 创建一个div元素作为对话框
        var dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '20px';
        dialog.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        dialog.style.zIndex = '1000';
        dialog.style.borderRadius = '8px';

        // 创建关闭按钮
        var closeButton = document.createElement('button');
        closeButton.innerText = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';

        // 关闭按钮的点击事件
        closeButton.addEventListener('click', function() {
            overlay.style.display='none';
        });

        // 设置对话框的内容
        dialog.innerHTML = innerHTML;
        dialog.appendChild(closeButton); // 将关闭按钮添加到对话框中

        // 创建一个遮罩层
        var overlay = document.createElement('div');
        overlay.id=id;
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '999';

        // 将对话框添加到遮罩层中
        overlay.appendChild(dialog);

        // 将遮罩层添加到body中
        document.body.appendChild(overlay);
    }

    function convertToCSV(data) {
        //const data = [
        //    { name: 'Alice', age: 24, city: 'New York' },
        //    { name: 'Bob', age: 30, city: 'Los Angeles' },
        //    { name: 'Charlie', age: 28, city: 'Chicago' }
        //];
        // 获取所有键（列名）
        const columns = Object.keys(data[0]).join(',');

        // 将每个对象转换为 CSV 行
        const rows = data.map(item => {
            return Object.values(item).join(',');
        });

        // 将列名和行组合成完整的 CSV 字符串
        return [columns, ...rows].join('\n');
    }
    function downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // 创建一个隐藏的 <a> 元素来触发下载
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'data.csv';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();

        // 清理
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function exportBugComment(){
        var innerHTML=`<div>
                <input type="file" id="csvFileInput" accept=".csv">
                </br>
                <button type='button' id='export_confirm'>确定</button>
            </div>`;
        createDialog("exportBugComment",innerHTML);
        let bugData = null;
        let filename=null;
        document.getElementById('csvFileInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            filename = file.name;
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const csvContent = e.target.result;
                    parseCSV(csvContent);
                };
                reader.readAsText(file);
            }
        })
        function parseCSV(csvContent) {
            const rows = csvContent.split('\n');
            // 获取键（第一行）
            const keys = rows[0].split(',').map(key => key.replace(/"/g, ''));

            // 解析数据行
            bugData = rows.slice(1,-1).map(row => {
                const values = row.split(',').map(value => value.replace(/"/g, '')).slice(0,-1);
                return values.reduce((obj, value, index) => {
                    obj[keys[index]] = value;
                    return obj;
                }, {});
            });
            console.log(bugData);
        }
        document.getElementById("export_confirm").addEventListener("click",async function () {
            if (!bugData) return ;
            for await (let bug of bugData) {
                try {
                    var id=bug['Bug编号'];
                    bug["禅道地址"] = `http://192.168.10.230/zentao/bug-view-${id}.html`
                    let docText = await fetch(`/zentao/bug-view-${id}.html`,{
                        method: 'GET',
                        headers: {Cookie:document.cookie},
                        redirect: 'follow'
                    }).then(res=>res.text())
                    var parser = new DOMParser();
                    let doc = parser.parseFromString(docText, 'text/html');
                    console.log(doc);
                    const commentElements = doc.querySelector('#actionbox > div.detail-content > ol.histories-list').children;
                    let textContent="";
                    for (let comment of commentElements) {
                        let content = comment.querySelector(".comment-content");
                        if (content) textContent += content.innerText.trim().replaceAll("\n","；");
                    }
                    await new Promise(resolve => setTimeout(resolve, 500));
                    console.log(textContent);
                    bug['解决步骤']=textContent;
                } catch (error) {
                    console.error(error)
                }
            }
            console.log(bugData);
            var csvContent = convertToCSV(bugData);
            downloadCSV(csvContent, filename);
        })
    }

    function contentReplace() {
        var innerHTML=`<div>
                <p>批量替换</p>
                <p>原文本：<input type='text' maxlength=60 id='wmx_old_text'/>
                <p>替换为：<input type='text' maxlength=60 id='wmx_new_text'></p>
                <button type='button' id='wmx_confirm'>确定</button>
            </div>`;
        createDialog("contentReplaceDialog",innerHTML);

        // 获取值
        document.getElementById("wmx_confirm").addEventListener("click", function () {
            var zentao_old_text = document.getElementById("wmx_old_text").value;
            var zentao_new_text = document.getElementById("wmx_new_text").value;
            console.log(`Old text: ${zentao_old_text}, New text: ${zentao_new_text}`);
            var iframeDom = top.document.getElementById("appIframe-qa").contentWindow.document;

            function replaceText(selector) {
                var elements = iframeDom.querySelectorAll(selector);
                elements.forEach(function(element) {
                    if (element.value) {
                        element.value = element.value.replaceAll(zentao_old_text, zentao_new_text);
                    } else {
                        element.innerHTML = element.innerHTML.replaceAll(zentao_old_text, zentao_new_text);
                    }
                });
            };
            ['#title','#precondition','.form-control.autosize'].forEach(replaceText);
        });
    };
    function addElementToDom(
    tag, id, attributes, style, eventListeners, position
     /*
        position：
        'beforebegin': Before the targetElement itself.
        'afterbegin': Just inside the targetElement, before its first child.
        'beforeend': Just inside the targetElement, after its last child.
        'afterend': After the targetElement itself.
    */
    ) {
        var targetEls = document.querySelectorAll(`#${id}`);
        if (targetEls.length > 0) {
            console.log(`Element id: ${id} already exists.`);
            if (eventListeners && Object.keys(eventListeners).length > 0) {
                Object.keys(eventListeners).forEach(event => {
                    targetEls[0].removeEventListener(event, eventListeners[event]);
                    targetEls[0].addEventListener(event, eventListeners[event]);
                });
            }
            return null;
        }
        return byElement => {
            var e = document.createElement(tag);
            e.type = tag == "button" ? "button" : "";
            e.id = id;
            if (attributes && Object.keys(attributes).length > 0) Object.keys(attributes).forEach(attr => e[attr] = attributes[attr]);
            if (style && Object.keys(style).length > 0) Object.keys(style).forEach(stl => e.style[stl] = style[stl]);
            if (eventListeners && Object.keys(eventListeners).length > 0) Object.keys(eventListeners).forEach(event => e.addEventListener(event, eventListeners[event]));
            position = position || 'afterend';
            byElement.insertAdjacentElement(position, e);
        }
    }
    location.pathname.match("bug-browse") && waitForKeyElements(
        "#exportActionMenu > li:last-child",
        addElementToDom("li","exportBugCommentLi",{"innerHTML":"<a class='export'>从外部索引导出bug</a>"},{"click":exportBugComment}),
        {"innerText":"导出数据"}
    );
    location.pathname.match("testcase-edit") && waitForKeyElements(
        "#dataform > div > div.main-col.col-8 > div > div:nth-child(4) > div.detail-title",
        addElementToDom("button","contentReplaceBtn",{"innerText":"批量替换"},{"margin":"5px 5px 5px 5px"},{"click":contentReplace}),
        {"textContent":"用例步骤"}
    );
    location.pathname.match(/testcase-create-(\d+)-(\d+)-(\d+)-testcase/) && waitForKeyElements(
        "#mainContent > div.center-block > div > h2",
        addElementToDom("button","contentReplaceBtn",{"innerText":"批量替换"},{"margin":"5px 5px 5px 5px"},{"click":contentReplace}),
        {"textContent":"建用例"}
    );
    waitForKeyElements(
        "#batchEditForm > div > table > thead > tr > th.c-story",
        addElementToDom("button","contentReplaceBtn",{"innerText":"一键同上"},{"margin":"5px 5px 5px 5px"},{"click":()=>{
            var dom= window.document.querySelector("#appIframe-qa").contentDocument;
            var story_id = dom.querySelector("#batchEditForm > div > table > tbody > tr:nth-child(1) > td:nth-child(7) > select > option").value;
            console.log(story_id);
            var cases =dom.querySelectorAll("#batchEditForm > div > table > tbody > tr");
            cases.forEach(e=>e.querySelector("td:nth-child(7) > div > div > input").value=story_id);
            cases.forEach(e=>e.querySelector("td:nth-child(7) > select > option").value=story_id);
        }},"beforeend"),
        {"textContent":"相关研发需求"},null,"#appIframe-qa"
    );
})();
