// ==UserScript==
// @name				【已失效】B站直播硬币兑换瓜子翻倍|Bilibili直播
// @name:zh-TW			【已失效】B站直播硬幣兌換瓜子翻倍|Bilibili直播
// @version				0.99999999
// @description			（注意可能已经失效）通过旧兑换接口，获得双倍银瓜子(1:900)(老爷1:1000)，每日上限10(老爷20)硬币，配合700:1换硬币，刷瓜子
// @description:zh-TW	（注意可能已经失效）通過舊兌換介面，獲得雙倍銀瓜子(1:900)(老爷1:1000)，每日上限10(老爷20)硬幣，配合700:1換硬幣，刷瓜子
// @author				QHS
// @match				*://live.bilibili.com/exchange
// @require				https://code.jquery.com/jquery-3.2.1.min.js
// @grant				GM_addStyle
// @icon				https://live.bilibili.com/favicon.ico
// @supportURL			https://greasyfork.org/scripts/37085/
// @supportURL 			https://steamcommunity.com/profiles/76561198132556503
// @namespace			https://greasyfork.org/users/155548
// @downloadURL https://update.greasyfork.org/scripts/37085/%E3%80%90%E5%B7%B2%E5%A4%B1%E6%95%88%E3%80%91B%E7%AB%99%E7%9B%B4%E6%92%AD%E7%A1%AC%E5%B8%81%E5%85%91%E6%8D%A2%E7%93%9C%E5%AD%90%E7%BF%BB%E5%80%8D%7CBilibili%E7%9B%B4%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/37085/%E3%80%90%E5%B7%B2%E5%A4%B1%E6%95%88%E3%80%91B%E7%AB%99%E7%9B%B4%E6%92%AD%E7%A1%AC%E5%B8%81%E5%85%91%E6%8D%A2%E7%93%9C%E5%AD%90%E7%BF%BB%E5%80%8D%7CBilibili%E7%9B%B4%E6%92%AD.meta.js
// ==/UserScript==

!function() {
    function t(t, e) {
        $("body").prepend('<div class="center-tip-wrapper radius" style="box-shadow: #806363 7px 4px 10px;width: 350px; display: block; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%);"><div class="center-tip-content" style="width: 350px;"><div class="tip-close"></div><div class="exchange-popup-wrap"><h2>' + t + "</h2><p>" + e + '</p><a href="/" target="_blank" id="go-to-live">去看直播</a><input id="keep-here" type="button" value="留在当前页面"></div></div></div>');
    }
    var e = "2018年8月5日起无法兑换，可能b站已经关闭了这个兑换接口，感谢使用",ee=900;
    GM_addStyle(".highlight-double{color: #7dff7b;}.moresilver{font-size: 14px; text-align: center; height: 30px; line-height: 30px; border: none; padding: 0 33px!important; margin-top: 50px; border-radius: 15px; color: #fff; background-color: #7dff7b!important; cursor: pointer;margin-left: 10px;}"),
    $("#coin-to-silver-btn").after('<input type="button" value="双倍兑换 (900瓜子/硬币)" class="moresilver">'),
    $("#coin-to-silver-btn").val("单倍兑换"), $(".input-desc").html('单倍兑换将获得(<font class="coin-available">查询中</font>)： <span class="highlight"><em class="silver-num">0</em>银瓜子</span><br>双倍兑换将获得(每日最多使用<font class="ex-cap">10</font>硬币)： <span class="highlight-double"><em class="silver-num-double">0</em>银瓜子</span>'),
    $("p#coin-seed-desc").before('<p style=margin:0 class="desc">每日每个<span class="highlight">普通用户</span><span class="highlight-double">使用脚本</span>可以最多将10个硬币变成银瓜子，硬币兑换银瓜子比率为<span class="highlight-double">1硬币=900银瓜子</span>。</p><p style=margin:0 class="desc">每日每个<span class="highlight">老爷用户</span><span class="highlight-double">使用脚本</span>可以最多将20个硬币变成银瓜子，硬币兑换银瓜子比率为<span class="highlight-double">1硬币=1000银瓜子</span>。</p>'),
    $(".form-box").on("click", ".moresilver", function() {
        if ($("#coin-num").val() < 1 || $("#coin-num").val() > 20) return t("双倍兑换出错", "请输入正确的硬币数量"),
        !1;
        $.ajax({
            type: "post",
            url: "/exchange/coin2silver",
            data: {
                coin: $("#coin-num").val()
            },
            timeout: 8e3,
            complete: function(a, i) {
                "timeout" != i && "success" != i && t("双倍兑换出错", e), "timeout" == i && t("网络超时", "请检查网络后再试");
            },
            success: function(a) {
                a.hasOwnProperty("code") ? 0 == a.code ? (t("双倍兑换成功", '成功兑换<span class="highlight">' + a.data.silver + '</span>银瓜子，当前银瓜子数量：<font class="silver-ammount">查询中</font>'),
                $.ajax({
                    type: "get",
                    url: "//api.live.bilibili.com/pay/v1/Exchange/getStatus?platform=pc",
                    crossDomain: !0,
                    xhrFields: {
                        withCredentials: !0
                    },
                    timeout: 8e3,
                    complete: function(t, e) {},
                    success: function(t) {
                        $(".silver-ammount").html(t.data.silver + "，剩余硬币数量：" + t.data.coin + "。<a target=_blank href='https://account.bilibili.com/account/coin'>点击此处查看兑换记录</a>");
                    }
                })) : t("双倍兑换出错", a.msg + "。<a target=_blank href='https://account.bilibili.com/account/coin'>点击此处查看余额与兑换记录</a>") : t("双倍兑换出错", e);
            }
        });
    }), $.ajax({
        type: "get",
        url: "//api.live.bilibili.com/pay/v1/Exchange/getStatus?platform=pc",
        crossDomain: !0,
        xhrFields: {
            withCredentials: !0
        },
        timeout: 8e3,
        complete: function(t, e) {},
        success: function(t) {
            $(".coin-available").html("今日还可兑换" + t.data.coin_2_silver_left + "硬币"), 0 != t.data.vip && ($(".ex-cap").html("20"),
            $(".moresilver").val("双倍兑换 (1000瓜子/硬币)"),
            ee=1000);
        }
    }), $("body").on("click", ".tip-close", function() {
        $(".center-tip-wrapper.radius").remove();
    }), $("body").on("click", "#keep-here", function() {
        $(".center-tip-wrapper.radius").remove();
    }), $(".form-box-wrap").on("input propertychange", "#coin-num", function() {
        $(".silver-num-double").html(ee * $("#coin-num").val());
    });
}();