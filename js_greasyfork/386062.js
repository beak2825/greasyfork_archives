// ==UserScript==
// @name         弹琴吧VIP播放脚本
// @namespace    https://www.yge.me/
// @version      0.2
// @description  需要安装他们的客户端,调用客户端播放的.
// @author       Y.A.K.E
// @match        http://www.tan8.com/yuepu-*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386062/%E5%BC%B9%E7%90%B4%E5%90%A7VIP%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/386062/%E5%BC%B9%E7%90%B4%E5%90%A7VIP%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    if ('javascript:;' ==  jQuery("#btn_play").attr('href')){
        var vhref ='/open_yp.php?ypid=' + ypid;
        jQuery("#btn_play").attr('href',vhref ).attr('target',"_blank").html('免VIP播放').removeAttr('id');
    }
})();