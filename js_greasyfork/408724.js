// ==UserScript==
// @name               哔哩哔哩网页视频速度右键菜单
// @namespace          https://greasyfork.org/zh-CN/scripts/408724-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95
// @version            2.3
// @description        停更，用这个👉https://github.com/the1812/Bilibili-Evolved。隐藏使用率极低的右键菜单，添加修改视频倍速的右键菜单，自定义速度请自行修改第29行（最高支持16倍速，最低支持0.07倍速，10以上的速度支持小数点后一位，10以下的速度支持小数点后两位，例：16.0x,14.1x,6.77x,8.87x,15.2x,1.39x,12.8x,10.3x,10.2x,2.86x）
// @description:en     Add video playback speed to the right-click menu, hide the low-usage right-click menu
// @description:zh-CN  停更，用这个👉https://github.com/the1812/Bilibili-Evolved。隐藏使用率极低的右键菜单，添加修改视频倍速的右键菜单，自定义速度请自行修改第29行（最高支持16倍速，最低支持0.07倍速，10以上的速度支持小数点后一位，10以下的速度支持小数点后两位，例：16.0x,14.1x,6.77x,8.87x,15.2x,1.39x,12.8x,10.3x,10.2x,2.86x）
// @author             beibeibeibei
// @match              *.bilibili.com/video/*
// @match              *.bilibili.com/s/video/*
// @match              *.bilibili.com/bangumi/play/*
// @match              *.bilibili.com/cheese/play/*
// @match              *.bilibili.com/blackboard/*
// @match              *.bilibili.com/watchlater*
// /@/r/e/q/u/i/r/e            https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408724/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/408724/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let $ = jQuery.noConflict();

    //速度列表     例： = [3, 4, 5];                     //整数
    //                  = [6.1, 7.2, 8.3];               //小数
    //                  = [10.4, 11.5, 13.6, 14.7, 15.8];//10以上的速度支持小数点后一位
    //                  = [1.04, 1.15, 1.36, 1.47, 1.58];//10以下的速度支持小数点后两位
    //                  = [1.04567891230, 2.09876543210];//自动转换为合理数值[1.05, 2.10]
    //                  = [-3.141, 0.0001, 16.012, +100];//不支持，将自动转换为最接近的可支持数字[0.07,16.0]（做人要x10再x10，WTM直接量子阅读）
    //                  = [3.00, 3.00, 3.00, 3.00, 3.00];//不支持，将自动删除重复数字[3.00]
    //                  = [1.01, 2.02, 3.03, 4.04 ,5.05];//不限数量，建议最多5-12个左右（主要是屏幕显示不下）
    let new_speed_array = [3, 4, 5, 6];//                                                                        //line 51

    function new_speed() {
        //bilibili网页电脑端添加视频速度菜单
        //鼠标悬浮并持续移动在视频窗口上时，在视频窗口下边框从右至左数第7个左右找到”倍数“菜单
        //这个菜单会显示多个速度按钮，本代码会再添加多个速度按钮

        //原速度填0补齐,保证整数位数+"."+小数位数+"x"=5位
        for (let i = 0, l = $(".bilibili-player-video-btn-speed-menu").children().length; i < l; i++) {
            let text = $(".bilibili-player-video-btn-speed-menu").children().eq(i).text();
            if (text.length == 4) {
                $(".bilibili-player-video-btn-speed-menu").children().eq(i).text(text.replace("x", "") + "0x");
            }
        }

        //将所有原速度存储到数组中备用
        let old_speed_array = [];
        for (let i = 0, l = $(".bilibili-player-video-btn-speed-menu").children().length; i < l; i++) {
            old_speed_array.push($(".bilibili-player-video-btn-speed-menu").children().eq(i).attr("data-value"));
        }

        //定义新速度数组
        //let new_speed_array = [0.111, 0.112, 15.84, 15.83, 11.37];                                             //line 29
        //处理数组1:合理替换小于0.07或大于16.0的不正常值(可能会出现重复数据)
        for (let i = 0; i < new_speed_array.length; i++) {
            if (new_speed_array[i] < 0.07) { new_speed_array[i] = 0.07; } else if (new_speed_array[i] > 16.0) { new_speed_array[i] = 16.0; }
        }
        //处理数组2:保留一位或两位小数(可能会出现重复数据)(过于接近的速度只会出现一个) 例子: 去重后,15.84和15.83重复只会生效15.8;0.111和0.112重复只会生效0.11
        for (let i = 0; i < new_speed_array.length; i++) {
            new_speed_array[i] = parseFloat(new_speed_array[i].toFixed(new_speed_array[i] > 10 ? 1 : 2));
        }
        //处理数组3:去重
        new_speed_array = [...new Set(new_speed_array)];
        //处理数组4：删除原版已有的速度值(只能删除查到的第一个，所以提前保证数组没有重复元素,放在去重后执行)
        for (let i = 0; i < old_speed_array.length; i++) {
            if (new_speed_array.indexOf(old_speed_array[i]) != -1) {
                new_speed_array.splice(new_speed_array.indexOf(old_speed_array[i]), 1);
            }
        }
        //处理数组5：数组排序
        new_speed_array.sort(function (a, b) { return (b - a); });

        //定义新速度字符串数组,保证整数位数+"."+小数位数+"x"=5位 例:"3.00x","16.0x"
        let new_speed_text_array = [];
        for (let i = 0, l = new_speed_array.length; i < l; i++) {
            if (new_speed_array[i] > 10) {
                new_speed_text_array.push(new_speed_array[i].toFixed(1) + "x");// 例:["16.0x","12.8x"]
            } else {
                new_speed_text_array.push(new_speed_array[i].toFixed(2) + "x");// 例:["3.00x","1.75x"]
            }
        }

        //定义索引数组,提前判断新速度应该放置的位置 例:0是指第0个元素之前的位置,也就是最开头
        let new_speed_index_array = [];
        for (let i = 0, nl = new_speed_array.length; i < nl; i++) {
            for (let j = 0, ol = old_speed_array.length; j < ol; j++) {
                if (new_speed_array[i] < old_speed_array[old_speed_array.length - 1]) {//比原版最后一个速度0.5都小(原版是排好序的)
                    new_speed_index_array.push(old_speed_array.length);
                    break;
                }
                if (new_speed_array[i] > old_speed_array[j]) {
                    new_speed_index_array.push(j);
                    break;
                }
            }
        }

        //给所有速度添加正常的选中效果(取消所有选中,再选中自己,从而解决原版程序不清楚本插件添加了新速度的问题)(修改classname后选中效果原版css会自动识别)
        $(".bilibili-player-video-btn-speed-menu").children().on("click", function () {
            $(this).siblings(".bilibili-player-active").removeClass("bilibili-player-active");
            $(this).addClass("bilibili-player-active");
        });
        //添加占位li,解决选中状态错误的问题(例:点原速度2.0x时，点亮的按钮是第一个bilibili-player-video-btn-speed-menu-list(原版)和本身(插件),只判断了顺序,并没有判断值)
        for (let i = 0; i < old_speed_array.length; i++) {
            $(".bilibili-player-video-btn-speed-menu").prepend('<li class="bilibili-player-video-btn-speed-menu-list new_speed_tampermonkey" style="display: none;">占位</li>');
        }

        //添加新的速度按钮
        for (let i = 0, l = new_speed_array.length; i < l; i++) {
            $(".bilibili-player-video-btn-speed-menu").children('[data-value="' + old_speed_array[new_speed_index_array[i]] + '"]').before
                ('<li class="bilibili-player-video-btn-speed-menu-list new_speed_tampermonkey" data-value="' + new_speed_array[i] + '">' + new_speed_text_array[i] + '</li>');
            if (new_speed_index_array[i] == old_speed_array.length) {
                $(".bilibili-player-video-btn-speed-menu").append
                    ('<li class="bilibili-player-video-btn-speed-menu-list new_speed_tampermonkey" data-value="' + new_speed_array[i] + '">' + new_speed_text_array[i] + '</li>');
            }
        }

        //给新的速度按钮添加点击事件,触发速度1点击事件,再修改选中效果,修改文字显示,修改playbackRate(不包含占位按钮)
        $(".new_speed_tampermonkey[data-value]").on("click", function () {
            $('li[data-value="1"]').click();
            $(this).siblings(".bilibili-player-active").removeClass("bilibili-player-active");
            $(this).addClass("bilibili-player-active");
            $(".bilibili-player-video-btn-speed-name").text($(this).text());
            $("video")[0].playbackRate = $(this).attr("data-value");
        });

        //问题：当点击顺序为A→N→A(A:原版速度;N:新增速度)时,原版程序无法了解已经切换了速度从而导致切换失效,一直停留在N速度上(A速度切A速度那就是没切)
        //解决：在新建速度点击事件前再添加一个原版速度点击事件,即A→1N→A,让原版程序认为最后一次速度是1(再切1时会切不了,让问题只在1上发生)(line 117)
        //遗留：需要解决点击1→1N→1的顺序后，实际速度为N的问题

        //遗留解决：你说没切就没切，就硬切
        $('li[data-value="1"]').on("click", function () {
            $("video")[0].playbackRate = 1;
            $(".bilibili-player-video-btn-speed-name").text("倍速");
        });
        //结束
    }


    $(document).on("DOMNodeInserted", ".bilibili-player-video-btn.bilibili-player-video-btn-speed", function () {
        // 显示速度填0补齐到5位(整数位数+"."+小数位数+"x"=5位)
        let str2five = function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                let text = $("button[aria-label=倍速]").text();
                if (mutation.type == 'attributes' && mutation.attributeName == "class" && text.length == 4 && text != "倍速") {
                    $("button[aria-label=倍速]").text(text.replace("x", "") + "0x");
                }
            }
        };

        //监听速度li列表的显示和隐藏(实际为监听className变化),触发显示速度文字再修改
        let observer = new MutationObserver(str2five);
        observer.observe($(".bilibili-player-video-btn.bilibili-player-video-btn-speed")[0], { attributes: true });
    });
    $(document).on("DOMNodeInserted", ".bilibili-player-video-control-bottom-right", function (e) {
        if (e.target.className == "bilibili-player-video-btn bilibili-player-video-btn-speed" && $(".new_speed_tampermonkey").length == 0) {
            new_speed();
        }
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //上半部分：添加新速度//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //下半部分：添加右键菜单////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let Rmenu_show = false;//默认不显示原右键菜单
    let Rmenu_selector = ".bilibili-player-context-menu-container:eq(1)";
    let Rmenu_selector2 = ".bilibili-player-context-menu-origin";//style不支持eq
    let border_top_li_style = "border-top:1px solid hsla(0,0%,100%,.12);";
    let old_menu_li_selector = ".context-line.context-menu-function";

    let new_menu_style = "background-color: rgba(255,255,255,0.12);";
    let new_menu_str1 = ["加速", "原速", "减速"];
    let new_menu_str2 = "★";
    let new_menu_selector = ".new_context_menu_tampermonkey";
    let new_menu_classname = new_menu_selector.substr(1);

    let more_setting_btn_selector = ".bilibili-player-video-btn-setting-left-more-text";
    let more_setting_selector = ".bilibili-player-video-btn-setting-right";
    let more_setting_children_prefix_str = more_setting_selector.substr(1);

    //拼接字符串:"显示原右键菜单(15秒后重新隐藏)"
    let UHCT_before = "显示原右键菜单(";
    let unhide_contextmenu_time = 15;//临时显示的限制时间，单位秒
    let UHCT_after = "秒后重新隐藏)";
    //拼接字符串的颜色
    let new_setting_color = "white";
    let new_setting_color_hover = "#00a1d6";
    let new_setting_selector = ".new_setting_tampermonkey";
    let new_setting_str = new_setting_selector.substr(1);

    //new_context_menu中有字符串处理
    function str2five__(str) {
        str = str.replace("x", "");
        str = parseFloat(str).toFixed(str.indexOf('.') == 1 ? 2 : 1);//一共5位，点和x占了两位，整数要占位，所以不是保留一位就是保留两位
        if (str < 0.07) { str = "0.07"; } else if (str > 16.0) { str = "16.0"; }
        return str + "x";
    }
    function str_before(str) {
        let before = "";
        if (parseFloat(str) < 1) {
            before = new_menu_str1[2];//减速
        } else if (parseFloat(str) > 1) {
            before = new_menu_str1[0];//加速
        } else if (parseFloat(str) == 1) {
            before = new_menu_str1[1];//原速
        }
        return before + str;
    }
    function str_after_(str, j) {
        return str + new_menu_str2.repeat(j);
    }

    //one绑定事件
    function new_setting() {
        $(more_setting_selector).append(
            '<div class="' + more_setting_children_prefix_str + "-" + new_setting_str + '">' +
            '    <style>.' + new_setting_str + '{color: ' + new_setting_color + ';}.' + new_setting_str + ':hover{color: ' + new_setting_color_hover + ';}</style>' +
            '    <ul>' +
            '        <li><a class="' + new_setting_str + '">' + UHCT_before + unhide_contextmenu_time + UHCT_after + '</a></li>' +
            '    </ul>' +
            '</div>');
    }

    //限时显示原右键菜单
    function time_limited_show_context_menu() {
        Rmenu_show = true;
        context_menu();
        setTimeout(function () {
            Rmenu_show = false;
            context_menu();
        }, (unhide_contextmenu_time * 10 * 10 * 10));
    }

    //on绑定事件
    function context_menu() {
        let context_menu_li = $(Rmenu_selector + " > ul > " + old_menu_li_selector);
        if (Rmenu_show) {
            context_menu_li.show();
        } else {
            context_menu_li.hide();
        }
        //右键在弹幕上了,用setTimeout延迟判断是否有弹幕的右键菜单,直接运行判断不到
        setTimeout(function () {
            if ($(".context-line.context-menu-danmaku").length > 0) {
                $(new_menu_selector).hide();
            } else {
                $(new_menu_selector).show();
            }
        });
    }

    //on绑定事件
    function new_context_menu() {
        if ($(new_menu_selector).length == 0) {
            $(Rmenu_selector).prepend(
                '<style>' + Rmenu_selector2 + ' ul+ul>li:first-child{' + border_top_li_style + '}</style>' +
                '<style>' + new_menu_selector + ' >li:hover{' + new_menu_style + '}</style>' +
                '<ul class="' + new_menu_classname + '">' +
                '</ul>'
            );
            let speed_text_array = [];
            $("ul.bilibili-player-video-btn-speed-menu").children("[data-value]").each(function (index) {
                speed_text_array.push($(this).text());
            });
            for (let i = 0, l = speed_text_array.length; i < l; i++) {
                $(Rmenu_selector).children(new_menu_selector).append('<li><a class="' + new_menu_classname + ' ' + i + '">' + speed_text_array[i] + '</a></li>');
                $(new_menu_selector + "." + i).on("click", function () {
                    $(".bilibili-player-video-btn-speed-menu-list[data-value]").eq(i).click();
                });
                $(new_menu_selector + "." + i).text(str2five__($(new_menu_selector + "." + i).text())); //位数对齐
                $(new_menu_selector + "." + i).text(str_before($(new_menu_selector + "." + i).text())); //添加前缀
                $(new_menu_selector + "." + i).text(str_after_($(new_menu_selector + "." + i).text(), (l - i))); //添加后缀
            }
        }
    }

    //缩放菜单
    function throttle(fn, delay) {
        delay = delay || 500;
        let runFlag = false;
        return function (e) {
            if (runFlag) {
                return false;
            }
            runFlag = true;
            setTimeout(() => {
                fn(e);
                runFlag = false;
            }, delay);
        };
    }
    function debounce(fn, delay) {
        delay = delay || 30;
        let handle;
        return function (e) {
            clearTimeout(handle);
            handle = setTimeout(() => {
                fn(e);
            }, delay);
        }
    }
    function zoom_menu() {
        let a = $(".bilibili-player-context-menu-container > ul");
        let b = $(".bilibili-player-hotkey-panel-container");
        let c = $(".bl-audio-panel.bl-audio-blue");
        let d = $(".bilibili-player-color-panel");
        //能正常点到右上角关闭就谢天谢地了，不缩放更费劲
        if ($(".drag-bar").length > 0) {
            a.css("zoom", "0.7");
            b.css("zoom", "0.68");
            c.css("zoom", "0.74");
            d.css("zoom", "0.85");
        } else {
            a.css("zoom", "1");
            b.css("zoom", "1");
            c.css("zoom", "1");
            d.css("zoom", "1");
        }
    }


    //点击“更多播放设置”触发，添加一个设置菜单
    $(document).one("click", more_setting_btn_selector, new_setting);
    //点击添加的设置菜单触发，设置显示或隐藏的开关变量并刷新显示状态
    $(document).on("click", new_setting_selector, time_limited_show_context_menu);
    //右击视频窗口间接触发，显示处理后的原右键菜单（处理成可见或不可见）
    $(document).on("DOMNodeInserted", Rmenu_selector, context_menu);
    //右击视频窗口间接触发，增加一个新的右键菜单（添加速度按钮）
    $(document).on("DOMNodeInserted", Rmenu_selector, new_context_menu);
    //屏幕滚动时触发，缩放一些窗口适应迷你播放器大小
    $(window).scroll(throttle(zoom_menu));
    //补丁：修复右侧推荐列表的视频无法生效的问题（并没有修，增加新右键菜单时使用on绑定就好了）


})();
//Search box placeholder comment
//Search box placeholder comment
//Search box placeholder comment