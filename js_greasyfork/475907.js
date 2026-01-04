// ==UserScript==
// @name         DanDanZan Remember Played
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Dandanzan useful media control
// @author       You
// @match        *://*.dandanzan10.top/*
// @match        *://*.dandanzan.com/*
// @match        *://*.dandanzan.net/*
// @match        *://*.dandanzan.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dandanzan10.top
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475907/DanDanZan%20Remember%20Played.user.js
// @updateURL https://update.greasyfork.org/scripts/475907/DanDanZan%20Remember%20Played.meta.js
// ==/UserScript==
/* global $, Cookies */

(function() {
    console.log = function() { };
    console.clear = function() { };
    console.info("tzwei connected");

    'use strict';

    let videoTitle = $("meta[property='og:url']").attr("content") ?? false;

    if(videoTitle){
        var infoid = videoTitle.split('/').reverse()[0].split(".")[0];

        $('.on').removeClass('on');

        $(document).on("click", ".rmbClass", function() {
            let value = $(this).attr("onclick");

            let tClassName = value.replace(/[_\W]+/g, "");
            Cookies.set(infoid + "lastPlayed", tClassName, { expires: 365 });
        });

        $(".playlist.clearfix> ul > li > a").each(function() {
            let onClickValue = $(this).attr("onclick");
            let tClassName = onClickValue.replace(/[_\W]+/g, "");

            $(this).addClass("rmbClass");
            $(this).addClass(tClassName);
        });

        let lastPlayed = Cookies.get(infoid + "lastPlayed") ? Cookies.get(infoid + "lastPlayed") : false;
        if(lastPlayed){
            triggerLastPlayed(lastPlayed);
        }
    }

    function triggerLastPlayed(lastPlayed){
        if($("."+lastPlayed).length){
            $('.on').removeClass('on');

            let titleIndex = parseInt(lastPlayed.substr(4,1));
            $("dt:nth-child("+(titleIndex + 1)+")").click();
            $("."+lastPlayed).click();
            $("."+lastPlayed).parent().addClass("on");
        }
    }

    function nextEpi(){
        let videoTitle = $("meta[property='og:url']").attr("content") ?? false;
        var infoid = videoTitle.split('/').reverse()[0].split(".")[0];
        let lastPlayed = Cookies.get(infoid + "lastPlayed") ? Cookies.get(infoid + "lastPlayed") : false;
        let testval = parseInt(lastPlayed.substr(5));
        triggerLastPlayed("play" + lastPlayed.substr(4,1) + (testval + 1))
    }

    function prevEpi(){
        let videoTitle = $("meta[property='og:url']").attr("content") ?? false;
        var infoid = videoTitle.split('/').reverse()[0].split(".")[0];
        let lastPlayed = Cookies.get(infoid + "lastPlayed") ? Cookies.get(infoid + "lastPlayed") : false;
        let testval = parseInt(lastPlayed.substr(5));
        triggerLastPlayed("play" + lastPlayed.substr(4,1) + (testval - 1))
    }

    $(".product-header").after("<div style='float: right;'><button id='saveTime'>Save</button><button id='loadTime'>Load</button>&nbsp;&nbsp;<button id='prevEpi'>PREV</button><button id='nextEpi'>NEXT</button></div>");
    $(".product-header").after("<div style='float: left;'><button id='seekRewind'>Seek Rewind (5s)</button><button id='seekForward'>Seek Forward (5s)</button>&nbsp;&nbsp;<button id='seekfForward'>FF Anime OP(70s)</button></div>");

    $(document).on("click", "#saveTime", function() {
        saveTime();
    });

    $(document).on("click", "#loadTime", function() {
        loadTime();
    });

    $(document).on("click", "#prevEpi", function() {
        prevEpi();
    });

    $(document).on("click", "#nextEpi", function() {
        nextEpi();
    });

    $(document).on("click", "#seekForward", function() {
        seekForward(5);
    });

    $(document).on("click", "#seekfForward", function() {
        seekForward(70);
    });

    $(document).on("click", "#seekRewind", function() {
        seekRewind(5);
    });

    function seekForward(sec){
        $("#video")[0].currentTime = $("#video")[0].currentTime + sec;
    }

    function seekRewind(sec){
        $("#video")[0].currentTime = $("#video")[0].currentTime - sec;
    }

    function saveTime(sec){
        let lastTime = $("#video")[0].currentTime;

        let videoTitle = $("meta[property='og:url']").attr("content") ?? false;
        var infoid = videoTitle.split('/').reverse()[0].split(".")[0];

        Cookies.set(infoid + "lastTime", lastTime, { expires: 365 });

        alert("ok");
    }

    function loadTime(sec){
        let videoTitle = $("meta[property='og:url']").attr("content") ?? false;
        var infoid = videoTitle.split('/').reverse()[0].split(".")[0];

        let lastTime = Cookies.get(infoid + "lastTime") ? Cookies.get(infoid + "lastTime") : false;
        $("#video")[0].currentTime = lastTime;
    }

    // $("#prevEpi").click();
    // $("#nextEpi").click();
})();