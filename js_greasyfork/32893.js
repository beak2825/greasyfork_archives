// ==UserScript==
// @name         闲鱼搜索框
// @version      1.9.8
// @description  适配新版闲鱼首页，恢复导航栏的大搜索框，移除页面广告，显示列表页过滤栏的小搜索框，显示当前登录用户的出售/已售商品列表，显示商品下面的收藏按钮
// @author       yougg
// @match        https://www.taobao.com/favicon.ico
// @match        http*://2.taobao.com/*
// @match        http*://s.2.taobao.com/*
// @match        http*://trade.2.taobao.com/*
// @grant        none
// @namespace    https://yougg.github.io/
// @icon         https://gtms02.alicdn.com/tps/i2/TB1VqSxHVXXXXb.XVXXqw4SJXXX-79-60.png
// @downloadURL https://update.greasyfork.org/scripts/32893/%E9%97%B2%E9%B1%BC%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/32893/%E9%97%B2%E9%B1%BC%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function showFavorite() {
    var goods = document.getElementsByClassName('item-other-info');
    if (goods.length > 0) {
        for (var i = 0; i < goods.length; i++) {
            var v = goods[i];
            v.innerHTML = replaceAll(replaceAll(v.innerHTML, '<!--<a', '<a'), '</a>-->', '</a>');
        }
    }
}

function showSale() {
    var myls = document.getElementsByClassName('my-list');
    if (myls.length > 0) {
        var ls = myls[0];
        if (ls.childElementCount != 4) {
            return
        }
        var nls = ls.cloneNode(true);
        ls.parentNode.replaceChild(nls, ls);

        var onsale = nls.childNodes[0];
        var sold = nls.childNodes[1];
        onsale.addEventListener("click", function(){window.open('https://trade.2.taobao.com/index.htm?onSale=true')});
        sold.addEventListener("click", function(){window.open('https://trade.2.taobao.com/order_list.htm?src=')})
    }

    var sublist = document.getElementsByClassName('sublist');
    if (sublist.length <= 0) {
        return
    }

    var sl = sublist[0];
    if (sl.childElementCount != 4) {
        return
    }
    var nsl = sl.cloneNode(true);
    sl.parentNode.replaceChild(nsl, sl);

    onsale = nsl.childNodes[0];
    sold = nsl.childNodes[1];
    onsale.addEventListener("click", function(){window.open('https://trade.2.taobao.com/index.htm?onSale=true')});
    sold.addEventListener("click", function(){window.open('https://trade.2.taobao.com/order_list.htm?src=')})
}

function replaceListUrl() {
    // 替换商品瀑布流中的url
    var container = document.getElementById('J_ItemListsContainer');
    if (container !== null) {
        container.innerHTML = replaceAll(container.innerHTML, "list/list.htm", "list/list");
    }
}

function removeAds() {
    // 移除App下载提示
    var d = document.getElementsByClassName('download-layer');
    if (d.length > 0) {
        d[0].parentElement.remove();
    }
    var d1 = document.getElementsByClassName('pop-wrap');
    if (d1.length > 0) {
        d1[0].innerHTML = '';
        d1[0].className = '';
    }
    var d2 = document.getElementsByClassName('bottom-wrap');
    if (d2.length > 0) {
        d2[0].parentElement.innerHTML = '';
    }
    var m = document.getElementsByClassName('mau-guide');
    if (m.length >0) {
        m[0].parentNode.removeChild(m[0]);
    }
    var g = document.getElementsByClassName('xy-guide');
    if (g.length > 0) {
        g[0].remove();
    }
    var j = document.getElementById('J_Message');
    if (j !== null && j.childElementCount > 0) {
        j.firstElementChild.remove();
    }
    var t = document.getElementById('guarantee');
    if (t !== null) {
        t.remove();
    }
    var f = document.getElementById('J_IdleFooter');
    if (f !== null) {
        f.remove();
    }
    var b = document.getElementById('J_SideBar');
    if (b !== null) {
        b.remove();
    }
}

(function(){
    'use strict';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.idle-search { position: absolute; right: 65px; top: 27px; width: 222px; height: 36px; background-color: #333; }' +
        '.input-search { width: 164px; height: 32px; padding: 0 10px; margin: 0; border: 0; outline: 0; position: absolute; left: 2px; top: 2px; font-size: 13px; }' +
        '.btn-search { display: block; width: 36px; height: 36px; position: absolute; top: 0; right: 0; color: #fff; background-color: #333; border: 0; margin: 0; padding: 0; cursor: pointer; outline: 0; }' +
        '@font-face{font-family:xy-iconfont;src:url(//at.alicdn.com/t/font_1432608908_2844584.eot);src:url(//at.alicdn.com/t/font_1432608908_2844584.eot?#iefix) format(\'embedded-opentype\'),url(//at.alicdn.com/t/font_1432608908_2844584.woff) format(\'woff\'),url(//at.alicdn.com/t/font_1432608908_2844584.ttf) format(\'truetype\'),url(//at.alicdn.com/t/font_1432608908_2844584.svg#iconfont) format(\'svg\')}' +
        '.iconfont { font-family: xy-iconfont; font-size: 18px; font-style: normal; }' +
        '.search-img { position: absolute; right: -65px; top: -13px; display: block; width: 79px; height: 60px; background: url(//gtms02.alicdn.com/tps/i2/TB1VqSxHVXXXXb.XVXXqw4SJXXX-79-60.png) no-repeat 0 0; _background: 0 0; _filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'images/\', sizingMethod=\'scale\'); zoom: 1; }';
    document.getElementsByTagName('head')[0].appendChild(style);
    //document.getElementById('xxxElementId').className = 'xxxClass';

    // 设置首页导航标题偏移，显示被遮挡的“我的闲置”菜单
    var tws = document.getElementsByClassName('tab-wrap');
    if (tws.length > 0) {
        tws[0].style.marginRight='400px';
    }

    // 添加顶部导航栏的大搜索框
    var S = document.createElement("div");
    S.className = "idle-search";
    S.innerHTML = '  <form method="get" action="//s.2.taobao.com/list/list" name="search" target="_top">' +
        '    <input class="input-search" id="J_HeaderSearchQuery" name="q" type="text" value="" placeholder="搜闲鱼" />' +
        '    <input type="hidden" name="search_type" value="item" autocomplete="off" />' +
        '    <input type="hidden" name="app" value="shopsearch" autocomplete="off" />' +
        '    <input type="hidden" name="ist" value=0 autocomplete="off" />' +
        '    <button class="btn-search" type="submit"><i class="iconfont">&#xe602;</i><span class="search-img"></span></button>' +
        '  </form>';
    var s0 = document.getElementById("J_IdleHeader");
    if (s0 !== null) {
        s0.appendChild(S);
    }
    var s1 = document.getElementsByClassName('navbar-wrap');
    if (s1.length > 0) {
        s1[0].appendChild(S);
    }

    // 显示列表页过滤栏的小搜索框
    var s = document.getElementsByClassName('search-filters-block search-filters');
    if (s.length > 0) {
        s[0].style.display = "initial";
        var action = s[0].parentNode.action;
        s[0].parentNode.action = action.replace("list/list.htm", "list/list");
    }

    // 替换分类过滤的url
    var category = document.getElementsByClassName('J_HiddenAreaContent sub-category-list clearfix');
    if (category.length > 0) {
        category[0].innerHTML = replaceAll(category[0].innerHTML, "list/list.htm", "list/list");
    }

    // 替换过滤操作按钮的url
    var filters = document.getElementsByClassName('search-filters-block click-filters');
    if (filters.length > 0) {
        filters[0].innerHTML = replaceAll(filters[0].innerHTML, "list/list.htm", "list/list");
    }
    var filterpopup = document.getElementsByClassName('search-filters-popup');
    if (filterpopup.length > 0) {
        filterpopup[0].innerHTML = replaceAll(filterpopup[0].innerHTML, "list/list.htm", "list/list");
    }
    var filtertoggle = document.getElementsByClassName('search-filters-block toggle-style cur-style-waterfall');
    if (filtertoggle.length > 0) {
        filtertoggle[0].innerHTML = replaceAll(filtertoggle[0].innerHTML, "list/list.htm", "list/list");
    }
    var styletoggle = document.getElementsByClassName('search-filters-block toggle-style cur-style-list');
    if (styletoggle.length > 0) {
        styletoggle[0].innerHTML = replaceAll(styletoggle[0].innerHTML, "list/list.htm", "list/list");
    }

    replaceListUrl();

    // 替换商品列表分页按钮的url
    var paginator = document.getElementById('J_Pages');
    if (paginator !== null) {
        paginator.innerHTML = replaceAll(paginator.innerHTML, "list/list.htm", "list/list");
    }

    // 备份小搜索框源码，防删
    // '<div class="search-filters-block search-filters">' +
    // '	<label for="J_SearchFilterInput">搜索</label>' +
    // '	<div class="search-input-wrapper">' +
    // '		<input id="J_SearchFilterInput" type="text" name="q" value="Pixel XL">' +
    // '	</div>' +
    // '	<button type="submit">确定</button>' +
    // '</div>'

    document.body.addEventListener("DOMNodeInserted", function (ev) {
        // 移除广告
        removeAds();
    }, false);
    document.body.onload = function() {
        // 移除广告
        removeAds();

        // 显示当前登录用户的出售/已售商品列表
        showSale();

        // 显示商品下面的收藏按钮
        showFavorite();
    };
})();