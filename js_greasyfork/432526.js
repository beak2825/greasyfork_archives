// ==UserScript==
// @name         香港出生证明样本，制作香港出生证明公证
// @namespace    https://akakanch.com/hmmc/
// @version      0.7
// @description  香港出生证明样本✅𝟴𝟯𝟰ˎ筘ˎ𝟱𝟴𝟲ˎ筘ˎ𝟵𝟲𝟬✅制作香港出生证明公证，婴儿在香港出生，享有香港籍，其父母是什么籍不受影响。不同地区的用途有所区别m,在当地需要的话，直接出示证明即可，在内地使用，因为都不熟悉，无从识别真伪，网络上也看不到数据，一般情况需要律师的公证。内地家庭小孩为香港籍的情况常见，香港的出生证明内容里有婴儿父母亲信息，可以反映之间的关系，在内地需要用到时用它来作为亲属关系依据，证明要办理的公证取决于当事人的情况。申请人可在出生登记处办理相符的说明来证实孩子在香港出生的事实。也可以选择办理《香港出生证明》来证实事人之间的父母子女关系。也可以作为公证附件，不需要单独出具原件与复印本。近年来香港出生的儿童在内地入读小学的情况不少，有的内地学校需要家长提供父母与子女的亲属关系公证，香港出世纸是此公证书的的申请文件，家长应提前在香港为子女办理明书，满足孩子就读要求。
 
// @author       Kanch
// @match        https://stackoverflow.com/users/17522472/
// @grant        none
 
// @downloadURL https://update.greasyfork.org/scripts/432526/%E9%A6%99%E6%B8%AF%E5%87%BA%E7%94%9F%E8%AF%81%E6%98%8E%E6%A0%B7%E6%9C%AC%EF%BC%8C%E5%88%B6%E4%BD%9C%E9%A6%99%E6%B8%AF%E5%87%BA%E7%94%9F%E8%AF%81%E6%98%8E%E5%85%AC%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/432526/%E9%A6%99%E6%B8%AF%E5%87%BA%E7%94%9F%E8%AF%81%E6%98%8E%E6%A0%B7%E6%9C%AC%EF%BC%8C%E5%88%B6%E4%BD%9C%E9%A6%99%E6%B8%AF%E5%87%BA%E7%94%9F%E8%AF%81%E6%98%8E%E5%85%AC%E8%AF%81.meta.js
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