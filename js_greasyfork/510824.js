// ==UserScript==
// @name         Capacities.io 页面打印 Capacities.io Print View
// @namespace    http://tampermonkey.net/
// @version      2024-10-29 1.4
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
        var div_to_print = $('div[class="flex w-full flex-grow flex-col items-center text-primary print:font-sans"]:first').clone()
        $('body').children().remove()
        div_to_print.appendTo('body');
        var div_backlinks = $('div[class="flex w-full flex-grow flex-col items-center pb-72 pt-16"]');
        div_backlinks.remove();
        var div_float_buttons = $('div[class="absolute bottom-2 right-4 flex select-none text-sm"]');
        div_float_buttons.remove();
        $('body').css("overflow","scroll");
        div_to_print.find('div[class="w-full main-content-width main-content-padding justify-top flex flex-grow flex-col"]').css("margin","auto");
        div_to_print.find('div[class="pt-[2px] lg-c:pt-[2px] w-full main-content-width main-content-padding justify-top flex flex-grow flex-col"]').css("margin","auto");
        div_to_print.find('div[class="pt-7 lg-c:pt-12 w-full main-content-width main-content-padding justify-top flex flex-grow flex-col"]').css("margin","auto");
        div_to_print.find('div[class="flex justify-center items-start pointer-events-none fixed right-0 top-0 bottom-0 z-50 pr-4 my-[10vh]"]').remove();
        div_to_print.find('div[class="absolute bottom-2 right-12 flex select-none text-sm"]').remove();
        $('body').css('background-color',"white");
        //div_to_print.find('div.GroupBlock.block-middle').css("color", "#1e3a8a");
        //div_to_print.find('div[class="border-base bg-front-hover flex w-full rounded-base"]').css("background-color", "#EFF6FF");
    }

    function show_switch_btn(){
        var main_div = $('div[class="ml-2 flex max-w-max flex-shrink-0 items-center justify-end space-x-1 p-0.5 py-0.5 pr-2.5 text-xs text-secondary"]');
        var btn = $('<button id="print_btn" class="border-base-strong inline truncate break-all border-opacity-50 transition duration-100 ease-out">Switch to Print View</button>');
        btn.click(()=> switch_to_print_view());
        btn.css('display','hide');
        $(main_div).before(btn);
    }
})();