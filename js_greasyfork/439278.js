// ==UserScript==
// @name        CJD——copy json data
// @namespace   CopyData Scripts
// @match       *://*/*
// @grant       none
// @version     1.0.017
// @require     https://libs.baidu.com/jquery/2.0.3/jquery.min.js
// @description 2022/1/28 上午11:12:17
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439278/CJD%E2%80%94%E2%80%94copy%20json%20data.user.js
// @updateURL https://update.greasyfork.org/scripts/439278/CJD%E2%80%94%E2%80%94copy%20json%20data.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    //$(function(){
        var href = window.location.href;
        
        if (href.indexOf('m.vedeng.com/c-') != -1) {
            var cate_id = href.split('m.vedeng.com/c-')[1].split('.')[0];
            if(!cate_id){console.log('cate_id不存在！',cate_id);return;}

            $('body').append('<textarea id="dataTextarea"></textarea><button id="dataBtn" style="position: fixed; right: 0; top: 48%; z-index: 999999; padding: 10px 7px 10px 13px; border-radius: 10px 0 0 10px; background: #295598; color: #fff; box-shadow: -4px 4px 15px 4px #fff;">复制JSON数据</button>');
            
            $(document).on('click', '#dataBtn', function(){
                var _list = $('.goods_class_list .goods_class_cloum');
                var _data = [];
                for(var i=0; i<_list.length; i++){
                    var _item = {
                        "cate_id": cate_id || 0,
                        "store_name": _list.eq(i).find('.goods_class_cloum_right_title').text() || '默认',
                        "image": _list.eq(i).find('.goods_class_cloum_left img').attr('data-src'),
                        "is_hot": _list.eq(i).find('.goods_class_cloum_right_label .rx').length>0 ? 1 : 0,
                        "is_new": _list.eq(i).find('.goods_class_cloum_right_label .xp').length>0 ? 1 : 0,
                        "model_spec": _list.eq(i).find('.goods_class_cloum_right_info .goods_model .modelTest').text(),
                        "sku_no": _list.eq(i).find('.goods_class_cloum_right_info .goods_orderNo .modelTest').text(),
                        "price": _list.eq(i).find('.goods_class_cloum_right_info .goods_price .modelTest').text().replace('￥','')
                    };
                    if(_item.price=='可询价'){ _item.price=0; }
                    _data.push(_item);
                }
                console.log('_data', _data);
                
                var _strJson = JSON.stringify(_data);
                $('#dataTextarea').val( _strJson.substring(1, _strJson.length-1) );
                
                var Url2=document.getElementById("dataTextarea");
                Url2.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                console.log('********* 复制成功！**********');
            })

        }else if (href.indexOf('m.vedeng.com/search.html') != -1) { 

            $('body').append('<textarea id="dataTextarea"></textarea><button id="dataBtn" style="position: fixed; right: 0; top: 48%; z-index: 999999; padding: 10px 7px 10px 13px; border-radius: 10px 0 0 10px; background: #295598; color: #fff; box-shadow: -4px 4px 15px 4px #fff;">复制JSON数据</button>');
            
            $(document).on('click', '#dataBtn', function(){
                var _list = $('.goods_class_list .goods_class_cloum');
                var _data = [];
                for(var i=0; i<_list.length; i++){
                    var _item = {
                        "cate_id": 0,
                        "store_name": _list.eq(i).find('.goods_class_cloum_right_title').text() || '默认',
                        "image": _list.eq(i).find('.goods_class_cloum_left img').attr('data-src'),
                        "is_hot": _list.eq(i).find('.goods_class_cloum_right_label .rx').length>0 ? 1 : 0,
                        "is_new": _list.eq(i).find('.goods_class_cloum_right_label .xp').length>0 ? 1 : 0,
                        "model_spec": _list.eq(i).find('.goods_class_cloum_right_info .goods_model .modelTest').text(),
                        "sku_no": _list.eq(i).find('.goods_class_cloum_right_info .goods_orderNo .modelTest').text(),
                        "price": _list.eq(i).find('.goods_class_cloum_right_info .goods_price .modelTest').text().replace('￥','')
                    };
                    if(_item.price=='可询价'){ _item.price=0; }
                    _data.push(_item);
                }
                console.log('_data', _data);
                
                var _strJson = JSON.stringify(_data);
                $('#dataTextarea').val( _strJson.substring(1, _strJson.length-1) );
                
                var Url2=document.getElementById("dataTextarea");
                Url2.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                console.log('********* 复制成功！**********');
            })

        }
 
    //}) 
    
})();