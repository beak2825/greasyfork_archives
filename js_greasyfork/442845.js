// ==UserScript==
// @name         HyRead下载器
// @namespace    https://qinlili.bid
// @version      0.1
// @description  左行书还需要更多测试，尚不稳定
// @author       琴梨梨
// @match        https://service.ebook.hyread.com.cn/ebookservice/epubreader/hyread/v3/reader.jsp
// @icon         https://nju.ebook.hyread.com.cn/Template/standard/images/hyread_icon.jpg
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js
// @license      MPLv2
// @downloadURL https://update.greasyfork.org/scripts/442845/HyRead%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/442845/HyRead%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(async function() {
    'use strict';


    console.log("正在初始化喵~");
    const dlFile = (link, name) => {
        let eleLink = document.createElement('a');
        eleLink.download = name;
        eleLink.style.display = 'none';
        eleLink.href = link;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    }
    function waitUI() {
        return new Promise(resolve => {
            const observer = new MutationObserver(function(){
                if(document.getElementsByClassName("toolbaritem--flexible").length){
                    console.log("页面就绪了喵~走起~");
                    resolve();
                    observer.disconnect();
                }
            });
            observer.observe(document.documentElement, {childList: true,subtree: true });
        });
    };
    await waitUI();
    const originCreate=URL.createObjectURL;
    let imgTemp=[]
    var onPageChange = function () { };
    function waitLoading() {
        return new Promise(resolve => {
            setTimeout(()=>{resolve()},10000);
            onPageChange = () => {
                resolve();
            }
        });
    }
    let num=0;
    const count=()=>{
        num++;
        if(num==2){
            onPageChange();
            num=0;
        }
    }
    URL.createObjectURL=object=>{
        console.log(object);
        imgTemp[imgTemp.length]=object;
        count();
        return originCreate(object);
    };
    const nextPage=()=>{
        document.body.dispatchEvent(new KeyboardEvent("keyup",{
            bubbles: true,
            cancelable: true,
            code: "ArrowRight",
            key: "ArrowRight",
            keyCode: 39
        }))
    };
    const nextPageLeft=()=>{
        document.body.dispatchEvent(new KeyboardEvent("keyup",{
            bubbles: true,
            cancelable: true,
            code: "ArrowLeft",
            key: "ArrowLeft",
            keyCode: 37
        }))
    };
    const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))
    //建立下载按钮
    let dlBtn=document.createElement("div");
    dlBtn.className="toolbaritem";
    let dlIcon=document.createElement("img");
    dlIcon.src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4wMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgcng9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTMyIDI4TDI0IDM2TDE2IDI4IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTI0IDIwVjM1LjUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTYgMTRIMzIiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=";
    dlBtn.appendChild(dlIcon);
    document.getElementsByClassName("toolbaritem--flexible")[0].insertAdjacentElement('afterend',dlBtn);
    dlBtn.addEventListener("click",async ()=>{
        console.log("要开始了哟~");
        if(document.getElementsByClassName("pager__arrow pager__arrow--right pager__arrow--disabled").length){
            //左翻页
            for(;document.getElementsByClassName("pager__arrow pager__arrow--left pager__arrow--disabled").length==0;){
                nextPageLeft();
                await waitLoading();
            }
        }else{
            //右翻页
            for(;document.getElementsByClassName("pager__arrow pager__arrow--right pager__arrow--disabled").length==0;){
                nextPage();
                await waitLoading();
            }
        }
        console.log("在打包了喵~");
        let zip = new JSZip();
        let counter=0;
        imgTemp.forEach(imgBlob=>{
            counter++
            zip.file(counter+ ".jpg", imgBlob, { binary: true })
        });
        let zipFile=await zip.generateAsync({ type: "blob" });
        dlFile(originCreate(zipFile),document.querySelector("#hyread-epub-reader > div > div.title-bar").innerText+".zip");
        console.log("完成了喵~");
    })
    console.log("准备就绪了喵~");

})();
