// ==UserScript==
// @name         TEST
// @namespace    http://swordman-s1.yytou.com/?id=6054426&time=1504150426255&key=b398f2ac1871003e93a7d72ea2224ceb&s_line=1&arg=4278980
// @version      0.1
// @description  try to take over the world!
// @author       MARBO&jj
// @match        http://swordman-s1.yytou.com/?id=6054426&time=1504150426255&key=b398f2ac1871003e93a7d72ea2224ceb&s_line=1&arg=4278980
// @grant        http://swordman-s1.yytou.com/?id=6054426&time=1504150426255&key=b398f2ac1871003e93a7d72ea2224ceb&s_line=1&arg=4278980
// @downloadURL https://update.greasyfork.org/scripts/35633/TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/35633/TEST.meta.js
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
	"“白玉牌?”?景是在哪?地?上？":"c",
	"“百?山庄”?景是在哪?地?上？":"b",
	"“冰火?”?景是在哪?地?上？":"b",
	"“常春?渡口”?景是在哪?地?上？":"c",
	"“跪拜坪”?景是在哪?地?上？":"b",
	"“翰墨?屋”?景是在哪?地?上？":"c",
	"“花海”?景是在哪?地?上？":"a",
	"“留云?”?景是在哪?地?上？":"b",
	"“日月洞”?景是在哪?地?上？":"b",
	"“蓉香榭”?景是在哪?地?上？":"c",
	"“三清殿”?景是在哪?地?上？":"b",
	"“三清?”?景是在哪?地?上？":"c",
	"“???”?景是在哪?地?上？":"b",
	"“?名山?”?景是在哪?地?上？":"d",
	"“伊犁”?景是在哪?地?上？":"b",
	"“??商?”?景是在哪?地?上？":"d",
	"“迎梅客?”?景是在哪?地?上？":"d",
	"“子午?”?景是在哪?地?上？":"c",
	"8?的??摹刻需要几把刻刀":"a",
	"NPC公平子在哪一章地?":"a",
	"??在晚月庄的哪??景":"b",
	"安惜?是在那??景":"c",
	"黯然?魂掌有多少招式？":"c",
	"黯然?魂掌是哪??派的技能":"a",
	"八卦迷?是哪??派的?法？":"b",
	"八卦迷?是那??派的?法":"a",
	"白金戒指可以在哪位npc那里?得？":"b",
	"白金手?可以在哪位npc那里?得？":"a",
	"白金??可以在哪位npc那里?得？":"b",
	"白蟒鞭的?害是多少？":"a",
	"白?山第一位要拜的?傅是?":"a",
	"白??箱?包多少元?一?":"d",
	"白玉腰束是腰??的第几???？":"b",
	"拜??老前?需要正气多少":"b",
	"拜?老毒物需要蛤蟆功多少?":"a",
	"拜??翼需要多少?力":"b",
	"拜?小?女需要容貌多少":"c",
	"拜??三丰需要多少正气":"b",
	"包家?是哪??派的?傅":"a",
	"包拯在哪一章":"d",
	"?石合成一次需要消耗多少?低??石？":"c",
	"?玉帽可以在哪位那里?得？":"d",
	"?玉鞋??哪?npc可以?得":"a",
	"?玉鞋在哪?得":"a",
	"暴雨梨花?的?害是多少？":"c",
	"北斗七星?是第几?的??副本":"c",
	"北冥神功是哪??派的技能":"b",
	"北岳殿神像后面是哪位npc":"b",
	"匕首加什么?性":"c",
	"碧海潮生?在哪位?傅???":"a",
	"碧磷鞭的?害是多少？":"b",
	"?局保?是挂机里的第几?任?":"d",
	"冰魄??的?害是多少？":"b",
	"病?摩拳是哪??派的技能":"b",
	"不可保存??下?多久?消失":"c",
	"不?於白?山的技能是什么":"b",
	"不?于白?山的技能是什么":"b",
	"?海?腰可以?嵌几??石":"d",
	"?海?腰是腰??的第几???？":"a",
	"藏??在哪?NPC???":"a",
	"藏??在哪????":"b",
	"藏??在哪里那里?":"a",
	"草帽可以在哪位npc那里?得？":"b",
	"成功易容成异性几次可以?取易容成就?":"b",
	"成??划第七天可以?取多少元?？":"d",
	"成??划六天可以?取多少??？":"d",
	"成??划需要多少元?方可??？":"a",
	"城里打擂是挂机里的第几?任?":"d",
	"城里抓?是挂机里的第几?任?":"b",
	"充值?分不可以??下面什么物品":"d",
	"出生?武?世家增加什么":"a",
	"??第几?可以?得??“藏???法”":"b",
	"??第几?可以?得??“藏???主”":"d",
	"??第几?可以?得??“藏???老”":"c",
	"??每多少?有????":"a",
	"春?快意刀是哪??派的技能":"b",
	"春秋水色?需要多少?气才能?入":"d",
	"?哪???入跨服??":"a",
	"摧心掌是哪??派的技能":"a",
	"?摩在少林哪??景":"c",
	"?摩杖的?害是多少？":"d",
	"打?引路蜂?包可以得到多少引路蜂？":"b",
	"打排行榜每天可以完成多少次？":"a",
	"打土匪是挂机里的第几?任?":"c",
	"打造刻刀需要多少?玄?":"a",
	"打坐增?什么?性":"a",
	"大保?卡可以承受多少次死亡後不降技能等?？":"b",
	"大乘佛法有什么效果":"d",
	"大旗?的修??有哪?特殊效果":"a",
	"大旗?的云海心法可以提升哪??性":"c",
	"大招寺的金?不坏功有哪?特殊效果":"a",
	"大招寺的?布衫有哪?特殊效果":"c",
	"?日最低累?充值多少元即可?得返利？":"b",
	"刀法基?在哪掉落":"a",
	"倒?七星步法是哪??派的技能":"d",
	"等?多少才能在世界?道聊天？":"c",
	"第一?副本需要多少等?才能?入":"d",
	"貂皮斗篷是披??的第几???？":"b",
	"丁老怪是哪??派的?极?傅":"a",
	"丁老怪在星宿海的哪??景":"b",
	"?方教主在魔教的哪??景":"b",
	"斗?星移是哪??派的技能":"a",
	"斗?星移?是哪??派的?法":"a",
	"毒?鞭的?害是多少？":"a",
	"毒物?法是哪??派的?法":"b",
	"?孤求?有?几把?？":"d",
	"??寨是第几???副本":"a",
	"???字301-400?在哪里??":"c",
	"???字最高可以到多少?":"b",
	"端茶?水是挂机里的第几?任?":"b",
	"?云斧是哪??派的技能":"a",
	"?造一把刻刀需要多少玄?碎片?造？":"c",
	"?造一把刻刀需要多少??？":"a",
	"??易容面具需要多少玄?碎片":"c",
	"多少消??分?取?金?箱":"a",
	"多少消??分可以?取?金?匙":"b",
	"翻?梵文一次多少??":"d",
	"方媃是哪??派的?傅":"b",
	"?仙??是哪??派的?法":"b",
	"?老前?在?山哪??景":"b",
	"?泉之?加几?悟性":"c",
	"?泉之?可以在哪位那里?得？":"b",
	"?泉之?在哪里?得":"d",
	"?魔杖的?害是多少？":"b",
	"伏虎杖的?害是多少？":"c",
	"副本完成後不可?得下列什么物品":"b",
	"副本一次最多可以?几人":"a",
	"副本有什么??":"d",
	"富春茶社在哪一章":"c",
	"改名字在哪改？":"d",
	"丐?的??是什么":"a",
	"丐?的?功是哪?":"b",
	"干苦力是挂机里的第几?任?":"a",
	"??甲衣可以在哪位那里?得？":"d",
	"高?乾坤再造丹加什么":"b",
	"高?乾坤再造丹是增加什么的？":"b",
	"高?突破丹多少元?一?":"d",
	"割鹿刀可以在哪位npc那里?得？":"b",
	"葛?在大招寺的哪??景":"b",
	"根骨能提升哪??性":"c",
	"功德箱捐香火?有什么用":"a",
	"功德箱在雪亭?的哪??景？":"c",
	"??新手???包在挂机打坐??上可以享受多少倍收益？":"b",
	"孤?求???需要多少???分??":"b",
	"孤儿出身增加什么":"d",
	"古?大?是哪??派的?极?傅":"c",
	"古?大?在大理哪??景":"c",
	"古墓多少?以後才能?去？":"d",
	"寒玉床睡?修?需要多少??力值":"c",
	"寒玉床睡?一次多久":"c",
	"寒玉床需要切割多少次":"d",
	"寒玉床在哪里切割":"a",
	"寒玉床在那?地?可以找到？":"a",
	"黑狗血在哪?得":"b",
	"黑水伏蛟可以在哪位那里?得？":"c",
	"??石加什么?性":"b",
	"洪?主在洛?哪??景":"c",
	"虎皮腰?是腰??的第几???？":"a",
	"花不?在哪一章":"a",
	"花花公子在哪?地?":"a",
	"?山村王老二掉落的物品是什么":"a",
	"?山施戴子掉落的物品是什么":"b",
	"?山武器??哪?NPC?":"d",
	"??石加什么?性":"c",
	"??主在桃花?的哪??景":"d",
	"?袍老道是哪??派的?傅":"c",
	"?分商城在雪亭?的哪??景？":"c",
	"技能柳家拳?教的？":"a",
	"技能?量超?了什么消耗?能?增加":"b",
	"嫁衣神功是哪??派的技能":"b",
	"?冢在哪?地?":"a",
	"街???是挂机里的第几?任?":"a",
	"金?子的?害是多少？":"a",
	"金?不坏功有什么效果":"a",
	"金?杖的?害是多少？":"a",
	"金戒指可以在哪位npc那里?得？":"d",
	"金手?可以在哪位npc那里?得？":"b",
	"金?鞋可以在哪位npc那里?得？":"b",
	"金??可以在哪位npc那里?得？":"d",
	"金玉?云是哪??派的?法":"a",
	"??腰?是腰??的第几???？":"a",
	"精?棒可以在哪位那里?得？":"d",
	"九?服?器名?":"d",
	"九?神功是哪??派的技能":"c",
	"九?派梅?姐在星宿海哪??景":"a",
	"??是第几???副本":"b",
	"?通VIP月卡最低需要?天充值多少元方有???格？":"a",
	"可以召?金甲伏兵助?是哪??派？":"a",
	"客商在哪一章":"b",
	"孔雀氅可以?嵌几??石":"b",
	"孔雀氅是披??的第几???？":"c",
	"枯??功是哪??派的技能":"a",
	"跨服是星期几?行的":"b",
	"跨服天?谷每周六几???":"a",
	"跨服需要多少?才能?入":"c",
	"跨服在哪??景?入":"c",
	"?花拂穴手是哪??派的技能":"a",
	"??石加什么?性":"a",
	"?止萍在哪一章":"c",
	"?止萍在晚月庄哪?小地?":"b",
	"老毒物在白?山的哪??景":"b",
	"老?童在全真教哪??景":"b",
	"?花掌是哪??派的技能":"a",
	"烈火旗大?是那?地?的?景":"c",
	"烈日??可以?嵌几??石":"c",
	"林祖?是哪??派的?傅":"a",
	"?蛇杖法是哪??派的技能":"c",
	"凌波微步是哪??派的技能":"b",
	"凌??云步是哪??派的技能":"b",
	"?取消??分需要?找哪?NPC？":"c",
	"鎏金??是披??的第几???？":"d",
	"柳淳?在哪一章":"c",
	"柳淳?在雪亭?哪??景":"b",
	"柳文君所在的位置":"a",
	"六?神?是哪??派的??":"a",
	"?得?是哪??派的?傅":"c",
	"?得?在???的哪??景":"a",
	"??每天能打几次":"a",
	"??是每周星期几":"c",
	"??是什么???正式?始":"a",
	"??是星期几?行的":"c",
	"??是星期几?行的":"c",
	"???一??得多少???分":"a",
	"??要在晚上几?前?名":"b",
	"??在周几?行？":"b",
	"??中步玄派的?傅是哪?":"a",
	"??中大招寺第一?要拜的?傅是?":"c",
	"??中古墓派的?极?傅是?":"d",
	"??中花紫?的?傅是?":"c",
	"??中青城派的第一??傅是?":"a",
	"??中青城派的?极?傅是?":"d",
	"??中逍?派的?极?傅是?":"c",
	"??中以下不是峨嵋派技能的是哪?":"b",
	"??中以下不是?山派的人物的是哪?":"d",
	"??中以下哪?不是大理段家的技能":"c",
	"??中以下哪?不是大招寺的技能":"b",
	"??中以下哪?不是峨嵋派可以拜?的?傅":"d",
	"??中以下哪?不是丐?的技能":"d",
	"??中以下哪?不是丐?的人物":"a",
	"??中以下哪?不是古墓派的的技能":"b",
	"??中以下哪?不是?山派的技能的":"d",
	"??中以下哪?不是明教的技能":"d",
	"??中以下哪?不是魔教的技能":"a",
	"??中以下哪?不是魔教的人物":"d",
	"??中以下哪?不是全真教的技能":"d",
	"??中以下哪?不是是晚月庄的技能":"d",
	"??中以下哪?不是唐?的技能":"c",
	"??中以下哪?不是唐?的人物":"c",
	"??中以下哪?不是?雪山庄的技能":"d",
	"??中以下哪?不是?血大旗?的技能":"c",
	"??中以下哪?是大理段家的技能":"a",
	"??中以下哪?是大招寺的技能":"b",
	"??中以下哪?是丐?的技能":"b",
	"??中以下哪?是花紫?的技能":"a",
	"??中以下哪?是?山派的技能的":"a",
	"??中以下哪?是明教的技能":"b",
	"??中以下哪?是青城派的技能":"b",
	"??中以下哪?是唐?的技能":"b",
	"??中以下哪?是天邪派的技能":"b",
	"??中以下哪?是天邪派的人物":"a",
	"??中以下哪?是?雪山庄的技能":"c",
	"??中以下哪?是?血大旗?的技能":"b",
	"??中以下哪?是?血大旗?的?傅":"a",
	"??中以下哪?是晚月庄的技能":"a",
	"??中以下哪?是晚月庄的人物":"a",
	"??中以下是峨嵋派技能的是哪?":"a",
	"??在哪??":"a",
	"?云舟在哪一章":"c",
	"?云舟在???的哪??景":"b",
	"落英神?掌是哪??派的技能":"b",
	"??在哪?地?":"a",
	"??石加什么?性":"c",
	"漫天花雨匕在哪?得":"a",
	"茅山的??是什么":"b",
	"茅山的天?正道可以提升哪??性":"d",
	"茅山可以招几???":"c",
	"茅山派的?功是什么":"b",
	"茅山天?正道可以提升什么":"c",
	"茅山??什么技能招??":"a",
	"茅山在哪里拜?":"c",
	"每次合成?石需要多少??？":"a",
	"每?玩家最多能有多少?好友":"b",
	"vip每天不可以?取什么":"b",
	"每天的任?次?几?重置":"d",
	"每天分享游?到哪里可以?得20元?":"a",
	"每天能挖几次?":"d",
	"每天能做多少???任?":"a",
	"每天能做多少???任?":"c",
	"每天微信分享能?得多少元?":"d",
	"每天有几次??":"b",
	"每天在?多少?小?即可?取消??分？":"b",
	"每突破一次技能有效系?加多少":"a",
	"密宗伏魔是哪??派的?法":"c",
	"???太在第几章":"c",
	"???太在峨眉山哪??景":"a",
	"明教的九?神功有哪?特殊效果":"a",
	"明月帽要多少刻刀摩刻？":"a",
	"摹刻10?的??需要摩刻技巧多少?":"b",
	"摹刻烈日??需要多少?摩刻技巧？":"c",
	"摹刻?文需要多少把刻刀？":"a",
	"魔鞭?在哪里??":"d",
	"魔教的大光明心法可以提升哪??性":"d",
	"莫不收在哪一章":"a",
	"墨磷腰?是腰??的第几???？":"d",
	"木道人在青城山的哪??景":"b",
	"慕容家主在慕容山庄的哪??景":"a",
	"慕容山庄的斗?星移可以提升哪??性":"d",
	"哪?NPC掉落拆招基?":"a",
	"哪??可以捏?":"a",
	"哪?分享可以?得20元?":"b",
	"哪?技能不是魔教的":"d",
	"哪??派拜??有性?要求":"d",
	"哪?npc?於全真七子":"b",
	"哪?不能?得玄?碎片":"c",
	"能增容貌的是下面哪?技能":"a",
	"捏?需要花?多少??？":"c",
	"捏?需要?找哪?NPC？":"a",
	"??敏是哪??派的？":"b",
	"??敏是哪??派的?傅":"b",
	"??敏在哪一章":"a",
	"??敏在唐?的哪??景":"c",
	"排行榜最多可以?示多少名玩家？":"a",
	"逄?是在那??景":"a",
	"披星戴月是披??的第几???？":"d",
	"劈?拳套有几??孔":"a",
	"霹?掌套的?害是多少":"b",
	"辟邪?法是哪??派的??技能":"a",
	"辟邪?法在哪??":"b",
	"婆?蜜多心?是哪??派的技能":"b",
	"七?天?舞是哪??派的技能":"d",
	"七星鞭的?害是多少？":"c",
	"七星?法是哪??派的??":"a",
	"棋道是哪??派的技能":"c",
	"千古奇???需要多少???分??":"d",
	"乾坤大挪移?於什么?型的武功":"a",
	"乾坤大挪移?于什么?型的武功":"a",
	"乾坤一?指是哪??傅教的":"a",
	"青城派的道德?可以提升哪??性":"c",
	"青城派的道家心法有哪?特殊效果":"a",
	"清?寨在哪":"b",
	"清?寨在哪?地?":"d",
	"清?道?在哪一章":"d",
	"去唐?地下通道要找?拿?匙":"a",
	"全真的道家心法有哪?特殊效果":"a",
	"全真的基本?法有哪?特殊效果":"b",
	"全真的?手互搏有哪?特殊效果":"c",
	"日月神教大光明心法可以提升什么":"d",
	"如何??山?法?400?提升到440?？":"d",
	"如意刀是哪??派的技能":"c",
	"山河藏??需要在哪?NPC手里??？":"d",
	"上山打?是挂机里的第几?任?":"c",
	"少林的混元一气功有哪?特殊效果":"d",
	"少林的易筋?神功有哪?特殊效果":"a",
	"蛇形刁手是哪??派的技能":"b",
	"什么影?打坐的速度":"c",
	"什么影?攻?力":"d",
	"什么??不能?嵌?水晶":"d",
	"什么??都能?嵌的是什么?石？":"c",
	"什么??可以?嵌紫水晶":"c",
	"神雕大?所在的地?":"b",
	"神雕大?在哪一章":"a",
	"神雕??的?代背景是哪?朝代？":"d",
	"神雕??的作者是?":"b",
	"升?什么技能可以提升根骨":"a",
	"生死符的?害是多少？":"a",
	"??磕?增加什么":"a",
	"??任?每天可以完成多少次？":"a",
	"??任?每天可以做多少?？":"c",
	"??任?什么?候更新？":"b",
	"??任?一天能完成几次":"d",
	"??任?最多可以完成多少?？":"d",
	"施令威在哪?地?":"b",
	"石?妹哪??派的?傅":"c",
	"使用朱果???能?分?增加多少？":"a",
	"首次通????不可以?得那种??？":"a",
	"受?的消??分在哪里?取":"d",
	"?皮鞋可以在哪位那里?得？":"b",
	"?王?在第几章?":"c",
	"?儿在?州的哪?小地?":"a",
	"?天?是哪??派的?傅":"c",
	"踏雪?痕是哪??派的技能":"b",
	"踏云棍可以在哪位那里?得？":"a",
	"唐?的唐?毒?有哪?特殊效果":"a",
	"唐?密道怎么走":"c",
	"天蚕?腰可以?嵌几??石":"d",
	"天蚕?腰是腰??的第几???？":"d",
	"天山姥姥在逍?林的哪??景":"d",
	"天山折梅手是哪??派的技能":"c",
	"天??法是哪??派的?法":"b",
	"天邪派在哪里拜?":"b",
	"天羽奇?是哪??派的技能":"a",
	"?戒指可以在哪位npc那里?得？":"a",
	"?手? 可以在哪位npc那里?得？":"a",
	"?血大旗?云海心法可以提升什么":"a",
	"通?需要花?多少??？":"d",
	"通?需要?找哪?NPC？":"c",
	"突破丹在哪里??":"b",
	"屠?刀法是哪??派的??技能":"b",
	"屠?刀是什么??的武器":"a",
	"挖?冢可得什么":"a",
	"?月刀可以在哪位那里?得？":"b",
	"玩家每天能?做几次正邪任?":"c",
	"玩家想修改名字可以?找哪?NPC？":"a",
	"晚月庄的?功是什么":"b",
	"晚月庄的七?天?舞可以提升哪??性":"b",
	"晚月庄的小?在下面哪?地?":"a",
	"晚月庄七?天?舞可以提升什么":"b",
	"晚月庄主???要求":"a",
	"王?匠是在那??景":"b",
	"王重?是哪??派的?傅":"b",
	"魏?极???可以?到多少?？":"a",
	"魏?极身上掉落什么??":"c",
	"魏?极在第几章":"a",
	"?旗使在哪?地?":"a",
	"?金玄火鞭的?害是多少？":"d",
	"?檀木刀可以在哪位那里?得？":"d",
	"?金腰?是腰??的第几???？":"d",
	"武?派的??技能是以下哪?":"d",
	"武穆兵法提升到多少?才能出??斗必刷？":"d",
	"武穆兵法通?什么??":"a",
	"武?世家加的什么初始?性":"a",
	"舞中之武是哪??派的?法":"b",
	"西毒蛇杖的?害是多少？":"c",
	"吸血蝙蝠在下面哪?地?":"a",
	"下列哪??斗不能多?玩家一起?斗？":"a",
	"下列??中不可摹刻的是":"c",
	"下面哪?不是古墓的?傅":"d",
	"下面哪?不是?派??":"d",
	"下面哪?npc不是魔教的":"d",
	"下面哪?地?不是???的":"d",
	"下面哪??派是正派":"a",
	"下面哪?是天邪派的?傅":"a",
	"下面有什么是??不能?得的":"c",
	"向?傅磕?可以?得什么？":"b",
	"逍?步是哪??派的技能":"a",
	"逍?林是第几章的地?":"c",
	"逍?林怎么?琴可以?到天山姥姥":"b",
	"逍?派的??技能是以下哪?":"a",
	"?辟?在哪一章":"d",
	"小李?刀的?害是多少？":"d",
	"小?女住的古墓是?建造的？":"b",
	"小男孩在?山村哪里":"a",
	"新人?包在哪?npc???":"a",
	"新手?包在哪里?取":"a",
	"新手?包在哪?取？":"c",
	"需要使用什么衣服才能睡寒玉床":"a",
	"??孤儿?影?哪??性":"c",
	"??商??影?哪??性":"b",
	"???香?第?影?哪??性":"b",
	"??武?世家?影?哪??性":"a",
	"??屠?刀法需要多少?力":"b",
	"雪?有什么作用":"a",
	"雪蕊儿是哪??派的?傅":"a",
	"雪蕊儿在?雪山庄的哪??景":"d",
	"?文的?性":"a",
	"?州??黑狗能到下面哪?地?":"a",
	"?州在下面哪?地?的?可以?得玉佩":"c",
	"羊毛斗篷是披??的第几???？":"a",
	"??之?是哪??派的?法":"c",
	"??小?女分?多少年後重逢?":"c",
	"??在哪?地?":"a",
	"夜行披?是披??的第几???？":"a",
	"夜皇在大旗?哪??景":"c",
	"一??伍最多有几???":"c",
	"一天能完成??任?多少?":"b",
	"一天能完成??任?有多少?":"c",
	"一天能完成挑?排行榜任?多少次":"a",
	"一?分身卡的有效??是多久":"c",
	"一指?在哪里?悟":"b",
	"移?明教石板需要哪?技能到一定??":"a",
	"以下不是步玄派的技能的哪?":"c",
	"以下不是天宿派?傅的是哪?":"c",
	"以下不是?藏?派的是哪?":"d",
	"以下哪??石不能?嵌到戒指":"c",
	"以下哪??石不能?嵌到?甲":"a",
	"以下哪??石不能?嵌到披?":"c",
	"以下哪??石不能?嵌到腰?":"c",
	"以下哪??石不能?嵌到衣服":"a",
	"以下哪?不是道???教?的武?？":"d",
	"以下哪?不是何不?教?的武?？":"c",
	"以下哪?不是慧名尊者教?的技能？":"d",
	"以下哪?不是空空儿教?的武?？":"b",
	"以下哪?不是梁?兄教?的武?？":"b",
	"以下哪?不是??的皮?？":"d",
	"以下哪?不是全真七子？":"c",
	"以下哪?不是宋首?教?的武?？":"d",
	"以下哪?不是微信分享好友、朋友圈、QQ空?的??？":"a",
	"以下哪?不是岳掌?教?的武?？":"a",
	"以下哪?不是在洛??景":"d",
	"以下哪?不是在雪亭??景":"d",
	"以下哪?不是在?州?景":"d",
	"以下哪?不是知客道?教?的武?？":"b",
	"以下哪??派不是?藏?派？":"c",
	"以下哪??派是正派？":"d",
	"以下哪??派是中立?派？":"a",
	"以下哪?是步玄派的祖?":"b",
	"以下哪?是封山派的祖?":"c",
	"以下哪?是花紫?的祖?":"a",
	"以下哪?是晚月庄的祖?":"d",
	"以下哪些物品不是成??划第二天可以?取的？":"c",
	"以下哪些物品不是成??划第三天可以?取的？":"d",
	"以下哪些物品不是成??划第一天可以?取的？":"d",
	"以下哪些物品是成??划第四天可以?取的？":"a",
	"以下哪些物品是成??划第五天可以?取的？":"b",
	"以下?于邪派的?派是哪?":"b",
	"以下?于正派的?派是哪?":"a",
	"以下?不精通降?十八掌？":"d",
	"以下有哪些物品不是每日充值的??？":"d",
	"倚天?加多少?害":"d",
	"倚天屠??的?代背景哪?朝代？":"a",
	"易容後保持??是多久":"a",
	"易容面具需要多少玄???":"c",
	"易容?多少?才可以易容成异性NPC":"a",
	"易容?可以找哪位NPC??？":"b",
	"易容?向???":"a",
	"易容?在哪里??":"a",
	"易容?在哪??？":"b",
	"?手?可以在哪位npc那里?得？":"b",
	"???甲衣可以在哪位npc那里?得？":"a",
	"???可以在哪位npc那里?得？":"b",
	"尹志平是哪??派的?傅":"b",
	"?者之?是那??派的?法":"a",
	"?爪擒拿手是哪??派的技能":"a",
	"影?你出生的福?的出生是？":"d",
	"油流麻香手是哪??派的技能":"a",
	"游?散花是哪??派的?法":"d",
	"玉蜂?在哪?地??得":"a",
	"玉女?法是哪??派的技能":"b",
	"岳掌?在哪一章":"a",
	"云九天是哪??派的?傅":"c",
	"云?天在哪一章":"a",
	"在洛???天那可以??什么心法":"b",
	"在?祝?洗?气每次可以消除多少?":"a",
	"在哪?NPC可以??恢复?力的?品？":"c",
	"在哪??可以更改名字":"a",
	"在哪???取免?消??分":"d",
	"在哪??能?升?易容?":"b",
	"在哪里可以找到“香茶”？":"a",
	"在哪里捏?提升容貌":"d",
	"在哪里消?气":"a",
	"在逍?派能?到的技能是哪?":"a",
	"在雪亭?李火?可以??多少?柳家拳":"b",
	"在?斗界面??哪?按?可以?入聊天界面":"d",
	"在正邪任?中不能?得下面什么??？":"d",
	"怎么??得免?元?":"a",
	"?送李?嘴??能?增加什么":"a",
	"?教主在明教哪??景":"d",
	"?三丰在哪一章":"d",
	"?三丰在武?山哪??景":"d",
	"?松溪在哪?地?":"c",
	"?天?是哪??派的?傅":"a",
	"?天?在茅山哪??景":"d",
	"?虹?在哪位npc那里?得？":"a",
	"??在哪里可以??？":"a",
	"正邪任??死好人增?什么":"b",
	"正邪任?一天能做几次":"a",
	"正邪任?中客商的在哪?地?":"a",
	"正邪任?中?花姑娘在哪?地?":"b",
	"正邪任?最多可以完成多少?？":"d",
	"支????生上魁星?二??死哪?NPC?10元?":"a",
	"朱姑娘是哪??派的?傅":"a",
	"朱老伯在?山村哪?小地?":"b",
	"追?棍可以在哪位npc那里?得？":"a",
	"追?棍在哪里?得":"b",
	"紫?石加什么?性":"d",
	"?石??在哪?得":"a",
	"?哪?npc??入跨服??":"a",
	"跨服副本周六几???":"a",
	"黑水伏蛟可以在哪位npc那里?得？":"c"
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
	var theQuestion = A = $(".out").text().split("題?")[1].split("A")[0];
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