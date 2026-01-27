// ==UserScript==
// @name         Capacities.io 页面打印 Capacities.io Print View
// @namespace    http://tampermonkey.net/
// @version      2026-01-27 1.5
// @description  Capacities长页面打印，去除其它页面元素，解决使用导出pdf时出现的中文乱码 || To remove Capacities.io page elements, remaining the main page, and resolve the irrecognizable Chinese charactors while export to pdf.
// @author       Onorata Lee
// @match        https://app.capacities.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=capacities.io
// @require      https://update.greasyfork.org/scripts/505351/1435420/jquery%20221.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510824/Capacitiesio%20%E9%A1%B5%E9%9D%A2%E6%89%93%E5%8D%B0%20Capacitiesio%20Print%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/510824/Capacitiesio%20%E9%A1%B5%E9%9D%A2%E6%89%93%E5%8D%B0%20Capacitiesio%20Print%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(() => {
        setTimeout(()=> {
            show_switch_btn();
            $("#print_btn").fadeIn(2000);
        },1000);
    });

    function switch_to_print_view(){
        var target_div = $("div[class='flex grow flex-col items-center']").clone();
        $("body div").remove();
        $("body").append(target_div);
        target_div.css("width","1000px");
    }

    function show_switch_btn(){
        var main_div = $('div[class="ml-2 flex max-w-max shrink-0 items-center justify-end gap-x-1 p-0.5 py-0.5 pr-2.5 text-xs text-secondary"]');
        var btn = $('<button id="print_btn" class="text-xxs font-normal pointer-events-auto mr-0 border-base-strong inline truncate break-all border-opacity-50 transition duration-100 ease-out">🖨️ Switch to Print View</button>');
        btn.click(()=> switch_to_print_view());
        btn.css('display','hide');
        main_div.before(btn);
    }
})();