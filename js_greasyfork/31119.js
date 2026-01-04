// ==UserScript==
// @name         灰机汉化 滚动浏览
// @namespace    http://weibo.com/unluckyninja
// @version      1.1.1
// @description  显示模式切换按钮，点击后可切换cocos2d播放器为纯图片滚动浏览
// @author       UnluckyNinja
// @include      http://smp*.yoedge.com/smp-app/*
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://greasyfork.org/scripts/34959-eisbehr-jquery-lazy/code/eisbehr%20jquery%20lazy.js?version=229001
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/31119/%E7%81%B0%E6%9C%BA%E6%B1%89%E5%8C%96%20%E6%BB%9A%E5%8A%A8%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/31119/%E7%81%B0%E6%9C%BA%E6%B1%89%E5%8C%96%20%E6%BB%9A%E5%8A%A8%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var button = '<div id="scroll-button" style="position: fixed;top: 5px;right:5px;z-index:1000;">' +
            '<div class="settings-button" style="height:auto; padding: 2px;line-height: 1.3em">' +
            '<div id="enable-scrolling" class="tool-item" style="text-align: center;width:auto;">滚动浏览</div>' +
            '<hr>' +
            '<div id="image-width-drop" class="tool-item" style="text-align: center;width:auto">▼</div>' +
            '</div>' +
            '<div id="width-setting" class="tool-container" style="margin-top: 10px;padding: 2px;display:none;">' +
                '<label for="image-width" style="color: #111111;">宽度</label>' +
                '<input id="image-width" class="tool-item" type="number" placeholder="1080" min=480 max=4096 style="box-sizing: border-box;width: 100%;">' +
                '<div class="arrow" style="border-color: transparent transparent #E9E5E5 transparent;margin: auto;top: -14px;left: 0;right: 0;"></div>' +
            '</div>' +
        '</div>';
    GM_addStyle("input[type=number]::-webkit-inner-spin-button, " +
                "input[type=number]::-webkit-outer-spin-button { " +
                "  -webkit-appearance: none; " +
                "}" +
                ".lazy {" +
                "  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcNCiAgd2lkdGg9IjEwMCUiDQogIGhlaWdodD0iMTAwJSINCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayINCiAgdmlld0JveD0iMCAwIDEwMCAxMDAiDQogIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIg0KICBzdHlsZT0iaW5saW5lLXNpemU6IDIwMHB4OyBoZWlnaHQ6IDIwMHB4OyINCiAgPg0KICA8c3ZnDQogICAgdmVyc2lvbj0iMS4xIg0KICAgIGlkPSJsYXllcl8xIg0KICAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayINCiAgICB4PSIwcHgiDQogICAgeT0iMHB4Ig0KICAgIHZpZXdCb3g9IjAgMCAxMDAgMTAwIg0KICAgIHhtbDpzcGFjZT0icHJlc2VydmUiDQogICAgPg0KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InkiIGNhbGNNb2RlPSJzcGxpbmUiIHZhbHVlcz0iLTEwOzEwOy0xMCIga2V5VGltZXM9IjA7MC41OzEiIGR1cj0iNSIga2V5U3BsaW5lcz0iMC41IDAgMC41IDE7MC41IDAgMC41IDEiIGJlZ2luPSIwcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4NCiAgICA8ZyBzdHlsZT0idHJhbnNmb3JtLW9yaWdpbjogNTBweCA1MHB4O3RyYW5zZm9ybTogbWF0cml4KDAuNiwgMCwgMCwgMC42LCAwLCAwKTsiPg0KICAgICAgPGcgY2xhc3M9ImxkICIgPg0KICAgICAgICA8ZyA+DQogICAgICAgICAgPHBvbHlnb24gY2xhc3M9InN0NSIgcG9pbnRzPSI4OC4xLDE1IDI3LjQsNTUuOCAxMS45LDQ3LjMgIiBmaWxsPSIjZWVlZWVlIiA+PC9wb2x5Z29uPg0KICAgICAgICA8L2c+DQogICAgICAgIDxnID4NCiAgICAgICAgICA8cG9seWdvbiBjbGFzcz0ic3Q1IiBwb2ludHM9Ijg4LjEsMTUgNzEuMiw4MC4xIDUxLjUsNjkuMSAzOS40LDg1IDM5LjQsNjIuNSAiIGZpbGw9IiNlZWVlZWUiID48L3BvbHlnb24+DQogICAgICAgIDwvZz4NCiAgICAgICAgPGcgPg0KICAgICAgICAgIDxwYXRoDQogICAgICAgICAgICBjbGFzcz0ic3QyIg0KICAgICAgICAgICAgZD0iTTI5LjgsNTYuNWw3LjcsMTguN1Y2Mi41YzAtMC41LDAuMi0xLDAuNi0xLjRsMzMuNC0zMi42TDI5LjgsNTYuNXoiDQogICAgICAgICAgICBmaWxsPSIjYTBhMGEwIg0KICAgICAgICAgICAgPjwvcGF0aD4NCiAgICAgICAgPC9nPg0KICAgICAgICA8ZyA+DQogICAgICAgICAgPHBhdGgNCiAgICAgICAgICAgIGQ9Ik05MCwxNC44YzAtMC4yLTAuMS0wLjQtMC4xLTAuNWMwLDAsMC0wLjEsMC0wLjFjMCwwLDAtMC4xLTAuMS0wLjFjLTAuMS0wLjEtMC4xLTAuMi0wLjItMC4zYzAsMCwwLDAsMCwwIGMtMC4xLTAuMS0wLjMtMC4zLTAuNC0wLjRjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjLTAuMi0wLjEtMC40LTAuMi0wLjUtMC4yYzAsMCwwLDAtMC4xLDBjLTAuMiwwLTAuNCwwLTAuNSwwYzAsMC0wLjEsMC0wLjEsMCBjLTAuMiwwLTAuMywwLjEtMC41LDAuMUwxMS4yLDQ1LjVjLTAuNywwLjMtMS4xLDAuOS0xLjIsMS43czAuMywxLjQsMSwxLjhsMTQuOCw4LjJsMTEuOCwyOC41bDAsMGMwLjIsMC41LDAuNiwwLjksMS4yLDEuMSBjMC4yLDAuMSwwLjQsMC4xLDAuNiwwLjFjMC42LDAsMS4yLTAuMywxLjUtMC44bDExLTE0LjVsMTguMywxMC4xYzAuNSwwLjMsMS4yLDAuMywxLjcsMC4xYzAuNi0wLjIsMS0wLjcsMS4xLTEuM2wxNi45LTY1IGMwLDAsMCwwLDAsMEM5MCwxNS4zLDkwLDE1LjEsOTAsMTQuOEM5MCwxNC45LDkwLDE0LjksOTAsMTQuOHogTTE2LjQsNDcuNWw1My44LTIyLjhMMjcuMyw1My41TDE2LjQsNDcuNXogTTM4LjEsNjEuMSBjLTAuNCwwLjQtMC42LDAuOS0wLjYsMS40djEyLjdsLTcuNy0xOC43bDQxLjctMjhMMzguMSw2MS4xeiBNNDEuNCw2NS44bDcuMiw0bC03LjIsOS41VjY1Ljh6IE03MCw3Ny4xbC0xNy42LTkuN0w0Mi43LDYyIGw0MS44LTQwLjhMNzAsNzcuMXoiDQogICAgICAgICAgICBmaWxsPSJyZ2IoMCwgMCwgMCkiDQogICAgICAgICAgICA+PC9wYXRoPg0KICAgICAgICA8L2c+DQogICAgICA8L2c+DQogICAgPC9nPg0KICA8L3N2Zz4NCjwvc3ZnPg==')" +
                "              no-repeat center/30%;" +
                "}");
    function buildImages(){
        var width = GM_getValue('imageWidth', 1080);
        var htmlList = '<div id="image-list" style="margin:0 auto;padding:0;width:fit-content;position:absolute;top:5px;left:0;right:0;display: none"></div>';
        var htmlImage = '<img class="lazy" style="margin:0;padding:0;display:block;width:'+width+'px;min-height: 200px;" data-src="" />';
        var list = $(htmlList);
        var imageTemplate = $(htmlImage);
        var pages = smp.config.pages.page;
        var orders = smp.config.pages.order;
        var len = orders.length;
        var order = null;
        var url = null;
        for (var i = 0; i < len; i++) {
            order = orders[i];
            url = pages[order];
            list.append(imageTemplate.clone(true).attr('data-src', url));
            list.append('<p style="margin-top: 5px; margin-bottom: 15px; color: white; text-align: center;">'+(i+1)+'</p>');
        }
        list.insertAfter('#Cocos2dGameContainer');
        $(function() {
            $('.lazy').lazy({
                enableThrottle: true,
                throttle: 100
            });
        });
    }
    // 准备按钮
    var showButton = function(){
        var target = $('div#toolbar');
        if(!target.length){
            return;
        }
        $(button).appendTo(target);
        $('#enable-scrolling').click(function(){
            if(!$('#image-list').length){
                buildImages();
            }
            $('#gameCanvas').toggle();
            $('#image-list').toggle();
        });
        // 显示宽度输入框
        $('#image-width-drop').click(function(){
            $('#width-setting').show();
            $('#image-width').attr('placeholder',GM_getValue('imageWidth', 1080)).focus();
        });
        // 失去焦点时自动切换宽度 保存数值
        $('#image-width').blur(function(){
            $('#width-setting').hide();
            var value = $('#image-width').val();
            if(!value){
                return;
            }
            value = Math.min(Math.max(parseInt(value), 480), 4096);
            $('#image-list img').css('width', value);
            GM_setValue('imageWidth', value);
            $('#image-width').val('');
        });
    };
    waitForKeyElements ("div#normal-button", showButton);
})();