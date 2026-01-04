// ==UserScript==
// @name         poe国服市集快速操作
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  市集快速操作
// @author       zql
// @license      MIT
// @match        https://poe.game.qq.com/trade/*
// @icon         https://poecdn.game.qq.com/protected/image/tencent/favicon.ico?v=1&key=n-sE-UNY0Q4cVw3G3uH_xg

// @require      https://unpkg.com/jquery

// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/483132/poe%E5%9B%BD%E6%9C%8D%E5%B8%82%E9%9B%86%E5%BF%AB%E9%80%9F%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/483132/poe%E5%9B%BD%E6%9C%8D%E5%B8%82%E9%9B%86%E5%BF%AB%E9%80%9F%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

unsafeWindow.GM_setValue = GM_setValue;
unsafeWindow.GM_getValue = GM_getValue;
unsafeWindow.GM_addStyle = GM_addStyle;
unsafeWindow.GM_deleteValue = GM_deleteValue;
unsafeWindow.GM_listValues = GM_listValues;
unsafeWindow.GM_addValueChangeListener = GM_addValueChangeListener;
unsafeWindow.GM_removeValueChangeListener = GM_removeValueChangeListener;
unsafeWindow.GM_log = GM_log;
unsafeWindow.GM_getResourceText = GM_getResourceText;
unsafeWindow.GM_getResourceURL = GM_getResourceURL;
unsafeWindow.GM_registerMenuCommand = GM_registerMenuCommand;
unsafeWindow.GM_unregisterMenuCommand = GM_unregisterMenuCommand;
unsafeWindow.GM_openInTab = GM_openInTab;
unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
unsafeWindow.GM_download = GM_download;
unsafeWindow.GM_notification = GM_notification;
unsafeWindow.GM_setClipboard = GM_setClipboard;
unsafeWindow.GM_info = GM_info;



var css = `
button.btn_class {
    height: 22px;
    line-height: 22px;
    border: 1px solid #444;
    padding: 0 10px;
    background-color: #222;
    color: #e9cf9f;
    white-space: nowrap;
    text-align: center;
    font-size: 13px;
    border-radius: 2px;
    cursor: pointer;
}

.copy_class{
    cursor: pointer;
}

.flag_class{
}
`

GM_addStyle(css);

(function() {
    //1秒钟检查一次
    setInterval(function () {
        add_copy_item_header();
        add_copy_content_item();
    }, 1000);

    unsafeWindow.add_copy_content_item = function () {
        $(".content").each(function () {
            if ($(this).is(".flag_class")) {
                return;
            }
            $(this).find(".lc.l.su").each(function (){
                copy_content_item(this);
            });
            $(this).find(".lc.l.pr").each(function (){
                copy_content_item(this);
            });
            $(this).find(".lc.l").each(function (){
                copy_content_item(this);
            });
            $(this).addClass("flag_class");
        });
    }
    unsafeWindow.copy_content_item = function (e) {
        var item_value = $(e).siblings(".lc.s").text();
        $(e).addClass("copy_class");
        $(e).on('click', function () {
            if(item_value!=""){
                navigator.clipboard.writeText(item_value);
            }
        });
    }
    unsafeWindow.add_copy_item_header = function () {
        $(".itemHeader").each(function () {
            if ($(this).is(".copy_class")) {
                return;
            }
            var equipt_name = "";
            $(this).find(".itemName span").each(function (){
                if($(this).text()!=""){
                    equipt_name = equipt_name  +" "+ $.trim($(this).text()) ;
                }
            });
            if(equipt_name.length>0 && equipt_name.indexOf(" ")==0){
                equipt_name = equipt_name.substr(1);
            }
            $(this).addClass("copy_class");
            $(this).attr("equipt_name",equipt_name);
            $(this).on('click', function () {
                console.log("%s",equipt_name);
                if(equipt_name!=""){
                    navigator.clipboard.writeText(equipt_name);
                }
            });
        });
    }
})();