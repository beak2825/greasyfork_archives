// ==UserScript==
// @name         蛋蛋赞自动下集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动下一集
// @author       fartpig
// @match        https://www.dandanzan10.top/*
// @match        https://www.dandanzan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dandanzan10.top
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454183/%E8%9B%8B%E8%9B%8B%E8%B5%9E%E8%87%AA%E5%8A%A8%E4%B8%8B%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/454183/%E8%9B%8B%E8%9B%8B%E8%B5%9E%E8%87%AA%E5%8A%A8%E4%B8%8B%E9%9B%86.meta.js
// ==/UserScript==
/* global $, Cookies */

(function() {
    'use strict';

    let autoNext = Cookies.get("AutoNext") ? Cookies.get("AutoNext") : false;

    $(".product-header").after("<div style='float: right;'><button id='toggleAutoNext'>" + (autoNext ? '关闭':'打开') +"自动下集</button></div>");

    $(document).on("click", "#toggleAutoNext", function() {
        toggleAutoNext();
    });

    function toggleAutoNext(){
        autoNext = !autoNext;
        $("#toggleAutoNext").text((autoNext ? '关闭':'打开') + "自动下集");
        Cookies.set("AutoNext", autoNext, { expires: 365 });

        alert("ok");
    }

    $(document).ready(function(){
        $("#video")[0].onended = function () {
            if (autoNext) {
               let current = $("li.on");
               let next = $("li.on").next();
               next.children("a").click();
               current.removeClass("on");
               next.addClass("on");
            }
        };
    });
})();