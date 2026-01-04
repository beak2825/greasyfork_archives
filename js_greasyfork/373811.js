// ==UserScript==
// @name         直通车要你命三千(通用版)
// @namespace    http://tampermonkey.net/
// @version      4.22
// @description  修改地域,生成人群,人群变色,人群排序,增加比率数值,增加点击率行业数据
// @author       Ted
// @match        https://subway.simba.taobao.com/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @require      https://greasyfork.org/scripts/48306-waitforkeyelements/code/waitForKeyElements.js?version=275769
// @require      https://greasyfork.org/scripts/26454-jquery-cookie/code/jQuery%20Cookie.js?version=169689
// @require      https://greasyfork.org/scripts/39642-jquery-tablesorter/code/Jquery%20tablesorter.js?version=259274
// @require      https://greasyfork.org/scripts/371544-table-to-json/code/table%20to%20json.js?version=623454
// @downloadURL https://update.greasyfork.org/scripts/373811/%E7%9B%B4%E9%80%9A%E8%BD%A6%E8%A6%81%E4%BD%A0%E5%91%BD%E4%B8%89%E5%8D%83%28%E9%80%9A%E7%94%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373811/%E7%9B%B4%E9%80%9A%E8%BD%A6%E8%A6%81%E4%BD%A0%E5%91%BD%E4%B8%89%E5%8D%83%28%E9%80%9A%E7%94%A8%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var top_100_Json = '["\\u514b\\u62c9\\u739b\\u4f9d", "\\u9102\\u5c14\\u591a\\u65af", "\\u4e1c\\u8425", "\\u6df1\\u5733", "\\u82cf\\u5dde", "\\u5e7f\\u5dde", "\\u963f\\u62c9\\u5584", "\\u5305\\u5934", "\\u65e0\\u9521", "\\u73e0\\u6d77", "\\u5357\\u4eac", "\\u957f\\u6c99", "\\u676d\\u5dde", "\\u5e38\\u5dde", "\\u5927\\u8fde", "\\u9547\\u6c5f", "\\u5317\\u4eac", "\\u5929\\u6d25", "\\u4f5b\\u5c71", "\\u5927\\u5e86", "\\u5a01\\u6d77", "\\u6b66\\u6c49", "\\u4e0a\\u6d77", "\\u9752\\u5c9b", "\\u5b81\\u6ce2", "\\u547c\\u548c\\u6d69\\u7279", "\\u4e4c\\u6d77", "\\u4e4c\\u9c81\\u6728\\u9f50", "\\u9521\\u6797\\u90ed\\u52d2", "\\u821f\\u5c71", "\\u4e2d\\u5c71", "\\u70df\\u53f0", "\\u53a6\\u95e8", "\\u7ecd\\u5174", "\\u626c\\u5dde", "\\u6dc4\\u535a", "\\u6c88\\u9633", "\\u76d8\\u9526", "\\u6d77\\u897f", "\\u6d4e\\u5357", "\\u5357\\u901a", "\\u5b9c\\u660c", "\\u65b0\\u4f59", "\\u660c\\u5409", "\\u6cf0\\u5dde", "\\u5510\\u5c71", "\\u5609\\u5cea\\u5173", "\\u90d1\\u5dde", "\\u5609\\u5174", "\\u5357\\u660c", "\\u4e1c\\u839e", "\\u798f\\u5dde", "\\u6500\\u679d\\u82b1", "\\u5df4\\u97f3\\u90ed\\u695e", "\\u6210\\u90fd", "\\u6986\\u6797", "\\u957f\\u6625", "\\u5408\\u80a5", "\\u6cc9\\u5dde", "\\u62c9\\u8428", "\\u6e56\\u5dde", "\\u94f6\\u5ddd", "\\u9102\\u5dde", "\\u54c8\\u5bc6", "\\u4e09\\u660e", "\\u9632\\u57ce\\u6e2f", "\\u6d4e\\u6e90", "\\u672c\\u6eaa", "\\u829c\\u6e56", "\\u897f\\u5b89", "\\u9f99\\u5ca9", "\\u60e0\\u5dde", "\\u978d\\u5c71", "\\u592a\\u539f", "\\u547c\\u4f26\\u8d1d\\u5c14", "\\u8d35\\u9633", "\\u91d1\\u534e", "\\u8425\\u53e3", "\\u77f3\\u5634\\u5c71", "\\u5f90\\u5dde", "\\u6ee8\\u5dde", "\\u9a6c\\u978d\\u5c71", "\\u6e58\\u6f6d", "\\u8944\\u9633", "\\u901a\\u8fbd", "\\u8fbd\\u6e90", "\\u6606\\u660e", "\\u54c8\\u5c14\\u6ee8", "\\u535a\\u5c14\\u5854\\u62c9", "\\u53f0\\u5dde", "\\u67f3\\u5dde", "\\u677e\\u539f", "\\u682a\\u6d32", "\\u629a\\u987a", "\\u4e09\\u4e9a", "\\u6f5c\\u6c5f", "\\u76d0\\u57ce", "\\u65e5\\u7167", "\\u8386\\u7530", "\\u94dc\\u9675"]';
    var top_100 = $.parseJSON(top_100_Json);
    var all_city_Json = '{"\\u5317\\u4eac": ["\\u5317\\u4eac"], "\\u5929\\u6d25": ["\\u5929\\u6d25"], "\\u6cb3\\u5317": ["\\u5510\\u5c71", "\\u5eca\\u574a", "\\u77f3\\u5bb6\\u5e84", "\\u6ca7\\u5dde", "\\u79e6\\u7687\\u5c9b", "\\u627f\\u5fb7", "\\u90af\\u90f8", "\\u5f20\\u5bb6\\u53e3", "\\u4fdd\\u5b9a", "\\u8861\\u6c34", "\\u90a2\\u53f0"], "\\u5c71\\u897f": ["\\u592a\\u539f", "\\u6714\\u5dde", "\\u664b\\u57ce", "\\u9633\\u6cc9", "\\u957f\\u6cbb", "\\u664b\\u4e2d", "\\u5927\\u540c", "\\u4e34\\u6c7e", "\\u5415\\u6881", "\\u8fd0\\u57ce", "\\u5ffb\\u5dde"], "\\u5185\\u8499\\u53e4": ["\\u9102\\u5c14\\u591a\\u65af", "\\u963f\\u62c9\\u5584", "\\u5305\\u5934", "\\u547c\\u548c\\u6d69\\u7279", "\\u4e4c\\u6d77", "\\u9521\\u6797\\u90ed\\u52d2", "\\u547c\\u4f26\\u8d1d\\u5c14", "\\u901a\\u8fbd", "\\u5df4\\u5f66\\u6dd6\\u5c14", "\\u8d64\\u5cf0", "\\u4e4c\\u5170\\u5bdf\\u5e03", "\\u5174\\u5b89\\u76df"], "\\u8fbd\\u5b81": ["\\u5927\\u8fde", "\\u6c88\\u9633", "\\u76d8\\u9526", "\\u672c\\u6eaa", "\\u978d\\u5c71", "\\u8425\\u53e3", "\\u629a\\u987a", "\\u8fbd\\u9633", "\\u9526\\u5dde", "\\u4e39\\u4e1c", "\\u961c\\u65b0", "\\u671d\\u9633", "\\u846b\\u82a6\\u5c9b", "\\u94c1\\u5cad"], "\\u5409\\u6797": ["\\u957f\\u6625", "\\u8fbd\\u6e90", "\\u677e\\u539f", "\\u5409\\u6797", "\\u767d\\u5c71", "\\u901a\\u5316", "\\u5ef6\\u8fb9\\u671d\\u9c9c\\u65cf\\u81ea\\u6cbb\\u5dde", "\\u56db\\u5e73", "\\u767d\\u57ce"], "\\u9ed1\\u9f99\\u6c5f": ["\\u5927\\u5e86", "\\u54c8\\u5c14\\u6ee8", "\\u7261\\u4e39\\u6c5f", "\\u4f73\\u6728\\u65af", "\\u53cc\\u9e2d\\u5c71", "\\u9e21\\u897f", "\\u5927\\u5174\\u5b89\\u5cad\\u5730", "\\u9ed1\\u6cb3", "\\u9e64\\u5c97", "\\u4e03\\u53f0\\u6cb3", "\\u7ee5\\u5316", "\\u9f50\\u9f50\\u54c8\\u5c14", "\\u4f0a\\u6625"], "\\u4e0a\\u6d77": ["\\u4e0a\\u6d77"], "\\u6c5f\\u82cf": ["\\u82cf\\u5dde", "\\u65e0\\u9521", "\\u5357\\u4eac", "\\u5e38\\u5dde", "\\u9547\\u6c5f", "\\u626c\\u5dde", "\\u5357\\u901a", "\\u6cf0\\u5dde", "\\u5f90\\u5dde", "\\u76d0\\u57ce", "\\u6dee\\u5b89", "\\u8fde\\u4e91\\u6e2f", "\\u5bbf\\u8fc1"], "\\u6d59\\u6c5f": ["\\u676d\\u5dde", "\\u5b81\\u6ce2", "\\u821f\\u5c71", "\\u7ecd\\u5174", "\\u5609\\u5174", "\\u6e56\\u5dde", "\\u91d1\\u534e", "\\u53f0\\u5dde", "\\u8862\\u5dde", "\\u4e3d\\u6c34", "\\u6e29\\u5dde"], "\\u798f\\u5efa": ["\\u53a6\\u95e8", "\\u798f\\u5dde", "\\u6cc9\\u5dde", "\\u4e09\\u660e", "\\u9f99\\u5ca9", "\\u8386\\u7530", "\\u6f33\\u5dde", "\\u5b81\\u5fb7", "\\u5357\\u5e73"], "\\u5b89\\u5fbd": ["\\u5408\\u80a5", "\\u829c\\u6e56", "\\u9a6c\\u978d\\u5c71", "\\u94dc\\u9675", "\\u9ec4\\u5c71", "\\u868c\\u57e0", "\\u6c60\\u5dde", "\\u5ba3\\u57ce", "\\u6dee\\u5317", "\\u6ec1\\u5dde", "\\u5b89\\u5e86", "\\u6dee\\u5357", "\\u5bbf\\u5dde", "\\u516d\\u5b89", "\\u4eb3\\u5dde", "\\u961c\\u9633"], "\\u5c71\\u4e1c": ["\\u4e1c\\u8425", "\\u5a01\\u6d77", "\\u9752\\u5c9b", "\\u70df\\u53f0", "\\u6dc4\\u535a", "\\u6d4e\\u5357", "\\u6ee8\\u5dde", "\\u65e5\\u7167", "\\u6cf0\\u5b89", "\\u6f4d\\u574a", "\\u67a3\\u5e84", "\\u83b1\\u829c", "\\u6d4e\\u5b81", "\\u5fb7\\u5dde", "\\u804a\\u57ce", "\\u4e34\\u6c82", "\\u83cf\\u6cfd"], "\\u6cb3\\u5357": ["\\u90d1\\u5dde", "\\u6d4e\\u6e90", "\\u4e09\\u95e8\\u5ce1", "\\u7126\\u4f5c", "\\u6d1b\\u9633", "\\u8bb8\\u660c", "\\u9e64\\u58c1", "\\u6f2f\\u6cb3", "\\u6fee\\u9633", "\\u5b89\\u9633", "\\u5f00\\u5c01", "\\u65b0\\u4e61", "\\u5e73\\u9876\\u5c71", "\\u4fe1\\u9633", "\\u5357\\u9633", "\\u9a7b\\u9a6c\\u5e97", "\\u5546\\u4e18", "\\u5468\\u53e3"], "\\u6e56\\u5317": ["\\u6b66\\u6c49", "\\u5b9c\\u660c", "\\u9102\\u5dde", "\\u8944\\u9633", "\\u6f5c\\u6c5f", "\\u4ed9\\u6843", "\\u9ec4\\u77f3", "\\u8346\\u95e8", "\\u54b8\\u5b81", "\\u5341\\u5830", "\\u968f\\u5dde", "\\u5929\\u95e8", "\\u5b5d\\u611f", "\\u8346\\u5dde", "\\u795e\\u519c\\u67b6", "\\u9ec4\\u5188", "\\u6069\\u65bd"], "\\u6e56\\u5357": ["\\u957f\\u6c99", "\\u6e58\\u6f6d", "\\u682a\\u6d32", "\\u5cb3\\u9633", "\\u5e38\\u5fb7", "\\u90f4\\u5dde", "\\u8861\\u9633", "\\u5a04\\u5e95", "\\u76ca\\u9633", "\\u5f20\\u5bb6\\u754c", "\\u6c38\\u5dde", "\\u6000\\u5316", "\\u90b5\\u9633", "\\u6e58\\u897f"], "\\u6c5f\\u897f": ["\\u65b0\\u4f59", "\\u5357\\u660c", "\\u9e70\\u6f6d", "\\u840d\\u4e61", "\\u666f\\u5fb7\\u9547", "\\u4e5d\\u6c5f", "\\u5b9c\\u6625", "\\u629a\\u5dde", "\\u5409\\u5b89", "\\u4e0a\\u9976", "\\u8d63\\u5dde"], "\\u5e7f\\u4e1c": ["\\u6df1\\u5733", "\\u5e7f\\u5dde", "\\u73e0\\u6d77", "\\u4f5b\\u5c71", "\\u4e2d\\u5c71", "\\u4e1c\\u839e", "\\u60e0\\u5dde", "\\u9633\\u6c5f", "\\u6c5f\\u95e8", "\\u8087\\u5e86", "\\u8302\\u540d", "\\u97f6\\u5173", "\\u6f6e\\u5dde", "\\u6c55\\u5934", "\\u6e05\\u8fdc", "\\u6e5b\\u6c5f", "\\u63ed\\u9633", "\\u4e91\\u6d6e", "\\u6cb3\\u6e90", "\\u6c55\\u5c3e", "\\u6885\\u5dde"], "\\u6d77\\u5357": ["\\u4e09\\u4e9a", "\\u6d77\\u53e3", "\\u6f84\\u8fc8", "\\u743c\\u6d77", "\\u660c\\u6c5f", "\\u9675\\u6c34", "\\u4e1c\\u65b9", "\\u6587\\u660c", "\\u4e07\\u5b81", "\\u5b9a\\u5b89", "\\u4fdd\\u4ead", "\\u767d\\u6c99", "\\u4e50\\u4e1c", "\\u4e94\\u6307\\u5c71"], "\\u5e7f\\u897f": ["\\u9632\\u57ce\\u6e2f", "\\u67f3\\u5dde", "\\u5317\\u6d77", "\\u5357\\u5b81", "\\u6842\\u6797", "\\u68a7\\u5dde", "\\u5d07\\u5de6", "\\u94a6\\u5dde", "\\u767e\\u8272", "\\u6765\\u5bbe", "\\u7389\\u6797", "\\u8d3a\\u5dde", "\\u8d35\\u6e2f", "\\u6cb3\\u6c60"], "\\u91cd\\u5e86": ["\\u91cd\\u5e86"], "\\u56db\\u5ddd": ["\\u6500\\u679d\\u82b1", "\\u6210\\u90fd", "\\u5fb7\\u9633", "\\u81ea\\u8d21", "\\u4e50\\u5c71", "\\u7ef5\\u9633", "\\u8d44\\u9633", "\\u7709\\u5c71", "\\u5b9c\\u5bbe", "\\u96c5\\u5b89", "\\u5185\\u6c5f", "\\u6cf8\\u5dde", "\\u5e7f\\u5b89", "\\u963f\\u575d", "\\u51c9\\u5c71", "\\u9042\\u5b81", "\\u8fbe\\u5dde", "\\u5357\\u5145", "\\u5e7f\\u5143", "\\u7518\\u5b5c\\u85cf\\u65cf\\u81ea\\u6cbb\\u5dde", "\\u5df4\\u4e2d"], "\\u4e91\\u5357": ["\\u6606\\u660e", "\\u7389\\u6eaa", "\\u8fea\\u5e86", "\\u897f\\u53cc\\u7248\\u7eb3", "\\u695a\\u96c4", "\\u66f2\\u9756", "\\u7ea2\\u6cb3", "\\u5927\\u7406", "\\u5fb7\\u5b8f", "\\u4e3d\\u6c5f", "\\u4fdd\\u5c71", "\\u6012\\u6c5f", "\\u4e34\\u6ca7", "\\u666e\\u6d31", "\\u6587\\u5c71", "\\u662d\\u901a"], "\\u8d35\\u5dde": ["\\u8d35\\u9633", "\\u516d\\u76d8\\u6c34", "\\u9075\\u4e49", "\\u9ed4\\u897f\\u5357", "\\u9ed4\\u5357", "\\u5b89\\u987a", "\\u94dc\\u4ec1", "\\u9ed4\\u4e1c\\u5357", "\\u6bd5\\u8282"], "\\u9655\\u897f": ["\\u6986\\u6797", "\\u897f\\u5b89", "\\u5ef6\\u5b89", "\\u5b9d\\u9e21", "\\u54b8\\u9633", "\\u94dc\\u5ddd", "\\u6c49\\u4e2d", "\\u5b89\\u5eb7", "\\u6e2d\\u5357", "\\u5546\\u6d1b"], "\\u7518\\u8083": ["\\u5609\\u5cea\\u5173", "\\u5170\\u5dde", "\\u9152\\u6cc9", "\\u91d1\\u660c", "\\u5f20\\u6396", "\\u5e86\\u9633", "\\u767d\\u94f6", "\\u6b66\\u5a01", "\\u7518\\u5357", "\\u5929\\u6c34", "\\u5e73\\u51c9", "\\u9647\\u5357", "\\u5b9a\\u897f", "\\u4e34\\u590f"], "\\u9752\\u6d77": ["\\u6d77\\u897f", "\\u897f\\u5b81", "\\u6d77\\u5317", "\\u6d77\\u5357", "\\u9ec4\\u5357", "\\u6d77\\u4e1c", "\\u679c\\u6d1b", "\\u7389\\u6811"], "\\u5b81\\u590f\\u56de\\u65cf\\u81ea\\u6cbb\\u533a": ["\\u94f6\\u5ddd", "\\u77f3\\u5634\\u5c71", "\\u5434\\u5fe0", "\\u4e2d\\u536b", "\\u56fa\\u539f"], "\\u65b0\\u7586\\u7ef4\\u543e\\u5c14\\u81ea\\u6cbb\\u533a": ["\\u514b\\u62c9\\u739b\\u4f9d", "\\u4e4c\\u9c81\\u6728\\u9f50", "\\u660c\\u5409", "\\u5df4\\u97f3\\u90ed\\u695e", "\\u54c8\\u5bc6", "\\u535a\\u5c14\\u5854\\u62c9", "\\u5854\\u57ce", "\\u963f\\u52d2\\u6cf0", "\\u963f\\u514b\\u82cf", "\\u5410\\u9c81\\u756a", "\\u4f0a\\u7281", "\\u5580\\u4ec0", "\\u514b\\u5b5c\\u52d2\\u82cf\\u67ef\\u5c14\\u514b\\u5b5c", "\\u548c\\u7530"], "\\u897f\\u85cf\\u81ea\\u6cbb\\u533a": ["\\u62c9\\u8428", "\\u6797\\u829d", "\\u963f\\u91cc", "\\u5c71\\u5357\\u5730", "\\u65e5\\u5580\\u5219", "\\u660c\\u90fd", "\\u90a3\\u66f2"]}';
    var all_city = $.parseJSON(all_city_Json);
    var direct_city = ['北京','天津','上海','重庆'];
    var all_top3 = [];
    $.each(all_city,function(key,data){
        if (data.length > 1){
            all_top3 = all_top3.concat(data.slice(0,3));
        }else{
            all_top3 = all_top3.concat(data);
        };
    });
    var all_top5 = [];
    $.each(all_city,function(key,data){
        if (data.length > 1){
            all_top5  = all_top5 .concat(data.slice(0,5));
        }else{
            all_top5  = all_top5 .concat(data);
        };
    });
    var all_last3 = [];
    $.each(all_city,function(key,data){
        if (data.length > 1){
            all_last3 = all_last3.concat(data.slice(data.length-3));
        };
    });
    var all_last5 = [];
    $.each(all_city,function(key,data){
        if (data.length > 1){
            all_last5 = all_last5.concat(data.slice(data.length-5));
        };
    });

    var regex_pro = /(.*?)\s.*/;
    waitForKeyElements ("table.region-table",loc_main);
    function loc_main(jNode){
        add_width(jNode);
        add_btn($("div.thead-title.tc.f14.lh23.m8"));
        add_samall_btn($("div.cities>h3.f14.lh25.mb10"));
    };
    function add_width(jNode){
        jNode.css('width', '680px');
    };
    function add_btn(jNode) {
        jNode.replaceWith(`<div class="thead-title tc f14 lh23 m8" id="mx_580">
        <button id="_btn_top100" class="thead-title tc f14 lh23 m8" style='font-size:13px' href="javascript:void(0)">&nbsp;选择TOP100&nbsp;</button>
        &nbsp;&nbsp;
        <button id="_btn_all_top3" class="thead-title tc f14 lh23 m8" style='font-size:13px' href="javascript:void(0)">&nbsp;选择每省TOP3&nbsp;</button>
        &nbsp;&nbsp;
        <button id="_btn_all_top5" class="thead-title tc f14 lh23 m8" style='font-size:13px' href="javascript:void(0)">&nbsp;选择每省TOP5&nbsp;</button>
        &nbsp;&nbsp;
        <button id="_btn_all_last3" class="thead-title tc f14 lh23 m8" style='font-size:13px' href="javascript:void(0)">&nbsp;剔除每省倒三&nbsp;</button>
        &nbsp;&nbsp;
        <button id="_btn_all_last5" class="thead-title tc f14 lh23 m8" style='font-size:13px' href="javascript:void(0)">&nbsp;剔除每省倒五&nbsp;</button>
        &nbsp;&nbsp;
        <button id="_btn_select" class="thead-title tc f14 lh23 m8" style='font-size:13px' href="javascript:void(0)">&nbsp;全部选择&nbsp;</button>
        &nbsp;&nbsp;
        <button id="_btn_cancel" class="thead-title tc f14 lh23 m8" style='font-size:13px' href="javascript:void(0)">&nbsp;全部取消&nbsp;</button>
        </div>`
        );
         $('#_btn_top100').click(function(){
             top_100.forEach(function(city){
                 $('label[title='+city+']>input').prop('checked',true);
             });
             alert('TOP100选择成功！');
             $('label[title=吉林]>input[name=province]').prop('checked',false);
             $('label[title=海南]>input[name=province]').prop('checked',false);
        });
        $('#_btn_all_top3').click(function(){
             all_top3.forEach(function(city){
                 $('label[title='+city+']>input').prop('checked',true);
             });
             $('label[title=吉林]>input[name=province]').prop('checked',false);
             $('label[title=海南]>input[name=province]').prop('checked',false);
             alert('每省前三选择成功！');
        });
        $('#_btn_all_top5').click(function(){
             all_top5.forEach(function(city){
                 $('label[title='+city+']>input').prop('checked',true);
             });
             $('label[title=吉林]>input[name=province]').prop('checked',false);
             $('label[title=海南]>input[name=province]').prop('checked',false);
             alert('每省前五选择成功！');
        });
        $('#_btn_all_last3').click(function(){
            all_last3.forEach(function(city){
                 $('label[title='+city+']>input').prop('checked',false);
             });
            $('label>input[name=area]').prop('checked',false);
            $('input[name=province]').prop('checked',false);
            direct_city.forEach(function(city){
                $('label[title='+city+']>input[name=province]').prop('checked',true);
            });
            $('label[title=北京]>input').trigger('click');
            $('label[title=北京]>input').trigger('click');
            alert('每省倒三剔除成功！');
        });
        $('#_btn_all_last5').click(function(){
            all_last5.forEach(function(city){
                $('label[title='+city+']>input').prop('checked',false);
             });
            $('label>input[name=area]').prop('checked',false);
            $('input[name=province]').prop('checked',false);
            direct_city.forEach(function(city){
                $('label[title='+city+']>input[name=province]').prop('checked',true);
            });
            $('label[title=北京]>input').trigger('click');
            $('label[title=北京]>input').trigger('click');
            alert('每省倒五剔除成功！');
        });
        $('#_btn_select').click(function(){
             $('label.province.fl>input[type=checkbox]').prop('checked',true);
             alert('全部选择成功！！');
        });
        $('#_btn_cancel').click(function(){
             $('input[type=checkbox]').prop('checked',false);
             alert('全部取消成功！！');
        });
    };
    function add_samall_btn(jNode) {
        jNode.append(`&nbsp;&nbsp;&nbsp;<input id="_btn_top3" type="button" style="font-size:3px;font-weight: bold;" href="javascript:void(0)" value="选前三">&nbsp;&nbsp;
                      <input id="_btn_top5" type="button" style="font-size:3px;font-weight: bold;" href="javascript:void(0)" value="选前五">&nbsp;&nbsp;
                      <input id="_btn_last3" type="button" style="font-size:3px;font-weight: bold;" href="javascript:void(0)" value="去倒三">&nbsp;&nbsp;
                      <input id="_btn_last5" type="button" style="font-size:3px;font-weight: bold;" href="javascript:void(0)" value="去倒五">`);
        var all_top3_btn = jNode.find('#_btn_top3');
        var all_top5_btn = jNode.find('#_btn_top5');
        var all_last3_btn = jNode.find('#_btn_last3');
        var all_last5_btn = jNode.find('#_btn_last5');
        all_top3_btn.click(function(e){
            var provn_origin = $(this).parent().text();
            var provn_name = provn_origin.match(regex_pro)[1];
            var provn_city = all_city[provn_name];
            var top3_city = provn_city.slice(0,3);
            top3_city.forEach(function(city){
                 $('label[title='+city+']>input').prop('checked',true);
             });
            $('label[title='+provn_name+']>input[name=province]').prop('checked',false);
            $('label[title=吉林]>input[name=province]').prop('checked',false);
            $('label[title=海南]>input[name=province]').prop('checked',false);
        });
        all_top5_btn.click(function(e){
            var provn_origin = $(this).parent().text();
            var provn_name = provn_origin.match(regex_pro)[1];
            var provn_city = all_city[provn_name];
            var top5_city = provn_city.slice(0,5);
            top5_city.forEach(function(city){
                 $('label[title='+city+']>input').prop('checked',true);
             });
            $('label[title='+provn_name+']>input[name=province]').prop('checked',false);
            $('label[title=吉林]>input[name=province]').prop('checked',false);
            $('label[title=海南]>input[name=province]').prop('checked',false);
        });
        all_last3_btn.click(function(e){
            var provn_origin = $(this).parent().text();
            var provn_name = provn_origin.match(regex_pro)[1];
            var provn_city = all_city[provn_name];
            var last3_city = provn_city.slice(provn_city.length-3);
            last3_city.forEach(function(city){
                 $('label[title='+city+']>input').prop('checked',false);
             });
            $('label[title='+provn_name+']>input[name=province]').prop('checked',false);
            $('label>input[name=area]').prop('checked',false);
            $('label[title=北京]>input').trigger('click');
            $('label[title=北京]>input').trigger('click');
        });
        all_last5_btn.click(function(e){
            var provn_origin = $(this).parent().text();
            var provn_name = provn_origin.match(regex_pro)[1];
            var provn_city = all_city[provn_name];
            var last5_city = provn_city.slice(provn_city.length-5);
            last5_city.forEach(function(city){
                 $('label[title='+city+']>input').prop('checked',false);
             });
            $('label[title='+provn_name+']>input[name=province]').prop('checked',false);
            $('label>input[name=area]').prop('checked',false);
            $('label[title=北京]>input').trigger('click');
            $('label[title=北京]>input').trigger('click');
        });

    };
    //人群按钮
    var target_crowd_test = '[{"crowdDTO":{"extParam":{"firstCat":"16"},"templateId":12,"name":"1","tagList":[{"dimId":"100027","tagId":"11","tagName":"0-50","optionGroupId":"8905"},{"dimId":"100027","tagId":"12","tagName":"50-100","optionGroupId":"8905"},{"dimId":"100027","tagId":"13","tagName":"100-300","optionGroupId":"8905"},{"dimId":"100027","tagId":"14","tagName":"300-500","optionGroupId":"8905"},{"dimId":"100027","tagId":"15","tagName":"500以上","optionGroupId":"8905"},{"dimId":"100000","tagId":"0","tagName":"女","optionGroupId":"1000"},{"dimId":"100001","tagId":"1","tagName":"18岁以下","optionGroupId":"1001"},{"dimId":"100001","tagId":"2","tagName":"18-24岁","optionGroupId":"1001"},{"dimId":"100001","tagId":"3","tagName":"25-29岁","optionGroupId":"1001"},{"dimId":"100001","tagId":"4","tagName":"30-34岁","optionGroupId":"1001"},{"dimId":"100001","tagId":"5","tagName":"35-39岁","optionGroupId":"1001"},{"dimId":"100001","tagId":"6","tagName":"40-49岁","optionGroupId":"1001"},{"dimId":"100001","tagId":"7","tagName":"50岁及以上","optionGroupId":"1001"},{"dimId":"100002","tagId":"0","tagName":"300元以下","optionGroupId":"1002"},{"dimId":"100002","tagId":"1","tagName":"300-399元","optionGroupId":"1002"},{"dimId":"100002","tagId":"2","tagName":"400-549元","optionGroupId":"1002"},{"dimId":"100002","tagId":"3","tagName":"550-749元","optionGroupId":"1002"},{"dimId":"100002","tagId":"4","tagName":"750-1049元","optionGroupId":"1002"},{"dimId":"100002","tagId":"5","tagName":"1050-1749元","optionGroupId":"1002"},{"dimId":"100002","tagId":"6","tagName":"1750元及以上","optionGroupId":"1002"}]},"isDefaultPrice":0,"priceMode":1,"discount":200}]';
    var target_crowd_general = '[{"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "35-39 100-300 1750+", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "35-39 100-300 1050-1749", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "35-39 100-300 750-1049", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "35-39 100-300 550-749", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "35-39 100-300 400-549", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "35-39 50-100 1750+", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "35-39 50-100 1050-1749", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "35-39 50-100 750-1049", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "35-39 50-100 550-749", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "35-39 50-100 400-549", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "30-34 100-300 1750+", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "30-34 100-300 1050-1749", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "30-34 100-300 750-1049", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "30-34 100-300 550-749", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "30-34 100-300 400-549", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "30-34 50-100 1750+", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "30-34 50-100 1050-1749", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "30-34 50-100 750-1049", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "30-34 50-100 550-749", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "30-34 50-100 400-549", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "25-29 100-300 1750+", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "25-29 100-300 1050-1749", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "25-29 100-300 750-1049", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "25-29 100-300 550-749", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "25-29 100-300 400-549", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "25-29 50-100 1750+", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "25-29 50-100 1050-1749", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "25-29 50-100 750-1049", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "25-29 50-100 550-749", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "25-29 50-100 400-549", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "18-24 100-300 1750+", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "18-24 100-300 1050-1749", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "18-24 100-300 750-1049", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "18-24 100-300 550-749", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "18-24 100-300 400-549", "tagList": [{"dimId": "100027", "tagId": "13", "tagName": "100-300", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "18-24 50-100 1750+", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "18-24 50-100 1050-1749", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "18-24 50-100 750-1049", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "18-24 50-100 550-749", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "16"}, "name": "18-24 50-100 400-549", "tagList": [{"dimId": "100027", "tagId": "12", "tagName": "50-100", "optionGroupId": "8905"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 400, "isDefaultPrice": 0, "priceMode": 1}]';
    var target_crowd_bag = '[{"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 1000-3000 1750+", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 1000-3000 1050-1749", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 1000-3000 750-1049", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 1000-3000 550-749", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 1000-3000 400-549", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 300-1000 1750+", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 300-1000 1050-1749", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 300-1000 750-1049", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 300-1000 550-749", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 300-1000 400-549", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 100-300 1750+", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 100-300 1050-1749", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 100-300 750-1049", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 100-300 550-749", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 100-300 400-549", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 50-100 1750+", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 50-100 1050-1749", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 50-100 750-1049", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 50-100 550-749", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "35-39 50-100 400-549", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "5", "tagName": "35-39岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 1000-3000 1750+", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 1000-3000 1050-1749", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 1000-3000 750-1049", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 1000-3000 550-749", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 1000-3000 400-549", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 300-1000 1750+", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 300-1000 1050-1749", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 300-1000 750-1049", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 300-1000 550-749", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 300-1000 400-549", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 100-300 1750+", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 100-300 1050-1749", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 100-300 750-1049", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 100-300 550-749", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 100-300 400-549", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 50-100 1750+", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 50-100 1050-1749", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 50-100 750-1049", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 50-100 550-749", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "30-34 50-100 400-549", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "4", "tagName": "30-34岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 1000-3000 1750+", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 1000-3000 1050-1749", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 1000-3000 750-1049", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 1000-3000 550-749", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 1000-3000 400-549", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 300-1000 1750+", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 300-1000 1050-1749", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 300-1000 750-1049", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 300-1000 550-749", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 300-1000 400-549", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 100-300 1750+", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 100-300 1050-1749", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 100-300 750-1049", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 100-300 550-749", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 100-300 400-549", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 50-100 1750+", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 50-100 1050-1749", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 50-100 750-1049", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 50-100 550-749", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "25-29 50-100 400-549", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "3", "tagName": "25-29岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 1000-3000 1750+", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 1000-3000 1050-1749", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 1000-3000 750-1049", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 1000-3000 550-749", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 1000-3000 400-549", "tagList": [{"dimId": "100051", "tagId": "135", "tagName": "1000-3000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 300-1000 1750+", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 300-1000 1050-1749", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 300-1000 750-1049", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 300-1000 550-749", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 300-1000 400-549", "tagList": [{"dimId": "100051", "tagId": "134", "tagName": "300-1000", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 100-300 1750+", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 100-300 1050-1749", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 100-300 750-1049", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 100-300 550-749", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 100-300 400-549", "tagList": [{"dimId": "100051", "tagId": "133", "tagName": "100-300", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 50-100 1750+", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "6", "tagName": "1750元及以上", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 50-100 1050-1749", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "5", "tagName": "1050-1749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 50-100 750-1049", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "4", "tagName": "750-1049元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 50-100 550-749", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "3", "tagName": "550-749元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 200, "isDefaultPrice": 0, "priceMode": 1}, {"crowdDTO": {"extParam": {"firstCat": "50006842"}, "name": "18-24 50-100 400-549", "tagList": [{"dimId": "100051", "tagId": "132", "tagName": "50-100", "optionGroupId": "8929"}, {"dimId": "100000", "tagId": "0", "tagName": "女", "optionGroupId": "1000"}, {"dimId": "100001", "tagId": "2", "tagName": "18-24岁", "optionGroupId": "1001"}, {"dimId": "100002", "tagId": "2", "tagName": "400-549元", "optionGroupId": "1002"}], "templateId": 12}, "discount": 150, "isDefaultPrice": 0, "priceMode": 1}]';
    var token_text;
    var current_url;
    var referer_text;
    var adGroup_id;
    var nickName;
    waitForKeyElements ("span.btn.ml5:contains('删除')",crowd_main);
    function crowd_main(jNode){
        jNode.after('<span id= "_btn_addCrowd" class="btn ml5"  href="javascript:void(0)">生成人群</span>');
        $('#_btn_addCrowd').click(function (){
            var confirm_text = confirm('警告！是否确定新添加默认人群以及修改溢价？你确定吗？！！');
            if(confirm_text){
            current_url = window.location.href;
            referer_text = current_url.match( /\#\!(.*)/)[0].slice(2);
            adGroup_id = current_url.match(/adGroupId=(\d*\d)/)[0].match(/\d.*/)[0];
            get_token(function(data) {
                token_text = data['result']['token'];
                nickName = data['result']['nickName'];
                if (nickName == '法诺诗旗舰店'){
                    add_crowd(target_crowd_bag);
                }else{
                    add_crowd(target_crowd_general);
                }
            });
          };
        });
    }
    function get_token(callback){
        $.post('https://subway.simba.taobao.com/bpenv/getLoginUserInfo.htm', {
            referer : referer_text
        },
               function(data){
            callback(data)
        });
    }
    function add_crowd(target_crowd){
        $.post('https://subway.simba.taobao.com/adgroupTargeting/add.htm',
               { productId: "101001005",
                bizType : "1",
                adgroupId: adGroup_id,
                targetings: target_crowd,
                sla: "json",
                isAjaxRequest: "true",
                token: token_text,
                _referer: referer_text
               },
              );
    };
    //添加定向手机端人群
    var direct_crowd = '[{"discount": 110, "isDefaultPrice": 0, "crowdDTO": {"templateId": "31", "tagList": [{"dimId": "0", "tagId": "25"}]}}, {"discount": 110, "isDefaultPrice": 0, "crowdDTO": {"templateId": "31", "tagList": [{"dimId": "0", "tagId": "24"}]}}, {"discount": 110, "isDefaultPrice": 0, "crowdDTO": {"templateId": "31", "tagList": [{"dimId": "0", "tagId": "23"}]}}, {"discount": 110, "isDefaultPrice": 0, "crowdDTO": {"templateId": "31", "tagList": [{"dimId": "0", "tagId": "22"}]}}, {"discount": 110, "isDefaultPrice": 0, "crowdDTO": {"templateId": "31", "tagList": [{"dimId": "0", "tagId": "21"}]}}, {"discount": 110, "isDefaultPrice": 0, "crowdDTO": {"templateId": "31", "tagList": [{"dimId": "0", "tagId": "9"}]}}, {"discount": 110, "isDefaultPrice": 0, "crowdDTO": {"templateId": "31", "tagList": [{"dimId": "0", "tagId": "8"}]}}]';
    waitForKeyElements ("div.fl.ml5:contains('添加展示位置')", direct_crowd_main);
    function direct_crowd_main(jNode){
        jNode.append('<span id= "_btn_addD_Crowd" class="btn ml5"  href="javascript:void(0)">定向人群</span>');
        $('#_btn_addD_Crowd').click(function (){
            var confirm_text = confirm('警告！是否确定新添加定向人群以及修改溢价？你确定吗？！！');
            if(confirm_text){
            current_url = window.location.href;
            referer_text = current_url.match( /\#\!(.*)/)[0].slice(2);
            adGroup_id = current_url.match(/adGroupId=(\d*\d)/)[0].match(/\d.*/)[0];
            get_token(function(data) {
                token_text = data['result']['token'];
                nickName = data['result']['nickName'];
                if (nickName == '法诺诗旗舰店'){
                    add_crowd(direct_crowd);
                }else{
                    add_crowd(direct_crowd);
                }
            });
          };
        });
    }

    function add_direct(target_crowd){
        $.post('https://subway.simba.taobao.com/adgroupTargeting/add.htm',
               { productId: "101001005",
                bizType : "23",
                adgroupId: adGroup_id,
                targetings: target_crowd,
                sla: "json",
                isAjaxRequest: "true",
                token: token_text,
                _referer: referer_text
               },
              );
    };
    //人群名字调色
    var name_array;
    var age_name;
    var price_name;
    var pay_name;
    var final_name;
    var insert_point;
    waitForKeyElements ("#_btn_addCrowd",change_color);
    function change_color(jNode){
        jNode.after('<span id= "_btn_changeColor" class="btn ml5"  href="javascript:void(0)">人群变色</span>');
        $('#_btn_changeColor').click(function (){$('span.crowd-name.pr.ib>span.fl:contains(" ")').each(function(i, dom_obj){
            name_array = $(this).text().split(' ');
            age_name = '<span style="color:#CC0000" id = "_age_name">' + name_array[2].toString() + ' </span>';
            price_name = '<span style="color:#0066FF" id = "_price_name">' + name_array[3].toString() + ' </span>';
            pay_name = '<span style="color:#FF00FF" id = "_pay_name">' + name_array[4].toString() + '</span>';
            final_name = age_name + price_name + pay_name;
            $(this).html(final_name);
           });
          })};
    //人群排序
    var current_url_order;
    var column_json;
    var rate;
    GM_addStyle(`th.headerSortUp {background-image: url('data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7');background-repeat: no-repeat;background-position: right 25px center;}
                 th.headerSortDown {background-image: url('data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7');background-repeat: no-repeat;background-position: right 25px center;}`);
    waitForKeyElements ("#_btn_changeColor",order_crowd);
    function get_same_td(i){
        return $("div.freeze-td.hide-scroll-bar>table.bp-table>tbody>tr:eq("+ i.toString() +")").find("td");
    }
    function get_headerth(header_name){
        return $(".bp-table.tablesorter>thead>tr>th").index($("th:contains('"+header_name +"')"));
    }
    function order_crowd(jNode){
        jNode.after('<span id= "_btn_orderCrowd" class="btn ml5"  href="javascript:void(0)">人群排序</span>');
        current_url = window.location.href;
        $('#_btn_orderCrowd').click(function (){
            if (current_url.indexOf("standards" ) !== -1){
                $("div.table-container>table.bp-table").prepend($("table.bp-table.bp-scroll-table>thead"));
                $("div.table-container>table.bp-table>tbody>tr>td:contains(',')").each(function(i, dom_obj){
                    $(this).html(function(index, text) {
                        return text.replace(',', '');
                    });
                });
                $("div.table-container>table.bp-table>tbody>tr").last().remove();
                $("i[bx-name=tooltips]").removeAttr("id").css( 'cursor', 'pointer' )
                $("div.table-container>table.bp-table").removeClass( "bp-table" ).addClass( "bp-table tablesorter" )
            }else{
                $("table.bp-table.scroll-th>thead>tr").prepend($("table.bp-table.freeze-th>thead>th"));
                $("div.table-td>table.bp-table>tbody>tr>td:contains(',')").each(function(i, dom_obj){
                    $(this).html(function(index, text) {
                        return text.replace(',', '');
                    });
                });
                $("div.table-td>table.bp-table>tbody>tr").each(function(i, dom_obj){
                    $(this).prepend(get_same_td(i));
                });
                $("div.freeze-col").remove();
                $("div.table-content.osx.custom-scrollbar").removeAttr("style");
                $("div.table-td>table.bp-table>tbody>tr").last().remove();
                $("div.table-td>table.bp-table").prepend($("table.bp-table.scroll-th>thead"));
                $("table.bp-table.scroll-th").remove();
                $("i[bx-name=tooltips]").removeAttr("id").css( 'cursor', 'pointer' );
                $("div.table-td>table.bp-table").removeClass( "bp-table" ).addClass( "bp-table tablesorter" );
            }
        column_json = $(".bp-table.tablesorter").tableToJSON({
             onlyColumns:[get_headerth("点击量"),get_headerth("总购物车数"),get_headerth("直接购物车数"),get_headerth("收藏宝贝数")],
         });
        insert_point = get_headerth("点击率");
        set_new_rate_col("总购物车数", "总加购率");
        set_cf_col("收藏加购率")
        set_new_rate_col("收藏宝贝数", "收藏率");
        set_new_rate_col( "直接购物车数", "直接加购率");
        $.tablesorter.defaults.cssHeader = 'tbs_header';
        //$.tablesorter.defaults.sortInitialOrder = 'desc';
        $.tablesorter.defaults.sortList = [[insert_point,1]];
        $(".bp-table.tablesorter").tablesorter();
        })};

    function set_new_rate_col(headerName, newName){
        for(var i=0; i<column_json.length;i++){
            if (column_json[i]["点击量"].length === 0){
                rate = "";
            }else if(column_json[i]["点击量"].indexOf("-") !== -1){
                rate = 0;
            }else {
                if (column_json[i][headerName].indexOf("-") !== -1){
                    rate = 0;
                }else{
                    rate = ((parseInt(column_json[i][headerName])/parseInt(column_json[i]["点击量"]))*100).toFixed(2).toString() + '%';
                }
            }
            column_json[i][newName] = rate;
        };
        $('.bp-table.tablesorter>thead>tr>th').eq(insert_point).after('<th style="width:100px;cursor: pointer;">'+newName+'</th>')
        $('.bp-table.tablesorter>tbody>tr').each(function(i, dom_obj){
            $(this).find("td").eq(insert_point).after('<td style="width:100px;" >' + column_json[i][newName] + "</td>");
        })
    }
    function set_cf_col(newName){
        for(var i=0; i<column_json.length;i++){
            if (column_json[i]["点击量"].length === 0){
                rate = "";
            }else if(column_json[i]["点击量"].indexOf("-") !== -1){
                rate = 0;
            }else {
                if (column_json[i]["直接购物车数"].indexOf("-") !== -1){
                    column_json[i]["直接购物车数"] = '0';
                }
                if (column_json[i]["收藏宝贝数"].indexOf("-") !== -1){
                    column_json[i]["收藏宝贝数"] = '0';
                }
                var total_cf = parseInt(column_json[i]["直接购物车数"]) + parseInt(column_json[i]["收藏宝贝数"]);
                var click_value =  parseInt(column_json[i]["点击量"]);
                rate = ((total_cf/click_value)*100).toFixed(2).toString() + '%';
            }
            column_json[i][newName] = rate;
        };
        $('.bp-table.tablesorter>thead>tr>th').eq(insert_point).after('<th style="width:100px;cursor: pointer;">'+newName+'</th>')
        $('.bp-table.tablesorter>tbody>tr').each(function(i, dom_obj){
            $(this).find("td").eq(insert_point).after('<td style="width:100px;" >' + column_json[i][newName] + "</td>");
        })
    }
//添加关键词点击率行业对比数据
    var token_keyword;
    var keyword;
    var d7_std;
    var d2_std;
    var key_word_url;
    var ctr_index,click_index,avgP_index,cvr_index,comp_index;
    var bottom_ctr,bottom_avgP,bottom_comp,bottom_cvr,bottom_click;
    var d1_time;
    var date = new Date();
    var ctr_value_avg,ctr_value_self;



    waitForKeyElements ("span.btn.ml10.fl:contains('删除')",main_key_word);

    function main_key_word(jNode){
        jNode.after('<span id= "_btn_addAvgData" class="btn ml10 fl"  href="javascript:void(0)">行业数据</span>');

        $('#_btn_addAvgData').click(function (){
            current_url = window.location.href;
            referer_text = current_url.match( /\#\!(.*)/)[0].slice(2);

            get_keyword_token(function(data) {
                token_keyword = data['result']['token'];
                d7_std = date.getFullYear() + '-' +(date.getMonth() + 1) + '-' + (date.getDate()-7);
                d2_std = date.getFullYear() + '-' +(date.getMonth() + 1) + '-' + (date.getDate()-1);
                ctr_index = get_headerth_keyword("点击率");
                avgP_index = get_headerth_keyword("平均点击花费");
                click_index = get_headerth_keyword("点击量");
                cvr_index = get_headerth_keyword("点击转化率");
                comp_index = get_headerth_keyword("平均排名")+1;
                if (current_url.indexOf("standards" ) !== -1){

                    $('div.table-container>table.bp-table>tbody>tr').each(function(i, dom_obj){
                        if (i > 0){
                            keyword = $(this).find("td").eq(3).find("span").eq(0).attr('title');//
                            if (typeof keyword != 'undefined'){
                                key_word_url = 'https://subway.simba.taobao.com/report/getNetworkPerspective.htm?bidwordstr=' + keyword + '&startDate=' + d7_std + '&endDate=' + d2_std + '&perspectiveType=2';
                                get_ctr_7_S(key_word_url,i);
                            }else{
                                return false;
                            }
                        }
                       });
                }else{

                        $('div.freeze-td.hide-scroll-bar>table.bp-table>tbody>tr').each(function(i, dom_obj){
                            if (i > 0){
                                keyword = $(this).find("td").eq(3).find("span").attr('title');
                                if (typeof keyword != 'undefined'){
                                    key_word_url = 'https://subway.simba.taobao.com/report/getNetworkPerspective.htm?bidwordstr=' + keyword + '&startDate=' + d7_std + '&endDate=' + d2_std + '&perspectiveType=2';
                                    get_ctr_7(key_word_url,i);
                                }
                                else{
                                    return false;
                                }
                            }
                        });
                        }
                    });
        });
    }

    function get_keyword_token(callback){
        $.post('https://subway.simba.taobao.com/bpenv/getLoginUserInfo.htm', {
            referer : referer_text
        },
        function(data){
            callback(data)
        });
    }

    function get_ctr_7(key_word_url,i){
        $.post(key_word_url,
               {sla: 'json',
                isAjaxRequest: 'true',
                token: token_keyword,
                _referer: '/tools/insight/queryresult?kws='+ keyword +'&tab=tabs-region'
               },
               function(data){
            keyword_add_ctr(data["result"][1],i);
        }
              )}

    function get_ctr_7_S(key_word_url,i){
        $.post(key_word_url,
               {sla: 'json',
                isAjaxRequest: 'true',
                token: token_keyword,
                _referer: '/tools/insight/queryresult?kws='+ keyword +'&tab=tabs-region'
               },
               function(data){
            keyword_add_ctr_S(data["result"][1],i);
        }
              )}

    function keyword_add_ctr_S(keyword_data,i){
        ctr_value_avg = (parseInt(keyword_data['ctr']) * 0.01).toFixed(2);
        ctr_value_self = (parseFloat($('div.table-container>table.bp-table>tbody>tr').eq(i).find("td").eq(ctr_index).text().split('%')[0])).toFixed(2)
        if (ctr_value_self === 'NaN'){
            ctr_value_self = 0
        }
        bottom_ctr =  '均: '+ ctr_value_avg+ "%";
        if (eval(ctr_value_self) < eval(ctr_value_avg)){
            $('div.table-container>table.bp-table>tbody>tr').eq(i).find("td").eq(ctr_index).append('<p style="color:#FF8888" id = "_bottom_LowCtr" >' + bottom_ctr + "</p>");
        }else{
            $('div.table-container>table.bp-table>tbody>tr').eq(i).find("td").eq(ctr_index).append('<p style="color:#99BBFF" id = "_bottom_ctr" >' + bottom_ctr + "</p>");
        }

        bottom_avgP = '均: '+"￥"+(parseInt(keyword_data['avgPrice']) * 0.01).toFixed(2);
        $('div.table-container>table.bp-table>tbody>tr').eq(i).find("td").eq(avgP_index).append('<p style="color:#99BBFF" id = "_bottom_avgP" >' + bottom_avgP + "</p>");

        bottom_comp = '竞争: '+(parseInt(keyword_data['competition'])/7).toFixed(0);
        $('div.table-container>table.bp-table>tbody>tr').eq(i).find("td").eq(comp_index).append('<p style="color:#99BBFF" id = "_bottom_comp" >' + bottom_comp + "</p>");

        bottom_cvr = '均: '+(parseInt(keyword_data['cvr']) * 0.01).toFixed(2) + "%";
        $('div.table-container>table.bp-table>tbody>tr').eq(i).find("td").eq(cvr_index).append('<p style="color:#99BBFF" id = "_bottom_cvr" >' + bottom_cvr + "</p>");

        bottom_click = '指数: '+(parseInt(keyword_data['click'])/7).toFixed(0);
        $('div.table-container>table.bp-table>tbody>tr').eq(i).find("td").eq(click_index).append('<p style="color:#99BBFF" id = "_bottom_click" >' + bottom_click + "</p>");
    }

    function keyword_add_ctr(keyword_data,i){
        ctr_value_avg = (parseInt(keyword_data['ctr']) * 0.01).toFixed(2);
        ctr_value_self = (parseFloat($('div.table-td>table.bp-table>tbody>tr').eq(i).find("td").eq(ctr_index).text().split('%')[0])).toFixed(2);
        if (ctr_value_self === 'NaN'){
            ctr_value_self = 0
        }
        bottom_ctr =  '均: '+ ctr_value_avg+ "%";
        if (eval(ctr_value_self) < eval(ctr_value_avg)){
            $('div.table-td>table.bp-table>tbody>tr').eq(i).find("td").eq(ctr_index).append('<p style="color:#FF8888" id = "_bottom_LowCtr" >' + bottom_ctr + "</p>");
        }else{
            $('div.table-td>table.bp-table>tbody>tr').eq(i).find("td").eq(ctr_index).append('<p style="color:#99BBFF" id = "_bottom_ctr" >' + bottom_ctr + "</p>");
        }

        bottom_avgP = '均: '+"￥"+(parseInt(keyword_data['avgPrice']) * 0.01).toFixed(2);
        $('div.table-td>table.bp-table>tbody>tr').eq(i).find("td").eq(avgP_index).append('<p style="color:#99BBFF" id = "_bottom_avgP" >' + bottom_avgP + "</p>");

        bottom_comp = '竞争: '+(parseInt(keyword_data['competition'])/7).toFixed(0);
        $('div.table-td>table.bp-table>tbody>tr').eq(i).find("td").eq(comp_index).append('<p style="color:#99BBFF" id = "_bottom_comp" >' + bottom_comp + "</p>");

        bottom_cvr = '均: '+(parseInt(keyword_data['cvr']) * 0.01).toFixed(2) + "%";
        $('div.table-td>table.bp-table>tbody>tr').eq(i).find("td").eq(cvr_index).append('<p style="color:#99BBFF" id = "_bottom_cvr" >' + bottom_cvr + "</p>");

        bottom_click = '指数: '+(parseInt(keyword_data['click'])/7).toFixed(0);
        $('div.table-td>table.bp-table>tbody>tr').eq(i).find("td").eq(click_index).append('<p style="color:#99BBFF" id = "_bottom_click" >' + bottom_click + "</p>");
    }

    function get_headerth_keyword(header_name){
        return $("thead>tr>th").index($("th:contains('"+header_name +"')"));
    }

//勾选点击率低于行业的关键词
var low_ctr_th;
waitForKeyElements ("#_btn_addAvgData",select_low_ctr);
function select_low_ctr(jNode){
    jNode.after('<span id= "_btn_selLowCtr" class="btn ml10 fl"  href="javascript:void(0)">选择低点击率</span>');

    $('#_btn_selLowCtr').click(function (){
        current_url = window.location.href;
        if (current_url.indexOf("standards" ) !== -1){
            $('p#_bottom_LowCtr').each(function(i, dom_obj){
                $(this).parent().parent().find('td').eq(0).find('input').prop('checked',true);
            });
        }else{
            $('p#_bottom_LowCtr').each(function(i, dom_obj){
                low_ctr_th = parseInt($(this).parent().parent().attr('index')) - 1;
                $('div.freeze-td.hide-scroll-bar>table.bp-table>tbody>tr').eq(low_ctr_th).find('td').eq(0).find('input').prop('checked',true);
            });
        }
    });
}

})();
