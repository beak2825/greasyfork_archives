// ==UserScript==
// @name         月光社记忆战场抄作业女武神展开
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  地址www.3rdguide.com，抄就硬抄
// @author       userzhm
// @match        *.3rdguide.com/web/teamnew/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406976/%E6%9C%88%E5%85%89%E7%A4%BE%E8%AE%B0%E5%BF%86%E6%88%98%E5%9C%BA%E6%8A%84%E4%BD%9C%E4%B8%9A%E5%A5%B3%E6%AD%A6%E7%A5%9E%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/406976/%E6%9C%88%E5%85%89%E7%A4%BE%E8%AE%B0%E5%BF%86%E6%88%98%E5%9C%BA%E6%8A%84%E4%BD%9C%E4%B8%9A%E5%A5%B3%E6%AD%A6%E7%A5%9E%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function(){
        $(".table-search").css({"overflow":"visible","height":"auto"});
        $(".goodwar").find(".content").css("height","auto");
    })
})();