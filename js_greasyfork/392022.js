// ==UserScript==
// @name         TinyGrail Helper
// @namespace    https://github.com/bangumi/scripts/tree/master/liaune
// @version      2.4.3
// @description  为小圣杯增加一些小功能,讨论/反馈：https://bgm.tv/group/topic/353368
// @author       Liaune,Cedar
// @include     /^https?://(bgm\.tv|bangumi\.tv|chii\.in)/(user|character|rakuen\/topiclist|rakuen\/home|rakuen\/topic\/crt).*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/392022/TinyGrail%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/392022/TinyGrail%20Helper.meta.js
// ==/UserScript==
GM_addStyle(`
ul.timelineTabs li a {
margin: 2px 0 0 0;
padding: 5px 10px 5px 10px;
}

img.cover {
background-color: transparent;
}

.assets .my_temple.item .card {
box-shadow: 3px 3px 5px #FFEB3B;
borderList: 1px solid #FFC107;
}

html[data-theme='dark'] .assets .my_temple.item .card {
box-shadow: 0px 0px 15px #FFEB3B;
borderList: 1px solid #FFC107;
}

.assets .my_temple.item .name a {
font-weight: bold;
color: #0084b4;
}

#grail .temple_list .item {
margin: 5px 5px 5px 0;
width: 107px;
}

.assets_box .item {
margin: 5px 5px 5px 0;
width: 90px;
}

#lastTemples .assets .item {
margin: 5px 5px 5px 0;
width: 107px;
}

.item .card {
width: 105px;
height: 140px;
}

.assets_box .item .card {
width: 90px;
height: 120px;
}

#grailBox .my_auction, #TB_window .my_auction {
color: #ffa7cc;
margin-right: 5px;
}

#grailBox .user_auction, #TB_window .user_auction {
color: #a7e3ff;
margin-right: 5px;
}

html[data-theme='dark'] #grailBox .title {
background-color: transparent;
}

#grailBox .trade_box button {
min-width: 50px;
padding: 0 9px;
}

#TB_window .text_button {
margin: 0 8px 0 0;
padding: 0;
width: fit-content;
height: fit-content;
min-width: fit-content;
color: #0084B4;
}
`);
const api = 'https://tinygrail.com/api/';
let lastEven = false;

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

function renderCharacterDepth(chara) {
	let depth = `<small class="raise">+${formatNumber(chara.Bids, 0)}</small><small class="fall">-${formatNumber(chara.Asks, 0)}</small><small class="even">${formatNumber(chara.Change, 0)}</small>`
	return depth;
}

function renderCharacterTag(chara, item) {
	let id = chara.Id;
	let flu = '--';
	let tclass = 'even';
	if (chara.Fluctuation > 0) {
		tclass = 'raise';
		flu = `+${formatNumber(chara.Fluctuation * 100, 2)}%`;
	} else if (chara.Fluctuation < 0) {
		tclass = 'fall';
		flu = `${formatNumber(chara.Fluctuation * 100, 2)}%`;
	}

	let tag = `<div class="tag ${tclass}" title="₵${formatNumber(chara.MarketValue, 0)} / ${formatNumber(chara.Total, 0)}">₵${formatNumber(chara.Current, 2)} ${flu}</div>`
	return tag;
}

function renderBadge(item, withCrown, withNew, withLevel) {
	let badge = '';

	if (withLevel){
		badge = `<span class="badge level lv${item.Level}">lv${item.Level}</span>`;
	}
	if (item.Type == 1 && withNew) {
		badge += `<span class="badge new" title="+${formatNumber(item.Rate, 1)}新番加成剩余${item.Bonus}期">×${item.Bonus}</span>`;
	}
	if (item.State > 0 && withCrown){
		badge += `<span class="badge crown" title="获得${item.State}次萌王">×${item.State}</span>`;
	}
	return badge;
}

function listItemClicked() {
	let link = $(this).find('a.avatar').attr('href');
	if (link) {
		if (parent.window.innerWidth < 1200) {
			$(parent.document.body).find("#split #listFrameWrapper").animate({ left: '-450px' });
		}
		window.open(link, 'right');
	}
}

function normalizeAvatar(avatar) {
	if (!avatar) return '//lain.bgm.tv/pic/user/l/icon.jpg';

	if (avatar.startsWith('https://tinygrail.oss-cn-hangzhou.aliyuncs.com/'))
		return avatar + "!w120";

	let a = avatar.replace("http://", "//");
	return a;
}

function getWeeklyShareBonus(callback) {
	if (!confirm('已经周六了，赶紧领取股息吧？')) return;

	getData(`event/share/bonus`, (d) => {
		if (d.State == 0)
			alert(d.Value);
		else
			alert(d.Message);

		callback();
	});
}

function caculateICO(ico) {
	let level = 0;
	let price = 0;
	let amount = 0;
	let next = 100000;
	let nextUser = 15;

	//人数等级
	let heads = ico.Users;
	let headLevel = Math.floor((heads - 10) / 5);
	if (headLevel < 0) headLevel = 0;

	//资金等级
	while (ico.Total >= next && level < headLevel) {
		level += 1;
		next += Math.pow(level + 1, 2) * 100000;
	}
	if(level){
		amount = 10000 + (level - 1) * 7500;
		price = ico.Total / amount;
	}
	nextUser = (level + 1) * 5 + 10;

	return { Level: level, Next: next, Price: price, Amount: amount, Users: nextUser - ico.Users };
}

function ICO_standard(lv) {
	let users = lv * 5 + 10;
	let total = 100000;
	let level = 1;
	while(lv > level){
		level ++;
		total += Math.pow(level, 2) * 100000;
	}
	return { Users: users, Total: total };
}

function formatDate(date) {
	date = new Date(date);
	return date.format('yyyy-MM-dd hh:mm:ss');
}

function formatTime(timeStr) {
	let now = new Date();
	let time = new Date(timeStr) - (new Date().getTimezoneOffset() + 8 * 60) * 60 * 1000;

	let times = (time - now) / 1000;
	let day = 0;
	let hour = 0;
	let minute = 0;
	let second = 0;
	if (times > 0) {
		day = Math.floor(times / (60 * 60 * 24));
		hour = Math.floor(times / (60 * 60)) - Math.floor(times / (60 * 60 * 24)) * 24;
		minute = Math.floor(times / 60) - Math.floor(times / (60 * 60)) * 60;

		if (day > 0) return `剩余${day}天${hour}小时`;
		else if (hour > 0) return `剩余${hour}小时${minute}分钟`;
		else return `即将结束 剩余${minute}分钟`;
		//return '即将结束';
	} else {
		times = Math.abs(times);
		day = Math.floor(times / (60 * 60 * 24));
		hour = Math.floor(times / (60 * 60));
		minute = Math.floor(times / 60);
		second = Math.floor(times);

		if (minute < 1) {
			return `${second}s ago`;
		} else if (minute < 60) {
			return `${minute}m ago`;
		} else if (hour < 24) {
			return `${hour}h ago`;
		}

		if (day > 1000)
			return 'never';

		return `[${new Date(timeStr).format('yyyy-MM-dd')}] ${day}d ago`;
	}
}

function formatNumber(number, decimals, dec_point, thousands_sep) {
	number = (number + '').replace(/[^0-9+-Ee.]/g, '');
	let n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '';
	// toFixedFix = function (n, prec) {
	//   let k = Math.pow(10, prec);
	//   return '' + Math.ceil(n * k) / k;
	// };

	//s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	s = (prec ? n.toFixed(prec) : '' + Math.round(n)).split('.');
	let re = /(-?\d+)(\d{3})/;
	while (re.test(s[0])) {
		s[0] = s[0].replace(re, "$1" + sep + "$2");
	}

	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}

function menuItemClicked(callback) {
	$('.timelineTabs a').removeClass('focus');
	$('.timelineTabs a').removeClass('top_focus');
	$('#helperMenu').addClass('focus');
	if (callback) callback(1);
}

function closeDialog() {
	$('#TB_overlay').remove();
	$('#TB_window').remove();
}

//=======================================================================================================//
//关注列表
let followList = JSON.parse(localStorage.getItem('TinyGrail_followList')) || {"user":'',"charas":[], "auctions":[]};
//设置
let settings = JSON.parse(localStorage.getItem('TinyGrail_settings')) ||
	{"pre_temple":"on","hide_grail":"off","auction_num":"one","merge_order":"off","get_bonus":"on","gallery":"off"};
//发行价缓存
let chara_initPrice = JSON.parse(localStorage.getItem('TinyGrail_chara_initPrice')) || {};
//道具设置
let ItemsSetting = JSON.parse(localStorage.getItem('TinyGrail_ItemsSetting')) || {};
//自动补塔
setInterval(function(){
	checkLostTemple(1);
	async function autoFillCosts(autoFillCostList){
		for(let i = 0; i < autoFillCostList.length; i++){
			let id = autoFillCostList[i].id;
			let supplyId = autoFillCostList[i].supplyId;
			let cost = autoFillCostList[i].cost;
			await postData(`magic/stardust/${supplyId}/${id}/${cost}/true`, null).then((d)=>{
				if (d.State == 0) console.log(`自动补塔 #${id} ${d.Value}`);
				else console.log(`自动补塔 #${id} ${d.Message}`);
			});
		}
	}
	function checkLostTemple(currentPage){
		let autoFillCostList = [];
		getData(`chara/user/temple/0/${currentPage}/500`).then((d)=>{
			if(d.State == 0){
				for(let i = 0; i < d.Value.Items.length; i++){
					let info = {};
					let lv = d.Value.Items[i].CharacterLevel;
					info.id = d.Value.Items[i].CharacterId;
					info.supplyId = ItemsSetting.stardust ? ItemsSetting.stardust[lv] : null;
					info.cost = d.Value.Items[i].Sacrifices - d.Value.Items[i].Assets;
					if(info.cost >= 100 && info.cost <= 250 && info.id != info.supplyId && info.supplyId){
						autoFillCostList.push(info);
					}
				}
				autoFillCosts(autoFillCostList);
				if(currentPage < d.Value.TotalPages){
					currentPage++;
					checkLostTemple(currentPage);
				}
			}
		});
	}
},60*60*1000);

//自动建塔
let autoTempleList = JSON.parse(localStorage.getItem('TinyGrail_autoTempleList')) || [];
setInterval(function(){
	autoTempleList = JSON.parse(localStorage.getItem('TinyGrail_autoTempleList'))|| [];
	if(autoTempleList.length) autoBuildTemple(autoTempleList);
},60*60*1000);

//关注ICO自动凑人头
/*
setInterval(function(){
	followList = JSON.parse(localStorage.getItem('TinyGrail_followList'))|| {"user":'',"charas":[], "auctions":[]};
	let joinList = [];
	if(followList.charas.length){
		postData('chara/list', followList.charas).then((d)=>{
			for(let i = 0; i < d.Value.length; i++){
				let end = d.Value[i].End;
				if(end){
					let endTime = new Date(new Date(d.Value[i].End) - (new Date().getTimezoneOffset() + 8 * 60) * 60 * 1000);
					let leftTime = (new Date(endTime).getTime() - new Date().getTime())/1000; //剩余时间：秒
					console.log(`ico check#${d.Value[i].CharacterId} -「${d.Value[i].Name}」 ${leftTime}s left`);
					if(leftTime > 0 && leftTime < 60*60){
						joinList.push(d.Value[i]);
					}
				}
			}
			autoJoinICO(joinList,null);
		});
	}
},60*60*1000);
*/
//ico自动补款
let fillicoList = JSON.parse(localStorage.getItem('TinyGrail_fillicoList')) || [];
setInterval(function(){
	fillicoList = JSON.parse(localStorage.getItem('TinyGrail_fillicoList')) || [];
	let icoList = [];
	for(let i = 0; i < fillicoList.length; i++){
		let endTime = new Date(new Date(fillicoList[i].end) - (new Date().getTimezoneOffset() + 8 * 60) * 60 * 1000);
		let leftTime = (new Date(endTime).getTime() - new Date().getTime())/1000; //剩余时间：秒
		if(leftTime < 60){
			console.log(`ico check#${fillicoList[i].charaId} -「${fillicoList[i].name}」 目标等级:lv${fillicoList[i].target} ${leftTime}s left`);
			icoList.push(fillicoList[i]);
			delete fillicoList[i];
		}
	}
	fillicoList = remove_empty(fillicoList);
	localStorage.setItem('TinyGrail_fillicoList',JSON.stringify(fillicoList));
	if(icoList.length) fullfillICO(icoList);
},30*1000);

let charas_list = [];

function loadHelperMenu() {
	let item = `<li><a href="#" id="helperMenu" class="top">助手</a>
<ul>
<li><a href="#" id="temporaryList">临时列表</a></li>
<li><a href="#" id="followChara">关注角色</a></li>
<li><a href="#" id="followAuction">关注竞拍</a></li>
<li><a href="#" id="myICO">我的ICO</a></li>
<li><a href="#" id="myTemple">我的圣殿</a></li>
<li><a href="#" id="scratch">抽奖</a></li>
<li><a href="#" id="magic">魔法道具</a></li>
<li><a href="#" id="balance">资金日志分类</a></li>
<li><a href="#" id="sell">卖出</a></li>
<li><a href="#" id="autoBuild">自动建塔</a></li>
<li><a href="#" id="autoICO">自动补款</a></li>
<li><a href="#" id="cancelBids">取消买单</a></li>
<li><a href="#" id="settings">设置</a></li>
</ul>
</li>`;
	$('.timelineTabs').append(item);

	$('#followChara').on('click', function () {
		menuItemClicked(loadFollowChara);
	});

	$('#followAuction').on('click', function () {
		menuItemClicked(loadFollowAuction);
	});

	$('#myICO').on('click', function () {
		menuItemClicked(loadMyICO);
	});

	$('#myTemple').on('click', function () {
		menuItemClicked(loadMyTemple);
	});

	$('#balance').on('click', function () {
		menuItemClicked(loadBalance);
	});

	$('#autoBuild').on('click', function () {
		menuItemClicked(loadAutoBuild);
	});

	$('#autoICO').on('click', function () {
		menuItemClicked(loadAutoFillICO);
	});

	$('#temporaryList').on('click', function () {
		menuItemClicked(creatTemporaryList);
	});

	$('#scratch').on('click', function () {
		menuItemClicked(loadScratch);
	});

	$('#magic').on('click', function () {
		menuItemClicked(loadMagic);
	});

	$('#sell').on('click', function () {
		menuItemClicked(sellOut);
	});

	$('#cancelBids').on('click', function () {
		menuItemClicked(cancelBids);
	});

	$('#settings').on('click', function () {
		menuItemClicked(openSettings);
	});
}

function loadFollowAuction(page){
	followList = JSON.parse(localStorage.getItem('TinyGrail_followList'))|| {"user":'',"charas":[], "auctions":[]};
	let start = 20 * (page - 1);
	let ids = followList.auctions.slice(start, start+20);
	let totalPages = Math.ceil(followList.auctions.length / 20);
	postData('chara/list', ids).then((d)=>{
		if (d.State === 0) {
			loadCharacterList(d.Value, page, totalPages, loadFollowAuction, 'auction',true);
			postData('chara/auction/list', ids).then((d)=>{
				loadUserAuctions(d);
			});
			loadValhalla(ids);
		}
	});
}

function loadFollowChara(page){
	followList = JSON.parse(localStorage.getItem('TinyGrail_followList'))|| {"user":'',"charas":[], "auctions":[]};
	let start = 50 * (page - 1);
	let ids = followList.charas.slice(start, start+50);
	let totalPages = Math.ceil(followList.charas.length / 50);
	postData('chara/list', ids).then((d)=>{
		if (d.State === 0) {
			loadCharacterList(d.Value, page, totalPages, loadFollowChara, 'chara',true);
		}
	});
}

function loadMyICO(page){
	getData(`chara/user/initial/0/${page}/50`).then((d)=>{
		if (d.State == 0) {
			loadCharacterList(d.Value.Items,d.Value.CurrentPage, d.Value.TotalPages, loadMyICO, 'ico',false);
		}
	});
}

function loadMyTemple(page){
	getData(`chara/user/temple/0/${page}/50`).then((d)=>{
		if (d.State == 0) {
			loadCharacterList(d.Value.Items,d.Value.CurrentPage, d.Value.TotalPages, loadMyTemple, 'temple',false);
			if(page == 1){
				$('#eden_tpc_list ul').prepend(`<li id="lostTemple" class="line_odd item_list" style="text-align: center;">[查看受损圣殿]</li>`);
				$('#lostTemple').on('click', function () {
					$('#eden_tpc_list ul').html('');
					loadLostTemple(1);
				});
			}
		}
	});
}

function loadLostTemple(page){
	let lostTemples = [];
	getData(`chara/user/temple/0/${page}/500`).then((d)=>{
		if (d.State == 0) {
			for(let i = 0; i < d.Value.Items.length; i++){
				if(d.Value.Items[i].Assets - d.Value.Items[i].Sacrifices < 0) lostTemples.push(d.Value.Items[i]);
			}
			loadCharacterList(lostTemples,2, 2, loadLostTemple, 'temple',false);
		}
		if(page < d.Value.TotalPages){
			page++;
			loadLostTemple(page);
		}
	});
}

function loadBalance(){
	closeDialog();
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<table align="center" width="98%" cellspacing="0" cellpadding="5" class="settings">
<tr><td>类型：<select id="balanceType" style="width:100px">
<option value="0" selected="selected">全部</option>
<option value="18">魔法道具</option>
<option value="1">彩票刮刮乐</option>
<option value="2">参与ICO</option>
<option value="3">ICO退款</option>
<option value="13">ICO结果</option>
<option value="4">买入委托</option>
<option value="5">取消买入</option>
<option value="6">卖出委托</option>
<option value="8">取消卖出</option>
<option value="7">交易印花税</option>
<option value="9">资产重组</option>
<option value="10">参与竞拍</option>
<option value="11">修改竞拍</option>
<option value="12">竞拍结果</option>
<option value="14">个人所得税</option>
<option value="16">红包</option>
</select></td>
<td>第<input id="page" type="number" style="width:30px" value="1">页</td>
<td>每页<input id="amount" type="number" style="width:50px" value="1000">条</td>
<td><input class="inputBtn" value="查询" id="submit_search" type="submit"></td></tr>
</tbody></table>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;
	$('body').append(dialog);
	$('#TB_closeWindowButton').on('click', closeDialog);
	$('#TB_overlay').on('click', closeDialog);
	$('#submit_search').on('click', () => {
		let Type = $('#balanceType').val();
		let page =  $('#page').val();
		let amount = $('#amount').val();
		let Logs = [];
		getData(`chara/user/balance/${page}/${amount}`, null).then((d)=>{
			closeDialog();
			if (d.State == 0) {
				for(let i = 0; i < d.Value.Items.length; i++){
					if(d.Value.Items[i].Type == Type || Type==0) Logs.push(d.Value.Items[i]);
				}
				loadCharacterList(Logs, 1, 1, loadBalance, 'balance',false);
				$('#eden_tpc_list ul li').on('click', function (e) {
					var id = $(e.target).data('id');
					if (id == null) {
						var result = $(e.target).find('small.time').text().match(/#(\d+)/);
						if (result && result.length > 0)
							id = result[1];
					}

					if (id != null && id.length > 0) {
						if (parent.window.innerWidth < 1200) {
							$(parent.document.body).find("#split #listFrameWrapper").animate({ left: '-450px' });
						}
						window.open(`/rakuen/topic/crt/${id}?trade=true`, 'right');
					}
				});
			}
		});
	});
}

function loadAutoBuild(page){
	autoTempleList = JSON.parse(localStorage.getItem('TinyGrail_autoTempleList'))|| [];
	autoBuildTemple(autoTempleList);
	let charas = [];
	for(let i = 0; i < autoTempleList.length; i++) charas.push(autoTempleList[i].charaId);
	let start = 50 * (page - 1);
	let ids = charas.slice(start, start+50);
	let totalPages = Math.ceil(charas.length / 50);
	postData('chara/list', ids).then((d)=>{
		if (d.State === 0) {
			loadCharacterList(d.Value, page, totalPages, loadAutoBuild, 'chara',false);
		}
	});
}

function loadAutoFillICO(page){
	fillicoList = JSON.parse(localStorage.getItem('TinyGrail_fillicoList'))|| [];
	let charas = [];
	for(let i = 0; i < fillicoList.length; i++) charas.push(fillicoList[i].charaId);
	let start = 50 * (page - 1);
	let ids = charas.slice(start, start+50);
	let totalPages = Math.ceil(charas.length / 50);
	postData('chara/list', ids).then((d)=>{
		if (d.State === 0) {
			loadCharacterList(d.Value, page, totalPages, loadAutoBuild, 'chara_ico',false);
		}
	});
}

function creatTemporaryList(page){
	closeDialog();
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="bibeBox" style="padding:10px">
<label>在超展开左边创建角色列表 请输入角色url或id，如 https://bgm.tv/character/29282 或 29282，一行一个</label>
<textarea rows="10" class="quick" name="urls"></textarea>
<input class="inputBtn" value="创建列表" id="submit_list" type="submit" style="padding: 3px 5px;">
<input class="inputBtn" value="关注角色" id="add_follow" type="submit" style="padding: 3px 5px;">
<input class="inputBtn" value="关注竞拍" id="add_auction" type="submit" style="padding: 3px 5px;">
<input class="inputBtn" value="参与竞拍" id="join_auction" type="submit" style="padding: 3px 5px;">
<input class="inputBtn" value="参与ICO" id="join_ico" type="submit" style="padding: 3px 5px;">
</div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;
	function get_charas_list(){
		charas_list = [];
		let charas = $('.bibeBox textarea').val().split('\n');
		for(let i = 0; i < charas.length; i++){
			try{
				let charaId = charas[i].match(/(character\/|crt\/)?(\d+)/)[2];
				charas_list.push(charaId);
			}catch(e) {};
		}
	}
	$('body').append(dialog);
	$('#TB_closeWindowButton').on('click', closeDialog);
	$('#TB_overlay').on('click', closeDialog);
	$('#submit_list').on('click', () => {
		get_charas_list();
		loadTemperaryList(1);
		closeDialog();
	});
	$('#add_follow').on('click', () => {
		get_charas_list();
		for(let i = 0; i < charas_list.length; i++){
			let charaId = charas_list[i].toString();
			if(followList.charas.includes(charaId)){
				followList.charas.splice(followList.charas.indexOf(charaId),1);
				followList.charas.unshift(charaId);
			}
			else{
				followList.charas.unshift(charaId);
			}
			localStorage.setItem('TinyGrail_followList',JSON.stringify(followList));
		}
		loadFollowChara(1);
		closeDialog();
	});

	$('#add_auction').on('click', () => {
		get_charas_list();
		for(let i = 0; i < charas_list.length; i++){
			let charaId = charas_list[i].toString();
			if(followList.auctions.includes(charaId)){
				followList.auctions.splice(followList.auctions.indexOf(charaId),1);
				followList.auctions.unshift(charaId);
			}
			else{
				followList.auctions.unshift(charaId);
			}
			localStorage.setItem('TinyGrail_followList',JSON.stringify(followList));
		}
		loadFollowAuction(1);
		closeDialog();
	});

	$('#join_auction').on('click', () => {
		get_charas_list();
		$('#eden_tpc_list ul').html('');
		loadTemperaryList(1);
		joinAuctions(charas_list);
		closeDialog();
	});

	$('#join_ico').on('click', () => {
		get_charas_list();
		postData('chara/list', charas_list).then((d)=>{
			autoJoinICO(d.Value);
			loadTemperaryList(1);
			closeDialog();
		});
	});
}

function loadTemperaryList(page){
	let start = 50 * (page - 1);
	let ids = charas_list.slice(start, start+50);
	console.log(ids);
	let totalPages = Math.ceil(charas_list.length / 50);
	postData('chara/list', ids).then((d)=>{
		if (d.State === 0) {
			loadCharacterList(d.Value, page, totalPages, loadTemperaryList, 'chara',false);
		}
	});
}

function loadScratch(){
	$('#eden_tpc_list ul').html('');
	$('#eden_tpc_list ul').append(`<li class="line_odd item_list" style="text-align: center;">[刮刮乐]</li>`);
	let scratch_results = [],scratch_ids = [],chaosCube_results = [],chaosCube_ids = [];
	scratch();
	function scratch(){
		getData('event/scratch/bonus2').then((d) => {
			if (d.State == 0) {
				for(let i = 0; i < d.Value.length; i++){
					scratch_results.push(d.Value[i]);
					scratch_ids.push(d.Value[i].Id);
				}
				if(!d.Value.length){
					scratch_results.push(d.Value);
					scratch_ids.push(d.Value.Id);
				}
				scratch();
			} else {
				postData('chara/list', scratch_ids).then((d)=>{
					for(let i = 0; i < d.Value.length; i++){
						d.Value[i].Sacrifices = scratch_results[i].Amount;
						d.Value[i].Current = scratch_results[i].SellPrice;
					}
					loadCharacterList(d.Value, 2, 2, loadScratch, 'chara',false);
					$('#eden_tpc_list ul').append(`<li class="line_odd item_list" style="text-align: center;">[混沌魔方]</li>`);
					chaosCube();
				});
			}
		});
	}

	function chaosCube(){
		let templeId = ItemsSetting.chaosCube;
		if(templeId){
			postData(`magic/chaos/${templeId}`, null).then((d)=>{
				console.log(d);
				if (d.State == 0) {
					for(let i = 0; i < d.Value.length; i++){
						chaosCube_results.push(d.Value[i]);
						chaosCube_ids.push(d.Value[i].Id);
					}
					if(!d.Value.length){
						chaosCube_results.push(d.Value);
						chaosCube_ids.push(d.Value.Id);
					}
					chaosCube();
				} else {
					if(d.Message != '今日已超过使用次数限制或资产不足。'){
						alert(d.Message);
						chaosCube();
					}
					else postData('chara/list', chaosCube_ids).then((d)=>{
						for(let i = 0; i < d.Value.length; i++){
							d.Value[i].Sacrifices = chaosCube_results[i].Amount;
							d.Value[i].Current = chaosCube_results[i].SellPrice;
						}
						loadCharacterList(d.Value, 2, 2, loadScratch, 'chara',false);
					});
				}
			});
		}
		else alert('未设置施放混沌魔方的圣殿，请先在角色圣殿施放一次混沌魔方即可完成预设');
	}
}

function loadMagic(){
	closeDialog();
	ItemsSetting = JSON.parse(localStorage.getItem('TinyGrail_ItemsSetting')) || {};
	let templeId = ItemsSetting.chaosCube || '';
	let monoId = ItemsSetting.guidepost ? ItemsSetting.guidepost.monoId : '';
	let toMonoId = ItemsSetting.guidepost ? ItemsSetting.guidepost.toMonoId : '';
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<table align="center" width="98%" cellspacing="0" cellpadding="5" class="settings">
<tr><td title="消耗圣殿10点固定资产，获取随机角色10-100股随机数量">混沌魔方</td>
<td>炮塔：<input id="chaosCube" type="number" style="width:60px" value="${templeId}"></td><td></td>
<td><input class="inputBtn" value="发射" id="submit_chaosCube" type="submit"></td></tr>
<tr><td title="消耗圣殿100点固定资产，获取指定股票10-100股随机数量，目标人物的等级要小于或等于发动攻击圣殿的人物等级">虚空道标</td>
<td>炮塔：<input id="monoId" type="number" style="width:60px" value="${monoId}"></td>
<td>目标：<input id="toMonoId" type="number" style="width:60px" value="${toMonoId}"></td>
<td><input class="inputBtn" value="发射" id="submit_guidepost" type="submit"></td></tr>
<tr><td title="用一个角色的活股或固定资产，给另一个角色的圣殿消耗进行补充，目标人物的等级要小于或等于发动攻击圣殿的人物等级">星光碎片</td>
<td>能源：<input id="supplyId" type="number" style="width:60px"></td>
<td>目标：<input id="toSupplyId" type="number" style="width:60px"></td></tr>
<td></td><td>类型：<select id="isTemple" style="width:60px"><option value="false">活股</option><option value="true" selected="selected">塔股</option></select></td>
<td>数量：<input id="amount" type="number" style="width:60px" value="100"></td>
<td><input class="inputBtn" value="充能" id="submit_stardust" type="submit"></td></tr>
</tbody></table>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;

	$('body').append(dialog);
	$('#TB_closeWindowButton').on('click', closeDialog);
	$('#TB_overlay').on('click', closeDialog);
	$('#submit_chaosCube').on('click', () => {
		let templeId = $('#chaosCube').val();
		ItemsSetting.chaosCube = templeId;
		localStorage.setItem('TinyGrail_ItemsSetting',JSON.stringify(ItemsSetting));
		postData(`magic/chaos/${templeId}`, null).then((d)=>{
			closeDialog();
			console.log(d);
			if (d.State == 0) {
				$('#eden_tpc_list ul').html('');
				$('#eden_tpc_list ul').append(`<li class="line_odd item_list" style="text-align: center;">[混沌魔方]</li>`);
				let Id = d.Value.Id;
				let Amount = d.Value.Amount;
				let SellPrice = d.Value.SellPrice;
				postData('chara/list', [Id]).then((d)=>{
					for(let i = 0; i < d.Value.length; i++){
						d.Value[i].Sacrifices = Amount;
						d.Value[i].Current = SellPrice;
					}
					loadCharacterList(d.Value, 2, 2, loadScratch, 'chara',false);
				});
			}
			else alert(d.Message);
		});
	});
	$('#submit_guidepost').on('click', () => {
		let monoId = $('#monoId').val();
		let toMonoId = $('#toMonoId').val();
		ItemsSetting.guidepost = {"monoId":monoId,"toMonoId":toMonoId};
		localStorage.setItem('TinyGrail_ItemsSetting',JSON.stringify(ItemsSetting));
		postData(`magic/guidepost/${monoId}/${toMonoId}`, null).then((d)=>{
			closeDialog();
			console.log(d);
			if (d.State == 0) {
				$('#eden_tpc_list ul').html('');
				$('#eden_tpc_list ul').append(`<li class="line_odd item_list" style="text-align: center;">[虚空道标]</li>`);
				let Id = d.Value.Id;
				let Amount = d.Value.Amount;
				let SellPrice = d.Value.SellPrice;
				postData('chara/list', [Id]).then((d)=>{
					for(let i = 0; i < d.Value.length; i++){
						d.Value[i].Sacrifices = Amount;
						d.Value[i].Current = SellPrice;
					}
					loadCharacterList(d.Value, 2, 2, loadScratch, 'chara',false);
				});
			}
			else alert(d.Message);
		});
	});
	$('#submit_stardust').on('click', () => {
		let supplyId = $('#supplyId').val();
		let toSupplyId = $('#toSupplyId').val();
		let isTemple = $('#isTemple').val();
		let amount = $('#amount').val();
		postData(`magic/stardust/${supplyId}/${toSupplyId}/${amount}/${isTemple}`, null).then((d)=>{
			closeDialog();
			console.log(d);
			if (d.State == 0) {
				alert(d.Value);
				$('#eden_tpc_list ul').html('');
				$('#eden_tpc_list ul').append(`<li class="line_odd item_list" style="text-align: center;">[星光碎片]</li>`);
				postData('chara/list', [supplyId,toSupplyId]).then((d)=>{
					loadCharacterList(d.Value, 2, 2, loadScratch, 'chara',false);
				});
			}
			else alert(d.Message);
		});
	});
}

function sellOut(){
	$(`#eden_tpc_list .item_list`).removeAttr('onclick');
	$('#eden_tpc_list .item_list').each((i,e)=>{
		let id = $(e).data('id');
		let sell_btn = `<span><small data-id="${id}" class="sell_btn">[卖出]</small></span>`;
		if(!$(e).find('.sell_btn').length){
			$(`#eden_tpc_list li[data-id=${id}] .row`).append(sell_btn);
		}
	});
	$('.sell_btn').on('click', (e) => {
		let id = $(e.target).data('id');
		if(id){
			let price_tag = $(`#eden_tpc_list li[data-id=${id}]`).find('div.tag')[0].innerText.match(/₵([0-9]*(\.[0-9]{1,2})?)/);
			let price_now = price_tag ? price_tag[1] : 0; //获取抽奖时买价
			getData(`chara/${id}`).then((d)=>{
				let initPrice = chara_initPrice[id] ? chara_initPrice[id].init_price : d.Value.Price;
				let price = Math.max(parseFloat(price_now), parseFloat(initPrice).toFixed(2), d.Value.Current.toFixed(2));
				getData(`chara/user/${id}`).then((d)=>{
					let amount = d.Value.Amount;
					if(amount){
						postData(`chara/ask/${id}/${price}/${amount}`, null).then((d)=>{
							if(d.Message) console.log(`#${id}: ${d.Message}`);
							else console.log(`卖出委托#${id} ${price}*${amount}`);
						});
					}
				});
			});
		}
		$(`#eden_tpc_list li[data-id=${id}]`).remove();
	});
}

function cancelBids(){//取消买单
	if (!confirm("取消全部买单？")) return;
	$('#eden_tpc_list ul').html('');
	getData(`chara/user/assets`).then((d)=>{
		let Balance = d.Value.Balance;
		getData(`chara/bids/0/1/1000`).then((d)=>{
			cancel_All_Bids(d.Value.Items, Balance);
		});
	});
}

async function cancel_All_Bids(charas, Balance){
	for(let i = 0; i< charas.length; i++){
		let id = charas[i].Id;
		let name = charas[i].Name;
		let avatar = `<a href="/rakuen/topic/crt/${id}?trade=true" class="avatar l" target="right"><span class="avatarNeue avatarReSize32 ll" style="background-image:url('${normalizeAvatar(charas[i].Icon)}')"></span></a>`;
		await getData(`chara/user/${id}`).then((d)=>{
			let line = 'line_even';
			if (i%2==0) line = 'line_odd';
			let tid = d.Value.Bids[0].Id;
			let price = d.Value.Bids[0].Price;
			let amount = d.Value.Bids[0].Amount;
			Balance += price * amount;
			postData(`chara/bid/cancel/${tid}`, null).then((d)=>{
				let message = `<li class="${line} item_list item_log" data-id="${id}">${avatar}<span class="tag raise">+${formatNumber(price*amount,2)}</span>
₵${formatNumber(Balance,2)}<span class="row"><small class="time">取消买单(${tid}) #${id} 「${name}」 ${price}*${amount}</small></span></li>`
				$('#eden_tpc_list ul').prepend(message);
			});
		});
	}
}

/*
function withdrawAuction(){//取消拍卖(非周六时间)以提取现金，记录原订单，再次点击存回
	$('#eden_tpc_list ul').html('');
	getData(`chara/user/assets`).then((d)=>{
		let Balance = d.Value.Balance;
		getData(`chara/user/auction/1/500`).then((d)=>{
			let charas = [];
			for(let i = 0; i< d.Value.Items.length; i++){
				charas.push(d.Value.Items[i]);
			}
			withdrawAuctions(charas, Balance);
		});
	});
}

function withdrawBid(){//取消买单以提取现金，记录原订单，再次点击存回
	$('#eden_tpc_list ul').html('');
	getData(`chara/user/assets`).then((d)=>{
		let Balance = d.Value.Balance;
		getData(`chara/bids/0/1/1000`).then((d)=>{
			let charas = [];
			for(let i = 0; i< d.Value.Items.length; i++){
				charas.push(d.Value.Items[i]);
			}
			withdrawBids(charas, Balance);
		});
	});
}

async function withdrawAuctions(charas, Balance){
	for(let i = 0; i< charas.length; i++){
		let charaId = charas[i].CharacterId.toString();
		let Id = charas[i].Id.toString();
		let name = charas[i].Name;
		let state = charas[i].State;
		let price = charas[i].Price;
		let amount = charas[i].Amount;
		Balance += price * amount;
		if(state == 0 && price && amount){
			let line = 'line_even';
			if (i%2==0) line = 'line_odd';
			//postData(`chara/auction/cancel/${Id}`, null).then((d)=>{
			let message = `<li class="${line} item_list item_log" data-id="${charaId}"><span class="tag raise">+${formatNumber(price*amount,2)}</span>
₵${formatNumber(Balance,2)}<span class="row"><small class="time">取消拍卖(${Id}) #${charaId} 「${name}」 ${price}*${amount}</small></span></li>`
			$('#eden_tpc_list ul').prepend(message);
			//});
		}
	}
}

async function withdrawBids(charas, Balance){
	for(let i = 0; i< charas.length; i++){
		let charaId = charas[i].Id.toString();
		let name = charas[i].Name;
		await retry(getData(`chara/user/${charaId}`).then((d)=>{
			for(let i = 0; i< d.Value.Bids.length; i++){
				let line = 'line_even';
				if (i%2==0) line = 'line_odd';
				let tid = d.Value.Bids[i].Id;
				let price = d.Value.Bids[i].Price;
				let amount = d.Value.Bids[i].Amount;
				Balance += price * amount;
				//postData(`chara/bid/cancel/${tid}`, null).then((d)=>{
					let message = `<li class="${line} item_list item_log" data-id="${charaId}"><span class="tag raise">+${formatNumber(price*amount,2)}</span>
₵${formatNumber(Balance,2)}<span class="row"><small class="time">取消买单(${tid}) #${charaId} 「${name}」 ${price}*${amount}</small></span></li>`
					$('#eden_tpc_list ul').prepend(message);
				//});
			}
		}));
	}
}
*/

function openSettings(){ //设置
	closeDialog();
	settings = JSON.parse(localStorage.getItem('TinyGrail_settings')) ||{"pre_temple":"on","hide_grail":"off","auction_num":"one","merge_order":"on","get_bonus":"on","gallery":"off"};
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<table align="center" width="98%" cellspacing="0" cellpadding="5" class="settings">
<tbody><tr><td valign="top" width="50%">主页显示/隐藏小圣杯</td><td valign="top">
<select id="set1"><option value="off" selected="selected">显示</option><option value="on">隐藏</option></select></td></tr>
<tr><td valign="top" width="50%">将自己圣殿排到第一个显示</td><td valign="top">
<select id="set2"><option value="on" selected="selected">是</option><option value="off">否</option></td></tr>
<tr><td valign="top" width="50%">默认拍卖数量</td><td valign="top">
<select id="set3"><option value="one" selected="selected">1</option><option value="all">全部</option></td></tr>
<tr><td valign="top" width="50%" title="合并同一时间同一价格的历史订单记录">合并历史订单</td><td valign="top">
<select id="set4"><option value="on" selected="selected">是</option><option value="off">否</option></td></tr>
<tr><td valign="top" width="50%">周六自动提醒领取股息</td><td valign="top">
<select id="set5"><option value="on" selected="selected">是</option><option value="off">否</option></td></tr>
<tr><td valign="top" width="50%">圣殿画廊</td><td valign="top">
<select id="set6"><option value="off" selected="selected">关</option><option value="on">开</option></td></tr>
<tr><td valign="top" width="12%"><input class="inputBtn" value="保存" id="submit_setting" type="submit"></td><td valign="top"></td></tr>
</tbody></table>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;
	$('body').append(dialog);
	$('#TB_closeWindowButton').on('click', closeDialog);
	$('#TB_overlay').on('click', closeDialog);
	$('#set1').val(settings.hide_grail);
	$('#set2').val(settings.pre_temple);
	$('#set3').val(settings.auction_num);
	$('#set4').val(settings.merge_order);
	$('#set5').val(settings.get_bonus);
	$('#set6').val(settings.gallery);
	$('#submit_setting').on('click', () => {
		settings.hide_grail = $('#set1').val();
		settings.pre_temple = $('#set2').val();
		settings.auction_num = $('#set3').val();
		settings.merge_order = $('#set4').val();
		settings.get_bonus = $('#set5').val();
		settings.gallery = $('#set6').val();
		localStorage.setItem('TinyGrail_settings',JSON.stringify(settings));
		$('#submit_setting').val('已保存');
		setTimeout(()=>{closeDialog();},500);
	});
}

function loadCharacterList(list, page, total, more, type,showCancel) {
	$('#eden_tpc_list ul .load_more').remove();
	if (page === 1) $('#eden_tpc_list ul').html('');
	//console.log(list);
	for (let i = 0; i < list.length; i++) {
		let item = list[i];
		//console.log(item);
		if(type == 'balance'){
			let log = renderBalanceLog(item, lastEven);
			$('#eden_tpc_list ul').append(log);
		}
		else{
			let chara = renderCharacter(item, type, lastEven ,showCancel);
			$('#eden_tpc_list ul').append(chara);
		}
		lastEven = !lastEven;
	}
	$('.cancel_auction').on('click', (e) => {
		//if (!confirm('确定取消关注？')) return;
		let id = $(e.target).data('id').toString();
		if(type == 'chara') followList.charas.splice(followList.charas.indexOf(id),1);
		else if(type == 'auction') followList.auctions.splice(followList.auctions.indexOf(id),1);
		localStorage.setItem('TinyGrail_followList',JSON.stringify(followList));
		$(`#eden_tpc_list li[data-id=${id}]`).remove();
	});

	$('.fill_costs').on('click', (e) => {
		let id = $(e.target).data('id');
		let lv = $(e.target).data('lv');
		let cost = $(e.target).data('cost');
		fillCosts(id, lv, cost);
		$(e.target).remove();
	});

	$('#eden_tpc_list .item_list').on('click', listItemClicked);
	if (page != total && total > 0) {
		let loadMore = `<li class="load_more"><button id="loadMoreButton" class="load_more_button" data-page="${page + 1}">[加载更多]</button></li>`;
		$('#eden_tpc_list ul').append(loadMore);
		$('#loadMoreButton').on('click', function () {
			let page = $(this).data('page');
			if (more) more(page);
		});
	} else {
		let noMore = '暂无数据';
		if (total > 0)
			noMore = '加载完成';

		$('#eden_tpc_list ul').append(`<li class="load_more sub">[${noMore}]</li>`);
	}
}

function renderBalanceLog(item, even) {
  var line = 'line_odd';
  if (even) line = 'line_even';

  var change = '';
  if (item.Change > 0)
    change = `<span class="tag raise large">+₵${formatNumber(item.Change, 2)}</span>`;
  else if (item.Change < 0)
    change = `<span class="tag fall large">-₵${formatNumber(Math.abs(item.Change), 2)}</span>`;

  var amount = '';
  if (item.Amount > 0)
    amount = `<span class="tag new large">+${formatNumber(item.Amount, 0)}</span>`;
  else if (item.Amount < 0)
    amount = `<span class="tag even large">${formatNumber(item.Amount, 0)}</span>`;

  var id = '';
  if (item.Type === 4 || item.Type === 5 || item.Type === 6) {
    id = `data-id="${item.RelatedId}"`;
  }

  var log = `<li class="${line} item_list item_log" ${id}>
                <div class="inner">₵${formatNumber(item.Balance, 2)}
                  <small class="grey">${formatTime(item.LogTime)}</small>
                  <span class="row"><small class="time">${item.Description}</small></span>
                </div>
                <span class="tags">
                  ${change}
                  ${amount}
                </span>
              </li>`
  return log;
}

function fillCosts(id, lv, cost){
	closeDialog();
	ItemsSetting = JSON.parse(localStorage.getItem('TinyGrail_ItemsSetting')) || {};
	let supplyId = ItemsSetting.stardust ? ItemsSetting.stardust[lv] : '';
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title" title="用一个角色的活股或固定资产，给另一个角色的圣殿消耗进行补充，目标人物的等级要小于或等于发动攻击圣殿的人物等级">星光碎片</div>
<div class="desc" style="display:none"></div>
<table align="center" width="98%" cellspacing="0" cellpadding="5" class="settings">
<tr><td>能源：<input id="supplyId" type="number" style="width:60px" value="${supplyId}"></td>
<td>目标：<input id="toSupplyId" type="number" style="width:60px" value="${id}"></td></tr>
<td>类型：<select id="isTemple" style="width:60px"><option value="false">活股</option><option value="true" selected="selected">塔股</option></select></td>
<td>数量：<input id="amount" type="number" style="width:60px" value="${cost}"></td></tr>
<tr><td><input class="inputBtn" value="充能" id="submit_stardust" type="submit"></td></tr>
</tbody></table>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;

	$('body').append(dialog);
	$('#TB_closeWindowButton').on('click', closeDialog);
	$('#TB_overlay').on('click', closeDialog);
	if(!supplyId){
		$('#TB_window .desc').text(`当前等级的能源角色id未设定，补充过一次之后会记住此等级的能源角色id`);
		$('#TB_window .desc').show();
	}
	$('#submit_stardust').on('click', () => {
		let supplyId = $('#supplyId').val();
		let toSupplyId = $('#toSupplyId').val();
		let isTemple = $('#isTemple').val();
		let amount = $('#amount').val();
		if(supplyId){
			if(!ItemsSetting.stardust) ItemsSetting.stardust = {};
			ItemsSetting.stardust[lv] = supplyId;
			localStorage.setItem('TinyGrail_ItemsSetting',JSON.stringify(ItemsSetting));
			postData(`magic/stardust/${supplyId}/${toSupplyId}/${amount}/${isTemple}`, null).then((d)=>{
				closeDialog();
				if (d.State == 0) alert(d.Value);
				else alert(d.Message);
			});
		}
		else alert('角色id不能为空');
	});
}

function renderCharacter(item,type,even,showCancel) {
	let line = 'line_odd';
	if (even) line = 'line_even';
	let amount = `<small title="固定资产">${formatNumber(item.Sacrifices, 0)}</small>`;

	let tag = renderCharacterTag(item);
	let depth = renderCharacterDepth(item);
	let id = item.Id;
	if(item.CharacterId) id = item.CharacterId;
	let time = item.LastOrder;
	let avatar = `<a href="/rakuen/topic/crt/${id}?trade=true" class="avatar l" target="right"><span class="avatarNeue avatarReSize32 ll" style="background-image:url('${normalizeAvatar(item.Icon)}')"></span></a>`;
	let cancel = '';
	if(showCancel) cancel = `<span><small data-id="${id}" class="cancel_auction">[取消]</small></span>`;
	let badge = renderBadge(item, true, true, true);
	let chara;

	if(type=='auction'){
		chara = `<li class="${line} item_list" data-id="${id}">${avatar}<div class="inner">
<a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}${badge}</a> <small class="grey">(+${item.Rate.toFixed(2)})</small>
<div class="row"><small class="time">${formatTime(time)}</small>
${cancel}</div></div>${tag}</li>`
	}
	else if (type=='ico'){
		badge = renderBadge(item, false, false, false);
		chara = `<li class="${line} item_list" data-id="${id}">${avatar}<div class="inner">
<a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}${badge}</a>
<div class="row"><small class="time">${formatTime(item.End)}</small><span><small>${formatNumber(item.State, 0)} / ${formatNumber(item.Total, 1)}</small></span>
</div></div><div class="tags tag lv1">ICO进行中</div></li>`
	}
	else if (type=='temple'){
		let costs = '';
		if( item.Assets - item.Sacrifices < 0){
			costs = `<small class="fall" title="损耗">${item.Assets - item.Sacrifices}</small>
<span><small data-id="${id}" data-lv="${item.CharacterLevel}"  data-cost="${item.Sacrifices - item.Assets}" class="fill_costs">[补充]</small></span>`;
		}
		avatar = `<a href="/rakuen/topic/crt/${id}?trade=true" class="avatar l" target="right"><span class="avatarNeue avatarReSize32 ll" style="background-image:url('${normalizeAvatar(item.Cover)}')"></span></a>`;
		chara = `<li class="${line} item_list" data-id="${id}" data-lv="${item.CharacterLevel}">${avatar}<div class="inner">
<a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}<span class="badge lv${item.CharacterLevel}">lv${item.CharacterLevel}</span></a> <small class="grey">(+${item.Rate.toFixed(2)})</small>
<div class="row"><small class="time" title="创建时间">${formatTime(item.Create)}</small><small title="固有资产 / 献祭值">${item.Assets} / ${item.Sacrifices}</small>${costs}</div></div>
<div class="tag lv${item.Level}">${item.Level}级圣殿</div></li>`
	}
	else if (item.CharacterId) {
		let pre = caculateICO(item);
		badge = renderBadge(item, false, false, false);
		//let percent = formatNumber(item.Total / pre.Next * 100, 0);
		chara = `<li class="${line} item_list" data-id="${id}">${avatar}<div class="inner">
<a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}${badge}</a> <small class="grey">(ICO进行中: lv${pre.Level})</small>
<div class="row"><small class="time">${formatTime(item.End)}</small><span><small>${formatNumber(item.Users, 0)}人 / ${formatNumber(item.Total, 1)} / ₵${formatNumber(pre.Price, 2)}</small></span>
${cancel}</div></div><div class="tags tag lv${pre.Level}">ICO进行中</div></li>`
	}
	else {
		chara = `<li class="${line} item_list" data-id="${id}">${avatar}<div class="inner">
<a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}${badge}</a> <small class="grey">(+${item.Rate.toFixed(2)} / ${formatNumber(item.Total, 0)} / ₵${formatNumber(item.MarketValue, 0)})</small>
<div class="row"><small class="time">${formatTime(item.LastOrder)}</small>${amount}<span title="买入 / 卖出 / 成交">${depth}</span>
${cancel}</div></div>${tag}</li>`
	}

	return chara;
}

function showInitialPrice(charaId){
	if(chara_initPrice[charaId]){
		let init_price = chara_initPrice[charaId].init_price;
		let time = chara_initPrice[charaId].time;
		$($('#grailBox .info .text')[1]).append(`<span title="上市时间:${time}">发行价：${init_price}</span>`);
		sell_out(charaId, init_price);
	}
	else getData(`chara/charts/${charaId}/2019-08-08`).then((d)=>{
		let init_price = d.Value[0].Begin.toFixed(2);
		let time = d.Value[0].Time.replace('T',' ');
		chara_initPrice[charaId] = {"init_price":init_price, "time":time};
		localStorage.setItem('TinyGrail_chara_initPrice',JSON.stringify(chara_initPrice));
		$($('#grailBox .info .text')[1]).append(`<span title="上市时间:${time}">发行价：${init_price}</span>`);
		sell_out(charaId, init_price);
	});
}

function sell_out(charaId, init_price){
	$($('#grailBox .info .text')[1]).append(`<button id="sell_out" class="text_button" title="以发行价全部卖出">[全部卖出]</button>`);
	$('#sell_out').on('click', function(){
		getData(`chara/user/${charaId}`).then((d)=>{
			let amount = d.Value.Amount;
			$(`.ask .price`).val(init_price);
			$(`.ask .amount`).val(d.Value.Amount);
		});
	});
}

function showPrice(chara){
	let price = chara.Price.toFixed(2);
	$($('#grailBox .info .text')[1]).append(`<span>评估价：${price}</span>`);
}




/*
function splitAmount(amount) {
	let splitter = 500;
	let len = Math.ceil(amount / splitter);
	let splitAmounts = Array(len).fill(splitter);
	if(len == 1) {
		splitAmounts[len-1] = amount;
	} else if(amount % splitter >= 100) {
		splitAmounts[splitAmounts.length-1] = amount % splitter;
	} else if(amount % splitter > 0) {
		splitAmounts[splitAmounts.length-2] -= 100;
		splitAmounts[splitAmounts.length-1] = amount % splitter + 100;
	}
	return splitAmounts;
}

function setSplitButton(type){
	let text = (type == 'bid') ? '拆单买入' : '拆单卖出';
	$(`#grailBox .trade_box .${type} .trade_list`).append(`<div style="display:none"><div class="label total">0</div><button id="split_${type}Button" class="active ${type}">${text}</button></div>`);

	$(`.${type} .amount`).on('input',function () {
		let amount = $(`.${type} .amount`).val();
		if(amount>500){
			$($(`#split_${type}Button`).parent()).show();
			$($(`#${type}Button`).parent()).hide();
		}
		else{
			$($(`#split_${type}Button`).parent()).hide();
			$($(`#${type}Button`).parent()).show();
		}
	});
}

function splitorderList(charaId){
	setSplitButton('bid');
	setSplitButton('ask');

	async function doSplit(type) {
		let price = $(`.${type} .price`).val();
		let amount = $(`.${type} .amount`).val();
		let splitAmounts = splitAmount(amount);
		$(`#split_${type}Button`).attr('disabled', true);
		for(let x of splitAmounts) {
			await retry(postData(`chara/${type}/${charaId}/${price}/${x}`, null).then((d)=>{
				if(d.Message) alert(d.Message);
			}))
		}
		location.reload();
	};

	$('#split_bidButton').on('click', () => doSplit('bid'));
	$('#split_askButton').on('click', () => doSplit('ask'));
}
*/

function showGallery(){//显示画廊
	if(settings.gallery == 'on'){
		let index = 0;
		$('body').on('keydown', function(e) {
			switch(event.keyCode ){
				case 37:
					closeDialog();
					$(`.item .card`)[index-1].click();
					break;
				case 39:
					closeDialog();
					$(`.item .card`)[index+1].click();
					break;
			}
		});
		$('body').on('touchstart', '#TB_window.temple', function(e) {
			let touch = e.originalEvent;
			let	startX = touch.changedTouches[0].pageX;
			$(this).on('touchmove', function(e) {
				e.preventDefault();
				touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				if (touch.pageX - startX > 20) {//向左
					closeDialog();
					$(`.item .card`)[index-1].click();
					$(this).off('touchmove');
				} else if (touch.pageX - startX < -20) {//向右
					closeDialog();
					$(`.item .card`)[index+1].click();
					$(this).off('touchmove');
				};
			});
		}).on('touchend', function() {
			$(this).off('touchmove');
		});
		setInterval(function (){
			$(`.item .card`).on('click', (e) => {
				index = $(`.item .card`).index(e.currentTarget);
				gallery_mode = true;
			});
		},1000);
	}
}

function priceWarning(){
	let price = $(`.bid .price`).val();
	let amount = $(`.bid .amount`).val();
	$(`#bidButton`).after(`<button style="display:none" id="confirm_bidButton" class="active bid">买入</button>`);
	$(`.bid .price`).on('input',function () {
		let price_now = $(`.bid .price`).val();
		if(price_now > Math.max(price * 3,100)){
			$(`.bid .price`).css({"color":"red"});
			$(`#confirm_bidButton`).show();
			$(`#bidButton`).hide();
		}
		else{
			$(`#confirm_bidButton`).hide();
			$(`#bidButton`).show();
			$(`.bid .price`).css({"color":"inherit"});
		}
	});
	$('#confirm_bidButton').on('click', function(){
		let price = $(`.bid .price`).val();
		let amount = $(`.bid .amount`).val();
		if (!confirm(`买入价格过高提醒！\n确定以${price}的价格买入${amount}股？`)) {
			return;
		}
		$(`#bidButton`).click();
	});
}

function showOwnTemple() {
	let pre_temple = settings.pre_temple;
	let temples = $('#grailBox .assets_box .assets .item');
	let me = followList.user;
	if(!me){
		me = $('#new_comment .reply_author a')[0].href.split('/').pop();
		followList.user = me;
		localStorage.setItem('TinyGrail_followList',JSON.stringify(followList));
	}
	for(let i = 0; i < temples.length; i++) {
		let user = temples[i].querySelector('.name a').href.split('/').pop();
		if(user === me) {
			temples[i].classList.add('my_temple');
			temples[i].classList.remove('replicated');
			if(pre_temple == 'on') $('#grailBox .assets_box .assets').prepend(temples[i]);
			break;
		}
	}
	$('#expandButton').on('click', () => {showOwnTemple();});
}

function showTempleRate(chara){
	let b = chara.Type ? 1 : 0;
	let rate = chara.Rate;
	let level = chara.Level;
	let price = chara.Price;
	getData(`chara/temple/${chara.Id}`).then((d)=>{
		let templeAll = {1:0,2:0,3:0};
		for (let i = 0; i < d.Value.length; i++) {
			templeAll[d.Value[i].Level]++;
		}
		let templeRate = rate * (level+1) * 0.3;
		$('#grailBox .assets_box .bold .sub').attr('title', '活股股息:'+formatNumber(rate,2));
		$('#grailBox .assets_box .bold .sub').before(`<span class="sub"> (${templeAll[3]} + ${templeAll[2]} + ${templeAll[1]})</span>`);
		$('#expandButton').before(`<span class="sub" title="圣殿股息:${formatNumber(templeRate,2)}"> (${formatNumber(templeRate,2)})</span>`);
	});
}

function changeTempleCover(charaId){
	$('#grailBox .assets .item').on('click', (e) => {
		let me = followList.user;
		let temple = $(e.currentTarget).data('temple');
		let user = temple.Name;
		launchObserver({
			parentNode: document.body,
			selector: '#TB_window .action',
			successCallback: ()=>{
				if(user == me) setChaosCube(temple);
				else addButton(temple,user);
			},
		});
	});

	function setChaosCube(temple){
		$('#chaosCubeButton').on('click', () => {
			let templeId = temple.CharacterId;
			ItemsSetting.chaosCube = templeId;
			localStorage.setItem('TinyGrail_ItemsSetting',JSON.stringify(ItemsSetting));
		});
	}

	function addButton(temple,user){
		$('#TB_window .action').append(`<button id="changeCoverButton2" class="text_button" title="修改圣殿封面">[修改]</button>
<button id="copyCoverButton" class="text_button" title="复制圣殿图片为自己圣殿的封面">[复制]</button>`);

		$('#changeCoverButton2').on('click', () => {
			let cover = prompt("图片url(你可以复制已有圣殿图片的url)：");
			let url = 'https://tinygrail.oss-cn-hangzhou.aliyuncs.com/'+ cover.match(/cover\/\S+\.jpg/)[0];
			postData(`chara/temple/cover/${charaId}/${temple.UserId}`, url).then((d)=> {
				if (d.State == 0) {
					alert("更换封面成功。");
					$('#TB_window img.cover').attr('src',cover);
					$('#grailBox .assets_box .assets .item').each(function (){
						if(user == this.querySelector('.name a').href.split('/').pop())
							$(this).find('div.card').css({"background-image":"url(https://tinygrail.mange.cn/"+cover.match(/cover\/\S+\.jpg/)[0]+"!w150)"});
					});
				} else {
					alert(d.Message);
				}
			});
		});

		$('#copyCoverButton').on('click', () => {
			let cover = $('#TB_window .container .cover').attr('src');
			let url = 'https://tinygrail.oss-cn-hangzhou.aliyuncs.com/'+ cover.match(/cover\/\S+\.jpg/)[0];
			postData(`chara/temple/cover/${charaId}`, url).then((d)=> {
				if (d.State == 0) {
					alert("更换封面成功。");
					location.reload();
				} else {
					alert(d.Message);
				}
			});
		});
	}
}

function mergeorderList(orderListHistory){
	let mergedorderList = [], i = 0;
	mergedorderList.push(orderListHistory[0]);
	for(let j = 1; j < orderListHistory.length; j++){
		if((orderListHistory[j].Price == mergedorderList[i].Price) && Math.abs(new Date(orderListHistory[j].TradeTime) - new Date(mergedorderList[i].TradeTime))<10*1000){
			//10s内同价格订单合并
			mergedorderList[i].Amount += orderListHistory[j].Amount;
		}
		else{
			mergedorderList.push(orderListHistory[j]);
			i++;
		}
	}
	return mergedorderList;
}

function mergeorderListHistory(charaId){
	if(settings.merge_order == 'on') {
		getData(`chara/user/${charaId}`).then((d)=>{
			if (d.State === 0 && d.Value) {
				$(`.ask .ask_list li[class!=ask]`).hide();
				let askHistory = mergeorderList(d.Value.AskHistory);
				for (let i = 0; i < askHistory.length; i++) {
					let ask = askHistory[i];
					if(ask) $('.ask .ask_list').prepend(`<li title="${formatDate(ask.TradeTime)}">₵${formatNumber(ask.Price, 2)} / ${formatNumber(ask.Amount, 0)} / +${formatNumber(ask.Amount * ask.Price, 2)}<span class="cancel">[成交]</span></li>`);
				}
				$(`.bid .bid_list li[class!=bid]`).hide();
				let bidHistory = mergeorderList(d.Value.BidHistory);
				for (let i = 0; i < bidHistory.length; i++) {
					let bid = bidHistory[i];
					if(bid) $('.bid .bid_list').prepend(`<li title="${formatDate(bid.TradeTime)}">₵${formatNumber(bid.Price, 2)} / ${formatNumber(bid.Amount, 0)} / -${formatNumber(bid.Amount * bid.Price, 2)}<span class="cancel">[成交]</span></li>`);
				}

			}
		});
	}
}

function remove_empty(array){
	let arr = [];
	for(let i = 0; i < array.length; i++){
		if(array[i]) arr.push(array[i]);
	}
	return arr;
}
function formatBidPrice(price){
	return (price - Math.round(price))>=0 ? Math.round(price) : Math.round(price)-0.5;
}

function formatAskPrice(price){
	if(Number.isInteger(parseFloat(price))) return price;
	else return (price - Math.floor(price))>0.5 ? Math.ceil(price) : Math.floor(price)+0.5;
}

async function autoBuildTemple(charas){
	function buildTemple(chara,amount){
		postData(`chara/sacrifice/${chara.charaId}/${amount}/false`, null).then((d)=>{
			if (d.State == 0) {
				console.log(`#${chara.charaId} ${chara.name} 献祭${amount} 获得金额 ₵${d.Value.Balance.toFixed(2)}`);
				$('#autobuildButton').text('[自动建塔]');
				removeBuildTemple(chara.charaId);
			} else {
				console.log(`${d.Message}`);
			}
		});
	}
	function postBid(chara, price, amount, Amount, Sacrifices){
		postData(`chara/bid/${chara.charaId}/${price}/${amount}`, null).then((d)=>{
			if(d.Message) console.log(`#${chara.charaId} ${chara.name} ${d.Message}`);
			else{
				console.log(`买入成交 #${chara.charaId} ${chara.name} ${price}*${amount}`);
				if((Amount + Sacrifices + amount) >= chara.target){ //持股达到数量，建塔
					buildTemple(chara, chara.target - Sacrifices);
				}
			}
		});
	}
	function getAskin(Asks, low_price){ //获取可买入的卖单价格和总数
		let [price, amount] = [0,0];
		for(let i = 0; i < Asks.length; i++) {
			if(Asks[i].Price > 0 && Asks[i].Price <= low_price){
				amount += Asks[i].Amount;
				price = Asks[i].Price;
			}
		}
		return [price, amount];
	}
	function remove_myAsks(Asks, myAsks){
		for(let i = 0; i < Asks.length; i++) {
			for(let j = 0; j < myAsks.length; j++) {
				if(formatAskPrice(Asks[i].Price) == formatAskPrice(myAsks[j].Price)) Asks[i].Amount -= myAsks[j].Amount;
			}
			if(Asks[i].Amount == 0) delete Asks[i];
		}
		Asks = remove_empty(Asks);
		return Asks;
	}
	for (let i = 0; i < charas.length; i++) {
		let chara = charas[i];
		console.log(`自动建塔 check #${chara.charaId} ${chara.name}`);
		await getData(`chara/user/${chara.charaId}`).then((d)=>{
			let myAsks = d.Value.Asks;
			let Amount = d.Value.Amount;
			let Sacrifices = d.Value.Sacrifices;
			if(Sacrifices >= chara.target){
				removeBuildTemple(chara.charaId);
			}
			else if((Amount + Sacrifices) >= chara.target){ //持股达到数量，建塔
				buildTemple(chara, chara.target - Sacrifices);
			}
			else getData(`chara/depth/${chara.charaId}`).then((d)=>{
				let Asks = d.Value.Asks;
				Asks = remove_myAsks(Asks, myAsks);
				//console.log(Asks);
				let AskPrice = Asks[0] ? Asks[0].Price : 0;
				if(AskPrice && AskPrice <= chara.bidPrice){ //最低卖单低于买入上限，买入
					let [price,amount] = getAskin(Asks, chara.bidPrice);
					postBid(chara, price, Math.min(amount, chara.target - Amount - Sacrifices),Amount,Sacrifices);
				}
			});
		});
	}
}

function removeBuildTemple(charaId){
	for(let i = 0; i < autoTempleList.length; i++){
		if(autoTempleList[i].charaId == charaId){
			autoTempleList.splice(i,1);
			break;
		}
	}
	$('#autobuildButton').text('[自动建塔]');
	localStorage.setItem('TinyGrail_autoTempleList',JSON.stringify(autoTempleList));
}

function openBuildDialog(chara){
	autoTempleList = JSON.parse(localStorage.getItem('TinyGrail_autoTempleList')) || [];
	let charaId = chara.Id;
	if(chara.CharacterId) charaId = chara.CharacterId;
	let target = 500, bidPrice = 10;
	let intempleList = false, index = 0;
	for(let i = 0; i < autoTempleList.length; i++){
		if(autoTempleList[i].charaId == charaId){
			target = autoTempleList[i].target;
			bidPrice = autoTempleList[i].bidPrice;
			intempleList = true;
			index = i;
		}
	}
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title" title="目标数量 / 买入价格">
自动建塔 - #${charaId} 「${chara.Name}」 ${target} / ₵${bidPrice}</div>
<div class="desc"><p>当已献祭股数+持有股数达到目标数量时将自动建塔</p>
输入 目标数量 / 买入价格(不超过此价格的卖单将自动买入)</div>
<div class="label"><div class="trade build">
<input class="target" type="number" style="width:150px" title="目标数量" value="${target}">
<input class="bidPrice" type="number" style="width:100px" title="卖出下限" value="${bidPrice}">
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
			$('#autobuildButton').text('[自动建塔]');
		}
		closeDialog();
	});

	$('#startBuildButton').on('click', function () {
		let info = {};
		info.charaId = charaId.toString();
		info.name = chara.Name;
		info.target = $('.trade.build .target').val();
		info.bidPrice =  $('.trade.build .bidPrice').val();
		if(intempleList){
			autoTempleList.splice(index,1);
			autoTempleList.unshift(info);
		}
		else autoTempleList.unshift(info);
		localStorage.setItem('TinyGrail_autoTempleList',JSON.stringify(autoTempleList));
		alert(`启动自动建塔#${info.charaId} ${info.name}`);
		closeDialog();
		$('#autobuildButton').text('[自动建塔中]');
		autoBuildTemple([info]);
	});
}

function setBuildTemple(chara){
	let in_TempleList = false;
	let charaId = chara.Id;
	if(chara.CharacterId) charaId = chara.CharacterId;
	for(let i = 0; i < autoTempleList.length; i++){
		if(autoTempleList[i].charaId == charaId) in_TempleList = true;
	}
	let button;
	if(in_TempleList){
		button = `<button id="autobuildButton" class="text_button">[自动建塔中]</button>`;
	}
	else{
		button = `<button id="autobuildButton" class="text_button">[自动建塔]</button>`;
	}
	if($('#buildButton').length) $('#buildButton').after(button);
	else $('#grailBox .title .text').after(button);

	$('#autobuildButton').on('click', () => {
		openBuildDialog(chara);
	});
}

function followChara(charaId){  //关注角色
	followList = JSON.parse(localStorage.getItem('TinyGrail_followList'))|| {"user":'',"charas":[], "auctions":[]};
	let button = `<button id="followCharaButton" class="text_button">[关注角色]</button>`;
	if(followList.charas.includes(charaId)){
		button = `<button id="followCharaButton" class="text_button">[取消关注]</button>`;
	}
	if($('#kChartButton').length) $('#kChartButton').before(button);
	else $('#grailBox .title .text').after(button);

	$('#followCharaButton').on('click', () => {
		if(followList.charas.includes(charaId)){
			followList.charas.splice(followList.charas.indexOf(charaId),1);
			$('#followCharaButton').text('[关注角色]');
		}
		else{
			followList.charas.unshift(charaId);
			$('#followCharaButton').text('[取消关注]');
		}
		localStorage.setItem('TinyGrail_followList',JSON.stringify(followList));
	});
}

async function autoJoinICO(icoList){
	for (let i = 0; i < icoList.length; i++) {
		let charaId = icoList[i].CharacterId;
		await getData(`chara/${charaId}`).then((d)=>{
			if (d.State == 0){
				let offer = 5000;
				let Id = d.Value.Id;
				if(d.Value.Total < 100000 && d.Value.Users < 15){
					getData(`chara/initial/${Id}`).then((d)=>{
						if(d.State == 1){
							postData(`chara/join/${Id}/${offer}`, null).then((d)=>{
								if (d.State === 0) {
									console.log(`#${charaId} 追加注资成功。`);
									$(`#eden_tpc_list li[data-id=${charaId}] .row`).append(`<small class="raise">+${offer}</small>`);
								}
							});
						}
					});
				}
			}
		});
	}
}

async function fullfillICO(icoList){
	var dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="info_box">
<div class="title">自动补款检测中</div>
<div class="result" style="max-height:500px;overflow:auto;"></div>
</div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;
	if(!$('#TB_window').length) $('body').append(dialog);
	$('#TB_closeWindowButton').on('click', closeDialog);
	$('#TB_overlay').on('click', closeDialog);
	for (let i = 0; i < icoList.length; i++) {
		let Id = icoList[i].Id;
		let charaId = icoList[i].charaId;
		let targetlv = icoList[i].target;
		let target = ICO_standard(targetlv);
		await getData(`chara/${charaId}`).then((d)=>{
			if (d.State == 0){
				let predicted = caculateICO(d.Value);
				if(predicted.Level >= targetlv){
					console.log(charaId+'总额:'+d.Value.Total+',已达标，无需补款');
					$('.info_box .result').prepend(`<div class="row">#${charaId} 目标: lv${targetlv} 总额: ${d.Value.Total} ,已达标，无需补款</div>`);
				}
				else if(predicted.Users <= 0){
					let offer = predicted.Next - d.Value.Total;
					if(d.Value.Users >= target.Users){
						offer = target.Total - d.Value.Total;
					}
					offer = Math.max(offer, 5000);
					postData(`chara/join/${Id}/${offer}`, null).then((d)=>{
						if (d.State === 0) {
							$('.info_box .result').prepend(`<div class="row">#${charaId} 目标: lv${targetlv} 补款: ${offer}</div>`);
							console.log(charaId+'补款:'+offer);
						} else {
							$('.info_box .result').prepend(`<div class="row">#${charaId} ${d.Message}</div>`);
							console.log(d.Message);
						}
					});
				}
				else{
					$('.info_box .result').prepend(`<div class="row">#${charaId} 目标: lv${targetlv} 人数: ${d.Value.Users}, 人数不足，未补款</div>`);
					console.log(charaId+'人数:'+d.Value.Users+',人数不足，未补款');
				}
			}
		});
	}
}

function openICODialog(chara){
	fillicoList = JSON.parse(localStorage.getItem('TinyGrail_fillicoList')) || [];
	let target = 1;
	let inorder = false, index = 0;
	for(let i = 0; i < fillicoList.length; i++){
		if(fillicoList[i].Id == chara.Id){
			target = fillicoList[i].target;
			inorder = true;
			index = i;
		}
	}
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title">自动补款 - #${chara.CharacterId} 「${chara.Name}」 lv${target}</div>
<div class="desc">目标等级：<input type="number" class="target" min="1" max="10" step="1" value="${target}" style="width:50px"></div>
<div class="label"><div class="trade ico">
<button id="startfillICOButton" class="active">自动补款</button>
<button id="fillICOButton" style="background-color: #5fda15;">立即补款</button>
<button id="cancelfillICOButton">取消补款</button></div>
<div class="loading" style="display:none"></div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>`;
	$('body').append(dialog);

	$('#TB_closeWindowButton').on('click', closeDialog);

	$('#cancelfillICOButton').on('click', function(){
		if(inorder){
			alert(`取消自动补款${chara.Name}`);
			$('#followICOButton').text('[自动补款]');
			fillicoList.splice(index,1);
			localStorage.setItem('TinyGrail_fillicoList',JSON.stringify(fillicoList));
		}
		closeDialog();
		console.log(fillicoList);
	});

	$('#startfillICOButton').on('click', function () {
		let target = parseFloat($('.desc .target').val());
		if(target <= 0 || !Number.isInteger(target)){
			alert('请输入正整数！');
			return;
		}
		let info = {};
		info.Id = chara.Id.toString();
		info.charaId = chara.CharacterId.toString();
		info.name = chara.Name;
		info.target = target;
		info.end = chara.End;
		if(inorder){
			fillicoList[index] = info;
		}
		else fillicoList.push(info);
		localStorage.setItem('TinyGrail_fillicoList',JSON.stringify(fillicoList));
		alert(`启动自动补款#${chara.Id} ${chara.Name}`);
		$('#followICOButton').text('[自动补款中]');
		closeDialog();
		console.log(fillicoList);
	});

	$('#fillICOButton').on('click', function () {
		let target = parseFloat($('.desc .target').val());
		if(target <= 0 || !Number.isInteger(target)){
			alert('请输入正整数！');
			return;
		}
		let info = {};
		info.Id = chara.Id.toString();
		info.charaId = chara.CharacterId.toString();
		info.name = chara.Name;
		info.target = target;
		info.end = chara.End;
		closeDialog();
		if(confirm(`立即补款#${chara.Id} ${chara.Name} 至 lv${target}`)){
			fullfillICO([info]);
		}
	});
}

function setFullFillICO(chara){ //设置自动补款
	fillicoList = JSON.parse(localStorage.getItem('TinyGrail_fillicoList')) || [];
	let button, inorder = false;
	let charaId = chara.CharacterId;
	for(let i = 0; i < fillicoList.length; i++){
		if(fillicoList[i].charaId == charaId){
			inorder = true;
		}
	}
	if(inorder){
		button = `<button id="followICOButton" class="text_button">[自动补款中]</button>`;
	}
	else{
		button = `<button id="followICOButton" class="text_button">[自动补款]</button>`;
	}
	$('#grailBox .title .text').after(button);
	$('#followICOButton').on('click', () => {
		openICODialog(chara);
	});
}

function showEndTime(chara){
	let endTime = (chara.End).slice(0,19);
	$('#grailBox .title .text').append(`<div class="sub" style="margin-left: 20px">结束时间: ${endTime}</div>`);
}

function followAuctions(charaId){  //关注竞拍情况
	getData(`chara/user/${charaId}/tinygrail/false`).then((d)=>{
		if (d.State == 0) {
			let button;
			if(followList.auctions.includes(charaId)){
				button = `<button id="followAuctionButton" class="text_button">[取消关注]</button>`;
			}
			else{
				button = `<button id="followAuctionButton" class="text_button">[关注竞拍]</button>`;
			}
			$('#buildButton').before(button);
			$('#followAuctionButton').on('click', () => {
				if(followList.auctions.includes(charaId)){
					followList.auctions.splice(followList.auctions.indexOf(charaId),1);
					$('#followAuctionButton').text('[关注竞拍]');
				}
				else{
					followList.auctions.unshift(charaId);
					$('#followAuctionButton').text('[取消关注]');
				}
				localStorage.setItem('TinyGrail_followList',JSON.stringify(followList));
			});
		}
	});
}

async function loadValhalla(ids){
	for(let i = 0; i < ids.length; i++){
		let Id = ids[i];
		await getData(`chara/user/${Id}/tinygrail/false`).then((d)=>{
			let valhalla = `<small class="even" title="拍卖底价 / 拍卖数量">₵${formatNumber(d.Value.Price,2)} / ${d.Value.Amount}</small>`;
			$(`.cancel_auction[data-id=${Id}]`).before(valhalla);
		});
	}
}

async function joinAuctions(ids){
	for(let i = 0; i < ids.length; i++){
		let Id = ids[i];
		await postData('chara/auction/list', [Id]).then((d)=>{
			let myAuctionAmount = 0;
			if(d.Value.length) myAuctionAmount = d.Value[0].Amount;
			if(myAuctionAmount){
				let myAuction = `<span class="my_auction auction_tip" title="出价 / 数量">₵${formatNumber(d.Value[0].Price, 2)} / ${myAuctionAmount}</span>`;
				$(`.item_list[data-id=${Id}] .time`).after(myAuction);
			}
			else{
				getData(`chara/user/${Id}/tinygrail/false`).then((d)=>{
					let price = Math.ceil(d.Value.Price * 100)/100;
					let amount = 1;
					postData(`chara/auction/${Id}/${price}/${amount}`, null).then((d)=>{
						if (d.State == 0) {
							let myAuction = `<span class="my_auction auction_tip" title="出价 / 数量">₵${price} / ${amount}</span>`;
							$(`.item_list[data-id=${Id}] .time`).after(myAuction);
						} else {
							console.log(d.Message);
						}
					});
				});
			}
		});
	}
}

function loadUserAuctions(d) {
	d.Value.forEach((a) => {
		if (a.State != 0) {
			let userAuction = `<span class="user_auction auction_tip" title="竞拍人数 / 竞拍数量">${formatNumber(a.State, 0)} / ${formatNumber(a.Type, 0)}</span>`;
			$(`.item_list[data-id=${a.CharacterId}] .time`).after(userAuction);
			$(`#auctionHistoryButton`).before(userAuction);
			$('#TB_window.dialog .desc').append(userAuction);
		}
		if (a.Price != 0) {
			let myAuction = `<span class="my_auction auction_tip" title="出价 / 数量">₵${formatNumber(a.Price, 2)} / ${formatNumber(a.Amount, 0)}</span>`;
			$(`.item_list[data-id=${a.CharacterId}] .time`).after(myAuction);
			$(`#auctionHistoryButton`).before(myAuction);
			$('#TB_window.dialog .desc').append(myAuction);
		}
	});
}

function fixAuctions(chara){
	getData(`chara/user/${chara.Id}/tinygrail/false`).then((d)=>{
		chara.Price = d.Value.Price;
		chara.State = d.Value.Amount;
		let button = `<button id="auctionButton2" class="text_button">[萌王投票]</button>`;
		if (d.State == 0 && d.Value.Amount > 0) button = `<button id="auctionButton2" class="text_button">[参与竞拍]</button>`;
		$('#buildButton').before(button);
		$('#auctionButton').hide();
		postData('chara/auction/list', [chara.Id]).then((d)=>{
			loadUserAuctions(d);
			$('#auctionButton2').on('click', () => {
				openAuctionDialog(chara, d);
			});
		});
	});
}

function cancelAuction(chara){
	let message = '确定取消竞拍？';
	let Day = new Date().getDay();
	if(Day == 6) message = '周六取消竞拍将收取20%税，确定取消竞拍？';
	if (!confirm(message)) return;
	$("#TB_window .loading").show();
	$('#TB_window .label').hide();
	$("#TB_window .desc").hide();
	$("#TB_window .trade").hide();
	getData(`chara/user/auction/1/100`).then((d)=>{
		let id = 0;
		for(let i = 0;i < d.Value.Items.length; i++){
			if(chara.Id == d.Value.Items[i].CharacterId){
				id = d.Value.Items[i].Id;
				break;
			}
		}
		if(id){
			postData(`chara/auction/cancel/${id}`, null).then((d)=>{
				$("#TB_window .loading").hide();
				$('#TB_window .label').show();
				$("#TB_window .desc").show();
				$("#TB_window .trade").show();
				if (d.State == 0){
					$('#TB_window .trade').hide();
					$('#TB_window .label').hide();
					$('#TB_window .desc').text('取消竞拍成功');
				}
				else alert(d.Message);
			});
		}
		else{
			$("#TB_window .loading").hide();
			$('#TB_window .desc').text('未找到竞拍角色');
		}
	});
}

function bidAuction(chara) {
	$("#TB_window .loading").show();
	$('#TB_window .label').hide();
	$("#TB_window .desc").hide();
	$("#TB_window .trade").hide();
	let price = $('.trade.auction .price').val();
	let amount = $('.trade.auction .amount').val();
	postData(`chara/auction/${chara.Id}/${price}/${amount}`, null).then((d)=>{
		$("#TB_window .loading").hide();
		$('#TB_window .label').show();
		$("#TB_window .desc").show();
		$("#TB_window .trade").show();
		if (d.State == 0) {
			let message = d.Value;
			$('#TB_window .trade').hide();
			$('#TB_window .label').hide();
			$('#TB_window .desc').text(message);
		} else {
			alert(d.Message);
		}
	});
}

function openAuctionDialog(chara, auction) {
	let auction_num = chara.State;
	if(settings.auction_num == 'one') auction_num = 1;
	let price = Math.ceil(chara.Price * 100)/100;
	let total = formatNumber(price * chara.State, 2);
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title" title="拍卖底价 / 竞拍数量 / 流通股份">股权拍卖 - #${chara.Id} 「${chara.Name}」 ₵${formatNumber(chara.Price, 2)} / ${chara.State} / ${chara.Total}</div>
<div class="desc">
<button id="fullfill_auction" class="text_button" title="当竞拍数量未满时补满数量">[补满]</button>
<button id="change_amount" class="text_button" title="按修改后的价格确定数量，保持总价不变">[改量]</button>
<button id="change_price" class="text_button" title="按修改后的数量确定价格，保持总价不变">[改价]</button>
</div><div class="label">
<span class="input">价格</span><span class="input">数量</span><span class="total">合计 -₵${total}</span>
</div><div class="trade auction">
<input class="price" type="number" style="width: 100px" min="${price}" value="${price}">
<input class="amount" type="number" style="width: 100px" min="1" max="${chara.State}" value="${auction_num}">
<button id="bidAuctionButton" class="active">确定</button><button id="cancelAuctionButton" style="display: none">取消竞拍</button></div>
<div class="loading" style="display:none"></div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>`;
	$('body').append(dialog);
	$('#TB_closeWindowButton').on('click', closeDialog);

	$('.assets_box .auction_tip').remove();
	loadUserAuctions(auction);

	$('#cancelAuctionButton').on('click', function() {
		cancelAuction(chara);
	});
	$('#bidAuctionButton').on('click', function () {
		bidAuction(chara);
	});

	if(!auction.Value.length){
		auction.Value = [{"Price":0, "Amount":0, "Type":0, "State":0}];
	}

	if(auction.Value[0].Price){
		$('.trade.auction .price').val(auction.Value[0].Price);
		$('.trade.auction .amount').val(auction.Value[0].Amount);
		let total = formatNumber(auction.Value[0].Price * auction.Value[0].Amount, 2);
		$("#TB_window .label .total").text(`合计 -₵${total}`);
		$('#cancelAuctionButton').show();
	}

	$('#TB_window .auction input').on('keyup', () => {
		let price = $('.trade.auction .price').val();
		let amount = $('.trade.auction .amount').val();
		let total = formatNumber(price * amount, 2);
		$("#TB_window .label .total").text(`合计 -₵${total}`);
	});
	$('#fullfill_auction').on('click', function() {
		let total_auction = chara.State;
		let amount = total_auction - auction.Value[0].Type + auction.Value[0].Amount;
		let price = Math.ceil(chara.Price * 100)/100;
		$('.trade.auction .price').val(price);
		$('.trade.auction .amount').val(amount);
		$("#TB_window .label .total").text(`合计 -₵${formatNumber(price * amount, 2)}`);
	});
	$('#change_amount').on('click', function() {
		let price = parseFloat($('.trade.auction .price').val());
		let total = auction.Value[0].Price * auction.Value[0].Amount;
		let amount = Math.ceil(total / price);
		$('.trade.auction .amount').val(amount);
		$("#TB_window .label .total").text(`合计 -₵${formatNumber(price * amount, 2)}`);
	});
	$('#change_price').on('click', function() {
		let amount = parseInt($('.trade.auction .amount').val());
		let total = auction.Value[0].Price * auction.Value[0].Amount;
		let price = Math.ceil(total / amount * 100)/100;
		$('.trade.auction .price').val(price);
		$("#TB_window .label .total").text(`合计 -₵${formatNumber(price * amount, 2)}`);
	});
}

function showAuctionHistory(chara){
	let button = `<button id="auctionHistorys" class="text_button">[往期拍卖]</button>`;
	$('#auctionHistoryButton').after(button);
	$('#auctionHistoryButton').hide();
	$('#auctionHistorys').on('click', () => {
		openHistoryDialog(chara, 1);
	});
}
/*
function openHistoryDialog(chara) {
  var dialog = `<div id="auctionHistoryDialog" class="new_overlay">
  <div class="new_dialog">
    <div class="info_box">
      <div class="title">上周拍卖结果 - #${chara.Id} 「${chara.Name}」 ₵${formatNumber(chara.Current, 2)} / ${formatNumber(chara.Total, 0)}</div>
      <div class="desc" style="display:none"></div>
      <div class="result" style="display:none"></div>
    </div>
    <div class="loading"></div>
    <a class="close_button" title="Close">X关闭</a>
  </div>
  </div>`;
  $('body').append(dialog);
  $('body').css('overflow-y', 'hidden');

  getData(`chara/auction/list/${chara.Id}/1`, (d => {
    $('#auctionHistoryDialog .loading').hide();
    if (d.State == 0 && d.Value.length > 0) {
      var success = 0;
      var total = 0;
      d.Value.forEach((a) => {
        var state = "even";
        var name = "失败";
        if (a.State == 1) {
          success++;
          total += a.Amount;
          state = "raise";
          name = "成功";
        }

        var record = `<div class="row">
          <span class="time">${formatDate(a.Bid)}</span>
          <span class="user"><a target="_blank" href="/user/${a.Username}">${a.Nickname}</a></span>
          <span class="price">₵${formatNumber(a.Price, 2)} / ${formatNumber(a.Amount, 0)}</span>
          <span class="tag ${state}">${name}</span>
        </div>`;
        $('#auctionHistoryDialog .result').append(record);
      });
      $('#auctionHistoryDialog .desc').text(`共有${d.Value.length}人参与拍卖，成功${success}人 / ${total}股`);
      $('#auctionHistoryDialog .result').show();
    } else {
      $('#auctionHistoryDialog .desc').text('暂无拍卖数据');
    }
    $('#auctionHistoryDialog .desc').show();
    centerDialog('#auctionHistoryDialog .new_dialog');
  }));

  centerDialog('#auctionHistoryDialog .new_dialog');
  addCloseDialog('#auctionHistoryDialog');
}*/


function openHistoryDialog(chara, page) {
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title">上${page}周拍卖结果 - #${chara.Id} 「${chara.Name}」 ₵${formatNumber(chara.Current, 2)} / ${formatNumber(chara.Total, 0)}</div>
<div class="desc" style="display:none"></div>
<div class="result" style="display:none; max-height: 500px; overflow: auto;"></div>
<div class="page_inner">
<a id="nextweek" class="p" style="display:none; float: left;margin-bottom: 5px;margin-left: 50px;">后一周</a>
<a id="lastweek" class="p" style="display:none; float: right;margin-bottom: 5px;margin-right: 50px;">前一周</a>
</div>
<div class="loading"></div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>`;
	$('body').append(dialog);

	$('#TB_closeWindowButton').on('click', closeDialog);
	$('#TB_overlay').on('click', closeDialog);
	chara_initPrice = JSON.parse(localStorage.getItem('TinyGrail_chara_initPrice')) || {};
	const week_ms = 7*24*3600*1000;
	let templeWeek = Math.floor((new Date() - new Date('2019/10/05'))/week_ms + 1);
	let icoWeek = Math.floor((new Date() - new Date(chara_initPrice[chara.Id].time))/week_ms + 1);
	let week = Math.min(templeWeek, icoWeek);
	getData(`chara/auction/list/${chara.Id}/${page}`).then((d)=>{
		$('#TB_window .loading').hide();
		if (d.State == 0 && d.Value.length > 0) {
			let success = 0;
			let total = 0;
			d.Value.forEach((a) => {
				let state = "even";
				let name = "失败";
				if (a.State == 1) {
					success++;
					total += a.Amount;
					state = "raise";
					name = "成功";
				}
				let record =`
<div class="row"><span class="time">${formatDate(a.Bid)}</span>
<span class="user"><a target="_blank" href="/user/${a.Username}">${a.Nickname}</a></span>
<span class="price">₵${formatNumber(a.Price, 2)} / ${formatNumber(a.Amount, 0)}</span>
<span class="tag ${state}">${name}</span></div>`;
				$('#TB_window .result').append(record);
			});
			$('#TB_window .desc').text(`共有${d.Value.length}人参与拍卖，成功${success}人 / ${total}股`);
			$('#TB_window .result').show();
		} else {
			$('#TB_window .desc').text('暂无拍卖数据');
		}
		$('#TB_window .desc').show();
		if(page > 1) $('#nextweek').show();
		if(page < week) $('#lastweek').show();
		$('#nextweek').on('click', () => {
			page--;
			closeDialog();
			openHistoryDialog(chara, page);
		});
		$('#lastweek').on('click', () => {
			page++;
			closeDialog();
			openHistoryDialog(chara, page);
		});
	});
}

function showTradeHistory(chara){
	$('#kChartButton').after('<button id="tradeHistoryButton" class="text_button">[交易记录]</button>');
	$('#tradeHistoryButton').on('click', () => {
		openTradeHistoryDialog(chara);
	});
}

function openTradeHistoryDialog(chara) {
  var dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title">交易历史记录 - #${chara.Id} 「${chara.Name}」 ₵${formatNumber(chara.Current, 2)} / ${formatNumber(chara.Total, 0)}</div>
<div class="result" style="display:none; max-height: 500px; overflow: auto;"></div>
<div class="desc" style="display:none"></div>
<div class="loading"></div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>`;
	$('body').append(dialog);

	$('#TB_closeWindowButton').on('click', closeDialog);
	$('#TB_overlay').on('click', closeDialog);
	let tradeHistory, totalPages;
	getData(`chara/charts/${chara.Id}/2019-08-08`).then((d)=>{
		if(d.State == 0){
			tradeHistory = d.Value.reverse();
			totalPages = Math.ceil(d.Value.length / 50);
			loadTradeHistory(1);
		}
	});
	function loadTradeHistory(page) {
		$(`#TB_window .loading`).hide();
		$(`#TB_window .result`).show();
		$(`#TB_window .result`).html('');
		let records = tradeHistory.slice(50*(page-1),50*page);
		if(records.length){
			for(let i = 0; i < records.length; i++){
				var record = `<div class="row">
<span class="time" title="交易时间">${formatDate(records[i].Time)}</span>
<span class="price" title="价格">₵${formatNumber((records[i].Price/records[i].Amount), 2)}</span>
<span class="amount" title="数量">${formatNumber(records[i].Amount, 0)}</span>
<span class="price" title="交易额">₵${formatNumber(records[i].Price, 2)}</span>
</div>`;
				$(`#TB_window .result`).append(record);
			}
			$(`#TB_window .desc`).html('');
			$(`#TB_window .desc`).text(`共有${tradeHistory.length}条记录，当前 ${page} / ${totalPages} 页`);

			for (let i = 1; i <= totalPages; i++) {
				let pager = `<span class="page" data-page="${i}">[${i}]</span>`;
				$(`#TB_window .desc`).append(pager);
			}

			$(`#TB_window .desc .page`).on('click', (e) => {
				let page = $(e.target).data('page');
				loadTradeHistory(page);
			})

			$(`#TB_window .result`).show();
		} else {
			$(`#TB_window .desc`).text('暂无交易记录');
		}
		$(`#TB_window .desc`).show();
	}
}

function getShareBonus() {
	let asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Shanghai"});
	asiaTime = new Date(asiaTime)
	let Day = asiaTime.getDay();
	if(Day == 6){
		getData('event/share/bonus/check').then((d)=>{
			if (d.State === 0) {
				getWeeklyShareBonus();
			}
		});
	}
}

function hideBonusButton() {
	if(!$('#bonusButton').length) return;
	getData('event/share/bonus/test').then((d)=>{
		let x = d.Value.Share / 10000;
		let allowance = Math.log10(x + 1)*30 - x;
		if(d.State == 0 && allowance < 0 ) $('#bonusButton').remove();
		//else $('#shareBonusButton').hide();
	});
}

function showHideGrailBox() {
	let config = settings.hide_grail;
	if(config=='on'){
		$('#grail').hide();
		setTimeout(()=>{$('#pager1').hide();},500);
	}
}

function showTopWeek() {
	getData(`chara/topweek`).then((d)=>{
		let totalExtra = 0, totalPeople = 0;
		for(let i = 0; i < d.Value.length; i++){
			totalExtra += d.Value[i].Extra;
			totalPeople += d.Value[i].Type;
		}
		console.log(totalExtra+'/'+totalPeople+'='+totalExtra / totalPeople);
		$('#topWeek .auction_button').hide();
		let charas = {};
		for(let i=0; i<d.Value.length;i++){
			let score = d.Value[i].Extra + d.Value[i].Type * totalExtra / totalPeople;
			let tag = $(`#topWeek .assets .item`)[i].querySelector('.tag');
			$(tag).attr('title','综合得分:'+formatNumber(score,2));
			let average = (d.Value[i].Extra + d.Value[i].Price * d.Value[i].Sacrifices)/d.Value[i].Assets;
			let buff = $(`#topWeek .assets .item`)[i].querySelector('.buff');
			$(buff).attr('title','平均拍价:'+formatNumber(average,2));
			let charaId = d.Value[i].CharacterId;
			let auction_button = $(`<div class="name auction" data-id="${charaId}">
<span title="竞拍人数 / 竞拍数量 / 拍卖总数">${d.Value[i].Type} / ${d.Value[i].Assets} / ${d.Value[i].Sacrifices}</span></div>`);
			$($(`#topWeek .assets .item`)[i]).append(auction_button);
			let chara= {"Id":d.Value[i].CharacterId, "Name":d.Value[i].CharacterName, "Price":d.Value[i].Price, "State":d.Value[i].Sacrifices, "Total":0};
			auction_button.on('click', () => {
				postData('chara/auction/list', [charaId]).then((d)=>{
					openAuctionDialog(chara, d);
				});
			});
		}
	});
}

function add_chara_info() {
	try{
		let charaId = $('#grailBox .title .name a')[0].href.split('/').pop();
		followChara(charaId); //关注角色
		followAuctions(charaId); //关注竞拍情况
		showInitialPrice(charaId); //显示发行价
		priceWarning(); //买入价格过高提醒
		mergeorderListHistory(charaId); //合并同一时间订单历史记录
		showOwnTemple(); //显示自己的圣殿
		changeTempleCover(charaId); //修改他人圣殿封面
		showGallery(); //查看画廊
		getData(`chara/${charaId}`).then((d)=>{
			let chara = d.Value;
			showAuctionHistory(chara); //历史拍卖
			showTradeHistory(chara); //交易记录
			showPrice(chara); //显示评估价
			showTempleRate(chara); //显示各级圣殿数量及股息计算值
			setBuildTemple(chara); //自动建塔
			fixAuctions(chara); //修改默认拍卖底价和数量
		});
	} catch (e) {};
}

function add_ico_info() {
	let charaId = location.pathname.split('/').pop();
	followChara(charaId); //关注角色
	getData(`chara/${charaId}`).then((d)=>{
		let chara = d.Value;
		showEndTime(chara); //显示结束时间
		setBuildTemple(chara); //自动建塔
		setFullFillICO(chara); //自动补款
	});
}

function launchObserver({
	parentNode,
	selector,
	failCallback = null,
	successCallback = null,
	stopWhenSuccess = true,
	config = {'childList': true, 'subtree': true},
}) {
	// if parent node does not exist, return
	if(!parentNode) return;
	const observeFunc = mutationList => {
		if(!document.querySelector(selector)) {
			if(failCallback) failCallback();
			return;
		}
		if(stopWhenSuccess) observer.disconnect();
		if(successCallback) successCallback();
	}
	let observer = new MutationObserver(observeFunc);
	observer.observe(parentNode, config);
}

// character page
if(location.pathname.startsWith('/rakuen/topic/crt') || location.pathname.startsWith('/character')) {
	let parentNode = document.getElementById('subject_info') || document.getElementById('columnCrtB');
	// charater trade info
	let chara_fetched = false;
	launchObserver({
		parentNode: parentNode,
		selector: '#grailBox .assets_box',
		failCallback: () => {chara_fetched = false},
		successCallback: () => {
			if(chara_fetched) return;
			chara_fetched = true;
			add_chara_info();
		},
		stopWhenSuccess: false,
	});
	// charater ico info
	let ico_fetched = false;
	launchObserver({
		parentNode: parentNode,
		selector: '#grailBox .trade .money',
		failCallback: () => {ico_fetched = false},
		successCallback: () => {
			if(ico_fetched) return;
			ico_fetched = true;
			add_ico_info();
		},
		stopWhenSuccess: false,
	});
}
// rakuen homepage
else if (location.pathname.startsWith('/rakuen/home')) {
	//周六未领取股息则自动领取
	if(settings.get_bonus == 'on') getShareBonus();
	launchObserver({
		parentNode: document.body,
		selector: '#topWeek',
		successCallback: ()=>{
			hideBonusButton(); //隐藏签到
			showTopWeek(); //显示萌王榜排名数值
			showGallery(); //显示画廊
		},
	});
	let chara_fetched = false;
	launchObserver({
		parentNode: document.body,
		selector: '#grailBox .assets_box',
		failCallback: () => {chara_fetched = false},
		successCallback: () => {
			if(chara_fetched) return;
			chara_fetched = true;
			add_chara_info();
		},
		stopWhenSuccess: false,
	});
}
// menu page
else if (location.pathname.startsWith('/rakuen/topiclist')) {
	setTimeout(function(){loadHelperMenu()},500);
}
// user homepage
else if (location.pathname.startsWith('/user')) {
	launchObserver({
		parentNode: document.body,
		selector: '#grail',
		successCallback: ()=>{
			showHideGrailBox();
			showGallery();
		},
	});
	let chara_fetched = false;
	launchObserver({
		parentNode: document.body,
		selector: '#grailBox .assets_box',
		failCallback: () => {chara_fetched = false},
		successCallback: () => {
			if(chara_fetched) return;
			chara_fetched = true;
			add_chara_info();
		},
		stopWhenSuccess: false,
	});
}
