// ==UserScript==
// @name         IEEE SciHub
// @namespace    https://greasyfork.org/zh-CN/scripts/40497-ieee-scihub
// @version      0.2
// @description  点击DOI下载论文
// @author       Tintin
// @include      http*://ieeexplore.ieee.org*
// @include      http*://www.sciencedirect.com*
// @include      http*://dl.acm.org*
// @include      http*://www.tandfonline.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40497/IEEE%20SciHub.user.js
// @updateURL https://update.greasyfork.org/scripts/40497/IEEE%20SciHub.meta.js
// ==/UserScript==
var sciurl = "http://sci-hub.tw/";

function work(){

    // 删除 url 的 doi 前缀，并 decode url
    var replace = function(rawUrl) {
        var url = rawUrl.replace('https://doi.org/', sciurl);
        //url = url.replace('http://doi.org/', '');
        var decodeUrl= decodeURIComponent(url);
        return decodeUrl;
    };
    // 找出链接，替换。
    var $elements = $("a[href^='http://doi.org']");
    $elements.each(function(i) {
        console.log($(this).attr('href'));
        var rawUrl =($(this).attr('href'));
        console.log(replace(rawUrl));
        $(this).attr('href', replace(rawUrl));
    });

    $elements = $("a[href^='https://doi.org']");
    $elements.each(function(i) {
        console.log($(this).attr('href'));
        var rawUrl =($(this).attr('href'));
        console.log(replace(rawUrl));
        $(this).attr('href', replace(rawUrl));
    });
}

work();


