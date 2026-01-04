// ==UserScript==
// @name         Instagram Downloader
// @namespace    https://github.com/NabiKAZ/instagram-downloader
// @version      0.2
// @license      GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @description  Instagram Media Downloader For Web Version
// @author       Nabi K.A.Z. <nabikaz@gmail.com>
// @match        https://www.instagram.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37214/Instagram%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/37214/Instagram%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var existCondition = setInterval(function() {
        var url = get_url();
        if (url) {
            var container = document.getElementsByTagName("header");
            var tag_a = document.createElement("a");
            tag_a.id = 'instagram_downloader_link';
            tag_a.href = url;
            tag_a.style.marginRight = "30px";
            tag_a.onmousemove = function() {
                this.href = get_url();
            };
            var tag_img = document.createElement("img");
            tag_img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABuUlEQVRYhe3WO2jVUBzH8Y/XFwq+qoJD6wtxErQ4OIgI4uZYBScXl7qIBRed3J3FQdChY11VBAXByUHBB4iIiotQxfpAHby1cUgOXGJyc5LmurQ/+EMe5////pKcc/5hUQtdSxvkbMAq/EbSrp1iLccZPMRsBk3wFTdxeJDwPXjZAy2LSaxtG34Q3yPgIZ5jc1vwEXyqAQ9xuy0DNxrAQ4xhHPfxBndxrA58I7rzMDBbcG0OZ2MNnKwAfMEh7M/iaKThLnbFGLhYUehVQc63CAMJzucTOwXF1sW4bKh/aucNHMepARp40c/AZUxhy4DgXUyX3RwXP8vnMwcSPMLukLgEq/Eem0rMfcAV/MnOZ3AtN+YcVmbHKzAhbVpl+owjeAanKxy/riiW1wg+VtQMW/cyuBox+DGGIuBbpbtf7Oc4AXciBz+R7pJtwRNc7+BnxJPBKO6VmNiGB9gZWStouKNgbfbRPmmT6Z2wAb6jJhx+wF5ps6jz6p5Ke/92vKuZ2xsXgpPJBslvpUu0KfwXhoOBNdlTNS3WJCby32M9bv0H8Bwu5eG9GpP+Ws20DJ6W9poD/eCLWnj6C898aFvxBYfrAAAAAElFTkSuQmCC';
            tag_a.appendChild(tag_img);
            container[0].appendChild(tag_a);

            clearInterval(existCondition);
        }
    }, 100);

    function get_url() {
        var html = document.querySelector("meta[property='og:video']");//video
        if (!html) {
            html = document.querySelector("meta[property='og:image']");//image
        }
        var url = '';
        if (html) {
            url = html.content;
        }
        return url;
    }

})();
