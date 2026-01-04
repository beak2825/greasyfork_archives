// ==UserScript==
// @name         百度网页端在回复中插入@吧务名
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在网页最左端的按钮，按下后在相应的回复框插入@吧务名
// @author       Your Name
// @match        https://tieba.baidu.com/p/*
// @grant        GM.xmlHttpRequest
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/536661/%E7%99%BE%E5%BA%A6%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%9C%A8%E5%9B%9E%E5%A4%8D%E4%B8%AD%E6%8F%92%E5%85%A5%40%E5%90%A7%E5%8A%A1%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/536661/%E7%99%BE%E5%BA%A6%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%9C%A8%E5%9B%9E%E5%A4%8D%E4%B8%AD%E6%8F%92%E5%85%A5%40%E5%90%A7%E5%8A%A1%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fetch_page(url,method = "GET") {
        return new Promise((resolve, reject) => {
            try {
                GM.xmlHttpRequest({
                    method: method,
                    url: url,
                    //data: "username=johndoe&password=xyz123",
                    //headers: {
                    //    "Content-Type": "application/x-www-form-urlencoded"
                    //},
                    onload: function(response) {
                        if(response.status == 200) {
                            resolve(response.responseText);
                        }
                        reject(Error("failed"))
                    }
                });
            } catch(e){
                reject(Error("something bad happened"))
            }
        })
    }

     (async () => {

        try {
            // 吧名 CSS 选择器
            const tieba_name_selector = '#container > div > div.card_top_wrap.clearfix.card_top_theme2 > div.card_top.clearfix > div.card_title > a.card_title_fname';
            // 2. 查找元素
            const tieba_name_element = document.querySelector(tieba_name_selector);
            // 4. 获取元素的文本内容
            let textContent = tieba_name_element.textContent;
            // 5. 过滤空格 (使用 replaceAll 或正则表达式)
            textContent = textContent.replace(/\s/g, ''); // 移除所有空白字符，包括换行符等
            // 7. 提取“吧”字前的所有文本
            const tieba_name = textContent.slice(0, -1);
            const tieba_name_urlcode = encodeURI(tieba_name);

            const pageContent = await fetch_page(`https://tieba.82cat.com/tieba/forum-manager/${tieba_name_urlcode}`);

            const parser = new DOMParser();
            const doc = parser.parseFromString(pageContent, "text/html");

            const xpathExpression = "//td[text()='小吧主']/preceding-sibling::td[1]";

            const xpathResult = doc.evaluate(
                xpathExpression,
                doc, // contextNode
                null, // namespaceResolver
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, // 关键：指定获取所有有序节点的快照
                null // result
            );

            if (xpathResult.snapshotLength > 0) {
                for (let i = 0; i < xpathResult.snapshotLength; i++) {
                    const usernameTd = xpathResult.snapshotItem(i);
                    const username = usernameTd.textContent.trim();

                    let btn = document.createElement('button');
                    btn.innerText = username;
                    btn.style.position = 'fixed';
                    btn.style.left = "0px";
                    btn.style.top = `${i * 25}px`;
                    btn.style.zIndex = 9999;
                    btn.style.padding = '1px 1px';
                    btn.style.backgroundColor = 'white';
                    btn.style.color = 'black';
                    btn.style.borderColor = 'black';
                    btn.style.borderRadius = '1px';
                    btn.style.cursor = 'pointer';

                    btn.addEventListener('click', function() {
                    const div = document.querySelector('div#j_editor_for_container');
                    let p = div.querySelector('p:last-child');

                    if (p) {
                        // 如果已经存在 <p> 元素，就在其现有文本后追加 `@${username}\u00A0`
                        p.textContent += `@${username}\u00A0`;
                    } else {
                        // 如果不存在 <p> 元素，则创建一个新的 <p> 元素并添加
                        const newP = document.createElement('p');
                        newP.textContent = `@${username}\u00A0`;
                        div.appendChild(newP);
                    }

                    });
                    document.body.appendChild(btn);

                    let btn2 = document.createElement('button');
                    btn2.innerText = username;
                    btn2.style.position = 'fixed';
                    btn2.style.left = "100px";
                    btn2.style.top = `${i * 25}px`;
                    btn2.style.zIndex = 9999;
                    btn2.style.padding = '1px 1px';
                    btn2.style.backgroundColor = 'white';
                    btn2.style.color = 'black';
                    btn2.style.borderColor = 'black';
                    btn2.style.borderRadius = '1px';
                    btn2.style.cursor = 'pointer';

                    btn2.addEventListener('click', function() {
                    const div = document.querySelector('div#ueditor_replace');
                    let p = div.querySelector('p:last-child');

                    if (p) {
                        // 如果已经存在 <p> 元素，就在其现有文本后追加 `@${username}\u00A0`
                        p.textContent += `@${username}\u00A0`;
                    } else {
                        // 如果不存在 <p> 元素，则创建一个新的 <p> 元素并添加
                        const newP = document.createElement('p');
                        newP.textContent = `@${username}\u00A0`;
                        div.appendChild(newP);
                    }
                    });
                    document.body.appendChild(btn2);
                }



            }

        } catch (error) {
            console.error("获取网页时发生错误:", error.message);
        }
    })();


})();