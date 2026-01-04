// ==UserScript==
// @name         Booru 图站标签汉化插件
// @namespace    https://github.com/mouyase/Script-BooruTagCN
// @version      0.3.6
// @description  Booru 图站标签汉化插件，用于汉化各种图库网站的标签
// @author       某亚瑟
// @match        https://yande.re/*
// @match        https://gelbooru.com/*
// @match        https://konachan.com/*
// @match        https://konachan.net/*
// @downloadURL https://update.greasyfork.org/scripts/378606/Booru%20%E5%9B%BE%E7%AB%99%E6%A0%87%E7%AD%BE%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/378606/Booru%20%E5%9B%BE%E7%AB%99%E6%A0%87%E7%AD%BE%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function modify() {
        jQuery("ul#tag-sidebar li a").each(function(){
            var obj = jQuery(this);
            var tag = decodeURIComponent(obj.attr('href')).split("tags=")[1];
            if(tag){
                if (tag.indexOf("-")==-1&&tag.indexOf("+")==-1&&tag.indexOf("?")==-1) {
                    var url = 'https://cdn.jsdelivr.net/gh/BooruTagTranslation/Database@gh-pages/'+window.btoa(tag);
                    jQuery.get(url,function(translate){
                        obj.html(translate);
                    });
                }
            }
        });
        jQuery("tr a").each(function(){
            var obj = jQuery(this);
            var tag = decodeURIComponent(obj.attr('href')).split("tags=")[1];
            if(tag){
                if (tag.indexOf("-")==-1&&tag.indexOf("+")==-1&&tag.indexOf("?")==-1) {
                    var url = 'https://cdn.jsdelivr.net/gh/BooruTagTranslation/Database@gh-pages/'+window.btoa(tag);
                    jQuery.get(url,function(translate){
                        obj.html(translate);
                    });
                }
            }
        });
        console.log('TAG汉化已完成');
    }
    modify();
})();
