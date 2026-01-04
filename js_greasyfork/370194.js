// ==UserScript==
// @name            GNZ48公演票购买插件
// @namespace       [url=mailto:915642512@qq.com]915642512@qq.com[/url]
// @author          HenryGentry
// @description     公演票购买
// @match           *://shop.48.cn/tickets/item/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.2.3
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/370194/GNZ48%E5%85%AC%E6%BC%94%E7%A5%A8%E8%B4%AD%E4%B9%B0%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/370194/GNZ48%E5%85%AC%E6%BC%94%E7%A5%A8%E8%B4%AD%E4%B9%B0%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function () {
	'use strict';
    $("#buy").after('<a href="javascript:void(0);" class="ma_r10" id="script-buy" style="color:#FFF; padding:5px 10px; background:#59c4ec; display:block; border-radius: 5px; border:1px solid #59c4ec; float:left;">手动购买</a>');
    $("#script-buy").after('<a href="javascript:void(0);" class="ma_r10" id="auto-buy" style="color:#FFF; padding:5px 10px; background:#59c4ec; display:block; border-radius: 5px; border:1px solid #59c4ec; float:left;">定时购买</a>');
    $("#auto-buy").after('<a href="javascript:void(0);" class="ma_r10" id="check-ticket" style="color:#FFF; margin-top: 10px; padding:5px 10px; background:#59c4ec; display:block; border-radius: 5px; border:1px solid #59c4ec; float:left;">检查状态</a>');
    $("#check-ticket").after('<a href="javascript:void(0);" class="ma_r10" id="reload-ticket" style="color:#FFF; margin-top: 10px; padding:5px 10px; background:#59c4ec; display:block; border-radius: 5px; border:1px solid #59c4ec; float:left;">马上捡漏</a>');
    $("#reload-ticket").after('<input class="ma_r10" id="ticket-type" style="color:#FFF; margin-top: 10px; padding:5px 10px; height: 30px; display:block; border-radius: 5px; background:#59c4ec; border:1px solid #59c4ec; float:left; width: 56px" placeholder="捡漏类型" value="2">');
    $("#seat_type").val(2)
    var buyTools = {
        //购票
        buyTicket: function () {
            // 购票数
            var _num = $("#num").val();
            // 座位类型 默认为普坐
            // 目前页面 2为v 3为普坐 4为站 0为未选择
            var _seattype = $("#seat_type").val() != '0' ? $("#seat_type").val() : "2"
            // 请求地址
            var _url = "/TOrder/add";
            // 公演场次 (太久没用正则表达式，不会用了= =暂时用字符串截取吧)
            var _id = location.pathname.substr(14, 4);
            //这个字段表示是哪个团 粗略看了下 3是中泰 2是悠唐(中泰机器人专用，写死3)
            var _brand_id = "3";
            // 是否抽选（脚本暂时不支持抽选场次）
            var _choose_times_end = -1;

            console.log("座位类型:" + _seattype);
            console.log("公演场次:" + _id);
            console.log("购买票数:" + _num);
            console.log("所属团:" + _brand_id);
            console.log("是否抽选:" + _choose_times_end);

            // ajax请求购票
            $.ajax({
                url: _url,
                type: "post",
                dataType: "json",
                data: {
                    id: _id,
                    num: _num,
                    seattype: _seattype,
                    brand_id: _brand_id,
                    r: Math.random(),
                    choose_times_end: _choose_times_end
                },
                success: function (result) {
                    console.log("接口返回错误码:" + result.ErrorCode);
                    console.log("接口返回错误信息:" + result.Message);
                    if (result.HasError) {
                        //失败操作
                        //alert("购买失败!返回码为:" + result.ErrorCode + ",返回信息为:" + result.Message);
                        console.log("购买失败!返回码为:" + result.ErrorCode + ",返回信息为:" + result.Message);
                    } else {
                        //非抽选场次逻辑
                        if (result.ReturnObject != "choose_tickets") {
                            //成功操作
                            //alert("购买成功!返回码为:" + result.ErrorCode + ",返回信息为:" + result.Message);
                            console.log("购买成功!返回码为:" + result.ErrorCode + ",返回信息为:" + result.Message);
                            if (result.Message == "success") {
                                window.location.href = result.ReturnObject;
                            } else {
                                //alert("正在出票（看人品）......返回码为:" + result.ErrorCode + ",返回信息为:" + result.Message);
                                console.log("正在出票（看人品）......返回码为:" + result.ErrorCode + ",返回信息为:" + result.Message);
                                //checkTicket();
                            }
                        } else {
                            //目前中泰没有抽选场次 所以提交时候是不会走这里的
                            console.log("提交成功，等待管理员抽选");
                        }
                    }
                },
                error: function (e) {
                    console.log(e);
                    console.log("您排队失败，请刷新重试,错误代码:162001");
                }
            })
        },
        checkTicket: function () {
            var _id = location.pathname.substr(14, 4);
            var _url = "/TOrder/tickCheck";
            $.ajax({
                url: _url,
                type: "GET",
                dataType: "json",
                data: {
                    id: _id,
                    r: Math.random()
                },
                success: function (result) {
                    if (result.HasError) {
                        alert("购买失败：错误码为:" + result.Message);
                    } else {
                        switch (result.ErrorCode) {
                            case "wait":
                                alert("等待中......");
                                setTimeout(function () {
                                    checkTicket();
                                }, 5000);
                                break;
                            case "fail":
                                //失败操作
                                alert("购买失败：错误码为:" + result.Message);
                                break;
                            case "success":
                                alert("购买成功!");
                                window.location.href = result.ReturnObject;
                                break;
                        }
                    }
                },
                error: function (e) {
                    alert("您排队失败，请刷新重试,错误代码:162002");
                }
            });
        },
        getTime: function (callSuccess, callError) {
            $.ajax({
                async: false,
                url: "/pai/GetTime?" + new Date().getTime(),
                success: function (data) {
                    if (typeof callSuccess === "function") {
                        callSuccess(data);
                    }
                },
                error: function (data) {
                    if (typeof callError === "function") {
                        callError(data);
                    }
                }
            })
        }
    };

    $("#seattype2").on('click', function () {
        $("#ticket-type").val(2)
        $("#seat_type").val(2)
    })

    $("#seattype3").on('click', function () {
        $("#ticket-type").val(3)
        $("#seat_type").val(3)
    })
    $("#seattype4").on('click', function () {
        $("#ticket-type").val(4)
        $("#seat_type").val(4)
    })

    $("#ticket-type").on('input', function (e) {
        if (e.currentTarget.value) {
            $("#seat_type").val(e.currentTarget.value)
        }
    })

    var autoBuyFlag = false;

    var ticketCode = $('#tickets_id').val()

    var reloadObj = sessionStorage.getItem('reloadObj' + ticketCode)


    $(function () {
        // 自动捡漏
        if (reloadObj &&  JSON.parse(reloadObj).isReload) {
            var type =  JSON.parse(reloadObj).ticketType
            $("#ticket-type").val(type)
            $("#seat_type").val(type)
            var target = $("#seattype" + type)
            if (target.hasClass('ticketsbuy')) {
                buyTools.buyTicket()
                console.log('已发送捡漏请求')
                setTimeout(function () {
                    location.reload()
                    return
                }, 10000)
            } else {
                location.reload()
                return
            }
        }

        $("#reload-ticket").click(function () {
            var obj = {
                ticketType: $("#ticket-type").val(),
                isReload: true
            }
            sessionStorage.setItem('reloadObj' + ticketCode, JSON.stringify(obj))
            location.reload()
            return
        })


        //手动购买
        $("#script-buy").click(function () {
            buyTools.buyTicket();
        });
        //自动购买
        $("#auto-buy").click(function () {
            if (autoBuyFlag) {
                return;
            }
            autoBuyFlag = true;
            //获取今天日期
            var fullYear = new Date().getFullYear();
            var month = new Date().getMonth() + 1;
            var day = new Date().getDate();
            //切票时间
            var result = fullYear + "-" + month + "-" + day + " " + "20:00:00";
            console.log("切票时间:" + result);

            //获取请求时间
            var requestTime = new Date().getTime();
            //ajax请求获取服务器时间
            buyTools.getTime(function (data) {
                var responseTime = new Date().getTime();
                var delayTime = responseTime - requestTime;
                console.log("获取服务器时间的请求响应时间(ms)：" + delayTime);
                //data.replace(/Date\([\d+]+\)/, function (a) { eval('d = new ' + a) });
                var servTime = data.replace("/Date(", "");
                servTime = servTime.replace(")/", "");
                console.log("服务器时间戳为:" + servTime);
                //计算时间
                //切票等待的毫秒数
                var millisec = new Date(result).getTime() - parseInt(servTime);
                if (millisec <= 0) {
                    alert("切票时间都过了，怎么切？");
                    return;
                }
                console.log("距离定时任务时间(ms):" + millisec);
                console.log("定时任务开始执行......");
                $("#auto-buy").text("正在执行!");
                var t = setTimeout(function () {
                    console.log("开始购票......");
                    buyTools.buyTicket();
                }, millisec)
            });
        });

        //检查购票状态
        $("#check-ticket").click(function () {
            buyTools.checkTicket();
        });
    });
})();