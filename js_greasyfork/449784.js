// ==UserScript==
// @name         ryuryu_meta_add
// @namespace    ryuryuSrcsetRemove
// @version      0.2
// @description  移除破圖
// @author       oTELiNo
// @match        https://ryuryu.tw*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449784/ryuryu_meta_add.user.js
// @updateURL https://update.greasyfork.org/scripts/449784/ryuryu_meta_add.meta.js
// ==/UserScript==

(function() {
    var meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "upgrade-insecure-requests";
    document.getElementsByTagName('head')[0].appendChild(meta);
    document.querySelectorAll("figure>img").forEach((el, index, array)=>{
        el.removeAttribute("srcset");
        el.removeAttribute("class");
        el.removeAttribute("alt");
        el.removeAttribute("loading");
        el.removeAttribute("sizes");
        el.removeAttribute("width");
        el.removeAttribute("height");
    });
})();