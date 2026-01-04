// ==UserScript==
// @name         九天2 第二排20180114
// @namespace    http://swordman-s1.yytou.com/?id=4173821&time=1493310643929&key=c2a0e75e0ba63e8e6d09b9dd87afa7ef&s_line=1&game_skin=2
// @version      2.5
// @description  更新幫副~將幫派副本功能拿掉!
// @author       MARBO&jj
// @match        http://swordman-s1.yytou.com/?id=4173821&time=1493310643929&key=c2a0e75e0ba63e8e6d09b9dd87afa7ef&s_line=1&game_skin=2
// @grant        http://swordman-s1.yytou.com/?id=4173821&time=1493310643929&key=c2a0e75e0ba63e8e6d09b9dd87afa7ef&s_line=1&game_skin=2
// @downloadURL https://update.greasyfork.org/scripts/37918/%E4%B9%9D%E5%A4%A92%20%E7%AC%AC%E4%BA%8C%E6%8E%9220180114.user.js
// @updateURL https://update.greasyfork.org/scripts/37918/%E4%B9%9D%E5%A4%A92%20%E7%AC%AC%E4%BA%8C%E6%8E%9220180114.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
var enforcePoints = '1200';
var mySkillLists = '九天龍吟劍法';
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
	   killgangButton.style.visibility="hidden";
	   A2Button.style.visibility="hidden";
}
function showButton(){
	   A1Button.style.visibility="visible";
	   killgangButton.style.visibility="visible";
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
var items_sell = '八角錘拂塵桃符紙粗布衣長虹劍暗箭銀絲鞋叫化雞絲綢衣鋼刀閃避基礎銀絲帽玉竹杖中級拆招技巧金戒冰魄銀針禪杖拂塵蛇膽草皮帽舊書粉紅綢衫玄蘇劍青葫蘆松子鐵斧水蜜桃蓑衣破彎刀柴刀絲衣長鞭道德經布裙鋼絲甲衣牛皮帶制服金剛杖斬空刀拜月掌套金彈子新月棍白蟒鞭-草莓玉蜂漿玉蜂蜜蜂漿瓶豆漿蛋糕菠菜粉條包裹雞叫草水密桃--新月棍銀簪重甲羊角匕梅花匕日月神教腰牌船篙-絲綢馬褂白纓冠白色長袍蛇杖鬼頭刀拐杖古銅緞子襖裙大環刀鹿皮手套絲綢衣羊毛裙牧羊鞭牛皮酒袋麻帶鋼劍鋼杖藤甲盾長斗篷軍袍破披風木盾鐵盾錦緞腰帶鞶革青色道袍-鯽魚鯉魚樹枝水草破爛衣服-鹿皮小靴青綾綢裙布衣草帽草鞋布鞋精鐵甲-柳玉刀玉竹劍鋼刀戒刀單刀長劍長槍鐵錘木棍輕羅綢衫獸皮鞋皮鞭鐵棍飛鏢匕首細劍繡鞋繡花小鞋狼皮雪靴鐵戒銀戒鐵手鐲銀手鐲鐵項鍊銀項鍊';
var items_store = '空識卷軸玫瑰花玄重鐵分身卡百寶令江湖令師門令謎題令正邪令黃金鑰匙玄鐵令狀元貼白銀寶箱黃金寶箱高級乾坤袋裝備打折卡碎片武穆遺書';
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
// 殺幫副 ------------------------------------------------------------------------------------------------------
var killgangButton = document.createElement('button');
killgangButton.innerText = '殺幫副';
killgangButton.style.position = 'absolute';
killgangButton.style.right = '80px';
killgangButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
killgangButton.style.width = buttonWidth;
killgangButton.style.height = buttonHeight;
document.body.appendChild(killgangButton);
killgangButton.addEventListener('click', killgangFunc);
 var TianJianNPCList = ["鎮谷神獸", "鎮山神獸", "鎮殿神獸", "鎮潭神獸","守谷神獸",
                       "守山神獸", "守殿神獸", "守潭神獸","饕餮幼崽", "螣蛇幼崽",
                       "應龍幼崽","幽熒幼崽", "饕餮獸魂", "螣蛇獸魂", "應龍獸魂",
                       "幽熒獸魂", "幽熒王","饕餮王", "螣蛇王", "應龍王","幽熒戰神","饕餮戰神", "螣蛇戰神", "應龍戰神"];
//var TianJianNPCList = ["王鐵匠", "楊掌櫃", "柳繪心", "柳小花", "朱老伯","方老板", "醉漢"];
var killTianJianIntervalFunc =  null;
var currentNPCIndex = 0;
var setMp = 3000;

function killgangFunc(){
	zdskill =  mySkillLists;
	if (killgangButton.innerText == '殺幫副'){
	    mySkillLists=prompt("請輸入連續單放出招技能:","九天龍吟劍法");
		setMp = parseInt(prompt("請輸入低於多少內力時自動吃藥：",setMp));
		currentNPCIndex = 0;
		console.log("開始殺幫副目標NPC！");
		skillLists = mySkillLists;
		killgangButton.innerText ='停幫副';
		killTianJianIntervalFunc = setInterval(killTianJian, 500);

	}else{
		console.log("停止殺幫副目標NPC！");
		killgangButton.innerText ='殺幫副';
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
   setTimeout(ShiZhuYanFunc,500);

}

// 判断断魂崖出路
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
        setTimeout(A3,500);   // 1.5秒后重新检查出路
    }
  }