// ==UserScript==
// @name         CSGOCLICKER HACK - AUTOOPENCASES AND SELL SHITSKINS!
// @namespace    http://Xingy.xyz/
// @version      2
// @description  Makes life ez on csgoclicker.net
// @author       XingyCoderXYZ
// @match        https://csgoclicker.net/caseopener/open/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397206/CSGOCLICKER%20HACK%20-%20AUTOOPENCASES%20AND%20SELL%20SHITSKINS%21.user.js
// @updateURL https://update.greasyfork.org/scripts/397206/CSGOCLICKER%20HACK%20-%20AUTOOPENCASES%20AND%20SELL%20SHITSKINS%21.meta.js
// ==/UserScript==

(function() {
 

//Functions

function sellItem() {
	document.querySelector('.inspectSellItem.btn').click(); 
}

function openCase() {
	document.querySelector('.openCase.btn').click();	
}
function closeSellWindow() {
	document.querySelector('.fas.fa-times').click();	
}

function buyCases(){
	document.querySelector('.buyCase.btn.navy.center').click(); 

}


setTimeout(function(){
    document.querySelector('.sellSwitch').click();
    document.getElementsByClassName('sortOption')[1].click()
    setTimeout(function(){
    var getPriceDiv = document.getElementsByClassName("price"); 

    for (var i = 0; i < 100; i++){
         var price = getPriceDiv[i].textContent.replace('$',''); 
        if (price < 50){
            getPriceDiv[i].click();

        }

    }
    document.querySelector('.sellItemsButton.btn.navy.extra-thin').click();
        },1000);

},5000);








//vars

var valuetokeep = 100.0; //Value of skins to keep, if 100 then sells items under 100 dollars
var wallet = 0; //no need 2 change this.
var minwallet = 100; //Incase the mission scrip has an error, the script will stop running, if u have less then the amount given in ur wallet.

var earn;




setInterval(

function()
{
var getwalletdiv = document.querySelector(".wallet").innerText; 
var walletremove = getwalletdiv.replace(',',''); 
wallet = Number(walletremove);

if(wallet > minwallet)
{
buyCases(); //Buy case
openCase(); //Open case

var getPriceDiv = document.getElementsByClassName("price"); 
var priceTextContent = getPriceDiv[0].textContent; 

var price = priceTextContent.replace('$',''); 

if (price < 999)
{

}
else
{
    price = price.replace(',','');
}

if (price < valuetokeep) //check if the price is less than "Valuetokeep"
{

console.log('%cSell', 'color: red');
console.log("%cPrice on skin: " + priceTextContent, 'color: red');
console.log('----------------------------------------------------');


try {
sellItem(); // sells item
}
catch (error){
}



}
else
{
earn = (earn + Number(price));
console.log("%Dont sell", 'color: green');
console.log("%Price on skin: " + priceTextContent, 'color: green');
console.log("%cTotalt pris på skins under idle: " + earn, 'color: green');
console.log('----------------------------------------------------');

try {
    closeSellWindow();
}
catch (error) {

}




}

}
else
{
    console.warn("No money left $")//do nothing
}


}, 13000);

 setTimeout(function(){
        location.reload();
    },600000);

})();