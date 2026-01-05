// ==UserScript==
// @name         ihatefarmgames
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Unregistered + IvanKalyada
// @match        http://cow-keeper-coin.com/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/20245/ihatefarmgames.user.js
// @updateURL https://update.greasyfork.org/scripts/20245/ihatefarmgames.meta.js
// ==/UserScript==

console.log("ihatefarmgames ready to go, press 1 to start");
alert('Close me and press 1 to start');

//per cow
//FORAGE/HOUR: 8
//WATER/HOUR: 10

var food = 4;
var water = 5;
var cows = 2;

window.addEventListener("keydown", dealWithKeyboard, false);
function dealWithKeyboard(e) {
    if (e.keyCode == "49") { main(); } // key 1
}

setInterval(function(){console.log("2 minutes"); get("http://cow-keeper-coin.com/");}, 2*60*1000); // go to main page every 15 minutes

//setTimeout(main, 1*1000);
function main() {
    runOnce();
//    setTimeout(function(){ setInterval(buyCow1, 2*60*60*1000+35000); }, 1000);
//    setTimeout(function(){ setInterval(buyCow2, 4*60*60*1000+35000); }, 2000);
//    setTimeout(function(){ setInterval(buyCow3, 6*60*60*1000+35000); }, 3000);
//    setTimeout(function(){ setInterval(buyCow4, 8*60*60*1000+35000); }, 4000);
//    setTimeout(function(){ setInterval(buyCow5, 10*60*60*1000+35000); }, 5000);
//    setTimeout(function(){ setInterval(buyCow6, 12*60*60*1000+35000); }, 6000);
    setTimeout(function(){ setInterval(sellMeat, 20*60*1000); }, 7000);
    setTimeout(function(){ setInterval(sellMilk, 20*60*1000); }, 8000);
}

function runOnce() {
//    setTimeout(buyCow1, 1000);
//    setTimeout(buyCow2, 2000);
//    setTimeout(buyCow3, 3000);
//    setTimeout(buyCow4, 4000);
//    setTimeout(buyCow5, 5000);
//    setTimeout(buyCow6, 6000);
    setTimeout(sellMeat, 7000);
    setTimeout(sellMilk, 8000);
}

function buyCow1() {
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/1/cow/1"); }, 3000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/1/cow/2"); }, 6000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/1/cow/3"); }, 9000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/1/cow/4"); }, 12000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/1/cow/5"); }, 15000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/1/cow/6"); }, 18000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/1/cow/7"); }, 21000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/1/cow/8"); }, 24000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/1/cow/9"); }, 27000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/1/cow/10"); }, 30000);
    console.log('cow1');
}

function buyCow2() {
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/2/cow/1"); }, 3000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/2/cow/2"); }, 6000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/2/cow/3"); }, 9000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/2/cow/4"); }, 12000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/2/cow/5"); }, 15000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/2/cow/6"); }, 18000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/2/cow/7"); }, 21000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/2/cow/8"); }, 24000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/2/cow/9"); }, 27000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/2/cow/10"); }, 30000);
    console.log('cow2');
}

function buyCow3() {
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/3/cow/1"); }, 3000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/3/cow/2"); }, 6000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/3/cow/3"); }, 9000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/3/cow/4"); }, 12000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/3/cow/5"); }, 15000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/3/cow/6"); }, 18000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/3/cow/7"); }, 21000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/3/cow/8"); }, 24000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/3/cow/9"); }, 27000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/3/cow/10"); }, 30000);
    console.log('cow3');
}


function buyCow4() {
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/4/cow/1"); }, 3000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/4/cow/2"); }, 6000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/4/cow/3"); }, 9000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/4/cow/4"); }, 12000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/4/cow/5"); }, 15000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/4/cow/6"); }, 18000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/4/cow/7"); }, 21000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/4/cow/8"); }, 24000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/4/cow/9"); }, 27000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/4/cow/10"); }, 30000);
    console.log('cow4');
}


function buyCow5() {
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/5/cow/1"); }, 3000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/5/cow/2"); }, 6000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/5/cow/3"); }, 9000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/5/cow/4"); }, 12000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/5/cow/5"); }, 15000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/5/cow/6"); }, 18000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/5/cow/7"); }, 21000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/5/cow/8"); }, 24000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/5/cow/9"); }, 27000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/5/cow/10"); }, 30000);
    console.log('cow5');
}




function buyCow6() {
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/6/cow/1"); }, 3000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/6/cow/2"); }, 6000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/6/cow/3"); }, 9000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/6/cow/4"); }, 12000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/6/cow/5"); }, 15000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/6/cow/6"); }, 18000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/6/cow/7"); }, 21000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/6/cow/8"); }, 24000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/6/cow/9"); }, 27000);
    setTimeout(function(){ get("http://cow-keeper-coin.com/fold/6/cow/10"); }, 30000);
    console.log('cow6');
}

function sellMeat() {
    get("http://cow-keeper-coin.com/warehouse/sell/meat");
    console.log('meat');
}

function sellMilk() {
    get("http://cow-keeper-coin.com/warehouse/sell/milk");
    console.log('milk');
}

function post(url, data) {
    GM_xmlhttpRequest({
        method: "POST",
        url: url,
        data: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
            //console.log(response.responseText);
        }
    });
}

function get(url) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
            //console.log(response.responseText);
        }
    });
}
