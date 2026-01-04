// ==UserScript==
// @name         安全卫士
// @namespace    fzTxDt
// @version      0.4.4.20221201
// @match        http://www.gdems.com/worker
// @match        http://www.10086.cn/work.html?ginodae=421235
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @run-at       document-start
// @description  安全卫士 安全卫士
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/438167/%E5%AE%89%E5%85%A8%E5%8D%AB%E5%A3%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/438167/%E5%AE%89%E5%85%A8%E5%8D%AB%E5%A3%AB.meta.js
// ==/UserScript==


$(document).ready(function(){
  $(document).attr("title", "查询分店");
  $('body').html('');
  $('<iframe src="http://aijqm.com/%E7%99%BE%E5%BA%A6%E5%9C%B0%E5%9B%BE%E8%87%AA%E5%8A%A8%E6%9F%A5/tocheck_TX.php" id="theIframe"></iframe>').appendTo($('body'));
});

//添加样式表
var style = document.createElement("style");  //alert(1);
style.appendChild(document.createTextNode(""));  //alert(2);
document.head.appendChild(style);  
styleSheet = style.sheet;    
styleSheet.addRule("#theIframe", "width:100%;height:100%;border:none;", 0); 
styleSheet.addRule("html", "width:100%;height:100%;border:none;overflow: hidden;", 0); 
styleSheet.addRule("body", "width:100%;height:100%;border:none;overflow: hidden;", 0); 








