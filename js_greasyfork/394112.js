// ==UserScript==
// @name 漫画连读
// @description 用于一整页显示一章的漫画。
// @match *.mh1234.com
// @version 0.0.1.20210127103523
// @namespace https://greasyfork.org/users/420865
// @downloadURL https://update.greasyfork.org/scripts/394112/%E6%BC%AB%E7%94%BB%E8%BF%9E%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/394112/%E6%BC%AB%E7%94%BB%E8%BF%9E%E8%AF%BB.meta.js
// ==/UserScript==

if (window.location.href.split('/').length > 5) {
    YueDuMoShi();
} else {
    console.log("不是漫ddd画页");
}
function YueDuMoShi() {
    //  将最讨厌的顶层广告隐藏
    var fuckAd = document.querySelector('[style*="z-index: 2147483647;"]');
    if (fuckAd != null) {// 有的时候，没有顶层广告。如果不加判断，下一句会报错并中止。
        fuckAd.style.display = "none";
    }

    //  新显示层
    var dirUrl = document.querySelector("body a.iconRet").href;
    var pageTitle = document.createElement("div");
    pageTitle.innerText = document.querySelector("body a.BarTit").innerText;
    pageTitle.style.cssText = "color: rgb(255, 255, 255);background-color: rgb(0, 153, 0);font-family: '方正小标宋_GBK';font-size: 32px;";
    document.body.style.cssText = "margin: 0;";
    var tempNode;
    tempNode = document.createElement("div");
    //  新显示层不能放在最顶层，否则会被设置的广告拦截给拦截掉，所以z-index设置为第二高层: 2147483646
    tempNode.style.cssText = "top:0;width: 100%; height: 100%;  background: #000000;  z-index: 2147483646;position: fixed; overflow: auto;text-align:center;";
    document.body.appendChild(tempNode);
    document.body.style.overflow = "hidden";

    //  漫画主体
    var mhLink = document.createElement("a");
    var pageNo = 1;
    chapterImages.forEach(function(v) {
        var mhLink = document.createElement("img");
        mhLink.src = SinMH.getChapterImage(pageNo++);
        mhLink.style.width = "100%";
        tempNode.appendChild(mhLink);
        console.log(v);
    });
    tempNode.appendChild(document.createElement("br"));

    //  标题
    tempNode.appendChild(pageTitle);

    //  导航栏
    var eleLink1 = document.createElement("a");
    eleLink1.href = "javascript:SinTheme.prevChapter();";
    eleLink1.innerText = "上一章";
    eleLink1.style.cssText = "color: rgb(255, 255, 255); font-weight: bold; padding: 8px 25px; background-color: rgb(0, 168, 0);line-height: 60px;";
    tempNode.appendChild(eleLink1);
    var eleLink2 = document.createElement("a");
    eleLink2.href = "javascript:SinTheme.nextChapter();";
    eleLink2.innerText = "下一章";
    eleLink2.style.cssText = "color: rgb(255, 255, 255); font-weight: bold; padding: 8px 25px; background-color: rgb(0, 153, 0);line-height: 60px;";
    tempNode.appendChild(eleLink2);
    var eleLink3 = document.createElement('a');
    eleLink3.href = dirUrl;
    eleLink3.innerText = "返回目录";
    eleLink3.style.cssText = "color: rgb(255, 255, 255); font-weight: bold; padding: 8px 25px; background-color: rgb(0, 168, 0);line-height: 60px;";
    tempNode.appendChild(eleLink3);
}
