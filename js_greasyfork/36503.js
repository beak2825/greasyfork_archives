// ==UserScript==
// @name         千門開心秘境
// @namespace    http://swordman-s1.yytou.com/?id=6369878&time=1513692628063&key=747169814675b6be12318d2b0f93c3df&s_line=1
// @description  try to take over the world!
// @author       MARBO&jj
// @match        http://swordman-s1.yytou.com/?id=6369878&time=1513692628063&key=747169814675b6be12318d2b0f93c3df&s_line=1
// @grant        http://swordman-s1.yytou.com/?id=6369878&time=1513692628063&key=747169814675b6be12318d2b0f93c3df&s_line=1
// @version 0.0.1.20171219143842
// @downloadURL https://update.greasyfork.org/scripts/36503/%E5%8D%83%E9%96%80%E9%96%8B%E5%BF%83%E7%A7%98%E5%A2%83.user.js
// @updateURL https://update.greasyfork.org/scripts/36503/%E5%8D%83%E9%96%80%E9%96%8B%E5%BF%83%E7%A7%98%E5%A2%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
buttonWidth = '80px';
buttonHeight = '30px';
currentPos = 50;
delta = 30;
var buttonhiden=0;
var buttonhideButton = document.createElement('button');
buttonhideButton.innerText = '隱藏按鈕';
buttonhideButton.style.position = 'absolute';
buttonhideButton.style.right = '0px';
buttonhideButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
buttonhideButton.style.width = buttonWidth+12;
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
	   MountainCreekButton.style.visibility="hidden";
	   rororButton.style.visibility="hidden";
	   ProYuanShitaiButton.style.visibility="hidden";
	   kokokoButton.style.visibility="hidden";
	   kokokButton.style.visibility="hidden";
	   ClearwatercoldlakeButton.style.visibility="hidden";
	   QingyunPingButton.style.visibility="hidden";
	   BeforethecrisisButton.style.visibility="hidden";
	   HangingrootpineButton.style.visibility="hidden";
	   HangingButton.style.visibility="hidden";
	   LakesideButton.style.visibility="hidden";
	   YuBiwaterfallButton.style.visibility="hidden";
	   CaveButton.style.visibility="hidden";
	   oldwaterButton.style.visibility="hidden";
	   cliffButton.style.visibility="hidden";
	   OddHuaislopeButton.style.visibility="hidden";
	   NineoldholeButton.style.visibility="hidden";
	   PromiseoldholekButton.style.visibility="hidden";
	   kkokkoButton.style.visibility="hidden";
	   YunBuqiaoButton.style.visibility="hidden";
	   momoButton.style.visibility="hidden";
	   momomButton.style.visibility="hidden";
	   momommButton.style.visibility="hidden";
	   PoolsideButton.style.visibility="hidden";
	   popopoButton.style.visibility="hidden";
	   PeachSpringButton.style.visibility="hidden";
	   saoDangButton.style.visibility="hidden";
}

function showButton(){
		MountainCreekButton.style.visibility="visible";
		rororButton.style.visibility="visible";
		ProYuanShitaiButton.style.visibility="visible";
		kokokoButton.style.visibility="visible";
		kokokButton.style.visibility="visible";
		ClearwatercoldlakeButton.style.visibility="visible";
		QingyunPingButton.style.visibility="visible";
		BeforethecrisisButton.style.visibility="visible";
		HangingrootpineButton.style.visibility="visible";
		HangingButton.style.visibility="visible";
		LakesideButton.style.visibility="visible";
		YuBiwaterfallButton.style.visibility="visible";
		CaveButton.style.visibility="visible";
		oldwaterButton.style.visibility="visible";
		cliffButton.style.visibility="visible";
		OddHuaislopeButton.style.visibility="visible";
		NineoldholeButton.style.visibility="visible";
		PromiseoldholekButton.style.visibility="visible";
		kkokkoButton.style.visibility="visible";
		YunBuqiaoButton.style.visibility="visible";
		momoButton.style.visibility="visible";
		momomButton.style.visibility="visible";
		momommButton.style.visibility="visible";
		PoolsideButton.style.visibility="visible";
		popopoButton.style.visibility="visible";
		PeachSpringButton.style.visibility="visible";
		saoDangButton.style.visibility="visible";
}
// 山溪畔 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(MountainCreekButton);
var MountainCreekButton = document.createElement('button');
MountainCreekButton.innerText = '山溪畔';
MountainCreekButton.style.position = 'absolute';
MountainCreekButton.style.right = '0px';
MountainCreekButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
MountainCreekButton.style.width = buttonWidth;
MountainCreekButton.style.height = buttonHeight;
document.body.appendChild(MountainCreekButton);
MountainCreekButton.addEventListener('click', MountainCreek)
function MountainCreek(){ // 嵩山
	console.log('進入密境！');
	clickButton('jh 22');       // 進入章節
    clickButton('go north');
	clickButton('go north');
	clickButton('go west');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('look_npc songshan_songshan7', 0);
	clickButton('event_1_88705407', 1);
	clickButton('go south');
	clickButton('go south');
	clickButton('find_task_road secret');
}
// 盧崖瀑布 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(rororButton);
var rororButton = document.createElement('button');
rororButton.innerText = '盧崖瀑布';
rororButton.style.position = 'absolute';
rororButton.style.right = '0px';
rororButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
rororButton.style.width = buttonWidth;
rororButton.style.height = buttonHeight;
document.body.appendChild(rororButton);
rororButton.addEventListener('click', roror)
function roror(){ // 嵩山
	console.log('進入密境！');
	clickButton('jh 22');       // 進入章節
    clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('auto_fight 0', 0);
	clickButton('go north');
	clickButton('go east');
	clickButton('go north');
	clickButton('find_task_road secret');
}
// 臨淵石台 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(ProYuanShitaiButton);
var ProYuanShitaiButton = document.createElement('button');
ProYuanShitaiButton.innerText = '臨淵石台';
ProYuanShitaiButton.style.position = 'absolute';
ProYuanShitaiButton.style.right = '0px';
ProYuanShitaiButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
ProYuanShitaiButton.style.width = buttonWidth;
ProYuanShitaiButton.style.height = buttonHeight;
document.body.appendChild(ProYuanShitaiButton);
ProYuanShitaiButton.addEventListener('click', ProYuanShitai)
function ProYuanShitai(){ // 華山
	console.log('進入密境！');
	clickButton('jh 4');       // 進入章節
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
    clickButton('go north');
    clickButton('go east');
    clickButton('go north');
    clickButton('find_task_road secret');
}
// 長空棧道 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(kokokoButton);
var kokokoButton = document.createElement('button');
kokokoButton.innerText = '長空棧道';
kokokoButton.style.position = 'absolute';
kokokoButton.style.right = '0px';
kokokoButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
kokokoButton.style.width = buttonWidth;
kokokoButton.style.height = buttonHeight;
document.body.appendChild(kokokoButton);
kokokoButton.addEventListener('click', kokoko)
function kokoko(){ // 華山
	console.log('進入密境！');
	clickButton('jh 4');       // 進入章節
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
    clickButton('go north');
    clickButton('go east');
    clickButton('find_task_road secret');
}
// 千尺幢 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(kokokButton);
var kokokButton = document.createElement('button');
kokokButton.innerText = '千尺幢';
kokokButton.style.position = 'absolute';
kokokButton.style.right = '0px';
kokokButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
kokokButton.style.width = buttonWidth;
kokokButton.style.height = buttonHeight;
document.body.appendChild(kokokButton);
kokokButton.addEventListener('click', kokok)
function kokok(){ // 華山
	console.log('進入密境！');
	clickButton('jh 4');       // 進入章節
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
    clickButton('find_task_road secret');
}
// 碧水寒潭 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(ClearwatercoldlakeButton);
var ClearwatercoldlakeButton = document.createElement('button');
ClearwatercoldlakeButton.innerText = '碧水寒潭';
ClearwatercoldlakeButton.style.position = 'absolute';
ClearwatercoldlakeButton.style.right = '0px';
ClearwatercoldlakeButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
ClearwatercoldlakeButton.style.width = buttonWidth;
ClearwatercoldlakeButton.style.height = buttonHeight;
document.body.appendChild(ClearwatercoldlakeButton);
ClearwatercoldlakeButton.addEventListener('click', Clearwatercoldlake)
function Clearwatercoldlake(){ // 明教
	console.log('進入密境！');
	clickButton('jh 18');       // 進入章節
	clickButton('go north');
	clickButton('go northwest');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go northeast');
    clickButton('go north');
    clickButton('go north');
    clickButton('go north');
    clickButton('go north');
    clickButton('go north');
	clickButton('go east');
	clickButton('go east');
	clickButton('go southeast');
	clickButton('go southeast');
	clickButton('go east');
	clickButton('find_task_road secret');
}
// 危涯前 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(BeforethecrisisButton);
var BeforethecrisisButton = document.createElement('button');
BeforethecrisisButton.innerText = '危涯前';
BeforethecrisisButton.style.position = 'absolute';
BeforethecrisisButton.style.right = '0px';
BeforethecrisisButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
BeforethecrisisButton.style.width = buttonWidth;
BeforethecrisisButton.style.height = buttonHeight;
document.body.appendChild(BeforethecrisisButton);
BeforethecrisisButton.addEventListener('click', Beforethecrisis)
function Beforethecrisis(){ // 大旗門
	console.log('進入密境！');
	clickButton('jh 25');       // 進入章節
	clickButton('go west');
    clickButton('find_task_road secret');
}
// 青雲坪  ------------------------------------------------------------------------------------------------------
//document.body.removeChild(QingyunPingButton);
var QingyunPingButton = document.createElement('button');
QingyunPingButton.innerText = '青雲坪 ';
QingyunPingButton.style.position = 'absolute';
QingyunPingButton.style.right = '0px';
QingyunPingButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
QingyunPingButton.style.width = buttonWidth;
QingyunPingButton.style.height = buttonHeight;
document.body.appendChild(QingyunPingButton);
QingyunPingButton.addEventListener('click', QingyunPing)
function QingyunPing(){ // 少林
	console.log('進入密境！');
	clickButton('jh 13');       // 進入章節
	clickButton('go east');
    clickButton('go south');
    clickButton('go south');
    clickButton('go west');
    clickButton('go west');
    clickButton('find_task_road secret');
}
// 懸根松 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(HangingrootpineButton);
var HangingrootpineButton = document.createElement('button');
HangingrootpineButton.innerText = '懸根松';
HangingrootpineButton.style.position = 'absolute';
HangingrootpineButton.style.right = '0px';
HangingrootpineButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
HangingrootpineButton.style.width = buttonWidth;
HangingrootpineButton.style.height = buttonHeight;
document.body.appendChild(HangingrootpineButton);
HangingrootpineButton.addEventListener('click', Hangingrootpine)
function Hangingrootpine(){ // 恆山
	console.log('進入密境！');
	clickButton('jh 9');       // 進入章節
	clickButton('go north');
    clickButton('go west');
    clickButton('find_task_road secret');
}
// 夕陽領 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(HangingButton);
var HangingButton = document.createElement('button');
HangingButton.innerText = '夕陽領';
HangingButton.style.position = 'absolute';
HangingButton.style.right = '0px';
HangingButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
HangingButton.style.width = buttonWidth;
HangingButton.style.height = buttonHeight;
document.body.appendChild(HangingButton);
HangingButton.addEventListener('click', Hanging)
function Hanging(){ // 恆山
	console.log('進入密境！');
	clickButton('jh 9');       // 進入章節
	clickButton('go north');
	clickButton('go north');
    clickButton('go east');
    clickButton('find_task_road secret');
}
// 湖邊 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(LakesideButton);
var LakesideButton = document.createElement('button');
LakesideButton.innerText = '湖邊';
LakesideButton.style.position = 'absolute';
LakesideButton.style.right = '0px';
LakesideButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
LakesideButton.style.width = buttonWidth;
LakesideButton.style.height = buttonHeight;
document.body.appendChild(LakesideButton);
LakesideButton.addEventListener('click', Lakeside)
function Lakeside(){ // 逍遙林
	console.log('進入密境！');
	clickButton('jh 16');       // 進入章節
	clickButton('go south');
    clickButton('go south');
    clickButton('go south');
    clickButton('go south');
    clickButton('go east');
    clickButton('go north');
	clickButton('go east');
	clickButton('event_1_5221690', 0);
	clickButton('go south');
	clickButton('go west');
    clickButton('find_task_road secret');
}
// 玉璧瀑布 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(YuBiwaterfallButton);
var YuBiwaterfallButton = document.createElement('button');
YuBiwaterfallButton.innerText = '玉璧瀑布';
YuBiwaterfallButton.style.position = 'absolute';
YuBiwaterfallButton.style.right = '0px';
YuBiwaterfallButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
YuBiwaterfallButton.style.width = buttonWidth;
YuBiwaterfallButton.style.height = buttonHeight;
document.body.appendChild(YuBiwaterfallButton);
YuBiwaterfallButton.addEventListener('click', YuBiwaterfall)
function YuBiwaterfall(){ // 逍遙林
	console.log('進入密境！');
	clickButton('jh 16');       // 進入章節
	clickButton('go south');
    clickButton('go south');
    clickButton('go south');
    clickButton('go south');
    clickButton('go east');
    clickButton('go north');
	clickButton('go east');
	clickButton('find_task_road secret');
}
// 山丘小洞 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(CaveButton);
var CaveButton = document.createElement('button');
CaveButton.innerText = '山丘小洞';
CaveButton.style.position = 'absolute';
CaveButton.style.right = '0px';
CaveButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
CaveButton.style.width = buttonWidth;
CaveButton.style.height = buttonHeight;
document.body.appendChild(CaveButton);
CaveButton.addEventListener('click', Cave)
function Cave(){ // 丐幫
	console.log('進入密境！');
	clickButton('jh 6');       // 進入章節
	clickButton('event_1_98623439', 0);
    clickButton('go northeast');
    clickButton('go north');
    clickButton('go northeast');
    clickButton('go northeast');
    clickButton('go northeast');
	clickButton('event_1_97428251', 0);
	clickButton('find_task_road secret');
}
// 寒水潭 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(oldwaterButton);
var oldwaterButton = document.createElement('button');
oldwaterButton.innerText = '寒水潭';
oldwaterButton.style.position = 'absolute';
oldwaterButton.style.right = '0px';
oldwaterButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
oldwaterButton.style.width = buttonWidth;
oldwaterButton.style.height = buttonHeight;
document.body.appendChild(oldwaterButton);
oldwaterButton.addEventListener('click', oldwater)
function oldwater(){ // 古墓
	console.log('進入密境！');
	clickButton('jh 20');       // 進入章節
    clickButton('go west');
    clickButton('go west');
    clickButton('go south');
    clickButton('go east');
    clickButton('go south');
    clickButton('go south');
    clickButton('go south');
    clickButton('go south');
	clickButton('go south');
    clickButton('go southwest');
    clickButton('go southwest');
	clickButton('go south');
	clickButton('go east');
	clickButton('go southeast');
	clickButton('find_task_road secret');
}
// 懸涯 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(cliffButton);
var cliffButton = document.createElement('button');
cliffButton.innerText = '懸涯';
cliffButton.style.position = 'absolute';
cliffButton.style.right = '0px';
cliffButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
cliffButton.style.width = buttonWidth;
cliffButton.style.height = buttonHeight;
document.body.appendChild(cliffButton);
cliffButton.addEventListener('click', cliff)
function cliff(){ // 古墓
	console.log('進入密境！');
	clickButton('jh 20');       // 進入章節
    clickButton('go west');
    clickButton('go west');
    clickButton('go south');
    clickButton('go east');
    clickButton('go south');
    clickButton('go south');
    clickButton('go south');
    clickButton('go south');
	clickButton('go south');
    clickButton('go southwest');
    clickButton('go southwest');
	clickButton('go south');
	clickButton('go south');
	clickButton('go east');
	clickButton('find_task_road secret');
}
// 奇槐坡 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(OddHuaislopeButton);
var OddHuaislopeButton = document.createElement('button');
OddHuaislopeButton.innerText = '奇槐坡';
OddHuaislopeButton.style.position = 'absolute';
OddHuaislopeButton.style.right = '0px';
OddHuaislopeButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
OddHuaislopeButton.style.width = buttonWidth;
OddHuaislopeButton.style.height = buttonHeight;
document.body.appendChild(OddHuaislopeButton);
OddHuaislopeButton.addEventListener('click', OddHuaislope)
function OddHuaislope(){ // 梅莊
	console.log('進入密境！');
	clickButton('jh 23');       // 進入章節
    clickButton('go north');
    clickButton('go north');
    clickButton('go north');
    clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('find_task_road secret');
}
// 九老洞 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(NineoldholeButton);
var NineoldholeButton = document.createElement('button');
NineoldholeButton.innerText = '九老洞';
NineoldholeButton.style.position = 'absolute';
NineoldholeButton.style.right = '0px';
NineoldholeButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
NineoldholeButton.style.width = buttonWidth;
NineoldholeButton.style.height = buttonHeight;
document.body.appendChild(NineoldholeButton);
NineoldholeButton.addEventListener('click', Nineoldhole)
function Nineoldhole(){ // 峨嵋
	console.log('進入密境！');
	clickButton('jh 8');       // 進入章節
    clickButton('go west');
    clickButton('go northwest');
    clickButton('go north');
    clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go east');
	clickButton('go east');
	clickButton('go north');
	clickButton('go north');
	clickButton('go east');
	clickButton('kill emei_wenxu', 1);     //待加入循環功能
	clickButton('kill emei_shoushan', 1)
	clickButton('go north');
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
// 無極老姆洞 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(PromiseoldholekButton);
var PromiseoldholekButton = document.createElement('button');
PromiseoldholekButton.innerText = '無極老姆洞';
PromiseoldholekButton.style.position = 'absolute';
PromiseoldholekButton.style.right = '0px';
PromiseoldholekButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
PromiseoldholekButton.style.width = buttonWidth;
PromiseoldholekButton.style.height = buttonHeight;
document.body.appendChild(PromiseoldholekButton);
PromiseoldholekButton.addEventListener('click', Promiseoldholek)
function Promiseoldholek(){ // 嵩山
	console.log('進入密境！');
	clickButton('jh 22');       // 進入章節
    clickButton('go north');
	clickButton('go north');
	clickButton('go west');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('find_task_road secret');
}
// 啟母石 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(kkokkoButton);
var kkokkoButton = document.createElement('button');
kkokkoButton.innerText = '啟母石';
kkokkoButton.style.position = 'absolute';
kkokkoButton.style.right = '0px';
kkokkoButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
kkokkoButton.style.width = buttonWidth;
kkokkoButton.style.height = buttonHeight;
document.body.appendChild(kkokkoButton);
kkokkoButton.addEventListener('click', kkokko)
function kkokko(){ // 嵩山
	console.log('進入密境！');
	clickButton('jh 22');       // 進入章節
    clickButton('go north');
	clickButton('go north');
	clickButton('go west');
	clickButton('go west');
	clickButton('find_task_road secret');
}
// 天梯 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(YunBuqiaoButton);
var YunBuqiaoButton = document.createElement('button');
YunBuqiaoButton.innerText = '天梯';
YunBuqiaoButton.style.position = 'absolute';
YunBuqiaoButton.style.right = '0px';
YunBuqiaoButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
YunBuqiaoButton.style.width = buttonWidth;
YunBuqiaoButton.style.height = buttonHeight;
document.body.appendChild(YunBuqiaoButton);
YunBuqiaoButton.addEventListener('click', YunBuqiao)
function YunBuqiao(){ // 泰山
	console.log('進入密境！');
	clickButton('jh 24');       // 進入章節
    clickButton('go north');
    clickButton('go north');
	clickButton('go north');
	clickButton('find_task_road secret');
}
// 小洞天 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(momoButton);
var momoButton = document.createElement('button');
momoButton.innerText = '小洞天';
momoButton.style.position = 'absolute';
momoButton.style.right = '0px';
momoButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
momoButton.style.width = buttonWidth;
momoButton.style.height = buttonHeight;
document.body.appendChild(momoButton);
momoButton.addEventListener('click', momo)
function momo(){ // 泰山
	console.log('進入密境！');
	clickButton('jh 24');       // 進入章節
    clickButton('go north');
    clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go east');
	clickButton('go east');
	clickButton('find_task_road secret');
}
// 雲步橋 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(momomButton);
var momomButton = document.createElement('button');
momomButton.innerText = '雲步橋';
momomButton.style.position = 'absolute';
momomButton.style.right = '0px';
momomButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
momomButton.style.width = buttonWidth;
momomButton.style.height = buttonHeight;
document.body.appendChild(momomButton);
momomButton.addEventListener('click', momom)
function momom(){ // 泰山
	console.log('進入密境！');
	clickButton('jh 24');       // 進入章節
    clickButton('go north');
    clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('find_task_road secret');
}
// 觀景台 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(momommButton);
var momommButton = document.createElement('button');
momommButton.innerText = '觀景台';
momommButton.style.position = 'absolute';
momommButton.style.right = '0px';
momommButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
momommButton.style.width = buttonWidth;
momommButton.style.height = buttonHeight;
document.body.appendChild(momommButton);
momommButton.addEventListener('click', momomm)
function momomm(){ // 泰山
	console.log('進入密境！');
	clickButton('jh 24');       // 進入章節
    clickButton('go north');
    clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go east');
	clickButton('go east');
	clickButton('go north');
	clickButton('find_task_road secret');
}
// 潭畔草地 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(PoolsideButton);
var PoolsideButton = document.createElement('button');
PoolsideButton.innerText = '潭畔草地';
PoolsideButton.style.position = 'absolute';
PoolsideButton.style.right = '0px';
PoolsideButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
PoolsideButton.style.width = buttonWidth;
PoolsideButton.style.height = buttonHeight;
document.body.appendChild(PoolsideButton);
PoolsideButton.addEventListener('click', Poolside)
function Poolside(){ // 華山
	console.log('進入密境！');
	clickButton('jh 4');       // 進入章節
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('event_1_91604710', 1);
	clickButton('go south');
	clickButton('go south');
    clickButton('go south');
    clickButton('find_task_road secret');
}
// 猢猻愁 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(popopoButton);
var popopoButton = document.createElement('button');
popopoButton.innerText = '猢猻愁';
popopoButton.style.position = 'absolute';
popopoButton.style.right = '0px';
popopoButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
popopoButton.style.width = buttonWidth;
popopoButton.style.height = buttonHeight;
document.body.appendChild(popopoButton);
popopoButton.addEventListener('click', popopo)
function popopo(){ // 華山
	console.log('進入密境！');
	clickButton('jh 4');       // 進入章節
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('event_1_91604710', 1);
	clickButton('go south');
	clickButton('go south');
    clickButton('go south');
	clickButton('go north');
	clickButton('go north');
	clickButton('go north');
	clickButton('go northwest');
	clickButton('find_task_road secret');
}
// 桃花泉 ------------------------------------------------------------------------------------------------------
//document.body.removeChild(PeachSpringButton);
var PeachSpringButton = document.createElement('button');
PeachSpringButton.innerText = '桃花泉';
PeachSpringButton.style.position = 'absolute';
PeachSpringButton.style.right = '0px';
PeachSpringButton.style.top = currentPos + 'px';
currentPos = currentPos + delta;
PeachSpringButton.style.width = buttonWidth;
PeachSpringButton.style.height = buttonHeight;
document.body.appendChild(PeachSpringButton);
PeachSpringButton.addEventListener('click', PeachSpring)
function PeachSpring(){ // 華山
	console.log('進入密境！');
	clickButton('jh 3');       // 進入章節
	clickButton('go south');
	clickButton('go south');
	clickButton('go south');
	clickButton('go south');
	clickButton('go south');
	clickButton('go northwest');
	clickButton('go north');
	clickButton('go north');
	clickButton('go east');
    clickButton('find_task_road secret');
}

