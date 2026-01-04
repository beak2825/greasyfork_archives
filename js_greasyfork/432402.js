// ==UserScript==
// @name         个性化、美化、自定义网页滚动条
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  个性化、美化、自定义网页滚动条！
// @author       戈小戈
// @match        https://*/*
// @match        http://*/*
// @icon         https://s3.bmp.ovh/imgs/2021/09/a01be58228a8ea44.jpg
// @license           AGPL
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/432402/%E4%B8%AA%E6%80%A7%E5%8C%96%E3%80%81%E7%BE%8E%E5%8C%96%E3%80%81%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E9%A1%B5%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/432402/%E4%B8%AA%E6%80%A7%E5%8C%96%E3%80%81%E7%BE%8E%E5%8C%96%E3%80%81%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E9%A1%B5%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.setScrollbar = function (flag){
        GM_addStyle("::-webkit-scrollbar {width : "+flag+"px;}");
        GM_setValue("scrollbarWidth",flag);
    }
    let defaultScrollbarWidth = '6';//设置所有网站默认的滚动条宽度，可以自己定义
    let scrollbarWidth=GM_getValue('scrollbarWidth', defaultScrollbarWidth);
    GM_addStyle("::-webkit-scrollbar {width : "+ scrollbarWidth +"px; height: 1px;}::-webkit-scrollbar-thumb {border-radius : 10px;background-color: #1f9ae6;background-image: linear-gradient(0deg, #1f9ae6 0%, #00cfd8 80%, #e4e4e4 100%);}::-webkit-scrollbar-track {box-shadow   : inset 0 0 10px rgba(0, 0, 0, 0.1);background   : #ededed;}")
    let large_command_id = GM_registerMenuCommand('⚙️ 设置滚动条大小：大', () => {
        setScrollbar(16);
        setScrollbarFlag(16);
    });
    let medium_command_id = GM_registerMenuCommand('⚙️ 设置滚动条大小：中', () => {
        setScrollbar(10);
        setScrollbarFlag(10);
    });
    let small_command_id = GM_registerMenuCommand('⚙️ 设置滚动条大小：小', () => {
        setScrollbar(6);
        setScrollbarFlag(6);
    });
    let scrollbar_flag_command_id = GM_registerMenuCommand('⚙️ 滚动条大小状态：');
    unsafeWindow.setScrollbarFlag = function (flag){
       switch(flag){
            case 16:
                GM_unregisterMenuCommand(scrollbar_flag_command_id);
                scrollbar_flag_command_id = GM_registerMenuCommand('⚙️ 滚动条大小状态：大 ✔️', () => {
                });
                break;
            case 10:
                GM_unregisterMenuCommand(scrollbar_flag_command_id);
                scrollbar_flag_command_id = GM_registerMenuCommand('⚙️ 滚动条大小状态：中 ✔️', () => {
                });
                break;
            case 6:
                GM_unregisterMenuCommand(scrollbar_flag_command_id);
                scrollbar_flag_command_id = GM_registerMenuCommand('⚙️ 滚动条大小状态：小 ✔️', () => {
                });
                break;
            default:
                break;
        }
    }
    setScrollbarFlag(scrollbarWidth);


})();