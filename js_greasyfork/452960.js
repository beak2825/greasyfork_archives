// ==UserScript==
// @name:zh-CN   Youtube社区点击图片查看全图
// @name         Youtube community post click to view full size image
// @homepage     https://greasyfork.org/en/scripts/452960-youtube-community-post-click-to-view-full-size-image
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description:zh-CN  点击图片查看全图
// @description  Youtube community click post image to view full size image.
// @author       CZX Fuckerman
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/452960/Youtube%20community%20post%20click%20to%20view%20full%20size%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/452960/Youtube%20community%20post%20click%20to%20view%20full%20size%20image.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    function createObserver(){
        if(window.location.href.match(/^https:\/\/www.youtube.com\/channel\/.*\/community\?lb=.*$/g) != null || window.location.href.match(/^https:\/\/www.youtube.com\/post\/.*$/g) != null){
            let observer = new MutationObserver(function(mutations, observer) {
                let disconn = false;
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node){
                        if(node.nodeName == "DIV" && node.id == "image-container" && node.classList.contains("style-scope") && node.classList.contains("ytd-backstage-image-renderer") && node.classList.length == 2){
                            node.addEventListener('click',()=>{
                                let src = node.querySelector("img").getAttribute("src");
                                let sEqindex = src.search(/[=][s][1-9]\d*/g);
                                let sEqMatch = src.match(/[=][s][1-9]\d*/g);
                                if(sEqMatch.length == 0){
                                    window.open(src.substring(0,src.indexOf("=")));
                                } else {
                                    window.open(src.substring(0,sEqindex + sEqMatch[0].length));
                                }
                            });
                            node.style.cursor = "pointer";
                            disconn = true;
                        }
                    });
                });
                if(disconn){
                    observer.disconnect();
                    removeObserver();
                }
            });
            observer.observe(document, {
                childList: true,
                subtree: true
            })
            GM_setValue("observer", observer);
        }
    }

    function removeObserver(){
        let observer = GM_getValue("observer");
        if(observer != null){
            if(observer instanceof MutationObserver){
                observer.disconnect();
            }
            GM_deleteValue("observer");
        }
    }

    createObserver();

    document.addEventListener('yt-navigate-start',()=>{
        createObserver();
    });
    document.addEventListener('yt-navigate-start',()=>{
        createObserver();
    });
    window.addEventListener('beforeunload',()=>{
        createObserver();
    });


})();