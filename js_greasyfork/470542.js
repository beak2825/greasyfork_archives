// ==UserScript==
// @name         乐课网课件下载
// @namespace    http://tampermonkey.net/
// @version      2.4.3
// @description  本脚本将添加一个下载课件的按钮在查看课件的界面上，输出文件为PDF格式
// @author       NWater
// @match        https://homework.leke.cn/auth/student/homework/doWork.htm?homeworkDtlId=*&schoolId=*
// @match        https://repository.leke.cn/ssr/page/pc/eBook
// @match        https://webapp.leke.cn/interact-classroom/
// @icon         https://static.leke.cn/images/common/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @license      GNU GPLv3
// @grant        GM_download
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/470542/%E4%B9%90%E8%AF%BE%E7%BD%91%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/470542/%E4%B9%90%E8%AF%BE%E7%BD%91%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

// Some codes reference to <https://greasyfork.org/zh-CN/scripts/442310-pku-thesis-download> (GPLv3)

(function() {
    const window = unsafeWindow;
    // Begin of code block from https://juejin.cn/post/6956456779761303560
    // Comment: Edited by nwater (2023)
    // 下载
    // @param  {String} url 目标文件地址
    // @param  {String} filename 想要保存的文件名称
    function courseDownload(url, filename, callback, progresscallpack) {
        console.log('下载文件: ', url, ' > ', filename);
        getBlob(url, function(blob) {
            saveAs(blob, filename);
            if(callback){
                callback();
            }
        }, progresscallpack);
    }
    function getBlob(url,callback, progresscallpack) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.addEventListener('load', function() {
        if (xhr.status === 200) {
            callback(xhr.response);
        }
        });
        if(progresscallpack){
            xhr.addEventListener('progress',progresscallpack);
        }
        xhr.send();
    }
    // 保存
    // @param  {Blob} blob
    // @param  {String} filename 想要保存的文件名称
    function saveAs(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
        } else {
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(link.href);
        }
    }
    // End of code block from https://juejin.cn/post/6956456779761303560

    async function initDownloader(){
        'use strict';
        let downloadButton;
        if(document.querySelector("ul.c-sidebar li.mobile")){
            console.log(`载入乐课网课件下载脚本：课件模式`);
            downloadButton = document.querySelector("ul.c-sidebar li.mobile").cloneNode(true);
            document.querySelector("ul.c-sidebar").appendChild(downloadButton);

            let downloadRawButton = document.querySelector("ul.c-sidebar li.mobile").cloneNode(true);
            downloadRawButton.innerHTML = `<a href="javascript:void(0);" style="background: lightblue; text-align: center; position: relative; z-index:99999999999;">下载源文件</a>`;
            document.querySelector("ul.c-sidebar").appendChild(downloadRawButton);
            downloadRawButton.addEventListener("click", async ()=>{
                let fileId = false;
                if(window.Csts && window.Csts.file && window.Csts.file.id){ fileId=window.Csts.file.id; }
                if(window.INITSTATE && window.INITSTATE.setEBook && window.INITSTATE.setEBook.ebookInfo && window.INITSTATE.setEBook.ebookInfo.ebook && window.INITSTATE.setEBook.ebookInfo.ebook.fileId){
                    fileId = window.INITSTATE.setEBook.ebookInfo.ebook.fileId;
                }
                downloadRawButton.innerHTML = `<a href="javascript:void(0);" style="background: lightpink; text-align: center; position: relative; z-index:99999999999;">查询文件ID</a>`;
                console.log(`获取文件ID:`, fileId)
                if(fileId){
                    console.log(`正在请求文件信息: ${document.location.origin}/auth/global/fs/file/access/data.htm?id=${fileId}`);
                    let fileData = new XMLHttpRequest();
                    // fileData.open('GET', `https://repository.leke.cn/auth/global/fs/file/access/data.htm?id=${fileId}`);
                    fileData.open('GET', `/auth/global/fs/file/access/data.htm?id=${fileId}`);
                    fileData.addEventListener("load", ()=>{
                        const res = JSON.parse(fileData.response);
                        console.log(`获取到文件信息:`, res);
                        if(!res.success){ return; }
                        let outputfilename = res.datas.file.name+'.'+res.datas.file.ext;
                        if(document.querySelector('div.ebook-pc div.nav-container div.btn span.nowrap')){ // 如果是电子课本
                            outputfilename = document.querySelector('div.ebook-pc div.nav-container div.btn span.nowrap').textContent.replace(/\//,'_') + '.pdf';
                        }
                        courseDownload(res.datas.file.path, outputfilename, ()=>{
                            downloadRawButton.innerHTML = `<a href="javascript:void(0);" style="background: lightblue; text-align: center; position: relative; z-index:99999999999;">下载源文件</a>`;
                        }, (progressEv)=>{
                            downloadRawButton.innerHTML = `<a href="javascript:void(0);" style="background: lightpink; text-align: center; position: relative; z-index:99999999999;">${Math.round(progressEv.loaded / progressEv.total * 100)}%</a>`;
                        });
                    });
                    fileData.send();
                }
            });
        }else if(document.querySelector("div.leftNav-item")){
            console.log(`载入乐课网课件下载脚本：直播模式`);
            downloadButton = document.querySelector("div.leftNav-item").cloneNode(true);
            document.querySelector("div.leftNav div").appendChild(downloadButton);
        }else{
            setTimeout(initDownloader, 2000);
            return;
        }

        downloadButtonModiff();

        function downloadButtonModiff(text){
            if(text){
                downloadButton.innerHTML = `<a href="javascript:void(0);" style="background: lightpink; text-align: center; position: relative; z-index:99999999999;">${text}</a>`;
                // downloadButton.removeEventListener("click", download);
                return;
            }
            downloadButton.innerHTML = `<a href="javascript:void(0);" style="background: lightgreen; text-align: center; position: relative; z-index:99999999999;">下载</a>`;

            downloadButton.removeEventListener("click", download);
            downloadButton.addEventListener("click", download);
        }

        async function download(){
            const selectors = [
                "li.m-pdf__item > img",
                "li.m-ppt__item > img:last-child", // 对于一页PPT，乐课网将其渲染成数帧，如果你需要下载所有帧而不是每页的最后一帧，删掉 ":last-child" 即可
                "img.tileList-item--img", // 直播课堂
                "li.doc-li > div > img",
                "li.scroll-li div.body-img:last-child img"
                // ……希望不会有更多类型了
            ];

            selectors.forEach(async (selector)=>{
                const images = selectImages(selector)
                    .then(makePDF);
                images.then(downloadPDF).catch(e=>{
                    console.error(`下载课件失败:`, e);
                    downloadButtonModiff(`失败`);
                    setInterval(downloadButtonModiff, 2000);
                });
                images.catch(e=>{
                        console.error(`下载课件失败:`, e);
                        downloadButtonModiff(`失败`);
                        setInterval(downloadButtonModiff, 2000);
                    });
            })
        }

        async function selectImages(selector){
            if(!selector){ return false; }
            downloadButtonModiff('读取中');
            const images = document.querySelectorAll(selector);
            let i=0;
            downloadButtonModiff(`下载${i}/${images.length}`);
            async function updateCounting(){
                i++;
                downloadButtonModiff(`下载${i}/${images.length}`);
                console.debug(`下载课件 [${i+1}/${images.length}]`);
            }
            [...images].map(image=>{
                if(image.attributes['data-src']){
                    image.src = image.attributes['data-src'].value;
                }
                image.onload = updateCounting;
                return image;
            });
            return images;
        }

        async function makePDF(images){
            if(!images || !images.length){ return false; }
            // Optinion of image width and height to millimeters convertion
            // Assume that 1 pixel = 0.264583 mm (96 DPI)
            downloadButtonModiff(`导出0/${images.length}`);
            const mmPerPx = 0.264583;
            // Create a PDF document with jsPDF library (https://github.com/MrRio/jsPDF)
            const pageWidth = images[0].naturalWidth ? images[0].naturalWidth * mmPerPx : images[0].width * mmPerPx;
            const pageHeight = images[0].naturalHeight ? images[0].naturalHeight * mmPerPx : images[0].height * mmPerPx;
            const pdf = images[0].naturalWidth > images[0].naturalHeight ? new jspdf.jsPDF({
                orientation: "landscape",
                format: [pageHeight, pageWidth]
            }) : new jspdf.jsPDF({
                format: [pageWidth, pageHeight]
            });
            async function addImage2PDF(i){
                downloadButtonModiff(`导出${i}/${images.length}`);
                console.debug(`导出课件 [${i}/${images.length}]`)
                const image = images[i];
                if (i > 0) { pdf.addPage(); }
                pdf.addImage(image, "JPEG", 0, 0,
                    (image.naturalWidth ? image.naturalWidth : image.width) * mmPerPx,
                    (image.naturalHeight ? image.naturalHeight : image.height) * mmPerPx
                );
                if(i+1<images.length){
                    await addImage2PDF(i+1);
                }
            }
            await addImage2PDF(0);
            return pdf;
        }

        async function downloadPDF(pdf){
            if(!pdf){ return false; }
            downloadButtonModiff(`导出中`);
            let outputfilename = 'downlaod.pdf';
            if(document.querySelector('div.ebook-pc div.nav-container div.btn span.nowrap')){ // 如果是电子课本
                outputfilename = document.querySelector('div.ebook-pc div.nav-container div.btn span.nowrap').textContent.replace(/\//,'_') + '.pdf';
            }
            if(document.querySelector('div.z-resource-detail div.briefintroduction div.info ul li.item span')){ // 如果是
                outputfilename = document.querySelector('div.z-resource-detail div.briefintroduction div.info ul li.item span').attributes.title.value + '.pdf';
            }
            pdf.save(outputfilename);
            downloadButtonModiff(`完成`);
            setTimeout(downloadButtonModiff, 5000);
        }
    }
    setTimeout(initDownloader, 500);
    })();
