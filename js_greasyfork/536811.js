// ==UserScript==
// @name         目录高度优化（掘金、CSDN、B站）
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  CSDN、掘金网站文章的目录、B站合集列表展示的高度，都太小了，现予以增加。
// @author       interest2
// @match        https://juejin.cn/*
// @match        https://blog.csdn.net/*
// @match        https://www.bilibili.com/*
// @match        https://www.javaboy.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&JUEJIN_DOMain=juejin.cn
// @grant         GM_addStyle
// @license       GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/536811/%E7%9B%AE%E5%BD%95%E9%AB%98%E5%BA%A6%E4%BC%98%E5%8C%96%EF%BC%88%E6%8E%98%E9%87%91%E3%80%81CSDN%E3%80%81B%E7%AB%99%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536811/%E7%9B%AE%E5%BD%95%E9%AB%98%E5%BA%A6%E4%BC%98%E5%8C%96%EF%BC%88%E6%8E%98%E9%87%91%E3%80%81CSDN%E3%80%81B%E7%AB%99%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("my script start");

    let site = "";
    let url = window.location.href;

    const JUEJIN = 0;
    const CSDN = 1;
    const BILI = 2;
    const JAVABOY = 3;

    const keywords = {
        "juejin": JUEJIN,
        "csdn": CSDN,
        "bilibili": BILI,
        "javaboy": JAVABOY
    };
    // 根据当前网址关键词，设置site值
    for (const keyword in keywords) {
        if (url.indexOf(keyword) > -1) {
            site = keywords[keyword];
            break;
        }
    }

    // 定义CSS变量
    const CSS_VARS = {
        toolTable: `
            position: fixed;
            z-index: 999;
        `,
        sidebar: `
            position: absolute;
            z-index: 999;
        `
    };

    let biliPlaylist = "#mirror-vdcon > div.right-container > div > div.rcmd-tab > div.video-pod.video-pod > div.video-pod__body";

    const JUEJIN_DOM = {
        top: document.querySelector("#juejin > div:nth-child(1) > div > header"),
        main: document.querySelector("#juejin > div:nth-child(1) > div > main > div"),
        article: document.querySelector("#juejin > div:nth-child(1) > div > main > div > div.main-area.article-area"),
        side: document.querySelector("#sidebar-container"),
        table: document.querySelector("#sidebar-container > div:nth-child(2) > nav"),
        content: document.querySelector("#sidebar-container > div:nth-child(2) > nav > div.catalog-body.unfold")
    };
    const CSDN_DOM = {
        directory: document.querySelector("#asidedirectory"),
        directory2: document.querySelector("#groupfile"),
        content: document.querySelector("#align-items-stretch")
    };

    let windowHeight = window.innerHeight - 100 + "px";
    console.log(windowHeight);

    setTimeout(startUp, 1000);
    setInterval(monitor, 500);

    function startUp(){
        if(site === JUEJIN){
            if(isEmpty(JUEJIN_DOM.article)){
                return;
            }
            juejinStartup();
            juejinRealtime();
        }else if(site === CSDN){
            csdn();
        }else if(site === BILI){
            bilibili();
        }else if(site === JAVABOY){
            javaboy();
        }
    }

    function monitor(){
        if(site === JUEJIN){
            if(isEmpty(JUEJIN_DOM.article)){
                return;
            }
            juejinRealtime();
        }else if(site === CSDN){
            csdn();
        }else if(site === BILI){
            bilibili();
        }else if(site === JAVABOY){
            javaboy();
        }
    }

    function csdn(){
        let expectHeight = window.innerHeight - 90;
        let dir = CSDN_DOM.directory;
        let dir2 = CSDN_DOM.directory2;
        if(!isEmpty(dir2)){
            dir2.style.display = "none";
        }
        dir.style.display = "block";
        dir.style.top = "48px";
        dir.style.position = "fixed";
        dir.style.zIndex = "9999";
        dir.style.height = expectHeight + "px";
        CSDN_DOM.content.style.maxHeight = expectHeight + "px";
    }
    function javaboy(){
        let columnRIght = document.getElementsByClassName("column-right");
        let columnMain = document.getElementsByClassName("column-main");
        if(columnRIght.length > 0){
            columnRIght[0].remove();
        }
        if(columnMain.length > 0){
            columnMain[0].style.width="70%";
        }
    }

    function juejinStartup(){
        // 将文章主体往右挪
        JUEJIN_DOM.main.style.left = "100px";
        JUEJIN_DOM.side.style.cssText = CSS_VARS.sidebar;

        // 将侧边栏往右挪
        let sideLeft = JUEJIN_DOM.side.clientWidth + 100;
        JUEJIN_DOM.side.style.left = "-" + sideLeft + "px";

        JUEJIN_DOM.table.classList.add("tool-table");
        JUEJIN_DOM.table.style.maxHeight = windowHeight;
        JUEJIN_DOM.content.style.maxHeight = windowHeight;
    }

    function juejinRealtime(){
        // 测量文章主体的右边缘，加个几十px的空隙，就是目录的左边缘；目录上边缘类似
        let tableLeft = 30 + JUEJIN_DOM.article.getBoundingClientRect().right;
        let tableTop = 20 + JUEJIN_DOM.top.getBoundingClientRect().bottom;
        JUEJIN_DOM.table.style.left = tableLeft + "px";
        JUEJIN_DOM.table.style.top = tableTop + "px";
    }

    function bilibili(){
        let playlist = document.querySelector(biliPlaylist);
        if(!isEmpty(playlist)){
            const pageHeight = window.innerHeight;
            console.log("网页高度:", pageHeight);
            let top = playlist.getBoundingClientRect().top;

            playlist.style.maxHeight = pageHeight - top - 80 + "px";
            console.log(pageHeight, top);
        }
    }

    function addCustomStyles() {
        var css = `
        .tool-table {
           ${CSS_VARS.toolTable}
        }
        `;
        GM_addStyle(css);
    }
    addCustomStyles();

    function isEmpty(item){
        if(item===null || item===undefined || item.length===0){
            return true;
        }else{
            return false;
        }
    }
})();