// ==UserScript==
// @name         Steam Blocked Helper
// @name:zh-CN   Steam队列锁区辅助
// @namespace    https://store.steampowered.com/agecheck/app/*
// @version      0.3.3
// @description  Add action buttons to the blocked games and remove them from the queue
// @description:zh-CN 为锁区的游戏添加按钮选项并从队列中移除
// @author       wweeiiyyiinn
// @match        https://store.steampowered.com/agecheck/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376180/Steam%20Blocked%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/376180/Steam%20Blocked%20Helper.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function createElement(tag, attr){
        var elm = document.createElement(tag);
        Object.keys(attr||{}).forEach(function(i){elm[i] = attr[i];});
        return elm;
    }
    function load_script(){
        var gamejs = createElement('script', {type: "text/javascript", src: "https://steamstore-a.akamaihd.net/public/javascript/game.js"});
        document.head.appendChild(gamejs);
        function loadcss(href){
            var css = createElement('link', {rel:'stylesheet', type:'text/css', href: href});
            document.head.appendChild(css);
        }
        loadcss('https://steamstore-a.akamaihd.net/public/css/v6/game.css');
        loadcss('https://steamstore-a.akamaihd.net/public/shared/css/buttons.css');
    }
    function add_actions(){
        function init() {
            if (window.InitQueueControls && document.getElementById('add_to_wishlist_area')){
                window.InitQueueControls(Number(appid), Number(appid), 955560, '1_5_9_');
            } else {
                setTimeout(init, 50);
            }
        }
        init();
    }
    function check_wishlist(){
        var wishlist = createElement('html');
        window.jQuery.get("https://store.steampowered.com/wishlist/", function(data){
            var listJson = data.match(/var g_rgWishlistData = (\[[^\]]+\])/)[1];
            var re = new RegExp('"appid":'+appid+',');
            if (listJson.match(re)) {
                $JFromIDOrElement('add_to_wishlist_area').hide();
                $JFromIDOrElement('add_to_wishlist_area_success').show();
            }
        });
    }
    function add_UI(appid){
        function get_cn_buttons(){
            return ('<div class="queue_ctn "><div class="queue_actions_ctn">' +
                '<a href="https://store.steampowered.com/explore/" class="btnv6_blue_hoverfade  btn_medium  right" data-tooltip-text="查看和定制您个性化的探索队列。">' +
                    '<span>查看您的队列&nbsp;&nbsp;&nbsp;<i class="ico16 arrow_next"></i></span>' +
                '</a>' +
                '<div id="add_to_wishlist_area">' +
                    '<a class="btnv6_blue_hoverfade btn_medium" href="javascript:AddToWishlist( appid, \'add_to_wishlist_area\', \'add_to_wishlist_area_success\', \'add_to_wishlist_area_fail\', \'1_5_9__407\' );" data-tooltip-text="在您愿望单中的物品正式发布或特价销售时获取邮件通知">' +
                        '<span>添加至您的愿望单</span>' +
                    '</a>' +
                '</div>' +
                '<div id="add_to_wishlist_area_success" style="display: none;">' +
                    '<a href="https://store.steampowered.com/wishlist/" class="btnv6_blue_hoverfade btn_medium queue_btn_active" data-tooltip-text="该产品已在您的愿望单中。点击查看您的愿望单。">' +
                        '<span><img src="https://steamstore-a.akamaihd.net/public/images/v6/ico/ico_selected.png" border="0">已在愿望单中</span>' +
                    '</a>' +
                '</div>' +
                '<div id="add_to_wishlist_area_fail" style="display: none;"><b>哎呀，很抱歉！</b></div>' +
                '<div class="queue_control_button queue_btn_follow">' +
                    '<div class="btnv6_blue_hoverfade btn_medium queue_btn_inactive" style="" data-tooltip-text="关注此物品，在您的社区活动信息中查看通知。"><span>关注</span></div>' +
                    '<div class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="display: none;"><span><img src="https://steamstore-a.akamaihd.net/public/images/v6/ico/ico_selected.png" border="0"> 正在关注</span></div>' +
                '</div>'  +
                '<div class="queue_control_button queue_btn_ignore">' +
                    '<div class="btnv6_blue_hoverfade  btn_medium queue_btn_inactive" style="" data-tooltip-text="已忽略的产品将不会推荐给您，也不会出现在精选区域。"><span>忽略</span></div>' +
                    '<div class="btnv6_blue_hoverfade  btn_medium queue_btn_active" style="display: none;" data-tooltip-text="已忽略的产品将不会推荐给您，也不会出现在精选区域。"><span><img src="https://steamstore-a.akamaihd.net/public/images/v6/ico/ico_selected.png" border="0"> 已忽略</span></div>' +
                '</div>' +
                '<div style="clear: both;"></div>' +
                '<a class="btnv6_blue_hoverfade btn_medium steamdb_ico" target="_blank" href="https://steamdb.info/app/appid/"><span>查看 Steam Database</span></a>' +
            '</div></div>');
        }
        function get_en_buttons(){
            return ('<div class="queue_ctn "><div class="queue_actions_ctn">' +
                '<a href="https://store.steampowered.com/explore/" class="btnv6_blue_hoverfade  btn_medium  right" data-tooltip-text="View and customize your personal Discovery Queue.">' +
                    '<span>View Your Queue&nbsp;&nbsp;&nbsp;<i class="ico16 arrow_next"></i></span>' +
                '</a>' +
                '<div id="add_to_wishlist_area">' +
                    '<a class="btnv6_blue_hoverfade btn_medium" href="javascript:AddToWishlist( appid, \'add_to_wishlist_area\', \'add_to_wishlist_area_success\', \'add_to_wishlist_area_fail\', \'1_5_9__407\' );" data-tooltip-text="Get notified by email when your wishlisted items get released or are on sale">' +
                        '<span>Add to your wishlist</span>' +
                    '</a>' +
                '</div>' +
                '<div id="add_to_wishlist_area_success" style="display: none;">' +
                    '<a href="https://store.steampowered.com/wishlist/" class="btnv6_blue_hoverfade btn_medium queue_btn_active" data-tooltip-text="This product is already on your wishlist. Click to view your wishlist.">' +
                        '<span><img src="https://steamstore-a.akamaihd.net/public/images/v6/ico/ico_selected.png" border="0">On Wishlist</span>' +
                    '</a>' +
                '</div>' +
                '<div id="add_to_wishlist_area_fail" style="display: none;"><b>Oops, sorry!</b></div>' +
                '<div class="queue_control_button queue_btn_follow">' +
                    '<div class="btnv6_blue_hoverfade btn_medium queue_btn_inactive" style="" data-tooltip-text="Follow this item to see announcements in your community activity feed."><span>Follow</span></div>' +
                    '<div class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="display: none;"><span><img src="https://steamstore-a.akamaihd.net/public/images/v6/ico/ico_selected.png" border="0"> Following</span></div>' +
                '</div>' +
                '<div class="queue_control_button queue_btn_ignore">' +
                    '<div class="btnv6_blue_hoverfade  btn_medium queue_btn_inactive" style="" data-tooltip-text="Ignored titles will not be recommended to you and will not appear in featured areas."><span>Ignore</span></div>' +
                    '<div class="btnv6_blue_hoverfade  btn_medium queue_btn_active" style="display: none;" data-tooltip-text="Ignored titles will not be recommended to you and will not appear in featured areas."><span><img src="https://steamstore-a.akamaihd.net/public/images/v6/ico/ico_selected.png" border="0"> Ignored</span></div>' +
                '</div>' +
                '<div style="clear: both;"></div>' +
                '<a class="btnv6_blue_hoverfade btn_medium steamdb_ico" target="_blank" href="https://steamdb.info/app/appid/"><span>View in Steam Database</span></a>' +
            '</div></div>');
        }
        function add_buttons(){
            var buttonsHTML;
            if (document.children[0].lang === 'zh-cn') {
                buttonsHTML = get_cn_buttons();
            } else {
                buttonsHTML = get_en_buttons();
            }
            var buttons = createElement('div', {classList: ['queue_overflow_ctn'], innerHTML: buttonsHTML.replace(/appid/g, appid)});
            box.style.paddingBottom = '0px';
            content.appendChild(buttons);
        }
        function add_header_img(){
            var headerImg = createElement('img', {src: 'https://steamcdn-a.akamaihd.net/steam/apps/appid/header.jpg'.replace('appid', appid)});
            content.appendChild(headerImg);
        }
        var box = document.getElementById('error_box');
        var content = box.parentElement;
        if (isLogin) {
            load_script();
            add_buttons();
            add_actions();
            check_wishlist();
        }
        add_header_img();
    }
    function remove_from_queue(appid){
        window.jQuery.post("/app/7", { sessionid: window.g_sessionID, appid_to_clear_from_queue: appid });
    }
    if (!document.title.match(/Steam/)){
        var appid = location.href.match(/\/app\/(\d+)\//)[1];
        var isLogin = Boolean(document.getElementById('account_pulldown'));
        if (isLogin){
            remove_from_queue(appid);
        }
        add_UI(appid);
    }
})();