// ==UserScript==
// @name         fanwei-helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://fanwei.dongfangfuli.com/spa/workflow/static4form/index.html*
// @icon         hhttps://fanwei.dongfangfuli.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420990/fanwei-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/420990/fanwei-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.autoFill = function(type) {
        var begin_time_str = $('#baoxiao_helper_begin_date').val()
        var end_time_str = $('#baoxiao_helper_end_date').val()


        var userId = JSON.parse(localStorage['theme-account'])['accountlist'][0]['userid'];
        var query_date_range = {
            'data': '{"pageIndex":1,"typeselect":"6","fromDate":"'+begin_time_str+'","toDate":"'+end_time_str+'","viewScope":"3","resourceId":"'+userId+'","isNoAccount":"0","attendanceSerial":""}',
            'reportType': 'daily'
        }
        $.post('https://fanwei.dongfangfuli.com/api/kq/report/getKQReport', query_date_range,
               function(data) {
            JSON.parse(data).datas.forEach(function(item, index) {
                var dayOfWeek = new Date(item.kqdate).getDay();
                var isWeekend = dayOfWeek == 0 || dayOfWeek == 6;

                // TODO 不支持跨天的222
                if (item.signouttime1 != '未打卡') {
                    if (isWeekend && item.signouttime1) {
                        // 周末的需要手动添加
                        console.log(item.kqdate + ' ->' + item.signouttime1 + ',周末：' + isWeekend)
                    }

                    var begin_time = item.signintime1 < '09:00:00' ? '09:00:00':item.signintime1;
                    //new Date('2020-08-08 20:00:00') - new Date('2020-08-08 09:00:00')
                    console.log(begin_time + ' --- ' + item.signouttime1)
                    var diff = (new Date('2020-08-08 '+item.signouttime1) - new Date('2020-08-08 '+begin_time))
                    if (!isWeekend && diff/1000/60/60 >=11) {
                        console.log(item.kqdate + ' ==>' + item.signouttime1);
                        $('.detailButtonDiv>.icon-coms-Add-to-hot.detailBtn').first().trigger('click');
                        butie(item.kqdate,type,30)
                        // 					butie(item.kqdate,0,'车补',50)
                    }
                }
            })
        })
    }

    window.butie = function(kqdate, type, money) {
        var $last_row = $('.detail_data_row').last();
        var ind = $last_row.data('rowindex') + 1;

        var type_display = '餐补'

        $last_row.find('.wea-date-picker').find('span[class=text]').text(kqdate);
        $last_row.find('.wea-date-picker').find('input[type=hidden]').val(kqdate);
        //$last_row.find('.ant-select-selection-selected-value').text(type_display).prop('title', type_display).closest('td').find('input[type=hidden]').val(type);
        $last_row.find('.wf-input.wf-input-3.wf-input-detail').val(money)
    }



    var baoxiao_div = `<div class="site-button-ghost-wrapper"
style="height:40px; background-color: lightgray; margin:2px 5px;padding:2px 20px">
开始日期: <input id="baoxiao_helper_begin_date" class="wf-input wf-input-2" type="text" value="2021-01-01" style="width:80px"/>
结束日期: <input id="baoxiao_helper_end_date" class="wf-input wf-input-2" type="text" value="2021-01-31" style="width:80px"/>

<button type="button" type="dashed" class="ant-btn ant-btn-primary ant-btn-sm" onclick="autoFill(1)">餐补</button>
<button type="button" class="ant-btn ant-btn-primary ant-btn-sm"  onclick="autoFill(0)">车补</button>
`

    $('#container').prepend($(baoxiao_div));
})();