// ==UserScript==
// @name        tieba_emotion_helper
// @namespace   firefox
// @include     http://tieba.baidu.com/*
// @description  贴吧自定义表情批量修改
// @version     1
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/355/tieba_emotion_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/355/tieba_emotion_helper.meta.js
// ==/UserScript==
var _window = typeof unsafeWindow == 'undefined' ? window: unsafeWindow;
var $ = _window.$;
var DEFAULT_EMOTION = '[{"title":"hhh",'+
						'"url":"http://imgsrc.baidu.com/forum/pic/item/9345d688d43f8794045152ddd31b0ef41ad53a92.jpg",'+
						'"thumbnail":"http://imgsrc.baidu.com/forum/abpic/item/9345d688d43f8794045152ddd31b0ef41ad53a92.jpg"},'+
						'{"title":"hhh",'+
						'"url":"http://imgsrc.baidu.com/forum/pic/item/9345d688d43f8794045152ddd31b0ef41ad53a92.jpg",'+
						'"thumbnail":"http://imgsrc.baidu.com/forum/abpic/item/9345d688d43f8794045152ddd31b0ef41ad53a92.jpg"}]';

function loadText(){
	var emotion = localStorage.customEmotion;
	if(emotion==undefined || emotion==null || emotion=="null"){
		return DEFAULT_EMOTION;
	}
	if(emotion.indexOf("|")!=-1)emotion = emotion.substring(emotion.indexOf("|") + 1,emotion.length);
	return emotion;
}
function save(){
	var data = $("#add_emotion_text").attr("value");
	if(data!=""){
		try{
			JSON.parse(data);
		}catch(e){
			alert("填写格式错误");return;
		}
		var d = new Date();
		d.setFullYear(d.getFullYear()+1);
		localStorage.customEmotion = d.getTime() +"|"+ data;
	}else{
		localStorage.customEmotion = undefined;
	}
	$('.s_tab_btn[data-type="custom"]').click();
	close();
}
function close(){
	$(".dialogJshadow").remove();
}
function a(){
	if($(".j_add_emotion").length){
		$(".j_add_emotion").removeClass("j_add_emotion").addClass("custom_add_emotion").html("修改");
		$(".custom_add_emotion").click(function(){
			var dialog = '<div class="dialogJ dialogJfix dialogJshadow ui-draggable" style="z-index: 50003; width: 680px; left: 372.5px; top: 122.5px;">\
				<div class="uiDialogWrapper">\
					<div class="dialogJtitle" style="-moz-user-select: none;-webkit-user-select:none;cursor: default;">\
						<span class="dialogJtxt">批量插入自定义表情</span>\
						<a title="关闭本窗口" class="dialogJclose" href="javascript:void(0)">&nbsp;</a>\
					</div>\
					<div class="dialogJcontent">\
						<div id="dialogJbody" class="dialogJbody" style="height: 460px;">\
							<div>\
								<div class="l_netpic_container">\
								<p>属性介绍：</p>\
								<span style="margin-left: 40px;color:red">title : 表情描述</span>\
								<span style="margin-left: 40px;color:red">url : 表情地址</span>\
								<span style="margin-left: 40px;color:red">thumbnail : 表情缩略图地址</span>\
								<textarea rows="20" id="add_emotion_text" style="width: 656px;resize:none"></textarea>\
								<br />\
								</div>\
								<div style="width: 678px;" class="i_layer_bottom">\
									<div class="i_layer_btn"><a href="javascript:void(0)" style="float:left;margin-right:10px;" class="ui_btn ui_btn_m">\
									<span><em>确 定</em></span></a><a href="javascript:void(0)" style="float:left" class="ui_btn ui_btn_sub_m"><span><em>取 消</em></span></a></div>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			</div>';
			
			$("body").append(dialog);
			$(".dialogJclose").click(close);
			$("#add_emotion_text").html(loadText()).attr("value",loadText());
			$(".i_layer_bottom .i_layer_btn").click(save);
			$(".i_layer_bottom .ui_btn_sub_m").click(close);
		})
	}else{
		setTimeout(a,100);
	}
}


(function _init(){
	if($('.edui-btn.edui-btn-emotion').length){
		$('.edui-btn.edui-btn-emotion').click(a);
	}
	else{
		setTimeout(_init,100);
	}
})();

