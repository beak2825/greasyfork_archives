// ==UserScript==
// @name         SIS001小说下载
// @namespace    https://greasyfork.org/zh-CN/users/1037943
// @version      1.0
// @description  个人自用
// @author       ChatGPT
// @icon         https://001.sisurl.com/favicon.ico
// @match        *://001.sisurl.com/*
// @require      https://cdn.jsdelivr.net/npm/file-saver@1.3.8/FileSaver.min.js
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/461367/SIS001%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/461367/SIS001%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elementsToChange = document.querySelectorAll('.t_msgfont.noSelect');
    for (var i = 0; i < elementsToChange.length; i++) {
        elementsToChange[i].classList.remove('noSelect');
    }

    const titleText = document.querySelector("title").innerText;
    const h1Text = document.querySelector("h1").innerText;

    if((titleText.includes("文学作者区") || titleText.includes("原创人生区")) && !h1Text.includes("版务") && !h1Text.includes("原创人生区") && !h1Text.includes("文学作者区")){
        function down() {
            const h1 = document.querySelector('.mainbox > h1:nth-child(2)');
            console.log(h1);
            let ce = document.createElement('a');
            ce.id = 'CDownBtn';
            ce.textContent = '下载本章';
            ce.onclick = function () { downtext(document); };
            h1.append(ce);

            function removeElement(doc, ele) {
                var elelist = doc.querySelectorAll(ele);
                for (const e of elelist) {
                    e.remove()
                }
            }

            function downtext() {
                const con = document.querySelector('div.t_msgfont:nth-child(1)');
                console.log(con);
                removeElement(con, 'strong');
                removeElement(con, 'table');
                removeElement(con, 'strong');

                let btitle = h1.innerText.replace(/\[[^\]]*\]/g, '').replace('下载本章', '');
                let str = con.innerText;
                let blob = new Blob([btitle + '\r\n', str], { type: "text/plain;charset=utf-8" });
                saveAs(blob, btitle + ".txt");
                ce.style.backgroundColor = '#28a745';
            }

            let css = `
                #CDownBtn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color: #007bff;
                    color: #fff;
                    border-radius: 5px;
                    padding: 10px 20px;
                    text-decoration: none;
                    user-select: none;
                    transition: all .2s ease-in-out;
                }

                #CDownBtn:hover {
                    transform: scale(1.25);
                    background-color: #0062cc;
                    cursor: pointer;
                }
            `;
            let head = document.head || document.getElementsByTagName('head')[0];
            let style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        }

        down();

    }
})();