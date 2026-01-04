// ==UserScript==
// @name         邦达搜显示隐藏的内容
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  新增按钮，显示隐藏的邮箱内容
// @author       ZMeng
// @match        http://i.bondex.com.cn/Home/BondexSou
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31221/%E9%82%A6%E8%BE%BE%E6%90%9C%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E7%9A%84%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/31221/%E9%82%A6%E8%BE%BE%E6%90%9C%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E7%9A%84%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.input-group-btn.is-fire').append('<button class="btn btn-default" type="button" onclick="showhidden()">显示隐藏内容</button>');
    $('.input-group-btn.is-fire').find('.btn-default').off().on('click',function(){
        $('#AddressBook_DataTable tbody tr').each(function(){
            var $mail=$('.text-center .bg-tooltip');
            var $a=$mail.find('a');
            $a.each(function(){
                var $a_txt=	$(this);
                //$a_txt.toggle('hover')
                $a_txt.removeAttr('data-toggle');
                var txt=$a_txt.attr('title').replace('<br />点击图标给 TA 发邮件','');
                $a_txt.append(txt);
            });
            $a.find('.fa').remove();
            $mail.find('.fa-1x').css('font-size','12px');
        });
    });
})();

