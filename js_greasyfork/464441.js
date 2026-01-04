// ==UserScript==
// @name         DMHY Multiselector
// @name:zh-TW   DMHY多選/一鍵全選/反選磁力鏈接
// @name:zh-CN   DMHY多选/一键全选/反选磁力链接
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  DMHY Multiselect and copy magnet-links to clipboard
// @description:zh-tw  DMHY多選/一鍵全選/反選磁力鏈接並複製到剪貼板以便到qBittorrent一鍵下載
// @description:zh-CN  DMHY多选/一键全选/反选磁力链接并复制到剪贴板以便到qBittorrent一键下载
// @author       Kai
// @match        *://share.dmhy.org/*
// @icon         https://share.dmhy.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464441/DMHY%20Multiselector.user.js
// @updateURL https://update.greasyfork.org/scripts/464441/DMHY%20Multiselector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const extract = () => {
        let checked = document.querySelectorAll("input.dl-cb:checked")
        const arrows = document.querySelectorAll("a.download-arrow, a.arrow-magnet")
        console.log("Extracted.");
        let res = "";
        for (let i = 0; i < checked.length; i++){
            res += arrows[+checked[i].name].href + "\n"
        }
        navigator.clipboard.writeText(res);
    };

    const toggleCB = () => {
        const CB = document.querySelectorAll(".dl-cb")
        for ( let i = 0; i < CB.length; i++) {
            CB[i].click();
        }
    }

    const arrows = document.querySelectorAll("a.download-arrow, a.arrow-magnet")
    const title = document.querySelectorAll("span.title")[3];

    const copy_btn = document.createElement("button");
    copy_btn.innerHTML = "EXT";
    copy_btn.addEventListener("click", extract);
    const selectAll_CB = document.createElement("input");
    selectAll_CB.type = "checkbox";
    selectAll_CB.name = "all";
    selectAll_CB.addEventListener("click",toggleCB);

    title.before(selectAll_CB);
    title.style.marginLeft = "1rem";
    title.after(copy_btn);
    copy_btn.style.display = "block";
    copy_btn.style.margin = ".2rem auto";
    copy_btn.style.padding = "0 1rem";

    console.log(
    "title", title.innerHTML, "\n",
    );

    for (let i = 0; i < arrows.length; i++){
        let box = document.createElement("input");
        box.type = "checkbox";
        box.className = "dl-cb"
        box.name = i;

        arrows[i].before(box);
        arrows[i].style.marginLeft = "1rem";
    }

    console.log("DONE.");


})();