// ==UserScript==
// @name         Neopets: Kelp
// @namespace    http://clraik.com/forum/showthread.php?62137-Neopets-Kelp
// @version      0.3
// @description  Eats the selected dishes at kelp x times or until leftovers.
// @author       Nyu (clraik)
// @match        *://*.neopets.com/water/restaurant.phtml*
// @match        *://*.neopets.com/water/process_restaurant.phtml*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/33660/Neopets%3A%20Kelp.user.js
// @updateURL https://update.greasyfork.org/scripts/33660/Neopets%3A%20Kelp.meta.js
// ==/UserScript==


var times=1;



/*               APPETISERS                  */
/*

13300  'http://www.neopets.com/water/process_restaurant.phtml?item=28108' Maraquan Cream Broth
15000  'http://www.neopets.com/water/process_restaurant.phtml?item=28131' Kelp Gazpacho
14700  'http://www.neopets.com/water/process_restaurant.phtml?item=28130' Ocean Delight Salad
13400  'http://www.neopets.com/water/process_restaurant.phtml?item=28129' Mixed Green Salad
16300  'http://www.neopets.com/water/process_restaurant.phtml?item=28128' Fresh Oysters
13000  'http://www.neopets.com/water/process_restaurant.phtml?item=28127' Angel Hair Salad
14300  'http://www.neopets.com/water/process_restaurant.phtml?item=28110' Succulent Cheese Dip
13000  'http://www.neopets.com/water/process_restaurant.phtml?item=28103' Tropical Fruit Bowl
15800  'http://www.neopets.com/water/process_restaurant.phtml?item=28126' Pate A La Kelp
*/

/*                Main Courses               */
/*
  'http://www.neopets.com/water/process_restaurant.phtml?item=28112' Filet of Beef
  'http://www.neopets.com/water/process_restaurant.phtml?item=28101' Spicy Radish Salad
  'http://www.neopets.com/water/process_restaurant.phtml?item=28114' Stramberry Sausages
  'http://www.neopets.com/water/process_restaurant.phtml?item=28115' Ocean Platter
  'http://www.neopets.com/water/process_restaurant.phtml?item=28113' Fish Special
  'http://www.neopets.com/water/process_restaurant.phtml?item=28100' Braised Turkey Cutlet
  'http://www.neopets.com/water/process_restaurant.phtml?item=28099' Whole Roast Pheasant
  'http://www.neopets.com/water/process_restaurant.phtml?item=28102' Luxurious Vegetarian Star Pie
*/

/*               Desserts                  */
/*
12100  'http://www.neopets.com/water/process_restaurant.phtml?item=28109' Kelps Signature Ice Cream
12000  'http://www.neopets.com/water/process_restaurant.phtml?item=28111' Honeyed Horn Of Plenty
12200  'http://www.neopets.com/water/process_restaurant.phtml?item=28107' Peachpa and Stramberry Shell
12300  'http://www.neopets.com/water/process_restaurant.phtml?item=28106' Coral Cake
12500  'http://www.neopets.com/water/process_restaurant.phtml?item=28104' Octopi Souffle
12400  'http://www.neopets.com/water/process_restaurant.phtml?item=28105' Triple Chocolate Shell
*/

/*               Cocktails                  */
/*
8000  'http://www.neopets.com/water/process_restaurant.phtml?item=28118' Aged Tchea Juice
9000  'http://www.neopets.com/water/process_restaurant.phtml?item=28125' Funnydew Melon Delight
7000  'http://www.neopets.com/water/process_restaurant.phtml?item=28124' Lemwart Fizz
8000  'http://www.neopets.com/water/process_restaurant.phtml?item=28116' Phear Juice Tonic
9000  'http://www.neopets.com/water/process_restaurant.phtml?item=28122' Twirly Fruit Blend
7000  'http://www.neopets.com/water/process_restaurant.phtml?item=28121' Thornberry Brew
9000  'http://www.neopets.com/water/process_restaurant.phtml?item=28120' Cornupepper Lemonade
9000  'http://www.neopets.com/water/process_restaurant.phtml?item=28119' Seaweed Surprise
9000  'http://www.neopets.com/water/process_restaurant.phtml?item=28117' Foozette Juice
9000  'http://www.neopets.com/water/process_restaurant.phtml?item=28123' Rambus Blend
*/



try{
	var user=document.getElementsByClassName('user medText')[0].children[0].innerHTML.replace("user","");
	$("input[value='Say "+user+".']").click();
}catch(x){}
if(document.URL.indexOf("/water/restaurant.phtml?room=1off=") != -1) {
location.href="restaurant.phtml?type=waitress";
}
if(document.URL.indexOf("/water/process_restaurant.phtml") != -1) {
	var msg=document.getElementsByClassName("errorMessage")[0].innerHTML.toString().substring(14,100);
	msg2=msg.split('.');
	alert("Error:\n"+msg2[0]+".");
	location.href="/water/restaurant.phtml?type=waitress";

}
if(document.URL.indexOf("/water/restaurant.phtml?type=waitress") != -1) {
	try{
		var htex=document.getElementsByClassName("content")[0].getElementsByTagName("center")[1].getElementsByTagName("b")[0];
		var a = document.createElement ('table');
		a.setAttribute('id', 'toEat');
		a.innerHTML   = '<tr><td>Appetisers: </td><td><select id="appetiser"><option value="a13300">Maraquan Cream Broth</option>'+
			'<option value="a15000">Kelp Gazpacho</option>'+
			'<option value="a14700">Ocean Delight Salad</option>'+
			'<option value="a13400">Mixed Green Salad</option>'+
			'<option value="a16300">Fresh Oysters</option>'+
			'<option value="a13000">Angel Hair Salad</option>'+
			'<option value="a14300">Succulent Cheese Dip</option>'+
			'<option value="a15800">Pate A La Kelp</option>'+
			'</select></td><td> Value: <span id="Avalue">13300</span> Neopoints</td></tr>'+
			'<tr><td>Main Course: </td><td><select id="mainCourse">'+
			'<option value="m33000">Filet of Beef</option>'+
			'<option value="m28400">Spicy Radish Salad</option>'+
			'<option value="m31200">Stramberry Sausages</option>'+
			'<option value="m33000">Ocean Platter</option>'+
			'<option value="m32500">Fish Special</option>'+
			'<option value="m29000">Braised Turkey Cutlet</option>'+
			'<option value="m32400">Whole Roast Pheasant</option>'+
			'<option value="m29100">Luxurious Vegetarian Star Pie</option>'+
			'</select></td><td> Value: <span id="Mvalue">33000</span> Neopoints</td></tr>'+
			'<tr><td>Dessert: </td><td><select id="dessert">'+
			'<option value="d12100">Kelps Signature Ice Cream</option>'+
			'<option value="d12000">Honeyed Horn Of Plenty</option>'+
			'<option value="d12200">Peachpa and Stramberry Shell</option>'+
			'<option value="d12300">Coral Cake</option>'+
			'<option value="d12500">Octopi Souffle</option>'+
			'<option value="d12400">Triple Chocolate Shell</option>'+
			'</select></td><td> Value: <span id="Dvalue">12100</span> Neopoints</td></tr>'+
			'<tr><td>Cocktail: </td><td><select id="cocktail"><option value="c8000">Aged Tchea Juice</option>'+
			'<option value="c9000">Funnydew Melon Delight</option>'+
			'<option value="c7000">Lemwart Fizz</option>'+
			'<option value="c8000">Phear Juice Tonic</option>'+
			'<option value="c9000">Twirly Fruit Blend</option>'+
			'<option value="c7000">Thornberry Brew</option>'+
			'<option value="c9000">Cornupepper Lemonade</option>'+
			'<option value="c9000">Seaweed Surprise</option>'+
			'<option value="c9000">Foozette Juice</option>'+
			'<option value="c9000">Rambus Blend</option>'+
			'</select></td><td> Value: <span id="Cvalue">8000 </span> Neopoints</td></tr>'+
			'<tr><td/><td/><td><b>Total: <span id="Tot">66400</span> Neopoints</b></td></tr>'+
			'<tr><td></td><td><button id="eatButton">Eat all the food!</button></td></tr>'+
			'<td/><td><form><input type="radio" id="leftovers"> Do until Leftovers</input><br>'+
			'<input type="radio" id="ntimes"> Do '+times+' times</input></form></td>';
		htex.appendChild(a);
	}catch(e){}
}

var toAdd="/water/process_restaurant.phtml?item=";
$('[id="appetiser"]').on('change', function() {
    var sval=$('[id="appetiser"]').find(":selected").val();
	document.getElementById("Avalue").innerHTML=sval.substring(1,6);
	getTotal();
});
$('[id="mainCourse"]').on('change', function() {
    var mval=$('[id="mainCourse"]').find(":selected").val();
	document.getElementById("Mvalue").innerHTML=mval.substring(1,6)+"";
	getTotal();
});
$('[id="dessert"]').on('change', function() {
    var dval=$('[id="dessert"]').find(":selected").val();
	document.getElementById("Dvalue").innerHTML=dval.substring(1,6)+"";
	getTotal();
});
$('[id="cocktail"]').on('change', function() {
    var cval=$('[id="cocktail"]').find(":selected").val();
	document.getElementById("Cvalue").innerHTML=cval.substring(1,6)+"";
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
var appetiser = GM_getValue('appetiser', 0);
var mainCourse = GM_getValue('mainCourse', 0);
var dessert = GM_getValue('dessert', 0);
var cocktail = GM_getValue('cocktail', 0);
var doUntil = GM_getValue('doUntil', 0);
$('[id="eatButton"]').on('click', function() {
	GM_setValue('mainCourse', $("select[id='mainCourse'] option:selected").index());
	GM_setValue('dessert', $("select[id='dessert'] option:selected").index());
	GM_setValue('cocktail', $("select[id='cocktail'] option:selected").index());
    GM_setValue('appetiser', $("select[id='appetiser'] option:selected").index());
	if(document.getElementById("ntimes").checked === true){
		GM_setValue('doUntil', 99);
		GM_setValue('timesEaten', 1);
		addStarter();
	}
	else if(document.getElementById("leftovers").checked === true){
		GM_setValue('doUntil', 13);
		addStarter();
	}
	else{
		alert("Select an option");
	}
});


if(document.URL.indexOf("neopets.com/water/restaurant.phtml?type=eat&off=") != -1) {
	var c=selectedQ();
	mainCourse = GM_getValue('mainCourse', 0);
	dessert = GM_getValue('dessert', 0);
	cocktail = GM_getValue('cocktail', 0);
	//alert("mainIndex"+mainCourse+" dessertIndex"+dessert+" cocktailIndex"+cocktail);
	if (c==1){
		if (mainCourse===0){//Filet
			location.href=toAdd+"28112";
		}
		if (mainCourse===1){//Spicy Radish
			location.href=toAdd+"28101";
		}
		if (mainCourse===2){//Stramberry
			location.href=toAdd+"28114";
		}
		if (mainCourse===3){//Ocean Platter
			location.href=toAdd+"28115";
		}
		if (mainCourse===4){//Fish Special
			location.href=toAdd+"28113";
		}
		if (mainCourse===5){//Braised Turkey Cutlet
			location.href=toAdd+"28100";
		}
		if (mainCourse===6){//Whole Roast Pheasant
			location.href=toAdd+"28099";
		}
		if (mainCourse===7){//Luxurious Vegetarian Star Pie
			location.href=toAdd+"28102";
		}
	}
	if (c==2){
		if (dessert===0){//Kelps Signature Ice Cream
			location.href=toAdd+"28109";
		}
		if (dessert===1){//Honeyed Horn Of Plenty
			location.href=toAdd+"28111";
		}
		if (dessert===2){//Peachpa and Stramberry Shell
			location.href=toAdd+"28107";
		}
		if (dessert===3){//Coral Cake
			location.href=toAdd+"28106";
		}
		if (dessert===4){//Octopi Souffle
			location.href=toAdd+"28104";
		}
		if (dessert===5){//Triple Chocolate Shell
			location.href=toAdd+"28105";
		}
	}
	if (c==3){
		if (cocktail===0){//Aged Tchea Juice
			location.href=toAdd+"28118";
		}
		if (cocktail===1){//Funnydew Melon Delight
			location.href=toAdd+"28125";
		}
		if (cocktail===2){//Lemwart Fizz
			location.href=toAdd+"28124";
		}
		if (cocktail===3){//Phear Juice Tonic
			location.href=toAdd+"28116";
		}
		if (cocktail===4){//Twirly Fruit Blend
			location.href=toAdd+"28122";
		}
		if (cocktail===5){//Thornberry Brew
			location.href=toAdd+"28121";
		}
		if (cocktail===6){//Cornupepper Lemonade
			location.href=toAdd+"28120";
		}
		if (cocktail===7){//Seaweed Surprise
			location.href=toAdd+"28119";
		}
		if (cocktail===8){//Foozette Juice
			location.href=toAdd+"28117";
		}
		if (cocktail===9){//Rambus Blend
			location.href=toAdd+"28123";
		}
	}
	if (c==4){
		$("[value='Eat your food!']").click();
		//Eat your food!
	}
}

if(document.URL.indexOf("neopets.com/water/restaurant.phtml?type=end") != -1) {
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
$('[id="backToRestaurant"]').on('click', function() {
	location.href="/water/restaurant.phtml?type=waitress";
});
function addStarter(){
	appetiser = GM_getValue('appetiser', 0);
	if (appetiser===0){
		location.href=toAdd+"28108";
	}
	if (appetiser===1){
		location.href=toAdd+"28131";
	}
	if (appetiser===2){
		location.href=toAdd+"28130";
	}
	if (appetiser===3){
		location.href=toAdd+"28129";
	}
	if (appetiser===4){
		location.href=toAdd+"28128";
	}
	if (appetiser===5){
		location.href=toAdd+"28127";
	}
	if (appetiser===6){
		location.href=toAdd+"28110";
	}
	if (appetiser===7){
		location.href=toAdd+"28103";
	}
	if (appetiser===8){
		location.href=toAdd+"28126";
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
	var sval=parseInt($('[id="appetiser"]').find(":selected").val().substring(1,6));
	//alert(sval);
	var mval=parseInt($('[id="mainCourse"]').find(":selected").val().substring(1,6));
	//alert(mval);
	var dval=parseInt($('[id="dessert"]').find(":selected").val().substring(1,6));
	//alert(dval);
	var cval=parseInt($('[id="cocktail"]').find(":selected").val().substring(1,6));
	//alert(cval);
	var total=sval+mval+dval+cval;
	document.getElementById("Tot").innerHTML=total+"";
}
