// ==UserScript==
// @name         HyReadTW下载器
// @namespace    https://qinlili.bid
// @version      0.1
// @description  EPUB目前支持比较简陋
// @author       琴梨梨
// @match        https://service.ebook.hyread.com.tw/ebookservice/epubreader/hyread/v3/reader.jsp
// @icon         https://nju.ebook.hyread.com.cn/Template/standard/images/hyread_icon.jpg
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js
// @license      MPLv2
// @downloadURL https://update.greasyfork.org/scripts/444447/HyReadTW%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/444447/HyReadTW%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
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
                if(document.getElementsByClassName("render").length){
                    console.log("页面就绪了喵~走起~");
                    resolve();
                    observer.disconnect();
                }
            });
            observer.observe(document.documentElement, {childList: true,subtree: true });
        });
    };
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
    await waitUI();
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
    console.log("准备中~");
    await sleep(2000);
    //推断类名
    const svgList=document.getElementsByTagName("svg");
    //建立下载按钮
    let dlBtn=document.createElement("div");
    dlBtn.className=svgList[6].parentElement.className;
    let dlIcon=document.createElement("img");
    dlIcon.src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4wMSIvPjxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgcng9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTMyIDI4TDI0IDM2TDE2IDI4IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTI0IDIwVjM1LjUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTYgMTRIMzIiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=";
    dlBtn.appendChild(dlIcon);
    svgList[6].parentElement.insertAdjacentElement('afterend',dlBtn);
    let clickTick=0;
    dlBtn.addEventListener("click",async ()=>{
        if(!clickTick){
            console.log("要开始了哟~");
            alert("请手动翻页，确保载入完成后再继续翻页，直到末尾，然后再次点击下载按钮");
            clickTick++;
        }else{
            alert("正在打包");
            console.log("在打包了喵~");
            let zip = new JSZip();
            let counter=0;
            imgTemp.forEach(imgBlob=>{
                counter++
                if(imgBlob.type.indexOf("image")==1){
                    zip.file(counter+ ".jpg", imgBlob, { binary: true })
                }else{
                    zip.file(counter+ ".html", imgBlob, { binary: true })
                }
            });
            let zipFile=await zip.generateAsync({ type: "blob" });
            dlFile(originCreate(zipFile),"000.zip");
            console.log("完成了喵~");
        }
    })
    console.log("准备就绪了喵~");

})();