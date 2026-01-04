// ==UserScript==
// @name         隐藏片源网广告
// @namespace    http://pianyuan.net/
// @version      0.1.3
// @description  隐藏第一次进来的弹窗广告
// @author       CuminLo
// @match        *://pianyuan.net/*
//@icon          http://gaoqing.la/wp-content/themes/Loostrive/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37930/%E9%9A%90%E8%97%8F%E7%89%87%E6%BA%90%E7%BD%91%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/37930/%E9%9A%90%E8%97%8F%E7%89%87%E6%BA%90%E7%BD%91%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = "cpmpop_cm_t4" + "="+true+";expires=" + exp.toGMTString();
    document.cookie = "ModalShown" + "="+true+";expires=" + exp.toGMTString();
    $("#myModal").modal("hide");
    if($(".bd").parent().attr("class").indexOf("AD") != -1){$(".bd").parent().hide()}
})();