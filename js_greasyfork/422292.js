// ==UserScript==
// @name        数据分析刷课脚本
// @namespace   Tutu
// @icon        https://ftp.bmp.ovh/imgs/2020/07/b32e9d8ea616c13d.png
// @match       http*://*.forchangecode.com/*
// @version     1.00
// @author      Tutu
// @description 自动刷课
// @require     https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422292/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/422292/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
var $ = window.jQuery;
(function() {
  document.onkeydown = function(){
    const e = window.event;
    const keyCode = e.keyCode;
    switch(keyCode){
        case 84:
            if(!event.ctrlKey && !event.ctrlKey){
              flat = !flat
            }
            break;
    };
  };
    var flat = false
    setInterval(function(){
      if (flat){
        if ($(".run") && !$(".run").hasClass("running") && !$(".run").last().parent().hasClass("clicked")){      
          if (($(".steps-btn").text() == " 回到练习 " || $(".steps-btn").text() == " 练习中… ") && $(".runAll-btn")){
            if ($(".skipBox").last().text() != "忽略错误 " && !$(".skipBox").last().hasClass("clicked")){
              $(".skipBox").last().click();
              $(".skipBox").last().addClass("clicked");
            } else {
              $(".run").last().click();
              $(".run").last().parent().addClass("clicked");
            }
          }
        };
        if ($(".next-button").length != 0){
          if (!$(".next-button")[0].classList.contains("disabled")){
            $(".next-button").click();
          };
        };
        if ($(".required")){
          $(".required").click();
        };
        if ($(".steps-btn")){
          console.log($(".steps-btn").text());
          if ($(".steps-btn").text() != " 回到练习 "){
            $(".steps-btn").click();
          }
        };
        if ($(".component-step .operation .btn")){
          $(".component-step .operation .btn").click();
        };
        if ($(".btn-finish")){
          $(".btn-finish").click();
        };     
        if ($(".choice-options .option-item-content")){
          $(".option-item-content").click();
        };
        $(".plugin-markdown-choice").last().click();
      };
    }, 300);

})();