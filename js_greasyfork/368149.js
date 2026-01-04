// ==UserScript==
// @name         抢你麻痹票2
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://show.bilibili.com/*
// @grant        GM.xmlHttpRequest
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/368149/%E6%8A%A2%E4%BD%A0%E9%BA%BB%E7%97%B9%E7%A5%A82.user.js
// @updateURL https://update.greasyfork.org/scripts/368149/%E6%8A%A2%E4%BD%A0%E9%BA%BB%E7%97%B9%E7%A5%A82.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log(Date.parse(new Date()) / 1000);

    var global_cookie = document.cookie;
    //var global_cookie = 'finger=edc6ecda; CURRENT_QUALITY=112; buvid3=5A13F80B-4D4B-4F17-B26B-0C854F699756103067infoc; rpdid=ikxwwwqwsdosixxiwwqw; DedeUserID=7618; DedeUserID__ckMd5=30a75514697d25b9; SESSDATA=6f850699%2C1529558287%2Cb12b84cb; bili_jct=6fb5a20721e965b6d62a69cb52069e5c; LIVE_BUVID=d873311a3facb1995f6f02c15bcec660; LIVE_BUVID__ckMd5=3e837f7971144794; sid=ij0zcfab; from=pc; _dfcaptcha=f9dd640176adafc057ec67280e920f51; Hm_lvt_909b6959dc6f6524ac44f7d42fc290db=1527485546,1527486240,1527511898,1527558546; canvasFp=f5ae5021b7fff5ba826399b489450a17; webglFp=d5f434e21a0d594de522444e8efb14cf; screenInfo=1920*1080*24; feSign=b4446cd7a957fa2fe912223bfd0c67b1; payParams=%7B%22createIp%22%3A%2214.17.22.37%22%2C%22customerId%22%3A10001%2C%22defaultChoose%22%3A%22wechat%22%2C%22deviceType%22%3A1%2C%22feeType%22%3A%22CNY%22%2C%22notifyUrl%22%3A%22http%3A//show.bilibili.co/api/ticket/order/payNotify%22%2C%22orderCreateTime%22%3A%221527560867000%22%2C%22orderExpire%22%3A600%2C%22orderId%22%3A%22100000008682449%22%2C%22originalAmount%22%3A128000%2C%22payAmount%22%3A127000%2C%22productId%22%3A11207%2C%22productUrl%22%3A%22https%3A//show.bilibili.com/platform/detail.html%3Fid%3D12627%22%2C%22returnUrl%22%3A%22https%3A//show.bilibili.com/orderlist%22%2C%22serviceType%22%3A0%2C%22showContent%22%3A%22%u7968%u52A1_2018%u56FD%u98CE%u97F3%u4E50%u76DB%u5178_2018-05-29%2010%3A27%3A47_1270%22%2C%22showTitle%22%3A%22bilibili%u7968%u52A1%22%2C%22signType%22%3A%22MD5%22%2C%22timestamp%22%3A%221527560867793%22%2C%22traceId%22%3A3427413455%2C%22version%22%3A%221.0%22%2C%22sign%22%3A%22ab693079310d3be272bdb1dd11cbb059%22%7D; fts=1527561084; Hm_lpvt_909b6959dc6f6524ac44f7d42fc290db=1527562511';


    var global_buyer_info = {"id":58505,"uid":7618,"personal_id":"","name":"尹修远","id_card_front":"","id_card_back":"","is_default":1,"tel":"18565658159"};
    var global_deliver_info = {"name":"尹修远","tel":"18565658159","addr_id":139047,"addr":"广东省深圳市南山区科苑路15号科兴科学园C1栋"};

    $(".product-buy-wrapper").append('<a id="getTick" href="javascript:;" style="width:100px;text-align:center;display:inline-block;line-height:50px;background:#118ef7;color:#fff;">抢票</a>');

    $(".product-buy-wrapper").append('<div id="console-inform" style="position:fixed;width:300px;height:300px;top:0;z-index:8888;margin:auto;left:0;right:0;background:#fff;border:1px solid #000"></div>');

function get_some_seats(project_id, screen_id, price) {
    var dtd = $.Deferred();
    $.ajax({
        "async": true,
        "crossDomain": false,
        "url": "/api/ticket/place/get",
        "method": "GET",
        "data": {
            "project_id": project_id,
            "screen_id": screen_id,
            "timestamp": (new Date().getTime()),
        }
    }).done(function(response) {
        var test_data = response;
        if (+response.errno != 0) {
            console.log('get area error=', +response.errno);
            dtd.reject();
            return;
        }

        var new_data = test_data["data"];
        var ticket_area = new_data["ticket_area"];
        var target_ticket = {};
        $.each(ticket_area, function(idx, cur_obj) {
            if (cur_obj["price"] == price) {
                target_ticket = cur_obj;
            }
        });

        var available_area = new_data["available_area"];
        var available_set = {};
        var target_ticket_area = target_ticket["area"];

        $.each(available_area, function(idx, cur_data) {
            available_set[cur_data] = 1;
        });

        var real_available_area = [];

        $.each(target_ticket_area, function(idx, cur_data) {
            if (typeof (available_set[cur_data]) != 'undefined') {
                real_available_area.push(cur_data);
            }
        });

        console.log(real_available_area);
        console.log(target_ticket);
        dtd.resolve(real_available_area, target_ticket, screen_id);
    }).fail(function() {
        console.log('get  area failed');
        dtd.reject();
    });

    return dtd.promise();
}

function getSeatsName(seats_dict, row, col) {
    var key = `${row}_${col}`;
    if (typeof (seats_dict[key] != 'undefined')) {
        var name = seats_dict[key].replace('-', '排');
        return name + '号';
    } else {
        return '';
    }
}

function get_available_seats(screen_id, area_id, count) {
    var dtd = $.Deferred();

    if (+count <= 0 || +area_id <= 0) {
        dtd.reject();
        return dtd.promise();
    }

    console.log(`Now get [${+area_id}] area, [${+count}] tickets`);

    $.ajax({
        "async": true,
        "crossDomain": false,
        "url": "/api/ticket/area/seat",
        "method": "GET",
        "data": {
            "area_id": +area_id,
            "screen_id": +screen_id,
            "timestamp": (new Date().getTime()),
        }
    }).done(function(response) {
        if (+response.errno != 0) {
            console.log('get seat error=', +response.errno)
            dtd.reject();
            return;
        }

        var test_new_data = response["data"];
        var unavailable_seats_set = {};
        $.each(test_new_data['unavailable'], function(idx, cur_data) {
            unavailable_seats_set[cur_data] = 1;
        });

        var get_counts = 4;
        var seats_map = test_new_data["seats"];

        var seats_in_order = [];
        var seats_name_dict = test_new_data['seatsName'];

        $.each(seats_name_dict, function(key, cur_data) {
            seats_in_order.push(key);
        });

        seats_in_order.sort(function(a, b) {
            var data_list_a = a.split('_');
            var row_a = +data_list_a[0];
            var col_a = +data_list_a[1];

            var data_list_b = b.split('_');
            var row_b = +data_list_b[0];
            var col_b = +data_list_b[1];

            if (row_a == row_b) {
                return col_a - col_b;
            } else {
                return row_a - row_b;
            }
        });

        var seat_codes = [];

        $.each(seats_in_order, function(idx, key) {
            var data_list = key.split('_');
            var row = +data_list[0];
            var col = +data_list[1];
            if (typeof (unavailable_seats_set[key]) == 'undefined' && seats_map[row][col] == 'e') {
                seat_codes.push(`${area_id}_${row}_${col}`);
                console.log(`Got ${getSeatsName(seats_name_dict, row, col)}`);
                if (seat_codes.length >= get_counts) {
                    return false;
                }
            }
        });

        console.log(seat_codes);
        dtd.resolve(seat_codes);
    }).fail(function() {
        console.log('get seat failed');
        dtd.reject();
    });

    return dtd.promise();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ticketClock(project_id, screen_id, sku_id, seat_codes, price) {
    var level = window.tickect_desc;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/api/ticket/order/prepare",
        "method": "POST",
        "data": {
            "project_id": project_id,
            "screen_id": screen_id,
            "order_type": "1",
            "count": seat_codes.length,
            "sku_id": sku_id,
            "seats": JSON.stringify(seat_codes)
        }
    };

    console.log('before create');
    await sleep(3000);
    console.log('now create');

    $.ajax(settings).done(function(response) {
        var token = response.data.token;
        var request_str =  $.param({
                "project_id": project_id,
                "screen_id": screen_id,
                "count": seat_codes.length,
                "order_type": "1",
                "pay_money": price * seat_codes.length,
                "timestamp": (new Date().getTime()),
                 "deliver_info": JSON.stringify(global_deliver_info),
                "buyer_info": JSON.stringify(global_buyer_info),
                "sku_id": sku_id,
                "seats": JSON.stringify(seat_codes)
            });
        console.log(`request str=[${request_str}`);
        console.log(global_cookie);
        var referer_str = `https://show.bilibili.com/platform/confirmOrder.html?token=${token}&project_id=${project_id}`;

        GM.xmlHttpRequest({
            method: "POST",
            url: "/api/ticket/order/createV2",
            headers: {
                referer: referer_str,
                "content-type": "application/x-www-form-urlencoded",
                "user-agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
                'cookie' : global_cookie
            },
            data : request_str,
            onload: function(xhr) {
                var r = xhr.responseText;
                console.log(r);
            }
        });

    });
}

function getTicket() {
    var project_id = 12627;
    var screen_id = 3463;
    get_some_seats(project_id, screen_id, 128000).done(function(real_available_area, target_ticket, screen_id) {
        if (real_available_area.length <= 0) {
            console.log('no area available');
            return;
        }

        var sku_id = target_ticket.id;
        var price = target_ticket.price;

        get_available_seats(screen_id, real_available_area[0], 4).done(function(seat_codes) {
            ticketClock(project_id, screen_id, sku_id, seat_codes, price);
        }).fail(function() {
            console.log('get_available_seats failed');
        });

    }).fail(function() {
        console.log('get_some_seats failed');
    });
}

    $(document).on("click", "#getTick", function () {
        getTicket();
    });

    // Your code here ...
})();