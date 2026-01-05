// ==UserScript==
// @name         jo本
// @namespace    http://snh48.com
// @version      1.2
// @description  干他娘切爆
// @author       Hali
// @match        http://shop.48.cn/tickets/item/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24656/jo%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/24656/jo%E6%9C%AC.meta.js
// ==/UserScript==



(function() {

    var ADD_TICKET_URL = "/TOrder/add";
    var CHECK_TICKET_URL = "/TOrder/tickCheck";
    var TIMESTAMP_URL = "/TOrder/gettimestamp";
    var SALELIST_URL = "/tickets/saleList";
    
    var _num = 1;         // 数量
    var isVIP = false;    // true = VIP用户，false = 非VIP用户
    var mode = 0;         // 0 = 抢票模式，1 = 捡漏模式

    var ticket = {
        id: parseInt(tickets_id),
        seattype: parseInt(strseat_type),
        num: _num,
        brand_id: $('body script').text().match(/brand_id:(\d+)/)[1],
        r: Math.random()
    };

    console.log("[TICKET]: " + JSON.stringify(ticket));

    var TITLE = document.title;
    function updateTitleMessage(s) {
        document.title = "[" + s + "]" + TITLE;
    }

    function countdown() {
        updateTitleMessage("还没开始呢");
        console.log("countdown");
        var start_time = (new Date()).setHours(20, 0, 0, 0); // 当天 20:00 整
        var preRequestInterval = 200;

        var timer = setInterval(function() {
            $.ajax({
                url: TIMESTAMP_URL,
                type: "get",
                datatype: "json",
                data: { r: Math.random() },
                success: function(data) {
                    console.log("[TIME]: " + DateFormat(data,"yyyy/MM/dd HH:mm:ss"));
                    time = parseInt(data.match(/\(([^)]+)\)/)[1]);
                    
                    if (time >= start_time) {
                        clearInterval(timer);
                        addTicket();
                    }
                }
            });
        }, preRequestInterval);
    }

    function checkAvailable() {
        updateTitleMessage("捡漏");

        var preRequestInterval = 100;

        $.get(
            SALELIST_URL,
            { id: ticket.id, brand_id: ticket.brand_id },
            function(data) {
                var allUnavailable = true;
                console.log("[SALELIST]: " + JSON.stringify(data));
                for (var idx = data.length - 1; idx >= 0; idx--) {
                    var elem = data[idx];
                    if (elem.amount > 0) {
                        layer.msg("还有票");
                        allUnavailable = false;
                        if (!isVIP && elem.seat_type < 3) {
                            continue;
                        }
                        else {
                            ticket.seattype = elem.seat_type;
                            addTicket();
                            break;
                        }
                    }
                }
                if (allUnavailable) {
                    setTimeout(checkAvailable, preRequestInterval);
                }
            }
        );
    }

    function checkTicket() {
        updateTitleMessage("无尽旋转中");

        var preRequestInterval = 1000;
        
        $.ajax({
            url: CHECK_TICKET_URL,
            type: "post",
            dataType: "json",
            data: { id: tickets_id, r: Math.random() },
            success: function(result) {
                console.log("[CHECK]: " + JSON.stringify(result));
                if (result.HasError) {
                    layer.msg(result.Message);
                    setTimeout(checkTicket, preRequestInterval);
                }
                else {
                    switch (result.ErrorCode) {
                        case "wait":
                            setTimeout(checkTicket, preRequestInterval);
                            break;
                        case "fail":
                            layer.msg(result.Message);
                            break;
                        case "success":
                            window.location.href = result.ReturnObject;
                            break;
                    }
                }
            },
            error: function(err) {
                layer.msg("刷新试试？");
            }
        });
    }

    function addTicket() {
        updateTitleMessage("切爆中");

        var preRequestInterval = 10000;

        $.ajax({
            url: ADD_TICKET_URL,
            type: "post",
            dataType: "json",
            data: ticket,
            success: function(result) {
                console.log("[ADD]: " + JSON.stringify(result));
                if (result.HasError) {
                    layer.msg(result.Message);
                    setTimeout(addTicket, preRequestInterval);
                }
                else {
                    if (result.Message == "success") {
                        window.location.href = result.ReturnObject;
                    }
                    else {
                        setTimeout(checkTicket, 100);
                    }
                }
            },
            error: function(err) {
                layer.msg("刷新试试？");
            }
        });
    }

    function getTicket() {
        switch (mode) {
            case 0:
                countdown();
                break;
            case 1:
                checkAvailable();
                break;
            default:
                break;
        }
    }

    getTicket();

})();