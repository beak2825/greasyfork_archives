// ==UserScript==
// @name        贴吧提醒界面快速回复表情添加版
// @namespace 
// @include     http://tieba.baidu.com/i/*/replyme
// @version     2.1
// @grant		unsafeWindow
// @require http://static.hdslb.com/js/jquery.min.js
// @description:zh-cn 直接在i贴吧里”回复我的“里边直接快速回复，回复快捷键：ctrl+回车或者alt+s
// @author      小血~表情插入by妖夏小绯
// @description ss
// @downloadURL https://update.greasyfork.org/scripts/13005/%E8%B4%B4%E5%90%A7%E6%8F%90%E9%86%92%E7%95%8C%E9%9D%A2%E5%BF%AB%E9%80%9F%E5%9B%9E%E5%A4%8D%E8%A1%A8%E6%83%85%E6%B7%BB%E5%8A%A0%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/13005/%E8%B4%B4%E5%90%A7%E6%8F%90%E9%86%92%E7%95%8C%E9%9D%A2%E5%BF%AB%E9%80%9F%E5%9B%9E%E5%A4%8D%E8%A1%A8%E6%83%85%E6%B7%BB%E5%8A%A0%E7%89%88.meta.js
// ==/UserScript==
function reply(fid, tid, tbs, kw, pid, ct, $cDiv, oldUrl) {
	var postData = {
		anonymous : 0,
		content : ct,
		fid : fid,
		floor_num : 16,
		ie : 'utf-8',
		kw : kw,
		rich_text : 1,
		lp_sub_type : 0,
		lp_type : 0,
		new_vcode : 1,
		tbs : tbs,
		tid : tid,
		repostid : pid,
		quote_id : pid,
		tag : 11
	}
	//alert(JSON.stringify(postData))
	$.post('http://tieba.baidu.com/f/commit/post/add', postData, function (r) {
		r = JSON.parse(r);
		if (r.err_code == '0') {
			alertEx('回复成功', 2000);
			$cDiv.remove();
		} else if (r.data.vcode.str_reason == '请点击验证码完成发贴') {
			alertEx('回复失败:此次回复内容需要验证码，本脚本赞不支持验证码，需要到帖子页回复，点击关闭跳转至帖子页面', 0)
			$('#msgClose').attr('oldUrl', oldUrl);
		} else {
			alertEx('回复失败:' + JSON.stringify(r), 0)
		}
	});
}
function alertEx(msg, time) {
	$('#msgContent').text(msg);
	$('#msgDiv').show();
	if (time > 0) {
		setTimeout(function () {
			$('#msgDiv').hide();
		}, time)
	}
}
$(document).ready(function () {
	var zz = '<div id=\'msgDiv\' style=\'display:none;width:100%;height:100%;background:rgba(0,0,0,0.5);position: fixed; top: 0; left: 0;z-index:999997\' class="lzl_editor_container j_lzl_e_c lzl_editor_container_s">'
		zz += '<div style=\'height:0px; width:0px;top:50%; left:50%;position:fixed;\'>';
	zz += '<div style=\'background:rgb(242,242,242);border:1px solid #ddd; width:260px;height:100px;padding:20px 30px 20px 30px;position:absolute; margin:-150px;border-radius:6px;box-shadow: 0 0 10px #333;text-align:center\'>';
	zz += '<p id=\'msgContent\' style=\'width:100%;text-align:left;line-height:25px;min-height:60px;\'>'
	zz += '</p><span id=\'msgClose\' style=\'background:rgb(242,242,242);border:1px solid #555;color:#000;cursor:pointer;height:24px;text-align:center;width:51px;line-height:24px;display:block;margin:0 auto;\'>关闭</span></div></div></div>';
	$('body').append(zz);
	$('body').on('click', '#msgClose', function () {
		$('#msgDiv').hide();
		oldUrl = $(this).attr('oldUrl');
		if (typeof(oldUrl) != 'undefined' && oldUrl != '') {
			$(this).removeAttr('oldUrl');
			window.open(oldUrl);
		}
	})
	$('#feed .reply').find('a:last').each(function () {
		$(this).attr('target', '')
		$(this).attr('temp', $(this).attr('href'))
		$(this).attr('href', 'javascript:void(0)')
	})
	$('#feed').on('click', '.reply a[href=\'javascript:void(0)\']', function (e) {
		if ($(this).parent().parent().find('.qkContent').length > 0) {
			return;
		}
		temp = $(this).attr('temp');
		temp = temp.substring(temp.indexOf('pid=') + 4)
			if (temp.indexOf('&') !=  - 1) {
				temp = temp.substring(0, temp.indexOf('&'))
			} else {
				temp = temp.substring(0, temp.indexOf('#'))
			}
			var userName = $(this).parent().parent().parent().find('.replyme_user').text();
		var html = '<div class=\'qkContent\' style=\'text-align:center\'>';
		html += '<textarea style=\'width:90%;\'></textarea>';
		html += '<span class=\'qkSubmit\' pid=\'' + temp + '\' oldUrl=\'' + $(this).attr('temp') + '\' style=\'background:url("http://tb2.bdstatic.com/tb/static-pb/img/pb_css_pic_a630a08.png") no-repeat scroll -344px -7px rgba(0, 0, 0, 0);color:#fff;cursor:pointer;height:24px;text-align:center;width:51px;line-height:24px;float:right;\'>提交</span><span style="position: relative;cursor: pointer;float: right;width: 40px;height: 24px;margin-top: -30px;z-index: 10;" class="lzl_panel_smile j_lzl_p_sm"><div class="lzl_insertsmiley_holder" style=\'z-index: 11;position: relative;width: 33px;height: 22px;cursor: pointer;background: transparent url("http://tb2.bdstatic.com/tb/static-pcommon/img/poster/insertsmiley_icon_711ec2d.png") no-repeat scroll 0% 0%;\'></div></span>'
		html += '</div>';
		$('.lzlRecentImgDiv').remove();
		var div = '<div class="edui-dialog-container lzlRecentImgDiv" style="display: none;background: #E5E5E5 none repeat scroll 0% 0%;padding: 2px;">\
			<div style="display: block; z-index: 1;right:350px; position: absolute;" class="edui-dropdown-menu edui-popup">\
			<div class="edui-popup-body">\
			<div class="j_emotion_container emotion_container" style="width:;height:">\
			<div class="s_layer_content j_content ueditor_emotion_content">\
			<div class="tbui_scroll_panel tbui_no_scroll_bar">\
			<div style="height: ;" class="tbui_panel_content j_panel_content clearfix">\
			<table class="lzl_emoi_tab" style="border-collapse:collapse;" align="center" border="1" bordercolor="#e3e3e3" cellpadding="1" cellspacing="1">\
			</table></div></div></div></div></div>\
			<div style="top: -8px; left: 139px; position: absolute;" class="edui-popup-caret up"></div></div></div>';
		$(this).parent().after(html + div);
		display_lzl_emot_div($(this));
		$(this).parent().next().find('textarea').focus().val('回复 ' + userName.substring(0, userName.length - 1) + ' :');
	});
	$('#feed').on('click', '.qkSubmit', function () {
		tempData = eval('(' + $(this).parent().prev().children(':first').attr('data-param') + ')');
		reply(tempData.fid, tempData.tid, tempData.tbs, tempData.kw, $(this).attr('pid'), $(this).prev().val(), $(this).parent(), $(this).attr('oldUrl'));
	})
	$('#feed').on('keydown', 'textarea', function (e) {
		if ((e.keyCode == 83 && e.altKey) || (e.ctrlKey && e.keyCode == 13)) {
			$(this).next().click();
			e.preventDefault();
			return false;
		}
	})
});

//表情面板
function display_lzl_emot_div(cc_div) {
	$('.lzl_insertsmiley_holder').click(function () {
		insert_lzl_emoi_td(cc_div); //给表格插入表情,ajax也能重新载入
		$('.lzlRecentImgDiv').toggle()
	}); //点击表情按钮后
	$('.lzlRecentImgDiv').click(function () {
		$('.lzlRecentImgDiv').hide()
	}); //划过显示
}

//给表格插入表情
function insert_lzl_emoi_td(cc_div) {
	$('.lzl_emoi_tab').html(''); //清空表格
	var recentImgData = ['http://static.tieba.baidu.com/tb/editor/images/face/i_f18.png', 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon25.png', 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon33.png', 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon19.png', 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon6.png', 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon28.png', 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon27.png', 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon12.png', 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon16.png', 'http://static.tieba.baidu.com/tb/editor/images/bobo/B_0005.gif', 'http://static.tieba.baidu.com/tb/editor/images/bobo/B_0006.gif', 'http://static.tieba.baidu.com/tb/editor/images/bobo/B_0011.gif', 'http://static.tieba.baidu.com/tb/editor/images/bobo/B_0012.gif', 'http://static.tieba.baidu.com/tb/editor/images/bobo/B_0013.gif', 'http://static.tieba.baidu.com/tb/editor/images/face/i_f04.png', 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon24.png', 'http://static.tieba.baidu.com/tb/editor/images/face/i_f30.png', 'http://static.tieba.baidu.com/tb/editor/images/face/i_f09.png', 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon23.png', 'http://static.tieba.baidu.com/tb/editor/images/face/i_f13.png', 'http://static.tieba.baidu.com/tb/editor/images/face/i_f15.png', 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon5.png', 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon22.png', 'http://static.tieba.baidu.com/tb/editor/images/bobo/B_0014.gif', 'http://static.tieba.baidu.com/tb/editor/images/bobo/B_0021.gif', 'http://static.tieba.baidu.com/tb/editor/images/bobo/B_0025.gif', 'http://static.tieba.baidu.com/tb/editor/images/bobo/B_0039.gif', 'http://static.tieba.baidu.com/tb/editor/images/bobo/B_0052.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_011.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_029.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_031.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_035.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_040.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_052.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_020.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0015.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0018.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0017.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0019.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0020.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0023.gif', 'http://static.tieba.baidu.com/tb/editor/images/ldw/w_0025.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_037.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_002.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_012.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_022.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_042.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_069.gif', 'http://static.tieba.baidu.com/tb/editor/images/ali/ali_063.gif', 'http://static.tieba.baidu.com/tb/editor/images/ldw/w_0045.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0024.gif', 'http://static.tieba.baidu.com/tb/editor/images/ldw/w_0029.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0028.gif', 'http://static.tieba.baidu.com/tb/editor/images/ldw/w_0019.gif', 'http://static.tieba.baidu.com/tb/editor/images/ldw/w_0020.gif', 'http://static.tieba.baidu.com/tb/editor/images/ldw/w_0021.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0001.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0002.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0003.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0004.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0005.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0006.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0009.gif', 'http://static.tieba.baidu.com/tb/editor/images/qpx_n/b06.gif', 'http://static.tieba.baidu.com/tb/editor/images/qpx_n/b13.gif', 'http://static.tieba.baidu.com/tb/editor/images/qpx_n/b09.gif', 'http://static.tieba.baidu.com/tb/editor/images/qpx_n/b15.gif', 'http://static.tieba.baidu.com/tb/editor/images/qpx_n/b11.gif', 'http://static.tieba.baidu.com/tb/editor/images/qpx_n/b54.gif', 'http://static.tieba.baidu.com/tb/editor/images/qpx_n/b21.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0012.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0011.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/j_0013.gif', 'http://static.tieba.baidu.com/tb/editor/images/tsj/t_0025.gif', 'http://static.tieba.baidu.com/tb/editor/images/tsj/t_0035.gif', 'http://static.tieba.baidu.com/tb/editor/images/tsj/t_0030.gif', 'http://static.tieba.baidu.com/tb/editor/images/tsj/t_0023.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0001.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0002.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0003.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0004.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0005.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0006.gif', 'http://static.tieba.baidu.com/tb/editor/images/jd/sdxl_0007.gif'];
	var html = '';
	for (var i = 0; i < recentImgData.length; i++) {
		if (i % 14 == 0)
			html += '<tr>';
		html += '<td class="s_face j_emotion lzlrecentImg" border="1" style="border-collapse:collapse;" data-value="0" data-sname="face" data-type="normal" data-class="s_face" data-stype="img"  data-surl="' + recentImgData[i] + '" data-posflag="0" align="center" bgcolor="#FFFFFF" height="50" width="50"><a class="img" href="javascript:void(0)" style="width:50px;height:50px;display:block;color:#000;font-size:14px;text-decoration:none;background-size:contain;background-image:url(\'' + recentImgData[i] + '\');background-repeat:no-repeat">&nbsp;</a></td>';
		if (i % 14 == 13)
			html += '</tr>';
	}
	$('.lzl_emoi_tab').prepend(html);
	$('.lzlrecentImg').click(function () {
		var src = $(this).attr('data-surl');
		var pre = /(http:\/\/static\.tieba\.baidu\.com)|(bdstatic\.com)/;
		if (pre.test(src)) {
			cc_div.parent().next().find('textarea').focus().val(cc_div.parent().next().find('textarea').focus().val() + '[emotion pic_type=1 width=50 height=50]' + src + '[/emotion]');
			$('.lzlRecentImgDiv').hide();
		} else {
			alert('非static.tieba.baidu.com或者bdstati.com[百度自带表情]无法插入，即使插入也无法发表！！！');
		}
	});
}
