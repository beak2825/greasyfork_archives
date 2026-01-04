// ==UserScript==
// @name         bilibili边栏隐藏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ！搭配Bilibili Evolved 自定义顶栏 使用 || 隐藏bilibili视频页右侧边栏
// @author       is
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @require        https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472417/bilibili%E8%BE%B9%E6%A0%8F%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/472417/bilibili%E8%BE%B9%E6%A0%8F%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    $(".right-container").hide()
    let ins = setInterval(() => {
        if ($(".custom-navbar.shadow").length==1) {
            clearInterval(ins);
            $(".custom-navbar.shadow").append("<input id='xsbl' type='button' value='显示边栏' style='font-size: 10pt;height: 100%;display: flex;align-items: center;background: unset;border: 0;cursor: pointer;'/>")
            $('#xsbl').hover(function() { // 鼠标悬浮时触发
                $('#xsbl').css('color', 'var(--brand_blue)')
                $('#xsbl').css('fill', 'var(--brand_blue)')
            }, function() { // 鼠标离开时触发
                $('#xsbl').css('color', 'unset')
                $('#xsbl').css('fill', 'unset')
            })
            $('#xsbl').click(function(){
                if($(".right-container").is(":hidden")){
                    $(".right-container").show()
                }else{
                    $(".right-container").hide()
                }
            })
        }
    }, 800);
})();