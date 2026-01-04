// ==UserScript==
// @name         掘金收藏夹辅助
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  掘金收藏夹重度用户专用，增加了收藏夹高度并支持模糊搜索
// @author       Nuoky
// @match        https://juejin.im/*
// @match        https://juejin.cn/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/383129/%E6%8E%98%E9%87%91%E6%94%B6%E8%97%8F%E5%A4%B9%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/383129/%E6%8E%98%E9%87%91%E6%94%B6%E8%97%8F%E5%A4%B9%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var onCollectionListSeachChange = function(e) {
        var search = $(this).val().trim();
        if (search == '') {
            $('.collection-list .item').show();
        }
        $(".collection-list .item:contains(" + search + ")").show();
        $(".collection-list .item:not(:contains(" + search + "))").hide();
    }
    var onCollectionListOpen = function(){
        $('.collect-popup').css('top', '-200px');;
        $('.collection-list').css('height', '600px');
        var collectionListSeach = $('<label>>搜索：</label><input id="collectionListSeach"/>');
        $(collectionListSeach).on('input', onCollectionListSeachChange)
        $('.collection-list').before(collectionListSeach)
        // 滚动到底部触发数据加载，再返回
        $(".collection-list").animate({scrollTop: 9999}, 3000);
        $(".collection-list").animate({scrollTop: 0});
    }
    window.onload = function(){
        var collectBtn = $('.collect-btn');
        collectBtn.unbind('click', onCollectionListOpen);
        collectBtn.bind( 'click', onCollectionListOpen);
    }
})();