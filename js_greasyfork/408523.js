// ==UserScript==
// @name         嵌入表格窗口
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       LinTianwen
// @match        http://120.24.109.217:8080/*
// @match        http://127.0.0.1:8848/1
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408523/%E5%B5%8C%E5%85%A5%E8%A1%A8%E6%A0%BC%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/408523/%E5%B5%8C%E5%85%A5%E8%A1%A8%E6%A0%BC%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==


(function() {
    'use strict';
    //把表格追加到页面
    var html = '<div id="KeFuDiv" class="KeFuDiv" style="width: 500px;height:auto;position:absolute;top: 20%;left: 70%;background: white;">'+
			'<div class="title" onmousedown="MoveDiv(KeFuDiv,event);" style="width: 100%;height: auto;text-align: center;line-height: 30px;background-color: #fff;border: 1px #000 solid;">'+
				'<div style="width: 100%;height: 30px;background: #eff7ff;">'+
					'<span id="closeTable" style="width: 10%;position: absolute;right: 12px;line-height: 28px;cursor:pointer">&equiv;<\/span>'+
				'<\/div>'+
				'<div style="width: 100%;height: 30px;font-size:14px;">'+
					'<a href="javascript:void(0)" style="background:gainsboro;width: 33%;float: left;border-right: 1px solid #e5e5e5;">商品房预售许可证信息<\/a>'+
					'<a href="javascript:void(0)" style="width: 33%;float: left;border-right: 1px solid #e5e5e5;">建筑工程施工许可证信息<\/a>'+
					'<a href="javascript:void(0)" style="width: 33%;float: left;border-right: 1px solid #e5e5e5;">工程竣工验收备案信息<\/a>'+
				'<\/div>'+
			'<\/div>'+
			'<div class="content">'+
				'<div id="doSearch" style="text-align: center;">'+
					'按关键词模糊查询：'+
					'<input type="text" id="inTableSearch" value="">'+
					'<input type="submit" onclick="query_table_list()" value="查询">'+
				'<\/div>'+
				'<table class="table1" border="1px" style="background-color: #fff;text-align: center;">'+
					'<tr>'+
						'<td style="width: 6%;">编号<\/td>'+
						'<td style="width: 10%;">开发企业名称<\/td>'+
						'<td style="width: 10%;">项目名称<\/td>'+
						'<td style="width: 10%;">资质证书号<\/td>'+
						'<td style="width: 10%;">发证日期<\/td>'+
						'<td style="width: 10%;">操作<\/td>'+
					'<\/tr>'+
				'<\/table>'+
				'<div class="page"><span id="spanFirst1">首页</span> <span id="spanPre1">上一页</span>第<span id="spanPageNum1"></span>页/共<span id="spanTotalPage1"></span>页<span id="spanNext1">下一页</span> <span id="spanLast1">尾页</span>共<span id="pageCount1"></span>条</div>'+
				'<table class="table2" border="1px" style="background-color: #fff;text-align: center;display: none;">'+
					'<tr>'+
						'<td style="width: 6%;">许可证编号<\/td>'+
						'<td style="width: 10%;">建设单位<\/td>'+
						'<td style="width: 10%;">工程项目名称<\/td>'+
						'<td style="width: 10%;">发证日期<\/td>'+
						'<td style="width: 10%;">操作<\/td>'+
					'<\/tr>'+
				'<\/table>'+
				'<div class="page" style="display: none;"><span id="spanFirst2">首页</span> <span id="spanPre2">上一页</span>第<span id="spanPageNum2"></span>页/共<span id="spanTotalPage2"></span>页<span id="spanNext2">下一页</span> <span id="spanLast2">尾页</span>共<span id="pageCount2"></span>条</div>'+
				'<table class="table3" border="1px" style="background-color: #fff;text-align: center;display: none;">'+
					'<tr>'+
						'<td style="width: 6%;">备案编号<\/td>'+
						'<td style="width: 10%;">建设单位名称<\/td>'+
						'<td style="width: 10%;">工程名称<\/td>'+
						'<td style="width: 10%;">工程规模<\/td>'+
						'<td style="width: 10%;">备案日期<\/td>'+
						'<td style="width: 10%;">操作<\/td>'+
					'<\/tr>'+
				'<\/table>'+
				'<div class="page" style="display: none;"><span id="spanFirst3">首页</span> <span id="spanPre3">上一页</span>第<span id="spanPageNum3"></span>页/共<span id="spanTotalPage3"></span>页<span id="spanNext3">下一页</span> <span id="spanLast3">尾页</span>共<span id="pageCount3"></span>条</div>'+
			'<\/div>'+
		'<\/div>';
    //判断页面是否已经有该嵌入的元素，如果有就不再嵌入
    if($("#KeFuDiv").length <= 0){
       $("body").append(html);
    }
    //把拖动方法追加到页面（因为不知为什么引不进这个js，而且博客园上传也被删了，无奈）
    var float_script = "<script>var isIE = \/msie\/i.test(navigator.userAgent);function gID(id) {return document.getElementById(id);};function ScrollDiv(id, pScrollY) {var ScrollY = document.documentElement.scrollTop || document.body.scrollTop;if (pScrollY == null) {pScrollY = 0;};var moveTop = .1 * (ScrollY - pScrollY);moveTop = (moveTop > 0) ? Math.ceil(moveTop) : Math.floor(moveTop);gID(id).style.top = parseInt(gID(id).style.top) + moveTop + \"px\";pScrollY = pScrollY + moveTop;setTimeout(\"ScrollDiv('\" + id + \"',\" + pScrollY + \");\", 50);};function addObjEvent(obj, eventName, eventFunc) {if (obj.attachEvent) {obj.attachEvent(eventName, eventFunc);} else if (obj.addEventListener) {var eventName2 = eventName.toString().replace(\/on(.*)\/i, '$1');obj.addEventListener(eventName2, eventFunc, false);} else {obj[eventName] = eventFunc;};};function delObjEvent(obj, eventName, eventFunc) {if (obj.detachEvent) {obj.detachEvent(eventName, eventFunc);} else if (obj.removeEventListener) {var eventName2 = eventName.toString().replace(\/on(.*)\/i, '$1');obj.removeEventListener(eventName2, eventFunc, false);} else {obj[eventName] = null;};};function MoveDiv(obj, e) {e = e || window.event;var ie6 = isIE;if (\/msie 9\/i.test(navigator.userAgent)) {ie6 = false;};if (ie6 && e.button == 1 || !ie6 && e.button == 0) {} else {return false;};obj.style.position = 'absolute';obj.ondragstart = function() {return false;};var x = e.screenX - obj.offsetLeft;var y = e.screenY - obj.offsetTop;addObjEvent(document, 'onmousemove', moving);addObjEvent(document, 'onmouseup', endMov);e.cancelBubble = true;if (isIE) {obj.setCapture();} else {window.captureEvents(Event.mousemove);};if (e.preventDefault) {e.preventDefault();e.stopPropagation();};e.returnValue = false;return false;function moving(e) {obj.style.left = (e.screenX - x) + 'px';obj.style.top = (e.screenY - y) + 'px';return false;};function endMov(e) {delObjEvent(document, 'onmousemove', moving);delObjEvent(document, 'onmouseup', arguments.callee);if (isIE) {obj.releaseCapture();} else {window.releaseEvents(Event.mousemove);};};};<\/script>";
	$('body').append(float_script);

    //获取表格点击的数据，并填入页面内
    var get_tr_script = "<script>"+
			"function fill_in_click(obj){var tr =$(obj).parent().parent();var id = tr.attr(\"id\");var type = tr.attr(\"type\");$.ajax({url: 'http://192.168.52.19:8077/ztfx_war_exploded/a/api/dataView/get?id=' + id + '&type=' + type,async: false,method: 'get',dataType: 'json',cache: false,success: function(result) {console.log(result);}})}"+
			"function view_from_click(obj,idx){var tr =$(obj).parent().parent();var remarks = tr.find('.remarks').html();console.log('remarks:::'+remarks);id = remarks.substring(6);var baseUrl = 'http://api.qyzysoft.com/qyjs/ljb/home/view/list';var surl =baseUrl + '/' + idx + '/' + id + '.html';window.open(surl);}"+
			"<\/script>";
	$('body').append(get_tr_script);

    //列表工具栏，点击伸缩效果
	var table_close_script = "<script>$('#closeTable').click(function() {$('#KeFuDiv .content').toggle();})<\/script>"
    $('body').append(table_close_script);

    //列表工具栏，点击切换tab
	var title_change_script = "<script>$(function() {$('.title a').click(function() {var idx = $(this).index();$('.title a').css('background','white');$('.title a').eq(idx).css('background','gainsboro');"+
	"$('.content .table'+(idx+1)).show().siblings('table').hide();"+
	"$('.content .page').eq(idx).show().siblings('.page').hide();"+
	"})})<\/script>"
	$('body').append(title_change_script);

	//初始化分页
	var init_page_func = "<script>var pageCount1,pageSize1,page1,pageCount2,pageSize2,page2,pageCount3,pageSize3,page3;"+
		"function init(num, size, count,type) {window['pageCount'+ type]= count;window['pageSize'+type] = size;window['page'+type] = num;" +
		        "$('#spanTotalPage'+type).html(window['pageCount'+type] % window['pageSize'+type] == 0 ? parseInt(window['pageCount'+type] / window['pageSize'+type]) : Math.ceil(window['pageCount'+type] / window['pageSize'+type]));" +
		        "$('#spanPageNum'+type).html(window['page'+type]);" +
		        "$('#pageCount'+type).html(window['pageCount'+type]);" +
		        "if (num == 1) {if(count!=0&&num == (count % size == 0 ? parseInt(count / size) : Math.ceil(count / size))){preText($('#spanPre'+type),type);firstText($('#spanFirst'+type),type);nextText($('#spanNext'+type),type);lastText($('#spanLast'+type),type);} else if(count==0){preText($('#spanPre'+type),type);firstText($('#spanFirst'+type),type);nextText($('#spanNext'+type),type);lastText($('#spanLast'+type),type);}else {nextLink($('#spanNext'+type),type);lastLink($('#spanLast'+type),type);}" +
		        "} else if (num == (count % size == 0 ? parseInt(count / size) : Math.ceil(count / size))) {preLink($('#spanPre'+type),type);nextText($('#spanNext'+type),type);firstLink($('#spanFirst'+type),type);lastText($('#spanLast'+type),type);" +
		        "} else {preLink($('#spanPre'+type),type);firstLink($('#spanFirst'+type),type);nextLink($('#spanNext'+type),type);lastLink($('#spanLast'+type),type);};};"+
		"<\/script>";
	$('body').append(init_page_func);

	//分页按钮方法
	var page_func = "<script>function next(type) {currentRow = window['pageSize'+type] * window['page'+type];maxRow = currentRow + window['pageSize'+type];if (maxRow > window['pageCount'+type]) maxRow = window['pageCount'+type];window['page'+type]++;if (maxRow == window['pageCount'+type]) {nextText($('#spanNext'+type),type);lastText($('#spanLast'+type),type);}$('#spanPageNum'+type).html(window['page'+type]);preLink($('#spanPre'+type),type);firstLink($('#spanFirst'+type),type);go_page(type);};" +
        "function pre(type) {window['page'+type]--;currentRow =window['pageSize'+type] * window['page'+type];maxRow = currentRow - window['pageSize'+type];if (currentRow > window['pageCount'+type]) currentRow = window['pageCount'+type];if (maxRow == 0) {preText($('#spanPre'+type),type);firstText($('#spanFirst'+type),type);}$('#spanPageNum'+type).html(window['page'+type]);nextLink($('#spanNext'+type),type);lastLink($('#spanLast'+type),type);go_page(type);};" +
        "function first(type) {window['page'+type] = 1;$('#spanPageNum'+type).html(window['page'+type]);preText($('#spanPre'+type),type);firstText($('#spanFirst'+type),type);nextLink($('#spanNext'+type),type);lastLink($('#spanLast'+type),type);go_page(type);};" +
        "function last(type) {var count = 0;if (window['pageCount'+type] % window['pageSize'+type] != 0) count = 1;window['page'+type] = parseInt(window['pageCount'+type] / window['pageSize'+type]) + count;currentRow = window['pageSize'+type] * (window['page'+type] - 1);$('#spanPageNum'+type).html(window['page'+type]);preLink($('#spanPre'+type),type);nextText($('#spanNext'+type),type);firstLink($('#spanFirst'+type),type);lastText($('#spanLast'+type),type);go_page(type);};" +
        "function preLink(span,type) {span.html(\"<a href='javascript:pre(\"+type+\");'>上一页</a>\");};function preText(span,type) {span.html(\"上一页\");};function nextLink(span,type) {span.html(\"<a href='javascript:next(\"+type+\");'>下一页</a>\");};function nextText(span,type) {span.html(\"下一页\");};function firstLink(span,type) {span.html(\"<a href='javascript:first(\"+type+\");'>首页</a>\");};function firstText(span,type) {span.html(\"首页\");};function lastLink(span,type) {span.html(\"<a href='javascript:last(\"+type+\");'>尾页</a>\");};function lastText(span,type) {span.html(\"尾页\");};" +
        "function go_page(type){var searchStr = $('#inTableSearch').val();if(type==1){getList1(searchStr,page1);} else if(type==2){getList2(searchStr,page2);} else if(type==3){getList3(searchStr,page3);};};<\/script>";
	$('body').append(page_func);

    //获取'商品房预售许可证信息'列表并追加到列表
    var get_list1_ajax = "<script>function getList1(key,page_No) {"+
			"if (typeof(page_No) == \"undefined\"){page_No=1;} "+
			"$('#KeFuDiv .table1 tbody > tr').not(':eq(0)').remove();"+
			"$.ajax({url: 'http://192.168.50.221:8088/a/api/dataView/list?type=商品房预售许可证信息&key='+key+'&pageNo='+page_No,async: false,method: 'get',dataType: 'json',cache: false,"+
			// "$.ajax({url: 'http://192.168.52.19:8077/ztfx_war_exploded/a/api/dataView/list?type=商品房预售许可证信息&key='+key+'&pageNo='+page_No,async: false,method: 'get',dataType: 'json',cache: false,"+
				"success: function(result) {"+
					"var data = result.data;"+
					"for (let i = 0; i < data.list.length; i++) {"+
						"let zzzsm = data.list[i].zzzsm;"+
						"if(zzzsm==null){zzzsm='';}"+
						"let tr = \"<tr id='\" +data.list[i].id +\"' type ='商品房预售许可证信息' ><td class='bh'>\" + data.list[i].bh + \"</td><td class='kfqy'>\" + data.list[i].kfqy + \"</td>\" +\"<td class='gcxm'>\" + data.list[i].gcxm + \"</td><td class='zzzsm'>\" + zzzsm +\"</td><td class='fzrq'>\" + data.list[i].fzrq + \"</td><td class='remarks' hidden>\"+data.list[i].remarks+\"</td>\" +\"<td><button onclick='view_from_click(this,0)'>查看</button><button onclick='fill_in_click(this)'>填写</button></td></tr>\";"+
						"$('#KeFuDiv .table1').append(tr);"+
					"}init(data.pageNo, data.pageSize, data.count, 1);"+
				"}})}<\/script>";
    $('body').append(get_list1_ajax);

    //获取'建筑工程施工许可证信息'列表并追加到列表
    var get_list2_ajax = "<script>function getList2(key,page_No) {"+
		"if (typeof(page_No) == \"undefined\"){page_No=1;} "+
		"$('#KeFuDiv .table2 tbody > tr').not(':eq(0)').remove();"+
		"$.ajax({url: 'http://192.168.50.221:8088/a/api/dataView/list?type=建筑工程施工许可证信息&key=' + key+'&pageNo='+page_No,async: false,method: 'get',dataType: 'json',cache: false,"+
		// "$.ajax({url: 'http://192.168.52.19:8077/ztfx_war_exploded/a/api/dataView/list?type=建筑工程施工许可证信息&key=' + key+'&pageNo='+page_No,async: false,method: 'get',dataType: 'json',cache: false,"+
			"success: function(result) {"+
				"var data = result.data;"+
				"for (let i = 0; i < data.list.length; i++) {"+
					"let tr = \"<tr id='\" +data.list[i].id +\"'><td class='bh'>\"+data.list[i].bh+\"</td><td class='jsdw'>\"+data.list[i].jsdw+\"</td><td class='gcxm'>\"+data.list[i].gcxm+\"</td><td class='fzrq'>\"+data.list[i].fzrq+\"</td><td class='remarks' hidden>\"+data.list[i].remarks+\"</td><td><button onclick='view_from_click(this,1)'>查看</button><button onclick='fill_in_click(this)'>填写</button></td></tr>\";"+
					"$('#KeFuDiv .table2').append(tr);"+
				"}init(1, 10, 0, 2);"+
			"}})}<\/script>";
    $('body').append(get_list2_ajax);

    //获取'工程竣工验收备案信息'列表并追加到列表
    var get_list3_ajax = "<script>function getList3(key,page_No) {"+
		"if (typeof(page_No) == \"undefined\"){page_No=1;} "+
		"$('#KeFuDiv .table3 tbody > tr').not(':eq(0)').remove();"+
		"$.ajax({url: 'http://192.168.50.221:8088/a/api/dataView/list?type=工程竣工验收备案信息&key=' + key+'&pageNo='+page_No,async: false,method: 'get',dataType: 'json',cache: false,success: function(result) {"+
		// "$.ajax({url: 'http://192.168.52.19:8077/ztfx_war_exploded/a/api/dataView/list?type=工程竣工验收备案信息&key=' + key+'&pageNo='+page_No,async: false,method: 'get',dataType: 'json',cache: false,success: function(result) {"+
				"var data = result.data;"+
				"for (let i = 0; i < data.list.length; i++) {"+
						"let barq = data.list[i].barq;"+
						"let gcgm = data.list[i].gcgm;"+
						"if(barq==null){barq='';};"+
						"if(gcgm==null){gcgm='';};"+
					    "let tr = \"<tr id='\" +data.list[i].id +\"'><td class='bh'>\" + data.list[i].bh + \"</td><td class='jsdw'>\" + data.list[i].jsdw + \"</td>\" +\"<td class='gcxm'>\" + data.list[i].gcxm + \"</td><td class='gcgm'>\" + gcgm +\"</td><td class='barq'>\" + barq + \"</td>\" +\"<td class='remarks' hidden>\" + data.list[i].remarks + \"</td>\" +\"<td><button onclick='view_from_click(this,2)'>查看</button><button onclick='fill_in_click(this)'>填写</button></td></tr>\";"+
					"$('#KeFuDiv .table3').append(tr);"+
				"}init(data.pageNo, data.pageSize, data.count, 3);"+
			"}})}<\/script>";
    $('body').append(get_list3_ajax);

	//查询功能
	var query_table_func = "<script> function query_table_list(){"+
			"var key = $('#inTableSearch').val();"+
			"console.log('key:::'+key);"+
			"if($('#KeFuDiv .title div:nth-child(2) a:nth-child(1)').attr('style').indexOf('gainsboro') != (-1)){getList1(key,page1)} else if($('#KeFuDiv .title div:nth-child(2) a:nth-child(2)').attr('style').indexOf('gainsboro') != (-1)){getList2(key,page2)} else if($('#KeFuDiv .title div:nth-child(2) a:nth-child(3)').attr('style').indexOf('gainsboro') != (-1)){getList3(key,page3);};"+
			"};<\/script>";
	$('body').append(query_table_func);

	//调用获取列表的方法，初始化列表
	$('body').append("<script>getList1('',1); getList2('',1);getList3('',1); <\/script>");











})();


