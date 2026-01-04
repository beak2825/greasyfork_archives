
// ==UserScript==
// @name 厂长资源网自动播放
// @namespace http://tampermonkey.net/
// @version 0.1
// @description 显示搜索的参数
// @license 本人代码；
// @author You
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @include https://www.qianoo.cn/*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/449911/%E5%8E%82%E9%95%BF%E8%B5%84%E6%BA%90%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/449911/%E5%8E%82%E9%95%BF%E8%B5%84%E6%BA%90%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

GM_addStyle(".ul-play {width: 10%;display: flex;flex-direction: column;position: fixed;z-index: 999;top: 80px;}.ul-play>.btn-qp1{width: 100%;height: 50px;font-size: 18px;}.ul-play>.btn-qp2 {width: 100%;height: 50px;font-size: 18px;margin-top: 20px;}");

    window.onload = function () {
        // 累加数字
        var ixn

        //    判断存储累加
        if (sessionStorage.getItem('v') != undefined || sessionStorage.getItem('v') != NaN) {

            ixn = sessionStorage.getItem('v')
        } else {
            ixn = sessionStorage.setItem('v', 0)
        }

        function videoPlayName() {


            $('.juji_list a').each(function (i, item) {
                $(this).click(function (m, i) {
                    sessionStorage.removeItem('v')


                    ixn = $(this).index()
                    sessionStorage.setItem('v', $(this).index())
                })
            })
            console.log($(".dplayer .dplayer-video-wrap .dplayer-video-current"), '4111111');


            // 监听视频播放结束事件
            $(".dplayer-video-wrap .dplayer-video-current")[0].addEventListener('ended', function () {
                console.log('视频播放结束事件');
                //   视频播放结束
                ixn = Number(ixn) + 1
                sessionStorage.setItem('v', ixn)
                // 循环播放到第几个
                $('.juji_list a').each(function (i, item) {
                    if (i == sessionStorage.getItem('v')) {

                        let videoHref = $(this).trigger('click')[0].href
                        window.location.href = videoHref
                        console.log($(this).addClass('pbplay').siblings().removeClass('pbplay'), '点击当前项目是什么');

                        videoPlayName()
                        palyVidoe()
                        return

                    }
                })
            }, false)//结束
        }



        function palyVidoe() {
            setTimeout(() => {
                $(".dplayer-video-wrap>.dplayer-video-current").trigger('play')
                console.log($(".dplayer-video-wrap>.dplayer-video-current")[0], '79999++');
            }, 100);

            setTimeout(() => {
                $(".dplayer-video-wrap>.dplayer-video-current").prop('muted', true);
            }, 1000);
        }

        // 视频自动播放开始回调
        palyVidoe()
        //
        videoPlayName()


// 全屏事件和取消静音按钮
        function palyNextOne() {
            $('.playbox').append(`<div class="ul-play">
                <button class="btn-qp1">全屏模式</button>
                <button class="btn-qp2">取消静音模式</button>
            </div>`)

            $('.btn-qp2').on('click',function(){
                $(".dplayer-video-wrap>.dplayer-video-current").prop('muted', false);
            })


            // 全屏模式和退出全屏
            $('.btn-qp1').on('click', function () {
                // 全屏播放模式
                const isFullScreen = document.fullscreenElement

                if (isFullScreen) {
                    console.log('退出全屏')
                    if (document.exitFullscreen) {
                        document.exitFullscreen()
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen()
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen()
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen()
                    }
                } else {
                    var fullscreen = $(".dplayer-video-wrap .dplayer-video-current")[0]  // 需要全屏的元素
                    console.log('进入全屏')
                     $(".dplayer-video-wrap>.dplayer-video-current").prop('muted', false);
                    if (fullscreen.requestFullscreen) {
                        fullscreen.requestFullscreen()
                    } else if (fullscreen.mozRequestFullScreen) {
                        fullscreen.mozRequestFullScreen()
                    } else if (fullscreen.webkitRequestFullscreen) {
                        fullscreen.webkitRequestFullscreen()
                    } else if (fullscreen.msRequestFullscreen) {
                        fullscreen.msRequestFullscreen()
                    }
                }

            })
        }
        palyNextOne()
    }