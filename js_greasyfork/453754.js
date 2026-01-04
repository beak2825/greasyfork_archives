// ==UserScript==
// @name         youtube buffer enhence 缓冲增加 2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  youtube buffer enhence: fork from https://greasyfork.org/zh-CN/scripts/442685-youtube-buffer-enhence-%E7%BC%93%E5%86%B2%E5%A2%9E%E5%8A%A0
// @author       You
// @match        https://www.youtube.com/watch?v*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pastebin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453754/youtube%20buffer%20enhence%20%E7%BC%93%E5%86%B2%E5%A2%9E%E5%8A%A0%202.user.js
// @updateURL https://update.greasyfork.org/scripts/453754/youtube%20buffer%20enhence%20%E7%BC%93%E5%86%B2%E5%A2%9E%E5%8A%A0%202.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Youtube for peoples with extremely slow connexion. Like me.
    // All hacks like media.mediasource.enabled, media.cache_readhead_limit, etc. don't work ?
    // This is a manual JS way to force it.
    /*
    What it does :
    It pauses your youtube video. When video stop buffering it manually move the seeker to force the download.
    When the download is finished, it place the cursor back to it's original position. You are then ready to play a fully buffered video.
    */

    /*
    How to use :
    Paste this script in the console of your browser (F12 > Console). Tested on Firefox Linux.
    */

    // Note : Maximize your "browser.cache.disk.capacity" (type "about:config" in Firefox) if you are loading long videos

    // Youtube for peoples with extremely slow connexion. Like me.
    // All hacks like media.mediasource.enabled, media.cache_readhead_limit, etc. don't work ?
    // This is a manual JS way to force it.

    /*
    What it does :
    It pauses your youtube video. When video stop buffering it manually move the seeker to force the download.
    When the download is finished, it place the cursor back to it's original position. You are then ready to play a fully buffered video.
    */

    /*
    How to use :
    Paste this script in the console of your browser (F12 > Console). Tested on Firefox Linux.
    */

    // Note : Maximize your "browser.cache.disk.capacity" (type "about:config" in Firefox) if you are loading long videos

    const success = [
        'background: rgba(0,204,0,0.2)',
        'color: yellow',
        'display: block',
        'text-align: left'
    ].join(';');

    const failure = [
        'background: rgba(255,0,0,0.2)',
        'color: yellow',
        'display: block',
        'text-align: left'
    ].join(';');

    const warning = [
        'background: rgba(55, 102, 0,0.2)',
        'color: orange',
        'display: block',
        'text-align: left'
    ].join(';');

    console.info('%c Youtubeforce ftw!', success);
    var current_download = 0;
    var previous_download = 0;
    var loop_since_download = 0;
    var loop = 1;
    var player = document.getElementById('movie_player');
    var duration = player.getDuration();
    var first_chunk_loaded = Math.round(player.getVideoLoadedFraction() * 100);
    var last_chunk_loaded = 0;
    var first_buffer_time = false;
    var waiter = 0;
    var total_restart_buffer = 0;
    //var v_title =document.querySelector("#container > h1").children[0].innerHTML;
    var v_title = document.querySelector("title").innerHTML;
    function update_current_chunk_loaded(current_chunk_loaded) {
        //get id loaded_progress
        // select #container > h1 as h1
        var h1 = document.querySelector("#container > h1");

        var loaded_progress = document.getElementById('loaded_progress');
        //add loaded_progress after h1
        h1.children[0].innerHTML = v_title + " - " + current_chunk_loaded + "%";
    }

    function loading_video() {
        if (player && player.getPlayerState() == 2) {
        } else {
            return;
        }
        if (waiter > 0) {
            waiter--;
            console.log("We are waiting...");
            return;
        }
        if (player.getVideoLoadedFraction() == "NaN") {
            waiter = 3;
            console.log("%c Error getting stream. Waiting..., wait "+waiter+" loops", error);
            return;
        }
        
        var d = new Date();
        current_download = player.getVideoLoadedFraction();
        // Try to buffer if buffer is not at the end
        console.log("getVideoLoadedFraction: "+player.getVideoLoadedFraction());
        if (player.getVideoLoadedFraction() != 1) {
            // Video is not loading anymore...
            if (current_download == previous_download) {
                // Video buffer is stop. wait a bit.
                loop_since_download++;
                if (loop_since_download > 1) {
                    if (loop_since_download > 10) {
                        waiter = 3;
                        console.log("%c Slow connexion..., pause for "+waiter+" loops " + d, error);
                    }
                    if (!first_buffer_time) {
                        first_buffer_time = player.getCurrentTime();
                    }
                    console.log("%c Restart buffer (10 loops since last download), and pause for 10 loops... (already restarted " + total_restart_buffer + " times " + d, warning);
                    // sectotal * byteLoaded / byteTotal = sec loaded
                    var current_time_loaded = player.getDuration() * player.getVideoLoadedFraction();
                    player.seekTo(current_time_loaded - 2); // - 2sec
                    player.pauseVideo();
                    waiter = 1;
                    total_restart_buffer++;
                }
                // Video is still loading...
            } else {
                previous_download = player.getVideoLoadedFraction();
                loop_since_download = 0;
                var current_chunk_loaded = Math.round(player.getVideoLoadedFraction() * 100);
                console.info("%c Video is buffering properly (" + current_chunk_loaded + "%). " + loop + " loops, and " + loop_since_download + " iteration since last chunk, wait 10 loops " + d, success);
                waiter = 1;
                update_current_chunk_loaded(current_chunk_loaded);
            }
            loop++;
        } else {
            last_chunk_loaded = Math.round(player.getVideoLoadedFraction() * 100);
            console.log("%c Everything is loaded or the tab is inactive... Wait 50sec. Total number of buffer restart : " + total_restart_buffer + " and Total buffered : " + last_chunk_loaded + "%. Buffered on launch : " + first_chunk_loaded, success);
            waiter = 5;
            // restarting to first buffer and play
            if (first_buffer_time) {
                player.seekTo(first_buffer_time);
                first_buffer_time = false;
                // 主线程调用worker.postMessage()方法，向 Worker 发消息。
                pollingWorker.postMessage('done');
                pollingWorker.terminate();
            }
        }
    }


    function createWorker(f) {
        var blob = new Blob(['(' + f.toString() + ')()']);
        var url = window.URL.createObjectURL(blob);
        var worker = new Worker(url);
        return worker;
    }

    var pollingWorker;

    player.addEventListener('onStateChange', function (event) {
        console.log("onStateChange: "+event);
        if (event == 0) {
            // 0（已结束）
        }
        else if (event == 1) {
            // 1（正在播放）
            console.log("正在播放...");
            if (pollingWorker) {
                // 主线程调用worker.postMessage()方法，向 Worker 发消息。
                pollingWorker.postMessage('done');
                pollingWorker.terminate();
            }
        }
        else if (event == 2) {
            // 2（已暂停）
            console.log("已暂停...");
            pollingWorker = createWorker(function (e) {
                var inter = setInterval(function () {
                    // console.log(new Date().toLocaleString());
                    // 向主线程中发送数据
                    self.postMessage(1);
                }, 3 * 1000);
                self.onmessage = function (e) {
                    if (e.data == 'done') {
                        this.clearInterval(inter);
                        self.close();
                    }
                }
            });

            // 主线程调用worker.postMessage()方法，向 Worker 发消息。
            // pollingWorker.postMessage('init');

            // 主线程通过worker.onmessage指定监听函数，接收子线程发回来的消息。事件对象的data属性可以获取 Worker 发来的数据。
            pollingWorker.onmessage = function (event) {
                loading_video()
            }
        }
        else if (event == 3) {
            // 3（正在缓冲）
        }
        else if (event == 5) {
            // 5（视频已插入）
        }
        else {
            //         -1（未开始）
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        //get container > h1 innerHTML
        var h1 = document.querySelector("#container > h1");
        var v_title = h1.children[0].innerHTML;
    });
})();
