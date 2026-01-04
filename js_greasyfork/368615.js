// ==UserScript==
// @name         博客园 自用精简版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       bage22
// @match        *.cnblogs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368615/%E5%8D%9A%E5%AE%A2%E5%9B%AD%20%E8%87%AA%E7%94%A8%E7%B2%BE%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/368615/%E5%8D%9A%E5%AE%A2%E5%9B%AD%20%E8%87%AA%E7%94%A8%E7%B2%BE%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeAd(){
        let len = arguments.length;
        for(var i=0;i<len;i++){
            $(arguments[i]).fadeOut("slow");
        }
    }
    removeAd("#cnblogs_c2","#comment_form","#cnblogs_c1","#sideBarMain","#blog_post_info_block");
})();