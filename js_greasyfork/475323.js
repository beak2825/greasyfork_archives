// ==UserScript==
// @name         Oxford Academic导出PDF
// @namespace    https://qinlili.bid
// @version      1.0.0
// @description  自动获取并合并PDF
// @author       琴梨梨
// @license      WTFPL
// @match        https://academic.oup.com/edited-volume/*
// @icon         https://oup.silverchair-cdn.com/UI/app/img/v-638282418223920402/apple-touch-icon.png
// @run-at       document-idle
// @require      https://lib.baomitu.com/pdf-lib/1.17.1/pdf-lib.min.js#sha512-z8IYLHO8bTgFqj+yrPyIJnzBDf7DDhWwiEsk4sY+Oe6J2M+WQequeGS7qioI5vT6rXgVRb4K1UVQC5ER7MKzKQ==
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/475323/Oxford%20Academic%E5%AF%BC%E5%87%BAPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/475323/Oxford%20Academic%E5%AF%BC%E5%87%BAPDF.meta.js
// ==/UserScript==

(async function() {
    //CODENAME:Carboxylate
    'use strict';
    const config={
        //带目录导出，需要依赖闭源的PSPDFKIT，目前暂不可用，有待进一步开发
        writeOutline:false,
        //去除账号标识，开发中
        removeAccountInfo:false
    };
    GM.registerMenuCommand("原神，启动！", () => {
        location.href="https://ys.mihoyo.com/";
    });
    const dlFile = (link, name) => {
        let eleLink = document.createElement('a');
        eleLink.download = name;
        eleLink.style.display = 'none';
        eleLink.href = link;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    };
    const loadScriptAsync = link => {
        return new Promise(resolve => {
            let script = document.createElement("script");
            script.src = link;
            script.onload = resolve;
            document.body.appendChild(script);
        });
    };
    switch(location.host){
        case("academic.oup.com"):{
            //文档详情页
            console.log("关注笙歌喵~关注帅比笙歌超可爱OvO谢谢喵~");
            console.log("Carboxylate 1.0.0");
            const titleDiv=document.getElementsByClassName("book-bottom-section__title-wrap")[0];
            let dlBtn=document.createElement("button");
            dlBtn.innerText="下载全部PDF";
            titleDiv.appendChild(dlBtn);
            dlBtn.onclick=async ()=>{
                dlBtn.onclick=null;
                //阶段1：建立目录结构
                dlBtn.innerText="0% 分析目录结构";
                const catagory=document.getElementsByClassName("bookToc")[0];
                let parsedCatagory={
                    title:document.getElementsByClassName("book-info__title")[0].innerText.trim(),
                    author:document.getElementsByClassName("book-info__author-link")[0].innerText.trim(),
                    chapters:[]
                };
                const parseChapter=(ele,depth)=>{
                    if(ele.getElementsByClassName("collections-child-list").length==0||ele.getElementsByClassName("collections-child-list")[0].children.length==0){
                        //顶级章节，直接处理
                        [].forEach.call(ele.children,sub=>{
                            if(sub.className=="tocLink"&&sub.tagName=="A"){
                                //获取标题和链接
                                parsedCatagory.chapters.push({
                                    title:(sub.getElementsByClassName("tocLink-label")[0]?sub.getElementsByClassName("tocLink-label")[0].innerText:"")+" "+sub.getElementsByClassName("tocLink-title")[0].innerText,
                                    link:sub.href,
                                    depth:depth,
                                    child:false,
                                    debug:sub
                                });
                            }
                        })
                    }else{
                        //读取子章节
                        parsedCatagory.chapters.push({
                            title:(ele.getElementsByClassName("tocLink-label")[0]?ele.getElementsByClassName("tocLink-label")[0].innerText:"")+" "+ele.getElementsByClassName("tocLink-title")[0].innerText,
                            link:null,
                            depth:depth,
                            child:true,
                            debug:ele
                        });
                        //递归遍历
                        [].forEach.call(ele.getElementsByTagName("ul")[0].getElementsByTagName("li"),ele=>{
                            parseChapter(ele,depth+1);
                        });
                    }
                }
                [].forEach.call(catagory.children,ele=>{
                    if(ele.tagName=="LI"){
                        parseChapter(ele,0);
                    }
                });
                console.log(parsedCatagory);
                //阶段2：解析PDF地址
                dlBtn.innerText="5% 解析PDF地址";
                let count=0;
                for(let chapter of parsedCatagory.chapters){
                    if(chapter.child==false){
                        //可下载的章节，需要解析地址
                        let chapterRequest=await fetch(chapter.link, {
                            "referrer": location.href,
                            "method": "GET",
                            "mode": "cors",
                            "credentials": "include"
                        });
                        let chapterPage=await chapterRequest.text();
                        const parser = new DOMParser();
                        const chapterDoc = parser.parseFromString(chapterPage, "text/html");
                        chapter.pdflink=chapterDoc.getElementsByClassName("at-pdfLink")[0].href;
                    };
                    count++;
                    dlBtn.innerText=(5+25*count/parsedCatagory.chapters.length).toFixed(2)+"% 解析PDF地址["+count+"/"+parsedCatagory.chapters.length+"]";
                };
                console.log(parsedCatagory);
                //阶段3：分段下载PDF
                dlBtn.innerText="30% 下载PDF";
                count=0;
                for(let chapter of parsedCatagory.chapters){
                    if(chapter.child==false){
                        //异步跨域下载PDF
                        function asyncFetch(){
                            return new Promise(resolve => {
                                let pic=GM_xmlhttpRequest({
                                    method: "GET", url: chapter.pdflink, responseType: "blob", onload: (res) => {
                                        console.log(res.response);
                                        chapter.pdffile=res.response;
                                        resolve();
                                    }
                                })
                                });
                        }
                        await asyncFetch();
                    };
                    count++;
                    dlBtn.innerText=(30+60*count/parsedCatagory.chapters.length).toFixed(2)+"% 下载PDF["+count+"/"+parsedCatagory.chapters.length+"]";
                };
                console.log(parsedCatagory);
                //阶段4：合并PDF导出
                dlBtn.innerText="90% 合并PDF";
                const pdfDoc = await PDFLib.PDFDocument.create();
                count=0;
                pdfDoc.setTitle(parsedCatagory.title);
                pdfDoc.setAuthor(parsedCatagory.author);
                pdfDoc.setCreator("Carboxylate By QINLILI");
                pdfDoc.setCreationDate(new Date());
                pdfDoc.setModificationDate(new Date());
                //合并PDF并记录页码
                for(let chapter of parsedCatagory.chapters){
                    if(chapter.child==false){
                        //合并PDF
                        const pdfObj=await PDFLib.PDFDocument.load(await chapter.pdffile.arrayBuffer());
                        const copiedPages = await pdfDoc.copyPages(pdfObj, pdfObj.getPageIndices());
                        copiedPages.forEach((page) => pdfDoc.addPage(page));
                        chapter.pages=copiedPages.length;
                    };
                    count++;
                    dlBtn.innerText=(90+6*count/parsedCatagory.chapters.length).toFixed(2)+"% 合并PDF["+count+"/"+parsedCatagory.chapters.length+"]";
                };
                console.log(parsedCatagory);
                //导出文件
                dlBtn.innerText="96% 写入目录";
                const mergedPdfFile = await pdfDoc.save();
                if(config.writeOutline){
                    await loadScriptAsync("https://cdn.jsdelivr.net/npm/pspdfkit@2023.4.0/dist/pspdfkit.min.js");
                    let foo=document.createElement("div");
                    foo.className="foo";
                    foo.style.width="100vw";
                    foo.style.height="100vh";
                    foo.style.display="none";
                    document.body.appendChild(foo);
                    let instance=await PSPDFKit.load({
                        baseUrl:"https://cdn.jsdelivr.net/npm/pspdfkit@2023.4.0/dist/",
                        document: mergedPdfFile.buffer,
                        container:'.foo'
                    });
                    for(let chapter of parsedCatagory.chapters){
                        const bookmark = new PSPDFKit.Bookmark({
                            name: chapter.title,
                            action: new PSPDFKit.Actions.GoToAction({ pageIndex: count })
                        });
                        await instance.create(bookmark);
                        if(chapter.child==false){
                            //小标题累计页码
                            count+=chapter.pages;
                        };
                    };
                    dlBtn.innerText="98% 导出文件 带目录导出耗时极长，请保持耐心";
                    const documentBuffer = await instance.exportPDF();
                    const pdfFile=new Blob([documentBuffer]);
                    dlFile(URL.createObjectURL(pdfFile),parsedCatagory.title+".pdf")
                }else{
                    dlBtn.innerText="98% 导出文件";
                    const pdfFile=new Blob([mergedPdfFile]);
                    dlFile(URL.createObjectURL(pdfFile),parsedCatagory.title+".pdf")
                };
                dlBtn.innerText="100% 下载成功";
            };
            break;
        };
        default:{
            break;
        }
    }
})();