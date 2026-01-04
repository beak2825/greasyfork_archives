// ==UserScript==
// @name         Pornpics viewer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Optimize picture display on pornpics.com
// @author       leitures
// @match        https://www.pornpics.com/galleries/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornpics.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478649/Pornpics%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/478649/Pornpics%20viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let links = Array.from(
        document.getElementById("tiles").getElementsByClassName("rel-link")
    ).map((tag) => {
        return tag.href
    })

    var tilesDiv = document.getElementById("tiles");
    if (tilesDiv) {
        tilesDiv.style.display = "none";
    }

    var mainDiv = document.getElementById("main");
    if (mainDiv) {
      for (var i = 0; i < links.length; i++) {
        var img = document.createElement("img");
        img.src = links[i];
        img.style.display = "block"; // 设置图片为块级元素
        img.style.margin = "0 auto"; // 水平居中
        mainDiv.appendChild(img);
      }

    } else {
      console.error("Element with ID 'main' not found.");
    }

})();