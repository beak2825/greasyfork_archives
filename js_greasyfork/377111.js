// ==UserScript==
// @name 百度搜索去除百家号结果
// @namespace http://www.zslm.org
// @version      0.8
// @description  向搜索结果中的百家号Say NO 本脚本并非从搜索结果删除百家号而是在搜索请求时表明无需baijia域名出现在结果 by:作死联萌 第一次写油猴脚本 XD (临时增加自动删除百度APP推广内容功能
// @author Genius6do
// @match https://www.baidu.com/*
// @match http://www.baidu.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/377111/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E9%99%A4%E7%99%BE%E5%AE%B6%E5%8F%B7%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/377111/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E9%99%A4%E7%99%BE%E5%AE%B6%E5%8F%B7%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("baidu_strat");
    $("input[type='submit']").click(function(){
      console.log("baidu_onclick");
      var str_ = $("input[name='wd']").val();
      if(str_.indexOf("-baijia") == -1 && str_.indexOf("--n") == -1 && str_ != ""){
          $("input[name='wd']").val($("input[name='wd']").val()+" -baijia");
      }
    })
    var str_load = $("input[name='wd']").val();
    if(str_load.indexOf("-baijia") == -1 && str_load != "" && str_load.indexOf("--n") == -1){
        $("input[name='wd']").val($("input[name='wd']").val()+" -baijia");
        $("input[type='submit']").click();
    }
    function delect_chunwan(){
        $('.chunwan-wrapper').remove();
    }
    $(document).bind('DOMNodeInserted', function(e) {
       if($('.chunwan-wrapper')[0] != undefined){
          delect_chunwan();
       }
    });
    console.log("baidu_stop");
})();