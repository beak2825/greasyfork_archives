// ==UserScript==
// @name         国图下载器
// @namespace    https://qinlili.bid/
// @version      0.5
// @description  通过劫持中间数据下载原始PDF，虽然方法非常扭曲，但能跑起来
// @author       琴梨梨
// @match        *://read.nlc.cn/static/webpdf/indexnobj.html?*
// @match        *://read.nlc.cn/static/webpdf/index.html?*
// @match        *://read.nlc.cn/static/webpdf/left.html?*
// @match        *://read.nlc.cn/static/webpdf/right.html?*
// @match        *://read.nlc.cn/yuewen/read?*
// @homepage     https://github.com/qinlili23333/nlcDownloader
// @supportURL   https://github.com/qinlili23333/nlcDownloader
// @icon         http://read.nlc.cn/static/style/images/gutu_logo.jpg
// @grant        none
// @run-at       document-start
// @license      MPLv2
// @downloadURL https://update.greasyfork.org/scripts/441502/%E5%9B%BD%E5%9B%BE%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/441502/%E5%9B%BD%E5%9B%BE%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const dlFile = (link, name) => {
        let eleLink = document.createElement('a');
        eleLink.download = name;
        eleLink.style.display = 'none';
        eleLink.href = link;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    }
    if(location.pathname.indexOf("webpdf")){
        //PDF下载
        let injectWorker=`(function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            if (!(async === false)) {
                async = true;
            };
            if(url.indexOf("OutOpenBook/getReader")>0){
                console.log(url)
                console.log("捉住下载请求了喵！正在监控喵！")
                this.addEventListener('load', event=>{
                    console.log("下载完成了喵！正在导出文件！");
                    const pdfFile=URL.createObjectURL(new Blob([this.response]));
                    console.log(pdfFile);
                    postMessage("pdfFile:"+pdfFile)
                });
            }
            open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);
    const originImport=self.importScripts;
    self.importScripts=src=>(originImport("http://read.nlc.cn/static/webpdf/lib/"+src));`
    const originWorker=window.Worker
    window.Worker= function(aurl,options) {
        console.log(aurl)
        if(aurl.indexOf("WebPDFJRWorker.js")>=0){
            console.log("捉住Worker请求了喵！")
            var oReq = new XMLHttpRequest();
            oReq.open("GET", aurl,false);
            oReq.send();
            const mergedWorker=URL.createObjectURL(new Blob([injectWorker+oReq.response]))
            console.log("给Worker加点料！寄汤来咯！")
            let hookWorker= new originWorker(mergedWorker,options);
            hookWorker.addEventListener('message', (event) => {
                if(!(typeof event.data=="object")&&event.data.startsWith("pdfFile")){
                    console.log("下载！冲冲冲！")
                    event.stopPropagation();
                    event.preventDefault();
                    dlFile(event.data.substr(8),"nlc.pdf")
                }
            },true);
            return hookWorker;
        }else{
            return new originWorker(aurl,options);
        }
    }
    }
    if(location.pathname.indexOf("yuewen")>=0){
        //EPUB下载
        (function(open) {
            XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
                if (!(async === false)) {
                    async = true;
                };
                if(url.indexOf(".epub")>0){
                    console.log(url)
                    console.log("捉住下载请求了喵！正在监控喵！")
                    this.addEventListener('load', event=>{
                        console.log("下载完成了喵！正在导出文件！");
                        const pdfFile=URL.createObjectURL(new Blob([this.response]));
                        console.log("下载！冲冲冲！")
                        console.log(pdfFile);
                        dlFile(pdfFile,"nlc.epub")
                    });
                }
                open.call(this, method, url, async, user, pass);
            };
        })(XMLHttpRequest.prototype.open);
    }
})();
