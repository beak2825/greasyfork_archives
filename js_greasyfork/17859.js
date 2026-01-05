// ==UserScript==
// @name                自动京东配送
// @name:zh-CN          自动京东配送
// @name:zh-TW          自動京東配送
// @description         在京东浏览商品时，可选择自动为你勾选 [京东配送]、[仅显示有货]、[销量排序]。方便实用！
// @description:zh-CN   在京东浏览商品时，可选择自动为你勾选 [京东配送]、[仅显示有货]、[销量排序]。方便实用！
// @description:zh-TW   在京東瀏覽商品時，可選擇自動為你勾選 [京東配送]、[僅顯示有貨]、[銷量排序]。方便實用！

// @author              by Moshel
// @namespace           https://hzy.pw
// @homepageURL         https://hzy.pw/p/1349
// @supportURL          https://github.com/h2y/link-fix
// @icon                https://hzy.pw/wp-content/uploads/2015/04/i.jpeg
// @license             GPL-3.0

// @include             *//search.jd.com/*
// @include             *//www.jd.com/pinpai/*
// @include             *//list.jd.com/list.html?*
// @grant               none
// @run-at              document-start

// @version             2.4.1
// @modified            04/17/2022
// @downloadURL https://update.greasyfork.org/scripts/17859/%E8%87%AA%E5%8A%A8%E4%BA%AC%E4%B8%9C%E9%85%8D%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/17859/%E8%87%AA%E5%8A%A8%E4%BA%AC%E4%B8%9C%E9%85%8D%E9%80%81.meta.js
// ==/UserScript==

! function() {

    // get GET attributes
    const $_GET = (function(){
        let url = location.search;
        let u = url.split("?", 2);
        if(typeof(u[1]) === "string"){
            u = u[1].split("&");
            let get = {};
            for(let i=0; i<u.length; i++) {
                let j = u[i].split("=");
                get[j[0]] = j[1];
            }
            return get;
        }
        else
            return {};
    })();


    let href = location.search;



    // 有货
    if (!$_GET.stock)
        href += "&stock=1";
    // 京东配送
    if (!$_GET.shop)
        href += "&shop=1";
    // 销量排序
    if (!$_GET.psort)
        href += "&psort=3";
    /*某些分类页面*/
    if(!$_GET.sort)
        href += "&sort=sort_totalsales15_desc";


    if(location.search != href)
        location.search = href;

}();