// ==UserScript==
// @name                name
// @name:zh-TW          圖片連結測試
// @description         description
// @description:zh-TW   將太短的圖片網址取代成長的
// @match               https://*.mymoe.moe/*
// @author              gginin
// @grant               none
// @version 0.0.1.20170507164337
// @namespace https://greasyfork.org/users/3746
// @downloadURL https://update.greasyfork.org/scripts/29554/name.user.js
// @updateURL https://update.greasyfork.org/scripts/29554/name.meta.js
// ==/UserScript==

var images = document.getElementsByClassName("img_src");
for ( var i = 0;i < images.length; i++) {
    var image = images[i].querySelector("img");
    if (image.src.length < 30) {
        var a = document.createElement('a');
        a.href = image.title;
        a.target = "_blank";
        a.style="BORDER-right:#f00 10px solid;";
        a.appendChild(image);
        image.src = image.alt;
        image.style.width = "auto";
        image.style.height = "auto";
        images[i].appendChild(a);
    }
}