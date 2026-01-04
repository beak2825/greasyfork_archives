// ==UserScript==
// @name        IDBI_MINI
// @namespace    http://tampermonkey.net/
// @version      2025-03-33
// @description  IDBI_MINI!
// @author       You
// @match        https://inet.idbibank.co.in/ret/Finacle;jsessionid*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idbibank.co.in
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530808/IDBI_MINI.user.js
// @updateURL https://update.greasyfork.org/scripts/530808/IDBI_MINI.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var titleSpan = null;
    var goButton = null;
	var titleSpanIntervalID = null;
    var ccButton = null;
    var startFlag = false;
	var channelName = null;
 
	addElement();
 
	setInterval(function(){
		let closeIcon = document.getElementById("closeIcon")
		var channelNameVal = GM_getValue("cc_ww_code_value");
		if(""!=channelNameVal){
			channelName = channelNameVal;
		}else{
			channelName = document.getElementById('cc_ww_code').value
		}
		var _startFlag = GM_getValue("cc_start_flag");
		if(_startFlag && null!=channelName){
			let mini = document.getElementById("PageConfigurationMaster_RACUUIW__1:VIEW_MINI_STATEMENT[0]3");
            let blockLength = document.querySelectorAll("div[class='blockUI']").length;
			if(null ==closeIcon && mini && blockLength == 0 ){
				mini.click();
                setTimeout(function(){
                    closeIcon = document.getElementById("closeIcon")
                    if(closeIcon){
                        closeIcon.click();
                    }
                },2000)
			}else{
                if(closeIcon){
                    closeIcon.click();
                }
			}
		}
	}, 5000);
 
	function addElement(){
		GM_addElement(document.getElementById("wrapper1_New"), 'input', {
        id: 'cc_ww_code',type:"text"
		});
		GM_addElement(document.getElementById("wrapper1_New"), 'input', {
			id: 'cc_ww_btn',type:"button",class:"styled",value:"start"
		});
		var button = document.getElementById('cc_ww_btn');
		var channelInput = document.getElementById('cc_ww_code');
		if(channelInput){
			var channelNameVal = GM_getValue("cc_ww_code_value","");
			if(""!=channelNameVal){
				channelInput.value = channelNameVal;
			}
		}
		button.onclick = function() {
			var _channelName = document.getElementById('cc_ww_code').value.trim()
			var ccBtn = document.getElementById('cc_ww_btn')
			if(''==_channelName){
			 alert('请先输入渠道名称！');
			}else{
				channelName = _channelName;
				if("Close"==ccBtn.value){
					ccBtn.value="Start";
					ccBtn.setAttribute('style', 'background-color: green;');
					startFlag = false;
					GM_setValue("cc_start_flag",startFlag);
				}else{
					GM_setValue("cc_ww_code_value",channelName);
					ccBtn.value="Close";
					ccBtn.setAttribute('style', 'background-color: red;');
					startFlag = true;
					GM_setValue("cc_start_flag",startFlag);
				}
			}
		}
	}
 
	const originOpen = XMLHttpRequest.prototype.open;
	const parser = new DOMParser();
    XMLHttpRequest.prototype.open = function (_, url) {
        if (url.startsWith("FinacleRiaRequest;jsessionid")) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    const doc = parser.parseFromString(this.responseText, "text/html");
                    var rows = doc.querySelectorAll("table tbody tr");
                    if(rows && rows.length>0){
                        var dataArray = parseData(rows)
                        console.log('2->',dataArray);
						if(dataArray.length>0){
							commitData(dataArray);
						}
                    }
                }
            });
        }
        originOpen.apply(this, arguments);
    };
 
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
                var desc = record[1];
                var tradeType = record[2];
                var amount = record[3];
                if (desc.startsWith('UPI') && 'CR' === tradeType && amount) {
                    item['amount'] = record[3];
                    item['remark'] = JSON.stringify(record);
                    var descArray = desc.split('/');
                    item['bankType'] = 'IDBI';
                    item['utrNo'] = descArray[1];
                    dataList.push(item);
                }else if('DR' === tradeType && amount){
                    amount = amount.replaceAll(",","");
                    var parsedNegative = 0-amount;
                    item['amount'] = parsedNegative;
                    item['remark'] = JSON.stringify(record);
                    item['utrNo'] = desc;
                    item['bankType'] = 'IDBI';
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