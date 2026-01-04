// ==UserScript==
// @name         自定义网站样式
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  自定义相关网站的样式：增加油猴脚本更新脚本页面编辑框的高度 | 控制jupyter页面代码执行后生成元素的高度
// @author       myaijarvis
// @icon         https://greasyfork.org/packs/media/images/blacklogo16-5421a97c75656cecbe2befcec0778a96.png
// @match        http://localhost:*/lab*
// @match        http://localhost:*/notebooks/*
// @match        https://greasyfork.org/zh-CN/scripts/*/versions/new
// @match        https://labuladong.gitee.io/*
// @match        https://leetcode-cn.com/problems/*
// @match        https://www.cnblogs.com/*/p/*
// @match        https://www.cnblogs.com/*/articles/*
// @match        https://www.cnblogs.com/*/archive/*
// @match        https://mp.weixin.qq.com/s/*
// @match        https://github.com/*/*
// @match        https://www.jianshu.com/p/*
// @match        https://www.bilibili.com/video/*
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/437032/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E7%AB%99%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/437032/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E7%AB%99%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const url=document.URL || '';

    if (url.includes('/lab') || url.includes('/notebooks')){
        // 需要等内容加载
        setInterval(()=>{
            $('.CodeMirror-code').css({'font-size': '16px','font-family': 'Consolas'});
            $('pre').css({'font-size': '16px','font-family': 'Consolas','max-height':'30em'});
        },2000);
        return;
    }

    if (url.match('greasyfork\.org\/(.*?)\/scripts\/(.*?)\/versions\/new')){
        //console.info("setMaxHeight");
        let height='500px'; // textarea的高度
        $('#script-version-additional-info-0').css({'height':height});
        $('#script_version_changelog').css({'height':'200px'});
        return;
    }

    if (url.includes('labuladong.gitee.io')){
        $('#body-inner a').css({'color':'blue','text-decoration':'underline'});
        $('a').attr('target','_blank');
        return;
    }

    if (url.includes('leetcode-cn.com/problems')){
        // 需要等内容加载
        setTimeout(()=>{
            $(".light").on("DOMNodeInserted", function (e) {
                // console.info("2");
                $('.brief_container a').css({'color':'blue','text-decoration':'underline'});
            });
        },3000);
        return;
    }
    if (url.match('cnblogs.com\/.*?\/p\/.*?') || url.match('cnblogs.com\/.*?\/articles\/.*?') || url.match('cnblogs.com\/.*?\/archive\/.*?')){
        // 需要等内容加载
        setTimeout(()=>{
            $(".blogpost-body *").css({'font-size': '16px','letter-spacing': '0.05em'});
        },2000);
        return;
    }
    if (url.includes('mp.weixin.qq.com/s')){
        // 需要等内容加载
        setTimeout(()=>{
            $('a').css({'color':'blue','text-decoration':'underline'});
            $('code').css({'font-size':'14px'});
        },3000);
        return;
    }
    if (url.match('github\.com\/.*?\/.*?')){
        // 需要等内容加载
        setTimeout(()=>{
            $('.markdown-body a').css({'color':'blue','text-decoration':'underline'});
        },3000);
        return;
    }
    if (url.match('jianshu\.com\/p\/.*?')){
        // 需要等内容加载
        setTimeout(()=>{
            $('article a').css({'color':'blue','text-decoration':'underline'});
        },3000);
        return;
    }
    if (url.match('bilibili\.com\/video\/.*?')){
        // 需要等内容加载
        setTimeout(()=>{
            $('#multi_page').css({'width':'125%'});
            $('.base-video-sections').css({'height':'600px'});
            $('.video-sections-content-list').css({'height':'500px','max-height':'500px'});
        },3000);
        return;
    }


})();