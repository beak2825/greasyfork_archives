// ==UserScript==
// @name         水木社区页面到底后回车键翻页
// @namespace    https://greasyfork.org/zh-CN/users/167084-lin-skywood
// @version      1.2
// @description  水木社区页面到底后回车键翻页_des
// @author       skywoodlin
// @contributor  skywoodlin
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// @grant        GM_openInTab
// @grant        GM_addStyle
// @include      *://*.newsmth.net/*
// @include      *://*.mysmth.net/*
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/426451/%E6%B0%B4%E6%9C%A8%E7%A4%BE%E5%8C%BA%E9%A1%B5%E9%9D%A2%E5%88%B0%E5%BA%95%E5%90%8E%E5%9B%9E%E8%BD%A6%E9%94%AE%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/426451/%E6%B0%B4%E6%9C%A8%E7%A4%BE%E5%8C%BA%E9%A1%B5%E9%9D%A2%E5%88%B0%E5%BA%95%E5%90%8E%E5%9B%9E%E8%BD%A6%E9%94%AE%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function($) {
    let counter = 0;
    let firstPageNumber;
    let $nextPageEle_a;


    function GetRequestParam() {
        //console.log(window.location);
        //debugger;
        let href = window.location.href; //获取url中"?"符后的字串
        //console.log(href);

        let requestParam = new Object();

        if (href.indexOf("?") == -1) {
            firstPageNumber = 0;
            return;
        }

        let pageInfo = href.split("?")[1]; // p=123
        firstPageNumber = Number.parseInt(pageInfo.split("=")[1]);
        //console.log("firstPageNumber: " + firstPageNumber);
    }


    // 简单的防抖动函数
    function debounce(func, wait, immediate) {
        // 定时器变量
        let timeout;
        return function() {
            // 每次触发 scroll handler 时先清除定时器
            clearTimeout(timeout);
            // 指定 xx ms 后触发真正想进行的操作 handler
            timeout = setTimeout(func, wait);
        };
    };

    function makePopup(msg,callback){
        $('body').append("<div class='nextpage_popup'><p>"+msg+"</p></div>");
    }
    GM_addStyle(
      `
      .nextpage_popup {text-align: center; font-size: 20px; background-color: yellow;}
      `

    )


    function paging() {
        //console.log(counter++);
        if(!firstPageNumber) {
            GetRequestParam();
        }

        let $window = $(window);
        let h=$(document).height();
        //网页文档的高度
        let c = $window.scrollTop();
        //滚动条距离网页顶部的高度
        let wh = $window.height();

        //页面可视化区域高度
        if (Math.ceil(wh+c)>=h){
            $($(".page-select:first").next()[0]).find("a").click();
            if($nextPageEle_a && $nextPageEle_a.length !== 0) {
                return;
            }

            //alert("我已经到底部啦");
            let $nextPageEle = $(".page-select:first").next();
            if($nextPageEle.length ===0 ){
                return;
            }

            $nextPageEle_a = $($nextPageEle[0]).find("a");

            makePopup("按回车翻页");
        }
    }

    // 采用了防抖动
    window.addEventListener('scroll',debounce(paging,50));

    $(window).keydown(function( event ) {
        debugger;
        if (event.which == 13 ) { //回车
            if($nextPageEle_a && $nextPageEle_a.length !== 0) {
                let nextpageurl = $nextPageEle_a.get(0).href;
                GM_openInTab(nextpageurl, {active: true});
                //$nextPageEle_a.click();
            }
        }
    });

})(jQuery);