// ==UserScript==
// @name         天猫商家活动中心提取商品信息
// @namespace    http://leironghua.com/
// @version      0.1
// @description  天猫商家活动中心提取商品信息。
// @author       雷荣华
// @include      *//tmc.tmall.com/campaign/specialItemApplyList.htm*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/39727/%E5%A4%A9%E7%8C%AB%E5%95%86%E5%AE%B6%E6%B4%BB%E5%8A%A8%E4%B8%AD%E5%BF%83%E6%8F%90%E5%8F%96%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/39727/%E5%A4%A9%E7%8C%AB%E5%95%86%E5%AE%B6%E6%B4%BB%E5%8A%A8%E4%B8%AD%E5%BF%83%E6%8F%90%E5%8F%96%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.LRH = {
        totalPage : 0,
        itemData :[]
    };
    // Your code here...
    $('.m11-search2').append('<button  class="sui-btn sui-btn-large" id="_myBtn">提取信息</button><span id="_extract_status"></span>');
    $('#_myBtn').on('click',function(){
        window.LRH.totalPage = $('.ui-page-skip').text().match(/\d+/g)[0];
        window.LRH.itemData = [];
        doPage(1);
        return false;
    });

    function doPage(page){
        //window.LRH.totalPage
        if(page >window.LRH.totalPage ){
            $('#_extract_status').text('正在处理'+ window.LRH.itemData.length +'个记录的详细信息……');
            var content = "商品名称\t商品ID\t商品状态\t一口价\t专柜价\t活动价\t折扣范围\t设定状态";
            $.each(window.LRH.itemData,function(i,a){
                content += "\r\n" + a.商品名称+"\t"+a.商品ID+"\t"+a.商品状态+"\t"+a.一口价+"\t"+a.专柜价+"\t"+a.活动价+"\t"+a.折扣范围+"\t"+a.设定状态;
            });
            GM_setClipboard(content,'text');
            $('#_extract_status').text('处理完成，共'+ window.LRH.itemData.length +'个记录已复制到剪贴板。');
            setTimeout(function () { alert($('#_extract_status').text()); }, 200);

            return ;
        }
        $('#_extract_status').text('正在加载第' + page + '/' +  window.LRH.totalPage +'页的数据……');
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                _tb_token_:$('input[name=_tb_token_]').val(),
                curpage:page,
                curtab: 1,
                skuCurtab: 1
            },
            dataType: 'text',
            error:function( jqXHR,  textStatus,  errorThrown){},
            complete:function(  jqXHR,  textStatus ){
            },
            success: function( data,  textStatus,  jqXHR){
                $(data).find('.sui-table tbody tr').each(function(index,item){
                    var me = $(item);
                    window.LRH.itemData.push({
                        商品名称: $.trim(me.find('td:eq(1) a').text()),
                        商品ID:me.find('td:eq(1) p').text().replace('商品ID：',''),
                        商品状态: $.trim(me.find('td:eq(2)').text()),
                        一口价: $.trim(me.find('td:eq(3)').text()),
                        专柜价: $.trim(me.find('td:eq(4)').text()),
                        活动价: $.trim(me.find('td:eq(5)').text()),
                        折扣范围: $.trim(me.find('td:eq(6)').text()),
                        设定状态:$.trim(me.find('td:eq(7)').text())
                    });
                });
                console.info(page +'页加载完成共有' +window.LRH.itemData.length + '个商品' );
                $('#_extract_status').text('10秒后开始加载第' + (page+1) + '/' +  window.LRH.totalPage +'页的数据……');
                setTimeout(function(){
                    doPage(page + 1);
                }, 5000);
            }
        });

    }

})();