// ==UserScript==
// @name         FUCKCHKADBLOCK
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove CHKADBLOCK Window
// @author       FUCKALL
// @match        https://*/*
// @icon         
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464060/FUCKCHKADBLOCK.user.js
// @updateURL https://update.greasyfork.org/scripts/464060/FUCKCHKADBLOCK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("FUCKCHKAdBLOCK--START");
    var chk=false;
    var ele= document.getElementsByClassName("adblock_title")[0];
    // console.log("Find【adblock_title】",ele!=null);
    if(ele!=null){
        var count = 100;
        var tmp=ele;
        while(count-->0&&tmp!=null){
            if(tmp.parentElement!=null){
                if(tmp.parentElement.nodeName =="BODY"){
                    document.body.removeChild(tmp);
                    chk=true;
                    break;
                }else{
                    tmp=tmp.parentElement;
                }
            }
        }
    }
    if(chk){
        console.log("%cFUCKCHKAdBLOCK--SUCCESS","color:green");
    }else{
        console.log("%cFUCKCHKAdBLOCK--FAIL--PATTERN NOT EXIST","color:orange");
    }
    console.log("FUCKCHKAdBLOCK--END");

})();