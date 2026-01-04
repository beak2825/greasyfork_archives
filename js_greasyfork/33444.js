// ==UserScript==
// @name         Neopets: The Golden Dubloon
// @namespace    http://clraik.com/forum/showthread.php?62047-Neopets-The-Golden-Dubloon
// @version      0.3
// @description  Selects the dishes you choose and eats x times or until leftovers.
// @author       Nyu (clraik)
// @match        *://*.neopets.com/pirates/restaurant.phtml*
// @match        *://*.neopets.com/pirates/process_restaurant.phtml*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/33444/Neopets%3A%20The%20Golden%20Dubloon.user.js
// @updateURL https://update.greasyfork.org/scripts/33444/Neopets%3A%20The%20Golden%20Dubloon.meta.js
// ==/UserScript==


var times=2;//Change to the numbers of times you want to eat.



/*               Starters                  */
// /pirates/process_restaurant.phtml?type=add&item=15707 Caesar Salad 1 dubloon
// /pirates/process_restaurant.phtml?type=add&item=15706 Shiver Me Shrimp 3 Dubloons
// /pirates/process_restaurant.phtml?type=add&item=15705 tomato cannon ball 2 dubloon
// /pirates/process_restaurant.phtml?type=add&item=15704 Oyster Obsession 2 dubloon
// /pirates/process_restaurant.phtml?type=add&item=15703 Tropical Breeze 1 dubloon
// /pirates/process_restaurant.phtml?type=add&item=15702 Crusty Clam Surprise 3 dubloon
// /pirates/process_restaurant.phtml?type=add&item=15701 Double Stuffed Guppy 5 dubloons

/*                Cocktails               */
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15711 Tchea Grog 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15708 Grog Light 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15712 Krakuberry Grog 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15709 Random Grog 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15713 Random Pop 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15714 Cherry Pop 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15715 Grape Pop 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15716 Raspberry Pop 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15717 Man O Wat 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15718 Keel Haul 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15719 Cannon fodder 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15720 Walk the Plank 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15721 Land Lubber 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15722 Hogshead 10 dubloon

/*               Desserts                  */
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15723 Pinanna Paradise 4 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15724 Blueberry and Oyster Ice Cream 3 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15725 Squid on a stick 3 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15726 Random Joy Fun Pop 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15727 Berry Joy Fun Pop 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15728 Mocha Joy Fun Pop 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15729 Krakuberry Cove 2 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15730 Forbidden Plunder 3 dubloon

/*               Main Courses                  */
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15731 Baby Bloater 3 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15732 Headless Horsefish 5 dubloons
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15733 Slithering Squid Surprise 3 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15734 Barnacle Bills Belt Busting Burger 4 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15735 Bilge Rat Madeira 4 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15736 Loretta Fontaines Perfect Pizza 5 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15737 Capn Threelegs Cutlass Crusade 9 dubloon
//http://www.neopets.com/pirates/process_restaurant.phtml?type=add&item=15738 Our Famous Krawk Pie 5 dubloon

if(document.URL.indexOf("/pirates/process_restaurant.phtml") != -1) {
	var msg=document.getElementsByClassName("errorMessage")[0].innerHTML.toString().substring(14,100);
	msg2=msg.split('.');
	alert("Error:\n"+msg2[0]+".");
	location.href="/pirates/restaurant.phtml";
}
try{
	var htex=document.getElementsByClassName("content")[0].getElementsByTagName("center")[1];
	var a = document.createElement ('table');
	a.setAttribute('id', 'toEat');
	a.innerHTML   = '<tr><td>Starters: </td><td><select id="starter"><option value="s1">Caesar Salad</option>'+
		'<option value="s1">Tropical Breeze</option>'+
		'<option value="s2">Tomato Cannon Ball</option>'+
		'<option value="s2">Oyster Obsession</option>'+
		'<option value="s3">Shiver Me Shrimp</option>'+
		'<option value="s3">Crusty Clam Surprise</option>'+
		'<option value="s5">Double Stuffed Guppy</option>'+
		'</select></td><td> Value: <span id="Svalue">1 Dubloon(s)</span></td></tr>'+
		'<tr><td>Main Course: </td><td><select id="mainCourse">'+
		'<option value="m3">Baby Bloater</option>'+
		'<option value="m3">Slithering Squid Surprise</option>'+
		'<option value="m4">Barnacle Bills Belt Busting Burger</option>'+
		'<option value="m4">Bilge Rat Madeira</option>'+
		'<option value="m5">Headless Horsefish</option>'+
		'<option value="m5">Loretta Fontaines Perfect Pizza</option>'+
		'<option value="m5">Our Famous Krawk Pie</option>'+
		'<option value="m9">Capn Threelegs Cutlass Crusade</option>'+
		'</select></td><td> Value: <span id="Mvalue">3 Dubloon(s)</span></td></tr>'+
		'<tr><td>Dessert: </td><td><select id="dessert">'+
		'<option value="d2">Random Joy Fun Pop</option>'+
		'<option value="d2">Krakuberry Cove</option>'+
		'<option value="d3">Blueberry and Oyster Ice Cream</option>'+
		'<option value="d3">Squid on a stick</option>'+
		'<option value="d3">Forbidden Plunder</option>'+
		'<option value="d4">Pinanna Paradise</option>'+
		'</select></td><td> Value: <span id="Dvalue">2 Dubloon(s)</span></td></tr>'+
		'<tr><td>Cocktail: </td><td><select id="cocktail"><option value="c2">Grog Light</option>'+
		'<option value="c2">Random Grog</option>'+
		'<option value="c2">Random Pop</option>'+
		'<option value="c2">Man O War</option>'+
		'<option value="c2">Keel Haul</option>'+
		'<option value="c2">Cannon fodder</option>'+
		'<option value="c2">Land Lubber</option>'+
		'<option value="c2">Walk the Plank</option>'+
		'<option value="c10">Hogshead</option>'+
		'</select></td><td> Value: <span id="Cvalue">2 Dubloon(s)</span></td></tr>'+
		'<tr><td/><td/><td><b>Total: <span id="Tot">8 Dubloons</span></b></td></tr>'+
		'<tr><td></td><td><button id="eatButton">Eat all the food!</button></td></tr>'+
		'<td/><td><form><input type="radio" id="leftovers"> Do until Leftovers</input><br>'+
		'<input type="radio" id="ntimes"> Do '+times+' times</input></form></td>';
	htex.appendChild(a);
}catch(e){}

var toAdd="/pirates/process_restaurant.phtml?type=add&item=";
$('[id="starter"]').on('change', function() {
    var sval=$('[id="starter"]').find(":selected").val();
	document.getElementById("Svalue").innerHTML=sval.substring(1,2)+" Dubloon(s)";
	getTotal();
});
$('[id="mainCourse"]').on('change', function() {
    var mval=$('[id="mainCourse"]').find(":selected").val();
	document.getElementById("Mvalue").innerHTML=mval.substring(1,2)+" Dubloon(s)";
	getTotal();
});
$('[id="dessert"]').on('change', function() {
    var dval=$('[id="dessert"]').find(":selected").val();
	document.getElementById("Dvalue").innerHTML=dval.substring(1,2)+" Dubloon(s)";
	getTotal();
});
$('[id="cocktail"]').on('change', function() {
    var cval=$('[id="cocktail"]').find(":selected").val();
	document.getElementById("Cvalue").innerHTML=cval.substring(1,3)+" Dubloon(s)";
	getTotal();
});
$('[id="leftovers"]').on('change', function() {
	if(document.getElementById("leftovers").checked === true){
		document.getElementById("ntimes").checked=false;
	}
});
$('[id="ntimes"]').on('change', function() {
	if(document.getElementById("ntimes").checked === true){
		document.getElementById("leftovers").checked=false;
	}
});
var starter = GM_getValue('starter', 0);
var mainCourse = GM_getValue('mainCourse', 0);
var dessert = GM_getValue('dessert', 0);
var cocktail = GM_getValue('cocktail', 0);
var doUntil = GM_getValue('doUntil', 0);
$('[id="eatButton"]').on('click', function() {
	GM_setValue('mainCourse', $("select[id='mainCourse'] option:selected").index());
	GM_setValue('dessert', $("select[id='dessert'] option:selected").index());
	GM_setValue('cocktail', $("select[id='cocktail'] option:selected").index());
    GM_setValue('starter', $("select[id='starter'] option:selected").index());
	if(document.getElementById("ntimes").checked === true){
		GM_setValue('doUntil', 99);
		GM_setValue('timesEaten', 1);
		addStarter();
	}
	else if(document.getElementById("leftovers").checked === true){
		GM_setValue('doUntil', 13);
		addStarter();
	}else{
		alert("Select an option");
	}
});


if(document.URL.indexOf("neopets.com/pirates/restaurant.phtml?type=eat&off=") != -1) {
	var c=selectedQ();
	mainCourse = GM_getValue('mainCourse', 0);
	dessert = GM_getValue('dessert', 0);
	cocktail = GM_getValue('cocktail', 0);
	if (c==1){
		if (mainCourse===0){//Baby Bloater
			location.href=toAdd+"15731";
		}
		if (mainCourse===1){//Slithering
			location.href=toAdd+"15733";
		}
		if (mainCourse===2){//Barnacle
			location.href=toAdd+"15734";
		}
		if (mainCourse===3){//Bilge Rat
			location.href=toAdd+"15735";
		}
		if (mainCourse===4){//Headless
			location.href=toAdd+"15732";
		}
		if (mainCourse===5){//Loretta
			location.href=toAdd+"15736";
		}
		if (mainCourse===6){//Krawk Pie
			location.href=toAdd+"15738";
		}
		if (mainCourse===7){//Crusade
			location.href=toAdd+"15737";
		}
	}
	if (c==2){
		if (dessert===0){//Random Joy Fun
			location.href=toAdd+"15726";
		}
		if (dessert===1){//Krakuberry
			location.href=toAdd+"15729";
		}
		if (dessert===2){//Blueberry
			location.href=toAdd+"15724";
		}
		if (dessert===3){//Squid
			location.href=toAdd+"15725";
		}
		if (dessert===4){//Forbidden
			location.href=toAdd+"15730";
		}
		if (dessert===5){//Pinnana
			location.href=toAdd+"15723";
		}
	}
	if (c==3){
		if (cocktail===0){//Grog Light
			location.href=toAdd+"15708";
		}
		if (cocktail===1){//Grog
			location.href=toAdd+"15709";
		}
		if (cocktail===2){//pop
			location.href=toAdd+"15713";
		}
		if (cocktail===3){//Man o war
			location.href=toAdd+"15717";
		}
		if (cocktail===4){//Keel
			location.href=toAdd+"15718";
		}
		if (cocktail===5){//Cannon
			location.href=toAdd+"15719";
		}
		if (cocktail===6){//Land Lubber
			location.href=toAdd+"15721";
		}
		if (cocktail===7){//Walk
			location.href=toAdd+"15720";
		}
		if (cocktail===8){//Hogs
			location.href=toAdd+"15722";
		}
	}
	if (c==4){
		$("[value='Eat ALL of the food!']").click();
	}
}

if(document.URL.indexOf("neopets.com/pirates/restaurant.phtml?type=end") != -1) {
	var repeat = GM_getValue('doUntil', 0);
	var fhtex=document.getElementsByClassName("content")[0].innerHTML;
	if(repeat==13&&fhtex.includes("leftovers")){
		alert("You got leftovers!\nScript stopped.");
	}
	if(repeat==13&&fhtex.includes("This meal really filled me up!!!")){
		addStarter();
	}
	if(repeat==99){
		var timesEaten = GM_getValue('timesEaten', 0);
		if(timesEaten<times){
			GM_setValue('timesEaten', timesEaten+1);
			addStarter();
		}else{
			alert(times+" times completed");
		}
	}
	var ehtex=document.getElementsByClassName("content")[0].getElementsByTagName("center")[0];
	var back = document.createElement ('p');
	back.innerHTML   = '<button id="backToRestaurant">Go back to restaurant main page</button>';
	ehtex.appendChild(back);
}
if(document.URL.indexOf("neopets.com/pirates/restaurant.phtml?type=") != -1) {
	$('[id="toEat"]').remove();
}
$('[id="backToRestaurant"]').on('click', function() {
	location.href="/pirates/restaurant.phtml";
});
function addStarter(){
	starter = GM_getValue('starter', 0);
	if (starter===0){
		location.href=toAdd+"15707";
	}
	if (starter===1){
		location.href=toAdd+"15703";
	}
	if (starter===2){
		location.href=toAdd+"15705";
	}
	if (starter===3){
		location.href=toAdd+"15704";
	}
	if (starter===4){
		location.href=toAdd+"15706";
	}
	if (starter===5){
		location.href=toAdd+"15702";
	}
	if (starter===6){
		location.href=toAdd+"15701";
	}
}
function selectedQ(){
	var images=$('table[border="1"][width="400"][cellpadding="3"][cellspacing="0"][align="center"]')[0].innerHTML;
	if(images.includes("images.neopets.com/")){
		var t = images.replace(/\r?\n?/g, "").replace(/\s{2,}/g, " "),cont = new RegExp("images.neopets.com", "gi");
		return t.match(cont).length;
	}else{
		return 0;
	}
}
function getTotal(){
	var sval=parseInt($('[id="starter"]').find(":selected").val().substring(1,2));
	var mval=parseInt($('[id="mainCourse"]').find(":selected").val().substring(1,2));
	var dval=parseInt($('[id="dessert"]').find(":selected").val().substring(1,2));
	var cval=parseInt($('[id="cocktail"]').find(":selected").val().substring(1,3));
	var total=sval+mval+dval+cval;
	document.getElementById("Tot").innerHTML=total+" Dubloons";
}