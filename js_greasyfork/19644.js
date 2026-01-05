// ==UserScript==
// @name          字幕组（原 人人影视） 免 Flash 复制
// @version       0.3.4
// @namespace     stormyyd
// @description   免 Flash 在 字幕组（原 人人影视） 上进行批量复制
// @license       WTFPL
// @supportURL    storm-yyd@outlook.com
// @grant         GM_setClipboard
// @include       http://www.zimuzu.tv/resource/list/*
// @downloadURL https://update.greasyfork.org/scripts/19644/%E5%AD%97%E5%B9%95%E7%BB%84%EF%BC%88%E5%8E%9F%20%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%EF%BC%89%20%E5%85%8D%20Flash%20%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/19644/%E5%AD%97%E5%B9%95%E7%BB%84%EF%BC%88%E5%8E%9F%20%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%EF%BC%89%20%E5%85%8D%20Flash%20%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

var ed2k = $("a[rel='ed2k']");
var magnet = $("a[rel='magnet']");
var disk = $("a[rel='disk']");

$(ed2k).unbind();
$(magnet).unbind();
$(disk).unbind();
$(ed2k).siblings("span").remove();

var getUrl = function(urlType){
    var urls = "";
    $("div.fl").each(function(){
        if($(this).children("input").attr("checked") == "checked" && $(this).is(":visible")){
            url = $(this).siblings("div.fr").children("a[type='" + urlType + "']").attr("href");
            if(url !== undefined) urls += url + "\n";
        }
    });
    urls = urls.slice(0, -1);
    GM_setClipboard(urls);
    GLOBAL.ShowMsg("已将链接复制到剪贴板");
};

$(ed2k).click(function(){
    getUrl("ed2k");
});
$(magnet).click(function(){
    getUrl("magnet");
});
$(disk).click(function(){
    getUrl("disk");
});