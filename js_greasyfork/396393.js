// ==UserScript==
// @name            百度网盘-列表标题复制工具1.0
// @namespace       [url=mailto:593747881@qq.com]593747881@qq.com[/url]
// @author          rick
// @description     提供一键复制列表标题名称的功能.免费使用，欢迎提出其他需求.发送邮箱:593747881@qq.com
// @match           *://pan.baidu.com/disk/*
// @require         https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require         https://greasyfork.org/scripts/396391-dialog/code/dialog.js?version=772234
// @version         1.0.0
// @run-at          document-end
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/396393/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98-%E5%88%97%E8%A1%A8%E6%A0%87%E9%A2%98%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B710.user.js
// @updateURL https://update.greasyfork.org/scripts/396393/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98-%E5%88%97%E8%A1%A8%E6%A0%87%E9%A2%98%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B710.meta.js
// ==/UserScript==
(function () {
    'use strict';
  var btn_Name = "提取列表标题"
  var root = $("#layoutMain > div > div");
  var last_btn = $(root).find('.last-button');//获得最后一个按钮位置.

  //构建自定义按钮
  var type_btn = "<span class='g-dropdown-button last-button' style='display: inline-block;'><a id ='copyList' class='g-button' data-button-id='b37' data-button-index='4' href='javascript:;'><span class='g-button-right'><em class='icon icon-share'></em><span class='text' style='width: auto;'>"+btn_Name+"</span></span></a></span>"
  
  //添加自定义按钮到页面
  $(last_btn).parent().append(type_btn);

  //添加复制事件
  $("#copyList").bind("click",function(){
    var list = $(root).find("dd .file-name > .text");//获取每个列表文件名称.
    console.log(list);
    var result_List="";
    $(list).each(function(k,v){
      var e=$(v);
      result_List = result_List+e.text()+"\n";
      //console.log(e.text());

    });
   Dialog({
     title:"鼠标右键【单击】->全选->复制.",
		content: "<div style='height:400px;'><textarea style='width: 100%;height: 100%;resize: none;border: none;font-size: inherit;'>"+result_List+"</textarea></div>",
    maskClose: true,
	  showButton: false
   });
});
  
 //最外部结束
})();
