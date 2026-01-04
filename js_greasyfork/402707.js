// ==UserScript==
// @name         U慕课助手
// @namespace    https://code016.com/
// @version      0.1
// @description  替换视频为指定视频
// @author       Quan
// @match        http://umooc.gdgm.cn/meol/microlessonunit/*
// @require    http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download

// @downloadURL https://update.greasyfork.org/scripts/402707/U%E6%85%95%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/402707/U%E6%85%95%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    //'use strict';

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://code016.com/randVideos.php",
        onload: function(response) {
            console.log(response.responseText);
        }
    })
    // Freedom of network
    function check_freedom_of_network() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://hunhun.appspot.com/api/status/json/data.json',
            timeout: 2000,
            responseType: 'json',
            onload: response => {
                if (response.readyState === 4 && response.status === 200 && response.response.status === true) {
                    GM_setValue('FREEDOM_OF_NETWORK', true);
                }
            },
            onerror: error => {
                GM_setValue('FREEDOM_OF_NETWORK', false);
            },
            ontimeout: timeout => {
                GM_setValue('FREEDOM_OF_NETWORK', false);
            }
        });
    }
    check_freedom_of_network();

    var isvideo = 0;
        var multiple = 1.5;
        var vid_arr = ["https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/25330672_f5271b6b21f7fd676abb57b79ae77579.mp4",
                           "https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/25330672_7bc05434db879d66064b60519b916e3b.mp4",
                           "https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/25330672_7d91521b7af892418572ae4e6c85c5f9.mp4",
                           "https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/25330672_f15f8d6c9f9aa02390c4bdb875833d86.mp4",
                           "https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/25330672_7f8b63dd9aeb13d7c9ae911df174c83b.mp4",
                           "https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/607272_94e4fb00fe7b9576df9d7958fe609ccc.mp4",
                           "https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/607272_2fc490269fcdf87707804278a309891a.mp4",
                           "https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/607272_63d6246c6ab64e4c43ccb773778e02a4.mp4",
                           "https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/607272_18e07cef507ae4be6ca24eca740d2bf2.mp4",
                           "https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/607272_373beb1043e8dae94026e937085934d0.mp4"
                          ];
    var randInt = Math.ceil(Math.random()*10);
    $(document).ready(function(){


        // 倍数
        document.querySelector('video').playbackRate = multiple;
        $(".type_1").click(function(){
                document.getElementById('ckplayer_video').playbackRate = multiple;
        });
    })
    
})();