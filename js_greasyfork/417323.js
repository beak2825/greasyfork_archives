// ==UserScript==
// @name         overtime
// @namespace    https://ai.ehuatek.com/
// @version      0.0.2
// @description  加班工时计算
// @author       tim
// @match        https://ai.ehuatek.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417323/overtime.user.js
// @updateURL https://update.greasyfork.org/scripts/417323/overtime.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(".el-table").css("height", "1000px");
    var interval = setInterval(init, 1000);

    function init() {
        if ($(".attendanceManage-container").length > 0) {
            moment().format();
            console.log('开始解析...')
            console.log('共' + $(".el-table__row").length + '行数据')

            if ($(".el-table__row").length < 2) {
                return;
            }
            $(".el-table").css("height", "1000px");
            //clearInterval(interval);
            //加班天数
            var overDate = 0
            //加班总小时
            var overtime = 0
            $(".el-table__row").each(function (i, j) {
                var startTime = new Date('1970-01-01 ' + $(this).find(".el-table_1_column_9").text())
                var endTime = new Date('1970-01-01 ' + $(this).find(".el-table_1_column_10").text())
                var result = moment.duration(moment(endTime, "HH:mm").diff(moment(startTime, "HH:mm"))).as('hours') - 10;
                //result=result.toFixed(2)
                var temp = $(".el-table_1_column_8").eq(i + 1).find(".cell");
                if (result > 0) {
                    overDate++;
                    if (temp.find(".overtime").length == 0) {
                        temp.append("<span class='overtime' style='color:red'>&nbsp;&nbsp;加班工时: " + result.toFixed(2) + "</span>");
                    }

                    overtime = overtime + parseFloat(result);
                }
            })
            if ($(".overtimetotal").length == 0) {
                $(".el-table_1_column_8").eq(0).find(".cell").append("<span class='overtimetotal' style='color:red'>&nbsp;&nbsp;&nbsp;&nbsp;total: " + overtime.toFixed(2) + "(" + overDate + "天)</span>");
            } else {
                $(".overtimetotal").html("&nbsp;&nbsp;&nbsp;&nbsp;total: " + overtime.toFixed(2) + "(" + overDate + "天)");
            }
        }
    }

})();