// ==UserScript==
// @name         Hide search box for Google maps/Baidu maps
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  google baidu 地图隐藏搜索框（F2）
// @author       You
// @match        http://map.baidu.com/*
// @match        https://www.google.com/maps/*
// @match        http://www.google.cn/maps/*
// @require      http://code.jquery.com/jquery-3.1.0.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22954/Hide%20search%20box%20for%20Google%20mapsBaidu%20maps.user.js
// @updateURL https://update.greasyfork.org/scripts/22954/Hide%20search%20box%20for%20Google%20mapsBaidu%20maps.meta.js
// ==/UserScript==

(function() {
    var zList = new Object();
    zList.baidu_id = "left-panel,app-right-top,map-operate,mapType,newuilogo,map-bottom-tip,tooltip-route".split(",");
    zList.baidu_class = "BMap_scaleCtrl,BMap_cpyCtrl".split(",");
    zList.google_id = "vasquette,watermark,omnibox-container".split(",");
    zList.google_class = "app-viewcard-strip,scene-footer-container,widget-pane-toggle-button-container,widget-scene-effects noprint".split(",");
    //判断域名
    if(document.domain.match("google")){
        zList.domain = "google";
    } else if(document.domain.match("baidu")){
        zList.domain = "baidu";
    } else {
        zList.domain = 0;
    }
    //alert(zList[zList.domain + "_id"].join("---"));
    $(window).keydown(function(event){
        if(event.keyCode == 113 && zList.domain){
            $.each(zList[zList.domain + "_id"],function(i,n){$("#"+n).toggle();});
            $.each(zList[zList.domain + "_class"],function(i,n){$("."+n).toggle();});
        }
    });
})();