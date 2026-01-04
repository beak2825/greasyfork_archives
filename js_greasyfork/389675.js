// ==UserScript==
// @name         郑州大学远程教育html5视频倍速播放插件
// @namespace    QQ:2535688890
// @version      1.3
// @description  郑州大学远程教育html5视频倍速播放插件，只为提高学习效率，使用时注意浏览器要在【极速模式】状态下才能正常加载插件，兼容ie的模式不能正常加载插件！有问题可以加vx：2535688890进行反馈。
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @author       vx:2535688890
// @match        http://cod2018.zzu.edu.cn/codplay/*/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389675/%E9%83%91%E5%B7%9E%E5%A4%A7%E5%AD%A6%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2html5%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/389675/%E9%83%91%E5%B7%9E%E5%A4%A7%E5%AD%A6%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2html5%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($('.c').length == 1) {
        $('.c').append('<div class="Rate">倍速播放:<br><hr></div>');
        $('.Rate').css({ "background-color": "antiquewhite" });
        $('.Rate').append('<button onclick="javascript:player0.playbackRate = 1">1倍</button>');
        $('.Rate').append('<button onclick="javascript:player0.playbackRate = 1.25">1.25倍</button>');
        $('.Rate').append('<button onclick="javascript:player0.playbackRate = 1.5">1.5倍</button>');
        $('.Rate').append('<button onclick="javascript:player0.playbackRate = 1.75">1.75倍</button>');
        $('.Rate').append('<button onclick="javascript:player0.playbackRate = 2">2倍</button>');
        $('.Rate').append('<button onclick="javascript:player0.playbackRate = 3">3倍</button>');
        $('.Rate button').css({ "width": "15%", "background-color": "#35de0b", "border-color": "aqua", "font-size": "30px", "border-width": "4px", "margin": "5px" });
    }
    if ($('.video_small').length == 1) {
        $('.video_small').append('<div class="Rate">倍速播放:<br><hr></div>');
        $('.Rate').css({ "background-color": "antiquewhite" });
        $('.Rate').append('<button onclick="javascript:my_video1.playbackRate = 1">1倍</button>');
        $('.Rate').append('<button onclick="javascript:my_video1.playbackRate = 1.25">1.25倍</button>');
        $('.Rate').append('<button onclick="javascript:my_video1.playbackRate = 1.5">1.5倍</button>');
        $('.Rate').append('<button onclick="javascript:my_video1.playbackRate = 1.75">1.75倍</button>');
        $('.Rate').append('<button onclick="javascript:my_video1.playbackRate = 2">2倍</button>');
        $('.Rate').append('<button onclick="javascript:my_video1.playbackRate = 3">3倍</button>');
        $('.Rate button').css({ "width": "46%", "background-color": "#35de0b", "border-color": "aqua", "font-size": "30px", "border-width": "4px", "margin": "5px" });
    }
})();