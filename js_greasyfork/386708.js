// ==UserScript==
// @name        虎牙直播界面简化(可自定义)
// @namespace   http://tampermonkey.net/
// @version     1.0.1
// @description 移除虎牙直播界面不必要元素，包括广告、动态、送礼物、开贵族等功能，可屏蔽所有消费功能，尽情白嫖吧！
// @author      天妒嘤才
// @match       *://*.huya.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/386708/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96%28%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%29.user.js
// @updateURL https://update.greasyfork.org/scripts/386708/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96%28%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    var appendedCss = '.room-chat-tool-uisettings{display:inline-block;width:22px;height:22px;margin-top:1px;\
        background:url(https://a.msstatic.com/huya/main3/assets/img/header/sprite/sub_icon_adda9.png);}\
        .setting-des{padding: 2px 0 0 14px;color: #999;}.room-ui-setting{padding:0 80px 5px 0;}';

    // 0表示隐藏，1表示显示，第二个参数为默认值
    // 消费、充值及礼物相关
    var consume_related = GM_getValue('huya_consume', 0);
    if (consume_related == 0) {
        appendedCss += '.player-gift-right,.player-face,.tv-icon,.gift-box-icon,.open-souhu,\
        .vipSeat-buy,.ucard-ft,#my_estate,.mod-wode-tequan,.u-assets,.ship-icon,.guess-icon,.gift-invent-icon{display:none !important}';
    }

    // 广告
    var advertisment = GM_getValue('huya_ads', 0);
    if (advertisment == 0) {
        appendedCss += '.room-mod-ggTop,.gg-slider,.banner-ab-warp,.ab-icon{display:none !important}';
    }

    // 我要上电视弹幕
    var ontv = GM_getValue('huya_ontv', 0);
    if (ontv == 0) {
        appendedCss += '.msg-onTVLottery{display:none !important}';
    }

    // 底部热门动态和主播动态
    var bottom_moments = GM_getValue('huya_bottom_moments', 0);
    if (bottom_moments == 0) {
        appendedCss += '.guide-playbill,.room-moments,.room-backToTop{display:none !important}';
    }
    // 底部猜你喜欢
    var bottom_youlike = GM_getValue('huya_bottom_youlike', 0);
    if (bottom_youlike == 0) {
        appendedCss += '.room-youlike,.room-backToTop{display:none !important}';
    }
    // 页面其它元素
    var others = GM_getValue('huya_others', 0);
    if (others == 0) {
        appendedCss += '.share-entrance,.illegal-report,.hy-nav-kaibo,.hy-nav-download,.wrap-income,\
        #week-star-btn,.jump-to-phone,.sidebar-banner,.hy-side,.diy-activity-icon-0,.diy-activity-icon-1{display:none !important}';
    }

    loadStyle(appendedCss);

    function loadStyle(css) {
        var style = document.createElement('style')
        style.type = 'text/css'
        style.rel = 'stylesheet'
        style.appendChild(document.createTextNode(css))
        var head = document.getElementsByTagName('head')[0]
        head.appendChild(style)
    }

    $(".tool-info .num").text("0.00");

    var uisettings = setInterval(function () {
        if ($('.room-chat-tools') && $('.chat-room__ft')) {
            window.clearInterval(uisettings);

            var settinghtml = '<i class="room-chat-tool room-chat-tool-uisettings" id="J-room-chat-uisettings" title="界面设置"></i>';
            $('.room-chat-tools').append(settinghtml);
            $('.chat-room__ft').append(ui_setting_html);

            $(".room-chat-tool-uisettings").click(function () {
                if ($("#uisetting_pannel").css("display") == "none") {
                    $("#uisetting_pannel").css("display", "block");
                }
                else {
                    $("#uisetting_pannel").css("display", "none");
                }
            });

            // 消费
            $(".show_consume").click(function () {
                var consume_related = GM_getValue('huya_consume', 0);
                if (consume_related == 1) {
                    GM_setValue('huya_consume', 0);
                    $(".show_consume").removeClass('checked');
                }
                else {
                    GM_setValue('huya_consume', 1);
                    $(".show_consume").addClass('checked');
                }
            });
            // 广告
            $(".show_ads").click(function () {
                var advertisment = GM_getValue('huya_ads', 0);
                if (advertisment == 1) {
                    GM_setValue('huya_ads', 0);
                    $(".show_ads").removeClass('checked');
                }
                else {
                    GM_setValue('huya_ads', 1);
                    $(".show_ads").addClass('checked');
                }
            });
            // 我要上电视弹幕
            $(".show_ontv").click(function () {
                var ontv = GM_getValue('huya_ontv', 0);
                if (ontv == 1) {
                    GM_setValue('huya_ontv', 0);
                    $(".show_ontv").removeClass('checked');
                }
                else {
                    GM_setValue('huya_ontv', 1);
                    $(".show_ontv").addClass('checked');
                }
            });
            // 动态
            $(".show_moments").click(function () {
                var bottom_moments = GM_getValue('huya_bottom_moments', 0);
                if (bottom_moments == 1) {
                    GM_setValue('huya_bottom_moments', 0);
                    $(".show_moments").removeClass('checked');
                }
                else {
                    GM_setValue('huya_bottom_moments', 1);
                    $(".show_moments").addClass('checked');
                }
            });
            // 猜你喜欢
            $(".show_youlike").click(function () {
                var bottom_youlike = GM_getValue('huya_bottom_youlike', 0);
                if (bottom_youlike == 1) {
                    GM_setValue('huya_bottom_youlike', 0);
                    $(".show_youlike").removeClass('checked');
                }
                else {
                    GM_setValue('huya_bottom_youlike', 1);
                    $(".show_youlike").addClass('checked');
                }
            });
            // 页面其它元素
            $(".show_others").click(function () {
                var others = GM_getValue('huya_others', 0);
                if (others == 1) {
                    GM_setValue('huya_others', 0);
                    $(".show_others").removeClass('checked');
                }
                else {
                    GM_setValue('huya_others', 1);
                    $(".show_others").addClass('checked');
                }
            });
        }
    }, 200);

    var ui_setting_html = `<div class="room-panel room-panel-shield room-ui-setting" id="uisetting_pannel" style="display: none;">
            <i class="room-panel-arrow"></i>
            <div class="room-panel-hd">
                <h2 class="room-panel-title">显示设置</h2>
            </div>
            <div class="room-panel-hd">
                <div class="shield-options">
                <ul>
                    <li class="show_consume ${consume_related == 0 ? '' : 'checked'}"><i></i>显示消费相关</li>
                    <li class="show_ads ${advertisment == 0 ? '' : 'checked'}"><i></i>显示广告</li>
                    <li class="show_ontv ${ontv == 0 ? '' : 'checked'}"><i></i>显示"我要上电视"弹幕</li>
                    <li class="show_moments ${bottom_moments == 0 ? '' : 'checked'}"><i></i>显示底部动态</li>
                    <li class="show_youlike ${bottom_youlike == 0 ? '' : 'checked'}"><i></i>显示底部猜你喜欢</li>
                    <li class="show_others ${others == 0 ? '' : 'checked'}"><i></i>显示页面其它元素</li>
                </ul>
                </div>
            </div>
            <p class="setting-des">刷新后生效</p>
        </div>`;
})();