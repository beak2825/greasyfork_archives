// ==UserScript==
// @name         奈菲影视去广告
// @namespace    https://www.nfmovies.com/
// @version      0.6.2
// @description  去广告，看得爽
// @author       You
// @match        https://www.nfmovies.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/402111/%E5%A5%88%E8%8F%B2%E5%BD%B1%E8%A7%86%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/402111/%E5%A5%88%E8%8F%B2%E5%BD%B1%E8%A7%86%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeTimeoutTasks() {
        var biggestTimeoutId = window.setTimeout(function(){}, 1), i;
        for(i = 1; i <= biggestTimeoutId; i++) {
            clearTimeout(i);
        }
    };


    var allscript = $("script");
    var len = allscript.length;
    if (typeof(allscript[len-2]) !== "undefined") {allscript[len-2].remove();}


    function initPage() {
       $('body').css('opacity', 1);
    }

    function removeAds() {
        $("#adleft").remove();
        $("#adright").remove();
        if (window.location.pathname==="/") {
            if (typeof($(".container")[4]) !== "undefined") {$(".container")[4].remove();}
            if (typeof($(".container")[3]) !== "undefined") {$(".container")[3].remove();}
        } else if (window.location.pathname==="/search.php") {

        } else if (window.location.pathname.indexOf("/detail")!=-1) {
            if (typeof($(".container")[3]) !== "undefined") {$(".container")[3].remove();}
            if (typeof($(".container")[2]) !== "undefined") {$(".container")[2].remove();}
            $(".myui-topbg.clearfix").css("height", "248px");
            console.log($(".myui-topbg.clearfix"));
        } else if (window.location.pathname.indexOf("/video")!=-1) {
            if (typeof($(".container")[3]) !== "undefined") {$(".container")[4].remove();}
            if (typeof($(".container")[2]) !== "undefined") {$(".container")[3].remove();}
        }
        if (typeof( $(".hy-layout.clearfix")) !== "undefined")  {$(".hy-layout.clearfix").remove();}
    }

    function dealWithIframe(){
        if (typeof(on_play_pause) !== "undefined") {on_play_pause=function() {console.log("hooked, on_play_pause")};}
        if (typeof(showAd) !== "undefined") {showAd=function()  {console.log("hooked, showAd");};}
        if (typeof(initAd) !== "undefined") {initAd=function()  {console.log("hooked, initAd");};}
        if (typeof(adTime) !== "undefined") {adTime=0;}
        if (typeof(inited) !== "undefined") {inited=true;}
        $('#sponsorAdDiv').hide();
    }

    removeTimeoutTasks();
    if (window.location.pathname.indexOf("/js/player")==-1) {
        removeAds();
        initPage();
    } else {
        console.log("iframe");
        setTimeout(function closeAd() {
            adDiv.hide();
            inited = true;
        }, 500);
        dealWithIframe();
    };

})();