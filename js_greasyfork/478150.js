// ==UserScript==
// @name         WoDEnhancement
// @namespace https://greasyfork.org/scripts/478150
// @version      1.0
// @description  Refine WoD Page!
// @author       iClaud
// @license      MIT
// @match        *://*.world-of-dungeons.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant		 GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478150/WoDEnhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/478150/WoDEnhancement.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let url=window.location.href;
	/*
		Refine the wod page view  - Claud
	*/
	/* Define Item */
	let rightPanel = "#gadgettable-right ";
	let rightPanelGadgets = "#gadgettable-right-gadgets ";
	let user=$('.hero_short tr:nth-child(1) td:nth-child(1) a:nth-child(3)').text();
	// Your code here...
	console.log("Hello WoD");
	// Style
	// Tutorial
	GM_addStyle("div.tutorial {max-width:100%!important; min-height:100px!important;font-size:12px; font-style:normal!important;border:1px dotted grey;background-color:#e7d5c72e;color:#666;}");
	GM_addStyle("img.tutorial {display:none!important;}");

	// Gadget
	// Right
	GM_addStyle(rightPanel+"{min-width:200px;text-align:left;line-height:1.2em;padding-left:10px;padding-right:10px;}");
	GM_addStyle(rightPanelGadgets+"{margin-top:50px;font-size:11px;}");
	GM_addStyle(rightPanelGadgets+".gadget {margin-top:0px;}");
	GM_addStyle(rightPanelGadgets+".gadget {margin-top:0px;}");
	GM_addStyle(".button {font-weight:lighter;border-color:grey;border-style:dotted;background:rgba(200,200,100,0.3);}");
	GM_addStyle("#gadgetNextdungeonTime{background:yellow;}");

	//Top
	GM_addStyle(".gadget_icon:hover {opacity:0.9;}");
	GM_addStyle("#gadgettable-center-gadgets table:nth-child(1) img:hover {}");
	GM_addStyle("#gadgettable-center-gadgets table:nth-child(2) img:hover {}");
	GM_addStyle(".world_list {text-align:center; background:lightgrey;color:black;border:1px dotted grey;padding-left:10px;padding-right:10px;font-weight:lighter;font-style:italic;}");
	GM_addStyle(".gadget.clock{background:#f3f1b8;}");
	GM_addStyle(".progressBar_container{border:0px solid grey;opacity:0.9;font-size:12px;}");
	GM_addStyle("TR.boardcon2 {background-color:white; font-size:12px;}");
	GM_addStyle("div.gadget.footer {font-size:10px;color:grey;};");
	GM_addStyle("span {font-size:12px;}");
	GM_addStyle("TR.boardhead {background-color:lightgrey;}");
	GM_addStyle("TR.boardcon1{background-color:#eee;}");
	GM_addStyle('.layout_dungeon_description{width:90%;}');
	GM_addStyle('div.happyhour.soon {background:lightgrey; color:#555;font-size:11px;}; table.content_table > * > tr.header { background-color:#e0e0e0; } ;table.content_table.mail {width:100%; font-size:11px;};table.content_table.mail a {font-size:11px; color: black;} table.content_table.mail tr.row0 {background-color: lightgrey;} .subject_standard{background-color: rgba(0,0,0,0);}; #smarttabs__details_inner>table:nth-child(1) {margin-bottom:220px; margin-top:20px;}; #smarttabs__details_inner>table:nth-child(2) {position:absolute;top:20px;right:0px;width:300px;}; #smarttabs__details_inner .boardavatar:nth-child(1) {margin-top:-10px;}; ');
	GM_addStyle(".table_hl{background:#11121214;}");

	//Left
	GM_addStyle(".menu_0_selected {font-size:11px;};");
	GM_addStyle("img[src*='inf'] {margin-left:1px;border-radius:6px;opacity:0.8;};");



	//Some css can't be applied in advanced

	if(url.indexOf("trade.php") > 0){
		$('.paginator_selected').css('font-size','11px').css('color','#eee');
		$('.paginator.clickable').css('height','16px'). css('font-size','11px').css('background','#a7d2eb');
		$('.search_details').css('font-size','11px');
		$('table.content_table > * > tr.header').css('background-color','#e0e0e0');
		$('.boardtext span').css('color','black');
	};


	//Ticker
	GM_addStyle("#gadgettable-center-gadgets .ticker {text-align:center; background:#d9a7a730;font-family:Kaiti!important;font-style:normal;}");
	GM_addStyle("#gadgettable-center-gadgets .ticker_msg {font-weight:normal!important;}");
	GM_addStyle(".ticker_label{font-style:normal!important;}");
	GM_addStyle("#gadgettable-center-gadgets .ticker:hover {opacity:0.9;}");
	GM_addStyle(".hints.content{opacity:0.9;font-size:11px;}");


	//Body
	GM_addStyle(".search_container{width:100%;}");
	GM_addStyle(".search_short.texttoken{width:100%;text-align:right;}");

	if(url.indexOf("viewtopic") < 0){
		GM_addStyle("table.content_table{width:100%;font-size:xx-small;}");
		GM_addStyle("table.content_table > * > tr > th, table.content_table > * > tr > td{border:0px solid white;}");
		GM_addStyle("table.content_table > * > tr.row0{background:#eee;}");
		GM_addStyle("table.content_table > * > tr.row1{background:#fff;}");
		GM_addStyle("table.content_table .header .clickable{font-size:10px; border-left-width:0px!important;border-right-width:0px!important;border-top-width:0px!important;border-bottom-width:0px!important;}");
		GM_addStyle("input{border:1px solid grey!important;}");
		GM_addStyle(".gadget_body p{border-bottom:1px dotted lightgrey!important; font-size:12px;padding:10px;}");
		GM_addStyle(".gadget_body p{background:#8fb8e300;};");
		GM_addStyle("body {font-family:'Microsoft Yahei'!important;}");
		GM_addStyle("td .quotebody{color:white;}");
	} else {
		//GM_addStyle(".gadget_body p{background:#8fb8e3;};");
		GM_addStyle("span{color:black!important;};");
		GM_addStyle(".table_bbcode span{color:black!important;};");
	};

	//Report
	if(url.indexOf("report.php") >= 0){
		//高亮本人战报
		$('.content_table table').css('width','100%');
		$('.rep_status_table tr:contains("'+user+'")').css('background','#b8c35070');
		$('.rep_status_table~hr~table:not(.rep_status_table) tr:contains("'+user+'")').css('color','blue').css('background','#b8c35070').css('font-size','1.4em');
		$('.rewards:contains("'+user+'")').css('background','#34b54b33');
		$('p.rep_level_success,p.rep_level_description,div.rep_dungeon_description').css('max-width','100%');
		$('p.rep_level_success,p.rep_level_description,div.rep_dungeon_description').css('font-size','14px').css('line-height','1.8em').css('color','lightblue').css('background','#333');
		$('p.rep_level_success,p.rep_level_description,div.rep_dungeon_description').css('padding-top','40px').css('padding-bottom','40px');
		//New button
		var btnstrStyle="position:fixed;bottom:20px;right:20px;background:#eee;border:1px solid #aaa;color:white;font-style:bold;background:#e4550e;border-radius:20px;text-align:center;width:40px;height:40px;font-size:18px; \
						align-items: center;    display: flex;    /* align-content: center; */    flex-wrap: nowrap;    justify-content: center; \
						cursor:pointer;"
		$('body').append("<div id='showOff' style='"+btnstrStyle+"'>S</div>")
		$('#showOff').click(function(){
			$('.rep_status_table tr:not(:contains("'+user+'"))').toggle();
			$('.rep_status_table~hr~table:not(.rep_status_table) tr:not(:contains("'+user+'"))').toggle();
			$('.rewards:not(:contains("'+user+'"))').toggle();
		});
	};
	/*
		Jumpbox Enhancement from: https://greasyfork.org/zh-CN/scripts/398732-wod-jumpbox-enhanced, great thanks!
		But it's not updated anymore , where even match field is not exact
	*/

	//get jumpboxSpan
	var jumpboxSpan = document.getElementById("jumpbox_center");

	if (jumpboxSpan){
		var addItemList = function()
		{
			var itemList = ["item", "set", "hero", "player", "skill", "npc", "post", "group", "clan", "auction", "class"],
				itemChn = ["物品", "套装", "角色", "玩家", "技能", "NPC", "帖子", "团队", "联盟", "拍卖", "职业"];
			for (var i = 0; i < itemList.length; i++)
			{
				var option = document.createElement("option");
				option.value = (itemList[i]);
				option.text = (itemChn[i]);
				jumpboxSelObj.add(option);
			}
		}
		window.jumper = function()
		{
			var jumpbox = document.querySelector('#jumpbox_center>form>input[name="link"]');
			var jumpboxValue = jumpbox.value;
			var regtest = /^\s*\[\s*([^:]+?)\s*:\s*(.+?)\s*\]\s*$/;
			console.log(jumpboxValue);
			var indicator = regtest.test(jumpboxValue);
			if (indicator)
			{
				wodlink(jumpboxValue);
			}
			else
			{
				var jumplink = "[" + jumpboxSelObj.value + ":" + jumpboxValue + "]";
				wodlink(jumplink);
			}
			jumpbox.value = "";
		};

		//edit tooltip
		document.querySelector('#jumpbox_center>form>span').setAttribute("onmouseover","return wodToolTip(this,'输入代码或名称，选择相应类型<br>然后点按搜索，查询详情<br>输入[*:*]时，自动无视类型选择<br><br>Jumpbox Enhanced By DotIN13');");

		//create jumpboxSelect
		var jumpboxSelect = document.createElement("select");
		jumpboxSelect.id = "jumpboxSelect";
		jumpboxSelect.style ="width: 70px; margin-left: 7px; padding: 1px; margin-top: 5px;";
		jumpboxSpan.parentElement.appendChild(jumpboxSelect);

		//add select options
		var jumpboxSelObj = document.getElementById("jumpboxSelect");

		addItemList();

		//reroute jumpbox Button
		var jumpboxBtn = document.querySelectorAll("#jumpbox_center>form>span>input");
		var jumpbox = document.querySelector('#jumpbox_center>form>input[name="link"]');
		jumpboxBtn[0].setAttribute("onclick", "return false;");

		$("#jumpbox_center>form>span>input").click(function(){
			window.jumper();
		});
	}


	/*
	 	[wod]耗材单价 from https://greasyfork.org/zh-CN/scripts/8896-wod-%E8%80%97%E6%9D%90%E5%8D%95%E4%BB%B7 Great thanks!
		But it's not updated anymore , where even match field is not exact
	*/

	if(url.indexOf("trade.php") >= 0){

		var goldStr = '<img alt="" src="/wod/css//skins/skin-4/images/icons/lang/cn/gold.gif" title="金币" border="0">';
		var PRICE_ATTRI_NAME = 'lggAvPrice';
		var PRICE_UNAVAILABLE = 'lggBadPrice';
		var CLASS_ROW = 'row';

		//* global vars
		var tblBody = findTBodyElement();
		var tblRowList = new Array();
		var sortBtnElement;

		//* main
		for (var i = 0; i < tblBody.rows.length; i++)
		{
			var row_i = tblBody.rows[i];
			var pricePU = genAveragePriceForConsumableGoods(row_i);
			row_i.setAttribute(PRICE_ATTRI_NAME,pricePU);
			tblRowList.push(row_i);
		}

		addSortBtn();
		// sortRowByAveragePrice(tblRowList);


		//* 找到商品列表table的<tbody>标签
		function findTBodyElement () {
			var tableList = document.getElementsByClassName('content_table');
			var saleTable = tableList[0];
			var tableBodyList = saleTable.children;
			var tblBody;
			for (var i = tableBodyList.length - 1; i >= 0; i--) {
				if (tableBodyList[i].tagName == 'TBODY') {
					tblBody = tableBodyList[i];
				}
			};
			return tblBody;
		}

		//* 给定某行物品<tr>，找到对应的耗材单价以及总价，插入平均价格，返回插入的平均价格
		function genAveragePriceForConsumableGoods (trElement) {
			var col_item = row_i.cells[1];
			var col_price = row_i.cells[3];
			var itemCountStr = col_item.innerHTML.match(/\(\d+\/\d+\)/);
			itemCountStr = itemCountStr + '';
			if (itemCountStr != 'null') {
				var itemCounts = itemCountStr.match(/\d+/);
				var itemPrice = col_price.textContent.match(/\d+/);
				if(!itemPrice){
					return PRICE_UNAVAILABLE;
				}
				var itemPricePerUse = parseFloat(itemPrice + '') / parseFloat(itemCounts + '');
				itemPricePerUse = itemPricePerUse.toFixed(2);
				// console.log('数量:' + itemCounts + ', 单价:' + itemPricePerUse + '/u');
				col_price.innerHTML = itemPricePerUse + goldStr + '/u &nbsp&nbsp&nbsp' + col_price.innerHTML;
				return itemPricePerUse;
			} else {
				return PRICE_UNAVAILABLE;
			}

		}

		//* 排序，两个row是<tr>，并且已经插入了PRICE_ATTRI_NAME属性
		function rowCompare (row1,row2) {

			var p1 = row1.getAttribute(PRICE_ATTRI_NAME);
			var p2 = row2.getAttribute(PRICE_ATTRI_NAME);
			if(p1==PRICE_UNAVAILABLE && p2==PRICE_UNAVAILABLE){
				return 0;
			} else if(p1==PRICE_UNAVAILABLE){
				return -1;
			} else if(p2==PRICE_UNAVAILABLE){
				return 1;
			}

			p1 = parseFloat(p1);
			p2 = parseFloat(p2);

			return p1 - p2;
		}

		function sortRowByAveragePrice () {
			//* 排序，重新输出
			tblRowList.sort(rowCompare);
			while (tblBody.hasChildNodes()) {
				tblBody.removeChild(tblBody.lastChild);
			}
			for (var i = 0; i<tblRowList.length;i++){
				var suffixStr = i & 1;
				tblRowList[i].setAttribute('class',CLASS_ROW+suffixStr);
				tblBody.appendChild(tblRowList[i]);
			};
		}

		function addSortBtn () {
			var tableList = document.getElementsByClassName('content_table');
			var saleTable = tableList[0];
			var tableBodyList = saleTable.children;

			var tblHead;
			for (var i = tableBodyList.length - 1; i >= 0; i--) {
				if (tableBodyList[i].tagName == 'THEAD') {
					tblHead = tableBodyList[i];
				}
			};

			var header;
			for(let i = 0;i<tblHead.children.length;i++){
				var tmp = tblHead.children[i];
				if(tmp.className=='header'){//* 这里大小写敏感
					header = tmp;
				}
			}

			var thEl = header.children[3];
			var sortBtn = document.createElement('input');
			sortBtn.setAttribute('class','button clickable');
			sortBtn.setAttribute('type','button');
			sortBtn.setAttribute('value','单价排序');
			sortBtn.addEventListener('click', function(){
				sortRowByAveragePrice();
				sortBtn.setAttribute('class','button_disabled');
				sortBtn.setAttribute('disabled','disabled');
			});
			thEl.appendChild(sortBtn);
		}
	}
})();