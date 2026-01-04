// ==UserScript==
// @name         TinyGrail AutoTemple
// @namespace    https://github.com/bangumi/scripts/tree/master/liaune
// @version      0.2
// @description  小圣杯自动建塔
// @author       Liaune
// @include     /^https?://(bgm\.tv|bangumi\.tv|chii\.in)/(user|character|rakuen\/topic\/crt).*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/395156/TinyGrail%20AutoTemple.user.js
// @updateURL https://update.greasyfork.org/scripts/395156/TinyGrail%20AutoTemple.meta.js
// ==/UserScript==
let api = 'https://tinygrail.com/api/';

function getData(url, callback) {
	if (!url.startsWith('http'))
		url = api + url;
	$.ajax({
		url: url,
		type: 'GET',
		xhrFields: { withCredentials: true },
		success: callback
	});
}
function postData(url, data, callback) {
	let d = JSON.stringify(data);
	if (!url.startsWith('http'))
		url = api + url;
	$.ajax({
		url: url,
		type: 'POST',
		contentType: 'application/json',
		data: d,
		xhrFields: { withCredentials: true },
		success: callback
	});
}

let autoTempleList = JSON.parse(localStorage.getItem('TinyGrail_autoTempleList')) || [];
if(autoTempleList.length){
	setInterval(function(){
		autoTempleList = JSON.parse(localStorage.getItem('TinyGrail_autoTempleList'));
		autoBuildTemple(autoTempleList);
	},30*60*1000);
}

async function retryPromise(callback, n=10) {
	let error;
	while(n--) {
		try {
			return await new Promise(callback);
		} catch (err) {
			error = err;
			await new Promise(resolve => setTimeout(resolve, 300)); // sleep 300 ms
		}
	}
	throw error;
};

async function autoBuildTemple(charas){
	closeDialog();
	var dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="info_box">
<div class="title">自动建塔检测中</div>
<div class="result" style="max-height:500px;overflow:auto;"></div>
</div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;
	$('body').append(dialog);
	$('#TB_closeWindowButton').on('click', closeDialog);
	$('#TB_overlay').on('click', closeDialog);
	function buildTemple(chara, index, amount){
		postData(`chara/sacrifice/${chara.charaId}/${amount}/false`, null);
			//if (d.State == 0) {
				$('.info_box .result').prepend(`<div class="row">#${chara.charaId} ${chara.name} 献祭${amount}</div>`);
				$('#autobuildButton').text('[自动建塔]');
				autoTempleList.splice(index,1); //建塔完成，取消自动建塔
				localStorage.setItem('TinyGrail_autoTempleList',JSON.stringify(autoTempleList));
			//} else {
				//$('.info_box .result').prepend(`<div class="row">${d.Message}</div>`);
			//}
	}
	function postBid(chara, price, amount){
		postData(`chara/bid/${chara.charaId}/${price}/${amount}`, null, function(d, s) {
			if(d.Message){
				$('.info_box .result').prepend(`<div class="row">#${charaId} ${chara.name} ${d.Message}</div>`);
			}
			else{
				$('.info_box .result').prepend(`<div class="row">买入成交 #${charaId} ${chara.name} ${price}*${amount}</div>`);
			}
		});
	}
	for (let i = 0; i < charas.length; i++) {
		$('.info_box .title').text(`自动建塔检测中 ${i+1} / ${charas.length}`);
		let chara = charas[i];
		let index = i;
		$('.info_box .result').prepend(`<div class="row">check #${chara.charaId} ${chara.name}</div>`);
		await retryPromise(resolve => getData(`chara/user/${chara.charaId}`, function (d, s) {
			let Amount = d.Value.Amount;
			if(Amount >= chara.target){ //持股达到数量，建塔
				buildTemple(chara, index, chara.target);
			}
			else getData(`chara/depth/${chara.charaId}`,function (d, s) {
				let AskPrice = d.Value.Asks[0] ? d.Value.Asks[0].Price : 0;
				let AskAmount = d.Value.Asks[0] ? d.Value.Asks[0].Amount : 0;
				if(AskPrice && AskPrice <= chara.BidPrice){ //最低卖单低于买入上限，买入
					postBid(chara, AskPrice, Math.min(AskAmount,chara.target - Amount));
				}
			});
			resolve();
			if(i == charas.length-1){
				$('.info_box .title').text(`自动建塔检测完毕！ ${i+1} / ${charas.length}`);
				setTimeout(()=>{closeDialog();},1*1000);
			}
		}));
	}
}

function closeDialog() {
	$('#TB_overlay').remove();
	$('#TB_window').remove();
}


function openBuildDialog(chara){
	autoTempleList = JSON.parse(localStorage.getItem('TinyGrail_autoTempleList')) || [];
	let target = 500, bidPrice = 10;
	let intempleList = false, index = 0;
	for(let i = 0; i < autoTempleList.length; i++){
		if(autoTempleList[i].charaId == chara.Id){
			target = autoTempleList[i].target;
			bidPrice = autoTempleList[i].bidPrice;
			intempleList = true;
			index = i;
		}
	}
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;">
<div class="title" title="目标数量 / 买入价格">
自动建塔 - #${chara.Id} 「${chara.Name}」 ${target} / ₵${bidPrice}</div>
<div class="desc"><p>设置目标数量之前请先检查是否已经献祭建塔,当持股数超过目标数量时将献祭目标数量建塔</p>
输入 目标数量 / 买入价格(不超过此价格的卖单将自动买入)</div>
<div class="label"><div class="trade build">
<input class="target" type="number" style="width:150px" title="目标数量" value="${target}">
<input class="bidPrice" type="number" style="width:150px" title="卖出下限" value="${bidPrice}">
<button id="startBuildButton" class="active">自动建塔</button><button id="cancelBuildButton">取消建塔</button></div>
<div class="loading" style="display:none"></div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>`;
	$('body').append(dialog);

	$('#TB_closeWindowButton').on('click', closeDialog);

	$('#cancelBuildButton').on('click', function(){
		if(intempleList){
			autoTempleList.splice(index,1);
			localStorage.setItem('TinyGrail_autoTempleList',JSON.stringify(autoTempleList));
			alert(`取消自动建塔${chara.Name}`);
			location.reload();
		}
		closeDialog();
	});

	$('#startBuildButton').on('click', function () {
		let info = {};
		info.charaId = chara.Id.toString();
		info.name = chara.Name;
		info.target = $('.trade.build .target').val();
		info.bidPrice =  $('.trade.build .bidPrice').val();
		if(intempleList){
			autoTempleList.splice(index,1);
			autoTempleList.unshift(info);
		}
		else autoTempleList.unshift(info);
		localStorage.setItem('TinyGrail_autoTempleList',JSON.stringify(autoTempleList));
		alert(`启动自动建塔#${chara.Id} ${chara.Name}`);
		closeDialog();
		$('#autobuildButton').text('[自动建塔中]');
		autoBuildTemple(autoTempleList);
	});
}

function setBuildTemple(charaId){
	let charas = [];
	for(let i = 0; i < autoTempleList.length; i++){
		charas.push(autoTempleList[i].charaId);
	}
	let button;
	if(charas.includes(charaId)){
		button = `<button id="autobuildButton" class="text_button">[自动建塔中]</button>`;
	}
	else{
		button = `<button id="autobuildButton" class="text_button">[自动建塔]</button>`;
	}
	$('#buildButton').after(button);

	$('#autobuildButton').on('click', () => {
		getData(`chara/${charaId}`, (d) => {
			let chara = d.Value;
			openBuildDialog(chara);
		});
	});
}

function observeChara(mutationList) {
	if(!$('#grailBox .progress_bar, #grailBox .assets_box').length) {
		fetched = false;
		return;
	}
	if(fetched) return;
	if($('#grailBox .assets_box').length) {
		fetched = true;
		let charaId = $('#grailBox .title .name a')[0].href.split('/').pop();
		setBuildTemple(charaId);
	} // use '.progress_bar' to detect (and skip) ICO characters
	else if($('#grailBox .progress_bar').length) {
		observer.disconnect();
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


















