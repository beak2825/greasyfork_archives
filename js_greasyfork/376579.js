// ==UserScript==
// @name         贴吧一键大图
// @namespace    http://css.thatwind.com/
// @version      0.1
// @description  贴吧点击一下即显示大图
// @author       遍智
// @match        *://tieba.baidu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376579/%E8%B4%B4%E5%90%A7%E4%B8%80%E9%94%AE%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/376579/%E8%B4%B4%E5%90%A7%E4%B8%80%E9%94%AE%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interval=setInterval(function(){
        if($){
            doIt();
            clearInterval(interval);
        }
    },50);

    function doIt(){

        $(document.body).append("<div id='zd_img-box' style='cursor:url(https://gsp0.baidu.com/5aAHeD3nKhI2p27j8IqW0jdnxx1xbK/tb/img/frs/cur_zout.cur),pointer;display:none;position:fixed;width:100%;height:100%;top:0;left:0;bottom:0;right:0;z-index:99999;background:rgba(0,0,0,0.4);'></div>");

        $("#zd_img-box").click(function(){
            $("#zd_img-box").hide();
            $("#zd_img-box")[0].innerHTML="";
        });

        setInterval(function(){
            $("img.BDE_Image").unbind("click");
        },100);

        $(document.body).on("click","img.BDE_Image",function(e){
            var img_src="http://imgsrc.baidu.com/forum/pic/item/"+e.currentTarget.getAttribute("src").match(/\/([^\/]+)$/)[1];
            $("#zd_img-box").append("<img style='max-width:90%;max-height:90%;position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;' src='"+img_src+"'>");
            $("#zd_img-box").show();
        });
    }


})();