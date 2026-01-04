// ==UserScript==
// @name         淘宝链接自动精简
// @version      0.2
// @author       me
// @include      https://item.taobao.com/item.htm?*
// @include      https://detail.tmall.com/item.htm?*
// @grant        none
// @namespace https://greasyfork.org/users/174880
// @description 有什么好说的
// @downloadURL https://update.greasyfork.org/scripts/390613/%E6%B7%98%E5%AE%9D%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/390613/%E6%B7%98%E5%AE%9D%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
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
    if(pureUrl != window.location.href){
        window.history.pushState({},0,pureUrl);
        //window.location.href = pureUrl;
    }

})();