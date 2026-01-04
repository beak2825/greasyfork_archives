// ==UserScript==
// @name         极客时间专栏文章保存
// @namespace    https://github.com/LazyBug1E0CF
// @version      0.4.2
// @description  在极客时间专栏内容页面增加一个保存按钮，点击后将正文以markdown格式下载保存
// @author       L
// @match        *://time.geekbang.org/column/article/*
// @grant        none
// @require      https://unpkg.com/ajax-hook@1.8.3/dist/ajaxhook.min.js
// @require      https://unpkg.com/showdown/dist/showdown.min.js
// @downloadURL https://update.greasyfork.org/scripts/394097/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/394097/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEY_CONTENT = "mdContent";
    const KEY_TITLE = "mdTitle";
    const FILE_TYPE = "application/md";
    const articleRequestUrlRegex = /^https?:\/\/time\.geekbang\.org\/serv\/v\d\/article/;
    const mdService = new showdown.Converter();


    hookAjax({
        //拦截回调
        onreadystatechange:function(xhr){
            //console.log("onreadystatechange called: %O",xhr)
            if (xhr.readyState === 4 && articleRequestUrlRegex.test(xhr.responseURL)) {
                console.log(xhr.response);
                let resJson = JSON.parse(xhr.response);
                let title = resJson.data.article_title;
                let data = resJson.data.article_content;
                const mdContent = mdService.makeMarkdown("<h1>" + title + "</h1>" + data);
                sessionStorage.setItem(KEY_TITLE, title);
                sessionStorage.setItem(KEY_CONTENT, mdContent);

                genSaveBtn();
            }
        }
    });

    const genSaveBtn = () => {
        let saveBtn = document.querySelector("#save_btn");
        if (saveBtn) {
//             saveBtn.onclick = () => {
//                 createAndDownloadFile("正文.md", sessionStorage.getItem(KEY_CONTENT));
//             }
        }
        else {
            saveBtn = document.createElement("div");
            saveBtn.id = "save_btn";
            saveBtn.textContent = "存";
            saveBtn.onclick = () => {
                createAndDownloadFile(sessionStorage.getItem(KEY_TITLE) + ".md", sessionStorage.getItem(KEY_CONTENT));
            };
            setSaveBtnStyle(saveBtn);
            document.querySelector("#app").appendChild(saveBtn);
        }
    }

    const setSaveBtnStyle = (saveBtn) => {
        saveBtn.style.position = "fixed";
        saveBtn.style.bottom = "2em";
        saveBtn.style.right = "2em";
        saveBtn.style.borderRadius = "50%";
        saveBtn.style.backgroundColor = "#f6f7f9";
        saveBtn.style.height = "38px";
        saveBtn.style.width = "38px";
        saveBtn.style.textAlign = "center";
        saveBtn.style.lineHeight = "38px";
        saveBtn.style.border = "1px solid #f6f7f9";
        saveBtn.style.cursor = "pointer";
    }

    const createAndDownloadFile = (fileName, content) => {
        let aTag = document.createElement('a');
        let blob = new Blob([content], {type: FILE_TYPE});
        aTag.download = fileName;
        aTag.href = URL.createObjectURL(blob);
        aTag.click();
        URL.revokeObjectURL(blob);
    }
})();