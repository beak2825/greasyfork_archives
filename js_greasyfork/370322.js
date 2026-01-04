// ==UserScript==
// @name         聚划算筛选
// @namespace    squkw
// @version      0.3
// @description  聚划算品牌团根据价格筛选
// @author       squkw
// @match        http*://content.tmall.com/wow/pegasus/subject/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/370322/%E8%81%9A%E5%88%92%E7%AE%97%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/370322/%E8%81%9A%E5%88%92%E7%AE%97%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $('body').append('<style>.select_div{background-color: #8035fb;text-align: center;}' +
        '.select_input{-web-kit-appearance:none !important;-moz-appearance: none !important;width: 96px;margin:1px;font-size:1.4em;border-radius:5px;border:1px solid #c8cccf;}' +
        '.select_btn{color: #fff}' +
        '.select_btn:hover{background: #000;opacity: .6;filter: alpha(opacity=60);width: 100%;display: block;}</style>');
    var nav = $('.Fashion_public_right_nav');
    nav.prepend('<div class="select_div">' +
        '<input type="text" class="select_input" name="select_min" placeholder="最低价">' +
        '<input class="select_input" type="text" name="select_max" placeholder="最高价">' +
        '<a href="javascript:;" class="select_btn"><div>筛选</div></a></div>');

    $('.select_btn').click(function (e) {
        var prices = $('.yen');
        var select_min = parseInt($('[name="select_min"]').val());
        var select_max = parseInt($('[name="select_max"]').val());
        prices.each(function () {
            var price = parseInt(this.innerHTML);
            if (price < select_min || price > select_max) {
                $(this).parents('.item-big-v2').css('display','none');
                $(this).parents('.item-small-v3').css('display','none');
            }else {
                $(this).parents('.item-big-v2').css('display','block');
                $(this).parents('.item-small-v3').css('display','block');
            }
        });
    });

})();