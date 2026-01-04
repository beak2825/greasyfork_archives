// ==UserScript==
// @name         GetDoubanBook
// @namespace    https://www.ihtmlcss.com/
// @version      2024-11-30
// @description  【自用】获取豆瓣书籍和电影JSON数据到剪贴板
// @author       You
// @match        https://*.douban.com/subject/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519342/GetDoubanBook.user.js
// @updateURL https://update.greasyfork.org/scripts/519342/GetDoubanBook.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $searchBtn = document.createElement("button");
    $searchBtn.innerText = "Get info";
    $searchBtn.style.position = "fixed";
    $searchBtn.style.zIndex = 999;
    $searchBtn.style.bottom = "20px";
    $searchBtn.style.right = "20px";
    document.body.appendChild($searchBtn);

    $searchBtn.onclick = function() {
        const movie = window.location.href.includes("movie");
        const book = window.location.href.includes("book");

        let typeName = "";
        if (movie) typeName = "movie";
        if (book) typeName = "book";
        switch(typeName) {
            case "book": {
                const name = document.querySelector('[property="v:itemreviewed"]')?.innerText;
                const thumb = "https://images.weserv.nl/?url=http" + document.querySelector("#mainpic a.nbg img").src.replace("https", "");
                const link = window.location.href;
                const description = document.querySelector("#info span a")?.innerText || document.querySelector("#authors ul li a")?.title;
                const comment = "-";
                const add_time = document.querySelector("#interest_sect_level span.color_gray")?.innerText;
                const score = document.querySelector("#n_rating")?.value;
                const type = 1;
                const show = 1;
                const obj = {name,thumb,link,description, comment, add_time, score, type, show};
                console.log("obj", obj);
                navigator.clipboard.writeText(`[${JSON.stringify(obj, null, 4)}]`);
                break;
            }
            case "movie": {
                const name = document.querySelector('[property="v:itemreviewed"]')?.innerText;
                const thumb = "https://images.weserv.nl/?url=http" + document.querySelector("#mainpic a.nbgnbg img").src.replace("https", "");
                const link = window.location.href;
                const description = document.querySelector('[property="v:initialReleaseDate"]')?.innerText;
                const comment = "-";
                const add_time = document.querySelector(".collection_date")?.innerText;
                const score = document.querySelector("#n_rating")?.value;
                const type = 2;
                const show = 1;
                const obj = {name,thumb,link,description, comment, add_time, score, type, show};
                console.log("obj", obj);
                navigator.clipboard.writeText(`[${JSON.stringify(obj, null, 4)}]`);
                break;
            }
            default: {
                return;
            }
        }


    }
})();