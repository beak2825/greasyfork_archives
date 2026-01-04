// ==UserScript==
// @icon            http://weibo.com/favicon.ico
// @name            taobao refund
// @author          kkevin
// @description     自动填入字符
// @match           https://refund2.taobao.com/dispute/applyRouter.htm?*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.0.4
// @namespace https://greasyfork.org/users/501359
// @downloadURL https://update.greasyfork.org/scripts/402056/taobao%20refund.user.js
// @updateURL https://update.greasyfork.org/scripts/402056/taobao%20refund.meta.js
// ==/UserScript==
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
(function () {
    
    var bizOrderId = getQueryString('bizOrderId')
    var type = getQueryString('type')
    var url = 'https://refund2.taobao.com/dispute/apply.htm?bizOrderId='+bizOrderId+"&type="+type
    window.location = url
})();
