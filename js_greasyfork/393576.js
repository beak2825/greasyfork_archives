// ==UserScript==
// @name         快速上传图片至图床
// @namespace   Violentmonkey Scripts
// @version      1.2
// @match        *://*/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://apps.bdimg.com/libs/jqueryui/1.10.4/jquery-ui.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @author       yaohunzhanyue
// @description  点击内置按钮，可自动上传本地图片到免费图床，并将返回的图片链接写入系统粘贴板。
// @downloadURL https://update.greasyfork.org/scripts/393576/%E5%BF%AB%E9%80%9F%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E8%87%B3%E5%9B%BE%E5%BA%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/393576/%E5%BF%AB%E9%80%9F%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E8%87%B3%E5%9B%BE%E5%BA%8A.meta.js
// ==/UserScript==

GM_registerMenuCommand("上传", function(){$('#popup').fadeIn()})

'use strict';
var popupdiv = '\
    <div id="popup" style="width:400px; height: auto; padding-bottom: 10px; border-radius: 10px; background-color: #ffffff; box-shadow: 0 0 5px #444444; display: none; position: absolute; left: 50%; margin-left: -200px; top: 250px; z-index:1000;">\
  <div style="font-size:22px; font-weight: 600; padding: 10px 0; border-bottom: 1px solid #cccccc; border-radius: 10px 10px 0 0; background: #e2e2e2; text-align: center; cursor: move;">Image Uploader</div>\
  <span id="close" style="display: block; position: absolute; right: 10px; top: 10px; font-size: 12px; color: #ffffff; background-color: #444444; padding: 2px 6px; border-radius: 6px; cursor: pointer;" onMouseOver="this.style.color=\'#ff0000\';" onMouseOut="this.style.color=\'#ffffff\';">关闭</span>\
  <div style="margin: 10px 20px;">\
    <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">嵌入本地图片</div>\
    <input type="file" accept="image/*" id="upfile" name="file" style="background: #ffffff; border: 1px solid #cccccc; width: 290px; height: 24px; outline: none;" >\
    <span id="tip1" style="font-size: 13px; color: red; margin-top: 10px; display: none;"></span>\
    <div style="font-size: 18px; font-weight: 600; margin: 20px 0 10px 0;">嵌入网络图片</div>\
    <div style="height: 26px;">\
      <input type="text" id="image_link" style="vertical-align:top; width: 280px; height: 24px; line-height: 26px; border: 1px solid #cccccc; background: #ffffff; outline: none; padding: 0 5px; font-size: 12px;" placeholder="请输入网络图片的链接"/>\
    </div>	\
    <span id="tip2" style="font-size: 13px; color: red; margin-top: 10px; display: none;"></span>\
    <div id="image_show" style="margin-top: 20px; display: none;"></div>\
  </div>\
</div>\
';
$("body").append(popupdiv);

$("#popup").draggable(); // 弹出框可以拖拽

$("#image_link").change(function(e){
    var image_link = $("#image_link").val();
});

$("#close").click(function(){ // 关闭弹框
    $("#popup").fadeOut(); // 淡出效果
});

$("#upfile").change(function(e){
    $("#tip1").css("display","block");
    $("#tip1").html("图片正在上传中...");
    var image_form = new FormData();
    image_form.append('smfile',this.files[0]);
    $.ajax({
        url: 'https://sm.ms/api/upload',
        type: 'POST',
        data: image_form,
        mimeType: 'multipart/form-data',
        contentType: false,
        cache: false,
        processData: false,
        dataType: 'json',
        success: function(data) {
            console.log(data);
            $("#tip1").html("图片链接已写入剪贴板，直接粘贴即可");
            var status = data['code'];
            if(status == 'success'){
                var image_url = data['data']['url'];
            }
            if(status == 'image_repeated'){ // 重复上传
                var image_url = data['message'].slice(51);
            }
            GM_setClipboard(image_url);
            $("#image_show").css("display","block");
            $("#image_show").html('<img style="display:block; margin:0 auto; max-width:60%; max-height:200px; box-shadow:0 0 5px #444444;" src="' + image_url + '" alt="V2EX image thumb">');
        },
        error: function(XMLResponse) {
            alert("error:" + XMLResponse.responseText)
        }
    });
});

window.online_image_success = function (){ // 由于存在防盗链，因此远程图片可能显示不了。外部要是调用函数，需要挂靠到window上。
    $("#tip2").css("display","block");
    $("#tip2").html("图片链接已写入剪贴板，直接粘贴即可。");
    $("#image_show").css("display","block");
}
window.online_image_fail = function (){ // 防盗链，远程图片显示异常。
    $("#tip2").html("由于该网站的图片存在防盗链设置，不可直接嵌入本文，可以下载原图到本地，再上传嵌入。");
    $("#image_show").css("display","none");
}