// ==UserScript==
// @license MIT
// @name         华医联播
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  华医网自动联播
// @author       lemondqs
// @match        https://cme42.91huayi.com/course_ware/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91huayi.com
// @grant        none

// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js
/* globals jQuery, $, waitForKeyElements */

// @downloadURL https://update.greasyfork.org/scripts/470095/%E5%8D%8E%E5%8C%BB%E8%81%94%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/470095/%E5%8D%8E%E5%8C%BB%E8%81%94%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        // var timer;
        console.info('script')
        function kaoshi() {
            var url = $('#jrks').attr('href')
            if (url.length>10) {
                $('#jrks').click()
                console.info('考试')
            }
        }

        window.player.HTML5.video.addEventListener('waiting', function () { //加载
            console.log("加载中");
            /**
            timer = setTimeout(function() {
                console.info('waiting')
                window.player.HTML5.play()
                console.info('waiting')
            }, 10000)
            */
        });
        window.player.HTML5.video.addEventListener('play', function () { //播放
            console.log("开始播放");
            // clearTimeout(timer)
        });
        window.player.HTML5.video.addEventListener('playing', function () { //播放中
            console.log("播放中");
        });

        window.player.HTML5.video.addEventListener('pause', function () { //暂停
            console.log("暂停");
            setTimeout(function() {
                window.player.HTML5.play()
            }, 700)
        });
        window.player.HTML5.video.addEventListener('ended', function () { //结束
            console.log("播放结束");
            setTimeout(function() {
                $('.lis-inside-content > .another-bg-two:first').parent('li').children('h2').click()
                // kaoshi()
            }, 700)
        }, false);
        window.openBangZhu = function() {
            closeBangZhu()
            window.player.HTML5.play()
            console.info('changed')
        }


        $('video').attr('muted', 'muted')
        window.player.HTML5.play()
        setTimeout(function() {
            window.openBangZhu = function() {
                closeBangZhu()
                window.player.HTML5.play()
                console.info('changed')
            }
            closeBangZhu()
            if($('.pv-icon-btn-play').is(':visible')) {
                $('.pv-icon-btn-play').click()
            }

            $('video').trigger('play');
            window.player.HTML5.play()
            console.info('tout1')
        }, 2000)

        setInterval(function(){
            console.info('in....')
            if ($('.signBtn').is(':visible')) {
                $('.signBtn').click();
                window.player.HTML5.play()
                console.info('点击成功')
            }
            window.player.HTML5.play()
        }, 5*1000);

    });
    // Your code here...
})();