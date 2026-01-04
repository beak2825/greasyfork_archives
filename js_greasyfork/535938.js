// ==UserScript==
// @name         NESF_MINI
// @namespace    http://tampermonkey.net/
// @version      20250524
// @description  NESF_MINI2025
// @author       You
// @match        https://netbanking.nesfb.com/ib/ministatement
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nesfb.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535938/NESF_MINI.user.js
// @updateURL https://update.greasyfork.org/scripts/535938/NESF_MINI.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var startFlag = false;
	var channelName = null;
	var cardNum = null;
		
	function addElement(){
		GM_addElement(document.getElementById("error_message"), 'input', {
        id: 'cc_ww_code',type:"text"
		});
		GM_addElement(document.getElementById("error_message"), 'input', {
			id: 'cc_ww_btn',type:"button",class:"styled",value:"start"
		});
		GM_addElement(document.getElementById("error_message"), 'input', {
        id: 'cc_ww_card',type:"text"
		});
		var button = document.getElementById('cc_ww_btn');
		var channelInput = document.getElementById('cc_ww_code');
		var cardInput = document.getElementById('cc_ww_card');
		if(channelInput){
			var channelNameVal = GM_getValue("cc_ww_code_value","");
			if(""!=channelNameVal){
				channelInput.value = channelNameVal;
				channelName = channelNameVal;
			}
			var cardVal = GM_getValue("cc_ww_card_value","");
			if(""!=cardVal){
				cardInput.value = cardVal;
				cardNum = cardVal;
			}
			var startFlagVal = GM_getValue("cc_start_flag",false);
			if(startFlagVal){
				var ccBtn = document.getElementById('cc_ww_btn')
				ccBtn.value="Close";
				ccBtn.setAttribute('style', 'background-color: red;');
				startFlag = true;
				GM_setValue("cc_start_flag",startFlag);
			}
 
		}
		button.onclick = function() {
			var _channelName = document.getElementById('cc_ww_code').value.trim()
			var _cardNum = document.getElementById('cc_ww_card').value.trim()
			var ccBtn = document.getElementById('cc_ww_btn')
			if("Close"==ccBtn.value){
				ccBtn.value="Start";
				ccBtn.setAttribute('style', 'background-color: green;');
				startFlag = false;
				GM_setValue("cc_start_flag",startFlag);
			}else{
				if(''==_channelName){
					alert('请先输入渠道名称！');
				}else if(''==_cardNum){
					alert('请先输入卡号！');
				}else{
					channelName = _channelName;
					cardNum = _cardNum;
					GM_setValue("cc_ww_code_value",channelName);
					GM_setValue("cc_ww_card_value",cardNum);
					ccBtn.value="Close";
					ccBtn.setAttribute('style', 'background-color: red;');
					startFlag = true;
					GM_setValue("cc_start_flag",startFlag);
				}
			}
		}
	}
 
	addElement();
	getPageData();
 
    setInterval(function(){
		let mini_load = GM_getValue("cc_mini_load",);
		if(startFlag &&!mini_load){
			GM_setValue("cc_mini_load",true);
			getMiniStatement(cardNum)
		}else{
			console.log('cc->',startFlag,mini_load);
		}
	}, 1000);
 
	function getPageData(){
		var tableDiv = document.getElementById("div_table");
		if(tableDiv){
			GM_setValue("cc_mini_load",false);
			var rows = document.querySelectorAll("table thead tr");
			 if(rows && rows.length>0){
				var dataArray = parseData(rows)
				//console.log('2->',dataArray);
				if(dataArray.length>0){
					commitData(dataArray);
				}
			}
		}
	}
	
 
	function parseData(rows){
		var columnData = [];
		Array.from(rows).forEach(row => {
			const cells = row.getElementsByTagName('td');
			var rowData = [];
			Array.from(cells).forEach((cell, cellIndex) => {
				let value = cell.innerText
				if(''!=value){
					value = value.replace(/\s+/g, '');
					value = value.replace('\n','');
					value = value.replace(',','');
					if(''!=value){
						rowData.push(value);
					}
				}
			});
			if(rowData.length>0){
				columnData.push(rowData);
			}
		  });
		return columnData;
	}
 
	
	function commitData(dataArray){
		var dataList = [];
		for (var i = 0; i < dataArray.length; i++) {
            if(dataArray[i].length>3){
                var record = dataArray[i];
                var item = {};
                var tradeType = record[1];
                var desc = record[2];
                var amount = record[3];
                if (desc.startsWith('UPI') && 'C' === tradeType && amount) {
                    item['amount'] = record[3];
                    item['remark'] = JSON.stringify(record);
                    var descArray = desc.split('-');
                    item['bankType'] = 'NESF';
					if(descArray.length<6){
						item['utrNo'] = descArray[descArray.length-1];
					}else{
						item['utrNo'] = descArray[descArray.length-2];
						item['orderNo'] = descArray[descArray.length-1];
					}
                    dataList.push(item);
                }else if('D' === tradeType && amount){
                    amount = amount.replaceAll(",","");
                    var parsedNegative = 0-amount;
                    item['amount'] = parsedNegative;
                    item['remark'] = JSON.stringify(record);
                    item['utrNo'] = desc;
                    item['bankType'] = 'NESF';
                    dataList.push(item);
                }
            }
		}
		console.log('dd',dataList);
        if(dataList.length>0){
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://gamerplayers.com/gold-pay/portal/crawl/batchBankUtr",
                headers: {
                    "Content-Type": "application/json",
                    "X-SERVICE-CODE": "64842531e4b0ac0d6892d31b",
                    "X-CHANNEL-NAME": channelName
                },
                data: JSON.stringify(dataList),
                onload: function(response) {
                    console.log(response.responseText);
                }
            });
         }
	}
})();