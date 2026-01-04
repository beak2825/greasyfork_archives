// ==UserScript==
// @name         IOB_MINI
// @namespace    http://tampermonkey.net/
// @version      2025-02-223
// @description  IOB_MINI_2025
// @author       tom
// @match        https://www.iobnet.co.in/ibanking/ibquery.do?query=lastfew
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iobnet.co.in
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527680/IOB_MINI.user.js
// @updateURL https://update.greasyfork.org/scripts/527680/IOB_MINI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addElement(document.getElementById('iobnbpage'), 'input', {
        id: 'cc_ww_btn',type:"button",class:"styled",value:"start"
    });
    GM_addElement(document.getElementById('iobnbpage'), 'input', {
        id: 'cc_ww_code',type:"text"
    });
    GM_addElement(document.getElementById('iobnbpage'), 'input', {
        id: 'cc_bal_btn',type:"button",class:"styled",value:"Balance"
    });
    var startFlag = false;
	var intervalID = null;
	var channelName = null;
	var balIntervalID = null;
    var balFlag = false;
    var button = document.getElementById('cc_ww_btn');
    var balButton = document.getElementById('cc_bal_btn');
    var channelInput = document.getElementById('cc_ww_code');
    if(channelInput){
        var channelNameVal = GM_getValue("cc_ww_code_value","");
        if(""!=channelNameVal){
            channelInput.value = channelNameVal;
        }
    }
    button.onclick = function() {
        var _channelName = document.getElementById('cc_ww_code').value.trim();
        var ccBtn = document.getElementById('cc_ww_btn');
        if(''==_channelName){
         alert('请先输入渠道名称！');
        }else{
			channelName = _channelName;
            if("Close"==ccBtn.value){
                ccBtn.value="Start";
                ccBtn.setAttribute('style', 'background-color: green;');
				startFlag = false;
				if(intervalID!=null){
					clearInterval(intervalID)
				}
            }else{
                GM_setValue("cc_ww_code_value",channelName);
                ccBtn.value="Close";
                ccBtn.setAttribute('style', 'background-color: red;');
				startFlag = true;
				doStart();
            }
        }
    }
	balButton.onclick = function(){
		var balBtn = document.getElementById('cc_bal_btn');
        var ccBtn = document.getElementById('cc_ww_btn');
		startFlag = false;
		ccBtn.value="Start";
		ccBtn.setAttribute('style', 'background-color: green;');
		if(intervalID!=null){
			clearInterval(intervalID)
		}
		balFlag = true;
		var apiKey = document.querySelector("table#lstAccounts tbody td:nth-child(2) a").getAttribute("href").match(/'([^']+)'\)$/)[1];
		getBanlanceData(apiKey);
	}

	function doStart(){
		if(!startFlag){
			return;
		}
		intervalID = setInterval(function(){
			var dialog = document.querySelector("div#lastfew");
			var loding = document.querySelector("div[aria-describedby='process']")
			if(dialog && dialog.clientWidth==0 && (!loding || loding.style.display =='none')){
				document.querySelector("table#lstAccounts tbody td:nth-child(2) a").click();
				console.log('click accountNo');
				var interval2ID = setInterval(function(){
					if(dialog.clientWidth>300){
						var rows = document.querySelectorAll("div#lastfew table.accounts-tab-table tbody tr");
						var columnData = parseData(rows);
						document.querySelector("div[aria-describedby='lastfew'] button[title='Close']").click();
						//console.log('1->',columnData);
						clearInterval(interval2ID)
						if(columnData.length>0){
							commitData(columnData);
						}
					}
				},1000)
			}else{
				if(dialog.clientWidth>300){
					var rows = document.querySelectorAll("div#lastfew table.accounts-tab-table tbody tr");
					var columnData = parseData(rows);
					document.querySelector("div[aria-describedby='lastfew'] button[title='Close']").click();
					//console.log('2->',columnData);
					if(columnData.length>0){
						commitData(columnData);
					}
				}
			}
		}, 3000);
	}
	function getBanlanceData(apiKey){
		if(!balFlag){
			return;
		}
        var ccBtn = document.getElementById('cc_ww_btn');
		balIntervalID = setInterval(function(){
			var dialog = document.querySelector("div#dialogtbl");
			var loding = document.querySelector("div[aria-describedby='process']")
			if(dialog && dialog.clientWidth==0 && (!loding || loding.style.display =='none')){
				console.log('click balance');
				getBalance(apiKey,'Reddy');
				var interval3ID = setInterval(function(){
				if(dialog.clientWidth>300){
					var rows = document.querySelectorAll("div#dialogtbl table.table tbody tr");
					var columnData = parseData(rows);
					document.querySelector("div[aria-describedby='dialogtbl'] button[title='Close']").click();
					clearInterval(interval3ID);
					if(columnData.length>0){
						document.getElementById('cc_bal_btn').value = JSON.stringify(columnData);
						clearInterval(balIntervalID);
						// console.log('1->',columnData)
						startFlag = true;
						ccBtn.value="Close";
						ccBtn.setAttribute('style', 'background-color: red;');
						balFlag = false;
						doStart();
					}}
				},1000)
			}else{
				if(dialog.clientWidth>300){
					var rows = document.querySelectorAll("div#dialogtbl table.table tbody tr");
					var columnData = parseData(rows);
					document.querySelector("div[aria-describedby='dialogtbl'] button[title='Close']").click();
					console.log('2->',columnData);
					if(columnData.length>0){
						document.getElementById('cc_bal_btn').value = JSON.stringify(columnData);
						// clearInterval(balIntervalID)
						startFlag = true;
						ccBtn.value="Close";
						ccBtn.setAttribute('style', 'background-color: red;');
						balFlag = false;
						doStart();
					}
				}
			}
		},3000)
	}
    function parseData(rows){
		var columnData = [];
		Array.from(rows).forEach(row => {
			const cells = row.getElementsByTagName('td');
			var rowData = [];
			Array.from(cells).forEach((cell, cellIndex) => {
				rowData.push(cell.innerText);
			});
			columnData.push(rowData);
		  });
		return columnData;
	}
	function commitData(dataArray){
		var dataList = [];
		for (var i = 0; i < dataArray.length; i++) {
		  var record = dataArray[i];
		  var item = {};
		  var desc = record[1];
		  var tradeType = record[2];
		  if (desc.startsWith('UPI') && 'Credit' === tradeType) {
			item['amount'] = record[3];
			item['remark'] = JSON.stringify(record);
			var descArray = desc.split('/');
			item['utr'] = descArray[1];
			item['bankType'] = 'IOB';
			item['utrNo'] = descArray[1];
			if (descArray.length > 5) {
			  item['orderNo'] = descArray[descArray.length - 1];
			}
			dataList.push(item);
		  }else if('Debit' === tradeType){
			var negativeAmount = record[3] * -1;
			item['amount'] = negativeAmount;
			item['remark'] = JSON.stringify(record);
			item['utrNo'] = descArray[1];
			item['bankType'] = 'IOB';
			dataList.push(item);
		  }
		}
		console.log('dd',dataList);
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
})();