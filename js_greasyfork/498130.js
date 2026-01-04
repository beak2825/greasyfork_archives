// ==UserScript==
// @name         ikukudm 列表舒适
// @namespace    http://tampermonkey.net/
// @version      2024-06-13
// @description  ikuudm easy read list
// @author       slime-zdc
// @match        https://ikukudm.cc/comictype*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ikukudm.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498130/ikukudm%20%E5%88%97%E8%A1%A8%E8%88%92%E9%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/498130/ikukudm%20%E5%88%97%E8%A1%A8%E8%88%92%E9%80%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

//     document.body.style.backgroundImage = 'none';
//     let tables = document.querySelectorAll('body > table');
//     tables[0].remove();
//     let mainTable = tables[4];
//     document.body.insertAdjacentElement("afterbegin", mainTable);
//     let tr = mainTable.querySelector('tbody > tr');
//     tr.firstElementChild.remove();
//     tr.firstElementChild.querySelector('table').remove();

//     let width = '1100px';
//     tables.forEach(t => t.style.width = width);
//     mainTable.querySelector('dl#comicmain').style.width = '100%';
//     tables[5].remove();
//     tables[6].remove();

//     let removed = ['div#ctitle'];
//     var interval = 0;
//     var setted = true;

//     interval = setInterval(function() {
//         for (var i = removed.length - 1; i >= 0; i--) {
//             let r = removed[i];
//             let es = document.querySelectorAll(r);
//             if (es && es.length > 0) {
//                 es.forEach(e => e.remove());
//                 removed.splice(i, 1);
//             }
//         }

//         console.log('removed left: ' + removed.join(', '));

//         if (removed.length == 0 && setted) {
//             clearInterval(interval);
//             console.log('clear interval!');
//         }
//     }, 200);


    // 添加键盘按下事件监听器
    let aPages = Array.from(document.querySelectorAll('tr[align="center"] > td > a'));
    let p = aPages.filter(a => a.innerText == '上一页');
    let n = aPages.filter(a => a.innerText == '下一页');
    let h = aPages.filter(a => a.innerText == '首页');
    let t = aPages.filter(a => a.innerText == '末页');

    document.addEventListener("keydown", function(e) {
        let key = e.key.toUpperCase();
        //console.log("key: [" + key + "]");
        switch (key) {
            case "W":
            case ".":
                n[0].click();
                break;
            case "Q":
            case ",":
                p[0].click();
                break;
            case "A":
                h[0].click();
                break;
            case "E":
                t[0].click();
                break;
        }
    });
})();