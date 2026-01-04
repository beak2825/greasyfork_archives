// ==UserScript==
// @name         steam链接已删除？
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  重新显示steam{链接已删除}的链接
// @author       HCLonely
// @match        *://steamcommunity.com/*
// @match        *://store.steampowered.com/*
// @supportURL   https://blog.hclonely.com/posts/578f9be7/
// @homepage     https://blog.hclonely.com/posts/578f9be7/
// @downloadURL https://update.greasyfork.org/scripts/374398/steam%E9%93%BE%E6%8E%A5%E5%B7%B2%E5%88%A0%E9%99%A4%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/374398/steam%E9%93%BE%E6%8E%A5%E5%B7%B2%E5%88%A0%E9%99%A4%EF%BC%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function showLink(){
        jQuery(".bb_removedlink").hide();
        jQuery(".collapsed_link").show();
        jQuery("a.collapsed_link[href=#]").map((i,e)=>{
            jQuery(e).attr('href',jQuery(e).text().trim());
            jQuery(e).attr('target',"_blank");
        });
    }
    setInterval(showLink,1000);
})();
