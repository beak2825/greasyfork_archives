// ==UserScript==
// @name         背景自动切换
// @namespace    http://wenhsing.com
// @version      0.1
// @description  Bg
// @author       Wenhsing
// @match        http://wenhsing.com
// @include      *
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/382783/%E8%83%8C%E6%99%AF%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/382783/%E8%83%8C%E6%99%AF%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 添加样式
    var wh_css = '<style>*{margin:0;padding:0}#wh-bg{position:fixed;width:100%;height:100%;z-index:-999}#wh-bg ul{list-style:none;position:absolute;width:100%;height:100%}#wh-bg li{position:absolute;width:100%;height:100%;opacity:1;transition:all 3s}#wh-bg img{display:block;width:100%;height:auto}#wh-bg .hide{opacity:0!important}</style>';
    $('head').append(wh_css);
    $('body').prepend('<div id="wh-bg"><ul></ul></div>');

    var wh_root= $("#wh-bg"),
        wh_url = '//wenhsing.com/bg/state_img/img.php',
        wh_index = 1,
        wh_show = function(index) {
            wh_root.find('li').addClass('hide');
            wh_root.find('li#wh-bg-'+(index || 0)).removeClass('hide');
        },
        wh_init = function(){
            var len = wh_root.find('li').length;
            if (len >= 3) {
                wh_root.find('ul').children('.hide').get(0).remove();
            }
            wh_root.find('ul').append('<li id="wh-bg-'+ wh_index +'" class="hide"><img src="'+ wh_url +'?index='+ wh_index +'" alt=""></li>');
            wh_show(wh_index-1);
            wh_index++;
        }
    $(document).ready(wh_init);
    var time = setInterval(wh_init,3000);
    // Your code here...
})();