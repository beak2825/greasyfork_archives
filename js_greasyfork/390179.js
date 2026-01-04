// ==UserScript==
// @name         Damai - Stage 1
// @namespace    http://tampermonkey.net/
// @version      0.3.2 - Bham Init
// @description  try to take over the world!
// @author       Mr.FireAwayH
// @match        https://detail.damai.cn/item.htm*
// @run-at       document-end
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/390179/Damai%20-%20Stage%201.user.js
// @updateURL https://update.greasyfork.org/scripts/390179/Damai%20-%20Stage%201.meta.js
// ==/UserScript==

(function() {

	var html = JSON.parse($("#dataDefault").innerHTML);
	var objMain = html.performBases;
	var startTime = html.sellStartTimeStr;
	var id = '';
	var xiangou = '';
	var obj = '';
	var hh = '<div style="' +
		'    position: fixed;' +
		'    background-color: white;' +
		'    width: 75%;' +
		'    height: 20%;' +
		'    z-index: 999;' +
		'    left: 0;' +
		'    right: 0;' +
		'">' +
		'<h1>开票时间：'+startTime+'</h1>'+
		'    <div>' +
		''+ obj+
		'    </div>' +
		'</div>';
	for(var i = 0;i<objMain.length;i++){
		var objOne = objMain[i];
		var title = objOne.name;
		var objTwo = objOne.performs[0];
		if(id == ''){
			id= objTwo.itemId;
		}
		if(xiangou == ''){
			xiangou = objTwo.singleLimit;
		}
		console.log(""+title)
		var skuList = objTwo.skuList;
		for(var n = 0;n<skuList.length;n++){
			var priceName = skuList[n].skuName;
			var priceId = skuList[n].skuId;
			var statusStr = "("+skuList[n].skuTag+")";
			if(statusStr == "(undefined)"){
				statusStr = '';
			}
			obj +='<p>票档id：'+priceId+'_____票档名称'+priceName+statusStr+'</p>';
		}
	}
	$(body).append(hh)

});