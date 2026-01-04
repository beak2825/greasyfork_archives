// ==UserScript==
// @name        复制基木鱼素材批量上传窗口标题、图片链接
// @namespace   baidu_jimuyu
// @supportURL  http://www.yeyezai.com/
// @match       https://wutong.baidu.com/material/user/*/materials?ucUserId=*
// @require     https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant       none
// @version     1.0
// @author      yeyezai
// @date        2020-12-29
// @license     MIT
// @description 基木鱼素材库批量上传之后，复制上传窗口中图片的标题、链接。进入前需要先手动刷新页面
// @downloadURL https://update.greasyfork.org/scripts/445559/%E5%A4%8D%E5%88%B6%E5%9F%BA%E6%9C%A8%E9%B1%BC%E7%B4%A0%E6%9D%90%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E3%80%81%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/445559/%E5%A4%8D%E5%88%B6%E5%9F%BA%E6%9C%A8%E9%B1%BC%E7%B4%A0%E6%9D%90%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E7%AA%97%E5%8F%A3%E6%A0%87%E9%A2%98%E3%80%81%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


$(document).ready(function () {
    //添加样式
    var btnStyle="<style>"
    +"#btnDiv{font-size:14px; position:fixed; left:0px; top:15%; z-index:65536;}"
    +".show_txt{display:none;}"
    +"</style>";

    //添加按钮
    var btnAll = "<div><input type='button' id='btn_ShowList' value='提取楼盘名称列表'></div>"
    +"<div class='show_txt'></div>";
    var btnDiv = "<div id='btnDiv'>" + btnAll + "</div>"+btnStyle;
    $("body").append(btnDiv);

    //显示当前页
    var btn_ShowList = document.getElementById("btn_ShowList");
    bindButtonEvent(btn_ShowList, "click", ShowList);

});


function bindButtonEvent(element, type, handler){
    if(element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else {
        element.attachEvent('on'+type, handler);
     }
}

// 复制文本内容到剪切板
function copyText(obj) {
  if (!obj) {
    return false;
  }
  var text;
  if (typeof(obj) == 'object') {
    if (obj.nodeType) { // DOM node
      obj = $(obj); // to jQuery object
    }
    try {
      text = obj.text();
      if (!text) { // Maybe <textarea />
        text = obj.val();
      }
    } catch (err) { // as JSON
      text = JSON.stringify(obj);
    }
  } else {
    text = obj;
  }
  //var $temp = $('<input>'); // Line feed is not supported
  var $temp = $('<textarea>');
  $('body').append($temp);
  $temp.val(text).select();
  var res = document.execCommand('copy');
  $temp.remove();
  return res;
}

/*******************************/

function ShowList(){
    $('.show_txt').empty();
    var txt = "";
    $('.nlcd_name a').each(function(){
        txt += $(this).text().replace(/\s/g,'')+"\n";
    });
    $('.show_txt').append(txt);
    copyText($('.show_txt'));
}