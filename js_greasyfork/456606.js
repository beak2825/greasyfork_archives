// ==UserScript==
// @name         修复批邮系统脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修复批邮系统新增组件时的问题，切换到doba时候宽度调整为540
// @author       QF
// @match        http://perseus.vemic.com/*
// @icon         http://image.vemic.com/images/logo.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456606/%E4%BF%AE%E5%A4%8D%E6%89%B9%E9%82%AE%E7%B3%BB%E7%BB%9F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/456606/%E4%BF%AE%E5%A4%8D%E6%89%B9%E9%82%AE%E7%B3%BB%E7%BB%9F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.J-mod-item-thumb').off('click');
    $('.J-mod-item-thumb').on('click', function() {
        var comp_id = $(this).data('comp_id');
        $.ajax({
            type: 'post',
            url: '/fetch-component-content/' + comp_id,
            success: function (compHtml) {
                //修复添加组件请求的冗余script
                var fixHtml = compHtml.replace(/<script.*>.*<\/script>/ims, "")
                $('#tbody').append(fixHtml);
            },
            error: function (err) {
                console.log(err);
            }
        });
        return false;
    });


    var ChangeMAILTYPE = function (code) {
        var webURL = $('#inputWEBUrl').val();
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        $.ajax({
            url:'/get-footer-content/'+ code,
            type:'POST',
            success:function(data){
                if(!data.data){
                    return
                }
                $('#header').html('').html(data.data.mail_header.replace('{{weburl}}',webURL).replace('{{year}}', year).replace('{{month}}', month));
                $('#footer').html('').html(data.data.mail_footer.replace('{{year}}', year));
                $('#mail_footer').val(code);
            },
            error: function(err){
                console.error(err)
            }
        })
    };

    var mailType = $('#J-mailType'),
        lang = mailType.find('.J-lang'),
        type = mailType.find('.J-type');
    var defaultCode = $('#mail_footer').val() || '61';
    ChangeMAILTYPE(defaultCode);
    type.off('click');

    type.on('click','span',function(){
        var code = $(this).attr('data-type');

        //选择到doba 540时候，更改为540宽度。
        var w = code === '61'?540:700;
        $('.m-full-width').attr('width',w).width(w);

        $(this).addClass('on').siblings('span').removeClass('on');

        ChangeMAILTYPE(code);
        changeTypeMobilePhoneAdaptation();

    });

    var changeTypeMobilePhoneAdaptation = function(){
        //通过文字“手机适应”匹配
        setTimeout(function(){
            if($('.J-type span:contains("手机适应")').hasClass('on') && !$('.J-type span:contains("手机适应")').is(":hidden")){
                $('.J-mod-item-thumb').hide()
                $('.J-mod-item-thumb:contains("手机适应")').show()
            }else{
                $('.J-mod-item-thumb').show()
                $('.J-mod-item-thumb:contains("手机适应")').hide()
            }
        }, 100)
    }












})();