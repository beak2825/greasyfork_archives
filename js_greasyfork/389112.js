// ==UserScript==
// @name         微博-长文阅读
// @namespace    https://greasyfork.org/users/329519
// @version      0.1
// @description  微博长文无需关注即可阅读
// @author       eaudouce
// @match        *://*.weibo.com/ttarticle/p/show*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389112/%E5%BE%AE%E5%8D%9A-%E9%95%BF%E6%96%87%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/389112/%E5%BE%AE%E5%8D%9A-%E9%95%BF%E6%96%87%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        if(document.querySelector(".WB_editor_iframe"))document.querySelector(".WB_editor_iframe").style.height = 'auto';
        if(document.querySelector(".WB_editor_iframe_new"))document.querySelector(".WB_editor_iframe_new").style.height = 'auto';
        if(document.querySelector(".btn_line"))document.querySelector(".btn_line").style.display = 'none';
    },1000);
})();