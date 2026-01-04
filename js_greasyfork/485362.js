// ==UserScript==
// @name         FANZA FREE高画質化
// @namespace    http://tampermonkey.net/
// @version      2024-01-21
// @description  インターネットカフェでみられるFANZA FREEのlist表示時に、サムネ画像を高画質化します。また、カーソルホバー時に複数のサムネイルを表示します。
// @author       palsystem
// @match        https://ip1.dmm.co.jp/list.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dmm.co.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485362/FANZA%20FREE%E9%AB%98%E7%94%BB%E8%B3%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/485362/FANZA%20FREE%E9%AB%98%E7%94%BB%E8%B3%AA%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    document.body.insertAdjacentHTML("afterBegin", `
    <style>
    #fanza-extension-layer{
        display: none;
        background: #ddd;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        gap: 5px;
        padding: 10px;
        flex-wrap: wrap;
        justify-content: start;
        padding-bottom: 1000px;
    }
    .fanza-extension-images{
        height: 150px;
        width: auto;
    }
    </style>
    <div id="fanza-extension-layer">
    </div>
    `);
    const layer= document.getElementById("fanza-extension-layer");
    document.querySelectorAll("#wrapper > table > tbody > tr > td > .listunit > dl > dt > a > img").forEach(img => {
        const src = img.src.replace("pt.jpg","ps.jpg");
        img.src = src;
        img.parentNode.parentNode.parentNode.addEventListener("mouseover", (event) => {
            let images = "";
            images += `<img src="${src.replace("ps.jpg","pl.jpg" )}" class="fanza-extension-images" style="height: 200px;" />`;
            for(let i=0; i<10; i++){
                images += `<img src="${src.replace("ps.jpg","jp-" ) + (i+1)}.jpg" class="fanza-extension-images" />`;
            }
            layer.innerHTML = images;
            layer.style.top = (img.getBoundingClientRect().top + 208)+ "px";
            layer.style.display = "flex";
            img.parentNode.parentNode.parentNode.style.border = "1px solid #f00";
        });
        img.parentNode.parentNode.parentNode.addEventListener("mouseleave", (event) => {
            layer.style.display = "none";
            img.parentNode.parentNode.parentNode.style.border = "none";
        });

    });
})();