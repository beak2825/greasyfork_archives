// ==UserScript==
// @name         极客时间文章保存-补充保存图片和音频
// @namespace    https://github.com/purice93
// @version      0.4.3
// @description  在极客时间专栏内容页面增加一个保存按钮，点击后将正文以markdown格式下载保存——参考自：LazyBug1E0CF
// @author       soundslow
// @match        *://time.geekbang.org/column/article/*
// @grant        none
// @require      https://unpkg.com/ajax-hook@1.8.3/dist/ajaxhook.min.js
// @require      https://unpkg.com/showdown/dist/showdown.min.js
// @license      https://choosealicense.com/licenses/mit/#
// @downloadURL https://update.greasyfork.org/scripts/437475/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E6%96%87%E7%AB%A0%E4%BF%9D%E5%AD%98-%E8%A1%A5%E5%85%85%E4%BF%9D%E5%AD%98%E5%9B%BE%E7%89%87%E5%92%8C%E9%9F%B3%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/437475/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E6%96%87%E7%AB%A0%E4%BF%9D%E5%AD%98-%E8%A1%A5%E5%85%85%E4%BF%9D%E5%AD%98%E5%9B%BE%E7%89%87%E5%92%8C%E9%9F%B3%E9%A2%91.meta.js
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
                let audio = resJson.data.audio_download_url;
                let article_cover = resJson.data.article_cover;
                let author_name = "作者: " + resJson.data.author_name;
                let time = "完成时间: ";
                let time2 = "总结时间: ";
                let img = "<img src=\"" + article_cover + "\" alt=\"\"><p>"
                //let table = "<table border=\"1\"><tr><td>作者</td><td>" + author_name + "</td></tr><tr><td>完成时间</td><td></td></tr><tr><td>总结时间</td><td></td></tr></table>"
                // let img = "![]("+ article_cover + ")"
                let audio2 = "<audio><source src=\"" + audio + "\" type=\"audio/mpeg\"></audio>"
                const mdContent = mdService.makeMarkdown("<h1>" + title + "</h1>"  + "<p>" + author_name + "<\p>" + time + "<p>" + time2 + "<p>" + img + audio2 + data);
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