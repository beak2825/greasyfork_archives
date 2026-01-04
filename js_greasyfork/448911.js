// ==UserScript==
// @name         简化b站导航栏
// @namespace    http://tampermonkey.net/
// @version      0.14
// @license      GPL
// @description  点换一换会让页面上的那个广告再显示出来
// @author       bahyqn
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @note         2023-10-15-V0.14 重新改了下代码
// @downloadURL https://update.greasyfork.org/scripts/448911/%E7%AE%80%E5%8C%96b%E7%AB%99%E5%AF%BC%E8%88%AA%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/448911/%E7%AE%80%E5%8C%96b%E7%AB%99%E5%AF%BC%E8%88%AA%E6%A0%8F.meta.js
// ==/UserScript==

(function () {
        'use strict';

        // Your code here...

        function remove_index() {

            let left_entry = document.getElementsByClassName('left-entry')[0].style.visibility = 'hidden';
            let right_entry = null;
            let time = setInterval(function () {
                right_entry = document.getElementsByClassName('bili-header__bar')[0].getElementsByClassName('right-entry')[0];
                if (right_entry != null) {
                    let lis = right_entry.querySelectorAll('.v-popover-wrap');
                    lis[1].style.display = 'none';
                    lis[2].style.display = 'none';
                    lis[3].style.display = 'none';
                    clearInterval(time)
                }
            }, 200);

            // 六个视频上的菜单
            var bili_header__channel = document.getElementsByClassName('bili-header__channel');
            bili_header__channel[0].remove();

            var bili_layout = document.getElementsByClassName('feed2');
            bili_layout[0].style.marginTop = "2rem";

            // 六个视频左边的那个窗口
            var recommended_swipe = document.getElementsByClassName('recommended-swipe grid-anchor');
            // console.log(recommended_swipe);
            recommended_swipe[0].remove();

            var body = document.getElementsByClassName('feed-card');
            //console.log(body);
            remove_ad();
        }

        function remove_ad(){
            var body = document.getElementsByClassName('feed-card');
            //console.log(body);

            let flag = 0;
            for(let i = 0; i < body.length; i++){
                //body[i].style.marginTop = "2rem";
                let child = body[i].getElementsByClassName('bili-video-card is-rcmd');
                child = body[i].getElementsByClassName('bili-video-card is-rcmd');
                child = body[i].getElementsByClassName('bili-video-card__wrap __scale-wrap');
                child = body[i].getElementsByClassName('');
                child = body[i].getElementsByClassName('bili-video-card__info __scale-disable');
                child = body[i].getElementsByClassName('bili-video-card__info--right');
                child = body[i].getElementsByClassName('bili-video-card__info--bottom');
                child = body[i].getElementsByClassName('bili-video-card__info--ad');

                if(child.length > 0){
                    flag = i;
                }
            }
            body[flag].remove();
        }

        function remove_video() {

            let right_entry = null;
            let time = setInterval(function () {
                right_entry = document.getElementsByClassName('bili-header__bar')[0].getElementsByClassName('right-entry')[0];
                if (right_entry != null) {
                    let left_entry = document.getElementsByClassName('left-entry')[0].style.visibility = 'hidden';
                    let lis = right_entry.querySelectorAll('.v-popover-wrap');
                    lis[1].style.display = 'none';
                    lis[2].style.display = 'none';
                    lis[3].style.display = 'none';
                    clearInterval(time)
                }
            }, 200);
        }

        function remove_other() {
            var li = document.getElementsByTagName('li');
            console.log('remove_other');
            console.log(li);
            for (let i = 0; i < 10; i++) {
                li[i].style.visibility = "hidden";
            }

            let right_div = null;
            let time = setInterval(function () {
                right_div = document.getElementsByClassName('user-con signin').item(0);
                if (right_div != null) {
                    let child = right_div.querySelectorAll('.item');
                    console.log(child)
                    for (let i = 1; i < 5; i++) {
                        child[i].remove();
                    }
                    clearInterval(time);
                }
            }, 200);
        }

        function remove_search() {
            // remove search
            let left_entry = document.getElementsByClassName('left-entry')[0].style.visibility = 'hidden';
            let right_entry = null;
            let time = setInterval(function () {
                right_entry = document.getElementsByClassName('bili-header__bar')[0].getElementsByClassName('right-entry')[0];
                if (right_entry != null) {
                    let lis = right_entry.querySelectorAll('.v-popover-wrap');
                    lis[1].style.display = 'none';
                    lis[2].style.display = 'none';
                    lis[3].style.display = 'none';
                    clearInterval(time)
                }
            }, 200);
        }

        window.onload = function () {
            let url_list = window.location.href.split('bilibili.com');
            console.log(url_list);

            if (url_list[1].length <= 3) {
                remove_index();
            } else if (url_list[1].indexOf('all') == 1){
                remove_search();
            } else if (url_list[1].indexOf('video') == 1) {
                remove_video()
            } else {
                remove_other();
            }
        }
    }

)();
