// ==UserScript==
// @name         Map Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Hide things such as toolbox, search bar on map website.
// @description:zh-CN  隐藏地图网站上的诸如工具栏、搜索框等控件。
// @description:zh-TW  隱藏地圖網站上的諸如工具欄、搜索框等控件。
// @author       DingJunyao
// @match        https://map.baidu.com/*
// @match        https://www.google.com/maps/*
// @match        http://www.google.cn/maps/*
// @match        https://www.amap.com/
// @match        https://www.amap.com/
// @match        https://dito.amap.com/
// @require      https://code.jquery.com/jquery-3.1.0.slim.min.js
// @grant        none
// @website      https://github.com/DingJunyao/mapCleaner
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523967/Map%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/523967/Map%20Cleaner.meta.js
// ==/UserScript==

(function() {
    var keyNum = 0;
    var jqHide = $.noConflict();
    var zList = new Object();
    zList.baidu_id = "left-panel,app-right-top,map-operate,mapType,newuilogo,map-bottom-tip,tooltip-route".split(",");
    zList.baidu_class = "BMap_scaleCtrl,BMap_cpyCtrl,tooltip,render-mode-tips-button,black-tips".split(",");
    zList.baidu_class_important = "".split(",");
    zList.baidu_special = "".split(",");
    zList.google_id = "assistive-chips,vasquette,watermark,omnibox-container".split(",");
    zList.google_class = "app-viewcard-strip,scene-footer-container,widget-pane-toggle-button-container,widget-scene-effects noprint".split(",");
    zList.google_class_important = "".split(",");
    zList.google_special = ["#pane + div"];
    zList.google_special_collapse = ['#pane + div button[jsaction*="drawer.close"]'];
    zList.google_special_expand = ['#pane + div button[jsaction*="drawer.open"]'];
    zList.amap_id = "dirBox,amapBox,loginbox,amapAppDownload,citybox".split(",");
    zList.amap_class = "dir_qr,maptoolbox,layerbox,search,amap-controls".split(",");
    zList.amap_class_important = "amap-copyright,amap-logo".split(",");
    zList.amap_special = "".split(",");
    //判断域名
    if(document.domain.match("google")){
        zList.domain = "google";
    } else if(document.domain.match("baidu")){
        zList.domain = "baidu";
    } else if(document.domain.match("amap")){
        zList.domain = "amap";
    } else {
        zList.domain = 0;
    }
    //alert(zList[zList.domain + "_id"].join("---"));
    jqHide(window).keydown(function(event){
        keyNum ++;
        // console.log(keyNum, event.ctrlKey, event.keyCode);
        if(event.keyCode == 113 && zList.domain) {
            if (keyNum % 2 == 1) {
                if (zList.domain == "google") {
                    jqHide.each(zList.google_special_collapse, function(i, n){jqHide(n).click();});
                }
                jqHide.each(zList[zList.domain + "_id"],function(i,n){jqHide("#"+n).hide();});
                jqHide.each(zList[zList.domain + "_class"],function(i,n){jqHide("."+n).hide();});
                jqHide.each(zList[zList.domain + "_special"],function(i,n){jqHide(n).hide();});
                jqHide.each(zList[zList.domain + "_class_important"],function(i,n){jqHide("."+n).attr('style','display:none !important');});

            } else {
                jqHide.each(zList[zList.domain + "_id"],function(i,n){jqHide("#"+n).show();});
                jqHide.each(zList[zList.domain + "_class"],function(i,n){jqHide("."+n).show();});
                jqHide.each(zList[zList.domain + "_special"],function(i,n){jqHide(n).show();});
                jqHide.each(zList[zList.domain + "_class_important"],function(i,n){jqHide("."+n).attr('style','');});
                if (zList.domain == "google") {
                    jqHide.each(zList.google_special_expand, function(i, n){jqHide(n).click();});
                }
                // 延时 200 ms
            }
        }
    });
})();

/*

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.1.0.slim.min.js'
script.onload = function() {
    console.log('jQuery has been loaded!');
};
document.head.appendChild(script);

*/

// https://www.google.com/maps/dir/%E8%B4%B9%E5%9F%8E+%E7%BE%8E%E5%9B%BD%E5%AE%BE%E5%A4%95%E6%B3%95%E5%B0%BC%E4%BA%9A%E5%B7%9E/%E7%86%A8%E6%96%97%E5%A4%A7%E5%8E%A6+%E7%BE%8E%E5%9B%BD+New+York,+5th+Ave,+%E9%82%AE%E6%94%BF%E7%BC%96%E7%A0%81:+10010/JFK%E7%BA%BD%E7%BA%A6America/@40.365455,-74.8021179,10z/data=!4m20!4m19!1m5!1m1!1s0x89c6b7d8d4b54beb:0x89f514d88c3e58c1!2m2!1d-75.1652215!2d39.9525839!1m5!1m1!1s0x89c259a3f71c1f67:0xde2a6125ed704926!2m2!1d-73.9896986!2d40.7410605!1m5!1m1!1s0x89c26650d5404947:0xec4fb213489f11f0!2m2!1d-73.7797035!2d40.6446245!3e0?hl=en&entry=ttu&g_ep=EgoyMDI1MDExMC4wIKXMDSoASAFQAw%3D%3D