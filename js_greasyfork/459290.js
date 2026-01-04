// ==UserScript==
// @name itingwa_download
// @version      0.951
// @namespace       [url=mailto:wt@qkzy.net]mailto:wt@qkzy.net[/url]
// @match https://www.itingwa.com/listen/*
// @match https://www.itingwa.com/article/*
// @match https://www.itingwa.com/radio/*
// @match https://www.itingwa.com/?c=player*
// @match https://www.itingwa.com/player/*
// @grant none
// @license MIT
// @description 显示听哇网站文件的url以便快速下载。
// @downloadURL https://update.greasyfork.org/scripts/399825/itingwa_download.user.js
// @updateURL https://update.greasyfork.org/scripts/399825/itingwa_download.meta.js
// ==/UserScript==
(function () {
    let util = {
        itingwa_add_src() {
            var newNode_div = document.createElement("div");
            let itingwa_src;
            if ($("#tw_player").attr("init-data") == undefined) {
                itingwa_src = $("#tw_player").attr("data");
            } else {
                itingwa_src = $("#tw_player").attr("init-data");
            }

            if (!itingwa_src) {
                itingwa_src = $("#jp_audio_0").attr("src");
            }
            //let temp = itingwa_src.split("https://mp3.itingwa.com");
            //let temp2=new Array("https://itingwa-defehndcgug0fwga.z01.azurefd.net",temp[1]);
            //itingwa_src=temp2.join("");
            var newNode = document.createElement("a");
            newNode.setAttribute("href", itingwa_src);
            newNode.setAttribute("class", 'btn2_cancel music_download_src');
            newNode.innerHTML = "右键另存本歌曲";
            var url = /^https:\/\/www.itingwa.com\/article\/*/;
            if (url.test(window.location.href)) {
                $('.top_15.font_14.color2').append(newNode_div);
                $('.top_15.font_14.color2 div').append(newNode);
            } else {
                $("body > div.frame1 > div.lt_frame > div:nth-child(1) > div.right.top_10.module_event > div:nth-child(4)").append(newNode_div);
                $("body > div.frame1 > div.lt_frame > div:nth-child(1) > div.right.top_10.module_event > div:nth-child(4) > div").append(newNode);
            }
        }, top_select() {

            var new_click_li = document.createElement("li");
            var new_click_a = document.createElement("a");
            new_click_a.setAttribute("name", "player_nav");
            new_click_a.setAttribute("href", "javascript:void(0)");
            new_click_a.innerHTML = "获取此歌地址";
            $("a:contains(播放列表)").parent().parent().append(new_click_li);
            $("#player_music_list > div.wrap_960 > div.music_wrap.clearfix > ul > li:last ").append(new_click_a);
        }, width_ui_fix() {
            var content_width = document.body.clientWidth - (document.body.clientWidth * 0.2)
            var url = /^https:\/\/www.itingwa.com\/listen\/*/;
            var url2 = /^https:\/\/www.itingwa.com\/(\?=player*|player*)/;
            var content_sum = (content_width - 100) * 0.8 + (content_width - 100) * 0.2;
            if (content_width > 960 && url.test(window.location.href)) {
                $("body > div.frame1").css("width", content_width);
                $("body > div.frame1 > div.lt_frame").css("width", (content_width - 100) * 0.8);
                $("#comment_list > dl > dd").css("width", (content_width - 100) * 0.8 - 60);
                $("body > div.frame1 > div.rt_frame").css("width", (content_width - 100) * 0.2);
                $("div.clearfix").eq(0).css("width", (content_width - 100) * 0.8)
                $("body > div.frame1 > div.lt_frame > div:nth-child(1) > div.right.top_10.module_event").eq(0).removeAttr("width");
                $("div:contains(扫码，手机听)").eq(0).css("margin-left", document.body.clientWidth * 0.8 / 2);
                $("#back_to_top").css("left", (document.body.clientWidth - content_sum) / 2 + content_sum);
            }
            if (content_width > 960 && url2.test(window.location.href)) {
                $("body > div.playlist_wrap.clearfix").css("width", document.body.clientWidth);
                $("body > div.frame1").css("width", content_width);
                $("body > div.frame1 > div.lt_frame").css("width", (content_width - 100) * 0.8);
                $("#comment_list > dl > dd").css("width", (content_width - 100) * 0.8 - 60);
                $("body > div.frame1 > div.rt_frame").css("width", (content_width - 100) * 0.2);
                $("body > div.frame1 > div.lt_frame > div:nth-child(1) > div.right.top_10.module_event").eq(0).removeAttr("width");
                $("div:contains(扫码，手机听)").eq(0).css("margin-left", document.body.clientWidth * 0.8 / 2);
                $("#back_to_top").css("left", (document.body.clientWidth - content_sum) / 2 + content_sum);
                $("#player_music_list > div.wrap_960").css("width", 650);
            }
        }, listen_click() {
            document.addEventListener('click', function(e) {
                if (e.target && e.target.matches('dl.music_item')) { // 替换为你的按钮的选择器
                    console.log('Button clicked, start observing...');
                    // 用户点击了按钮，开始观察元素的变化
                    var callback = function(mutationsList, observer) {
                        for(let mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                console.log('A child node has been added or removed.');
                                util.width_ui_fix();
                            }
                            else if (mutation.type === 'attributes') {
                                console.log('The ' + mutation.attributeName + ' attribute was modified.');
                                util.width_ui_fix();
                            }
                        }
                    };

                    var targetNode = document.querySelector('body > div.frame1');
                    var config = { attributes: true, childList: true, subtree: true };
                    var observer = new MutationObserver(callback);
                    observer.observe(targetNode, config);
                }
            }
            );
        }
    }
    let main = {
        init() {
                util.width_ui_fix();
            $(window).resize(function () {
                util.width_ui_fix();
            });
        },
        start(){
            this.init();
            var player_zj = /^https:\/\/www.itingwa.com\/\?c=player*/;
            var player_zj_new= /https:\/\/www.itingwa.com\/player\/*/;
            if (player_zj.test(window.location.href) === true || player_zj_new.test(window.location.href)=== true ) {
                util.top_select();
                var show_download_src = $("#player_music_list > div.wrap_960 > div.music_wrap.clearfix > ul > li:last > a");
                show_download_src.bind('click', function (e) {
                    var test_node = /右键另存本歌曲/;
                    var element = $(".music_download_src").get(0);
                    if (element == undefined) {
                        util.itingwa_add_src();
                    }
                });
            } else {
                util.itingwa_add_src();
            }
            util.listen_click();
        }
    }
    main.start();
    window.itingwaSrc = window.itingwaSrc || {};
    window.itingwaSrc.main = main;
    window.itingwaSrc.util = util;
})();