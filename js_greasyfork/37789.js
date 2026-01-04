// ==UserScript==
// @name         视频VIP替换
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  直接在视频页查看会员视频
// @author       You
// @match        *v.youku.com/v_show/*
// @match        *.iqiyi.com/v*
// @grant        none
// @require https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/37789/%E8%A7%86%E9%A2%91VIP%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/37789/%E8%A7%86%E9%A2%91VIP%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取一级域名
    var domain = document.domain;
    function is_domain(domain_key){
        if (domain.indexOf(domain_key) != -1){
            return true;
        }else{
            return false;
        }
    }
    // 替换播放器
    function replace_original_player(){
        console.log('ready to replace');
        // 生成替换源
        var current_url = window.location.href;
        var request_url = '<iframe id="play_iframe" allowfullscreen="true" style="background-color: #dff0d8;" width="100%" height="100%" allowtransparency="true" frameborder="0" scrolling="no" src="http://xlyy100.com/xlyy.php?url=' + current_url +'" __idm_id__="347789313"></iframe>';
        // 根据各网站匹配替换规则
        if (is_domain('youku'))
        {
            $(".youku-film-player").empty();
            $('.youku-film-player').prepend(request_url);
        }
        else if(is_domain('iqiyi'))
        {
           //$('.pw-video').remove();
           //$('.videoArea').empty();
           // $('.videoArea').append(request_url);
        }
    }
    setTimeout(function(){ replace_original_player(); }, 10000);
})();