// ==UserScript==
// @name         Aliexpress photo fetcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       poots
// @match        https://feedback.aliexpress.com/display/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/22620/Aliexpress%20photo%20fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/22620/Aliexpress%20photo%20fetcher.meta.js
// ==/UserScript==

(function() {
    var pFeedbackUrl = "https://feedback.aliexpress.com/display/productEvaluation.htm"+window.location.search+"&withPictures=true";
    var imgs = [];
    $.post(pFeedbackUrl, function(data){
        var pages = $("#simple-pager .ui-label", data).html().toString().split('/')[1];
        var imgs = [];
        $(".pic-view-item img",data).each(function(){
            imgs.push($(this).attr('src'));
        });
        if (pages > 1) {
            for (var i = 2; i <= pages;i++) {
                var pUrl = pFeedbackUrl+"&page="+i;
                $.post(pFeedbackUrl+"&page="+i, function(data){
                    $(".pic-view-item img",data).each(function(){
                        imgs.push($(this).attr('src'));
                    });
                });
            }
        }
        if (imgs.length > 0) {
            var salsa = "<!DOCTYPE>"+
                        "<html>"+
                            "<head>"+
                                "<style>.lmt {max-width:300px;max-height:300px;display:inline-block} .xpn {max-width:100%;height:100%;max-height:100%}</style>"+
                            "</head>"+
                            "<body>";
            for (var j = 0;j < imgs.length;j++) {
                salsa += "<a href='"+imgs[j]+"' onClick='javascript:return false;'><img class='lmt' onClick=\"javascript:this.classList.toggle('lmt');this.classList.toggle('xpn');\" src='"+imgs[j]+"' /></a>";
            }
            salsa +=        "</body>"+
                        "</html>";
            var wnd = window.open(null, "_blank");
            wnd.document.body.innerHTML = salsa;
        }
    });
})();