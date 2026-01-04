// ==UserScript==
// @name         Bilibili专栏图片批量下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于批量下载Bilibili专栏图片的工具
// @author       Cedaraos
// @match        https://www.bilibili.com/read/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.10.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449343/Bilibili%E4%B8%93%E6%A0%8F%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/449343/Bilibili%E4%B8%93%E6%A0%8F%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
var obj=document.getElementsByClassName("normal-img");
var zip=new JSZip();
var l=obj.length;
window.onload=()=>{
    var o=document.querySelector("#app > div > div.article-container > div.article-container__content > div.title-container > div > div");
    o.appendChild(document.createElement("a"));
    o.lastChild.setAttribute("data-v-0735ec40","");
    o.lastChild.text="下载全部图片";
    o.lastChild.style.marginLeft="30px";
    o.lastChild.onclick=()=>{
        main();
    }
}
function main(){
    for(var i=0;i<obj.length;i++){
        downloadUrlFile("https:"+obj[i].attributes['data-src'].value)
    }

}
function last(){
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, String(document.querySelector("#app > div > div.article-container > div.article-container__content > div.title-container > h1").innerText)+".zip");
    });
}
function downloadUrlFile(url) {
    url = url.replace(/\\/g, '/');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
        if (xhr.status === 200) {
            // 获取文件blob数据并保存
            var fileName = getFileName(url);
            zip.file(fileName,xhr.response,{base64: true});
            l-=1;
            if(l==0){
                last();
            }
        }
    };

    xhr.send();
}
/**
 * 根据文件url获取文件名
 * @param url 文件url
 */
function getFileName(url) {
    var num = url.lastIndexOf('/') + 1
    var fileName = url.substring(num)
        //把参数和文件名分割开
    fileName = decodeURI(fileName.split("?")[0]);
    return fileName;
}
