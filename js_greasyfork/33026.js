// ==UserScript==
// @name         淘宝众筹项目【OneCloud玩客云】抢购
// @namespace    http://oixm.cn/
// @version      1.0
// @description  实时监控第一个可支持的￥279项目并立即进入下订单页（抢购成功后进入支付页需要手动支付）
// @author       oixm
// @match        https://izhongchou.taobao.com/dreamdetail.htm?*id=20067780*
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33026/%E6%B7%98%E5%AE%9D%E4%BC%97%E7%AD%B9%E9%A1%B9%E7%9B%AE%E3%80%90OneCloud%E7%8E%A9%E5%AE%A2%E4%BA%91%E3%80%91%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/33026/%E6%B7%98%E5%AE%9D%E4%BC%97%E7%AD%B9%E9%A1%B9%E7%9B%AE%E3%80%90OneCloud%E7%8E%A9%E5%AE%A2%E4%BA%91%E3%80%91%E6%8A%A2%E8%B4%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 抢购器
    function OneCloud() {
        this.id = "20067780";                                               // 众筹产品 id
        this.price = 279;                                                   // 抢购价格
        this.startTime = new Date(2017, (9 - 1), 10, 10, 30, 0).getTime();  // 开启时间
        this.interval = 0;                                                  // 刷新间隔时间
        this.count = 0;                                                     // 抢购尝试次数
    }

    // 开始
    OneCloud.prototype.start = function() {
        this.getProductDetail(function(item) {
            this.buy(item);
        });
    };

    // 获取产品详情
    OneCloud.prototype.getProductDetail = function(callback) {
        var _this = this;
        $.ajax({
            url: "https://izhongchou.taobao.com/dream/ajax/getProjectForDetail.htm",
            dataType: "jsonp",
            data: {
                "id": this.id,
                "ac": ""
            },
            success: function(data) {
                var items = data.data.items;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    // 活动开启
                    if (parseFloat(item.price) == _this.price && item.can_buy) {
                        return callback.call(_this, item);
                    }
                }
                // 刷新
                _this.refresh();
                setTimeout(function() {
                    _this.getProductDetail(callback);
                }, _this.interval);
            }
        });
    };

    // 刷新
    OneCloud.prototype.refresh = function() {
        var now = new Date().getTime();
        var timespan = Math.abs(this.startTime - now);
        this.interval = timespan < 60000 ? 200 : (timespan < 600000 ? 1000 : 10000);  // 60 秒内快速刷新
        if (now >= this.startTime) {
            document.title = "抢购中(尝试" + (++this.count) + "次)";
        } else {
            document.title = "倒计时 " + this.formatTime(timespan);
        }
    };

    // 格式化时间
    OneCloud.prototype.formatTime = function(t) {
        var x = "";
        var h = 0, m = 0, s = 0;
        if (t < 60000) {
            s = parseInt(t / 1000);
            t -= (1000 * s);
            x = "00:" + (s < 10 ? "0" + s : s) + "." + t;
        } else {
            if (t >= 3600000) {
                h = parseInt(t / 3600000);
                t -= (3600000 * h);
                x += (h + "时");
            }
            m = parseInt(t / 60000);
            t -= (60000 * m);
            x += ((m < 10 ? "0" + m : m) + "分");
            s = parseInt(t / 1000);
            x += ((s < 10 ? "0" + s : s) + "秒");
        }
        return x;
    };

    // 购买
    OneCloud.prototype.buy = function(item) {
        document.title = "【抢购成功】";
        window.location = item.buy_url;
    };

    // Ready
    $(function() {
        new OneCloud().start();
    });

})();