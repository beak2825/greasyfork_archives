// ==UserScript==
// @name        理论资源下载器
// @namespace    https://qinlili.bid
// @version      0.1
// @description  一键导出图片
// @author       琴梨梨
// @match       */Service/?logic=PDFReaderController&call=readPDF&*
// @grant        none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/420916/%E7%90%86%E8%AE%BA%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/420916/%E7%90%86%E8%AE%BA%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.oncontextmenu = ""
    var pageTotal = 0;
    var picUrl = ""
    //从0开始
    var pageCurrent = 1;
    let urlParams = new URLSearchParams(window.location.search);
    var bookid = urlParams.get("bookid");
    //下载指定页面图片
    function downloadPic(page) {
        picUrl = window.location.origin + "/Service/?logic=PDFReaderController&call=ReadImg&imgurl=" + btoa(bookid + "(" + page + ").jpg");
        fetch(picUrl).then(res => res.blob().then(blob => {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(blob);
            var filename = page + '.jpg';
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        }))
    }
    //批量下载
    function batchDownload() {
        pageTotal = Number(document.getElementById("pageinfo").innerText.replace("共","").replace("页",""))
        nextPage();
    }
    //太快了会丢页，手动减速
    function nextPage(){
        if(pageCurrent<=pageTotal){
            downloadPic(pageCurrent);
            pageCurrent++;
            setTimeout(nextPage,250);}
    }
    //创建下载按钮
    var downloadBtn = document.createElement("a");
    downloadBtn.innerText = "批量下载全书";
    downloadBtn.onclick = function () { batchDownload() };
    document.querySelector("#ReaderTool").appendChild(downloadBtn);

})();