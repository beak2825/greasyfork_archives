// ==UserScript==
// @name         xuwc
// @namespace    https://www.xuweichao.com/
// @version      0.1
// @description  try to take over the world!
// @author       xuwc
// @include      https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387298/xuwc.user.js
// @updateURL https://update.greasyfork.org/scripts/387298/xuwc.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $("#su").val("百度");
    var lg = $("#lg");
    if(lg.length == 1){
        var html = "<div><span style='color:green;font-size:24px;'>百度一下，你就得到</span></div>";
        html += "<img src='https://www.xuweichao.com/images/17486655.jpg'/>";
        lg.html(html);
    };
    var ss = $(".s_btn_wr");
    if(ss.length == 1){
        ss.find("input").eq(0).after("<input type='button' id='su2' value='谷歌' class='bg s_btn'>");
        $(".s_btn").css("width","50px").css("border-bottom","");
        $("#su2").css("background-color","#f80c");
        $("#su2").on('click',function(){
            var text = $("#kw").val();
            var url = "https://www.google.com/search?q="+text+"&aqs=chrome..69i57j0l5.4124j0j1&sourceid=chrome&ie=UTF-8";
            if(text == ""){
                url = "https://www.google.com/";
            }
            window.open(url);
        });
    };
})();