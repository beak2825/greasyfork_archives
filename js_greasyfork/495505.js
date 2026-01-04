// ==UserScript==
// @name         m-team 大图预览
// @namespace    mteam
// @version      0.0.11
// @description  种子列表/详情/演员列表 大图预览，适配 2025 新版界面。
// @author       XMXM
// @license      MIT
// @match        https://*.m-team.cc/*

// @downloadURL https://update.greasyfork.org/scripts/495505/m-team%20%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/495505/m-team%20%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    "use strict";
    let domain = window.location.hostname;
    if (domain == "next.m-team.cc" || domain == "kp.m-team.cc") {
        nextSite();
    } else {
        oldSite();
    }
})();

function nextSite() {
        let s = document.createElement("style");
        s.innerHTML=".torrent-list__thumbnail{width: 100% !important;height: auto !important;} tbody>tr>td>div>.ant-image{width:50%;}"
        document.querySelector("html>head").appendChild(s);
}

function oldSite() {
     let dmm_check_count = 0;

    function dmm(){
        dmm_check_count++

        if (dmm_check_count > 60) {
            return
        }

        let s = document.createElement("style");
        s.innerHTML=".mx-auto table thead tr th:nth-of-type(2){width: auto !important;}"
        document.querySelector("html>head").appendChild(s);
        let s1 = document.createElement("style");
        s1.innerHTML=".ant-image .torrent-list__thumbnail{height: auto !important;}"
        document.querySelector("html>head").appendChild(s1);
        let s2 = document.createElement("style");
        s2.innerHTML=".mx-auto table colgroup col:nth-of-type(2){width: 35vw !important;}"
        document.querySelector("html>head").appendChild(s2);

        let dmm_right_box = document.querySelector('.duration-300');
        if (!dmm_right_box){
            setTimeout(dmm, 1000);
        }
        let dmm_box = dmm_right_box.querySelector('img[src^="https://pics.dmm.co.jp/digital/video/"]').parentElement.parentElement.parentElement;
        dmm_box.classList.remove('grid');
        let dmm_imgs = dmm_box.querySelectorAll('img[src^="https://pics.dmm.co.jp/digital/video/"]');
        const pattern = /https:\/\/pics\.dmm\.co\.jp\/digital\/video\/(\w+)\/(\w+)-(\d+)\.jpg/;
        dmm_imgs.forEach((item) => {
            item.src = item.src.replace(pattern, 'https://pics.dmm.co.jp/digital/video/$1/$2jp-$3.jpg')
        })
    }

    setTimeout(dmm, 500);
}