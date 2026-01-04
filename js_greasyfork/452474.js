// ==UserScript==
// @name         KaKao Comic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  下载kakao漫画
// @author       cw2012
// @match        https://webtoon.kakao.com/viewer/*
// @icon         https://webtoon.kakao.com/ico/icon76_210521.png
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452474/KaKao%20Comic.user.js
// @updateURL https://update.greasyfork.org/scripts/452474/KaKao%20Comic.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addCss();
    let msgBox=null;
    let imgUrls=[], imgCount=0, imgDownloadedCount = 0, fileNameLength=0;
    initUI();

    function initUI(){
        // 解析按钮
        const btn = document.createElement('div');
        btn.innerText = '解 析';
        btn.className = 'floating-btn';
        btn.addEventListener('click', ev=>getAllImg());
        document.body.append(btn);
    }

    function getAllImg(){
        const imgList = document.querySelectorAll('div[data-index].mx-auto');
        imgUrls.length = 0;
        imgList.forEach(imgBox=>{
            const index = parseInt(imgBox.getAttribute("data-index"));
            try{
            imgUrls[index] = {
                index:index+1,
                url:imgBox.querySelector('img[src^="blob:https://"]').src
            };
            }catch{
                console.log(imgBox)
            }
        });
        imgCount = imgUrls.length;
        fileNameLength = imgCount.toString().length;
        downloadImg();
    }

    function downloadImg(){
        imgDownloadedCount = 0;
        let zip = new JSZip();
        let zipName = location.href.split("/")[4];
        zipName = decodeURIComponent(zipName);
        zipName = zipName.match(/\d+/)[0] + '.zip';
        imgUrls.forEach(item=>{
            const fileName = sn(item.index)+'.webp';
            GM_xmlhttpRequest({
                url: item.url,
                method: 'get',
                responseType :'blob',
                timeout: 105000,
                onload: res =>{
                    const imgData = new File([res.response], fileName);
                    zip.file(fileName, imgData, { base64: true });
                    zip.generateAsync({type: 'blob'}).then(
                        content=> {
                            showMsg(`正在下载图片：${imgDownloadedCount + 1}/${imgCount}`);
                            if(++imgDownloadedCount >= imgCount){
                                downloadFileByBlob(content, zipName);
                                showMsg('');
                            }
                        }
                    );
                },
                onerror: err=>{
                    console.log( `下载失败：【${1+item.index}】${item.url}`)
                    if(++imgDownloadedCount >= imgCount){
                        showMsg('下载无法继续',-1);
                    }
                },
                ontimeout:()=>{
                    console.log( `下载失败：【${1+item.index}】${item.url}`)
                    if(++imgDownloadedCount >= imgCount){
                        showMsg('下载无法继续',-1);
                    }
                }
            })
        });
    }

    // 利用blob下载文件
    function downloadFileByBlob(blobContent, filename) {
        const blobUrl = URL.createObjectURL(blobContent)
        const eleLink = document.createElement('a')
        eleLink.download = filename
        eleLink.style.display = 'none'
        eleLink.href = blobUrl
        eleLink.click();
    }

    function sn(index){
        return index.toString().padStart(fileNameLength, '0');
    }

    function showMsg(msg,type){
        if(msgBox == null){
            msgBox = document.createElement('div');
            msgBox.id = 'msg-box';
            document.body.append(msgBox);
        }
        msgBox.innerText = msg;
        msgBox.className=type?'showing':'err';
        setTimeout(()=>{msgBox.className='';},type==0?4000: 2500);
    }

    function addCss(){
        GM_addStyle(`
        .floating-btn{
        position:fixed;
        background: #0a7deb;
        text-align: center;
        color:white;
        font-size:1.5em;
        cursor: pointer;
        border-radius:10px;
        border:solid #0a7deb 1px;
        padding:6px;
        top:50%;
        right:20px;
        z-index:99;
        box-shadow:#0a7deb 2px 2px 6px, #0a7deb 6px 6px 19px;
        }
        .floating-div{
        position:relative;
        background: #0a7deb;
        text-align: center;
        color:white;
        cursor: pointer;
        border-radius:10px;
        border:solid #0a7deb 1px;
        padding:6px;
        display:none;
        z-index:99;
        }
        #msg-box{
        transition:all 0.5s ease-in-out;
        font-size:15px;
        position:fixed;
        right:30px;
        top:10px;
        background: #0a7deb;
        color:white;
        border-radius:7px;
        padding:10px;
        opacity:0;
        z-index:99;
        box-shadow:#0a7deb 2px 2px 6px, #0a7deb 6px 6px 19px;
        }
        #msg-box.showing{
        opacity:1;
        top:130px;
        }
        #msg-box.err{
        background:red;
        box-shadow:red 2px 2px 6px, red 6px 6px 19px;
        opacity:1;
        top:130px;
        }
        `);
    }
})();