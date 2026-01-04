// ==UserScript==
// @name         auto fill
// @namespace    http://tampermonkey.net/
// @version      2
// @description  try to take over the nutn
// @author       TrapKingAstolDicc
// @match        https://academics.nutn.edu.tw/iSTU/T02/SelectCourse.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482879/auto%20fill.user.js
// @updateURL https://update.greasyfork.org/scripts/482879/auto%20fill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var tar = document.getElementById('ctl00_ContentPlaceHolder1_btnCancel');
    if(tar != null){
        tar.click();
    }

    var inp = document.getElementsByTagName('input');
    var td = document.getElementsByTagName('td');
    var count = inp.length;
    if(count<100){
        for(let j = 2; j < 15; j++){
            if(j>=10){
                tar = document.getElementById('ctl00_ContentPlaceHolder1_GridView1_ctl'+j.toString()+'_lnkCh');
            }else{
                tar = document.getElementById('ctl00_ContentPlaceHolder1_GridView1_ctl0'+j.toString()+'_lnkCh');
            }
            if(td[(j-2)*7+236].innerHTML==0){
                tar.click();
            }
        }
    }else{

        for(let i = 11;i < 126; i=i+6){
            inp[i].click();
        }
        var btn = document.getElementById('ctl00_ContentPlaceHolder1_btnSend');
        btn.click();
    }
})();