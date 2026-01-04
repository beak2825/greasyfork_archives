// ==UserScript==
// @name         javbuscss
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  手机端访问javbus重新定义css自适应页面
// @author       Lukezh
// @match        *://*.javbus.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414757/javbuscss.user.js
// @updateURL https://update.greasyfork.org/scripts/414757/javbuscss.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('#sd,#chart,#pt,.jav-footer,.login-wrap,.jav-logo,.fl_by,.biaoqi_bk_sj,#f_pst,.sd').hide();
    $('.mn,.wp,.t_f img').css({
        'width':'100%',
        'height':'auto',
    });
    $('#toptb,.z,#threadlist.tl th,#threadlist .post_inforight,.post_infolist').css({
        'min-width':'40px',
        'width':'auto',
    });
    $('.post_infolist_tit a img').css({
        'max-width':'500px',
        'height':'180px',
    });
})();