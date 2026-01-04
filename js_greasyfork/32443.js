// ==UserScript==
// @name         bittrex - Change TF=1 hour 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Thai Tran
// @match        https://bittrex.com/market/MarketStandardChart?marketName=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32443/bittrex%20-%20Change%20TF%3D1%20hour.user.js
// @updateURL https://update.greasyfork.org/scripts/32443/bittrex%20-%20Change%20TF%3D1%20hour.meta.js
// ==/UserScript==



setTimeout(function(){
    //alert('run ?');
    changePeriodicity('hour');
    studyDialog(this, 'macd');
    createStudy();
    //STX.DialogManager.dismissDialog();
    setTimeout(function(){
    
    STX.DialogManager.dismissDialog();
}, 100);
    
    studyDialog(this, 'Bollinger Bands');
    createStudy();
    //STX.DialogManager.dismissDialog();
    setTimeout(function(){
    
    STX.DialogManager.dismissDialog();
}, 100);
    
}, 2000);


