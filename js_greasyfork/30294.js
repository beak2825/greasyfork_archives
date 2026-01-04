// ==UserScript==
// @name        6V评分强化器
// @name:en     neu6ratehelper
// @namespace   https://github.com/popcorner/neu6ratehelper
// @description ratehelper
// @description:en ratehelper
// @version     20180524
// @author      popcorner
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @include     http://bt.neu6.edu.cn/forum*
// @include     http://bt.neu6.edu.cn/thread*
// @require     https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @icon        http://bt.neu6.edu.cn/favicon.ico
// @supportURL  http://bt.neu6.edu.cn/thread-1565257-1-1.html
// @downloadURL https://update.greasyfork.org/scripts/30294/6V%E8%AF%84%E5%88%86%E5%BC%BA%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/30294/6V%E8%AF%84%E5%88%86%E5%BC%BA%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

// https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// http://bt.neu6.edu.cn/static/js/mobile/jquery-1.8.3.min.js


// ~~~~~~~~~~~~~~~~~~~~~~~~可配置选项~~~~~~~~~~~~~~~~~~~~~~~~
var ShowMoreSizeInfo = true; //可选true,false
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



var currentuser = "";
var currenturl = "";
var seedtype = 0;
var seedsize = -1;
var clouds = 0;
var contribution = 0;
var ratereason = "";
var autofillin = false;
var addrateuser = ["j552k", "shirley0714", "baishuangxing", "kun2phg"];

var secondTimeout = 400;
var moveToReason = "断种回收，感谢分享";
var highlightReason = "感谢分享";
var stickReason = "感谢分享";
var cat = 0;
var moveto = 0;

var replay_index = 0;
var loadingst;

var jq = jQuery.noConflict();
(function() {

	jq('#mn_N04e2_menu').append('<li><a id="pfsettings" hidefocus="true" style="color: purple;cursor:pointer">\u8bc4\u5206\u8bbe\u7f6e</a></li>');

	jq('#pfsettings').click(function() {
		var pfhtml = '<h3 class="flb"><em id="return_reply">\u8bc4\u5206\u8bbe\u7f6e</em><span><a href="javascript:;" class="flbc" onclick="hideWindow(\'pfst\')" title="\u5173\u95ed">\u5173\u95ed</a></span></h3><div style="width:580px;height:300px;">' +
			'<div class="c" style="height:247px;"><label><input type="checkbox" id="setnewstyle">\u4f7f\u7528\u65b0\u6837\u5f0f</label><label><input type="checkbox" id="setnotify">\u901a\u77e5\u4f5c\u8005\uff08\u8d85\u7248\u4ee5\u4e0a\u53ef\u7528\uff09' +
			'</label><p>\u8bbe\u7f6e\u7406\u7531</p><textarea id="setreason"></textarea><p>\u8bbe\u7f6e\u6d6e\u4e91\u8bc4\u5206</p><textarea id="setoption2"></textarea><p>\u8bbe\u7f6e\u8d21\u732e\u8bc4\u5206</p><textarea id="setoption5"></textarea></div>' +
			'<div class="o"><button id="submitset">\u4fdd\u5b58\u8bbe\u7f6e</button>&nbsp;<button id="submitdelete">\u6e05\u7a7a\u8bbe\u7f6e</button></div></div><style>.c textarea{resize:both}</style>';
		showWindow('pfst', pfhtml, 'html');
		jq('#setnewstyle').prop('checked', GM_getValue('setnewstyle'));
		jq('#setnotify').prop('checked', GM_getValue('setnotify'));
		jq('#setreason').val(tencode(GM_getValue('setreason')));
		jq('#setoption2').val(tencode(GM_getValue('setoption2')));
		jq('#setoption5').val(tencode(GM_getValue('setoption5')));
		jq('#submitset').click(function() {
			GM_setValue('setnewstyle', jq('#setnewstyle').prop('checked'));
			GM_setValue('setnotify', jq('#setnotify').prop('checked'));
			GM_setValue('setreason', tparse(jq('#setreason').val()));
			GM_setValue('setoption2', tparse(jq('#setoption2').val()));
			GM_setValue('setoption5', tparse(jq('#setoption5').val()));
			hideWindow('pfst');
		});
		jq('#submitdelete').click(function() {
			GM_deleteValue('setnewstyle');
			GM_deleteValue('setnotify');
			GM_deleteValue('setreason');
			GM_deleteValue('setoption2');
			GM_deleteValue('setoption5');
			hideWindow('pfst');
		});
	});
	if (location.href.match(/thread-|tid=/)) {
		jq('.pob>p>a').each(function() {
			if (jq(this).html() == '\u8bc4\u5206') {
				jq(this).attr('ratepid', jq(this).attr('onclick').match(/pid=(\d+)/)[1]);
				jq(this).removeAttr('onclick');
				jq(this).click(function() {
					openRate(this);
				});
			}
		});
		jq('#ak_rate').each(function() {
			jq(this).attr('ratepid', jq(this).attr('onclick').match(/pid=(\d+)/)[1]);
			jq(this).removeAttr('onclick');
			jq(this).click(function() {
				openRate(this);
			});
		});
	}

	function openRate(target) {
		var postget = function() {
			var ratehtml = jq('#fwin_temp_rate').html();
			jq('#fwin_temp_r').remove();
			clearTimeout(loadingst);
			showWindow('rate', ratehtml, 'html');
			if (GM_getValue('setoption2')) {
				jq('#scoreoption2').html('<li>' + JSON.parse(GM_getValue('setoption2')).join('</li><li>') + '</li>');
			}
			if (GM_getValue('setoption5')) {
				jq('#scoreoption5').html('<li>' + JSON.parse(GM_getValue('setoption5')).join('</li><li>') + '</li>');
			}
			var reasonselector;
			if (GM_getValue('setreason')) {
				reasonselector = '<li>' + JSON.parse(GM_getValue('setreason')).join('</li><li>') + '</li>';
			} else {
				reasonselector = jq('#reasonselect').html();
			}
			if (GM_getValue('setnewstyle')) {
				var newstylehtml = '<h4 style="width:auto"><a onclick="showselect(this, \'reason\', \'reasonselect\')" class="dpbtn y" href="javascript:;">^</a>\u53ef\u9009\u8bc4\u5206\u7406\u7531:</h4><p class="reason_slct">' +
					'<input type="text" name="reason" id="reason" class="pt" onkeyup="seditor_ctlent(event, \'$(\\\'rateform\\\').ratesubmit.click()\')"></p><ul id="reasonselect" style="display: none">' + reasonselector + '</ul>';
				jq('#rateform>.c>.tpclg').html(newstylehtml);
			} else if (GM_getValue('setreason')) {
				jq('#reasonselect').html(reasonselector);
			}
			if (GM_getValue('setnotify')) {
				jq('#sendreasonpm').prop('checked', true);
			}
			if (autofillin) {
				if ((clouds > 100) || (contribution > 5)) {
					var addcoulds = ((clouds - 100) > 0) ? (clouds - 100) : 0;
					var addcontribution = ((contribution - 5) > 0) ? (contribution - 5) : 0;
					clouds = (clouds > 100) ? 100 : clouds;
					contribution = (contribution > 5) ? 5 : contribution;
					alert("大包\n" + "请@其他人补上浮云：" + addcoulds + "，贡献：" + addcontribution + "\n" + "\n已将上述消息复制到快速回复框中...");
					var msg = "大包，" + currenturl + "\n请补上浮云：" + addcoulds + "，贡献：" + addcontribution + ",";
					for (var name in addrateuser) {
						if (addrateuser[name] != currentuser)
							msg += " @" + addrateuser[name] + " ";
					}
					jq("form#fastpostform textarea#fastpostmessage").text(msg);
				}
				jq("input#score2").val(clouds);
				jq("input#score5").val(contribution);
				jq("input#reason").val(ratereason);
			}
		};
		jq('#append_parent').append('<div id="fwin_temp_r" style="display:none"><div id="fwin_temp_rate"></div></div>');
		ajaxget('forum.php?mod=misc&action=rate&tid=' + tid + '&pid=' + jq(target).attr('ratepid') + '&infloat=yes&handlekey=rate' +
			'&t=' + (+new Date()),
			'fwin_temp_rate', null, '', '',
			function() {
				postget();
			});
		loadingst = setTimeout(function() {
			showDialog('', 'info', '<img src="' + IMGDIR + '/loading.gif"> \u8bf7\u7a0d\u5019...');
		}, 500);
	}

	function tparse(input) {
		if (input.trim()) {
			return JSON.stringify(input.trim().replace(/(\r)/g, '').split('\n'));
		} else {
			return '';
		}
	}

	function tencode(input) {
		return input ? (JSON.parse(input).join('\n')) : '';
	}

	// 版块
	if (location.href.match(/forum-|fid=/) && jq('table#threadlisttableid').length) {
		var cat_m = location.href.match(/(forum-|fid=)(\d+)/);
		cat = cat_m ? cat_m[2] : 0;
		if (cat == 48 || cat == 77)
			moveto = 58;
		else if (cat == 14 || cat == 73)
			moveto = 62;
		else if (cat == 155)
			moveto = 14;
		if (cat == 14 || cat == 73 || cat == 48 || cat == 77 || cat == 155) {
			if (cat != 155)
				jq("ul#thread_types li:last").after('<li><a id="my_select" href="javascript:void(0)">选择<span class="xg1 num">' + cat + '</span></a></li><li><a id="my_move" href="javascript:void(0)">移动<span class="xg1 num">' + moveto + '</span></a></li>');
			jq("tbody#separatorline th").html('<a id="forum_highlight" href="javascript:void(0)">高亮</a>&nbsp;&nbsp;&nbsp;<a id="forum_stick" href="javascript:void(0)">置顶</a>&nbsp;&nbsp;&nbsp;<a id="forum_move" href="javascript:void(0)">移动</a>');
		}
		jq("#my_select").click(function() {
			jq("table#threadlisttableid tbody").each(function() {
				var tbody = jq(this);
				var size = 0;
				if (tbody.find('tr td').length > 3) {
					size = parseFloat(tbody.find('tr td:eq(3)').text());
				}
				if (size > 0 && tbody.attr("id") != "separatorline" && tbody.find('tr td:eq(2) img').attr("src").match(/signal_0\.png/)) {
					tbody.find('tr td:eq(1) input').click();
				}
			});
		});
		jq('#my_move').click(function() {
			tmodthreads(2, 'move');
			setTimeout(function() {
				if (moveto) {
					jq("#moderateform select#moveto").val(moveto);
					jq("#moderateform textarea#reason").text(moveToReason);
				}
			}, secondTimeout);
		});
		jq("a#forum_highlight").click(function() {
			var seedtype = 0;
			var typeid = 0;
			var size = 0;
			var a_highlight = 0;
			var title_info = [0, 0]; //title_info[0]:(置顶天数)	title_info[1]:(1:剧集首集, 2:高清韩剧, 3:高清日剧)
			var final_info = 0;

			jq("table#threadlisttableid tbody").each(function() {
				if (jq(this).find('input:first').prop("checked") && jq(this).attr("id") != "separatorline") {
					size = get_seed_size(jq(this).find('tr td:eq(3)').text());
					a_highlight = (jq(this).find('th a:eq(2)').css('color') == 'rgb(51, 51, 51)') ? 0 : 1;
					var t_match = jq(this).find('th a:eq(1)').attr('href').match(/fid=(\d+).*typeid=(\d+)/);
					if (t_match) {
						seedtype = t_match[1];
						typeid = t_match[2];
					}
					var title_str = jq(this).find('th a:eq(2)').text();
					title_info = get_info_from_title(seedtype, size, title_str);
					final_info = get_highlight_info(seedtype, typeid, size, title_info);
					return false;
				}
			});
			var info_high = [a_highlight, "已经处理过了..."];
			my_highlight_sub(info_high, final_info, 1);
		});
		jq("a#forum_stick").click(function() {
			my_stick(0);
		});
		jq("a#forum_move").click(function() {
			my_move(0, moveto);
		});
	}
	// 帖子
	if (location.href.match(/thread-|tid=/)) {
		var type_m = jq("div#pt div.z a:eq(4)").attr('href').match(/(forum-|fid=)(\d+)/);
		seedtype = type_m ? type_m[2] : (jq("div#pt div.z a:eq(3)").attr('href').match(/(forum-|fid=)(\d+)/)[2]);
		// 文件大小人性化显示
		if (ShowMoreSizeInfo) {
			var utorrentinfo = jq('ignore_js_op>dl.tattl>dd>pre').text();
			utorrentinfo = utorrentinfo.replace(/size\.+:\s(\d+)/ig, function($1) {
				var b_size = parseInt($1.match(/\d+/)[0]);
				var m_size = (b_size / 1024 / 1024).toFixed(2);
				if (m_size >= 1000)
					return $1 + " = " + (m_size / 1024).toFixed(2) + "(G)";
				return $1 + " = " + m_size + "(M)";
			});
			var filecount = 0;
			utorrentinfo = utorrentinfo.replace(/\(\d{3,}\)/ig, function($1) {
				var b_size = parseInt($1.match(/\d+/)[0]);
				var m_size = (b_size / 1024 / 1024).toFixed(2);
				filecount++;
				if (m_size >= 1000)
					return "(" + b_size + " = " + (m_size / 1024).toFixed(2) + "(G))";
				else if ((b_size / 1024) >= 1000)
					return "(" + b_size + " = " + m_size + "(M)";
				else if (b_size >= 1000)
					return "(" + b_size + " = " + (b_size / 1024).toFixed(2) + "(K))";
				return "(" + b_size + " = " + b_size + "(B))";
			});
			utorrentinfo = utorrentinfo.replace(/files\./, "files(总共" + filecount + "个文件).");
			jq('ignore_js_op>dl.tattl>dd>pre').text(utorrentinfo);
		}
		var tv_forum = [155, 48, 77, 14, 73];
		if (tv_forum.indexOf(seedtype)) {
			jq('div#modmenu span:last').before('<span class="pipe">|</span><a id="isrepeat" href="javascript:;">重复</a><span class="pipe">|</span><a id="commonquestions" href="javascript:;">常见问题</a>');
		}
	}

	if (location.href.match(/action=reply&fid=/)) {
		var seed_forum = location.href.match(/action=reply&fid=(\d+)/)[1];
		var tv_forum1 = [155, 48, 77, 14, 73];
		if (tv_forum1.indexOf(seed_forum)) {
			jq('span#subjecthide').after('<span class="pipe">|</span><a id="commonquestions" href="javascript:;">常见问题</a>');
		}
	}

	function numatostring2(num) {
		return (num < 10) ? ("0" + num) : (num.toString());
	}

	function leapyear(year) {
		return ((year % 400 === 0) || ((year % 100 !== 0) && (year % 4 === 0)));
	}

	function my_time(addmonth = 0, addday = 0) {
		var mydate = new Date();
		var add_day = addmonth * 30 + addday;
		var t_year = mydate.getFullYear();
		var t_month = mydate.getMonth() + 1; //0-11
		var t_day = mydate.getDate() + add_day; //1-31
		var t_hour = mydate.getHours(); //0-23
		var t_min = mydate.getMinutes(); //0-59

		var dayofmonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		dayofmonths[1] = (leapyear(t_year)) ? (dayofmonths[1] + 1) : dayofmonths[1];

		while (t_day > dayofmonths[t_month - 1]) {
			t_day -= dayofmonths[t_month - 1];
			t_month += 1;
			if (t_month > 12) {
				t_month -= 12;
				t_year += 1;
				dayofmonths[1] = (leapyear(t_year)) ? (dayofmonths[1] + 1) : dayofmonths[1];
			}
		}
		t_year = t_year.toString();
		t_month = numatostring2(t_month);
		t_day = numatostring2(t_day);
		t_hour = numatostring2(t_hour);
		t_min = numatostring2(t_min);
		return t_year + "-" + t_month + "-" + t_day + " " + t_hour + ":" + t_min;
	}

	function get_already_highlight(a_highlight = 0, reason = "") {
		var res = [0, ""];
		if (jq("div.modact").length && jq("div.modact>a").text().indexOf("高亮") > 0) {
			res[0] = 1;
			res[1] = jq("div.modact>a").text();
		} else {
			res[0] = a_highlight;
			res[1] = reason;
		}
		return res;
	}

	function get_seed_size(size_str = "") {
		var res = -1;
		var seed_size;
		var seed_size_unit;
		if (location.href.match(/thread-|tid=/)) {
			var seed_size_info = jq('div.pcb div.mtw.mbw').text();
			if (seed_size_info) {
				seed_size = seed_size_info.match(/(\d+[.]{0,1}\d*)/)[1];
				seed_size_unit = seed_size_info.match(/([a-zA-Z]+)/)[1];
			}
		} else {
			var u_size = size_str.match(/[MGT]B/);
			seed_size_unit = u_size ? u_size[0] : 0;
			seed_size = parseInt(size_str);
		}
		if ("GB" === seed_size_unit)
			res = parseInt(seed_size);
		else if ("TB" === seed_size_unit)
			res = parseInt(seed_size * 1024);
		else if ("MB" === seed_size_unit)
			res = parseInt(seed_size / 1024);
		return res;

	}

	function get_highlight_info(seedtype, typeid, t_size, title_info = 0) {
		var res = [0, -1, 0, 0]; //(置顶天数, 颜色, 加粗, 高亮时间(-1:永久))
		var t_info = (title_info) ? title_info : get_info_from_title(seedtype, t_size);
		res[0] = t_info[0];
		if (seedtype == 14 || seedtype == 73) {
			if (seedtype == 14)
				res[3] = 1;
			if (seedtype == 73) {
				res[2] = 1;
				if (t_size < 10)
					res[3] = 7;
				else if (t_size < 20)
					res[3] = 30 + (t_size - 10) * 3;
				else if (t_size < 30)
					res[3] = 90;
			}
			if (t_info[1] == 1) { //首集
				res[1] = 2;
				res[2] = 1;
				res[3] = 7;
			} else if (typeid == 101 || typeid == 298)
				res[1] = 3;
			else if (typeid == 102 || typeid == 299)
				res[1] = 7;
			else if (typeid == 103 || typeid == 300)
				res[1] = 8;
			else if (typeid == 104 || typeid == 301)
				res[1] = 5;
			else if (typeid == 105 || typeid == 302)
				res[1] = 6;
		} else if (seedtype == 48 || seedtype == 77) { //高清
			if (seedtype == 48)
				res[3] = 3;
			else {
				res[2] = 1;
				res[3] = -1;
			}
			if (t_info[1] == 1) { //首集
				res[2] = 1;
				res[3] = -1;
			}
			if (seedtype == 77 && t_size >= 100)
				res[1] = 1;
			else if (typeid == 247 || typeid == 178)
				res[1] = 7;
			else if (typeid == 248 || typeid == 179)
				res[1] = 2;
			else if (typeid == 249 || typeid == 180) {
				if (t_info[1] == 2) //韩剧
					res[1] = 6;
				else if (t_info[1] == 3) //日剧
					res[1] = 5;
			} else if (typeid == 250 || typeid == 181)
				res[1] = 4;
		}
		//alert("(置顶天数 " + res[0] + ", 颜色 " + res[1] + ", 加粗 " + res[2] + ", 高亮时间 " + res[3] + ")");
		return res;
	}

	function get_info_from_title(seedtype, size, title = "") {
		var res = [0, 0]; //res[0]:(置顶天数)	res[1]:(1:剧集首集, 2:高清韩剧, 3:高清日剧)
		var title_str = (title) ? title : jq("h1.ts span#thread_subject").text();
		if (seedtype == 48 || seedtype == 77) { //高清
			if (seedtype == 48 && title_str.match(/(S\d+E01)|([EP]*01[\.\s-])/i)) {
				res[0] = 1;
				res[1] = 1;
			}
			if (seedtype == 48 && size >= 10)
				res[0] = 1;
			if ((seedtype == 77) && (size >= 100))
				res[0] = 3;
			if (title_str.match(/韩/))
				res[1] = 2;
			else if (title_str.match(/日/))
				res[1] = 3;
		} else if (seedtype == 14 || seedtype == 73) {
			if (seedtype == 14 && title_str.match(/(\[01)|(EP?01)/i))
				res[1] = 1;
			if (seedtype == 73 && (size >= 50))
				res[0] = 2;
		}
		return res;
	}


	function get_seed_information() {
		var rate_already = false;
		jq("div.pct:first table.ratl tbody.ratl_l tr").each(function() {
			var tr = jq(this);
			var user = tr.find('a:eq(1)').text().trim();
			if ((jq.inArray(user, addrateuser)) >= 0) {
				rate_already = true;
				return false;
			}
		});
		var reasons = ["帖子规范，资源优秀，谢谢您的分享", "更新辛苦，图文并茂，格式规范，奖励"];
		seedsize = get_seed_size();
		// alert(rate_already + "-" + seedtype + "-" + seedsize);
		if ((!rate_already) && (seedtype > 0) && (seedsize >= 0)) {
			clouds = 0;
			contribution = 0;
			var d = new Date();
			var index = d.getSeconds() % 2;
			ratereason = reasons[index];
			var nummatch;
			var num;
			if (seedtype == 77) { //高清剧合集
				if (seedsize >= 400) {
					clouds = 200;
					contribution = 7;
				} else if (seedsize >= 200) {
					clouds = 100 + Math.round((seedsize - 200) / 2);
					contribution = 5 + Math.round((seedsize - 200) / 100);
				} else if (seedsize >= 100) {
					clouds = Math.round(60 + (seedsize - 100) * 40 / 100);
					contribution = 4;
				} else if (seedsize >= 60) {
					clouds = Math.round(10 + seedsize - 60);
					contribution = 3;
				} else if (seedsize >= 30) {
					clouds = 10;
					contribution = 2;
				} else if (seedsize >= 10) {
					clouds = 0;
					contribution = 1;
				}
			} else if (seedtype == 48) { //高清剧集
				contribution = 0;
				nummatch = jq("span#thread_subject").text().match(/EP?(\d+)(-EP?(\d+))?/i);
				if (nummatch) {
					if (nummatch[3]) {
						num = nummatch[3] - nummatch[1] + 1;
						if (num >= 10)
							clouds = 30;
						else if (num >= 5)
							clouds = 20;
						else if (num >= 3)
							clouds = 10;
						else
							clouds = 0;
					} else {
						num = 1;
					}
					if (nummatch[1] == 1)
						clouds = ((clouds + 10) >= 30) ? 30 : (clouds + 10);
					if ((seedsize / num) >= 2)
						clouds = ((clouds + 10) >= 30) ? 30 : (clouds + 10);
				}
			} else if (seedtype == 73) { //完结剧集
				if (seedsize >= 120) {
					clouds = 100;
					contribution = 5;
				} else if (seedsize >= 80) {
					clouds = (60 + seedsize - 80).toFixed(0);
					contribution = 4;
				} else if (seedsize >= 40) {
					clouds = (40 + (seedsize - 40) * 20 / 40).toFixed(0);
					contribution = 3;
				} else if (seedsize >= 20) {
					clouds = (20 + seedsize - 20).toFixed(0);
					contribution = 2;
				} else if (seedsize >= 10) {
					clouds = (10 + seedsize - 10).toFixed(0);
					contribution = 1;
				}
			} else if (seedtype == 14) { //电视剧集
				contribution = 0;
				nummatch = jq("span#thread_subject").text().match(/EP?(\d+)(-EP?(\d+))?\]/i);
				nummatch = nummatch ? nummatch : (jq("span#thread_subject").text().match(/(\d+)(-(\d+))?\]/i));
				if (nummatch) {
					if (nummatch[3]) {
						num = nummatch[3] - nummatch[1] + 1;
						if (num >= 10)
							clouds = 30;
						else if (num >= 5)
							clouds = 20;
						else if (num >= 3)
							clouds = 10;
						else
							clouds = 0;
					} else {
						num = 1;
					}
					if (nummatch[1] == 1)
						clouds = ((clouds + 10) >= 30) ? 30 : (clouds + 10);
					if ((seedsize / num) >= 1)
						clouds = ((clouds + 10) >= 30) ? 30 : (clouds + 10);
				}
			} else if (seedtype == 49) { //高清记录
				contribution = Math.round(seedsize / 20);
				if (seedsize >= 10)
					clouds = Math.round(seedsize / 10) * 10;
				else if (seedsize >= 3)
					clouds = 10;
			} else if (seedtype == 155) { //电视剧集试种区
				clouds = 10;
				contribution = 2;
				ratereason = "补加浮云和贡献奖励，感谢分享";
			} else {
				clouds = 0;
				contribution = 0;
			}
		} else {
			var setrateinfo = {
				"38": [10, 0, "送上鲜花"],
				"87": [10, 0, "送鲜花"],
				"32": [10, 0, "送鲜花"],
				"136": [1, 0, "已发送，请尽快注册"],
				"4": [100, 0, "剧版猜谜活动奖励"]
			};
			if (setrateinfo[seedtype]) {
				clouds = setrateinfo[seedtype][0];
				contribution = setrateinfo[seedtype][1];
				ratereason = setrateinfo[seedtype][2];
			}
		}
		autofillin = ((clouds > 0) || (contribution > 0)) ? true : false;
	}

	function my_highlight_sub(i_highlight, high_info, forum = 0) {
		if (forum)
			tmodthreads(1, 'highlight');
		else
			modthreads(1, 'highlight');
		if (i_highlight[0]) {
			setTimeout(function() {
				jq("#moderateform textarea#reason").text(i_highlight[1]);
			}, secondTimeout);
		} else {
			setTimeout(function() {
				var b_color = ['rgb(0, 0, 0)', 'rgb(238, 27, 46)', 'rgb(238, 80, 35)', 'rgb(153, 102, 0)', 'rgb(60, 157, 64)', 'rgb(40, 151, 197)', 'rgb(43, 101, 183)', 'rgb(143, 42, 144)', 'rgb(236, 18, 130)'];
				// 置顶
				if (high_info[0] > 0 && (!jq("#moderateform li#itemcp_stick").hasClass('copt'))) {
					jq("#moderateform li#itemcp_stick table td:first input").click();
					jq("#moderateform li#itemcp_stick table td:eq(1) select").val(1);
					jq("#moderateform li#itemcp_stick table input#expirationstick").val(my_time(0, high_info[0]));
				}
				// 颜色
				if (high_info[1] >= 0 && high_info[1] <= 8) {
					jq("#moderateform li#itemcp_highlight table input#highlight_color").val(high_info[1]);
					jq("#moderateform li#itemcp_highlight table a#highlight_color_ctrl").css('background-color', b_color[high_info[1]]);
				}
				// 加粗
				if ((high_info[2] == 1) && (!jq("#moderateform li#itemcp_highlight table a#highlight_op_1").hasClass('cnt')))
					jq("#moderateform li#itemcp_highlight table a#highlight_op_1").click();
				// 高亮时间
				if (high_info[3] > 0)
					jq("#moderateform li#itemcp_highlight table input#expirationhighlight").val(my_time(0, high_info[3]));
				// 原因
				jq("#moderateform textarea#reason").text(highlightReason);
			}, secondTimeout);
		}
	}

	function my_highlight() {
		var i_highlight = get_already_highlight();
		var typeid = jq("h1.ts a").attr("href").match(/typeid=(\d+)/)[1];
		var high_info = get_highlight_info(seedtype, typeid, get_seed_size()); //(置顶天数, 颜色, 加粗, 高亮时间(-1:永久))
		my_highlight_sub(i_highlight, high_info);
	}

	function my_stick(forum = 1) {
		if (forum)
			modthreads(1, 'stick');
		else
			tmodthreads(1, 'stick');
		setTimeout(function() {
			// 原因
			jq("#moderateform textarea#reason").text(stickReason);
		}, secondTimeout);
	}

	function my_move(forum = 1, moveto = 0) {
		if (forum)
			modthreads(2, 'move');
		else
			tmodthreads(2, 'move');
		setTimeout(function() {
			if (moveto)
				jq("#moderateform select#moveto").val(moveto);
			jq("#moderateform textarea#reason").text("感谢分享");
		}, secondTimeout);
	}

	function file_info_prase(text) {
		var res = [];
		var file_info = text.replace(/info.*\n/, "").replace(/directory.*\n/, "");
		if (file_info.indexOf("files") >= 0) {
			file_info = file_info.replace(/archive.*/, "").replace(/file.*:{1}\n?/, "");
			var arr1 = file_info.split("\n");
			for (var i = 0; i < arr1.length; i++) {
				var match = arr1[i].match(/(.*)\((\d+)/);
				if (match && match.length >= 3) {
					res.push([match[1].trim(), match[2], 0, 0, false]);
				}
			}
		} else {
			file_info = file_info.replace(/archive.*:{1}/, "").replace(/file.*:{1}\n?/, "");
			var arr2 = file_info.split("\n");
			res.push([arr2[0].trim(), arr2[1].match(/\d+/)[0], false]);
		}
		return res;
	}

	jq('#isrepeat').click(function() {
		var pfhtml = '<h3 class="flb"><em id="return_reply">帖子相似度判断</em><span><a href="javascript:;" class="flbc" onclick="hideWindow(\'irdialog\')" title="\u5173\u95ed">\u5173\u95ed</a></span></h3><div style="width:580px;height:380px;">' +
			'<div class="c" style="height:327px;">' +
			'<div class="pbt cl"><span><span>帖子链接: </span><input type="text" style="width:310px;" id="is_id" class="px">&nbsp;&nbsp;<button style="width:75px;" id="is_submit">提交</button>&nbsp;&nbsp;&nbsp;&nbsp;<button style="width:75px;" id="is_open">打开</button></span></div>' +
			'<div id="ir_list" style="overflow-y:scroll;width:550px; height:290px;">' +
			'</div>';

		pfhtml = pfhtml + '</div><div class="o"><button style="width:75px;" id="is_reply">回复</button>&nbsp;&nbsp;&nbsp;&nbsp;<button style="width:75px;" id="irclose">关闭</button></div><style>.c p{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}</style>';
		showWindow('irdialog', pfhtml, 'html');
		jq('#irclose').click(function() {
			hideWindow('irdialog');
		});
		jq('#is_open').click(function() {
			var link = jq('#is_id').val().trim();
			var seedfrom = (/^\d+$/.test(link)) ? link : link.match(/(thread-|tid=)(\d+)/)[2];
			window.open('http://bt.neu6.edu.cn/thread-' + seedfrom + '-1-1.html');
		});
		var reason1 = "感谢分享，剧版已有相同版本：\n";
		var reason2 = "\n\n资源重复，欢迎续种";
		var title = "";
		jq('#is_reply').click(function() {
			var link = jq('#is_id').val().trim();
			var seedfrom = (/^\d+$/.test(link)) ? link : link.match(/(thread-|tid=)(\d+)/)[2];
			link = 'http://bt.neu6.edu.cn/thread-' + seedfrom + '-1-1.html';
			jq("form#fastpostform textarea#fastpostmessage").append(reason1 + title + ": " + link + reason2);
		});
		jq('#is_submit').click(function() {
			var link = jq('#is_id').val().trim();
			var seedfrom = (/^\d+$/.test(link)) ? link : link.match(/(thread-|tid=)(\d+)/)[2];

			var text1 = jq('ignore_js_op>dl.tattl>dd>pre').text();
			var thisinfo = file_info_prase(text1);
			jq.get('http://bt.neu6.edu.cn/thread-' + seedfrom + '-1-1.html', function(resp) {
				var page = jq(resp);
				title = page.find("span#thread_subject").text();
				var text2 = page.find('ignore_js_op>dl.tattl>dd>pre').text();
				var thatinfo = file_info_prase(text2);
				for (var i = 0; i < thisinfo.length; i++) {
					var j = 0;
					for (j = 0; j < thatinfo.length; j++) {
						if (thisinfo[i][1] == thatinfo[j][1]) {
							thisinfo[i][2] = true;
							break;
						}
					}
					thatinfo.splice(j, 1);
				}
				var ir_list_html = '<table style="width:540px" border="0">';
				var no_match_html = '';
				var that_match_html = '<tr><td colspan="3" style="color:green">[另一个帖子未匹配列表如下]</td></tr>';
				for (i = 0; i < thisinfo.length; i++) {
					if (thisinfo[i][2]) {
						ir_list_html += "<tr><td><b style=\"color:red\">√</b></td><td>" + thisinfo[i][1] + "</td><td>" + thisinfo[i][0] + "</td></tr>";
					} else {
						no_match_html += "<tr><td><b style=\"color:black\">×</b></td><td>" + thisinfo[i][1] + "</td><td>" + thisinfo[i][0] + "</td></tr>";
					}
				}
				for (i = 0; i < thatinfo.length; i++) {
					that_match_html += "<tr><td><b style=\"color:black\">×</b></td><td>" + thatinfo[i][1] + "</td><td>" + thatinfo[i][0] + "</td></tr>";
				}
				ir_list_html += no_match_html + that_match_html + '</table>';
				jq('#ir_list').html(ir_list_html);
			});
		});
	});

	jq('#commonquestions').click(function() {
		var com_qus = [
			"请按照这个格式修改标题：[中文名/外文名][季度集数][分辨率/录制片源/文件格式][语言/字幕][发布组名称或文件来源][其他说明]",
			"请按照这个格式修改标题：[简体中文名称][0day英文全名][语言/字幕情况][其他说明]",
			"发帖时不要删掉上方的剧版公告，请补上",
			"图片请上传到本地，请不要使用外链图片",
			"关于图片位置，编辑时，点击图片按钮打开图片列表，用鼠标点到想要插入图片的位置，然后点击刚刚上传的图片就可以了（海报放在顶部，缩略图放在简介下面）。\n[img=400,0]http://bt.neu6.edu.cn/data/attachment/forum/201801/04/175841pollw3u2uuadxxaj.gif[/img]",
			"请添加标签（必须要有中文剧名），填写中文剧名，另外可添加英文剧名，主要演员，版本（制作组）等信息。在帖子左下角：\n[img]http://bt.neu6.edu.cn/data/attachment/forum/201407/09/214058rb1rymm11ps6zpf1.png[/img]",
			"下载帖子下面的新种子文件，用UT打开它开始做种 （选择下载位置与文件所在的位置吻合，自己的种子勾选上跳过校验）。成功连接后会显示有一格信号的，之后只要保持做种状态就可以了（Tracker bt.neu6.edu正常工作中）",
			"完结剧集请发到相应板块：\n高清剧合集：[url=http://bt.neu6.edu.cn/forum-77-1.html]http://bt.neu6.edu.cn/forum-77-1.html[/url]\n完结剧集：[url=http://bt.neu6.edu.cn/forum-73-1.html]http://bt.neu6.edu.cn/forum-73-1.html[/url]",
			"字幕及其他无关文件禁止出现在种子中，如：与资源无关的图片/文档/链接/uT临时文件/BT种子文件等\n例如： ",
			"除非有特殊情况（稀有资源、古董级资源、字幕组有特殊说明），本版只允许发布格式统一版本（包括压制字幕组），禁止发布混合字幕组或混合格式的合集。",
			"如果字幕组没有发布统一文件格式是允许发布混合合集。以后有这种情况请在简介下面加个简单额说明，之后欢迎再补上统一格式版本。",
			"因为这部剧本季未播放完毕，所以不接收包含剧版已有资源的小合集。\n剧版已有相同版本的单集，例如：",
			"剧版已有相同版本：\n资源重复，欢迎续种",
			"日韩剧请选择分类“其他1”，欧美剧请选择分类“其他2”",
			"高清区资源发布均为HDTV/Bluray来源的720P及以上分辨率高清电视剧集，码率要求为：欧美剧 >3500kbps; 非欧美剧>2500kbps。\n（欧美剧0day资源码率要求可以降低，但必须为MKV格式。WEB来源，带有网站水印的电视剧集，码率要求为 >3000kps)",
			"高清资源请补上视频编码或者复制粘贴NFO信息（置为代码（编辑器中（[b]<>[/b]）按钮）），编码信息制作教程：\n[url=http://bt.neu6.edu.cn/1406612]http://bt.neu6.edu.cn/1406612[/url]",
			"因为文件名无0day或压制组信息，请补上一张视频缩略图\n缩略图制作教程：[url=http://bt.neu6.edu.cn/thread-612915-1-1.html]http://bt.neu6.edu.cn/thread-612915-1-1.html[/url]",
			"帖子发布后就不能再修改种子文件，服务器无法识别第二次上传的，所以现在种子失效了（正常情况下，帖子下面可以看到种子和文件信息的）\n种子失效了，请重新制作新种子文件，发新帖",
			"剧版已有相同版本：\n如果旧帖已断种和无法直接续种（校验失败）允许重新发新帖但请在帖子顶部提供旧帖的链接和简单说明情况",
			"“任何资源发布请尊重原始制作小组或制作者；发布请保持原作者文件属性（原始文件名、小组信息等），资源相同的情况下优先保留保持原始文件名的资源。”\n这个的原始文件名应该是：",
			"编码信息需要置为代码，方法如下：\n[img=450,0]http://bt.neu6.edu.cn/data/attachment/forum/201801/04/175847c44zroqqsru9dg4s.gif[/img]"
		];
		var pfhtml = '<h3 class="flb"><em id="return_reply">剧版常见问题</em><span><a href="javascript:;" class="flbc" id="cqclose1" title="关闭">关闭</a></span></h3><div style="width:580px;height:420px;">' +
			'<div id="cqreason" class="c" style="height:367px;">';
		for (var val = 0; val < com_qus.length; val++) {
			if ((val % 2) === 0)
				pfhtml = pfhtml + '<p><span>(' + (val + 1) + ')</span><span>' + com_qus[val] + '</span></p>';
			else
				pfhtml = pfhtml + '<p style="background: #F0F0F0"><span>(' + (val + 1) + ')</span><span>' + com_qus[val] + '</span></p>';
		}

		pfhtml = pfhtml + '</div><div class="o"><button id="cqclose">关闭</button></div><style>.c p{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}</style>';
		showWindow('comques', pfhtml, 'html');
		jq('#cqclose').click(function() {
			hideWindow('comques');
			if (location.href.match(/action=reply&fid=/)) {
				if (jq('#e_iframe').contents().find('body').html())
					jq('#e_iframe').contents().find('body').html(jq('#e_iframe').contents().find('body').html() + bbcode2html("\n修改后请回复"));
			} else {
				if (jq("form#fastpostform textarea#fastpostmessage").text())
					jq("form#fastpostform textarea#fastpostmessage").append("\n修改后请回复");
			}
		});
		jq('#cqclose1').click(function() {
			hideWindow('comques');
			if (location.href.match(/action=reply&fid=/)) {
				if (jq('#e_iframe').contents().find('body').html())
					jq('#e_iframe').contents().find('body').html(jq('#e_iframe').contents().find('body').html() + bbcode2html("\n修改后请回复"));
			} else {
				if (jq("form#fastpostform textarea#fastpostmessage").text())
					jq("form#fastpostform textarea#fastpostmessage").append("\n修改后请回复");
			}
		});
		jq('div#cqreason>p').each(function() {
			jq(this).click(function() {
				if (location.href.match(/action=reply&fid=/)) {
					if (replay_index === 0)
						jq('#e_iframe').contents().find('body').html(bbcode2html("感谢分享\n\n"));
					replay_index++;
					jq('#e_iframe').contents().find('body').html(jq('#e_iframe').contents().find('body').html() + bbcode2html(replay_index + ") " + jq(this).find('span:last').text() + "\n"));

				} else {
					if (replay_index === 0)
						jq("form#fastpostform textarea#fastpostmessage").append("感谢分享\n\n");
					replay_index++;
					jq("form#fastpostform textarea#fastpostmessage").append(replay_index + ") " + jq(this).find('span:last').text() + "\n");
				}
			});
			jq(this).hover(function() {
				jq(this).css({
					"font-weight": "bold",
					"font-size": '110%'
				});
			}, function() {
				jq(this).css({
					"font-weight": "normal",
					"font-size": '100%'
				});
			});
		});
	});


	jq(document).ready(function() {
		currentuser = jq("div#um strong.vwmy a").text().trim();
		currenturl = jq("div#pt div.z a:last").attr('href').match(/(thread-|tid=)(\d+)/)[2];
		currenturl = "http://bt.neu6.edu.cn/thread-" + currenturl + "-1-1.html";
		get_seed_information();
		if (location.href.match(/thread-|tid=/)) {
			jq("div#modmenu>a:eq(2)").removeAttr('onclick');
			jq("div#modmenu>a:eq(2)").bind('click', my_stick);
			jq("div#modmenu>a:eq(4)").removeAttr('onclick');
			jq("div#modmenu>a:eq(4)").bind('click', my_highlight);
			jq("div#modmenu>a:eq(8)").removeAttr('onclick');
			jq("div#modmenu>a:eq(8)").bind('click', my_move);
		}
	});

})();