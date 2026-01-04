// ==UserScript==
// @name			Steam Auto Mass Craft Cards Badges in Bulk
// @name:zh-CN			Steam一键批量合卡合徽章
// @name:zh-TW			Steam一鍵批量合卡合徽章
// @version	 		0.7
// @description			It will automatically use up ALL your gamecard sets for crafting badges and you should use it at your own risk, Though you can control the which card sets and how many sets to craft by using it.
// @description:zh-CN	这是一个自动合卡插件，可以指定徽章合成的数量和种类
// @description:zh-TW	這是一個自動合卡挿件，可以指定徽章合成的數量和種類
// @author			steamdj.com
// @include			*steamcommunity.com/*/badges/
// @include			*steamcommunity.com/*/badges
// @require			https://code.jquery.com/jquery-3.2.1.min.js
// @grant			GM_addStyle
// @supportURL			steamdj.com
// @supportURL			steamdj.com
// @icon			http://pan.hriq.org/steam.green.ico
// @namespace 			steamdj.com
// @namespace 			steamdj.com
// @downloadURL https://update.greasyfork.org/scripts/37177/Steam%20Auto%20Mass%20Craft%20Cards%20Badges%20in%20Bulk.user.js
// @updateURL https://update.greasyfork.org/scripts/37177/Steam%20Auto%20Mass%20Craft%20Cards%20Badges%20in%20Bulk.meta.js
// ==/UserScript==

const	timer_scan = 1000,			//扫描卡组间隔 Interval: between badges scans（ms）[500+ recommended]
		timer_craft = 500,			//合成卡牌间隔 Interval: between crafting card sets（ms）[100+ recommended]
		sales=["245070","762800"],	//Appid for sales cards
		config_cap_level = 0;		//Set 1 if you want to craft all badges up to level 1 [1 - 5]
(function() {
    'use strict';
    GM_addStyle('.profile_xp_block_right { text-align: center!important;}.profile_xp_block_right{display: block; width: 230px; border: 1px #aaa solid; border-radius: 4px; padding: 8px 0px; cursor: pointer;transition:.5s}.profile_xp_block_right:hover{color:#333;background:#aaa}.craft_list p{margin: 2px 10px;}.craft_list p input{width: 36px; height: 13px; background-color: #152f4a; border: 1px #fff solid; color: #fff; padding: 2px 0 0 10px; font-weight: bold;transition: .5s; background-repeat: no-repeat; background-position-x: -46px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAPCAYAAACbSf2kAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAKUlEQVR42mOIOmPwfyhihlGHjzp81OGjDh91+KjDRx0+6vBRh486HI4BdWZJdZDgwMoAAAAASUVORK5CYII=)}.cannot_craft{-webkit-filter: grayscale(100%); -moz-filter: grayscale(100%); -ms-filter: grayscale(100%); -o-filter: grayscale(100%); filter: grayscale(100%); filter: gray;cursor:not-allowed;}.sum_show{width: 882px;height: 95px;position: relative; top: -115px; z-index: 10000001; padding: 10px 0; background: #1d1d1d;border-top:#383838 1px solid;}div.craft_list{padding:10px 0 95px 0;;}.craft_list.dischange input{border: 1px #827d7d solid; color: #827d7d;cursor:not-allowed;}p.do_not_craft{opacity:.5;}input.ready_to_craft.finished{background-color: #ff0909;}input.ready_to_craft.in_progress{border: 1px #ffffff solid!important; color: #ffffff!important;}#start img{padding-top: 0px;}');
    var _border, g_sessionID, badge_cap_level, __appID, _gappid;
    var text = {},
    lan = $('head').html().match(/l=([^"&*]+)"/)[1];
    if (lan == "schinese" || lan == "tchinese") {
        text.start = "批量合成徽章";
        text.title = "批量合卡";
        text.notice = '<p>这是一个自动合卡插件，可以指定徽章合成的数量和种类。请自行承担操作不当带来的风险，全自助steam等级升级网站steamdj.com</p></p>可以随时关闭本标签页来停止插件的自动操作</p><p>嫌慢？可以在源码前几行设置频率（扫描卡组间隔与合成卡牌间隔），可根据自身网络情况设置（Steam web服务器这么腻害，土豪请走高速）</p><p>如果想每个徽章都升到1级，可设置config_cap_level = 1;（可设置范围：1-5）</p>';
        text.button1 = "开始统计本页可合成卡组";
        text.button2 = "确认无误后开始合卡";
        text.button2no = "不合卡的吗？";
        text.calculating = "计算中(输入想要合成的次数，计算过程中可以关闭本弹出窗口)";
        text.calculated = "请在每个徽章前输入想要合成的次数，并确认合成";
        text.crafting = "合成中，合成过程中可以关闭本弹出窗口";
        text.crafted = "合成完毕";
        text.list1 = '←输入合成套数';
        text.list2 = '可升';
        text.list3 = '级 (当前';
        text.list4 = '级) 游戏:';
        text.nosets1 = '<p style=" font-size: 25px; ">想合卡？先去市场买来再说吧！</p>';
        text.nosets2 = '这是一个悲伤地故事';
        text.nosets3 = '虽<br>然<br>没<br>有<br>卡<br>，<br>也<br>要<br>假<br>装<br>扫<br>描<br>出<br>了<br>很<br>多';
    } else {
        text.start = "Craft Badges in Bulk";
        text.title = "Craft Badges in Bulk";
        text.notice = '<p>It will automatically use up ALL your gamecard sets for crafting badges and you should use it at your own risk.</p><p><a class="underlinedLink" href="https://steamcn.com/t339531-1-1" target="_blank">SteamCN</a>、<a class="underlinedLink" href="https://greasyfork.org/en/scripts/36393" target="_blank">Greasy Fork</a> or comment on <a class="underlinedLink" href="https://steamcommunity.com/profiles/76561198132556503" target="_blank">Steam profile</a> for feedback.</p>Click the bottom button to start after you understand fully and agree with the notice above.<p></p>Close this WEBPAGE at any time you want to stop!</p><p>You can set intervals between crafting and scaning in the first few lines of source code</p><p>Set config_cap_level = 1; if you want to craft all badges up to level 1 [also can be 2,3,4,5]</p><p><a class="underlinedLink" href="http://pan.hriq.org/steam_craft_1.gif" target="_blank">Demo1</a>　<a class="underlinedLink" href="http://pan.hriq.org/steam_craft_2.gif" target="_blank">Demo2</a></p>';
        text.button1 = "Start to calculate how many badges you can craft in this page";
        text.button2 = "Start Crafting!";
        text.button2no = "No Cards for Crafting!";
        text.calculating = "Calculating, you can close this pop-up window in the process of calculation";
        text.calculated = "Enter the times you want to craft for the badges. Confirm and craft them by click the green button below";
        text.crafting = "Crafting! You can close this pop-up window in the process of crafting";
        text.crafted = "Finished!";
        text.list1 = 'sets to craft';
        text.list2 = 'can craft';
        text.list3 = 'more (Level';
        text.list4 = 'now) GAME:';
        text.nosets1 = '<p style=" font-size: 25px; ">No sets to craft qwq</p>';
        text.nosets2 = 'So sad';
        text.nosets3 = 'T<br>h<br>e<br>r<br>e<br> <br>i<br>s<br> <br>n<br>o<br> <br>r<br>e<br>s<br>u<br>l<br>t<br>!';
    }

    $('body').prepend('<div class="craft_background" style="opacity: 0.5;position: fixed; width: 100%; height: 100%;background:#000;cursor:pointer;z-index: 999;display:none;"></div><div class="craft_window" style="position: fixed; z-index: 1000;height: 90%; width: 900px; left: 50%; margin-left:-450px; top: 20px;display:none;"><div class="newmodal_header_border"><div class="newmodal_header"><div class="newmodal_close"></div><div class="ellipsis window_title">' + text.title + '</div></div></div><div class="newmodal_content_border"style="background: #1d1d1d;height: 90%; overflow-y:auto;"><div class="newmodal_content" style="color: #c4c6c7;"><div class="craft_title"style="  font-size:16px;padding:10px 0"> ' + text.notice + '</div><div class="craft_list"style="  font-size:16px"></div></div></div><div class="sum_show"><div class="newmodal_buttons start_1"style="text-align:center;"id="start"><div class="btn_grey_white_innerfade btn_large"style=" margin-top: 28px; "><span>' + text.button1 + '</span></div></div></div></div>');

    for (var i = 0; i < 20; i++) {
        setTimeout(function() {
            $('.profile_xp_block_right').html(text.start);
            $('.es_faq_cards').hide();
        },
        i * 500);
    } //hide the content that is not necessary
    function craft() {

        $('.window_title').html(text.calculating);
        $('.craft_title').slideUp();
        $('#start').html('<img style="padding-top: 30px;" src="http://community.edgecast.steamstatic.com/public/images/login/throbber.gif">');
        var total_number = $('a.badge_craft_button').length,
        each_count = 0,
        sum_sets = 0,
        sum_badges = 0;
        if (total_number === 0) {
            $('#start').html(text.nosets1);
            $('.window_title').html(text.nosets2);
            $('.craft_list').append("<p>" + text.nosets3 + "</p>");
            $('#start').addClass('start_2').removeClass('start_1');
            $('.craft_list').append("<p style='text-align:center;margin-top: 15px; letter-spacing: 8px;'>=========END=========</p>");
        }

        $('a.badge_craft_button').each(function(i) { ///if(i>1){return false;}//a.badge_craft_button//a.badge_row_overlay
            var badge_link = $(this).attr('href'),
            badge_level = 0,
            count_min = 9999;
            setTimeout(function() {
                $.get(badge_link,
                function(html) {
                    if (i === 0) {
                        g_sessionID = html.match(/g_sessionID = "([^"]+)"/)[1];
                    }
                    var gamename = $(html).find('.badge_title').text();
                    var _badge = $(html).find('.badge_current .badge_info_description>div:eq(1)');

                    $(html).find('.badge_detail_tasks>.badge_card_set_card').each(function() {
                        var count = $(this).find('.badge_card_set_text_qty').text();
                        if (count) {
                            count = parseInt(count.replace(/[()]/g, ''));
                            if (count < count_min) {
                                count_min = count;
                            }
                        } else {
                            count_min = 0;
                        }
                    });

                    if (_badge.length) {
                        badge_level = parseInt(_badge.text().match(/\d+/));
                    }
                    var _appid = badge_link.match(/\/([0-9]{1,7})\/$/);
                    var _appid2 = badge_link.match(/\/([0-9]{1,7})\/\?border=1$/);
                    if (!_appid) {
                        _border = 1;
                        __appID = _appid2[1];
                        _gappid = __appID + "b1";
                        if ($.inArray(__appID, sales) >= 0) {
                            badge_cap_level = config_cap_level === 0 ? 99999 : config_cap_level;
                        } else {
                            badge_cap_level = 1;
                        }
                    } else {
                        _border = 0;
                        __appID = _appid[1];
                        _gappid = __appID + "b0";
                        if ($.inArray(__appID, sales) >= 0) {
                            badge_cap_level = config_cap_level === 0 ? 99999 : config_cap_level;
                        } else {
                            badge_cap_level = config_cap_level === 0 ? 5 : config_cap_level;
                        }
                    }
                    var upgrade_sets = Math.min(count_min, (badge_cap_level - badge_level)); ///Math.min(count_min, (badge_cap_level - badge_level));//2;
                    $('.craft_list').append("<p><input class='ready_to_craft' type='number' value=" + upgrade_sets + " data-appid=" + __appID + " data-border=" + _border + " data-gappid=" + _gappid + " max=" + upgrade_sets + " min='0'> " + text.list1 + " APPID:" + __appID + " " + text.list2 + " " + upgrade_sets + " " + text.list3 + " " + badge_level + " " + text.list4 + " " + gamename + "</p>");
                    sum_sets += upgrade_sets;
                    sum_badges += 1;

                    if (i == (total_number - 1)) { ///2-1
                        $('#start').html('<div class="btn_grey_white_innerfade btn_large"><span>' + text.button2 + '</span></div>');
                        $('.window_title').html(text.calculated);
                        $('#start').addClass('start_2').removeClass('start_1');
                        $('#start>div').addClass('btn_green_white_innerfade').removeClass('btn_grey_white_innerfade');
                        $('#start').before('<p class="before_c" style="margin: 4px 0 15px 0;text-align: center; font-size: 18px; color: #fff;"><font class="sum_sets" style="font-size: 22px;">' + sum_sets + '</font> sets(<font class="sum_badges" style="font-size: 22px;">' + sum_badges + '</font> badges) to craft!</p>');
                        $('.craft_list').append("<p style='text-align:center;margin-top: 15px; letter-spacing: 8px;'>=========END=========</p>");
                    }

                });

            },
            i * timer_scan);
        });
    }

    function craft_do() {
        var queue = [],
        finished_count = {},
        all_count = {},
        sum_crafted = 0,
        sum_sets = 0;
        $('.ready_to_craft').attr("disabled", true);
        $('.craft_list').addClass("dischange");

        $('.ready_to_craft').each(function() {
            if ($(this).val() > $(this).attr("max")) {
                $(this).val($(this).attr("max"));
            }
            if ($(this).val() > 0) {
                sum_sets += parseInt($(this).val());
            }
        });

        $('#start').html('<img src="http://community.edgecast.steamstatic.com/public/images/login/throbber.gif">');
        $('.window_title').html(text.crafting);
        $('.before_c').html('Success: <font class="sum_crafted" style="font-size: 22px;">0</font> / <font class="sum_sets" style="font-size: 22px;">' + sum_sets + '</font> sets (<font class="sum_percent" style="font-size: 22px;">' + GetPercent(sum_crafted, sum_sets) + '</font>) <font class="sum_xp" style="font-size: 20px;color: #ffc902;"></font></p>');
        $('.ready_to_craft').each(function() {
            if ($(this).val() > 0) {
                for (var i = 0; i < $(this).val(); i++) {
                    queue.push({
                        "border": $(this).data("border"),
                        "appid": $(this).data("appid"),
                        "times": $(this).val()
                    });
                }
            }
        });
        $.each(queue,
        function(i) {
            setTimeout(function() {
                var border = queue[i].border,
                appid = queue[i].appid,
                para = appid + "b" + border;
                $.ajax({
                    type: 'post',
                    url: g_strProfileURL + '/ajaxcraftbadge',
                    data: {
                        sessionid: g_sessionID,
                        series: 1,
                        border_color: border,
                        appid: appid
                    },
                    timeout: 8000,

                    complete: function(XMLHttpRequest, status) {
                        if (i == (queue.length - 1)) {
                            $('#start').html('<font style=" font-size: 25px; position: relative; top: 0; ">' + text.crafted + '</font>');
                            $('.window_title').html(text.crafted);
                        }
                        if (all_count[para]) {
                            all_count[para]++;
                        } else {
                            all_count[para] = 1;
                        }
                        if (all_count[para] == 1) {
                            $('input.ready_to_craft[data-gappid="' + para + '"]').addClass('in_progress');
                        }
                        if (all_count[para] == queue[i].times) {
                            $('input.ready_to_craft[data-gappid="' + para + '"]').addClass('finished');
                        }
                    },

                    success: function(data) {
                        if (data.success == 1) {
                            sum_crafted += 1;
                            $('.sum_crafted').text(sum_crafted);
                            $('.sum_percent').text(GetPercent(sum_crafted, sum_sets));
                            $('.sum_xp').text('+' + (sum_crafted * 100) + 'HP');
                            if (finished_count[para]) {
                                finished_count[para]++;
                            } else {
                                finished_count[para] = 1;
                            }
                            $('input.ready_to_craft[data-gappid="' + para + '"]').css('background-position-x', 46 * (finished_count[para] / queue[i].times - 1));
                        }
                    }

                });
            },
            timer_craft * i);
        });

    }

    function update_sum_sets() {
        var sum_badges = 0,
        sum_sets = 0;
        $('input.ready_to_craft').each(function(i) {
            if ($(this).val() > 0) {
                sum_sets += parseInt($(this).val());
                sum_badges += 1;
                if ($(this).parent().hasClass('do_not_craft')) {
                    $(this).parent().removeClass('do_not_craft');
                }
            } else {
                $(this).parent().addClass('do_not_craft');
            }
            $('font.sum_badges').html(sum_badges);
            $('font.sum_sets').html(sum_sets);
        });
        if (sum_badges === 0) {
            $('#start>div').addClass('cannot_craft');
            $('#start span').html(text.button2no);
        }
        if (sum_badges !== 0) {
            $('#start>div').removeClass('cannot_craft');
            $('#start span').html(text.button2);
        }
    }

    $('body').on('click', '.newmodal_close',
    function() {
        _close();
    });
    $('body').on('click', '.craft_background',
    function() {
        _close();
    });
    $('body').on('click', '.profile_xp_block_right',
    function() {
        _open();
    });
    $('body').on('click', '.start_1 div.btn_large',
    function() {
        craft();
    });
    $('body').on('click', '.start_2 div.btn_large',
    function() {
        craft_do();
    });
    $('body').on('change', '.ready_to_craft',
    function() {
        update_sum_sets();
    });

    function _close() {
        $('.craft_background').fadeOut();
        $('.craft_window').slideUp();
    }
    function _open() {
        $('.craft_background').fadeIn();
        $('.craft_window').slideDown();
    }

    function GetPercent(num, total) {
        num = parseFloat(num);
        total = parseFloat(total);
        if (isNaN(num) || isNaN(total)) {
            return "-";
        }
        return total <= 0 ? "0%": (Math.round(num / total * 10000) / 100.00 + "%");
    }

})();