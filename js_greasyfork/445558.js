// ==UserScript==
// @name        复制华为应用市场APP名称+对应图片名称
// @namespace   huawei_appgallery
// @supportURL  http://www.yeyezai.com/
// @match       https://appgallery.huawei.com/Apps
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant       none
// @version     1.0
// @author      yeyezai
// @date        2022-05-24
// @license     MIT
// @descrition  复制华为应用市场APP名称+对应图片名称
// @description 2022-05-24
// @downloadURL https://update.greasyfork.org/scripts/445558/%E5%A4%8D%E5%88%B6%E5%8D%8E%E4%B8%BA%E5%BA%94%E7%94%A8%E5%B8%82%E5%9C%BAAPP%E5%90%8D%E7%A7%B0%2B%E5%AF%B9%E5%BA%94%E5%9B%BE%E7%89%87%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/445558/%E5%A4%8D%E5%88%B6%E5%8D%8E%E4%B8%BA%E5%BA%94%E7%94%A8%E5%B8%82%E5%9C%BAAPP%E5%90%8D%E7%A7%B0%2B%E5%AF%B9%E5%BA%94%E5%9B%BE%E7%89%87%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==


$(document).ready(function () {
    //添加样式
    var btnStyle="<style>"
    +"#btnDiv{font-size:14px; position:fixed; left:0px; top:15%; z-index:65536;}"
    +".show_txt{display:none; background:#FFF;}"
    +"</style>";

    //添加按钮
    var btnAll = "<div><input type='button' id='btn_ShowList' value='提取列表'></div>"
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
    var app_img_url ="";
    var app_name = "";
    $('div.item').each(function(){
        //img_url =$(this).class('.cc-image').attr('style').replace('background-image: url("','').replace('");',"");
        //img_url = $('.cc-image').attr('style');
        app_img_url =$(this).find('.img').attr('src');
        app_name = $(this).find('.name').text();

        txt += app_img_url + "\t" + app_name + "\n";
        //txt += $(this).text().replace(/\s|已增强清晰度/g,'').replace('\tundefined','')+"\t"+img_url+"\n";
        //txt = txt.replace('background-image: url("','').replace('");',"");
    });

    $('.show_txt').append(txt);
    copyText($('.show_txt'));
}