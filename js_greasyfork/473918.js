// ==UserScript==
// @name 			选股宝盯盘辅助【对题材进行颜色标注】
// @name:zh-CN	选股宝盯盘辅助【对题材进行颜色标注】
// @name:zh-TW	選股寶盯盤輔助【對題材進行顏色標註】
// @namespace    http://tampermonkey.net/
// @version      	1.0.4
// @description  	选股宝行情页面，通过颜色对不同题材股票进行分类，便于盘中发现热点
// @description:zh-CN  选股宝行情页面，通过颜色对不同题材股票进行分类，便于盘中发现热点
// @description:zh-TW  選股寶行情頁面，通過顏色對不同題材股票進行分類，便於盤中發現熱點
// @author       	自在随心
// @require     	 	https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.js
// @match        *://xuangutong.com.cn/dingpan
// @icon         data:image/jpeg;base64,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
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/473918/%E9%81%B8%E8%82%A1%E5%AF%B6%E7%9B%AF%E7%9B%A4%E8%BC%94%E5%8A%A9%E3%80%90%E5%B0%8D%E9%A1%8C%E6%9D%90%E9%80%B2%E8%A1%8C%E9%A1%8F%E8%89%B2%E6%A8%99%E8%A8%BB%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/473918/%E9%81%B8%E8%82%A1%E5%AF%B6%E7%9B%AF%E7%9B%A4%E8%BC%94%E5%8A%A9%E3%80%90%E5%B0%8D%E9%A1%8C%E6%9D%90%E9%80%B2%E8%A1%8C%E9%A1%8F%E8%89%B2%E6%A8%99%E8%A8%BB%E3%80%91.meta.js
// ==/UserScript==


var blockColors = new Map();
const opacityStr="33"; // 不透明度20%
const whiteColor= "#ffffff00";
//blockColors.set("其他", "#000000" + opacityStr);		//其他设置为灰色，透明20%

// $(function(){
	// appendItem();
	// setInterval(flush, 2000);
// });

function appendItem() {
	$items = $(".ban-table-tab-items")
	if ($items.length == 0) {
		setTimeout(appendItem,1000);
	} else {
		$items.after("<div class=\"ban-table-tab-toolbar\">\
		<select id = \"block\">\
		</select>\
		<input id=\"color\" 	type=\"color\" />\
		<button id=\"addColor\">添加</button>\
		<button id=\"resetColor\">删除</button>\
		</div>");
		$("#addColor").click(addColor);
		$("#resetColor").click(resetColor);
		$(".ban-table-tab-item").click(function(){	//切换时，可以迅速刷色
			setTimeout(flush,100);
			setTimeout(flush,300);
			setTimeout(flush,500);
			});
	}

}

function flush() {
	flushSelect();
	flushTable();
}

function addColor() {
	var block = $("#block").val();
	var color = $("#color").val();

	blockColors.set(block,  color + opacityStr);
	flush();
}

function resetColor() {
	var block = $("#block").val();
	blockColors.delete(block);
	flush();
}



//统计板块名称出现次数，填充下拉列表
//按频率排序，频率越高出现在最顶端
function flushSelect(){
	//console.log("--------刷新板块列表--------");
	const map = new Map();
	$("table tr").each(function(){
		$tr=$(this);
		$plate=$(".stock-reason-plate-name", $tr);
		$stock=$(".stock-title-name", $tr);
		$plate.each(function(){
			var p = $(this).text();
			if (map.has(p)) {
				map.set(p, map.get(p) +1);
			} else {
				map.set(p,  +1);
			}
		});
	});
	var array = Array.from(map);
	array.sort(function(a,b){return b[1] - a[1]});

	let block = document.getElementById("block");
	curValue = block.value;
	block.options.length = 0;

	for (let [b, value] of array) {
		 //console.log(b + value);
		 if(!b.includes("ST")){
			 var o= new Option(b+value,b);
			 if (blockColors.has(b)){
				o.setAttribute("style","background:" + blockColors.get(b) );
			 }
			 if (curValue==b) {
				 o.setAttribute("selected", "selected");
			 }
			block.add(o);
		 }
	}
}


function flushTable(){
	//console.log("--------刷新颜色--------");

	$("table tr").each(function(){
		$tr=$(this);
		$plate=$(".stock-reason-plate-name", $tr);
		$stock=$(".stock-title-name", $tr);
		var withColor = false;
		$plate.each(function(){
			var block = $(this).text();
			if (blockColors.has(block)) {
				var color = blockColors.get(block);
				if (!withColor) {
					withColor = true;
					$tr.css("background",color);
				} else {
					$(this).css("background",color);
				}

			}
		});

		if (!withColor) {
			$tr.css("background",whiteColor);
			$plate.css("background",whiteColor);
		}

	});
}

appendItem();
setInterval(flush, 2000);