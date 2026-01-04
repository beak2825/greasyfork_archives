// ==UserScript==
// @name         ikukudm 阅读舒适
// @namespace    http://tampermonkey.net/
// @version      2024-06-08
// @description  Q或,:上一页。W或.:下一页
// @author       slime-zdc
// @match        http://a.ikukudm.cc/comiclist/*/*/*.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ikukudm.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498131/ikukudm%20%E9%98%85%E8%AF%BB%E8%88%92%E9%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/498131/ikukudm%20%E9%98%85%E8%AF%BB%E8%88%92%E9%80%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.style.backgroundImage = 'none';


    // 找到body中的第一个table元素
    let tables = document.querySelectorAll('body > table');

    // 检查是否找到了表格元素
    if (tables.length > 2) {
        // 从DOM中删除选定的表格元素
        tables[1].border = 0;
        tables[0].parentNode.removeChild(tables[0]);
        tables[2].parentNode.removeChild(tables[2]);
    } else {
        console.log("未找到表格元素");
    }

    // 在外部定义图片元素变量
    let nextImg = document.querySelector('img[src="/images/d.gif"]');
    let prevImg = document.querySelector('img[src="/images/t.gif"]');

    //console.log("next: " + nextImg + ", prev: " + prevImg);

    let tr = document.querySelector('body > table tr');
    let td = tr.querySelector('td');
    let img = td.querySelector('img');
    let newTd = document.createElement('td');
    let newTr = document.createElement('tr');
    newTd.appendChild(img);
    tr.insertAdjacentElement('afterbegin', newTd);
    tr.parentNode.appendChild(newTr);
    newTr.appendChild(td);
    // td.style.display = 'none';

    img.style.width = 'auto';
    img.style.height = '100vh';
    img.style.objectFit = 'cover';
    img.style.padding = '0';

    // 添加键盘按下事件监听器
    document.addEventListener("keydown", function(e) {
        let key = e.key.toUpperCase();
        //console.log("key: [" + key + "]");
        switch (key) {
            case "W":
            case ".":
                nextImg.click();
                break;
            case "Q":
            case ",":
                prevImg.click();
                break;
            case "A":
                var url = document.location.href;
                document.location.href = url.replace(/\/\d+.htm/i, "/1.htm");
                break;
        }
    });
})();