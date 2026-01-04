// ==UserScript==
// @name         Binance - auto sort - left
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       thaieibvn@gmail.com
// @match        https://www.binance.com/en/trade/*

// @downloadURL https://update.greasyfork.org/scripts/370508/Binance%20-%20auto%20sort%20-%20left.user.js
// @updateURL https://update.greasyfork.org/scripts/370508/Binance%20-%20auto%20sort%20-%20left.meta.js
// ==/UserScript==


var lastprice = 0.000;
var lastpriceAlert;
var timerCheckPrice;
var checkUpDown= "X";

var obj= xp('//*[@id="__next"]/div/main/div[2]/div/div/div[1]/div[2]/div[1]/div/div[3]/div/div[1]/div[1]/div/div[1]/div[4]/div',8);

setTimeout(function(){
    obj.click();
},2000);

setTimeout(function(){
    obj.click();
},5000);



setTimeout(function(){
    var coin, coinText, url;

    for (var i=1; i<=15; i++){
        coin = xp('//*[@id="__next"]/div/main/div[2]/div/div/div[2]/div/div/div[2]/div[1]/div[1]/div/div[2]/div/div['+ i +']/div[2]',8)
       // coinText = xp('//*[@id="__next"]/div/main/div[2]/div/div/div[2]/div/div/div[2]/div[1]/div[1]/div/div[2]/div/div['+ i +']/div[2]',2)


        if (coin){
            coinText = coin.innerHTML;
             url = "https://www.binance.com/en/trade/" + coinText.replace('/','_')
            //alert(i+': ' + coinText)
            var aTag = document.createElement('a');
            aTag.setAttribute('href',url);

            aTag.innerHTML = " .........";
            coin.appendChild(aTag);
        }
        coin = xp('//*[@id="__next"]/div/main/div[2]/div/div/div[3]/div/div/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div['+ i +']/div[2]',8)
        if (coin){
            coinText = coin.innerHTML;
             url = "https://www.binance.com/en/trade/" + coinText.replace('/','_')
            //alert(i+': ' + coinText)
             aTag = document.createElement('a');
            aTag.setAttribute('href',url);

            aTag.innerHTML = " .........";
            coin.appendChild(aTag);
        }
    }
    addTextBoxAlert();

    timerCheckPrice = setInterval(function(){checkPrice();},1000);
},5000);
//setTimeout

var timerObj = setTimeout(function(){

    //var lst = GM_getValue ('lstTopBinance');
    //alert(lst);
    for (var i=1; i<=5; i++){
        var coin = xp('//*[@id="__next"]/div/main/div[2]/div/div/div[1]/div[2]/div[1]/div/div[3]/div/div[1]/div[1]/div/div[2]/div/div['+i+']/a/a/div[2]',8)
        var coinText = xp('//*[@id="__next"]/div/main/div[2]/div/div/div[1]/div[2]/div[1]/div/div[3]/div/div[1]/div[1]/div/div[2]/div/div['+i+']/a/a/div[2]',2)

        //if (lst.indexOf(coinText)!=-1){
            coin.setAttribute('class','s3onj6s-6 bgbVsF');

        //}
    }


}, 5000);

function addTextBoxAlert(){
    var box = xp('//*[@id="__next"]/div/main/div[1]',8);
    var aDiv = document.createElement('div');
    var aBox = document.createElement('input');
            aBox.setAttribute('type','textbox');
    aDiv.appendChild(aBox);
    box.appendChild(aDiv);

}

function checkPrice(){
    var price = xp('//*[@id="__next"]/div/main/div[2]/div/div/div[1]/div[1]/div[2]/div[1]/div[3]/strong/span/span',1);

    var PriceAlertObj = xp('//*[@id="__next"]/div/main/div[1]/div[2]/input',8);
    var PriceAlert = PriceAlertObj.value;
    console.log("Current Price ="+price +', PriceAlert='+PriceAlert);

    if (lastpriceAlert != PriceAlert && PriceAlert>0 ){
        if (checkUpDown.length<=1){
            if (PriceAlert>price ) checkUpDown = 'up';
            else checkUpDown = 'down';
        } else {
            if (checkUpDown == 'up' && price>PriceAlert) {
                alert('Giá Breakout tăng vượt '+PriceAlert +', checkUpDown=' + checkUpDown);
                lastpriceAlert = PriceAlert;
                checkUpDown='X';
            }
            if (checkUpDown == 'down' && price<PriceAlert) {
                alert('Giá Breakout giảm dưới '+PriceAlert +', checkUpDown=' + checkUpDown);
                lastpriceAlert = PriceAlert;
                checkUpDown='X';
            }
        }

    }

}

function xp(exp, t, n) {
    var r = document.evaluate((exp||"//body"),(n||document),null,(t||6),null);
    if(t && t>-1 && t<10) switch(t) {
        case 1: r=r.numberValue; break;
        case 2: r=r.stringValue; break;
        case 3: r=r.booleanValue; break;
        case 8: case 9: r=r.singleNodeValue; break;
    } return r;
}