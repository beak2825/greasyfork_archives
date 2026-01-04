// ==UserScript==
// @name         淘宝聚划算报名商品记录提取
// @namespace    http://leironghua.com/
// @version      0.8
// @description  获取淘宝聚划算报名的商品宝贝信息
// @author       雷荣华
// @include      https://freeway.ju.taobao.com/front/signinDetail.htm*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @iconURL      https://g.alicdn.com/ju/common/1.3.6/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/39399/%E6%B7%98%E5%AE%9D%E8%81%9A%E5%88%92%E7%AE%97%E6%8A%A5%E5%90%8D%E5%95%86%E5%93%81%E8%AE%B0%E5%BD%95%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/39399/%E6%B7%98%E5%AE%9D%E8%81%9A%E5%88%92%E7%AE%97%E6%8A%A5%E5%90%8D%E5%95%86%E5%93%81%E8%AE%B0%E5%BD%95%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function load(){
        // var leftTime = $('#_extract_status').attr('data-lefttime');
        if($('.J-search-loading').css("display") != "none")  {

            // 正在加载
            return;
        }
        if($('.J-search-next').hasClass('disabled')){
            run();
            //去掉定时器的方法，已经加载完成
            window.clearInterval(window.t1);
            return;
        }

        $('.J-search-next').trigger('click');
        $('#_extract_status').text('已有：'+ $('#goods-list tbody tr').length +'个商品，正在加载更多……');
    }

    function run(){

        var data = [];
        $('#goods-list tbody tr').each(function(index,item){
            var me = $(item);
            var obj = {
                name:me.find('td:first a:last').text(),
                id:me.find('td:first div:last').text(),
                activityPrice:me.find('td:eq(1)').text().split(' ')[0],// 活动价
                originalPrice:me.find('td:eq(1)').text().split(' ')[1], // 店铺价
                soldCount:me.find('td:eq(2)').text().split(' ')[0], // 已售数
                itemCount:me.find('td:eq(2)').text().split(' ')[1], // 总数
                statusMsg:me.find('td:eq(3) span:first').text() // 状态
            };
            obj.id = obj.id.replace(obj.name + "ID: ","");
            // 剩余数量
            obj.overCount = obj.itemCount - obj.soldCount;
            // obj.activityPrice = parseFloat(obj.activityPrice).toFixed(2);
            // obj.originalPrice = parseFloat(obj.originalPrice).toFixed(2);
            data.push(obj);

        });
        // 排序
        data.sort(function(a,b){
            return a.overCount - b.overCount;
        });
        console.info(data);
        var content = "商品名称\t淘宝ID\t活动价\t店铺价\t报名数\t已售数\t剩余数\t商品状态";
        $(data).each(function(index,item){
            content +="\r\n" + item.name + "\t" + item.id + "\t" + item.activityPrice + "\t" + item.originalPrice + "\t" + item.itemCount + "\t" + item.soldCount + "\t" + item.overCount +"\t" +  item.statusMsg;
        });
        $('#_extract_loading').hide();
        $('#_extract_status').text('处理完成，' + $('#goods-list tbody tr').length + '个商品信息已复制到剪贴板！');
        GM_setClipboard(content,'text');
        setTimeout(function () { alert('处理完成，' + $('#goods-list tbody tr').length + '个商品信息已复制到剪贴板！'); }, 200);
    }


    var btn=$("<input type='button' id='_extract' class='btn btn-jhs J-search-submit' value='提取商品信息' />");
    $('#search-form').append(btn);
    $('#search-form').append('<span style="margin-left: 5px"><span class="icon icon-loading icon-loading-animate" id="_extract_loading" style="display: none;"></span><span id="_extract_status" style="font-size: 12px;"></span></span>');
    $('#_extract').bind('click',function(){
        $('#_extract_loading').show();
        $('#_extract_status').text('开始处理……');
        window.t1 = window.setInterval(load,1000);
    });
})();

