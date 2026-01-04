// ==UserScript==
// @name         邦达新HR系统
// @namespace    http://tampermonkey.net/
// @version      1.0.19
// @description  增强日历，首页直接显示打卡日历信息，有问题请反馈javaniubility@163.com
// @author       GodLin
// @match        *im.bondex.com.cn:8092/*
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://cdn.staticfile.org/bootstrap/5.2.3/js/bootstrap.min.js
// @require      https://cdn.staticfile.org/jquery-contextmenu/2.9.2/jquery.contextMenu.min.js
// @require      https://cdn.staticfile.org/jquery-contextmenu/2.9.2/jquery.ui.position.min.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447444/%E9%82%A6%E8%BE%BE%E6%96%B0HR%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/447444/%E9%82%A6%E8%BE%BE%E6%96%B0HR%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==
;(function () {
    'use strict'
    // config
    // 企业微信cookie
    let qiYeWeiXinCookie = 'wedoc_skey=13102702875377263&d39a099434d1b1b98161b27b10e9810b;' +
        'wedoc_ticket=13102702875377263&CAESIPaQ-cBrBTlR0u9KutCyJS8__FgY0c5DLdPVHec8rt8R;'
    // 企业微信的sid
    let qiYeWeiXinSid = '1m9NUIz_djkue2ZaAL5mSAAA'

    // 添加css
    let cssHtml = `
    <link rel="stylesheet" href="http://i.bondex.com.cn/Content/css/bootstrap.css">
    <link rel="stylesheet" href="https://cdn.staticfile.org/bootstrap/5.2.3/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.staticfile.org/jquery-contextmenu/2.9.2/jquery.contextMenu.min.css">
    <style>
        #index{background-color:#fff;}
        .table-bordered, .table-bordered>tbody>tr>td, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>td, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>thead>tr>th{border-color:#ccc;}
        .table>tbody>tr>td{padding: 5px;}
        .table>tbody>tr>td>p{line-height:90%;}
    </style>`
    $('head').append(cssHtml)

    // 基础信息
    // 基础加班费 12元/h
    let baseOvertimeMoneys = 12
    // 基础可用迟到时长 30分钟
    let baseLate = 30
    // 基础迟到扣钱，迟到1分钟5块钱
    let baseDeductLate = 5
    // 基础未打卡，扣50
    let baseDeductNotLock = 50
    // 基础下班加班开始时间，下班时间往后偏移30分钟
    let baseOvertimeOffset = 30
    let overtimeAudit = true
    // base
    let weekDay = [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
    ]
    let today = new Date()
    let todayStr =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1 < 10
            ? '0' + (today.getMonth() + 1)
            : today.getMonth() + 1) +
        '-' +
        (today.getDate() < 10 ? '0' + today.getDate() : today.getDate())
    // 请假方式
    let baseLeaveWay = {
        allDay: {
            code: '1',
            name: '整天',
        },
        upDay: {
            code: '2',
            name: '上半天',
        },
        downDay: {
            code: '3',
            name: '下半天',
        },
        consecutiveDay: {
            code: '6',
            name: '连续整天',
        },
    }

    /**
     * 等元素出现后操作
     * @param {*} selector 选择器，$()括号里面的
     * @param {*} func     元素出现后执行的方法
     * @param {*} times    循环次数
     * @param {*} interval 循环间隔
     * @returns
     */
    function wait(selector, func, times, interval) {
        let _times = times || -1, //100次
            _interval = interval || 20, //20毫秒每次
            _self = $(selector),
            _selector = selector, //选择器
            _iIntervalID //定时器id
        if (_self.length) {
            //如果已经获取到了，就直接执行函数
            func && func.call(_self)
        } else {
            _iIntervalID = setInterval(function () {
                if (!_times) {
                    //是0就退出
                    clearInterval(_iIntervalID)
                }
                _times <= 0 || _times-- //如果是正数就 --
                _self = $(_selector) //再次选择
                if (_self.length) {
                    //判断是否取到
                    func && func.call(_self)
                    clearInterval(_iIntervalID)
                }
            }, _interval)
        }
        return _self
    }

    /**
     * 将时间偏移
     * @param date 时间
     * @param minutes 需要推迟或提前的分钟数
     */
    function offsetDate(date, minutes) {
        let newDate = new Date(date.valueOf());
        newDate.setMinutes(newDate.getMinutes() + 30);
        return newDate;
    }

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    Date.prototype.Format = function (fmt) {
        let o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    /**
     * 获取日期范围内的每天
     * 返回 yyyy-MM-dd 数组
     * @param {*} start yyyy-MM-dd hh:mm:ss
     * @param {*} end   yyyy-MM-dd hh:mm:ss
     * @returns
     */
    function dealDate(start, end) {
        let dateList = []
        let startTime = new Date(start)
        let endTime = new Date(end)

        while (endTime.getTime() - startTime.getTime() >= 0) {
            let year = startTime.getFullYear()
            let month =
                startTime.getMonth() + 1 < 10
                    ? '0' + (startTime.getMonth() + 1)
                    : startTime.getMonth() + 1
            let day =
                startTime.getDate().toString().length == 1
                    ? '0' + startTime.getDate()
                    : startTime.getDate()
            dateList.push(year + '-' + month + '-' + day)
            startTime.setDate(startTime.getDate() + 1)
        }
        return dateList
    }

    /**
     * sleep 休眠
     */
    let Sleep = {
        setId_xml: async function (objs) {
            while (true) {
                await this.sleep(10)
                if (objs.loadingNum == 0) {
                    break
                }
            }
        },
        sleep: function (ms) {
            return new Promise((resolve) => setTimeout(resolve, ms))
        },
    }

    /**
     * 页面加载完执行
     */
    $(function () {
        // 判断如果是 邦达首页则跳过
        if (window.location.href.indexOf('i.bondex.com.cn') != -1) {
            return
        }
        // 获取企业微信文档
        qiYeWeiXinDoc()
        // 获取日历
        loadThreeMonthsCalendarData()
        // 获取审批
        getApprove()
        // 获取工期
        getWorkCycle()
        // 加班单模态框初始化
        initOvertimeModal()
        // 顶部菜单初始化
        initTopMenuBtn()
        // 获取用户信息
        getUserInfo()
        // 加班日历元素加载
        calendarLoad(calendarIndex, () => {
            wait('.topRouterWrapper li[title=单据申请]', () => {
                // 等待菜单加载完成，可能是首页
                if ($('.topRouterWrapper li').first().hasClass('active')) {
                    // 首页才进行渲染
                    // 隐藏快捷方式
                    wait(
                        '.el-carousel__indicators',
                        function () {
                            $('.el-carousel__indicators').hide()
                        },
                        100,
                        100
                    )
                    wait(
                        '.customHomePageBox',
                        function () {
                            $(".customHomePageBox[id!='calendarBox']").hide()
                            // 重新渲染
                            renderCalendarHtml()
                        },
                        100,
                        100
                    )
                }
            })
        })
        // 获取castoken
        getCasToken()
        // 初始化右键菜单
        bindRightClickMenu()
    })

    /**
     * 加载顶部切换按钮
     */
    function initTopMenuBtn() {
        // 上方菜单追加元素
        $('.topRouterWrapper').append(
            "<li title='打卡日历' class='ellipsis' id='jiabanrili'>打卡日历</li><li title='快捷入口' class='ellipsis' id='kuaiJieRuKou'>快捷入口</li>"
        )
        // 加载点击事件
        wait('.topRouterWrapper li[title=单据申请]', () => {
            $('.topRouterWrapper')
                .find('*')
                .on('click', function () {
                    $(this).parent().find('*').removeClass('active')
                    $(this).addClass('active')
                })
        })
        // 显示快捷入口按钮
        wait('#kuaiJieRuKou', function () {
            $('#kuaiJieRuKou').click(function () {
                // 判断是否是在首页
                let homePage = $('.topRouterWrapper li').first()
                if (!homePage.hasClass('active')) {
                    // 不是在首页，则点击首页按钮
                    homePage.click()
                }
                // 判断是否存在empCard左侧信息，没有的话说明是第一次进，不需要处理，如果不是第一次，需要隐藏和显示
                let empCard = $('#empCard')
                if (empCard.length != 0) {
                    $('#calendarBox').hide()
                    $(".customHomePageBox[id!='calendarBox']").show()
                    $('.el-carousel__indicators').show()
                }
            })
        })
        // 显示日历按钮
        wait('#jiabanrili', () => {
            $('#jiabanrili').click(function () {
                // 显示日历
                // 判断是否是在首页
                let homePage = $('.topRouterWrapper li').first()
                if (!homePage.hasClass('active')) {
                    // 不是在首页，则点击首页按钮
                    homePage.click()
                }
                // 判断是否存在empCard左侧信息，没有的话说明是第一次进，需要延迟加载
                let empCard = $('#empCard')
                // 判断是否存在calendarBox，存在则直接显示 不存在则从calendarBoxHtml中获取渲染
                if (empCard.length != 0) {
                    let calendarBox = $('#calendarBox')
                    if (calendarBox.length == 0) {
                        wait(
                            '#calendarBoxHtml',
                            () => {
                                // 隐藏蓝点
                                $('.el-carousel__indicators').hide()
                                // 隐藏快捷方式
                                $(".customHomePageBox[id!='calendarBox']").hide()
                                // 重新渲染
                                renderCalendarHtml()
                            },
                            100,
                            100
                        )
                    } else {
                        // 隐藏蓝点
                        $('.el-carousel__indicators').hide()
                        // 隐藏快捷方式
                        $(".customHomePageBox[id!='calendarBox']").hide()
                        calendarBox.show()
                    }
                } else {
                    // 如果是第一次进
                    wait(".customHomePageBox[id!='calendarBox']", () => {
                        // 隐藏蓝点
                        $('.el-carousel__indicators').hide()
                        // 隐藏快捷方式
                        $(".customHomePageBox[id!='calendarBox']").hide()
                        wait(
                            '#calendarBoxHtml',
                            () => {
                                // 重新渲染
                                renderCalendarHtml()
                            },
                            100,
                            100
                        )
                    })
                }
            })
        })
    }

    // 加班日历元素加载
    // index =0 本月 只能获取到 上月 上上月 不能小于-2
    let calendarIndex = 0
    // 日历表的html
    let calendarHtml = ''

    /**
     * 重新日历赋按钮予点击事件
     */
    function calendarEvent() {
        // 上月按钮点击事件
        wait('#calendarPrevious', () => {
            $('#calendarPrevious').click(() => {
                calendarIndex -= 1
                // 重新加载html
                calendarLoad(calendarIndex, () => {
                    renderCalendarHtml()
                })
                // 如果=-2 禁用按钮
                if (calendarIndex == -1) {
                    $('#calendarPrevious').attr('disabled', true)
                    $('#calendarPrevious').html('无')
                }
            })
        })
        // 本月
        wait('#calendarNow', () => {
            $('#calendarNow').click(() => {
                calendarIndex = 0
                // 重新加载html
                calendarLoad(calendarIndex, () => {
                    renderCalendarHtml()
                })
                // 取消禁用
                $('#calendarPrevious').attr('disabled', false)
                $('#calendarPrevious').html('上月')
            })
        })
    }

    let renderingCalendar = false

    /**
     * 渲染日历html 单位时间只能执行一次
     */
    function renderCalendarHtml() {
        if (!renderingCalendar) {
            renderingCalendar = true
            $('#calendarBox').remove()
            $(".customHomePageBox[id!='calendarBox']")
                .parent()
                .append($('#calendarBoxHtml').html())
            // 加载日历事件
            calendarEvent()
            // 绑定日历调取单据申请
            // bindDocumentApplication()
            renderingCalendar = false
        }
    }

    /**
     * 绑定日历调取单据申请
     */
    function bindDocumentApplication() {
        // 加班单
        $('.openOvertime').css("cursor", "pointer").click(function () {
            // 获取日期
            let that = $(this).closest('td')
            let date = that.data("date")
            let baseSignOut = that.data("base-sign-out")
            let signOut = that.data("sign-out")
            if (date && baseSignOut && signOut) {
                // 加载数据
                baseSignOut = baseSignOut.substring(0, 5)
                signOut = signOut.substring(0, 5)
                // 审核版
                openSimpleOvertimeSlip(date, baseSignOut, signOut, true)
                // 打开模态框
                $('#overtimeModalDateInfo').html(`<span class="label label-primary">加班日期: ${date} &nbsp; 开始时间: ${baseSignOut} &nbsp; 结束时间: ${signOut} </span>`)
                $('#overtimeModalReason').val('')
                $('#overtimeModal').modal('show')
            }
        })
        // 补卡单
        $('.openSignIn').css("cursor", "pointer").click(function () {
            // 打开补卡单页面
            $('#flowCard :contains(签卡单)').click()
        })

    }

    /**
     * 时间戳 构建时间对象
     * @param {*} ticks 时间戳
     * @returns
     */

    function calcTime(ticks) {
        let leftSecond = parseInt(ticks / 1000)
        let day = Math.floor(leftSecond / (60 * 60 * 24))
        let hour = Math.floor((leftSecond - day * 24 * 60 * 60) / 3600)
        let minute = Math.floor(
            (leftSecond - day * 24 * 60 * 60 - hour * 3600) / 60
        )
        let second = Math.floor(
            leftSecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60
        )
        return {day: day, hour: hour, minute: minute, second: second}
    }

    /**
     * 获取当前月的前 up 月的日期
     * 比如 202206上1个月日期为 202205，需要传入负数-1
     * @param {*} up
     * @returns
     */
    function getUpDate(up) {
        // 如果大于0或者没传 默认给0
        if (!!!up || up > 0) {
            up = 0
        }
        // 当前年月
        let year = today.getFullYear()
        // 经过计算后的月数
        let month = today.getMonth() + 1 + up
        if (up == 0) {
            return {year: year + '', month: month < 10 ? ('0' + month) : ('' + month)}
        }
        // 取余 取商
        let upMonth = parseInt(month % 12)
        let upYear = parseInt(month / 12)
        if (upMonth < 1) {
            upMonth = 12 + upMonth
            year = year - 1 - upYear
        }
        if (upMonth < 10) {
            upMonth = '0' + upMonth
        }
        return {year: year + '', month: upMonth + ''}
    }

    /**
     * 判断日期字符串或者date是否在范围内
     * start <= date <= end
     * @param {*} start
     * @param {*} end
     * @param {*} date
     * @returns
     */
    function dateInScope(start, end, date) {
        let _start = 0
        if (typeof start == 'string') {
            if (start.indexOf(':') == -1) {
                start = start + ' 00:00:00'
            }
            _start = new Date(start).getTime()
        } else {
            _start = _start.getTime()
        }
        let _end = 0
        if (typeof end == 'string') {
            if (end.indexOf(':') == -1) {
                end = end + ' 00:00:00'
            }
            _end = new Date(end).getTime()
        } else {
            _end = end.getTime()
        }
        let _date = 0
        if (typeof date == 'string') {
            if (date.indexOf(':') == -1) {
                date = date + ' 00:00:00'
            }
            _date = new Date(date).getTime()
        } else {
            _date = date.getTime()
        }
        return _date >= _start && _date <= _end
    }

    /**
     * 处理日历的html
     * @param {*} param
     */
    function calendarHandleHtml(param) {
        // 参数
        let index = param.index,
            data = param.data,
            func = param.func,
            startDate = param.startDate,
            endDate = param.endDate
        // 本账期
        let paymentDays = {
            remainLate: baseLate, // 可用迟到数量
            deductMoneys: 0, // 扣钱 （包括未打卡扣50，迟到1分钟5块钱）
            lateMinutes: 0, // 迟到分钟数
            overtimeHour: 0.0, // 有效加班小时
            overtimeTotalMinutes: 0, // 总加班分钟
            notPassDays: false, // 审批为通过
        }
        // 下一账期（本月最后几天）
        let lastPaymentDays = {
            flag: false, // 是否到了下一账期
            remainLate: baseLate, // 可用迟到数量
            deductMoneys: 0, // 扣钱 （包括未打卡扣50，迟到1分钟5块钱）
            lateMinutes: 0, // 迟到分钟数
            overtimeHour: 0.0, // 有效加班小时
            overtimeTotalMinutes: 0, // 总加班分钟
            notPassDays: false, // 审批为通过
        }
        // 顶层总览按钮
        // 获取前 up 月的日期
        let upDate = getUpDate(index)
        // 账期汇总 + 表格table插槽
        calendarHtml =
            `
            <div id="btn-group" class="row" style="padding-top:10px;">
                <div class="col-xs-12 text-center">
                    <div class="btn-group" role="group" aria-label="按钮组">
                        <button type="button" class="btn btn-primary btn-sm" id="calendarPrevious" >上月</button>
                        <button type="button" class="btn btn-primary btn-sm">${upDate.year} - ${upDate.month}</button>
                        <button type="button" class="btn btn-primary btn-sm" id="calendarNow">本月</button>
                    </div>
                </div>
                <div class="col-xs-12">
                    <span class="label label-primary">操作提示：右键日历日期有菜单！</span>&nbsp;
                    <span class="label label-danger">加班单只能申请 7天 内的，注意时间</span>
                </div>
                <div class="col-xs-12">#{paymentDaysSummary}</div>
                <div class="col-xs-12">#{lastPaymentDaysSummary}</div>
            </div>
            <div>#{calendarTable}</div>
            `
        // 拼接日历的html
        let calendarTableHtml =
            `
                <table class="table table-bordered">
                    <thead>
                        <tr>
                `
        // 渲染 周标体
        $.each(weekDay, function (i, v) {
            if (i === 0 || i === 6) {
                calendarTableHtml +=
                    `
                    <th class="col-xs-1 text-center" style="color:#fff;background-color:#f39c12;">
                        <span class="label"> ${v} </span>
                    </th>`
            } else {
                calendarTableHtml +=
                    `
                    <th class="col-xs-2 text-center" style="color:#fff;background-color:#777;">
                        <span class="label label-default" style="color:#fff;background-color:#777;">${v}</span>
                    </th>
                    `
            }
        })
        calendarTableHtml +=
            `
                        </tr>
                    </thead>
            `
        // 获取准备好的审批数据
        let askOff = approve.askOff
        let signIn = approve.signIn
        // 日历的开始
        calendarTableHtml += '<tbody>'
        // 日历处理数据
        $.each(data, function (i, v) {
            // 判断是否有签卡单，如果有，优先签卡单覆盖上下班时间
            if (signIn.up[v.Date_Sign]) {
                v.Time_SignIn = signIn.up[v.Date_Sign]
            }
            if (signIn.down[v.Date_Sign]) {
                v.Time_SignOut = signIn.down[v.Date_Sign]
            }
            //上午打卡时间
            let dateSignIn = new Date(v.Date_Sign + ' ' + v.Time_SignIn)
            //下午打卡时间
            let dateSignOut = new Date(v.Date_Sign + ' ' + v.Time_SignOut)
            // 上下班时间点数据
            //上午上班时间 08:30
            let dateBaseSignIn = new Date(v.Date_Sign + ' ' + userInfo.BaseSignIn)
            //下午下班时间 17:30
            let dateBaseSignOut = new Date(v.Date_Sign + ' ' + userInfo.BaseSignOut)
            //中午下班时间 12:00
            let RelaxStartTime = new Date(v.Date_Sign + ' ' + v.RelaxStartTime)
            //下午上班时间 13:30
            let RelaxEndTime = new Date(v.Date_Sign + ' ' + v.RelaxEndTime)
            // 下班开始计算加班的时间
            let overtimeStartTime = offsetDate(dateBaseSignOut, baseOvertimeOffset);
            // 账期
            let currentDays = {}
            if (dateInScope(startDate, endDate, v.Date_Sign)) {
                currentDays = paymentDays
            } else {
                currentDays = lastPaymentDays
                currentDays.flag = true
            }
            // 获取星期几
            let day = new Date(v.Date_Sign)
            let week = weekDay[day.getDay()]
            // 是否是工作日 true
            //  IsHoliday有点问题，调休和放假都算节假日
            // let isWorking  = (day.getDay() != 0 && day.getDay() != 6) && v.IsHoliday == false;
            // 存在上班时间、IsHoliday、info里面有上班字眼
            let isWorking = false
            let holidayInfo = v.HolidayInfo
            if (v.IsHoliday) {
                // true 可能是调休上班 也可能是调休休假，只能通过判断HolidayInfo
                isWorking = holidayInfo ? holidayInfo.indexOf('上班') != -1 : false
            } else if (holiday[v.Date_Sign]) {
                // 里面有法定节假日和周末
                isWorking = false
                holidayInfo = holiday[v.Date_Sign];
            } else {
                // 打卡日历和假期日历都是false
                // false代表不是假期,不是假期直接判断有没有上班时间即可
                isWorking = !!v.BaseSignIn
            }

            // 第一天 给个 <tr> 开始
            if (day.getDay() === 0) {
                calendarTableHtml += '<tr>'
            }

            if (i === 0) {
                for (let j = 0; j < day.getDay() - i; j++) {
                    if (j == 0 || j == 6) {
                        calendarTableHtml += '<td class="col-xs-1"></td>'
                    } else {
                        calendarTableHtml += '<td class="col-xs-2"></td>'
                    }
                }
            }
            // 日期
            calendarTableHtml +=
                '<td class="col-xs-' +
                (day.getDay() === 0 || day.getDay() === 6 ? '1' : '2') + '"' +
                ' data-date="' + v.Date_Sign + '"' +
                ' data-base-sign-out="' + v.BaseSignOut + '"' +
                ' data-sign-out="' + v.Time_SignOut + '"' +
                '><p><span class="badge ' +
                (day.getDay() === 0 || day.getDay() === 6 ? 'bg-yellow' : '') +
                '">' +
                day.getDate() +
                '</span></p>'
            if (todayStr == v.Date_Sign) {
                // 判断如果是当天则不算
                calendarTableHtml += '<p><span class="label label-default">今天不算</span></p>'
            } else {
                // 已通过加班时间
                let approveOvertime = approve.overtime[v.Date_Sign]
                // 已申请申请的加班时间
                let applyOvertime = approve.applyOvertime[v.Date_Sign]
                if (isWorking) {
                    // 工作日
                    // 上午
                    let upAskOff = askOff.up[v.Date_Sign]
                    // 未打卡 (上午打卡时间 > 中午下班时间 || 上午未打卡 )
                    if (dateSignIn > RelaxStartTime || v.Time_SignIn == '') {
                        if (upAskOff || v.ApproveInfo.indexOf('已通过') != -1) {
                            calendarTableHtml += `<p><span class="label label-default">上午 ${upAskOff} 已通过</span></p>`
                        } else {
                            // 审批未通过 扣50
                            currentDays.deductMoneys -= baseDeductNotLock
                            calendarTableHtml += `<p class="openSignIn"><span class="label label-danger">上班未打卡 ￥${baseDeductNotLock}</span></p>`
                            // 未通过标记
                            currentDays.notPassDays = true
                        }
                    }
                    //上班迟到 (上午打卡时间 > 上午上班时间)
                    else if (dateSignIn > dateBaseSignIn) {
                        if (upAskOff || v.ApproveInfo.indexOf('已通过') != -1) {
                            // 迟到了，但是提交了审批
                            calendarTableHtml +=
                                `
                                <p class="text-warning"><span class="label label-danger">${v.Time_SignIn}</span></p>
                                <p><span class="label label-default">上午 ${upAskOff} 已通过</span></p>
                                `
                        } else {
                            //迟到了
                            let timer = calcTime(dateSignIn - dateBaseSignIn)
                            // 迟到分钟数 秒不算
                            let loseMinute = (timer.hour + timer.day * 24) * 60 + timer.minute
                            if (loseMinute > 0) {
                                // 总迟到分钟数
                                currentDays.lateMinutes += loseMinute
                                // 今天扣钱
                                let deductMoney = 0
                                if (currentDays.remainLate > 0) {
                                    // 可能可以抵扣
                                    if (currentDays.remainLate < loseMinute) {
                                        // 如果迟到分钟大于剩余可用迟到分钟，真迟到了
                                        // 真实应该扣钱的迟到分钟
                                        let realLoseMinute = loseMinute - currentDays.remainLate
                                        // 迟到扣钱
                                        deductMoney = realLoseMinute * baseDeductLate
                                    }
                                } else {
                                    // 别想了，肯定扣钱
                                    deductMoney = loseMinute * baseDeductLate
                                }
                                // 总扣钱
                                currentDays.deductMoneys += deductMoney
                                calendarTableHtml +=
                                    `
                                    <p class="text-warning openSignIn">
                                        <span class="label label-danger">${v.Time_SignIn}</span>
                                        <span class="label label-danger">${loseMinute} min</span>
                                        ${(currentDays.deductMoneys ? '&nbsp;<span class="label label-danger">￥' + deductMoney + '</span>' : '')}
                                    </p>
                                    `
                                // 剩余可用迟到分钟
                                currentDays.remainLate -= loseMinute
                            } else {
                                //一分钟内不算
                                calendarTableHtml += `<p><span class="label label-default" style="color:#fff;background-color:#777;">${v.Time_SignIn}</span></p>`
                            }
                        }
                    } else {
                        // 没迟到
                        calendarTableHtml += `<p><span class="label label-default" style="color:#fff;background-color:#777;"> ${v.Time_SignIn}</span></p>`
                    }

                    // 下午
                    let downAskOff = askOff.down[v.Date_Sign]
                    // 下班未打卡
                    if (dateSignOut < dateBaseSignOut || v.Time_SignOut == '') {
                        if (downAskOff || v.ApproveInfo.indexOf('已通过') != -1) {
                            calendarTableHtml += `<p><span class="label label-default">下午 ${downAskOff} 已通过</span></p>`
                        } else {
                            //未通过 扣50
                            currentDays.deductMoneys -= baseDeductNotLock
                            calendarTableHtml += `<p class="openSignIn"><span class="label label-danger">下班未打卡 ￥${baseDeductNotLock}</span></p>`
                            // 未通过标记
                            currentDays.notPassDays = true
                        }
                    }
                    //下班打卡
                    else if (dateSignOut > dateBaseSignOut) {
                        // 加班时间
                        let dayOvertime = calcTime(dateSignOut - dateBaseSignOut)
                        // 今日加班分钟
                        let dayOvertimeMinute =
                            (dayOvertime.hour + dayOvertime.day * 24) * 60 + dayOvertime.minute
                        let effectiveOvertimeHour = 0;
                        let actualOvertimeMoney = 0;
                        if (overtimeStartTime > dateBaseSignOut) {
                            // 实际有效加班时间
                            let actualOvertime = calcTime(dateSignOut - overtimeStartTime)
                            // 有效小时数
                            let effectiveOvertimeMinute =
                                (actualOvertime.hour + actualOvertime.day * 24) * 60 + actualOvertime.minute
                            effectiveOvertimeHour = (effectiveOvertimeMinute - (effectiveOvertimeMinute % 30)) / 60
                            // 有效加班费
                            actualOvertimeMoney = effectiveOvertimeHour * baseOvertimeMoneys
                        }

                        // 总加班时长
                        currentDays.overtimeTotalMinutes += dayOvertimeMinute
                        // 有效加班小时
                        currentDays.overtimeHour += effectiveOvertimeHour
                        if (actualOvertimeMoney > 0) {
                            calendarTableHtml +=
                                `
                                <p class="text-info">
                                    <span class="label label-primary">${(v.Time_SignOut === v.Time_SignIn ? '' : v.Time_SignOut)}</span>
                                </p>
                                <p ${approveOvertime ? '' : 'class="openOvertime"'}>
                                    <span class="label label-primary">${dayOvertimeMinute}min</span>
                                    <span class="label label-primary">有效加班￥${actualOvertimeMoney}</span>
                                    ${approveOvertime ? '<span class="label label-primary applicationFinish">已审过</span>' : ''}
                                    ${applyOvertime ? '<span class="label label-warning applicationFinish">已申请</span>' : ''}
                                </p>
                                `
                        } else {
                            calendarTableHtml +=
                                `
                                <p class="text-info">
                                    <span class="label label-default" style="color:#fff;background-color:#777;">${v.Time_SignOut === v.Time_SignIn ? '' : v.Time_SignOut}</span>
                                </p>
                                <p>
                                    <span class="label label-default" style="color:#fff;background-color:#777;">${dayOvertimeMinute}min</span>
                                </p>
                                `
                        }
                    } else {
                        if (downAskOff || v.ApproveInfo.indexOf('已通过') != -1) {
                            calendarTableHtml +=
                                `
                                <p>
                                    <span class="label label-default" style="color:#fff;background-color:#777;">
                                    ${v.Time_SignOut === v.Time_SignIn ? '' : v.Time_SignOut}
                                    </span>
                                </p>
                                `
                        } else {
                            //早退了
                            let timer = calcTime(dateBaseSignOut - dateSignOut)
                            let leaveEarlyMinute =
                                (timer.hour + timer.day * 24) * 60 + timer.minute
                            if (!!!leaveEarlyMinute) {
                                // 早退不到1分钟，也算1分钟
                                leaveEarlyMinute = 1
                            }
                            currentDays.deductMoneys -= leaveEarlyMinute * baseDeductLate
                            calendarTableHtml +=
                                `
                                <p class="openSignIn">
                                    <span class="label label-default" style="color:#fff;background-color:#777;">
                                    ${v.Time_SignOut === v.Time_SignIn ? '' : v.Time_SignOut}
                                    </span>
                                    <span class="label label-danger">早退￥${leaveEarlyMinute * baseDeductLate}</span>
                                </p>
                                `
                            // 未通过标记
                            currentDays.notPassDays = true
                        }
                    }
                } else {
                    // 休息日
                    if (!!v.Time_SignIn) {
                        // 休息日有打卡
                        // 上班时间
                        calendarTableHtml += `<p><span class="label label-default" style="color:#fff;background-color:#777;">${v.Time_SignIn}</span></p>`
                        if (!!!v.Time_SignOut) {
                            // 只有上班没有下班
                            calendarTableHtml += '<p class="text-info"><span class="label label-primary">下班未打卡，好家伙钱都不要了！</span></p>'
                        } else {
                            // 申请加班了
                            if (approveOvertime) {
                                // 审批通过
                                // 取加班单与打卡时间交集最小值
                                let approveOvertimeBegin = new Date(
                                    v.Date_Sign + ' ' + approveOvertime.begin
                                )
                                let approveOvertimeEnd = new Date(
                                    v.Date_Sign + ' ' + approveOvertime.end
                                )
                                let timerLong = 0
                                //上午打卡时间
                                if (
                                    dateSignOut <= approveOvertimeBegin ||
                                    approveOvertimeEnd <= dateSignIn
                                ) {
                                    timerLong = 0
                                } else {
                                    let overtimeArray = [
                                        dateSignIn,
                                        dateSignOut,
                                        approveOvertimeBegin,
                                        approveOvertimeEnd,
                                    ]
                                    // 正序
                                    overtimeArray.sort(function (a, b) {
                                        return a > b ? 1 : -1
                                    })
                                    timerLong = overtimeArray[2] - overtimeArray[1]
                                }
                                // 加班了
                                let timer = calcTime(timerLong)
                                // 今日加班分钟
                                let overtimeMinute =
                                    (timer.hour + timer.day * 24) * 60 + timer.minute
                                // 有效小时数
                                let overtimeHour = (overtimeMinute - (overtimeMinute % 30)) / 60
                                // 有效加班费
                                let overtimeMoney = overtimeHour * baseOvertimeMoneys

                                currentDays.overtimeTotalMinutes += overtimeMinute
                                currentDays.overtimeHour += overtimeHour

                                if (overtimeMinute > 0) {
                                    calendarTableHtml +=
                                        `
                                        <p class="text-info">
                                            <span class="label label-primary">
                                            ${v.Time_SignOut === v.Time_SignIn ? '' : v.Time_SignOut}
                                            </span>
                                        </p>
                                        <p>
                                            <span class="label label-primary">${overtimeMinute} min</span>
                                            <span class="label label-primary">￥${overtimeMoney}</span>
                                        </p>
                                        `
                                } else {
                                    calendarTableHtml +=
                                        `
                                        <p class="text-info">
                                            <span class="label label-default" style="color:#fff;background-color:#777;">
                                            ${v.Time_SignOut === v.Time_SignIn ? '' : v.Time_SignOut}
                                            </span>
                                        </p>
                                        <p>
                                            <span class="label label-default" style="color:#fff;background-color:#777;">
                                            ${overtimeMinute}min
                                            </span>
                                        </p>
                                        <p class="text-info"><span class="label label-primary">加班了，但是没申请通过！</span></p>
                                        `
                                }
                            } else {
                                // 没审批通过
                                // 加班了
                                let timer = calcTime(dateSignOut - dateSignIn)
                                // 今日加班分钟
                                let overtimeMinute =
                                    (timer.hour + timer.day * 24) * 60 + timer.minute
                                currentDays.overtimeTotalMinutes += overtimeMinute
                                calendarTableHtml +=
                                    `
                                    <p class="text-info">
                                        <span class="label label-default" style="color:#fff;background-color:#777;">
                                        ${v.Time_SignOut === v.Time_SignIn ? '' : v.Time_SignOut}
                                        </span>
                                    </p>
                                    <p>
                                        <span class="label label-default" style="color:#fff;background-color:#777;">
                                        ${overtimeMinute} min
                                        </span>
                                    </p>
                                    <p class="text-info"><span class="label label-primary">加班了，但是没申请通过！</span></p>
                                    `
                            }
                        }
                    } else {
                        // 调休等消息
                        calendarTableHtml += `<p class="text-info"><span class="label label-success">${holidayInfo ? holidayInfo : '加班是不可能加班的'}</span></p>`
                    }
                }
            }
            calendarTableHtml += '</td>'
            if (day.getDay() === 6) {
                calendarTableHtml += '</tr>'
            }
        })

        calendarTableHtml += '</tbody>'
        calendarTableHtml += '</table>'
        // 等快捷方式出现后，渲染页面
        // 渲染日历表
        // 替换表格
        calendarHtml = calendarHtml.replace('#{calendarTable}', calendarTableHtml)
        // 替换标题  合计,放到paymentDaysSummaryHtml下
        let paymentDaysSummaryHtml =
            `
            &nbsp;&nbsp;当前账期 <span class= "label label-primary" >${startDate.substring(0, 10)} —— ${endDate.substring(0, 10)}&nbsp;</span>
            &nbsp;共迟到：<span class="label label-warning"> ${paymentDays.lateMinutes}min</span>
            <span class="label label-danger">余额 ${paymentDays.remainLate}min</span>
            共加班：<span class="label label-primary">${paymentDays.overtimeTotalMinutes}min</span>
            有效加班：<span class="label label-primary"> ${paymentDays.overtimeHour * 60}min</span><span class="badge">${paymentDays.overtimeHour}h</span>
            扣除工资：<span class="label label-danger">￥${paymentDays.deductMoneys}</span>
            加班奖励工资：<span class="label label-primary">￥${paymentDays.overtimeHour * baseOvertimeMoneys}</span>
            ${(paymentDays.notPassDays ? '<span class="label label-danger">有没通过的的审批，要扣钱啦，快在' + endDate.substring(0, 10) + '之前提交审批</span>' : '')}
            `
        calendarHtml = calendarHtml.replace(
            '#{paymentDaysSummary}',
            paymentDaysSummaryHtml
        )
        // 判断是否到了下一账期进行处理
        let lastPaymentDaysHtml = ''
        if (lastPaymentDays.flag) {
            lastPaymentDaysHtml =
                `&nbsp;&nbsp;下月账期共迟到：<span class="label label-warning">${lastPaymentDays.lateMinutes}min</span>
                <span class="label label-danger">余额${lastPaymentDays.remainLate}min</span>
                共加班：<span class="label label-primary">${lastPaymentDays.overtimeTotalMinutes}min</span>
                有效加班：<span class="label label-primary">${lastPaymentDays.overtimeHour * 60}min</span>
                <span class="badge">${lastPaymentDays.overtimeHour}h</span>
                扣除工资：<span class="label label-danger">￥${lastPaymentDays.deductMoneys}</span>
                加班奖励工资：<span class="label label-primary">￥${lastPaymentDays.overtimeHour * baseOvertimeMoneys}</span>
                ${(lastPaymentDays.notPassDays ? '  <span class="label label-danger">有没通过的的审批，要扣钱啦，快在' + endDate.substring(0, 10) + '之前提交审批</span>' : '')}
                `
        }
        calendarHtml = calendarHtml.replace(
            '#{lastPaymentDaysSummary}',
            lastPaymentDaysHtml
        )
        // 添加日历box
        let calendarBoxHtml =
            `
            <div class = "customHomePageBox" id = "calendarBox" style = "height: 100%; flex: 75 1 0%;overflow-y: auto;overflow-x: hidden" >
                <div id = "calendarItem" style = "width:100%!important;" > ${calendarHtml} </div>
            </div>
            `
        let calendarBoxHtmlJq = $('#calendarBoxHtml')
        if (calendarBoxHtmlJq.length == 0) {
            $('body').append(`<script type = "text/html" id="calendarBoxHtml" >${calendarBoxHtml}</script>`)
        } else {
            calendarBoxHtmlJq.html(calendarBoxHtml)
        }
        // 回调函数
        func && func.call()
    }

    /**
     * 日历加载，将生成的html存入script
     * @param {*} index  本月为零，上月为-1，以此类推
     * @param {*} func  回调函数，一般为重新染显示日历
     */
    function calendarLoad(index, func) {
        wait('#workCycleJson', () => {
            // 账期数据存在后
            wait('#threeMonthsCalendarDataJson', () => {
                let currentMonth = today.getMonth() + 1
                let index2 = today.getMonth() + 1 + index;
                if (currentMonth == 1 && index == -1) {
                    // 当前月为1月份 且按了上个月
                    index2 = 12
                }
                // 获取到账期日期
                let startDate = workCycle[index2 + 'start']
                let endDate = workCycle[index2 + 'end']
                let _endDate = endDate
                // 处理数据 需要账期数据和日历数据同时存在
                if (index == 0) {
                    // 本账期，取start到今天的data    非本月账期，按照账期日期获取data
                    _endDate = today
                }
                // 处理data，只要账期内的
                let data = threeMonthsCalendarDataJson.filter((item) => {
                    return dateInScope(startDate, _endDate, item.Date_Sign)
                })
                // 准备处理日历html
                let param = {
                    startDate: startDate,
                    endDate: endDate,
                    data: data,
                    index: index,
                    func: func,
                }
                calendarHandleHtml(param)
            })
        })
    }

    let workCycle = {}

    /**
     * 获取工作周期 近2个月
     * 缓存到script中
     */
    function getWorkCycle() {
        // 删除工期json
        $('#workCycleJson').remove()
        workCycle = {}
        // 准备获取工期
        // 获取工期
        $.ajax({
            type: 'POST',
            url: '/attWorkHourMonth/listCustomSearch?tId=1543134799064313857&pageNum=1&pageSize=20',
            contentType: 'application/json',
            dataType: 'json',
            data: '{}',
            success: function (data) {
                let workList = data.rows
                if (workList.length > 0) {
                    workList.forEach((item) => {
                        let currentMonth =
                            new Date(item.attendance_month_end_date).getMonth() + 1
                        workCycle[currentMonth + 'start'] = item.attendance_month_begin_date
                        workCycle[currentMonth + 'end'] = item.attendance_month_end_date
                    })
                }
                // 获取完工期后的操作 存入到页面 json字符串
                $('body').append(`<script type = "text/html" id = "workCycleJson" >true</script>`)
            }
            ,
        })
    }

    let threeMonthsCalendarDataJson = []

    /**
     * 加载近三个月日历数据
     * 缓存到script中
     */
    function loadThreeMonthsCalendarData() {
        let threeMonthsCalendarData = {}
        // 删除日历数据json
        $('#threeMonthsCalendarDataJson').remove()
        // 访问老邦达接口，直接拉取3个月数据
        // 油猴跨域访问
        GM_xmlhttpRequest({
            method: 'post',
            url: 'http://i.bondex.com.cn/My/CheckData',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            onload: function (data) {
                // 重新登录可能会返回网页，需要捕获重新加载
                try {
                    data = JSON.parse(data.responseText)
                } catch (e) {
                    if (
                        data.responseText.indexOf('注意：请使用邦达黄页的用户名密码登录') != -1
                    ) {
                        // cookie过期，重新登录，跳转到i.bomdex，从该页面进入
                        window.location.href = 'http://i.bondex.com.cn/'
                    } else {
                        // 可能加载到页面元素，重新加载
                        loadThreeMonthsCalendarData()
                    }
                    return
                }
                threeMonthsCalendarData.current = data
            },
        })
        // 油猴跨域访问
        GM_xmlhttpRequest({
            method: 'post',
            url: 'http://i.bondex.com.cn/My/CheckData?flag=prepre',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            onload: function (data) {
                // 重新登录可能会返回网页，需要捕获重新加载
                try {
                    data = JSON.parse(data.responseText)
                } catch (e) {
                    if (
                        data.responseText.indexOf('注意：请使用邦达黄页的用户名密码登录') != -1
                    ) {
                        // cookie过期，重新登录
                        window.location.href = 'http://i.bondex.com.cn/'
                    } else {
                        // 可能加载到页面元素，重新加载
                        loadThreeMonthsCalendarData()
                    }
                    return
                }
                threeMonthsCalendarData.prepre = data
            },
        })

        // 条件成立后执行
        let _iIntervalID //定时器id
        let _times = 100
        // 定时器异步，需要函数执行
        _iIntervalID = setInterval(function () {
            if (!_times) {
                //是0就退出
                clearInterval(_iIntervalID)
            }
            _times--
            if (Object.keys(threeMonthsCalendarData).length == 2) {
                threeMonthsCalendarDataJson = threeMonthsCalendarData.prepre
                threeMonthsCalendarDataJson.push.apply(
                    threeMonthsCalendarDataJson,
                    threeMonthsCalendarData.current
                )
                // 获取完工期后的操作 存入到页面 json字符串 使用wait去监控
                $('body').append('<script type="text/html" id="threeMonthsCalendarDataJson">true</script>')
                // 清除定时任务
                clearInterval(_iIntervalID)
            }
        }, 50)
    }

    let approve = {
        askOff: {up: {}, down: {}},
        signIn: {up: {}, down: {}},
        overtime: {},
    };

    /**
     * 获取全部审批数据 请假、签到、加班
     * 缓存到script里
     */
    function getApprove() {
        // 删除工期json
        $('#approveJson').remove()
        approve = {
            askOff: {up: {}, down: {}},
            signIn: {up: {}, down: {}},
            overtime: {},
            applyOvertime: {},
        }
        let queryCount = 0
        // 请假单获取
        $.ajax({
            type: 'POST',
            url: '/attHolidayLeaveOrder/listCustomSearch?tId=1158666390359023618&pageNum=0&pageSize=70&sort=create_date%20&order=descending',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({}),
            success: function (data) {
                queryCount++
                let rows = data.rows
                if (Array.isArray(rows)) {
                    // 过滤出审批通过的
                    rows = $.grep(rows, function (n, i) {
                        return n.audit_status == '3' || n.audit_status == '5'
                    })
                    rows.forEach((item) => {
                        // leave_way 1整天 2上半天 3下半天 6连续整天
                        let leaveWay = item.leave_way
                        let leaveCategoryName = item.leave_category_name || '请假'
                        if (
                            leaveWay == baseLeaveWay.allDay.code ||
                            leaveWay == baseLeaveWay.upDay.code ||
                            leaveWay == baseLeaveWay.downDay.code
                        ) {
                            let approveDate = item.begin_date.substring(0, 10)
                            if (leaveWay == baseLeaveWay.allDay.code) {
                                // 整天
                                approve.askOff.up[approveDate] = leaveCategoryName
                                approve.askOff.down[approveDate] = leaveCategoryName
                            } else if (leaveWay == baseLeaveWay.upDay.code) {
                                // 上
                                approve.askOff.up[approveDate] = leaveCategoryName
                            } else {
                                // 下
                                approve.askOff.down[approveDate] = leaveCategoryName
                            }
                        } else if (leaveWay == baseLeaveWay.consecutiveDay.code) {
                            let approveDateArr = dealDate(item.begin_date, item.end_date)
                            approveDateArr.forEach((e) => {
                                approve.askOff.up[e] = leaveCategoryName
                                approve.askOff.down[e] = leaveCategoryName
                            })
                        } else {
                            // 补签卡，补签，直接覆盖原上下班时间
                            let signDate = item.sign_date.substring(0, 10)
                            let signTime = item.sign_time
                            // 判断上午下午
                            if ('12:30' > signTime) {
                                // 上午
                                approve.signIn.up[signDate] = signTime + ':00'
                            } else {
                                // 下午
                                approve.signIn.down[signDate] = signTime + ':00'
                            }
                        }
                    })
                }
            },
        })
        // 签卡单获取
        $.ajax({
            type: 'POST',
            url: '/attHolidayLeaveOrder/listCustomSearch?tId=1158673087379054595&pageNum=0&pageSize=70&sort=create_date%20&order=descending',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({}),
            success: function (data) {
                queryCount++
                let rows = data.rows
                if (Array.isArray(rows)) {
                    // 过滤出审批通过的
                    rows = $.grep(rows, function (n, i) {
                        return n.audit_status == '3' || n.audit_status == '5'
                    })
                    rows.forEach((item) => {
                        // 补签卡，补签，直接覆盖原上下班时间
                        let signDate = item.sign_date.substring(0, 10)
                        let signTime = item.sign_time
                        // 判断上午下午
                        if ('12:30' > signTime) {
                            // 上午
                            approve.signIn.up[signDate] = signTime + ':00'
                        } else {
                            // 下午
                            approve.signIn.down[signDate] = signTime + ':00'
                        }
                    })
                }
            },
        })
        // 加班单获取
        $.ajax({
            type: 'POST',
            url: '/attHolidayLeaveOrder/listCustomSearch?tId=1158674612583178242&pageNum=0&pageSize=70&sort=create_date%20&order=descending',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({}),
            success: function (data) {
                queryCount++
                let rows = data.rows
                if (Array.isArray(rows)) {
                    // 过滤出审批通过的加班单
                    let overtimeRows = $.grep(rows, function (n, i) {
                        return n.audit_status == '3' || n.audit_status == '5'
                    })
                    overtimeRows.forEach((item) => {
                        let attendanceDate = item.attendance_date.substring(0, 10)
                        approve.overtime[attendanceDate] = {}
                        approve.overtime[attendanceDate].begin = item.begin_time
                        approve.overtime[attendanceDate].end = item.end_time
                    })
                    // 过滤已申请的加班单
                    let applyRows = $.grep(rows, function (n, i) {
                        return n.audit_status == '1'
                    })
                    applyRows.forEach((item) => {
                        let attendanceDate = item.attendance_date.substring(0, 10)
                        approve.applyOvertime[attendanceDate] = {}
                        approve.applyOvertime[attendanceDate].begin = item.begin_time
                        approve.applyOvertime[attendanceDate].end = item.end_time
                    })
                }
            },
        })
        // 条件成立后执行
        let _iIntervalID; //定时器id
        let _times = 1000;
        // 定时器异步，需要函数执行
        _iIntervalID = setInterval(function () {
            if (!_times) {
                //是0就退出
                clearInterval(_iIntervalID)
            }
            _times--
            if (queryCount == 3) {
                // 获取审批后的操作 存入到页面 json字符串
                $('body').append('<script type="text/html" id="approveJson">true</script>')
                // 清除定时任务
                clearInterval(_iIntervalID)
            }
        }, 50)
    }


    let userInfo = {}
    let holiday = {}

    /**
     * 用户信息获取
     */
    function getUserInfo() {
        // 获取到个人数据
        $.ajax({
            type: 'GET',
            url: '/desktop/employee?isSelf=1',
            contentType: 'application/json',
            dataType: 'json',
            async: false,
            success: function (data) {
                userInfo = data.data
            },
        })
        // 上个月
        let lastMonth = getUpDate(-1)
        let param = {
            "empOriginIds": [userInfo.empOriginId],
            "yearMonthText": `${lastMonth.year} ${lastMonth.month}`
        }
        $.ajax({
            type: 'POST',
            url: '/attAttendanceRecordEmp/listEmpScheduleNew',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(param),
            success: function (data) {
                let scheduleDetailList = data.data.scheduleDetailList
                scheduleDetailList = $.grep(scheduleDetailList, function (n, i) {
                    return n.vacationSource == '9' && n.vacationCategoryName != '周末'
                })
                scheduleDetailList.forEach((item) => {
                    holiday[item.scheduleDate.substring(0, 10)] = item.vacationCategoryName
                })
            },
        })
        // 当前月
        let currentMonth = getUpDate(0)
        param.yearMonthText = `${currentMonth.year} ${currentMonth.month}`
        $.ajax({
            type: 'POST',
            url: '/attAttendanceRecordEmp/listEmpScheduleNew',
            contentType: 'application/json',
            dataType: 'json',
            async: false,
            data: JSON.stringify(param),
            success: function (data) {
                let scheduleDetailList = data.data.scheduleDetailList
                // 填充到用户信息 上下班时间
                let shiftTime = scheduleDetailList[0].shiftTime
                let shiftTimeArr = shiftTime.split('~')
                userInfo.BaseSignIn = shiftTimeArr[0]
                userInfo.BaseSignOut = shiftTimeArr[2]
                // 过滤出节假日
                scheduleDetailList = $.grep(scheduleDetailList, function (n, i) {
                    return n.vacationSource == '9' && n.vacationCategoryName != '周末'
                })
                scheduleDetailList.forEach((item) => {
                    holiday[item.scheduleDate.substring(0, 10)] = item.vacationCategoryName
                })
            },
        })
    }

    let mainForm = {}

    /**
     * 快速加班单
     * @param date 加班日期
     * @param baseSignOut 开始时间
     * @param signOut 结束时间
     */
    function openSimpleOvertimeSlip(date, baseSignOut, signOut) {
        $('#overtimeModalConfirm').attr("disabled", "true")
        $('#overtimeModalMessage').html('')
        $("#qiYeWeiXinRiBao").html('')
        mainForm = {}
        // 员工原始id
        let empOriginId = userInfo.empOriginId
        // 数据准备
        // 获取用户信息
        let queryCount = 0
        $.ajax({
            type: 'POST',
            url: `/sys/common/initFormView?formViewId=&formViewCode=att_overtime_order_emp_FormTabs&edittype=edit`,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({}),
            success: function (data) {
                mainForm = data.data.init.mainForm
                // 信息补充
                mainForm.emp_name = userInfo.name
                mainForm.emp_no = userInfo.empNo
                mainForm.emp_origin_id = userInfo.empOriginId
                queryCount++
            },
        })
        // 加班时间获取
        let overtimeHourInfo = {}
        $.ajax({
            type: 'POST',
            url: `/attOvertimeControl/getOvertimeHour?overtimeDate=${date}&startTime=${baseSignOut}&endTime=${signOut}&attendanceDate=${date}`,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify([empOriginId]),
            success: function (data) {
                overtimeHourInfo = data.data
                queryCount++
            },
        })
        // 获取班别
        let attOvertimeOrderEmp = []
        $.ajax({
            type: 'POST',
            url: `/attOvertimeOrderEmp/getShiftInfo?overtimeDate=${date}`,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify([empOriginId]),
            success: function (data) {
                if (data.success) {
                    attOvertimeOrderEmp = data.data
                }
                queryCount++
            },
        })
        // 条件成立后执行
        let _iIntervalID; //定时器id
        let _times = 1000;
        // 定时器异步，需要函数执行
        _iIntervalID = setInterval(function () {
            if (!_times) {
                //是0就退出
                clearInterval(_iIntervalID)
            }
            _times--
            if (queryCount == 3) {
                // 组装加班单数据
                mainForm.item_json = overtimeHourInfo.overtimeSplitItem[empOriginId]
                mainForm.overtime_type = overtimeHourInfo[`${empOriginId}overtimeType`]
                mainForm.overtime_hour = overtimeHourInfo[empOriginId]
                mainForm.audit_status = "5"
                mainForm.attendance_date = overtimeHourInfo[`${empOriginId}attendanceDate`]
                mainForm.overtime_date = date
                mainForm.begin_time = baseSignOut
                mainForm.end_time = signOut
                // 班别
                if (attOvertimeOrderEmp.length > 0) {
                    mainForm.shift_json = JSON.stringify(attOvertimeOrderEmp)
                    mainForm.shift_id = attOvertimeOrderEmp[0].shiftId
                }
                console.log(mainForm)
                $('#overtimeModalConfirm').removeAttr("disabled")
                // 清除定时任务
                clearInterval(_iIntervalID)
            }
        }, 50)
        // 获取日报详情
        if (qiYeWeiXinCookie && qiYeWeiXinSid && qiYeWeiXinDocInfo[date]) {
            let param = {
                "url": `https://doc.weixin.qq.com/wework/journal/getjournaldetail?sid=${qiYeWeiXinSid}`,
                "cookie": qiYeWeiXinCookie,
                "data": JSON.stringify({journaluuid: qiYeWeiXinDocInfo[date]})
            }
            // 油猴跨域访问
            GM_xmlhttpRequest({
                method: 'get',
                url: `http://haideyiyao.com/request/json?json=${encodeURIComponent(JSON.stringify(param))}`,
                onload: function (result) {
                    let entrys = JSON.parse(result.responseText).entrys
                    if (entrys && entrys.length > 0) {
                        let html = `<div>企业微信日报（可用于参考）</div>`
                        entrys.forEach((item) => {
                            html += `<div>${item.showinfo.wordings[0]}</div>`
                        })
                        html += '<br/><br/>'
                        $("#qiYeWeiXinRiBao").html(html)
                    }
                },
            })
        }
    }

    /**
     * 加班单模态框
     */
    function initOvertimeModal() {
        let modalHtml = `
        <div class="modal" tabindex="-1" id="overtimeModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">简易加班单<span class="label label-danger" id="overtimeModalTitle"></span></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                       <div id="qiYeWeiXinRiBao"></div>
                       <div class="form-group">
                          <label id="overtimeModalDateInfo"></label>
                          <textarea class="form-control" placeholder="请输入加班理由" rows="6" id="overtimeModalReason"></textarea>
                       </div>
                       <div id="overtimeModalMessage"></div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                      <button type="button" class="btn btn-primary" id="overtimeModalConfirm">确定</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" tabindex="-1" id="calendarMessageModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body" id="calendarMessage"></div>
                </div>
            </div>
        </div>
        `
        $('body').append(modalHtml)
        // 模态框确定
        $('#overtimeModalConfirm').click(function () {
            // 获取加班理由
            let reason = $('#overtimeModalReason').val()
            if (!!!reason) {
                // 不可为空
                $('#overtimeModalMessage').html('<div class="alert alert-danger">加班理由不可为空</div>')
                return
            }
            // 准备发送
            mainForm.reason = reason
            let param = {
                mainForm: [
                    mainForm
                ]
            }
            // 审核？
            let templateId = overtimeAudit ? '1627843560483418114' : '1534057413618249729'
            $.ajax({
                type: 'POST',
                url: `/attOvertimeOrderEmp/save?id=${mainForm.id}&moduleId=1120871188728291329&isnew=1&templateId=${templateId}`,
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(param),
                success: function (data) {
                    if (data.success) {
                        $('#overtimeModalMessage').html('<div class="alert alert-success">申请成功</div>')
                        $('#overtimeModalConfirm').attr("disabled", "true")
                    } else {
                        $('#overtimeModalMessage').html(`<div class="alert alert-danger">${data.message}</div>`)
                    }
                },
            })
        })
    }

    let qiYeWeiXinDocInfo = {}

    /**
     * 获取企业微信
     */
    function qiYeWeiXinDoc() {
        if (!(qiYeWeiXinSid && qiYeWeiXinCookie)) {
            // 这俩都为空则退出
            return
        }
        // 油猴跨域访问
        // 日报
        GM_xmlhttpRequest({
            method: 'post',
            url: `http://doc.weixin.qq.com/comment/list?sid=${qiYeWeiXinSid}&docid=c2_AJIA4Qe_AAsAM0AcAYiAEQvi19IzFnScj_base&func=4&limit=8`,
            cookie: qiYeWeiXinCookie,
            onload: function (data) {
                data = JSON.parse(data.responseText)
                let body = data.body
                if (body && body.message_list && body.message_list.length > 0) {
                    let docArray = body.message_list
                    docArray.forEach((item) => {
                        let docTime = new Date(parseInt(item.update_time + "000")).Format("yyyy-MM-dd");
                        let journalUuid = JSON.parse(item.content.action_params).journal_uuid
                        // 可能当天会提交多次，以防万一
                        if (qiYeWeiXinDocInfo[docTime]) {
                            qiYeWeiXinDocInfo[docTime].push(journalUuid)
                        } else {
                            qiYeWeiXinDocInfo[docTime] = [journalUuid]
                        }
                    })
                }
            },
        })
        // 油猴跨域访问
        // 周报
        GM_xmlhttpRequest({
            method: 'post',
            url: `http://doc.weixin.qq.com/comment/list?sid=${qiYeWeiXinSid}&docid=c2_AJIA4Qe_AAsAM0AcAYiAEQ8xu1HWP0TTj_base&func=4&limit=2`,
            cookie: qiYeWeiXinCookie,
            onload: function (data) {
                data = JSON.parse(data.responseText)
                let body = data.body
                if (body && body.message_list && body.message_list.length > 0) {
                    let docArray = body.message_list
                    docArray.forEach((item) => {
                        let docTime = new Date(parseInt(item.update_time + "000")).Format("yyyy-MM-dd");
                        let journalUuid = JSON.parse(item.content.action_params).journal_uuid
                        // 可能当天会提交多次，以防万一
                        if (qiYeWeiXinDocInfo[docTime]) {
                            qiYeWeiXinDocInfo[docTime].push(journalUuid)
                        } else {
                            qiYeWeiXinDocInfo[docTime] = [journalUuid]
                        }
                    })
                }
            },
        })
    }

    let casToken = ""

    /**
     * 获取当前用户的casToken
     */
    function getCasToken() {
        GM_xmlhttpRequest({
            method: 'get',
            url: 'https://wol.bondex.com.cn/casclient',
            onload: function (data) {
                let casInfoJson = $(data.responseText).eq(12).html();
                casInfoJson = casInfoJson.substring(7)
                try {
                    let casInfo = JSON.parse(casInfoJson)
                    casToken = casInfo.message[0].token
                } catch (e) {
                }
            },
        })
    }

    /**
     * 初始化绑定右键菜单
     */
    function bindRightClickMenu() {
        $.contextMenu({
            selector: '#calendarItem table tbody td[data-date]',
            items: {
                "rightClickMenuOvertimeAudit": {
                    name: "加班单",
                    callback: function (key, opt) {
                        let that = opt.$trigger
                        // 获取是否已经申请过
                        if (that.find('.applicationFinish').length > 0) {
                            $('#calendarMessage').html('已申请过，请勿重新申请，或者使用原版快捷方式申请！')
                            $('#calendarMessageModal').modal('show')
                            return true;
                        }
                        // 获取日期
                        let date = that.data("date")
                        let baseSignOut = that.data("base-sign-out")
                        let signOut = that.data("sign-out")
                        if (date && baseSignOut && signOut) {
                            // 加载数据
                            baseSignOut = baseSignOut.substring(0, 5)
                            signOut = signOut.substring(0, 5)
                            // 审核加班单
                            openSimpleOvertimeSlip(date, baseSignOut, signOut)
                            // 打开模态框
                            $('#overtimeModalDateInfo').html(`<span class="label label-primary">加班日期: ${date} &nbsp; 开始时间: ${baseSignOut} &nbsp; 结束时间: ${signOut} </span>`)
                            $('#overtimeModalReason').val('')
                            $('#overtimeModalTitle').html(overtimeAudit ? "" : "你懂？？？？？")
                            $('#overtimeModal').modal('show')
                        } else {
                            // 没有加班日期
                            $('#calendarMessage').html('这天没有加班时间，不可申请加班！')
                            $('#calendarMessageModal').modal('show')
                            return true;
                        }
                    }
                },
                "rightClickMenuSignIn": {
                    name: "补卡单",
                    callback: function (key, opt) {
                        // 打开补卡单页面
                        $('#flowCard :contains(签卡单)').click()
                    }
                },
                "rightClickMenuLeave": {
                    name: "请假单",
                    callback: function (key, opt) {
                        // 打开补卡单页面
                        $('#flowCard :contains(请假单)').click()
                    }
                },
                "rightClickMenuWxSignInRecord": {
                    name: "微信打卡记录",
                    callback: function (key, opt) {
                        $('#calendarMessage').html('正在加载，请稍后!!!<br/>长时间无反应请关闭后重试，或重新登陆！')
                        $('#calendarMessageModal').modal('show')
                        // 获取日期
                        let date = opt.$trigger.data("date")
                        // 油猴跨域访问 获取企业微信打卡记录
                        let param = {
                            "url": `http://wx.bondex.com.cn/api/OA/Check/getcheckindata?opencheckindatatype=3&starttime=${date} 00:00:00&endtime=${date} 23:59:59`,
                            "data": JSON.stringify([userInfo.empNo]),
                            "header": {
                                "Token": casToken
                            }
                        }
                        GM_xmlhttpRequest({
                            method: 'get',
                            url: `http://haideyiyao.com/request/json?json=${encodeURIComponent(JSON.stringify(param))}`,
                            onload: function (result) {
                                result = JSON.parse(result.responseText)
                                let sginInArr = result.checkindata
                                let wxSginInMsg = '<p><span class="label label-primary">今日无打卡记录</span><p>'
                                if (sginInArr.length > 0) {
                                    wxSginInMsg = ''
                                    sginInArr.forEach((item) => {
                                        let checkinTime = new Date(parseInt(item.checkin_time + "000")).Format("yyyy-MM-dd HH:mm:ss")
                                        wxSginInMsg += `<p><span class="label label-primary">${item.checkin_type}&nbsp;${checkinTime}</span></p>`
                                    })
                                }
                                $('#calendarMessage').html(`
                                        <h2><span class="label label-success"> 企业微信打卡记录</span></h2>
                                        <hr>
                                        ${wxSginInMsg}
                                `)
                            },
                        })
                    }
                },
            }
        })
    }
})()