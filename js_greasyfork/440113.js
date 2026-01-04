// ==UserScript==
// @name         语雀夜间模式
// @namespace    https://greasyfork.org/users/670174
// @version      0.2.7
// @description  让语雀的编辑模式显示成夜间模式的配色，保护眼睛。阅读模式因为是编译出来的样式表，有失效的可能。
// @author       CWBeta
// @icon         https://www.google.com/s2/favicons?domain=yuque.com
// @include      *yuque.com*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440113/%E8%AF%AD%E9%9B%80%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/440113/%E8%AF%AD%E9%9B%80%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
(function() {
    'use strict';

    console.log("【语雀夜间模式】运行中！")

    // 可以用户自定义的颜色
    var MAIN_BG_COLOR = "#333333"; //背景色
    var TOOLBAR_BG_COLOR = "#242424"; //顶部工具栏背景色
    var TOOLBAR_BORDER_COLOR = "#000000"; //顶部工具栏描边色
    var FONT_DEFAULT_COLOR = "#ffffff"; //默认正文颜色
    var LINK_COLOR = "#39C5BB"; // 正文链接颜色
    var LIST_COLOR = "#66CCFF"; // 列表记号颜色
    var FONT_SIDEBAR_COLOR = "#727272"; //侧面大纲正文颜色
    var FONT_SIDEBAR_HOVER_COLOR = "#999999"; //侧面大纲鼠标悬停颜色
    var SCROLLBAR_BG_COLOR = "#262626"; //大纲滚动条背景色

 /**
 * 16进制色值获取反色设置方法
 * @param  {String} oldColor 为16进制色值的字符串（例：'#000000'）
 * @return {String} 返回反色的色值（例：'#ffffff'）
 */
    function ReverseColor(oldColor)
    {
        oldColor = '0x' + oldColor.replace(/#/g, '');
        let str = '000000' + (0xFFFFFF - oldColor).toString(16);
        return '#'+ str.substring(str.length - 6, str.length);
    }
    function Awake()
    {
        var style = document.createElement("style");
        style.type = "text/css";
        var cssString = ".main-wrapper #main, .ne-editor-body,.ne-editor-extra-box,.ne-editor-wrap-box,.ant-input {background-color: "+MAIN_BG_COLOR+" !important;}"+
            ".main-wrapper #article-title, ne-text{color:"+FONT_DEFAULT_COLOR+";}"+
            ".ant-input{color:"+FONT_DEFAULT_COLOR+" !important;}"+
            ".ne-ui{filter: invert(100%); background-color: "+ReverseColor(TOOLBAR_BG_COLOR)+" !important;}"+
            ".ne-ui .ne-ui-random-tip{color:"+ReverseColor(FONT_DEFAULT_COLOR)+" !important;}"+
            ".ne-ui .ne-ui-toolbar-insert-card,.ne-ui .ant-dropdown,.ne-embed-icon-t-font-color #矩形,.ne-embed-icon-t-bg-color path[fill], .lark-editor-collab-users, #lake-doc-publish-button{filter: invert(100%);}"+
            ".lark-editor-header{filter: invert(100%);background-color: "+ReverseColor(TOOLBAR_BG_COLOR)+";border-color:"+ReverseColor(TOOLBAR_BORDER_COLOR)+" !important;}"+
            ".lark-editor-header .lark-editor-header-back{border-color: "+ReverseColor(TOOLBAR_BORDER_COLOR)+" !important;}"+
            ".ne-viewer-toc-sidebar,.ne-toc-sidebar{background-color: "+MAIN_BG_COLOR+" !important;}"+
            ".ne-toc-normal-view .ne-toc-content:after{background: "+SCROLLBAR_BG_COLOR+" !important;}"+
            ".ne-toc-normal-view .ne-toc-item a{color: "+FONT_SIDEBAR_COLOR+" !important;}"+
            ".ne-toc-sidebar-hover .ne-toc-view .ne-toc-item a{color: "+FONT_SIDEBAR_HOVER_COLOR+" !important;}"+
            ".ne-toc-view-inner::-webkit-scrollbar{display:none !important;}"+
            ".ne-viewer .ne-viewer-body,.ne-engine{--link-color:"+LINK_COLOR+" !important;}"+
            "ne-oli-i, ne-uli-i{color:"+LIST_COLOR+" !important;}"+
            ".header{filter: invert(100%); background-color: "+ReverseColor(TOOLBAR_BG_COLOR)+";}"+
            ".header .ant-btn-primary,.header img,.header .HeadNewButton-module_header-add-btn_nJ9ub, .header .ant-popover{filter: invert(100%);}"+
            ".ReaderLayout-module_asidePinned_owRmW .ReaderLayout-module_crumb_wF-5C{filter: invert(100%); background-color: "+ReverseColor(TOOLBAR_BG_COLOR)+";}"+
            ".ReaderLayout-module_asidePinned_owRmW .ReaderLayout-module_crumb_wF-5C img{filter: invert(100%);}"+
            ".lake-board-canvas{background-color: "+MAIN_BG_COLOR+";}"+
            ".LakeBoardEditor-module_wrap_zK70p{border-color: "+TOOLBAR_BORDER_COLOR+" !important;}"+
            "foreignObject div{color:"+FONT_DEFAULT_COLOR+" !important;}"+
            ".ne-engine [data-placeholder]::before {color:"+FONT_SIDEBAR_COLOR+" !important;}"+
            '.ne-paragraph-spacing-relax.ne-typography-classic.ne-engine ne-card[data-card-name="hr"] .ne-card-container {background: transparent;}'+
            '.lake-diagram-viewport-container div:first-child svg:first-child {background-color:' + MAIN_BG_COLOR + '!important}'+
            "}";
        try
        {
            style.appendChild(document.createTextNode(cssString));
        }
        catch(ex)
        {
            style.styleSheet.cssText = cssString;//针对IE
        }
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    }

    Awake();
})();