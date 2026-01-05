// ==UserScript==
// @name         邦达之家获取打卡记录
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Ajax获取打卡记录并追加在页面顶部
// @author       ZMeng
// @match        http://i.bondex.com.cn/
// @require      http://cdn.bootcss.com/json2/20160511/json2.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28377/%E9%82%A6%E8%BE%BE%E4%B9%8B%E5%AE%B6%E8%8E%B7%E5%8F%96%E6%89%93%E5%8D%A1%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/28377/%E9%82%A6%E8%BE%BE%E4%B9%8B%E5%AE%B6%E8%8E%B7%E5%8F%96%E6%89%93%E5%8D%A1%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $('body').append('<script>var get=0;</script>');
    var today = new Date();
    var viewer = '<div id="btn-group" class="row" style="padding-top:10px;">' +
        '<div class="col-xs-12 text-center">' +
        '<div class="btn-group" role="group" aria-label="按钮组">' +
        '<button type="button" class="btn btn-primary btn-sm" id="previous">上月</button>' +
        '<button type="button" class="btn btn-primary btn-sm">' + today.getFullYear() + ' - ' + (today.getMonth() + 1) + '</button>' +
        '<button type="button" class="btn btn-primary btn-sm" id="now">本月</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('#index').prepend(viewer);
    $('#previous').click(function () {
        get += -1;
        load(get);
    });

    $('#now').click(function () {
        get = 0;
        load(get);
    });
    load(0);
})();

function CalcTime(ticks) {
    var leftSecond = parseInt(ticks / 1000);
    var day = Math.floor(leftSecond / (60 * 60 * 24));
    var hour = Math.floor((leftSecond - day * 24 * 60 * 60) / 3600);
    var minute = Math.floor((leftSecond - day * 24 * 60 * 60 - hour * 3600) / 60);
    var second = Math.floor(leftSecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
    return { day: day, hour: hour, minute: minute, second: second };
}

function load(get) {
    var url = '/My/CheckData';
    var flag = '?flag=';
    for (var k = 0; k < Math.abs(get); k++) {
        flag += 'pre';
    }
    if (get !== 0) {
        url += flag;
    }
    console.log(url);
    $.ajax({
        async: true,
        type: "POST",
        url: url,
        dataType: "json",
        contentType: 'application/x-www-form-urlencoded',
        beforeSend: function () {
            $('.table.table-bordered').remove();
            //console.clear();
        },
        success: function (data) {
            var dateSign = new Date(data[0].Date_Sign);
            var _year = dateSign.getFullYear();
            var _month = dateSign.getMonth() + 1;
            var _day = dateSign.getDate();
            var _week = dateSign.getDay();

            $('.btn-group :button').eq(1).text(dateSign.getFullYear() + ' - ' + (dateSign.getMonth() + 1))


            var weekDay = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            var today = new Date();

            //data.sort(function (a, b) {
            //    return new Date(b.Date_Sign) - new Date(a.Date_Sign);
            //});

            //迟到总分钟数
            var deductMinutes = 0;
            //迟到费
            var deductMoneys = 0;
            //加班总分钟数
            var darkMinutes = 0;
            //加班费
            var darkMoneys = 0;
            //加班计费点数
            var darkPoints = 0.0;

            var viewer = '';
            viewer += '<table class="table table-bordered">';
            viewer += '<style>' +
                '#index{background-color:#fff;}' +
                '.table-bordered, .table-bordered>tbody>tr>td, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>td, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>thead>tr>th{border-color:#ccc;}' +
                '</style>';
            viewer += '<caption></caption>';
            viewer += '<thead>';
            viewer += '<tr>';
            $.each(weekDay, function (i, v) {
                if (i === 0 || i === 6) {
                    viewer += '<th class="col-xs-1 text-center" style="color:#fff;background-color:#f39c12;"><span class="label label-warning">' + v + '</span></th>';
                } else {
                    viewer += '<th class="col-xs-2 text-center" style="color:#fff;background-color:#777;"><span class="label label-default" style="color:#fff;background-color:#777;">' + v + '</span></th>';
                }
            });
            viewer += '</tr>';
            viewer += '</thead>';
            viewer += '<tbody>';

            $.each(data, function (i, v) {
                var dateSignIn = new Date(v.Date_Sign + ' ' + v.Time_SignIn);           //上午打卡时间
                var dateSignOut = new Date(v.Date_Sign + ' ' + v.Time_SignOut);         //下午打卡时间

                var dateBaseSignIn = new Date(v.Date_Sign + ' ' + v.BaseSignIn);        //上午上班时间 08:30
                var dateBaseSignOut = new Date(v.Date_Sign + ' ' + v.BaseSignOut);      //下午下班时间 15:30

                var RelaxStartTime = new Date(v.Date_Sign + ' ' + v.RelaxStartTime);    //中午下班时间 12:00
                var RelaxEndTime = new Date(v.Date_Sign + ' ' + v.RelaxEndTime);        //下午上班时间 13:30


                var today = new Date();
                var todayStr = today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? ("0" + (today.getMonth() + 1)) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? ("0" + today.getDate()) : today.getDate());

                var day = new Date(v.Date_Sign);
                var week = weekDay[day.getDay()];

                if (day.getDay() === 0) {
                    viewer += '<tr>';
                }

                if (i === 0) {
                    for (var j = 0; j < day.getDay() - i; j++) {
                        if (j == 0 || j == 6) {
                            viewer += '<td class="col-xs-1"></td>';
                        } else {
                            viewer += '<td class="col-xs-2"></td>';
                        }
                    }
                }

                viewer += '<td class="col-xs-' + (day.getDay() === 0 || day.getDay() === 6 ? '1' : '2') + '"><h4><span class="badge ' + (day.getDay() === 0 || day.getDay() === 6 ? 'bg-yellow' : '') + '">' + day.getDate() + '</span></h4>';
                if (todayStr == v.Date_Sign) {
                    viewer += '<p><span class="label label-default">今天不算</span></p>';
                }
                else {
                    //上班未打卡 排除周日周六
                    if ((dateSignIn > RelaxStartTime || v.Time_SignIn == "") && (day.getDay() != 0 && day.getDay() != 6) && v.IsHoliday == false) {
                        if (v.ApproveInfo.indexOf("已通过") == -1) {
                            //未通过 扣50
                            deductMoneys -= 50;
                            viewer += '<p><span class="label label-danger">上班未打卡</span> <span class="label label-danger">￥50</span></p>';
                        } else {
                            viewer += '<p><span class="label label-default">上班未打卡</span> <span class="label label-default">已通过</span></p>';
                        }
                    }
                    //上班打卡
                    else if (dateSignIn > dateBaseSignIn) {
                        //迟到了
                        var timer = CalcTime(dateSignIn - dateBaseSignIn);
                        var loseMinute = (timer.hour + timer.day * 24) * 60 + timer.minute;
                        deductMinutes += loseMinute;

                        if (loseMinute > 0) {
                            //真迟到了
                            if (deductMinutes > 30) {
                                //超出优惠
                                var deductmoney = (deductMinutes - 30) * 5;
                                if (deductMoneys === 0) {
                                    deductMoneys += deductmoney;

                                    viewer += '<p class="text-warning"><span class="label label-danger">' + v.Time_SignIn + '</span></p><p><span class="label label-danger">' + loseMinute + 'min</span> <span class="label label-danger">￥' + deductmoney + '</span></p>';
                                } else {
                                    deductMoneys += deductmoney = loseMinute * 5;

                                    viewer += '<p class="text-warning"><span class="label label-danger">' + v.Time_SignIn + '</span></p><p><span class="label label-danger">' + loseMinute + 'min</span> <span class="label label-danger">￥' + loseMinute * 5 + '</span></p>';
                                }
                            } else {
                                viewer += '<p class="text-warning"><span class="label label-warning">' + v.Time_SignIn + '</span></p><p><span class="label label-warning">' + loseMinute + 'min</span></p>';
                            }
                        } else {
                            //一分钟内不算
                            viewer += '<p><span class="label label-default" style="color:#fff;background-color:#777;">' + v.Time_SignIn + '</span></p><p>&nbsp;</p>';
                        }
                    }
                    else {
                        viewer += '<p><span class="label label-default" style="color:#fff;background-color:#777;">' + v.Time_SignIn + '</span></p></p><p>&nbsp;</p>';
                    }


                    //下班未打卡  排除周日周六
                    if ((dateSignOut < RelaxEndTime || v.Time_SignOut == "") && (day.getDay() != 0 && day.getDay() != 6) && v.IsHoliday == false) {
                        if (v.ApproveInfo.indexOf("已通过") == -1) {
                            //未通过 扣50
                            deductMoneys -= 50;
                            viewer += '<p><span class="label label-danger">下班未打卡</span> <span class="label label-danger">￥50</span></p>';
                        }
                        else {
                            viewer += '<p><span class="label label-default">下班未打卡</span> <span class="label label-default">已通过</span></p>';
                        }
                    }
                    //下班打卡
                    else if (dateSignOut > dateBaseSignOut) {
                        //加班了
                        var timer = CalcTime(dateSignOut - dateBaseSignOut);
                        var darkMinute = (timer.hour + timer.day * 24) * 60 + timer.minute;
                        var darkPoint = parseFloat((darkMinute - darkMinute % 30) / 60);
                        var darkMoney = darkPoint * 10;

                        darkMinutes += darkMinute;
                        darkMoneys += darkMoney;
                        darkPoints += darkPoint;

                        if (darkMoney > 0) {
                            viewer += '<p class="text-info"><span class="label label-primary">' + (v.Time_SignOut === v.Time_SignIn ? '' : v.Time_SignOut) + '</span></p><p><span class="label label-primary">' + darkMinute + 'min</span> <span class="label label-primary">￥' + darkMoney + '</span></p>';
                        } else {
                            viewer += '<p class="text-info"><span class="label label-default" style="color:#fff;background-color:#777;">' + (v.Time_SignOut === v.Time_SignIn ? '' : v.Time_SignOut) + '</span></p><p><span class="label label-default" style="color:#fff;background-color:#777;">' + darkMinute + 'min</span></p>';
                        }
                    } else {
                        //早退了
                        viewer += '<p><span class="label label-default" style="color:#fff;background-color:#777;">' + (v.Time_SignOut === v.Time_SignIn ? '' : v.Time_SignOut) + '</span></p></p><p>&nbsp;</p>';
                    }

                }
                viewer += '</td>';
                if (day.getDay() === 6) {
                    viewer += '</tr>';
                }
            });

            viewer += '</tbody>';
            viewer += '</table>';
            //console.log(parseFloat((darkMinutes - darkMinutes % 30) / 60).toFixed(1));
            //console.log({ '迟到总分钟数': deductMinutes, '加班总分钟数': darkMinutes, '迟到费': deductMoneys, '加班点数': darkPoints, '加班费': darkMoneys });
            $('#btn-group').after(viewer);
            $('caption').html('&nbsp;&nbsp;' +
                '本月共迟到：<span class="label label-warning">' + deductMinutes + 'min</span> <span class="label label-danger">' + (deductMinutes - 30) + 'min</span> ' +
                '共加班：<span class="label label-primary">' + darkMinutes + 'min</span> ' +
                '加班计费时长：<span class="label label-primary">' + darkPoints * 60 + 'min</span> <span class="badge">' + darkPoints + 'h</span> ' +
                '迟到扣除工资：<span class="label label-danger">￥' + deductMoneys + '</span> ' +
                '加班奖励工资：<span class="label label-primary">￥' + darkMoneys + '</span>');
        }
    });
}