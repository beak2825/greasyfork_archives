// ==UserScript==
// @name         Lucky Monitor
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        http://f1.hy896666.xyz/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389741/Lucky%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/389741/Lucky%20Monitor.meta.js
// ==/UserScript==
jQuery.noConflict();//一定要加这句,否则重复加载导致页面出错

(function() {
    'use strict';
    //var host='http://localhost:8080';
    var host='http://8.eeda123.com';

    var loadDiv=function(){
        let resetBtn = $('#nav');
        let periodId = $('#PeriodId');
        if(resetBtn){
            var parent = resetBtn.parent();
            let button = $('<br><input type="button" id="startMonitor" '+
                           'style="width: 100px;height: 27px; margin-left: 72px;margin-top: 10px;color: red;font-size: 20px;background: antiquewhite;" value="开始监听">');
            parent.append(button);

        }else{
            console.log(' resetBtn not exist...');
        }
        //$('#PeriodId').parent().append('<span class="inlineblock" id="eeda_second" style="width:16px;">10</span>秒');
    }

    $(document).ready(function(){
        //console.log('test');
        setTimeout(loadDiv, 3000);//隔3秒再加载监听按钮
    });

    var sendPeriod=function(periodId, isStart){
        var noTd=$('.bet-DrawNumber').children('i');
        var noStr="";
        $.each(noTd, function(i, el){
            var classStr=$(el).attr('class');
            var no=classStr.replace(/ball ball/g,"");
            noStr+=","+no;
        });
        var line = periodId+noStr;
        $.post(host+'/all_s/betView/putPeriod', {data: line, is_start: isStart}, function(data){
            console.log("server status: "+data);
        });
    };

    $('body').on('click', '#startMonitor', function(){
        //$('.fn-bettype').click();//打开下注页面  会触发原网站频繁操作提醒

        var oldPeriodId=$('.bet-DrawPeriodId').html();
        console.log('当前期数:'+oldPeriodId);
        //当前期数也要发送一次,作为起始局
        sendPeriod(oldPeriodId, true);

        $('#bet').css('box-shadow', '0 0 20px red');
        $("#bet").bind("DOMNodeInserted",function(e){
            var periodId=$('.bet-DrawPeriodId').html();
            if(oldPeriodId != periodId){
                $('.fn-bettype:eq(1)').click();//点击一次页面, 免得页面自动登出
                oldPeriodId = periodId;
                console.log(periodId);
                sendPeriod(periodId, false);
            }
        });
    });

})(jQuery);