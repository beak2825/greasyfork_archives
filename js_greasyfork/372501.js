// ==UserScript==
// @name         Bilibili Live 全屏发弹幕
// @namespace    https://greasyfork.org/zh-CN/users/196399-xyabc120
// @icon         http://static.hdslb.com/images/favicon.ico
// @version      1.0.6
// @description  Bilibili直播全屏发弹幕
// @author       Mr.ZHAO
// @include      https://live.bilibili.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        GM_addStyle
// @compatible   chrome  支持
// @compatible   firefox 支持
// @license      MIT;
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/372501/Bilibili%20Live%20%E5%85%A8%E5%B1%8F%E5%8F%91%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/372501/Bilibili%20Live%20%E5%85%A8%E5%B1%8F%E5%8F%91%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    if (!window.jQuery) {
        (function waitForJquery(){
            if (!window.jQuery){
                setTimeout(waitForJquery, 100);
            } else {
                $ = window.jQuery;
                addFullscreenListener();
            }
        })();
    } else {
        addFullscreenListener();
    }

    var showTools = GM_getValue("isShowTolls", true);
    GM_registerMenuCommand("显示/隐藏弹幕工具", function () {
		showTools = !showTools;
        GM_setValue("isShowTolls", showTools);
	});

    var fullStyle = `
    .full-container {
        position: fixed!important;
        left: 0; right: 0; bottom: 0;
        height: 73px;
        width: 100%;
        max-width: calc(100% - 830px);
        display: block;
        margin: 0 auto;
        /**background: linear-gradient(90deg,transparent,rgba(0,0,0,.7),transparent)*/;
    }
    .full-container > div{ width: 450px; margin: 0 auto; padding: 1px 8px!important;}
    .full-container .chat-input-ctnr{ position: absolute }
    .full-container .control-panel-icon-row{ margin: 4px -5px 0px; }
    .full-container .control-panel-icon-row .icon-item{ color: #eee!important; text-shadow: 0 0 3px rgba(0,0,0,.65); }
    .full-container .control-panel-icon-row .icon-item:hover{ color: #fd9ccc!important; text-shadow: 0 0 3px rgb(253,156,204,.6);}
    .full-container textarea.chat-input{ height:35px; width: 355px; background: rgba(0,0,0,.6);color: #fff; border: 1px solid rgba(0,0,0,.1); border-radius: 2px 0 0 2px; box-shadow:0px 0px 3px 0px rgba(255,255,255,.2)}
    .full-container textarea.chat-input:focus{ border: 1px solid rgba(0,0,0,.1)!important; background: rgba(0,0,0,.83);}
    .full-container .right-action button{ height:35px; border-radius: 0 2px 2px 0; box-shadow:0px 0px 3px 0px rgba(255,255,255,.2)}
    .full-container .left-action, .full-container #chatHelper, .full-container .icon-clear, .full-container .icon-unlock-1{ display: none }

    .full-container.hide-tools{ height: 48px; background: transparent}
    .full-container.hide-tools .control-panel-icon-row{ display: none;}
   `;
    GM_addStyle(fullStyle);

    function addFullscreenListener(){
        var MutationObserver = window.MutationObserver;
        var observer = new MutationObserver(toggleStyle);
        observer.observe(document.body, { attributes: true, childList: false, characterData: false });

        // .bilibili-live-player-context-menu-container
        $(".bilibili-live-player").on("click","a:contains('\u590d\u5236\u5f39\u5e55')",function(){
            GM_setClipboard(($(this).parents("ul").prev().text()),"text");
        });
    }

    function toggleStyle(){
        var className = "full-container" + (!showTools ? " hide-tools" : "");
        var control = $("#chat-control-panel-vm");
        if($(document.body).hasClass("fullscreen-fix")){
            $(".bilibili-live-player-video-controller").append(control.addClass(className));
        } else {
            $(".aside-area").append(control.removeClass(className));
        }
    }
})();
