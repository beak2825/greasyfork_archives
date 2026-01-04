// ==UserScript==
// @name         买家秀
// @namespace    taobao_buyer_show
// @version      3.4
// @description  用于在淘宝搜索页添加买家秀按钮
// @author       yyyy
// @include      http*://s.taobao.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377676/%E4%B9%B0%E5%AE%B6%E7%A7%80.user.js
// @updateURL https://update.greasyfork.org/scripts/377676/%E4%B9%B0%E5%AE%B6%E7%A7%80.meta.js
// ==/UserScript==

(function() {
    var api = 'http://chishenme.ztianzeng.com/?id=';

    $('body').on("DOMNodeInserted", ".item.J_MouserOnverReq", function (event) {
        if($(event.target).attr('class') == 'ww-inline ww-online'){
            var s = $(event.currentTarget).find('a[data-nid]');
            var href = api + s.attr('data-nid');
            if($(event.currentTarget).find('a.zeng').length == 0){
                $(event.currentTarget).find('.ctx-box.J_MouseEneterLeave').append('<a class=zeng target="view_window" href="'+href+'">买家秀</p>');
            }

            var adS = $('.item.J_MouserOnverReq.item-ad').find('a[data-nid]');
            if($('.item.J_MouserOnverReq.item-ad').find('a.zeng').length == 0){
                $('.item.J_MouserOnverReq.item-ad').find('.ctx-box.J_MouseEneterLeave').append('<a class=zeng target="view_window" href="'+api+adS.attr('data-nid')+'">买家秀</p>');
            }
        }
    });


})();