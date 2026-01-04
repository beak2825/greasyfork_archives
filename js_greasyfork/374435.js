// ==UserScript==
// @name         Removed Shortlink - CNT
// @namespace    https://congnghetre.vn
// @version      0.5
// @description  Removed Shortlink
// @author       ChenJi Nguyen
// @match        *://*/*
// @icon  https://congnghetre.vn/wp-content/uploads/2018/07/Favicon.png
// @require  https://code.jquery.com/jquery-2.2.4.min.js
// @exclude     https://facebook.com/*
// @exclude     https://google.com/*
// @exclude     https://youtube.com/*
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @downloadURL https://update.greasyfork.org/scripts/374435/Removed%20Shortlink%20-%20CNT.user.js
// @updateURL https://update.greasyfork.org/scripts/374435/Removed%20Shortlink%20-%20CNT.meta.js
// ==/UserScript==

(function() {
setInterval(function(){
        if(window.location.host.indexOf("linksvip.net") != -1){
        var linksvip = $('#inputLink')[0].value;
            if(linksvip.indexOf("?api=") != -1){
                $("#down").href = getURL(linksvip);
                $("#down").attr( "onClick", "javascript:window.open('"+getURL(linksvip)+"'); return false;" );
                $("#down").html("Tải Xuống Ngay [Removed Shortlink - CNT] <i class=\"fa fa-download\"></i>");
                $('#inputLink')[0].value = getURL(linksvip);
            }
        }else{
                 var links = document.getElementsByTagName("a");
        for(var i=0, max=links.length; i<max; i++) {
            var url = links[i].href;
            if(url.indexOf("?api=") != -1){
                links[i].href = getURL(url);
             // links[i].attr('target', '_blank');
                links[i].setAttribute( "onClick", "javascript:window.open('"+getURL(url)+"'); return false;" )
                }
        };
        }
    }, 1000);



})();
function getURL(rawUrl){
    var raw = rawUrl.split('&')[1];
    var resUrl = raw.substring(3,raw.length);
    var repUrl = resUrl.replace("=", "");
    return window.atob(repUrl);
}