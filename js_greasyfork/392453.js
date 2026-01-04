// ==UserScript==
// @name         V2EX发帖快速上传图片
// @description  在V2EX上发布新帖时，可自动上传本地图片到免费图床，自动生成图片嵌入代码并写入系统粘贴板，直接在帖子中粘贴即可快速插入本地图片或在线图片。
// @namespace    https://greasyfork.org/zh-CN/users/393603-tsing
// @version      1.1
// @author       Tsing
// @match        https://www.v2ex.com/new
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://apps.bdimg.com/libs/jqueryui/1.10.4/jquery-ui.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js
// @grant        none
// @note         2019.11.15 V1.0 在V站的创作新主题页面新增一个【插入图片】的按钮，点击即可上传本地图片和嵌入在线图片，后续将考虑加入的功能包括但不限于：文中图片链接自动转图片、替换默认的站内搜索引擎、去除右边栏的推广信息、超链接默认在新标签页打开、修改感谢为红心。
// @downloadURL https://update.greasyfork.org/scripts/392453/V2EX%E5%8F%91%E5%B8%96%E5%BF%AB%E9%80%9F%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/392453/V2EX%E5%8F%91%E5%B8%96%E5%BF%AB%E9%80%9F%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#compose .cell:eq(3)").append('<div style="float:right;"><span style="display:inline-block;height:26px;line-height:26px;padding:0 8px;background-image:url(/static/img/bg_blended_light.png);border:1px solid rgba(80,80,90,.2);border-radius:3px;outline:none;color:#333333;text-shadow:0 1px 0 #ffffff;font-weight:700;cursor:pointer;" onclick="javascript:$(\'#popup\').fadeIn();"><li class="fa fa-picture-o" style="line-height:10px;"></li> &nbsp;插入图片</span></div>');
    var popupdiv = '\
        <div id="popup" style="width:400px; height: auto; padding-bottom: 10px; border-radius: 10px; background-color: #ffffff; box-shadow: 0 0 5px #444444; display: none; position: absolute; left: 50%; margin-left: -200px; top: 250px; z-index:1000;">\
			<div style="font-size:22px; font-weight: 600; padding: 10px 0; border-bottom: 1px solid #cccccc; border-radius: 10px 10px 0 0; background: #e2e2e2; text-align: center; cursor: move;">V2EX Image Uploader</div>\
			<span id="close" style="display: block; position: absolute; right: 10px; top: 10px; font-size: 12px; color: #ffffff; background-color: #444444; padding: 2px 6px; border-radius: 6px; cursor: pointer;" onMouseOver="this.style.color=\'#ff0000\';" onMouseOut="this.style.color=\'#ffffff\';">关闭</span>\
			<div style="margin: 10px 20px;">\
				<div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">嵌入本地图片</div>\
				<input type="file" accept="image/*" id="upfile" name="file" style="background: #ffffff; border: 1px solid #cccccc; width: 290px; height: 24px; outline: none;" >\
				<input type="button" class="btn" style="vertical-align:top; height: 26px; width: 60px; border: 1px solid #cccccc; margin-right: 0px; font-weight: 600; font-size: 14px;" value="嵌入" disabled="disabled"/>\
				<span id="tip1" style="font-size: 13px; color: red; margin-top: 10px; display: none;"></span>\
				<div style="font-size: 18px; font-weight: 600; margin: 20px 0 10px 0;">嵌入网络图片</div>\
				<div style="height: 26px;">\
					<input type="text" id="image_link" style="vertical-align:top; width: 280px; height: 24px; line-height: 26px; border: 1px solid #cccccc; background: #ffffff; outline: none; padding: 0 5px; font-size: 12px;" placeholder="请输入网络图片的链接"/>\
					<input type="button" class="btn" style="vertical-align:top; height: 26px; width: 60px; border: 1px solid #cccccc; margin-right: 0px; font-weight: 600; font-size: 14px;" value="嵌入"/>\
				</div>	\
				<span id="tip2" style="font-size: 13px; color: red; margin-top: 10px; display: none;"></span>\
				<div id="image_show" style="margin-top: 20px; display: none;"></div>\
			</div>\
		</div>\
    ';
    $("body").append(popupdiv);

    new ClipboardJS('.btn'); // 粘贴板js脚本初始化
    $("#popup").draggable(); // 弹出框可以拖拽

    $("#image_link").change(function(e){
        var image_link = $("#image_link").val();
        $(".btn:eq(1)").attr("data-clipboard-text", '<img style="max-width:100%;" src="' + image_link + '" alt="V2EX image uploaded by TsingScript" />');
    });

    $(".btn:eq(1)").click(function(){
        var image_link = $("#image_link").val();
        if(image_link == ""){
            alert("图片地址为空！");
        }else{
            $("#image_show").html('<img style="display:block; margin:0 auto; max-width:60%; max-height:200px; box-shadow:0 0 5px #444444;" src="' + image_link + '" alt="V2EX image thumb" onload="online_image_success();" onerror="online_image_fail();">');
        }
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
                $("#tip1").html("图片上传成功！请点击【嵌入】按钮生成图片嵌入代码。");
                $(".btn").removeAttr("disabled");
                $(".btn:first").click(function(){
                    $("#tip1").html("图片嵌入代码已写入剪贴板，直接到文中粘贴即可。");
                });
                var status = data['code'];
                if(status == 'success'){
                    var image_url = data['data']['url'];
                }
                if(status == 'exception'){ // 重复上传
                    var image_url = data['message'].slice(51);
                }
                $(".btn:first").attr("data-clipboard-text", '<img style="max-width:100%;" src="' + image_url + '" alt="V2EX image uploaded by TsingScript" />');
                $("#image_show").css("display","block");
                $("#image_show").html('<img style="display:block; margin:0 auto; max-width:60%; max-height:200px; box-shadow:0 0 5px #444444;" src="' + image_url + '" alt="V2EX image thumb">');
                // $(".btn:first").click();
            },
            error: function(XMLResponse) {
                alert("error:" + XMLResponse.responseText)
            }
        });
    });

    window.online_image_success = function (){ // 由于存在防盗链，因此远程图片可能显示不了。外部要是调用函数，需要挂靠到window上。
        $("#tip2").css("display","block");
        $("#tip2").html("图片嵌入代码已写入剪贴板，直接到文中粘贴即可。");
        $("#image_show").css("display","block");
    }
    window.online_image_fail = function (){ // 防盗链，远程图片显示异常。
        $("#tip2").html("由于该网站的图片存在防盗链设置，不可直接嵌入本文，可以下载原图到本地，再上传嵌入。");
        $("#image_show").css("display","none");
    }

})();