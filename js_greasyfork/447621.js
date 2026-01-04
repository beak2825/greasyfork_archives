// ==UserScript==
// @name         公众号视频下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  公众号视频上方出现一个跳转可下载地址的按钮,点击即可下载。小程序和腾讯视频暂时不支持下载。
// @author       Fatal
// @match        https://mp.weixin.qq.com/*
// @run-at       document-end
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447621/%E5%85%AC%E4%BC%97%E5%8F%B7%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/447621/%E5%85%AC%E4%BC%97%E5%8F%B7%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let time = setTimeout(()=>{
            let vmlist = document.querySelectorAll('[data-vw]');
            console.log("=============111vmlist = ", vmlist);
            for(let i = 0; i < vmlist.length; i++){
                let video = vmlist[i].querySelector('video');
                let url = video.src;
                let btn = document.createElement("button");
                btn.id = "downloadbtn";
                btn.innerHTML = "下载视频";
                // 在视频节点前插入按钮
                vmlist[i].parentElement.insertBefore(btn, vmlist[i]);
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