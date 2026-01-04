// ==UserScript==
// @name         Buyer Show for Taobao
// @namespace    buyer_show_for_taobao
// @version      0.3
// @description  add buyer show button on icons line
// @author       tofu
// @include      http*://s.taobao.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/lodash.js/4.17.15/lodash.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396056/Buyer%20Show%20for%20Taobao.user.js
// @updateURL https://update.greasyfork.org/scripts/396056/Buyer%20Show%20for%20Taobao.meta.js
// ==/UserScript==

(function() {
    $(function(){
        let url = 'https://h5.m.taobao.com/ocean/privatenode/shop.html?sellerId=';
        let refreshButton = _.debounce(function(){
            let rows = $('div.m-itemlist div.item');
            rows.each(function(_index, _item){
                if($(_item).find('a.buyer-show-mark').length) return;

                let userId = $(_item).find('a[data-userid]');
                let row4 = $(_item).find('div.row.row-4 .feature-icons ul.icons');
                if(!userId || !row4) return;

                userId = userId.attr('data-userid');
                row4.append(
                    '<li class="icon" style="font-size: 12px;line-height: 16px">' +
                    '   <a class="buyer-show-mark" target="_blank" href="' + url + userId + '">Buyer Show</a></li>');
            });
        }, 300);

        refreshButton();

        $('body').on("DOMNodeInserted", "div.m-itemlist div.item", function (event) {
            refreshButton();
        });
    });
})();