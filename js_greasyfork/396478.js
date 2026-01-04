// ==UserScript==
// @name         增强CCTV直播体验
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  主要是用于纯净的观看新闻的体验
// @author       Modai
// @match        https://tv.cctv.com/live/*
// @grant        GM_xmlhttpRequest
// @icon         http://tv.cctv.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/396478/%E5%A2%9E%E5%BC%BACCTV%E7%9B%B4%E6%92%AD%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/396478/%E5%A2%9E%E5%BC%BACCTV%E7%9B%B4%E6%92%AD%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $().ready(function () {
        function getDomPlayer() {
            /*	获取video对象	*/
            return $("#h5player_player")[0];
        };
        function removeDefault(event){
            if(event.preventDefault){
                event.preventDefault();
            }else{
                event.returnValue = false;
            }};
        function AddKeyListen() {
            $("body").keydown(function (e) {
                var keycode = e.keyCode;
                if (keycode == 37) {
                    //  removeDefault(e);
                    /*					ctrl + left					*/
                    if (getDomPlayer().currentTime > 10) {
                        getDomPlayer().currentTime -= 10;
                    }
                    console.log('回溯...');
                    return false;
                }
                if (keycode == 39) {
                    //  removeDefault(e);
                    /*					ctrl + right				*/
                    var cached = getDomPlayer().buffered.end(0);
                    console.log(cached);
                    if (getDomPlayer().currentTime < cached - 10) {
                        getDomPlayer().currentTime += 10;
                    }
                    console.log('未来...');
                    return false;
                }
                // if (keycode == 32) {
                //     /*					ctrl + space					*/
                //     $("#play_or_plause_player").click();
                //     //$("div.bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-start-btn button.blpui-btn.icon-btn").click(); //按暂停图标，不使用标签操作，防止干扰正常逻辑
                //     console.log('⏸&▶');
                //     return false;
                //
                // }
                if (keycode == 38) {
                    //   removeDefault(e);
                    /*					ctrl + up					*/

                    if (getDomPlayer().volume > 0.9) {
                        getDomPlayer().volume = 1;
                    } else {
                        getDomPlayer().volume += 0.1;
                    }
                    console.log('加音量');
                    return false;
                }
                if (keycode == 40) {
                    // removeDefault(e);
                    /*					ctrl + down					*/
                    if (getDomPlayer().volume < 0.1) {
                        getDomPlayer().volume = 0;
                    } else {
                        getDomPlayer().volume -= 0.1;
                    }
                    console.log('减音量');
                    return false;
                }
                // 静音
                // if(keycode == 83){
                // 	/*					ctrl + s					*/
                // 	getDomPlayer().volume = 0;
                // 	return false;
                // }

                if (keycode == 13) {
                    //    removeDefault(e);
                    //网页全屏

                    if (e.ctrlKey) {
                        /*					ctrl + enter					*/
                        $('#player_fullscreen_player').click();
                        console.log('网页全屏幕&退出全屏');
                        return false;
                    } else {
                        /*					enter					*/
                        $('#player_pagefullscreen_player').click();
                        console.log('全屏幕&退出全屏');
                        return false;
                    }

                }

                console.log(keycode + " not rejected");
                return;
            });
        };

        function unScroll() {
            var top = $(document).scrollTop();
            $(document).on('scroll.unable', function (e) {
                $(document).scrollTop(top);
            })
        };

        function init() {
            unScroll();
            setInterval(function () {
                var play = $('#error_msg_player');
                if (play.length == 1) {
                    window.location.reload();
                }
                ;

            }, 1000);
            $('#page_body > div:nth-child(24)').remove();
            $('#page_body > div.column_wrapper_13292').remove();
            $('#page_body > div.gwA18043_ind01').remove();
            $('#page_bottom').empty();
            var header = $('head');
            header.append('<link rel="stylesheet" href="https://i.tq121.com.cn/c/weather2015/bluesky/c_7d.css">');
            header.append('<link rel="stylesheet" href="https://i.tq121.com.cn/c/weather2017/headStyle_1.css">');
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://ip.if.iqiyi.com/cityjson",
                onload:function(data){
                    var city = eval(data.responseText+';returnIpCity.data.city;');
                    console.log(city);
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://toy1.weather.com.cn/search?cityname="+city,
                        onload:function(data){
//                             console.log(eval(data.responseText)[0].ref);
                            var code_o=eval(data.responseText)[0].ref;
                            var code = code_o.substring(0,code_o.search('(\d*)~'))
                            console.log(code);
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: "http://www.weather.com.cn/weather/"+code+".shtml",
                                onload: function(data) {
                                    //这里写处理函数
                                    var result = $(data.responseText).find('div #7d > ul');
                                    $('#page_bottom').attr('class','c7d');
                                    $('.sky',result).css('color','black');
                                    $('#page_bottom').append(result);
                                }

                            })
                        }

                    })
                }
            });
        }

        init();
        AddKeyListen();
    });
})();