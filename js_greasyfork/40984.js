// ==UserScript==
// @name		视频VIP替换
// @namespace	http://tampermonkey.net/
// @version		1.2
// @description	直接在视频页查看会员视频
// @author		You
// @match		*.iqiyi.com/v*
// @grant		none
// @run-at		document-start
// @require		https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/40984/%E8%A7%86%E9%A2%91VIP%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/40984/%E8%A7%86%E9%A2%91VIP%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var vip_parse_url = "https://danmu.sonimei.cn/player/?url=&url=";
    // 替换播放器


    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    }

    function gen_iqiyi_player(current_url) {
        console.log('ready to replace');
        // 生成替换源
        var request_url = '<iframe id="play_iframe" allowfullscreen="true" ' +
            'style="background-color: #dff0d8;" width="100%" height="100%" ' +
            'allowtransparency="true" frameborder="0" scrolling="no" ' +
            'src="' + vip_parse_url + current_url + '"></iframe>';
        console.log(request_url);
        return request_url;
    };

    function get_vip() {
        var current_url = window.location.href;
        var request_url = gen_iqiyi_player(current_url);
        if (current_url.indexOf("www.iqiyi.com") != -1) {
            $('#iframaWrapper').empty().html(request_url);

            $("#contentArea").remove();
            $("#block-AR").remove();
        }


    }

    setTimeout(function(){
        get_vip();
    }, 1000);

})();