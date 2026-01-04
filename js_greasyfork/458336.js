// ==UserScript==
// @name         Go to market directly
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Go to market from item link
// @author       You
// @match        https://www.torn.com/imarket.php*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at document-end
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/458336/Go%20to%20market%20directly.user.js
// @updateURL https://update.greasyfork.org/scripts/458336/Go%20to%20market%20directly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //let data=""

    function checkData(){
        let data = (document.getElementsByClassName("item-hover")[0])?.href||null;
        console.log(data, typeof(data))
        if (data===null){
            recheckData();
        }
        else{
            openWin(data);
        }


    }




    window.onload=function(){

       checkData();
       
    }



    function openWin(data){
         window.open(data,'_blank');
    }

    function recheckData(){
        setTimeout(function() {
            checkData();
        }, 500);

    }



    // Your code here...
})();