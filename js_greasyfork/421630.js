// ==UserScript==
// @name         连环画下载器
// @namespace    https://qinlili.bid/
// @version      0.2
// @description  自动打包下载
// @author       琴梨梨
// @match        http://wx.zhlhh.com/Reader/*?*
// @match        http://zy.zhlhh.com/Downloader?*
// @grant        none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/421630/%E8%BF%9E%E7%8E%AF%E7%94%BB%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/421630/%E8%BF%9E%E7%8E%AF%E7%94%BB%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var imgInfo;
    if (document.location.host == "wx.zhlhh.com") {
        $("#dibu").show();
        document.getElementById("xzing").lastElementChild.removeAttribute("href");
        document.getElementById("xzwc").lastElementChild.removeAttribute("href");
        document.getElementById("xzing").onclick = function () {
            window.open('http://zy.zhlhh.com/Downloader?title=' + document.title + "&json=" + btoa(JSON.stringify(gallery.items)), 'target', '');
        }
    }
    if (document.location.host == "zy.zhlhh.com") {
        document.querySelector("body").innerHTML="<H2>打包需要时间，请耐心等待</H2><H2>本页面仅用于CORS注入，分享网址没有用</H2>"
        var searchParams = new URLSearchParams(document.location.search);
        imgInfo = JSON.parse(atob(searchParams.get("json") ))
        document.title="下载：" + searchParams.get("title");
        var zip;
        function makeZIP(){
            SakiProgress.showDiv();
            SakiProgress.setText("准备下载...");
            downloadBtn.innerText="工作中...";
            downloadBtn.disabled=true;
            var i = 0;
            zip = new JSZip();
            function dlNext() {
                SakiProgress.setText("正在处理" + (i+1) + "页...");
                SakiProgress.setPercent(i/imgInfo.length*80);
                fetch(imgInfo[i].src).then(res => res.blob().then(blob => {
                    zip.file((i + 1) + ".jpg", blob, { binary: true })
                    i = i + 1;
                    if (imgInfo[i]) { dlNext(); }else{
                        SakiProgress.setText( "正在打包...");
                        SakiProgress.setPercent(80);
                        dlZIP();
                    }
                }))
            }
            dlNext();
        }
        var downloadBtn = document.createElement("button");
        downloadBtn.innerText = "正在初始化...";
        downloadBtn.onclick = function () { makeZIP() }
        downloadBtn.disabled=true;
        document.querySelector("body").appendChild(downloadBtn);
        function dlZIP(){
            zip.generateAsync({ type: "blob" }).then(function (blob) {
                SakiProgress.setText( "正在导出...");
                SakiProgress.setPercent(90);
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(blob);
                var filename = searchParams.get("title") + ".zip";
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
                downloadBtn.innerText="保存成功！";
                setTimeout(function(){
                    SakiProgress.setText( "下载成功！");
                    SakiProgress.setPercent(100);
                    SakiProgress.clearProgress();
                },1000)
            });
        }
        downloadBtn.innerText = "正在加载JSZip依赖...";
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js";
        document.body.appendChild(script);
        script.onload=function(){
            downloadBtn.innerText = "正在加载SakiProgress依赖...";
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://cdn.jsdelivr.net/gh/qinlili23333/SakiProgress@1.0.3/SakiProgress.min.js";
            document.body.appendChild(script);
            script.onload=function(){
                downloadBtn.innerText = "打包下载";
                SakiProgress.init();
                downloadBtn.disabled=false;
            }
        }
    }
})();