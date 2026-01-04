// ==UserScript==
// @name         C语言开发环境美化(中国大学MOOC)
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  为按钮增加解释性文字
// @author       AN drew
// @match        http://clin.icourse163.org/
// @match        http://59.111.100.189/
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408450/C%E8%AF%AD%E8%A8%80%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E7%BE%8E%E5%8C%96%28%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408450/C%E8%AF%AD%E8%A8%80%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E7%BE%8E%E5%8C%96%28%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("head").append('<link rel="shortcut icon" href="//edu-image.nosdn.127.net/32a8dd2a-b9aa-4ec9-abd5-66cd8751befb.png?imageView&amp;quality=100">')

    var map = new Map();
    map.set("format_align_left"," 代码格式化");
    map.set("help"," 帮助");
    map.set("open_in_browser"," 上传代码");
    map.set("file_download","下载当前代码");
    map.set("play_arrow","运行");
    map.set("bug_report","调试");
    map.set("brightness_7"," 切换日间/夜间模式");
    map.set("brightness_2"," 切换日间/夜间模式");

    $(".material-icons").each(function(){
        $(this).after($('<span>'+map.get($(this).text())+'</span>'))
    })

})();