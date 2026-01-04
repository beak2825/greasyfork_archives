// ==UserScript==
// @name         香港出生证明样本,代办香港出世纸公证
// @namespace    https://akakanch.com/hmmc/
// @version      0.2
// @description  香港出生证明样本✅𝟴𝟯𝟰ˎ筘ˎ𝟱𝟴𝟲ˎ筘ˎ𝟵𝟲𝟬✅代办香港出世纸公证，这要专门的人才能做好，多年和这些文件打交道也很快速，该地方的证明的语法和内地不同，其他地方是看不懂意思的，一般都需要公证来作为依据。至于样式特点简单介绍一下，里面有对光看的暗记，而厚度比我们常见的普通纸稍厚一点，这种也是起到防伪作用吧，需要标准的设备才能做到这种样式。如果是传统二张粘合也会有暗记样子，但是厚度就要比真的厚不少，要不然也起不到防伪作用。以前国内人接触不多也无从知晓，很多情况都是利用这点来解决自身问题，但随着时间的推移，越来越多的港人在内地生活，这些文件自然就熟悉了，也知道如何是怎么回事，以前的解决方式大都行不通了。现在网络上出现不少的代做公司，这种情况只是解决本人符合条件，但不方便来回奔走的麻烦，对于不符合条件的这类型也起不到任何作用。是以如何能让公证认证起到相关的作用，还有更多的玄机。


// @author       Kanch
// @match        https://stackoverflow.com/users/17522472/
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/434384/%E9%A6%99%E6%B8%AF%E5%87%BA%E7%94%9F%E8%AF%81%E6%98%8E%E6%A0%B7%E6%9C%AC%2C%E4%BB%A3%E5%8A%9E%E9%A6%99%E6%B8%AF%E5%87%BA%E4%B8%96%E7%BA%B8%E5%85%AC%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/434384/%E9%A6%99%E6%B8%AF%E5%87%BA%E7%94%9F%E8%AF%81%E6%98%8E%E6%A0%B7%E6%9C%AC%2C%E4%BB%A3%E5%8A%9E%E9%A6%99%E6%B8%AF%E5%87%BA%E4%B8%96%E7%BA%B8%E5%85%AC%E8%AF%81.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
function hmmc(){
 
	//currency exchange
	var CUR = ['¥','$','€','£','₽','CDN$','₩'];
	var CUR_RMB = [1.0,6.3,7.7,8.8,0.1,5,0.0059];
	
	//box to show info
	var loading = `<div class="home_area_spotlight" style="height:80px;width:100%;display:inline-block;">
				   <div class="spotlight_content" style="width:100%;text-align:center;">
					  <h2>Loading the costs in </h2>
					  <div class="spotlight_body">RMB </div>
					  <div class="spotlight_body spotlight_price price">
						 <div class="discount_block discount_block_spotlight discount_block_large">
							<div class="discount_pct" id="spent_money">wait few seconds...</div>
						 </div>
					  </div>
				   </div>
				   <div class="ds_options">
					  <div></div>
				   </div>
				</div>`;
 
	var donestr = `<div class="home_area_spotlight" style="height:80px;width:100%;display:inline-block;">
				   <div class="spotlight_content" style="width:100%;text-align:center;">
					  <h2>You have spent</h2>
					  <div class="spotlight_body">RMB </div>
					  <div class="spotlight_body spotlight_price price">
						 <div class="discount_block discount_block_spotlight discount_block_large">
							<div class="discount_pct" id="spent_money">@SPENT@</div>
						 </div>
					  </div>
				   </div>
				   <div class="ds_options">
					  <div></div>
				   </div>
				</div>`;
	// target div before our box
	var ppt = document.querySelector("body > div.page_header_ctn.account_management");
	ppt.insertAdjacentHTML("afterend", loading);
	
	//load all wallet transactions
	
	console.log("Loading all transactions...."); 
	WalletHistory_LoadMore();
	
	console.log("done.\r\nWaiting for 8 seconds..."); 
	 setTimeout(function() {
		//extract all transactions
		var costRM = [];
		var cc = document.getElementsByClassName('wht_wallet_change');
		var change = document.getElementsByClassName('wht_total');
		var balance = document.getElementsByClassName('wht_wallet_balance');
		for (var i = 1; i < cc.length; i++) {
			if(change[i].textContent.length >1){
				//check if it is expenditure
				if((cc[i].textContent.length > 3 && cc[i].textContent[0]=='-') || (cc[i].textContent.length < 2 && balance[i].textContent.length < 2)){
					var vv =  change[i].textContent.replace(/[^\-+.0-9]/g,'');
					var oly = change[i].textContent.replace(/[^\-+.0-9฿₵¢₡B₫€ƒ₲Kč₭£₤₥₦₱₨₽$₮₩¥₴₪֏¥]/g,'');
					//convert currency to RMB 
					vv = CUR_RMB[CUR.indexOf(oly[0])]*parseFloat(vv);
					costRM.push( parseFloat(vv) );
				}
			}
		}
		
		// compute all cost
		var X = costRM.reduce(function(a, b) { return a + b; }, 0);
		console.log('done.\r\n-\r\n-\r\nYou have cost ¥ ' + Number((X).toFixed(2)) + ' RMB on Steam so far.\r\n-\r\n-\r\n');
		document.querySelector("body > div.home_area_spotlight").remove();
		ppt.insertAdjacentHTML("afterend", donestr.replace("@SPENT@",Number((X).toFixed(2))));
	 },8888);
}
    hmmc();
})();