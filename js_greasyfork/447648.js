// ==UserScript==
// @name         咚漫漫画官网 PC端漫画下载
// @namespace    https://github.com/xuooux
// @version      1.0
// @description  咚漫漫画下载，只能每一话的下载
// @author       xucl
// @match        https://www.dongmanmanhua.cn/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js
// @icon         https://cdn.allflow.cn/emoji/google/u1f34a.svg
// @compatible    chrome
// @compatible    firefox
// @compatible    edge
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447648/%E5%92%9A%E6%BC%AB%E6%BC%AB%E7%94%BB%E5%AE%98%E7%BD%91%20PC%E7%AB%AF%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/447648/%E5%92%9A%E6%BC%AB%E6%BC%AB%E7%94%BB%E5%AE%98%E7%BD%91%20PC%E7%AB%AF%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let comieList = [];
    let zip = new JSZip();
    let name = $(".subj_info a").text();
    let title = $("h1.subj_episode").text();
    function confirmDownload() {
        comieList = $("#_imageList img");
        let chStr = prompt("目前发现了" + comieList.length + "张图片", "1-" + comieList.length);
        let confirmMsg = Array.from (comieList).map(s => s.getAttribute("src")).join("\n");
        let confirmStart = confirm("即将开始下载如下图片\n"+confirmMsg);
        if (!confirmStart)
            return
        let downButton = $("#download-btn");
        downButton.text("下载中");
        download().then(_ =>{
            downButton.text("下载完成");
            downButton.css("color", "red");
        })
        .catch(e => {
            console.error("失败", e);
            downButton.text("下载失败");
        }).finally(_ =>
            zip.generateAsync({ type: "blob" }).then(blob => saveAs(blob, name+title + ".zip")));
    }

    function download() {
        let downloadPromises = Promise.resolve();
        console.log("======开始下载======",comieList);
        $("#download-btn").text("下载中...");
        for (let i = 0; i < comieList.length; i++) {
            try{

                let chapter = comieList[i];
                let urlStr = chapter.getAttribute("data-url");

                let realURL = new URL(urlStr);
                const chapterName = name + "/" + title+"/";

                let curChaptZip = zip.folder(chapterName);
                downloadPromises = downloadPromises.then(_ => {
                    let curChaptButton = $(chapter);
                    curChaptButton.css("color", "#2505ff");
                    curChaptButton.text("下载中")
                    return getImage(realURL, i, curChaptZip).then(_ => {
                        curChaptButton.text(`下载完成`);
                        curChaptButton.css("color", "red");
                    });
                })

            } catch(e){
                console.error(e);
               $("#download-btn").text("下载失败");
            }
      }
     return downloadPromises;
    }
    function getImage(url, index, curChaptZip) {
        //let index = 0;
        return new Promise((infoResolve, infoReject) => {
            console.log("url,is downloaded", url.origin+url.pathname);
            GM_xmlhttpRequest({
                method: 'GET',
                url: url.origin+url.pathname,
                 responseType: 'blob',
                headers: {
                   "Referer": url.origin
               },
                anonymous: false,
                onload: function (resp) {

                    let fileSuffix = resp.finalUrl.split('.');
                    let file = index + url.pathname.replaceAll("/","_");
                    console.log(file);
                    curChaptZip.file(file, resp.response)
                    infoResolve();
                },
                onerror: function (e) {
                    console.error(e);
                     $("#download-btn").text("下载失败");
                    infoReject(e);
                }
        })}).then(_ => new Promise(resolve => setTimeout(resolve, 1000)));
    }
    const styleCss = `
    display: block;
    position: relative;
    min-width: 76px;
    height: 38px;
    line-height: 40px;
    padding: 0 12px;
    background: #4e4646;
    font-size: 15px;
    font-family: 'hind_m','simhei',verdana,Helvetica,sans-serif;
    color: #ffffff;
    cursor: pointer;
    border-radius: 19px;
    `;
    $("#_bottomLikeSubscribe").append(`<li class="relative"><button style="${styleCss}" id="download-btn">开始下载</button></li>`);
    $("#download-btn").click(confirmDownload);

})();