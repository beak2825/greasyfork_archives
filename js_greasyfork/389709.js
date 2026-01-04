// ==UserScript==
// @name         IT之家纯净版
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  去除无用内容，保留文章及评论主体信息
// @author       black lee
// @match        *://*.ithome.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/389709/IT%E4%B9%8B%E5%AE%B6%E7%BA%AF%E5%87%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/389709/IT%E4%B9%8B%E5%AE%B6%E7%BA%AF%E5%87%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    checkJquery();
    SetPage();
})();


function checkJquery() {
    if (!typeof jQuery) {
        var jqueryScript = document.createElement("script");
        jqueryScript.type = "text/javascript";
        jqueryScript.src = "https://code.jquery.com/jquery-3.3.1.min.js";
        document.head.append(jqueryScript);
    }
}

function SetPage(){
  //$(".con-block .lf,.focus_area").remove();
  
    var style = document.createElement('style');
    var strCss = "#top5,#tt50,.current_nav,.sidebar,#side_func,.shareto,.related_post,.dajia,.pre1{ display:none; } ";
    strCss += ".content,.post_comment{width:100%;} .add_comm{width:calc(100% - 2px);} .add_comm textarea{width:calc(100% - 30px);} ";
    strCss += ".content .newsgrade{height:75px; margin: 60px auto;position: relative; }.newsgrade0{margin-left:150px;} #formCenter{margin-top:20px;}";
    strCss += ".vitem iframe{max-height:100%!important;max-width:100%!important}";
    strCss += "";
    strCss += "";
    strCss += "";
    strCss += "";
    strCss += "";
    strCss += "";
    strCss += "";
  
    style.innerHTML = strCss;
    window.document.head.appendChild(style);
    $("img.lazy").parent().css({"text-align":"center"});
    $(".vitem iframe").attr("style","max-width:100%;max-height:100%;width:100%;height:100%");
  
  //$("#top5,#tt50,.current_nav,.sidebar,#side_func,.shareto,.related_post,.dajia").remove();
  //$(".content,.post_comment").css({"width":"100%"});
  
  //$(".add_comm").css({"width":"calc(100% - 2px)"});
  //$(".add_comm textarea").css({"width":"calc(100% - 30px)"});
  
  if(location.href.indexOf("dyn.ithome.com/comment")!=-1){
    var style = document.createElement('style');
    style.innerHTML = "#ulhotlist li,#ulcommentlist li{ width:100%; }";
    window.document.head.appendChild(style);
  }
}
