// ==UserScript==
// @name         u-d-l视频下载下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  u-d-l网站视频下载
// @author       Fatal
// @match        https://u-d-l.com/*
// @run-at       document-end
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459430/u-d-l%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/459430/u-d-l%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let time = setTimeout(()=>{
            let vmlist = document.querySelectorAll('video');
            //console.log("=============111vmlist = ", vmlist);
            for(let i = 0; i < vmlist.length; i++){
                //console.log(vmlist[i]);
                let video = vmlist[i];
                //let video = vmlist[i].querySelector('video');
                let url = video.src;
                let btn = document.createElement("button");
                btn.id = "downloadbtn";
                btn.innerHTML = "下载视频";
                console.log(vmlist[i].currentSrc)
                // 在视频节点前插入按钮
                vmlist[i].parentElement.parentElement.insertBefore(btn, vmlist[i].parentElement);
                btn.style.border='none';
                btn.style.background='#4e6ef2';
                btn.style.color="#fff";
                btn.style.fontFamily="Arial,sans-serif";
                btn.style.fontSize=18+"px";
                btn.style.padding=10+"px";
                btn.style.marginBottom=10+"px";
                btn.onclick = function() {
                    console.log("url = " + url);
                    GM_download(url,"重命名这个视频"+'.mp4');
                }
            }
            clearInterval(time);
        }, 1000);
})();

// 从子节点向上遍历最近的一个符合条件的父节点
function getParent(max) {
    let index = 0;
    let maxCheck = (max && max > 0) ? max : 100;

    function getP(child, fn) {
        index++;
        if (index >= maxCheck) {
            return null;
        }
        let parentNode = child.parentNode;
        if (parentNode) {
            if (fn(parentNode)) {
                return parentNode
            } else {
                return getP(parentNode, fn);
            }
        }
    }
    return getP
}