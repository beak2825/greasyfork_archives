// ==UserScript==
// @name         公众号文章浏览量计算
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  计算微信公众号所有推文的浏览量
// @author       BWQ
// @match        https://mp.weixin.qq.com/cgi-bin/appmsgpublish*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436457/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E6%B5%8F%E8%A7%88%E9%87%8F%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/436457/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E6%B5%8F%E8%A7%88%E9%87%8F%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //获取当前页的标号
    var pageNow = parseInt(document.getElementsByClassName("weui-desktop-pagination__num weui-desktop-pagination__num_current")[0].innerText)
    if( pageNow === 1 ){
        GM_setValue("count",0);
        GM_setValue("startFromPage",true);
    }
    var count_now = parseInt(GM_getValue("count"));
    //console.log(count_now)
    GM_setValue("count",count_now);

    //当前页浏览量
    var viewCountNumber = 0;
    //当前页的dom对象
    var pageData = document.getElementsByClassName("weui-desktop-mass-media__data__inner");
    //获取页数
    var a = document.getElementsByClassName("weui-desktop-pagination__num")
    var pageNum = parseInt(a[a.length-1].innerText)
    //上一页下一页按钮
    var nextPageButton = document.getElementsByClassName("weui-desktop-btn weui-desktop-btn_default weui-desktop-btn_mini")

    for(var i = 0; i < pageData.length; i = i+3){
        viewCountNumber += parseInt(pageData[i].innerText);
    }
    GM_setValue("count", count_now + viewCountNumber);
    console.log(viewCountNumber)

    if( pageNow === 1){
        nextPageButton = nextPageButton[0];
    }else{
        nextPageButton = nextPageButton[1];
    }

    if( pageNow !== pageNum){
        nextPageButton.click();
    }
    else{
        var count_show = "总浏览量："+parseInt(GM_getValue("count"))
        var input = document.getElementsByClassName("weui-desktop-form__input")[0]
        if( Boolean(GM_getValue("startFromPage")) === true ){
            input.value = count_show
            console.log(count_show)
        }else{
            input.value = "请从第一页开始计算"
        }
        GM_setValue("startFromPage",false)
        // console.log(count_show)
    }
})();