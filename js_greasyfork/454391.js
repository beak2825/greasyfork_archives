// ==UserScript==
// @name         feishu_doc_sheet_finder
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  飞书文档Excel页签搜索框
// @author       dong.luo@happyelements.com
// @include      /^http[s]*:\/\/.*\.feishu\.cn\/sheets\/.*$/
// @include      /^http[s]*:\/\/.*\.feishu\.cn\/wiki\/.*$/
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454391/feishu_doc_sheet_finder.user.js
// @updateURL https://update.greasyfork.org/scripts/454391/feishu_doc_sheet_finder.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //==========================================
    // var $ = window.jQuery;
    var $ = window.jQuery.noConflict(true);

    // 注入样式
    $("body").append(genCssHtmlCode());

    // 开启定时检查
    setInterval(function() {
        // 初始化搜索框
        initSearchInput();
    }, 500);

    // 初始化输入框监听事件
    function initSearchInputListener() {
        $("#ld-feishu-doc-finder-text").unbind("input propertychange").bind("input propertychange", function (event) {
            var sheetMenuDiv = $(".all-sheet-list");
            if (!sheetMenuDiv || sheetMenuDiv.size() != 1) {
                return;
            }

            // var widthPx = $("#ld-feishu-doc-finder").css("width");
            // sheetMenuDiv.css({"width": widthPx});

            var searchVal = $(this).val();
            //console.log("search: "+searchVal)
            if (!searchVal) {
                //全部展现
                $('.sortable-sheet-item', sheetMenuDiv).show();
            } else {
                $('.sortable-sheet-item', sheetMenuDiv).each(function (i) {
                    var searchData = $(".sheet-name", $(this)).html();
                    var matched = searchData && searchData.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0;
                    if (matched) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }
        });
    }

    // 初始化搜索框
    function initSearchInput() {
        // 页签列表菜单div
        var sheetMenuDiv = $(".all-sheets-wrapper .all-sheet-list");
        if (!sheetMenuDiv || sheetMenuDiv.size() != 1) {

            // 模拟点击查找替换按钮（用来支持Ctrl+V）
            let findbarPanel = $(".findbar[data-sheet-element=sheet_findbar]");
            if(findbarPanel && findbarPanel.size() == 1) {
                if(!findbarPanel.hasClass("findbar_hidden") && findbarPanel.attr("ld-sheet-finder-flag") == "1"){
                    findbarPanel.attr("ld-sheet-finder-flag", "0").removeClass("ld-sheet-finder-hidden"); // 设置为显示、清除模拟点击标识
                    $("#sheet-find").click(); // 先关闭查找替换面板
                }
            }

            // 不需要处理
            return false;
        }

        // 初始化标识
        if (sheetMenuDiv.attr("ld-add-class-flag") == "1") {
            return false;
        }
        sheetMenuDiv.attr("ld-add-class-flag", "1");

        // 修正列表宽度
        sheetMenuDiv.css({"max-width": "100%"});
        $(".all-sheet-sortable-list", sheetMenuDiv).css({"max-width": "100%"});
        $(".sortable-sheet-item .sheet-name", sheetMenuDiv).css({"max-width": "100%"});

        // 注入HTML代码
        if ($("#ld-feishu-doc-finder").size() != 0) {
            return false;
        }
        $("div", sheetMenuDiv).eq(0).before(genFinderHtmlCode()); // 注入代码


        // 模拟点击查找替换按钮（用来支持Ctrl+V）
        let findbarPanel = $(".findbar[data-sheet-element=sheet_findbar]");
        if(findbarPanel && findbarPanel.size() == 1) {
            if(findbarPanel.hasClass("findbar_hidden")){
                $("#sheet-find").click(); // 先打开查找替换面板
                findbarPanel.attr("ld-sheet-finder-flag", "1").addClass("ld-sheet-finder-hidden"); // 设置为隐藏、标记为模拟点击
            }else {
                $("#findbar__find-input").focus(); // 查找替换面板在已经打开的状态先，让输入框获取焦点
            }
        }

        // 初始化输入框监听事件
        initSearchInputListener();

        // 扩展页签列表显示
        handlerSheetListExtraShow();

        // 返回
        return true;
    }

    function handlerSheetListExtraShow() {
        // 配置
        var extraShowConf = {
            // H5：配置总表【local/design1】
            "shtcnnjxBfNgfXAYAOoN3ETcM8f" : [
                // config_server.json
                {"gacha": "摇一摇活动","time_limit_gift": "限时礼包活动","h5_icon_settings": "活动图标显示配置","h5_shortcut_collect": "快捷收藏","product_wechatgame": "商品配置","product_qq_lightgame": "商品配置-QQ小游戏","product_oppo_quickgame": "商品配置-OPPO小游戏","product_baidu_lightgame": "商品配置-百度小游戏","product_allplatform": "全平台商品配置","goods": "商品清单配置","maxLevel": "最大关卡","compen":"公告配置","jigsaw":"拼图活动","coin_match":"金币大作战活动","goldMatch":"夺宝大冒险活动","game":"游戏通用配置","island":"岛屿配置","level_reward":"关卡奖励","wx_group_share":"加步数分享配置","grayscaleTest":"灰度测试","levelScoreCheck":"分数校验","item":"item配置","prop":"道具配置","baidu_act":"百度清凉活动","friend_pvp":"友谊赛","subscribe":"订阅","friendInteractive":"互动分享","starRewardDraw":"星星抽奖","starRewardDrawItem":"星星抽奖奖品","new_rank":"新排行榜","announcement": "自动公告","adProps": "激励广告","h5_ai_package": "h5_ai礼包","aiGiftBag": "AI礼包参数","groupTest": "正交分组","user_back": "玩家召回","drop_adjust": "掉落优化配置","money_box_product": "存钱罐礼包配置","money_box": "存钱罐通用配置","coast_star": "海滨之星","advertising": "新增视频广告","champion_common": "冠军赛通用配置","champion_ai": "冠军赛ai配置","robot": "机器人配置","level_extend": "关卡配置扩展","ad_task": "广告任务配置表","ad_task_detail": "广告任务轮替表","ad_label": "广告标签配置","ad_strategy": "广告点位策略","battle_pass": "通行证配置项","battle_pass_reward": "通行证奖励配置","rush_limit": "萌萌竞速配置项表","new_user_task_v2": "新手任务配置表","anniversary_common": "周年庆通用配置","anniversary_prize": "周年庆奖品配置","anniversary_prize_type": "周年庆奖品类型配置","anniversary_piece": "周年庆碎片配置","anniversary_product": "周年庆礼包配置","secret_shop_common": "神秘商店配置","secret_shop_condition": "神秘商店条件配置","secret_shop_pool": "神秘商店礼包池配置","secret_shop_gift_bag": "神秘商店礼包配置","mysterious_island_common": "神秘岛通用配置","mysterious_island_reward": "神秘岛奖励配置","purple_amy_magic": "紫咪的魔法配置","ship": "造船赛船只表","ship_chest_grid": "造船赛宝箱格子表","ship_robot_grow": "造船赛机器人成长表","ship_option": "造船赛配置项表","balloon_rise_node": "摘椰子节点配置","balloon_rise_option": "摘椰子通用配置","qualifying_common": "晋级赛通用配置","qualifying_grade": "晋级赛段位配置","qualifying_robot": "晋级赛机器人配置","level_record_fake": "晋级赛机器人保底配置","cube_ab_test": "cubeABtest配置","star_dream": "星岛梦工厂通用配置","star_dream_weight": "星岛梦工厂权重配置","star_dream_reward": "星岛梦工厂奖励配置","level_collection": "主线收集活动配置","endless_treasure_common": "无尽宝藏通用配置","endless_treasure_reward": "无尽宝藏礼包配置","speedboat_match_option": "快艇大赛通用配置","speedboat_match_grade": "快艇大赛赛事级别","month_card": "月卡配置","shop": "新版商城配置","island_treasure": "海岛礼包","sticker_battle_common": "贴贴大作战公共配置","sticker_battle_platform": "贴贴大作战平台配置","h5_ai_daily_bind_package": "每日特惠绑定礼包","gold_elysium_common": "金币乐园公共配置","gold_elysium_robot": "金币乐园机器人配置","fishing_common": "钓鱼达人通用配置","fishing_grade": "钓鱼达人赛事级别配置","fishing_rod": "钓鱼达人钓竿配置","fishing_variety": "钓鱼达人鱼类配置","live_gift_bag": "限定礼包配置","dress": "装扮配置"},
                // config_client.json
                {"strings": "文本配置","promot": "互导推广配置","share_group": "分享组配置","share_default": "分享默认配置","gacha": "摇一摇活动","time_limit_gift": "限时礼包活动","product_wechatgame": "前端-商品配置","product_qq_lightgame": "商品配置-QQ小游戏","product_oppo_quickgame": "商品配置-OPPO小游戏","product_baidu_lightgame": "商品配置-百度小游戏","goods": "商品清单配置","icon_settings": "活动图标显示配置","island": "岛屿配置","intro": "岛屿新内容配置","introB": "岛屿新内容配置B","coin_match": "金币大作战活动","game": "游戏通用配置","level_extend": "关卡配置扩展","shortcut": "快捷收藏","product_allplatform": "全平台商品配置","prop": "道具配置","level_baiduxiaoshu": "百度清凉活动","wx_group_share": "加步数分享配置","friend_pvp": "友谊赛","subscribe_msg":"订阅","interactive_invite": "互动分享","new_chest": "星星抽奖","newrank_province": "新排行榜地区配置","newrank": "新排行榜","ad_props": "激励广告","aipackage_settings": "AI礼包参数","aipackage": "h5_ai礼包","orthogonal_group": "正交分组","return_back": "玩家召回","dropadjust_apply": "掉落优化应用","dropadjust": "掉落优化配置","dropadjust_difftag": "掉落优化难度标签条件","dropadjust_orthgroup": "正交分组配置","dropadjust_orthapply": "正交策略配置","piggy_bank_config": "存钱罐礼包配置","piggy_bank_normal_config": "存钱罐通用配置","seaside_star_config": "海滨之星","privacy_config": "隐私配置","champion_config": "冠军赛通用配置","new_ad_config": "新增视频广告","adtask_common_config": "广告任务配置表","adtask_task_config": "广告任务轮替表","ad_label": "广告标签配置","ad_strategy": "广告点位策略","battlepass_config": "通行证配置项","lightning_rush": "萌萌竞速配置项表","drop_intervention": "新掉落干预总表","dropadjust_difftag_new": "新掉落优化难度标签条件","cube_ab_test": "cubeABtest配置","shardcollect_config": "周年庆通用配置","shardcollect_goods_config": "周年庆奖品配置","shardcollect_gift_config": "周年庆礼包配置","shardcollect_piece_config" : "周年庆碎片配置","special_shop_config": "神秘商店配置","special_shop_gift_config": "神秘商店礼包配置","buildship_config": "造船赛配置项表","buildship_box_config": "造船赛宝箱格子表","mysterious_island_common": "神秘岛通用配置","qualify_common": "晋级赛通用配置","qualify_grade": "晋级赛段位配置","stardream_config" : "星岛梦工厂通用配置","stardream_reward_config" : "星岛梦工厂奖励配置","endless_treasure_config" : "无尽宝藏通用配置","endless_treasure_gift_config" : "无尽宝藏礼包配置","speedboat_match_option": "快艇大赛通用配置","speedboat_match_grade": "快艇大赛赛事级别","month_ticket" : "月卡配置","welfare_center_config" : "福利中心配置","islandtreasure_config" : "海岛礼包","fail_times_optimize_config" : "关末长尾配置","shop": "新版商城配置","ai_daily_bind_package" : "每日特惠绑定礼包","sticker_battle_common" : "贴贴大作战公共配置","sticker_battle_platform" : "贴贴大作战平台配置","pick_coco_common": "摘椰子通用配置","pick_coco_config": "摘椰子节点配置","dynamic_guide" : "动态引导配置","gold_elysium_common": "金币乐园公共配置","fishing_variety" : "钓鱼达人鱼类配置","fishing_grade" : "钓鱼达人赛事级别配置","fishing_common" : "钓鱼达人通用配置","fishing_rod" : "钓鱼达人钓竿配置","dress" : "装扮配置"}
            ]
        };
        extraShowConf["shtcn0tNNgGf2ufrGRO0qIUhbBg"] = extraShowConf["shtcnnjxBfNgfXAYAOoN3ETcM8f"]; // H5：数据总表【dev】

        // 页面地址
        var pageUrl = window.location.pathname;
        if (!pageUrl) {
            return;
        }

        // 开始处理
        var sheetExtraInfos = {}; // {"sheetName"=>"serverConfName|clientConfName"}
        for (var urlName in extraShowConf) {
            if (!urlName || pageUrl.indexOf(urlName) < 0) {
                continue; // 页面不匹配
            }
            var confArr = extraShowConf[urlName];
            if (!confArr) {
                continue;
            }

            // 遍历配置，得到扩展信息
            for (let i = 0; i < confArr.length; i++) {
                var subConfObj = confArr[i];
                if (!subConfObj) {
                    continue;
                }
                for (var confName in subConfObj) {
                    if (!confName) {
                        continue;
                    }
                    var sheetName = subConfObj[confName];
                    if (sheetName.indexOf(confName) >= 0) {
                        continue; // sheetName已经包含有confName了，就不再处理
                    }
                    var oldConfName = sheetExtraInfos[sheetName];
                    if (oldConfName) {
                        if (oldConfName == confName) {
                            continue; // 前后端配置名相同时，不再处理
                        }
                        sheetExtraInfos[sheetName] = oldConfName + " | " + confName;
                    }else {
                        sheetExtraInfos[sheetName] = confName;
                    }
                }
            }

            // 退出
            break;
        }

        // 附加显示
        var sheetMenuDiv = $(".all-sheets-wrapper .all-sheet-list");
        if (!sheetMenuDiv || sheetMenuDiv.size() != 1) {
            return;
        }
        $('.sortable-sheet-item', sheetMenuDiv).each(function (i) {
            var obj = $(".sheet-name", $(this));
            var sheetName = obj.html();
            var confName = sheetExtraInfos[sheetName];
            if (!confName) {
                return;
            }
            obj.html(sheetName + " | " + confName)
        });
    }


    function genFinderHtmlCode() {
        var htmlCode = '' +
            '<div id="ld-feishu-doc-finder" >' + // style="position:fixed; z-index:9999; left:500px; top:10px; display:none;"
            '  <div style="padding:8px 10px 5px 10px;"><input id="ld-feishu-doc-finder-text" type="text" style="width: 100%; height:30px; padding:0 5px;" placeholder="输入页签名进行搜索" autocomplete="off"></div>' +
            '</div>';
        return htmlCode;
    }

    function genCssHtmlCode() {
        var htmlCode = '' +
            '<style type="text/css">\n' +
            '.ld-sheet-finder-hidden{display:none;}\n' +
            '</style>';
        return htmlCode;
    }

})();

