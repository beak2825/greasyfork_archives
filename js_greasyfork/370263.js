// ==UserScript==
// @name         STEAM快速获取SUBID
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  橘子电玩STEAM专用subid获取工具
// @author       上仙子画乄
// @require      https://cdn.bootcss.com/clipboard.js/1.6.1/clipboard.js
// @match        https://store.steampowered.com/app/*
// @match        https://store.steampowered.com/sub/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370263/STEAM%E5%BF%AB%E9%80%9F%E8%8E%B7%E5%8F%96SUBID.user.js
// @updateURL https://update.greasyfork.org/scripts/370263/STEAM%E5%BF%AB%E9%80%9F%E8%8E%B7%E5%8F%96SUBID.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=0;var subids=Array();
    jQuery(".game_area_purchase_game:not(:contains(捆绑包信息))").each(function(){
      subids[i]=jQuery(".game_area_purchase_game:not(:contains(捆绑包信息))").eq(i).find("form").find("input[name='subid']").val();
       jQuery(".game_area_purchase_game:not(:contains(捆绑包信息))").eq(i).find(".game_purchase_action").append('<div class="game_purchase_action_bg"><div class="btn_addtocart"><a class="btnv6_blue_blue_innerfade btn_medium juzi"  data-clipboard-text="'+subids[i]+'"><span>复制subid('+subids[i]+')</span></a></div></div>');
       i++;
    });
    new Clipboard('.juzi');
    jQuery(".juzi").click(function(){
        jQuery(this).removeClass("btnv6_blue_blue_innerfade").addClass("btnv6_grey_black");
    })
})();