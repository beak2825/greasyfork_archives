// ==UserScript==
// @name         净化2345
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  净化2345主页
// @match        https://www.2345.com/*
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/380952/%E5%87%80%E5%8C%962345.user.js
// @updateURL https://update.greasyfork.org/scripts/380952/%E5%87%80%E5%8C%962345.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var nodeIdArray = new Array("newsToggleBtn","J_bgSug1st","leftSideBar","J_travel","search-hot-word","J_buyChannel","rili","J_fixSearch","J_broadcast","popNotice","popZfClose","search-list","J_mod_fixGame","adBanner","footer","sidenav","content","map_game","map_video","map_buy","map_these","map_life","J_category","map_topNews");
    var nodeClassArray = new Array("toggle","bgSug1st weaSug","mes-area","left-slidebar","mz-list","act-openD","s11-sc fred","act-search-tab","mes-area","tab-drap","top_w","top_logo","top-extra","fix-search-wrap","pop-yun pop-yun-notice","mod pop-zfclose","list","mod-fixNav","mod mod-fixGame","mod-zfsite-wrap mod-zfsite-wrap-one","mod bottom_mod m_toutiao loading clearfix mt8","mod mod-cateNav loading","mt8 clearfix","mod bottom_mod m_game loading clearfix mt8","mod bottom_mod m_video loading clearfix mt8","mod bottom_mod m_buy clearfix mt8","mod bottom_mod mod-bomlife","mod bottom_mod m_life loading clearfix mt8");
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