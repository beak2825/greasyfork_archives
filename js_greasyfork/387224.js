// ==UserScript==
// @name         Neopets: The Battlebot
// @version      1.5.1
// @namespace    https://greasyfork.org/en/scripts/28667-neopets-the-battlebot
// @description  Fights in the battledome after you select your opponent.
// @author       Nyu (clraik)
// @match        http://www.neopets.com/dome/arena.phtml
// @match        http://www.neopets.com/dome/fight.phtml
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/387224/Neopets%3A%20The%20Battlebot.user.js
// @updateURL https://update.greasyfork.org/scripts/387224/Neopets%3A%20The%20Battlebot.meta.js
// ==/UserScript==


//THESE CAN BE CHANGED:
var abilityToUseFirst=28;//First Turn, Warlock's Rage
var FirstTurnWeapon1="Thistleberry Pingrenade";
var FirstTurnWeapon2="Turned Tooth";//"Kacheek Life Potion";

//Select infinite use items on this section, it will keep going until the enemy's HP is 0
var abilityToUseSecond=21;//First Turn, Lens Flare
var ExtraTurnWeapon1="Sword of Malum";
var ExtraTurnWeapon2="Bowling Ball of Lost Cities";

var infiniteBreaks=10;//How many turns on infinite before taking a break
var secondsToWait=60*2;//Wait 2 minutes every break (60sec * 2) //How much to wait on each break

//Abilities are shown below:
/*
WARNING! Only select abilities your pets already knows, or it wont select anything.
1 = Static Cling
10 = Halitosis
11 = Drizzle
12 = Bandage
13 = Meditate
14 = Shade
15 = Cranky
16 = Meh
17 = Positive Thinking
2 = An Icycle
18 = Sear
19 = Irritable Minions
20 = Throw Pillows
21 = Lens Flare
22 = Shhhhhhhhh...
23 = Shroud
24 = Float
25 = Burrow
26 = Tempest
27 = Snowager's Breath
28 = Warlock's Rage
3 = Healing Fire
29 = Rejuvenate
30 = Drain Life
31 = Reflect
32 = Rally Cry
33 = Adrenaline Rush
34 = Meepit Stampede
35 = Summon Monoceraptor
37 = Esophagor Stench
*/




/////////////////////////////////////////////////////////
//DO NOT EDIT BELOW IF YOU'RE NOT SURE WHAT YOU'RE DOING.
/////////////////////////////////////////////////////////







var time=5000;

$('[id="bdFightStep3FightButton"]').after("<a href='javascript:;' id='conf' style='margin-left:0px; background-image:url('http://images.neopets.com/altador/altadorcup/2011/popups/signup/buttons/bg.png'); size:50px;'>Configure autofighter</a>");
$('[id="conf"]').on('click', function() {
	popup();
});
if(document.URL.indexOf("dome/arena.phtml") != -1) {
	$(document).ready(function(){
		$("[id='start']").click();// Click on start button
		try{
			setTimeout(function(){ ability(abilityToUseFirst);},3000);
		}catch(e){}

		setTimeout(function(){ equip();},8000);// Wait five seconds and select equip
		setTimeout(function(){ fight();},9000);
	});
}
function ability(ability){
	$("[id='p1am']").click();
	$("[data-ability='"+ability+"']").click();
}
function fight(){
	var slotw1=document.getElementsByClassName("menu p1")[0].innerHTML;
	var slotw2=document.getElementsByClassName("menu p1")[1].innerHTML;
	var slota=document.getElementsByClassName("menu p1")[2].innerHTML;

	if (slotw1.includes("background-image")||slotw2.includes("background-image")){//if at least one weapon is selected continue
		$("[id='fight']").click();
		setTimeout(function(){ enemyHP();},2000);
	}
	else{// if a weapon is not selected, try to equip and repeat.
		equip();
		setTimeout(function(){ fight();},1000);
	}
}
function enemyHP(){
	var p1hp=document.getElementById("p1hp").outerHTML.toString();
	if(p1hp.includes('id="p1hp">0</div>')){
		alert("You were defeated :c");
	}
	var p2hp=document.getElementById("p2hp").outerHTML.toString();
	if(p2hp.includes('id="p2hp">0</div>')){
		var whenToStop=GM_getValue("type","rewards");
		finish(whenToStop);
	}else{
		time=time+1000;
		setTimeout(function(){ keepFighting();},time);
	}
}

function collect(){
	$("[class='end_ack collect']").click();
}
function equip(){
	document.getElementsByClassName("menu p1")[0].click();
	try{
		document.querySelector('img[alt="'+FirstTurnWeapon1+'"]').click();
	}
	catch(e){
		document.querySelector('img[title="'+FirstTurnWeapon1+'"]').click();
	}
	if (FirstTurnWeapon2!==""){
		document.getElementsByClassName("menu p1")[1].click();
		try{
			document.querySelector('img[alt="'+FirstTurnWeapon2+'"]').click();
		}
		catch(e){
			document.querySelector('img[title="'+FirstTurnWeapon2+'"]').click();
		}
	}
}
function keepFighting(){
	try{
		ability(abilityToUseSecond);//Your ability for a second move
	}catch(ex){}
	var slotw1=document.getElementsByClassName("menu p1")[0].innerHTML;
	var slotw2=document.getElementsByClassName("menu p1")[1].innerHTML;
	if(!slotw1.includes("background-image")){
		document.getElementsByClassName("menu p1")[0].click();
		try{
			document.querySelector('img[alt="'+ExtraTurnWeapon1+'"]').click();
		}
		catch(e){
			document.querySelector('img[title="'+ExtraTurnWeapon1+'"]').click();
		}
	}
	if (ExtraTurnWeapon2!=="" && !slotw2.includes("background-image")){
		document.getElementsByClassName("menu p1")[1].click();
		try{
			document.querySelector('img[alt="'+ExtraTurnWeapon2+'"]').click();
		}
		catch(e){
			document.querySelector('img[title="'+ExtraTurnWeapon2+'"]').click();
		}
	}
	time=time+1000;
	setTimeout(function(){ fight();},time);
}
function finish(id){
	setTimeout(function(){ collect();},1000);
	if(id==="infinite"){
		var breakCounter=GM_getValue("battleBreakCounter",1);
		GM_setValue("battleBreakCounter",breakCounter+1);
		if(breakCounter<infiniteBreaks){
			setTimeout(function(){ document.getElementById('bdplayagain').click();},4000);
		}
		else
		{
			GM_setValue("battleBreakCounter",1);
			setTimeout(function(){ document.getElementById('bdplayagain').click();},secondsToWait*1000);
		}
	}else if(id==="rewards"){
		var rewards=document.getElementById("bd_rewardsloot").outerHTML.toString();
		if (rewards.includes("NP limit")&&rewards.includes("item limit")){
			setTimeout(function(){ alert("Neopoint and item limit reward reached!");},2000);
		}else{
			setTimeout(function(){ document.getElementById('bdplayagain').click();},2000);
		}
	}else if(id==="specific"){
		var toFight=GM_getValue("timesToFight",10);
		if(toFight<0){
			GM_setValue("timesToFight",10);
		}
		GM_setValue("timesToFight",toFight-1);
		toFight=GM_getValue("timesToFight");
		if(toFight<=0){
			setTimeout(function(){ alert("Number of battles completed!");},2000);
		}else{
			setTimeout(function(){ document.getElementById('bdplayagain').click();},2000);
		}
	}
}
function popup(){
	var whichIsChecked=GM_getValue("type","rewards");
	var popupHTML='<div id="battleDomePopUp">'+
		'<form style="text-align:left;">'+
		'Times to fight:<br><br><input type="radio" id="specific"';
	if(whichIsChecked=="specific"){
		popupHTML+=" checked";
	}
	popupHTML+='>Specific:</input><input type="number" id="number" style="width:30px;" value="10" min="1" ><br><input type="radio" id="rewards" value=""';
	if(whichIsChecked=="rewards"){
		popupHTML+=" checked";
	}
	popupHTML+='>Rewards</input><br><input type="radio" id="infinite" value=""';
	if(whichIsChecked=="infinite"){
		popupHTML+=" checked";
	}
	popupHTML+='>Infinite</input>';
	popupHTML+='<br><br><button id="saveBattleConf" type="button"style="height:29px; width:163px; background: url(http://images.neopets.com/trousers/play/prank_but.png)"><img src="https://secure.nc.neopets.com/np/images/label/btn-save.png" style="margin-top:-10px;" height="43px" width="151px"></button>';
	popupHTML+='</form></div>';
	$("body").append (popupHTML);
	$('[id="specific"]').on('change', function() {
		if(document.getElementById("specific").checked === true){
			document.getElementById("rewards").checked=false;
			document.getElementById("infinite").checked=false;
		}
	});
	$('[id="rewards"]').on('change', function() {
		if(document.getElementById("rewards").checked === true){
			document.getElementById("specific").checked=false;
			document.getElementById("infinite").checked=false;
		}
	});
	$('[id="infinite"]').on('change', function() {
		if(document.getElementById("infinite").checked === true){
			document.getElementById("specific").checked=false;
			document.getElementById("rewards").checked=false;
		}
	});
	$("#saveBattleConf").click ( function () {
		var r   = document.getElementById("rewards").checked.toString();
		var s   = document.getElementById("specific").checked.toString();
		var i   = document.getElementById("infinite").checked.toString();

		var val="";
		if (r=="true"){val="rewards";}
		else if (s=="true"){val="specific";GM_setValue("timesToFight",parseInt($('[id="number"]').val()));}
		else if (i=="true"){val="infinite";}
		GM_setValue("type",val);
		$("#battleDomePopUp").hide();
		$('[id="conf"]').hide();//Second time it opens, doesnt work properly
	} );



	GM_addStyle ( ""+
				 "#battleDomePopUp {"+
				 "position:               fixed;"+
				 "top:                    30%;"+
				 "left:                   25%;"+
				 "padding:                10px;"+
				 "background:             #fff4c1;"+
				 "border:                 5px outset;"+
				 "border-radius:          10px;"+
				 "z-index:                100;"+
				 "}"+
				 "#battleDomePopUp button{"+
				 "cursor:                 pointer;"+
				 "margin:                 10px 10px 0;"+
				 "border:                 none;"+
				 " }"+
				 "#conf:hover{"+
				 "cursor:                 pointer;"+
				 "}" );
}