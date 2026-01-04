// ==UserScript==
// @name         Replace Links with Images on 1337x.to
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace specified links with images on 1337x.to
// @author       Wei Zong
// @match        *://1337x.to/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503157/Replace%20Links%20with%20Images%20on%201337xto.user.js
// @updateURL https://update.greasyfork.org/scripts/503157/Replace%20Links%20with%20Images%20on%201337xto.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 获取所有的a标签
    const links = document.querySelectorAll("a.js-modal-url");
    links.forEach((link) => {
        const href = link.href;

        // 检查链接是否匹配格式
        const urlMatch = href.match(
            /https:\/\/([^\/]+)\/[a-z]-1\/(\d{4}\/\d{2}\/\d{2}\/[a-z0-9]+)\.jpeg\.html/
        );
        if (urlMatch) {
            const domain = urlMatch[1];
            const path = urlMatch[2];
            const imgSrc = `https://${domain}/1/${path}.jpeg`;
            const imgElement = document.createElement("img");
            imgElement.src = imgSrc;
            imgElement.dataset.original = imgSrc;
            imgElement.classList.add("img-responsive", "descrimg", "lazy");
            imgElement.style.display = "block";

            link.parentNode.replaceChild(imgElement, link);
        }
    });

    // 获取所有的img标签
    const imgs = document.querySelectorAll("img");
    // 替换 /1s/ 为 /1/
    const replaceUrl1 = (url) =>
        url.replace("/1s/", "/1/");
    // 替换 .th.jpg 为 .jpg
    const replaceUrl2 = (url) => url.replace(".th.jpg", ".jpg");
    // 替换 .md.jpg 为 .jpg
    const replaceUrl3 = (url) => url.replace(".md.jpg", ".jpg");

    imgs.forEach((img) => {
        if (img.src.includes("/1s/")) {
            img.src = replaceUrl1(img.src);
        }
        if (
            img.dataset.original &&
            img.dataset.original.includes("/1s/")
        ) {
            img.dataset.original = replaceUrl1(img.dataset.original);
        }
        if (img.src.includes(".th.jpg")) {
            img.src = replaceUrl2(img.src);
        }
        if (img.dataset.original && img.dataset.original.includes(".th.jpg")) {
            img.dataset.original = replaceUrl2(img.dataset.original);
        }
        if (img.src.includes(".md.jpg")) {
            img.src = replaceUrl3(img.src);
        }
        if (img.dataset.original && img.dataset.original.includes(".md.jpg")) {
            img.dataset.original = replaceUrl3(img.dataset.original);
        }
    });
})();
