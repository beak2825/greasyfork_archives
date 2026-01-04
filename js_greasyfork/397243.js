// ==UserScript==
// @name         ktouch自动填充功能
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  KNX
// @author       Lang
// @match        https://api.pk535.cn/e/v0wlh5b
// @include      *://ktouch.vxhcm.com/*
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js


// @downloadURL https://update.greasyfork.org/scripts/397243/ktouch%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/397243/ktouch%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
setTimeout(function(){
    $(function(){
        $('.form-control:eq(0)').text('vinsoncao').focus();
        $('.form-control:eq(1)').text('曹志强').focus();
        $('.el-input__inner:eq(0)').val('上海').focus();
        $('.el-input__inner:eq(1)').val('研究院').focus();

         $(".el-checkbox__original").attr("checked",false);
        $('.el-checkbox').removeClass('is-checked').attr('aria-checked',false);
        $('.el-checkbox__input').removeClass('is-checked');

        $(".el-radio__original").attr("checked",false);
        $('.el-radio').removeClass('is-checked').attr('aria-checked',false);
        $('.el-radio__input').removeClass('is-checked').attr('aria-checked',false);

        $(".el-checkbox__original:eq(8)").attr("checked",true).focus();;
        $('.el-checkbox:eq(8)').addClass('is-checked').attr('aria-checked','true');
        $('.el-checkbox__input:eq(8)').addClass('is-checked');

        $(".el-radio__original:eq(2)").attr("checked",true).focus();;
        $('.el-radio:eq(2)').addClass('is-checked').attr('aria-checked','true');
        $('.el-radio__input:eq(2)').addClass('is-checked').attr('aria-checked','true');

         $(".el-radio__original:eq(3)").attr("checked",true).focus();;
        $('.el-radio:eq(3)').addClass('is-checked').attr('aria-checked','true');
        $('.el-radio__input:eq(3)').addClass('is-checked').attr('aria-checked','true');

        $(".el-radio__original:eq(7)").attr("checked",true).focus();;
        $('.el-radio:eq(7)').addClass('is-checked').attr('aria-checked','true');
        $('.el-radio__input:eq(7)').addClass('is-checked').attr('aria-checked','true');

        $(".el-radio__original:eq(9)").attr("checked",true).focus();;
        $('.el-radio:eq(9)').addClass('is-checked').attr('aria-checked','true');
        $('.el-radio__input:eq(9)').addClass('is-checked').attr('aria-checked','true');


    })
},5000)
