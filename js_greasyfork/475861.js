// ==UserScript==
// @name         宇信OA-报销助手
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  打开方式：在报销管理-我的报销管理页面中，增加统计报销按钮
// @author       You
// @license      MIT
// @match        https://it.yusys.com.cn/yusysFmisPc//FEExpense/toList*
// @match        https://it.yusys.com.cn/yusysFmisPc/FEExpense/toPage*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475861/%E5%AE%87%E4%BF%A1OA-%E6%8A%A5%E9%94%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/475861/%E5%AE%87%E4%BF%A1OA-%E6%8A%A5%E9%94%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const $ = window.$;
    const moment = window.moment;
    const { log, table } = window.console;
    // 可以报销的最早打卡时间
    const earliestCheckinTime = "20:30";
    // 员工编号
    const actorno = document.cookie.match(/currentUserId=(\d+);/)[1];
    // 存储统计结果
    const resultList = [];

    // 查询当月考勤列表，同考勤报工管理-员工考勤查询页面
    const queryCurrentMonthDaysList = async function () {
        const month = document.querySelector("#_query_month").value;

        try {
            const res = await fetch(
                "/yusysAttendancePc/AmsTAttendanceCalendar/getCalendarAndUnitDataPackageByGeneral",
                {
                    headers: {
                        accept: "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
                        "cache-control": "no-cache",
                        "content-type": "application/x-www-form-urlencoded",
                        pragma: "no-cache",
                        "sec-ch-ua": navigator.userAgentData.brands
                            .map((a) => '"' + a.brand + '";v="' + a.version + '"')
                            .join(", "),
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": navigator.userAgentData.platform,
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest",
                    },
                    referrer:
                        "https://it.yusys.com.cn/yusysAttendancePc/AmsTAttendanceCalendar/toCalendar",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: `attendancePeriod=${month}`,
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                }
            ).then((r) => r.json());
            // res.calendarDateDataList.sort((a, b) => a.attendanceDate - b.attendanceDate)
            return res.calendarDateDataList || [];
        } catch (e) {
            log(e);
            return null;
        }
    };
    // 查询考勤日考勤详情
    const queryDayDetail = async function (day) {
        try {
            const res = await fetch(
                "/yusysAttendancePc/AmsTCheckin/queryListByAttendanceQuery",
                {
                    headers: {
                        accept: "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
                        "cache-control": "no-cache",
                        "content-type": "application/x-www-form-urlencoded",
                        pragma: "no-cache",
                        "sec-ch-ua": navigator.userAgentData.brands
                            .map((a) => '"' + a.brand + '";v="' + a.version + '"')
                            .join(", "),
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": navigator.userAgentData.platform,
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest",
                    },
                    referrer: "",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: `limit=500&offset=0&actorno=${actorno}&checkinDate=${day}&dateOption=01`,
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                }
            ).then((r) => r.json());
            return res.rows;
        } catch (e) {
            log(e);
            return null;
        }
    };
    const renderTable = async function (data = resultList) {
        // 创建表格元素
        var table = $('<table id="tongjitabel" class="table table-bordered table-hover"></table>');
        // 创建表头
        var thead = $('<thead></thead>');
        var headerRow = $('<tr></tr>');
        headerRow.append('<th>打卡日期</th>');
        headerRow.append('<th>打卡时间</th>');
        headerRow.append('<th>报销类型</th>');
        headerRow.append('<th>可报销金额</th>');
        thead.append(headerRow);
        table.append(thead);
        // 创建表格内容
        var tbody = $('<tbody></tbody>');
        for (var i = 0; i < data.length; i++) {
            const rowInfo = data[i]
            var row = $('<tr width="100px"></tr>');
            if (rowInfo.date == "总计") {
                row.append('<td colspan="3">' + rowInfo.date + '</td>');
                row.append('<td align="right">' + rowInfo.amount + '元</td>');
            } else {
                row.append('<td>' + rowInfo.date + '</td>');
                row.append('<td>' + rowInfo.checkoutTime + '</td>');
                row.append('<td>' + rowInfo.type + '</td>');
                row.append('<td align="right">' + rowInfo.amount + '元</td>');
            }
            tbody.append(row);
        }
        table.append(tbody);
        // 将表格添加到页面中
        if ($('#tongjitabel').length > 0) {
            $('#tongjitabel').remove()
        }
        $('body').append(table);
        // 获取文档的高度
        var docHeight = $(document).height();
        // 设置滚动条位置为文档的高度
        $('html, body').animate({ scrollTop: docHeight }, 'slow');
        $("#jqloading").hide()
    };
    const btn1OnClick = async function (e) {
        $("#jqloading").show()
        e.target.disabled = "disabled";
        resultList.splice(0);
        const days = await queryCurrentMonthDaysList();
        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            const selectMonth = document.querySelector("#_query_month").value;
            const thisMonth = moment(selectMonth + "-20").subtract(1, "months");
            const isBetween = moment(day.calendarDate).isBetween(
                thisMonth.format("YYYY-MM-DD"),
                moment(selectMonth + "-21"),
                undefined,
                "(]"
            );
            // 是否打卡时间异常（包括打卡时间、地点异常、远程支持等）、出差
            if (
                !isBetween ||
                day.offExplainType ||
                !day.amsVAttendanceCalendarTitleList ||
                !day.amsVAttendanceCalendarTitleList[0]
            ) {
                continue;
            }
            // 获取打卡详情
            const detail = await queryDayDetail(day.calendarDate);
            if (detail.length === 0) {
                continue;
            }
            // 上午打卡时间
            const checkinTime = moment(detail[0].checkinTime);
            // 下午打卡时间
            const checkoutTime = moment(detail[1].checkinTime);
            //
            const attendanceType =
                day.amsVAttendanceCalendarTitleList[0].attendanceType || "02";
            // 判断是否节假日加班
            if (attendanceType !== "01") {
                const canBx = checkoutTime.diff(checkinTime, "H") >= 4;
                if (canBx) {
                    resultList.push({
                        date: day.calendarDate,
                        type: "节假日加班",
                        amount: 20,
                        checkoutTime: checkoutTime.format("HH:mm"),
                    });
                }
            } else {
                const canBx =
                    checkoutTime.diff(
                        moment(day.calendarDate + " " + earliestCheckinTime),
                        "m"
                    ) >= 0;
                if (canBx) {
                    resultList.push({
                        date: day.calendarDate,
                        type: "工作日加班",
                        amount: 30,
                        checkoutTime: checkoutTime.format("HH:mm"),
                    });
                }
            }
        }
        e.target.disabled = undefined;
        let amount = 0;
        resultList.forEach((i) => (amount += i.amount));
        resultList.push({ date: "总计", amount: amount });
        table(resultList);
        renderTable();
    };

    const findDateTabele = function () {
        const dateTabele = document.querySelector("#tableFETaxiDetailinfo");
        if (!dateTabele) {
            setTimeout(() => {
                findDateTabele();
            }, 1000);
        } else {
            function copyToOther (taxiBoxId, flag) {
                var selectRow_index; //选中行索引
                var taxiBoxIdList = $("#tableFETaxiDetailinfo").find(
                    "input[name$='.taxiBoxId']"
                );
                taxiBoxIdList.each(function (index) {
                    var l_taxiBoxId = $(this).val();
                    if (l_taxiBoxId == taxiBoxId) {
                        selectRow_index = index;
                    }
                });
                //选中行的值
                var taxiDate; //日期
                var taxiOnBroadTime; //时间
                var taxiWorkType; //工作分类
                var taxiReason; //工作事由
                var taxiStarting; //起始地
                var taxiDestination; //目的地
                var taxiWorkTypeList = $("#tableFETaxiDetailinfo").find(
                    "input[name$='.taxiWorkType']"
                );
                var excepFlag = 0; //无异常继续执行后面操作
                taxiWorkTypeList.each(function (index) {
                    if (index == selectRow_index) {
                        taxiWorkType = $(this).val();
                        if (taxiWorkType == "") {
                            excepFlag = 1;
                            $.msg.alert(jsondata.expense_tooltip47); //"“工作分类”为空，请先填写工作分类"
                            return;
                        }
                    }
                });

                if (excepFlag == 0) {
                    var taxiDateList = $("#tableFETaxiDetailinfo").find(
                        "input[name$='.taxiDate']"
                    );
                    taxiDateList.each(function (index) {
                        if (index == selectRow_index) {
                            taxiDate = $(this).val();
                            if (taxiDate == "") {
                                excepFlag = 1;
                                $.msg.alert("“上车日期”为空，请先填写上车日期"); //"“工作日期”为空，请先填写工作事由");
                                return;
                            }
                        }
                    });
                }

                if (excepFlag == 0) {
                    var taxiOnBroadTimeList = $("#tableFETaxiDetailinfo").find(
                        "input[name$='.taxiOnBroadTime']"
                    );
                    taxiOnBroadTimeList.each(function (index) {
                        if (index == selectRow_index) {
                            taxiOnBroadTime = $(this).val();
                            if (taxiOnBroadTime == "") {
                                excepFlag = 1;
                                $.msg.alert("“上车时间”为空，请先填写上车时间"); //"“工作时间”为空，请先填写工作事由");
                                return;
                            }
                        }
                    });
                }

                if (excepFlag == 0) {
                    var taxiReasonList = $("#tableFETaxiDetailinfo").find(
                        "input[name$='.taxiReason']"
                    );
                    taxiReasonList.each(function (index) {
                        if (index == selectRow_index) {
                            taxiReason = $(this).val();
                            if (taxiReason == "") {
                                excepFlag = 1;
                                $.msg.alert(jsondata.expense_tooltip48); //"“工作事由”为空，请先填写工作事由");
                                return;
                            }
                        }
                    });
                }
                if (excepFlag == 0) {
                    var taxiStartingList = $("#tableFETaxiDetailinfo").find(
                        "input[name$='.taxiStarting']"
                    );
                    taxiStartingList.each(function (index) {
                        if (index == selectRow_index) {
                            taxiStarting = $(this).val();
                            if (taxiStarting == "") {
                                excepFlag = 1;
                                $.msg.alert(jsondata.expense_tooltip49); //"“起始地”为空，请先填写起始地"
                                return;
                            }
                        }
                    });
                }
                if (excepFlag == 0) {
                    var taxiDestinationList = $("#tableFETaxiDetailinfo").find(
                        "input[name$='.taxiDestination']"
                    );
                    taxiDestinationList.each(function (index) {
                        if (index == selectRow_index) {
                            taxiDestination = $(this).val();
                            if (taxiDestination == "") {
                                excepFlag = 1;
                                $.msg.alert(jsondata.expense_tooltip50); //"“目的地”为空，请先填写目的地");
                                return;
                            }
                        }
                    });
                }

                //alert("selectRow_index="+selectRow_index+";taxiWorkType="+taxiWorkType+";taxiReason="+taxiReason+";taxiStarting="+taxiStarting+";taxiDestination="+taxiDestination);
                //赋值
                if (excepFlag == 0) {
                    if (flag == "all") {
                        //复制到全部
                        taxiDateList.each(function () {
                            if ($(this).val() == "") {
                                $(this).val(taxiDate);
                            }
                        });
                        taxiOnBroadTimeList.each(function () {
                            if ($(this).val() == "") {
                                $(this).val(taxiOnBroadTime);
                            }
                        });
                        taxiWorkTypeList.each(function () {
                            if ($(this).val() == "") {
                                $(this).val(taxiWorkType);
                            }
                        });
                        taxiReasonList.each(function () {
                            if ($(this).val() == "") {
                                $(this).val(taxiReason);
                            }
                        });
                        taxiStartingList.each(function () {
                            if ($(this).val() == "") {
                                $(this).val(taxiStarting);
                            }
                        });
                        taxiDestinationList.each(function () {
                            if ($(this).val() == "") {
                                $(this).val(taxiDestination);
                            }
                        });
                        $.msg.alert(jsondata.expense_tooltip51); //"已复制到全部");
                    } else if (flag == "nextRow") {
                        //复制到下一行
                        var rows = $("#tableFETaxiDetailinfo").cmsBootstrapEditTable(
                            "getTotalNumber"
                        ); //总行数
                        var selectRow_num = parseInt(selectRow_index) + parseInt(2); //选择行的行数
                        //alert("总行数 rows="+rows+";选择行数 selectRow_num="+selectRow_num);
                        if (selectRow_num == rows) {
                            //是否为最后一行
                            $.msg.alert(jsondata.expense_tooltip52); //"选择\"复制到下一行\"为最后一行，不能复制，请重新选择！");
                            return false;
                        } else {
                            var nextRow_index = parseInt(selectRow_index) + parseInt(1); //下一行索引
                            //alert("下一行索引 nextRow_index="+nextRow_index)
                            taxiDateList.each(function (index) {
                                if (index == nextRow_index) {
                                    if ($(this).val() == "") {
                                        $(this).val(taxiDate);
                                    }
                                }
                            });
                            taxiOnBroadTimeList.each(function (index) {
                                if (index == nextRow_index) {
                                    if ($(this).val() == "") {
                                        $(this).val(taxiOnBroadTime);
                                    }
                                }
                            });
                            taxiWorkTypeList.each(function (index) {
                                if (index == nextRow_index) {
                                    if ($(this).val() == "") {
                                        $(this).val(taxiWorkType);
                                    }
                                }
                            });
                            taxiReasonList.each(function (index) {
                                if (index == nextRow_index) {
                                    if ($(this).val() == "") {
                                        $(this).val(taxiReason);
                                    }
                                }
                            });
                            taxiStartingList.each(function (index) {
                                if (index == nextRow_index) {
                                    if ($(this).val() == "") {
                                        $(this).val(taxiStarting);
                                    }
                                }
                            });
                            taxiDestinationList.each(function (index) {
                                if (index == nextRow_index) {
                                    if ($(this).val() == "") {
                                        $(this).val(taxiDestination);
                                    }
                                }
                            });
                        }
                    } else {
                    }
                }
            };
            window.copyToOther = copyToOther;
        }
    };

    $(function () {
        $('body').append('<div id="jqloading" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.5);z-index: 9999;display: none;color: #fff;text-align:center;line-height: 100vh;">统计数据加载中...</div>');
        const isDetail = document.querySelector("#expenseHeadTable");
        if (!isDetail) {
            const container = document.querySelector(".form-query-btn");
            // 添加按钮
            const btn = document.createElement("button");
            btn.id = "btn1";
            btn.innerText = "统计报销";
            btn.className = "btn btn-primary";
            btn.onclick = btn1OnClick;
            container.append(btn);
            // 添加月份选择框
            const select = document.createElement("select");
            select.id = "_query_month";
            select.style.width = "200px";
            select.style.border = "1px solid #ccc";
            select.style.color = "#555555";
            for (let i = 0; i < 6; i++) {
                const month = moment().add(-i, "month").format("YYYY-MM");
                select.append(new Option(month, month));
            }
            container.append(select);
        } else {
            findDateTabele();
        }
    });
})();