// ==UserScript==
// @name         douke_data
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键拉取抖客联盟推广位效果报表数据，取代手动查询拉取
// @author       paperen
// @match        https://buyin.jinritemai.com/dashboard/promotion/data
// @icon         https://paperen.com/upload/thumbnail/bxjg_8.gif
// @grant        none
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463821/douke_data.user.js
// @updateURL https://update.greasyfork.org/scripts/463821/douke_data.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var recv_api_url = 'https://dsp.adprod.cn/api/data/douke_add';
    var page_size = 100;
    var api_map = {
        'channel_list_api': 'https://buyin.jinritemai.com/api/distributor/channel/list?channel_type=255',
        'channel_promotion_list_api': 'https://buyin.jinritemai.com/api/distributor/promotion/list?channel_id=',
        'channel_promotion_detail_api': 'https://buyin.jinritemai.com/api/distributor/promotion/detail/list?channel_type=255&channel_id={channel_id}&pid={pid}&start_date={start}&end_date={end}&page={page}&page_size={page_size}&distribution_type=0'
    };
    $(document).ready(function(){
        var button = $('<button>');
        button.css({
            'color': '#fff',
            'background': 'blue',
            'border': '1px solid #000',
            'float': 'right',
            'padding': '6px',
            'border-radius': '6px',
            'margin-top': '5px'
        });
        button.text('一键同步数据');
        button.on("click", function(){
            try {
                var date_start = $('.auxo-picker input:first').val().replaceAll('/', '-');
                var date_end = $('.auxo-picker input:last').val().replaceAll('/', '-');
                $.getJSON(api_map['channel_list_api'], function(res){
                    res['data'].forEach(d => {
                        $.getJSON(api_map['channel_promotion_list_api'] + d['channel_id'], function(res){
                            res['data'].forEach(d => {
                                fetch_page_data(d, date_start, date_end, 1);
                            });
                        });
                    });
                });
				alert('爬取成功');
            } catch(e) {
                console.log('爬取异常' + e);
				alert('爬取失败');
            }
        });

        setTimeout(function(){
            $('.btns').append($(button));
        }, 2000);
    });

    function fetch_page_data(channel_promotion, date_start, date_end, page) {
        let api_url = api_map['channel_promotion_detail_api']
        .replace('{channel_id}', channel_promotion['channel_id'])
        .replace('{pid}', channel_promotion['pid'])
        .replace('{start}', date_start)
        .replace('{end}', date_end)
        .replace('{page_size}', page_size)
        .replace('{page}', page)
        ;
        $.getJSON(api_url, function(res){
            let total = res['data']['total'];
            if (total == 0) return;
            let page_nums = Math.ceil(total / page_size);
            console.log(`开始爬取${channel_promotion['promotion_name']} ${date_start}至${date_end} 第${page}页数据`);
            if (page == 1) {
                // 循环爬取全部页面数据
                for(var i=2;i<=page_nums;i++) fetch_page_data(channel_promotion, date_start, date_end, i);
            }
            var post_data = {
                'data': res['data']['data_summary']
            };
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: recv_api_url,
                data: post_data,
                success: function(res){
                    var cnt = post_data['data'].length;
                    console.log(`完成爬取 ${channel_promotion['promotion_name']} ${date_start}至${date_end} 第${page}页 ${cnt}条记录`);
                }
            });
        });
    }

    String.prototype.replaceAll = function(s1, s2) {
        return this.replace(new RegExp(s1, 'gm'), s2);
    }
})();