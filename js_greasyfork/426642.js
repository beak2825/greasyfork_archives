// ==UserScript==
// @name         淘宝卖家中心
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  配合后台服务器保存宝贝的一些数据
// @author       ItSky71
// @include      https://item.manager.taobao.com/taobao/manager/render.htm*
// @include      https://trade.taobao.com/trade/itemlist/list_sold_items.htm*
// @include      https://rate.taobao.com/sellercenter/*
// @include      https://wuliu.taobao.com/user/order_list_new.htm*
// @include      https://trade.taobao.com/trade/detail/tradeSnap.htm*
// @include      https://sycm.taobao.com/*
// @require      https://cdn.bootcss.com/zui/1.9.2/lib/jquery/jquery.js
// @require      https://cdn.bootcss.com/zui/1.9.2/js/zui.min.js
// @resource    zuicss     https://gitee.com/fireloong/json-data/raw/master/zui.min.css
// @connect      taobao.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/426642/%E6%B7%98%E5%AE%9D%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83.user.js
// @updateURL https://update.greasyfork.org/scripts/426642/%E6%B7%98%E5%AE%9D%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    (function(console){
        console.save = function(data, filename){
            if(!data) {
                console.error('Console.save: No data found!')
                return;
            }
            if(!filename) filename = 'console.json'
            if(typeof data === "object"){
                data = JSON.stringify(data, undefined, 4)
            }
            var blob = new Blob([data], {type: 'text/json'}),
                e = document.createEvent('MouseEvents'),
                a = document.createElement('a')
            //var text = await blob.text()
            a.download = filename
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
            e = new MouseEvent ("click");
            //e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null) !!!deprecated!!!
            a.dispatchEvent(e)
        }
    })(console)

    let webThis = function(url){
        return window.location.href.slice(0, url.length) === url;
    }

    let globalCssStyle = '#site-nav-content,#page{width:auto !important;padding:0 15px;}#page .layout{width:auto;}';

    if(webThis('https://item.manager.taobao.com/taobao/manager/render.htm')){
        /*
         * 宝贝管理页面
         */
        globalCssStyle += '#header .indexwrapper-GUjLy{width:auto !important;padding:0 15px;}.indexcontainer-3nxzp .indexwrapper-2AunY{width:1500px;}';
        globalCssStyle += '.indexcontainer-3nxzp .indexitem-2EcDH{width:300px;}.mc-o-ads-slider{width:986px}ins{left:50%;margin-left:-500px !important;}';
        let setFilterWidth = function(){
            $('.sell-o-cat-list > .cat-sub-items').css('width', '250px');
        };
        setFilterWidth();
        $('.filter-catlist-container > .show-more-info').on('click', function(){
            setTimeout(setFilterWidth, 300);
        });
        setTimeout(function(){
            $('.sell-newtable-container .next-table-header table > colgroup > col:eq(1)').after('<col style="width: 110px;">');
            $('.sell-newtable-container .next-table-header table > tbody > tr > th:eq(1)').after('<th rowspan="1" class="next-table-header-node"><div class="next-table-cell-wrapper">下单地址</div></th>');
            $('.sell-newtable-container .next-table-body table > colgroup > col:eq(1)').after('<col style="width: 110px;">');
            $('.sell-newtable-container .next-table-header table > colgroup > col:eq(7)').css('width','90px');
            $('.sell-newtable-container .next-table-header table > colgroup > col:eq(8)').css('width','90px');
            $('.sell-newtable-container .next-table-body table > colgroup > col:eq(7)').css('width','90px');
            $('.sell-newtable-container .next-table-body table > colgroup > col:eq(8)').css('width','90px');
        },800);

        let fun = {
            getQueryVariable: (variable) => {
                let query = window.location.search.substring(1);
                let vars = query.split("&");
                for (let i=0;i<vars.length;i++){
                    let pair = vars[i].split('=');
                    if(pair[0] == variable) {
                        return pair[1];
                    }
                }
                return null;
            },
            successAction: (el, data) => {
                let thisRow = $(el);
                $.each(data, function(k,v){
                    thisRow.find('.next-table-cell.first .btn-modal-edit').data(k, v);
                });
                thisRow.find('.next-table-cell:eq(1) .mc-tag-list > div > .row-artno').remove();
                thisRow.find('.next-table-cell:eq(2) > .next-table-cell-wrapper > .source_url').remove();
                thisRow.find('.next-table-cell:eq(1) .mc-tag-list > div').append('<span class="row-artno">'+data.artno+'</span>');
                thisRow.find('.next-table-cell:eq(2) > .next-table-cell-wrapper').append('<div class="source_url"></div>');
                if(data.source.length){
                    for(let i=0;i<data.source.length;i++){
                        if (data.source[i].url !== ''){
                            thisRow.find('.next-table-cell:eq(2) > .next-table-cell-wrapper > .source_url').append('<a href="'+data.source[i].url+'" target="_blank">'+data.source[i].title+'<i class="icon icon-external-link"></i></a>');
                        }
                    }
                }
            }
        };
        let interval = setInterval(main, 1000);
        let cycle = 1;
        function main(){
            let row = $('.next-table-body .next-table-row');
            if(row.length > 0){
                clearInterval(interval);
                let zuicss = GM_getResourceText('zuicss');
                GM_addStyle(zuicss);
                let cssStyle = '.btn:focus{outline:none;}.row-artno{color:999;}.form-sources > .row{margin-bottom:5px;}.form-sources > .row > div:first-child{padding-right:0}.form-sources > .row > div:last-child{padding-left:0}';
                cssStyle += '.source_url{padding-left:20px;}.source_url > a {display:block;position: relative;line-height:25px;}.source_url > a > .icon{position: absolute;top:5px;left:-18px;cursor: default;color:#666}';
                GM_addStyle(cssStyle);
                let modalHtml = '<div id="myModal" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">';
                modalHtml+='<span aria-hidden="true">×</span><span class="sr-only">关闭</span></button><h4 class="modal-title">编辑备注</h4></div><div class="modal-body"><p>主题内容...</p></div>';
                modalHtml+='<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button><button type="button" class="btn btn-primary submit">保存</button></div></div></div></div>';
                $('body').append(modalHtml);
                let tab = fun.getQueryVariable('tab');
                row.each(function(){
                    let rowThis = $(this);
                    let rowId = rowThis.find('.next-table-cell:eq(1) .product-desc-span:eq(1)').text().slice(3);
                    rowThis.addClass('item-id-'+rowId);
                    let buttonHtml = '<button type="button" class="btn btn-primary btn-sm btn-modal-edit"  title="编辑备注" data-toggle="tooltip" data-placement="top"><i class="icon icon-edit-sign"></i></button>';
                    rowThis.find('.next-table-cell.first').append(buttonHtml);
                    rowThis.find('.next-table-cell:eq(1)').after('<td class="next-table-cell"><div class="next-table-cell-wrapper"></div></td>');
                    $.ajax({
                        type: 'GET',
                        url: 'http://127.0.0.1:8000/api/v2/goods/'+rowId,
                        success:function(data){
                            if(data){
                                $.each(data, function(k,v){
                                    rowThis.find('.next-table-cell.first .btn-modal-edit').data(k, v);
                                });
                                rowThis.find('.next-table-cell:eq(1) .mc-tag-list > div').append('<span class="row-artno">'+data.artno+'</span>');
                                rowThis.find('.next-table-cell:eq(2) > .next-table-cell-wrapper').append('<div class="source_url"></div>');
                                if(data.source.length){
                                    for(let i=0;i<data.source.length;i++){
                                        if (data.source[i].url !== ''){
                                            rowThis.find('.next-table-cell:eq(2) > .next-table-cell-wrapper > .source_url').append('<a href="'+data.source[i].url+'" target="_blank">'+data.source[i].title+'<i class="icon icon-external-link"></i></a>');
                                        }
                                    }
                                }
                            }else{
                                rowThis.find('.next-table-cell.first .btn-modal-edit').data('item_id', rowId);
                            }
                        },
                        error: function(){
                            rowThis.find('.next-table-cell.first .btn-modal-edit').data('item_id', rowId);
                        }
                    });
                });
                $('.btn-modal-edit').click(function(){
                    let item_id = $(this).data('item_id');
                    let goods_id = $(this).data('id') == undefined ? '': $(this).data('id');
                    let artno = $(this).data('artno') == undefined ? '' : $(this).data('artno');
                    let source = $(this).data('source') ? $(this).data('source') : [];
                    let formHtml = '<form id="goods_form" class="form-horizontal"><input type="hidden" name="id" value="'+goods_id+'"/>';
                    formHtml += '<div class="form-group"><label class="col-sm-2">商品 ID</label><div class="col-sm-10"><p class="form-control-static">'+$(this).data('item_id')+'<input type="hidden" name="item_id" value="'+item_id+'"/></p></div></div>';
                    formHtml += '<div class="form-group"><label for="goods_number" class="col-sm-2">货号</label><div class="col-md-6 col-sm-10"><input type="text" id="goods_number" class="form-control" name="artno" value="'+artno+'" autocomplete="off"/></div></div>';
                    formHtml += '<div class="form-group"><label class="col-sm-2">货源地址<button class="btn btn-sm " type="button"><i class="icon icon-plus"></i></button></label><div class="col-sm-10 form-sources">';
                    let sourceLen = 0;
                    if(source.length === 0){
                        sourceLen = 2
                    }else{
                        source.sort((a, b) => a.sort - b.sort);
                        sourceLen = source.length;
                    }
                    for(let i = 0; i < sourceLen; i++){
                        formHtml += '<div class="row"><div class="col-sm-2"><input type="text" class="form-control" name="source['+i+'][title]" value="'+(source.length>0?source[i].title:'')+'" autocomplete="off" placeholder="标题"/></div>';
                        formHtml += '<div class="col-sm-8"><input type="text" class="form-control" name="source['+i+'][url]" autocomplete="off" value="'+(source.length>0?source[i].url:'')+'" placeholder="链接"/></div>';
                        formHtml += '<div class="col-sm-2"><input type="number" class="form-control" name="source['+i+'][sort]" value="'+i+'" value="'+(source.length>0?source[i].sort:'')+'" autocomplete="off" placeholder="排序"/></div></div>';
                    }
                    formHtml += '</div></div></form>';
                    $('#myModal .modal-body').html(formHtml);
                    $('#myModal').modal({show:true,moveable:true});
                });
                $('#myModal .submit').on('click', function(){
                    let formSerialize = $('#goods_form').serializeArray();
                    let formObject = {};
                    let reg = /\[[\w]*\]/g
                    $.each(formSerialize, function(i,n){
                        if(n.name.slice(-1) === ']'){
                            let childNodes = [];
                            let str = '["'+n.name.slice(0,n.name.indexOf('['))+'"]';
                            childNodes.push('if(formObject'+str+'===undefined){formObject'+str+'={};}');
                            $.each(n.name.match(reg), function(x,y){
                                if(y.slice(1,-1) === ''){
                                    childNodes.push('if(formObject'+str+'===undefined){formObject'+str+'=[];}');
                                }else{
                                    childNodes.push('if(formObject'+str+'===undefined){formObject'+str+'={};}');
                                    str += '["'+y.slice(1,-1)+'"]';
                                }
                            });
                            childNodes.splice(childNodes.length-2,1)
                            childNodes.forEach(function(item){
                                eval(item);
                            });
                            eval('if($.type(formObject'+str+')==="array"){formObject'+str+'.push(n.value);}else{formObject'+str+'=n.value}');
                        }else{
                            formObject[n.name] = n.value;
                        }
                    });
                    let formObjectSource = [];
                    $.each(formObject.source, function(a,b){
                        formObjectSource.push(b);
                    });
                    formObject.source = formObjectSource;
                    if (formObject.id === '') {
                        $.post('http://127.0.0.1:8000/api/v2/goods/new',JSON.stringify(formObject), function(data){
                            fun.successAction('.item-id-'+data.item_id, data);
                        });
                    } else {
                        $.ajax({
                            url: 'http://127.0.0.1:8000/api/v2/goods/update',
                            type: 'PUT',
                            data: JSON.stringify(formObject),
                            success: function(data){
                                fun.successAction('.item-id-'+data.item_id, data);
                            }
                        });
                    }
                    $('#myModal').modal('hide','fit');
                });
                $('[data-toggle="tooltip"]').tooltip();
            }else{
                if(cycle>10){
                    console.log('网络超时或没有数据！');
                    clearInterval(interval);
                }else{
                    cycle++;
                }
            }
        }
    } else if(webThis('https://rate.taobao.com/sellercenter/')){
        /*
         * 评价管理页面
         */
        globalCssStyle += '.seller-rate-manage-container .rate-col-3{flex-basis:25%;align-self:baseline;display:flex;flex-direction:column;}';
        globalCssStyle += '.seller-rate-manage-container .rate-col-9{flex-basis:75%;margin-right:16px;display:flex;flex-direction:column;}';
        globalCssStyle += '.seller-rate-manage-container .rate-col-3>*+*, .seller-rate-manage-container .rate-col-9>*+*{margin-top:16px}';
        $('#content').css('width','auto');
        setTimeout(function(){
            $('#halo-wrapper-root > div > div > div > div.rate-flex-wrapper > div.rate-col-8').addClass('rate-col-9').removeClass('rate-col-8');
            $('#halo-wrapper-root > div > div > div > div.rate-flex-wrapper > div.rate-col-4').addClass('rate-col-3').removeClass('rate-col-4');
        }, 800);
    }else if (webThis('https://wuliu.taobao.com/user/order_list_new.htm')) {
        /*
         * 发货页面
         */
        globalCssStyle += '#header{width:auto !important;padding:0 15px;}.orderdetail > .des{display:inline-block}.orderdetail > iframe{display:block;border:none;position:absolute;top:0;right:1rem;}';
        $('#J_Express tr:not(:first-child):not(:last-child)').each(function(){
            let href = $(this).find('td:eq(0) > .orderdetail .des > li:eq(0) > a:eq(0)').attr('href');
            let params = new URLSearchParams(href.split('?')[1]);
            let trade_id = params.get('trade_id');
            $(this).find('td:eq(0) > .orderdetail').append('<iframe id="order_details_'+trade_id+'" src="https://trade.taobao.com/trade/detail/tradeSnap.htm?tradeID='+trade_id+'&snapShot=true"></iframe>');
        });
    } else if (webThis('https://trade.taobao.com/trade/itemlist/list_sold_items.htm')) {
        /*
         * 已卖出的宝贝
         */
        $("#sold_container > div > div:nth-child(1) > div:nth-child(2) > span").click();
    } else if (webThis('https://trade.taobao.com/trade/detail/tradeSnap.htm')) {
        globalCssStyle = '.site-nav,#page,.tb-footer{display:none;}';
        let params = new URLSearchParams(data.snapExtraDO.claration.url.split('?')[1]);
        $.get('http://127.0.0.1:8000/api/v2/goods/'+params.get('id'),function(data){
            if(data){
                let source = data.source;
                source.sort((a, b) => a.sort - b.sort);
                $.each(source, function(k,v){
                    if(v.url){
                        $('body').append('<a href="'+v.url+'" target="_blank">'+v.title+'</a>');
                    }
                });
            }
        });
    } else if (webThis('https://sycm.taobao.com/mc/mq/search_analyze?activeKey=relation')) {
        /*
         * 生意参谋 - 市场 - 搜索分析
         */
        $('.ebase-Frame__content').append('<button id="down_table" class="ant-btn ant-btn-primary" type="button">下载表格</button>');
        globalCssStyle = '#down_table{position:fixed;right:50%;top:28%;z-index:999;margin-right:-810px;}';
        $('#down_table').click(function(){
            if($('.ant-table-body').length === 0){
                alert('表格还没加载完成哦！');
                return false;
            }
            let csvData = '';
            let headerRow = {};
            $('.ant-table-thead th').each(function(index){
                if ($(this).hasClass('alife-dt-card-common-table-right-column')){
                    csvData += '成交数,竞争度\n';
                    headerRow['成交数'] = String.fromCharCode(66+index);
                    headerRow['竞争度'] = String.fromCharCode(67+index);
                }else{
                    headerRow[$(this).text().replace(/,/g, '')] = String.fromCharCode(65+index);
                    csvData += $(this).text().replace(/,/g, '') + ',';
                }
            });
            $('.ant-table-tbody td').each(function(index){
                if ($(this).hasClass('alife-dt-card-common-table-right-column')){
                    let cowLen = $('.ant-table-tbody tr:eq(0) td').length;
                    let deal = '';
                    let compete = '';
                    if (headerRow['点击人气'] !== undefined && headerRow['支付转化率'] !== undefined){
                        let rowNum = (index+1)/cowLen+1;
                        deal = '"=ROUND('+headerRow['点击人气']+rowNum+'*'+headerRow['支付转化率']+rowNum+',"0)';
                    }
                    if (headerRow['搜索人气'] !== undefined && headerRow['在线商品数'] !== undefined){
                        let rowNum = (index+1)/cowLen+1;
                        compete = '='+headerRow['搜索人气']+rowNum+'/'+headerRow['在线商品数']+rowNum;
                    }
                    csvData += deal+','+compete+'\n';
                }else{
                    csvData += $(this).text().replace(/,/g, '') + ',';
                }
            });
            console.save(csvData, '生意参谋-搜索词分析.csv')
        });
    }
    GM_addStyle(globalCssStyle);
})($);
