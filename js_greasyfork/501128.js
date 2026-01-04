// ==UserScript==
// @license      GNU GPLv3
// @name         辅助音乐下载
// @connect http://music.2t58.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  辅助下载音乐
// @author       wangkangsheng
// @match        http://music.2t58.com/song/**
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/501128/%E8%BE%85%E5%8A%A9%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/501128/%E8%BE%85%E5%8A%A9%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function createOperateMenu(){
        let element = document.createElement("div");
        element.setAttribute("id","spc_el")
        element.setAttribute("style","position: absolute;top: 30px;right: 30px;width: 100px;height: 80px;background:#dedede;border: 1px solid #dc2F1F")

        document.querySelector("html body").append(element)

        return element
    }

    function queryName(){
        let element = document.querySelector("#jp_container_1 .jp_right .djname h1");
        let name = element.textContent;
        name = name.substring(0,name.length-4)
        return name
    }

    function queryDownloadUrl(){
        let element = document.querySelector("#player #jp_audio_0");
        return element?.getAttribute("src")
    }

    function checkPlayerUrl(retry=0) {
        setTimeout(()=>{
            let url = queryDownloadUrl(retry++);
            if (retry >= 20){
                alert("下载查询失败.脚本提示")
                return
            }
            if (!url){
                checkPlayerUrl()
            }else {
                let name = queryName();
                createDownloadBtn(url,name)
                console.log("创建下载按钮")
            }
        },200)
    }

    let menu = createOperateMenu();

    function createDownloadBtn(url,name) {
        let downloadBtn = document.createElement("a");
        downloadBtn.download = name
        downloadBtn.href = url
        downloadBtn.setAttribute("style","width:60px;height:38px;background:#00a7ff")
        downloadBtn.innerText = "下载音乐"
        downloadBtn.onclick = function (){
            GM_setClipboard(name,"text")
        }
        menu.append(downloadBtn)
    }

    checkPlayerUrl(0)
})();
