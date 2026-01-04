// ==UserScript==
// @name         povipic.club-olarixas.xyz Bypass
// @namespace    http://povipic.club/
// @version      0.2
// @description  you do not need to click the button!
// @author       You
// @match        https://povipic.club/*
// @match        https://olarixas.xyz/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406814/povipicclub-olarixasxyz%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/406814/povipicclub-olarixasxyz%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function doItNow (){
         var forms =document.getElementsByTagName('form');
        if(forms&&forms.length==1){
            var formA = forms[0];
            var btns = formA.getElementsByTagName('input');
            if(btns){
             btns[0].click();
            }
            //theDiv.getElementsByTagName("input").click();
        }
    }
   setTimeout(doItNow,200);

})();