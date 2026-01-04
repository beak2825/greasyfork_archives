// ==UserScript==
// @name         TinyGrail AutoBid
// @namespace    https://github.com/bangumi/scripts/tree/master/liaune
// @version      0.1.3
// @description  小圣杯自动挂单(买单)
// @author       Liaune
// @include     /^https?://(bgm\.tv|bangumi\.tv|chii\.in)/(user|character|rakuen\/topic\/crt).*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406376/TinyGrail%20AutoBid.user.js
// @updateURL https://update.greasyfork.org/scripts/406376/TinyGrail%20AutoBid.meta.js
// ==/UserScript==
let api = 'https://tinygrail.com/api/';

function getData(url) {
	if (!url.startsWith('http')) url = api + url;
	return new Promise((resovle, reject) => {
		$.ajax({
			url: url,
			type: 'GET',
			xhrFields: { withCredentials: true },
			success: res => {resovle(res)},
			error: err => {reject(err)}
		});
	});
}

function postData(url, data) {
	let d = JSON.stringify(data);
	if(!url.startsWith('http')) url = api + url;
	return new Promise((resovle, reject) => {
		$.ajax({
			url: url,
			type: 'POST',
			contentType: 'application/json',
			data: d,
			xhrFields: { withCredentials: true },
			success: res => {resovle(res)},
			error: err => {reject(err)}
		});
	});
}

function formatBidPrice(price){
	return (price - Math.round(price))>=0 ? Math.round(price) : Math.round(price)-0.5;
}
function formatAskPrice(price){
    if(Number.isInteger(parseFloat(price))) return price;
	else return (price - Math.floor(price))>0.5 ? Math.ceil(price) : Math.floor(price)+0.5;
}

function maxFloat(price){
	return (price*(Math.pow(2,52)-1)/Math.pow(2,52));
}

function remove_empty(array){
	let arr = [];
	for(let i = 0; i < array.length; i++){
		if(array[i]) arr.push(array[i]);
	}
	return arr;
}

let bidList = JSON.parse(localStorage.getItem('TinyGrail_bidList')) || [];
let followList = JSON.parse(localStorage.getItem('TinyGrail_followList')) || {"user":'',"charas":[], "auctions":[]};

async function autoBid(charas){
	//closeDialog();
	var dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="info_box">
<div class="title">自动挂单检测中</div>
<div class="result" style="max-height:500px;overflow:auto;"></div>
</div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;
	if(!$('#TB_window').length) $('body').append(dialog);
	$('#TB_closeWindowButton').on('click', closeDialog);
	$('#TB_overlay').on('click', closeDialog);
	for (let i = 0; i < charas.length; i++) {
		$('.info_box .title').text(`自动挂单检测中 ${i+1} / ${charas.length}`);
		let charaId = charas[i].charaId;
		await getData(`chara/user/${charaId}`).then((d)=>{
			let Bids = d.Value.Bids;
			let Asks = d.Value.Asks;
			let Amount = d.Value.Amount;
            let BidHistory = d.Value.BidHistory;
			let [myBidPrice, myBidAmount] = getBids(d.Value.Bids,0);
			let [myAskPrice, myAskAmount] = getAsks(d.Value.Asks,0);
			let [myBidPrice_ice, myBidAmount_ice] = getBids(d.Value.Bids,1);
			let [myAskPrice_ice, myAskAmount_ice] = getAsks(d.Value.Asks,1);
			let time = new Date().toLocaleTimeString();
			$('.info_box .result').prepend(`<div class="row">${time} check #${charaId} ${charas[i].name}</div>`);

			function getBids(Bids,is_ice){ //获取自己最高买价和数量
				let [myBidPrice, myBidAmount] = [0, 0];
				for(let i = 0; i < Bids.length; i++) {
					if(Bids[i].Price > myBidPrice && Bids[i].Type==is_ice) [myBidPrice, myBidAmount] = [Bids[i].Price, Bids[i].Amount];
				}
				return [myBidPrice, myBidAmount];
			}
			function getAsks(Asks,is_ice){ //获取自己最低卖价和数量
				let [myAskPrice, myAskAmount] = [9999, 0];
				for(let i = 0; i < Asks.length; i++) {
					if(Asks[i].Price < myAskPrice && Asks[i].Type==is_ice) myAskPrice = Asks[i].Price;
				}
                for(let i = 0; i < Asks.length; i++) {
					if(Asks[i].Price == myAskPrice && Asks[i].Type==is_ice) myAskAmount += Asks[i].Amount;
				}
				return [myAskPrice, myAskAmount];
			}
			function cancelBid(type,is_ice){ //取消最高买单
				let [myBidPrice, myBidAmount, tid] = [0, 0, 0];
				for(let i = 0; i < Bids.length; i++) {
					if(Bids[i].Price > myBidPrice && Bids[i].Type==is_ice) [myBidPrice,myBidAmount,tid] = [Bids[i].Price,Bids[i].Amount, Bids[i].Id];
				}
				if(tid){
					postData(`chara/bid/cancel/${tid}`, null).then((d)=>{
						console.log(`${time} ${type}: 取消买单#${charaId} ${myBidPrice}*${myBidAmount}`);
						$('.info_box .result').prepend(`<div class="row">${time} ${type}: 取消买单 #${charaId} ${charas[i].name} ${myBidPrice}*${myBidAmount}</div>`);
					});
				}
			}
			function cancelAsk(type,is_ice,calback){ //取消最低卖单
				let [myAskPrice, myAskAmount, tid] = [9999, 0, 0];
				for(let i = 0; i < Asks.length; i++) {
					if(Asks[i].Price < myAskPrice && Asks[i].Type==is_ice) [myAskPrice,myAskAmount,tid] = [Asks[i].Price, Asks[i].Amount, Asks[i].Id];
				}
				if(tid){
					postData(`chara/ask/cancel/${tid}`, null).then((d)=>{
						console.log(`${time} ${type}: 取消卖单#${charaId} ${myAskPrice}*${myAskAmount}`);
						$('.info_box .result').prepend(`<div class="row">${time} ${type}: 取消卖单 #${charaId} ${charas[i].name} ${myAskPrice}*${myAskAmount}</div>`);
                        calback();
					});
				}
                else calback();
			}
			function postBid(price, amount, type, is_ice){
				let args = is_ice ? '/true' : '';
				postData(`chara/bid/${charaId}/${price}/${amount}${args}`, null).then((d)=>{
					if(d.Message){
						console.log(`${time} ${type}: ${charaId} ${d.Message}`);
						$('.info_box .result').prepend(`<div class="row">${time} ${type}: #${charaId} ${charas[i].name} ${d.Message}</div>`);
					}
					else{
						console.log(`${time} ${type}: 买入委托#${charaId} ${price}*${amount}`);
						$('.info_box .result').prepend(`<div class="row">${time} ${type}: 买入委托 #${charaId} ${charas[i].name} ${price}*${amount}</div>`);
					}
				});
			}
			function postAsk(price, amount, type,is_ice){
				let args = is_ice ? '/true' : '';
				postData(`chara/ask/${charaId}/${price}/${amount}${args}`, null).then((d)=>{
					if(d.Message){
						console.log(`${time} ${type}: ${charaId} ${d.Message}`);
						$('.info_box .result').prepend(`<div class="row">${time} ${type}: #${charaId} ${charas[i].name} ${d.Message}</div>`);
					}
					else{
						console.log(`${time} ${type}: 卖出委托#${charaId} ${price}*${amount}`);
						$('.info_box .result').prepend(`<div class="row">${time} ${type}: 卖出委托 #${charaId} ${charas[i].name} ${price}*${amount}</div>`);
					}
				});
			}
			function getOverBids(Bids){
				let overBidPrice = 0;
				let count = 0, limit = 10;
				for(let i = 0; i < Bids.length; i++) {
					if(Bids[i].Price == formatBidPrice(myBidPrice)) Bids[i].Amount -= myBidAmount;
					count += Bids[i].Amount;
					if(count >= limit){
						overBidPrice = Bids[i].Price;
						break;
					}
				}
				return overBidPrice;
			}
			function getAskin(Asks, low_price){ //获取可买入的卖单价格和总数
				let [price, amount] = [0,0];
				for(let i = 0; i < Asks.length; i++) {
					if(Asks[i].Price > 0 && Asks[i].Price <= low_price){
                        if(Asks[i].Price == formatAskPrice(myAskPrice)) Asks[i].Amount -= myAskAmount;
						amount += Asks[i].Amount;
						if(Asks[i].Amount) price = Asks[i].Price;
					}
				}
				return [price, amount];
			}

			getData(`chara/depth/${charaId}`).then((d)=>{
				let [ask_price,ask_amount] = getAskin(d.Value.Asks,charas[i].highBidPrice);
				let overBidPrice = getOverBids(d.Value.Bids);
				if(ask_price && ask_price <= charas[i].highBidPrice){ //最低卖单低于买入上限，买入
					postBid(ask_price, ask_amount, '买入', 0);
				}
				if(overBidPrice > charas[i].highBidPrice){
					cancelBid('当前买单过高',0);
				}
				else{
                    let price = Math.max(Math.min(formatBidPrice(overBidPrice)+0.5,charas[i].highBidPrice),charas[i].lowBidPrice);
					if(formatBidPrice(price) != formatBidPrice(myBidPrice)){
						cancelBid('修改买单',0);
						postBid(price, charas[i].amount, '修改买单', 0);
					}else if(myBidAmount < charas[i].amount * 0.5){
						cancelBid('补充买单',0);
						postBid(price, charas[i].amount, '补充买单', 0);
					}
				}
			});
			//若有拍卖且价格低于最高买入价，关注拍卖
            if(!followList.auctions.includes(charaId)){
                getData(`chara/user/${charaId}/tinygrail/false`).then((d)=>{
                    if (d.State == 0 && d.Value.Amount > 0 && d.Value.Price <= charas[i].highBidPrice) {
                        $('.info_box .result').prepend(`<div class="row">${time} 关注竞拍 #${charaId} ${charas[i].name}</div>`);
                        followList.auctions.unshift(charaId.toString());
                        localStorage.setItem('TinyGrail_followList',JSON.stringify(followList));
                    }
                });
            }
			if(i == charas.length-1){
				$('.info_box .title').text(`自动挂单检测完毕！ ${i+1} / ${charas.length}`);
			}
		});
	}
}

function closeDialog() {
	$('#TB_overlay').remove();
	$('#TB_window').remove();
}

function cancelOrder(charaId,index){
	bidList.splice(index,1);
	localStorage.setItem('TinyGrail_bidList',JSON.stringify(bidList));

	getData(`chara/user/${charaId}`).then((d)=>{
		let Bids = d.Value.Bids;
		let tid = Bids[0] ? Bids[0].Id : null;
		if(tid){
			postData(`chara/bid/cancel/${tid}`, null).then((d)=>{
				console.log(`取消买单#${charaId} ${myBidPrice}*${myBidAmount}`);
				location.reload();
			});
		}
		location.reload();
	});
}

function openOrderDialog(chara){
	let lowBidPrice = 10, highBidPrice = 10, amount = 200;
	let inorder = false, index = 0;
	for(let i = 0; i < bidList.length; i++){
		if(bidList[i].charaId == chara.Id){
			lowBidPrice = bidList[i].lowBidPrice;
			highBidPrice = bidList[i].highBidPrice;
			amount = bidList[i].amount;
			inorder = true;
			index = i;
		}
	}
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title" title="最低买价 / 最高买价 / 挂单数量">
自动挂单 - #${chara.Id} 「${chara.Name}」 ₵${lowBidPrice} / ${highBidPrice} / ${amount}</div>
<div class="desc">输入最低买价 / 最高买价 / 挂单数量</div>
<div class="label"><div class="trade order">
<input class="lowBidPrice" type="number" style="width:75px" title="最低买价" value="${lowBidPrice}">
<input class="highBidPrice" type="number" style="width:75px" title="最高买价" value="${highBidPrice}">
<input class="amount" type="number" style="width:75px" title="挂单数量" value="${amount}">
<button id="startOrderButton" class="active">自动挂单</button><button id="cancelOrderButton">取消挂单</button>
</div></div>
<div class="loading" style="display:none"></div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>`;
	$('body').append(dialog);

	$('#TB_closeWindowButton').on('click', closeDialog);

	$('#cancelOrderButton').on('click', function(){
		if(inorder){
			alert(`取消自动挂单${chara.Name}`);
			cancelOrder(chara.Id,index);
		}
		closeDialog();
	});

	$('#startOrderButton').on('click', function () {
		let info = {};
		info.charaId = chara.Id.toString();
		info.name = chara.Name;
		info.lowBidPrice = $('.trade.order .lowBidPrice').val();
		info.highBidPrice =  $('.trade.order .highBidPrice').val();
		info.amount = $('.trade.order .amount').val();
		console.log(info);
		if(inorder){
			bidList.splice(index,1);
			bidList.unshift(info);
		}
		else bidList.unshift(info);
		console.log(bidList);
		localStorage.setItem('TinyGrail_bidList',JSON.stringify(bidList));
		alert(`启动自动挂单#${chara.Id} ${chara.Name}`);
		closeDialog();
		autoBid([info]);
	});
}

function setOrder(charaId){
	let charas = [];
	for(let i = 0; i < bidList.length; i++){
		charas.push(bidList[i].charaId);
	}
	let button;
	if(charas.includes(charaId)){
		button = `<button id="autoBidButton" class="text_button">[挂买单中]</button>`;
	}
	else{
		button = `<button id="autoBidButton" class="text_button">[挂买单]</button>`;
	}
	$('#kChartButton').before(button);

	$('#autoBidButton').on('click', () => {
		getData(`chara/${charaId}`).then((d)=>{
			let chara = d.Value;
			openOrderDialog(chara);
		});
	});
}

let times = 1;
let check_bidList = setInterval(function (){
    bidList = JSON.parse(localStorage.getItem('TinyGrail_bidList')) || [];
	if(bidList.length){
		console.log('第'+times+'次挂单检测');
		autoBid(bidList);
		times++;
	}
},35*60*1000);

function observeChara(mutationList) {
	if(!$('#grailBox .progress_bar, #grailBox .title').length) {
		fetched = false;
		return;
	}
	if(fetched) return;
	if($('#grailBox .progress_bar').length) {
		observer.disconnect();
	}// use '.progress_bar' to detect (and skip) ICO characters
	else if($('#grailBox .title').length) {
		fetched = true;
		let charaId = $('#grailBox .title .name a')[0].href.split('/').pop();
		setOrder(charaId);
	}
}
let fetched = false;
let parentNode=null, observer;
if(location.pathname.startsWith('/rakuen/topic/crt')) {
	parentNode = document.getElementById('subject_info');
	observer = new MutationObserver(observeChara);
} else if(location.pathname.startsWith('/character')) {
	parentNode = document.getElementById('columnCrtB')
	observer = new MutationObserver(observeChara);
}
if(parentNode) observer.observe(parentNode, {'childList': true, 'subtree': true});
