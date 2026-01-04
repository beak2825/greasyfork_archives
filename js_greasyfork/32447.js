// ==UserScript==
// @name         bittrex markets (HomePage) - Update online 
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  try to take over the world!
// @author       Thai Tran 
// @match        https://bittrex.com/home/markets
// @match        https://bittrex.com/Home/Markets
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32447/bittrex%20markets%20%28HomePage%29%20-%20Update%20online.user.js
// @updateURL https://update.greasyfork.org/scripts/32447/bittrex%20markets%20%28HomePage%29%20-%20Update%20online.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // xpath = //*[@id="home-wrapper"]/div[2]/div/div[1]/table/tbody/tr[1]/td[1]
    // //*[@id="home-wrapper"]/div[2]/div/div[1]/table/tbody/tr[1]/td[1]/a/span
    
    
})();

var firstTime = 0;

var myInt = setInterval(function(){
    //alert('run it');
   /* while  (xp('//*[@id="home-wrapper"]/div[2]/div/div[1]/table/tbody/tr[1]/td[1]/a/span', 2).length<1){
        sleep(500);
    }*/
    
     if (firstTime===0) {
         var objChangeHeader = xp('//*[@id="home-wrapper"]/div[2]/div/div[1]/table/thead/tr/th[4]/div', 8);
         objChangeHeader.click();
         sleep(500);
         objChangeHeader.click();
         sleep(500);
         firstTime=1;
     }
     for (var i=1; i<10; i++){
        
        
        var obj = xp('//*[@id="home-wrapper"]/div[2]/div/div[1]/table/tbody/tr['+i+']/td[1]/a', 8);
                
        //alert('run it '+obj.href);
        if (obj.href.indexOf('Index?')>0){
         obj.setAttribute('href',obj.href.replace('Index?', 'MarketStandardChart?interval=hour&')); clearInterval(myInt);
        }
        
        
        
    }
}, 1000);


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