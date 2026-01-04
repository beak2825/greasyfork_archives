// ==UserScript==
// @name         SIB_MINI
// @namespace    http://tampermonkey.net/
// @version      20250520
// @description  SIB_MINI!
// @author       You
// @match        https://sibernet.southindianbank.com/corp/Finacle;jsessionid*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=southindianbank.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536076/SIB_MINI.user.js
// @updateURL https://update.greasyfork.org/scripts/536076/SIB_MINI.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var startFlag = false;
	var channelName = null;
 
	function addElement(){
		GM_addElement(document.getElementById("PgHeading"), 'input', {
        id: 'cc_ww_code',type:"text"
		});
		GM_addElement(document.getElementById("PgHeading"), 'input', {
			id: 'cc_ww_btn',type:"button",class:"styled",value:"start"
		});
		GM_addElement(document.getElementById("PgHeading"), 'input', {
        id: 'cc_ww_bal',type:"button",value:"balance"
		});
		var button = document.getElementById('cc_ww_btn');
		var channelInput = document.getElementById('cc_ww_code');
		if(channelInput){
			var channelNameVal = GM_getValue("cc_ww_code_value","");
			if(""!=channelNameVal){
				channelInput.value = channelNameVal;
				channelName = channelNameVal;
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
			var ccBtn = document.getElementById('cc_ww_btn')
			if("Close"==ccBtn.value){
				ccBtn.value="Start";
				ccBtn.setAttribute('style', 'background-color: green;');
				startFlag = false;
				GM_setValue("cc_start_flag",startFlag);
			}else{
				if(''==_channelName){
					alert('请先输入渠道名称！');
				}else{
					channelName = _channelName;
					GM_setValue("cc_ww_code_value",channelName);
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
		if(startFlag && document.getElementById("transactions1")
           && document.querySelector("#transactions1").classList.contains("active") &&!mini_load){
		   GM_setValue("cc_mini_load",true);
           document.querySelector("input[name='Action.SEARCH']").click();
		}
	}, 1000);
 
 
	function getPageData(){
		var tableDiv = document.getElementById("txnHistoryList");
		if(tableDiv){
			GM_setValue("cc_mini_load",false);
			var rows = document.querySelectorAll("#txnHistoryList> tbody tr");
			 if(rows && rows.length>0){
				var dataArray = parseData(rows)
				if(dataArray.length>0){
					//console.log('1',dataArray);
					var balBtn = document.getElementById('cc_ww_bal')
					balBtn.setAttribute('style', 'background-color: #FFFFFF;');
					balBtn.value=dataArray[0][5];
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
                var tradeType = record[4];
                var desc = record[2];
                var amount = record[3];
                if (desc.startsWith('UPI') && 'Cr.' === tradeType && amount) {
                    item['amount'] = amount;
                    item['remark'] = JSON.stringify(record);
                    var descArray = desc.split('/');
                    item['bankType'] = 'SIB';
					item['utrNo'] = descArray[2];
					let orderNo = descArray[4];
					if(orderNo && orderNo.length>=4 && orderNo.length<=8){
						item['orderNo'] = orderNo;
					}
                    dataList.push(item);
                }else if('Dr.' === tradeType && amount){
                    amount = amount.replaceAll(",","");
                    var parsedNegative = 0-amount;
                    item['amount'] = parsedNegative;
                    item['remark'] = JSON.stringify(record);
                    item['utrNo'] = desc;
                    item['bankType'] = 'SIB';
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
 
    // Your code here...
})();