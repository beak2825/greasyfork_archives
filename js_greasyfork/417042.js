// ==UserScript==
// @name         Where is magnet!(Modified)
// @license      GPL version 3
// @encoding     utf-8
// @namespace    https://sinon.top/
// @version      1.3
// @description  琉璃神社磁链高亮（修改版）
// @author       SinonJZH
// @match        https://www.liuli.se/*
// @match        https://www.liuli.pl/*
// @match        https://www.liuli.app/*
// @match        https://www.liuli.cat/*
// @match        https://www.hacg.cat/*
// @match        https://www.hacg.mom/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417042/Where%20is%20magnet%21%28Modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/417042/Where%20is%20magnet%21%28Modified%29.meta.js
// ==/UserScript==

(function() {
    /* ---------配置项--------- */
    //指定链接显示的颜色，默认为#00FFFF
    const LINK_COLOR = '#00FFFF'
    //指定磁链按钮文字颜色，默认为black
    const BUTTON_TEXT_COLOR = 'black'
    //指定磁链按钮颜色，默认为#00FFFF
    const BUTTON_BACKGROUND = '#00FFFF'
    /* ------------------------ */
    'use strict';
    addLoadEvent(main());

    function addLoadEvent(func)
    {
        var oldOnload = window.onload;
        if (typeof window.onload != "function") {
            window.onload = func;
        } else {
            window.onload = function() {
                oldOnload();
                func();
            }
        }
    }

    function main()
    {
        if (typeof jQuery === 'undefined') {
            return;
        }
        if (!jQuery("body").hasClass("single")) {
            return
        }
        var container = jQuery('.entry-content');
        if (container.length === 0) {
            return;
        }
        var rawHtml = container.html();
        var url = "";
        var title = jQuery("h1.entry-title");
        var count = 0;
        container.html(rawHtml.replace(/([a-fA-F0-9]{40})/g, function (a, b) {
            url = `magnet:?xt=urn:btih:${b}`;
            count = count+1;
            title.before('<a href="' + url + '" style="background-color: '+ BUTTON_BACKGROUND +'; border: none; color: '+ BUTTON_TEXT_COLOR +'; padding: 10px 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 12px; border-radius: 12px;float: left;">发现磁链'
                         + count.toString() + '</a>');
            return `<br><a style="color: `+ LINK_COLOR +`;font-weight: bold;font-size: 120%" href="${url}">${b}</a><br>`;
        }));
        if(count == 0){
            title.before('<a href="' + url + '" style="background-color: red; border: none; color: black; padding: 10px 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 12px; border-radius: 12px;float: left;">未发现磁链</a>');
        }
    }
})();
