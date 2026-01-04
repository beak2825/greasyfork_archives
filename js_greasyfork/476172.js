// ==UserScript==
// @name         查询capture_record_ID兼容新旧版后台
// @namespace    capture_records_id
// @version      0.0.6
// @description  capture_records_id
// @author       daiy
// @match        https://mt.myscrm.com.cn/sub-qdfk-admin/page/check_console/detail/*
// @match        https://qmyxcg.myscrm.com.cn/sub-qdfk-admin/page/check_console/detail*
// @match        https://myscrm-ykht.jinmaodigital.com/sub-qdfk-admin/page/check_console/detail*
// @match        https://myscrm-ykht.gemdale.com/sub-qdfk-admin/page/check_console/detail*
// @grant        none
// @connect      https://*.myscrm.com.cn
// @connect      https://myscrm-ykht.jinmaodigital.com
// @connect      https://myscrm-ykht.gemdale.com
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476172/%E6%9F%A5%E8%AF%A2capture_record_ID%E5%85%BC%E5%AE%B9%E6%96%B0%E6%97%A7%E7%89%88%E5%90%8E%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/476172/%E6%9F%A5%E8%AF%A2capture_record_ID%E5%85%BC%E5%AE%B9%E6%96%B0%E6%97%A7%E7%89%88%E5%90%8E%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;

    function getCustomerID()
    {
        return new URLSearchParams(window.location.search).get('id');
    }

    function addButton(){
        let btnloc = $('.ant-tabs-nav-wrap')
        let html = '<form style="margin-bottom:10px;margin-top:10px;margin-left:30px;"><div><input name="time" id="input" class="input" placeholder="不输入时间则查询所有记录">'
        +'<buttom id="time-submit-btn" class="buttom">按时间查询capture_record_ID</buttom></div></form>'
        btnloc.append(html)

        $('#time-submit-btn').click(() => {
            $.ajax({
                type:'get',
                url:'/api/index.php?r=qdfk/customer/get-timeline',
                data:{qdfk_customer_id:getCustomerID()},
                success:function(data){ print(data) }
            })
        })
    }

    function print(data){
        let time = $.trim($('#input').val())
        let flows = data.data.details.capture_records;
        if(data.data.details.capture_records != ''){
            $('#customer_ID').remove();
            $('#head').remove();
            $('#flows').remove();
            $('.bottom-btn-content').append('<tr id="customer_ID"><td style="font-size:15px;"><b>customer_ID：</b>'+getCustomerID()+'</td></tr>')
            $('.bottom-btn-content').append('<div id="head"><table style="font-size:15px;text-align:center;padding:3px;"><tr><td style="width:157px;"><b>抓拍时间</b></td><td style="width:318px;"><b>capture_record_ID</b></td></tr></table></div>')
            $('.bottom-btn-content').append('<div id="flows"><table style="font-size:15px;text-align:center;max-height:180px;overflow-y:auto;display:block;"></table></div>')
        }else{ alert('该客户没有抓拍流水记录！'); return }

        let n = 0;
        if (time != ''){
            for(let i in flows){
                if (flows[i].time_for_display == time) {
                    $('#flows table').append(
                        "<tr>"+
                        "<td>"+flows[i].time_for_display+"</td>"+
                        "<td>"+flows[i].flow_id+"</td>"+
                        "</tr>"
                    );
                    n++;
                }
            }
            if(n != 0){
                $('#flows').append('<div style="margin-top:10px;width:350px">'+n+'条数据<buttom id="clear" class="buttom">清除查询结果</buttom></div>')
                $('#flows tr td').css({border:'3px solid black',padding:'3px'})
                addCss()
                $('#clear').click(function(){
                    $('#customer_ID').remove();
                    $('#head').remove();
                    $('#flows').remove();
                })
                return }
            alert('时间错误！请参照抓拍流水确认正确抓拍时间！')
            $('#customer_ID').remove();
            $('#head').remove();
            $('#flows').remove();
        } else if (time == '') {
            for(let i in flows){
                $('#flows table').append(
                    "<tr>"+
                    "<td>"+flows[i].time_for_display+"</td>"+
                    "<td>"+flows[i].flow_id+"</td>"+
                    "</tr>"
                );
                n++
            }
            $('#flows').append('<div style="margin-top:10px;width:350px">'+n+'条数据<buttom id="clear" class="buttom">清除查询结果</buttom></div>')
            $('#flows tr td').css({border:'3px solid black',padding:'3px'})
            addCss()
            $('#clear').click(function(){
                $('#customer_ID').remove();
                $('#head').remove();
                $('#flows').remove();
            })
        }

    }


    function addCss() {
        $('.input').css('margin-right', '10px')
        $('.input').css('height', '30px')
        $('.input').css('padding', '1px 2px;')
        $('.input').css('line-height', '18px')
        $('.input').css('width', '200px')

        $('.buttom').css('background-color', '#f65c2d')
        $('.buttom').css('color', 'white')
        $('.buttom').css('width', '210px')
        $('.buttom').css('padding', '6px 12px')
        $('.buttom').css('line-height', '17px')
        $('.buttom').css('border-radius', '5px')
        $('.buttom').css('display', 'inline-block')
        $('.buttom').css('text-align', 'center')
        $('.buttom').css('cursor', 'pointer')
        $('.buttom').css('font-size', '14px')
    }

    function init() {
        addButton()
        addCss()
    }

    if(window.location.host == 'mt.myscrm.com.cn'){
        setTimeout(init,7000)
        setTimeout(function(){if($('#input').length != '1'){alert('查询capture_record_ID插件加载超时')}},8000)
    }else{
        setTimeout(init,3000)
        setTimeout(function(){if($('#input').length != '1'){alert('查询capture_record_ID插件加载超时')}},4000)
    }

})();