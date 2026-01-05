// ==UserScript==
// @name         HACG to Magnet
// @namespace    FireAway
// @version      0.1
// @description  Wow so HACG!
// @author       FireAway
// @match        http://www.hacg.lol/*
// @include      http://www.hacg.*/
// @grant        none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/18003/HACG%20to%20Magnet.user.js
// @updateURL https://update.greasyfork.org/scripts/18003/HACG%20to%20Magnet.meta.js
// ==/UserScript==

window.onload = function(){
    window.addEventListener('copy',function(event){
        var selection = window.getSelection().toString().replace(/-/g,"");
        var clipboardData = event.clipboardData;
        var newData = "";
        if(selection.length=="40"){
            newData = "magnet:?xt=urn:btih:" + selection;
            console.log("Convert TO MAGNET!");
        }else if(selection.length=="8"){
            newData = "http://pan.baidu.com/s/" + selection;
            console.log("Convert TO YUN PAN!");
        }
        if(newData){
            clipboardData.setData("text/plain", newData);
            event.preventDefault();
        }
    }, false);
};