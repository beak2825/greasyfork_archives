// ==UserScript==
// @name         Bilibili直播小红包自动兑换|2018春节活动进击的汪酱
// @namespace    https://greasyfork.org/users/155548
// @version      0.5
// @description  定时获取奖池情况，自动兑换物品
// @match        http://api.live.bilibili.com/exchange2
// @require		 https://code.jquery.com/jquery-3.2.1.min.js
// @icon		 https://static.hdslb.com/images/favicon.ico
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/37661/Bilibili%E7%9B%B4%E6%92%AD%E5%B0%8F%E7%BA%A2%E5%8C%85%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2%7C2018%E6%98%A5%E8%8A%82%E6%B4%BB%E5%8A%A8%E8%BF%9B%E5%87%BB%E7%9A%84%E6%B1%AA%E9%85%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/37661/Bilibili%E7%9B%B4%E6%92%AD%E5%B0%8F%E7%BA%A2%E5%8C%85%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2%7C2018%E6%98%A5%E8%8A%82%E6%B4%BB%E5%8A%A8%E8%BF%9B%E5%87%BB%E7%9A%84%E6%B1%AA%E9%85%B1.meta.js
// ==/UserScript==

(function() {

    //不兑换id列表
    var _black_list = ["gift-113", "danmu-gold", "stuff-3"];

    //头衔的最大兑换红包单价
    var title_max = 1001;

    //礼物的最大兑换红包单价(常见灯笼15喵娘233B坷拉450)
    var gift_max = 500;

    //经验石的最大兑换红包单价(原石15曜石233贤者1888)
    var stuff_max = 500;

    //所有物品的兑换最大数量(为保证能够抢到，一次只兑换一个(因为写多了一个也换不到)，分多次同时兑换。如果兑换太过频繁有封禁IP的风险，请不要填写过大的上限数量)
    var all_max = 5;

    //刷新间隔(秒)，默认1秒获取一次当前奖池情况
    var timer = 1;

    //刷新奖池的浏览器右下角通知，1为通知，其他值则不通知
    var notice = 1;


    //看到这里就可以了，没有需要改动的了

    var title = new RegExp('title-'),
        gift = new RegExp('gift-'),
        stuff = new RegExp('stuff-');

    var _owned_badge = [];

    $.get('http://api.live.bilibili.com/i/api/ajaxTitleInfo?normal=0&special=0&keyword=&had=1&page=1&pageSize=130',
    function(data) {
        $.each(data.data.list,
        function(i, e) {
            _owned_badge.push(e.id + '');
        });
    });
    var info;
    var times = 0,
    dif_times = 0,
    sub_total = 0,
    success_count = 0,
    red_bag_num = '-',
    _extra = '';
    $('title').html('自动换红包');
    $('.error-container').html('<input class=_refresh value="开始" type=button /> 已获取 <font style="font-size:18px;" class=_times>' + times + '</font> 次。 期间奖池刷新了 <font style="font-size:18px;" class=dif_times>' + dif_times + '</font> 次。 提交了 <font style="font-size:18px;" class=sub_total>' + sub_total + '</font> 次兑换请求。 其中成功兑换了 <font style="font-size:18px;color:#0eff0a" class=success_count>' + success_count + '</font> 次。 剩余红包 <font style="font-size:18px;color:#ff0a0a" class=red_bag_num>' + red_bag_num + '</font> 个<p>-------------------------------------------------</p><p>当前奖池（第 <font class="_round">-</font> 轮）<font class="_time"></font>：</p><p style="color:#ff2ee5" class=_info></p><p>-------------------------------------------------</p><p>兑换记录：</p>');
    $('.error-container').on('click', '._refresh',
    function() {
        window.t1 = self.setInterval(function() {
            _start();
        },
        timer * 1000);
        $(this).removeClass('_refresh').addClass('_stop');
        $(this).val('停止');
    });
    $('.error-container').on('click', '._stop',
    function() {
        window.clearInterval(window.t1);
        $(this).removeClass('_stop').addClass('_refresh');
        $(this).val('继续');
    });
    function _start() {
        $.get('http://api.live.bilibili.com/activity/v1/NewSpring/redBagPool?_=' + Date.now(),
        function(data) {
            info = '';
            times++;
            $.each(data.data.pool_list,
            function(i, e) {
                _extra = '';
                if ($.inArray(e.award_id, _black_list) < 0) {
                    if (title.test(e.award_id)) {
                        if (e.price < title_max) {
                            var title_id = e.award_id.replace(title, '');
                            if ($.inArray(title_id, _owned_badge) < 0) {
                                _extra = '[未拥有]';
                                if (e.stock_num > 0) {
                                    if ($('._round').html() != data.data.round) {submit(e.award_id, 1, e.award_name, 1);}
                                }
                            } else {
                                _extra = '[已拥有]';
                            }
                        }
                    } else if (gift.test(e.award_id)) {
                        if (e.price < gift_max) {
                            var n = Math.min(e.stock_num, e.exchange_limit, e.user_exchange_count, all_max);
                            if (e.stock_num > 0) {
                                if ($('._round').html() != data.data.round) {submit(e.award_id, n, e.award_name, 1);}
                            }
                        }

                    } else if (stuff.test(e.award_id)) {
                        if (e.price < stuff_max) {
                            var n = Math.min(e.stock_num, e.exchange_limit, e.user_exchange_count, all_max);
                            if (e.stock_num > 0) {
                                if ($('._round').html() != data.data.round) {submit(e.award_id, n, e.award_name, 1);}
                            }
                        }
                    }
                }
                info += '(剩余:' + e.stock_num + ')' + e.award_name + _extra + '<br>';
            });
            var now = new Date(),
            h = now.getHours(),
            m = now.getMinutes(),
            s = now.getSeconds();
            $('._time').html('[' + h + ':' + m + ':' + s + ']');
            $('._times').html(times);
            if ($('._round').html() != data.data.round && $('._round').html() != '-') {
                dif_times++;
                $('.dif_times').html(dif_times);
                if (notice == 1) {
                    GM_notification('奖池刷新了，快去看看抢到了什么吧！', '小红包自动兑换提醒', 'https://static.hdslb.com/images/favicon.ico');
                }
                $('.error-container').append('[' + h + ':' + m + ':' + s + '] <p style="color:#0a83ff">检测到奖池刷新！</p>');
            }
            $('._info').html(info);
            $('.red_bag_num').html(data.data.red_bag_num);
            $('._round').html(data.data.round);
        });
    }

    function submit(a, b, c, d) {
        var now = new Date(),
        h = now.getHours(),
        m = now.getMinutes(),
        s = now.getSeconds();
        $('.error-container').append('<p>[' + h + ':' + m + ':' + s + '] 发起兑换请求，' + c + '(ID:' + a + ') x ' + d + '个(根据可兑换数量共' + b + '次请求)</p>');
        sub_total+=b;
        $('.sub_total').html(sub_total);
        for (var i = 0; i < b; i++) {
            $.get('http://api.live.bilibili.com/activity/v1/NewSpring/redBagExchange?award_id=' + a + '&exchange_num=' + d,
            function(data) {
                if (data.code == 0) {
                    $('.error-container').append('<p style="color:#0eff0a">[' + h + ':' + m + ':' + s + '] 成功兑换' + c + '(ID:' + a + ')(' + d + '个) 剩余' + data.data.red_bag_num + '红包</p>');
                    success_count++;
                    $('.success_count').html(success_count);
                    if (title.test(a)) {
                        var z = e.award_id.replace(title, '');
                        _owned_badge.push(z + '');
                    }
                } else {
                    $('.error-container').append('<p style="color:#ff860a">[' + h + ':' + m + ':' + s + '] ' + data.message + '(' + c + '(ID:' + a + '))</p>');
                }
            });
        }
    }
})();