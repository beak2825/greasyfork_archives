// ==UserScript==
// @name         live2d
// @name:zh-TW   一瞥惊鸿
// @namespace    /
// @version      0
// @description  装饰
// @description:zh-TW  自己动手丰衣足食
// @author       不告诉你
// @include      *
// @exclude  *://*.*.*.*:*
// @exclude  *://*.*.*.*/*
// @require      https://cdn.jsdelivr.net/npm/live2d-widget-model@1.0.1/dist/live2d.min.js
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/482508/live2d.user.js
// @updateURL https://update.greasyfork.org/scripts/482508/live2d.meta.js
// ==/UserScript==

try {
    $("<link>").attr({href: "https://cdn.jsdelivr.net/gh/dbconf/cdn-cloud/waifu.min.css", rel: "stylesheet", type: "text/css"}).appendTo('head');
    $('body').append('<div class="waifu"><div class="waifu-tips"></div><canvas id="live2d" class="live2d"></canvas><div class="waifu-tool"><span class="fui-home"></span> <span class="fui-chat"></span> <span class="fui-eye"></span> <span class="fui-user"></span> <span class="fui-photo"></span> <span class="fui-info-circle"></span> <span class="fui-cross"></span></div></div>');
    $.ajax({url: "https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js", dataType:"script", cache: true, success: function() {
    $.ajax({url: "https://cdn.jsdelivr.net/npm/jquery-ui-dist/jquery-ui.min.js", dataType:"script", cache: true, success: function() {
    $.ajax({url: "https://cdn.jsdelivr.net/gh/dbconf/cdn-cloud//waifu-tips.min.js", dataType:"script", cache: true, success: function() {
    $.ajax({url: "https://cdn.jsdelivr.net/gh/dbconf/cdn-cloud/live2d.min.js", dataType:"script", cache: true, success: function() {
 
    live2d_settings['hitokotoAPI']  = 'jinrishici.com';  // 一言 API，可选 'lwl12.com', 'hitokoto.cn', 'jinrishici.com'(古诗词)
    live2d_settings['modelId']='32';
    live2d_settings['modelTexturesId']='32';
    live2d_settings['waifuSize'] = '180x300';      // 看板娘大小，例如 '280x250', '600x535'
    live2d_settings['waifuTipsSize'] = '200x70';   // 提示框大小，例如 '250x70', '570x150'
    live2d_settings['waifuFontSize'] = '16px';     // 提示框字体，例如 '12px', '30px'
    live2d_settings['waifuToolFont'] = '16px';     // 工具栏字体，例如 '14px', '36px'
    live2d_settings['waifuToolLine'] = '18px';     // 工具栏行高，例如 '20px', '36px'
    live2d_settings['waifuToolTop'] = '30px','10px';      // 工具栏顶部边距，例如 '0px', '-60px'
    live2d_settings['modelStorage'] = 'true';
    live2d_settings['waifuMinWidth'] = '50px';    // 面页小于 指定宽度 隐藏看板娘，例如 'disable'(禁用), '768px'
    live2d_settings['waifuEdgeSide'] = 'right:80';     //  看板娘贴边方向，'left:0', 'right:30'
    live2d_settings['waifuDraggable'] = 'unlimited';   //拖拽样式，例如 'disable'(禁用), 'axis-x'(只能水平拖拽), 'unlimited'(自由拖拽)
    live2d_settings['modelTexturesRandMode']= 'switch';
       initModel("https://cdn.jsdelivr.net/gh/dbconf/cdn-cloud//waifu-tips.json");
        }});
    }});
    }});
    }});

} catch(err) { console.log("[Error] JQuery is not defined.") }