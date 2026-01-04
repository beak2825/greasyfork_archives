// ==UserScript==
// @name         TDGSGL图片查看器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  调整网页版图片大小，并添加图片缩放浏览功能
// @author       kyonko
// @match        https://www.tdgsgl.top/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/viewerjs@1.5.0/dist/viewer.min.js
// @resource     viewer_css  https://cdn.jsdelivr.net/npm/viewerjs@1.5.0/dist/viewer.min.css
// @require      https://cdn.jsdelivr.net/npm/jquery-viewer@1.0.1/dist/jquery-viewer.min.js
// @grant        GM.getResourceText
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/407352/TDGSGL%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/407352/TDGSGL%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM.getResourceText("viewer_css").then((css_src) => {
        GM.addStyle(css_src);
    });

    GM.addStyle("img.bbc_img {max-width: 300px !important;}");
    GM.addStyle("img.bbc_img {cursor: -webkit-zoom-in; cursor: zoom-in;}");


    let $images = $("img.bbc_img");

    $images.click(function(event) {
        event.stopPropagation();
        event.preventDefault();
    });

    $images.viewer({
        navbar: false,
        button: true,
        toolbar: true,
        title: false
    });

})();

