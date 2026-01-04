// ==UserScript==
// @name trezor FL
// @version 1
// @namespace dauersendung
// @author dauersendung
// @match https://stake.com/*
// @description send 15 % from profit to tresor
// @description on first load bank is opened
// @description then it should run
// @description trying to make it stealthmode working next step and problem with value entering
// @grant none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at document-start
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/407910/trezor%20FL.user.js
// @updateURL https://update.greasyfork.org/scripts/407910/trezor%20FL.meta.js
// ==/UserScript==


var oldBalacne='';

window.setInterval(function(){
   checkIfBalanceChanged();
}, 10000);
//check newbalance vs old balance

function checkIfBalanceChanged(){
var currentbalance=document.getElementsByClassName('styles__Content-rlm06o-1 ixoRjG');
    if(document.getElementsByClassName('styles__Content-rlm06o-1 ixoRjG').length > 0){

                     currentbalance = document.getElementsByClassName('styles__Content-rlm06o-1 ixoRjG')[0].innerText;
         if(currentbalance != '') {

                            console.log('balance changed');
                            console.log('old balance : ' + oldBalacne);
                            console.log('current balance : ' + currentbalance);
                          if (currentbalance > oldBalacne) {
   prof()
                         }
oldBalacne = currentbalance;
         }
    }
}
function prof(){
      setTimeout(function(){
       document.getElementsByClassName('Link-q08rh0-0 fODGkp')[0].click();//click bank
         },1000);
     setTimeout(function(){
       document.getElementsByClassName('NavLink__StylesNavLink-sc-140hi5a-0 etHlta')[3].click();//klick trezor
},1000);
    var profit = document.getElementsByClassName('styles__Content-rlm06o-1 ixoRjG')[0].innerText /100*15; //var for calc profit to paste
     setTimeout(function(){
       document.getElementsByClassName('styles__InputField-ix7z99-3 gQVvYS')[0].value= Number((profit).toFixed(8)); //paste var profit
          document.getElementsByClassName('styles__InputField-ix7z99-3 gQVvYS')[0].stepUp(1);
             //   document.getElementsByClassName('styles__InputField-ix7z99-3 gQVvYS')[0].value= profit; //betrag einzeben
          },1000);
    setTimeout(function(){
       //var form = document.getElementsByClassName('styles__Form-sc-1sezmlq-1 iXqxlh')[0];
     //   form.submit();
        var element = document.getElementsByClassName('styles__InputField-ix7z99-3 gQVvYS')[0];
        element.stepUp(1);
        element.stepDown(1);
       document.getElementsByClassName('Button__StyledButton-sc-8bd3dp-0 fbjzSA')[0].click(); //einzahlen klicken
          },1000);
}
//trezor part

