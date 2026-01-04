// ==UserScript==
// @name        v2ex回复排序 (兼容 V2EX Pro)
// @namespace   cljnnn@gmail.com
// @include     http*://*v2ex.com/t/*
// @description:en sort v2ex replies by star❤️
// @description:zh-CN v2ex回复按照❤️排序，如果你不想花太多时间在v2ex上，但又不想错过重要信息，你可能需要这个。兼容 V2EX Pro
// @version     1.1.5
// @description sort v2ex replies by star❤️, compatible with V2EX Pro
// @downloadURL https://update.greasyfork.org/scripts/34198/v2ex%E5%9B%9E%E5%A4%8D%E6%8E%92%E5%BA%8F%20%28%E5%85%BC%E5%AE%B9%20V2EX%20Pro%29.user.js
// @updateURL https://update.greasyfork.org/scripts/34198/v2ex%E5%9B%9E%E5%A4%8D%E6%8E%92%E5%BA%8F%20%28%E5%85%BC%E5%AE%B9%20V2EX%20Pro%29.meta.js
// ==/UserScript==

// green poster
let posterName = document.querySelector("small.gray a").textContent;
for (let author of document.querySelectorAll("strong a.dark")) {
    if (author.textContent.includes(posterName)) {
        author.style.color = "green";
    }
}

// blue link
for (let link of document.querySelectorAll("a[rel~='nofollow']")) {
    link.style.color = "blue";
}

// sort likes, compatible with V2EX Pro
let thread = document.querySelector("#Main > div.box:nth-child(4)");
let replies = thread.querySelectorAll(":scope > div.cell[id]");

let replyArray = [];
for (let reply of replies) {
    replyArray.push(reply);
}

let countLike = function (reply) {
    let count = 0;
    let likes = reply.querySelectorAll("span.small")
    for (let like of likes) {
        count += parseInt(like.textContent);
    }
    return count;
}
replyArray.sort(function (x, y) {
    return countLike(y) - countLike(x);
})
for (let reply of replyArray) {
    thread.appendChild(reply);
}

// handle page rows
let pageRows = thread.querySelectorAll("div.cell.ps_container");
if (pageRows.length > 0) {
    thread.appendChild(pageRows[pageRows.length - 1]);
}
