// ==UserScript==
// @name         京东主图详情速扒单JPG
// @namespace    https://www.gofortime.com/
// @version      1.0
// @description  右键点击想要下载的图片，然后新标签页打开。可以去掉avif后缀以及800*800px主图的水印。
// @author       寒隙 GoForTime.com
// @match        https://*.360buyimg.com/*
// @icon         https://www.gofortime.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457724/%E4%BA%AC%E4%B8%9C%E4%B8%BB%E5%9B%BE%E8%AF%A6%E6%83%85%E9%80%9F%E6%89%92%E5%8D%95JPG.user.js
// @updateURL https://update.greasyfork.org/scripts/457724/%E4%BA%AC%E4%B8%9C%E4%B8%BB%E5%9B%BE%E8%AF%A6%E6%83%85%E9%80%9F%E6%89%92%E5%8D%95JPG.meta.js
// ==/UserScript==

(function() {
    var sourceA = window.location.href;
    // 获取当前网址
    var sourceN0 = sourceA.replace('/n0/', '/imgzone/')
    // 尝试更改地址，去除JD水印
    var tailName = sourceN0.substr(sourceN0.lastIndexOf(".") + 1,4);
    // 获取后缀名
    if ( tailName == 'avif') {
        // 判断是否为avif文件再执行
        var sourceEnd = sourceN0.substring(0,sourceN0.length-5);
        // 去掉.avif
        window.location.replace(sourceEnd);
        // 打开最终链接
    }
    if ( sourceA == sourceN0) {
        //判断第二步骤是否执行，如果更改了便是主图。

        console.log('One!');
    }else{
        window.location.replace(sourceN0);
        //打开去掉水印的地址
    }
})();