// ==UserScript==
// @name        合工大研究生教学管理信息系统-研究生培养计划-打印功能补丁
// @namespace   Violentmonkey Scripts
// @match       *://yjsjw.hfut.edu.cn/student/*
// @grant       none
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/jQuery.print/1.5.1/jQuery.print.js
// @require     https://cdn.bootcdn.net/ajax/libs/PrintArea/2.4.1/jquery.PrintArea.js
// @version     0.1
// @author      longskyer
// @run-at      document-end
// @description 针对合工大研究生教学管理信息系统中点击打印按钮没有反应的问题，在菜单树左边添加了新的打印按钮，可以直接打印出培养计划书。
// @downloadURL https://update.greasyfork.org/scripts/427148/%E5%90%88%E5%B7%A5%E5%A4%A7%E7%A0%94%E7%A9%B6%E7%94%9F%E6%95%99%E5%AD%A6%E7%AE%A1%E7%90%86%E4%BF%A1%E6%81%AF%E7%B3%BB%E7%BB%9F-%E7%A0%94%E7%A9%B6%E7%94%9F%E5%9F%B9%E5%85%BB%E8%AE%A1%E5%88%92-%E6%89%93%E5%8D%B0%E5%8A%9F%E8%83%BD%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/427148/%E5%90%88%E5%B7%A5%E5%A4%A7%E7%A0%94%E7%A9%B6%E7%94%9F%E6%95%99%E5%AD%A6%E7%AE%A1%E7%90%86%E4%BF%A1%E6%81%AF%E7%B3%BB%E7%BB%9F-%E7%A0%94%E7%A9%B6%E7%94%9F%E5%9F%B9%E5%85%BB%E8%AE%A1%E5%88%92-%E6%89%93%E5%8D%B0%E5%8A%9F%E8%83%BD%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==
(function(){

  $("frame[name='leftFrame']").attr("id", "leftFrame"); 
  $("frame[name='mainFrame']").attr("id", "mainFrame"); 
  var tmp=window.top.frames['leftFrame'].document.getElementById("newPrint");
  if( tmp==null){
     $("body",window.top.frames['leftFrame'].document).append('<input id="newPrint" type="button" value="新打印">');
  }
  
  $("#newPrint",window.top.frames['leftFrame'].document).on("click",function () { 
      console.log("新打印按钮被点击了!");
      $("div:first",window.top.frames['mainFrame'].document).attr("id","toPrint");
      $(".PageNext",window.top.frames['mainFrame'].document).css("page-break-after","always");
      $(".td01:first",window.top.frames['mainFrame'].document).css("height","105");
      $(".td01",window.top.frames['mainFrame'].document).css("padding","1px 11px 1px 11px");
      $("td[colspan='4']",window.top.frames['mainFrame'].document).attr("valign","top");
      $("div[style='width:100%; height: 90; FONT-SIZE: 10.5pt;']",window.top.frames['mainFrame'].document).css("height","91");
      $("span[style='FONT-SIZE: 12pt;'] span[style='width:150']",window.top.frames['mainFrame'].document).css("padding-right","80");
      $("table",window.top.frames['mainFrame'].document).eq(3).next().remove();
      $("#toPrint",window.top.frames['mainFrame'].document).print();
      //$("#toPrint",window.top.frames['mainFrame'].document).css("text-align","center");
      //$("#toPrint",window.top.frames['mainFrame'].document).css("vertical-align","center");
      //$("body",window.top.frames['mainFrame'].document).css("align","center");
      //$("#toPrint",window.top.frames['mainFrame'].document).printArea({debug: false, globalStyles: true,importCSS: true, printContainer: true, operaSupport: true});
  });
  
})();
