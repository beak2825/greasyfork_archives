// ==UserScript==
// @name         Impeccable_Xes
// @namespace    https://code.xueersi.com/
// @version      0.1
// @description  Impeccable XES
// @run-at       document-start
// @author       陈思翰
// @license      GPL-3.0
// @match        https://code.xueersi.com/*
// @icon         https://code.xueersi.com/static/images/code-home/qrlogo.png
// @grant        none
// @connect      *
//               该脚本导入了XesExt，并遵循GPL v3协议开源
// @require      https://update.greasyfork.org/scripts/457247/XesExt.user.js

// @downloadURL https://update.greasyfork.org/scripts/487021/Impeccable_Xes.user.js
// @updateURL https://update.greasyfork.org/scripts/487021/Impeccable_Xes.meta.js
// ==/UserScript==

console.log("Best_looking_XES loaded");
const style = document.createElement("style");
style.innerHTML = `
    .nprogress-container #nprogress .spinner-icon
    {
        border-top-color: #cefff8 !important;
        border-left-color: #cefff8 !important;
    }
    .nprogress-container #nprogress .peg
    {
        box-shadow: 0 0 10px 0px #ffffff, 0 0 5px #ffffff !important;
    }
    .nprogress-container #nprogress .bar {
        background: #cefff8 !important;
    }

    /*作品名输入框*/
    .headercon-input
    {
        background: #1E1E1E url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAARCAYAAADQWvz5AAACdUlEQVQ4T5XUy0tVQRwH8O93zj15U3xEERkkUSLmo6uQIHKhoAJDiV7Qpk0UQZC2KyrKXlcr6g8oWlS2ssB2YgUuhCA7Yr4rC4k24ULBq/m43vnGUbMsX81iNsP5zPd35jdD/MfwvK4MuKZcVEhW/cbRsx35+V98git1vM6+rbITVwSUEgyAkIRG1/JqQcG2zyuC3rR2Z7oBXhdsKUkPVl0g9wPcCOj5ZJyXl4VmkZuADoDoMLQnNTHxVW5wL4A7AFdD9tySUGt3d6ad0g0A/u4COCDYs6PbcxtS29rW2MCq+xJ3QqpaFPKReAwRAqUwaIbVJ5BHJAyTqpr9t36iHzYeP7UgNIdQZYBpJKcuTUiDLgInSFRCPuNPnJRVJH1dau0/kI8ojoikMgkvyfiFolDoo/+p19OTbmO6C+GoIb8DqB6PmtpwODs6D3r7vjfLUNcIlVvp1TzE81y5wX0Q7olIAHAr0cGTvLy8kbk+qqurczZn5WaTqAawG0BDwOXFwpycvukknufGncQyY2wNwCRB85A5yI+sKTyGtEvQEOScLgpl15PUb0Q1BJNnyhmsDYfD0T+bebq0lrbOEhjWAUwhYAB5BM8jNtYpN7gH4O2lkOlEje3tSWlyzjg0FZL1sVTQ7xt8oPBCxHFBaQZmwSS/UrGlpXMTE8wDADnWOIeNzCA0FQF0ENC4hBFDExmPDj79u5x5pXkdvfmSrRcQd6RKGCfDSscAlUAYIBkJOnbudBa75HzX0bEFNlALqBDE0MyDIAtoSOBDOxZ9VFxcPLzcK8Gmpv5g8trxQ5CtsFIKDZshvY7FbFeSu/5bKLRhdDnEX/8JXeM9oXfZYg4AAAAASUVORK5CYII=) 170px no-repeat !important;
        color: #fff !important;
    }
    /*选中的括号样式*/
    .ace_bracket
    {
        border: 1px solid #9cadd5 !important;
    }
    /*选中行样式*/
    .ace_active-line
    {
        background: #282A2E !important;
    }
    /*选中行索引样式*/
    .ace_gutter-active-line
    {
        background-color: #383c43 !important;
    }
    /*行索引样式*/
    .ace_gutter, .ace_gutter-layer
    {
        background: #25282c !important;
        color: #C5C8C6 !important;
    }
    /*代码框背景*/
    .ace_content, .ace-editor
    {
        background-color: #1D1F21 !important;
    }
    /*全局背景*/
    .idecontainer, body
    {
        background: #181818 !important;
    }
    /*按钮栏*/
    .notification, .editor-group-term
    {
        background: #181818 !important;
        border:2px solid #3B3B3B !important;
    }
    /*文件栏(上)*/
    .tabs-wrapper
    {
        background: #1E1E1E !important;
        border:2px solid #3B3B3B !important;
    }
    span.tab-close-button.tab-run-button {
        filter: hue-rotate(137deg) !important;
    }
    .tabs-wrapper .tab-item .tab-close-button
    {
        color: #fff !important;
    }
    span.tab-close-button.closeing:hover
    {
        color: #fff !important;
        background: #3B3B3B !important;
    }

    /*文件列表*/
    .file-list
    {
        background: #181818 !important;
        border:2px solid #3B3B3B !important;
    }
    .file-list__title, .file-list__list-title, .file-list__content
    {
        background: #181818 !important;
        color: #fff;
    }
    .file-list__filesize
    {
        background: #1E1E1E !important;
        color: #fff;
    }
    .xes-node-selected, .xes-node-main:hover, .xes-node-main:hover .xes-node-content
    {
        background: #1E1E1E !important;
    }
    img.file-list__upload-img {
        filter: contrast(0%) brightness(200%) !important;
    }

    /*导航栏*/
    .headercon
    {
        background: #181818 !important;
        border:2px solid #3B3B3B !important;
    }

    .tab-item, .tab-item.active
    {
        background: #1E1E1E !important;
        border-radius: 0 0px 0 0 !important;
    }
    .tab-item.active
    {
        border-style: none none solid !important;
        border-color: #1D7BED !important;
        border-width: 4px !important;
    }
    /*光标样式*/
    .ace-tm .ace_cursor {
        color: #e8e8e8 !important;
    }
    /*运行按钮*/
    .btn-ctrl .btn-run
    {
        background-color: #20c997 !important;
    }
    /*其他按钮*/
    .button, .tools-scale-btn-wrapper
    {
        background-color: #25282c !important;
    }

    /*代码高亮显示*/
    .ace_keyword
    {
        color:#C586C0 !important;
    }
    .ace_identifier
    {
        color:#9CDCFE !important;
    }
    .ace_operator
    {
        color:#DCDCAA !important;
    }
    .ace_string
    {
        color: #CE9178 !important;
    }
    .ace_function
    {
        color: #DCDCAA !important;
    }
    .ace_constant
    {
        color: #CE9178 !important;
    }
    .ace_type
    {
        color: #179FF1 !important;
    }
    .ace_numeric
    {
        color: #B1CAA5 !important;
    }
    .ace_comment
    {
        color: #6A9955 !important;
    }
    .ace_punctuation, .ace_line
    {
        color: #808080 !important;
    }
    .ace_tag-name
    {
        color: #368CD6 !important;
    }
    .ace_attribute-name
    {
        color: #8CDCFE !important;
    }
    .ace_text .ace_cjk
    {
        color: #CCCCCC !important;
    }
    .ace_doctype
    {
        color: #B5E61D !important;
    }

    /*彩虹括号*/
    .ace_lparen,.ace_rparen
    {
      animation: colorChange 3s infinite;
      /* 初始颜色为 "#FFD71" */
      color: #FFD71;
    }

    @keyframes colorChange
    {
      0% {
        color: #FFD710;
      }
      33% {
        color: #DA70B3;
      }
      66% {
        color: #179FF1;
      }
      100% {
        color: #FFD710;
      }
    }

    .ace_line .ace_fold
    {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAARCAYAAADOk8xKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAABpSURBVEhLY7SysvrPQEfABKXpBkYtpDoYtZDqYAAt5JVnMLV3YrA1lGbg/I+nLKBQHdxCPllVBllhAQYRBWUGSXaoIBZAqTq4hV9fPmf48Osvw6+3Lxje/oIKYgGUqhstS6kOhruFDAwAfz0wDJ7KkjkAAAAASUVORK5CYII=') !important;
        height: auto !important;
        background-color: #3A3A3A !important;
        border: none !important;
    }

    /*滚动条样式*/
    ::-webkit-scrollbar {
        width: 5px;
        width: 10px;
        height: 10px;
    }

    ::-webkit-scrollbar-track {
        width: 10px;
        background: #181818 !important;
    }

    ::-webkit-scrollbar-thumb {
        background-color: rgba(144,147,153,.3) !important;
        min-height: 28px !important;
        -webkit-border-radius: 2em !important;
        -moz-border-radius: 2em !important;
        border-radius: 2em !important;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: rgba(144,147,153,.5) !important;
    }
`
document.head.appendChild(style);
