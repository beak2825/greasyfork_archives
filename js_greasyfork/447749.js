// ==UserScript==
// @name         重试预约
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  科研实验室公共平台管理系统_自动预约
// @author       **
// @run-at       document-idle
// @match        https://kysyshx.wchscu.cn/client/instrument/detail/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/447749/%E9%87%8D%E8%AF%95%E9%A2%84%E7%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/447749/%E9%87%8D%E8%AF%95%E9%A2%84%E7%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.funs = {
        _nowDateParam: {
            initDateTime: null
        }
        , startTime: null
        , nowDateTime: function() {
            return funs._nowDateParam.initDateTime + Date.now();
        }
        , _syncNowDate: function(call) {
            let time = funs.startTime - funs.nowDateTime();
            if (time >= -50000 && time <= 20000) {
                console.log('停止同步时间. 剩余时间: ' + time + 'ms');
                setTimeout(function() {
                    funs._syncNowDate();
                }, 30000);
                return;
            }
            let xmlHttp = new XMLHttpRequest();
            if (!xmlHttp){
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlHttp.open("HEAD", location.href, true);
            // xmlHttp.open("HEAD", "https://kysyshx.wchscu.cn/account/appointment/BeforeBook",false);
            xmlHttp.onreadystatechange = function() {
                if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
                    let _nowDateTime = Date.now();
                    let serverDateTime = new Date(xmlHttp.getResponseHeader("Date")).getTime();
                    funs._nowDateParam.initDateTime = serverDateTime - _nowDateTime;
                    setTimeout(function() {
                        funs._syncNowDate();
                    }, 10000);
                    if (null != call) {
                        call();
                    }
                }
            }
            xmlHttp.send();
        }
        , _modifyTime: function() {
            $('time').text(new Date(funs.nowDateTime()).format('yyyy-MM-dd HH:mm:ss'));
            setTimeout(function() {
                funs._modifyTime();
            }, 1000);
        }
        // ***********************************************************************************************************************************************************************************************************************************************************
        // ***********************************************************************************************************************************************************************************************************************************************************
        // 修改此处时间可以看下效果. 试完之后记得还原为 00:00:00
        // ***********************************************************************************************************************************************************************************************************************************************************
        // ***********************************************************************************************************************************************************************************************************************************************************
        , timeStr: '08:00:00'
    };
    funs._syncNowDate(function() {
        alert('扩展加载完成');
    });
    funs._modifyTime();

    unsafeWindow.showUseIntro = function(canClose, isSubscribe, beginTime, endTime, calEvent) {

        let time = 5;
        if (!beginTime || !endTime) {
            errorAlert("请选择预约时间");
            return;
        }
        let weeks = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
        let startDateTime = new Date(beginTime);
        let endDateTime = new Date(endTime);
        let minutes = (endDateTime - startDateTime) / 1000 / 60;
        let startStr = `${startDateTime.getMonth() + 1}月${startDateTime.getDate()}日 ${weeks[startDateTime.getDay()]} ${startDateTime.getHours()}:${startDateTime.getMinutes() < 10 ? '0' + startDateTime.getMinutes() : startDateTime.getMinutes()} - ${endDateTime.getMonth() + 1}月${endDateTime.getDate()}日 ${weeks[endDateTime.getDay()]} ${endDateTime.getHours()}:${endDateTime.getMinutes() < 10 ? '0' + endDateTime.getMinutes() : endDateTime.getMinutes()}`;
        var data = {"time":startStr, "minutes": minutes, "cost":"免费???", "runCost":"不会算自己想办法找多少钱吧!!!"};
        var myNum = 0;
        var oldErrorAlert = errorAlert;
        var content = '<div style="border: 1px solid;"><p style="color: red;font-weight: 800;font-size: 26px;">服务器时间 <time></time></p><p id="errorMsg" style="color: red;font-weight: 800;font-size: 26px; display: contents">-</p><h2 style="display: contents">　　尝试: <strong id="myNum" class="text-danger">-</strong></h2></div><div style="border: 1px solid;height: 200px;overflow: hidden;overflow-y: auto;text-align: left;color: red;" id="errMsgs"></div><p><strong class="text-danger">' + data.time + '</strong></p>' + '<p>时长：<strong class="text-danger">' + data.minutes + '</strong> 分钟 / 预约费：<strong class="text-danger">' + data.cost + '</strong> </p><p>预计上机费：<strong class="text-danger" style="display:none">' + data.runCost + '</strong> </p>' + '<p id="lendout" style="display:none"> 是否外借： <input type="radio" name="lendOut" value="true">是 <input type="radio" name="lendOut" value="false" checked> 否</p>' + remarksContent;
        let isFunFinish = false;
        let isFunSuccess = false;
        let fun = function(yes, myRun) {
            if (!$('#remarkss').val() && 'False' == 'True') {
                errorAlert("请输入备注，内容：" + $("#bookRemarks").text());
                return false;
            }

            // 实验
            // var postReq = function(url, xx, param, fun) {
            //     console.log(url, xx, param, fun);
            //     fun({"statusCode":500,"data":null,"info":"您已预约过该时间段___测试","count":0,"success":false}, false);
            // }
            let startReqTime = funs.nowDateTime();
			let typeObj = {
                "5713": {
                    instrumentId: 5713
                    , lendOut: false
                    , ResearchGroupId: 116
                    , ChargeType: '普通时长收费'
                }
                , "5590": {
                    instrumentId: 5590
                    , lendOut: false
                    , ResearchGroupId: 217
                    , ChargeType: '工作日'
                }
            }
            let reqParam = typeObj[location.pathname.replace(/.*\//, '')];
            reqParam.beginTime = beginTime;
            reqParam.endTime = endTime;
            reqParam.remarks = $('#remarkss').val();
            reqParam.sampleInfo = $("input[name='sampleInfSSystemInfotProjectSourcejectSourceemInfotemInfostemInfo").val();
            reqParam.lendOut = $('input:radio[name="lendOut"]:checked').val();
            
            postReq("/account/appointment/book", null, reqParam, function(res, state) {
                function cancel() {
                    $('.btn-my').show();
                    $('.btn-can').html('取消');
                    $('.btn-ok').show();
                    canVal = true;
                    myNum = 0;
                }
                if (state) {
                    isFunSuccess = true;
                    let msg = "";
                    try {
                        msg = res.info;
                    } catch (e) {
                        console.log(e);
                    }
                    $('#errMsgs').append('<p style="margin: 0 0 0 10px;">' + myNum + '. (' + new Date(startReqTime).format('HH:mm:ss:S') + ' - ' + new Date(funs.nowDateTime()).format('HH:mm:ss:S') + '. ' + isFunFinish + '. ' + myRun + '):　' + msg + '</p>').scrollTop($('#errMsgs').prop('scrollHeight'));
                    cancel();
                    if (calEvent) {
                        calEvent.realName = 'xx';
                        calEvent.cellphone = '00000000000';
                        calEvent.remarks = $('#remarks').val();
                        calEvent.title = "xx<br /> " + $('#researchGroupId').find(":selected").text() + "<br/>XX科";
                        calEvent.userId = 0;
                        calEvent.groupName = $('#researchGroupId').find(":selected").text();
                        calEvent.unitName = "XX科;";
                        calEvent.id = res.data;
                        $('#calendar').weekCalendar('updateEvent', calEvent);
                        $('#calendar').find('.wc-cal-event-delete').html("×").css('font-size', '16px')
                        successAlert("预约操作成功");
                    } else {
                        successAlert("预约操作成功");
                    }
                } else {
                    if (yes) {
                        if (myNum <= -1) {
                            cancel();
                        } else {
                            $('#errMsgs').append('<p style="margin: 0 0 0 10px;">' + myNum + '. (' + new Date(startReqTime).format('HH:mm:ss:S') + ' - ' + new Date(funs.nowDateTime()).format('HH:mm:ss:S') + '. ' + isFunFinish + '. ' + myRun + '):　' + res.info + '</p>').scrollTop($('#errMsgs').prop('scrollHeight'));
                            $('#myNum').html(++myNum);
                            if (res.info == '您已预约过该时间段') {
                                isFunSuccess = true;
                                cancel();
                                successAlert("大概率是成功了(您已预约过该时间段)");
                                return;
                            }
                            if (isFunSuccess) {
                                cancel();
                                return;
                            }
                            if (res.info == '预约请求过于频繁，请稍后重试') {
                                alert('频繁被封, 估计已经失败, 等会手动试试吧');
                                cancel();
                                return;
                            }

                            // 不在重试, 直接取消
                            isFunFinish = true;
                            cancel();
                            // if (!isFunFinish || myRun) {
                            //     isFunFinish = true;
                            //     setTimeout(function() {
                            //         fun(true, true);
                            //     }, time);
                            // }
                        }
                    }
                    if (calEvent) {
                        $('#calendar').weekCalendar('removeEvent', calEvent.id);
                    }

                }
                return true;
            });
        }
        let startFun = function() {
            if (myNum <= -1) {
                $('.btn-my').show();
                $('.btn-can').html('取消');
                $('.btn-ok').show();
                canVal = true;
                errorAlert = oldErrorAlert;
                $('#errorMsg').html("-");
                myNum = 0;
                return;
            }
            var number = funs.startTime - funs.nowDateTime();
            if (number >= 2000) {
                $('#errorMsg').html((number / 1000).toFixed(2) + "秒后开始");
                setTimeout(function() {
                    startFun();
                }, 1000);
                return;
            }
            if (number >= 900) {
                $('#errorMsg').html((number / 1000).toFixed(2) + "秒后开始");
                setTimeout(function() {
                    startFun();
                }, 200);
                return;
            }
            isFunFinish = false;
            $('#errorMsg').html("准备尝试预约");
            setTimeout(function() {
                fun(true);
            }, number - 300);
            setTimeout(function() {
                fun(true);
            }, number - 100);
            setTimeout(function() {
                fun(true);
            }, number);
            setTimeout(function() {
                fun(true);
            }, number + 100);
            setTimeout(function() {
                fun(true);
            }, number + 500);
        }
        var canVal = true;
        $.confirm({
            boxWidth: '900px',
            useBootstrap: false,
            title: false,
            content: content,
            theme: 'modern',
            type: 'orange',
            backgroundDismissAnimation: 'glow',
            typeAnimated: true,
            onClose: function () {
                errorAlert = oldErrorAlert;
            },
            buttons: {
                testAction: {
                    text: '尝试预约',
                    btnClass: 'btn-my',
                    action: function() {
                        time = prompt('重试间隔(秒)', '0.1');
                        if (null == time) {
                            alert('已取消');
                            return;
                        }
                        time = time * 1000;
                        if (isNaN(time)) {
                            alert('请输入正确的时间');
                            return;
                        }
                        errorAlert = function() {};
                        $('.btn-my').hide();
                        $('.btn-ok').hide();
                        $('.btn-can').html('取消尝试');
                        canVal = false;

                        // 开始时间
                        funs.startTime = new Date(new Date(funs.nowDateTime()).format('yyyy-MM-dd ' + funs.timeStr)).getTime();
                        if ('00:00:00' == funs.timeStr) {
                            funs.startTime += 86400000;
                        }
                        startFun();
                        return false;
                    }
                },
                okAction: {
                    text: '确认',
                    btnClass: 'btn-primary btn-ok',
                    action: function() {
                        errorAlert = oldErrorAlert;
                        fun(false);
                    }
                },
                cancelAction: {
                    text: '取消',
                    btnClass: 'btn-can',
                    action: function() {
                        myNum = -2;
                        if (calEvent) {
                            $('#calendar').weekCalendar('removeEvent', calEvent.id);
                            return true;
                        }
                        return canVal;
                    }
                }
            },
            onOpenBefore: function() {
                if ('False' == 'True' && "Wchscu" == "Gzhmu") {
                    $(".jconfirm-content #lendout").show();
                }
            }
        });
    }
})();