// ==UserScript==
// @name         反t66y反广告拦截插件措施&标记已点击链接
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        *://t66y.com/*
// @match        *://*.t66y.com/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406747/%E5%8F%8Dt66y%E5%8F%8D%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E6%8F%92%E4%BB%B6%E6%8E%AA%E6%96%BD%E6%A0%87%E8%AE%B0%E5%B7%B2%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/406747/%E5%8F%8Dt66y%E5%8F%8D%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E6%8F%92%E4%BB%B6%E6%8E%AA%E6%96%BD%E6%A0%87%E8%AE%B0%E5%B7%B2%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tpc_content0 = $('.tpc_content:eq(0)').html();
    window.tpc_content0=tpc_content0;
    var tpc_contents = $('.tpc_content');
    console.log(tpc_contents.length);
    if ( tpc_contents.length >1) {
        $('.tpc_content:eq(1)').html(window.tpc_content0);
    }else{
        $('.tpc_content:eq(0)').after(window.tpc_content0);
    }
    //GM_addStyle('a:visited {color:#ffffff !important;background-color:#000000 !important;}');
    function getStoredUrls(){
        var storedUrls = JSON.parse(localStorage.getItem("urls"));
        if ( typeof(storedUrls) === "undefined" || storedUrls === null ) {
            storedUrls = new Array();
        }
        return storedUrls;
    }
    function saveUrl(url){
        var storedUrls = getStoredUrls();
        if(storedUrls.indexOf(url) < 0){
            storedUrls.push(url);
            localStorage.setItem("urls", JSON.stringify(storedUrls));
        }
    }
    function  setAStyle(aObj){
        $(aObj).parent().css({"background-color":"rgba(255,0,0,0.2)"});
    }
    $(document).ready(function() {
        var urls = getStoredUrls();
        $("a").each(function() {
            var href_= $(this).attr( "href" );
            if(urls.length >0 && urls.indexOf(href_) >= 0){
                setAStyle(this);
            }else{
                $(this).bind("click mouseup", function(e) {
                    if(e.type === "click" ||(e.which === 2)){}
                    console.log(href_);
                    saveUrl(href_);
                    setAStyle(this);
                });
            }
        });
    });
})();