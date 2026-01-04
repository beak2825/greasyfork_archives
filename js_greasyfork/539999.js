// ==UserScript==
// @name         SAFE_SWIFE_PAY
// @namespace    http://tampermonkey.net/
// @version      2025-06-191
// @description  SAFE_SWIFE_PAY!
// @author       You
// @match        https://safeswiftpay.com/admin/fundTransfer
// @icon         https://www.google.com/s2/favicons?sz=64&domain=safeswiftpay.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539999/SAFE_SWIFE_PAY.user.js
// @updateURL https://update.greasyfork.org/scripts/539999/SAFE_SWIFE_PAY.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var startFlag = false;
	var channelName = null;

	addElement();


	function addElement(){
		let parentDiv = document.querySelector("div[class='card-header border-bottom pb-3 d-flex align-items-baseline justify-content-between']");
		GM_addElement(parentDiv, 'input', {
        id: 'cc_ww_code',type:"text"
		});
		GM_addElement(parentDiv, 'input', {
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
			 alert('请先输入渠道编码！');
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

	setInterval(function(){
		var channelNameVal = GM_getValue("cc_ww_code_value");
		if(""!=channelNameVal){
			channelName = channelNameVal;
		}else{
			channelName = document.getElementById('cc_ww_code').value
		}
		var _startFlag = GM_getValue("cc_start_flag");
		if(_startFlag && null!=channelName){
			document.querySelector("button[class='f-10 p-2 btn btn-primary fundTransferTable']").click();
		}
	}, 30000);

    const originOpen = XMLHttpRequest.prototype.open;
	const parser = new DOMParser();
    XMLHttpRequest.prototype.open = function (_, url) {
        if (url.startsWith("fundTransfer/get-list")) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                   const res = JSON.parse(this.responseText);
				   if(res &&res.data){
					   console.log('2->',res.data);
					   commitData(res.data)
				   }
                }
            });
        }
        originOpen.apply(this, arguments);
    };


	function commitData(dataArray){
		var dataList = [];
		for (var i = 0; i < dataArray.length; i++) {
			var record = dataArray[i];
			var item = {};
			var status = record['status'];
			var amount = record['amount'];
			var utr = record['utrNo'];
			if ('Approved' === status && amount && utr) {
				item['utrNo'] = utr;
				item['amount'] = amount;
				item['remark'] = JSON.stringify(record);
				dataList.push(item);
			}
		}
		console.log('dd',dataList);
        if(dataList.length>0){
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://gamerplayers.com/gold-pay/portal/crawl/batchChannelUpscore",
                headers: {
                    "Content-Type": "application/json",
                    "X-SERVICE-CODE": "64842531e4b0ac0d6892d31b",
                    "X-CHANNEL-CODE": channelName.trim()
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