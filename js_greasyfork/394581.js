// ==UserScript==
// @name         自动抢汽车之家公共线索（24小时无人职守版）
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动抢汽车之家公共线索，只能在特定的场景使用
// @author       akoo
// @match        https://ics.autohome.com.cn/Dms/Order/Index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394581/%E8%87%AA%E5%8A%A8%E6%8A%A2%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E5%85%AC%E5%85%B1%E7%BA%BF%E7%B4%A2%EF%BC%8824%E5%B0%8F%E6%97%B6%E6%97%A0%E4%BA%BA%E8%81%8C%E5%AE%88%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/394581/%E8%87%AA%E5%8A%A8%E6%8A%A2%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E5%85%AC%E5%85%B1%E7%BA%BF%E7%B4%A2%EF%BC%8824%E5%B0%8F%E6%97%B6%E6%97%A0%E4%BA%BA%E8%81%8C%E5%AE%88%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    // 表格呈现
    var listdata = [],
        loading = false;

    function renderGrid_() {
        var sel_series = $("#sel_series");
        var sel_Province = $("#sel_Province");
        var sel_city = $("#sel_city");
        var sel_orderType = $("#sel_orderType");


        var seriesID = sel_series.val();
        var factoryID = $(sel_series.get(0).options[sel_series.get(0).selectedIndex]).attr("factoryID"); // 渠道ID
        var provinceID = sel_Province.val();
        var cityID = sel_city.val();
        var orderType = sel_orderType.val();

        seriesID = parseInt(seriesID) <= 0 ? 0 : seriesID; // 有可能选择厂家上，所以车系变为零
        factoryID = parseInt(factoryID) <= 0 ? 0 : factoryID;
        provinceID = parseInt(provinceID) <= 0 ? 0 : provinceID;
        cityID = parseInt(cityID) <= 0 ? 0 : cityID;
        orderType = parseInt(orderType) <= 0 ? 0 : orderType;

        var logicType = sel_orderType.val();

        var sUrl = "GetPublicOrders?timeStamp=" + new Date().getTime().toString(); // 加时间戳

        var data = {
            appid: "dms",
            provinceid: provinceID, //820000,
            cityid: cityID, //820100,
            factoryID: factoryID, //0
            seriesid: seriesID, //0,
            logicType: logicType, // 0:全部 1：订单 2:400
            pageindex: 1,
            pagesize: 10,
            kts: '2644691E-91BE-4F2F-97B3-57DD0316D52C'
        };

        var that = this;

        $.ajax({
            url: sUrl + "&kis=9DF3FD033BAD49F2AD12724D65DB11A9",
            data: data,
            type: "get",
            dataType: "json",
            async: false,
            success: function(data) {

                if (data.result.list.length > 0) {
                    listdata = data.result.list;
                    $("#div_message").hide();
                    $("#autoone").show();
                    dealOrderData(data);
                    oneDo();
                } else {
                    $("#autoone").hide();
                    $("#div_message").show();
                }

                $("#koContainer").data("_data", data);
                if (!$("#koContainer").data("koGrid")) {
                    $("#koContainer").koGrid({
                        data: data,
                        curPageIndex: 1,
                        onPager: renderGrid,
                        trackSettings: {
                            turn_page: "dlr_ics_dms_grab_public_order_turn_page",
                            skip_page: "dlr_ics_dms__grab_public_order_skip_page"
                        }

                    });
                } else {
                    $("#koContainer").data("koGrid").reload({
                        curPageIndex: 1,
                        data: data
                    })
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

            }
        })
        //循环
        var date = new Date();
        var h = date.getHours();
        var base=90;
        var coe=90;//秒
        if(h<8||h>10){
            base+=300;
            coe+=300;
        }
        var cycle = (Math.floor(Math.random() * coe) + base)*1000;
        setTimeout(renderGrid_, cycle);
    }

    function notice(row) {
        //桌面通知
        var date = new Date();
        msg = '客户电话：' + row.CustomerPhone + '\n分配人员：' + row.saleName + '\n完成时间：' + date;

        var title = '恭喜，已为您抢到1条公共线索！';
        message.notice(title, msg);
        message.playSound('http://hao.haolingsheng.com/ring/000/989/ea4805dc2e70ebe2c7fc67acf54e5630.mp3');
    }


    function sendmail(row) {
        //桌面通知
        var date = new Date();
        var num = 1;
        msg = '客户电话：' + row.CustomerPhone + '<br>分配人员：' + row.saleName + '<br>完成时间：' + date;

        var title = '恭喜，已为您抢到' + num + '条公共线索！';

        $.ajax({
            url: 'https://m.com/mail.php',
            type: 'POST',
            dataType: 'json',
            data: {to: '395643061@qq.com',title: title,content: msg,},
        })
    }

    var message = {

        //检查桌面通知权限
        noticeinit: function() {
            if (window.webkitNotifications) {
                if (window.webkitNotifications.checkPermission() != 0) {
                    console.log("chrome 桌面通知请求");
                    window.webkitNotifications.requestPermission();
                }

            } else if (window.Notification && Notification.permission !== "granted") {
                Notification.requestPermission(function(status) {
                    if (Notification.permission !== status) {
                        Notification.permission = status;
                    }
                });
            } else {
                //ie
                //注入vbscript
                if (!this.ieinjur) {
                    var d = document.createElement("script");
                    d.type = "text/vbscript";
                    d.text = "Function noticeie(title,body) MsgBox body,64,title  End Function";
                    var head = document.getElementsByTagName("head")[0] || document.documentElement;
                    head.appendChild(d);
                    this.ieinjur = true;
                }
            }
        },
        //桌面通知
        notice: function(title, msg) {
            var time = new Date();
            var notification = Notification.requestPermission(function(perm) {
                if (perm == "granted") {
                    new Notification(title, {
                        dir: "auto",
                        tag: time,
                        icon: "https://x.autoimg.cn/dealer/ics/20190812a/Content/images_v1/robot.png",
                        body: msg,
                        isClickable: true
                    });
                }
            })

        },
        playSound: function(src) {
            console.log(src)
            var div = document.getElementById("playercnt"); //播放div
            if (div == null) {
                div = document.createElement("div");
                div.id = "playercnt";
                //div.setAttribute("style", "display:none");
                document.body.appendChild(div);
            }
            if (document.createElement('audio').play == null) {
                //ie
                div.innerHTML = "<EMBED id='player' src='" + src + "' hidden='true'  loop='false' autostart='true'>";
            } else {
                div.innerHTML = "<audio id='player' src='" + src + "' hidden autoplay></audio>";
            }
        },





    }


    function oneShow() {
        if ($("#autoone").length < 1) {
            var div = '<div id="autoone" class="m-alert mb10" style="display:none;width: 250px; margin-left: auto; margin-right: auto;">' +
                '<div class="alert-con" style="margin-left;margin-right:auto;text-align:center;">' +
                '已发现公共线索，正在自动分配，请稍后...</div>' +
                '</div>';
            $(".box-con").append(div);
        }
    }

    function oneDo() {
        for (var i = 0; i < listdata.length; i++) {
            function foo(i) { //父级函数
                var rand = Math.floor(Math.random() * 9) + 1;
                setTimeout(() => {
                    renderSales_(listdata[i]['CustomerPhone'], listdata[i]['ID']);
                }, i * 1000 * rand);
            }
            foo(i);
        }
    }

    function assignOrders_(row_) {
        /*console.log(row_);
        notice(row_);
        return false;*/
        $.ajax({
            url: "AssignOrder",
            type: "post",
            dataType: "json",
            async: false,
            data: { phone: row_.CustomerPhone, orderID: row_.ID, dealerID: 0, saleId: row_.saleId, saleName: row_.saleName },
            success: function(data) {
                var returnCode = parseInt(data.result);
                if (returnCode == 0) {
                    sendmail(row_);
                } 
            } // end sucess
        });
    }

    // 呈现销售代表
    function renderSales_(cusPhone, orderId) {
        var row = {}
        row.CustomerPhone = cusPhone;
        row.ID = orderId;
        // 加载销售代表列表
        $.ajax({
            url: "GetPubDealerSales?timaStamp=" + new Date().getMilliseconds(),
            type: "POST",
            dataType: "json",
            data: { cusPhone: cusPhone, orderId: orderId },
            success: function(data) {

                if (data.code && parseInt(data.code) != 0) {
                    return;
                }

                if (parseInt(data.returncode) !== 0) {
                    return;
                }
                if (data.rows.length > 1) {
                    row.saleId = data.rows[2]['saleID'];
                    row.saleName = data.rows[2]['saleName'];
                }
                if (data.rows.length == 1) {
                    row.saleId = data.rows[0]['saleID'];
                    row.saleName = data.rows[0]['saleName'];
                }
                $.ajax({
                        url: "GetChangeSaleInfo?timaStamp=" + new Date().getMilliseconds(),
                        type: "get",
                        dataType: "json",
                        data: { salesId: row.saleId },
                        success: function(data) {}
                    })
                    .always(function() {
                        setTimeout(function() { assignOrders_(row) }, 2000);
                    });

            } // end sucess
        })
    }
    message.noticeinit();

    oneShow();
    setTimeout(function(){
        $(".m-alert").eq(0).before('<div class="mb10" style="color:#191; font-size:14px"><div class="alert-con"><i class="u-icon16 u-icon16-success"></i>　亲！人工智能已启动，抢到线索后会第一时间通知你...</div></div>')
    }, 3000);
    setTimeout(renderGrid_, 3000);
    //setInterval(renderGrid_, 90000);
})();