// ==UserScript==
// @name         www.baidu.com页面美化
// @namespace    https://www.liuzhixi.cn/
// @version      1.6
// @description  美化搜索框,去除顶部菜单栏的背景颜色去除底部版权栏
// @author       小沫
// @match        *://www.baidu.com
// @match        *://www.baidu.com/?tn=*
// @icon         https://www.baidu.com/favicon.ico
// @grant        GM_addStyle
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/451413/wwwbaiducom%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/451413/wwwbaiducom%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
function addStyle() {
    let css = `
    :root {
    --ThemeColor: #666;
    }
    ::-webkit-scrollbar, #s-top-left, #bottom_layer, #s_lm_wrap, .operate-wrapper{
        display: none !important;
    }
    #lg.s-p-top{
    overflow: hidden;
    }
    #s_lg_img_new{
    filter: drop-shadow(0px -1000px var(--ThemeColor));
    margin-top: 1000px !important;
    }
    #s_mp area{
    position: absolute;
    bottom: 40px;
    width: 40%;
    height: 106px;
    left: 30%;
    }
    .s-top-right{
    width:100%;
    }
    .s-top-right .ai-entry-right{
     top: 18px;
     left: 50%;
     margin-right: 340px;
    }
    .s-top-right .operate-wrapper {
      display: inline-block;
      position: absolute;
      margin-right: 32px;
      top: 16px;
      right: 130px;
    }
    .s-top-right #s-usersetting-top, .s-top-right .s-top-username{
    float: right;
    }
    .s-top-right .s-weather-wrapper{
    float: left;
    padding-left: 24px;
    }
    #wrapper.wrapper_new div.s-skin-container{
    }
    .s-skin-hasbg #head_wrapper .s_btn {
    background: var(--ThemeColor);
    color: #fff;
    }
    .s-skin-hasbg #head_wrapper #form #kw.new-ipt-focus, .s-skin-hasbg #head_wrapper #form #kw:hover, .s-skin-hasbg #head_wrapper #form #kw:focus{
    border-color:var(--ThemeColor) !important;
    }
    .s-skin-hasbg #head_wrapper #form #kw, .s-skin-hasbg .soutu-env-new .soutu-layer #soutu-url-kw{
    background: none;
    border-color:var(--ThemeColor);
    border-right: none;
    }
    #head_wrapper .ipt_rec{
    background-image: url("https://www.liuzhixi.cn/zb_users/upload/2025/06/20250602181052174885905295758.png");
    background-size: 24px 24px;
    background-color: #fff0;
    background-position: 0 -1px;
    }
    #head_wrapper .soutu-btn {
    background: #fff0 url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IlN0YW5kYXJkX3Byb2R1Y3RfaWNvbiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKCSB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE5MnB4IiBoZWlnaHQ9IjE5MnB4IiB2aWV3Qm94PSIwIDAgMTkyIDE5MiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTkyIDE5MiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxyZWN0IGlkPSJib3VuZGluZ19ib3hfMV8iIGZpbGw9Im5vbmUiIHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIi8+CjxnIGlkPSJhcnRfbGF5ZXIiPgoJPGNpcmNsZSBpZD0iRG90IiBmaWxsPSIjNDI4NUY0IiBjeD0iOTYiIGN5PSIxMDQuMTUiIHI9IjI4Ii8+Cgk8cGF0aCBpZD0iUmVkIiBmaWxsPSIjRUE0MzM1IiBkPSJNMTYwLDcydjQwLjE1VjEzNmMwLDEuNjktMC4zNCwzLjI5LTAuODIsNC44MnYwdjBjLTEuNTcsNC45Mi01LjQzLDguNzgtMTAuMzUsMTAuMzVoMHYwCgkJYy0xLjUzLDAuNDktMy4xMywwLjgyLTQuODIsMC44Mkg2NmwxNiwxNmg1MGgxMmM0LjQyLDAsOC42My0wLjksMTIuNDYtMi41MWMzLjgzLTEuNjIsNy4yOC0zLjk2LDEwLjE3LTYuODYKCQljMS40NS0xLjQ1LDIuNzYtMy4wMywzLjkxLTQuNzRjMi4zLTMuNCwzLjk2LTcuMjgsNC44MS0xMS40NGMwLjQzLTIuMDgsMC42NS00LjI0LDAuNjUtNi40NXYtMTJWOTYuMTVWODRsLTYtMTlsLTEwLjgyLDIuMTgKCQlDMTU5LjY2LDY4LjcxLDE2MCw3MC4zMSwxNjAsNzJ6Ii8+Cgk8cGF0aCBpZD0iQmx1ZSIgZmlsbD0iIzQyODVGNCIgZD0iTTMyLDcyYzAtMS42OSwwLjM0LTMuMjksMC44Mi00LjgyYzEuNTctNC45Miw1LjQzLTguNzgsMTAuMzUtMTAuMzVDNDQuNzEsNTYuMzQsNDYuMzEsNTYsNDgsNTYKCQloOTZjMS42OSwwLDMuMjksMC4zNCw0LjgyLDAuODJjMCwwLDAsMCwwLDBMMTQ5LDQ1bC0xNy01bC0xNi0xNmgtMTMuNDRIOTZoLTYuNTZINzZMNjAsNDBINDhjLTE3LjY3LDAtMzIsMTQuMzMtMzIsMzJ2MTJ2MjBsMTYsMTYKCQlWNzJ6Ii8+Cgk8cGF0aCBpZD0iR3JlZW4iIGZpbGw9IiMzNEE4NTMiIGQ9Ik0xNDQsNDBoLTEybDE2LjgzLDE2LjgzYzEuMjMsMC4zOSwyLjM5LDAuOTMsMy40NywxLjU5YzIuMTYsMS4zMiwzLjk3LDMuMTMsNS4yOSw1LjI5CgkJYzAuNjYsMS4wOCwxLjIsMi4yNCwxLjU5LDMuNDd2MEwxNzYsODRWNzJDMTc2LDU0LjMzLDE2MS42Nyw0MCwxNDQsNDB6Ii8+Cgk8cGF0aCBpZD0iWWVsbG93IiBmaWxsPSIjRkJCQzA0IiBkPSJNNDgsMTY4aDM5Ljg5bC0xNi0xNkg0OGMtOC44MiwwLTE2LTcuMTgtMTYtMTZ2LTIzLjg5bC0xNi0xNlYxMzZDMTYsMTUzLjY3LDMwLjMzLDE2OCw0OCwxNjh6CgkJIi8+CjwvZz4KPC9zdmc+Cg==) no-repeat;
    background-size: cover;
    background-position: 0 -3px!important;
    }
    #head_wrapper .soutu-btn:hover{
    background: #fff0 url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IlN0YW5kYXJkX3Byb2R1Y3RfaWNvbiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKCSB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE5MnB4IiBoZWlnaHQ9IjE5MnB4IiB2aWV3Qm94PSIwIDAgMTkyIDE5MiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTkyIDE5MiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxyZWN0IGlkPSJib3VuZGluZ19ib3hfMV8iIGZpbGw9Im5vbmUiIHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIi8+CjxnIGlkPSJhcnRfbGF5ZXIiPgoJPGNpcmNsZSBpZD0iRG90IiBmaWxsPSIjNDI4NUY0IiBjeD0iOTYiIGN5PSIxMDQuMTUiIHI9IjI4Ii8+Cgk8cGF0aCBpZD0iUmVkIiBmaWxsPSIjRUE0MzM1IiBkPSJNMTYwLDcydjQwLjE1VjEzNmMwLDEuNjktMC4zNCwzLjI5LTAuODIsNC44MnYwdjBjLTEuNTcsNC45Mi01LjQzLDguNzgtMTAuMzUsMTAuMzVoMHYwCgkJYy0xLjUzLDAuNDktMy4xMywwLjgyLTQuODIsMC44Mkg2NmwxNiwxNmg1MGgxMmM0LjQyLDAsOC42My0wLjksMTIuNDYtMi41MWMzLjgzLTEuNjIsNy4yOC0zLjk2LDEwLjE3LTYuODYKCQljMS40NS0xLjQ1LDIuNzYtMy4wMywzLjkxLTQuNzRjMi4zLTMuNCwzLjk2LTcuMjgsNC44MS0xMS40NGMwLjQzLTIuMDgsMC42NS00LjI0LDAuNjUtNi40NXYtMTJWOTYuMTVWODRsLTYtMTlsLTEwLjgyLDIuMTgKCQlDMTU5LjY2LDY4LjcxLDE2MCw3MC4zMSwxNjAsNzJ6Ii8+Cgk8cGF0aCBpZD0iQmx1ZSIgZmlsbD0iIzQyODVGNCIgZD0iTTMyLDcyYzAtMS42OSwwLjM0LTMuMjksMC44Mi00LjgyYzEuNTctNC45Miw1LjQzLTguNzgsMTAuMzUtMTAuMzVDNDQuNzEsNTYuMzQsNDYuMzEsNTYsNDgsNTYKCQloOTZjMS42OSwwLDMuMjksMC4zNCw0LjgyLDAuODJjMCwwLDAsMCwwLDBMMTQ5LDQ1bC0xNy01bC0xNi0xNmgtMTMuNDRIOTZoLTYuNTZINzZMNjAsNDBINDhjLTE3LjY3LDAtMzIsMTQuMzMtMzIsMzJ2MTJ2MjBsMTYsMTYKCQlWNzJ6Ii8+Cgk8cGF0aCBpZD0iR3JlZW4iIGZpbGw9IiMzNEE4NTMiIGQ9Ik0xNDQsNDBoLTEybDE2LjgzLDE2LjgzYzEuMjMsMC4zOSwyLjM5LDAuOTMsMy40NywxLjU5YzIuMTYsMS4zMiwzLjk3LDMuMTMsNS4yOSw1LjI5CgkJYzAuNjYsMS4wOCwxLjIsMi4yNCwxLjU5LDMuNDd2MEwxNzYsODRWNzJDMTc2LDU0LjMzLDE2MS42Nyw0MCwxNDQsNDB6Ii8+Cgk8cGF0aCBpZD0iWWVsbG93IiBmaWxsPSIjRkJCQzA0IiBkPSJNNDgsMTY4aDM5Ljg5bC0xNi0xNkg0OGMtOC44MiwwLTE2LTcuMTgtMTYtMTZ2LTIzLjg5bC0xNi0xNlYxMzZDMTYsMTUzLjY3LDMwLjMzLDE2OCw0OCwxNjh6CgkJIi8+CjwvZz4KPC9zdmc+Cg==) no-repeat;
    background-size: cover;
    }
    #head_wrapper .ipt_rec:hover{
    background-size: 24px 24px;
    background-image: url("https://www.liuzhixi.cn/zb_users/upload/2025/06/20250602181052174885905295758.png");
    background-position: 0 -1px;
    background-color: #fff0;
    }
    .s-skin-hasbg #head_wrapper .s_btn:hover {
    background-color: var(--ThemeColor);
    }
    .s-skin-hasbg .s-top-wrap {
    background: rgb(0 0 0 / 0%);
    }
    #s-user-setting-menu{
    right: 0px!important;
    }
    #head_wrapper #form .bdsug-new ul li{
    color: #feffff;
    }
    #head_wrapper #form .bdsug-new{
    border: 2px solid var(--ThemeColor) !important;
    }
    .s-skin-hasbg .soutu-env-new .soutu-layer .soutu-url-btn-new{
    border-color: var(--ThemeColor) !important;
    }
    .bdsug, .soutu-env-new .soutu-layer .soutu-url-btn-new, .soutu-env-new .soutu-layer .upload-wrap{
    background:var(--ThemeColor) !important
    }
    #head_wrapper #form .bdsug-new ul, .s-skin-hasbg .soutu-env-new .soutu-layer #soutu-url-kw{
    border:none;
    }
    .s-skin-hasbg #head_wrapper #form .bdsug-new{
    border-color: var(--ThemeColor) !important;
    margin-top: 8px;
    border-radius: 10px;
    }
    #s_mod_setweather{
    right: auto;
    }
    .destop_wrapper_small .card_layout_11HoJ .content_2q4gZ{
        height: 320px;
        overflow: scroll;
        scrollbar-color: var(--ThemeColor) #e9e9e9;
    }
    #s_wrap{
        margin-top: -57px;
    }
    #s_new_search_guide .new_search_guide_bub .new_search_guide_bub_container {
        z-index:9
    }
    `;
    GM_addStyle(css);
}
(function () {
    'use strict';
     addStyle();

})();