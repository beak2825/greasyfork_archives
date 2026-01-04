// ==UserScript==
// @name         bittrex BUY SELL Monitoring
// @namespace    http://tampermonkey.net/
// @version      0.23.1
// @description  try to take over the world!
// @author       Thai Tran 
// @match        https://bittrex.com/Market/Index?MarketName=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32467/bittrex%20BUY%20SELL%20Monitoring.user.js
// @updateURL https://update.greasyfork.org/scripts/32467/bittrex%20BUY%20SELL%20Monitoring.meta.js
// ==/UserScript==




var BuyVol, SellVol, buysellPercentPre, buysellPercentCurr;

var BuyArr = [0, 0, 0, 0, 0,0 ];
var SellArr = [0, 0, 0, 0, 0,0 ];
var PercentArr = [0, 0, 0, 0, 0,0 ];
var objOrderBook, objBuy, objSell;
//fruits.push("Kiwi");

var firstTime = 0;

var myInt = setInterval(function(){
    //alert('run it');
   /* while  (xp('//*[@id="home-wrapper"]/div[2]/div/div[1]/table/tbody/tr[1]/td[1]/a/span', 2).length<1){
        sleep(500);
    }*/
    
    BuyVol =  parseFloat(xp('//*[@id="pad-wrapper"]/div[5]/div[1]/table/tbody/tr/td[1]/div', 2).replace(' BTC','')).toFixed(2);
    if (BuyVol<=0) return;
   
    SellVol =  parseFloat(xp('//*[@id="pad-wrapper"]/div[5]/div[2]/table/tbody/tr/td[1]/div', 2).replace(' BTC','')).toFixed(2);
    buysellPercentCurr = (BuyVol*100/SellVol).toFixed(2);
    BuyArr.push(BuyVol);
    SellArr.push(SellVol);
    PercentArr.push(buysellPercentCurr);
    if (BuyArr.length>100){
        BuyArr.splice(0, 1);  SellArr.splice(0, 1); PercentArr.splice(0, 1);
    }
    
   
    
    
     if (firstTime===0) {
         obj = xp('//*[@id="pad-wrapper"]/div[5]/div[1]/table/tbody', 8);
         objBuy = document.createElement("tr");
         obj.appendChild(objBuy);
         
         
         obj = xp('//*[@id="pad-wrapper"]/div[5]/div[2]/table/tbody', 8);
         objSell = document.createElement("tr");
         obj.appendChild(objSell);
         
         
         obj = xp('//*[@id="rowTable"]', 8);
         h6 = document.createElement("div");

         h6.setAttribute("class", "row");
         h6.textContent = "something";
         obj.appendChild(h6);
         objOrderBook = xp('//*[@id="rowTable"]/div[3]', 8);
         
         
         
         
     }
    if (firstTime>6) updateText();
    firstTime++;
     
         
    
    
     //objBuy.append( BuyVol + ", " );
    
    
    //objSell.append( SellVol + ", " );
    //obj.textContent = obj.textContent + ' ('+BuyVol + ', '+SellVol+ ':' +buysellPercentCurr + '%),';
     
}, 1000);

function updateText(){
    var fLen = BuyArr.length;
    var textBUY, textSELL, textPercent;
    
    
    for (i = 1; i < fLen; i++) {
        textBUY +=  BuyArr[i] + " * " ; 
        textSELL +=  SellArr[i] + " * " ;
        textPercent +=  PercentArr[i] + "%, * " ;
        
    }
    
    
    objBuy.textContent = textBUY.replace('undefined','');
    
    objSell.textContent = textSELL.replace('undefined','');
    
    //objOrderBook = xp('//*[@id="rowTable"]/div[3]', 8);
    objOrderBook.textContent = textPercent.replace('undefined','');
    
    var tyle = textPercent[fLen-1]/textPercent[fLen-2];
    if (PercentArr[fLen-2]>0 && PercentArr[fLen-1]/PercentArr[fLen-2]>1.1){
        notifyMe('Cảnh báo %(Buy/Sell) tăng 10%: '+ PercentArr[fLen-1] + '/'+ PercentArr[fLen-2]+ '= '  + PercentArr[fLen-1]/PercentArr[fLen-2]);

    }
    
    
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
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



function notifyMe(mess) {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    
      var url = window.location.href;
      var coin = url.substr(url.indexOf("=")+1);
      mess = coin + ": " + mess;
 

      
    var notification = new Notification('Notification title', {
      icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
      body:mess,
    });

    notification.onclick = function () {
      window.open(url);      
    };

  }

}