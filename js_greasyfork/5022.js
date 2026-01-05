// ==UserScript==
// @name        Tieba_Recent_Emoi
// @namespace   Tieba_Recent_Emoi
// @description 贴吧最近使用表情
// @include     http://tieba.baidu.com/*
// @version     1.1.1
// @require http://static.hdslb.com/js/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant		GM_deleteValue
// @grant       unsafeWindow
// @author     绯色
// @downloadURL https://update.greasyfork.org/scripts/5022/Tieba_Recent_Emoi.user.js
// @updateURL https://update.greasyfork.org/scripts/5022/Tieba_Recent_Emoi.meta.js
// ==/UserScript==
/**
2014.09.12[v1.1] 脚本失效半年因无人使用，博主也搬砖忙没时间使用，所以一直没去修复，知道贴吧吧友反馈希望修复，在此就修复下，修复如下
					1:更换脚本名称，使用个好听的名字吧
					2:重建最近表情面板，使用原贴吧表情面板[作娇小处理]
					3:函数重写，参考了大花猫的脚本[喵~ ＞▽＜]
					4:博主在火狐34nightly+GM2.2下运行完全正常
					5:ajax提交也即时更新表情的新旧增减
2013.10.28 增加了楼中楼最近表情功能，可关闭，(小贴士:楼中楼无法使用自定义表情，只能使用static.tieba.baidu.com域名内的表情，也就是度娘自带表情)
PS:因为楼中楼表情是附加上去的，未对同一类函数做重用处理，有空改改将函数重用，减少代码量(￣︶￣)↗
关于面板位置需要调节的说明：本人代码水平有限，需要各位自己动手改成自己合适的位置
注意:楼中楼最近表情和主贴回复最近表情是分开保存设置的
*/
//---------------------小白式控制面板，注意请在英文输入法下编辑----------------------------------------------
lzldivright=451;//楼中楼最近表情面板绝对水平位置,如果你没用样式优化贴吧，那么该值在451，使用样式后可能导致楼中楼最近表情面板水平位置不对劲，这里可调，数值越大越靠左，可负值，自行调节
Maxwidth = 501;//扑捉最大像素宽度为Maxwidth以内且高度为Maxheight以内的图片[主贴回复框]
Maxheight = 501; //扑捉最大像素宽度为Maxwidth以内且高度为Maxheight以内的图片[主贴回复框]
//-------------------小白式控制面板到此结束，以下内容请勿编辑-----------------------------------------------
window.GM_config = GM_getValue('config'); //GM_getValue在addNodeInsertedListener（参考大花猫的脚本，这个元素监听真心不错，比window.onload好多了）下无效，感谢@网络孤独行客修复	
window.GM_LZLconfig = GM_getValue('LZLconfig'); //楼中楼配置

/**
 * 扩展基础类
 * 数组包含元素
 **/
Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--)
		if (this[i] === obj)
			return true;
	return false;
}

//控制区域
addNodeInsertedListener('.edui-btn-toolbar,.lzl_insertsmiley_holder', function() {
	//判断是不是楼中楼
	if (this.className.indexOf("lzl_insertsmiley_holder") != -1) {
		//读取配置
		if (GM_LZLconfig) {
			getConfig('lzl');
		} else {
			data_init('lzl'); //初始化数据楼中楼
		}
		lzlRencentImage();
	} else {
		//读取配置
		if (GM_config) {
			getConfig('main');
		} else {
			data_init('main'); //初始化数据
		}
		mainRencentImage();
	}
});

//主贴回复最近表情

function mainRencentImage() {
	display_main_emot_div(); //显示面板初始化
	//捕获新表情
	//使用jquery的click事件会使GM_的API无效
	var c = document.getElementsByClassName("poster_submit");
	for (var i = 0, l = c.length; i < l; i++) {
		c[i].addEventListener("click", function() {
			recentImgSave('main');
		}, false);
	}
	window.addEventListener("keydown", function(event) {
		if (event.ctrlKey && event.keyCode == 13) {
			recentImgSave('main');
		}
	}, true);
}

//楼中楼回复最近表情

function lzlRencentImage() {
	display_lzl_emot_div(); //显示面板初始化
	//捕获新表情
	//使用jquery的click事件会使GM_的API无效
	var c = document.getElementsByClassName("lzl_panel_submit");
	for (var i = 0, l = c.length; i < l; i++) {
		c[i].addEventListener("click", function() {
			recentImgSave('lzl');
		}, true);
	}
}

//显示面板初始化

function display_main_emot_div() {
	var div = '<div class="edui-dialog-container recentImgDiv" style="display: none;">\
<div style="display: block; z-index: 1; top: 35px; left: 173px; position: absolute;" class="edui-dropdown-menu edui-popup">\
<div class="edui-popup-body">\
<div class="j_emotion_container emotion_container" style="width:290px;height:285px">\
<div class="s_layer_content j_content ueditor_emotion_content">\
<div class="tbui_scroll_panel tbui_no_scroll_bar">\
<div style="height: 277px;" class="tbui_panel_content j_panel_content clearfix">\
<table id="emoi_tab" class="s_layer_table" style="border-collapse:collapse;" align="center" border="1" bordercolor="#e3e3e3" cellpadding="1" cellspacing="1">\
</table></div></div></div></div></div>\
<div style="top: -8px; left: 139px; position: absolute;" class="edui-popup-caret up"></div></div></div>';
	$('.edui-btn-toolbar').append(div); //插入可视化界面
	$('div.edui-btn-emotion').click(function() {
		$('.recentImgDiv').hide()
	}); //点击表情按钮后隐藏
	$('div.edui-btn-emotion').mouseover(function() {
		insert_main_emoi_td(); //给表格插入表情,ajax也能重新载入
		$('.recentImgDiv').show(); //划过显示
	}); //划过显示
	$('div.edui-btn-emotion').mouseout(function() {
		$('.recentImgDiv').hide()
	}); //移开隐藏
	$('.recentImgDiv').mouseover(function() {
		$('.recentImgDiv').show()
	}); //划过显示
	$('.recentImgDiv').mouseout(function() {
		$('.recentImgDiv').hide()
	}); //移开隐藏			
}

//楼中楼最近表情面板

function display_lzl_emot_div() {
	var div = '<div class="edui-dialog-container lzlRecentImgDiv" style="display: none;">\
<div style="display: block; z-index: 1;right:'+lzldivright+'px; margin-top: 34px;position: absolute;" class="edui-dropdown-menu edui-popup">\
<div class="edui-popup-body">\
<div class="j_emotion_container emotion_container" style="width:290px;height:285px">\
<div class="s_layer_content j_content ueditor_emotion_content">\
<div class="tbui_scroll_panel tbui_no_scroll_bar">\
<div style="height: 277px;" class="tbui_panel_content j_panel_content clearfix">\
<table id="lzl_emoi_tab" class="s_layer_table" style="border-collapse:collapse;" align="center" border="1" bordercolor="#e3e3e3" cellpadding="1" cellspacing="1">\
</table></div></div></div></div></div>\
<div style="top: -8px; left: 139px; position: absolute;" class="edui-popup-caret up"></div></div></div>';
	$('.lzl_editor_container .edui-container').after(div); //插入可视化界面
	$('.lzl_panel_btn').click(function() {
		$('.lzlRecentImgDiv').hide()
	}); //点击表情按钮后隐藏
	$('.lzl_panel_btn').mouseover(function() {
		insert_lzl_emoi_td(); //给表格插入表情,ajax也能重新载入
		$('.lzlRecentImgDiv').show(); //划过显示
	}); //划过显示
	$('.lzl_panel_btn').mouseout(function() {
		$('.lzlRecentImgDiv').hide()
	}); //移开隐藏
	$('.lzlRecentImgDiv').mouseover(function() {
		$('.lzlRecentImgDiv').show()
	}); //划过显示
	$('.lzlRecentImgDiv').mouseout(function() {
		$('.lzlRecentImgDiv').hide()
	}); //移开隐藏			
}

//给主题贴表格插入表情

function insert_main_emoi_td() {
	var recentImgData = getConfig('main'); //读取配置，ajax也能重新载入
	$('#emoi_tab').html(''); //清空表格
	var html = '';
	for (var i = 0; i < recentImgData.length; i++) {
		if (i % 5 == 0) html += '<tr>';
		html += '<td class="s_face j_emotion recentImg" border="1" style="border-collapse:collapse;" data-value="0" data-sname="face" data-type="normal" data-class="s_face" data-stype="img"  data-surl="' + recentImgData[i] + '" data-posflag="0" align="center" bgcolor="#FFFFFF" height="54" width="54"><a class="img" href="javascript:void(0)" style="width:54px;height:54px;display:block;color:#000;font-size:14px;text-decoration:none;background-size:contain;background-image:url(\'' + recentImgData[i] + '\')">&nbsp;</a></td>';
		if (i % 5 == 4) html += '</tr>';
	}
	$('#emoi_tab').prepend(html);
	$('.recentImg').click(function() {
		unsafeWindow.test_editor.execCommand('inserthtml', '<img class="BDE_Smiley" onload="EditorUI.resizeImage(this, 560)" src="' + $(this).attr('data-surl') + '">');
		$('.recentImgDiv').hide();
	});
}

//给楼中楼表格插入表情

function insert_lzl_emoi_td() {
	var recentImgData = getConfig('lzl'); //读取配置，ajax也能重新载入
	$('#lzl_emoi_tab').html(''); //清空表格
	var html = '';
	for (var i = 0; i < recentImgData.length; i++) {
		if (i % 5 == 0) html += '<tr>';
		html += '<td class="s_face j_emotion lzlrecentImg" border="1" style="border-collapse:collapse;" data-value="0" data-sname="face" data-type="normal" data-class="s_face" data-stype="img"  data-surl="' + recentImgData[i] + '" data-posflag="0" align="center" bgcolor="#FFFFFF" height="54" width="54"><a class="img" href="javascript:void(0)" style="width:54px;height:54px;display:block;color:#000;font-size:14px;text-decoration:none;background-size:contain;background-image:url(\'' + recentImgData[i] + '\')">&nbsp;</a></td>';
		if (i % 5 == 4) html += '</tr>';
	}
	$('#lzl_emoi_tab').prepend(html);
	$('.lzlrecentImg').click(function() {
		var src = $(this).attr('data-surl');
		var pre = /(http:\/\/static\.tieba\.baidu\.com)|(bdstatic\.com)/;
		if (pre.test(src)) {
			unsafeWindow.LzlEditor._s_p._se.execCommand("inserthtml", '<img class="BDE_Smiley" unselectable="on" onload="EditorUI.resizeImage(this, 560)" pic_type="1" _moz_resizing="true" src="' + src + '" />');
			$('.lzlRecentImgDiv').hide();
		} else {
			alert('非static.tieba.baidu.com或者bdstati.com[百度自带表情]无法插入，即使插入也无法发表！！！');
		}
	});
}


//记录表情

function recentImgSave(type) {
	if (type == 'lzl') {
		var temp = new Array();
		$('#j_editor_for_container').find('img').each(function() {
			var src = this.src;
			var pre = /(http:\/\/static\.tieba\.baidu\.com)|(bdstatic\.com)/;
			if ((!temp.contains(src)) && (pre.test(src))) {
				temp.push(src);
			}
		});

	} else {
		var temp = new Array();
		$('#ueditor_replace').find('img').each(function() {
			if (this.width < Maxwidth && this.height < Maxheight) {
				var src = this.src;
				if (!temp.contains(src)) {
					temp.push(src);
				}
			}
		});
	}

	var recentImgData = getConfig(type);
	for (var i = 0; i < recentImgData.length; i++) {
		var src = recentImgData[i];
		if (!temp.contains(src)) {
			temp.push(src);
		}
	}
	var end = temp.length < 25 ? temp.length : 25;
	recentImg = temp.slice(0, end);
	setConfig(type, recentImg);

}

//初始化数据

function data_init(type) {
	var recentImgData = new Array();
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0007.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0006.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0005.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0004.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0003.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0002.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0001.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/face/i_f27.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/face/i_f29.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon33.png');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon6.png');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/jd/j_0019.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/jd/j_0020.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/jd/j_0024.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/face/i_f54.png');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/face/i_f53.png');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/face/i_f52.png');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/face/i_f55.png');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/face/i_f51.png');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/bobo/B_0039.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/bobo/B_0052.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/bobo/B_0012.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/qpx_n/b54.gif');
	recentImgData.push('http://static.tieba.baidu.com/tb/editor/images/qpx_n/b13.gif');
	recentImgData.push('http://tb2.bdstatic.com/tb/editor/images/face/i_f70.gif?t=20140803');
	if (type == 'lzl') {
		GM_setValue("LZLconfig", JSON.stringify(recentImgData));
	} else {
		GM_setValue("config", JSON.stringify(recentImgData));
	}
}

//写入配置

function setConfig(type, value) {
	if (type == 'lzl') {
		GM_setValue("LZLconfig", JSON.stringify(value));
	} else {
		GM_setValue("config", JSON.stringify(value));
	}
}

//读取配置

function getConfig(type) {
	if (type == 'lzl') {
		recentImgData = JSON.parse(GM_getValue('LZLconfig'));
	} else {
		recentImgData = JSON.parse(GM_getValue('config'));
	}
	return recentImgData;
}

//函数 元素精确定位

function addNodeInsertedListener(elCssPath, handler, executeOnce, noStyle) {
	var animName = "anilanim",
		prefixList = ["-o-", "-ms-", "-khtml-", "-moz-", "-webkit-", ""],
		eventTypeList = ["animationstart", "webkitAnimationStart", "MSAnimationStart", "oAnimationStart"],
		forEach = function(array, func) {
			for (var i = 0, l = array.length; i < l; i++) {
				func(array[i]);
			}
		};
	if (!noStyle) {
		var css = elCssPath + "{",
			css2 = "";
		forEach(prefixList, function(prefix) {
			css += prefix + "animation-duration:.001s;" + prefix + "animation-name:" + animName + ";";
			css2 += "@" + prefix + "keyframes " + animName + "{from{opacity:.9;}to{opacity:1;}}";
		});
		css += "}" + css2;
		GM_addStyle(css);
	}
	if (handler) {
		var bindedFunc = function(e) {
			var els = document.querySelectorAll(elCssPath),
				tar = e.target,
				match = false;
			if (els.length !== 0) {
				forEach(els, function(el) {
					if (tar === el) {
						if (executeOnce) {
							removeNodeInsertedListener(bindedFunc);
						}
						handler.call(tar, e);
						return;
					}
				});
			}
		};
		forEach(eventTypeList, function(eventType) {
			document.addEventListener(eventType, bindedFunc, false);
		});
		return bindedFunc;
	}
}
//函数 元素精确定位取消绑定

function removeNodeInsertedListener(bindedFunc) {
	var eventTypeList = ["animationstart", "webkitAnimationStart", "MSAnimationStart", "oAnimationStart"],
		forEach = function(array, func) {
			for (var i = 0, l = array.length; i < l; i++) {
				func(array[i]);
			}
		};
	forEach(eventTypeList, function(eventType) {
		document.removeEventListener(eventType, bindedFunc, false);
	});
}