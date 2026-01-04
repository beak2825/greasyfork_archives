// ==UserScript==
// @name         Fuck BiliBili Mobile H5 Open APP
// @namespace    http://tampermonkey.net/
// @version      0.33
// @description  使B站移动版浏览器H5点击视频在浏览器内直接跳转
// @author       plastic_world
// @match        https://m.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      WTFNMFPL
// @downloadURL https://update.greasyfork.org/scripts/451055/Fuck%20BiliBili%20Mobile%20H5%20Open%20APP.user.js
// @updateURL https://update.greasyfork.org/scripts/451055/Fuck%20BiliBili%20Mobile%20H5%20Open%20APP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const pathname = window.location.pathname;
    document.querySelectorAll('.openapp-dialog').forEach((i)=>i.remove())
    document.querySelectorAll('.m-video2-awaken-btn').forEach((i)=>i.remove())
    document.querySelectorAll('.m-nav-openapp').forEach((i)=>i.remove())
    document.querySelectorAll('.open-app').forEach((i)=>i.remove())
    if(pathname.indexOf("/video") === 0){
        document.querySelectorAll(".v-card-toapp>a").forEach((a)=>{
            a.parentNode.addEventListener(
                "click",
                event => event.stopImmediatePropagation(),
                true
            )
            a.setAttribute("href","/video/av" + a.parentNode.dataset.aid)})
        let observer = new MutationObserver(
            (mutationRecords) => {
                mutationRecords.forEach((record)=>{
                    let a = record.addedNodes[0].querySelector(".v-card-toapp>a")
                    a.addEventListener(
                        "click",
                        event => event.stopImmediatePropagation(),
                        true
                    )
                    a.setAttribute("href","/video/av" + a.parentNode.dataset.aid)
                    a.querySelectorAll('.open-app').forEach((i)=>i.remove())})
            })


        let list = document.querySelector(".card-box")
        observer.observe(list, {
            childList: true,
        });
    }
    else if(pathname.indexOf("/space") === 0){
        let observer = new MutationObserver(
            (mutationRecords) => {
                mutationRecords.forEach((record)=>{
                    let elevideo = record.addedNodes[0].querySelector(".wings[id]")
                    elevideo.addEventListener(
                        "click",
                        event => event.stopImmediatePropagation(),
                        true
                    )
                    var elem = document.createElement('a')
                    elem.setAttribute("href","/video/av" + elevideo.id)
                    elevideo.parentNode.replaceChild(elem, elevideo)
                    elem.appendChild(elevideo)
                })
            }
        );
        let list = document.querySelector("ul.list")
        observer.observe(list, {
            childList: true,
        });
    }
})();