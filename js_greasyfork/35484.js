// ==UserScript==
// @name         TEST
// @namespace    http://swordman-s1.yytou.com/?id=6108593&time=1506184487507&key=e7ba313836d9923632d967be159f8892&s_line=1&error_code=103&error_msg=%E7%94%A8%E6%88%B6%E5%8F%96%E6%B6%88%E6%94%AF%E4%BB%98&error_code=103&error_msg=%E7%94%A8%E6%88%B6%E5%8F%96%E6%B6%88%E6%94%AF%E4%BB%98
// @version      0.1
// @description  try to take over the world!
// @author       MARBO&jj
// @match        http://swordman-s1.yytou.com/?id=6108593&time=1506184487507&key=e7ba313836d9923632d967be159f8892&s_line=1&error_code=103&error_msg=%E7%94%A8%E6%88%B6%E5%8F%96%E6%B6%88%E6%94%AF%E4%BB%98&error_code=103&error_msg=%E7%94%A8%E6%88%B6%E5%8F%96%E6%B6%88%E6%94%AF%E4%BB%98
// @grant        http://swordman-s1.yytou.com/?id=6108593&time=1506184487507&key=e7ba313836d9923632d967be159f8892&s_line=1&error_code=103&error_msg=%E7%94%A8%E6%88%B6%E5%8F%96%E6%B6%88%E6%94%AF%E4%BB%98&error_code=103&error_msg=%E7%94%A8%E6%88%B6%E5%8F%96%E6%B6%88%E6%94%AF%E4%BB%98
// @downloadURL https://update.greasyfork.org/scripts/35484/TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/35484/TEST.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
var enforcePoints = '855';
var mySkillLists = '覆雨劍法';
skillLists = '';
buttonWidth = '60px';
buttonHeight = '20px';
currentPos = 50;
delta = 30;
// 技能按鈕 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(SetSkillButton);
SetSkill();
var SetSkillButton = document.createElement('button');
SetSkillButton.innerText = '技能';
SetSkillButton.style.position = 'absolute';
SetSkillButton.style.right = '0px';
SetSkillButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
SetSkillButton.style.width = buttonWidth;
SetSkillButton.style.height = buttonHeight;
document.body.appendChild(SetSkillButton);
SetSkillButton.addEventListener('click', SetSkill);

function SetSkill() {
	mySkillLists = prompt("請輸入殺人技能", mySkillLists);
}
// 簽到按鈕 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(CheckInButton);
var CheckInButton = document.createElement('button');
CheckInButton.innerText = '簽到';
CheckInButton.style.position = 'absolute';
CheckInButton.style.right = '0px';
CheckInButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
CheckInButton.style.width = buttonWidth;
CheckInButton.style.height = buttonHeight;
document.body.appendChild(CheckInButton);
CheckInButton.addEventListener('click', CheckIn)
function CheckIn(){ // 進入揚州
	console.log('簽到一次！');
	clickButton('jh 5');       // 進入章節
	clickButton('go north');     // 南門大街
	clickButton('go north');   // 十裡長街3
	clickButton('go north');    // 十裡長街2
	clickButton('go west');    // 黃雞貨鋪
	clickButton('sign7');
	clickButton('cangjian get_all'); // 一鍵領取闖樓獎勵
	clickButton('home');
	clickButton('jh 1');        // 進入章節
	clickButton('go east') ;     // 廣場
	clickButton('go north');     // 雪亭鎮街道
	clickButton('go east');     // 淳風武館大門
	clickButton('go east') ;    // 淳風武館教練場
	clickButton('event_1_44731074');
	clickButton('event_1_8041045');
	clickButton('event_1_8041045');
	clickButton('home');
}
// 領取獎勵 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(getRewardsButton);
var getRewardsButton = document.createElement('button');
getRewardsButton.innerText = '開領獎';
getRewardsButton.style.position = 'absolute';
getRewardsButton.style.right = '11px';
getRewardsButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
getRewardsButton.style.width = buttonWidth;
getRewardsButton.style.height = buttonHeight;
document.body.appendChild(getRewardsButton);
getRewardsButton.addEventListener('click', getRewardsFunc)

var getRewardsdelay = 100;
var getRewardsInterval = 5*60*1000; // ms
var scanEscaped = null;

function getRewardsFunc(){
//    console.clear();
	if (getRewardsButton.innerText == '開領獎'){ // 處於未領獎狀態，單擊開始領獎,並將狀態置於停領獎狀態
		console.log("開始自動領取獎勵！");
		scanEscapedFish();
		scanEscaped = setInterval(scanEscapedFish,getRewardsInterval);
		maikuli_i = setInterval(maikuli,5000 + getRewardsdelay); // 干苦力, 5s
		duancha_i  = setInterval(duancha,10*1000  + getRewardsdelay ); // 端茶送水, 10s
		dalie_i = setInterval(dalie,5*60*1000 + getRewardsdelay); // 上山打獵, 5 min = 300 s
		getRewardsButton.innerText = '停領獎';
	}else{
		console.log("停止自動領取獎勵！");
		clearInterval(scanEscaped);
		clearInterval(maikuli_i);
		clearInterval(duancha_i);
		clearInterval(dalie_i);
		getRewardsButton.innerText = '開領獎';
	}
}
function maikuli() {
	clickButton('work click maikuli');
	setTimeout(function() {
		$('div#out2 span.out2:contains(經驗+3,潛能+3)').remove();
		$('div#out2 span.out2:contains(幹苦力的收效)').remove();
		$('div#out2 span.out2:contains(尚未冷卻完成，無法做這個任務。)').remove();
	}, 200);
}
function duancha() {
	clickButton('work click duancha');
	setTimeout(function() {
		$('div#out2 span.out2:contains(經驗+4,潛能+4)').remove();
		$('div#out2 span.out2:contains(小飯店幹活)').remove();
		$('div#out2 span.out2:contains(尚未冷卻完成，無法做這個任務。)').remove();
	}, 200);
}
function dalie() {
	clickButton('work click dalie');
	setTimeout(function() {
		$('div#out2 span.out2:contains(經驗+62,潛能+62)').remove();
		$('div#out2 span.out2:contains(上山打獵已經)').remove();
		$('div#out2 span.out2:contains(尚未冷卻完成，無法做這個任務。)').remove();
	}, 200);
}
function baobiao() {
	clickButton('work click baobiao');
	clearMissionMsg();
}
function maiyi() {
	clickButton('work click maiyi');
	clearMissionMsg();
}
function xuncheng() {
	clickButton('work click xuncheng');
	clearMissionMsg();
}
function datufei() {
	clickButton('work click datufei');
	clearMissionMsg();
}
function dalei() {
	clickButton('work click dalei');
	clearMissionMsg();
}
function kangjijinbin() {
	clickButton('work click kangjijinbin');
	clearMissionMsg();
}
function zhidaodiying() {
	clickButton('work click zhidaodiying');
	clearMissionMsg();
}
function dantiaoqunmen() {
	clickButton('work click dantiaoqunmen');
	clearMissionMsg();
}
function shenshanxiulian() {
	clickButton('work click shenshanxiulian');
	clearMissionMsg();
}
function scanEscapedFish() {
	maikuli();
	duancha();
	dalie();
	baobiao();
	maiyi();
	xuncheng();
	datufei();
	dalei();
	kangjijinbin();
	zhidaodiying();
	dantiaoqunmen();
	shenshanxiulian();
	clickButton('public_op3'); // 向師傅磕頭
}
function clearMissionMsg() {
	setTimeout(function() {
		$('div#out2 span.out2:contains(尚未冷卻完成，無法做這個任務。)').remove();
	}, 200);
}
// 刷碎片 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(getRewardsButton);
var killDrunkManButton = document.createElement('button');
killDrunkManButton.innerText = '刷碎片';
killDrunkManButton.style.position = 'absolute';
killDrunkManButton.style.right = '0px';
killDrunkManButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
killDrunkManButton.style.width = buttonWidth;
killDrunkManButton.style.height = buttonHeight;
document.body.appendChild(killDrunkManButton);
killDrunkManButton.addEventListener('click', killDrunkManFunc);

var DrunkMan_targetName = 'luoyang_luoyang26';
var SnowDrunk_targetName = 'snow_drunk';
var zdskill = mySkillLists;
var counthead = 20;
var killDrunkIntervalFunc =  null;
var killSnowDrunkIntervalFunc = null;
var playSkillIntervalFunc = null;
var checkResultIntervalFunc = null;
function killDrunkManFunc(){
	if (killDrunkManButton.innerText == '刷碎片') {
		if (! (counthead=prompt("請輸入剩余數量","20"))){
			return;
		}
		/*
		clickButton('jh 2');        // 進入章節[洛陽]
		clickButton('go north');      // 南郊小路
		clickButton('go north');     // 南門
		clickButton('go north');     // 南大街
		clickButton('go north');     // 洛川街
		killDrunkIntervalFunc = setInterval(killDrunMan,500);
		*/

		clickButton('jh 1');        // 進入章節[雪亭鎮]
		clickButton('go east');      // 廣場
		clickButton('go north');     // 雪亭鎮街道
		clickButton('go north');     // 雪亭鎮街道
		killSnowDrunkIntervalFunc = setInterval(killSnowDrunk,1000);
		//killSnowDrunk();
		killDrunkManButton.innerText = '停刷碎';
	}
	else {
		clearInterval(killSnowDrunkIntervalFunc);
		//clearInterval(playSkillIntervalFunc);
		//clearInterval(checkResultIntervalFunc);
		clickButton('prev_combat');
		clickButton('home');
		killDrunkManButton.innerText = '刷碎片';
	}
}
function isContains(str, substr) {
	return str.indexOf(substr) >= 0;
}
function killDrunMan(){
	if(counthead>0){
		clickButton('kill ' + DrunkMan_targetName);
		ninesword();
		if($('span:contains(勝利)').text().slice(-3)=='勝利！'){
			counthead=counthead-1;
			console.log('殺人一次，剩余殺人次數：%d！',counthead);
			clickButton('prev_combat');
		}
	}else {
		clickButton('prev_combat');
		clickButton('home');
		clearInterval(killDrunkIntervalFunc);
	}
}
function killSnowDrunk(){
	if(counthead>0){
		clickButton('kill ' + SnowDrunk_targetName);
		ninesword();
		checkResult();
	}else {
		clickButton('prev_combat');
		clickButton('home');
		clearInterval(killSnowDrunkIntervalFunc);
		//clearInterval(playSkillIntervalFunc);
		//clearInterval(checkResultIntervalFunc);
		killDrunkManButton.innerText = '刷碎片';
	}
}
function ninesword(){
	if(isContains(zdskill, $('#skill_1').children().children().text()))
	{
		clickButton('playskill 1');
	}
	else if(isContains(zdskill, $('#skill_2').children().children().text()))
	{
		clickButton('playskill 2');
	}
	else if(isContains(zdskill, $('#skill_3').children().children().text()))
	{
		clickButton('playskill 3');
	}
	else if(isContains(zdskill, $('#skill_4').children().children().text()))
	{
		clickButton('playskill 4');
	}
	else
	{
		clickButton('playskill 1');
	}
}
function checkResult(){
	if($('span:contains(勝利)').text().slice(-3)=='勝利！'){
		//clearInterval(playSkillIntervalFunc);
		//clearInterval(checkResultIntervalFunc);
		counthead=counthead-1;
		console.log('殺人一次，剩余殺人次數：%d！',counthead);
		clickButton('prev_combat');
		//killSnowDrunk();
	}
}
// 釣魚一------------------------------------------------------------------------------------------------------
//document.body.removeChild(fishingButton);
var fishingButton = document.createElement('button');
fishingButton.innerText = '釣魚';
fishingButton.style.position = 'absolute';
fishingButton.style.right = '0px';
fishingButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
fishingButton.style.width = buttonWidth;
fishingButton.style.height = buttonHeight;
document.body.appendChild(fishingButton);
fishingButton.addEventListener('click', fishingFirstFunc);

function fishingFirstFunc(){
	if (fishingButton.innerText == '釣魚') {
		if(!(resFishToday = prompt("今天剩餘魚的條數","10"))){
			return;
		}
		resFishToday = parseInt(resFishToday);
		console.log("開始走向冰火島！");
		fishingButton.innerText = '釣魚中'
		fishingFirstStage();
	}
	else {
		fishingButton.innerText = '釣魚';
		clearTimeout(fishingSecondFunc);
		clearInterval(fishFunc);
	}
}
function fishingFirstStage(){
// 進入揚州
	clickButton('jh 35');       // 進入章節
	//clickButton('go north');     // 南門大街
	//clickButton('go north');   // 十裡長街3
	//clickButton('go north');    // 十裡長街2
	//clickButton('go north');      // 十裡長街1
	//clickButton('go north');      // 中央廣場
	//clickButton('go north');      // 十裡長街4
	//clickButton('go north');      // 十裡長街5
	//clickButton('go north');      // 十裡長街6
	//clickButton('go north');      // 北門大街
	//clickButton('go north');      // 鎮淮門
	//clickButton('go northeast') ;     // 揚州港
	//clickButton('look_npc yangzhou_chuanyundongzhu');
	//clickButton('chuhai');

	//setTimeout(fishingSecondFunc, 12000);
	fishingSecondStage();
}
// 挖魚餌參數
var resFishingParas = 100;   // 系統裡默認最多挖50次
var buttonName_digworm = 'event_1_59308235';
var cutTreeButtonName = 'event_1_45715622';
var diaoyu_buttonName = 'diaoyu';
var digWormFun=null;
var firstFishingParas = true;
var  resFishToday = 10;

//document.body.removeChild(fishingButton);
var fishingButton2 = document.createElement('button');
fishingButton2.innerText = '釣魚二';
fishingButton2.style.position = 'absolute';
fishingButton2.style.right = '0px';
fishingButton2.style.top =currentPos +  'px';
//currentPos = currentPos + delta;
fishingButton2.style.width = buttonWidth;
fishingButton2.style.height = buttonHeight;
//document.body.appendChild(fishingButton2);
fishingButton2.addEventListener('click', fishingSecondFunc);
function fishingSecondFunc(){
//    console.clear();
	/* This part was moved to starting of stage 1
	if(!(resFishToday = prompt("今天剩餘魚的條數","10"))){
		return;
	}
	resFishToday = parseInt(resFishToday);
	*/
	//console.log("開始挖魚餌、砍樹、釣魚！");
	fishingSecondStage();
}

var lastFishMsg = "";
function fishingSecondStage(){
	// 到達冰火島
	clickButton('chuhaigo');
	clickButton('go northwest');      // 熔岩灘頭
	clickButton('go northwest');      // 海蝕涯
	clickButton('go northwest');      // 峭壁崖道
	clickButton('go north');      // 峭壁崖道
	clickButton('go northeast') ;     // 炙溶洞口
	clickButton('go northwest');      // 炙溶洞
	clickButton('go west') ;     // 炙溶洞口
	clickButton('go northwest') ;     // 熔岩小徑
	clickButton('go east') ;     // 熔岩小徑
	clickButton('go east');      // 石華林
	clickButton('go east');      // 分島嶺
	clickButton('go east');      // 跨谷石橋
	clickButton('go east') ;     // 大平原
	clickButton('go southeast');
	clickButton('go east');
	// 開始釣魚
	console.log("開始釣魚！");
	resFishingParas = 100;
	firstFishingParas = true;
	fishIt();
	lastFishMsg = "";
	fishFunc=setInterval(fishIt, 6000);
}

function fishIt(){
	// 釣魚之前先判斷上次結果
	// 判斷是否調出了東西
	console.log($('span:contains(突然)').text().slice(-9));

	if ($('span:contains(突然)').text().slice(-9) !== '沒有釣上任何東西。' && ! firstFishingParas){
		if(lastFishMsg !== $('span:contains(突然)').text()) { // 防止釣魚太快
			resFishToday = resFishToday - 1;
			console.log('釣到一條魚，剩余釣魚次數：%d，剩余魚的條數:%d',resFishingParas, resFishToday);
		}else{
			console.log("應該是釣魚太快了！");
		}
	}
	else{
		if (! firstFishingParas){
			console.log('shit！什麼也沒釣到！');
		}
	}
	lastFishMsg = $('span:contains(突然)').text();
	if(resFishingParas > 0 && resFishToday > 0){
		clickButton(diaoyu_buttonName);
		resFishingParas = resFishingParas-1;
		console.log('釣一次魚，剩余釣魚次數：%d，剩余魚的條數:%d',resFishingParas, resFishToday);
		firstFishingParas = false;
		if (isContains($('span:contains(釣魚需要)').text().slice(-20), '釣魚需要魚竿和魚餌，你沒有')){
			clearInterval(fishFunc);
			alert('魚竿或魚餌不足，停止釣魚！');
		}
	}
	else {
		clearInterval(fishFunc);
	}
}
// 清謎題 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(clearPuzzlesButton);
var clearPuzzlesButton = document.createElement('button');
clearPuzzlesButton.innerText = '清謎題';
clearPuzzlesButton.style.position = 'absolute';
clearPuzzlesButton.style.right = '0px';
clearPuzzlesButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
clearPuzzlesButton.style.width = buttonWidth;
clearPuzzlesButton.style.height = buttonHeight;
document.body.appendChild(clearPuzzlesButton);
clearPuzzlesButton.addEventListener('click', clearPuzzleFunc);
function clearPuzzleFunc(){
	clickButton('auto_tasks cancel');
}

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		+ " " + date.getHours() + seperator2 + date.getMinutes()
		+ seperator2 + date.getSeconds();
	return currentdate;
}

function rmTails(arr) {
	for(var i=0; i< arr.length; i++) {
		var temp = arr[i].split("【");
		arr[i] = temp[0];
	}
}
function removeByValue(arr, val) {
	for(var i=0; i< arr.length; i++) {
		if(arr[i] == val) {
			arr.splice(i, 1);
		}
	}
}
function getStrStartsWith(arr, header){
	var out = [];
	var countor= 0;
	for(var i=0; i< arr.length; i++) {
		if(arr[i].startsWith(header)) {
			out[countor] = arr[i];
			countor= countor + 1;
		}
	}
	return out;
}
function getStrContains(arr, substr){
	var out = [];
	var countor= 0;
	for(var i=0; i< arr.length; i++) {
		if(isContains(arr[i],substr)) {
			out[countor] = arr[i];
			countor= countor + 1;
		}
	}
	return out;
}

// 撩奇俠 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(clearPuzzlesButton);
var QiXiaTalkButton = document.createElement('button');
QiXiaTalkButton.innerText = '撩奇俠';
QiXiaTalkButton.style.position = 'absolute';
QiXiaTalkButton.style.right = '0px';
QiXiaTalkButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
QiXiaTalkButton.style.width = buttonWidth;
QiXiaTalkButton.style.height = buttonHeight;
document.body.appendChild(QiXiaTalkButton);
QiXiaTalkButton.addEventListener('click', QiXiaTalkFunc);
function TalkWangRong(){
	// 1 王蓉，要果子
	console.log("開始撩王蓉！");
	//clickButton('open jhqx');
	clickButton('find_task_road qixia 1');
	clickButton('ask wangrong_1490609310_4537');
	clickButton('ask wangrong_1490609310_4537');
	clickButton('ask wangrong_1490609310_4537');
	clickButton('ask wangrong_1490609310_4537');
	clickButton('ask wangrong_1490609310_4537');
	clickButton('ask wangrong_1490609310_4537');
	clickButton('home');
}
function TalkLangHuanYu(){
// 0 浪喚雨
	console.log("開始撩浪喚雨！");
	clickButton('open jhqx');
	clickButton('find_task_road qixia 0');
	clickButton('ask langfuyu_1490608391_3293');
	clickButton('ask langfuyu_1490608391_3293');
	clickButton('ask langfuyu_1490608391_3293');
	clickButton('ask langfuyu_1490608391_3293');
	clickButton('ask langfuyu_1490608391_3293');
	clickButton('ask langfuyu_1490608391_3293');
	clickButton('ask langfuyu_1490608391_3293');
	clickButton('ask langfuyu_1490608391_3293');
	clickButton('ask langfuyu_1490608391_3293');
	clickButton('ask langfuyu_1490608391_3293');
	clickButton('home');
}
function TalkPangTong(){
	// 2 龐統
	console.log("開始撩龐統！");
	clickButton('open jhqx');
	clickButton('find_task_road qixia 2');
	clickButton('ask pangtong_1490610228_3357');
	clickButton('ask pangtong_1490610228_3357');
	clickButton('ask pangtong_1490610228_3357');
	clickButton('ask pangtong_1490610228_3357');
	clickButton('ask pangtong_1490610228_3357');
	clickButton('home');
}
function TalkLiYuFei(){
	// 3 李宇飛
	console.log("開始撩李宇飛！");
	clickButton('open jhqx');
	clickButton('find_task_road qixia 3');
	clickButton('ask liyufei_1490611146_2257');
	clickButton('ask liyufei_1490611146_2257');
	clickButton('ask liyufei_1490611146_2257');
	clickButton('ask liyufei_1490611146_2257');
	clickButton('ask liyufei_1490611146_2257');
	clickButton('home');
}
function TalkBuJingHong(){
	//4  步驚鴻
	console.log("開始撩步驚鴻！");
	clickButton('open jhqx');
	clickButton('find_task_road qixia 4');
	clickButton('ask bujinghong_1490612065_2087');
	clickButton('ask bujinghong_1490612065_2087');
	clickButton('ask bujinghong_1490612065_2087');
	clickButton('ask bujinghong_1490612065_2087');
	clickButton('ask bujinghong_1490612065_2087');
	clickButton('home');
}
function TalkFengXingJu(){
	//5 風行騅
	console.log("開始撩風行騅！");
	clickButton('open jhqx');
	clickButton('find_task_road qixia 5');
	clickButton('ask fengxingzhui_1499617175_8109');
	clickButton('ask fengxingzhui_1499617175_8109');
	clickButton('ask fengxingzhui_1499617175_8109');
	clickButton('ask fengxingzhui_1499617175_8109');
	clickButton('ask fengxingzhui_1499617175_8109');
	clickButton('home');
}
function TalkGuoJI(){
// 6 郭濟
	console.log("開始撩郭濟！");
	clickButton('open jhqx');
	clickButton('find_task_road qixia 6');
	clickButton('ask guoji_1490612983_8155');
	clickButton('ask guoji_1490612983_8155');
	clickButton('ask guoji_1490612983_8155');
	clickButton('ask guoji_1490612983_8155');
	clickButton('ask guoji_1490612983_8155');
	clickButton('home');
}
function TalkWuZhen(){
// 7 吳縝
	console.log("開始撩吳縝！");
	clickButton('open jhqx');
	clickButton('find_task_road qixia 7');
	clickButton('ask wuzhen_1499618083_5255');
	clickButton('ask wuzhen_1499618083_5255');
	clickButton('ask wuzhen_1499618083_5255');
	clickButton('ask wuzhen_1499618083_5255');
	clickButton('ask wuzhen_1499618083_5255');
	clickButton('home');
}
function TalkFengNan(){
// 8 風南
	console.log("開始撩風南！");
	clickButton('open jhqx');
	clickButton('find_task_road qixia 8');
	clickButton('ask fengnan_1490613902_9271');
	clickButton('ask fengnan_1490613902_9271');
	clickButton('ask fengnan_1490613902_9271');
	clickButton('ask fengnan_1490613902_9271');
	clickButton('ask fengnan_1490613902_9271');
	clickButton('home');
}
function TalkHuoYunXieShen(){
//9 火雲邪神
	console.log("開始撩火雲邪神！");
	clickButton('open jhqx');
	clickButton('find_task_road qixia 9');
	clickButton('ask huoyunxieshen_1490614820_6888');
	clickButton('ask huoyunxieshen_1490614820_6888');
	clickButton('ask huoyunxieshen_1490614820_6888');
	clickButton('ask huoyunxieshen_1490614820_6888');
	clickButton('ask huoyunxieshen_1490614820_6888');
	clickButton('home');
}
function TalkNiFengWu(){
//10 逆風舞
	console.log("開始撩逆風舞！");
	clickButton('open jhqx');
	clickButton('find_task_road qixia 10');
	clickButton('ask niwufeng_1490615738_2646');
	clickButton('ask niwufeng_1490615738_2646');
	clickButton('ask niwufeng_1490615738_2646');
	clickButton('ask niwufeng_1490615738_2646');
	clickButton('ask niwufeng_1490615738_2646');
	clickButton('home');
}
function TalkCangGuYan(){
	//11 狐蒼雁
	console.log("開始撩狐蒼雁！");
	clickButton('open jhqx');
	clickButton('find_task_road qixia 11');
	clickButton('ask hucangyan_1499618990_1050');
	clickButton('ask hucangyan_1499618990_1050');
	clickButton('ask hucangyan_1499618990_1050');
	clickButton('ask hucangyan_1499618990_1050');
	clickButton('ask hucangyan_1499618990_1050');
	clickButton('home');
}
function TalkHuZhu(){
	//12 護竺
	console.log("開始撩護竺！");
	clickButton('open jhqx');
	clickButton('find_task_road qixia 12');
	clickButton('ask huzhu_1499619897_4356');
	clickButton('ask huzhu_1499619897_4356');
	clickButton('ask huzhu_1499619897_4356');
	clickButton('ask huzhu_1499619897_4356');
	clickButton('ask huzhu_1499619897_4356');
	clickButton('home');
}
var currentTime  = 0;
var delta_Time = 300;
function QiXiaTalkFunc(){
	currentTime = 0;
	delta_Time = 300;
	var QiXiaList_Input= "";
	if(!(QiXiaList_Input = prompt("請輸入奇俠順序（奇俠間用中文分號'；'隔開）","步驚鴻；郭濟；王蓉；李宇飛；浪喚雨；龐統；風行騅；吳縝；風南；火雲邪神；逆風舞；狐蒼雁；護竺"))){
		return;
	}
	var QiXiaList = QiXiaList_Input.split("；");
	for (var i = 0; i < QiXiaList.length; i ++){
		// 每個元素刪除左右側的空格
		QiXiaList[i] = QiXiaList[i].trim(" ", "left").trim(" ","right");
	}
	// 去除可能的空元素
	removeByValue(QiXiaList, ""); // 刪除空字符串
	for (var i = 0; i < QiXiaList.length; i ++ ){
		talk2QiXiabyName(QiXiaList[i]);
	}
}
function talk2QiXiabyName(localname){
//    console.log("目前是：" + localname);
	currentTime = currentTime + delta_Time;
	switch(localname){
		case "王蓉":
			setTimeout(TalkWangRong, currentTime); // 王蓉
			break;
		case "浪喚雨":
			setTimeout(TalkLangHuanYu, currentTime);
			break;
		case "龐統":
			setTimeout(TalkPangTong, currentTime);
			break;
		case "李宇飛":
			setTimeout(TalkLiYuFei, currentTime);
			break;
		case "步驚鴻":
			setTimeout(TalkBuJingHong, currentTime);
			break;
		case "風行騅":
			setTimeout(TalkFengXingJu, currentTime);
			break;
		case "郭濟":
			setTimeout(TalkGuoJI, currentTime);
			break;
		case "吳縝":
			setTimeout(TalkWuZhen, currentTime);
			break;
		case "風南":
			setTimeout(TalkFengNan, currentTime);
			break;
		case "火雲邪神":
			setTimeout(TalkHuoYunXieShen, currentTime);
			break;
		case "逆風舞":
			setTimeout(TalkNiFengWu, currentTime);
			break;
		case "狐蒼雁":
			setTimeout(TalkCangGuYan, currentTime);
			break;
		case "護竺":
			setTimeout(TalkHuZhu, currentTime);
			break;
		default:
			console.error("沒有找到該奇俠：" + localname + " ！");
	}
}
String.prototype.trim = function (char, type) { // 去除字符串中，頭部或者尾部的指定字符串
	if (char) {
		if (type == 'left') {
			return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
		} else if (type == 'right') {
			return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
		}
		return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
	}
	return this.replace(/^\s+|\s+$/g, '');
};
// 撿鑰匙 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(clearPuzzlesButton);
var getSilverKeyButton = document.createElement('button');
getSilverKeyButton.innerText = '撿鑰匙';
getSilverKeyButton.style.position = 'absolute';
getSilverKeyButton.style.right = '0px';
getSilverKeyButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
getSilverKeyButton.style.width = buttonWidth;
getSilverKeyButton.style.height = buttonHeight;
document.body.appendChild(getSilverKeyButton);
getSilverKeyButton.addEventListener('click', getSilverKeyFunc);
var SilverKeyscanInterval = 1*60*1000 ; // 1min 去撿一次
var getSilverIntervalFunc = null;
function getSilverKeyFunc(){
	if (getSilverKeyButton.innerText == '撿鑰匙') { // 撿鑰匙
		if (!(SilverKeyscanInterval = prompt("請輸入撿鑰匙時間間隔（ms)", "60000"))){
			return;
		}
		console.log("開始自動撿鑰匙！");
		getSilverKeys();
		getSilverIntervalFunc = setInterval(getSilverKeys,SilverKeyscanInterval);
		getSilverKeyButton.innerText = '停鑰匙';
	}else{ // 停止撿鑰匙
		console.log("停止自動撿鑰匙！");
		clearInterval(getSilverIntervalFunc);
		getSilverKeyButton.innerText = '撿鑰匙';
	}
}

function getSilverKeys(){
	clickButton('jh 20');        // 進入古墓
	clickButton('go west') ;     // 山路
	clickButton('go west') ;     // 山路
	clickButton('go south') ;     // 山路
	clickButton('go east') ;     // 終南山主峰
	clickButton('go south') ;     // 山路
	clickButton('go south') ;     // 空地
	clickButton('go south') ;     // 小樹林
	clickButton('go south') ;     // 小樹林
	clickButton('go south') ;     // 小樹林
	clickButton('go southwest') ;     // 小樹林
	clickButton('go southwest') ;     // 小樹林
	clickButton('go south') ;     // 草地
	clickButton('go south') ;     // 墓門
	clickButton('go south') ;     // 墓道
	clickButton('go south') ;     // 前廳
	clickButton('go east') ;     // 墓道
	clickButton('go east') ;     // 中廳
	clickButton('event_1_3723773');// 翻開大匾
	clickButton('get yin yaoshi');
	clickButton('go south') ;     // 中廳
	clickButton('give gumu_longnv'); //給予龍兒
	clickButton('home');
	clickButton('study gumu_yufeng-book'); // 學習
}
// 撿辟邪 ------------------------------------------------------------------------------------------------------
var getBiXieButton = document.createElement('button');
getBiXieButton.innerText = '撿辟邪';
getBiXieButton.style.position = 'absolute';
getBiXieButton.style.right = '0px';
getBiXieButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
getBiXieButton.style.width = buttonWidth;
getBiXieButton.style.height = buttonHeight;
document.body.appendChild(getBiXieButton);
getBiXieButton.addEventListener('click', getBiXieFunc);
var BiXieScanInterval = 1*60*1000 ; // 1min 去撿一次
var getBiXieIntervalFunc = null;
function getBiXieFunc(){
	if (getBiXieButton.innerText == '撿辟邪') { // 撿鑰匙
		if(!(BiXieScanInterval = prompt("請輸入撿辟邪劍譜時間間隔（ms)", "100000"))){
			return;
		}
		console.log("開始自動撿辟邪劍譜！");
		getSwordMehtodology();
		getBiXieIntervalFunc = setInterval(getSwordMehtodology,BiXieScanInterval);
		getBiXieButton.innerText = '停辟邪';
	}else{ // 停止撿鑰匙
		console.log("停止自動撿辟邪劍譜！");
		clearInterval(getBiXieIntervalFunc);
		getBiXieButton.innerText = '撿辟邪';
	}
}

function getSwordMehtodology(){
	clickButton('jh 4');        // 進入華山
	clickButton('go north') ;     // 莎蘿坪
	clickButton('go north') ;     // 雲門
	clickButton('go north') ;     // 青柯坪
	clickButton('go north') ;     // 千尺幢
	clickButton('go north') ;     // 百尺峽
	clickButton('go north') ;     // 蜿蜒山路
	clickButton('go north') ;     // 上天梯
	clickButton('go north') ;     // 松林石徑
	clickButton('go north') ;     // 朝陽峰山道
	clickButton('go east') ;     // 長空棧道
	clickButton('go north') ;     // 臨淵石台
	clickButton('go north') ;     // 草叢小路
	clickButton('go north') ;     // 竹林
	clickButton('go east') ;     // 劍塚
	clickButton('huashan_luoyanya21_op1'); // 獲得劍譜
	clickButton('go west') ;     // 竹林
	clickButton('go south') ;     // 草叢小路
	clickButton('go south') ;     // 臨淵石台
	clickButton('go south') ;     // 長空棧道
	clickButton('go west') ;     // 朝陽峰山道
	clickButton('go south') ;     // 松林石徑
	clickButton('go south') ;     // 上天梯
	clickButton('event_1_91604710');
	clickButton('go south') ;     // 峽谷入口
	clickButton('go south') ;     // 狹長通道
	clickButton('go south') ;     // 潭畔草地
	clickButton('go west') ;     // 古松
	clickButton('get_silver', 0);
	clickButton('get_silver', 0);
	clickButton('home');
	var time =  getNowFormatDate();
	console.log(time + "：搜尋一次辟邪劍譜！");
}
// 加力 ------------------------------------------------------------------------------------------------------
var enforceButton = document.createElement('button');
enforceButton.innerText = '加力';
enforceButton.style.position = 'absolute';
enforceButton.style.right = '0px';
enforceButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
enforceButton.style.width = buttonWidth;
enforceButton.style.height = buttonHeight;
document.body.appendChild(enforceButton);
enforceButton.addEventListener('click', enforceFunc);
enforceFunc();

function enforceFunc(){
	if (enforceButton.innerText == '加力') { // 加力
		enforcePoints = parseInt(prompt("請輸入加力點數：",enforcePoints));

		if (enforcePoints > 0) {
			clickButton('enforce '+ enforcePoints);
			enforceButton.innerText = '不加力';
		}
	}else{ // 不加力
		clickButton('enforce');
		enforceButton.innerText = '加力';
	}
}
// 刷師門 ------------------------------------------------------------------------------------------------------
var familyQuestButton = document.createElement('button');
familyQuestIntervalFunc = null;
familyQuestPlace = '';
returnPlace = '';
familyQuestButton.innerText = '刷師門';
familyQuestButton.style.position = 'absolute';
familyQuestButton.style.right = '0px';
familyQuestButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
familyQuestButton.style.width = buttonWidth;
familyQuestButton.style.height = buttonHeight;
document.body.appendChild(familyQuestButton);
familyQuestButton.addEventListener('click', startGetFamilyQuest);

function startGetFamilyQuest() {
	if (familyQuestButton.innerText == '刷師門') {
		familyQuestPlace = prompt("請輸入地點：",familyQuestPlace);

		familyQuestIntervalFunc = setInterval(familyQuestFunc, 800);
		familyQuestButton.innerText = '停刷';
	}
	else {
		clearInterval(familyQuestIntervalFunc);
		clickButton('family_quest cancel');
		familyQuestButton.innerText = '刷師門';
	}
}
function familyQuestFunc(){
	clickButton('family_quest');
	setTimeout(checkText, 200);
}
function checkText() {
	returnPlace = $('.out2 span:contains(任務所在地方好像是：):last').text().split("：")[1].split("-")[0];

	if (returnPlace != familyQuestPlace) {
		clickButton('family_quest cancel');
	}
	else {
		clearInterval(familyQuestIntervalFunc);
		familyQuestButton.innerText = '刷師門';
		console.log("已刷到目標地點！");
	}
}
// 買物品 ------------------------------------------------------------------------------------------------------
var buyOneBeeButton = document.createElement('button');
buyOneBeeButton.innerText = '買物品';
buyOneBeeButton.style.position = 'absolute';
buyOneBeeButton.style.right = '0px';
buyOneBeeButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
buyOneBeeButton.style.width = buttonWidth;
buyOneBeeButton.style.height = buttonHeight;
document.body.appendChild(buyOneBeeButton);
buyOneBeeButton.addEventListener('click', buyOneBeeFunc);
function buyOneBeeFunc(){
	var object  = "";
	var num  = 0;
	if(!(object  = prompt("請輸入要購買的物品：","引路蜂,魚竿,魚餌）") )){ // 支持 引路蜂，魚竿，魚餌
		return;
	}
	if(!( num  = prompt("請輸入購買數量：","1"))){ // 支持 引路蜂，魚竿，魚餌
		return;
	}
	num  = parseInt(num); // 支持 引路蜂，魚竿，魚餌
	// 引路蜂
	if (object == "引路蜂"){
		for(var i=0; i < num; i++) { // 從第一個開始循環
			clickButton('shop buy shop7');
		}
	}else if (object == "魚竿"){
		for(var i=0; i < num; i++) { // 從第一個開始循環
			clickButton('shop money_buy shop5'); // 魚竿
		}
	}else if (object == "魚餌"){
		for(var i=0; i < num; i++) { // 從第一個開始循環
			clickButton('shop money_buy shop6'); // 魚餌
		}
	}else{
		alert("抱歉，此腳本還不能用於購買此物品！");
	}
}

// 殺天劍 ------------------------------------------------------------------------------------------------------
var killTianJianTargetButton = document.createElement('button');
killTianJianTargetButton.innerText = '殺天劍';
killTianJianTargetButton.style.position = 'absolute';
killTianJianTargetButton.style.right = '0px';
killTianJianTargetButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
killTianJianTargetButton.style.width = buttonWidth;
killTianJianTargetButton.style.height = buttonHeight;
document.body.appendChild(killTianJianTargetButton);
killTianJianTargetButton.addEventListener('click', killTianJianTargetFunc);
 var TianJianNPCList = ["天劍谷衛士", "天劍", "天劍真身", "虹風", "虹雨","虹雷", "虹電"];
//var TianJianNPCList = ["王鐵匠", "楊掌櫃", "柳繪心", "柳小花", "朱老伯","方老板", "醉漢"];
var killTianJianIntervalFunc =  null;
var currentNPCIndex = 0;
var setMp = 3000;

function killTianJianTargetFunc(){
	zdskill =  mySkillLists;
	if (killTianJianTargetButton.innerText == '殺天劍'){
		setMp = parseInt(prompt("請輸入低於多少內力時自動吃藥：",setMp));
		currentNPCIndex = 0;
		console.log("開始殺天劍目標NPC！");
		skillLists = mySkillLists;
		killTianJianTargetButton.innerText ='停天劍';
		killTianJianIntervalFunc = setInterval(killTianJian, 500);

	}else{
		console.log("停止殺天劍目標NPC！");
		killTianJianTargetButton.innerText ='殺天劍';
		clearInterval(killTianJianIntervalFunc);
	}
}

function killTianJian(){
//	  clickButton('go east');
	if ($('span').text().slice(-7) == "不能殺這個人。"){
		currentNPCIndex = currentNPCIndex + 1;
		console.log("不能殺這個人！");
//        return;
	}
	getTianJianTargetCode();
	setTimeout(ninesword, 200);
	if($('span:contains(勝利)').text().slice(-3)=='勝利！' || $('span:contains(戰敗了)').text().slice(-6)=='戰敗了...'){
		currentNPCIndex = 0;
		console.log('殺人一次！');

		// 加入自動吃藥功能
		clickButton('score');
		setTimeout(function() {
			console.log($('.out3:contains(【內力】)').text());
			var currMp = $('.out3:contains(內力)').text().split('【內力】')[1].split('/')[0];

			if (currMp < setMp)
				userMedecineFunc();
			clickButton('prev');
		}, 300);

		clickButton('prev_combat');
	}
}
function getTianJianTargetCode(){
	var peopleList = $(".cmd_click3");
	var thisonclick = null;
	var targetNPCListHere = [];
	var countor= 0;
	for(var i=0; i < peopleList.length; i++) { // 從第一個開始循環
		// 打印 NPC 名字，button 名，相應的NPC名
		thisonclick = peopleList[i].getAttribute('onclick');
		if (TianJianNPCList.contains(peopleList[i].innerText)){
			var targetCode = thisonclick.split("'")[1].split(" ")[1];
			//           console.log("發現NPC名字：" +  peopleList[i].innerText + "，代號：" + targetCode);
			targetNPCListHere[countor] = peopleList[i];
			countor = countor +1;
		}
	}
	// targetNPCListHere 是當前場景所有滿足要求的NPC button數組
	if (currentNPCIndex >= targetNPCListHere.length){
		currentNPCIndex = 0;
	}
	if (targetNPCListHere.length > 0){
		thisonclick = targetNPCListHere[currentNPCIndex].getAttribute('onclick');
		var targetCode = thisonclick.split("'")[1].split(" ")[1];
		console.log("准備殺目標NPC名字：" + targetNPCListHere[currentNPCIndex].innerText + "，代碼：" + targetCode +"，目標列表中序號：" + (currentNPCIndex ));
		clickButton('kill ' + targetCode); // 點擊殺人
		setTimeout(detectKillTianJianInfo,200); // 200 ms後獲取殺人情況，是滿了還是進入了
	}
}
function detectKillTianJianInfo(){
	var TianJianInfo = $('span').text();
	if (TianJianInfo.slice(-15) == "已經太多人了，不要以多欺少啊。"){
		currentNPCIndex = currentNPCIndex + 1;
	}else{
		currentNPCIndex = 0;
	}
}
Array.prototype.contains = function (obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}
// 跳瀑布 ------------------------------------------------------------------------------------------------------
var goBack2WaterFallButton = document.createElement('button');
goBack2WaterFallButton.innerText = '跳瀑布';
goBack2WaterFallButton.style.position = 'absolute';
goBack2WaterFallButton.style.right = '0px';
goBack2WaterFallButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
goBack2WaterFallButton.style.width = buttonWidth;
goBack2WaterFallButton.style.height = buttonHeight;
document.body.appendChild(goBack2WaterFallButton);
goBack2WaterFallButton.addEventListener('click', startFall);

function startFall() {
	clickButton('event_1_44025101', 0); // 跳下去

	setTimeout(goBack2WaterFallFunc, 500);
}

function goBack2WaterFallFunc(){
	/*
	if ($('.cmd_click_room')[0] == undefined || $('.cmd_click_room')[0].innerText !== "淺海"){
		alert("請位於 #淺海# 位置再點 #回瀑布# 按鈕！");
		return;
	}
	*/

	/*
	clickButton('event_1_4788477', 0);
	clickButton('go northwest');
	clickButton('go west');
	clickButton('go southwest');
	clickButton('go west');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go west');
	clickButton('go west');
	clickButton('go south');
	clickButton('go west');
	clickButton('go northwest');
	clickButton('go west');
	clickButton('go east');
	clickButton('go northeast');
	clickButton('go northeast');
	clickButton('go northeast');
	clickButton('go east');
	clickButton('go east');
	clickButton('go east');
	clickButton('go east');
	clickButton('go east');
	clickButton('go south');
	clickButton('go east');
	clickButton('event_1_44025101', 0);
	*/

	// 進入甬道
	// <button type="button" cellpadding="0" cellspacing="0" onclick="clickButton('event_1_36230918', 0)" class="cmd_click3">進入甬道</button>
	//clickButton('event_1_44025101', 0); // 跳下去
	if ($('.cmd_click3:first').text() == '遊出去') {
		clickButton('event_1_4788477', 0);
		clickButton('go northwest');
		clickButton('go west');
		clickButton('go southwest');
		clickButton('go west');
		clickButton('go north');
		clickButton('go north');
		clickButton('go north');
		clickButton('go west');
		clickButton('go west');
		clickButton('go south');
		clickButton('go west');
		clickButton('go northwest');
		clickButton('go west');
		clickButton('go east');
		clickButton('go northeast');
		clickButton('go northeast');
		clickButton('go northeast');
		clickButton('go east');
		clickButton('go east');
		clickButton('go east');
		clickButton('go east');
		clickButton('go east');
		clickButton('go south');
		clickButton('go east');

		startFall(); // loop again
	}
	else {
		// 進入甬道, 領悟潛能
		clickButton('event_1_36230918', 0);
		clickButton('go east');
		clickButton('go east');
		clickButton('go south');
		clickButton('event_1_77496481', 0);
	}
}
// 吃藥 ------------------------------------------------------------------------------------------------------
var userMedecineButton = document.createElement('button');
userMedecineButton.innerText = '吃補藥';
userMedecineButton.style.position = 'absolute';
userMedecineButton.style.right = '0px';
userMedecineButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
userMedecineButton.style.width = buttonWidth;
userMedecineButton.style.height = buttonHeight;
document.body.appendChild(userMedecineButton);
userMedecineButton.addEventListener('click', userMedecineFunc);
function userMedecineFunc(){
   clickButton('items use snow_qiannianlingzhi');
}

// 答題 ------------------------------------------------------------------------------------------------------
var answerQuestionsButton = document.createElement('button');
answerQuestionsButton.innerText = '開答題';
answerQuestionsButton.style.position = 'absolute';
answerQuestionsButton.style.right = '11px';
answerQuestionsButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
answerQuestionsButton.style.width = buttonWidth;
answerQuestionsButton.style.height = buttonHeight;
document.body.appendChild(answerQuestionsButton);
answerQuestionsButton.addEventListener('click', answerQuestionsFunc);
var answerQuestionsInterval = null;
var QuestAnsLibs = {
	"“白玉牌楼”场景是在哪个地图上？":"c",
	"“百龙山庄”场景是在哪个地图上？":"b",
	"“冰火岛”场景是在哪个地图上？":"b",
	"“常春岛渡口”场景是在哪个地图上？":"c",
	"“跪拜坪”场景是在哪个地图上？":"b",
	"“翰墨书屋”场景是在哪个地图上？":"c",
	"“花海”场景是在哪个地图上？":"a",
	"“留云馆”场景是在哪个地图上？":"b",
	"“日月洞”场景是在哪个地图上？":"b",
	"“蓉香榭”场景是在哪个地图上？":"c",
	"“三清殿”场景是在哪个地图上？":"b",
	"“三清宫”场景是在哪个地图上？":"c",
	"“双鹤桥”场景是在哪个地图上？":"b",
	"“无名山脚”场景是在哪个地图上？":"d",
	"“伊犁”场景是在哪个地图上？":"b",
	"“鹰记商号”场景是在哪个地图上？":"d",
	"“迎梅客栈”场景是在哪个地图上？":"d",
	"“子午楼”场景是在哪个地图上？":"c",
	"8级的装备摹刻需要几把刻刀":"a",
	"NPC公平子在哪一章地图":"a",
	"瑷伦在晚月庄的哪个场景":"b",
	"安惜迩是在那个场景":"c",
	"黯然销魂掌有多少招式？":"c",
	"黯然销魂掌是哪个门派的技能":"a",
	"八卦迷阵是哪个门派的阵法？":"b",
	"八卦迷阵是那个门派的阵法":"a",
	"白金戒指可以在哪位npc那里获得？":"b",
	"白金手镯可以在哪位npc那里获得？":"a",
	"白金项链可以在哪位npc那里获得？":"b",
	"白蟒鞭的伤害是多少？":"a",
	"白驼山第一位要拜的师傅是谁":"a",
	"白银宝箱礼包多少元宝一个":"d",
	"白玉腰束是腰带类的第几级装备？":"b",
	"拜师风老前辈需要正气多少":"b",
	"拜师老毒物需要蛤蟆功多少级":"a",
	"拜师铁翼需要多少内力":"b",
	"拜师小龙女需要容貌多少":"c",
	"拜师张三丰需要多少正气":"b",
	"包家将是哪个门派的师傅":"a",
	"包拯在哪一章":"d",
	"宝石合成一次需要消耗多少颗低级宝石？":"c",
	"宝玉帽可以在哪位那里获得？":"d",
	"宝玉鞋击杀哪个npc可以获得":"a",
	"宝玉鞋在哪获得":"a",
	"暴雨梨花针的伤害是多少？":"c",
	"北斗七星阵是第几个的组队副本":"c",
	"北冥神功是哪个门派的技能":"b",
	"北岳殿神像后面是哪位npc":"b",
	"匕首加什么属性":"c",
	"碧海潮生剑在哪位师傅处学习":"a",
	"碧磷鞭的伤害是多少？":"b",
	"镖局保镖是挂机里的第几个任务":"d",
	"冰魄银针的伤害是多少？":"b",
	"病维摩拳是哪个门派的技能":"b",
	"不可保存装备下线多久会消失":"c",
	"不属於白驼山的技能是什么":"b",
	"不属于白驼山的技能是什么":"b",
	"沧海护腰可以镶嵌几颗宝石":"d",
	"沧海护腰是腰带类的第几级装备？":"a",
	"藏宝图在哪个NPC处购买":"a",
	"藏宝图在哪个处购买":"b",
	"藏宝图在哪里那里买":"a",
	"草帽可以在哪位npc那里获得？":"b",
	"成功易容成异性几次可以领取易容成就奖":"b",
	"成长计划第七天可以领取多少元宝？":"d",
	"成长计划六天可以领取多少银两？":"d",
	"成长计划需要多少元宝方可购买？":"a",
	"城里打擂是挂机里的第几个任务":"d",
	"城里抓贼是挂机里的第几个任务":"b",
	"充值积分不可以兑换下面什么物品":"d",
	"出生选武学世家增加什么":"a",
	"闯楼第几层可以获得称号“藏剑楼护法”":"b",
	"闯楼第几层可以获得称号“藏剑楼楼主”":"d",
	"闯楼第几层可以获得称号“藏剑楼长老”":"c",
	"闯楼每多少层有称号奖励":"a",
	"春风快意刀是哪个门派的技能":"b",
	"春秋水色斋需要多少杀气才能进入":"d",
	"从哪个处进入跨服战场":"a",
	"摧心掌是哪个门派的技能":"a",
	"达摩在少林哪个场景":"c",
	"达摩杖的伤害是多少？":"d",
	"打开引路蜂礼包可以得到多少引路蜂？":"b",
	"打排行榜每天可以完成多少次？":"a",
	"打土匪是挂机里的第几个任务":"c",
	"打造刻刀需要多少个玄铁":"a",
	"打坐增长什么属性":"a",
	"大保险卡可以承受多少次死亡後不降技能等级？":"b",
	"大乘佛法有什么效果":"d",
	"大旗门的修养术有哪个特殊效果":"a",
	"大旗门的云海心法可以提升哪个属性":"c",
	"大招寺的金刚不坏功有哪个特殊效果":"a",
	"大招寺的铁布衫有哪个特殊效果":"c",
	"当日最低累积充值多少元即可获得返利？":"b",
	"刀法基础在哪掉落":"a",
	"倒乱七星步法是哪个门派的技能":"d",
	"等级多少才能在世界频道聊天？":"c",
	"第一个副本需要多少等级才能进入":"d",
	"貂皮斗篷是披风类的第几级装备？":"b",
	"丁老怪是哪个门派的终极师傅":"a",
	"丁老怪在星宿海的哪个场景":"b",
	"东方教主在魔教的哪个场景":"b",
	"斗转星移是哪个门派的技能":"a",
	"斗转星移阵是哪个门派的阵法":"a",
	"毒龙鞭的伤害是多少？":"a",
	"毒物阵法是哪个门派的阵法":"b",
	"独孤求败有过几把剑？":"d",
	"独龙寨是第几个组队副本":"a",
	"读书写字301-400级在哪里买书":"c",
	"读书写字最高可以到多少级":"b",
	"端茶递水是挂机里的第几个任务":"b",
	"断云斧是哪个门派的技能":"a",
	"锻造一把刻刀需要多少玄铁碎片锻造？":"c",
	"锻造一把刻刀需要多少银两？":"a",
	"兑换易容面具需要多少玄铁碎片":"c",
	"多少消费积分换取黄金宝箱":"a",
	"多少消费积分可以换取黄金钥匙":"b",
	"翻译梵文一次多少银两":"d",
	"方媃是哪个门派的师傅":"b",
	"飞仙剑阵是哪个门派的阵法":"b",
	"风老前辈在华山哪个场景":"b",
	"风泉之剑加几点悟性":"c",
	"风泉之剑可以在哪位那里获得？":"b",
	"风泉之剑在哪里获得":"d",
	"疯魔杖的伤害是多少？":"b",
	"伏虎杖的伤害是多少？":"c",
	"副本完成後不可获得下列什么物品":"b",
	"副本一次最多可以进几人":"a",
	"副本有什么奖励":"d",
	"富春茶社在哪一章":"c",
	"改名字在哪改？":"d",
	"丐帮的绝学是什么":"a",
	"丐帮的轻功是哪个":"b",
	"干苦力是挂机里的第几个任务":"a",
	"钢丝甲衣可以在哪位那里获得？":"d",
	"高级乾坤再造丹加什么":"b",
	"高级乾坤再造丹是增加什么的？":"b",
	"高级突破丹多少元宝一颗":"d",
	"割鹿刀可以在哪位npc那里获得？":"b",
	"葛伦在大招寺的哪个场景":"b",
	"根骨能提升哪个属性":"c",
	"功德箱捐香火钱有什么用":"a",
	"功德箱在雪亭镇的哪个场景？":"c",
	"购买新手进阶礼包在挂机打坐练习上可以享受多少倍收益？":"b",
	"孤独求败称号需要多少论剑积分兑换":"b",
	"孤儿出身增加什么":"d",
	"古灯大师是哪个门派的终极师傅":"c",
	"古灯大师在大理哪个场景":"c",
	"古墓多少级以後才能进去？":"d",
	"寒玉床睡觉修炼需要多少点内力值":"c",
	"寒玉床睡觉一次多久":"c",
	"寒玉床需要切割多少次":"d",
	"寒玉床在哪里切割":"a",
	"寒玉床在那个地图可以找到？":"a",
	"黑狗血在哪获得":"b",
	"黑水伏蛟可以在哪位那里获得？":"c",
	"红宝石加什么属性":"b",
	"洪帮主在洛阳哪个场景":"c",
	"虎皮腰带是腰带类的第几级装备？":"a",
	"花不为在哪一章":"a",
	"花花公子在哪个地图":"a",
	"华山村王老二掉落的物品是什么":"a",
	"华山施戴子掉落的物品是什么":"b",
	"华山武器库从哪个NPC进":"d",
	"黄宝石加什么属性":"c",
	"黄岛主在桃花岛的哪个场景":"d",
	"黄袍老道是哪个门派的师傅":"c",
	"积分商城在雪亭镇的哪个场景？":"c",
	"技能柳家拳谁教的？":"a",
	"技能数量超过了什么消耗潜能会增加":"b",
	"嫁衣神功是哪个门派的技能":"b",
	"剑冢在哪个地图":"a",
	"街头卖艺是挂机里的第几个任务":"a",
	"金弹子的伤害是多少？":"a",
	"金刚不坏功有什么效果":"a",
	"金刚杖的伤害是多少？":"a",
	"金戒指可以在哪位npc那里获得？":"d",
	"金手镯可以在哪位npc那里获得？":"b",
	"金丝鞋可以在哪位npc那里获得？":"b",
	"金项链可以在哪位npc那里获得？":"d",
	"金玉断云是哪个门派的阵法":"a",
	"锦缎腰带是腰带类的第几级装备？":"a",
	"精铁棒可以在哪位那里获得？":"d",
	"九区服务器名称":"d",
	"九阳神功是哪个门派的技能":"c",
	"九阴派梅师姐在星宿海哪个场景":"a",
	"军营是第几个组队副本":"b",
	"开通VIP月卡最低需要当天充值多少元方有购买资格？":"a",
	"可以召唤金甲伏兵助战是哪个门派？":"a",
	"客商在哪一章":"b",
	"孔雀氅可以镶嵌几颗宝石":"b",
	"孔雀氅是披风类的第几级装备？":"c",
	"枯荣禅功是哪个门派的技能":"a",
	"跨服是星期几举行的":"b",
	"跨服天剑谷每周六几点开启":"a",
	"跨服需要多少级才能进入":"c",
	"跨服在哪个场景进入":"c",
	"兰花拂穴手是哪个门派的技能":"a",
	"蓝宝石加什么属性":"a",
	"蓝止萍在哪一章":"c",
	"蓝止萍在晚月庄哪个小地图":"b",
	"老毒物在白驮山的哪个场景":"b",
	"老顽童在全真教哪个场景":"b",
	"莲花掌是哪个门派的技能":"a",
	"烈火旗大厅是那个地图的场景":"c",
	"烈日项链可以镶嵌几颗宝石":"c",
	"林祖师是哪个门派的师傅":"a",
	"灵蛇杖法是哪个门派的技能":"c",
	"凌波微步是哪个门派的技能":"b",
	"凌虚锁云步是哪个门派的技能":"b",
	"领取消费积分需要寻找哪个NPC？":"c",
	"鎏金缦罗是披风类的第几级装备？":"d",
	"柳淳风在哪一章":"c",
	"柳淳风在雪亭镇哪个场景":"b",
	"柳文君所在的位置":"a",
	"六脉神剑是哪个门派的绝学":"a",
	"陆得财是哪个门派的师傅":"c",
	"陆得财在乔阴县的哪个场景":"a",
	"论剑每天能打几次":"a",
	"论剑是每周星期几":"c",
	"论剑是什么时间点正式开始":"a",
	"论剑是星期几进行的":"c",
	"论剑是星期几举行的":"c",
	"论剑输一场获得多少论剑积分":"a",
	"论剑要在晚上几点前报名":"b",
	"论剑在周几进行？":"b",
	"论剑中步玄派的师傅是哪个":"a",
	"论剑中大招寺第一个要拜的师傅是谁":"c",
	"论剑中古墓派的终极师傅是谁":"d",
	"论剑中花紫会的师傅是谁":"c",
	"论剑中青城派的第一个师傅是谁":"a",
	"论剑中青城派的终极师傅是谁":"d",
	"论剑中逍遥派的终极师傅是谁":"c",
	"论剑中以下不是峨嵋派技能的是哪个":"b",
	"论剑中以下不是华山派的人物的是哪个":"d",
	"论剑中以下哪个不是大理段家的技能":"c",
	"论剑中以下哪个不是大招寺的技能":"b",
	"论剑中以下哪个不是峨嵋派可以拜师的师傅":"d",
	"论剑中以下哪个不是丐帮的技能":"d",
	"论剑中以下哪个不是丐帮的人物":"a",
	"论剑中以下哪个不是古墓派的的技能":"b",
	"论剑中以下哪个不是华山派的技能的":"d",
	"论剑中以下哪个不是明教的技能":"d",
	"论剑中以下哪个不是魔教的技能":"a",
	"论剑中以下哪个不是魔教的人物":"d",
	"论剑中以下哪个不是全真教的技能":"d",
	"论剑中以下哪个不是是晚月庄的技能":"d",
	"论剑中以下哪个不是唐门的技能":"c",
	"论剑中以下哪个不是唐门的人物":"c",
	"论剑中以下哪个不是铁雪山庄的技能":"d",
	"论剑中以下哪个不是铁血大旗门的技能":"c",
	"论剑中以下哪个是大理段家的技能":"a",
	"论剑中以下哪个是大招寺的技能":"b",
	"论剑中以下哪个是丐帮的技能":"b",
	"论剑中以下哪个是花紫会的技能":"a",
	"论剑中以下哪个是华山派的技能的":"a",
	"论剑中以下哪个是明教的技能":"b",
	"论剑中以下哪个是青城派的技能":"b",
	"论剑中以下哪个是唐门的技能":"b",
	"论剑中以下哪个是天邪派的技能":"b",
	"论剑中以下哪个是天邪派的人物":"a",
	"论剑中以下哪个是铁雪山庄的技能":"c",
	"论剑中以下哪个是铁血大旗门的技能":"b",
	"论剑中以下哪个是铁血大旗门的师傅":"a",
	"论剑中以下哪个是晚月庄的技能":"a",
	"论剑中以下哪个是晚月庄的人物":"a",
	"论剑中以下是峨嵋派技能的是哪个":"a",
	"论语在哪购买":"a",
	"骆云舟在哪一章":"c",
	"骆云舟在乔阴县的哪个场景":"b",
	"落英神剑掌是哪个门派的技能":"b",
	"吕进在哪个地图":"a",
	"绿宝石加什么属性":"c",
	"漫天花雨匕在哪获得":"a",
	"茅山的绝学是什么":"b",
	"茅山的天师正道可以提升哪个属性":"d",
	"茅山可以招几个宝宝":"c",
	"茅山派的轻功是什么":"b",
	"茅山天师正道可以提升什么":"c",
	"茅山学习什么技能招宝宝":"a",
	"茅山在哪里拜师":"c",
	"每次合成宝石需要多少银两？":"a",
	"每个玩家最多能有多少个好友":"b",
	"vip每天不可以领取什么":"b",
	"每天的任务次数几点重置":"d",
	"每天分享游戏到哪里可以获得20元宝":"a",
	"每天能挖几次宝":"d",
	"每天能做多少个谜题任务":"a",
	"每天能做多少个师门任务":"c",
	"每天微信分享能获得多少元宝":"d",
	"每天有几次试剑":"b",
	"每天在线多少个小时即可领取消费积分？":"b",
	"每突破一次技能有效系数加多少":"a",
	"密宗伏魔是哪个门派的阵法":"c",
	"灭绝师太在第几章":"c",
	"灭绝师太在峨眉山哪个场景":"a",
	"明教的九阳神功有哪个特殊效果":"a",
	"明月帽要多少刻刀摩刻？":"a",
	"摹刻10级的装备需要摩刻技巧多少级":"b",
	"摹刻烈日宝链需要多少级摩刻技巧？":"c",
	"摹刻扬文需要多少把刻刀？":"a",
	"魔鞭诀在哪里学习":"d",
	"魔教的大光明心法可以提升哪个属性":"d",
	"莫不收在哪一章":"a",
	"墨磷腰带是腰带类的第几级装备？":"d",
	"木道人在青城山的哪个场景":"b",
	"慕容家主在慕容山庄的哪个场景":"a",
	"慕容山庄的斗转星移可以提升哪个属性":"d",
	"哪个NPC掉落拆招基础":"a",
	"哪个处可以捏脸":"a",
	"哪个分享可以获得20元宝":"b",
	"哪个技能不是魔教的":"d",
	"哪个门派拜师没有性别要求":"d",
	"哪个npc属於全真七子":"b",
	"哪样不能获得玄铁碎片":"c",
	"能增容貌的是下面哪个技能":"a",
	"捏脸需要花费多少银两？":"c",
	"捏脸需要寻找哪个NPC？":"a",
	"欧阳敏是哪个门派的？":"b",
	"欧阳敏是哪个门派的师傅":"b",
	"欧阳敏在哪一章":"a",
	"欧阳敏在唐门的哪个场景":"c",
	"排行榜最多可以显示多少名玩家？":"a",
	"逄义是在那个场景":"a",
	"披星戴月是披风类的第几级装备？":"d",
	"劈雳拳套有几个镶孔":"a",
	"霹雳掌套的伤害是多少":"b",
	"辟邪剑法是哪个门派的绝学技能":"a",
	"辟邪剑法在哪学习":"b",
	"婆萝蜜多心经是哪个门派的技能":"b",
	"七宝天岚舞是哪个门派的技能":"d",
	"七星鞭的伤害是多少？":"c",
	"七星剑法是哪个门派的绝学":"a",
	"棋道是哪个门派的技能":"c",
	"千古奇侠称号需要多少论剑积分兑换":"d",
	"乾坤大挪移属於什么类型的武功":"a",
	"乾坤大挪移属于什么类型的武功":"a",
	"乾坤一阳指是哪个师傅教的":"a",
	"青城派的道德经可以提升哪个属性":"c",
	"青城派的道家心法有哪个特殊效果":"a",
	"清风寨在哪":"b",
	"清风寨在哪个地图":"d",
	"清虚道长在哪一章":"d",
	"去唐门地下通道要找谁拿钥匙":"a",
	"全真的道家心法有哪个特殊效果":"a",
	"全真的基本阵法有哪个特殊效果":"b",
	"全真的双手互搏有哪个特殊效果":"c",
	"日月神教大光明心法可以提升什么":"d",
	"如何将华山剑法从400级提升到440级？":"d",
	"如意刀是哪个门派的技能":"c",
	"山河藏宝图需要在哪个NPC手里购买？":"d",
	"上山打猎是挂机里的第几个任务":"c",
	"少林的混元一气功有哪个特殊效果":"d",
	"少林的易筋经神功有哪个特殊效果":"a",
	"蛇形刁手是哪个门派的技能":"b",
	"什么影响打坐的速度":"c",
	"什么影响攻击力":"d",
	"什么装备不能镶嵌黄水晶":"d",
	"什么装备都能镶嵌的是什么宝石？":"c",
	"什么装备可以镶嵌紫水晶":"c",
	"神雕大侠所在的地图":"b",
	"神雕大侠在哪一章":"a",
	"神雕侠侣的时代背景是哪个朝代？":"d",
	"神雕侠侣的作者是?":"b",
	"升级什么技能可以提升根骨":"a",
	"生死符的伤害是多少？":"a",
	"师门磕头增加什么":"a",
	"师门任务每天可以完成多少次？":"a",
	"师门任务每天可以做多少个？":"c",
	"师门任务什么时候更新？":"b",
	"师门任务一天能完成几次":"d",
	"师门任务最多可以完成多少个？":"d",
	"施令威在哪个地图":"b",
	"石师妹哪个门派的师傅":"c",
	"使用朱果经验潜能将分别增加多少？":"a",
	"首次通过桥阴县不可以获得那种奖励？":"a",
	"受赠的消费积分在哪里领取":"d",
	"兽皮鞋可以在哪位那里获得？":"b",
	"树王坟在第几章节":"c",
	"双儿在扬州的哪个小地图":"a",
	"孙天灭是哪个门派的师傅":"c",
	"踏雪无痕是哪个门派的技能":"b",
	"踏云棍可以在哪位那里获得？":"a",
	"唐门的唐门毒经有哪个特殊效果":"a",
	"唐门密道怎么走":"c",
	"天蚕围腰可以镶嵌几颗宝石":"d",
	"天蚕围腰是腰带类的第几级装备？":"d",
	"天山姥姥在逍遥林的哪个场景":"d",
	"天山折梅手是哪个门派的技能":"c",
	"天师阵法是哪个门派的阵法":"b",
	"天邪派在哪里拜师":"b",
	"天羽奇剑是哪个门派的技能":"a",
	"铁戒指可以在哪位npc那里获得？":"a",
	"铁手镯 可以在哪位npc那里获得？":"a",
	"铁血大旗门云海心法可以提升什么":"a",
	"通灵需要花费多少银两？":"d",
	"通灵需要寻找哪个NPC？":"c",
	"突破丹在哪里购买":"b",
	"屠龙刀法是哪个门派的绝学技能":"b",
	"屠龙刀是什么级别的武器":"a",
	"挖剑冢可得什么":"a",
	"弯月刀可以在哪位那里获得？":"b",
	"玩家每天能够做几次正邪任务":"c",
	"玩家想修改名字可以寻找哪个NPC？":"a",
	"晚月庄的内功是什么":"b",
	"晚月庄的七宝天岚舞可以提升哪个属性":"b",
	"晚月庄的小贩在下面哪个地点":"a",
	"晚月庄七宝天岚舞可以提升什么":"b",
	"晚月庄主线过关要求":"a",
	"王铁匠是在那个场景":"b",
	"王重阳是哪个门派的师傅":"b",
	"魏无极处读书可以读到多少级？":"a",
	"魏无极身上掉落什么装备":"c",
	"魏无极在第几章":"a",
	"闻旗使在哪个地图":"a",
	"乌金玄火鞭的伤害是多少？":"d",
	"乌檀木刀可以在哪位那里获得？":"d",
	"钨金腰带是腰带类的第几级装备？":"d",
	"武当派的绝学技能是以下哪个":"d",
	"武穆兵法提升到多少级才能出现战斗必刷？":"d",
	"武穆兵法通过什么学习":"a",
	"武学世家加的什么初始属性":"a",
	"舞中之武是哪个门派的阵法":"b",
	"西毒蛇杖的伤害是多少？":"c",
	"吸血蝙蝠在下面哪个地图":"a",
	"下列哪项战斗不能多个玩家一起战斗？":"a",
	"下列装备中不可摹刻的是":"c",
	"下面哪个不是古墓的师傅":"d",
	"下面哪个不是门派绝学":"d",
	"下面哪个npc不是魔教的":"d",
	"下面哪个地点不是乔阴县的":"d",
	"下面哪个门派是正派":"a",
	"下面哪个是天邪派的师傅":"a",
	"下面有什么是寻宝不能获得的":"c",
	"向师傅磕头可以获得什么？":"b",
	"逍遥步是哪个门派的技能":"a",
	"逍遥林是第几章的地图":"c",
	"逍遥林怎么弹琴可以见到天山姥姥":"b",
	"逍遥派的绝学技能是以下哪个":"a",
	"萧辟尘在哪一章":"d",
	"小李飞刀的伤害是多少？":"d",
	"小龙女住的古墓是谁建造的？":"b",
	"小男孩在华山村哪里":"a",
	"新人礼包在哪个npc处兑换":"a",
	"新手礼包在哪里领取":"a",
	"新手礼包在哪领取？":"c",
	"需要使用什么衣服才能睡寒玉床":"a",
	"选择孤儿会影响哪个属性":"c",
	"选择商贾会影响哪个属性":"b",
	"选择书香门第会影响哪个属性":"b",
	"选择武学世家会影响哪个属性":"a",
	"学习屠龙刀法需要多少内力":"b",
	"雪莲有什么作用":"a",
	"雪蕊儿是哪个门派的师傅":"a",
	"雪蕊儿在铁雪山庄的哪个场景":"d",
	"扬文的属性":"a",
	"扬州询问黑狗能到下面哪个地点":"a",
	"扬州在下面哪个地点的处可以获得玉佩":"c",
	"羊毛斗篷是披风类的第几级装备？":"a",
	"阳刚之劲是哪个门派的阵法":"c",
	"杨过小龙女分开多少年後重逢?":"c",
	"杨过在哪个地图":"a",
	"夜行披风是披风类的第几级装备？":"a",
	"夜皇在大旗门哪个场景":"c",
	"一个队伍最多有几个队员":"c",
	"一天能完成谜题任务多少个":"b",
	"一天能完成师门任务有多少个":"c",
	"一天能完成挑战排行榜任务多少次":"a",
	"一张分身卡的有效时间是多久":"c",
	"一指弹在哪里领悟":"b",
	"移开明教石板需要哪项技能到一定级别":"a",
	"以下不是步玄派的技能的哪个":"c",
	"以下不是天宿派师傅的是哪个":"c",
	"以下不是隐藏门派的是哪个":"d",
	"以下哪个宝石不能镶嵌到戒指":"c",
	"以下哪个宝石不能镶嵌到内甲":"a",
	"以下哪个宝石不能镶嵌到披风":"c",
	"以下哪个宝石不能镶嵌到腰带":"c",
	"以下哪个宝石不能镶嵌到衣服":"a",
	"以下哪个不是道尘禅师教导的武学？":"d",
	"以下哪个不是何不净教导的武学？":"c",
	"以下哪个不是慧名尊者教导的技能？":"d",
	"以下哪个不是空空儿教导的武学？":"b",
	"以下哪个不是梁师兄教导的武学？":"b",
	"以下哪个不是论剑的皮肤？":"d",
	"以下哪个不是全真七子？":"c",
	"以下哪个不是宋首侠教导的武学？":"d",
	"以下哪个不是微信分享好友、朋友圈、QQ空间的奖励？":"a",
	"以下哪个不是岳掌门教导的武学？":"a",
	"以下哪个不是在洛阳场景":"d",
	"以下哪个不是在雪亭镇场景":"d",
	"以下哪个不是在扬州场景":"d",
	"以下哪个不是知客道长教导的武学？":"b",
	"以下哪个门派不是隐藏门派？":"c",
	"以下哪个门派是正派？":"d",
	"以下哪个门派是中立门派？":"a",
	"以下哪个是步玄派的祖师":"b",
	"以下哪个是封山派的祖师":"c",
	"以下哪个是花紫会的祖师":"a",
	"以下哪个是晚月庄的祖师":"d",
	"以下哪些物品不是成长计划第二天可以领取的？":"c",
	"以下哪些物品不是成长计划第三天可以领取的？":"d",
	"以下哪些物品不是成长计划第一天可以领取的？":"d",
	"以下哪些物品是成长计划第四天可以领取的？":"a",
	"以下哪些物品是成长计划第五天可以领取的？":"b",
	"以下属于邪派的门派是哪个":"b",
	"以下属于正派的门派是哪个":"a",
	"以下谁不精通降龙十八掌？":"d",
	"以下有哪些物品不是每日充值的奖励？":"d",
	"倚天剑加多少伤害":"d",
	"倚天屠龙记的时代背景哪个朝代？":"a",
	"易容後保持时间是多久":"a",
	"易容面具需要多少玄铁兑换":"c",
	"易容术多少级才可以易容成异性NPC":"a",
	"易容术可以找哪位NPC学习？":"b",
	"易容术向谁学习":"a",
	"易容术在哪里学习":"a",
	"易容术在哪学习？":"b",
	"银手镯可以在哪位npc那里获得？":"b",
	"银丝链甲衣可以在哪位npc那里获得？":"a",
	"银项链可以在哪位npc那里获得？":"b",
	"尹志平是哪个门派的师傅":"b",
	"隐者之术是那个门派的阵法":"a",
	"鹰爪擒拿手是哪个门派的技能":"a",
	"影响你出生的福缘的出生是？":"d",
	"油流麻香手是哪个门派的技能":"a",
	"游龙散花是哪个门派的阵法":"d",
	"玉蜂浆在哪个地图获得":"a",
	"玉女剑法是哪个门派的技能":"b",
	"岳掌门在哪一章":"a",
	"云九天是哪个门派的师傅":"c",
	"云问天在哪一章":"a",
	"在洛阳萧问天那可以学习什么心法":"b",
	"在庙祝处洗杀气每次可以消除多少点":"a",
	"在哪个NPC可以购买恢复内力的药品？":"c",
	"在哪个处可以更改名字":"a",
	"在哪个处领取免费消费积分":"d",
	"在哪个处能够升级易容术":"b",
	"在哪里可以找到“香茶”？":"a",
	"在哪里捏脸提升容貌":"d",
	"在哪里消杀气":"a",
	"在逍遥派能学到的技能是哪个":"a",
	"在雪亭镇李火狮可以学习多少级柳家拳":"b",
	"在战斗界面点击哪个按钮可以进入聊天界面":"d",
	"在正邪任务中不能获得下面什么奖励？":"d",
	"怎么样获得免费元宝":"a",
	"赠送李铁嘴银两能够增加什么":"a",
	"张教主在明教哪个场景":"d",
	"张三丰在哪一章":"d",
	"张三丰在武当山哪个场景":"d",
	"张松溪在哪个地图":"c",
	"张天师是哪个门派的师傅":"a",
	"张天师在茅山哪个场景":"d",
	"长虹剑在哪位npc那里获得？":"a",
	"长剑在哪里可以购买？":"a",
	"正邪任务杀死好人增长什么":"b",
	"正邪任务一天能做几次":"a",
	"正邪任务中客商的在哪个地图":"a",
	"正邪任务中卖花姑娘在哪个地图":"b",
	"正邪任务最多可以完成多少个？":"d",
	"支线对话书生上魁星阁二楼杀死哪个NPC给10元宝":"a",
	"朱姑娘是哪个门派的师傅":"a",
	"朱老伯在华山村哪个小地图":"b",
	"追风棍可以在哪位npc那里获得？":"a",
	"追风棍在哪里获得":"b",
	"紫宝石加什么属性":"d",
	"钻石项链在哪获得":"a",
	"从哪个npc处进入跨服战场":"a",
	"跨服副本周六几点开启":"a",
	"黑水伏蛟可以在哪位npc那里获得？":"c"
}
function answerQuestionsFunc(){
	if(answerQuestionsButton.innerText == "開答題"){
		console.log("准備自動答題！");
		answerQuestionsInterval = setInterval(answerQuestions, 1000);
		answerQuestionsButton.innerText = "停答題";
	}else{
		console.log("停止自動答題！");
		answerQuestionsButton.innerText = "開答題";
		clearInterval(answerQuestionsInterval);
	}
}

function answerQuestions(){
	if($('span:contains(每日武林知識問答次數已經)').text().slice(-46) == "每日武林知識問答次數已經達到限額，請明天再來。每日武林知識問答次數已經達到限額，請明天再來。") {
		// 今天答題結束了
		console.log("完成自動答題！");
		answerQuestionsButton.innerText = "開答題";
		clearInterval(answerQuestionsInterval);
	}
	clickButton('question');
	setTimeout(getAndAnsQuestion, 300); // 300 ms之後提取問題，查詢答案，並回答
}

function getAndAnsQuestion(){
	// 提取問題
	var theQuestion = A = $(".out").text().split("題 ")[1].split("A")[0];
	// 左右去掉空格
	theQuestion = theQuestion.trim(" ","left").trim(" ","right");
	console.log("題目: " + theQuestion + "！");
	// 查找某個問題，如果問題有包含關系，則
	var theAnswer = getAnswer2Question(theQuestion);

	if (theAnswer !== "failed"){
		eval("clickButton('question " + theAnswer + "')");
	}else{
		alert("沒有找到答案，請手動完成該題目！");
		console.log("停止自動答題！");
		answerQuestionsButton.innerText = "開答題";
		clearInterval(answerQuestionsInterval);
		return;
	}
	setTimeout(printAnswerInfo, 800);

}
function printAnswerInfo(){
	console.log("完成一道武林知識問答：" );
	console.log($('span:contains(知識問答第)').text().split("繼續答題")[0]);
}
function getAnswer2Question(localQuestion){
	// 如果找到答案，返回響應答案，a,b,c或者d
	// 如果沒有找到答案，返回 "failed"

	var resultsFound = [];
	var countor = 0;
	for(var quest in QuestAnsLibs){
		if (isContains(quest, localQuestion) || isContains(quest, localQuestion.replace("npc","")) || isContains(quest, localQuestion.replace("NPC",""))){ //包含關系就可
			resultsFound[countor] = quest;
			countor = countor +1;
		}else if(isContains(quest, localQuestion.replace("npc","")) || isContains(quest, localQuestion.replace("NPC",""))){

		}

	}
	if(resultsFound.length ==1){
		return QuestAnsLibs[resultsFound[0]];
	}
	else {
		console.log("題目 " + localQuestion + " 找不到答案或存在多個答案，請手動作答！");
		return "failed";
	}
}

// 掃蕩 ------------------------------------------------------------------------------------------------------
var saoDangButton = document.createElement('button');
wantNum = '3500';
saoDangButton.innerText = '掃蕩';
saoDangButton.style.position = 'absolute';
saoDangButton.style.right = '11px';
saoDangButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
saoDangButton.style.width = buttonWidth;
saoDangButton.style.height = buttonHeight;
document.body.appendChild(saoDangButton);
saoDangButton.addEventListener('click', startSaodang);

function startSaodang() {
	if (saoDangButton.innerText == '掃蕩'){
		wantNum = parseInt(prompt("期望朱果數：",wantNum == -1 ? 3500 : wantNum));
		saoDangButton.innerText = '掃蕩中';
		saodang();
	}
	else {
		wantNum = -1;
		saoDangButton.innerText = '掃蕩';
	}
}

function saodang() {
	clickButton('luanshishan_saodang', 0); // 亂石山
	clickButton('taohuadu_saodang', 0); // 桃花渡
	clickButton('lvshuige_saodang', 0); // 綠水山莊
	clickButton('lvzhou_saodang', 0); // 戈壁綠洲
	clickButton('dilongling_saodang', 0); // 帝龍陵
	clickButton('fomenshiku_saodang', 0); // 佛門石窟
	clickButton('dafuchuan_saodang', 0); // 大福船
	clickButton('tianlongshan_saodang', 0); // 天龍山

	setTimeout(checkSaoDang, 150);
}

function checkSaoDang() {
	var num = $(".out4").text();
	var start = num.indexOf("朱果x");
	var end = num.indexOf("。");
	var actualNum = num.substring(start+3, end);

	if (wantNum == -1) {
		console.log('停止掃蕩');
	}
	else if (actualNum >= wantNum) {
		console.log("完成! 期待朱果數目:"+wantNum+", 得到朱果數目:"+actualNum);
		saoDangButton.innerText = '掃蕩';
	}
	else {
		saodang();
	}
}