// ==UserScript==
// @name         净化2345主页
// @namespace    https://greasyfork.org/zh-CN/scripts/445094
// @version      0.3.3
// @description  净化2345主页广告
// @match        https://www.2345.com/*
// @match        https://www.hao123.com/*
// @grant        2023.09.13
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @license      GPL-3.0

// @downloadURL https://update.greasyfork.org/scripts/445094/%E5%87%80%E5%8C%962345%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/445094/%E5%87%80%E5%8C%962345%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var nodeIdArray = new Array("content-left","middle-info-flow","J_newsChannel","J_gameChannel","J_lifeChannel","J_anecdoteChannel","J_yqcChannel","J_gul_yg","l1hick","map_news","map_webgame2","map_minigame","map_shop","business-bottom-wrap","map_topNews","searchXiala","search-right-mess","search-hot-word","J_broadcast","top_left","feed_pagelet","J_micro_zhuanti-002");
    var nodeClassArray = new Array("content-left","left-cnli-003","g-ib layout-left","content-right","search-hot-word","search-right-swiper-news","search-xiala","search-tip","news-box","classify-nav","top-left","kz");
    for(var i=0;i<nodeIdArray.length;i++){
        var node = document.getElementById(nodeIdArray[i]);
        if(node!==null){
            node.parentNode.removeChild(node);
        }
    }
    for(var k=0;k<nodeClassArray.length;k++){
        var nodes = document.getElementsByClassName(nodeClassArray[k]);
        for(var j=0;j<nodes.length;j++){
            var Cnode = nodes[j];
            if(Cnode!==null){
                Cnode.parentNode.removeChild(Cnode);
            }
        }
    }
    document.getElementById("layout-content").setAttribute("class", "page-width");
    //仅保留登陆信息
    $(".header__inner").children().each(function(){
        if($(this).attr("class")!=="header__item--fr login-pan-mobile header--r1"){
            $(this).hide();
        }
    });
    $(".login__pop").css("height","35px");
    $(".hao123-search").css("padding-top",0);
})();