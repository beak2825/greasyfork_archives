// ==UserScript==
// @name         度盘给我播！
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  强迫度盘打开 ts mts f4v m2ts等视频文件的播放页面。
// @author       coolwind2012
// @match        http*://pan.baidu.com/disk/home*
// @exclude      http*://pan.baidu.com/disk/home*search*
// @icon         https://pan.baidu.com/box-static/disk-system/images/favicon.ico
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/33039/%E5%BA%A6%E7%9B%98%E7%BB%99%E6%88%91%E6%92%AD%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/33039/%E5%BA%A6%E7%9B%98%E7%BB%99%E6%88%91%E6%92%AD%EF%BC%81.meta.js
// ==/UserScript==
let myPath;
(function () {
    const timer = setInterval(() => {
        if (document.querySelector(".vdAfKMb")) {
            work();
            clearInterval(timer);
        }
    }, 200);
    window.addEventListener("hashchange", afterHashChanged, false);
    afterHashChanged();
})()

function afterHashChanged() {
    // https://pan.baidu.com/disk/home#list/path=%2F&vmode=list
    if (location.href.indexOf('/disk/home') !== -1) {
        myPath = location.href.split('path=')[1].split('&')[0];
    }
    myPath += (decodeURIComponent(myPath).slice(-1) === '/') ? '' : '%2F';
}

function work() {
    'use strict';
    const mediaType = new Array('ts', '3gp2', '3g2', '3gpp', 'amv', 'divx', 'dpg', 'f4v', 'm2t', 'm2ts', 'm2v', 'mpe', 'mpeg', 'mts', 'vob', 'webm', 'wxp', 'wxv');
    init();

    // 小图标的变化与处理
    //启动检测：          修改动作          监测对象与配置
    new MutationObserver(listChange).observe(document.querySelector('.vdAfKMb'), {
        attributes: false,
        childList: true,
        subtree: false
    });

    new MutationObserver(listChange).observe(document.querySelector('.JKvHJMb'), {
        attributes: false,
        childList: true,
        subtree: false
    });

    function init() {
        updateItem(document.querySelectorAll('.vdAfKMb>dd'));
    }

    function listChange(mutationList) {
        updateItem(mutationList[0].addedNodes);
    }

    function isMedia(str) {
        str = str.toLowerCase();
        str = str.split('.').pop();
        return mediaType.includes(str);
    }

    function updateItem(itemList) {
        const itemQueryStr = document.querySelector('.fyQgAEb').style.display == 'none'? '.text a':'.file-name a';  // :not(.open-enable)
        if(itemQueryStr == '.file-name a'){
            let tmp = [];
            itemList.forEach(item =>{
                for(let i=0;i<item.children.length;i++){
                    tmp.push(item.children[i]);
                }
            })
            itemList = tmp;
        }
        itemList.forEach(item => {
            const aEle = item.querySelector(itemQueryStr);
            const suffix = aEle.title.split('.').pop();
            if (isMedia(suffix) && aEle.href === 'javascript:void(0);') {
                aEle.onclick = ()=>{
                    window.open('https://pan.baidu.com/play/video#video/path=' + myPath + encodeURIComponent(aEle.title));
                };
                aEle.href = '';
                aEle.target = '_blank_';
                item.querySelector('.twwJWy').className = 'twwJWy fileicon-sys-s-video';
            }
        });
    }
}
