// ==UserScript==
// @name        6V活动评分器
// @namespace   xingxing_activity
// @author      xingxing
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @description 6V剧版活动评分器
// @version     20180501
// @include     http://bt.neu6.edu.cn*
// @require     https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @icon        http://bt.neu6.edu.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/36629/6V%E6%B4%BB%E5%8A%A8%E8%AF%84%E5%88%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/36629/6V%E6%B4%BB%E5%8A%A8%E8%AF%84%E5%88%86%E5%99%A8.meta.js
// ==/UserScript==

// https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// http://bt.neu6.edu.cn/static/js/mobile/jquery-1.8.3.min.js


// ~~~~~~~~~~~~~~~~~~~~~~~~配置选项~~~~~~~~~~~~~~~~~~~~~~~~
// 说明： 评分浮云=activity_allclouds - 错误题数*activity_eachclouds
var CorrentConfig = false;
var activity_id = 0; //活动帖子ID
var activity_answer = {}; // 活动答案
var activity_quesnum = 0;
var activity_allclouds = 0; //答题总浮云
var activity_eachclouds = 0; //每题奖励浮云

var clouds = 10; //浮云
var contribution = 0; //贡献
var activity_reason = ""; //评分原因
var correctIndex = "[";
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var secondTimeout = 250;

var jq = jQuery.noConflict();
(function() {

	jq('#mn_N04e2_menu').append('<li><a id="hdsettings" hidefocus="true" style="color: purple;cursor:pointer">\u6d3b\u52a8\u8bbe\u7f6e</a></li>');

	jq('#hdsettings').click(function() {
		var ques_num = GM_getValue('ques_num') ? GM_getValue('ques_num') : 9;
		var hdhtml = '<h3 class="flb"><em id="return_reply">\u6d3b\u52a8\u8bbe\u7f6e</em><span><a href="javascript:;" class="flbc" onclick="hideWindow(\'hdst\')" title="\u5173\u95ed">\u5173\u95ed</a></span></h3><div id="hdsettingdialog" style="width:580px;height:410px;">' +
			'<div class="c" style="height:357px;">' +
			'<div class="pbt cl"><span><span>\u5e16\u5b50\u0049\u0044: </span><input type="text" style="width:100px;" id="hd_id" class="px">&nbsp;&nbsp;&nbsp;<span>\u5956\u52b1\u603b\u6d6e\u4e91: </span><input type="text" style="width:100px;" id="hd_allclouds" class="px">&nbsp;&nbsp;&nbsp;<span>\u6bcf\u9898\u5956\u52b1\u6d6e\u4e91: </span><input type="text" style="width:100px;" id="hd_eachclouds" class="px"></span></div>' +
			'<div class="pbt cl"><span><span>\u8bc4\u5206\u539f\u56e0: </span><input type="text" style="width:480px;" id="hd_reason" class="px"></span></div>' +
			'<div id="hd_questions" style="overflow-y:scroll;width:550px; height:290px;">';
		for (var i = 1; i <= ques_num; i++)
			hdhtml += '<div class="pbt cl"><span>\u9898\u53f7<b>' + i + '</b>: </span><input type="text" style="width:460px;" id="answer' + i + '" placeholder="多个答案用#隔开" class="px"></div>';
		hdhtml += '</div></div><div class="o"><button id="sub_ques">\u51cf1\u9898</button>&nbsp;<button id="add_ques">\u52a01\u9898</button>&nbsp;|&nbsp;<button id="clear_dialog">\u6e05\u7a7a</button>&nbsp;<button id="save_open">\u4fdd\u5b58&\u6253\u5f00</button>&nbsp;<button id="submitset">\u4fdd\u5b58\u8bbe\u7f6e</button>&nbsp;<button id="submitdelete">\u6e05\u7a7a\u8bbe\u7f6e</button></div></div><style>#hd_questions span{display:inline-block;width: 55px}</style>';
		showWindow('hdst', hdhtml, 'html');
		jq('#hd_id').val(GM_getValue('hd_id'));
		jq('#hd_allclouds').val(GM_getValue('hd_allclouds'));
		jq('#hd_eachclouds').val(GM_getValue('hd_eachclouds'));
		jq('#hd_reason').val(GM_getValue('hd_reason'));
		var hd_answer1 = GM_getValue('hd_answer');
		for (i = 1; i <= ques_num; i++)
			jq('#answer' + i).val(hd_answer1[i].join(' # '));
		jq('#hdsettingdialog input').each(function() {
			jq(this).dblclick(function() {
				jq(this).val('');
			});
		});
		jq('#sub_ques').click(function() {
			if (ques_num > 0) {
				ques_num--;
				jq('#hd_questions>div:last').remove();
			}
		});
		jq('#add_ques').click(function() {
			ques_num++;
			if (ques_num == 1)
				jq('#hd_questions').html('<div class="pbt cl"><span>\u9898\u53f7<b>' + ques_num + '</b>: </span><input type="text" style="width:460px;" id="answer' + ques_num + '" placeholder="多个答案用#隔开" class="px"></div>');
			else
				jq('#hd_questions>div:last').after('<div class="pbt cl"><span>\u9898\u53f7<b>' + ques_num + '</b>: </span><input type="text" style="width:460px;" id="answer' + ques_num + '" placeholder="多个答案用#隔开" class="px"></div>');
		});
		jq('#submitset').click(function() {
			GM_setValue('hd_id', jq('#hd_id').val().trim());
			GM_setValue('hd_allclouds', jq('#hd_allclouds').val().trim());
			GM_setValue('hd_eachclouds', jq('#hd_eachclouds').val().trim());
			GM_setValue('hd_reason', jq('#hd_reason').val().trim());
			var hd_answer = {};
			for (var i = 1; i <= ques_num; i++)
				hd_answer[i] = jq('#answer' + i).val().trim().split(/\s*#\s*/);
			GM_setValue('hd_answer', hd_answer);
			GM_setValue('ques_num', ques_num);
			hideWindow('hdst');
		});
		jq('#save_open').click(function() {
			var link = "http://bt.neu6.edu.cn/thread-" + jq('#hd_id').val().trim() + "-1-1.html";
			jq('#submitset').click();
			window.open(link);
		});
		jq('#clear_dialog').click(function() {
			jq('#hdsettingdialog input').each(function() {
				jq(this).val('');
			});
		});
		jq('#submitdelete').click(function() {
			GM_deleteValue('hd_id');
			GM_deleteValue('hd_allclouds');
			GM_deleteValue('hd_eachclouds');
			GM_deleteValue('hd_reason');
			GM_deleteValue('hd_answer');
			GM_deleteValue('ques_num');
			hideWindow('hdst');
		});
	});

	function activity_getconfig() {
		activity_id = GM_getValue('hd_id');
		activity_allclouds = GM_getValue('hd_allclouds');
		activity_eachclouds = GM_getValue('hd_eachclouds');
		activity_reason = GM_getValue('hd_reason');
		activity_answer = GM_getValue('hd_answer');
		activity_quesnum = GM_getValue('ques_num');
		if (activity_id > 0 && activity_allclouds > 0 && activity_eachclouds > 0 && activity_reason && activity_answer && activity_quesnum)
			CorrentConfig = true;
	}

	function activity_showconfig() {
		var schtml = '<h3 class="flb"><em id="return_reply">\u6d3b\u52a8\u914d\u7f6e</em><span><a href="javascript:;" class="flbc" onclick="hideWindow(\'hdsc\')" title="\u5173\u95ed">\u5173\u95ed</a></span></h3><div id="hdsettingdialog" style="width:540px;height:250px;">' +
			'<div class="c" style="height:240px;">' +
			'<div class="pbt cl"><span><span>\u5e16\u5b50\u0049\u0044: </span>' + activity_id + '&nbsp;&nbsp;&nbsp;<span>\u5956\u52b1\u603b\u6d6e\u4e91: </span>' + activity_allclouds + '&nbsp;&nbsp;&nbsp;<span>\u6bcf\u9898\u5956\u52b1\u6d6e\u4e91: </span>' + activity_eachclouds + '&nbsp;&nbsp;&nbsp;<span>\u9898\u76ee\u6570\u91cf: </span>' + activity_quesnum + '</span><br><span>\u8bc4\u5206\u539f\u56e0: </span>' + activity_reason + '</div>' +
			'<div id="hd_questions" style="overflow:auto;width:520px; height:200px;">';
		for (var i = 1; i <= activity_quesnum; i++)
			schtml += '<span>\u9898\u53f7<b>' + i + '</b>: </span><label>' + activity_answer[i].join(' | ') + '</label><br>';
		schtml += '</div></div></div><style>#hd_questions span{display:inline-block;width: 55px}</style>';
		showWindow('hdsc', schtml, 'html');
	}

	// 帖子
	function activity_rate() {
		if (location.href.match(/thread-|tid=/)) {
			var id_match = location.href.match(/(thread-|tid=)(\d+)/);
			var id = id_match ? id_match[2] : 0;
			if (activity_id == id) {
				jq('span#thread_subject').after('<span id="hd_showconfig" style="color:green">[\u6d3b\u52a8\u8bc4\u5206\u5668\u751f\u6548\u5e16]</span>');
				jq('#hd_showconfig').click(function() {
					activity_showconfig();
				});
				jq('div#postlist table.plhin').each(function() {
					var content = jq(this).find('div.t_fsz').text();
					if (jq(this).find('div.pob.cl>p>a:eq(1)').html() == '\u8bc4\u5206') {
						jq(this).find('div.pob.cl>p>a:eq(1)').click(function() {
							jq(this).find('div.pob.cl>p>a:eq(1)').click();
							get_score(content, set_rate);
						});
					}
				});
			}
		}
	}


	function get_score(content, callback) {
		var answer_arr = content.match(/第\d+题[^(第\d+题)]*/g);
		var all_num = Object.keys(activity_answer).length;
		var correct_num = 0;
		correctIndex = "[";
		if (answer_arr && answer_arr.length <= all_num) {
			for (var i = 0; i < answer_arr.length; i++) {
				var match = answer_arr[i].match(/第(\d+)题([\s\S]*)/);
				if (!match)
					continue;
				var index = match[1];
				var user_answer = match[2].toUpperCase().replace(/(\s+)|(\.*)/g, '');
				if ((user_answer.length < 1) || (!activity_answer[index]))
					continue;
				for (var j = 0; j < activity_answer[index].length; j++) {
					var answer = activity_answer[index][j].toUpperCase().replace(/(\s+)|(\.*)/g, '');
					if (user_answer.indexOf(answer) >= 0) {
						correct_num++;
						correctIndex = correctIndex + index + ",";
						break;
					}
				}
			}
			if (correctIndex.length > 1)
				correctIndex = correctIndex.substring(0, correctIndex.length - 1) + "]";
			else
				correctIndex = "[参与奖]";
		} else {
			var user_answer1 = content.toUpperCase().replace(/(\s+)|(\.*)/g, '');
			for (var key in activity_answer) {
				for (var k = 0; k < activity_answer[key].length; k++) {
					var answer1 = activity_answer[key][k].toUpperCase().replace(/(\s+)|(\.*)/g, '');
					if (user_answer1.indexOf(answer1) >= 0) {
						user_answer1.replace(answer1, '');
						correct_num++;
						break;
					}
				}
			}
			correctIndex = "[注意答题格式]";
		}

		clouds = activity_allclouds - (all_num - correct_num) * activity_eachclouds;
		callback();
	}

	function set_rate() {
		setTimeout(function() {
			jq("input#score2").val(clouds);
			jq("input#score5").val(contribution);
			jq("input#reason").val(activity_reason + correctIndex);
		}, secondTimeout);
	}

	jq(document).ready(function() {
		activity_getconfig();
		if (CorrentConfig)
			activity_rate();
	});

})();