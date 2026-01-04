// ==UserScript==
// @name         百度首页简洁版
// @version      21.03.15
// @author       hzq
// @namespace    https://greasyfork.org/zh-CN/users/457634
// @match        https://www.baidu.com/
// @match        https://www.baidu.com/?bs_nt=1
// @match        https://www.baidu.com/?tn=baiduhome_pga
// @description  去除所有，只保留logo与搜索框
// @downloadURL https://update.greasyfork.org/scripts/397748/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%AE%80%E6%B4%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/397748/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%AE%80%E6%B4%81%E7%89%88.meta.js
// ==/UserScript==
document.getElementsByTagName('html')[0].style.overflow="auto";
document.getElementById('head_wrapper').style.position="relative";
document.getElementById('head_wrapper').style.paddingBottom="200px";

(function() {
    'use strict';

    //bottom
    var bottom_layer = document.getElementById("bottom_layer");
    bottom_layer.parentNode.removeChild(bottom_layer);

    //head左侧
    var s_top_left = document.getElementById("s-top-left");
    s_top_left.parentNode.removeChild(s_top_left);

    //head阴影
    var s_top_wrap = document.getElementById("s_top_wrap");
    s_top_wrap.parentNode.removeChild(s_top_wrap);


    //用户
    var u1 = document.getElementById("u1");
    u1.parentNode.removeChild(u1);

    //广告推荐
    var lm_new = document.getElementById("lm-new");
    lm_new.parentNode.removeChild(lm_new);

})();