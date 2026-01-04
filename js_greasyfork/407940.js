// ==UserScript==
// @name                批量转换微博为自己可见，修改版
// @namespace           ohxiaobai
// @version             0.2.2
// @description         转换当前页微博为仅自己可见。进入“我的主页”，点击微博数目，目前不支持自动翻页。用完记得删除
// @author              ohxiaobai
// @match               *://weibo.com/*/profile?*
// @require             http://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @grant               none
// @compatible         firefox untested
// @compatible         chrome pass
// @compatible         opera untested
// @compatible         safari pass
// @downloadURL https://update.greasyfork.org/scripts/407940/%E6%89%B9%E9%87%8F%E8%BD%AC%E6%8D%A2%E5%BE%AE%E5%8D%9A%E4%B8%BA%E8%87%AA%E5%B7%B1%E5%8F%AF%E8%A7%81%EF%BC%8C%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/407940/%E6%89%B9%E9%87%8F%E8%BD%AC%E6%8D%A2%E5%BE%AE%E5%8D%9A%E4%B8%BA%E8%87%AA%E5%B7%B1%E5%8F%AF%E8%A7%81%EF%BC%8C%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

window.setInterval(function(){
    $('a[action-type="fl_menu"]')[0].click();
    $('a[action-type="fl_personalVisible"]')[0].click();
    $('a[action-type="ok"]')[0].click();
},1500)