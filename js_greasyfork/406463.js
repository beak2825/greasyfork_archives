// ==UserScript==
// @name         去淘宝小尾巴 领取自己的优惠券
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.1
// @description  Remove tail & Receive coupons
// @author       wujixian
// @include      *.taobao.com/*
// @include      *.tmall.com/*
// @include      *.pub.alimama.com/*
// @match        https://pub.alimama.com/promo/search/index.htm
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/406463/%E5%8E%BB%E6%B7%98%E5%AE%9D%E5%B0%8F%E5%B0%BE%E5%B7%B4%20%E9%A2%86%E5%8F%96%E8%87%AA%E5%B7%B1%E7%9A%84%E4%BC%98%E6%83%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/406463/%E5%8E%BB%E6%B7%98%E5%AE%9D%E5%B0%8F%E5%B0%BE%E5%B7%B4%20%E9%A2%86%E5%8F%96%E8%87%AA%E5%B7%B1%E7%9A%84%E4%BC%98%E6%83%A0%E5%88%B8.meta.js
// ==/UserScript==

(function () {
    if (window.location.pathname == "/item.htm") {
        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1)
                .match(reg);
            if (r != null) return r[2];
            return null;
        }
        var site = window.location.href.match(/^http(s)?:\/\/[^?]*/);
        var wd = getQueryString("wd");
        var id = getQueryString("id");
        var q = getQueryString("q");
        var pureUrl;
        if (wd != null) {
            pureUrl = site[0] + "?wd=" + wd;
        } else if (id != null) {
            pureUrl = site[0] + "?id=" + id;
        } else if (q != null) {
            pureUrl = site[0] + "?q=" + q;
        } else if (site[0].substr(site[0].length - 13) == "view_shop.htm") {
            pureUrl = window.location.protocol + "//" + window.location.host;
        } else {
            pureUrl = site[0];
        }
        if (pureUrl != window.location.href) {
            window.history.pushState({}, 0, pureUrl );
        }
        var oDiv = document.getElementsByClassName('tb-action');
        var showBtn = '<div class="tb-btn-sku tb-btn-buy"><a href="https://pub.alimama.com/promo/search/index.htm?fn=search&q=' + pureUrl + '" target="view_window" >查询优惠券</a></div>';
        oDiv[0].innerHTML += showBtn
    }
    if (window.location.pathname == "/promo/search/index.htm") {
        var str = decodeURIComponent(window.location);
        var url = str.match(/(\S*)item.htm/)[1] + 'item.htm?id=' + (str.match(/id=(\S*)/)[1]);
        if (url != window.location.href) {
            location.href = url;
        }
    }
})();

