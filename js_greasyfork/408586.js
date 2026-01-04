// ==UserScript==
// @name         知乎专栏文章快速保存「markdown」
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  知乎专栏文章，快速保存为 markdown 格式 *.md
// @author       qiancheng
// @match        *zhihu.com*
// @include      *://zhuanlan.zhihu.com/p/*
// @require      https://unpkg.com/clipboard@2.0.1/dist/clipboard.min.js
// @require      https://code.jquery.com/jquery-1.9.1.min.js
// @require      https://unpkg.com/turndown/dist/turndown.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408586/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0%E5%BF%AB%E9%80%9F%E4%BF%9D%E5%AD%98%E3%80%8Cmarkdown%E3%80%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/408586/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0%E5%BF%AB%E9%80%9F%E4%BF%9D%E5%AD%98%E3%80%8Cmarkdown%E3%80%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

     const KEY_CONTENT = "mdContent";
    const KEY_TITLE = "mdTitle";
    const FILE_TYPE = "application/md";
    const TITLE_ELEMENT_ID = ".Post-Title";
    const CONTENT_ELEMENT_ID = ".Post-RichText";
    const BTN_APPEND_ID = '#root';
    const turndownService = new TurndownService ();


        // 获取文章内容
       $().ready (function (){
            if (document.querySelector (TITLE_ELEMENT_ID) && document.querySelector (CONTENT_ELEMENT_ID)) {
                console.log ('ready');
                let title = document.querySelector (TITLE_ELEMENT_ID).innerText;
                console.log (title);
                let data = document.querySelector (CONTENT_ELEMENT_ID).innerHTML;
                console.log (data);
                const mdContent = turndownService.turndown ("<h1>" + title + "</h1>" + data);
                sessionStorage.setItem (KEY_TITLE, title);
                sessionStorage.setItem (KEY_CONTENT, mdContent);
                // 生成「存」按钮
                genSaveBtn ();
            }
        });


    const genSaveBtn = () => {
        let saveBtn = document.querySelector ("#save_btn");
        if (saveBtn) {
            saveBtn.onclick = () => {
                //do nothing
            };
        }
        else {
            saveBtn = document.createElement ("div");
            saveBtn.id = "save_btn";
            saveBtn.textContent = "存";
            saveBtn.onclick = () => {
                createAndDownloadFile (sessionStorage.getItem (KEY_TITLE) + ".md", sessionStorage.getItem (KEY_CONTENT));
                // 文章复制到剪贴板 start
                navigator.clipboard.writeText (sessionStorage.getItem (KEY_CONTENT));
                console.log (' 文章正文已成功复制到剪贴板！');
                // 文章复制到剪贴板 end
            };
            setSaveBtnStyle (saveBtn);
            document.querySelector (BTN_APPEND_ID).appendChild (saveBtn);
        }
    }

    const setSaveBtnStyle = (saveBtn) => {
        saveBtn.style.position = "fixed";
        saveBtn.style.bottom = "5em";
        saveBtn.style.right = "2em";
        saveBtn.style.borderRadius = "50%";
        saveBtn.style.backgroundColor = "#f6f7f9";
        saveBtn.style.height = "45px";
        saveBtn.style.width = "45px";
        saveBtn.style.textAlign = "center";
        saveBtn.style.lineHeight = "45px";
        saveBtn.style.border = "1px solid #f6f7f9";
        saveBtn.style.cursor = "pointer";
    }

    const createAndDownloadFile = (fileName, content) => {
        let aTag = document.createElement ('a');
        let blob = new Blob ([content], {type: FILE_TYPE});
        aTag.download = fileName;
        aTag.href = URL.createObjectURL (blob);
        aTag.click ();
        URL.revokeObjectURL (blob);
    }
    })();