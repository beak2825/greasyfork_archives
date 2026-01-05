// ==UserScript==
// @name         Gamdom Automatic Balance Modifier
// @namespace    https://greasyfork.org/scripts/28092-gamdom-automatic-balance-modifier/
// @version      0.2.1
// @description  You can set Limit and it will reset the lower balance to the zero.
// @author       Bazsi15
// @match        https://gamdom.com/roulette
// @match        https://gamdom.com/crash
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28092/Gamdom%20Automatic%20Balance%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/28092/Gamdom%20Automatic%20Balance%20Modifier.meta.js
// ==/UserScript==

(function() {
    var limit=630;
    var modbal,oribal,modified;
    console.log('[Gamdom Automatic Balance Modifier] \n Started!');
    setTimeout(refresh, 2000);
    function refresh() {
    if(document.getElementsByClassName('balance')[1].innerText===0) {
    setTimeout(launcher, 2000);
    }
    else
    {
        oribal=document.getElementsByClassName('balance')[1].innerText;
        setTimeout(launcher, 1);
    }
    }
    function launcher() {
        setInterval(editor, 500);
    }
    function editor() {               
    var balance = document.getElementsByClassName('balance')[1].innerText;                             
        if(oribal===0) {oribal=balance;}
    if(balance>limit) {
        modbal=balance-limit; 
            if(balance!=modbal && modified!=1) {oribal=balance;} if(modbal>=0) {                
                document.getElementsByClassName('balance')[1].innerText=balance-limit; 
                modified=1;
    }} 
        else 
        {         
            if(balance!=modbal) {oribal=balance;}
            modbal=0;
            document.getElementsByClassName('balance')[1].innerText=0;
        }       
        if(modbal<0) {modbal=0;}
    console.log("Balance: " + oribal +"\n"+ "Modified: " + modbal);
    }
})();