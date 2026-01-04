// ==UserScript==
// @name         43423、壁咚漫画下载
// @namespace    http://ynotme.cn/
// @version      0.1
// @description  针对43423、壁咚漫画网下载
// @author       zhangtao
// @match        https://www.43423.cc/book/*
// @match        https://www.bidongmh.com/book/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/398200/43423%E3%80%81%E5%A3%81%E5%92%9A%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/398200/43423%E3%80%81%E5%A3%81%E5%92%9A%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let comieList = [];
    let start = 0;
    let end = 0;
    let zip = new JSZip();
    let title = $("h1.title").text();
    function confirmDownload() {
        comieList = $("#chapterList li >a");
        let chStr = prompt("目前发现了" + comieList.length + "话漫画，请输入要下载的部分", "1-" + comieList.length)
        if (/^[0-9]+-[0-9]+$/.test(chStr)) {
            let st = chStr.split("-");
            start = parseInt(st[0])
            end = parseInt(st[1])
        } else {
            return;
        }
        let confirmStart = confirm("即将从" + comieList[start - 1].innerText + "下载到" + comieList[end - 1].innerText)
        if (!confirmStart)
            return
        $("#download-btn").text("下载中");
        download().then(_ => $("#download-btn").text("下载完成"))
        .catch(e => {
            console.error("失败", e);
            $("#download-btn").text("下载失败")
        }).finally(_ =>
            zip.generateAsync({ type: "blob" }).then(blob => saveAs(blob, title + ".zip")));
    }
    function getStringByInt (i) {
        if (i>999) return `${i}`;
        if (i>99) return `0${i}`;
        if (i>9) return `00${i}`;
        return `000${i}`;
    }
    function download() {
        let downloadPromises = Promise.resolve();
        for (let i = start - 1; i < end; i++) {
            const chapter = comieList[i];
            const chapterName = chapter.innerText;
            let curChaptZip = zip.folder(chapterName);
            downloadPromises = downloadPromises.then(_ => {
                let curChaptButton = $(chapter);
                curChaptButton.css("color", "#2505ff");
                curChaptButton.text("开始下载")
                return getImage(chapter.href, 1, curChaptZip).then(_ => {
                    curChaptButton.text("下载完成");
                    curChaptButton.css("color", "red");
                });
            })
        }
        return downloadPromises;
    }
    function getImage(url, page, curChaptZip) {
        let lastPage = 0;
        return new Promise((infoResolve, infoReject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url + "?page=" + page,
                onload: function (resp) {
                    let imgs = $("img.comicimg", resp.responseText);
                    let pages = $("select.selectpage > option", resp.responseText);
                    lastPage = pages.length;
                    let imagePromises = []
                    for (let i = 0; i < imgs.length; i++) {
                        const currentIndex = i;
                        imagePromises.push(new Promise((imageResolve, imageReject) => {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: imgs[i].src,
                                responseType: 'blob',
                                anonymous: false,
                                headers: {
                                    "Referer": resp.finalUrl
                                },
                                onload: function (resp) {
                                    let fileName = resp.finalUrl.split('.');
                                    let file  = `${getStringByInt(page)}_${getStringByInt(currentIndex)}.${fileName[fileName.length - 1]}`
                                    console.log(file);
                                    curChaptZip.file(file, resp.response)
                                    imageResolve();
                                },
                                onerror: function (e) {
                                    console.error(e);
                                    imageResolve();
                                }
                            })
                        }))
                    }
                    Promise.all(imagePromises).then(_ => {
                        console.log("url, page is downloaded", url, page)
                        infoResolve();
                    });
                },
                onerror: function (e) {
                    infoReject(e);
                }
            });
        })
        .then(_ => new Promise(resolve => setTimeout(resolve, 2000)))
        .then(_ => {
            if (page < lastPage) {
                return getImage(url, page + 1, curChaptZip);
            } return;
        })
    }
    $(".comic-operate > ul").append('<li class="item"><i class="ift-down"></i><span class="type" title="下载"><a href="#" class="btn-2" rel="nofollow" id="download-btn">开始下载</a></span></li>');
    $(".comic-operate > ul").append('<li class="item"><i class="ift-down"></i><span class="type" title="打包"><a href="#" class="btn-2" rel="nofollow" id="package-btn">立刻打包</a></span></li>');
    $("#download-btn").click(confirmDownload);
    $("#package-btn").click(_ => {
        zip.generateAsync({ type: "blob" }).then(blob => saveAs(blob, title + ".zip"))
    });
})();