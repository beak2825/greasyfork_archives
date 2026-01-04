// ==UserScript==
// @name         IMDb2RARBG
// @namespace    https://mogeko.me
// @version      0.1.1
// @description  Add direct links to RARBG & TPB from IMDb(.cn)
// @author       Mogeko
// @supportURL   https://github.com/Mogeko/userscript-imdb2rarbg/issues
// @match        https://www.imdb.cn/title/*
// @icon         https://cdn.imdb.cn/static/assets/img/imdb.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/427156/IMDb2RARBG.user.js
// @updateURL https://update.greasyfork.org/scripts/427156/IMDb2RARBG.meta.js
// ==/UserScript==

const IMDB = document.location.toString().split("/")[4];
const SITE_DATA = [
    ["RARBG", "https://rarbgmirror.com/torrents.php?imdb="],
    ["TPB", "https://thepiratebay.org/search.php?q="]
];

(function() {
    'use strict';
    const infoNode = document.querySelector(".txt_bottom");
    const itemNode = document.createElement("div");
    const l_Node = document.createElement("div");
    const r_Node = document.createElement("div");

    itemNode.className = "txt_bottom_item";
    l_Node.className = "txt_bottom_l";
    r_Node.className = "txt_bottom_r txt_bottom_r_overflow";

    l_Node.innerHTML = "资源：";
    SITE_DATA.map(site => {
        const link = document.createElement("a");
        link.textContent = site[0];
        link.href = site[1] + IMDB;
        link.target="_blank";
        return link;
    }).forEach((node, index, array) => {
        r_Node.appendChild(node);
        if (index !== array.length - 1) {
            r_Node.innerHTML += " / ";
        }
    });

    itemNode.appendChild(l_Node);
    itemNode.appendChild(r_Node);
    infoNode.appendChild(itemNode);
})();
