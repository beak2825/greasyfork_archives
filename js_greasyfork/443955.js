// ==UserScript==
// @name         Tony-pa-毫秒级
// @namespace    https://www.tonyblog.cn/
// @version      1.1.0
// @description  Tony-pa-毫秒级点击插件,带UI
// @author       Tony Liu
// @match        https://market.m.taobao.com/app/pm/m-bid/order/index.html?*
// @match        https://market.m.taobao.com/app/pm/m-bid/detail/index.html?*
// @match        https://h5.m.taobao.com/app/paimai/www/detail/index.html?*
// @match        https://h5.m.taobao.com/app/paimai/www/order/index.html?itemId=*
// @match        https://market.m.taobao.com/app/pm/base-details/new-m-bid-detail.html?*
// @match        https://res.m.suning.com/*
// @grant        none
// @icon         https://www.tonyblog.cn/favicon.ico
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/443955/Tony-pa-%E6%AF%AB%E7%A7%92%E7%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/443955/Tony-pa-%E6%AF%AB%E7%A7%92%E7%BA%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.pathname == '/app/pm/m-bid/detail/index.html' || location.pathname == '/app/pm/base-details/new-m-bid-detail.html' || location.pathname == '/app/paimai/www/detail/index.html'){
        setTimeout(function(){
            var getQueryString = function(name) {
                let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                let r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return decodeURIComponent(r[2]);
                };
                return null;
            }
            ,itemId = getQueryString('ItemId')
            ,url = 'https://market.m.taobao.com/app/pm/m-bid/order/index.html?itemId='+itemId+'&spm=a2129.11905957.order.1&pmid=8066793351_1649069911431&pmtk=20140647.0.0.0.share_item_detail.0.1&path=share_item_detail%2C22675942%2Cpaimai2021%2C26813340%2C11905957'
            ,r = confirm("打开直链？");
            if(r){
                window.location.href = url;
            }

        }, 1000 * 5)

    }
    if(location.pathname == '/app/pm/m-bid/order/index.html' || location.pathname == '/app/paimai/www/order/index.html'){
        var script = document.createElement('script');
        script.src = "https://api.tonyblog.cn/assets/Tony/tonypp.20220425.js?v="+(new Date()).getTime();
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    if(location.hostname == 'res.m.suning.com'){
        var script = document.createElement('script');
        script.src = "https://api.tonyblog.cn/assets/Tony/tony.suning.js?v="+(new Date()).getTime();
        document.getElementsByTagName('head')[0].appendChild(script);
    }
})();