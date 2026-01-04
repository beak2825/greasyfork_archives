// ==UserScript==
// @name         WEMP.app 上公众号文章优化显示
// @namespace    http://www.medicaldupeng.com/
// @version      0.1
// @description  WEMP.app 上公众号文章优化显示，方便阅读和打印!
// @author       405647825@qq.com
// @match        *wemp.app/posts/*
// @icon         https://www.google.com/s2/favicons?domain=wemp.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426359/WEMPapp%20%E4%B8%8A%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E4%BC%98%E5%8C%96%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/426359/WEMPapp%20%E4%B8%8A%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E4%BC%98%E5%8C%96%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var aNode = document.querySelector('#content');
    aNode.style.overflow = "hidden";
    aNode.innerHTML = aNode.innerHTML.replace(/<section.+?>/g,'').replace(/<\/section>/g,'').replace(/<p.+?>/g,'<span>').replace(/<\/p>/g,'</span><br />').replace(/<div.+?>/g,'<span>').replace(/<\/div>/g,'</span><br />').replace(/<ins.+?<\/ins>/g,'').replace(/<em.+?<\/em>/g,'').replace(/<span>(<span.+?>)+/g,'<span>').replace(/(<\/span>){2,}/g,'</span>');
    // Your code here...
})();