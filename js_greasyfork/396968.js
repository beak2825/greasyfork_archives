// ==UserScript==
// @name         看准网免小程序查看
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  看准网显示屏蔽的评论
// @author       chengxuncc
// @match        https://www.kanzhun.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396968/%E7%9C%8B%E5%87%86%E7%BD%91%E5%85%8D%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/396968/%E7%9C%8B%E5%87%86%E7%BD%91%E5%85%8D%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function goTo(url){
        var a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("rel", "noreferrer");
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
    }
    var loc = window.location.toString();
    if(loc.indexOf('ka=')!==-1){
        loc=loc.replace(/[?&]ka=([^&])+/g,'');
        goTo(loc);
    }

})();