// ==UserScript==
// @name         句子谜界面调整
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  优化句子浏览页面样式
// @author       nshu
// @include      *://*.juzimi.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery
// @downloadURL https://update.greasyfork.org/scripts/375813/%E5%8F%A5%E5%AD%90%E8%B0%9C%E7%95%8C%E9%9D%A2%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/375813/%E5%8F%A5%E5%AD%90%E8%B0%9C%E7%95%8C%E9%9D%A2%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

$(function (){
    $('body').css('opacity', 0).animate({
        opacity: 1
    })
    $('#wrapper').css({
        width: 'auto',
        'max-width': '1200px'
    })
    $('#container').css({
        display: 'flex',
        'justify-content': 'space-around',
        'align-items': 'flex-start',
        'margin': '30px 0'
    })
    $('#comments #commentsin').css('width', '630px');
    //头部底部隐藏
    $('#header').css({'width': '1063px', 'margin-left': '32px'});
    $('#navbar').css('background', 'url(//img.juzimi.com/juzimi/images/navbarback.png) no-repeat top center / 100% 100%');
    $('#header, #footer').hide();

    $(document).dblclick(function (){
        if ($('#header').is(':visible')) {
            $('#header').hide();
        } else {
            $('#header').show();
        }
    })
    //页面主版块隐藏
    $('#block-views-flag_lists_content-block_1, #block-views-whoflag-block_1, #block-views-hottags-block_1, #xqrightbottom, #block-block-16, #jubigshare, #xqjucommentbegin, #hm_t_8206, #xqriqrc').hide();
    $('#xqbdtrackjuaddpic, #xqbdtrackjuaddqrcode, .nodediveditlink, .nodcomlink, #community-tags-form, #jushare, .previous-next-links').hide();
    //句子背景
    $('#sendiv #sendivin, #sendiv #sendivin .node .content, #sendiv #sendivin .submitted').css('background', 'none');
    $('#sendiv #sendivin .node .content #sencon, #xqtitle').css('border', 'none');
    //随机下一个按钮
    $('#sidebar-right').append('<div id="right-random-btn" style="text-align: center">'+ $('#xqbdtrackouyu')[0].outerHTML + '</div>');
    $('#right-random-btn a').css({
        display: 'inline-block',
        'font-size': '60px',
        'font-family': 'CURSIVE',
        'line-height': '75px',
        transition: 'all .3s',
        cursor: 'pointer',
        margin: '15px 30px',
        width: '90px',
        height: '90px',
        'border-radius': '50%',
        'text-align': 'center',
        position: 'relative',
        'z-index': 1,
        border: '5px solid #708090',
        background: '#fff',
        color: '#708090',
        'box-shadow': '0 0 5px rgba(0,0,0,.8)',
        transform: 'scale(1)'
    })
    $('#right-random-btn a').text(' ').append('<svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5000"><path d="M142.456 429.848l90.32 337.088a26.84 26.84 0 0 0 32.872 18.984l333.384-89.328a26.84 26.84 0 0 0 18.976-32.88l-90.32-337.088a26.84 26.84 0 0 0-32.872-18.976L161.432 396.976a26.84 26.84 0 0 0-18.976 32.88z m-17.856-83.744L501.28 245.176c33.368-8.936 67.728 11.12 76.76 44.808L679.92 670.28c9.024 33.68-10.704 68.24-44.064 77.176L259.184 848.4c-33.36 8.936-67.728-11.12-76.752-44.808L80.536 423.28c-9.032-33.68 10.704-68.24 44.064-77.184zM263.6 504.304c21.48-5.76 34.184-28 28.368-49.68-5.808-21.68-27.928-34.6-49.408-28.84-21.472 5.752-34.176 28-28.368 49.68 5.816 21.68 27.936 34.592 49.408 28.84z m272 161.072c21.48-5.76 34.176-28 28.368-49.68-5.808-21.688-27.928-34.6-49.408-28.848-21.48 5.76-34.176 28-28.368 49.68 5.808 21.68 27.936 34.6 49.408 28.848zM397.52 585.896c21.48-5.76 34.176-28 28.368-49.68-5.808-21.68-27.928-34.6-49.408-28.84-21.48 5.76-34.176 28-28.368 49.68 5.808 21.68 27.928 34.6 49.408 28.84z m245.648-269.632c-3.976 12.24-17.032 18.96-29.152 15.024-12.12-3.936-18.72-17.048-14.744-29.28l7.96-27.336c7.648-23.544 32.752-36.488 56.08-28.912l240.2 78.04c23.32 7.584 36.016 32.808 28.368 56.352l-78.8 242.512c-7.648 23.544-32.752 36.488-56.072 28.912l-108.264-34.512c-12.12-3.944-18.72-17.056-14.744-29.288 3.976-12.24 17.024-18.96 29.144-15.032l81.168 25.872a26.84 26.84 0 0 0 33.68-17.28l61.16-188.24a26.84 26.84 0 0 0-17.232-33.816l-185.952-60.416a25.84 25.84 0 0 0-32.8 17.4z m74 172.76c-17.632-5.72-27.232-24.784-21.448-42.576 5.784-17.792 24.752-27.576 42.376-21.848 17.624 5.72 27.224 24.792 21.44 42.576-5.784 17.792-24.752 27.576-42.376 21.848z" p-id="5001"></path></svg>');
    $('#right-random-btn').append('<style>#right-random-btn a:hover { color: white !important; background: #708090 !important; transform: scale(1.1) !important; transition: all .3s } #right-random-btn a:focus { transform: scale(1) !important; } #xqtitle a { font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif !important; font-size: 20px;} #sendiv #sendivin #xqtitle { border: none !important; }</style>')

    var $h1 = $('#xqtitle')
    var $h1Copy = $h1.clone()
    $h1.replaceWith($h1Copy)
})