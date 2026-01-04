// ==UserScript==
// @name         sukebei assist
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  sukebei picture autoengage
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author       Me
// @match        https://sukebei.nyaa.si/view/*
// @match        https://sukebei.nyaa.si/?*
// @match        https://fotokiz.com/*
// @match        https://www.mgstage.com/product/product_detail/*
// @icon         https://www.google.com/s2/favicons?domain=nyaa.si
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452291/sukebei%20assist.user.js
// @updateURL https://update.greasyfork.org/scripts/452291/sukebei%20assist.meta.js
// ==/UserScript==

function sukebeigotopic(){
    var links = $("#torrent-description a");
    links.each(function(index){
        if(index == 0){
            window.open($(this).prop('href'),'_self');
        };
    });
}
function downloadmarked(){
    var gd = $(".downloadmarker i.fa-download");
    gd.each(function(){
        window.open($(this).parent().prop("href"));
    });
}
function markdownloadtarget(){
    var gd = $("tr.success");
    var iii = null;
    var ccc = 0;
    gd.each(function(index){
        var t = $(this).children().eq(7);
        if(parseInt(t.text())>ccc){
            ccc = parseInt(t.text());
            iii = index;
        }
    });
    gd.eq(iii).children().eq(2).css("background-color","#f786e2").addClass("downloadmarker");
}
function skipad(){
    $('input').each(function(index){
        if($(this).prop('value')=='Continue to image...'){
            $(this).click();
        }
    });
    $("img.pic").each(function(index){
        window.open($(this).prop("src"),'_self');
    })
}

(function() {
    'use strict';

    // sukebei
    if (location.hostname == "sukebei.nyaa.si"){
        markdownloadtarget();
        $(document).keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '96'){
                sukebeigotopic();
                downloadmarked();
            }
        });
    }
    // fotokiz
    if (location.hostname == "fotokiz.com"){
        $(document).keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '96'){
                skipad();
            }
        });
    }
    if(location.hostname == "www.mgstage.com"){
        $("div.detail_data table tbody th").each(function(){
            if($(this).text()=="品番："){
            var tid = $(this).next();
            tid.wrapInner('<a id="trigger_link" target="_blank" href=https://sukebei.nyaa.si/?f=0&c=0_0&q='+tid.text()+'></a>');
            }
        });
        $(document).keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '96'){
                window.open($("#trigger_link").attr("href"),'_self');
            }
        });
    }

})();