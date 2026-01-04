// ==UserScript==
// @name         Confluence Helper
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  用于增强Confluence折叠宏展示和目录展示
// @author       zhanghui.james
// @include        http*://wiki*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447898/Confluence%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/447898/Confluence%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cssText=".expand-content{position: fixed;right: 0px; background: #f7f6f4;padding:10px; z-index: 999;top: 60px;margin: 0 0 !important;width:55%; height: 65%; overflow: auto;box-shadow:5px 5px 5px 5px rgb(0 0 0 / 40%);max-width: 95%;max-height: 80%;min-width:65%;min-height:65%;resize:both;padding: 20px 20px;border-radius: 5px;}"
                +".expand-control-icon{display:none}"
                +".toc-macro{font-size: 14px;position: fixed;right: 0px;top: 150px;background: #f7f9fb;z-index: 998;padding: 5px;box-shadow: 5px 5px 5px 5px rgb(0 0 0 / 40%);width:300px;min-height:400px;max-height:65%;overflow:auto;transition:all 0.5s ease 0s;}"
                +".collapsed .acs-side-bar{bottom: 80px;display: none;}"
                +".collapsed #space-tools-menu-trigger{display:block;width:34px;margin:5px auto;display:none}"
                +".collapsed .expand-collapse-trigger{margin:10px 0 0 calc(50% - 8px);top:40px;right:auto}"
                +".acs-side-bar{position: absolute;top: 0;bottom: 15px !important; width: 100%;background-color: #1a202c !important;}"
                +".acs-side-bar::-webkit-scrollbar{width:12px}"
                +".acs-nav-sections{display:none}"
                +"#breadcrumb-section{display:none}"
                +"#page-metadata-banner{display:none}"
                +"#title-text{margin:0;font-size:35px !important;font-weight:900 !important;padding-top: 0px !important}"
                +".page-metadata{margin:-15px 0 40px !important}"
                +".space-tools-section{display:none}"
                +".aui-page-panel{margin-left:10px}"
                +".ia-fixed-sidebar{width:10px}"
                +"body{background:#fff!important;color:#000}"
                +".ia-fixed-sidebar{position:fixed;z-index:10;bottom:0;filter:saturate(0.8)}"
                +".toc-macro ul{list-style-type:none;padding-inline-start:12px;font-size:10px;font-weight:400}"
                +".toc-macro::-webkit-scrollbar{width:0px;background-color:#f5f5f5}"
                +".wiki-content h1,.wiki-content h2{border-bottom-color:#fff;font-weight:revert}"
                +".wiki-content h2{border-bottom-color:#fff;font-weight:unset!important}"
                +"#header .aui-header .aui-nav .aui-button-primary{background-color:#0000002b;color:#fffdfd}"
                +".cp-container{font-family:Arial,sans-serif;font-size:16px;background-color:rgba(51,51,51,0.95);height:100%;position:fixed;top:0;left:0;right:0;z-index:1001 !important}"
                +".page-metadata,.page-metadata ul li a:link,.page-metadata ul li a:focus,.page-metadata ul li a:hover,.page-metadata ul li a:active,.page-metadata ul li a:visited{font-size:12px;color:#bebebe !important;line-height:1.5;font-weight:300}"

    var style = document.createElement("style");
    style.type = "text/css";
    style.textContent = cssText;
    document.getElementsByTagName("HEAD").item(0).appendChild(style);

    var boarddiv = "<div id='mask' style='background:rgba(0, 0, 0, 0.85);width:100%;z-index:998;position:absolute;top:0'></div>";
     $(document.body).append(boarddiv);
    $(document).ready(function(){
        $('div[id^="expander-control-"]').click(function(){
              var maskHeight=$('.ia-splitter').height()+322;
              $('#mask').height(maskHeight);
              $('#com-atlassian-confluence').css({"overflow-y":"hidden"});
        });
    });



    $(document).mousedown(function(e){
        var divContainer = $('.cp-container')[0];
        if(null!=divContainer && divContainer.contains(window.event.srcElement)){
           return;
        }
        var _list = $('.expand-container');
        if(!_list.is(e.target) && _list.has(e.target).length === 0){
            //$('#pop').hide();
            var expandEles= $('.expand-content');
            for(var i=0;i<expandEles.length;i++){
                if(expandEles[i].style.display=='block'){
                    //$(".expand-control")[i].click();
                   $('div[id^="expander-control-"]')[i].click();
                   setTimeout(function() {$('#mask').height(0);  $('#com-atlassian-confluence').removeAttr("style")}, 280);
                }
            }
        }
    });

    if($('.toc-macro').length!=0){
        if(sessionStorage.getItem("menuOpen")=='block'||sessionStorage.getItem("menuOpen")==''){
            $('body').append("<button id='menu' style='position:fixed;right:0;top:127px;padding:1px 8px 1px 13px;background-color:darkseagreen;font-weight:900;border:black;filter:drop-shadow(2px 4px 6px black);'>目录 ▶</div>");
            $(".toc-macro").css({ "right": "0px", "width": "270px", "height": "auto" });
        }else{
            $('body').append("<button id='menu' style='position:fixed;right:0;top:127px;padding:1px 8px 1px 13px;background-color:darkseagreen;font-weight:900;border:black;filter:drop-shadow(2px 4px 6px black);'>目录 ◀</div>");
            $(".toc-macro").css({ "right": "-280px", "width": "270px", "height": "auto" });
        }

        $('#menu').click(function(){
            if( $('#menu')[0].innerText=='目录 ▶'){
                //$('.toc-macro')[0].style.display='none';
                 $(".toc-macro").animate({}, 500, function () {
                     //第一个花括号里面是动画内容，可以为空，但不能省去中括号
                     $(".toc-macro").css({ "right": "-280px", "width": "270px", "height": "auto" });
                 })
                $('#menu')[0].innerText='目录 ◀';
                sessionStorage.setItem("menuOpen", "none");
            }else{
                //$('.toc-macro')[0].style.display='block';
                $(".toc-macro").animate({}, 500, function () {
                     //第一个花括号里面是动画内容，可以为空，但不能省去中括号
                     $(".toc-macro").css({ "right": "0px", "width": "270px", "height": "auto" });
                 })
                $('#menu')[0].innerText='目录 ▶';
                 sessionStorage.setItem("menuOpen", "block");
            }

        });
    }

})();