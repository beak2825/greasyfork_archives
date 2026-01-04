// ==UserScript==
// @name         vbird_linux_prettify
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  美化《鸟哥的Linux私房菜》网站：用等宽字体显示所有代码；隐藏部分页面元素；
// @author       Yang Li
// @match        http://linux.vbird.org/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31277/vbird_linux_prettify.user.js
// @updateURL https://update.greasyfork.org/scripts/31277/vbird_linux_prettify.meta.js
// ==/UserScript==

$(document).ready(function(){
    // v0.1
    // v0.2
    //      1. 通过添加class来添加新的css规则，避免.attr()覆盖原有的font以外的规则（比如下划线）
    // v0.3
    //      1. 脚本更名：从 vbird-linux-monospaced-code 改为 vbird-linux-prettify
    //      2. 删除顶部和底部banner、左侧前一页按钮、右侧后一页按钮、左上方导航窗口、页面修订历史
    //      3. 浏览器窗口宽度改变时，正文区域随之调整
    //      4. 把正文区域放置在页面正中
    //      5. 调整最底部三个导航按钮的位置
    // v0.4
    //      1. 让代码区域根据正文区域调整宽度
    //      2. 浏览器窗口变窄时，图片宽度相应缩小；统一设置图片边框
    //      3. 例题区域根据浏览器窗口宽度调整
    //      4. 例题代码使用紫色等宽字体
    //      5. 重点强调语句（蓝色）使用橙色等宽字体
    //      6. 重点强调语句偶数行使用浅蓝色字体，避免视觉疲劳
    //      7. 增加文末习题答案可见度
    // v0.5
    //      1. 代码按照作用对象分组，便于维护
    //      2. 更改重点强调语句的颜色
    //      3. 图片宽度默认缩放到正文区域的80%，避免在手机上被缩放到较小尺寸
    //      4. 增大代码块宽度、显示字号，避免手机上代码字号太小
    // v0.6
    //      1. 专门为Firefox for Android增大代码字体
    //      2. 专门为Firefox for Android设置表格字体
    // v0.7
    //      1. 代码拆分更细致，不同用途的页面元素拆分成独立的语句
    

    // 网页整体结构

    $('.tablearea').css({'min-width':'400px','max-width':'1000px','width':'90%'});
    //$('.mainarea').css({'width':'100%','position':'static','float':'none'});

    // The last line of main content, which contains three links: PrePage, Home, NextPage
    $('.mainarea > div:last-child').css('margin-top','20px');

    // .toparea: header, which sets position:fixed
    // .bottomarea: footer, which sets position:fixed
    $('.toparea, .bottomarea').remove();

    // .nav: the navigation sidebar on the left
    //$('.nav').remove();

    // .leftarea: two less-than signs on the left, click it can jump to previous chapter
    // .rightarea: two greater-than signs on the right, click it can jump to next chapter
    $('.leftarea, .rightarea').remove();
    
    // 代码块
    $('<style> .monospaced_code {font: 14px "Anonymous Pro", monospace !important; line-height: 1.4 !important;} </style>').appendTo('head');
    $('table.term td *').addClass('monospaced_code');
    $('table.term').css({'display':'block','overflow':'auto','width':'98%'});
    $('pre').css({'width':'100%'});
    
    // 表格
    // $('table.news *').css('cssText','font: 16px serif !important;');

    // 图片
    // $('div > img').css({'max-width':'100%','width':'80%','border':'2px dotted #c0c'});
    $('div > img').css({'border':'2px dotted #c0c'});
    
    // 重点强调语句
    $('.text_import2').css({'font':'16px monospace','color':'#e60'});
    $('ul.text_import2 > li:nth-child(even)').css('color','#3DC2AC');

    // 例题
    $('table.exam').css({'display':'block','overflow':'auto','border':'2px dotted #c0c'});
    $('table.exam blockquote').css({'font':'14px monospace','color':'#c0c'});

    // 本章习题
    $('.blockex').css({'color':'#eee','font':'14px monospace'});
});
