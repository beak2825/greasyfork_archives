// ==UserScript==
// @name         WM_Jira助手
// @namespace    weimai_QA_Jira_Assistant
// @version      1.1.6
// @description  Jira绘制bug分布饼图，任务命名规范校验，用例多选，导入用例自动映射字段
// @author       daji_QA_WM
// @match        *://jira.ichoice.cc/*
// @icon         data:image/png;base64,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
// @grant        none
// @require      https://cdn.staticfile.org/echarts/5.3.3/echarts.min.js
// @downloadURL https://update.greasyfork.org/scripts/451347/WM_Jira%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/451347/WM_Jira%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var pathname = window.location.pathname;
	var mapProject = new Map();
	var mapAssignee = new Map();
	var mapCreator = new Map();
	var mapPriority = new Map();
	var bugCount = 0;
	var bugUnresolved = 0;
	var bugTobeTested = 0;
	var bugClosed = 0;
	var bDragToSelect = false;
	var arcY1 = 0;
	var arcY2 = 0;
	var arcX1 = 0;
	var arcX2 = 0;
	var docHeight = 0;
	var bMouseOn = false;
	var bBatchMenuActived = false;

	function main() {
		console.log("[WM_Jira助手] 进入WM_Jira助手...");
		console.log("[WM_Jira助手] 初始化菜单悬浮窗...");
		initJaMenu();
		autoFillForImportCase();
		autoFoldCasesForTestPlan();
	}

	function initJaMenu() {
		var htmlBtn = "<div id ='jira_assi_btn' style='right: 320px;top: 0px;background: #00C297;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;text-align:center;width: 66px;height: 23px;border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;font-size: 15px;'>Jira助手</div>";
		htmlBtn += "<div id ='jira_assi_menu'style='border: 1px solid #7a869a; right: 320px;top: 24px;background: #F7F7F7;overflow: hidden;z-index: 9999;position: fixed;text-align:center;width: 100px; font-size: 1.1em;display:none;'><table id = 'ja_menu' style= 'margin: auto; width: 100%'><tr><td id = 'menu_draw_charts'>绘制饼图</td></tr><tr><td id = 'menu_drag_to_select'>框选用例</td></tr><tr><td><a href = 'http://wiki.ichoice.cc/pages/viewpage.action?pageId=572293173' target='_blank'>关于jira助手</a></td></tr><tr><td>当前版本:1.1.6</td></tr></table></div>";
		var htmlCharts = "<div id = 'eCharts' style = 'top: 0px; background: #FFFFFF; overflow: auto; overflow-x: hidden; position: fixed; width: 100%; height: 100%; z-index: 998;display:none'><div style = 'height: 42px; position: relative;'><span style = 'font-size:1.8em;margin-left: 30px;font-weight:800;'>测试日报统计</span><span id = 'warning' style = 'margin-left: 6%; font-size: 1.3em; color: red; font-weight: 600;'></span><br><span id = 'total_bug_count' style = 'font-size:1.3em;margin-left: 30px;'></span><br><span id = 'unresolved_bug_count' style = 'font-size:1.3em;margin-left: 30px;'></span><br><span id = 'to_be_tested_bug_count' style = 'font-size:1.3em;margin-left: 30px;'></span><br><span id = 'closed_bug_count' style = 'font-size:1.3em;margin-left: 30px;'></span></div><span id = 'close_cross'  style = 'top: -11px; position: fixed; font-size: 3em; right: 30px; z-index: 1000'>×</span><div id='BugByAssignee' style='width: 100%;height:100%;position: relative;'></div><div id='bugByCreater' style='width: 100%;height:100%;position: relative;'></div><div id='bugByPriority' style='width: 100%;height:100%;position: relative;'></div></div>";

		$("body")
			.append(htmlBtn);
		$("body")
			.append(htmlCharts);

		$('body')
			.click(function(e) {

				if (e.target.id != "jira_assi_btn" && e.target.id != "jira_assi_menu")
					$("#jira_assi_menu")
					.slideUp("fast");

				if (e.target.id == "menu_drag_to_select") {
					if (bDragToSelect) {
						$("#menu_drag_to_select")
							.css("background-color", "#00C297");
						$("#jira_assi_btn")
							.css("color", "black");
					} else {
						$("#menu_drag_to_select")
							.css("background-color", "");
						$("#jira_assi_btn")
							.css("color", "white");
					}
				}

				//console.log("[WM_Jira助手] ..." + e.target);

				if (e.target.id == "summary" || e.target.id == "issuetype-field") {
					console.log("[WM_Jira助手] 初始化任务备选选项...");
					if ($("#issuetype")
						.length > 0) {
						addTaskTitleOption();
					}
				}
				if (pathname.indexOf("/secure/ShowTestCycleRunDetail.jspa") == -1 && bDragToSelect) {
					bDragToSelect = false;
				}
			});
		$("#close_cross")
			.click(function() {
				$("#eCharts")
					.fadeOut(900);
			});
		$("#jira_assi_btn")
			.click(function() {
				$("#jira_assi_menu")
					.slideDown("fast");
			});
		$("#menu_draw_charts")
			.click(function() {
				$("#eCharts")
					.fadeOut(1200);
				//弹窗画饼图
				if (pathname.indexOf("/secure/views/bulkedit/BulkEdit1!default.jspa") >= 0) {
					$("#eCharts")
						.fadeIn(1200);
					getBugTable();
					if (mapProject.size > 1) {
						$("#warning")
							.text("注意：当前bug分属多个项目! 可在[批量操作]-[移动问题]中进行修改。");
					}
					drawCharts();
				} else {
					alert("[WM_Jira助手] 当前页面不支持绘制饼图...");
					console.log("[WM_Jira助手] 当前页面不支持绘制饼图...");
				}
			});
		$("#menu_drag_to_select")
			.click(function() {
				if (pathname.indexOf("/secure/ShowTestCycleRunDetail.jspa") >= 0) {
					bDragToSelect = bDragToSelect ? false : true;
					//框选时阻止鼠标选中文字，但会导致拖拉的时候不能自动滚动
					/*document.addEventListener('selectstart',function(e){
						if(bDragToSelect)
							e.preventDefault();
						else
							return true;
					});*/
				}
			});
		$("body")
			.mousedown(function(evt) {
				if (evt.buttons != 1 || evt.which != 1 || !bDragToSelect) return;
				//window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
				evt = window.event || evt;
				var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				arcX1 = evt.pageX || evt.clientX + scrollX;
				arcY1 = evt.pageY || evt.clientY + scrollY;
				docHeight = $(document)
					.height();
				//异步执行，不阻塞选择事件（拖拉滚动之类）
				var mouseStopId = setTimeout(function() {
					bMouseOn = true;
					//开始绘制选区
					var selDiv = document.createElement('div');
					selDiv.style.cssText = 'position:absolute;width:0;height:0;margin:0;padding:0;border:2px dashed #000099;background-color:#00C297;z-index:1000;opacity:0.4;display:none;';
					selDiv.id = 'selectDiv';
					document.body.appendChild(selDiv);
					selDiv.style.left = arcX1 + 'px';
					selDiv.style.top = arcY1 + 'px';
				}, 100);
			});

		$("body")
			.mousemove(function(evt) {
				if (evt.buttons != 1 || evt.which != 1 || !bDragToSelect || !bMouseOn) return;
				window.getSelection ? window.getSelection()
					.removeAllRanges() : document.selection.empty();
				evt = window.event || evt;
				var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				arcX2 = evt.pageX || evt.clientX + scrollX;
				arcY2 = evt.pageY || evt.clientY + scrollY;
				//绘制选区
				var selDiv = document.getElementById('selectDiv');
				selDiv.style.display = 'block';
				selDiv.style.left = Math.min(arcX2, arcX1) + 'px';
				selDiv.style.top = Math.min(arcY2, arcY1) + 'px';
				selDiv.style.width = Math.abs(arcX2 - arcX1) + 'px';
				selDiv.style.height = Math.abs(arcY2 - arcY1) + 'px';
			});

		$("body")
			.mouseup(function(evt) {
				if (!bDragToSelect || !bMouseOn) return;
				evt = window.event || evt;
				var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				arcX2 = evt.pageX || evt.clientX + scrollX;
				arcY2 = evt.pageY || evt.clientY + scrollY;
				var newDocHeight = $(document)
					.height();

				//头部折叠补偿
				arcY1 = arcY1 - docHeight + newDocHeight;
				if (arcY1 > arcY2) {
					var temp = arcY2;
					arcY2 = arcY1;
					arcY1 = temp;
				}
				//取消选区
				var selDiv = document.getElementById('selectDiv');
				selDiv.style.display = 'none';
				bMouseOn = false;

				$('#test-cycle-members-flat tr')
					.each(function(i) {
						//取每行第一个checkbox
						var chkBox = $(this)
							.find('td:eq(1) input');
						var eleY = chkBox.offset()
							.top;
						if (eleY > arcY1 && eleY < arcY2) {
							if (chkBox.attr('checked') != "checked") {
								//触发一下onclick，激活批量操作菜单下的按钮
								if (!bBatchMenuActived) {
									//性能较差，只触发一次
									chkBox.click();
									bBatchMenuActived = true;
								} else
									//性能好
									chkBox.attr('checked', true);
							} else {
								if (!bBatchMenuActived) {
									chkBox.click();
									bBatchMenuActived = true;
								} else
									chkBox.attr('checked', false);
							}

						}
					});
				bBatchMenuActived = false;
			});


	}

	function addTaskTitleOption() {
		//创建类型为子任务
		if ($("#issuetype")
			.attr("value") == "10102") {
			//添加任务名称备选项
			if ($("#extraSelect")
				.length == 0) {
				var htmlSelect = "<select id = 'extraSelect' style = 'direction:rtl; width:20px;line-height: 22px; font-size: 1.1em; appearance: none;margin-left: 2px; border: 3px solid #00C297; border-top-right-radius: 5px;border-top-left-radius: 5px;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;'>";
				htmlSelect += "<option style = 'direction: ltr;' value =''></option>";
				htmlSelect += "<option style = 'direction: ltr;' value ='【测试】{项目名称}-{模块名称}-用例编写'>【测试】{项目名称}-{模块名称}-用例编写</option>";
				htmlSelect += "<option style = 'direction: ltr;' value ='【测试】{项目名称}-{模块名称}-需求评审+技术评审+用例评审'>【测试】{项目名称}-{模块名称}-需求评审+技术评审+用例评审</option>";
				htmlSelect += "<option style = 'direction: ltr;' value ='【测试】{项目名称}-{模块名称}-测试执行'>【测试】{项目名称}-{模块名称}-测试执行</option>";
				htmlSelect += "<option style = 'direction: ltr;' value ='【测试】{项目名称}-{模块名称}-集成测试'>【测试】{项目名称}-{模块名称}-集成测试</option>";
				htmlSelect += "<option style = 'direction: ltr;' value ='【测试】{项目名称}-{模块名称}-预发测试'>【测试】{项目名称}-{模块名称}-预发测试</option>";
				htmlSelect += "<option style = 'direction: ltr;' value ='【测试】{项目名称}-{模块名称}-生产测试'>【测试】{项目名称}-{模块名称}-生产测试</option>";
				htmlSelect += "<option style = 'direction: ltr;' value ='【测试】{项目名称}-{模块名称}-集成+预发'>【测试】{项目名称}-{模块名称}-集成+预发</option>";
				htmlSelect += "<option style = 'direction: ltr;' value ='【测试】【预排】{项目名称}-排期未定'>【测试】【预排】{项目名称}-排期未定</option>";
				htmlSelect += "</select><br><sapn id = 'naming_warning' style='color:#f16a41; display:none'>概要命名不符合规范</span>";
				$("#summary")
					.after(htmlSelect);
				$("#extraSelect")
					.change(function() {
						$("#summary")
							.val($("#extraSelect")
								.val());
						$("#summary")
							.change();
					});
				//任务名称命名规范校验
				if ($("#summary")
					.length > 0) {
					$("#summary")
						.change(function(evt) {
							var sTitle = $("#summary")
								.val();
							var pos1 = sTitle.indexOf("】");
							var pos2 = sTitle.indexOf("-");
							var sPart1 = sTitle.substr(0, pos1 + 1);
							if (sPart1 != "【测试】" || pos2 <= pos1)
								$("#naming_warning")
								.css("display", "");
							else
								$("#naming_warning")
								.css("display", "none");
						});
				}
			}
			//默认任务类型：测试执行
			if ($("#customfield_10314")
				.length > 0) {
				$("#customfield_10314")
					.val("10223");
			}
		} else if ($("#issuetype")
			.attr("value") == "10101" && $("#project-field")
			.val() == "微脉日常事务 (WMRC)") {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			month = month < 10 ? '0' + month : month; //月份补 0
			var strTaskName = year + "-" + month + "-" + document.getElementsByTagName('meta')['ajs-remote-user-fullname'].content + "-日常任务";
			var htmlSelect = "<select id = 'extraSelect' style = 'direction:rtl; width:20px;line-height: 22px; font-size: 1.1em; appearance: none;margin-left: 2px; border: 3px solid #00C297; border-top-right-radius: 5px;border-top-left-radius: 5px;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;'>";
			htmlSelect += "<option style = 'direction: ltr;' value =''></option>";
			htmlSelect += "<option style = 'direction: ltr;' value ='" + strTaskName + "'>" + strTaskName + "</option>";
			htmlSelect += "</select><br><sapn id = 'naming_warning' style='color:#f16a41; display:none'>概要命名不符合规范</span>";
			$("#summary")
				.after(htmlSelect);
			$("#extraSelect")
				.change(function() {
					$("#summary")
						.val($("#extraSelect")
							.val());
					$("#summary")
						.change();
				});
			//默认任务类型：其他日常
			if ($("#customfield_10314")
				.length > 0) {
				$("#customfield_10314")
					.val("10804");
			}
			//默认初始预估：30h
			if ($("#timetracking_originalestimate")
				.length > 0) {
				$("#timetracking_originalestimate")
					.val("30h");
			}
			//默认开始时间：月初1号
			if ($("#customfield_10306")
				.length > 0) {
				$("#customfield_10306")
					.val(year + "/" + month + "/" + "01");
			}
			//默认开始时间：月底最后一天
			var lastDateOfMonth = new Date(year, date.getMonth(), 0)
				.getDate();
			lastDateOfMonth = lastDateOfMonth < 10 ? '0' + lastDateOfMonth : lastDateOfMonth; //月份补 0
			if ($("#customfield_10307")
				.length > 0) {
				$("#customfield_10307")
					.val(year + "/" + month + "/" + lastDateOfMonth);
			}
		}
		//分配给我
		if ($("#assign-to-me-trigger")
			.length > 0) {
			$("#assign-to-me-trigger")
				.click();
		}
	}

	function getBugTable() {
		mapProject.clear();
		mapAssignee.clear();
		mapCreator.clear();
		mapPriority.clear();

		bugCount = 0;
		bugUnresolved = 0;
		bugTobeTested = 0;
		bugClosed = 0;

		var trList = $("#issuetable")
			.find("tr");
		var i = 0;
		for (i = 1; i < trList.length; i++) {
			var tdArr = trList.eq(i)
				.find("td");
			var cKeyWord = tdArr.eq(1)
				.eq(-1)
				.text()
				.trim();
			var cSummary = tdArr.eq(2)
				.eq(-1)
				.text()
				.trim();
			var cPriority = tdArr.eq(3)
				.find('img')
				.attr("alt")
				.trim();
			var cStatus = tdArr.eq(4)
				.eq(-1)
				.text()
				.trim();
			var cAssignee = tdArr.eq(5)
				.eq(-1)
				.text()
				.trim();
			var cCreator = tdArr.eq(6)
				.eq(-1)
				.text()
				.trim();

			if (cKeyWord.length > 0) {
				var proj = cKeyWord.substr(0, cKeyWord.indexOf("-"));
				if (!mapProject.has(proj)) {
					mapProject.set(proj, 1);
				} else {
					mapProject.set(proj, mapProject.get(proj) + 1);
				}
			}
			if (cAssignee.length > 0) {
				if (!mapAssignee.has(cAssignee)) {
					mapAssignee.set(cAssignee, 1);
				} else {
					mapAssignee.set(cAssignee, mapAssignee.get(cAssignee) + 1);
				}
			}
			if (cCreator.length > 0) {
				if (!mapCreator.has(cCreator)) {
					mapCreator.set(cCreator, 1);
				} else {
					mapCreator.set(cCreator, mapCreator.get(cCreator) + 1);
				}
			}
			if (cPriority.length > 0) {
				if (!mapPriority.has(cPriority)) {
					mapPriority.set(cPriority, 1);
				} else {
					mapPriority.set(cPriority, mapPriority.get(cPriority) + 1);
				}
			}

			switch (cStatus) {
				case "打开的":
					bugUnresolved++;
					break;
				case "开发中":
					bugUnresolved++;
					break;
				case "挂起中":
					bugUnresolved++;
					break;
				case "待测试":
					bugTobeTested++;
					break;
				case "测试中":
					bugTobeTested++;
					break;
				case "已关闭":
					bugClosed++;
					break;
			}
		}
		bugCount = i - 1;
	}

	function drawCharts() {
		$("#total_bug_count")
			.text("有效bug总数：" + bugCount);
		$("#unresolved_bug_count")
			.text("未解决bug数：" + bugUnresolved);
		$("#to_be_tested_bug_count")
			.text("待测试bug数：" + bugTobeTested);
		$("#closed_bug_count")
			.text("已关闭bug数：" + bugClosed);
		//画饼图
		var chartCreator = echarts.init(document.getElementById('bugByCreater'));
		var chartPriority = echarts.init(document.getElementById('bugByPriority'));
		var chartAssignee = echarts.init(document.getElementById('BugByAssignee'));

		var dataBugByAssignee = new Array();
		var index = 0;
		for (let [k, v] of mapAssignee) {
			dataBugByAssignee[index] = {
				value: v,
				name: k
			};
			++index;
		}

		var databugByCreater = new Array();
		index = 0;
		for (let [k, v] of mapCreator) {
			databugByCreater[index] = {
				value: v,
				name: k
			};
			++index;
		}

		var databugByPriority = new Array();
		index = 0;
		for (let [k, v] of mapPriority) {
			databugByPriority[index] = {
				value: v,
				name: k
			};
			++index;
		}

		chartCreator.setOption({
			title: {
				text: 'Bug按创建人分布',
				subtext: '      ——数据来源：Jira',
				left: 'center'
			},
			series: [{
				type: 'pie',
				radius: '46%',
				data: databugByCreater,
				center: ['50%', '50%'],
				itemStyle: {
					normal: {
						shadowBlur: 70,
						shadowColor: 'rgba(0, 0, 0, 0.1)',
						label: {
							show: true,
							formatter: '{b} : {c} ({d}%)'
						},
						labelLine: {
							show: true
						}
					}
				}
			}]
		});

		chartPriority.setOption({
			title: {
				text: 'Bug按优先级分布',
				subtext: '      ——数据来源：Jira',
				left: 'center'
			},
			series: [{
				name: 'Bug优先级分布',
				type: 'pie',
				radius: '46%',
				data: databugByPriority,
				center: ['50%', '50%'],
				itemStyle: {
					normal: {
						shadowBlur: 70,
						shadowColor: 'rgba(0, 0, 0, 0.1)',
						label: {
							show: true,
							formatter: '{b} : {c} ({d}%)'
						},
						labelLine: {
							show: true
						}
					}
				}
			}]
		})

		chartAssignee.setOption({
			title: {
				text: 'Bug按经办人分布',
				subtext: '      ——数据来源：Jira',
				left: 'center'
			},
			series: [{
				name: '每人解决用例分布',
				type: 'pie',
				radius: '46%',
				data: dataBugByAssignee,
				center: ['50%', '50%'],
				itemStyle: {
					normal: {
						shadowBlur: 70,
						shadowColor: 'rgba(0, 0, 0, 0.1)',
						label: {
							show: true,
							formatter: '{b} : {c} ({d}%)'
						},
						labelLine: {
							show: true
						}
					}
				}
			}]
		});
	}

	function autoFillForImportCase() {
		//导入用例自动映射字段填充
		if (pathname == "/secure/CsvShowFieldMapping.jspa") {
			var sModule = $("#所属模块-value");
			var sTitile = $("#用例标题-value");
			var sCondition = $("#前置条件-value");
			var sStep = $("#步骤-value");
			var sExpect = $("#预期-value");
			var sPriority = $("#优先级-value");

			sModule.val("labels");
			sTitile.val("summary");
			sCondition.val("description");
			sStep.val("Step");
			sExpect.val("ExpectedResult");
			sPriority.val("priority");
		} else {
			console.log("[WM_Jira助手] 当前url: " + pathname);
		}
	}

	function autoFoldCasesForTestPlan() {
		if ($("#type-val")
			.text()
			.indexOf("测试计划") >= 0 && $("#test-plan-member-panel")
			.attr("class") != "module toggle-wrap collapsed")
			$("button.aui-button.toggle-title:eq(2)")
			.click();
	}

	jQuery(document)
		.ready(function() {
			if (self == top)
				main();
		});
})();