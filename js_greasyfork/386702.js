// ==UserScript==
// @name         Joker YKT video downloader
// @namespace    http://joker.ykt.com/
// @version      0.1
// @description  This script downloads video from joker.ykt.ru
// @author       Kenya-West
// @match        http*://joker.ykt.ru/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386702/Joker%20YKT%20video%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/386702/Joker%20YKT%20video%20downloader.meta.js
// ==/UserScript==

window.onload = () => {
    getVideoURLs();
}

function getVideoURLs() {
    let linkId = document.querySelector(".vjs-poster").style.backgroundImage;
    linkId = /(media\.ykt\.ru.*)\/preview\/preview/gi.exec(linkId)[1];

    const linkArray = new Array();

    document.querySelectorAll(".vjs-res-button .vjs-menu .vjs-menu-item").forEach(
        (element => {
            linkArray.push(
                { link: "https://" + linkId + "/file/" + element.innerText + ".mp4", caption: element.innerText }
            );
        })
    );

    linkArray.forEach(link => {
        const downloadLink = document.createElement("a");
        downloadLink.href = link.link;
        downloadLink.innerText = "Скачать " + link.caption;
        downloadLink.style.margin = "5px 2px";
        document.querySelector(".newstitle").appendChild(downloadLink);
    })
}
