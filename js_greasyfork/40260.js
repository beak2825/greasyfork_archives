// ==UserScript==
// @name         飛踢hank10
// @namespace    http://swordman-s1.yytou.com/?id=6734764&time=1516109958785&key=20582df919c7a45be5ce9f46da73dc4f&s_line=1
// @version      1.3
// @description  try to take over the world!
// @author       MARBO&jj
// @match        http://swordman-s1.yytou.com/?id=6734764&time=1516109958785&key=20582df919c7a45be5ce9f46da73dc4f&s_line=1
// @grant        note
// @downloadURL https://update.greasyfork.org/scripts/40260/%E9%A3%9B%E8%B8%A2hank10.user.js
// @updateURL https://update.greasyfork.org/scripts/40260/%E9%A3%9B%E8%B8%A2hank10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
var enforcePoints = '1160';
var mySkillLists = '如來神掌';
skillLists = '';
buttonWidth = '80px';
buttonHeight = '15px';
currentPos = 50;
delta = 20;
//--隱藏按鈕
var buttonhiden=0;
var buttonhideButton = document.createElement('button');
buttonhideButton.innerText = '隱藏按鈕';
buttonhideButton.style.position = 'absolute';
buttonhideButton.style.right = '0px';
buttonhideButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
buttonhideButton.style.width = buttonWidth;
buttonhideButton.style.height = buttonHeight;
document.body.appendChild(buttonhideButton);
buttonhideButton.addEventListener('click', buttonhideFunc)

function buttonhideFunc(){

	if (buttonhiden==0){
		buttonhiden=1;
		buttonhideButton.innerText = '顯示按鈕';
		hideButton();
	}
	else {
		buttonhiden=0;
		buttonhideButton.innerText = '隱藏按鈕';
		showButton();
	}
}

function hideButton(){
       SetSkillButton.style.visibility="hidden";
       CheckInButton.style.visibility="hidden";
	   getRewardsButton.style.visibility="hidden";
	   killDrunkManButton.style.visibility="hidden";
	   fishingButton.style.visibility="hidden";
	   clearPuzzlesButton.style.visibility="hidden";
	   QiXiaTalkButton.style.visibility="hidden";
	   enforceButton.style.visibility="hidden";
	   killTianJianTargetButton.style.visibility="hidden";
	   userhp20Button.style.visibility="hidden";
	   userMedecineButton.style.visibility="hidden";
	   userMedButton.style.visibility="hidden";
	   listenQLButton.style.visibility="hidden";
       saoDangButton.style.visibility="hidden"
	   daButton.style.visibility="hidden";
       bookButton.style.visibility="hidden";
       llolButton.style.visibility="hidden";
	   lollButton.style.visibility="hidden";
       knifeButton.style.visibility="hidden";
       clothesButton.style.visibility="hidden";
	   answerQuestions2Button.style.visibility="hidden";
	   qiangButton.style.visibility="hidden";
	   BiShi2Button.style.visibility="hidden";
	   killManButton.style.visibility="hidden";
	   killManButton2.style.visibility="hidden";
	   ShiJianButton.style.visibility="hidden";
	   soButton.style.visibility="hidden";
	   bijingButton.style.visibility="hidden";
	   ssssButton.style.visibility="hidden";
	   zuButton.style.visibility="hidden";

}

function showButton(){
		SetSkillButton.style.visibility="visible";
        CheckInButton.style.visibility="visible";
		getRewardsButton.style.visibility="visible";
		killDrunkManButton.style.visibility="visible";
		fishingButton.style.visibility="visible";
		clearPuzzlesButton.style.visibility="visible";
		QiXiaTalkButton.style.visibility="visible";
		enforceButton.style.visibility="visible";
		killTianJianTargetButton.style.visibility="visible";
		userhp20Button.style.visibility="visible";
		userMedecineButton.style.visibility="visible";
		userMedButton.style.visibility="visible";
        listenQLButton.style.visibility="visible";
        saoDangButton.style.visibility="visible"
		daButton.style.visibility="visible";
        bookButton.style.visibility="visible";
        llolButton.style.visibility="visible";
		lollButton.style.visibility="visible";
        knifeButton.style.visibility="visible";
       clothesButton.style.visibility="visible";
	   answerQuestions2Button.style.visibility="visible";
	   qiangButton.style.visibility="visible";
	   BiShi2Button.style.visibility="visible";
	   killManButton.style.visibility="visible";
	   killManButton2.style.visibility="visible";
	   ShiJianButton.style.visibility="visible";
	   soButton.style.visibility="visible";
	   bijingButton.style.visibility="visible";
	   ssssButton.style.visibility="visible";
	   zuButton.style.visibility="visible";
}
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
	clickButton('jh 1');  	// 進入章節
    clickButton('event_1_48257256', 1);  //領每周禮包;  //領每周禮包
	clickButton('go east') ;     // 廣場
	clickButton('go north');     // 雪亭鎮街道
	clickButton('go east');     // 淳風武館大門
	clickButton('go east') ;    // 淳風武館教練場
	clickButton('event_1_16891630', 1); //狗年
	clickButton('event_1_44731074');
	clickButton('event_1_8041045');
	clickButton('event_1_8041045');
	clickButton('home');     //覆蓋到這
	clickButton('vip drops', 0);  //vip
    for (var i=0; i<25; i++)
	{
	clickButton('vip finish_family', 0); //師門25次
	}
	for (var i=0; i<20; i++)
	{
	clickButton('vip finish_clan', 0);  //幫派20次
	}
	for (var i=0; i<10; i++)
	{
	clickButton('vip finish_diaoyu', 0); //釣魚10次
	}
	for (var i=0; i<9; i++)
	{
	clickButton('vip finish_big_task', 0); //爆擊9次
	}
	for (var i=0; i<10; i++)
	{
	clickButton('vip finish_dig', 0); // 挖寶10次
	}
	for (var i=0; i<2; i++)
	{
	clickButton('vip finish_fb dulongzhai', 0);  //本1
	}
	for (var i=0; i<2; i++)
	{
	clickButton('vip finish_fb junying', 0);  //本2
	}
	for (var i=0; i<2; i++)
	{
	clickButton('vip finish_fb beidou', 0);  //本3
    }
	for (var i=0; i<2; i++)
	{
	clickButton('vip finish_fb youling', 0); //本4
	}
    clickButton('xueyin_shenbinggu unarmed get_all', 0);//拳獎勵
	clickButton('xueyin_shenbinggu throwing get_all', 0);//暗器獎勵
	clickButton('jh 5');
	clickButton('go north');
	clickButton('go north');
    clickButton('go east');
	clickButton('event_1_1278209', 1);
}
// 領取獎勵 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(getRewardsButton);
var getRewardsButton = document.createElement('button');
getRewardsButton.innerText = '開領獎';
getRewardsButton.style.position = 'absolute';
getRewardsButton.style.right = '0px';
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

	gos = function(dir) {
        go_st=0;
        od =dir.split(";");
        setTimeout(go_step,go_delay);
    };

   var bm = 0,
        kqx_time, qixiaCode = ["玄月研", "王蓉", "狼居胥", "龐統", "烈九州", "步驚鴻", "穆妙羽", "宇文無敵", "李玄霸", "護竺", "八部龍將", "風無痕", "浪喚雨", "李宇飛", "風行騅", "郭濟", "吳縝", "風南", "火雲邪神", "逆風舞", "狐蒼雁", "厲滄若", "夏岳卿", "妙無心", "巫夜姬"];

    function getqixiacode() {
        clickButton('open jhqx');
        setTimeout(function() {
            var t = $("#out td a");
            if (t.text().indexOf('步驚鴻') > -1) {
                for (var i = 0; i < t.length; i++) {
                    qixiaCode[t[i].innerText] = i
                }
            }
        }, 100)
    }
    function QiXiaTalkFunc() {
        // if (userqu == 15 || userqu == 47 || userqu == 51 || userqu == 56 || userqu == 57 || userqu == 64 || userqu == 66 || userqu == 68) {
            var a = prompt("請輸入撩奇俠順序（中文分號隔開）", "步驚鴻；浪喚雨；郭濟；火雲邪神；逆風舞；吳縝；王蓉；風南；狐蒼雁；李宇飛；龐統；風行騅；護竺；玄月研；狼居胥；烈九州；穆妙羽；宇文無敵；李玄霸；八部龍將；風無痕；厲滄若；夏岳卿；妙無心；巫夜姬");
            qxList = a.split("；");
            qxOrder = 0;
            clickButton('open jhqx', 0);
            clearInterval(kqx_time);
            kqx_time = setInterval(kqx, 200)
        // } else {
        //  alert("抱歉，你所在的區暫不開放撩奇俠功能")
        // }
    }
    function kqx(){
        var t = $("#out td a");
        if (t.text().indexOf('步驚鴻') > -1) {
            clearInterval(kqx_time);
            for (var i = 0; i < t.length; i++) {
                qixiaCode[t[i].innerText] = i
            }
        }
        goSwordsman()
    }



    function goSwordsman() {
        clickButton('find_task_road qixia ' + qixiaCode[qxList[qxOrder]]);
        setTimeout(askSwordsman, 150)
    }
    function askSwordsman() {
        if (qxOrder < qxList.length) {
            var a = 0;
            bm = bm + 1;
            if (bm > 5) {
                console.log(qxList[qxOrder] + "沒找到");
                bm = 0;
                qxOrder++;
                goSwordsman();
                return
            }
            var b = $("#out .cmd_click3");
            for (var i = 0; i < b.length; i++) {
                var c = b[i].innerText;
                if (qxList[qxOrder] == c) {
                    a = 1;
                    bm = 0;
                    console.log("對話 " + qxList[qxOrder]);
                    var d = b[i].getAttribute('onclick').split("'")[1].split(" ")[1];
                    var e = 'ask ' + d;
                    gos(e + ';' + e + ';' + e + ';' + e + ';' + e);
                    nextgo = function() {
                        qxOrder++;
                        goSwordsman();
                        nextgo = null
                    };
                    return
                }
            }
            if (a === 0) setTimeout(function() {
                askSwordsman()
            }, 100)
        } else {
            bm = 0;
            console.log("撩奇俠結束");
            clickButton('home')
        }
    }
	var C, nextgo = null,
		go_st, go_delay = 50,
		gos = function(a) {
			go_st = 0;
			C = a.split(";");
			setTimeout(go_step, go_delay)
		};

	function go_rp(a, n) {
		go_st = 0;
		C = [];
		for (var i = 0; i < n; i++) {
			C[i] = a
		}
		setTimeout(go_step, go_delay)
	}
	function go_rt() {
		setTimeout(go_step, go_delay)
	}
	function clear() {
		go_st = 0;
		C = []
	}
	function go_step() {
		if (go_st < C.length) {
			console.debug("開始執行：", C[go_st]);
			clickButton(C[go_st], 0);
			go_st++;
			if (go_st % 3 == 0) {
				setTimeout(go_step, 300)
			} else {
				setTimeout(go_step, go_delay)
			}
		} else if (nextgo != null) {
			nextgo();
			nextgo = null
		}
	}

	function nextgo_do() {
		console.log(nextgo);
		nextgo();
		nextgo = function() {}
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
 var TianJianNPCList = ["天劍谷衛士", "天劍", "天劍真身", "虹風", "虹雨","虹雷", "虹電","鎮谷神獸", "鎮山神獸", "鎮殿神獸", "鎮潭神獸","守谷神獸",
                       "守山神獸", "守殿神獸", "守潭神獸","饕餮幼崽", "螣蛇幼崽",
                       "應龍幼崽","幽熒幼崽", "饕餮獸魂", "螣蛇獸魂", "應龍獸魂",
                       "幽熒獸魂", "幽熒王","饕餮王", "螣蛇王", "應龍王","幽熒戰神","饕餮戰神", "螣蛇戰神", "應龍戰神"];
//var TianJianNPCList = ["王鐵匠", "楊掌櫃", "柳繪心", "柳小花", "朱老伯","方老板", "醉漢"];
var killTianJianIntervalFunc =  null;
var currentNPCIndex = 0;
var setMp = 10000;

function killTianJianTargetFunc(){
	zdskill =  mySkillLists;
	if (killTianJianTargetButton.innerText == '殺天劍'){
	    mySkillLists=prompt("請輸入連續單放出招技能:","如來神掌");
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
	  //clickButton('go east');
	  //clickButton('go southeast');
      //clickButton('go southeast');
      //clickButton('go southeast');
      //clickButton('go southeast');
	  //clickButton('go northeast');
	  //clickButton('go north');
	if ($('span').text().slice(-7) == "不能殺這個人。"){
		currentNPCIndex = currentNPCIndex + 1;
		console.log("不能殺這個人！");
        //return;
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
// 療傷 ------------------------------------------------------------------------------------------------------
var userhp20Button = document.createElement('button');
userhp20Button.innerText = '療傷20次';
userhp20Button.style.position = 'absolute';
userhp20Button.style.right = '0px';
userhp20Button.style.top =currentPos +  'px';
currentPos = currentPos + delta;
userhp20Button.style.width = buttonWidth;
userhp20Button.style.height = buttonHeight;
document.body.appendChild(userhp20Button);
userhp20Button.addEventListener('click', userhp20Func);
function userhp20Func(){
   for (var i=0; i<20; i++)
  {
   clickButton('recovery', 0);
  }
}
// 吃藥 ------------------------------------------------------------------------------------------------------
var userMedecineButton = document.createElement('button');
userMedecineButton.innerText = '吃藥5次';
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
   clickButton('items use snow_qiannianlingzhi');
   clickButton('items use snow_qiannianlingzhi');
   clickButton('items use snow_qiannianlingzhi');
   clickButton('items use snow_qiannianlingzhi');
}
// 吃藥 ------------------------------------------------------------------------------------------------------
var userMedButton = document.createElement('button');
userMedButton.innerText = '吃藥1次';
userMedButton.style.position = 'absolute';
userMedButton.style.right = '0px';
userMedButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
userMedButton.style.width = buttonWidth;
userMedButton.style.height = buttonHeight;
document.body.appendChild(userMedButton);
userMedButton.addEventListener('click', userMedFunc);
function userMedFunc(){
   clickButton('items use snow_qiannianlingzhi');
}

// 自動答題
//var answerQuestionButton = document.createElement('button');
//answerQuestionButton.innerText = '禁用';
//answerQuestionButton.style.position = 'absolute';
//answerQuestionButton.style.right = '0px';
//answerQuestionButton.style.top =currentPos +  'px';
//currentPos = currentPos + delta;
//answerQuestionButton.style.width = buttonWidth+12;
//answerQuestionButton.style.height = buttonHeight;
//document.body.appendChild(answerQuestionButton);
//answerQuestionButton.addEventListener('click', answerQuestionFunc);
function answerQuestionFunc(){
   clickButton('look_room');
   clickButton('question', 0)
}
var listenQLButton = document.createElement('button');
listenQLButton.innerText = '青龍監聽';
listenQLButton.style.position = 'absolute';
listenQLButton.style.right = '0px';
listenQLButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
listenQLButton.style.width = buttonWidth;
listenQLButton.style.height = buttonHeight;
document.body.appendChild(listenQLButton);
listenQLButton.addEventListener('click', listenQLFunc);
var QLtrigger=0;
function listenQLFunc(){
   if (QLtrigger==0){
	   QLtrigger=1;
	   listenQLButton.innerText = '停止監聽';
   }else if (QLtrigger==1){
	   QLtrigger=0;
	   listenQLButton.innerText = '青龍監聽';
   }
}
//var listenYXButton = document.createElement('button');
//listenYXButton.innerText = '遊俠監聽';
//listenYXButton.style.position = 'absolute';
//listenYXButton.style.right = '0px';
//listenYXButton.style.top =currentPos +  'px';
//currentPos = currentPos + delta;
//listenYXButton.style.width = buttonWidth+12;
//listenYXButton.style.height = buttonHeight;
//document.body.appendChild(listenYXButton);
//listenYXButton.addEventListener('click', listenYXFunc);
var YXtrigger=0;
function listenYXFunc(){
   if (YXtrigger==0){
	   YXtrigger=1;
	   listenYXButton.innerText = '停止監聽';
   }else if (YXtrigger==1){
	   YXtrigger=0;
	   listenYXButton.innerText = '遊俠監聽';
   }
}
//var WabaoButton = document.createElement('button');
//WabaoButton.innerText = '自動挖寶';
//WabaoButton.style.position = 'absolute';
//WabaoButton.style.right = '0px';
//WabaoButton.style.top =currentPos +  'px';
//currentPos = currentPos + delta;
//WabaoButton.style.width = buttonWidth+12;
//WabaoButton.style.height = buttonHeight;
//document.body.appendChild(WabaoButton);
//WabaoButton.addEventListener('click', WabaoFunc);
function WabaoFunc(){
   clickButton('cangbaotu_op1', 1)
}
//var MonitorButton = document.createElement('button');
//MonitorButton.innerText = '查看玩家數據';
//MonitorButton.style.position = 'absolute';
//MonitorButton.style.right = '0px';
//MonitorButton.style.top =currentPos +  'px';
//currentPos = currentPos + delta;
//MonitorButton.style.width = buttonWidth;
//MonitorButton.style.height = buttonHeight;
//document.body.appendChild(MonitorButton);
//MonitorButton.addEventListener('click', showUinfo);
function showUinfo(){
    var m=g_obj_map.get("msg_user");
    var Info="玩家_"+ansi_up.ansi_to_text(m.get("name"))+"\n等級_"+m.get("lvl")+"\n攻擊力_"+m.get("attack")+"\n防禦力_"+m.get("recovery")+"\n血量_"+m.get("max_kee")+"\n技能減傷_"+m.get("reduce1")+"\n額外減傷_"+m.get("reduce2")+"\n命中_"+m.get("mz")+"\n敏捷_"+m.get("mj")+"\n銀兩_"+m.get("money")+"\n死亡次數_"+m.get("die_times")+"\n殺玩家次數_"+m.get("PKS")+"\n正氣_"+m.get("shen")+"\n年齡_"+m.get("age")+"\n經驗_"+m.get("exp")+"\n殺人數_"+m.get("MKS")+"\n殺氣_"+m.get("bellicosity");
	alert(Info);

}


(function (window) {
	window.go = function(dir) {
	    console.debug("開始執行：", dir);
		var d = dir.split(";");
		for (var i = 0; i < d.length; i++)
			clickButton(d[i], 0);
	};



    function QinglongMon() {
        this.dispatchMessage = function(b) {
            var type = b.get("type"), subType = b.get("subtype");
            if (type == "channel" && subType == "sys") {
                var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
                if (msg.indexOf("【系統】青龍會組織：") > -1 || msg.indexOf("遊俠會：") > 0) {
                    var l = msg.match(/系統】青龍會組織：(.*)正在(.*)施展力量，本會願出(.*)的戰利品獎勵給本場戰鬥的最終獲勝者。/);
                    if (l&&QLtrigger==1) {
                        go_ql(l[2]);
                        alert('青龍:' + l[1] + " --- " + l [3] + "  " + l[2]);
                        return;
                    }

                    l = msg.match(/【系統】遊俠會：聽說(.*)出來闖盪江湖了，目前正在前往(.*)的路上。/);
                    if (l&&YXtrigger==1) {
                        go_yx(l[2]);
                        return;
                    }
                }
            }
        }
    }

    var qlMon = new QinglongMon;

    var ql_w = {
    	'書房': 1,
    	'打鐵鋪子': 2,
    	'桑鄰藥鋪': 3,
    	'南市': 4,
    	'桃花別院': 5,
    	'繡樓': 6,
    	'北大街': 7,
    	'錢莊': 8,
    	'雜貨鋪': 9,
    	'祠堂大門': 10,
    	'廳堂': 11
    };
    window.go_ql = function(w) {
    	zx(ql_w[w]);
    }

    function go_yx(w){
        if (w.startsWith("雪亭鎮")) {
            go("jh 1;e;n");
        } else if (w.startsWith("洛陽")) {
            go("jh 2;n;n");
        } else if (w.startsWith("華山村")) {
            go("jh 3;s;s");
        } else if (w.startsWith("華山")) {
            go("jh 4;n;n");
        } else if (w.startsWith("揚州")) {
            go("jh 5;n;n");
        } else if (w.startsWith("丐幫")) {
            go("jh 6;event_1_98623439;s");
        } else if (w.startsWith("喬陰縣")) {
            go("jh 7;s;s;s");
        } else if (w.startsWith("峨眉山")) {
            go("jh 8;w;nw;n;n;n;n");
        } else if (w.startsWith("恒山")) {
            go("jh 9;n;n;n");
        } else if (w.startsWith("武當山")) {
            go("jh 10;w;n;n");
        } else if (w.startsWith("晚月莊")) {
            go("jh 11;e;e;s;sw;se;w");
        } else if (w.startsWith("水煙閣")) {
            go("jh 12;n;n;n");
        } else if (w.startsWith("少林寺")) {
            go("jh 13;n;n");
        } else if (w.startsWith("唐門")) {
            go("jh 14;w;n;n;n");
        } else if (w.startsWith("青城山")) {
            go("jh 15;s;s");
        } else if (w.startsWith("逍遙林")) {
            go("jh 16;s;s");
        } else if (w.startsWith("開封")) {
            go("jh 17;n;n");
        } else if (w.startsWith("明教")) {
            go("jh 18;n;nw;n;n");
        } else if (w.startsWith("全真教")) {
            go("jh 19;s;s");
        } else if (w.startsWith("古墓")) {
            go("jh 20;w;w");
        } else if (w.startsWith("白馱山")) {
            go("jh 21;nw;w");
        } else if (w.startsWith("嵩山")) {
            go("jh 22;n;n");
        } else if (w.startsWith("寒梅莊")) {
            go("jh 23");
        } else if (w.startsWith("泰山")) {
            go("jh 24");
        } else if (w.startsWith("大旗門")) {
            go("jh 25");
        } else if (w.startsWith("大昭寺")) {
            go("jh 26");
        } else if (w.startsWith("魔教")) {
            go("jh 27");
        }

        random_move();
    }


    function random_move() {
        var v = Math.random();
        if (v < 0.25) go("e")
        else if (v < 0.5) go("w")
        else if (v < 0.75) go("s")
        else go("n");
    }

    function zx(x) {
        x = parseInt(x);
        console.debug(x);

        if (x == 1) {
            go("jh 1;e;n;e;e;e;e;n");
        } else if (x == 2) {
            go("jh 1;e;n;n;w");
        } else if (x == 3) {
            go("jh 1;e;n;n;n;w");
        }

        if (x == 4) {
            go("jh 2;n;n;e")
        }

        if (x == 5) {
            go("jh 2;n;n;n;n;w;s");
        }
        if (x == 6) {
            go("jh 2;n;n;n;n;w;s;w");
        }
        if (x == 7) {
            go("jh 2;n;n;n;n;n;n;n");
        }
        if (x == 8) {
            go("jh 2;n;n;n;n;n;n;;n;e");
        }

        if (x == 9) {
            go("jh 3;s;s;e");
        }
        if (x == 10) {
            go("jh 3;s;s;w");
        }
        if (x == 11) {
            go("jh 3;s;s;w;n");
        }

    }


function MyMap(){
    this.elements = [];
    this.size = function() {
        return this.elements.length
    };
    this.isEmpty = function() {
        return 1 > this.elements.length
    };
    this.clear = function() {
        this.elements = []
    };
    this.put = function(a, b) {
        for (var c = !1, d = 0; d < this.elements.length; d++)
            if (this.elements[d].key == a) {
                c = !0;
                this.elements[d].value = b;
                break
            }
        !1 == c && this.elements.push({
            key: a,
            value: b
        })
    };
    this.remove = function(a) {
        var b = !1;
        try {
            for (var c = 0; c < this.elements.length; c++)
                if (this.elements[c].key == a)
                    return this.elements.splice(c, 1), !0
        } catch (d) {
            b =
            !1
        }
        return b
    };
    this.get = function(a) {
        try {
            for (var b = 0; b < this.elements.length; b++)
                if (this.elements[b].key == a)
                    return this.elements[b].value
        } catch (c) {
            return null
        }
    };
    this.copy = function(a) {
        null == a && (a = new Map);
        try {
            for (var b = 0; b < this.elements.length; b++)
                a.put(this.elements[b].key, this.elements[b].value);
            return a
        } catch (c) {
            return null
        }
    };
    this.element = function(a) {
        return 0 > a || a >= this.elements.length ? null : this.elements[a]
    };
    this.containsKey = function(a) {
        var b = !1;
        try {
            for (var c = 0; c < this.elements.length; c++)
                if (this.elements[c].key ==
                a) {
                    b = !0;
                    break
                }
        } catch (d) {
            b = !1
        }
        return b
    };
    this.containsValue = function(a) {
        var b = !1;
        try {
            for (var c = 0; c < this.elements.length; c++)
                if (this.elements[c].value == a) {
                    b = !0;
                    break
                }
        } catch (d) {
            b = !1
        }
        return b
    };
    this.values = function() {
        for (var a = [], b = 0; b < this.elements.length; b++)
            a.push(this.elements[b].value);
        return a
    };
    this.keys = function() {
        for (var a = [], b = 0; b < this.elements.length; b++)
            a.push(this.elements[b].key);
        return a
    }
}

function Question() {
        this.answers = new MyMap;
		this.answers.put("锦缎腰带是腰带类的第几级装备", "a");
		this.answers.put("扬州询问黑狗子能到下面哪个地点", "a");
        this.answers.put("跨服天剑谷每周六几点开启", "a");
		this.answers.put("青城派的道德经可以提升哪个属性", "c");
		this.answers.put("论剑中以下哪个不是晚月庄的技能", "d");
		this.answers.put("跨服天剑谷是星期几举行的", "b");
        this.answers.put("玉女剑法是哪个门派的技能", "b");
        this.answers.put("玉草帽可以在哪位npc那里获得？", "b");
        this.answers.put("逍遥林是第几章的地图", "c");
        this.answers.put("精铁棒可以在哪位npc那里获得", "d");
        this.answers.put("鎏金缦罗是披风类的第几级装备", "d");
        this.answers.put("神雕大侠在哪一章", "a");
        this.answers.put("华山武器库从哪个NPC进", "d");
        this.answers.put("首冲重置卡需要隔多少天才能在每日充值奖励中领取", "b");
        this.answers.put("以下哪个不是空空儿教导的武学", "b");
        this.answers.put('“迎梅客栈”场景是在哪个地图上', "d");
        this.answers.put('独孤求败有过几把剑', "d");
        this.answers.put('晚月庄的小贩在下面哪个地点', "a");
        this.answers.put('扬州询问黑狗能到下面哪个地点', "a");
        this.answers.put('“清音居”场景是在哪个地图上', "a");
        this.answers.put('一天能完成师门任务有多少个', "c");
        this.answers.put('林祖师是哪个门派的师傅', "a");
        this.answers.put('九区服务器名称', "d");
        this.answers.put('去唐门地下通道要找谁拿钥匙', "a");
        this.answers.put('能增容貌的是下面哪个技能', "a");
        this.answers.put('铁手镯  可以在哪位npc那里获得', "a");
        this.answers.put('街头卖艺是挂机里的第几个任务', "a");
        this.answers.put('“三清宫”场景是在哪个地图上', "c");
        this.answers.put('论剑中以下哪个是大理段家的技能', "a");
        this.answers.put('藏宝图在哪里npc那里买', "a");
        this.answers.put('六脉神剑是哪个门派的绝学', "a");
        this.answers.put('如何将华山剑法从400级提升到440级', "d");
        this.answers.put('王重阳是哪个门派的师傅', "b");
        this.answers.put('在庙祝处洗杀气每次可以消除多少点', "a");
        this.answers.put('以下哪个宝石不能镶嵌到衣服', "a");
        this.answers.put('达摩杖的伤害是多少', "d");
        this.answers.put('嫁衣神功是哪个门派的技能', "b");
        this.answers.put('可以召唤金甲伏兵助战是哪个门派', "a");
        this.answers.put('端茶递水是挂机里的第几个任务', "b");
        this.answers.put('下列哪项战斗不能多个玩家一起战斗', "a");
        this.answers.put('寒玉床在哪里切割', "a");
        this.answers.put('拜师风老前辈需要正气多少', "b");
        this.answers.put('每天微信分享能获得多少元宝', "d");
        this.answers.put('丐帮的绝学是什么', "a");
        this.answers.put('以下哪个门派不是隐藏门派', "c");
        this.answers.put('玩家想修改名字可以寻找哪个NPC', "a");
        this.answers.put('论剑中以下哪个不是古墓派的的技能', "b");
        this.answers.put('安惜迩是在那个场景', "c");
        this.answers.put('神雕侠侣的时代背景是哪个朝代', "d");
        this.answers.put('论剑中以下哪个是华山派的技能的', "a");
        this.answers.put('夜皇在大旗门哪个场景', "c");
        this.answers.put('什么装备可以镶嵌紫水晶', "c");
        this.answers.put('乌檀木刀可以在哪位npc那里获得', "d");
        this.answers.put('易容后保持时间是多久', "a");
        this.answers.put('以下哪个不是宋首侠教导的武学', "d");
        this.answers.put('踏云棍可以在哪位npc那里获得', "a");
        this.answers.put('玉女剑法是哪个门派的技能', "b");
        this.answers.put('根骨能提升哪个属性', "c");
        this.answers.put('论剑中以下哪个是铁血大旗门的技能', "b");
        this.answers.put('明教的九阳神功有哪个特殊效果', "a");
        this.answers.put('辟邪剑法在哪学习', "b");
        this.answers.put('论剑中古墓派的终极师傅是谁', "d");
        this.answers.put('论剑中青城派的终极师傅是谁', "d");
        this.answers.put('逍遥林怎么弹琴可以见到天山姥姥', "b");
        this.answers.put('论剑一次最多能突破几个技能', "c");
        this.answers.put('劈雳拳套有几个镶孔', "a");
        this.answers.put('仓库最多可以容纳多少种物品', "b");
        this.answers.put('以下不是天宿派师傅的是哪个', "c");
        this.answers.put('易容术在哪学习', "b");
        this.answers.put('瑷伦在晚月庄的哪个场景', "b");
        this.answers.put('羊毛斗篷是披风类的第几级装备', "a");
        this.answers.put('弯月刀可以在哪位npc那里获得', "b");
        this.answers.put('骆云舟在乔阴县的哪个场景', "b");
        this.answers.put('屠龙刀是什么级别的武器', "a");
        this.answers.put('天蚕围腰可以镶嵌几颗宝石', "d");
        this.answers.put('“蓉香榭”场景是在哪个地图上', "c");
        this.answers.put('施令威在哪个地图', "b");
        this.answers.put('扬州在下面哪个地点的npc处可以获得玉佩', "c");
        this.answers.put('拜师铁翼需要多少内力', "b");
        this.answers.put('九区服务器名称', "d");
        this.answers.put('"白玉牌楼"场景是在哪个地图上', "c");
        this.answers.put('宝玉鞋在哪获得', "a");
        this.answers.put('落英神剑掌是哪个门派的技能', "b");
        this.answers.put('下面哪个门派是正派', "a");
        this.answers.put('兑换易容面具需要多少玄铁碎片', "c");
        this.answers.put('以下哪些物品是成长计划第五天可以领取的', "b");
        this.answers.put('论剑中以下哪个是晚月庄的人物', "a");
        this.answers.put('论剑中以下哪个不是魔教的技能', "a");
        this.answers.put('匕首加什么属性', "c");
        this.answers.put('钢丝甲衣可以在哪位npc那里获得', "d");
        this.answers.put('论剑中花紫会的师傅是谁', "c");
        this.answers.put('暴雨梨花针的伤害是多少', "c");
		this.answers.put('吸血蝙蝠在下面哪个地图', "a");
        this.answers.put('论剑中以下是峨嵋派技能的是哪个', "a");
        this.answers.put('蓝止萍在晚月庄哪个小地图', "b");
        this.answers.put('下面哪个地点不是乔阴县的', "d");
        this.answers.put('领取消费积分需要寻找哪个NPC', "c");
        this.answers.put('下面哪个不是门派绝学', "d");
        this.answers.put('人物背包最多可以容纳多少种物品', "a");
        this.answers.put('什么装备不能镶嵌黄水晶', "d");
        this.answers.put('古灯大师在大理哪个场景', "c");
        this.answers.put('草帽可以在哪位npc那里获得', "b");
        this.answers.put('西毒蛇杖的伤害是多少', "c");
        this.answers.put('成长计划六天可以领取多少银两', "d");
        this.answers.put('朱老伯在华山村哪个小地图', "b");
        this.answers.put('论剑中以下哪个是唐门的技能', "b");
        this.answers.put('游龙散花是哪个门派的阵法', "d");
        this.answers.put('高级乾坤再造丹加什么', "b");
        this.answers.put('唐门的唐门毒经有哪个特殊效果', "a");
        this.answers.put('葛伦在大招寺的哪个场景', "b");
        this.answers.put('“三清殿”场景是在哪个地图上', "b");
        this.answers.put('哪样不能获得玄铁碎片', "c");
        this.answers.put('在哪里捏脸提升容貌', "d");
        this.answers.put('论剑中以下哪个是天邪派的技能', "b");
        this.answers.put('向师傅磕头可以获得什么', "b");
        this.answers.put('骆云舟在哪一章', "c");
        this.answers.put('论剑中以下哪个不是唐门的技能', "c");
        this.answers.put('华山村王老二掉落的物品是什么', "a");
        this.answers.put('下面有什么是寻宝不能获得的', "c");
        this.answers.put('寒玉床需要切割多少次', "d");
        this.answers.put('绿宝石加什么属性', "c");
        this.answers.put('魏无极处读书可以读到多少级', "a");
        this.answers.put('天山姥姥在逍遥林的哪个场景', "d");
        this.answers.put('天羽奇剑是哪个门派的技能', "a");
        this.answers.put('大招寺的铁布衫有哪个特殊效果', "c");
        this.answers.put('挖剑冢可得什么', "a");
        this.answers.put('灭绝师太在峨眉山哪个场景', "a");
        this.answers.put('论剑是星期几举行的', "c");
        this.answers.put('柳淳风在雪亭镇哪个场景', "b");
        this.answers.put('萧辟尘在哪一章', "d");
        this.answers.put('论剑中以下哪个是明教的技能', "b");
        this.answers.put('天邪派在哪里拜师', "b");
        this.answers.put('钨金腰带是腰带类的第几级装备', "d");
        this.answers.put('灭绝师太在第几章', "c");
        this.answers.put('一指弹在哪里领悟', "b");
        this.answers.put('翻译梵文一次多少银两', "d");
        this.answers.put('刀法基础在哪掉落', "a");
        this.answers.put('黯然消魂掌有多少招式', "c");
        this.answers.put('黑狗血在哪获得', "b");
        this.answers.put('雪蕊儿在铁雪山庄的哪个场景', "d");
        this.answers.put('东方教主在魔教的哪个场景', "b");
        this.answers.put('以下属于正派的门派是哪个', "a");
        this.answers.put('选择武学世家会影响哪个属性', "a");
        this.answers.put('寒玉床睡觉一次多久', "c");
        this.answers.put('魏无极在第几章', "a");
        this.answers.put('孙天灭是哪个门派的师傅', "c");
        this.answers.put('易容术在哪里学习', "a");
        this.answers.put('哪个NPC掉落拆招基础', "a");
        this.answers.put('七星剑法是哪个门派的绝学', "a");
        this.answers.put('以下哪些物品不是成长计划第二天可以领取的', "c");
        this.answers.put('以下哪个门派是中立门派', "a");
        this.answers.put('黄袍老道是哪个门派的师傅', "c");
        this.answers.put('舞中之武是哪个门派的阵法', "b");
        this.answers.put('隐者之术是那个门派的阵法', "a");
        this.answers.put('踏雪无痕是哪个门派的技能', "b");
        this.answers.put('以下哪个不是在雪亭镇场景', "d");
        this.answers.put('排行榜最多可以显示多少名玩家', "a");
        this.answers.put('貂皮斗篷是披风类的第几级装备', "b");
        this.answers.put('武当派的绝学技能是以下哪个', "d");
        this.answers.put('兰花拂穴手是哪个门派的技能', "a");
        this.answers.put('油流麻香手是哪个门派的技能', "a");
//        this.answers.put('清风寨在哪', "b");
        this.answers.put('披星戴月是披风类的第几级装备', "d");
        this.answers.put('当日最低累积充值多少元即可获得返利', "b");
        this.answers.put('追风棍在哪里获得', "b");
        this.answers.put('长剑在哪里可以购买', "a");
        this.answers.put('莫不收在哪一章', "a");
        this.answers.put('读书写字最高可以到多少级', "b");
        this.answers.put('哪个门派拜师没有性别要求', "d");
        this.answers.put('墨磷腰带是腰带类的第几级装备', "d");
        this.answers.put('不属于白驼山的技能是什么', "b");
        this.answers.put('婆萝蜜多心经是哪个门派的技能', "b");
        this.answers.put('乾坤一阳指是哪个师傅教的', "a");
        this.answers.put('“日月洞”场景是在哪个地图上', "b");
        this.answers.put('倚天屠龙记的时代背景哪个朝代', "a");
        this.answers.put('八卦迷阵是哪个门派的阵法', "b");
        this.answers.put('七宝天岚舞是哪个门派的技能', "d");
        this.answers.put('断云斧是哪个门派的技能', "a");
        this.answers.put('跨服需要多少级才能进入', "c");
        this.answers.put('易容面具需要多少玄铁兑换', "c");
        this.answers.put('张教主在明教哪个场景', "d");
        this.answers.put('玉蜂浆在哪个地图获得', "a");
        this.answers.put('在逍遥派能学到的技能是哪个', "a");
        this.answers.put('每日微信分享可以获得什么奖励', "a");
        this.answers.put('红宝石加什么属性', "b");
        this.answers.put('金玉断云是哪个门派的阵法', "a");
        this.answers.put('正邪任务一天能做几次', "a");
        this.answers.put('白金戒指可以在哪位npc那里获得', "b");
		this.answers.put('金戒指可以在哪位npc那里获得', "d");
        this.answers.put('柳淳风在哪哪一章', "c");
        this.answers.put('论剑是什么时间点正式开始', "a");
        this.answers.put('黯然销魂掌是哪个门派的技能', "a");
        this.answers.put('在正邪任务中不能获得下面什么奖励', "d");
        this.answers.put('孤儿出身增加什么', "d");
        this.answers.put('丁老怪在天宿海的哪个场景', "b");
        this.answers.put('读书写字301-400级在哪里买书', "c");
        this.answers.put('闯楼第几层可以获得称号“藏剑楼长老”', "c");
        this.answers.put('以下属于邪派的门派是哪个', "b");
        this.answers.put('论剑中以下哪个不是丐帮的人物', "a");
        this.answers.put('论剑中青城派的第一个师傅是谁', "a");
        this.answers.put('以下哪个不是何不净教导的武学', "c");
        this.answers.put('吕进在哪个地图', "a");
        this.answers.put('拜师老毒物需要蛤蟆功多少级', "a");
        this.answers.put('蛇形刁手是哪个门派的技能', "b");
        this.answers.put('乌金玄火鞭的伤害是多少', "d");
        this.answers.put('张松溪在哪个地图', "c");
        this.answers.put('欧阳敏是哪个门派的', "b");
        this.answers.put('以下哪个门派是正派', "d");
        this.answers.put('成功易容成异性几次可以领取易容成就奖', "b");
        this.answers.put('论剑中以下不是峨嵋派技能的是哪个', "b");
        this.answers.put('城里抓贼是挂机里的第几个任务', "b");
        this.answers.put('每天的任务次数几点重置', "d");
        this.answers.put('莲花掌是哪个门派的技能', "a");
        this.answers.put('大招寺的金刚不坏功有哪个特殊效果', "a");
        this.answers.put('多少消费积分可以换取黄金钥匙', "b");
        this.answers.put('什么装备都能镶嵌的是什么宝石', "c");
        this.answers.put('什么影响打坐的速度', "c");
        this.answers.put('蓝止萍在哪一章', "c");
        this.answers.put('寒玉床睡觉修炼需要多少点内力值', "c");
        this.answers.put('武穆兵法通过什么学习', "a");
        this.answers.put('倒乱七星步法是哪个门派的技能', "d");
        this.answers.put('闯楼第几层可以获得称号“藏剑楼护法”', "b");
        this.answers.put('兽皮鞋可以在哪位npc那里获得', "b");
        this.answers.put('寒玉床在那个地图可以找到', "a");
        this.answers.put('易容术可以找哪位NPC学习', "b");
        this.answers.put('铁戒指可以在哪位npc那里获得', "a");
        this.answers.put('通灵需要寻找哪个NPC', "c");
        this.answers.put('功德箱在雪亭镇的哪个场景', "c");
        this.answers.put('蓝宝石加什么属性', "a");
        this.answers.put('每天分享游戏到哪里可以获得20元宝', "a");
        this.answers.put('选择书香门第会影响哪个属性', "b");
        this.answers.put('以下哪个不是微信分享好友、朋友圈、QQ空间的奖励', "a");
        this.answers.put('新手礼包在哪领取', "c");
        this.answers.put('春风快意刀是哪个门派的技能', "b");
        this.answers.put('朱姑娘是哪个门派的师傅', "a");
        this.answers.put('出生选武学世家增加什么', "a");
        this.answers.put('以下哪个宝石不能镶嵌到内甲', "a");
        this.answers.put('生死符的伤害是多少', "a");
        this.answers.put('扬文的属性', "a");
        this.answers.put('云问天在哪一章', "a");
        this.answers.put('首次通过桥阴县不可以获得那种奖励', "a");
        this.answers.put('剑冢在哪个地图', "a");
        this.answers.put('在哪里消杀气', "a");
        this.answers.put('闯楼每多少层有称号奖励', "a");
        this.answers.put('打坐增长什么属性', "a");
        this.answers.put('从哪个npc处进入跨服战场', "a");
        this.answers.put('下面哪个是天邪派的师傅', "a");
        this.answers.put('每天能做多少个谜题任务', "a");
        this.answers.put('小男孩在华山村哪里', "a");
        this.answers.put('追风棍可以在哪位npc那里获得', "a");
        this.answers.put('逍遥派的绝学技能是以下哪个', "a");
        this.answers.put('沧海护腰是腰带类的第几级装备', "a");
        this.answers.put('花花公子在哪个地图', "a");
        this.answers.put('每次合成宝石需要多少银两', "a");
        this.answers.put('以下哪个不是微信分享好友、朋友圈、QQ空间的奖励', "a");
        this.answers.put('打排行榜每天可以完成多少次', "a");
        this.answers.put('夜行披风是披风类的第几级装备', "a");
        this.answers.put('白蟒鞭的伤害是多少', "a");
        this.answers.put('易容术向谁学习', "a");
        this.answers.put('支线对话书生上魁星阁二楼杀死哪个NPC给10元宝', "a");
        this.answers.put('斗转星移是哪个门派的技能', "a");
        this.answers.put('杨过在哪个地图', "a");
        this.answers.put('钻石项链在哪获得', "a");
        this.answers.put('多少消费积分换取黄金宝箱', "a");
        this.answers.put('每突破一次技能有效系数加多少', "a");
        this.answers.put('茅山学习什么技能招宝宝', "a");
        this.answers.put('陆得财在乔阴县的哪个场景', "a");
        this.answers.put('独龙寨是第几个组队副本', "a");
        this.answers.put('以下哪个是花紫会的祖师', "a");
        this.answers.put('金弹子的伤害是多少', "a");
        this.answers.put('明月帽要多少刻刀摩刻', "a");
        this.answers.put('论剑输一场获得多少论剑积分', "a");
        this.answers.put('论剑中以下哪个是铁血大旗门的师傅', "a");
        this.answers.put('8级的装备摹刻需要几把刻刀', "a");
        this.answers.put('赠送李铁嘴银两能够增加什么', "a");
        this.answers.put('金刚不坏功有什么效果', "a");
        this.answers.put('少林的易筋经神功有哪个特殊效果', "a");
        this.answers.put('大旗门的修养术有哪个特殊效果', "a");
        this.answers.put('金刚杖的伤害是多少', "a");
        this.answers.put('双儿在扬州的哪个小地图', "a");
        this.answers.put('花不为在哪一章', "a");
        this.answers.put('铁项链可以在哪位npc那里获得', "a");
        this.answers.put('武学世家加的什么初始属性', "a");
        this.answers.put('师门磕头增加什么', "a");
        this.answers.put('全真的道家心法有哪个特殊效果', "a");
        this.answers.put('功德箱捐香火钱有什么用', "a");
        this.answers.put('雪莲有什么作用', "a");
        this.answers.put('论剑中以下哪个是花紫会的技能', "a");
        this.answers.put('柳文君所在的位置', "a");
        this.answers.put('岳掌门在哪一章', "a");
        this.answers.put('长虹剑在哪位npc那里获得？', "a");
        this.answers.put('副本一次最多可以进几人', "a");
        this.answers.put('师门任务每天可以完成多少次', "a");
        this.answers.put('逍遥步是哪个门派的技能', "a");
        this.answers.put('新人礼包在哪个npc处兑换', "a");
        this.answers.put('使用朱果经验潜能将分别增加多少', "a");
        this.answers.put('欧阳敏在哪一章', "a");
        this.answers.put('辟邪剑法是哪个门派的绝学技能', "a");
        this.answers.put('在哪个npc处可以更改名字', "a");
        this.answers.put('毒龙鞭的伤害是多少', "a");
        this.answers.put('晚月庄主线过关要求', "a");
        this.answers.put('怎么样获得免费元宝', "a");
        this.answers.put('成长计划需要多少元宝方可购买', "a");
        this.answers.put('青城派的道家心法有哪个特殊效果', "a");
        this.answers.put('藏宝图在哪个NPC处购买', "a");
        this.answers.put('丁老怪是哪个门派的终极师傅', "a");
        this.answers.put('斗转星移阵是哪个门派的阵法', "a");
        this.answers.put('挂机增长什么', "a");
        this.answers.put('鹰爪擒拿手是哪个门派的技能', "a");
        this.answers.put('八卦迷阵是那个门派的阵法', "a");
        this.answers.put('一天能完成挑战排行榜任务多少次', "a");
        this.answers.put('论剑每天能打几次', "a");
        this.answers.put('需要使用什么衣服才能睡寒玉床', "a");
        this.answers.put('张天师是哪个门派的师傅', "a");
        this.answers.put('技能柳家拳谁教的', "a");
        this.answers.put('九阴派梅师姐在星宿海哪个场景', "a");
        this.answers.put('哪个npc处可以捏脸', "a");
        this.answers.put('论剑中步玄派的师傅是哪个', "a");
        this.answers.put('宝玉鞋击杀哪个npc可以获得', "a");
        this.answers.put('慕容家主在慕容山庄的哪个场景', "a");
        this.answers.put('闻旗使在哪个地图', "a");
        this.answers.put('虎皮腰带是腰带类的第几级装备', "a");
        this.answers.put('在哪里可以找到“香茶”？', "a");
        this.answers.put('打造刻刀需要多少个玄铁', "a");
        this.answers.put('包家将是哪个门派的师傅', "a");
        this.answers.put('论剑中以下哪个是天邪派的人物', "a");
        this.answers.put('升级什么技能可以提升根骨', "a");
        this.answers.put('NPC公平子在哪一章地图', "a");
        this.answers.put('逄义是在那个场景', "a");
        this.answers.put('锻造一把刻刀需要多少银两', "a");
        this.answers.put('以下哪个不是岳掌门教导的武学', "a");
        this.answers.put('捏脸需要寻找哪个NPC？', "a");
        this.answers.put('论剑中以下哪个是晚月庄的技能', "a");
        this.answers.put('碧海潮生剑在哪位师傅处学习', "a");
        this.answers.put('干苦力是挂机里的第几个任务', "a");
        this.answers.put('铁血大旗门云海心法可以提升什么', "a");
        this.answers.put('以下哪些物品是成长计划第四天可以领取的？', "a");
        this.answers.put('易容术多少级才可以易容成异性NPC', "a");
        this.answers.put('摹刻扬文需要多少把刻刀？', "a");
        this.answers.put('正邪任务中客商的在哪个地图', "a");
        this.answers.put('白驼山第一位要拜的师傅是谁', "a");
        this.answers.put('枯荣禅功是哪个门派的技能', "a");
        this.answers.put('漫天花雨匕在哪获得', "a");
        this.answers.put('摧心掌是哪个门派的技能', "a");
        this.answers.put('“花海”场景是在哪个地图上？', "a");
        this.answers.put('雪蕊儿是哪个门派的师傅', "a");
        this.answers.put('新手礼包在哪里领取', "a");
        this.answers.put('论语在哪购买', "a");
        this.answers.put('银丝链甲衣可以在哪位npc那里获得？', "a");
        this.answers.put('乾坤大挪移属于什么类型的武功', "a");
        this.answers.put('移开明教石板需要哪项技能到一定级别', "a");
        this.answers.put('开通VIP月卡最低需要当天充值多少元方有购买资格', "a");
		this.answers.put('黯然销魂掌有多少招式', "c");
        this.answers.put('“跪拜坪”场景是在哪个地图上', "b");
        this.answers.put('孤独求败称号需要多少论剑积分兑换', "b");
        this.answers.put('孔雀氅可以镶嵌几颗宝石', "b");
        this.answers.put('客商在哪一章', "b");
        this.answers.put('疯魔杖的伤害是多少', "b");
        this.answers.put('丐帮的轻功是哪个', "b");
        this.answers.put('霹雳掌套的伤害是多少', "b");
        this.answers.put('方媃是哪个门派的师傅', "b");
        this.answers.put('拜师张三丰需要多少正气', "b");
        this.answers.put('天师阵法是哪个门派的阵法', "b");
        this.answers.put('选择商贾会影响哪个属性', "b");
        this.answers.put('银手镯可以在哪位npc那里获得？', "b");
        //this.answers.put('清风寨在哪', "d");
        this.answers.put('在雪亭镇李火狮可以学习多少级柳家拳', "b");
        this.answers.put('华山施戴子掉落的物品是什么', "b");
        this.answers.put('尹志平是哪个门派的师傅', "b");
        this.answers.put('病维摩拳是哪个门派的技能', "b");
        this.answers.put('茅山的绝学是什么', "b");
        this.answers.put('茅山派的轻功是什么', "b");
        this.answers.put('风泉之剑可以在哪位npc那里获得？', "b");
        this.answers.put('凌波微步是哪个门派的技能', "b");
        this.answers.put('藏宝图在哪个npc处购买', "b");
        this.answers.put('军营是第几个组队副本', "b");
        this.answers.put('北岳殿神像后面是哪位npc', "b");
        this.answers.put('王重阳是哪个门派的师傅', "b");
        this.answers.put('跨服是星期几举行的', "b");
        this.answers.put('学习屠龙刀法需要多少内力', "b");
        this.answers.put('高级乾坤再造丹是增加什么的', "b");
        this.answers.put('银项链可以在哪位npc那里获得', "b");
        this.answers.put('每天在线多少个小时即可领取消费积分', "b");
        this.answers.put('晚月庄的内功是什么', "b");
        this.answers.put('冰魄银针的伤害是多少', "b");
        this.answers.put('论剑中以下哪个是丐帮的技能', "b");
        this.answers.put('神雕大侠所在的地图', "b");
        this.answers.put('突破丹在哪里购买', "b");
		this.answers.put('白金手镯可以在哪位npc那里获得', "a");
        this.answers.put('金手镯可以在哪位npc那里获得', "b");
        this.answers.put('以下哪个不是梁师兄教导的武学', "b");
        this.answers.put('技能数量超过了什么消耗潜能会增加', "b");
        this.answers.put('白金项链可以在哪位npc那里获得', "b");
        this.answers.put('小龙女住的古墓是谁建造的', "b");
        this.answers.put('打开引路蜂礼包可以得到多少引路蜂', "b");
        this.answers.put('购买新手进阶礼包在挂机打坐练习上可以享受多少倍收益', "b");
        this.answers.put('白玉腰束是腰带类的第几级装备', "b");
        this.answers.put('老顽童在全真教哪个场景', "b");
        this.answers.put('神雕侠侣的作者是', "b");
        this.answers.put('晚月庄的七宝天岚舞可以提升哪个属性', "b");
        this.answers.put('论剑在周几进行', "b");
        this.answers.put('vip每天不可以领取什么', "b");
        this.answers.put('每天有几次试剑', "b");
        this.answers.put('晚月庄七宝天岚舞可以提升什么', "b");
        this.answers.put('哪个分享可以获得20元宝', "b");
        this.answers.put('大保险卡可以承受多少次死亡后不降技能等级', "b");
        this.answers.put('凌虚锁云步是哪个门派的技能', "b");
        this.answers.put('屠龙刀法是哪个门派的绝学技能', "b");
        this.answers.put('金丝鞋可以在哪位npc那里获得', "b");
        this.answers.put('老毒物在白驮山的哪个场景', "b");
        this.answers.put('毒物阵法是哪个门派的阵法', "b");
        this.answers.put('以下哪个不是知客道长教导的武学', "b");
        this.answers.put('飞仙剑阵是哪个门派的阵法', "b");
        this.answers.put('副本完成后不可获得下列什么物品', "b");
        this.answers.put('晚月庄意寒神功可以提升什么', "b");
        this.answers.put('北冥神功是哪个门派的技能', "b");
        this.answers.put('论剑中以下哪个是青城派的技能', "b");
        this.answers.put('六阴追魂剑是哪个门派的技能', "b");
        this.answers.put('王铁匠是在那个场景', "b");
        this.answers.put('以下哪个是步玄派的祖师', "b");
        this.answers.put('在洛阳萧问天那可以学习什么心法', "b");
        this.answers.put('在哪个npc处能够升级易容术', "b");
        this.answers.put('摹刻10级的装备需要摩刻技巧多少级', "b");
        this.answers.put('师门任务什么时候更新', "b");
        this.answers.put('哪个npc属于全真七子', "b");
        this.answers.put('正邪任务中卖花姑娘在哪个地图', "b");
        this.answers.put('风老前辈在华山哪个场景', "b");
        this.answers.put('“留云馆”场景是在哪个地图上？', "b");
        this.answers.put('割鹿刀可以在哪位npc那里获得', "b");
        this.answers.put('论剑中以下哪个是大招寺的技能', "b");
        this.answers.put('全真的基本阵法有哪个特殊效果', "b");
        this.answers.put('论剑要在晚上几点前报名', "b");
        this.answers.put('碧磷鞭的伤害是多少？', "b");
        this.answers.put('一天能完成谜题任务多少个', "b");
        this.answers.put('正邪任务杀死好人增长什么', "b");
        this.answers.put('木道人在青城山的哪个场景', "b");
        this.answers.put('论剑中以下哪个不是大招寺的技能', "b");
        this.answers.put('“伊犁”场景是在哪个地图上？', "b");
        this.answers.put('“冰火岛”场景是在哪个地图上', "b");
        this.answers.put('“双鹤桥”场景是在哪个地图上', "b");
        this.answers.put('“百龙山庄”场景是在哪个地图上？', "b");

        this.answers.put('九阳神功是哪个门派的技能', "c");
        this.answers.put('树王坟在第几章节', "c");
        this.answers.put('阳刚之劲是哪个门派的阵法', "c");
        this.answers.put('上山打猎是挂机里的第几个任务', "c");
        this.answers.put('一张分身卡的有效时间是多久', "c");
        this.answers.put('锻造一把刻刀需要多少玄铁碎片锻造', "c");
        this.answers.put('论剑中以下哪个不是铁血大旗门的技能', "c");
        this.answers.put('如意刀是哪个门派的技能', "c");
        this.answers.put('跨服在哪个场景进入', "c");
        this.answers.put('在哪个NPC可以购买恢复内力的药品？', "c");
        this.answers.put('欧阳敏在唐门的哪个场景', "c");
        this.answers.put('密宗伏魔是哪个门派的阵法', "c");
        this.answers.put('孔雀氅是披风类的第几级装备？', "c");
        this.answers.put('天山折梅手是哪个门派的技能', "c");
        this.answers.put('玩家每天能够做几次正邪任务', "c");
        this.answers.put('柳淳风在哪一章', "c");
        this.answers.put('茅山天师正道可以提升什么', "c");
        this.answers.put('洪帮主在洛阳哪个场景', "c");
        this.answers.put('以下哪个不是全真七子？', "c");
        this.answers.put('云九天是哪个门派的师傅', "c");
        this.answers.put('摹刻烈日宝链需要多少级摩刻技巧', "c");
        this.answers.put('伏虎杖的伤害是多少', "c");
        this.answers.put('灵蛇杖法是哪个门派的技能', "c");
        this.answers.put('“子午楼”场景是在哪个地图上', "c");
        this.answers.put('什么装备可以镶嵌紫水晶', "c");
        this.answers.put('石师妹哪个门派的师傅', "c");
        this.answers.put('烈火旗大厅是那个地图的场景', "c");
        this.answers.put('打土匪是挂机里的第几个任务', "c");
        this.answers.put('捏脸需要花费多少银两', "c");
        this.answers.put('大旗门的云海心法可以提升哪个属性', "c");
        this.answers.put('论剑中以下哪个是铁雪山庄的技能', "c");
        this.answers.put('“白玉牌楼”场景是在哪个地图上', "c");
        this.answers.put('以下哪个宝石不能镶嵌到披风', "c");
        this.answers.put('魏无极身上掉落什么装备', "c");
        this.answers.put('以下不是步玄派的技能的哪个', "c");
        this.answers.put('“常春岛渡口”场景是在哪个地图上', "c");
        this.answers.put('北斗七星阵是第几个的组队副本', "c");
        this.answers.put('宝石合成一次需要消耗多少颗低级宝石', "c");
        this.answers.put('烈日项链可以镶嵌几颗宝石', "c");
        this.answers.put('达摩在少林哪个场景', "c");
        this.answers.put('积分商城在雪亭镇的哪个场景', "c");
        this.answers.put('全真的双手互搏有哪个特殊效果', "c");
        this.answers.put('论剑中以下哪个不是唐门的人物', "c");
        this.answers.put('棋道是哪个门派的技能', "c");
        this.answers.put('七星鞭的伤害是多少', "c");
        this.answers.put('富春茶社在哪一章', "c");
        this.answers.put('等级多少才能在世界频道聊天', "c");
        this.answers.put('以下哪个是封山派的祖师', "c");
        this.answers.put('论剑是星期几进行的', "c");
        this.answers.put('师门任务每天可以做多少个', "c");
        this.answers.put('风泉之剑加几点悟性', "c");
        this.answers.put('黑水伏蛟可以在哪位npc那里获得？', "c");
        this.answers.put('陆得财是哪个门派的师傅', "c");
        this.answers.put('拜师小龙女需要容貌多少', "c");
        this.answers.put('下列装备中不可摹刻的是', "c");
        this.answers.put('古灯大师是哪个门派的终极师傅', "c");
        this.answers.put('“翰墨书屋”场景是在哪个地图上', "c");
        this.answers.put('论剑中大招寺第一个要拜的师傅是谁', "c");
        this.answers.put('杨过小龙女分开多少年后重逢', "c");
        this.answers.put('选择孤儿会影响哪个属性', "c");
        this.answers.put('论剑中逍遥派的终极师傅是谁', "c");
        this.answers.put('不可保存装备下线多久会消失', "c");
        this.answers.put('一个队伍最多有几个队员', "c");
//        this.answers.put('论语在哪购买', "c");
        this.answers.put('以下哪个宝石不能镶嵌到戒指', "c");
        this.answers.put('论剑是每周星期几', "c");
        this.answers.put('茅山在哪里拜师', "c");
        this.answers.put('以下哪个宝石不能镶嵌到腰带', "c");
        this.answers.put('黄宝石加什么属性', "c");
        this.answers.put('茅山可以招几个宝宝', "c");
        this.answers.put('唐门密道怎么走', "c");
        this.answers.put('论剑中以下哪个不是大理段家的技能', "c");
        this.answers.put('论剑中以下哪个不是魔教的人物', "d");
        this.answers.put('每天能做多少个师门任务', "c");
        this.answers.put('一天能使用元宝做几次暴击谜题', "c");

        this.answers.put('成长计划第七天可以领取多少元宝', "d");
        this.answers.put('每天能挖几次宝', "d");
        this.answers.put('日月神教大光明心法可以提升什么', "d");
        this.answers.put('在哪个npc处领取免费消费积分', "d");
        this.answers.put('副本有什么奖励', "d");
        this.answers.put('论剑中以下不是华山派的人物的是哪个', "d");
        this.answers.put('论剑中以下哪个不是丐帮的技能', "d");
        this.answers.put('以下哪个不是慧名尊者教导的技能', "d");
        this.answers.put('慕容山庄的斗转星移可以提升哪个属性', "d");
        this.answers.put('论剑中以下哪个不是铁雪山庄的技能', "d");
        this.answers.put('师门任务一天能完成几次', "d");
        this.answers.put('以下有哪些物品不是每日充值的奖励', "d");
        this.answers.put('论剑中以下哪个不是华山派的技能的', "d");
        this.answers.put('武穆兵法提升到多少级才能出现战斗必刷', "d");
        this.answers.put('论剑中以下哪个不是全真教的技能', "d");
        this.answers.put('师门任务最多可以完成多少个', "d");
        this.answers.put('张三丰在哪一章', "d");
        this.answers.put('倚天剑加多少伤害', "d");
        this.answers.put('以下谁不精通降龙十八掌', "d");
        this.answers.put('论剑中以下哪个不是明教的技能', "d");
        this.answers.put('受赠的消费积分在哪里领取', "d");
        this.answers.put('以下哪个不是道尘禅师教导的武学', "d");
        this.answers.put('古墓多少级以后才能进去', "d");
        this.answers.put('千古奇侠称号需要多少论剑积分兑换', "d");
        this.answers.put('魔鞭诀在哪里学习', "d");
        this.answers.put('通灵需要花费多少银两', "d");
        this.answers.put('白银宝箱礼包多少元宝一个', "d");
        this.answers.put('以下哪个不是论剑的皮肤', "d");
        this.answers.put('小李飞刀的伤害是多少', "d");
        this.answers.put('下面哪个npc不是魔教的', "d");
        this.answers.put('天蚕围腰是腰带类的第几级装备', "d");
        this.answers.put('黄岛主在桃花岛的哪个场景', "d");
        this.answers.put('宝玉帽可以在哪位npc那里获得？', "d");
        this.answers.put('什么影响攻击力', "d");
        this.answers.put('紫宝石加什么属性', "d");
        this.answers.put('少林的混元一气功有哪个特殊效果', "d");
        this.answers.put('以下哪个是晚月庄的祖师', "d");
        this.answers.put('以下不是隐藏门派的是哪个', "d");
        this.answers.put('第一个副本需要多少等级才能进入', "d");
        this.answers.put('风泉之剑在哪里获得', "d");
        this.answers.put('镖局保镖是挂机里的第几个任务', "d");
        this.answers.put('下面哪个不是古墓的师傅', "d");
        this.answers.put('每个玩家最多能有多少个好友', "b");
        this.answers.put('以下哪个不是在扬州场景', "d");
        this.answers.put('茅山的天师正道可以提升哪个属性', "d");
        this.answers.put('“无名山脚”场景是在哪个地图上', "d");
        this.answers.put('闯楼第几层可以获得称号“藏剑楼楼主”', "d");
        this.answers.put('充值积分不可以兑换下面什么物品', "d");
        this.answers.put('魔教的大光明心法可以提升哪个属性', "d");
        this.answers.put('以下哪些物品不是成长计划第三天可以领取的', "d");
        this.answers.put('论剑中以下哪个不是峨嵋派可以拜师的师傅', "d");
        this.answers.put('哪个技能不是魔教的', "d");
        this.answers.put('沧海护腰可以镶嵌几颗宝石', "d");
        this.answers.put('城里打擂是挂机里的第几个任务', "d");
        this.answers.put('以下哪个不是鲁长老教导的武学', "d");
        this.answers.put('以下哪些物品不是成长计划第一天可以领取的', "d");
        this.answers.put('包拯在哪一章', "d");
        this.answers.put('张天师在茅山哪个场景', "d");
        this.answers.put('山河藏宝图需要在哪个NPC手里购买？', "d");
        this.answers.put('影响你出生的福缘的出生是', "d");
        this.answers.put('张三丰在武当山哪个场景', "d");
        this.answers.put('春秋水色斋需要多少杀气才能进入', "d");
        this.answers.put('论剑中以下哪个不是是晚月庄的技能', "d");
        this.answers.put('大乘佛法有什么效果', "d");
        this.answers.put('正邪任务最多可以完成多少个', "d");
        this.answers.put('高级突破丹多少元宝一颗', "d");
        this.answers.put('清虚道长在哪一章', "d");
        this.answers.put('在战斗界面点击哪个按钮可以进入聊天界面', "d");
        this.answers.put('“鹰记商号”场景是在哪个地图上？', "d");
        this.answers.put('改名字在哪改', "d");
        this.answers.put('以下哪个不是在洛阳场景', "d");
//        this.answers.put('青城派的道德经可以提升哪个属性', "d");
        this.answers.put('金项链可以在哪位npc那里获得', "d");
        this.answer = function(a) {
//          alert("答案是：" + a);
            go("question " + a);
//            go("question");
        }

        this.dispatchMessage = function(b) {
            var type = b.get("type"), msg= b.get("msg")
            if (type == "show_html_page" && msg.indexOf("知识问答第") > 0) {
				console.log(msg);
                if (msg.indexOf("回答正确！") > 0) {
                    go("question");
                    return;
                }

                var q = this.answers.keys();
                for (var i in q) {
                    var k = q[i];

                    if (msg.indexOf(k) > 0) {
                        this.answer(this.answers.get(k));
                        break;
                    }
                }

//                else if (msg.indexOf("正邪任务一天能做几次") > 0) this.answer("b")

            }
        }
    }

    var question = new Question
        function Trigger(r, h, c, n) {
        this.regexp = r;
        this.handler = h;
        this.class = c;
        this.name = n;

        this.enabled = true;

        this.trigger = function(line) {
            if (!this.enabled) return;

            if (!this.regexp.test(line)) return;

            console.log("觸發器: " + this.regexp + "觸發了");
            var m = line.match(this.regexp);
            this.handler(m);
        }

        this.enable = function() {
            this.enabled = true;
        }

        this.disable = function() {
            this.enabled = false;
        }

    }

    jh = function(w) {
        if (w == 'xt') w = 1;
        if (w == 'ly') w = 2;
        if (w == 'hsc') w = 3;
        if (w == 'hs') w = 4;
        if (w == 'yz') w = 5;
        if (w == 'gb') w = 6;
        if (w == 'qy') w = 7;
        if (w == 'em') w = 8;
        if (w == 'hs2') w = 9;
        if (w == 'wd') w = 10;
        if (w == 'wy') w = 11;
        if (w == 'sy') w = 12;
        if (w == 'sl') w = 13;
        if (w == 'tm') w = 14;
        if (w == 'qc') w = 15;
        if (w == 'xx') w = 16;
        if (w == 'kf') w = 17;
        if (w == 'gmd') w = 18;
        if (w == 'qz') w = 19;
        if (w == 'gm') w = 20;
        if (w == 'bt') w = 21;
        if (w == 'ss') w = 22;
        if (w == 'mz') w = 23;
        if (w == 'ts') w = 24;


        clickButton("jh " + w, 0);
    };


    function Triggers() {
        this.allTriggers = [];

        this.trigger = function(line) {
            var t = this.allTriggers.slice(0);
            for (var i = 0, l = t.length; i < l; i++) {
                t[i].trigger(line);
            }
        }

        this.newTrigger = function(r, h, c, n) {
            var t = new Trigger(r, h, c, n);
            if (n) {
                for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                    if (this.allTriggers[i].name == n) this.allTriggers.splice(i, 1);
                }
            }

            this.allTriggers.push(t);

            return t;
        }

        this.enableTriggerByName = function(n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) t.enable();
            }
        }

        this.disableTriggerByName = function(n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) t.disable();
            }
        }

        this.enableByCls = function(c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.class == c) t.enable();
            }
        }

        this.disableByCls = function(c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.class == c) t.disable();
            }
        }

        this.removeByCls = function(c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t && t.class == c) this.allTriggers.splice(i, 1);
            }
        }

        this.removeByName = function(n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) this.allTriggers.splice(i, 1);
            }
        }
    }

    window.triggers = new Triggers;

    triggers.newTrigger(/似乎以下地方藏有宝物(.*)/, function(m) {
        m = m[1].split(/\d+/);
        var bl_found = false;
        for (i = 0, l = m.length; i < l; i++) {
            var a = m[i];
            console.log(a);
            if (/一片翠绿的草地/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/大诗人白居易之墓，墓碑上刻着“唐少傅白公墓”。四周环绕着冬青。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正站在雪亭镇南边的一家小客栈里，这家客栈虽小，却是方圆五百里/.test(a)) {
                jh('xt');
                go('dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇镇前广场的空地，地上整齐地铺著大石板。广场中央有一个木头搭的架子，经过多年的风吹日晒雨淋，看来非常破旧。四周建筑林立。往西你可以看到一间客栈，看来生意似乎很好。/.test(a)) {
                jh('xt');
                go('e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间十分老旧的城隍庙，在你面前的神桌上供奉著一尊红脸的城隍，庙虽老旧，但是神案四周已被香火薰成乌黑的颜色，显示这里必定相当受到信徒的敬仰。/.test(a)) {
                jh('xt');
                go('e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条普通的黄土小径，弯弯曲曲往东北一路盘旋上山，北边有一间城隍庙，往西则是雪亭镇的街道。/.test(a)) {
                jh('xt');
                go('e;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条普通的黄土小径，小径往西南通往一处山间的平地，从这里可以望见不少房屋错落在平地上，往东北则一路上山。/.test(a)) {
                jh('xt');
                go('e;e;s;ne;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条说宽不宽，说窄倒也不窄的山路，路面用几块生满青苔的大石铺成，西面是一段坡地，从这里可以望见西边有几间房屋错落在林木间，东面则是山壁，山路往西南衔接一条黄土小径，往北则是通往山上的石阶。/.test(a)) {
                jh('xt');
                go('e;e;s;ne;ne;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的街口，往北是一个热闹的广场，南边是条小路通往一座林子，东边则有一条小径沿著山腰通往山上，往西是一条比较窄的街道，参差不齐的瓦屋之间传来几声犬吠。从这里向东南走就是进出关的驿道了。/.test(a)) {
                jh('xt');
                go('e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的街道，你的北边有一家客栈，从这里就可以听到客栈里人们饮酒谈笑/.test(a)) {
                jh('xt');
                go('e;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间宽敞的书院，虽然房子看起来很老旧了，但是打扫得很整洁，墙壁上挂著一幅山水画，意境颇为不俗，书院的大门开在北边，西边有一扇木门通往边厢。/.test(a)) {
                jh('xt');
                go('e;s;w;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条宽敞坚实的青石板铺成的大道，路上车马的痕迹已经在路面上留下一条条明显的凹痕，往东是一条较小的街道通往雪亭镇。/.test(a)) {
                jh('xt');
                go('e;s;w;w;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正走在雪亭镇的街道上，东边不远处有一间高大的院子，门口立著一根粗大的旗杆/.test(a)) {
                jh('xt');
                go('e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间素来以公平信用著称的钱庄，钱庄的老板还是个曾经中过举人的读书人/.test(a)) {
                jh('xt');
                go('e;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正站在一间大宅院的入口，两只巨大的石狮镇守在大门的两侧，一阵阵吆喝与刀剑碰撞的声音从院子中传来，通过大门往东可以望见许多身穿灰衣的汉子正在操练。/.test(a)) {
                jh('xt');
                go('e;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正站在一个宽敞的教练场中，地上铺著黄色的细砂，许多人正在这里努力地操练著，北边是一间高大的兵器厅，往东则是武馆师父们休息的大厅。/.test(a)) {
                jh('xt');
                go('e;n;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间堆满各式兵器、刀械的储藏室，各式武器都依照种类、长短、依次放在一起，并且擦拭得一尘不染，储藏室的出口在你的南边，面对出口的左手边有一个架子/.test(a)) {
                jh('xt');
                go('e;n;e;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是淳风武馆的正厅，五张太师椅一字排开面对著门口，这是武馆中四位大师傅与馆主柳淳风的座位/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是淳风武馆中的天井，往西走可以回到正厅/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间整理得相当乾净的书房，红木桌椅上铺著蓝绸巾，显得十分考究，西面的立著一个书架，上面放著一排排的古书，往南走出房门可以看到天井。/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间布置得相当雅致的厢房，从窗子可以看到北边的天井跟南边的庭园中各式各样的奇花异草，以及他们所带来的淡淡香气，厢房的东面墙上还挂著一幅仕女图/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这里是淳风武馆的内院，平常武馆弟子没有馆主的允许是不敢到这里来的/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正走在雪亭镇的大街，往南直走不远处是镇上的广场，在你的东边是一间大宅院/.test(a)) {
                jh('xt');
                go('e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间打铁铺子，从火炉中冒出的火光将墙壁映得通红，屋子的角/.test(a)) {
                jh('xt');
                go('e;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的大街，东边有一栋陈旧的建□，看起来像是什麽店铺，但是并没有任何招牌，只有一扇门上面写著一个大大的/.test(a)) {
                jh('xt');
                go('e;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一家中等规模的当铺，老旧的柜台上放著一张木牌/.test(a)) {
                jh('xt');
                go('e;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是丰登当铺的储藏室，有时候当铺里的大朝奉会把铺里存不下的死当货物拿出来拍卖/.test(a)) {
                jh('xt');
                go('e;n;n;n;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的大街，一条小巷子通往东边，西边则是一间驿站/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是负责雪亭镇官府文书跟军令往来的雪亭驿/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/一间小木屋，在这北方的风中吱吱作响。/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一处山坳，往南就是雪亭镇，一条蜿蜒的小径往东通往另一个邻近的小山村/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里便是有名的龙门石窟，石窟造像，密布于两岸的崖壁上。远远可以望见琵琶峰上的白冢。/.test(a)) {
                jh('ly');
                go('dig go');
                bl_found = true;
                break;
            }
            if (/城南官道，道路两旁是一片树林，远处是一片片的农田了。田地里传来农人的呼号，几头黄牛悠闲的趴卧着。/.test(a)) {
                jh('ly');
                go('n;dig go');
                bl_found = true;
                break;
            }
            if (/由此洛阳城南门出去，就可以通往南市的龙门石窟。城门处往来客商络绎不绝，几名守城官兵正在检查过往行人。/.test(a)) {
                jh('ly');
                go('n;n;dig go');
                bl_found = true;
                break;
            }
            if (/洛阳最繁华的街市，这里聚集着各国客商。/.test(a)) {
                jh('ly');
                go('n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里便是洛水渡口静静的洛水由此向东，汇入滚滚黄河。码头上正泊着一艘船坞，常常的缆绳垂在水中。/.test(a)) {
                jh('ly');
                go('n;n;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/一艘普通的船坞，船头坐着一位蓑衣男子。/.test(a)) {
                jh('ly');
                go('n;n;e;s;luoyang317_op1;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是洛阳的南面了，街上有好几个乞丐在行乞。/.test(a)) {
                jh('ly');
                go('n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是一座供奉洛神的小庙。小庙的地上放着几个蒲团。/.test(a)) {
                jh('ly');
                go('n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这儿就是洛阳金刀世家了。金刀门虽然武功不算高，但也是有两下子的。/.test(a)) {
                jh('ly');
                go('n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/金刀世家的练武场。金刀门的门主王天霸在这儿教众弟子习武。/.test(a)) {
                jh('ly');
                go('n;n;n;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是洛神庙下面的地道，上面人走动的声音都隐约可听见。/.test(a)) {
                jh('ly');
                go('n;n;n;w;putuan;dig go');
                bl_found = true;
                break;
            }
            if (/湿润的青石路显然是刚刚下过雨，因为来往行人过多，路面多少有些坑坑凹凹，一不留神很容易被绊到。/.test(a)) {
                jh('ly');
                go('n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这儿就是菜市口。各种小贩商人十分嘈杂，而一些地痞流氓也混迹人群伺机作案。/.test(a)) {
                jh('ly');
                go('n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/一个猪肉摊，在这儿摆摊卖肉已经十多年了。/.test(a)) {
                jh('ly');
                go('n;n;n;n;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/你刚踏进巷子，便听得琴韵丁冬，小巷的宁静和外面喧嚣宛如两个世界/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/小院四周满是盛开的桃花，穿过一条长廊，一座别致的绣楼就在眼前了。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;s;dig go');
                bl_found = true;
                break;
            }
            if (/绣楼内挂着湖绿色帐幔，一名女子斜靠在窗前的美人榻上。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里就是背阴巷了，站在巷口可以万剑阴暗潮湿的窄巷，这里聚集着洛阳的地痞流氓，寻常人不敢近前。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;event_1_98995501;dig go');
                bl_found = true;
                break;
            }
            if (/黑暗的街道，几个地痞无赖正慵懒的躺在一旁。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;event_1_98995501;n;dig go;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一家酒肆，洛阳地痞头目甄大海正坐在里面小酌。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;event_1_98995501;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/院落里杂草丛生，东面的葡萄架早已枯萎。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;event_1_98995501;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/一座跨街大青砖砌的拱洞高台谯楼，矗立在城中心。鼓楼为二层木瓦建筑，设有大鼓大钟，晨钟暮鼓，用以报时。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/相传春秋时代，楚王在此仰望周王城，问鼎重几何。周室暗弱，居然隐忍不发。这便是街名的由来。银钩赌坊也在这条街上。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里便是洛阳有名的悦来客栈，只见客栈大门处人来人往，看来生意很红火。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/客栈大院，院内紫藤花架下放着几张桌椅，东面是一座马厩。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/客栈马倌正在往马槽里添草料，旁边草料堆看起来有些奇怪。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/房间布置的极为雅致，没有太多的装饰，唯有屋角放着一个牡丹屏风。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/赌坊二楼走廊，两旁房间里不时床来莺声燕语，看来这里不止可以赌。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通往赌坊二楼的楼梯，上面铺着大红色地毯。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/大厅满是呼庐喝雉声、骰子落碗声、银钱敲击声，男人和女人的笑声，/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/走出赌坊后门，桂花清香扑面而来，桂花树下的水缸似乎被人移动过。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/赌坊门口人马喧哗，门上一支银钩在风中摇晃，不知道多少人咬上了这没有鱼饵的钩/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;dig go');
                bl_found = true;
                break;
            }
            if (/自古以来，洛阳墨客骚人云集，因此有“诗都”之称，牡丹香气四溢，又有“花都”的美誉/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;s;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是牡丹园内的一座小亭子，布置得十分雅致。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;s;luoyang111_op1;dig go');
                bl_found = true;
                break;
            }
            if (/也许由于连年的战乱，使得本来很热闹的街市冷冷清清，道路两旁的店铺早已破旧不堪，一眼望去便知道有很久没有人居住了。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这间当铺处于闹市，位置极好。当铺老板正半眯着双眼在高高的柜台上打盹。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/你无意中走进一条青石街，这里不同于北大街的繁华热闹，两边是一些小店铺，北面有一家酒肆，里面出入的人看起来衣衫褴褛。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间小酒肆，里面黑暗潮湿，满是油垢的桌旁，几名无赖正百无聊赖的就着一盘花生米喝酒。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是洛阳北边街道，人群熙熙攘攘甚是热闹。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/洛阳城的钱庄，来往的商客往往都会将银两存于此处。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/就是洛阳北门，门口站着的是守城官兵。站在城楼望出去，外面是一片茅草路。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/城北通往邙山的小路，路旁草丛中时有小兽出没。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/一片绿云般的竹林隔绝了喧嚣尘世，步入这里，心不由平静了下来。青石小路在竹林中蜿蜒穿行，竹林深处隐约可见一座小院。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/绿竹环绕的小院，院内几间房舍都用竹子打造，与周围竹林颇为和谐。这小院的主人显然有些独特之处。院内一名老翁正在劈柴。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/一间雅致的书斋，透过窗户可以见到青翠修竹，四周如此清幽，竹叶上露珠滴落的声音都能听见。靠墙的书架看起来很别致。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/ 就是洛阳城墙上的城楼，驻守的官兵通常会在这儿歇个脚，或是聊下天。如果心细之人，能看到角落里似乎有一个隐秘的把手。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/ 这个城楼上的密室显然是守城军士秘密建造的，却不知有何用途。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;w;luoyang14_op1;dig go');
                bl_found = true;
                break;
            }
            if (/这就是洛阳城的城墙。洛阳是重镇，因此城墙上驻守的官兵格外多。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/由于连年的战乱，整条金谷街的不少铺子已经荒废掉了。再往东走就是洛阳地痞流氓聚集的背阴巷。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是洛阳首富的庄院，据说家财万贯，富可敌国。庄院的的中间有一棵参天大树。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是富人家的储藏室，因此有不少奇珍异宝。仔细一看，竟然还有一个红光满面的老人家半躺在角落里。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;n;op1;dig go');
                bl_found = true;
                break;
            }
            if (/一座朴实的石拱桥，清澈河水从桥下流过。对面可见一座水榭。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/荷池旁的水榭，几名游客正在里面小憩。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/回廊两旁便是碧绿荷塘，阵阵荷香拂过。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/荷塘中的观景台，两名女子在这里游玩。远远站着几名护卫，闲杂人等一律被挡在外面。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/隐藏在一片苍翠树林中的小路，小路尽头有座草屋。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/简陋的茅草小屋，屋内陈设极其简单。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/石阶两侧山泉叮咚，林木森森。漫步而上，可见山腰有亭。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这就是听伊亭，据说白居易曾与好友在此品茗、论诗。一旁的松树上似乎有什么东西。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/丛林小径，因为走得人少，小径已被杂草覆盖。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/听着松涛之音，犹如直面大海/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是华山村村口，几个草垛随意的堆放在路边，三两个泼皮慵懒躺在那里。/.test(a)) {
                jh('hsc');
                go('dig go');
                bl_found = true;
                break;
            }
            if (/这是一条穿过村口松树林的小路。/.test(a)) {
                jh('hsc');
                go('n;dig go');
                bl_found = true;
                break;
            }
            if (/这就是有名的神女冢，墓碑前散落着游人墨客烧的纸钱，前面不远处有一间破败的土地庙。/.test(a)) {
                jh('hsc');
                go('n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一片溪边的杏树林，一群孩童在此玩耍。/.test(a)) {
                jh('hsc');
                go('w;dig go');
                bl_found = true;
                break;
            }
            if (/村口一个简易茶棚，放着几张木质桌椅，干净齐整，过往路人会在这里喝杯热茶歇歇脚，村里的王老二常常会混在这里小偷小摸。/.test(a)) {
                jh('hsc');
                go('w;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间破败的土地庙门口，门旁的对联已经模糊不清，隐约只见上联“德之不修/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;dig go');
                bl_found = true;
                break;
            }
            if (/土地庙庙堂，正中供奉着土地，香案上堆积这厚厚的灰尘。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;dig go');
                bl_found = true;
                break;
            }
            if (/隐藏在佛像后的地道入口，两只黑狗正虎视眈眈的立在那里。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通往西侧的通道，前面被铁栅栏挡住了。/.test(a)) {
                jh('hsc');
                bl_found = true;
                go('w;event_1_59520311;n;n;w;dig go');
                break;
            }
            if (/通往地下通道的木楼梯/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通道两侧点着油灯，昏暗的灯光让人看不清楚周围的环境。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通往东侧的通道，前面传来有水声和痛苦的呻吟。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一件宽敞的大厅，正中间摆着一张太师椅，两侧放着一排椅子。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一件布置极为简单的卧房，显然只是偶尔有人在此小憩。床上躺着一名半裸女子，满脸惊恐。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条古老的青石街，几个泼皮在街上游荡。/.test(a)) {
                jh('hsc');
                go('s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条碎石小路，前面有一个打铁铺。/.test(a)) {
                jh('hsc');
                go('s;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间打铁铺，炉火烧的正旺，一名汉子赤膊挥舞着巨锤，锤落之处但见火花四溅。/.test(a)) {
                jh('hsc');
                go('s;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/一棵千年银杏树屹立在广场中央，树下有一口古井，据说这口古井的水清澈甘甜，村里的人每天都会来这里挑水。/.test(a)) {
                jh('hsc');
                go('s;s;dig go');
                bl_found = true;
                break;
            }
            if (/村里的杂货铺，店老板正在清点货品。/.test(a)) {
                jh('hsc');
                go('s;s;e;dig go');
                bl_found = true;
                break;
            }
            if (/杂货铺后院，堆放着一些杂物，东边角落里放着一个马车车厢，一个跛脚汉子坐在一旁假寐。/.test(a)) {
                jh('hsc');
                go('s;s;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一个普通的马车车厢，粗布帘挡住了马车车窗和车门，地板上面躺着一个人。/.test(a)) {
                jh('hsc');
                go('s;s;e;s;huashancun24_op2;dig go');
                bl_found = true;
                break;
            }
            if (/这是村内宗祠大门，门口一棵古槐，树干低垂。/.test(a)) {
                jh('hsc');
                go('s;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/宗祠的大厅，这里供奉着宗室先祖。/.test(a)) {
                jh('hsc');
                go('s;s;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/青石板铺就的小桥，几棵野草从石缝中钻出，清澈的溪水自桥下湍湍流过。/.test(a)) {
                jh('hsc');
                go('s;s;s;dig go');
                bl_found = true;
                break;
            }
            if (/田间泥泞的小路，一个稻草人孤单的立在一旁，似乎在指着某个地方。一个男子神色慌张的从一旁田地里钻出。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间竹篱围城的小院，院内种着几株桃花，屋后竹林环绕，颇为雅致。旁边的西厢房上挂着一把铜制大锁，看起来有些奇怪。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/这是小院的厅堂，迎面墙壁上挂着一幅山水画，看来小院的主人不是普通农人。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间普通的厢房，四周窗户被布帘遮得严严实实。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;w;get_silver;dig go');
                bl_found = true;
                break;
            }
            if (/一条杂草丛生的乡间小路，时有毒蛇出没。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;dig go');
                bl_found = true;
                break;
            }
            if (/一间看起来有些破败的小茅屋，屋内角落里堆着一堆稻草，只见稻草堆悉悉索索响了一阵，竟然从里面钻出一个人来。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;e;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨山脚，站在此处可以摇摇望见四面悬崖的清风寨。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;dig go');
                bl_found = true;
                break;
            }
            if (/通往清风寨唯一的山路，一侧便是万丈深渊。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;dig go');
                bl_found = true;
                break;
            }
            if (/两扇包铁木门将清风寨与外界隔绝开来，门上写着“清风寨”三字。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里就是桃花泉，一片桃林环绕着清澈泉水，据说泉水一年四季不会枯竭。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨前院，地面由坚硬岩石铺就。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨练武场，四周放置着兵器架。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨议事厅，正中放置着一张虎皮椅。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是清风寨后院，远角有一颗大树，树旁有一扇小门。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里就是清风寨兵器库了，里面放着各色兵器。角落里一个上锁的黑铁箱不知道装着什么。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里的空气中充满清甜的味道，地上堆积着已经晒干的柿子。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是清风寨寨主的卧房，床头挂着一把大刀。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是通往二楼大厅的楼梯，楼梯扶手上的雕花精美绝伦，看来这酒楼老板并不是一般的生意人/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/二楼是雅座，文人学士经常在这里吟诗作画，富商土豪也在这里边吃喝边作交易。/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/进门绕过一道淡绿绸屏风，迎面墙上挂着一副『芙蓉出水』图。厅内陈列奢华，雕花楠/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/进门绕过一道淡黄绸屏风，迎面墙上挂着一副『芍药』图，鲜嫩欲滴/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/进门绕过一道淡红绸屏风，迎面墙上挂着一副『牡丹争艳』图，牡丹素以富贵著称。图侧对联：“幽径天姿呈独秀，古园国色冠群芳”。/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/你站在观景台上眺望，扬州城的美景尽收眼底。东面是就是小秦淮河岸，河岸杨柳轻拂水面，几簇粉色桃花点缀其间。/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;n;n;dig go');
                bl_found = true;
                break;
            }

        }
        if (bl_found) go("cangbaotu_op1");
//      window.setTimeout('go("cangbaotu_op1")', 3000);
    }, "", "cbt");



    window.game = this;

    window.attach = function() {
        var oldWriteToScreen = window.writeToScreen;
        window.writeToScreen = function(a, e, f, g) {
            oldWriteToScreen(a, e, f, g);
            a = a.replace(/<[^>]*>/g, "");
            triggers.trigger(a);
        };

        webSocketMsg.prototype.old = gSocketMsg.dispatchMessage;

        gSocketMsg.dispatchMessage = function(b) {
            this.old(b);
            qlMon.dispatchMessage(b);
            question.dispatchMessage(b);
        }
    };
    attach();

})(window);
// 掃蕩 ------------------------------------------------------------------------------------------------------
var saoDangButton = document.createElement('button');
wantNum = '3500';
saoDangButton.innerText = '掃蕩';
saoDangButton.style.position = 'absolute';
saoDangButton.style.right = '0px';
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
    clickButton('baguamen_saodang', 0); //八掛
	clickButton('binhaigucheng_saodang', 0); //濱海
	clickButton('daojiangu_saodang', 0);
	clickButton('fengduguicheng_saodang', 0); //鬼城
	clickButton('nanmanzhidi_saodang', 0);//蠻王

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
// 每日 ------------------------------------------------------------------------------------------------------
var daButton = document.createElement('button');
daButton.innerText = '每日';
daButtonIntervalFunc = null;
daButton.style.position = 'absolute';
daButton.style.right = '0px';
daButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
daButton.style.width = buttonWidth;
daButton.style.height = buttonHeight;
var daButtonFunc = null;
document.body.appendChild(daButton);
daButton.addEventListener('click', goda);

function goda() {
	if (daButton.innerText == '大招寺') {
	//陰山
	console.log("前往陰山！");
	clickButton('jh 26');       // 進入章節//洛陽;
	clickButton('go west');
	clickButton('go west');
	clickButton('go north');
	clickButton('go west');
	clickButton('go west');
	clickButton('go west');
	clickButton('go north');
	clickButton('go north');
	daButtonIntervalFunc = setInterval(runwolf, 800);
	daButton.innerText = '停大招';
	}
	else {
	clearInterval(daButtonIntervalFunc);
	daButton.innerText = '大招寺';
	clearTimeout(runwolf);
	clearTimeout(runwolf1);
	}
}

function runwolf() {

		if ($('.cmd_click3:first').text() == '參習岩畫'){
		clickButton('event_1_12853448')
		//clickButton('home')
		daButton.innerText = '停大招';
		clearInterval(daButtonIntervalFunc);
		daButton.innerText = '大招寺';
		clearTimeout(runwolf);
		clearTimeout(runwolf1);
		clickButton('home')
		}

		else {
		runwolf1();
		clickButton('jh 26');       // 進入章節//洛陽;
		clickButton('go west');
		clickButton('go west');
		clickButton('go north');
		clickButton('go west');
		clickButton('go west');
		clickButton('go west');
		clickButton('go north');
		clickButton('go north');
		clickButton(runwolf, 300);
		}

	}

function runwolf1() {
		ninesword();
		clickButton('escape', 0);
		clickButton('escape', 0);
		clickButton('escape', 0);
		clickButton('escape', 0);
		clickButton('escape', 0);
		clickButton('escape', 0);
}
// 每日 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(CheckInButton);
var bookButton = document.createElement('button');
bookButton.innerText = '看書';
bookButton.style.position = 'absolute';
bookButton.style.right = '0px';
bookButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
bookButton.style.width = buttonWidth;
bookButton.style.height = buttonHeight;
document.body.appendChild(bookButton);
bookButton.addEventListener('click', book)
function book(){
	clickButton('go east'); 			//英雄牌坊
 	clickButton('go northeast'); 		//青石大道
 	clickButton('go northeast');		//煙雨亭
 	clickButton('go northeast');		//青石大道
 	clickButton('go east');				//青石大道
 	clickButton('go east');				//比武廣場
 	clickButton('go east');				//大廳
 	clickButton('event_1_9179222', 0);             //進入側廳
 	clickButton('go east');                         //書房
 	clickButton('event_1_11720543', 0) 	        //觀閱
	clickButton('go west');				//側廳
	clickButton('go north');			//大廳
 	clickButton('go east');				//內廳
 	clickButton('go east');				//後山花園
 	clickButton('go south');			//花園小路
 	clickButton('go east');				//瀑布
	setTimeout(startFall, 300);

}

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
// 準備茅山 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(CheckInButton);
var llolButton = document.createElement('button');
llolButton.innerText = '茅山天師';
llolButton.style.position = 'absolute';
llolButton.style.right = '0px';
llolButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
llolButton.style.width = buttonWidth;
llolButton.style.height = buttonHeight;
document.body.appendChild(llolButton);
llolButton.addEventListener('click', llol)
var direction=["west","east","south","north","southwest","southeast","northeast","northwest"];
function llol(){
    clickButton('enableskill enable force necromancy', 1);
    clickButton('enableskill enable necromancy attack_select', 1);
	clickButton('enableskill enable force bahuang-gong', 1);
	clickButton('enableskill enable parry tao-mieshen-sword', 1);
	clickButton('enableskill enable tao-mieshen-sword attack_select', 1);
	clickButton('enableskill enable parry liumai-shenjian', 1);
}
// 取消茅山 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(CheckInButton);
var lollButton = document.createElement('button');
lollButton.innerText = '取消茅山天師';
lollButton.style.position = 'absolute';
lollButton.style.right = '0px';
lollButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
lollButton.style.width = buttonWidth;
lollButton.style.height = buttonHeight;
document.body.appendChild(lollButton);
lollButton.addEventListener('click', loll)
var direction=["west","east","south","north","southwest","southeast","northeast","northwest"];
function loll(){
    clickButton('enableskill enable force necromancy', 1);
    clickButton('enableskill enable necromancy no_attack_select', 1)
	clickButton('enableskill enable force bahuang-gong', 1);
	clickButton('enableskill enable parry tao-mieshen-sword', 1);
	clickButton('enableskill enable tao-mieshen-sword none', 1);
	clickButton('enableskill enable parry liumai-shenjian', 1);
}
// 答題 ------------------------------------------------------------------------------------------------------
var answerQuestions2Button = document.createElement('button');
answerQuestions2Button.innerText = '開答題';
answerQuestions2Button.style.position = 'absolute';
answerQuestions2Button.style.right = '0px';
answerQuestions2Button.style.top =currentPos +  'px';
currentPos = currentPos + delta;
answerQuestions2Button.style.width = buttonWidth;
answerQuestions2Button.style.height = buttonHeight;
document.body.appendChild(answerQuestions2Button);
answerQuestions2Button.addEventListener('click', answerQuestionsFunc);
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
	"黑水伏蛟可以在哪位npc那里获得？":"c",
    "银项链可以在哪位npc那里获得？":"b",
    "杨过小龙女分开多少年后重逢?":"c",
    "白金项链可以在哪位npc那里获得？":"b"
}
function answerQuestionsFunc(){
	if(answerQuestions2Button.innerText == "開答題"){
		console.log("准備自動答題！");
		answerQuestionsInterval = setInterval(answerQuestions, 1000);
		answerQuestions2Button.innerText = "停答題";
	}else{
		console.log("停止自動答題！");
		answerQuestions2Button.innerText = "開答題";
		clearInterval(answerQuestionsInterval);
	}
}

function answerQuestions(){
	if($('span:contains(每日武林知識問答次數已經)').text().slice(-46) == "每日武林知識問答次數已經達到限額，請明天再來。每日武林知識問答次數已經達到限額，請明天再來。") {
		// 今天答題結束了
		console.log("完成自動答題！");
		answerQuestions2Button.innerText = "開答題";
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
//屍體摸摸-------------------------------------------------------------------
//---------------------------------------------------------
var qiangButton = document.createElement('button');
qiangButton.innerText = '摸屍體';
qiangButton.style.position = 'absolute';
qiangButton.style.right = '0px';
qiangButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
qiangButton.style.width = buttonWidth;
qiangButton.style.height = buttonHeight;
document.body.appendChild(qiangButton);
qiangButton.addEventListener('click', qiangFunc);
var qiangTrigger=0;
function qiangFunc(){
    if (qiangTrigger==0){
		qiangButton.innerText = '停摸屍';
		qiangTrigger=1;
		qiangCorpse();
	}else if (qiangTrigger==1){
		qiangButton.innerText = '摸屍體';
		qiangTrigger=0;
	}
}
setTimeout(function(){
            qiangCorpse();
		$('div#out2 span.out2:contains(每5秒隻能搜索1次)').remove();
		$('div#out2 span.out2:contains(不是你殺的，還剩)').remove();
        },200);

function qiangCorpse(){
	if (qiangTrigger==1){
		var Objectlist=g_obj_map.get("msg_room").elements;
		for (var i=0;i<Objectlist.length;i++){
			if (Objectlist[i].key.indexOf("item")>=0&&Objectlist[i].value.indexOf("屍體")>=0){
				clickButton('get '+Objectlist[i].value.split(',')[0], 1);
			}
		}
		setTimeout(function(){qiangCorpse();},200);
	}
}
//var qiangdipiButton = document.createElement('button');
//qiangdipiButton.innerText = '搜查';
//qiangdipiButton.style.position = 'absolute';
//qiangdipiButton.style.right = '0px';
//qiangdipiButton.style.top =currentPos +  'px';
//currentPos = currentPos + delta;
//qiangdipiButton.style.width = buttonWidth;
//qiangdipiButton.style.height = buttonHeight;
//document.body.appendChild(qiangdipiButton);
//qiangdipiButton.addEventListener('click', qiangdipiFunc);
var qiangdipiTrigger=0;
function qiangdipiFunc(){
    if (qiangdipiTrigger==0){
		qiangdipiButton.innerText = '停搜查';
		qiangdipiTrigger=1;
		qiangItem();
	}else if (qiangdipiTrigger==1){
		qiangdipiButton.innerText = '搜查';
		qiangdipiTrigger=0;
	}
}
function qiangItem(){
	if (qiangdipiTrigger==1){
		var Objectlist=g_obj_map.get("msg_room").elements;
		for (var i=0;i<Objectlist.length;i++){
			if (Objectlist[i].key.indexOf("item")>=0){
				clickButton('get '+Objectlist[i].value.split(',')[0], 1);
			}
		}
		setTimeout(function(){qiangItem();},200);
	}
}

//切小號（切之前請提前切一次，小號不要點取消或接受點下觀察即可）--------------------------------
var BiShi2Button = document.createElement('button');
BiShi2Button.innerText = '切小號';
BiShi2Button.style.position = 'absolute';
BiShi2Button.style.right = '0px';
BiShi2Button.style.top = currentPos + 'px';
currentPos = currentPos + delta;
BiShi2Button.style.width = buttonWidth;
BiShi2Button.style.height = buttonHeight;
document.body.appendChild(BiShi2Button);
BiShi2Button.addEventListener('click', BiShi2Func)
function BiShi2Func(){
    if(BiShi2Button.innerText  == '切小號'){
        var Swordsman2_targetName = prompt("請輸入小號名","魔鬼步伐");
        fightSwordsman2Func();
        BiShi2Button.innerText  = '停切磋';}
    else{clearKill2();
         {BiShi2Button.innerText  = '切小號';}
        }

    function fightSwordsman2Func(){

        // 間隔500毫秒查找比試一次
        fightSwordsmanInterval2Func = setInterval(fightSwordsman2,500);
    }

    function clearKill2(){
        clearInterval(fightSwordsmanInterval2Func);
    }

    function fightSwordsman2(){
        // 尋找指定名稱的小號並開始比試
        $("button.cmd_click3").each(
            function(){
                if(isContains($(this).html() , Swordsman2_targetName))
                    eval($(this).attr("onclick").replace("score","fight"));
            });

        // 戰鬥結束自動退出戰鬥介面
        if($('span.outbig_text:contains(戰鬥結束)').length>0){
            clickButton('prev_combat');
            }
        if (isContains($('span:contains(道：)').text().slice(-8),'應當會有發現……')){
    		//fightSwordsmanIntervalFunc = setInterval(fightSwordsman,500);
    	    clearInterval(fightSwordsmanInterval2Func);
	        BiShi2Button.innerText  = '切小號';
    	  }
    	//fightSwordsmanFunc();
    }
}
// 比试奇侠 ------------------------------------------------------------------------------------------------------

var killManButton = document.createElement('button');
killManButton.innerText = '比試奇侠';
killManButton.style.position = 'absolute';
killManButton.style.right = '0px';
killManButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
killManButton.style.width = buttonWidth;
killManButton.style.height = buttonHeight;
document.body.appendChild(killManButton);
killManButton.addEventListener('click', killManFunc);


var killManButton2 = document.createElement('button');
killManButton2.innerText = '停止奇俠';
killManButton2.style.position = 'absolute';
killManButton2.style.right = '0px';
killManButton2.style.top = currentPos + 'px';
currentPos = currentPos + delta;
killManButton2.style.width = buttonWidth;
killManButton2.style.height = buttonHeight;
document.body.appendChild(killManButton2);
killManButton2.addEventListener('click', clearKill);

var killDrunkIntervalFunc =  null;
// var DrunkMan_targetName = prompt("請直接輸入要親密的奇俠名","例:千門火");
function killManFunc(){
	if (!(DrunkMan_targetName = prompt("請直接輸入要親密的奇俠名","例:千門火"))){
		        return;
		    }
    	killManIntervalFunc = setInterval(killMan,500);
}

function clearKill(){
    clearInterval(killManIntervalFunc);
}

function isContains(str, substr) {
    return str.indexOf(substr) >= 0;
}
function killMan(){
	$("button.cmd_click3").each(
	function(){
	if(isContains($(this).html(),DrunkMan_targetName))
		eval($(this).attr("onclick").replace("look_npc","fight"));
	})
        if($('span:contains("戰敗了")').text().slice(-6)=='戰敗了...'){
            clickButton('prev_combat');
        }
clickButton('cancel_prompt', 0);
clickButton('golook_room');
}

// 試劍----------------------------
var ShiJianButton = document.createElement('button');
ShiJianButton.innerText = '試劍';
ShiJianButton.style.position = 'absolute';
ShiJianButton.style.right = '0px';
ShiJianButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
ShiJianButton.style.width = buttonWidth;
ShiJianButton.style.height = buttonHeight;
document.body.appendChild(ShiJianButton);
ShiJianButton.addEventListener('click', ShiJianFunc);

function ShiJianFunc(){
    if(ShiJianButton.innerText  == '試劍'){
        clickButton('swords');
        clickButton('swords select_member xiaoyao_tonglao');   //天山童姥
        clickButton('swords select_member xiaoyao_xiaoyaozi');  //逍遙祖師
        clickButton('swords select_member mingjiao_zhang');   //張教主
        clickButton('swords fight_test go');
        AutoShiJianFunc();
        ShiJiaButton.innerText  = '停止試劍';
    }
    else{clearShiJian();
         ShiJianButton.innerText  = '試劍';
        }
}
function AutoShiJianFunc(){
    // 間隔5000毫秒查找打一次
    AutoShiJianFuncIntervalFunc = setInterval(AutoShijian1,5000);
}
function clearShiJian(){
    clearInterval(AutoShiJianFuncIntervalFunc);
}
function AutoShijian1(){
    if($('span.outbig_text:contains(戰鬥結束)').length>0){
        clickButton('swords fight_test go');
    }
    else if( isContains($('span:contains(你今天)').text().slice(-12), '你今天試劍次數已達限額。')){
        ShiJianButton.innerText  = '試劍';
        clearShiJian();
        setTimeout(function(){clickButton('home')},1000);
        console.log('打完收工！');
    }
    else{
         ninesword();
        }
}
//---------------------鍵盤
document.onkeydown = function (event)
    {
        var e = event || window.event || arguments.callee.caller.arguments[0];
		if (e && e.keyCode == 53)
        { // 按 1
            clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
            clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
            clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
			clickButton('escape', 0);
        }
		if (e && e.keyCode == 54)
        { // 按 1
            clickButton('items use snow_qiannianlingzhi');
            clickButton('items use snow_qiannianlingzhi');
            clickButton('items use snow_qiannianlingzhi');
            clickButton('items use snow_qiannianlingzhi');
            clickButton('items use snow_qiannianlingzhi');
        }
		if (e && e.keyCode == 49)
        { // 按 1
            clickButton('playskill 1');
        }
		if (e && e.keyCode == 50)
        { // 按 2
            clickButton('playskill 2');
        }
		if (e && e.keyCode == 51)
        { // 按 3
            clickButton('playskill 3');
        }
		if (e && e.keyCode == 52)
        { // 按 4
            clickButton('playskill 4');
        }
        if (e && e.keyCode == 97)
        { // 按 1
            clickButton('go southwest');
        }
        if (e && e.keyCode == 98)
        { // 按 2
            clickButton('go south');
        }
        if (e && e.keyCode == 99)
        { // 3
            clickButton('go southeast');
        }
        if (e && e.keyCode == 100)
        { // 4
            clickButton('go west');
        }
        if (e && e.keyCode == 101)
        { // 5
            overrideclick('home');
        }
        if (e && e.keyCode == 102)
        { // 6
            clickButton('go east');
        }
        if (e && e.keyCode == 103)
        { // 7
            clickButton('go northwest');
        }
        if (e && e.keyCode == 104)
        { // 8
            clickButton('go north');
        }
        if (e && e.keyCode == 105)
        { // 9
            clickButton('go northeast');
        }

};
//----------------------------收缩弹出框模块------------------------------------------------------------------------
var popList = {};
function createPop(a) {
    var b = document.createElement('div');
    b.style.position = 'absolute';
    b.style.top = '0';
    b.style.width = '100%';
    b.style.height = '100%';
    b.style.zIndex = '100';
    b.style.display = 'none';
    document.body.appendChild(b);
    var c = document.createElement('div');
    c.style.position = 'absolute';
    c.style.top = '0';
    c.style.width = '100%';
    c.style.height = '100%';
    b.appendChild(c);
    c.addEventListener('click', closepop);

    function closepop() {
        b.style.display = 'none'
    }
    popList[a] = document.createElement('div');
    var d = popList[a];
    d.style.position = 'absolute';
    d.style.top = '100px';
    d.style.left = '50%';
    d.style.width = '265px';
    d.style.padding = '10px 5px 10px 0px';
    d.style.marginLeft = '-132px';
    d.style.background = '#f0f0f0';
    d.style.textAlign = 'center';
    d.style.border = '2px solid #ccc';
    b.appendChild(d);
    return b
}
//---------------------去秘境---------------------
var soButton = document.createElement('button');
soButton.innerText = '去秘境';
soButton.style.position = 'absolute';
soButton.style.right = '0px';
soButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
soButton.style.width = buttonWidth;
soButton.style.height = buttonHeight;
document.body.appendChild(soButton);
soButton.addEventListener('click', qmjfunc);

var qmjname = '';
// soButton('去秘境', qmjfunc);
var qmj_popbk = createPop('去秘境');
popList['去秘境'].innerHTML = '<div>請選擇你要去的地方吧</div>';

function qmj_addbtns() {
    var a = ['山坳', '石街','桃花泉', '潭畔草地', '長空棧道','臨淵石台', '千尺幢', '玉女峰', '猢猻愁', '沙丘小洞', '九老洞', '懸根松', '夕陽嶺', '青雲坪', '湖邊','玉壁瀑布','碧水寒潭','懸崖','寒水潭','戈壁','盧崖瀑布','啟母石','無極老姆洞','山溪畔','奇槐坡','小洞天','天梯','雲步橋','觀景台','危崖前','無名山峽谷','天策','賭場','每日','杭界山','朱果','風泉','殺孽龍','殺盾陣','峨眉','恆山'];
    var b = [];
    for (var i = 0; i < a.length; i++) {
        b[i] = document.createElement('button');
        b[i].style.padding = '0';
        b[i].style.margin = '5px 0 0 5px';
        b[i].style.width = '60px';
        b[i].style.height = '20px';
        b[i].innerHTML = a[i];
        popList['去秘境'].appendChild(b[i]);
        b[i].onclick = function (i) {
            qmj_popbk.style.display = 'none';
            qmjname = this.innerHTML;
			if(qmjname=="山坳"){sa();}
			if(qmjname=="石街"){sj();}
			if(qmjname=="桃花泉"){thq();}
			if(qmjname=="潭畔草地"){tpcd();}
			if(qmjname=="長空棧道"){ckzd();}
			if(qmjname=="臨淵石台"){lyst();}
			if(qmjname=="千尺幢"){qct();}
			if(qmjname=="玉女峰"){ynf();}
			if(qmjname=="猢猻愁"){hsc();}
			if(qmjname=="沙丘小洞"){sqxd();}
			if(qmjname=="九老洞"){jld();}
			if(qmjname=="懸根松"){xgs();}
			if(qmjname=="夕陽嶺"){xyl();}
			if(qmjname=="青雲坪"){qyp();}
			if(qmjname=="湖邊"){hb();}
			if(qmjname=="玉壁瀑布"){ybpb();}
			if(qmjname=="碧水寒潭"){bsht();}
			if(qmjname=="懸崖"){xy();}
			if(qmjname=="寒水潭"){hst();}
			if(qmjname=="戈壁"){gb();}
			if(qmjname=="盧崖瀑布"){lypb();}
			if(qmjname=="啟母石"){qms();}
			if(qmjname=="無極老姆洞"){wjlmd();}
			if(qmjname=="山溪畔"){sxp();}
			if(qmjname=="奇槐坡"){qhp();}
			if(qmjname=="小洞天"){xdt();}
			if(qmjname=="天梯"){tt();}
			if(qmjname=="雲步橋"){ybq();}
			if(qmjname=="觀景台"){gjt();}
			if(qmjname=="危崖前"){wyq();}
			if(qmjname=="無名山峽谷"){wmsxg();}
			if(qmjname=="天策"){tin();}
			if(qmjname=="賭場"){money();}
			if(qmjname=="每日"){por();}
            if(qmjname=="杭界山"){wop();}
			if(qmjname=="朱果"){wooo();}
			if(qmjname=="風泉"){jianjian();}
			if(qmjname=="殺孽龍"){wwoww();}
			if(qmjname=="殺盾陣"){abc1();};
			if(qmjname=="峨眉"){abc2();};
			if(qmjname=="恆山"){abc3();};
            soButton.innerText = '去秘境'
        }
    }
}
qmj_addbtns();

function qmjfunc() {
    if (soButton.innerText == '去秘境') {
        qmj_popbk.style.display = ""
    } else {
        soButton.innerText = '去秘境'
    }
}


			if(qmjname=="千尺幢"){qct();}
			if(qmjname=="玉女峰"){ynf();}
			if(qmjname=="猢猻愁"){hsc();}
			if(qmjname=="沙丘小洞"){sqxd();}
			if(qmjname=="九老洞"){jld();}
			if(qmjname=="懸根松"){xgs();}
			if(qmjname=="夕陽嶺"){xyl();}
			if(qmjname=="青雲坪"){qyp();}
			if(qmjname=="湖邊"){hb();}
			if(qmjname=="玉壁瀑布"){ybpb();}
			if(qmjname=="碧水寒潭"){bsht();}
			if(qmjname=="懸崖"){xy();}
			if(qmjname=="寒水潭"){hst();}
			if(qmjname=="戈壁"){gb();}
			if(qmjname=="盧崖瀑布"){lypb();}
			if(qmjname=="啟母石"){qms();}
			if(qmjname=="無極老姆洞"){wjlmd();}
			if(qmjname=="山溪畔"){sxp();}
			if(qmjname=="奇槐坡"){qhp();}
			if(qmjname=="小洞天"){xdt();}
			if(qmjname=="天梯"){tt();}
			if(qmjname=="雲步橋"){ybq();}
			if(qmjname=="觀景台"){gjt();}
			if(qmjname=="危崖前"){wyq();}
			if(qmjname=="無名山峽谷"){wmsxg();}
			if(qmjname=="天策"){tin();}
			if(qmjname=="賭場"){money();}
			if(qmjname=="每日"){por();}
            if(qmjname=="杭界山"){wop();}
			if(qmjname=="朱果"){wooo();}
            if(qmjname=="風泉"){jianjian();}
            if(qmjname=="殺孽龍"){wwoww();}
            if(qmjname=="殺盾陣"){abc1();};
			if(qmjname=="峨眉"){abc2();};
			if(qmjname=="恆山"){abc3();};
function sa(){//山坳
    go("jh 1;e;n;n;n;n;n;find_task_road secret");
       }
function sj(){//石街
    go("jh 2;n;n;n;n;w;event_1_98995501;n;find_task_road secret");
       }
function thq(){//桃花泉
go("jh 3;s;s;s;s;s;nw;n;n;e;find_task_road secret");
}
function tpcd(){// 潭畔草地
    go("jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s;find_task_road secret");
}
function lyst(){// 臨淵石台
    go("jh 4;n;n;n;n;n;n;n;n;n;e;n;find_task_road secret");
}
function ckzd(){// 長空棧道
    go("jh 4;n;n;n;n;n;n;n;n;n;e;find_task_road secret");
}
function qct(){// 千尺幢
    go("jh 4;n;n;n;n;find_task_road secret");
}
function ynf(){// 玉女峰
    go("jh 4;n;n;n;n;n;n;n;n;w;find_task_road secret");
}
function hsc(){// 猢猻愁
    go("jh 4;n;n;n;n;n;n;e;n;n;find_task_road secret");
}
function sqxd(){// 沙丘小洞
    go("jh 6;event_1_98623439;ne;n;ne;ne;ne;event_1_97428251;find_task_road secret");
}
function jld(){//九老洞
 if ($('.cmd_click_room')[0] === undefined || $('.cmd_click_room')[0].innerText !== "山門廣場"){
        alert("請位於 #山門廣場# 位置再點 #九老洞# 按鈕！");
        return;
}
    go("n;n;n;w;n;n;n;n;n;n;n;n;n;nw;sw;w;nw;w;find_task_road secret");
}
function xgs(){// 懸根松
    go("jh 9;n;w;find_task_road secret");
}
function xyl(){// 夕陽嶺
    go("jh 9;n;n;e;find_task_road secret");
}
function qyp(){// 青雲坪
    go("jh 13;e;s;s;w;w;find_task_road secret");
}

function hb(){// 湖邊
    go("jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;find_task_road secret");
}
function ybpb(){// 玉壁瀑布
    go("jh 16;s;s;s;s;e;n;e;find_task_road secret");
}
function bsht(){// 碧水寒潭
    go("jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;se;se;e;find_task_road secret");
}
function xy(){// 懸崖
    go("jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;e;find_task_road secret");
}
function hst(){// 寒水潭
    go("jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;e;se;find_task_road secret");
}
function gb(){// 戈壁
    go("jh 21;find_task_road secret");
}
function lypb(){// 盧涯瀑布
    go("jh 22;n;n;n;n;e;n;find_task_road secret");
}
function qms(){// 啟母石
    go("jh 22;n;n;w;w;find_task_road secret");
}
function wjlmd(){// 無極老姆洞
    go("jh 22;n;n;w;n;n;n;n;find_task_road secret");
}
function sxp(){// 山溪畔
    go("jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s;find_task_road secret");
}
function qhp(){// 奇槐坡
    go("jh 23;n;n;n;n;n;n;n;n;find_task_road secret");
}
function tt(){// 天梯
    go("jh 24;n;n;n;find_task_road secret");
}
function xdt(){// 小洞天
    go("jh 24;n;n;n;n;e;e;;find_task_road secret");
}
function ybq(){// 雲步橋
    go("jh 24;n;n;n;n;n;n;n;n;n;find_task_road secret");
}
function gjt(){// 觀景台
    go("jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;find_task_road secret");
}
function wyq(){// 危崖前
    go("jh 25;w;find_task_road secret");
}
function wmsxg(){// 無名山峽谷
    go("jh 29;n;n;n;n;event_1_60035830;find_task_road secret");
}
function tin(){// 天策
    go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n");
}
function money(){//賭場
go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;touzi;");
}
function por(){//每日
go("jh 26;w;w;n;n;event_1_14435995");
go("jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911");
go("jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home");
go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n;n;w;event_1_31320275;home");
go("jh 26;w;w;n;e;e;event_1_18075497");
}
function wop(){//杭界山
    go("jh 2;n;n;e;s;luoyang317_op1;go_hjs");
}
function wooo(){//朱果
    alert("蠻王3897鬼城3898亂石山2354龍淵刀樓1539桃花渡1789綠水山1259戈壁綠洲2039帝龍陵2389佛門石窟2429大福船3094天龍山3104八卦門3649濱海古城3399");
}
function jianjian(){// 劍
		    go("jh 7;s;s;s;s;s;s;s;s;e;n;e;s;e;kill scholar_master");
			ninesword();ninesword();ninesword();ninesword();
			setTimeout(qiangFunc,500);
			clearTimeout(qiangFunc,1500);
		}
function wwoww(){//殺孽龍
    go("jh 15;n;nw;w;nw;n;event_1_14401179");
}
function abc1(){//殺盾陣
    go("jh 21;n;n;n;n;w");
}
function abc2(){//峨眉
    go("jh 8;ne;e;e;e;n");
}
function abc3(){//恆山
    go("jh 9;event_1_20960851");
}
//彈出視窗_1------------------------------------------------------------------------
		var popList1 = {};
		function createPop1(aa) {
		    var bb = document.createElement('div');
		    bb.style.position = 'absolute';
		    bb.style.top = '0';
		    bb.style.width = '100%';
		    bb.style.height = '100%';
		    bb.style.zIndex = '100';
		    bb.style.display = 'none';
		    document.body.appendChild(bb);
		    var cc = document.createElement('div');
		    cc.style.position = 'absolute';
		    cc.style.top = '0';
		    cc.style.width = '100%';
		    cc.style.height = '100%';
		    bb.appendChild(cc);
		    cc.addEventListener('click', closepop1);

		    function closepop1() {
		        bb.style.display = 'none'
		    }
		    popList1[aa] = document.createElement('div');
		    var dd = popList1[aa];
		    dd.style.position = 'absolute';
		    dd.style.top = '100px';
		    dd.style.left = '50%';
		    dd.style.width = '265px';
		    dd.style.padding = '10px 5px 10px 0px';
		    dd.style.marginLeft = '-132px';
		    dd.style.background = '#f0f0f0';
		    dd.style.textAlign = 'center';
		    dd.style.border = '2px solid #ccc';
		    bb.appendChild(dd);
		    return bb
		}


// 外傳1 ------------------------------------------------------------------------------------------------------
		var bijingButton = document.createElement('button');
		bijingButton.innerText = '外傳1';
		bijingButton.style.position = 'absolute';
		bijingButton.style.right = '0px';
		bijingButton.style.top =currentPos +  'px';
		currentPos = currentPos + delta;
		bijingButton.style.width = buttonWidth;
		bijingButton.style.height = buttonHeight;
		document.body.appendChild(bijingButton);
		bijingButton.addEventListener('click', qmjfunc1);


		// var bijingButton = document.createElement('button');
		// bijingButton.innerText = '外傳1';
		// bijingButton.style.position = 'absolute';
		// bijingButton.style.right = '0px';
		// bijingButton.style.top =currentPos +  'px';
		// currentPos = currentPos + delta;
		// bijingButton.style.width = buttonWidth;
		// bijingButton.style.height = buttonHeight;
		// document.body.appendChild(bijingButton);
		// bijingButton.addEventListener('click', qmjfunc1);

		var qmjname1 = '';
		// createButton2('去秘境', qmjfunc);
		var qmj_popbk1 = createPop1('外傳1');
		popList1['外傳1'].innerHTML = '<div>請選擇你要去的地方吧</div>';

		function qmj_addbtns1() {
		    if (bijingButton.innerText == '外傳1'){
			    var aa = ['獨龍寨','筱西風','楊掌櫃','耶律夷烈', '丐幫莫不收','花不為','水煙閣司事','魔教','坐竹籃','楊延慶','刀妖','杭界山','高一毅','孽龍','水煙無名洞','冉無望','慕容博','苟書癡','斷劍坐船','斷劍背刀人','桃花','戚總兵','伊那','長生堂','大理武將','陰陽居士','長生堂','石公子','泰山掌門','馮太監','謝煙客','酒店老闆','劉守才','殺排雲','矮老者','玄甲衛士','紅衣少女','突厥大將','葛倫','哥舒翰','歐陽敏','衛青','李四','霍去病','李元帥','喬陰縣武官','血手天魔','傅介子','玉門關守將','拿叫化雞'];
			    var bb = [];
			    for (var i = 0; i < aa.length; i++) {
			        bb[i] = document.createElement('button');
			        bb[i].style.padding = '0';
			        bb[i].style.margin = '5px 0 0 5px';
			        bb[i].style.width = '60px';
			        bb[i].style.height = '20px';
			        bb[i].innerHTML = aa[i];
			        popList1['外傳1'].appendChild(bb[i]);
			        bb[i].onclick = function (i) {
			            qmj_popbk1.style.display = 'none';
			            qmjname1 = this.innerHTML;

				if(qmjname1=="獨龍寨"){d1();}
				if(qmjname1=="筱西風"){d2();}
				if(qmjname1=="楊掌櫃"){d3();}
				if(qmjname1=="耶律夷烈"){d4();}
				if(qmjname1=="丐幫莫不收"){d5();}
				if(qmjname1=="花不為"){d6();}
				if(qmjname1=="水煙閣司事"){d7();}
				if(qmjname1=="魔教"){d8();}
				if(qmjname1=="坐竹籃"){d9();}
				if(qmjname1=="楊延慶"){d10();}
				if(qmjname1=="刀妖"){d11();}
				if(qmjname1=="杭界山"){d12();}
				if(qmjname1=="高一毅"){d13();}
				if(qmjname1=="孽龍"){d14();}
				if(qmjname1=="水煙無名洞"){d15();}
				if(qmjname1=="冉無望"){d16();}
				if(qmjname1=="慕容博"){d17();}
				if(qmjname1=="苟書癡"){d18();}
				if(qmjname1=="斷劍坐船"){d19();}
				if(qmjname1=="斷劍背刀人"){d20();}
				if(qmjname1=="桃花"){d21();}
				if(qmjname1=="戚總兵"){d22();}
				if(qmjname1=="伊那"){d23();}
				if(qmjname1=="長生堂"){d24();}
				if(qmjname1=="大理武將"){d25();}
				if(qmjname1=="陰陽居士"){d26();}
				if(qmjname1=="長生堂"){d27();}
				if(qmjname1=="石公子"){d28();}
				if(qmjname1=="泰山掌門"){d29();}
				if(qmjname1=="馮太監"){d30();}
				if(qmjname1=="謝煙客"){d31();}
				if(qmjname1=="酒店老闆"){d32();}
				if(qmjname1=="劉守才"){d33();}
				if(qmjname1=="殺排雲"){d34();}
				if(qmjname1=="矮老者"){d35();}
				if(qmjname1=="玄甲衛士"){d36();}
				if(qmjname1=="紅衣少女"){d37();}
				if(qmjname1=="突厥大將"){d38();}
				if(qmjname1=="葛倫"){d39();}
				if(qmjname1=="哥舒翰"){d40();}
				if(qmjname1=="歐陽敏"){d41();}
				if(qmjname1=="衛青"){d42();}
				if(qmjname1=="李四"){d43();}
				if(qmjname1=="霍去病"){d44();}
				if(qmjname1=="李元帥"){d45();}
				if(qmjname1=="喬陰縣武官"){d46();}
				if(qmjname1=="血手天魔"){d47();}
				if(qmjname1=="傅介子"){d48();}
				if(qmjname1=="玉門關守將"){d49();}
				if(qmjname1=="拿叫化雞"){d50();}
			            bijingButton.innerText = '外傳1';
			        }
			    }
			}else if (bijingButton.innerText != '外傳1'){
				// da();
				// clearInterval(daButtonIntervalFunc);
				// bijingButton.innerText = '外傳1';
				// clearTimeout(runwolf);
				// clearTimeout(runwolf1);
			}
		}
		qmj_addbtns1();

		function qmjfunc1() {
		    if (bijingButton.innerText == '外傳1') {
		        qmj_popbk1.style.display = ""
		    } else {
		    	qmj_addbtns1();
		        bijingButton.innerText = '外傳1';

		    }
		}
				if(qmjname1=="獨龍寨"){d1();}
				if(qmjname1=="筱西風"){d2();}
				if(qmjname1=="楊掌櫃"){d3();}
				if(qmjname1=="耶律夷烈"){d4();}
				if(qmjname1=="丐幫莫不收"){d5();}
				if(qmjname1=="花不為"){d6();}
				if(qmjname1=="水煙閣司事"){d7();}
				if(qmjname1=="魔教"){d8();}
				if(qmjname1=="坐竹籃"){d9();}
				if(qmjname1=="楊延慶"){d10();}
				if(qmjname1=="刀妖"){d11();}
				if(qmjname1=="杭界山"){d12();}
				if(qmjname1=="高一毅"){d13();}
				if(qmjname1=="孽龍"){d14();}
				if(qmjname1=="水煙無名洞"){d15();}
				if(qmjname1=="冉無望"){d16();}
				if(qmjname1=="慕容博"){d17();}
				if(qmjname1=="苟書癡"){d18();}
				if(qmjname1=="斷劍坐船"){d19();}
				if(qmjname1=="斷劍背刀人"){d20();}
				if(qmjname1=="桃花"){d21();}
				if(qmjname1=="戚總兵"){d22();}
				if(qmjname1=="伊那"){d23();}
				if(qmjname1=="長生堂"){d24();}
				if(qmjname1=="大理武將"){d25();}
				if(qmjname1=="陰陽居士"){d26();}
				if(qmjname1=="長生堂"){d27();}
				if(qmjname1=="石公子"){d28();}
				if(qmjname1=="泰山掌門"){d29();}
				if(qmjname1=="馮太監"){d30();}
				if(qmjname1=="謝煙客"){d31();}
				if(qmjname1=="酒店老闆"){d32();}
				if(qmjname1=="劉守才"){d33();}
				if(qmjname1=="殺排雲"){d34();}
				if(qmjname1=="矮老者"){d35();}
				if(qmjname1=="玄甲衛士"){d36();}
				if(qmjname1=="紅衣少女"){d37();}
				if(qmjname1=="突厥大將"){d38();}
				if(qmjname1=="葛倫"){d39();}
				if(qmjname1=="哥舒翰"){d40();}
				if(qmjname1=="歐陽敏"){d41();}
				if(qmjname1=="衛青"){d42();}
				if(qmjname1=="李四"){d43();}
				if(qmjname1=="霍去病"){d44();}
				if(qmjname1=="李元帥"){d45();}
				if(qmjname1=="喬陰縣武官"){d46();}
				if(qmjname1=="血手天魔"){d47();}
				if(qmjname1=="傅介子"){d48();}
				if(qmjname1=="玉門關守將"){d49();}
				if(qmjname1=="拿叫化雞"){d50();}





		function d1(){//獨龍寨
             go("fb 1");
		}
		function d2(){//筱西風
		     go("jh 23;n;n;e;event_1_81080785");
		}
		function d3(){//楊掌櫃
			go("jh 1;e;n;n;n;w");
		}
		function d4(){//耶律夷烈
			go("jh 17;sw;s;sw;nw;ne;event_1_38940168");
		}
		function d5(){//丐幫莫不收
			go("jh 6;clickButton('event_1_98623439', 0);ne;ne");
		}
		function d6(){//花不為
			go("jh 1;e;n;n;n;n;e");
		}
		function d7(){// 水煙閣司事
		    go("jh 12;n;n;n;w;n;nw;e");
		}
		function d8(){// 魔教
		    alert("請手動坐船到達目的在坐竹籃");
			go("jh 27;ne;nw;w;nw;w;w");
		}
		function d9(){// 坐竹籃
		    alert("請手動坐船到達目地在按楊延慶");
			go("w;ne;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;");
		}
		function d10(){//楊延慶
		    go("n;n;n;n;n;n;n;n;n;n;n;e;e");
		}
		function d11(){// 刀妖
		    go("jh 28;n;w;w;w;se");
		}
		function d12(){// 杭界山
		    go("jh 2;n;n;w;s;luoyang317_op1;go_hjs");
        }
		function d13(){// 高一毅
		    go("jh 14;e");
        }
        function d14(){// 孽龍
		    go("jh 15;n;nw;w;nw;n;event_1_14401179");
        }
		function d15(){// 水煙無名洞
		    go("jh 12;n;e;event_1_66940918");
        }
		function d16(){// 冉無望
		    go("jh 27;n;ne");
		}
		function d17(){// 慕容博
		    go("jh 32;n;n;se;n;n;n;n;w;w;w;w;n;event_1_72278818;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;w");
		}
		function d18(){// 苟書癡
		    go("jh 16;s;s;s;s;e;e;e;e;s;w;w;w");
		}
		function d19(){// 斷劍坐船
		    alert("請手動坐船在按斷劍背刀人");
			go("jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n");
		}
		function d20(){// 斷劍背刀人
		    go("n;n;n;e;e");
		}
		function d21(){// 桃花
		    alert("請手動坐船在按戚總兵");
			go("jh 30");
		}
		function d22(){// 戚總兵
		    go("w;n;e");
		}
		function d23(){// 伊那
		    go("jh 15;s;s;s;s;s;e");
		}
		function d24(){// 長生堂
		    go("clickButton('fb 5', 0)");
		}
		function d25(){// 大理武將
		    go("jh 33;sw;sw;s;s");
		}
		function d26(){// 陰陽居士
		    go("jh 29;n;n;n;n;event_1_60035830;e");
		}
		function d27(){// 長生堂
		    go("fb 5");
		}
		function d28(){// 石公子
		    alert("請手動坐船在按");
			go("e;ne;ne;ne;e;n");
		}
		function d29(){// 泰山掌門
		    go("jh 29;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n");
		}
		function d30(){// 馮太監
		    go("jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;n;n");
		}
		function d31(){// 謝煙客
		    alert("請手動坐船在按");
			go("e;ne;ne;ne;e;e;e;e;e;e;n;e;e;ne");
		}
		function d32(){// 酒店老闆
			go("jh 15;s;s;w;n");
		}
		function d33(){// 劉守才
			go("jh 2;n;n;n;n;n;n;n;e");
		}
		function d34(){// 殺排雲
		    go("clickButton('fb 4', 0)");
		}
		function d35(){// 謝煙客
		    alert("請手動坐船在按");
			go("e;ne;ne;ne;e;e;e;e;e;e;n;n;n;e;ne;nw");
		}
		function d36(){// 玄甲衛士
		    go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n");
		}
		function d37(){// 紅衣少女
		    go("jh 26;e;e");
		}
		function d38(){//突厥大將
            go("jh 26;w;w;n;n;event_1_14435995;");
        }
		function d39(){//葛倫
		    alert("對話靈空，直到他說葛倫在禮佛裡面，點禮佛");
            go("jh 26;w;w;w;w;w;w;w;w;w");
        }
		function d40(){// 哥舒翰
		    go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;s;s;s;s;e");
		}
		function d41(){// 歐陽敏
		    go("jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;look_npc tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n");
		}
		function d42(){// 衛青
		    go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;s;s;w");
		}
		function d43(){// 李四
		    alert("請手動坐船在按");
			go("e;ne;ne;ne;e;e;n");
		}
		function d44(){// 霍去病
		    go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n");
		}
		function d45(){// 李元帥
		    go("jh 2;n;n;n;n;n;n;n;n;w;luoyang14_op1");
		}
        function d46(){// 喬陰縣武官
		    go("jh 7;s;s;s;s;s;s;e");
		}
        function d47(){// 血手天魔
		    go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w");
		}
		function d48(){// 傅介子
		    go("jh 21");
		}
		function d49(){// 玉門關守將
		    go("jh 21;n;n;n;n;e");
		}
		function d50(){// 拿叫化雞
		    go("jh 2;n;n;n;n;n;e;n;op1");
		}
		//彈出視窗_1------------------------------------------------------------------------
		var popList2 = {};
		function createPop2(aaa) {
		    var bbb = document.createElement('div');
		    bbb.style.position = 'absolute';
		    bbb.style.top = '0';
		    bbb.style.width = '100%';
		    bbb.style.height = '100%';
		    bbb.style.zIndex = '100';
		    bbb.style.display = 'none';
		    document.body.appendChild(bbb);
		    var ccc = document.createElement('div');
		    ccc.style.position = 'absolute';
		    ccc.style.top = '0';
		    ccc.style.width = '100%';
		    ccc.style.height = '100%';
		    bbb.appendChild(ccc);
		    ccc.addEventListener('click', closepop2);

		    function closepop2() {
		        bbb.style.display = 'none'
		    }
		    popList2[aaa] = document.createElement('div');
		    var ddd = popList2[aaa];
		    ddd.style.position = 'absolute';
		    ddd.style.top = '100px';
		    ddd.style.left = '50%';
		    ddd.style.width = '265px';
		    ddd.style.padding = '10px 5px 10px 0px';
		    ddd.style.marginLeft = '-132px';
		    ddd.style.background = '#f0f0f0';
		    ddd.style.textAlign = 'center';
		    ddd.style.border = '2px solid #ccc';
		    bbb.appendChild(ddd);
		    return bbb
		}
		// 小功能 ------------------------------------------------------------------------------------------------------
		var ssssButton = document.createElement('button');
		ssssButton.innerText = '小功能';
		ssssButton.style.position = 'absolute';
		ssssButton.style.right = '0px';
		ssssButton.style.top =currentPos +  'px';
		currentPos = currentPos + delta;
		ssssButton.style.width = buttonWidth;
		ssssButton.style.height = buttonHeight;
		document.body.appendChild(ssssButton);
		ssssButton.addEventListener('click', qmjfunc2);


		// var ssssButton = document.createElement('button');
		// ssssButton.innerText = '小功能';
		// ssssButton.style.position = 'absolute';
		// ssssButton.style.right = '0px';
		// ssssButton.style.top =currentPos +  'px';
		// currentPos = currentPos + delta;
		// ssssButton.style.width = buttonWidth;
		// ssssButton.style.height = buttonHeight;
		// document.body.appendChild(ssssButton);
		// ssssButton.addEventListener('click', qmjfunc1);

		var qmjname2 = '';
		// createButton2('去秘境', qmjfunc);
		var qmj_popbk2 = createPop2('小功能');
		popList2['小功能'].innerHTML = '<div>請選擇你要用的功能</div>';

		function qmj_addbtns2() {
		    if (ssssButton.innerText == '小功能'){
				    var aaa = ['悟性裝','寶箱3000','通靈','上香','打鳥','冰月谷','突破丹禮包','狂暴丹','掌門手諭','投資','煉藥','拼圖','簽到','禦寒衣','刻刀'];
			    var bbb = [];
			    for (var i = 0; i < aaa.length; i++) {
			        bbb[i] = document.createElement('button');
			        bbb[i].style.padding = '0';
			        bbb[i].style.margin = '5px 0 0 5px';
			        bbb[i].style.width = '60px';
			        bbb[i].style.height = '20px';
			        bbb[i].innerHTML = aaa[i];
			        popList2['小功能'].appendChild(bbb[i]);
			        bbb[i].onclick = function (i) {
			            qmj_popbk2.style.display = 'none';
			            qmjname2 = this.innerHTML;

				if(qmjname2=="悟性裝"){s1();}
				if(qmjname2=="寶箱3000"){s2();}
				if(qmjname2=="通靈"){s3();}
				if(qmjname2=="上香"){s4();}
				if(qmjname2=="打鳥"){s5();}
				if(qmjname2=="冰月谷"){s7();}
				if(qmjname2=="突破丹禮包"){s8();}
				if(qmjname2=="狂暴丹"){q1();}
				if(qmjname2=="掌門手諭"){q2();}
				if(qmjname2=="投資"){q3();}
				if(qmjname2=='煉藥'){liandrugFirstFunc();}
				if(qmjname2=='拼圖'){q4();}
				if(qmjname2=='簽到'){q5();}
				if(qmjname2=='禦寒衣'){q6();}
				if(qmjname2=='刻刀'){q7();}






			            ssssButton.innerText = '小功能';
			        }
			    }
			}else if (ssssButton.innerText != '小功能'){
				// da();
				// clearInterval(daButtonIntervalFunc);
				// ssssButton.innerText = '小功能';
				// clearTimeout(runwolf);
				// clearTimeout(runwolf1);
			}
		}
		qmj_addbtns2();

		function qmjfunc2() {
		    if (ssssButton.innerText == '小功能') {
		        qmj_popbk2.style.display = ""
		    } else {
		    	qmj_addbtns2();
		        ssssButton.innerText = '小功能';

		    }
		}
				if(qmjname2=="悟性裝"){s1();}
				if(qmjname2=="寶箱3000"){s2();}
				if(qmjname2=="通靈"){s3();}
				if(qmjname2=="上香"){s4();}
				if(qmjname2=="打鳥"){s5();}
				if(qmjname2=="冰月谷"){s7();}
				if(qmjname2=="突破丹禮包"){s8();}
				if(qmjname2=="狂暴丹"){q1();}
				if(qmjname2=="掌門手諭"){q2();}
				if(qmjname2=="投資"){q3();}
				if(qmjname2=='煉藥'){liandrugFirstFunc();}
				if(qmjname2=='拼圖'){q4();}
				if(qmjname2=='簽到'){q5();}
				if(qmjname2=='禦寒衣'){q6();}
				if(qmjname2=='刻刀'){q7();}






		function s1(){//悟性裝
            go("wield sword of windspring;wear dream hat;wear longyuan banzhi moke");
  }
       function s2(){//寶箱3000
            go("items use baiyin box_N_3000");
  }
       function s3(){//通靈
            go("jh 7;s;s;s;s;s;s;s;sw;w;look_npc choyin_crone");
  }
	   function s4(){//上香
			for (var i=0; i<20; i++)
  {
			clickButton('clan incense yx');
  }
}
        function s5(){// 打鳥
		    go("jh 28;n;w;w;w;w;w;w;nw;ne;nw;ne;nw;ne;e");
}
		function s7(){// 冰月谷
		    go("jh 14;w;n;n;n;n;event_1_32682066");
}
        function s8(){// 突破丹禮包
		    go("items use tupodan_libao");
}
        function q1(){// 狂暴丹
		    go("jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;event_1_56989555");
}
        function q2(){// 比試童佬
		    go("jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;e;n;event_1_88625473;event_1_56989555;event_1_82116250;event_1_90680562;event_1_38586637;fight xiaoyao_tonglao");
}
        function q3(){// 投資
		    go("jh 2;n;n;n;n;n;n;n;e;tzjh_lq");
}
        		        		 function liandrugFirstFunc(){
                    if(ssssButton.innerText == '小功能'){
                        // killrun();
                        MiaoJiangFunc();
                        // killrunInterval = setInterval(killrun,400);
                        // liandrugInterval = setInterval(liandrugSecondFunc,6000);
                        ssssButton.innerText = '停小功能';
                    }
                    else{
                        // clearInterval(liandrugInterval);
                        // clearInterval(killrunInterval);
                        clearTimeout(liandrugSecondFunc);
                        ssssButton.innerText = '小功能';
                    }
                }
				                function MiaoJiangFunc(){
                    clickButton('home');
                    clickButton('shop money_buy shop9_N_10');clickButton('shop money_buy shop9');
                    clickButton('shop money_buy shop9');clickButton('shop money_buy shop9');
                    clickButton('shop money_buy shop9');clickButton('shop money_buy shop9');
                    clickButton('shop money_buy shop10_N_10');clickButton('shop money_buy shop10');
                    clickButton('shop money_buy shop10');clickButton('shop money_buy shop10');
                    clickButton('shop money_buy shop10');clickButton('shop money_buy shop10');
                    go('jh 40;s;s;s;s;e;s;se;sw;s;sw;e;e;sw;sw;se;event_1_8004914');
                    setTimeout(CaoDiFunc,500);
                  }

                function MiaoJiang1Func(){
                    clickButton('home');
                    go('jh 40;s;s;s;s;e;s;se;sw;s;sw;e;e;sw;se;sw;se;event_1_8004914;CaoDiFunc')
                    setTimeout(CaoDiFunc,500);
                    //alert($('.cmd_click_room')[0].innerText);
                  }

                   function CaoDiFunc(){
                   if ($('.cmd_click_room')[0].innerText == "瀾滄江南岸"){   // 找到草地
                       resYaoParas=0;
                       go('se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w');
                        setTimeout(LianYaoIt,400);
                    }
                    else{
                        setTimeout(MiaoJiang1Func,500);   // 2秒后重新检查出路
                    }
                  }
                  function LianYaoIt(){
                    resYaoParas = resYaoParas+1;
                    if ( isContains($('span:contains(煉藥需要毒琥珀和毒藤膠，你還沒有)').text().slice(-17), '需要毒琥珀和毒藤膠，你還沒有藥材。'))
                    {alert('毒藤膠或毒藤膠不足，停止煉藥！');
                     console.log('沒有工具！煉藥次數：%d次。',resYaoParas);}
                    else if( isContains($('span:contains(煉藥的丹爐已經是滾得發燙)').text().slice(-6), '明天再來吧！')){
                        console.log('煉完了！煉藥次數：%d次。',resYaoParas);
                        clickButton('home');
                        bijingButton.innerText = '任意門'
                    }
                    else{
                        clickButton('lianyao');
                        setTimeout(LianYaoIt, 500);
                        console.log($('span:contains(竟然)').text().slice(-9));}
                }

		function q4(){// 拼圖
		    go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;e;event_1_2215721");
		}
		function q5(){// 簽到
		    go('share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 6;share_ok 7');
		}
		function q6(){// 禦寒衣
		    go("jh 1;e;n;n;w;event_1_24319712;home");
		}
		function q7(){// 刻刀
		    go("jh 1;e;n;n;w;event_1_73534133;home");
		}
// 朱果 -------------------------------------------------------------------------------------------------

	var zuButton = document.createElement('button');
	zuButton.innerText = '搜朱果';
	zuButton.style.position = 'absolute';
	zuButton.style.right = '0px';
	zuButton.style.top =currentPos +  'px';
	currentPos = currentPos + delta;
	zuButton.style.width = buttonWidth;
	zuButton.style.height = buttonHeight;
	document.body.appendChild(zuButton);
	zuButton.addEventListener('click', zuguo);

	function zuguo(){
		if (zuButton.innerText == '搜朱果'){
			setofzuguo();
			zuButton.innerText = '停朱果';
		}
		else {
			zuButton.innerText = '搜朱果';
		}
	}

	function setofzuguo(){
		zu8();
		setTimeout(s9,500);
		setTimeout(s9_1,500);
		setTimeout(s10,500);
		setTimeout(s11,500);
		setTimeout(s12,500);
		setTimeout(s13,500);
		setTimeout(s14,500);
		setTimeout(s15,500);
		setTimeout(s16,500);
		setTimeout(s17,500);
		setTimeout(s18,500);
		setTimeout(s19,500);
		setTimeout(s20,500);
		setTimeout(s21,500);
		setTimeout(s22,500);
		setTimeout(s23,500);
		setTimeout(s24,500);
		setTimeout(s25,500);
		setTimeout(s26,500);
		setTimeout(s27,500);
		setTimeout(s28,500);
	}

	function zu8(){// 探查此地
		go("jh 1;e;n;n;n;n;n;first_ask;home");
	}
	function s9(){// 探查此地
		go("jh 1;e;n;n;n;n;e;first_ask;home");
	}
	function s9_1(){// 探查此地
		go("jh 1;e;s;e;ne;first_ask;home");
	}
	function s10(){// 探查此地
		go("jh 2;n;n;n;n;w;s;w;first_ask;home");
	}
	function s11(){// 探查此地
		go("jh 3;n;first_ask;home");
	}
	function s12(){// 探查此地
		go("jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247;s;s;s;s;first_ask;home");
	}
	function s13(){// 探查此地
		go("jh 5;n;n;first_ask;home");
	}
	function s14(){// 探查此地
		go("jh 12;n;n;n;n;first_ask;home");
	}
	function s15(){// 探查此地
		go("jh 21;nw;ne;n;first_ask;home");
	}
	function s16(){// 探查此地
		go("jh 25;w;first_ask;home");
	}
	function s17(){// 探查此地
		go("jh 28;nw;e;first_ask;home");
	}
	function s18(){// 探查此地
		go("jh 33;sw;sw;s;s;s;s;first_ask;s;e;n;first_ask;se;w;first_ask;home");
	}
	function s19(){// 探查此地
		go("jh 33;sw;sw;s;s;s;nw;n;nw;n;first_ask;n;n;n;e;n;first_ask;home");
	}
	function s20(){// 探查此地
		go("jh 33;sw;sw;s;s;s;s;s;s;e;e;first_ask;w;n;first_ask;home");
	}
	function s21(){// 探查此地
		go("jh 33;sw;sw;s;s;s;s;s;s;s;s;w;n;first_ask;se;ne;first_ask;home");
	}
	function s22(){// 探查此地
		go("jh 33;sw;sw;s;s;s;s;s;s;s;s;s;e;ne;n;first_ask;w;n;n;first_ask;home");
	}
	function s23(){// 探查此地
		go("jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;e;e;se;e;e;se;e;e;first_ask;sw;first_ask;s;first_ask;home");
	}
	function s24(){// 探查此地
		go("jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;e;first_ask;w;sw;sw;n;first_ask;n;first_ask;s;s;first_ask;home");
	}
	function s25(){// 探查此地
		go("jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;first_ask;s;nw;w;s;first_ask;home");
	}
	function s26(){// 探查此地
		go("jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;w;s;first_ask;se;n;w;w;w;s;s;se;first_ask;e;first_ask;w;nw;n;n;n;w;se;first_ask;home");
	}
	function s27(){// 探查此地
		go("jh 10;w;n;n;w;w;w;n;n;n;first_ask;home");
	}
	function s28(){// 探查此地
		go("jh 11;e;e;s;sw;se;w;w;w;w;first_ask;home");
	}
//--------------破招
	var pozhaoInButton = document.createElement('button')
		pozhaoInButton.innerText = '破招'
		pozhaoInButton.style.position = 'absolute'
		pozhaoInButton.style.right = '0px'
		pozhaoInButton.style.top = currentPos + 'px'
		currentPos = currentPos + delta
		pozhaoInButton.style.width = buttonWidth
		pozhaoInButton.style.height = buttonHeight
		document.body.appendChild(pozhaoInButton)
		pozhaoInButton.addEventListener('click', CheckCeshi)
		var pozhapIntervalFunc1 = null

		function CheckCeshi () {
		  if (pozhaoInButton.innerText == '破招') {
		    pozhaoInButton.innerText = '停破招'
		    pozhapIntervalFunc1 = setInterval(killpozhao, 500)
		  }
		  else {
		    pozhaoInButton.innerText = '破招'
		    clearInterval(pozhapIntervalFunc1)
		  }
		}

		var zhaoshuLength = 0
		var dani = ['擊你','直飛向你的胸口','一式','面目','使出','揮舞','縱身躍起','腳下一轉','直取你', '卷你', '對著你', '朝你', '向你', '往你', '纏繞上了你', '撲你', '將你', '往而你掃蕩而去', '你的破綻', '你的對攻無法擊破', '你這一招並未奏效', '你一不留神，招式被', '斬你', '對准你', '從你眼前晃過', '手中', '躍向半空', '狂喝一聲', '突然轉身', '深吸一口氣', '猛然斷喝', '怒提內力', '縱空飛離', '取你', '誓要你', '你面對這一劍竟然無可奈何', '你只好放棄', '取你', '將招式連成一片，令你眼花繚亂！ ']
		function killpozhao () {
		  var result = document.getElementById('out').innerHTML
		  if (zhaoshuLength != result.length) {
		    var neirong = result.substr(zhaoshuLength, result.length).replace(/<[^>]*>|/g, '')
		    if (dani.filter(item => neirong.indexOf(item) > -1).length > 0) {
		      console.log(neirong)
		      console.log('破招')
		      ninesword();
		    }
		    zhaoshuLength = result.length
		  }
		  if (result.indexOf('戰鬥結束') > -1) {
		    pozhaoInButton.innerText = '破招'
		    clickButton('prev_combat')
		  }
        }
// 打排行榜----------------------------
                var PaiHangButton = document.createElement('button');
                PaiHangButton.innerText = '打排行榜';
                PaiHangButton.style.position = 'absolute';
                PaiHangButton.style.right = '0px';
                PaiHangButton.style.top =currentPos +  'px';
                currentPos = currentPos + delta;
                PaiHangButton.style.width = buttonWidth;
                PaiHangButton.style.height = buttonHeight;
                document.body.appendChild(PaiHangButton);
                PaiHangButton.addEventListener('click', PaiHangFunc);

                function PaiHangFunc(){
                    if(PaiHangButton.innerText  == '打排行榜'){
                        clickButton('sort');
                        clickButton('fight_hero 1');
                        AutoPaiHangFunc();
                        PaiHangButton.innerText  = '停止打榜';
                    }
                    else{clearPaiHang();
                         PaiHangButton.innerText  = '打排行榜';
                        }
                }
                function AutoPaiHangFunc(){
                    // 间隔1000毫秒查找打一次
                    AutoPaiHangFuncIntervalFunc = setInterval(AutoPaiHang,1000);
                }
                function clearPaiHang(){
                    clearInterval(AutoPaiHangFuncIntervalFunc);
                }
                function AutoPaiHang(){
                    if($('span.outbig_text:contains(戰鬥結束)').length>0){
                        clickButton('prev_combat');
                        clickButton('fight_hero 1');
                    }
                    else if( isContains($('span:contains(今日挑戰)').text().slice(-19), '今日挑戰高手的次數已達上限，明日再來。')){
                        clearPaiHang();
                        PaiHangButton.innerText  = '打排行榜';
                        clickButton('home');
                        console.log('打完收工！');
                    }
                    else{
                         ninesword();
                        }
                }
				//設id ----------------------------------------------------------------------------------------------------

                var idsetButton = document.createElement('button');
                idsetButton.innerText = '設id';
                idsetButton.style.position = 'absolute';
                idsetButton.style.right = '0px';
                idsetButton.style.top = currentPos + 'px';
                currentPos = currentPos + delta;
                idsetButton.style.width = buttonWidth;
                idsetButton.style.height = buttonHeight;
                document.body.appendChild(idsetButton);
                idsetButton.addEventListener('click', idset)

                var npcid='qingcheng_longshenzhiling';
                function idset(){
                    console.log(hidenpc)
                    npcid=prompt("請設定需要叫殺的npc的id",npcid);
                    console.log('當前設定的npcid為：'+npcid);
                }

//叫殺怪 ----------------------------------------------------------------------------------------------------
                var fastkillButton = document.createElement('button');
                fastkillButton.innerText = '叫殺怪';
                fastkillButton.style.position = 'absolute';
                fastkillButton.style.right = '0px';
                fastkillButton.style.top = currentPos + 'px';
                currentPos = currentPos + delta;
                fastkillButton.style.width = buttonWidth;
                fastkillButton.style.height = buttonHeight;
                document.body.appendChild(fastkillButton);
                fastkillButton.addEventListener('click', fastkill)

                var fastkillnpc="玄衣刺客",
                // fastkilldelay=1000,//延時3秒後叫殺
                hidenpc={//隱藏npc的id
                "神祕男子":'snow_shenminanzi',
                "歐陽敏化身":'tangmen_ouyangminhuashen',
                "龍神之靈":'qingcheng_longshenzhiling',
                "仇老板分身":'changan_choulaobanfenshen',
                "霍驃姚假身":'changan_huobiaoyaojiashen',
                "孔翎":'taishan_kongling',
                "天梵魔煞":'jueqinggu_tianfanmosha',
                "張矮子":'heimuya_zhangaizi',
                "天梵妖帝":'jueqinggu_tianfanyaodi',
                "天梵鬼王":'jueqinggu_tianfanguiwang',
                "古怪精靈":'changan_guguaijingling',
                "天梵殺手":'mingjiao_tianfanshashou',
                "千夜殺手":"resort_qianyeshashou",
                "天梁劍靈":'tangmen_tianliangjianling',
                "破軍劍靈":'tangmen_pojunjianling',
                "十方旗主":'latemoon_shifangqizhu',
                "獸蠻人":'latemoon_shoumanren',
                "百毒巫領":'latemoon_baiduwuling',
                "千夜長老":'latemoon_qianyezhanglao',
                "程不為":'taishan_chengbuwei'
                },
                hidenpc1=
                "神祕男子:snow_shenminanzi;歐陽敏化身:tangmen_ouyangminhuashen;龍神之靈:qingcheng_longshenzhiling;仇老板分身:changan_choulaobanfenshen;霍驃姚假身:changan_huobiaoyaojiashen;孔翎:taishan_kongling;天梵魔煞:jueqinggu_tianfanmosha;張矮子:heimuya_zhangaizi;天梵妖帝:jueqinggu_tianfanyaodi;天梵鬼王:jueqinggu_tianfanguiwang;古怪精靈:changan_guguaijingling;天梵殺手:mingjiao_tianfanshashou;天梁劍靈:tangmen_tianliangjianling;破軍劍靈:tangmen_pojunjianling;十方旗主:latemoon_shifangqizhu;獸蠻人:latemoon_shoumanren;百毒巫領:latemoon_baiduwuling;千夜長老:latemoon_qianyezhanglao;";
                //hidenpc[fastkillnpc]
                function fastkill(){
                    if (fastkillButton.innerText == '叫殺怪'){
                    //fastkillnpc=prompt("請輸入需要叫殺的隱藏npc名稱，並走到該npc對應的地圖（用此功能單獨叫殺外傳的隱藏npc，叫殺延時為3秒）",fastkillnpc);
                    //jiaoshaNPCList = [fastkillnpc];
                    currentNPCIndex = 0;
                    console.log("開始叫殺"+npcid);
                    fastkillButton.innerText ='停叫殺';
                    fastkill1();
                // killIntervalFunc = setInterval(fastkill1, fastkilldelay);
                    }
                    else{
                        console.log("停止攻擊目標npc!");
                        fastkillButton.innerText ='叫殺怪';
                        clearInterval(killIntervalFunc);
                    }
                }

                function fastkill1(){
                    clickButton("kill "+npcid);
                }


var autoBattleButton = document.createElement('button');
autoBattleButton.innerText = '自動絕學陣';
autoBattleButton.style.position = 'absolute';
autoBattleButton.style.right = '400px';
autoBattleButton.style.top = '200px';
document.body.appendChild(autoBattleButton);
autoBattleButton.addEventListener('click', autoBattleFunc);

function autoBattleFunc(){
    var playerName = sessionStorage.getItem("playerName");
    var playerMaxHp = sessionStorage.getItem("playerMaxHp");
    if(!playerName || !playerMaxHp){
        window.location.reload();
    }

    var skillstr = sessionStorage.getItem("skillstr");
    if(!skillstr){
        skillstr = prompt("請輸入要釋放的技能,以英文逗號分隔,前兩種武功為攻擊技能,第3個參數為釋放時需要的氣數,第4個參數為加血技能:","覆雨劍法,如來神掌,8,道種心魔經");
        sessionStorage.setItem("skillstr",skillstr);
    }

    if(autoBattleButton.innerText == '自動陣'){
        autoBattleButton.innerText = '停止陣';
        var autoBattleTimer = setInterval(function(){doAttack(skillstr,playerName,playerMaxHp)}, 1000);
        sessionStorage.setItem('autoBattleTimer',autoBattleTimer);
    }else{
        autoBattleButton.innerText = '自動陣';
        var autoBattleTimer = sessionStorage.getItem('autoBattleTimer');
        clearInterval(autoBattleTimer);
    }
}

function doAttack(skillstr,playerName,playerMaxHp){
    //下方
    var a11 = document.getElementById('vs11');
    var a12 = document.getElementById('vs12');
    var a13 = document.getElementById('vs13');
    var a14 = document.getElementById('vs14');
    if(a11 || a12 || a13 || a14){
        var skills = skillstr.split(",");
        var skillname1 = skills[0];
        var skillname2 = skills[1];
        var power = skills[2];
        var skillname3 = skills[3];

        var skillButtons = document.getElementById("page").getElementsByClassName('cmd_skill_button');
        var skill1;
        var skill2;
        var skill3;
        for(var i=0;i<skillButtons.length;i++){
            var onclickValue = skillButtons[i].getAttribute('onclick');
            var iStart = onclickValue.indexOf("clickButton('");
            var iEnd = onclickValue.indexOf("', 0)");

            if(skillButtons[i].textContent == skillname1){
                skill1 = onclickValue.substring(iStart+13,iEnd);
            }
            else if(skillButtons[i].textContent == skillname2){
                skill2 = onclickValue.substring(iStart+13,iEnd);
            }
            else if(skillButtons[i].textContent == skillname3){
                skill3 = onclickValue.substring(iStart+13,iEnd);
            }
        }

    	debugger
        var playerAndHp;
        if(a11 && a11.innerText.indexOf(playerName) != -1){
            playerAndHp = a11.innerText
        }else if(a12 && a12.innerText.indexOf(playerName) != -1){
            playerAndHp = a12.innerText
        }else if(a13 && a13.innerText.indexOf(playerName) != -1){
            playerAndHp = a13.innerText
        }else if(a14 && a14.innerText.indexOf(playerName) != -1){
            playerAndHp = a14.innerText
        }

        var hp = playerAndHp.substring(playerName.length,playerAndHp.length);
        var percent = (hp/playerMaxHp)*100;
        if(percent <= 75){
            clickButton(skill3,0);
            return;
        }

        var powerLine = document.getElementById('combat_xdz_text')
        var powerPoint = powerLine.innerText;
        var pp = powerPoint.substring(0,powerPoint.indexOf('/'));
        if(pp >= power){
            clickButton(skill1,0);
            clickButton(skill2,0);
        }
    }
}

var battleSkillButton = document.createElement('button');
battleSkillButton.innerText = '戰鬥技重置';
battleSkillButton.style.position = 'absolute';
battleSkillButton.style.right = '400px';
battleSkillButton.style.top = '400px';
document.body.appendChild(battleSkillButton);
battleSkillButton.addEventListener('click', battleSkillFunc);

function battleSkillFunc(){
    skillstr = prompt("請輸入要釋放的技能,以英文逗號分隔,前兩種武功為攻擊技能,第3個參數為釋放時需要的氣數,第4個參數為加血技能:","覆雨劍法,如來神掌,8,道種心魔經");
    sessionStorage.setItem("skillstr",skillstr);
}


setTimeout(function(){clickButton('score');},300);
setTimeout(function(){getNameAndHp();},600);
function getNameAndHp(){
    var hpNameTxts = document.getElementById("page").getElementsByClassName('out3');
    var hpNameTxt = hpNameTxts[0].innerText;
    var playerName = hpNameTxt.substring(hpNameTxt.indexOf('】')+1,hpNameTxt.length);
    sessionStorage.setItem("playerName",playerName);
    for(var i=0;i<hpNameTxts.length-1;i++){
        var hpNameTxt = hpNameTxts[i].innerText;
        if(hpNameTxt.indexOf('【氣血】')!=-1){
            var playerMaxHp = hpNameTxt.substring(hpNameTxt.indexOf('/')+1,hpNameTxt.length);
    		sessionStorage.setItem("playerMaxHp",playerMaxHp);
            alert('獲取玩家姓名和最大血量完畢');
            break;
        }
    }
}