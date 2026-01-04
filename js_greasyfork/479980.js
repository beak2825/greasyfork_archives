// ==UserScript==
// @name         Colamanga我的收藏更新日期排序
// @version      2.0
// @description        Colamanga我的收藏，列表按照最新更新日期排序（2024-09-04更新自动加载多页收藏并排序）
// @author       Ganky
// @match        *://www.colamanga.com/dynamic/user/subscription*
// @match        *://www.cocomanga.com/dynamic/user/subscription*
// @match        *://www.colamanhua.com/dynamic/user/subscription*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=colamanga.com
// @grant        none
// @license MIT
// @namespace http://ganky
// @downloadURL https://update.greasyfork.org/scripts/479980/Colamanga%E6%88%91%E7%9A%84%E6%94%B6%E8%97%8F%E6%9B%B4%E6%96%B0%E6%97%A5%E6%9C%9F%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/479980/Colamanga%E6%88%91%E7%9A%84%E6%94%B6%E8%97%8F%E6%9B%B4%E6%96%B0%E6%97%A5%E6%9C%9F%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    var ObjUl = $(".fed-user-list.fed-part-rows.fed-back-whits");
    //获取原li数据
    var ObjLis = $(".fed-padding-x.fed-part-rows.fed-line-top");
    //清除页面上的li数据
    $(".fed-padding-x.fed-part-rows.fed-line-top").remove();
    //获取页码数据
    var pageData = $(".fed-btns-info.fed-rims-info.fed-hide.fed-show-xs-inline");
    //收藏总页数，默认一页
    var pages = 1;
    //如果收藏漫画数量超过一页（30部漫画），则自动加载其他页码的所有数据，否则不加载
    if(pageData && pageData.length==3) {
        //清除原有页面层（不显示有多少页）
        $(".fed-page-info.fed-text-center").remove();
        $(".fed-user-title.fed-list-head.fed-part-rows.fed-padding.fed-line-bottom").remove();

        //获取页码
        pages = new Number(pageData.eq(1).html().split("/")[1]);
        for(var i = 2; i <= pages; i++){
            $.ajax({
                url: 'subscription?page='+i,
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function(data) {
                    // 成功加载后，将数据插入到目标元素中
                    var ObjLis2 = $(data).find(".fed-padding-x.fed-part-rows.fed-line-top");
                    $.merge(ObjLis, ObjLis2);
                },
                error: function() {}
            });
        }
    }

    //对li数据进行排序
    ObjLis.sort(function(a,b){
        var utime1 = new Date($(a).eq(0).find("span").eq(3).html());
        var utime2 = new Date($(b).eq(0).find("span").eq(3).html());
        if(utime1.getTime()>utime2.getTime()) return -1 ;
        if(utime1.getTime()<utime2.getTime()) return 1 ;
        return 0 ;
    }) ;
    //把排序后的li数据加载回列表去
    $(ObjUl).append(ObjLis);
})();