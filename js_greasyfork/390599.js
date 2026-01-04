// ==UserScript==
// @name         CC monitor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.cc138001.com/
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390599/CC%20monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/390599/CC%20monitor.meta.js
// ==/UserScript==

//jQuery.noConflict();//一定要加这句,否则重复加载导致页面出错

(function() {
    'use strict';

    //var host='http://localhost:8080';
    var host='https://8.eeda123.com';
    var loadBtnDiv=function(){
        let result_box = $("#app .result-box .img");

        if(result_box){

            let button = $('<input type="button" id="loginBtn" '+
                           'style="display:none; width: 100px;height: 27px; margin-left: 72px;margin-top: 10px;color: red;font-size: 20px;background: antiquewhite;" value="登录">'+
                           '<input type="button" id="startMonitor" '+
                           'style="width: 100px;height: 40px; margin-right: 20px; color: red;font-size: 20px;border-radius: 5px;background: antiquewhite;" value="开始监听">');
            result_box.prepend(button);

        }else{
            console.log(' resetBtn not exist...');
        }
        //$('#PeriodId').parent().append('<span class="inlineblock" id="eeda_second" style="width:16px;">10</span>秒');
    }

    $(document).ready(function(){
        setTimeout(loadBtnDiv, 3000);//隔3秒再加载监听按钮
    });

    var sendPeriod=function(periodId, isStart){
        var noTd=$('.result-box .ballType-6 div');
        var noStr="";
        $.each(noTd, function(i, el){
            var classStr=$(el).attr('class');
            var no=classStr.replace(" active","").replace("num num-","");
            noStr+=","+no;
        });
        var line = periodId+noStr;
        console.log("server url: "+host+'/all_s/betView/putPeriod');
        console.log("para: {data: "+line+", is_start: "+isStart+"}");

        $.post(host+'/all_s/betView/putPeriod', {data: line, is_start: isStart}, function(data){
            console.log("server status: "+data);
        });
    };

    $('body').on('click', '#startMonitor', function(){
        var periodSpan=$("#app .result-box .periods span:eq(0)");
        var oldPeriod =periodSpan.text();
        console.log('当前期数:'+oldPeriod);
        //当前期数也要发送一次,作为起始局
        sendPeriod(oldPeriod, true);

        $('#app .result-box').css('box-shadow', '0 0 20px red');
        $("#app .result-box").bind("DOMNodeInserted",function(e){
            //console.log("DOMNodeInserted..");
            var period=periodSpan.text();
            var lottery=$('#app .result-box .lottery').text();
            //console.log(lottery);
            if(oldPeriod != period && lottery.length==0){
                oldPeriod = period;
                //console.log(period);
                sendPeriod(period, false);
            }
        });
    });

})(jQuery);