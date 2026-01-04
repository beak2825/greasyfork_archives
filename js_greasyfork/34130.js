// ==UserScript==
// @name         vipsister extension
// @namespace    https://greasyfork.org/ja/users/2332-deadman-from-sora
// @version      0.2
// @description  extention for vipsister
// @author       deadman from sora
// @match        *://vipsister23.com/archives/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34130/vipsister%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/34130/vipsister%20extension.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let Image = function (url, size_limit) {

        let img_tag = document.createElement("img");
        img_tag.setAttribute("src", url);
        if (size_limit !== undefined) {
            if (img_tag.width >= size_limit) {
                img_tag.width = size_limit;
            }
        }
        this.tag = img_tag;
        this.url = url;
        this.size_limit = size_limit;
        this.width = img_tag.width;
        this.height = img_tag.height;
    };

    let replaceUrltoImage = function (link) {
        let parent = link.parentNode;
        let img = new Image(link.href);
        parent.replaceChild(img.tag, link);
    };

    (function () {
        let links = Array.from(document.getElementsByTagName("a"));
        const re = /\https?:\/\/.+\.(gif|jpg|png)$/;

        for (let link of links) {
            if (re.test(link) && link.firstChild.tagName != "IMG") {
                replaceUrltoImage(link);
            }
        }
    })();
})();