// ==UserScript==
// @name         ZXPT Info Clone
// @namespace    name_zxpt
// @author       sx742055963
// @description  知行PT种子信息克隆
// @grant        none
// @include      http://pt.zhixing.bjtu.edu.cn*/search/*
// @include      http://pt.zhixing.bjtu.edu.cn*/upload/*
// @include      http://pt.zhixing.bjtu.edu.cn/torrents/*
// @version      20170613
// @icon         http://pt.zhixing.bjtu.edu.cn/static/images/logo.png
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/22589/ZXPT%20Info%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/22589/ZXPT%20Info%20Clone.meta.js
// ==/UserScript==

(function($) {

	//------------------------------config------------------------------

	var CloneButtonPosition = 0; //克隆按钮位置[0-10]
	var TitleOfCloneButton = "Clone"; //克隆按钮标题栏文字[中英文,""]

	var SetSingularLinesColor = false; //是否设置种子列表单数行颜色[true,false]
	var ColorOfSingularLines = "#E5E5E5"; //设置种子列表单数行颜色[red,#8D078B,...]

	//种子列表自己发布的种子用户名突出显示
	var SetUserNameOutstanding = true; //是否设置种子列表用户名突出显示[true,false]
	var UserNameColor = "#8D078B"; //字体颜色[red,#8D078B,...]
	var UserNameWeight = "bold"; //字体加粗[normal,bold,900,...]
	var UserNameFontStyle = "italic"; //字体风格[italic,normal,oblique,...]
	var UserNameFontSize = "1.2em"; //字体大小[18px,1.2em,...]

	var SetAnonymous = false; //设置匿名[true,false]

	//-------------------------------end--------------------------------

	// 种子搜索页面
	if ($('table.torrenttable').length && !location.href.match(/torrents\/\d+\//)) {
		$('table.torrenttable th:eq(' + CloneButtonPosition + ')').after('<th>' + TitleOfCloneButton + '</th>');
		if (SetSingularLinesColor) {
			$('table.torrenttable>tbody>tr:odd').css("background-color", ColorOfSingularLines);
		}
		var usrid = $('strong.vwmy a').attr('href').match(/\d+/)[0];
		$('table.torrenttable>tbody>tr').each(function() {
			var tr = $(this);
			if (tr.find('td.icon-td').length) {
				if (SetUserNameOutstanding) {
					var seedid = tr.find('td:last a').attr('data-uid');
					if (seedid == usrid) {
						tr.find('td:last a').css({
							"color": UserNameColor,
							"font-weight": UserNameWeight,
							"font-style": UserNameFontStyle,
							"font-size": UserNameFontSize
						});
					}
				}
				// 获取种子分类
				var cat = tr.find('td:eq(0) img').attr('src').slice(22, -4);
				// 获取种子ID
				var id = tr.attr('id').substring(1);
				// 添加点击跳转按钮
				tr.find('td:eq(' + CloneButtonPosition + ')').after('<td><a title="点击克隆种子信息" target="_blank" href="http://pt.zhixing.bjtu.edu.cn/upload/' + cat + '#clone_' + id + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3AUIEBkrj+YiQwAAAxtJREFUSMellc1rXGUUxn/nPee8d2aaJpOYmqSV1lTciOJGKJSCCK7dFXQhuHMvdeXSpXtxmb+gS0Eh0p0gUsVWEZWkMeAHCcHGNGYmc+9xMZ/pJM4U7+rycu95zvN7zr1HADbfucL/vVbXtk49l9HiEiUgDUCmqBmBtBAp/0vERu6fBrkVotdCSJOqSwBRbQp89Nujzr1moWMkVte2hgIS1bsHzavv71y8TiSbVB+A5u79G3N/3L1w2O68t+BVO1WJEHkI7IZ0BfuVEvDS/tLL/PXsqxDl5OqiVOcW0N/vvb5bxvq81yvNipZHO1J1PpSoboekgYAAkszJrl37kwIQxd1oa902Ll5fqZ57geb58zR3719a3vzsA4n2HWBvwCIANSUXDpVO4SBhZpCU48Yi7fnLtJvzHFii2r5zIbWOZhHdOwFbVfGckWoyokgJcwMBs0R2JbvhriBDBjbsH0yVnB1i4hCBKOZGiGCquDs5Z9ysO+NxQqDnwJRcZJjCAZJwM44R1AzPjheOuTP6GZ2CyKGawkHqOuhItzHPTs4+wDYuEIFaIucpHaSEuoEIZkNE5j1EfeyPO0jFlA5EEXdEZODAs6PuINKPYFxAngARvUBNuxnkIpN8Qsj2BIiih0it+9F5dqR3dmbIOTsxpYPK7QSinB3c6Iw8NubAiwxlZyqBjnUFzIaIKndKYSyDAEJFyPUalFMgUgVLQPQQdUMu3WghPDZFUkXE963v1m/6U8uI5e6pCPQfjpE/oAhE0Prmc/6WOtRmKIpMzpmOOyJQRffN4T5Q+6T189ezrY1vr4lIAmK/XV5taX1Z5xY5bck90gYbV15jeeUZZptz5HqNoEOUZfQ33WgGf0LcojxuBMhSPZXrDw7f0nP2cTEzV4jlIdgBV2Ph4QMu/XRIufcVB6q0frlLHB18Kcl26Ld12tLfO6rYOaqKRqpuWuKGwNg/XICaCg0DGxr8VczWCLYROXu5f/rGCkmETgRfbP/D2g/71O3k+NYMXlmq8ebzM7y4WIyKnGjizOvHty8PRuzMYRKwdHqnq2tb/AtfUe1KQr9mZwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wOS0xN1QxNToxNzo0NyswODowMIu/JeMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMDUtMDhUMTY6MjU6NDMrMDg6MDCbVEygAAAATXRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA3LjAuMS02IFExNiB4ODZfNjQgMjAxNi0wOS0xNyBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZ93ZpU4AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADUxMo+NU4EAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTEyHHwD3AAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzM2NDY1NTQzfWYZJAAAABJ0RVh0VGh1bWI6OlNpemUAMTYuOUtCML+chwAAAF90RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC9zaXRlL3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9zcmMvMTA2NjIvMTA2NjI1NC5wbme2gbXWAAAAAElFTkSuQmCC"></a></td>');
			}
		});
		return;
	}
	// 种子发布页面
	if (location.href.match(/\/upload\//) || location.href.match(/\/edit\//)) {
		$('form').before('<table cellspacing="0" cellpadding="0" class="tfm"><th>种子信息克隆</th><td style="text-align:left"><input type="text" id="clone_from" class="px" placeholder="请输入种子链接..." onkeypress="if(event.keyCode==13){clone_btn.click();}"><input type="button" id="clone_btn" style="size:100px;" value=" 克   隆 ">&nbsp;&nbsp;&nbsp;&nbsp;<span>[克隆状态：</span><span id="clone_info">请输入要克隆的种子编号或者链接</span><span>]</span></td></table><table hidden="true" id="seedfilename" cellspacing="0" cellpadding="0" class="tfm"><th>种子文件名</th><td style="text-align:left"><input type="text" id="uploadseedname" class="px"></td></table>');
		$("span#subs_upload").after('<span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span><span id="add_code"><input type="button" class="button button-blue upload-btn" value="添加编码" id="add_code_btn"></span><div id="code_block_div" style="display: none;"><div style="margin:6px 10px 2px 10px"><span><b>请输入要插入的代码...</b></span><span id="code_block_close" class="button button-blue upload-btn" style="float: right;">关闭</span></div><div><textarea id="add_code_source" cols="40" rows="30" style="margin: 10px; height: 100px;border-radius:5px"></textarea></div><div style="float: right;"><span id="submit_code_btn" class="button button-blue upload-btn" style="margin-right: 10px;margin-bottom: 10px">提交</span></div></div></span>');
	}

	// 添加编码按钮点击事件
	$("input#add_code_btn").click(function() {
		$("#code_block_div").attr('style', 'display: block;background: #fcfcfc;position: absolute;box-shadow: 0 2px 8px rgba(0,0,0,1);opacity:1;margin-left: 80px;border-radius:5px');
	});
	$("span#code_block_close").click(function() {
		$("#code_block_div").attr('style', 'display: none');
	});
	$("span#submit_code_btn").click(function() {
		var addcode = $("textarea#add_code_source").val();
		if (addcode) {
			var editor = $('#descr').xheditor({
				tools: 'full',
				skin: 'default'
			});
			editor.focus();
			editor.setSource(editor.getSource() + "\n\n\n[quote]※※※※※※※ 视频编码 ※※※※※※※" + "\n\n" + addcode + "[/quote]");
			$("textarea#add_code_source").val("");
		}
		$("#code_block_div").attr('style', 'display: none');
	});
	// 自动处理并复制种子文件名
	function seedname_copy() {
		$("table#seedfilename").show();
		var uploadseedname = $("input#torrent_file").val().replace(/.*\\([^\.\\]+)/g, "$1");
		uploadseedname = uploadseedname.replace(/(\.torrent$)/, "");
		uploadseedname = uploadseedname.replace(/(^\[\S+?\][\.]{0,1})/, "");
		uploadseedname = uploadseedname.replace(/(\.mkv$)|(\.mp4$)|(\.rmvb$)|(\.ts$)|(\.avi$)|(\.iso$)/i, "");
		uploadseedname = uploadseedname.replace(/(^\s*)|(\s*$)/g, "");
		uploadseedname = uploadseedname.replace(/([\s])/g, ".");
		$("input#uploadseedname").val(uploadseedname);
		$("input#uploadseedname").select();
		document.execCommand('Copy');
	}

	function numatostring2(num) {
		return (num < 10) ? ("0" + num) : (num.toString());
	}
	// 判断是否为闰年
	function leapyear(year) {
		return (((year % 400 === 0) || (year % 100 !== 0)) && (year % 4 === 0));
	}
	// 自动增加集数
	function tvseasonhandle(str) {
		var aaatv = str.match(/\d+/g);
		var bbbtv = str.match(/\D+/g);
		if (aaatv && aaatv.length == 1) {
			str = numatostring2(parseInt(aaatv[0]) + 1);
			if (bbbtv) {
				str = bbbtv[0] + str;
				if (bbbtv && bbbtv.length > 1)
					str = str + bbbtv[1];
			}

		}
		if (aaatv && aaatv.length == 2) {
			if (bbbtv && bbbtv.length >= 2 && bbbtv[1] == "E") {
				aaatv[1] = numatostring2(parseInt(aaatv[1]) + 1);
			} else {
				var temp = parseInt(aaatv[1]) - parseInt(aaatv[0]);
				aaatv[0] = numatostring2(parseInt(aaatv[1]) + 1);
				aaatv[1] = numatostring2(parseInt(aaatv[0]) + temp);
			}
			if (bbbtv && bbbtv.length == 1)
				str = aaatv[0] + bbbtv[0] + aaatv[1];
			else if (bbbtv && bbbtv.length == 2)
				str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1];
			else if (bbbtv && bbbtv.length == 3)
				str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1] + bbbtv[2];
		}
		return str;
	}
	// 克隆按钮点击事件
	$('#clone_btn').click(function() {
		var type = window.location.pathname.substring(8);
		var seedfrom = $('#clone_from').val().trim();
		var info = $('#clone_info');
		var match = seedfrom.match(/(\d+)/);
		if (match !== null) {
			seedfrom = match[1];
			info.text('正在读取...');
			$.get('http://pt.zhixing.bjtu.edu.cn/torrents/' + seedfrom, function(resp) {
				info.text('正在分析...');
				var title = resp.match(/<h1>[\s\S]*<\/h1>/gi)[0];
				var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
				var page = $(body);
				var linktype = page.find('ul.breadcrumbs li:eq(1) a').attr('href').slice(8, -1);
				if (location.href.match(/\d+\/edit/)) {
					type = linktype;
				}
				if (linktype != type) {
					info.text('种子类型错误,正在跳转...');
					var newlink = "http://pt.zhixing.bjtu.edu.cn/upload/" + linktype + "#clone_" + seedfrom;
					window.open(newlink, "_self");
					return;
				}
				var match = title.match(/种子名称：(.*)/);
				if (!match) {
					info.text('失败，可能由于种子不存在或者网络问题');
					return;
				}
				var descr = page.find('#torrent-detail-descr');
				var fields = title.match(/\[[^\]]*\]/g);
				var i = 0;
				for (i = 0; i < fields.length; ++i) {
					fields[i] = fields[i].replace(/^\[|\]$/g, '');
				}

				if (type == "tv") {
					var fillareatv = ["district", "name", "name_en", "season", "actor", "format", "subtitle"];
					var fillchecktv = [4, 2, 2, 1, 0, 0, 0];
					if (fields.length < 4) {
						info.text('部分克隆成功');
					}
					while (fillareatv.length > fields.length) {
						fillareatv.splice(fillchecktv.shift(), 1);
					}
					for (i = 0; i < fillareatv.length; ++i) {
						if (fillareatv[i] == "name_en") {
							var tv_name = fields[i].match(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/);
							if (tv_name) {
								var tv_season = tvseasonhandle(tv_name[0]);
								fields[i] = fields[i].replace(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/, tv_season);
							}
						}
						if (fillareatv[i] == "season") {
							fields[i] = tvseasonhandle(fields[i]);
						}
						$("#" + fillareatv[i]).val(fields[i]);
					}
					$("#group").val("其他");
					if (descr.find('table')) {
						descr.find('table').remove();
					}
				} else if (type == "comic") {
					var fillareacomic = ["type", "subtitles_group", "name_en", "name", "season", "memo", "opt1", "format"];
					var fillcheckcomic = [2, 4, 1, 2, 1, 0, 0];
					if (fields.length < 4) {
						info.text('部分克隆成功');
					}
					while (fillareacomic.length > fields.length) {
						fillareacomic.splice(fillcheckcomic.shift(), 1);
					}
					for (i = 0; i < fillareacomic.length; ++i) {
						if (fillareacomic[i] == "season") {
							var aaa = fields[i].match(/\d+/g);
							var bbb = fields[i].match(/\D+/g);
							if (aaa && aaa.length == 1) {
								fields[i] = numatostring2(parseInt(aaa[0]) + 1);
								if (bbb)
									fields[i] = fields[i] + " ";
							}
							if (aaa && aaa.length == 2) {
								if (bbb && bbb[0] == "/") {
									aaa[0] = numatostring2(parseInt(aaa[0]) + 1);
									aaa[1] = numatostring2(parseInt(aaa[1]) + 1);
									fields[i] = aaa[0] + bbb[0] + aaa[1];
									if (bbb && bbb.length > 1)
										fields[i] = fields[i] + " ";
								} else {
									aaa[0] = numatostring2(parseInt(aaa[1]) + 1);
									fields[i] = aaa[0];
								}

							}
						}
						$("#" + fillareacomic[i]).val(fields[i]);
					}
				} else if (type == "movie") {
					var fillareamovie = ["district", "year", "name", "name_en", "actor", "movietype", "format", "resolution", "subtitle"];
					if (fields.length < 5) {
						info.text('部分克隆成功');
					}
					if (parseInt(fields[0]) > 1900 && parseInt(fields[0]) < 9000) {
						var fillcheck1 = [0, 3, 4, 4, 4, 0, 0, 0];
						fillareamovie.splice(fillcheck1.shift(), 1);
						while (fillareamovie.length > fields.length) {
							fillareamovie.splice(fillcheck1.shift(), 1);
						}
						$("#district").val("其他");
					} else {
						var fillcheck2 = [4, 5, 5, 5, 0, 0, 0];
						while (fillareamovie.length > fields.length) {
							fillareamovie.splice(fillcheck2.shift(), 1);
						}
					}
					for (i = 0; i < fillareamovie.length; ++i) {
						if (i >= 3 && fillareamovie[i] == "movietype") {
							var movie_type = fields[i].split("/");
							for (var j = 0; j < movie_type.length; ++j) {
								$("input:checkbox[value='" + movie_type[j] + "']").attr("checked", 'true');
							}
						} else {
							$("#" + fillareamovie[i]).val(fields[i]);
						}
					}
					$("#group").val("其他");
					if (descr.find('table')) {
						descr.find('table').remove();
					}
				} else if (type == "zongyi") {
					var fillareazongyi = ["district", "type", "thedate", "name", "memo", "actor", "format"];
					var fillcheckzongyi = [5, 0, 0, 3, 0, 0, 0];
					if (fields.length < 3) {
						info.text('部分克隆成功');
					}
					while (fillareazongyi.length > fields.length) {
						fillareazongyi.splice(fillcheckzongyi.shift(), 1);
					}
					for (i = 0; i < fillareazongyi.length; ++i) {
						if (fillareazongyi[i] == "thedate") {
							if (fields[i].length === 10) {
								var dayofmonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
								var year = fields[i].substring(0, 4);
								var month = fields[i].substring(5, 7);
								var day = fields[i].substring(8, 10);
								if (leapyear(parseInt(year))) {
									dayofmonths[1] += 1;
								}
								var monthadd = parseInt((parseInt(day) + 7) / dayofmonths[parseInt(month) - 1]);
								day = numatostring2((parseInt(day) + 7) % dayofmonths[parseInt(month) - 1]);
								var yearadd = 0;
								if ((parseInt(month) + monthadd) > 12) {
									yearadd = 1;
									month = numatostring2((parseInt(month) + monthadd) % 12);
								}
								year = parseInt(year) + yearadd;
								fields[i] = year + "-" + month + "-" + day;
							}
						}
						if (fillareazongyi[i] != "memo")
							$("#" + fillareazongyi[i]).val(fields[i]);
					}
				} else if (type == "documentary") {
					var fillareadocumentary = ["year", "source", "name", "name_en", "subtitle", "format"];
					var fillcheckdocumentary = [1, 4, 0, 0, 0, 0];
					if (fields.length < 3) {
						info.text('部分克隆成功');
					}
					while (fillareadocumentary.length > fields.length) {
						fillareadocumentary.splice(fillcheckdocumentary.shift(), 1);
					}
					for (i = 0; i < fillareadocumentary.length; ++i) {
						$("#" + fillareadocumentary[i]).val(fields[i]);
					}
				} else if (type == "other") {
					var fillareaother = ["type", "name"];
					if (fields.length < 2) {
						info.text('部分克隆成功');
					}
					var fillcheckother = [1, 0];
					while (fillareaother.length > fields.length) {
						fillareaother.splice(fillcheckother.shift(), 1);
					}
					for (i = 0; i < fillareaother.length; ++i) {
						$("#" + fillareaother[i]).val(fields[i]);
					}
				} else if (type == "sports") {
					var fillareasports = ["district", "type", "thedate", "name", "language", "format"];
					if (fields.length < 3) {
						info.text('部分克隆成功');
					}
					if (parseInt(fields[1]) > 1900 && parseInt(fields[1]) < 9000) {
						fillareasports.splice(0, 1);
						$("#district").val("其他");
						var fillchecksports1 = [4, 3, 0, 0, 0];
						while (fillareasports.length > fields.length) {
							fillareasports.splice(fillchecksports1.shift(), 1);
						}
					} else {
						var fillchecksports2 = [5, 4, 3, 0, 0, 0];
						while (fillareasports.length > fields.length) {
							fillareasports.splice(fillchecksports2.shift(), 1);
						}
					}
					for (i = 0; i < fillareasports.length; ++i) {
						$("#" + fillareasports[i]).val(fields[i]);
					}
				} else if (type == "software") {
					var fillareasoftware = ["district", "type", "format", "name", "version", "memo"];
					if (fields.length < 4) {
						info.text('部分克隆成功');
					}
					var fillchecksoftware = [5, 2, 0, 0, 0, 0];
					while (fillareasoftware.length > fields.length) {
						fillareasoftware.splice(fillchecksoftware.shift(), 1);
					}
					for (i = 0; i < fillareasoftware.length; ++i) {
						$("#" + fillareasoftware[i]).val(fields[i]);
					}
				} else if (type == "game") {
					var fillareagame = ["os", "name", "name_en", "type", "company", "format", "version", "language", "memo"];
					if (fields.length < 4) {
						info.text('部分克隆成功');
					}
					var fillcheckgame = [8, 6, 0, 0, 0, 0];
					while (fillareagame.length > fields.length) {
						fillareagame.splice(fillcheckgame.shift(), 1);
					}
					for (i = 0; i < fillareagame.length; ++i) {
						if (i >= 6 && fillareagame[i] == "language") {
							var language = fields[i].split("/");
							for (var k = 0; k < language.length; ++k) {
								$("input:checkbox[value='" + language[k] + "']").attr("checked", 'true');
							}
						} else {
							$("#" + fillareagame[i]).val(fields[i]);
						}
					}
				} else {
					info.text('暂时不支持此链接解析');
					return;
				}
				$("input#anonymous").attr("checked", SetAnonymous);
				if (descr.find('img')) {
					if (descr.find('img').length == 1 && type == "zongyi")
						descr.find('img').remove();
					else
						descr.find('img:gt(0)').remove();
				}
				descr.find("table").remove();
				descr.find('blockquote').remove();

				var editor = $('#descr').xheditor({
					tools: 'full',
					skin: 'default'
				});
				editor.focus();
				editor.appendHTML(descr.html());
				info.text('克隆完成');
			});
		} else {
			info.text('请输入要克隆的种子编号或者链接');
		}
	});
	if (location.href.match(/upload[\S]$/)) {
		$('ul.nav').before('<br><table cellspacing="0" cellpadding="0" class="tfm"><th>种子信息克隆</th><td style="text-align:left"><input type="text" id="clone_from_notype" class="px" placeholder="请输入种子链接..." onkeypress="if(event.keyCode==13){clone_btn_notype.click();}"><input type="button" id="clone_btn_notype" style="size:100px;" value=" 克   隆 ">&nbsp;&nbsp;&nbsp;&nbsp;<span>[克隆状态：</span><span id="clone_info_notype">请输入要克隆的种子编号或者链接</span><span>]</span></td></table><br>');
	}

	$('#clone_btn_notype').click(function() {
		var from_notype = $('#clone_from_notype').val().trim();
		var info_notype = $('#clone_info_notype');
		var match_notype = from_notype.match(/(\d+)/);
		if (match_notype !== null) {
			from_notype = match_notype[1];
			info_notype.text('正在读取...');
			$.get('http://pt.zhixing.bjtu.edu.cn/torrents/' + from_notype, function(resp) {
				info_notype.text('正在分析...');
				var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
				var page = $(body);
				var linktype_notype = page.find('ul.breadcrumbs li:eq(1) a').attr('href').slice(8, -1);
				if (linktype_notype == "movie" || linktype_notype == "tv" || linktype_notype == "music" || linktype_notype == "comic" || linktype_notype == "game" || linktype_notype == "zongyi" || linktype_notype == "sports" || linktype_notype == "software" || linktype_notype == "study" || linktype_notype == "documentary" || linktype_notype == "other") {
					info_notype.text('种子类型错误,正在跳转...');
					var newlink_notype = "http://pt.zhixing.bjtu.edu.cn/upload/" + linktype_notype + "#clone_" + from_notype;
					window.open(newlink_notype, "_self");
					return;
				} else {
					info_notype.text('暂时不支持此链接解析');
					return;
				}

			});
		}
	});

	$(document).ready(function() {
		$("input#torrent_file").bind("change", seedname_copy);
		var match = location.href.match(/#clone_(\d+)/);
		if (match) {
			$('#clone_from').val(match[1]);
			history.pushState("", document.title, window.location.pathname);
			$('#clone_btn').click();
		}
	});

})(jQuery);