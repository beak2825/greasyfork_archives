// ==UserScript==
// @name         萌娘百科黑幕转粉幕,删除线变下划线
// @namespace    873637398@qq.com
// @version      0.1
// @description  萌娘百科黑幕转粉幕,删除线变下划线,黑幕是真的影响阅读.本来是想完全删除,但是这样就看不出是不是特殊吐槽了,就添加了粉幕,这样既能做到提示又能不影响阅读.
// @author       子明
// @match        *://*.moegirl.org/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390933/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E9%BB%91%E5%B9%95%E8%BD%AC%E7%B2%89%E5%B9%95%2C%E5%88%A0%E9%99%A4%E7%BA%BF%E5%8F%98%E4%B8%8B%E5%88%92%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/390933/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E9%BB%91%E5%B9%95%E8%BD%AC%E7%B2%89%E5%B9%95%2C%E5%88%A0%E9%99%A4%E7%BA%BF%E5%8F%98%E4%B8%8B%E5%88%92%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
        $(".heimu").css("background-color","#ff99ff");
        $(".heimu a").css("background-color","#ff99ff");
        $("a .heimu").css("background-color","#ff99ff");
        $(".heimu a.new").css("background-color","#ff99ff");
        $("del").css("text-decoration","underline");
})();