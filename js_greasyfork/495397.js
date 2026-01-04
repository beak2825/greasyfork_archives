// ==UserScript==
// @name         sysu-gym
// @namespace    sysu-gym
// @version      1.0
// @description  中山大学体育场馆管理与预定系统助手
// @author       Oahiakgnol
// @match        *://gym.sysu.edu.cn/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/495397/sysu-gym.user.js
// @updateURL https://update.greasyfork.org/scripts/495397/sysu-gym.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var pageurl = window.location.href;
    var $ = unsafeWindow.$;
    // 引用原页面JS函数 START
    var cleanChose = unsafeWindow.cleanChose;
    var initDay = unsafeWindow.initDay;
    var info = unsafeWindow.info;
    var cu = unsafeWindow.cu;
    var warning1 = unsafeWindow.warning1;
    var error = unsafeWindow.error;
    var setTimeout = unsafeWindow.setTimeout;
    var closeedwin = unsafeWindow.closeedwin;
    // 引用原页面JS函数 END
    // 提供数字宽度补齐，日期格式不对会无法加载
    function pad(num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    }
    // 网址正则
    var reg_product = /[http|https]*?:\/\/gym.sysu.edu.cn\/product\/show.html\?id=(\d+)/;
    var reg_order = /[http|https]*?:\/\/gym.sysu.edu.cn\/order\/show.html\?id=(\d+)/;
    // 特定类型的场地预定才可用
    var button = $('#reserve');
    if (reg_product.test(pageurl) && ($('div#seatshow').length==1)) {
        // 6:00-22:00之外时段订场会被限制, 但只是前端js做了按钮隐藏, 如果存在该情况则恢复按钮
        if (button.hasClass('button-disable')){
            closeedwin();
            button.attr('onclick', 'applySeat();');
            button.removeClass('button-disable');
            button.removeAttr('style');
        }
        $('script:contains("再来预订")').remove()
        // 添加加载任意日期按钮
        $($(".boxes")[2]).append(
            "<style>#loadanydate > button {width: 200px;height: 30px;color:white;background-color:cornflowerblue;border-radius: 3px;border-width: 0;margin: 0;outline: none;font-size: 16px;text-align:center;cursor: pointer;}#loadanydate > button :hover{background-color: antiquewhite;}</style><a style='display:block;float:right' id='loadanydate'><button style='width:150px;height=200px'>加载库存日历</button></a>"
        );
        // 为按钮绑定函数
        $('#loadanydate').click(
            function () {
                // 获取选中日期
                var date = new Date($(".calendar-selected").attr("abbr").split(",").join("-"));
                // 看看是否已经加载过该日期
                var datelist = $('.date');
                for (var i = 0; i < datelist.length; i++) {
                    var itemDate = new Date(datelist[i].innerText);
                    if ((!($(datelist[i]).parent().attr('id') == 'anyDateLoader') & itemDate.getTime() > date.getTime()) || (itemDate.getTime() == date.getTime())) {
                        console.log(`日期 ${date} 已存在`);
                        info('请在库存日历中正确选择还未加载的未来日期');
                        return;
                    }
                }
                // 删除可能存在的自创建的li元素
                $('#anyDateLoader').remove();
                // 构建日期的li元素
                var li = document.createElement("li");
                var weekdayList = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                var yearString = pad(date.getFullYear(), 4);
                var monthString = pad(date.getMonth() + 1, 2);
                var dayString = pad(date.getDate(), 2);
                var dateString = yearString + "-" + monthString + "-" + dayString;
                var indexString = $(".date-week").find("li").length + 1 + "";
                var weekdayString = weekdayList[date.getDay()];
                li.setAttribute("data-year", yearString);
                li.setAttribute("data-month", monthString);
                li.setAttribute("data-day", dayString);
                li.setAttribute("data-week", weekdayString);
                li.setAttribute("data", dateString);
                li.setAttribute("class", "");
                li.setAttribute("id", "anyDateLoader");
                // 自己创建的标签靠右突出显示
                li.setAttribute("style", "float:right");

                var divWeek = document.createElement("div");
                divWeek.setAttribute("class", "week");
                divWeek.innerText = weekdayString;

                var divStock = document.createElement("div");
                divStock.setAttribute("class", "stock");
                divStock.setAttribute("style", "background: linear-gradient(to right, red, blue);-webkit-background-clip: text;color: transparent;font-size:15px");
                divStock.innerText = "自选日期";

                var divDate = document.createElement("div");
                divDate.setAttribute("class", "date");
                divDate.innerText = dateString;

                li.appendChild(divWeek);
                li.appendChild(divStock);
                li.appendChild(divDate);
                // 调宽ul标签不然被遮挡
                $('ul.dates-list').attr('style', 'width:965px');
                // 把创建的标签附上原网页
                $('ul.dates-list').append(li);

                // 为新建的标签绑定响应函数
                $('#anyDateLoader').click(
                    function () {
                        var myli = $('#anyDateLoader')
                        if (myli.hasClass('active')) {
                            return false;
                        }
                        // 移除其他并添加自身选中高亮
                        myli.parent().children().removeClass("active");
                        myli.addClass("active");
                        // 设置订场信息展示处
                        var datestr = myli.attr('data');
                        var date = new Date(datestr);
                        var weekdayList = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                        $("#orderdate").html(`${datestr.slice(0, 4)}年${datestr.slice(5, 7)}月${datestr.slice(8, 10)}日  ${weekdayList[date.getDay()]}`);
                        // 初始化场地
                        cleanChose();
                        initDay(datestr);
                        // 无用效果
                        $("li#anyDateLoader").animate({ marginRight: "+=20px" }, 250);
                        $("li#anyDateLoader").animate({ marginRight: "-=20px" }, 250);
                    }
                )
                $('#anyDateLoader').click();
            }
        )
        // 绑定之后预加载
        var latestdate = new Date($('.date')[$('.date').length - 1].innerText);
        var nextdate = new Date(latestdate.getTime() + 24 * 60 * 60 * 1000);
        var nextdatestr = nextdate.getFullYear() + ',' + (nextdate.getMonth() + 1) + ',' + nextdate.getDate();
        $('td.calendar-day').each(
            function (index, ele) {
                if (ele.abbr == nextdatestr) {
                    $('td.calendar-selected').removeClass('calendar-selected');
                    $(ele).addClass('calendar-selected');
                }
            }
        )
        $('#loadanydate').click()
        // 突破每日最多预定场数限制
        $(document).keydown(
            function (e) {
                if (e.ctrlKey && e.keyCode == 13) {
                    var val = prompt("【隐藏项】突破最大预定场数限制，输入最大值：", 2);
                    val = parseInt(val, 10);
                    if (val > 0) {
                        $('#advancenum').attr('value', val);
                        console.log(`日最大订场数限制被用户修改为:${val}`);
                    }
                }
            }
        )
        // 同步更新applySeat函数
        unsafeWindow.applySeat = function applySeat() {
            var num = Number($("#sum").text());
            if (num > 0) {

                if ($("#cr").length > 0) {
                    if (!$("#cr").is(":checked")) {
                        info('请阅读说明后预订！');
                        return false;
                    }
                }

                var model = {};
                if ($("#shoptype").find(".active").data('type') == 'day') {
                    var stock = {};
                    var seatid = [];
  -                 $('#seatshow').find('.ticket-auto').each(function (i, k) {
                        seatid.push($(k).attr('data-did'));
                        stock[$(k).attr('data-stockid')] = (stock[$(k).attr('data-stockid')] == null ? 1 : Number(stock[$(k).attr('data-stockid')]) + 1) + '';
                    })
                    model.stock = stock;
                    model.istimes = '1';
                    model.stockdetailids = seatid.join(',');
                } else {
                    model.dates = $('#yd_date').val();
                    var time_detailname = [];
                    $('#seatshow').find('.ticket-auto').each(function (i, k) {
                        time_detailname.push($(k).data('timer') + '_' + $(k).data('dname'));
                    })
                    model.time_detailnames = time_detailname.join(',');
                    if ($("#shoptype").find(".active").data('type') == 'month') {
                        model.flag = '1';
                    } else {
                        model.flag = '2';
                    }
                    model.serviceid = $('#serviceid').val();
                }

                if ($("#shoptype").find(".active").data('type') == 'day') {

                    var param = {};
                    param.serviceid = $('#serviceid').val();
                    param.num = seatid.length;
                    param.date = $('.date-week').find('li.active').attr('data');
                    unsafeWindow.AjaxGet('/order/booklimt', param, function (o) {
                        $('#param').val(JSON.stringify(model));
                        $('#form1').submit();
                    }, 'json');
                } else {
                    $('#param').val(JSON.stringify(model));
                    $('#form1').submit();
                }
            } else {
                info("请选择需要预订的" + unsafeWindow.typename + "信息！");
            }
        }

        setTimeout('$("a[rel=shopping]").click();', 10);
    }

    if (reg_order.test(pageurl)) {
        if (button.hasClass('button-disable')){
            closeedwin();
            button.attr('onclick', 'goonreserve();event.returnValue=false;');
            button.removeClass('button-disable');
            button.removeClass('normal-button-mid');
            button.removeAttr('style');
        }
        // 添加付款方式选项
        $($("div.action-btn")[0]).prepend("<p align='center' id='tryinfo' retry='true' ncalls='0' interval='1000' style='font-family:verdana;font-size:150%'></p><label><input name='payment' type='radio' value='0' checked='true' />&nbsp;&nbsp;自动支付(运动金)&nbsp;&nbsp;</label><label><input name='payment' type='radio' value='1' />&nbsp;&nbsp;手动支付&nbsp;&nbsp;</label>");
        // 绑定延迟设置按键
        $(document).keydown(
            function (e) {
                if (e.ctrlKey && e.keyCode == 13) {
                    var val = prompt("【隐藏项】设置刷新间隔，单位毫秒 (别太过分，最低500)：", 1000);
                    val = parseInt(val, 10);
                    if (val >= 500) {
                        $('#tryinfo').attr('interval', val);
                    }
                }
            }
        )
        // 每次刷新该页面重置 ncalls 记录goonreserve调用次数
        $('#tryinfo').attr('ncalls', 0);
        $('#tryinfo').attr('retry', false);

        // 重写goonreserve方法
        unsafeWindow.goonreserve = function () {
            // 记录调用次数
            var ncalls = parseInt($('#tryinfo').attr('ncalls') == undefined ? 0 : $('#tryinfo').attr('ncalls'));
            ncalls = ncalls + 1;
            $('#tryinfo').attr('ncalls', ncalls);
            // 如果是第一次调用，处理以下事项
            if (ncalls == 1) {
                // 默认遇到未开放的场地继续刷新
                $('#tryinfo').attr('retry', true);
                // 自动刷新的时候限制订场按钮的点击功能，改为取消
                $("#reserve").attr('onclick', "");
                $("#reserve").text('取消刷新');
                $("#reserve").click(
                    function () {
                        $('#tryinfo').attr('retry', false);
                        $("#reserve").text('确认预定');
                        $("#reserve").unbind('click');
                        $("#reserve").attr('onclick', "goonreserve();event.returnValue=false;");
                        // 重置颜色
                        $("table").find("td,th").each(function (index, element) { element.removeAttribute("style") });
                        // 清除信息
                        $('#tryinfo').text("")
                    }
                )
            }

            // post数据
            if (unsafeWindow._param != 'undefined') {
                if (unsafeWindow.set_iphone == 1) {
                    if ($('#remark').val() == null || $('#remark').val() == '') {
                        info('请填写手机号码');
                        return false;
                    }
                    if (!unsafeWindow.phone.test($("#remark").val())) {
                        info("请输入有效的手机号码");
                        return false;
                    }
                    unsafeWindow._param.remark = $('#remark').val();
                }

                var param1 = {};
                param1.param = JSON.stringify(unsafeWindow._param);
                unsafeWindow.AjaxPost('/order/book', param1, function (o) {
                    var val = $('input:radio:checked').val();
                    if (o.result == '1') {
                        window.location.href = cu('/order/myorder_view') + '?id=' + o.object.orderid;
                    } else if (o.result == '2') {
                        if (val == "0") {
                            // 学生付款
                            // 体育金支付
                            var dataPay = {
                                param: "{'payid':2,'orderid':'" + o.object.orderid + "','ctypeindex':0}",
                                json: true
                            }
                            $.ajax({
                                type: 'POST',
                                url: "http://gym.sysu.edu.cn/pay/account/topay.html",
                                data: dataPay,
                                success: function () {
                                    window.location.href = cu('/order/myorder_view') + '?id=' + o.object.orderid
                                },
                                dataType: 'json'
                            });
                        } else if (val == "1") {
                            warning1("现在去支付？", "topaypage", "no", o.object.orderid, o.object.orderid);
                        }
                    } else if (/未到该日期的预订时间/.test(o.message)) {
                        if ($('#tryinfo').attr('retry') == 'true') {
                            setTimeout(unsafeWindow.goonreserve, parseInt($('#tryinfo').attr('interval') == undefined ? 1000 : $('#tryinfo').attr('interval')));
                            $('#tryinfo').text(`已刷新 ${$('#tryinfo').attr('ncalls')} 次，间隔 ${$('#tryinfo').attr('interval')} 毫秒`)
                            console.log(`已刷新${$('#tryinfo').attr('ncalls')}次，继续刷新！间隔${$('#tryinfo').attr('interval')}毫秒。`);
                            // 每次进入前改变字体颜色，退出重置
                            if (typeof ($($("table").find("td,th")[0]).attr('style')) == "undefined") {
                                $("table").find("td,th").each(
                                    function (index, element) {
                                        element.setAttribute("style", "color:#069af3");

                                    }
                                );
                            } else {
                                $("table").find("td,th").each(function (index, element) { element.removeAttribute("style") });
                            }
                        } else {
                            // 重置颜色
                            $("table").find("td,th").each(function (index, element) { element.removeAttribute("style") });
                            console.log(`已刷新${$('#tryinfo').attr('ncalls')}次，用户取消了刷新！`);
                            $('#tryinfo').attr('ncalls', 0);
                        }
                    }
                    else {
                        info(o.message);
                    }
                });
            } else {
                error('数据有误，请返回重试');
            }

        }
        // 重写AjaxPost方法，去掉loadding
        unsafeWindow.AjaxPost = function AjaxPost(url, postData, successFunc, errorFunc) {
            if (postData == null) {
                postData = {
                    json: true
                };
            } else {
                postData.json = true;
                $.ajax({
                    url: cu(url),
                    data: postData,
                    type: 'post',
                    dataType: 'json',
                    success: function (data) {
                        if (data.message) {
                            if (data.message.indexOf('REQUESTERROR') != -1) {
                                // 出错页面
                                $('body').html(data.message);
                            } else if (data.message.indexOf('USERNOTLOGINYET') != -1) {
                                window.location.href = cu('/login/pre') + '?continueurl=' + data.object.continueurl;
                            } else if (data.message.indexOf('NOTPRODUCT') != -1) {
                                window.location.href = cu('/error/403');
                            } else {
                                if (typeof (successFunc) == "function") {
                                    successFunc(data);
                                }
                            }
                        } else {
                            if (typeof (successFunc) == "function") {
                                successFunc(data);
                            }
                        }
                    },
                    error: function (xhr) {
                        if (xhr) {
                            if (errorFunc) {
                                errorFunc(xhr);
                            } else {
                                error(xhr.status + ":" + xhr.statusText);
                            }
                        }
                    }
                });
            }
        }
    }
})();