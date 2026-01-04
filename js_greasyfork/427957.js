// ==UserScript==
// @name         88影视网关广告
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  文档加载之后，立刻删除广告节点
// @author       Fight Plane
// @match        https://www.88kan.com/*
// @icon         https://www.google.com/s2/favicons?domain=88kan.com
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427957/88%E5%BD%B1%E8%A7%86%E7%BD%91%E5%85%B3%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/427957/88%E5%BD%B1%E8%A7%86%E7%BD%91%E5%85%B3%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        window.setTimeout(function(){
            let poster=document.getElementById('ad_rightBottom');
            if(poster!=null){
                document.body.removeChild(poster);
            }
        },10)
    }
})();