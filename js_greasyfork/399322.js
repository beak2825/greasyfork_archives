// ==UserScript==
// @name        IT屋-在线测试工具 页面修改
// @namespace   Violentmonkey Scripts
// @match       *://www.it1352.com/*
// @grant       none
// @require     http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version     1.1
// @author      Mediven
// @description IT屋-在线测试工具 调整界面布局
// @downloadURL https://update.greasyfork.org/scripts/399322/IT%E5%B1%8B-%E5%9C%A8%E7%BA%BF%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7%20%E9%A1%B5%E9%9D%A2%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/399322/IT%E5%B1%8B-%E5%9C%A8%E7%BA%BF%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7%20%E9%A1%B5%E9%9D%A2%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
function changeEle(){
  var width = document.body.clientWidth/2;
  var height = document.body.clientHeight-70;
  var head = $("body > div.container.layout_body > div > div > div > div > div.panel.panel-default > div.panel-body > div:nth-child(2) > form");
  head.css("position","fixed");
  head.css("top","0");
  head.css("left","0");
  head.css("padding","15px 50px");
  head.css("background-color","white");
  head.css("z-index","99999999");
  head.css("width","100%");
  head.css("border-style","solid");
  head.css("border-width","0 0 2px 0");
  head.css("border-color","gray");
  var left = $("body > div.container.layout_body > div > div > div > div > div.panel.panel-default > div.panel-body > div:nth-child(1) > div > div > div.CodeMirror-scroll");
  left.css("position","fixed");
  left.css("top","70px");
  left.css("left","0");
  left.css("width",width+"px");
  left.css("height",height+"px");
  left.css("background-color","#0F192A");
  left.css("z-index","99999999");
  var right = $("#compiler-textarea-result");
  right.css("z-index","99999999");
  right.css("position","fixed");
  right.css("top","70px");
  right.css("right","0");
  right.css("width",width+"px");
  right.css("height",height+"px");
  right.css("background-color","#0F192A");
  right.css("color","#FFF");
}
changeEle();
$(window).resize(changeEle());