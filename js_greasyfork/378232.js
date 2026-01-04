// ==UserScript==
// @name         起点朗读
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://read.qidian.com/chapter/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/378232/%E8%B5%B7%E7%82%B9%E6%9C%97%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/378232/%E8%B5%B7%E7%82%B9%E6%9C%97%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    var speed = 9;//朗读速度范围： 1 - 9

    // 不算Bug的Bug：由于Chrome安全策略默认刷新页面后不会自动播放，解决办法是Chrome打开地址`chrome://flags/#autoplay-policy`，允许为`No user gesture is required`，然后重启Chrome就可以了


    var $list = $('.j_readContent p');

    function doTTS(index){
        if (index >= $list.length) {
            return;
        }
        var text = encodeURIComponent($list[index].innerText);
        if (!$('#tts_autio_id').length) {
            var html = '<audio id="tts_autio_id" src="" ></audio>';
            $('body').append(html);
        }

        $list.css('color','black');
        $($list[index]).css('color','red');

        audio = document.getElementById('tts_autio_id');
        audio.loop = false;
        audio.addEventListener('ended', function () {
            doTTS(index+1);
        });
        audio.addEventListener('canplaythrough', function () {
           audio.play();
        });
        audio.src = 'https://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=' + speed + '&text='+ text;
        audio.load();
	}
    doTTS(0);
})();