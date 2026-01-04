// ==UserScript==
// @name         动漫花园自动生成磁力链合集
// @namespace    http://mooninsky.net/
// @version      1.2
// @description  可以按照输入的条件（主要是条目名的正则匹配）来批量获取磁链并且一次性进入剪贴板，方便自动下载全集。内容较多时需要耐心等待 .
// @author       shinemoon
// @match        https://www.dongmanhuayuan.com/*
// @grant 		  GM_setClipboard
// @grant    	  GM_addStyle
// @grant    	  GM_setValue
// @grant    	  GM_getValue
// @require 	 https://cdn.bootcss.com/jquery/3.4.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382567/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%A3%81%E5%8A%9B%E9%93%BE%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/382567/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%A3%81%E5%8A%9B%E9%93%BE%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==
// 翻页selector
var plistkey = GM_getValue("listkey",  ".uk-pagination:first a:not(:contains('页'))");
// 条目selector
var itemkey= GM_getValue("itemkey", ".uk-grid .down_txt a");
// 磁力链selector
var magkey= GM_getValue("magkey", "#magnet_one:first");
// 选择细则
var matchReg = GM_getValue("regkey", "简体");

var linklist  = [];
var maglist = [];

// Fetch magnet link (iterate)
function getMag(llst, func){
	if(llst.length==0){
		console.log("Finish all sub pages");
		func();
		return 0;
	} else {
		var clink = llst.pop();
		$.get(clink, function(data){
			var curcontent = $(data);
			var curlink = curcontent.find(magkey);
			curcontent = null;
			maglist.push(curlink[0].defaultValue);
			return getMag(llst, func);
		});
	}
}

// Fetch each page's list
function fetchLinks(plst, func){
	if(plst.length==0){
		console.log("Returned from Parser");
		func();
		return 0;
	} else {
		var clink = plst.pop();
		$.get(clink,function(data){
			var curcontent = $(data);
			var curlinks = curcontent.find(itemkey)
			curcontent = null ;
			console.log(curlinks);
			$.each(curlinks, function (i,v){
				// Check if match the need
				let regex = new RegExp(matchReg);
				if( regex.test($(v).attr('title'))){
					linklist.push(v);
					console.log($(v).attr('title'));
				};
			})
			return fetchLinks(plst , func);
		});

	}
}

// the guts of this userscript
function main() {
	// Style
	GM_addStyle("button { width:100px;height:30px;cursor:pointer; background:#183693; color:white; border-radius:3px; position:fixed; right:10px; }");
	GM_addStyle("button:hover {background:#2846a3;}");
	GM_addStyle("button#trigger { top:5px; }");
	GM_addStyle("button#trigger.ongoing { background:darkgrey;color:#dddddd;cursor:default; }");
	GM_addStyle("button#toggle{ top:35px;background:#3866a3; }");
	GM_addStyle(".config-input { margin-top:5px;width:100%;text-align:center; }");
	GM_addStyle(".config-input input { width:90%; text-align:center; }");
	GM_addStyle("#config-panel .button { width:45px;height:20px;font-size:0.8em;cursor:pointer; background:#1e87f0; color:white; border-radius:3px;margin-top:20px;margin-bottom:20px; float:right;margin-right:5px; }");

	// Insert the button
	$('body').append("<button id='trigger'>获取集合</button>");
	$('body').append("<button id='toggle'>脚本设置</button>");
	$('body').append("<div id='config-panel' style='display:none;width:30%;top:30%; left:35%;position:fixed;background:#eeeeee;padding:10px;text-align:center;border-radius:8px;box-shadow:grey 1px 1px 8px;cursor:pointer;'></div>");
	$('#config-panel').append("<div class='config-input' >筛选内容</div>");
	$('#config-panel').append("<div class='config-input'  >"+"<input id='ckey' type='text'></input>"+"</div>");
	$('#config-panel').append("<div class='config-input' >翻页选择</div>");
	$('#config-panel').append("<div class='config-input'  >"+"<input id='pkey' type='text'></input>"+"</div>");
	$('#config-panel').append("<div class='config-input' >条目选择</div>");
	$('#config-panel').append("<div class='config-input'  >"+"<input id='ikey' type='text'></input>"+"</div>");
	$('#config-panel').append("<div class='config-input' >磁力选择</div>");
	$('#config-panel').append("<div class='config-input'  >"+"<input id='mkey' type='text'></input>"+"</div>");
	$('#config-panel').append("<div class='button' id='config' style='background:#32d296'>修改</button>");
	$('#config-panel').append("<div class='button' id='reset'>重置</button>");
	$('#config-panel').append("<div class='button' id='hide'>关闭</button>");

	$('#ckey').val(matchReg);
	$('#pkey').val(plistkey);
	$('#ikey').val(itemkey);
	$('#mkey').val(magkey);

	$('#reset').click(function(){
		if(confirm("确认重置设置？")) {
			$('#ckey').val(matchReg);
			$('#pkey').val(".uk-pagination:first a:not(:contains('页'))");
			$('#ikey').val(".uk-grid .down_txt a");
			$('#mkey').val("#magnet_one:first");


			GM_setValue("listkey",  ".uk-pagination:first a:not(:contains('页'))");
			GM_setValue("itemkey", ".uk-grid .down_txt a");
			GM_setValue("magkey", "#magnet_one:first");
			GM_setValue("regkey", matchReg);
			$('#config-panel').hide();
		 }

	});

	$('#config').click(function(){
		if(confirm("确认保存设置？")) {
			GM_setValue("listkey", $('#pkey').val() );
			GM_setValue("itemkey", $('#ikey').val());
			GM_setValue("magkey", $('#mkey').val());
			GM_setValue("regkey", $('#ckey').val());
			plistkey = GM_getValue("listkey",  ".uk-pagination:first a:not(:contains('页'))");
			itemkey= GM_getValue("itemkey", ".uk-grid .down_txt a");
			magkey= GM_getValue("magkey", "#magnet_one:first");
			matchReg = $('#ckey').val();
			$('#config-panel').hide();
		 }
	});

	$('#toggle').click(function(){
		$('#config-panel').toggle();
	});

	$('#hide').click(function(){
		$('#config-panel').hide();
	});

	$('#trigger').click(function(){
		$('#trigger').addClass('ongoing');
		$('#trigger').attr('disabled', true);
		// Get the reg input
		// Get the Pages
		var plist = [window.location.pathname];
		var fplist = $(plistkey);
		$.each(fplist, function(v,i){
			plist.push($(i).attr('href'));
			//console.log(i); //Page Print
		});
		fetchLinks(plist, function(){
			//		console.info(linklist);
			console.info("Fetch Done!");
			// Need to fetch the page's info (magnet)
			var pcontent = "";
			getMag(linklist, function(){
				// Load into paste board
				$.each(maglist, function (i, v){
					pcontent = pcontent+v+"\n";
				});
				//window.clipboardData.setData('text',pcontent);
				GM_setClipboard(pcontent);
				alert("所有磁力链接已经复制完成！共 "+maglist.length+ "条记录。");
				$('#trigger').removeClass('ongoing');
				$('#trigger').attr('disabled',false);
			});
		});
		// Content List
		//var linklist = $('.uk-grid a');
		//
	});
}

// load jQuery and execute the main function
main();
