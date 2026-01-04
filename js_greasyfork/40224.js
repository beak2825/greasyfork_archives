// ==UserScript==
// @name         千門開心2 第二排20180114
// @namespace    http://swordman-s1.yytou.com/?id=6309368&time=1516531852908&key=9d829139f4d31c54171e3b9c18ab6bf4&s_line=1
// @version      2.5
// @description  更新幫副~將幫派副本功能拿掉!
// @author       MARBO&jj
// @match        http://swordman-s1.yytou.com/?id=6309368&time=1516531852908&key=9d829139f4d31c54171e3b9c18ab6bf4&s_line=1
// @grant        http://swordman-s1.yytou.com/?id=6309368&time=1516531852908&key=9d829139f4d31c54171e3b9c18ab6bf4&s_line=1
// @downloadURL https://update.greasyfork.org/scripts/40224/%E5%8D%83%E9%96%80%E9%96%8B%E5%BF%832%20%E7%AC%AC%E4%BA%8C%E6%8E%9220180114.user.js
// @updateURL https://update.greasyfork.org/scripts/40224/%E5%8D%83%E9%96%80%E9%96%8B%E5%BF%832%20%E7%AC%AC%E4%BA%8C%E6%8E%9220180114.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
var enforcePoints = '865';
var mySkillLists = '如來神掌';
skillLists = '';
buttonWidth = '80px';
buttonHeight = '15px';
currentPos = 50;
delta = 20;
//----------------------------------新版延時go函數------------------------------------------
var od;//執行的佇列
var go_st;//執行的序號
var go_delay=0;//定義全域延遲時間（毫秒）
var go = function(dir) {
    go_st=0;
    od =dir.split(";");
    setTimeout(go_step,go_delay);
};
var gofast = function(dir) {
    console.debug("開始執行：", dir);
    var d = dir.split(";");
        for (var i = 0; i < d.length; i++)
            clickButton(d[i], 0);
};
function go_rp(str,n){
    go_st=0;
    od=[];
    for(var i=0;i<n;i++){
        od[i]=str;
    }
    setTimeout(go_step,go_delay);
}

function go_rt(){
    setTimeout(go_step,go_delay);
}
function clear(){
    go_st=0;
    od=[];
}
function go_step(){
if(go_st<od.length){
    console.debug("開始執行：", od[go_st]);
    clickButton(od[go_st],0);
    go_st++;
    if(go_st%3==0){
        setTimeout(go_step,go_delay);
    }
    else {
        setTimeout(go_step,0);
    }
}else if(nextgo!=null){

    nextgo();
    nextgo=null;
}


}
//---------------------------------------NPC操作---------------------------------------------------------------------------
function setdonpc(a, s) {
    var c;
    if (s == "對話") {
        c = "ask "
    } else if (s == "比試") {
        c = "fight "
    } else if (s == "殺死") {
        c = "kill "
    } else if (s == "給予") {
        c = "give "
    } else if (s == "打探") {
        c = "npc_datan "
    } else if (s == "跟班") {
        c = "follow_play "
    } else if (s == "觀戰") {
        c = "watch_vs "
    }
    var b = $("#out .cmd_click3");
    for (var i = 0; i < b.length; i++) {
        var d = b[i].innerText;
        if (a == d) {
            var e = b[i].getAttribute('onclick').split("'")[1].split(" ")[1];
            clickButton(c + e);
            if (s == "比試") {
                clickButton('kill ' + e)
            }
            return
        }
    }
    console.log("未找到 " + a)
}
//--隱藏按鈕
var buttonhiden=0;
var buttonhideButton = document.createElement('button');
buttonhideButton.innerText = '隱藏按鈕';
buttonhideButton.style.position = 'absolute';
buttonhideButton.style.right = '80px';
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
       A1Button.style.visibility="hidden";
	   killTianJianTargetButton.style.visibility="hidden";
	   A2Button.style.visibility="hidden";
}
function showButton(){
	   A1Button.style.visibility="visible";
	   killTianJianTargetButton.style.visibility="visible";
	   A2Button.style.visibility="visible";
}
//-----清包包
var A1Button = document.createElement('button');
A1Button.innerText = '清包包';
A1Button.style.position = 'absolute';
A1Button.style.right = '80px';
A1Button.style.top = currentPos + 'px';
currentPos = currentPos + delta;
A1Button.style.width = buttonWidth;
A1Button.style.height = buttonHeight;
document.body.appendChild(A1Button);
A1Button.addEventListener('click', A1)
function A1(){ //
    clickButton('items', 0);
    window.setTimeout(clearitem, 200)
}
var items_sell = '八角錘廢焦丹廢藥渣長鬥篷八角錘拂塵桃符紙粗布衣長虹劍暗箭銀絲鞋叫化雞絲綢衣鋼刀閃避基礎銀絲帽玉竹杖中級拆招技巧金戒冰魄銀針禪杖拂塵蛇膽草皮帽舊書粉紅綢衫玄蘇劍青葫蘆松子鐵斧水蜜桃蓑衣破彎刀柴刀絲衣長鞭道德經布裙鋼絲甲衣牛皮帶制服金剛杖斬空刀拜月掌套金彈子新月棍白蟒鞭-草莓玉蜂漿玉蜂蜜蜂漿瓶豆漿蛋糕菠菜粉條包裹雞叫草水密桃--新月棍銀簪重甲羊角匕梅花匕日月神教腰牌船篙-絲綢馬褂白纓冠白色長袍蛇杖鬼頭刀拐杖古銅緞子襖裙大環刀鹿皮手套絲綢衣羊毛裙牧羊鞭牛皮酒袋麻帶鋼劍鋼杖藤甲盾長斗篷軍袍破披風木盾鐵盾錦緞腰帶鞶革青色道袍-鯽魚鯉魚樹枝水草破爛衣服-鹿皮小靴青綾綢裙布衣草帽草鞋布鞋精鐵甲-柳玉刀玉竹劍鋼刀戒刀單刀長劍長槍鐵錘木棍輕羅綢衫獸皮鞋皮鞭鐵棍飛鏢匕首細劍繡鞋繡花小鞋狼皮雪靴鐵戒銀戒鐵手鐲銀手鐲鐵項鍊銀項鍊';
var items_store = '岩鴿麻雀空識卷軸玫瑰花玄重鐵分身卡百寶令江湖令師門令謎題令正邪令黃金鑰匙玄鐵令狀元貼白銀寶箱黃金寶箱高級乾坤袋裝備打折卡碎片武穆遺書';
var items_use = '神秘寶箱';
var items_study = '左手兵刃研習';

function clearitem() {
    go_st = 0;
    od = [];
    var t = $("tr[bgcolor]:contains(兩)").siblings();
    if (t.length > 0) {
        for (var i = 0; i < t.length; i++) {
            if (t.eq(i)[0].innerText.replace(/\s+/g, "") != "") {
                var a = t.eq(i).find('td')[0].innerText.replace('\n', "");
                var b = parseInt(t.eq(i).find('td')[1].innerText.match(/\d+/g)[0]);
                var c = t[i].getAttribute('onclick').split("'")[1].split("info ")[1];
                if (items_store.indexOf(a) != -1) {
                    console.log("存倉庫：" + a + " 數量：" + b);
                    od.push('items put_store ' + c)
                } else if (items_use.indexOf(a) != -1) {
                    console.log("使用：" + a + " 數量：" + b);
                    for (j = 0; j < b; j++) {
                        od.push('items use ' + c)
                    }
                } else if (items_study.indexOf(a) != -1) {
                    console.log("學習：" + a + " 數量：" + b);
                    for (j = 0; j < b; j++) {
                        od.push('study ' + c)
                    }
                } else if (items_sell.indexOf(a) != -1) {
                    console.log("賣掉：" + a + " 數量：" + b);
                    for (j = 0; j < b; j++) {
                        od.push('items sell ' + c)
                    }
                }
                if (a.indexOf('寶石') != -1) {
                    console.log("存倉庫：" + a + " 數量：" + b);
                    od.push('items put_store ' + c)
                }
                if (a.indexOf('基礎') != -1 || a.indexOf('進階') != -1 || a.indexOf('長衫') != -1 || a.indexOf('袈裟') != -1 || a.indexOf('聖衣') != -1 || a.indexOf('道袍') != -1) {
                    console.log("賣掉：" + a + " 數量：" + b);
                    for (j = 0; j < b; j++) {
                        od.push('items sell ' + c)
                    }
                }
            }
        }
    }
    od.push('prev');
    go_delay = 300;
    go_rt();
}
// 殺幫本 ------------------------------------------------------------------------------------------------------
var killTianJianTargetButton = document.createElement('button');
killTianJianTargetButton.innerText = '殺幫本';
killTianJianTargetButton.style.position = 'absolute';
killTianJianTargetButton.style.right = '80px';
killTianJianTargetButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
killTianJianTargetButton.style.width = buttonWidth;
killTianJianTargetButton.style.height = buttonHeight;
document.body.appendChild(killTianJianTargetButton);
killTianJianTargetButton.addEventListener('click', killTianJianTargetFunc);
var TianJianNPCList = ["鎮谷神獸", "鎮山神獸", "鎮殿神獸", "鎮潭神獸","守谷神獸",
                       "守山神獸", "守殿神獸", "守潭神獸","饕餮幼崽", "螣蛇幼崽",
                       "應龍幼崽","幽熒幼崽", "饕餮獸魂", "螣蛇獸魂", "應龍獸魂",
                       "幽熒獸魂", "幽熒王","饕餮王", "螣蛇王", "應龍王","幽熒戰神","饕餮戰神", "螣蛇戰神", "應龍戰神"];

//var TianJianNPCList = ["王鐵匠", "楊掌櫃", "柳繪心", "柳小花", "朱老伯","方老板", "醉漢"];
var killTianJianIntervalFunc =  null;
var currentNPCIndex = 0;
var setMp = 3000;

function killTianJianTargetFunc(){
	zdskill =  mySkillLists;
	if (killTianJianTargetButton.innerText == '殺幫本'){
	    mySkillLists=prompt("請輸入連續單放出招技能:","如來神掌");
		setMp = parseInt(prompt("請輸入低於多少內力時自動吃藥：",setMp));
		currentNPCIndex = 0;
		console.log("開始殺幫本目標NPC！");
		skillLists = mySkillLists;
		killTianJianTargetButton.innerText ='停幫本';
		killTianJianIntervalFunc = setInterval(killTianJian, 500);

	}else{
		console.log("停止殺幫本目標NPC！");
		killTianJianTargetButton.innerText ='殺幫本';
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
	// 買東西 --------------------------------
var A2Button = document.createElement('button');
A2Button.innerText = '買千年';
A2Button.style.position = 'absolute';
A2Button.style.right = '80px';
A2Button.style.top = currentPos + 'px';
currentPos = currentPos + delta;
A2Button.style.width = buttonWidth;
A2Button.style.height = buttonHeight;
document.body.appendChild(A2Button);
A2Button.addEventListener('click', A2)
function A2(){
//     if ($('.cmd_click_room')[0] === undefined || $('.cmd_click_room')[0].innerText !== "桑鄰藥鋪"){
//     alert("請位於 #桑鄰藥鋪#在輸入購買,外傳1點楊掌櫃");
// 	return;
// }
    var object  = "";
    var num  = 0;
    if(!(object  = prompt("請輸入要購買的物品：","千年靈芝") )){ // 支持 魚竿，魚餌
        return;
    }
    if(!( num  = prompt("請輸入購買數量：","60"))){ // 支持 魚竿，魚餌
        return;
    }
    num  = parseInt(num); // 支持 魚竿，魚餌
    //魚竿
    if (object == "漁具"){
        for(var i=0; i < num; i++) { // 從第一個開始迴圈
            clickButton('shop money_buy shop5'); // 魚竿
            clickButton('shop money_buy shop6');// 魚餌
        }
    }else if (object == "千年靈芝"){
        clickButton('jh 1');
		clickButton('go east');
		clickButton('go north');
		clickButton('go north');
		clickButton('go north');
		clickButton('go west');
        for(var i=0; i < num; i++) { // 從第一個開始迴圈
             clickButton('buy /map/snow/obj/qiannianlingzhi from snow_herbalist');
        }
        go("home;");
    }else{
        alert("抱歉，此腳本還不能用於購買此物品！");
    }
    /*-------物品代碼:千年靈芝buy /map/snow/obj/qiannianlingzhi_N_10 from snow_herbalist -------*/
}
//上天山 --------------------------------
var A3Button = document.createElement('button');
A3Button.innerText = '上天山';
A3Button.style.position = 'absolute';
A3Button.style.right = '80px';
A3Button.style.top = currentPos + 'px';
currentPos = currentPos + delta;
A3Button.style.width = buttonWidth;
A3Button.style.height = buttonHeight;
document.body.appendChild(A3Button);
A3Button.addEventListener('click', A3)

function A3(){
   clickButton('jh 39');
   clickButton('go northeast');
   clickButton('go east');
   clickButton('go north');
   clickButton('go northwest');
   clickButton('go northwest');
   clickButton('go east');
   clickButton('go east');
   clickButton('go north');
   clickButton('go northeast');
   clickButton('go northwest');
   clickButton('event_1_58460791');
   setTimeout(ShiZhuYanFunc,100);

}

// 判??魂崖出路
function ShiZhuYanFunc(){
   if ($('button.cmd_click_room')[0].innerText == "失足岩"){   //
        clickButton('go northwest');
        clickButton('go north');
        clickButton('go northeast');
        clickButton('go northwest');
        clickButton('go northwest');
        clickButton('go west');
        clickButton('go north');
        clickButton('go north');
        clickButton('go north');
        clickButton('go east');
        clickButton('go east');
        clickButton('go south');
        clickButton('give tianshan_hgdz');
        clickButton('ask tianshan_hgdz');
        clickButton('go south');
        clickButton('event_1_34855843');
    }
    else{
        setTimeout(A3,100);   // 1.5秒后重新?查出路
    }
  }
//逃跑 --------------------------------
var A4Button = document.createElement('button');
A4Button.innerText = '逃跑';
A4Button.style.position = 'absolute';
A4Button.style.right = '80px';
A4Button.style.top = currentPos + 'px';
currentPos = currentPos + delta;
A4Button.style.width = buttonWidth;
A4Button.style.height = buttonHeight;
document.body.appendChild(A4Button);
A4Button.addEventListener('click', A4)


function A4(){
    if(btnList["逃跑"].innerText  == '逃跑'){
        AutoEscapeFunc();
        btnList["逃跑"].innerText  = '取消逃跑';}
    else{clearEscape();
         {btnList["逃跑"].innerText  = '逃跑';}
        }

    function AutoEscapeFunc(){
        // ?隔500毫秒逃跑一次
        AutoEscapeFuncIntervalFunc = setInterval(AutoEscape,500);
    }

    function clearEscape(){
        clearInterval(AutoEscapeFuncIntervalFunc);
    }

    function AutoEscape(){
        go('escape');     //逃跑
        if($('span.outbig_text:contains(戰鬥?束)').length>0){
            clearEscape();
            btnList["逃跑"].innerText  = '逃跑';
            go('prev_combat');
        }
        else if($('button.cmd_combat_byebye').length===0){
            clearEscape();
            btnList["逃跑"].innerText  = '逃跑';
            go('prev_combat');
        }
    }
}

//療傷10次------------------------------------------------------------------------------------------------------
var LiaoShangButton = document.createElement('button');
LiaoShangButton.innerText = '療傷10次';
LiaoShangButton.style.position = 'absolute';
LiaoShangButton.style.right = '80px';
LiaoShangButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
LiaoShangButton.style.width = buttonWidth;
LiaoShangButton.style.height = buttonHeight;
document.body.appendChild(LiaoShangButton);
LiaoShangButton.addEventListener('click', LiaoShangFunc);
function LiaoShangFunc(){
for (var i=0; i<10; i++)
  {
 clickButton('recovery')
  };
}
//吃五個千年靈芝------------------------------------------------------------------------------------------------------
var userMedecineButton = document.createElement('button');
userMedecineButton.innerText = '吃千年靈芝5個';
userMedecineButton.style.position = 'absolute';
userMedecineButton.style.right = '80px';
userMedecineButton.style.top =currentPos +  'px';
currentPos = currentPos + delta;
userMedecineButton.style.width = buttonWidth;
userMedecineButton.style.height = buttonHeight;
document.body.appendChild(userMedecineButton);
userMedecineButton.addEventListener('click', userMedecineFunc);
function userMedecineFunc(){
for (var i=0; i<5; i++)
  {
 clickButton('items use snow_qiannianlingzhi')
  };
}
		var buttonhiden=0;
		var buttonhideButton = document.createElement('button');
		buttonhideButton.innerText = '隱藏按鈕';
		buttonhideButton.style.position = 'absolute';
		buttonhideButton.style.right = '80px';
		buttonhideButton.style.top = currentPos + 'px';
		currentPos = currentPos + delta;
		buttonhideButton.style.width = buttonWidth+12;
		buttonhideButton.style.height = buttonHeight;
		document.body.appendChild(buttonhideButton);
		buttonhideButton.addEventListener('click', buttonhideFunc)

		// style="display: none;"

		// document.getElementById("typediv1").style.display="none";//?藏

		// document.getElementById("typediv1").style.display="";//?示


		function buttonhideFunc(){

			if (buttonhiden==0){
				buttonhiden=1;
				buttonhideButton.innerText = '顯示按鈕';
				// buttonhideButton.style.display="none";
				hideButton();
			}
			else {
				buttonhiden=0;
				buttonhideButton.innerText = '隱藏按鈕';
				// buttonhideButton.style.display="";
				showButton();
			}
		}

		function hideButton(){
			   // MountainCreekButton.style.visibility="hidden";
			   SetSkillButton.style.visibility="hidden";
			   CheckInButton.style.visibility="hidden";
			   getRewardsButton.style.visibility="hidden";
			   swordButton.style.visibility="hidden";
			   tryButton.style.visibility="hidden";
			   killDrunkManButton.style.visibility="hidden";
			   fishingButton.style.visibility="hidden";
			   clearPuzzlesButton.style.visibility="hidden";
			   QiXiaTalkButton.style.visibility="hidden";
			   getSilverKeyButton.style.visibility="hidden";
			   getBiXieButton.style.visibility="hidden";
			   enforceButton.style.visibility="hidden";
			   //familyQuestButton.style.visibility="hidden";
			   buyOneBeeButton.style.visibility="hidden";
			   killTianJianTargetButton.style.visibility="hidden";
			   goBack2WaterFallButton.style.visibility="hidden";
			   userMedecineButton.style.visibility="hidden";
			   answerQuestionsButton.style.visibility="hidden";
			   saoDangButton.style.visibility="hidden";
			   xianlButton.style.visibility="hidden";
			   daButton.style.visibility="hidden";
			   bijingButton.style.visibility="hidden";
			   // qiangButton.style.visibility="hidden";
			   qiangdipiButton.style.visibility="hidden";
			   //listenQLButton.style.visibility="hidden";
			   //listenYXButton.style.visibility="hidden";
			   npckillButton.style.visibility="hidden";
			   BiShi2Button.style.visibility="hidden";

		}


		function showButton(){
				// MountainCreekButton.style.visibility="visible";
				SetSkillButton.style.visibility="visible";
			    CheckInButton.style.visibility="visible";
			    getRewardsButton.style.visibility="visible";
			    swordButton.style.visibility="visible";
			    tryButton.style.visibility="visible";
			    killDrunkManButton.style.visibility="visible";
			    fishingButton.style.visibility="visible";
			    clearPuzzlesButton.style.visibility="visible";
			    QiXiaTalkButton.style.visibility="visible";
			    getSilverKeyButton.style.visibility="visible";
			    getBiXieButton.style.visibility="visible";
			    enforceButton.style.visibility="visible";
			    //familyQuestButton.style.visibility="visible";
			    buyOneBeeButton.style.visibility="visible";
			    killTianJianTargetButton.style.visibility="visible";
			    goBack2WaterFallButton.style.visibility="visible";
			    userMedecineButton.style.visibility="visible";
			    answerQuestionsButton.style.visibility="visible";
			    saoDangButton.style.visibility="visible";
			    xianlButton.style.visibility="visible";
			    daButton.style.visibility="visible";
			    bijingButton.style.visibility="visible";
			    // qiangButton.style.visibility="visible";
			    qiangdipiButton.style.visibility="visible";
			   	//listenQLButton.style.visibility="visible";
			   	//listenYXButton.style.visibility="visible";
			   	npckillButton.style.visibility="visible";
			   	BiShi2Button.style.visibility="visible";

		}










		//彈出視窗-----------------------------------------------------------------------
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
		var createButton2 = document.createElement('button');
		createButton2.innerText = '去秘境';
		createButton2.style.position = 'absolute';
		createButton2.style.right = '80px';
		createButton2.style.top =currentPos +  'px';
		currentPos = currentPos + delta;
		createButton2.style.width = buttonWidth;
		createButton2.style.height = buttonHeight;
		document.body.appendChild(createButton2);
		createButton2.addEventListener('click', qmjfunc);

		var qmjname = '';
		// createButton2('去秘境', qmjfunc);
		var qmj_popbk = createPop('去秘境');
		popList['去秘境'].innerHTML = '<div>請選擇你要去的地方吧</div>';

		function qmj_addbtns() {
		    if (createButton2.innerText == '去秘境'){
		    var a = ['山坳', '草原','石街','桃花泉', '潭畔草地', '長空棧道','臨淵石台', '千尺幢', '玉女峰', '猢猻愁', '沙丘小洞', '九老洞', '懸根松', '夕陽嶺', '青雲坪', '湖邊','玉壁瀑布','碧水寒潭','懸崖','寒水潭','戈壁','盧崖瀑布','啟母石','無極老姆','山溪畔','奇槐坡','小洞天','天梯','雲步橋','觀景台','危崖前','無名山'];
		    var b = [];
		    for (var i = 0; i < a.length; i++) {
		        b[i] = document.createElement('button');
		        b[i].style.padding = '0';
		        b[i].style.margin = '6px 0 0 6px';
		        b[i].style.width = '80px';
		        b[i].style.height = '40px';
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
					if(qmjname=="無極老姆"){wjlmd();}
					if(qmjname=="山溪畔"){sxp();}
					if(qmjname=="奇槐坡"){qhp();}
					if(qmjname=="小洞天"){xdt();}
					if(qmjname=="天梯"){tt();}
					if(qmjname=="雲步橋"){ybq();}
					if(qmjname=="觀景台"){gjt();}
					if(qmjname=="危崖前"){wyq();}
					if(qmjname=="無名山"){wmsxg();};
					if(qmjname=="草原"){cao();};
		            // createButton2.innerText = '停秘境'
		        }
		    }
		}
	}
		qmj_addbtns();

		function qmjfunc() {
		    if (createButton2.innerText == '去秘境') {
		        qmj_popbk.style.display = ""
		    } else {
		        createButton2.innerText = '去秘境'
		    }
		}
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
				if(qmjname=="無極老姆"){wjlmd();}
				if(qmjname=="山溪畔"){sxp();}
				if(qmjname=="奇槐坡"){qhp();}
				if(qmjname=="小洞天"){xdt();}
				if(qmjname=="天梯"){tt();}
				if(qmjname=="雲步橋"){ybq();}
				if(qmjname=="觀景台"){gjt();}
				if(qmjname=="危崖前"){wyq();}
				if(qmjname=="無名山"){wmsxg();};
				if(qmjname=="草原"){cao();};

				function sa(){//山坳
				    go("jh 1;e;n;n;n;n;n;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function cao(){//草原
				    go("jh 26;w;find_task_road secret");
				}
				function sj(){//石街
				    go("jh 2;n;n;n;n;w;event_1_98995501;n;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function thq(){//桃花泉
					go("jh 3;s;s;s;s;s;nw;n;n;e;find_task_road secret");
					// createButton2.innerText = '停秘境';
				}
				function tpcd(){// 潭畔草地
				    go("jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function lyst(){// 臨淵石台
				    go("jh 4;n;n;n;n;n;n;n;n;n;e;n;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function ckzd(){// 長空棧道
				    go("jh 4;n;n;n;n;n;n;n;n;n;e;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function qct(){// 千尺幢
				    go("jh 4;n;n;n;n;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function ynf(){// 玉女峰
				    go("jh 4;n;n;n;n;n;n;n;n;w;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function hsc(){// 猢猻愁
				    go("jh 4;n;n;n;n;n;n;e;n;n;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function sqxd(){// 沙丘小洞
				    go("jh 6;event_1_98623439;ne;n;ne;ne;ne;event_1_97428251;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function jld(){//九老洞
					go('jh 8;w;nw;n;n;n;n;e;e;n;n;e')
					niguIntervalFunc = setInterval(killnigu,200);
					// createButton2.innerText = '停秘境';
				}
				function xgs(){// 懸根松
				    go("jh 9;n;w;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function xyl(){// 夕陽嶺
				    go("jh 9;n;n;e;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function qyp(){// 青雲坪
				    go("jh 13;e;s;s;w;w;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}

				function hb(){// 湖邊
				    go("jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function ybpb(){// 玉壁瀑布
				    go("jh 16;s;s;s;s;e;n;e;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function bsht(){// 碧水寒潭
				    go("jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;se;se;e;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function xy(){// 懸崖
				    go("jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;e;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function hst(){// 寒水潭
				    go("jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;e;se;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function gb(){// 戈壁
				    go("jh 21;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function lypb(){// 盧涯瀑布
				    go("jh 22;n;n;n;escape;escape;escape;escape;escape;n;e;n;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function qms(){// 啟母石
				    go("jh 22;n;n;w;w;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function wjlmd(){// 無極老姆洞
				    go("jh 22;n;n;w;n;n;n;n;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function sxp(){// 山溪畔
				    go("jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function qhp(){// 奇槐坡
				    go("jh 23;n;n;n;n;n;n;n;n;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function tt(){// 天梯
				    go("jh 24;n;n;n;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function xdt(){// 小洞天
				    go("jh 24;n;n;n;n;e;e;;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function ybq(){// 雲步橋
				    go("jh 24;n;n;n;n;n;n;n;n;n;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function gjt(){// 觀景台
				    go("jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function wyq(){// 危崖前
				    go("jh 25;w;find_task_road secret");
				    // createButton2.innerText = '停秘境';
				}
				function wmsxg(){// 無名山峽谷
				    go("jh 29;n;n;n;n;event_1_60035830");
					hiking0IntervalFunc = setInterval(hiking0,400);
					// createButton2.innerText = '停秘境';
				}


		function isContains(str, substr) {
		   	return str.indexOf(substr) >= 0;
		}
		function killnigu(){
			setTimeout(ninesword,200);
			$("button.cmd_click3").each(
			function(){
				clickButton('kill emei_shoushan');
				clickButton('kill emei_wenxu');
			})
		 		if($('span:contains(勝利)').text().slice(-3)=='勝利！' || $('span:contains("戰敗了")').text().slice(-6)=='戰敗了...'){
		 			clickButton('prev_combat');
		 			ninecave();
		        }
			}

		function ninecave(){
				clearInterval(niguIntervalFunc);
		        clickButton('go north');
		        clickButton('escape', 0);
				clickButton('escape', 0);
				clickButton('escape', 0);
				clickButton('escape', 0);
				clickButton('escape', 0);
				clickButton('escape', 0);
				clickButton('go north');
				clickButton('go north');
				clickButton('go north');
				clickButton('go west');
				clickButton('go north');
				clickButton('go north');
				clickButton('go north');
				clickButton('go north');
				clickButton('go north');
				clickButton('go north');
				clickButton('go north');
				clickButton('go north');
				clickButton('go north');
				clickButton('go northwest');
				clickButton('go southwest');
				clickButton('go west');
				clickButton('go northwest');
				clickButton('go west');
				clickButton('find_task_road secret');
		}



		//-----無名山----------------------
		var hiking0IntervalFunc = null;
		var hikingIntervalFunc = null;

		function hiking0(){
			console.log("爬個小山囉");
			if ($('.cmd_click3:first').text() == '繼續爬山'){
				clearInterval(hiking0IntervalFunc);
				hikingIntervalFunc = setInterval(hiking, 400);
			}
			else {
				clickButton('event_1_60035830');
			}
		}

		function hiking(){
				if ($('.cmd_click_room')[0].innerText == "無名山峽谷"){
					clearTimeout(hiking);
					clickButton('find_task_road secret');
					clickButton('find_task_road secret');
					createButton2.innerText = '停秘境';
					createButton2.innerText = '秘境';
					clearInterval(hikingIntervalFunc);
					clearInterval(hiking0IntervalFunc);
				}
				else {
					clickButton('event_1_65661209');
					if ($('.cmd_click_room')[0].innerText == "洞口"){
						clickButton('go south.4631818', 0); //平台
					}
				}
			}
			// 一鍵裝備----------------------------
                var PaiHangButton = document.createElement('button');
                PaiHangButton.innerText = '一鍵裝備';
                PaiHangButton.style.position = 'absolute';
                PaiHangButton.style.right = '80px';
                PaiHangButton.style.top =currentPos +  'px';
                currentPos = currentPos + delta;
                PaiHangButton.style.width = buttonWidth;
                PaiHangButton.style.height = buttonHeight;
                document.body.appendChild(PaiHangButton);
                PaiHangButton.addEventListener('click', PaiHangFunc);

                function PaiHangFunc(){
                    clickButton('auto_equip on', 0);
					clickButton('enable map_all', 0);
}
           //一鍵脫裝
var BiShi2Button = document.createElement('button');
BiShi2Button.innerText = '一鍵脫裝';
BiShi2Button.style.position = 'absolute';
BiShi2Button.style.right = '80px';
BiShi2Button.style.top = currentPos + 'px';
currentPos = currentPos + delta;
BiShi2Button.style.width = buttonWidth;
BiShi2Button.style.height = buttonHeight;
document.body.appendChild(BiShi2Button);
BiShi2Button.addEventListener('click', BiShi2Func)
function BiShi2Func(){

       clickButton('auto_equip off', 0);
}
